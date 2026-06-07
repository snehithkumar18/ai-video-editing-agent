import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import fs from 'fs';
import path from 'path';

const isR2Configured = !!(
  process.env.CLOUDFLARE_R2_ENDPOINT &&
  process.env.CLOUDFLARE_R2_ACCESS_KEY_ID &&
  process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY
);

const s3Client = isR2Configured
  ? new S3Client({
      region: 'auto',
      endpoint: process.env.CLOUDFLARE_R2_ENDPOINT!,
      credentials: {
        accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID!,
        secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY!,
      },
    })
  : null;

const BUCKET_NAME = process.env.CLOUDFLARE_R2_BUCKET_NAME || 'ai-video-assets';
const PUBLIC_DOMAIN = process.env.CLOUDFLARE_R2_PUBLIC_DOMAIN || `https://pub-your-id.r2.dev`;

export async function uploadBuffer(buffer: Buffer, key: string, contentType: string): Promise<string> {
  if (isR2Configured && s3Client) {
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    });

    await s3Client.send(command);
    return `${PUBLIC_DOMAIN}/${key}`;
  } else {
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    const safeKey = key.replace(/\//g, '-');
    const filePath = path.join(uploadDir, safeKey);
    fs.writeFileSync(filePath, buffer);
    return `/uploads/${safeKey}`;
  }
}

export async function uploadFromUrl(sourceUrl: string, key: string, contentType: string): Promise<string> {
  const response = await fetch(sourceUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch from ${sourceUrl}`);
  }
  
  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  
  return uploadBuffer(buffer, key, contentType);
}

export async function deleteFile(key: string): Promise<void> {
  if (isR2Configured && s3Client) {
    const command = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    await s3Client.send(command);
  } else {
    const safeKey = key.replace(/\//g, '-');
    const filePath = path.join(process.cwd(), 'public', 'uploads', safeKey);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
}

export function generateKey(folder: string, userId: string, filename: string): string {
  const safeFilename = filename.replace(/[^a-zA-Z0-9.-]/g, '_');
  return `${folder}/${userId}/${Date.now()}-${safeFilename}`;
}

