// src/app/ratgeber/einspeiseverguetung-2026/page.js

import { CalendarClock, TrendingDown } from "lucide-react";

import ArtikelLayout from "@/components/Ratgeber/ArtikelLayout";
import {
  Abschnitt,
  Checkliste,
  KartenRaster,
  Kennzahlband,
  KurzFazit,
  LinkKarten,
  Merkkasten,
  Prosa,
  Tabelle,
  TextLink,
  Zwischentitel,
} from "@/components/Ratgeber/Bausteine";
import VerguetungsTabelle from "@/components/Ratgeber/VerguetungsTabelle";
import Faq from "@/components/ui/Faq";
import Solarrechner from "@/components/Solarrechner/Rechner";
import { VERGUETUNG, ct } from "@/data/einspeiseverguetung";
import { ANNAHMEN } from "@/data/solarrechner";
import { artikelNachSlug, artikelPfad } from "@/lib/ratgeber";

const BASE_URL = "https://www.oekovolt.com";
const SLUG = "einspeiseverguetung-2026";
const artikel = artikelNachSlug(SLUG);
const PAGE_URL = `${BASE_URL}${artikelPfad(SLUG)}`;

// Ratgeber-Inhalte sind deutschlandspezifisch (EEG) und existieren nicht auf
// oekovolt.com -> bewusst KEIN hreflang, nur der Canonical.
export const metadata = {
  title: `${artikel.title} | Ökovolt`,
  description: artikel.description,
  keywords: artikel.keywords,
  alternates: { canonical: PAGE_URL },
  robots: { index: true, follow: true },
  openGraph: {
    type: "article",
    url: PAGE_URL,
    siteName: "Ökovolt Österreich",
    title: artikel.title,
    description: artikel.description,
    publishedTime: artikel.veroeffentlicht,
    modifiedTime: artikel.aktualisiert,
    images: [{ url: `${BASE_URL}/og/ratgeber/einspeiseverguetung-2026.jpg`, width: 1200, height: 630, alt: artikel.title }],
  },
  twitter: {
    card: "summary_large_image",
    title: artikel.title,
    description: artikel.description,
    images: [`${BASE_URL}/og/ratgeber/einspeiseverguetung-2026.jpg`],
  },
};

const TOC = [
  { id: "kurz", label: "Das Wichtigste in Kürze" },
  { id: "saetze", label: "Aktuelle Sätze 2026" },
  { id: "modelle", label: "Überschuss- oder Volleinspeisung?" },
  { id: "dauer", label: "Wie lange gilt mein Satz?" },
  { id: "degression", label: "Warum die Vergütung sinkt" },
  { id: "solarspitzen", label: "Solarspitzengesetz: neue Regeln" },
  { id: "rechnung", label: "Beispielrechnung 10 kWp" },
  { id: "rechner", label: "Selbst durchrechnen" },
  { id: "aenderung-2027", label: "Was sich 2027 ändern soll" },
  { id: "faq", label: "Häufige Fragen" },
];

const satz10 = ct(VERGUETUNG.saetze[0].teileinspeisung);
const voll10 = ct(VERGUETUNG.saetze[0].volleinspeisung);

const FAQ = [
  {
    q: "Wie hoch ist die Einspeisevergütung 2026?",
    a: `Für Anlagen bis 10 kWp, die ab dem ${VERGUETUNG.gueltigAbLabel} in Betrieb gehen, liegt die Einspeisevergütung bei ${satz10} ct/kWh bei Überschusseinspeisung und ${voll10} ct/kWh bei Volleinspeisung. Anlagenteile zwischen 10 und 40 kWp erhalten ${ct(VERGUETUNG.saetze[1].teileinspeisung)} bzw. ${ct(VERGUETUNG.saetze[1].volleinspeisung)} ct/kWh – die Staffelung wirkt anteilig.`,
  },
  {
    q: "Wie lange bekomme ich die Einspeisevergütung?",
    a: `Der bei Inbetriebnahme gültige Satz ist für ${VERGUETUNG.garantieJahre} volle Kalenderjahre plus den Rest des Inbetriebnahmejahres garantiert. Eine Anlage, die im September 2026 ans Netz geht, wird also bis Ende 2046 mit dem heutigen Satz vergütet – unabhängig davon, wie sich die Sätze für Neuanlagen entwickeln.`,
  },
  {
    q: "Lohnt sich Volleinspeisung oder Überschusseinspeisung mehr?",
    a: "Für Privathaushalte lohnt sich in aller Regel die Überschusseinspeisung, weil jede selbst verbrauchte Kilowattstunde rund 30 bis 35 Cent Netzbezug ersetzt – deutlich mehr als die Einspeisevergütung einbringt. Volleinspeisung ist vor allem dann interessant, wenn kaum Eigenverbrauch möglich ist, etwa auf einer Scheune oder einem zweiten Dach ohne nennenswerten Verbrauch.",
  },
  {
    q: "Sinkt meine Einspeisevergütung nachträglich?",
    a: "Nein. Die halbjährliche Degression betrifft ausschließlich Anlagen, die nach dem jeweiligen Stichtag neu in Betrieb gehen. Bestehende Anlagen behalten ihren Satz über die gesamte Vergütungsdauer. Auch die geplante EEG-Novelle 2027 sieht Bestandsschutz vor.",
  },
  {
    q: "Bekomme ich bei negativen Strompreisen eine Vergütung?",
    a: "Für Anlagen, die seit dem 25. Februar 2025 in Betrieb gehen, entfällt die Vergütung in Zeiträumen mit negativen Börsenstrompreisen (Solarspitzengesetz). Diese Zeiträume werden jedoch am Ende der 20-jährigen Förderdauer angehängt. Mit Speicher und hohem Eigenverbrauch fällt der Effekt für Privathaushalte gering aus.",
  },
  {
    q: "Muss ich die Einspeisevergütung versteuern?",
    a: "Einnahmen aus Photovoltaikanlagen bis 30 kWp je Wohn- oder Gewerbeeinheit sind nach § 3 Nr. 72 EStG von der Einkommensteuer befreit; beim Kauf gilt nach § 12 Abs. 3 UStG ein Umsatzsteuersatz von 0 %. Für größere Anlagen oder gewerbliche Konstellationen gelten abweichende Regeln – lassen Sie das im Zweifel steuerlich prüfen.",
  },
  {
    q: "Was passiert nach 20 Jahren?",
    a: "Nach dem Ende der EEG-Vergütung darf die Anlage weiterlaufen. Üblich sind dann eine Anschlussvergütung zum Marktwert, der Wechsel in die Direktvermarktung oder die Umstellung auf maximalen Eigenverbrauch mit Speicher. Alternativ lohnt sich oft ein Repowering mit leistungsstärkeren Modulen.",
  },
];

// Beispielrechnung – Annahmen bewusst offengelegt. Ertrag und Strompreis
// kommen aus @/data/solarrechner, damit dieser Artikel nie andere Werte zeigt
// als der Rechner weiter unten auf derselben Seite.
const BEISPIEL = { kwp: 10, ertragProKwp: ANNAHMEN.ertragProKwpSued, eigenverbrauchsquote: 0.3, strompreis: ANNAHMEN.strompreis };
const jahresertrag = BEISPIEL.kwp * BEISPIEL.ertragProKwp;
const eigenverbrauch = jahresertrag * BEISPIEL.eigenverbrauchsquote;
const eingespeist = jahresertrag - eigenverbrauch;
const satz = VERGUETUNG.saetze[0].teileinspeisung / 100;
const einspeiseErloes = eingespeist * satz;
const eigenverbrauchsErsparnis = eigenverbrauch * BEISPIEL.strompreis;
const vollErloes = jahresertrag * (VERGUETUNG.saetze[0].volleinspeisung / 100);

const eur = (n) => Math.round(n).toLocaleString("de-DE") + " €";
const kwh = (n) => Math.round(n).toLocaleString("de-DE");

export default function EinspeiseverguetungPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${PAGE_URL}/#article`,
        headline: artikel.title,
        description: artikel.description,
        inLanguage: "de-AT",
        datePublished: artikel.veroeffentlicht,
        dateModified: artikel.aktualisiert,
        author: { "@type": "Organization", name: "Ökovolt-Redaktion", "@id": `${BASE_URL}/#organization` },
        publisher: { "@id": `${BASE_URL}/#organization` },
        mainEntityOfPage: { "@type": "WebPage", "@id": PAGE_URL },
        image: `${BASE_URL}${artikel.bild}`,
        articleSection: artikel.kategorie,
        keywords: artikel.keywords.join(", "),
        timeRequired: `PT${artikel.lesezeit}M`,
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <ArtikelLayout
        artikel={artikel}
        toc={TOC}
        titel={
          <>
            Einspeisevergütung 2026: <span className="ov-text-gradient">aktuelle Sätze</span> in ct/kWh
          </>
        }
        badge={
          <div className="flex items-center gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-ov-500 text-white">
              <CalendarClock aria-hidden="true" className="h-6 w-6" />
            </span>
            <div>
              <p className="ov-num font-display text-[22px] font-extrabold leading-none text-ink-900">
                {satz10} ct <span className="text-[14px] font-semibold text-ink-500">/ kWh</span>
              </p>
              <p className="mt-1 text-[12.5px] leading-snug text-ink-500">bis 10 kWp, Inbetriebnahme ab {VERGUETUNG.gueltigAbLabel}</p>
            </div>
          </div>
        }
        seitenCta={{ titel: "Was bringt Ihre Anlage?", text: "Ertrag, Eigenverbrauch und Amortisation mit den aktuellen EEG-Sätzen.", href: "/solarrechner", label: "Zum Solarrechner" }}
        cta={{
          title: "2026 in Betrieb gehen und den Satz für 20 Jahre sichern.",
          text: "Wir planen Ihre Anlage auf maximalen Eigenverbrauch, übernehmen Netzanmeldung und Marktstammdatenregister – und nennen Ihnen einen realistischen Inbetriebnahmetermin.",
          primary: { label: "Angebot anfragen", href: "/angebot" },
          secondary: { label: "Ertrag berechnen", href: "/solarrechner" },
        }}
      >
        <KurzFazit
          punkte={[
            `Seit dem ${VERGUETUNG.gueltigAbLabel} gibt es für Anlagen bis 10 kWp ${satz10} ct/kWh bei Überschusseinspeisung.`,
            `Bei Volleinspeisung sind es ${voll10} ct/kWh – dafür entfällt der Eigenverbrauch.`,
            `Der Satz ist ab Inbetriebnahme ${VERGUETUNG.garantieJahre} Jahre plus Restjahr garantiert und sinkt nachträglich nicht.`,
            "Seit dem Solarspitzengesetz (Februar 2025) gibt es bei negativen Börsenpreisen keine Vergütung – die Zeit wird hinten angehängt.",
            "Die EEG-Novelle 2027 soll die feste Vergütung für neue kleine Anlagen ab 2027 ablösen; wer 2026 in Betrieb geht, ist geschützt.",
          ]}
        />

        <Abschnitt id="saetze" titel="Aktuelle Einspeisevergütung 2026 im Überblick">
          <Prosa>
            <p>
              <strong>Die Einspeisevergütung ist der gesetzlich festgelegte Betrag, den Ihr Netzbetreiber für jede ins öffentliche Netz eingespeiste
              Kilowattstunde Solarstrom zahlt.</strong> Wie hoch sie ausfällt, hängt von zwei Dingen ab: von der Größe Ihrer Anlage und davon, ob Sie nur
              den Überschuss oder die gesamte Erzeugung einspeisen.
            </p>
          </Prosa>

          <VerguetungsTabelle />

          <Prosa>
            <p>
              Die Staffelung wirkt anteilig, nicht nach dem Alles-oder-nichts-Prinzip. Eine 20-kWp-Anlage bekommt für die ersten 10 kWp den höheren Satz
              und erst für die zweiten 10 kWp den niedrigeren – der Mischsatz liegt bei rund{" "}
              {ct((VERGUETUNG.saetze[0].teileinspeisung + VERGUETUNG.saetze[1].teileinspeisung) / 2)} ct/kWh.
            </p>
          </Prosa>
        </Abschnitt>

        <Abschnitt id="modelle" titel="Überschusseinspeisung oder Volleinspeisung?">
          <Prosa>
            <p>
              Auf den ersten Blick wirkt die Volleinspeisung attraktiver – der Satz ist deutlich höher. Der Haken: Sie verzichten damit vollständig auf den
              Eigenverbrauch. Und genau der ist für Privathaushalte der eigentliche Hebel.
            </p>
          </Prosa>
          <KartenRaster
            items={[
              { titel: "Überschusseinspeisung", text: `Sie verbrauchen so viel Solarstrom wie möglich selbst und speisen nur den Rest für ${satz10} ct ein. Jede selbst genutzte kWh spart den vollen Netzstrompreis. Der Standard für Ein- und Zweifamilienhäuser.` },
              { titel: "Volleinspeisung", text: `Der gesamte Ertrag geht für ${voll10} ct ins Netz. Sinnvoll, wenn am Standort kaum Strom verbraucht wird. Muss dem Netzbetreiber vor Inbetriebnahme – danach jeweils vor dem 1. Dezember für das Folgejahr – mitgeteilt werden.` },
            ]}
          />
          <Merkkasten variant="tipp" titel="Beides kombinieren">
            Wer ein großes Dach hat, kann zwei getrennt gemessene Anlagen betreiben: eine für den Eigenverbrauch mit Überschusseinspeisung und eine
            zweite in Volleinspeisung. Ob sich der zusätzliche Aufwand für Zähler und Anmeldung lohnt, rechnen wir im Einzelfall durch.
          </Merkkasten>
        </Abschnitt>

        <Abschnitt id="dauer" titel="Wie lange gilt mein Vergütungssatz?">
          <Prosa>
            <p>
              Entscheidend ist das Datum der Inbetriebnahme. Der an diesem Tag gültige Satz wird Ihnen für {VERGUETUNG.garantieJahre} volle Kalenderjahre
              plus den Rest des Inbetriebnahmejahres garantiert. Eine Anlage, die im September 2026 ans Netz geht, erhält den heutigen Satz also bis Ende
              2046.
            </p>
          </Prosa>
          <Merkkasten variant="wichtig">
            Spätere Absenkungen oder Gesetzesänderungen wirken sich nicht rückwirkend aus. Maßgeblich ist die technische Inbetriebnahme – nicht der
            Vertragsabschluss. Planen Sie bei Stichtagen genügend Puffer für Lieferung, Montage und Zählersetzung ein.
          </Merkkasten>
        </Abschnitt>

        <Abschnitt id="degression" titel="Warum die Einspeisevergütung immer weiter sinkt">
          <Prosa>
            <p>
              Das EEG sieht eine feste Degression vor: Alle sechs Monate – jeweils zum 1. Februar und zum 1. August – sinken die Sätze für Neuanlagen um{" "}
              {VERGUETUNG.degressionProHalbjahr} %. Der Gedanke dahinter: Photovoltaik ist über die Jahre deutlich günstiger geworden, die Förderung soll
              entsprechend mitwandern.
            </p>
          </Prosa>
          <Kennzahlband
            icon={TrendingDown}
            wert={`−${VERGUETUNG.degressionProHalbjahr} %`}
            titel={`Nächste planmäßige Absenkung: ${VERGUETUNG.naechsteAnpassungLabel}`}
            text={`Wer vorher in Betrieb geht, sichert sich ${satz10} ct/kWh für die volle Laufzeit. Ob es 2027 überhaupt noch eine feste Vergütung für Neuanlagen gibt, entscheidet die EEG-Novelle.`}
          />
        </Abschnitt>

        <Abschnitt id="solarspitzen" titel="Solarspitzengesetz: Was seit 2025 zusätzlich gilt">
          <Prosa>
            <p>
              <strong>Das Solarspitzengesetz ist seit dem 25. Februar 2025 in Kraft und soll Netzüberlastungen an sonnigen Mittagen verhindern.</strong>{" "}
              Für neue Anlagen bringt es drei wesentliche Änderungen:
            </p>
          </Prosa>
          <Checkliste
            punkte={[
              "Keine Einspeisevergütung in Zeiträumen mit negativen Börsenstrompreisen. Die ausgefallenen Zeiten werden am Ende der 20-jährigen Förderdauer angehängt.",
              "Solange kein intelligentes Messsystem mit Steuerbox eingebaut ist, darf die Anlage höchstens 60 % ihrer Modulleistung ins Netz einspeisen.",
              "Bestandsanlagen können freiwillig in das neue Modell wechseln und erhalten dafür einen kleinen Bonus auf den Vergütungssatz.",
            ]}
          />
          <Merkkasten variant="info" titel="Was das für Sie bedeutet">
            Die 60-%-Grenze betrifft nur die Einspeisung, nicht die Erzeugung. Mit Speicher, Wallbox oder Wärmepumpe verbrauchen Sie die Mittagsspitze
            ohnehin selbst – der Ertragsverlust liegt dann meist bei wenigen Prozent. Mehr zu Begriffen wie{" "}
            <TextLink href="/wissen/lexikon#solarspitzengesetz">Solarspitzengesetz</TextLink> und{" "}
            <TextLink href="/wissen/lexikon#imsys">intelligentes Messsystem</TextLink> im Lexikon.
          </Merkkasten>
        </Abschnitt>

        <Abschnitt id="rechnung" titel="Beispielrechnung: 10-kWp-Anlage im Allgäu">
          <Prosa>
            <p>
              Die folgende Rechnung zeigt, warum der Eigenverbrauch für Privathaushalte so viel schwerer wiegt als die Einspeisung. Angenommen ist eine{" "}
              {BEISPIEL.kwp}-kWp-Anlage mit {kwh(BEISPIEL.ertragProKwp)} kWh Ertrag je kWp – ein realistischer Wert für Süddeutschland – und eine
              Eigenverbrauchsquote von {BEISPIEL.eigenverbrauchsquote * 100} % ohne Speicher.
            </p>
          </Prosa>
          <Tabelle
            caption="Beispielrechnung Einspeiseerlös gegenüber Eigenverbrauch bei 10 kWp"
            kopf={["Position", "Menge", "Wert pro Jahr"]}
            zeilen={[
              ["Jahresertrag", `${kwh(jahresertrag)} kWh`, "–"],
              [`Eigenverbrauch (${(BEISPIEL.strompreis * 100).toFixed(0)} ct/kWh gespart)`, `${kwh(eigenverbrauch)} kWh`, eur(eigenverbrauchsErsparnis)],
              [`Überschusseinspeisung (${satz10} ct/kWh)`, `${kwh(eingespeist)} kWh`, eur(einspeiseErloes)],
              ["Summe Überschussmodell", "", eur(eigenverbrauchsErsparnis + einspeiseErloes)],
              [`Zum Vergleich: Volleinspeisung (${voll10} ct/kWh)`, `${kwh(jahresertrag)} kWh`, eur(vollErloes)],
            ]}
            hervorheben={2}
            markierteZeile={3}
            minBreite={480}
            fussnote="Beispielrechnung mit gerundeten Werten, ohne Betriebskosten. Der tatsächliche Ertrag hängt von Dachneigung, Ausrichtung, Verschattung und Verbrauchsverhalten ab."
          />
          <Prosa>
            <p>
              Der selbst verbrauchte Strom bringt in diesem Beispiel rund {eur(eigenverbrauchsErsparnis)} im Jahr, die Einspeisung dagegen nur etwa{" "}
              {eur(einspeiseErloes)} – und das bei weniger als der Hälfte der Strommenge. Genau deshalb rechnet sich ein{" "}
              <TextLink href="/produkte/stromspeicher">Stromspeicher</TextLink> für die meisten Haushalte: Er verschiebt Kilowattstunden von der schlecht
              vergüteten Einspeisung in den gut bezahlten Eigenverbrauch.
            </p>
          </Prosa>
        </Abschnitt>

        <Abschnitt id="rechner" titel="Rechnen Sie es für Ihr Dach durch">
          <Prosa>
            <p>
              Die Beispielrechnung passt selten exakt. Im Rechner setzen Sie Ihre eigene Anlagengröße, Ihren Verbrauch und Ihr Dach ein – die
              Einspeisesätze sind dieselben wie in der Tabelle, inklusive anteiliger Staffelung.
            </p>
          </Prosa>
          <div className="mt-8 lg:-mr-8 xl:-mr-16">
            <Solarrechner className="shadow-xl" />
          </div>
        </Abschnitt>

        <Abschnitt id="aenderung-2027" titel="Was sich 2027 ändern soll">
          <Prosa>
            <p>
              <strong>Am 29. Juli 2026 hat das Bundeskabinett den Entwurf einer EEG-Novelle beschlossen, nach der die feste Einspeisevergütung für neue
              kleine Dachanlagen ab dem 1. Januar 2027 entfallen soll.</strong> An ihre Stelle sollen befristete Übergangszahlungen und ein stärkerer
              Weg in die <TextLink href="/service/direktvermarktung">Direktvermarktung</TextLink> treten.
            </p>
            <p>
              Stand September 2026 ist das Gesetz noch nicht verabschiedet: Bundestag und Bundesrat beraten, außerdem ist eine beihilferechtliche
              Genehmigung der EU-Kommission nötig. Höhe und Dauer der Übergangszahlungen können sich im Verfahren noch ändern.
            </p>
          </Prosa>
          <Zwischentitel>Was schon heute feststeht</Zwischentitel>
          <Checkliste
            punkte={[
              "Bestandsanlagen behalten ihren Vergütungssatz für die volle Laufzeit.",
              "Nach dem Kabinettsentwurf behalten Anlagen, die bis zum 31. Dezember 2026 in Betrieb gehen, die feste Vergütung für 20 Jahre.",
              "Der wirtschaftliche Hebel liegt ohnehin im Eigenverbrauch – daran ändert die Novelle nichts.",
            ]}
          />
          <Merkkasten variant="recht" titel="Unsere Einschätzung">
            Wer ohnehin bauen möchte, sollte die Inbetriebnahme nicht unnötig aufschieben. Wir informieren Sie im Beratungsgespräch über den aktuellen
            Stand des Gesetzgebungsverfahrens und planen einen realistischen Termin.
          </Merkkasten>
        </Abschnitt>

        <Abschnitt id="faq" titel="Häufige Fragen zur Einspeisevergütung">
          <Faq items={FAQ} />
        </Abschnitt>

        <Abschnitt id="passend" titel="Passend dazu">
          <LinkKarten
            links={[
              { href: "/produkte/stromspeicher", titel: "Stromspeicher nachrüsten", text: "Mehr Eigenverbrauch statt schlecht vergüteter Einspeisung." },
              { href: "/forderungen/landesforderungen", titel: "Förderung nach Bundesland", text: "Welche Zuschüsse es zusätzlich zur EEG-Vergütung gibt." },
              { href: "/service/repowering", titel: "Repowering nach 20 Jahren", text: "Was mit der Anlage passiert, wenn die Vergütung ausläuft." },
              { href: "/ratgeber/solaranlage-kosten", titel: "Was kostet eine Solaranlage?", text: "Preise je kWp und was im Komplettpreis steckt." },
            ]}
          />
        </Abschnitt>
      </ArtikelLayout>
    </>
  );
}
