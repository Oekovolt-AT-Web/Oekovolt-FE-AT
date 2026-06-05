"use client";

import React, { useState } from "react";
import Image from "next/image";

const VIDEO_EXTENSIONS_REGEX = /\.(mp4|webm|ogg|mov|m4v)(\?.*)?$/i;
const FALLBACK_IMAGE = "/Images/Kontakt/download-2.jpg";

const VideoBanner = ({
  videoSrc,
  mobileVideoSrc,
  mediaSrc,
  mobileMediaSrc,
  mediaAlt = "Banner media",
  title,
}) => {
  const [desktopFallback, setDesktopFallback] = useState(false);
  const [mobileFallback, setMobileFallback] = useState(false);

  const desktopSrc = desktopFallback
    ? FALLBACK_IMAGE
    : (mediaSrc || videoSrc);

  const mobileSrc = mobileFallback
    ? FALLBACK_IMAGE
    : (mobileMediaSrc || mobileVideoSrc);

  const hasMobileSpecificSrc = Boolean(mobileMediaSrc || mobileVideoSrc);

  const renderMedia = (src, className, setFallback) => {
    if (!src) {
      return (
        <Image
          src={FALLBACK_IMAGE}
          alt={mediaAlt}
          fill
          sizes="100vw"
          className={className}
          style={{ objectFit: "cover" }}
        />
      );
    }

    if (VIDEO_EXTENSIONS_REGEX.test(src)) {
      return (
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className={className}
          aria-label={mediaAlt}
          onError={() => setFallback(true)}
        >
          <source src={src} type="video/mp4" />
        </video>
      );
    }

    return (
      <Image
        src={src}
        alt={mediaAlt}
        fill
        sizes="100vw"
        className={className}
        style={{ objectFit: "cover" }}
        onError={() => setFallback(true)}
      />
    );
  };

  return (
    <div className="relative w-full h-screen max-h-[55vh] overflow-hidden z-0">
      <div className="absolute inset-0 z-0">
        {renderMedia(
          desktopSrc,
          `${hasMobileSpecificSrc ? "hidden md:block" : "block"} w-full h-full object-cover`,
          setDesktopFallback
        )}

        {hasMobileSpecificSrc &&
          renderMedia(
            mobileSrc,
            "block md:hidden w-full h-full object-cover",
            setMobileFallback
          )}

        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      <div className="relative z-10 flex items-center justify-center h-full text-center px-4 max-w-2xl mx-auto">
        <h1 className="text-3xl md:text-4xl lg:text-5xl text-white tracking-tight leading-tight animate-fadeInUp">
          {title}
        </h1>
      </div>
    </div>
  );
};

export default VideoBanner;


// src/components/Home/banner.jsx (update your existing file)

// "use client";

// import React, { useState, useEffect, useRef } from "react";
// import Image from "next/image";

// const VIDEO_EXTENSIONS_REGEX = /\.(mp4|webm|ogg|mov|m4v)(\?.*)?$/i;
// const FALLBACK_IMAGE = "/Images/Kontakt/download-2.jpg";

// // Helper to add compression params to API URL
// const getOptimizedVideoUrl = (originalUrl, quality) => {
//   if (!originalUrl) return null;

//   // If it's your API endpoint, add quality parameter
//   if (originalUrl.includes('/api/image')) {
//     const separator = originalUrl.includes('?') ? '&' : '?';
//     return `${originalUrl}${separator}quality=${quality}&video_compress=true`;
//   }

//   // For direct video URLs
//   if (VIDEO_EXTENSIONS_REGEX.test(originalUrl)) {
//     const baseUrl = originalUrl.split('?')[0];
//     const extension = baseUrl.match(/\.(mp4|webm|mov)$/i)?.[0];
//     if (extension) {
//       return baseUrl.replace(extension, `-${quality}${extension}`);
//     }
//   }

//   return originalUrl;
// };

// const VideoBanner = ({
//   videoSrc,
//   mobileVideoSrc,
//   mediaSrc,
//   mobileMediaSrc,
//   mediaAlt = "Banner media",
//   title,
// }) => {
//   const [desktopFallback, setDesktopFallback] = useState(false);
//   const [mobileFallback, setMobileFallback] = useState(false);
//   const [connectionType, setConnectionType] = useState('4g');
//   const [isLowPowerMode, setIsLowPowerMode] = useState(false);
//   const [quality, setQuality] = useState('high');
//   const videoRef = useRef(null);
//   const mobileVideoRef = useRef(null);

//   console.log

//   // Detect network conditions
//   useEffect(() => {
//     if ('connection' in navigator) {
//       const connection = navigator.connection;
//       const effectiveType = connection.effectiveType || '4g';
//       const saveData = connection.saveData || false;

//       setConnectionType(effectiveType);
//       setIsLowPowerMode(saveData);

//       // Determine quality based on connection
//       if (saveData || effectiveType === 'slow-2g' || effectiveType === '2g') {
//         setQuality('low');
//       } else if (effectiveType === '3g') {
//         setQuality('medium');
//       } else {
//         setQuality('high');
//       }

//       const handleConnectionChange = () => {
//         const newType = connection.effectiveType || '4g';
//         const newSaveData = connection.saveData || false;
//         setConnectionType(newType);
//         setIsLowPowerMode(newSaveData);

//         if (newSaveData || newType === 'slow-2g' || newType === '2g') {
//           setQuality('low');
//         } else if (newType === '3g') {
//           setQuality('medium');
//         } else {
//           setQuality('high');
//         }
//       };

//       connection.addEventListener('change', handleConnectionChange);
//       return () => connection.removeEventListener('change', handleConnectionChange);
//     }
//   }, []);
//   let desktopSrc = desktopFallback
//     ? FALLBACK_IMAGE
//     : (mediaSrc || videoSrc);

//   let mobileSrc = mobileFallback
//     ? FALLBACK_IMAGE
//     : (mobileMediaSrc || mobileVideoSrc);
//   // Lazy load videos with Intersection Observer
//   useEffect(() => {
//     const videos = [videoRef.current, mobileVideoRef.current].filter(Boolean);
//     if (videos.length === 0) return;

//     const observer = new IntersectionObserver(
//       (entries) => {
//         entries.forEach(entry => {
//           if (entry.isIntersecting) {
//             const video = entry.target;
//             if (video.tagName === 'VIDEO' && video.dataset.src && !video.src) {
//               video.src = video.dataset.src;
//               video.load();
//               video.play().catch(e => console.log('Video autoplay failed:', e));
//               observer.unobserve(video);
//             }
//           }
//         });
//       },
//       { rootMargin: '100px' } // Start loading 100px before visible
//     );

//     videos.forEach(video => observer.observe(video));
//     return () => observer.disconnect();
//   }, [desktopSrc, mobileSrc]);

//   // Get optimized URLs based on quality


//   // Apply optimization for videos
//   if (!desktopFallback && desktopSrc && VIDEO_EXTENSIONS_REGEX.test(desktopSrc)) {
//     desktopSrc = getOptimizedVideoUrl(desktopSrc, quality);
//   }

//   if (!mobileFallback && mobileSrc && VIDEO_EXTENSIONS_REGEX.test(mobileSrc)) {
//     mobileSrc = getOptimizedVideoUrl(mobileSrc, quality);
//   }

//   const hasMobileSpecificSrc = Boolean(mobileMediaSrc || mobileVideoSrc);

//   const renderMedia = (src, className, setFallback, isMobile = false) => {
//     if (!src) {
//       return (
//         <Image
//           src={FALLBACK_IMAGE}
//           alt={mediaAlt}
//           fill
//           sizes="100vw"
//           className={className}
//           style={{ objectFit: "cover" }}
//           priority={!isMobile}
//         />
//       );
//     }

//     if (VIDEO_EXTENSIONS_REGEX.test(src)) {
//       return (
//         <video
//           ref={isMobile ? mobileVideoRef : videoRef}
//           autoPlay
//           loop
//           muted
//           playsInline
//           preload={isMobile ? "metadata" : "auto"}
//           className={className}
//           aria-label={mediaAlt}
//           onError={() => setFallback(true)}
//           data-src={src}
//           poster={src.replace(/\.(mp4|webm|mov)/, '.jpg')} // Optional: add poster image
//         >
//           <source src="" type="video/mp4" /> {/* Empty source, will be set by data-src */}
//         </video>
//       );
//     }

//     return (
//       <Image
//         src={src}
//         alt={mediaAlt}
//         fill
//         sizes="100vw"
//         className={className}
//         style={{ objectFit: "cover" }}
//         onError={() => setFallback(true)}
//         priority={!isMobile}
//       />
//     );
//   };

//   return (
//     <div className="relative w-full h-screen max-h-[55vh] overflow-hidden z-0">
//       {/* Show quality indicator for debugging (optional - remove in production) */}
//       {process.env.NODE_ENV === 'development' && (
//         <div className="fixed top-20 right-4 z-50 bg-black/80 text-white px-2 py-1 text-xs rounded">
//           Video Quality: {quality} ({connectionType})
//         </div>
//       )}

//       <div className="absolute inset-0 z-0">
//         {renderMedia(
//           desktopSrc,
//           `${hasMobileSpecificSrc ? "hidden md:block" : "block"} w-full h-full object-cover`,
//           setDesktopFallback,
//           false
//         )}

//         {hasMobileSpecificSrc &&
//           renderMedia(
//             mobileSrc,
//             "block md:hidden w-full h-full object-cover",
//             setMobileFallback,
//             true
//           )}

//         <div className="absolute inset-0 bg-black/50"></div>
//       </div>

//       <div className="relative z-10 flex items-center justify-center h-full text-center px-4 max-w-2xl mx-auto">
//         <h1 className="text-3xl md:text-4xl lg:text-5xl text-white tracking-tight leading-tight animate-fadeInUp">
//           {title}
//         </h1>
//       </div>
//     </div>
//   );
// };

// export default VideoBanner;