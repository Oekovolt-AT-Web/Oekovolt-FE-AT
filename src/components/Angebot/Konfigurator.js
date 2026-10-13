"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BatteryCharging,
  Building2,
  CalendarCheck2,
  Check,
  CheckCircle2,
  Factory,
  FileUp,
  Home,
  Hotel,
  Landmark,
  Loader2,
  Lock,
  Mountain,
  Pencil,
  Phone,
  PlugZap,
  Share2,
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
import { herkunft } from "@/lib/herkunft";
import {
  GREMIEN,
  HONEYPOT_FELD,
  ROLLEN,
  THEMA_WERTE,
  ZWECK_WERTE,
  anfrageReferenz,
  submitAnfrage,
  terminVorbelegungMerken,
} from "@/lib/api/anfrage/create_anfrage";
import { EMAIL_FEHLER, PLZ_FEHLER, TELEFON_FEHLER, istEmail, istPlz, telefonPruefen } from "@/lib/api/contact/create_contact";
import { einwilligung, einwilligungFelder } from "@/lib/einwilligungen";
import { BASE_URL, FIRMA } from "@/lib/site";
import { expFuerEreignis } from "@/lib/experimente";
import KostenDesWartens from "@/components/Verkauf/KostenDesWartens";

// Terminbuchung erst im Erfolg laden (eigener Chunk; Kalender holt sie selbst über /api/termin/kalender)
const TerminBuchung = dynamic(() => import("@/components/Rueckruf/TerminBuchung"), {
  ssr: false,
  loading: () => <div className="h-[420px] animate-pulse rounded-[2rem] bg-sand-50 ring-1 ring-ink-100" />,
});

/*
 * Angebots-Konfigurator Österreich (Gewerbe-Fokus) – Commitment-Leiter (Welle A, Paket A08).
 *
 * API-Vertrag (/api/create_anfrage -> oekovolt_app…angebot.submit_angebot): vorhaben, gebaeudetyp,
 * eigentuemer, dachform, dachausrichtung, jahresverbrauch_kwh, startzeitpunkt, vorname, nachname,
 * email, telefon (optional), plz, ort, ergebnis{…}, nachricht, herkunft, anfrage_zusatz [Honeypot].
 * Seit Welle A zusätzlich die strukturierten Felder (Whitelist in src/lib/api/anfrage/create_anfrage.js):
 *   objekt, firma, netzebene, lastgang, flaeche_m2, kwp_wunsch, zeitplan, rolle, gremium[],
 *   rueckruf_ok, thema, zweck, bezug, einwilligung_id, einwilligung_version.
 * Solange das Backend die Felder nicht kennt, stehen dieselben Angaben als Text in `ergebnis.angaben`
 * und `nachricht` (Frappe verwirft unbekannte Argumente).
 *
 * Einwilligung: Hinweistext „konfigurator-info“ (Art. 6 Abs. 1 lit. b DSGVO) statt Pflicht-Checkbox,
 * keine AGB-Zustimmung, Telefon optional; optional und nicht vorangekreuzt „Ich möchte telefonisch
 * kontaktiert werden“ (rueckruf_ok, Text „rueckruf-anruf“). Der frühere A/B-Test K1 wird nicht mehr
 * ausgewertet – Variante b ist Standard.
 *
 * Bedienung: Einzelwahl = role="radiogroup" mit Pfeiltasten (roving tabindex); Mehrfachwahl =
 * role="group". Die letzte Einzelwahl eines Schritts schaltet nach 250 ms weiter – nur mit Maus/Touch
 * (event.detail > 0), nie per Tastatur. Fokus beim Schrittwechsel auf die Frage (<h2 tabIndex=-1>).
 * Kein Download/Export: Die Einschätzung bleibt auf dem Bildschirm (Lead-Gate-Regel Stufe 1).
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
// „Was Warten kostet“ (IFB, Stromkosten) nur für Betriebe – nicht für Wohngebäude, Gemeinden und Sonstiges
const MIT_KOSTEN_DES_WARTENS = ["gewerbe", "landwirtschaft", "freiflaeche", "hotellerie"];
// Objekt → Kurzform für die Termin-Vorbelegung (src/data/erreichbarkeit.js, THEMA_KURZ)
const TERMIN_THEMA = { gewerbe: "gewerbe", hotellerie: "gewerbe", landwirtschaft: "landwirtschaft", freiflaeche: "freiflaeche", gemeinde: "gemeinde", chalet: "chalet", privat: "chalet", sonstiges: "sonstiges" };

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

// ?thema= aus Links anderer Seiten → lesbare Zeile in den Angaben
const THEMA_TEXT = {
  netzanmeldung: "Anliegen: Netzanmeldung (Unterstützung beim Netzzugangsantrag)",
  beschlussvorlage: "Anliegen: Beschlussvorlage für den Gemeinderat",
  lastgang: "Anliegen: Auswertung des Lastgangs",
  zweitmeinung: "Anliegen: Zweitmeinung zu einem vorliegenden Angebot",
};

const SCHRITTE = ["Vorhaben", "Objekt", "Fläche", "Verbrauch & Netz", "Kontakt"];
// Reihenfolge für „Fokus auf das erste fehlerhafte Feld“ (Element-ID = ov-<schlüssel>)
const FEHLER_REIHENFOLGE = ["vorhaben", "verbrauch", "vorname", "nachname", "email", "telefon", "plz", "ort"];
const SPEICHER_KEY = "ov_angebot_entwurf_at_v1";
const HINWEIS = einwilligung("konfigurator-info");
const ANRUF = einwilligung("rueckruf-anruf");

const zahl = (n) => Math.round(n).toLocaleString("de-DE");
const eur = (n) => zahl(n) + " €";
const rundeKwp = (k) => (k >= 100 ? Math.round(k / 10) * 10 : k >= 30 ? Math.round(k / 5) * 5 : Math.round(k * 2) / 2);
/** „Beispielwerte“ bis zur ersten Eingabe: gröber gerundet, damit sie nicht wie ein Ergebnis wirken */
const grob = (n, schritt) => Math.round(n / schritt) * schritt;
const mwh = (kwh) => (kwh / 1000).toLocaleString("de-DE", { maximumFractionDigits: kwh < 10000 ? 1 : 0 });

/**
 * EAG-Kategorie (Investitionszuschuss) nach Engpassleistung, Stand 2026.
 * Größere Anlagen als 1.000 kWp werden anteilig bis 1.000 kWp gefördert
 * (EAG-Abwicklungsstelle, FAQ 2026 Fragen 19 und 20); alternativ ist die Marktprämie möglich.
 */
const eagKategorie = (kwp) =>
  kwp <= 10
    ? "A (bis 10 kWp)"
    : kwp <= 20
      ? "B (10–20 kWp)"
      : kwp <= 100
        ? "C (20–100 kWp)"
        : kwp <= 1000
          ? "D (100–1.000 kWp)"
          : "D – anteilig bis 1.000 kWp, alternativ Marktprämie";
/** TOR-Erzeuger-Typ – Näherung über die kWp (maßgeblich ist die Wechselrichter-/Anschlussleistung) */
const torTyp = (kwp) => (kwp < 250 ? "Typ A" : kwp < 35000 ? "Typ B" : "Typ C/D");

/**
 * Pfeiltasten in einer Radiogruppe (roving tabindex): wählt die nächste Option und setzt den Fokus.
 * Auswahl per Tastatur schaltet nie automatisch weiter.
 */
function pfeilTasten(e, ids, aktuell, waehle) {
  const n = ids.length;
  if (!n) return;
  const i = Math.max(ids.indexOf(aktuell), 0);
  let ziel;
  if (e.key === "ArrowRight" || e.key === "ArrowDown") ziel = (i + 1) % n;
  else if (e.key === "ArrowLeft" || e.key === "ArrowUp") ziel = (i - 1 + n) % n;
  else if (e.key === "Home") ziel = 0;
  else if (e.key === "End") ziel = n - 1;
  else return;
  e.preventDefault();
  waehle(ids[ziel]);
  const gruppe = e.currentTarget.closest('[role="radiogroup"]');
  gruppe?.querySelectorAll('[role="radio"]')[ziel]?.focus();
}

/** tabIndex im roving tabindex: gewählte Option, sonst die erste */
const rovingTab = (ids, aktuell, id) => (ids.includes(aktuell) ? (aktuell === id ? 0 : -1) : ids[0] === id ? 0 : -1);

/* ------------------------------------------------------------------ */

export default function Konfigurator() {
  const params = useSearchParams();
  const [schritt, setSchritt] = useState(0);
  const [richtung, setRichtung] = useState(1);
  const [status, setStatus] = useState(null); // null | "senden" | "ok" | "fehler"
  const [fehler, setFehler] = useState({});
  // Bis zur ersten eigenen Eingabe (oder Übernahme aus Rechner/Entwurf) zeigt die Einschätzung „Beispielwerte“
  const [eingabe, setEingabe] = useState(false);
  const [vorbelegt, setVorbelegt] = useState(null); // { kwp, verbrauch, objekt } aus einem Rechner
  const [anfrageId, setAnfrageId] = useState("");
  const kopfRef = useRef(null);
  const website = useRef(null); // Honeypot gegen Spam-Bots – bleibt für Menschen leer
  const weiterTimer = useRef(null);
  const schrittRef = useRef(0);
  const geheRef = useRef(null);

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
    // Keine Vorauswahl: Das strukturierte Feld `zeitplan` dient der Priorisierung (Speed-to-Lead) –
    // ohne aktive Wahl bleibt es leer statt „In den nächsten 3 Monaten“ (QA-Befund).
    zeitplan: "",
    firma: "",
    vorname: "",
    nachname: "",
    email: "",
    telefon: "",
    plz: "",
    ort: "",
    rolle: "",
    gremium: [],
    rueckrufOk: false,
  });

  const istPrivat = PRIVAT.includes(f.objekt);

  // ?thema= und ?zweck= aus Links anderer Seiten – nur Werte aus der festen Liste
  const thema = useMemo(() => {
    const t = String(params.get("thema") || "").toLowerCase();
    return THEMA_WERTE.includes(t) ? t : "";
  }, [params]);
  const zweck = useMemo(() => {
    const z = String(params.get("zweck") || "").toLowerCase();
    return ZWECK_WERTE.includes(z) ? z : "";
  }, [params]);

  // Anfrage-Ereignisse tragen die exp-Kennung (z. B. "k4:b"), sobald irgendein Test läuft
  const mitExp = (daten) => {
    const exp = expFuerEreignis();
    return exp ? { ...daten, exp } : daten;
  };

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
    const mitWerten = v > 500 && kwpParam > 0;

    setF((alt) => {
      const { agb: _alt, ...gespeichert } = entwurf || {};
      const basis = { ...alt, ...gespeichert, gremium: Array.isArray(gespeichert.gremium) ? gespeichert.gremium : [], rueckrufOk: false };
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

    if (entwurf || objektNeu || v > 500 || kwpParam > 0) setEingabe(true);

    // Commitment-Leiter: Wer aus einem Rechner kommt, beginnt dort, wo noch etwas fehlt
    if (mitWerten) {
      const obj = objektNeu || entwurf?.objekt || "gewerbe";
      setVorbelegt({ kwp: kwpParam, verbrauch: v, objekt: obj });
      setSchritt(3);
      ereignis("konfigurator_vorbelegt", { stufe: 4, objekt: obj });
    } else if (objekt) {
      setSchritt(1);
      ereignis("konfigurator_vorbelegt", { stufe: 2, objekt });
    }
  }, [params]);

  useEffect(() => () => clearTimeout(weiterTimer.current), []);

  const setze = (k, v) => {
    // Ändert jemand Verbrauch oder Fläche selbst, gilt der aus einem Rechner übernommene kWp-Wert nicht mehr
    setF((alt) => ({ ...alt, [k]: v, ...(k === "verbrauch" || k === "flaeche" ? { kwpOverride: undefined } : {}) }));
    setFehler((e) => ({ ...e, [k]: undefined }));
    setEingabe(true);
  };

  const setzeObjekt = (id) => {
    setEingabe(true);
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
  const toggleGremium = (id) => setze("gremium", f.gremium.includes(id) ? f.gremium.filter((x) => x !== id) : [...f.gremium, id]);

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
    // Vorrang: eigene Wunschleistung > Wert aus einem Rechner (?kwp=) > Richtwert aus Verbrauch/Fläche
    const override = f.kwpOverride > 0 ? f.kwpOverride : 0;
    // kwpQuelle steuert den Fußtext der Einschätzung (nur bei „verbrauch“ gilt die 70-%-Auslegung)
    let kwp;
    let kwpQuelle = "verbrauch";
    if (wunsch > 0) {
      kwp = wunsch;
      kwpQuelle = "wunsch";
    } else if (override > 0) {
      kwp = override;
      kwpQuelle = "rechner";
    } else if (f.dach === "Freifläche" && flaeche > 0) {
      kwp = flaeche / dach.qm;
      kwpQuelle = "flaeche";
    } else {
      kwp = (gesamt * 0.7) / spez;
      if (flaeche > 0) kwp = Math.min(kwp, flaeche / dach.qm);
    }
    kwp = Math.max(rundeKwp(kwp), 10);
    const jahresertrag = kwp * spez;
    return {
      modus: "gewerbe",
      kwpQuelle,
      gesamt,
      zusatz: 0,
      kwp,
      speicherKwh: 0,
      jahresertrag,
      spezifischerErtrag: spez,
      deckung: gesamt > 0 ? jahresertrag / gesamt : 0,
      flaecheBedarf: kwp * dach.qm,
      flaecheBegrenzt: flaeche > 0 && wunsch === 0 && override === 0 && f.dach !== "Freifläche" && kwp < rundeKwp((gesamt * 0.7) / spez),
      eag: eagKategorie(kwp),
      tor: torTyp(kwp),
      ausrichtung: ausr,
      neigung,
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
      // Entwurf ohne Einwilligungs-Häkchen speichern – das setzt jede Person bei jeder Anfrage neu
      const { rueckrufOk, ...rest } = f;
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
      if (!istEmail(f.email)) e.email = EMAIL_FEHLER;
      // Telefon optional – wenn angegeben, dann gültig (gemeinsame Regel); mit Rückruf-Häkchen Pflicht
      const tel = telefonPruefen(f.telefon);
      if (!tel.ok) e.telefon = TELEFON_FEHLER;
      else if (tel.leer && f.rueckrufOk) e.telefon = "Für einen Rückruf brauchen wir Ihre Telefonnummer.";
      if (!istPlz(f.plz)) e.plz = PLZ_FEHLER;
      if (!f.ort.trim()) e.ort = "Bitte Ort angeben.";
    }
    setFehler(e);
    // Barrierefreiheit: Fokus auf das erste fehlerhafte Feld – die Meldung hängt per aria-describedby daran
    const erstes = FEHLER_REIHENFOLGE.find((k) => e[k]);
    if (erstes) requestAnimationFrame(() => document.getElementById(`ov-${erstes}`)?.focus());
    return Object.keys(e).length === 0;
  };

  const gehe = (ziel) => {
    clearTimeout(weiterTimer.current);
    if (ziel > schritt && !pruefen(schritt)) return;
    setRichtung(ziel > schritt ? 1 : -1);
    setSchritt(ziel);
    // Trichter-Messung: nur Vorwärtsschritte, ohne Eingabewerte
    if (ziel > schritt) ereignis("konfigurator_schritt", mitExp({ schritt: ziel + 1, name: SCHRITTE[ziel] }));
    requestAnimationFrame(() => {
      const top = kopfRef.current?.getBoundingClientRect().top;
      if (top !== undefined && (top < 80 || top > window.innerHeight * 0.5)) {
        window.scrollTo({ top: window.scrollY + top - 110, behavior: "smooth" });
      }
      // Fokus auf die neue Frage – Screenreader sagen sie an
      document.getElementById(`ov-frage-${ziel}`)?.focus({ preventScroll: true });
    });
  };
  geheRef.current = gehe;
  schrittRef.current = schritt;

  /** Letzte Einzelwahl eines Schritts: nach 250 ms weiter – nur Maus/Touch (detail > 0), nie Tastatur */
  const autoWeiter = (e) => {
    if (!e || !(e.detail > 0)) return;
    const s = schrittRef.current;
    clearTimeout(weiterTimer.current);
    weiterTimer.current = setTimeout(() => {
      if (schrittRef.current === s && s < SCHRITTE.length - 1) geheRef.current?.(s + 1);
    }, 250);
  };

  const absenden = async () => {
    if (!pruefen(4)) return;
    setStatus("senden");

    const label = (liste, id) => liste.find((x) => x.id === id)?.label;
    const objektLabel = label(OBJEKTE, f.objekt);
    const flaecheM2 = Number(String(f.flaeche).replace(/\D/g, "")) || 0;
    const kwpWunsch = Number(String(f.kwpWunsch).replace(",", ".").replace(/[^\d.]/g, "")) || 0;
    const tel = telefonPruefen(f.telefon);
    const bezug = anfrageReferenz();

    // Angaben ohne eigenes Backend-Feld -> Text (bleibt, bis das Backend die strukturierten Felder speichert)
    const angaben = [
      f.firma.trim() && `Unternehmen/Organisation: ${f.firma.trim()}`,
      `Objekt: ${objektLabel}`,
      `Vorhaben: ${f.vorhaben.map((v) => label(VORHABEN, v)).filter(Boolean).join(", ")}`,
      thema && (THEMA_TEXT[thema] || `Anliegen: ${thema}`),
      zweck && `Zweck: ${zweck}`,
      flaecheM2 > 0 && `Verfügbare Fläche: ca. ${zahl(flaecheM2)} m²`,
      !istPrivat && `Lastgang (15-Minuten-Werte): ${label(LASTGANG, f.lastgang)}`,
      !istPrivat && `Netzebene: ${label(NETZEBENE, f.netzebene)}`,
      f.kwpWunsch && `Wunschleistung: ${f.kwpWunsch} kWp`,
      !f.kwpWunsch && f.kwpOverride > 0 && `Leistung aus Online-Rechner übernommen: ${zahl(f.kwpOverride)} kWp`,
      `Richtwert Konfigurator: ${zahl(schaetzung.kwp)} kWp, ca. ${zahl(Math.round(schaetzung.jahresertrag / 1000) * 1000)} kWh/Jahr`,
      !istPrivat && f.rolle && `Rolle: ${f.rolle}`,
      !istPrivat && f.gremium.length > 0 && `Entscheidet mit: ${f.gremium.join(", ")}`,
      `Telefonischer Kontakt erwünscht: ${f.rueckrufOk ? "ja" : "nein"}`,
      `Referenz: ${bezug}`,
      "Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO (Hinweistext, keine Einwilligungs-Checkbox)",
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
      startzeitpunkt: f.zeitplan || "",

      vorname: f.vorname.trim(),
      nachname: f.nachname.trim(),
      email: f.email.trim(),
      telefon: tel.e164,
      plz: f.plz.trim(),
      ort: f.ort.trim(),

      ergebnis: { ...ergebnisFuerApi(schaetzung), angaben },
      nachricht: angaben,

      // Strukturierte Felder (Whitelist und Längen prüft /api/create_anfrage)
      objekt: f.objekt,
      firma: f.firma.trim(),
      netzebene: istPrivat ? "" : f.netzebene,
      lastgang: istPrivat ? "" : f.lastgang,
      flaeche_m2: flaecheM2 || "",
      kwp_wunsch: kwpWunsch || "",
      zeitplan: f.zeitplan || "",
      rolle: istPrivat ? "" : f.rolle,
      gremium: istPrivat ? [] : f.gremium,
      rueckruf_ok: f.rueckrufOk ? 1 : 0,
      thema,
      zweck,
      bezug,
      // Hinweistext statt Checkbox – die Route setzt `einwilligung` für das heutige Backend
      ...einwilligungFelder("konfigurator-info"),

      [HONEYPOT_FELD]: website.current?.value || "",
      // Kampagnen-Zuordnung – /api/create_anfrage hängt sie als Text an `nachricht` und `ergebnis.angaben` an
      herkunft: herkunft(),
    };

    try {
      await submitAnfrage(basis);
      setAnfrageId(bezug);
      // Rückfall für die Terminbuchung (z. B. nach Neuladen von /termin) – TerminBuchung löscht nach der Buchung
      terminVorbelegungMerken({
        name: `${f.vorname.trim()} ${f.nachname.trim()}`.trim(),
        email: f.email.trim(),
        telefon: tel.e164,
        plz: f.plz.trim(),
        firma: f.firma.trim(),
        thema: TERMIN_THEMA[f.objekt] || "",
        bezug,
      });
      setStatus("ok");
      import("@/lib/konfetti").then((m) => m.konfetti()).catch(() => {});
      ereignis("angebot_angefragt", mitExp({ kwp: schaetzung.kwp, objekt: f.objekt }));
      try {
        localStorage.removeItem(SPEICHER_KEY);
      } catch {}
    } catch {
      setStatus("fehler");
    }
  };

  const fortschritt = status === "ok" ? 100 : ((schritt + 1) / SCHRITTE.length) * 100;
  const letzter = schritt === SCHRITTE.length - 1;
  const ohnePv = !f.vorhaben.includes("pv") && !f.vorhaben.includes("freiflaeche");
  const objektIds = OBJEKTE.map((o) => o.id);
  const dachIds = DAECHER.map((d) => d.id);

  /* ---------------- Render ---------------- */
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_380px] lg:items-start">
      {/* overflow-clip statt overflow-hidden: rundet ab, ohne einen Scroll-Container zu bilden – sonst klebt die Fußleiste nicht */}
      <div ref={kopfRef} className="overflow-clip rounded-[2rem] bg-white shadow-[0_40px_80px_-40px_rgba(3,18,43,0.45)] ring-1 ring-ink-200/70">
        {/* Kopf mit Fortschritt */}
        <div className="border-b border-ink-100 px-5 pb-4 pt-5 md:px-10 md:pt-6">
          <div className="flex items-center justify-between gap-4 text-[13px] text-ink-500">
            <span className="font-semibold text-ov-700">{status === "ok" ? "Fertig" : `Schritt ${schritt + 1} von ${SCHRITTE.length}`}</span>
            <span className="flex items-center gap-1.5">
              <Lock aria-hidden="true" className="h-3.5 w-3.5" /> Kostenlos & unverbindlich
            </span>
          </div>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-ink-100" role="progressbar" aria-valuenow={Math.round(fortschritt)} aria-valuemin={0} aria-valuemax={100} aria-label="Fortschritt">
            <div className="h-full rounded-full bg-gradient-to-r from-ov-400 to-ov-600 transition-[width] duration-700 ease-out" style={{ width: `${fortschritt}%` }} />
          </div>
          <ol className="mt-2 hidden gap-2 lg:flex">
            {SCHRITTE.map((s, i) => (
              <li key={s} className="flex-1">
                <button
                  type="button"
                  disabled={i > schritt || status === "ok"}
                  onClick={() => gehe(i)}
                  aria-current={i === schritt && status !== "ok" ? "step" : undefined}
                  className={`flex min-h-11 w-full items-center text-left text-[12.5px] font-medium leading-tight transition-colors ${i === schritt ? "text-ink-900" : i < schritt ? "text-ov-700 hover:text-ov-800" : "text-ink-500"}`}
                >
                  {i < schritt && <Check aria-hidden="true" className="-mt-0.5 mr-1 inline h-3.5 w-3.5" />}
                  {s}
                </button>
              </li>
            ))}
          </ol>
        </div>

        <div className="relative px-5 py-7 md:px-10 md:pb-8 md:pt-7">
          {/* Honeypot: bewusst nicht „website“ (Passwortmanager füllen sonst aus) */}
          <input ref={website} type="text" name={HONEYPOT_FELD} tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 opacity-0" />

          {status === "ok" ? (
            <Erfolg
              vorname={f.vorname}
              privat={istPrivat}
              objekt={f.objekt}
              s={schaetzung}
              anfrageId={anfrageId}
              kontakt={{
                name: `${f.vorname.trim()} ${f.nachname.trim()}`.trim(),
                email: f.email.trim(),
                telefon: telefonPruefen(f.telefon).e164,
                plz: f.plz.trim(),
                firma: f.firma.trim(),
                thema: TERMIN_THEMA[f.objekt] || "",
              }}
            />
          ) : (
            <div key={schritt} className={richtung > 0 ? "ov-step-vor" : "ov-step-zurueck"}>
              {vorbelegt && schritt > 0 && (
                <div className="mb-6 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 rounded-2xl bg-ov-50 px-4 py-3 text-[14px] text-ink-800 ring-1 ring-ov-200">
                  <p>
                    <span className="font-semibold">Aus dem Rechner übernommen:</span>{" "}
                    <span className="ov-num">
                      {zahl(vorbelegt.kwp)} kWp · {mwh(vorbelegt.verbrauch)} MWh · {OBJEKTE.find((o) => o.id === vorbelegt.objekt)?.label}
                    </span>
                  </p>
                  <button type="button" onClick={() => gehe(0)} className="inline-flex min-h-11 items-center gap-1.5 font-semibold text-ov-700 underline underline-offset-2 hover:text-ov-800">
                    <Pencil aria-hidden="true" className="h-3.5 w-3.5" /> ändern
                  </button>
                </div>
              )}

              {schritt === 0 && (
                <Frage schritt={0} titel="Was möchten Sie umsetzen?" hinweis="Mehrfachauswahl möglich – wir stimmen alles aufeinander und auf Ihren Netzanschluss ab.">
                  <div
                    id="ov-vorhaben"
                    role="group"
                    aria-labelledby="ov-frage-0"
                    tabIndex={-1}
                    aria-describedby={fehler.vorhaben ? "ov-vorhaben-fehler" : undefined}
                    className="grid grid-cols-2 gap-3 rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-ov-500 focus-visible:ring-offset-4"
                  >
                    {vorhabenSichtbar.map((v) => (
                      <Kachel key={v.id} aktiv={f.vorhaben.includes(v.id)} onClick={() => toggleVorhaben(v.id)} icon={v.icon} titel={v.label} text={v.text} mehrfach />
                    ))}
                  </div>
                  <Fehler id="ov-vorhaben-fehler" text={fehler.vorhaben} />
                </Frage>
              )}

              {schritt === 1 && (
                <Frage schritt={1} titel="Um welches Objekt geht es?" hinweis="Unser Schwerpunkt sind Betriebe, Landwirtschaft und die öffentliche Hand – in ganz Österreich.">
                  <div role="radiogroup" aria-labelledby="ov-frage-1" className="grid grid-cols-2 gap-3">
                    {OBJEKTE.map((o) => (
                      <Kachel
                        key={o.id}
                        aktiv={f.objekt === o.id}
                        onClick={() => setzeObjekt(o.id)}
                        onKeyDown={(e) => pfeilTasten(e, objektIds, f.objekt, setzeObjekt)}
                        tabIndex={rovingTab(objektIds, f.objekt, o.id)}
                        icon={o.icon}
                        titel={o.label}
                        text={o.text}
                      />
                    ))}
                  </div>
                  <p id="ov-eigentuemer-frage" className="mb-3 mt-8 text-[15px] font-semibold text-ink-900">
                    Sind Sie Eigentümer von Gebäude bzw. Fläche?
                  </p>
                  <Segment optionen={EIGENTUEMER} wert={f.eigentuemer} onChange={(v) => setze("eigentuemer", v)} name="eigentuemer" umbrechen weiter={autoWeiter} />
                </Frage>
              )}

              {schritt === 2 && (
                <Frage
                  schritt={2}
                  titel={f.objekt === "freiflaeche" ? "Wie groß ist die Fläche?" : "Wo soll die Anlage hin?"}
                  hinweis="Ost/West-Belegungen auf Flachdächern passen oft sehr gut zum Tagesverbrauch eines Betriebs."
                >
                  <p id="ov-dach-frage" className="sr-only">
                    Art der Fläche
                  </p>
                  <div role="radiogroup" aria-labelledby="ov-dach-frage" className="grid grid-cols-2 gap-3 md:grid-cols-5">
                    {DAECHER.map((d) => {
                      const aktiv = f.dach === d.id;
                      return (
                        <button
                          key={d.id}
                          type="button"
                          role="radio"
                          aria-checked={aktiv}
                          tabIndex={rovingTab(dachIds, f.dach, d.id)}
                          onClick={() => setze("dach", d.id)}
                          onKeyDown={(e) => pfeilTasten(e, dachIds, f.dach, (id) => setze("dach", id))}
                          className={`group flex flex-col items-center gap-3 rounded-2xl border-2 p-4 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ov-600 focus-visible:ring-offset-2 ${aktiv ? "border-ov-500 bg-ov-50 shadow-md" : "border-ink-200 bg-white hover:border-ink-300"}`}
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
                      <Segment optionen={AUSRICHTUNG} wert={f.ausrichtung} onChange={(v) => setze("ausrichtung", v)} name="ausrichtung" umbrechen weiter={autoWeiter} />
                    </>
                  )}
                </Frage>
              )}

              {schritt === 3 && (
                <Frage
                  schritt={3}
                  titel={istPrivat ? "Wie hoch ist Ihr Stromverbrauch?" : "Verbrauch und Netzanschluss"}
                  hinweis={
                    istPrivat
                      ? "Steht auf Ihrer Jahresabrechnung. Schätzen genügt – wir prüfen das im Gespräch."
                      : "Jahresverbrauch und Netzebene stehen auf Ihrer Strom- bzw. Netzrechnung. Schätzen genügt – den Lastgang werten wir später gemeinsam aus."
                  }
                >
                  {istPrivat ? (
                    <>
                      <p id="ov-personen-frage" className="sr-only">
                        Personen im Haushalt
                      </p>
                      <div role="radiogroup" aria-labelledby="ov-personen-frage" className="mb-6 flex flex-wrap gap-2">
                        {VERBRAUCH_PRIVAT.map((o) => {
                          const ids = VERBRAUCH_PRIVAT.map((x) => x.kwh);
                          return (
                            <button
                              key={o.p}
                              type="button"
                              role="radio"
                              aria-checked={f.verbrauch === o.kwh}
                              tabIndex={rovingTab(ids, f.verbrauch, o.kwh)}
                              onClick={() => setze("verbrauch", o.kwh)}
                              onKeyDown={(e) => pfeilTasten(e, ids, f.verbrauch, (kwh) => setze("verbrauch", kwh))}
                              className={`h-11 rounded-full px-4 text-[14px] font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ov-600 focus-visible:ring-offset-2 ${f.verbrauch === o.kwh ? "bg-ink-900 text-white" : "bg-ink-100 text-ink-700 hover:bg-ink-200"}`}
                            >
                              {o.p}
                              {o.p === 5 ? "+" : ""} {o.p === 1 ? "Person" : "Personen"}
                            </button>
                          );
                        })}
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
                      <div role="radiogroup" aria-labelledby="ov-verbrauch-frage" className="mb-4 flex flex-wrap gap-2">
                        {VERBRAUCH_GEWERBE.map((kwh) => (
                          <button
                            key={kwh}
                            type="button"
                            role="radio"
                            aria-checked={f.verbrauch === kwh}
                            tabIndex={rovingTab(VERBRAUCH_GEWERBE, f.verbrauch, kwh)}
                            onClick={() => setze("verbrauch", kwh)}
                            onKeyDown={(e) => pfeilTasten(e, VERBRAUCH_GEWERBE, f.verbrauch, (w) => setze("verbrauch", w))}
                            className={`h-11 rounded-full px-4 text-[14px] font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ov-600 focus-visible:ring-offset-2 ${f.verbrauch === kwh ? "bg-ink-900 text-white" : "bg-ink-100 text-ink-700 hover:bg-ink-200"}`}
                          >
                            {kwh >= 1000000 ? `${(kwh / 1000000).toLocaleString("de-DE")} Mio.` : zahl(kwh)}
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
                  <Segment optionen={ZEITPLAN.map((z) => ({ id: z, label: z }))} wert={f.zeitplan} onChange={(v) => setze("zeitplan", v)} name="zeitplan" umbrechen weiter={autoWeiter} />
                </Frage>
              )}

              {schritt === 4 && (
                <Frage schritt={4} titel="Wohin dürfen wir Ihre Einschätzung schicken?" hinweis="Eine Projektleiterin oder ein Projektleiter aus Ostermiething meldet sich persönlich – kein Callcenter, keine Weitergabe an Dritte.">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <p className="text-[13px] text-ink-500 sm:col-span-2">
                      <span aria-hidden="true" className="text-red-700">
                        *
                      </span>{" "}
                      Pflichtfeld
                    </p>
                    {!istPrivat && (
                      <div className="sm:col-span-2">
                        <Feld id="firma" label="Unternehmen / Gemeinde / Betrieb (optional)" wert={f.firma} setze={setze} autoComplete="organization" />
                      </div>
                    )}
                    <Feld id="vorname" label="Vorname" wert={f.vorname} setze={setze} fehler={fehler.vorname} autoComplete="given-name" pflicht />
                    <Feld id="nachname" label="Nachname" wert={f.nachname} setze={setze} fehler={fehler.nachname} autoComplete="family-name" pflicht />
                    <Feld id="email" label="E-Mail" type="email" wert={f.email} setze={setze} fehler={fehler.email} autoComplete="email" inputMode="email" pflicht />
                    <Feld id="telefon" label={f.rueckrufOk ? "Telefon (für den Rückruf)" : "Telefon (optional)"} type="tel" wert={f.telefon} setze={setze} fehler={fehler.telefon} autoComplete="tel" inputMode="tel" pflicht={f.rueckrufOk} />
                    <div className="grid grid-cols-[120px_1fr] gap-4 sm:col-span-2">
                      <Feld id="plz" label="PLZ" wert={f.plz} setze={setze} fehler={fehler.plz} autoComplete="postal-code" inputMode="numeric" maxLength={5} placeholder="5121" pflicht />
                      <Feld id="ort" label="Ort des Objekts" wert={f.ort} setze={setze} fehler={fehler.ort} autoComplete="address-level2" pflicht />
                    </div>
                  </div>

                  {!istPrivat && (
                    <>
                      <p id="ov-rolle-frage" className="mb-3 mt-8 text-[15px] font-semibold text-ink-900">
                        Ihre Rolle <span className="font-normal text-ink-500">(optional)</span>
                      </p>
                      <Segment optionen={ROLLEN.map((r) => ({ id: r, label: r }))} wert={f.rolle} onChange={(v) => setze("rolle", v)} name="rolle" umbrechen klein />

                      <p id="ov-gremium-frage" className="mb-3 mt-6 text-[15px] font-semibold text-ink-900">
                        Wer entscheidet mit? <span className="font-normal text-ink-500">(optional, Mehrfachauswahl)</span>
                      </p>
                      <div role="group" aria-labelledby="ov-gremium-frage" className="flex flex-wrap gap-2">
                        {GREMIEN.map((g) => {
                          const aktiv = f.gremium.includes(g);
                          return (
                            <button
                              key={g}
                              type="button"
                              aria-pressed={aktiv}
                              onClick={() => toggleGremium(g)}
                              className={`inline-flex h-11 items-center gap-1.5 rounded-full border-2 px-4 text-[14px] font-semibold transition-all ${aktiv ? "border-ov-600 bg-ov-600 text-white" : "border-ink-200 bg-white text-ink-700 hover:border-ink-300"}`}
                            >
                              {aktiv && <Check aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={3} />}
                              {g}
                            </button>
                          );
                        })}
                      </div>
                    </>
                  )}

                  {/* Optional, nicht vorangekreuzt: Anruf auf Wunsch (Art. 6 Abs. 1 lit. a DSGVO, § 174 TKG 2021) */}
                  <label htmlFor="ov-rueckrufOk" className="mt-8 flex cursor-pointer items-start gap-3 rounded-2xl p-1">
                    <input
                      id="ov-rueckrufOk"
                      type="checkbox"
                      checked={f.rueckrufOk}
                      onChange={(e) => setze("rueckrufOk", e.target.checked)}
                      className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer accent-ov-600"
                    />
                    <span className="text-[14px] leading-relaxed text-ink-600">
                      <strong className="font-semibold text-ink-800">Ich möchte telefonisch kontaktiert werden</strong> <span className="text-ink-500">(optional)</span>. {ANRUF.text}
                    </span>
                  </label>

                  {/* Hinweis statt Pflicht-Checkbox (Art. 6 Abs. 1 lit. b DSGVO), kein AGB-Bezug */}
                  <p className="mt-4 flex items-start gap-3 rounded-2xl bg-sand-50 p-4 text-[13.5px] leading-relaxed text-ink-600 ring-1 ring-ink-100">
                    <ShieldCheck aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-ov-700" />
                    <span>
                      {HINWEIS.text} Mehr dazu in unserer{" "}
                      <Link href={HINWEIS.link} target="_blank" className="font-medium text-ov-700 underline">
                        Datenschutzerklärung
                      </Link>
                      .
                    </span>
                  </p>
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
          // Unter lg klebt die Leiste am unteren Rand (Safe-Area beachtet) und zeigt den kWp-Richtwert
          <div className="ov-klebende-leiste sticky bottom-0 z-20 flex items-center justify-between gap-2 border-t border-ink-100 bg-white/95 px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3 backdrop-blur md:px-10 lg:static lg:bg-ink-50/60 lg:py-5 lg:backdrop-blur-none">
            <button
              type="button"
              onClick={() => gehe(schritt - 1)}
              disabled={schritt === 0}
              className="inline-flex h-12 items-center gap-2 rounded-full px-3 text-[15px] font-semibold text-ink-600 transition-colors hover:bg-ink-100 hover:text-ink-900 disabled:invisible sm:px-4"
            >
              <ArrowLeft aria-hidden="true" className="h-4 w-4" /> Zurück
            </button>
            {!letzter && !ohnePv && (
              <p className="ov-num text-center text-[12px] leading-tight text-ink-600 lg:hidden">
                <span className="block font-display text-[16px] font-extrabold text-ink-900">≈ {zahl(eingabe ? schaetzung.kwp : grob(schaetzung.kwp, 10))} kWp</span>
                {eingabe ? "Richtwert" : "Beispielwert"}
              </p>
            )}
            {!letzter ? (
              <button
                type="button"
                onClick={() => gehe(schritt + 1)}
                className="group inline-flex h-12 items-center gap-2 rounded-full bg-ov-600 px-6 text-[15px] font-semibold text-white shadow-[0_10px_24px_-10px_rgba(102,153,51,0.8)] transition-all hover:bg-ov-700 active:scale-[0.98] sm:px-7"
              >
                Weiter <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            ) : (
              <button
                type="button"
                onClick={absenden}
                disabled={status === "senden"}
                className="group inline-flex h-12 shrink-0 items-center gap-2 whitespace-nowrap rounded-full bg-ov-600 px-5 text-[15px] font-semibold text-white shadow-[0_10px_24px_-10px_rgba(102,153,51,0.8)] transition-all hover:bg-ov-700 active:scale-[0.98] disabled:opacity-70 sm:px-7"
              >
                {status === "senden" ? <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" /> : <CheckCircle2 aria-hidden="true" className="hidden h-4 w-4 sm:block" />}
                <span className="sm:hidden">Einschätzung anfordern</span>
                <span className="hidden sm:inline">Kostenlose Einschätzung anfordern</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Live-Ersteinschätzung */}
      <aside className="lg:sticky lg:top-28">
        <Einschaetzung s={schaetzung} vorhaben={f.vorhaben} beispiel={!eingabe} />
      </aside>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function Frage({ schritt, titel, hinweis, children }) {
  return (
    <div>
      {/* Echte Überschrift je Schritt – beim Schrittwechsel bekommt sie den Fokus */}
      <h2 id={`ov-frage-${schritt}`} tabIndex={-1} className="font-display text-[clamp(1.5rem,1.2rem+1vw,2rem)] font-extrabold leading-tight tracking-tight text-ink-900 outline-none">
        {titel}
      </h2>
      {hinweis && <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-ink-500">{hinweis}</p>}
      <div className="mt-6 md:mt-7">{children}</div>
    </div>
  );
}

/**
 * Auswahlkachel. Mehrfachwahl: aria-pressed (in role="group"). Einzelwahl: role="radio" mit
 * aria-checked, roving tabindex und Pfeiltasten (onKeyDown kommt von der Gruppe).
 * Mobil zweispaltig: Symbol oben, Haken in der Ecke.
 */
function Kachel({ aktiv, onClick, onKeyDown, tabIndex, icon: Icon, titel, text, mehrfach }) {
  const radio = !mehrfach;
  return (
    <button
      type="button"
      role={radio ? "radio" : undefined}
      aria-checked={radio ? aktiv : undefined}
      aria-pressed={radio ? undefined : aktiv}
      tabIndex={radio ? tabIndex : undefined}
      onClick={onClick}
      onKeyDown={radio ? onKeyDown : undefined}
      className={`group relative flex flex-col items-start gap-2.5 rounded-2xl border-2 p-3.5 text-left transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ov-600 focus-visible:ring-offset-2 sm:flex-row sm:items-center sm:gap-4 sm:p-4 ${aktiv ? "border-ov-500 bg-ov-50 shadow-[0_10px_30px_-18px_rgba(102,153,51,0.9)]" : "border-ink-200 bg-white hover:-translate-y-0.5 hover:border-ink-300"}`}
    >
      <span aria-hidden="true" className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors sm:h-12 sm:w-12 ${aktiv ? "bg-ov-600 text-white" : "bg-ink-100 text-ink-600 group-hover:bg-ov-100 group-hover:text-ov-700"}`}>
        <Icon className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={1.8} />
      </span>
      <span className="min-w-0 flex-1 pr-6 sm:pr-0">
        <span className="block text-[14.5px] font-semibold leading-snug text-ink-900 sm:text-[15.5px]">{titel}</span>
        {text && <span className={`mt-0.5 block text-[12.5px] leading-snug sm:text-[13px] ${aktiv ? "text-ink-600" : "text-ink-500"}`}>{text}</span>}
      </span>
      <span
        aria-hidden="true"
        className={`absolute right-3 top-3 flex h-6 w-6 shrink-0 items-center justify-center sm:static ${mehrfach ? "rounded-md" : "rounded-full"} border-2 transition-all ${aktiv ? "border-ov-600 bg-ov-600 text-white" : "border-ink-300 bg-white text-transparent"}`}
      >
        <Check className="h-3.5 w-3.5" strokeWidth={3} />
      </span>
    </button>
  );
}

/** Einzelwahl als Knopfreihe: role="radiogroup" mit Pfeiltasten; `weiter` = Auto-Weiter nach Mausklick/Touch */
function Segment({ optionen, wert, onChange, name, umbrechen, weiter, klein }) {
  const ids = optionen.map((o) => o.id);
  return (
    <div role="radiogroup" aria-labelledby={`ov-${name}-frage`} className={`flex gap-2 ${umbrechen ? "flex-wrap" : ""}`}>
      {optionen.map((o) => {
        const aktiv = wert === o.id;
        return (
          <button
            key={o.id}
            type="button"
            role="radio"
            aria-checked={aktiv}
            tabIndex={rovingTab(ids, wert, o.id)}
            onClick={(e) => {
              onChange(o.id);
              weiter?.(e);
            }}
            onKeyDown={(e) => pfeilTasten(e, ids, wert, onChange)}
            className={`rounded-full font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ov-600 focus-visible:ring-offset-2 ${klein ? "h-11 px-4 text-[14px]" : "h-12 px-5 text-[14.5px]"} ${aktiv ? "bg-ov-600 text-white shadow-md" : "bg-ink-100 text-ink-700 hover:bg-ink-200/70"}`}
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

function Fehler({ id, text }) {
  if (!text) return null;
  // Kein role="alert": Der Fokus springt auf das betroffene Feld, das die Meldung per aria-describedby vorliest
  return (
    <p id={id} className="mt-3 text-[13.5px] font-medium text-red-700">
      {text}
    </p>
  );
}

function Einschaetzung({ s, vorhaben, beispiel }) {
  const ohnePv = !vorhaben.includes("pv") && !vorhaben.includes("freiflaeche");
  // Bis zur ersten Eingabe: gröber gerundet und als „Beispielwerte“ gekennzeichnet
  const r = (n, schritt) => (beispiel ? grob(n, schritt) : n);
  return (
    <div className="ov-noise relative overflow-hidden rounded-[2rem] bg-navy-950 p-7 text-white shadow-2xl">
      <div aria-hidden="true" className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-ov-500/35 blur-3xl" />
      <div className="relative">
        <p className="flex flex-wrap items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.16em] text-ov-300">
          <Sparkles aria-hidden="true" className="h-3.5 w-3.5" /> Ihre Ersteinschätzung
          {beispiel && !ohnePv && <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-[11px] normal-case tracking-normal text-white ring-1 ring-white/20">Beispielwerte</span>}
        </p>
        {beispiel && !ohnePv && <p className="mt-2 text-[13px] leading-relaxed text-white/70">Mit Ihren Angaben wird daraus Ihr persönlicher Richtwert.</p>}
        {ohnePv ? (
          <p className="mt-4 text-[15px] leading-relaxed text-white/75">
            Für Speicher, Ladeinfrastruktur, Notstrom oder Wartung an einer bestehenden Anlage prüfen wir Ihre Situation individuell – die Einschätzung erhalten Sie im Gespräch.
          </p>
        ) : s.modus === "gewerbe" ? (
          <>
            <div className="mt-5 grid grid-cols-2 gap-4">
              <Wert label="Anlagengröße (Richtwert)" wert={`${zahl(r(s.kwp, 10))} kWp`} />
              <Wert label="Jahresertrag ca." wert={`${zahl(beispiel ? r(s.jahresertrag, 1000) : Math.round(s.jahresertrag / 1000) * 1000)} kWh`} />
              <Wert label="Flächenbedarf ca." wert={`${zahl(r(s.flaecheBedarf, 100))} m²`} />
              <Wert label="Bilanzielle Deckung" wert={`${r(Math.round(s.deckung * 100), 5)} %`} />
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
            <p className="mt-4 text-[12px] leading-relaxed text-white/60">
              Richtwerte: rund {zahl(s.spezifischerErtrag)} kWh/kWp,{" "}
              {s.kwpQuelle === "rechner"
                ? "Anlagengröße aus dem Online-Rechner übernommen"
                : s.kwpQuelle === "wunsch"
                  ? "Anlagengröße nach Ihrer Wunschleistung"
                  : s.kwpQuelle === "flaeche"
                    ? "Anlagengröße aus der angegebenen Freifläche"
                    : "eigenverbrauchsorientiert ausgelegt auf etwa 70 % des Jahresverbrauchs"}
              {s.flaecheBegrenzt ? ", begrenzt durch die angegebene Fläche" : ""}
              {s.kwpQuelle !== "verbrauch" && s.deckung > 1 ? " – erzeugt bilanziell mehr, als Sie verbrauchen; der Überschuss wird eingespeist" : ""}. Preise nennen wir erst nach Prüfung von Dach, Statik und Netzanschluss – im Gewerbe
              hängen sie zu stark davon ab. Förder- und Steuerangaben: Stand September 2026.
            </p>
          </>
        ) : (
          <>
            <div className="mt-5 grid grid-cols-2 gap-4">
              <Wert label="Anlagengröße" wert={`${r(s.kwp, 1).toLocaleString("de-DE")} kWp`} />
              <Wert label="Speicher" wert={s.speicherKwh ? `${s.speicherKwh} kWh` : "–"} />
              <Wert label="Jahresertrag" wert={`${zahl(r(s.jahresertrag, 100))} kWh`} />
              <Wert label="Autarkie" wert={`${r(Math.round(s.autarkie * 100), 5)} %`} />
            </div>
            <div className="mt-6 rounded-2xl bg-white/[0.06] p-5 ring-1 ring-white/10">
              <p className="text-[13px] text-white/60">Vorteil pro Jahr (Ersparnis + Einspeisung)</p>
              <p className="ov-num mt-1 font-display text-[34px] font-extrabold leading-none tracking-tight text-ov-300 transition-all">{eur(r(s.nutzenProJahr, 50))}</p>
              <p className="mt-3 text-[13px] text-white/60">
                Investition ca.{" "}
                <span className="ov-num text-white">
                  {eur(r(s.investition * 0.9, 500))} – {eur(r(s.investition * 1.15, 500))}
                </span>
                {s.amortisationJahre && (
                  <>
                    {" "}
                    · Amortisation ~ <span className="ov-num text-white">{s.amortisationJahre.toFixed(0)} Jahre</span>
                  </>
                )}
              </p>
            </div>
            <p className="mt-4 text-[12px] leading-relaxed text-white/60">
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
      <p className="text-[12.5px] text-white/60">{label}</p>
      <p className="ov-num mt-0.5 font-display text-[20px] font-extrabold tracking-tight">{wert}</p>
    </div>
  );
}

/**
 * Erfolg = nächste Sprosse der Commitment-Leiter: (1) 20-Minuten-Termin mit vorbelegten Daten,
 * gleichwertig daneben „Später“; (2) Lastgang hochladen; (3) an Kolleg:innen weiterleiten – die Person
 * sendet selbst (navigator.share bzw. mailto:), Ökovolt verschickt nichts an Dritte.
 */
function Erfolg({ vorname, privat, objekt, s, anfrageId, kontakt }) {
  const [wahl, setWahl] = useState(null); // null | "termin" | "spaeter"
  const kopf = useRef(null);

  useEffect(() => {
    kopf.current?.focus();
  }, []);

  // „Was Warten kostet“ mit Werten aus der Einschätzung (Netto-Annahmen des Solarrechners für Betriebe)
  const kosten = useMemo(() => {
    if (privat || !MIT_KOSTEN_DES_WARTENS.includes(objekt) || s.modus !== "gewerbe") return null;
    try {
      const r = berechne({ kwp: s.kwp, ausrichtung: s.ausrichtung, neigung: s.neigung, verbrauch: s.gesamt, speicherKwh: 0, zielgruppe: "gewerbe" });
      return { ersparnisJahr: Math.round(r.ersparnis), investitionNetto: Math.round(r.investition) };
    } catch {
      return null;
    }
  }, [privat, objekt, s]);

  const teilen = async () => {
    const url = `${BASE_URL}/angebot`;
    const text = `PV-Ersteinschätzung von Ökovolt: ca. ${zahl(s.kwp)} kWp, ca. ${zahl(s.jahresertrag)} kWh im Jahr (Richtwerte). Unverbindliche Anfrage und Details: ${url}`;
    const titel = "PV-Ersteinschätzung – Ökovolt";
    ereignis("anfrage_weitergeleitet", { weg: typeof navigator !== "undefined" && navigator.share ? "share" : "mail" });
    try {
      if (navigator.share) {
        await navigator.share({ title: titel, text, url });
        return;
      }
    } catch {
      return; // abgebrochen – nichts weiter tun
    }
    window.location.href = `mailto:?subject=${encodeURIComponent(titel)}&body=${encodeURIComponent(text)}`;
  };

  const knopf = "inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-5 py-2.5 text-center text-[15px] font-semibold leading-snug transition-colors";

  return (
    <div className="ov-step-vor py-2 text-center">
      <div className="relative mx-auto flex h-20 w-20 items-center justify-center">
        <span aria-hidden="true" className="absolute inset-0 animate-ping rounded-full bg-ov-300/50 motion-reduce:animate-none" style={{ animationIterationCount: 2 }} />
        <span aria-hidden="true" className="relative flex h-20 w-20 items-center justify-center rounded-full bg-ov-600 text-white shadow-xl">
          <Check className="h-10 w-10" strokeWidth={3} />
        </span>
      </div>
      <h2 ref={kopf} tabIndex={-1} className="mt-8 font-display text-[clamp(1.6rem,1.2rem+1.2vw,2.2rem)] font-extrabold tracking-tight text-ink-900 outline-none">
        Vielen Dank{vorname ? `, ${vorname}` : ""}!
      </h2>
      <p className="mx-auto mt-3 max-w-md text-[16px] leading-relaxed text-ink-600">
        Ihre Anfrage ist bei uns eingegangen. Wir melden uns persönlich, um {privat ? "Ihr Dach und Ihre Wünsche" : "Fläche, Lastgang und Netzanschluss"} im Detail zu besprechen.
      </p>
      {anfrageId && (
        <p className="mt-2 text-[13.5px] text-ink-500">
          Ihre Anfrage-Nummer: <span className="ov-num font-semibold text-ink-800">{anfrageId}</span>
        </p>
      )}

      {/* 1. Sprosse: Termin – „Später“ gleichwertig daneben */}
      <div className="mx-auto mt-8 grid max-w-2xl gap-3 sm:grid-cols-2">
        <button
          type="button"
          aria-expanded={wahl === "termin"}
          aria-controls="ov-erfolg-termin"
          onClick={() => {
            setWahl(wahl === "termin" ? null : "termin");
            if (wahl !== "termin") ereignis("termin_angeboten", { quelle: "konfigurator" });
          }}
          className={`${knopf} bg-ov-600 text-white hover:bg-ov-700`}
        >
          <CalendarCheck2 aria-hidden="true" className="h-4 w-4 shrink-0" />
          Gleich einen 20-Minuten-Termin wählen – wir gehen Ihre Zahlen gemeinsam durch
        </button>
        <button type="button" aria-pressed={wahl === "spaeter"} onClick={() => setWahl("spaeter")} className={`${knopf} text-ink-900 ring-2 ring-inset ring-ink-200 hover:bg-ink-50`}>
          Später – bitte melden Sie sich bei mir
        </button>
      </div>
      {wahl === "spaeter" && (
        <p role="status" className="mx-auto mt-4 max-w-md text-[14.5px] leading-relaxed text-ink-600">
          Gerne. Wir melden uns persönlich bei Ihnen{kontakt.telefon ? "" : " per E-Mail"} – einen Termin können Sie jederzeit auch über{" "}
          <Link href="/termin" className="font-semibold text-ov-700 underline underline-offset-2">
            /termin
          </Link>{" "}
          wählen.
        </p>
      )}
      {wahl === "termin" && (
        <div id="ov-erfolg-termin" className="mt-6 text-left">
          <TerminBuchung eingebettet art="telefon" bezug={anfrageId} name={kontakt.name} email={kontakt.email} telefon={kontakt.telefon} plz={kontakt.plz} firma={kontakt.firma} thema={kontakt.thema} />
        </div>
      )}

      {/* 2. und 3. Sprosse */}
      <div className="mx-auto mt-8 flex max-w-2xl flex-col justify-center gap-3 sm:flex-row sm:flex-wrap">
        {!privat && (
          <Link href={`/lastgang-analyse${anfrageId ? `?ref=${encodeURIComponent(anfrageId)}` : ""}`} className={`${knopf} text-ink-900 ring-1 ring-inset ring-ink-200 hover:bg-ink-50`}>
            <FileUp aria-hidden="true" className="h-4 w-4" />
            Lastgang jetzt hochladen
          </Link>
        )}
        <button type="button" onClick={teilen} className={`${knopf} text-ink-900 ring-1 ring-inset ring-ink-200 hover:bg-ink-50`}>
          <Share2 aria-hidden="true" className="h-4 w-4" />
          An Kolleg:innen weiterleiten
        </button>
      </div>
      <p className="mx-auto mt-2 max-w-md text-[12.5px] text-ink-500">Beim Weiterleiten senden Sie selbst – wir verschicken nichts an Dritte. Der Text enthält nur die Richtwerte, keine Kontaktdaten.</p>

      {kosten && <KostenDesWartens ersparnisJahr={kosten.ersparnisJahr} investitionNetto={kosten.investitionNetto} className="mx-auto mt-10 max-w-2xl text-left" />}

      <div className="mx-auto mt-10 grid max-w-md gap-3 text-left sm:grid-cols-3">
        {(privat ? ["Rückruf & Bedarfsanalyse", "Dachprüfung & Planung", "Verbindliches Angebot"] : ["Gespräch & Lastganganalyse", "Standort- & Netzprüfung", "Angebot mit Förderprüfung"]).map((t, i) => (
          <div key={t} className="rounded-2xl bg-sand-50 p-4 ring-1 ring-ink-100">
            <p aria-hidden="true" className="font-display text-[13px] font-extrabold text-ov-700">
              0{i + 1}
            </p>
            <p className="mt-1 text-[13.5px] font-semibold leading-snug text-ink-800">{t}</p>
          </div>
        ))}
      </div>
      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <Link href="/referenzen/projekte" className="inline-flex h-12 items-center justify-center rounded-full px-6 text-[15px] font-semibold text-ink-700 underline-offset-4 hover:underline">
          Referenzen ansehen
        </Link>
        <Link href="/foerdercheck" className="inline-flex h-12 items-center justify-center rounded-full px-6 text-[15px] font-semibold text-ink-700 underline-offset-4 hover:underline">
          Förder-Check starten
        </Link>
      </div>
    </div>
  );
}
