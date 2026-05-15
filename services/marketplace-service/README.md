# Marketplace Service

Microservice for product listing, category management, and inventory in the SmartTani platform.

## Features

- Product CRUD (listing, update, delete)
- Category management
- Inventory/Stock management (reduce/restore stock)
- Product image upload (S3 compatible)
- Product search and filtering
- Farmer-specific product listings

## Tech Stack

- Node.js (Express)
- TypeScript
- Mongoose (MongoDB)
- Redis (Caching)
- RabbitMQ (Event publishing/consuming)
- AWS S3 (Image storage)
- Sharp (Image processing)
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
3. Update `.env` with your local MongoDB, Redis, and S3 configuration.

## Scripts

- `npm run dev`: Start development server
- `npm run build`: Compile TypeScript
- `npm start`: Run production build
- `npm test`: Run tests

## API Documentation

When the service is running, access the Swagger UI at:
`http://localhost:3002/api-docs`
