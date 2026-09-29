// uber-uns/team/page.js
//
// Team der Ökovolt Solartechnik GmbH (Ostermiething). Personen nur, soweit sie
// in @/data/unternehmen belegt sind. Gepflegte Teamprofile aus dem Backoffice
// (doctype "Team", Route /api/team) werden angezeigt, sobald
// fetchTeamMitglieder() sie liefert – bis dahin greifen die Texte unten.

import { Briefcase, Building2, Handshake, HandHeart, Leaf, Mail, MessagesSquare, Phone, ShieldCheck } from "lucide-react";
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
import { Generationen } from "@/components/Team/Firmengeschichte";
import RollenPfad from "@/components/Team/RollenPfad";
import Kennzahlen from "@/components/Team/Kennzahlen";
import FotoKachel from "@/components/Team/FotoKachel";
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
  { phase: "Erstgespräch", titel: "Vertrieb & Beratung", text: "Klärt Ziele, Lastgang und Flächen und erstellt ein Angebot, das zu Betrieb, Netzanschluss und Budget passt.", bild: { src: "/Images/Team/in-diverse-workspace-project-manager-presents-eco-2025-01-08-23-29-22-utc-1.jpg", alt: "Beratungsgespräch mit einem Photovoltaikmodul am Besprechungstisch", pos: "60% 40%" } },
  { phase: "Projektstart", titel: "Projektleitung", text: "Koordiniert Termine, Material, Gewerke und Partnerbetriebe – und hält Sie während des Projekts auf dem Laufenden.", bild: { src: "/Images/Jobs/jobs4.jpg", alt: "Projektleiter mit Tablet vor einer Photovoltaikanlage", pos: "50% 30%" } },
  { phase: "Planung", titel: "Planung & Engineering", text: "Modulbelegung, Statik und Schneelast, Wechselrichter, Speicher und Kabelnetz – digital geplant und wirtschaftlich durchgerechnet.", bild: { src: "/Images/AT/ratgeber/photovoltaik-flachdach.jpg", alt: "Photovoltaikanlage auf einem großen Flachdach eines Gewerbebaus" } },
  { phase: "Netz", titel: "Netzanschluss & Elektrotechnik", text: "Netzzugangsantrag, Anforderungen nach TOR Erzeuger, AC-Installation, Prüfung und Inbetriebnahme mit dem Netzbetreiber.", bild: { src: "/Images/AT/technik/umspannwerk-transformator.jpg", alt: "Transformator in einem Umspannwerk" } },
  { phase: "Betrieb", titel: "Leittechnik & Fernwartung", text: "Eigene Parkregler, Fernwartung und SCADA: Die Anlage bleibt steuerbar, überwacht und dokumentiert.", bild: { src: "/Images/AT/technik/leitwarte-netzbetrieb.jpg", alt: "Leitwarte mit Bildschirmen zur Überwachung von Energieanlagen" } },
  { phase: "Bau & Service", titel: "Montage & Service", text: "Montage auf Hallen-, Flach- und Steildächern sowie auf Freiflächen, danach Wartung, Prüfung und Thermografie.", bild: { src: "/Images/Jobs/jobs1.jpg", alt: "Monteure tragen ein Photovoltaikmodul über ein Dach", pos: "50% 40%" } },
];

const KENNZAHLEN = [
  { value: 15, suffix: "+", label: "Jahre Erfahrung", text: "Photovoltaik in der Gruppe seit 2010" },
  { value: 2, label: "Generationen", text: "Gründer und zweite Generation an Bord" },
  { value: 6, label: "Fachrollen je Projekt", text: "vom Erstgespräch bis zum Service" },
  { value: 9, label: "Bundesländer", text: "Montage- und Serviceteams in ganz Österreich" },
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
        variant="immersive"
        breadcrumbs={[{ name: "Über uns", href: "/uber-uns" }, { name: "Team" }]}
        eyebrow="Ökovolt Solartechnik GmbH · Ostermiething"
        title={<>Das Team hinter <span className="ov-text-gradient-light">Ihrer PV-Anlage</span></>}
        lead="Gründer, die seit 2012 eigene Solarparks betreiben, eine zweite Generation für Digitalisierung und Vertrieb – und Fachleute für Projektleitung, Elektrotechnik, Netzanschluss, Leittechnik und Service."
        image={{ src: "/Images/Team/download.jpg", alt: "Fachleute mit Helmen und Warnwesten besprechen sich vor Photovoltaikmodulen", position: "65% 35%" }}
        points={["Firmensitz Ostermiething", "Seit 2012 in Österreich", "Projektleitung bis Inbetriebnahme", "Eigene Leittechnik & Service"]}
        actions={[
          { label: "Projekt besprechen", href: "/termin" },
          { label: "Offene Stellen", href: "/uber-uns/jobs", icon: Briefcase },
        ]}
      />

      {/* Werte + Kennzahlen */}
      <Section tone="white" space="lg">
        <Kennzahlen items={KENNZAHLEN} className="mb-20 border-b border-ink-200 pb-14 md:mb-24" />
        <SectionHeading
          eyebrow="Wofür wir stehen"
          title={<>Vier Werte, <span className="ov-text-gradient">ein Anspruch</span></>}
          lead="Diese Grundsätze prägen, wie wir mit Kundinnen und Kunden, Partnerbetrieben und miteinander arbeiten."
          align="center"
          className="mb-12"
        />
        <FeatureGrid items={WERTE} cols={4} />
      </Section>

      {/* Personen & Rollen */}
      <Section tone="sand" space="lg" id="team" className="scroll-mt-20">
        {mitglieder.length > 0 ? (
          <div className="mb-20">
            <SectionHeading eyebrow="Ansprechpartner" title="Die Menschen bei Ökovolt" lead="Persönlich statt anonym: Diese Kolleginnen und Kollegen begleiten Ihr Projekt." className="mb-12" />
            <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {mitglieder.map((m, i) => (
                <Reveal as="li" key={`${m.name}-${i}`} delay={(i % 4) * 80}>
                  <TeamKarte m={m} />
                </Reveal>
              ))}
            </ul>
          </div>
        ) : null}

        <div className="mb-12 grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:items-end lg:gap-16">
          <SectionHeading
            eyebrow="Wer an Ihrer Anlage arbeitet"
            title="Ein interdisziplinäres Team – ein Ziel"
            lead="Von der Lastganganalyse bis zur Leitwarte: Wählen Sie eine Rolle und sehen Sie, wer in welcher Projektphase für Sie arbeitet."
          />
          <Reveal className="flex flex-wrap items-center gap-4 rounded-3xl bg-navy-950 p-5 text-white md:p-6">
            <a href={FIRMA.telefonHref} className="group flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-ov-500 transition-transform group-hover:scale-110">
                <Phone aria-hidden="true" className="h-5 w-5" />
              </span>
              <span>
                <span className="block text-[12.5px] text-white/60">Ihr direkter Draht ins Team</span>
                <span className="font-display text-[19px] font-extrabold tracking-tight">{FIRMA.telefon}</span>
              </span>
            </a>
            <a href={`mailto:${FIRMA.email}`} className="flex items-center gap-2 text-[14.5px] text-white/80 hover:text-white sm:ml-auto">
              <Mail aria-hidden="true" className="h-4 w-4" />
              {FIRMA.email}
            </a>
          </Reveal>
        </div>
        <RollenPfad rollen={ROLLEN} />
      </Section>

      {/* Gründer & zweite Generation */}
      <Section tone="navy" space="lg" className="overflow-hidden" id="menschen">
        <div aria-hidden="true" className="ov-grid-bg absolute inset-0" />
        <div aria-hidden="true" className="absolute -right-40 top-40 h-[480px] w-[480px] rounded-full bg-ov-500/20 blur-[130px]" />
        <div aria-hidden="true" className="absolute -left-40 bottom-20 h-[380px] w-[380px] rounded-full bg-sun-400/10 blur-[130px]" />
        <SectionHeading
          dark
          eyebrow="Die Menschen dahinter"
          title={<>Gründer und <span className="ov-text-gradient-light">zweite Generation</span></>}
          lead="Seit 2010 stehen dieselben zwei Gründer hinter der Gruppe. Seit 2025 bringt die zweite Generation Digitalisierung und Vertriebsstärke ein."
          align="center"
          className="mb-4"
        />
        <div className="relative">
          <Generationen className="mt-14 md:mt-16" />
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

      {/* Wer wir sind */}
      <Section tone="white" space="lg">
        <SplitMedia
          eyebrow="Betreiber aus Überzeugung"
          title="Errichter, die selbst betreiben"
          text={[
            "Unser Team plant und baut Photovoltaikanlagen für Betriebe, Landwirtschaft, Gemeinden und Landesversorger in ganz Österreich. Was uns dabei leitet, ist die Perspektive des Betreibers: Die Gründer betreiben seit 2012 eigene Solarparks und wissen, was eine Anlage nach zehn Jahren braucht.",
            "Deshalb gehören Netzanschluss, Parkregler, Fernwartung und Service bei uns von Anfang an zum Projekt – nicht erst, wenn etwas nicht funktioniert.",
          ]}
          points={[
            { title: "Eine Projektleitung", text: "vom Erstgespräch bis zur Inbetriebnahme" },
            { title: "Eigene Leittechnik", text: "Parkregler, Fernwartung und SCADA" },
          ]}
          image={{ src: "/Images/Team/solar-power-6860359_1280.jpg", alt: "Photovoltaikmodule auf einem Dach in der Montage" }}
          action={{ label: "Mehr über das Unternehmen", href: "/uber-uns" }}
        />
      </Section>

      {/* Karriere-Teaser */}
      <Section tone="green" space="lg" className="overflow-hidden">
        <div aria-hidden="true" className="ov-grid-bg-light absolute inset-0" />
        <div className="relative grid gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-center lg:gap-16">
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
          <div className="grid gap-4 sm:grid-cols-2">
            <Reveal>
              <FotoKachel
                href="/uber-uns/jobs"
                bild={{ src: "/Images/Jobs/download.jpg", alt: "Monteure mit Helmen arbeiten auf einem Flachdach mit Photovoltaikmodulen" }}
                icon={Briefcase}
                kopf="Jobs & Lehre"
                titel="Offene Stellen in Ostermiething"
                text="Mit KV-Mindestentgelt in jeder Anzeige."
                className="h-full min-h-[320px]"
              />
            </Reveal>
            <Reveal delay={100}>
              <FotoKachel
                href="/partner"
                bild={{ src: "/Images/Jobs/drone-view-of-technician-installing-solar-panels-2025-03-08-04-40-16-utc.jpg", alt: "Techniker montieren Solarmodule auf einem Dach, Luftaufnahme" }}
                icon={Handshake}
                kopf="Für Betriebe"
                titel="Elektro-Partner werden"
                text="Elektrotechnik-Betriebe bauen gemeinsam mit uns."
                className="h-full min-h-[320px]"
              />
            </Reveal>
          </div>
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
