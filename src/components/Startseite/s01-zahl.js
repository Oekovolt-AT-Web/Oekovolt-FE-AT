"use client";

import { useEffect, useRef, useState } from "react";
import { zahlText } from "@/data/kennzahlen";

/** Österreichische Schreibweise ohne Intl (Server und Browser identisch). */
const formatieren = (n, stellen) => {
  if (!stellen) return zahlText(Math.round(n));
  const [ganz, rest] = (Math.round(n * 10 ** stellen) / 10 ** stellen).toFixed(stellen).split(".");
  return `${zahlText(ganz)},${rest}`;
};
const ruhig = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const aus = (p) => 1 - Math.pow(1 - p, 4);

/**
 * Zahl des Startseiten-Heros (Präfix s01).
 * - Erster Render = Zielwert (SEO, ohne JS lesbar, keine Hydration-Unterschiede).
 * - Auftakt: sobald `aktiv` erstmals wahr ist, zählt sie nach `verzoegerung` ms von 0 hoch –
 *   nur wenn das noch rechtzeitig ist (`spaetestens` = ms seit Seitenaufruf), sonst bleibt der Wert stehen.
 * - Danach gleitet sie bei jeder Änderung weich zum neuen Wert (Rechner-Ergebnisse).
 * - Reduzierte Bewegung: immer sofort der Endwert.
 * - Breite ist immer die des Endwerts (unsichtbarer Platzhalter) → keine Layout-Verschiebung.
 */
export default function S01Zahl({ wert, stellen = 0, dauer = 650, aktiv = true, auftakt = false, verzoegerung = 0, auftaktDauer = 1400, spaetestens = Infinity }) {
  const ziel = Number.isFinite(wert) ? wert : 0;
  const [anzeige, setAnzeige] = useState(ziel);
  const aktuell = useRef(ziel);
  const zielRef = useRef(ziel);
  const raf = useRef(0);
  const timer = useRef(0);
  const auftaktStatus = useRef(auftakt ? "offen" : "fertig");
  zielRef.current = ziel;

  const laufen = (von, bis, ms) => {
    cancelAnimationFrame(raf.current);
    const t0 = performance.now();
    const schritt = (t) => {
      const p = Math.min((t - t0) / ms, 1);
      const v = von + (bis - von) * aus(p);
      aktuell.current = v;
      setAnzeige(v);
      if (p < 1) raf.current = requestAnimationFrame(schritt);
    };
    raf.current = requestAnimationFrame(schritt);
  };

  // Auftakt vorbereiten: noch unsichtbar auf 0 stellen, damit kein Endwert aufblitzt
  useEffect(() => {
    if (auftaktStatus.current !== "offen") return;
    if (ruhig() || performance.now() > spaetestens) {
      auftaktStatus.current = "fertig";
      return;
    }
    aktuell.current = 0;
    setAnzeige(0);
  }, [spaetestens]);

  // Auftakt starten, sobald aktiv
  useEffect(() => {
    if (!aktiv || auftaktStatus.current !== "offen") return undefined;
    auftaktStatus.current = "laeuft";
    timer.current = window.setTimeout(() => {
      laufen(0, zielRef.current, auftaktDauer);
      timer.current = window.setTimeout(() => {
        auftaktStatus.current = "fertig";
      }, auftaktDauer);
    }, verzoegerung);
    return undefined;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aktiv]);

  // Weiches Gleiten bei Wertänderung
  useEffect(() => {
    if (auftaktStatus.current !== "fertig") {
      // Während des Auftakts: Ziel wird am Ende ohnehin erreicht; Änderung des Besuchers hat Vorrang
      if (auftaktStatus.current === "laeuft" && aktuell.current !== 0) {
        clearTimeout(timer.current);
        auftaktStatus.current = "fertig";
      } else return;
    }
    if (aktuell.current === ziel) return;
    if (ruhig()) {
      cancelAnimationFrame(raf.current);
      aktuell.current = ziel;
      setAnzeige(ziel);
      return;
    }
    laufen(aktuell.current, ziel, dauer);
  }, [ziel, dauer]);

  useEffect(
    () => () => {
      cancelAnimationFrame(raf.current);
      clearTimeout(timer.current);
    },
    []
  );

  // Platzhalter mit dem Endwert hält die Breite fest – Einheiten daneben springen nicht (kein CLS)
  return (
    <span className="inline-grid">
      <span aria-hidden="true" className="invisible [grid-area:1/1]">
        {formatieren(ziel, stellen)}
      </span>
      <span className="[grid-area:1/1]">{formatieren(anzeige, stellen)}</span>
    </span>
  );
}
