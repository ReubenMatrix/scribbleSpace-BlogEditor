// components/post/PostsList.tsx

import Note from "./Note";



export default function NoteList({ posts, isLoading }: PostsListProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        <span className="ml-2 text-gray-600">Loading posts...</span>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <svg 
          className="mx-auto h-12 w-12 text-gray-400 mb-4" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M7 8h10m0 0V6a2 2 0 00-2-2H9a2 2 0 00-2 2v2m10 0v10a2 2 0 01-2 2H9a2 2 0 01-2-2V8m10 0H7" 
          />
        </svg>
        <p className="text-lg font-medium">No posts yet</p>
        <p className="text-sm">Be the first to share something with the community!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-6">
      {posts.map((post) => (
        <Note key={post.id} post={post} />
      ))}
    </div>
  );
}