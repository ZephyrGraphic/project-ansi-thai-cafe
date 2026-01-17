<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16.1-black?style=for-the-badge&logo=next.js" alt="Next.js"/>
  <img src="https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react" alt="React"/>
  <img src="https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css" alt="TailwindCSS"/>
  <img src="https://img.shields.io/badge/Prisma-5.22-2D3748?style=for-the-badge&logo=prisma" alt="Prisma"/>
  <img src="https://img.shields.io/badge/PostgreSQL-Supabase-336791?style=for-the-badge&logo=postgresql" alt="PostgreSQL"/>
</p>

# 🍜 Thai Cafe - Web Point of Sale (POS)

> Sistem Point of Sale berbasis web modern untuk manajemen restoran Thai Cafe dengan fitur multi-role dan real-time order management.

🔗 **Live Demo:** [https://thai-cafe-pos.vercel.app/](https://thai-cafe-pos.vercel.app/)

---

## 📚 Tentang Proyek

**Thai Cafe POS** adalah aplikasi Point of Sale berbasis web yang dirancang khusus untuk memenuhi kebutuhan operasional restoran. Aplikasi ini mendukung berbagai peran pengguna (Admin, Kasir, Waiter, dan Kitchen) dengan antarmuka yang intuitif dan responsif.

Proyek ini dikembangkan sebagai tugas mata kuliah **Analisis dan Perancangan Sistem**.

---

## 👥 Tim Pengembang - Kelompok 2

| No | Nama | NIM | Role |
|:--:|------|-----|------|
| 1 | **Ananda Putra Utama** | 20240050077 | 📋 Project Manager |
| 2 | **Dipa Cahara Rakhman** | 20240050053 | 💻 Web Developer |
| 3 | **M. Z. Haikal Hamdani** | 20240050147 | 🔍 System Analyst |
| 4 | **Muhammad Dzakwan** | 20240050013 | 📝 Sekretaris |
| 5 | **M. Ibnu Sina Fasya** | 20240050071 | 🎨 UI/UX Designer |

---

## ✨ Fitur Utama

### 🔐 Multi-Role Access
- **Admin** - Manajemen menu, kategori, meja, member, inventori, dan laporan
- **Kasir** - Proses pembayaran, ringkasan harian, dan riwayat transaksi
- **Waiter** - Input pesanan dan monitoring status order
- **Kitchen** - Display pesanan masuk dan update status memasak

### 📦 Manajemen Data
- **Menu Management** - CRUD menu dengan kategori dan gambar
- **Table Management** - Pengaturan meja dengan status dan zona
- **Member System** - Program loyalitas dengan poin member
- **Inventory Control** - Stok bahan baku dengan recipe/BOM

### 💳 Transaksi
- Pembuatan pesanan dengan pemilihan meja
- Multiple payment method (Cash & QRIS)
- Real-time order tracking
- Laporan penjualan harian

### 📊 Reporting
- Dashboard ringkasan penjualan
- Export laporan dalam format yang mudah dibaca
- Statistik pendapatan dan menu terlaris

---

## 🛠️ Tech Stack

| Kategori | Teknologi |
|----------|-----------|
| **Framework** | Next.js 16.1 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS 4.0 |
| **Database** | PostgreSQL (Supabase) |
| **ORM** | Prisma 5.22 |
| **UI Components** | Radix UI |
| **Icons** | Lucide React |
| **Deployment** | Vercel |

---

## 📁 Struktur Proyek

```
ansi-thai-cafe/
├── app/
│   ├── (auth)/           # Halaman autentikasi
│   ├── (dashboard)/      # Dashboard aplikasi
│   │   ├── admin/        # Modul Admin
│   │   ├── cashier/      # Modul Kasir
│   │   ├── kitchen/      # Modul Dapur
│   │   └── waiter/       # Modul Waiter
│   └── api/              # API Routes
├── components/           # Reusable UI components
├── lib/                  # Utilities & configurations
├── prisma/
│   ├── schema.prisma     # Database schema
│   └── seed.ts           # Database seeder
└── public/               # Static assets
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

## 📜 Available Scripts

| Command | Deskripsi |
|---------|-----------|
| `npm run dev` | Menjalankan development server |
| `npm run build` | Build aplikasi untuk production |
| `npm run start` | Menjalankan production server |
| `npm run lint` | Menjalankan ESLint |
| `npm run db:migrate` | Menjalankan Prisma migrations |
| `npm run db:seed` | Menjalankan database seeder |
| `npm run db:studio` | Membuka Prisma Studio |

---

## 🗄️ Database Schema

Aplikasi ini menggunakan model database berikut:

- **User** - Data pengguna dengan role-based access
- **Table** - Manajemen meja restoran
- **Category** - Kategori menu
- **Menu** - Daftar menu dengan harga
- **Ingredient** - Bahan baku
- **Recipe** - Bill of Materials (BOM)
- **Order** - Transaksi pesanan
- **OrderDetail** - Detail item pesanan
- **Payment** - Data pembayaran
- **Member** - Data member loyalitas
- **StockLog** - Log perubahan stok

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

---

<p align="center">
  Made with ❤️ by <strong>Kelompok 2</strong>
</p>
