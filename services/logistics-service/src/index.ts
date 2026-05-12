import './config/env';
import { env } from './config/env';

console.log(`logistics-service is running on port ${env.PORT} in ${env.NODE_ENV} mode`);
