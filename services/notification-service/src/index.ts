import './config/env';
import { env } from './config/env';

console.log(`notification-service is running on port ${env.PORT} in ${env.NODE_ENV} mode`);
