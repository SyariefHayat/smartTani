# SmartTani Platform

SmartTani is a multi-sided agricultural marketplace that connects Farmers, Buyers, Investors, Distributors, Logistics, and Admins. Built using a microservices architecture for scalability and reliability.

---

## 🚀 Getting Started for Collaborators

Welcome! We are excited to have you join the SmartTani project. This guide will help you set up your local environment and understand our development workflow.

### 📋 Prerequisites

- **Node.js**: v24.15.0 LTS (Mandatory)
- **Docker & Docker Compose**: For running infrastructure services.
- **Git**: For version control.
- **npm**: v10+

### 🛠️ Local Setup

1. **Clone the Repository**

   ```bash
   git clone https://github.com/your-org/smarttani-q1.git
   cd smarttani-q1
   ```

2. **Setup Infrastructure**
   Start the shared services (PostgreSQL, MongoDB, Redis, RabbitMQ, MinIO):

   ```bash
   docker-compose up -d
   ```

3. **Install Dependencies**
   Install all root and workspace dependencies:

   ```bash
   npm install
   ```

4. **Environment Variables**
   - Copy `.env.example` to `.env` in each service directory under `services/`.
   - Copy `frontend/web/.env.example` to `frontend/web/.env.local`.
   - Update the variables with your local configuration.

5. **Initialize Databases**
   Push the schema to your local PostgreSQL instance for relevant services:

   ```bash
   # From root
   npm run db:push
   ```

6. **Start Development Servers**
   Run all backend services in development mode:
   ```bash
   ./start_services.sh
   ```
   Start the frontend:
   ```bash
   cd frontend/web
   npm run dev
   ```

---

## 🏗️ Architecture & Tech Stack

### Microservices

- **API Gateway (3000)**: Entry point, auth verification, routing.
- **Auth Service (3001)**: IAM, profiles, sessions.
- **Marketplace Service (3002)**: Products, categories, inventory.
- **Order Service (3003)**: Transactions, cart, payment integration.
- **Investment Service (3004)**: Crowdfunding, proposal lifecycle.
- **Logistics Service (3005)**: Tracking, couriers, shipping.
- **Notification Service (3006)**: Email, SMS, Push.
- **Analytics Service (3007)**: Business intelligence, reporting.

### Tech Stack

| Tier           | Technology                                |
| -------------- | ----------------------------------------- |
| **Backend**    | Node.js + Express + TypeScript            |
| **Frontend**   | Next.js 16 (App Router) + Tailwind CSS v4 |
| **Database**   | Prisma (PostgreSQL), Mongoose (MongoDB)   |
| **Messaging**  | RabbitMQ                                  |
| **Caching**    | Redis                                     |
| **UI Library** | shadcn/ui                                 |
| **Validation** | Zod                                       |

---

## 📜 Development Rules & Standards

To maintain code quality and system integrity, all collaborators **must** adhere to the guidelines in [GEMINI.md](./GEMINI.md). Key rules include:

1. **Coding Style**: Kebab-case folders, PascalCase components, camelCase files/hooks.
2. **Type Safety**: No `any` types. Use explicit interfaces.
3. **Validation**: All API inputs must be validated using Zod schemas.
4. **Commits**: Use conventional commits (e.g., `feat:`, `fix:`, `chore:`, `refactor:`).
5. **Quality**: Ensure `npm run lint` and `tsc` pass before submitting a PR.

---

## 🤝 How to Contribute

1. **Pick a Task**: Refer to `SmartTani_Q1_Microtasks.md` for active tasks.
2. **Create a Branch**: `git checkout -b task/TASK-ID-short-description`
3. **Implement & Test**: Write your code and ensure related tests pass.
4. **Self-Audit**: Run the security audit check to ensure no credentials are leaked.
5. **Push & PR**: Push your branch and open a Pull Request against `main`.

---

## 🧪 Testing & Verification

### End-to-End Simulation

Test the entire business flow (Register -> Order -> Payment -> Logistics):

```bash
./run_e2e_demo.sh
```

### System Health Check

Verify if all services and infrastructure are correctly configured:

```bash
npm run check:system
```

---

## 📄 Documentation

- **Postman Collection**: Found in `docs/SmartTani.postman_collection.json`.
- **Product Requirement (PRD)**: Read `docs/SmartTani_PRD_Developer_Q1.md`.
- **API Docs**: Available at `http://localhost:3000/api-docs` during runtime.

---

Built with ❤️ by the SmartTani Engineering Team.
