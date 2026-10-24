"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function CarGallery({ gallery, video, brand, model, activeColor }) {
  // If video exists, activeIndex 0 will represent the video.
  const hasVideo = Boolean(video);
  const [activeIndex, setActiveIndex] = useState(0);

  // Reset active index if the gallery changes (e.g. color changed)
  useEffect(() => {
    setActiveIndex(0);
  }, [gallery]);

  const handleKey = (e, index) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setActiveIndex(index);
    }
  };

  return (
    <div 
      role="region" 
      aria-label="Car image gallery"
      className="relative w-full h-[60vh] md:h-[80vh] bg-[#050505] overflow-hidden flex flex-col md:flex-row"
    >
      
      {/* ── Main Featured Media ── */}
      <div className="relative flex-1 h-full group overflow-hidden">
        
        {/* Video Hero */}
        {hasVideo && activeIndex === 0 && (
          <div className="absolute inset-0 z-10 animate-fade-in">
            <video 
              autoPlay 
              muted 
              loop 
              playsInline 
              referrerPolicy="no-referrer"
              poster={gallery[0]}
              className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
            >
              <source src={video} type="video/mp4" referrerPolicy="no-referrer" />
            </video>
            {/* Dark overlay gradient as requested */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-black/20 to-black/40 pointer-events-none" />
          </div>
        )}

        {/* Image Gallery */}
        {gallery.map((img, idx) => {
          // If we have a video, image thumbnails start from index 1.
          const mediaIndex = hasVideo ? idx + 1 : idx;
          
          if (activeIndex !== mediaIndex) return null;

          return (
            <div
              key={idx}
              className="absolute inset-0 z-10 animate-fade-in"
            >
              <Image
                src={img}
                alt={`${brand} ${model} - View ${idx + 1}`}
                fill
                priority={idx === 0}
                className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 80vw"
              />
            </div>
          );
        })}
        
        {/* Cinematic gradient overlay for text readability at bottom */}
        <div className="absolute inset-0 z-20 pointer-events-none bg-gradient-to-t from-[#050505] via-transparent to-transparent" />
      </div>

      {/* ── Thumbnails Sidebar ── */}
      <div className="w-full md:w-[240px] shrink-0 h-24 md:h-full bg-[#0a0a0a] flex md:flex-col gap-2 p-2 overflow-x-auto md:overflow-y-auto custom-scrollbar z-30 relative">
        
        {/* Video Thumbnail */}
        {hasVideo && (
          <button
            onClick={() => setActiveIndex(0)}
            onKeyDown={(e) => handleKey(e, 0)}
            aria-label={`View car video`}
            className="relative shrink-0 w-32 md:w-full h-full md:h-36 rounded-lg overflow-hidden transition-all duration-300 border-2 focus:outline-none focus:ring-2 focus:ring-[#D6B25E]"
            style={{
              borderColor: activeIndex === 0 ? "#D6B25E" : "transparent",
              opacity: activeIndex === 0 ? 1 : 0.5,
            }}
          >
            <Image
              src={gallery[0]}
              alt={`Video Thumbnail`}
              fill
              className="object-cover"
              sizes="240px"
            />
            <div className="absolute inset-0 z-20 bg-black/60 hover:bg-black/40 flex items-center justify-center transition-colors duration-300">
               <svg className="w-10 h-10 text-white drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
               </svg>
            </div>
          </button>
        )}

        {/* Image Thumbnails */}
        {gallery.map((img, idx) => {
          const mediaIndex = hasVideo ? idx + 1 : idx;
          return (
            <button
              key={idx}
              onClick={() => setActiveIndex(mediaIndex)}
              onKeyDown={(e) => handleKey(e, mediaIndex)}
              aria-label={`View ${brand} ${model} view ${idx + 1}`}
              className="relative shrink-0 w-32 md:w-full h-full md:h-36 rounded-lg overflow-hidden transition-all duration-300 border-2 focus:outline-none focus:ring-2 focus:ring-[#D6B25E]"
              style={{
                borderColor: activeIndex === mediaIndex ? "#D6B25E" : "transparent",
                opacity: activeIndex === mediaIndex ? 1 : 0.5,
              }}
            >
              <Image
                src={img}
                alt={`Thumbnail ${idx + 1}`}
                fill
                className="object-cover"
                sizes="240px"
              />
              {activeIndex !== mediaIndex && (
                <div className="absolute inset-0 bg-black/40 hover:bg-transparent transition-colors duration-300" />
              )}
            </button>
          )
        })}
      </div>

      {/* Scoped styles for custom scrollbar in gallery */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(1.015); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
          animation: fadeIn 0.45s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
          height: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #0a0a0a;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #1c1c1e;
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #D6B25E;
        }
      `}</style>
    </div>
  );
}
