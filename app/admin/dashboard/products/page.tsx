"use client";

import { useState, useEffect, useCallback } from "react";
import { productService } from "@/services/product.service";
import { categoryService } from "@/services/category.service";
import type { Product, Category, PaginationMeta } from "@/types";
import {
  ShoppingBag,
  Plus,
  Search,
  Filter,
  Trash2,
  Edit,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  X,
  Upload,
  Check,
} from "lucide-react";

const LIMIT = 8;

export default function AdminProductsPage() {
  // Lists
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Pagination & Filters State
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);

  // Form Modals State
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form Fields State
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState<number | "">("");
  const [description, setDescription] = useState("");
  const [fullDescription, setFullDescription] = useState("");
  const [material, setMaterial] = useState("");
  const [sizesInput, setSizesInput] = useState("");
  const [whatsappMessage, setWhatsappMessage] = useState("");
  const [tiktokUrl, setTiktokUrl] = useState("");
  const [shopeeUrl, setShopeeUrl] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);

  // Load Categories
  useEffect(() => {
    categoryService.getAll().then((res) => {
      if (res.data.success) {
        setCategories(res.data.data ?? []);
      }
    });
  }, []);

  // Fetch Products
  const fetchProducts = useCallback(() => {
    setLoading(true);
    productService
      .getAll({
        search: search || undefined,
        category: selectedCategory || undefined,
        page,
        limit: LIMIT,
      })
      .then((res) => {
        setProducts(res.data.data ?? []);
        setMeta(res.data.meta ?? null);
      })
      .catch((err) => {
        console.error("Failed to load products:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [search, selectedCategory, page]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Debounced search trigger (reset to page 1 on search change)
  useEffect(() => {
    setPage(1);
  }, [search, selectedCategory]);

  // Delete Action
  const handleDelete = async (slug: string) => {
    if (
      confirm("Apakah Anda yakin ingin menghapus produk ini secara permanen?")
    ) {
      try {
        const res = await productService.delete(slug);
        if (res.data.success) {
          fetchProducts();
        }
      } catch (err) {
        console.error("Delete failed:", err);
        alert("Gagal menghapus produk. Silakan coba lagi.");
      }
    }
  };

  // Open Modal for Create
  const handleOpenCreate = () => {
    setModalMode("create");
    setSelectedProduct(null);
    setName("");
    setCategoryId(categories[0]?.id || "");
    setDescription("");
    setFullDescription("");
    setMaterial("");
    setSizesInput("All Size");
    setWhatsappMessage("Halo Kak, saya tertarik dengan produk ini");
    setTiktokUrl("");
    setShopeeUrl("");
    setIsFeatured(false);
    setImageFiles([]);
    setImagePreviews([]);
    setExistingImages([]);
    setShowModal(true);
  };

  // Open Modal for Edit
  const handleOpenEdit = (product: Product) => {
    setModalMode("edit");
    setSelectedProduct(product);
    setName(product.name);
    setCategoryId(product.categoryId || "");
    setDescription(product.description);
    setFullDescription(product.fullDescription);
    setMaterial(product.material);
    setSizesInput(product.sizes?.join(", ") || "");
    setWhatsappMessage(product.whatsappMessage);
    setTiktokUrl(product.tiktokUrl || "");
    setShopeeUrl(product.shopeeUrl || "");
    setIsFeatured(product.isFeatured);
    setImageFiles([]);
    setImagePreviews([]);
    setExistingImages(product.images || []);
    setShowModal(true);
  };

  // Handle image files selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setImageFiles((prev) => [...prev, ...files].slice(0, 5)); // max 5

      const newPreviews = files.map((file) => URL.createObjectURL(file));
      setImagePreviews((prev) => [...prev, ...newPreviews].slice(0, 5));
    }
  };

  // Remove selected image file
  const handleRemoveImageFile = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // Remove existing image file during edit
  const handleRemoveExistingImage = (index: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Submit Form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("categoryId", String(categoryId));
      formData.append("description", description);
      formData.append("fullDescription", fullDescription);
      formData.append("material", material);

      // Parse sizes
      const sizesArray = sizesInput
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s !== "");
      formData.append("sizes", JSON.stringify(sizesArray));

      formData.append("whatsappMessage", whatsappMessage);
      formData.append("tiktokUrl", tiktokUrl);
      formData.append("shopeeUrl", shopeeUrl);
      formData.append("isFeatured", String(isFeatured));

      // Append new files
      imageFiles.forEach((file) => {
        formData.append("images", file);
      });

      // Append remaining existing images (during edit)
      if (modalMode === "edit") {
        formData.append("existingImages", JSON.stringify(existingImages));
      }

      let success = false;
      if (modalMode === "create") {
        const res = await productService.create(formData);
        success = res.data.success;
      } else if (modalMode === "edit" && selectedProduct) {
        const res = await productService.update(selectedProduct.slug, formData);
        success = res.data.success;
      }

      if (success) {
        setShowModal(false);
        fetchProducts();
      }
    } catch (err: any) {
      console.error("Submit failed:", err);
      alert(
        err.response?.data?.message ||
          "Gagal menyimpan produk. Periksa kembali form Anda.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-dark">
            Kelola Katalog <span className="text-terracotta italic">Produk</span>
          </h1>
          <p className="text-sm text-soft-brown">
            Tambah, ubah, atau hapus produk dari landing page.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="px-5 py-3.5 bg-terracotta hover:bg-soft-brown text-white rounded-2xl text-sm font-semibold transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Produk</span>
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white/40 backdrop-blur-md p-5 rounded-3xl border border-white/30 shadow-sm grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Search */}
        <div className="md:col-span-7 relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-soft-brown">
            <Search className="w-5 h-5" />
          </span>
          <input
            type="text"
            placeholder="Cari nama produk, kain..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white/50 border border-white/20 rounded-2xl focus:border-terracotta focus:bg-white focus:outline-none transition-all duration-300 text-sm font-body text-dark shadow-inner"
          />
        </div>

        {/* Category Selector */}
        <div className="md:col-span-5 relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-soft-brown">
            <Filter className="w-5 h-5" />
          </span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white/50 border border-white/20 rounded-2xl focus:border-terracotta focus:bg-white focus:outline-none transition-all duration-300 text-sm font-body text-dark shadow-inner appearance-none cursor-pointer"
          >
            <option value="">Semua Kategori</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.slug}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table Products Card */}
      <div className="bg-white/40 backdrop-blur-md rounded-[2rem] border border-white/30 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center">
            <div className="w-10 h-10 border-4 border-terracotta border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-sm text-soft-brown font-medium animate-pulse">
              Memuat katalog...
            </p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingBag className="w-16 h-16 text-terracotta/30 mx-auto mb-4" />
            <p className="text-lg font-display font-semibold text-dark">
              Tidak Ada Produk Ditemukan
            </p>
            <p className="text-sm text-soft-brown max-w-xs mx-auto mt-1">
              Coba sesuaikan kata kunci pencarian atau filter kategori Anda.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-terracotta/10 text-dark/60 text-xs uppercase tracking-wider font-semibold font-body">
                  <th className="p-6">Produk</th>
                  <th className="p-6">Kategori</th>
                  <th className="p-6">Material / Ukuran</th>
                  <th className="p-6">Unggulan</th>
                  <th className="p-6 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-terracotta/5">
                {products.map((product) => (
                  <tr
                    key={product.id}
                    className="hover:bg-white/30 transition-colors group"
                  >
                    {/* Item */}
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-xl bg-dark/5 overflow-hidden border border-terracotta/10 relative flex-shrink-0">
                          {product.images?.[0] ? (
                            <img
                              src={
                                product.images[0].startsWith("http")
                                  ? product.images[0]
                                  : `/uploads/${product.images[0]}`
                              }
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-full h-full bg-terracotta/10 flex items-center justify-center">
                              <ShoppingBag className="w-6 h-6 text-terracotta" />
                            </div>
                          )}
                        </div>
                        <div>
                          <span className="font-display font-bold text-dark text-base block group-hover:text-terracotta transition-colors">
                            {product.name}
                          </span>
                          <span className="text-xs text-soft-brown font-body line-clamp-1 max-w-[200px]">
                            {product.description}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="p-6">
                      <span className="px-3 py-1 bg-dark/5 border border-dark/5 rounded-full text-xs font-semibold text-soft-brown uppercase tracking-wide">
                        {typeof product.category === "object" ? product.category?.name : (product.category || "Lainnya")}
                      </span>
                    </td>

                    {/* Material Sizes */}
                    <td className="p-6 space-y-1">
                      <span className="text-sm font-medium text-dark block">
                        {product.material}
                      </span>
                      <span className="text-[11px] text-soft-brown block leading-none">
                        Ukuran: {product.sizes?.join(", ") || "All Size"}
                      </span>
                    </td>

                    {/* Is Featured */}
                    <td className="p-6">
                      {product.isFeatured ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 text-amber-600 rounded-full text-xs font-bold uppercase tracking-wider border border-amber-500/10">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Ya</span>
                        </span>
                      ) : (
                        <span className="text-xs text-soft-brown/50 font-semibold font-body">
                          -
                        </span>
                      )}
                    </td>

                    {/* Action buttons */}
                    <td className="p-6">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleOpenEdit(product)}
                          className="p-2 bg-cream hover:bg-terracotta hover:text-white rounded-xl text-soft-brown transition-all cursor-pointer border border-terracotta/10"
                          title="Edit Produk"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(product.slug)}
                          className="p-2 bg-red-50 hover:bg-red-500 hover:text-white rounded-xl text-red-500 transition-all cursor-pointer border border-red-200"
                          title="Hapus Produk"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Controls */}
        {meta && meta.totalPages > 1 && (
          <div className="p-6 border-t border-terracotta/10 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/10">
            <span className="text-xs text-soft-brown font-semibold">
              Menampilkan {products.length} dari {meta.total} produk
            </span>
            <div className="flex items-center gap-1.5">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="p-2.5 rounded-xl bg-white/50 border border-white/20 hover:border-terracotta/30 text-dark disabled:opacity-40 disabled:hover:border-white/20 transition-all cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {Array.from({ length: meta.totalPages }).map((_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`w-10 h-10 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      page === pageNum
                        ? "bg-terracotta text-white shadow-md shadow-terracotta/10"
                        : "bg-white/50 hover:bg-white/85 text-dark border border-white/20"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                disabled={page === meta.totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="p-2.5 rounded-xl bg-white/50 border border-white/20 hover:border-terracotta/30 text-dark disabled:opacity-40 disabled:hover:border-white/20 transition-all cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* OVERLAY FORM MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-cream rounded-[2.5rem] border border-white/40 shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto animate-zoom-in my-8">
            {/* Modal Header */}
            <div className="p-6 sm:p-8 border-b border-terracotta/10 flex items-center justify-between sticky top-0 bg-cream z-10">
              <div>
                <h3 className="text-xl sm:text-2xl font-display font-bold text-dark">
                  {modalMode === "create"
                    ? "Tambah Produk"
                    : "Ubah Detail Produk"}
                </h3>
                <p className="text-xs text-soft-brown">
                  Isi spesifikasi produk dengan detail untuk website katalog
                  Anda.
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 rounded-xl bg-white hover:bg-white/80 border border-white/40 text-dark transition-all cursor-pointer shadow-sm"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div className="md:col-span-2">
                  <label className="block text-xs uppercase tracking-widest font-bold text-dark mb-2 font-body">
                    Nama Produk
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Contoh: Daster Floral Soft Pink"
                    className="w-full px-4 py-3 bg-white/60 border border-white/20 rounded-2xl focus:border-terracotta focus:bg-white focus:outline-none transition-all duration-300 text-sm font-body text-dark"
                  />
                </div>

                {/* Category Selection */}
                <div>
                  <label className="block text-xs uppercase tracking-widest font-bold text-dark mb-2 font-body">
                    Kategori
                  </label>
                  <select
                    required
                    value={categoryId}
                    onChange={(e) => setCategoryId(Number(e.target.value))}
                    className="w-full px-4 py-3 bg-white/60 border border-white/20 rounded-2xl focus:border-terracotta focus:bg-white focus:outline-none transition-all duration-300 text-sm font-body text-dark"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Material */}
                <div>
                  <label className="block text-xs uppercase tracking-widest font-bold text-dark mb-2 font-body">
                    Bahan / Material
                  </label>
                  <input
                    type="text"
                    required
                    value={material}
                    onChange={(e) => setMaterial(e.target.value)}
                    placeholder="Contoh: Katun Rayon Premium"
                    className="w-full px-4 py-3 bg-white/60 border border-white/20 rounded-2xl focus:border-terracotta focus:bg-white focus:outline-none transition-all duration-300 text-sm font-body text-dark"
                  />
                </div>

                {/* Sizes Input */}
                <div>
                  <label className="block text-xs uppercase tracking-widest font-bold text-dark mb-2 font-body">
                    Ukuran (pisahkan dengan koma)
                  </label>
                  <input
                    type="text"
                    value={sizesInput}
                    onChange={(e) => setSizesInput(e.target.value)}
                    placeholder="Contoh: All Size, M, L, XL"
                    className="w-full px-4 py-3 bg-white/60 border border-white/20 rounded-2xl focus:border-terracotta focus:bg-white focus:outline-none transition-all duration-300 text-sm font-body text-dark"
                  />
                </div>

                {/* Is Featured checkbox */}
                <div className="flex items-center pl-1 h-full pt-6">
                  <label className="inline-flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isFeatured}
                      onChange={(e) => setIsFeatured(e.target.checked)}
                      className="w-5 h-5 accent-terracotta bg-white rounded border border-terracotta/20"
                    />
                    <span className="text-sm font-semibold text-dark">
                      Tandai Sebagai Produk Unggulan
                    </span>
                  </label>
                </div>

                {/* Brief description */}
                <div className="md:col-span-2">
                  <label className="block text-xs uppercase tracking-widest font-bold text-dark mb-2 font-body">
                    Deskripsi Singkat (Max 500 Karakter)
                  </label>
                  <textarea
                    required
                    maxLength={500}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Keterangan singkat tentang daster ini untuk grid list..."
                    className="w-full px-4 py-3 bg-white/60 border border-white/20 rounded-2xl focus:border-terracotta focus:bg-white focus:outline-none transition-all duration-300 text-sm font-body text-dark h-20 resize-none"
                  />
                </div>

                {/* Detailed description */}
                <div className="md:col-span-2">
                  <label className="block text-xs uppercase tracking-widest font-bold text-dark mb-2 font-body">
                    Deskripsi Lengkap Detail
                  </label>
                  <textarea
                    required
                    value={fullDescription}
                    onChange={(e) => setFullDescription(e.target.value)}
                    placeholder="Keterangan lengkap detail jahitan, lingkar dada, panjang baju, kecocokan harian..."
                    className="w-full px-4 py-3 bg-white/60 border border-white/20 rounded-2xl focus:border-terracotta focus:bg-white focus:outline-none transition-all duration-300 text-sm font-body text-dark h-32"
                  />
                </div>

                {/* Whatsapp Message */}
                <div className="md:col-span-2">
                  <label className="block text-xs uppercase tracking-widest font-bold text-dark mb-2 font-body">
                    Format Pesan WhatsApp Pemesanan
                  </label>
                  <input
                    type="text"
                    required
                    value={whatsappMessage}
                    onChange={(e) => setWhatsappMessage(e.target.value)}
                    placeholder="Halo kak, saya mau tanya tentang Daster Floral Soft Pink..."
                    className="w-full px-4 py-3 bg-white/60 border border-white/20 rounded-2xl focus:border-terracotta focus:bg-white focus:outline-none transition-all duration-300 text-sm font-body text-dark"
                  />
                </div>

                {/* TikTok Url */}
                <div>
                  <label className="block text-xs uppercase tracking-widest font-bold text-dark mb-2 font-body">
                    Link Produk TikTok Shop (Opsional)
                  </label>
                  <input
                    type="url"
                    value={tiktokUrl}
                    onChange={(e) => setTiktokUrl(e.target.value)}
                    placeholder="https://tiktok.com/..."
                    className="w-full px-4 py-3 bg-white/60 border border-white/20 rounded-2xl focus:border-terracotta focus:bg-white focus:outline-none transition-all duration-300 text-sm font-body text-dark"
                  />
                </div>

                {/* Shopee Url */}
                <div>
                  <label className="block text-xs uppercase tracking-widest font-bold text-dark mb-2 font-body">
                    Link Produk Shopee (Opsional)
                  </label>
                  <input
                    type="url"
                    value={shopeeUrl}
                    onChange={(e) => setShopeeUrl(e.target.value)}
                    placeholder="https://shopee.co.id/..."
                    className="w-full px-4 py-3 bg-white/60 border border-white/20 rounded-2xl focus:border-terracotta focus:bg-white focus:outline-none transition-all duration-300 text-sm font-body text-dark"
                  />
                </div>

                {/* Image upload widget */}
                <div className="md:col-span-2 space-y-3">
                  <label className="block text-xs uppercase tracking-widest font-bold text-dark mb-1 font-body">
                    Foto Produk (Maksimal 5)
                  </label>

                  {/* Photo previews grid */}
                  <div className="flex flex-wrap gap-4 mb-2">
                    {/* Existing Images */}
                    {existingImages.map((img, i) => (
                      <div
                        key={`exist-${i}`}
                        className="w-20 h-20 rounded-2xl overflow-hidden border border-terracotta/20 relative group bg-white/40"
                      >
                        <img
                          src={img.startsWith("http") ? img : `/uploads/${img}`}
                          alt="preview"
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveExistingImage(i)}
                          className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white cursor-pointer"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    ))}

                    {/* New Selection Previews */}
                    {imagePreviews.map((preview, i) => (
                      <div
                        key={`new-${i}`}
                        className="w-20 h-20 rounded-2xl overflow-hidden border border-green-200 relative group bg-white/40"
                      >
                        <img
                          src={preview}
                          alt="preview"
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute top-1 left-1 bg-green-500 text-white rounded-full p-0.5 text-[8px] font-bold uppercase">
                          Baru
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveImageFile(i)}
                          className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white cursor-pointer"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    ))}

                    {/* Upload button card */}
                    {existingImages.length + imageFiles.length < 5 && (
                      <label className="w-20 h-20 border-2 border-dashed border-terracotta/20 hover:border-terracotta rounded-2xl flex flex-col items-center justify-center bg-white/20 hover:bg-white/50 text-soft-brown hover:text-terracotta transition-all duration-300 cursor-pointer shadow-inner">
                        <Upload className="w-5 h-5 mb-1" />
                        <span className="text-[10px] font-bold">Upload</span>
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                  <p className="text-[11px] text-soft-brown italic">
                    Gunakan file dengan format JPEG, PNG, atau WEBP berukuran
                    maksimal 5MB.
                  </p>
                </div>
              </div>

              {/* Form Actions Footer */}
              <div className="pt-6 border-t border-terracotta/10 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-3.5 bg-white hover:bg-white/80 text-dark rounded-xl text-sm font-semibold transition-all border border-white/40 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-3.5 bg-terracotta hover:bg-soft-brown disabled:bg-terracotta/60 text-white rounded-xl text-sm font-semibold transition-all shadow-md flex items-center gap-2 cursor-pointer"
                >
                  {submitting ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>
                        {modalMode === "create"
                          ? "Simpan Produk"
                          : "Ubah Produk"}
                      </span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
