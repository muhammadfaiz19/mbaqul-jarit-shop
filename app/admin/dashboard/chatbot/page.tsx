"use client";

import { useState, useEffect } from "react";
import { chatbotService } from "@/services/chatbot.service";
import type { ChatbotContext } from "@/types";
import { Bot, Save, AlertCircle, Sparkles, Check, RefreshCw } from "lucide-react";

export default function AdminChatbotPage() {
  const [contexts, setContexts] = useState<ChatbotContext[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<number | null>(null);
  const [successId, setSuccessId] = useState<number | null>(null);

  const fetchContexts = async () => {
    setLoading(true);
    try {
      const res = await chatbotService.getContexts();
      if (res.data.success) {
        setContexts(res.data.data ?? []);
      }
    } catch (err) {
      console.error("Failed to load chatbot contexts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContexts();
  }, []);

  const handleContextChange = (id: number, newValue: string) => {
    setContexts((prev) =>
      prev.map((ctx) => (ctx.id === id ? { ...ctx, context: newValue } : ctx))
    );
  };

  const handleSave = async (id: number, text: string) => {
    setSavingId(id);
    try {
      const res = await chatbotService.updateContext(id, text);
      if (res.data.success) {
        setSuccessId(id);
        setTimeout(() => setSuccessId(null), 3000); // clear success tag after 3s
      }
    } catch (err) {
      console.error("Failed to save chatbot context:", err);
      alert("Gagal memperbarui ingatan chatbot. Coba beberapa saat lagi.");
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-dark">
            Ingatan & Konteks <span className="text-terracotta italic">Chatbot AI</span>
          </h1>
          <p className="text-sm text-soft-brown">
            Tulis ingatan kustom untuk model AI agar asisten pintar website menjawab chat pembeli dengan akurat.
          </p>
        </div>
        <button
          onClick={fetchContexts}
          className="px-4 py-2.5 bg-white hover:bg-white/80 text-soft-brown rounded-xl text-xs font-semibold border border-white/40 flex items-center gap-1.5 cursor-pointer shadow-sm"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Info Warning Card */}
      <div className="p-5 bg-terracotta/10 border border-terracotta/20 rounded-3xl flex items-start gap-3 text-dark">
        <AlertCircle className="w-5 h-5 text-terracotta flex-shrink-0 mt-0.5" />
        <div className="text-xs sm:text-sm font-body space-y-1">
          <p className="font-bold">💡 Tips Menulis Konteks Chatbot AI:</p>
          <p className="leading-relaxed text-soft-brown">
            Chatbot menggunakan ingatan ini untuk merespon pertanyaan pembeli. Semakin lengkap info jam operasional toko, daster unggulan, kebijakan diskon grosir, cara pemesanan, dan jaminan jahitan rapi yang ditulis di sini, semakin cerdas jawaban AI. Gunakan bahasa kasual, ramah, dan solutif.
          </p>
        </div>
      </div>

      {/* Loading state */}
      {loading ? (
        <div className="py-24 flex flex-col items-center justify-center bg-white/40 backdrop-blur-md rounded-[2rem] border border-white/30 shadow-sm">
          <div className="w-10 h-10 border-4 border-terracotta border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-sm text-soft-brown font-medium">Memuat memori AI...</p>
        </div>
      ) : contexts.length === 0 ? (
        <div className="py-20 text-center bg-white/40 backdrop-blur-md rounded-[2rem] border border-white/30 shadow-sm">
          <Bot className="w-16 h-16 text-terracotta/30 mx-auto mb-4" />
          <p className="text-lg font-display font-semibold text-dark">Belum Ada Konteks</p>
          <p className="text-sm text-soft-brown mt-1">Harap jalankan database seed di backend untuk menginisialisasi memori AI.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8">
          {contexts.map((ctx) => (
            <div
              key={ctx.id}
              className="bg-white/40 backdrop-blur-md p-6 sm:p-8 rounded-[2rem] border border-white/30 shadow-sm space-y-4 group"
            >
              {/* Context Row Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-terracotta/10 text-terracotta flex items-center justify-center">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-lg text-dark uppercase tracking-wide">
                      {ctx.name.replace(/_/g, " ")}
                    </h3>
                    <span className="text-[10px] text-soft-brown font-bold uppercase tracking-wider block">ID memori: #{ctx.id}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {successId === ctx.id && (
                    <span className="px-3 py-1.5 bg-emerald-500/10 text-emerald-600 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                      <Check className="w-4 h-4" />
                      <span>Berhasil Disimpan</span>
                    </span>
                  )}

                  <button
                    onClick={() => handleSave(ctx.id, ctx.context)}
                    disabled={savingId === ctx.id}
                    className="px-4.5 py-2.5 bg-terracotta hover:bg-soft-brown disabled:bg-terracotta/60 text-white rounded-xl text-xs font-bold transition-all shadow-md hover:shadow-lg flex items-center gap-1.5 cursor-pointer"
                  >
                    {savingId === ctx.id ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>Simpan Ingatan</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Textarea Editor */}
              <div>
                <textarea
                  value={ctx.context}
                  onChange={(e) => handleContextChange(ctx.id, e.target.value)}
                  placeholder="Isi memori / data chatbot..."
                  className="w-full px-5 py-4 bg-white/70 border border-white/30 rounded-2xl focus:border-terracotta focus:bg-white focus:outline-none transition-all duration-300 text-sm font-body text-dark h-72 shadow-inner"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
