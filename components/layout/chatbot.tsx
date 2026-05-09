"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { X, Send, Bot, User } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { sendMessageToChatbot } from "@/actions/chatbot";

interface Message {
  id: string;
  role: "user" | "bot";
  content: string;
  isError?: boolean;
}

const suggestions = [
  "Apa koleksi baju terbaru?",
  "Jelaskan tentang mbaQul Jarit Shop?",
  "Bagaimana cara pemesanannya?",
  "Rekomendasi daster?",
  "Bahan baju nya lembut dan nyaman dipakai?",
];

export default function Chatbot() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "bot",
      content: "Halo Kak! 👋 Saya asisten virtual mbaQul Jarit Shop. Ada yang bisa dibantu terkait detail produk, ukuran, bahan, ketersediaan stok, atau cara pemesanan?",
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageIdCounterRef = useRef(2);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isLoading]);

  if (pathname.startsWith("/admin")) return null;

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleSend = async (text: string) => {
    if (!text.trim() || isLoading) return;
    
    setInput("");
    const userMsgId = `msg-${messageIdCounterRef.current++}`;
    setMessages((prev) => [...prev, { id: userMsgId, role: "user", content: text }]);
    setIsLoading(true);

    try {
      const response = await sendMessageToChatbot(text);
      const botMsgId = `msg-${messageIdCounterRef.current++}`;
      setMessages((prev) => [
        ...prev,
        { id: botMsgId, role: "bot", content: response.answer },
      ]);
    } catch (error: unknown) {
      console.error("Chatbot Error:", error);
      const errorMsgId = `msg-${messageIdCounterRef.current++}`;
      setMessages((prev) => [
        ...prev,
        { 
          id: errorMsgId, 
          role: "bot", 
          content: "Mohon maaf Kak, terjadi sedikit kendala jaringan pada sistem asisten virtual kami. Silakan dicoba lagi sebentar lagi ya Kak, atau langsung hubungi WhatsApp kami!",
          isError: true 
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend(input);
    }
  };

  return (
    <>
      {/* Floating Designer Fabric Tag (Sewn Stitched Clothing Label Sticking Out) */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            onClick={() => setIsOpen(true)}
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 50, opacity: 0 }}
            whileHover={{ x: -6 }}
            className="fixed top-1/2 right-0 -translate-y-1/2 bg-linen border-y border-l border-dashed border-terracotta text-soft-brown py-6 px-3.5 rounded-l-2xl shadow-xl flex flex-col items-center gap-3 cursor-pointer z-50 group hover:bg-white transition-all duration-300"
            aria-label="Tanya Asisten mbaQul"
          >
            {/* Thread Stitch Glow */}
            <motion.div
              animate={{ scale: [1, 1.1, 1], opacity: [0.15, 0.3, 0.15] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 bg-terracotta rounded-l-2xl pointer-events-none"
            />
            <Bot size={18} className="text-terracotta relative z-10 animate-pulse" />
            <span className="[writing-mode:vertical-lr] rotate-180 text-[10px] font-body tracking-[0.25em] font-bold uppercase select-none pb-1 relative z-10 text-soft-brown group-hover:text-terracotta transition-colors">
              Tanya mbaQul
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Backdrop for Side Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={handleClose}
            className="fixed inset-0 bg-dark/30 backdrop-blur-xs z-100 cursor-pointer"
          />
        )}
      </AnimatePresence>

      {/* Side Lookbook Concierge Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 260 }}
            className="fixed top-0 right-0 h-screen w-full sm:w-[450px] bg-cream/98 backdrop-blur-md shadow-2xl z-110 flex flex-col border-l border-dashed border-dusty-pink/50"
            style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
          >
            {/* Editorial Header Panel */}
            <div className="p-6 pt-10 border-b border-dashed border-dusty-pink/60 bg-white/40 relative overflow-hidden shrink-0">
              <div className="absolute -top-12 -left-12 w-32 h-32 bg-dusty-pink/15 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute top-8 right-6 w-3 h-3 bg-terracotta/20 rounded-full blur-xs pointer-events-none" />

              <div className="flex items-start justify-between relative z-10">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-white border border-dashed border-terracotta/40 flex items-center justify-center shadow-xs shrink-0">
                    <Bot size={22} className="text-terracotta" />
                  </div>
                  <div>
                    <span className="text-[10px] font-body tracking-[0.25em] font-extrabold text-terracotta uppercase block mb-1">
                      Asisten Belanja Pribadi
                    </span>
                    <h3 className="font-display font-extrabold text-[21px] tracking-wide text-dark leading-none">
                      Teman Gaya mbaQul
                    </h3>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-terracotta opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-terracotta"></span>
                      </span>
                      <p className="text-[11px] font-body text-soft-brown font-semibold tracking-wide">Siap bantu Kakak pilih model &amp; ukuran yang pas</p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleClose}
                  className="p-1.5 hover:bg-linen border border-transparent hover:border-dusty-pink/30 rounded-full transition-all text-soft-brown cursor-pointer hover:rotate-90 duration-300"
                  title="Tutup Teman Gaya"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Message Timeline */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden p-5 md:p-6 space-y-6 bg-linear-to-b from-cream/20 to-white/10">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3.5 ${
                    msg.role === "user" ? "ml-auto flex-row-reverse max-w-[85%]" : "max-w-[95%] sm:max-w-[92%]"
                  }`}
                >
                  <div className={`w-8.5 h-8.5 rounded-full flex items-center justify-center shrink-0 mt-1 shadow-xs border
                    ${msg.role === "user" 
                      ? "bg-terracotta border-terracotta text-white" 
                      : "bg-white border-dashed border-dusty-pink/60 text-mauve"}
                  `}>
                    {msg.role === "user" ? <User size={14} /> : <Bot size={14} />}
                  </div>

                  <div className={`flex flex-col gap-1.5 min-w-0 ${msg.role === "user" ? "items-end" : "items-start flex-1"}`}>
                    <div className={`px-4.5 py-4 rounded-[22px] leading-relaxed relative w-full overflow-hidden shadow-xs
                      ${msg.role === "user"
                        ? "bg-terracotta text-white rounded-tr-none font-body text-[14px]"
                        : msg.isError
                          ? "bg-red-50 text-red-600 border border-red-100 rounded-tl-none font-body text-[14px]"
                          : "bg-white border border-dashed border-dusty-pink/60 text-dark rounded-tl-none font-body text-[14px]"
                      }
                    `}>
                      {msg.role === "user" ? (
                        <div className="whitespace-pre-wrap leading-relaxed text-[14.5px] font-body">{msg.content}</div>
                      ) : (
                        <div className="markdown-prose wrap-break-word space-y-3 font-body text-[14.5px] text-dark/95">
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                              p: ({node, ...props}) => { void node; return <p className="mb-4 last:mb-0 leading-[1.65] font-body text-[14.5px] whitespace-pre-wrap text-dark/90" {...props} />; },
                              a: ({node, ...props}) => { void node; return <a className="text-terracotta underline hover:text-deep-brown font-semibold transition-colors duration-200" target="_blank" rel="noopener noreferrer" {...props} />; },
                              ul: ({node, ...props}) => { void node; return <ul className="list-disc pl-5 mb-4 space-y-1.5 font-body text-[14.5px]" {...props} />; },
                              ol: ({node, ...props}) => { void node; return <ol className="list-decimal pl-5 mb-4 space-y-1.5 font-body text-[14.5px]" {...props} />; },
                              li: ({node, ...props}) => { void node; return <li className="mb-1 leading-relaxed whitespace-pre-wrap" {...props} />; },
                              h3: ({node, ...props}) => { void node; return <h3 className="font-display font-bold text-dark text-[17px] mb-3 mt-4 border-b border-dashed border-dusty-pink/40 pb-1" {...props} />; },
                              h4: ({node, ...props}) => { void node; return <h4 className="font-display font-semibold text-dark text-[15px] mb-2 mt-3" {...props} />; },
                              strong: ({node, ...props}) => { void node; return <strong className="font-bold text-deep-brown" {...props} />; },
                              table: ({node, ...props}) => { void node; return <div className="overflow-x-auto my-4 rounded-2xl border border-dusty-pink/30 shadow-sm"><table className="w-full text-left border-collapse text-xs font-body" {...props} /></div>; },
                              thead: ({node, ...props}) => { void node; return <thead className="bg-linen/70 text-deep-brown font-semibold" {...props} />; },
                              tbody: ({node, ...props}) => { void node; return <tbody className="divide-y divide-dusty-pink/10" {...props} />; },
                              tr: ({node, ...props}) => { void node; return <tr className="hover:bg-linen/20 transition-colors" {...props} />; },
                              th: ({node, ...props}) => { void node; return <th className="p-3 border-b border-dusty-pink/20 font-bold text-[13px]" {...props} />; },
                              td: ({node, ...props}) => { void node; return <td className="p-3 border-b border-dusty-pink/10 align-top text-[13px] leading-relaxed" {...props} />; }
                            }}
                          >
                            {msg.content}
                          </ReactMarkdown>
                        </div>
                      )}
                    </div>
                    <span className="text-[10px] font-body text-soft-brown/60 px-1 font-semibold tracking-wider uppercase">
                      {msg.role === "user" ? "Kakak" : "Asisten mbaQul"}
                    </span>
                  </div>
                </motion.div>
              ))}

              {isLoading && (
                <div className="flex gap-3.5 max-w-[85%]">
                  <div className="w-8.5 h-8.5 rounded-full bg-white border border-dashed border-dusty-pink/60 text-mauve flex items-center justify-center shrink-0 mt-1 shadow-xs">
                    <Bot size={14} />
                  </div>
                  <div className="bg-white border border-dashed border-dusty-pink/60 shadow-xs px-5 py-3.5 rounded-2xl rounded-tl-none flex items-center gap-2.5">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-terracotta/60 rounded-full animate-bounce [animation-delay:-0.3s]" />
                      <div className="w-2 h-2 bg-terracotta/60 rounded-full animate-bounce [animation-delay:-0.15s]" />
                      <div className="w-2 h-2 bg-terracotta/60 rounded-full animate-bounce" />
                    </div>
                    <span className="text-xs font-body text-soft-brown font-medium ml-1">Sedang memproses permintaan Anda...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} className="h-1" />
            </div>

            {/* Suggestions Panel (Stitched Fabric Tags look) */}
            {messages.length === 1 && !isLoading && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="px-5 pb-5 bg-white/30 border-t border-dashed border-dusty-pink/40 pt-4"
              >
                <p className="text-[10px] font-body font-bold text-soft-brown mb-3 uppercase tracking-widest ml-1">Inspirasi Pertanyaan:</p>
                <div className="flex flex-wrap gap-2">
                  {suggestions.map((suggestion, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(suggestion)}
                      className="text-xs text-left bg-white border border-dashed border-terracotta/30 text-soft-brown hover:border-terracotta hover:text-terracotta hover:bg-linen/20 px-4 py-2.5 rounded-full transition-all duration-200 shadow-xs hover:shadow-sm cursor-pointer font-body font-semibold"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Editorial Form Input Control */}
            <div className="p-5 sm:p-6 bg-white border-t border-dashed border-dusty-pink/40 mt-auto shadow-[0_-15px_30px_-15px_rgba(138,106,90,0.08)] shrink-0">
              <div className="flex items-center gap-2 bg-linen/20 rounded-full p-2 pl-5 border border-dashed border-dusty-pink/60 focus-within:border-terracotta focus-within:bg-white focus-within:ring-4 focus-within:ring-terracotta/5 transition-all duration-300">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Tanyakan produk, ukuran, atau cara beli..."
                  className="flex-1 bg-transparent text-[14px] md:text-[15px] font-body text-dark focus:outline-none placeholder:text-soft-brown/30 py-2 min-w-0"
                  disabled={isLoading}
                  autoComplete="off"
                />
                <button
                  onClick={() => handleSend(input)}
                  disabled={!input.trim() || isLoading}
                  className="w-10 h-10 bg-terracotta hover:bg-deep-brown text-white rounded-full flex items-center justify-center shrink-0 disabled:opacity-20 disabled:scale-95 transition-all shadow-sm active:scale-95 cursor-pointer"
                  title="Kirim Pesan"
                >
                  <Send size={15} className="translate-x-px" />
                </button>
              </div>

              <div className="flex items-center justify-center gap-2 text-[10px] font-body text-soft-brown/50 mt-4 tracking-wider uppercase font-bold select-none">
                <span className="w-1.5 h-1.5 rounded-full bg-terracotta/40" />
                <span>Asisten Belanja Pribadi mbaQul Shop</span>
                <span className="w-1.5 h-1.5 rounded-full bg-terracotta/40" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
