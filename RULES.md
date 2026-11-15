# AI Coding & Security Guardrails
## ServiceTrack — Aturan Baku Pengembangan & Keamanan

File ini adalah instruksi kepatuhan mutlak bagi AI Coding Assistant saat menulis atau memodifikasi kode program ServiceTrack di VS Code.

---

### 1. Kepatuhan Skema & Spesifikasi (Schema Consistency)
1. **Nama Tabel Database:** Wajib `services` (huruf kecil, persis sesuai Modul 2 SKPL).
2. **Nama Kolom Database:** Wajib persis:
   * `id`
   * `no_servis`
   * `nama_pelanggan`
   * `nama_barang`
   * `status`
   * `biaya_akhir`
   *(Kolom `created_at` diperbolehkan sebagai timestamp sistem).*
3. **Nilai Valid Kolom `status`:** Hanya boleh menerima 5 status berikut:
   `'Diterima'`, `'Diperiksa'`, `'Diproses'`, `'Selesai'`, `'Diambil'`.

---

### 2. Aturan Mutlak Anti-XSS (`SEC-01`)
* **DILARANG KERAS** menggunakan manipulasi DOM yang mengeksekusi string HTML mentah dari input pengguna atau database tanpa sanitasi, seperti:
  * ❌ `element.innerHTML = ...`
  * ❌ `element.outerHTML = ...`
  * ❌ `document.write(...)`
* **WAJIB** menerapkan salah satu dari dua metode render aman berikut:
  1. Menggunakan properti `.textContent` saat menginjeksi data teks dinamis:
     ```javascript
     const customerCell = document.createElement('td');
     customerCell.textContent = service.nama_pelanggan; // AMAN dari XSS
     ```
  2. Atau melewatkan teks melalui fungsi sanitasi encoding entitas HTML sebelum digabungkan ke template string:
     ```javascript
     function escapeHtml(str) {
       if (str === null || str === undefined) return '';
       return String(str)
         .replace(/&/g, '&amp;')
         .replace(/</g, '&lt;')
         .replace(/>/g, '&gt;')
         .replace(/"/g, '&quot;')
         .replace(/'/g, '&#39;');
     }
     ```
* **Verifikasi QA:** Payload pengujian `<img src=x onerror=alert(1)>` yang diinputkan pada kolom nama atau barang WAJIB tertera sebagai teks murni di layar dan tidak boleh mengeksekusi fungsi `alert()`.

---

### 3. Aturan Mutlak Validasi Input (`TC-01` & `TC-02`)
* DILARANG hanya mengandalkan atribut HTML5 seperti `required` atau `min="0"` pada tag `<input>`, karena atribut tersebut dapat dimatikan dengan mudah oleh pengguna via browser Developer Tools (*Inspect Element*).
* **Wajib Validasi Sisi Klien (JavaScript Pre-flight Check):**
  Sebelum mengirimkan query `insert` atau `update` ke Supabase, fungsi JavaScript wajib memvalidasi logika berikut:
  ```javascript
  // 1. Validasi String Kosong
  if (!nama_pelanggan.trim() || !nama_barang.trim()) {
    showError("Nama pelanggan dan nama barang wajib diisi.");
    return false;
  }

  // 2. Validasi TC-02: Biaya Akhir Tidak Boleh Negatif
  const nominalBiaya = parseFloat(biaya_akhir);
  if (isNaN(nominalBiaya) || nominalBiaya < 0) {
    showError("Biaya akhir tidak boleh bernilai negatif (minimal 0)");
    return false;
  }

  // 3. Validasi Konsistensi Status
  const validStatus = ['Diterima', 'Diperiksa', 'Diproses', 'Selesai', 'Diambil'];
  if (!validStatus.includes(status)) {
    showError("Status pengerjaan servis tidak valid.");
    return false;
  }
  ```
* Jika validasi di atas gagal:
  1. Hentikan eksekusi pengiriman data.
  2. Tampilkan pesan kesalahan persis di dalam elemen Alert Error Box merah.
  3. Arahkan fokus kursor (`focus()`) kembali ke field yang bermasalah.

---

### 4. Aturan Keamanan Kredensial & Supabase (`SEC-02`)
1. **Pemisahan Kunci Akses:**
   * File klien (`index.html` / `app.js`) HANYA BOLEH memuat kredensial publik:
     * `SUPABASE_URL`
     * `SUPABASE_ANON_KEY`
2. **Larangan Secret Key:**
   * DILARANG KERAS mencantumkan `SUPABASE_SERVICE_ROLE_KEY`, password database PostgreSQL, atau private token apa pun di dalam repositori frontend.
3. **Inisialisasi Client Supabase:**
   Inisialisasi klien Supabase di file HTML/JS wajib menggunakan pola resmi CDN:
   ```html
   <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
   <script>
     const SUPABASE_URL = "https://your-project-id.supabase.co";
     const SUPABASE_ANON_KEY = "your-anon-key";
     const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
   </script>
   ```
