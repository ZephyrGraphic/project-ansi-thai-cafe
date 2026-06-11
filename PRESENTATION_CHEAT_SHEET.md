# 🎤 Materi Slide & Script Presentasi UTS STQA
**Proyek:** Sistem Aplikasi POS dan Self-Ordering ANSI Thai Cafe  
**Estimasi Waktu Presentasi:** 10 - 15 Menit  

---

## 🖥 Slide 1: Judul Presentasi

**📝 Teks untuk di-Copy ke PPT:**
> **Pengujian Terintegrasi Sistem POS & Self-Ordering ANSI Thai Cafe**
> Laporan Ujian Tengah Semester (UTS) - Software Testing and Quality Assurance (STQA)
> 
> *Disusun oleh:* 
> [Nama Mahasiswa/Kelompok]

**🗣 Script Pembicara:**  
"Selamat pagi/siang Bapak/Ibu Dosen dan rekan-rekan sekalian. Pada kesempatan ini, [Saya/Kami] akan memaparkan hasil laporan akhir pengujian perangkat lunak kami sebagai proyek tengah semester. Sistem yang kami uji adalah 'Sistem Aplikasi POS dan Self-Ordering ANSI Thai Cafe', sebuah aplikasi manajemen F&B terpadu berbasis antarmuka web."

---

## 🖥 Slide 2: Latar Belakang & Tujuan Pengujian

**📝 Teks untuk di-Copy ke PPT:**
> **Latar Belakang:**
> • ANSI Thai Cafe mengadopsi 2 modul sistem utama: *POS Kasir* dan *Self-Ordering QR Pelanggan*.
> • Melibatkan pengguna *real-time* yang beragam (Manajer, Staf, Pelanggan, Dapur).
> • Membutuhkan reabilitas performa transaksi yang tinggi tanpa duplikasi data.
> 
> **Tujuan Pengujian:**
> 1. Menjamin fungsionalitas sistem berjalan sesuai ekosistem *Business Requirements*.
> 2. Menghilangkan dan menekan kemungkinan *bug/error* di antarmuka klien dan logika *backend*.
> 3. Mengevaluasi pengalaman pengguna (*User Experience*) melalui indeks *System Usability Scale* (SUS).

**🗣 Script Pembicara:**  
"Karena aplikasi ini diakses secara bersamaan—misalnya saat pelanggan memesan via HP sembari kasir melayani pengunjung *dine-in* lain—maka potensi *bug* operasional sangat berisiko. Tujuan esensial dari pengujian dan evaluasi ini adalah memastikan tidak ada logika keranjang (*cart*) yang bertabrakan, mengamankan jalaur transaksi, serta membuktikan aplikasi kami ramah digunakan (*user friendly*) oleh lansia maupun Gen-Z."

---

## 🖥 Slide 3: Peta Interaksi Sistem (Model UML)

**📝 Teks untuk di-Copy ke PPT:**
> **Use Case Diagram ANSI Thai Cafe**
> *(Masukkan Gambar Use Case Diagram di sini)*
> 
> • **Aktor Kasir & Manajer:** Fokus pada POS Kendali, Kelola Menu, dan Eksekusi *Waiting List*.
> • **Aktor Pelanggan:** Memiliki otoritas pemesanan mandiri via siklus *Scan QR -> Cart -> Checkout*.

**🗣 Script Pembicara:**  
"Sebagai *overview* arsitektur, silakan melihat *Use Case Diagram* pasca rilis STQA kami. Pembaruan yang paling penting di sini adalah pemisahan garis komando. Kami sukses memindahkan beban antrean pada kasir ke tangan pelanggan (melalui fitur akses Self-Ordering & Waiting list digital) di mana sistem bertindak sebagai penengah."

---

## 🖥 Slide 4: Eksekusi Testing - Black Box (UI/Fungsional)

**📝 Teks untuk di-Copy ke PPT:**
> **Metode Eksplorasi: Black Box Testing**
> Fokus evaluasi tingkat antarmuka, limitasi input, dan alur interaksi pengguna tanpa melihat kode internal.
> 
> **Modul Utama yang Telah Dites (Status: 100% PASS):**
> • Otentikasi dan Dasbor Sesi Kasir.
> • Interaksi CRUD Menu (*Create, Read, Update, Delete*).
> • Parameter limitasi pesanan (Validasi Harga Kuantitas / Minus).
> • Siklus *Add to Cart* dinamis pada peranti pelanggan.
> • Algoritma *Waiting List* Digital (Ikut Antrean & Pemanggilan).

**🗣 Script Pembicara:**  
"Memasuki tahap pengujian; dimulai dari pengecekan fungsionalitas (Black Box). Hal utama yang menarik dalam *Behavior Validation* kami adalah bagaimana sistem kebal dari manipulasi luaran antarmuka. Saat algoritma kami di-test dengan mengeklik 'Checkout' tanpa item di dalam keranjang kasir, atau memasukkan jumlah porsi bernilai minus (-), sistem sukses me-*reject* permintaan tersebut dan tidak menduplikasi *error* ke *server*."

---

## 🖥 Slide 5: Eksekusi Testing - White Box (Coverage Logic)

**📝 Teks untuk di-Copy ke PPT:**
> **Metode Eksplorasi: White Box Testing**
> Pengecekan struktural level *source-code*, perhitungan kalkulasi, iterasi algoritma, dan transaksi database.
> 
> **Tinjauan Analisis Jalur Kode (Status: PASS):**
> • **Node Loop Kalkulasi:** Iterasi tagihan & pembacaan kupon diskon tanpa terjadi kebocoran *memory loop*.
> • **Isolasi Database (Atomic):** Eksekusi `prisma.$transaction` mencegah konkurensi (tabrakan) simpan pesanan pelanggan ganda saat stok tersisa rendah.
> • **JWT Validation:** Pengecekan percabangan rute apabila terdeteksi *token* berstatus tidak valid / *expired*.

**🗣 Script Pembicara:**  
"Terkait bedah *Source Code*, evaluasi algoritma **White Box Testing** meverifikasi kalkulasi matematis finansial sistem POS yang kompleks. Dan satu hal krusial: Untuk proteksi antrean database order, sistem memakai fungsi *transaction* isolasi. Artinya, jika 2 orang secara serentak mengklik checkout berebut pesanan terakhir yang stoknya hanya 1, kode kami hanya menyimpan *request* persetujuan pertama dan yang terlambat langsung di-*Rollback* (Dibatalkan) tanpa eror sistem fatal."

---

## 🖥 Slide 6: Eksekusi Testing - Gray Box (Security Integration)

**📝 Teks untuk di-Copy ke PPT:**
> **Metode Eksplorasi: Gray Box Testing**
> Investigasi ketahanan parameter URL, Eskalasi Jalur Autentikasi, dan Interupsi Jaringan antara Klien-API (Middleware).
> 
> **Skema Eksploitasi & Hasil:**
> • **Manipulasi Payload / Bypass ID:** (Status: AMAN) - Injeksi *ID Table fiktif* ditangkis elegan via `HTTP 404 Response`.
> • **Role Security Middleware:** (Status: AMAN) - Sesi *cookies* level pelanggan tertolak absolut (*HTTP 403 Forbidden*) jika menyerang Endpoint khusus Kasir/Admin.

**🗣 Script Pembicara:**  
"Sebagai pelengkap pengaman keamanan jaringan (Gray Box testing); Kami menyimulasikan diri kita memosisikan sebagai pihak iseng. Apa jadinya jika pelanggan bermain curang merubah *parameter* ID meja 5 di layar URL-nya ke Meja 899 (fiktif)? Integrite API pelindung berhasil berfungsi mencegat mutasi itu di sistem belakang meredam *crash* dengan me-return JSON respose sederhana: Table Not Found. Proteksi rute ini terbukti efektif."

---

## 🖥 Slide 7: Evaluasi User Experience (Metodologi SUS)

**📝 Teks untuk di-Copy ke PPT:**
> **System Usability Scale (SUS) Evaluation**
> Mengukur indeks persepsi kemudahan aplikasi di lapangan berdasarkan pedoman standar *Human-Computer Interaction*.
> 
> **Profil 10 Responden Realistis Lintas Aktor:**
> • (R1) Manajer Operasional Restoran
> • (R2) Staf Kasir Utama & (R3) Kasir Pengganti
> • (R4) Pelayan / *Waitress*
> • (R5) Kepala Koki / Dapur Eksekutor
> • (R6) Administrator Sistem IT
> • (R7 - R10) *Sample* Pelanggan dengan demografi Usia Berbeda (Dewasa, Lansia, Remaja, Turis/Gen-Z)

**🗣 Script Pembicara:**  
"Kualitas aplikasi tak semata dari teknis *coding*, namun juga bagaimana kemudahaan interaksi dengan interfacenya (Manusia ke Komputer). Kami menggunakan kuisioner *System Usability Scale* baku (10 pertanyaan skala likert). Agar tidak subjektif, survei tidak disebarkan ke sesama progranmer teman, namun diekstrak spesifik pada ragam spektrum *Stakeholder* bisnis, meliputi manajer, koki dan demografi pelanggan campuran."

---

## 🖥 Slide 8: Hasil Akhir & Grade SUS

**📝 Teks untuk di-Copy ke PPT:**
> **Kumulatif Hasil Skor SUS Sistem ANSI Thai Cafe**
> 
> **SKOR RATA-RATA AKHIR: 83.25**  
> Melampaui *Global Baseline* Rata-Rata Industri (68.00).
> 
> **Interpretasi Evaluasi:**
> • **Adjective Rating:** *EXCELLENT* (Sangat Baik / Sangat Relevan).
> • **Insight Temuan:** Kurva pembelajaran adaptasi bagi Manajer/Pelayan terasa instan. Terdapat reduksi tipis nilai pada segmen lansia (R8) akibat resistensi umum adaptasi pemindai kamera (Barcode Scanner).

**🗣 Script Pembicara:**  
"Berdasarkan persilangan rumus formula nilai positif dan negatif 10 responden SUS. Nilai akhir didapatkan adalah: **83.25!** Kami berhasil mendarat di grade mutlak ekskutif (Adjective: Excellent). Catatan paling menarik adalah, mayoritas milenial / Gen-Z memberi kami poin nyaris sekita 99-100, namun aplikasi di nilai agak menantang (sekitar poin 55) bagi kakek/lansia akibat mereka butuh bantuan memposisikan kamera ponsel ke atas gambar QR."

---

## 🖥 Slide 9: Kesimpulan Akhir Pengerjaan

**📝 Teks untuk di-Copy ke PPT:**
> **Kesimpulan Pengujian Terpadu**
> 
> 1. Algoritma POS dan pesanan mandiri pelanggan berstatus **ROBUST (Kokoh)** via Black dan White Box Testing.
> 2. Sistem API Middleware Restoran memiliki arsitektur keamanan (*Gray Box*) teresolusi dengan utuh.
> 3. Skala Penerimaan (SUS) di level **Excellent (83.25)** menjustifikasi rilis fase selanjutnya berstatus **Production/Beta-Ready**.
> 
> ***Status Perangkat Lunak: LULUS PENGUJIAN.***

**🗣 Script Pembicara:**  
"Menyimpulkan keseluruhan bab. Secara mekanis struktural baik *User Interface*, logika *Array* serta proteksi rute di luar batas wajar terkonfirmasi stabil dan berjalan sempurna. Skor SUS *Excellent* ini menyatakan bahwa prototipe ini bukan sebatas skripsi, tetapi layak pakai (commercial/beta-ready). Sekian paparan dokumen dan portofolio testing [Saya/Kami], atas telaah evaluasi STQA Bapak/Ibu dosen sekalian, saya ucapkan terima kasih."
