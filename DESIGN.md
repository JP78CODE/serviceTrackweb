# Design System & UI Guidelines
## ServiceTrack — Application Interface Standards

Dokumen ini mendefinisikan panduan visual, token warna, tipografi, dan standar interaksi komponen antarmuka yang wajib diimplementasikan oleh AI Coding Assistant pada seluruh file antarmuka (frontend).

---

### 1. Palet Warna Tailwind CSS

Desain antarmuka ServiceTrack menggunakan sistem warna fungsional berbasis Tailwind CSS:

* **Background Utama Aplikasi:** `bg-slate-50` (memberikan kontras bersih dan tidak membuat mata lelah).
* **Surface & Card Container:** `bg-white border border-slate-200 rounded-xl shadow-sm`.
* **Primary / Aksi Utama:**
  * Default: `bg-indigo-600 text-white`
  * Hover: `hover:bg-indigo-700`
  * Focus / Ring: `focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1`
* **Warna Status & Indikator Fungsional:**
  * **Sukses / Selesai (`Selesai`):** `bg-emerald-50 text-emerald-700 border-emerald-200` (Badge) & `text-emerald-600` (Icon/Text).
  * **Tahap Awal (`Diterima`):** `bg-slate-100 text-slate-700 border-slate-200`.
  * **Tahap Investigasi (`Diperiksa`):** `bg-amber-50 text-amber-700 border-amber-200`.
  * **Tahap Pengerjaan (`Diproses`):** `bg-blue-50 text-blue-700 border-blue-200`.
  * **Tahap Penyerahan (`Diambil`):** `bg-purple-50 text-purple-700 border-purple-200`.
* **Bahaya / Error / Hapus (`Danger`):**
  * Alert Box: `bg-rose-50 border border-rose-200 text-rose-700`.
  * Tombol Hapus: `text-rose-600 hover:text-rose-800 hover:bg-rose-50`.
* **Tipografi & Teks:**
  * Heading: `text-slate-900 font-bold`.
  * Body text: `text-slate-700 font-normal`.
  * Muted / Label text: `text-slate-500 text-sm`.
  * Monospace (No. Servis): `font-mono text-slate-800 font-semibold`.

---

### 2. Tipografi & Lokalisasi Format (id-ID)

* **Font Family:** `font-sans` menggunakan font sistem modern: `'Inter', 'Plus Jakarta Sans', system-ui, sans-serif`.
* **Format Mata Uang Rupiah:**
  Wajib diformat menggunakan API bawaan browser `Intl.NumberFormat` untuk locale Indonesia (`id-ID`):
  ```javascript
  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(number || 0);
  };
  ```
* **Format Tanggal & Waktu:**
  Wajib diformat dalam Bahasa Indonesia:
  ```javascript
  const formatTanggal = (dateString) => {
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(dateString));
  };
  ```

---

### 3. Aturan Standar Komponen Interaktif

#### A. Status Tombol & Loading State
* Saat operasi asinkron ke Supabase berlangsung (Insert/Update/Delete), tombol simpan wajib:
  1. Diberikan atribut `disabled = true`.
  2. Mengganti icon/teks menjadi icon spinner animasi (`animate-spin`) dan teks *"Menyimpan..."*.
  3. Mengubah opacity tombol menjadi `opacity-70 cursor-not-allowed`.

#### B. Alert Banner Error Box (Validasi Input)
* Alert box ditempatkan persis di atas form input.
* Kondisi awal: Tersembunyi (`class="hidden"`).
* Saat validasi gagal (misal nominal negatif atau field kosong):
  * Hapus class `hidden`.
  * Tampilkan ikon peringatan (`svg` alert exclamation).
  * Render teks pesan kesalahan secara jelas dan spesifik.

#### C. Empty State Tabel
* Jika data transaksi servis kosong atau hasil pencarian tidak ditemukan:
  * Tampilkan baris khusus dengan `colspan="6"` yang berisi container sentral.
  * Tampilkan icon dokumen/perbaikan berwarna abu-abu netral (`text-slate-300`).
  * Sertakan judul *"Belum Ada Data Servis"* dan instruksi bantuan *"Gunakan form di sebelah kiri untuk mencatat transaksi baru"*.

#### D. Modal Konfirmasi Hapus Data
* Penghapusan baris data DILARANG menggunakan `window.confirm()` bawaan browser.
* Wajib menggunakan custom modal dialog bertema Tailwind CSS dengan *backdrop blur* (`bg-slate-900/40 backdrop-blur-sm`), yang menampilkan Nomor Servis dan nama pemilik yang akan dihapus, serta tombol konfirmasi merah bertuliskan *"Ya, Hapus Data"*.
