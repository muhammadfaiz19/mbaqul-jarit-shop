"use client";

import { useState, useEffect } from "react";
import { faqService } from "@/services/faq.service";
import type { Faq } from "@/types";
import { HelpCircle, Plus, Trash2, Edit, X, Check } from "lucide-react";

export default function AdminFaqsPage() {
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedFaq, setSelectedFaq] = useState<Faq | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form Fields State
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [order, setOrder] = useState(0);

  const fetchFaqs = async () => {
    setLoading(true);
    try {
      const res = await faqService.getAll();
      if (res.data.success) {
        // Sort by order asc
        const sorted = (res.data.data ?? []).sort(
          (a, b) => (a.order || 0) - (b.order || 0),
        );
        setFaqs(sorted);
      }
    } catch (err) {
      console.error("Failed to fetch FAQs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  const handleDelete = async (id: number) => {
    if (confirm("Apakah Anda yakin ingin menghapus FAQ ini?")) {
      try {
        const res = await faqService.delete(id);
        if (res.data.success) {
          fetchFaqs();
        }
      } catch (err) {
        console.error("Failed to delete FAQ:", err);
        alert("Gagal menghapus FAQ.");
      }
    }
  };

  const handleOpenCreate = () => {
    setModalMode("create");
    setSelectedFaq(null);
    setQuestion("");
    setAnswer("");
    setOrder(faqs.length);
    setShowModal(true);
  };

  const handleOpenEdit = (faq: Faq) => {
    setModalMode("edit");
    setSelectedFaq(faq);
    setQuestion(faq.question);
    setAnswer(faq.answer);
    setOrder(faq.order || 0);
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      let success = false;
      if (modalMode === "create") {
        const res = await faqService.create({ question, answer, order });
        success = res.data.success;
      } else if (modalMode === "edit" && selectedFaq) {
        const res = await faqService.update(selectedFaq.id, {
          question,
          answer,
          order,
        });
        success = res.data.success;
      }

      if (success) {
        setShowModal(false);
        fetchFaqs();
      }
    } catch (err: any) {
      console.error("Submit failed:", err);
      alert("Gagal menyimpan FAQ.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-dark">
            Kelola Tanya{" "}
            <span className="text-terracotta italic">Jawab (FAQs)</span>
          </h1>
          <p className="text-sm text-soft-brown">
            Atur daftar Frequently Asked Questions yang muncul di halaman depan
            toko.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="px-5 py-3.5 bg-terracotta hover:bg-soft-brown text-white rounded-2xl text-sm font-semibold transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah FAQ</span>
        </button>
      </div>

      {/* List display of FAQ panels */}
      {loading ? (
        <div className="py-24 flex flex-col items-center justify-center bg-white/40 backdrop-blur-md rounded-[2rem] border border-white/30 shadow-sm">
          <div className="w-10 h-10 border-4 border-terracotta border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-sm text-soft-brown font-medium">
            Memuat tanya jawab...
          </p>
        </div>
      ) : faqs.length === 0 ? (
        <div className="py-20 text-center bg-white/40 backdrop-blur-md rounded-[2rem] border border-white/30 shadow-sm">
          <HelpCircle className="w-16 h-16 text-terracotta/30 mx-auto mb-4" />
          <p className="text-lg font-display font-semibold text-dark">
            Belum Ada FAQ
          </p>
          <p className="text-sm text-soft-brown mt-1">
            Tambahkan FAQ untuk menghemat waktu menjawab chat berulang dari
            customer.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {faqs.map((faq) => (
            <div
              key={faq.id}
              className="bg-white/40 backdrop-blur-md p-6 rounded-3xl border border-white/30 shadow-sm hover:shadow-md transition-all duration-300 flex items-start justify-between gap-4 group"
            >
              <div className="space-y-2 min-w-0">
                <div className="flex items-center gap-3">
                  <span className="text-[11px] bg-terracotta/15 text-terracotta font-bold px-2 py-0.5 rounded-md flex-shrink-0">
                    Order: {faq.order}
                  </span>
                  <h3 className="font-display font-bold text-lg text-dark truncate">
                    {faq.question}
                  </h3>
                </div>
                <p className="text-sm text-soft-brown leading-relaxed pl-1 font-body">
                  {faq.answer}
                </p>
              </div>

              {/* FAQ Actions buttons */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => handleOpenEdit(faq)}
                  className="p-2 bg-white hover:bg-terracotta text-soft-brown hover:text-white rounded-xl shadow-sm transition-all cursor-pointer border border-terracotta/10"
                  title="Ubah Q&A"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(faq.id)}
                  className="p-2 bg-red-50 hover:bg-red-500 text-red-500 hover:text-white rounded-xl shadow-sm transition-all cursor-pointer border border-red-200"
                  title="Hapus Q&A"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* FAQ EDIT FORM MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark/60 backdrop-blur-sm">
          <div className="bg-cream rounded-[2.5rem] border border-white/40 shadow-2xl w-full max-w-lg overflow-hidden animate-zoom-in">
            <div className="p-6 sm:p-8 border-b border-terracotta/10 flex items-center justify-between bg-cream">
              <div>
                <h3 className="text-xl font-display font-bold text-dark">
                  {modalMode === "create"
                    ? "Tambah Tanya Jawab"
                    : "Ubah Tanya Jawab"}
                </h3>
                <p className="text-xs text-soft-brown">
                  Atur deskripsi pertanyaan & balasan bantuan.
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
              {/* Question */}
              <div>
                <label className="block text-xs uppercase tracking-widest font-bold text-dark mb-2 font-body">
                  Pertanyaan FAQ
                </label>
                <input
                  type="text"
                  required
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Contoh: Apakah bisa retur jika ukuran salah?"
                  className="w-full px-4 py-3 bg-white/60 border border-white/20 rounded-2xl focus:border-terracotta focus:bg-white focus:outline-none transition-all duration-300 text-sm font-body text-dark"
                />
              </div>

              {/* Answer */}
              <div>
                <label className="block text-xs uppercase tracking-widest font-bold text-dark mb-2 font-body">
                  Jawaban Penjelasan
                </label>
                <textarea
                  required
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Contoh: Bisa kak, maksimal 3 hari setelah paket sampai dengan video unboxing lengkap..."
                  className="w-full px-4 py-3 bg-white/60 border border-white/20 rounded-2xl focus:border-terracotta focus:bg-white focus:outline-none transition-all duration-300 text-sm font-body text-dark h-32"
                />
              </div>

              {/* Sort Order */}
              <div>
                <label className="block text-xs uppercase tracking-widest font-bold text-dark mb-2 font-body">
                  Urutan Tampilan
                </label>
                <input
                  type="number"
                  required
                  value={order}
                  onChange={(e) => setOrder(parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-3 bg-white/60 border border-white/20 rounded-2xl focus:border-terracotta focus:bg-white focus:outline-none transition-all duration-300 text-sm font-body text-dark"
                />
              </div>

              {/* Action Buttons */}
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
                      <span>Simpan FAQ</span>
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
