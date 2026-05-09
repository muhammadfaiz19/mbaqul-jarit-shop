"use client";

import { useState, useEffect } from "react";
import { categoryService } from "@/services/category.service";
import type { Category } from "@/types";
import { FolderTree, Plus, Trash2, Edit, X, Upload, Check } from "lucide-react";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );
  const [submitting, setSubmitting] = useState(false);

  // Form Fields
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [existingImage, setExistingImage] = useState<string>("");

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await categoryService.getAll();
      if (res.data.success) {
        setCategories(res.data.data ?? []);
      }
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (slug: string) => {
    if (
      confirm(
        "Apakah Anda yakin ingin menghapus kategori ini? Menghapus kategori dapat mempengaruhi produk yang menggunakannya.",
      )
    ) {
      try {
        const res = await categoryService.delete(slug);
        if (res.data.success) {
          fetchCategories();
        }
      } catch (err) {
        console.error("Failed to delete category:", err);
        alert(
          "Gagal menghapus kategori. Pastikan tidak ada produk yang terkait dengan kategori ini.",
        );
      }
    }
  };

  const handleOpenCreate = () => {
    setModalMode("create");
    setSelectedCategory(null);
    setName("");
    setSlug("");
    setDescription("");
    setImageFile(null);
    setImagePreview("");
    setExistingImage("");
    setShowModal(true);
  };

  const handleOpenEdit = (cat: Category) => {
    setModalMode("edit");
    setSelectedCategory(cat);
    setName(cat.name);
    setSlug(cat.slug);
    setDescription(cat.description || "");
    setImageFile(null);
    setImagePreview("");
    setExistingImage(cat.image || "");
    setShowModal(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("slug", slug);
      formData.append("description", description);

      if (imageFile) {
        formData.append("image", imageFile);
      }

      let success = false;
      if (modalMode === "create") {
        const res = await categoryService.create(formData);
        success = res.data.success;
      } else if (modalMode === "edit" && selectedCategory) {
        const res = await categoryService.update(
          selectedCategory.slug,
          formData,
        );
        success = res.data.success;
      }

      if (success) {
        setShowModal(false);
        fetchCategories();
      }
    } catch (err: any) {
      console.error("Submit failed:", err);
      alert(
        err.response?.data?.message ||
          "Gagal menyimpan kategori. Periksa inputan Anda.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Auto-generate slug from name during create
  const handleNameChange = (val: string) => {
    setName(val);
    if (modalMode === "create") {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, "")
          .replace(/\s+/g, "-"),
      );
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-dark">
            Kelola <span className="text-terracotta italic">Kategori</span>
          </h1>
          <p className="text-sm text-soft-brown">
            Atur kategori utama untuk pengelompokkan produk daster & busana.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="px-5 py-3.5 bg-terracotta hover:bg-soft-brown text-white rounded-2xl text-sm font-semibold transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Kategori</span>
        </button>
      </div>

      {/* Grid of categories */}
      {loading ? (
        <div className="py-24 flex flex-col items-center justify-center bg-white/40 backdrop-blur-md rounded-[2rem] border border-white/30">
          <div className="w-10 h-10 border-4 border-terracotta border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-sm text-soft-brown font-medium">
            Memuat kategori...
          </p>
        </div>
      ) : categories.length === 0 ? (
        <div className="py-20 text-center bg-white/40 backdrop-blur-md rounded-[2rem] border border-white/30 shadow-sm">
          <FolderTree className="w-16 h-16 text-terracotta/30 mx-auto mb-4" />
          <p className="text-lg font-display font-semibold text-dark">
            Belum Ada Kategori
          </p>
          <p className="text-sm text-soft-brown mt-1">
            Tambahkan kategori untuk mulai mengelompokkan produk.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="bg-white/40 backdrop-blur-md p-6 rounded-[2rem] border border-white/30 shadow-sm flex flex-col justify-between group hover:shadow-md transition-all duration-300"
            >
              <div className="space-y-4">
                {/* Category Cover Image */}
                <div className="h-40 bg-dark/5 rounded-2xl overflow-hidden border border-terracotta/10 relative">
                  {cat.image ? (
                    <img
                      src={
                        cat.image.startsWith("http")
                          ? cat.image
                          : `/uploads/${cat.image}`
                      }
                      alt={cat.name}
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-soft-brown/30">
                      <FolderTree className="w-12 h-12" />
                    </div>
                  )}
                  <span className="absolute top-3 left-3 px-3 py-1 bg-dark/60 backdrop-blur-md text-linen text-[10px] font-bold tracking-widest uppercase rounded-full border border-white/10">
                    Slug: {cat.slug}
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="text-xl font-display font-bold text-dark group-hover:text-terracotta transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-soft-brown font-body line-clamp-2 leading-relaxed">
                    {cat.description || "Tidak ada deskripsi kategori."}
                  </p>
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-6 border-t border-terracotta/10 mt-6 flex gap-2">
                <button
                  onClick={() => handleOpenEdit(cat)}
                  className="grow py-2.5 bg-white hover:bg-terracotta/10 text-soft-brown hover:text-terracotta border border-white rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>Ubah</span>
                </button>
                <button
                  onClick={() => handleDelete(cat.slug)}
                  className="p-2.5 bg-red-50 hover:bg-red-500 hover:text-white text-red-500 rounded-xl transition-all cursor-pointer border border-red-200"
                  title="Hapus Kategori"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CATEGORY FORM MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark/60 backdrop-blur-sm">
          <div className="bg-cream rounded-[2.5rem] border border-white/40 shadow-2xl w-full max-w-md overflow-hidden animate-zoom-in">
            {/* Modal Header */}
            <div className="p-6 sm:p-8 border-b border-terracotta/10 flex items-center justify-between bg-cream z-10">
              <div>
                <h3 className="text-xl font-display font-bold text-dark">
                  {modalMode === "create" ? "Tambah Kategori" : "Ubah Kategori"}
                </h3>
                <p className="text-xs text-soft-brown">
                  Simpan folder pengelompokkan produk baru.
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 rounded-xl bg-white hover:bg-white/80 border border-white/40 text-dark transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5">
              {/* Category Name */}
              <div>
                <label className="block text-xs uppercase tracking-widest font-bold text-dark mb-2 font-body">
                  Nama Kategori
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="Contoh: Tunik Cantik"
                  className="w-full px-4 py-3 bg-white/60 border border-white/20 rounded-2xl focus:border-terracotta focus:bg-white focus:outline-none transition-all duration-300 text-sm font-body text-dark"
                />
              </div>

              {/* Category Slug */}
              <div>
                <label className="block text-xs uppercase tracking-widest font-bold text-dark mb-2 font-body">
                  Slug (URL link)
                </label>
                <input
                  type="text"
                  required
                  disabled={modalMode === "edit"}
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="tunik-cantik"
                  className="w-full px-4 py-3 bg-white/60 border border-white/20 rounded-2xl focus:border-terracotta focus:bg-white focus:outline-none transition-all duration-300 text-sm font-body text-dark disabled:opacity-50"
                />
              </div>

              {/* Category Description */}
              <div>
                <label className="block text-xs uppercase tracking-widest font-bold text-dark mb-2 font-body">
                  Deskripsi Kategori (Singkat)
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Keterangan singkat tentang koleksi tunik..."
                  className="w-full px-4 py-3 bg-white/60 border border-white/20 rounded-2xl focus:border-terracotta focus:bg-white focus:outline-none transition-all duration-300 text-sm font-body text-dark h-20 resize-none"
                />
              </div>

              {/* Image Upload Widget */}
              <div>
                <label className="block text-xs uppercase tracking-widest font-bold text-dark mb-2 font-body">
                  Sampul Gambar Kategori
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
                        : "Upload Gambar Kategori"}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Form Action Buttons */}
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
                      <span>Simpan Kategori</span>
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
