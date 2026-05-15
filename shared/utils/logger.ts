/**
 * Simple Logger utility
 * In production, this can be replaced with Winston or Bunyan
 */
export const logger = {
  info: (message: string, ...args: any[]) => {
    if (process.env.NODE_ENV !== 'test') {
      console.log(`[INFO] ${new Date().toISOString()} - ${message}`, ...args);
    }
  },
  error: (message: string, ...args: any[]) => {
    if (process.env.NODE_ENV !== 'test') {
      console.error(`[ERROR] ${new Date().toISOString()} - ${message}`, ...args);
    }
  },
  warn: (message: string, ...args: any[]) => {
    if (process.env.NODE_ENV !== 'test') {
      console.warn(`[WARN] ${new Date().toISOString()} - ${message}`, ...args);
    }
  },
  debug: (message: string, ...args: any[]) => {
    if (process.env.NODE_ENV === 'development') {
      console.debug(`[DEBUG] ${new Date().toISOString()} - ${message}`, ...args);
    }
  },
};
