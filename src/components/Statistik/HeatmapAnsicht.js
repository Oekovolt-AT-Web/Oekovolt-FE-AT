"use client";

import h337 from "heatmap.js";
import { useCallback, useEffect, useRef, useState } from "react";
import { HEATMAP_GERAETE, geraetFuerBreite } from "@/lib/heatmap";

/**
 * Heatmap-Ansicht auf der Website (nur für uns): Seite mit ?heatmap=<HEATMAP_TOKEN>&geraet=desktop aufrufen.
 * Wird von Heatmap.js dynamisch nachgeladen – normale Besucher laden weder diese Datei noch heatmap.js.
 *
 * Die Klickpunkte werden aus Selektor + relativer Position (sel, rx, ry) auf die aktuelle Seite zurückgerechnet
 * und mit heatmap.js (MIT) gezeichnet. Die Zeichenfläche ist nur so groß wie das Fenster und wird beim Scrollen
 * neu berechnet – so passen auch fixierte/sticky Elemente, und sehr lange Seiten sprengen keine Canvas-Grenzen.
 */

const GERAET_NAME = { mobil: "Mobil", tablet: "Tablet", desktop: "Desktop" };
const GERAET_BREITE = { mobil: "unter 768 px", tablet: "768–1199 px", desktop: "ab 1200 px" };
const ZEITRAEUME = [7, 30, 90, 365];
const RADIUS = { mobil: 22, tablet: 28, desktop: 34 };
const FEHLER = {
  400: "Ungültige Anfrage (Pfad oder Gerät).",
  404: "Kein Zugriff: Token ungültig oder HEATMAP_TOKEN auf dem Server nicht gesetzt.",
  502: "Backoffice nicht erreichbar oder Auswertung fehlgeschlagen – keine Daten.",
  503: "Backoffice nicht konfiguriert (SERVER, API_KEY, API_SECRET) – keine Daten.",
  netz: "Keine Verbindung zum Server – keine Daten.",
};

const zahl = (n) => new Intl.NumberFormat("de-AT").format(n);
const prozent = (a) => `${Math.round(a * 100)} %`;

/** Anteil der Aufrufe, die mindestens diese Tiefe (0..100 %) erreicht haben – linear zwischen den 10er-Stufen. */
function anteilBei(tiefe, daten) {
  if (!daten?.aufrufe) return 0;
  const stufen = new Map((daten.scroll || []).map((s) => [s.tiefe, Math.min(1, s.anzahl / daten.aufrufe)]));
  const wert = (t) => (t <= 0 ? 1 : stufen.get(t) ?? 0);
  const t = Math.min(100, Math.max(0, tiefe));
  const unten = Math.floor(t / 10) * 10;
  const oben = Math.min(100, unten + 10);
  if (oben === unten) return wert(unten);
  return wert(unten) + ((wert(oben) - wert(unten)) * (t - unten)) / 10;
}

function fenster() {
  return {
    y: window.scrollY,
    h: window.innerHeight,
    w: window.innerWidth,
    doc: Math.max(document.documentElement.scrollHeight, document.body?.scrollHeight || 0, 1),
  };
}

export default function HeatmapAnsicht({ pfad, token, geraetStart, onBeenden }) {
  const [geraet, setGeraet] = useState(HEATMAP_GERAETE.includes(geraetStart) ? geraetStart : "desktop");
  const [tage, setTage] = useState(30);
  const [deckkraft, setDeckkraft] = useState(0.75);
  const [ausgeblendet, setAusgeblendet] = useState(false);
  const [zustand, setZustand] = useState({ status: "laden" });
  const [treffer, setTreffer] = useState({ gezeigt: 0, fehlend: [], unsichtbar: 0 });
  const [ansicht, setAnsicht] = useState({ y: 0, h: 1, w: 1, doc: 1 });

  const flaeche = useRef(null);
  const karte = useRef(null);
  const groesse = useRef({ w: 0, h: 0 });
  const datenRef = useRef(null);
  const radiusRef = useRef(RADIUS[geraet]);
  const raf = useRef(0);

  const daten = zustand.status === "ok" ? zustand.daten : null;

  /* ---------------------------------------------------------------- Daten laden */
  useEffect(() => {
    let abgebrochen = false;
    setZustand({ status: "laden" });
    const q = new URLSearchParams({ pfad, geraet, tage: String(tage), token });
    fetch(`/api/heatmap?${q}`, { cache: "no-store", credentials: "same-origin" })
      .then(async (r) => {
        if (!r.ok) throw Object.assign(new Error("http"), { status: r.status });
        return r.json();
      })
      .then((d) => !abgebrochen && setZustand({ status: "ok", daten: d }))
      .catch((e) => !abgebrochen && setZustand({ status: "fehler", text: FEHLER[e.status] || FEHLER.netz }));
    return () => {
      abgebrochen = true;
    };
  }, [pfad, geraet, tage, token]);

  /* ---------------------------------------------------------------- Zeichnen */
  const zeichnen = useCallback(() => {
    const f = fenster();
    setAnsicht((alt) => (alt.y === f.y && alt.h === f.h && alt.w === f.w && alt.doc === f.doc ? alt : f));

    const hm = karte.current;
    if (!hm) return;
    if (groesse.current.w !== f.w || groesse.current.h !== f.h) {
      groesse.current = { w: f.w, h: f.h };
      hm.configure({ width: f.w, height: f.h });
    }

    const r0 = radiusRef.current;
    const punkte = [];
    const fehlend = new Map();
    let gezeigt = 0;
    let unsichtbar = 0;
    let max = 1;
    for (const k of datenRef.current?.klicks || []) {
      let el = null;
      try {
        el = document.querySelector(k.sel);
      } catch {
        el = null;
      }
      if (!el) {
        fehlend.set(k.sel, (fehlend.get(k.sel) || 0) + k.anzahl);
        continue;
      }
      const r = el.getBoundingClientRect();
      if (r.width === 0 && r.height === 0) {
        unsichtbar += k.anzahl; // z. B. eingeklapptes Menü oder nur auf anderen Geräten sichtbar
        continue;
      }
      gezeigt += k.anzahl;
      if (k.anzahl > max) max = k.anzahl;
      const x = Math.round(r.left + k.rx * r.width);
      const y = Math.round(r.top + k.ry * r.height);
      // nur Punkte, die (teilweise) im Fenster liegen – heatmap.js verträgt keine leere Zeichenregion
      if (x > 1 - r0 && x < f.w + r0 - 1 && y > 1 - r0 && y < f.h + r0 - 1) punkte.push({ x, y, value: k.anzahl, radius: r0 });
    }
    try {
      hm.setData({ min: 0, max, data: punkte });
    } catch {
      /* Zeichenfehler nie auf die Seite durchschlagen lassen */
    }

    const liste = [...fehlend.entries()].sort((a, b) => b[1] - a[1]);
    setTreffer((alt) =>
      alt.gezeigt === gezeigt && alt.unsichtbar === unsichtbar && alt.fehlend.length === liste.length
        ? alt
        : { gezeigt, unsichtbar, fehlend: liste }
    );
  }, []);

  const planen = useCallback(() => {
    if (raf.current) return;
    raf.current = requestAnimationFrame(() => {
      raf.current = 0;
      zeichnen();
    });
  }, [zeichnen]);

  // heatmap.js-Instanz (Zeichenfläche in Fenstergröße)
  useEffect(() => {
    const el = flaeche.current;
    if (!el) return undefined;
    groesse.current = { w: window.innerWidth, h: window.innerHeight };
    karte.current = h337.create({
      container: el,
      width: groesse.current.w,
      height: groesse.current.h,
      radius: radiusRef.current,
      maxOpacity: 0.85,
      minOpacity: 0.04,
      blur: 0.85,
    });
    return () => {
      karte.current = null;
      el.replaceChildren();
    };
  }, []);

  useEffect(() => {
    radiusRef.current = RADIUS[geraet]; // Radius je Punkt (heatmap.js übernimmt einen geänderten Standardradius nicht)
    planen();
  }, [geraet, planen]);

  useEffect(() => {
    datenRef.current = daten;
    planen();
  }, [daten, pfad, planen]);

  useEffect(() => {
    window.addEventListener("scroll", planen, { passive: true });
    window.addEventListener("resize", planen);
    // Inhalte, die später nachladen oder aufklappen, regelmäßig neu zuordnen
    const takt = setInterval(planen, 1500);
    return () => {
      window.removeEventListener("scroll", planen);
      window.removeEventListener("resize", planen);
      clearInterval(takt);
      if (raf.current) cancelAnimationFrame(raf.current);
      raf.current = 0;
    };
  }, [planen]);

  /* ---------------------------------------------------------------- Scroll-Kurve */
  const hatScroll = Boolean(daten?.aufrufe && daten.scroll?.length);
  const tiefeUnten = ((ansicht.y + ansicht.h) / ansicht.doc) * 100;
  const linien = [];
  if (hatScroll) {
    for (let t = 10; t <= 90; t += 10) {
      const y = (ansicht.doc * t) / 100 - ansicht.y;
      if (y >= 0 && y <= ansicht.h) linien.push({ t, y, anteil: anteilBei(t, daten) });
    }
  }
  const streifenOben = 72;
  const streifenUnten = 150;
  const streifenH = Math.max(120, ansicht.h - streifenOben - streifenUnten);

  const fensterGeraet = geraetFuerBreite(ansicht.w);
  const klicksGesamt = (daten?.klicks || []).reduce((s, k) => s + k.anzahl, 0);

  return (
    <>
      {/* Heatmap-Ebene: fängt keine Klicks ab */}
      <div
        data-ov-heatmap-ansicht=""
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[9500]"
        style={{ opacity: deckkraft, display: ausgeblendet ? "none" : "block" }}
      >
        <div ref={flaeche} style={{ width: "100%", height: "100%" }} />
      </div>

      {/* Scroll-Kurve: Linien je 10 % Tiefe und Streifen am rechten Rand */}
      {hatScroll && !ausgeblendet && (
        <div data-ov-heatmap-ansicht="" aria-hidden="true" className="pointer-events-none fixed inset-0 z-[9510]">
          {linien.map((l) => (
            <div key={l.t} className="absolute left-0 right-0 border-t border-dashed border-ink-900/60" style={{ top: l.y }}>
              <span className="absolute right-14 -translate-y-1/2 md:right-20 rounded-full bg-ink-900/85 px-2.5 py-0.5 text-[11.5px] font-semibold text-white">
                {prozent(l.anteil)} erreichen diese Tiefe ({l.t} %)
              </span>
            </div>
          ))}
          <div
            className="absolute right-1 w-11 overflow-hidden md:right-2 md:w-14 rounded-lg bg-white/85 ring-1 ring-ink-900/20"
            style={{ top: streifenOben, height: streifenH }}
          >
            {Array.from({ length: 10 }, (_, i) => {
              const a = anteilBei((i + 1) * 10, daten);
              return (
                <div
                  key={i}
                  className="flex items-center justify-center text-[10.5px] font-semibold text-ink-900"
                  style={{ height: streifenH / 10, background: `rgba(220, 38, 38, ${0.08 + a * 0.72})` }}
                >
                  {Math.round(a * 100)} %
                </div>
              );
            })}
            <div
              className="absolute left-0 right-0 border-2 border-ink-900"
              style={{
                top: (ansicht.y / ansicht.doc) * streifenH,
                height: Math.max(4, (ansicht.h / ansicht.doc) * streifenH),
              }}
            />
          </div>
        </div>
      )}

      {/* Leiste */}
      <div
        data-ov-heatmap-ansicht=""
        role="region"
        aria-label="Heatmap-Ansicht"
        className="fixed bottom-3 left-1/2 z-[9700] w-[min(1100px,calc(100vw-24px))] -translate-x-1/2 rounded-2xl bg-ink-900/95 px-4 py-3 text-[13px] text-white shadow-[0_20px_50px_-15px_rgba(0,0,0,0.6)]"
      >
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <strong className="font-display text-[14px]">Heatmap</strong>
          <span className="max-w-[220px] truncate text-white/70" title={pfad}>
            {pfad}
          </span>

          <div role="group" aria-label="Gerät" className="flex overflow-hidden rounded-full ring-1 ring-white/25">
            {HEATMAP_GERAETE.map((g) => (
              <button
                key={g}
                type="button"
                aria-pressed={geraet === g}
                onClick={() => setGeraet(g)}
                className={`cursor-pointer px-3 py-1 text-[12.5px] font-semibold ${geraet === g ? "bg-white text-ink-900" : "text-white hover:bg-white/10"}`}
              >
                {GERAET_NAME[g]}
              </button>
            ))}
          </div>

          <label className="flex items-center gap-1.5">
            <span className="text-white/70">Zeitraum</span>
            <select
              value={tage}
              onChange={(e) => setTage(Number(e.target.value))}
              className="cursor-pointer rounded-md bg-white/10 px-2 py-1 text-white ring-1 ring-white/25"
            >
              {ZEITRAEUME.map((t) => (
                <option key={t} value={t} className="text-ink-900">
                  {t} Tage
                </option>
              ))}
            </select>
          </label>

          <label className="flex items-center gap-1.5">
            <span className="text-white/70">Deckkraft</span>
            <input
              type="range"
              min="0.1"
              max="1"
              step="0.05"
              value={deckkraft}
              onChange={(e) => setDeckkraft(Number(e.target.value))}
              className="w-24 cursor-pointer accent-white"
            />
          </label>

          <button
            type="button"
            onClick={() => setAusgeblendet((v) => !v)}
            aria-pressed={ausgeblendet}
            className="cursor-pointer rounded-full px-3 py-1 font-semibold ring-1 ring-white/25 hover:bg-white/10"
          >
            {ausgeblendet ? "Einblenden" : "Ausblenden"}
          </button>
          <button type="button" onClick={onBeenden} className="cursor-pointer rounded-full px-3 py-1 font-semibold text-white/70 hover:text-white">
            Beenden
          </button>

          <span aria-hidden="true" className="ml-auto flex items-center gap-1.5 text-[11.5px] text-white/60">
            wenig
            <span className="inline-block h-2 w-16 rounded-full" style={{ background: "linear-gradient(90deg, rgb(0,0,255), rgb(0,255,0), yellow, rgb(255,0,0))" }} />
            viel
          </span>
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-white/85" aria-live="polite">
          {zustand.status === "laden" && <span>Lade Auswertung …</span>}
          {zustand.status === "fehler" && <span className="font-semibold text-amber-300">{zustand.text}</span>}
          {daten && (
            <>
              <span>
                <strong className="text-white">{zahl(daten.aufrufe)}</strong> Seitenaufrufe
              </span>
              <span>
                <strong className="text-white">{zahl(klicksGesamt)}</strong> Klicks
                {treffer.gezeigt !== klicksGesamt && <> (davon {zahl(treffer.gezeigt)} zugeordnet)</>}
              </span>
              {hatScroll && (
                <span>
                  Fensterunterkante: <strong className="text-white">{prozent(anteilBei(tiefeUnten, daten))}</strong> erreichen diese
                  Tiefe
                </span>
              )}
              {treffer.unsichtbar > 0 && <span>{zahl(treffer.unsichtbar)} Klicks auf derzeit unsichtbare Elemente</span>}
              {treffer.fehlend.length > 0 && (
                <details className="relative">
                  <summary className="cursor-pointer font-semibold text-amber-300">
                    {zahl(treffer.fehlend.length)} {treffer.fehlend.length === 1 ? "Element" : "Elemente"} nicht gefunden
                  </summary>
                  <ul className="absolute bottom-7 left-0 max-h-60 w-[min(520px,85vw)] overflow-auto rounded-xl bg-ink-900 p-3 font-mono text-[11px] ring-1 ring-white/20">
                    {treffer.fehlend.slice(0, 50).map(([sel, n]) => (
                      <li key={sel} className="truncate" title={sel}>
                        {zahl(n)} × {sel}
                      </li>
                    ))}
                  </ul>
                </details>
              )}
              {!daten.aufrufe && <span>Für diese Seite, dieses Gerät und diesen Zeitraum liegen noch keine Daten vor.</span>}
            </>
          )}
          {fensterGeraet !== geraet && (
            <span className="text-white/70">
              Hinweis: Das Fenster ist {zahl(ansicht.w)} px breit ({GERAET_NAME[fensterGeraet]}). Für genaue Positionen bei „
              {GERAET_NAME[geraet]}“ die Fensterbreite auf {GERAET_BREITE[geraet]} stellen.
            </span>
          )}
        </div>
      </div>
    </>
  );
}
