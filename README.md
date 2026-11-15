# ServiceTrack — Sistem Pencatatan Servis

Aplikasi manajemen dan pelacakan transaksi servis berbasis web (*single-page application*) yang dibangun dengan **HTML5**, **Tailwind CSS**, **Vanilla JavaScript**, dan **Supabase (PostgreSQL)**, mengacu penuh pada dokumen **Spesifikasi Kebutuhan Perangkat Lunak (SKPL)**.

---

## 🚀 Fitur Utama Sistem

* **Penerimaan Servis (Create / REQ-01):** Formulir pendaftaran unit servis dengan pembuatan nomor servis unik otomatis (`no_servis`), input nama pelanggan, nama perangkat/barang, status awal `'Diterima'`, dan biaya awal `0`.
* **Tracking Status Bertahap (Read & Update / REQ-02):** Pelacakan antrean pengerjaan 5 level (*multi-stage*):
  $$\text{Diterima} \rightarrow \text{Diperiksa} \rightarrow \text{Diproses} \rightarrow \text{Selesai} \rightarrow \text{Diambil}$$
* **Pencatatan Biaya Akhir (Update / REQ-03):** Pencatatan nominal biaya akhir servis saat unit selesai atau diambil, terintegrasi dengan perhitungan akumulasi otomatis di kartu KPI/metrik.
* **Manajemen & Penghapusan Data (Delete / REQ-04):** Aksi hapus transaksi yang dilengkapi modal konfirmasi dialog aman (tanpa `alert` bawaan).
* **Live Search & Status Filter (REQ-05):** Penyaringan data secara instan berdasarkan kata kunci (Nomor Servis, Nama Pelanggan, Barang) dan filter per status pengerjaan.
* **Keamanan Berlapis (Anti-XSS & Anti Secret Key Leakage):** Dilengkapi sanitasi DOM teks (`.textContent` & `escapeHtml`), validasi ketat sisi klien sebelum mutasi, dan pembatasan hanya pada `anon_key` publik.

---

## 📁 Struktur Berkas Repositori

```text
serviceTrackweb/
├── index.html            # Antarmuka web utama (Tailwind CSS + Supabase JS Client)
├── PRD.md                # Product Requirements Document (Spesifikasi Lengkap & QA Contract)
├── DESIGN.md             # Design System & UI Guidelines (Palet Tailwind, Tipografi, Komponen)
├── RULES.md              # AI Coding & Security Guardrails (Aturan Anti-XSS & Validasi Input)
├── STITCH_PROMPT.md      # Prompt desain UI/UX siap pakai untuk Google Stitch
├── supabase_schema.sql   # Skrip DDL PostgreSQL, RLS Policies, Constraints, & Dummy Data
├── .gitignore            # Berkas pengecualian Git
└── README.md             # Dokumentasi proyek dan panduan setup
```

---

## 🛠️ Panduan Memulai (Setup & Menjalankan)

### 1. Setup Database di Supabase
1. Buka proyek Anda di [Supabase Dashboard](https://supabase.com/dashboard).
2. Masuk ke menu **SQL Editor**.
3. Salin seluruh isi berkas [`supabase_schema.sql`](supabase_schema.sql) dan jalankan (**Run**).
4. Tabel `services`, aturan `CHECK constraint`, `Row Level Security (RLS)`, dan 3 data dummy awal akan langsung terpasang.

### 2. Menjalankan Aplikasi Web
1. Buka file [`index.html`](index.html) langsung di browser Anda (atau gunakan ekstensi *Live Server* di VS Code).
2. Klik ikon gerigi / badge status di pojok kanan atas untuk memasukkan:
   * **Supabase URL:** `https://<project-ref>.supabase.co`
   * **Supabase Anon Key:** `<anon-public-key>`
3. Klik **Simpan & Hubungkan**. Indikator status akan berubah menjadi hijau (**Supabase Connected**) dan data akan langsung disinkronkan.
4. *Catatan:* Jika belum memiliki kredensial Supabase, aplikasi tetap dapat dijalankan dalam **Mode Demo / Offline (Local Storage)** dengan data awal realistis.

---

## 🧪 Panduan Verifikasi Pengujian (QA Testing Matrix)

| Test ID | Skenario | Langkah Pengujian | Hasil yang Diharapkan |
| :--- | :--- | :--- | :--- |
| **TC-01** | Update Status Servis & Biaya Akhir | Klik edit pada salah satu data, ubah status ke **Selesai**, isi Biaya Akhir **150000**, klik Simpan. | Status berubah menjadi **Selesai**, biaya tercatat **Rp 150.000**, dan kartu pendapatan bertambah. (**PASS**) |
| **TC-02** | Validasi Biaya Negatif | Masukkan nominal **-50000** pada input Biaya Akhir dan klik Simpan. | Muncul Alert Box merah: *"Biaya akhir tidak boleh bernilai negatif (minimal 0)"*, proses simpan dibatalkan. (**PASS**) |
| **SEC-01** | Anti-XSS Test | Input `<img src=x onerror=alert(1)>` pada field Nama Pelanggan atau Nama Barang. | Tidak muncul dialog alert box; teks payload dirender aman sebagai teks murni di tabel. (**PASS**) |
| **SEC-02** | Frontend Credential Audit | Periksa berkas kode dan network request browser. | Tidak ada secret/service role key yang terekspos; hanya menggunakan public `anon_key`. (**PASS**) |

---

## 👨‍💻 Kontributor & Lisensi
Dikembangkan untuk implementasi **Sistem Pencatatan Servis (ServiceTrack)**.
Repository: [JP78CODE/serviceTrackweb](https://github.com/JP78CODE/serviceTrackweb.git)
