# Order Service

Microservice for shopping cart, order processing, and payment integration in the SmartTani platform.

## Features

- Shopping cart management (Redis-backed)
- Order creation and lifecycle management
- Midtrans payment gateway integration
- Automated payment timeout (BullMQ)
- Order status history tracking
- Farmer/Buyer specific order views

## Tech Stack

- Node.js (Express)
- TypeScript
- Prisma (PostgreSQL)
- Redis (Cart storage & Queues)
- BullMQ (Background jobs)
- RabbitMQ (Event publishing/consuming)
- Midtrans SDK (Payments)
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
3. Update `.env` with your local PostgreSQL, Redis, and Midtrans configuration.
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
`http://localhost:3003/api-docs`
