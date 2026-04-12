# Review Pengetahuan: Teknik dan Desain Pengujian Software

## 1. Pemahaman tentang Teknik-Teknik Pengujian Software
Berdasarkan pemahaman saya, teknik pengujian software adalah serangkaian metode sistematis untuk memvalidasi bahwa aplikasi berjalan sesuai kebutuhan bisnis dan bebas dari bug. Dalam konteks **Proyek Sistem POS & Self-Ordering Cafe** kita, teknik ini dibagi menjadi tahapan berikut:

*   **Unit Testing (Pengujian Unit):** Menguji komponen, fungsi, atau *method* terkecil secara terisolasi.
    *   *Contoh di Proyek:* Menguji fungsi kalkulasi total harga pesanan, penghitungan pajak, atau fungsi spesifik pengumpulan data antrean di `lib/actions/queue.ts`.
*   **Integration Testing (Pengujian Integrasi):** Menguji apakah kombinasi dari dua atau lebih modul/komponen dapat berinteraksi dan bertukar data dengan benar.
    *   *Contoh di Proyek:* Memastikan data pelanggan dari modul **Self-Ordering (QR Code)** berhasil dikirim dan tersinkronisasi *real-time* ke halaman **Dashboard Kasir (SalesPageClient)** dan *Kitchen Display*.
*   **System Testing (Pengujian Sistem):** Menguji keseluruhan sistem secara *End-to-End* (E2E) setelah semua komponen digabungkan.
    *   *Contoh di Proyek:* Menyimulasikan skenario penuh dari: Pindai QR $\rightarrow$ Daftar Waiting List $\rightarrow$ Pilih Menu $\rightarrow$ Masuk Pesanan $\rightarrow$ Pembayaran Selesai.
*   **User Acceptance Testing (UAT):** Validasi akhir yang dilakukan dengan pengguna nyata/klien untuk mengonfirmasi bahwa perangkat lunak sudah siap *deploy*.
    *   *Contoh di Proyek:* Mengundang perwakilan pemegang kepentingan (misal: staf kasir/manajer cafe) untuk mencoba aplikasi dan memastikan alur operasionalnya sudah sesuai standar cafe.

---

## 2. Pemahaman tentang Desain Pengujian Black Box dan White Box
Desain pengujian menentukan *cara pandang* kita saat menguji aplikasi. Saya memahaminya sebagai dua strategi utama yang bekerja secara berdampingan:

### A. Black Box Testing (Pengujian Perilaku/Fungsional)
Pengujian yang sepenuhnya berfokus pada fungsionalitas aplikasi (Input $\rightarrow$ Output) tanpa perlu melihat bagaimana struktur kode di dalamnya bekerja. Mirip seperti pengguna biasa yang menggunakan aplikasi.
*   **Fokus:** Validasi UI/UX, aliran sistem fungsional, dan penanganan *error input*.
*   **Implementasi di Proyek Kita:**
    *   Menguji *form input* pelanggan di halaman "Gabung Waiting List": memastikan sistem menolak (memunculkan pesan *error*) jika form nomor meja dikosongkan.
    *   Mengeklik tombol proses transaksi di kasir dan mengecek apakah struk muncul, tanpa peduli *query database* apa yang dieksekusi di belakang layar.

### B. White Box Testing (Pengujian Struktural/Logika Internal)
Pengujian yang membutuhkan akses dan pemahaman mendalam terhadap *source code*. Bertujuan untuk memverifikasi alur logika (*logic flow*), percabangan (*branching*), dan keamanan kode.
*   **Fokus:** Eksekusi tiap baris kode (*Statement Coverage*), kondisi `if-else` (*Branch Coverage*), dan optimasi algoritma.
*   **Implementasi di Proyek Kita:**
    *   Menguji langsung fungsi API/Server Action (`queue.ts`) untuk memastikan kondisi logika *backend*: *jika (if)* kapasitas cafe penuh, maka pelanggan dialihkan ke status *Waiting List*, dan *jika (else)* kosong, statusnya langsung "Seated".
    *   Memeriksa efisiensi *Prisma Query* pada pemanggilan data pesanan yang besar agar sistem kasir tidak mengalami *lag*.
