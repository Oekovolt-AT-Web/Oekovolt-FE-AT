// src/components/GewerbeUnikat/K8SteckbriefBlatt.js
//
// K8 · Projektsteckbrief als REINE Ansicht (ohne Hooks): weißes Deckblatt auf Navy. Rendert den
// SSR-Platzhalter und – mit Handlern und animierten Bausteinen – die Client-Bühne K8Steckbrief.
//
// Startzustand = vollständig ausgefülltes BEISPIEL-Dossier (Werte aus steckbriefBeispiel() in K8Daten.js,
// gleich den Startzuständen der Kapitel): grau, mit „Beispiel“ gekennzeichnet. Jede Entscheidung in
// K1–K7 und jede Eingabe hier ersetzt eine Zeile: Die Zahl gleitet, die Zeile wird ov-grün und trägt
// „Ihr Wert“ (Endowed Progress). Beispielwerte gehen NIE in die Anfrage (anfrageTeile).
//
// Zahlenfelder tragen den angezeigten Wert als echten value (keine Platzhalter), deutsch formatiert
// („6.000“), als role="spinbutton": ↑/↓, Bild↑/↓, Pos1/Ende rechnen vom angezeigten Wert aus.
// Keine personenbezogenen Daten: nur Zahlen und Kennungen aus dem Steckbrief-Store.

import Image from "next/image";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { cn } from "@/components/ui/cn";
import { acSumme, acVorschlag, torTyp } from "@/components/Technik/torTypen";
import { ERKENNTNISSE, KAPITEL, KENNZEICHNUNG, STAND, prozent, zahl } from "./_tokens";
import { HAUPT_CTA } from "./_cta";

export const HINWEIS_PRIVAT = "Der Steckbrief enthält keine personenbezogenen Daten und bleibt in diesem Browser-Tab, bis Sie die Anfrage senden.";
export const BAUSTEIN_KAPITEL = ["k1", "k2", "k3", "k4", "k5", "k6", "k7"];

const DACHART = { "ost-west": "Ost-West", sued: "Süd", trapez: "Trapezblech", shed: "Shed" };
const FENSTER_LABEL = { schicht: "Laufende Schicht", wochenende: "Wochenenden", betriebsurlaub: "Betriebsurlaub" };

/** Euro auf 10 € gerundet (34.360 € wie in Kurzantwort und Kapitel 07, nicht 34.400 €). */
const euro10 = (v) => `≈ ${zahl(Math.round(v / 10) * 10)} €`;

/**
 * Abschnitte = Kapitel 01–07 plus Montagefenster (08). art: zahl (editierbar) | ergebnis (aus dem Kapitel) |
 * text (Kennung). sprech: Einheit für Screenreader. marker: Felder, deren Wert zeigt, dass das setzende
 * Kapitel eine Entscheidung gespeichert hat (für Felder, deren Startwert schon belegt ist).
 */
export const ABSCHNITTE = [
  {
    id: "betrieb",
    titel: "Betrieb",
    kapitel: "k1",
    felder: [
      { id: "quelle", label: "Datenbasis", art: "text" },
      { id: "jahresverbrauchKwh", label: "Jahresverbrauch", art: "zahl", einheit: "MWh", sprech: "Megawattstunden", faktor: 1000, min: 1, max: 1000000, schritt: 1 },
      { id: "schichten", label: "Schichten (Mo–Fr)", art: "zahl", einheit: "", min: 1, max: 3, schritt: 1 },
    ],
  },
  {
    id: "dach",
    titel: "Dach",
    kapitel: "k2",
    felder: [
      { id: "dachart", label: "Dachart", art: "text", marker: ["kwpMax"] },
      { id: "flaecheQm", label: "Dachfläche", art: "zahl", einheit: "m²", sprech: "Quadratmetern", min: 50, max: 1000000, schritt: 10, marker: ["kwpMax"] },
      { id: "ortId", label: "Ort", art: "text", marker: ["kwpMax"] },
      { id: "kwpMax", label: "Größte Anlage aufs Dach", art: "zahl", einheit: "kWp", sprech: "Kilowatt-Peak", min: 1, max: 100000, schritt: 1 },
    ],
  },
  {
    id: "anlage",
    titel: "Anlage",
    kapitel: "k3",
    felder: [
      { id: "kwp", label: "Anlagengröße", art: "zahl", einheit: "kWp", sprech: "Kilowatt-Peak", min: 1, max: 100000, schritt: 1 },
      { id: "evQuote", label: "Eigenverbrauch", kurz: "EV", art: "ergebnis", format: "prozent" },
      { id: "autarkie", label: "Autarkie", kurz: "Autarkie", art: "ergebnis", format: "prozent" },
      { id: "flotte", label: "E-Fahrzeuge, die mittags laden", art: "zahl", einheit: "Fzg.", sprech: "Fahrzeuge", min: 0, max: 1000, schritt: 1, marker: ["evQuote"] },
    ],
  },
  {
    id: "kwh",
    titel: "Wert der kWh",
    kapitel: "k4",
    felder: [
      { id: "bereich", label: "Netzbereich", art: "text", marker: ["vermiedenCt"] },
      { id: "ne", label: "Netzebene", art: "zahl", einheit: "", min: 5, max: 7, schritt: 1, marker: ["vermiedenCt", "acSummeKw"] },
      { id: "vermiedenCt", label: "Vermiedene Kosten je kWh", art: "ergebnis", einheit: "ct/kWh", stellen: 2 },
    ],
  },
  {
    id: "leistungspreis",
    titel: "Leistungspreis",
    kapitel: "k5",
    felder: [
      { id: "schwelleKw", label: "Deckel für die Monatsspitze", kurz: "Deckel", art: "zahl", einheit: "kW", sprech: "Kilowatt", min: 1, max: 100000, schritt: 1 },
      { id: "speicherKw", label: "Speicher-Leistung", kurz: "Speicher", art: "zahl", einheit: "kW", sprech: "Kilowatt", min: 0, max: 100000, schritt: 1 },
      { id: "speicherKwh", label: "Speicher-Kapazität", art: "zahl", einheit: "kWh", sprech: "Kilowattstunden", min: 0, max: 1000000, schritt: 1 },
      { id: "lpErsparnisEuro", label: "Ersparnis Leistungspreis", art: "ergebnis", format: "euro", einheit: "pro Jahr" },
    ],
  },
  {
    id: "netz",
    titel: "Netzanschluss",
    kapitel: "k6",
    felder: [
      { id: "acSummeKw", label: "AC-Leistung am Anschluss", art: "ergebnis", einheit: "kW" },
      { id: "torTyp", label: "TOR Erzeuger", art: "ergebnis", format: "tor" },
    ],
  },
  {
    id: "wirtschaft",
    titel: "Wirtschaftlichkeit",
    kapitel: "k7",
    felder: [
      { id: "amortisationJahre", label: "Statische Amortisation", art: "ergebnis", format: "jahre", einheit: "Jahre" },
      { id: "ueberschussJahr", label: "Jährlicher Überschuss", art: "ergebnis", format: "euro", einheit: "pro Jahr" },
    ],
  },
  {
    id: "montage",
    titel: "Montagefenster",
    kapitel: "k8",
    felder: [{ id: "montagefenster", label: "Montage", art: "text" }],
  },
];

const ALLE_FELDER = ABSCHNITTE.flatMap((a) => a.felder);
const KAPITEL_NACH_ID = Object.fromEntries(KAPITEL.map((k, i) => [k.id, { ...k, nn: String(i).padStart(2, "0") }]));
export const kapitelInfo = (id) => KAPITEL_NACH_ID[id] || null;

/** Hat der Besucher diesen Wert festgelegt (in einem Kapitel oder hier)? */
export function feldIstIhr(f, sb, start) {
  const v = sb[f.id];
  if (f.id === "quelle") return sb.quelle === "eigen";
  if (v == null || v === "") return false;
  if (f.id === "jahresverbrauchKwh") return sb.quelle === "eigen" || v !== start[f.id];
  if (start[f.id] == null) return true; // nur Kapitel oder dieses Blatt setzen das Feld
  if (v !== start[f.id]) return true;
  // Startwert unverändert: gilt als Ihrer, wenn das setzende Kapitel seine Entscheidung gespeichert hat
  return (f.marker || []).some((m) => sb[m] != null);
}

/**
 * Angezeigte Werte und Zustand je Feld. Ihr Wert, sonst Beispiel. Das Netz-Beispiel folgt der angezeigten
 * Anlagengröße (Wechselrichter-Vorschlag kWp ÷ 1,15 aus torTypen.js, ohne Speicher – wie Kapitel 06).
 */
export function blattWerte(sb, start, bsp) {
  const w = {};
  const ihr = {};
  for (const f of ALLE_FELDER) {
    ihr[f.id] = feldIstIhr(f, sb, start);
    w[f.id] = ihr[f.id] ? sb[f.id] : bsp.werte[f.id];
  }
  if (!ihr.acSummeKw && Number.isFinite(w.kwp)) {
    w.acSummeKw = acVorschlag(w.kwp);
    w.torTyp = torTyp(w.acSummeKw).typ.toLowerCase();
  }
  return { w, ihr };
}

/** Text eines Werts (Zahlen-Felder ohne Einheit). v: Zahl (gleitend) oder Kennung. */
export function formatWert(f, v, { orte, bereiche } = {}) {
  if (f.id === "quelle") return v === "eigen" ? "Ihr Lastgang" : "Synthetischer Beispielbetrieb";
  if (v == null || v === "") return "–";
  if (f.id === "dachart") return DACHART[v] || v;
  if (f.id === "ortId") return orte?.[v] || v;
  if (f.id === "bereich") return bereiche?.[v] || v;
  if (f.id === "montagefenster") return FENSTER_LABEL[v] || v;
  if (f.format === "tor") return `Typ ${String(v).toUpperCase()}`;
  if (!Number.isFinite(v)) return "–";
  if (f.format === "prozent") return prozent(v);
  if (f.format === "euro") return euro10(v);
  if (f.format === "jahre") return `≈ ${zahl(v, 1)}`;
  if (f.faktor) return zahl(v / f.faktor, 0);
  return zahl(v, f.stellen ?? 0);
}

/** Zahl eines Felds in Anzeige-Einheit (MWh statt kWh), ganzzahlig – alle Eingabefelder sind ganzzahlig. */
export const anzeigeZahl = (f, v) => (v == null || !Number.isFinite(v) ? null : Math.round(f.faktor ? v / f.faktor : v));

/** Text für das Eingabefeld: deutsch formatiert („6.000“); liesZahlDe() liest ihn zurück. */
export function eingabeWert(f, v) {
  const x = anzeigeZahl(f, v);
  return x == null ? "" : zahl(x);
}

/** Was die Anfrage übernimmt – nur Werte des Besuchers, nie Beispielwerte. */
export function anfrageTeile(sb, start) {
  const t = [];
  if (sb.kwp) t.push(`Anlagengröße ${zahl(sb.kwp)} kWp`);
  if (sb.jahresverbrauchKwh && (sb.quelle === "eigen" || sb.bausteine.includes("k1") || sb.jahresverbrauchKwh !== start.jahresverbrauchKwh)) t.push(`Jahresverbrauch ${zahl(sb.jahresverbrauchKwh / 1000)} MWh`);
  if (sb.speicherKwh) t.push(`Speicher ${zahl(sb.speicherKwh)} kWh`);
  return t;
}

/** Ein Erklärsatz je Abschnitt: worauf das Beispiel beruht – oder warum zwei Werte nicht zusammenpassen. */
function abschnittNotiz(a, { w, ihr, bsp, ctx }) {
  const b = bsp.bezug;
  const bw = bsp.werte;
  switch (a.id) {
    case "betrieb":
      return ihr.quelle ? null : { text: "Synthetischer Beispielbetrieb, keine Messdaten.", link: "Eigenen Lastgang darüberlegen", href: "#lastgang" };
    case "dach":
      if (ihr.kwpMax) return null;
      return {
        text: ihr.flaecheQm || ihr.dachart ? `Größte Anlage gilt für die Modellhalle ${zahl(b.breiteM)} × ${zahl(b.laengeM)} m, Ost-West.` : `Modellhalle ${zahl(b.breiteM)} × ${zahl(b.laengeM)} m in ${ctx.orte?.[bw.ortId] || "Linz"}.`,
        link: "Ihre Halle in Kapitel 02",
        href: "#hallendach",
      };
    case "anlage":
      if (ihr.evQuote) return null;
      // Eigener Lastgang geladen, aber Kapitel 03 noch nicht bedient: Werte sind die des Beispielbetriebs
      if (ihr.quelle) return { text: `Grau = Beispielbetrieb (${zahl(bw.kwp)} kWp). Mit Ihrem Lastgang zeigt Kapitel 03 Größe, Eigenverbrauch und Autarkie.`, link: "Kapitel 03 öffnen", href: "#eigenverbrauch" };
      if (ihr.kwp && w.kwp !== bw.kwp)
        return { text: `Eigenverbrauch und Autarkie gelten für ${zahl(bw.kwp)} kWp im Beispielbetrieb.`, link: `Mit ${zahl(w.kwp)} kWp in Kapitel 03 rechnen`, href: "#eigenverbrauch" };
      return { text: `Empfehlung des Stundenmodells: Linz, Ost-West, ≈ ${zahl(b.modellErtrag)} kWh/kWp.`, link: "Kapitel 03", href: "#eigenverbrauch" };
    case "kwh":
      if (ihr.vermiedenCt) return null;
      return {
        text: `${ihr.ne && w.ne !== bw.ne ? "Kosten je kWh gelten für " : ""}Netzebene ${bw.ne} ${ctx.bereiche?.[bw.bereich] || ""}, Energiepreis ${zahl(b.energieCt)} ct/kWh.`.replace(/\s+,/, ","),
        link: "Ihre Netzrechnung in Kapitel 04",
        href: "#kwh-wert",
      };
    case "leistungspreis":
      if (ihr.lpErsparnisEuro) return null;
      if (ihr.quelle) return { text: `Grau = Beispielbetrieb (Deckel bei 74 % von ${zahl(b.spitzeKw)} kW). Ziehen Sie den Deckel über Ihrem Lastgang, dann stehen hier Ihre Werte.`, link: "Deckel in Kapitel 05 ziehen", href: "#leistungspreis" };
      return { text: `Deckel bei 74 % der Jahresspitze (${zahl(b.spitzeKw)} kW) im synthetischen Lastgang, Netzebene 6 Oberösterreich.`, link: "Deckel in Kapitel 05 ziehen", href: "#leistungspreis" };
    case "netz": {
      const sp = Number.isFinite(w.speicherKw) && w.speicherKw > 0 ? w.speicherKw : 0;
      const mit = (ac) => {
        const summe = acSumme({ wrKva: ac, speicherKva: sp });
        return ` Mit dem Speicher aus 05 (${zahl(sp)} kW): ≈ ${zahl(summe)} kW, TOR Typ ${torTyp(summe).typ}.`;
      };
      if (!ihr.acSummeKw) return { text: `Wechselrichter-Vorschlag ${zahl(w.kwp)} kWp ÷ 1,15, ohne Speicher.${sp ? mit(w.acSummeKw) : ""}`, link: "In Kapitel 06 prüfen", href: "#netzanschluss" };
      // Kapitel 06 ohne Speicher gerechnet, Kapitel 05 mit Speicher → Summe nennen
      const wr = Number.isFinite(ctx.wrKva) ? ctx.wrKva : null;
      if (sp && wr != null && Math.abs(w.acSummeKw - wr) < 0.5) return { text: `Ohne Speicher gerechnet.${mit(w.acSummeKw)}`, link: "In Kapitel 06 prüfen", href: "#netzanschluss" };
      return null;
    }
    case "wirtschaft":
      if (ihr.ueberschussJahr) return null;
      return {
        text: `Rechenbeispiel: ${zahl(b.rbKwp)} kWp, ${prozent(b.rbEv)} Eigenverbrauch, ${zahl(b.rbErtrag)} kWh/kWp (Stand ${b.rbStand}).`,
        link: ihr.kwp && w.kwp !== b.rbKwp ? `Mit ${zahl(w.kwp)} kWp in Kapitel 07 nachrechnen` : "Mit Ihren Werten in Kapitel 07",
        href: "#wirtschaftlichkeit",
      };
    case "montage":
      if (ihr.montagefenster) return null;
      // Betriebsurlaub kennt nur der synthetische Lastgang – bei eigenen Daten nichts behaupten
      if (ihr.quelle) return { text: "Montagefenster nach Ihrem Betriebskalender – etwa Betriebsurlaub oder ruhige Wochen.", link: "Fenster wählen", href: "#k8-montage" };
      return { text: `Im Beispiel erkannt: Betriebsurlaub ${b.urlaub} (synthetisch).`, link: "Fenster wählen", href: "#k8-montage" };
    default:
      return null;
  }
}

/** Kurzfassung eines Abschnitts (mobil, zugeklappt): höchstens drei Werte. */
function zusammenfassung(a, w, ihr, ctx) {
  const teile = [];
  for (const f of a.felder) {
    if (f.id === "quelle") continue;
    const v = w[f.id];
    if (v == null || v === "" || v === 0) continue;
    const t = formatWert(f, v, ctx);
    let text = t;
    if (f.id === "schichten") text = v === 1 ? "1 Schicht" : `${t} Schichten`;
    else if (f.id === "ne") text = `NE ${t}`;
    else if (f.format === "prozent") text = `${f.kurz ?? f.label} ${t}`;
    else if (f.format === "euro") text = `${t}/Jahr`;
    else if (f.format === "jahre") text = `${t} Jahre`;
    else if (f.einheit && f.format !== "tor") text = `${f.kurz ? `${f.kurz} ` : ""}${t} ${f.einheit}`;
    teile.push({ text, ihr: ihr[f.id] });
    if (teile.length === 3) break;
  }
  return teile;
}

// ---------------------------------------------------------------------------------------------------
// Statische Standard-Bausteine (SSR-Platzhalter). Die Client-Bühne reicht animierte Fassungen herein.
// ---------------------------------------------------------------------------------------------------

/** Zahl (SSR: sofort der Zielwert). Client: gleitet zum neuen Wert. */
function StatischeZahl({ ziel, format }) {
  return <span className="ov-num">{format(ziel)}</span>;
}

/** Eingabefeld (SSR: nur lesen). Client: editierbar, gleitet ohne Fokus. */
function StatischeEingabe({ f, ziel, entwurf, verzoegerung, onAendern, onSchritt, onVerlassen, ...rest }) {
  return <input type="text" value={eingabeWert(f, ziel)} readOnly tabIndex={-1} {...rest} />;
}

/** Ganzzahl-Zähler (SSR). */
function StatischerZaehler({ ziel }) {
  return <span className="ov-num">{zahl(ziel)}</span>;
}

/** Zustand eines Abschnitts: alle, manche oder keine Werte vom Besucher. */
function Status({ zustand, klein = false }) {
  const s = {
    ihr: ["Ihre Werte", "bg-ov-100 text-ov-800"],
    teils: ["teils Ihre", "bg-ov-50 text-ov-800"],
    beispiel: ["Beispiel", "bg-ink-100 text-ink-600"],
  }[zustand];
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center rounded-full font-semibold transition-colors duration-500",
        klein ? "h-5 px-2 text-[11px]" : "h-6 px-2.5 text-[11.5px]",
        s[1]
      )}
    >
      {s[0]}
    </span>
  );
}

/**
 * Mobiler Abschnittskopf: Akkordeon-Knopf – beim Montagefenster ein Sprung zu Station 5 (dort wird gewählt).
 * Oben Nummer, Titel, Zustand und „ändern“, darunter die Kurzfassung über die volle Breite (eine Zeile).
 */
function MobilKopf({ montage, auf, controls, onClick, rechts, kopf, unter }) {
  const klasse = "block min-h-12 w-full rounded-xl bg-ink-50 px-3.5 py-1.5 text-left";
  const inhalt = (
    <>
      <span className="flex items-center gap-2">
        {kopf}
        <span className="ml-auto shrink-0 pl-2 font-sans text-[13px] font-semibold text-ov-700">{rechts}</span>
      </span>
      {unter}
    </>
  );
  if (montage) {
    return (
      <a href="#k8-montage" className={klasse}>
        {inhalt}
      </a>
    );
  }
  return (
    <button type="button" aria-expanded={auf} aria-controls={controls} onClick={onClick} className={klasse}>
      {inhalt}
    </button>
  );
}

/** Kennzahl im Kopf des Blatts (Zahl groß, Einheit 0,55 em, Zustand darunter). */
function Kennzahl({ label, ihr, children, einheit, verzoegerung = 0 }) {
  return (
    <div className="relative min-w-0 pt-2.5 md:pt-3" style={{ "--k8-v": `${verzoegerung}ms` }}>
      <span
        aria-hidden="true"
        className={cn("absolute inset-x-0 top-0 h-[2px] rounded-full transition-colors duration-500 delay-(--k8-v)", ihr ? "bg-ov-500" : "bg-ink-200")}
      />
      <span className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-500 md:text-[11.5px]">{label}</span>
      <span
        className={cn(
          "mt-1 block whitespace-nowrap font-display text-[22px] font-extrabold leading-none tracking-[-0.03em] transition-colors duration-500 delay-(--k8-v) md:mt-1.5 md:text-[30px]",
          ihr ? "text-ink-900" : "text-ink-500"
        )}
      >
        {children}
        {einheit && <span className="ml-1 text-[0.55em] font-bold">{einheit}</span>}
      </span>
      <span className={cn("mt-1.5 items-center gap-1.5 text-[12px] font-semibold max-md:hidden md:flex", ihr ? "text-ov-700" : "text-ink-500")}>
        <span aria-hidden="true" className={cn("h-1.5 w-1.5 rounded-full", ihr ? "bg-ov-500" : "bg-ink-300")} />
        {ihr ? "Ihr Wert" : "Beispiel"}
      </span>
    </div>
  );
}

/**
 * Das Deckblatt.
 * sb: angezeigter Steckbrief-Zustand · start: STECKBRIEF_START · bsp: { werte, bezug } aus steckbriefBeispiel()
 * orte/bereiche: Namen je Kennung · teile: was die Anfrage übernimmt (aus dem echten Zustand)
 * Client-Props: entwurf, onFeld(f, a, text), onVerlassen(f), offen, onAbschnitt(id), Zeile (motion je
 *   Zeile), Zahl, Eingabe, Zaehler (animiert), ankunft (Kaskade beim Aufholen), anfrageHref, rechnerHref,
 *   onAnfrage, leeren (ReactNode), ansage, onFokus (Fokus im Blatt)
 */
export default function K8SteckbriefBlatt({
  sb,
  start,
  bsp,
  orte,
  bereiche,
  teile,
  entwurf = {},
  onFeld,
  onVerlassen,
  offen = {},
  onAbschnitt,
  Zeile = "div",
  Zahl = StatischeZahl,
  Eingabe = StatischeEingabe,
  Zaehler = StatischerZaehler,
  ankunft = false,
  anfrageHref = "/angebot?objekt=gewerbe",
  rechnerHref = "/rechner/gewerbe-pv",
  onAnfrage,
  leeren,
  ansage,
  interaktiv = false,
}) {
  const ctx = { orte, bereiche, wrKva: sb.wrKva };
  const { w, ihr } = blattWerte(sb, start, bsp);
  const zahlBausteine = BAUSTEIN_KAPITEL.filter((k) => sb.bausteine.includes(k)).length;
  const erkenntnisse = ERKENNTNISSE.filter((e) => sb.erkenntnisse.includes(e.id));
  const uebernimmt = teile ?? anfrageTeile(sb, start);
  // Kaskade beim Aufholen: jede Zeile etwas später (höchstens ≈ 0,7 s)
  let n = 0;
  const v = () => (ankunft ? Math.min(700, n++ * 45) : 0);
  const zweiSichten = !ihr.ueberschussJahr && w.kwp !== bsp.bezug.rbKwp;

  return (
    <div className="relative" data-ihre-werte={Object.values(ihr).filter(Boolean).length}>
      {/* zweites Blatt dahinter – Deckblatt-Anmutung, rein dekorativ */}
      <div aria-hidden="true" className="absolute inset-x-6 -bottom-2.5 top-4 rounded-[28px] bg-white/[0.08] md:inset-x-10" />
      <article
        aria-labelledby="k8-blatt-titel"
        className="relative rounded-[24px] bg-white px-4 pb-6 pt-4 text-ink-900 shadow-[0_40px_90px_-30px_rgba(0,0,0,0.7),0_2px_6px_rgba(0,0,0,0.12)] sm:px-8 md:rounded-[26px] md:px-10 md:pb-10 md:pt-9"
      >
        <Zeile className="flex items-center justify-between gap-4 border-b border-ink-900/[0.08] pb-4 md:pb-5">
          <Image src="/logo-oekovolt.png" alt="Ökovolt" width={1066} height={234} sizes="132px" className="h-auto w-[104px] md:w-[132px]" />
          <p className="text-right text-[11.5px] font-semibold uppercase leading-snug tracking-[0.14em] text-ink-500">
            Projektsteckbrief
            <span className="block font-medium normal-case tracking-normal">Gewerbe &amp; Industrie</span>
          </p>
        </Zeile>

        <Zeile className="mt-4 md:mt-6">
          <p id="k8-blatt-titel" className="font-display text-[21px] font-extrabold leading-tight tracking-[-0.02em] text-ink-900 md:text-[28px]">
            Photovoltaik für Ihren Betrieb
          </p>
          <p className="mt-1 text-[13.5px] leading-snug text-ink-600 md:mt-1.5 md:text-[14px]">
            <span className="max-md:hidden">Grundlage: </span>
            {sb.quelle === "eigen" ? (
              "Ihr Lastgang, ausgewertet nur in diesem Browser"
            ) : (
              <>
                Synthetischer Beispielbetrieb · <span className="max-md:hidden">{KENNZEICHNUNG.beispiel}</span>
                <span className="md:hidden">kein Angebot</span>
              </>
            )}
          </p>
        </Zeile>

        {/* Eckdaten: vier Kennzahlen, Beispiel grau, Ihre Werte schwarz mit ov-Strich */}
        <Zeile className="mt-5 md:mt-7">
          <dl className="grid grid-cols-2 gap-x-5 gap-y-3.5 md:grid-cols-4 md:gap-x-6" aria-label="Eckdaten">
            {[
              { id: "kwp", label: "Anlage", einheit: "kWp", format: (x) => zahl(x) },
              { id: "evQuote", label: "Eigenverbrauch", format: (x) => prozent(x) },
              { id: "ueberschussJahr", label: "Überschuss/Jahr", format: (x) => euro10(x) },
              { id: "amortisationJahre", label: "Amortisation", einheit: "Jahre", format: (x) => `≈ ${zahl(x, 1)}` },
            ].map((k) => (
              <div key={k.id} className="contents">
                <dt className="sr-only">{k.label}</dt>
                <dd className="min-w-0">
                  <Kennzahl label={k.label} ihr={ihr[k.id]} einheit={k.einheit} verzoegerung={0}>
                    {Number.isFinite(w[k.id]) ? <Zahl ziel={w[k.id]} format={k.format} verzoegerung={0} /> : "–"}
                    <span className="sr-only">{ihr[k.id] ? " (Ihr Wert)" : " (Beispielwert)"}</span>
                  </Kennzahl>
                </dd>
              </div>
            ))}
          </dl>
          <p className="mt-3 text-[12.5px] leading-snug text-ink-500 md:mt-3.5">
            <span className="mr-1.5 inline-flex rounded-full bg-ink-100 px-2 py-0.5 font-semibold text-ink-600">
              {KENNZEICHNUNG.richtwert} · {STAND.werte}
            </span>
            <span className="md:hidden">Grau = Beispiel. </span>
            {zweiSichten ? (
              <>
                Überschuss und Amortisation: Rechenbeispiel mit {zahl(bsp.bezug.rbKwp)} kWp (07)<span className="max-md:hidden"> </span>
                <span className="max-md:hidden">– Anlage und Eigenverbrauch: Stundenmodell (03). Zwei offen benannte Sichten</span>.
              </>
            ) : (
              "Werte aus den Kapiteln dieser Seite; verbindlich wird erst die Auslegung mit Ihren Daten."
            )}
          </p>
        </Zeile>

        {/* Bausteine 01–07 */}
        <Zeile className="mt-5 md:mt-7">
          <ol className="grid grid-cols-7 gap-1.5 md:gap-2" aria-label="Bausteine aus den Kapiteln">
            {BAUSTEIN_KAPITEL.map((id) => {
              const k = kapitelInfo(id);
              const da = sb.bausteine.includes(id);
              return (
                <li key={id} className="min-w-0">
                  <a
                    href={`#${k.anker}`}
                    aria-label={`Kapitel ${k.nn} ${k.kurz}: ${da ? "Ihre Werte" : "Beispiel"}`}
                    style={{ "--k8-v": `${v()}ms` }}
                    className={cn(
                      "flex h-10 flex-col justify-center rounded-xl px-1.5 text-center transition-colors delay-(--k8-v) duration-500 md:h-[58px] md:px-2 md:text-left",
                      da ? "bg-ov-600 text-white hover:bg-ov-700" : "bg-ink-100 text-ink-600 hover:bg-ink-200"
                    )}
                  >
                    <span className="ov-num font-display text-[13px] font-extrabold leading-none">{k.nn}</span>
                    <span lang="de" className={cn("mt-1 hidden hyphens-auto break-words text-[11px] font-semibold leading-[1.15] transition-colors delay-(--k8-v) duration-500 md:line-clamp-2", da ? "text-white/90" : "text-ink-600")}>
                      {k.kurz}
                    </span>
                  </a>
                </li>
              );
            })}
          </ol>
          <p className="mt-2.5 text-[13.5px] leading-snug text-ink-600">
            <output aria-live="polite" data-testid="steckbrief-fortschritt">
              <span className="font-semibold text-ink-900">
                <Zaehler ziel={zahlBausteine} /> von 7 Bausteinen
              </span>{" "}
              {zahlBausteine === 7 ? (
                "sind Ihre – das Blatt ist komplett."
              ) : (
                <>
                  sind schon Ihre
                  <span className="max-md:hidden">{zahlBausteine === 0 ? " – jede Entscheidung auf dieser Seite ersetzt ein Beispiel" : ", der Rest bleibt Beispiel"}</span>.
                </>
              )}
            </output>
          </p>
        </Zeile>

        {/* Abschnitte */}
        <Zeile className="mt-5 grid gap-x-10 gap-y-1.5 md:mt-8 md:grid-cols-2 md:gap-y-8">
          {ABSCHNITTE.map((a) => {
            const zahlIhr = a.felder.filter((f) => ihr[f.id]).length;
            const status = zahlIhr === 0 ? "beispiel" : zahlIhr === a.felder.length ? "ihr" : "teils";
            const auf = !!offen[a.id];
            const kurz = zusammenfassung(a, w, ihr, ctx);
            const kNn = kapitelInfo(a.kapitel)?.nn;
            const notiz = abschnittNotiz(a, { w, ihr, bsp, ctx });
            const montage = a.id === "montage";
            return (
              <section key={a.id} aria-labelledby={`k8-sb-${a.id}`} className="min-w-0" data-abschnitt={a.id} data-zustand={status}>
                <div className="flex items-center justify-between gap-3 max-md:hidden">
                  <h4 id={`k8-sb-${a.id}`} className="flex min-w-0 items-baseline gap-2 font-display text-[16.5px] font-bold text-ink-900">
                    <span className="ov-num text-[12px] font-extrabold text-ink-500">{kNn}</span>
                    {a.titel}
                  </h4>
                  <Status zustand={status} />
                </div>
                {/* mobil: Kopf und Kurzfassung in einem Knopf (Akkordeon), Felder 48 px; Montagefenster → Station 5 */}
                <h4 className="font-display md:hidden">
                  <MobilKopf
                    montage={montage}
                    auf={auf}
                    controls={`k8-sb-felder-${a.id}`}
                    onClick={onAbschnitt ? () => onAbschnitt(a.id) : undefined}
                    rechts={montage ? (ihr.montagefenster ? "ändern" : "wählen") : auf ? "fertig" : "ändern"}
                    kopf={
                      <>
                        <span className="ov-num text-[11.5px] font-extrabold text-ink-500">{kNn}</span>
                        <span className="text-[15px] font-bold text-ink-900">{a.titel}</span>
                        <Status zustand={status} klein />
                      </>
                    }
                    unter={
                      kurz.length > 0 && (
                        <span className="mt-0.5 block truncate font-sans text-[13px] leading-snug">
                          {kurz.map((t, i) => (
                            <span key={i} className={cn("transition-colors duration-500", t.ihr ? "font-semibold text-ink-900" : "text-ink-500")}>
                              {i > 0 && <span className="text-ink-500"> · </span>}
                              {t.text}
                            </span>
                          ))}
                        </span>
                      )
                    }
                  />
                </h4>
                <div id={`k8-sb-felder-${a.id}`} className={cn("max-md:px-1 max-md:pb-2", (!auf || montage) && "max-md:hidden")}>
                  <dl className="mt-1.5 divide-y divide-ink-900/[0.07] md:mt-2">
                    {a.felder.map((f) => (
                      <FeldZeile
                        key={f.id}
                        f={f}
                        a={a}
                        ihr={ihr[f.id]}
                        wert={w[f.id]}
                        ctx={ctx}
                        verzoegerung={ihr[f.id] ? v() : 0}
                        wertEntwurf={entwurf[f.id]}
                        onFeld={onFeld}
                        onVerlassen={onVerlassen}
                        Zahl={Zahl}
                        Eingabe={Eingabe}
                        interaktiv={interaktiv}
                      />
                    ))}
                  </dl>
                  {notiz && (
                    <p className="mt-2 text-[12.5px] leading-snug text-ink-500">
                      {notiz.text}{" "}
                      <a href={notiz.href} className="whitespace-nowrap font-semibold text-ov-700 underline decoration-ov-700/30 underline-offset-2 hover:text-ov-800">
                        {notiz.link}
                      </a>
                    </p>
                  )}
                </div>
              </section>
            );
          })}
        </Zeile>

        {/* Erkenntnisse */}
        <Zeile className="mt-5 rounded-2xl bg-sand-50 px-4 py-3.5 md:mt-8 md:px-6 md:py-5">
          <h4 className="flex items-baseline justify-between gap-3 font-display text-[16px] font-bold text-ink-900 md:text-[16.5px]">
            Ihre Erkenntnisse
            <span className="ov-num font-sans text-[12.5px] font-semibold text-ink-500">
              {erkenntnisse.length} von {ERKENNTNISSE.length}
            </span>
          </h4>
          {erkenntnisse.length ? (
            <ul className="mt-3 grid gap-3" data-testid="steckbrief-erkenntnisse">
              {erkenntnisse.map((e) => {
                const k = kapitelInfo(e.kapitel);
                return (
                  <li key={e.id} className="relative pl-4">
                    <span aria-hidden="true" className="absolute left-0 top-[0.25em] h-[1.05em] w-[3px] rounded-full bg-ov-500" />
                    <span className="font-display text-[15px] font-bold leading-snug text-ink-900">{e.text}</span>
                    {k && (
                      <a href={`#${k.anker}`} className="ml-2 whitespace-nowrap text-[12.5px] font-semibold text-ink-600 underline decoration-ink-300 underline-offset-2 hover:text-ink-900">
                        {k.id === "hero" ? "Überblick" : `Kapitel ${k.nn}`}
                      </a>
                    )}
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="mt-1 text-[13.5px] leading-snug text-ink-600 md:mt-1.5 md:text-[14px] md:leading-relaxed">
              Noch keine – sie erscheinen beim Ausprobieren, etwa im{" "}
              <a href="#lastgang" className="font-semibold text-ov-700 underline decoration-ov-700/30 underline-offset-2">
                Lastgang-Teppich
              </a>
              .
            </p>
          )}
        </Zeile>

        {/* Ausgang – nicht Teil des Aufbaus: sofort sichtbar */}
        <div className="mt-5 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3 md:mt-8">
          {/* Haupt-CTA seitenweit gleich (HAUPT_CTA); der Rechner ist nur noch Textlink (Jury 13.10.2026) */}
          <Button href={anfrageHref} onClick={onAnfrage} pfeil variant="primary" data-testid={interaktiv ? "steckbrief-anfrage" : undefined} className="min-h-12 max-sm:w-full">
            {HAUPT_CTA}
            <span className="sr-only"> mit diesen Werten</span>
          </Button>
          <Link href={rechnerHref} className="inline-flex min-h-11 items-center text-[14px] font-semibold text-ink-700 underline decoration-ink-300 underline-offset-4 hover:text-ink-900 max-sm:justify-center">
            Im Gewerbe-PV-Rechner weiterrechnen
          </Link>
        </div>
        <p data-testid="steckbrief-uebernimmt" className="mt-3 text-[13px] leading-snug text-ink-600">
          {uebernimmt.length ? (
            <>
              Die Anfrage übernimmt: <span className="font-semibold text-ink-900">{uebernimmt.join(" · ")}</span>. Beispielwerte bleiben hier.
            </>
          ) : (
            <>
              Beispielwerte gehen nicht in die Anfrage<span className="max-md:hidden"> – Ihre Angaben ergänzen Sie im Formular</span>.
            </>
          )}
        </p>
        <div className="mt-1 flex flex-wrap items-center gap-x-5 text-[13.5px] md:gap-x-6 md:text-[14px]">
          <Link href="/termin?art=video&thema=gewerbe" className="inline-flex min-h-11 items-center font-semibold text-ov-700 underline decoration-ov-700/30 underline-offset-4 hover:text-ov-800">
            Videotermin vereinbaren
          </Link>
          {leeren ?? <span className="inline-flex min-h-11 items-center font-semibold text-ink-600 underline decoration-ink-300 underline-offset-4">Steckbrief leeren</span>}
        </div>
        <p className="mt-1 text-[12.5px] leading-snug text-ink-500">{HINWEIS_PRIVAT}</p>
        {ansage != null && (
          <p aria-live="polite" className="sr-only">
            {ansage}
          </p>
        )}
      </article>
    </div>
  );
}

function FeldZeile({ f, a, ihr, wert, ctx, verzoegerung, wertEntwurf, onFeld, onVerlassen, Zahl, Eingabe, interaktiv }) {
  const id = `k8-sb-${f.id}`;
  const stil = { "--k8-v": `${verzoegerung}ms` };
  const ton = ihr ? "font-semibold text-ink-900" : "font-medium text-ink-500";
  const marke = <span className="sr-only">{ihr ? " (Ihr Wert)" : " (Beispielwert)"}</span>;

  let wertKnoten;
  if (f.art === "zahl") {
    wertKnoten = (
      <>
        <Eingabe
          id={id}
          f={f}
          ziel={wert}
          entwurf={wertEntwurf}
          verzoegerung={verzoegerung}
          inputMode="numeric"
          autoComplete="off"
          onAendern={onFeld ? (text) => onFeld(f, a, text) : undefined}
          onVerlassen={onVerlassen ? () => onVerlassen(f) : undefined}
          data-testid={interaktiv ? `feld-${f.id}` : undefined}
          className={cn(
            "ov-num h-12 w-[6.5rem] rounded-xl px-3 text-right text-[15px] transition-colors duration-500 delay-(--k8-v) md:h-10 md:w-[6.25rem] md:rounded-lg",
            ihr ? "bg-white font-semibold text-ink-900 shadow-[inset_0_0_0_1px_rgba(85,130,39,0.28)]" : "bg-ink-100 font-medium text-ink-500",
            "hover:bg-ink-200/70 focus:bg-white focus:text-ink-900 focus:shadow-[inset_0_0_0_1.5px_var(--color-ov-500)]"
          )}
        />
        <span aria-hidden="true" className="w-9 text-[13px] text-ink-500">
          {f.einheit}
        </span>
      </>
    );
  } else if (f.art === "ergebnis") {
    wertKnoten =
      wert == null || wert === "" ? (
        <span className="text-[15px] text-ink-500">–</span>
      ) : (
        <span className={cn("ov-num whitespace-nowrap text-[15px] transition-colors duration-500 delay-(--k8-v)", ton)}>
          {f.format === "tor" ? formatWert(f, wert) : <Zahl ziel={wert} format={(x) => formatWert(f, x)} verzoegerung={verzoegerung} />}
          {f.einheit && f.format !== "prozent" && <span className="ml-1 text-[0.8em] font-medium text-ink-500">{f.einheit}</span>}
          {marke}
        </span>
      );
  } else {
    wertKnoten = (
      <span className={cn("text-right text-[15px] transition-colors duration-500 delay-(--k8-v)", ton)}>
        {formatWert(f, wert, ctx)}
        {marke}
      </span>
    );
  }

  return (
    <div
      style={stil}
      data-feld={f.id}
      data-zustand={ihr ? "ihr" : "beispiel"}
      className={cn(
        "-mx-2 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 rounded-lg px-2 py-2 transition-colors duration-500 delay-(--k8-v) md:py-2",
        ihr ? "bg-ov-50" : "bg-transparent"
      )}
    >
      <dt className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-0.5 text-[14px] leading-snug text-ink-700">
        {f.art === "zahl" ? (
          <label htmlFor={id}>
            {f.label}
            {f.sprech && <span className="sr-only"> in {f.sprech}</span>}
            {marke}
          </label>
        ) : (
          <span>{f.label}</span>
        )}
        {ihr && (
          <span aria-hidden="true" className="inline-flex h-5 items-center rounded-full bg-ov-100 px-2 text-[11px] font-semibold text-ov-800">
            Ihr Wert
          </span>
        )}
      </dt>
      <dd className="flex items-center justify-end gap-1.5">{wertKnoten}</dd>
    </div>
  );
}
