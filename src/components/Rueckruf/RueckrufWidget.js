"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, CalendarDays, MapPin, Phone, PhoneCall, Video, X } from "lucide-react";
import { cn } from "@/components/ui/cn";
import { TERMIN_ARTEN, oeffnungsStatus } from "@/data/erreichbarkeit";
import RueckrufFormular from "./RueckrufFormular";

import { RUECKRUF_EVENT } from "./oeffnen";

// Hinweisgebersystem: bewusst keine Kontakt-Widgets (Vertraulichkeit); Terminseite hat eigenen Ablauf.
const OHNE_WIDGET = ["/hinweisgebersystem", "/termin", "/angebot"];
const ICONS = { Phone, Video, MapPin };

export default function RueckrufWidget() {
  const pfad = usePathname() || "/";
  const [offen, setOffen] = useState(false);
  const [tab, setTab] = useState("rueckruf");
  const [sichtbar, setSichtbar] = useState(false);
  const [geoeffnet, setGeoeffnet] = useState(null);
  const ausloeser = useRef(null);
  const panel = useRef(null);
  const ausgenommen = OHNE_WIDGET.some((p) => pfad === p || pfad.startsWith(`${p}/`));

  const schliessen = useCallback(() => {
    setOffen(false);
    requestAnimationFrame(() => ausloeser.current?.focus());
  }, []);

  // Öffnen per Event (MobileCta, Buttons auf Seiten)
  useEffect(() => {
    const oeffnen = (e) => {
      setTab(e.detail?.tab === "termin" ? "termin" : "rueckruf");
      setOffen(true);
    };
    window.addEventListener(RUECKRUF_EVENT, oeffnen);
    return () => window.removeEventListener(RUECKRUF_EVENT, oeffnen);
  }, []);

  // Launcher dezent verzögert einblenden
  useEffect(() => {
    setGeoeffnet(oeffnungsStatus().offen);
    const t = setTimeout(() => setSichtbar(true), 2500);
    const i = setInterval(() => setGeoeffnet(oeffnungsStatus().offen), 60000);
    return () => {
      clearTimeout(t);
      clearInterval(i);
    };
  }, []);

  // Escape, Scroll-Sperre auf Mobilgeräten
  useEffect(() => {
    if (!offen) return undefined;
    const taste = (e) => e.key === "Escape" && schliessen();
    document.addEventListener("keydown", taste);
    const mobil = window.matchMedia("(max-width: 1023px)").matches;
    if (mobil) document.documentElement.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", taste);
      document.documentElement.style.overflow = "";
    };
  }, [offen, schliessen]);

  useEffect(() => setOffen(false), [pfad]);

  if (ausgenommen && !offen) return null;

  return (
    <>
      {/* Launcher – nur Desktop; mobil öffnet die Handlungsleiste */}
      {!ausgenommen && (
        <button
          ref={ausloeser}
          type="button"
          onClick={() => (offen ? schliessen() : (setTab("rueckruf"), setOffen(true)))}
          aria-expanded={offen}
          aria-controls="ov-rueckruf-panel"
          className={cn(
            "group fixed bottom-8 left-8 z-[9400] hidden items-center gap-3 rounded-full bg-navy-950 py-2 pl-2 pr-5 text-white shadow-[0_18px_40px_-14px_rgba(3,18,43,0.7)] ring-1 ring-white/10 transition-all duration-500 hover:-translate-y-0.5 lg:flex",
            sichtbar ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0"
          )}
        >
          <span className="relative flex h-10 w-10 items-center justify-center rounded-full bg-ov-500">
            {offen ? <X aria-hidden="true" className="h-5 w-5" /> : <PhoneCall aria-hidden="true" className="h-[18px] w-[18px]" />}
            {geoeffnet && !offen && <span aria-hidden="true" className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full bg-ov-300 ring-2 ring-navy-950 motion-safe:animate-pulse" />}
          </span>
          <span className="text-left leading-tight">
            <span className="block text-[14.5px] font-semibold">{offen ? "Schließen" : "Kostenloser Rückruf"}</span>
            {!offen && <span className="block text-[12px] text-white/60">{geoeffnet ? "Wir sind jetzt erreichbar" : "Wunschzeit wählen"}</span>}
          </span>
        </button>
      )}

      {offen && (
        <>
          <button type="button" aria-label="Schließen" tabIndex={-1} onClick={schliessen} className="fixed inset-0 z-[9590] bg-navy-950/50 backdrop-blur-[2px] lg:hidden" />
          <div
            id="ov-rueckruf-panel"
            ref={panel}
            role="dialog"
            aria-modal="true"
            aria-labelledby="ov-rueckruf-titel"
            className="ov-rueckruf-panel fixed inset-x-0 bottom-0 z-[9600] flex max-h-[92dvh] flex-col overflow-hidden rounded-t-[1.75rem] bg-white shadow-[0_-20px_60px_-20px_rgba(3,18,43,0.5)] lg:inset-x-auto lg:bottom-28 lg:left-8 lg:max-h-[min(760px,calc(100dvh-9rem))] lg:w-[410px] lg:rounded-[1.75rem] lg:ring-1 lg:ring-ink-200"
            style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
          >
            <div className="relative bg-navy-950 px-5 pb-4 pt-5 text-white">
              <div aria-hidden="true" className="absolute -right-10 -top-16 h-40 w-40 rounded-full bg-ov-500/30 blur-3xl" />
              <div className="relative flex items-start justify-between gap-3">
                <div>
                  <p id="ov-rueckruf-titel" className="font-display text-[19px] font-extrabold leading-tight">
                    Persönlich beraten lassen
                  </p>
                  <p className="mt-1 text-[13.5px] text-white/65">Kostenlos und unverbindlich – vom Fachbetrieb aus Türkheim.</p>
                </div>
                <button type="button" onClick={schliessen} aria-label="Schließen" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20">
                  <X aria-hidden="true" className="h-4 w-4" />
                </button>
              </div>
              <div role="tablist" aria-label="Kontaktweg" className="relative mt-4 grid grid-cols-2 gap-1 rounded-full bg-white/10 p-1">
                {[
                  { id: "rueckruf", label: "Rückruf", icon: PhoneCall },
                  { id: "termin", label: "Termin buchen", icon: CalendarDays },
                ].map((x) => (
                  <button
                    key={x.id}
                    type="button"
                    role="tab"
                    aria-selected={tab === x.id}
                    onClick={() => setTab(x.id)}
                    className={cn("flex h-9 items-center justify-center gap-1.5 rounded-full text-[13.5px] font-semibold transition", tab === x.id ? "bg-white text-navy-950" : "text-white/75 hover:text-white")}
                  >
                    <x.icon aria-hidden="true" className="h-4 w-4" />
                    {x.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-y-auto overscroll-contain px-5 py-5">
              {tab === "rueckruf" ? (
                <RueckrufFormular autoFokus />
              ) : (
                <div className="space-y-3">
                  <p className="text-[14px] text-ink-600">Wählen Sie, wie wir uns kennenlernen – freie Zeiten sehen Sie im nächsten Schritt.</p>
                  {TERMIN_ARTEN.map((a) => {
                    const Icon = ICONS[a.icon] || CalendarDays;
                    return (
                      <Link
                        key={a.id}
                        href={`/termin?art=${a.id}`}
                        onClick={() => setOffen(false)}
                        className="group flex items-center gap-3.5 rounded-2xl bg-sand-50 p-4 ring-1 ring-ink-200/70 transition hover:bg-white hover:ring-ov-300"
                      >
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-ov-600 ring-1 ring-ink-200 group-hover:bg-ov-500 group-hover:text-white group-hover:ring-ov-500">
                          <Icon aria-hidden="true" className="h-5 w-5" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="flex items-center gap-2 text-[15px] font-semibold text-ink-900">
                            {a.titel}
                            {a.empfohlen && <span className="rounded-full bg-ov-100 px-2 py-0.5 text-[10.5px] font-bold uppercase tracking-wider text-ov-700">beliebt</span>}
                          </span>
                          <span className="block text-[13px] text-ink-500">{a.dauer} Minuten · kostenlos</span>
                        </span>
                        <ArrowRight aria-hidden="true" className="h-4 w-4 text-ink-400 transition group-hover:translate-x-0.5 group-hover:text-ov-600" />
                      </Link>
                    );
                  })}
                </div>
              )}

              <a href="tel:+498245967880" className="mt-5 flex items-center justify-center gap-2 border-t border-ink-100 pt-4 text-[14px] text-ink-600 hover:text-ov-700">
                <Phone aria-hidden="true" className="h-4 w-4 text-ov-600" />
                Lieber direkt anrufen: <span className="font-semibold text-ink-900">08245 96 788 0</span>
              </a>
            </div>
          </div>
        </>
      )}
    </>
  );
}
