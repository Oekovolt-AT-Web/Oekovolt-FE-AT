import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, CalendarCheck, Clock, FileText, Mail, MapPin, Navigation, Phone } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import Faq from "@/components/ui/Faq";
import CtaBand from "@/components/ui/CtaBand";
import Reveal from "@/components/ui/Reveal";
import Map from "@/components/Kontakt/map";
import KontaktFormular from "@/components/Kontakt/KontaktFormular";
import OeffnungsStatus, { OeffnungszeitenListe } from "@/components/Kontakt/OeffnungsStatus";
import { hreflangLanguages } from "@/lib/hreflang";

const PAGE_URL = "https://www.oekovolt.de/kontakt";
const TITEL = "Kontakt & Beratung Photovoltaik Türkheim | Ökovolt";
const BESCHREIBUNG =
  "Ökovolt in Türkheim: Beratung zu Photovoltaik, Speicher & Wärmepumpe. Rufen Sie an (08245 96 788 0), schreiben Sie uns oder vereinbaren Sie einen Vor-Ort-Termin.";

export const metadata = {
  alternates: { canonical: PAGE_URL, languages: hreflangLanguages(PAGE_URL) },
  title: TITEL,
  description: BESCHREIBUNG,
  keywords: ["Kontakt Ökovolt", "Photovoltaik Beratung Türkheim", "Solarteur Allgäu", "Photovoltaik Anfrage", "Ökovolt Deutschland"],
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "de_DE",
    url: PAGE_URL,
    siteName: "Ökovolt Deutschland",
    title: TITEL,
    description: BESCHREIBUNG,
    images: [{ url: "https://www.oekovolt.de/og-image.jpg", width: 1200, height: 630, alt: "Ökovolt Deutschland" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITEL,
    description: BESCHREIBUNG,
    images: ["https://www.oekovolt.de/og-image.jpg"],
  },
};

const contactSchema = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  "@id": `${PAGE_URL}/#webpage`,
  url: PAGE_URL,
  name: "Kontakt | Ökovolt Deutschland",
  description: BESCHREIBUNG,
  isPartOf: { "@id": "https://www.oekovolt.de/#website" },
  about: { "@id": "https://www.oekovolt.de/#organization" },
  mainEntity: {
    "@type": ["LocalBusiness", "Electrician"],
    "@id": "https://www.oekovolt.de/#organization",
    name: "ÖKOVOLT GmbH Solartechnik",
    telephone: "+49 8245 96 788 0",
    email: "office@oekovolt.de",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Schlingener Straße 1a",
      postalCode: "86842",
      addressLocality: "Türkheim",
      addressRegion: "Bayern",
      addressCountry: "DE",
    },
    openingHoursSpecification: [
      { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday"], opens: "08:00", closes: "16:00" },
      { "@type": "OpeningHoursSpecification", dayOfWeek: "Friday", opens: "08:00", closes: "13:00" },
    ],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+49 8245 96 788 0",
      email: "office@oekovolt.de",
      contactType: "customer service",
      areaServed: "DE",
      availableLanguage: ["German"],
    },
  },
};

const ROUTE_URL = "https://www.google.com/maps/dir/?api=1&destination=Schlingener+Str.+1a,+86842+T%C3%BCrkheim,+Germany";

const FAQ = [
  {
    q: "Wie schnell bekomme ich eine Antwort?",
    a: "Anfragen über das Formular oder per E-Mail bearbeiten wir während unserer Öffnungszeiten (Mo–Do 8–16 Uhr, Fr 8–13 Uhr) so schnell wie möglich. Am schnellsten erreichen Sie uns telefonisch unter 08245 96 788 0.",
  },
  {
    q: "Ist die Beratung kostenlos?",
    a: "Ja. Das Erstgespräch und ein unverbindliches Angebot für Ihre Photovoltaikanlage, Ihren Stromspeicher oder Ihre Wärmepumpe kosten Sie nichts.",
  },
  {
    q: "Welche Unterlagen sollte ich für die Beratung bereithalten?",
    a: "Hilfreich sind Ihr Jahresstromverbrauch (Stromrechnung), Fotos von Dach und Zählerschrank sowie – falls vorhanden – Pläne des Hauses. Planen Sie ein E-Auto oder eine Wärmepumpe, sagen Sie uns das gleich mit; das beeinflusst Anlagen- und Speichergröße.",
  },
  {
    q: "Kommen Sie für einen Vor-Ort-Termin zu mir?",
    a: "Ja. Nach einem ersten Gespräch schauen wir uns auf Wunsch Dach, Statik, Zählerschrank und Leitungswege direkt bei Ihnen an. So wird das Angebot belastbar und es gibt bei der Montage keine Überraschungen.",
  },
  {
    q: "Ich möchte direkt ein Angebot – wie geht das am schnellsten?",
    a: "Nutzen Sie unsere Online-Angebotsanfrage. In rund zwei Minuten beantworten Sie ein paar Fragen zu Dach und Verbrauch, und wir melden uns mit einem passenden Vorschlag.",
  },
  {
    q: "Kann ich Sie auch als Bestandskunde für Service oder Wartung kontaktieren?",
    a: "Selbstverständlich. Wählen Sie im Formular das Thema „Service & Wartung“ oder rufen Sie uns an – idealerweise mit Angaben zu Ihrer Anlage und einer kurzen Fehlerbeschreibung.",
  },
];

export default function KontaktPage() {
  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema) }} />

      <PageHero
        breadcrumbs={[{ name: "Kontakt" }]}
        eyebrow="Kontakt · Türkheim im Allgäu"
        title={
          <>
            Sprechen Sie mit uns – <span className="ov-text-gradient">persönlich</span> und direkt.
          </>
        }
        lead="Ob erste Idee oder konkretes Projekt: Unser Team aus Türkheim berät Sie ehrlich zu Photovoltaik, Stromspeicher, Wallbox und Wärmepumpe – am Telefon, per E-Mail oder bei Ihnen vor Ort."
        image={{ src: "/Images/Kontakt/download.jpg", alt: "Photovoltaikmodule auf einem Dach – montiert von Ökovolt" }}
        points={["Fachbetrieb mit über 15 Jahren Erfahrung", "Planung, Montage & Anmeldung aus einer Hand", "Kostenlose, unverbindliche Beratung", "Fester Ansprechpartner"]}
        actions={[
          { label: "Nachricht schreiben", href: "#formular" },
          { label: "08245 96 788 0", href: "tel:+498245967880", icon: Phone },
        ]}
        badge={
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-ink-500">Telefon · 08245 96 788 0</p>
            <OeffnungsStatus gross className="mt-3" />
          </div>
        }
      />

      {/* Drei Kontaktwege */}
      <Section tone="white" space="lg">
        <SectionHeading
          eyebrow="Ihr Weg zu uns"
          title="Drei Wege, ein Ansprechpartner"
          lead="Wählen Sie, was für Sie am bequemsten ist. Hinter jedem Weg sitzt dasselbe Team – kein Callcenter."
          align="center"
          className="mb-12 md:mb-16"
        />
        <ul className="grid gap-5 lg:grid-cols-3">
          <Reveal as="li" delay={0} className="flex">
            <a
              href="tel:+498245967880"
              className="group ov-card-hover relative flex w-full flex-col overflow-hidden rounded-3xl bg-navy-950 p-7 text-white md:p-9"
            >
              <div aria-hidden="true" className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-ov-500/30 blur-[80px]" />
              <span className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-ov-500 text-white transition-transform duration-300 group-hover:scale-110">
                <Phone aria-hidden="true" className="h-6 w-6" />
              </span>
              <h3 className="relative mt-8 text-[15px] font-semibold uppercase tracking-[0.14em] text-white/60">Anrufen</h3>
              <p className="relative mt-2 font-display text-[clamp(1.7rem,1.3rem+1.2vw,2.25rem)] font-extrabold leading-tight tracking-tight">08245 96 788 0</p>
              <p className="relative mb-8 mt-3 text-[15.5px] leading-relaxed text-white/70">Der schnellste Weg: Fragen klären wir oft direkt am Telefon.</p>
              <div className="relative mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-6">
                <OeffnungsStatus dark gross />
                <ArrowUpRight aria-hidden="true" className="h-5 w-5 text-white/50 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white" />
              </div>
            </a>
          </Reveal>

          <Reveal as="li" delay={90} className="flex">
            <a
              href="mailto:office@oekovolt.de"
              className="group ov-card-hover relative flex w-full flex-col rounded-3xl bg-sand-50 p-7 ring-1 ring-ink-200/70 hover:ring-ov-200 md:p-9"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-ov-600 ring-1 ring-ink-200 transition-colors duration-300 group-hover:bg-ov-500 group-hover:text-white group-hover:ring-ov-500">
                <Mail aria-hidden="true" className="h-6 w-6" />
              </span>
              <h3 className="mt-8 text-[15px] font-semibold uppercase tracking-[0.14em] text-ink-500">E-Mail schreiben</h3>
              <p className="mt-2 break-all font-display text-[clamp(1.5rem,1.2rem+1vw,2rem)] font-extrabold leading-tight tracking-tight text-ink-900">office@oekovolt.de</p>
              <p className="mb-8 mt-3 text-[15.5px] leading-relaxed text-ink-600">Ideal für Unterlagen, Fotos vom Dach oder Ihre Stromrechnung.</p>
              <div className="mt-auto flex items-center justify-between gap-3 border-t border-ink-200/70 pt-6 text-[14px] font-semibold text-ov-700">
                E-Mail-Programm öffnen
                <ArrowUpRight aria-hidden="true" className="h-5 w-5 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </div>
            </a>
          </Reveal>

          <Reveal as="li" delay={180} className="flex">
            <Link
              href="#formular"
              className="group ov-card-hover relative flex w-full flex-col rounded-3xl bg-ov-50 p-7 ring-1 ring-ov-200/70 hover:ring-ov-300 md:p-9"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-ov-600 ring-1 ring-ov-200 transition-colors duration-300 group-hover:bg-ov-500 group-hover:text-white group-hover:ring-ov-500">
                <CalendarCheck aria-hidden="true" className="h-6 w-6" />
              </span>
              <h3 className="mt-8 text-[15px] font-semibold uppercase tracking-[0.14em] text-ink-500">Vor-Ort-Termin</h3>
              <p className="mt-2 font-display text-[clamp(1.5rem,1.2rem+1vw,2rem)] font-extrabold leading-tight tracking-tight text-ink-900">Wir kommen zu Ihnen</p>
              <p className="mb-8 mt-3 text-[15.5px] leading-relaxed text-ink-600">
                Dach, Zählerschrank und Verbrauch gemeinsam ansehen – für ein Angebot ohne Überraschungen.
              </p>
              <div className="mt-auto flex items-center justify-between gap-3 border-t border-ov-200/70 pt-6 text-[14px] font-semibold text-ov-700">
                Termin anfragen
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
              Je genauer Sie Ihr Vorhaben beschreiben, desto gezielter können wir antworten. Pflichtfelder sind mit <span className="text-ov-600">*</span> markiert.
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
                Mit der Angebotsanfrage erfassen Sie Dach, Verbrauch und Wünsche in rund zwei Minuten – so können wir Ihnen direkt einen passenden
                Vorschlag machen.
              </p>
              <Link
                href="/angebot"
                className="group relative mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-ov-500 px-6 text-[15px] font-semibold text-white hover:bg-ov-600"
              >
                Zur Angebotsanfrage
                <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Reveal>

            <Reveal delay={140} className="rounded-3xl bg-white p-7 ring-1 ring-ink-200/70">
              <h3 className="flex items-center gap-2 font-display text-[18px] font-bold text-ink-900">
                <Clock aria-hidden="true" className="h-5 w-5 text-ov-600" />
                Öffnungszeiten
              </h3>
              <OeffnungsStatus className="mt-3" />
              <OeffnungszeitenListe className="mt-4" />
            </Reveal>

            <Reveal delay={200} className="rounded-3xl bg-white p-7 ring-1 ring-ink-200/70">
              <h3 className="flex items-center gap-2 font-display text-[18px] font-bold text-ink-900">
                <MapPin aria-hidden="true" className="h-5 w-5 text-ov-600" />
                Adresse
              </h3>
              <address className="mt-3 text-[15.5px] not-italic leading-relaxed text-ink-600">
                <strong className="font-semibold text-ink-900">ÖKOVOLT GmbH Solartechnik</strong>
                <br />
                Schlingener Straße 1a
                <br />
                86842 Türkheim
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
        <div className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div>
            <SectionHeading
              eyebrow="Anfahrt"
              title={
                <>
                  Besuchen Sie uns in <span className="ov-text-gradient">Türkheim</span>
                </>
              }
              lead="Unser Firmensitz liegt im Unterallgäu, zwischen Mindelheim und Buchloe – nur wenige Minuten von der A96 entfernt."
            />
            <Reveal className="mt-8 flex items-center gap-5 rounded-3xl bg-sand-50 p-4 ring-1 ring-ink-200/60">
              <div className="relative h-24 w-32 shrink-0 overflow-hidden rounded-2xl bg-ink-100 sm:h-28 sm:w-40">
                <Image src="/Images/Kontakt/download-1.jpg" alt="Firmensitz von Ökovolt in Türkheim (Bayern)" fill sizes="160px" className="object-cover" />
              </div>
              <div className="min-w-0">
                <p className="font-display text-[17px] font-bold text-ink-900">Ökovolt Zentrale</p>
                <p className="mt-1 text-[14.5px] leading-snug text-ink-600">Schlingener Straße 1a, 86842 Türkheim</p>
                <p className="mt-1 text-[13px] text-ink-500">Mo–Do 8–16 · Fr 8–13 Uhr</p>
              </div>
            </Reveal>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <a
                href={ROUTE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-navy-700 px-6 text-[15px] font-semibold text-white hover:bg-navy-800"
              >
                <Navigation aria-hidden="true" className="h-4 w-4" />
                Route planen
              </a>
              <a
                href="tel:+498245967880"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full px-6 text-[15px] font-semibold text-ink-900 ring-1 ring-inset ring-ink-200 hover:bg-ink-50"
              >
                <Phone aria-hidden="true" className="h-4 w-4" />
                Termin telefonisch vereinbaren
              </a>
            </div>
          </div>
          <Reveal dir="right" className="overflow-hidden rounded-[2rem] shadow-xl ring-1 ring-ink-200/70">
            <Map />
          </Reveal>
        </div>
      </Section>

      {/* FAQ */}
      <Section tone="sand" space="lg">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <SectionHeading
            eyebrow="Häufige Fragen"
            title="Vor dem ersten Gespräch"
            lead="Was Sie zur Kontaktaufnahme, Beratung und zum Vor-Ort-Termin wissen sollten."
          />
          <Faq items={FAQ} />
        </div>
      </Section>

      <CtaBand
        eyebrow="Kostenlos & unverbindlich"
        title="Lieber gleich konkret? Ihr Angebot in zwei Minuten."
        primary={{ label: "Angebot anfragen", href: "/angebot" }}
        secondary={{ label: "Solarertrag berechnen", href: "/solarrechner" }}
      />
    </div>
  );
}
