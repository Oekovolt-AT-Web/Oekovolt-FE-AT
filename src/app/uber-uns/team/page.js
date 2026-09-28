// uber-uns/team/page.js
//
// Team der Ökovolt Solartechnik GmbH (Ostermiething). Personen nur, soweit sie
// in @/data/unternehmen belegt sind. Gepflegte Teamprofile aus dem Backoffice
// (doctype "Team", Route /api/team) werden angezeigt, sobald
// fetchTeamMitglieder() sie liefert – bis dahin greifen die Texte unten.

import {
  Briefcase, Building2, Calculator, ClipboardList, GraduationCap, HandHeart, HardHat, Headset, Leaf, Mail, MessagesSquare, MonitorDot, Phone, PlugZap,
  ShieldCheck, Sparkles, TrendingUp, Users,
} from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import SplitMedia from "@/components/ui/SplitMedia";
import FeatureGrid from "@/components/ui/FeatureGrid";
import Faq from "@/components/ui/Faq";
import CtaBand from "@/components/ui/CtaBand";
import Reveal from "@/components/ui/Reveal";
import Button from "@/components/ui/Button";
import TeamKarte, { normalisiereMitglied } from "@/components/Team/TeamKarte";
import { Generationen, Haltung } from "@/components/Team/Firmengeschichte";
import { GENERATIONEN, STAND } from "@/data/unternehmen";
import { BASE_URL, FIRMA, SITE_NAME } from "@/lib/site";
import { hreflangLanguages } from "@/lib/hreflang";
import Querverweise from "@/components/Reusable/Querverweise";

const PAGE_URL = `${BASE_URL}/uber-uns/team`;
const TITEL = "Team – Menschen hinter Ökovolt Österreich | Ökovolt";
const BESCHREIBUNG =
  "Das Team der Ökovolt Solartechnik GmbH in Ostermiething: Gründer, zweite Generation und die Fachleute für Projektleitung, Elektrotechnik, Netzanschluss und Service.";

// Teamprofile aus dem Backoffice (doctype "Team"). Derzeit statisch leer –
// die Website liest nichts aus dem Backoffice, dort werden nur Formulare
// gespeichert. Die API-Route /api/team bleibt für eine spätere Anbindung.
async function fetchTeamMitglieder() {
  return [];
}

export const metadata = {
  title: TITEL,
  description: BESCHREIBUNG,
  alternates: { canonical: PAGE_URL, languages: hreflangLanguages(PAGE_URL) },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "de_AT",
    url: PAGE_URL,
    siteName: SITE_NAME,
    title: TITEL,
    description: BESCHREIBUNG,
    images: [{ url: `${BASE_URL}/og-image.jpg`, width: 1200, height: 630, alt: "Ökovolt Team Österreich" }],
  },
  twitter: { card: "summary_large_image", title: TITEL, description: BESCHREIBUNG, images: [`${BASE_URL}/og-image.jpg`] },
};

const WERTE = [
  { icon: ShieldCheck, title: "Qualität", text: "Anlagen, die über Jahrzehnte laufen – geplant nach ÖVE/ÖNORM und TOR Erzeuger, ausgeführt mit Sorgfalt und sauber dokumentiert." },
  { icon: MessagesSquare, title: "Klare Ansprechpartner", text: "Eine Projektleitung vom Erstgespräch bis zur Inbetriebnahme – erreichbar für Geschäftsführung, Technik und Einkauf." },
  { icon: HandHeart, title: "Alles aus einer Hand", text: "Planung, Montage, Netzanschluss, Parkregler, Fernwartung und Service – ohne Schnittstellen, die niemandem gehören." },
  { icon: Leaf, title: "Nachhaltigkeit", text: "Jede Anlage ist ein Beitrag zur Energiewende – ökologisch sinnvoll und wirtschaftlich nachvollziehbar gerechnet." },
];

const ROLLEN = [
  { icon: Headset, title: "Vertrieb & Beratung", text: "Klärt Ziele, Lastgang und Flächen und erstellt ein Angebot, das zu Betrieb, Netzanschluss und Budget passt." },
  { icon: ClipboardList, title: "Projektleitung", text: "Koordiniert Termine, Material, Gewerke und Partnerbetriebe – und hält Sie während des Projekts auf dem Laufenden." },
  { icon: Calculator, title: "Planung & Engineering", text: "Modulbelegung, Statik und Schneelast, Wechselrichter, Speicher und Kabelnetz – digital geplant und wirtschaftlich durchgerechnet." },
  { icon: PlugZap, title: "Netzanschluss & Elektrotechnik", text: "Netzzugangsantrag, Anforderungen nach TOR Erzeuger, AC-Installation, Prüfung und Inbetriebnahme mit dem Netzbetreiber." },
  { icon: MonitorDot, title: "Leittechnik & Fernwartung", text: "Eigene Parkregler, Fernwartung und SCADA: Die Anlage bleibt steuerbar, überwacht und dokumentiert." },
  { icon: HardHat, title: "Montage & Service", text: "Montage auf Hallen-, Flach- und Steildächern sowie auf Freiflächen, danach Wartung, Prüfung und Thermografie." },
];

const KARRIERE = [
  { icon: GraduationCap, title: "Lehre & Weiterbildung", text: "Lehrberuf Elektrotechnik, Herstellerschulungen und Weiterbildung für Fachkräfte." },
  { icon: Users, title: "Kleine Teams", text: "Kurze Wege zwischen Planung, Montage und Leittechnik." },
  { icon: TrendingUp, title: "Wachstumsbranche", text: "Photovoltaik, Speicher und Netzintegration – mit wachsender Nachfrage." },
  { icon: Sparkles, title: "Eigene Technik", text: "Parkregler, Fernwartung und SCADA aus eigener Entwicklung." },
];

const FAQ = [
  {
    q: "Wer leitet die Ökovolt Solartechnik GmbH?",
    a: `Geschäftsführer ist ${FIRMA.geschaeftsfuehrer}, der die Gruppe 2010 gemeinsam mit Susanne Messmer gegründet hat. Er hält 51 % der österreichischen Gesellschaft, die Salzburg AG 49 %.`,
  },
  {
    q: "Wo sitzt das Team?",
    a: `Am Firmensitz ${FIRMA.strasse}, ${FIRMA.plz} ${FIRMA.ort} im Innviertel. Montage- und Serviceteams sind in ganz Österreich im Einsatz.`,
  },
  {
    q: "Arbeitet Ökovolt mit Partnerbetrieben?",
    a: "Ja. Für die Montage arbeiten wir zusätzlich mit geprüften Elektrotechnik-Betrieben zusammen. Die Verantwortung für Planung, Qualität und Inbetriebnahme bleibt bei uns. Betriebe können sich über das Elektro-Partnerprogramm registrieren.",
  },
  {
    q: "Wie kann ich mich bewerben?",
    a: "Über die offenen Stellen unter Jobs & Karriere oder initiativ per E-Mail an office@oekovolt.com – ein Lebenslauf als PDF reicht für den ersten Schritt.",
  },
];

export default async function TeamPage() {
  const mitgliederRoh = await fetchTeamMitglieder();
  const mitglieder = mitgliederRoh.map(normalisiereMitglied).filter((m) => m.name);

  const personen = mitglieder.length > 0
    ? mitglieder.map((m) => ({ name: m.name, jobTitle: m.rolle }))
    : GENERATIONEN.flatMap((g) => g.personen.map((pp) => ({ name: pp.name, jobTitle: pp.rolle })));

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
    mainEntity: {
      "@type": "ItemList",
      itemListElement: personen.map((pp, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "Person",
          name: pp.name,
          ...(pp.jobTitle && { jobTitle: pp.jobTitle }),
          worksFor: { "@id": `${BASE_URL}/#organization` },
        },
      })),
    },
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <PageHero
        breadcrumbs={[{ name: "Über uns", href: "/uber-uns" }, { name: "Team" }]}
        eyebrow="Ökovolt Solartechnik GmbH · Ostermiething"
        title={<>Das Team hinter <span className="ov-text-gradient">Ihrer PV-Anlage</span></>}
        lead="Gründer, die seit 2012 eigene Solarparks betreiben, eine zweite Generation für Digitalisierung und Vertrieb – und Fachleute für Projektleitung, Elektrotechnik, Netzanschluss, Leittechnik und Service."
        image={{ src: "/Images/Team/in-diverse-workspace-project-manager-presents-eco-2025-01-08-23-29-22-utc-1.jpg", alt: "Projektbesprechung zu einer Photovoltaikanlage" }}
        points={["Firmensitz Ostermiething", "Seit 2012 in Österreich", "Projektleitung bis Inbetriebnahme", "Eigene Leittechnik & Service"]}
        actions={[
          { label: "Projekt besprechen", href: "/termin" },
          { label: "Offene Stellen", href: "/uber-uns/jobs", icon: Briefcase },
        ]}
        badge={
          <div className="flex items-center gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-ov-500 text-white">
              <Users aria-hidden="true" className="h-6 w-6" />
            </span>
            <div>
              <p className="font-display text-[22px] font-extrabold leading-none text-ink-900">
                15+ <span className="text-[14px] font-semibold text-ink-500">Jahre</span>
              </p>
              <p className="mt-1 text-[12.5px] leading-snug text-ink-500">Photovoltaik-Erfahrung in der Gruppe</p>
            </div>
          </div>
        }
      />

      {/* Werte */}
      <Section tone="white" space="lg">
        <SectionHeading
          eyebrow="Wofür wir stehen"
          title={<>Vier Werte, <span className="ov-text-gradient">ein Anspruch</span></>}
          lead="Diese Grundsätze prägen, wie wir mit Kundinnen und Kunden, Partnerbetrieben und miteinander arbeiten."
          align="center"
          className="mb-12"
        />
        <FeatureGrid items={WERTE} cols={4} />
      </Section>

      {/* Wer wir sind */}
      <Section tone="sand" space="lg">
        <SplitMedia
          eyebrow="Unser Team"
          title="Errichter, die selbst betreiben"
          text={[
            "Unser Team plant und baut Photovoltaikanlagen für Betriebe, Landwirtschaft, Gemeinden und Landesversorger in ganz Österreich. Was uns dabei leitet, ist die Perspektive des Betreibers: Die Gründer betreiben seit 2012 eigene Solarparks und wissen, was eine Anlage nach zehn Jahren braucht.",
            "Deshalb gehören Netzanschluss, Parkregler, Fernwartung und Service bei uns von Anfang an zum Projekt – nicht erst, wenn etwas nicht funktioniert.",
          ]}
          image={{ src: "/Images/Team/solar-power-6860359_1280.jpg", alt: "Photovoltaikmodule auf einem Dach in der Montage" }}
          action={{ label: "Mehr über das Unternehmen", href: "/uber-uns" }}
        />
      </Section>

      {/* Personen & Rollen */}
      <Section tone="white" space="lg" id="team">
        {mitglieder.length > 0 ? (
          <>
            <SectionHeading eyebrow="Ansprechpartner" title="Die Menschen bei Ökovolt" lead="Persönlich statt anonym: Diese Kolleginnen und Kollegen begleiten Ihr Projekt." className="mb-12" />
            <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {mitglieder.map((m, i) => (
                <Reveal as="li" key={`${m.name}-${i}`} delay={(i % 4) * 80}>
                  <TeamKarte m={m} />
                </Reveal>
              ))}
            </ul>
          </>
        ) : null}

        <div className={mitglieder.length > 0 ? "mt-20" : ""}>
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <SectionHeading
                eyebrow="Wer an Ihrer Anlage arbeitet"
                title="Ein interdisziplinäres Team – ein Ziel"
                lead="Von der Lastganganalyse bis zur Leitwarte: Jede Rolle bringt ihre Stärke in Ihr Projekt ein."
              />
              <Reveal className="mt-8 rounded-3xl bg-navy-950 p-6 text-white md:p-7">
                <p className="text-[13px] font-medium text-white/60">Ihr direkter Draht ins Team</p>
                <a href={FIRMA.telefonHref} className="group mt-2 flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-ov-500 transition-transform group-hover:scale-110">
                    <Phone aria-hidden="true" className="h-5 w-5" />
                  </span>
                  <span className="font-display text-[22px] font-extrabold tracking-tight">{FIRMA.telefon}</span>
                </a>
                <a href={`mailto:${FIRMA.email}`} className="mt-3 flex items-center gap-3 text-[15px] text-white/80 hover:text-white">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10">
                    <Mail aria-hidden="true" className="h-5 w-5" />
                  </span>
                  {FIRMA.email}
                </a>
                <p className="mt-4 border-t border-white/10 pt-4 text-[13.5px] text-white/55">
                  {FIRMA.oeffnungszeiten.map((o) => `${o.tage} ${o.zeit} Uhr`).join(" · ")}
                </p>
              </Reveal>
            </div>
            <ol className="grid gap-4 sm:grid-cols-2">
              {ROLLEN.map((r, i) => (
                <Reveal as="li" key={r.title} delay={(i % 2) * 90} className="group ov-card-hover relative rounded-3xl bg-sand-50 p-6 ring-1 ring-ink-200/60 md:p-7">
                  <div className="flex items-center justify-between">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-ov-600 shadow-sm ring-1 ring-ov-200 transition-colors group-hover:bg-ov-500 group-hover:text-white">
                      <r.icon aria-hidden="true" className="h-6 w-6" strokeWidth={1.8} />
                    </span>
                    <span className="ov-num font-display text-[30px] font-extrabold leading-none text-ink-200">{String(i + 1).padStart(2, "0")}</span>
                  </div>
                  <h3 className="ov-h3 mt-5 text-ink-900">{r.title}</h3>
                  <p className="mt-2 text-[15.5px] leading-relaxed text-ink-600">{r.text}</p>
                </Reveal>
              ))}
            </ol>
          </div>
        </div>
      </Section>

      {/* Gründer & zweite Generation */}
      <Section tone="navy" space="lg" className="overflow-hidden" id="menschen">
        <div aria-hidden="true" className="ov-grid-bg absolute inset-0" />
        <div aria-hidden="true" className="absolute -right-40 top-40 h-[480px] w-[480px] rounded-full bg-ov-500/20 blur-[130px]" />
        <SectionHeading
          dark
          eyebrow="Die Menschen dahinter"
          title={<>Gründer und <span className="ov-text-gradient-light">zweite Generation</span></>}
          lead="Seit 2010 stehen dieselben zwei Gründer hinter der Gruppe. Seit 2025 bringt die zweite Generation Digitalisierung und Vertriebsstärke ein."
          align="center"
          className="mb-4"
        />
        <div className="relative">
          <Generationen className="mt-14 md:mt-20" />
          <Haltung />
        </div>
        <div className="relative mt-14 flex flex-wrap justify-center gap-3">
          <Button href="/uber-uns#geschichte" variant="outlineLight" pfeil>
            Unternehmensgeschichte & Gesellschafter
          </Button>
          <Button href="/referenzen/projekte" variant="outlineLight" icon={Building2}>
            Referenzprojekte
          </Button>
        </div>
      </Section>

      {/* Karriere-Teaser */}
      <Section tone="green" space="lg" className="overflow-hidden">
        <div aria-hidden="true" className="ov-grid-bg-light absolute inset-0" />
        <div className="relative grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:gap-16">
          <div>
            <SectionHeading
              eyebrow="Karriere bei Ökovolt"
              title="Mitbauen an der Energiewende in Österreich"
              lead="Wir suchen Fachleute für Projektleitung, Elektrotechnik, Netzanschluss, Leittechnik, Service und Vertrieb – und bilden Lehrlinge in Elektrotechnik aus."
            />
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button href="/uber-uns/jobs" size="lg" pfeil>
                Offene Stellen ansehen
              </Button>
              <Button href={`mailto:${FIRMA.email}?subject=Initiativbewerbung`} size="lg" variant="secondary" icon={Mail}>
                Initiativ bewerben
              </Button>
            </div>
          </div>
          <FeatureGrid items={KARRIERE} cols={2} />
        </div>
      </Section>

      <Section tone="white" space="lg">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <SectionHeading eyebrow="Häufige Fragen" title="Das Team von Ökovolt" />
          <Faq items={FAQ} />
        </div>
      </Section>

      <Querverweise pfad="/uber-uns/team" />
      <CtaBand
        eyebrow="Lernen Sie uns kennen"
        title="Persönlich beraten – vom Team, das Ihre Anlage baut."
        text="Erzählen Sie uns von Ihrem Vorhaben. Wir prüfen Flächen, Lastgang und Netzanschluss und melden uns mit einer ehrlichen Ersteinschätzung – mit fester Projektleitung aus Ostermiething."
        primary={{ label: "Projekt anfragen", href: "/angebot" }}
        secondary={{ label: "Termin buchen", href: "/termin" }}
      />
    </div>
  );
}
