"use client";

import { useEffect, useMemo, useState } from "react";
import { Leaf, Sun, Wind, Zap } from "lucide-react";
import useLiveDaten from "@/components/EnergieLive/useLiveDaten";
import { preisTage } from "@/components/EnergieLive/berechnung";
import SchauraumFolie from "./TvSchauraum";

const datumLang = (d) => new Intl.DateTimeFormat("de-AT", { timeZone: "Europe/Vienna", weekday: "short", day: "numeric", month: "long" }).format(d);
const uhr = (d) => new Intl.DateTimeFormat("de-AT", { timeZone: "Europe/Vienna", hour: "2-digit", minute: "2-digit" }).format(d);
const datumKurz = (iso) => (iso ? new Intl.DateTimeFormat("de-AT", { day: "numeric", month: "long", year: "numeric" }).format(new Date(iso)) : "");
const zahlAT = (v, d = 1) => Number(v).toLocaleString("de-AT", { maximumFractionDigits: d, minimumFractionDigits: d });
const kurzUrl = (u) => String(u || "").replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");

/**
 * Vollbild-Anzeige für Info-Bildschirme und SCADA-Visualisierungen.
 * Parameter (URL): standort, dauer (Sekunden-Standard), energie=0 (Leiste aus), hell=1, schauraum=0, folie=N (Startfolie)
 *
 * Folienwechsel: Die neue Folie wird hinter einer schrägen, grün leuchtenden Lichtkante von links nach
 * rechts freigelegt (clip-path), die alte weicht dabei leicht zurück (transform + opacity). Die neue
 * Folie bekommt `aktiv` – Grafik und Textspalte bauen sich ab diesem Moment auf; die abgelöste behält
 * `aktiv` nur für die Dauer des Übergangs.
 */
export default function TvAnzeige({ start = [], schauraum = [], startFolie = 0, standort = "", standardDauer = 15, energie = true, hell = false }) {
  const [eintraege, setEintraege] = useState(start);
  // index: aktuelle Folie · vorher: die gerade abgelöste (für den Übergang) · schritt: zählt die Wechsel
  const [lauf, setLauf] = useState({ index: startFolie, vorher: -1, schritt: 0 });
  const [jetzt, setJetzt] = useState(() => new Date());

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

  // Live-Strommarkt: dieselbe Quelle wie die Strom-Folie (/api/energie/live?voll=1, alle 5 Minuten),
  // damit Leiste und Folie immer dieselben Werte zeigen.
  const { daten: live, jetzt: liveJetzt } = useLiveDaten(null);
  const strom = useMemo(() => {
    const aktuellPreis = preisTage(live.preis, liveJetzt).aktuell;
    return aktuellPreis && live.erzeugung ? { preis: { aktuell: aktuellPreis }, erzeugung: live.erzeugung } : null;
  }, [live, liveJetzt]);

  // Folien: Meldungen + Schauraum-Werbefolien; die Markenfolie nur ohne Schauraum-Folien
  // (dort übernimmt die Kontaktfolie ihre Aufgabe).
  const folien = useMemo(
    () => [...eintraege, ...schauraum.map((f) => ({ ...f, schauraum: true })), ...(schauraum.length ? [] : [{ id: "__marke", marke: true, dauer: 12 }])],
    [eintraege, schauraum]
  );
  const anzahl = folien.length;
  const ist = lauf.index % anzahl;
  const war = lauf.vorher < 0 ? -1 : lauf.vorher % anzahl;
  const aktuell = folien[ist];
  const dauer = (aktuell?.dauer || standardDauer) * 1000;

  useEffect(() => {
    const t = setTimeout(() => setLauf((l) => ({ index: ((l.index % anzahl) + 1) % anzahl, vorher: l.index % anzahl, schritt: l.schritt + 1 })), dauer);
    return () => clearTimeout(t);
  }, [lauf.schritt, dauer, anzahl]);

  // Die abgelöste Folie bleibt während des Übergangs (1,3 s) „aktiv“, damit sie mit vollem Inhalt
  // abtritt, statt schlagartig auf ihren Startzustand zu springen. Danach ruht sie (keine Animationen).
  const [abgang, setAbgang] = useState(false);
  useEffect(() => {
    if (lauf.vorher < 0) return undefined;
    setAbgang(true);
    const t = setTimeout(() => setAbgang(false), 1350);
    return () => clearTimeout(t);
  }, [lauf.schritt, lauf.vorher]);

  // Seite alle 6 Stunden komplett neu laden (Speicherlecks in Kiosk-Browsern vermeiden)
  useEffect(() => {
    const t = setTimeout(() => window.location.reload(), 6 * 60 * 60 * 1000);
    return () => clearTimeout(t);
  }, []);

  const farben = hell
    ? { grund: "bg-[#f7f5ef]", text: "text-[#03122b]", leise: "text-[#03122b]/65", leiste: "bg-white", linie: "border-[#03122b]/10", spur: "bg-[#03122b]/10" }
    : { grund: "bg-[#03122b]", text: "text-white", leise: "text-white/65", leiste: "bg-[#020b1f]", linie: "border-white/10", spur: "bg-white/[0.13]" };

  return (
    // Feste 16:9-Bühne (100 × 56,25 em), die sich ins Fenster einpasst: 1 em = 1 % der Bühnenbreite.
    // Am TV im Vollbild füllt sie den Schirm; in Fenstern mit anderem Seitenverhältnis (Browser mit
    // Tab- und Adressleiste, Windows-Skalierung) bleibt das Layout gleich, statt unten abgeschnitten zu werden.
    <div className={`fixed inset-0 z-[2147483000] flex items-center justify-center overflow-hidden ${farben.grund} ${farben.text}`}>
    <div className="relative flex h-[56.25em] w-[100em] shrink-0 flex-col overflow-hidden" style={{ fontSize: "min(1vw, 1.7778vh)" }}>
      <div className="relative min-h-0 flex-1 overflow-hidden">
        {folien.map((f, i) => (
          <section
            key={f.id}
            aria-hidden={i !== ist}
            className={`absolute inset-0 grid grid-cols-[1.25fr_1fr] ${farben.grund} ${i === ist ? "tvx-ein" : i === war ? "tvx-weg" : "tvx-ruhe"}`}
          >
            {f.marke ? (
              <MarkenFolie strom={strom} farben={farben} />
            ) : f.schauraum ? (
              <SchauraumFolie folie={f} aktiv={i === ist || (abgang && i === war)} nummer={i + 1} gesamt={anzahl} />
            ) : (
              <>
                <div className="relative overflow-hidden">
                  {f.bildPfad || f.bild ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={f.bildPfad || f.bild} alt={f.bildAlt || ""} className={`h-full w-full object-cover ${i === ist ? "tv-zoom" : ""}`} />
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

        {/* Ambiente über allen Folien: zwei große, statische Lichtflächen, die sehr langsam wandern
            (nur transform), dazu ein feines, statisches Korn gegen Farbstufen auf großen Flächen. */}
        <div aria-hidden="true" className={`pointer-events-none absolute inset-0 z-[4] overflow-hidden ${hell ? "opacity-50" : ""}`}>
          <div className="tvx-drift-a" />
          <div className="tvx-drift-b" />
          <div className="tvx-korn" />
        </div>

        {/* Lichtkante des Folienwechsels: läuft deckungsgleich mit der clip-path-Kante der neuen Folie */}
        {war !== ist && (
          <div key={lauf.schritt} aria-hidden="true" className="tvx-licht">
            <span className="tvx-licht-spur" />
            <span className="tvx-licht-vorn" />
            <span className="tvx-licht-kern" />
          </div>
        )}
      </div>

      {/* Leiste: gleiche Seitenränder wie die Folien (5 em). Oberkante = Ablauf der Schleife, ein Segment je Folie. */}
      <footer className={`relative flex h-[5.4em] shrink-0 items-center gap-[2.2em] whitespace-nowrap px-[5em] ${farben.leiste}`}>
        <div className={`absolute inset-x-0 top-0 h-px ${hell ? "bg-[#03122b]/10" : "bg-white/[0.07]"}`} aria-hidden="true" />
        <div className="absolute inset-x-[5em] top-0 flex h-[0.24em] gap-[0.45em]" aria-hidden="true">
          {folien.map((f, i) => (
            <div key={f.id} className={`relative h-full flex-1 overflow-hidden rounded-b-full ${farben.spur}`}>
              {i < ist && <div className="absolute inset-0 bg-ov-500/80" />}
              {i === ist && <div key={lauf.schritt} className="tvx-fuellen absolute inset-0 bg-gradient-to-r from-ov-500 to-ov-300" style={{ animationDuration: `${dauer}ms` }} />}
            </div>
          ))}
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo-oekovolt-weiss.png" alt="Ökovolt" className="h-[2.3em] w-auto shrink-0" />
        {energie && strom && (
          <>
            <span className={`h-[2em] w-px ${hell ? "bg-[#03122b]/15" : "bg-white/15"}`} />
            <p className={`-mr-[0.8em] flex items-center gap-[0.55em] text-[1.05em] font-semibold ${farben.leise}`}>
              <span className="relative flex h-[0.5em] w-[0.5em]">
                <span className="tvx-live absolute inset-0 rounded-full bg-ov-400" />
                <span className="relative h-full w-full rounded-full bg-ov-400" />
              </span>
              Live
            </p>
            <dl className="flex shrink-0 items-center gap-[2.2em]">
              {[
                { icon: Zap, farbe: "text-sun-400", l: "Börsenstrom", w: zahlAT(strom.preis.aktuell.eurMwh / 10), e: "ct/kWh" },
                { icon: Leaf, farbe: "text-ov-300", l: "Erneuerbare", w: zahlAT(strom.erzeugung.eeAnteil ?? 0, 0), e: "%" },
                { icon: Sun, farbe: "text-sun-400", l: "Solar", w: zahlAT((strom.erzeugung.solarMw ?? 0) / 1000), e: "GW" },
                { icon: Wind, farbe: "text-ov-300", l: "Wind", w: zahlAT((strom.erzeugung.windMw ?? 0) / 1000), e: "GW" },
              ].map(({ icon: Icon, farbe, l, w, e }) => (
                <div key={l} className="flex shrink-0 items-baseline gap-[0.55em] whitespace-nowrap">
                  <dt className={`flex items-center gap-[0.45em] text-[1.05em] ${farben.leise}`}>
                    <Icon aria-hidden="true" className={`h-[1em] w-[1em] self-center ${farbe}`} />
                    {l}
                  </dt>
                  {/* key = Wert: bei jeder Aktualisierung blendet der neue Wert kurz auf */}
                  <dd key={w} className="tvx-wert font-display text-[1.35em] font-extrabold tabular-nums">
                    {w} <span className={`text-[0.7em] font-bold ${farben.leise}`}>{e}</span>
                  </dd>
                </div>
              ))}
            </dl>
          </>
        )}
        <div className="ml-auto flex shrink-0 items-baseline gap-[0.9em] whitespace-nowrap">
          <p className={`text-[1.05em] ${farben.leise}`} suppressHydrationWarning>
            {datumLang(jetzt)}
          </p>
          <p className="font-display text-[1.9em] font-extrabold tabular-nums" suppressHydrationWarning>
            {uhr(jetzt)}
          </p>
        </div>
      </footer>

      <style>{`
        .tv-fortschritt { width: 0; animation-name: tv-balken; animation-timing-function: linear; animation-fill-mode: forwards; }
        @keyframes tv-balken { to { width: 100%; } }
        .tv-zoom { animation: tv-zoom 20s ease-out forwards; }
        @keyframes tv-zoom { from { transform: scale(1.001); } to { transform: scale(1.08); } }
        /* Schauraum-Folien (TvSchauraum.js): eine Aufbau-Bewegung je Folie */
        .tv-auf { opacity: 0; animation: tv-auf 900ms cubic-bezier(0.22, 1, 0.36, 1) forwards; }
        @keyframes tv-auf { to { opacity: 1; } }
        .tv-strich { stroke-dasharray: 1; stroke-dashoffset: 1; }
        .tv-zeichnen { animation: tv-zeichnen 1400ms cubic-bezier(0.65, 0, 0.35, 1) forwards; }
        @keyframes tv-zeichnen { to { stroke-dashoffset: 0; } }
        .tv-fluss { stroke-dasharray: 0.035 0.05; animation: tv-fluss 2.2s linear infinite; }
        @keyframes tv-fluss { to { stroke-dashoffset: -0.17; } }
        .tv-puls { transform-box: fill-box; transform-origin: center; animation: tv-puls 2.4s ease-out infinite; }
        @keyframes tv-puls { from { transform: scale(1); opacity: 0.7; } to { transform: scale(3.4); opacity: 0; } }
        .tv-scan { animation: tv-scan 3.6s ease-in-out infinite alternate; }
        @keyframes tv-scan { from { transform: translateY(0); } to { transform: translateY(var(--tv-scan)); } }
        .tv-qr-scan { animation: tv-qr-scan 2.8s ease-in-out infinite alternate; }
        @keyframes tv-qr-scan { from { top: 0; } to { top: calc(100% - 0.3em); } }
        .tv-blinken { animation: tv-blinken 1.6s ease-in-out infinite; }
        @keyframes tv-blinken { 50% { opacity: 0.25; } }

        /* ---- Rahmen (tvx-): Folienwechsel -------------------------------------------------------
           Neue Folie: schräge Kante (oben 14 em voraus) wandert von links nach rechts. Die Lichtkante
           (.tvx-licht) nutzt dieselbe Dauer, Kurve und Neigung (atan(14 / 50,85 em) = 15,39°). */
        .tvx-ruhe { opacity: 0; visibility: hidden; }
        .tvx-ein { z-index: 2; animation: tvx-ein 1300ms cubic-bezier(0.7, 0, 0.2, 1) backwards; }
        @keyframes tvx-ein {
          from { clip-path: polygon(0 0, 0 0, -14% 100%, 0 100%); }
          to { clip-path: polygon(0 0, 116% 0, 102% 100%, 0 100%); }
        }
        .tvx-weg { z-index: 1; transform-origin: 72% 50%; animation: tvx-weg 1300ms cubic-bezier(0.45, 0, 0.2, 1) forwards; }
        @keyframes tvx-weg {
          from { opacity: 1; transform: scale(1); }
          to { opacity: 0; transform: scale(0.955); visibility: hidden; }
        }
        .tvx-licht { position: absolute; top: 0; bottom: 0; left: 0; width: 0; z-index: 5; pointer-events: none; transform-origin: 0 0;
          animation: tvx-licht 1300ms cubic-bezier(0.7, 0, 0.2, 1) both; will-change: transform, opacity; }
        @keyframes tvx-licht {
          0% { transform: translateX(0) skewX(-15.39deg); opacity: 0; }
          7% { opacity: 1; }
          82% { opacity: 1; }
          100% { transform: translateX(116em) skewX(-15.39deg); opacity: 0; }
        }
        .tvx-licht-spur, .tvx-licht-vorn, .tvx-licht-kern { position: absolute; top: 0; bottom: 0; }
        /* Spur: zarter grüner Nachschein über der eben freigelegten Folie */
        .tvx-licht-spur { right: 0; width: 26em; background: linear-gradient(90deg, rgba(140,186,88,0) 0%, rgba(140,186,88,0.035) 55%, rgba(140,186,88,0.15) 92%, rgba(174,208,131,0.34) 100%); }
        .tvx-licht-vorn { left: 0; width: 4em; background: linear-gradient(90deg, rgba(174,208,131,0.34), rgba(140,186,88,0.1) 35%, rgba(140,186,88,0)); }
        .tvx-licht-kern { left: -0.09em; width: 0.18em; background: linear-gradient(180deg, rgba(230,245,210,0) 0%, #eef8e2 18%, #ffffff 50%, #eef8e2 82%, rgba(230,245,210,0) 100%);
          box-shadow: 0 0 0.6em 0.1em rgba(174,208,131,0.75), 0 0 2.2em 0.4em rgba(140,186,88,0.35); }

        /* ---- Ambiente ---------------------------------------------------------------------------- */
        .tvx-drift-a, .tvx-drift-b { position: absolute; border-radius: 9999px; will-change: transform; }
        .tvx-drift-a { left: -22em; top: -34em; width: 84em; height: 84em;
          background: radial-gradient(closest-side, rgba(140,186,88,0.075), rgba(140,186,88,0.028) 55%, rgba(140,186,88,0));
          animation: tvx-drift-a 47s ease-in-out infinite alternate; }
        @keyframes tvx-drift-a { to { transform: translate3d(26em, 12em, 0) scale(1.12); } }
        .tvx-drift-b { right: -30em; bottom: -40em; width: 96em; height: 96em;
          background: radial-gradient(closest-side, rgba(127,167,214,0.075), rgba(127,167,214,0.025) 55%, rgba(127,167,214,0));
          animation: tvx-drift-b 61s ease-in-out infinite alternate; }
        @keyframes tvx-drift-b { to { transform: translate3d(-30em, -10em, 0) scale(1.08); } }
        .tvx-korn { position: absolute; inset: 0; opacity: 0.05; background-size: 220px 220px;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='k'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.9 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23k)'/%3E%3C/svg%3E"); }

        /* ---- Leiste ------------------------------------------------------------------------------ */
        .tvx-fuellen { transform-origin: 0 50%; transform: scaleX(0); animation-name: tvx-fuellen; animation-timing-function: linear; animation-fill-mode: forwards; }
        @keyframes tvx-fuellen { to { transform: scaleX(1); } }
        .tvx-live { animation: tvx-live 2.6s cubic-bezier(0.22, 1, 0.36, 1) infinite; }
        @keyframes tvx-live { from { transform: scale(1); opacity: 0.65; } 70%, to { transform: scale(3.2); opacity: 0; } }
        .tvx-wert { animation: tvx-wert 1100ms cubic-bezier(0.16, 1, 0.3, 1) both; }
        @keyframes tvx-wert { from { opacity: 0; transform: translateY(0.35em); } 35% { opacity: 1; } }

        /* ---- Textspalte der Schauraum-Folien (TvSchauraum.js) -------------------------------------- */
        .tvx-strich { transform-origin: 0 50%; animation: tvx-strich 700ms cubic-bezier(0.65, 0, 0.35, 1) 120ms both; }
        @keyframes tvx-strich { from { transform: scaleX(0); } }
        .tvx-punkt { animation: tvx-punkt 600ms cubic-bezier(0.34, 1.56, 0.64, 1) 120ms both; }
        @keyframes tvx-punkt { from { transform: scale(0); } }
        .tvx-kicker { animation: tvx-kicker 800ms cubic-bezier(0.16, 1, 0.3, 1) 260ms both; }
        @keyframes tvx-kicker { from { opacity: 0; transform: translateX(-0.8em); } }
        .tvx-maske { display: inline-block; overflow: hidden; vertical-align: top; padding: 0.1em 0.05em 0.16em; margin: -0.1em -0.05em -0.16em; }
        .tvx-zeile { display: inline-block; animation: tvx-zeile 1000ms cubic-bezier(0.16, 1, 0.3, 1) both; animation-delay: calc(300ms + var(--z, 0) * 110ms); }
        @keyframes tvx-zeile { from { transform: translateY(115%); } }
        .tvx-hoch { animation: tvx-hoch 750ms cubic-bezier(0.16, 1, 0.3, 1) both; }
        @keyframes tvx-hoch { from { opacity: 0; transform: translateY(min(0.9vw, 1.6vh)); } }
        .tvx-aus { animation: tvx-aus 450ms cubic-bezier(0.4, 0, 1, 1) forwards; }
        @keyframes tvx-aus { to { opacity: 0; transform: translateY(calc(-1 * min(0.5vw, 0.889vh))); } }

        @media (prefers-reduced-motion: reduce) {
          .tv-zoom, .tv-fluss, .tv-puls, .tv-scan, .tv-qr-scan, .tv-blinken { animation: none; }
          .tv-auf { animation: none; opacity: 1; }
          .tv-zeichnen { animation: none; stroke-dashoffset: 0; }
          .tvx-ein { animation: tvx-blende 700ms ease both; }
          @keyframes tvx-blende { from { opacity: 0; } }
          .tvx-weg { animation: tvx-blende-weg 700ms ease forwards; }
          @keyframes tvx-blende-weg { to { opacity: 0; visibility: hidden; } }
          .tvx-licht { display: none; }
          .tvx-drift-a, .tvx-drift-b, .tvx-live { animation: none; }
          .tvx-strich, .tvx-punkt, .tvx-kicker, .tvx-zeile, .tvx-hoch, .tvx-wert { animation: none; }
          .tvx-aus { animation: none; opacity: 0; }
        }
      `}</style>
    </div>
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
