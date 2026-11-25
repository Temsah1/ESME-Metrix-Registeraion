"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Camera, Expand, X } from "lucide-react";
import type { GalleryItem } from "@/lib/cms/types";

const LOCAL_SVG_FALLBACKS = [
  "/images/gallery/event-1.jpg",
  "/images/gallery/event-2.jpg",
  "/images/gallery/event-3.jpg",
  "/images/gallery/event-4.jpg",
  "/images/gallery/event-5.jpg",
  "/images/gallery/event-6.jpg",
  "/images/gallery/event-7.jpg",
  "/images/gallery/event-8.jpg",
];

interface GalleryShowcaseProps {
  gallery: GalleryItem[];
  eyebrow: string;
  title: string;
  subtitle: string;
}

export default function GalleryShowcase({
  gallery,
  eyebrow,
  title,
  subtitle,
}: GalleryShowcaseProps) {
  const [activeLightbox, setActiveLightbox] = useState<GalleryItem | null>(null);
  const [failedIds, setFailedIds] = useState<Record<string, boolean>>({});

  const resolveSrc = (item: GalleryItem, idx: number) => {
    if (failedIds[item.id] || !item.url.trim()) {
      return LOCAL_SVG_FALLBACKS[idx % LOCAL_SVG_FALLBACKS.length];
    }
    return item.url;
  };

  return (
    <section
      id="gallery"
      data-aos="fade-up"
      className="relative z-10 max-w-6xl mx-auto px-4 py-16 sm:py-20 w-full"
    >
      <div className="text-center mb-10 sm:mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[#D97706]/30 bg-[#0F243A] text-[#F59E0B] font-mono text-xs mb-3 font-semibold">
          <Camera className="w-3.5 h-3.5" />
          {eyebrow}
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-2.5 tracking-tight">
          {title}
        </h2>
        <p className="text-slate-300 text-sm max-w-2xl mx-auto leading-relaxed">
          {subtitle}
        </p>
      </div>

      {/* Desktop 4x2 Responsive Grid (8 images) */}
      <div className="hidden md:grid md:grid-cols-4 gap-4">
        {gallery.map((item, idx) => (
          <motion.button
            key={item.id || idx}
            type="button"
            onClick={() => setActiveLightbox({ ...item, url: resolveSrc(item, idx) })}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="group relative aspect-[4/3] rounded-2xl overflow-hidden bg-[#0F243A] border border-slate-800 hover:border-[#F59E0B]/55 shadow-lg text-left cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#F59E0B]"
          >
            <Image
              src={resolveSrc(item, idx)}
              alt={item.alt || item.caption}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              unoptimized
              onError={() => setFailedIds((prev) => ({ ...prev, [item.id]: true }))}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#07111E]/95 via-[#07111E]/30 to-transparent opacity-85 group-hover:opacity-100 transition-opacity" />
            <div className="absolute top-2.5 right-2.5 w-7 h-7 rounded-lg bg-[#0F243A]/85 border border-slate-700 text-slate-200 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Expand className="w-3.5 h-3.5 text-[#F59E0B]" />
            </div>
            <div className="absolute bottom-0 inset-x-0 p-3.5">
              <span className="text-[10px] font-mono font-bold text-[#F59E0B] block mb-0.5">
                {`0${idx + 1} // GALLERY`}
              </span>
              <p className="text-xs font-semibold text-white leading-snug line-clamp-2">
                {item.caption}
              </p>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Mobile Touch-Friendly Swiper Slider */}
      <div
        className="md:hidden"
        style={
          {
            "--swiper-pagination-color": "#F59E0B",
            "--swiper-pagination-bullet-inactive-color": "#64748B",
            "--swiper-navigation-color": "#F59E0B",
          } as React.CSSProperties
        }
      >
        <Swiper
          modules={[Pagination, Autoplay, Navigation]}
          spaceBetween={14}
          slidesPerView={1.15}
          centeredSlides={false}
          pagination={{ clickable: true }}
          autoplay={{ delay: 4000, disableOnInteraction: true }}
          className="pb-10"
        >
          {gallery.map((item, idx) => (
            <SwiperSlide key={item.id || idx}>
              <button
                type="button"
                onClick={() => setActiveLightbox({ ...item, url: resolveSrc(item, idx) })}
                className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-[#0F243A] border border-slate-800 shadow-lg text-left block"
              >
                <Image
                  src={resolveSrc(item, idx)}
                  alt={item.alt || item.caption}
                  fill
                  className="object-cover"
                  unoptimized
                  onError={() => setFailedIds((prev) => ({ ...prev, [item.id]: true }))}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#07111E]/95 via-[#07111E]/25 to-transparent" />
                <div className="absolute bottom-0 inset-x-0 p-4">
                  <span className="text-[10px] font-mono font-bold text-[#F59E0B] block mb-0.5">
                    0{idx + 1} / 0{gallery.length}
                  </span>
                  <p className="text-xs font-semibold text-white leading-snug">
                    {item.caption}
                  </p>
                </div>
              </button>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Clean 2D Lightbox Modal */}
      <AnimatePresence>
        {activeLightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveLightbox(null)}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-3xl rounded-2xl overflow-hidden bg-[#0F243A] border border-[#D97706]/40 shadow-2xl"
            >
              <button
                type="button"
                onClick={() => setActiveLightbox(null)}
                aria-label="Close image preview"
                className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center border border-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="relative w-full aspect-[16/10] bg-[#07111E]">
                <Image
                  src={activeLightbox.url}
                  alt={activeLightbox.alt || activeLightbox.caption}
                  fill
                  className="object-contain"
                  unoptimized
                />
              </div>
              <div className="p-4 border-t border-slate-800 flex items-center justify-between gap-4">
                <p className="text-sm font-semibold text-white">{activeLightbox.caption}</p>
                <span className="text-[11px] font-mono text-[#F59E0B] shrink-0">ESME METRIX</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
