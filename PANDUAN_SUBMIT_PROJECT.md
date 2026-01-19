# Panduan Submit Project (ANSI - Kelompok 2)

Panduan ini disusun untuk membantu proses pengumpulan tugas sesuai dengan instruksi dosen.

## 1. Persiapan Struktur Folder

Pastikan struktur folder project kamu terlihat rapi sebelum di-push. Disarankan memiliki struktur seperti berikut:

```
ansi-thai-cafe/
├── file_mockup/          <-- (Sudah ada) Berisi file mockup/aplikasi
├── file_presentasi/      <-- (Sudah ada) Berisi PPT (e.g., Presentasi Project ANSI Kelompok 2.pptx)
├── dokumen_proyek/       <-- (PERLU DIBUAT) Buat folder ini untuk menyimpan dokumen laporan
│   └── Dokumen_Proyek.pdf (atau .docx)
├── README.md             <-- File README utama
└── ... (file project lainnya: app, components, dll)
```

> **Catatan:** Jika `dokumen_proyek` belum ada, silakan buat foldernya dan masukkan file Dokumen Proyek kamu di sana.

## 2. Lengkapi Dokumen Proyek

Sesuai instruksi nomor 3:

> _"Wajib mencantumkan link GitHub masing-masing anggota pada lampiran Dokumen Proyek."_

Buka file **Dokumen Proyek** kamu (Word/PDF), lalu pada bagian **Lampiran** atau **Profil Tim**, tambahkan daftar seperti ini:

- **Nama Anggota 1**: [Link GitHub]
- **Nama Anggota 2**: [Link GitHub]
- ... dst

Pastikan dokumen ini di-save dan diletakkan di dalam folder `dokumen_proyek` (atau folder yang relevan).

## 3. Cara Push ke GitHub

Ikuti langkah-langkah di bawah ini menggunakan terminal (PowerShell/CMD/Git Bash):

### Langkah 3.1: Cek Status File

Pastikan kamu berada di folder root project (`d:\AntigravityAI-Agent\ansi-thai-cafe`).

```bash
git status
```

_Kamu akan melihat file/folder yang belum ter-upload (berwarna merah)._

### Langkah 3.2: Tambahkan dan Simpan Perubahan (Commit)

Masukkan semua file ke dalam "staging area":

```bash
git add .
```

Simpan perubahan dengan pesan commit yang jelas:

```bash
git commit -m "feat: Menambahkan dokumen proyek, PPT, dan mockup untuk submission final"
```

### Langkah 3.3: Push ke GitHub

**Metode A: Menggunakan Terminal (Disarankan)**
Kirim file ke repository GitHub (pastikan internet lancar):

```bash
git push origin main
```

**Metode B: Upload via Website GitHub (Alternatif)**
Jika terkendala menggunakan terminal, kamu bisa upload manual:

1.  Buka repository GitHub kamu di browser.
2.  Klik tombol **Add file** > **Upload files**.
3.  Drag & drop file/folder dari komputermu ke area upload.
    - _Note: Untuk folder `dokumen_proyek` dan `file_presentasi`, pastikan kamu drag satu folder utuh._
4.  Tulis pesan commit di kotak "Commit changes" (contoh: "Add project files").
5.  Klik tombol hijau **Commit changes**.

_(Catatan: Jika branch utama kamu bernama `master`, ganti `main` dengan `master`)._

## 4. Format Pengumpulan Email

Setelah semua file tersimpan di GitHub, saatnya mengirim email.

- **Tujuan/To**: (E-mail Dosen)
- **Subject**: `TR_ANSI_NamaKelompok_NamaKelas`
  - _Contoh_: `TR_ANSI_Kelompok2_TI-3A`
- **Isi Email**:
  - **Link GitHub**: (Copy link repository GitHub kamu di sini)
  - **Lampiran (Opsional tapi disarankan)**:
    - Bisa lampirkan file PPT dan Dokumen Proyek langsung di email sebagai backup, meskipun sudah ada di GitHub.

### Ceklis Akhir Sesuai Syarat Dosen:

- [ ] Link GitHub dapat diakses (tidak private/pastikan dosen bisa akses).
- [ ] Di dalam GitHub ada **Dokumen Proyek**.
- [ ] Di dalam GitHub ada **File Presentasi (PPT)**.
- [ ] Di dalam GitHub ada **Aplikasi Mockup**.
- [ ] Di dalam Dokumen Proyek ada **Link GitHub per anggota**.
- [ ] Subject email sudah benar.
