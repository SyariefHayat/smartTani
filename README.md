# SmartTani Platform

SmartTani is a multi-sided agricultural marketplace that connects Farmers, Buyers, Investors, Distributors, Logistics, and Admins. Built using a microservices architecture for scalability and reliability.

## Architecture Overview

The platform consists of several specialized microservices communicating via events and REST:

- **API Gateway (Port 3000)**: Entry point, auth verification, and request routing.
- **Auth Service (Port 3001)**: User management, authentication, and profiles.
- **Marketplace Service (Port 3002)**: Product listings, inventory, and categories.
- **Order Service (Port 3003)**: Cart management, order processing, and Midtrans payments.
- **Investment Service (Port 3004)**: Crowdfunding proposals and investor tracking.
- **Logistics Service (Port 3005)**: Shipment tracking and delivery management.
- **Notification Service (Port 3006)**: Email and push notification delivery.
- **Analytics Service (Port 3007)**: Data aggregation and business intelligence.

### Infrastructure

- **Databases**: PostgreSQL (Prisma), MongoDB (Mongoose).
- **Messaging**: RabbitMQ for asynchronous event-driven communication.
- **Caching & Sessions**: Redis for session storage, caching, and distributed locks.
- **Object Storage**: AWS S3 (or compatible like Minio) for product images.
- **Monitoring**: Prometheus and Grafana for metrics and dashboarding.

## Local Setup

### Prerequisites

- Node.js 24+
- Docker & Docker Compose
- npm

### 1. Start Infrastructure

Run the infrastructure services (DBs, MQ, Redis, etc.) using Docker Compose:

```bash
docker-compose up -d
```

### 2. Environment Configuration

Each service requires a `.env` file. You can use the provided root `.env.example` as a template or set up each service individually using their respective `README.md` files.

### 3. Install Dependencies

Install all dependencies for the monorepo:

```bash
npm install
```

### 4. Database Initialization

Run Prisma migrations for PostgreSQL services:

```bash
# Auth Service
cd services/auth-service && npx prisma db push

# Order Service
cd ../order-service && npx prisma db push

# Investment Service
cd ../investment-service && npx prisma db push
```

### 5. Running Services

You can run all services simultaneously for development:

```bash
# From root
./start_services.sh
```

Or run a specific service:

```bash
cd services/[service-name]
npm run dev
```

## Testing & Demos

### E2E Demo Simulation

We provide a comprehensive E2E simulation script that demonstrates the full platform flow (Registration -> Listing -> Order -> Payment -> Logistics -> Investment -> Analytics):

```bash
./run_e2e_demo.sh
```

### Load Testing

Performance tests can be run using Artillery:

```bash
npx artillery run load-test-products.yml
npx artillery run load-test-login.yml
```

## Documentation

- **API Reference**: Swagger UI is available at `http://localhost:3000/api-docs` when the API Gateway is running.
- **Security Audit**: See the security checklist in the project documentation for production readiness details.
- **Developer Guidelines**: See `GEMINI.md` for coding standards and conventions.
