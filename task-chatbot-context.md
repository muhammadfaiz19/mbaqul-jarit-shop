# Task: Implementasi Frontend Admin Chatbot Context & File Management

## Objective

Tambahkan halaman **admin** untuk mengelola **ChatbotContext** (text-based context upsert by name) dan **ChatbotFile** (upload/list/delete dokumen PDF/Excel) di project frontend `mbaqul-jarit-shop`.

Backend endpoint sudah siap di `mbaqul-jarit-shop-be`. Task ini hanya mengerjakan sisi **frontend (Next.js)**.

---

## Tech Stack yang Digunakan

- **Framework**: Next.js 16 (App Router, `"use client"`)
- **Styling**: Tailwind CSS v4 (custom `@theme` tokens)
- **HTTP Client**: Axios via `lib/api.ts`
- **Icons**: `lucide-react`
- **State**: React `useState` + `useEffect` (tidak pakai state library)

---

## Daftar Perubahan (Checklist)

- [x] **1. Tambah type `ChatbotFile`** di `types/chatbot.ts`
- [x] **2. Update `services/chatbot.service.ts`** — tambahkan method untuk endpoint baru
- [x] **3. Redesign halaman `app/admin/dashboard/chatbot/page.tsx`** — tambahkan tab/section untuk Context dan File management

---

## Backend Endpoint yang Tersedia

| Method | Endpoint                      | Auth     | Deskripsi                                 |
| ------ | ----------------------------- | -------- | ----------------------------------------- |
| POST   | `/api/chatbot/`               | ❌ Public | Kirim pesan chat ke AI                    |
| GET    | `/api/chatbot/files`          | ✅ Admin  | List semua chatbot files                  |
| POST   | `/api/chatbot/files`          | ✅ Admin  | Upload file PDF/Excel (field: `file`)     |
| DELETE | `/api/chatbot/files/:id`      | ✅ Admin  | Hapus chatbot file by ID                  |
| GET    | `/api/chatbot/contexts/:name` | ✅ Admin  | Get chatbot context by name               |
| PUT    | `/api/chatbot/contexts/:name` | ✅ Admin  | Upsert (create/update) context by name    |

### Response Format

Semua endpoint backend mengembalikan format:
```json
{
  "status": 200,
  "success": true,
  "message": "...",
  "data": { ... }
}
```

### ChatbotFile Response Shape
```json
{
  "id": 1,
  "filename": "catalog.pdf",
  "filePath": "C:\\uploads\\1749...-catalog.webp",
  "fileUrl": "http://localhost:9090/uploads/1749...-catalog.webp",
  "content": "extracted text content...",
  "createdAt": "2026-06-11T04:12:00.000Z",
  "updatedAt": "2026-06-11T04:12:00.000Z"
}
```

### ChatbotContext Response Shape (by name)
```json
{
  "id": 1,
  "name": "mbaqul-jarit",
  "context": "Kamu adalah asisten virtual resmi...",
  "createdAt": "2026-06-11T04:00:00.000Z",
  "updatedAt": "2026-06-11T04:12:00.000Z"
}
```

---

## 1. Tambah Type `ChatbotFile`

**File:** `types/chatbot.ts`

Tambahkan interface `ChatbotFile` **di bawah** interface yang sudah ada. **JANGAN** hapus atau ubah interface lama.

```typescript
export interface ChatbotFile {
  id: number;
  filename: string;
  filePath: string;
  fileUrl: string;
  content: string;
  createdAt?: string;
  updatedAt?: string;
}
```

Setelah ditambahkan, file akan terlihat seperti ini:

```typescript
export interface ChatbotContext {
  id: number;
  name: string;
  context: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ChatMessage {
  message: string;
}

export interface ChatResponse {
  answer: string;
  reasoning: string;
}

export interface ChatbotFile {
  id: number;
  filename: string;
  filePath: string;
  fileUrl: string;
  content: string;
  createdAt?: string;
  updatedAt?: string;
}
```

---

## 2. Update `services/chatbot.service.ts`

**File:** `services/chatbot.service.ts`

Tambahkan method baru untuk endpoint context by name dan file management. **Jangan hapus** method yang sudah ada (`chat`, `getContexts`, `updateContext`).

Ganti **seluruh isi** file ini dengan:

```typescript
import api from "@/lib/api";
import type { ChatbotContext, ChatbotFile, ChatResponse, ApiResponse } from "@/types";

export const chatbotService = {
  // === Existing methods (jangan dihapus) ===
  chat: async (message: string) => {
    return api.post<ApiResponse<ChatResponse>>("/chatbot", { message });
  },

  getContexts: async () => {
    return api.get<ApiResponse<ChatbotContext[]>>("/chatbot/contexts");
  },

  updateContext: async (id: number, context: string) => {
    return api.put<ApiResponse<ChatbotContext>>(`/chatbot/contexts/${id}`, { context });
  },

  // === New methods untuk Context by Name ===
  getContextByName: async (name: string) => {
    return api.get<ApiResponse<ChatbotContext>>(`/chatbot/contexts/${name}`);
  },

  upsertContextByName: async (name: string, context: string) => {
    return api.put<ApiResponse<ChatbotContext>>(`/chatbot/contexts/${name}`, { context });
  },

  // === New methods untuk File Management ===
  getFiles: async () => {
    return api.get<ApiResponse<ChatbotFile[]>>("/chatbot/files");
  },

  uploadFile: async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return api.post<ApiResponse<ChatbotFile>>("/chatbot/files", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  deleteFile: async (id: number) => {
    return api.delete<ApiResponse<null>>(`/chatbot/files/${id}`);
  },
};
```

> **Catatan:** Pattern `FormData` + `multipart/form-data` header sudah digunakan di `gallery.service.ts`. Ikuti pola yang sama.

---

## 3. Redesign Halaman Admin Chatbot

**File:** `app/admin/dashboard/chatbot/page.tsx`

### Konsep Desain

Halaman chatbot admin dibagi menjadi **2 section/tab**:

1. **Tab "Ingatan Konteks"** — Editor textarea untuk mengelola text context chatbot (menggunakan `upsertContextByName` dengan name `"mbaqul-jarit"`)
2. **Tab "Dokumen Konteks"** — Upload & manage file PDF/Excel yang kontennya di-inject ke chatbot

### Referensi Pola UI

- **Loading state**: Gunakan spinner `w-10 h-10 border-4 border-terracotta border-t-transparent rounded-full animate-spin` (lihat pattern di halaman gallery)
- **Empty state**: Gunakan icon besar + teks deskriptif (lihat pattern di halaman gallery/chatbot lama)
- **Card/Container**: Gunakan class `bg-white/40 backdrop-blur-md rounded-[2rem] border border-white/30 shadow-sm`
- **Button primary**: `bg-terracotta hover:bg-soft-brown text-white rounded-xl text-xs font-semibold`
- **Button secondary**: `bg-white hover:bg-white/80 text-soft-brown rounded-xl text-xs font-semibold border border-white/40`
- **Label**: `text-xs uppercase tracking-widest font-bold text-dark mb-2 font-body`
- **Input/Textarea**: `w-full px-5 py-4 bg-white/70 border border-white/30 rounded-2xl focus:border-terracotta focus:bg-white focus:outline-none transition-all duration-300 text-sm font-body text-dark`
- **File upload area**: `border-2 border-dashed border-terracotta/20 hover:border-terracotta rounded-2xl` (lihat gallery page)

### Ganti **seluruh isi** file `page.tsx` dengan kode berikut:

```tsx
"use client";

import { useState, useEffect } from "react";
import { chatbotService } from "@/services/chatbot.service";
import type { ChatbotContext, ChatbotFile } from "@/types";
import {
  Bot,
  Save,
  AlertCircle,
  Check,
  RefreshCw,
  FileText,
  Upload,
  Trash2,
  FileSpreadsheet,
  Brain,
} from "lucide-react";

type TabType = "context" | "files";

export default function AdminChatbotPage() {
  const [activeTab, setActiveTab] = useState<TabType>("context");

  // === Context State ===
  const [context, setContext] = useState<ChatbotContext | null>(null);
  const [contextText, setContextText] = useState("");
  const [contextLoading, setContextLoading] = useState(true);
  const [savingContext, setSavingContext] = useState(false);
  const [contextSuccess, setContextSuccess] = useState(false);

  // === Files State ===
  const [files, setFiles] = useState<ChatbotFile[]>([]);
  const [filesLoading, setFilesLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // ==========================================
  // CONTEXT FUNCTIONS
  // ==========================================
  const fetchContext = async () => {
    setContextLoading(true);
    try {
      const res = await chatbotService.getContextByName("mbaqul-jarit");
      if (res.data.success && res.data.data) {
        setContext(res.data.data);
        setContextText(res.data.data.context);
      } else {
        // Context belum ada, user bisa buat baru
        setContext(null);
        setContextText("");
      }
    } catch (err: any) {
      // 404 = context belum ada, bukan error
      if (err.response?.status !== 404) {
        console.error("Failed to load chatbot context:", err);
      }
      setContext(null);
      setContextText("");
    } finally {
      setContextLoading(false);
    }
  };

  const handleSaveContext = async () => {
    setSavingContext(true);
    try {
      const res = await chatbotService.upsertContextByName("mbaqul-jarit", contextText);
      if (res.data.success) {
        setContext(res.data.data ?? null);
        setContextSuccess(true);
        setTimeout(() => setContextSuccess(false), 3000);
      }
    } catch (err) {
      console.error("Failed to save chatbot context:", err);
      alert("Gagal memperbarui ingatan chatbot. Coba beberapa saat lagi.");
    } finally {
      setSavingContext(false);
    }
  };

  // ==========================================
  // FILE FUNCTIONS
  // ==========================================
  const fetchFiles = async () => {
    setFilesLoading(true);
    try {
      const res = await chatbotService.getFiles();
      if (res.data.success) {
        setFiles(res.data.data ?? []);
      }
    } catch (err) {
      console.error("Failed to load chatbot files:", err);
    } finally {
      setFilesLoading(false);
    }
  };

  const handleUploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const res = await chatbotService.uploadFile(file);
      if (res.data.success) {
        fetchFiles(); // Refresh list
      }
    } catch (err: any) {
      console.error("Failed to upload file:", err);
      alert(err.response?.data?.message || "Gagal mengupload file. Pastikan file berformat PDF atau Excel.");
    } finally {
      setUploading(false);
      // Reset input
      e.target.value = "";
    }
  };

  const handleDeleteFile = async (id: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus dokumen ini?")) return;

    setDeletingId(id);
    try {
      const res = await chatbotService.deleteFile(id);
      if (res.data.success) {
        fetchFiles(); // Refresh list
      }
    } catch (err) {
      console.error("Failed to delete file:", err);
      alert("Gagal menghapus dokumen.");
    } finally {
      setDeletingId(null);
    }
  };

  // ==========================================
  // INITIAL LOAD
  // ==========================================
  useEffect(() => {
    fetchContext();
    fetchFiles();
  }, []);

  // ==========================================
  // RENDER
  // ==========================================
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-dark">
            Ingatan & Konteks <span className="text-terracotta italic">Chatbot AI</span>
          </h1>
          <p className="text-sm text-soft-brown">
            Kelola ingatan teks dan dokumen referensi agar chatbot AI menjawab
            pertanyaan pembeli dengan akurat.
          </p>
        </div>
        <button
          onClick={() => {
            fetchContext();
            fetchFiles();
          }}
          className="px-4 py-2.5 bg-white hover:bg-white/80 text-soft-brown rounded-xl text-xs font-semibold border border-white/40 flex items-center gap-1.5 cursor-pointer shadow-sm"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Tab Switcher */}
      <div className="flex gap-2">
        <button
          onClick={() => setActiveTab("context")}
          className={`px-5 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 flex items-center gap-2 cursor-pointer ${
            activeTab === "context"
              ? "bg-terracotta text-white shadow-md"
              : "bg-white/40 text-soft-brown hover:bg-white/60 border border-white/30"
          }`}
        >
          <Brain className="w-4 h-4" />
          <span>Ingatan Konteks</span>
        </button>
        <button
          onClick={() => setActiveTab("files")}
          className={`px-5 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 flex items-center gap-2 cursor-pointer ${
            activeTab === "files"
              ? "bg-terracotta text-white shadow-md"
              : "bg-white/40 text-soft-brown hover:bg-white/60 border border-white/30"
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Dokumen Konteks</span>
          {files.length > 0 && (
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                activeTab === "files"
                  ? "bg-white/20 text-white"
                  : "bg-terracotta/10 text-terracotta"
              }`}
            >
              {files.length}
            </span>
          )}
        </button>
      </div>

      {/* ==========================================
          TAB 1: INGATAN KONTEKS
          ========================================== */}
      {activeTab === "context" && (
        <div className="space-y-6">
          {/* Info Warning Card */}
          <div className="p-5 bg-terracotta/10 border border-terracotta/20 rounded-3xl flex items-start gap-3 text-dark">
            <AlertCircle className="w-5 h-5 text-terracotta flex-shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm font-body space-y-1">
              <p className="font-bold">💡 Tips Menulis Konteks Chatbot AI:</p>
              <p className="leading-relaxed text-soft-brown">
                Chatbot menggunakan ingatan ini untuk merespon pertanyaan
                pembeli. Semakin lengkap info jam operasional toko, daster
                unggulan, kebijakan diskon grosir, cara pemesanan, dan jaminan
                jahitan rapi yang ditulis di sini, semakin cerdas jawaban AI.
              </p>
            </div>
          </div>

          {/* Context Editor Card */}
          {contextLoading ? (
            <div className="py-24 flex flex-col items-center justify-center bg-white/40 backdrop-blur-md rounded-[2rem] border border-white/30 shadow-sm">
              <div className="w-10 h-10 border-4 border-terracotta border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-sm text-soft-brown font-medium">
                Memuat memori AI...
              </p>
            </div>
          ) : (
            <div className="bg-white/40 backdrop-blur-md p-6 sm:p-8 rounded-[2rem] border border-white/30 shadow-sm space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-terracotta/10 text-terracotta flex items-center justify-center">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-lg text-dark">
                      MBAQUL-JARIT
                    </h3>
                    <span className="text-[10px] text-soft-brown font-bold uppercase tracking-wider block">
                      {context
                        ? `ID memori: #${context.id}`
                        : "Belum ada — akan dibuat otomatis saat disimpan"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {contextSuccess && (
                    <span className="px-3 py-1.5 bg-emerald-500/10 text-emerald-600 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                      <Check className="w-4 h-4" />
                      <span>Berhasil Disimpan</span>
                    </span>
                  )}

                  <button
                    onClick={handleSaveContext}
                    disabled={savingContext}
                    className="px-4.5 py-2.5 bg-terracotta hover:bg-soft-brown disabled:bg-terracotta/60 text-white rounded-xl text-xs font-bold transition-all shadow-md hover:shadow-lg flex items-center gap-1.5 cursor-pointer"
                  >
                    {savingContext ? (
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
              <textarea
                value={contextText}
                onChange={(e) => setContextText(e.target.value)}
                placeholder="Tulis ingatan / konteks untuk chatbot AI di sini...&#10;&#10;Contoh: Kamu adalah asisten virtual resmi mbaQul Jarit Shop, toko online pakaian wanita berkualitas tinggi..."
                className="w-full px-5 py-4 bg-white/70 border border-white/30 rounded-2xl focus:border-terracotta focus:bg-white focus:outline-none transition-all duration-300 text-sm font-body text-dark h-80 shadow-inner"
              />
            </div>
          )}
        </div>
      )}

      {/* ==========================================
          TAB 2: DOKUMEN KONTEKS
          ========================================== */}
      {activeTab === "files" && (
        <div className="space-y-6">
          {/* Info Card */}
          <div className="p-5 bg-terracotta/10 border border-terracotta/20 rounded-3xl flex items-start gap-3 text-dark">
            <AlertCircle className="w-5 h-5 text-terracotta flex-shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm font-body space-y-1">
              <p className="font-bold">📄 Dokumen Referensi Chatbot:</p>
              <p className="leading-relaxed text-soft-brown">
                Upload file PDF atau Excel yang berisi informasi tambahan
                (katalog produk, panduan sizing, kebijakan toko, dll). Isi
                dokumen akan otomatis diekstrak dan disuntikkan ke memori
                chatbot sebagai konteks tambahan.
              </p>
            </div>
          </div>

          {/* Upload Area */}
          <div className="bg-white/40 backdrop-blur-md p-6 sm:p-8 rounded-[2rem] border border-white/30 shadow-sm">
            <label
              className={`border-2 border-dashed rounded-2xl flex flex-col items-center justify-center py-10 transition-all duration-300 cursor-pointer ${
                uploading
                  ? "border-terracotta/40 bg-terracotta/5"
                  : "border-terracotta/20 hover:border-terracotta bg-white/20 hover:bg-white/50"
              }`}
            >
              {uploading ? (
                <>
                  <div className="w-8 h-8 border-3 border-terracotta border-t-transparent rounded-full animate-spin mb-3"></div>
                  <span className="text-sm font-semibold text-terracotta">
                    Mengupload & mengekstrak teks...
                  </span>
                </>
              ) : (
                <>
                  <Upload className="w-8 h-8 text-terracotta mb-3" />
                  <span className="text-sm font-semibold text-soft-brown">
                    Klik untuk upload file PDF atau Excel
                  </span>
                  <span className="text-xs text-soft-brown/60 mt-1">
                    Format: .pdf, .xlsx, .xls
                  </span>
                </>
              )}
              <input
                type="file"
                accept=".pdf,.xlsx,.xls,application/pdf,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
                onChange={handleUploadFile}
                disabled={uploading}
                className="hidden"
              />
            </label>
          </div>

          {/* File List */}
          {filesLoading ? (
            <div className="py-24 flex flex-col items-center justify-center bg-white/40 backdrop-blur-md rounded-[2rem] border border-white/30 shadow-sm">
              <div className="w-10 h-10 border-4 border-terracotta border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-sm text-soft-brown font-medium">
                Memuat dokumen...
              </p>
            </div>
          ) : files.length === 0 ? (
            <div className="py-20 text-center bg-white/40 backdrop-blur-md rounded-[2rem] border border-white/30 shadow-sm">
              <FileText className="w-16 h-16 text-terracotta/30 mx-auto mb-4" />
              <p className="text-lg font-display font-semibold text-dark">
                Belum Ada Dokumen
              </p>
              <p className="text-sm text-soft-brown mt-1">
                Upload file PDF atau Excel untuk menambah pengetahuan chatbot.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {files.map((file) => (
                <div
                  key={file.id}
                  className="bg-white/40 backdrop-blur-md p-5 sm:p-6 rounded-2xl border border-white/30 shadow-sm flex items-center justify-between gap-4 group hover:shadow-md transition-all duration-300"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    {/* File Icon */}
                    <div className="w-12 h-12 rounded-xl bg-terracotta/10 text-terracotta flex items-center justify-center flex-shrink-0">
                      {file.filename.endsWith(".pdf") ? (
                        <FileText className="w-6 h-6" />
                      ) : (
                        <FileSpreadsheet className="w-6 h-6" />
                      )}
                    </div>

                    {/* File Info */}
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-dark truncate">
                        {file.filename}
                      </p>
                      <p className="text-[10px] text-soft-brown font-bold uppercase tracking-wider">
                        ID: #{file.id} •{" "}
                        {file.content.length > 100
                          ? `${file.content.length.toLocaleString()} karakter teks terekstrak`
                          : "Teks terekstrak"}
                      </p>
                      {file.createdAt && (
                        <p className="text-[10px] text-soft-brown/60 mt-0.5">
                          Diupload:{" "}
                          {new Date(file.createdAt).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Delete Button */}
                  <button
                    onClick={() => handleDeleteFile(file.id)}
                    disabled={deletingId === file.id}
                    className="p-2.5 bg-red-50 hover:bg-red-500 text-red-500 hover:text-white rounded-xl shadow-sm transition-all cursor-pointer border border-red-100 flex-shrink-0 disabled:opacity-50"
                    title="Hapus Dokumen"
                  >
                    {deletingId === file.id ? (
                      <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
```

---

## Catatan Penting untuk Developer

### Pola Kode yang Sudah Ada

1. **Axios instance** sudah di-setup di `lib/api.ts` dengan `baseURL: "/api"` (client-side) dan proxy rewrite via `next.config.ts`. Semua request otomatis forward ke backend.

2. **Cookie auth** sudah otomatis dikirim (`withCredentials: true`). Tidak perlu menambahkan token secara manual.

3. **FormData upload** pattern sudah ada di `gallery.service.ts`. Ikuti pola yang sama: buat `FormData`, append file, set header `multipart/form-data`.

4. **Design tokens** (warna `terracotta`, `cream`, `soft-brown`, `dark`, `linen`, dll.) didefinisikan di `globals.css`. Gunakan class Tailwind seperti `bg-terracotta`, `text-soft-brown`, dll.

5. **Type barrel export** ada di `types/index.ts`. Setelah menambahkan `ChatbotFile` di `types/chatbot.ts`, ia otomatis ter-export karena sudah ada `export * from './chatbot'` di `types/index.ts`.

### File yang TIDAK perlu diubah

- `actions/chatbot.ts` — tidak perlu diubah
- `types/index.ts` — tidak perlu diubah (sudah re-export semua dari `chatbot.ts`)
- `app/admin/layout.tsx` — sidebar sudah ada menu "Chatbot AI" yang mengarah ke `/admin/dashboard/chatbot`
- `lib/api.ts` — tidak perlu diubah
- `next.config.ts` — tidak perlu diubah (sudah ada rewrite `/api/*` ke backend)

### Testing Manual

Setelah semua selesai, buka browser dan navigasi ke halaman admin:

1. **Login** ke `http://localhost:3000/admin/login`
2. **Navigasi** ke menu **"Chatbot AI"** di sidebar
3. **Tab "Ingatan Konteks"**:
   - Tulis konteks baru / edit konteks yang sudah ada
   - Klik "Simpan Ingatan" → harus tampil badge "Berhasil Disimpan" selama 3 detik
4. **Tab "Dokumen Konteks"**:
   - Klik area upload → pilih file PDF atau Excel
   - File harus muncul di daftar setelah upload
   - Klik icon trash → harus tampil confirm → file terhapus dari list
5. **Test chatbot** (halaman publik): kirim pertanyaan → chatbot harus menjawab menggunakan data dari konteks teks + dokumen yang diupload
