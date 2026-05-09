"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { faqService } from "@/services/faq.service";
import type { Faq } from "@/types";
import SectionHeading from "../ui/section-heading";
import { cn } from "@/lib/utils";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [faqsList, setFaqsList] = useState<Faq[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    faqService.getAll()
      .then(res => {
        if (res.data.success && res.data.data && res.data.data.length > 0) {
          setFaqsList(res.data.data);
        }
      })
      .catch(err => {
        console.error("Failed to load FAQs from API:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="section-padding relative z-10 max-w-4xl mx-auto">
        <SectionHeading
          title="Pertanyaan Umum"
          subtitle="FAQ"
        />

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-terracotta border-t-transparent rounded-full animate-spin" />
          </div>
        ) : faqsList.length === 0 ? (
          <div className="text-center text-soft-brown py-12">
            Belum ada pertanyaan umum yang tersedia.
          </div>
        ) : (
          <div className="space-y-4">
            {faqsList.map((faq, index) => {
              const isOpen = openIndex === index;
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={cn(
                    "border border-terracotta/10 rounded-2xl overflow-hidden transition-all duration-300",
                    isOpen ? "bg-linen/30 shadow-lg" : "bg-white hover:border-terracotta/30 hover:bg-linen/10"
                  )}
                >
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full text-left px-8 py-6 flex items-center justify-between gap-4 focus:outline-none"
                  >
                    <span className="font-display text-lg text-dark">{faq.question}</span>
                    <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300",
                      isOpen ? "bg-terracotta text-white rotate-180" : "bg-terracotta/10 text-terracotta"
                    )}>
                      <ChevronDown className="w-5 h-5" />
                    </div>
                  </button>
                  
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="px-8 pb-8 pt-2 text-soft-brown leading-relaxed">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
