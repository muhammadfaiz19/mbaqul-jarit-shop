"use client";

import { useState, useEffect } from "react";
import { galleryService } from "@/services/gallery.service";
import { categoryService } from "@/services/category.service";
import type { GalleryItem, Category } from "@/types";
import { ImageIcon, Plus, Trash2, Edit, X, Upload, Check } from "lucide-react";

export default function AdminGalleryPage() {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form Fields State
  const [caption, setCaption] = useState("");
  const [category, setCategory] = useState("");
  const [alt, setAlt] = useState("");
  const [order, setOrder] = useState(0);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [existingImage, setExistingImage] = useState("");

  const fetchGallery = async () => {
    setLoading(true);
    try {
      const res = await galleryService.getAll();
      if (res.data.success) {
        setGalleryItems(res.data.data ?? []);
      }
    } catch (err) {
      console.error("Failed to fetch gallery:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
    categoryService.getAll().then((res) => {
      if (res.data.success) {
        setCategories(res.data.data ?? []);
      }
    });
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus foto galeri ini?")) {
      try {
        const res = await galleryService.delete(id);
        if (res.data.success) {
          fetchGallery();
        }
      } catch (err) {
        console.error("Failed to delete gallery item:", err);
        alert("Gagal menghapus gambar galeri.");
      }
    }
  };

  const handleOpenCreate = () => {
    setModalMode("create");
    setSelectedItem(null);
    setCaption("");
    setCategory("lifestyle");
    setAlt("");
    setOrder(0);
    setImageFile(null);
    setImagePreview("");
    setExistingImage("");
    setShowModal(true);
  };

  const handleOpenEdit = (item: GalleryItem) => {
    setModalMode("edit");
    setSelectedItem(item);
    setCaption(item.caption);
    setCategory(item.category || "lifestyle");
    setAlt(item.alt);
    setOrder(item.order || 0);
    setImageFile(null);
    setImagePreview("");
    setExistingImage(item.image);
    setShowModal(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      if (!caption) {
        // Pre-fill alt from file name
        setAlt(file.name.split(".")[0]);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("caption", caption);
      formData.append("category", category);
      formData.append("alt", alt || caption);
      formData.append("order", String(order));

      if (imageFile) {
        formData.append("image", imageFile);
      }

      let success = false;
      if (modalMode === "create") {
        const res = await galleryService.create(formData);
        success = res.data.success;
      } else if (modalMode === "edit" && selectedItem) {
        const res = await galleryService.update(selectedItem.id, formData);
        success = res.data.success;
      }

      if (success) {
        setShowModal(false);
        fetchGallery();
      }
    } catch (err: any) {
      console.error("Submit failed:", err);
      alert(err.response?.data?.message || "Gagal menyimpan gambar lookbook.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-dark">
            Lookbook <span className="text-terracotta italic">Galeri</span>
          </h1>
          <p className="text-sm text-soft-brown">
            Atur koleksi foto estetik dan lookbook model untuk menginspirasi
            pelanggan.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="px-5 py-3.5 bg-terracotta hover:bg-soft-brown text-white rounded-2xl text-sm font-semibold transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Foto</span>
        </button>
      </div>

      {/* Grid gallery display */}
      {loading ? (
        <div className="py-24 flex flex-col items-center justify-center bg-white/40 backdrop-blur-md rounded-[2rem] border border-white/30 shadow-sm">
          <div className="w-10 h-10 border-4 border-terracotta border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-sm text-soft-brown font-medium">Memuat galeri...</p>
        </div>
      ) : galleryItems.length === 0 ? (
        <div className="py-20 text-center bg-white/40 backdrop-blur-md rounded-[2rem] border border-white/30 shadow-sm">
          <ImageIcon className="w-16 h-16 text-terracotta/30 mx-auto mb-4" />
          <p className="text-lg font-display font-semibold text-dark">
            Galeri Masih Kosong
          </p>
          <p className="text-sm text-soft-brown mt-1">
            Tambahkan lookbook foto bergaya untuk menghidupkan halaman utama.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {galleryItems.map((item) => (
            <div
              key={item.id}
              className="bg-white/40 backdrop-blur-md p-4 rounded-3xl border border-white/30 shadow-sm flex flex-col justify-between group hover:shadow-md transition-all duration-300 relative overflow-hidden"
            >
              {/* Cover Image inside card */}
              <div className="aspect-square bg-dark/5 rounded-2xl overflow-hidden border border-terracotta/10 relative">
                <img
                  src={
                    item.image.startsWith("http")
                      ? item.image
                      : `/uploads/${item.image}`
                  }
                  alt={item.alt}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Category overlay */}
                <span className="absolute top-2.5 left-2.5 px-2.5 py-1 bg-dark/75 backdrop-blur-md text-linen text-[9px] font-bold tracking-widest uppercase rounded-full border border-white/10">
                  {item.category}
                </span>
              </div>

              {/* Caption and description info */}
              <div className="pt-4 pb-2 space-y-1">
                <p className="text-xs font-semibold text-dark truncate leading-snug">
                  {item.caption || "Lookbook look"}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-soft-brown font-bold uppercase tracking-wider">
                    Alt: {item.alt}
                  </span>
                  {item.order !== undefined && (
                    <span className="text-[10px] bg-terracotta/10 text-terracotta px-1.5 py-0.5 rounded-md font-bold">
                      Urutan: {item.order}
                    </span>
                  )}
                </div>
              </div>

              {/* Action buttons Overlay */}
              <div className="absolute top-4 right-4 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button
                  onClick={() => handleOpenEdit(item)}
                  className="p-2 bg-white hover:bg-terracotta text-soft-brown hover:text-white rounded-xl shadow-md transition-all cursor-pointer border border-terracotta/10"
                  title="Edit Caption"
                >
                  <Edit className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-2 bg-red-50 hover:bg-red-500 text-red-500 hover:text-white rounded-xl shadow-md transition-all cursor-pointer border border-red-100"
                  title="Hapus Foto"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* GALLERY ITEM FORM MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark/60 backdrop-blur-sm">
          <div className="bg-cream rounded-[2.5rem] border border-white/40 shadow-2xl w-full max-w-md overflow-hidden animate-zoom-in">
            <div className="p-6 sm:p-8 border-b border-terracotta/10 flex items-center justify-between bg-cream">
              <div>
                <h3 className="text-xl font-display font-bold text-dark">
                  {modalMode === "create"
                    ? "Tambah Foto Galeri"
                    : "Ubah Foto Galeri"}
                </h3>
                <p className="text-xs text-soft-brown">
                  Tambahkan estetika daster dsb. baru.
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 rounded-xl bg-white hover:bg-white/80 border border-white/40 text-dark transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5">
              {/* Image Input */}
              <div>
                <label className="block text-xs uppercase tracking-widest font-bold text-dark mb-2 font-body">
                  Pilih Gambar Lookbook
                </label>
                <div className="flex items-center gap-4">
                  {imagePreview || existingImage ? (
                    <div className="w-16 h-16 rounded-xl overflow-hidden border border-terracotta/10 relative flex-shrink-0 bg-white">
                      <img
                        src={
                          imagePreview ||
                          (existingImage.startsWith("http")
                            ? existingImage
                            : `/uploads/${existingImage}`)
                        }
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : null}

                  <label className="grow border-2 border-dashed border-terracotta/20 hover:border-terracotta rounded-2xl flex flex-col items-center justify-center py-4 bg-white/20 hover:bg-white/50 text-soft-brown hover:text-terracotta transition-all duration-300 cursor-pointer text-xs font-semibold gap-1">
                    <Upload className="w-4 h-4 text-terracotta" />
                    <span>
                      {imagePreview || existingImage
                        ? "Ganti Gambar"
                        : "Pilih File Gambar"}
                    </span>
                    <input
                      type="file"
                      required={modalMode === "create"}
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Caption */}
              <div>
                <label className="block text-xs uppercase tracking-widest font-bold text-dark mb-2 font-body">
                  Caption / Judul Foto
                </label>
                <input
                  type="text"
                  required
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Contoh: Model look daster daster manis"
                  className="w-full px-4 py-3 bg-white/60 border border-white/20 rounded-2xl focus:border-terracotta focus:bg-white focus:outline-none transition-all duration-300 text-sm font-body text-dark"
                />
              </div>

              {/* Category selector */}
              <div>
                <label className="block text-xs uppercase tracking-widest font-bold text-dark mb-2 font-body">
                  Kategori Lookbook
                </label>
                <select
                  required
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 bg-white/60 border border-white/20 rounded-2xl focus:border-terracotta focus:bg-white focus:outline-none transition-all duration-300 text-sm font-body text-dark cursor-pointer"
                >
                  <option value="lifestyle">Lifestyle / Model</option>
                  <option value="behind-the-scenes">Behind The Scenes</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.slug}>
                      Produk: {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Alt description */}
              <div>
                <label className="block text-xs uppercase tracking-widest font-bold text-dark mb-2 font-body">
                  Keterangan Alt (SEO Gambar)
                </label>
                <input
                  type="text"
                  value={alt}
                  onChange={(e) => setAlt(e.target.value)}
                  placeholder="Contoh: daster-rayon-cirebon-merah"
                  className="w-full px-4 py-3 bg-white/60 border border-white/20 rounded-2xl focus:border-terracotta focus:bg-white focus:outline-none transition-all duration-300 text-sm font-body text-dark"
                />
              </div>

              {/* Sort Order */}
              <div>
                <label className="block text-xs uppercase tracking-widest font-bold text-dark mb-2 font-body">
                  Urutan Tampilan (Angka)
                </label>
                <input
                  type="number"
                  required
                  value={order}
                  onChange={(e) => setOrder(parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-3 bg-white/60 border border-white/20 rounded-2xl focus:border-terracotta focus:bg-white focus:outline-none transition-all duration-300 text-sm font-body text-dark"
                />
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-terracotta/10 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 bg-white hover:bg-white/80 text-dark rounded-xl text-xs font-semibold transition-all border border-white/40 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 bg-terracotta hover:bg-soft-brown disabled:bg-terracotta/60 text-white rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  {submitting ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Simpan Foto</span>
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
