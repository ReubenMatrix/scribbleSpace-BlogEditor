'use client'

import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import React, { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useBlogStore } from '@/store/useBlogStore'
import { useRouter } from 'next/navigation'

function Page() {
  const {
    title,
    description,
    thumbnail,
    thumbnailPreview,
    setTitle,
    setDescription,
    setThumbnail,
    content,
    images,
    reset,
  } = useBlogStore()

  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const preview = URL.createObjectURL(file)
      setThumbnail(file, preview)
    }
  }

  const handlePublish = async () => {
    try {
      setLoading(true)

      let thumbnailUrl = ''
      let thumbnailKey = ''

  
      if (thumbnail) {
        const formData = new FormData()
        formData.append('file', thumbnail)

        const res = await fetch('/api/blog-thumbnail', {
          method: 'POST',
          body: formData,
        })

        if (!res.ok) throw new Error('Thumbnail upload failed')

        const data = await res.json()
        thumbnailUrl = data.url
        thumbnailKey = data.key
      }

    
      const blogRes = await fetch('/api/publish-blog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
          content,
          thumbnailUrl,
          thumbnailKey,
          images, 
        }),
      })

      if (!blogRes.ok) throw new Error('Failed to publish blog')

      
      reset()
      router.push('/') 
    } catch (err) {
      console.error(err)
      alert('Something went wrong while publishing.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col border-2 border-black rounded-md space-y-6 p-6 w-full max-w-xl">
        <div className="flex items-center justify-between gap-2">
          <ArrowLeft className="cursor-pointer" />
          <h1 className="text-xl font-serif">Publish Post</h1>
        </div>

        <div className="space-y-1">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            placeholder="Enter blog title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="Write a short description..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="thumbnail">Thumbnail</Label>
          <Input
            id="thumbnail"
            type="file"
            accept="image/*"
            onChange={handleThumbnailChange}
          />
          {thumbnailPreview && (
            <img
              src={thumbnailPreview}
              alt="Thumbnail Preview"
              className="mt-2 w-64 rounded-md border shadow"
            />
          )}
        </div>

        <Button onClick={handlePublish} disabled={loading}>
          {loading ? 'Publishing...' : 'Publish'}
        </Button>
      </div>
    </div>
  )
}

export default Page
