import React from "react";
import Image from "next/image";

const VIDEO_EXTENSIONS_REGEX = /\.(mp4|webm|ogg|mov|m4v)(\?.*)?$/i;

const VideoBanner = ({
  videoSrc,
  mobileVideoSrc,
  mediaSrc,
  mobileMediaSrc,
  mediaAlt = "Banner media",
  title,
}) => {
  const desktopSrc = mediaSrc || videoSrc;
  const mobileSrc = mobileMediaSrc || mobileVideoSrc;
  const hasMobileSpecificSrc = Boolean(mobileSrc);

  const renderMedia = (src, className) => {
    if (!src) return null;

    if (VIDEO_EXTENSIONS_REGEX.test(src)) {
      return (
        <video autoPlay loop muted playsInline preload="metadata" className={className} aria-label={mediaAlt}>
          <source src={src} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      );
    }
    return <Image src={src} alt={mediaAlt} fill sizes="(max-width: 450px) 100vw, (max-width: 768px) 50vw, 50vw" className={className} style={{ objectFit: "cover" }} />;
  };

  return (
    <div className="relative w-full h-screen max-h-[55vh] overflow-hidden z-0">
      <div className="absolute inset-0 z-0">
        {renderMedia(
          desktopSrc,
          `${hasMobileSpecificSrc ? "hidden md:block" : "block"} w-full h-full object-cover`
        )}
        {hasMobileSpecificSrc && (
          renderMedia(
            mobileSrc,
            "block md:hidden w-full h-full object-cover"
          )
        )}
        <div className="absolute inset-0 bg-black/50"></div>
      </div>
      <div
        className="relative z-10 flex items-center justify-center h-full text-center px-4 max-w-2xl mx-auto"
      >
        <h1 className="text-3xl md:text-4xl lg:text-5xl text-white tracking-tight leading-tight animate-fadeInUp">
          {title}
        </h1>
      </div>
    </div>
  );
};

export default VideoBanner;
