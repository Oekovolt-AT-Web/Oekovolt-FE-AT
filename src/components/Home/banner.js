// import React from "react";
// import Image from "next/image";

// const VIDEO_EXTENSIONS_REGEX = /\.(mp4|webm|ogg|mov|m4v)(\?.*)?$/i;

// const VideoBanner = ({
//   videoSrc,
//   mobileVideoSrc,
//   mediaSrc,
//   mobileMediaSrc,
//   mediaAlt = "Banner media",
//   title,
// }) => {
//   const desktopSrc = mediaSrc || videoSrc;
//   const mobileSrc = mobileMediaSrc || mobileVideoSrc;
//   const hasMobileSpecificSrc = Boolean(mobileSrc);

//   const renderMedia = (src, className) => {
//     if (!src) return null;

//     if (VIDEO_EXTENSIONS_REGEX.test(src)) {
//       return (
//         <video autoPlay loop muted playsInline preload="auto" className={className} aria-label={mediaAlt} width="1920"
//           height="1080">
//           <source src={src} type="video/mp4" />
//           Your browser does not support the video tag.
//         </video>
//       );
//     }
//     return <Image src={src} alt={mediaAlt} fill className={className} style={{ objectFit: "cover" }} fetchPriority="high" />;
//   };

//   return (
//     <div className="relative w-full h-screen max-h-[55vh] overflow-hidden z-0">
//       <div className="absolute inset-0 z-0">
//         {renderMedia(
//           desktopSrc,
//           `${hasMobileSpecificSrc ? "hidden md:block" : "block"} w-full h-full object-cover`
//         )}
//         {hasMobileSpecificSrc && (
//           renderMedia(
//             mobileSrc,
//             "block md:hidden w-full h-full object-cover"
//           )
//         )}
//         <div className="absolute inset-0 bg-black/50"></div>
//       </div>
//       <div
//         className="relative z-10 flex items-center justify-center h-full text-center px-4 max-w-2xl mx-auto"
//       >
//         <h1 className="text-3xl md:text-4xl lg:text-5xl text-white tracking-tight leading-tight animate-fadeInUp">
//           {title}
//         </h1>
//       </div>
//     </div>
//   );
// };

// export default VideoBanner;
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const VIDEO_EXTENSIONS_REGEX = /\.(mp4|webm|ogg|mov|m4v)(\?.*)?$/i;

const VideoBanner = ({ videoSrc, mobileVideoSrc, mediaSrc, mobileMediaSrc, mediaAlt = "Banner media", title, subtitle }) => {
  const desktopSrc = mediaSrc || videoSrc;
  const mobileSrc = mobileMediaSrc || mobileVideoSrc;
  const hasMobileSpecificSrc = Boolean(mobileSrc);

  const getVideoType = (src) => {
    if (src.endsWith(".webm")) return "video/webm";
    if (src.endsWith(".ogg")) return "video/ogg";
    if (src.endsWith(".mov")) return "video/mp4";
    return "video/mp4";
  };

  const renderMedia = (src, className) => {
    if (!src) return null;

    if (VIDEO_EXTENSIONS_REGEX.test(src)) {
      return (
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          className={className}
          aria-label={mediaAlt}
        >
          <source src={src} type={getVideoType(src)} />
          Your browser does not support the video tag.
        </video>
      );
    }
    return <Image src={src} alt={mediaAlt} fill fetchPriority="high" className={className} style={{ objectFit: "cover" }} />;
  };

  return (
    <div className="relative z-0 w-full overflow-hidden">
      <div className="absolute inset-0 z-0">
        {renderMedia(desktopSrc, `${hasMobileSpecificSrc ? "hidden md:block" : "block"} w-full h-full object-cover`)}
        {hasMobileSpecificSrc && renderMedia(mobileSrc, "block md:hidden w-full h-full object-cover")}
        {/* Verlauf statt flacher 50-%-Fläche: unten dunkler, damit die Schrift
            trägt, oben durchlässiger, damit vom Bild etwas übrig bleibt. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/55 to-black/75"
        />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[440px] max-w-3xl flex-col items-center justify-center px-6 pb-20 pt-16 text-center sm:min-h-[500px] sm:pb-16 lg:min-h-[560px]">
        <p className="mb-4 text-[12px] font-semibold uppercase tracking-[0.2em] text-white/75 sm:text-[13px]">
          Ökovolt Solartechnik · Allgäu & Bayern
        </p>

        <h1 className="text-balance text-[30px] font-semibold leading-[1.15] tracking-tight text-white sm:text-[38px] lg:text-[52px]">
          {title}
        </h1>

        <p className="mt-5 max-w-[52ch] text-[16px] leading-relaxed text-white/85 sm:text-[18px]">
          {subtitle ||
            "Planung, Montage und Anmeldung aus einer Hand – vom Fachbetrieb aus Türkheim."}
        </p>

        {/* Der Hero hatte bisher keinen einzigen Handlungsaufruf. Primär der
            Rechner, weil er sofort Nutzen stiftet; sekundär die Beratung. */}
        <div className="mt-8 flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center">
          <Link
            href="/solarrechner"
            className="inline-flex items-center justify-center gap-2 rounded-md px-7 py-3.5 text-[14px] font-semibold uppercase tracking-wide text-white transition-colors hover:bg-[#558822]"
            style={{ backgroundColor: "#669933" }}
          >
            Ertrag berechnen
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </Link>
          <Link
            href="/kontakt"
            className="inline-flex items-center justify-center rounded-md border border-white/70 px-7 py-3.5 text-[14px] font-semibold uppercase tracking-wide text-white backdrop-blur-sm transition-colors hover:bg-white hover:text-gray-900"
          >
            Kostenlose Beratung
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VideoBanner;