# Product Requirements Document (PRD)
## Sistem Pencatatan Servis (ServiceTrack)

---

### 1. Identitas & Tujuan Aplikasi
* **Nama Aplikasi:** ServiceTrack (Sistem Pencatatan Servis)
* **Deskripsi Sistem:** Aplikasi manajemen transaksi dan pelacakan servis berbasis web untuk mempermudah tempat servis dalam mencatat penerimaan unit barang servis, memantau status pengerjaan secara bertahap (*multi-stage tracking*), serta mengelola estimasi dan pencatatan biaya akhir servis secara terstruktur dan transparan.
* **Capaian Utama (Main Achievement):** Terbangunnya aplikasi tracking servis berbasis web yang fungsional, mencakup manajemen transaksi servis (CRUD), multi-stage status tracking, dan kalkulasi biaya akhir yang divalidasi melalui pengujian *Black Box*.
* **Tujuan Spesifik:**
  1. Mempermudah pencatatan penerimaan barang servis dan identitas data pelanggan secara cepat dan akurat.
  2. Menyediakan pembaruan status pengerjaan bertahap (*multi-stage progress tracking*).
  3. Mengelola pencatatan estimasi dan penagihan biaya akhir servis secara transparan.
* **Batasan Sistem & Ruang Lingkup (Scope):**
  * Akses sistem diperuntukkan bagi single role: **Petugas Servis**.
  * Tidak mencakup manajemen inventaris *spare part* (suku cadang).
  * Tidak menyediakan portal mandiri pelanggan (*customer online portal*).
  * Tidak mencakup gateway pengiriman notifikasi WhatsApp/SMS otomatis.

---

### 2. Spesifikasi Fungsional Lengkap (CRUD, Tracking, & Filter)

Aplikasi memenuhi seluruh kebutuhan yang dirumuskan pada Modul 1 SKPL (`REQ-01` s/d `REQ-03`) dan disempurnakan menjadi siklus CRUD lengkap:

| ID Kebutuhan | Nama Fitur | Deskripsi Fungsional & Siklus CRUD |
| :--- | :--- | :--- |
| **REQ-01** | **Penerimaan Servis (Create)** | Petugas menginput data servis baru melalui form: sistem menerbitkan Nomor Servis unik (`no_servis`), mencatat nama pelanggan (`nama_pelanggan`), nama barang (`nama_barang`), menetapkan status awal otomatis ke `'Diterima'`, serta menginisialisasi `biaya_akhir` ke `0`. |
| **REQ-02** | **Tracking Status (Read & Update)** | Petugas dapat melacak seluruh antrean pengerjaan dalam tabel interaktif (*Read*) dan memperbarui status pengerjaan servis secara berkala (*Update*) melalui 5 tahapan bertingkat: `Diterima` $\rightarrow$ `Diperiksa` $\rightarrow$ `Diproses` $\rightarrow$ `Selesai` $\rightarrow$ `Diambil`. |
| **REQ-03** | **Biaya & Catatan (Update & Finalize)** | Petugas dapat mencatatkan nominal biaya akhir servis (`biaya_akhir`) saat unit telah selesai dikerjakan (`Selesai`) atau saat diserahkan ke pelanggan (`Diambil`). Sistem menghitung rekapitulasi total pendapatan pada kartu indikator/KPI. |
| **REQ-04** | **Manajemen Data (Delete with Confirmation)** | Petugas dapat menghapus baris data transaksi servis yang dibatalkan atau salah input melalui tombol aksi hapus yang dilengkapi modal dialog konfirmasi demi mencegah kehilangan data akibat ketidaksengajaan. |
| **REQ-05** | **Pencarian & Filter Cepat (Search & Filter)** | Menyediakan *live search* pencarian kata kunci berdasarkan nomor servis, nama pelanggan, atau nama barang, serta filter berbasis dropdown status pengerjaan (`Semua`, `Diterima`, `Diperiksa`, `Diproses`, `Selesai`, `Diambil`). |

---

### 3. Spesifikasi Skema Data (Supabase PostgreSQL)

Skema database mengacu 100% pada tabel dan field Modul 2 SKPL dengan spesifikasi tipe data PostgreSQL dan *database constraints*:

* **Nama Tabel:** `services`

| Nama Kolom | Tipe Data PostgreSQL | Aturan Validasi / Constraint | Keterangan & Relasi |
| :--- | :--- | :--- | :--- |
| `id` | `BIGINT GENERATED ALWAYS AS IDENTITY` | `PRIMARY KEY` | Primary key identitas unik record servis. |
| `no_servis` | `VARCHAR(30)` | `NOT NULL`, `UNIQUE` | Kode transaksi servis unik (contoh: `SRV-202611-001`). |
| `nama_pelanggan` | `VARCHAR(100)` | `NOT NULL`, `CHECK (length(trim(nama_pelanggan)) > 0)` | Nama lengkap pemilik barang servis. |
| `nama_barang` | `VARCHAR(100)` | `NOT NULL`, `CHECK (length(trim(nama_barang)) > 0)` | Tipe dan merek perangkat/barang yang diservis. |
| `status` | `VARCHAR(20)` | `NOT NULL`, `DEFAULT 'Diterima'`, `CHECK (status IN ('Diterima', 'Diperiksa', 'Diproses', 'Selesai', 'Diambil'))` | Tahapan status pengerjaan servis (*multi-stage*). |
| `biaya_akhir` | `DECIMAL(10,2)` | `NOT NULL`, `DEFAULT 0.00`, `CHECK (biaya_akhir >= 0)` | Biaya servis akhir dalam satuan Rupiah (tidak boleh bernilai negatif). |
| `created_at` | `TIMESTAMPTZ` | `NOT NULL`, `DEFAULT NOW()` | Timestamp pencatatan transaksi untuk keperluan audit & pengurutan. |

---

### 4. Kontrak Pengujian Black Box & Keamanan (Acuan Mutlak QA)

Pengujian fungsional dan keamanan wajib lulus (*PASS*) berdasarkan skenario berikut:

| ID Test | Kategori | Skenario Pengujian | Input Data | Hasil yang Diharapkan | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-01** | Fungsional (Modul 3 SKPL) | Update Status Servis & Biaya Akhir | Pilih salah satu record, ubah status ke `Selesai`, dan masukkan Biaya: `150000` | Status berhasil diperbarui menjadi `'Selesai'` dan `biaya_akhir` tersimpan sebesar `Rp 150.000` di database dan antarmuka. | **PASS** |
| **TC-02** | Validasi Negatif | Validasi Nilai Biaya Negatif pada Form | Ubah status ke `Selesai` dan masukkan Biaya: `-50000` | Sistem menolak proses simpan, menghentikan mutasi database, dan memunculkan *Alert Error Box* merah bertuliskan: *"Biaya akhir tidak boleh bernilai negatif (minimal 0)"*. | **PASS** |
| **SEC-01** | Keamanan Data | Uji Sanitasi Input Anti-XSS (Cross-Site Scripting) | Masukkan payload `<img src=x onerror=alert(1)>` pada field `nama_pelanggan` atau `nama_barang` | Script tidak tereksekusi, tidak muncul popup dialog alert XSS di browser; string dirender aman secara literal teks via `.textContent` atau HTML entity encoding. | **PASS** |
| **SEC-02** | Keamanan Kredensial | Audit Ketiadaan Secret Key pada Kode Klien | Inspeksi seluruh berkas `index.html`, script frontend, dan network activity browser | Hanya `SUPABASE_URL` dan `SUPABASE_ANON_KEY` (public key) yang terpasang di sisi klien; tidak terdapat `service_role_key` atau secret key lainnya. | **PASS** |
