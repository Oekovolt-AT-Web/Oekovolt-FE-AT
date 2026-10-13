"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { AlertCircle, CheckCircle2, ClipboardCheck, CloudSun, Download, Eye, FileUp, Loader2, Lock, MailCheck, Printer, RefreshCw, ShieldCheck, Sun } from "lucide-react";
import { Auswahl, Kennzahl } from "@/components/Rechner/bausteine";
import { Zahlfeld } from "@/components/RechnerGewerbe/GewerbeBausteine";
import { cn } from "@/components/ui/cn";
import { ereignis } from "@/lib/statistik";
import { regionFuer, regionenNachLand } from "@/lib/regionen";
import { AUSRICHTUNGEN } from "@/lib/lastgang/pv";
import { FIRMA } from "@/lib/site";
import { AMPEL, BEISPIEL, MONATE_KURZ, QUELLEN, beispielAuswertung, bewerte, csvExport, ghiMonatsSummen, parseMonatswerte, sollMonate, wetterFaktoren } from "./auswertung";

/**
 * Anlagen-Check: Monatserträge (Eingabe, Einfügen oder CSV-Datei – alles bleibt im Browser) gegen
 * einen Soll-Wert aus PVGIS-Monatswerten, optional wetterbereinigt über GeoSphere INCA
 * (Server-Route /api/lastgang/wetter, Paket B11). Ampel und Prüfpunkte beschreiben die Anlage –
 * kein Urteil über den Errichter.
 *
 * Lead-Gate Stufe 2 (Inhaber 11.10.2026, Kennung „anlagen-check“): Die Auswertung der eigenen Werte
 * startet erst nach bestätigter E-Mail. Reihenfolge: Kontaktdaten (Vorname, Nachname, E-Mail
 * Pflicht; Telefon nur nach Häkchen) → Bestätigungslink (Backend, 24 h, einmal verwendbar) →
 * Auswertung → Ergebnis → Export (CSV, Druck). Vorher zeigt die Seite nur eine als „Beispiel“
 * gekennzeichnete Vorschau. Maßgeblich ist allein der Serverstatus /api/lead-gate/status (A09, signiertes
 * HttpOnly-Cookie). Die lokale Merkung zählt nur im Entwicklungsmodus und nur, wenn die Status-Route fehlt.
 */

const GATE_KENNUNG = "anlagen-check";
const GATE_SPEICHER = "ov-lead-bestaetigt"; // nur Entwicklungs-Rückfall ohne Status-Route – schaltet nie allein frei
const GATE_TAGE = 30;
const ENTWURF_SPEICHER = "ov-anlagen-check-entwurf"; // Eingaben bleiben nur auf diesem Gerät
const ERNEUT_SEKUNDEN = 60;
const ABFRAGE_MS = 6000;
const STAND = "12.10.2026";
const JETZT_JAHR = 2026;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const ENTWICKLUNG = process.env.NODE_ENV !== "production";

const AMPEL_STIL = {
  gruen: { label: "Im erwarteten Bereich", kachel: "bg-ov-600 text-white", balken: "bg-ov-500", punkt: "bg-ov-500" },
  gelb: { label: "Prüfen lassen", kachel: "bg-sun-400 text-navy-950", balken: "bg-sun-400", punkt: "bg-sun-400" },
  rot: { label: "Deutlich unter Soll", kachel: "bg-navy-700 text-white", balken: "bg-navy-600", punkt: "bg-navy-600" },
  grau: { label: "Noch keine Werte", kachel: "bg-ink-100 text-ink-700", balken: "bg-ink-300", punkt: "bg-ink-300" },
};

const zahl = (n, s = 0) => (Number.isFinite(n) ? Number(n).toLocaleString("de-DE", { minimumFractionDigits: s, maximumFractionDigits: s }) : "–");
const prozent = (q) => (q == null ? "–" : `${Math.round(q * 100)} %`);

function gateBestaetigt() {
  try {
    const roh = JSON.parse(localStorage.getItem(GATE_SPEICHER) || "{}");
    const t = Number(roh?.[GATE_KENNUNG]);
    return Number.isFinite(t) && Date.now() - t < GATE_TAGE * 86400000;
  } catch {
    return false;
  }
}

function gateMerken() {
  try {
    const roh = JSON.parse(localStorage.getItem(GATE_SPEICHER) || "{}");
    localStorage.setItem(GATE_SPEICHER, JSON.stringify({ ...(roh && typeof roh === "object" ? roh : {}), [GATE_KENNUNG]: Date.now() }));
  } catch {}
}

/** Serverseitiger Zustand (Freischalt-Cookie, A09): { bestaetigt } oder null, wenn die Route fehlt. */
async function statusAbfragen() {
  try {
    const res = await fetch(`/api/lead-gate/status?kennung=${GATE_KENNUNG}`, { cache: "no-store" });
    if (res.status === 404 || res.status === 405) return null;
    if (!res.ok) return { bestaetigt: false };
    const json = await res.json().catch(() => ({}));
    return { bestaetigt: json?.bestaetigt === true || json?.frei === true || json?.freigegeben === true };
  } catch {
    return { bestaetigt: false };
  }
}

/** Wetterdaten der B11-Route in Stundenreihe [{ zeit, gl }] bringen – Format wird defensiv erkannt. */
function stundenAus(json) {
  if (!json || typeof json !== "object") return [];
  if (Array.isArray(json.zeiten) && Array.isArray(json.gl)) return json.zeiten.map((z, i) => ({ zeit: z, gl: json.gl[i] }));
  const liste = Array.isArray(json) ? json : json.stunden || json.werte || json.daten || json.reihe || json.data || [];
  return liste.map((s) => ({ zeit: s.zeit ?? s.time ?? s.t ?? s.ts ?? s.timestamp, gl: s.gl ?? s.GL ?? s.ghi ?? s.strahlung ?? s.wert ?? s.value }));
}

export default function AnlagenCheck() {
  const gruppen = useMemo(() => regionenNachLand(), []);
  const [ortSlug, setOrtSlug] = useState("ostermiething");
  const [kwp, setKwp] = useState(30);
  const [ausrichtung, setAusrichtung] = useState("sued");
  const [jahrIbn, setJahrIbn] = useState(2015);
  const [messJahr, setMessJahr] = useState(JETZT_JAHR - 1);
  const [werte, setWerte] = useState(() => Array(12).fill(""));
  const [text, setText] = useState("");
  const [parseFehler, setParseFehler] = useState([]);
  const [wetterAn, setWetterAn] = useState(false);
  const [wetter, setWetter] = useState({ status: "aus", faktoren: null });
  const [frei, setFrei] = useState(false);
  const [geladen, setGeladen] = useState(false);
  const dateiRef = useRef(null);
  const ergebnisRef = useRef(null);
  const ids = useId();

  // Entwurf vom Gerät laden (z. B. nach Rückkehr über den Bestätigungslink in einem neuen Tab)
  useEffect(() => {
    try {
      const e = JSON.parse(localStorage.getItem(ENTWURF_SPEICHER) || "null");
      if (e && typeof e === "object") {
        if (typeof e.ortSlug === "string") setOrtSlug(e.ortSlug);
        if (Number.isFinite(e.kwp)) setKwp(e.kwp);
        if (typeof e.ausrichtung === "string") setAusrichtung(e.ausrichtung);
        if (Number.isFinite(e.jahrIbn)) setJahrIbn(e.jahrIbn);
        if (Number.isFinite(e.messJahr)) setMessJahr(e.messJahr);
        if (Array.isArray(e.werte) && e.werte.length === 12) setWerte(e.werte.map((w) => String(w ?? "")));
        if (typeof e.wetterAn === "boolean") setWetterAn(e.wetterAn);
      }
    } catch {}
    setGeladen(true);
  }, []);

  useEffect(() => {
    if (!geladen) return;
    try {
      localStorage.setItem(ENTWURF_SPEICHER, JSON.stringify({ ortSlug, kwp, ausrichtung, jahrIbn, messJahr, werte, wetterAn }));
    } catch {}
  }, [geladen, ortSlug, kwp, ausrichtung, jahrIbn, messJahr, werte, wetterAn]);

  const region = useMemo(() => gruppen.flatMap((g) => g.orte).find((r) => r.slug === ortSlug) || gruppen[0]?.orte[0], [gruppen, ortSlug]);
  const ort = region?.pvgis;

  // Wetterbereinigung über die Server-Route aus B11 – erst nach der Freischaltung (Teil der Auswertung)
  useEffect(() => {
    if (!frei || !wetterAn || !ort) {
      setWetter({ status: wetterAn && !frei ? "wartet" : "aus", faktoren: null });
      return undefined;
    }
    const ac = new AbortController();
    setWetter({ status: "laedt", faktoren: null });
    const lat = Math.round(ort.lat * 100) / 100;
    const lon = Math.round(ort.lon * 100) / 100;
    fetch(`/api/lastgang/wetter?lat=${lat}&lon=${lon}&von=${messJahr}-01-01&bis=${messJahr}-12-31`, { signal: ac.signal })
      .then(async (res) => {
        if (res.status === 404 || res.status === 405) return { status: "fehlt", faktoren: null };
        if (!res.ok) return { status: "fehler", faktoren: null };
        const json = await res.json().catch(() => null);
        const summen = ghiMonatsSummen(stundenAus(json), messJahr);
        const f = wetterFaktoren(ort, summen);
        return f && f.some((x) => x !== null) ? { status: "ok", faktoren: f } : { status: "leer", faktoren: null };
      })
      .catch((e) => (e?.name === "AbortError" ? null : { status: "fehler", faktoren: null }))
      .then((w) => w && setWetter(w));
    return () => ac.abort();
  }, [frei, wetterAn, ort, messJahr]);

  const ist = useMemo(() => werte.map((w) => (String(w).trim() === "" ? null : Number(String(w).replace(",", ".")))).map((n) => (Number.isFinite(n) && n >= 0 ? n : null)), [werte]);
  const anzahlWerte = ist.filter((x) => x !== null).length;

  // Die eigene Auswertung entsteht erst nach der Freischaltung – vorher wird aus den Werten nichts berechnet
  const eigen = useMemo(() => {
    if (!frei || !ort) return null;
    const soll = sollMonate({ ort, ausrichtung, kwp, alterJahre: Math.max(0, messJahr - jahrIbn), faktoren: wetter.faktoren });
    return { soll, ergebnis: bewerte({ ist, soll }) };
  }, [frei, ort, ausrichtung, kwp, messJahr, jahrIbn, wetter.faktoren, ist]);
  const beispiel = useMemo(() => beispielAuswertung(regionFuer(BEISPIEL.ortSlug)?.pvgis), []);

  const freigeben = useCallback(() => {
    gateMerken();
    setFrei(true);
    ereignis("lead_gate_frei", { kennung: GATE_KENNUNG, aktion: "auswertung" });
    setTimeout(() => ergebnisRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 150);
  }, []);

  const uebernehmeText = (t) => {
    setText(t);
    const p = parseMonatswerte(t);
    setParseFehler(p.fehler);
    if (p.erkannt !== "leer") setWerte(p.werte.map((w) => (w == null ? "" : String(Math.round(w)))));
  };

  const dateiLesen = async (datei) => {
    if (!datei) return;
    try {
      const inhalt = await datei.text();
      uebernehmeText(inhalt.slice(0, 20000));
      ereignis("anlagen_check_datei", { groesse: datei.size });
    } catch {
      setParseFehler(["Die Datei konnte nicht gelesen werden."]);
    }
  };

  const meta = { stand: STAND, ort: region?.name || "", kwp, ausrichtung: AUSRICHTUNGEN.find((a) => a.id === ausrichtung)?.label || ausrichtung, jahr: jahrIbn, wetter: wetter.status === "ok" };

  const exportieren = (aktion) => {
    if (!frei || !eigen) return;
    if (aktion === "csv") {
      const blob = new Blob([`﻿${csvExport({ ergebnis: eigen.ergebnis, meta })}`], { type: "text/csv;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `anlagen-check-${messJahr}.csv`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } else {
      window.print();
    }
    ereignis("anlagen_check_export", { aktion, quote: eigen.ergebnis.jahr.quote == null ? null : Math.round(eigen.ergebnis.jahr.quote * 100) });
  };

  // An das Gate gehen nur die Eckdaten der Anlage – keine Monatswerte, keine Auswertung
  const gateKontext = {
    ergebnis: { ort: meta.ort, kwp, ausrichtung: meta.ausrichtung, inbetriebnahme: jahrIbn, messjahr: messJahr, monatswerte: anzahlWerte },
    zeilen: [`Ort: ${meta.ort}`, `Anlage: ${kwp} kWp, ${meta.ausrichtung}, Inbetriebnahme ${jahrIbn}`, `Monatswerte ${messJahr}: ${anzahlWerte} von 12 eingegeben (Werte bleiben im Browser)`],
  };

  return (
    <div className="ac-wurzel">
      <style dangerouslySetInnerHTML={{ __html: DRUCK_CSS }} />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-8">
        {/* ------------------------------------------------ Eingaben */}
        <div className="space-y-6">
          <div className="rounded-3xl bg-white p-6 ring-1 ring-ink-200/70 md:p-8">
            <p className="text-[11.5px] font-semibold uppercase tracking-[0.16em] text-ink-500">1 · Ihre Anlage</p>
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor={`${ids}-ort`} className="mb-1.5 block text-[13.5px] font-semibold text-ink-700">
                  Nächstgelegener Ort
                </label>
                <select
                  id={`${ids}-ort`}
                  value={ortSlug}
                  onChange={(e) => setOrtSlug(e.target.value)}
                  className="h-11 w-full cursor-pointer rounded-xl bg-white px-3 text-[15px] text-ink-900 outline-none ring-1 ring-ink-200 focus:ring-2 focus:ring-ov-500"
                >
                  {gruppen.map((g) => (
                    <optgroup key={g.land} label={g.name}>
                      {g.orte.map((r) => (
                        <option key={r.slug} value={r.slug}>
                          {r.name}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>
              <Zahlfeld label="Anlagenleistung" wert={kwp} onChange={setKwp} einheit="kWp" min={1} max={5000} step={0.1} />
              <Zahlfeld label="Inbetriebnahme (Jahr)" wert={jahrIbn} onChange={setJahrIbn} min={2000} max={JETZT_JAHR} />
              <div className="sm:col-span-2">
                <Auswahl legende="Ausrichtung" wert={ausrichtung} onChange={setAusrichtung} optionen={AUSRICHTUNGEN.map((a) => ({ id: a.id, label: a.kurz }))} klein />
              </div>
              <div>
                <label htmlFor={`${ids}-jahr`} className="mb-1.5 block text-[13.5px] font-semibold text-ink-700">
                  Jahr der Monatswerte
                </label>
                <select
                  id={`${ids}-jahr`}
                  value={messJahr}
                  onChange={(e) => setMessJahr(Number(e.target.value))}
                  className="h-11 w-full cursor-pointer rounded-xl bg-white px-3 text-[15px] text-ink-900 outline-none ring-1 ring-ink-200 focus:ring-2 focus:ring-ov-500"
                >
                  {[JETZT_JAHR, JETZT_JAHR - 1, JETZT_JAHR - 2, JETZT_JAHR - 3].map((j) => (
                    <option key={j} value={j}>
                      {j}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-white p-6 ring-1 ring-ink-200/70 md:p-8">
            <p className="text-[11.5px] font-semibold uppercase tracking-[0.16em] text-ink-500">2 · Monatserträge aus dem Portal</p>
            <p className="mt-2 text-[14px] leading-relaxed text-ink-600">
              Tippen Sie die zwölf Monatswerte ein, fügen Sie eine Tabelle ein oder laden Sie einen CSV-Export aus dem Wechselrichter-Portal. Die Datei bleibt auf Ihrem Gerät – es wird nichts hochgeladen.
            </p>
            <div className="mt-5 grid grid-cols-3 gap-2.5 sm:grid-cols-4">
              {MONATE_KURZ.map((m, i) => (
                <div key={m}>
                  <label htmlFor={`${ids}-m${i}`} className="mb-1 block text-[12px] font-semibold text-ink-600">
                    {m}
                  </label>
                  <input
                    id={`${ids}-m${i}`}
                    type="text"
                    inputMode="decimal"
                    value={werte[i]}
                    placeholder="kWh"
                    onChange={(e) => setWerte((w) => w.map((x, k) => (k === i ? e.target.value : x)))}
                    className="ov-num h-11 w-full rounded-xl bg-white px-2.5 text-[14px] font-semibold text-ink-900 outline-none ring-1 ring-ink-200 placeholder:text-ink-500 focus:ring-2 focus:ring-ov-500"
                  />
                </div>
              ))}
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-[1fr_auto]">
              <textarea
                aria-label="Monatswerte einfügen"
                value={text}
                onChange={(e) => uebernehmeText(e.target.value)}
                rows={3}
                placeholder={"Einfügen, z. B.\n2025-01;412\n2025-02;690 …"}
                className="w-full rounded-xl bg-white px-3 py-2.5 text-[14px] text-ink-900 outline-none ring-1 ring-ink-200 placeholder:text-ink-500 focus:ring-2 focus:ring-ov-500"
              />
              <div className="flex flex-col gap-2">
                <input ref={dateiRef} type="file" accept=".csv,.txt,text/csv,text/plain" className="sr-only" onChange={(e) => dateiLesen(e.target.files?.[0])} />
                <button
                  type="button"
                  onClick={() => dateiRef.current?.click()}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-white px-5 text-[14px] font-semibold text-ink-900 ring-1 ring-inset ring-ink-200 hover:bg-ink-50"
                >
                  <FileUp aria-hidden="true" className="h-4 w-4" />
                  CSV laden
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setWerte(Array(12).fill(""));
                    setText("");
                    setParseFehler([]);
                  }}
                  className="inline-flex min-h-11 items-center px-1 text-[13px] font-medium text-ink-600 underline decoration-ink-300 underline-offset-2 hover:text-ov-700"
                >
                  Werte leeren
                </button>
              </div>
            </div>
            {parseFehler.length > 0 && (
              <ul className="mt-3 space-y-1 text-[13px] text-red-700" role="alert">
                {parseFehler.slice(0, 3).map((f) => (
                  <li key={f} className="flex gap-1.5">
                    <AlertCircle aria-hidden="true" className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className={cn("rounded-3xl p-5 ring-1 transition-colors md:p-6", wetterAn ? "bg-white ring-ov-300" : "bg-white/70 ring-ink-200/70")}>
            <label className="flex cursor-pointer items-start gap-3">
              <input type="checkbox" role="switch" checked={wetterAn} onChange={(e) => setWetterAn(e.target.checked)} className="mt-1 h-5 w-5 shrink-0 cursor-pointer rounded border-ink-300 accent-ov-600" />
              <span className="min-w-0">
                <span className="flex items-center gap-2 text-[14.5px] font-semibold text-ink-800">
                  <CloudSun aria-hidden="true" className="h-4 w-4 text-ov-600" />
                  Wetterbereinigt (GeoSphere INCA)
                  <span className="rounded-full bg-sand-100 px-2 py-0.5 text-[11.5px] font-semibold text-ink-700">in Vorbereitung</span>
                </span>
                <span className="mt-1 block text-[13px] leading-relaxed text-ink-600">
                  Vergleicht die gemessene Globalstrahlung des Jahres {messJahr} mit dem langjährigen Mittel und passt den Soll-Wert je Monat an. An GeoSphere gehen nur die gerundete Koordinate des Orts und der Zeitraum – keine Erträge.
                </span>
                <span className="mt-1.5 block text-[12.5px] font-medium text-ink-600" aria-live="polite">
                  {wetter.status === "wartet" && "Die Wetterdaten werden mit Ihrer Auswertung geladen – nach der Freischaltung."}
                  {wetter.status === "laedt" && "Lade Wetterdaten …"}
                  {wetter.status === "ok" && "Wetterdaten geladen – Soll-Wert ist wetterbereinigt (Analyse, keine Messung am Dach)."}
                  {wetter.status === "fehlt" && "Die Wetterbereinigung ist noch in Vorbereitung – es gilt das Klimamittel aus PVGIS."}
                  {(wetter.status === "fehler" || wetter.status === "leer") && "Wetterdaten gerade nicht verfügbar – es gilt das Klimamittel aus PVGIS."}
                </span>
              </span>
            </label>
          </div>
        </div>


        {/* ------------------------------------------------ Gate, Vorschau, Ergebnis */}
        <div ref={ergebnisRef} className="min-w-0 scroll-mt-28 space-y-5">
          {frei && eigen ? (
            <div className="ac-druck space-y-5">
              <ErgebnisAnsicht ergebnis={eigen.ergebnis} soll={eigen.soll} kwp={kwp} wetterOk={wetter.status === "ok"} />
            </div>
          ) : (
            <>
              <GateAuswertung kontext={gateKontext} anzahlWerte={anzahlWerte} onFrei={freigeben} />
              {beispiel && (
                <section aria-labelledby={`${ids}-bsp`} className="rounded-[2rem] bg-sand-50 p-4 ring-1 ring-ink-200/60 md:p-5">
                  <p id={`${ids}-bsp`} className="flex items-center gap-2 text-[11.5px] font-semibold uppercase tracking-[0.16em] text-ink-600">
                    <Eye aria-hidden="true" className="h-4 w-4 text-ov-600" />
                    Beispiel · So sieht Ihre Auswertung aus
                  </p>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-ink-600">
                    Frei gewähltes Muster für eine {BEISPIEL.kwp}-kWp-Anlage (Süd, {BEISPIEL.alterJahre} Jahre in Betrieb, Ort Ostermiething) mit schwachem Winter – keine Messwerte und nicht Ihre Anlage.
                  </p>
                  <div aria-hidden="true" className="pointer-events-none mt-4 select-none space-y-4">
                    <ErgebnisAnsicht ergebnis={beispiel.ergebnis} soll={beispiel.soll} kwp={BEISPIEL.kwp} wetterOk={false} beispiel />
                  </div>
                </section>
              )}
            </>
          )}

          <div className="ac-nicht-drucken rounded-3xl bg-navy-950 p-6 text-white md:p-8">
            <p className="font-display text-[19px] font-bold">Service-Check mit Messung vor Ort</p>
            <p className="mt-2 text-[14.5px] leading-relaxed text-white/75">
              Stringmessung, Isolationsprüfung, Thermografie und Prüfbefund nach OVE E 8101 – auch wenn Ihr Errichter nicht mehr erreichbar ist.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link href="/service/betriebsfuehrung#anfrage" className="inline-flex h-12 items-center justify-center rounded-full bg-ov-600 px-6 text-[15px] font-semibold text-white hover:bg-ov-700">
                Service-Check anfragen
              </Link>
              <Link href="/service/e-check" className="inline-flex h-12 items-center justify-center rounded-full px-6 text-[15px] font-semibold text-white ring-1 ring-inset ring-white/60 hover:bg-white/10">
                E-Check & Prüfbefund
              </Link>
            </div>
            <div className="mt-6 border-t border-white/15 pt-5">
              <p className="flex items-center gap-2 text-[13px] text-white/75">
                <Lock aria-hidden="true" className="h-3.5 w-3.5" />
                {frei ? "Auswertung freigeschaltet – Export als CSV oder Ausdruck" : "Export (CSV, Ausdruck) nach der Freischaltung der Auswertung"}
              </p>
              {frei && (
                <div className="mt-3 flex flex-wrap gap-2.5">
                  <button
                    type="button"
                    disabled={!eigen || eigen.ergebnis.jahr.monate === 0}
                    onClick={() => exportieren("csv")}
                    className="inline-flex h-11 items-center gap-2 rounded-full bg-white px-5 text-[14px] font-semibold text-navy-900 hover:bg-ov-50 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Download aria-hidden="true" className="h-4 w-4" />
                    CSV herunterladen
                  </button>
                  <button
                    type="button"
                    disabled={!eigen || eigen.ergebnis.jahr.monate === 0}
                    onClick={() => exportieren("druck")}
                    className="inline-flex h-11 items-center gap-2 rounded-full px-5 text-[14px] font-semibold text-white ring-1 ring-inset ring-white/60 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Printer aria-hidden="true" className="h-4 w-4" />
                    Bericht drucken
                  </button>
                </div>
              )}
            </div>
          </div>

          <p className="text-[12px] leading-relaxed text-ink-500">
            Quellen:{" "}
            {QUELLEN.map((q, i) => (
              <span key={q.href}>
                <a href={q.href} target="_blank" rel="noopener noreferrer" className="underline decoration-ink-300 underline-offset-2 hover:text-ov-700">
                  {q.titel}
                </a>
                {i < QUELLEN.length - 1 ? " · " : ""}
              </span>
            ))}
          </p>
        </div>
      </div>
    </div>
  );
}

/** Ergebnisdarstellung – für die eigene Auswertung und (gekennzeichnet) für die Beispielvorschau. */
function ErgebnisAnsicht({ ergebnis, soll, kwp, wetterOk, beispiel = false }) {
  const hatDaten = ergebnis.jahr.monate > 0;
  const ampel = AMPEL_STIL[ergebnis.jahr.ampel] || AMPEL_STIL.grau;
  const maxWert = Math.max(1, ...ergebnis.monate.map((m) => Math.max(m.soll, m.ist || 0)));

  return (
    <>
      <div className={cn("rounded-3xl p-6 md:p-8", ampel.kachel)}>
        <p className="flex flex-wrap items-center gap-2 text-[11.5px] font-semibold uppercase tracking-[0.16em] opacity-90">
          {beispiel ? "Beispiel · Ampel" : "Ihr Ergebnis · Ampel"}
        </p>
        <p className="mt-2 font-display text-[clamp(1.6rem,1.2rem+1.4vw,2.3rem)] font-extrabold leading-tight tracking-tight" aria-live={beispiel ? undefined : "polite"}>
          {ampel.label}
        </p>
        <p className="mt-2 text-[15px] leading-relaxed opacity-90">
          {hatDaten
            ? `${prozent(ergebnis.jahr.quote)} des Soll-Werts in ${ergebnis.jahr.monate} ${ergebnis.jahr.monate === 1 ? "Monat" : "Monaten"} – grün ab ${Math.round(AMPEL.gruen * 100)} %, gelb ab ${Math.round(AMPEL.gelb * 100)} %.`
            : "Tragen Sie links mindestens einen Monatswert ein, dann erscheint hier die Bewertung."}
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <Kennzahl label="Ist (Summe)" icon={Sun}>
          {hatDaten ? `${zahl(ergebnis.jahr.ist)} kWh` : "–"}
        </Kennzahl>
        <Kennzahl label="Soll (Summe)" icon={ClipboardCheck} zusatz={wetterOk ? "wetterbereinigt" : "Klimamittel PVGIS"}>
          {hatDaten ? `${zahl(ergebnis.jahr.soll)} kWh` : `${zahl(soll.reduce((a, b) => a + b, 0))} kWh`}
        </Kennzahl>
        <Kennzahl label="Spezifisch (Ist)" icon={ShieldCheck} zusatz="kWh je kWp im Zeitraum">
          {hatDaten && kwp > 0 ? zahl(ergebnis.jahr.ist / kwp) : "–"}
        </Kennzahl>
      </div>

      <div className="rounded-3xl bg-white p-5 ring-1 ring-ink-200/70 md:p-6">
        <p className="text-[11.5px] font-semibold uppercase tracking-[0.16em] text-ink-500">Monat für Monat</p>
        <ul className="mt-4 space-y-2">
          {ergebnis.monate.map((m) => {
            const stil = AMPEL_STIL[m.ampel];
            return (
              <li key={m.monat} className="grid grid-cols-[2.4rem_1fr_3.6rem] items-center gap-3 text-[13px]">
                <span className="font-semibold text-ink-700">{MONATE_KURZ[m.monat]}</span>
                <span className="relative block h-3.5 overflow-hidden rounded-full bg-ink-100" aria-hidden="true">
                  <span className="absolute inset-y-0 left-0 rounded-full bg-ink-200" style={{ width: `${(m.soll / maxWert) * 100}%` }} />
                  {m.ist !== null && <span className={cn("absolute inset-y-0 left-0 rounded-full", stil.balken)} style={{ width: `${(m.ist / maxWert) * 100}%` }} />}
                </span>
                <span className="ov-num text-right font-semibold text-ink-900">
                  {prozent(m.quote)}
                  <span className="sr-only">
                    , Ist {zahl(m.ist)} kWh, Soll {zahl(m.soll)} kWh
                  </span>
                </span>
              </li>
            );
          })}
        </ul>
        <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[12px] text-ink-500">
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-ink-200" /> Soll
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-ov-500" /> Ist im Bereich
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-sun-400" /> unter Soll
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-navy-600" /> deutlich unter Soll
          </span>
        </p>
      </div>

      <div className="rounded-3xl bg-white p-5 ring-1 ring-ink-200/70 md:p-6">
        <p className="text-[11.5px] font-semibold uppercase tracking-[0.16em] text-ink-500">Prüfpunkte</p>
        {hatDaten ? (
          <ul className="mt-4 space-y-3">
            {ergebnis.pruefpunkte.map((p) => (
              <li key={p.id} className="flex gap-3">
                <span className={cn("mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full", AMPEL_STIL[p.stufe]?.punkt || "bg-ink-300")} aria-hidden="true" />
                <div>
                  <p className="font-display text-[15.5px] font-bold text-ink-900">{p.titel}</p>
                  <p className="mt-0.5 text-[14px] leading-relaxed text-ink-600">{p.text}</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-[14px] text-ink-600">Die Prüfpunkte entstehen aus dem Muster Ihrer Monatswerte – z. B. schwacher Winter, schwacher Sommer oder einzelne Lücken.</p>
        )}
        <p className="mt-4 text-[12.5px] leading-relaxed text-ink-500">
          {beispiel
            ? "Beispiel mit frei gewählten Werten – Ihre eigene Auswertung startet nach der Bestätigung Ihrer E-Mail-Adresse."
            : `Die Auswertung beschreibt den Zustand der Anlage – sie ist kein Urteil über Planung oder Errichtung und ersetzt keinen Prüfbefund. Richtwert zur Orientierung, Stand ${STAND}.`}
        </p>
      </div>
    </>
  );
}

/**
 * Lead-Gate Stufe 2 (Kennung „anlagen-check“), bis src/components/LeadGate/useLeadGate.js aus Paket
 * A09 den Modus „auswertung“ anbietet. Ablauf:
 *   Kontaktdaten (Vorname, Nachname, E-Mail Pflicht; Telefon nur nach Häkchen)
 *   → POST /api/rechner_lead (A09). Kein Ersatzweg über die Kontaktanfrage: Ohne diese Route keine Freischaltung.
 *   → Antwort „email“/„entwicklung“: Wartezustand „Bitte E-Mail bestätigen – Link gesendet an …“, „Erneut senden“
 *     frühestens nach 60 s. Antwort „team“ (Backoffice ohne Mailversand): ehrlicher Hinweis, dass das Team den
 *     Link per E-Mail schickt – kein „Erneut senden“.
 *   → Abfrage /api/lead-gate/status (Freischalt-Cookie) alle 6 s und beim Zurückkehren in den Tab
 *   → onFrei(). Rückkehr über den Bestätigungslink (?freigeschaltet=…) wird ebenfalls über den Status geprüft.
 * Ohne Status-Route (404) nur im Entwicklungsmodus „Bestätigung simulieren“ bzw. lokale Merkung.
 */
function GateAuswertung({ kontext, anzahlWerte, onFrei }) {
  const [f, setF] = useState({ vorname: "", nachname: "", email: "", telefon: "", kontakt: false });
  const [fehler, setFehler] = useState({});
  const [phase, setPhase] = useState("formular"); // formular | sendet | wartet
  const [sendeFehler, setSendeFehler] = useState(false);
  const [gesendetAn, setGesendetAn] = useState("");
  const [erneutIn, setErneutIn] = useState(0);
  const [ohneBackoffice, setOhneBackoffice] = useState(false);
  const [versand, setVersand] = useState("email"); // email | team | entwicklung (Antwort von /api/rechner_lead)
  const [entwicklungsLink, setEntwicklungsLink] = useState("");
  const leer = useRef(null); // Honeypot
  const id = useId();

  // Beim Laden: Freischalt-Cookie über den Server prüfen (auch nach Rückkehr vom Bestätigungslink).
  // Die lokale Merkung schaltet nie allein frei – nur im Entwicklungsmodus, wenn die Status-Route fehlt.
  useEffect(() => {
    let aktiv = true;
    const ausLink = new URL(window.location.href).searchParams.has("freigeschaltet");
    statusAbfragen().then((s) => {
      if (!aktiv) return;
      if (s === null) {
        setOhneBackoffice(true);
        if (ENTWICKLUNG && (ausLink || gateBestaetigt())) onFrei();
      } else if (s.bestaetigt) onFrei();
    });
    return () => {
      aktiv = false;
    };
  }, [onFrei]);

  // Wartezustand: Status abfragen (Intervall + Rückkehr in den Tab) und Countdown für „Erneut senden“
  useEffect(() => {
    if (phase !== "wartet") return undefined;
    let aktiv = true;
    const pruefen = async () => {
      const s = await statusAbfragen();
      if (!aktiv) return;
      if (s === null) setOhneBackoffice(true);
      else if (s.bestaetigt) onFrei();
    };
    const intervall = setInterval(() => {
      if (!ohneBackoffice) pruefen();
    }, ABFRAGE_MS);
    const sichtbar = () => document.visibilityState === "visible" && pruefen();
    document.addEventListener("visibilitychange", sichtbar);
    const tick = setInterval(() => setErneutIn((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => {
      aktiv = false;
      clearInterval(intervall);
      clearInterval(tick);
      document.removeEventListener("visibilitychange", sichtbar);
    };
  }, [phase, ohneBackoffice, onFrei]);

  const senden = async (e) => {
    e?.preventDefault();
    const neu = {};
    if (!f.vorname.trim()) neu.vorname = "Bitte Vornamen angeben.";
    if (!f.nachname.trim()) neu.nachname = "Bitte Nachnamen angeben.";
    if (!EMAIL.test(f.email.trim())) neu.email = "Bitte eine gültige E-Mail-Adresse angeben.";
    if (f.kontakt && f.telefon.trim() && f.telefon.replace(/\D/g, "").length < 6) neu.telefon = "Bitte Telefonnummer prüfen.";
    setFehler(neu);
    if (Object.keys(neu).length) return;
    setSendeFehler(false);
    setPhase("sendet");

    const quelle = window.location.pathname;
    const basis = { vorname: f.vorname.trim(), nachname: f.nachname.trim(), email: f.email.trim(), telefon: f.kontakt ? f.telefon.trim() : "", kontakt_ok: f.kontakt ? 1 : 0, website: leer.current?.value || "" };

    try {
      const res = await fetch("/api/rechner_lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...basis, kennung: GATE_KENNUNG, aktion: "auswertung", segment: "service", quelle, ergebnis: kontext.ergebnis, einwilligung_id: "leadgate-info", einwilligung_version: STAND, bestaetigung: "email", rueckkehr: quelle }),
      }).catch(() => null);
      const json = res ? await res.json().catch(() => ({})) : {};
      if (!res || !res.ok) {
        setSendeFehler(res && res.status !== 404 && res.status !== 405 && typeof json?.error === "string" ? json.error : true);
        setPhase("formular");
        return;
      }
      const art = json?.bestaetigung === "team" ? "team" : json?.bestaetigung === "entwicklung" ? "entwicklung" : "email";
      ereignis("lead_gate_gesendet", { kennung: GATE_KENNUNG, aktion: "auswertung", kontakt: f.kontakt ? 1 : 0 });
      setVersand(art);
      setEntwicklungsLink(ENTWICKLUNG && art === "entwicklung" && typeof json?.entwicklung_link === "string" ? json.entwicklung_link : "");
      setGesendetAn(basis.email);
      setErneutIn(ERNEUT_SEKUNDEN);
      setPhase("wartet");
    } catch {
      setSendeFehler(true);
      setPhase("formular");
    }
  };

  const feld = (name, label, typ = "text", extra = {}) => (
    <div className={extra.breit ? "sm:col-span-2" : ""}>
      <label htmlFor={`${id}-${name}`} className="mb-1.5 block text-[13.5px] font-semibold text-ink-800">
        {label}
        {extra.pflicht && (
          <span className="text-ov-600" aria-hidden="true">
            {" "}*
          </span>
        )}
      </label>
      <input
        id={`${id}-${name}`}
        name={name}
        type={typ}
        value={f[name]}
        autoComplete={extra.autoComplete}
        required={!!extra.pflicht}
        aria-invalid={!!fehler[name]}
        aria-describedby={fehler[name] ? `${id}-${name}-f` : undefined}
        onChange={(e) => {
          const wert = e.target.value;
          setF((x) => ({ ...x, [name]: wert }));
          if (fehler[name]) setFehler(({ [name]: _weg, ...rest }) => rest);
        }}
        className={cn("h-11 w-full rounded-xl bg-white px-3 text-[15px] text-ink-900 outline-none ring-1 ring-inset focus:ring-2", fehler[name] ? "ring-red-400 focus:ring-red-500" : "ring-ink-200 focus:ring-ov-500")}
      />
      {fehler[name] && (
        <p id={`${id}-${name}-f`} className="mt-1 text-[12.5px] font-medium text-red-700">
          {fehler[name]}
        </p>
      )}
    </div>
  );

  if (phase === "wartet") {
    return (
      <section aria-live="polite" className="ac-nicht-drucken rounded-[2rem] bg-white p-6 ring-1 ring-ov-200 md:p-8">
        <p className="text-[11.5px] font-semibold uppercase tracking-[0.16em] text-ov-700">3 · E-Mail bestätigen</p>
        <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-ov-50 text-ov-700">
            <MailCheck aria-hidden="true" className="h-6 w-6" />
          </span>
          <div className="min-w-0">
            {versand === "team" ? (
              <>
                <h3 className="font-display text-[22px] font-extrabold leading-tight text-ink-900">Danke – wir melden uns per E-Mail</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-ink-700">
                  Ihre Anfrage ist bei uns eingegangen. Unser Team sendet Ihnen den Bestätigungslink an <strong className="text-ink-900 [overflow-wrap:anywhere]">{gesendetAn}</strong> – das kann während der Bürozeiten etwas dauern. Nach dem Klick startet die Auswertung hier bzw. beim nächsten Besuch dieser Seite.
                </p>
                <p className="mt-2 text-[13.5px] leading-relaxed text-ink-600">Ihre Eingaben bleiben auf diesem Gerät erhalten. Eilig? Rufen Sie uns an: {FIRMA.telefon}.</p>
              </>
            ) : (
              <>
                <h3 className="font-display text-[22px] font-extrabold leading-tight text-ink-900">Bitte E-Mail bestätigen</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-ink-700">
                  Link gesendet an <strong className="text-ink-900 [overflow-wrap:anywhere]">{gesendetAn}</strong>. Sobald Sie den Bestätigungslink anklicken, startet die Auswertung hier automatisch – der Link gilt 24 Stunden und ist einmal verwendbar.
                </p>
                <p className="mt-2 text-[13.5px] leading-relaxed text-ink-600">Keine Mail? Bitte auch den Spam-Ordner prüfen. Diese Seite kann geöffnet bleiben, Ihre Eingaben bleiben auf diesem Gerät erhalten.</p>
              </>
            )}
          </div>
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          {versand !== "team" && (
            <button
              type="button"
              disabled={erneutIn > 0}
              onClick={senden}
              className="inline-flex h-11 items-center gap-2 rounded-full bg-ink-100 px-5 text-[14.5px] font-semibold text-ink-800 hover:bg-ink-200 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCw aria-hidden="true" className="h-4 w-4" />
              {erneutIn > 0 ? `Erneut senden (${erneutIn} s)` : "Erneut senden"}
            </button>
          )}
          <button type="button" onClick={() => setPhase("formular")} className="inline-flex min-h-11 items-center text-[14px] font-semibold text-ov-700 underline-offset-4 hover:underline">
            Andere Adresse verwenden
          </button>
          {ENTWICKLUNG && entwicklungsLink && (
            <a href={entwicklungsLink} className="inline-flex h-11 items-center gap-2 rounded-full bg-sun-400 px-5 text-[14px] font-semibold text-navy-950">
              Entwicklung: Bestätigungslink öffnen
            </a>
          )}
          {ENTWICKLUNG && ohneBackoffice && (
            <button
              type="button"
              onClick={() => {
                console.info(`[Entwicklung] Lead-Gate „${GATE_KENNUNG}“: Bestätigung simuliert (lokale Merkung ${GATE_SPEICHER}, ${GATE_TAGE} Tage).`);
                onFrei();
              }}
              className="inline-flex h-11 items-center gap-2 rounded-full bg-sun-400 px-5 text-[14px] font-semibold text-navy-950"
            >
              Entwicklung: Bestätigung simulieren
            </button>
          )}
        </div>
      </section>
    );
  }

  return (
    <form onSubmit={senden} noValidate aria-labelledby={`${id}-titel`} className="ac-nicht-drucken relative rounded-[2rem] bg-white p-6 ring-1 ring-ink-200/70 md:p-8">
      <p className="text-[11.5px] font-semibold uppercase tracking-[0.16em] text-ov-700">3 · Auswertung freischalten</p>
      <h3 id={`${id}-titel`} className="mt-2 font-display text-[22px] font-extrabold leading-tight text-ink-900">
        Ihre Ampel mit Prüfpunkten – nach Bestätigung Ihrer E-Mail
      </h3>
      <p className="mt-2 text-[14px] leading-relaxed text-ink-600">
        Wir senden Ihnen einen Bestätigungslink. Nach dem Klick läuft die Auswertung Ihrer Werte hier im Browser, danach können Sie sie als CSV oder Ausdruck sichern. Name und E-Mail nutzen wir, um Ihnen die Auswertung bereitzustellen und Rückfragen dazu zu beantworten (Art. 6 Abs. 1 lit. b DSGVO) – kein Newsletter, keine Werbung.
      </p>
      {anzahlWerte === 0 && (
        <p className="mt-3 rounded-xl bg-sand-50 p-3 text-[13px] leading-relaxed text-ink-700">
          Tipp: Tragen Sie zuerst in Schritt 2 Ihre Monatswerte ein. Sie können sie aber auch nach der Freischaltung ergänzen.
        </p>
      )}
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {feld("vorname", "Vorname", "text", { pflicht: true, autoComplete: "given-name" })}
        {feld("nachname", "Nachname", "text", { pflicht: true, autoComplete: "family-name" })}
        {feld("email", "E-Mail-Adresse", "email", { pflicht: true, autoComplete: "email", breit: true })}
      </div>
      <label className="mt-4 flex cursor-pointer items-start gap-3">
        <input type="checkbox" checked={f.kontakt} onChange={(e) => setF((x) => ({ ...x, kontakt: e.target.checked }))} className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer rounded border-ink-300 accent-ov-600" />
        <span className="text-[13.5px] leading-relaxed text-ink-600">Die {FIRMA.name} darf mich zu diesem Ergebnis kontaktieren – per E-Mail und, wenn ich eine Nummer angebe, telefonisch.</span>
      </label>
      {f.kontakt && <div className="mt-4">{feld("telefon", "Telefonnummer (optional)", "tel", { autoComplete: "tel" })}</div>}
      <input ref={leer} type="text" name="firmenkuerzel" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 opacity-0" />

      {sendeFehler && (
        <p role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-[13.5px] text-red-800 ring-1 ring-red-200">
          {typeof sendeFehler === "string" ? sendeFehler : "Gerade nicht möglich. Bitte später erneut versuchen oder anrufen:"}{" "}
          <a href={FIRMA.telefonHref} className="font-semibold underline">
            {FIRMA.telefon}
          </a>
        </p>
      )}

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="flex flex-wrap items-center gap-1.5 text-[12px] text-ink-500">
          <Lock aria-hidden="true" className="h-3.5 w-3.5" />
          Verschlüsselte Übertragung · * Pflichtfeld ·{" "}
          <Link href="/datenschutz#anfragen" className="-my-3 inline-block py-3 underline underline-offset-2 hover:text-ink-800">
            Datenschutz
          </Link>
        </p>
        <button type="submit" disabled={phase === "sendet"} className="inline-flex h-12 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full bg-ov-600 px-6 text-[15px] font-semibold text-white hover:bg-ov-700 disabled:cursor-wait disabled:opacity-70">
          {phase === "sendet" ? <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" /> : <CheckCircle2 aria-hidden="true" className="h-4 w-4" />}
          Bestätigungslink senden
        </button>
      </div>
    </form>
  );
}

const DRUCK_CSS = `
@media print {
  body * { visibility: hidden !important; }
  .ac-druck, .ac-druck * { visibility: visible !important; }
  .ac-druck { position: absolute; left: 0; top: 0; width: 100%; }
  .ac-nicht-drucken { display: none !important; }
}`;
