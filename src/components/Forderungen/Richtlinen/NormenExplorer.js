"use client";

import { useMemo, useState } from "react";
import { ClipboardCheck, HardHat, PlugZap, Ruler, ShieldCheck } from "lucide-react";

/**
 * Normen-Explorer: die wichtigsten Regelwerke für PV-Anlagen nach Projektphase.
 * Filter per Chip (Radiogruppe), Inhalte bleiben ohne JavaScript vollständig
 * sichtbar (Startzustand „Alle“).
 */

const PHASEN = [
  { id: "alle", label: "Alle", icon: null },
  { id: "planung", label: "Planung", icon: Ruler },
  { id: "installation", label: "Installation", icon: HardHat },
  { id: "netz", label: "Netzanschluss", icon: PlugZap },
  { id: "betrieb", label: "Prüfung & Betrieb", icon: ClipboardCheck },
];

const NORMEN = [
  { code: "DIN VDE 0100-712", titel: "Errichtung von PV-Stromversorgungssystemen", phase: "installation", pflicht: true, worum: "Schutz gegen elektrischen Schlag, Auswahl der Betriebsmittel, DC-Verkabelung und Absicherung.", fuerSie: "Grundlage jeder fachgerechten Installation – Voraussetzung für Netzanschluss und Versicherungsschutz." },
  { code: "DIN EN 62548 (VDE 0126-21)", titel: "Auslegung von PV-Generatoren", phase: "planung", pflicht: true, worum: "Stringauslegung, Spannungsgrenzen, Sicherungen und mechanische Integration der Module.", fuerSie: "Verhindert Fehlanpassungen, die Ertrag kosten oder den Wechselrichter überlasten." },
  { code: "DIN EN 1991-1-3 / -1-4", titel: "Schnee- und Windlasten (Eurocode 1)", phase: "planung", pflicht: true, worum: "Lastannahmen nach Schnee- und Windlastzone, Geländehöhe und Gebäudeform.", fuerSie: "Im Allgäu und an der Küste besonders relevant – bestimmt Schienen, Haken und Ballast." },
  { code: "DIN EN 62305 (VDE 0185-305)", titel: "Blitzschutz", phase: "planung", pflicht: false, worum: "Äußerer Blitzschutz (Trennungsabstände zu Fangeinrichtungen) und innerer Blitzschutz.", fuerSie: "Pflicht, wenn das Gebäude bereits einen Blitzschutz hat oder dieser gefordert ist – die Anlage darf ihn nicht schwächen." },
  { code: "DIN VDE 0100-443 / -534", titel: "Überspannungsschutz", phase: "installation", pflicht: true, worum: "Wann Überspannungsschutzgeräte (SPD) auf AC- und DC-Seite nötig sind und wie sie ausgewählt werden.", fuerSie: "Schützt Wechselrichter, Speicher und Hausgeräte vor Spannungsspitzen." },
  { code: "VDE-AR-E 2510-2", titel: "Stationäre Batteriespeicher", phase: "installation", pflicht: false, worum: "Sicherheitsanforderungen an Aufstellort, Belüftung, Schutzeinrichtungen und Kennzeichnung von Heimspeichern.", fuerSie: "Maßstab für einen sicheren Speicher-Aufstellort im Haus." },
  { code: "DGUV Regel 112-198/-199, DIN EN 363, DIN EN 795", titel: "Absturzsicherung bei Dacharbeiten", phase: "installation", pflicht: true, worum: "Persönliche Schutzausrüstung, Auffangsysteme und Anschlageinrichtungen.", fuerSie: "Seriöse Betriebe kalkulieren Gerüst oder Absturzsicherung ein – fragen Sie im Angebot gezielt danach." },
  { code: "VDE-AR-N 4105:2026-03", titel: "Erzeugungsanlagen am Niederspannungsnetz", phase: "netz", pflicht: true, worum: "Netzanschluss, NA-Schutz, Blindleistung (neu: Q(U) als Standard), Einspeisemanagement, vereinfachte Regeln bis 800 VA, Nulleinspeisung.", fuerSie: "Seit März 2026 in neuer Fassung. Der Netzbetreiber schließt nur Anlagen mit passendem Einheitenzertifikat an." },
  { code: "VDE-AR-N 4100", titel: "Technische Anschlussregeln Niederspannung", phase: "netz", pflicht: true, worum: "Hausanschluss, Zählerplatz und Zählerschrank – ergänzt durch die TAB des Netzbetreibers.", fuerSie: "Entscheidet, ob Ihr Zählerschrank für PV, Speicher und Smart Meter erneuert werden muss." },
  { code: "EEG 2023 & Solarspitzengesetz", titel: "Vergütung und Einspeiseregeln", phase: "netz", pflicht: true, worum: "Einspeisevergütung, 60-%-Begrenzung ohne Steuerbox, keine Vergütung bei negativen Börsenpreisen.", fuerSie: "Bestimmt, was eingespeister Strom bringt – und warum Eigenverbrauch und Speicher wichtiger werden." },
  { code: "MsbG & § 14a EnWG", titel: "Smart Meter und steuerbare Verbraucher", phase: "netz", pflicht: true, worum: "Smart-Meter-Pflicht für PV ab 7 kW; Wärmepumpen, Wallboxen und Speicher über 4,2 kW sind steuerbar – dafür reduzierte Netzentgelte.", fuerSie: "Mit Wallbox oder Wärmepumpe sparen Sie Netzentgelte, der Netzbetreiber darf in Engpässen kurz dimmen." },
  { code: "DIN EN 62446-1 (VDE 0126-23-1)", titel: "Dokumentation und Inbetriebnahmeprüfung", phase: "betrieb", pflicht: true, worum: "Anlagendokumentation, Erstprüfung mit Messprotokoll und wiederkehrende Prüfungen.", fuerSie: "Ihr Nachweis gegenüber Netzbetreiber und Versicherung – bestehen Sie auf das Prüfprotokoll." },
  { code: "Marktstammdatenregister (MaStRV)", titel: "Registrierungspflicht", phase: "betrieb", pflicht: true, worum: "Registrierung von PV-Anlage und Speicher bei der Bundesnetzagentur innerhalb eines Monats nach Inbetriebnahme.", fuerSie: "Ohne Eintrag droht, dass die Vergütung zurückgehalten wird." },
  { code: "VdS 3145", titel: "Richtlinie der Sachversicherer", phase: "betrieb", pflicht: false, worum: "Schadenverhütung: Brandschutz, Anordnung, Wartung und Prüfintervalle.", fuerSie: "Wird von Versicherern häufig vorausgesetzt – vor allem bei Gewerbe und Landwirtschaft." },
  { code: "DGUV Vorschrift 3", titel: "Wiederkehrende Prüfung elektrischer Anlagen", phase: "betrieb", pflicht: false, worum: "Regelmäßige Prüfung ortsfester elektrischer Anlagen in Betrieben.", fuerSie: "Für gewerbliche Betreiber verpflichtend, für Privathaushalte als Wartung empfehlenswert." },
];

export default function NormenExplorer() {
  const [phase, setPhase] = useState("alle");
  const liste = useMemo(() => (phase === "alle" ? NORMEN : NORMEN.filter((n) => n.phase === phase)), [phase]);

  return (
    <div>
      <div role="group" aria-label="Projektphase filtern" className="ov-no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 md:mx-0 md:flex-wrap md:justify-center md:px-0">
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

      <ul className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3" aria-live="polite">
        {liste.map((n) => {
          const P = PHASEN.find((x) => x.id === n.phase);
          return (
            <li key={n.code} className="flex flex-col rounded-3xl bg-white p-6 ring-1 ring-ink-200/70 transition-shadow hover:shadow-[0_20px_40px_-30px_rgba(3,18,43,0.4)]">
              <div className="flex items-start justify-between gap-3">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-ov-50 px-2.5 py-1 text-[12px] font-semibold text-ov-700">
                  {P.icon && <P.icon aria-hidden="true" className="h-3.5 w-3.5" />}
                  {P.label}
                </span>
                {n.pflicht ? (
                  <span className="inline-flex items-center gap-1 text-[12px] font-semibold text-navy-700">
                    <ShieldCheck aria-hidden="true" className="h-3.5 w-3.5" /> verbindlich
                  </span>
                ) : (
                  <span className="text-[12px] font-medium text-ink-500">je nach Fall</span>
                )}
              </div>
              <h3 className="mt-5 font-display text-[17.5px] font-extrabold leading-snug tracking-tight text-ink-900">{n.code}</h3>
              <p className="text-[14.5px] font-semibold text-ov-700">{n.titel}</p>
              <p className="mt-3 text-[14.5px] leading-relaxed text-ink-600">{n.worum}</p>
              <div className="mt-auto pt-5">
                <p className="border-t border-dashed border-ink-200 pt-4 text-[14px] leading-relaxed text-ink-700">
                  <span className="font-semibold text-ink-900">Für Sie: </span>
                  {n.fuerSie}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
