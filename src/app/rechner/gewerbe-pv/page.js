// src/app/rechner/gewerbe-pv/page.js – Gewerbe-PV-Rechner „Was bringt Ihr Hallendach?“

import Link from "next/link";
import { CalendarClock, MapPinned, Scale } from "lucide-react";
import RechnerSeite, { rechnerMetadata } from "@/components/Rechner/RechnerSeite";
import SectionHeading from "@/components/ui/SectionHeading";
import GewerbePVRechner from "@/components/RechnerGewerbe/GewerbePVRechner";
import { standortGruppen, pvgisStand } from "@/components/RechnerGewerbe/standorte";
import { GEWERBE_PV } from "@/lib/rechner/gewerbepv";
import { fmt } from "@/lib/rechner/annahmen";
import { ANNAHMEN, PREISQUELLEN } from "@/data/solarrechner";
import { VERGUETUNG } from "@/data/einspeiseverguetung";

const PFAD = "/rechner/gewerbe-pv";

export const metadata = rechnerMetadata({
  pfad: PFAD,
  title: "PV-Rechner für Unternehmen: Ertrag & Amortisation | Ökovolt",
  description:
    "Gewerbe-PV-Rechner für Österreich: Dachfläche, Standort, Schichtbetrieb – Eigenverbrauch, Amortisation, IRR, EAG-Zuschuss und IFB stündlich simuliert.",
  keywords: ["Gewerbe PV Rechner", "Photovoltaik Hallendach Rechner", "PV Wirtschaftlichkeit Gewerbe Österreich", "PV Amortisation Betrieb", "Investitionsfreibetrag Photovoltaik Rechner", "EAG Investitionszuschuss Rechner"],
});

const FAQ = [
  {
    q: "Wie viel kWp passen auf mein Hallendach?",
    a: `Als Richtwert brauchen aufgeständerte Ost-West-Anlagen auf dem Flachdach rund ${fmt(ANNAHMEN.qmProKwpFlachdach)} m² je kWp, nach Süden aufgeständerte Reihen wegen der größeren Abstände rund 10 m², dachparallele Module auf Trapezblech rund ${fmt(ANNAHMEN.qmProKwp)} m². Eine 5.000-m²-Halle trägt damit – je nach Dachart – etwa 500 bis 1.000 kWp. Abzuziehen sind Randabstände nach OVE R 11-1, Lichtkuppeln, Lüftungsgeräte und Wartungswege; die Statik muss die Zusatzlast aufnehmen.`,
  },
  {
    q: "Wie rechnet der Gewerbe-PV-Rechner den Eigenverbrauch?",
    a: "Er simuliert ein ganzes Jahr in Stundenschritten: die Erzeugung aus PVGIS-Daten Ihres Standorts, verteilt auf sonnige und trübe Tage, und die Last Ihres Betriebs nach Betriebstagen und Schichtmodell mit Grundlast außerhalb der Betriebszeit. Eigenverbrauch ist, was zeitgleich verbraucht oder über einen Speicher verschoben wird. Mit Ihrem echten Viertelstunden-Lastgang vom Netzbetreiber wird die Rechnung genauer.",
  },
  {
    q: "Welchen Strompreis soll ich einsetzen?",
    a: "Den vermeidbaren Arbeitspreis netto: Energiepreis, Netz-Arbeitspreis, Netzverlustentgelt und Abgaben je Kilowattstunde. Nicht dazu gehören der Leistungspreis und fixe Pauschalen, denn die senkt Photovoltaik kaum. Der Rechner schlägt einen Richtwert nach Jahresverbrauch auf Basis der Eurostat-Preise für österreichische Nicht-Haushalte vor; Ihren tatsächlichen Wert finden Sie auf der Strom- und Netzrechnung.",
  },
  {
    q: "Wie werden EAG-Investitionszuschuss und Investitionsfreibetrag berücksichtigt?",
    a: `Der EAG-Investitionszuschuss wird mit den Höchstsätzen 2026 nach Kategorie A bis D abgezogen – er wird nur in Fördercalls nach Budget vergeben, der nächste läuft laut Verordnung von ${ANNAHMEN.eagInvestitionszuschuss.naechsterCall}. Der Investitionsfreibetrag von 22 % für Öko-Investitionen gilt für Anschaffungen bis 31.12.2026; der Rechner weist den Steuereffekt mit 23 % Körperschaftsteuer separat aus und berücksichtigt ihn im ersten Jahr des Cashflows. Bei Leasing steht der IFB meist dem Leasinggeber zu.`,
  },
  {
    q: "Was bedeuten TOR-Typ und Netzanschluss für meine Anlage?",
    a: "Nach den TOR Stromerzeugungsanlagen der E-Control gilt eine Anlage ab 0,8 kW bis unter 250 kW als Typ A, ab 250 kW bis unter 35 MW als Typ B. Ab Typ B steigen die Anforderungen an Blindleistung, Fernsteuerbarkeit und Nachweise; meist ist ein Parkregler nötig. Maßgeblich ist die Maximalkapazität der Wechselrichter – der Rechner setzt vereinfacht die Modulleistung an. Die Netzebene legt der Netzbetreiber im Anschlusskonzept fest.",
  },
  {
    q: "Lohnt sich ein Speicher im Betrieb?",
    a: "Für den reinen Eigenverbrauch nur, wenn regelmäßig Überschuss entsteht und abends oder am Wochenende Last da ist – etwa bei Kühlung, Hotellerie oder Landwirtschaft. Häufig rechnet sich ein Gewerbespeicher erst zusammen mit Peak Shaving, also dem Kappen von Lastspitzen für einen niedrigeren Leistungspreis, oder als Notstromreserve. Das bewertet der Peak-Shaving-Rechner gesondert.",
  },
];

export default function Page() {
  const standorte = standortGruppen();
  const pvgis = pvgisStand();
  return (
    <RechnerSeite
      pfad={PFAD}
      toolId="gewerbe-pv"
      breadcrumb="Gewerbe-PV-Rechner"
      eyebrow="Gewerbe-PV-Rechner"
      title={<>Gewerbe-PV-Rechner: <span className="ov-text-gradient-light">Größe, Ertrag, Amortisation</span></>}
      lead={<><span className="block font-display text-[1.15em] font-bold leading-snug text-white">Was bringt Ihr Hallendach?</span><span className="mt-3 block">Dachfläche, Standort und Schichtbetrieb eingeben – Eigenverbrauch, Amortisation, Rendite und Förderung für Ihren Betrieb in Österreich, stündlich über ein Jahr simuliert.</span></>}
      chips={["PVGIS-Ertrag für 37 Orte", "EAG-Zuschuss & IFB", "Kauf oder Leasing", "Tagesprofil Sommer/Winter"]}
      app={{
        name: "Ökovolt Gewerbe-PV-Rechner",
        description: "Berechnet Anlagengröße, Ertrag, Eigenverbrauch, Autarkie, Ersparnis, Amortisation, internen Zinsfuß und CO₂-Einsparung einer Photovoltaikanlage auf Gewerbe- und Hallendächern in Österreich.",
        featureList: ["Stündliche Jahressimulation mit Schichtmodell", "Standortgenauer Ertrag (PVGIS)", "EAG-Investitionszuschuss und Investitionsfreibetrag", "Kauf oder Leasing", "25-Jahres-Cashflow und IRR", "TOR-Typ und EAG-Kategorie"],
      }}
      rechner={<GewerbePVRechner standorte={standorte} startOrt="linz" />}
      erklaerung={
        <>
          <SectionHeading
            eyebrow="So rechnen wir"
            title="Der Wert einer Hallen-PV entsteht im eigenen Betrieb."
            lead={`Jede selbst genutzte Kilowattstunde ersetzt Netzstrom zum vollen Arbeitspreis – oft 15 bis 20 Cent netto. Eingespeist bringt sie derzeit rund ${fmt(VERGUETUNG.saetze[0].teileinspeisung)} Cent. Darum entscheidet das Zusammenspiel von Erzeugung und Last über die Rendite.`}
          />
          <ul className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              { icon: MapPinned, t: "Standortgenau", x: "Ertrag je Dachart aus PVGIS für 37 Orte in allen neun Bundesländern." },
              { icon: CalendarClock, t: "Schicht für Schicht", x: "8.760 Stunden mit Betriebstagen, Schichten und Grundlast." },
              { icon: Scale, t: "Förderung sauber getrennt", x: "EAG-Zuschuss in der Investition, IFB-Steuereffekt separat." },
            ].map(({ icon: Icon, t, x }) => (
              <li key={t} className="rounded-3xl bg-sand-50 p-5 ring-1 ring-ink-200/60">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-ov-600 ring-1 ring-ink-200">
                  <Icon aria-hidden="true" className="h-5 w-5" />
                </span>
                <p className="mt-4 font-display text-[16px] font-bold text-ink-900">{t}</p>
                <p className="mt-1 text-[14px] leading-relaxed text-ink-600">{x}</p>
              </li>
            ))}
          </ul>
          <div className="ov-prose mt-8 max-w-2xl">
            <p>
              Ein Betrieb mit zwei Schichten nutzt Solarstrom über den ganzen Tag, ein reiner Bürobetrieb nur werktags – und am Wochenende läuft die Anlage in den Überschuss. Deshalb überdimensionierte Anlagen nicht vorschnell verwerfen: Mit
              {" "}<Link href="/service/direktvermarktung">Direktvermarktung</Link>, einer <Link href="/rechner/energiegemeinschaft">Energiegemeinschaft</Link> oder einem Speicher lässt sich der Überschuss verwerten.
            </p>
            <p>
              Die Finanzierungswege von Kauf über Leasing bis Contracting vergleicht unsere Seite <Link href="/service/finanzierung">Finanzierung</Link>; die Steuerseite erklärt den <Link href="/forderungen/steuerlich">Investitionsfreibetrag</Link>. Wie wir Hallendächer planen, zeigt <Link href="/gewerbe">Photovoltaik für Gewerbe</Link>.
            </p>
          </div>
        </>
      }
      annahmen={[
        ["PV-Ertrag", `PVGIS je Ort und Dachart`],
        ["Fläche je kWp: Ost-West / Süd / Trapez / Shed", `${fmt(ANNAHMEN.qmProKwpFlachdach)} / 10 / ${fmt(ANNAHMEN.qmProKwp)} / 10 m²`],
        ["Anlagenpreis netto, 100 kWp → 1 MWp", `${fmt(ANNAHMEN.preisProKwp.find((p) => p.kwp === 100).eur)} → ${fmt(ANNAHMEN.preisProKwp.at(-1).eur)} €/kWp`],
        ["Speicherpreis netto", `${fmt(ANNAHMEN.speicherPreise.at(-1).eur)} – ${fmt(ANNAHMEN.speicherPreise[2].eur)} €/kWh`],
        ["Arbeitspreis netto (Richtwert)", `${fmt(ANNAHMEN.strompreisGewerbe.at(-1).ct, 1)} – ${fmt(ANNAHMEN.strompreisGewerbe[0].ct)} ct/kWh`],
        ["Einspeiseerlös (ab 500 kWp)", `${fmt(VERGUETUNG.saetze[0].teileinspeisung, 1)} (${fmt(VERGUETUNG.saetze[2].teileinspeisung, 1)}) ct/kWh`],
        ["Betriebskosten", `${fmt(ANNAHMEN.betriebskostenGewerbe.at(-1).eur)} – ${fmt(ANNAHMEN.betriebskostenGewerbe[1].eur)} €/kWp und Jahr`],
        ["Strompreis · Degradation", `+${fmt(ANNAHMEN.strompreisSteigerung * 100)} %/Jahr · −${fmt(ANNAHMEN.degradationProJahr * 100, 1)} %/Jahr`],
        ["IFB · KöSt", `${fmt(ANNAHMEN.ifb.satzOeko * 100)} % · ${fmt(ANNAHMEN.ifb.koest * 100)} %`],
        ["Betrachtung (netto, vor Steuern)", `${GEWERBE_PV.jahre} Jahre`],
        ["CO₂-Substitution", `${fmt(ANNAHMEN.co2KgProKwh * 1000, 1)} g/kWh`],
      ]}
      quellen={[
        { name: `${pvgis.quelle}, abgerufen ${pvgis.abgerufen.split("-").reverse().join(".")}`, url: "https://re.jrc.ec.europa.eu/pvg_tools/de/" },
        PREISQUELLEN[0],
        PREISQUELLEN[1],
        PREISQUELLEN.find((q) => q.name.startsWith("Eurostat")),
        { name: "OeMAG – Marktpreis", url: VERGUETUNG.quelle.url },
        { name: `EAG-Investitionszuschüsseverordnung-Strom (${ANNAHMEN.eagInvestitionszuschuss.quelle})`, url: "https://www.oem-ag.at/fileadmin/user_upload/Dokumente/gesetze/EAG-IZV_Fassung__vom_19.01.2026.pdf" },
        { name: "WKO – Investitionsfreibetrag", url: "https://www.wko.at/steuern/investitionsfreibetrag" },
        { name: "E-Control – TOR Stromerzeugungsanlagen", url: "https://www.e-control.at/marktteilnehmer/strom/marktregeln/tor" },
      ]}
      faq={FAQ}
      faqTitel="Gewerbe-PV: Fragen & Antworten"
      cta={{
        title: "Vom Rechenergebnis zur geplanten Hallen-PV.",
        text: "Wir prüfen Statik, Brandschutz nach OVE R 11-1, Lastgang und Netzanschluss und machen daraus ein belastbares Angebot – mit eigenem Parkregler für Anlagen ab 250 kW, in ganz Österreich.",
        primary: { label: "Angebot anfragen", href: "/angebot" },
        secondary: { label: "Photovoltaik für Gewerbe", href: "/gewerbe" },
      }}
    />
  );
}
