import {S3Client, PutObjectCommand, DeleteObjectCommand} from '@aws-sdk/client-s3';


const s3Client = new S3Client({
    region: process.env.AWS_REGION!,
    credentials:{
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
});



export async function uploadToS3(file: File, key: string){
    const buffer = Buffer.from(await file.arrayBuffer());

    const command = new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET_NAME!,
        Key: key,
        Body: buffer,
        ContentType: file.type,
    });

    try {
        const response = await s3Client.send(command);
        return {
            url: `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`,
            key: key,
            response: response,
        };
    } catch (error) {
        console.error("Error uploading to S3:", error);
        throw error;
    }
    
}

export async function deleteFromS3(key: string) {
    const command = new DeleteObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET_NAME!,
        Key: key,
    });

    try {
        await s3Client.send(command);
    } catch (error) {
        console.error("Error deleting from S3:", error);
        throw error;
    }
}
