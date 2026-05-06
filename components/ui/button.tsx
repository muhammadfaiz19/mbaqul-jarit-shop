"use client";

import * as React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: "primary" | "outline" | "whatsapp" | "tiktok" | "ghost";
  size?: "sm" | "md" | "lg" | "icon";
  asChild?: boolean;
}

export default function Button({
  className,
  variant = "primary",
  size = "md",
  ...props
}: ButtonProps) {
  const variants = {
    primary: "bg-terracotta text-white hover:bg-deep-brown shadow-md hover:shadow-lg",
    outline: "border-2 border-terracotta text-terracotta hover:bg-terracotta hover:text-white",
    whatsapp: "bg-whatsapp text-white hover:opacity-90 shadow-md",
    tiktok: "bg-black text-white hover:bg-zinc-800 shadow-md",
    ghost: "text-dark hover:bg-white/20",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg font-bold",
    icon: "p-3 rounded-full",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        "inline-flex items-center justify-center rounded-full font-medium transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none cursor-pointer",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  );
}
