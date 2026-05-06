import type {
  SiteConfig, HeroContent, AboutContent, Category,
  Product, GalleryItem, NavItem, SocialLink
} from '@/types';

// ============================================================
// SITE CONFIGURATION
// ============================================================
export const siteConfig: SiteConfig = {
  brandName: 'mbaQul Jarit Shop',
  tagline: 'Simple, Nyaman, dan Tetap Cantik',
  whatsappNumber: '6281234567890',
  whatsappDefaultMessage: 'Halo kak, saya tertarik dengan produk mbaQul Jarit Shop!',
  tiktokUrl: 'https://www.tiktok.com/@mbaquljarit_shop',
  tiktokHandle: '@mbaquljarit_shop',
  operationalHours: 'Senin - Sabtu, 08:00 - 21:00 WIB',
  copyright: `© ${new Date().getFullYear()} mbaQul Jarit Shop. All rights reserved.`,
};

// ============================================================
// NAVIGATION
// ============================================================
export const navItems: NavItem[] = [
  { label: 'Beranda', href: '/' },
  { label: 'Tentang', href: '/tentang' },
  { label: 'Produk', href: '/produk' },
  { label: 'Galeri', href: '/galeri' },
  { label: 'Kontak', href: '/kontak' },
];

// ============================================================
// HERO SECTION
// ============================================================
export const heroContent: HeroContent = {
  headline: 'Tampil Cantik & Nyaman Setiap Hari',
  subtext: 'Daster, dress, dan outfit santai yang simple tapi tetap stylish',
  ctaPrimary: 'Lihat Produk',
  ctaSecondary: 'Chat WhatsApp',
};

// ============================================================
// CATEGORIES
// ============================================================
export const categories: Category[] = [
  {
    slug: 'daster',
    name: 'Daster',
    description: 'Nyaman untuk di rumah, tetap cantik untuk ke luar',
    icon: '',
    image: '/products/category-daster.webp',
  },
  {
    slug: 'dress',
    name: 'Dress',
    description: 'Simple & elegan untuk segala suasana',
    icon: '',
    image: '/products/category-dress.webp',
  },
  {
    slug: 'kemeja',
    name: 'Kemeja',
    description: 'Casual tapi tetap rapi dan stylish',
    icon: '',
    image: '/products/category-kemeja.webp',
  },
  {
    slug: 'tunik',
    name: 'Tunik',
    description: 'Longgar, nyaman, dan tetap modis',
    icon: '',
    image: '/products/category-tunik.webp',
  },
];

// ============================================================
// PRODUCTS
// ============================================================
export const products: Product[] = [
  {
    slug: 'daster-floral-soft-pink',
    name: 'Daster Floral Soft Pink',
    category: 'daster',
    description: 'Motif bunga lembut dengan warna pink pastel yang feminin',
    fullDescription: 'Daster dengan motif floral soft pink yang cantik. Terbuat dari bahan katun rayon premium yang sangat adem dan menyerap keringat. Cocok untuk menemani aktivitas harian di rumah maupun untuk keluar santai.',
    material: 'Katun Rayon Premium',
    sizes: ['All Size (Fit to XL)'],
    images: ['/products/daster-1.webp'],
    whatsappMessage: 'Halo kak, saya mau tanya tentang Daster Floral Soft Pink',
    tiktokUrl: 'https://www.tiktok.com/@mbaquljarit_shop',
    isFeatured: true,
  },
  {
    slug: 'dress-polos-minimal-sage',
    name: 'Dress Polos Minimal Sage',
    category: 'dress',
    description: 'Dress minimalis warna sage green yang menenangkan',
    fullDescription: 'Dress dengan potongan minimalis yang elegan. Warna sage green yang sedang tren memberikan kesan segar dan tenang. Bahan jatuh dan tidak mudah kusut.',
    material: 'Crinkle Airflow',
    sizes: ['M', 'L', 'XL'],
    images: ['/products/dress-1.webp'],
    whatsappMessage: 'Halo kak, saya mau tanya tentang Dress Polos Minimal Sage',
    tiktokUrl: 'https://www.tiktok.com/@mbaquljarit_shop',
    isFeatured: true,
  },
  {
    slug: 'kemeja-linen-natural',
    name: 'Kemeja Linen Natural',
    category: 'kemeja',
    description: 'Kemeja casual bahan linen untuk gaya yang timeless',
    fullDescription: 'Kemeja dengan bahan linen natural yang memberikan sirkulasi udara maksimal. Potongan casual fit yang cocok dipadukan dengan celana kulot atau jeans.',
    material: 'Linen Premium',
    sizes: ['All Size'],
    images: ['/products/kemeja-1.webp'],
    whatsappMessage: 'Halo kak, saya mau tanya tentang Kemeja Linen Natural',
    tiktokUrl: 'https://www.tiktok.com/@mbaquljarit_shop',
    isFeatured: true,
  },
  {
    slug: 'tunik-elegant-mocca',
    name: 'Tunik Elegant Mocca',
    category: 'tunik',
    description: 'Tunik warna mocca yang memberikan kesan mewah',
    fullDescription: 'Tunik dengan detail lipatan yang cantik di bagian dada. Warna mocca yang netral dan mewah memudahkan untuk dipadu padankan dengan hijab warna apapun.',
    material: 'Silk Premium',
    sizes: ['All Size'],
    images: ['/products/tunik-1.webp'],
    whatsappMessage: 'Halo kak, saya mau tanya tentang Tunik Elegant Mocca',
    tiktokUrl: 'https://www.tiktok.com/@mbaquljarit_shop',
    isFeatured: true,
  },
  {
    slug: 'daster-motif-ab abstrak',
    name: 'Daster Motif Abstrak',
    category: 'daster',
    description: 'Daster motif abstrak modern yang unik',
    fullDescription: 'Motif abstrak yang tidak pasaran membuat daster ini terlihat modern. Bahan tetap mengutamakan kenyamanan maksimal.',
    material: 'Katun Rayon',
    sizes: ['All Size'],
    images: ['/products/daster-2.webp'],
    whatsappMessage: 'Halo kak, saya mau tanya tentang Daster Motif Abstrak',
    tiktokUrl: 'https://www.tiktok.com/@mbaquljarit_shop',
    isFeatured: false,
  },
  {
    slug: 'dress-floral-blue',
    name: 'Dress Floral Blue',
    category: 'dress',
    description: 'Dress motif bunga warna biru yang ceria',
    fullDescription: 'Tampilkan sisi ceriamu dengan dress motif floral biru ini. Potongan lebar di bagian bawah memberikan ruang gerak yang bebas.',
    material: 'Rayon Viscose',
    sizes: ['All Size'],
    images: ['/products/dress-2.webp'],
    whatsappMessage: 'Halo kak, saya mau tanya tentang Dress Floral Blue',
    tiktokUrl: 'https://www.tiktok.com/@mbaquljarit_shop',
    isFeatured: false,
  },
];

// ============================================================
// GALLERY ITEMS
// ============================================================
export const galleryItems: GalleryItem[] = [
  { id: '1', image: '/gallery/lookbook-1.webp', caption: 'Daily look dengan Daster Floral Soft Pink', category: 'lifestyle', alt: 'Model memakai daster floral' },
  { id: '2', image: '/gallery/lookbook-2.webp', caption: 'Outfit santai tapi tetap rapi', category: 'lifestyle', alt: 'Model memakai dress casual' },
  { id: '3', image: '/gallery/product-shoot-1.webp', caption: 'Detail bahan katun rayon premium', category: 'behind-the-scenes', alt: 'Detail bahan produk' },
  { id: '4', image: '/gallery/lookbook-3.webp', caption: 'Tunik elegant untuk daily wear', category: 'tunik', alt: 'Model memakai tunik' },
  { id: '5', image: '/gallery/bts-1.webp', caption: 'Proses quality check sebelum kirim', category: 'behind-the-scenes', alt: 'Behind the scenes packing' },
  { id: '6', image: '/gallery/lookbook-4.webp', caption: 'Kemeja linen untuk gaya kasual', category: 'kemeja', alt: 'Model memakai kemeja linen' },
];

// ============================================================
// ABOUT CONTENT
// ============================================================
export const aboutContent: AboutContent = {
  title: 'Tentang mbaQul Jarit Shop',
  paragraphs: [
    'mbaQul Jarit Shop adalah brand fashion lokal yang hadir untuk perempuan Indonesia yang ingin tampil cantik tanpa ribet.',
    'Kami percaya bahwa kenyamanan dan gaya bisa berjalan beriringan. Setiap produk kami dirancang untuk menemani aktivitas harianmu, memberikan rasa percaya diri dengan material yang berkualitas.',
    'Dari bahan yang adem hingga model yang timeless — semua dibuat dengan cinta dan dedikasi untuk mendukung kenyamanan setiap wanita.',
  ],
  quote: 'Simple, Nyaman, dan Tetap Cantik',
  values: [
    { title: 'Nyaman Dipakai', description: 'Bahan adem dan lembut untuk aktivitas harian' },
    { title: 'Harga Terjangkau', description: 'Kualitas premium tanpa harus mahal' },
    { title: 'Daily Wear', description: 'Cocok dipakai kapan saja dan di mana saja' },
  ],
  target: 'Remaja hingga ibu muda yang ingin tampil simple tapi tetap stylish',
};

// ============================================================
// SOCIAL LINKS
// ============================================================
export const socialLinks: SocialLink[] = [
  { platform: 'TikTok', url: 'https://www.tiktok.com/@mbaquljarit_shop', icon: 'tiktok' },
  { platform: 'WhatsApp', url: 'https://wa.me/6281234567890', icon: 'whatsapp' },
];

// ============================================================
// MICROCOPY
// ============================================================
export const microcopy = {
  categorySection: 'Temukan pilihan busana ternyaman untukmu.',
  featuredSection: 'Koleksi favorit pelanggan kami.',
  gallerySection: 'Koleksi dan suasana di balik layar.',
  ctaBanner: 'Pilih produk favoritmu sekarang.',
  contactCta: 'Mau tanya-tanya dulu? Chat aja!',
  productListEmpty: 'Belum ada produk di kategori ini',
  relatedProducts: 'Kamu mungkin juga suka',
  galleryEmpty: 'Belum ada foto di kategori ini',
};

// ============================================================
// FAQS
// ============================================================
export const faqs = [
  {
    question: "Apakah bahan dasternya menyusut setelah dicuci?",
    answer: "Tidak, kami menggunakan katun rayon premium yang sudah melalui proses penyusutan (pre-shrunk). Namun, disarankan mencuci dengan air dingin dan tidak menggunakan mesin pengering agar keawetan kain tetap maksimal."
  },
  {
    question: "Bagaimana cara menentukan ukuran yang pas?",
    answer: "Rata-rata produk kami adalah 'All Size' dengan potongan loose fit yang muat dari berat badan 45kg hingga 75kg. Untuk detail lingkar dada (LD) dan panjang baju (PB), Anda bisa langsung menanyakannya ke admin WhatsApp kami."
  },
  {
    question: "Apakah melayani pengiriman ke luar Jawa?",
    answer: "Tentu! Kami melayani pengiriman ke seluruh Indonesia menggunakan berbagai pilihan ekspedisi. Pengiriman dilakukan dari lokasi kami di Cirebon."
  },
  {
    question: "Bagaimana jika barang yang diterima cacat atau salah kirim?",
    answer: "Kami memiliki garansi retur 100%. Cukup sertakan video unboxing tanpa jeda saat membuka paket, lalu hubungi admin WhatsApp kami. Kami akan mengganti produk beserta ongkos kirimnya."
  }
];
