// components/note/Note.tsx

import Image from "next/image";
import { Post } from "@/lib/types"; // Import from your types file

interface NoteProps {
  post: Post;
}

export default function Note({ post }: NoteProps) {
  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return "Just now";
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else if (diffInHours < 48) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className="border-2 border-black rounded-md p-4 h-full overflow-hidden bg-white hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
            <span className="text-xs font-semibold text-gray-600">
              {(post.author.name || post.author.email).charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <p className="font-semibold text-sm">
              {post.author.name || post.author.email.split('@')[0]}
            </p>
            <p className="text-xs text-gray-500">
              {formatDate(post.createdAt)}
            </p>
          </div>
        </div>
      </div>
      
      <div className="mb-3">
        <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
          {post.content}
        </p>
      </div>
      
      {post.imageUrl && (
        <div className="relative w-full h-64 bg-gray-100 rounded-md overflow-hidden mb-3">
          <Image
            src={post.imageUrl}
            alt="Post image"
            fill
            className="object-cover"
            sizes="(max-width: 600px) 100vw, 600px"
          />
        </div>
      )}
    </div>
  );
}