# Auth Service

Microservice for user authentication, registration, and profile management in the SmartTani platform.

## Features

- User registration (Petani, Buyer, Investor, Distributor, Logistik, Admin)
- Email verification
- Login with JWT (Access Token & Refresh Token)
- Refresh token rotation
- Profile management
- Admin user status management (verification, suspension)

## Tech Stack

- Node.js (Express)
- TypeScript
- Prisma (PostgreSQL)
- Redis (Session storage)
- RabbitMQ (Event publishing)
- Bcrypt (Password hashing)
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

- `npm run dev`: Start development server with ts-node-dev
- `npm run build`: Compile TypeScript to JavaScript
- `npm start`: Run the compiled production build
- `npm test`: Run Jest tests
- `npm run test:watch`: Run tests in watch mode
- `npm run test:coverage`: Run tests and generate coverage report

## API Documentation

When the service is running, access the Swagger UI at:
`http://localhost:3001/api-docs`
