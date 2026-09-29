// service/energieberatung/page.js – Österreich: Energieberatung für Unternehmen und Gemeinden (Ziel: Beratungsauftrag)

import { BadgeEuro, BarChart3, ClipboardList, Factory, FileSpreadsheet, Gauge, Info, Leaf, LineChart, Mail, Route, Scale, Target, Upload, Waypoints } from "lucide-react";

import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import Steps from "@/components/ui/Steps";
import CtaBand from "@/components/ui/CtaBand";
import Reveal from "@/components/ui/Reveal";
import Querverweise from "@/components/Reusable/Querverweise";
import { JsonLd, serviceMetadata, serviceSchema } from "@/components/ServiceAT/meta";
import Tabelle from "@/components/ServiceAT/Tabelle";
import Hinweis from "@/components/ServiceAT/Hinweis";
import AnfrageSektion from "@/components/ServiceAT/AnfrageSektion";
import FaqSektion from "@/components/ServiceAT/FaqSektion";
import Stil from "@/components/ServiceAT/B/Stil";
import HeroBild from "@/components/ServiceAT/B/HeroBild";
import Kennzahlen from "@/components/ServiceAT/B/Kennzahlen";
import Dunkel from "@/components/ServiceAT/B/Dunkel";
import FotoBento from "@/components/ServiceAT/B/FotoBento";
import Fachdetails from "@/components/ServiceAT/B/Fachdetails";
import Abschluss from "@/components/ServiceAT/B/Abschluss";
import LastgangLeser from "@/components/ServiceAT/B/LastgangLeser";
import EeffgCheck from "@/components/ServiceAT/B/EeffgCheck";
import { FIRMA } from "@/lib/site";

const PFAD = "/service/energieberatung";
const TITEL = "Energieberatung & Energieaudit für Betriebe | Ökovolt";
const BESCHREIBUNG =
  "Energieberatung für Unternehmen und Gemeinden in Österreich: Lastganganalyse, Energieaudit nach EEffG, ISO 50001, Dekarbonisierungsfahrplan und Förderberatung.";

export const metadata = serviceMetadata({ pfad: PFAD, titel: TITEL, beschreibung: BESCHREIBUNG });

const EEFFG = [
  ["Wer ist verpflichtet?", "Große Unternehmen: mehr als 249 Beschäftigte oder mehr als 50 Mio. € Umsatz und mehr als 43 Mio. € Bilanzsumme"],
  ["Was ist zu tun?", "Mindestens alle vier Jahre ein Energieaudit – extern oder intern – oder ein zertifiziertes Energie- bzw. Umweltmanagementsystem, das ein gleichwertiges Audit umfasst (z. B. ISO 50001, EMAS)"],
  ["Wer darf auditieren?", "Nur qualifizierte Personen, die die Qualitätsanforderungen des EEffG erfüllen und in der Liste der Energieeffizienz-Monitoringstelle geführt werden"],
  ["Meldung", "Verpflichtung und standardisierter Kurzbericht über die elektronische Meldeplattform; Fristen jeweils zum 30. November laut Monitoringstelle"],
  ["Was kommt?", "Die EU-Energieeffizienzrichtlinie (EU) 2023/1791 knüpft die Pflichten an den Energieverbrauch: Audit ab durchschnittlich mehr als 10 TJ (rund 2,78 GWh) pro Jahr, Managementsystem ab mehr als 85 TJ (rund 23,6 GWh). Umsetzungsfrist war der 11. Oktober 2025 – den aktuellen Stand im EEffG prüfen wir im Einzelfall."],
];

const LASTGANG = [
  ["Grundlast", "Was läuft immer – auch nachts und am Wochenende?", "Standby-Verbraucher, Druckluftleckagen, Kühlung; Richtgröße für PV-Eigenverbrauch"],
  ["Lastspitzen", "Wann und wodurch entsteht die Jahreshöchstleistung?", "Leistungspreis senken durch Lastmanagement oder Speicher (Peak Shaving)"],
  ["Tages- und Wochenprofil", "Wie passt der Verbrauch zur Sonnenkurve?", "Eigenverbrauchsquote, Ausrichtung (Süd oder Ost-West), Speichergröße"],
  ["Saisonalität", "Wie unterscheiden sich Sommer und Winter?", "Wärmepumpen, Kälte, Prozesswärme – und was PV im Winter leisten kann"],
  ["Flexibilität", "Welche Verbraucher lassen sich verschieben?", "Laden der E-Flotte, Wärme- und Kältespeicher, Produktionsplanung, dynamische Tarife"],
];

const FAQ = [
  {
    q: "Was ist eine Lastganganalyse?",
    a: "Die Auswertung Ihres Stromverbrauchs in Viertelstundenwerten über mindestens ein Jahr. Sie zeigt Grundlast, Lastspitzen und Tagesprofile und ist die Grundlage, um PV-Anlage, Speicher und Lastmanagement richtig zu dimensionieren. Die Daten erhalten Sie vom Netzbetreiber – bei Smart Metern über dessen Webportal, bei Lastprofilzählern auf Anfrage.",
  },
  {
    q: "Ist unser Unternehmen zu einem Energieaudit verpflichtet?",
    a: "Nach dem Bundes-Energieeffizienzgesetz (EEffG) sind große Unternehmen verpflichtet: mehr als 249 Beschäftigte oder mehr als 50 Mio. € Umsatz und mehr als 43 Mio. € Bilanzsumme. Sie müssen mindestens alle vier Jahre ein Energieaudit durchführen oder ein zertifiziertes Managementsystem betreiben. Durch die EU-Richtlinie 2023/1791 wird die Pflicht künftig am Energieverbrauch festgemacht – wir prüfen den aktuellen Stand für Ihr Unternehmen.",
  },
  {
    q: "Führt Ökovolt das Energieaudit nach EEffG selbst durch?",
    a: "Das Audit muss eine qualifizierte, bei der Monitoringstelle gelistete Person durchführen. Wir liefern die technische Grundlage – Lastganganalyse, Erzeugungspotenzial, Maßnahmen zu PV, Speicher, Lastmanagement und Ladeinfrastruktur mit Wirtschaftlichkeitsrechnung – und stimmen uns mit Ihrer Auditorin oder Ihrem Auditor ab.",
  },
  {
    q: "Was bringt ein Energiemanagementsystem nach ISO 50001?",
    a: "ISO 50001 verankert Energieeffizienz als laufenden Prozess: energetische Bewertung, Kennzahlen, Ziele, Maßnahmen und Überprüfung. Ein zertifiziertes System kann die Auditpflicht nach EEffG ersetzen. Wir unterstützen mit Messkonzept, Unterzählern und Datenerfassung über unsere SCADA- und Monitoring-Systeme.",
  },
  {
    q: "Was ist ein Dekarbonisierungsfahrplan?",
    a: "Ein Plan, wie ein Unternehmen seine Treibhausgasemissionen Schritt für Schritt senkt – mit Maßnahmen, Kosten, Zeitplan und Kennzahlen. Für Strom und Wärme (Scope 1 und 2) folgt er meist der Reihenfolge: Verbrauch senken, selbst erzeugen, elektrifizieren, flexibilisieren, den Rest grün beschaffen. Der Fahrplan ist auch Grundlage für Nachhaltigkeitsbericht und Bankgespräche.",
  },
  {
    q: "Welche Förderungen gibt es für Unternehmen?",
    a: "Für PV und Speicher vor allem den EAG-Investitionszuschuss über die OeMAG-Fördercalls, für weitere Effizienz- und Klimaschutzmaßnahmen die Umweltförderung im Inland (KPC) und Programme der Bundesländer. Steuerlich ist Photovoltaik eine ökologische Investition für den Investitionsfreibetrag – für Anschaffungen von November 2025 bis Ende 2026 befristet mit 22 %. Welche Kombination zulässig ist, prüfen wir im Einzelfall.",
  },
  {
    q: "Welche Daten brauchen Sie für die Energieberatung?",
    a: "Lastgang in Viertelstundenwerten für mindestens zwölf Monate, Strom-, Gas- und Wärmerechnungen, Betriebszeiten, Liste großer Verbraucher, geplante Erweiterungen und – falls vorhanden – Dachpläne. Was fehlt, erheben wir gemeinsam, bei Bedarf mit temporären Messungen.",
  },
  {
    q: "Beraten Sie auch Gemeinden?",
    a: "Ja. Gemeinden haben oft viele Verbrauchsstellen – Amtshaus, Schulen, Bauhof, Kläranlage, Wasserversorgung, Straßenbeleuchtung. Wir werten die Lastgänge standortübergreifend aus und zeigen, wo PV, Speicher, Energiegemeinschaften oder Notstrom den größten Nutzen bringen.",
  },
];

const MAIL_BETREFF = "Lastgang zur Analyse";
const MAIL_TEXT = "Guten Tag,\n\nanbei unser Lastgang (Viertelstundenwerte, mindestens 12 Monate) zur Erstauswertung.\n\nBetrieb / Gemeinde:\nStandort:\nAnsprechperson & Telefon:\nVorhandene oder geplante PV-Leistung:\n\nDanke!";

export default function EnergieberatungPage() {
  return (
    <div>
      <Stil />
      <JsonLd daten={serviceSchema({ pfad: PFAD, name: "Energieberatung für Unternehmen und Gemeinden", beschreibung: BESCHREIBUNG, serviceType: "Energieberatung, Lastganganalyse und Dekarbonisierungsplanung" })} />

      <HeroBild
        breadcrumbs={[{ name: "Service" }, { name: "Energieberatung" }]}
        eyebrow="Energieberatung · Unternehmen & Gemeinden"
        title={
          <>
            Energieberatung, die mit dem <span className="ov-text-gradient-light">Lastgang</span> beginnt
          </>
        }
        lead="Wer weiß, wann und wofür Strom gebraucht wird, investiert richtig. Wir analysieren Ihren Lastgang, unterstützen beim Energieaudit nach EEffG und bei ISO 50001, entwickeln einen Dekarbonisierungsfahrplan und zeigen, welche Förderungen passen."
        image={{ src: "/Images/AT/service-b/energieberatung-daten.jpg", alt: "Tablet mit Verbrauchsdiagrammen bei der Auswertung von Energiedaten" }}
        points={["Lastganganalyse in Viertelstundenwerten", "Energieaudit nach EEffG", "ISO 50001 & Dekarbonisierung", "Förderberatung Bund & Länder"]}
        actions={[
          { label: "Beratung anfragen", href: "#anfrage" },
          { label: "Auditpflicht prüfen", href: "#eeffg", icon: ClipboardList },
        ]}
      />

      <Kennzahlen
        frage="Was bringt eine Energieberatung mit Lastganganalyse?"
        zahlen={[
          { value: 96, label: "Viertelstundenwerte pro Tag im Lastgang", hinweis: "Grundlage jeder Auslegung" },
          { value: 35040, label: "Messwerte pro Jahr", hinweis: "365 Tage × 96 Viertelstunden" },
          { text: "4 Jahre", label: "Intervall des Energieaudits nach EEffG", hinweis: "für große Unternehmen" },
          { text: "> 10 TJ", label: "Auditschwelle nach EU-Richtlinie 2023/1791", hinweis: "rund 2,78 GWh pro Jahr" },
        ]}
      >
        <p>
          <strong>Eine belastbare Entscheidungsgrundlage:</strong> Der Lastgang zeigt, was Jahresverbrauch und Rechnung verschweigen – Grundlast, Lastspitzen und wie gut Solarstrom zu
          Ihrem Verbrauch passt. Daraus leiten wir PV-Größe, Speicher, Lastmanagement und Förderung ab – für Geschäftsführung, Technik und Einkauf.
        </p>
      </Kennzahlen>

      {/* Lastgang lesen */}
      <Dunkel id="lastgang">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-end lg:gap-16">
          <SectionHeading
            dark
            eyebrow="Lastganganalyse"
            title={
              <>
                So lesen wir <span className="ov-text-gradient-light">Ihren Lastgang</span>
              </>
            }
          />
          <Reveal delay={100}>
            <p className="ov-lead text-white/70">
              Der Lastgang ist der Stromverbrauch in Viertelstundenwerten. Vier Blicke darauf entscheiden über PV-Größe, Speicher und Leistungspreis.
            </p>
          </Reveal>
        </div>
        <Reveal dir="scale" className="mt-12">
          <LastgangLeser />
        </Reveal>

        {/* Upload-Teaser */}
        <Reveal delay={120} className="mt-6">
          <div className="grid items-center gap-6 rounded-[2rem] border-2 border-dashed border-white/20 bg-white/[0.03] p-6 md:grid-cols-[auto_minmax(0,1fr)_auto] md:p-8">
            <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-ov-500/20 text-ov-300 ring-1 ring-ov-400/30">
              <Upload aria-hidden="true" className="sb-schweben h-7 w-7" />
            </span>
            <div className="min-w-0">
              <p className="font-display text-[20px] font-bold text-white">Lastgang senden – Erstauswertung erhalten</p>
              <ol className="mt-3 grid gap-x-6 gap-y-1.5 text-[14.5px] text-white/70 sm:grid-cols-3">
                <li className="flex gap-2">
                  <span className="font-display font-bold text-ov-300">1</span>Export im Netzbetreiber-Portal (CSV/Excel, 15 Minuten)
                </li>
                <li className="flex gap-2">
                  <span className="font-display font-bold text-ov-300">2</span>Datei per E-Mail an uns senden
                </li>
                <li className="flex gap-2">
                  <span className="font-display font-bold text-ov-300">3</span>Wir melden uns mit ersten Erkenntnissen
                </li>
              </ol>
            </div>
            <a
              href={`mailto:${FIRMA.email}?subject=${encodeURIComponent(MAIL_BETREFF)}&body=${encodeURIComponent(MAIL_TEXT)}`}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-ov-600 px-6 text-[15px] font-semibold text-white shadow-[0_8px_24px_-8px_rgba(102,153,51,0.65)] transition-colors hover:bg-ov-700"
            >
              <Mail aria-hidden="true" className="h-4 w-4" />
              Lastgang per E-Mail
            </a>
          </div>
        </Reveal>
        <p className="mt-4 flex gap-2 text-[13px] leading-relaxed text-white/50">
          <Info aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
          Betriebe mit Smart Meter sehen die Viertelstundenwerte im Webportal ihres Netzbetreibers, sofern die Viertelstundenauslesung aktiviert ist. Betriebe mit Lastprofilzähler – in der
          Regel ab 100.000 kWh Jahresverbrauch oder 50 kW Anschlussleistung – erhalten den Lastgang auf Anfrage beim Netzbetreiber.
        </p>
      </Dunkel>

      {/* Leistungen */}
      <Section tone="white" space="lg">
        <SectionHeading
          eyebrow="Leistungen"
          title="Fünf Bausteine der Energieberatung"
          lead="Jeder Baustein ist einzeln buchbar – und endet in einem Ergebnisbericht mit klaren Empfehlungen, Wirtschaftlichkeit und Prioritäten statt eines Datenfriedhofs."
          className="mb-12"
        />
        <FotoBento
          items={[
            {
              bild: { src: "/Images/AT/service-b/industriehalle.jpg", alt: "Helle, moderne Produktionshalle mit automatisierter Fertigungslinie" },
              icon: LineChart,
              tag: "Basis",
              titel: "Lastganganalyse",
              text: "Viertelstundenwerte auswerten: Grundlast, Spitzen, Profile und Gleichzeitigkeit mit der PV-Erzeugung – nachvollziehbar gerechnet.",
            },
            { bild: { src: "/Images/Jobs/jobs4.jpg", alt: "Ingenieur mit Tablet vor einer Photovoltaikanlage" }, icon: ClipboardList, titel: "Energieaudit nach EEffG", text: "Technische Grundlagen und Maßnahmen – in Abstimmung mit Ihrer Auditorin." },
            { bild: { src: "/Images/AT/service-b/schaltschrank-messung.jpg", alt: "Elektriker misst mit Prüfspitzen in einem Schaltschrank" }, icon: Gauge, titel: "ISO 50001", text: "Messkonzept, Unterzähler, Kennzahlen und Datenerfassung." },
            { bild: { src: "/Images/AT/ratgeber/pv-gewerbe-dornbirn.jpg", alt: "Gewerbebetrieb mit Photovoltaik in Österreich" }, icon: Route, titel: "Dekarbonisierungsfahrplan", text: "Scope 1 und 2 mit Kosten, Einsparung und Zeitplan." },
            { bild: { src: "/Images/AT/ratgeber/eag-investitionszuschuss.jpg", alt: "Photovoltaikanlage als förderfähige Investition" }, icon: BadgeEuro, titel: "Förderberatung", text: "EAG, Umweltförderung, Länder und Investitionsfreibetrag." },
          ]}
        />
      </Section>

      {/* EEffG-Check */}
      <Section tone="sand" space="lg" id="eeffg" className="scroll-mt-24">
        <div className="mb-12 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-end lg:gap-16">
          <SectionHeading eyebrow="Energieeffizienzgesetz" title="Energieaudit-Pflicht nach EEffG – in 20 Sekunden geprüft" />
          <Reveal delay={100}>
            <p className="ov-lead text-ink-600">
              Das Bundes-Energieeffizienzgesetz verpflichtet große Unternehmen zu regelmäßigen Energieaudits oder einem Managementsystem. Auditieren dürfen nur gelistete Personen – wir
              liefern die technischen Grundlagen und arbeiten Ihrer Auditorin bzw. Ihrem Auditor zu.
            </p>
          </Reveal>
        </div>
        <Reveal dir="scale">
          <EeffgCheck />
        </Reveal>
      </Section>

      {/* Ergebnis & Ablauf */}
      <Dunkel space="md" glow="rechts">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-end lg:gap-16">
          <SectionHeading dark eyebrow="Dekarbonisierung & Ablauf" title="Der Fahrplan: erst sparen, dann erzeugen, dann elektrifizieren" />
          <Reveal delay={100}>
            <p className="ov-lead text-white/70">
              Ein Dekarbonisierungsfahrplan ordnet Maßnahmen nach Wirkung und Wirtschaftlichkeit. Für Strom und Wärme hat sich eine Reihenfolge bewährt, die Fehlinvestitionen vermeidet.
            </p>
          </Reveal>
        </div>
        <ol className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {[
            { t: "Effizienz", x: "Grundlast, Druckluft, Beleuchtung, Regelung – was nicht verbraucht wird, muss nicht erzeugt werden" },
            { t: "Eigenerzeugung", x: "PV auf Dach, Parkplatz oder Freifläche, dimensioniert nach Lastgang" },
            { t: "Elektrifizierung", x: "Wärmepumpe, Prozesswärme, E-Flotte mit Lastmanagement" },
            { t: "Flexibilität", x: "Speicher, Peak Shaving, Energiegemeinschaften, dynamische Tarife" },
            { t: "Beschaffung", x: "Reststrom über PPA oder Herkunftsnachweise – mit Kennzahlen für Scope 2" },
          ].map((k, i) => (
            <Reveal as="li" key={k.t} delay={i * 80} className={`ov-glass relative rounded-3xl p-5 ${i === 4 ? "sm:col-span-2 lg:col-span-1" : ""}`}>
              <span className="font-display text-[34px] font-extrabold leading-none text-white/15">{String(i + 1).padStart(2, "0")}</span>
              <p className="mt-2 font-display text-[17px] font-bold text-white">{k.t}</p>
              <p className="mt-1.5 text-[14px] leading-relaxed text-white/65">{k.x}</p>
            </Reveal>
          ))}
        </ol>
        <div className="mt-16 border-t border-white/10 pt-14">
          <Steps
            tone="dark"
            items={[
              { icon: FileSpreadsheet, title: "Daten", text: "Lastgang, Rechnungen, Betriebszeiten, Verbraucherliste und Pläne." },
              { icon: Factory, title: "Begehung", text: "Vor Ort: Verbraucher, Zählerstruktur, Dachflächen, Netzanschluss." },
              { icon: LineChart, title: "Analyse", text: "Auswertung, Varianten und Wirtschaftlichkeit – nachvollziehbar gerechnet." },
              { icon: Leaf, title: "Bericht & Umsetzung", text: "Präsentation für die Geschäftsführung, auf Wunsch Umsetzung aus einer Hand." },
            ]}
          />
        </div>
      </Dunkel>

      {/* Fachdetails */}
      <Section tone="white" space="lg">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
          <SectionHeading eyebrow="Für Technik & Einkauf" title="Auswertungen und Rechtsgrundlagen im Detail" lead="Die Tabellen für Energieverantwortliche, Controlling und Auditorin – kompakt und mit Quellen." />
          <Fachdetails
            items={[
              {
                titel: "Was im Ergebnisbericht steht",
                kurz: "Ist-Analyse, Maßnahmen, Förderung, Fahrplan",
                icon: BarChart3,
                inhalt: (
                  <ul className="grid gap-3 sm:grid-cols-2">
                    {[
                      { icon: BarChart3, t: "Ist-Analyse", x: "Verbrauch, Lastgang, Kosten und Emissionen je Standort und Energieträger." },
                      { icon: Target, t: "Maßnahmen", x: "Priorisiert nach Einsparung, Investition, Amortisation und CO₂-Wirkung." },
                      { icon: BadgeEuro, t: "Förderung & Steuer", x: "Passende Programme, Fristen und Kombinierbarkeit – als Orientierung." },
                      { icon: Waypoints, t: "Fahrplan", x: "Reihenfolge, Zeitplan, Verantwortliche und Kennzahlen zur Erfolgskontrolle." },
                    ].map((k) => (
                      <li key={k.t} className="rounded-2xl bg-sand-50 p-4 ring-1 ring-ink-200/60">
                        <p className="flex items-center gap-2 font-display text-[15.5px] font-bold text-ink-900">
                          <k.icon aria-hidden="true" className="h-4 w-4 text-ov-600" />
                          {k.t}
                        </p>
                        <p className="mt-1 text-[14.5px] leading-relaxed text-ink-600">{k.x}</p>
                      </li>
                    ))}
                  </ul>
                ),
              },
              { titel: "Was der Lastgang über Ihren Betrieb verrät", kurz: "Fünf Auswertungen und ihre Hebel", icon: LineChart, inhalt: <Tabelle kopf={["Auswertung", "Frage", "Hebel"]} zeilen={LASTGANG} kompakt /> },
              {
                titel: "Energieaudit-Pflicht nach EEffG",
                kurz: "Wer, was, wer darf auditieren, Meldung, Ausblick",
                icon: Scale,
                inhalt: <Tabelle kopf={["Frage", "Antwort"]} zeilen={EEFFG} kompakt quelle="Quellen: Energieeffizienz-Monitoringstelle (FAQ), BMWET, Richtlinie (EU) 2023/1791. Stand September 2026, keine Rechtsberatung." />,
              },
              {
                titel: "Unsere Rolle beim Energieaudit",
                kurz: "Technische Grundlagen statt Audit-Durchführung",
                icon: ClipboardList,
                inhalt: (
                  <Hinweis ton="recht" titel="Audit durch gelistete Personen">
                    <p>
                      Energieaudits nach EEffG dürfen nur qualifizierte, gelistete Personen durchführen. Ökovolt liefert die technischen Grundlagen zu Erzeugung, Speicher, Lastmanagement
                      und Ladeinfrastruktur mit Wirtschaftlichkeitsrechnung und arbeitet Ihrer Auditorin bzw. Ihrem Auditor zu.
                    </p>
                  </Hinweis>
                ),
              },
            ]}
          />
        </div>
      </Section>

      <AnfrageSektion
        titel="Energieberatung anfragen"
        lead="Schildern Sie kurz Ihre Ausgangslage. Am schnellsten geht es, wenn Sie uns danach Ihren Lastgang als CSV- oder Excel-Datei per E-Mail senden."
        schritte={["Sie beschreiben Betrieb und Anliegen.", "Wir klären Datenlage und Umfang in einem kurzen Gespräch.", "Sie erhalten ein Angebot für Analyse, Audit-Unterstützung oder Fahrplan."]}
        formular={{
          betreff: "Energieberatung",
          thema: "Sonstiges",
          titel: "Anfrage Energieberatung",
          absenden: "Beratung anfragen",
          felder: [
            { name: "anliegen", label: "Anliegen", typ: "auswahl", pflicht: true, optionen: ["Lastganganalyse und PV-Auslegung", "Unterstützung Energieaudit nach EEffG", "ISO 50001 / Messkonzept", "Dekarbonisierungsfahrplan", "Förderberatung", "Gemeinde: mehrere Standorte"] },
            { name: "verbrauch", label: "Stromverbrauch pro Jahr", typ: "zahl", einheit: "MWh", placeholder: "z. B. 850" },
            { name: "branche", label: "Branche", placeholder: "z. B. Metallverarbeitung, Hotel, Gemeinde" },
            { name: "groesse", label: "Unternehmensgröße", typ: "auswahl", optionen: ["bis 49 Beschäftigte", "50–249 Beschäftigte", "250 Beschäftigte oder mehr", "Gemeinde / öffentliche Hand"] },
            { name: "lastgang", label: "Lastgang (15-Minuten-Werte) vorhanden", typ: "auswahl", optionen: ["Ja", "Nein", "Weiß nicht"] },
          ],
        }}
      />

      <FaqSektion items={FAQ} titel="Energieberatung – häufige Fragen" tone="white" />

      <Querverweise pfad={PFAD} ueberschrift="Mehr zu Planung, Förderung und Effizienz" />

      <Abschluss
        links={[
          { href: "/gewerbe", art: "Lösung", titel: "Photovoltaik für Gewerbe & Industrie" },
          { href: "/gewerbespeicher", art: "Lösung", titel: "Gewerbespeicher & Peak Shaving" },
          { href: "/kommunen", art: "Lösung", titel: "Gemeinden & Länder" },
          { href: "/technik/scada", art: "Technik", titel: "SCADA & Leitwarte" },
          { href: "/ratgeber/peak-shaving-leistungspreis", art: "Ratgeber", titel: "Peak Shaving & Leistungspreis" },
          { href: "/ratgeber/csrd-esg-photovoltaik", art: "Ratgeber", titel: "CSRD, ESG & Photovoltaik" },
          { href: "/ratgeber/energiemanagementsystem", art: "Ratgeber", titel: "Energiemanagementsystem" },
          { href: "/forderungen/bundesfoerderung", art: "Förderung", titel: "Bundesförderung (EAG & KPC)" },
        ]}
        quellen={[
          { titel: "Energieeffizienz-Monitoringstelle – FAQ zur Auditpflicht", href: "https://www.energieeffizienzmonitoring.at/faqs/" },
          { titel: "BMWET – Bundes-Energieeffizienzgesetz (EEffG)", href: "https://www.bmwet.gv.at/Ministerium/Rechtsvorschriften/Energierecht/effizienzgesetz.html" },
          { titel: "Richtlinie (EU) 2023/1791 zur Energieeffizienz (EED III)", href: "https://eur-lex.europa.eu/eli/dir/2023/1791/oj" },
          { titel: "WKO – Investitionsfreibetrag (inkl. befristeter Erhöhung 11/2025–12/2026)", href: "https://www.wko.at/steuern/investitionsfreibetrag" },
          { titel: "EAG-Abwicklungsstelle – Investitionszuschuss Photovoltaik & Speicher", href: "https://www.eag-abwicklungsstelle.at/wissen/investitionszuschuss-photovoltaik-und-speicher/" },
          { titel: "ISO 50001 – Energiemanagementsysteme", hinweis: "Anforderungen mit Anleitung zur Anwendung" },
        ]}
      />

      <CtaBand
        eyebrow="Energieberatung"
        title="Senden Sie uns Ihren Lastgang – wir zeigen, wo Ihr Geld steckt."
        text="Lastganganalyse, Audit-Unterstützung, ISO 50001 und Dekarbonisierungsfahrplan für Unternehmen und Gemeinden in ganz Österreich – mit Ergebnissen, die sich umsetzen lassen."
        primary={{ label: "Beratung anfragen", href: "#anfrage" }}
        secondary={{ label: "Förder-Check starten", href: "/foerdercheck", icon: BadgeEuro }}
      />
    </div>
  );
}
