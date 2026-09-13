"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowUpRight, Building2, MapPin, Search, ShieldCheck, X } from "lucide-react";
import { cn } from "@/components/ui/cn";
import { FIRMENSITZ, STANDORTE } from "./standorte";

const LeafletKarte = dynamic(() => import("./LeafletKarte"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-navy-900">
      <span className="h-9 w-9 animate-spin rounded-full border-2 border-white/15 border-t-ov-400" />
    </div>
  ),
});

// Ausschnitt der Vorschau (Süddeutschland / Westösterreich)
const BOX = { lngMin: 9.2, lngMax: 13.4, latMin: 47.05, latMax: 48.62 };
const K = Math.cos((47.8 * Math.PI) / 180);
const B = 1000;
const H = Math.round((B * (BOX.latMax - BOX.latMin)) / ((BOX.lngMax - BOX.lngMin) * K));
const PX_JE_KM = H / (BOX.latMax - BOX.latMin) / 111;
const projiziere = (s) => ({
  x: ((s.lng - BOX.lngMin) * K * B) / ((BOX.lngMax - BOX.lngMin) * K),
  y: ((BOX.latMax - s.lat) / (BOX.latMax - BOX.latMin)) * H,
});
const imBild = (s) => s.lat >= BOX.latMin && s.lat <= BOX.latMax && s.lng >= BOX.lngMin && s.lng <= BOX.lngMax;

/** Punkte + einfache Kollisionsvermeidung für Beschriftungen */
function beschriftung(auswahl, hover, f = 1) {
  const platziert = [];
  return STANDORTE.filter(imBild).map((s) => {
    const { x, y } = projiziere(s);
    const aktiv = auswahl === s.id || hover === s.id;
    const beschriften = aktiv || s.km > (f > 1 ? 120 : 55);
    let links = false;
    let dy = 0;
    if (beschriften) {
      const breite = (s.label.length * 9.5 + 14) * f;
      const kollidiert = (lx0, lx1, ly) => platziert.some((p) => Math.abs(p.y - ly) < 20 * f && lx0 < p.x1 && lx1 > p.x0);
      if (x + breite > B) {
        links = true;
        if (kollidiert(x - breite, x, y)) dy = 18 * f;
      } else if (kollidiert(x, x + breite, y)) {
        if (!kollidiert(x - breite, x, y)) links = true;
        else dy = 18 * f;
      }
      platziert.push({ x0: links ? x - breite : x, x1: links ? x : x + breite, y: y + dy });
    }
    return { s, x, y, aktiv, beschriften, links, dy };
  });
}

function leseZustimmung() {
  try {
    const eintrag = document.cookie.split("; ").find((c) => c.startsWith("cookieConsent="));
    if (!eintrag) return false;
    return JSON.parse(decodeURIComponent(eintrag.split("=")[1]))?.openStreetMap === true;
  } catch {
    return false;
  }
}

function speichereZustimmung() {
  let daten = {};
  try {
    const eintrag = document.cookie.split("; ").find((c) => c.startsWith("cookieConsent="));
    if (eintrag) daten = JSON.parse(decodeURIComponent(eintrag.split("=")[1])) || {};
  } catch {}
  daten.openStreetMap = true;
  document.cookie = `cookieConsent=${encodeURIComponent(JSON.stringify(daten))}; path=/; max-age=31536000; SameSite=Lax`;
}

/**
 * Referenzkarte: Standortliste mit Entfernung + Punktkarte.
 * Ohne Zustimmung eine datensparsame SVG-Vorschau (keine externen Anfragen),
 * nach Zustimmung die interaktive OpenStreetMap-Karte (react-leaflet).
 */
export default function ReferenzKarte({ projekteJeOrt = {} }) {
  const [zustimmung, setZustimmung] = useState(false);
  const [auswahl, setAuswahl] = useState(null);
  const [hover, setHover] = useState(null);
  const [suche, setSuche] = useState("");

  const [klein, setKlein] = useState(false);

  useEffect(() => {
    setZustimmung(leseZustimmung());
    const mq = window.matchMedia("(max-width: 767px)");
    const pruefen = () => setKlein(mq.matches);
    pruefen();
    mq.addEventListener("change", pruefen);
    return () => mq.removeEventListener("change", pruefen);
  }, []);
  // Auf schmalen Bildschirmen Schrift und Punkte in der SVG vergrößern
  const f = klein ? 2.2 : 1;

  const alle = useMemo(() => [FIRMENSITZ, ...STANDORTE], []);
  const liste = useMemo(() => {
    const q = suche.trim().toLowerCase();
    return q ? STANDORTE.filter((s) => s.label.toLowerCase().includes(q) || s.land.toLowerCase().includes(q)) : STANDORTE;
  }, [suche]);
  const umkreis100 = STANDORTE.filter((s) => s.km <= 100).length;
  const ausserhalb = STANDORTE.filter((s) => !imBild(s));

  const laden = () => {
    speichereZustimmung();
    setZustimmung(true);
  };

  return (
    <div className="grid overflow-hidden rounded-[2rem] bg-navy-900/40 ring-1 ring-white/10 lg:h-[660px] lg:grid-cols-[380px_1fr]">
      {/* Standortliste */}
      <aside className="order-2 flex min-h-0 flex-col border-t border-white/10 lg:order-1 lg:border-r lg:border-t-0">
        <div className="border-b border-white/10 p-5">
          <div className="flex items-baseline justify-between gap-3">
            <p className="font-display text-[17px] font-bold text-white">Referenzstandorte</p>
            <p className="ov-num text-[13px] text-white/55">{STANDORTE.length} Orte</p>
          </div>
          <p className="mt-1 text-[13.5px] text-white/60">
            <span className="font-semibold text-ov-300">{umkreis100}</span> davon im Umkreis von 100 km um Türkheim
          </p>
          <label className="relative mt-4 block">
            <span className="sr-only">Ort suchen</span>
            <Search aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/45" />
            <input
              type="search"
              value={suche}
              onChange={(e) => setSuche(e.target.value)}
              placeholder="Ort suchen, z. B. Kempten"
              className="h-11 w-full rounded-full bg-white/[0.06] pl-11 pr-10 text-[14.5px] text-white placeholder:text-white/40 ring-1 ring-inset ring-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-ov-400 [&::-webkit-search-cancel-button]:hidden"
            />
            {suche && (
              <button type="button" onClick={() => setSuche("")} aria-label="Suche leeren" className="absolute right-1.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-white/60 hover:bg-white/10">
                <X aria-hidden="true" className="h-4 w-4" />
              </button>
            )}
          </label>
        </div>

        <ul className="ov-no-scrollbar max-h-[420px] min-h-0 flex-1 overflow-y-auto p-2 lg:max-h-none">
          <li>
            <button
              type="button"
              onClick={() => setAuswahl(FIRMENSITZ.id)}
              className={cn("flex w-full items-center gap-3 rounded-2xl p-3 text-left transition", auswahl === FIRMENSITZ.id ? "bg-white/10" : "hover:bg-white/[0.05]")}
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-navy-600 text-white ring-2 ring-white/80">
                <Building2 aria-hidden="true" className="h-4 w-4" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[15px] font-semibold text-white">Türkheim · Firmensitz</span>
                <span className="block text-[12.5px] text-white/55">Planung, Montage & Service</span>
              </span>
            </button>
          </li>
          {liste.map((s) => {
            const n = projekteJeOrt[s.label] || 0;
            const aktiv = auswahl === s.id;
            return (
              <li key={s.id} className="relative">
                <button
                  type="button"
                  onClick={() => setAuswahl(s.id)}
                  onMouseEnter={() => setHover(s.id)}
                  onMouseLeave={() => setHover(null)}
                  aria-pressed={aktiv}
                  className={cn("flex w-full items-center gap-3 rounded-2xl p-3 pr-4 text-left transition", aktiv ? "bg-white/10" : "hover:bg-white/[0.05]")}
                >
                  <span className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition", aktiv ? "bg-ov-500 text-white" : "bg-white/[0.06] text-ov-300")}>
                    <MapPin aria-hidden="true" className="h-4 w-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[15px] font-semibold text-white">{s.label}</span>
                    <span className="block text-[12.5px] text-white/55">
                      {s.land}
                      {n > 0 && <span className="text-ov-300"> · {n} {n === 1 ? "Projekt" : "Projekte"}</span>}
                    </span>
                  </span>
                  <span className="ov-num shrink-0 text-[13px] font-semibold text-white/70">{s.km} km</span>
                </button>
                {aktiv && n > 0 && (
                  <Link
                    href={`/referenzen/projekte?ort=${encodeURIComponent(s.label)}`}
                    className="mx-3 mb-2 mt-1 flex items-center justify-between rounded-xl bg-ov-500 px-4 py-2.5 text-[14px] font-semibold text-white transition hover:bg-ov-600"
                  >
                    {n === 1 ? "Projekt" : `${n} Projekte`} in {s.label} ansehen
                    <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
                  </Link>
                )}
              </li>
            );
          })}
          {liste.length === 0 && (
            <li className="px-4 py-8 text-center text-[14px] text-white/60">
              Kein Referenzstandort gefunden. Wir sind trotzdem gern für Sie da – auch außerhalb der gezeigten Orte.
            </li>
          )}
        </ul>
      </aside>

      {/* Karte */}
      <div className={cn("relative isolate order-1 lg:order-2 lg:h-full", zustimmung && "h-[440px] sm:h-[520px]")}>
        {zustimmung ? (
          <LeafletKarte standorte={alle} auswahl={auswahl} onWahl={setAuswahl} projekteJeOrt={projekteJeOrt} />
        ) : (
          <div className="relative h-full w-full overflow-hidden pt-16 lg:pt-0">
            <div aria-hidden="true" className="absolute left-[25%] top-[20%] h-[360px] w-[360px] rounded-full bg-ov-500/15 blur-[120px]" />
            <div aria-hidden="true" className="ov-grid-bg absolute inset-0" />
            <svg viewBox={`0 0 ${B} ${H}`} preserveAspectRatio="xMidYMid meet" className="relative block w-full px-2 lg:absolute lg:inset-x-0 lg:top-12 lg:h-[70%] lg:px-0" role="img" aria-label="Vorschau der Referenzstandorte rund um Türkheim">
              {(() => {
                const sitz = projiziere(FIRMENSITZ);
                return (
                  <g aria-hidden="true">
                    {[50, 100, 150, 200].map((km) => (
                      <g key={km}>
                        <circle cx={sitz.x} cy={sitz.y} r={km * PX_JE_KM} fill="none" stroke="rgba(255,255,255,0.13)" strokeDasharray="4 6" />
                        {(() => {
                          const r = km * PX_JE_KM;
                          const ly = sitz.y - r > 24 ? sitz.y - r - 8 : sitz.y + r < H - 10 ? sitz.y + r + 20 : null;
                          return ly == null ? null : (
                            <text x={sitz.x} y={ly} textAnchor="middle" fill="rgba(255,255,255,0.45)" fontSize={15 * Math.min(f, 1.8)} fontFamily="inherit">
                              {km} km
                            </text>
                          );
                        })()}
                      </g>
                    ))}
                  </g>
                );
              })()}
              {beschriftung(auswahl, hover, f).map(({ s, x, y, aktiv, beschriften, links, dy }) => {
                return (
                  <g key={s.id} className="cursor-pointer" onClick={() => setAuswahl(s.id)}>
                    {aktiv && <circle cx={x} cy={y} r={22 * f} fill="rgba(102,153,51,0.25)" />}
                    <circle cx={x} cy={y} r={(aktiv ? 10 : 7) * Math.min(f, 1.8)} fill={aktiv ? "#8cba58" : "#669933"} stroke="#fff" strokeWidth={2.5 * Math.min(f, 1.6)} />
                    {beschriften && (
                      <text x={links ? x - 14 * f : x + 14 * f} y={y + 5 * f + dy} textAnchor={links ? "end" : "start"} fill={aktiv ? "#fff" : "rgba(255,255,255,0.72)"} fontSize={(aktiv ? 19 : 16) * f} fontWeight={aktiv ? 700 : 500} fontFamily="inherit" paintOrder="stroke" stroke="rgba(1,14,33,0.7)" strokeWidth={4 * f}>
                        {s.label}
                      </text>
                    )}
                  </g>
                );
              })}
              {(() => {
                const { x, y } = projiziere(FIRMENSITZ);
                return (
                  <g onClick={() => setAuswahl(FIRMENSITZ.id)} className="cursor-pointer">
                    <circle cx={x} cy={y} r="30" fill="rgba(255,255,255,0.08)">
                      <animate attributeName="r" values="16;36;16" dur="3s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0.9;0;0.9" dur="3s" repeatCount="indefinite" />
                    </circle>
                    <circle cx={x} cy={y} r={12 * Math.min(f, 1.8)} fill="#003473" stroke="#fff" strokeWidth={3.5 * Math.min(f, 1.6)} />
                    <text x={x - 16 * f} y={y - 22 * f} textAnchor="end" fill="#fff" fontSize={19 * f} fontWeight="800" fontFamily="inherit" paintOrder="stroke" stroke="rgba(1,14,33,0.75)" strokeWidth={4 * f}>
                      Türkheim
                    </text>
                  </g>
                );
              })()}
            </svg>

            {ausserhalb.length > 0 && (
              <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                {ausserhalb.map((s) => (
                  <button key={s.id} type="button" onClick={() => setAuswahl(s.id)} className="ov-glass inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-[12.5px] font-medium text-white/85">
                    <span aria-hidden="true">↑</span> {s.label} · {s.km} km
                  </button>
                ))}
              </div>
            )}

            {/* Zustimmung */}
            <div className="relative p-3 sm:p-5 lg:absolute lg:bottom-5 lg:right-5 lg:max-w-sm lg:p-0">
              <div className="rounded-2xl bg-white p-4 text-ink-900 shadow-2xl sm:p-5">
                <p className="flex items-center gap-2 font-display text-[15.5px] font-bold">
                  <ShieldCheck aria-hidden="true" className="h-4 w-4 text-ov-600" />
                  Vorschau ohne externe Daten
                </p>
                <p className="mt-1.5 text-[13px] leading-snug text-ink-600">
                  Für die Detailkarte laden wir Kartenmaterial von OpenStreetMap. Dabei wird Ihre IP-Adresse an deren Server übertragen.
                </p>
                <button type="button" onClick={laden} className="mt-3 inline-flex h-11 w-full items-center justify-center rounded-full bg-ov-500 px-5 text-[14.5px] font-semibold text-white transition hover:bg-ov-600">
                  Interaktive Karte laden
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
