'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { convertHtmlToReact } from '@hedgedoc/html-to-react';
import { ThumbsUp, Share, MessageCircle, ThumbsDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Skeleton } from "@/components/ui/skeleton"; 
import { BlogPost } from '@/lib/types';

export default function BlogReaderPage() {
  const { slug } = useParams<{ slug: string }>();
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  const router = useRouter();

  useEffect(() => {
    if (!slug) return;

    (async () => {
      try {
        setError(null);
        const res = await fetch(`/api/get-blog/${slug}`);
        if (!res.ok) throw new Error('Failed to fetch blog');
        const data = await res.json();
        setBlog(data);
      } catch (err) {
        console.error(err);
        setError('Failed to load blog post');
      } finally {
        setLoading(false);
      }
    })();
  }, [slug]);

  const html = blog?.content || '';
  console.log("HTML content:", html);

  if (loading) {
  return (
    <div className="max-w-3xl mx-auto p-6 space-y-4">
      <Skeleton className="h-10 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <div className="flex flex-col gap-2 mt-4">
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-4 w-1/3" />
      </div>
      <Skeleton className="h-[300px] w-full rounded-md mt-6" />
      <div className="space-y-2 mt-6">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  );
}

  if (error) return <p className="p-4 text-center text-red-600">{error}</p>;
  if (!blog) return <p className="p-4 text-center">Blog not found.</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2 font-serif">{blog.title}</h1>
      <p className="font-medium font-serif text-md text-gray-600">{blog.description}</p>

      <div className="flex flex-col items-start my-4 p-2 border-y-2 border-black text-sm text-gray-600">

        {blog.author && (
          <span onClick={() => router.push(`/user/${blog?.authorId}`)} className="cursor-pointer">
            By <span className="font-semibold">{blog.author.username}</span>
          </span>
        )}
        <span>{new Date(blog.createdAt).toLocaleString()}</span>
      </div>

      {blog.imageUrl && (
        <div className="relative w-full h-[300px] border-black border-2 rounded-md mb-6">
          <Image
            src={blog.imageUrl}
            alt={blog.title}
            fill
            className="object-cover rounded-md p-1"
          />
        </div>
      )}

      <div className="blog-content font-sans">{convertHtmlToReact(html)}</div>


      <div className="w-full border-y-2 flex items-center justify-between border-black p-1">

        <div className="flex flex-row gap-x-2 items-center">
          <ThumbsUp className="size-5" />
          <span className="text-md font-semibold">{blog.likes || 0}</span>
        </div>

        <Share className="size-5"/>

        <MessageCircle className="size-5" />

        <div className="flex flex-row items-center gap-x-2">
          <ThumbsDown  className='size-5'/>
          <span className="text-md font-semibold">{blog.dislikes || 0}</span>
        </div>

      </div>

    </div>
  );
}
