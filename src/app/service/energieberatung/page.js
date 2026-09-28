// service/energieberatung/page.js – Österreich: Energieberatung für Unternehmen und Gemeinden (Ziel: Beratungsauftrag)

import { BadgeEuro, BarChart3, ClipboardList, Factory, FileSpreadsheet, FileText, Gauge, Leaf, LineChart, Route, Target, Waypoints } from "lucide-react";

import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import SplitMedia from "@/components/ui/SplitMedia";
import FeatureGrid from "@/components/ui/FeatureGrid";
import Steps from "@/components/ui/Steps";
import CtaBand from "@/components/ui/CtaBand";
import Reveal from "@/components/ui/Reveal";
import Querverweise from "@/components/Reusable/Querverweise";
import { JsonLd, serviceMetadata, serviceSchema } from "@/components/ServiceAT/meta";
import Tabelle from "@/components/ServiceAT/Tabelle";
import Hinweis from "@/components/ServiceAT/Hinweis";
import Weiterlesen from "@/components/ServiceAT/Weiterlesen";
import AnfrageSektion from "@/components/ServiceAT/AnfrageSektion";
import FaqSektion from "@/components/ServiceAT/FaqSektion";
import Quellen from "@/components/ServiceAT/Quellen";

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

export default function EnergieberatungPage() {
  return (
    <div>
      <JsonLd daten={serviceSchema({ pfad: PFAD, name: "Energieberatung für Unternehmen und Gemeinden", beschreibung: BESCHREIBUNG, serviceType: "Energieberatung, Lastganganalyse und Dekarbonisierungsplanung" })} />

      <PageHero
        breadcrumbs={[{ name: "Service" }, { name: "Energieberatung" }]}
        eyebrow="Energieberatung · Unternehmen & Gemeinden"
        title={<>Energieberatung, die mit dem <span className="ov-text-gradient">Lastgang</span> beginnt</>}
        lead="Wer weiß, wann und wofür Strom gebraucht wird, investiert richtig. Wir analysieren Ihren Lastgang, unterstützen beim Energieaudit nach EEffG und bei ISO 50001, entwickeln einen Dekarbonisierungsfahrplan und zeigen, welche Förderungen passen."
        image={{ src: "/Images/Jobs/jobs4.jpg", alt: "Ingenieur mit Tablet vor einer Photovoltaikanlage" }}
        points={["Lastganganalyse in Viertelstundenwerten", "Energieaudit nach EEffG", "ISO 50001 & Dekarbonisierung", "Förderberatung Bund & Länder"]}
        actions={[
          { label: "Beratung anfragen", href: "#anfrage" },
          { label: "Auditpflicht prüfen", href: "#eeffg", icon: ClipboardList },
        ]}
      />

      <Section tone="white" space="lg">
        <SectionHeading
          eyebrow="Leistungen"
          title="Sechs Bausteine der Energieberatung"
          lead="Jeder Baustein ist einzeln buchbar. Zusammen ergeben sie eine belastbare Entscheidungsgrundlage für Geschäftsführung, Technik und Einkauf."
          className="mb-12"
        />
        <FeatureGrid
          cols={3}
          items={[
            { icon: LineChart, title: "Lastganganalyse", text: "Viertelstundenwerte auswerten: Grundlast, Spitzen, Profile und Gleichzeitigkeit mit der PV-Erzeugung." },
            { icon: ClipboardList, title: "Energieaudit nach EEffG", text: "Technische Grundlagen und Maßnahmen für das verpflichtende Audit großer Unternehmen – in Abstimmung mit Ihrer Auditorin." },
            { icon: Gauge, title: "ISO 50001", text: "Messkonzept, Unterzähler, Kennzahlen und Datenerfassung für ein Energiemanagementsystem." },
            { icon: Route, title: "Dekarbonisierungsfahrplan", text: "Maßnahmen für Scope 1 und 2 mit Kosten, Einsparung und Zeitplan – auch für Bank und Nachhaltigkeitsbericht." },
            { icon: BadgeEuro, title: "Förderberatung", text: "EAG-Investitionszuschuss, Umweltförderung, Landesprogramme und Investitionsfreibetrag richtig kombinieren." },
            { icon: FileText, title: "Ergebnisbericht", text: "Klare Empfehlungen mit Wirtschaftlichkeit, Prioritäten und nächsten Schritten – kein Datenfriedhof." },
          ]}
        />
      </Section>

      <Section tone="sand" space="lg">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <div>
            <SectionHeading
              eyebrow="Lastganganalyse"
              title="Was der Lastgang über Ihren Betrieb verrät"
              lead="Der Lastgang ist der Stromverbrauch in Viertelstundenwerten. Er zeigt, was Jahresverbrauch und Rechnung verschweigen: wann Leistung gebraucht wird und wie gut Solarstrom dazu passt."
            />
            <Hinweis ton="info" titel="So kommen Sie zu Ihren Daten" className="mt-8">
              <p>
                Betriebe mit Smart Meter sehen die Viertelstundenwerte im Webportal ihres Netzbetreibers, sofern die Viertelstundenauslesung aktiviert ist. Betriebe mit Lastprofilzähler –
                in der Regel ab 100.000 kWh Jahresverbrauch oder 50 kW Anschlussleistung – erhalten den Lastgang auf Anfrage beim Netzbetreiber.
              </p>
            </Hinweis>
          </div>
          <Tabelle kopf={["Auswertung", "Frage", "Hebel"]} zeilen={LASTGANG} kompakt />
        </div>
      </Section>

      <Section tone="white" space="lg" id="eeffg" className="scroll-mt-24">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <div>
            <SectionHeading
              eyebrow="Energieeffizienzgesetz"
              title="Energieaudit-Pflicht nach EEffG"
              lead="Das Bundes-Energieeffizienzgesetz (EEffG) verpflichtet große Unternehmen zu regelmäßigen Energieaudits oder einem Managementsystem. Richtig genutzt ist das Audit mehr als Pflicht: eine geordnete Liste wirtschaftlicher Maßnahmen."
            />
            <Hinweis ton="recht" titel="Unsere Rolle beim Audit" className="mt-8">
              <p>
                Energieaudits nach EEffG dürfen nur qualifizierte, gelistete Personen durchführen. Ökovolt liefert die technischen Grundlagen zu Erzeugung, Speicher, Lastmanagement und
                Ladeinfrastruktur mit Wirtschaftlichkeitsrechnung und arbeitet Ihrer Auditorin bzw. Ihrem Auditor zu.
              </p>
            </Hinweis>
          </div>
          <Tabelle kopf={["Frage", "Antwort"]} zeilen={EEFFG} kompakt quelle="Quellen: Energieeffizienz-Monitoringstelle (FAQ), BMWET, Richtlinie (EU) 2023/1791. Stand September 2026, keine Rechtsberatung." />
        </div>
      </Section>

      <Section tone="green" space="lg">
        <SplitMedia
          eyebrow="Dekarbonisierung"
          title="Der Fahrplan: erst sparen, dann erzeugen, dann elektrifizieren"
          image={{ src: "/Images/Dienstleistungen/Photovoltaik/314505-BAD.jpg", alt: "Luftaufnahme eines Gewerbegebiets mit Photovoltaik auf mehreren Hallendächern" }}
          text="Ein Dekarbonisierungsfahrplan ordnet Maßnahmen nach Wirkung und Wirtschaftlichkeit. Für Strom und Wärme hat sich eine Reihenfolge bewährt, die Fehlinvestitionen vermeidet."
          points={[
            { title: "Effizienz", text: "Grundlast, Druckluft, Beleuchtung, Regelung – was nicht verbraucht wird, muss nicht erzeugt werden" },
            { title: "Eigenerzeugung", text: "PV auf Dach, Parkplatz oder Freifläche, dimensioniert nach Lastgang" },
            { title: "Elektrifizierung", text: "Wärmepumpe, Prozesswärme, E-Flotte mit Lastmanagement" },
            { title: "Flexibilität", text: "Speicher, Peak Shaving, Energiegemeinschaften, dynamische Tarife" },
            { title: "Beschaffung", text: "Reststrom über PPA oder Herkunftsnachweise – mit Kennzahlen für Scope 2" },
          ]}
        />
      </Section>

      <Section tone="white" space="lg">
        <SectionHeading eyebrow="Ergebnis" title="Was im Ergebnisbericht steht" className="mb-10" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: BarChart3, t: "Ist-Analyse", x: "Verbrauch, Lastgang, Kosten und Emissionen je Standort und Energieträger." },
            { icon: Target, t: "Maßnahmen", x: "Priorisiert nach Einsparung, Investition, Amortisation und CO₂-Wirkung." },
            { icon: BadgeEuro, t: "Förderung & Steuer", x: "Passende Programme, Fristen und Kombinierbarkeit – als Orientierung." },
            { icon: Waypoints, t: "Fahrplan", x: "Reihenfolge, Zeitplan, Verantwortliche und Kennzahlen zur Erfolgskontrolle." },
          ].map((k, i) => (
            <Reveal key={k.t} delay={i * 70} className="rounded-3xl bg-sand-50 p-6 ring-1 ring-ink-200/60">
              <k.icon aria-hidden="true" className="h-6 w-6 text-ov-600" />
              <h3 className="mt-4 font-display text-[17px] font-bold text-ink-900">{k.t}</h3>
              <p className="mt-2 text-[14.5px] leading-relaxed text-ink-600">{k.x}</p>
            </Reveal>
          ))}
        </div>
        <div className="mt-16">
          <Steps
            items={[
              { icon: FileSpreadsheet, title: "Daten", text: "Lastgang, Rechnungen, Betriebszeiten, Verbraucherliste und Pläne." },
              { icon: Factory, title: "Begehung", text: "Vor Ort: Verbraucher, Zählerstruktur, Dachflächen, Netzanschluss." },
              { icon: LineChart, title: "Analyse", text: "Auswertung, Varianten und Wirtschaftlichkeit – nachvollziehbar gerechnet." },
              { icon: Leaf, title: "Bericht & Umsetzung", text: "Präsentation für die Geschäftsführung, auf Wunsch Umsetzung aus einer Hand." },
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

      <Section tone="white" space="md">
        <Weiterlesen
          items={[
            { href: "/gewerbe", art: "Lösung", titel: "Photovoltaik für Gewerbe & Industrie", text: "Anlagenplanung nach Lastgang." },
            { href: "/gewerbespeicher", art: "Lösung", titel: "Gewerbespeicher & Peak Shaving", text: "Lastspitzen kappen, Leistungspreis senken." },
            { href: "/kommunen", art: "Lösung", titel: "Gemeinden & Länder", text: "Schulen, Bauhöfe, Kläranlagen." },
            { href: "/technik/scada", art: "Technik", titel: "SCADA & Leitwarte", text: "Energiedaten für ISO 50001 und Reporting." },
            { href: "/ratgeber/peak-shaving-leistungspreis", art: "Ratgeber", titel: "Peak Shaving & Leistungspreis", text: "Wie Lastspitzen die Netzkosten treiben." },
            { href: "/ratgeber/csrd-esg-photovoltaik", art: "Ratgeber", titel: "CSRD, ESG & Photovoltaik", text: "Scope 2, VSME und Anforderungen aus der Lieferkette." },
            { href: "/ratgeber/energiemanagementsystem", art: "Ratgeber", titel: "Energiemanagementsystem", text: "Erzeugung, Speicher und Verbrauch steuern." },
            { href: "/forderungen/bundesfoerderung", art: "Förderung", titel: "Bundesförderung (EAG & KPC)", text: "OeMAG-Investitionszuschuss und Umweltförderung." },
          ]}
        />
      </Section>

      <FaqSektion items={FAQ} titel="Energieberatung – häufige Fragen" tone="sand" />

      <Querverweise pfad={PFAD} ueberschrift="Mehr zu Planung, Förderung und Effizienz" />

      <Quellen
        items={[
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
