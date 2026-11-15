# Google Stitch UI/UX Prompt
## ServiceTrack — Web Application Interface Generation Prompt

Copy and paste the entire prompt below directly into Google Stitch (https://stitch.withgoogle.com/):

```text
Create a modern, responsive, professional web application interface for "ServiceTrack" (A Workshop Repair Service & Tracking System) styled with Tailwind CSS, Inter/Plus Jakarta Sans typography, and an ultra-clean SaaS dashboard aesthetic.

Key Layout and Components Specification:

1. Top Navigation / Header Bar:
   - Left side: Application logo/brand featuring a subtle wrench/shield icon, with bold title "ServiceTrack" and subtitle "Workshop Service Management & Tracking System".
   - Right side: System health badge displaying "Supabase Connected" with a glowing, pulsating emerald green dot (bg-emerald-500) and current active user role pill labeled "Petugas Servis".

2. Top Metric / KPI Summary Cards (3-Column Grid):
   - Card 1 (Active In-Progress): Slate/Blue accent icon, showing the total count of devices currently in workflow (Status: Diterima, Diperiksa, Diproses).
   - Card 2 (Completed & Handed Over): Emerald accent icon, showing count of finished repairs (Status: Selesai, Diambil).
   - Card 3 (Total Revenue): Indigo accent icon, displaying the total sum of finalized repair fees formatted in Indonesian Rupiah (e.g., "Rp 1.450.000").
   - Each card must feature a clean white surface (bg-white), subtle border (border-slate-200), smooth shadow (shadow-sm), rounded-xl edges, and clear micro-labels.

3. Main Split-Screen Layout (2 Columns on Desktop, Single Column Stacking on Mobile):

   - Left Column (Input & Edit Form Card - 40% Width):
     - Card Header: Dynamic title switching between "Penerimaan Servis Baru" and "Edit Data & Biaya Servis", plus an ID badge indicator.
     - Persistent Alert Error Box: A prominent red warning box (bg-rose-50 border border-rose-200 text-rose-700 rounded-lg p-3 text-sm flex items-center gap-2 hidden by default) that displays validation messages such as "Biaya akhir tidak boleh bernilai negatif (minimal 0)".
     - Form Fields:
       * Nomor Servis: Input field with lock/ticket icon, styled as readonly/auto-generated with placeholder "SRV-YYYYMM-XXX".
       * Nama Pelanggan: Clean text input with user icon and placeholder "cth. Ahmad Fauzi".
       * Nama Barang: Text input with device icon and placeholder "cth. Laptop ASUS ROG Zephyrus G14".
       * Status Pengerjaan: Styled dropdown (<select>) with options: "Diterima", "Diperiksa", "Diproses", "Selesai", "Diambil".
       * Biaya Akhir: Currency input field prefixed with an in-input "Rp" tag and placeholder "0.00", with helper text "Isi nominal saat servis Selesai atau Diambil".
     - Action Buttons:
       * Primary "Simpan Data" button (bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 px-4 rounded-lg shadow-sm transition-all flex items-center justify-center gap-2).
       * Secondary "Batal / Reset" button (bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-2.5 px-4 rounded-lg transition-all).

   - Right Column (Data Management, Table, Search & Filter - 60% Width):
     - Control Bar: A search input with search glass icon ("Cari no servis, pelanggan, barang...") coupled with a status filter select dropdown ("Semua Status", "Diterima", "Diperiksa", "Diproses", "Selesai", "Diambil").
     - Data Table Container: Full-width responsive table with sticky header (bg-slate-50 text-slate-500 uppercase text-xs tracking-wider border-b border-slate-200).
     - Table Columns:
       1. No. Servis (bold monospace font, slate-900)
       2. Pelanggan (text-slate-800 font-medium)
       3. Barang (text-slate-600 text-sm)
       4. Status Badge with color coding:
          - Diterima: Slate badge (bg-slate-100 text-slate-700 border-slate-200)
          - Diperiksa: Amber badge (bg-amber-50 text-amber-700 border-amber-200)
          - Diproses: Blue/Sky badge (bg-blue-50 text-blue-700 border-blue-200)
          - Selesai: Emerald badge (bg-emerald-50 text-emerald-700 border-emerald-200)
          - Diambil: Purple badge (bg-purple-50 text-purple-700 border-purple-200)
       5. Biaya Akhir (formatted as currency "Rp 150.000", font-semibold)
       6. Aksi (Inline action buttons: an Edit pencil icon button and a Delete trash icon button in rose-500).
     - Empty State Display: Centered placeholder with a wrench illustration or icon, title "Belum Ada Data Servis", and descriptive text "Silakan tambahkan data transaksi servis baru melalui formulir di sebelah kiri".

Visual Style & Tone:
- Clean, minimal, airy padding, rounded-xl containers, subtle borders (border-slate-200), high contrast readability, modern professional dashboard design suitable for workshops and computer service centers.
```
