// service/drohneninspektion/page.js – Österreich: Drohnen-Thermografie von PV-Anlagen (Ziel: Inspektionsauftrag)

import { Camera, CloudSun, FileText, Flame, Map, MapPinned, Plane, ScanSearch, ShieldCheck, Sun, Thermometer, Zap } from "lucide-react";

import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import SplitMedia from "@/components/ui/SplitMedia";
import FeatureGrid from "@/components/ui/FeatureGrid";
import Steps from "@/components/ui/Steps";
import CtaBand from "@/components/ui/CtaBand";
import Querverweise from "@/components/Reusable/Querverweise";
import { JsonLd, serviceMetadata, serviceSchema } from "@/components/ServiceAT/meta";
import Tabelle from "@/components/ServiceAT/Tabelle";
import Hinweis from "@/components/ServiceAT/Hinweis";
import Weiterlesen from "@/components/ServiceAT/Weiterlesen";
import AnfrageSektion from "@/components/ServiceAT/AnfrageSektion";
import FaqSektion from "@/components/ServiceAT/FaqSektion";
import Quellen from "@/components/ServiceAT/Quellen";

const PFAD = "/service/drohneninspektion";
const TITEL = "Drohnen-Thermografie für PV-Anlagen | Ökovolt";
const BESCHREIBUNG =
  "Drohnen-Thermografie nach IEC TS 62446-3: Hotspots, Bypassdioden, PID und Stringausfälle finden – mit georeferenziertem Bericht für Dach- und Freiflächen.";

export const metadata = serviceMetadata({ pfad: PFAD, titel: TITEL, beschreibung: BESCHREIBUNG });

const FEHLERBILDER = [
  ["Einzelne heiße Zelle (Hotspot)", "Zellbruch, Fertigungsfehler, punktuelle Verschmutzung (Vogelkot, Laub)", "Verschmutzung ausschließen; bei Zelldefekt EL-Aufnahme und Garantieprüfung, ggf. Modultausch"],
  ["Ein Drittel des Moduls gleichmäßig wärmer (Substring)", "Aktive oder kurzgeschlossene Bypassdiode, Verschattung, unterbrochener Zellstring", "Verschattung prüfen, Anschlussdose/Diode messen, Modul tauschen"],
  ["Ganzes Modul gleichmäßig wärmer", "Modul nicht im Stromkreis (Leerlauf): Steckverbinder offen, Kabelbruch", "Verkabelung und Steckverbinder prüfen und instand setzen"],
  ["Ganzer String wärmer als Nachbarstrings", "String ausgefallen: Sicherung, Steckverbinder, Kabel oder Wechselrichtereingang", "Strangmessung, Fehlerstelle suchen, Instandsetzung"],
  ["Patchwork- bzw. Schachbrettmuster, verstärkt nahe dem Minuspol des Strings", "Potenzialinduzierte Degradation (PID)", "I-U-Kennlinie und EL zur Bestätigung; PID-Gegenmaßnahme am Wechselrichter, Garantie prüfen"],
  ["Heiße Anschlussdose oder Steckverbindung", "Erhöhter Übergangswiderstand: Mischsteckung verschiedener Fabrikate, Korrosion, schlechte Crimpung", "Sofort beheben (Brandgefahr): fachgerechte, typgleiche Steckverbinder"],
  ["Wärmere unterste Zellreihe", "Schmutzrand an der Rahmenkante bei flacher Neigung", "Reinigung, Intervall nach Befund"],
  ["Streifen- oder Punktmuster ohne klare Ursache", "Mikrorisse, Delamination, Feuchteeintritt, Snail Trails", "Nahaufnahme und EL-Aufnahme, Dokumentation für Garantie oder Versicherung"],
];

const NORM = [
  ["Einstrahlung", "mindestens 600 W/m² in Modulebene, möglichst stabil", "Nur dann entstehen Temperaturunterschiede, die Fehler zuverlässig zeigen"],
  ["Wetter", "wenig Bewölkung, geringer Wind, trockene Module", "Wind und Wolken verwischen Temperaturmuster"],
  ["Auflösung", "ausreichend Bildpunkte je Zelle; bei Drohnen typisch rund 3 cm pro Pixel am Boden", "Bestimmt Flughöhe und Flugzeit"],
  ["Inspektionsart", "vereinfachte Inspektion (Übersicht) oder detaillierte Inspektion (Klassifizierung, Ursachen)", "Detailliert für Abnahme, Garantie und Gutachten"],
  ["Qualifikation", "zertifizierte Thermografie-Fachkraft, Auswertung mit PV-Fachwissen", "Fehlinterpretation von Reflexionen vermeiden"],
  ["Dokumentation", "Wetter- und Einstrahlungsdaten, Kameradaten, klassifizierte Anomalien mit Position", "Nachvollziehbar für Dritte (Hersteller, Versicherer)"],
];

const DROHNENRECHT = [
  ["Rechtsrahmen", "Durchführungsverordnung (EU) 2019/947 und delegierte Verordnung (EU) 2019/945; zuständig in Österreich ist Austro Control, Portal dronespace.at"],
  ["Registrierung", "Betreiber von Drohnen ab 250 g oder mit Kamera müssen sich bei Austro Control registrieren; die Registriernummer gehört an die Drohne"],
  ["Offene Kategorie", "A1 über Menschen (nur leichte Klassen), A2 nahe Menschen mit mindestens 30 m Abstand, A3 fern von Menschen und 150 m von Wohn-, Gewerbe- und Industriegebieten; maximal 120 m über Grund"],
  ["Kompetenznachweis", "Online-Schulung und -Prüfung für A1/A3 über dronespace.at; für A2 zusätzlich das Fernpiloten-Zeugnis"],
  ["Spezielle Kategorie", "Standard-Szenario (STS) oder Betriebsgenehmigung, wenn die offene Kategorie nicht reicht – etwa über Betriebsgelände mit Personen oder außerhalb der Sichtweite"],
  ["Versicherung", "Haftpflichtversicherung für den Drohnenbetrieb ist in Österreich vorgeschrieben"],
  ["Geografische Zonen", "Kontrollzonen um Flughäfen und Sperrgebiete erfordern eine Freigabe – vor jedem Flug geprüft"],
  ["Datenschutz", "Keine gezielten Aufnahmen von Personen oder Nachbargrundstücken; Beschäftigte werden vorab informiert (DSGVO)"],
];

const FAQ = [
  {
    q: "Was findet eine Drohnen-Thermografie an einer PV-Anlage?",
    a: "Alles, was im Betrieb Wärme erzeugt, wo keine sein sollte: Hotspots durch defekte Zellen oder Verschmutzung, aktive Bypassdioden, ausgefallene Module und Strings, PID-Muster sowie überhitzte Anschlussdosen und Steckverbinder. Mikrorisse ohne Wärmewirkung zeigt dagegen erst die Elektrolumineszenz.",
  },
  {
    q: "Nach welcher Norm wird geprüft?",
    a: "Nach IEC TS 62446-3, der technischen Spezifikation für die Infrarot-Thermografie von PV-Modulen und -Anlagen im Freien. Sie legt unter anderem eine Mindesteinstrahlung von 600 W/m², Anforderungen an Auflösung, Wetter, Qualifikation und die Klassifizierung der Auffälligkeiten fest. Die Thermografie ist zugleich Teil der erweiterten Prüfung (Kategorie 2) nach OVE EN 62446-1.",
  },
  {
    q: "Ab welcher Anlagengröße lohnt sich die Drohne?",
    a: "Die Drohne spielt ihre Stärke bei großen Hallendächern und Freiflächen aus, wo eine Handkamera Tage bräuchte oder das Dach schlecht begehbar ist. Bei kleinen Dachanlagen kann eine Thermografie vom Boden oder vom Dach aus genügen – wir empfehlen, was wirtschaftlich sinnvoll ist.",
  },
  {
    q: "Wann ist der beste Zeitpunkt für die Inspektion?",
    a: "An klaren Tagen mit hoher, stabiler Einstrahlung – in Österreich typischerweise zwischen Frühjahr und Frühherbst rund um die Mittagszeit. Sinnvolle Anlässe sind die Abnahme nach der Errichtung, das Ende der Gewährleistung oder Garantie, eine unerklärliche Ertragsminderung und die Zeit nach Hagel oder Sturm.",
  },
  {
    q: "Braucht der Drohnenflug über unserem Betriebsgelände eine Genehmigung?",
    a: "Das hängt von Drohne, Abstand zu Personen und Lage ab. Nahe Flughäfen oder in Sperrgebieten ist eine Freigabe nötig; über Gelände mit Beschäftigten kann die spezielle Kategorie mit Standard-Szenario oder Betriebsgenehmigung erforderlich sein. Wir klären das vor dem Flug und stimmen Zeitfenster und Absperrung mit Ihnen ab.",
  },
  {
    q: "Was bekommen wir als Ergebnis?",
    a: "Einen georeferenzierten Bericht: Übersichtskarte aus Luft- und Wärmebildern, jede Auffälligkeit mit Koordinate, Reihe und Modulposition, Temperaturdifferenz, Klassifizierung nach Dringlichkeit und Maßnahmenempfehlung. Die Liste lässt sich für Garantieanträge an Hersteller und für Schadensmeldungen an Versicherer verwenden.",
  },
  {
    q: "Was ist Elektrolumineszenz und wann ist sie sinnvoll?",
    a: "Bei der Elektrolumineszenz (EL) wird Strom in das Modul eingespeist; eine Spezialkamera macht das dabei abgestrahlte Licht sichtbar. Dunkle Bereiche zeigen Zellbrüche, Mikrorisse und PID sehr genau. EL ist aufwendiger als Thermografie und wird deshalb gezielt eingesetzt – an auffälligen Modulen, nach Hagel oder als Nachweis gegenüber Hersteller und Versicherung.",
  },
  {
    q: "Ersetzt die Thermografie die elektrische Prüfung?",
    a: "Nein. Sie ergänzt die Prüfung nach OVE E 8101 und OVE EN 62446-1, ersetzt aber weder Isolationsmessung noch Prüfbefund. In den Wartungspaketen kombinieren wir beides.",
  },
];

export default function DrohneninspektionPage() {
  return (
    <div>
      <JsonLd daten={serviceSchema({ pfad: PFAD, name: "Drohnen-Thermografie von Photovoltaikanlagen", beschreibung: BESCHREIBUNG, serviceType: "Thermografische Inspektion von PV-Anlagen per Drohne" })} />

      <PageHero
        variant="immersive"
        breadcrumbs={[{ name: "Service" }, { name: "Drohnen-Thermografie" }]}
        eyebrow="Drohneninspektion · IEC TS 62446-3"
        title={<>Drohnen-Thermografie: <span className="ov-text-gradient-light">Fehler finden, bevor sie Ertrag kosten</span></>}
        lead="Eine Wärmebildkamera an der Drohne erfasst tausende Module in kurzer Zeit. Hotspots, defekte Bypassdioden, PID und ausgefallene Strings werden sichtbar – und landen mit Koordinate und Maßnahme im Bericht."
        image={{ src: "/Images/Jobs/drone-view-of-technician-installing-solar-panels-2025-03-08-04-40-16-utc.jpg", alt: "Luftaufnahme aus der Drohne über Modulreihen einer großen PV-Anlage" }}
        points={["Nach IEC TS 62446-3", "Georeferenzierter Bericht", "Kombinierbar mit Elektrolumineszenz", "Drohnenflug nach EU-Recht"]}
        actions={[
          { label: "Inspektion anfragen", href: "#anfrage" },
          { label: "Fehlerbilder ansehen", href: "#fehlerbilder", variant: "outlineLight", icon: ScanSearch },
        ]}
      />

      <Section tone="white" space="lg">
        <SectionHeading
          eyebrow="Was sichtbar wird"
          title="Was die Wärmebildkamera an einer PV-Anlage findet"
          lead="Ein Solarmodul, das nicht richtig arbeitet, wandelt Licht in Wärme statt in Strom. Die Infrarotkamera zeigt diese Temperaturunterschiede – typische Muster lassen auf die Ursache schließen."
          className="mb-12"
        />
        <FeatureGrid
          cols={3}
          items={[
            { icon: Flame, title: "Hotspots", text: "Einzelne überhitzte Zellen durch Zellbruch, Fertigungsfehler oder Verschattung – ein Sicherheits- und Garantiethema." },
            { icon: Zap, title: "Bypassdioden", text: "Ein gleichmäßig wärmeres Modul-Drittel zeigt eine aktive oder defekte Bypassdiode – der Abschnitt liefert keinen Strom." },
            { icon: Thermometer, title: "PID", text: "Potenzialinduzierte Degradation zeigt sich als Patchwork-Muster, oft verstärkt am Minuspol des Strings." },
            { icon: ScanSearch, title: "Zellbrüche", text: "Gebrochene Zellen mit Wärmewirkung erscheinen als Flecken; feine Mikrorisse bestätigt die Elektrolumineszenz." },
            { icon: Map, title: "Strings & Module", text: "Ausgefallene Strings und offene Module fallen als wärmere Flächen auf – oft seit Monaten unbemerkt." },
            { icon: ShieldCheck, title: "Steckverbinder & Dosen", text: "Überhitzte Verbindungen sind Brandrisiken und werden mit höchster Priorität gemeldet." },
          ]}
        />
      </Section>

      <Section tone="sand" space="lg" id="fehlerbilder" className="scroll-mt-24">
        <SectionHeading
          eyebrow="Ergebnisbeispiele"
          title="Fehlerbild → Ursache → Maßnahme"
          lead="So ordnen wir typische thermische Auffälligkeiten ein. Die endgültige Diagnose bestätigen Messungen vor Ort."
          className="mb-10"
        />
        <Tabelle
          caption="Typische Fehlerbilder in der PV-Thermografie"
          kopf={["Fehlerbild im Wärmebild", "Wahrscheinliche Ursache", "Maßnahme"]}
          zeilen={FEHLERBILDER}
          kompakt
          quelle="Einordnung nach IEA PVPS Task 13 („Review on Infrared and Electroluminescence Imaging for PV Field Applications“, 2018; „Review of Failures of Photovoltaic Modules“, 2014) und IEC TS 62446-3."
        />
      </Section>

      <Section tone="white" space="lg">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <SectionHeading
            eyebrow="Norm"
            title="Thermografie nach IEC TS 62446-3"
            lead="Die technische Spezifikation IEC TS 62446-3 regelt die Infrarot-Thermografie von PV-Modulen und -Anlagen im Freien. Wer die Rahmenbedingungen nicht einhält, bekommt Bilder – aber keine belastbare Aussage."
          />
          <Tabelle kopf={["Anforderung", "Vorgabe", "Warum"]} zeilen={NORM} kompakt quelle="Zusammenfassung ohne Anspruch auf Vollständigkeit. Maßgeblich ist der Normtext." />
        </div>
      </Section>

      <Section tone="green" space="lg">
        <SplitMedia
          eyebrow="Kombination"
          title="Thermografie plus Elektrolumineszenz"
          image={{ src: "/Images/Jobs/renewable-energy-eco-technology-electric-power-fl-2025-01-29-12-30-39-utc.jpg", alt: "Luftaufnahme einer großen PV-Anlage mit Technikern zwischen den Modulreihen" }}
          text={[
            "Thermografie zeigt, wo die Anlage im Betrieb Energie verliert. Elektrolumineszenz zeigt, warum: Bei der EL-Aufnahme wird Strom in das Modul eingespeist, eine Spezialkamera macht das abgestrahlte Licht sichtbar. Zellbrüche, Mikrorisse und PID erscheinen als dunkle Bereiche.",
            "Weil EL aufwendiger ist, setzen wir sie gezielt ein: an Modulen, die in der Thermografie auffallen, nach Hagel oder als Nachweis für Garantie und Versicherung.",
          ]}
          points={["Thermografie: großflächig, im laufenden Betrieb", "EL: gezielt, sehr detailliert, meist nachts oder mit Tageslicht-Verfahren", "I-U-Kennlinie: Leistungsverlust je String in Zahlen"]}
        />
      </Section>

      <Section tone="white" space="lg">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <div>
            <SectionHeading
              eyebrow="Drohnenrecht Österreich"
              title="Sicher und rechtskonform fliegen"
              lead="Drohnenflüge sind in Österreich nach EU-Recht geregelt und werden von Austro Control überwacht. Für eine PV-Inspektion im Gewerbegebiet kommt es vor allem auf Drohnenklasse, Abstand zu Personen und Lage zu Flughäfen an."
            />
            <Hinweis ton="recht" titel="Vor jedem Flug" className="mt-8">
              <p>
                Wir prüfen Geo-Zonen, stimmen Zeitfenster, Absperrbereiche und Ansprechpartner mit Ihnen ab und informieren Ihre Beschäftigten. Die Flüge führen registrierte Betreiber mit gültigem
                Kompetenznachweis durch.
              </p>
            </Hinweis>
          </div>
          <Tabelle kopf={["Thema", "Regel"]} zeilen={DROHNENRECHT} kompakt quelle="Stand September 2026, ohne Gewähr. Quelle: Austro Control (dronespace.at), Verordnungen (EU) 2019/947 und 2019/945." />
        </div>
      </Section>

      <Section tone="sand" space="lg">
        <SectionHeading eyebrow="Ablauf" title="Von der Flugplanung zum georeferenzierten Bericht" align="center" className="mb-14" />
        <Steps
          cols={4}
          items={[
            { icon: CloudSun, title: "Planung", text: "Stringplan, Luftraum, Wetter- und Einstrahlungsprognose, Termin und Absperrung." },
            { icon: Plane, title: "Flug", text: "Wärme- und Luftbild in einem Flug, Einstrahlung wird parallel gemessen." },
            { icon: MapPinned, title: "Auswertung", text: "Orthomosaik, Anomalien klassifiziert und Modul, Reihe und String zugeordnet." },
            { icon: FileText, title: "Bericht", text: "Georeferenzierte Liste mit Priorität und Maßnahme – auf Wunsch mit Verifizierung vor Ort." },
          ]}
        />
        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {[
            { icon: Map, t: "Karten", x: "Orthomosaik aus Luft- und Wärmebildern, jede Auffälligkeit verortet." },
            { icon: Camera, t: "Einzelbilder", x: "Wärme- und Sichtbild je Befund mit Temperaturdifferenz und Messbedingungen." },
            { icon: Sun, t: "Exporte", x: "Befundliste als Tabelle und Geodaten – für Instandsetzung, Hersteller und Versicherer." },
          ].map((k) => (
            <div key={k.t} className="rounded-3xl bg-white p-6 ring-1 ring-ink-200/60">
              <k.icon aria-hidden="true" className="h-6 w-6 text-ov-600" />
              <h3 className="mt-4 font-display text-[17px] font-bold text-ink-900">{k.t}</h3>
              <p className="mt-2 text-[14.5px] leading-relaxed text-ink-600">{k.x}</p>
            </div>
          ))}
        </div>
      </Section>

      <AnfrageSektion
        tone="white"
        titel="Drohneninspektion anfragen"
        lead="Nennen Sie uns Anlagengröße, Standort und Anlass – wir klären Luftraum und Wetterfenster und machen Ihnen ein Angebot."
        schritte={["Sie senden Anlagendaten und Anlass.", "Wir prüfen Geo-Zonen und Flugbedingungen.", "Flug an einem geeigneten Tag, Bericht mit allen Befunden."]}
        formular={{
          betreff: "Drohnen-Thermografie",
          thema: "Service & Wartung",
          titel: "Anfrage Drohnen-Thermografie",
          absenden: "Inspektion anfragen",
          felder: [
            { name: "anlagengroesse", label: "Anlagengröße", typ: "zahl", einheit: "kWp", pflicht: true, placeholder: "z. B. 900" },
            { name: "anlagentyp", label: "Anlagentyp", typ: "auswahl", pflicht: true, optionen: ["Hallendach / Flachdach", "Freifläche", "Agri-PV", "Schrägdach", "Mehrere Standorte"] },
            { name: "anlass", label: "Anlass", typ: "auswahl", optionen: ["Abnahme nach Errichtung", "Ende von Gewährleistung oder Garantie", "Ertragsminderung ohne erkennbare Ursache", "Nach Hagel oder Sturm", "Auflage von Versicherung oder Bank", "Regelmäßige Inspektion"] },
            { name: "el", label: "Elektrolumineszenz gewünscht", typ: "auswahl", optionen: ["Nein", "Ja, an auffälligen Modulen", "Bitte beraten"] },
            { name: "luftraum", label: "Nähe zu Flughafen oder Sperrgebiet", typ: "auswahl", optionen: ["Nein", "Ja", "Unbekannt"] },
          ],
        }}
      />

      <Section tone="white" space="md">
        <Weiterlesen
          items={[
            { href: "/service/e-check", art: "Service", titel: "E-Check & Anlagenprüfung", text: "Elektrische Prüfung und Prüfbefund nach OVE E 8101." },
            { href: "/service/wartung", art: "Service", titel: "Wartungsvertrag Premium", text: "Drohnen-Thermografie des Generators inklusive." },
            { href: "/service/versicherung", art: "Service", titel: "PV-Versicherung & Schadenfall", text: "Befunde als Nachweis nach Hagel oder Sturm." },
            { href: "/technik/scada", art: "Technik", titel: "SCADA & Leitwarte", text: "Befunde und Monitoring-Daten im Portfolio zusammenführen." },
            { href: "/ratgeber/pv-thermografie-drohne", art: "Ratgeber", titel: "PV-Thermografie mit Drohne", text: "Normen, Fehlerbilder und Kosten ausführlich." },
            { href: "/ratgeber/hagel-photovoltaik", art: "Ratgeber", titel: "Hagel & Photovoltaik", text: "Hagelwiderstandsklassen und Vorgehen im Schadenfall." },
            { href: "/freiflaechen-photovoltaik", art: "Lösung", titel: "Freiflächenanlagen", text: "Solarparks planen, bauen und betreiben." },
          ]}
        />
      </Section>

      <FaqSektion items={FAQ} titel="Drohnen-Thermografie – häufige Fragen" tone="sand" />

      <Querverweise pfad={PFAD} ueberschrift="Mehr zu Inspektion und Betrieb" />

      <Quellen
        items={[
          { titel: "Austro Control – Drohnenportal dronespace.at", href: "https://www.dronespace.at/", hinweis: "Registrierung, Kompetenznachweise, Geo-Zonen" },
          { titel: "Durchführungsverordnung (EU) 2019/947 – Betrieb unbemannter Luftfahrzeuge", href: "https://eur-lex.europa.eu/eli/reg_impl/2019/947/oj" },
          { titel: "IEC TS 62446-3:2017 – Outdoor infrared thermography of photovoltaic modules and plants", hinweis: "Mindesteinstrahlung 600 W/m², Qualifikation, Klassifizierung" },
          { titel: "EPJ Photovoltaics (2025): Influence of irradiance and drone altitude in infrared thermography inspections of PV plants", href: "https://www.epj-pv.org/articles/epjpv/full_html/2025/01/pv20250040/pv20250040.html" },
          { titel: "IEA PVPS Task 13: Review on Infrared and Electroluminescence Imaging for PV Field Applications (2018)", hinweis: "Report IEA-PVPS T13-10:2018" },
          { titel: "IEA PVPS Task 13: Review of Failures of Photovoltaic Modules (2014)", hinweis: "Report IEA-PVPS T13-01:2014" },
        ]}
      />

      <CtaBand
        eyebrow="Drohnen-Thermografie"
        title="Tausende Module, ein Flug, ein Bericht mit klaren Maßnahmen."
        text="Thermografie nach IEC TS 62446-3, auf Wunsch mit Elektrolumineszenz und elektrischer Prüfung – für Hallendächer und Freiflächen in ganz Österreich."
        primary={{ label: "Inspektion anfragen", href: "#anfrage" }}
        secondary={{ label: "Wartungspakete ansehen", href: "/service/wartung", icon: ScanSearch }}
      />
    </div>
  );
}
