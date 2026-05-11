# SmartTani — Agent Context & Guardrails

> Dokumen ini adalah **aturan yang selalu berlaku** selama mengerjakan proyek SmartTani.
> Baca sekali, patuhi selamanya. Ini bukan daftar tugas — ini adalah batasan dan standar.

---

## Aturan Utama

**Kerjakan HANYA task yang disebutkan user. Tidak lebih, tidak kurang.**

Jika user berkata "kerjakan TASK-001", maka hanya TASK-001 yang dikerjakan. Jangan mengerjakan TASK-002 meskipun terlihat berkaitan atau "lebih efisien jika dikerjakan sekalian". Jika ada dependency yang kurang, **tanyakan** — jangan asumsikan dan langsung kerjakan sendiri.

Sebelum mengerjakan task apapun, baca docs/SmartTani_PRD_Developer_Q1.md terlebih dahulu untuk memahami konteks bisnis dan requirement.

---

## Konteks Proyek

- **Proyek:** SmartTani — marketplace agrikultur (Petani, Buyer, Investor, Distributor, Logistik, Admin)
- **Fase aktif:** Q1 MVP — demo siap investor
- **Referensi task:** `SmartTani_Q1_Microtasks.md`
- **Referensi requirement:** `SmartTani_PRD_Developer_Q1.md`

**Fitur yang OUT OF SCOPE Q1 — jangan sentuh sama sekali:**
Academy, Article/CMS, Mobile app, AI recommendation, Open API mitra, GPS/IoT logistik.

---

## Tech Stack (Jangan Ganti Tanpa Konfirmasi)

| Kebutuhan          | Gunakan                                    |
| ------------------ | ------------------------------------------ |
| Backend            | Node.js 24.15.0 LTS + Express + TypeScript |
| Frontend           | Next.js 16.2.6 (App Router)                |
| ORM                | Prisma (PostgreSQL), Mongoose (MongoDB)    |
| Validasi           | Zod                                        |
| Auth               | jsonwebtoken + bcrypt                      |
| State (FE)         | Zustand                                    |
| Data Fetching (FE) | React Query + Axios                        |
| Form (FE)          | react-hook-form + Zod                      |
| UI                 | shadcn/ui + Tailwind CSS                   |
| Testing            | Jest + Supertest                           |

---

## Struktur Folder

**Backend** — ikuti struktur ini, jangan improvisasi:

```
src/
├── routes/        # Definisi route saja, tidak ada logic
├── controllers/   # Terima req → panggil service → kirim res
├── services/      # Business logic, tidak ada req/res
├── repositories/  # Query database, tidak ada logic bisnis
├── middleware/     # Express middleware
├── schemas/       # Zod schemas
├── events/        # RabbitMQ publishers & consumers
├── jobs/          # BullMQ workers
├── config/        # Koneksi DB, env validation
└── types/
```

**Frontend** — ikuti struktur ini:

```
src/
├── app/           # Next.js routing (App Router)
├── components/
│   ├── ui/        # shadcn/ui — jangan diedit manual
│   ├── shared/    # Komponen reusable lintas halaman
│   └── features/  # Komponen spesifik per fitur
├── hooks/         # Custom React hooks (prefix: use*)
├── services/      # Fungsi pemanggilan API
├── stores/        # Zustand stores
├── lib/           # Config library (axios instance, query client)
├── types/         # TypeScript types
└── utils/         # Pure helper functions
```

---

## Konvensi Wajib

**Penamaan:**

- Folder: `kebab-case`
- Komponen React: `PascalCase`
- File logic/hook/service: `camelCase`
- Import selalu pakai alias `@/` — tidak boleh relative path panjang (`../../../`)

**Response API — selalu gunakan format ini:**

```json
{ "success": true, "data": {} }
{ "success": false, "error": { "code": "AUTH_001", "message": "..." } }
```

**Aturan lapisan backend — tidak boleh dilanggar:**

- Controller tidak boleh query database langsung
- Service tidak boleh punya parameter `req` atau `res`
- Validasi input hanya di Zod schema, dipasang di route sebagai middleware

---

## Definition of Done

Task belum selesai sampai semua ini terpenuhi:

- [ ] TypeScript tidak ada error
- [ ] ESLint tidak ada error, tidak ada `console.log`
- [ ] Tidak ada secret/credential yang di-hardcode
- [ ] Unit test ditulis untuk service layer (coverage ≥ 70%)
- [ ] Integration test: minimal happy path + 2 error case per endpoint
- [ ] `docker build` berhasil
- [ ] `GET /health` return 200

---

## Ketika Ragu

1. Cek PRD → cek Microtask → baru kerjakan
2. Jangan membuat keputusan arsitektur besar sendiri (ganti library, ubah schema DB, ubah API contract) — **tanya dulu**
3. Ide untuk fitur masa depan? Tulis sebagai komentar `// TODO Q2:` dan lanjutkan
