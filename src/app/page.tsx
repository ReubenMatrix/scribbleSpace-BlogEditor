"use client"

import Image from "next/image";
import Sidebar from "@/components/sidebar/Sidebar";
import { Input } from "@/components/ui/input";
import PostCard from "@/components/postcard/PostCard";
import { UserButton, useUser } from '@clerk/nextjs';
import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import NoteList from "@/components/note/NoteList";
import { Post } from "@/lib/types";
import { BlogPost } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";


export default function Home() {
  const router = useRouter();
  const { isLoaded, isSignedIn, user } = useUser();
  const [isUserSynced, setIsUserSynced] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [blogs, setBlogs] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);

  useEffect(() => {
    const syncUser = async () => {

      if (!isLoaded || !isSignedIn || !user || isUserSynced) return;

      try {
        const response = await fetch('/api/users/sync', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to sync user');
        }

        const data = await response.json();
        console.log('User synced:', data.user);
        setIsUserSynced(true);


        sessionStorage.setItem('user_synced', 'true');
      } catch (error) {
        console.error('Error syncing user:', error);
      }
    };


    const alreadySynced = sessionStorage.getItem('user_synced');
    if (alreadySynced === 'true') {
      setIsUserSynced(true);
    } else {
      syncUser();
    }
  }, [isLoaded, isSignedIn, user, isUserSynced]);



  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoadingPosts(true);
        const response = await fetch('/api/get-blogs');

        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }

        const data = await response.json();
        setBlogs(data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setIsLoadingPosts(false);
      }
    };

    if (isUserSynced) {
      fetchPosts();
    }
  }, [isUserSynced]);


  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch('/api/posts')
        const data = await res.json()
        setPosts(data)
      } catch (error) {
        console.error('Error fetching posts:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])


  return (
    <div className="p-1 overflow-hidden min-h-screen">
      <div className="flex min-h-screen overflow-hidden border-2 border-black rounded-md p-2">
        <div className="hidden lg:block w-1/16 p-3">
          <Sidebar />
        </div>

        <div className="flex-1 bg-white p-3 overflow-hidden items-center flex flex-col w-full">
          <div className="flex justify-between items-center border-black w-full border-2 p-2 rounded-md">
            <h1 className="text-xl font-serif">Home</h1>
            <Input type="text" placeholder="Search..." className="w-1/3 border-2 border-black" />
            <UserButton />
          </div>

          <div className="flex flex-row justify-between overflow-x-auto p-4 w-full rounded-md overflow-hidden mt-2 gap-x-4">
            <div className="flex flex-row items-center gap-x-3">
              {isLoadingPosts || blogs.length === 0 ? (

                Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex flex-col items-start gap-y-2 w-[220px]"
                  >
                    <Skeleton className="h-32 w-full rounded-md" />

                  </div>
                ))
              ) : (
                blogs.map((blog) => (
                  <PostCard
                    key={blog.id}
                    slug={blog.slug}
                    title={blog.title}
                    description={blog.description}
                    imageUrl={blog.imageUrl}
                    createdAt={blog.createdAt}
                  />
                ))
              )}
            </div>

            <div className="flex items-center">
              <ChevronRight />
            </div>
          </div>

          <div
            className="flex items-center justify-center mt-4 p-4 border-2 w-[600px] border-black rounded-md bg-gray-100 cursor-pointer hover:bg-gray-200 transition-colors"
            onClick={() => router.push('/create')}
          >
            <p className="text-md font-semibold">Want to share something?</p>
          </div>


          <div className="flex-1 overflow-y-hidden mt-6 w-full h-full max-w-[600px] mx-auto">
            <h2 className="text-lg font-semibold mb-4 border-b border-gray-400">Recent Posts</h2>
            <NoteList posts={posts} isLoading={isLoadingPosts} />
          </div>
        </div>

      </div>
    </div>
  );
}