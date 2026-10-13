"use client";

import { useId, useRef, useState } from "react";
import { Cable, Info, Table2 } from "lucide-react";
import { cn } from "@/components/ui/cn";

/**
 * Einlinienschaltbild (Paket B04): vereinfachte Anschlussvarianten einer PV-Anlage an
 * Netzebene 7, 6 und 5 als inline-SVG. Jedes Bauteil ist ein fokussierbarer Button
 * (Tab-Reihenfolge = Energiefluss vom Netz zur Anlage, Pfeil hoch/runter springt, Enter/Leertaste
 * oder Fokus wählt aus); das Detailfeld nennt Funktion, TOR-Bezug und typischen Nachweis.
 * Dazu eine Tabellen-Alternative mit denselben Daten.
 *
 * Regeln: Schwellen und Ausführung legt der Netzbetreiber fest („laut Ihrem Netzbetreiber“).
 * Kapitelangaben nur aus TOR Typ A V1.4, Typ B V1.3 und TOR D2 (Stand 10/2026) – Orientierung,
 * keine Planungsunterlage.
 */

const BAUTEILE = {
  "netz-ns": {
    name: "Niederspannungsnetz",
    kurz: "NS-Netz",
    symbol: "netz",
    funktion: "Öffentliches 0,4-kV-Netz des Netzbetreibers. Die Anlage hebt hier die Spannung an – die Summe aller Erzeugungsanlagen darf die zulässige Spannungsänderung nicht überschreiten.",
    tor: "TOR D2 (Spannungsänderung im NS-Netz, Richtwert 3 %); TOR Verteilernetzanschluss Niederspannung V1.3.1",
    nachweis: "Netzanschlussvertrag; Netzverträglichkeitsprüfung durch den Netzbetreiber",
  },
  "netz-ms": {
    name: "Mittelspannungsnetz",
    kurz: "MS-Netz",
    symbol: "netz",
    funktion: "Öffentliches Mittelspannungsnetz (je nach Region 10–30 kV). Kurzschlussleistung Sk und Netzimpedanzwinkel ψ am Verknüpfungspunkt bestimmen, wie stark die Anlage die Spannung anhebt.",
    tor: "TOR D2 (Spannungsänderung im MS-Netz, Richtwert 2 %)",
    nachweis: "Anschlusskonzept bzw. Auskunft des Netzbetreibers zu Sk und ψ",
  },
  "trafo-nb": {
    name: "Trafostation des Netzbetreibers",
    kurz: "Umspannung MS/NS",
    symbol: "trafo",
    funktion: "Netzebene 6: Die Anlage wird direkt an der Niederspannungs-Sammelschiene der Umspannstation des Netzbetreibers angeschlossen – eigener Abgang, kurze Leitung, höhere Kurzschlussleistung als im Ortsnetz.",
    tor: "Ausführung laut Ihrem Netzbetreiber (Netzanschlussvertrag); TOR D2",
    nachweis: "Netzanschlussvertrag mit Festlegung des Netzanschlusspunkts",
  },
  hak: {
    name: "Hausanschlusskasten",
    kurz: "HAK",
    symbol: "sicherung",
    funktion: "Eigentumsgrenze und Anschlusssicherung. Die Anschlussleistung des Hausanschlusses begrenzt die netzwirksame Leistung der Anlage.",
    tor: "TOR Verteilernetzanschluss Niederspannung V1.3.1",
    nachweis: "Netzzugangsvertrag, Anschlussleistung laut Ihrem Netzbetreiber",
  },
  zaehler: {
    name: "Verrechnungsmessung",
    kurz: "Zähler",
    symbol: "zaehler",
    funktion: "Zähler des Netzbetreibers (Smart Meter, bei größeren Anlagen Wandlermessung). Bei Netzebene 6 kann der Netzbetreiber den Messabgriff für die Blindleistungsregelung hier verlangen.",
    tor: "TOR Typ A V1.4 / Typ B V1.3 (Messung für die Blindleistungsbereitstellung); Messkonzept laut Ihrem Netzbetreiber",
    nachweis: "Messkonzept, Wandlerdaten, Inbetriebnahmeprotokoll",
  },
  "ms-uebergabe": {
    name: "Übergabestation (MS-Schaltanlage)",
    kurz: "Übergabe MS",
    symbol: "schalter",
    funktion: "Kundeneigene Mittelspannungs-Schaltanlage mit Übergabeschutz. Der Netzbetreiber kann hier schalten; sie trennt die Kundenanlage bei Fehlern vom Netz.",
    tor: "TOR Typ B V1.3 (Schutzkonzept); technische Ausführung laut Ihrem Netzbetreiber",
    nachweis: "Schutzprüfprotokoll, Schaltberechtigung, Übergabeschutz-Einstellwerte",
  },
  "ms-messung": {
    name: "MS-Verrechnungsmessung",
    kurz: "Messung MS",
    symbol: "zaehler",
    funktion: "Wandlermessung auf der Mittelspannungsseite. Fordert der Netzbetreiber dort die Messung für die Blindleistung, braucht die Anlage einen Park- und Anlagenregler.",
    tor: "TOR Typ A V1.4 / Typ B V1.3: Regler erforderlich ab Summe der Engpassleistungen über 100 kVA mit MS-Messung bzw. über 400 kVA ohne – Schwellen laut Ihrem Netzbetreiber",
    nachweis: "Messkonzept, Wandlerprüfscheine",
  },
  "trafo-kunde": {
    name: "Kundentransformator",
    kurz: "Trafo MS/NS",
    symbol: "trafo",
    funktion: "Eigener Transformator der Anlage. Die Stufenstellung ist vertraglich festzulegen, damit Einstellwerte zwischen Nieder- und Mittelspannung umgerechnet werden können.",
    tor: "TOR Typ B V1.3 (Stufenstellung, Messung NS-seitig); Netzanschlussvertrag",
    nachweis: "Trafo-Datenblatt, vereinbarte Stufenstellung",
  },
  hv: {
    name: "NS-Hauptverteilung",
    kurz: "Hauptverteilung",
    symbol: "schiene",
    funktion: "Sammelschiene der Kundenanlage. Hier hängen Verbraucher, Speicher und Ladepunkte; bei Netzebene 5 sitzt hier der Messabgriff für den Parkregler, wenn NS-seitig gemessen wird.",
    tor: "TOR Typ A V1.4 / Typ B V1.3 (Messabgriff NE 5 in der NS-Hauptverteilung)",
    nachweis: "Übersichtsschaltplan, Errichtungsprüfung nach ÖVE/ÖNORM E 8101",
  },
  "na-schutz": {
    name: "Netzentkupplungsschutz",
    kurz: "NA-Schutz",
    symbol: "schutz",
    funktion: "Trennt die Erzeugungsanlage bei unzulässiger Spannung oder Frequenz vom Netz. Er ist unabhängig vom Parkregler und wird von ihm nicht ersetzt.",
    tor: "TOR Typ A V1.4 / Typ B V1.3 (Netzentkupplungsschutz; Schutz netzrelevanter Einstellungen Kap. 6.2)",
    nachweis: "Prüfbericht des Netzentkupplungsschutzes (TOR Typ B V1.3 Kap. 8)",
  },
  wr: {
    name: "Wechselrichter",
    kurz: "Wechselrichter",
    symbol: "wr",
    funktion: "Wandelt Gleich- in Wechselstrom und stellt Wirk- und Blindleistung bereit – autonom nach Kennlinie (Q(U), P(U), P(f)) oder nach Sollwert des Parkreglers.",
    tor: "TOR Typ A V1.4 Kap. 5.3.3–5.3.4; Typ B V1.3 Kap. 5.1.3, 5.3.3–5.3.4",
    nachweis: "Prüfbericht nach OVE-Richtlinie R 25 (NS) bzw. Einheitenzertifikat; Ländereinstellung „Österreich“",
  },
  pv: {
    name: "PV-Generator",
    kurz: "PV-Module",
    symbol: "pv",
    funktion: "Modulfelder mit Strangverkabelung und DC-Schutz. Die Modulspitzenleistung ist Bezug der Spitzenkappung nach § 101 ElWG.",
    tor: "ÖVE/ÖNORM EN 62446-1 (Prüfung und Dokumentation); § 101 ElWG",
    nachweis: "Anlagendokumentation, Strangmessprotokolle",
  },
  speicher: {
    name: "Batteriespeicher",
    kurz: "Speicher",
    symbol: "speicher",
    funktion: "Nimmt Überschüsse über dem Einspeiselimit auf. Speicher zählen bei der Typeinteilung zur Maximalkapazität am Netzanschlusspunkt mit.",
    tor: "TOR Verteilernetzanschluss (Speicher als Netzbenutzer); TOR Typ A V1.4 / Typ B V1.3",
    nachweis: "Prüfbericht des Speicher-Umrichters, Regelkonzept",
  },
  parkregler: {
    name: "Park- und Anlagenregler",
    kurz: "Parkregler",
    symbol: "regler",
    funktion: "Misst am Netzanschlusspunkt und gibt Wechselrichtern und Speicher Sollwerte vor, damit die Gesamtanlage dort Wirkleistungsvorgabe, Blindleistungsverfahren und Einspeiselimit einhält.",
    tor: "TOR Typ B V1.3 / Typ A V1.4 Kap. 5.1.4 (Wirkleistungsvorgabe), Kap. 5.3.3–5.3.4 (Blindleistung); Pflicht und Schwellen laut Ihrem Netzbetreiber",
    nachweis: "Parameterauszug, Inbetriebnahme-Prüfprotokoll (Sollwertsprünge, Q-Verfahren, Rückfallwert)",
  },
  fernwirk: {
    name: "Fernwirkanbindung",
    kurz: "Fernwirktechnik",
    symbol: "fernwirk",
    funktion: "Schnittstelle zur Leitstelle des Netzbetreibers: Sollwerte und Schaltbefehle hinein, Messwerte und Rückmeldungen hinaus.",
    tor: "TOR Typ B V1.3 Kap. 5.1.4 (IEC 60870-5-101/-104, Modbus RTU/TCP oder potentialfreie Kontakte laut Ihrem Netzbetreiber)",
    nachweis: "Signalliste, Datenpunkttest mit der Leitstelle",
  },
};

/** Kette vom Netz zur Anlage (Hauptpfad) und Nebenelemente je Netzebene. */
const VARIANTEN = [
  {
    k: "ne7",
    l: "NE 7 · Niederspannung",
    titel: "Netzebene 7: Anschluss am Niederspannungsnetz",
    text: "Typisch für Dachanlagen auf Wohn- und Betriebsgebäuden. Ein Parkregler ist hier meist nur nötig, wenn mehrere Wechselrichter, Speicher oder Ladepunkte gemeinsam ein Einspeiselimit einhalten müssen.",
    kette: ["netz-ns", "hak", "zaehler", "hv", "na-schutz", "wr", "pv"],
    seite: [
      { id: "speicher", an: "hv" },
      { id: "parkregler", an: "zaehler", optional: true },
    ],
  },
  {
    k: "ne6",
    l: "NE 6 · Trafostation",
    titel: "Netzebene 6: Anschluss an der NS-Seite der Umspannstation",
    text: "Für größere Gewerbe- und Freiflächenanlagen ohne eigenen Transformator. Der Netzbetreiber kann den Messabgriff für die Blindleistungsregelung an der Verrechnungsmessung verlangen.",
    kette: ["netz-ms", "trafo-nb", "zaehler", "hv", "na-schutz", "wr", "pv"],
    seite: [
      { id: "fernwirk", an: "zaehler" },
      { id: "parkregler", an: "zaehler" },
      { id: "speicher", an: "hv" },
    ],
  },
  {
    k: "ne5",
    l: "NE 5 · Mittelspannung",
    titel: "Netzebene 5: Anschluss am Mittelspannungsnetz mit eigener Station",
    text: "Für Freiflächen- und Großanlagen mit Übergabestation und Kundentransformator. Fernwirkanbindung und Parkregler sind hier der Regelfall – Details laut Ihrem Netzbetreiber.",
    kette: ["netz-ms", "ms-uebergabe", "ms-messung", "trafo-kunde", "hv", "na-schutz", "wr", "pv"],
    seite: [
      { id: "fernwirk", an: "ms-messung" },
      { id: "parkregler", an: "ms-messung" },
      { id: "speicher", an: "hv" },
    ],
  },
];

// Geometrie
const W = 400;
const X_HAUPT = 118;
const X_SEITE = 300;
const BOX_W = 168;
const BOX_H = 40;
const SCHRITT = 66;
const OBEN = 34;

function Symbol({ art, x, y, aktiv }) {
  const farbe = aktiv ? "#ffffff" : "#0f8a4f";
  const s = { stroke: farbe, strokeWidth: 1.8, fill: "none" };
  switch (art) {
    case "trafo":
      return (
        <g>
          <circle cx={x} cy={y - 4} r={6.5} {...s} />
          <circle cx={x} cy={y + 4} r={6.5} {...s} />
        </g>
      );
    case "zaehler":
      return (
        <g>
          <rect x={x - 8} y={y - 8} width={16} height={16} rx={2} {...s} />
          <text x={x} y={y + 4} textAnchor="middle" fontSize="10" fontWeight="700" fill={farbe}>
            kWh
          </text>
        </g>
      );
    case "schalter":
      return (
        <g>
          <line x1={x} y1={y + 9} x2={x} y2={y + 3} {...s} />
          <line x1={x} y1={y + 3} x2={x + 7} y2={y - 7} {...s} />
          <line x1={x} y1={y - 9} x2={x} y2={y - 6} {...s} />
        </g>
      );
    case "sicherung":
      return <rect x={x - 4} y={y - 9} width={8} height={18} rx={1.5} {...s} />;
    case "schiene":
      return <line x1={x - 9} y1={y} x2={x + 9} y2={y} stroke={farbe} strokeWidth={4} strokeLinecap="round" />;
    case "schutz":
      return (
        <g>
          <rect x={x - 8} y={y - 8} width={16} height={16} rx={2} {...s} />
          <path d={`M${x - 4} ${y + 4} L${x + 4} ${y - 4}`} {...s} />
        </g>
      );
    case "wr":
      return (
        <g>
          <rect x={x - 9} y={y - 9} width={18} height={18} rx={2} {...s} />
          <line x1={x - 9} y1={y + 9} x2={x + 9} y2={y - 9} {...s} />
          <text x={x - 4.5} y={y - 1} textAnchor="middle" fontSize="7" fill={farbe}>
            =
          </text>
          <text x={x + 4.5} y={y + 7} textAnchor="middle" fontSize="7" fill={farbe}>
            ~
          </text>
        </g>
      );
    case "pv":
      return (
        <g>
          <rect x={x - 9} y={y - 7} width={18} height={14} {...s} />
          <line x1={x} y1={y - 7} x2={x} y2={y + 7} {...s} />
          <line x1={x - 9} y1={y} x2={x + 9} y2={y} {...s} />
        </g>
      );
    case "speicher":
      return (
        <g>
          <line x1={x - 7} y1={y - 3} x2={x + 7} y2={y - 3} stroke={farbe} strokeWidth={2} />
          <line x1={x - 4} y1={y + 3} x2={x + 4} y2={y + 3} stroke={farbe} strokeWidth={2} />
        </g>
      );
    case "regler":
      return (
        <g>
          <rect x={x - 9} y={y - 8} width={18} height={16} rx={3} {...s} />
          <path d={`M${x - 5} ${y + 3} L${x - 1} ${y - 2} L${x + 2} ${y + 1} L${x + 6} ${y - 4}`} {...s} />
        </g>
      );
    case "fernwirk":
      return (
        <g>
          <path d={`M${x - 7} ${y + 6} L${x} ${y - 8} L${x + 7} ${y + 6}`} {...s} />
          <path d={`M${x - 3} ${y - 2} a 6 6 0 0 1 6 0`} {...s} />
        </g>
      );
    default:
      return (
        <g>
          <path d={`M${x - 9} ${y + 4} Q${x - 4} ${y - 8} ${x} ${y} T${x + 9} ${y - 4}`} {...s} />
        </g>
      );
  }
}

export default function Einlinienschaltbild() {
  const id = useId();
  const [variante, setVariante] = useState("ne6");
  const [auswahl, setAuswahl] = useState("parkregler");
  const knoten = useRef({});
  const v = VARIANTEN.find((x) => x.k === variante) ?? VARIANTEN[0];

  // Positionen
  const pos = {};
  v.kette.forEach((b, i) => {
    pos[b] = { x: X_HAUPT, y: OBEN + i * SCHRITT + BOX_H / 2 };
  });
  // Fernwirktechnik eine Reihe über dem Parkregler, Speicher neben der Hauptverteilung
  const seitenReihe = { fernwirk: -1, parkregler: 0, speicher: 0 };
  v.seite.forEach((s) => {
    pos[s.id] = { x: X_SEITE, y: pos[s.an].y + (seitenReihe[s.id] ?? 0) * SCHRITT };
  });
  const H = OBEN + (v.kette.length - 1) * SCHRITT + BOX_H + 30;

  // Reihenfolge für Tastatur: Hauptkette, dann Nebenelemente
  const reihenfolge = [...v.kette, ...v.seite.map((s) => s.id)];
  const aktiv = reihenfolge.includes(auswahl) ? auswahl : reihenfolge[0];
  const d = BAUTEILE[aktiv];
  const wrY = pos.wr.y;

  const tabTastatur = (e) => {
    if (!["ArrowRight", "ArrowLeft", "Home", "End"].includes(e.key)) return;
    e.preventDefault();
    const i = VARIANTEN.findIndex((t) => t.k === variante);
    let n = i;
    if (e.key === "ArrowRight") n = (i + 1) % VARIANTEN.length;
    if (e.key === "ArrowLeft") n = (i - 1 + VARIANTEN.length) % VARIANTEN.length;
    if (e.key === "Home") n = 0;
    if (e.key === "End") n = VARIANTEN.length - 1;
    setVariante(VARIANTEN[n].k);
    document.getElementById(`${id}-tab-${VARIANTEN[n].k}`)?.focus();
  };

  const knotenTastatur = (e, b) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setAuswahl(b);
      return;
    }
    if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(e.key)) return;
    e.preventDefault();
    const i = reihenfolge.indexOf(b);
    let n = i;
    if (e.key === "ArrowDown") n = Math.min(reihenfolge.length - 1, i + 1);
    if (e.key === "ArrowUp") n = Math.max(0, i - 1);
    if (e.key === "Home") n = 0;
    if (e.key === "End") n = reihenfolge.length - 1;
    knoten.current[reihenfolge[n]]?.focus();
  };

  // Render-Funktion statt Unterkomponente: sonst würde jeder Fokuswechsel den Knoten neu einhängen
  const knotenZeichnen = (b, optional) => {
    const p = pos[b];
    const t = BAUTEILE[b];
    const ist = aktiv === b;
    return (
      <g
        key={b}
        ref={(el) => {
          knoten.current[b] = el;
        }}
        role="button"
        tabIndex={0}
        aria-pressed={ist}
        aria-controls={`${id}-detail`}
        aria-label={`${t.name}${optional ? " (optional)" : ""} – Details anzeigen`}
        onClick={() => setAuswahl(b)}
        onFocus={() => setAuswahl(b)}
        onKeyDown={(e) => knotenTastatur(e, b)}
        className="cursor-pointer outline-none"
      >
        <rect
          x={p.x - BOX_W / 2}
          y={p.y - BOX_H / 2}
          width={BOX_W}
          height={BOX_H}
          rx={12}
          fill={ist ? "#0b1e3a" : "#ffffff"}
          stroke={ist ? "#0b1e3a" : optional ? "#94a3b8" : "#cbd5e1"}
          strokeWidth={ist ? 2 : 1.2}
          strokeDasharray={optional && !ist ? "4 3" : undefined}
        />
        {ist && <rect x={p.x - BOX_W / 2 - 4} y={p.y - BOX_H / 2 - 4} width={BOX_W + 8} height={BOX_H + 8} rx={15} fill="none" stroke="#16a35f" strokeWidth={2.5} />}
        <Symbol art={t.symbol} x={p.x - BOX_W / 2 + 22} y={p.y} aktiv={ist} />
        <text x={p.x - BOX_W / 2 + 42} y={p.y + 5} fontSize="13.5" fontWeight="700" fill={ist ? "#ffffff" : "#0f172a"}>
          {t.kurz}
        </text>
      </g>
    );
  };

  return (
    <div className="overflow-hidden rounded-[2rem] bg-white shadow-2xl ring-1 ring-ink-200/70">
      <div className="flex flex-col gap-4 border-b border-ink-100 p-5 md:px-8 md:py-6 lg:flex-row lg:items-center lg:justify-between">
        <p className="flex items-center gap-2 text-[12.5px] font-semibold uppercase tracking-[0.16em] text-ov-700">
          <Cable aria-hidden="true" className="h-4 w-4" />
          Interaktiv · Einlinienschaltbild
        </p>
        <div className="-mx-5 overflow-x-auto px-5 ov-no-scrollbar lg:mx-0 lg:px-0">
          <div role="tablist" aria-label="Netzebene wählen" onKeyDown={tabTastatur} className="inline-flex gap-1 rounded-full bg-sand-50 p-1">
            {VARIANTEN.map((t) => (
              <button
                key={t.k}
                type="button"
                role="tab"
                id={`${id}-tab-${t.k}`}
                tabIndex={variante === t.k ? 0 : -1}
                aria-selected={variante === t.k}
                aria-controls={`${id}-panel`}
                onClick={() => setVariante(t.k)}
                className={cn("inline-flex min-h-10 shrink-0 items-center whitespace-nowrap rounded-full px-4 text-[13.5px] font-semibold transition-colors", variante === t.k ? "bg-navy-950 text-white" : "text-ink-700 hover:text-ink-900")}
              >
                {t.l}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div id={`${id}-panel`} role="tabpanel" aria-labelledby={`${id}-tab-${variante}`} className="grid lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
        <div className="p-4 md:p-7">
          <p className="font-display text-[17px] font-bold text-ink-900">{v.titel}</p>
          <p className="mt-1 text-[14px] leading-relaxed text-ink-600">{v.text}</p>
          <p className="mt-2 text-[12.5px] text-ink-500">Bauteil antippen oder mit der Tabulatortaste ansteuern; Pfeil hoch/runter springt im Schaltbild.</p>
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto mt-4 block h-auto w-full max-w-[460px]" role="group" aria-label={`Einlinienschaltbild ${v.titel}`}>
            {/* Hauptleitung */}
            <line x1={X_HAUPT} x2={X_HAUPT} y1={pos[v.kette[0]].y} y2={pos[v.kette[v.kette.length - 1]].y} stroke="#0b1e3a" strokeWidth={2.5} />
            {/* Netzanschlusspunkt-Markierung zwischen Netzseite und Kundenanlage */}
            {(() => {
              const nap = v.k === "ne7" ? "hak" : v.k === "ne6" ? "trafo-nb" : "ms-uebergabe";
              const y = pos[nap].y + BOX_H / 2 + (SCHRITT - BOX_H) / 2;
              return (
                <g aria-hidden="true">
                  <line x1={14} x2={X_HAUPT - BOX_W / 2 - 6} y1={y} y2={y} stroke="#16a35f" strokeWidth={1.5} strokeDasharray="5 4" />
                  <text x={14} y={y - 6} fontSize="10.5" fontWeight="700" fill="#0f7a45">
                    NAP
                  </text>
                </g>
              );
            })()}
            {/* Nebenelemente: Verbindungen */}
            {v.seite.map((s) => {
              const p = pos[s.id];
              const a = pos[s.an];
              if (s.id === "speicher") {
                return <line key={`l-${s.id}`} x1={X_HAUPT + BOX_W / 2} x2={X_SEITE - BOX_W / 2} y1={a.y} y2={p.y} stroke="#0b1e3a" strokeWidth={2} aria-hidden="true" />;
              }
              if (s.id === "parkregler") {
                return (
                  <g key={`l-${s.id}`} aria-hidden="true">
                    {/* Messung */}
                    <path d={`M${X_HAUPT + BOX_W / 2} ${a.y} H${X_SEITE - BOX_W / 2}`} fill="none" stroke="#16a35f" strokeWidth={1.6} strokeDasharray="5 4" />
                    {/* Sollwerte an Wechselrichter */}
                    <path d={`M${X_SEITE + BOX_W / 2} ${p.y} H${W - 8} V${wrY} H${X_HAUPT + BOX_W / 2}`} fill="none" stroke="#e8a317" strokeWidth={1.6} strokeDasharray="5 4" />
                  </g>
                );
              }
              return <line key={`l-${s.id}`} x1={X_SEITE} x2={X_SEITE} y1={p.y + BOX_H / 2} y2={pos.parkregler.y - BOX_H / 2} stroke="#e8a317" strokeWidth={1.6} strokeDasharray="5 4" aria-hidden="true" />;
            })}
            {v.kette.map((b) => knotenZeichnen(b, false))}
            {v.seite.map((s) => knotenZeichnen(s.id, s.optional))}
          </svg>
          <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-[12px] text-ink-600" aria-label="Legende">
            <li className="flex items-center gap-2">
              <span aria-hidden="true" className="inline-block h-0 w-6 border-t-2 border-dashed border-ov-600" />
              Messung am Netzanschlusspunkt (NAP)
            </li>
            <li className="flex items-center gap-2">
              <span aria-hidden="true" className="inline-block h-0 w-6 border-t-2 border-dashed border-sun-500" />
              Sollwerte / Fernwirksignale
            </li>
            {v.seite.some((s) => s.optional) && (
              <li className="flex items-center gap-2">
                <span aria-hidden="true" className="inline-block h-3 w-6 rounded border border-dashed border-ink-400" />
                optional, laut Ihrem Netzbetreiber
              </li>
            )}
          </ul>
        </div>

        <div className="flex flex-col gap-5 border-t border-ink-100 bg-sand-50/60 p-6 md:p-8 lg:border-l lg:border-t-0">
          <div id={`${id}-detail`} aria-live="polite" className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-ink-200/60">
            <p className="text-[11.5px] font-semibold uppercase tracking-[0.16em] text-ov-700">Ausgewähltes Bauteil</p>
            <p className="mt-1.5 font-display text-[20px] font-extrabold leading-tight text-ink-900">{d.name}</p>
            <dl className="mt-4 grid gap-4 text-[14px] leading-relaxed">
              <div>
                <dt className="text-[12px] font-semibold uppercase tracking-[0.1em] text-ink-500">Funktion</dt>
                <dd className="mt-1 text-ink-700">{d.funktion}</dd>
              </div>
              <div>
                <dt className="text-[12px] font-semibold uppercase tracking-[0.1em] text-ink-500">TOR-Bezug</dt>
                <dd className="mt-1 text-ink-700">{d.tor}</dd>
              </div>
              <div>
                <dt className="text-[12px] font-semibold uppercase tracking-[0.1em] text-ink-500">Typischer Nachweis</dt>
                <dd className="mt-1 text-ink-700">{d.nachweis}</dd>
              </div>
            </dl>
          </div>
          <p className="flex items-start gap-2 text-[12.5px] leading-relaxed text-ink-500">
            <Info aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-ov-600" />
            Vereinfachte Darstellung zur Orientierung, keine Planungsunterlage. Netzanschlusspunkt, Messkonzept, Schutz und Schwellen legt Ihr Netzbetreiber im Netzanschlussvertrag fest. Quellen: TOR
            Stromerzeugungsanlagen Typ A V1.4, Typ B V1.3, TOR D2 (E-Control); Stand 10/2026.
          </p>
        </div>
      </div>

      <details className="group border-t border-ink-100">
        <summary className="flex min-h-12 cursor-pointer list-none items-center gap-2 px-6 py-3 text-[14px] font-semibold text-ink-800 hover:text-ov-700 md:px-8 [&::-webkit-details-marker]:hidden">
          <Table2 aria-hidden="true" className="h-4 w-4 text-ov-600" />
          Als Tabelle anzeigen: {v.titel}
        </summary>
        <div className="overflow-x-auto px-4 pb-6 md:px-8">
          <table className="w-full min-w-[720px] border-collapse text-left text-[13.5px]">
            <caption className="sr-only">Bauteile im Einlinienschaltbild, {v.titel}</caption>
            <thead>
              <tr className="border-b border-ink-200/70 text-[12px] uppercase tracking-[0.08em] text-ink-500">
                <th scope="col" className="py-2.5 pr-4 font-semibold">
                  Bauteil
                </th>
                <th scope="col" className="py-2.5 pr-4 font-semibold">
                  Funktion
                </th>
                <th scope="col" className="py-2.5 pr-4 font-semibold">
                  TOR-Bezug
                </th>
                <th scope="col" className="py-2.5 font-semibold">
                  Typischer Nachweis
                </th>
              </tr>
            </thead>
            <tbody>
              {reihenfolge.map((b) => {
                const t = BAUTEILE[b];
                const opt = v.seite.find((s) => s.id === b)?.optional;
                return (
                  <tr key={b} className="border-b border-ink-100 align-top">
                    <th scope="row" className="py-3 pr-4 font-semibold text-ink-900">
                      {t.name}
                      {opt ? " (optional)" : ""}
                    </th>
                    <td className="py-3 pr-4 text-ink-700">{t.funktion}</td>
                    <td className="py-3 pr-4 text-ink-700">{t.tor}</td>
                    <td className="py-3 text-ink-700">{t.nachweis}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  );
}

export { BAUTEILE as EINLINIEN_BAUTEILE, VARIANTEN as EINLINIEN_VARIANTEN };
