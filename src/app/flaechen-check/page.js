// src/app/flaechen-check/page.js – Flächen-Check für Grundeigentümer (Masterplan #10)
//
// Werkzeug: Eignungsampel, belegte Pachtspanne und Widmungshinweis je Bundesland
// für mögliche Freiflächen-PV-Flächen. Logik in src/lib/flaeche (node-getestet),
// Rechtslage je Land unter /freiflaechen-photovoltaik/widmung/<bundesland>.

import Link from "next/link";
import { Cable, Calculator, ClipboardCheck, LandPlot, Mountain, Scale } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import Faq from "@/components/ui/Faq";
import CtaBand from "@/components/ui/CtaBand";
import Querverweise from "@/components/Reusable/Querverweise";
import CountUp from "@/components/ui/CountUp";
import Reveal from "@/components/ui/Reveal";
import Button from "@/components/ui/Button";
import { Quellen } from "@/components/Forderungen/Shared/Bausteine";
import { Bildnachweis } from "@/components/Loesungen/Bausteine";
import { nachweise } from "@/components/Loesungen/A/bildnachweise";
import FlaechenCheck from "@/components/FlaechenCheck/FlaechenCheck";
import PachtCheckliste from "@/components/FlaechenCheck/PachtCheckliste";
import { LaenderKacheln } from "@/components/FlaechenCheck/Widmung";
import { AMPEL, MIN_KWP, PACHT_BELEG, PACHT_QUELLEN } from "@/lib/flaeche/check";
import { CHECKLISTE, LK_OOE_CHECKLISTE } from "@/lib/flaeche/checkliste";
import { LAENDER, STAND } from "@/lib/flaeche/laender";
import { PACHT } from "@/lib/rechner/pacht";
import { zahl } from "@/lib/flaeche/format";
import { BASE_URL } from "@/lib/site";

const PFAD = "/flaechen-check";
const SEITE_URL = `${BASE_URL}${PFAD}`;
const TITEL = "Fläche für Photovoltaik verpachten: Pacht-Check | Ökovolt";
const BESCHREIBUNG =
  "Fläche für einen Solarpark verpachten? Ampel für Widmung, Größe, Netz und Hang, belegte Pachtspanne der Landwirtschaftskammer und Checkliste zum Pachtvertrag.";
const HERO_BILD = "/Images/AT/loesungen/freiflaeche-spitalberg-kaernten.jpg";

export const metadata = {
  title: TITEL,
  description: BESCHREIBUNG,
  keywords: ["Fläche für Solarpark verpachten", "Freiflächen PV Pacht pro Hektar", "Solarpark Pachtvertrag Checkliste", "PV Freifläche Eignung prüfen", "Photovoltaik Pacht Landwirtschaftskammer", "Freiflächen Photovoltaik Widmung"],
  alternates: { canonical: SEITE_URL },
  openGraph: {
    type: "website",
    locale: "de_AT",
    url: SEITE_URL,
    siteName: "Ökovolt Österreich",
    title: TITEL,
    description: BESCHREIBUNG,
    images: [{ url: `${BASE_URL}${HERO_BILD}`, width: 1920, height: 1080, alt: "Photovoltaik-Freiflächenanlage am Spitalberg in Kärnten" }],
  },
  twitter: { card: "summary_large_image", title: TITEL, description: BESCHREIBUNG, images: [`${BASE_URL}${HERO_BILD}`] },
};

const FAQ = [
  {
    q: "Wie viel Pacht zahlt ein Solarpark-Betreiber je Hektar?",
    a: `Laut Landwirtschaftskammern Steiermark und Kärnten lagen die gebotenen Pachtzahlungen für PV-Freiflächen im Durchschnitt zwischen ${zahl(PACHT_BELEG.pvVon)} und ${zahl(PACHT_BELEG.pvBis)} Euro je Hektar und Jahr (Stand ${PACHT_BELEG.pvJahr}). Das ist ein Mehrfaches der landwirtschaftlichen Pacht, die Statistik Austria für 2024 mit ${zahl(PACHT_BELEG.ackerland)} €/ha für Ackerland und ${zahl(PACHT_BELEG.dauergruenland)} €/ha für Dauergrünland ausweist. Aktuelle Angebote hängen von Lage, Netzanschluss, Förderung und Vertrag ab.`,
  },
  {
    q: "Welche Flächen eignen sich für einen Solarpark?",
    a: "Gut geeignet sind ebene oder nach Süden geneigte Flächen ab etwa einem halben Hektar mit kurzem Weg zum Mittelspannungsnetz, außerhalb von Wald, Schutz- und Gefahrenzonen. Vorbelastete Flächen wie Deponien, Schottergruben oder Streifen neben Autobahn und Bahn werden von mehreren Ländern bevorzugt. Entscheidend sind am Ende Widmung und freie Netzkapazität.",
  },
  {
    q: "Brauche ich für einen Solarpark auf meinem Grund eine Umwidmung?",
    a: "In praktisch allen Bundesländern ja. Die Schwellen sind sehr unterschiedlich: in Oberösterreich ab 50 m² Modulfläche, im Burgenland ab 35 m² und nur in Eignungszonen, in Niederösterreich ab 50 kW und über 2 ha nur in Landeszonen. Die Details je Land zeigen unsere Seiten zur Widmung.",
  },
  {
    q: "Wie aussagekräftig ist die Ampel?",
    a: "Sie ist eine Ersteinschätzung. Die Widmungsregeln stammen aus dem konsolidierten Landesrecht im RIS; Netzentfernung und Hangneigung bewerten wir mit Faustregeln aus der Projektpraxis. Ob ein Park tatsächlich gebaut werden kann, entscheiden Gemeinde, Land und Netzbetreiber – und oft Naturschutzgutachten.",
  },
  {
    q: "Was muss im Pachtvertrag stehen?",
    a: "Mindestens Laufzeit samt Verlängerungsoptionen, Pachtzins und Wertsicherung, Zahlungsbeginn, Ausstiegsrechte, rückstandsloser Rückbau mit Sicherheit wie einer Bankgarantie, Dienstbarkeiten im Grundbuch, Pflege und Haftung. Klären Sie außerdem die steuerlichen Folgen, etwa für eine spätere Hofübergabe. Unsere Checkliste hilft beim Durchgehen – sie ersetzt keine Beratung.",
  },
  {
    q: "Verliere ich durch die Verpachtung Förderungen?",
    a: "Das hängt von Ihrem Betrieb und der Bauart der Anlage ab. Klären Sie Auswirkungen auf Agrarförderungen und Steuer vor der Unterschrift mit Ihrer Landwirtschaftskammer. Für den Betreiber gilt: Auf Agrar- und Grünland kürzt das EAG Investitionszuschuss bzw. Marktprämie um 25 %, außer bei Agri-PV.",
  },
];

const METHODIK = [
  { icon: Scale, titel: "Widmung & Landesrecht", text: "Schwellen, Zonen und Obergrenzen des jeweiligen Landes – aus dem konsolidierten Landesrecht im RIS, Stand " + STAND.label + "." },
  { icon: LandPlot, titel: "Flächengröße", text: `Richtwert ${zahl(PACHT.konzepte[0].kwpProHa)} kWp je Hektar (eNu). Wir planen Freiflächen ab rund ${zahl(MIN_KWP)} kWp – darunter tragen Netzanschluss, Zaun und Genehmigung schwer.` },
  { icon: Cable, titel: "Weg zum Netz", text: "Trassenlänge im Verhältnis zur Parkgröße – als Faustregel für die Ersteinschätzung. Freie Kapazität bestätigt nur der Netzbetreiber." },
  { icon: Mountain, titel: "Hang & Ausrichtung", text: "Eben und Süd sind ideal, Ost/West gut, Nordhänge schwierig; steile Hänge verteuern den Bau. Faustregel, keine Norm." },
];

export default async function FlaechenCheckPage({ searchParams }) {
  const sp = await searchParams;
  const startLand = typeof sp?.land === "string" && LAENDER.some((l) => l.slug === sp.land) ? sp.land : "oberoesterreich";

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id": `${SEITE_URL}/#app`,
        name: "Ökovolt Flächen-Check für Grundeigentümer",
        url: SEITE_URL,
        description: "Ersteinschätzung, ob sich eine Grundfläche in Österreich für eine Photovoltaik-Freiflächenanlage eignet: Eignungsampel aus Widmung je Bundesland, Größe, Netzentfernung und Gelände, dazu eine belegte Pachtspanne und eine Checkliste zum Pachtvertrag.",
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        browserRequirements: "Requires JavaScript",
        inLanguage: "de-AT",
        isAccessibleForFree: true,
        featureList: ["Eignungsampel", "Widmungsregeln aller neun Bundesländer", "Pachtspanne laut Landwirtschaftskammer", "Checkliste Pachtvertrag"],
        offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
        publisher: { "@id": `${BASE_URL}/#organization` },
      },
      {
        "@type": "WebPage",
        "@id": `${SEITE_URL}/#webpage`,
        url: SEITE_URL,
        name: TITEL,
        description: BESCHREIBUNG,
        inLanguage: "de-AT",
        isPartOf: { "@id": `${BASE_URL}/#website` },
        publisher: { "@id": `${BASE_URL}/#organization` },
        dateModified: STAND.iso,
        mainEntity: { "@id": `${SEITE_URL}/#app` },
      },
    ],
  };

  const quellen = [
    PACHT_QUELLEN.lkSteiermark,
    PACHT_QUELLEN.lkKaernten,
    PACHT_QUELLEN.lkSteuer,
    PACHT_QUELLEN.statistik,
    LK_OOE_CHECKLISTE,
    { label: "eNu – Agri-PV in Niederösterreich (Leistung je Hektar Freifläche)", url: "https://www.energie-noe.at/agri-pv" },
    ...LAENDER.flatMap((l) => l.quellen.slice(0, 1)),
  ];

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <PageHero
        variant="immersive"
        className="[&>div.ov-container]:pb-28 md:[&>div.ov-container]:pb-36"
        breadcrumbs={[{ name: "Freiflächen-Photovoltaik", href: "/freiflaechen-photovoltaik" }, { name: "Flächen-Check" }]}
        eyebrow="Flächen-Check für Grundeigentümer"
        title={
          <>
            Fläche für Photovoltaik verpachten – <span className="ov-text-gradient-light">erst prüfen, dann unterschreiben</span>
          </>
        }
        lead={<><span className="block font-display text-[1.15em] font-bold leading-snug text-white">Taugt Ihre Fläche für einen Solarpark?</span><span className="mt-3 block">Widmung, Größe, Netz und Gelände in einer Ampel – dazu die belegte Pachtspanne der Landwirtschaftskammer und eine Checkliste, bevor Sie einen Pachtvertrag unterschreiben.</span></>}
        image={{ src: HERO_BILD, alt: "Photovoltaik-Freiflächenanlage auf einer Wiese am Spitalberg in Kärnten" }}
        points={["Alle 9 Bundesländer", "Rechtsstand " + STAND.label, "Pacht nur mit Quelle", "Kostenlos, ohne Anmeldung"]}
      />

      {/* Werkzeug überlappt den Hero – sofort sichtbar */}
      <section id="check" aria-label="Flächen-Check" className="relative z-10 -mt-20 scroll-mt-24 bg-transparent pb-10 md:-mt-28 md:pb-16">
        <div className="ov-container">
          <FlaechenCheck startLand={startLand} />
        </div>
      </section>

      <Section id="methodik" tone="white" space="md" className="scroll-mt-24">
        <SectionHeading
          eyebrow="So bewerten wir"
          title="Vier Prüfpunkte, eine ehrliche Ampel."
          lead={`Jeder Punkt wird mit „passt“, „prüfen“, „erschwert“ oder „Ausschluss“ bewertet. Ein Ausschluss färbt die Ampel rot, höchstens ein „prüfen“ lässt sie grün – alles dazwischen ist gelb.`}
        />
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {METHODIK.map(({ icon: Icon, titel, text }, i) => (
            <Reveal as="li" key={titel} delay={i * 80} className="flex">
              <div className="ov-card-hover flex w-full flex-col rounded-3xl bg-sand-50 p-6 ring-1 ring-ink-200/60">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-ov-600 ring-1 ring-ink-200">
                  <Icon aria-hidden="true" className="h-5 w-5" />
                </span>
                <h3 className="mt-5 font-display text-[18px] font-bold text-ink-900">{titel}</h3>
                <p className="mt-2 text-[14.5px] leading-relaxed text-ink-600">{text}</p>
              </div>
            </Reveal>
          ))}
        </ul>
        <ul className="mt-8 grid gap-3 md:grid-cols-3">
          {[
            ["gruen", "bg-ov-500"],
            ["gelb", "bg-sun-400"],
            ["rot", "bg-red-500"],
          ].map(([id, farbe]) => (
            <li key={id} className="flex gap-3 rounded-2xl bg-white p-4 ring-1 ring-ink-200/70">
              <span aria-hidden="true" className={`mt-1 h-4 w-4 shrink-0 rounded-full ${farbe}`} />
              <p className="text-[14px] leading-relaxed text-ink-600">
                <strong className="text-ink-900">{AMPEL[id].label}:</strong> {AMPEL[id].text}
              </p>
            </li>
          ))}
        </ul>
      </Section>

      {/* Dunkle Kontrast-Sektion: Pacht */}
      <section className="ov-noise relative overflow-hidden bg-navy-950 py-20 text-white md:py-28">
        <div aria-hidden="true" className="ov-grid-bg pointer-events-none absolute inset-0" />
        <div aria-hidden="true" className="pointer-events-none absolute -left-40 top-1/4 h-[460px] w-[460px] rounded-full bg-ov-500/20 blur-[120px]" />
        <div aria-hidden="true" className="pointer-events-none absolute -right-32 -top-24 h-[420px] w-[420px] rounded-full bg-sun-400/10 blur-[120px]" />
        <div className="ov-container relative">
          <SectionHeading
            dark
            eyebrow="Pacht mit Quelle"
            title="Was eine PV-Fläche bringt – und was nicht in der Zeitung steht."
            lead="Wir nennen nur Spannen, die eine unabhängige Stelle veröffentlicht hat. Wo es keine gibt, schreiben wir „Richtwert – Quelle offen“ statt einer geschönten Zahl."
          />
          <dl className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { wert: <><CountUp value={PACHT_BELEG.pvVon} /> – <CountUp value={PACHT_BELEG.pvBis} /></>, einheit: "€ je ha und Jahr", text: `durchschnittlich gebotene PV-Pacht laut Landwirtschaftskammern Steiermark und Kärnten (${PACHT_BELEG.pvJahr})` },
              { wert: <CountUp value={PACHT_BELEG.ackerland} />, einheit: "€ je ha und Jahr", text: `landwirtschaftliche Pacht für Ackerland, Österreich ${PACHT_BELEG.agrarJahr} (Statistik Austria)` },
              { wert: <CountUp value={PACHT_BELEG.dauergruenland} />, einheit: "€ je ha und Jahr", text: `landwirtschaftliche Pacht für Dauergrünland, Österreich ${PACHT_BELEG.agrarJahr} (Statistik Austria)` },
              { wert: <>− <CountUp value={25} /> %</>, einheit: "EAG-Abschlag", text: "auf Investitionszuschuss und Marktprämie auf Agrar- und Grünland, außer Agri-PV und bestimmte vorbelastete Flächen" },
            ].map((k, i) => (
              <Reveal key={k.einheit + i} delay={i * 80} className="ov-glass flex flex-col rounded-3xl p-6">
                <dt className="sr-only">{k.text}</dt>
                <dd className="font-display text-[clamp(1.8rem,1.4rem+1.2vw,2.5rem)] font-extrabold leading-none tracking-tight text-white">{k.wert}</dd>
                <dd className="mt-2 text-[13px] font-semibold uppercase tracking-[0.12em] text-ov-300">{k.einheit}</dd>
                <dd className="mt-3 text-[14px] leading-relaxed text-white/65">{k.text}</dd>
              </Reveal>
            ))}
          </dl>
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            <div className="rounded-3xl bg-white/5 p-6 ring-1 ring-white/10">
              <p className="font-display text-[18px] font-bold">Steuer und Hofübergabe</p>
              <p className="mt-2 text-[15px] leading-relaxed text-white/70">
                Ob die Fläche land- und forstwirtschaftliches Vermögen bleibt oder zu Grundvermögen wird, hängt laut Landwirtschaftskammer von Modulhöhe, Reihenabstand und Nutzung ab. Als Grundvermögen kann sie die Grunderwerbsteuer bei einer Hofübergabe deutlich erhöhen – ein Vertrag sollte daher nicht überstürzt unterschrieben werden.
              </p>
            </div>
            <div className="rounded-3xl bg-white/5 p-6 ring-1 ring-white/10">
              <p className="font-display text-[18px] font-bold">Mehr als der Betrag</p>
              <p className="mt-2 text-[15px] leading-relaxed text-white/70">
                Die Landwirtschaftskammer Steiermark warnt vor Verträgen mit Bindung bis zu 50 Jahren und rät, den Rückbau schon bei Vertragsbeginn mit Bankgarantie oder Patronatserklärung abzusichern. Laufzeit, Ausstiegsrechte und Sicherheiten wiegen oft schwerer als ein paar hundert Euro mehr je Hektar.
              </p>
            </div>
          </div>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Button href="/rechner/freiflaeche-pacht" size="lg" icon={Calculator}>
              Pacht über die Laufzeit rechnen
            </Button>
            <Button href="#checkliste" size="lg" variant="outlineLight" icon={ClipboardCheck}>
              Zur Checkliste
            </Button>
          </div>
        </div>
      </section>

      <Section id="checkliste" tone="sand" space="lg" className="scroll-mt-24">
        <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:gap-14">
          <SectionHeading
            eyebrow="Checkliste Pachtvertrag"
            title={`${CHECKLISTE.length} Fragen, bevor Sie unterschreiben.`}
            lead={
              <>
                Gehen Sie den Vertragsentwurf Punkt für Punkt durch und haken Sie ab, was geklärt ist. Offene Punkte besprechen Sie mit Ihrer Landwirtschaftskammer – die Landwirtschaftskammer Oberösterreich bietet dazu eine{" "}
                <a href={LK_OOE_CHECKLISTE.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-ov-700 underline decoration-ov-300 underline-offset-2">
                  eigene Checkliste<span className="sr-only"> (externer Link, neues Fenster)</span>
                </a>
                .
              </>
            }
          />
          <PachtCheckliste />
        </div>
      </Section>

      <Section tone="white" space="lg">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            eyebrow="Widmung je Bundesland"
            title="Neun Länder, neun Regeln."
            lead={`Von 35 m² im Burgenland bis zu 36 Vorrangzonen in der Steiermark: Die Rechtslage je Land mit Normen, Stand und offenen Punkten – geprüft im RIS am ${STAND.label}.`}
          />
          <Link href="/freiflaechen-photovoltaik/widmung" className="shrink-0 text-[15px] font-semibold text-ov-700 underline decoration-ov-300 underline-offset-2 hover:text-ov-800">
            Alle Länder im Vergleich
          </Link>
        </div>
        <LaenderKacheln className="mt-10" />
      </Section>

      <Section tone="sand" space="md">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <SectionHeading
            eyebrow="Häufige Fragen"
            title="Fläche verpachten – kurz beantwortet"
            lead={
              <>
                Mehr zu Ertrag und Pacht über die Laufzeit im{" "}
                <Link href="/rechner/freiflaeche-pacht" className="font-semibold text-ov-700 underline decoration-ov-300 underline-offset-2">
                  Freiflächen- &amp; Pacht-Rechner
                </Link>
                , zu Planung und Bau auf unserer Seite{" "}
                <Link href="/freiflaechen-photovoltaik" className="font-semibold text-ov-700 underline decoration-ov-300 underline-offset-2">
                  Freiflächen-Photovoltaik
                </Link>
                .
              </>
            }
          />
          <Faq items={FAQ} />
        </div>
        <Quellen
          klappbar
          className="mt-12"
          stand={STAND.label}
          quellen={quellen}
          hinweis="Pachtangaben der Landwirtschaftskammern beschreiben das Angebotsniveau 2022 und sind kein Marktpreisspiegel. Rechtslage: konsolidiertes Landesrecht im RIS (Open Government Data, CC BY 4.0). Keine Rechts- oder Steuerberatung."
        />
      </Section>

      <Querverweise pfad="/flaechen-check" />
      <CtaBand
        eyebrow="Unverbindlich & unabhängig vom Betreiber"
        title="Ihre Fläche, ehrlich geprüft – bevor Sie unterschreiben."
        text="Wir prüfen Widmungschancen, Netzanschluss und Ertrag Ihrer Fläche und zeigen, ob Verpachtung, Beteiligung oder Eigenbetrieb passt – in ganz Österreich."
        primary={{ label: "Fläche prüfen lassen", href: "/kontakt" }}
        secondary={{ label: "Pacht-Rechner", href: "/rechner/freiflaeche-pacht" }}
      />
      <Bildnachweis items={nachweise("spitalberg")} />
    </div>
  );
}
