// src/components/Verkauf/Ansprechpartner.js
//
// Ansprechpartner-Karte für die Zielgruppenseiten (Welle A, Paket A03) – Server-Komponente.
// Foto und Name NUR bei Einwilligung (src/data/fachberater.js, einwilligung === true und Rolle),
// sonst die Teamfunktion („Ihr Projektteam Gewerbe & Industrie“). Telefon/E-Mail: Durchwahl der
// Person, sonst die Zentrale aus FIRMA (src/lib/site.js). Knopf „Termin buchen“ → /termin?thema=….
//
// Props: { zielgruppe: "gewerbe"|"landwirtschaft"|"gemeinde"|"freiflaeche"|"tourismus"|…, bundesland?: string }
// rahmen (true oder Ton von <Section>): eigener Seitenabschnitt mit ov-container – für Seiten ohne umgebende <Section>.

import Image from "next/image";
import { CalendarCheck2, Mail, Phone, Users } from "lucide-react";

import { TERMIN_THEMA, ZENTRALE, fachberaterFuer, teamfunktion } from "@/data/fachberater";
import { FIRMA } from "@/lib/site";
import Button from "@/components/ui/Button";
import { cn } from "@/components/ui/cn";
import Section from "@/components/ui/Section";

export default function Ansprechpartner({ zielgruppe, bundesland, rahmen, className, headingAs: H = "h2" }) {
  const person = fachberaterFuer(zielgruppe, bundesland);
  const funktion = teamfunktion(zielgruppe);
  const thema = TERMIN_THEMA[zielgruppe] || "sonstiges";
  const telefon = person?.telefon || ZENTRALE.telefon;
  const telefonHref = person?.telefon ? `tel:${person.telefon.replace(/[^\d+]/g, "")}` : ZENTRALE.telefonHref;
  const name = person ? person.name : funktion;
  const rolle = person ? `${person.rolle} · ${funktion}` : `${FIRMA.kurz} · ${ZENTRALE.ort}`;

  const inhalt = (
    <aside aria-labelledby="ansprechpartner-titel" className={cn("rounded-3xl bg-white p-6 ring-1 ring-ink-200/70 md:p-7", className)}>
      <div className="flex items-start gap-4">
        {person?.foto ? (
          <Image src={person.foto} alt={`${person.name}, ${person.rolle}`} width={72} height={72} className="h-18 w-18 shrink-0 rounded-2xl object-cover" />
        ) : (
          <span aria-hidden="true" className="flex h-18 w-18 shrink-0 items-center justify-center rounded-2xl bg-ov-50 text-ov-700 ring-1 ring-ov-200">
            <Users className="h-8 w-8" />
          </span>
        )}
        <div className="min-w-0 flex-1">
          <p className="text-[12.5px] font-semibold uppercase tracking-[0.12em] text-ink-500">Ihr Ansprechpartner</p>
          <H id="ansprechpartner-titel" className="mt-1 font-display text-[20px] font-extrabold leading-tight tracking-tight text-ink-900">
            {name}
          </H>
          <p className="mt-1 text-[14px] text-ink-600">{rolle}</p>
        </div>
      </div>

      <ul className="mt-5 space-y-2 text-[15px] text-ink-800">
        <li>
          <a href={telefonHref} className="inline-flex min-h-11 items-center gap-2.5 font-semibold hover:text-ov-700">
            <Phone aria-hidden="true" className="h-4 w-4 text-ov-700" />
            <span className="ov-num">{telefon}</span>
          </a>
        </li>
        <li>
          <a href={`mailto:${ZENTRALE.email}`} className="inline-flex min-h-11 items-center gap-2.5 font-semibold hover:text-ov-700">
            <Mail aria-hidden="true" className="h-4 w-4 text-ov-700" />
            {ZENTRALE.email}
          </a>
        </li>
      </ul>

      <Button href={`/termin?thema=${encodeURIComponent(thema)}`} icon={CalendarCheck2} className="mt-5 w-full sm:w-auto">
        Termin buchen
      </Button>
      <p className="mt-3 text-[12.5px] text-ink-500">
        {FIRMA.name}, {FIRMA.strasse}, {FIRMA.plz} {FIRMA.ort}. {FIRMA.oeffnungszeiten.map((o) => `${o.tage} ${o.zeit}`).join(" · ")}.
      </p>
    </aside>
  );

  if (!rahmen) return inhalt;
  return (
    <Section as="div" tone={typeof rahmen === "string" ? rahmen : "white"} space="md">
      {inhalt}
    </Section>
  );
}
