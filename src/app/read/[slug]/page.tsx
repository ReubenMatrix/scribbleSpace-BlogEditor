'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { convertHtmlToReact } from '@hedgedoc/html-to-react';
import { ThumbsUp, Share, MessageCircle, ThumbsDown, Volume2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Skeleton } from "@/components/ui/skeleton"; 
import { BlogPost } from '@/lib/types';
import ProgressBar from '@/components/progressBar/ProgressBar';


export default function BlogReaderPage() {
  const { slug } = useParams<{ slug: string }>();
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

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

    const handleTextToSpeech = async () => {
    if (!blog?.content) return;

    if (isPlaying && audio) {
      audio.pause();
      setIsPlaying(false);
      return;
    }

    try {

      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = blog.content;
      const plainText = tempDiv.textContent || tempDiv.innerText;

      const response = await fetch('/api/text-to-speech', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: plainText })
      });

      if (!response.ok) throw new Error('Failed to generate audio');

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      const newAudio = new Audio(audioUrl);
      newAudio.onended = () => {
        setIsPlaying(false);
        URL.revokeObjectURL(audioUrl);
      };

      setAudio(newAudio);
      await newAudio.play();
      setIsPlaying(true);

    } catch (err) {
      console.error('Error:', err);
    }
  };



  const html = blog?.content || '';

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

      <div className="flex flex-row items-center justify-between border-y-2 p-1 my-3 border-black">
        <div className="flex flex-col items-start text-sm text-gray-600">
          {blog.author && (
            <span onClick={() => router.push(`/user/${blog?.authorId}`)} className="cursor-pointer">
              By <span className="font-semibold">{blog.author.username}</span>
            </span>
          )}
          <span>{new Date(blog.createdAt).toLocaleString()}</span>
        </div>

        <div 
          className={`cursor-pointer ${isPlaying ? 'text-blue-500' : ''}`}
          onClick={handleTextToSpeech}
        >
          <Volume2 />
        </div>
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

            <ProgressBar 
        audio={audio} 
        isPlaying={isPlaying} 
      />

      <div className="w-full border-y-2 flex items-center justify-between border-black p-1">
        <div className="flex flex-row gap-x-2 items-center">
          <ThumbsUp className="size-5" />
          <span className="text-md font-semibold">{blog.likes || 0}</span>
        </div>

        <Share className="size-5"/>

        <MessageCircle className="size-5" />

        <div className="flex flex-row items-center gap-x-2">
          <ThumbsDown className='size-5'/>
          <span className="text-md font-semibold">{blog.dislikes || 0}</span>
        </div>
      </div>
    </div>
  );
}



