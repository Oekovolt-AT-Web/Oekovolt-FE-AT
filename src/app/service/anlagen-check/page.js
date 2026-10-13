// service/anlagen-check/page.js – Anlagen-Check mit Monatserträgen (Paket C05)
//
// Monatserträge oder CSV lokal einlesen, Soll-Wert aus PVGIS (optional wetterbereinigt über
// GeoSphere INCA, Route /api/lastgang/wetter aus B11), Ampel mit Prüfpunkten. Kein Urteil über den
// Errichter. Lead-Gate Stufe 2 (Kennung „anlagen-check“): Auswertung erst nach bestätigter E-Mail,
// vorher nur eine gekennzeichnete Beispielvorschau.

import { Activity, CloudSun, ClipboardCheck, FileSpreadsheet, Lock, ScanSearch, Sun } from "lucide-react";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import CtaBand from "@/components/ui/CtaBand";
import Reveal from "@/components/ui/Reveal";
import Querverweise from "@/components/Reusable/Querverweise";
import { JsonLd, serviceMetadata, serviceSchema } from "@/components/ServiceAT/meta";
import Hinweis from "@/components/ServiceAT/Hinweis";
import FaqSektion from "@/components/ServiceAT/FaqSektion";
import Stil from "@/components/ServiceAT/B/Stil";
import HeroBild from "@/components/ServiceAT/B/HeroBild";
import Kennzahlen from "@/components/ServiceAT/B/Kennzahlen";
import Fachdetails from "@/components/ServiceAT/B/Fachdetails";
import Abschluss from "@/components/ServiceAT/B/Abschluss";
import AnlagenCheck from "@/components/AnlagenCheck/AnlagenCheck";
import { AMPEL, DEGRADATION_PRO_JAHR, QUELLEN } from "@/components/AnlagenCheck/auswertung";
import { PVGIS_QUELLE } from "@/lib/lastgang/pv";

const PFAD = "/service/anlagen-check";
const TITEL = "Anlagen-Check: Bringt Ihre PV-Anlage genug Ertrag? | Ökovolt";
const BESCHREIBUNG =
  "Monatserträge eingeben oder CSV laden, Soll-Wert aus PVGIS für Ihren Standort. Ampel mit Prüfpunkten für Bestandsanlagen in Österreich, Daten bleiben im Browser.";
const STAND = "12.10.2026";

export const metadata = serviceMetadata({ pfad: PFAD, titel: TITEL, beschreibung: BESCHREIBUNG });

const FAQ = [
  {
    q: "Wie erkenne ich, ob meine PV-Anlage zu wenig Ertrag bringt?",
    a: "Vergleichen Sie die Monatserträge aus dem Wechselrichter-Portal mit einem Soll-Wert für Ihren Standort. Der Anlagen-Check rechnet den Soll-Wert aus PVGIS-Monatswerten (EU-Kommission, JRC) für den nächstgelegenen Ort, Ihre Leistung in kWp, die Ausrichtung und das Anlagenalter. Liegt das Jahr unter 90 Prozent des Soll-Werts, lohnt ein genauer Blick; unter 75 Prozent gehört die Anlage geprüft.",
  },
  {
    q: "Was bedeutet „wetterbereinigt“?",
    a: "Ein sonnenarmes Jahr bringt weniger Ertrag, ohne dass die Anlage ein Problem hat. Mit der Wetterbereinigung vergleicht der Check die tatsächlich gemessene Globalstrahlung des Jahres (GeoSphere Austria, INCA-Analyse, 1 km Raster, stündlich) mit dem langjährigen Mittel und passt den Soll-Wert je Monat an. An GeoSphere gehen nur die gerundete Koordinate des Orts und der Zeitraum – keine Erträge, keine Adresse. Die Wetterbereinigung ist in Vorbereitung; bis dahin rechnet der Check mit dem Klimamittel aus PVGIS.",
  },
  {
    q: "Werden meine Ertragsdaten hochgeladen?",
    a: "Nein. Monatswerte und CSV-Dateien werden ausschließlich im Browser verarbeitet. Zum Freischalten der Auswertung senden Sie uns Vorname, Nachname und E-Mail sowie die Eckdaten der Anlage (Ort, kWp, Ausrichtung, Inbetriebnahme) – keine Monatswerte und kein Ergebnis.",
  },
  {
    q: "Welche Ursachen hat ein zu niedriger Ertrag?",
    a: "Je nach Muster: Schnee und flache Sonne im Winter, Verschattung durch Bäume oder Nachbargebäude, Verschmutzung, Hotspots oder ausgefallene Substrings, Übertemperatur oder Leistungsreduktion des Wechselrichters bei hoher Netzspannung, ein Einspeiselimit, Störungen mit Stillstand oder schlicht falsche Eingaben wie Leistung und Ausrichtung. Der Check nennt die passenden Prüfpunkte – die Ursache klärt eine Messung vor Ort.",
  },
  {
    q: "Sagt der Check etwas über die Qualität des Errichters aus?",
    a: "Nein. Die Auswertung beschreibt den Zustand der Anlage im betrachteten Jahr und ersetzt keinen Prüfbefund. Ob Planung oder Montage eine Rolle spielen, lässt sich aus Monatswerten nicht ableiten.",
  },
];

export default function AnlagenCheckPage() {
  return (
    <div>
      <Stil />
      <JsonLd daten={serviceSchema({ pfad: PFAD, name: "Anlagen-Check für Photovoltaik-Bestandsanlagen", beschreibung: BESCHREIBUNG, serviceType: "Ertragsprüfung und Anlagenbewertung Photovoltaik", zielgruppe: "Betreiber von Photovoltaikanlagen" })} />

      <HeroBild
        breadcrumbs={[{ name: "Service" }, { name: "Anlagen-Check" }]}
        eyebrow="Anlagen-Check · Bestand · Ertrag"
        title={
          <>
            Bringt Ihre Anlage, <span className="ov-text-gradient-light">was sie soll?</span>
          </>
        }
        lead="Zwölf Monatswerte aus dem Portal genügen: Der Anlagen-Check rechnet den Soll-Ertrag für Ihren Standort und zeigt mit Ampel und Prüfpunkten, wo es sich hinzusehen lohnt. Ihre Daten bleiben im Browser."
        image={{ src: "/Images/AT/service-b/drohne-solarpark-2.jpg", alt: "Drohnenaufnahme einer Photovoltaikanlage auf einem Dach" }}
        points={["Monatswerte oder CSV", "Soll-Wert aus PVGIS", "Daten bleiben im Browser", "Ampel & Prüfpunkte"]}
        actions={[
          { label: "Check starten", href: "#check" },
          { label: "So rechnet der Check", href: "#methode", icon: Activity },
        ]}
      />

      <Kennzahlen
        frage="Wie viel Ertrag darf ich von meiner PV-Anlage erwarten?"
        zahlen={[
          { text: `${Math.round(AMPEL.gruen * 100)} %`, label: "des Soll-Werts: ab hier grün" },
          { text: `${Math.round(AMPEL.gelb * 100)} %`, label: "des Soll-Werts: darunter prüfen lassen" },
          { text: `${(DEGRADATION_PRO_JAHR * 100).toLocaleString("de-DE")} %/Jahr`, label: "Alterung im Soll-Wert berücksichtigt (Annahme)" },
          { text: "37 Orte", label: "mit PVGIS-Monatswerten in Österreich" },
        ]}
        fussnote={`${PVGIS_QUELLE.name} · Richtwerte zur Orientierung · Stand ${STAND}`}
      >
        <p>
          <strong>Je nach Standort und Ausrichtung rund 950 bis 1.150 kWh je kWp und Jahr</strong> für ein Süddach in Österreich – die PVGIS-Simulation der EU-Kommission liefert dafür Monatswerte je Ort.
          Der Check vergleicht Ihre Ist-Werte damit und berücksichtigt Leistung, Ausrichtung und Alter der Anlage.
        </p>
      </Kennzahlen>

      <Section tone="sand" space="lg" id="check" className="scroll-mt-24">
        <SectionHeading eyebrow="Anlagen-Check" title="Monatswerte eingeben – Ampel lesen" lead="Alle Eingaben und Dateien bleiben auf Ihrem Gerät. Die Auswertung Ihrer Werte startet, sobald Sie Ihre E-Mail-Adresse bestätigt haben – bis dahin sehen Sie ein gekennzeichnetes Beispiel." className="mb-10" />
        <AnlagenCheck />
      </Section>

      <Section tone="white" space="lg" id="methode" className="scroll-mt-24">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
          <div>
            <SectionHeading eyebrow="Methode" title="So entsteht der Soll-Wert" lead="Transparent und nachrechenbar – damit Sie wissen, womit Ihre Anlage verglichen wird." />
            <Hinweis ton="info" titel="Kein Urteil über den Errichter" className="mt-8">
              <p>Der Check bewertet Erträge, nicht Menschen. Ob Planung oder Montage eine Rolle spielen, lässt sich aus Monatswerten nicht ableiten – dafür gibt es die Messung vor Ort mit Prüfbefund.</p>
            </Hinweis>
          </div>
          <Fachdetails
            items={[
              {
                titel: "Soll-Wert aus PVGIS-Monatswerten",
                kurz: "Nächstgelegener Ort, Ausrichtung, kWp, Alterung",
                icon: Sun,
                offen: true,
                inhalt: (
                  <p className="text-[15px] leading-relaxed text-ink-700">
                    Für 37 Orte in Österreich liegen PVGIS-Monatswerte (Süd, 35°) vor; Ost/West und Flachdach werden über die Sonnengeometrie je Monat umverteilt und auf den PVGIS-Jahreswert der
                    Ausrichtung normiert. Multipliziert mit Ihrer Leistung in kWp und einem Alterungsfaktor von {(DEGRADATION_PRO_JAHR * 100).toLocaleString("de-DE")} % je Betriebsjahr (Annahme) ergibt
                    das den Soll-Wert je Monat. Quelle: {PVGIS_QUELLE.name}.
                  </p>
                ),
              },
              {
                titel: "Wetterbereinigung mit GeoSphere INCA (in Vorbereitung)",
                kurz: "Gemessene Globalstrahlung gegen langjähriges Mittel",
                icon: CloudSun,
                inhalt: (
                  <p className="text-[15px] leading-relaxed text-ink-700">
                    Auf Wunsch holt der Check die stündliche Globalstrahlung des Jahres aus der INCA-Analyse von GeoSphere Austria (1 km Raster, CC BY 4.0) über unseren Server. Die Monatssummen werden
                    mit dem langjährigen Monatsmittel verglichen (Näherung aus dem PVGIS-Jahreswert der Einstrahlung und dem Monatsprofil); das Verhältnis – begrenzt auf 0,6 bis 1,5 – skaliert den
                    Soll-Wert des Monats. Das ist eine Analyse, keine Messung am Dach. An GeoSphere gehen nur die gerundete Koordinate und der Zeitraum. Die Anbindung ist in Vorbereitung – bis sie verfügbar ist, gilt das Klimamittel aus PVGIS.
                  </p>
                ),
              },
              {
                titel: "Ampel und Prüfpunkte",
                kurz: `Grün ab ${Math.round(AMPEL.gruen * 100)} %, gelb ab ${Math.round(AMPEL.gelb * 100) } %, darunter rot`,
                icon: ClipboardCheck,
                inhalt: (
                  <ul className="space-y-2 text-[15px] leading-relaxed text-ink-700">
                    <li>Grün: Jahresertrag ab {Math.round(AMPEL.gruen * 100)} % des Soll-Werts – im erwarteten Bereich.</li>
                    <li>Gelb: {Math.round(AMPEL.gelb * 100)} bis {Math.round(AMPEL.gruen * 100)} % – prüfen lassen, Prüfpunkte beachten.</li>
                    <li>Rot: unter {Math.round(AMPEL.gelb * 100)} % – deutlich unter Soll, Service-Check mit Messung.</li>
                    <li>Prüfpunkte entstehen aus dem Muster: Nullmonate, schwacher Winter bei gutem Sommer, schwacher Sommer, einzelne Einbrüche, gleichmäßige Abweichung.</li>
                  </ul>
                ),
              },
              {
                titel: "Eingabeformate",
                kurz: "Zwölf Zahlen, Monat;kWh oder CSV-Export",
                icon: FileSpreadsheet,
                inhalt: (
                  <p className="text-[15px] leading-relaxed text-ink-700">
                    Erkannt werden zwölf Zahlen (Jänner bis Dezember), Zeilen wie „2025-03;1234“, „03.2025;1234“ oder „März;1234“ sowie CSV-Exporte aus Wechselrichter-Portalen mit Monat und kWh je
                    Zeile. Dezimalkomma und Tausenderpunkt sind erlaubt. Mehrere Zeilen desselben Monats werden summiert.
                  </p>
                ),
              },
              {
                titel: "Datenschutz",
                kurz: "Verarbeitung im Browser, Freischaltung per E-Mail",
                icon: Lock,
                inhalt: (
                  <p className="text-[15px] leading-relaxed text-ink-700">
                    Monatswerte und Dateien verlassen Ihr Gerät nicht. Die Auswertung schalten Sie mit Vorname, Nachname und E-Mail frei und bestätigen die Adresse über einen Link (24 Stunden gültig);
                    Rechtsgrundlage Art. 6 Abs. 1 lit. b DSGVO (Bereitstellung der Auswertung und Rückfragen dazu), kein Newsletter. Telefon nur, wenn Sie Kontakt wünschen. Übertragen werden die Eckdaten der
                    Anlage, nicht die Monatswerte. Ihre Eingaben bleiben als Entwurf auf diesem Gerät gespeichert, bis Sie sie leeren.
                  </p>
                ),
              },
            ]}
          />
        </div>
      </Section>

      <FaqSektion items={FAQ} titel="Anlagen-Check – kurz beantwortet" tone="sand" />

      <Querverweise pfad={PFAD} />

      <Abschluss
        stand={STAND}
        links={[
          { href: "/service/betriebsfuehrung", art: "Service", titel: "Betriebsführung & Anlagenübernahme" },
          { href: "/service/stoerung/codes", art: "Service", titel: "Fehlercode-Hub Wechselrichter" },
          { href: "/service/e-check", art: "Service", titel: "E-Check & Prüfbefund" },
          { href: "/service/drohneninspektion", art: "Service", titel: "Drohnen-Thermografie" },
          { href: "/service/reinigung", art: "Service", titel: "PV-Reinigung" },
          { href: "/service/repowering", art: "Service", titel: "Repowering & Tarifauslauf" },
          { href: "/ratgeber/photovoltaik-ertrag-pro-kwp", art: "Ratgeber", titel: "Ertrag je kWp in Österreich" },
          { href: "/ratgeber/photovoltaik-verschattung", art: "Ratgeber", titel: "Verschattung" },
          { href: "/ratgeber/photovoltaik-im-winter", art: "Ratgeber", titel: "Photovoltaik im Winter" },
          { href: "/lastgang-analyse", art: "Werkzeug", titel: "Lastgang-Analyse" },
        ]}
        quellen={QUELLEN}
      />

      <CtaBand
        eyebrow="Service-Check"
        title="Ampel gelb oder rot? Wir messen nach."
        text="Stringmessung, Isolationsprüfung, Thermografie aus der Luft und Prüfbefund nach OVE E 8101 – für Anlagen jeder Herkunft, in ganz Österreich."
        primary={{ label: "Service-Check anfragen", href: "/service/betriebsfuehrung#anfrage" }}
        secondary={{ label: "Drohnen-Thermografie", href: "/service/drohneninspektion", icon: ScanSearch }}
      />
    </div>
  );
}
