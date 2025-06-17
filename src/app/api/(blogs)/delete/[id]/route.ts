import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';      
import { auth } from '@clerk/nextjs/server';

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {

  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }


  const post = await prisma.blogPost.findUnique({
    where: { id: params.id },
    select: { authorId: true },
  });

  if (!post) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  
  if (post.authorId !== userId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }


  await prisma.blogPost.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
