"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Calculator, Phone } from "lucide-react";

/**
 * Feste Handlungsleiste am unteren Rand – nur auf Mobilgeräten.
 *
 * Auf dem Handy ist der Hero-Button nach dem ersten Wischen weg, der nächste
 * Kontaktweg kommt oft erst tausende Pixel später. Die Leiste erscheint erst,
 * wenn der Hero verlassen ist, und verschwindet wieder, sobald der Footer mit
 * seinen eigenen Kontaktdaten ins Bild kommt – sie soll helfen, nicht stören.
 *
 * Solange sie sichtbar ist, bekommt <body> eine Klasse, über die globals.css
 * den Zurück-nach-oben-Button anhebt; sonst lägen beide übereinander.
 */
export default function MobileCta({
  href = "/kontakt",
  label = "Angebot anfragen",
  zweitHref = "/solarrechner",
  zweitLabel = "Rechner",
}) {
  const [sichtbar, setSichtbar] = useState(false);

  useEffect(() => {
    let footerSichtbar = false;
    const aktualisieren = () => {
      const zeigen = window.scrollY > 520 && !footerSichtbar;
      setSichtbar(zeigen);
    };

    const footer = document.querySelector("footer");
    const io = footer
      ? new IntersectionObserver(([e]) => {
          footerSichtbar = e.isIntersecting;
          aktualisieren();
        })
      : null;
    if (footer) io.observe(footer);

    window.addEventListener("scroll", aktualisieren, { passive: true });
    aktualisieren();
    return () => {
      window.removeEventListener("scroll", aktualisieren);
      io?.disconnect();
      document.body.classList.remove("ov-cta-sichtbar");
    };
  }, []);

  useEffect(() => {
    document.body.classList.toggle("ov-cta-sichtbar", sichtbar);
  }, [sichtbar]);

  return (
    <div
      aria-hidden={!sichtbar}
      className={`ov-mobile-cta fixed inset-x-0 bottom-0 z-[9000] border-t border-gray-200 bg-white/95 px-4 pt-3 shadow-[0_-6px_20px_rgba(0,0,0,0.08)] backdrop-blur transition-transform duration-300 lg:hidden ${
        sichtbar ? "translate-y-0" : "pointer-events-none translate-y-full"
      }`}
      style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))" }}
    >
      <div className="mx-auto flex max-w-md gap-2">
        <Link
          href={zweitHref}
          tabIndex={sichtbar ? 0 : -1}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-md border border-gray-300 px-3 py-3 text-[14px] font-semibold text-gray-800"
        >
          <Calculator aria-hidden="true" className="h-4 w-4 text-[#669933]" />
          {zweitLabel}
        </Link>
        <Link
          href={href}
          tabIndex={sichtbar ? 0 : -1}
          className="inline-flex flex-[1.6] items-center justify-center gap-2 rounded-md px-3 py-3 text-[14px] font-semibold text-white"
          style={{ backgroundColor: "#669933" }}
        >
          <Phone aria-hidden="true" className="h-4 w-4" />
          {label}
        </Link>
      </div>
    </div>
  );
}
