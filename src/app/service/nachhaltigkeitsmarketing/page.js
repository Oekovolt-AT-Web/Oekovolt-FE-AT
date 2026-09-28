// service/nachhaltigkeitsmarketing/page.js – Österreich: Nachhaltigkeitsmarketing, ausgeführt durch Solensa GmbH

import { Camera, Clapperboard, FileBarChart, Film, Megaphone, Newspaper, PenLine, Share2, Trophy, Video } from "lucide-react";

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
import { SOLENSA } from "@/lib/site";

const PFAD = "/service/nachhaltigkeitsmarketing";
const TITEL = "Nachhaltigkeitsmarketing mit Solensa | Ökovolt";
const BESCHREIBUNG =
  "Video zur eigenen PV-Anlage, Imagespot, Social Media, Pressetext und ESG-Kennzahlen – umgesetzt von der Solensa GmbH, ohne Greenwashing, mit belegten Aussagen.";

export const metadata = serviceMetadata({ pfad: PFAD, titel: TITEL, beschreibung: BESCHREIBUNG });

const CLAIMS = [
  ["„Unsere PV-Anlage hat 2026 rund 410 MWh erzeugt – das deckte 38 % unseres Strombedarfs.“", true, "Konkret, gemessen, mit Zeitraum (Zahlen hier nur als Beispiel)"],
  ["„Mit unserem Solarstrom vermeiden wir rechnerisch rund … t CO₂ pro Jahr (Faktor und Quelle im Anhang).“", true, "Zulässig, wenn Methode, Emissionsfaktor und Zeitraum offengelegt sind"],
  ["„Wir sind klimaneutral“ – auf Basis von Kompensationszertifikaten", false, "Ab 27. 9. 2026 als irreführend verboten, wenn die Aussage auf Kompensation beruht"],
  ["„Grünes Unternehmen“, „umweltfreundlich“, „nachhaltig produziert“", false, "Allgemeine Umweltaussagen ohne anerkannte hervorragende Umweltleistung sind unzulässig"],
  ["„100 % Ökostrom“", "nur mit Nachweis", "Nur wenn Eigenerzeugung plus Bezug laut Stromkennzeichnung bzw. Herkunftsnachweisen das belegen"],
  ["Eigenes „Nachhaltigkeitssiegel“ oder Logo", false, "Nachhaltigkeitssiegel müssen auf einem Zertifizierungssystem beruhen oder staatlich festgelegt sein"],
];

const FAQ = [
  {
    q: "Wer erbringt die Marketingleistungen?",
    a: "Alle Leistungen auf dieser Seite – Videoproduktion, Drohnenaufnahmen, Social-Media-Content, Pressetexte und ESG-Aufbereitung – erbringt die Solensa GmbH. Ökovolt stellt den Kontakt her, liefert Anlagendaten und koordiniert Dreharbeiten auf der Baustelle. Den Vertrag über die Marketingleistungen schließen Sie mit Solensa.",
  },
  {
    q: "Was kostet ein Video zur eigenen PV-Anlage?",
    a: "Das hängt von Umfang, Drehtagen, Drohnenflügen, Zeitraffer-Dauer und Nutzungsrechten ab. Solensa erstellt nach einem kurzen Briefing ein individuelles Angebot. Wir nennen hier bewusst keine Pauschalpreise.",
  },
  {
    q: "Wann muss ein Baustellen-Zeitraffer geplant werden?",
    a: "Vor Baubeginn. Die Kamera muss vor der ersten Montage stehen, Strom und Blickwinkel müssen geklärt sein. Wer erst während der Montage daran denkt, verpasst die spannendsten Bilder. Sagen Sie es uns deshalb am besten schon bei der Auftragsvergabe.",
  },
  {
    q: "Dürfen wir mit „klimaneutral“ werben?",
    a: "Vorsicht: Nach der EU-Richtlinie 2024/825 zur Stärkung der Verbraucher, die ab 27. September 2026 anzuwenden ist, sind Aussagen über eine neutrale oder verringerte Klimawirkung eines Produkts unzulässig, wenn sie auf Kompensation beruhen. Auch allgemeine Umweltaussagen wie „grün“ oder „umweltfreundlich“ ohne Nachweis sind verboten. Irreführende Werbung ist in Österreich zudem nach § 2 UWG unzulässig. Belegbare Zahlen zur eigenen Anlage sind die bessere Botschaft.",
  },
  {
    q: "Welche Kennzahlen eignen sich für den Nachhaltigkeitsbericht?",
    a: "Erzeugte Strommenge, Eigenverbrauchsquote, Anteil erneuerbarer Energie am Stromverbrauch und – mit offengelegter Methode – vermiedene Emissionen im Scope 2. Die Daten stammen aus dem Monitoring der Anlage; Solensa bereitet sie grafisch und textlich für Bericht, Website und Lieferantenfragebögen auf.",
  },
  {
    q: "Braucht der Drohnendreh eine Genehmigung?",
    a: "Drohnenflüge sind nach EU-Recht geregelt; je nach Drohne, Umgebung und Lage kann eine Registrierung, ein Kompetenznachweis oder eine Freigabe nötig sein – etwa nahe Flughäfen. Das klärt das Produktionsteam vor dem Dreh.",
  },
  {
    q: "Was ist der Ökovolt PV Award?",
    a: "Mit dem Ökovolt PV Award zeichnen wir jährlich Kundinnen und Kunden für besonders gelungene Anlagen und Nachhaltigkeitsinvestitionen aus. Ein Video oder eine gute Projektdokumentation ist eine starke Grundlage für die Einreichung.",
  },
];

export default function NachhaltigkeitsmarketingPage() {
  return (
    <div>
      <JsonLd
        daten={serviceSchema({
          pfad: PFAD,
          name: "Nachhaltigkeitsmarketing zur eigenen Photovoltaikanlage",
          beschreibung: BESCHREIBUNG,
          serviceType: "Video- und Contentproduktion zu Photovoltaik und Nachhaltigkeit",
          anbieter: SOLENSA,
        })}
      />

      <PageHero
        breadcrumbs={[{ name: "Service" }, { name: "Nachhaltigkeitsmarketing" }]}
        eyebrow={`Nachhaltigkeitsmarketing · ausgeführt durch ${SOLENSA.name}`}
        title={<>Zeigen Sie, was Ihr Dach leistet – <span className="ov-text-gradient">belegbar statt geschönt</span></>}
        lead={`Ihre PV-Anlage ist eine sichtbare Investition in die Zukunft. Die ${SOLENSA.name} macht daraus Video, Imagespot, Social-Media-Content, Pressetext und ESG-Kennzahlen – mit Aussagen, die einer Prüfung standhalten. Ökovolt liefert die Anlagendaten und koordiniert den Dreh.`}
        image={{ src: "/Images/Dienstleistungen/Photovoltaik/fuschl-am-see-scaled-1.jpg", alt: "Luftaufnahme eines Hotels am See mit Photovoltaikanlagen auf mehreren Dächern" }}
        points={["Drohnenflug & Baustellen-Zeitraffer", "Nachhaltigkeits-Imagespot", "Social Media & Pressetext", "ESG-Bericht & PV Award"]}
        actions={[
          { label: "Projekt anfragen", href: "#anfrage" },
          { label: "Werben ohne Greenwashing", href: "#green-claims", icon: PenLine },
        ]}
      />

      <Section tone="white" space="sm">
        <Hinweis ton="recht" titel={`Leistung erbracht durch ${SOLENSA.name}`}>
          <p>
            Alle Marketing- und Produktionsleistungen auf dieser Seite erbringt die {SOLENSA.name} (
            <a href={SOLENSA.web} target="_blank" rel="noopener noreferrer" className="font-semibold text-ov-700 underline decoration-ov-300 underline-offset-2">
              {SOLENSA.web.replace(/^https?:\/\//, "")}
            </a>
            ), Partnerin der Ökovolt-Gruppe für Digitalisierung und Nachhaltigkeitsmarketing. Ökovolt vermittelt den Kontakt, liefert Anlagen- und Ertragsdaten und koordiniert
            Termine auf der Baustelle.
          </p>
        </Hinweis>
      </Section>

      <Section tone="white" space="lg">
        <SectionHeading
          eyebrow="Leistungen"
          title="Sechs Formate für Ihre Nachhaltigkeitskommunikation"
          lead="Kunden, Beschäftigte, Banken und Gemeinden wollen sehen, was ein Unternehmen tut – nicht nur lesen, was es verspricht."
          className="mb-12"
        />
        <FeatureGrid
          cols={3}
          items={[
            { icon: Video, title: "Video zur eigenen PV-Anlage", text: "Drohnenflug über das Dach, Baustellen-Zeitraffer von der ersten Schiene bis zur Inbetriebnahme, Interview mit der Geschäftsführung." },
            { icon: Clapperboard, title: "Nachhaltigkeits-Imagespot", text: "Kurzfilm über Ihr Unternehmen und seine Energiewende – für Website, Recruiting und Messen." },
            { icon: Share2, title: "Social-Media-Content", text: "Kurzvideos, Karussells und Kennzahlen-Grafiken für LinkedIn, Instagram und Co. – im Corporate Design." },
            { icon: Newspaper, title: "Pressemitteilung", text: "Text und Bildmaterial zur Inbetriebnahme für Regional- und Fachmedien, auf Wunsch mit Gemeinde und Partnern." },
            { icon: FileBarChart, title: "Einbindung in den ESG-Bericht", text: "Erzeugung, Eigenverbrauch und vermiedene Emissionen mit offengelegter Methode – für Bericht, Lieferanten-Fragebogen und Bank." },
            { icon: Trophy, title: "Teilnahme am PV Award", text: "Unterstützung bei der Einreichung zum jährlichen Ökovolt PV Award für die besten Anlagen und Nachhaltigkeitsinvestitionen.", href: "/pv-award" },
          ]}
        />
      </Section>

      <Section tone="sand" space="lg" id="green-claims" className="scroll-mt-24">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <div>
            <SectionHeading
              eyebrow="Green Claims"
              title="Werben ohne Greenwashing"
              lead="Ab 27. September 2026 ist die EU-Richtlinie 2024/825 anzuwenden. Sie verbietet unter anderem allgemeine Umweltaussagen ohne Nachweis und Klimaneutralitäts-Aussagen, die auf Kompensation beruhen. Irreführende Werbung ist in Österreich schon heute nach § 2 UWG unzulässig."
            />
            <Hinweis ton="achtung" titel="Unser Grundsatz" className="mt-8">
              <p>
                Wir kommunizieren, was gemessen ist: erzeugte Kilowattstunden, Eigenverbrauch, Anteil am Strombedarf. Aussagen zu vermiedenen Emissionen nur mit offengelegtem
                Emissionsfaktor und Zeitraum. Keine Pauschalversprechen, keine selbst erfundenen Siegel. Die rechtliche Freigabe Ihrer Werbung bleibt bei Ihnen bzw. Ihrer Rechtsberatung.
              </p>
            </Hinweis>
          </div>
          <Tabelle
            kopf={["Aussage", "Zulässig?", "Warum"]}
            zeilen={CLAIMS}
            kompakt
            quelle="Vereinfachte Orientierung nach Richtlinie (EU) 2024/825 und § 2 UWG. Keine Rechtsberatung. Die geplante Green-Claims-Richtlinie der EU ist bisher nicht beschlossen."
          />
        </div>
      </Section>

      <Section tone="white" space="lg">
        <SplitMedia
          eyebrow="Timing"
          title="Die besten Bilder entstehen, bevor das erste Modul liegt"
          image={{ src: "/Images/Jobs/drone-view-of-technician-installing-solar-panels-2025-03-08-04-40-16-utc.jpg", alt: "Drohnenaufnahme von Monteuren bei der Installation von Solarmodulen" }}
          text="Ein Baustellen-Zeitraffer braucht eine fest montierte Kamera vor Baubeginn, der Drohnenflug gutes Licht und eine Flugfreigabe. Wer das Marketing schon bei der Auftragsvergabe mitdenkt, bekommt mehr Material für weniger Aufwand."
          points={[
            { title: "Bei Auftragsvergabe", text: "Wunsch nennen – wir planen Kamerastandort und Drehtage in den Bauablauf ein" },
            { title: "Während der Montage", text: "Zeitraffer, Drohnenflüge, Interviews mit Team und Geschäftsführung" },
            { title: "Zur Inbetriebnahme", text: "Pressetext, Social-Media-Paket, Veranstaltung mit Gemeinde oder Kunden" },
            { title: "Nach einem Jahr", text: "Erste echte Ertragszahlen – die glaubwürdigste Geschichte" },
          ]}
        />
      </Section>

      <Section tone="green" space="lg">
        <SectionHeading eyebrow="Ablauf" title="So entsteht Ihr Nachhaltigkeitsauftritt" align="center" className="mb-14" />
        <Steps
          items={[
            { icon: Megaphone, title: "Briefing", text: "Ziele, Zielgruppen, Kanäle und Budget – gemeinsam mit Solensa." },
            { icon: PenLine, title: "Konzept", text: "Drehplan, Formate und Kernaussagen mit Claim-Check." },
            { icon: Camera, title: "Produktion", text: "Dreh auf der Baustelle und im Betrieb, Drohnenflug, Zeitraffer." },
            { icon: Film, title: "Freigabe & Veröffentlichung", text: "Schnitt, Freigabe durch Sie, Veröffentlichung und Pressearbeit." },
          ]}
        />
      </Section>

      <AnfrageSektion
        titel="Nachhaltigkeitsmarketing anfragen"
        lead={`Beschreiben Sie kurz Ihr Vorhaben. Ihre Anfrage wird zur Angebotserstellung an die ${SOLENSA.name} weitergegeben, die Ihnen ein individuelles Angebot macht.`}
        schritte={["Sie beschreiben Anlage und gewünschte Formate.", `Die ${SOLENSA.name} meldet sich für ein kurzes Briefing.`, "Sie erhalten Konzept und Angebot direkt von Solensa."]}
        formular={{
          betreff: `Nachhaltigkeitsmarketing (Ausführung ${SOLENSA.name})`,
          thema: "Sonstiges",
          titel: "Anfrage Nachhaltigkeitsmarketing",
          text: `Mit dem Absenden stimmen Sie zu, dass Ökovolt Ihre Angaben zur Angebotserstellung an die ${SOLENSA.name} weitergibt.`,
          absenden: "Anfrage senden",
          felder: [
            { name: "format", label: "Gewünschtes Format", typ: "auswahl", pflicht: true, optionen: ["Video zur PV-Anlage (Drohne, Zeitraffer)", "Nachhaltigkeits-Imagespot", "Social-Media-Content", "Pressemitteilung", "ESG-Bericht / Kennzahlen", "PV Award Einreichung", "Mehrere Formate / Paket"] },
            { name: "status", label: "Status der PV-Anlage", typ: "auswahl", pflicht: true, optionen: ["In Planung", "Beauftragt, Montage noch nicht begonnen", "In Montage", "In Betrieb"] },
            { name: "anlagengroesse", label: "Anlagengröße", typ: "zahl", einheit: "kWp", placeholder: "z. B. 500" },
            { name: "termin", label: "Wunschtermin / Anlass", placeholder: "z. B. Eröffnung im Mai, Nachhaltigkeitsbericht 2026", breit: true },
          ],
        }}
      />

      <Section tone="white" space="md">
        <Weiterlesen
          items={[
            { href: "/pv-award", art: "Unternehmen", titel: "Ökovolt PV Award", text: "Die besten Anlagen und Nachhaltigkeitsinvestitionen des Jahres." },
            { href: "/ratgeber/csrd-esg-photovoltaik", art: "Ratgeber", titel: "CSRD, ESG & Photovoltaik", text: "Nachhaltigkeitsbericht, Scope 2 und VSME." },
            { href: "/technik/scada", art: "Technik", titel: "SCADA & Reporting", text: "Die Datenbasis für belastbare Kennzahlen." },
            { href: "/service/drohneninspektion", art: "Service", titel: "Drohnenflüge & Recht", text: "Was beim Flug über Betriebsgelände gilt." },
            { href: "/hotellerie-tourismus", art: "Lösung", titel: "Hotellerie & Tourismus", text: "Nachhaltigkeit, die Gäste sehen." },
            { href: "/gewerbe", art: "Lösung", titel: "Gewerbe & Industrie", text: "Die Anlage, über die Sie erzählen." },
          ]}
        />
      </Section>

      <FaqSektion items={FAQ} titel="Nachhaltigkeitsmarketing – häufige Fragen" tone="sand" />

      <Querverweise pfad={PFAD} ueberschrift="Mehr zu Nachhaltigkeit und Kommunikation" />

      <Quellen
        items={[
          { titel: "Richtlinie (EU) 2024/825 – Stärkung der Verbraucher für den ökologischen Wandel", href: "https://eur-lex.europa.eu/eli/dir/2024/825/oj", hinweis: "anzuwenden ab 27. September 2026" },
          { titel: "Bundesgesetz gegen den unlauteren Wettbewerb (UWG) § 2 – Irreführende Geschäftspraktiken", href: "https://www.jusline.at/gesetz/uwg/paragraf/2" },
          { titel: `${SOLENSA.name}`, href: SOLENSA.web, hinweis: "ausführende Partnerin" },
          { titel: "Austro Control – dronespace.at", href: "https://www.dronespace.at/", hinweis: "Drohnenflüge in Österreich" },
        ]}
      />

      <CtaBand
        eyebrow={`Mit ${SOLENSA.name}`}
        title="Ihre Anlage verdient mehr als ein Foto im Geschäftsbericht."
        text={`Video, Imagespot, Social Media, Pressetext und ESG-Kennzahlen – produziert von der ${SOLENSA.name}, mit Daten aus Ihrer Anlage und ohne Greenwashing.`}
        primary={{ label: "Projekt anfragen", href: "#anfrage" }}
        secondary={{ label: "Zum PV Award", href: "/pv-award", icon: Trophy }}
      />
    </div>
  );
}
