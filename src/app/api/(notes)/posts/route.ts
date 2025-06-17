import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { uploadToS3 } from "@/lib/awsS3";
import { currentUser } from "@clerk/nextjs/server";
import { nanoid } from "nanoid";



export async function GET(request: NextRequest) {
        try {
        const posts = await prisma.post.findMany({
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            },
            take: 20 
        });

      
        return NextResponse.json(posts);
    } catch (error) {
        console.error("Error fetching posts:", error);
        return NextResponse.json(
            { error: "Failed to fetch posts" },
            { status: 500 }
        );
    }

}




export async function POST(request: NextRequest) {
    try {
        const user = await currentUser();
        
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const formData = await request.formData();
        const text = formData.get("text") as string;
        const image = formData.get("image") as File | null;

        if (!text) {
            return NextResponse.json({ error: "Text is required" }, { status: 400 });
        }


        const dbUser = await prisma.user.findUnique({
            where: { id: user.id }
        });

        if (!dbUser) {
            return NextResponse.json({ 
                error: "User not found in database. Please sync your account." 
            }, { status: 404 });
        }

        let imageUrl: string | null = null;
        let imageKey: string | null = null;

        if (image && image.size > 0) {
            
            const ext = image.name.split('.').pop()?.toLowerCase() || 'jpg'; // Default to jpg if no extension
            const key = `blog-images/${nanoid()}.${ext}`;

            const uploadResult = await uploadToS3(image, key);
            imageUrl = uploadResult.url;
            imageKey = uploadResult.key;
        }

        const post = await prisma.post.create({
            data: {
                content: text,
                imageUrl,
                imageKey,
                authorId: user.id,
            },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    }
                }
            }
        });

        return NextResponse.json(post, { status: 201 });
    }
    catch (error) {
        console.error("Error creating post:", error)
        return NextResponse.json({
            error: "Failed to create post"
        }, { status: 500 })
    }
}