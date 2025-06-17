
import { NextResponse } from 'next/server'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { nanoid } from 'nanoid'

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
})

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File

    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'Invalid file' }, { status: 400 })
    }

    const ext = file.name.split('.').pop()
    const key = `blog-images/${nanoid()}.${ext}`
    const buffer = Buffer.from(await file.arrayBuffer())

    await s3.send(
      new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET_NAME!,
        Key: key,
        Body: buffer,
        ContentType: file.type,
      }),
    )

    const url = `https://${process.env.AWS_S3_BUCKET_NAME!}.s3.${process.env.AWS_REGION!}.amazonaws.com/${key}`

    return NextResponse.json({ url, key })
  } catch (error) {
    console.error('Image upload error:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
