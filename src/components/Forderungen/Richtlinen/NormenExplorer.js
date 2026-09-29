"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, ClipboardCheck, HardHat, PlugZap, Plus, Ruler, Search, ShieldCheck } from "lucide-react";

/**
 * Normen-Explorer Österreich: Regelwerke für PV-Anlagen nach Projektphase.
 * Filter per Chip und Suche; Karten klappen auf (Text bleibt im DOM).
 * pruefen: Ausgabe/Detail an keiner Primärquelle belegt – als solcher markiert.
 */

const PHASEN = [
  { id: "alle", label: "Alle", icon: null },
  { id: "planung", label: "Planung", icon: Ruler },
  { id: "installation", label: "Installation", icon: HardHat },
  { id: "netz", label: "Netzanschluss", icon: PlugZap },
  { id: "betrieb", label: "Prüfung & Betrieb", icon: ClipboardCheck },
];

export const NORMEN = [
  { code: "ÖNORM B 1991-1-3:2022", titel: "Schneelasten (Eurocode 1, nationale Festlegungen)", phase: "planung", pflicht: true, worum: "Die charakteristische Schneelast sₖ steht seit der Ausgabe 2022-05-15 nicht mehr in Zonen mit Seehöhenformel, sondern in einer Rasterkarte (50 × 50 m) – abrufbar über HORA/eHORA.", fuerSie: "Bestimmt Schienen, Haken, Modulwahl und Prüflast – im alpinen Raum oft das K.-o.-Kriterium." },
  { code: "ÖNORM B 1991-1-4:2023", titel: "Windlasten", phase: "planung", pflicht: true, worum: "Windlastannahmen nach Basiswindgeschwindigkeit, Geländekategorie und Gebäudeform; Rand- und Eckbereiche von Dächern.", fuerSie: "Entscheidend für Ballast und Befestigung auf Flachdächern und für Freiflächen-Tragwerke." },
  { code: "ÖNORM B 3663", titel: "Hagel – Einwirkung und Widerstand", phase: "planung", pflicht: false, pruefen: true, worum: "Hagelgefährdung und Hagelwiderstand von Bauteilen; laut HORA liegt eine Ausgabe 2026-07-15 vor.", fuerSie: "Grundlage für Modulwahl nach Hagelwiderstandsklasse und für Versicherungsgespräche in hagelreichen Regionen." },
  { code: "OIB-Richtlinie 2:2023", titel: "Brandschutz im Hochbau", phase: "planung", pflicht: true, worum: "Brandabschnitte, Batterieräume und Anforderungen an Speicher; über die Bautechnikverordnungen der Länder verbindlich.", fuerSie: "Regelt, ab welcher Speichergröße ein eigener Batterieraum nötig ist – in OÖ z. B. bis 20 kWh im Einfamilienhaus ohne Batterieraum." },
  { code: "OVE-Richtlinie R 11-1", titel: "PV-Anlagen – Schutz von Einsatzkräften", phase: "planung", pflicht: false, pruefen: true, worum: "Zusätzliche Sicherheitsanforderungen an PV-Anlagen für den Feuerwehreinsatz: Kennzeichnung, Leitungsführung, Abschaltung.", fuerSie: "Wird von Behörden, Feuerwehr und Versicherern regelmäßig vorausgesetzt – vor allem bei Gewerbe und Landwirtschaft." },
  { code: "ÖVE/ÖNORM EN 62305", titel: "Blitzschutz", phase: "planung", pflicht: false, worum: "Äußerer und innerer Blitzschutz, Trennungsabstände zu Fangeinrichtungen.", fuerSie: "Hat das Gebäude einen Blitzschutz, darf die PV-Anlage ihn nicht schwächen." },
  { code: "ÖVE/ÖNORM E 8101", titel: "Elektrische Niederspannungsanlagen", phase: "installation", pflicht: true, worum: "Errichtungsbestimmungen inkl. Teil für PV-Stromversorgungssysteme: Schutzmaßnahmen, DC-Seite, Überspannungsschutz; über die ETV 2020 verbindlich.", fuerSie: "Grundlage jeder fachgerechten Installation und des Anlagenbuchs mit Prüfbefund." },
  { code: "ÖVE/ÖNORM EN 62548", titel: "Auslegung von PV-Generatoren", phase: "installation", pflicht: true, worum: "Stringauslegung, Spannungsgrenzen, Absicherung und mechanische Integration der Module.", fuerSie: "Verhindert Fehlanpassungen, die Ertrag kosten oder Wechselrichter überlasten." },
  { code: "OVE-Richtlinie R 20", titel: "Stationäre elektrische Energiespeichersysteme", phase: "installation", pflicht: false, pruefen: true, worum: "Sicherheitsanforderungen an Speichersysteme zum Anschluss an das Niederspannungsnetz: Aufstellung, Schutz, Kennzeichnung.", fuerSie: "Maßstab für einen sicheren Speicher-Aufstellort in Betrieb und Haus." },
  { code: "ÖNORM B 3417", titel: "Sicherheitsausstattung auf Dächern", phase: "installation", pflicht: true, worum: "Planung und Ausführung von Anschlageinrichtungen und Absturzsicherungen; ergänzt durch die Bauarbeiterschutzverordnung.", fuerSie: "Seriöse Angebote enthalten Gerüst oder Absturzsicherung – und dauerhafte Anschlagpunkte für die Wartung." },
  { code: "TOR Erzeuger (Typ A–D)", titel: "Technische und organisatorische Regeln der E-Control", phase: "netz", pflicht: true, pruefen: true, worum: "Anforderungen an Erzeugungsanlagen nach Typ: A ab 0,8 kW bis unter 250 kW, B bis unter 35 MW, C bis unter 50 MW, D ab 50 MW bzw. ab 110 kV – Blindleistung, Frequenzverhalten, Schutz, Fernsteuerbarkeit.", fuerSie: "Ab Typ B verlangt der Netzbetreiber Parkregler, Nachweise und oft Fernwirktechnik – hier setzen wir unseren eigenen EZA-Regler ein." },
  { code: "TAEV", titel: "Technische Anschlussbedingungen", phase: "netz", pflicht: true, worum: "Anschluss an öffentliche Verteilernetze: Zählerplatz, Messung, Hausanschluss – ergänzt durch die Vorgaben des Netzbetreibers.", fuerSie: "Entscheidet, ob Zählerschrank und Messwandler für PV und Speicher umgebaut werden müssen." },
  { code: "ElWG § 96", titel: "Netzanschluss bis 20 kW", phase: "netz", pflicht: true, worum: "Erneuerbare Anlagen bis 20 kW werden auf Anzeige angeschlossen; der Netzbetreiber kann binnen 4 Wochen aus Sicherheitsgründen ablehnen.", fuerSie: "Kleine Betriebs- und Hausanlagen kommen ohne Netzverträglichkeitsprüfung aus." },
  { code: "ElWG – Spitzenkappung", titel: "Einspeisebegrenzung auf 70 %", phase: "netz", pflicht: true, worum: "Bei neuen oder erweiterten Anlagen darf der Netzbetreiber die Einspeisung auf 70 % der Modulspitzenleistung begrenzen (ausgenommen bis 7 kW netzwirksam).", fuerSie: "Speicher, Eigenverbrauch und Energiemanagement gleichen die Kappung weitgehend aus." },
  { code: "ÖVE/ÖNORM EN 62446-1", titel: "Dokumentation, Inbetriebnahme- und Wiederholungsprüfung", phase: "betrieb", pflicht: true, worum: "Anlagendokumentation, Erstprüfung mit Messprotokoll (Isolation, Kennlinien) und wiederkehrende Prüfungen.", fuerSie: "Ihr Nachweis gegenüber Netzbetreiber, Förderstelle und Versicherung." },
  { code: "ESV 2012", titel: "Elektroschutzverordnung", phase: "betrieb", pflicht: true, worum: "Pflichten von Arbeitgebern: Prüfung elektrischer Anlagen in Arbeitsstätten vor Inbetriebnahme und wiederkehrend.", fuerSie: "Für Betriebe verpflichtend – wir bieten E-Check und Anlagenprüfung als Wartungsleistung an." },
  { code: "Herkunftsnachweise (E-Control)", titel: "Registrierung der Anlage", phase: "betrieb", pflicht: true, worum: "Registrierung in der Herkunftsnachweisdatenbank – Voraussetzung für EAG-Zuschuss und Marktprämie.", fuerSie: "Ohne Registrierung innerhalb der Frist gerät die Förderung in Gefahr." },
];

const PHASE_TON = {
  planung: { balken: "bg-sun-400", chip: "bg-sun-300/35 text-ink-800" },
  installation: { balken: "bg-ov-500", chip: "bg-ov-50 text-ov-800" },
  netz: { balken: "bg-navy-500", chip: "bg-navy-50 text-navy-800" },
  betrieb: { balken: "bg-ink-500", chip: "bg-ink-100 text-ink-700" },
};

export default function NormenExplorer() {
  const [phase, setPhase] = useState("alle");
  const [suche, setSuche] = useState("");
  const [offen, setOffen] = useState(null);

  const liste = useMemo(() => {
    const q = suche.trim().toLowerCase();
    return NORMEN.filter((n) => (phase === "alle" || n.phase === phase) && (!q || `${n.code} ${n.titel} ${n.worum}`.toLowerCase().includes(q)));
  }, [phase, suche]);

  return (
    <div>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div role="group" aria-label="Projektphase filtern" className="ov-no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 md:mx-0 md:flex-wrap md:px-0">
          {PHASEN.map((p) => {
            const an = phase === p.id;
            const anzahl = p.id === "alle" ? NORMEN.length : NORMEN.filter((n) => n.phase === p.id).length;
            return (
              <button
                key={p.id}
                type="button"
                aria-pressed={an}
                onClick={() => setPhase(p.id)}
                className={`inline-flex h-11 shrink-0 items-center gap-2 rounded-full px-4 text-[14.5px] font-semibold transition-all ${an ? "bg-navy-950 text-white shadow-lg" : "bg-white text-ink-700 ring-1 ring-ink-200 hover:ring-ink-300"}`}
              >
                {p.icon && <p.icon aria-hidden="true" className={`h-4 w-4 ${an ? "text-ov-300" : "text-ov-600"}`} />}
                {p.label}
                <span className={`ov-num rounded-full px-1.5 text-[12px] ${an ? "bg-white/15 text-white" : "bg-ink-100 text-ink-600"}`}>{anzahl}</span>
              </button>
            );
          })}
        </div>
        <label className="relative block w-full lg:w-72">
          <span className="sr-only">Normen durchsuchen</span>
          <Search aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
          <input
            type="search"
            value={suche}
            onChange={(e) => setSuche(e.target.value)}
            placeholder="Norm oder Thema suchen, z. B. Schnee"
            className="h-11 w-full rounded-full bg-white pl-10 pr-4 text-[14.5px] text-ink-900 ring-1 ring-ink-200 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-ov-500"
          />
        </label>
      </div>

      <ul className="mt-8 grid items-start gap-3 md:grid-cols-2" aria-live="polite">
        {liste.map((n) => {
          const P = PHASEN.find((x) => x.id === n.phase);
          const ton = PHASE_TON[n.phase];
          const auf = offen === n.code;
          return (
            <li key={n.code} className={`relative overflow-hidden rounded-3xl bg-white ring-1 transition-shadow ${auf ? "shadow-[0_24px_48px_-32px_rgba(3,18,43,0.5)] ring-ov-200" : "ring-ink-200/70 hover:shadow-[0_20px_40px_-32px_rgba(3,18,43,0.45)]"}`}>
              <span aria-hidden="true" className={`absolute inset-y-0 left-0 w-1.5 ${ton.balken}`} />
              <button type="button" aria-expanded={auf} onClick={() => setOffen(auf ? null : n.code)} className="flex w-full items-start gap-4 p-5 pl-6 text-left outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ov-500">
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-center gap-2">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[12px] font-semibold ${ton.chip}`}>
                      {P.icon && <P.icon aria-hidden="true" className="h-3.5 w-3.5" />}
                      {P.label}
                    </span>
                    {n.pflicht ? (
                      <span className="inline-flex items-center gap-1 text-[12px] font-semibold text-navy-700"><ShieldCheck aria-hidden="true" className="h-3.5 w-3.5" /> verbindlich</span>
                    ) : (
                      <span className="text-[12px] font-medium text-ink-500">je nach Fall</span>
                    )}
                  </span>
                  <span className="mt-2.5 block font-display text-[17px] font-extrabold leading-snug tracking-tight text-ink-900">{n.code}</span>
                  <span className="block text-[14.5px] font-semibold text-ov-700">{n.titel}</span>
                </span>
                <span className={`mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${auf ? "rotate-45 bg-ov-500 text-white" : "bg-ink-100 text-ink-700"}`}>
                  <Plus aria-hidden="true" className="h-4 w-4" />
                </span>
              </button>
              <div hidden={!auf} className="ov-tab-panel px-6 pb-6">
                <p className="text-[14.5px] leading-relaxed text-ink-600">{n.worum}</p>
                {n.pruefen && <p className="mt-2 text-[12.5px] font-medium text-ink-500">Ausgabe bzw. Details: Stand 09/2026, bitte beim Normungsinstitut prüfen</p>}
                <p className="mt-4 rounded-2xl bg-sand-50 p-4 text-[14px] leading-relaxed text-ink-700 ring-1 ring-ink-200/60">
                  <span className="font-semibold text-ink-900">Für Sie: </span>
                  {n.fuerSie}
                </p>
              </div>
            </li>
          );
        })}
        {liste.length % 2 === 1 && (
          <li className="hidden md:block">
            <Link href="/angebot" className="group relative flex h-full min-h-[118px] items-center justify-between gap-4 overflow-hidden rounded-3xl bg-navy-950 p-5 pl-6 text-white">
              <span aria-hidden="true" className="absolute -right-10 -top-16 h-40 w-40 rounded-full bg-ov-500/30 blur-[60px]" />
              <span className="relative">
                <span className="block font-display text-[17px] font-extrabold leading-snug">Normen, TOR-Nachweise und Statik für Ihr Projekt</span>
                <span className="mt-1 block text-[14px] text-white/65">Wir klären, was für Ihre Anlage gilt.</span>
              </span>
              <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ov-500 transition-transform group-hover:translate-x-1">
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </span>
            </Link>
          </li>
        )}
      </ul>
      {liste.length === 0 && <p className="mt-6 rounded-3xl bg-white p-6 text-center text-[15px] text-ink-600 ring-1 ring-ink-200/70">Keine Norm gefunden – Suchbegriff oder Phase ändern.</p>}
    </div>
  );
}
