"use client";

// src/components/GewerbeUnikat/DaumenLeiste.js
//
// Seitenweite mobile Handlungsleiste der Unikat-Seite /gewerbe (nur < md): der Haupt-CTA „Ersteinschätzung
// anfragen“ (HAUPT_CTA, überall gleich) mit den Werten aus dem Projektsteckbrief (anfrageUrl). Sitzt rechts
// neben dem Rückruf-Knopf (links 72 px), erscheint, sobald der Seitenkopf samt CTAs aus dem Bild ist, und tritt
// zurück, solange der Steckbrief (K8, [data-steckbrief]) sichtbar ist oder Abschluss-Band bzw. Footer erreicht
// sind. Ab md (Tablet) trägt die Kopfzeile den CTA – eine zweite, 760 px breite Leiste verdeckte dort nur Inhalt.
//
// Sichtbarkeit (Jury 13.10.2026, iPhone/WebKit): Der Zustand wird NICHT aus IntersectionObserver-Einträgen
// fortgeschrieben (WebKit liefert beim schnellen Hochscrollen – etwa über „Nach oben“ – keinen Zwischen-Callback,
// der Zustand „Footer darüber“ blieb stehen und die Leiste kam nie zurück). Stattdessen wird bei jedem
// (gedrosselten) Scroll-, Größen- und Seitenwechsel-Ereignis direkt per getBoundingClientRect nachgemessen;
// der Observer dient nur noch als zusätzlicher Auslöser.
//
// Auf /gewerbe ersetzt sie die globale MobileCta: body[data-gewerbe-daumen] (gesetzt nur, solange diese
// Leiste eingebunden ist) blendet MobileCta aus und lässt den Rückruf-Knopf stehen – Regeln in Hero.js.

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ereignis } from "@/lib/statistik";
import { anfrageUrl, bausteinZahl, useSteckbrief } from "./_steckbrief";
import { HAUPT_CTA, HAUPT_HREF, HAUPT_ZUSATZ, mitThema } from "./_cta";
import { EBENE } from "./_tokens";
import s from "./Hero.module.css";

const SPERREN = '[data-steckbrief], [data-blk="abschluss"], footer';
const ENDE = '[data-blk="abschluss"], footer'; // liegen am Seitenende: sichtbar ODER schon darüber = gesperrt
const TAKT = 100; // ms zwischen zwei Messungen beim Scrollen

/** Reine Messung: soll die Leiste gerade stehen? */
function messen() {
  const vh = window.innerHeight || document.documentElement.clientHeight;
  // Seit dem Standard-Seitenkopf (PageHero, 12.10.2026) gibt es kein #hero-cta mehr: dann zählt der ganze Seitenkopf
  const kopf = document.getElementById("hero-cta") || document.querySelector('[data-blk="seitenkopf"]');
  if (kopf && kopf.getBoundingClientRect().bottom > 0) return false;
  for (const el of document.querySelectorAll(SPERREN)) {
    const r = el.getBoundingClientRect();
    if (!r.width && !r.height) continue;
    if (el.matches(ENDE) ? r.top < vh : r.top < vh && r.bottom > 0) return false;
  }
  return true;
}

export default function DaumenLeiste() {
  const sb = useSteckbrief();
  const n = bausteinZahl(sb);
  const eigen = sb.quelle === "eigen";
  // Werte nur übernehmen, wenn der Besucher selbst etwas festgelegt oder eigene Daten geladen hat – sonst
  // trüge die Anfrage den Jahresverbrauch des synthetischen Beispielbetriebs in sich
  const href = n > 0 || eigen ? mitThema(anfrageUrl(sb), eigen ? "lastgang" : null) : HAUPT_HREF;
  const [sichtbar, setSichtbar] = useState(false);

  // Seitenmarke für die Regeln in Hero.js (nur solange eingebunden)
  useEffect(() => {
    const b = document.body;
    b.setAttribute("data-gewerbe-daumen", "an");
    return () => b.removeAttribute("data-gewerbe-daumen");
  }, []);
  useEffect(() => {
    document.body.setAttribute("data-gewerbe-daumen", sichtbar ? "sichtbar" : "an");
  }, [sichtbar]);

  useEffect(() => {
    let raf = 0;
    let nachlauf = 0;
    let zuletzt = -Infinity;
    const io = "IntersectionObserver" in window ? new IntersectionObserver(() => planen()) : null;
    const beobachtet = new Set();
    // Observer nur als zusätzlicher Auslöser; Sperr-Elemente können später erscheinen (K8 lädt in Bildschirmnähe)
    const anmelden = () => {
      if (!io) return;
      const kopf = document.getElementById("hero-cta") || document.querySelector('[data-blk="seitenkopf"]');
      for (const el of [kopf, ...document.querySelectorAll(SPERREN)]) {
        if (!el || beobachtet.has(el)) continue;
        beobachtet.add(el);
        io.observe(el);
      }
    };
    const pruefen = () => {
      raf = 0;
      zuletzt = performance.now();
      anmelden();
      setSichtbar(messen());
    };
    // Gedrosselt (höchstens alle 100 ms, im nächsten Bild) und mit Nachlauf: Die letzte Messung fällt immer
    // NACH dem letzten Ereignis – auch wenn WebKit am Ende eines schnellen Sprungs kein Scroll-Ereignis mehr schickt.
    const planen = () => {
      clearTimeout(nachlauf);
      nachlauf = setTimeout(pruefen, 180);
      if (raf) return;
      if (performance.now() - zuletzt < TAKT) return;
      raf = requestAnimationFrame(pruefen);
    };
    const sichtwechsel = () => {
      if (document.visibilityState === "visible") planen();
    };

    pruefen();
    window.addEventListener("scroll", planen, { passive: true });
    window.addEventListener("scrollend", planen, { passive: true });
    window.addEventListener("resize", planen, { passive: true });
    window.addEventListener("pageshow", planen); // Zurück-Cache (iOS Safari)
    document.addEventListener("visibilitychange", sichtwechsel);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(nachlauf);
      window.removeEventListener("scroll", planen);
      window.removeEventListener("scrollend", planen);
      window.removeEventListener("resize", planen);
      window.removeEventListener("pageshow", planen);
      document.removeEventListener("visibilitychange", sichtwechsel);
      io?.disconnect();
    };
  }, []);

  return (
    <div
      data-testid="daumen-leiste"
      aria-hidden={!sichtbar}
      inert={!sichtbar}
      className={`${s.daumen} fixed bottom-4 left-[72px] right-3 md:hidden`}
      style={{
        zIndex: EBENE.daumenLeiste,
        marginBottom: "env(safe-area-inset-bottom)",
        transform: sichtbar ? "translateY(0)" : "translateY(calc(100% + 2rem))",
        opacity: sichtbar ? 1 : 0,
        pointerEvents: sichtbar ? "auto" : "none",
      }}
    >
      <Link
        href={href}
        onClick={() => ereignis("daumen_cta", { werte: n })}
        tabIndex={sichtbar ? 0 : -1}
        className="flex h-[52px] items-center justify-between gap-3 rounded-full bg-ov-600 pl-5 pr-1.5 text-white shadow-[0_16px_36px_-12px_rgba(3,18,43,0.55)] transition-colors duration-200 hover:bg-ov-700"
      >
        <span className="min-w-0 leading-tight">
          <span className="block truncate text-[15px] font-semibold">{HAUPT_CTA}</span>
          <span className="block truncate text-[12px] font-medium text-white/85">
            <span className="sr-only"> · </span>
            {n > 0 ? (
              <>
                <span className="ov-num">{n}</span> {n === 1 ? "Wert" : "Werte"} übernommen
              </>
            ) : eigen ? (
              "mit Ihren Lastgang-Kennzahlen"
            ) : (
              HAUPT_ZUSATZ
            )}
          </span>
        </span>
        <span aria-hidden="true" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/15">
          <ArrowRight className="h-[18px] w-[18px]" />
        </span>
      </Link>
    </div>
  );
}
