import { Building2, CalendarCheck2, Car, ClipboardList, Factory, HandCoins, Landmark, LineChart, School, Sprout, Users, Zap } from "lucide-react";

import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import FeatureGrid from "@/components/ui/FeatureGrid";
import Steps from "@/components/ui/Steps";
import Faq from "@/components/ui/Faq";
import CtaBand from "@/components/ui/CtaBand";
import FolgenBox from "@/components/Kanaele/FolgenBox";
import MeldungKarte from "@/components/Kanaele/MeldungKarte";
import { veroeffentlichungen } from "@/lib/kanaele/veroeffentlichungen";
import { actorId } from "@/lib/kanaele/activitypub";

export const revalidate = 300;

const PAGE_URL = "https://www.oekovolt.com/kommunen";
const TITEL = "Photovoltaik für Kommunen & Stadtwerke | Ökovolt";
const BESCHREIBUNG =
  "PV auf Schulen, Rathäusern und Bauhöfen, Freiflächen- und Agri-PV, Quartiere, Ladeinfrastruktur und Monitoring – Planung und Umsetzung für Kommunen, Landkreise und Stadtwerke.";

export const metadata = {
  title: TITEL,
  description: BESCHREIBUNG,
  alternates: { canonical: PAGE_URL, types: { "application/activity+json": [{ url: actorId("oekovolt"), title: "@oekovolt@oekovolt.com" }] } },
  openGraph: { type: "website", locale: "de_AT", url: PAGE_URL, siteName: "Ökovolt Österreich", title: TITEL, description: BESCHREIBUNG, images: [{ url: "https://www.oekovolt.com/og-image.jpg", width: 1200, height: 630 }] },
  other: { "fediverse:creator": "@oekovolt@oekovolt.com" },
};

const FAQ = [
  {
    q: "Können Kommunen an Solarparks in ihrem Gebiet finanziell beteiligt werden?",
    a: "Ja. Nach § 6 EEG dürfen Betreiber von Freiflächenanlagen den betroffenen Gemeinden bis zu 0,2 ct je eingespeister Kilowattstunde zahlen – ohne Gegenleistung. Wir berücksichtigen das bei Planung und Wirtschaftlichkeitsrechnung.",
  },
  {
    q: "Wie läuft die Zusammenarbeit bei öffentlichen Ausschreibungen?",
    a: "Wir unterstützen bereits in der Bedarfsermittlung mit Ertragsprognosen, Dachbewertungen und Kostenschätzungen und beteiligen uns an Vergabeverfahren nach den jeweiligen Vorgaben. Sprechen Sie uns frühzeitig an – dann lassen sich Leistungsverzeichnisse realistisch aufsetzen.",
  },
  {
    q: "Welche Dächer eignen sich?",
    a: "Schulen, Turnhallen, Kitas, Bauhöfe, Feuerwehrhäuser, Kläranlagen und Verwaltungsgebäude haben oft große, ungenutzte Dachflächen und einen hohen Tagesverbrauch – ideal für hohen Eigenverbrauch. Entscheidend sind Statik, Dachzustand und Netzanschluss; das prüfen wir vor Ort.",
  },
  {
    q: "Wie bleiben wir über Neuigkeiten informiert – ohne kommerzielle Plattformen?",
    a: "Unser Newsroom ist über das Fediverse erreichbar: Folgen Sie @oekovolt@oekovolt.com direkt von Ihrem Mastodon-Konto aus – auch von Behörden-Instanzen. Alternativ gibt es RSS-Feeds und Push-Benachrichtigungen ohne Tracking.",
  },
];

export default async function KommunenPage() {
  const meldungen = (await veroeffentlichungen({ kanal: "website", kategorie: "Kommunen & Stadtwerke", limit: 3 })).slice(0, 3);

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              { "@type": "Service", name: "Photovoltaik für Kommunen und Stadtwerke", provider: { "@id": "https://www.oekovolt.com/#organization" }, areaServed: "DE", audience: { "@type": "Audience", audienceType: "Kommunen, Landkreise, Stadtwerke" }, url: PAGE_URL, description: BESCHREIBUNG },
              { "@type": "FAQPage", mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
            ],
          }),
        }}
      />

      <PageHero
        variant="immersive"
        breadcrumbs={[{ name: "Kommunen & Stadtwerke" }]}
        eyebrow="Für Kommunen, Landkreise & Stadtwerke"
        title={<>Die Energiewende vor Ort – <span className="ov-text-gradient-light">planbar umgesetzt.</span></>}
        lead="Photovoltaik auf öffentlichen Gebäuden, Freiflächen- und Agri-PV, Quartierslösungen und Ladeinfrastruktur: Wir planen, bauen und betreuen Anlagen, die kommunale Haushalte entlasten und Klimaschutzziele messbar machen."
        image={{ src: "/Images/Dienstleistungen/Photovoltaik/download-2.jpg", alt: "Photovoltaikanlagen auf Dächern einer Wohnsiedlung" }}
        actions={[
          { label: "Beratungstermin vereinbaren", href: "/termin?art=video" },
          { label: "Im Fediverse folgen", href: "#folgen", icon: Users },
        ]}
      />

      <Section tone="white" space="lg">
        <SectionHeading eyebrow="Einsatzfelder" title="Wo Kommunen am meisten gewinnen" className="mb-12" />
        <FeatureGrid
          cols={3}
          items={[
            { icon: School, title: "Schulen, Kitas & Turnhallen", text: "Große Dächer, hoher Tagesbedarf: Solarstrom wird direkt verbraucht – und wird zum Lernthema im Unterricht." },
            { icon: Landmark, title: "Rathaus & Verwaltung", text: "Eigenverbrauch senken, Stromkosten planbar machen und die Vorbildfunktion der öffentlichen Hand sichtbar zeigen." },
            { icon: Factory, title: "Bauhof, Kläranlage & Wasserwerk", text: "Energieintensive Betriebe mit Grundlast – ideal für PV mit Speicher und Lastmanagement." },
            { icon: Sprout, title: "Freiflächen- & Agri-PV", text: "Flächen doppelt nutzen, regionale Wertschöpfung stärken und Gemeinden über § 6 EEG an den Erträgen beteiligen." },
            { icon: Building2, title: "Quartiere & Mieterstrom", text: "Solarstrom für kommunale Wohnungsbaugesellschaften – mit Mieterstrom oder gemeinschaftlicher Gebäudeversorgung." },
            { icon: Car, title: "Ladeinfrastruktur & Fuhrpark", text: "Ladepunkte für Dienstfahrzeuge und Bürger, gesteuert nach Solarüberschuss und Netzkapazität." },
          ]}
        />
      </Section>

      <Section tone="sand" space="lg">
        <SectionHeading eyebrow="Vorgehen" title="Vom Beschluss zur laufenden Anlage" align="center" className="mb-14" />
        <Steps
          items={[
            { icon: ClipboardList, title: "Potenzialanalyse", text: "Liegenschaften, Verbräuche und Dachflächen bewerten – mit Ertragsprognose und Prioritätenliste für Gremien." },
            { icon: HandCoins, title: "Wirtschaftlichkeit & Förderung", text: "Investition, Eigenverbrauch, Einspeisung, Förderprogramme und Finanzierungsmodelle transparent gegenübergestellt." },
            { icon: Zap, title: "Planung & Umsetzung", text: "Netzanschluss, Statik, Genehmigung und Montage aus einer Hand – abgestimmt mit Bauamt und Netzbetreiber." },
            { icon: LineChart, title: "Monitoring & Berichte", text: "Laufende Überwachung, Wartung und Kennzahlen für Klimaschutzberichte und Öffentlichkeitsarbeit." },
          ]}
        />
      </Section>

      <Section tone="white" space="lg" id="folgen" className="scroll-mt-20">
        <div className="grid items-start gap-10 lg:grid-cols-[1fr_440px] lg:gap-16">
          <div>
            <SectionHeading
              eyebrow="Direkter Draht – ohne Algorithmus"
              title="Folgen Sie uns vom Behörden-Konto aus"
              lead="Immer mehr Kommunen, Landkreise und Stadtwerke kommunizieren über Mastodon und das Fediverse. Unser Newsroom ist dort direkt erreichbar: Leitfäden, Projektberichte und Neuigkeiten landen ohne Werbung und ohne Algorithmus in Ihrer Timeline – auch in Threads."
            />
            <ul className="mt-8 grid gap-3 text-[15.5px] text-ink-700">
              {[
                "Ein Klick auf „Folgen“ genügt – kein Konto bei einer kommerziellen Plattform nötig",
                "Beiträge mit Hashtags wie #Kommunen, #Stadtwerke und #Klimaschutz",
                "Alternativ: RSS-Feed für Intranet, Newsletter-Tools oder Ratsinformationssysteme",
              ].map((t) => (
                <li key={t} className="flex gap-3">
                  <CalendarCheck2 aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-ov-600" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <FolgenBox konten={["oekovolt", "ratgeber"]} pushThema="news" />
        </div>
      </Section>

      {meldungen.length > 0 && (
        <Section tone="sand" space="md">
          <SectionHeading eyebrow="Newsroom" title="Aktuelles für Kommunen & Stadtwerke" className="mb-8" />
          <div className="grid gap-5 md:grid-cols-3">
            {meldungen.map((m) => (
              <MeldungKarte key={m.slug} m={m} />
            ))}
          </div>
        </Section>
      )}

      <Section tone="white" space="lg">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <SectionHeading eyebrow="Häufige Fragen" title="Gut zu wissen für Verwaltung und Gremien" />
          <Faq items={FAQ} />
        </div>
      </Section>

      <CtaBand
        title="Lassen Sie uns Ihre Liegenschaften gemeinsam bewerten."
        text="Kostenloses Erstgespräch per Video oder vor Ort – mit ersten Zahlen zu Potenzial, Wirtschaftlichkeit und Förderung."
        primary={{ label: "Termin buchen", href: "/termin?art=video" }}
        secondary={{ label: "Zum Newsroom", href: "/presse?kategorie=Kommunen%20%26%20Stadtwerke", icon: Users }}
      />
    </div>
  );
}
