// src/app/forderungen/ladeinfrastruktur/page.js
//
// Wallbox- und Ladestation-Förderung Österreich 2026: Status der Bundesförderung
// (eRide beendet), Landesprogramme aller neun Länder, IFB für Betriebe, EAG-
// Zuschlag für Parkplatz-PV, Gemeinden – mit Quelle und Prüfdatum je Zeile.
// Ausgeschöpfte Programme werden als beendet benannt – kein Werbeversprechen auf einen Zuschuss.

import Link from "next/link";
import { ArrowRight, BadgeEuro, Building2, Calculator, Landmark, PlugZap, Sun } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import Faq from "@/components/ui/Faq";
import CtaBand from "@/components/ui/CtaBand";
import Reveal from "@/components/ui/Reveal";
import Querverweise from "@/components/Reusable/Querverweise";
import { AmpelChip, Checkliste, Hinweis, PruefenMarke, Quellen, StandPille, Tabelle } from "@/components/Forderungen/Shared/Bausteine";
import { KennzahlenBand } from "@/components/Forderungen/Shared/Premium";
import { EAG_IZ, STAND, STEUER } from "@/components/Forderungen/Shared/bund";
import { BASE_URL } from "@/lib/site";
import { hreflangLanguages } from "@/lib/hreflang";

const PAGE_URL = `${BASE_URL}/forderungen/ladeinfrastruktur`;
const TITLE = "Wallbox- & Ladestation-Förderung Österreich 2026 | Ökovolt";
const DESCRIPTION = "Wallbox-Förderung Österreich 2026: eRide beendet, Landesprogramme aller 9 Bundesländer, IFB 22 % für Betriebe – jede Angabe mit Quelle und Prüfdatum.";

/** Prüfdatum der Länder-Tabelle (Quellen am Erstellungstag abgerufen). */
const GEPRUEFT = { iso: "2026-10-11", label: "11.10.2026" };

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: ["Wallbox Förderung Österreich 2026", "Ladestation Förderung Betriebe", "eRide Förderung beendet", "Wallbox Förderung Bundesland", "Ladeinfrastruktur Förderung Unternehmen", "IFB Ladestation", "E-Ladestation Förderung Steiermark Burgenland"],
  alternates: { canonical: PAGE_URL, languages: hreflangLanguages(PAGE_URL) },
  openGraph: { type: "article", url: PAGE_URL, siteName: "Ökovolt Österreich", locale: "de_AT", title: TITLE, description: DESCRIPTION, images: [{ url: `${BASE_URL}/og-image.jpg`, width: 1200, height: 630, alt: "Ladeinfrastruktur-Förderung Österreich" }] },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, images: [`${BASE_URL}/og-image.jpg`] },
};

/** Status-Ampel: ja = laufendes Programm, teil = nur Teilbereich, nein = kein Programm gefunden. */
const AMPEL = { ja: { wert: "frei", label: "läuft" }, teil: { wert: "anzeige", label: "nur Teilbereich" }, nein: { wert: "bewilligung", label: "kein Landesprogramm gefunden" } };

/**
 * Landesprogramme für Ladeinfrastruktur – nur mit Primärquelle. pruefen:true,
 * wo die Richtlinie nur über Suchauszug oder Sekundärquelle vorlag.
 */
const LAENDER = [
  {
    land: "Burgenland",
    ampel: "ja",
    programm: "Elektro-Mobilität 2026: Wallbox, Standsäule, intelligentes Ladekabel",
    hoehe: "30 % der Kosten, max. 300 €",
    fuer: "Private (Hauptwohnsitz Burgenland), überwiegend private Nutzung",
    frist: "Aktion 01.01.–31.12.2026; Antrag bis 6 Monate nach Rechnungsdatum; kein Rechtsanspruch",
    quelle: { label: "Land Burgenland – Infoblatt Elektro-Mobilität 2026 (PDF)", url: "https://www.burgenland.at/fileadmin/user_upload/Downloads/Wohnbaufoerderung/2026/Infoblaetter/E-Mobilitaet-2026.pdf" },
  },
  {
    land: "Steiermark",
    ampel: "ja",
    programm: "Intelligente E-Ladestationen (Wallbox ab 11 kW, dreiphasig)",
    hoehe: "30 % der anrechenbaren Kosten, max. 300 €",
    fuer: "Private mit Hauptwohnsitz in der Steiermark, E-PKW ohne unternehmerische Nutzung",
    frist: "01.01.–31.12.2026, solange Mittel reichen; Antrag binnen 6 Monaten ab Rechnung; 7 Jahre Betrieb; Ökostrom oder PV ab 1,5 kWp",
    pruefen: true,
    quelle: { label: "Land Steiermark – Infoblatt Intelligente E-Ladestationen 2026 (PDF)", url: "https://www.wohnbau.steiermark.at/cms/dokumente/12856318_165238372/66e011b0/2026_Infoblatt%20Intelligente%20E-Ladestationen.pdf" },
  },
  {
    land: "Oberösterreich",
    ampel: "teil",
    programm: "Basisinfrastruktur für Wallboxen im mehrgeschoßigen Bestandswohnbau (über 3 Wohneinheiten)",
    hoehe: "50 % der Netto-Anschaffungskosten, max. 5.000 € je Wohnanlage",
    fuer: "Eigentümer von Mehrwohnungshäusern, Eigentümergemeinschaften – nicht für Einzel-Wallbox oder Betriebe",
    frist: "Rechnungsdatum bis 31.12.2026, nach Maßgabe der Mittel; Antrag vor Bestellung; Lastmanagement und eigener Zählpunkt Pflicht",
    quelle: { label: "Land OÖ – Ladeinfrastruktur für den mehrgeschossigen Wohnbau", url: "https://www.land-oberoesterreich.gv.at/222110.htm" },
  },
  {
    land: "Tirol",
    ampel: "teil",
    programm: "E-Ladestellen für E-Carsharing (Tiroler Mobilitätsprogramm 2022–2030)",
    hoehe: "80 % der Anschaffungskosten, max. 4.000 € je Ladestelle (max. 2 je Jahr)",
    fuer: "Gemeinden, Gemeindeverbände, Gesellschaften mit Gemeindebeteiligung – nur für geförderte E-Carsharing-Fahrzeuge",
    frist: "seit 01.01.2022, gekoppelt an die Richtlinie 2022–2030; Mobilitäts-Check der Gemeinde als Voraussetzung (Stand 03/2026)",
    quelle: { label: "Land Tirol – Informationsblatt E-Carsharing und E-Ladestellen (03/2026)", url: "https://www.tirol.gv.at/fileadmin/themen/verkehr/verkehrsplanung/mobil/Mobilitaetsprogramm/Informationsblatt_E-Carsharing_E-Ladestellen_03-26.pdf" },
    hinweis: "Für private Wallboxen wurde kein Landesprogramm gefunden; Sekundärquellen nennen nur vorbereitende Leitungsinfrastruktur über die Wohnbauförderung – bitte beim Land prüfen.",
  },
  {
    land: "Vorarlberg",
    ampel: "teil",
    programm: "Kein Landesprogramm gefunden; Energieversorger (illwerke vkw, Stadtwerke Feldkirch u. a.) fördern Wallboxen",
    hoehe: "100 € je Wallbox mit OCPP-Schnittstelle (Angebot der Energieversorger, ab 01.01.2026 für alle Anbieter)",
    fuer: "Private Kunden der beteiligten Energieversorger",
    frist: "laufend laut Energieinstitut Vorarlberg (zuletzt geändert 22.12.2025)",
    pruefen: true,
    quelle: { label: "Energieinstitut Vorarlberg – vlotte Wallbox-Förderung", url: "https://www.energieinstitut.at/privatpersonen/foerderkompass/foerderungen-der-energieversorger/vlotte-wallbox-foerderung" },
  },
  {
    land: "Niederösterreich",
    ampel: "nein",
    programm: "Kein laufendes Landesprogramm für Wallboxen oder Ladestationen gefunden",
    hoehe: "–",
    fuer: "eNu verweist Private und Betriebe auf umweltfoerderung.at; Gemeinden: nur E-Kommunalfahrzeuge (30 %, max. 5.000 €)",
    frist: `geprüft am ${GEPRUEFT.label}`,
    pruefen: true,
    quelle: { label: "Energie- und Umweltagentur NÖ – Förderungen für Elektromobilität", url: "https://www.energie-noe.at/foerderungen-fuer-elektromobilitaet" },
  },
  {
    land: "Salzburg",
    ampel: "nein",
    programm: "Kein Landesprogramm für Wallboxen gefunden; E-Ladestationen zählen in der PV-Förderrichtlinie nicht zur Pauschale",
    hoehe: "–",
    fuer: "Öffentliche Ladesäulen: Drittelfinanzierung Land / Salzburg AG / Gemeinde (Angebot an die Gemeinden, Datum nicht angegeben)",
    frist: `geprüft am ${GEPRUEFT.label}`,
    pruefen: true,
    quelle: { label: "Land Salzburg – Förderungsrichtlinien PV und Stromspeicher Private (01.07.2025)", url: "https://www.salzburg.gv.at/fileadmin/Dateien/Energie/Energief%C3%B6rderung/RL_PV_Priv_2025-07-01.pdf" },
  },
  {
    land: "Kärnten",
    ampel: "nein",
    programm: "Kein Landesprogramm für Wallboxen oder Ladestationen gefunden",
    hoehe: "–",
    fuer: "Suche auf ktn.gv.at ohne Treffer zu Ladeinfrastruktur",
    frist: `geprüft am ${GEPRUEFT.label}`,
    pruefen: true,
    quelle: { label: "Land Kärnten – Förderungen (Übersicht)", url: "https://www.ktn.gv.at/Verwaltung/Amt-der-Kaerntner-Landesregierung/Abteilung-10/Foerderungen" },
  },
  {
    land: "Wien",
    ampel: "nein",
    programm: "Keine Förderung für private oder betriebliche Ladepunkte gefunden; Ausbau öffentlicher Ladestellen über Wien Energie",
    hoehe: "–",
    fuer: "Ladepunkte bis 22 kW sind in Wien baurechtlich bewilligungsfrei (MA 37)",
    frist: `geprüft am ${GEPRUEFT.label}`,
    pruefen: true,
    quelle: { label: "Stadt Wien (MA 37) – Leitfaden Ladeplätze für E-Fahrzeuge (PDF)", url: "https://www.wien.gv.at/pdf/ma37/leitfaden-ladeplaetze-efahrzeuge.pdf" },
  },
];

const QUELLEN = [
  { label: "KPC – E-Ladeinfrastruktur für Betriebe 2025 (eRide), vorzeitig beendet", url: "https://www.umweltfoerderung.at/betriebe/e-ladeinfrastruktur-betriebe-2025-eride" },
  { label: "KPC – E-Ladeinfrastruktur für Private 2025 (eRide), vorzeitig beendet", url: "https://www.umweltfoerderung.at/privatpersonen/e-ladeinfrastruktur-private-2025-eride" },
  { label: "KPC – Übersicht Förderungen für Betriebe", url: "https://www.umweltfoerderung.at/betriebe" },
  { label: "USP – Investitionsfreibetrag (Öko-IFB 22 % bis 31.12.2026)", url: STEUER.quellen[0].url },
  { label: "EAG-Förderabwicklungsstelle – Investitionszuschuss (Innovationszuschlag Parkplatzüberdachung)", url: EAG_IZ.quellen[2].url },
  ...LAENDER.map((l) => l.quelle),
];

const FAQ = [
  {
    q: "Gibt es 2026 noch die eRide-Bundesförderung für Wallboxen?",
    a: "Nein. Die Programme „E-Ladeinfrastruktur für Betriebe 2025“ und „für Private 2025 (eRide)“ wurden wegen ausgeschöpften Budgets vorzeitig beendet; neue Registrierungen sind nicht mehr möglich. Wer sich rechtzeitig registriert hat, kann den Antrag noch innerhalb von 36 Wochen nach der Registrierung stellen (Rechnung höchstens 9 Monate alt). Ein Nachfolgeprogramm 2026 war am 11.10.2026 auf umweltfoerderung.at nicht angekündigt.",
  },
  {
    q: "Welche Bundesländer fördern 2026 eine private Wallbox?",
    a: "Mit eigenem Landeszuschuss: Burgenland (30 %, max. 300 €) und Steiermark (laut Infoblatt 2026: 30 %, max. 300 €, intelligente Wallbox ab 11 kW – bitte bei der Förderstelle prüfen). Oberösterreich fördert nur die Basisinfrastruktur im mehrgeschoßigen Bestandswohnbau, Tirol nur Ladestellen für kommunales E-Carsharing. In Vorarlberg zahlen Energieversorger 100 € je OCPP-fähige Wallbox. Für Niederösterreich, Salzburg, Kärnten und Wien haben wir kein Landesprogramm gefunden – Stand 11.10.2026, bitte vor dem Kauf prüfen.",
  },
  {
    q: "Was bleibt Betrieben ohne Zuschuss?",
    a: `Der Investitionsfreibetrag: Ladestationen für Elektrofahrzeuge gehören zu den ökologischen Wirtschaftsgütern, für Anschaffungen ${STEUER.ifb.zeitraum} gelten ${STEUER.ifb.satzOekoTemp} % (danach ${STEUER.ifb.satzOekoRegulaer} %). Dazu 20 % Vorsteuerabzug, die Abschreibung und – bei PV-Carports ab 10 Stellplätzen – der Innovationszuschlag von 30 % im EAG-Investitionszuschuss. Zuschüsse von Ländern oder Gemeinden kürzen die IFB-Bemessungsgrundlage.`,
  },
  {
    q: "Müssen Wallboxen beim Netzbetreiber gemeldet werden?",
    a: "Ja. Ladeeinrichtungen ab 3,68 kVA sind nach den Technischen und Organisatorischen Regeln (TOR) und den TAEV beim Netzbetreiber zu melden – praktisch jede 11- oder 22-kW-Wallbox. Die Meldung erledigt der konzessionierte Elektrotechniker; größere Ladeparks prüft der Netzbetreiber vorab. Unser Planer rechnet Anschlussleistung und Lastmanagement durch.",
  },
  {
    q: "Fördern Gemeinden Wallboxen?",
    a: "Vereinzelt. Beispiel aus unserem Einzugsgebiet: Wals-Siezenheim (Salzburg) fördert seit 01.04.2026 Wallbox oder Mehrzweckladekabel mit 25 % des Bruttopreises, max. 200 €. Die geprüften Gemeinden der Bezirke Braunau und Salzburg-Umgebung stehen auf der Förderstatus-Seite.",
  },
];

export default function LadeinfrastrukturFoerderung() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${PAGE_URL}/#webpage`,
    url: PAGE_URL,
    name: "Wallbox- und Ladestation-Förderung Österreich 2026",
    description: DESCRIPTION,
    inLanguage: "de-AT",
    isPartOf: { "@id": `${BASE_URL}/#website` },
    about: { "@id": `${BASE_URL}/#organization` },
    dateModified: GEPRUEFT.iso,
  };

  const laufend = LAENDER.filter((l) => l.ampel === "ja").length;
  const teil = LAENDER.filter((l) => l.ampel === "teil").length;

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <PageHero
        variant="immersive"
        breadcrumbs={[{ name: "Förderungen", href: "/forderungen/bundesfoerderung" }, { name: "Ladeinfrastruktur" }]}
        eyebrow={`Wallbox & Ladestation · geprüft am ${GEPRUEFT.label}`}
        title={<>Wallbox- und Ladestation-Förderung Österreich 2026: <span className="ov-text-gradient-light">was wirklich noch gilt</span></>}
        lead="Die Bundesförderung eRide ist ausgeschöpft. Was bleibt: Landesprogramme in zwei Ländern, Teilprogramme in drei weiteren, der Investitionsfreibetrag für Betriebe und der EAG-Zuschlag für Parkplatz-PV. Alle Angaben mit Quelle und Prüfdatum – ohne Werbeversprechen."
        image={{ src: "/Images/Ratgeber/solarcarport.jpg", alt: "Solarcarport mit Ladestationen auf einem Firmenparkplatz", position: "center 55%" }}
        points={["eRide Bund: beendet", "Burgenland: max. 300 € (Stmk. zu prüfen)", "Betriebe: IFB 22 % bis 31.12.2026", "Parkplatz-PV: +30 % EAG-Zuschlag"]}
        actions={[
          { label: "Zum Ladeinfrastruktur-Planer", href: "/rechner/ladeinfrastruktur", icon: Calculator },
          { label: "Projekt anfragen", href: "/angebot" },
        ]}
      />

      <KennzahlenBand
        items={[
          { text: "beendet", label: "eRide-Bundesförderung 2025 (Betriebe und Private)" },
          { value: laufend, label: "Länder mit Wallbox-Zuschuss für Private" },
          { value: teil, label: "Länder mit Teilprogramm (Wohnbau, Gemeinden, EVU)" },
          { value: STEUER.ifb.satzOekoTemp, suffix: " %", label: "IFB für Ladestationen bis 31.12.2026" },
        ]}
      />

      {/* Bund */}
      <Section tone="sand" space="md" id="bund" className="scroll-mt-24">
        <div className="mb-8 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading eyebrow="Bundesförderung" title="eRide 2025: ausgeschöpft – was noch für Registrierte gilt" lead="Beide Programme der Umweltförderung wurden wegen ausgeschöpften Budgets vorzeitig beendet. Neue Registrierungen sind nicht möglich; ein Programm 2026 ist nicht angekündigt." />
          <StandPille className="shrink-0 self-start md:self-auto">geprüft am {GEPRUEFT.label}</StandPille>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {[
            { titel: "E-Ladeinfrastruktur für Betriebe 2025 (eRide)", status: "wegen ausgeschöpften Budgets vorzeitig beendet", punkte: ["bis 30 % der umweltrelevanten Investitionskosten", "nur für bereits registrierte Vorhaben: Antrag binnen 36 Wochen nach Registrierung, Rechnung max. 9 Monate alt", "ausschließlich Strom aus erneuerbaren Quellen, 4 Jahre Betriebspflicht"], url: QUELLEN[0].url },
            { titel: "E-Ladeinfrastruktur für Private 2025 (eRide)", status: "wegen ausgeschöpften Budgets vorzeitig beendet", punkte: ["max. 50 % der umweltrelevanten Investitionskosten, Pauschalen laut Leitfaden", "kommunikationsfähige Wallbox oder intelligentes Ladekabel mit 100 % Ökostrom", "nur für bereits registrierte Vorhaben: Antrag binnen 36 Wochen nach Registrierung"], url: QUELLEN[1].url },
          ].map((p) => (
            <Reveal key={p.titel} className="rounded-[2rem] bg-white p-6 ring-1 ring-ink-200/70 md:p-8">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <h3 className="font-display text-[20px] font-bold leading-snug text-ink-900">{p.titel}</h3>
                <AmpelChip wert="bewilligung" label="beendet" />
              </div>
              <p className="mt-2 text-[14.5px] text-ink-600">Status laut KPC: {p.status}</p>
              <Checkliste className="mt-5" variante="nein" items={p.punkte} />
              <a href={p.url} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex items-center gap-1 text-[14px] font-semibold text-ov-700 underline decoration-ov-300 underline-offset-2 hover:text-ov-800">
                Quelle: umweltfoerderung.at
                <ArrowRight aria-hidden="true" className="h-3.5 w-3.5" />
                <span className="sr-only">(externer Link, neues Fenster)</span>
              </a>
            </Reveal>
          ))}
        </div>
        <Hinweis className="mt-6" titel="Formulierungen, die Sie bei uns nicht lesen">
          Wo das Budget ausgeschöpft ist, gibt es keine Förderung „zu sichern“. Wir nennen den Status so, wie ihn die Förderstelle veröffentlicht – und zeigen, was stattdessen bleibt: Landesprogramme, Investitionsfreibetrag, EAG-Zuschlag für Parkplatz-PV.
        </Hinweis>
      </Section>

      {/* Länder */}
      <Section tone="white" space="md" id="laender" className="scroll-mt-24">
        <div className="mb-8 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading eyebrow="Alle neun Bundesländer" title="Landesprogramme für Wallbox und Ladestation 2026" lead="Nur Programme mit Primärquelle. „Kein Landesprogramm gefunden“ heißt: auf den Landesseiten am Prüfdatum nichts auffindbar – nicht, dass es ausgeschlossen ist. Gemeinden und Energieversorger kommen dazu." />
          <StandPille className="shrink-0 self-start md:self-auto">geprüft am {GEPRUEFT.label}</StandPille>
        </div>
        <Tabelle
          caption="Landesförderungen für Ladeinfrastruktur nach Bundesland"
          dicht
          spalten={[
            { key: "land", label: "Bundesland", breite: "w-[16%]" },
            { key: "programm", label: "Programm / Status", breite: "w-[34%]" },
            { key: "hoehe", label: "Höhe", breite: "w-[18%]" },
            { key: "fuer", label: "Für wen · Frist", breite: "w-[32%]" },
          ]}
          zeilen={LAENDER.map((l) => ({
            land: (
              <span className="flex flex-col gap-1.5">
                <span>{l.land}</span>
                <AmpelChip wert={AMPEL[l.ampel].wert} label={AMPEL[l.ampel].label} className="self-start" />
              </span>
            ),
            programm: (
              <span>
                {l.programm}
                {l.hinweis && <span className="mt-1 block text-[13px] text-ink-600">{l.hinweis}</span>}
                {l.pruefen && <PruefenMarke stand={GEPRUEFT.label} />}
              </span>
            ),
            hoehe: <span className="font-semibold text-ink-900">{l.hoehe}</span>,
            fuer: (
              <span>
                {l.fuer}
                <span className="mt-1 block text-[13px] text-ink-600">{l.frist}</span>
                <a href={l.quelle.url} target="_blank" rel="noopener noreferrer" className="mt-1 inline-flex items-center gap-1 text-[12.5px] font-semibold text-ov-700 underline decoration-ov-300 underline-offset-2 hover:text-ov-800">
                  Quelle
                  <ArrowRight aria-hidden="true" className="h-3 w-3" />
                  <span className="sr-only">(externer Link, neues Fenster)</span>
                </a>
              </span>
            ),
          }))}
        />
        <p className="mt-4 text-[13.5px] text-ink-600">Richtwerte zur Orientierung – verbindlich sind die Richtlinien der Länder. Landesprogramme enden oft mit der Budgetausschöpfung. Details je Land: <Link href="/forderungen/landesforderungen" className="font-semibold text-ov-700 underline decoration-ov-300 underline-offset-2 hover:text-ov-800">Landesförderungen</Link>.</p>
      </Section>

      {/* Betriebe */}
      <Section tone="sand" space="md" id="betriebe" className="scroll-mt-24">
        <SectionHeading eyebrow="Für Betriebe" title="Ohne Zuschuss, aber nicht ohne Vorteil: IFB, EAG-Zuschlag, Vorsteuer" lead="Für Firmenflotte, Mitarbeiter- und Kundenparkplatz rechnet sich Ladeinfrastruktur 2026 vor allem steuerlich – und über den Solarcarport." className="mb-10" />
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { icon: BadgeEuro, titel: `Investitionsfreibetrag ${STEUER.ifb.satzOekoTemp} %`, text: `Ladestationen für E-Fahrzeuge sind Öko-Wirtschaftsgüter: ${STEUER.ifb.satzOekoTemp} % für Anschaffungen ${STEUER.ifb.zeitraum}, danach ${STEUER.ifb.satzOekoRegulaer} %. Maßgeblich ist der Zeitpunkt der Übergabe, nicht der Bestellung; Bemessungsgrundlage max. 1 Mio. € je Wirtschaftsjahr. Zuschüsse kürzen die Basis.`, href: "/forderungen/steuerlich#ifb-rechner", label: "IFB-Rechner" },
            { icon: Sun, titel: "Parkplatz-PV: +30 % EAG-Zuschlag", text: "Überdachen die Module ab 10 Stellplätzen den Parkplatz, gilt im EAG-Investitionszuschuss der Innovationszuschlag von 30 % – die Ladepunkte darunter werden über den Carport mitfinanziert. Fördercall 2026: " + EAG_IZ.naechsterCall.zeitraum + " – aktueller Stand auf der Förderstatus-Seite.", href: "/forderungen/bundesfoerderung", label: "EAG-Zuschuss" },
            { icon: Building2, titel: "Vorsteuer, AfA, Lastmanagement", text: "20 % Vorsteuerabzug, Abschreibung über die Nutzungsdauer und ein dynamisches Lastmanagement, das die Anschlussleistung schont – meist der größere Hebel als ein 300-€-Zuschuss.", href: "/rechner/ladeinfrastruktur", label: "Ladeinfrastruktur-Planer" },
          ].map((k) => {
            const Icon = k.icon;
            return (
              <Reveal key={k.titel} className="flex flex-col rounded-[2rem] bg-white p-6 ring-1 ring-ink-200/70 md:p-8">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-ov-50 text-ov-700">
                  <Icon aria-hidden="true" className="h-6 w-6" />
                </span>
                <h3 className="mt-5 font-display text-[20px] font-bold leading-snug text-ink-900">{k.titel}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-ink-700">{k.text}</p>
                <Link href={k.href} className="group mt-auto inline-flex items-center gap-2 pt-6 text-[15px] font-semibold text-ov-700 hover:text-ov-800">
                  {k.label}
                  <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Reveal>
            );
          })}
        </div>
        <div className="mt-8 flex flex-col items-start gap-4 rounded-[2rem] bg-navy-950 p-6 text-white md:flex-row md:items-center md:justify-between md:p-8">
          <div className="flex items-start gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-ov-300">
              <PlugZap aria-hidden="true" className="h-6 w-6" />
            </span>
            <div>
              <p className="font-display text-[20px] font-bold leading-snug">Ladepunkte, Spitzenlast, Netzanschluss – in Minuten durchgerechnet</p>
              <p className="mt-1 text-[14.5px] text-white/70">AC/DC-Mix, Lastmanagement, PV-Überschuss und Meldepflicht beim Netzbetreiber – mit Richtkosten, ohne Anmeldung.</p>
            </div>
          </div>
          <Link href="/rechner/ladeinfrastruktur" className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full bg-ov-600 px-6 py-3 text-[15px] font-semibold text-white hover:bg-ov-700">
            Zum Ladeinfrastruktur-Planer
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </Link>
        </div>
      </Section>

      {/* Gemeinden */}
      <Section tone="white" space="md" id="gemeinden">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <SectionHeading eyebrow="Gemeinden und Energieversorger" title="Die kleinen Töpfe: Gemeindeförderung und EVU-Bonus" lead="Einzelne Gemeinden fördern Wallboxen aus eigenen Energierichtlinien – belegt haben wir das bisher für Wals-Siezenheim (25 %, max. 200 €, Stand 11.10.2026). Wir prüfen das Gemeinde für Gemeinde, zum Start in den Bezirken Braunau am Inn und Salzburg-Umgebung." />
          <div className="rounded-[2rem] bg-sand-50 p-6 ring-1 ring-ink-200/70 md:p-8">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-ov-700 ring-1 ring-ov-200">
              <Landmark aria-hidden="true" className="h-6 w-6" />
            </span>
            <p className="mt-5 font-display text-[20px] font-bold leading-snug text-ink-900">Beispiel Wals-Siezenheim (Salzburg)</p>
            <p className="mt-2 text-[15px] leading-relaxed text-ink-700">Wallbox oder Mehrzweckladekabel: 25 % des Bruttopreises, max. 200 € – Förderrichtlinien Energie, Klima und Umwelt, Beschluss vom 18.03.2026, gültig ab 01.04.2026, Antrag bis 6 Monate nach Rechnung (Quelle: wals-siezenheim.at).</p>
            <Link href="/forderungen/status#gemeinden" className="group mt-5 inline-flex items-center gap-2 text-[15px] font-semibold text-ov-700 hover:text-ov-800">
              Alle geprüften Gemeinden im Förderstatus
              <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </Section>

      <Section tone="sand" space="md">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <SectionHeading eyebrow="Häufige Fragen" title="Wallbox-Förderung – kurz beantwortet" lead={`Allgemeine Information nach Stand ${GEPRUEFT.label}, keine Steuer- oder Rechtsberatung. Verbindlich sind die Richtlinien der Förderstellen.`} />
          <Faq items={FAQ} />
        </div>
        <Quellen klappbar className="mt-12" stand={GEPRUEFT.label} quellen={QUELLEN} hinweis={`Datenbasis Bund und Steuer: ${STAND.label}; Länder-Tabelle am ${GEPRUEFT.label} geprüft. Programme enden mit der Budgetausschöpfung – vor dem Kauf bei der Förderstelle nachfragen.`} />
      </Section>

      <Querverweise pfad="/forderungen/ladeinfrastruktur" />
      <CtaBand
        eyebrow="Ladeinfrastruktur für Betriebe"
        title="Flotte, Parkplatz, Solarcarport – geplant mit dem, was 2026 wirklich gilt."
        text="Wir planen Ladepunkte, Lastmanagement und PV-Überdachung aus einer Hand und liefern die Unterlagen für IFB, EAG-Zuschuss und Netzanmeldung."
        primary={{ label: "Projekt anfragen", href: "/angebot" }}
        secondary={{ label: "Ladeinfrastruktur für Betriebe", href: "/ladeinfrastruktur" }}
      />
    </div>
  );
}
