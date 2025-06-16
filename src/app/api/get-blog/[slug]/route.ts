import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';


export async function GET(
  _req: NextRequest,
  { params }: { params: { slug: string } | Promise<{ slug: string }> }
) {

  const { slug } = await params;

  try {
    const blog = await prisma.blogPost.findUnique({
      where: { slug },
      include: {
        images: true,
        author: { select: { name: true } },
      },
    });

    if (!blog) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }

    const transformedBlog = {
      ...blog,
      author: blog.author ? { username: blog.author.name } : null,
      likes: blog.likes ?? 0,
      dislikes: blog.dislikes ?? 0,
    };

    return NextResponse.json(transformedBlog);
  } catch (err) {
    console.error('Error fetching blog:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
