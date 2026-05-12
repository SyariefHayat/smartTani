# SmartTani Platform

Marketplace agrikultur multi-sided yang menghubungkan Petani, Buyer, Investor, Distributor, Logistik, dan Admin.

## Environment Setup

Proyek ini menggunakan variabel lingkungan untuk konfigurasi setiap service. Kami menyediakan file `.env.example` sebagai referensi.

### Global Setup

Di root direktori, terdapat `.env.example` yang berisi daftar lengkap semua variabel yang digunakan di seluruh platform.

### Per-Service Setup

Setiap service di folder `services/` memiliki file `.env.example` sendiri yang hanya berisi variabel relevan untuk service tersebut.

Untuk menjalankan service, Anda **WAJIB** membuat file `.env` di folder service masing-masing:

1. Masuk ke folder service (misal: `services/auth-service`).
2. Copy `.env.example` menjadi `.env`:
   ```bash
   cp .env.example .env
   ```
3. Sesuaikan nilai di dalam `.env` dengan environment lokal Anda.

### Validation

Setiap service memiliki validasi startup menggunakan **Zod**. Service tidak akan bisa berjalan (akan langsung exit) jika variabel lingkungan wajib tidak ada atau formatnya salah.

Contoh pesan error jika env missing:

```
❌ Invalid environment variables: {
  DATABASE_URL: { _errors: [ 'Required' ] },
  JWT_SECRET: { _errors: [ 'Required' ] }
}
```

## Tech Stack

Lihat `GEMINI.md` untuk detail tech stack dan aturan pengerjaan.
