# 🛠️ Setup Guide — Shadcn UI, Font & Warna

> Project: Smarttani Indonesia  
> Stack: Next.js + TypeScript + Tailwind CSS + Shadcn UI

---

## 1. Install Shadcn UI

```bash
npx shadcn@latest init
```

Jawab prompt berikut:

```
Which style would you like to use? › Default
Which color would you like to use as the base color? › Zinc
Would you like to use CSS variables for theming? › Yes
```

---

## 2. Setup Font — Plus Jakarta Sans

### Install via `next/font`

```bash
# Tidak perlu install package — sudah tersedia di next/font/google
```

Edit `app/layout.tsx`:

```tsx
import { Plus_Jakarta_Sans } from "next/font/google";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-sans",
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={plusJakartaSans.variable}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
```

### Daftarkan di `tailwind.config.ts`

```ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "sans-serif"],
      },
    },
  },
};

export default config;
```

---

## 3. Design Tokens — Warna Smarttani

Warna diekstrak dari desain halaman Smarttani Indonesia.

### Palette Utama

| Token            | Nama             | Hex       | Penggunaan                                    |
| ---------------- | ---------------- | --------- | --------------------------------------------- |
| `primary`        | Hijau Tua        | `#1A6B2F` | Button utama, navbar active, heading          |
| `primary-dark`   | Hijau Sangat Tua | `#14521F` | Hover button, footer bg                       |
| `primary-light`  | Hijau Muda       | `#E8F5EC` | Card background, badge bg                     |
| `primary-medium` | Hijau Medium     | `#2D8A47` | Icon, border accent                           |
| `accent`         | Kuning/Amber     | `#F5A623` | CTA sekunder, badge highlight, bintang rating |
| `accent-dark`    | Kuning Tua       | `#D4891A` | Hover accent button                           |
| `neutral-50`     | Abu Sangat Muda  | `#F9FAFB` | Page background                               |
| `neutral-100`    | Abu Muda         | `#F3F4F6` | Card background, input bg                     |
| `neutral-300`    | Abu Border       | `#D1D5DB` | Border, divider, separator                    |
| `neutral-500`    | Abu Medium       | `#6B7280` | Subtext, placeholder                          |
| `neutral-700`    | Abu Gelap        | `#374151` | Body text                                     |
| `neutral-900`    | Hampir Hitam     | `#111827` | Heading utama                                 |
| `white`          | Putih            | `#FFFFFF` | Background utama                              |
| `destructive`    | Merah Error      | `#EF4444` | Error state                                   |
| `success`        | Hijau Success    | `#22C55E` | Success state, checklist                      |
| `warning`        | Kuning Warning   | `#EAB308` | Warning state                                 |
| `info`           | Biru Info        | `#3B82F6` | Info badge (Logistik CTA)                     |

---

## 4. Konfigurasi `globals.css`

Ganti isi `app/globals.css` dengan berikut:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* ── Background & Foreground ── */
    --background: 0 0% 100%;
    --foreground: 220 13% 10%;

    /* ── Card ── */
    --card: 0 0% 100%;
    --card-foreground: 220 13% 10%;

    /* ── Popover ── */
    --popover: 0 0% 100%;
    --popover-foreground: 220 13% 10%;

    /* ── Primary — Hijau Tua #1A6B2F ── */
    --primary: 138 60% 26%;
    --primary-foreground: 0 0% 100%;

    /* ── Secondary ── */
    --secondary: 138 40% 95%;
    --secondary-foreground: 138 60% 20%;

    /* ── Accent — Kuning #F5A623 ── */
    --accent: 37 90% 55%;
    --accent-foreground: 0 0% 100%;

    /* ── Muted ── */
    --muted: 220 14% 96%;
    --muted-foreground: 220 9% 46%;

    /* ── Destructive ── */
    --destructive: 0 84% 60%;
    --destructive-foreground: 0 0% 100%;

    /* ── Border & Input ── */
    --border: 220 13% 91%;
    --input: 220 13% 91%;
    --ring: 138 60% 26%;

    /* ── Border Radius ── */
    --radius: 0.625rem;

    /* ── Smarttani Custom Tokens ── */
    --primary-dark: 138 60% 20%;
    --primary-light: 138 40% 95%;
    --primary-medium: 138 50% 35%;
    --accent-dark: 37 80% 45%;
    --success: 142 71% 45%;
    --warning: 48 96% 53%;
    --info: 217 91% 60%;
  }

  .dark {
    --background: 220 13% 10%;
    --foreground: 0 0% 98%;
    --card: 220 13% 13%;
    --card-foreground: 0 0% 98%;
    --popover: 220 13% 13%;
    --popover-foreground: 0 0% 98%;
    --primary: 138 50% 45%;
    --primary-foreground: 0 0% 100%;
    --secondary: 138 20% 18%;
    --secondary-foreground: 138 40% 80%;
    --muted: 220 13% 18%;
    --muted-foreground: 220 9% 65%;
    --accent: 37 90% 55%;
    --accent-foreground: 0 0% 10%;
    --destructive: 0 62% 50%;
    --destructive-foreground: 0 0% 100%;
    --border: 220 13% 22%;
    --input: 220 13% 22%;
    --ring: 138 50% 45%;
  }
}

@layer base {
  * {
    @apply border-border;
  }

  body {
    @apply bg-background text-foreground;
    font-feature-settings:
      "rlig" 1,
      "calt" 1;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    @apply font-semibold tracking-tight text-neutral-900;
  }

  h1 {
    @apply text-4xl md:text-5xl lg:text-6xl;
  }
  h2 {
    @apply text-2xl md:text-3xl lg:text-4xl;
  }
  h3 {
    @apply text-xl md:text-2xl;
  }
  h4 {
    @apply text-lg md:text-xl;
  }
}

@layer utilities {
  /* Smarttani brand gradient */
  .bg-smarttani-gradient {
    background: linear-gradient(135deg, #1a6b2f 0%, #2d8a47 100%);
  }

  /* CTA banner gradient */
  .bg-cta-gradient {
    background: linear-gradient(135deg, #14521f 0%, #1a6b2f 50%, #2d8a47 100%);
  }

  /* Glassmorphism untuk hero stat cards */
  .glass-card {
    @apply bg-white/90 backdrop-blur-sm border border-white/20 shadow-lg;
  }

  /* Section padding standar */
  .section-padding {
    @apply py-12 md:py-16 lg:py-20;
  }

  /* Container standar */
  .container-smarttani {
    @apply container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl;
  }
}
```

---

## 5. Update `tailwind.config.ts` Lengkap

```ts
import type { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",

        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          dark: "hsl(var(--primary-dark))",
          light: "hsl(var(--primary-light))",
          medium: "hsl(var(--primary-medium))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
          dark: "hsl(var(--accent-dark))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        success: "hsl(var(--success))",
        warning: "hsl(var(--warning))",
        info: "hsl(var(--info))",

        /* Smarttani brand alias untuk kemudahan */
        smarttani: {
          green: "#1A6B2F",
          "green-dark": "#14521F",
          "green-medium": "#2D8A47",
          "green-light": "#E8F5EC",
          yellow: "#F5A623",
          "yellow-dark": "#D4891A",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        card: "0 2px 8px rgba(0, 0, 0, 0.08)",
        "card-hover": "0 8px 24px rgba(0, 0, 0, 0.12)",
        hero: "0 4px 16px rgba(26, 107, 47, 0.2)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
```

---

## 6. Install Shadcn Components yang Dibutuhkan

Jalankan satu per satu sesuai kebutuhan per halaman:

```bash
# Core UI — install semua sekaligus
npx shadcn@latest add button
npx shadcn@latest add badge
npx shadcn@latest add card
npx shadcn@latest add input
npx shadcn@latest add label
npx shadcn@latest add separator
npx shadcn@latest add avatar
npx shadcn@latest add tabs

# Form (halaman Daftar)
npx shadcn@latest add form
npx shadcn@latest add select
npx shadcn@latest add checkbox
npx shadcn@latest add radio-group

# Interaktif
npx shadcn@latest add accordion   # FAQ Investasi
npx shadcn@latest add carousel    # Testimoni
npx shadcn@latest add slider      # Filter harga Marketplace
npx shadcn@latest add progress    # Progress bar Investasi
npx shadcn@latest add tooltip     # Tooltip info
npx shadcn@latest add sheet       # Mobile sidebar
npx shadcn@latest add dropdown-menu
npx shadcn@latest add navigation-menu  # Navbar
```

---

## 7. Komponen Shadcn — Override Warna ke Brand Smarttani

Setelah install, buka `components/ui/button.tsx` dan pastikan variant `default` menggunakan primary brand color. Shadcn otomatis pakai `--primary` dari CSS variables, jadi sudah sinkron.

Untuk tombol kuning (accent), tambahkan variant custom:

```tsx
// components/ui/button.tsx
// Tambahkan di dalam buttonVariants:
accent: 'bg-accent text-white hover:bg-accent-dark shadow-sm',
```

Penggunaan:

```tsx
<Button variant="accent">Daftar Sekarang</Button>
<Button variant="default">Pelajari Lebih Lanjut</Button>
<Button variant="outline">Hubungi Kami</Button>
<Button variant="ghost">Lihat Semua →</Button>
```

---

## 8. Typography Scale

Tambahkan ke `globals.css` untuk konsistensi:

```css
@layer components {
  .text-display {
    @apply text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight;
  }
  .text-heading-1 {
    @apply text-3xl md:text-4xl font-bold tracking-tight leading-tight;
  }
  .text-heading-2 {
    @apply text-2xl md:text-3xl font-semibold leading-snug;
  }
  .text-heading-3 {
    @apply text-xl md:text-2xl font-semibold;
  }
  .text-body-lg {
    @apply text-lg leading-relaxed;
  }
  .text-body {
    @apply text-base leading-relaxed;
  }
  .text-body-sm {
    @apply text-sm leading-relaxed;
  }
  .text-caption {
    @apply text-xs text-muted-foreground;
  }
  .section-title {
    @apply text-heading-2 text-neutral-900 mb-2;
  }
  .section-subtitle {
    @apply text-body text-muted-foreground mb-8 md:mb-12;
  }
}
```

---

## 9. Verifikasi Setup

Buat file `app/test-design/page.tsx` untuk preview design tokens:

```tsx
export default function TestDesignPage() {
  return (
    <div className="container-smarttani section-padding space-y-8">
      <h1 className="text-display">Display — Plus Jakarta Sans</h1>
      <h2 className="text-heading-1">Heading 1</h2>
      <h3 className="text-heading-2">Heading 2</h3>

      {/* Color swatches */}
      <div className="flex flex-wrap gap-3">
        <div className="w-20 h-20 rounded-lg bg-primary flex items-center justify-center text-white text-xs">
          primary
        </div>
        <div className="w-20 h-20 rounded-lg bg-primary-dark flex items-center justify-center text-white text-xs">
          primary-dark
        </div>
        <div className="w-20 h-20 rounded-lg bg-primary-medium flex items-center justify-center text-white text-xs">
          primary-medium
        </div>
        <div className="w-20 h-20 rounded-lg bg-primary-light border flex items-center justify-center text-xs">
          primary-light
        </div>
        <div className="w-20 h-20 rounded-lg bg-accent flex items-center justify-center text-white text-xs">
          accent
        </div>
        <div className="w-20 h-20 rounded-lg bg-accent-dark flex items-center justify-center text-white text-xs">
          accent-dark
        </div>
        <div className="w-20 h-20 rounded-lg bg-success flex items-center justify-center text-white text-xs">
          success
        </div>
        <div className="w-20 h-20 rounded-lg bg-info flex items-center justify-center text-white text-xs">
          info
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-wrap gap-3">
        <button className="bg-primary text-white px-6 py-2 rounded-lg">
          Primary
        </button>
        <button className="bg-accent text-white px-6 py-2 rounded-lg">
          Accent
        </button>
        <button className="border border-primary text-primary px-6 py-2 rounded-lg">
          Outline
        </button>
      </div>

      {/* Gradient */}
      <div className="h-20 rounded-xl bg-smarttani-gradient flex items-center justify-center text-white font-semibold">
        Smarttani Gradient
      </div>
      <div className="h-20 rounded-xl bg-cta-gradient flex items-center justify-center text-white font-semibold">
        CTA Banner Gradient
      </div>
    </div>
  );
}
```

Akses di `http://localhost:3000/test-design` untuk memverifikasi semua token tampil benar.

---

## ✅ Checklist Setup

- [ ] `npx shadcn@latest init` selesai
- [ ] `Plus_Jakarta_Sans` terdaftar di `layout.tsx`
- [ ] `tailwind.config.ts` diupdate dengan semua token warna
- [ ] `globals.css` diupdate dengan CSS variables & utility classes
- [ ] Semua shadcn components yang dibutuhkan sudah di-install
- [ ] Halaman `/test-design` tampil benar tanpa error
- [ ] Font Plus Jakarta Sans ter-load (cek di DevTools → Network → Fonts)
- [ ] Warna primary hijau & accent kuning tampil sesuai desain
