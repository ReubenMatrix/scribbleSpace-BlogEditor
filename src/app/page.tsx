"use client";

import Image from "next/image";
import Sidebar from "@/components/sidebar/Sidebar";
import { Input } from "@/components/ui/input";
import PostCard from "@/components/postcard/PostCard";
import { UserButton, useUser } from "@clerk/nextjs";
import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import NoteList from "@/components/note/NoteList";
import { Post, BlogPost } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import Genre from "@/components/Genre/Genre";

export default function Home() {
  const router = useRouter();
  const { isLoaded, isSignedIn, user } = useUser();

  const [isUserSynced, setIsUserSynced] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [loadingNotes, setLoadingNotes] = useState(true);

 
  useEffect(() => {
    const syncUser = async () => {
      if (!isLoaded || !isSignedIn || !user || isUserSynced) return;
      try {
        const res = await fetch("/api/users/sync", { method: "POST" });
        if (!res.ok) throw new Error("Failed to sync user");
        setIsUserSynced(true);
        sessionStorage.setItem("user_synced", "true");
      } catch (err) {
        console.error(err);
      }
    };

    if (sessionStorage.getItem("user_synced") === "true") {
      setIsUserSynced(true);
    } else {
      syncUser();
    }
  }, [isLoaded, isSignedIn, user, isUserSynced]);

  
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoadingPosts(true);
        const res = await fetch("/api/get-blogs");
        if (!res.ok) throw new Error("Failed to fetch blogs");
        const data = await res.json();
        setBlogs(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingPosts(false);
      }
    };
    if (isUserSynced) fetchBlogs();
  }, [isUserSynced]);

  
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch("/api/posts");
        const data = await res.json();
        setPosts(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingNotes(false);
      }
    };
    fetchPosts();
  }, []);


  const [startIndex, setStartIndex] = useState(0);
  const visibleBlogs = blogs.slice(startIndex, startIndex + 5);

  const handleNext = () => {
    if (startIndex + 5 < blogs.length) setStartIndex((prev) => prev + 1);
  };


  useEffect(() => {
    if (startIndex + 5 > blogs.length && startIndex !== 0) {
      setStartIndex(Math.max(0, blogs.length - 5));
    }
  }, [blogs.length, startIndex]);

  return (
    <div className="p-1 overflow-hidden min-h-screen">
      <div className="flex min-h-screen overflow-hidden border-2 border-black rounded-md p-2">
        
        <div className="hidden lg:block w-1/16 p-3">
          <Sidebar />
        </div>

        <div className="flex-1 bg-white p-3 overflow-hidden items-center flex flex-col w-full">
       
          <div className="flex justify-between items-center border-black w-full border-2 p-2 rounded-md">
            <h1 className="text-xl font-serif">Home</h1>
            <Input
              type="text"
              placeholder="Search..."
              className="w-1/3 border-2 border-black"
            />
            <UserButton />
          </div>

       
          <div className="flex flex-col items-center mt-4 w-full">
            <Genre />
          </div>

        
          <div className="flex flex-row justify-between items-center w-full overflow-hidden p-4 mt-2 gap-x-4 rounded-md">
           
            <div className="flex flex-row items-center gap-x-3">
              {loadingPosts || visibleBlogs.length === 0
                ? Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      className="flex flex-col items-start gap-y-2 w-[220px]"
                    >
                      <Skeleton className="h-32 w-full rounded-md" />
                    </div>
                  ))
                : visibleBlogs.map((blog) => (
                    <PostCard
                      key={blog.id}
                      slug={blog.slug}
                      title={blog.title}
                      description={blog.description}
                      imageUrl={blog.imageUrl}
                      createdAt={blog.createdAt}
                    />
                  ))}
            </div>

         
            <ChevronRight
              onClick={handleNext}
              className={`shrink-0 cursor-pointer transition-opacity ${
                startIndex + 5 >= blogs.length
                  ? "opacity-30 pointer-events-none"
                  : "hover:opacity-70"
              }`}
              size={28}
            />
          </div>

          
          <div
            className="flex items-center justify-center mt-4 p-4 border-2 w-[600px] border-black rounded-md bg-gray-100 cursor-pointer hover:bg-gray-200 transition-colors"
            onClick={() => router.push("/create")}
          >
            <p className="text-md font-semibold">Want to share something?</p>
          </div>

       
          <div className="flex-1 overflow-y-hidden mt-6 w-full h-full max-w-[600px] mx-auto">
            <h2 className="text-lg font-semibold mb-4 border-b border-gray-400">
              Recent Posts
            </h2>
            <NoteList posts={posts} isLoading={loadingNotes} />
          </div>
        </div>
      </div>
    </div>
  );
}
