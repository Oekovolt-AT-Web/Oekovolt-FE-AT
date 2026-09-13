import Link from "next/link";
import { EyeOff, FileLock2, KeyRound, Scale, ShieldCheck, UserCheck } from "lucide-react";

import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import FeatureGrid from "@/components/ui/FeatureGrid";
import Steps from "@/components/ui/Steps";
import Faq from "@/components/ui/Faq";
import Reveal from "@/components/ui/Reveal";
import MeldeFormular from "@/components/Hinweisgeber/MeldeFormular";
import { ABLAUF, FAQ } from "@/data/hinweisgeber";

const PAGE_URL = "https://www.oekovolt.de/hinweisgebersystem";
const TITEL = "Hinweisgebersystem – vertraulich melden | Ökovolt";
const BESCHREIBUNG =
  "Verstöße vertraulich und auf Wunsch anonym melden: das interne Hinweisgebersystem der ÖKOVOLT GmbH Solartechnik nach dem Hinweisgeberschutzgesetz (HinSchG).";

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
    images: [{ url: "https://www.oekovolt.de/og-image.jpg", width: 1200, height: 630, alt: "Ökovolt Hinweisgebersystem" }],
  },
};

const schema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": `${PAGE_URL}/#webpage`,
  url: PAGE_URL,
  name: TITEL,
  description: BESCHREIBUNG,
  isPartOf: { "@id": "https://www.oekovolt.de/#website" },
  about: { "@id": "https://www.oekovolt.de/#organization" },
};

export default function HinweisgebersystemPage() {
  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <PageHero
        variant="dark"
        breadcrumbs={[{ name: "Hinweisgebersystem" }]}
        eyebrow="Hinweisgeberschutzgesetz (HinSchG)"
        title={<>Verstöße melden – <span className="ov-text-gradient-light">vertraulich und sicher.</span></>}
        lead="Ihr Hinweis hilft uns, Fehlverhalten aufzudecken und abzustellen. Über dieses Portal erreichen Sie direkt die unabhängige interne Meldestelle der ÖKOVOLT GmbH Solartechnik – auf Wunsch vollständig anonym."
        points={["Anonym möglich", "Keine Speicherung Ihrer IP-Adresse", "Schutz vor Repressalien", "Rückmeldung innerhalb von 3 Monaten"]}
        actions={[
          { label: "Meldung abgeben", href: "#meldung" },
          { label: "Zum Postfach", href: "/hinweisgebersystem/postfach", icon: KeyRound },
        ]}
      />

      <Section tone="sand" space="lg" id="meldung" className="scroll-mt-24">
        <SectionHeading
          eyebrow="Meldung abgeben"
          title="In vier Schritten zur vertraulichen Meldung"
          lead="Sie benötigen etwa 5 bis 10 Minuten. Ihre Eingaben werden erst beim Absenden übertragen und nicht im Browser gespeichert."
          className="mb-10"
        />
        <MeldeFormular />
      </Section>

      <Section tone="white" space="lg">
        <SectionHeading eyebrow="So funktioniert es" title="Was nach Ihrer Meldung passiert" align="center" className="mb-14" />
        <Steps items={ABLAUF} />
      </Section>

      <Section tone="navy" space="lg" className="overflow-hidden">
        <div aria-hidden="true" className="ov-grid-bg absolute inset-0" />
        <div className="relative">
          <SectionHeading dark eyebrow="Ihr Schutz" title="Vertraulichkeit ist hier kein Versprechen, sondern Gesetz." className="mb-12" />
          <FeatureGrid
            tone="dark"
            cols={3}
            items={[
              { icon: EyeOff, title: "Anonymität", text: "Keine Pflichtangaben zu Ihrer Person, keine IP-Speicherung. Die Kommunikation läuft über Fall-Nummer und Zugangsschlüssel." },
              { icon: UserCheck, title: "Unabhängige Meldestelle", text: "Nur die benannten, zur Verschwiegenheit verpflichteten Personen haben Zugriff. Sie sind bei der Bearbeitung nicht weisungsgebunden." },
              { icon: Scale, title: "Schutz vor Repressalien", text: "Benachteiligungen wegen einer Meldung in gutem Glauben sind nach § 36 HinSchG verboten." },
              { icon: FileLock2, title: "Sichere Übertragung", text: "Die Verbindung ist durchgängig verschlüsselt. Ihr Zugangsschlüssel wird nur als Hash gespeichert." },
              { icon: ShieldCheck, title: "Gesetzliche Fristen", text: "Eingangsbestätigung spätestens nach 7 Tagen, Rückmeldung spätestens nach 3 Monaten (§ 17 HinSchG)." },
              { icon: KeyRound, title: "Ihr Postfach", text: "Beantworten Sie Rückfragen und verfolgen Sie den Stand – ohne Ihre Identität preiszugeben." },
            ]}
          />
        </div>
      </Section>

      <Section tone="white" space="lg">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div>
            <SectionHeading eyebrow="Häufige Fragen" title="Gut zu wissen" />
            <Reveal delay={100} className="mt-8 rounded-3xl bg-sand-50 p-6 ring-1 ring-ink-200/60">
              <p className="font-display text-[17px] font-bold text-ink-900">Externe Meldestelle</p>
              <p className="mt-2 text-[14.5px] leading-relaxed text-ink-600">
                Alternativ können Sie sich an die{" "}
                <a href="https://www.bundesjustizamt.de/DE/MeldestelledesBundes/MeldestelledesBundes_node.html" target="_blank" rel="noopener noreferrer" className="font-medium text-ov-700 underline">
                  externe Meldestelle des Bundes beim Bundesamt für Justiz
                </a>{" "}
                wenden.
              </p>
            </Reveal>
          </div>
          <Faq items={FAQ} />
        </div>
      </Section>

      <Section tone="sand" space="md" id="datenschutz" className="scroll-mt-24">
        <div className="mx-auto max-w-3xl">
          <h2 className="ov-h3 text-ink-900">Datenschutzhinweise zum Hinweisgebersystem</h2>
          <div className="ov-prose mt-5 text-[15.5px]">
            <p>
              Verantwortlich ist die ÖKOVOLT GmbH Solartechnik, Schlingener Straße 1a, 86842 Türkheim. Wir verarbeiten die Angaben aus Ihrer Meldung ausschließlich zur Prüfung des Hinweises und zur Ergreifung von Folgemaßnahmen. Rechtsgrundlage ist Art. 6 Abs. 1 lit. c DSGVO in Verbindung mit § 10 HinSchG.
            </p>
            <p>
              Zugriff haben nur die für die Bearbeitung zuständigen Personen der internen Meldestelle. Beim Absenden werden keine IP-Adressen oder Gerätedaten zur Meldung gespeichert. Die Dokumentation wird drei Jahre nach Abschluss des Verfahrens gelöscht (§ 11 Abs. 5 HinSchG), sofern keine längere Aufbewahrung erforderlich ist.
            </p>
            <p>
              Ihre Rechte auf Auskunft, Berichtigung, Löschung und Einschränkung können eingeschränkt sein, soweit dies zum Schutz der Vertraulichkeit erforderlich ist. Weitere Informationen finden Sie in unserer <Link href="/datenschutz">Datenschutzerklärung</Link>.
            </p>
          </div>
        </div>
      </Section>
    </div>
  );
}
