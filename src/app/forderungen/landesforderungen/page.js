// src/app/forderungen/landesforderungen/page.js
//
// Übersicht der Landesförderungen aller neun Bundesländer. Statische Daten
// aus @/data/bundeslaender – keine Backend-Abfrage.

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BadgeEuro, BatteryCharging, Building2, Home, Landmark, Map, Percent, Receipt, Sun, Tractor } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import FeatureGrid from "@/components/ui/FeatureGrid";
import Faq from "@/components/ui/Faq";
import CtaBand from "@/components/ui/CtaBand";
import Reveal from "@/components/ui/Reveal";
import Querverweise from "@/components/Reusable/Querverweise";
import Foerderkarte from "@/components/Forderungen/Landes/Foerderkarte";
import Umschalter from "@/components/Forderungen/Shared/Umschalter";
import { Bildnachweis, Glow, KennzahlenBand } from "@/components/Forderungen/Shared/Premium";
import { BILDER, nachweise } from "@/components/Forderungen/Shared/bildnachweise";
import { Hinweis, Quellen, StandPille } from "@/components/Forderungen/Shared/Bausteine";
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

const AMPEL_PUNKT = { zuschuss: "bg-ov-500", gezielt: "bg-sun-400", bund: "bg-ink-400" };
const AMPEL_CHIP = { zuschuss: "bg-ov-500 text-white", gezielt: "bg-sun-400 text-navy-950", bund: "bg-white/90 text-ink-800" };

const ZIELGRUPPEN_VERGLEICH = [
  { id: "unternehmen", label: "Unternehmen", icon: <Building2 /> },
  { id: "landwirtschaft", label: "Landwirtschaft", icon: <Tractor /> },
  { id: "gemeinde", label: "Gemeinden", icon: <Landmark /> },
  { id: "privat", label: "Private", icon: <Home /> },
  { id: "speicher", label: "Speicher", icon: <BatteryCharging /> },
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
    bild: l.bild ? { src: l.bild.src, alt: l.bild.alt, position: l.bild.position } : null,
  }));
  const programmeGesamt = liste.reduce((s, l) => s + l.programme.length, 0);
  const mitBetrieb = liste.filter((l) => l.programme.some((p) => p.zielgruppen.includes("unternehmen"))).length;

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

  const vergleichPanels = ZIELGRUPPEN_VERGLEICH.map((z) => (
    <ul key={z.id} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {liste.map((l) => (
        <li key={l.key}>
          <Link href={`/forderungen/landesforderungen/${l.slug}`} className="group flex h-full gap-3.5 rounded-2xl bg-white p-4 ring-1 ring-ink-200/70 transition-all hover:-translate-y-0.5 hover:shadow-[0_18px_36px_-26px_rgba(3,18,43,0.5)] hover:ring-ov-200">
            <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sand-50 font-display text-[13px] font-extrabold text-ink-800 ring-1 ring-ink-200">
              {l.kuerzel}
              <span aria-hidden="true" className={`absolute -right-1 -top-1 h-3 w-3 rounded-full ring-2 ring-white ${AMPEL_PUNKT[l.foerderart]}`} />
            </span>
            <span className="min-w-0">
              <span className="block font-semibold text-ink-900 transition-colors group-hover:text-ov-700">{l.name}</span>
              <span className="mt-0.5 block text-[14px] leading-relaxed text-ink-600">{l.ueberblick[z.id]}</span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  ));

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <PageHero
        variant="immersive"
        breadcrumbs={[{ name: "Förderungen", href: "/forderungen/bundesfoerderung" }, { name: "Landesförderungen" }]}
        eyebrow={`Förderung nach Bundesland · Stand ${STAND.kurz}`}
        title={<>Photovoltaik-Förderung 2026 <span className="ov-text-gradient-light">in allen neun Bundesländern</span></>}
        lead="Welche Landesprogramme gibt es für Betriebe, Landwirtschaft, Gemeinden und Private – und was kommt vom Bund dazu? Alle neun Länder auf einer Karte, geprüft, datiert und mit Quellen."
        image={{ src: BILDER.wildkogel.src, alt: "Photovoltaik-Freiflächenanlage im Skigebiet Wildkogel in Salzburg im Winter", position: "center 55%" }}
        points={["Alle 9 Länder mit Prüfdatum", "Programme nach Zielgruppe", "Solarertrag nach PVGIS", "Kombination mit EAG-Zuschuss"]}
        actions={[
          { label: "Zur Förderkarte", href: "#foerderkarte", icon: Map },
          { label: "Förder-Check starten", href: "/foerdercheck" },
        ]}
      />

      <KennzahlenBand
        items={[
          { value: 9, label: "Bundesländer geprüft" },
          { value: programmeGesamt, label: "offene Landesprogramme erfasst" },
          { value: mitBetrieb, label: "Länder mit Programmen für Unternehmen" },
          { text: EAG_IZ.naechsterCall.zeitraum.replace(".2026", ""), label: "nächster EAG-Fördercall 2026" },
        ]}
      />

      {/* Karte */}
      <Section tone="navy" space="md" id="foerderkarte" className="ov-noise scroll-mt-24 overflow-hidden">
        <Glow />
        <div className="relative">
          <SectionHeading
            dark
            eyebrow="Interaktive Förderkarte"
            title={<>Wo es 2026 <span className="ov-text-gradient-light">zusätzlich Landesgeld</span> gibt</>}
            lead="Fahren Sie über die Karte oder wählen Sie Ihr Bundesland. Die Förder-Ampel zeigt, ob das Land breit, gezielt oder gar nicht zusätzlich zum Bund fördert – und die zweite Ebene, wie viel Sonne Ihre Region liefert."
            className="mb-10"
          />
          <Reveal dir="scale">
            <Foerderkarte laender={laender} startKey="oberoesterreich" />
          </Reveal>
          <p className="mt-8 max-w-3xl text-[13.5px] leading-relaxed text-white/50">
            Einordnung aus Sicht von Unternehmen, Landwirtschaft und Gemeinden. Landesprogramme können bei ausgeschöpftem Budget kurzfristig enden – maßgeblich ist immer die aktuelle Richtlinie der Förderstelle.
          </p>
        </div>
      </Section>

      {/* Alle Länder */}
      <Section tone="white" space="md" id="bundeslaender" className="scroll-mt-24">
        <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading eyebrow="Alle neun Bundesländer" title="Förderung in Ihrem Bundesland im Detail" lead="Landesprogramme mit Status, Energiegemeinschaften, Bauordnung in Kurzform, Netzbetreiber und Solarertrag – je Land auf einer eigenen Seite." />
          <ul className="flex flex-wrap gap-2 md:justify-end" aria-label="Legende Förder-Ampel">
            {Object.entries(FOERDERARTEN).map(([k, v]) => (
              <li key={k} className="inline-flex items-center gap-2 rounded-full bg-sand-50 px-3 py-1.5 text-[12.5px] font-medium text-ink-600 ring-1 ring-ink-200">
                <span aria-hidden="true" className={`h-2.5 w-2.5 rounded-full ${AMPEL_PUNKT[k]}`} />
                {v.label}
              </li>
            ))}
          </ul>
        </div>

        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {liste.map((l, i) => (
            <Reveal as="li" key={l.key} delay={(i % 3) * 70} className="flex">
              <Link href={`/forderungen/landesforderungen/${l.slug}`} className="group relative flex min-h-[340px] w-full flex-col justify-end overflow-hidden rounded-[1.75rem] bg-navy-950 text-white shadow-[0_30px_60px_-40px_rgba(3,18,43,0.7)] outline-none focus-visible:ring-2 focus-visible:ring-ov-500 focus-visible:ring-offset-2">
                {l.bild && (
                  <Image src={l.bild.src} alt={l.bild.alt} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.06]" style={{ objectPosition: l.bild.position }} />
                )}
                <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/55 to-navy-950/0" />
                <div className="absolute left-5 right-5 top-5 flex items-start justify-between gap-3">
                  <span className="ov-glass flex h-11 min-w-11 items-center justify-center rounded-xl px-2 font-display text-[14px] font-extrabold">{l.kuerzel}</span>
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11.5px] font-semibold ${AMPEL_CHIP[l.foerderart]}`}>{FOERDERARTEN[l.foerderart].kurz}</span>
                </div>
                <div className="relative p-6">
                  <h3 className="font-display text-[21px] font-extrabold leading-snug tracking-tight">Förderung in {l.name}</h3>
                  <p className="mt-2 line-clamp-3 text-[14px] leading-relaxed text-white/75">{l.kurz}</p>
                  <div className="mt-4 flex items-center justify-between gap-3 border-t border-white/15 pt-4 text-[13px] text-white/70">
                    <span className="inline-flex items-center gap-1.5">
                      <Sun aria-hidden="true" className="h-3.5 w-3.5 text-sun-400" />
                      <span className="ov-num">{l.ertrag[0].toLocaleString("de-DE")}–{l.ertrag[1].toLocaleString("de-DE")} kWh/kWp</span>
                    </span>
                    <span className="inline-flex items-center gap-1 font-semibold text-ov-300">
                      {l.programme.length} {l.programme.length === 1 ? "Programm" : "Programme"}
                      <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </ul>
      </Section>

      {/* Vergleich nach Zielgruppe */}
      <Section tone="sand" space="md">
        <div className="mb-8 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            eyebrow="Vergleich"
            title="Landesförderung 2026 nach Zielgruppe"
            lead="Die Kurzfassung für Geschäftsführung und Einkauf: Was das Land zusätzlich zum Bund bietet – oder eben nicht. Zielgruppe wählen, alle neun Länder vergleichen."
          />
          <StandPille className="shrink-0 self-start md:self-auto">Stand {STAND.label}</StandPille>
        </div>
        <Umschalter label="Zielgruppe wählen" tabs={ZIELGRUPPEN_VERGLEICH} panels={vergleichPanels} />
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <Hinweis titel="Kombination mit dem EAG-Zuschuss">
            In den Kategorien A–C ist eine Landesförderung zusätzlich erlaubt, in Kategorie D (über 100 kWp) nicht. Bei größeren Betriebsanlagen rechnen wir deshalb beide Wege durch: EAG-Zuschuss allein oder Landesförderung ohne EAG.
          </Hinweis>
          <Hinweis titel="Gemeindeförderungen nicht vergessen" ton="warn">
            Viele Gemeinden fördern zusätzlich – oft mit kleinem Budget und ohne große Ankündigung. Vorarlberg (Förderkompass) und Oberösterreich (Förder-Assistent) bieten Suchwerkzeuge; sonst hilft ein Anruf beim Gemeindeamt vor der Bestellung.
          </Hinweis>
        </div>
      </Section>

      {/* Bund */}
      <Section tone="white" space="md">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <SectionHeading
            eyebrow="Gilt in allen Bundesländern"
            title="Die Basis: vier Bundesinstrumente für jede Anlage"
            lead="Egal ob Bregenz oder Eisenstadt – diese Instrumente gelten überall und tragen bei Gewerbeanlagen den Großteil der Wirtschaftlichkeit. Landesprogramme kommen obendrauf."
          >
            <div className="mt-8 flex flex-col gap-3">
              <Link href="/forderungen/bundesfoerderung" className="group inline-flex items-center gap-2 text-[15px] font-semibold text-ov-700 hover:text-ov-800">
                Bundesförderung (EAG & KPC) im Detail – mit Zuschuss-Rechner
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

      {/* Nach Vorhaben */}
      <Section tone="sand" space="md">
        <SectionHeading eyebrow="Nach Vorhaben" title="Förderung passend zum Projekt" className="mb-10" />
        <ul className="grid gap-4 md:grid-cols-3">
          {[
            { bild: BILDER.gemeinde, alt: "Photovoltaikanlage auf dem Dach eines Gemeindeamts in Kärnten", titel: "Gemeinden und öffentliche Hand", text: "PV auf Schule, Bauhof und Kläranlage – mit Vergabe, Energiegemeinschaft und Bürgerbeteiligung.", href: "/kommunen" },
            { bild: BILDER.duernrohr, alt: "Luftbild eines Photovoltaik-Freiflächenparks in Niederösterreich", titel: "Freiflächen-Photovoltaik", text: "Widmung, Zonenpläne und Abschlag im EAG-Zuschuss – was je Bundesland gilt.", href: "/freiflaechen-photovoltaik" },
            { bild: BILDER.agriObst, alt: "Hoch aufgeständerte Agri-PV-Anlage über einer Apfelanlage", titel: "Agri-PV", text: "Doppelnutzung mit Landwirtschaft: 30 % Innovationszuschlag und kein Freiflächen-Abschlag.", href: "/agri-pv" },
          ].map((v, i) => (
            <Reveal as="li" key={v.href} delay={i * 80} className="flex">
              <Link href={v.href} className="group ov-card-hover flex w-full flex-col overflow-hidden rounded-[1.75rem] bg-white ring-1 ring-ink-200/70 hover:ring-ov-200">
                <span className="relative block aspect-[16/10] overflow-hidden">
                  <Image src={v.bild.src} alt={v.alt} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition-transform duration-[1200ms] group-hover:scale-[1.05]" />
                </span>
                <span className="flex flex-1 flex-col p-6">
                  <span className="font-display text-[19px] font-bold leading-snug text-ink-900 transition-colors group-hover:text-ov-700">{v.titel}</span>
                  <span className="mt-2 text-[14.5px] leading-relaxed text-ink-600">{v.text}</span>
                  <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-[14.5px] font-semibold text-ov-700">
                    Mehr erfahren <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </span>
              </Link>
            </Reveal>
          ))}
        </ul>
      </Section>

      <Section tone="white" space="md">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <SectionHeading eyebrow="Häufige Fragen" title="Förderung nach Bundesland – kurz beantwortet" lead={`Stand ${STAND.label}. Für Ihr Projekt prüfen wir die Förderlage am konkreten Standort.`} />
          <Faq items={FAQ} />
        </div>
        <Quellen klappbar className="mt-12" stand={STAND.label} quellen={quellen} hinweis="Je Bundesland die wichtigste Förderstelle; alle weiteren Quellen stehen auf den Landesseiten." />
      </Section>

      <Querverweise pfad="/forderungen/landesforderungen" />
      <CtaBand
        eyebrow="Förderung & Planung aus einer Hand"
        title="Wir holen das Maximum an Förderung aus Ihrem Projekt."
        text="Wir prüfen Landes- und Bundesprogramme für Ihren Standort, stimmen EAG-Antrag, Netzzugang und Inbetriebnahme ab und übernehmen die Anmeldung beim Netzbetreiber."
        primary={{ label: "Projekt anfragen", href: "/angebot" }}
        secondary={{ label: "Förder-Check starten", href: "/foerdercheck" }}
      />
      <Bildnachweis
        items={[
          ...nachweise("wildkogel", "gemeinde", "duernrohr", "agriObst"),
          ...liste.filter((l) => l.bild).map((l) => ({ motiv: l.bild.motiv, urheber: l.bild.urheber, lizenz: l.bild.lizenz, href: l.bild.href })),
        ]}
      />
    </div>
  );
}
