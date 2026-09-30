import { Building, Globe2, MapPinned, Waypoints } from "lucide-react";

import Reveal from "@/components/ui/Reveal";
import { cn } from "@/components/ui/cn";

/**
 * Netzentgelt-Vorteil je Nahebereich – 2026 (geltende SNE-V) und ab 2027 (Entwurf / offen).
 * Server-Komponente, Darstellung auf dunklem Grund (DunkelSektion).
 */
const STUFEN = [
  {
    id: "gebaeude",
    icon: Building,
    titel: "Hauptleitung & Standortbereich",
    wo: "Gleiches Gebäude oder Areal, z. B. Gewerbepark mit gemeinsamem Anschluss",
    wert: "GEA",
    wertLabel: "gemeinschaftliche Erzeugungsanlage",
    bis2026: "Zugeordneter Strom aus der gemeinschaftlichen Erzeugungsanlage nutzt das öffentliche Netz nicht.",
    ab2027: "Laut Entwurf der E-Control bis zu 90 % bzw. 100 % Abschlag möglich; Leistung wird nur hier saldiert.",
    breite: null,
  },
  {
    id: "lokal",
    icon: MapPinned,
    titel: "Lokalbereich",
    wo: "Gleiche Trafostation, Netzebene 6 und 7",
    wert: "−57 %",
    bis2026: "EEG: −57 % auf den Arbeitspreis der Netznutzung. BEG und P2P: keine Reduktion.",
    ab2027: "Abschlag für alle Modelle je genutzter Netzebene – Satz in der Tarifverordnung, noch offen.",
    breite: 57,
  },
  {
    id: "regional",
    icon: Waypoints,
    titel: "Regionalbereich",
    wo: "Gleiches Umspannwerk, Netzebene 4 und 5",
    wert: "−28 / −64 %",
    bis2026: "EEG: −28 % (Netzebene 6/7) bzw. −64 % (Netzebene 4/5). BEG und P2P: keine Reduktion.",
    ab2027: "Abschlag für alle Modelle je genutzter Netzebene – Satz in der Tarifverordnung, noch offen.",
    breite: 28,
  },
  {
    id: "weit",
    icon: Globe2,
    titel: "Österreichweit",
    wo: "Teilnehmer in verschiedenen Netzgebieten",
    wert: "0 %",
    bis2026: "Kein Netzentgeltvorteil; nur EEG sparen Elektrizitätsabgabe und Erneuerbaren-Förderbeitrag.",
    ab2027: "Volles Netzentgelt. Netzübergreifende Modelle voraussichtlich ab April 2027.",
    breite: 0,
  },
];

export default function NahebereichStufen({ className }) {
  return (
    <ol className={cn("grid gap-4 sm:grid-cols-2 xl:grid-cols-4 xl:gap-5", className)}>
      {STUFEN.map((s, i) => (
        <Reveal as="li" key={s.id} delay={i * 90} className="flex">
          <article className="flex w-full flex-col rounded-3xl bg-white/[0.05] p-6 ring-1 ring-white/10 md:p-7">
            <div className="flex items-center justify-between gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-ov-500/15 text-ov-300 ring-1 ring-ov-400/20">
                <s.icon aria-hidden="true" className="h-5 w-5" strokeWidth={1.8} />
              </span>
              <span className="font-display text-[13px] font-bold tracking-[0.2em] text-white/30">0{i + 1}</span>
            </div>
            <h3 className="mt-5 font-display text-[19px] font-bold leading-snug text-white">{s.titel}</h3>
            <p className="mt-1 text-[13.5px] leading-snug text-white/55">{s.wo}</p>

            <p className="ov-num mt-5 font-display text-[30px] font-extrabold leading-none tracking-tight text-white">{s.wert}</p>
            <p className="mt-1.5 text-[12px] uppercase tracking-[0.14em] text-white/40">{s.wertLabel || "EEG-Arbeitspreis bis 31.12.2026"}</p>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10" aria-hidden="true">
              {s.breite !== null && <div className="h-full rounded-full bg-gradient-to-r from-ov-400 to-ov-300" style={{ width: `${s.breite}%` }} />}
            </div>

            <dl className="mt-5 space-y-3 border-t border-white/10 pt-5 text-[14px] leading-relaxed">
              <div>
                <dt className="text-[12px] font-semibold uppercase tracking-[0.14em] text-ov-300">2026</dt>
                <dd className="mt-1 text-white/75">{s.bis2026}</dd>
              </div>
              <div>
                <dt className="text-[12px] font-semibold uppercase tracking-[0.14em] text-sun-300">Ab 1.1.2027</dt>
                <dd className="mt-1 text-white/75">{s.ab2027}</dd>
              </div>
            </dl>
          </article>
        </Reveal>
      ))}
    </ol>
  );
}
