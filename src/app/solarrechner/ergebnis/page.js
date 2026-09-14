// Geteiltes Solarrechner-Ergebnis: Vorschaubild für Messenger/Netzwerke und der Rechner
// mit denselben Eingaben – zum Nachrechnen mit eigenen Werten. Nicht indexieren.

import { Calculator } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import Reveal from "@/components/ui/Reveal";
import CtaBand from "@/components/ui/CtaBand";
import Solarrechner from "@/components/Solarrechner/Rechner";
import { berechne } from "@/lib/solarrechner";
import { alsBerechnung, eingabenAusParams, teilenQuery } from "@/lib/rechnerTeilen";

const BASE_URL = "https://www.oekovolt.de";

const de = (n, d = 0) => n.toLocaleString("de-DE", { minimumFractionDigits: d, maximumFractionDigits: d });

export async function generateMetadata({ searchParams }) {
  const e = eingabenAusParams(await searchParams);
  const r = berechne(alsBerechnung(e));
  const titel = `${de(e.kwp, e.kwp % 1 ? 1 : 0)} kWp Solaranlage: ${de(Math.round(r.nutzenProJahr))} € Vorteil im 1. Jahr`;
  const beschreibung = `${Math.round(r.autarkie * 100)} % Autarkie${r.amortisationJahre != null ? `, Amortisation nach ${de(r.amortisationJahre, 1)} Jahren` : ""} – mit dem Ökovolt-Solarrechner berechnet. Was bringt Ihr Dach?`;
  const bild = `${BASE_URL}/solarrechner/ergebnis/bild?${teilenQuery(e)}`;
  return {
    title: `${titel} | Ökovolt`,
    description: beschreibung,
    robots: { index: false, follow: true },
    alternates: { canonical: `${BASE_URL}/solarrechner` },
    openGraph: { type: "website", locale: "de_DE", siteName: "Ökovolt Deutschland", title: titel, description: beschreibung, url: `${BASE_URL}/solarrechner/ergebnis?${teilenQuery(e)}`, images: [{ url: bild, width: 1200, height: 630, alt: titel }] },
    twitter: { card: "summary_large_image", title: titel, description: beschreibung, images: [bild] },
  };
}

export default async function GeteiltesErgebnis({ searchParams }) {
  const e = eingabenAusParams(await searchParams);

  return (
    <>
      <PageHero
        variant="dark"
        breadcrumbs={[{ name: "Rechner & Tools", href: "/rechner" }, { name: "Solarrechner", href: "/solarrechner" }, { name: "Geteiltes Ergebnis" }]}
        eyebrow="Mit Ihnen geteilt"
        title={
          <>
            Diese Rechnung wurde mit Ihnen geteilt. <span className="ov-text-gradient-light">Und Ihr Dach?</span>
          </>
        }
        lead="Unten sehen Sie die geteilten Werte im Solarrechner. Stellen Sie einfach Ihre eigene Anlagengröße, Ihren Verbrauch und Ihr Dach ein – das Ergebnis aktualisiert sich sofort."
      >
        <Reveal dir="scale" className="relative mt-12 md:mt-14">
          <div aria-hidden="true" className="absolute -inset-2 rounded-[2.4rem] bg-gradient-to-br from-white/15 via-white/5 to-ov-400/20 blur-[1px] md:-inset-3" />
          <div className="ov-glass relative rounded-[2.25rem] p-1.5 md:p-2.5">
            <Solarrechner start={e} />
          </div>
        </Reveal>
      </PageHero>

      <CtaBand
        title="Aus der Schätzung wird ein Angebot."
        text="Wir übernehmen Ihre Werte, prüfen Dach, Zählerschrank und Verschattung und rechnen verbindlich nach."
        primary={{ label: "Angebot anfragen", href: "/angebot" }}
        secondary={{ label: "Mehr zum Solarrechner", href: "/solarrechner", icon: Calculator }}
      />
    </>
  );
}
