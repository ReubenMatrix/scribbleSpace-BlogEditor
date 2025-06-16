import { BlogState } from '@/lib/types';
import { create } from 'zustand';


export const useBlogStore = create<BlogState>((set) => ({
  content: '',
  images: [],
  title: '',
  description: '',
  thumbnail: null,
  thumbnailPreview: null,

  setContent: (content) => set({ content }),
  setImages: (images) => set({ images }),
  setTitle: (title) => set({ title }),
  setDescription: (description) => set({ description }),

  setThumbnail: (file, preview) =>
    set({
      thumbnail: file,
      thumbnailPreview: preview,
    }),

  reset: () =>
    set({
      content: '',
      images: [],
      title: '',
      description: '',
      thumbnail: null,
      thumbnailPreview: null,
    }),
}))
