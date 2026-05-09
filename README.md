# mbaQul Jarit Shop 👗✨

Sebuah *company profile* dan katalog digital berdesain premium untuk **mbaQul Jarit Shop** — sebuah *brand* busana keseharian wanita yang berfokus pada kenyamanan, estetika, dan harga terjangkau. 

![mbaQul Preview](public/gallery/lookbook-2.webp)

## 🌟 Fitur Utama (Key Features)

*   **Desain Editorial Premium**: Dibangun dengan tata letak minimalis dan elegan menyerupai majalah *fashion* kelas atas, bebas dari desain kaku.
*   **Asisten AI Virtual Premium ("Teman Gaya")**: Fitur chatbot AI cerdas berbasis Groq Llama-3 yang ramah pengguna, berwawasan luas tentang stok, detail produk, ukuran, serta dapat memandu proses pembelian dengan santun.
*   **Admin Panel Dashboard yang Aman**: Antarmuka kontrol penuh bagi pemilik toko untuk mengedit seluruh konten situs, data produk, kategori, lookbook galeri, daftar FAQ, pengaturan situs, dan panduan asisten chat secara dinamis tanpa menyentuh kode pemrograman.
*   **Direct to WhatsApp Checkout**: Sistem formulir kontak terintegrasi langsung ke WhatsApp dengan *template* pesan otomatis untuk memudahkan pembeli dan admin toko.
*   **Galeri Masonry Dinamis**: Menampilkan foto produk dan *behind the scenes* (BTS) dengan *layout masonry* (kolom dinamis ala Pinterest) yang responsif di segala perangkat.
*   **Animasi Mulus (Smooth Animations)**: Interaksi mikro dan animasi transisi yang memanjakan mata ditenagai oleh **Framer Motion**.

## 🛠️ Tech Stack

Proyek ini dibangun menggunakan teknologi web modern terkini untuk memastikan performa maksimal dan kemudahan pengembangan:

*   **[Next.js 15+](https://nextjs.org/)**: *Framework* React untuk *Server-Side Rendering*, API proxying, dan optimalisasi performa.
*   **[React 19](https://react.dev/)**: *Library UI core*.
*   **[Tailwind CSS v4](https://tailwindcss.com/)**: *Utility-first CSS framework* untuk mempercepat *styling*.
*   **[Framer Motion](https://www.framer.com/motion/)**: *Library* animasi standar industri untuk React.
*   **[Lucide React](https://lucide.dev/)**: Kumpulan ikon yang minimalis, indah, dan ringan.
*   **[Axios](https://axios-http.com/)**: Klien HTTP tangguh untuk komunikasi data asinkron.

## 📂 Struktur Proyek

*   `/app`: Berisi halaman *routing* aplikasi (`/` Beranda, `/produk`, `/galeri`, `/tentang`, `/kontak`).
*   `/app/admin`: Area admin yang terproteksi (Halaman Login, serta Dashboard Pengelolaan Data: Kategori, Produk, Galeri, FAQ, Settings, Chatbot).
*   `/components`: Berisi kumpulan komponen UI premium (Navbar, Footer, Card, Section, serta Chatbot "Teman Gaya").
*   `/actions`: Server actions dinamis untuk penanganan rute asisten AI chat.
*   `/services`: Kelas jembatan API untuk validasi, otentikasi admin, dan pemrosesan data asinkron dari backend.
*   `/lib/api.ts`: Konfigurasi Axios Client yang dilengkapi interceptor cookie otomatis untuk menjaga sesi administrasi.

## 🚀 Memulai Pengembangan (Getting Started)

1. **Clone repository ini**
   ```bash
   git clone https://github.com/muhammadfaiz19/mbaqul-jarit-shop.git
   cd mbaqul-jarit-shop
   ```

2. **Atur Environment Variables**
   Buat file bernama `.env` di direktori utama dan isikan alamat API backend Kakak:
   ```ini
   BACKEND_URL="http://localhost:9090" # Atau sesuaikan dengan port backend Kakak (misal: http://localhost:9010)
   ```

3. **Install dependensi**
   ```bash
   pnpm install
   # atau
   npm install
   ```

4. **Jalankan server pengembangan**
   ```bash
   pnpm run dev
   # atau
   npm run dev
   ```

5. Buka [http://localhost:3000](http://localhost:3000) di browser Anda.

## 📝 Pengaturan Konten Dinamis

Seluruh konten situs kini bersifat **100% dinamis** dan dikendalikan sepenuhnya dari **Admin Panel Dashboard** di rute `/admin/login`. Kakak dapat melakukan pengelolaan:
- Tambah, edit, dan hapus Kategori & Produk dengan unggah gambar berformat WebP otomatis.
- Kelola galeri Lookbook.
- Sesuaikan pertanyaan dan jawaban FAQ.
- Edit teks Hero, deskripsi, alamat email, nomor telepon WhatsApp, tautan Shopee/TikTok, serta kepribadian bot AI asisten chat secara real-time.

## 🤝 Kontribusi & Lisensi

Proyek ini dibangun secara eksklusif untuk **mbaQul Jarit Shop**. Segala pembaruan desain dan fungsionalitas harus melalui proses *pull request* untuk direviu.
