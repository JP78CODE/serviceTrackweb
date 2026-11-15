# ServiceTrack — Sistem Pencatatan Servis

Aplikasi manajemen dan pelacakan transaksi servis berbasis web modern yang dibangun dengan **Next.js 14+ (App Router)**, **React 18**, **TypeScript**, **Tailwind CSS**, dan **Supabase (PostgreSQL)**, mengacu penuh pada dokumen **Spesifikasi Kebutuhan Perangkat Lunak (SKPL)**.

---

## 🚀 Fitur Utama Sistem

* **Penerimaan Servis (Create / REQ-01):** Formulir pendaftaran unit servis dengan pembuatan nomor servis unik otomatis (`no_servis`), input nama pelanggan, nama perangkat/barang, status awal `'Diterima'`, dan biaya awal `0`.
* **Tracking Status Bertahap (Read & Update / REQ-02):** Pelacakan antrean pengerjaan 5 level (*multi-stage*):
  $$\text{Diterima} \rightarrow \text{Diperiksa} \rightarrow \text{Diproses} \rightarrow \text{Selesai} \rightarrow \text{Diambil}$$
* **Pencatatan Biaya Akhir (Update / REQ-03):** Pencatatan nominal biaya akhir servis saat unit selesai atau diambil, terintegrasi dengan perhitungan akumulasi otomatis di kartu KPI/metrik.
* **Manajemen & Penghapusan Data (Delete / REQ-04):** Aksi hapus transaksi yang dilengkapi custom modal dialog Tailwind konfirmasi aman (tanpa `alert` atau `confirm` bawaan).
* **Live Search & Status Filter (REQ-05):** Penyaringan data secara instan berdasarkan kata kunci (Nomor Servis, Nama Pelanggan, Barang) dan filter per status pengerjaan.
* **Keamanan Berlapis (Anti-XSS & Anti Secret Key Leakage):** Dilengkapi sanitasi DOM teks via React Virtual DOM & helper `escapeHtml`, validasi ketat sisi klien sebelum mutasi, dan pembatasan hanya pada `anon_key` publik (`SEC-02`).

---

## 📁 Struktur Proyek Berbasis Framework (Next.js & TypeScript)

```text
serviceTrackweb/
├── app/
│   ├── globals.css         # Direktif Tailwind CSS & variabel styling
│   ├── layout.tsx          # Root Layout (Fonts Inter & Plus Jakarta Sans, Metadata)
│   └── page.tsx            # Main Dashboard Page (State management & integrasi komponen)
├── components/
│   ├── Header.tsx          # Bar navigasi atas, status indikator, dan role
│   ├── KPICards.tsx        # 3 Kartu Metrik (Servis Aktif, Selesai, Total Pendapatan)
│   ├── StatusBar.tsx       # Baris breakdown kuantitas unit per 5 status
│   ├── ServiceForm.tsx     # Form input/edit servis, alert error box, & loading state
│   ├── ServiceTable.tsx    # Tabel riwayat transaksi, live search, & filter status
│   ├── DeleteModal.tsx     # Custom dialog konfirmasi hapus dengan backdrop blur
│   └── ConfigModal.tsx     # Dialog pengaturan URL & Anon Key Supabase
├── lib/
│   ├── supabase.ts         # Inisialisasi Supabase Client SDK v2 (Browser/Server)
│   ├── types.ts            # Definisi TypeScript interface (Service, ServiceStatus)
│   └── utils.ts            # Helper formatRupiah, formatTanggal, escapeHtml
├── .env.example            # Template variabel lingkungan Supabase publik
├── package.json            # Daftar dependensi (Next.js, React, Tailwind, Supabase)
├── tsconfig.json           # Konfigurasi TypeScript
├── tailwind.config.ts      # Konfigurasi token warna dan font Tailwind
├── postcss.config.mjs      # Konfigurasi PostCSS
├── next.config.mjs         # Konfigurasi Next.js
├── PRD.md                  # Product Requirements Document
├── DESIGN.md               # Design System & UI Guidelines
├── RULES.md                # AI Coding & Security Guardrails
├── STITCH_PROMPT.md        # Prompt desain UI/UX Google Stitch
├── supabase_schema.sql     # Skrip DDL PostgreSQL, RLS Policies, Constraints, & Dummy Data
├── index.html              # Versi Standalone Single-File (Dapat langsung dibuka di browser)
└── README.md               # Dokumentasi proyek
```

---

## 🛠️ Panduan Menjalankan Proyek

### 1. Prasyarat Lingkungan
Pastikan komputer Anda telah terinstal **Node.js** (versi 18.17 atau lebih baru) dan **npm** / **pnpm** / **yarn**.

### 2. Instalasi Dependensi
Buka terminal pada folder proyek ini dan jalankan:
```bash
npm install
```

### 3. Konfigurasi Supabase
1. Salin berkas `.env.example` menjadi `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
2. Isi nilai kredensial dengan Project URL dan Public Anon Key dari proyek Supabase Anda:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
   ```
3. Jalankan script [`supabase_schema.sql`](supabase_schema.sql) pada menu **SQL Editor** di Supabase Dashboard untuk menyiapkan tabel dan keamanan RLS.

### 4. Menjalankan Server Pengembangan (Dev Server)
```bash
npm run dev
```
Buka browser dan akses di [http://localhost:3000](http://localhost:3000).

*(Catatan: Anda juga tetap dapat membuka file `index.html` langsung di browser tanpa Node.js sebagai versi standalone).*

---

## 🧪 Panduan Verifikasi Pengujian (QA Matrix)

| Test ID | Skenario | Langkah Pengujian | Hasil yang Diharapkan |
| :--- | :--- | :--- | :--- |
| **TC-01** | Update Status Servis & Biaya Akhir | Klik icon Edit pada baris servis, ubah status ke **Selesai**, isi Biaya Akhir **150000**, klik Simpan. | Status berubah menjadi **Selesai**, biaya tercatat **Rp 150.000**, dan kartu pendapatan bertambah. (**PASS**) |
| **TC-02** | Validasi Biaya Negatif | Masukkan nominal **-50000** pada input Biaya Akhir dan klik Simpan. | Muncul Alert Box merah: *"Biaya akhir tidak boleh bernilai negatif (minimal 0)"*, form menolak mutasi. (**PASS**) |
| **SEC-01** | Anti-XSS Test | Masukkan `<img src=x onerror=alert(1)>` pada field Nama Pelanggan atau Nama Barang. | Teks payload dirender aman sebagai teks murni via React Virtual DOM tanpa memunculkan alert. (**PASS**) |
| **SEC-02** | Credential Audit | Periksa network tab dan source code di browser. | Tidak ada secret/service role key yang terekspos ke klien; hanya menggunakan public `anon_key`. (**PASS**) |

---

## 👨‍💻 Kontributor & Lisensi
Dikembangkan untuk implementasi **Sistem Pencatatan Servis (ServiceTrack)**.
Repository: [JP78CODE/serviceTrackweb](https://github.com/JP78CODE/serviceTrackweb.git)
