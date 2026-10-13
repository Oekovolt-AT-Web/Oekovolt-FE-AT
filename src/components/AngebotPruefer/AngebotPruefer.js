"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { AlertCircle, ArrowRight, CheckCircle2, ClipboardList, Coins, FileText, FileUp, HelpCircle, Loader2, Lock, Printer, RotateCcw, Sun, Trash2 } from "lucide-react";
import { Auswahl, Kennzahl } from "@/components/Rechner/bausteine";
import { Hinweis, Zahlfeld } from "@/components/RechnerGewerbe/GewerbeBausteine";
import { cn } from "@/components/ui/cn";
import { ereignis } from "@/lib/statistik";
import { regionenNachLand } from "@/lib/regionen";
import { PVGIS_QUELLE } from "@/lib/lastgang/pv";
import { ANTWORTEN, AUSRICHTUNGEN, BEISPIEL, FELDER, LEERE_FELDER, PRUEFPUNKTE, STAND, erkenneFelder, pruefen, zusammenfassungZeilen } from "@/lib/angebot/pruefung";
import useLeadGate from "@/components/LeadGate/useLeadGate";

/**
 * Angebots-Zweitmeinung (Paket B08): Ein PV-Angebot wird NUR lokal im Browser gelesen (pdfjs-dist,
 * dynamischer Import, Worker aus dem eigenen Bundle – kein CDN, kein Upload). Erkannte oder manuell
 * eingegebene Kennzahlen werden mit der Prüflogik aus src/lib/angebot/pruefung.js zu €/kWp, €/kWh
 * Jahresertrag (PVGIS über /api/standort) und einer Vollständigkeits-Checkliste verarbeitet.
 * Lead-Gate Stufe 2 über useLeadGate (A09, Modus „auswertung“): Die Prüfung läuft erst, wenn der Server
 * die bestätigte E-Mail meldet (HttpOnly-Cookie, /api/lead-gate/status) – nie aus dem Browserspeicher;
 * vorher zeigt die Seite nur ein klar gekennzeichnetes Beispiel. Die Eingaben (nur Kennzahlen und
 * Checkliste, keine Datei, keine Kontaktdaten) merkt sich der Browser 24 Stunden lokal, damit sie nach
 * dem Bestätigungslink – oft in einem neuen Tab – wieder da sind. Ergebnis = „Prüfpunkte zum
 * Nachfragen“ – ohne Urteil über das Angebot, ohne Anbieternamen, ohne Speicherung der Datei.
 */

export const GATE_KENNUNG = "angebot-pruefen";
const MAX_MB = 20;
const MAX_SEITEN = 40;
const ENTWURF_SPEICHER = "ov-angebot-pruefen-entwurf";
const ENTWURF_STUNDEN = 24;

/** Eingaben lokal merken (nur dieses Gerät, 24 h) – keine Datei, keine Kontaktdaten. */
function entwurfLesen() {
  try {
    const roh = JSON.parse(localStorage.getItem(ENTWURF_SPEICHER) || "null");
    if (!roh || typeof roh !== "object" || !(Date.now() - Number(roh.t) < ENTWURF_STUNDEN * 3600_000)) return null;
    return roh;
  } catch {
    return null;
  }
}
function entwurfSchreiben(daten) {
  try {
    localStorage.setItem(ENTWURF_SPEICHER, JSON.stringify({ ...daten, t: Date.now() }));
  } catch {}
}
function entwurfLoeschen() {
  try {
    localStorage.removeItem(ENTWURF_SPEICHER);
  } catch {}
}

const zahl = (n, s = 0) => (Number.isFinite(n) ? Number(n).toLocaleString("de-DE", { minimumFractionDigits: s, maximumFractionDigits: s }) : "–");

/** PDF-Text lokal lesen: pdfjs-dist erst bei Bedarf laden, Worker aus dem Bundle. */
async function pdfTextLesen(datei, onFortschritt) {
  const pdfjs = await import("pdfjs-dist");
  pdfjs.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url).toString();
  const daten = new Uint8Array(await datei.arrayBuffer());
  const dok = await pdfjs.getDocument({ data: daten, isEvalSupported: false, disableFontFace: true, useSystemFonts: false }).promise;
  const seiten = Math.min(dok.numPages, MAX_SEITEN);
  const teile = [];
  for (let i = 1; i <= seiten; i++) {
    const seite = await dok.getPage(i);
    const inhalt = await seite.getTextContent();
    let zeile = "";
    for (const it of inhalt.items) {
      if (!("str" in it)) continue;
      zeile += it.str;
      if (it.hasEOL) {
        teile.push(zeile);
        zeile = "";
      } else zeile += " ";
    }
    if (zeile.trim()) teile.push(zeile);
    onFortschritt?.(i, seiten);
  }
  await dok.destroy();
  return { text: teile.join("\n"), seiten, gesamt: dok.numPages };
}

export default function AngebotPruefer() {
  const gruppen = useMemo(() => regionenNachLand(), []);
  const [felder, setFelder] = useState(() => ({ ...LEERE_FELDER }));
  const [erkannt, setErkannt] = useState({}); // feldId → Textausschnitt
  const [stichworte, setStichworte] = useState({});
  const [antworten, setAntworten] = useState({});
  const [ortSlug, setOrtSlug] = useState("ostermiething");
  const [ausrichtung, setAusrichtung] = useState("sued");
  const [ertragAngebot, setErtragAngebot] = useState(null);
  const [eagZuschuss, setEagZuschuss] = useState(null);
  const [pdf, setPdf] = useState({ status: "leer", name: "", seiten: 0, zeichen: 0, fehler: "" });
  const [schritt, setSchritt] = useState("eingaben"); // eingaben | laeuft | ergebnis
  const [wiederhergestellt, setWiederhergestellt] = useState(false);
  const [ergebnis, setErgebnis] = useState(null);
  const [ertragInfo, setErtragInfo] = useState(null);
  const dateiRef = useRef(null);
  const ergebnisRef = useRef(null);
  const ids = useId();

  const geladen = useRef(false);
  const autoStart = useRef(false);

  // Eingaben aus dem lokalen Entwurf übernehmen (Rückkehr vom Bestätigungslink, neuer Tab, Reload)
  useEffect(() => {
    const e = entwurfLesen();
    if (e) {
      if (e.felder && typeof e.felder === "object") setFelder({ ...LEERE_FELDER, ...e.felder });
      if (e.antworten && typeof e.antworten === "object") setAntworten(e.antworten);
      if (e.stichworte && typeof e.stichworte === "object") setStichworte(e.stichworte);
      if (typeof e.ortSlug === "string") setOrtSlug(e.ortSlug);
      if (AUSRICHTUNGEN.some((a) => a.id === e.ausrichtung)) setAusrichtung(e.ausrichtung);
      if (e.ertragAngebot != null) setErtragAngebot(e.ertragAngebot);
      if (e.eagZuschuss != null) setEagZuschuss(e.eagZuschuss);
      setWiederhergestellt(Boolean(Number(e.felder?.kwp) > 0 || Number(e.felder?.preisNetto) > 0));
    }
    geladen.current = true;
  }, []);

  // Eingaben bei jeder Änderung lokal merken (erst nach dem Laden, sonst überschreibt der leere Zustand)
  useEffect(() => {
    if (!geladen.current) return;
    if (!(Number(felder.kwp) > 0 || Number(felder.preisNetto) > 0 || Object.keys(antworten).length)) return;
    entwurfSchreiben({ felder, antworten, stichworte, ortSlug, ausrichtung, ertragAngebot, eagZuschuss });
  }, [felder, antworten, stichworte, ortSlug, ausrichtung, ertragAngebot, eagZuschuss]);

  const eingabenVerwerfen = () => {
    entwurfLoeschen();
    setFelder({ ...LEERE_FELDER });
    setAntworten({});
    setStichworte({});
    setErkannt({});
    setErtragAngebot(null);
    setEagZuschuss(null);
    setWiederhergestellt(false);
    setPdf({ status: "leer", name: "", seiten: 0, zeichen: 0, fehler: "" });
    if (dateiRef.current) dateiRef.current.value = "";
  };

  const region = useMemo(() => gruppen.flatMap((g) => g.orte).find((r) => r.slug === ortSlug) || gruppen[0]?.orte[0], [gruppen, ortSlug]);
  const richtung = AUSRICHTUNGEN.find((a) => a.id === ausrichtung) || AUSRICHTUNGEN[0];
  const beispiel = useMemo(() => pruefen(BEISPIEL), []);
  const eingabenOk = Number(felder.kwp) > 0 && Number(felder.preisNetto) > 0;

  const setzeFeld = (id, wert) => {
    setFelder((f) => ({ ...f, [id]: wert }));
    setErkannt((e) => (e[id] ? { ...e, [id]: null } : e));
  };

  /* ---------------------------------------------------------- PDF lokal lesen */
  const dateiLesen = async (datei) => {
    if (!datei) return;
    if (datei.type && datei.type !== "application/pdf" && !/\.pdf$/i.test(datei.name)) {
      setPdf({ status: "fehler", name: datei.name, seiten: 0, zeichen: 0, fehler: "Bitte eine PDF-Datei wählen." });
      return;
    }
    if (datei.size > MAX_MB * 1024 * 1024) {
      setPdf({ status: "fehler", name: datei.name, seiten: 0, zeichen: 0, fehler: `Die Datei ist größer als ${MAX_MB} MB.` });
      return;
    }
    setPdf({ status: "liest", name: datei.name, seiten: 0, zeichen: 0, fehler: "" });
    try {
      const { text, seiten, gesamt } = await pdfTextLesen(datei, (i, n) => setPdf((p) => ({ ...p, seiten: i, gesamt: n })));
      const erg = erkenneFelder(text);
      if (erg.zeichen < 40) {
        setPdf({ status: "fehler", name: datei.name, seiten, zeichen: erg.zeichen, fehler: "In dieser PDF wurde kein Text gefunden (vermutlich ein Scan). Bitte die Kennzahlen unten von Hand eintragen." });
        return;
      }
      setFelder((f) => {
        const neu = { ...f };
        for (const k of Object.keys(erg.felder)) {
          const w = erg.felder[k];
          if (w !== null && w !== "") neu[k] = w;
        }
        return neu;
      });
      setErkannt(erg.treffer);
      setStichworte(erg.stichworte);
      setPdf({ status: "gelesen", name: datei.name, seiten, gesamt, zeichen: erg.zeichen, fehler: "" });
      ereignis("angebot_pruefen_pdf", { seiten, felder: Object.keys(erg.treffer).length });
    } catch (e) {
      setPdf({ status: "fehler", name: datei.name, seiten: 0, zeichen: 0, fehler: e?.name === "PasswordException" ? "Die PDF ist passwortgeschützt. Bitte die Kennzahlen von Hand eintragen." : "Die PDF konnte nicht gelesen werden. Bitte die Kennzahlen von Hand eintragen." });
    }
  };

  const pdfVerwerfen = () => {
    setPdf({ status: "leer", name: "", seiten: 0, zeichen: 0, fehler: "" });
    setErkannt({});
    setStichworte({});
    if (dateiRef.current) dateiRef.current.value = "";
  };

  /* ---------------------------------------------------------- Prüfung (nur nach Gate) */
  const pruefungStarten = useCallback(async () => {
    setSchritt("laeuft");
    const start = Date.now();
    let ertrag = null;
    let quelle = null;
    const p = region?.pvgis;
    if (Number(ertragAngebot) > 0) {
      ertrag = Number(ertragAngebot);
      quelle = "Ertragsannahme laut Angebot (vom Nutzer eingetragen)";
    } else if (p) {
      try {
        const u = `/api/standort?lat=${p.lat}&lon=${p.lon}&neigung=${richtung.neigung}&azimut=${richtung.azimut}&montage=building&nur=ertrag`;
        const res = await fetch(u, { cache: "no-store" });
        const json = res.ok ? await res.json() : null;
        const g = json?.ertrag?.gewaehlt;
        if (g?.ertrag > 0) {
          ertrag = g.ertrag;
          quelle = `PVGIS ${g.version ? g.version.replace("_", ".") : ""} (EU-Kommission, JRC), ${region.name}, ${richtung.label}, 14 % Systemverluste – Abruf ${new Date().toLocaleDateString("de-AT")}`;
        }
      } catch {}
      if (!ertrag && Number(p[richtung.feld]) > 0) {
        ertrag = p[richtung.feld];
        quelle = `${PVGIS_QUELLE.name}, ${region.name}, ${richtung.label} (gespeicherter Wert)`;
      }
    }
    const erg = pruefen({ felder, antworten, stichworte, ertragKwhProKwp: ertrag, ertragQuelle: quelle, eagZuschuss });
    const rest = 700 - (Date.now() - start);
    if (rest > 0) await new Promise((r) => setTimeout(r, rest));
    setErtragInfo(ertrag ? { wert: ertrag, quelle } : null);
    setErgebnis(erg);
    setSchritt("ergebnis");
    ereignis("angebot_pruefen_ergebnis", { nachfragen: erg.ok ? erg.nachfragen.length : -1, pdf: pdf.status === "gelesen" ? 1 : 0 });
    setTimeout(() => ergebnisRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  }, [region, richtung, ertragAngebot, felder, antworten, stichworte, eagZuschuss, pdf.status]);

  // Lead-Gate Stufe 2 (A09): Freischaltung nur über den Server-Status nach bestätigter E-Mail
  const gateKontext = useMemo(
    () => ({
      titel: "Prüfpunkte für Ihr Angebot freischalten",
      einleitung: "Die Prüfung startet, sobald Sie den Link in der E-Mail bestätigt haben. Ihre Eingaben bleiben auf diesem Gerät erhalten.",
      weiterLabel: "Prüfung starten",
      anker: "pruefen",
      ergebnis: { kwp: felder.kwp, preisNetto: felder.preisNetto, speicherKwh: felder.speicherKwh, ort: region?.name, ausrichtung: richtung.id },
    }),
    [felder.kwp, felder.preisNetto, felder.speicherKwh, region, richtung.id]
  );
  const gate = useLeadGate({ kennung: GATE_KENNUNG, modus: "auswertung", kontext: gateKontext });

  // Immer die aktuelle Fassung starten (der Gate-Dialog ruft die beim Öffnen übergebene Funktion auf)
  const startRef = useRef(pruefungStarten);
  useEffect(() => {
    startRef.current = pruefungStarten;
  }, [pruefungStarten]);

  const weiter = () => {
    if (!eingabenOk) return;
    gate.ausfuehren("auswertung", () => startRef.current());
  };

  // Rückkehr über den Bestätigungslink: mit den gemerkten Eingaben automatisch starten
  useEffect(() => {
    if (autoStart.current || !gate.geprueft || !gate.freigegeben || !gate.geradeBestaetigt) return;
    if (schritt !== "eingaben" || !eingabenOk) return;
    autoStart.current = true;
    startRef.current();
  }, [gate.geprueft, gate.freigegeben, gate.geradeBestaetigt, schritt, eingabenOk]);

  const drucken = () => {
    ereignis("angebot_pruefen_druck", { kennung: GATE_KENNUNG });
    window.print();
  };

  const kontextZeilen = useMemo(() => {
    const z = [`Anlage: ${zahl(felder.kwp, 1)} kWp, Angebotssumme netto ${zahl(felder.preisNetto)} €`];
    if (Number(felder.speicherKwh) > 0) z.push(`Speicher: ${zahl(felder.speicherKwh, 1)} kWh`);
    z.push(`Standort: ${region?.name || "–"}, ${richtung.label}`);
    return z;
  }, [felder, region, richtung]);

  const angebotHref = `/angebot?objekt=gewerbe&zweck=zweitmeinung${Number(felder.kwp) > 0 ? `&kwp=${encodeURIComponent(Math.round(Number(felder.kwp) * 10) / 10)}` : ""}${Number(felder.speicherKwh) > 0 ? `&speicher=${encodeURIComponent(Math.round(Number(felder.speicherKwh)))}` : ""}`;

  const schrittNr = gate.offen ? 2 : schritt === "eingaben" ? 1 : 3;

  return (
    <div className="ap-wurzel">
      <style>{DRUCK_CSS}</style>

      {/* Schritte */}
      <ol className="ap-nicht-drucken mb-8 grid gap-2 sm:grid-cols-3" aria-label="Ablauf">
        {[
          ["Kennzahlen", "PDF lokal lesen oder eintragen"],
          ["Freischalten", "Name + E-Mail, Link bestätigen"],
          ["Prüfpunkte", "Kennzahlen und Nachfragen"],
        ].map(([t, s], i) => (
          <li key={t} aria-current={schrittNr === i + 1 ? "step" : undefined} className={cn("flex items-center gap-3 rounded-2xl px-4 py-3 ring-1", schrittNr === i + 1 ? "bg-white ring-ov-300" : schrittNr > i + 1 ? "bg-ov-50 ring-ov-100" : "bg-white/60 ring-ink-200/60")}>
            <span className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[13px] font-bold", schrittNr > i + 1 ? "bg-ov-600 text-white" : schrittNr === i + 1 ? "bg-navy-950 text-white" : "bg-ink-100 text-ink-600")}>
              {schrittNr > i + 1 ? <CheckCircle2 aria-hidden="true" className="h-4 w-4" /> : i + 1}
            </span>
            <span className="min-w-0">
              <span className="block text-[14px] font-semibold text-ink-900">{t}</span>
              <span className="block text-[12.5px] text-ink-500">{s}</span>
            </span>
          </li>
        ))}
      </ol>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-8">
        {/* ---------------------------------------------------------------- Eingaben */}
        <div className="ap-nicht-drucken space-y-6">
          {/* PDF lokal */}
          <section className="rounded-[2rem] bg-white p-5 ring-1 ring-ink-200/70 md:p-7" aria-labelledby={`${ids}-pdf`}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[11.5px] font-semibold uppercase tracking-[0.16em] text-ov-700">Optional · bleibt im Browser</p>
                <h3 id={`${ids}-pdf`} className="mt-1 font-display text-[20px] font-extrabold leading-tight text-ink-900">
                  Angebot als PDF lokal lesen
                </h3>
              </div>
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-ov-50 text-ov-700 ring-1 ring-ov-100" title="Die Datei verlässt Ihren Browser nicht">
                <Lock aria-hidden="true" className="h-5 w-5" />
              </span>
            </div>
            <p className="mt-2 text-[14px] leading-relaxed text-ink-600">
              Die PDF wird nur auf Ihrem Gerät gelesen und <strong className="text-ink-800">nicht hochgeladen</strong> – Fremdangebote enthalten Daten Dritter. Erkannte Werte tragen wir unten ein; Sie bestätigen oder korrigieren sie. Gescannte PDFs ohne Textebene: Werte von Hand eintragen.
            </p>

            <input ref={dateiRef} id={`${ids}-datei`} type="file" accept="application/pdf,.pdf" className="sr-only" onChange={(e) => dateiLesen(e.target.files?.[0])} />
            {pdf.status === "leer" || pdf.status === "fehler" ? (
              <label
                htmlFor={`${ids}-datei`}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  dateiLesen(e.dataTransfer?.files?.[0]);
                }}
                className="mt-4 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-ink-200 bg-sand-50 px-4 py-7 text-center hover:border-ov-400 hover:bg-ov-50/60"
              >
                <FileUp aria-hidden="true" className="h-7 w-7 text-ov-600" />
                <span className="text-[14.5px] font-semibold text-ink-800">PDF auswählen oder hierher ziehen</span>
                <span className="text-[12.5px] text-ink-500">Bis {MAX_MB} MB · Verarbeitung ausschließlich lokal</span>
              </label>
            ) : (
              <div className="mt-4 flex items-start gap-3 rounded-2xl bg-sand-50 p-4 ring-1 ring-ink-200/60">
                {pdf.status === "liest" ? <Loader2 aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 animate-spin text-ov-600" /> : <FileText aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-ov-600" />}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[14.5px] font-semibold text-ink-900">{pdf.name}</p>
                  <p className="text-[12.5px] text-ink-600">
                    {pdf.status === "liest" ? `Wird gelesen … Seite ${pdf.seiten}${pdf.gesamt ? ` von ${pdf.gesamt}` : ""}` : `${pdf.seiten} Seite${pdf.seiten === 1 ? "" : "n"} gelesen${pdf.gesamt > pdf.seiten ? ` (von ${pdf.gesamt})` : ""} · ${Object.values(erkannt).filter(Boolean).length} Felder erkannt · nichts übertragen`}
                  </p>
                </div>
                <button type="button" onClick={pdfVerwerfen} aria-label="PDF verwerfen" className="-m-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-ink-600 hover:bg-ink-100">
                  <Trash2 aria-hidden="true" className="h-4 w-4" />
                </button>
              </div>
            )}
            {pdf.status === "fehler" && (
              <p role="alert" className="mt-3 flex items-start gap-2 rounded-xl bg-red-50 p-3 text-[13.5px] text-red-800 ring-1 ring-red-200">
                <AlertCircle aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
                {pdf.fehler}
              </p>
            )}
          </section>

          {/* Kennzahlen */}
          <section className="rounded-[2rem] bg-white p-5 ring-1 ring-ink-200/70 md:p-7" aria-labelledby={`${ids}-felder`}>
            <p className="text-[11.5px] font-semibold uppercase tracking-[0.16em] text-ov-700">Schritt 1 von 3 · Kennzahlen bestätigen</p>
            <h3 id={`${ids}-felder`} className="mt-1 font-display text-[20px] font-extrabold leading-tight text-ink-900">
              Was steht im Angebot?
            </h3>
            <p className="mt-2 text-[14px] leading-relaxed text-ink-600">Leistung und Nettosumme genügen für die Kennzahlen. Je mehr Sie eintragen, desto vollständiger die Prüfliste. Felder aus der PDF sind markiert.</p>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {FELDER.map((f) =>
                f.typ === "zahl" ? (
                  <div key={f.id}>
                    <Zahlfeld
                      label={
                        <>
                          {f.label}
                          {f.pflicht && (
                            <span className="text-ov-600" aria-hidden="true">
                              {" "}*
                            </span>
                          )}
                        </>
                      }
                      wert={felder[f.id]}
                      onChange={(v) => setzeFeld(f.id, v)}
                      einheit={f.einheit}
                      min={f.min}
                      max={f.max}
                      step={f.step}
                    />
                    <Erkannt text={erkannt[f.id]} />
                  </div>
                ) : (
                  <div key={f.id} className={f.id === "modul" || f.id === "wechselrichter" ? "sm:col-span-2" : ""}>
                    <label htmlFor={`${ids}-${f.id}`} className="mb-1.5 block text-[13.5px] font-semibold text-ink-700">
                      {f.label}
                    </label>
                    <input
                      id={`${ids}-${f.id}`}
                      type="text"
                      value={felder[f.id] || ""}
                      maxLength={120}
                      onChange={(e) => setzeFeld(f.id, e.target.value)}
                      className="h-11 w-full rounded-xl bg-white px-3 text-[15px] text-ink-900 outline-none ring-1 ring-inset ring-ink-200 focus:ring-2 focus:ring-ov-500"
                    />
                    <Erkannt text={erkannt[f.id]} />
                  </div>
                )
              )}
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor={`${ids}-ort`} className="mb-1.5 block text-[13.5px] font-semibold text-ink-700">
                  Standort (nächstgelegener Ort)
                </label>
                <select id={`${ids}-ort`} value={ortSlug} onChange={(e) => setOrtSlug(e.target.value)} className="h-11 w-full rounded-xl bg-white px-3 text-[15px] text-ink-900 outline-none ring-1 ring-inset ring-ink-200 focus:ring-2 focus:ring-ov-500">
                  {gruppen.map((g) => (
                    <optgroup key={g.land} label={g.name}>
                      {g.orte.map((o) => (
                        <option key={o.slug} value={o.slug}>
                          {o.name}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
                <p className="mt-1 text-[12px] text-ink-500">Für den Jahresertrag aus PVGIS; an PVGIS gehen nur die Koordinaten des Orts.</p>
              </div>
              <Auswahl legende="Ausrichtung laut Angebot" optionen={AUSRICHTUNGEN.map((a) => ({ id: a.id, label: a.label.split(",")[0], sub: a.label.split(", ")[1] }))} wert={ausrichtung} onChange={setAusrichtung} klein />
              <Zahlfeld label="Ertragsannahme laut Angebot (optional)" wert={ertragAngebot} onChange={setErtragAngebot} einheit="kWh/kWp" min={0} max={3000} step={1} />
              <Zahlfeld label="EAG-Zuschuss laut Angebot (optional)" wert={eagZuschuss} onChange={setEagZuschuss} einheit="€" min={0} max={100_000_000} step={1} />
            </div>
          </section>

          {/* Vollständigkeit */}
          <section className="rounded-[2rem] bg-white p-5 ring-1 ring-ink-200/70 md:p-7" aria-labelledby={`${ids}-check`}>
            <p className="text-[11.5px] font-semibold uppercase tracking-[0.16em] text-ov-700">Vollständigkeit</p>
            <h3 id={`${ids}-check`} className="mt-1 font-display text-[20px] font-extrabold leading-tight text-ink-900">
              Ist das im Angebot enthalten?
            </h3>
            <p className="mt-2 text-[14px] leading-relaxed text-ink-600">Was Sie hier offenlassen, landet in den Prüfpunkten zum Nachfragen. „Im Text erwähnt“ heißt nur, dass das Wort vorkommt – nicht, dass die Leistung enthalten ist.</p>
            <ul className="mt-5 divide-y divide-ink-100">
              {PRUEFPUNKTE.map((p) => (
                <li key={p.id} className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                  <div className="min-w-0">
                    <p className="text-[14.5px] font-semibold text-ink-900">{p.frage}</p>
                    <p className="text-[12.5px] text-ink-500">
                      {p.quelle}
                      {stichworte[p.id] && <span className="ml-2 rounded-full bg-ov-50 px-2 py-0.5 text-[11.5px] font-semibold text-ov-700">im Text erwähnt</span>}
                    </p>
                  </div>
                  <div role="radiogroup" aria-label={p.frage} className="flex shrink-0 gap-1 self-start rounded-full bg-ink-100/80 p-1 sm:self-auto">
                    {ANTWORTEN.map((a) => {
                      const aktiv = antworten[p.id] === a.id;
                      return (
                        <button
                          key={a.id}
                          type="button"
                          role="radio"
                          aria-checked={aktiv}
                          onClick={() => setAntworten((x) => ({ ...x, [p.id]: aktiv ? undefined : a.id }))}
                          className={cn("h-11 min-w-[44px] rounded-full px-3.5 text-[13px] font-semibold transition", aktiv ? "bg-white text-ink-900 shadow-[0_2px_8px_-2px_rgba(21,26,36,0.18)]" : "text-ink-600 hover:text-ink-900")}
                        >
                          {a.label}
                        </button>
                      );
                    })}
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {schritt === "eingaben" && (
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-[13px] text-ink-600">
                <p>{eingabenOk ? (gate.freigegeben ? "Freischaltung vorhanden – die Prüfung startet sofort." : "Weiter zur Freischaltung: Name und E-Mail, dann Link bestätigen.") : "Bitte Anlagenleistung und Angebotssumme netto eintragen."}</p>
                {wiederhergestellt && (
                  <p className="mt-1 text-ink-500">
                    Ihre Eingaben wurden auf diesem Gerät gemerkt (24 h).{" "}
                    <button type="button" onClick={eingabenVerwerfen} className="inline-flex min-h-11 items-center font-semibold text-ov-700 underline underline-offset-2">
                      Eingaben löschen
                    </button>
                  </p>
                )}
              </div>
              <button type="button" onClick={weiter} disabled={!eingabenOk} className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-ov-600 px-6 text-[15px] font-semibold text-white hover:bg-ov-700 disabled:cursor-not-allowed disabled:opacity-60">
                {gate.freigegeben ? "Prüfung starten" : "Weiter zur Freischaltung"}
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        {/* ---------------------------------------------------------------- Rechte Spalte: Vorschau / Gate / Ergebnis */}
        <div className="space-y-6" ref={ergebnisRef}>
          {schritt === "laeuft" && (
            <section aria-live="polite" className="ap-nicht-drucken flex flex-col items-center justify-center gap-3 rounded-[2rem] bg-white p-10 text-center ring-1 ring-ink-200/70">
              <Loader2 aria-hidden="true" className="h-8 w-8 animate-spin text-ov-600" />
              <p className="font-display text-[20px] font-extrabold text-ink-900">Prüfung läuft …</p>
              <p className="text-[14px] text-ink-600">Jahresertrag aus PVGIS holen, Kennzahlen rechnen, Prüfliste zusammenstellen.</p>
            </section>
          )}

          {schritt === "ergebnis" && ergebnis?.ok && <Ergebnis ergebnis={ergebnis} ertragInfo={ertragInfo} onDrucken={drucken} onNeu={() => setSchritt("eingaben")} angebotHref={angebotHref} ortName={region?.name} />}

          {schritt === "eingaben" && (
            <section className="ap-nicht-drucken relative overflow-hidden rounded-[2rem] bg-navy-950 p-5 text-white md:p-7" aria-labelledby={`${ids}-vorschau`}>
              <div aria-hidden="true" className="absolute -right-10 -top-16 h-48 w-48 rounded-full bg-ov-500/30 blur-[70px]" />
              <div className="relative">
                <p className="text-[11.5px] font-semibold uppercase tracking-[0.16em] text-ov-300">Vorschau · Beispielwerte</p>
                <h3 id={`${ids}-vorschau`} className="mt-1 font-display text-[20px] font-extrabold leading-tight">
                  So sieht Ihr Ergebnis aus
                </h3>
                <p className="mt-2 text-[13.5px] leading-relaxed text-white/80">Fiktives Beispiel (99,9 kWp, 84.900 € netto, Ost/West) – keine echte Anlage, kein Angebot. Ihre eigenen Prüfpunkte erscheinen hier nach der Freischaltung.</p>
                <div className="mt-5 grid grid-cols-3 gap-2">
                  <VorschauZahl label="€/kWp" wert={zahl(beispiel.kennzahlen.eurProKwp)} />
                  <VorschauZahl label="€/kWh Jahresertrag" wert={zahl(beispiel.kennzahlen.eurProKwhJahr, 2)} />
                  <VorschauZahl label="Nachfragen" wert={`${beispiel.nachfragen.length} von ${beispiel.pruefpunkte.length}`} />
                </div>
                <ul className="mt-4 space-y-1.5 text-[13.5px] text-white/80">
                  {beispiel.nachfragen.slice(0, 4).map((p) => (
                    <li key={p.id} className="flex items-start gap-2">
                      <HelpCircle aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-ov-300" />
                      {p.frage}
                    </li>
                  ))}
                  <li className="text-white/60">… und {Math.max(0, beispiel.nachfragen.length - 4)} weitere Prüfpunkte</li>
                </ul>
                <p className="mt-4 text-[12px] text-white/60">Beispiel, Stand {STAND}. Kein Urteil über Anbieter, keine Namen, keine Speicherung Ihrer Datei.</p>
              </div>
            </section>
          )}

          <Hinweis ton="info" titel="Keine Bewertung von Anbietern" className="ap-nicht-drucken">
            Das Ergebnis sind Prüfpunkte zum Nachfragen beim Anbieter – kein Urteil über Preis oder Firma. Für eine fachliche Zweitmeinung mit Ihren bestätigten Kennzahlen gibt es nach der Prüfung einen direkten Weg zur Anfrage; das PDF fordert unser Techniker bei Bedarf per E-Mail an.
          </Hinweis>
        </div>
      </div>
      {gate.dialog}
    </div>
  );
}

function Erkannt({ text }) {
  if (!text) return null;
  return (
    <p className="mt-1 flex items-start gap-1 text-[12px] text-ov-700" title={text}>
      <FileText aria-hidden="true" className="mt-0.5 h-3 w-3 shrink-0" />
      <span className="truncate">aus PDF: {text}</span>
    </p>
  );
}

function VorschauZahl({ label, wert }) {
  return (
    <div className="rounded-2xl bg-white/10 p-3 ring-1 ring-white/15">
      <p className="text-[11px] font-medium text-white/70">{label}</p>
      <p className="mt-0.5 font-display text-[19px] font-extrabold leading-tight">{wert}</p>
    </div>
  );
}

function Ergebnis({ ergebnis, ertragInfo, onDrucken, onNeu, angebotHref, ortName }) {
  const { felder, kennzahlen: kz, marktbezug: mb, eag, nachfragen, pruefpunkte, hinweise, vollstaendigkeit } = ergebnis;
  const erfuellt = pruefpunkte.filter((p) => p.status === "erfuellt");
  const zeilen = zusammenfassungZeilen(ergebnis);
  return (
    <section className="ap-druck rounded-[2rem] bg-white p-5 ring-1 ring-ink-200/70 md:p-7" aria-labelledby="ap-ergebnis-titel">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11.5px] font-semibold uppercase tracking-[0.16em] text-ov-700">Schritt 3 von 3 · Ergebnis</p>
          <h3 id="ap-ergebnis-titel" className="mt-1 font-display text-[22px] font-extrabold leading-tight text-ink-900">
            Prüfpunkte zum Nachfragen
          </h3>
        </div>
        <button type="button" onClick={onNeu} className="ap-nicht-drucken inline-flex h-11 shrink-0 items-center gap-1.5 rounded-full bg-ink-100 px-4 text-[13.5px] font-semibold text-ink-800 hover:bg-ink-200">
          <RotateCcw aria-hidden="true" className="h-4 w-4" />
          Eingaben ändern
        </button>
      </div>
      <p className="mt-2 text-[13.5px] text-ink-600">
        {zahl(felder.kwp, 1)} kWp · {zahl(felder.preisNetto)} € netto{Number(felder.speicherKwh) > 0 ? ` · Speicher ${zahl(felder.speicherKwh, 1)} kWh` : ""}
        {ortName ? ` · Standort ${ortName}` : ""}
      </p>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <Kennzahl label="Preis je kWp" zusatz="netto, Angebotssumme ÷ kWp" icon={Coins} ton="navy">
          {zahl(kz.eurProKwp)} €
        </Kennzahl>
        <Kennzahl label="Preis je kWh Jahresertrag" zusatz={kz.jahresertragKwh ? `${zahl(kz.jahresertragKwh)} kWh/a bei ${kz.ertragKwhProKwp} kWh/kWp` : "Jahresertrag nicht verfügbar"} icon={Sun} ton="gruen">
          {kz.eurProKwhJahr ? `${zahl(kz.eurProKwhJahr, 2)} €` : "–"}
        </Kennzahl>
        <Kennzahl label="Vollständigkeit" zusatz={`${vollstaendigkeit.erfuellt} von ${vollstaendigkeit.gesamt} Punkten ausgewiesen`} icon={ClipboardList} ton="sand">
          {vollstaendigkeit.offen} offen
        </Kennzahl>
      </div>
      {ertragInfo && <p className="mt-2 text-[12px] text-ink-500">Jahresertrag: {ertragInfo.quelle}. Richtwert zur Orientierung.</p>}

      {mb && (
        <div className="mt-4 rounded-2xl bg-sand-50 p-4 ring-1 ring-ink-200/60">
          <p className="text-[13.5px] font-semibold text-ink-900">
            Marktbezug {mb.label}: {zahl(mb.eurProKwp)} €/kWp netto
          </p>
          <p className="mt-1 text-[12.5px] text-ink-600">
            {mb.quelle}, Stand {mb.stand}. {mb.hinweis}
          </p>
        </div>
      )}
      {!mb && (
        <p className="mt-3 text-[12.5px] text-ink-500">
          Einen Marktbezug zeigt das Werkzeug nur für 5-kWp-Kleinanlagen (BMWET-Marktstatistik 2024). Richtwerte je Größenklasse:{" "}
          <Link href="/ratgeber/solaranlage-kosten" className="underline underline-offset-2">
            Photovoltaik Kosten
          </Link>
          .
        </p>
      )}

      {eag && (
        <p className={cn("mt-3 flex items-start gap-2 rounded-xl p-3 text-[13.5px] ring-1", eag.ueberGrenze ? "bg-sun-400/15 text-ink-900 ring-sun-400/50" : "bg-ov-50 text-ink-800 ring-ov-100")}>
          <AlertCircle aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
          EAG-Zuschuss laut Angebot: {zahl(eag.zuschuss)} € = {Math.round(eag.anteil * 100)} % der Angebotssumme. Die EAG-IZV deckelt bei {Math.round(eag.maxAnteil * 100)} % (hier {zahl(eag.maxBetrag)} €).
        </p>
      )}

      {hinweise.map((h) => (
        <p key={h} className="mt-3 flex items-start gap-2 text-[13.5px] text-ink-700">
          <AlertCircle aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-ov-600" />
          {h}
        </p>
      ))}

      <h4 className="mt-6 font-display text-[17px] font-extrabold text-ink-900">
        Beim Anbieter nachfragen <span className="text-ink-500">({nachfragen.length})</span>
      </h4>
      {nachfragen.length === 0 ? (
        <p className="mt-2 text-[14px] text-ink-700">Alle Prüfpunkte sind laut Ihren Angaben im Angebot ausgewiesen. Lassen Sie sich die Nachweise (Statik, Konformität, Prüfbefund) als Unterlagen geben.</p>
      ) : (
        <ol className="mt-3 space-y-3">
          {nachfragen.map((p, i) => (
            <li key={p.id} className="flex gap-3 rounded-2xl bg-sand-50 p-4 ring-1 ring-ink-200/60">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-navy-950 text-[12.5px] font-bold text-white">{i + 1}</span>
              <div className="min-w-0">
                <p className="text-[14.5px] font-semibold text-ink-900">
                  {p.frage}
                  {p.antwort === "nein" && <span className="ml-2 rounded-full bg-ink-100 px-2 py-0.5 text-[11.5px] font-semibold text-ink-700">laut Ihnen nicht enthalten</span>}
                  {p.antwort === "unklar" && p.imText && <span className="ml-2 rounded-full bg-ov-50 px-2 py-0.5 text-[11.5px] font-semibold text-ov-700">im Text erwähnt – Umfang klären</span>}
                </p>
                <p className="mt-1 text-[13.5px] leading-relaxed text-ink-600">{p.warum}</p>
                {p.zusatz && <p className="mt-1 text-[13px] font-medium text-ink-800">{p.zusatz}</p>}
                <p className="mt-1 text-[12px] text-ink-500">Grundlage: {p.quelle}</p>
              </div>
            </li>
          ))}
        </ol>
      )}

      {erfuellt.length > 0 && (
        <details className="mt-4 rounded-2xl bg-ov-50/60 p-4 ring-1 ring-ov-100">
          <summary className="cursor-pointer text-[14px] font-semibold text-ink-900">Laut Ihren Angaben ausgewiesen ({erfuellt.length})</summary>
          <ul className="mt-2 space-y-1 text-[13.5px] text-ink-700">
            {erfuellt.map((p) => (
              <li key={p.id} className="flex items-start gap-2">
                <CheckCircle2 aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-ov-600" />
                {p.frage}
              </li>
            ))}
          </ul>
        </details>
      )}

      <div className="ap-nicht-drucken mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <button type="button" onClick={onDrucken} className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-ink-100 px-5 text-[14.5px] font-semibold text-ink-800 hover:bg-ink-200">
          <Printer aria-hidden="true" className="h-4 w-4" />
          Prüfliste drucken
        </button>
        <Link href={angebotHref} className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-ov-600 px-6 text-[15px] font-semibold text-white hover:bg-ov-700">
          Zweitmeinung mit diesen Kennzahlen anfragen
          <ArrowRight aria-hidden="true" className="h-4 w-4" />
        </Link>
      </div>
      <p className="ap-nicht-drucken mt-3 text-[12.5px] leading-relaxed text-ink-500">Übergeben werden nur die bestätigten Kennzahlen (kWp, Speicher) – keine Datei, keine Anbieterdaten. Das Angebots-PDF fordert unser Techniker bei Bedarf per E-Mail bei Ihnen an.</p>

      {/* Druckfassung: Kurzzeilen und Fuß */}
      <div className="ap-nur-druck mt-6 text-[12px] text-ink-700">
        {zeilen.map((z) => (
          <p key={z}>{z}</p>
        ))}
      </div>
      <p className="mt-5 text-[12px] leading-relaxed text-ink-500">
        Richtwerte zur Orientierung, kein Angebot, kein Urteil über Anbieter. Quellen: BMWET-Marktstatistik 2024, PVGIS (EU-Kommission, JRC), EAG-IZV, ÖNORM B 1991-1-3, OVE R 11-1, TOR Erzeuger. Angaben Ökovolt Österreich · Stand {STAND}. Steuerliche und rechtliche Fragen mit Ihrer Beratung klären.
      </p>
    </section>
  );
}

const DRUCK_CSS = `
.ap-nur-druck { display: none; }
@media print {
  body * { visibility: hidden !important; }
  .ap-druck, .ap-druck * { visibility: visible !important; }
  .ap-druck { position: absolute; left: 0; top: 0; width: 100%; box-shadow: none !important; }
  .ap-nicht-drucken { display: none !important; }
  .ap-nur-druck { display: block; }
}`;

