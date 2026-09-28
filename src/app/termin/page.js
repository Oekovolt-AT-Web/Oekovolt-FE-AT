export const dynamic = "force-dynamic";
import { Suspense } from "react";
import {
  BadgeCheck,
  CalendarCheck2,
  Handshake,
  Home,
  PhoneCall,
  Ruler,
  Timer,
} from "lucide-react";
import { TERMIN_ARTEN } from "@/data/erreichbarkeit";
import { BASE_URL, FIRMA } from "@/lib/site";
import TerminBuchung from "@/components/Rueckruf/TerminBuchung";
import RueckrufFormular from "@/components/Rueckruf/RueckrufFormular";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import { Eyebrow } from "@/components/ui/SectionHeading";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import Steps from "@/components/ui/Steps";
import Faq from "@/components/ui/Faq";
import OeffnungsStatus, {
  OeffnungszeitenListe,
} from "@/components/Kontakt/OeffnungsStatus";
import { kalenderLaden } from "@/lib/terminKalender";

const TERMINARTEN = TERMIN_ARTEN.map((a) => a.titel); // same names as used when booking

const TAGE_VORAUS = 30;

const iso = (d) => d.toISOString().split("T")[0];

const PAGE_URL = `${BASE_URL}/termin`;
const TITEL = "PV-Beratungstermin online buchen | Ökovolt";
const BESCHREIBUNG =
  "Photovoltaik-Beratung für Betriebe, Landwirtschaft und Gemeinden in ganz Österreich online buchen: Telefon, Video oder vor Ort – oder Rückruf anfordern.";

export const metadata = {
  title: TITEL,
  description: BESCHREIBUNG,
  alternates: { canonical: PAGE_URL },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "de_AT",
    url: PAGE_URL,
    siteName: "Ökovolt Österreich",
    title: TITEL,
    description: BESCHREIBUNG,
    images: [
      {
        url: `${BASE_URL}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "Beratungstermin bei Ökovolt buchen",
      },
    ],
  },
};

const FAQ = [
  {
    q: "Was kostet die Beratung?",
    a: "Nichts. Telefon-, Video- und Vor-Ort-Beratung sind kostenlos und unverbindlich. Weitergehende Leistungen wie ein Energieaudit oder eine Ausführungsplanung vereinbaren wir – falls gewünscht – vorab gesondert mit Ihnen.",
  },
  {
    q: "Wie läuft die Video-Beratung ab?",
    a: "Sie erhalten mit der Bestätigung einen Link zur Video-Beratung – nutzbar am Computer, Tablet oder Smartphone. Am geteilten Bildschirm besprechen wir Luftbild und Belegung Ihrer Dach- oder Freifläche, Ihren Lastgang, die mögliche Anlagengröße, den Netzanschluss und die Wirtschaftlichkeit.",
  },
  {
    q: "Wie funktioniert der Rückruf?",
    a: "Sie geben Ihre Nummer und eine Wunschzeit innerhalb unserer Öffnungszeiten ein. Eine Beraterin oder ein Berater aus unserem Team in Ostermiething ruft Sie zu dieser Zeit an – ohne Callcenter.",
  },
  {
    q: "Kann ich den Termin verschieben?",
    a: `Ja, jederzeit und kostenfrei. Antworten Sie einfach auf die Bestätigungs-E-Mail oder rufen Sie uns unter ${FIRMA.telefon} an.`,
  },
  {
    q: "Was sollte ich zum Termin bereithalten?",
    a: "Für Betriebe ideal: die letzte Strom- und Netzrechnung (Jahresverbrauch, Netzebene, Leistungspreis), falls vorhanden den Lastgang in 15-Minuten-Werten vom Netzbetreiber, Dachpläne oder Fotos sowie Angaben zu Trafo bzw. Zählerplatz. Für eine erste Einschätzung reicht aber auch ein kurzes Gespräch.",
  },
  {
    q: "In welchem Gebiet sind Vor-Ort-Termine möglich?",
    a: "In ganz Österreich – in allen neun Bundesländern. Liegt Ihr Objekt weiter von Ostermiething (Oberösterreich) entfernt, stimmen wir den Vor-Ort-Termin vorab telefonisch ab und bündeln ihn mit anderen Terminen in der Region. Oft ist eine Video-Beratung mit Luftbild der schnellere erste Schritt.",
  },
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
      inLanguage: "de-AT",
      isPartOf: { "@id": "https://www.oekovolt.com/#website" },
      about: { "@id": "https://www.oekovolt.com/#organization" },
      potentialAction: {
        "@type": "ReserveAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: PAGE_URL,
          inLanguage: "de-AT",
          actionPlatform: [
            "https://schema.org/DesktopWebPlatform",
            "https://schema.org/MobileWebPlatform",
          ],
        },
        result: {
          "@type": "Reservation",
          name: "Kostenlose Photovoltaik-Beratung für Betriebe, Landwirtschaft und Gemeinden",
        },
      },
    },
    {
      "@type": "FAQPage",
      mainEntity: FAQ.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ],
};

export default async function TerminPage() {
  const heute = new Date();
  const ende = new Date(heute);
  ende.setDate(ende.getDate() + TAGE_VORAUS);

  // all Terminarten in parallel
  const ergebnisse = await Promise.all(
    TERMINARTEN.map((t) => kalenderLaden(t, iso(heute), iso(ende))),
  );
  const kalender = Object.fromEntries(
    TERMINARTEN.map((t, i) => [t, ergebnisse[i]]),
  );
  // → { "Telefon-Beratung": [...], "Video-Beratung": [...], "Vor-Ort-Beratung": [...] }

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <section className="ov-noise relative isolate overflow-hidden bg-navy-950 pb-40 pt-8 text-white md:pb-48 md:pt-12">
        <div aria-hidden="true" className="ov-grid-bg absolute inset-0 -z-10" />
        <div
          aria-hidden="true"
          className="absolute -left-32 top-10 -z-10 h-[420px] w-[420px] rounded-full bg-ov-500/25 blur-[120px]"
        />
        <div
          aria-hidden="true"
          className="absolute -right-20 -top-24 -z-10 h-[380px] w-[380px] rounded-full bg-sun-400/15 blur-[120px]"
        />
        <div className="ov-container">
          <Breadcrumbs
            dark
            items={[
              { name: "Kontakt", href: "/kontakt" },
              { name: "Termin buchen" },
            ]}
            className="ov-hero-in mb-10"
          />
          <div className="grid items-end gap-8 lg:grid-cols-[1fr_auto]">
            <div className="max-w-3xl">
              <div className="ov-hero-in" style={{ "--ov-delay": "60ms" }}>
                <Eyebrow dark className="mb-5">
                  Beratung online buchen
                </Eyebrow>
              </div>
              <h1
                className="ov-h1 ov-hero-in"
                style={{ "--ov-delay": "120ms" }}
              >
                Ihr Beratungstermin –{" "}
                <span className="ov-text-gradient-light">
                  in 60 Sekunden gebucht.
                </span>
              </h1>
              <p
                className="ov-lead ov-hero-in mt-6 max-w-2xl text-white/70"
                style={{ "--ov-delay": "200ms" }}
              >
                Telefon, Video oder vor Ort: Wählen Sie Ihren Wunschtermin aus
                unseren freien Zeiten. Kostenlos, unverbindlich und direkt mit
                unserem Team aus Ostermiething – für Projekte in ganz
                Österreich.
              </p>
            </div>
            <div
              className="ov-hero-in rounded-2xl bg-white/5 px-5 py-4 ring-1 ring-white/10"
              style={{ "--ov-delay": "260ms" }}
            >
              <OeffnungsStatus dark gross />
            </div>
          </div>
        </div>
      </section>

      <div className="ov-container relative z-10 -mt-32 pb-16 md:-mt-40 md:pb-24">
        <div className="ov-hero-in" style={{ "--ov-delay": "300ms" }}>
          <Suspense
            fallback={
              <div className="h-[640px] animate-pulse rounded-[2rem] bg-white shadow-xl" />
            }
          >
            <TerminBuchung kalender={kalender} />
          </Suspense>
        </div>
      </div>

      <Section tone="sand" space="lg" id="rueckruf">
        <div className="grid items-start gap-12 lg:grid-cols-[1fr_440px] lg:gap-20">
          <div>
            <SectionHeading
              eyebrow="Keine Zeit für Termine?"
              title={
                <>
                  Wir rufen Sie{" "}
                  <span className="ov-text-gradient">zu Ihrer Wunschzeit zurück.</span>
                </>
              }
              lead="Nummer und Wunschzeit eingeben – wir rufen Sie zur gewählten Zeit an. Ideal für eine erste Einordnung Ihres Projekts: Fläche, Verbrauch, Netzanschluss, Förderung."
            />
            <ul className="mt-10 grid gap-4 sm:grid-cols-2">
              {[
                {
                  icon: Timer,
                  t: "Rückruf zur Wunschzeit",
                  x: "Sie wählen den Zeitpunkt, wir rufen an – ohne Warteschleife.",
                },
                {
                  icon: BadgeCheck,
                  t: "Echte Fachleute",
                  x: "Kein Callcenter – Beratung direkt vom Elektrotechnik-Fachbetrieb.",
                },
                {
                  icon: CalendarCheck2,
                  t: "Auch außerhalb der Öffnungszeiten",
                  x: "Abends oder am Wochenende angefragt? Wir rufen zur nächsten gewählten Zeit an.",
                },
                {
                  icon: PhoneCall,
                  t: "Keine Werbeanrufe",
                  x: "Ihre Nummer nutzen wir nur für Ihre Anfrage.",
                },
              ].map((k) => (
                <li key={k.t} className="flex gap-3.5">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-ov-600 ring-1 ring-ov-200">
                    <k.icon aria-hidden="true" className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block text-[16px] font-semibold text-ink-900">
                      {k.t}
                    </span>
                    <span className="mt-0.5 block text-[14.5px] leading-relaxed text-ink-600">
                      {k.x}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-10 max-w-md rounded-3xl bg-white p-5 ring-1 ring-ink-200/70">
              <p className="mb-1 text-[13px] font-semibold uppercase tracking-[0.14em] text-ink-500">
                Öffnungszeiten
              </p>
              <OeffnungszeitenListe />
            </div>
          </div>
          <div className="rounded-[2rem] bg-white p-6 shadow-[0_30px_70px_-40px_rgba(15,23,42,0.45)] ring-1 ring-ink-200/70 md:p-8">
            <p className="mb-5 font-display text-[22px] font-extrabold tracking-tight text-ink-900">
              Rückruf anfordern
            </p>
            <RueckrufFormular />
          </div>
        </div>
      </Section>

      <Section tone="white" space="lg">
        <SectionHeading
          eyebrow="Nach dem Termin"
          title="So geht es weiter"
          align="center"
          className="mb-14"
        />
        <Steps
          items={[
            {
              icon: Handshake,
              title: "Beratung",
              text: "Wir klären Ziele, Lastgang, Fläche und Netzanschluss – und beantworten Ihre Fragen.",
            },
            {
              icon: Home,
              title: "Standort-Check",
              text: "Bei Bedarf prüfen wir Dach bzw. Freifläche, Statik, Schneelastzone und Trafo/Zählerplatz vor Ort.",
            },
            {
              icon: Ruler,
              title: "Planung & Angebot",
              text: "Sie erhalten ein transparentes Angebot mit Wirtschaftlichkeitsrechnung und Förderprüfung.",
            },
            {
              icon: CalendarCheck2,
              title: "Bau & Betrieb",
              text: "Netzantrag, Montage, Inbetriebnahme und Wartung – alles aus einer Hand.",
            },
          ]}
        />
      </Section>

      <Section tone="sand" space="lg">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <SectionHeading eyebrow="Fragen zum Termin" title="Gut zu wissen" />
          <Faq items={FAQ} schema={false} />
        </div>
      </Section>
    </div>
  );
}
