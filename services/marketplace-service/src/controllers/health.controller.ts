import { Request, Response } from 'express';
import mongoose from 'mongoose';
import RedisClient from '../lib/redis';
import S3Manager from '../lib/s3';
import { ListBucketsCommand } from '@aws-sdk/client-s3';

export const getHealth = async (req: Request, res: Response) => {
  const dependencies = {
    mongodb: 'error',
    redis: 'error',
    s3: 'error',
  };

  try {
    // Check MongoDB
    if (mongoose.connection.readyState === 1) {
      dependencies.mongodb = 'ok';
    }
  } catch (error) {
    console.error('❌ Health check failed for MongoDB:', error);
  }

  try {
    // Check Redis
    await RedisClient.getInstance().ping();
    dependencies.redis = 'ok';
  } catch (error) {
    console.error('❌ Health check failed for Redis:', error);
  }

  try {
    // Check S3
    const s3 = S3Manager.getInstance();
    await s3.send(new ListBucketsCommand({}));
    dependencies.s3 = 'ok';
  } catch (error) {
    console.error('❌ Health check failed for S3:', error);
  }

  const isHealthy = Object.values(dependencies).every((status) => status === 'ok');

  const response = {
    status: isHealthy ? 'ok' : 'error',
    service: 'marketplace-service',
    timestamp: new Date().toISOString(),
    dependencies,
  };

  if (!isHealthy) {
    return res.status(503).json(response);
  }

  return res.json(response);
};
