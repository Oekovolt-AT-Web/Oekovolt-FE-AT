// angebot-pruefen/page.js – Angebots-Zweitmeinung: PV-Angebot lokal prüfen (Paket B08)
//
// PDF nur im Browser lesen (pdfjs-dist, kein Upload), Kennzahlen bestätigen, €/kWp und €/kWh
// Jahresertrag (PVGIS über /api/standort), Vollständigkeits-Checkliste. Lead-Gate Stufe 2
// (Kennung „angebot-pruefen“): Prüfung erst nach bestätigter E-Mail. Ergebnis = Prüfpunkte zum
// Nachfragen – kein Urteil über das Angebot, keine Anbieternamen, keine Speicherung der Datei.

import { ClipboardList, Coins, FileSearch, Lock, Mail, ShieldCheck, Sun } from "lucide-react";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import CtaBand from "@/components/ui/CtaBand";
import Querverweise from "@/components/Reusable/Querverweise";
import { JsonLd, serviceMetadata, serviceSchema } from "@/components/ServiceAT/meta";
import Hinweis from "@/components/ServiceAT/Hinweis";
import FaqSektion from "@/components/ServiceAT/FaqSektion";
import Stil from "@/components/ServiceAT/B/Stil";
import HeroBild from "@/components/ServiceAT/B/HeroBild";
import Kennzahlen from "@/components/ServiceAT/B/Kennzahlen";
import Fachdetails from "@/components/ServiceAT/B/Fachdetails";
import Abschluss from "@/components/ServiceAT/B/Abschluss";
import AngebotPruefer from "@/components/AngebotPruefer/AngebotPruefer";
import { EAG_ZUSCHUSS_MAX, ERTRAG_RAHMEN, MARKTSTATISTIK, PRUEFPUNKTE, QUELLEN, STAND } from "@/lib/angebot/pruefung";

const PFAD = "/angebot-pruefen";
const TITEL = "PV-Angebot prüfen: Zweitmeinung mit Prüfpunkten | Ökovolt";
const BESCHREIBUNG =
  "PV-Angebot lokal im Browser prüfen: €/kWp, €/kWh Jahresertrag aus PVGIS und eine Checkliste mit Prüfpunkten zu Netz, Parkregler, Statik, Brandschutz, Monitoring, Wartung, Förderung. Keine Datei verlässt Ihr Gerät.";

export const metadata = serviceMetadata({ pfad: PFAD, titel: TITEL, beschreibung: BESCHREIBUNG });

const FAQ = [
  {
    q: "Wird mein Angebot hochgeladen?",
    a: "Nein. Die PDF wird ausschließlich in Ihrem Browser gelesen; die Leseroutine (pdf.js) ist Teil unserer Website und lädt nichts von fremden Servern. An unseren Server gehen nur die Koordinaten des gewählten Orts für den PVGIS-Jahresertrag und – nach Ihrer Freischaltung – Name, E-Mail und die von Ihnen bestätigten Kennzahlen. Fremdangebote enthalten Daten Dritter (Ansprechpersonen, Konditionen), deshalb nehmen wir sie bewusst nicht entgegen.",
  },
  {
    q: "Geht die Prüfung auch ohne PDF?",
    a: "Ja. Leistung in kWp und Angebotssumme netto genügen für die Kennzahlen; alle weiteren Felder und die Checkliste füllen Sie von Hand. Gescannte PDFs ohne Textebene werden nicht erkannt – auch dann tragen Sie die Werte selbst ein.",
  },
  {
    q: "Bewertet das Werkzeug das Angebot oder den Anbieter?",
    a: "Nein. Das Ergebnis sind Prüfpunkte zum Nachfragen: Was fehlt, was ist unklar, welche Nachweise Sie verlangen sollten. Es gibt keine Note, kein „zu teuer“ und keine Nennung von Anbietern. Der einzige Marktbezug ist die amtliche Marktstatistik 2024, und der Wert 1.551 €/kWp wird nur für 5-kWp-Kleinanlagen gezeigt und so gekennzeichnet.",
  },
  {
    q: "Warum muss ich meine E-Mail bestätigen, bevor die Prüfung läuft?",
    a: "Die Prüfung ist eine individuelle Auswertung Ihrer Daten. Wir senden Ihnen den Link zum Ergebnis an Ihre Adresse und beantworten Rückfragen dazu (Art. 6 Abs. 1 lit. b DSGVO). Der Bestätigungslink gilt 24 Stunden und ist einmal verwendbar; danach bleibt die Freischaltung 30 Tage auf diesem Gerät. Kein Newsletter, keine Kopplung an Werbung.",
  },
  {
    q: "Was bedeutet €/kWh Jahresertrag?",
    a: "Angebotssumme netto geteilt durch die im ersten Jahr erwartete Erzeugung. Den Jahresertrag holt das Werkzeug aus PVGIS (EU-Kommission, JRC) für Ihren Ort und die Ausrichtung – oder Sie tragen die Ertragsannahme aus dem Angebot ein und sehen, ob sie in der österreichischen Spanne liegt.",
  },
  {
    q: "Wie geht es nach der Prüfung weiter?",
    a: "Sie drucken die Prüfliste und klären die offenen Punkte mit dem Anbieter. Wünschen Sie eine fachliche Zweitmeinung von Ökovolt, übergeben Sie mit einem Klick die bestätigten Kennzahlen in die Anfrage; das Angebots-PDF fordert unser Techniker bei Bedarf per E-Mail bei Ihnen an.",
  },
];

export default function AngebotPruefenPage() {
  return (
    <div>
      <Stil />
      <JsonLd daten={serviceSchema({ pfad: PFAD, name: "Angebots-Zweitmeinung Photovoltaik", beschreibung: BESCHREIBUNG, serviceType: "Prüfung von Photovoltaik-Angeboten", zielgruppe: "Unternehmen, Landwirtschaft, Gemeinden, Eigentümer" })} />

      <HeroBild
        breadcrumbs={[{ name: "Werkzeuge" }, { name: "Angebot prüfen" }]}
        eyebrow="Zweitmeinung · PV-Angebot · lokal im Browser"
        title={
          <>
            Was fehlt in diesem Angebot? <span className="ov-text-gradient-light">Prüfpunkte statt Bauchgefühl.</span>
          </>
        }
        lead="PDF lokal lesen oder Kennzahlen eintragen: Das Werkzeug rechnet €/kWp und €/kWh Jahresertrag und stellt eine Prüfliste zu Netz, Parkregler, Statik, Brandschutz, Monitoring, Wartung und Förderung zusammen. Ohne Upload, ohne Urteil, ohne Anbieternamen."
        image={{ src: "/Images/AT/service-b/besprechung-vertrag.jpg", alt: "Besprechung eines Angebots am Tisch" }}
        points={["PDF bleibt im Browser", "€/kWp und €/kWh Jahresertrag", `${PRUEFPUNKTE.length} Prüfpunkte`, "Auch ohne PDF"]}
        actions={[
          { label: "Angebot prüfen", href: "#pruefen" },
          { label: "So prüft das Werkzeug", href: "#methode", icon: FileSearch },
        ]}
      />

      <Kennzahlen
        frage="Woran erkenne ich, ob ein PV-Angebot vollständig ist?"
        zahlen={[
          { text: `${PRUEFPUNKTE.length}`, label: "Prüfpunkte von Netzebene bis Gewährleistung" },
          { text: `${Math.round(EAG_ZUSCHUSS_MAX * 100)} %`, label: "höchstens: EAG-Zuschuss der Investitionskosten (EAG-IZV)" },
          { text: `${ERTRAG_RAHMEN.min}–${ERTRAG_RAHMEN.max}`, label: "kWh/kWp: übliche Spanne in Österreich (PVGIS)" },
          { text: `${MARKTSTATISTIK.klassen[0].eurProKwp.toLocaleString("de-DE")} €/kWp`, label: "Mittelwert 5-kWp-Kleinanlagen netto, Marktstatistik 2024 – nur für diese Größe" },
        ]}
        fussnote={`${MARKTSTATISTIK.quelle}, Stand ${MARKTSTATISTIK.stand} · EAG-IZV Fassung 19.01.2026 · Richtwerte zur Orientierung · Angaben Ökovolt Österreich · Stand ${STAND}`}
      >
        <p>
          <strong>Ein vollständiges Angebot benennt Komponenten, Netzanschluss, Statik, Brandschutz, Monitoring, Wartung und seine Förderannahmen – und legt die Ertragsprognose mit Quelle offen.</strong> Fehlt etwas davon, steht es nicht
          im Preis, kommt aber später dazu. Das Werkzeug macht diese Lücken sichtbar, bevor Sie unterschreiben.
        </p>
      </Kennzahlen>

      <Section tone="sand" space="lg" id="pruefen" className="scroll-mt-24">
        <SectionHeading
          eyebrow="Angebot prüfen"
          title="Kennzahlen bestätigen – Prüfpunkte erhalten"
          lead="Die PDF wird nur auf Ihrem Gerät gelesen. Die Prüfung selbst startet nach der Freischaltung mit Name und E-Mail und bestätigtem Link; vorher sehen Sie ein Beispiel."
          className="mb-10"
        />
        <AngebotPruefer />
      </Section>

      <Section tone="white" space="lg" id="methode" className="scroll-mt-24">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
          <div>
            <SectionHeading eyebrow="Methode" title="So prüft das Werkzeug" lead="Nachrechenbar und ohne Wertung – damit Sie wissen, was hinter jedem Prüfpunkt steht." />
            <Hinweis ton="info" titel="Kein Urteil, keine Namen" className="mt-8">
              <p>Das Werkzeug kennt keine Anbieter und vergibt keine Noten. Es zeigt, was im Angebot ausgewiesen ist und was Sie nachfragen sollten. Ob ein Preis angemessen ist, hängt von Dach, Netz und Leistungsumfang ab – das klärt ein Vergleich auf gleicher Grundlage.</p>
            </Hinweis>
          </div>
          <Fachdetails
            items={[
              {
                titel: "PDF lokal lesen",
                kurz: "pdf.js im Browser, kein Upload, kein Fremdserver",
                icon: Lock,
                offen: true,
                inhalt: (
                  <p className="text-[15px] leading-relaxed text-ink-700">
                    Die Textebene der PDF wird mit pdf.js (Mozilla, Apache-2.0) direkt im Browser gelesen; die Leseroutine samt Worker ist Teil unserer Website. Erkannt werden kWp, Nettosumme, Modul, Wechselrichter, Speicher, Unterkonstruktion,
                    Netzanschluss, Gewährleistung und Garantie sowie Stichworte zu den Prüfpunkten. Die Datei wird weder gespeichert noch übertragen; Sie bestätigen oder korrigieren jeden Wert. Gescannte PDFs ohne Text: Werte von Hand eintragen.
                  </p>
                ),
              },
              {
                titel: "€/kWp und €/kWh Jahresertrag",
                kurz: "Angebotssumme netto je kWp und je erzeugter Kilowattstunde",
                icon: Coins,
                inhalt: (
                  <p className="text-[15px] leading-relaxed text-ink-700">
                    €/kWp = Angebotssumme netto ÷ Anlagenleistung. €/kWh Jahresertrag = Angebotssumme netto ÷ (kWp × spezifischer Jahresertrag). Den Jahresertrag liefert PVGIS (EU-Kommission, JRC, 14 % Systemverluste) für den nächstgelegenen Ort und
                    die gewählte Ausrichtung über unseren Server; alternativ tragen Sie die Ertragsannahme aus dem Angebot ein. Liegt sie außerhalb von {ERTRAG_RAHMEN.min}–{ERTRAG_RAHMEN.max} kWh/kWp, erscheint ein Hinweis. Enthält die Summe einen
                    Speicher, ist das im Ergebnis vermerkt – Speicher gehören getrennt in €/kWh nutzbarer Kapazität bewertet.
                  </p>
                ),
              },
              {
                titel: "Marktbezug nur für 5-kWp-Kleinanlagen",
                kurz: "BMWET-Marktstatistik 2024: 1.551 €/kWp netto",
                icon: Sun,
                inhalt: (
                  <p className="text-[15px] leading-relaxed text-ink-700">
                    Die amtliche Marktstatistik weist für 5-kWp-Kleinanlagen einen Mittelwert von {MARKTSTATISTIK.klassen[0].eurProKwp.toLocaleString("de-DE")} €/kWp netto aus ({MARKTSTATISTIK.quelle}, Stand {MARKTSTATISTIK.stand}). Das Werkzeug zeigt diesen Wert
                    nur für Anlagen um 5 kWp (4,5 bis 5,5 kWp), ohne Abweichung in Prozent und ohne Bewertung. Für alle anderen Größen gibt es keinen Marktbezug – Richtwerte stehen im Ratgeber Photovoltaik Kosten. Es sind keine Preise von Ökovolt.
                  </p>
                ),
              },
              {
                titel: "Die Prüfpunkte",
                kurz: `${PRUEFPUNKTE.length} Fragen mit Grundlage`,
                icon: ClipboardList,
                inhalt: (
                  <ul className="space-y-2 text-[15px] leading-relaxed text-ink-700">
                    {PRUEFPUNKTE.map((p) => (
                      <li key={p.id}>
                        <strong className="text-ink-900">{p.frage}</strong> <span className="text-ink-500">({p.quelle})</span>
                      </li>
                    ))}
                    <li>Der EAG-Zuschuss wird gegen die {Math.round(EAG_ZUSCHUSS_MAX * 100)}-%-Grenze der EAG-IZV gerechnet, wenn Sie den Betrag aus dem Angebot eintragen.</li>
                  </ul>
                ),
              },
              {
                titel: "Freischaltung mit bestätigter E-Mail",
                kurz: "Name + E-Mail, Link bestätigen, dann läuft die Prüfung",
                icon: Mail,
                inhalt: (
                  <p className="text-[15px] leading-relaxed text-ink-700">
                    Die Prüfung ist eine individuelle Auswertung Ihrer Daten und startet erst nach der Freischaltung: Vorname, Nachname und E-Mail, Telefon nur wenn Sie Kontakt wünschen. Sie erhalten einen Bestätigungslink (24 Stunden gültig, einmal
                    verwendbar); nach dem Klick läuft die Prüfung automatisch und die Freischaltung bleibt 30 Tage auf diesem Gerät. Rechtsgrundlage Art. 6 Abs. 1 lit. b DSGVO (Bereitstellung des Ergebnisses). Kein Newsletter, keine Kopplung an Werbung.
                  </p>
                ),
              },
              {
                titel: "Datenschutz",
                kurz: "Keine Datei, keine Anbieterdaten, nur bestätigte Kennzahlen",
                icon: ShieldCheck,
                inhalt: (
                  <p className="text-[15px] leading-relaxed text-ink-700">
                    Fremdangebote enthalten personenbezogene Daten Dritter und Geschäftsbedingungen – deshalb nehmen wir keine Datei entgegen. Übertragen werden nach der Freischaltung nur Name, E-Mail und die von Ihnen bestätigten Kennzahlen (kWp, Summe,
                    Speicher, Ort, Ausrichtung). Für die Zweitmeinung übergeben Sie dieselben Kennzahlen in die Anfrage; das PDF fordert unser Techniker bei Bedarf per E-Mail an.
                  </p>
                ),
              },
            ]}
          />
        </div>
      </Section>

      <FaqSektion items={FAQ} titel="Angebot prüfen – kurz beantwortet" tone="sand" />

      <Querverweise pfad={PFAD} />

      <Abschluss
        stand={STAND}
        links={[
          { href: "/ratgeber/photovoltaik-angebot-vergleichen", art: "Ratgeber", titel: "PV-Angebote vergleichen: Checkliste" },
          { href: "/ratgeber/solaranlage-kosten", art: "Ratgeber", titel: "Photovoltaik Kosten 2026" },
          { href: "/ratgeber/eza-regler-parkregler", art: "Ratgeber", titel: "EZA-Regler und Parkregler" },
          { href: "/ratgeber/eag-investitionszuschuss", art: "Ratgeber", titel: "EAG-Investitionszuschuss" },
          { href: "/ratgeber/investitionsfreibetrag-photovoltaik", art: "Ratgeber", titel: "Investitionsfreibetrag" },
          { href: "/standort-check", art: "Werkzeug", titel: "Standort-Check mit PVGIS" },
          { href: "/lastgang-analyse", art: "Werkzeug", titel: "Lastgang-Analyse" },
          { href: "/service/anlagen-check", art: "Werkzeug", titel: "Anlagen-Check für Bestandsanlagen" },
        ]}
        quellen={QUELLEN}
      />

      <CtaBand
        eyebrow="Zweitmeinung"
        title="Offene Punkte? Wir rechnen auf gleicher Grundlage nach."
        text="Mit Ihren bestätigten Kennzahlen planen wir eine Vergleichsbasis: Lastgang, Netzanschluss, Statik, Parkregler und Monitoring benannt – ohne Urteil über das vorliegende Angebot."
        primary={{ label: "Zweitmeinung anfragen", href: "/angebot?objekt=gewerbe&zweck=zweitmeinung" }}
        secondary={{ label: "Checkliste im Ratgeber", href: "/ratgeber/photovoltaik-angebot-vergleichen", icon: ClipboardList }}
      />
    </div>
  );
}
