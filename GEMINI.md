# SmartTani Q1 — Project Context for AI Assistants

## 1. Project Overview

SmartTani is an **agricultural platform** connecting farmers, buyers, investors, distributors, logistics, and academy (students/instructors) in one ecosystem. It uses a **microservices** backend + **Next.js** frontend.

### Roles (8 total)

| Role               | DB Value      | Dashboard Route          | Description                            |
| ------------------ | ------------- | ------------------------ | -------------------------------------- |
| Petani (Farmer)    | `petani`      | `/dashboard/farmer`      | Manages products, orders, finance      |
| Buyer              | `buyer`       | `/dashboard/buyer`       | Purchases products, tracks orders      |
| Investor           | `investor`    | `/dashboard/investor`    | Invests in farming proposals           |
| Distributor        | `distributor` | `/dashboard/distributor` | Bulk B2B purchases, inventory tracking |
| Logistik (Courier) | `logistik`    | `/dashboard/logistik`    | Shipment pickup, transit, delivery     |
| Siswa (Student)    | `siswa`       | `/dashboard/siswa`       | Enrolls in academy courses             |
| Instruktur         | `instruktur`  | `/dashboard/instruktur`  | Creates & manages academy courses      |
| Admin              | `admin`       | `/admin`                 | Platform-wide oversight                |

---

## 2. Tech Stack

### Frontend (`frontend/web/`)

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **UI Components:** shadcn/ui (Radix-based)
- **State:** Zustand (auth store)
- **Data Fetching:** TanStack React Query v5 + Axios
- **Forms:** React Hook Form + Zod v4
- **Charts:** Recharts v3
- **Icons:** Lucide React
- **Toasts:** Sonner

### Backend (`services/`)

- **Runtime:** Node.js + Express + TypeScript
- **Databases:** PostgreSQL (Prisma ORM) for auth, order, investment, analytics — MongoDB (Mongoose) for marketplace, logistics
- **Messaging:** RabbitMQ (event-driven)
- **Cache:** Redis
- **Auth:** JWT (access + refresh tokens)
- **Validation:** Zod
- **API Gateway:** Port :3000 (proxies to all services)

---

## 3. Architecture

### Backend Services

```
services/
├── api-gateway/           → Port :3000 — routes all requests
├── auth-service/          → Port :3001 — register, login, JWT, user CRUD
├── marketplace-service/   → Port :3002 — products, categories (MongoDB)
├── order-service/         → Port :3003 — cart, orders, checkout (PostgreSQL)
├── investment-service/    → Port :3004 — proposals, investments (PostgreSQL)
├── logistics-service/     → Port :3005 — shipments lifecycle (MongoDB)
├── notification-service/  → Port :3006 — email/push (RabbitMQ consumer)
├── analytics-service/     → Port :3007 — aggregated analytics
└── academy-service/       → Port :3008 — courses, enrollment, certificates (BARU - belum ada)
```

### Backend Pattern (per service)

```
src/
├── index.ts              → Express app setup, server start
├── config/               → env, database config
├── controllers/          → Request handlers
├── services/             → Business logic
├── repositories/         → Data access layer (Prisma/Mongoose)
├── routes/               → Express router + middleware
├── schemas/              → Zod validation schemas
├── middleware/            → auth, authorize, error handler
├── models/               → Mongoose models (MongoDB services only)
├── events/               → RabbitMQ publisher/consumer
├── lib/                  → prisma client, broker, utils
└── index.test.ts         → Test file
```

### Frontend Structure

```
frontend/web/
├── app/
│   ├── (landing)/        → Public pages (homepage, about, products, etc.)
│   ├── (dashboard)/      → Dashboard pages per role (/dashboard/farmer, /dashboard/buyer, etc.)
│   └── (admin)/          → Admin pages (/admin/*)
├── components/
│   ├── ui/               → shadcn base components (Button, Card, Dialog, etc.)
│   ├── sections/         → Page sections (landing pages, dashboard sections)
│   │   ├── home/         → Homepage sections
│   │   ├── dashboard/    → Shared dashboard components (sidebar, header)
│   │   ├── academy/      → Academy landing sections
│   │   └── ...
│   ├── features/         → API-integrated feature components
│   │   ├── admin/        → Admin dashboard components
│   │   ├── marketplace/  → Product listing, detail
│   │   ├── order/        → Order management
│   │   └── ...
│   └── layouts/          → Navbar, Footer
├── services/             → API service layer (axios calls)
├── stores/               → Zustand stores
├── lib/                  → api.ts (axios instance), utils, auth helpers
├── constants/            → Hardcoded data (landing pages)
├── context/              → React context providers
└── hooks/                → Custom hooks
```

---

## 4. Key Patterns & Conventions

### Frontend Service Layer Pattern

Semua API calls HARUS melalui service layer di `services/*.ts`. Jangan panggil `api.get()` langsung dari komponen.

```typescript
// services/marketplace.ts
import api from '@/lib/api';

export interface Product { ... }

export const marketplaceService = {
  getProducts: async (params) => {
    const response = await api.get('/products', { params });
    return response.data;
  },
  getProductById: async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },
};
```

### Data Fetching Pattern (Dashboard Pages)

Gunakan **TanStack React Query** untuk semua data fetching di dashboard pages. JANGAN pakai `useState + useEffect` pattern.

```typescript
'use client';

import { useQuery } from '@tanstack/react-query';
import { marketplaceService } from '@/services/marketplace';

export default function ProductsPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['products', { page, status }],
    queryFn: () => marketplaceService.getProducts({ page, status }),
  });

  if (isLoading) return <Skeleton />;
  if (error) return <ErrorState />;
  return <ProductTable data={data} />;
}
```

### Auth Pattern

```typescript
// Mengambil user dari Zustand store
import { useAuthStore } from '@/stores/auth';
const user = useAuthStore((s) => s.user);

// Atau dari localStorage helper
import { getStoredAuthUser } from '@/lib/auth-storage';
const user = getStoredAuthUser();
```

### API Client (`lib/api.ts`)

- Base URL: `NEXT_PUBLIC_API_URL` (default `http://localhost:3000` → gateway)
- Auto-inject JWT token from Zustand store
- Auto-refresh token on 401
- Auto-redirect to `/login` on refresh failure

### Backend Auth Middleware Pattern

```typescript
// routes/example.routes.ts
import { authenticate, authorize } from '../middleware/auth';

router.get(
  '/protected',
  authenticate, // verify JWT
  authorize(['admin', 'petani']), // check role
  controller.getProtected
);
```

### Role Guard (Frontend)

Setiap dashboard page harus punya role guard:

```typescript
useEffect(() => {
  if (!user) router.push('/login');
  if (user.role !== 'expected_role') router.push(getRoleHomePath(user.role));
}, [user]);
```

### Role Routing (`lib/role-routes.ts`)

```typescript
export function getRoleHomePath(role?: string): string {
  switch (role) {
    case 'admin':
      return '/admin';
    case 'petani':
      return '/dashboard/farmer';
    case 'buyer':
      return '/dashboard/buyer';
    case 'investor':
      return '/dashboard/investor';
    case 'logistik':
      return '/dashboard/logistik';
    case 'distributor':
      return '/dashboard/distributor';
    case 'siswa':
      return '/dashboard/siswa';
    case 'instruktur':
      return '/dashboard/instruktur';
    default:
      return '/marketplace';
  }
}
```

### Dashboard Layout Pattern

Setiap role dashboard menggunakan layout file di `app/(dashboard)/dashboard/[role]/layout.tsx` yang menyertakan sidebar dan header.

### Component Naming

- **Landing sections:** `components/sections/[page]/ComponentName.tsx`
- **Feature components (API-integrated):** `components/features/[domain]/ComponentName.tsx`
- **UI primitives:** `components/ui/` (shadcn, jangan edit)

### Form Pattern

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  title: z.string().min(3),
  price: z.number().positive(),
});

type FormData = z.infer<typeof schema>;

const form = useForm<FormData>({
  resolver: zodResolver(schema),
});
```

---

## 5. PRD & Microtask Reference

Semua PRD dan Microtask ada di `docs/`. Saat mengerjakan task, SELALU baca PRD + Microtask yang relevan terlebih dahulu.

```
docs/
├── PRD_Farmer_Dashboard.md        + Microtasks_Farmer_Dashboard.md       (45 task, ~69 jam)
├── PRD_Buyer_Dashboard.md         + Microtasks_Buyer_Dashboard.md        (52 task, ~72 jam)
├── PRD_Investor_Dashboard.md      + Microtasks_Investor_Dashboard.md     (38 task, ~50.5 jam)
├── PRD_Logistics_Dashboard.md     + Microtasks_Logistics_Dashboard.md    (34 task, ~45 jam)
├── PRD_Distributor_Dashboard.md   + Microtasks_Distributor_Dashboard.md  (42 task, ~65 jam)
├── PRD_Siswa_Dashboard.md         + Microtasks_Siswa_Dashboard.md        (46 task, ~70 jam)
├── PRD_Instruktur_Dashboard.md    + Microtasks_Instruktur_Dashboard.md   (36 task, ~53 jam)
└── PRD_Admin_Dashboard.md         + Microtasks_Admin_Dashboard.md        (40 task, ~64 jam)
```

### Microtask ID Format

| Prefix | Role                  |
| ------ | --------------------- |
| `FD-`  | Farmer Dashboard      |
| `BD-`  | Buyer Dashboard       |
| `IV-`  | Investor Dashboard    |
| `LG-`  | Logistics Dashboard   |
| `DT-`  | Distributor Dashboard |
| `SW-`  | Siswa Dashboard       |
| `IN-`  | Instruktur Dashboard  |
| `AD-`  | Admin Dashboard       |

### Ketika mengerjakan microtask:

1. **Baca PRD** terkait di `docs/PRD_[Role]_Dashboard.md` — untuk memahami konteks dan spesifikasi halaman
2. **Baca Microtask** spesifik di `docs/Microtasks_[Role]_Dashboard.md` — untuk langkah detail
3. **Cek dependency** — beberapa task bergantung pada task lain (lihat dependency graph di microtask)
4. **Ikuti pattern** yang sudah ada di codebase, terutama farmer dashboard sebagai referensi
5. **Prioritas:** [P0] harus dikerjakan dulu, [P1] setelahnya, [P2] jika ada waktu

---

## 6. Existing Service Layer Files

| File                      | Methods Available                                                                                                      |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `services/auth.ts`        | `login`, `register`, `getMe`                                                                                           |
| `services/marketplace.ts` | `getProducts`, `getProductById`, `createProduct`, `updateProduct`, `deactivateProduct`, `uploadImage`, `getCategories` |
| `services/order.ts`       | `getOrders`, `getOrderById`, `checkout`, `initiatePayment`, etc.                                                       |
| `services/cart.ts`        | `getCart`, `addToCart`, `updateCartItem`, `removeCartItem`                                                             |
| `services/investment.ts`  | `getProposals`, `getProposalById`, `createProposal`, `invest`, `getMyInvestments`, etc.                                |
| `services/logistics.ts`   | `getShipments`, `getShipmentByOrderId`, `pickupShipment`, `transitShipment`, `deliverShipment`                         |
| `services/analytics.ts`   | `getOverview`, `getUserGrowth`, `getOrderAnalytics`, `getInvestmentAnalytics`                                          |
| `services/user.ts`        | `getUsers`, `verifyUser`, `updateStatus`                                                                               |

### Service files yang PERLU DIBUAT (belum ada):

| File                      | Untuk Role  | Reference |
| ------------------------- | ----------- | --------- |
| `services/distributor.ts` | Distributor | DT-001    |
| `services/academy.ts`     | Siswa       | SW-012    |
| `services/instructor.ts`  | Instruktur  | IN-011    |
| `services/admin.ts`       | Admin       | AD-030    |

---

## 7. Backend Service Ports & Database

| Service              | Port  | Database              | ORM      |
| -------------------- | ----- | --------------------- | -------- | -------- |
| api-gateway          | :3000 | —                     | —        |
| auth-service         | :3001 | PostgreSQL            | Prisma   |
| marketplace-service  | :3002 | MongoDB               | Mongoose |
| order-service        | :3003 | PostgreSQL            | Prisma   |
| investment-service   | :3004 | PostgreSQL            | Prisma   |
| logistics-service    | :3005 | MongoDB               | Mongoose |
| notification-service | :3006 | —                     | —        |
| analytics-service    | :3007 | Cross-service queries | —        |
| academy-service      | :3008 | PostgreSQL            | Prisma   | **BARU** |

---

## 8. Event System (RabbitMQ)

Events yang sudah ada:

| Event                | Publisher  | Consumer                | Payload                                              |
| -------------------- | ---------- | ----------------------- | ---------------------------------------------------- |
| `user.registered`    | auth       | notification            | `{ userId, email, role }`                            |
| `order.created`      | order      | notification, analytics | `{ orderId, buyerId, items }`                        |
| `order.confirmed`    | order      | logistics               | `{ orderId, items, address }` → auto-create shipment |
| `order.completed`    | order      | analytics               | `{ orderId, totalAmount }`                           |
| `payment.success`    | order      | notification            | `{ orderId, amount }`                                |
| `proposal.submitted` | investment | notification            | `{ proposalId, farmerId }`                           |
| `proposal.approved`  | investment | notification            | `{ proposalId }`                                     |
| `investment.created` | investment | notification            | `{ investmentId, investorId }`                       |

Events yang PERLU DITAMBAH:

| Event                      | Publisher | Consumer              | Untuk                           |
| -------------------------- | --------- | --------------------- | ------------------------------- |
| `course.enrolled`          | academy   | notification          | Siswa enroll → notif instruktur |
| `course.completed`         | academy   | notification          | Auto-certificate → notif siswa  |
| `certificate.issued`       | academy   | notification          | Notif siswa                     |
| `order.completed` (extend) | order     | distributor-inventory | Auto-populate inventory         |

---

## 9. Important Rules

### DO:

- ✅ Gunakan TanStack React Query untuk data fetching (bukan useState + useEffect)
- ✅ Buat service layer terlebih dahulu sebelum buat halaman
- ✅ Gunakan Zod untuk validasi form DAN API
- ✅ Setiap halaman harus punya: loading skeleton, error state, empty state
- ✅ Gunakan `sonner` toast untuk feedback user
- ✅ Gunakan `lucide-react` icons
- ✅ Semua dashboard pages harus `'use client'`
- ✅ Role guard di setiap dashboard page
- ✅ Referensi farmer dashboard untuk pattern

### DON'T:

- ❌ JANGAN hardcode data di dashboard pages — semua harus dari API
- ❌ JANGAN pakai `localStorage` langsung — gunakan Zustand store atau service layer
- ❌ JANGAN buat komponen besar monolitik — pecah ke components/features/
- ❌ JANGAN edit `components/ui/*` — itu shadcn generated
- ❌ JANGAN skip loading skeleton — UX wajib
- ❌ JANGAN buat backend endpoint tanpa auth middleware
- ❌ JANGAN langsung panggil API tanpa service layer

---

## 10. Running the Project

```bash
# Frontend
cd frontend/web && npm run dev   # → http://localhost:3001

# Backend (each service)
cd services/[service-name] && npm run dev

# Or via Docker Compose (if available)
docker-compose up
```

### Environment Variables

```bash
# Frontend (.env.local)
NEXT_PUBLIC_API_URL=http://localhost:3000

# Backend (each .env)
DATABASE_URL=...
MONGODB_URI=...
RABBITMQ_URL=amqp://localhost
REDIS_URL=redis://localhost:6379
JWT_SECRET=...
JWT_REFRESH_SECRET=...
```
