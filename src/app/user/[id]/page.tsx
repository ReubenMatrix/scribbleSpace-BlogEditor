'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Author } from '@/lib/types';        
import { Skeleton } from '@/components/ui/skeleton';
import { useUser } from '@clerk/nextjs';      

export default function Page() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user } = useUser();             
  const [author, setAuthor] = useState<Author | null>(null);
  const [posts, setPosts] = useState<Author['blogPosts']>([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const res = await fetch(`/api/author/${id}`);
        const data = await res.json();
        setAuthor(data);
        setPosts(data.blogPosts ?? []);
      } catch (err) {
        console.error('Failed to fetch author data:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);


  const handleDelete = async (postId: string) => {
    try {
      const res = await fetch(`/api/delete/${postId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Deletion failed');
      setPosts((prev) => prev.filter((p) => p.id !== postId)); 
    } catch (err) {
      console.error(err);
      alert('Could not delete post.');
    }
  };


  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-12 space-y-6">
   
        <div className="flex items-center gap-4">
          <Skeleton className="w-16 h-16 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
      
        {Array.from({ length: 2 }).map((_, i) => (
          <div
            key={i}
            className="p-4 border-2 border-gray-200 rounded-md flex items-center justify-between"
          >
            <div className="space-y-2 w-full">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-3 w-1/3" />
            </div>
            <Skeleton className="w-[150px] h-[100px] rounded-md ml-4" />
          </div>
        ))}
      </div>
    );
  }

  if (!author) {
    return <p className="p-8 text-center text-red-500">User not found</p>;
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
  
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center text-xl font-bold text-white">
            {author.name?.[0]?.toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-semibold">{author.name}</h1>
            <p className="text-gray-500 text-sm">{author.email}</p>
          </div>
        </div>
        <div>{posts.length} Published Articles</div>
      </div>

      <hr className="my-6 border-gray-300" />


      <h2 className="text-xl font-semibold mb-6">Posts by {author.name}</h2>

      {posts.length === 0 ? (
        <p className="text-gray-500">This author hasn’t published any posts yet.</p>
      ) : (
        posts.map((post) => {
          const isAuthor = user?.id === post.authorId; 
          return (
            <div
              key={post.id}
              onClick={() => router.push(`/read/${post.slug}`)}
              className="group relative p-4 flex items-center justify-between border-2 cursor-pointer border-black rounded-md hover:shadow-sm transition-shadow mb-4"
            >
             
              <div>
                <h3 className="text-lg font-medium">{post.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{post.description}</p>
                <p className="text-xs text-gray-400 mt-2">
                  Published on {new Date(post.createdAt).toLocaleDateString()}
                </p>
              </div>

          
              {post.imageUrl && (
                <Image
                  src={post.imageUrl}
                  alt={post.title}
                  width={150}
                  height={100}
                  className="object-cover rounded-md ml-4 shrink-0"
                />
              )}

           
              {isAuthor && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(post.id);
                  }}
                  title="Delete post"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 text-white rounded-full p-1 leading-none"
                >
                  ✕
                </button>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}


