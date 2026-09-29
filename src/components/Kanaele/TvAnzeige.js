"use client";

import { useEffect, useMemo, useState } from "react";
import { Leaf, Sun, Wind, Zap } from "lucide-react";

const datumLang = (d) => new Intl.DateTimeFormat("de-AT", { timeZone: "Europe/Vienna", weekday: "long", day: "numeric", month: "long" }).format(d);
const uhr = (d) => new Intl.DateTimeFormat("de-AT", { timeZone: "Europe/Vienna", hour: "2-digit", minute: "2-digit" }).format(d);
const datumKurz = (iso) => (iso ? new Intl.DateTimeFormat("de-AT", { day: "numeric", month: "long", year: "numeric" }).format(new Date(iso)) : "");
const kurzUrl = (u) => String(u || "").replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");

/**
 * Vollbild-Anzeige für Info-Bildschirme und SCADA-Visualisierungen.
 * Parameter (URL): standort, dauer (Sekunden-Standard), energie=0 (Leiste aus), hell=1
 */
export default function TvAnzeige({ start = [], standort = "", standardDauer = 15, energie = true, hell = false }) {
  const [eintraege, setEintraege] = useState(start);
  const [index, setIndex] = useState(0);
  const [jetzt, setJetzt] = useState(() => new Date());
  const [strom, setStrom] = useState(null);

  // Daten alle 5 Minuten neu laden
  useEffect(() => {
    const laden = () =>
      fetch(`/tv/feed.json${standort ? `?standort=${encodeURIComponent(standort)}` : ""}`, { cache: "no-store" })
        .then((r) => r.json())
        .then((d) => Array.isArray(d.eintraege) && setEintraege(d.eintraege))
        .catch(() => {});
    const t = setInterval(laden, 5 * 60 * 1000);
    return () => clearInterval(t);
  }, [standort]);

  // Uhr
  useEffect(() => {
    const t = setInterval(() => setJetzt(new Date()), 10000);
    return () => clearInterval(t);
  }, []);

  // Live-Strommarkt
  useEffect(() => {
    if (!energie) return undefined;
    const laden = () =>
      fetch("/api/energie/live", { cache: "no-store" })
        .then((r) => r.json())
        .then(setStrom)
        .catch(() => {});
    laden();
    const t = setInterval(laden, 15 * 60 * 1000);
    return () => clearInterval(t);
  }, [energie]);

  // Folien: Meldungen + Markenfolie am Ende
  const folien = useMemo(() => [...eintraege, { id: "__marke", marke: true, dauer: 12 }], [eintraege]);
  const aktuell = folien[index % folien.length];
  const dauer = (aktuell?.dauer || standardDauer) * 1000;

  useEffect(() => {
    const t = setTimeout(() => setIndex((i) => (i + 1) % folien.length), dauer);
    return () => clearTimeout(t);
  }, [index, dauer, folien.length]);

  // Seite alle 6 Stunden komplett neu laden (Speicherlecks in Kiosk-Browsern vermeiden)
  useEffect(() => {
    const t = setTimeout(() => window.location.reload(), 6 * 60 * 60 * 1000);
    return () => clearTimeout(t);
  }, []);

  const farben = hell
    ? { grund: "bg-[#f7f5ef]", text: "text-[#03122b]", leise: "text-[#03122b]/65", leiste: "bg-white", linie: "border-[#03122b]/10" }
    : { grund: "bg-[#03122b]", text: "text-white", leise: "text-white/65", leiste: "bg-[#020b1f]", linie: "border-white/10" };

  return (
    <div className={`fixed inset-0 z-[2147483000] flex flex-col overflow-hidden ${farben.grund} ${farben.text}`} style={{ fontSize: "clamp(10px, 1vw, 40px)" }}>
      <div className="relative min-h-0 flex-1">
        {folien.map((f, i) => (
          <section
            key={f.id}
            aria-hidden={i !== index % folien.length}
            className={`absolute inset-0 grid grid-cols-[1.25fr_1fr] transition-opacity duration-1000 ${i === index % folien.length ? "opacity-100" : "opacity-0"}`}
          >
            {f.marke ? (
              <MarkenFolie strom={strom} farben={farben} />
            ) : (
              <>
                <div className="relative overflow-hidden">
                  {f.bildPfad || f.bild ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={f.bildPfad || f.bild} alt={f.bildAlt || ""} className={`h-full w-full object-cover ${i === index % folien.length ? "tv-zoom" : ""}`} />
                  ) : (
                    <div className="h-full w-full bg-gradient-to-br from-[#558227] to-[#03122b]" />
                  )}
                  <div className={`absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l ${hell ? "from-[#f7f5ef]" : "from-[#03122b]"} to-transparent`} />
                  {f.hervorhebung && (
                    <span className="absolute left-[2.5em] top-[2.5em] rounded-full bg-[#f5b700] px-[1.1em] py-[0.45em] text-[1.4em] font-extrabold uppercase tracking-wider text-[#03122b]">
                      {f.hervorhebung}
                    </span>
                  )}
                </div>
                <div className="flex min-w-0 flex-col justify-center py-[3em] pl-[2em] pr-[4em]">
                  <p className="text-[1.35em] font-bold uppercase tracking-[0.18em] text-[#8cc152]">
                    {f.kategorie}
                    {f.datum && <span className={`whitespace-nowrap font-semibold normal-case tracking-normal ${farben.leise}`}> · {datumKurz(f.datum)}</span>}
                  </p>
                  <h1 className="mt-[0.6em] text-[3.4em] font-extrabold leading-[1.08] tracking-tight" style={{ textWrap: "balance" }}>
                    {f.titel}
                  </h1>
                  {f.teaser && <p className={`mt-[0.9em] line-clamp-3 text-[1.6em] leading-[1.45] ${farben.leise}`}>{f.teaser}</p>}
                  {f.qrSvg && (
                    <div className={`mt-[1.8em] flex items-center gap-[1.4em] border-t pt-[1.8em] ${farben.linie}`}>
                      <div className="h-[8em] w-[8em] shrink-0 rounded-[0.8em] bg-white p-[0.7em]" dangerouslySetInnerHTML={{ __html: f.qrSvg }} />
                      <div>
                        <p className="text-[1.5em] font-bold">Mehr erfahren</p>
                        <p className={`mt-[0.2em] text-[1.3em] ${farben.leise}`}>QR-Code scannen oder</p>
                        <p className="mt-[0.2em] text-[1.3em] font-semibold text-[#8cc152]">{kurzUrl(f.url)}</p>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </section>
        ))}
      </div>

      {/* Fortschritt */}
      <div className={`h-[0.35em] w-full ${hell ? "bg-[#03122b]/10" : "bg-white/10"}`}>
        <div key={`${index}-${folien.length}`} className="tv-fortschritt h-full bg-[#669933]" style={{ animationDuration: `${dauer}ms` }} />
      </div>

      {/* Leiste */}
      <footer className={`flex items-center gap-[2.5em] px-[2.5em] py-[1.1em] ${farben.leiste}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo-oekovolt-weiss.png" alt="Ökovolt" className="h-[3em] w-auto" />
        {energie && strom && (
          <div className="flex items-center gap-[2.2em] text-[1.35em]">
            <span className="flex items-center gap-[0.5em]">
              <Zap aria-hidden="true" className="h-[1.1em] w-[1.1em] text-[#f5b700]" />
              Börsenstrom <b>{(strom.preis?.aktuell?.eurMwh / 10).toLocaleString("de-DE", { maximumFractionDigits: 1 })} ct/kWh</b>
            </span>
            <span className="flex items-center gap-[0.5em]">
              <Leaf aria-hidden="true" className="h-[1.1em] w-[1.1em] text-[#8cc152]" />
              Erneuerbare <b>{Math.round(strom.erzeugung?.eeAnteil ?? 0)} %</b>
            </span>
            <span className="flex items-center gap-[0.5em]">
              <Sun aria-hidden="true" className="h-[1.1em] w-[1.1em] text-[#f5b700]" />
              Solar <b>{((strom.erzeugung?.solarMw ?? 0) / 1000).toLocaleString("de-DE", { maximumFractionDigits: 1 })} GW</b>
            </span>
            <span className="flex items-center gap-[0.5em]">
              <Wind aria-hidden="true" className="h-[1.1em] w-[1.1em] text-[#8cc152]" />
              Wind <b>{((strom.erzeugung?.windMw ?? 0) / 1000).toLocaleString("de-DE", { maximumFractionDigits: 1 })} GW</b>
            </span>
          </div>
        )}
        <div className="ml-auto text-right leading-tight">
          <p className="text-[2.1em] font-extrabold tabular-nums">{uhr(jetzt)}</p>
          <p className={`text-[1.1em] ${farben.leise}`}>{datumLang(jetzt)}</p>
        </div>
      </footer>

      <style>{`
        .tv-fortschritt { width: 0; animation-name: tv-balken; animation-timing-function: linear; animation-fill-mode: forwards; }
        @keyframes tv-balken { to { width: 100%; } }
        .tv-zoom { animation: tv-zoom 20s ease-out forwards; }
        @keyframes tv-zoom { from { transform: scale(1.001); } to { transform: scale(1.08); } }
        @media (prefers-reduced-motion: reduce) { .tv-zoom { animation: none; } }
      `}</style>
    </div>
  );
}

function MarkenFolie({ strom, farben }) {
  return (
    <div className="col-span-2 flex items-center justify-between gap-[4em] px-[7em]">
      <div className="max-w-[55%]">
        <p className="text-[1.4em] font-bold uppercase tracking-[0.2em] text-[#8cc152]">Ökovolt · Photovoltaik aus einer Hand</p>
        <h1 className="mt-[0.5em] text-[5em] font-extrabold leading-[1.05] tracking-tight">Energie, die sich rechnet.</h1>
        <p className={`mt-[0.8em] text-[1.9em] leading-snug ${farben.leise}`}>Photovoltaik für Gewerbe, Landwirtschaft und Gemeinden – geplant, gebaut und betrieben von Ökovolt aus Ostermiething.</p>
        <p className="mt-[1.4em] text-[1.9em] font-bold text-[#8cc152]">oekovolt.com · +43 6278 71030</p>
      </div>
      {strom?.erzeugung && (
        <div className="grid grid-cols-2 gap-[1.2em]">
          {[
            { l: "Anteil Erneuerbare jetzt", w: `${Math.round(strom.erzeugung.eeAnteil)} %` },
            { l: "Börsenstrompreis", w: `${(strom.preis.aktuell.eurMwh / 10).toLocaleString("de-DE", { maximumFractionDigits: 1 })} ct` },
            { l: "Solarleistung AT", w: `${(strom.erzeugung.solarMw / 1000).toLocaleString("de-DE", { maximumFractionDigits: 1 })} GW` },
            { l: "Windleistung AT", w: `${(strom.erzeugung.windMw / 1000).toLocaleString("de-DE", { maximumFractionDigits: 1 })} GW` },
          ].map((k) => (
            <div key={k.l} className="min-w-[14em] rounded-[1.2em] bg-white/5 p-[1.6em] ring-1 ring-white/10">
              <p className="text-[3.2em] font-extrabold tabular-nums">{k.w}</p>
              <p className={`mt-[0.2em] text-[1.2em] ${farben.leise}`}>{k.l}</p>
            </div>
          ))}
          <p className={`col-span-2 text-right text-[1em] ${farben.leise}`}>Quelle: Energy-Charts (Fraunhofer ISE)</p>
        </div>
      )}
    </div>
  );
}
