"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, PhoneCall } from "lucide-react";
import { oeffneRueckruf } from "@/components/Rueckruf/oeffnen";
import { angebotHref } from "@/lib/kontextAngebot";
import { ereignis } from "@/lib/statistik";

// Auf diesen Seiten ist die Leiste überflüssig oder stört den Ablauf.
const AUSGENOMMEN = ["/angebot", "/kontakt", "/impressum", "/datenschutz", "/agb", "/hinweisgebersystem"];

/** Rechner melden ihre Werte (z. B. Gewerbe-PV-Rechner): detail = { url: "/angebot?…" } */
export const RECHNER_ANGEBOT_EVENT = "ov-rechner-angebot";

/** Nur interne Pfade zum Konfigurator übernehmen – keine fremden Ziele aus dem Ereignis. */
function sichereAngebotsUrl(url) {
  if (typeof url !== "string" || !url) return null;
  try {
    const u = new URL(url, window.location.origin);
    return u.origin === window.location.origin && u.pathname === "/angebot" ? `${u.pathname}${u.search}` : null;
  } catch {
    return null;
  }
}

// Letzte Rechner-Meldung samt Seite, auf der sie entstand. Der Empfang sitzt auf Modulebene, weil
// Rechner ihre Werte oft schon im eigenen Mount-Effekt melden – vor den Effekten dieser Leiste
// (sie steht im Baum hinter <main>). Ein einziger Empfänger für die ganze Sitzung, kein Leck je Mount.
let rechnerMeldung = null;
const abonnenten = new Set();
if (typeof window !== "undefined") {
  window.addEventListener(RECHNER_ANGEBOT_EVENT, (e) => {
    const url = sichereAngebotsUrl(e.detail?.url);
    rechnerMeldung = url ? { url, pfad: window.location.pathname } : null;
    abonnenten.forEach((f) => f());
  });
}

/**
 * Feste Handlungsleiste am unteren Rand – nur auf Mobilgeräten, global.
 *
 * Erscheint erst, wenn der Hero verlassen ist, und verschwindet, sobald der
 * Footer mit seinen eigenen Kontaktdaten ins Bild kommt. Solange sie sichtbar
 * ist, bekommt <body> die Klasse „ov-cta-sichtbar“: globals.css blendet dann
 * den Rückruf-Launcher und „Nach oben“ aus (sonst verdecken sie Formularfelder).
 *
 * Ziel: auf Branchenseiten der Konfigurator mit vorgewähltem Objekt
 * (src/lib/kontextAngebot.js). Meldet ein Rechner seine Werte per
 * „ov-rechner-angebot“, führt die Leiste zu „Angebot mit diesen Werten“.
 */
export default function MobileCta({ href, label = "Angebot anfragen" }) {
  const pfad = usePathname() || "/";
  const [sichtbar, setSichtbar] = useState(false);
  const [rechnerUrl, setRechnerUrl] = useState(null);
  const aus = AUSGENOMMEN.some((p) => pfad === p || pfad.startsWith(p + "/")) || pfad.startsWith("/uber-uns/jobs");

  useEffect(() => {
    if (aus) {
      setSichtbar(false);
      return undefined;
    }
    let footerSichtbar = false;
    const aktualisieren = () => setSichtbar(window.scrollY > 640 && !footerSichtbar);

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
  }, [aus, pfad]);

  useEffect(() => {
    document.body.classList.toggle("ov-cta-sichtbar", sichtbar);
  }, [sichtbar]);

  // Werte aus einem Rechner gelten nur auf der Seite, auf der gerechnet wurde.
  useEffect(() => {
    const uebernehmen = () => setRechnerUrl(rechnerMeldung && rechnerMeldung.pfad === pfad ? rechnerMeldung.url : null);
    uebernehmen();
    abonnenten.add(uebernehmen);
    return () => abonnenten.delete(uebernehmen);
  }, [pfad]);

  if (aus) return null;

  const ziel = rechnerUrl || href || angebotHref(pfad);
  const text = rechnerUrl ? "Angebot mit diesen Werten" : label;

  return (
    <div
      aria-hidden={!sichtbar}
      className={`ov-mobile-cta fixed inset-x-3 bottom-3 z-[9000] transition-[transform,opacity] duration-500 lg:hidden ${
        sichtbar ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-[130%] opacity-0"
      }`}
      style={{ marginBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="mx-auto flex max-w-md items-center gap-2 rounded-full bg-navy-950/95 p-1.5 shadow-[0_20px_40px_-12px_rgba(3,18,43,0.6)] ring-1 ring-white/10 backdrop-blur-xl">
        <button
          type="button"
          onClick={() => oeffneRueckruf()}
          tabIndex={sichtbar ? 0 : -1}
          aria-label="Kostenlosen Rückruf anfordern oder anrufen"
          className="flex h-12 shrink-0 items-center gap-2 rounded-full bg-white/10 pl-3.5 pr-4 text-[14px] font-semibold text-white"
        >
          <PhoneCall aria-hidden="true" className="h-[18px] w-[18px]" />
          Rückruf
        </button>
        <Link
          href={ziel}
          tabIndex={sichtbar ? 0 : -1}
          onClick={() => ereignis("cta_klick", { herkunft: "mobile_cta", ziel: ziel.split("?")[0], mit_werten: Boolean(rechnerUrl), seite: pfad })}
          className="flex h-12 min-w-0 flex-1 items-center justify-center gap-2 rounded-full bg-ov-600 px-3 text-[15px] font-semibold text-white"
        >
          <span className="truncate">{text}</span>
          <ArrowRight aria-hidden="true" className="h-4 w-4 shrink-0" />
        </Link>
      </div>
    </div>
  );
}
