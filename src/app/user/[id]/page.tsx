'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Author } from '@/lib/types';
import { Skeleton } from "@/components/ui/skeleton"; 

export default function Page() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [author, setAuthor] = useState<Author | null>(null);
  const [loading, setLoading] = useState(true);

   useEffect(() => {
    const fetchAuthor = async () => {
      if (!id) return;
      try {
        const res = await fetch(`/api/author/${id}`);
        const data = await res.json();
        setAuthor(data);
        console.log('Fetched author data:', data);
      } catch (err) {
        console.error('Failed to fetch author data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAuthor(); 
  }, [id]);

  if(loading){
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

      {/* Post preview skeletons */}
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

  }
  if (!author) return <p className="p-8 text-center text-red-500">User not found</p>;

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">

      <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
 
        <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center text-xl font-bold text-white">
          {author.name?.charAt(0).toUpperCase()}
        </div>
        <div>
          <h1 className="text-2xl font-semibold">{author.name}</h1>
          <p className="text-gray-500 text-sm">{author.email}</p>
        </div>
      </div>

      <div>
        {author.blogPosts.length} Published Articles
      </div>
      </div>

      <hr className="my-6 border-gray-300" />

      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Posts by {author.name}</h2>

        {author.blogPosts.length === 0 ? (
          <p className="text-gray-500">This author hasn’t published any posts yet.</p>
        ) : (
          author.blogPosts.map((post) => (
            console.log('Post:', post),
            <div
              key={post.id}
              onClick={() => router.push(`/read/${post.slug}`)}
              className="p-4 flex flex-row items-center justify-between border-2 cursor-pointer border-black rounded-md hover:shadow-sm transition-shadow"
            >
              <div>
              <h3 className="text-lg font-medium">{post.title}</h3>
              <p className="text-sm text-gray-600 mt-1">{post.description}</p>
              <p className="text-xs text-gray-400 mt-2">
                Published on {new Date(post.createdAt).toLocaleDateString()}
              </p>
              </div>

              <div>
                <Image
                src={post.imageUrl}
                alt={post.title}
                width={150}
                height={100}
                className="object-cover rounded-md ml-4"
                />


              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
