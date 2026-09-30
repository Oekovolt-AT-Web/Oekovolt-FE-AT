"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { AlertTriangle, ArrowRight, CalendarDays, Crosshair, Info, Loader2, MapPin, Search, Sparkles, Sun, Zap } from "lucide-react";
import { cn } from "@/components/ui/cn";
import { Auswahl, Gruppe, Regler } from "@/components/Rechner/bausteine";
import PrognoseDiagramm from "./PrognoseDiagramm";
import { ANNAHMEN, prognoseRechnen } from "@/lib/prognose/modell";
import { goldeneStunden, imRahmen, tagesSummen, zelle } from "@/lib/prognose/auswertung";
import { intervall, tagKurz, uhrzeit, wienZeit, zahl } from "@/lib/prognose/format";

const AUSRICHTUNGEN = [
  { id: "-90", label: "Ost" },
  { id: "-45", label: "Südost" },
  { id: "0", label: "Süd" },
  { id: "45", label: "Südwest" },
  { id: "90", label: "West" },
  { id: "ost-west", label: "Ost-West" },
];

const MONTAGEN = [
  { id: "frei", label: "Freifläche", sub: "gut belüftet" },
  { id: "aufdach", label: "Aufdach", sub: "Flach-/Schrägdach" },
  { id: "integriert", label: "Indach", sub: "wenig belüftet" },
];

// Kachelraster ohne verwaiste Einzelkarte (Tailwind braucht ausgeschriebene Klassen)
const SPALTEN = { 1: "", 2: "sm:grid-cols-2", 3: "sm:grid-cols-3", 4: "sm:grid-cols-2 xl:grid-cols-4" };

const KWP_VORSCHLAEGE = [30, 100, 250, 500, 1000];
const BEISPIEL = { lat: 48.05, lon: 12.83, label: "Ostermiething (Ortsmitte, Beispiel)" };

/** Dezimalzahl aus Eingabe mit Komma oder Punkt. */
const lesen = (s) => Number(String(s).trim().replace(/\s/g, "").replace(",", "."));

export default function PvPrognose() {
  // Standort
  const [modus, setModus] = useState("adresse");
  const [suche, setSuche] = useState("");
  const [sucheLaeuft, setSucheLaeuft] = useState(false);
  const [sucheFehler, setSucheFehler] = useState("");
  const [treffer, setTreffer] = useState([]);
  const [latText, setLatText] = useState("");
  const [lonText, setLonText] = useState("");
  const [punkt, setPunkt] = useState(null);

  // Anlage
  const [kwpText, setKwpText] = useState("100");
  const [neigung, setNeigung] = useState(15);
  const [ausrichtung, setAusrichtung] = useState("0");
  const [montage, setMontage] = useState("aufdach");
  const [verluste, setVerluste] = useState(Math.round(ANNAHMEN.verluste * 100));
  const [modell, setModell] = useState(ANNAHMEN.modell);

  // Daten
  const [daten, setDaten] = useState(null);
  const [laedt, setLaedt] = useState(false);
  const [fehler, setFehler] = useState("");
  const [jetzt, setJetzt] = useState(0);
  const abbruch = useRef(null);
  const ergebnisRef = useRef(null);

  const kwp = Math.min(Math.max(lesen(kwpText) || 0, 0), 100000);

  /* ---------- Wetterdaten je Rasterzelle (kWp, Neigung usw. lösen KEINEN Abruf aus) ---------- */
  useEffect(() => {
    if (!punkt) return;
    const z = zelle(punkt.lat, punkt.lon);
    abbruch.current?.abort();
    const ctrl = new AbortController();
    abbruch.current = ctrl;
    setLaedt(true);
    setFehler("");
    fetch(`/api/pv-prognose?${new URLSearchParams({ lat: String(z.lat), lon: String(z.lon) })}`, { signal: ctrl.signal })
      .then(async (res) => {
        const json = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(json.error || "Die Prognose konnte nicht geladen werden.");
        setDaten(json);
        setJetzt(Date.now());
        // Mobil stehen die Eingaben über dem Ergebnis – dorthin scrollen
        if (window.innerWidth < 1024 && ergebnisRef.current) {
          const sanft = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
          requestAnimationFrame(() => ergebnisRef.current?.scrollIntoView({ behavior: sanft ? "smooth" : "auto", block: "start" }));
        }
      })
      .catch((e) => {
        if (e.name === "AbortError") return;
        setDaten(null);
        setFehler(e.message);
      })
      .finally(() => {
        if (abbruch.current === ctrl) setLaedt(false);
      });
    return () => ctrl.abort();
  }, [punkt]);

  /* ---------- Rechnung im Browser ---------- */
  const anlage = useMemo(
    () => ({ kwp, neigung, azimut: ausrichtung === "ost-west" ? "ost-west" : Number(ausrichtung), montage, verluste: verluste / 100, modell }),
    [kwp, neigung, ausrichtung, montage, verluste, modell]
  );

  const ergebnis = useMemo(() => {
    if (!daten?.stunden?.length || !punkt || !(kwp > 0)) return null;
    const stunden = prognoseRechnen({ stunden: daten.stunden, lat: punkt.lat, lon: punkt.lon, anlage });
    const preise = new Map((daten.preise?.punkte || []).map((p) => [p.t, p.eurMwh]));
    // Angeschnittene Tage ohne Sonnenstunden (z. B. Abruf spät am Abend) nicht als eigene Kachel zeigen
    const tage = tagesSummen(stunden).filter((t) => t.spitzeKw > 0 || t.stunden >= 20);
    const sichtbar = new Set(tage.map((t) => t.datum));
    const gold = goldeneStunden({ stunden, preise: daten.preise?.punkte || [], anzahl: 3, mindestAnteil: 0.6, mindestKw: kwp * 0.03 }).filter((g) => sichtbar.has(g.datum));
    const goldSet = new Set(gold.flatMap((g) => g.stunden.map((s) => s.beginn)));
    return { stunden, preise, tage, gold, goldSet };
  }, [daten, punkt, anlage, kwp]);

  /* ---------- Adresssuche (vorhandene Route /api/standort, nur auf Knopfdruck) ---------- */
  async function suchen(e) {
    e.preventDefault();
    const q = suche.trim();
    if (q.length < 3) {
      setSucheFehler("Bitte geben Sie mindestens drei Zeichen ein, z. B. Straße, Hausnummer und Ort.");
      return;
    }
    setSucheLaeuft(true);
    setSucheFehler("");
    setTreffer([]);
    try {
      const res = await fetch(`/api/standort?${new URLSearchParams({ q })}`);
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || "Die Suche ist fehlgeschlagen.");
      const liste = json.treffer || [];
      if (liste.length === 0) setSucheFehler("Keine Adresse in Österreich gefunden. Prüfen Sie die Schreibweise oder geben Sie Koordinaten ein.");
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
    setPunkt({ lat: t.lat, lon: t.lon, label: t.label });
  }

  function koordinateUebernehmen(e) {
    e.preventDefault();
    const lat = lesen(latText);
    const lon = lesen(lonText);
    if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
      setSucheFehler("Bitte geben Sie Breite und Länge als Dezimalzahl ein, z. B. 48,05 und 12,83.");
      return;
    }
    if (!imRahmen(lat, lon)) {
      setSucheFehler("Der Punkt liegt außerhalb Österreichs. Breite etwa 46,4 bis 49,0 · Länge etwa 9,5 bis 17,2.");
      return;
    }
    setSucheFehler("");
    setPunkt({ lat, lon, label: `${zahl(lat, 4)}° N, ${zahl(lon, 4)}° O` });
  }

  function gps() {
    if (!navigator.geolocation) {
      setSucheFehler("Ihr Browser unterstützt keine Standortbestimmung.");
      return;
    }
    setSucheFehler("");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude: lat, longitude: lon } = pos.coords;
        if (!imRahmen(lat, lon)) {
          setSucheFehler("Ihr aktueller Standort liegt außerhalb Österreichs.");
          return;
        }
        setPunkt({ lat, lon, label: "Aktueller Standort" });
      },
      () => setSucheFehler("Der Standort konnte nicht ermittelt werden. Bitte suchen Sie die Adresse oder geben Sie Koordinaten ein.")
    );
  }

  const heute = jetzt ? wienZeit(jetzt).datum : null;
  const morgen = jetzt ? wienZeit(jetzt + 86400000).datum : null;
  const uebermorgen = jetzt ? wienZeit(jetzt + 2 * 86400000).datum : null;
  const tagName = (datum) => (datum === heute ? "Heute" : datum === morgen ? "Morgen" : datum === uebermorgen ? "Übermorgen" : "");

  const laufText = daten?.lauf?.nwp ? `${tagKurz(Date.parse(daten.lauf.nwp))}, ${uhrzeit(Date.parse(daten.lauf.nwp))}` : null;

  return (
    <div className="overflow-hidden rounded-[2rem] bg-white shadow-2xl ring-1 ring-ink-200/70">
      <div className="grid lg:grid-cols-[minmax(0,400px)_1fr]">
        {/* ================= Eingaben ================= */}
        <div className="relative border-b border-ink-100 bg-sand-50 p-5 sm:p-6 md:p-8 lg:border-b-0 lg:border-r">
          <div className="space-y-8">
            <Gruppe titel="1 · Standort">
              <div role="group" aria-label="Eingabeart wählen" className="inline-flex rounded-full bg-ink-100 p-1">
                {[
                  { v: "adresse", l: "Adresse" },
                  { v: "koordinate", l: "Koordinaten" },
                ].map((o) => (
                  <button
                    key={o.v}
                    type="button"
                    aria-pressed={modus === o.v}
                    onClick={() => {
                      setModus(o.v);
                      setSucheFehler("");
                    }}
                    className={cn(
                      "min-h-10 rounded-full px-4 text-[14px] font-semibold transition-all duration-300",
                      modus === o.v ? "bg-white text-ink-900 shadow-md" : "text-ink-600 hover:text-ink-800"
                    )}
                  >
                    {o.l}
                  </button>
                ))}
              </div>

              {modus === "adresse" ? (
                <form onSubmit={suchen} role="search" aria-label="Adresse in Österreich suchen">
                  <label htmlFor="prognose-suche" className="mb-2 block text-[14.5px] font-semibold text-ink-800">
                    Adresse in Österreich
                  </label>
                  <div className="flex gap-2">
                    <input
                      id="prognose-suche"
                      type="search"
                      value={suche}
                      onChange={(e) => setSuche(e.target.value)}
                      placeholder="z. B. Gewerbestraße 1, Wels"
                      autoComplete="street-address"
                      className="min-h-12 w-full min-w-0 rounded-xl bg-white px-4 text-[16px] text-ink-900 outline-none ring-1 ring-ink-200 placeholder:text-ink-400 focus:ring-2 focus:ring-ov-500"
                    />
                    <button
                      type="submit"
                      disabled={sucheLaeuft}
                      className="flex min-h-12 shrink-0 items-center gap-2 rounded-xl bg-ov-600 px-4 text-[15px] font-semibold text-white transition-colors hover:bg-ov-700 disabled:opacity-60"
                    >
                      {sucheLaeuft ? <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" /> : <Search aria-hidden="true" className="h-4 w-4" />}
                      Suchen
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={koordinateUebernehmen} aria-label="Koordinaten eingeben" className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label htmlFor="prognose-lat" className="mb-1.5 block text-[14px] font-semibold text-ink-800">
                        Breite (° N)
                      </label>
                      <input
                        id="prognose-lat"
                        inputMode="decimal"
                        value={latText}
                        onChange={(e) => setLatText(e.target.value)}
                        placeholder="48,05"
                        className="min-h-12 w-full min-w-0 rounded-xl bg-white px-4 text-[16px] text-ink-900 outline-none ring-1 ring-ink-200 placeholder:text-ink-400 focus:ring-2 focus:ring-ov-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="prognose-lon" className="mb-1.5 block text-[14px] font-semibold text-ink-800">
                        Länge (° O)
                      </label>
                      <input
                        id="prognose-lon"
                        inputMode="decimal"
                        value={lonText}
                        onChange={(e) => setLonText(e.target.value)}
                        placeholder="12,83"
                        className="min-h-12 w-full min-w-0 rounded-xl bg-white px-4 text-[16px] text-ink-900 outline-none ring-1 ring-ink-200 placeholder:text-ink-400 focus:ring-2 focus:ring-ov-500"
                      />
                    </div>
                  </div>
                  <button type="submit" className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-ov-600 px-4 text-[15px] font-semibold text-white transition-colors hover:bg-ov-700">
                    <MapPin aria-hidden="true" className="h-4 w-4" /> Prognose für diesen Punkt
                  </button>
                </form>
              )}

              <div className="flex flex-wrap gap-x-5 gap-y-2">
                <button type="button" onClick={gps} className="inline-flex min-h-10 items-center gap-2 text-[14px] font-semibold text-ov-700 hover:text-ov-800">
                  <Crosshair aria-hidden="true" className="h-4 w-4" /> Aktueller Standort
                </button>
                <button type="button" onClick={() => setPunkt(BEISPIEL)} className="inline-flex min-h-10 items-center gap-2 text-[14px] font-semibold text-ov-700 hover:text-ov-800">
                  <Sparkles aria-hidden="true" className="h-4 w-4" /> Beispiel Ostermiething
                </button>
              </div>

              {sucheFehler && (
                <p role="alert" className="rounded-xl bg-red-50 px-3.5 py-2.5 text-[13.5px] text-red-800 ring-1 ring-red-200">
                  {sucheFehler}
                </p>
              )}
              {treffer.length > 0 && (
                <ul className="divide-y divide-ink-100 overflow-hidden rounded-2xl bg-white ring-1 ring-ink-200" aria-label="Suchergebnisse">
                  {treffer.map((t) => (
                    <li key={`${t.lat},${t.lon}`}>
                      <button type="button" onClick={() => waehle(t)} className="flex w-full items-start gap-2.5 px-4 py-3 text-left text-[14px] text-ink-800 transition-colors hover:bg-ov-50">
                        <MapPin aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-ov-600" />
                        <span className="min-w-0">
                          <span className="block font-semibold">{t.label}</span>
                          <span className="block truncate text-[12px] text-ink-500">{t.voll}</span>
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              {modus === "adresse" && <p className="text-[11.5px] text-ink-500">Adresssuche: © OpenStreetMap-Mitwirkende (Nominatim)</p>}
            </Gruppe>

            <Gruppe titel="2 · Anlage">
              <div>
                <label htmlFor="prognose-kwp" className="mb-2 block text-[14.5px] font-semibold text-ink-800">
                  Anlagenleistung (kWp)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    id="prognose-kwp"
                    inputMode="decimal"
                    value={kwpText}
                    onChange={(e) => setKwpText(e.target.value)}
                    aria-describedby="prognose-kwp-hinweis"
                    className="ov-num min-h-12 w-32 rounded-xl bg-white px-4 font-display text-[18px] font-bold text-ink-900 outline-none ring-1 ring-ink-200 focus:ring-2 focus:ring-ov-500"
                  />
                  <span className="text-[14px] text-ink-500">kWp</span>
                </div>
                <div className="mt-2.5 flex flex-wrap gap-1.5" role="group" aria-label="Schnellauswahl Anlagenleistung">
                  {KWP_VORSCHLAEGE.map((v) => (
                    <button
                      key={v}
                      type="button"
                      aria-pressed={kwp === v}
                      onClick={() => setKwpText(String(v))}
                      className={cn(
                        "min-h-9 rounded-full px-3 text-[13px] font-semibold ring-1 transition-colors",
                        kwp === v ? "bg-ov-600 text-white ring-ov-600" : "bg-white text-ink-700 ring-ink-200 hover:ring-ov-400"
                      )}
                    >
                      {zahl(v)}
                    </button>
                  ))}
                </div>
                <p id="prognose-kwp-hinweis" className="mt-2 text-[12.5px] text-ink-500">
                  {kwp > 0 ? "Modulleistung laut Datenblatt (Summe aller Module)." : "Bitte eine Leistung größer als 0 eingeben."}
                </p>
              </div>
              <Regler label="Neigung" wert={neigung} min={0} max={90} step={1} format={(v) => `${v}°`} onChange={setNeigung} hinweis="Flachdach mit Aufständerung meist 10–15°, Schrägdach 20–35°, Fassade 90°." />
              <Auswahl legende="Ausrichtung" wert={ausrichtung} onChange={setAusrichtung} optionen={AUSRICHTUNGEN} spalten={3} klein />
              <Auswahl legende="Montage (Modultemperatur)" wert={montage} onChange={setMontage} optionen={MONTAGEN} klein />
              <details className="group rounded-2xl bg-white p-4 ring-1 ring-ink-200">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-[14px] font-semibold text-ink-800">
                  Modell & Verluste
                  <span aria-hidden="true" className="text-ink-400 transition-transform group-open:rotate-45">+</span>
                </summary>
                <div className="mt-4 space-y-5">
                  <Regler label="Systemverluste" wert={verluste} min={5} max={25} step={1} format={(v) => `${v} %`} onChange={setVerluste} hinweis="Kabel, Wechselrichter, Verschmutzung, Mismatch. PVGIS rechnet standardmäßig mit 14 %." />
                  <Auswahl
                    legende="Transposition"
                    wert={modell}
                    onChange={setModell}
                    optionen={[
                      { id: "hay-davies", label: "Hay-Davies", sub: "mit Zirkumsolar" },
                      { id: "isotrop", label: "Isotrop", sub: "Liu-Jordan" },
                    ]}
                    klein
                  />
                </div>
              </details>
            </Gruppe>
          </div>
        </div>

        {/* ================= Ergebnis ================= */}
        <div ref={ergebnisRef} className="min-w-0 scroll-mt-24 p-5 sm:p-6 md:p-8" aria-busy={laedt}>
          <p className="sr-only" role="status" aria-live="polite">
            {laedt ? "Prognose wird geladen." : ergebnis ? `Prognose für ${punkt?.label || "den Standort"} geladen.` : ""}
          </p>

          {!punkt && !laedt && (
            <div className="flex h-full min-h-[360px] flex-col items-center justify-center rounded-3xl bg-sand-50 p-8 text-center ring-1 ring-ink-200/60">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-sun-500 shadow-md ring-1 ring-ink-200">
                <Sun aria-hidden="true" className="h-7 w-7" />
              </span>
              <p className="mt-5 font-display text-[20px] font-bold text-ink-900">Wie viel Sonnenstrom liefert Ihre Anlage in den nächsten Tagen?</p>
              <p className="mt-2 max-w-md text-[14.5px] leading-relaxed text-ink-600">
                Adresse suchen oder Koordinaten eingeben – die Prognose rechnet Stunde für Stunde mit der aktuellen Wettervorhersage von GeoSphere Austria.
              </p>
              <button
                type="button"
                onClick={() => setPunkt(BEISPIEL)}
                className="mt-6 inline-flex min-h-12 items-center gap-2 rounded-full bg-ink-900 px-6 text-[15px] font-semibold text-white transition-colors hover:bg-ink-800"
              >
                Beispiel ansehen <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </button>
            </div>
          )}

          {laedt && (
            <div className="flex min-h-[360px] items-center justify-center gap-3 text-[15px] text-ink-600">
              <Loader2 aria-hidden="true" className="h-5 w-5 animate-spin text-ov-600" /> Wettervorhersage wird geladen …
            </div>
          )}

          {!laedt && fehler && (
            <div role="alert" className="flex gap-3 rounded-2xl bg-red-50 p-5 text-[14.5px] leading-relaxed text-red-900 ring-1 ring-red-200">
              <AlertTriangle aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0" />
              <p>{fehler}</p>
            </div>
          )}

          {!laedt && ergebnis && (
            <div className="space-y-7">
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div className="min-w-0">
                  <p className="text-[12.5px] font-semibold uppercase tracking-[0.16em] text-ov-700">Stündliche PV-Prognose · {zahl(kwp, kwp < 10 ? 1 : 0)} kWp</p>
                  <h3 className="mt-1.5 flex items-start gap-2 font-display text-[21px] font-bold leading-snug text-ink-900">
                    <MapPin aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 text-ov-600" />
                    <span className="min-w-0 break-words">{punkt.label}</span>
                  </h3>
                  <p className="mt-1 text-[12.5px] text-ink-500">
                    Rasterzelle {zahl(daten.zelle.lat, 3)}° N / {zahl(daten.zelle.lon, 3)}° O (0,05°){laufText ? ` · Modelllauf ${laufText}` : ""}
                    {daten.herkunft === "veraltet" ? " · älterer Lauf aus dem Zwischenspeicher" : ""}
                  </p>
                </div>
                <p className="inline-flex shrink-0 items-center gap-1.5 self-start rounded-full bg-sun-300/40 px-3 py-1.5 text-[12.5px] font-bold text-ink-900 ring-1 ring-sun-500/60">
                  <AlertTriangle aria-hidden="true" className="h-3.5 w-3.5" /> Prognose ohne Gewähr
                </p>
              </div>

              {/* Tageswerte */}
              <dl className={cn("grid grid-cols-1 gap-3", SPALTEN[ergebnis.tage.length] || "sm:grid-cols-3")}>
                {ergebnis.tage.map((t, i) => (
                  <div key={t.datum} className={cn("rounded-2xl p-4 md:p-5", i === 0 ? "bg-navy-950 text-white" : "bg-sand-50 ring-1 ring-ink-200/60")}>
                    <dt className={cn("flex items-center gap-1.5 text-[12.5px] font-medium", i === 0 ? "text-white/75" : "text-ink-500")}>
                      <CalendarDays aria-hidden="true" className={cn("h-3.5 w-3.5", i === 0 ? "text-ov-300" : "text-ov-600")} />
                      {tagName(t.datum) ? `${tagName(t.datum)}, ` : ""}
                      {tagKurz(t.ersteStunde)}
                    </dt>
                    <dd className="ov-num mt-1 whitespace-nowrap font-display text-[clamp(1.4rem,1.15rem+0.7vw,1.85rem)] font-extrabold leading-tight tracking-tight">
                      {zahl(t.kwh, t.kwh < 100 ? 1 : 0)} kWh
                    </dd>
                    <dd className={cn("mt-1 text-[12.5px] leading-snug", i === 0 ? "text-white/70" : "text-ink-500")}>
                      {t.kwhP10 != null ? `Spanne ${zahl(t.kwhP10, t.kwhP10 < 100 ? 1 : 0)}–${zahl(t.kwhP90, t.kwhP90 < 100 ? 1 : 0)} kWh · ` : ""}
                      {zahl(t.kwh / kwp, 2)} kWh/kWp
                      {wienZeit(t.ersteStunde).stunde > 0 ? ` · ab ${uhrzeit(t.ersteStunde)}` : ""}
                      {wienZeit(t.letzteStunde).stunde < 23 ? ` · bis ${wienZeit(t.letzteStunde).stunde + 1} Uhr` : ""}
                    </dd>
                  </div>
                ))}
              </dl>

              <PrognoseDiagramm stunden={ergebnis.stunden} preise={ergebnis.preise} gold={ergebnis.goldSet} jetzt={jetzt} />

              {/* Goldene Stunden */}
              <section aria-labelledby="gold-titel" className="rounded-3xl bg-gradient-to-br from-sun-300/25 via-white to-white p-5 ring-1 ring-sun-500/40 md:p-6">
                <h4 id="gold-titel" className="flex items-center gap-2 font-display text-[18px] font-bold text-ink-900">
                  <Zap aria-hidden="true" className="h-5 w-5 text-sun-500" /> Goldene Stunden
                </h4>
                <p className="mt-1.5 max-w-2xl text-[13.5px] leading-relaxed text-ink-600">
                  Stunden mit mindestens 60 % der Tagesspitze an Sonnenstrom – daraus die drei mit dem niedrigsten Börsenpreis. Dann bringt Einspeisen am wenigsten und selbst Verbrauchen am meisten: Kühlung,
                  Druckluft, Ladepunkte, Wärmepumpe oder Speicher jetzt einplanen.
                </p>
                <ul className={cn("mt-4 grid gap-3", SPALTEN[ergebnis.gold.length] || "sm:grid-cols-3")}>
                  {ergebnis.gold.map((g) => (
                    <li key={g.datum} className="rounded-2xl bg-white p-4 ring-1 ring-ink-200/70">
                      <p className="text-[13px] font-semibold text-ink-900">
                        {tagName(g.datum) ? `${tagName(g.datum)}, ` : ""}
                        {tagKurz(Date.parse(`${g.datum}T12:00:00Z`))}
                      </p>
                      {g.stunden.length ? (
                        <ul className="mt-2 space-y-1.5">
                          {g.stunden.map((s) => (
                            <li key={s.beginn} className="flex items-baseline justify-between gap-3 text-[13.5px]">
                              <span className="font-semibold text-ink-800">{intervall(s.beginn, s.ende)}</span>
                              <span className="ov-num text-right text-ink-600">
                                {zahl(s.kw, s.kw < 10 ? 1 : 0)} kW
                                {Number.isFinite(s.eurMwh) && (
                                  <span className={cn("ml-2", s.eurMwh < 0 ? "font-semibold text-ov-700" : "text-navy-600")}>{zahl(s.eurMwh / 10, 1)} ct</span>
                                )}
                              </span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="mt-2 text-[13px] text-ink-500">Kaum Sonnenstrom erwartet.</p>
                      )}
                      {g.stunden.length > 0 && !g.mitPreis && <p className="mt-2 text-[12px] text-ink-500">Börsenpreis noch nicht veröffentlicht – Auswahl nur nach Sonnenstrom.</p>}
                    </li>
                  ))}
                </ul>
              </section>

              {/* Tabelle */}
              <details className="group rounded-2xl ring-1 ring-ink-200">
                <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 px-4 text-[14px] font-semibold text-ink-800">
                  Alle Stunden als Tabelle
                  <span aria-hidden="true" className="text-ink-400 transition-transform group-open:rotate-45">+</span>
                </summary>
                <div className="max-h-[420px] overflow-auto border-t border-ink-100">
                  <table className="w-full min-w-[520px] text-left text-[13px]">
                    <caption className="sr-only">Stündliche PV-Prognose mit Unsicherheitsband und Börsenpreis</caption>
                    <thead className="sticky top-0 bg-sand-50 text-[12px] uppercase tracking-wider text-ink-500">
                      <tr>
                        <th scope="col" className="px-4 py-2.5 font-semibold">Zeit</th>
                        <th scope="col" className="px-3 py-2.5 text-right font-semibold">kW</th>
                        <th scope="col" className="px-3 py-2.5 text-right font-semibold">P10–P90</th>
                        <th scope="col" className="px-3 py-2.5 text-right font-semibold">ct/kWh</th>
                        <th scope="col" className="px-4 py-2.5 font-semibold">Hinweis</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-ink-100">
                      {ergebnis.stunden.map((s) => (
                        <tr key={s.beginn} className={ergebnis.goldSet.has(s.beginn) ? "bg-sun-300/20" : undefined}>
                          <th scope="row" className="whitespace-nowrap px-4 py-2 font-medium text-ink-800">
                            {tagKurz(s.beginn)} {intervall(s.beginn, s.ende)}
                          </th>
                          <td className="ov-num px-3 py-2 text-right text-ink-900">{zahl(s.kw, s.kw < 10 ? 1 : 0)}</td>
                          <td className="ov-num px-3 py-2 text-right text-ink-600">{Number.isFinite(s.kwP10) ? `${zahl(s.kwP10, s.kwP10 < 10 ? 1 : 0)}–${zahl(s.kwP90, s.kwP90 < 10 ? 1 : 0)}` : "–"}</td>
                          <td className="ov-num px-3 py-2 text-right text-ink-600">{ergebnis.preise.has(s.beginn) ? zahl(ergebnis.preise.get(s.beginn) / 10, 1) : "–"}</td>
                          <td className="px-4 py-2 text-ink-600">{ergebnis.goldSet.has(s.beginn) ? "Goldene Stunde" : ""}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </details>

              {/* Hinweise & Quellen */}
              <div className="flex gap-3 rounded-2xl bg-sand-50 p-4 text-[12.5px] leading-relaxed text-ink-600 ring-1 ring-ink-200/60 md:p-5">
                <Info aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-ov-700" />
                <div className="space-y-1.5">
                  <p>
                    <strong className="text-ink-900">Prognose ohne Gewähr.</strong> Rechenmodell mit Richtwerten (Temperaturkoeffizient −0,35 %/K, {verluste} % Systemverluste); Verschattung, Schnee auf den
                    Modulen, Abregelung und Wechselrichtergrenzen sind nicht berücksichtigt. Die Hauptlinie stammt aus dem deterministischen Lauf, das Band aus dem Ensemble (oft ein älterer Lauf) – die Linie kann daher knapp außerhalb liegen. Die Spanne gilt je Stunde; die Tagesspanne ist die Summe dieser Werte und damit eher zu breit.
                  </p>
                  <p>
                    {daten.quelle?.text} ({daten.quelle?.lizenz}) – C-LAEF AlpeAdria,{" "}
                    <a href={daten.quelle?.datensaetze?.[0]?.url} target="_blank" rel="noopener noreferrer" className="underline decoration-ink-300 underline-offset-2 hover:text-ink-900">
                      deterministisch
                    </a>{" "}
                    und{" "}
                    <a href={daten.quelle?.datensaetze?.[1]?.url} target="_blank" rel="noopener noreferrer" className="underline decoration-ink-300 underline-offset-2 hover:text-ink-900">
                      Ensemble
                    </a>
                    . PV-Leistung: eigene Berechnung aus Globalstrahlung und Temperatur.
                    {daten.preise?.quelle ? ` Day-Ahead-Preise Gebotszone AT: ${daten.preise.quelle}, netto ohne Netzentgelte und Abgaben.` : " Day-Ahead-Preise gerade nicht verfügbar."}
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-start gap-3 rounded-3xl bg-navy-950 p-5 text-white sm:flex-row sm:items-center sm:justify-between md:p-6">
                <p className="text-[15px] leading-relaxed text-white/80">
                  <strong className="text-white">Eigenverbrauch planen statt schätzen:</strong> Wir legen Anlage, Speicher und Lastmanagement auf Ihr Lastprofil aus.
                </p>
                <Link href="/angebot" className="inline-flex min-h-12 shrink-0 items-center gap-2 rounded-full bg-ov-500 px-6 text-[15px] font-semibold text-white transition-colors hover:bg-ov-600">
                  Anlage planen lassen <ArrowRight aria-hidden="true" className="h-4 w-4" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
