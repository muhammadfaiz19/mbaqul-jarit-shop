"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  className?: string;
  align?: "left" | "center" | "right";
  light?: boolean;
}

export default function SectionHeading({
  title,
  subtitle,
  className,
  align = "center",
  light = false,
}: SectionHeadingProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={cn(
        "mb-12 md:mb-16",
        align === "center" && "text-center mx-auto",
        align === "right" && "text-right ml-auto",
        className
      )}
    >
      {subtitle && (
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className={cn(
            "text-terracotta font-medium mb-3 tracking-wider uppercase text-sm",
            light && "text-dusty-pink"
          )}
        >
          {subtitle}
        </motion.p>
      )}
      <h2 className={cn(
        "text-3xl md:text-5xl font-display leading-tight",
        light && "text-white"
      )}>
        {title}
      </h2>
      <div className={cn(
        "h-1.5 w-24 mt-6 rounded-full bg-terracotta/20",
        align === "center" && "mx-auto",
        align === "right" && "ml-auto"
      )}>
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: "40%" }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="h-full bg-terracotta rounded-full"
        />
      </div>
    </motion.div>
  );
}
