import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import { prisma } from "@/lib/prisma";
import { v4 as uuidv4 } from 'uuid'
import slugify from 'slugify'

export async function POST(req: NextRequest) {
  try {
    const user = await currentUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const { title, description, content, thumbnailUrl, thumbnailKey, images } = body

    const slug = slugify(title, { lower: true }) + '-' + uuidv4().slice(0, 6)

    const blog = await prisma.blogPost.create({
      data: {
        title,
        description,
        content,
        slug,
        imageUrl: thumbnailUrl || null,
        imageKey: thumbnailKey || null,
        author: { connect: { id: user.id } },
        images: {
          createMany: {
            data: (images || []).map((img: { url: string; key: string }) => ({
              url: img.url,
              key: img.key,
            })),
          },
        },
      },
    })

    return NextResponse.json({ success: true, blog })
  } catch (error) {
    console.error('[BLOG_CREATE_ERROR]', error)
    return NextResponse.json({ error: 'Failed to publish blog' }, { status: 500 })
  }
}
