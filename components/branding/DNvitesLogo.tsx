"use client";

import { motion } from "framer-motion";

export function DNvitesLogo({ className = "" }: { className?: string }) {
  return (
    <motion.div
      className={`inline-flex items-center gap-2 ${className}`}
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {/* Logo Image */}
      <motion.div
        animate={{ scale: [1, 1.02, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="relative w-8 h-8 rounded-md overflow-hidden"
      >
        <img 
          src="/logo.png" 
          alt="DNvites Logo" 
          className="w-full h-full object-cover"
        />
      </motion.div>

      {/* Brand text */}
      <span
        style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
        className="text-xl font-bold tracking-tight leading-none"
      >
        <span className="text-[#F43F8F]">DN</span>
        <span className="text-[#D4AF37]">vites</span>
      </span>
    </motion.div>
  );
}
