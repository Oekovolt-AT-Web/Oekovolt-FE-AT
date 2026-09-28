// service/repowering/page.js – Österreich: Repowering und Erweiterung von PV-Bestandsanlagen (Ziel: Repowering-Check)
//
// Statische AT-Inhalte statt der deutschen CMS-Texte (EEG, Ü20, Marktstammdatenregister).

import { BatteryCharging, CalendarClock, ClipboardCheck, Cpu, Gauge, LayoutGrid, LineChart, Recycle, ShieldCheck, SlidersHorizontal, Sun, TrendingDown, Wrench } from "lucide-react";

import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import SplitMedia from "@/components/ui/SplitMedia";
import FeatureGrid from "@/components/ui/FeatureGrid";
import Steps from "@/components/ui/Steps";
import CtaBand from "@/components/ui/CtaBand";
import Reveal from "@/components/ui/Reveal";
import Querverweise from "@/components/Reusable/Querverweise";
import VorherNachher from "@/components/Repowering/VorherNachher";
import { JsonLd, serviceMetadata, serviceSchema } from "@/components/ServiceAT/meta";
import Tabelle from "@/components/ServiceAT/Tabelle";
import Hinweis from "@/components/ServiceAT/Hinweis";
import Weiterlesen from "@/components/ServiceAT/Weiterlesen";
import AnfrageSektion from "@/components/ServiceAT/AnfrageSektion";
import FaqSektion from "@/components/ServiceAT/FaqSektion";
import Quellen from "@/components/ServiceAT/Quellen";

const PFAD = "/service/repowering";
const TITEL = "Repowering: PV-Bestandsanlagen modernisieren | Ökovolt";
const BESCHREIBUNG =
  "Repowering in Österreich: Module und Wechselrichter tauschen, Anlage erweitern, Speicher nachrüsten – nach dem OeMAG-Tarif, mit EAG-Förderung für Erweiterungen.";

export const metadata = serviceMetadata({ pfad: PFAD, titel: TITEL, beschreibung: BESCHREIBUNG });

const OPTIONEN = [
  ["Weiter einspeisen", "Nach Ende des Tarifvertrags zum OeMAG-Marktpreis oder über einen Stromhändler verkaufen", "Minimaler Aufwand; Erlös schwankt mit dem Marktpreis"],
  ["Auf Überschusseinspeisung umstellen", "Volleinspeiser nutzen den Strom künftig selbst und speisen nur den Überschuss ein – Zähler- und Messkonzept mit dem Netzbetreiber umstellen", "Jede selbst genutzte kWh ersetzt teuren Netzbezug"],
  ["Speicher nachrüsten", "Überschüsse in den Abend verschieben, Lastspitzen kappen, auf Wunsch Ersatzstrom", "EAG-Speicherförderung nur zusammen mit PV-Neuerrichtung oder -Erweiterung"],
  ["Erweitern", "Freie Dach- oder Parkplatzflächen belegen, zusätzliche Leistung als Erweiterung", "Erweiterung nach § 56 EAG förderfähig"],
  ["Repowering", "Module und Wechselrichter tauschen, Unterkonstruktion prüfen, Anlage auf Stand der Technik bringen", "Deutlich mehr Leistung auf derselben Fläche, neue Garantien"],
  ["In eine Energiegemeinschaft", "Überschuss in einer Erneuerbare-Energie-Gemeinschaft an Nachbarn, Gemeinde oder KMU liefern", "Lokaler Absatz, reduzierte Netzentgelte für Teilnehmer"],
];

const FOERDERUNG = [
  ["Kategorie A", "bis 10 kWp", "150 €/kWp (fixer Fördersatz)"],
  ["Kategorie B", "über 10 bis 20 kWp", "140 €/kWp (fixer Fördersatz)"],
  ["Kategorie C", "über 20 bis 100 kWp", "bis 130 €/kWp (höchstzulässig, Reihung)"],
  ["Kategorie D", "über 100 kWp bis 1.000 kWp je Anlage", "bis 120 €/kWp (höchstzulässig, Reihung)"],
  ["Stromspeicher", "mindestens 0,5 kWh je kWp, höchstens 50 kWh", "150 €/kWh – nur mit PV; Speichererweiterungen nicht förderbar"],
];

const FAQ = [
  {
    q: "Wann lohnt sich Repowering einer PV-Anlage in Österreich?",
    a: "Typische Anlässe sind das Ende des OeMAG-Tarifvertrags, ein Wechselrichter am Ende seiner Lebensdauer, sinkende Erträge durch Defekte oder Degradation, eine anstehende Dachsanierung oder ein gestiegener Strombedarf durch E-Flotte, Wärmepumpe oder Produktion. Weil moderne Module auf gleicher Fläche deutlich mehr Leistung bringen als Module von vor zehn bis zwanzig Jahren, rechnet sich der Tausch oft – vor allem bei hohem Eigenverbrauch.",
  },
  {
    q: "Was passiert nach Ende des OeMAG-Tarifs?",
    a: "Anlagen mit Tarifförderung nach dem Ökostromgesetz 2012 hatten einen Vertrag über 13 Jahre. Danach kann der Strom zum OeMAG-Marktpreis oder an einen Stromhändler verkauft werden. Wirtschaftlich attraktiver ist meist, den Strom selbst zu nutzen – Volleinspeiser müssen dafür das Messkonzept mit dem Netzbetreiber umstellen.",
  },
  {
    q: "Wird die Erweiterung einer bestehenden Anlage gefördert?",
    a: "Ja. Nach § 56 Erneuerbaren-Ausbau-Gesetz können Neuerrichtung und Erweiterung von PV-Anlagen bis 1.000 kWp je Anlage mit einem Investitionszuschuss gefördert werden. Gefördert wird die zusätzliche Engpassleistung; das Förderansuchen muss in einem OeMAG-Fördercall und vor Inbetriebnahme gestellt werden. Ein reiner Modultausch ohne Leistungszuwachs ist in der Regel keine Erweiterung – das prüfen wir im Einzelfall.",
  },
  {
    q: "Wie lange hält ein Wechselrichter?",
    a: "Wechselrichter sind meist das erste Bauteil, das getauscht werden muss – häufig nach zehn bis fünfzehn Jahren. Neue Geräte müssen die TOR Erzeuger erfüllen und sollten in der österreichischen Wechselrichterliste geführt sein. Sie bieten besseres Monitoring und sind oft für Speicher und Ersatzstrom vorbereitet.",
  },
  {
    q: "Was muss bei der Unterkonstruktion beachtet werden?",
    a: "Neue Module sind größer und oft schwerer. Unterkonstruktion, Klemmbereiche und Dachstatik müssen für die Schnee- und Windlast am Standort nach ÖNORM B 1991-1-3 und B 1991-1-4 nachgewiesen sein. Bei älteren Hallendächern prüfen wir zusätzlich Dachhaut, Durchdringungen und Brandschutz nach OVE R 11-1.",
  },
  {
    q: "Was passiert mit den alten Modulen?",
    a: "Photovoltaikmodule sind Elektroaltgeräte im Sinne der Elektroaltgeräteverordnung und werden über die dafür vorgesehenen Sammel- und Verwertungssysteme recycelt. Glas, Aluminium und Silizium lassen sich großteils wiederverwerten. Funktionsfähige Module können unter Umständen weiterverwendet werden. Rückbau und Entsorgung organisieren wir.",
  },
  {
    q: "Muss die Anlage nach dem Repowering neu geprüft und gemeldet werden?",
    a: "Ja. Ein Repowering ist eine wesentliche Änderung: Die Anlage wird neu geprüft (OVE E 8101, OVE EN 62446-1), das Anlagenbuch aktualisiert und die Änderung beim Netzbetreiber gemeldet. Bei laufenden Förder- oder Tarifverträgen informieren wir auch die OeMAG.",
  },
];

export default function RepoweringPage() {
  return (
    <div>
      <JsonLd daten={serviceSchema({ pfad: PFAD, name: "Repowering und Erweiterung von Photovoltaikanlagen", beschreibung: BESCHREIBUNG, serviceType: "PV-Repowering, Erweiterung und Speichernachrüstung" })} />

      <PageHero
        breadcrumbs={[{ name: "Service" }, { name: "Repowering" }]}
        eyebrow="Repowering · Erweiterung · Speicher"
        title={<>Bestandsanlage, <span className="ov-text-gradient">neue Leistung</span></>}
        lead="Viele PV-Anlagen in Österreich stammen aus der Zeit der OeMAG-Tarife. Heute bringen neue Module auf derselben Fläche deutlich mehr Leistung, Wechselrichter erreichen ihr Lebensende und Eigenverbrauch ist mehr wert als Einspeisung. Wir prüfen Ihre Anlage und rechnen Tausch, Erweiterung und Speicher ehrlich durch."
        image={{ src: "/Images/Jobs/jobs1.jpg", alt: "Monteure tauschen Solarmodule auf einem Gewerbedach" }}
        points={["Nach Ende des OeMAG-Tarifs", "Module & Wechselrichter tauschen", "Erweiterung mit EAG-Förderung", "Speicher nachrüsten"]}
        actions={[
          { label: "Repowering-Check anfragen", href: "#anfrage" },
          { label: "Leistung vergleichen", href: "#vergleich", icon: Gauge },
        ]}
        badge={
          <div className="flex items-center gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-ov-500 text-white">
              <Sun aria-hidden="true" className="h-6 w-6" />
            </span>
            <div>
              <p className="font-display text-[20px] font-extrabold leading-none text-ink-900">mehr kWp</p>
              <p className="mt-1 text-[12.5px] leading-snug text-ink-500">auf derselben Dachfläche mit aktuellen Modulen</p>
            </div>
          </div>
        }
      />

      <Section tone="white" space="lg">
        <SectionHeading
          eyebrow="Anlässe"
          title="Sechs Gründe, eine Bestandsanlage jetzt anzugehen"
          lead="Repowering lohnt sich, wenn mehrere Anlässe zusammenkommen – etwa Tarifende, Wechselrichtertausch und gestiegener Strombedarf."
          className="mb-12"
        />
        <FeatureGrid
          cols={3}
          items={[
            { icon: CalendarClock, title: "Tarifende", text: "OeMAG-Tarifverträge nach dem Ökostromgesetz 2012 liefen 13 Jahre. Danach entscheidet der Eigenverbrauch über die Wirtschaftlichkeit." },
            { icon: Cpu, title: "Wechselrichter am Lebensende", text: "Nach zehn bis fünfzehn Jahren steigen Ausfälle. Ein Tausch ist der ideale Moment, die ganze Anlage zu prüfen." },
            { icon: TrendingDown, title: "Ertrag sinkt", text: "Degradation, PID, Hotspots oder ausgefallene Strings – Thermografie und Kennlinienmessung zeigen, was noch geht." },
            { icon: LineChart, title: "Mehr Strombedarf", text: "E-Flotte, Wärmepumpe oder neue Maschinen: Mehr Leistung vom selben Dach senkt den Netzbezug." },
            { icon: Wrench, title: "Dachsanierung", text: "Müssen die Module ohnehin herunter, ist der Umstieg auf neue Module oft kaum teurer als die Wiedermontage." },
            { icon: SlidersHorizontal, title: "Netz & Regelung", text: "Neue Wechselrichter nach TOR Erzeuger, bei größeren Anlagen EZA-Regler – für stabile Einspeisung und weniger Abregelung." },
          ]}
        />
      </Section>

      <Section tone="sand" space="lg" id="vergleich" className="scroll-mt-24">
        <SectionHeading
          eyebrow="Vorher / Nachher"
          title={<>Was steckt noch in <span className="ov-text-gradient">Ihrem Dach</span>?</>}
          lead="Wählen Sie Baujahr und belegte Fläche Ihrer Anlage und ziehen Sie den Regler über das Dach. Die Rechnung ist eine vereinfachte Orientierung – den tatsächlichen Wert ermitteln wir beim Anlagencheck."
          align="center"
          className="mb-12"
        />
        <Reveal dir="scale">
          <VorherNachher />
        </Reveal>
      </Section>

      <Section tone="white" space="lg">
        <SectionHeading
          eyebrow="Nach dem OeMAG-Tarif"
          title="Sechs Optionen für Ihre Bestandsanlage"
          lead="Welche Option passt, hängt von Zustand, Verbrauch und Dach ab. Oft ist eine Kombination am wirtschaftlichsten – etwa Überschusseinspeisung mit Speicher und Erweiterung."
          className="mb-10"
        />
        <Tabelle kopf={["Option", "Was passiert", "Gut zu wissen"]} zeilen={OPTIONEN} kompakt />
      </Section>

      <Section tone="green" space="lg">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <div>
            <SectionHeading
              eyebrow="EAG-Förderung"
              title="Investitionszuschuss für die Erweiterung"
              lead="Nach § 56 Erneuerbaren-Ausbau-Gesetz können Neuerrichtung und Erweiterung von PV-Anlagen bis 1.000 kWp je Anlage gefördert werden. Die Förderung beträgt höchstens 30 % der förderfähigen Kosten."
            />
            <div className="mt-8 space-y-5">
              <Hinweis ton="info" titel="Was als Erweiterung zählt">
                <p>
                  Gefördert wird die zusätzliche Engpassleistung. Ein reiner Modultausch ohne Leistungszuwachs ist in der Regel keine Erweiterung. Erhöht der Tausch die Leistung, kann der
                  Zuwachs förderfähig sein – wir klären das vor dem Ansuchen mit den Unterlagen der EAG-Abwicklungsstelle.
                </p>
              </Hinweis>
              <Hinweis ton="achtung" titel="Fristen beachten">
                <p>
                  Das Förderansuchen muss in einem der OeMAG-Fördercalls und vor Inbetriebnahme gestellt werden. Zusätzlich kann der Öko-Investitionsfreibetrag genutzt werden – befristet 22 %
                  für Anschaffungen bis Ende 2026.
                </p>
              </Hinweis>
            </div>
          </div>
          <Tabelle
            caption="EAG-Investitionszuschuss Photovoltaik – Fördersätze 2026"
            kopf={["Kategorie", "Engpassleistung", "Fördersatz"]}
            zeilen={FOERDERUNG}
            kompakt
            quelle="Quelle: EAG-Abwicklungsstelle, Stand Fördercalls 2026. Abschläge bzw. Zuschläge je nach Standort (z. B. Freifläche, Agri-PV) nach § 56 EAG. Budgets je Call begrenzt."
          />
        </div>
      </Section>

      <Section tone="white" space="lg">
        <SplitMedia
          eyebrow="Technik"
          title="Worauf es beim Repowering technisch ankommt"
          image={{ src: "/Images/Jobs/jobs3.jpg", alt: "Freiflächen-Photovoltaikanlage unter blauem Himmel" }}
          text="Repowering ist mehr als ein Modultausch. Damit die erneuerte Anlage wieder zwanzig Jahre und länger zuverlässig läuft, prüfen wir das Gesamtsystem."
          points={[
            { title: "Module", text: "Aktuelle Glas-Glas- oder Glas-Folie-Module mit geprüfter Hagel- und Schneelast" },
            { title: "Wechselrichter", text: "TOR-Erzeuger-konform, in der Wechselrichterliste geführt, speicher- und ersatzstromfähig" },
            { title: "Unterkonstruktion & Statik", text: "Nachweis für Schnee- und Windlast nach ÖNORM B 1991-1-3/-4" },
            { title: "Brandschutz & Kabel", text: "OVE R 11-1, Leitungsführung, Steckverbinder, Freischaltstelle" },
            { title: "Regelung", text: "EZA-Regler bzw. Parkregler, Einspeiselimit und Blindleistung nach Vorgabe des Netzbetreibers" },
          ]}
        />
      </Section>

      <Section tone="sand" space="lg">
        <SectionHeading eyebrow="Ablauf" title="So läuft Ihr Repowering ab" align="center" className="mb-14" />
        <Steps
          items={[
            { icon: ClipboardCheck, title: "Anlagencheck", text: "Ertragsdaten, Thermografie, Messungen, Dach, Unterkonstruktion und Verträge (OeMAG, Netzbetreiber)." },
            { icon: LayoutGrid, title: "Varianten", text: "Tausch, Erweiterung, Speicher oder Kombination – mit Wirtschaftlichkeit, Förderung und Finanzierung." },
            { icon: Recycle, title: "Umbau", text: "Rückbau, Montage, fachgerechte Verwertung der Altmodule, Prüfung und Anlagenbuch." },
            { icon: ShieldCheck, title: "Meldung & Betrieb", text: "Netzbetreiber, OeMAG und Förderstelle, danach Monitoring und Wartung." },
          ]}
        />
      </Section>

      <AnfrageSektion
        titel="Repowering-Check anfragen"
        lead="Senden Sie uns die Eckdaten Ihrer Bestandsanlage. Wir melden uns mit Rückfragen und einem Termin für den Anlagencheck."
        schritte={["Sie senden Anlagendaten und Vertragsstatus.", "Anlagencheck vor Ort mit Messung und Thermografie.", "Varianten mit Wirtschaftlichkeit, Förderung und Angebot."]}
        formular={{
          betreff: "Repowering-Check",
          thema: "Photovoltaik",
          titel: "Anfrage Repowering-Check",
          absenden: "Check anfragen",
          felder: [
            { name: "anlagengroesse", label: "Bestehende Leistung", typ: "zahl", einheit: "kWp", pflicht: true, placeholder: "z. B. 150" },
            { name: "baujahr", label: "Baujahr / Inbetriebnahme", typ: "zahl", pflicht: true, placeholder: "z. B. 2012" },
            { name: "wechselrichter", label: "Wechselrichter (Hersteller, Anzahl)", placeholder: "z. B. 6× SMA SMC 10000TL", breit: true },
            { name: "vertrag", label: "Vermarktung heute", typ: "auswahl", optionen: ["OeMAG-Tarif läuft noch", "OeMAG-Tarif ausgelaufen / Marktpreis", "Stromhändler", "Überschusseinspeisung mit Eigenverbrauch", "Unbekannt"] },
            { name: "ziel", label: "Ziel", typ: "auswahl", optionen: ["Mehr Ertrag auf gleicher Fläche", "Erweiterung", "Speicher nachrüsten", "Wechselrichter defekt", "Dachsanierung geplant", "Bitte beraten"] },
          ],
        }}
      />

      <Section tone="white" space="md">
        <Weiterlesen
          items={[
            { href: "/ratgeber/photovoltaik-nach-20-jahren", art: "Ratgeber", titel: "Photovoltaik nach Tarifende", text: "Weiterbetrieb, Marktpreis und Repowering." },
            { href: "/ratgeber/oemag-marktpreis", art: "Ratgeber", titel: "OeMAG-Marktpreis", text: "Berechnung, Historie und Quartalswerte." },
            { href: "/ratgeber/eag-investitionszuschuss", art: "Ratgeber", titel: "EAG-Investitionszuschuss", text: "Fördercalls, Kategorien und Fristen." },
            { href: "/ratgeber/energiegemeinschaft-gewerbe", art: "Ratgeber", titel: "Energiegemeinschaft für Betriebe", text: "Überschuss lokal liefern." },
            { href: "/service/drohneninspektion", art: "Service", titel: "Drohnen-Thermografie", text: "Zustand der Bestandsanlage erfassen." },
            { href: "/service/finanzierung", art: "Service", titel: "Finanzierung & Leasing", text: "Repowering ohne großen Mittelabfluss." },
            { href: "/technik/parkregler", art: "Technik", titel: "Parkregler (EZA-Regler)", text: "Netzkonform nach dem Umbau." },
            { href: "/gewerbespeicher", art: "Lösung", titel: "Gewerbespeicher", text: "Überschuss verschieben, Spitzen kappen." },
          ]}
        />
      </Section>

      <FaqSektion items={FAQ} titel="Repowering – kurz & ehrlich beantwortet" tone="sand" />

      <Querverweise pfad={PFAD} />

      <Quellen
        items={[
          { titel: "Erneuerbaren-Ausbau-Gesetz § 56 – Investitionszuschüsse Photovoltaik", href: "https://www.jusline.at/gesetz/eag/paragraf/56" },
          { titel: "EAG-Abwicklungsstelle – Investitionszuschuss Photovoltaik & Speicher", href: "https://www.eag-abwicklungsstelle.at/wissen/investitionszuschuss-photovoltaik-und-speicher/" },
          { titel: "OeMAG – Marktpreis", href: "https://www.oem-ag.at/marktpreis" },
          { titel: "Oesterreichs Energie – Wechselrichterliste TOR Erzeuger Typ A", href: "https://oesterreichsenergie.at/publikationen/ueberblick/detailseite/wechselrichterliste-tor-erzeuger-typ-a" },
          { titel: "WKO – Investitionsfreibetrag", href: "https://www.wko.at/steuern/investitionsfreibetrag" },
        ]}
      />

      <CtaBand
        eyebrow="Repowering"
        title="Holen Sie aus Ihrem Dach wieder das Maximum heraus."
        text="Wir prüfen Ihre Bestandsanlage, rechnen Tausch, Erweiterung und Speicher ehrlich durch – mit EAG-Förderung und Finanzierung – und setzen die beste Variante aus einer Hand um."
        primary={{ label: "Repowering-Check anfragen", href: "#anfrage" }}
        secondary={{ label: "Speicher nachrüsten", href: "/gewerbespeicher", icon: BatteryCharging }}
      />
    </div>
  );
}
