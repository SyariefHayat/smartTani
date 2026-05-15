# API Gateway

The entry point for the SmartTani platform, responsible for request routing, authentication, and cross-cutting concerns.

## Features

- Request routing (Proxying to microservices)
- Centralized Authentication (JWT validation)
- Distributed Tracing (Correlation ID)
- Request Logging
- Rate Limiting
- CORS Management
- Swagger UI (Aggregated documentation)

## Tech Stack

- Node.js (Express)
- TypeScript
- http-proxy-middleware
- Redis (Rate limiting)
- RabbitMQ (System monitoring)
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
3. Update `.env` with your JWT secret and downstream service URLs.

## Scripts

- `npm run dev`: Start development server
- `npm run build`: Compile TypeScript
- `npm start`: Run production build

## API Documentation

The Gateway aggregates Swagger UI for all services. When running, access it at:
`http://localhost:3000/api-docs`
