<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16.1-black?style=for-the-badge&logo=next.js" alt="Next.js"/>
  <img src="https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react" alt="React"/>
  <img src="https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css" alt="TailwindCSS"/>
  <img src="https://img.shields.io/badge/Prisma-5.22-2D3748?style=for-the-badge&logo=prisma" alt="Prisma"/>
  <img src="https://img.shields.io/badge/PostgreSQL-Supabase-336791?style=for-the-badge&logo=postgresql" alt="PostgreSQL"/>
</p>

# 🍜 Thai Cafe - Web Point of Sale (POS)

> Sistem Point of Sale berbasis web modern untuk manajemen restoran Thai Cafe dengan fitur multi-role, real-time order management, customer self-ordering, dan UI/UX bertema **"The Botanical Gallery"**.

🔗 **Live Demo:** [https://thai-cafe-pos.vercel.app/](https://thai-cafe-pos.vercel.app/)

---

## 📚 Tentang Proyek

**Thai Cafe POS** adalah aplikasi Point of Sale berbasis web yang dirancang khusus untuk memenuhi kebutuhan operasional restoran. Aplikasi ini mendukung berbagai peran pengguna (Admin, Kasir, Waiter, dan Kitchen) dengan antarmuka yang intuitif dan responsif, serta dilengkapi fitur **self-ordering pelanggan** melalui QR Code dan **Digital Waiting List**.

Proyek ini dikembangkan sebagai tugas mata kuliah **Analisis dan Perancangan Sistem**.

---

## 👥 Tim Pengembang - Kelompok 2

| No  | Nama                     | NIM         | Role               | GitHub                                                                       |
| :-: | ------------------------ | ----------- | ------------------ | ---------------------------------------------------------------------------- |
|  1  | **Ananda Putra Utama**   | 20240050086 | 📋 Project Manager | [@Grooinon](https://github.com/Grooinon)                                     |
|  2  | **Dipa Cahara Rakhman**  | 20240050053 | 💻 Web Developer   | [@Kaisen-7](https://github.com/Kaisen-7)                                     |
|  3  | **M. Z. Haikal Hamdani** | 20240050147 | 🔍 System Analyst  | [@ZephyrGraphic](https://github.com/ZephyrGraphic)                           |
|  4  | **Muhammad Dzakwan**     | 20240050013 | 📝 Sekretaris      | [@muhammaddzakwan434-creator](https://github.com/muhammaddzakwan434-creator) |
|  5  | **M. Ibnu Sina Fasya**   | 20240050071 | 🎨 UI/UX Designer  | [@boristhespider8](https://github.com/boristhespider8)                       |

---

## ✨ Fitur Utama

### 🔐 Multi-Role Access

- **Admin** - Dashboard analitik, manajemen menu, kategori, meja, member, inventori, resep (BOM), dan laporan penjualan
- **Kasir** - Proses pembayaran, ringkasan harian, dan riwayat transaksi
- **Waiter** - Input pesanan (POS Grid), monitoring status order, dan pengelolaan waiting list
- **Kitchen** - Display pesanan masuk, update status memasak, dan kontrol stok bahan baku

### 📱 Customer Self-Ordering (via QR Code)

- **Scan QR di Meja** → Pelanggan langsung membuka halaman pemesanan mandiri tanpa perlu mengunduh aplikasi
- Lihat daftar menu lengkap dengan kategori dan gambar
- Tambahkan item ke keranjang dan kirim pesanan langsung ke dapur
- Mendukung catatan khusus per-item dan metode pembayaran (Tunai / QRIS)
- 🔗 **Link:** `/table/[id-meja]`

### 📋 Digital Waiting List

- **Scan QR di Depan Pintu** → Pelanggan mendaftar antrean digital saat restoran penuh
- Isi nama, nomor WhatsApp, dan jumlah orang (Pax)
- Mendapat estimasi waktu tunggu secara otomatis
- Pelayan dapat memantau, memanggil, dan menugaskan meja melalui Dashboard Waiter
- 🔗 **Link:** `/queue`

### 📦 Manajemen Data

- **Menu Management** - CRUD menu dengan kategori, harga, dan gambar
- **Table Management** - Pengaturan meja dengan status (Available, Occupied, Reserved) dan kapasitas
- **Member System** - Program loyalitas dengan poin member
- **Inventory Control** - Stok bahan baku dengan recipe/BOM (Bill of Materials)

### 💳 Transaksi

- Pembuatan pesanan dengan pemilihan meja (Staff POS / Self-Order Pelanggan)
- Multiple payment method (Cash & QRIS)
- Real-time order tracking (status: Pending → Preparing → Ready → Served)
- Laporan penjualan harian

### 📊 Reporting

- Dashboard ringkasan penjualan
- Export laporan dalam format yang mudah dibaca
- Statistik pendapatan dan menu terlaris

---

## 🎨 UI/UX - The Botanical Gallery

Antarmuka aplikasi telah dirancang ulang (remake) secara menyeluruh menggunakan konsep desain **"The Botanical Gallery"** yang menghadirkan nuansa alam modern dan premium.

### Tema Desain Sistem Cafe (Staff Dashboard)

- **Slim Iconic Sidebar (80px)** — Navigasi vertikal ramping dengan ikon Material Symbols
- **Glassmorphism Header** — Header transparan mengambang dengan efek `backdrop-blur`
- **Botanical Color Palette** — Seluruh variabel warna ShadCN/Tailwind di-mapping ke palet hijau botani (`Primary: #006B0A`, `Accent: #59EE50`, `Surface: #F4F7F4`)
- **Tipografi Konsisten** — Font `Plus Jakarta Sans` sebagai headline utama

### Tema Desain Mobile Pelanggan (Customer UI)

- **Mobile-First Layout** — Antarmuka yang dioptimalkan untuk layar HP
- **Bottom Navigation Bar** — Navigasi bawah (Menu, Status, Akun) untuk akses cepat
- **Floating Cart Button** — Tombol keranjang belanja melayang dengan badge jumlah item
- **Botanical Green Accents** — Gradien hijau dan kontainer bertekstur botani

---

## 🛠️ Tech Stack

| Kategori          | Teknologi                     |
| ----------------- | ----------------------------- |
| **Framework**     | Next.js 16.1 (App Router)     |
| **Language**      | TypeScript                    |
| **Styling**       | Tailwind CSS 4.0              |
| **Design System** | The Botanical Gallery (Custom)|
| **Database**      | PostgreSQL (Supabase)         |
| **ORM**           | Prisma 5.22                   |
| **UI Components** | Radix UI + Material Symbols   |
| **Icons**         | Lucide React + Google Icons   |
| **Deployment**    | Vercel                        |

---

## 📁 Struktur Proyek

```
ansi-thai-cafe/
├── app/
│   ├── (auth)/              # Halaman login (Split-Screen Botanical)
│   ├── (dashboard)/         # Dashboard aplikasi
│   │   ├── admin/           # Modul Admin (9 halaman)
│   │   ├── cashier/         # Modul Kasir (4 halaman)
│   │   ├── kitchen/         # Modul Dapur (4 halaman)
│   │   └── waiter/          # Modul Waiter (5 halaman + Queue)
│   ├── table/[id]/          # 📱 Customer Self-Ordering (QR Scan)
│   ├── queue/               # 📋 Digital Waiting List (QR Scan)
│   └── api/                 # API Routes
├── components/
│   ├── layout/              # Sidebar, Header (Botanical Theme)
│   └── ui/                  # Reusable UI components (Radix)
├── lib/
│   ├── actions/             # Server Actions (Orders, Payments, etc.)
│   └── utils/               # Utilities & configurations
├── prisma/
│   ├── schema.prisma        # Database schema (12 model)
│   └── seed.ts              # Database seeder
└── public/                  # Static assets
```

---

## 🚀 Cara Menjalankan Proyek

### Prerequisites

- Node.js 18+
- npm / yarn / pnpm
- PostgreSQL database (atau gunakan Supabase)

### Instalasi

1. **Clone repository**

   ```bash
   git clone https://github.com/ZephyrGraphic/project-ansi-thai-cafe.git
   cd ansi-thai-cafe
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Setup environment variables**

   Buat file `.env` dan isi dengan konfigurasi berikut:

   ```env
   DATABASE_URL="postgresql://user:password@host:port/database?pgbouncer=true"
   DIRECT_URL="postgresql://user:password@host:port/database"
   ```

4. **Setup database**

   ```bash
   # Generate Prisma Client
   npx prisma generate

   # Jalankan migrasi database
   npm run db:migrate

   # (Opsional) Seed data awal
   npm run db:seed
   ```

5. **Jalankan development server**

   ```bash
   npm run dev
   ```

6. **Buka browser**

   Akses [http://localhost:3000](http://localhost:3000)

---

## 📱 Akses Fitur Pelanggan

Pelanggan mengakses fitur melalui **QR Code** yang dicetak oleh pihak restoran:

| Fitur | URL | Penempatan QR |
|---|---|---|
| **Self-Order** (Pesan mandiri) | `/table/[id-meja]` | Ditempel di **atas meja** |
| **Waiting List** (Daftar antrean) | `/queue` | Ditempel di **depan pintu / ruang tunggu** |

> **Catatan:** Setiap meja memiliki QR Code unik yang mengarah ke ID meja masing-masing. QR Code untuk Waiting List bersifat universal (satu untuk semua pelanggan).

---

## 📜 Available Scripts

| Command              | Deskripsi                       |
| -------------------- | ------------------------------- |
| `npm run dev`        | Menjalankan development server  |
| `npm run build`      | Build aplikasi untuk production |
| `npm run start`      | Menjalankan production server   |
| `npm run lint`       | Menjalankan ESLint              |
| `npm run db:migrate` | Menjalankan Prisma migrations   |
| `npm run db:seed`    | Menjalankan database seeder     |
| `npm run db:studio`  | Membuka Prisma Studio           |

---

## 🗄️ Database Schema

Aplikasi ini menggunakan model database berikut:

- **User** - Data pengguna dengan role-based access (Admin, Kasir, Waiter, Kitchen)
- **Table** - Manajemen meja restoran (status, kapasitas)
- **Category** - Kategori menu
- **Menu** - Daftar menu dengan harga dan gambar
- **Ingredient** - Bahan baku
- **Recipe** - Bill of Materials (BOM)
- **Order** - Transaksi pesanan (termasuk Self-Order)
- **OrderDetail** - Detail item pesanan
- **Payment** - Data pembayaran (Tunai / QRIS)
- **Member** - Data member loyalitas
- **StockLog** - Log perubahan stok
- **Queue** - Data antrean digital (Waiting List)

---

## 🔄 Changelog

### v2.0 — UI/UX Remake "The Botanical Gallery" (April 2026)
- 🎨 **Full UI Remake** — Seluruh antarmuka sistem (Admin, Kasir, Waiter, Kitchen) dirombak ke desain "The Botanical Gallery"
- 🪟 **Glassmorphism Layout** — Header transparan + Slim Sidebar (80px) dengan ikon Material Symbols
- 🌿 **Botanical Color System** — Palet warna hijau botani terintegrasi ke variabel Tailwind/ShadCN global
- 📱 **Mobile Customer UI** — Antarmuka pemesanan pelanggan yang mobile-first dengan Bottom Navigation Bar
- 📋 **Waiting List UI** — Halaman antrean digital ditata ulang dengan estetika Botanical

### v1.5 — Customer Self-Ordering & Waiting List (Maret 2026)
- 📱 **Customer Self-Order** — Pelanggan memesan langsung dari HP via scan QR di meja
- 📋 **Digital Waiting List** — Sistem antrean digital untuk pelanggan saat restoran penuh
- 🔗 **QR Code Integration** — Setiap meja memiliki QR unik yang terhubung ke halaman pemesanan

### v1.0 — Initial Release (Februari 2026)
- 🔐 Multi-role authentication (Admin, Kasir, Waiter, Kitchen)
- 📦 CRUD Menu, Kategori, Meja, Member, Inventaris
- 🍳 Recipe / Bill of Materials (BOM)
- 💳 Sistem transaksi dengan pembayaran Tunai & QRIS
- 📊 Dashboard analitik & laporan penjualan harian
- 🚀 Deployment ke Vercel + Supabase PostgreSQL

---

## 🌐 Deployment

Aplikasi ini di-deploy menggunakan **Vercel** dengan database **Supabase PostgreSQL**.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/ZephyrGraphic/project-ansi-thai-cafe)

---

## 📄 Lisensi

Proyek ini dibuat untuk keperluan akademik mata kuliah **Analisis dan Perancangan Sistem**.

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React Framework
- [Tailwind CSS](https://tailwindcss.com/) - CSS Framework
- [Prisma](https://www.prisma.io/) - ORM
- [Supabase](https://supabase.com/) - Backend as a Service
- [Vercel](https://vercel.com/) - Deployment Platform
- [Radix UI](https://www.radix-ui.com/) - UI Primitives
- [Google Material Symbols](https://fonts.google.com/icons) - Icon System

---

<p align="center">
  Made with ❤️ by <strong>Kelompok 2</strong> — UI/UX by <strong>The Botanical Gallery</strong> 🌿
</p>
