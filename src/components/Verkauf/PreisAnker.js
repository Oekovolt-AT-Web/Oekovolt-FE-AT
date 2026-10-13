// src/components/Verkauf/PreisAnker.js
//
// Preisanker je Anlagenklasse (Welle A, Paket A03). Zeigt nur Preisbänder aus
// src/data/preisbaender.js mit freigegeben === true und vollständigen Werten – sonst null.
// Hauptgröße: Preis je erzeugter kWh über 25 Jahre (aus €/kWp und Ertrags-Richtwert),
// darunter die Bandbreite in €/kWp netto. Immer mit dem Hinweis „Bandbreite, kein Angebot“.
// rahmen (true oder Ton von <Section>): eigener Seitenabschnitt mit ov-container – für Seiten ohne umgebende <Section>.

import { ERTRAG_JE_KWP, LAUFZEIT_JAHRE, PREISBAENDER, freigegebenePreisbaender, preisJeKwhCt } from "@/data/preisbaender";
import { zahlText } from "@/data/kennzahlen";
import { datumText } from "@/data/fristen";
import { cn } from "@/components/ui/cn";
import Section from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/SectionHeading";

const ct = (v) => (v == null ? "–" : `${String(v).replace(".", ",")} ct`);

export default function PreisAnker({ baender = PREISBAENDER, titel = "Was eine Anlage kostet – je erzeugter Kilowattstunde", rahmen, className, headingAs: H = "h2" }) {
  const liste = freigegebenePreisbaender(baender);
  if (!liste.length) return null;
  const stand = liste.map((b) => b.stand).filter(Boolean).sort().at(-1);

  const inhalt = (
    <section aria-labelledby="preisanker-titel" className={cn("relative", className)}>
      <div className="max-w-3xl">
        <Eyebrow className="mb-4">Preisanker</Eyebrow>
        <H id="preisanker-titel" className="ov-h2 text-ink-900">
          {titel}
        </H>
        <p className="ov-lead mt-5 text-ink-600">
          Rechnet man die Investition auf die Erzeugung von {LAUFZEIT_JAHRE} Jahren um ({zahlText(ERTRAG_JE_KWP)} kWh je kWp und Jahr, Richtwert), steht der Preis je Kilowattstunde dem Netzbezug gegenüber. Bandbreite,
          kein Angebot.
        </p>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {liste.map((b) => {
          const von = preisJeKwhCt(b.bisEurKwp);
          const bis = preisJeKwhCt(b.vonEurKwp);
          return (
            <div key={b.klasse} className="rounded-3xl bg-white p-6 ring-1 ring-ink-200/70">
              <p className="text-[12.5px] font-semibold uppercase tracking-[0.12em] text-ink-500">{b.klasse}</p>
              <p className="ov-num mt-2 font-display text-[28px] font-extrabold leading-none tracking-tight text-navy-950">
                {ct(von)}
                <span className="text-ink-500"> – </span>
                {ct(bis)}
              </p>
              <p className="mt-1 text-[13px] text-ink-600">je erzeugter kWh über {LAUFZEIT_JAHRE} Jahre</p>
              <p className="ov-num mt-3 text-[14px] text-ink-700">
                {zahlText(Math.round(b.vonEurKwp))}–{zahlText(Math.round(b.bisEurKwp))} € je kWp netto
              </p>
            </div>
          );
        })}
      </div>
      <p className="mt-4 text-[13px] text-ink-500">
        Bandbreite, kein Angebot. Ohne Betriebskosten, Degradation und Finanzierung; der Preis Ihrer Anlage hängt von Dach, Netzanschluss und Technik ab.{stand ? ` Stand ${datumText(stand)}.` : ""}
      </p>
    </section>
  );

  if (!rahmen) return inhalt;
  return (
    <Section as="div" tone={typeof rahmen === "string" ? rahmen : "white"} space="md">
      {inhalt}
    </Section>
  );
}
