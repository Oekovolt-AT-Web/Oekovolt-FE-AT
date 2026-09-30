// src/app/uber-uns/page.js
//
// Unternehmensseite der österreichischen Gesellschaft (Ökovolt Solartechnik
// GmbH, Ostermiething). Registerwerte ausschließlich aus @/lib/site, Geschichte
// und Gruppenstruktur aus @/data/unternehmen.
//
// Rhythmus: Hero (Salzach) → Eigene Mannschaft (#mannschaft) → Kennzahlen → Foto-Bento „Was wir machen“ →
// Zeitreise (scroll-gebunden, dunkel) → Gesellschafter (Ring) → Organigramm →
// Haltung (Fotoband) → Einzugsgebiet (Karte) → Register (Akkordeon) →
// Gemeinsam (Fotokacheln) → FAQ → Querverweise → CtaBand.

import Image from "next/image";
import {
  Briefcase, Building2, CalendarCheck2, Check, ChevronDown, ExternalLink, Handshake, HeartHandshake, MapPin, Network, ShieldCheck, Trophy, Users, Wrench,
} from "lucide-react";

import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import Faq from "@/components/ui/Faq";
import CtaBand from "@/components/ui/CtaBand";
import Reveal from "@/components/ui/Reveal";
import Button from "@/components/ui/Button";
import Querverweise from "@/components/Reusable/Querverweise";
import Zeitreise from "@/components/Team/Zeitreise";
import GesellschafterRing from "@/components/Team/GesellschafterRing";
import Organigramm from "@/components/Team/Organigramm";
import Einzugsgebiet from "@/components/Team/Einzugsgebiet";
import Kennzahlen from "@/components/Team/Kennzahlen";
import FotoKachel from "@/components/Team/FotoKachel";
import MannschaftSektion from "@/components/Mannschaft/MannschaftSektion";
import { BETEILIGUNGEN, CLAIM, GESELLSCHAFTEN, HALTUNG, PROFIL, ROLLEN_AT, SALZBURG_AG, STAND, URSPRUNG } from "@/data/unternehmen";
import { BASE_URL, FIRMA, SCHWESTER, SITE_NAME, SOLENSA } from "@/lib/site";

const PAGE_URL = `${BASE_URL}/uber-uns`;
const TITEL = "Über Ökovolt – PV-Errichter aus Ostermiething | Ökovolt";
const BESCHREIBUNG =
  "Ökovolt Solartechnik GmbH: seit 2012 PV-Errichter in Österreich, Sitz Ostermiething, FN 375708m. Gesellschafter, Geschichte, eigene Technik und Gruppe.";

export const metadata = {
  title: TITEL,
  description: BESCHREIBUNG,
  alternates: { canonical: PAGE_URL },
  openGraph: {
    type: "website",
    locale: "de_AT",
    url: PAGE_URL,
    siteName: SITE_NAME,
    title: TITEL,
    description: BESCHREIBUNG,
    images: [{ url: `${BASE_URL}/og-image.jpg`, width: 1200, height: 630, alt: "Ökovolt Solartechnik GmbH, Ostermiething" }],
  },
};

const gesellschafterText = FIRMA.gesellschafter.map((g) => `${g.name} (${g.anteil})`).join(" und ");

const FAKTEN = [
  ["Firma", FIRMA.name],
  ["Rechtsform", FIRMA.rechtsform],
  ["Sitz", `${FIRMA.strasse}, ${FIRMA.plz} ${FIRMA.ort}, ${FIRMA.bundesland}`],
  ["Firmenbuch", `${FIRMA.firmenbuch}, ${FIRMA.firmenbuchgericht}`],
  ["Eingetragen seit", "16. Februar 2012"],
  ["UID-Nummer", FIRMA.uid],
  ["GISA-Zahl", FIRMA.gisa],
  ["Gewerbe", FIRMA.gewerbe],
  ["Kammer", `${FIRMA.kammer} – ${FIRMA.innung}`],
  ["Geschäftsführer", FIRMA.geschaeftsfuehrer],
  ["Gesellschafter", gesellschafterText],
  ["Stammkapital", FIRMA.stammkapital],
];

const KENNZAHLEN = [
  { value: "2012", label: "in Österreich eingetragen", text: `${FIRMA.firmenbuch} · ${FIRMA.firmenbuchgericht}` },
  { value: 30, suffix: " MWp", label: "allein 2021 errichtet", text: "PV-Leistung in einem Jahr" },
  { value: 3, prefix: "TOP ", label: "IPC-Errichter Österreichs", text: "Stand 2021" },
  { value: 9, label: "Bundesländer", text: "Einzugsgebiet: ganz Österreich" },
];

// Foto-Bento „Was die Gesellschaft macht“ – Texte aus ROLLEN_AT
const BENTO_BILDER = [
  { src: "/Images/AT/loesungen/freiflaeche-spitalberg-kaernten.jpg", alt: "Freiflächen-Photovoltaikanlage auf einer Wiese vor Wald in Kärnten", icon: Building2 },
  { src: "/Images/AT/ratgeber/eza-regler-parkregler.jpg", alt: "Wechselrichter und Regelungstechnik unter einer Photovoltaik-Unterkonstruktion", icon: Wrench },
  { src: "/Images/AT/service/pv-wartung-techniker.jpg", alt: "Techniker bei Arbeiten an Photovoltaikmodulen auf einem Dach", icon: ShieldCheck },
  { src: "/Images/Team/in-diverse-workspace-project-manager-presents-eco-2025-01-08-23-29-22-utc-1.jpg", alt: "Projektbesprechung mit einem Photovoltaikmodul im Büro", icon: Network, pos: "60% 40%" },
];

const GEMEINSAM = [
  { titel: "Das Team", kopf: "Menschen", text: "Gründer, zweite Generation und die Rollen hinter jeder Anlage.", href: "/uber-uns/team", icon: Users, bild: { src: "/Images/Team/download.jpg", alt: "Fachleute mit Helmen und Warnwesten besprechen sich vor Photovoltaikmodulen" } },
  { titel: "Jobs in Österreich", kopf: "Karriere", text: "Projektleitung, Elektrotechnik, Netzanschluss, SCADA, Service und Lehre.", href: "/uber-uns/jobs", icon: Briefcase, bild: { src: "/Images/Jobs/download.jpg", alt: "Monteure mit Helmen arbeiten auf einem Flachdach mit Photovoltaikmodulen" } },
  { titel: "Ökovolt PV Award", kopf: "Auszeichnung", text: "Der jährliche Preis für die besten Anlagen unserer Kundinnen und Kunden.", href: "/pv-award", icon: Trophy, bild: { src: "/Images/Referenzen/Projekte-1.jpg", alt: "Photovoltaikmodule im Abendlicht mit Windrädern im Hintergrund" } },
  { titel: "Sponsoring", kopf: "Engagement", text: "Vereine, Kultur, Bildung und Nachwuchs in Österreich – so fragen Sie an.", href: "/sponsoring", icon: HeartHandshake, bild: { src: "/Images/AT/unternehmen-b/sponsoring-musikkapelle-tracht.jpg", alt: "Musikkapelle in Tracht bei einem Umzug" } },
  { titel: "Elektro-Partner werden", kopf: "Partnerprogramm", text: "Elektrotechnik-Betriebe bauen mit uns gemeinsam die Energiewende.", href: "/partner", icon: Handshake, bild: { src: "/Images/Jobs/jobs2.jpg", alt: "Monteur zeigt auf ein Photovoltaikmodul auf einem Dach" } },
  { titel: "Referenzen", kopf: "Projekte", text: "Anlagen für Gewerbe, Landwirtschaft und Gemeinden.", href: "/referenzen/projekte", icon: Building2, bild: { src: "/Images/Referenzen/referenzkarte4.jpg", alt: "Drei Personen gehen durch eine Freiflächen-Photovoltaikanlage" } },
];

const FAQ = [
  {
    q: "Wer steht hinter Ökovolt in Österreich?",
    a: `Betreiberin von oekovolt.com ist die ${FIRMA.name} mit Sitz in ${FIRMA.plz} ${FIRMA.ort} (${FIRMA.firmenbuch}, ${FIRMA.firmenbuchgericht}). Geschäftsführer ist ${FIRMA.geschaeftsfuehrer}. Gesellschafter sind ${gesellschafterText}.`,
  },
  {
    q: "Ist die Salzburg AG an Ökovolt beteiligt?",
    a: `Ja. Die Salzburg AG für Energie, Verkehr und Telekommunikation ist seit 2021 mit 49 % an der ${FIRMA.name} beteiligt; 51 % hält ${FIRMA.geschaeftsfuehrer}. Ökovolt ist bevorzugter PV-Errichter des Salzburg AG Konzerns.`,
  },
  {
    q: "Wie hängen oekovolt.com und oekovolt.de zusammen?",
    a: `Beide gehören zur Ökovolt Gruppe. Das Stammhaus ist die ${SCHWESTER.name} in ${SCHWESTER.ort} (Deutschland, gegründet 2010); sie setzt die technischen Standards und ist Inhaberin der Marken- und Websiterechte. Die österreichische ${FIRMA.name} ist eine eigenständige GmbH, die mit denselben Prozessen arbeitet und das Geschäft in Österreich verantwortet.`,
  },
  {
    q: "In welchen Bundesländern errichtet Ökovolt Photovoltaikanlagen?",
    a: `In allen neun Bundesländern. Der Sitz in ${FIRMA.ort} liegt im oberösterreichischen Innviertel direkt an der Grenze zu Salzburg; Projekte für Gewerbe, Industrie, Landwirtschaft und öffentliche Hand setzen wir österreichweit um.`,
  },
  {
    q: "Welche Technik entwickelt Ökovolt selbst?",
    a: `Einen eigenen Parkregler (EZA-Regler) für die Anforderungen der österreichischen Netzbetreiber, eigene Fernwartungssysteme und eigene SCADA-Systeme für Überwachung und Reporting. Digitalisierung und IT-Sicherheit entwickeln wir gemeinsam mit der ${SOLENSA.name}.`,
  },
  {
    q: "Was ist die ÖkoInvest GmbH?",
    a: `Die ÖkoInvest GmbH (FN 541505g, Sitz ${FIRMA.ort}) ist die Projektgesellschaft der Gruppe für Freiflächen-PV, Agri-PV, Contracting und PPA. Die ${FIRMA.name} ist mit 22,60 % beteiligt; die Geschäftsführung liegt bei Andreas Wegscheider und Manuel Thaler.`,
  },
];

const datumLang = (iso) => new Date(iso).toLocaleDateString("de-AT", { day: "numeric", month: "long", year: "numeric" });

export default function UberUnsPage() {
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
    mainEntity: { "@id": `${BASE_URL}/#organization` },
  };

  const [haupt, ...rest] = ROLLEN_AT.eintraege;

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <PageHero
        variant="immersive"
        breadcrumbs={[{ name: "Über uns" }]}
        eyebrow={PROFIL.kopf}
        title={
          <>
            Photovoltaik aus Ostermiething – <span className="ov-text-gradient-light">für ganz Österreich</span>
          </>
        }
        lead={`Die ${FIRMA.name} plant, errichtet und betreut seit 2012 Photovoltaikanlagen für Gewerbe, Industrie, Landwirtschaft und öffentliche Hand – aus dem Innviertel, direkt an der Salzach, in allen neun Bundesländern.`}
        image={{
          src: "/Images/AT/unternehmen-b/salzach-ettenau-ostermiething.jpg",
          alt: "Die Salzach in der Ettenau, Gemeinde Ostermiething, mit Schotterbank und Auwald",
          position: "50% 55%",
        }}
        points={["Firmensitz Ostermiething, Oberösterreich", "Eigene Parkregler, Fernwartung & SCADA", "Salzburg AG seit 2021 Gesellschafterin"]}
        actions={[
          { label: "Projekt besprechen", href: "/termin" },
          { label: "Unsere Geschichte", href: "#geschichte", icon: CalendarCheck2 },
        ]}
      />

      {/* Eigene Mannschaft, eigener Maschinenpark (#mannschaft) – Inhalte/Quellen: src/data/mannschaft.js */}
      <MannschaftSektion />

      {/* Auf einen Blick + Kennzahlen */}
      <Section tone="white" space="lg">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-end lg:gap-16">
          <SectionHeading
            eyebrow="Auf einen Blick"
            title={<>Errichter mit eigener Technik – <span className="ov-text-gradient">seit 2012 in Österreich</span></>}
          />
          <Reveal className="text-[16.5px] leading-relaxed text-ink-600">
            <p>{PROFIL.lead}</p>
            <p className="mt-5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[13.5px] font-semibold text-ink-700">
              <MapPin aria-hidden="true" className="h-4 w-4 text-ov-600" />
              {FIRMA.strasse}, {FIRMA.plz} {FIRMA.ort} · {FIRMA.firmenbuch}
            </p>
          </Reveal>
        </div>
        <Kennzahlen items={KENNZAHLEN} className="mt-14 border-t border-ink-200 pt-12 md:mt-16" />
      </Section>

      {/* Was die Gesellschaft macht – Foto-Bento */}
      <Section tone="sand" space="lg">
        <SectionHeading eyebrow={ROLLEN_AT.kopf} title={ROLLEN_AT.titel} lead={ROLLEN_AT.lead} className="mb-12 max-w-3xl" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 lg:grid-rows-2">
          <Reveal className="md:col-span-2 lg:col-span-1 lg:row-span-2">
            <FotoKachel
              href={haupt.href}
              bild={BENTO_BILDER[0]}
              icon={BENTO_BILDER[0].icon}
              kopf={haupt.rolle}
              titel={haupt.name}
              text={haupt.text}
              sizes="(max-width: 1024px) 100vw, 33vw"
              className="h-full min-h-[380px] lg:min-h-[620px]"
            />
          </Reveal>
          {rest.map((e, i) => (
            <Reveal key={e.name} delay={(i + 1) * 90} className={i === 2 ? "md:col-span-2" : ""}>
              <FotoKachel
                href={e.href}
                bild={BENTO_BILDER[i + 1]}
                icon={BENTO_BILDER[i + 1].icon}
                kopf={e.rolle}
                titel={e.name}
                text={e.text}
                sizes={i === 2 ? "(max-width: 1024px) 100vw, 66vw" : "(max-width: 768px) 100vw, 33vw"}
                className="h-full min-h-[300px]"
              />
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Unternehmensgeschichte – scroll-gebunden */}
      <section id="geschichte" className="relative scroll-mt-20 bg-navy-950 text-white">
        <div className="ov-container relative pb-10 pt-20 md:pt-28 lg:pb-4">
          <div aria-hidden="true" className="absolute -right-40 top-10 h-[420px] w-[420px] rounded-full bg-ov-500/20 blur-[130px]" />
          <SectionHeading
            dark
            eyebrow="Unternehmensgeschichte"
            title={<>Von Türkheim nach Ostermiething – <span className="ov-text-gradient-light">und in alle neun Bundesländer</span></>}
            lead="Vier Etappen, dieselben Gründer: vom Handwerksbetrieb 2010 über die österreichische Gesellschaft 2012 und das Rekordjahr 2021 bis heute."
            align="center"
            className="relative"
          />
        </div>
        <Zeitreise />
      </section>

      {/* Gesellschafter & Salzburg AG */}
      <Section tone="white" space="lg" id="gesellschafter" className="scroll-mt-20 overflow-hidden">
        <div aria-hidden="true" className="absolute -left-40 top-20 h-[380px] w-[380px] rounded-full bg-ov-100/70 blur-[110px]" />
        <div className="relative grid gap-12 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-16">
          <div>
            <SectionHeading eyebrow={`${SALZBURG_AG.zeitraum} · ${SALZBURG_AG.kopf}`} title={SALZBURG_AG.titel} lead={SALZBURG_AG.text} />
            <ul className="mt-8 grid gap-3">
              {SALZBURG_AG.punkte.map((p, i) => (
                <Reveal as="li" key={p} delay={i * 70} className="flex gap-3 text-[15.5px] leading-relaxed text-ink-700">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ov-500 text-white">
                    <Check aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={3} />
                  </span>
                  {p}
                </Reveal>
              ))}
            </ul>
          </div>
          <Reveal dir="scale" className="self-center rounded-[2rem] bg-sand-50 p-6 ring-1 ring-ink-200/60 md:p-10">
            <p className="text-[12.5px] font-semibold uppercase tracking-[0.16em] text-ov-700">Gesellschafterstruktur</p>
            <p className="mt-2 font-display text-[22px] font-extrabold text-ink-900">{FIRMA.name}</p>
            <div className="mt-8">
              <GesellschafterRing zusatz={["Gründer und Geschäftsführer", "Landesenergieversorger – seit 2021"]} />
            </div>
            <p className="mt-6 text-[13px] leading-relaxed text-ink-500">Quelle: Firmenbuch {FIRMA.firmenbuch}, Stand {datumLang(STAND)}.</p>
          </Reveal>
        </div>
      </Section>

      {/* Gruppenstruktur */}
      <Section tone="sand" space="lg" id="gruppe" className="scroll-mt-20">
        <div className="mb-12 grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:items-end lg:gap-16">
          <SectionHeading eyebrow="Unternehmensgruppe" title={URSPRUNG.titel} lead={URSPRUNG.absaetze[0]} />
          <div className="space-y-3 text-[15.5px] leading-relaxed text-ink-600">
            <p>{URSPRUNG.absaetze[1]}</p>
            <p>{URSPRUNG.absaetze[2]}</p>
          </div>
        </div>
        <Organigramm />
      </Section>

      {/* Haltung – Fotoband */}
      <section className="relative isolate overflow-hidden bg-navy-950 py-24 text-white md:py-36">
        <Image src="/Images/Referenzen/referenzkarte3.jpg" alt="" fill sizes="100vw" className="-z-20 object-cover object-[50%_35%]" />
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-r from-navy-950 via-navy-950/85 to-navy-950/55" />
        <div aria-hidden="true" className="ov-grid-bg absolute inset-0 -z-10 opacity-50" />
        <div className="ov-container grid gap-12 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:items-center lg:gap-20">
          <Reveal>
            <p className="text-[12.5px] font-semibold uppercase tracking-[0.18em] text-ov-300">{HALTUNG.kopf}</p>
            <h2 className="mt-5 font-display text-[clamp(2rem,1.3rem+2.8vw,3.6rem)] font-extrabold leading-[1.05] tracking-[-0.02em]">
              Wir bauen, was wir <span className="ov-text-gradient-light">selbst betreiben würden.</span>
            </h2>
            <p className="mt-6 text-[14px] font-semibold uppercase tracking-[0.14em] text-white/50">{CLAIM.split(".")[0]}.</p>
          </Reveal>
          <Reveal delay={120} className="ov-glass rounded-[2rem] p-7 md:p-9">
            <p className="font-display text-[18px] font-bold text-white">{HALTUNG.titel}</p>
            {HALTUNG.absaetze.map((a) => (
              <p key={a.slice(0, 20)} className="mt-3 text-[15.5px] leading-relaxed text-white/75">
                {a}
              </p>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Einzugsgebiet */}
      <Section tone="white" space="lg" id="einzugsgebiet" className="scroll-mt-20">
        <div className="mb-12 grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:items-end lg:gap-16">
          <SectionHeading
            eyebrow="Einzugsgebiet"
            title={<>Aus dem Innviertel – <span className="ov-text-gradient">in alle neun Bundesländer</span></>}
            lead={`${FIRMA.ort} liegt im Bezirk Braunau am Inn an der Salzach, die hier die Grenze zu Bayern bildet – wenige Kilometer von der Stadt Salzburg entfernt. Wählen Sie ein Bundesland: Sie sehen, mit welchen Netzbetreibern wir dort abstimmen und wie weit es von unserem Firmensitz ist.`}
          />
          <Reveal className="flex items-center gap-4 rounded-3xl bg-sand-50 p-3 ring-1 ring-ink-200/60">
            <div className="relative h-24 w-32 shrink-0 overflow-hidden rounded-2xl sm:h-28 sm:w-44">
              <Image src="/Images/AT/unternehmen-b/pfarrkirche-ostermiething.jpg" alt="Ortskern von Ostermiething mit Pfarrkirche" fill sizes="180px" className="object-cover" />
            </div>
            <div className="min-w-0 pr-2">
              <p className="font-display text-[16.5px] font-bold text-ink-900">Firmensitz {FIRMA.ort}</p>
              <p className="mt-1 text-[14px] leading-snug text-ink-600">
                {FIRMA.strasse}, {FIRMA.plz} {FIRMA.ort}
              </p>
              <Button href="/kontakt#anfahrt" variant="ghost" size="sm" pfeil className="-ml-4 mt-1 text-ov-700">
                Kontakt & Anfahrt
              </Button>
            </div>
          </Reveal>
        </div>
        <Einzugsgebiet />
      </Section>

      {/* Transparenz – Registerdaten im Akkordeon */}
      <Section tone="sand" space="md" id="register" className="scroll-mt-20">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
          <SectionHeading
            eyebrow="Für Einkauf & Compliance"
            title="Öffentlich abfragbar"
            lead="Jede Angabe zu unseren Gesellschaften lässt sich im österreichischen Firmenbuch, im GISA bzw. im deutschen Handelsregister nachschlagen."
          >
            <p className="mt-6 flex flex-wrap gap-x-4 gap-y-2 text-[14.5px] font-semibold">
              <a href={FIRMA.wko} className="inline-flex items-center gap-1.5 text-ov-700 hover:text-ov-800" target="_blank" rel="noopener noreferrer">
                WKO Firmen A–Z <ExternalLink aria-hidden="true" className="h-3.5 w-3.5" />
              </a>
              <a href={FIRMA.firmenabc} className="inline-flex items-center gap-1.5 text-ov-700 hover:text-ov-800" target="_blank" rel="noopener noreferrer">
                FirmenABC <ExternalLink aria-hidden="true" className="h-3.5 w-3.5" />
              </a>
            </p>
          </SectionHeading>
          <div className="space-y-3">
            <Akkordeon titel={`Unternehmensdaten ${FIRMA.name}`}>
              <table className="w-full text-left text-[14.5px]">
                <caption className="sr-only">Unternehmensdaten der {FIRMA.name}</caption>
                <tbody className="divide-y divide-ink-100">
                  {FAKTEN.map(([label, wert]) => (
                    <tr key={label} className="align-top">
                      <th scope="row" className="w-32 py-3 pr-4 font-semibold text-ink-500 md:w-44">
                        {label}
                      </th>
                      <td className="py-3 text-ink-900">{wert}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Akkordeon>
            <Akkordeon titel={`Stammhaus ${SCHWESTER.name} (Deutschland)`}>
              <dl className="grid gap-y-2 text-[14.5px]">
                {[
                  ["Sitz", GESELLSCHAFTEN.de.sitz],
                  ["Register", GESELLSCHAFTEN.de.register],
                  ["Registergericht", GESELLSCHAFTEN.de.gericht],
                  ["Eingetragen", GESELLSCHAFTEN.de.eingetragen],
                  ["USt-IdNr.", GESELLSCHAFTEN.de.ustId],
                ].map(([l, w]) => (
                  <div key={l} className="grid grid-cols-[8rem_minmax(0,1fr)] gap-3">
                    <dt className="text-ink-500">{l}</dt>
                    <dd className="text-ink-900">{w}</dd>
                  </div>
                ))}
              </dl>
            </Akkordeon>
            <Akkordeon titel="Projektgesellschaften im österreichischen Firmenbuch">
              <ul className="grid gap-3 sm:grid-cols-3">
                {BETEILIGUNGEN.map((b) => (
                  <li key={b.register} className="rounded-2xl bg-sand-50 p-4 ring-1 ring-ink-200/60">
                    <p className="font-display text-[14.5px] font-bold leading-snug text-ink-900">{b.name}</p>
                    <p className="mt-1.5 text-[13.5px] font-semibold text-ov-700">{b.register}</p>
                    <p className="mt-1 text-[13px] leading-snug text-ink-500">{b.gericht}</p>
                  </li>
                ))}
              </ul>
            </Akkordeon>
            <p className="pt-2 text-[13px] text-ink-500">Stand der Angaben: {datumLang(STAND)}</p>
          </div>
        </div>
      </Section>

      {/* Gemeinsam */}
      <Section tone="white" space="lg">
        <SectionHeading
          eyebrow="Gemeinsam"
          title="Menschen, Karriere und Engagement"
          lead="Wer wir sind, zeigt sich auch daran, mit wem wir arbeiten: mit unserem Team, mit Elektrotechnik-Betrieben, mit Vereinen – und mit Kundinnen und Kunden, deren Anlagen wir jedes Jahr auszeichnen."
          className="mb-12 max-w-3xl"
        />
        <ul className="ov-no-scrollbar -mx-4 flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-3">
          {GEMEINSAM.map((g, i) => (
            <Reveal as="li" key={g.href} delay={(i % 3) * 80} className="w-[82%] shrink-0 snap-start sm:w-auto">
              <FotoKachel href={g.href} bild={g.bild} icon={g.icon} kopf={g.kopf} titel={g.titel} text={g.text} className="h-full min-h-[280px]" />
            </Reveal>
          ))}
        </ul>
      </Section>

      <Section tone="sand" space="lg">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <SectionHeading eyebrow="Häufige Fragen" title="Über die Ökovolt Solartechnik GmbH" />
          <Faq items={FAQ} />
        </div>
      </Section>

      <Querverweise pfad="/uber-uns" />
      <CtaBand
        eyebrow="Lernen Sie uns kennen"
        title="Ein Errichter, der selbst betreibt – für Ihr Projekt in Österreich."
        text="Erzählen Sie uns von Ihrem Vorhaben: Dach, Freifläche oder Gemeindeprojekt. Wir melden uns mit einer ersten Einschätzung zu Anlagengröße, Netzanschluss und Wirtschaftlichkeit."
        primary={{ label: "Projekt anfragen", href: "/angebot" }}
        secondary={{ label: "Termin buchen", href: "/termin", icon: CalendarCheck2 }}
      />
    </div>
  );
}

/** Aufklappbarer Block – Inhalt bleibt server-gerendert im DOM. */
function Akkordeon({ titel, offen = false, children }) {
  return (
    <details open={offen} className="group rounded-3xl bg-white ring-1 ring-ink-200/70 open:shadow-lg">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 font-display text-[16.5px] font-bold text-ink-900 [&::-webkit-details-marker]:hidden">
        {titel}
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sand-100 text-ink-700 transition-transform duration-300 group-open:rotate-180">
          <ChevronDown aria-hidden="true" className="h-4 w-4" />
        </span>
      </summary>
      <div className="border-t border-ink-100 px-6 pb-6 pt-4">{children}</div>
    </details>
  );
}
