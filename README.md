# mbaQul Jarit Shop 👗✨

Sebuah *company profile* dan katalog digital berdesain premium untuk **mbaQul Jarit Shop** — sebuah *brand* busana keseharian wanita yang berfokus pada kenyamanan, estetika, dan harga terjangkau. 

![mbaQul Preview](public/gallery/lookbook-2.webp)

## 🌟 Fitur Utama (Key Features)

*   **Desain Editorial Premium**: Dibangun dengan tata letak minimalis dan elegan menyerupai majalah *fashion* kelas atas, bebas dari desain kaku.
*   **Direct to WhatsApp Checkout**: Sistem formulir kontak terintegrasi langsung ke WhatsApp dengan *template* pesan otomatis untuk memudahkan pembeli dan admin toko.
*   **Galeri Masonry Dinamis**: Menampilkan foto produk dan *behind the scenes* (BTS) dengan *layout masonry* (kolom dinamis ala Pinterest) yang responsif di segala perangkat.
*   **Animasi Mulus (Smooth Animations)**: Interaksi mikro dan animasi transisi yang memanjakan mata ditenagai oleh **Framer Motion**.
*   **Komponen Interaktif**: 
    *   *Accordion FAQ* yang responsif.
    *   *Hover effects* tingkat lanjut pada kartu Produk dan *Core Values*.
    *   Navigasi *sticky* dengan efek transparan.

## 🛠️ Tech Stack

Proyek ini dibangun menggunakan teknologi web modern terkini untuk memastikan performa maksimal dan kemudahan pengembangan:

*   **[Next.js 15+](https://nextjs.org/)**: *Framework* React untuk *Server-Side Rendering* dan optimalisasi performa.
*   **[React 19](https://react.dev/)**: *Library UI core*.
*   **[Tailwind CSS v4](https://tailwindcss.com/)**: *Utility-first CSS framework* untuk mempercepat *styling*.
*   **[Framer Motion](https://www.framer.com/motion/)**: *Library* animasi standar industri untuk React.
*   **[Lucide React](https://lucide.dev/)**: Kumpulan ikon yang minimalis, indah, dan ringan.

## 📂 Struktur Proyek

*   `/app`: Berisi halaman *routing* aplikasi (`/` Beranda, `/produk`, `/galeri`, `/tentang`, `/kontak`).
*   `/components`: Berisi kumpulan komponen UI yang dapat digunakan ulang (Navbar, Footer, Card, Section).
*   `/lib/data.ts`: **Pusat Konten Website**. Semua teks, harga produk, tautan, dan deskripsi diatur di file ini untuk kemudahan *maintenance*.
*   `/public`: Tempat penyimpanan aset statis seperti logo dan gambar resolusi tinggi (format `.webp` disarankan).

## 🚀 Memulai Pengembangan (Getting Started)

1. **Clone repository ini**
   ```bash
   git clone https://github.com/muhammadfaiz19/mbaqul-jarit-shop.git
   cd mbaqul-jarit-shop
   ```

2. **Install dependensi**
   ```bash
   npm install
   # atau
   yarn install
   # atau
   pnpm install
   ```

3. **Jalankan server pengembangan**
   ```bash
   npm run dev
   ```

4. Buka [http://localhost:3000](http://localhost:3000) di browser Anda.

## 📝 Pengaturan Konten

Jika Anda ingin mengubah produk, menambah foto di galeri, atau mengubah nomor WhatsApp, Anda **tidak perlu mengutak-atik kode halaman**. Cukup buka file `lib/data.ts` dan ubah nilai pada objek konfigurasi.

Contoh mengubah nomor WhatsApp:
```typescript
export const siteConfig = {
  // ...
  whatsappNumber: "6282112345678", // Ganti dengan nomor asli
  // ...
};
```

## 🤝 Kontribusi & Lisensi

Proyek ini dibangun secara eksklusif untuk **mbaQul Jarit Shop**. Segala pembaruan desain dan fungsionalitas harus melalui proses *pull request* untuk direviu.
