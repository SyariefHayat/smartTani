import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { env } from '../config/env';

class S3Manager {
  private static instance: S3Client;

  public static getInstance(): S3Client {
    if (!S3Manager.instance) {
      S3Manager.instance = new S3Client({
        region: env.AWS_REGION,
        credentials: {
          accessKeyId: env.AWS_ACCESS_KEY_ID,
          secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
        },
        // If using Minio for development
        endpoint: process.env.AWS_ENDPOINT || undefined,
        forcePathStyle: !!process.env.AWS_ENDPOINT,
      });
    }
    return S3Manager.instance;
  }

  public static async uploadFile(
    fileBuffer: Buffer,
    key: string,
    contentType: string
  ): Promise<string> {
    const client = this.getInstance();
    const command = new PutObjectCommand({
      Bucket: env.AWS_BUCKET_NAME,
      Key: key,
      Body: fileBuffer,
      ContentType: contentType,
    });

    await client.send(command);

    // Construct public URL
    // For real S3: https://{bucket}.s3.{region}.amazonaws.com/{key}
    // For Minio/Local testing, it might be different, but let's use a standard pattern
    if (process.env.AWS_ENDPOINT) {
      return `${process.env.AWS_ENDPOINT}/${env.AWS_BUCKET_NAME}/${key}`;
    }
    return `https://${env.AWS_BUCKET_NAME}.s3.${env.AWS_REGION}.amazonaws.com/${key}`;
  }
}

export default S3Manager;
