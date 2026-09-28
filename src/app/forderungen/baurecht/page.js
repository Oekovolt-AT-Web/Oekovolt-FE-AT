// src/app/forderungen/baurecht/page.js
//
// Baurecht, Elektrizitätsrecht und Raumordnung für Photovoltaik in den neun
// Bundesländern. Daten aus @/data/bundeslaender.

import Link from "next/link";
import { ClipboardCheck, FileSearch, Landmark, ListChecks, MapPinned, PlugZap, Scale } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import Faq from "@/components/ui/Faq";
import CtaBand from "@/components/ui/CtaBand";
import Reveal from "@/components/ui/Reveal";
import Querverweise from "@/components/Reusable/Querverweise";
import GenehmigungsCheck from "@/components/Forderungen/Baurecht/GenehmigungsCheck";
import { AmpelChip, Checkliste, Hinweis, HowTo, Kennzahlen, PruefenMarke, Quellen, StandPille, Tabelle } from "@/components/Forderungen/Shared/Bausteine";
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

export default function Baurecht() {
  const laender = alleBundeslaender();
  const zeilen = laender.map((l) => ({
    land: <Link href={`/forderungen/landesforderungen/${l.slug}`} className="text-ink-900 underline decoration-ink-200 underline-offset-2 hover:text-ov-700">{l.name}</Link>,
    bo: l.recht.bauordnung,
    dach: (
      <>
        <AmpelChip wert={l.recht.ampel.dach} label={AMPEL[l.recht.ampel.dach].label} />
        <span className="mt-1.5 block text-[14px]">{l.recht.dach}</span>
        {l.recht.dachPruefen && <PruefenMarke stand={STAND.label} />}
      </>
    ),
    frei: (
      <>
        <AmpelChip wert={l.recht.ampel.freiflaeche} label={AMPEL[l.recht.ampel.freiflaeche].label} />
        <span className="mt-1.5 block text-[14px]">{l.recht.freiflaeche}</span>
      </>
    ),
    el: (
      <>
        <AmpelChip wert={l.recht.ampel.elektrizitaet} label={AMPEL[l.recht.ampel.elektrizitaet].label} />
        <span className="mt-1.5 block text-[14px]">{l.recht.elektrizitaet}</span>
      </>
    ),
  }));
  const raum = laender.map((l) => ({ land: l.name, regel: l.recht.raumordnung, ortsbild: l.recht.ortsbild }));
  const pflicht = laender.map((l) => ({ land: l.name, pflicht: <>{l.recht.pvPflicht}{l.recht.pvPflichtPruefen && <span className="block"><PruefenMarke stand={STAND.label} /></span>}</> }));
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

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <PageHero
        breadcrumbs={[{ name: "Förderungen", href: "/forderungen/bundesfoerderung" }, { name: "Baurecht" }]}
        eyebrow={`Baurecht & Genehmigung · Stand ${STAND.kurz}`}
        title={<>PV-Genehmigung in Österreich: <span className="ov-text-gradient">neun Länder, neun Regeln</span></>}
        lead="Ob eine PV-Anlage frei, anzeige- oder bewilligungspflichtig ist, entscheiden in Österreich Bauordnung, Landes-Elektrizitätsrecht und Raumordnung des jeweiligen Bundeslandes. Hier stehen die Schwellen aller neun Länder mit Paragraph – und ein Check für Ihr Projekt."
        image={{ src: "/Images/Jobs/download.jpg", alt: "Montage von Photovoltaikmodulen auf einem Dach" }}
        points={["Tabelle aller 9 Bauordnungen", "Elektrizitätsrecht mit Schwellen", "Widmung für Freiflächen", "Genehmigungs-Check"]}
        actions={[
          { label: "Projekt anfragen", href: "/angebot" },
          { label: "Zum Genehmigungs-Check", href: "#genehmigungs-check", icon: ListChecks },
        ]}
        badge={
          <div className="flex items-center gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-ov-500 text-white">
              <Scale aria-hidden="true" className="h-6 w-6" />
            </span>
            <div>
              <p className="font-display text-[18px] font-extrabold leading-tight text-ink-900">3 Rechtsgebiete</p>
              <p className="mt-1 text-[12.5px] leading-snug text-ink-500">Bau, Elektrizität, Raumordnung</p>
            </div>
          </div>
        }
      />

      <Kennzahlen
        items={[
          { wert: "9", label: "Bauordnungen geprüft" },
          { wert: "15 kW – 1 MW", label: "Spanne der elektrizitätsrechtlichen Schwellen" },
          { wert: "50 kW", label: "Widmungsschwelle Grünland in Niederösterreich" },
          { wert: "4 ha", label: "Freiflächen-Obergrenze in Kärnten" },
        ]}
      />

      <Section tone="sand" space="lg" id="genehmigungs-check" className="scroll-mt-24">
        <SectionHeading
          eyebrow="Genehmigungs-Check"
          title={<>Braucht Ihre Anlage eine <span className="ov-text-gradient">Bewilligung</span>?</>}
          lead="Bundesland, Anlagenart und Leistung wählen – Sie sehen für Baurecht, Elektrizitätsrecht und Raumordnung, was voraussichtlich nötig ist."
          align="center"
          className="mb-12"
        />
        <Reveal dir="scale">
          <GenehmigungsCheck laenderPfade={pfade} />
        </Reveal>
      </Section>

      <Section tone="white" space="lg" id="bundeslaender">
        <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            eyebrow="Alle neun Bundesländer"
            title="Bauordnung und Elektrizitätsrecht im Vergleich"
            lead="Die Ampel zeigt den Regelfall: frei, ab einer Schwelle anzeigepflichtig oder ab einer Schwelle bewilligungs- bzw. widmungspflichtig. Die Details stehen im Text daneben."
          />
          <StandPille className="shrink-0 self-start md:self-auto">Rechtsstand {STAND.label}</StandPille>
        </div>
        <Reveal>
          <Tabelle
            dicht
            caption={`Genehmigungspflichten für Photovoltaikanlagen nach Bundesland, Stand ${STAND.label}`}
            spalten={[
              { key: "land", label: "Land", breite: "w-[10%]" },
              { key: "bo", label: "Gesetz", breite: "w-[13%]", className: "text-[14px]" },
              { key: "dach", label: "Dach & Fassade" },
              { key: "frei", label: "Freifläche (Baurecht)" },
              { key: "el", label: "Elektrizitätsrecht" },
            ]}
            zeilen={zeilen}
          />
        </Reveal>
        <Hinweis titel="Frei heißt nicht regelfrei" className="mt-8">
          Auch bewilligungsfreie Anlagen müssen Bebauungsplan, Orts- und Landschaftsbild, Statik und Brandschutz einhalten. Die Baubehörde kann sonst nachträglich einschreiten – in Oberösterreich ausdrücklich nach § 49 Abs. 6 Oö. BauO 1994.
        </Hinweis>
      </Section>

      <Section tone="sand" space="lg" id="freiflaeche">
        <div className="mb-10 grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <SectionHeading
            eyebrow="Raumordnung"
            title="Freiflächen und Agri-PV: Widmung und Zonenpläne je Land"
            lead="Für Freiflächen entscheidet die Raumordnung. Mehrere Länder haben überörtliche Zonenpläne erlassen – wer dort plant, spart Zeit, wer daneben plant, braucht gute Argumente."
          />
          <div className="grid gap-3 self-end sm:grid-cols-2">
            {[
              { t: "Niederösterreich", x: "Sektorales Raumordnungsprogramm PV mit festen Zonen (bis 5 + 5 ha je Zone)" },
              { t: "Steiermark", x: "Sachprogramm Solarenergie mit 36 Vorrangzonen" },
              { t: "Burgenland", x: "Eignungszonenverordnung und Photovoltaikabgabe" },
              { t: "Kärnten", x: "Photovoltaikanlagen-Verordnung 2024, max. 4 ha" },
            ].map((z) => (
              <div key={z.t} className="rounded-2xl bg-white p-4 ring-1 ring-ink-200/70">
                <p className="flex items-center gap-2 font-semibold text-ink-900"><MapPinned aria-hidden="true" className="h-4 w-4 text-ov-600" />{z.t}</p>
                <p className="mt-1 text-[14px] leading-relaxed text-ink-600">{z.x}</p>
              </div>
            ))}
          </div>
        </div>
        <Reveal>
          <Tabelle
            dicht
            caption="Raumordnung und Ortsbildschutz für Photovoltaik nach Bundesland"
            spalten={[
              { key: "land", label: "Land", breite: "w-[14%]" },
              { key: "regel", label: "Widmung / Zonen Freifläche" },
              { key: "ortsbild", label: "Ortsbild & Denkmal", breite: "w-[30%]" },
            ]}
            zeilen={raum}
          />
        </Reveal>
        <p className="mt-6 max-w-3xl text-[15px] leading-relaxed text-ink-600">
          Wie wir Flächen prüfen, pachten und entwickeln, zeigen{" "}
          <Link href="/freiflaechen-photovoltaik" className="font-semibold text-ov-700 underline decoration-ov-300 underline-offset-2">Freiflächen-Photovoltaik</Link> und{" "}
          <Link href="/agri-pv" className="font-semibold text-ov-700 underline decoration-ov-300 underline-offset-2">Agri-PV</Link>. Schneelast, Wind und Hagel am Standort prüft der{" "}
          <Link href="/standort-check" className="font-semibold text-ov-700 underline decoration-ov-300 underline-offset-2">Standort-Check</Link>.
        </p>
      </Section>

      <Section tone="white" space="lg">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionHeading eyebrow="Denkmal & Ortsbild" title="Was bei geschützten Gebäuden gilt" lead="Denkmalschutz ist Bundessache, Ortsbildschutz Landes- und Gemeindesache. Beides kann eine sonst freie Anlage bewilligungspflichtig machen." />
            <Checkliste
              className="mt-8"
              items={[
                { title: "Bundesdenkmalamt", text: "Jede Veränderung eines Denkmals braucht eine Bewilligung nach § 5 DMSG – vor der Bestellung." },
                { title: "Schutzzonen Wien", text: "PV in Schutzzonen und im Grünland-Schutzgebiet ist nach § 60 Abs. 1 lit. j BO bewilligungspflichtig." },
                { title: "Altstadt Salzburg und Graz", text: "Altstadterhaltungsgesetze schränken sichtbare Anlagen ein; die Freistellung gilt dort nicht." },
                { title: "Gemeindeverordnungen", text: "In Vorarlberg können Gemeinden die Freistellung per Verordnung ausschließen, in Niederösterreich gilt in Schutzzonen die Anzeigepflicht." },
              ]}
            />
          </div>
          <div>
            <SectionHeading eyebrow="PV-Pflicht" title="Solarpflichten in den Bauordnungen" />
            <Reveal className="mt-8">
              <Tabelle
                dicht
                caption="PV-Pflichten im Baurecht der Bundesländer"
                spalten={[
                  { key: "land", label: "Land", breite: "w-[28%]" },
                  { key: "pflicht", label: "Regel" },
                ]}
                zeilen={pflicht}
              />
            </Reveal>
          </div>
        </div>
      </Section>

      <Section tone="sand" space="lg">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <SectionHeading
            eyebrow="Genehmigungsweg"
            title="In fünf Schritten zur genehmigten Anlage"
            lead="So gehen wir bei Gewerbe- und Freiflächenprojekten vor – rechtzeitig vor dem EAG-Förderantrag."
            className="lg:sticky lg:top-28 lg:self-start"
          />
          <HowTo
            name="Genehmigung einer Photovoltaikanlage in Österreich klären"
            beschreibung={`Genehmigungsweg für PV-Anlagen nach Landesrecht, Stand ${STAND.label}.`}
            schritte={[
              { icon: FileSearch, name: "Standort und Widmung prüfen", text: "Flächenwidmungs- und Bebauungsplan, Schutzzonen, Denkmalschutz, Naturschutz- und Wasserschutzgebiete sowie Abstände zu Straßen klären." },
              { icon: Landmark, name: "Anlaufstelle des Landes einbinden", text: "Jedes Land hat eine Anlaufstelle für erneuerbare Energie. Bei Freiflächen früh mit Gemeinde und Land sprechen – die Widmung dauert oft Monate." },
              { icon: ClipboardCheck, name: "Anzeigen und Bewilligungen einreichen", text: "Bauanzeige, elektrizitätsrechtliche Anzeige oder Bewilligung, Naturschutz – je nach Land und Größe. Bei gewerblichen Betriebsanlagen die GewO mitdenken." },
              { icon: PlugZap, name: "Netzzugang parallel beantragen", text: "Der Netzbetreiber prüft Kapazität und Anschlusspunkt. In Tirol ist der Nachweis der Anschlusskapazität Teil der Bauanzeige." },
              { icon: ListChecks, name: "Fertigstellung melden", text: "Fertigstellungsmeldung an den Netzbetreiber; in Tirol zusätzlich an die Baubehörde, die die Feuerwehr informiert." },
            ]}
          />
        </div>
      </Section>

      <Section tone="white" space="lg">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <SectionHeading eyebrow="Häufige Fragen" title="Genehmigung – kurz beantwortet" lead={`Allgemeine Information, keine Rechtsauskunft. Rechtsstand ${STAND.label}. Mehr im Ratgeber `}>
            <Link href="/ratgeber/photovoltaik-genehmigung" className="mt-2 inline-block text-[15px] font-semibold text-ov-700 underline decoration-ov-300 underline-offset-2">Photovoltaik-Genehmigung in Österreich</Link>
          </SectionHeading>
          <Faq items={FAQ} />
        </div>
      </Section>

      <Section tone="sand" space="md">
        <Quellen
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
    </div>
  );
}
