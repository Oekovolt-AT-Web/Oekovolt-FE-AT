// src/app/ratgeber/solaranlage-kosten/page.js

import { Euro } from "lucide-react";

import ArtikelLayout from "@/components/Ratgeber/ArtikelLayout";
import {
  Abschnitt,
  Checkliste,
  Kennzahlband,
  KurzFazit,
  LinkKarten,
  Merkkasten,
  Prosa,
  Tabelle,
  TextLink,
} from "@/components/Ratgeber/Bausteine";
import KostenAufteilung from "@/components/Ratgeber/KostenAufteilung";
import Faq from "@/components/ui/Faq";
import Solarrechner from "@/components/Solarrechner/Rechner";
import { ANNAHMEN, preisProKwp } from "@/data/solarrechner";
import { VERGUETUNG, ct } from "@/data/einspeiseverguetung";
import { WALLBOX, spanne } from "@/data/wallbox";
import { artikelNachSlug, artikelPfad } from "@/lib/ratgeber";
import { berechne } from "@/lib/solarrechner";

const BASE_URL = "https://www.oekovolt.de";
const SLUG = "solaranlage-kosten";
const artikel = artikelNachSlug(SLUG);
const PAGE_URL = `${BASE_URL}${artikelPfad(SLUG)}`;

// Preise sind deutschlandspezifisch (Nullsteuersatz, EEG) -> kein hreflang.
export const metadata = {
  title: "Was kostet eine Solaranlage 2026? Preise je kWp | Ökovolt",
  description: artikel.description,
  keywords: artikel.keywords,
  alternates: { canonical: PAGE_URL },
  robots: { index: true, follow: true },
  openGraph: {
    type: "article",
    url: PAGE_URL,
    siteName: "Ökovolt Deutschland",
    title: artikel.title,
    description: artikel.description,
    publishedTime: artikel.veroeffentlicht,
    modifiedTime: artikel.aktualisiert,
    images: [{ url: `${BASE_URL}/og-image.jpg`, width: 1200, height: 630, alt: artikel.title }],
  },
  twitter: {
    card: "summary_large_image",
    title: artikel.title,
    description: artikel.description,
    images: [`${BASE_URL}/og-image.jpg`],
  },
};

const TOC = [
  { id: "kurz", label: "Das Wichtigste in Kürze" },
  { id: "preise", label: "Preise nach Anlagengröße" },
  { id: "bestandteile", label: "Woraus sich der Preis ergibt" },
  { id: "speicher", label: "Was kostet ein Stromspeicher?" },
  { id: "zusatz", label: "Mögliche Zusatzkosten" },
  { id: "laufend", label: "Laufende Kosten" },
  { id: "steuer", label: "Steuern: der Nullsteuersatz" },
  { id: "rechner", label: "Ihr Fall durchgerechnet" },
  { id: "sparen", label: "Worauf Sie achten sollten" },
  { id: "faq", label: "Häufige Fragen" },
];

// Preistabelle direkt aus derselben Quelle wie der Solarrechner – so kann
// der Artikel nie andere Zahlen zeigen als das Rechenwerkzeug.
const GROESSEN = [5, 8, 10, 15, 20, 30];
const eur = (n) => Math.round(n).toLocaleString("de-DE") + " €";
const rund = (n, s = 100) => Math.round(n / s) * s;

// Beispiel für die Amortisationsangabe – aus dem Rechenkern, nicht geschätzt.
const BSP_OHNE = berechne({ kwp: 10, ausrichtung: "sued", neigung: "mittel", verbrauch: 4500, speicherKwh: 0 });
const BSP_MIT = berechne({ kwp: 10, ausrichtung: "sued", neigung: "mittel", verbrauch: 4500, speicherKwh: 8 });
const jahre = (r) => (r.amortisationJahre ? r.amortisationJahre.toFixed(0) : "über 20");

const FAQ = [
  {
    q: "Was kostet eine Solaranlage mit 10 kWp?",
    a: `Eine schlüsselfertige 10-kWp-Anlage liegt 2026 bei rund ${eur(10 * preisProKwp(10))} inklusive Montage, Wechselrichter und Anmeldung. Mit einem 8-kWh-Stromspeicher kommen etwa ${eur(8 * ANNAHMEN.speicherPreisProKwh)} dazu. Der genaue Preis hängt von Dachform, Eindeckung, Zugänglichkeit und dem Zustand der Elektroinstallation ab.`,
  },
  {
    q: "Warum wird der Preis je kWp bei größeren Anlagen günstiger?",
    a: "Ein erheblicher Teil der Kosten fällt unabhängig von der Anlagengröße an: Gerüst, Anfahrt, Planung, Zählerschrank, Anmeldung beim Netzbetreiber. Diese Fixkosten verteilen sich bei einer größeren Anlage auf mehr Kilowatt-Peak, dadurch sinkt der Preis je kWp spürbar.",
  },
  {
    q: "Fällt beim Kauf einer PV-Anlage Umsatzsteuer an?",
    a: "Für Photovoltaikanlagen auf und an Wohngebäuden gilt seit dem 1. Januar 2023 der Nullsteuersatz nach § 12 Abs. 3 UStG: Auf Lieferung und Installation fallen 0 % Umsatzsteuer an. Das gilt auch für einen Stromspeicher. Die genannten Preise sind damit Endpreise.",
  },
  {
    q: "Welche laufenden Kosten hat eine Photovoltaikanlage?",
    a: `Kalkulieren Sie rund ${ANNAHMEN.betriebskostenProKwp} € je kWp und Jahr für Versicherung, Wartung, Zählermiete und Rücklagen. Bei einer 10-kWp-Anlage sind das etwa ${eur(10 * ANNAHMEN.betriebskostenProKwp)} im Jahr. Module selbst sind wartungsarm, der Wechselrichter wird typischerweise einmal in der Laufzeit getauscht.`,
  },
  {
    q: "Lohnt sich die günstigste Anlage?",
    a: "Selten. Der Unterschied zwischen einem günstigen und einem sehr günstigen Angebot liegt meist nicht bei den Modulen, sondern bei Unterkonstruktion, Kabelquerschnitten, Überspannungsschutz und der Sorgfalt der Montage. Reparaturen an einem undichten Dach kosten mehr, als beim Angebot gespart wurde.",
  },
  {
    q: "Wie lange dauert es, bis sich die Anlage rechnet?",
    a: `Mit heutigen Preisen und ${ct(VERGUETUNG.saetze[0].teileinspeisung)} ct/kWh Einspeisevergütung amortisiert sich eine gut ausgelegte Anlage typischerweise nach 10 bis 14 Jahren. Unser Rechenbeispiel (10 kWp, 4.500 kWh Verbrauch, Süddach) kommt ohne Speicher auf rund ${jahre(BSP_OHNE)} und mit 8-kWh-Speicher auf rund ${jahre(BSP_MIT)} Jahre. Da die Anlage 25 Jahre und länger läuft, bleibt danach ein deutlicher Überschuss.`,
  },
  {
    q: "Gibt es 2026 noch Förderung für Solaranlagen?",
    a: "Einen bundesweiten Investitionszuschuss für private Dachanlagen gibt es nicht. Neben Nullsteuersatz und EEG-Vergütung fördern einzelne Länder und Kommunen Speicher oder Anlagen; zinsgünstige Kredite bietet die KfW (Programm 270). Aktuelle Programme finden Sie auf unserer Seite zur Landesförderung.",
  },
];

export default function SolaranlageKostenPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${PAGE_URL}/#article`,
        headline: artikel.title,
        description: artikel.description,
        inLanguage: "de-DE",
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

  const gesamt10 = 10 * preisProKwp(10);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <ArtikelLayout
        artikel={artikel}
        toc={TOC}
        titel={
          <>
            Was kostet eine <span className="ov-text-gradient">Solaranlage</span> 2026?
          </>
        }
        badge={
          <div className="flex items-center gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-ov-500 text-white">
              <Euro aria-hidden="true" className="h-6 w-6" />
            </span>
            <div>
              <p className="ov-num font-display text-[22px] font-extrabold leading-none text-ink-900">~ {eur(gesamt10)}</p>
              <p className="mt-1 text-[12.5px] leading-snug text-ink-500">für 10 kWp schlüsselfertig, 0 % USt.</p>
            </div>
          </div>
        }
        seitenCta={{ titel: "Rechnet sich das für Sie?", text: "Mit denselben Preisen: Amortisation und 20-Jahres-Cashflow für Ihr Dach.", href: "/solarrechner", label: "Zum Solarrechner" }}
        cta={{
          title: "Ein Festpreis statt Richtwerte – für Ihr Dach.",
          text: "Wir sehen uns Dach, Zählerschrank und Verschattung an und machen daraus ein transparentes Angebot, in dem Gerüst, Elektroarbeiten und Anmeldung bereits enthalten sind.",
          primary: { label: "Angebot anfragen", href: "/angebot" },
          secondary: { label: "Kosten durchrechnen", href: "/solarrechner" },
        }}
      >
        <KurzFazit
          punkte={[
            `Eine schlüsselfertige Anlage kostet 2026 je nach Größe rund ${eur(preisProKwp(30))} bis ${eur(preisProKwp(5))} je kWp.`,
            `Für eine typische 10-kWp-Anlage sind das etwa ${eur(gesamt10)} inklusive Montage und Anmeldung.`,
            `Ein Stromspeicher kostet gemeinsam installiert rund ${ANNAHMEN.speicherPreisProKwh.toLocaleString("de-DE")} € je kWh Kapazität.`,
            "Auf Wohngebäuden fällt seit 2023 keine Umsatzsteuer an – die genannten Preise sind Endpreise.",
            `Laufend kommen etwa ${ANNAHMEN.betriebskostenProKwp} € je kWp und Jahr für Versicherung, Wartung und Zähler dazu.`,
          ]}
        />

        <Abschnitt id="preise" titel="Was kostet eine Photovoltaikanlage nach Größe?">
          <Prosa>
            <p>
              <strong>Eine Photovoltaikanlage kostet 2026 schlüsselfertig rund {eur(preisProKwp(30))} bis {eur(preisProKwp(5))} je Kilowatt-Peak – je größer
              die Anlage, desto günstiger das einzelne kWp.</strong> Die folgenden Werte sind Richtwerte für eine Anlage auf einem Schrägdach mit normaler
              Zugänglichkeit.
            </p>
          </Prosa>
          <Tabelle
            caption="Richtpreise für Photovoltaikanlagen nach Anlagengröße, Stand September 2026"
            kopf={["Anlagengröße", "Preis je kWp", "Gesamtpreis", "Dachfläche"]}
            zeilen={GROESSEN.map((g) => [`${g} kWp`, eur(preisProKwp(g)), eur(rund(g * preisProKwp(g))), `ca. ${g * ANNAHMEN.qmProKwp} m²`])}
            hervorheben={2}
            markierteZeile={2}
            minBreite={560}
            fussnote="Richtwerte ohne Stromspeicher, inklusive Module, Wechselrichter, Unterkonstruktion, Montage, Gerüst und Anmeldung. Endpreise – auf Wohngebäuden fällt keine Umsatzsteuer an. Stand: September 2026."
          />
        </Abschnitt>

        <Abschnitt id="bestandteile" titel="Woraus sich der Preis zusammensetzt">
          <Prosa>
            <p>
              Viele rechnen mit dem Modulpreis und wundern sich über das Angebot. Tatsächlich machen die Module nur etwa ein Drittel aus – der Rest ist
              Technik rundherum und Arbeit auf dem Dach. So verteilt sich der Preis einer 10-kWp-Anlage typischerweise:
            </p>
          </Prosa>
          <KostenAufteilung gesamt={gesamt10} />
        </Abschnitt>

        <Abschnitt id="speicher" titel="Was kostet ein Stromspeicher?">
          <Prosa>
            <p>
              Rechnen Sie mit rund {ANNAHMEN.speicherPreisProKwh.toLocaleString("de-DE")} € je Kilowattstunde Kapazität, wenn der Speicher gemeinsam mit
              der Anlage installiert wird. Ein 8-kWh-Speicher kostet damit etwa {eur(8 * ANNAHMEN.speicherPreisProKwh)}. Als Faustregel genügt rund
              1 kWh Speicher je 1.000 kWh Jahresverbrauch – ein deutlich größerer Speicher wird im Winter kaum voll.
            </p>
          </Prosa>
          <Tabelle
            caption="Richtpreise für Stromspeicher"
            kopf={["Speichergröße", "Passend für", "Richtpreis"]}
            zeilen={[
              ["5 kWh", "2–3 Personen, ca. 3.000 kWh", eur(5 * ANNAHMEN.speicherPreisProKwh)],
              ["8 kWh", "4 Personen, ca. 4.500 kWh", eur(8 * ANNAHMEN.speicherPreisProKwh)],
              ["10 kWh", "mit E-Auto, ca. 7.000 kWh", eur(10 * ANNAHMEN.speicherPreisProKwh)],
              ["15 kWh", "mit Wärmepumpe, ab 9.000 kWh", eur(15 * ANNAHMEN.speicherPreisProKwh)],
            ]}
            hervorheben={2}
            minBreite={480}
            fussnote="Gemeinsam mit der PV-Anlage installiert, Endpreise. Eine spätere Nachrüstung ist meist teurer (eigener Batteriewechselrichter, zweiter Termin)."
          />
          <Merkkasten variant="tipp" titel="Der Speicher rechnet sich über den Eigenverbrauch">
            Er verschiebt Kilowattstunden von {ct(VERGUETUNG.saetze[0].teileinspeisung)} ct Einspeisevergütung auf rund{" "}
            {String(ANNAHMEN.strompreis * 100).replace(".", ",")} ct gesparten Netzstrom. Welche Größe sich lohnt, zeigt der{" "}
            <TextLink href="/rechner/stromspeicher">Stromspeicher-Rechner</TextLink>; Hintergründe im{" "}
            <TextLink href="/ratgeber/einspeiseverguetung-2026">Ratgeber zur Einspeisevergütung</TextLink>.
          </Merkkasten>
        </Abschnitt>

        <Abschnitt id="zusatz" titel="Mögliche Zusatzkosten">
          <Prosa>
            <p>
              Nicht jede Position fällt bei jedem Haus an. Ein seriöses Angebot nennt sie trotzdem – damit es später keine Überraschungen gibt.
            </p>
          </Prosa>
          <Tabelle
            caption="Typische Zusatzkosten bei Photovoltaikanlagen"
            kopf={["Position", "Wann nötig?", "Richtwert"]}
            zeilen={[
              ["Neuer Zählerschrank", "Altbau, kein Platz für Zähler und Schutzorgane", "1.500–3.000 €"],
              ["Notstrom / Ersatzstrom", "Versorgung bei Netzausfall gewünscht", "500–2.000 €"],
              ["Wallbox inkl. Installation", "E-Auto vorhanden oder geplant", spanne([WALLBOX.gesamtVon, WALLBOX.gesamtBis])],
              ["Energiemanagementsystem", "Wallbox, Wärmepumpe oder dynamischer Tarif", "300–1.000 €"],
              ["Leistungsoptimierer", "Teilverschattung durch Gauben, Kamine, Bäume", "50–80 € je Modul"],
            ]}
            minBreite={560}
            fussnote="Richtwerte für Einfamilienhäuser, Stand September 2026. Die tatsächlichen Kosten klären wir beim Vor-Ort-Termin."
          />
        </Abschnitt>

        <Abschnitt id="laufend" titel="Laufende Kosten nicht vergessen">
          <Prosa>
            <p>
              Eine PV-Anlage ist wartungsarm, aber nicht kostenlos im Betrieb. Realistisch sind etwa {ANNAHMEN.betriebskostenProKwp} € je kWp und Jahr –
              bei 10 kWp also rund {eur(10 * ANNAHMEN.betriebskostenProKwp)} jährlich. Darin stecken die Photovoltaikversicherung, Zählermiete,
              gelegentliche Wartung und eine Rücklage für den Wechselrichtertausch. Im{" "}
              <TextLink href="/solarrechner">Solarrechner</TextLink> sind diese Kosten bereits abgezogen.
            </p>
          </Prosa>
          <Kennzahlband
            wert={`~${eur(10 * ANNAHMEN.betriebskostenProKwp)}`}
            titel="Betriebskosten pro Jahr bei 10 kWp"
            text="Versicherung, Zählermiete, Wartung und Rücklage für einen Wechselrichtertausch nach 12–15 Jahren – das entspricht rund 2 % der Investition."
          />
        </Abschnitt>

        <Abschnitt id="steuer" titel="Steuern: der Nullsteuersatz">
          <Prosa>
            <p>
              <strong>Seit dem 1. Januar 2023 gilt für Photovoltaikanlagen auf und an Wohngebäuden ein Umsatzsteuersatz von 0 % (§ 12 Abs. 3 UStG).</strong>{" "}
              Das betrifft Module, Wechselrichter, Speicher und Montage. Zusätzlich sind Einnahmen aus Anlagen bis 30 kWp je Wohn- oder Gewerbeeinheit nach
              § 3 Nr. 72 EStG von der Einkommensteuer befreit – Sie müssen dafür keine Gewinnermittlung abgeben. Was das konkret bedeutet, haben wir
              unter <TextLink href="/forderungen/steuerlich">steuerliche Vorteile</TextLink> zusammengefasst.
            </p>
          </Prosa>
        </Abschnitt>

        <Abschnitt id="rechner" titel="Rechnen Sie Ihren Fall durch">
          <Prosa>
            <p>
              Die Tabelle zeigt den Preis. Ob sich die Anlage rechnet, hängt an Ihrem Verbrauch und Ihrem Dach. Der Rechner nutzt exakt dieselben Preise
              wie oben und zeigt den Cashflow über 20 Jahre.
            </p>
          </Prosa>
          <div className="mt-8 lg:-mr-8 xl:-mr-16">
            <Solarrechner className="shadow-xl" />
          </div>
        </Abschnitt>

        <Abschnitt id="sparen" titel="Worauf Sie beim Angebot achten sollten">
          <Checkliste
            punkte={[
              "Ist die Anlage auf Ihren Verbrauch ausgelegt – oder einfach auf jedes freie Stück Dach?",
              "Sind Gerüst, Zählerschrank und Netzanmeldung im Preis enthalten oder tauchen sie später auf?",
              "Welche Garantien gelten auf Module, Wechselrichter und Montage – und wer ist im Schadensfall Ansprechpartner?",
              "Wird die Dachstatik geprüft, bevor montiert wird?",
              "Gibt es einen festen Termin für die Inbetriebnahme? Der Vergütungssatz hängt am Inbetriebnahmedatum.",
              "Ist die Anlage für Solarspitzengesetz und § 14a EnWG vorbereitet (Smart Meter, steuerbare Einspeisung)?",
            ]}
          />
        </Abschnitt>

        <Abschnitt id="faq" titel="Häufige Fragen zu den Kosten">
          <Faq items={FAQ} />
        </Abschnitt>

        <Abschnitt id="passend" titel="Passend dazu">
          <LinkKarten
            links={[
              { href: "/solarrechner", titel: "Solarrechner", text: "Ertrag, Ersparnis und Amortisation für Ihr Dach." },
              { href: "/ratgeber/einspeiseverguetung-2026", titel: "Einspeisevergütung 2026", text: "Was Sie pro eingespeister Kilowattstunde bekommen." },
              { href: "/service/finanzierung", titel: "Finanzierung", text: "PV-Anlage ohne Eigenkapital finanzieren." },
              { href: "/forderungen/landesforderungen", titel: "Förderung nach Bundesland", text: "Welche Zuschüsse zusätzlich möglich sind." },
            ]}
          />
        </Abschnitt>
      </ArtikelLayout>
    </>
  );
}
