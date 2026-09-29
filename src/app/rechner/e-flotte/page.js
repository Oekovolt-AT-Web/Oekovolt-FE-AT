// src/app/rechner/e-flotte/page.js

import Link from "next/link";
import { BadgePercent, Receipt, Route, UserRound } from "lucide-react";
import { rechnerMetadata } from "@/components/Rechner/RechnerSeite";
import FlotteLadeSeite from "@/components/RechnerGewerbe/FlotteLadeSeite";
import FlotteRechner from "@/components/RechnerGewerbe/FlotteRechner";
import SectionHeading from "@/components/ui/SectionHeading";
import { CO2, FLOTTE, KLASSEN, MAUT } from "@/lib/rechner/eflotte";
import { fmt } from "@/lib/rechner/annahmen";

const PFAD = "/rechner/e-flotte";

export const metadata = rechnerMetadata({
  pfad: PFAD,
  title: "E-Flotte-Rechner: Firmenflotte auf Elektro | Ökovolt",
  description:
    "E-Flotte-Rechner für Betriebe in Österreich: Gesamtkosten Diesel vs. Elektro mit Vorsteuer, Sachbezug, IFB, GO-Maut und PV-Strom – plus CO₂ und Ladepunkte.",
  keywords: [
    "E-Flotte Rechner",
    "Firmenflotte Elektro umstellen",
    "TCO E-Auto Firmenwagen Österreich",
    "E-Transporter Kosten Vergleich",
    "Sachbezug E-Auto 2027",
    "Vorsteuerabzug Elektroauto",
    "E-Lkw Maut Österreich",
  ],
});

const FAQ = [
  {
    q: "Lohnt sich die Umstellung der Firmenflotte auf Elektro in Österreich?",
    a: "Für die meisten Pkw- und Transporterflotten ja. Drei Effekte wirken zusammen: Strom im Betrieb kostet je 100 km deutlich weniger als Diesel, die Wartung ist günstiger, und bei Pkw kommen Vorsteuerabzug und NoVA-Befreiung dazu. Dazu kommt der Öko-Investitionsfreibetrag von 22 % bis Ende 2026. Knapper wird es bei schweren Lkw mit wenigen Kilometern – dort entscheiden Laufleistung, GO-Maut-Anteil und Anschaffungspreis.",
  },
  {
    q: "Warum ist ein E-Firmenwagen oft schon bei der Anschaffung günstiger?",
    a: "Weil Unternehmen bei Pkw mit Verbrennungsmotor keine Vorsteuer abziehen dürfen – Anschaffung, Treibstoff und Wartung zählen brutto, zusätzlich fällt die NoVA an. Bei E-Pkw ist die Vorsteuer bis 40.000 € brutto voll abziehbar, zwischen 40.000 und 80.000 € höchstens 6.666,67 €, darüber gar nicht. Auch der Ladestrom ist vorsteuerabzugsfähig. Für Transporter der Fiskal-Lkw-Liste und Lkw gilt der Vorsteuerabzug dagegen bei beiden Antrieben.",
  },
  {
    q: "Was ändert sich 2027 beim Sachbezug für E-Autos?",
    a: "Bis 31. Dezember 2026 beträgt der Sachbezug für E-Firmenwagen mit 0 g CO₂ null. Ab 1. Jänner 2027 sind es 0,375 % der Anschaffungskosten, höchstens 180 € im Monat, ab 2028 0,625 %, höchstens 300 € (Budgetbegleitgesetz 2027–2028, BGBl. I Nr. 62/2026). Das gilt auch für bestehende Fahrzeuge. Für Verbrenner bleibt es bei 1,5 % (bis 126 g CO₂/km) bzw. 2 %, höchstens 720 bzw. 960 € – der E-Firmenwagen bleibt für Mitarbeitende damit klar günstiger.",
  },
  {
    q: "Gibt es 2026 eine Förderung für E-Firmenfahrzeuge?",
    a: "Das Bundesprogramm „E-Mobilität für Betriebe“ (eMove Austria) ist derzeit ausgeschöpft, neue Anträge sind nicht möglich. Der Rechner setzt deshalb 0 € an – tragen Sie eine Förderung nur ein, wenn Ihnen eine Zusage vorliegt. Weiter nutzbar ist der Öko-Investitionsfreibetrag: 22 % für emissionsfreie Fahrzeuge und E-Ladestationen bei Anschaffung bis 31. Dezember 2026, danach 15 %.",
  },
  {
    q: "Wie viel CO₂ spart eine E-Flotte wirklich?",
    a: `Wir rechnen mit den harmonisierten Emissionsfaktoren des Umweltbundesamts inklusive Vorkette: ${fmt(CO2.diesel, 2)} kg CO₂e je Liter Diesel, ${fmt(CO2.benzin, 2)} kg je Liter Benzin, ${fmt(CO2.strom * 1000)} g je kWh österreichischem Strommix und ${fmt(CO2.pv * 1000)} g je kWh eigenem Solarstrom. Damit sparen E-Pkw und E-Transporter schon mit Netzstrom rund drei Viertel der Emissionen im Betrieb, mit Solarstrom vom eigenen Dach deutlich mehr. Die Herstellung der Fahrzeuge ist nicht enthalten.`,
  },
  {
    q: "Wie viele Ladepunkte braucht unser Betrieb?",
    a: "Für Pkw und Transporter, die über Nacht am Standort stehen, reicht meist ein AC-Ladepunkt mit 11 kW je Fahrzeug – in zehn Stunden lassen sich so über 100 kWh nachladen. Lkw brauchen DC-Ladepunkte mit 50 bis 150 kW. Mit dynamischem Lastmanagement genügt am Netzanschluss oft nur ein Bruchteil der installierten Ladeleistung. Wie viel genau, rechnet unser Ladeinfrastruktur-Planer mit Ihrem Anschluss und Ihrer Grundlast.",
  },
  {
    q: "Was ist im Rechner nicht enthalten?",
    a: "Restwerte, Finanzierung oder Leasing, Versicherung und die motorbezogene Versicherungssteuer (seit April 2025 auch für E-Autos fällig), Abschreibung und Luxustangente bei der Ertragsteuer sowie Lohnnebenkosten auf den Sachbezug. Preise für Kraftstoff und Strom bleiben über die Laufzeit gleich. Für eine belastbare Entscheidung rechnen wir gern mit Ihren echten Fahrprofilen, Angeboten und Ihrer Steuerberatung.",
  },
];

export default function Page() {
  const pkw = KLASSEN.pkw;
  const tr = KLASSEN.transporter;
  const lkw = KLASSEN.lkw;
  return (
    <FlotteLadeSeite
      pfad={PFAD}
      toolId="e-flotte"
      breadcrumb="E-Flotte-Rechner"
      eyebrow="E-Flotte-Rechner für Unternehmen"
      title={
        <>
          Firmenflotte auf Elektro – <span className="ov-text-gradient-light">was bringt es Ihrem Betrieb?</span>
        </>
      }
      lead="Gesamtkosten Verbrenner gegen Elektro über die Nutzungsdauer – mit Vorsteuer, Sachbezug, Investitionsfreibetrag, GO-Maut und Solarstrom vom eigenen Dach. Für Pkw, Transporter und Lkw."
      chips={["Kostenlos & ohne Anmeldung", "Netto aus Betriebssicht", "Österreichisches Steuerrecht 2026"]}
      app={{
        name: "Ökovolt E-Flotte-Rechner",
        description:
          "Vergleicht die Gesamtkosten (TCO) einer Firmenflotte mit Diesel- oder Benzinfahrzeugen und mit Elektrofahrzeugen in Österreich – inklusive Vorsteuerabzug, Sachbezug, Investitionsfreibetrag, GO-Maut, PV-Strom, CO₂-Einsparung und Ladepunkt-Empfehlung.",
        featureList: [
          "TCO-Vergleich über die Nutzungsdauer",
          "Pkw, Transporter und Lkw",
          "Vorsteuerabzug und Luxustangente",
          "Sachbezug 2026 bis 2028",
          "Öko-Investitionsfreibetrag",
          "GO-Maut 2026 für Lkw",
          "PV-Anteil am Ladestrom",
          "CO₂ inklusive Vorkette",
          "Ladepunkt-Empfehlung",
        ],
      }}
      rechner={<FlotteRechner />}
      fakten={{
        eyebrow: "Recht & Steuern kompakt",
        title: "Vier Regeln, die in Österreich für den E-Fuhrpark sprechen",
        lead: "Der größte Hebel steckt oft nicht im Strompreis, sondern im Steuerrecht. Stand September 2026 – bitte mit Ihrer Steuerberatung abstimmen.",
        bild: { src: "/Images/Ratgeber/solarcarport.jpg", alt: "Solar-Carport über einem Firmenparkplatz – Photovoltaik liefert Ladestrom für die Flotte", caption: "Solarcarport: Strom für die Flotte dort, wo sie parkt." },
        items: [
          { icon: Receipt, wert: "6.667 €", label: "Vorsteuer je E-Pkw", text: "Bis 40.000 € brutto voll abziehbar, bis 80.000 € höchstens 6.666,67 € – beim Verbrenner-Pkw null." },
          { icon: UserRound, wert: "0 €", label: "Sachbezug 2026", text: "Ab 2027 0,375 % (max. 180 €), ab 2028 0,625 % (max. 300 €) – Verbrenner 2 % bis 960 €." },
          { icon: BadgePercent, wert: "22 %", label: "Öko-IFB bis Ende 2026", text: "Investitionsfreibetrag für E-Fahrzeuge und Ladestationen, danach 15 %. Fossile Antriebe sind ausgeschlossen." },
          { icon: Route, wert: `−${fmt((1 - MAUT[2].e / MAUT[2].diesel) * 100)} %`, label: "GO-Maut für E-Lkw", text: `Emissionsfrei ${fmt(MAUT[2].e, 3)} statt ${fmt(MAUT[2].diesel, 3)} €/km (2 Achsen, EURO VI) auf Autobahnen und Schnellstraßen.` },
        ],
        quelle: "Quellen: UStG § 12 Abs. 2 Z 2a (WKO, EY Österreich); BGBl. I Nr. 62/2026 und Sachbezugswerteverordnung; § 11 EStG (WKO, USP); ASFINAG GO-Maut-Tarife 2026.",
      }}
      erklaerung={
        <>
          <SectionHeading
            eyebrow="So rechnen wir"
            title="Gesamtkosten statt Listenpreis – aus Sicht Ihres Betriebs."
            lead="Der Rechner vergleicht, was die Flotte über die Nutzungsdauer kostet: Anschaffung, Energie, Wartung und – bei Lkw – GO-Maut. Netto, so wie es in Ihrer Buchhaltung ankommt."
          />
          <div className="ov-prose mt-8 max-w-2xl">
            <p>
              <strong>Verbrenner:</strong> Kilometer mal Literverbrauch mal Kraftstoffpreis. Beim Pkw zählen Anschaffung (inkl. NoVA), Kraftstoff und Wartung brutto, weil der Vorsteuerabzug fehlt. Transporter der Fiskal-Lkw-Liste und Lkw rechnen wir netto.
            </p>
            <p>
              <strong>Elektro:</strong> Die Ladeenergie teilen wir auf Netzstrom im Betrieb, Solarstrom vom eigenen Dach (bewertet mit der entgangenen Einspeisung) und öffentliches Laden. Beim E-Pkw ziehen wir die Vorsteuer nach Luxustangente ab, der Öko-Investitionsfreibetrag wirkt über die Steuer im ersten Jahr. Auf Wunsch rechnen wir die Ladepunkte als Richtwert mit.
            </p>
            <p>
              Wie viel Leistung die Ladepunkte am Netzanschluss brauchen, zeigt der <Link href="/rechner/ladeinfrastruktur">Ladeinfrastruktur-Planer</Link>. Was eine PV-Anlage am Standort bringt, rechnet der <Link href="/solarrechner">Solarrechner</Link>; wie wir Ladeparks, Lastmanagement und Solarcarports umsetzen, lesen Sie unter <Link href="/ladeinfrastruktur">Ladeinfrastruktur für Unternehmen</Link>.
            </p>
          </div>
        </>
      }
      annahmen={[
        ["Diesel · Benzin (Tankstelle, brutto)", `${fmt(FLOTTE.diesel, 2)} · ${fmt(FLOTTE.benzin, 2)} €/l`],
        ["Strom im Betrieb (netto, Standard)", `${fmt(FLOTTE.stromCt)} ct/kWh`],
        ["Öffentlich laden (netto)", `${fmt(FLOTTE.oeffentlichCt)} ct/kWh`],
        ["Verbrauch Pkw · Transporter · Lkw", `${fmt(pkw.liter.diesel, 1)} · ${fmt(tr.liter.diesel, 1)} · ${fmt(lkw.liter.diesel)} l Diesel`],
        ["Elektrisch inkl. Ladeverluste", `${fmt(pkw.kwh)} · ${fmt(tr.kwh)} · ${fmt(lkw.kwh)} kWh/100 km`],
        ["CO₂ Diesel · Benzin (inkl. Vorkette)", `${fmt(CO2.diesel, 2)} · ${fmt(CO2.benzin, 2)} kg/l`],
        ["CO₂ Strommix AT · eigene PV", `${fmt(CO2.strom * 1000)} · ${fmt(CO2.pv * 1000)} g/kWh`],
        ["Solarstrom realistisch nutzbar", `max. ${fmt(FLOTTE.pvNutzbar * 100)} % des PV-Ertrags`],
        ["Öko-IFB · Steuersatz (Standard)", `${fmt(FLOTTE.ifbSatz * 100)} % · 23 % KöSt`],
        ["Ladepunkt AC · DC 50 kW (Richtwert)", `${fmt(FLOTTE.kostenAc)} · ${fmt(FLOTTE.kostenDc)} € netto`],
        ["Förderung (derzeit ausgeschöpft)", "0 €"],
      ]}
      quellen={[
        { name: "EU Weekly Oil Bulletin (Österreich, 21.09.2026)", url: "https://energy.ec.europa.eu/data-and-analysis/weekly-oil-bulletin_en" },
        CO2.quelle,
        { name: "ADAC Ecotest – Stromverbrauch (07/2026)", url: "https://www.adac.de/rund-ums-fahrzeug/elektromobilitaet/elektroauto/stromverbrauch-elektroautos-adac-test/" },
        { name: "KEA-BW – Faktencheck E-Lkw", url: "https://www.kea-bw.de/fileadmin/user_upload/Nachhaltige_Mobilitaet/Wissensportal/E_Mobilitaet/E-Lkw/260204_KEABW_Pub_E-LKW_Faktencheck_19_RZ4_barrierefrei.pdf" },
        { name: "WKO – Elektromobilität aus steuerlicher Sicht", url: "https://www.wko.at/steuern/elektromobilitaet-steuerliche-sicht" },
        { name: "WKO – Investitionsfreibetrag", url: "https://www.wko.at/steuern/investitionsfreibetrag" },
        { name: "WKO – Sachbezug für E-Autos ab 2027", url: "https://www.wko.at/lohnverrechnung/sachbezug-e-autos-auswirkungen-umsatzsteuer" },
        MAUT.quelle,
        { name: "Eurostat – Strompreise Nicht-Haushalte (nrg_pc_205)", url: "https://ec.europa.eu/eurostat/databrowser/view/nrg_pc_205/default/table" },
      ]}
      faq={FAQ}
      faqTitel="E-Flotte: Kosten, Steuern & Laden"
      cta={{
        title: "Vom Rechenergebnis zum Flotten-Konzept.",
        text: "Wir planen Ladepunkte, Lastmanagement, Netzanschluss und PV-Anlage für Ihren Fuhrpark – mit Ihren echten Fahrprofilen, in ganz Österreich und herstellerunabhängig.",
        primary: { label: "Konzept anfragen", href: "/angebot?objekt=gewerbe&wallbox=1" },
        secondary: { label: "Termin vereinbaren", href: "/termin?art=video" },
      }}
    />
  );
}
