import { Suspense } from "react";
import { BadgeCheck, CalendarCheck2, Handshake, Home, PhoneCall, Ruler, Timer } from "lucide-react";

import TerminBuchung from "@/components/Rueckruf/TerminBuchung";
import RueckrufFormular from "@/components/Rueckruf/RueckrufFormular";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import { Eyebrow } from "@/components/ui/SectionHeading";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import Steps from "@/components/ui/Steps";
import Faq from "@/components/ui/Faq";
import OeffnungsStatus, { OeffnungszeitenListe } from "@/components/Kontakt/OeffnungsStatus";

const PAGE_URL = "https://www.oekovolt.de/termin";
const TITEL = "Beratungstermin online buchen – Photovoltaik | Ökovolt";
const BESCHREIBUNG =
  "Kostenlose Photovoltaik-Beratung direkt online buchen: per Telefon, Video oder vor Ort. Freie Termine in Echtzeit – oder Sofort-Rückruf anfordern.";

export const metadata = {
  title: TITEL,
  description: BESCHREIBUNG,
  alternates: { canonical: PAGE_URL },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "de_DE",
    url: PAGE_URL,
    siteName: "Ökovolt Deutschland",
    title: TITEL,
    description: BESCHREIBUNG,
    images: [{ url: "https://www.oekovolt.de/og-image.jpg", width: 1200, height: 630, alt: "Beratungstermin bei Ökovolt buchen" }],
  },
};

const FAQ = [
  { q: "Was kostet die Beratung?", a: "Nichts. Telefon-, Video- und Vor-Ort-Beratung sind kostenlos und unverbindlich – Sie gehen keinerlei Verpflichtung ein." },
  { q: "Wie läuft die Video-Beratung ab?", a: "Sie erhalten mit der Bestätigung einen Link zur Video-Beratung – nutzbar am Computer, Tablet oder Smartphone. Am geteilten Bildschirm besprechen wir Ihr Dach, die mögliche Anlagengröße und die Wirtschaftlichkeit." },
  { q: "Wie funktioniert der Sofort-Rückruf?", a: "Sie geben Ihre Nummer ein – ist eine Beraterin oder ein Berater frei, klingelt Ihr Telefon in der Regel innerhalb einer Minute. Außerhalb unserer Öffnungszeiten wählen Sie einfach eine Wunschzeit." },
  { q: "Kann ich den Termin verschieben?", a: "Ja, jederzeit und kostenfrei. Antworten Sie einfach auf die Bestätigungs-E-Mail oder rufen Sie uns unter 08245 96 788 0 an." },
  { q: "Was sollte ich zum Termin bereithalten?", a: "Ideal sind Ihre letzte Stromrechnung (Jahresverbrauch), grobe Angaben zum Dach und – falls vorhanden – Fotos von Dach und Zählerschrank. Für eine erste Einschätzung reicht aber auch ein kurzes Gespräch." },
  { q: "In welchem Gebiet sind Vor-Ort-Termine möglich?", a: "Das hängt von Ihrem Standort und dem Projekt ab. Liegt Ihr Objekt weiter von Türkheim entfernt, stimmen wir den Vor-Ort-Termin vorab telefonisch mit Ihnen ab – oft ist eine Video-Beratung der schnellere erste Schritt." },
];

const schema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${PAGE_URL}#webpage`,
      url: PAGE_URL,
      name: TITEL,
      description: BESCHREIBUNG,
      inLanguage: "de-DE",
      isPartOf: { "@id": "https://www.oekovolt.de/#website" },
      about: { "@id": "https://www.oekovolt.de/#organization" },
      potentialAction: {
        "@type": "ReserveAction",
        target: { "@type": "EntryPoint", urlTemplate: PAGE_URL, inLanguage: "de-DE", actionPlatform: ["https://schema.org/DesktopWebPlatform", "https://schema.org/MobileWebPlatform"] },
        result: { "@type": "Reservation", name: "Kostenlose Photovoltaik-Beratung" },
      },
    },
    {
      "@type": "FAQPage",
      mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
    },
  ],
};

export default function TerminPage() {
  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <section className="ov-noise relative isolate overflow-hidden bg-navy-950 pb-40 pt-8 text-white md:pb-48 md:pt-12">
        <div aria-hidden="true" className="ov-grid-bg absolute inset-0 -z-10" />
        <div aria-hidden="true" className="absolute -left-32 top-10 -z-10 h-[420px] w-[420px] rounded-full bg-ov-500/25 blur-[120px]" />
        <div aria-hidden="true" className="absolute -right-20 -top-24 -z-10 h-[380px] w-[380px] rounded-full bg-sun-400/15 blur-[120px]" />
        <div className="ov-container">
          <Breadcrumbs dark items={[{ name: "Kontakt", href: "/kontakt" }, { name: "Termin buchen" }]} className="ov-hero-in mb-10" />
          <div className="grid items-end gap-8 lg:grid-cols-[1fr_auto]">
            <div className="max-w-3xl">
              <div className="ov-hero-in" style={{ "--ov-delay": "60ms" }}>
                <Eyebrow dark className="mb-5">Beratung online buchen</Eyebrow>
              </div>
              <h1 className="ov-h1 ov-hero-in" style={{ "--ov-delay": "120ms" }}>
                Ihr Beratungstermin – <span className="ov-text-gradient-light">in 60 Sekunden gebucht.</span>
              </h1>
              <p className="ov-lead ov-hero-in mt-6 max-w-2xl text-white/70" style={{ "--ov-delay": "200ms" }}>
                Telefon, Video oder vor Ort: Wählen Sie Ihren Wunschtermin aus unseren freien Zeiten. Kostenlos, unverbindlich und mit einem echten Fachberater aus Türkheim.
              </p>
            </div>
            <div className="ov-hero-in rounded-2xl bg-white/5 px-5 py-4 ring-1 ring-white/10" style={{ "--ov-delay": "260ms" }}>
              <OeffnungsStatus dark gross />
            </div>
          </div>
        </div>
      </section>

      <div className="ov-container relative z-10 -mt-32 pb-16 md:-mt-40 md:pb-24">
        <div className="ov-hero-in" style={{ "--ov-delay": "300ms" }}>
          <Suspense fallback={<div className="h-[640px] animate-pulse rounded-[2rem] bg-white shadow-xl" />}>
            <TerminBuchung />
          </Suspense>
        </div>
      </div>

      <Section tone="sand" space="lg" id="rueckruf">
        <div className="grid items-start gap-12 lg:grid-cols-[1fr_440px] lg:gap-20">
          <div>
            <SectionHeading
              eyebrow="Keine Zeit für Termine?"
              title={<>Wir rufen Sie <span className="ov-text-gradient">sofort zurück.</span></>}
              lead="Nummer eingeben – ist ein Berater frei, klingelt Ihr Telefon in der Regel in unter einer Minute. Außerhalb der Öffnungszeiten rufen wir zu Ihrer Wunschzeit an."
            />
            <ul className="mt-10 grid gap-4 sm:grid-cols-2">
              {[
                { icon: Timer, t: "Rückruf in Sekunden", x: "Automatische Verbindung mit einem freien Fachberater." },
                { icon: BadgeCheck, t: "Echte Fachleute", x: "Kein Callcenter – Beratung direkt vom Fachbetrieb." },
                { icon: CalendarCheck2, t: "Wunschzeit möglich", x: "Abends oder am Wochenende angefragt? Wir rufen pünktlich an." },
                { icon: PhoneCall, t: "Keine Werbeanrufe", x: "Ihre Nummer nutzen wir nur für Ihre Anfrage." },
              ].map((k) => (
                <li key={k.t} className="flex gap-3.5">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-ov-600 ring-1 ring-ov-200">
                    <k.icon aria-hidden="true" className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block text-[16px] font-semibold text-ink-900">{k.t}</span>
                    <span className="mt-0.5 block text-[14.5px] leading-relaxed text-ink-600">{k.x}</span>
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-10 max-w-md rounded-3xl bg-white p-5 ring-1 ring-ink-200/70">
              <p className="mb-1 text-[13px] font-semibold uppercase tracking-[0.14em] text-ink-500">Öffnungszeiten</p>
              <OeffnungszeitenListe />
            </div>
          </div>
          <div className="rounded-[2rem] bg-white p-6 shadow-[0_30px_70px_-40px_rgba(15,23,42,0.45)] ring-1 ring-ink-200/70 md:p-8">
            <p className="mb-5 font-display text-[22px] font-extrabold tracking-tight text-ink-900">Rückruf anfordern</p>
            <RueckrufFormular />
          </div>
        </div>
      </Section>

      <Section tone="white" space="lg">
        <SectionHeading eyebrow="Nach dem Termin" title="So geht es weiter" align="center" className="mb-14" />
        <Steps
          items={[
            { icon: Handshake, title: "Beratung", text: "Wir klären Ziele, Verbrauch und Dach – und beantworten alle Fragen." },
            { icon: Home, title: "Dach-Check", text: "Bei Bedarf prüfen wir Dach, Statik und Zählerschrank direkt vor Ort." },
            { icon: Ruler, title: "Planung & Angebot", text: "Sie erhalten ein transparentes Angebot mit Wirtschaftlichkeitsrechnung." },
            { icon: CalendarCheck2, title: "Montage", text: "Installation, Anmeldung und Inbetriebnahme – alles aus einer Hand." },
          ]}
        />
      </Section>

      <Section tone="sand" space="lg">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <SectionHeading eyebrow="Fragen zum Termin" title="Gut zu wissen" />
          <Faq items={FAQ} />
        </div>
      </Section>
    </div>
  );
}
