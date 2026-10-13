// src/components/Verkauf/UnsereZusagen.js
//
// Zusagen an Kundinnen und Kunden (Welle A, Paket A03). Zeigt ausschließlich ZUSAGEN aus
// src/data/marke.js (A02) mit freigegeben === true (strikt) – sonst null. Die Freigabe setzt der
// Inhaber nach Rechtsprüfung in marke.js (freigegeben, freigegeben_am, freigegeben_von).
// rahmen (true oder Ton von <Section>): eigener Seitenabschnitt mit ov-container – für Seiten ohne umgebende <Section>.

import { CheckCircle2 } from "lucide-react";

import { ZUSAGEN } from "@/data/marke";
import { nurFreigegeben } from "@/data/preisbaender";
import { cn } from "@/components/ui/cn";
import Section from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/SectionHeading";

/** Freigegebene Zusagen – zusätzlich müssen freigegeben_am und freigegeben_von gesetzt sein. */
export const zusagenFreigegeben = (liste = ZUSAGEN) => nurFreigegeben(liste).filter((z) => z.freigegeben_am && z.freigegeben_von && z.text);

export default function UnsereZusagen({ titel = "Unsere Zusagen", rahmen, className, headingAs: H = "h2" }) {
  const liste = zusagenFreigegeben();
  if (!liste.length) return null;

  const inhalt = (
    <section aria-labelledby="unsere-zusagen-titel" className={cn("relative", className)}>
      <Eyebrow className="mb-4">Verbindlich</Eyebrow>
      <H id="unsere-zusagen-titel" className="ov-h3 text-ink-900">
        {titel}
      </H>
      <ul className="mt-5 grid list-none gap-3 p-0 sm:grid-cols-2">
        {liste.map((z) => (
          <li key={z.id} className="flex items-start gap-3 rounded-2xl bg-white p-4 ring-1 ring-ink-200/70">
            <CheckCircle2 aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-ov-700" />
            <span className="text-[15px] leading-relaxed text-ink-800">{z.text}</span>
          </li>
        ))}
      </ul>
    </section>
  );

  if (!rahmen) return inhalt;
  return (
    <Section as="div" tone={typeof rahmen === "string" ? rahmen : "white"} space="md">
      {inhalt}
    </Section>
  );
}
