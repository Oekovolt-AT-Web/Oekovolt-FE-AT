"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BatteryCharging,
  ChevronLeft,
  ChevronRight,
  Cpu,
  Gauge,
  LayoutGrid,
  PlugZap,
  Sun,
  Thermometer,
  Wrench,
} from "lucide-react";

/**
 * Anlagen-Explorer: Aus welchen Bausteinen besteht eine Photovoltaikanlage?
 * Illustriertes Haus mit Hotspots – Klick/Tipp auf einen Baustein zeigt
 * Aufgabe, Orientierungswerte (Stand 2026) und worauf wir bei der Planung achten.
 * Die Zeichnung ist eine schematische Darstellung, keine Installationsvorlage.
 */

const BAUSTEINE = [
  {
    id: "module",
    icon: Sun,
    titel: "Solarmodule",
    kurz: "Erzeugen den Strom",
    text: "Die Module wandeln Sonnenlicht in Gleichstrom um. Moderne monokristalline Module liefern auf gleicher Fläche deutlich mehr Leistung als noch vor wenigen Jahren – entscheidend für den Ertrag sind aber Ausrichtung, Neigung und Verschattung.",
    fakten: [
      ["Leistung je Modul", "ca. 420–500 Wp"],
      ["Dachfläche", "rund 5 m² je kWp"],
      ["Jahresertrag Süddeutschland", "ca. 950–1.050 kWh je kWp"],
    ],
    achten: "Belegungsplan mit Verschattungsanalyse, Glas-Glas-Module für lange Lebensdauer, Leistungsgarantie des Herstellers.",
    hs: [510, 252],
    box: [300, 176, 420, 150],
  },
  {
    id: "unterkonstruktion",
    icon: Wrench,
    titel: "Unterkonstruktion",
    kurz: "Hält alles sicher auf dem Dach",
    text: "Dachhaken, Schienen und Klemmen verbinden die Module dauerhaft mit dem Dach. Das System muss zur Eindeckung, zur Statik und zur regionalen Schnee- und Windlast passen – im Allgäu ein wichtiger Punkt.",
    fakten: [
      ["Material", "Aluminium & Edelstahl"],
      ["Dacharten", "Ziegel, Blech, Flachdach, Fassade"],
      ["Auslegung", "nach Schnee- und Windlastzone"],
    ],
    achten: "Statisch geprüfte Systeme, dichte Dachdurchführungen, keine Kompromisse bei Befestigung und Kabelführung.",
    hs: [742, 318],
    box: [262, 164, 496, 172],
  },
  {
    id: "wechselrichter",
    icon: Cpu,
    titel: "Wechselrichter",
    kurz: "Macht Solarstrom nutzbar",
    text: "Der Wechselrichter wandelt den Gleichstrom der Module in haushaltsüblichen Wechselstrom. Ein Hybrid-Wechselrichter bindet zusätzlich den Speicher direkt ein und ist das Herz der Anlagensteuerung.",
    fakten: [
      ["Wirkungsgrad", "typisch 97–98 %"],
      ["Lebensdauer", "meist ein Tausch in der Laufzeit"],
      ["Bauart", "String- oder Hybrid-Wechselrichter"],
    ],
    achten: "Passende Dimensionierung zum Modulfeld, Speicher-Fähigkeit für später, Hersteller mit gutem Service in Deutschland.",
    link: { href: "/produkte/hersteller", label: "Hersteller im Überblick" },
    hs: [375, 462],
    box: [338, 412, 74, 92],
  },
  {
    id: "speicher",
    icon: BatteryCharging,
    titel: "Stromspeicher",
    kurz: "Solarstrom für den Abend",
    text: "Der Batteriespeicher nimmt mittags überschüssigen Solarstrom auf und gibt ihn abends und nachts wieder ab. So steigt der Anteil des Stroms, den Sie selbst nutzen – und damit die Ersparnis.",
    fakten: [
      ["Faustregel Größe", "ca. 1 kWh je 1.000 kWh Verbrauch"],
      ["Richtpreis", "rund 450 € je kWh (mit Anlage)"],
      ["Zellchemie", "LFP, 6.000+ Vollzyklen"],
    ],
    achten: "Keine Überdimensionierung, Notstrom- oder Ersatzstromfunktion nach Bedarf, spätere Erweiterbarkeit.",
    link: { href: "/produkte/stromspeicher", label: "Mehr zum Stromspeicher" },
    hs: [446, 474],
    box: [414, 408, 64, 128],
  },
  {
    id: "zaehler",
    icon: Gauge,
    titel: "Zählerschrank & Smart Meter",
    kurz: "Misst, was fließt",
    text: "Ein Zweirichtungszähler erfasst Bezug und Einspeisung. Häufig muss der Zählerschrank dafür an die aktuellen technischen Anschlussregeln angepasst werden. Das intelligente Messsystem (Smart Meter) wird für neue Anlagen immer wichtiger.",
    fakten: [
      ["Zähler", "Zweirichtungszähler"],
      ["Smart Meter", "Pflicht ab 7 kW Anlagenleistung"],
      ["Ohne Smart Meter", "Einspeisung auf 60 % begrenzt"],
    ],
    achten: "Frühe Prüfung des Zählerschranks, damit es beim Termin keine Überraschungen gibt; Abstimmung mit dem Netzbetreiber.",
    link: { href: "/produkte/smartmeter", label: "Mehr zum Smart Meter" },
    hs: [514, 466],
    box: [482, 408, 64, 114],
  },
  {
    id: "wallbox",
    icon: PlugZap,
    titel: "Wallbox",
    kurz: "Laden mit Sonnenstrom",
    text: "Mit einer Wallbox laden Sie Ihr E-Auto zu Hause – und mit PV-Überschussladen genau dann, wenn das Dach mehr liefert, als das Haus braucht. So wird aus 7–8 Cent Einspeisevergütung eine Ersparnis gegenüber teurem Netzstrom.",
    fakten: [
      ["11 kW", "beim Netzbetreiber meldepflichtig"],
      ["22 kW", "genehmigungspflichtig"],
      ["§ 14a EnWG", "reduzierte Netzentgelte möglich"],
    ],
    achten: "Überschussladen mit Phasenumschaltung, saubere Einbindung ins Energiemanagement, Lastmanagement bei Wärmepumpe.",
    link: { href: "/produkte/wallbox", label: "Mehr zur Wallbox" },
    hs: [750, 494],
    box: [728, 462, 44, 62],
  },
  {
    id: "waermepumpe",
    icon: Thermometer,
    titel: "Wärmepumpe",
    kurz: "Heizen mit eigenem Strom",
    text: "Eine Wärmepumpe macht aus einer Kilowattstunde Strom drei bis vier Kilowattstunden Wärme. Mit eigenem Solarstrom sinken die Heizkosten weiter – vor allem in der Übergangszeit und bei der Warmwasserbereitung.",
    fakten: [
      ["Jahresarbeitszahl", "typisch 3 bis 4"],
      ["KfW-Zuschuss", "i. d. R. bis 70 % von max. 28.000 €"],
      ["§ 14a EnWG", "reduzierte Netzentgelte möglich"],
    ],
    achten: "Heizlastberechnung statt Schätzung, Aufstellort mit Blick auf Schall, SG-Ready-Einbindung in die PV-Steuerung.",
    link: { href: "/produkte/warmepumpe", label: "Mehr zur Wärmepumpe" },
    hs: [205, 462],
    box: [142, 462, 126, 104],
  },
  {
    id: "ems",
    icon: LayoutGrid,
    titel: "Energiemanagement",
    kurz: "Steuert alles im Takt der Sonne",
    text: "Das Energiemanagement entscheidet, wohin der Solarstrom fließt: erst ins Haus, dann in Speicher, Auto oder Wärmepumpe – und erst dann ins Netz. In der App sehen Sie Erzeugung, Verbrauch und Ersparnis live.",
    fakten: [
      ["Steuert", "Speicher, Wallbox, Wärmepumpe"],
      ["Monitoring", "App & Web-Portal"],
      ["Optional", "dynamische Stromtarife nutzen"],
    ],
    achten: "Herstellerübergreifende Kompatibilität, damit Sie später Komponenten ergänzen können, ohne alles zu tauschen.",
    link: { href: "/produkte/smartenergyhome", label: "Mehr zum Smart Energy Home" },
    hs: [640, 492],
    box: [602, 462, 76, 60],
  },
];

// Energiefluss-Leitungen (schematisch). `teil` markiert, zu welchem Baustein sie gehören.
const LEITUNGEN = [
  { teil: ["module", "wechselrichter", "unterkonstruktion"], d: "M380 318 V420" },
  { teil: ["speicher", "wechselrichter"], d: "M406 474 H420" },
  { teil: ["zaehler", "wechselrichter"], d: "M392 420 V404 H514 V414" },
  { teil: ["zaehler", "wallbox"], d: "M546 452 H728" },
  { teil: ["zaehler", "waermepumpe"], d: "M506 522 V552 H268" },
  { teil: ["zaehler", "ems"], d: "M546 492 H602", daten: true },
  { teil: ["zaehler"], d: "M522 522 V588 H72 V336", netz: true },
];

// Modulraster auf der Dachfläche (Trapez, bilinear interpoliert)
function modulZellen() {
  const zeilen = 3;
  const spalten = 6;
  const zellen = [];
  const punkt = (u, v) => {
    const y = 186 + 128 * v;
    const xl = 392 - 80 * v;
    const xr = 628 + 80 * v;
    return [xl + (xr - xl) * u, y];
  };
  const luft = 0.012;
  for (let r = 0; r < zeilen; r++) {
    for (let c = 0; c < spalten; c++) {
      const u0 = c / spalten + luft, u1 = (c + 1) / spalten - luft;
      const v0 = r / zeilen + luft * 2, v1 = (r + 1) / zeilen - luft * 2;
      const p = [punkt(u0, v0), punkt(u1, v0), punkt(u1, v1), punkt(u0, v1)];
      zellen.push(p.map((q) => q.map((n) => n.toFixed(1)).join(",")).join(" "));
    }
  }
  return zellen;
}
const ZELLEN = modulZellen();

export default function AnlagenExplorer() {
  const [aktivIndex, setAktivIndex] = useState(0);
  const [bewegung, setBewegung] = useState(false);
  const aktiv = BAUSTEINE[aktivIndex];
  const Icon = aktiv.icon;

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setBewegung(!mq.matches);
  }, []);

  const wechsel = (schritt) => setAktivIndex((i) => (i + schritt + BAUSTEINE.length) % BAUSTEINE.length);

  return (
    <div className="overflow-hidden rounded-[2rem] bg-white shadow-xl ring-1 ring-ink-200/70">
      <div className="grid grid-cols-1 lg:grid-cols-[1.45fr_1fr]">
        {/* Illustration */}
        <div className="relative border-b border-ink-100 bg-gradient-to-b from-navy-50 to-sand-50 p-3 sm:p-5 lg:border-b-0 lg:border-r">
          <p className="px-2 pt-2 text-[12.5px] font-semibold uppercase tracking-[0.16em] text-ov-700 sm:px-3">
            Interaktiv · Tippen Sie auf einen Baustein
          </p>
          <div className="relative mt-2 aspect-[1000/640] w-full">
            <svg viewBox="0 0 1000 640" className="absolute inset-0 h-full w-full" role="img" aria-label="Schematisches Haus mit Photovoltaikanlage, Wechselrichter, Speicher, Zählerschrank, Wallbox, Wärmepumpe und Energiemanagement">
              <defs>
                <radialGradient id="ae-sonne" cx="0.5" cy="0.5" r="0.5">
                  <stop offset="0%" stopColor="#ffd873" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#ffd873" stopOpacity="0" />
                </radialGradient>
                <linearGradient id="ae-glanz" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.28" />
                  <stop offset="55%" stopColor="#ffffff" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* Sonne */}
              <circle cx="880" cy="92" r="92" fill="url(#ae-sonne)" />
              <circle cx="880" cy="92" r="36" fill="#ffc53d" />

              {/* Boden */}
              <rect x="0" y="560" width="1000" height="80" fill="#e6f1d8" />
              <line x1="0" x2="1000" y1="560" y2="560" stroke="#cde3b1" strokeWidth="3" />

              {/* Strommast */}
              <line x1="72" x2="72" y1="560" y2="316" stroke="#97a0b0" strokeWidth="7" strokeLinecap="round" />
              <line x1="44" x2="100" y1="336" y2="336" stroke="#97a0b0" strokeWidth="5" strokeLinecap="round" />
              <text x="72" y="300" textAnchor="middle" fontSize="15" fontWeight="600" fill="#6b7486">Stromnetz</text>

              {/* Wärmepumpe */}
              <rect x="150" y="470" width="110" height="88" rx="12" fill="#ffffff" stroke="#c4cad5" strokeWidth="2" />
              <circle cx="190" cy="514" r="28" fill="#eef0f4" stroke="#c4cad5" strokeWidth="2" />
              <circle cx="190" cy="514" r="6" fill="#97a0b0" />
              {[0, 1, 2, 3].map((i) => (
                <line key={i} x1="230" x2="248" y1={492 + i * 12} y2={492 + i * 12} stroke="#c4cad5" strokeWidth="3" strokeLinecap="round" />
              ))}

              {/* Haus */}
              <rect x="300" y="320" width="420" height="240" fill="#ffffff" stroke="#dfe3ea" strokeWidth="2" />
              <polygon points="266,334 370,168 650,168 754,334" fill="#394050" />
              {ZELLEN.map((p, i) => (
                <polygon key={i} points={p} fill="#003473" stroke="#1f5aa1" strokeWidth="1" />
              ))}
              <polygon points="312,314 392,186 628,186 708,314" fill="url(#ae-glanz)" />

              {/* Technikraum (Anschnitt) */}
              <rect x="322" y="396" width="236" height="148" rx="10" fill="#f5f3ea" stroke="#dfe3ea" strokeWidth="2" />
              {/* Wechselrichter */}
              <rect x="344" y="420" width="62" height="78" rx="8" fill="#ffffff" stroke="#c4cad5" strokeWidth="2" />
              <rect x="354" y="432" width="42" height="18" rx="3" fill="#0b4488" />
              <circle cx="375" cy="478" r="4" fill="#669933" />
              {/* Speicher */}
              <rect x="420" y="414" width="52" height="118" rx="8" fill="#ffffff" stroke="#c4cad5" strokeWidth="2" />
              {[0, 1, 2, 3].map((i) => (
                <rect key={i} x="430" y={500 - i * 22} width="32" height="16" rx="3" fill={i < 3 ? "#8cba58" : "#e6f1d8"} />
              ))}
              {/* Zählerschrank */}
              <rect x="488" y="414" width="52" height="108" rx="6" fill="#eef0f4" stroke="#c4cad5" strokeWidth="2" />
              <rect x="497" y="426" width="34" height="26" rx="3" fill="#ffffff" stroke="#c4cad5" />
              <rect x="497" y="462" width="34" height="26" rx="3" fill="#ffffff" stroke="#c4cad5" />
              <line x1="502" x2="526" y1="498" y2="498" stroke="#c4cad5" strokeWidth="3" />
              <line x1="502" x2="526" y1="508" y2="508" stroke="#c4cad5" strokeWidth="3" />

              {/* Fenster */}
              <rect x="590" y="352" width="104" height="72" rx="6" fill="#d9e6f5" stroke="#b2cbe9" strokeWidth="2" />
              <line x1="642" x2="642" y1="352" y2="424" stroke="#b2cbe9" strokeWidth="2" />
              {/* Energiemanagement-Display */}
              <rect x="608" y="468" width="64" height="48" rx="8" fill="#041d42" />
              <polyline points="616,504 628,496 638,500 650,484 664,488" fill="none" stroke="#8cba58" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

              {/* Carport + Auto */}
              <rect x="772" y="392" width="208" height="12" rx="3" fill="#4e5667" />
              <line x1="790" x2="790" y1="404" y2="560" stroke="#97a0b0" strokeWidth="6" />
              <line x1="962" x2="962" y1="404" y2="560" stroke="#97a0b0" strokeWidth="6" />
              <path d="M812 506 L842 474 H912 L940 506 Z" fill="#4a7cbd" />
              <path d="M850 480 H878 V504 H828 Z" fill="#d9e6f5" />
              <path d="M886 480 H908 L930 504 H886 Z" fill="#d9e6f5" />
              <rect x="800" y="502" width="156" height="40" rx="14" fill="#1f5aa1" />
              <circle cx="836" cy="544" r="15" fill="#252b37" />
              <circle cx="920" cy="544" r="15" fill="#252b37" />
              {/* Wallbox */}
              <line x1="750" x2="750" y1="520" y2="560" stroke="#97a0b0" strokeWidth="5" />
              <rect x="734" y="468" width="32" height="52" rx="7" fill="#ffffff" stroke="#c4cad5" strokeWidth="2" />
              <circle cx="750" cy="484" r="4" fill="#669933" />
              <path d="M760 512 Q782 540 802 520" fill="none" stroke="#394050" strokeWidth="3" strokeLinecap="round" />

              {/* Hervorhebung aktiver Baustein */}
              <rect
                x={aktiv.box[0] - 6}
                y={aktiv.box[1] - 6}
                width={aktiv.box[2] + 12}
                height={aktiv.box[3] + 12}
                rx="14"
                fill="#669933"
                fillOpacity="0.1"
                stroke="#669933"
                strokeWidth="2.5"
                strokeDasharray="7 6"
                style={{ transition: "all 450ms cubic-bezier(.22,1,.36,1)" }}
              />

              {/* Leitungen */}
              {LEITUNGEN.map((l, i) => {
                const hervor = l.teil.includes(aktiv.id);
                const farbe = l.daten ? "#4a7cbd" : l.netz ? "#97a0b0" : "#669933";
                return (
                  <g key={i}>
                    <path d={l.d} fill="none" stroke="#dfe3ea" strokeWidth={hervor ? 7 : 5} strokeLinecap="round" strokeLinejoin="round" opacity={l.netz ? 0.7 : 1} />
                    <path
                      d={l.d}
                      fill="none"
                      stroke={farbe}
                      strokeWidth={hervor ? 4 : 2.5}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeDasharray="2 10"
                      opacity={hervor ? 1 : 0.55}
                    >
                      {bewegung && (
                        <animate attributeName="stroke-dashoffset" from="24" to="0" dur={hervor ? "0.9s" : "1.6s"} repeatCount="indefinite" />
                      )}
                    </path>
                  </g>
                );
              })}
            </svg>

            {/* Hotspots */}
            {BAUSTEINE.map((b, i) => {
              const an = i === aktivIndex;
              return (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => setAktivIndex(i)}
                  aria-pressed={an}
                  aria-label={`${b.titel} anzeigen`}
                  className="group absolute flex h-7 w-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full sm:h-11 sm:w-11"
                  style={{ left: `${b.hs[0] / 10}%`, top: `${(b.hs[1] / 640) * 100}%` }}
                >
                  {!an && (
                    <span aria-hidden="true" className="absolute inset-1 rounded-full bg-ov-400/50 motion-safe:animate-ping sm:inset-2" />
                  )}
                  <span
                    aria-hidden="true"
                    className={`relative flex h-5 w-5 items-center justify-center rounded-full font-display text-[10px] font-extrabold shadow-lg ring-2 transition-all duration-300 sm:h-8 sm:w-8 sm:text-[13px] ${
                      an ? "scale-110 bg-ov-500 text-white ring-white" : "bg-white text-ov-700 ring-ov-500 group-hover:bg-ov-50"
                    }`}
                  >
                    {i + 1}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Bausteinliste – auf kleinen Bildschirmen das eigentliche Bedienelement */}
          <ul className="mt-3 flex flex-wrap gap-2 px-1 pb-1 sm:px-2" aria-label="Bausteine der Anlage">
            {BAUSTEINE.map((b, i) => {
              const an = i === aktivIndex;
              return (
                <li key={b.id}>
                  <button
                    type="button"
                    onClick={() => setAktivIndex(i)}
                    aria-pressed={an}
                    className={`inline-flex h-11 items-center gap-2 rounded-full px-3.5 text-[13.5px] font-semibold transition-all duration-300 ${
                      an ? "bg-ink-900 text-white shadow-md" : "bg-white text-ink-700 ring-1 ring-ink-200 hover:ring-ov-300"
                    }`}
                  >
                    <span className={`ov-num text-[12px] ${an ? "text-ov-300" : "text-ov-600"}`}>{i + 1}</span>
                    {b.titel}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Erklärung */}
        <div className="flex flex-col p-6 md:p-8 lg:p-10" aria-live="polite">
          <div key={aktiv.id} className="ov-hero-in flex flex-1 flex-col">
            <div className="flex items-center gap-4">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-ov-50 text-ov-600">
                <Icon aria-hidden="true" className="h-7 w-7" strokeWidth={1.8} />
              </span>
              <div>
                <p className="text-[13px] font-medium text-ink-500">
                  Baustein <span className="ov-num">{aktivIndex + 1}</span> von {BAUSTEINE.length} · {aktiv.kurz}
                </p>
                <h3 className="ov-h3 mt-0.5 text-ink-900">{aktiv.titel}</h3>
              </div>
            </div>
            <p className="mt-5 text-[16px] leading-relaxed text-ink-600">{aktiv.text}</p>

            <dl className="mt-6 divide-y divide-ink-100 rounded-2xl bg-sand-50 px-5 ring-1 ring-ink-100">
              {aktiv.fakten.map(([k, v]) => (
                <div key={k} className="flex items-baseline justify-between gap-4 py-3">
                  <dt className="text-[14px] text-ink-500">{k}</dt>
                  <dd className="ov-num text-right text-[14.5px] font-semibold text-ink-900">{v}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-5 rounded-2xl border-l-4 border-ov-500 bg-ov-50/60 px-5 py-4">
              <p className="text-[12.5px] font-semibold uppercase tracking-[0.14em] text-ov-700">Darauf achten wir</p>
              <p className="mt-1.5 text-[15px] leading-relaxed text-ink-700">{aktiv.achten}</p>
            </div>

            {aktiv.link && (
              <Link href={aktiv.link.href} className="group mt-5 inline-flex min-h-11 items-center gap-2 self-start text-[15px] font-semibold text-ov-700 hover:text-ov-800">
                {aktiv.link.label}
                <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            )}
          </div>

          <div className="mt-6 flex items-center justify-between gap-4 border-t border-ink-100 pt-5">
            <button type="button" onClick={() => wechsel(-1)} className="inline-flex h-11 items-center gap-1.5 rounded-full px-4 text-[14px] font-semibold text-ink-700 ring-1 ring-ink-200 transition-colors hover:bg-ink-50">
              <ChevronLeft aria-hidden="true" className="h-4 w-4" />
              Zurück
            </button>
            <div className="hidden gap-1.5 sm:flex" aria-hidden="true">
              {BAUSTEINE.map((b, i) => (
                <span key={b.id} className={`h-1.5 rounded-full transition-all duration-300 ${i === aktivIndex ? "w-6 bg-ov-500" : "w-1.5 bg-ink-200"}`} />
              ))}
            </div>
            <button type="button" onClick={() => wechsel(1)} className="inline-flex h-11 items-center gap-1.5 rounded-full bg-ink-900 px-4 text-[14px] font-semibold text-white transition-colors hover:bg-ink-800">
              Weiter
              <ChevronRight aria-hidden="true" className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
      <p className="border-t border-ink-100 px-6 py-4 text-[12.5px] leading-relaxed text-ink-500 md:px-8">
        Schematische Darstellung. Orientierungswerte, Stand 2026 – welche Bausteine für Ihr Haus sinnvoll sind, klären wir in der persönlichen Planung.
      </p>
    </div>
  );
}
