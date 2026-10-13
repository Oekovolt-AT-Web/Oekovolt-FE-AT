// src/components/Referenzen/BranchenReferenzen.js
//
// Branchen-Referenzen für die Zielgruppenseiten (Welle A, Paket A03) – Server-Komponente.
//
// Lädt die Projekte über ladeProjekteRoh (Backoffice, Rückfall src/data/projekte.js), wählt die
// Projekte der Zielgruppe aus src/data/branchenZuordnung.js und zeigt sie als Karten – sortiert
// nach Leistung. Darüber die Kennzahlen (src/data/kennzahlen.js) mit Hinweis und Stand und der
// berechnete Satz „Die größte dieser Anlagen: X kWp“ – erst ab MIN_FUER_GROESSTE Anlagen (bei ein, zwei
// kleinen Referenzen wirkt die Zahl neben der Gesamtleistung schwach) und ohne Namensfreigabe gerundet.
// Die Gesamtleistung erscheint ab 10.000 kWp in MWp („510 MWp“ statt „510.000 kWp“).
//
// Freigaben (Schema A07, src/lib/kundenbuehne.js): Firmenname nur bei freigabe.name === true,
// Logo nur bei freigabe.logo, Zitat nur bei freigabe.zitat – fehlende Felder gelten als false.
// Ohne Namensfreigabe erscheint die Karte neutral (Branche, Bundesland statt Ort, gerundete Leistung –
// Ort + exakte kWp machen den Betrieb sonst wiedererkennbar; Anlagenfoto nur bei freigabe.fotos)
// und OHNE Link auf die Projektseite, weil deren URL und Inhalt den Firmennamen tragen (Regel aus src/data/hero.js).
// Mit Namensfreigabe kommt ProjektKarte (Name, kWp, Link /referenzen/projekte/<slug>).
//
// Ohne Treffer: null (kein leerer Abschnitt).

import Image from "next/image";
import { MapPin, Zap } from "lucide-react";

import ProjektKarte from "@/components/Project/ProjektKarte";
import { ladeProjekteRoh } from "@/components/Project/ladeProjekte";
import { fmtKwp, normalisiereApiProjekt } from "@/components/Project/projektDaten";
import { kundeFuerProjekt, ladeFreigaben } from "@/lib/kundenbuehneServer";
import { nameFrei } from "@/lib/kundenbuehne";
import { KENNZAHLEN, KENNZAHLEN_HINWEIS, KENNZAHLEN_STAND, zahlText } from "@/data/kennzahlen";
import {
  anonymeBezeichnung,
  brancheOhneKlammer,
  leistungOhneFreigabe,
  regionOhneFreigabe,
  slugsFuerZielgruppe,
  NAMEN_OHNE_FREIGABE,
  ZIELGRUPPEN_LABEL,
} from "@/data/branchenZuordnung";
import { cn } from "@/components/ui/cn";
import { Eyebrow } from "@/components/ui/SectionHeading";

const STANDARD_TITEL = "Betriebe wie Ihrer, die schon mit Ökovolt-Strom arbeiten";

/** „Die größte dieser Anlagen“ erst ab so vielen Referenzen der Zielgruppe. */
export const MIN_FUER_GROESSTE = 3;

/** Kennzahl lesbar: Leistung ab 10.000 kWp in MWp, sonst Zahl + Suffix. */
export function kennzahlText(k) {
  if (k?.suffix?.trim() === "kWp" && Number(k.zahl) >= 10000) return `${zahlText(Math.round(Number(k.zahl) / 100) / 10)}\u00a0MWp`;
  return `${zahlText(k.zahl)}${k.suffix ? k.suffix.replace(/^ /, "\u00a0") : ""}`;
}

/** „Angaben Ökovolt Österreich · Stand 09/2026“ (ohne Abhängigkeit von A02-Feldern). */
const hinweisStand = () => {
  const [jahr, monat] = String(KENNZAHLEN_STAND || "").split("-");
  return jahr && monat ? `${KENNZAHLEN_HINWEIS} · Stand ${monat}/${jahr}` : KENNZAHLEN_HINWEIS;
};

/**
 * Projekte einer Zielgruppe mit Kundendaten – reine Auswahl, für Tests getrennt gehalten.
 * @returns {{ projekt, kunde, nameFrei: boolean }[]} absteigend nach kWp
 */
export async function ladeBranchenReferenzen(zielgruppe, max = 6) {
  const slugs = slugsFuerZielgruppe(zielgruppe);
  if (!slugs.length) return [];
  const [roh, freigaben] = await Promise.all([ladeProjekteRoh(), ladeFreigaben()]);
  const treffer = [];
  for (const r of roh) {
    const projekt = normalisiereApiProjekt(r);
    // ladeProjekteRoh liefert ohne Namensfreigabe neutralisierte Projekte (A07) – deren URL-Slug ist
    // dann neutral; die Zuordnung läuft deshalb über den unveränderten projekt_website_name.
    const schluessel = [r?.projekt_website_name, projekt.slug].map((x) => String(x || "").trim().toLowerCase()).find((x) => x && slugs.includes(x));
    if (!schluessel) continue;
    const kunde = kundeFuerProjekt(r, schluessel, freigaben);
    treffer.push({ projekt, kunde, schluessel, nameFrei: NAMEN_OHNE_FREIGABE || nameFrei(kunde) });
  }
  treffer.sort((a, b) => (b.projekt.kwp || 0) - (a.projekt.kwp || 0));
  return treffer.slice(0, Math.max(0, Number(max) || 0));
}

/** Neutrale Karte ohne Namen und ohne Link (keine Namensfreigabe). */
// Nur die nötigen Felder übergeben (kundeOrt, fotosFrei) – nicht das ganze Kundenobjekt mit Firma,
// Social-Links und Porträt (der Dev-Modus serialisiert Props von Server-Komponenten ins Debug-Payload).
function NeutraleKarte({ projekt, schluessel, kundeOrt, fotosFrei, headingAs: H = "h3" }) {
  const titel = anonymeBezeichnung(schluessel || projekt.slug);
  // Nur Bundesland und gerundete Leistung – genauer Ort + exakte kWp würden den Betrieb verraten.
  const ort = regionOhneFreigabe(projekt.ort || kundeOrt || "");
  const leistung = leistungOhneFreigabe(projekt.kwp);
  // Anlagenfoto nur mit freigabe.fotos === true – ein Luftbild macht den Betrieb sonst auch ohne Namen erkennbar.
  const mitFoto = fotosFrei === true && !!projekt.bild;
  return (
    <article
      className={cn(
        "group relative isolate flex h-full flex-col justify-end overflow-hidden rounded-3xl bg-navy-950 text-white shadow-[0_18px_40px_-24px_rgba(15,23,42,0.45)] ring-1 ring-ink-900/5",
        mitFoto ? "min-h-[300px] sm:min-h-[340px]" : "min-h-[176px] sm:min-h-[200px]"
      )}
    >
      <div aria-hidden="true" className="ov-grid-bg absolute inset-0 -z-30 bg-gradient-to-br from-navy-900 to-navy-950" />
      {mitFoto && (
        <>
          <Image
            src={projekt.bild}
            alt={`Photovoltaikanlage eines Betriebs (${titel})${leistung ? ` mit ${leistung}` : ""}`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="-z-20 object-cover"
          />
          <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-navy-950/95 via-navy-950/55 to-navy-950/10" />
        </>
      )}
      <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-3 p-4 md:p-5">
        {leistung ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[13.5px] font-bold text-ink-900 shadow-lg">
            <Zap aria-hidden="true" className="h-3.5 w-3.5 fill-sun-400 text-sun-500" />
            <span className="ov-num">{leistung}</span>
          </span>
        ) : (
          <span />
        )}
        <span className="rounded-full bg-navy-950/60 px-3 py-1.5 text-[11.5px] font-semibold uppercase tracking-wider text-white ring-1 ring-white/15 backdrop-blur-md">Referenz</span>
      </div>
      <div className={cn("relative p-5 md:p-6", !mitFoto && "pt-16 md:pt-[4.5rem]")}>
        {ort && (
          <p className="inline-flex items-center gap-1 text-[13px] font-medium text-white/70">
            <MapPin aria-hidden="true" className="h-3.5 w-3.5 text-ov-300" />
            {ort}
          </p>
        )}
        <H className="mt-1.5 font-display text-[20px] font-extrabold leading-tight tracking-tight text-white">{titel}</H>
        <p className="mt-1.5 text-[13px] text-white/60">Firmenname auf Wunsch des Kunden erst nach Freigabe.</p>
      </div>
    </article>
  );
}

/**
 * @param {{ zielgruppe: string, max?: number, titel?: string, className?: string, headingAs?: string }} props
 */
export default async function BranchenReferenzen({ zielgruppe, max = 6, titel = STANDARD_TITEL, className, headingAs = "h2" }) {
  const treffer = await ladeBranchenReferenzen(zielgruppe, max);
  if (!treffer.length) return null;

  const H = headingAs;
  const Sub = headingAs === "h2" ? "h3" : "h4";
  // Größte Anlage nur ab MIN_FUER_GROESSTE Referenzen; ohne Namensfreigabe gerundet (wie auf der Karte).
  const groessteTreffer = treffer.length >= MIN_FUER_GROESSTE ? treffer.reduce((a, t) => (t.projekt.kwp != null && (!a || t.projekt.kwp > a.projekt.kwp) ? t : a), null) : null;
  const groesste = groessteTreffer ? (groessteTreffer.nameFrei ? `${fmtKwp(groessteTreffer.projekt.kwp)}\u00a0kWp` : leistungOhneFreigabe(groessteTreffer.projekt.kwp)) : null;
  const logos = treffer.filter((t) => t.kunde?.freigabe?.logo === true && t.kunde?.logoUrl && t.nameFrei);
  const zitate = treffer.filter((t) => t.kunde?.freigabe?.zitat === true && t.kunde?.zitat?.text);

  return (
    <section aria-labelledby="branchen-referenzen-titel" className={cn("relative bg-sand-50 py-16 text-ink-900 md:py-24", className)}>
      <div className="ov-container relative">
        <div className="max-w-3xl">
          <Eyebrow className="mb-4">Referenzen · {ZIELGRUPPEN_LABEL[zielgruppe] || "Betriebe"}</Eyebrow>
          <H id="branchen-referenzen-titel" className="ov-h2 text-ink-900">
            {titel}
          </H>
        </div>

        {/* Kennzahlen mit Hinweis und Stand */}
        <dl className="mt-8 flex flex-wrap items-end gap-x-10 gap-y-4 border-y border-ink-200/70 py-5">
          {KENNZAHLEN.map((k) => (
            <div key={k.id} className="min-w-[9rem]">
              <dt className="text-[12.5px] font-semibold uppercase tracking-[0.12em] text-ink-500">{k.label}</dt>
              <dd className="ov-num mt-1 font-display text-[28px] font-extrabold leading-none tracking-tight text-navy-950 md:text-[32px]">
                {kennzahlText(k)}
              </dd>
            </div>
          ))}
          {groesste != null && (
            <div className="min-w-[9rem]">
              <dt className="text-[12.5px] font-semibold uppercase tracking-[0.12em] text-ink-500">Die größte dieser Anlagen</dt>
              <dd className="ov-num mt-1 font-display text-[28px] font-extrabold leading-none tracking-tight text-navy-950 md:text-[32px]">{groesste}</dd>
            </div>
          )}
          <div className="basis-full text-[13px] text-ink-500">{hinweisStand()}</div>
        </dl>

        <ul className="mt-8 grid list-none gap-5 p-0 sm:grid-cols-2 lg:grid-cols-3">
          {treffer.map(({ projekt, kunde, schluessel, nameFrei: frei }) => (
            <li key={projekt.slug} className="h-full">
              {frei ? <ProjektKarte projekt={projekt} headingAs={Sub} /> : <NeutraleKarte projekt={projekt} schluessel={schluessel} kundeOrt={kunde?.ort} fotosFrei={kunde?.freigabe?.fotos === true} headingAs={Sub} />}
            </li>
          ))}
        </ul>

        {logos.length > 0 && (
          <ul className="mt-8 flex list-none flex-wrap items-center gap-6 p-0" aria-label="Logos freigegebener Kunden">
            {logos.map(({ projekt, kunde }) => (
              <li key={`logo-${projekt.slug}`}>
                <Image src={kunde.logoUrl} alt={`Logo ${kunde.firma || projekt.titel}`} width={140} height={48} className="h-10 w-auto object-contain" />
              </li>
            ))}
          </ul>
        )}

        {zitate.length > 0 && (
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {zitate.map(({ projekt, kunde, nameFrei: frei }) => (
              <figure key={`zitat-${projekt.slug}`} className="rounded-3xl bg-white p-6 ring-1 ring-ink-200/70">
                <blockquote className="text-[16px] leading-relaxed text-ink-700">„{kunde.zitat.text}“</blockquote>
                <figcaption className="mt-3 text-[13.5px] font-semibold text-ink-600">
                  {[kunde.zitat.person, frei ? kunde.firma || projekt.titel : brancheOhneKlammer(kunde.branche)].filter(Boolean).join(" · ")}
                </figcaption>
              </figure>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
