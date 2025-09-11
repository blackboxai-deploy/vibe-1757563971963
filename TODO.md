## Implementasi Aplikasi Kalkulator HPP Obat

- [ ] **Langkah 1: Setup Tipe Data dan Utilitas Penyimpanan**
  - [ ] Buat `src/lib/types.ts` untuk definisi interface `Obat`, `Pembelian`, dan `Penjualan`.
  - [ ] Buat `src/lib/storage.ts` untuk fungsi `get/set` data dari `localStorage`.

- [ ] **Langkah 2: Buat Halaman Statis dan Navigasi**
  - [ ] Buat `src/components/Navbar.tsx` untuk navigasi utama.
  - [ ] Buat `src/app/layout.tsx` untuk mengintegrasikan `Navbar` dan struktur dasar.

- [ ] **Langkah 3: Bangun Fitur Manajemen Inventaris**
  - [ ] Buat `src/app/inventory/page.tsx` untuk menampilkan, menambah, dan mengelola daftar obat.

- [ ] **Langkah 4: Bangun Fitur Pencatatan Pembelian**
  - [ ] Buat `src/app/purchases/page.tsx` untuk mencatat pembelian baru dan menghitung ulang harga rata-rata.

- [ ] **Langkah 5: Bangun Fitur Pencatatan Penjualan**
  - [ ] Buat `src/app/sales/page.tsx` untuk mencatat penjualan dan mengurangi stok.

- [ ] **Langkah 6: Bangun Halaman Utama (Kalkulator HPP)**
  - [ ] Buat `src/app/page.tsx` sebagai dasbor utama untuk melakukan perhitungan HPP berdasarkan rentang tanggal.
  
- [ ] **Langkah 7: Finalisasi dan Pengujian**
  - [ ] Lakukan build aplikasi dengan `pnpm run build --no-lint`.
  - [ ] Jalankan aplikasi dengan `pnpm start`.
  - [ ] Lakukan pengujian fungsionalitas secara menyeluruh.
  - [ ] Sediakan URL preview untuk pengguna.
