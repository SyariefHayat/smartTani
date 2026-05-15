# Notification Service

Microservice for email and push notifications in the SmartTani platform.

## Features

- Real-time notification delivery via RabbitMQ events
- Email notifications (via external provider)
- Push notifications (via Firebase Cloud Messaging)
- Notification templating

## Tech Stack

- Node.js (Express)
- TypeScript
- Redis (Idempotency check)
- RabbitMQ (Event consuming)
- Firebase Admin SDK
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
3. Update `.env` with your local Redis and Firebase configuration.

## Scripts

- `npm run dev`: Start development server
- `npm run build`: Compile TypeScript to JavaScript
- `npm start`: Run production build
