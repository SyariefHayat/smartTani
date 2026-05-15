# Analytics Service

Microservice for data aggregation and business intelligence in the SmartTani platform.

## Features

- Real-time data aggregation via events
- Order analytics (GMV, volume, daily sales)
- User growth tracking
- Investment disbursement analytics
- Admin dashboard overview data
- Personal analytics for farmers and investors

## Tech Stack

- Node.js (Express)
- TypeScript
- Prisma (PostgreSQL)
- Redis (Caching)
- RabbitMQ (Event consuming)
- Zod (Validation)

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create `.env` file from `.env.example`:
   ```bash
   cp .env.example .env
   ```
3. Update `.env` with your local PostgreSQL and Redis configuration.
4. Push database schema:
   ```bash
   npx prisma db push
   ```

## Scripts

- `npm run dev`: Start development server
- `npm run build`: Compile TypeScript
- `npm start`: Run production build
- `npm test`: Run tests

## API Documentation

When the service is running, access the Swagger UI at:
`http://localhost:3007/api-docs`
