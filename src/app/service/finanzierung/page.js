// service/finanzierung/page.js – Österreich: Finanzierung von Gewerbe-PV (Kauf, Kredit, Leasing, Mietkauf, Contracting/PPA)
//
// Keine konkreten Konditionen, Zinssätze oder Partnernamen – nur Strukturen und Ablauf.

import { Banknote, Building2, Calculator, FileSignature, FileText, Landmark, Receipt, Scale, Wrench } from "lucide-react";

import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import Steps from "@/components/ui/Steps";
import CtaBand from "@/components/ui/CtaBand";
import Reveal from "@/components/ui/Reveal";
import Querverweise from "@/components/Reusable/Querverweise";
import FinanzierungsRechner from "@/components/Finanzierung/FinanzierungsRechner";
import { JsonLd, serviceMetadata, serviceSchema } from "@/components/ServiceAT/meta";
import Tabelle from "@/components/ServiceAT/Tabelle";
import Hinweis from "@/components/ServiceAT/Hinweis";
import AnfrageSektion from "@/components/ServiceAT/AnfrageSektion";
import FaqSektion from "@/components/ServiceAT/FaqSektion";
import Stil from "@/components/ServiceAT/B/Stil";
import HeroBild from "@/components/ServiceAT/B/HeroBild";
import Kennzahlen from "@/components/ServiceAT/B/Kennzahlen";
import Dunkel from "@/components/ServiceAT/B/Dunkel";
import Bildband from "@/components/ServiceAT/B/Bildband";
import Fachdetails from "@/components/ServiceAT/B/Fachdetails";
import Abschluss from "@/components/ServiceAT/B/Abschluss";
import FinanzModelle from "@/components/ServiceAT/B/FinanzModelle";
import { BASE_URL } from "@/lib/site";

const PFAD = "/service/finanzierung";
const TITEL = "PV-Finanzierung: Leasing, Kredit, Contracting | Ökovolt";
const BESCHREIBUNG =
  "PV-Anlage für Unternehmen finanzieren: Kauf, Kredit, Leasing, Mietkauf oder Contracting/PPA im Vergleich – Bilanz, Liquidität, IFB und Förderung in Österreich.";

export const metadata = serviceMetadata({ pfad: PFAD, titel: TITEL, beschreibung: BESCHREIBUNG });

const VERGLEICH_KOPF = ["Kriterium", "Kauf (Eigenmittel)", "Bankkredit", "Leasing", "Mietkauf", "Contracting / PPA"];
const VERGLEICH = [
  ["Eigentum", "Sofort bei Ihnen", "Sofort bei Ihnen, ggf. Sicherungsübereignung", "Beim Leasinggeber; Kauf- oder Verlängerungsoption am Ende", "Geht mit der letzten Rate über", "Beim Contractor bzw. Anlagenbetreiber"],
  ["Bilanz (UGB)", "Anlagevermögen", "Anlagevermögen und Verbindlichkeit", "In der Regel beim Leasinggeber, Raten als Aufwand; nach IFRS 16 Nutzungsrecht beim Leasingnehmer", "Aktivierung beim Mietkäufer", "Nicht in Ihrer Bilanz – Sie kaufen Strom oder Leistung"],
  ["Liquidität", "Hoher Mittelabfluss zu Beginn", "Raten, ggf. Eigenmittelanteil", "Laufende Raten, geringe Anfangsbelastung", "Laufende Raten", "Keine Investition, Entgelt je kWh oder Monat"],
  ["Steuer", "AfA linear oder degressiv bis 30 %", "AfA plus Zinsaufwand", "Leasingraten als Betriebsausgabe", "AfA beim Mietkäufer", "Entgelt als Betriebsausgabe"],
  ["Investitionsfreibetrag", "Ja – Öko-IFB, befristet 22 % bis Ende 2026", "Ja – Öko-IFB, befristet 22 % bis Ende 2026", "Beim wirtschaftlichen Eigentümer, meist dem Leasinggeber", "In der Regel beim Mietkäufer", "Beim Contractor"],
  ["EAG-Investitionszuschuss", "Sie als Förderwerber", "Sie als Förderwerber", "Je nach Vertragsgestaltung – vorab klären", "In der Regel Sie", "Contractor als Förderwerber"],
  ["Betrieb & Wartung", "Ihre Verantwortung", "Ihre Verantwortung", "Meist bei Ihnen, oft mit Versicherungs- und Wartungspflicht", "Ihre Verantwortung", "Beim Contractor"],
  ["Passt, wenn …", "… Liquidität vorhanden ist und die Rendite zählt", "… Eigentum und Steuervorteile gewünscht sind", "… Kreditrahmen geschont und Raten planbar sein sollen", "… Eigentum ohne Anfangsinvestition gewünscht ist", "… keine Investition und kein Betriebsaufwand gewünscht sind"],
];

const UNTERLAGEN = [
  "Jahresabschlüsse der letzten zwei bis drei Jahre, aktuelle Saldenliste",
  "Firmenbuchauszug und Ansprechpartner der Geschäftsführung",
  "Angebot mit Wirtschaftlichkeitsrechnung (Lastgang, Eigenverbrauch, Erlöse)",
  "Nachweis über die Dachfläche: Eigentum oder Dachnutzungsvertrag, bei fremdem Grund ggf. Dienstbarkeit",
  "Netzzugangszusage bzw. Stand beim Netzbetreiber",
  "Förderzusage, falls vorhanden",
];

const FAQ = [
  {
    q: "Organisiert Ökovolt das Leasing?",
    a: "Ja, wir organisieren die Finanzierung gemeinsam mit Leasing- und Bankpartnern: Wir liefern technische und wirtschaftliche Unterlagen, stimmen Lieferung und Abnahme mit dem Leasinggeber ab und begleiten Sie bis zur Übernahmebestätigung. Den Leasing- oder Kreditvertrag schließen Sie direkt mit dem Finanzierungspartner; Konditionen legt ausschließlich dieser fest.",
  },
  {
    q: "Welche Finanzierung ist steuerlich am günstigsten?",
    a: "Pauschal lässt sich das nicht sagen. Beim Kauf oder Kredit können Sie den Investitionsfreibetrag nutzen – für ökologische Investitionen wie Photovoltaik befristet 22 % bei Anschaffung von November 2025 bis Ende 2026, sonst 15 % – und die Anlage linear oder degressiv abschreiben. Beim Leasing sind die Raten Betriebsausgaben, der IFB steht meist dem Leasinggeber zu. Lassen Sie die Varianten von Ihrer Steuerberatung durchrechnen.",
  },
  {
    q: "Können wir EAG-Förderung und Leasing kombinieren?",
    a: "Möglich, aber die Konstruktion muss vorab geklärt werden: Förderwerber ist, wer die Anlage errichtet und betreibt. Beim Leasing kann das je nach Vertrag der Leasinggeber oder der Leasingnehmer sein. Klären Sie das vor dem Förderansuchen mit Finanzierungspartner und EAG-Abwicklungsstelle – der Antrag muss vor Inbetriebnahme gestellt werden.",
  },
  {
    q: "Was ist der Unterschied zwischen Contracting und PPA?",
    a: "Beim Anlagen-Contracting errichtet und betreibt ein Contractor die PV-Anlage auf Ihrem Dach, Sie zahlen ein vereinbartes Entgelt. Beim On-site-PPA kaufen Sie den Solarstrom der Anlage zu einem vereinbarten Preis je Kilowattstunde. In beiden Fällen investieren Sie nicht selbst; dafür teilen Sie den wirtschaftlichen Vorteil mit dem Betreiber.",
  },
  {
    q: "Nennen Sie uns Zinssätze oder Leasingraten?",
    a: "Nein, nicht auf der Website. Zinssätze und Leasingfaktoren hängen von Bonität, Laufzeit, Sicherheiten, Restwert und Marktzins ab und werden vom Finanzierungspartner festgelegt. Sie erhalten ein konkretes Angebot auf Basis Ihrer Unterlagen.",
  },
  {
    q: "Welche Unterlagen braucht die Bank oder der Leasinggeber?",
    a: "Üblich sind Jahresabschlüsse der letzten zwei bis drei Jahre, eine aktuelle Saldenliste, der Firmenbuchauszug, unser Angebot mit Wirtschaftlichkeitsrechnung, ein Nachweis über die Dachnutzung und der Stand beim Netzbetreiber. Wir stellen die technischen Unterlagen zusammen.",
  },
  {
    q: "Wie finanzieren Gemeinden PV-Anlagen?",
    a: "Gemeinden finanzieren meist aus dem Haushalt, über Darlehen oder über Beteiligungsmodelle mit Bürgerinnen und Bürgern. Leasing und Contracting sind möglich, müssen aber haushaltsrechtlich und gegenüber der Gemeindeaufsicht geprüft werden. Zu Vergabe und Beteiligung informiert der Ratgeber Photovoltaik für Gemeinden.",
  },
  {
    q: "Gibt es Förderkredite für Photovoltaik im Betrieb?",
    a: "Neben Hausbank-Krediten bieten Förderbanken wie die aws Haftungen und Kredite für Investitionen an, für Tourismusbetriebe die ÖHT. Ob und zu welchen Bedingungen PV-Investitionen aktuell gefördert werden, ändert sich laufend – wir prüfen das im Einzelfall gemeinsam mit Ihrer Bank.",
  },
];

export default function FinanzierungPage() {
  const rechnerSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Finanzierungsrechner Photovoltaik Gewerbe – Annuität, Vorteil und Investitionsfreibetrag",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    url: `${BASE_URL}${PFAD}#rechner`,
    offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
  };

  return (
    <div>
      <Stil />
      <JsonLd daten={serviceSchema({ pfad: PFAD, name: "Finanzierung von Photovoltaikanlagen für Unternehmen", beschreibung: BESCHREIBUNG, serviceType: "Organisation von PV-Finanzierung, Leasing und Contracting" })} />
      <JsonLd daten={rechnerSchema} />

      <HeroBild
        breadcrumbs={[{ name: "Service" }, { name: "Finanzierung & Leasing" }]}
        eyebrow="Finanzierung · Leasing · Contracting"
        title={
          <>
            PV-Anlage finanzieren – <span className="ov-text-gradient-light">passend zu Bilanz und Liquidität</span>
          </>
        }
        lead="Kauf, Bankkredit, Leasing, Mietkauf oder Contracting: Jede Form wirkt anders auf Bilanz, Liquidität und Steuer. Wir rechnen die Varianten für Ihre Anlage durch und organisieren die Finanzierung gemeinsam mit Leasing- und Bankpartnern."
        image={{ src: "/Images/AT/service-b/besprechung-vertrag.jpg", alt: "Handschlag über einem unterschriebenen Finanzierungsvertrag" }}
        points={["Sechs Finanzierungswege im Vergleich", "Leasing organisiert durch Ökovolt", "IFB, AfA und EAG-Förderung berücksichtigt", "Unterlagen aus einer Hand"]}
        actions={[
          { label: "Finanzierung anfragen", href: "#anfrage" },
          { label: "Rate berechnen", href: "#rechner", icon: Calculator },
        ]}
      />

      <Kennzahlen
        frage="Welche Finanzierung passt zu einer Gewerbe-PV-Anlage?"
        zahlen={[
          { value: 22, suffix: " %", label: "Öko-Investitionsfreibetrag für PV", hinweis: "befristet 11/2025 bis 12/2026, sonst 15 %" },
          { text: "1 Mio. €", label: "höchste IFB-Bemessungsgrundlage pro Wirtschaftsjahr", hinweis: "Behaltefrist vier Jahre" },
          { value: 30, suffix: " %", label: "degressive AfA höchstens", hinweis: "beim Kauf, Kredit und Mietkauf" },
          { value: 6, label: "Wege: Kauf, Kredit, Leasing, Mietkauf, Contracting, PPA", hinweis: "interaktiv verglichen" },
        ]}
      >
        <p>
          <strong>Das hängt von Liquidität, Kreditrahmen, Bilanzpolitik und dem Wunsch nach Eigentum ab – nicht vom Dach.</strong> Beim Kauf und Kredit bleiben AfA und
          Investitionsfreibetrag bei Ihnen, Leasing schont den Kreditrahmen, Contracting und PPA kommen ganz ohne Investition aus.
        </p>
      </Kennzahlen>

      {/* Rechner */}
      <Dunkel id="rechner">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-end lg:gap-16">
          <SectionHeading
            dark
            eyebrow="Finanzierungsrechner"
            title={
              <>
                Trägt die Anlage <span className="ov-text-gradient-light">ihre Finanzierung selbst?</span>
              </>
            }
          />
          <Reveal delay={100}>
            <p className="ov-lead text-white/70">
              Stellen Sie Investition, Eigenmittel, einen Beispiel-Zinssatz und den jährlichen Vorteil aus Ihrer Wirtschaftlichkeitsrechnung ein. Der Rechner zeigt Jahresrate, Überschuss und
              die Wirkung des Investitionsfreibetrags.
            </p>
          </Reveal>
        </div>
        <Reveal dir="scale" className="mt-12">
          <FinanzierungsRechner />
        </Reveal>
      </Dunkel>

      {/* Vergleich */}
      <Section tone="sand" space="lg" id="vergleich" className="scroll-mt-24">
        <div className="mb-12 grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-end lg:gap-16">
          <SectionHeading eyebrow="Vergleich" title="Kauf, Leasing, Contracting oder PPA – was passt zu Ihnen?" />
          <Reveal delay={100}>
            <p className="ov-lead text-ink-600">Wählen Sie einen Finanzierungsweg: Eigentum, Liquidität, Bilanz, Steuer und Förderung auf einen Blick – mit schematischem Zahlungsprofil.</p>
          </Reveal>
        </div>
        <Reveal dir="scale">
          <FinanzModelle />
        </Reveal>
        <Hinweis ton="recht" titel="Keine Konditionen auf der Website" className="mt-6">
          <p>
            Zinssätze, Leasingfaktoren und Restwerte hängen von Bonität, Laufzeit, Sicherheiten und Marktzins ab und werden ausschließlich vom Finanzierungspartner festgelegt. Wir nennen
            deshalb hier keine Konditionen, sondern holen für Sie konkrete Angebote ein.
          </p>
        </Hinweis>
      </Section>

      {/* Steuer & Förderung */}
      <Bildband
        bild={{ src: "/Images/AT/service-b/drohne-solarpark-2.jpg", alt: "Gewerbedach voller Photovoltaikmodule von oben" }}
        eyebrow="Steuer & Förderung"
        titel="Drei Punkte, die vor der Entscheidung geklärt sein sollten"
        text="Förderung und Steuer wirken je nach Finanzierungsform unterschiedlich. Leasing organisieren wir mit Partnern – die technischen Unterlagen und die Wirtschaftlichkeitsrechnung kommen von uns."
        punkte={[
          { icon: Receipt, titel: "Investitionsfreibetrag", text: "PV ist eine ökologische Investition: befristet 22 % (11/2025–12/2026, sonst 15 %), Bemessung höchstens 1 Mio. € pro Wirtschaftsjahr, Behaltefrist vier Jahre." },
          { icon: Banknote, titel: "EAG-Investitionszuschuss", text: "Über die OeMAG-Fördercalls; das Förderansuchen muss vor Inbetriebnahme gestellt werden. Die Kategorie richtet sich nach der Engpassleistung." },
          { icon: FileText, titel: "Abschreibung", text: "Linear oder degressiv mit bis zu 30 % – beim Kauf, Kredit und Mietkauf bei Ihnen, beim Leasing in der Regel beim Leasinggeber." },
        ]}
      />

      {/* Ablauf */}
      <Section tone="white" space="lg">
        <SectionHeading eyebrow="Ablauf" title="Von der Variantenrechnung zur finanzierten Anlage" align="center" className="mb-14" />
        <Steps
          items={[
            { icon: Calculator, title: "Wirtschaftlichkeit", text: "Anlagenplanung nach Lastgang und Variantenrechnung für Kauf, Kredit, Leasing und Contracting." },
            { icon: Building2, title: "Finanzierungsweg", text: "Entscheidung mit Geschäftsführung und Steuerberatung; wir holen Angebote der Partner ein." },
            { icon: FileSignature, title: "Förderung & Vertrag", text: "Förderansuchen rechtzeitig vor Inbetriebnahme, Finanzierungsvertrag direkt mit dem Partner." },
            { icon: Wrench, title: "Errichtung & Übergabe", text: "Montage, Inbetriebnahme, Übernahmebestätigung für den Leasinggeber und laufende Wartung." },
          ]}
        />
      </Section>

      {/* Fachdetails */}
      <Section tone="sand" space="lg">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
          <SectionHeading eyebrow="Für Controlling & Einkauf" title="Vergleichstabelle und Unterlagen" lead="Die vollständige Übersicht für Geschäftsführung, Steuerberatung und Finanzierungspartner." />
          <Fachdetails
            items={[
              {
                titel: "Kauf, Kredit, Leasing, Mietkauf und Contracting im Vergleich",
                kurz: "Acht Kriterien, fünf Wege",
                icon: Scale,
                inhalt: (
                  <Tabelle
                    kopf={VERGLEICH_KOPF}
                    zeilen={VERGLEICH}
                    kompakt
                    quelle="Orientierung, Stand September 2026. Keine Steuer-, Rechts- oder Finanzierungsberatung – maßgeblich sind Vertrag, UGB/IFRS und Ihre Steuerberatung."
                  />
                ),
              },
              {
                titel: "Diese Unterlagen braucht der Finanzierungspartner",
                kurz: "Checkliste für Bank und Leasinggeber",
                icon: FileText,
                inhalt: (
                  <>
                    <ul className="grid gap-2.5 sm:grid-cols-2">
                      {UNTERLAGEN.map((u) => (
                        <li key={u} className="flex gap-2.5 rounded-2xl bg-sand-50 p-3.5 text-[14.5px] leading-snug text-ink-700 ring-1 ring-ink-200/60">
                          <FileText aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-ov-600" />
                          {u}
                        </li>
                      ))}
                    </ul>
                    <p className="mt-4 text-[14px] leading-relaxed text-ink-500">Die technischen Unterlagen und die Wirtschaftlichkeitsrechnung stellen wir zusammen.</p>
                  </>
                ),
              },
              {
                titel: "Gemeinden und öffentliche Hand",
                kurz: "Haushalt, Darlehen, Beteiligung",
                icon: Landmark,
                inhalt: (
                  <p className="text-[15.5px] leading-relaxed text-ink-700">
                    Gemeinden finanzieren meist aus dem Haushalt, über Darlehen oder über Beteiligungsmodelle mit Bürgerinnen und Bürgern. Leasing und Contracting sind möglich, müssen aber
                    haushaltsrechtlich und gegenüber der Gemeindeaufsicht geprüft werden.
                  </p>
                ),
              },
            ]}
          />
        </div>
      </Section>

      <AnfrageSektion
        tone="white"
        titel="Finanzierung anfragen"
        lead="Nennen Sie uns Projekt und bevorzugte Finanzierungsform. Wir melden uns mit einer Variantenrechnung und holen Angebote unserer Partner ein."
        schritte={["Sie beschreiben Projekt und Wunsch.", "Wir rechnen Varianten und sagen, welche Unterlagen nötig sind.", "Sie erhalten Angebote der Finanzierungspartner zum Vergleich."]}
        formular={{
          betreff: "Finanzierung / Leasing",
          thema: "Photovoltaik",
          titel: "Anfrage Finanzierung",
          absenden: "Finanzierung anfragen",
          felder: [
            { name: "form", label: "Bevorzugte Finanzierung", typ: "auswahl", pflicht: true, optionen: ["Leasing", "Bankkredit", "Mietkauf", "Contracting / PPA", "Kauf aus Eigenmitteln", "Noch offen – bitte vergleichen"] },
            { name: "anlagengroesse", label: "Geplante Anlagengröße", typ: "zahl", einheit: "kWp", placeholder: "z. B. 300" },
            { name: "investition", label: "Geschätztes Investitionsvolumen", typ: "zahl", einheit: "€", placeholder: "falls bekannt" },
            { name: "status", label: "Projektstand", typ: "auswahl", optionen: ["Idee / erste Überlegung", "Angebot von Ökovolt liegt vor", "Angebot eines anderen Errichters liegt vor", "Förderzusage liegt vor"] },
            { name: "rechtsform", label: "Rechtsform", typ: "auswahl", optionen: ["GmbH / AG", "Einzelunternehmen / Personengesellschaft", "Land- und Forstwirtschaft", "Gemeinde / öffentliche Hand", "Verein / Genossenschaft"] },
          ],
        }}
      />

      <FaqSektion items={FAQ} titel="Finanzierung & Leasing – häufige Fragen" lead="Allgemeine Informationen, keine Steuer- oder Finanzierungsberatung." tone="sand" />

      <Querverweise pfad={PFAD} ueberschrift="Mehr zu Wirtschaftlichkeit und Förderung" />

      <Abschluss
        links={[
          { href: "/ratgeber/photovoltaik-leasing", art: "Ratgeber", titel: "Photovoltaik-Leasing" },
          { href: "/ratgeber/investitionsfreibetrag-photovoltaik", art: "Ratgeber", titel: "Investitionsfreibetrag für PV" },
          { href: "/ratgeber/eag-investitionszuschuss", art: "Ratgeber", titel: "EAG-Investitionszuschuss" },
          { href: "/ratgeber/photovoltaik-mieten-oder-kaufen", art: "Ratgeber", titel: "Kaufen, leasen oder Contracting?" },
          { href: "/ratgeber/ppa-oesterreich", art: "Ratgeber", titel: "PPA in Österreich" },
          { href: "/forderungen/steuerlich", art: "Förderung", titel: "Steuerliche Vorteile" },
          { href: "/gewerbe", art: "Lösung", titel: "Photovoltaik für Gewerbe & Industrie" },
          { href: "/service/energieberatung", art: "Service", titel: "Energieberatung" },
        ]}
        quellen={[
          { titel: "WKO – Investitionsfreibetrag (inkl. befristeter Erhöhung)", href: "https://www.wko.at/steuern/investitionsfreibetrag" },
          { titel: "Parlament – Nationalrat verdoppelt Investitionsfreibetrag vorübergehend (PK 0901, 15.10.2025)", href: "https://www.parlament.gv.at/aktuelles/pk/jahr_2025/pk0901" },
          { titel: "EAG-Abwicklungsstelle – Investitionszuschuss Photovoltaik & Speicher", href: "https://www.eag-abwicklungsstelle.at/wissen/investitionszuschuss-photovoltaik-und-speicher/" },
          { titel: "Erneuerbaren-Ausbau-Gesetz § 56 – Investitionszuschüsse Photovoltaik", href: "https://www.jusline.at/gesetz/eag/paragraf/56" },
        ]}
      />

      <CtaBand
        eyebrow="Finanzierung"
        title="Die beste Anlage ist die, die sich auch finanzieren lässt."
        text="Wir rechnen Kauf, Kredit, Leasing und Contracting für Ihr Projekt durch und organisieren die Finanzierung mit unseren Partnern – transparent und ohne Konditionen aus der Werbung."
        primary={{ label: "Finanzierung anfragen", href: "#anfrage" }}
        secondary={{ label: "Rechner öffnen", href: "#rechner", icon: Calculator }}
      />
    </div>
  );
}
