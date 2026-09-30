// src/app/produkte/wechselrichter/[slug]/page.js
//
// Wechselrichter-Detailseiten (Paket P4, M18, Stand 30.09.2026) – nur für Marken mit `belegt`
// und Kontext „wechselrichter“ in @/components/Hersteller/partner (E3: Fronius, Huawei, Solis).
// Alle anderen Slugs liefern 404 (dynamicParams = false).
//
// Inhalte bewusst eigenständig gegenüber den Speicherseiten (/produkte/stromspeicher/[slug]):
// Einsatz, Datenblatt-Kennwerte des Referenzgeräts und Auslegungshinweise je Marke.
// Alle Zahlen stammen aus dem in partner.js hinterlegten Herstellerdokument (Version, Abrufdatum).
// Keine Logos, keine Partner- oder Service-Zusage über den eigenen Einbau hinaus (E4 offen).

import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, BookOpen, ClipboardCheck, MonitorCog, SlidersHorizontal } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import FeatureGrid from "@/components/ui/FeatureGrid";
import Faq from "@/components/ui/Faq";
import CtaBand from "@/components/ui/CtaBand";
import Reveal from "@/components/ui/Reveal";
import { DATENBLATT_ABRUF, partnerFuer, partnerZuSlug } from "@/components/Hersteller/partner";
import { BASE_URL, FIRMA } from "@/lib/site";

const PFAD = "/produkte/wechselrichter";

/** Markenspezifische Inhalte. Kennwerte: siehe `datenblatt` der Marke in partner.js. */
const INHALT = {
  fronius: {
    titel: "Fronius Wechselrichter für Gewerbe-PV | Ökovolt",
    description:
      "Fronius-Wechselrichter aus Oberösterreich bei Ökovolt: Tauro und Tauro ECO für Gewerbedächer und Freiflächen – Datenblattwerte und Auslegung nach TOR Erzeuger.",
    h1: ["Fronius-Wechselrichter", "aus Oberösterreich"],
    lead: "Fronius entwickelt Wechselrichter in Pettenbach und fertigt unter anderem in Sattledt – im selben Bundesland wie unser Firmensitz in Ostermiething. Für Gewerbedächer und Freiflächen setzen wir vor allem die Baureihen Tauro und Tauro ECO ein und legen sie passend zu Modulfeldern und Netzanschluss aus.",
    points: ["Tauro und Tauro ECO bis 100 kW je Gerät", "Service und Ersatzteile aus Österreich", "Parkregler für mehrere Geräte"],
    einsatz: [
      { titel: "Große, einheitliche Modulfelder", text: "Der Tauro ECO arbeitet mit einem MPP-Tracker und hoher Startspannung. Er passt zu Freiflächen und Hallendächern, auf denen alle Strings gleich ausgerichtet sind." },
      { titel: "Dächer mit mehreren Ausrichtungen", text: "Der Tauro 50-3-D hat drei MPP-Tracker. Damit lassen sich Ost-, West- und Südflächen getrennt führen, ohne dass die schwächste Fläche den Ertrag der anderen begrenzt." },
      { titel: "Anlagen mit Nachhaltigkeitsbericht", text: "Für den Tauro ECO 100 nennt das Datenblatt eine Ökobilanz nach ÖNORM EN ISO 14040 und 14044, verifiziert durch Fraunhofer IZM – ein belegbarer Baustein für ESG-Berichte." },
    ],
    kennwerte: [
      ["AC-Nennleistung", "100 kW (Tauro ECO 100-3-D) · 50 kW (Tauro 50-3-D)"],
      ["Max. / europäischer Wirkungsgrad", "98,5 % / 98,2 % (ECO 100) · 98,5 % / 98,3 % (Tauro 50)"],
      ["MPP-Tracker", "1 (ECO 100) · 3 (Tauro 50)"],
      ["DC-Eingangsspannung", "580–1.000 V (ECO 100) · 200–1.000 V (Tauro 50)"],
      ["Einspeise-Startspannung", "650 V (ECO 100) · 200 V (Tauro 50)"],
      ["Max. PV-Generatorleistung", "150 kWp (ECO 100) · 75 kWp (Tauro 50)"],
      ["Schutzart, Einsatz", "IP65, innen und außen, Umgebung −40 bis +65 °C"],
      ["Gewicht", "103 kg (ECO 100) · 98 kg (Tauro 50)"],
    ],
    auslegung: [
      "**1.000 V statt 1.100 V:** Die maximale DC-Spannung der Tauro-Geräte liegt bei 1.000 V. Wir berechnen die Stringlänge deshalb für die kälteste Modultemperatur am Standort, damit die Leerlaufspannung an Frostmorgen darunter bleibt.",
      "**Startspannung beim ECO:** Der Tauro ECO speist erst ab 650 V ein und nutzt 580 bis 930 V als MPP-Bereich. Kurze Strings oder Teilverschattung in den Morgenstunden sprechen eher für den Tauro mit drei Trackern.",
      "**DC/AC-Verhältnis:** Das Datenblatt erlaubt bis 150 kWp Modulleistung je Tauro ECO 100, also ein Verhältnis bis 1,5. Wie viel davon sinnvoll ist, rechnen wir mit Stundenwerten für Ihren Standort nach.",
      "**EAG-Zuschlag:** Fronius fertigt in Oberösterreich. Ob ein konkretes Gerät den 10-%-Zuschlag für europäische Wertschöpfung erhält, hängt vom Nachweis über die Herstellerliste der EAG-Abwicklungsstelle ab – das prüfen wir je Angebot.",
    ],
    faq: [
      { q: "Welche Fronius-Wechselrichter setzt Ökovolt im Gewerbe ein?", a: "Vor allem die Baureihen Tauro und Tauro ECO mit 50 bzw. 100 kW je Gerät. Bei kleineren Betrieben und Premium-Wohnhäusern kommen auch Fronius-Hybrid-Wechselrichter in Frage – die Wahl hängt von Anlagengröße und Speicherkonzept ab." },
      { q: "Tauro oder Tauro ECO – was ist der Unterschied?", a: "Laut Datenblatt hat der Tauro 50-3-D drei MPP-Tracker und einen DC-Bereich ab 200 V, der Tauro ECO einen Tracker und einen DC-Bereich ab 580 V. Der ECO passt zu großen, einheitlichen Feldern, der Tauro zu Dächern mit mehreren Ausrichtungen." },
      { q: "Ist Ökovolt Fronius-Partner?", a: "Wir verbauen Fronius-Wechselrichter in Österreich. Einen Partnerstatus beim Hersteller nennen wir erst, wenn er mit Urkunde belegt ist. Für Angebot, Planung, Einbau und Netzanmeldung sind wir Ihr Ansprechpartner." },
    ],
  },
  huawei: {
    titel: "Huawei SUN2000 Wechselrichter für Gewerbe | Ökovolt",
    description:
      "Huawei SUN2000 bei Ökovolt: String-Wechselrichter mit bis zu 10 MPP-Trackern für große Gewerbedächer – Datenblattwerte, TOR-Auslegung und LUNA2000-Speicher.",
    h1: ["Huawei SUN2000", "für große Gewerbedächer"],
    lead: "Die String-Wechselrichter der Serie SUN2000 von Huawei decken vom Wohnhaus bis zur Freifläche alles ab. Im Gewerbe schätzen wir die vielen MPP-Tracker je Gerät und die Diagnosefunktionen auf Strangebene – etwa bei Hallendächern mit Aufbauten, Lichtkuppeln und mehreren Dachflächen.",
    points: ["Bis zu 10 MPP-Tracker je 100-kW-Gerät", "I-U-Kennlinien-Diagnose und AFCI", "Speicher LUNA2000 aus derselben Familie"],
    einsatz: [
      { titel: "Viele Teilflächen auf einem Dach", text: "Mit zehn Trackern und zwei Eingängen je Tracker verteilt der SUN2000-100KTL-M2 bis zu 20 Strings auf getrennt geregelte Felder – gut für Dächer mit Shed, Aufbauten und wechselnder Neigung." },
      { titel: "Anlagen, die aus der Ferne betreut werden", text: "Das Datenblatt nennt eine Smart-I-V-Kennlinien-Diagnose und Überwachung auf Strangebene. Fehlerhafte Strings lassen sich so eingrenzen, bevor jemand aufs Dach steigt." },
      { titel: "PV mit Speicher im Kleinbetrieb", text: "Für kleinere Anlagen kombinieren wir Huawei-Hybrid-Wechselrichter mit dem Speicher LUNA2000 aus derselben Produktfamilie." },
    ],
    kennwerte: [
      ["Gerät", "SUN2000-100KTL-M2"],
      ["AC-Nennleistung / max. Wirkleistung", "100 kW / 110 kW (cos φ = 1)"],
      ["Max. / europäischer Wirkungsgrad", "98,6 % / 98,4 % bei 400 V"],
      ["MPP-Tracker, Eingänge", "10 Tracker, je 2 Eingänge"],
      ["DC-Spannung", "max. 1.100 V, MPP-Bereich 200–1.000 V, Start 200 V"],
      ["Schutzfunktionen", "Lichtbogenerkennung (AFCI), Überspannungsschutz DC und AC, String-Trennung"],
      ["Kommunikation", "RS485, MBUS über die AC-Leitung (Trenntransformator nötig), optional Smart Dongle 4G oder WLAN-FE"],
      ["Schutzart, Gewicht", "IP66, 93 kg; Betrieb bis 4.000 m Seehöhe"],
    ],
    auslegung: [
      "**Maximalkapazität nach TOR:** Das Gerät liefert laut Datenblatt bis 110 kW Wirkleistung, mehr als die 100 kW Nennleistung. Für die Einstufung nach TOR Erzeuger (Typ A oder B ab 250 kW) stimmen wir die maßgebliche Leistung mit dem Netzbetreiber ab – drei Geräte können die Grenze bereits überschreiten.",
      "**Tracker nach Dachflächen:** Wir ordnen jede Dachfläche einem eigenen Tracker zu und nutzen die zwei Eingänge je Tracker für gleich lange, gleich ausgerichtete Strings.",
      "**Kommunikation und IT:** MBUS überträgt Daten über die AC-Leitung und braucht laut Datenblatt einen Trenntransformator; alternativ RS485 oder Dongle. Wie Datenlogger und Cloud-Zugang ins Firmennetz eingebunden werden, klären wir vor der Inbetriebnahme mit Ihrer IT.",
      "**Parkregler:** Bei mehreren Geräten an einem Netzanschlusspunkt geben wir Wirk- und Blindleistung über unseren Parkregler vor, damit die Vorgaben des Netzbetreibers am Übergabepunkt eingehalten werden.",
    ],
    faq: [
      { q: "Welche Huawei-Wechselrichter verbaut Ökovolt?", a: "Wechselrichter der Serie SUN2000 – im Gewerbe typischerweise dreiphasige Geräte der 100-kW-Klasse wie den SUN2000-100KTL-M2, bei kleineren Anlagen Hybrid-Wechselrichter in Kombination mit dem Speicher LUNA2000." },
      { q: "Wie viele MPP-Tracker hat der SUN2000-100KTL-M2?", a: "Laut Datenblatt zehn MPP-Tracker mit je zwei Eingängen. Das erlaubt eine feine Aufteilung unterschiedlich ausgerichteter oder verschatteter Dachflächen." },
      { q: "Kann ich später einen Huawei-Speicher nachrüsten?", a: "Bei Hybrid-Wechselrichtern der Serie SUN2000 ist der Speicher LUNA2000 vorgesehen. Ob Ihre Anlage dafür geeignet ist, prüfen wir anhand von Gerätetyp und Firmware; bei reinen Netzwechselrichtern ist eine AC-gekoppelte Lösung möglich." },
    ],
  },
  solis: {
    titel: "Solis Wechselrichter für Gewerbedächer | Ökovolt",
    description:
      "Solis-Wechselrichter (Ginlong) bei Ökovolt: dreiphasige 5G-PRO-Geräte mit 8 MPP-Trackern für Hallendächer – Datenblattwerte und Auslegung nach TOR Erzeuger.",
    h1: ["Solis-Wechselrichter", "für Hallen- und Gewerbedächer"],
    lead: "Solis ist die Wechselrichter-Marke von Ginlong Technologies. Wir setzen dreiphasige Solis-Geräte vor allem auf Gewerbe- und Hallendächern ein, auf denen viele Teilflächen mit unterschiedlicher Ausrichtung zusammenkommen und robuste Außenmontage gefragt ist.",
    points: ["8 MPP-Tracker je 100-kW-Gerät", "Schutzart IP66 für die Außenmontage", "Kommunikation über RS485 oder PLC"],
    einsatz: [
      { titel: "Hallendächer mit Teilflächen", text: "Der Solis-100K-5G-PRO hat laut Handbuch acht MPP-Tracker für bis zu 16 Strings – genug, um Ost-, West- und Südflächen getrennt zu führen." },
      { titel: "Außenmontage am Dach", text: "Schutzart IP66 und ein Betriebsbereich von −30 bis +60 °C erlauben die Montage nahe den Modulfeldern; kurze DC-Wege sparen Kabel und Verluste." },
      { titel: "Großflächige Module", text: "Mit bis zu 40 A Eingangsstrom und 50 A Kurzschlussstrom je Tracker passt das Gerät zu den hohen Strömen aktueller Modulformate – die Aufteilung prüfen wir je Tracker." },
    ],
    kennwerte: [
      ["Gerät", "Solis-100K-5G-PRO"],
      ["AC-Nennleistung / max. Leistung", "100 kW / 110 kW"],
      ["Max. / europäischer Wirkungsgrad", "98,5 % / 98,0 %"],
      ["MPP-Tracker, Strings", "8 Tracker, bis 16 Strings"],
      ["DC-Spannung", "max. 1.100 V, MPP-Bereich 160–1.000 V, Start 180 V"],
      ["Eingangsstrom je Tracker", "40 A bzw. 32 A (abwechselnd), Kurzschlussstrom 50 A"],
      ["Schutzart, Betrieb", "IP66, −30 bis +60 °C, bis 4.000 m Seehöhe"],
      ["Gewicht", "98 kg"],
    ],
    auslegung: [
      "**Tracker mit unterschiedlichem Strom:** Laut Handbuch sind die Tracker abwechselnd für 40 A und 32 A ausgelegt. Parallele Strings großer Module legen wir deshalb auf die Tracker mit 40 A.",
      "**Maximale Leistung beachten:** Das Gerät liefert bis 110 kW. Für die Einstufung nach TOR Erzeuger und die Anschlussleistung stimmen wir die maßgebliche Leistung mit dem Netzbetreiber ab.",
      "**Frostspannung:** Die maximale DC-Spannung liegt bei 1.100 V. Die Stringlänge rechnen wir für die tiefste Modultemperatur am Standort – in alpinen Lagen deutlich unter −15 °C.",
      "**Kommunikation:** Das Handbuch beschreibt RS485 und PLC. Bei mehreren Geräten binden wir die Kommunikation an Datenlogger und Parkregler an, damit Vorgaben des Netzbetreibers alle Geräte erreichen.",
    ],
    faq: [
      { q: "Wer steht hinter der Marke Solis?", a: "Solis ist die Wechselrichter-Marke von Ginlong Technologies. Für Angebot, Planung, Einbau und Netzanmeldung in Österreich ist Ökovolt Ihr Ansprechpartner." },
      { q: "Für welche Anlagen eignet sich der Solis-100K-5G-PRO?", a: "Für Gewerbe- und Hallendächer mit mehreren Teilflächen: Laut Handbuch hat er acht MPP-Tracker, 1.100 V maximale DC-Spannung und Schutzart IP66 für die Außenmontage." },
      { q: "Wie hoch ist der Wirkungsgrad?", a: "Das Handbuch nennt 98,5 % maximalen und 98,0 % europäischen Wirkungsgrad. Zwischen guten Geräten sind die Unterschiede klein; wichtiger sind Tracker, Spannungen und Service." },
    ],
  },
};

const slugsMitInhalt = () => partnerFuer("wechselrichter").filter((p) => INHALT[p.slug]);

export const dynamicParams = false;

export function generateStaticParams() {
  return slugsMitInhalt().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const partner = partnerZuSlug("wechselrichter", slug);
  const inhalt = INHALT[slug];
  if (!partner || !inhalt) return { title: "Seite nicht gefunden", robots: { index: false, follow: true } };
  const url = `${BASE_URL}${PFAD}/${slug}`;
  return {
    title: inhalt.titel,
    description: inhalt.description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      locale: "de_AT",
      url,
      siteName: "Ökovolt Österreich",
      title: inhalt.titel,
      description: inhalt.description,
      images: [{ url: `${BASE_URL}/og-image.jpg`, width: 1200, height: 630, alt: `${partner.title}-Wechselrichter bei Ökovolt` }],
    },
    twitter: { card: "summary_large_image", title: inhalt.titel, description: inhalt.description, images: [`${BASE_URL}/og-image.jpg`] },
  };
}

/** **fett** im Fließtext ohne Markdown-Parser */
function Fett({ text }) {
  return String(text)
    .split(/(\*\*[^*]+\*\*)/g)
    .filter(Boolean)
    .map((t, i) => (t.startsWith("**") ? <strong key={i} className="font-semibold text-ink-900">{t.slice(2, -2)}</strong> : t));
}

export default async function WechselrichterDetailPage({ params }) {
  const { slug } = await params;
  const partner = partnerZuSlug("wechselrichter", slug);
  const inhalt = INHALT[slug];
  if (!partner || !inhalt) notFound();

  const url = `${BASE_URL}${PFAD}/${slug}`;
  const db = partner.datenblatt;
  const weitere = slugsMitInhalt().filter((p) => p.slug !== slug);
  const speicherSeite = partner.kontexte.includes("stromspeicher") ? `/produkte/stromspeicher/${slug}` : null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${url}/#webpage`,
        url,
        name: inhalt.titel,
        description: inhalt.description,
        inLanguage: "de-AT",
        isPartOf: { "@id": `${BASE_URL}/#website` },
        about: { "@id": `${url}/#brand` },
        mainEntity: { "@id": `${url}/#service` },
      },
      {
        "@type": "Brand",
        "@id": `${url}/#brand`,
        name: partner.title,
        url: partner.website,
        ...(partner.sameAs?.length ? { sameAs: partner.sameAs } : {}),
      },
      {
        "@type": "Service",
        "@id": `${url}/#service`,
        name: `${partner.title}-Wechselrichter: Auslegung und Installation`,
        serviceType: "Planung und Installation von PV-Wechselrichtern",
        brand: { "@id": `${url}/#brand` },
        provider: { "@id": `${BASE_URL}/#organization` },
        areaServed: { "@type": "Country", name: "Österreich" },
        url,
      },
    ],
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <PageHero
        variant="immersive"
        breadcrumbs={[{ name: "Produkte", href: "/produkte/photovoltaikanlage" }, { name: "Wechselrichter", href: PFAD }, { name: partner.title }]}
        eyebrow={`Wechselrichter · bei Ökovolt verbaut`}
        title={
          <>
            {inhalt.h1[0]} <span className="ov-text-gradient-light">{inhalt.h1[1]}</span>
          </>
        }
        lead={inhalt.lead}
        image={{ src: "/Images/AT/ratgeber/eza-regler-parkregler.jpg", alt: `Wechselrichter und Regelungstechnik – ${partner.title}` }}
        points={inhalt.points}
        actions={[
          { label: `Angebot mit ${partner.title} anfragen`, href: "/angebot" },
          { label: "Alle Wechselrichter", href: PFAD, icon: SlidersHorizontal },
        ]}
      />

      <Section tone="white" space="lg">
        <SectionHeading
          eyebrow="Einsatz"
          title={
            <>
              Wo {partner.title} <span className="ov-text-gradient">bei uns passt</span>
            </>
          }
          className="mb-12"
        />
        <ul className="grid gap-5 md:grid-cols-3">
          {inhalt.einsatz.map((e, i) => (
            <Reveal as="li" key={e.titel} delay={i * 80} className="flex">
              <div className="flex w-full flex-col rounded-3xl bg-sand-50 p-7 ring-1 ring-ink-200/70">
                <span className="ov-num font-display text-[13px] font-bold text-ov-700">{String(i + 1).padStart(2, "0")}</span>
                <h2 className="mt-3 font-display text-[20px] font-bold leading-snug text-ink-900">{e.titel}</h2>
                <p className="mt-3 text-[15px] leading-relaxed text-ink-600">{e.text}</p>
              </div>
            </Reveal>
          ))}
        </ul>
      </Section>

      <Section tone="sand" space="lg" id="kennwerte">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <div>
            <SectionHeading eyebrow="Datenblatt" title={`Kennwerte des Referenzgeräts`} lead={`Werte laut Herstellerdokument für ${db.modell}. Welches Gerät Ihre Anlage bekommt, legen wir nach Modulen, Dachflächen und Netzanschluss fest.`} />
            <div className="mt-8 overflow-hidden rounded-3xl bg-white ring-1 ring-ink-200/70">
              <table className="w-full text-left text-[14.5px]">
                <caption className="sr-only">Datenblatt-Kennwerte {db.modell}</caption>
                <tbody className="divide-y divide-ink-100">
                  {inhalt.kennwerte.map(([k, v]) => (
                    <tr key={k} className="align-top">
                      <th scope="row" className="w-[42%] px-6 py-3.5 font-medium text-ink-500">
                        {k}
                      </th>
                      <td className="px-6 py-3.5 font-semibold text-ink-900">{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="border-t border-ink-100 px-6 py-4 text-[12.5px] leading-relaxed text-ink-500">
                Quelle:{" "}
                <a href={db.url} target="_blank" rel="noopener noreferrer" className="font-medium text-ov-700 underline decoration-ov-300 underline-offset-2">
                  {db.titel}
                </a>
                , {db.version}, abgerufen am {DATENBLATT_ABRUF}. Technische Änderungen durch den Hersteller vorbehalten.
              </p>
            </div>
          </div>
          <div>
            <SectionHeading eyebrow="Auslegung" title="Worauf wir bei diesem Gerät achten" />
            <ul className="mt-8 space-y-4">
              {inhalt.auslegung.map((a, i) => (
                <Reveal as="li" key={i} delay={i * 60} className="rounded-2xl bg-white p-5 text-[15px] leading-relaxed text-ink-600 ring-1 ring-ink-200/70">
                  <Fett text={a} />
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section tone="navy" space="lg" className="overflow-hidden">
        <div aria-hidden="true" className="ov-grid-bg absolute inset-0" />
        <div className="relative">
          <SectionHeading
            dark
            eyebrow="Im Gesamtsystem"
            title="Vom Gerät zur netzkonformen Anlage"
            lead="Ein Wechselrichter allein erfüllt noch keine Netzvorgaben. Entscheidend ist, wie er mit Regelung, Überwachung und Netzanmeldung zusammenspielt."
            className="mb-12"
          />
          <FeatureGrid
            cols={3}
            tone="dark"
            items={[
              { icon: SlidersHorizontal, title: "Parkregler am Netzanschlusspunkt", text: "Mehrere Geräte regeln wir gemeinsam – Wirk- und Blindleistung, Einspeiselimit und Signale des Netzbetreibers.", href: "/technik/parkregler" },
              { icon: MonitorCog, title: "Fernwartung und SCADA", text: "Überwachung in eigener, abgesicherter Infrastruktur – herstellerübergreifend für alle Geräte Ihrer Anlage.", href: "/technik/fernwartung" },
              { icon: ClipboardCheck, title: "TOR-Nachweise und Anmeldung", text: "Konformitätsnachweise, Netzzugangsantrag und Fertigstellungsmeldung erledigen wir für Sie.", href: "/netzanmeldung" },
            ]}
          />
        </div>
      </Section>

      <Section tone="white" space="lg">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div>
            <SectionHeading eyebrow="Häufige Fragen" title={`${partner.title}-Wechselrichter – kurz beantwortet`} />
            <div className="mt-8 flex flex-col gap-2">
              {speicherSeite && (
                <Link href={speicherSeite} className="group inline-flex min-h-11 items-center gap-2 text-[15px] font-semibold text-ov-700 hover:text-ov-800">
                  {partner.title}-Speicher {partner.speicher?.serie || ""} im Detail
                  <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              )}
              {weitere.map((w) => (
                <Link key={w.slug} href={`${PFAD}/${w.slug}`} className="group inline-flex min-h-11 items-center gap-2 text-[15px] font-semibold text-ov-700 hover:text-ov-800">
                  {w.title}-Wechselrichter
                  <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              ))}
              <Link href="/ratgeber/wechselrichter-photovoltaik#hersteller-vergleich" className="group inline-flex min-h-11 items-center gap-2 text-[15px] font-semibold text-ov-700 hover:text-ov-800">
                <BookOpen aria-hidden="true" className="h-4 w-4" />
                Datenblattvergleich weiterer Marken
                <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link href="/produkte/hersteller" className="group inline-flex min-h-11 items-center gap-2 text-[15px] font-semibold text-ov-700 hover:text-ov-800">
                Alle Hersteller im Überblick
                <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
          <Faq items={inhalt.faq} />
        </div>
      </Section>

      <CtaBand
        title={`${partner.title}-Wechselrichter für Ihre Anlage – passend ausgelegt.`}
        text={`${FIRMA.name} aus ${FIRMA.ort} plant Wechselrichter, Regelung und Monitoring aus einer Hand und übernimmt die Netzanmeldung – in ganz Österreich.`}
        primary={{ label: "Angebot anfragen", href: "/angebot" }}
        secondary={{ label: "Ratgeber Wechselrichter", href: "/ratgeber/wechselrichter-photovoltaik" }}
      />
    </div>
  );
}
