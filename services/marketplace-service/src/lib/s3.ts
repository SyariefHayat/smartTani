import { S3Client } from '@aws-sdk/client-s3';
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
}

export default S3Manager;
