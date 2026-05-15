import { logger } from '../../../../shared/utils/logger';
import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import RedisClient from '../lib/redis';

export const getHealth = async (req: Request, res: Response) => {
  const dependencies = {
    postgres: 'error',
    redis: 'error',
  };

  let isHealthy = true;

  try {
    // Check Postgres
    await prisma.$queryRaw`SELECT 1`;
    dependencies.postgres = 'ok';
  } catch (error) {
    isHealthy = false;
    logger.error('❌ Health check failed for Postgres:', error);
  }

  try {
    // Check Redis
    const redis = RedisClient.getInstance();
    await redis.ping();
    dependencies.redis = 'ok';
  } catch (error) {
    isHealthy = false;
    logger.error('❌ Health check failed for Redis:', error);
  }

  const response = {
    status: isHealthy ? 'ok' : 'error',
    service: 'auth-service',
    timestamp: new Date().toISOString(),
    dependencies,
  };

  if (!isHealthy) {
    return res.status(503).json(response);
  }

  return res.json(response);
};
