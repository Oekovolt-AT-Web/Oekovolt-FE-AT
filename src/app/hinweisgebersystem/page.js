import Link from "next/link";
import { EyeOff, FileLock2, KeyRound, Mail, MessagesSquare, Phone, Scale, ShieldCheck, UserCheck } from "lucide-react";

import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import FeatureGrid from "@/components/ui/FeatureGrid";
import Steps from "@/components/ui/Steps";
import Faq from "@/components/ui/Faq";
import Reveal from "@/components/ui/Reveal";
import MeldeFormular from "@/components/Hinweisgeber/MeldeFormular";
import { ABLAUF, FAQ, MELDESTELLE, DATENSCHUTZ, EXTERNE_MELDESTELLE_URL } from "@/data/hinweisgeber";
import { BASE_URL, FIRMA, SITE_NAME, LOCALE } from "@/lib/site";

const PAGE_URL = `${BASE_URL}/hinweisgebersystem`;
const TITEL = "Hinweisgebersystem – vertraulich melden | Ökovolt";
const BESCHREIBUNG =
  `Rechtsverstöße vertraulich und auf Wunsch anonym melden: das interne Hinweisgebersystem der ${FIRMA.name} nach dem HinweisgeberInnenschutzgesetz (HSchG).`;

export const metadata = {
  title: TITEL,
  description: BESCHREIBUNG,
  alternates: { canonical: PAGE_URL },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: LOCALE,
    url: PAGE_URL,
    siteName: SITE_NAME,
    title: TITEL,
    description: BESCHREIBUNG,
    images: [{ url: `${BASE_URL}/og-image.jpg`, width: 1200, height: 630, alt: "Ökovolt Hinweisgebersystem" }],
  },
};

const schema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": `${PAGE_URL}/#webpage`,
  url: PAGE_URL,
  name: TITEL,
  description: BESCHREIBUNG,
  isPartOf: { "@id": `${BASE_URL}/#website` },
  about: { "@id": `${BASE_URL}/#organization` },
};

export default function HinweisgebersystemPage() {
  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <PageHero
        variant="dark"
        breadcrumbs={[{ name: "Hinweisgebersystem" }]}
        eyebrow="HinweisgeberInnenschutzgesetz (HSchG)"
        title={<>Verstöße melden – <span className="ov-text-gradient-light">vertraulich und sicher.</span></>}
        lead={`Ihr Hinweis hilft uns, Rechtsverstöße aufzudecken und abzustellen. Über dieses Portal erreichen Sie direkt die interne Stelle der ${FIRMA.name} – auf Wunsch vollständig anonym.`}
        points={["Anonym möglich", "IP-Adresse wird nicht mit der Meldung gespeichert", "Schutz vor Repressalien", "Rückmeldung innerhalb von 3 Monaten"]}
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
              { icon: EyeOff, title: "Anonymität", text: "Keine Pflichtangaben zu Ihrer Person; Ihre IP-Adresse wird nicht mit der Meldung gespeichert. Die Kommunikation läuft über Fall-Nummer und Zugangsschlüssel." },
              { icon: UserCheck, title: "Unabhängige Meldestelle", text: "Nur die benannten, zur Vertraulichkeit verpflichteten Personen der internen Stelle haben Zugriff. Sie sind unparteiisch und bei der Bearbeitung nicht weisungsgebunden." },
              { icon: Scale, title: "Schutz vor Repressalien", text: "Vergeltungsmaßnahmen wegen eines berechtigten Hinweises sind nach § 20 HSchG rechtsunwirksam und begründen Schadenersatzansprüche." },
              { icon: FileLock2, title: "Sichere Übertragung", text: "Die Verbindung ist durchgängig verschlüsselt. Ihr Zugangsschlüssel wird nur als Hash gespeichert." },
              { icon: ShieldCheck, title: "Gesetzliche Fristen", text: "Eingangsbestätigung spätestens nach 7 Kalendertagen, Rückmeldung spätestens 3 Monate danach (§ 13 HSchG)." },
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
                <a href={EXTERNE_MELDESTELLE_URL} target="_blank" rel="noopener noreferrer" className="font-medium text-ov-700 underline">
                  externe Stelle beim Bundesamt zur Korruptionsprävention und Korruptionsbekämpfung (BAK)
                </a>{" "}
                wenden.
              </p>
            </Reveal>
          </div>
          <Faq items={FAQ} />
        </div>
      </Section>

      <Section tone="sand" space="lg" id="meldewege" className="scroll-mt-24">
        <SectionHeading
          eyebrow="Weitere Meldewege"
          title={MELDESTELLE.telefon ? "Lieber telefonisch, per Post oder im Gespräch?" : "Lieber per Post oder im persönlichen Gespräch?"}
          lead={
            MELDESTELLE.telefon
              ? "Sie können Ihre Meldung auch mündlich oder schriftlich abgeben. Auf Wunsch ist ein persönliches Gespräch mit der internen Stelle möglich."
              : "Sie können Ihre Meldung auch schriftlich per Post abgeben. Auf Wunsch ist ein persönliches Gespräch mit der internen Stelle möglich."
          }
          className="mb-10"
        />
        <div className={`grid gap-4 ${MELDESTELLE.telefon ? "md:grid-cols-3" : "md:grid-cols-2"}`}>
          {MELDESTELLE.telefon && (
            <Reveal className="rounded-3xl bg-white p-7 ring-1 ring-ink-200/60">
              <Phone aria-hidden="true" className="h-6 w-6 text-ov-600" />
              <h3 className="ov-h3 mt-5 text-ink-900">Telefonisch</h3>
              <a href={`tel:${MELDESTELLE.telefon.replace(/\s/g, "")}`} className="mt-2 block font-display text-[20px] font-extrabold text-ink-900 hover:text-ov-700">{MELDESTELLE.telefon}</a>
              {MELDESTELLE.telefonzeiten && <p className="mt-1 text-[14px] text-ink-500">{MELDESTELLE.telefonzeiten}</p>}
              <p className="mt-3 text-[14.5px] leading-relaxed text-ink-600">Direkt bei der Meldestelle – nicht über die Zentrale. Ihre Rufnummer müssen Sie nicht nennen.</p>
            </Reveal>
          )}
          <Reveal delay={80} className="rounded-3xl bg-white p-7 ring-1 ring-ink-200/60">
            <Mail aria-hidden="true" className="h-6 w-6 text-ov-600" />
            <h3 className="ov-h3 mt-5 text-ink-900">Per Post</h3>
            <address className="mt-2 not-italic text-[15px] leading-relaxed text-ink-700">
              {MELDESTELLE.postanschrift.map((z) => (
                <span key={z} className="block">{z}</span>
              ))}
            </address>
            <p className="mt-3 text-[14.5px] leading-relaxed text-ink-600">Der Umschlag wird ungeöffnet an die Meldestelle weitergeleitet. Für Rückfragen können Sie eine anonyme Kontaktmöglichkeit angeben.</p>
          </Reveal>
          <Reveal delay={160} className="rounded-3xl bg-white p-7 ring-1 ring-ink-200/60">
            <MessagesSquare aria-hidden="true" className="h-6 w-6 text-ov-600" />
            <h3 className="ov-h3 mt-5 text-ink-900">Persönliches Gespräch</h3>
            <p className="mt-2 text-[14.5px] leading-relaxed text-ink-600">
              Geben Sie online eine kurze Meldung ab und bitten Sie darin um einen Termin. Die Meldestelle schlägt Ihnen über Ihr Postfach einen vertraulichen Gesprächstermin vor – vor Ort oder per Video.
            </p>
          </Reveal>
        </div>
      </Section>

      <Section tone="white" space="lg" id="datenschutz" className="scroll-mt-24">
        <div className="mx-auto max-w-3xl">
          <p className="text-[12.5px] font-semibold uppercase tracking-[0.16em] text-ov-600">Stand: September 2026</p>
          <h2 className="ov-h2 mt-3 text-ink-900">Datenschutzhinweise zum Hinweisgebersystem</h2>
          <p className="ov-lead mt-4 text-ink-600">Informationen nach Art. 13 und 14 DSGVO für meldende Personen und für Personen, die in einer Meldung genannt werden.</p>
          <div className="mt-10 divide-y divide-ink-200 border-y border-ink-200">
            {DATENSCHUTZ.map((a, i) => (
              <section key={a.titel} className="py-7">
                <h3 className="font-display text-[18px] font-bold text-ink-900">
                  <span className="mr-2 text-ov-600">{String(i + 1).padStart(2, "0")}</span>
                  {a.titel}
                </h3>
                <div className="mt-3 space-y-3 text-[15.5px] leading-relaxed text-ink-600">
                  {a.text.map((t, j) => (
                    <p key={j}>{t}</p>
                  ))}
                </div>
              </section>
            ))}
          </div>
          <p className="mt-6 text-[14px] text-ink-500">
            Allgemeine Informationen zur Datenverarbeitung auf unserer Website finden Sie in der <Link href="/datenschutz" className="font-medium text-ov-700 underline">Datenschutzerklärung</Link>.
          </p>
        </div>
      </Section>
    </div>
  );
}
