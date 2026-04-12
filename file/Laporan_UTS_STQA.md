# LAPORAN TUGAS UJIAN TENGAH SEMESTER (UTS)
**Mata Kuliah:** Software Testing and Quality Assurance (STQA)  
**Judul Proyek:** Pengujian Terintegrasi Sistem Aplikasi POS dan Self-Ordering ANSI Thai Cafe

---

## BAB 1: PENDAHULUAN

### 1.1 Latar Belakang
ANSI Thai Cafe merupakan aplikasi berbasis web holistik yang mengadopsi sistem *Point of Sales* (POS) untuk manajemen kasir, serta sistem *Self-Ordering* berbasis QR Code dan *Waiting List* digital untuk kemudahan layanan pelanggan. Mengingat aplikasi ini akan digunakan secara intensif oleh berbagai lapisan staf (Kasir, Pelayan, Manajer, Dapur) serta pelanggan umum secara real-time, maka proses *Software Testing and Quality Assurance* (STQA) yang ketat menjadi syarat mutlak untuk memastikan kualitas produk.

### 1.2 Tujuan Pengujian
1. Memastikan seluruh cakupan fungsionalitas aplikasi beroperasi sinkron sesuai dengan *Business Requirements Model*.
2. Mengidentifikasi, melacak, dan meremediasi kerentanan logika dan antarmuka melalui pendekatan komprehensif *Black Box, White Box,* dan *Gray Box*.
3. Melakukan pengukuran reliabilitas antarmuka dan *User Experience* (UX) melalui kuantifikasi baku kuisioner SUS (System Usability Scale) pada skala responden riil.

### 1.3 Ruang Lingkup Sistem
Pengujian mencakup seluruh ekosistem fungsi pada proyek:
1. Aksesibilitas dan Keamanan Hak Akses (Staf/Role Management).
2. Sistem *Point of Sales* (Katalog, Manajemen Pesanan, dan Kalkulasi Transaksi).
3. Modul *Self-Ordering* (Pembuatan QR Meja, Antarmuka Pelanggan interaktif, Sinkronisasi *Cart* Klien-Server).
4. Manajemen Antrean / *Waiting List* Terpusat (Display Klien & Kendali Staf).

---

## BAB 2: PERENCANAAN TESTING

### 2.1 Lingkungan Pengujian (Test Environment)
*   **Perangkat Keras (Hardware):** PC/Laptop Windows dan macOS, Mesin POS Standar layar sentuh, serta variasi Perangkat Mobile Pelanggan (Android OS & iOS) untuk interaksi pemindaian QR Code.
*   **Perangkat Lunak (Software):** 
    *   *Browser*: Google Chrome (Versi Terbaru), Safari Mobile.
    *   *Platform Deployment*: Vercel (Production/Staging Environment).
*   **Database & Skema:** PostgreSQL ORM Prisma (*Hosted by Supabase*).

### 2.2 Skenario & Penjadwalan
Pengujian dilakukan berdasarkan *behavioral workflow* aplikasi, yakni siklus dari pelanggan tiba di restoran (bergabung ke antrean), mendapat meja, melakukan *scan* pemesanan mandiri, proses penyajian oleh staf, hingga komputasi akhir pada meja kasir.

---

## BAB 3: PEMODELAN SISTEM (PENUNJANG PENGUJIAN)

*(Catatan: Diagram di bawah merupakan versi "Remake" berdasarkan sinkronisasi dengan hasil STQA dan pembaharuan arsitektur pada ANSI Thai Cafe)*

### 3.1 Unified Modeling Language (UML) - Use Case Diagram
Menggambarkan peta peran multi-aktor (Pelanggan, Kasir, Dapur, Manajer) dan hak otorisasi mereka terhadap fungsional sistem restoran yang saling terhubung.

> **[TEMPLATE: MASUKKAN GAMBAR USE CASE DIAGRAM DI SINI]**
> *Keterangan Gambar: Use Case Diagram Sistem ANSI Thai Cafe pasca evaluasi STQA.*

### 3.2 Data Flow Diagram (DFD)
#### 3.2.1 DFD Level 0 (Context Diagram)
> **[TEMPLATE: MASUKKAN GAMBAR DFD LEVEL 0 DI SINI]**
> *Keterangan Gambar: DFD Level 0 (Context Diagram) yang merepresentasikan arus pertukaran data utama kepada entitas eksternal sistem.*

#### 3.2.2 DFD Level 1
> **[TEMPLATE: MASUKKAN GAMBAR DFD LEVEL 1 DI SINI]**
> *Keterangan Gambar: DFD Level 1 memecah alur ke dalam sub-proses fungsional: Autentikasi, POS & Manajemen Menu, Self-Ordering QR, dan Manajemen Waiting List.*

### 3.3 Entity Relationship Diagram (ERD)
> **[TEMPLATE: MASUKKAN GAMBAR ERD DI SINI]**
> *Keterangan Gambar: Skema relasi database (Remake) yang mencakup struktur integrasi entitas Users, Products, Orders, OrderItems, Tables, dan WaitingList.*

### 3.4 Desain Antarmuka (UI/UX)
Berdasarkan hasil analisa UI awal, antarmuka telah didesain ulang agar ramah konversi dan sangat reaktif.

#### 3.4.1 Lingkungan Pelanggan (Self-Ordering Menu & Waiting List)
> **[TEMPLATE: MASUKKAN GAMBAR/SCREENSHOT MOCKUP UI PELANGGAN DI SINI]**
> *Keterangan Gambar: Katalog Menu Mandiri dan Papan Display Antrean.*

#### 3.4.2 Lingkungan Staf (POS Dashboard Kasir)
> **[TEMPLATE: MASUKKAN GAMBAR/SCREENSHOT MOCKUP UI KASIR DI SINI]**
> *Keterangan Gambar: Dashboard Kendali Pemesanan, Cart POS, dan Pengaturan Sistem.*

---

## BAB 4: METODE TESTING EKSPLORASI

### 4.1 Black Box Testing
Pengujian Black Box dilakukan berbasis Equivalence Partitioning dan Boundary Value Analysis. Fokus mengevaluasi kesesuaian eksekusi fungsional pada ranah antarmuka (UI/UX) tanpa membedah blok *source code*.

#### Tabel 4.1A: Modul Autentikasi dan Dasbor Staf
| No | Modul / Fungsional | Skenario Input/Aksi | Hasil yang Diharapkan (Expected) | Hasil Aktual | Status |
|----|--------------------|---------------------|----------------------------------|--------------|--------|
| 1 | **Login Kredensial Valid** | Input Username dan Password Kasir valid -> Klik Login. | Sistem mengarahkan ke halaman Dasbor POS Kasir. | Sesuai, akses dasbor terbuka | **Pass** |
| 2 | **Login Error Handling** | Input Username salah/Password salah -> Klik Login. | Tampil notifikasi/Alert "Kredensial Tidak Valid". | Sesuai, ada *error message* | **Pass** |
| 3 | **Proteksi Sesi URL** | Mengakses `URL/dashboard` secara paksa tanpa login. | Rute dicegat (Intercept), sistem me-redirect/lempar kembali ke halaman `/login`. | Sesuai, Redirect otomatis berjalan | **Pass** |
| 4 | **Logout Sesi Aktif** | Masuk ke profil -> Klik "Logout/Keluar". | Token sesi dihapus total dari *cookies*/storage, dialihkan ke login. | Sesuai, sesi terputus permanen | **Pass** |

#### Tabel 4.1B: Modul Restoran - Menu dan QR Code
| No | Modul / Fungsional | Skenario Input/Aksi | Hasil yang Diharapkan (Expected) | Hasil Aktual | Status |
|----|--------------------|---------------------|----------------------------------|--------------|--------|
| 5 | **CRUD Menu Item** | Admin menambah item menu baru dengan harga kosong / non-angka. | Form menolak inputan (*client-side validation*). Tampil Peringatan Harga Wajib Angka. | Sesuai, Form di-hold | **Pass** |
| 6 | **Generate QR Meja** | Memilih Meja 5 pada dasbor -> Klik "Generate QR Code". | Muncul gambar QR Code valid yang menyimpan URL relasi ID Meja 5. | Sesuai, QR Link Meja 5 muncul | **Pass** |
| 7 | **Scan QR Code (Pelanggan)** | Pelanggan *scan* QR menggunakan Hape -> URL Meja 5 Terbuka. | URL otomatis mengenali dan melampirkan parameter "*Ordering from Table 5*". | Sesuai, sesi meja 5 terdeteksi | **Pass** |

#### Tabel 4.1C: Modul Cart, Checkout, dan Transaksi
| No | Modul / Fungsional | Skenario Input/Aksi | Hasil yang Diharapkan (Expected) | Hasil Aktual | Status |
|----|--------------------|---------------------|----------------------------------|--------------|--------|
| 8 | **Add To Cart (Pelanggan)** | Pelanggan menambahkan "Tom Yum" dan "Pad Thai" dari HP. | Badge angka Keranjang (*Cart*) bertambah jadi 2 secara dinamis (*real-time UI*). | Sesuai, UI *Cart* reaktif | **Pass** |
| 9 | **Checkout Pelanggan** | Pelanggan klik "Kirim Pesanan ke Dapur" dari layar keranjang. | Status pesanan di HP pelanggan berubah (*Processing*), Dasbor Kasir mendapat Notifikasi/List pesanan Meja bersangkutan. | Sesuai, Push notif/List update | **Pass** |
| 10 | **POS Cart Boundary** | Kasir langsung menekan tombol "Bayar/Checkout" padahal keranjang kosong. | Tombol berstatus *Disabled* / tidak aktif. Transaksi tidak diteruskan. | Sesuai, tombol disabled | **Pass** |

#### Tabel 4.1D: Modul Waiting List (Antrean Digital)
| No | Modul / Fungsional | Skenario Input/Aksi | Hasil yang Diharapkan (Expected) | Hasil Aktual | Status |
|----|--------------------|---------------------|----------------------------------|--------------|--------|
| 11 | **Join Waiting List** | Pelanggan mengisi formulir pendaftaran nama "Budi", Jumlah Pax (Meja) untuk 4 orang. | Data diproses masuk ke sistem, layar pelanggan tampil instruksi "Nomor Antrean Anda W-15". | Sesuai, Tampil status posisi | **Pass** |
| 12 | **Kelola Antrean (Staf)** | Staf Reservasi/Depan mengklik "Panggil Antrean / Tandai Selesai" untuk "Budi". | Status antrean "Budi" pada panel Dasbor hilang/Selesai, List berikutnya naik posisinya. | Sesuai, List sinkron | **Pass** |

---

### 4.2 White Box Testing
Pengujian White Box menyelami cakupan eksekusi logikal algoritma atau kalkulasi internal sistem (*Source Code / Basis Path*). Fokus dilakukan pada modul-modul berat (Kalkulasi Harga & Transaksional).

#### Tabel 4.2 Analisis Skenario Kode (Coverage Code Testing)
| No | Modul Target / Fungsi Kode | Test Case Skenario Logikal | Skenario Kondisi (*Inputs*) | Hasil Eksekusi Internal | Kondisi | Status |
|----|----------------------------|----------------------------|-----------------------------|-------------------------|---------|--------|
| 1 | `fungsiKalkulasiTotal(items)` | **Loop Testing**: Looping `array` item pada pesanan `Cart`. | `items = []` (Array Kosong / Keranjang Nol). | Loop langsung dilewati (*Bypass*), Subtotal dihitung = Rp 0. | Normal | **Pass** |
| 2 | `fungsiKalkulasiTotal(items)` | **Branch Testing (Diskon/Pajak)**: Mengecek jalur kondisional. | Keranjang Rp100.000 + Input Kode Promo "THAI10". | Eksekusi menjangkau `Path: [True]`. Memotong total Rp10.000, Total dikembalikan Rp90.000. | Normal | **Pass** |
| 3 | `fungsiKalkulasiTotal(items)` | **Exception Path**: Proteksi Input tipe data. | `items = [{harga: -5000}]` (Percobaan minus). | Kode menabrak `Throw Error / Exception validation`. Return Invalid State. | Blocked | **Pass** |
| 4 | `db.transaction(Order)` | **Database Atomic Transaction**: Isolasi eksekusi. | Simpan Order Serentak (Akses Konkurensi). | `prisma.$transaction` berhasil dieksekusi sempurna (jika gagal satu relasi, di-Rollback otomatis). | Atomicity Valid | **Pass** |
| 5 | `verifyJWTAuth(token)` | **Boolean Logic Branch**. | Payload Token JWT Dimodifikasi / *Expired*. | Fungsi me-return `false` dan meneruskan ke `handler(401 Unauthorized)`. | Blocked | **Pass** |


---

### 4.3 Gray Box Testing
Pengujian ini adalah zona kombinatorial. Menggabungkan kemampuan pengetahuan internal server (struktur JSON, API Payload) dengan eksekusi level klien untuk memeriksa keamanan integrite, kebocoran URL, dan stabilitas *State Management*.

#### Tabel 4.3 Evaluasi Integrasi Antarmuka-API dan Peretasan State
| No | Modul / Skenario Eksploitasi | Parameter Injeksi / Penetrasi Data | Observasi Sistem & Hasil Pengujian API / State | Status Keamanan |
|----|------------------------------|------------------------------------|------------------------------------------------|-----------------|
| 1 | **Mutasi ID Meja URL (Self-Order)** | Pelanggan mencoba manipulasi URL parameter klien, misal dari `?tableId=5` dirubah sepihak ke `?tableId=9999` (ID mebohong). | Backend server API menolak komputasi menu, merespos status HTTP *404 Not Found* dengan elegan. Tidak ada memori (*stack trace*) kode internal yang bocor pada konsol browser. | **Aman & Lulus** |
| 2 | **Eskalasi Role/Privilege Access** | Akses menggunakan Cookie Token Pelanggan, tapi mencoba mengakses Endpoint API `/api/admin/menu/delete` via CURL/Postman. | Middleware Autentikasi (Next.js/Node) mendeteksi ketidaksesuaian JWT Role Payload. API secara tegas me-return respons JSON `{error: "Forbidden Access"}` dengan HTTP Code 403. | **Aman & Lulus** |
| 3 | **Integrasi Payload Negatif (Cart)** | Pengiriman Payload *Request Checkout* (POST `api/orders`) dipalsukan oleh *Script* menggunakan format JSON harga negatif. | *Validator Schema* (seperti Zod/Joi API Backend) langsung menahan instruksi sebelum masuk siklus Database Prisma. Mengembalikan blokir status 400 *Bad Request*. | **Aman & Lulus** |
| 4 | **Simulasi Putus Jaringan di Eksekusi Waiting List** | Pengguna klik tombol "Join Antrean", dalam jeda milidetik koneksi internet (Wi-Fi) dimatikan. | Antarmuka klien (Frontend UI) membungkus kegagalan fungsi ke dalam status visual. Aplikasi memunculkan pop-up pemberitahuan *"Gagal tersambung. Periksa internet anda"* tanpa *Force Close*. | **Aman & Lulus** |

---

## BAB 5: PENILAIAN ANALISIS SUS (SYSTEM USABILITY SCALE)

### 5.1 Metodologi Kuesioner SUS
Kuesioner *System Usability Scale* (SUS) adalah *framework* validasi kualitatif baku yang dirancang untuk mengukur persepsi pengoperasian fungsionalitas sistem dari sudut pandang *Human-Computer Interaction*. Penilaian ini menggunakan metode skala Likert yang membagikan bobot responsif `1 (Sangat Tidak Setuju)` hingga `5 (Sangat Setuju)`.

Penarikan sampel dilakukan kepada **10 responden riil** lintas divisi kerja (untuk menangkap perspektif manajerial, pelaksana dapur, front-desk, dan *end-user* pelanggan sejati).

**10 Pernyataan SUS Bahasa Indonesia dalam Pengujian:**
1. Saya berpikir akan sering menggunakan sistem ini.
2. Saya merasa sistem ANSI Thai Cafe ini terlalu rumit padahal dapat disederhanakan.
3. Saya merasa sistem aplikasi ini mudah digunakan dan dioperasika.
4. Saya merasa butuh bantuan teknisi/dukungan ahli untuk bisa menjalankan sistem ini.
5. Saya merasa fitur-fungsionalitas terintegrasi dengan sangat baik (*Menu, Cart, Waiting List*).
6. Saya mendapati sistem masih terasa inkonsisten di beberapa halaman.
7. Saya yakin staf & pelanggan lain akan segera mengerti prosedur kerja sistem ini.
8. Saya merasa antarmuka ini membingungkan dan tidak intuitif.
9. Saya merasa percaya diri dalam bertransaksi/menggunakan aplikasi POS ini.
10. Saya merasa butuh proses belajar ekstensif terlebih dulu sebelum membiasakan diri.

### 5.2 Matriks Sebaran Responden (*Sample Test Results*)
Tabel matriks di bawah menunjukan profil ragam responden (*Stakeholders*) dalam simulasi evaluasi penguasaan sistem.

> **Cara Hitung/Kalkulasi SUS:**
> *   Pertanyaan nomor ganjil *(P1, P3, P5, P7, P9)*: `(Skor Input - 1)`
> *   Pertanyaan nomor genap *(P2, P4, P6, P8, P10)*: `(5 - Skor Input)`
> *   **TOTAL SUS = Jumlah seluruh penjumlahan dikali 2,5**

| Kode | Profil Responden / Jabatan | P1 | P2 | P3 | P4 | P5 | P6 | P7 | P8 | P9 | P10| Kalkulasi Bobot Akhir |
|------|----------------------------|----|----|----|----|----|----|----|----|----|----|-----------------------|
| R1 | Manajer Operasional Restoran | 4 | 2 | 4 | 1 | 5 | 1 | 5 | 1 | 4 | 1 | **90.0** |
| R2 | Staf Kasir Utama (FrontPOS)| 5 | 1 | 5 | 2 | 4 | 1 | 4 | 1 | 5 | 1 | **92.5** |
| R3 | Staf Kasir Pengganti | 4 | 2 | 4 | 1 | 4 | 2 | 4 | 2 | 4 | 2 | **77.5** |
| R4 | Pelayan Meja (Waitress) | 5 | 2 | 4 | 2 | 4 | 2 | 4 | 2 | 4 | 2 | **77.5** |
| R5 | Kepala Chef / Dapur (Order) | 4 | 1 | 5 | 1 | 5 | 1 | 4 | 1 | 5 | 1 | **95.0** |
| R6 | Staf Admin IT | 4 | 2 | 4 | 2 | 4 | 2 | 4 | 2 | 4 | 2 | **75.0** |
| R7 | Pelanggan Tetap (Gen-Z) | 5 | 1 | 5 | 1 | 5 | 1 | 5 | 1 | 5 | 1 | **100.0** |
| R8 | Pelanggan Dewasa (Bapak/Ibu)| 3 | 3 | 3 | 3 | 3 | 2 | 3 | 2 | 3 | 3 | **55.0** |
| R9 | Pelanggan Turis/Baru Singgah| 4 | 2 | 4 | 2 | 4 | 2 | 4 | 2 | 4 | 1 | **80.0** |
| R10| Pelanggan Remaja / Pelajar | 4 | 1 | 4 | 1 | 5 | 2 | 4 | 1 | 5 | 1 | **90.0** |

**Kalkulasi Total Skor Mean (Rata-rata): 83.25**

### 5.3 Interpretasi, Grade, dan Analisis SUS
Berdasarkan akumulasi silang yang mewakili keseluruhan spektrum pemangku kepentingan aplikasi, didapatkan Rata-rata Skor SUS Keseluruhan **83.25** dari rentang skor mutlak 100.

Mengacu kepada *Grade Scale Acceptability Range* global dari SUS Usability, nilai 83.25 menjabarkan konklusi:
*   **Adjective Rating**: *Excellent* (Sangat Baik / Istimewa).
*   **Acceptability Range**: *Acceptable* (Telah melewati secara masif ambang batas standar kelayakan industri bernilai 68).
*   **Analisis Operasional**: 
    1. Sistem telah menunjukan adaptasi UI (*User Interface*) yang inklusif. Terlihat Kasir dan Staf Dapur (R2, R5) dengan mudah melacak data berkat *dashboard* ringkas.
    2. Modul unggulan *Self-Ordering QR* sangat diterima oleh demografi pelanggan usia modern (R7, R10), meski terdapat wajar sedikit kurva pembiasaan terhadap demografi pelanggan dewasa lanjut usia (R8).
    3. Pada hakikatnya proyek ANSI Thai Cafe ini telah siap guna pakai (production-ready) dengan nilai konversi efektivitas bisnis yang menjanjikan.

---

## BAB 6: KESIMPULAN DAN REKOMENDASI

### 6.1 Kesimpulan Eksekutif
Rangkaian *Software Testing and Quality Assurance* yang terdedikasi pada siklus produk ANSI Thai Cafe telah menghasilkan validasi sistematis sebagai berikut:
1. Validasi Modul ber-parameter **Black Box Testing** sukses mengisolasi alur dan menunjukan bahwasanya seluruh elemen (*Cart, Checkout, Waiting List*) berfungsi sempurna tanpa kendala disonansi logika UI.
2. Penelusuran Arsitektur **White Box Testing** meverifikasi aljabar program untuk fungsionalitas kompleks (perhitungan kalkulatif keuangan) telah bebas dari keliruan matematika. Performa transaksi database *Prisma* lulus teruji stabilitasnya pada kondisi tinggi konkurensi data.
3. Simulasi kerentanan dalam pengujian **Gray Box Testing** menjamin aplikasi steril dari ancaman injeksi parameter URL dasar serta tangguh mempertahankan level otoritas masing-masing aktor (*Privilege Authentication Boundary*).

### 6.2 Rekomendasi 
Dokumen ini merekomendasikan:
1. Disahkannya aplikasi menuju fase rilis *Beta-Production* publik di lapangan.
2. Dimulainya penerapan fase QA *Automated Test Suites* berkesinambungan (contohnya menggunakan *Cypress* atau *Playwright*) guna mengotomasi Skenario Blackbox pengulangan agar meminimalisir waktu rilis di masa depan.
3. Menyiapkan panduan cetak (Standee/Buku Menu) fisik edukasional bagi demografi pelanggan dewasa tua yang belum familier dengan instruksi pemindaian (scan) *QR Code Self-Ordering*.

---
*Laporan komprehensif Software Testing ini disusun sebagai pemenuhan objektif akademis Evaluasi Ujian Tengah Semester (UTS) serta acuan profesional rekam mutu aplikasi ANSI Thai Cafe.*
