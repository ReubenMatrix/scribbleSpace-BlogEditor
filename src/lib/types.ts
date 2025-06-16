import { LucideIcon } from "lucide-react";
import { type Editor } from '@tiptap/react';

interface Post {
  id: string;
  content: string;
  imageUrl: string | null;
  createdAt: string;
  author: {
    id: string;
    name: string | null;
    email: string;
  };
}

interface NoteListProps {
  posts: Post[];
  isLoading: boolean;
}
export type { NoteListProps };

interface PostsListProps {
  posts: Array<{
    id: string;
    content: string;
    imageUrl: string | null;
    createdAt: string;
    author: {
      id: string;
      name: string | null;
      email: string;
    };
  }>;
  isLoading: boolean;
}

export type { Post };


interface ToolbarButtonProps {
    onClick: () => void;
    isActive?: boolean;
    icon: LucideIcon;
}

export type { ToolbarButtonProps};


interface EditorState {
  editor: Editor | null;
  setEditor: (editor: Editor | null) => void;
}
export type { EditorState };


interface BlogState {
  content: string 
  images: File[]
  title: string
  description: string
  thumbnail: File | null
  thumbnailPreview: string | null
  setContent: (content: string) => void
  setImages: (images: File[]) => void
  setTitle: (title: string) => void
  setDescription: (description: string) => void
  setThumbnail: (file: File | null, preview: string | null) => void
  reset: () => void
}
export type { BlogState };



type BlogPost = {
  id: string;
  slug: string;
  title: string;
  description: string;
  content: string;
  imageUrl: string;
  createdAt: string;
  author?: { username: string };
  likes?: number;
  dislikes?: number;
  authorId?: string;
}
export type { BlogPost };



type Author = {
  id: string;
  name: string;
  email: string;
  blogPosts: BlogPost[];
};
export type { Author };