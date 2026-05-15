import { logger } from '../../../../shared/utils/logger';
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import RedisClient from '../lib/redis';

const prisma = new PrismaClient();

export const getHealth = async (req: Request, res: Response) => {
  const dependencies = {
    postgres: 'error',
    redis: 'error',
  };

  try {
    await prisma.$queryRaw`SELECT 1`;
    dependencies.postgres = 'ok';
  } catch (error) {
    logger.error('❌ Health check failed for Postgres:', error);
  }

  try {
    await RedisClient.getInstance().ping();
    dependencies.redis = 'ok';
  } catch (error) {
    logger.error('❌ Health check failed for Redis:', error);
  }

  const isHealthy = Object.values(dependencies).every((status) => status === 'ok');

  const response = {
    status: isHealthy ? 'ok' : 'error',
    service: 'order-service',
    timestamp: new Date().toISOString(),
    dependencies,
  };

  if (!isHealthy) {
    return res.status(503).json(response);
  }

  return res.json(response);
};
