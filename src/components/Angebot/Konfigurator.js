"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BatteryCharging,
  Building2,
  Check,
  CheckCircle2,
  Factory,
  Home,
  Hotel,
  Landmark,
  Loader2,
  Lock,
  Mountain,
  Phone,
  PlugZap,
  ShieldCheck,
  Sparkles,
  Sun,
  Thermometer,
  Tractor,
  Wrench,
  Zap,
} from "lucide-react";

import { berechne, empfohlenerSpeicher } from "@/lib/solarrechner";
import { ereignis } from "@/lib/statistik";
import { submitAnfrage } from "@/lib/api/anfrage/create_anfrage";
import { FIRMA } from "@/lib/site";

/*
 * Angebots-Konfigurator Österreich (Gewerbe-Fokus).
 *
 * API-Vertrag (/api/create_anfrage -> oekovolt_app…angebot.submit_angebot) bleibt
 * unverändert: vorhaben, gebaeudetyp, eigentuemer, dachform, dachausrichtung,
 * jahresverbrauch_kwh, startzeitpunkt, vorname, nachname, email, telefon, plz,
 * ort, einwilligung, ergebnis{…}, website.
 * Gewerbe-Angaben, die das Backend (noch) nicht als eigene Felder kennt
 * (Unternehmen, Lastgang, Netzebene, Wunschleistung, Fläche), werden als Text
 * zusammengefasst: in `ergebnis.angaben` (wird mit dem Ergebnis gespeichert)
 * und zusätzlich in `nachricht` (vom Backend ignoriert, solange es das Feld
 * nicht kennt – Frappe verwirft unbekannte Argumente).
 */

/* ------------------------------------------------------------------ */
/* Optionen                                                            */
/* ------------------------------------------------------------------ */

const OBJEKTE = [
  { id: "gewerbe", label: "Gewerbe & Industrie", text: "Halle, Produktion, Handel, Logistik", icon: Factory },
  { id: "landwirtschaft", label: "Landwirtschaft", text: "Stall, Scheune, Maschinenhalle", icon: Tractor },
  { id: "freiflaeche", label: "Freifläche / Agri-PV", text: "Solarpark oder Doppelnutzung", icon: Sun },
  { id: "hotellerie", label: "Hotellerie & Tourismus", text: "Hotel, Bergbahn, Therme", icon: Hotel },
  { id: "gemeinde", label: "Gemeinde & öffentliche Hand", text: "Schule, Bauhof, Kläranlage", icon: Landmark },
  { id: "chalet", label: "Chalet & Premium-Objekt", text: "Alpine Lage, Indach, Concierge", icon: Mountain },
  { id: "privat", label: "Ein- oder Mehrfamilienhaus", text: "Privates Wohngebäude", icon: Home },
  { id: "sonstiges", label: "Anderes Objekt", text: "Verein, Kirche, Parkplatz …", icon: Building2 },
];
const PRIVAT = ["privat", "chalet"];
const OBJEKT_ALIAS = { agri: "freiflaeche" };

const VORHABEN = [
  { id: "pv", label: "Photovoltaik-Anlage", text: "Dach, Fassade oder Carport", icon: Sun },
  { id: "freiflaeche", label: "Freiflächen- / Agri-PV", text: "Anlage auf der Fläche", icon: Sun, nurGewerbe: true },
  { id: "speicher", label: "Stromspeicher", text: "Peak Shaving, Eigenverbrauch", icon: BatteryCharging },
  { id: "wallbox", label: "Ladeinfrastruktur", text: "Wallbox bis Ladepark", icon: PlugZap },
  { id: "waermepumpe", label: "Wärmepumpe", text: "Heizen mit Solarstrom", icon: Thermometer, nurPrivat: true },
  { id: "notstrom", label: "Notstrom", text: "Versorgung bei Netzausfall", icon: Zap },
  { id: "service", label: "Wartung & Prüfung", text: "Für eine Bestandsanlage", icon: Wrench },
];

const DAECHER = [
  { id: "Flachdach", pfad: "M8 26 H56 V32 H8 Z", neigung: "flach", qm: 7 },
  { id: "Satteldach", pfad: "M6 34 L32 12 L58 34 Z", neigung: "mittel", qm: 5 },
  { id: "Pultdach", pfad: "M8 34 L56 16 V34 Z", neigung: "mittel", qm: 5 },
  { id: "Freifläche", pfad: "M4 34 L14 24 L24 34 M24 34 L34 24 L44 34 M44 34 L54 24 L60 30", neigung: "mittel", qm: 12, linie: true },
  { id: "Sonstiges", pfad: "M8 34 L20 20 H44 L56 34 Z", neigung: "mittel", qm: 6 },
];

const EIGENTUEMER = [
  { id: "yes", label: "Ja, Eigentümer" },
  { id: "no", label: "Nein – Miete oder Pacht" },
];

const AUSRICHTUNG = [
  { id: "sued", label: "Süd" },
  { id: "suedost", label: "Südost / Südwest" },
  { id: "ost-west", label: "Ost / West" },
  { id: "unbekannt", label: "Weiß ich nicht" },
];

const LASTGANG = [
  { id: "ja", label: "Ja, liegt vor" },
  { id: "nein", label: "Nein" },
  { id: "unbekannt", label: "Weiß ich nicht" },
];

const NETZEBENE = [
  { id: "7", label: "NE 7 · Niederspannung" },
  { id: "6", label: "NE 6 · eigene Trafostation" },
  { id: "5", label: "NE 5 · Mittelspannung" },
  { id: "4", label: "NE 4 oder höher" },
  { id: "unbekannt", label: "Weiß ich nicht" },
];

const VERBRAUCH_GEWERBE = [50000, 100000, 250000, 500000, 1000000, 2500000];
const VERBRAUCH_PRIVAT = [
  { p: 1, kwh: 1500 },
  { p: 2, kwh: 2500 },
  { p: 3, kwh: 3500 },
  { p: 4, kwh: 4500 },
  { p: 5, kwh: 5500 },
];

const ZEITPLAN = ["So bald wie möglich", "In den nächsten 3 Monaten", "In 3–12 Monaten", "Später / Budgetplanung"];

const SCHRITTE = ["Vorhaben", "Objekt", "Fläche", "Verbrauch & Netz", "Kontakt"];
const SPEICHER_KEY = "ov_angebot_entwurf_at_v1";

const zahl = (n) => Math.round(n).toLocaleString("de-AT");
const eur = (n) => zahl(n) + " €";
const rundeKwp = (k) => (k >= 100 ? Math.round(k / 10) * 10 : k >= 30 ? Math.round(k / 5) * 5 : Math.round(k * 2) / 2);

/** EAG-Kategorie nach Engpassleistung (Stand 2026) */
const eagKategorie = (kwp) => (kwp <= 10 ? "A (bis 10 kWp)" : kwp <= 20 ? "B (10–20 kWp)" : kwp <= 100 ? "C (20–100 kWp)" : "D (über 100 kWp)");
/** TOR-Erzeuger-Typ – Näherung über die kWp (maßgeblich ist die Wechselrichter-/Anschlussleistung) */
const torTyp = (kwp) => (kwp < 250 ? "Typ A" : kwp < 35000 ? "Typ B" : "Typ C/D");

/* ------------------------------------------------------------------ */

export default function Konfigurator() {
  const params = useSearchParams();
  const [schritt, setSchritt] = useState(0);
  const [richtung, setRichtung] = useState(1);
  const [status, setStatus] = useState(null); // null | "senden" | "ok" | "fehler"
  const [fehler, setFehler] = useState({});
  const kopfRef = useRef(null);
  const website = useRef(null); // Honeypot gegen Spam-Bots – bleibt für Menschen leer

  const [f, setF] = useState({
    vorhaben: ["pv"],
    objekt: "gewerbe",
    eigentuemer: "yes",
    dach: "Flachdach",
    ausrichtung: "sued",
    flaeche: "",
    verbrauch: 250000,
    lastgang: "unbekannt",
    netzebene: "unbekannt",
    kwpWunsch: "",
    zeitplan: ZEITPLAN[1],
    firma: "",
    vorname: "",
    nachname: "",
    email: "",
    telefon: "",
    plz: "",
    ort: "",
    agb: false,
  });

  const istPrivat = PRIVAT.includes(f.objekt);

  // Vorbelegung: ?objekt=gewerbe|agri|… (Startseite), ?verbrauch=&kwp=&speicher=&wallbox=1&waermepumpe=1 (Rechner) oder Entwurf
  useEffect(() => {
    let entwurf = null;
    try {
      entwurf = JSON.parse(localStorage.getItem(SPEICHER_KEY) || "null");
    } catch {}
    const objektRoh = params.get("objekt");
    const objektParam = OBJEKT_ALIAS[objektRoh] || objektRoh;
    const objekt = OBJEKTE.some((o) => o.id === objektParam) ? objektParam : null;
    const v = Number(params.get("verbrauch"));
    const kwpParam = Number(params.get("kwp"));
    const extra = [];
    if (params.get("speicher") && Number(params.get("speicher")) > 0) extra.push("speicher");
    if (params.get("wallbox") === "1") extra.push("wallbox");
    if (params.get("waermepumpe") === "1") extra.push("waermepumpe");
    // Kommt die Anfrage aus einem Haushalts-Rechner, ist das Objekt ein Wohngebäude
    const ausRechner = v > 500 || extra.includes("waermepumpe");
    const objektNeu = objekt || (ausRechner && v <= 30000 ? "privat" : null);

    setF((alt) => {
      const basis = { ...alt, ...(entwurf || {}), agb: false };
      if (objektNeu) {
        basis.objekt = objektNeu;
        if (objektNeu === "freiflaeche") {
          basis.dach = "Freifläche";
          basis.vorhaben = ["freiflaeche"];
        } else if (PRIVAT.includes(objektNeu)) {
          basis.dach = "Satteldach";
          if (basis.verbrauch > 30000) basis.verbrauch = 4500;
        }
      }
      if (v > 500) basis.verbrauch = v <= 30000 ? Math.min(Math.max(Math.round(v / 250) * 250, 1500), 30000) : Math.round(v);
      if (extra.length) basis.vorhaben = Array.from(new Set(["pv", ...extra]));
      if (kwpParam > 0) basis.kwpOverride = kwpParam;
      return basis;
    });
  }, [params]);

  const setze = (k, v) => {
    setF((alt) => ({ ...alt, [k]: v }));
    setFehler((e) => ({ ...e, [k]: undefined }));
  };

  const setzeObjekt = (id) => {
    setF((alt) => {
      const privatNeu = PRIVAT.includes(id);
      const neu = { ...alt, objekt: id };
      if (privatNeu && alt.verbrauch > 30000) neu.verbrauch = 4500;
      if (!privatNeu && alt.verbrauch <= 30000 && PRIVAT.includes(alt.objekt)) neu.verbrauch = 250000;
      if (id === "freiflaeche") neu.dach = "Freifläche";
      else if (alt.dach === "Freifläche") neu.dach = privatNeu ? "Satteldach" : "Flachdach";
      // Vorhaben, die zum Objekt nicht passen, entfernen
      neu.vorhaben = alt.vorhaben.filter((v) => {
        const o = VORHABEN.find((x) => x.id === v);
        return !(o?.nurPrivat && !privatNeu) && !(o?.nurGewerbe && privatNeu);
      });
      if (!neu.vorhaben.length) neu.vorhaben = [id === "freiflaeche" ? "freiflaeche" : "pv"];
      return neu;
    });
  };

  const toggleVorhaben = (id) => setze("vorhaben", f.vorhaben.includes(id) ? f.vorhaben.filter((x) => x !== id) : [...f.vorhaben, id]);

  const vorhabenSichtbar = VORHABEN.filter((v) => !(v.nurPrivat && !istPrivat) && !(v.nurGewerbe && istPrivat));

  /* ---------------- Ersteinschätzung ---------------- */
  const schaetzung = useMemo(() => {
    const dach = DAECHER.find((d) => d.id === f.dach) || DAECHER[0];
    const ausr = f.ausrichtung === "unbekannt" ? "suedost" : f.ausrichtung;
    const neigung = dach.neigung;
    const flaeche = Number(String(f.flaeche).replace(/\D/g, "")) || 0;
    const wunsch = Number(String(f.kwpWunsch).replace(",", ".").replace(/[^\d.]/g, "")) || 0;

    if (istPrivat) {
      const zusatz = (f.vorhaben.includes("waermepumpe") ? 3500 : 0) + (f.vorhaben.includes("wallbox") ? 2500 : 0);
      const gesamt = f.verbrauch + zusatz;
      const kwpBerechnet = Math.min(Math.max(Math.round((gesamt / 1000) * 1.4 * 2) / 2, 5), 30);
      const kwp = wunsch > 0 ? wunsch : f.kwpOverride > 0 ? f.kwpOverride : kwpBerechnet;
      const speicherKwh = f.vorhaben.includes("speicher") ? Math.min(empfohlenerSpeicher(gesamt), 15) : 0;
      const r = berechne({ kwp, ausrichtung: ausr, neigung, verbrauch: gesamt, speicherKwh });
      return { modus: "privat", speicherKwh, gesamt, zusatz, ...r, kwp, flaecheBedarf: kwp * dach.qm };
    }

    // Gewerbe: Richtwert für eine eigenverbrauchsorientierte Auslegung – bilanziell rund 70 %
    // des Jahresverbrauchs, begrenzt durch die angegebene Fläche. Keine Preise: die hängen im
    // Gewerbe zu stark von Dach, Netzanschluss und Regelungstechnik ab.
    const gesamt = f.verbrauch;
    const probe = berechne({ kwp: 100, ausrichtung: ausr, neigung, verbrauch: gesamt, speicherKwh: 0 });
    const spez = probe.spezifischerErtrag || 1000;
    let kwp;
    if (wunsch > 0) kwp = wunsch;
    else if (f.dach === "Freifläche" && flaeche > 0) kwp = flaeche / dach.qm;
    else {
      kwp = (gesamt * 0.7) / spez;
      if (flaeche > 0) kwp = Math.min(kwp, flaeche / dach.qm);
    }
    kwp = Math.max(rundeKwp(kwp), 10);
    const jahresertrag = kwp * spez;
    return {
      modus: "gewerbe",
      gesamt,
      zusatz: 0,
      kwp,
      speicherKwh: 0,
      jahresertrag,
      spezifischerErtrag: spez,
      deckung: gesamt > 0 ? jahresertrag / gesamt : 0,
      flaecheBedarf: kwp * dach.qm,
      flaecheBegrenzt: flaeche > 0 && wunsch === 0 && f.dach !== "Freifläche" && kwp < rundeKwp((gesamt * 0.7) / spez),
      eag: eagKategorie(kwp),
      tor: torTyp(kwp),
    };
  }, [istPrivat, f.vorhaben, f.verbrauch, f.dach, f.ausrichtung, f.flaeche, f.kwpWunsch, f.kwpOverride]);

  /** Ergebnis-Objekt für die API – gleiche Schlüssel wie bisher, Geldwerte nur im Privatmodus. */
  const ergebnisFuerApi = (s) =>
    s.modus === "privat"
      ? {
          berechnungsbasis_kwh: s.gesamt,
          anlagengroesse_kwp: s.kwp,
          speicher_kwh: s.speicherKwh || 0,
          jahresertrag_kwh: Math.round(s.jahresertrag),
          autarkie_prozent: Math.round(s.autarkie * 100),
          vorteil_pro_jahr: Math.round(s.nutzenProJahr),
          investition_von: Math.round(s.investition * 0.9),
          investition_bis: Math.round(s.investition * 1.15),
          amortisation_jahre: s.amortisationJahre ? Number(s.amortisationJahre.toFixed(1)) : null,
        }
      : {
          berechnungsbasis_kwh: s.gesamt,
          anlagengroesse_kwp: s.kwp,
          speicher_kwh: 0,
          jahresertrag_kwh: Math.round(s.jahresertrag),
          autarkie_prozent: null,
          vorteil_pro_jahr: null,
          investition_von: null,
          investition_bis: null,
          amortisation_jahre: null,
        };

  useEffect(() => {
    if (status === "ok") return;
    try {
      const { agb, ...rest } = f;
      localStorage.setItem(SPEICHER_KEY, JSON.stringify(rest));
    } catch {}
  }, [f, status]);

  /* ---------------- Validierung & Navigation ---------------- */
  const pruefen = (s) => {
    const e = {};
    if (s === 0 && f.vorhaben.length === 0) e.vorhaben = "Bitte wählen Sie mindestens ein Vorhaben.";
    if (s === 3 && !(f.verbrauch > 0)) e.verbrauch = "Bitte einen (geschätzten) Jahresverbrauch angeben.";
    if (s === 4) {
      if (!f.vorname.trim()) e.vorname = "Bitte Vornamen angeben.";
      if (!f.nachname.trim()) e.nachname = "Bitte Nachnamen angeben.";
      if (!/^\S+@\S+\.\S+$/.test(f.email)) e.email = "Bitte gültige E-Mail-Adresse angeben.";
      if (!/^[\d\s+()/-]{6,}$/.test(f.telefon)) e.telefon = "Bitte Telefonnummer angeben.";
      if (!/^\d{4,5}$/.test(f.plz.trim())) e.plz = "Postleitzahl (4-stellig)";
      if (!f.ort.trim()) e.ort = "Bitte Ort angeben.";
      if (!f.agb) e.agb = "Bitte stimmen Sie zu, damit wir Sie kontaktieren dürfen.";
    }
    setFehler(e);
    return Object.keys(e).length === 0;
  };

  const gehe = (ziel) => {
    if (ziel > schritt && !pruefen(schritt)) return;
    setRichtung(ziel > schritt ? 1 : -1);
    setSchritt(ziel);
    requestAnimationFrame(() => {
      const top = kopfRef.current?.getBoundingClientRect().top;
      if (top !== undefined && (top < 80 || top > window.innerHeight * 0.5)) {
        window.scrollTo({ top: window.scrollY + top - 110, behavior: "smooth" });
      }
      kopfRef.current?.focus({ preventScroll: true });
    });
  };

  const absenden = async () => {
    if (!pruefen(4)) return;
    setStatus("senden");

    const label = (liste, id) => liste.find((x) => x.id === id)?.label;
    const objektLabel = label(OBJEKTE, f.objekt);

    // Angaben ohne eigenes Backend-Feld -> Text
    const angaben = [
      f.firma.trim() && `Unternehmen/Organisation: ${f.firma.trim()}`,
      `Objekt: ${objektLabel}`,
      `Vorhaben: ${f.vorhaben.map((v) => label(VORHABEN, v)).filter(Boolean).join(", ")}`,
      f.flaeche && `Verfügbare Fläche: ca. ${zahl(Number(String(f.flaeche).replace(/\D/g, "")))} m²`,
      !istPrivat && `Lastgang (15-Minuten-Werte): ${label(LASTGANG, f.lastgang)}`,
      !istPrivat && `Netzebene: ${label(NETZEBENE, f.netzebene)}`,
      f.kwpWunsch && `Wunschleistung: ${f.kwpWunsch} kWp`,
      `Richtwert Konfigurator: ${zahl(schaetzung.kwp)} kWp, ca. ${zahl(schaetzung.jahresertrag)} kWh/Jahr`,
    ]
      .filter(Boolean)
      .join("\n");

    const basis = {
      vorhaben: f.vorhaben,
      gebaeudetyp: objektLabel,
      eigentuemer: label(EIGENTUEMER, f.eigentuemer),
      dachform: f.dach,
      dachausrichtung: label(AUSRICHTUNG, f.ausrichtung),
      jahresverbrauch_kwh: f.verbrauch,
      startzeitpunkt: f.zeitplan,

      vorname: f.vorname.trim(),
      nachname: f.nachname.trim(),
      email: f.email.trim(),
      telefon: f.telefon.trim(),
      plz: f.plz.trim(),
      ort: f.ort.trim(),
      einwilligung: f.agb ? 1 : 0,

      ergebnis: { ...ergebnisFuerApi(schaetzung), angaben },
      nachricht: angaben,

      website: website.current?.value || "",
    };

    try {
      await submitAnfrage(basis);
      setStatus("ok");
      ereignis("angebot_angefragt", { kwp: schaetzung.kwp, objekt: f.objekt });
      try {
        localStorage.removeItem(SPEICHER_KEY);
      } catch {}
    } catch {
      setStatus("fehler");
    }
  };

  const fortschritt = status === "ok" ? 100 : ((schritt + 1) / SCHRITTE.length) * 100;

  /* ---------------- Render ---------------- */
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_380px] lg:items-start">
      <div className="overflow-hidden rounded-[2rem] bg-white shadow-[0_40px_80px_-40px_rgba(3,18,43,0.45)] ring-1 ring-ink-200/70">
        {/* Kopf mit Fortschritt */}
        <div className="border-b border-ink-100 px-6 pb-5 pt-6 md:px-10 md:pt-8">
          <div className="flex items-center justify-between gap-4 text-[13px] text-ink-500">
            <span className="font-semibold text-ov-700">{status === "ok" ? "Fertig" : `Schritt ${schritt + 1} von ${SCHRITTE.length}`}</span>
            <span className="flex items-center gap-1.5">
              <Lock aria-hidden="true" className="h-3.5 w-3.5" /> Kostenlos & unverbindlich
            </span>
          </div>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-ink-100" role="progressbar" aria-valuenow={Math.round(fortschritt)} aria-valuemin={0} aria-valuemax={100} aria-label="Fortschritt">
            <div className="h-full rounded-full bg-gradient-to-r from-ov-400 to-ov-600 transition-[width] duration-700 ease-out" style={{ width: `${fortschritt}%` }} />
          </div>
          <ol className="mt-4 hidden gap-2 sm:flex">
            {SCHRITTE.map((s, i) => (
              <li key={s} className="flex-1">
                <button
                  type="button"
                  disabled={i > schritt || status === "ok"}
                  onClick={() => gehe(i)}
                  className={`w-full text-left text-[12.5px] font-medium transition-colors ${i === schritt ? "text-ink-900" : i < schritt ? "text-ov-700 hover:text-ov-800" : "text-ink-500"}`}
                >
                  {i < schritt && <Check aria-hidden="true" className="-mt-0.5 mr-1 inline h-3.5 w-3.5" />}
                  {s}
                </button>
              </li>
            ))}
          </ol>
        </div>

        <div className="relative px-6 py-8 md:px-10 md:py-10">
          <h2 ref={kopfRef} tabIndex={-1} className="sr-only" aria-live="polite">
            {status === "ok" ? "Anfrage gesendet" : SCHRITTE[schritt]}
          </h2>

          <input ref={website} type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 opacity-0" />

          {status === "ok" ? (
            <Erfolg vorname={f.vorname} privat={istPrivat} />
          ) : (
            <div key={schritt} className={richtung > 0 ? "ov-step-vor" : "ov-step-zurueck"}>
              {schritt === 0 && (
                <Frage titel="Was möchten Sie umsetzen?" hinweis="Mehrfachauswahl möglich – wir stimmen alles aufeinander und auf Ihren Netzanschluss ab.">
                  <div className="grid gap-3 sm:grid-cols-2">
                    {vorhabenSichtbar.map((v) => (
                      <Kachel key={v.id} aktiv={f.vorhaben.includes(v.id)} onClick={() => toggleVorhaben(v.id)} icon={v.icon} titel={v.label} text={v.text} mehrfach />
                    ))}
                  </div>
                  <Fehler text={fehler.vorhaben} />
                </Frage>
              )}

              {schritt === 1 && (
                <Frage titel="Um welches Objekt geht es?" hinweis="Unser Schwerpunkt sind Betriebe, Landwirtschaft und die öffentliche Hand – in ganz Österreich.">
                  <div className="grid gap-3 sm:grid-cols-2">
                    {OBJEKTE.map((o) => (
                      <Kachel key={o.id} aktiv={f.objekt === o.id} onClick={() => setzeObjekt(o.id)} icon={o.icon} titel={o.label} text={o.text} />
                    ))}
                  </div>
                  <p id="ov-eigentuemer-frage" className="mb-3 mt-8 text-[15px] font-semibold text-ink-900">
                    Sind Sie Eigentümer von Gebäude bzw. Fläche?
                  </p>
                  <Segment optionen={EIGENTUEMER} wert={f.eigentuemer} onChange={(v) => setze("eigentuemer", v)} name="eigentuemer" umbrechen />
                </Frage>
              )}

              {schritt === 2 && (
                <Frage
                  titel={f.objekt === "freiflaeche" ? "Wie groß ist die Fläche?" : "Wo soll die Anlage hin?"}
                  hinweis="Ost/West-Belegungen auf Flachdächern passen oft sehr gut zum Tagesverbrauch eines Betriebs."
                >
                  <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
                    {DAECHER.map((d) => {
                      const aktiv = f.dach === d.id;
                      return (
                        <button
                          key={d.id}
                          type="button"
                          aria-pressed={aktiv}
                          onClick={() => setze("dach", d.id)}
                          className={`group flex flex-col items-center gap-3 rounded-2xl border-2 p-4 transition-all duration-300 ${aktiv ? "border-ov-500 bg-ov-50 shadow-md" : "border-ink-200 bg-white hover:border-ink-300"}`}
                        >
                          <svg viewBox="0 0 64 44" aria-hidden="true" className="h-14 w-20">
                            {!d.linie && <rect x="12" y="32" width="40" height="10" rx="1" className={aktiv ? "fill-ov-200" : "fill-ink-200"} />}
                            {d.linie ? (
                              <>
                                <rect x="2" y="36" width="60" height="4" rx="1" className={aktiv ? "fill-ov-200" : "fill-ink-200"} />
                                <path d={d.pfad} strokeWidth="3" fill="none" className={`transition-colors ${aktiv ? "stroke-ov-500" : "stroke-ink-400 group-hover:stroke-ink-500"}`} />
                              </>
                            ) : (
                              <path d={d.pfad} className={`transition-colors ${aktiv ? "fill-ov-500" : "fill-ink-400 group-hover:fill-ink-500"}`} />
                            )}
                          </svg>
                          <span className={`text-[14.5px] font-semibold ${aktiv ? "text-ov-800" : "text-ink-700"}`}>{d.id}</span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-8 grid gap-4 sm:grid-cols-2">
                    <Feld
                      id="flaeche"
                      label={f.dach === "Freifläche" ? "Verfügbare Fläche in m² (1 ha = 10.000 m²)" : "Nutzbare Dachfläche in m² (optional)"}
                      wert={f.flaeche}
                      setze={setze}
                      inputMode="numeric"
                      placeholder={f.dach === "Freifläche" ? "z. B. 20000" : "z. B. 2500"}
                    />
                  </div>

                  {f.dach !== "Freifläche" && (
                    <>
                      <p id="ov-ausrichtung-frage" className="mb-3 mt-8 text-[15px] font-semibold text-ink-900">
                        Ausrichtung der größten Dachfläche
                      </p>
                      <Segment optionen={AUSRICHTUNG} wert={f.ausrichtung} onChange={(v) => setze("ausrichtung", v)} name="ausrichtung" umbrechen />
                    </>
                  )}
                </Frage>
              )}

              {schritt === 3 && (
                <Frage
                  titel={istPrivat ? "Wie hoch ist Ihr Stromverbrauch?" : "Verbrauch und Netzanschluss"}
                  hinweis={
                    istPrivat
                      ? "Steht auf Ihrer Jahresabrechnung. Schätzen genügt – wir prüfen das im Gespräch."
                      : "Jahresverbrauch und Netzebene stehen auf Ihrer Strom- bzw. Netzrechnung. Schätzen genügt – den Lastgang werten wir später gemeinsam aus."
                  }
                >
                  {istPrivat ? (
                    <>
                      <div className="mb-6 flex flex-wrap gap-2">
                        {VERBRAUCH_PRIVAT.map((o) => (
                          <button
                            key={o.p}
                            type="button"
                            onClick={() => setze("verbrauch", o.kwh)}
                            className={`h-11 rounded-full px-4 text-[14px] font-semibold transition-all ${f.verbrauch === o.kwh ? "bg-ink-900 text-white" : "bg-ink-100 text-ink-700 hover:bg-ink-200"}`}
                          >
                            {o.p}
                            {o.p === 5 ? "+" : ""} {o.p === 1 ? "Person" : "Personen"}
                          </button>
                        ))}
                      </div>
                      <div className="rounded-2xl bg-sand-50 p-6 ring-1 ring-ink-100">
                        <div className="flex items-baseline justify-between">
                          <label htmlFor="ov-verbrauch" className="text-[15px] font-semibold text-ink-900">
                            Jahresverbrauch (ohne neue Geräte)
                          </label>
                          <output htmlFor="ov-verbrauch" className="ov-num font-display text-[28px] font-extrabold text-ink-900">
                            {zahl(f.verbrauch)} <span className="text-[16px] font-bold text-ink-600">kWh</span>
                          </output>
                        </div>
                        <input
                          id="ov-verbrauch"
                          type="range"
                          min={1500}
                          max={30000}
                          step={250}
                          value={Math.min(Math.max(f.verbrauch, 1500), 30000)}
                          onChange={(e) => setze("verbrauch", Number(e.target.value))}
                          aria-valuetext={`${zahl(f.verbrauch)} Kilowattstunden pro Jahr`}
                          className="ov-range mt-5"
                          style={{ "--ov-fill": `${((Math.min(Math.max(f.verbrauch, 1500), 30000) - 1500) / 28500) * 100}%` }}
                        />
                        <div className="mt-2 flex justify-between text-[12px] text-ink-600">
                          <span>1.500</span>
                          <span>30.000 kWh</span>
                        </div>
                        {schaetzung.zusatz > 0 && (
                          <p className="mt-4 flex items-start gap-2 text-[13.5px] leading-relaxed text-ink-600">
                            <Sparkles aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-ov-600" />
                            Für {f.vorhaben.includes("waermepumpe") && "Wärmepumpe"}
                            {f.vorhaben.includes("waermepumpe") && f.vorhaben.includes("wallbox") && " und "}
                            {f.vorhaben.includes("wallbox") && "E-Auto"} rechnen wir zusätzlich rund {zahl(schaetzung.zusatz)} kWh ein.
                          </p>
                        )}
                      </div>
                    </>
                  ) : (
                    <>
                      <p id="ov-verbrauch-frage" className="mb-3 text-[15px] font-semibold text-ink-900">
                        Jahresstromverbrauch (kWh)
                      </p>
                      <div role="group" aria-labelledby="ov-verbrauch-frage" className="mb-4 flex flex-wrap gap-2">
                        {VERBRAUCH_GEWERBE.map((kwh) => (
                          <button
                            key={kwh}
                            type="button"
                            aria-pressed={f.verbrauch === kwh}
                            onClick={() => setze("verbrauch", kwh)}
                            className={`h-11 rounded-full px-4 text-[14px] font-semibold transition-all ${f.verbrauch === kwh ? "bg-ink-900 text-white" : "bg-ink-100 text-ink-700 hover:bg-ink-200"}`}
                          >
                            {kwh >= 1000000 ? `${(kwh / 1000000).toLocaleString("de-AT")} Mio.` : zahl(kwh)}
                            {kwh === VERBRAUCH_GEWERBE[VERBRAUCH_GEWERBE.length - 1] ? "+" : ""}
                          </button>
                        ))}
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <Feld
                          id="verbrauch"
                          label="Genauer Wert in kWh pro Jahr"
                          wert={f.verbrauch ? String(f.verbrauch) : ""}
                          setze={(k, v) => setze(k, Number(String(v).replace(/\D/g, "")) || 0)}
                          fehler={fehler.verbrauch}
                          inputMode="numeric"
                        />
                        <Feld id="kwpWunsch" label="Gewünschte Leistung in kWp (optional)" wert={f.kwpWunsch} setze={setze} inputMode="decimal" placeholder="z. B. 500" />
                      </div>

                      <p id="ov-lastgang-frage" className="mb-3 mt-8 text-[15px] font-semibold text-ink-900">
                        Liegt ein Lastgang (15-Minuten-Werte) vor?
                      </p>
                      <Segment optionen={LASTGANG} wert={f.lastgang} onChange={(v) => setze("lastgang", v)} name="lastgang" umbrechen />

                      <p id="ov-netzebene-frage" className="mb-3 mt-8 text-[15px] font-semibold text-ink-900">
                        Netzebene des Anschlusses
                      </p>
                      <Segment optionen={NETZEBENE} wert={f.netzebene} onChange={(v) => setze("netzebene", v)} name="netzebene" umbrechen />
                    </>
                  )}

                  <p id="ov-zeitplan-frage" className="mb-3 mt-8 text-[15px] font-semibold text-ink-900">
                    Wann möchten Sie starten?
                  </p>
                  <Segment optionen={ZEITPLAN.map((z) => ({ id: z, label: z }))} wert={f.zeitplan} onChange={(v) => setze("zeitplan", v)} name="zeitplan" umbrechen />
                </Frage>
              )}

              {schritt === 4 && (
                <Frage titel="Wohin dürfen wir Ihre Einschätzung schicken?" hinweis="Eine Projektleiterin oder ein Projektleiter aus Ostermiething meldet sich persönlich – kein Callcenter, keine Weitergabe an Dritte.">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <p className="text-[13px] text-ink-500 sm:col-span-2">
                      <span aria-hidden="true" className="text-red-700">
                        *
                      </span>{" "}
                      Pflichtfeld
                    </p>
                    {!istPrivat && (
                      <div className="sm:col-span-2">
                        <Feld id="firma" label="Unternehmen / Gemeinde / Betrieb" wert={f.firma} setze={setze} autoComplete="organization" />
                      </div>
                    )}
                    <Feld id="vorname" label="Vorname" wert={f.vorname} setze={setze} fehler={fehler.vorname} autoComplete="given-name" pflicht />
                    <Feld id="nachname" label="Nachname" wert={f.nachname} setze={setze} fehler={fehler.nachname} autoComplete="family-name" pflicht />
                    <Feld id="email" label="E-Mail" type="email" wert={f.email} setze={setze} fehler={fehler.email} autoComplete="email" pflicht />
                    <Feld id="telefon" label="Telefon" type="tel" wert={f.telefon} setze={setze} fehler={fehler.telefon} autoComplete="tel" pflicht />
                    <div className="grid grid-cols-[120px_1fr] gap-4 sm:col-span-2">
                      <Feld id="plz" label="PLZ" wert={f.plz} setze={setze} fehler={fehler.plz} autoComplete="postal-code" inputMode="numeric" maxLength={5} placeholder="5121" pflicht />
                      <Feld id="ort" label="Ort des Objekts" wert={f.ort} setze={setze} fehler={fehler.ort} autoComplete="address-level2" pflicht />
                    </div>
                  </div>
                  <label className={`mt-6 flex cursor-pointer items-start gap-3 rounded-2xl p-4 ring-1 transition-colors ${fehler.agb ? "bg-red-50 ring-red-200" : "bg-sand-50 ring-ink-100"}`}>
                    <input type="checkbox" checked={f.agb} onChange={(e) => setze("agb", e.target.checked)} className="mt-0.5 h-5 w-5 shrink-0 accent-[#669933]" />
                    <span className="text-[13.5px] leading-relaxed text-ink-600">
                      Ich stimme zu, dass Ökovolt mich zu meiner Anfrage kontaktiert, und akzeptiere die{" "}
                      <Link href="/agb" target="_blank" className="font-medium text-ov-700 underline">
                        AGB
                      </Link>{" "}
                      sowie die{" "}
                      <Link href="/datenschutz" target="_blank" className="font-medium text-ov-700 underline">
                        Datenschutzerklärung
                      </Link>
                      .
                    </span>
                  </label>
                  <Fehler text={fehler.agb} />
                  {status === "fehler" && (
                    <p role="alert" className="mt-4 rounded-xl bg-red-50 p-4 text-[14px] text-red-800">
                      Das hat leider nicht geklappt. Bitte versuchen Sie es erneut, schreiben Sie an{" "}
                      <a href={`mailto:${FIRMA.email}`} className="font-semibold underline">
                        {FIRMA.email}
                      </a>{" "}
                      oder rufen Sie uns an:{" "}
                      <a href={FIRMA.telefonHref} className="font-semibold underline">
                        {FIRMA.telefon}
                      </a>
                    </p>
                  )}
                </Frage>
              )}
            </div>
          )}
        </div>

        {status !== "ok" && (
          <div className="flex items-center justify-between gap-3 border-t border-ink-100 bg-ink-50/60 px-6 py-5 md:px-10">
            <button
              type="button"
              onClick={() => gehe(schritt - 1)}
              disabled={schritt === 0}
              className="inline-flex h-12 items-center gap-2 rounded-full px-4 text-[15px] font-semibold text-ink-600 transition-colors hover:bg-ink-100 hover:text-ink-900 disabled:invisible"
            >
              <ArrowLeft aria-hidden="true" className="h-4 w-4" /> Zurück
            </button>
            {schritt < SCHRITTE.length - 1 ? (
              <button
                type="button"
                onClick={() => gehe(schritt + 1)}
                className="group inline-flex h-12 items-center gap-2 rounded-full bg-ov-600 px-7 text-[15px] font-semibold text-white shadow-[0_10px_24px_-10px_rgba(102,153,51,0.8)] transition-all hover:bg-ov-700 active:scale-[0.98]"
              >
                Weiter <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            ) : (
              <button
                type="button"
                onClick={absenden}
                disabled={status === "senden"}
                className="group inline-flex h-12 items-center gap-2 rounded-full bg-ov-600 px-7 text-[15px] font-semibold text-white shadow-[0_10px_24px_-10px_rgba(102,153,51,0.8)] transition-all hover:bg-ov-700 active:scale-[0.98] disabled:opacity-70"
              >
                {status === "senden" ? <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" /> : <CheckCircle2 aria-hidden="true" className="h-4 w-4" />}
                Kostenlose Einschätzung anfordern
              </button>
            )}
          </div>
        )}
      </div>

      {/* Live-Ersteinschätzung */}
      <aside className="lg:sticky lg:top-28">
        <Einschaetzung s={schaetzung} vorhaben={f.vorhaben} />
      </aside>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function Frage({ titel, hinweis, children }) {
  return (
    <div>
      <p className="font-display text-[clamp(1.5rem,1.2rem+1vw,2rem)] font-extrabold leading-tight tracking-tight text-ink-900">{titel}</p>
      {hinweis && <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-ink-500">{hinweis}</p>}
      <div className="mt-7">{children}</div>
    </div>
  );
}

function Kachel({ aktiv, onClick, icon: Icon, titel, text, mehrfach }) {
  return (
    <button
      type="button"
      aria-pressed={aktiv}
      onClick={onClick}
      className={`group relative flex items-center gap-4 rounded-2xl border-2 p-4 text-left transition-all duration-300 ${aktiv ? "border-ov-500 bg-ov-50 shadow-[0_10px_30px_-18px_rgba(102,153,51,0.9)]" : "border-ink-200 bg-white hover:-translate-y-0.5 hover:border-ink-300"}`}
    >
      <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-colors ${aktiv ? "bg-ov-500 text-white" : "bg-ink-100 text-ink-600 group-hover:bg-ov-100 group-hover:text-ov-700"}`}>
        <Icon aria-hidden="true" className="h-6 w-6" strokeWidth={1.8} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[15.5px] font-semibold text-ink-900">{titel}</span>
        {text && <span className={`block text-[13px] ${aktiv ? "text-ink-600" : "text-ink-500"}`}>{text}</span>}
      </span>
      <span
        className={`flex h-6 w-6 shrink-0 items-center justify-center ${mehrfach ? "rounded-md" : "rounded-full"} border-2 transition-all ${aktiv ? "border-ov-500 bg-ov-500 text-white" : "border-ink-300 bg-white text-transparent"}`}
      >
        <Check aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={3} />
      </span>
    </button>
  );
}

function Segment({ optionen, wert, onChange, name, umbrechen }) {
  return (
    <div role="group" aria-labelledby={`ov-${name}-frage`} className={`flex gap-2 ${umbrechen ? "flex-wrap" : ""}`}>
      {optionen.map((o) => {
        const aktiv = wert === o.id;
        return (
          <button
            key={o.id}
            type="button"
            aria-pressed={aktiv}
            onClick={() => onChange(o.id)}
            className={`h-12 rounded-full border-2 px-5 text-[14.5px] font-semibold transition-all ${aktiv ? "border-ov-600 bg-ov-600 text-white shadow-md" : "border-ink-200 bg-white text-ink-700 hover:border-ink-300"}`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

function Feld({ id, label, wert, setze, fehler, type = "text", pflicht = false, ...rest }) {
  return (
    <div>
      <label htmlFor={`ov-${id}`} className="mb-1.5 block text-[14px] font-semibold text-ink-800">
        {label}
        {pflicht && (
          <span aria-hidden="true" className="text-red-700">
            {" "}
            *
          </span>
        )}
      </label>
      <input
        id={`ov-${id}`}
        type={type}
        value={wert}
        onChange={(e) => setze(id, e.target.value)}
        aria-required={pflicht || undefined}
        aria-invalid={!!fehler}
        aria-describedby={fehler ? `ov-${id}-fehler` : undefined}
        className={`h-12 w-full rounded-xl border-2 bg-white px-4 text-[16px] text-ink-900 outline-none transition-colors placeholder:text-ink-500 focus:border-ov-500 ${fehler ? "border-red-400" : "border-ink-200"}`}
        {...rest}
      />
      {fehler && (
        <p id={`ov-${id}-fehler`} className="mt-1.5 text-[13px] text-red-700">
          {fehler}
        </p>
      )}
    </div>
  );
}

function Fehler({ text }) {
  if (!text) return null;
  return (
    <p role="alert" className="mt-3 text-[13.5px] font-medium text-red-700">
      {text}
    </p>
  );
}

function Einschaetzung({ s, vorhaben }) {
  const ohnePv = !vorhaben.includes("pv") && !vorhaben.includes("freiflaeche");
  return (
    <div className="ov-noise relative overflow-hidden rounded-[2rem] bg-navy-950 p-7 text-white shadow-2xl">
      <div aria-hidden="true" className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-ov-500/35 blur-3xl" />
      <div className="relative">
        <p className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.16em] text-ov-300">
          <Sparkles aria-hidden="true" className="h-3.5 w-3.5" /> Ihre Ersteinschätzung
        </p>
        {ohnePv ? (
          <p className="mt-4 text-[15px] leading-relaxed text-white/75">
            Für Speicher, Ladeinfrastruktur, Notstrom oder Wartung an einer bestehenden Anlage prüfen wir Ihre Situation individuell – die Einschätzung erhalten Sie im Gespräch.
          </p>
        ) : s.modus === "gewerbe" ? (
          <>
            <div className="mt-5 grid grid-cols-2 gap-4">
              <Wert label="Anlagengröße (Richtwert)" wert={`${zahl(s.kwp)} kWp`} />
              <Wert label="Jahresertrag ca." wert={`${zahl(s.jahresertrag)} kWh`} />
              <Wert label="Flächenbedarf ca." wert={`${zahl(s.flaecheBedarf)} m²`} />
              <Wert label="Bilanzielle Deckung" wert={`${Math.round(s.deckung * 100)} %`} />
            </div>
            <div className="mt-6 rounded-2xl bg-white/[0.06] p-5 ring-1 ring-white/10">
              <dl className="space-y-2 text-[13.5px]">
                <div className="flex justify-between gap-3">
                  <dt className="text-white/60">EAG-Förderkategorie</dt>
                  <dd className="text-right font-semibold">{s.eag}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-white/60">TOR Erzeuger (Näherung)</dt>
                  <dd className="text-right font-semibold">{s.tor}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-white/60">Investitionsfreibetrag PV</dt>
                  <dd className="text-right font-semibold">22 % bis 31.12.2026</dd>
                </div>
              </dl>
            </div>
            <p className="mt-4 text-[12px] leading-relaxed text-white/45">
              Richtwerte: rund {zahl(s.spezifischerErtrag)} kWh/kWp, eigenverbrauchsorientiert ausgelegt auf etwa 70 % des Jahresverbrauchs
              {s.flaecheBegrenzt ? ", begrenzt durch die angegebene Fläche" : ""}. Preise nennen wir erst nach Prüfung von Dach, Statik und Netzanschluss – im Gewerbe
              hängen sie zu stark davon ab. Förder- und Steuerangaben: Stand September 2026.
            </p>
          </>
        ) : (
          <>
            <div className="mt-5 grid grid-cols-2 gap-4">
              <Wert label="Anlagengröße" wert={`${s.kwp.toLocaleString("de-AT")} kWp`} />
              <Wert label="Speicher" wert={s.speicherKwh ? `${s.speicherKwh} kWh` : "–"} />
              <Wert label="Jahresertrag" wert={`${zahl(s.jahresertrag)} kWh`} />
              <Wert label="Autarkie" wert={`${Math.round(s.autarkie * 100)} %`} />
            </div>
            <div className="mt-6 rounded-2xl bg-white/[0.06] p-5 ring-1 ring-white/10">
              <p className="text-[13px] text-white/60">Vorteil pro Jahr (Ersparnis + Einspeisung)</p>
              <p className="ov-num mt-1 font-display text-[34px] font-extrabold leading-none tracking-tight text-ov-300 transition-all">{eur(s.nutzenProJahr)}</p>
              <p className="mt-3 text-[13px] text-white/60">
                Investition ca.{" "}
                <span className="ov-num text-white">
                  {eur(s.investition * 0.9)} – {eur(s.investition * 1.15)}
                </span>
                {s.amortisationJahre && (
                  <>
                    {" "}
                    · Amortisation ~ <span className="ov-num text-white">{s.amortisationJahre.toFixed(0)} Jahre</span>
                  </>
                )}
              </p>
            </div>
            <p className="mt-4 text-[12px] leading-relaxed text-white/45">
              Richtwerte auf Basis unseres{" "}
              <Link href="/solarrechner" className="underline">
                Solarrechners
              </Link>{" "}
              ({zahl(s.gesamt)} kWh inkl. geplanter Verbraucher). Das verbindliche Angebot erstellen wir nach Prüfung Ihres Dachs.
            </p>
          </>
        )}
        <ul className="mt-6 space-y-2.5 border-t border-white/10 pt-6 text-[14px] text-white/80">
          <li className="flex items-center gap-2.5">
            <ShieldCheck aria-hidden="true" className="h-4 w-4 text-ov-300" /> Seit 2012 in ganz Österreich
          </li>
          <li className="flex items-center gap-2.5">
            <CheckCircle2 aria-hidden="true" className="h-4 w-4 text-ov-300" /> Planung, Bau & Betrieb aus einer Hand
          </li>
          <li className="flex items-center gap-2.5">
            <Phone aria-hidden="true" className="h-4 w-4 text-ov-300" /> Lieber anrufen?{" "}
            <a href={FIRMA.telefonHref} className="font-semibold text-white underline-offset-2 hover:underline">
              {FIRMA.telefon}
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}

function Wert({ label, wert }) {
  return (
    <div>
      <p className="text-[12.5px] text-white/55">{label}</p>
      <p className="ov-num mt-0.5 font-display text-[20px] font-extrabold tracking-tight">{wert}</p>
    </div>
  );
}

function Erfolg({ vorname, privat }) {
  return (
    <div className="ov-step-vor py-6 text-center">
      <div className="relative mx-auto flex h-20 w-20 items-center justify-center">
        <span aria-hidden="true" className="absolute inset-0 animate-ping rounded-full bg-ov-300/50 motion-reduce:animate-none" style={{ animationIterationCount: 2 }} />
        <span className="relative flex h-20 w-20 items-center justify-center rounded-full bg-ov-500 text-white shadow-xl">
          <Check aria-hidden="true" className="h-10 w-10" strokeWidth={3} />
        </span>
      </div>
      <p className="mt-8 font-display text-[clamp(1.6rem,1.2rem+1.2vw,2.2rem)] font-extrabold tracking-tight text-ink-900">Vielen Dank{vorname ? `, ${vorname}` : ""}!</p>
      <p className="mx-auto mt-3 max-w-md text-[16px] leading-relaxed text-ink-600">
        Ihre Anfrage ist bei uns eingegangen. Wir melden uns persönlich, um {privat ? "Ihr Dach und Ihre Wünsche" : "Fläche, Lastgang und Netzanschluss"} im Detail zu besprechen.
      </p>
      <div className="mx-auto mt-8 grid max-w-md gap-3 text-left sm:grid-cols-3">
        {(privat ? ["Rückruf & Bedarfsanalyse", "Dachprüfung & Planung", "Verbindliches Angebot"] : ["Rückruf & Lastganganalyse", "Standort- & Netzprüfung", "Angebot mit Förderprüfung"]).map((t, i) => (
          <div key={t} className="rounded-2xl bg-sand-50 p-4 ring-1 ring-ink-100">
            <p className="font-display text-[13px] font-extrabold text-ov-600">0{i + 1}</p>
            <p className="mt-1 text-[13.5px] font-semibold leading-snug text-ink-800">{t}</p>
          </div>
        ))}
      </div>
      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <Link href="/referenzen/projekte" className="inline-flex h-12 items-center justify-center rounded-full px-6 text-[15px] font-semibold text-ink-900 ring-1 ring-inset ring-ink-200 hover:bg-ink-50">
          Referenzen ansehen
        </Link>
        <Link href="/foerdercheck" className="inline-flex h-12 items-center justify-center rounded-full bg-ink-900 px-6 text-[15px] font-semibold text-white hover:bg-ink-800">
          Förder-Check starten
        </Link>
      </div>
    </div>
  );
}
