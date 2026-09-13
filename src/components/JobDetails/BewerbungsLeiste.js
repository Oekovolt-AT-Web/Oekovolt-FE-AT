"use client";

import { useEffect, useState } from "react";
import { Mail, Phone } from "lucide-react";

/**
 * Feste Bewerbungsleiste auf Mobilgeräten. Erscheint nach dem Seitenkopf und
 * blendet sich aus, sobald der Bewerbungsbereich oder der Footer sichtbar ist.
 */
export default function BewerbungsLeiste({ href, titel }) {
  const [sichtbar, setSichtbar] = useState(false);

  useEffect(() => {
    const ziele = [document.getElementById("bewerben"), document.querySelector("footer")].filter(Boolean);
    const imBild = new Set();
    const aktualisieren = () => setSichtbar(window.scrollY > 480 && imBild.size === 0);
    const io = new IntersectionObserver((eintraege) => {
      eintraege.forEach((e) => (e.isIntersecting ? imBild.add(e.target) : imBild.delete(e.target)));
      aktualisieren();
    });
    ziele.forEach((z) => io.observe(z));
    window.addEventListener("scroll", aktualisieren, { passive: true });
    aktualisieren();
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", aktualisieren);
    };
  }, []);

  return (
    <div
      aria-hidden={!sichtbar}
      className={`fixed inset-x-0 bottom-0 z-[9000] border-t border-ink-200 bg-white/95 px-4 pt-3 shadow-[0_-8px_24px_rgba(15,23,42,0.08)] backdrop-blur transition-transform duration-300 lg:hidden ${
        sichtbar ? "translate-y-0" : "pointer-events-none translate-y-full"
      }`}
      style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))" }}
    >
      <div className="mx-auto flex max-w-md items-center gap-2">
        <p className="mr-auto min-w-0 truncate text-[13px] font-semibold text-ink-700">{titel}</p>
        <a href="tel:+498245967880" tabIndex={sichtbar ? 0 : -1} aria-label="Anrufen" className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full ring-1 ring-inset ring-ink-200">
          <Phone aria-hidden="true" className="h-5 w-5 text-ov-600" />
        </a>
        <a href={href} tabIndex={sichtbar ? 0 : -1} className="inline-flex h-12 shrink-0 items-center gap-2 rounded-full bg-ov-500 px-5 text-[15px] font-semibold text-white">
          <Mail aria-hidden="true" className="h-4 w-4" />
          Jetzt bewerben
        </a>
      </div>
    </div>
  );
}
