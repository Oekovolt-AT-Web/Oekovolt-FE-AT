import Link from "next/link";
import { ExternalLink, EyeOff, FileLock2, Gavel, KeyRound, Landmark, Scale, ShieldCheck, Timer, UserCheck } from "lucide-react";

import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import FeatureGrid from "@/components/ui/FeatureGrid";
import Steps from "@/components/ui/Steps";
import Faq from "@/components/ui/Faq";
import Reveal from "@/components/ui/Reveal";
import Button from "@/components/ui/Button";
import { BASE_URL, FIRMA, SITE_NAME, LOCALE } from "@/lib/site";
import {
  BAK,
  DATENSCHUTZ,
  FAQ_INFO,
  HINWEIS_INTERN,
  MELDEKANAL_EXTERN,
  MELDEKANAL_LABEL,
  MELDEKANAL_URL,
  RECHTSBEREICHE,
  WEITERE_EXTERNE_STELLEN,
} from "@/data/hinweisgeber";

// Server-Komponente, statisch erzeugt: Der Schalter HINWEIS_INTERN (src/data/hinweisgeber.js)
// wird zur BUILD-Zeit ausgewertet. AUS = IntegrityLine als Meldekanal (wie bisher),
// AN = eigenes Hinweisgebersystem unter /hinweisgebersystem.

const PAGE_URL = `${BASE_URL}/hinweisgeberschutz`;
const TITEL = "Hinweisgeberschutz nach HSchG | Ökovolt";
const BESCHREIBUNG =
  "Rechtsverstöße vertraulich und auf Wunsch anonym melden: interner Meldekanal der Ökovolt Solartechnik GmbH nach HSchG, Fristen, Schutz und externe Stelle BAK.";

/** Stand dieser Informationen */
const STAND = "September 2026";

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
    images: [{ url: `${BASE_URL}/og-image.jpg`, width: 1200, height: 630, alt: "Ökovolt Hinweisgeberschutz" }],
  },
};

const schema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": `${PAGE_URL}#webpage`,
  url: PAGE_URL,
  name: TITEL,
  description: BESCHREIBUNG,
  inLanguage: "de-AT",
  isPartOf: { "@id": `${BASE_URL}/#website` },
  about: { "@id": `${BASE_URL}/#organization` },
};

const ABLAUF_INFO = [
  HINWEIS_INTERN
    ? {
        title: "Formular öffnen",
        text: "Unter www.oekovolt.com/hinweisgebersystem erreichen Sie unser eigenes Hinweisgebersystem – rund um die Uhr, verschlüsselt übertragen, ohne Registrierung.",
      }
    : {
        title: "Portal öffnen",
        text: "Über oekovolt.integrityline.com erreichen Sie unseren internen Meldekanal – rund um die Uhr, verschlüsselt, ohne Registrierung.",
      },
  {
    title: "Hinweis schildern",
    text: HINWEIS_INTERN
      ? "Beschreiben Sie den Sachverhalt so konkret wie möglich. Angaben zu Ihrer Person sind freiwillig; Sie erhalten eine Fall-Nummer und einen Zugangsschlüssel für Ihr geschütztes Postfach."
      : "Beschreiben Sie den Sachverhalt so konkret wie möglich. Angaben zu Ihrer Person sind freiwillig; Sie erhalten Zugang zu einem geschützten Postfach.",
  },
  {
    title: "Eingangsbestätigung",
    text: "Spätestens nach sieben Kalendertagen bestätigt die interne Stelle den Eingang Ihres Hinweises.",
  },
  {
    title: "Rückmeldung",
    text: "Spätestens drei Monate nach der Eingangsbestätigung erfahren Sie, welche Folgemaßnahmen ergriffen wurden oder geplant sind.",
  },
];

// Datenschutzhinweise für den Meldekanal IntegrityLine (AUS-Zustand). Im AN-Zustand gilt stattdessen
// DATENSCHUTZ aus src/data/hinweisgeber.js (eigenes System, eigenes Backoffice, kein externer Portalbetreiber).
const DATENSCHUTZ_INTEGRITYLINE = [
  {
    titel: "Verantwortlicher",
    text: `${FIRMA.name}, ${FIRMA.strasse}, ${FIRMA.plz} ${FIRMA.ort}, E-Mail ${FIRMA.email}. Fragen zum Datenschutz im Zusammenhang mit einem Hinweis können Sie vertraulich auch über das Postfach im Hinweisgeberportal stellen.`,
  },
  {
    titel: "Zwecke und Rechtsgrundlagen",
    text: "Wir verarbeiten personenbezogene Daten, um Hinweise entgegenzunehmen, zu prüfen, Folgemaßnahmen zu ergreifen, mit der hinweisgebenden Person zu kommunizieren und Vergeltungsmaßnahmen zu verhindern. Rechtsgrundlage ist Art. 6 Abs. 1 lit. c DSGVO in Verbindung mit § 8 HSchG, für besondere Kategorien personenbezogener Daten und strafrechtlich relevante Daten Art. 9 Abs. 2 lit. g und Art. 10 DSGVO in Verbindung mit § 8 HSchG. Für Hinweise außerhalb des Geltungsbereichs des HSchG stützen wir uns auf unser berechtigtes Interesse an der Aufdeckung und Verhinderung von Rechtsverstößen (Art. 6 Abs. 1 lit. f DSGVO).",
  },
  {
    titel: "Verarbeitete Daten und Betroffene",
    text: "Inhalt des Hinweises, Nachrichten im Postfach und – nur wenn Sie diese angeben – Ihre Kontaktdaten. Betroffen sein können die hinweisgebende Person, im Hinweis genannte Personen sowie Zeuginnen, Zeugen und unterstützende Personen.",
  },
  {
    titel: "Empfänger",
    text: "Zugriff haben ausschließlich die mit der Bearbeitung betrauten, zur Vertraulichkeit verpflichteten Personen der internen Stelle. Das Hinweisgeberportal wird von einem spezialisierten Dienstleister als Auftragsverarbeiter nach Art. 28 DSGVO betrieben. Eine Weitergabe an Behörden oder Gerichte erfolgt nur in den gesetzlich vorgesehenen Fällen; die Identität der hinweisgebenden Person wird dabei nur offengelegt, wenn dies in einem verwaltungsbehördlichen oder gerichtlichen Verfahren unerlässlich und verhältnismäßig ist (§ 7 HSchG).",
  },
  {
    titel: "Speicherdauer",
    text: "Personenbezogene Daten aus Hinweisen werden ab ihrer letztmaligen Verarbeitung oder Übermittlung fünf Jahre aufbewahrt und darüber hinaus so lange, als es zur Durchführung bereits eingeleiteter verwaltungsbehördlicher oder gerichtlicher Verfahren erforderlich ist. Protokolldaten werden bis drei Jahre nach Entfall der Aufbewahrungspflicht aufbewahrt; danach werden die Daten gelöscht (§ 8 Abs. 11 HSchG).",
  },
  {
    titel: "Einschränkung von Betroffenenrechten",
    text: "Solange und soweit es zum Schutz der Identität der hinweisgebenden Person oder anderer Betroffener und zur Erreichung der Zwecke des HSchG erforderlich ist – insbesondere während laufender Prüfungen oder Verfahren –, sind die Rechte auf Information, Auskunft, Berichtigung, Löschung, Einschränkung und Widerspruch sowie die Benachrichtigung bei Datenschutzverletzungen eingeschränkt (§ 8 HSchG, Art. 23 DSGVO). Personen, die in einem Hinweis genannt werden, erfahren die Identität der hinweisgebenden Person nicht.",
  },
  {
    titel: "Beschwerde",
    text: "Sie können sich bei der Österreichischen Datenschutzbehörde beschweren: Barichgasse 40–42, 1030 Wien, dsb@dsb.gv.at, www.dsb.gv.at. Eine automatisierte Entscheidungsfindung einschließlich Profiling findet nicht statt.",
  },
];

/** Einheitliche Form { titel, text: string[] } für beide Zustände. */
const DATENSCHUTZ_INFO = (HINWEIS_INTERN ? DATENSCHUTZ : DATENSCHUTZ_INTEGRITYLINE).map((a) => ({
  titel: a.titel,
  text: Array.isArray(a.text) ? a.text : [a.text],
}));

/** Link auf den Meldekanal: extern (IntegrityLine) im neuen Tab, intern (eigenes System) per next/link. */
function MeldekanalLink({ children, className }) {
  if (!MELDEKANAL_EXTERN) {
    return (
      <Link href={MELDEKANAL_URL} className={className}>
        {children}
      </Link>
    );
  }
  return (
    <a href={MELDEKANAL_URL} target="_blank" rel="noopener noreferrer" className={className}>
      {children}
      <span className="sr-only"> (öffnet in neuem Tab)</span>
    </a>
  );
}

export default function HinweisgeberschutzPage() {
  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <PageHero
        variant="dark"
        breadcrumbs={[{ name: "Hinweisgeberschutz" }]}
        eyebrow="HinweisgeberInnenschutzgesetz (HSchG)"
        title={
          <>
            Missstände melden – <span className="ov-text-gradient-light">vertraulich und geschützt.</span>
          </>
        }
        lead={`Ihr Hinweis hilft uns, Rechtsverstöße aufzudecken und abzustellen. Über unser ${HINWEIS_INTERN ? "Hinweisgebersystem" : "Hinweisgeberportal"} erreichen Sie direkt die interne Stelle der ${FIRMA.name} – auf Wunsch vollständig anonym.`}
        points={["Anonym möglich", "Eingangsbestätigung binnen 7 Tagen", "Rückmeldung binnen 3 Monaten", "Schutz vor Vergeltung"]}
        actions={[
          HINWEIS_INTERN
            ? { label: "Hinweis abgeben", href: `${MELDEKANAL_URL}#meldung` }
            : { label: "Hinweis abgeben", href: MELDEKANAL_URL, icon: ExternalLink },
          { label: "Externe Stelle (BAK)", href: "#extern" },
        ]}
      />

      <Section tone="sand" space="lg" id="meldekanal" className="scroll-mt-24">
        <SectionHeading
          eyebrow="Interner Meldekanal"
          title="So geben Sie einen Hinweis ab"
          lead={
            HINWEIS_INTERN
              ? "Unser interner Meldekanal ist ein eigenes, webbasiertes Hinweisgebersystem. Meldungen werden verschlüsselt übertragen und in unserem eigenen Backoffice gespeichert, auf das nur die interne Stelle Zugriff hat. Es ermöglicht schriftliche Hinweise und die Kommunikation über ein geschütztes Postfach – auf Wunsch ohne Angabe Ihrer Identität."
              : "Unser interner Meldekanal ist ein webbasiertes Hinweisgeberportal. Es ist unabhängig von unseren übrigen IT-Systemen und ermöglicht schriftliche Hinweise und die Kommunikation über ein geschütztes Postfach – auf Wunsch ohne Angabe Ihrer Identität."
          }
          className="mb-14"
        />
        <Steps items={ABLAUF_INFO} />
        <div className="mt-12 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          {HINWEIS_INTERN ? (
            <>
              <Button href={`${MELDEKANAL_URL}#meldung`} size="lg" pfeil>
                Zum Hinweisgebersystem
              </Button>
              <Button href={`${MELDEKANAL_URL}/postfach`} size="lg" variant="secondary" icon={KeyRound}>
                Zum Postfach
              </Button>
            </>
          ) : (
            <Button href={MELDEKANAL_URL} size="lg" pfeil>
              Zum Hinweisgeberportal
              <span className="sr-only"> (öffnet in neuem Tab)</span>
            </Button>
          )}
          <p className="text-[14.5px] leading-relaxed text-ink-600">
            {HINWEIS_INTERN ? (
              <>
                Hinweise sind auch per Post oder mündlich im persönlichen Gespräch nach Terminvereinbarung möglich – siehe{" "}
                <Link href={`${MELDEKANAL_URL}#meldewege`} className="font-medium text-ov-700 underline">
                  weitere Meldewege
                </Link>
                .
              </>
            ) : (
              "Auf Wunsch ist auch eine persönliche Besprechung mit der internen Stelle möglich – vermerken Sie dies bitte in Ihrem Hinweis."
            )}
          </p>
        </div>
      </Section>

      <Section tone="white" space="lg" id="anwendungsbereich" className="scroll-mt-24">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <div>
            <SectionHeading
              eyebrow="Anwendungsbereich"
              title="Was Sie melden können"
              lead="Das HSchG schützt Personen, die im beruflichen Zusammenhang Informationen über Rechtsverletzungen erlangt haben und diese melden. Erfasst sind Verstöße in den in § 3 HSchG genannten Rechtsbereichen."
            />
            <Reveal delay={100} className="mt-8 rounded-3xl bg-sand-50 p-6 ring-1 ring-ink-200/60">
              <p className="font-display text-[17px] font-bold text-ink-900">Wer ist geschützt?</p>
              <p className="mt-2 text-[15px] leading-relaxed text-ink-600">
                Mitarbeitende, ehemalige Mitarbeitende, Bewerbende, Leiharbeitskräfte, Praktikantinnen und Praktikanten,
                selbständige Auftragnehmer, Subunternehmer und Elektro-Partner, Lieferanten und Anteilseigner – sowie
                Personen, die Hinweisgebende unterstützen, etwa Betriebsratsmitglieder, Kolleginnen, Kollegen und
                Angehörige.
              </p>
            </Reveal>
          </div>
          <Reveal>
            <ul className="grid gap-2.5 sm:grid-cols-2">
              {RECHTSBEREICHE.map((r) => (
                <li key={r} className="flex gap-3 rounded-2xl bg-white p-4 text-[15px] leading-snug text-ink-700 ring-1 ring-ink-200/70">
                  <ShieldCheck aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-ov-600" />
                  <span>{r}</span>
                </li>
              ))}
            </ul>
            <p className="mt-5 text-[14.5px] leading-relaxed text-ink-600">
              Hinweise auf sonstige Verstöße gegen Gesetze oder interne Regeln nehmen wir ebenfalls vertraulich entgegen. Der
              besondere Schutz des HSchG gilt dafür nur, soweit der Hinweis in dessen Geltungsbereich fällt.
            </p>
          </Reveal>
        </div>
      </Section>

      <Section tone="navy" space="lg" className="overflow-hidden">
        <div aria-hidden="true" className="ov-grid-bg absolute inset-0" />
        <div className="relative">
          <SectionHeading dark eyebrow="Ihr Schutz" title="Was das Gesetz für Hinweisgebende sicherstellt" className="mb-12" />
          <FeatureGrid
            tone="dark"
            cols={3}
            items={[
              {
                icon: EyeOff,
                title: "Vertraulichkeit",
                text: "Ihre Identität und alle Informationen, aus denen sie ableitbar ist, werden geschützt. Offengelegt werden darf sie nur, wenn dies in einem behördlichen oder gerichtlichen Verfahren unerlässlich ist (§ 7 HSchG).",
              },
              {
                icon: Scale,
                title: "Schutz vor Vergeltung",
                text: "Kündigung, Versetzung, Herabstufung, Disziplinarmaßnahmen, Einschüchterung oder Rufschädigung als Vergeltung sind rechtsunwirksam und begründen Schadenersatzansprüche (§ 20 HSchG).",
              },
              {
                icon: Gavel,
                title: "Erleichterte Beweisführung",
                text: "Es genügt, glaubhaft zu machen, dass eine Maßnahme eine Vergeltung ist; das Unternehmen muss darlegen, dass ein anderes Motiv ausschlaggebend war (§ 23 HSchG).",
              },
              {
                icon: FileLock2,
                title: "Keine Haftung",
                text: "Wer mit hinreichendem Grund einen berechtigten Hinweis gibt, haftet nicht für dessen Folgen und verletzt keine Geheimhaltungspflichten (§ 22 HSchG).",
              },
              {
                icon: Timer,
                title: "Gesetzliche Fristen",
                text: "Eingangsbestätigung spätestens nach sieben Kalendertagen, Rückmeldung zu Folgemaßnahmen spätestens drei Monate danach (§ 13 HSchG).",
              },
              {
                icon: UserCheck,
                title: "Voraussetzung: guter Glaube",
                text: "Geschützt ist, wer hinreichende Gründe hat anzunehmen, dass die Informationen wahr sind. Wissentlich falsche Hinweise sind strafbar (§ 24 HSchG).",
              },
            ]}
          />
        </div>
      </Section>

      <Section tone="sand" space="lg" id="extern" className="scroll-mt-24">
        <SectionHeading
          eyebrow="Externe Stellen"
          title="Sie können sich auch an eine Behörde wenden"
          lead="Sie haben die Wahl: Neben unserem internen Meldekanal können Sie Hinweise an eine externe Stelle richten. Eine vorherige interne Meldung ist nicht Voraussetzung."
          className="mb-10"
        />
        <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <Reveal className="rounded-3xl bg-white p-7 ring-1 ring-ink-200/60">
            <Landmark aria-hidden="true" className="h-6 w-6 text-ov-600" />
            <h3 className="ov-h3 mt-5 text-ink-900">Allgemein zuständig: {BAK.name}</h3>
            <p className="mt-2 text-[15px] leading-relaxed text-ink-600">
              Das BAK ist nach § 15 HSchG die allgemein zuständige externe Stelle für Hinweise auf Rechtsverletzungen im
              privaten und öffentlichen Sektor. Hinweise sind elektronisch, telefonisch sowie nach Terminvereinbarung
              schriftlich oder persönlich möglich.
            </p>
            <p className="mt-3 text-[15px] text-ink-700">{BAK.adresse}</p>
            <a href={BAK.url} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-2 font-semibold text-ov-700 underline">
              Meldestelle des BAK
              <ExternalLink aria-hidden="true" className="h-4 w-4" />
              <span className="sr-only"> (öffnet in neuem Tab)</span>
            </a>
          </Reveal>
          <Reveal delay={100} className="rounded-3xl bg-white p-7 ring-1 ring-ink-200/60">
            <p className="font-display text-[17px] font-bold text-ink-900">Weitere externe Stellen</p>
            <p className="mt-2 text-[14.5px] leading-relaxed text-ink-600">
              Für bestimmte Bereiche sind nach Bundesgesetzen eigene externe Stellen eingerichtet, unter anderem:
            </p>
            <ul className="mt-3 space-y-2 text-[15px] leading-snug text-ink-700">
              {WEITERE_EXTERNE_STELLEN.map((s) => (
                <li key={s.name}>
                  {s.url ? (
                    <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-ov-700 underline">
                      {s.name}
                      <span className="sr-only"> (öffnet in neuem Tab)</span>
                    </a>
                  ) : (
                    s.name
                  )}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
        <p className="mt-6 max-w-3xl text-[14.5px] leading-relaxed text-ink-600">
          <strong className="text-ink-900">Veröffentlichung:</strong> Wer einen Hinweis öffentlich macht, ist nach § 14 HSchG
          nur unter besonderen Voraussetzungen geschützt – etwa wenn auf einen internen oder externen Hinweis innerhalb der
          gesetzlichen Fristen keine geeigneten Folgemaßnahmen gesetzt wurden oder eine unmittelbare Gefährdung des
          öffentlichen Interesses droht.
        </p>
      </Section>

      <Section tone="white" space="lg" id="faq" className="scroll-mt-24">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div>
            <SectionHeading eyebrow="Häufige Fragen" title="Hinweisgeberschutz bei Ökovolt" />
            <Reveal delay={100} className="mt-8 rounded-3xl bg-sand-50 p-6 ring-1 ring-ink-200/60">
              <p className="font-display text-[17px] font-bold text-ink-900">
                {HINWEIS_INTERN ? "Direkt zum Hinweisgebersystem" : "Direkt zum Portal"}
              </p>
              <p className="mt-2 text-[14.5px] leading-relaxed text-ink-600">
                Ihr Hinweis erreicht über{" "}
                <MeldekanalLink className="font-medium text-ov-700 underline">{MELDEKANAL_LABEL}</MeldekanalLink>{" "}
                ausschließlich die mit der Bearbeitung betrauten, zur Vertraulichkeit verpflichteten Personen der internen
                Stelle.
              </p>
            </Reveal>
          </div>
          <Faq items={FAQ_INFO} />
        </div>
      </Section>

      <Section tone="sand" space="lg" id="datenschutz" className="scroll-mt-24">
        <div className="mx-auto max-w-3xl">
          <p className="text-[12.5px] font-semibold uppercase tracking-[0.16em] text-ov-600">Stand: {STAND}</p>
          <h2 className="ov-h2 mt-3 text-ink-900">Datenschutzhinweise zum Hinweisgebersystem</h2>
          <p className="ov-lead mt-4 text-ink-600">
            Informationen nach Art. 13 und 14 DSGVO für hinweisgebende Personen und für Personen, die in einem Hinweis
            genannt werden.
          </p>
          <div className="mt-10 divide-y divide-ink-200 border-y border-ink-200">
            {DATENSCHUTZ_INFO.map((a, i) => (
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
            Allgemeine Informationen zur Datenverarbeitung auf unserer Website finden Sie in der{" "}
            <Link href="/datenschutz" className="font-medium text-ov-700 underline">
              Datenschutzerklärung
            </Link>
            , Angaben zum Unternehmen im{" "}
            <Link href="/impressum" className="font-medium text-ov-700 underline">
              Impressum
            </Link>
            .
          </p>
        </div>
      </Section>
    </div>
  );
}
