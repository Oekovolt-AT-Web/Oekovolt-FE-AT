// src/app/uber-uns/page.js
//
// Unternehmensseite der österreichischen Gesellschaft (Ökovolt Solartechnik
// GmbH, Ostermiething). Registerwerte ausschließlich aus @/lib/site, Geschichte
// und Gruppenstruktur aus @/data/unternehmen.

import { Briefcase, Building2, CalendarCheck2, Handshake, HeartHandshake, MapPin, Trophy, Users } from "lucide-react";

import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import SplitMedia from "@/components/ui/SplitMedia";
import FeatureGrid from "@/components/ui/FeatureGrid";
import Faq from "@/components/ui/Faq";
import CtaBand from "@/components/ui/CtaBand";
import Reveal from "@/components/ui/Reveal";
import Querverweise from "@/components/Reusable/Querverweise";
import {
  Claim,
  Gruppe,
  Haltung,
  Partnerschaft,
  Register,
  RollenAt,
  Ursprung,
  Zeitleiste,
} from "@/components/Team/Firmengeschichte";
import { PROFIL, STAND } from "@/data/unternehmen";
import { BASE_URL, FIRMA, SCHWESTER, SITE_NAME, SOLENSA } from "@/lib/site";

const PAGE_URL = `${BASE_URL}/uber-uns`;
const TITEL = "Über Ökovolt – PV-Errichter aus Ostermiething | Ökovolt";
const BESCHREIBUNG =
  "Ökovolt Solartechnik GmbH: seit 2012 PV-Errichter in Österreich, Sitz Ostermiething, FN 375708m. Gesellschafter, Geschichte, eigene Technik und Gruppe.";

export const metadata = {
  title: TITEL,
  description: BESCHREIBUNG,
  alternates: { canonical: PAGE_URL },
  openGraph: {
    type: "website",
    locale: "de_AT",
    url: PAGE_URL,
    siteName: SITE_NAME,
    title: TITEL,
    description: BESCHREIBUNG,
    images: [{ url: `${BASE_URL}/og-image.jpg`, width: 1200, height: 630, alt: "Ökovolt Solartechnik GmbH, Ostermiething" }],
  },
};

const gesellschafterText = FIRMA.gesellschafter.map((g) => `${g.name} (${g.anteil})`).join(" und ");

const FAKTEN = [
  ["Firma", FIRMA.name],
  ["Rechtsform", FIRMA.rechtsform],
  ["Sitz", `${FIRMA.strasse}, ${FIRMA.plz} ${FIRMA.ort}, ${FIRMA.bundesland}`],
  ["Firmenbuch", `${FIRMA.firmenbuch}, ${FIRMA.firmenbuchgericht}`],
  ["Eingetragen seit", "16. Februar 2012"],
  ["UID-Nummer", FIRMA.uid],
  ["GISA-Zahl", FIRMA.gisa],
  ["Gewerbe", FIRMA.gewerbe],
  ["Kammer", `${FIRMA.kammer} – ${FIRMA.innung}`],
  ["Geschäftsführer", FIRMA.geschaeftsfuehrer],
  ["Gesellschafter", gesellschafterText],
  ["Stammkapital", FIRMA.stammkapital],
];

const FAQ = [
  {
    q: "Wer steht hinter Ökovolt in Österreich?",
    a: `Betreiberin von oekovolt.com ist die ${FIRMA.name} mit Sitz in ${FIRMA.plz} ${FIRMA.ort} (${FIRMA.firmenbuch}, ${FIRMA.firmenbuchgericht}). Geschäftsführer ist ${FIRMA.geschaeftsfuehrer}. Gesellschafter sind ${gesellschafterText}.`,
  },
  {
    q: "Ist die Salzburg AG an Ökovolt beteiligt?",
    a: `Ja. Die Salzburg AG für Energie, Verkehr und Telekommunikation ist seit 2021 mit 49 % an der ${FIRMA.name} beteiligt; 51 % hält ${FIRMA.geschaeftsfuehrer}. Ökovolt ist bevorzugter PV-Errichter des Salzburg AG Konzerns.`,
  },
  {
    q: "Wie hängen oekovolt.com und oekovolt.de zusammen?",
    a: `Beide gehören zur Ökovolt Gruppe. Das Stammhaus ist die ${SCHWESTER.name} in ${SCHWESTER.ort} (Deutschland, gegründet 2010); sie setzt die technischen Standards und ist Inhaberin der Marken- und Websiterechte. Die österreichische ${FIRMA.name} ist eine eigenständige GmbH, die mit denselben Prozessen arbeitet und das Geschäft in Österreich verantwortet.`,
  },
  {
    q: "In welchen Bundesländern errichtet Ökovolt Photovoltaikanlagen?",
    a: `In allen neun Bundesländern. Der Sitz in ${FIRMA.ort} liegt im oberösterreichischen Innviertel direkt an der Grenze zu Salzburg; Projekte für Gewerbe, Industrie, Landwirtschaft und öffentliche Hand setzen wir österreichweit um.`,
  },
  {
    q: "Welche Technik entwickelt Ökovolt selbst?",
    a: `Einen eigenen Parkregler (EZA-Regler) für die Anforderungen der österreichischen Netzbetreiber, eigene Fernwartungssysteme und eigene SCADA-Systeme für Überwachung und Reporting. Digitalisierung und IT-Sicherheit entwickeln wir gemeinsam mit der ${SOLENSA.name}.`,
  },
  {
    q: "Was ist die ÖkoInvest GmbH?",
    a: `Die ÖkoInvest GmbH (FN 541505g, Sitz ${FIRMA.ort}) ist die Projektgesellschaft der Gruppe für Freiflächen-PV, Agri-PV, Contracting und PPA. Die ${FIRMA.name} ist mit 22,60 % beteiligt; die Geschäftsführung liegt bei Andreas Wegscheider und Manuel Thaler.`,
  },
];

const GEMEINSAM = [
  { icon: Users, title: "Das Team", text: "Gründer, zweite Generation und die Rollen hinter jeder Anlage.", href: "/uber-uns/team" },
  { icon: Briefcase, title: "Jobs in Österreich", text: "Projektleitung, Elektrotechnik, Netzanschluss, SCADA, Service und Lehre.", href: "/uber-uns/jobs" },
  { icon: Trophy, title: "Ökovolt PV Award", text: "Der jährliche Preis für die besten Anlagen unserer Kundinnen und Kunden.", href: "/pv-award" },
  { icon: HeartHandshake, title: "Sponsoring", text: "Vereine, Kultur, Bildung und Nachwuchs in Österreich – so fragen Sie an.", href: "/sponsoring" },
  { icon: Handshake, title: "Elektro-Partner werden", text: "Elektrotechnik-Betriebe bauen mit uns gemeinsam die Energiewende.", href: "/partner" },
  { icon: Building2, title: "Referenzen", text: "Anlagen für Gewerbe, Landwirtschaft und Gemeinden.", href: "/referenzen/projekte" },
];

export default function UberUnsPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "@id": `${PAGE_URL}/#webpage`,
    url: PAGE_URL,
    name: TITEL,
    description: BESCHREIBUNG,
    inLanguage: "de-AT",
    isPartOf: { "@id": `${BASE_URL}/#website` },
    about: { "@id": `${BASE_URL}/#organization` },
    dateModified: STAND,
    mainEntity: { "@id": `${BASE_URL}/#organization` },
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <PageHero
        breadcrumbs={[{ name: "Über uns" }]}
        eyebrow={PROFIL.kopf}
        title={
          <>
            Photovoltaik aus Ostermiething – <span className="ov-text-gradient">für ganz Österreich</span>
          </>
        }
        lead={PROFIL.lead}
        image={{
          src: "/Images/AT/unternehmen/salzach-ostermiething-tauernradweg.jpg",
          alt: "Tauernradweg an der Salzach im Gemeindegebiet von Ostermiething im Innviertel",
        }}
        points={["Firmensitz Ostermiething, Oberösterreich", "Alle neun Bundesländer", "Eigene Parkregler, Fernwartung & SCADA", "Salzburg AG seit 2021 Gesellschafterin"]}
        actions={[
          { label: "Projekt besprechen", href: "/termin" },
          { label: "Das Team", href: "/uber-uns/team", icon: Users },
        ]}
        badge={
          <div className="flex items-center gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-ov-500 text-white">
              <CalendarCheck2 aria-hidden="true" className="h-6 w-6" />
            </span>
            <div>
              <p className="font-display text-[22px] font-extrabold leading-none text-ink-900">
                seit 2012 <span className="text-[14px] font-semibold text-ink-500">in Österreich</span>
              </p>
              <p className="mt-1 text-[12.5px] leading-snug text-ink-500">{FIRMA.firmenbuch} · {FIRMA.firmenbuchgericht}</p>
            </div>
          </div>
        }
      />

      {/* Auf einen Blick */}
      <Section tone="white" space="lg">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <SectionHeading
            eyebrow="Auf einen Blick"
            title="Die Ökovolt Solartechnik GmbH"
            lead={`Die ${FIRMA.name} ist ein österreichischer Photovoltaik-Errichter mit Sitz in ${FIRMA.ort} (${FIRMA.bundesland}), eingetragen seit 16. Februar 2012 und Mitglied der ${FIRMA.kammer}. Alle Angaben sind im Firmenbuch und im GISA öffentlich überprüfbar.`}
          >
            <p className="mt-6 flex items-start gap-2 text-[14.5px] leading-relaxed text-ink-600">
              <MapPin aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-ov-600" />
              <span>
                Nachschlagen:{" "}
                <a href={FIRMA.wko} className="font-semibold text-ov-700 underline decoration-ov-300 underline-offset-4 hover:decoration-current" target="_blank" rel="noopener noreferrer">
                  WKO Firmen A–Z
                </a>{" "}
                ·{" "}
                <a href={FIRMA.firmenabc} className="font-semibold text-ov-700 underline decoration-ov-300 underline-offset-4 hover:decoration-current" target="_blank" rel="noopener noreferrer">
                  FirmenABC
                </a>
              </span>
            </p>
          </SectionHeading>
          <Reveal className="overflow-hidden rounded-3xl ring-1 ring-ink-200/70">
            <table className="w-full text-left text-[15px]">
              <caption className="sr-only">Unternehmensdaten der {FIRMA.name}</caption>
              <tbody className="divide-y divide-ink-100">
                {FAKTEN.map(([label, wert]) => (
                  <tr key={label} className="align-top odd:bg-sand-50/60">
                    <th scope="row" className="w-40 px-5 py-3.5 font-semibold text-ink-500 md:w-48">
                      {label}
                    </th>
                    <td className="px-5 py-3.5 text-ink-900">{wert}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Reveal>
        </div>
      </Section>

      {/* Standort */}
      <Section tone="sand" space="lg">
        <SplitMedia
          eyebrow="Standort"
          title="Innviertel, an der Grenze zu Salzburg"
          text={[
            `${FIRMA.ort} liegt im Bezirk Braunau am Inn, an der Salzach, die hier die Grenze zu Bayern bildet – und wenige Kilometer von der Stadt Salzburg entfernt. Von hier aus betreuen wir Projekte in allen neun Bundesländern.`,
            "Die Nähe zum Stammhaus in Türkheim ist kein Zufall: Einkauf, Planung und EDV laufen im Verbund, die Montage- und Serviceteams arbeiten nach denselben Standards.",
          ]}
          points={[
            { title: "Projektgeschäft", text: "Gewerbe, Industrie, Freifläche, Agri-PV, Gemeinden" },
            { title: "Eigene Technik", text: "Parkregler, Fernwartung, SCADA" },
            { title: "Service", text: "Wartung, Prüfung, Thermografie, Reinigung" },
          ]}
          image={{
            src: "/Images/Dienstleistungen/Photovoltaik/fuschl-am-see-scaled-1.jpg",
            alt: "Photovoltaikanlage auf einem Gebäude am Seeufer in Fuschl am See, Luftaufnahme",
          }}
          action={{ label: "Kontakt & Anfahrt", href: "/kontakt" }}
        />
      </Section>

      {/* Unternehmensgeschichte */}
      <Section tone="navy" space="lg" className="overflow-hidden" id="geschichte">
        <div aria-hidden="true" className="ov-grid-bg absolute inset-0" />
        <div aria-hidden="true" className="absolute -right-40 top-40 h-[480px] w-[480px] rounded-full bg-ov-500/20 blur-[130px]" />
        <SectionHeading
          dark
          eyebrow="Rolle, Gesellschafter, Geschichte"
          title={
            <>
              Errichter mit eigener Technik – <span className="ov-text-gradient-light">seit 2012 in Österreich</span>
            </>
          }
          lead="Was die österreichische Gesellschaft macht, wem sie gehört, woher sie kommt – und wie die Gruppe aufgebaut ist."
          align="center"
          className="mb-4"
        />
        <div className="relative">
          <RollenAt />
          <Partnerschaft />
          <div className="mt-20 md:mt-28">
            <p className="text-center text-[12.5px] font-semibold uppercase tracking-[0.16em] text-ov-300">Chronik</p>
            <h3 className="mt-3 text-center font-display text-[clamp(1.5rem,1.2rem+1.2vw,2.1rem)] font-extrabold leading-tight tracking-tight text-white">
              Von Türkheim nach Ostermiething
            </h3>
            <Zeitleiste />
          </div>
          <Haltung />
          <Ursprung />
          <Gruppe />
          <Register />
          <Claim />
        </div>
      </Section>

      {/* Gemeinsam */}
      <Section tone="white" space="lg">
        <SectionHeading
          eyebrow="Gemeinsam"
          title="Menschen, Karriere und Engagement"
          lead="Wer wir sind, zeigt sich auch daran, mit wem wir arbeiten: mit unserem Team, mit Elektrotechnik-Betrieben, mit Vereinen – und mit Kundinnen und Kunden, deren Anlagen wir jedes Jahr auszeichnen."
          className="mb-12"
        />
        <FeatureGrid items={GEMEINSAM} cols={3} />
      </Section>

      <Section tone="sand" space="lg">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <SectionHeading eyebrow="Häufige Fragen" title="Über die Ökovolt Solartechnik GmbH" />
          <Faq items={FAQ} />
        </div>
      </Section>

      <Querverweise pfad="/uber-uns" />
      <CtaBand
        eyebrow="Lernen Sie uns kennen"
        title="Ein Errichter, der selbst betreibt – für Ihr Projekt in Österreich."
        text="Erzählen Sie uns von Ihrem Vorhaben: Dach, Freifläche oder Gemeindeprojekt. Wir melden uns mit einer ersten Einschätzung zu Anlagengröße, Netzanschluss und Wirtschaftlichkeit."
        primary={{ label: "Projekt anfragen", href: "/angebot" }}
        secondary={{ label: "Termin buchen", href: "/termin", icon: CalendarCheck2 }}
      />
    </div>
  );
}
