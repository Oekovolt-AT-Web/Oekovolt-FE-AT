"use client";

// src/components/GewerbeUnikat/K1Live.js
//
// K1 · leichte Client-Teile, die SSR-HTML liefern (SEO, Text-Alternative) und nach dem Rechnen des Workers
// mitlaufen: Kennzahlen-Leiste (<dl>) und Bildunterschrift (<figcaption>). Keine Bibliothek, kein Canvas –
// im ersten Render (Server und Hydrierung) stehen exakt die Server-Werte des Beispiels, erst eine eigene
// Datei (nach Lead-Gate) ändert die Zahlen; sie gleiten dann (Zahl, 420 ms).

import { Kennzeichnung, QuellePille } from "./_bausteine";
import { useGewerbeDaten } from "./_daten";
import { Zahl } from "./_gestaltung";
import { KENNZEICHNUNG, STAND, prozent, zahl } from "./_tokens";
import { datumTM, datumZahl, minutenVon, uhrzeit } from "./K1Gestell";

/** Kennzahlen aus dem Worker-Ergebnis (gleiche Felder wie die Server-Startwerte). */
function ausLast(last) {
  return {
    quelle: last.quelle,
    jahresverbrauch: last.jahresverbrauch,
    spitzeKw: last.spitze.kw,
    spitzeT: last.spitze.t,
    grundlast: last.grundlast,
    benutzungsdauer: last.benutzungsdauer,
    mittelMonatsspitze: last.mittelMonatsspitze,
    anteilFrei: last.anteilFrei,
    hochgerechnet: last.hochgerechnet,
    von: last.von,
    bis: last.bis,
    tage: last.raster.tage.length,
    slots: last.raster.slots,
    monate: last.monate.length,
  };
}

function useK1Werte(start) {
  const last = useGewerbeDaten((s) => s.last);
  return last ? ausLast(last) : start;
}

/** Ein Kennwert. Mobil drei Spalten, kompakt: Erläuterung nur, wo sie Inhalt trägt (immer = true). */
function Posten({ label, children, hinweis, immer = false }) {
  return (
    <div className="flex min-w-0 flex-col border-t border-white/[0.08] pt-3 md:pt-4">
      <dt className="order-1 text-[12px] font-medium leading-snug text-white/60 max-[359px]:min-h-[2.75em] max-[359px]:text-[11.5px] md:text-[13px]">{label}</dt>
      <dd className="order-2 mt-1.5">
        <span className="ov-num block whitespace-nowrap font-display text-[19px] font-extrabold leading-none tracking-[-0.03em] text-white min-[360px]:text-[20px] sm:text-[25px] md:text-[30px]">{children}</span>
        {hinweis && <span className={`mt-1.5 text-[11.5px] leading-snug text-white/50 md:text-[12.5px] ${immer ? "block" : "hidden sm:block"}`}>{hinweis}</span>}
      </dd>
    </div>
  );
}

const Einheit = ({ children }) => <span className="ml-1 text-[0.55em] font-bold text-white/60">{children}</span>;

/** Kennzahlen-Leiste: Jahresverbrauch · Jahresspitze · Grundlast · Benutzungsdauer · Mittel der Monatsspitzen. */
export function K1Kennzahlen({ start }) {
  const w = useK1Werte(start);
  const eigen = w.quelle === "eigen";
  return (
    <div data-testid="k1-kennzahlen">
      <h3 className="sr-only font-display text-[17px] font-bold text-white md:not-sr-only">{eigen ? "Kennzahlen Ihres Lastgangs" : "Kennzahlen des Beispielbetriebs"}</h3>
      <dl className="grid grid-cols-3 md:mt-4 gap-x-4 gap-y-4 md:gap-x-6 md:gap-y-5">
        <Posten label={"Jahres\u00ADverbrauch"} hinweis={eigen ? (w.hochgerechnet ? "auf ein Jahr hochgerechnet" : `${zahl(w.tage)} Tage gemessen`) : "Summe der 35.040 Viertelstunden"}>
          <Zahl wert={w.jahresverbrauch / 1000} />
          <Einheit>MWh</Einheit>
        </Posten>
        <Posten label={"Jahres\u00ADspitze"} immer hinweis={`${datumTM(w.spitzeT)} · ${uhrzeit(minutenVon(w.spitzeT))}`}>
          <Zahl wert={w.spitzeKw} />
          <Einheit>kW</Einheit>
        </Posten>
        <Posten label="Grundlast" hinweis="5-%-Quantil aller Viertelstunden">
          <Zahl vor="≈ " wert={w.grundlast} />
          <Einheit>kW</Einheit>
        </Posten>
        <Posten label={"Benutzungs\u00ADdauer"} hinweis="Jahresverbrauch ÷ Jahresspitze">
          <Zahl wert={w.benutzungsdauer} />
          <Einheit>h</Einheit>
        </Posten>
        <Posten
          label={
            <>
              <span className="md:hidden">Ø Monats{"\u00AD"}spitze</span>
              <span className="hidden md:inline">Mittel der Monatsspitzen</span>
            </>
          }
          hinweis="Basis des Leistungspreises bis Ende 2026">
          <Zahl wert={w.mittelMonatsspitze} stellen={1} />
          <Einheit>kW</Einheit>
        </Posten>
        <Posten label="An freien Tagen" hinweis="Anteil Sa, So und Feiertage">
          <Zahl wert={w.anteilFrei * 100} />
          <Einheit>%</Einheit>
        </Posten>
      </dl>
      <QuellePille dunkel className="mt-4 md:mt-5">
        {eigen
          ? `Ihre Datei · ausgewertet nur in diesem Browser · ${KENNZEICHNUNG.richtwert}`
          : `Synthetischer Beispiel-Lastgang 2025 · ${STAND.werte} · ${KENNZEICHNUNG.richtwert}`}
      </QuellePille>
    </div>
  );
}

/**
 * Bildunterschrift des Teppichs – Beispiel (SSR) oder eigene Datei (nach Gate). Mobil steht eine kurze, in sich
 * vollständige Fassung (statt mitten im Wort abgeschnitten); die lange Fassung ab md und in der Schublade.
 */
export function K1Bildtext({ start, beispielText, beispielKurz }) {
  const w = useK1Werte(start);
  const eigen = w.quelle === "eigen";
  return (
    <figcaption className="mt-5 max-w-[72ch] text-[13.5px] leading-relaxed text-white/60 md:mt-6">
      {eigen ? (
        <>
          Lastgang-Teppich Ihrer Datei: {zahl(w.tage)} Tage ({datumZahl(w.von)} bis {datumZahl(w.bis - 1)}) × {w.slots} Werte je Tag – je heller die Zelle, desto
          höher die Leistung. Jahresverbrauch {zahl(w.jahresverbrauch / 1000)} MWh{w.hochgerechnet ? " (auf ein Jahr hochgerechnet)" : ""}, Jahresspitze{" "}
          {zahl(w.spitzeKw)} kW am {datumTM(w.spitzeT)} um {uhrzeit(minutenVon(w.spitzeT))}, Grundlast ≈ {zahl(w.grundlast)} kW, {prozent(w.anteilFrei)} an Samstagen, Sonn- und
          Feiertagen.
        </>
      ) : (
        <>
          {beispielKurz && <span className="md:hidden">{beispielKurz}</span>}
          <span className={beispielKurz ? "hidden md:inline" : undefined}>{beispielText}</span>
        </>
      )}
      <Kennzeichnung dunkel className="mt-2">
        {eigen ? "Ihr Lastgang · ausgewertet nur in diesem Browser – die Datei verlässt Ihren Browser nicht" : KENNZEICHNUNG.synthetisch}
      </Kennzeichnung>
    </figcaption>
  );
}

/* ---------------------------------------------------------------------------------------------------
   „Was daraus für die Anlage folgt“ – Beispiel (SSR, Server-Texte) oder eigene Datei (nach Gate).
   Jury 13.10.2026: Nach eigenem Lastgang standen hier weiter die Werte des Beispielbetriebs (34 kW, 291,5 →
   289,1 kW, 14 %/88 %), obwohl das Panel „alle Kapitel rechnen mit Ihren Werten“ meldete. Jetzt rechnet der
   Block mit den eigenen Viertelstunden neu (≈ 1 ms im Hauptthread, nur bei Datenwechsel).
   --------------------------------------------------------------------------------------------------- */

/** Monatsspitzen des Netzbezugs mit PV (ohne Speicher) – gleiche Rechnung wie monatsspitzenMitPv in _rechnen.js. */
export function spitzenMitPv(reihe, pvReihe, kwp, intervall) {
  const zuKw = 60 / intervall;
  const spitzen = new Array(12).fill(NaN);
  for (let i = 0; i < reihe.kw.length; i++) {
    const m = new Date(reihe.zeiten[i]).getUTCMonth();
    const v = Math.max(0, reihe.kw[i] - pvReihe[i] * kwp * zuKw);
    if (!(spitzen[m] >= v)) spitzen[m] = v;
  }
  const gueltig = spitzen.filter(Number.isFinite);
  return gueltig.reduce((s, v) => s + v, 0) / Math.max(1, gueltig.length);
}

/** Anteil des PV-Überschusses an Samstagen, Sonn- und Feiertagen (Betriebsurlaub kennt nur das Beispiel). */
function ueberschussFrei(last, pv, kwp) {
  const { tage, slots, typ } = last.raster;
  let ueb = 0;
  let frei = 0;
  for (let d = 0; d < tage.length; d++) {
    for (let s = 0; s < slots; s++) {
      const j = d * slots + s;
      const l = last.raster.last[j];
      if (!Number.isFinite(l)) continue;
      const u = Math.max(0, pv.raster[j] * kwp - l);
      ueb += u;
      if (typ[d] > 0) frei += u;
    }
  }
  return ueb > 0 ? frei / ueb : 0;
}

function eigeneFolgen(last, pv) {
  const kwp = pv.empfehlung.kwp;
  const min = last.monate.map((m) => minutenVon(m.spitzeT));
  const von = uhrzeit(Math.min(...min));
  const bis = uhrzeit(Math.max(...min));
  const mittelPv = spitzenMitPv(last.reihe, pv.reihe, kwp, last.intervall);
  const frei = ueberschussFrei(last, pv, kwp);
  return [
    {
      kopf: "Leistungspreis",
      text: `Ihre ${last.monate.length} Monatsspitzen liegen zwischen ${von} und ${bis} Uhr. PV mit ${zahl(kwp)} kWp senkt ihr Mittel im Modell von ${zahl(last.mittelMonatsspitze, 1)} auf ${zahl(mittelPv, 1)} kW.`,
      href: "#leistungspreis",
      link: "Kapitel 05 · Leistungspreis senken",
    },
    {
      kopf: "Grundlast",
      text: `Ihre Grundlast von ≈ ${zahl(last.grundlast)} kW nimmt an jedem Tag Sonnenstrom auf – auch an Wochenenden und Feiertagen.`,
      href: "#eigenverbrauch",
      link: "Kapitel 03 · Anlagengröße",
    },
    {
      kopf: "Freie Tage",
      text: `${prozent(last.anteilFrei)} Ihres Stroms fließen an Samstagen, Sonn- und Feiertagen. Bei ${zahl(kwp)} kWp fallen ${prozent(frei)} des Überschusses an diesen Tagen an.`,
      href: "#eigenverbrauch",
      link: "Kapitel 03 · Eigenverbrauch",
    },
  ];
}

/**
 * Block „Was daraus für die Anlage folgt“ (nur ab xl sichtbar). beispiel: drei Einträge { kopf, text, href, link }
 * aus dem Server (Beispielbetrieb), beispielPille: Quellenzeile des Beispiels.
 */
export function K1Folgen({ beispiel, beispielPille, linkKlasse }) {
  const last = useGewerbeDaten((s) => s.last);
  const pv = useGewerbeDaten((s) => s.pv);
  const eigen = last?.quelle === "eigen" && pv?.reihe && last?.reihe;
  // Rechnen nur bei Datenwechsel (last/pv sind stabile Objekte aus dem Speicher von _daten.js)
  const folgen = eigen ? eigeneFolgenGemerkt(last, pv) : beispiel;
  return (
    <div className="mt-10 hidden xl:block" data-testid="k1-folgen" data-quelle={eigen ? "eigen" : "beispiel"}>
      <h3 className="font-display text-[17px] font-bold text-white">{eigen ? "Was daraus für Ihre Anlage folgt" : "Was daraus für die Anlage folgt"}</h3>
      <ul className="mt-4">
        {folgen.map((f) => (
          <li key={f.kopf} className="grid grid-cols-[132px_minmax(0,1fr)] gap-6 border-t border-white/[0.08] py-4">
            <span className="pt-0.5 text-[12.5px] font-semibold uppercase tracking-[0.16em] text-ov-300">{f.kopf}</span>
            <span className="text-[14.5px] leading-relaxed text-white/75">
              {f.text}{" "}
              <a href={f.href} className={linkKlasse}>
                {f.link}
              </a>
            </span>
          </li>
        ))}
      </ul>
      <QuellePille dunkel>{eigen ? `Ihr Lastgang · PV im Modell (PVGIS, Ort und Dachart aus Kapitel 02) · ${KENNZEICHNUNG.richtwert}` : beispielPille}</QuellePille>
    </div>
  );
}

let gemerkt = { last: null, pv: null, folgen: null };
function eigeneFolgenGemerkt(last, pv) {
  if (gemerkt.last !== last || gemerkt.pv !== pv) gemerkt = { last, pv, folgen: eigeneFolgen(last, pv) };
  return gemerkt.folgen;
}
