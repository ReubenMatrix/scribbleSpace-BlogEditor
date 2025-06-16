'use client'

import { UserButton } from '@clerk/nextjs'
import React from 'react'
import { Button } from '../ui/button'
import { useParams, useRouter } from 'next/navigation'

type Props = {}

function EditorNav({}: Props) {
  const router = useRouter()
  const params = useParams()

  const postId = params.id as string 

  return (
    <div className='w-full flex flex-row items-center justify-between p-5 border-b border-gray-200'>
      <div>
        <UserButton />
      </div>

      <div>
        <Button onClick={() => router.push(`/post/${postId}/publish`)}>
          Continue
        </Button>
      </div>
    </div>
  )
}

export default EditorNav
