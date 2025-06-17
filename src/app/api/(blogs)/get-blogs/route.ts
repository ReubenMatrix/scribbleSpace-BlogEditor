
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; 

export async function GET() {
  try {
    const posts = await prisma.blogPost.findMany({
      include: {
        images: true,
        author: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const formatted = posts.map((post) => ({
      id: post.id,
      slug: post.slug,
      title: post.title,
      description: post.description,
      imageUrl: post.imageUrl || '',
      createdAt: post.createdAt,
      authorName: post.author.name || 'Anonymous',
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}
