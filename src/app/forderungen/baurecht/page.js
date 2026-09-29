// src/app/forderungen/baurecht/page.js
//
// Baurecht, Elektrizitätsrecht und Raumordnung für Photovoltaik in den neun
// Bundesländern. Daten aus @/data/bundeslaender.

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ClipboardCheck, FileSearch, Landmark, ListChecks, MapPinned, PlugZap } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import Faq from "@/components/ui/Faq";
import CtaBand from "@/components/ui/CtaBand";
import Reveal from "@/components/ui/Reveal";
import Querverweise from "@/components/Reusable/Querverweise";
import GenehmigungsCheck from "@/components/Forderungen/Baurecht/GenehmigungsCheck";
import Umschalter from "@/components/Forderungen/Shared/Umschalter";
import Prozess from "@/components/Forderungen/Shared/Prozess";
import { Bildnachweis, Glow, KennzahlenBand } from "@/components/Forderungen/Shared/Premium";
import { BILDER, nachweise } from "@/components/Forderungen/Shared/bildnachweise";
import { AmpelChip, Hinweis, PruefenMarke, Quellen, StandPille } from "@/components/Forderungen/Shared/Bausteine";
import { alleBundeslaender, AMPEL, STAND } from "@/data/bundeslaender";
import { BASE_URL } from "@/lib/site";
import { hreflangLanguages } from "@/lib/hreflang";

const PAGE_URL = `${BASE_URL}/forderungen/baurecht`;
const TITLE = "PV-Genehmigung: Bauordnungen der 9 Bundesländer | Ökovolt";
const DESCRIPTION = "Braucht Ihre PV-Anlage eine Bewilligung? Bauordnung, Elektrizitätsrecht und Widmung in allen neun Bundesländern – Dach, Freifläche, Agri-PV, Denkmalschutz.";

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: ["Photovoltaik Genehmigung Österreich", "PV Anlage Bewilligung Bundesland", "Photovoltaik Bauordnung", "Grünland Photovoltaik Widmung", "Photovoltaik Denkmalschutz", "Freiflächen Photovoltaik Genehmigung", "Solarpflicht Österreich"],
  alternates: { canonical: PAGE_URL, languages: hreflangLanguages(PAGE_URL) },
  robots: { index: true, follow: true },
  openGraph: {
    type: "article",
    url: PAGE_URL,
    siteName: "Ökovolt Österreich",
    locale: "de_AT",
    title: TITLE,
    description: DESCRIPTION,
    images: [{ url: `${BASE_URL}/og-image.jpg`, width: 1200, height: 630, alt: "Genehmigung von Photovoltaikanlagen in Österreich" }],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, images: [`${BASE_URL}/og-image.jpg`] },
};

const FAQ = [
  {
    q: "Braucht eine PV-Anlage auf dem Dach in Österreich eine Baubewilligung?",
    a: "In den meisten Bundesländern nicht. Oberösterreich, Niederösterreich, die Steiermark, Salzburg, Vorarlberg und Wien stellen dachparallele oder integrierte Anlagen bewilligungsfrei; Tirol bis 100 m² Modulfläche, das Burgenland bis 20 kWp an kleineren Gebäuden. Ausnahmen gelten in Schutzzonen, Altstadt- und Ortsbildschutzgebieten sowie bei denkmalgeschützten Gebäuden.",
  },
  {
    q: "Ab welcher Leistung braucht eine PV-Anlage eine elektrizitätsrechtliche Bewilligung?",
    a: "Die Schwellen unterscheiden sich stark: Wien verlangt über 50 kW eine Genehmigung (über 15 kW eine Anzeige), Tirol über 250 kW (Anzeige ab 100 kW), Vorarlberg und das Burgenland über 500 kWp, Niederösterreich, Oberösterreich und die Steiermark erst über 1.000 kW. In Salzburg ist PV unabhängig von der Leistung frei, wenn ein befugtes Unternehmen errichtet. In Oberösterreich und Kärnten sind Anlagen auf Gebäuden generell ausgenommen.",
  },
  {
    q: "Brauche ich für eine Freiflächenanlage eine Umwidmung?",
    a: "In der Regel ja. Niederösterreich verlangt über 50 kW die Widmung „Grünland-Photovoltaikanlagen“, Oberösterreich über 50 m² Modulfläche eine Sonderwidmung, Salzburg über 200 m² eine Kennzeichnung, Kärnten die Widmung „Grünland – Photovoltaikanlage“ (max. 4 ha). Die Steiermark und das Burgenland lenken große Anlagen in Vorrang- bzw. Eignungszonen.",
  },
  {
    q: "Darf ich eine PV-Anlage auf ein denkmalgeschütztes Gebäude bauen?",
    a: "Nur mit Bewilligung des Bundesdenkmalamts nach § 5 Denkmalschutzgesetz. Das Amt prüft Sichtbarkeit, Farbe und Eingriff in die Substanz; dachintegrierte oder vom öffentlichen Raum kaum einsehbare Lösungen haben gute Chancen. Die Bewilligung muss vor der Bestellung vorliegen – auch weil der EAG-Zuschuss alle Genehmigungen beim Antrag verlangt.",
  },
  {
    q: "Gibt es in Österreich eine PV-Pflicht für Neubauten?",
    a: "Wien hat die strengste Regel: Seit 15.07.2026 verlangt § 118e der Bauordnung bei Nichtwohn-Neubauten 1 kWp je 100 m² konditionierter Brutto-Grundfläche und bei Wohnbauten eine Leistung nach Formel. Vorarlberg verpflichtet Einkaufszentren und größere Handelsbetriebe. In den übrigen Ländern sind die Regeln uneinheitlich – wir prüfen sie für Ihr Bauvorhaben.",
  },
  {
    q: "Was ändert das Erneuerbaren-Ausbau-Beschleunigungsgesetz?",
    a: "Das EABG (BGBl. I Nr. 47/2026) setzt die EU-Richtlinie RED III um: Beschleunigungsgebiete für erneuerbare Energie und ein konzentriertes Genehmigungsverfahren. Teile gelten seit Juli 2026, der Rest ab 01.01.2027. Oberösterreich arbeitet an Verordnungen für PV-Beschleunigungsgebiete und Ausschlusszonen, die 2026 beschlossen werden sollen.",
  },
];

const LINK = "font-semibold text-ov-700 underline decoration-ov-300 underline-offset-2 hover:text-ov-800";
const AMPEL_BALKEN = { frei: "from-ov-500 to-ov-600", anzeige: "from-sun-300 to-sun-500", bewilligung: "from-navy-500 to-navy-700" };

const ZONEN = [
  { t: "Niederösterreich", x: "Sektorales Raumordnungsprogramm PV mit festen Zonen (bis 5 + 5 ha je Zone)" },
  { t: "Steiermark", x: "Sachprogramm Solarenergie mit 36 Vorrangzonen" },
  { t: "Burgenland", x: "Eignungszonenverordnung und Photovoltaikabgabe" },
  { t: "Kärnten", x: "Photovoltaikanlagen-Verordnung 2024, max. 4 ha" },
];

const DENKMAL = [
  { title: "Bundesdenkmalamt", text: "Jede Veränderung eines Denkmals braucht eine Bewilligung nach § 5 DMSG – vor der Bestellung." },
  { title: "Schutzzonen Wien", text: "PV in Schutzzonen und im Grünland-Schutzgebiet ist nach § 60 Abs. 1 lit. j BO bewilligungspflichtig." },
  { title: "Altstadt Salzburg und Graz", text: "Altstadterhaltungsgesetze schränken sichtbare Anlagen ein; die Freistellung gilt dort nicht." },
  { title: "Gemeindeverordnungen", text: "In Vorarlberg können Gemeinden die Freistellung per Verordnung ausschließen, in Niederösterreich gilt in Schutzzonen die Anzeigepflicht." },
];

export default function Baurecht() {
  const laender = alleBundeslaender();
  const pfade = Object.fromEntries(laender.map((l) => [l.key, `/forderungen/landesforderungen/${l.slug}`]));

  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${PAGE_URL}/#webpage`,
    url: PAGE_URL,
    name: "Genehmigung von Photovoltaikanlagen in den neun Bundesländern",
    description: DESCRIPTION,
    inLanguage: "de-AT",
    isPartOf: { "@id": `${BASE_URL}/#website` },
    about: { "@id": `${BASE_URL}/#organization` },
    dateModified: STAND.iso,
  };

  const landPanels = laender.map((l) => {
    const r = l.recht;
    const karten = [
      { titel: "Dach & Fassade", ampel: r.ampel.dach, text: r.dach, pruefen: r.dachPruefen },
      { titel: "Freifläche (Baurecht)", ampel: r.ampel.freiflaeche, text: r.freiflaeche, pruefen: r.freiflaechePruefen },
      { titel: "Elektrizitätsrecht", ampel: r.ampel.elektrizitaet, text: r.elektrizitaet },
    ];
    const weitere = [
      { titel: "Raumordnung / Widmung Freifläche", text: r.raumordnung },
      { titel: "Ortsbild & Denkmal", text: r.ortsbild },
      { titel: "PV-Pflicht", text: r.pvPflicht, pruefen: r.pvPflichtPruefen },
    ];
    return (
      <div key={l.key} className="space-y-4">
        <div className="flex flex-col justify-between gap-3 rounded-3xl bg-navy-950 px-6 py-5 text-white sm:flex-row sm:items-center">
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-ov-300">{l.name}</p>
            <p className="mt-1 font-display text-[19px] font-bold">{r.bauordnung}</p>
          </div>
          <Link href={pfade[l.key]} className="group inline-flex shrink-0 items-center gap-2 text-[14.5px] font-semibold text-ov-300 hover:text-white">
            Förderung & Netz in {l.name}
            <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
        <ul className="grid gap-4 md:grid-cols-3">
          {karten.map((k) => (
            <li key={k.titel} className="relative flex flex-col overflow-hidden rounded-3xl bg-white p-5 pl-6 ring-1 ring-ink-200/70">
              <span aria-hidden="true" className={`absolute inset-y-0 left-0 w-1.5 bg-gradient-to-b ${AMPEL_BALKEN[k.ampel]}`} />
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="font-display text-[16.5px] font-bold text-ink-900">{k.titel}</h3>
                <AmpelChip wert={k.ampel} label={AMPEL[k.ampel].label} />
              </div>
              <p className="mt-3 text-[14.5px] leading-relaxed text-ink-700">{k.text}</p>
              {k.pruefen && <PruefenMarke stand={STAND.label} className="self-start" />}
            </li>
          ))}
        </ul>
        <dl className="grid gap-px overflow-hidden rounded-3xl bg-ink-200/70 ring-1 ring-ink-200/70 md:grid-cols-3">
          {weitere.map((w) => (
            <div key={w.titel} className="bg-sand-50 p-5">
              <dt className="text-[12px] font-semibold uppercase tracking-wider text-ink-500">{w.titel}</dt>
              <dd className="mt-1.5 text-[14.5px] leading-relaxed text-ink-700">
                {w.text}
                {w.pruefen && <span className="block"><PruefenMarke stand={STAND.label} /></span>}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    );
  });

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <PageHero
        variant="immersive"
        breadcrumbs={[{ name: "Förderungen", href: "/forderungen/bundesfoerderung" }, { name: "Baurecht" }]}
        eyebrow={`Baurecht & Genehmigung · Stand ${STAND.kurz}`}
        title={<>PV-Genehmigung in Österreich: <span className="ov-text-gradient-light">neun Länder, neun Regeln</span></>}
        lead="Ob eine PV-Anlage frei, anzeige- oder bewilligungspflichtig ist, entscheiden in Österreich Bauordnung, Landes-Elektrizitätsrecht und Raumordnung des jeweiligen Bundeslandes. Hier stehen die Schwellen aller neun Länder mit Paragraph – und ein Check für Ihr Projekt."
        image={{ src: "/Images/Jobs/download.jpg", alt: "Montageteam mit Schutzhelmen auf einem Dach mit Photovoltaikmodulen", position: "center 35%" }}
        points={["Alle 9 Bauordnungen", "Elektrizitätsrecht mit Schwellen", "Widmung für Freiflächen", "Genehmigungs-Check"]}
        actions={[
          { label: "Zum Genehmigungs-Check", href: "#genehmigungs-check", icon: ListChecks },
          { label: "Projekt anfragen", href: "/angebot" },
        ]}
      />

      <KennzahlenBand
        items={[
          { value: 9, label: "Bauordnungen geprüft" },
          { text: "15 kW – 1 MW", label: "Spanne der elektrizitätsrechtlichen Schwellen" },
          { value: 50, suffix: " kW", label: "Widmungsschwelle Grünland in Niederösterreich" },
          { value: 4, suffix: " ha", label: "Freiflächen-Obergrenze in Kärnten" },
        ]}
      />

      <Section tone="sand" space="md" id="genehmigungs-check" className="scroll-mt-24">
        <SectionHeading
          eyebrow="Genehmigungs-Check"
          title={<>Braucht Ihre Anlage eine <span className="ov-text-gradient">Bewilligung</span>?</>}
          lead="In drei Schritten: Bundesland, Anlagenart und Leistung wählen – Sie sehen für Baurecht, Elektrizitätsrecht und Raumordnung, was voraussichtlich nötig ist."
          align="center"
          className="mb-10"
        />
        <Reveal dir="scale">
          <GenehmigungsCheck laenderPfade={pfade} />
        </Reveal>
      </Section>

      <Section tone="white" space="md" id="bundeslaender" className="scroll-mt-24">
        <div className="mb-8 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            eyebrow="Alle neun Bundesländer"
            title="Bauordnung und Elektrizitätsrecht im Vergleich"
            lead="Die Ampel zeigt den Regelfall: frei, ab einer Schwelle anzeigepflichtig oder ab einer Schwelle bewilligungs- bzw. widmungspflichtig. Bundesland wählen – die Details stehen daneben."
          />
          <StandPille className="shrink-0 self-start md:self-auto">Rechtsstand {STAND.label}</StandPille>
        </div>
        <Umschalter
          form="liste"
          label="Bundesland wählen"
          start="oberoesterreich"
          tabs={laender.map((l) => ({
            id: l.key,
            label: l.name,
            icon: (
              <span className="flex gap-0.5" aria-hidden="true">
                {[l.recht.ampel.dach, l.recht.ampel.freiflaeche, l.recht.ampel.elektrizitaet].map((a, i) => (
                  <span key={i} className={`h-2 w-2 rounded-full ${a === "frei" ? "bg-ov-500" : a === "anzeige" ? "bg-sun-400" : "bg-navy-400"}`} />
                ))}
              </span>
            ),
          }))}
          panels={landPanels}
        />
        <Hinweis titel="Frei heißt nicht regelfrei" className="mt-8">
          Auch bewilligungsfreie Anlagen müssen Bebauungsplan, Orts- und Landschaftsbild, Statik und Brandschutz einhalten. Die Baubehörde kann sonst nachträglich einschreiten – in Oberösterreich ausdrücklich nach § 49 Abs. 6 Oö. BauO 1994.
        </Hinweis>
      </Section>

      <Section tone="navy" space="md" id="freiflaeche" className="ov-noise overflow-hidden">
        <Glow />
        <div className="relative grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal dir="left" className="relative">
            <div aria-hidden="true" className="absolute -inset-3 rounded-[2.25rem] bg-white/5 -rotate-2" />
            <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] shadow-2xl">
              <Image src={BILDER.duernrohr.src} alt="Luftbild eines Photovoltaik-Freiflächenparks in Niederösterreich" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
            </div>
          </Reveal>
          <div>
            <SectionHeading
              dark
              eyebrow="Raumordnung"
              title="Freiflächen und Agri-PV: Widmung und Zonenpläne je Land"
              lead="Für Freiflächen entscheidet die Raumordnung. Mehrere Länder haben überörtliche Zonenpläne erlassen – wer dort plant, spart Zeit, wer daneben plant, braucht gute Argumente."
            />
            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {ZONEN.map((z, i) => (
                <Reveal as="li" key={z.t} delay={i * 70} className="ov-glass rounded-2xl p-4">
                  <p className="flex items-center gap-2 font-semibold text-white"><MapPinned aria-hidden="true" className="h-4 w-4 text-ov-300" />{z.t}</p>
                  <p className="mt-1 text-[14px] leading-relaxed text-white/65">{z.x}</p>
                </Reveal>
              ))}
            </ul>
            <p className="mt-6 text-[15px] leading-relaxed text-white/65">
              Wie wir Flächen prüfen, pachten und entwickeln, zeigen <Link href="/freiflaechen-photovoltaik" className="font-semibold text-ov-300 underline decoration-ov-300/50 underline-offset-2 hover:text-white">Freiflächen-Photovoltaik</Link> und <Link href="/agri-pv" className="font-semibold text-ov-300 underline decoration-ov-300/50 underline-offset-2 hover:text-white">Agri-PV</Link>. Schneelast, Wind und Hagel am Standort prüft der <Link href="/standort-check" className="font-semibold text-ov-300 underline decoration-ov-300/50 underline-offset-2 hover:text-white">Standort-Check</Link>.
            </p>
          </div>
        </div>
      </Section>

      <Section tone="white" space="md">
        <SectionHeading eyebrow="Denkmal & Ortsbild" title="Was bei geschützten Gebäuden gilt" lead="Denkmalschutz ist Bundessache, Ortsbildschutz Landes- und Gemeindesache. Beides kann eine sonst freie Anlage bewilligungspflichtig machen." className="mb-8" />
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {DENKMAL.map((d, i) => (
            <Reveal as="li" key={d.title} delay={i * 70} className="rounded-3xl bg-sand-50 p-6 ring-1 ring-ink-200/60">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-ov-600 ring-1 ring-ink-200"><Landmark aria-hidden="true" className="h-5 w-5" /></span>
              <h3 className="mt-5 font-display text-[17px] font-bold text-ink-900">{d.title}</h3>
              <p className="mt-2 text-[14.5px] leading-relaxed text-ink-600">{d.text}</p>
            </Reveal>
          ))}
        </ul>

        <div className="mt-16">
          <SectionHeading eyebrow="Genehmigungsweg" title="In fünf Schritten zur genehmigten Anlage" lead="So gehen wir bei Gewerbe- und Freiflächenprojekten vor – rechtzeitig vor dem EAG-Förderantrag." className="mb-10" />
          <Prozess
            name="Genehmigung einer Photovoltaikanlage in Österreich klären"
            beschreibung={`Genehmigungsweg für PV-Anlagen nach Landesrecht, Stand ${STAND.label}.`}
            schritte={[
              { icon: <FileSearch />, name: "Standort und Widmung prüfen", text: "Flächenwidmungs- und Bebauungsplan, Schutzzonen, Denkmalschutz, Naturschutz- und Wasserschutzgebiete sowie Abstände zu Straßen klären." },
              { icon: <Landmark />, name: "Anlaufstelle des Landes einbinden", text: "Jedes Land hat eine Anlaufstelle für erneuerbare Energie. Bei Freiflächen früh mit Gemeinde und Land sprechen – die Widmung dauert oft Monate." },
              { icon: <ClipboardCheck />, name: "Anzeigen und Bewilligungen einreichen", text: "Bauanzeige, elektrizitätsrechtliche Anzeige oder Bewilligung, Naturschutz – je nach Land und Größe. Bei gewerblichen Betriebsanlagen die GewO mitdenken." },
              { icon: <PlugZap />, name: "Netzzugang parallel beantragen", text: "Der Netzbetreiber prüft Kapazität und Anschlusspunkt. In Tirol ist der Nachweis der Anschlusskapazität Teil der Bauanzeige." },
              { icon: <ListChecks />, name: "Fertigstellung melden", text: "Fertigstellungsmeldung an den Netzbetreiber; in Tirol zusätzlich an die Baubehörde, die die Feuerwehr informiert." },
            ]}
          />
        </div>
      </Section>

      <Section tone="sand" space="md">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <SectionHeading eyebrow="Häufige Fragen" title="Genehmigung – kurz beantwortet" lead={`Allgemeine Information, keine Rechtsauskunft. Rechtsstand ${STAND.label}. Mehr im Ratgeber `}>
            <Link href="/ratgeber/photovoltaik-genehmigung" className={`mt-2 inline-block text-[15px] ${LINK}`}>Photovoltaik-Genehmigung in Österreich</Link>
          </SectionHeading>
          <Faq items={FAQ} />
        </div>
        <Quellen
          klappbar
          className="mt-12"
          stand={STAND.label}
          quellen={[
            ...laender.flatMap((l) => l.recht.quellen),
            { label: "USP – Erneuerbaren-Ausbau-Beschleunigungsgesetz (EABG)", url: "https://www.usp.gv.at/aktuelles/gesetzliche-neuerungen/Bundesgesetzblatt/erneuerbaren-ausbau-beschleunigungsgesetz-eabg.html" },
          ]}
          hinweis="Rechtsgrundlagen im RIS (Landesrecht, konsolidierte Fassung) und Leitfäden der Länder. Werte mit Prüfvermerk ließen sich nur über Sekundärquellen belegen."
        />
      </Section>

      <Querverweise pfad="/forderungen/baurecht" />
      <CtaBand
        eyebrow="Genehmigung aus einer Hand"
        title="Wir klären Bauordnung, Widmung und Netz für Ihr Projekt."
        text="Von der Anzeige bis zur Widmung einer Freifläche: Wir kennen die Verfahren in allen neun Bundesländern und stimmen sie mit Förderantrag und Netzanschluss ab."
        primary={{ label: "Projekt anfragen", href: "/angebot" }}
        secondary={{ label: "Normen & Netzanschluss", href: "/forderungen/richtlinien" }}
      />
      <Bildnachweis items={nachweise("duernrohr")} />
    </div>
  );
}
