'use client'

import React from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

type Props = {
  slug: string
  title: string
  description: string
  imageUrl: string
  createdAt: string
}

function PostCard({ slug, title, description, imageUrl, createdAt }: Props) {
  const router = useRouter();

  return (
    <div className="
      flex 
      w-[300px] h-[130px] 
      sm:w-[250px] sm:h-[100px] 
      border-2 border-black 
      rounded-md overflow-hidden mb-4
      cursor-pointer
    "
    
    >
      {/* Image Section */}
      <div className="relative w-1/2 h-full">
        <Image
          src={imageUrl}
          alt="Post Image"
          fill
          className="object-cover"
        />
      </div>

      {/* Content Section */}
      <div className="flex flex-col w-1/2 p-2" onClick={() => router.push(`/read/${slug}`)}>
        <p className="text-base sm:text-sm font-semibold">{title}</p>
        <p className="text-xs text-gray-500 truncate">{description}</p>
        <span className="text-[10px] text-gray-400 mt-auto">
          {new Date(createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  )
}

export default PostCard
