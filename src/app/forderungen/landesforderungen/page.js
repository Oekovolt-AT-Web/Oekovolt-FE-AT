// src/app/forderungen/landesforderungen/page.js
//
// Übersicht der Landesförderungen aller neun Bundesländer. Statische Daten
// aus @/data/bundeslaender – keine Backend-Abfrage.

import Link from "next/link";
import { ArrowRight, BadgeEuro, CalendarClock, Landmark, Map, Percent, Receipt, Sun } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import FeatureGrid from "@/components/ui/FeatureGrid";
import Faq from "@/components/ui/Faq";
import CtaBand from "@/components/ui/CtaBand";
import Reveal from "@/components/ui/Reveal";
import Querverweise from "@/components/Reusable/Querverweise";
import SolarrechnerTeaser from "@/components/Solarrechner/Teaser";
import Foerderkarte from "@/components/Forderungen/Landes/Foerderkarte";
import { Hinweis, Kennzahlen, Quellen, StandPille, Tabelle } from "@/components/Forderungen/Shared/Bausteine";
import { EAG_IZ, STEUER } from "@/components/Forderungen/Shared/bund";
import { alleBundeslaender, FOERDERARTEN, STAND } from "@/data/bundeslaender";
import { BASE_URL } from "@/lib/site";
import { hreflangLanguages } from "@/lib/hreflang";

const PAGE_URL = `${BASE_URL}/forderungen/landesforderungen`;
const TITLE = "PV-Förderung 2026 in allen 9 Bundesländern | Ökovolt";
const DESCRIPTION = "Photovoltaik-Förderung 2026 in allen neun Bundesländern: Landesprogramme für Betriebe, Landwirtschaft, Gemeinden, Speicher und Energiegemeinschaften.";

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: ["Photovoltaik Förderung Bundesland", "Landesförderung Photovoltaik 2026", "PV Förderung Österreich", "Stromspeicher Förderung Bundesland", "PV Förderung Unternehmen Österreich", "Förderung Energiegemeinschaft"],
  alternates: { canonical: PAGE_URL, languages: hreflangLanguages(PAGE_URL) },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    url: PAGE_URL,
    siteName: "Ökovolt Österreich",
    locale: "de_AT",
    title: TITLE,
    description: DESCRIPTION,
    images: [{ url: `${BASE_URL}/og-image.jpg`, width: 1200, height: 630, alt: "Photovoltaik-Förderung in den neun Bundesländern" }],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, images: [`${BASE_URL}/og-image.jpg`] },
};

const FAQ = [
  {
    q: "Welches Bundesland fördert Photovoltaik 2026 am stärksten?",
    a: "Kärnten hat 2026 das breiteste Landesprogramm: Betriebe erhalten bis 200 €/kWp (max. 45 % der Kosten, max. 500.000 € je Standort), Gemeinden bis 45 % und Private 3.000 € für PV mit Speicher. Wien fördert gezielt mehrgeschoßige Wohnbauten, Tirol und das Burgenland Speicher. In Niederösterreich und Oberösterreich ist zum Prüfdatum kein eigenes PV-Landesprogramm offen.",
  },
  {
    q: "Kann ich Landesförderung und EAG-Investitionszuschuss kombinieren?",
    a: "In den Kategorien A, B und C sowie bei innovativer PV ja – bis zu den beihilferechtlichen Höchstgrenzen. In Kategorie D (über 100 bis 1.000 kWp) schließt die EAG-Investitionszuschüsseverordnung eine Kombination mit Landes- oder Gemeindeförderungen aus. Andere Förderungen sind der Abwicklungsstelle zu melden.",
  },
  {
    q: "Welche Förderung bekommen Unternehmen in jedem Bundesland?",
    a: `Bundesweit gelten der EAG-Investitionszuschuss (bis 1.000 kWp, nächster Call ${EAG_IZ.naechsterCall.zeitraum}), die EAG-Marktprämie für Anlagen über 10 kWp, der Investitionsfreibetrag von ${STEUER.ifb.satzOekoTemp} % für PV und Speicher (Anschaffung ${STEUER.ifb.zeitraum}) und die Befreiung von der Elektrizitätsabgabe für selbst verbrauchten Solarstrom. Landesprogramme kommen je nach Bundesland hinzu.`,
  },
  {
    q: "Muss ich die Landesförderung vor der Bestellung beantragen?",
    a: "Das ist je Programm verschieden. Wien verlangt den Antrag vor der Bestellung, Kärnten und Tirol erst nach Fertigstellung bzw. Inbetriebnahme, das Burgenland bis sechs Monate nach Rechnung. Beim EAG-Investitionszuschuss zählt die Inbetriebnahme: Der Antrag muss davor gestellt sein.",
  },
  {
    q: "Gibt es 2026 eine Förderung für Stromspeicher?",
    a: "Bundesweit ja: 150 €/kWh über den EAG-Investitionszuschuss, wenn der Speicher gemeinsam mit einer neuen oder erweiterten PV-Anlage errichtet wird (mind. 0,5 kWh je kWp, max. 50 kWh). Auf Landesebene fördern 2026 Tirol (Nachrüstung, 100 €/kWh, max. 1.000 €), das Burgenland (30 %, max. 2.000 €), Kärnten (Pauschalen für Private) und Salzburg (Pauschale für Betriebe). Die Speicher-Nachrüstung in Oberösterreich ist seit 01.07.2026 ausgeschöpft.",
  },
  {
    q: "Warum ändern sich Landesförderungen so häufig?",
    a: "Landesprogramme sind freiwillige Leistungen aus dem Landesbudget. Ist das Budget ausgeschöpft, endet die Antragsphase oft ohne Vorankündigung – 2026 etwa bei der Speicherförderung in Oberösterreich und dem Sanierungsbonus in der Steiermark. Wir weisen deshalb bei jedem Bundesland das Prüfdatum aus und kennzeichnen Werte, die nur über Sekundärquellen belegt sind.",
  },
];

export default function Page() {
  const liste = alleBundeslaender();
  const laender = liste.map((l) => ({
    key: l.key,
    name: l.name,
    kuerzel: l.kuerzel,
    foerderart: l.foerderart,
    ertrag: l.ertrag,
    kurz: l.kurz,
    unternehmen: l.ueberblick.unternehmen,
    speicher: l.ueberblick.speicher,
    eg: l.ueberblick.energiegemeinschaft,
    netz: l.netzbetreiber.map((n) => n.name).join(", "),
    stand: STAND.kurz,
    href: `/forderungen/landesforderungen/${l.slug}`,
  }));
  const programmeGesamt = liste.reduce((s, l) => s + l.programme.length, 0);
  const mitBetrieb = liste.filter((l) => l.programme.some((p) => p.zielgruppen.includes("unternehmen"))).length;

  const vergleich = liste.map((l) => ({
    land: <Link href={`/forderungen/landesforderungen/${l.slug}`} className="text-ink-900 underline decoration-ink-200 underline-offset-2 hover:text-ov-700">{l.name}</Link>,
    unternehmen: l.ueberblick.unternehmen,
    landwirtschaft: l.ueberblick.landwirtschaft,
    gemeinde: l.ueberblick.gemeinde,
    privat: l.ueberblick.privat,
    speicher: l.ueberblick.speicher,
  }));

  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${PAGE_URL}/#webpage`,
    url: PAGE_URL,
    name: "Photovoltaik-Förderung 2026 in den neun Bundesländern",
    description: DESCRIPTION,
    inLanguage: "de-AT",
    isPartOf: { "@id": `${BASE_URL}/#website` },
    about: { "@id": `${BASE_URL}/#organization` },
    dateModified: STAND.iso,
    mainEntity: {
      "@type": "ItemList",
      name: "Photovoltaik-Förderung nach Bundesland",
      numberOfItems: laender.length,
      itemListElement: laender.map((l, i) => ({ "@type": "ListItem", position: i + 1, name: `Förderung in ${l.name}`, url: `${BASE_URL}${l.href}` })),
    },
  };

  const quellen = [...liste.flatMap((l) => l.quellen.slice(0, 1)), ...EAG_IZ.quellen.slice(0, 2)];

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <PageHero
        breadcrumbs={[{ name: "Förderungen", href: "/forderungen/bundesfoerderung" }, { name: "Landesförderungen" }]}
        eyebrow={`Förderung nach Bundesland · Stand ${STAND.kurz}`}
        title={<>Photovoltaik-Förderung 2026 <span className="ov-text-gradient">in allen neun Bundesländern</span></>}
        lead="Welche Landesprogramme gibt es für Betriebe, Landwirtschaft, Gemeinden und Private – und was kommt vom Bund dazu? Alle neun Länder auf einer Karte, geprüft, datiert und mit Quellen."
        image={{ src: "/Images/Referenzen/Projekte-2.jpg", alt: "Photovoltaikanlage auf einem Gewerbedach in Österreich" }}
        points={["Alle 9 Länder mit Prüfdatum", "Programme nach Zielgruppe", "Solarertrag nach PVGIS", "Kombination mit EAG-Zuschuss"]}
        actions={[
          { label: "Förder-Check starten", href: "/foerdercheck" },
          { label: "Zur Förderkarte", href: "#foerderkarte", icon: Map },
        ]}
        badge={
          <div className="flex items-center gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-ov-500 text-white">
              <CalendarClock aria-hidden="true" className="h-6 w-6" />
            </span>
            <div>
              <p className="font-display text-[20px] font-extrabold leading-none text-ink-900">Geprüft</p>
              <p className="mt-1 text-[12.5px] leading-snug text-ink-500">Stand {STAND.label}</p>
            </div>
          </div>
        }
      />

      <Kennzahlen
        items={[
          { wert: "9", label: "Bundesländer geprüft" },
          { wert: String(programmeGesamt), label: "offene Landesprogramme erfasst" },
          { wert: String(mitBetrieb), label: "Länder mit Programmen für Unternehmen" },
          { wert: EAG_IZ.naechsterCall.zeitraum.replace(".2026", ""), label: "nächster EAG-Fördercall 2026" },
        ]}
      />

      {/* Karte */}
      <Section tone="sand" space="lg" id="foerderkarte" className="scroll-mt-24">
        <SectionHeading
          eyebrow="Interaktive Förderkarte"
          title={<>Wo es 2026 <span className="ov-text-gradient">zusätzlich Landesgeld</span> gibt</>}
          lead="Wählen Sie Ihr Bundesland. Die Karte zeigt, ob das Land breit, gezielt oder gar nicht zusätzlich zum Bund fördert – und mit einem Klick, wie viel Sonne Ihre Region liefert."
          align="center"
          className="mb-12"
        />
        <Reveal dir="scale">
          <Foerderkarte laender={laender} startKey="oberoesterreich" />
        </Reveal>
        <p className="mx-auto mt-6 max-w-3xl text-center text-[13.5px] leading-relaxed text-ink-500">
          Einordnung aus Sicht von Unternehmen, Landwirtschaft und Gemeinden. Landesprogramme können bei ausgeschöpftem Budget kurzfristig enden – maßgeblich ist immer die aktuelle Richtlinie der Förderstelle.
        </p>
      </Section>

      {/* Bund */}
      <Section tone="white" space="lg">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <SectionHeading
            eyebrow="Gilt in allen Bundesländern"
            title="Die Basis: vier Bundesinstrumente für jede Anlage"
            lead="Egal ob Bregenz oder Eisenstadt – diese Instrumente gelten überall und tragen bei Gewerbeanlagen den Großteil der Wirtschaftlichkeit. Landesprogramme kommen obendrauf."
          >
            <div className="mt-8 flex flex-col gap-3">
              <Link href="/forderungen/bundesfoerderung" className="group inline-flex items-center gap-2 text-[15px] font-semibold text-ov-700 hover:text-ov-800">
                Bundesförderung (EAG & KPC) im Detail
                <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link href="/forderungen/steuerlich" className="group inline-flex items-center gap-2 text-[15px] font-semibold text-ov-700 hover:text-ov-800">
                Steuervorteile: IFB, AfA, Elektrizitätsabgabe
                <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </SectionHeading>
          <FeatureGrid
            cols={2}
            items={[
              { icon: BadgeEuro, title: "EAG-Investitionszuschuss", text: `Kategorie A 150 €/kWp bis D max. 120 €/kWp, Speicher 150 €/kWh. Nächster Fördercall ${EAG_IZ.naechsterCall.zeitraum}.`, href: "/forderungen/bundesfoerderung", tag: "OeMAG" },
              { icon: Sun, title: "EAG-Marktprämie", text: "Für Anlagen über 10 kWp: gleitende Prämie über 20 Jahre per Ausschreibung, Höchstpreis 2026 7,77 ct/kWh.", href: "/forderungen/bundesfoerderung#marktpraemie", tag: "OeMAG" },
              { icon: Percent, title: `Investitionsfreibetrag ${STEUER.ifb.satzOekoTemp} %`, text: `Für PV, Speicher und Ladestationen bei Anschaffung ${STEUER.ifb.zeitraum} – zusätzlich zur Abschreibung.`, href: "/forderungen/steuerlich", tag: "Steuer" },
              { icon: Receipt, title: "Elektrizitätsabgabe frei", text: "Selbst erzeugter und verbrauchter Solarstrom ist unbegrenzt von der Elektrizitätsabgabe befreit (§ 2 Abs. 1 Z 4 ElAbgG).", href: "/forderungen/steuerlich", tag: "Steuer" },
            ]}
          />
        </div>
      </Section>

      {/* Alle Länder */}
      <Section tone="sand" space="lg" id="bundeslaender">
        <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading eyebrow="Alle neun Bundesländer" title="Förderung in Ihrem Bundesland im Detail" lead="Landesprogramme mit Status, Energiegemeinschaften, Bauordnung in Kurzform, Netzbetreiber und Solarertrag – je Land auf einer eigenen Seite." />
          <ul className="flex flex-wrap gap-2 md:justify-end" aria-label="Legende Förderart">
            {Object.entries(FOERDERARTEN).map(([k, v]) => (
              <li key={k} className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-[12.5px] font-medium text-ink-600 ring-1 ring-ink-200">
                <span aria-hidden="true" className={`h-2.5 w-2.5 rounded-full ${PUNKT[k]}`} />
                {v.label}
              </li>
            ))}
          </ul>
        </div>

        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {liste.map((l, i) => (
            <Reveal as="li" key={l.key} delay={(i % 3) * 60} className="flex">
              <Link href={`/forderungen/landesforderungen/${l.slug}`} className="group ov-card-hover flex w-full flex-col rounded-3xl bg-white p-6 ring-1 ring-ink-200/70 hover:ring-ov-200">
                <div className="flex items-start justify-between gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-ov-50 font-display text-[14px] font-extrabold text-ov-700 ring-1 ring-ov-100">{l.kuerzel}</span>
                  <span className={`rounded-full px-2.5 py-1 text-[11.5px] font-semibold ${CHIP[l.foerderart]}`}>{FOERDERARTEN[l.foerderart].kurz}</span>
                </div>
                <h3 className="mt-5 font-display text-[19px] font-bold leading-snug text-ink-900 transition-colors group-hover:text-ov-700">Förderung in {l.name}</h3>
                <p className="mt-2 text-[14.5px] leading-relaxed text-ink-600">{l.kurz}</p>
                <div className="mt-auto flex items-center justify-between gap-3 pt-5 text-[13px] text-ink-500">
                  <span className="inline-flex items-center gap-1.5">
                    <Sun aria-hidden="true" className="h-3.5 w-3.5 text-sun-500" />
                    <span className="ov-num">{l.ertrag[0].toLocaleString("de-AT")}–{l.ertrag[1].toLocaleString("de-AT")} kWh/kWp</span>
                  </span>
                  <ArrowRight aria-hidden="true" className="h-4 w-4 text-ov-600 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            </Reveal>
          ))}
        </ul>
      </Section>

      {/* Vergleichstabelle */}
      <Section tone="white" space="lg">
        <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            eyebrow="Vergleich"
            title="Landesförderung 2026 nach Zielgruppe"
            lead="Die Kurzfassung für Geschäftsführung und Einkauf: Was das Land zusätzlich zum Bund bietet – oder eben nicht."
          />
          <StandPille className="shrink-0 self-start md:self-auto">Stand {STAND.label}</StandPille>
        </div>
        <Reveal>
          <Tabelle
            dicht
            caption={`Landesförderungen für Photovoltaik nach Zielgruppe, Stand ${STAND.label}`}
            spalten={[
              { key: "land", label: "Bundesland", breite: "w-[13%]" },
              { key: "unternehmen", label: "Unternehmen" },
              { key: "landwirtschaft", label: "Landwirtschaft" },
              { key: "gemeinde", label: "Gemeinden" },
              { key: "privat", label: "Private" },
              { key: "speicher", label: "Speicher" },
            ]}
            zeilen={vergleich}
          />
        </Reveal>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <Hinweis titel="Kombination mit dem EAG-Zuschuss">
            In den Kategorien A–C ist eine Landesförderung zusätzlich erlaubt, in Kategorie D (über 100 kWp) nicht. Bei größeren Betriebsanlagen rechnen wir deshalb beide Wege durch: EAG-Zuschuss allein oder Landesförderung ohne EAG.
          </Hinweis>
          <Hinweis titel="Gemeindeförderungen nicht vergessen" ton="warn">
            Viele Gemeinden fördern zusätzlich – oft mit kleinem Budget und ohne große Ankündigung. Vorarlberg (Förderkompass) und Oberösterreich (Förder-Assistent) bieten Suchwerkzeuge; sonst hilft ein Anruf beim Gemeindeamt vor der Bestellung.
          </Hinweis>
        </div>
      </Section>

      {/* Weiterführend */}
      <Section tone="sand" space="lg">
        <SectionHeading eyebrow="Nach Vorhaben" title="Förderung passend zum Projekt" className="mb-10" />
        <FeatureGrid
          cols={3}
          items={[
            { icon: Landmark, title: "Gemeinden und öffentliche Hand", text: "PV auf Schule, Bauhof und Kläranlage – mit Vergabe, Energiegemeinschaft und Bürgerbeteiligung.", href: "/kommunen" },
            { icon: Sun, title: "Freiflächen-Photovoltaik", text: "Widmung, Zonenpläne und Abschlag im EAG-Zuschuss – was je Bundesland gilt.", href: "/freiflaechen-photovoltaik" },
            { icon: BadgeEuro, title: "Agri-PV", text: "Doppelnutzung mit Landwirtschaft: 30 % Innovationszuschlag und kein Freiflächen-Abschlag.", href: "/agri-pv" },
          ]}
        />
      </Section>

      <SolarrechnerTeaser
        href="/foerdercheck"
        cta="Förder-Check starten"
        titel="Welche Programme passen genau zu Ihrem Vorhaben?"
        text="Bundesland, Zielgruppe und Vorhaben wählen – der Förder-Check zeigt Bundes- und Landesprogramme für PV, Freifläche, Agri-PV, Speicher, Ladeinfrastruktur und Wärmepumpe."
      />

      <Section tone="white" space="lg">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <SectionHeading eyebrow="Häufige Fragen" title="Förderung nach Bundesland – kurz beantwortet" lead={`Stand ${STAND.label}. Für Ihr Projekt prüfen wir die Förderlage am konkreten Standort.`} />
          <Faq items={FAQ} />
        </div>
      </Section>

      <Section tone="sand" space="md">
        <Quellen stand={STAND.label} quellen={quellen} hinweis="Je Bundesland die wichtigste Förderstelle; alle weiteren Quellen stehen auf den Landesseiten." />
      </Section>

      <Querverweise pfad="/forderungen/landesforderungen" />
      <CtaBand
        eyebrow="Förderung & Planung aus einer Hand"
        title="Wir holen das Maximum an Förderung aus Ihrem Projekt."
        text="Wir prüfen Landes- und Bundesprogramme für Ihren Standort, stimmen EAG-Antrag, Netzzugang und Inbetriebnahme ab und übernehmen die Anmeldung beim Netzbetreiber."
        primary={{ label: "Projekt anfragen", href: "/angebot" }}
        secondary={{ label: "Förder-Check starten", href: "/foerdercheck" }}
      />
    </div>
  );
}

const PUNKT = { zuschuss: "bg-ov-600", gezielt: "bg-ov-200 ring-1 ring-ov-300", bund: "bg-ink-200 ring-1 ring-ink-300" };
const CHIP = { zuschuss: "bg-ov-600 text-white", gezielt: "bg-ov-100 text-ov-800", bund: "bg-ink-100 text-ink-700" };
