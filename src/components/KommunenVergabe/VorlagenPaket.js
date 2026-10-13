// src/components/KommunenVergabe/VorlagenPaket.js
//
// Muster-Paket für Gemeinden (Welle B, Paket B09): funktionale Leistungsbeschreibung (DOCX, HTML)
// und Bewertungsmatrix für drei Angebote (XLSX) – erzeugt von scripts/vorlagen-erzeugen.mjs nach
// public/vorlagen/. Statische Inhalte, frei und OHNE Lead-Gate (Stufe 3 der Gate-Regel).
// Mit Rechtsvorbehalt, Offenlegung der Herausgeberin und Hinweis zu § 25 BVergG (Vorarbeiten).

import { FileSpreadsheet, FileText, Globe, Scale } from "lucide-react";
import { cn } from "@/components/ui/cn";

export const VORLAGEN_STAND = { iso: "2026-10-11", label: "11.10.2026", version: "1.0" };

export const VORLAGEN = [
  {
    id: "lb-docx",
    titel: "Funktionale Leistungsbeschreibung",
    format: "Word (DOCX)",
    href: "/vorlagen/leistungsbeschreibung-pv-gemeinde-muster.docx",
    icon: FileText,
    text: "Leistungsumfang, technische Mindestanforderungen herstellerneutral, Normen (StLB-HT, OVE R 11-1, ÖVE/ÖNORM EN 62446-1, TOR Erzeuger), EAG-Abwicklung, Wartungsoption.",
  },
  {
    id: "lb-html",
    titel: "Leistungsbeschreibung zum Lesen und Drucken",
    format: "HTML",
    href: "/vorlagen/leistungsbeschreibung-pv-gemeinde-muster.html",
    icon: Globe,
    text: "Derselbe Inhalt als Webseite – zum Durchsehen im Browser oder Drucken als PDF.",
  },
  {
    id: "matrix",
    titel: "Bewertungsmatrix für drei Angebote",
    format: "Excel (XLSX)",
    href: "/vorlagen/bewertungsmatrix-pv-angebote-muster.xlsx",
    icon: FileSpreadsheet,
    text: "Preis, Ertragsprognose, Wartung, Reaktionszeit, Lieferzeit – Gewichte frei wählbar, Punkte und Rang per Formel (§ 46 Abs. 4 BVergG).",
  },
];

export default function VorlagenPaket({ className }) {
  return (
    <div className={cn("grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-10", className)}>
      <ul className="grid gap-3">
        {VORLAGEN.map((v) => {
          const Icon = v.icon;
          return (
            <li key={v.id}>
              <a
                href={v.href}
                download={v.id !== "lb-html" ? "" : undefined}
                target={v.id === "lb-html" ? "_blank" : undefined}
                rel={v.id === "lb-html" ? "noopener" : undefined}
                className="group flex gap-4 rounded-3xl bg-white p-5 shadow-[0_14px_40px_-30px_rgba(3,18,43,0.5)] ring-1 ring-ink-200/60 transition hover:ring-ov-300"
              >
                <span aria-hidden="true" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-ov-100 text-ov-700">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="min-w-0">
                  <span className="block font-display text-[17px] font-bold leading-snug text-ink-900 group-hover:text-ov-800">{v.titel}</span>
                  <span className="mt-0.5 block text-[12.5px] font-semibold uppercase tracking-[0.1em] text-ink-500">
                    {v.format} · Version {VORLAGEN_STAND.version} · frei, ohne Registrierung
                  </span>
                  <span className="mt-1.5 block text-[14px] leading-relaxed text-ink-600">{v.text}</span>
                </span>
              </a>
            </li>
          );
        })}
      </ul>
      <div className="rounded-3xl bg-navy-950 p-6 text-white">
        <p className="flex items-center gap-2 text-[12.5px] font-semibold uppercase tracking-[0.14em] text-ov-300">
          <Scale aria-hidden="true" className="h-4 w-4" />§ 25 BVergG · Vorarbeiten
        </p>
        <p className="mt-3 text-[14.5px] leading-relaxed text-white/80">
          Hat ein Unternehmen an der Vorbereitung eines Vergabeverfahrens mitgewirkt, muss die Gemeinde das offenlegen und so ausgleichen, dass kein Wettbewerbsvorteil entsteht – etwa indem alle
          Bieter dieselben Unterlagen und angemessene Fristen erhalten.
        </p>
        <p className="mt-3 text-[14.5px] leading-relaxed text-white/80">
          Diese Muster sind öffentlich, für alle Bieter gleich zugänglich und nicht für ein bestimmtes Verfahren erstellt. Herausgeberin ist die Ökovolt Solartechnik GmbH, ein Fachbetrieb, der sich an
          Vergabeverfahren beteiligen kann – verwenden Sie die Muster und bietet Ökovolt an, halten Sie das im Vergabevermerk fest.
        </p>
        <p className="mt-4 border-t border-white/10 pt-4 text-[12.5px] leading-relaxed text-white/60">
          Rechtsvorbehalt: Arbeitshilfe ohne Gewähr, keine Rechtsberatung und keine Fachplanung. Verbindlich sind Gesetze, Normen, Netzbetreiber- und Förderbedingungen in der geltenden Fassung. Stand{" "}
          {VORLAGEN_STAND.label}.
        </p>
      </div>
    </div>
  );
}
