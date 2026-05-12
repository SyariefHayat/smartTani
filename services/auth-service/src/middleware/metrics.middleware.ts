import { Request, Response, NextFunction } from 'express';
import { httpRequestsTotal, httpRequestDuration } from '../lib/metrics';

/**
 * Middleware to track HTTP request metrics for Prometheus
 */
export const metricsMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const start = process.hrtime();

  res.on('finish', () => {
    const duration = process.hrtime(start);
    const durationSeconds = duration[0] + duration[1] / 1e9;
    const path = req.route ? req.baseUrl + req.route.path : req.originalUrl;
    const status = res.statusCode.toString();
    const method = req.method;

    // Increment request counter
    httpRequestsTotal.labels(method, path, status).inc();

    // Observe request duration
    httpRequestDuration.labels(method, path, status).observe(durationSeconds);
  });

  next();
};
