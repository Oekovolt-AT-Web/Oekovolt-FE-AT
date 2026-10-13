"use client";

// src/components/RechnerGewerbe/DachZeichnen.js – Hallendach-Planer: Dachfläche auf dem Orthofoto
// einzeichnen (Welle B, Paket B05)
//
// Aufklappbarer Block oberhalb des Gewerbe-PV-Rechners. Die Karte (DachKarte.js, Leaflet mit dem
// basemap.at-Orthofoto) wird erst beim Aufklappen geladen – kein Einfluss auf LCP. Alternative
// ohne Karte: Länge × Breite. Die Fläche rechnet src/lib/rechner/flaeche.js geodätisch.
//
// Lead-Gate-Regel (Inhaber 11.10.2026, Stufe 2): Einzeichnen ist frei; das Ergebnis-Datenblatt
// (Nutzfläche, kWp, Übergabe, Download) erscheint erst nach bestätigter E-Mail (DachGate.js).
// Vor dem Gate steht eine klar gekennzeichnete Beispiel-Vorschau.
//
// Datenschutz: Koordinaten bleiben im Browser (sessionStorage nur zum Wiederherstellen nach der
// Übergabe), das Statistik-Ereignis „dach_gezeichnet“ enthält keine Koordinaten. Kartenkacheln
// von basemap.at (IP an Geoland-Server), Adresssuche über /api/standort (Nominatim/OSMF, nur auf
// Absenden, serverseitig gedrosselt).

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowRight, ChevronDown, Crosshair, Download, Keyboard, Loader2, Lock, MapPinned, Pentagon, Printer, Ruler, Search, Trash2, Undo2 } from "lucide-react";
import Button from "@/components/ui/Button";
import { cn } from "@/components/ui/cn";
import { Auswahl, Gruppe, Regler } from "@/components/Rechner/bausteine";
import { fmt } from "@/lib/rechner/annahmen";
import { angebotUrl } from "@/lib/rechner/angebot";
import { GEWERBE_PV } from "@/lib/rechner/gewerbepv";
import { DACH_ABZUEGE, QM_PRO_KWP_STANDARD, kwpAusNutzflaeche, naechsterOrt, nutzflaeche, polygonFlaecheQm, polygonMitte, polygonUmfangM, rechteckFlaecheQm, uebergabeQuery } from "@/lib/rechner/flaeche";
import { ereignis } from "@/lib/statistik";
import DachGate, { useGateFreigabe } from "./DachGate";

export const GATE_KENNUNG = "hallendach-planer";
const PFAD = "/rechner/gewerbe-pv";
const ANKER = "dach-einzeichnen";
const PUNKTE_KEY = "ov_dach_punkte";
const SUCHE_ABSTAND_MS = 1500; // Nominatim-Regel: keine Autovervollständigung, höchstens 1 Anfrage/s

const DachKarte = dynamic(() => import("./DachKarte"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-ink-100 text-[14px] text-ink-500">
      <Loader2 aria-hidden="true" className="mr-2 h-4 w-4 animate-spin" /> Orthofoto wird geladen …
    </div>
  ),
});

// Beispielwerte für die Vorschau vor dem Gate – klar als Beispiel gekennzeichnet, keine Messung
const BEISPIEL = { brutto: 7200, randPct: 10, hindernisPct: 15, dachart: "ost-west" };

const dachartVon = (id) => GEWERBE_PV.dacharten.find((d) => d.id === id) || GEWERBE_PV.dacharten[0];
const runde10 = (v) => Math.round(v / 10) * 10;

/**
 * @param {object} p
 * @param {{slug:string, name:string, landName?:string, lat:number, lon:number}[]} p.orte  Orte des Gewerbe-PV-Rechners (PVGIS) mit Koordinaten
 * @param {string} [p.startOrt]  Slug des Standardorts
 */
export default function DachZeichnen({ orte = [], startOrt = "linz" }) {
  const id = useId();
  const [offen, setOffen] = useState(false);
  const [modus, setModus] = useState("karte"); // karte | masse
  const [punkte, setPunkte] = useState([]);
  const [mitte, setMitte] = useState(null);
  const [ziel, setZiel] = useState(null);
  const [suche, setSuche] = useState("");
  const [treffer, setTreffer] = useState([]);
  const [sucheLaeuft, setSucheLaeuft] = useState(false);
  const [sucheFehler, setSucheFehler] = useState("");
  const [laenge, setLaenge] = useState(120);
  const [breite, setBreite] = useState(60);
  const [dachart, setDachart] = useState("ost-west");
  const [randPct, setRandPct] = useState(DACH_ABZUEGE.rand.standard);
  const [hindernisPct, setHindernisPct] = useState(DACH_ABZUEGE.hindernisse.standard);
  const [ortManuell, setOrtManuell] = useState(null);
  const [gateOffen, setGateOffen] = useState(false);
  const [frei, freischalten] = useGateFreigabe(GATE_KENNUNG);
  const letzteSuche = useRef(0);
  const gemeldet = useRef(false);

  // Nach der Übergabe (Seite lädt neu) oder Rückkehr vom Bestätigungslink: Zeichnung und Zustand wiederherstellen
  useEffect(() => {
    try {
      const roh = sessionStorage.getItem(PUNKTE_KEY);
      if (roh) {
        const g = JSON.parse(roh);
        if (Array.isArray(g.punkte)) setPunkte(g.punkte.filter((p) => Number.isFinite(p.lat) && Number.isFinite(p.lon)));
        if (g.modus) setModus(g.modus);
        if (g.laenge > 0) setLaenge(g.laenge);
        if (g.breite > 0) setBreite(g.breite);
        if (g.dachart) setDachart(g.dachart);
        if (Number.isFinite(g.randPct)) setRandPct(g.randPct);
        if (Number.isFinite(g.hindernisPct)) setHindernisPct(g.hindernisPct);
        if (g.ziel) setZiel(g.ziel);
        if (g.punkte?.length || g.modus === "masse") setOffen(true);
      }
      if (window.location.hash === `#${ANKER}`) setOffen(true);
    } catch {
      /* nichts wiederherstellen */
    }
  }, []);
  useEffect(() => {
    try {
      sessionStorage.setItem(PUNKTE_KEY, JSON.stringify({ punkte, modus, laenge, breite, dachart, randPct, hindernisPct, ziel }));
    } catch {
      /* privater Modus */
    }
  }, [punkte, modus, laenge, breite, dachart, randPct, hindernisPct, ziel]);

  /* ---------- Geometrie ---------- */
  const bruttoKarte = useMemo(() => polygonFlaecheQm(punkte), [punkte]);
  const umfang = useMemo(() => polygonUmfangM(punkte), [punkte]);
  const dachMitte = useMemo(() => polygonMitte(punkte), [punkte]);
  const brutto = modus === "karte" ? bruttoKarte : rechteckFlaecheQm(laenge, breite);
  const fertig = modus === "karte" ? punkte.length >= 3 : brutto > 0;
  const d = dachartVon(dachart);
  const netto = nutzflaeche(brutto, { randPct, hindernisPct });
  const kwp = kwpAusNutzflaeche(netto.netto, d.qmProKwp);

  const ortNaechster = useMemo(() => (dachMitte && modus === "karte" ? naechsterOrt(dachMitte, orte) : null), [dachMitte, modus, orte]);
  const ortSlug = ortManuell || ortNaechster?.slug || startOrt;
  const ort = orte.find((o) => o.slug === ortSlug) || orte[0] || null;
  // Nur gewählter oder aus der Dachmitte ermittelter Ort gilt als geprüft; der voreingestellte
  // startOrt wird weder als „gewählt“ ausgewiesen noch ungeprüft an den Rechner übergeben.
  const ortGeprueft = !!(ortManuell || ortNaechster);

  // Statistik ohne Koordinaten, einmal je fertiger Zeichnung
  useEffect(() => {
    if (modus === "karte" && punkte.length >= 3 && !gemeldet.current) {
      gemeldet.current = true;
      ereignis("dach_gezeichnet", { punkte: punkte.length, flaeche_qm: runde10(bruttoKarte) });
    }
    if (punkte.length < 3) gemeldet.current = false;
  }, [punkte, modus, bruttoKarte]);

  /* ---------- Adresssuche (nur auf Absenden, gedrosselt) ---------- */
  async function suchen(e) {
    e.preventDefault();
    const q = suche.trim();
    if (q.length < 3) {
      setSucheFehler("Bitte mindestens drei Zeichen eingeben, z. B. Straße, Hausnummer und Ort.");
      return;
    }
    if (Date.now() - letzteSuche.current < SUCHE_ABSTAND_MS) return;
    letzteSuche.current = Date.now();
    setSucheLaeuft(true);
    setSucheFehler("");
    setTreffer([]);
    try {
      const res = await fetch(`/api/standort?${new URLSearchParams({ q })}`);
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || "Die Suche ist fehlgeschlagen.");
      const liste = json.treffer || [];
      if (liste.length === 0) setSucheFehler("Keine Adresse in Österreich gefunden. Prüfen Sie die Schreibweise oder bewegen Sie die Karte von Hand zum Dach.");
      else if (liste.length === 1) waehle(liste[0]);
      else setTreffer(liste);
    } catch (err) {
      setSucheFehler(err.message);
    } finally {
      setSucheLaeuft(false);
    }
  }
  function waehle(t) {
    setTreffer([]);
    setZiel({ lat: t.lat, lon: t.lon, label: t.label });
  }

  /* ---------- Punkte ---------- */
  const punkteSetzen = useCallback((neu) => setPunkte(neu.slice(0, 40)), []);
  const punktMitte = () => mitte && punkteSetzen([...punkte, mitte]);
  const letztenLoeschen = () => punkteSetzen(punkte.slice(0, -1));
  const alleLoeschen = () => {
    punkteSetzen([]);
    setOrtManuell(null);
  };

  /* ---------- Übergabe und Export ---------- */
  const uebergabeHref = `${PFAD}?${uebergabeQuery({ flaecheQm: netto.netto, dachart, ort: ortGeprueft ? ortSlug : undefined })}`;
  const angebotHref = angebotUrl({ objekt: "gewerbe", kwp: Math.round(kwp) });
  const zusammenfassung = {
    Modus: modus === "karte" ? `Orthofoto, ${punkte.length} Eckpunkte` : `Länge × Breite (${fmt(laenge)} × ${fmt(breite)} m)`,
    Bruttofläche: `${fmt(runde10(brutto))} m²`,
    Abzüge: `Rand ${randPct} %, Hindernisse ${hindernisPct} %`,
    Nutzfläche: `${fmt(runde10(netto.netto))} m²`,
    Dachart: `${d.label} (${fmt(d.qmProKwp)} m²/kWp)`,
    Leistung: `${fmt(Math.round(kwp))} kWp`,
    Standort: ort ? `${ort.name}${ort.landName ? `, ${ort.landName}` : ""}${ortGeprueft ? "" : " (Standard, bitte prüfen)"}` : "–",
  };

  const datenblattZeilen = () => [
    ["Bruttofläche", `${fmt(runde10(brutto))} m²`, modus === "karte" ? `aus ${punkte.length} Eckpunkten auf dem Orthofoto, Umfang ≈ ${fmt(Math.round(umfang))} m` : `${fmt(laenge)} m × ${fmt(breite)} m`],
    ["Randabzug", `− ${fmt(runde10(netto.rand))} m²`, `${randPct} % (Randstreifen, Brandschutz/Wartung, Attika)`],
    ["Hindernisse", `− ${fmt(runde10(netto.hindernisse))} m²`, `${hindernisPct} % (Lichtkuppeln, RWA, Lüftung, Wege)`],
    ["Nutzbare Modulfläche", `${fmt(runde10(netto.netto))} m²`, "Richtwert/Orientierung"],
    ["Dachart", d.label, `${d.sub} · ${fmt(d.qmProKwp)} m² je kWp`],
    ["Anlagenleistung", `≈ ${fmt(Math.round(kwp))} kWp`, `Nutzfläche ÷ ${fmt(d.qmProKwp)} m²/kWp`],
    ["Standort für PVGIS", ort ? `${ort.name}${ort.landName ? `, ${ort.landName}` : ""}` : "–", ortManuell ? "gewählt" : ortNaechster ? `nächster Rechner-Ort, ${fmt(ortNaechster.distanzKm, 1)} km von der Dachmitte` : "Standard, bitte prüfen"],
  ];

  function csvLaden() {
    const zeilen = [["Position", "Wert", "Hinweis"], ...datenblattZeilen(), ["Quelle", "Ökovolt Österreich – Hallendach-Planer", `Richtwerte, Stand ${new Date().toLocaleDateString("de-AT")}; Orthofoto: basemap.at (CC BY 4.0)`]];
    const csv = zeilen.map((z) => z.map((x) => `"${String(x).replace(/"/g, '""')}"`).join(";")).join("\r\n");
    const blob = new Blob([`﻿${csv}`], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "oekovolt-hallendach-datenblatt.csv";
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
    ereignis("dach_export", { art: "csv" });
  }
  function drucken() {
    ereignis("dach_export", { art: "druck" });
    window.print();
  }

  const hatOrte = orte.length > 0;
  const orteSortiert = useMemo(() => [...orte].sort((a, b) => a.name.localeCompare(b.name, "de")), [orte]);

  return (
    <section id={ANKER} aria-labelledby={`${id}-titel`} className="dz-wurzel mb-5 scroll-mt-28 overflow-hidden rounded-[2rem] bg-white shadow-[0_24px_60px_-30px_rgba(21,26,36,0.35)] ring-1 ring-ink-200/70">
      <style>{DRUCK_CSS}</style>
      {/* ---------------- Kopf / Aufklappen ---------------- */}
      <button
        type="button"
        onClick={() => setOffen((o) => !o)}
        aria-expanded={offen}
        aria-controls={`${id}-inhalt`}
        className="dz-nicht-drucken flex w-full items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-sand-50 sm:px-6 md:px-8"
      >
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-ov-50 text-ov-700 ring-1 ring-ov-200">
          <Pentagon aria-hidden="true" className="h-6 w-6" />
        </span>
        <span className="min-w-0 flex-1">
          <span id={`${id}-titel`} className="block font-display text-[17px] font-bold leading-tight text-ink-900 sm:text-[19px]">
            Dach auf der Karte einzeichnen
          </span>
          <span className="mt-1 block text-[13.5px] leading-snug text-ink-600">Hallendach auf dem Orthofoto umfahren oder Länge × Breite eingeben – Nutzfläche und kWp für den Rechner.</span>
        </span>
        <ChevronDown aria-hidden="true" className={cn("h-5 w-5 shrink-0 text-ink-500 transition-transform duration-300", offen && "rotate-180")} />
      </button>

      {offen && (
        <div id={`${id}-inhalt`} className="border-t border-ink-100">
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,380px)]">
            {/* ---------------- Links: Karte / Maße ---------------- */}
            <div className="dz-nicht-drucken p-5 sm:p-6 md:p-8">
              <Auswahl
                legende="Dachfläche ermitteln"
                wert={modus}
                onChange={setModus}
                optionen={[
                  { id: "karte", label: "Auf dem Orthofoto", sub: "Eckpunkte anklicken" },
                  { id: "masse", label: "Länge × Breite", sub: "ohne Karte" },
                ]}
              />

              {modus === "karte" ? (
                <div className="mt-5 space-y-4">
                  <form onSubmit={suchen} className="flex flex-col gap-2 sm:flex-row" role="search" aria-label="Adresse des Betriebs suchen">
                    <label htmlFor={`${id}-suche`} className="sr-only">
                      Adresse
                    </label>
                    <input
                      id={`${id}-suche`}
                      type="search"
                      value={suche}
                      onChange={(e) => setSuche(e.target.value)}
                      placeholder="Adresse des Betriebs, z. B. Gewerbegebiet 10, Ostermiething"
                      autoComplete="off"
                      className="h-12 min-w-0 flex-none rounded-full bg-sand-50 sm:flex-1 px-5 text-[15px] text-ink-900 outline-none ring-1 ring-inset ring-ink-200 placeholder:text-ink-500 focus:ring-2 focus:ring-ov-500"
                    />
                    <Button type="submit" variant="navy" icon={sucheLaeuft ? Loader2 : Search} disabled={sucheLaeuft} className={sucheLaeuft ? "[&_svg]:animate-spin" : ""}>
                      Suchen
                    </Button>
                  </form>
                  {sucheFehler && (
                    <p role="alert" className="text-[13.5px] font-medium text-red-700">
                      {sucheFehler}
                    </p>
                  )}
                  {treffer.length > 1 && (
                    <ul className="divide-y divide-ink-100 overflow-hidden rounded-2xl bg-sand-50 ring-1 ring-ink-200/70">
                      {treffer.map((t) => (
                        <li key={`${t.lat}-${t.lon}`}>
                          <button type="button" onClick={() => waehle(t)} className="flex w-full items-center gap-3 px-4 py-3 text-left text-[14px] text-ink-800 hover:bg-white">
                            <MapPinned aria-hidden="true" className="h-4 w-4 shrink-0 text-ov-600" />
                            <span className="min-w-0 flex-1 truncate">{t.label}</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}

                  <div className="relative h-[340px] overflow-hidden rounded-3xl ring-1 ring-ink-200 sm:h-[420px] lg:h-[480px]">
                    <DachKarte punkte={punkte} onPunkte={punkteSetzen} ziel={ziel} onMitte={setMitte} />
                  </div>
                  <p className="text-[12px] leading-relaxed text-ink-500">
                    Datenquelle: <a href="https://www.basemap.at" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-ink-800">basemap.at</a> (Orthofoto und Grundkarte, CC BY 4.0) · Adresssuche: © OpenStreetMap-Mitwirkende (Nominatim), nur auf Absenden · Ihre Dachkoordinaten bleiben in Ihrem Browser.
                  </p>

                  <div className="flex flex-wrap gap-2">
                    <button type="button" onClick={punktMitte} disabled={!mitte} className="inline-flex h-11 items-center gap-1.5 rounded-full bg-sand-50 px-4 text-[13.5px] font-semibold text-ink-800 ring-1 ring-inset ring-ink-200 hover:bg-white disabled:opacity-50">
                      <Crosshair aria-hidden="true" className="h-4 w-4 text-ov-600" /> Punkt im Fadenkreuz setzen
                    </button>
                    <button type="button" onClick={letztenLoeschen} disabled={!punkte.length} className="inline-flex h-11 items-center gap-1.5 rounded-full bg-sand-50 px-4 text-[13.5px] font-semibold text-ink-800 ring-1 ring-inset ring-ink-200 hover:bg-white disabled:opacity-50">
                      <Undo2 aria-hidden="true" className="h-4 w-4" /> Letzten Punkt löschen
                    </button>
                    <button type="button" onClick={alleLoeschen} disabled={!punkte.length} className="inline-flex h-11 items-center gap-1.5 rounded-full bg-sand-50 px-4 text-[13.5px] font-semibold text-ink-800 ring-1 ring-inset ring-ink-200 hover:bg-white disabled:opacity-50">
                      <Trash2 aria-hidden="true" className="h-4 w-4" /> Neu beginnen
                    </button>
                  </div>
                  <p className="flex items-start gap-2 text-[13px] leading-relaxed text-ink-600">
                    <Keyboard aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-ink-500" />
                    <span>
                      Adresse suchen, dann die Dachecken der Reihe nach anklicken. Punkte lassen sich ziehen, Doppelklick löscht einen Punkt. Per Tastatur: Karte fokussieren, Pfeiltasten verschieben, <kbd className="rounded bg-ink-100 px-1.5 font-sans text-[12px]">Enter</kbd> setzt einen Punkt im Fadenkreuz, <kbd className="rounded bg-ink-100 px-1.5 font-sans text-[12px]">⌫</kbd> löscht den letzten.
                    </span>
                  </p>
                  <p aria-live="polite" className="text-[14px] font-semibold text-ink-800">
                    {punkte.length === 0 ? "Noch kein Eckpunkt gesetzt." : punkte.length < 3 ? `${punkte.length} von mindestens 3 Eckpunkten gesetzt.` : `${punkte.length} Eckpunkte · Umfang ≈ ${fmt(Math.round(umfang))} m`}
                  </p>
                </div>
              ) : (
                <div className="mt-5 space-y-5">
                  <div className="grid gap-4 sm:grid-cols-2">
                    {[
                      ["laenge", "Länge des Dachs", laenge, setLaenge],
                      ["breite", "Breite des Dachs", breite, setBreite],
                    ].map(([k, label, wert, setzen]) => (
                      <div key={k}>
                        <label htmlFor={`${id}-${k}`} className="mb-1.5 block text-[14.5px] font-semibold text-ink-800">
                          {label}
                        </label>
                        <div className="relative">
                          <input
                            id={`${id}-${k}`}
                            type="number"
                            inputMode="decimal"
                            min={1}
                            max={1000}
                            step={1}
                            value={wert}
                            onChange={(e) => setzen(Math.min(1000, Math.max(0, Number(e.target.value) || 0)))}
                            className="ov-num h-12 w-full rounded-xl bg-sand-50 px-4 pr-12 text-[16px] font-semibold text-ink-900 outline-none ring-1 ring-inset ring-ink-200 focus:ring-2 focus:ring-ov-500"
                          />
                          <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-[14px] text-ink-500">m</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="flex items-start gap-2 text-[13px] leading-relaxed text-ink-600">
                    <Ruler aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-ink-500" />
                    <span>Außenmaße der Dachfläche in Metern (Grundriss). Bei mehreren Hallen oder L-Formen die Teilflächen addieren oder auf dem Orthofoto einzeichnen.</span>
                  </p>
                  <p aria-live="polite" className="text-[14px] font-semibold text-ink-800">
                    {brutto > 0 ? `Grundriss ${fmt(laenge)} × ${fmt(breite)} m erfasst.` : "Bitte Länge und Breite eingeben."}
                  </p>
                </div>
              )}

              <div className="mt-7 space-y-5 border-t border-ink-100 pt-6">
                <Gruppe titel="Abzüge und Belegung (offengelegt)">
                  <Regler label="Randabzug" wert={randPct} min={DACH_ABZUEGE.rand.min} max={DACH_ABZUEGE.rand.max} step={1} einheit="%" onChange={setRandPct} hinweis="Randstreifen für Brandschutz und Wartung (OVE R 11-1, projektabhängig) sowie Attika-Verschattung. Standard 10 %, Richtwert." />
                  <Regler label="Hindernisabzug" wert={hindernisPct} min={DACH_ABZUEGE.hindernisse.min} max={DACH_ABZUEGE.hindernisse.max} step={1} einheit="%" onChange={setHindernisPct} hinweis="Lichtkuppeln, RWA, Lüftungsgeräte, Kamine, Wartungswege. Standard 15 % der Restfläche, Richtwert." />
                  <Auswahl legende="Dachart / Belegung" wert={dachart} onChange={setDachart} spalten={2} klein optionen={GEWERBE_PV.dacharten.map((x) => ({ id: x.id, label: x.label, sub: `${x.sub} · ${fmt(x.qmProKwp)} m²/kWp` }))} />
                  <p className="text-[12.5px] leading-relaxed text-ink-500">
                    Standard {fmt(QM_PRO_KWP_STANDARD)} m² je kWp für aufgeständerte Ost-West-Anlagen auf dem Flachdach (Annahme Ökovolt Österreich, wie im Gewerbe-PV-Rechner, Stand {DACH_ABZUEGE.stand}). Alle Werte sind Richtwerte/Orientierung – die Belegungsplanung ersetzt kein Aufmaß.
                  </p>
                </Gruppe>
              </div>
            </div>

            {/* ---------------- Rechts: Datenblatt (gegated) ---------------- */}
            <aside className="dz-druck bg-sand-50 p-5 sm:p-6 md:p-8 lg:border-l lg:border-ink-100" aria-label="Dach-Datenblatt">
              {!fertig ? (
                <div className="dz-nicht-drucken">
                  <p className="text-[11.5px] font-semibold uppercase tracking-[0.16em] text-ink-500">Datenblatt</p>
                  <p className="mt-3 text-[14.5px] leading-relaxed text-ink-700">{modus === "karte" ? "Sobald mindestens drei Eckpunkte gesetzt sind, lässt sich das Datenblatt mit Nutzfläche und Anlagenleistung freischalten." : "Sobald Länge und Breite eingetragen sind, lässt sich das Datenblatt mit Nutzfläche und Anlagenleistung freischalten."}</p>
                  <Vorschau />
                </div>
              ) : !frei ? (
                <div className="dz-nicht-drucken">
                  <p className="text-[11.5px] font-semibold uppercase tracking-[0.16em] text-ink-500">Datenblatt</p>
                  <h3 className="mt-2 font-display text-[20px] font-extrabold leading-tight text-ink-900">Dach erfasst – Auswertung freischalten</h3>
                  <p className="mt-2 text-[14px] leading-relaxed text-ink-600">Nutzfläche nach Abzügen, Anlagenleistung, Übergabe in den Gewerbe-PV-Rechner und Download als Datenblatt – nach Bestätigung Ihrer E-Mail-Adresse.</p>
                  <Button type="button" onClick={() => setGateOffen(true)} icon={Lock} className="mt-5 w-full">
                    Auswertung freischalten
                  </Button>
                  <Vorschau />
                </div>
              ) : (
                <div>
                  <p className="text-[11.5px] font-semibold uppercase tracking-[0.16em] text-ov-700">Ihr Dach-Datenblatt</p>
                  <div className="mt-3 grid grid-cols-2 gap-3">
                    <div className="rounded-2xl bg-white p-4 ring-1 ring-ink-200/70">
                      <p className="text-[12px] font-semibold text-ink-500">Nutzfläche</p>
                      <p className="ov-num mt-1 font-display text-[24px] font-extrabold tracking-tight text-ink-900">
                        {fmt(runde10(netto.netto))} <span className="text-[14px] font-semibold text-ink-500">m²</span>
                      </p>
                    </div>
                    <div className="rounded-2xl bg-navy-800 p-4 text-white">
                      <p className="text-[12px] font-semibold text-white/70">Anlagenleistung</p>
                      <p className="ov-num mt-1 font-display text-[24px] font-extrabold tracking-tight">
                        ≈ {fmt(Math.round(kwp))} <span className="text-[14px] font-semibold text-white/70">kWp</span>
                      </p>
                    </div>
                  </div>
                  <dl className="mt-4 divide-y divide-ink-200/70 text-[13.5px]">
                    {datenblattZeilen().map(([k, v, h]) => (
                      <div key={k} className="grid grid-cols-[1fr_auto] gap-x-3 py-2.5">
                        <dt className="text-ink-600">
                          {k}
                          {h && <span className="block text-[12px] text-ink-500">{h}</span>}
                        </dt>
                        <dd className="ov-num text-right font-semibold text-ink-900">{v}</dd>
                      </div>
                    ))}
                  </dl>
                  {hatOrte && (
                    <div className="dz-nicht-drucken mt-4">
                      <label htmlFor={`${id}-ort`} className="mb-1.5 block text-[13.5px] font-semibold text-ink-800">
                        Standort für den Rechner
                      </label>
                      <select id={`${id}-ort`} value={ortSlug} onChange={(e) => setOrtManuell(e.target.value)} className="h-11 w-full rounded-xl bg-white px-3 text-[14.5px] text-ink-900 outline-none ring-1 ring-inset ring-ink-200 focus:ring-2 focus:ring-ov-500">
                        {orteSortiert.map((o) => (
                          <option key={o.slug} value={o.slug}>
                            {o.name}
                            {o.landName ? ` (${o.landName})` : ""}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  <div className="dz-nicht-drucken mt-5 flex flex-col gap-2.5">
                    {/* Volle Navigation (kein next/link): der Rechner liest ?flaeche= beim Laden der Seite */}
                    <a href={uebergabeHref} onClick={() => ereignis("dach_uebergabe", { ziel: "gewerbe-pv" })} className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-ov-600 px-6 py-3 text-center text-[15px] leading-snug font-semibold text-white shadow-[0_8px_24px_-8px_rgba(102,153,51,0.65)] transition-all hover:bg-ov-700">
                      Im Gewerbe-PV-Rechner weiterrechnen <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </a>
                    <Button href={angebotHref} variant="secondary" onClick={() => ereignis("dach_uebergabe", { ziel: "angebot" })}>
                      Angebot für ≈ {fmt(Math.round(kwp))} kWp anfragen
                    </Button>
                    <div className="grid grid-cols-2 gap-2.5">
                      <button type="button" onClick={csvLaden} className="inline-flex h-11 items-center justify-center gap-1.5 rounded-full bg-white px-4 text-[13.5px] font-semibold text-ink-800 ring-1 ring-inset ring-ink-200 hover:bg-ink-50">
                        <Download aria-hidden="true" className="h-4 w-4" /> CSV
                      </button>
                      <button type="button" onClick={drucken} className="inline-flex h-11 items-center justify-center gap-1.5 rounded-full bg-white px-4 text-[13.5px] font-semibold text-ink-800 ring-1 ring-inset ring-ink-200 hover:bg-ink-50">
                        <Printer aria-hidden="true" className="h-4 w-4" /> Drucken / PDF
                      </button>
                    </div>
                  </div>
                  <p className="mt-4 text-[12px] leading-relaxed text-ink-500">
                    Richtwerte/Orientierung aus der Grundrissfläche; geneigte Dächer sind real um 1/cos(Neigung) größer. Statik, Brandschutz (OVE R 11-1) und Belegung prüfen wir vor Ort. Angaben Ökovolt Österreich · Stand {DACH_ABZUEGE.stand} · Orthofoto: basemap.at (CC BY 4.0).
                  </p>
                </div>
              )}
            </aside>
          </div>
          <div className="dz-nicht-drucken border-t border-ink-100 px-5 py-3 text-[12px] leading-relaxed text-ink-500 sm:px-6 md:px-8">
            Beim Laden der Karte werden Kartenkacheln von basemap.at (Geoland-Server) abgerufen, dabei wird Ihre IP-Adresse übertragen; die Adresssuche läuft über unseren Server bei OpenStreetMap Nominatim. Details in der{" "}
            <Link href="/datenschutz" className="underline underline-offset-2 hover:text-ink-800">
              Datenschutzerklärung
            </Link>
            .
          </div>
        </div>
      )}

      {gateOffen && (
        <DachGate
          aktion="auswertung"
          kennung={GATE_KENNUNG}
          zusammenfassung={zusammenfassung}
          onSchliessen={() => setGateOffen(false)}
          onFrei={() => {
            freischalten();
            setGateOffen(false);
          }}
        />
      )}
    </section>
  );
}

/** Vorschau vor dem Gate: Beispielwerte, klar gekennzeichnet. */
function Vorschau() {
  const n = nutzflaeche(BEISPIEL.brutto, { randPct: BEISPIEL.randPct, hindernisPct: BEISPIEL.hindernisPct });
  const k = kwpAusNutzflaeche(n.netto, dachartVon(BEISPIEL.dachart).qmProKwp);
  return (
    <div className="mt-5 rounded-2xl border border-dashed border-ink-300 bg-white/70 p-4" aria-label="Beispiel-Datenblatt">
      <p className="text-[11.5px] font-semibold uppercase tracking-[0.16em] text-ink-500">So sieht das Datenblatt aus – Beispiel</p>
      <dl className="mt-2 divide-y divide-ink-200/70 text-[13px] text-ink-600">
        {[
          ["Bruttofläche (Beispiel)", `${fmt(BEISPIEL.brutto)} m²`],
          [`Rand ${BEISPIEL.randPct} % · Hindernisse ${BEISPIEL.hindernisPct} %`, `− ${fmt(n.rand + n.hindernisse)} m²`],
          ["Nutzfläche (Beispiel)", `${fmt(n.netto)} m²`],
          ["Leistung Ost-West, 7 m²/kWp (Beispiel)", `≈ ${fmt(Math.round(k))} kWp`],
        ].map(([a, b]) => (
          <div key={a} className="flex justify-between gap-3 py-2">
            <dt>{a}</dt>
            <dd className="ov-num font-semibold text-ink-700">{b}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-2 text-[12px] text-ink-500">Beispielwerte, keine Messung Ihres Dachs. Dazu kommen Übergabe in den Rechner, Angebotslink, CSV und Druck.</p>
    </div>
  );
}

/** Teaser für Zielgruppenseiten: siehe DachZeichnenTeaser.js (Server-Komponente, lädt nichts nach). */

const DRUCK_CSS = `
@media print {
  body * { visibility: hidden !important; }
  .dz-druck, .dz-druck * { visibility: visible !important; }
  .dz-druck { position: absolute; left: 0; top: 0; width: 100%; background: #fff !important; }
  .dz-nicht-drucken { display: none !important; }
}`;
