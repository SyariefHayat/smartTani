# Logistics Service

Microservice for shipment tracking and logistics management in the SmartTani platform.

## Features

- Automatic shipment creation on order payment
- Shipment status tracking (PICKUP, IN_TRANSIT, DELIVERED, etc.)
- Shipment status history
- Logistic-specific shipment management

## Tech Stack

- Node.js (Express)
- TypeScript
- Mongoose (MongoDB)
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
3. Update `.env` with your local MongoDB configuration.

## Scripts

- `npm run dev`: Start development server
- `npm run build`: Compile TypeScript
- `npm start`: Run production build

## API Documentation

When the service is running, access the Swagger UI at:
`http://localhost:3005/api-docs`
