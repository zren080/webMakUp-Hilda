# Vilda Makeup

## Struktur folder
- `index.html`: halaman login/registrasi pertama.
- `shop.html`: halaman belanja, kategori, produk, keranjang, checkout, dan dashboard admin.
- `css/style.css`: dasar dan reset.
- `css/header.css`: navbar, hero, footer.
- `css/product.css`: kategori, kartu produk, keranjang, checkout, toast, dashboard admin.
- `css/responsive.css`: aturan responsif.
- `css/login.css`: desain halaman login.
- `js/auth.js`: algoritma login, registrasi pembeli, dan pengalihan ke halaman belanja.
- `js/data.js`: data awal kategori dan produk.
- `js/product.js`: render kategori, pencarian, dan produk.
- `js/cart.js`: keranjang dan checkout.
- `js/app.js`: admin, produk, diskon, voucher, dan penyimpanan data.

## Algoritma login
1. Pengguna membuka `index.html`.
2. Pengguna memasukkan username dan password, atau membuat akun pembeli.
3. Sistem memeriksa apakah kredensial cocok dengan akun admin demo.
4. Jika bukan admin, sistem mencari kecocokan akun pembeli yang tersimpan di browser.
5. Jika valid, sesi login disimpan di `sessionStorage` dan pengguna dialihkan ke `shop.html`.
6. Jika tidak valid, pesan kesalahan ditampilkan dan pengguna tetap di halaman login.
7. `shop.html` memeriksa sesi; jika belum login, pengguna dikembalikan ke `index.html`.
8. Tombol Keluar menghapus sesi dan kembali ke halaman login.

## Akun admin demo
- Username: `admin`
- Password: `VildaAdmin123!`

## Cara menjalankan
Ekstrak ZIP, lalu buka `index.html` melalui browser atau gunakan Live Server di VS Code. Pertahankan struktur folder dan nama file.

## Fitur
- 7 kategori dan 12 produk awal.
- Registrasi dan login pembeli demo.
- Login admin dan dashboard untuk menambah, mengedit, dan menghapus produk.
- Diskon per produk dalam persentase atau potongan Rupiah.
- Voucher diskon, minimum belanja, dan tanggal kedaluwarsa.
- Keranjang dan checkout.
- Produk dan voucher disimpan di `localStorage`.

## Catatan keamanan
Ini adalah simulasi frontend untuk pembelajaran. Akun dan password pembeli disimpan di `localStorage` dalam bentuk teks biasa, dan kredensial admin terlihat di kode JavaScript. Jangan gunakan untuk data nyata. Untuk website produksi, gunakan backend (misalnya PHP), database, hashing password, sesi server, dan validasi di sisi server.


## Jika kategori atau produk tidak muncul
1. Ekstrak seluruh ZIP terlebih dahulu.
2. Buka folder `vilda-makeup` sebagai folder di VS Code.
3. Jalankan `index.html` dengan ekstensi **Live Server** (jangan membuka `shop.html` secara langsung).
4. Login, lalu halaman akan berpindah ke `shop.html`.
5. Jika sebelumnya pernah menyimpan data produk kosong, versi ini akan menghapus data kosong tersebut dan mengembalikan 12 produk bawaan.
6. Jika masih belum muncul, buka DevTools browser (F12) → Console dan periksa apakah ada pesan error.

Catatan: jalankan kedua halaman pada alamat/port Live Server yang sama agar `sessionStorage` dan `localStorage` tetap konsisten.


## Mengatur diskon dan voucher

### Diskon per produk
1. Login sebagai admin (`admin` / `VildaAdmin123!`).
2. Buka menu **Admin**.
3. Pada bagian **Tambah Produk & Atur Diskon**, isi produk dan harga.
4. Pilih diskon persentase (%) atau potongan harga (Rp), lalu isi nilainya. Isi `0` bila tidak ada diskon.
5. Klik **Simpan Produk**. Diskon akan terlihat di kartu produk dan diterapkan saat menghitung keranjang/checkout.

### Membuat voucher
1. Di Dashboard Admin, buka bagian **Buat Voucher Belanja**.
2. Isi kode unik, misalnya `VILDA10`. Kode 3–20 karakter dan dapat menggunakan huruf, angka, garis bawah, atau tanda hubung.
3. Pilih persentase atau potongan rupiah dan isi nilainya. Persentase maksimum 100%.
4. Isi minimum belanja dan, bila perlu, tanggal kedaluwarsa.
5. Klik **Simpan Voucher**. Voucher akan tampil pada daftar dan bisa dihapus. Menyimpan kode yang sama akan memperbarui voucher itu.
6. Pembeli memasukkan kode tersebut pada kolom voucher di keranjang dan menekan **Pakai**.

Data demo disimpan di `localStorage` browser. Fitur ini cocok untuk demonstrasi tugas; autentikasi dan penyimpanan frontend bukan pengganti backend yang aman untuk toko produksi.


## Edit produk dan unggah foto
- Masuk sebagai admin, buka Dashboard Admin, lalu klik **Edit** pada produk yang diinginkan. Form akan terisi dan judul berubah menjadi **Edit Produk**. Setelah mengubah data, klik **Simpan Perubahan**.
- Foto produk dapat diunggah dalam format JPG, PNG, atau WEBP dengan ukuran maksimal 1 MB. Foto muncul di pratinjau, katalog, dan keranjang.
- Foto disimpan sebagai data lokal pada browser melalui localStorage; gunakan foto kecil agar kuota penyimpanan browser tidak cepat penuh.
