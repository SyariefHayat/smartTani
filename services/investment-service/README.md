# Investment Service

Microservice for crowdfunding proposals and investment tracking in the SmartTani platform.

## Features

- Agricultural proposal creation (Farmers)
- Proposal verification and approval (Admin)
- Investment processing (Investors)
- Investment tracking and returns management
- Proposal lifecycle management

## Tech Stack

- Node.js (Express)
- TypeScript
- Prisma (PostgreSQL)
- Redis (Caching)
- RabbitMQ (Event publishing)
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
`http://localhost:3004/api-docs`
