# 📋 Analisis Sistem & Brainstorming (Sesi 2 STQA)

**Proyek:** Thai Cafe POS System  
**Mata Kuliah:** Software Testing dan Quality Assurance

Dokumen ini berisi analisis hasil pengujian tahap awal dan evaluasi kebutuhan pengembangan (termasuk mengakomodasi saran penambahan fitur Pelanggan/Self-Order dan manajemen antrean saat restoran penuh).

---

## 1. Tujuan Pengembangan Perangkat Lunak

Tujuan utama dari sistem Thai Cafe POS adalah mendigitalkan dan mengotomatisasi proses operasional restoran dari pemesanan hingga pembayaran, guna meningkatkan efisiensi waktu, meminimalisir _human error_ dalam pencatatan stok dan pesanan, serta memberikan pengalaman pelayanan yang lebih cepat kepada pelanggan.

### 1.1 Analisis Kebutuhan Pengguna (User Requirements)

Berdasarkan sistem yang sudah berjalan, kebutuhan pengguna terbagi menjadi 4 aktor utama:

1. **Admin:** Membutuhkan sistem pengawasan penuh terhadap menu, meja, inventaris bahan baku (BOM/Recipe), manajemen karyawan (user role), serta melihat laporan penjualan harian.
2. **Kasir:** Membutuhkan antarmuka yang cepat untuk memproses pembayaran (Cash/QRIS), mencetak struk, dan mengintegrasikan poin loyalty member.
3. **Waiter:** Membutuhkan sistem untuk mencatat pesanan pelanggan per meja tanpa harus mencatat manual di kertas, serta melacak status pesanan dari dapur.
4. **Kitchen:** Membutuhkan _display_ (KDS - Kitchen Display System) _real-time_ untuk melihat pesanan yang masuk agar bisa dimasak sesuai urutan dan mengubah status pesanan (Prepairing → Ready).

### 1.2 Proses Bisnis Saat Ini (As-Is)

1. Pelanggan datang dan dicarikan meja yang **AVAILABLE** oleh Waiter.
2. Waiter menghampiri meja, memberikan menu, dan mencatat pesanan melalui tablet/smartphone (role Waiter) lalu menyimpannya. Status order menjadi **PENDING**.
3. Pesanan otomatis muncul di layar Kitchen. Kitchen mengubah status menjadi **PREPARING** (dimasak) lalu **READY** (siap disajikan).
4. Waiter mengambil makanan, menyajikan ke meja, dan mengubah status menjadi **SERVED**.
5. Setelah selesai, pelanggan menuju ke Kasir. Kasir memproses pembayaran; status order menjadi **COMPLETED** dan meja menjadi **CLEANING**.
6. Admin melihat laporan pendapatan dan stok bahan baku yang terpotong secara otomatis.

### 1.3 Identifikasi Masalah (Hasil Brainstorming Testing Kemarin)

Dari hasil testing dan evaluasi sesi sebelumnya, terdapat beberapa kekurangan/masalah:

1. **Bottleneck pada Waiter:** Saat jam sibuk (peak hours), Waiter kuwalahan mencatat pesanan karena harus mondar-mandir antara mencatat pesanan baru dan menyajikan makanan (SERVED).
2. **Manajemen Kapasitas (Kondisi Penuh):** Sistem saat ini memiliki status meja `AVAILABLE`, `OCCUPIED`, `RESERVED`, dan `CLEANING`. Namun, ketika semua meja `OCCUPIED`, sistem _tidak memiliki alur untuk menangani pelanggan yang baru datang_. Pelanggan terpaksa menunggu tanpa kepastian antrean.
3. **Kurangnya Kemandirian Pelanggan:** Pelanggan 100% bergantung pada ketersediaan Waiter untuk memesan tambahan makanan.

---

## 2. Solusi & Skenario Baru (Note Dosen)

Menjawab saran dosen: _"Bagaimana jika menambahkan aktor Pelanggan agar bisa memesan sendiri? Dan bagaimana skenario saat ruangan/meja penuh?"_

### 2.1 Aktor Baru: Pelanggan (Customer Self-Ordering)

**Konsep:** Implementasi _QR Code Table Ordering_.

- Setiap meja memiliki QR Code unik yang terhubung ke ID Meja tersebut.
- Pelanggan yang duduk memindai QR Code menggunakan smartphone mereka.
- Pelanggan dapat melihat e-Menu, memasukkan pesanan ke keranjang, dan langsung menekan "Pesan" tanpa perlu login (Guest Session based on Table ID).
- Order langsung masuk ke Kitchen (PENDING).
- **Peran Waiter Berubah:** Waiter lebih fokus pada menyajikan makanan (Food Runner) dan _membersihkan_ meja (Bussing), bukan lagi spesifik sebagai pencatat pesanan utama.

### 2.2 Skenario Saat Ruangan/Meja Penuh (Digital Waitlist)

**Konsep:** Implementasi fitur _Digital Queue/Waitlist_ (Antrean Digital).
**Skenario Bisnis Baru:**

1. Pelanggan datang saat semua meja berstatus `OCCUPIED`.
2. Waiter/Host berada di depan pintu utama membuka menu **"Waitlist"** di tabletnya.
3. Waiter mendaftarkan nama pelanggan, nomor WhatsApp, dan jumlah rombongan (pax).
4. Pelanggan mendapat notifikasi nomor antrean.
5. Ketika ada meja berstatus `CLEANING` lalu menjadi `AVAILABLE`, sistem akan memberi alert kepada Waiter: _"Meja 05 (Kapasitas 4) tersedia untuk Antrean No. 12 (Bpk. Budi, 3 Pax)"_.
6. Pelanggan dipersilakan masuk dan diarahkan ke Meja 05. Jika ada fitur integrasi WhatsApp API, pelanggan bisa ditelepon/di-WA secara otomatis.

---

## 3. Analisis Ulang Model Desain (To-Be)

### 3.1 DFD/ERD Analysis (Perubahan Struktur Data)

Untuk mengakomodasi fitur baru, struktur _Database_ (ERD) perlu ditambahkan model baru:

1. **Tabel `Waitlist` (Baru)**
   - `id`: String (PK)
   - `customerName`: String
   - `customerPhone`: String (Opsional untuk notif WA)
   - `pax`: Int (Jumlah orang)
   - `status`: Enum (WAITING, SEATED, CANCELLED)
   - `assignedTableId`: String (FK ke Table - Opsional, diisi saat SEATED)
   - `createdAt`: DateTime

2. **Perubahan Tabel `Order`**
   - Penambahan field `orderSource`: Enum (WAITER, CUSTOMER_QR)
   - Untuk melacak apakah order ini diinput oleh Waiter atau langsung oleh Pelanggan dari HP mereka.

### 3.2 Diagram UML

#### A. Use Case Diagram Update

```mermaid
usecaseDiagram
    actor "Pelanggan" as Cust
    actor "Waiter" as Waiter
    actor "Host/Greeter" as Host
    actor "Kitchen" as Kit
    actor "Kasir" as Kasir

    rectangle "Thai Cafe System" {
        Cust --> (Scan QR & Lihat Menu)
        Cust --> (Buat Pesanan Self-Order)
        Cust --> (Cek Status Pesanan)

        Host --> (Input Data Waitlist/Antrean)
        Host --> (Assign Antrean ke Meja)

        Waiter --> (Konfirmasi Makanan Siap Saji)
        Kit --> (Update Status Masakan)
        Kasir --> (Proses Pembayaran)
    }
```

#### B. Activity Diagram (Skenario Ruangan Penuh & Self-Order)

**Alur Ruangan Penuh (Waitlist):**

```
Pelanggan Datang -> Host Cek Sistem Meja
IF (Ada Meja AVAILABLE) {
   Host mengarahkan ke meja -> Lanjut ke proses pemesanan
} ELSE IF (Semua Meja OCCUPIED) {
   Host meminta nama & jumlah Pax -> Host input ke Form Waitlist
   Pelanggan masuk daftar tunggu (WAITING)
   ... [Meja lain selesai makan dan dibersihkan] ...
   Meja menjadi AVAILABLE -> Sistem mencocokkan kapasitas meja dgn pax Antrean teratas
   Host memanggil pelanggan -> Host ubah status waitlist (SEATED) -> Pelanggan duduk
}
```

**Alur Self-Order (QR Code):**

```
Pelanggan Duduk -> Scan QR Code Meja dgn Smartphone
Tampil Halaman E-Menu (Web) -> Pelanggan pilih item -> Masuk Cart
Pelanggan tekan 'Place Order' -> Sistem validasi ketersediaan menu
Sistem simpan ke DB (Status PENDING, Source: CUSTOMER_QR)
Layar Kitchen berbunyi, nampil menu baru -> Kitchen masak (PREPARING)
Menu matang (READY) -> Waiter antar ke meja (SERVED)
Pelanggan bawa bill digital/nomor meja ke Kasir -> Selesai
```

#### C. Class Diagram (Penyesuaian Model)

Tambahan Class/Entity yang krusial pada Prisma Schema:

- Class **Table**: memiliki atribut `status` (Available, Occupied, Cleaning), `capacity`.
- Class **Waitlist** (Baru): atribut `name`, `pax`, `status` (Waiting, Seated), berelasi 1-to-M dengan Table.
- Class **Order**: penambahan atribut `source` membedakan antara orderan dari tab Waiter atau HP pelanggan.

#### D. Sequence Diagram (Skenario Self-Order Pelanggan)

```
[Pelanggan] -> [Web App (via QR)]: Buka halaman menu Meja X
[Web App] -> [Database]: Fetch Data Menu Available
[Database] --> [Web App]: Return Menu List
[Pelanggan] -> [Web App]: Add to Cart & Checkout()
[Web App] -> [Backend API]: POST /api/order (items, tableId, source:'CUSTOMER')
[Backend API] -> [Database]: Deduct Stock in Inventori & Insert Order
[Database] --> [Backend API]: Success (Order ID)
[Backend API] --> [Web App]: Notifikasi Pesanan Berhasil
[Backend API] -> [Display Kitchen]: Socket.io/Pusher trigger "New Order PENDING"
```

### 3.3 Draft Mockup (UI/UX) untuk Skenario Baru

1. **Mockup A: Layar HP Pelanggan (QR Menu)**
   - _Header:_ Logo Thai Cafe, Teks "Meja 05" (Lock, tidak bisa diganti).
   - _Hero Slider:_ Promo makanan hari ini.
   - _Tab Categories:_ Makanan, Minuman, Dessert.
   - _Menu Items:_ Foto estetik, Nama, Harga, Deskripsi singkat, Tombol [ + ].
   - _Floating Cart Button:_ Menampilkan total harga & total item di sudut kanan bawah.
   - _Cart Modal:_ Review pesanan, input _Notes_ (contoh: "Ga pake pedes"), Tombol raksasa "PESAN SEKARANG" (Konfirmasi Order).
   - _Order Success Page:_ Animasi centang hijau, status _real-time_ ("Makanan sedang disiapkan dapur...").

2. **Mockup B: Layar Waiter / Host (Waitlist Management Tab)**
   - Tab baru di dashboard khusus Waiter: **"WAITLIST"**
   - _Form Input (Kiri):_ textfield Nama, textfield No. WA (opsional), counter Jumlah Orang (Pax). Tombol [Tambah ke Antrean].
   - _List Antrean Aktif (Kanan):_ Card List pelanggan yang menunggu, urut dari yang paling lama. Menampilkan "Bapak Budi - 4 Pax - Menunggu: 15 Menit".
   - _Smart Suggestion Alert:_ Jika ada meja 4-seater kosong, muncul _toast_ "Meja 08 cocok untuk Antrean Bpk Budi. [Assign Meja]".

---

_Catatan: Dokumen ini disusun khusus sebagai bahan analisis konseptual untuk pemenuhan tugas mata kuliah. Implementasi kode fisik belum dilakukan berdasarkan ruang lingkup tugas ini._
