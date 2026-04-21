"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { X, ChevronLeft, ChevronRight, Heart } from "lucide-react";

interface Photo {
  url: string;
  publicId: string;
}

export default function PhotoGallery({ photos }: { photos: Photo[] }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [likedPhotos, setLikedPhotos] = useState<Set<string>>(new Set());

  if (!photos || photos.length === 0) return null;

  const toggleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikedPhotos((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const goNext = () => setLightboxIndex((i) => (i != null ? (i + 1) % photos.length : null));
  const goPrev = () => setLightboxIndex((i) => (i != null ? (i - 1 + photos.length) % photos.length : null));

  return (
    <section className="py-28 bg-white relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-rose-100/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-100/25 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <p className="text-sm font-bold uppercase tracking-widest text-[#F43F8F] mb-3">📸 Our Memories</p>
          <h2 className="text-4xl md:text-5xl font-serif text-gray-900 mb-4">Beautiful Moments Together</h2>
          <p className="text-muted-foreground text-lg">Click any photo to see it up close 💛</p>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.3 }}
            className="h-0.5 w-24 bg-linear-to-r from-[#F43F8F] to-[#D4AF37] mx-auto rounded-full mt-6"
          />
        </motion.div>

        {/* Masonry grid */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {photos.map((photo, index) => (
            <motion.div
              key={photo.publicId}
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.8, delay: (index % 6) * 0.08, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ scale: 1.02, zIndex: 10 }}
              onClick={() => setLightboxIndex(index)}
              className="relative overflow-hidden rounded-3xl group cursor-zoom-in shadow-lg hover:shadow-2xl hover:shadow-rose-200/40 transition-shadow duration-500 break-inside-avoid"
            >
              <Image
                src={photo.url}
                alt={`Memory ${index + 1}`}
                width={800}
                height={1000}
                className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />

              {/* Hover overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                className="absolute inset-0 bg-linear-to-t from-black/60 via-black/10 to-transparent flex items-end justify-between p-5"
              >
                <span className="text-white font-serif text-base translate-y-2 group-hover:translate-y-0 transition-transform duration-400">
                  Captured Forever ✨
                </span>
                {/* Like button */}
                <motion.button
                  whileHover={{ scale: 1.3 }}
                  whileTap={{ scale: 0.8 }}
                  onClick={(e) => toggleLike(photo.publicId, e)}
                  className="text-white drop-shadow-lg"
                >
                  <Heart
                    className={`w-6 h-6 transition-colors ${
                      likedPhotos.has(photo.publicId) ? "fill-rose-400 text-rose-400" : "text-white"
                    }`}
                  />
                </motion.button>
              </motion.div>

              {/* Corner badge */}
              <div className="absolute top-3 left-3 text-xs font-bold text-white bg-black/30 backdrop-blur-sm px-2 py-0.5 rounded-full">
                #{index + 1}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── Lightbox ──────────────────────── */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            key="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-md"
            onClick={() => setLightboxIndex(null)}
          >
            {/* Close */}
            <motion.button
              whileHover={{ scale: 1.15, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              className="absolute top-5 right-5 text-white z-10"
              onClick={() => setLightboxIndex(null)}
            >
              <X className="w-8 h-8" />
            </motion.button>

            {/* Prev / Next */}
            <motion.button
              whileHover={{ scale: 1.15 }}
              className="absolute left-4 text-white z-10"
              onClick={(e) => { e.stopPropagation(); goPrev(); }}
            >
              <ChevronLeft className="w-10 h-10" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.15 }}
              className="absolute right-4 text-white z-10"
              onClick={(e) => { e.stopPropagation(); goNext(); }}
            >
              <ChevronRight className="w-10 h-10" />
            </motion.button>

            {/* Image */}
            <AnimatePresence mode="wait">
              <motion.div
                key={lightboxIndex}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="relative max-w-4xl max-h-[85vh] rounded-3xl overflow-hidden shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <Image
                  src={photos[lightboxIndex].url}
                  alt={`Memory ${lightboxIndex + 1}`}
                  width={1200}
                  height={900}
                  className="object-contain max-h-[85vh] w-auto"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/50 to-transparent p-5 flex items-center justify-between">
                  <span className="text-white font-serif">Photo {lightboxIndex + 1} of {photos.length}</span>
                  <motion.button
                    whileHover={{ scale: 1.3 }}
                    whileTap={{ scale: 0.8 }}
                    onClick={(e) => toggleLike(photos[lightboxIndex].publicId, e)}
                    className="text-white"
                  >
                    <Heart
                      className={`w-6 h-6 ${
                        likedPhotos.has(photos[lightboxIndex].publicId)
                          ? "fill-rose-400 text-rose-400"
                          : "text-white"
                      }`}
                    />
                  </motion.button>
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
