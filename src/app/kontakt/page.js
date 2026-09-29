import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, CalendarCheck, Clock, FileText, Mail, MapPin, Phone } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import Faq from "@/components/ui/Faq";
import CtaBand from "@/components/ui/CtaBand";
import Reveal from "@/components/ui/Reveal";
import AnfahrtKarte from "@/components/Kontakt/AnfahrtKarte";
import Wochenzeiten from "@/components/Kontakt/Wochenzeiten";
import Einzugsgebiet from "@/components/Team/Einzugsgebiet";
import { regionFuer } from "@/lib/regionen";
import KontaktFormular from "@/components/Kontakt/KontaktFormular";
import OeffnungsStatus from "@/components/Kontakt/OeffnungsStatus";
import { OEFFNUNGSZEITEN_KURZ } from "@/data/erreichbarkeit";
import { BASE_URL, FIRMA } from "@/lib/site";
import { hreflangLanguages } from "@/lib/hreflang";

const PAGE_URL = `${BASE_URL}/kontakt`;
const TITEL = "Kontakt: Photovoltaik in ganz Österreich | Ökovolt";
const BESCHREIBUNG =
  "Ökovolt Solartechnik GmbH in Ostermiething (OÖ): Photovoltaik für Betriebe, Landwirtschaft und Gemeinden in ganz Österreich. Telefon, E-Mail, Anfahrt.";
const ADRESSE_EINZEILIG = `${FIRMA.strasse}, ${FIRMA.plz} ${FIRMA.ort}`;
const ROUTE_URL = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${ADRESSE_EINZEILIG}, ${FIRMA.land}`)}`;

export const metadata = {
  alternates: { canonical: PAGE_URL, languages: hreflangLanguages(PAGE_URL) },
  title: TITEL,
  description: BESCHREIBUNG,
  keywords: ["Kontakt Ökovolt", "Photovoltaik Ostermiething", "Photovoltaik Oberösterreich", "PV-Errichter Salzburg", "Photovoltaik Gewerbe Österreich", "Ökovolt Österreich"],
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "de_AT",
    url: PAGE_URL,
    siteName: "Ökovolt Österreich",
    title: TITEL,
    description: BESCHREIBUNG,
    images: [{ url: `${BASE_URL}/og-image.jpg`, width: 1200, height: 630, alt: "Ökovolt Österreich" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITEL,
    description: BESCHREIBUNG,
    images: [`${BASE_URL}/og-image.jpg`],
  },
};

// Öffnungszeiten für Schema.org aus FIRMA ableiten ("Mo – Do" -> Monday … Thursday)
const TAGE_EN = { Mo: "Monday", Di: "Tuesday", Mi: "Wednesday", Do: "Thursday", Fr: "Friday", Sa: "Saturday", So: "Sunday" };
const TAGE_REIHE = Object.keys(TAGE_EN);
const oeffnungSchema = FIRMA.oeffnungszeiten.map((o) => {
  const [von, bis] = o.tage.split(/[–-]/).map((x) => x.trim());
  const tage = TAGE_REIHE.slice(TAGE_REIHE.indexOf(von), TAGE_REIHE.indexOf(bis || von) + 1).map((t) => TAGE_EN[t]);
  const [opens, closes] = o.zeit.split(/[–-]/).map((x) => x.trim());
  return { "@type": "OpeningHoursSpecification", dayOfWeek: tage, opens, closes };
});

const FAQ = [
  {
    q: "Wie schnell bekomme ich eine Antwort?",
    a: `Anfragen über das Formular oder per E-Mail bearbeiten wir während unserer Öffnungszeiten (${OEFFNUNGSZEITEN_KURZ}) der Reihe nach. Am schnellsten erreichen Sie uns telefonisch unter ${FIRMA.telefon}.`,
  },
  {
    q: "In welchen Regionen baut Ökovolt Photovoltaikanlagen?",
    a: `In ganz Österreich – in allen neun Bundesländern. Unser Firmensitz liegt in ${FIRMA.ort} im Innviertel (${FIRMA.bundesland}), direkt an der Grenze zu Salzburg. Für Gewerbe-, Freiflächen- und Gemeindeprojekte planen, bauen und betreuen wir Anlagen von Vorarlberg bis ins Burgenland.`,
  },
  {
    q: "Ist die Erstberatung kostenlos?",
    a: "Ja. Das Erstgespräch und eine erste Einschätzung zu Anlagengröße, Netzanschluss und Förderung kosten Sie nichts. Weitergehende Leistungen wie ein Energieaudit oder eine Ausführungsplanung vereinbaren wir – falls gewünscht – vorab gesondert mit Ihnen.",
  },
  {
    q: "Welche Unterlagen sollte ein Betrieb für das erste Gespräch bereithalten?",
    a: "Hilfreich sind die letzte Strom- und Netzrechnung (Jahresverbrauch, Netzebene, Leistungspreis), falls vorhanden der Lastgang in 15-Minuten-Werten – den stellt Ihr Netzbetreiber für Zählpunkte mit Lastprofilzähler bzw. Smart Meter bereit –, Dachpläne oder Fotos sowie Angaben zu Trafo bzw. Zählerplatz und geplanten Erweiterungen wie Ladepunkten.",
  },
  {
    q: "Kommen Sie für einen Vor-Ort-Termin zu uns?",
    a: "Ja. Nach einem ersten Gespräch sehen wir uns Dach oder Freifläche, Statik, Trafo bzw. Zählerplatz und Leitungswege direkt vor Ort an. Weiter entfernte Termine bündeln wir mit anderen Terminen in der Region.",
  },
  {
    q: "Kann ich Sie als Bestandskunde für Service oder Wartung kontaktieren?",
    a: "Selbstverständlich. Wählen Sie im Formular das Thema „Service & Wartung“ oder rufen Sie uns an – idealerweise mit Anlagenstandort, Anlagengröße und einer kurzen Fehlerbeschreibung. Auch Anlagen, die nicht von uns errichtet wurden, übernehmen wir nach einer Bestandsprüfung in die Wartung.",
  },
];

const contactSchema = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  "@id": `${PAGE_URL}/#webpage`,
  url: PAGE_URL,
  name: TITEL,
  description: BESCHREIBUNG,
  inLanguage: "de-AT",
  isPartOf: { "@id": `${BASE_URL}/#website` },
  about: { "@id": `${BASE_URL}/#organization` },
  mainEntity: {
    "@type": ["LocalBusiness", "Electrician"],
    "@id": `${BASE_URL}/#organization`,
    name: FIRMA.name,
    url: BASE_URL,
    telephone: FIRMA.telefon,
    email: FIRMA.email,
    image: `${BASE_URL}/og-image.jpg`,
    address: {
      "@type": "PostalAddress",
      streetAddress: FIRMA.strasse,
      postalCode: FIRMA.plz,
      addressLocality: FIRMA.ort,
      addressRegion: FIRMA.bundesland,
      addressCountry: "AT",
    },
    geo: { "@type": "GeoCoordinates", latitude: FIRMA.geo.lat, longitude: FIRMA.geo.lng },
    hasMap: ROUTE_URL,
    openingHoursSpecification: oeffnungSchema,
    areaServed: { "@type": "Country", name: "Österreich" },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: FIRMA.telefon,
      email: FIRMA.email,
      contactType: "customer service",
      areaServed: "AT",
      availableLanguage: ["German"],
    },
  },
};

export default function KontaktPage() {
  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema) }} />

      <PageHero
        breadcrumbs={[{ name: "Kontakt" }]}
        eyebrow={`Kontakt · ${FIRMA.ort}, ${FIRMA.bundesland}`}
        title={
          <>
            Sprechen Sie mit uns – <span className="ov-text-gradient">persönlich</span> und direkt.
          </>
        }
        lead={`Ob erste Idee oder ausschreibungsreifes Projekt: Unser Team aus ${FIRMA.ort} berät Betriebe, landwirtschaftliche Betriebe, Gemeinden und Eigentümer anspruchsvoller Objekte in ganz Österreich – zu Photovoltaik, Speicher, Ladeinfrastruktur und Service.`}
        image={{ src: "/Images/Dienstleistungen/Photovoltaik/fuschl-am-see-scaled-1.jpg", alt: "Photovoltaikanlage auf einer Freizeit- und Badeanlage am Fuschlsee im Bundesland Salzburg, Luftaufnahme" }}
        points={["Seit 2012 in Österreich", "Planung, Bau & Betrieb aus einer Hand", "Kostenloses Erstgespräch", "Einzugsgebiet: alle neun Bundesländer"]}
        actions={[
          { label: "Nachricht schreiben", href: "#formular" },
          { label: FIRMA.telefon, href: FIRMA.telefonHref, icon: Phone },
        ]}
        badge={
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-ink-500">Telefon · {FIRMA.telefon}</p>
            <OeffnungsStatus gross className="mt-3" />
          </div>
        }
      />

      {/* Drei Kontaktwege */}
      <Section tone="white" space="lg">
        <SectionHeading
          eyebrow="Ihr Weg zu uns"
          title="Drei Wege, ein Ansprechpartner"
          lead="Wählen Sie, was für Sie am bequemsten ist. Hinter jedem Weg sitzt dasselbe Team aus Ostermiething – kein Callcenter."
          align="center"
          className="mb-12 md:mb-16"
        />
        <ul className="grid gap-5 lg:grid-cols-3">
          <Reveal as="li" delay={0} className="flex">
            <a href={FIRMA.telefonHref} className="group ov-card-hover relative flex w-full flex-col overflow-hidden rounded-3xl bg-navy-950 p-7 text-white md:p-9">
              <div aria-hidden="true" className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-ov-500/30 blur-[80px]" />
              <span className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-ov-500 text-white transition-transform duration-300 group-hover:scale-110">
                <Phone aria-hidden="true" className="h-6 w-6" />
              </span>
              <h3 className="relative mt-8 text-[15px] font-semibold uppercase tracking-[0.14em] text-white/60">Anrufen</h3>
              <p className="relative mt-2 font-display text-[clamp(1.7rem,1.3rem+1.2vw,2.25rem)] font-extrabold leading-tight tracking-tight">{FIRMA.telefon}</p>
              <p className="relative mb-8 mt-3 text-[15.5px] leading-relaxed text-white/70">Der schnellste Weg: Viele Fragen zu Fläche, Netzanschluss und Förderung klären wir direkt am Telefon.</p>
              <div className="relative mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-6">
                <OeffnungsStatus dark gross />
                <ArrowUpRight aria-hidden="true" className="h-5 w-5 text-white/50 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white" />
              </div>
            </a>
          </Reveal>

          <Reveal as="li" delay={90} className="flex">
            <a href={`mailto:${FIRMA.email}`} className="group ov-card-hover relative flex w-full flex-col rounded-3xl bg-sand-50 p-7 ring-1 ring-ink-200/70 hover:ring-ov-200 md:p-9">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-ov-600 ring-1 ring-ink-200 transition-colors duration-300 group-hover:bg-ov-500 group-hover:text-white group-hover:ring-ov-500">
                <Mail aria-hidden="true" className="h-6 w-6" />
              </span>
              <h3 className="mt-8 text-[15px] font-semibold uppercase tracking-[0.14em] text-ink-600">E-Mail schreiben</h3>
              <p className="mt-2 font-display text-[clamp(1.35rem,1.1rem+0.8vw,1.75rem)] font-extrabold leading-tight tracking-tight text-ink-900">
                {FIRMA.email.split("@")[0]}
                <wbr />@{FIRMA.email.split("@")[1]}
              </p>
              <p className="mb-8 mt-3 text-[15.5px] leading-relaxed text-ink-600">Ideal für Lastgang, Netzrechnung, Dachpläne oder Ausschreibungsunterlagen.</p>
              <div className="mt-auto flex items-center justify-between gap-3 border-t border-ink-200/70 pt-6 text-[14px] font-semibold text-ov-700">
                E-Mail-Programm öffnen
                <ArrowUpRight aria-hidden="true" className="h-5 w-5 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </div>
            </a>
          </Reveal>

          <Reveal as="li" delay={180} className="flex">
            <Link href="/termin" className="group ov-card-hover relative flex w-full flex-col rounded-3xl bg-ov-50 p-7 ring-1 ring-ov-200/70 hover:ring-ov-300 md:p-9">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-ov-600 ring-1 ring-ov-200 transition-colors duration-300 group-hover:bg-ov-500 group-hover:text-white group-hover:ring-ov-500">
                <CalendarCheck aria-hidden="true" className="h-6 w-6" />
              </span>
              <h3 className="mt-8 text-[15px] font-semibold uppercase tracking-[0.14em] text-ink-600">Termin buchen</h3>
              <p className="mt-2 font-display text-[clamp(1.5rem,1.2rem+1vw,2rem)] font-extrabold leading-tight tracking-tight text-ink-900">Telefon, Video oder vor Ort</p>
              <p className="mb-8 mt-3 text-[15.5px] leading-relaxed text-ink-600">
                Freie Zeiten direkt online wählen – für den Vor-Ort-Termin kommen wir in ganz Österreich zu Ihnen.
              </p>
              <div className="mt-auto flex items-center justify-between gap-3 border-t border-ov-200/70 pt-6 text-[14px] font-semibold text-ov-700">
                Zur Terminbuchung
                <ArrowRight aria-hidden="true" className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          </Reveal>
        </ul>
      </Section>

      {/* Formular */}
      <Section tone="sand" space="lg" id="formular" className="scroll-mt-20">
        <div className="grid gap-10 lg:grid-cols-[1fr_380px] lg:gap-12">
          <Reveal className="rounded-[2rem] bg-white p-6 shadow-xl ring-1 ring-ink-200/70 sm:p-8 md:p-12">
            <p className="inline-flex items-center gap-2 text-[12.5px] font-semibold uppercase tracking-[0.16em] text-ov-600">
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-ov-500" />
              Kontaktformular
            </p>
            <h2 className="ov-h2 mt-4 text-ink-900">Schreiben Sie uns</h2>
            <p className="mt-4 max-w-xl text-[16.5px] leading-relaxed text-ink-600">
              Je genauer Sie Ihr Vorhaben beschreiben – Fläche, Jahresverbrauch, Netzebene, Zeitplan –, desto gezielter können wir antworten. Pflichtfelder sind mit <span className="text-ov-600">*</span> markiert.
            </p>
            <div className="mt-10">
              <KontaktFormular />
            </div>
          </Reveal>

          <div className="flex flex-col gap-5 lg:sticky lg:top-28 lg:self-start">
            <Reveal delay={80} className="relative overflow-hidden rounded-3xl bg-navy-950 p-7 text-white">
              <div aria-hidden="true" className="absolute -bottom-20 -right-16 h-52 w-52 rounded-full bg-ov-500/30 blur-[80px]" />
              <FileText aria-hidden="true" className="relative h-7 w-7 text-ov-300" />
              <h3 className="relative mt-5 font-display text-[22px] font-extrabold leading-tight">Sie möchten gleich ein Angebot?</h3>
              <p className="relative mt-3 text-[15px] leading-relaxed text-white/70">
                Im Angebots-Konfigurator erfassen Sie Objekt, Fläche, Verbrauch, Lastgang und Netzebene in rund zwei Minuten – so können wir direkt eine fundierte Ersteinschätzung erstellen.
              </p>
              <Link href="/angebot" className="group relative mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-ov-600 px-6 text-[15px] font-semibold text-white hover:bg-ov-700">
                Zum Angebots-Konfigurator
                <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Reveal>

            <Reveal delay={140} className="rounded-3xl bg-white p-6 ring-1 ring-ink-200/70 md:p-7">
              <h3 className="mb-4 flex items-center gap-2 font-display text-[18px] font-bold text-ink-900">
                <Clock aria-hidden="true" className="h-5 w-5 text-ov-600" />
                Öffnungszeiten
              </h3>
              <Wochenzeiten />
              <p className="mt-4 text-[13px] leading-relaxed text-ink-500">An gesetzlichen Feiertagen in Österreich sowie am 24. und 31. Dezember geschlossen.</p>
            </Reveal>

            <Reveal delay={200} className="rounded-3xl bg-white p-7 ring-1 ring-ink-200/70">
              <h3 className="flex items-center gap-2 font-display text-[18px] font-bold text-ink-900">
                <MapPin aria-hidden="true" className="h-5 w-5 text-ov-600" />
                Adresse
              </h3>
              <address className="mt-3 text-[15.5px] not-italic leading-relaxed text-ink-600">
                <strong className="font-semibold text-ink-900">{FIRMA.name}</strong>
                <br />
                {FIRMA.strasse}
                <br />
                {FIRMA.plz} {FIRMA.ort}
                <br />
                {FIRMA.land}
              </address>
              <a href="#anfahrt" className="mt-4 inline-flex min-h-11 items-center gap-2 text-[14.5px] font-semibold text-ov-700 hover:text-ov-800">
                Anfahrt ansehen
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </a>
            </Reveal>
          </div>
        </div>
      </Section>

      {/* Anfahrt */}
      <Section tone="white" space="lg" id="anfahrt" className="scroll-mt-20">
        <div className="mb-10 grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:items-end lg:gap-16">
          <SectionHeading
            eyebrow="Anfahrt"
            title={
              <>
                Besuchen Sie uns in <span className="ov-text-gradient">{FIRMA.ort}</span>
              </>
            }
            lead={`${FIRMA.ort} liegt im Innviertel (${FIRMA.bundesland}) an der Salzach, gut 30 Kilometer nördlich der Stadt Salzburg und direkt an der Grenze zu Bayern.`}
          />
          <Reveal className="flex items-center gap-4 rounded-3xl bg-sand-50 p-3 ring-1 ring-ink-200/60">
            <div className="relative h-24 w-28 shrink-0 overflow-hidden rounded-2xl bg-ink-100 sm:h-28 sm:w-40">
              <Image src="/Images/AT/unternehmen-b/pfarrkirche-ostermiething.jpg" alt="Ortskern von Ostermiething mit Pfarrkirche im Innviertel" fill sizes="160px" className="object-cover" />
            </div>
            <div className="min-w-0 pr-2">
              <p className="font-display text-[16.5px] font-bold text-ink-900">{FIRMA.name}</p>
              <p className="mt-1 text-[14px] leading-snug text-ink-600">{ADRESSE_EINZEILIG}</p>
              <p className="mt-1 text-[13px] text-ink-500">{OEFFNUNGSZEITEN_KURZ}</p>
              <a href={FIRMA.telefonHref} className="mt-2 inline-flex items-center gap-1.5 text-[14px] font-semibold text-ov-700 hover:text-ov-800">
                <Phone aria-hidden="true" className="h-4 w-4" />
                Besuch telefonisch vereinbaren
              </a>
            </div>
          </Reveal>
        </div>
        <Reveal>
          <AnfahrtKarte km={{ salzburg: regionFuer("salzburg")?.km, braunau: regionFuer("braunau")?.km }} />
        </Reveal>
      </Section>

      {/* Einzugsgebiet */}
      <Section tone="sand" space="lg" id="einzugsgebiet" className="scroll-mt-20">
        <SectionHeading
          eyebrow="Einzugsgebiet"
          title={<>Aus Ostermiething <span className="ov-text-gradient">für ganz Österreich</span></>}
          lead="Wir planen, errichten und betreuen Photovoltaikanlagen in allen neun Bundesländern – mit denselben Prozessen, eigener Regelungs- und Fernwartungstechnik und einem festen Projektleiter. Wählen Sie Ihr Bundesland."
          className="mb-12 max-w-3xl"
        />
        <Einzugsgebiet />
      </Section>

      {/* FAQ */}
      <Section tone="white" space="lg">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <SectionHeading eyebrow="Häufige Fragen" title="Vor dem ersten Gespräch" lead="Was Sie zur Kontaktaufnahme, Beratung und zum Vor-Ort-Termin wissen sollten." />
          <Faq items={FAQ} />
        </div>
      </Section>

      <CtaBand
        eyebrow="Kostenlos & unverbindlich"
        title="Lieber gleich konkret? Ihre Ersteinschätzung in zwei Minuten."
        text="Objekt, Fläche, Verbrauch und Netzanschluss angeben – wir melden uns mit einer fundierten Ersteinschätzung und einem festen Ansprechpartner für Ihr Projekt."
        primary={{ label: "Angebot anfragen", href: "/angebot" }}
        secondary={{ label: "Standort prüfen", href: "/standort-check" }}
      />
    </div>
  );
}
