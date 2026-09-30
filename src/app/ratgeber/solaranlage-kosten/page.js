// src/app/ratgeber/solaranlage-kosten/page.js
//
// Handgebauter Ratgeber „Photovoltaik Kosten Österreich 2026“ (Gruppe R1).
// Alle Zahlen stehen bewusst direkt in dieser Datei (Stand 09/2026, Quellen
// unten) – keine Imports aus @/data/solarrechner oder @/data/einspeiseverguetung.
// Österreichspezifische Inhalte -> kein hreflang, nur Canonical.

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
import { artikelNachSlug, artikelPfad } from "@/lib/ratgeber";
import { BASE_URL, SITE_NAME, LOCALE } from "@/lib/site";

const SLUG = "solaranlage-kosten";
const artikel = artikelNachSlug(SLUG);
const PAGE_URL = `${BASE_URL}${artikelPfad(SLUG)}`;

export const metadata = {
  title: "PV Kosten Österreich 2026: Preise je kWp | Ökovolt",
  description: artikel.description,
  keywords: artikel.keywords,
  alternates: { canonical: PAGE_URL },
  openGraph: {
    type: "article",
    url: PAGE_URL,
    siteName: SITE_NAME,
    locale: LOCALE,
    title: artikel.title,
    description: artikel.description,
    publishedTime: artikel.veroeffentlicht,
    modifiedTime: artikel.aktualisiert,
    section: artikel.kategorie,
    images: [{ url: `${BASE_URL}/og/ratgeber/solaranlage-kosten.jpg`, width: 1200, height: 630, alt: artikel.title }],
  },
  twitter: {
    card: "summary_large_image",
    title: artikel.title,
    description: artikel.description,
    images: [`${BASE_URL}/og/ratgeber/solaranlage-kosten.jpg`],
  },
  other: { "fediverse:creator": "@ratgeber@oekovolt.com" },
};

const TOC = [
  { id: "kurz", label: "Das Wichtigste in Kürze" },
  { id: "preise", label: "Preise nach Größenklasse" },
  { id: "marktdaten", label: "Was die Marktstatistik zeigt" },
  { id: "bestandteile", label: "Woraus sich der Preis ergibt" },
  { id: "zusatz", label: "Zusatzkosten im Gewerbe" },
  { id: "speicher", label: "Was kostet ein Speicher?" },
  { id: "laufend", label: "Laufende Kosten" },
  { id: "foerderung", label: "Förderung & Steuern" },
  { id: "beispiel", label: "Rechenbeispiel 100 kWp" },
  { id: "privat", label: "Kosten fürs Eigenheim" },
  { id: "angebot", label: "Worauf Sie achten sollten" },
  { id: "faq", label: "Häufige Fragen" },
  { id: "quellen", label: "Quellen" },
];

// Richtwerte netto (ohne 20 % USt), Stand 09/2026 – abgeleitet aus der
// BMWET-Marktstatistik 2024 (5 kWp 1.551 €, 10 kWp 1.336 €, 30–50 kWp 806 €/kWp)
// und der seither weiter gesunkenen Modulpreise. Keine Angebotspreise.
const PREISE = [
  ["5 kWp", "Einfamilienhaus, klein", "1.400–1.700 €", "7.000–8.500 €", "ca. 25 m²"],
  ["10 kWp", "Einfamilienhaus, Kleinbetrieb", "1.200–1.450 €", "12.000–14.500 €", "ca. 50 m²"],
  ["30–50 kWp", "Werkstatt, Landwirtschaft, Hotel", "750–950 €", "22.500–47.500 €", "150–250 m²"],
  ["100 kWp", "Gewerbehalle, Handel", "700–850 €", "70.000–85.000 €", "ca. 500 m²"],
  ["250–500 kWp", "Produktion, Logistik", "600–750 €", "150.000–375.000 €", "1.250–2.500 m²"],
  ["1 MWp (Dach)", "Industrie, großes Logistikzentrum", "550–700 €", "550.000–700.000 €", "ca. 5.000 m²"],
  ["1–5 MWp (Freifläche)", "Freiflächen, Agri-PV, Landesversorger", "500–650 € + Netzanschluss", "ab ca. 500.000 €", "ca. 1–1,5 ha je MWp"],
];

const LCOE = [
  ["10 kWp Eigenheim", "1.330 € netto (1.596 € brutto)", "20 € (24 € brutto)", "12,3 ct (14,8 ct brutto)"],
  ["50 kWp Betrieb", "850 €", "16 €", "8,3 ct"],
  ["100 kWp Hallendach", "750 €", "15 €", "7,4 ct"],
  ["500 kWp Hallendach", "650 €", "12 €", "6,3 ct"],
  ["1 MWp Dach", "600 €", "11 €", "5,8 ct"],
  ["1 MWp Freifläche, 1.100 kWh/kWp", "575 €", "12 €", "5,2 ct"],
];

const FAQ = [
  {
    q: "Was kostet eine PV-Anlage mit 100 kWp in Österreich?",
    a: "Eine schlüsselfertige 100-kWp-Anlage auf einem Gewerbe-Flachdach kostet 2026 als Richtwert rund 70.000 bis 85.000 € netto, also 700 bis 850 € je kWp. Statik, Kran, Netzanschluss und Brandschutzauflagen können den Preis verschieben. Vorsteuerabzugsberechtigte Betriebe rechnen mit dem Nettopreis.",
  },
  {
    q: "Warum ist der Preis je kWp bei großen Anlagen so viel niedriger?",
    a: "Planung, Netzzugang, Baustelleneinrichtung und Dokumentation fallen weitgehend unabhängig von der Größe an und verteilen sich bei großen Anlagen auf mehr Kilowatt-Peak. Laut BMWET-Marktstatistik 2024 war eine 30- bis 50-kWp-Anlage je kWp knapp 48 % günstiger als eine 5-kWp-Anlage. Dazu kommen günstigere Einkaufskonditionen für Module und Wechselrichter.",
  },
  {
    q: "Gibt es 2026 noch den Nullsteuersatz auf Photovoltaik?",
    a: "Nein. Der Umsatzsteuersatz von 0 % für PV-Module bis 35 kWp galt nur vom 1. Jänner 2024 bis 31. März 2025 (Übergangsregel für Verträge vor dem 7. März 2025 bis Ende 2025). 2026 gilt wieder der Normalsatz von 20 %. Für Unternehmen mit Vorsteuerabzug ändert das nichts, Privathaushalte zahlen brutto.",
  },
  {
    q: "Welche laufenden Kosten hat eine gewerbliche PV-Anlage?",
    a: "Rechnen Sie mit rund 10 bis 20 € je kWp und Jahr für Wartung und Prüfung, Versicherung, Monitoring und Fernwartung, Messung sowie eine Rücklage für den Wechselrichtertausch. Bei 100 kWp sind das etwa 1.000 bis 2.000 € im Jahr. Ab 2027 kommt für Anlagen über 20 kW ein Versorgungsinfrastrukturbeitrag von 0,05 ct je eingespeister kWh dazu.",
  },
  {
    q: "Was kostet ein Batteriespeicher für einen Betrieb?",
    a: "Heimspeicher kosteten 2024 laut BMWET im Schnitt 706 € je kWh nutzbarer Kapazität netto. Gewerbespeicher ab etwa 100 kWh liegen je nach Leistung, Brandschutz und Aufstellung als Richtwert bei 450 bis 750 € je kWh. Wirtschaftlich wird ein Gewerbespeicher meist erst, wenn er Eigenverbrauch erhöht und zusätzlich Lastspitzen kappt.",
  },
  {
    q: "Wie viel Förderung gibt es 2026 für eine PV-Anlage im Betrieb?",
    a: "Über den EAG-Investitionszuschuss höchstens 130 €/kWp (20–100 kWp) bzw. 120 €/kWp (100–1.000 kWp) und 150 € je kWh Speicher – aber nur mit Zuschlag im Fördercall, der 2026 in Sekunden ausgeschöpft war. Verlässlicher ist der Öko-Investitionsfreibetrag von 22 % für Anschaffungen bis 31. Dezember 2026.",
  },
  {
    q: "Wie teuer ist Solarstrom aus der eigenen Anlage?",
    a: "Die Stromgestehungskosten liegen bei einer 100-kWp-Dachanlage in unserem Rechenbeispiel bei rund 7,4 ct/kWh über 25 Jahre, bei 500 kWp bei rund 6,3 ct/kWh. Zum Vergleich: Betriebe mit 20 bis 500 MWh Jahresverbrauch zahlten im zweiten Halbjahr 2025 laut Eurostat im Schnitt 23,2 ct/kWh ohne Umsatzsteuer.",
  },
];

const QUELLEN = [
  { titel: "BMWET/Technikum Wien – Innovative Energietechnologien in Österreich, Marktentwicklung 2024 (Photovoltaik)", url: "https://nachhaltigwirtschaften.at/resources/nw_pdf/schriftenreihe-2025-23a_marktstatistik-2024.pdf", stand: "09/2026" },
  { titel: "BMWET – PV-Speichersysteme, Marktentwicklung 2024", url: "https://www.bmwet.gv.at/dam/jcr:35a533b7-5724-464b-8737-ad014c18cd03/PV-Speichersysteme%20-%20Marktentwicklung%202024.pdf", stand: "09/2026" },
  { titel: "Eurostat – Strompreise für Nicht-Haushaltskunden (nrg_pc_205), Österreich 2. Halbjahr 2025", url: "https://ec.europa.eu/eurostat/databrowser/view/nrg_pc_205/default/table", stand: "09/2026" },
  { titel: "BGBl. II Nr. 12/2026 – EAG-Investitionszuschüsseverordnung-Strom-Novelle 2026 (OeMAG)", url: "https://www.oem-ag.at/fileadmin/user_upload/Dokumente/gesetze/2026-01-16_EAG-IZV-Novelle_2026.pdf", stand: "09/2026" },
  { titel: "BMF – Steuersatz für Photovoltaikmodule (0 % bis 31.3.2025)", url: "https://www.bmf.gv.at/themen/steuern/fuer-unternehmen/umsatzsteuer/informationen/steuersatz-fuer-photovoltaikmodule.html", stand: "09/2026" },
  { titel: "USP – Investitionsfreibetrag (20 % / 22 % bis 31.12.2026)", url: "https://www.usp.gv.at/themen/steuern-finanzen/steuerliche-gewinnermittlung/weitere-informationen-zur-steuerlichen-gewinnermittlung/betriebseinnahmen-und-ausgaben/investitionsfreibetrag.html", stand: "09/2026" },
  { titel: "PV&B Austria – ElWG: Das Wichtigste im Überblick für den PV- und Speicherbereich", url: "https://pvbaustria.at/elwg-das-wichtigste-im-uberblick-fur-den-pv-und-speicherbereich/", stand: "09/2026" },
  { titel: "USP – Elektrizitätsabgabe (Befreiung Eigenstrom, Sätze 2026)", url: "https://www.usp.gv.at/themen/steuern-finanzen/weitere-steuern-und-abgaben/verbrauchsteuern_und_energieabgaben/elektrizitaetsabgabe.html", stand: "09/2026" },
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
        inLanguage: "de-AT",
        datePublished: artikel.veroeffentlicht,
        dateModified: artikel.aktualisiert,
        author: { "@id": `${BASE_URL}/#organization` },
        publisher: { "@id": `${BASE_URL}/#organization` },
        mainEntityOfPage: { "@type": "WebPage", "@id": PAGE_URL },
        image: `${BASE_URL}${artikel.bild}`,
        articleSection: artikel.kategorie,
        keywords: artikel.keywords.join(", "),
        timeRequired: `PT${artikel.lesezeit}M`,
        citation: QUELLEN.map((q) => ({ "@type": "CreativeWork", name: q.titel, url: q.url })),
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <ArtikelLayout
        artikel={artikel}
        toc={TOC}
        titel={
          <>
            Photovoltaik <span className="ov-text-gradient">Kosten</span> Österreich 2026
          </>
        }
        badge={
          <div className="flex items-center gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-ov-500 text-white">
              <Euro aria-hidden="true" className="h-6 w-6" />
            </span>
            <div>
              <p className="ov-num font-display text-[22px] font-extrabold leading-none text-ink-900">700–850 €</p>
              <p className="mt-1 text-[12.5px] leading-snug text-ink-500">je kWp netto bei 100 kWp, Richtwert 2026</p>
            </div>
          </div>
        }
        seitenCta={{ titel: "Was kostet Ihre Anlage?", text: "Richtpreis auf Basis von Dach, Lastgang und Netzanschluss.", href: "/angebot", label: "Projekt anfragen" }}
        cta={{
          title: "Aus Richtwerten wird ein belastbares Angebot.",
          text: "Wir werten Ihren Lastgang aus, prüfen Dach, Statik und Netzanschluss und legen alle Positionen offen – von der Unterkonstruktion bis zum Parkregler. Ökovolt aus Ostermiething, seit 2012 in ganz Österreich.",
          primary: { label: "Projekt anfragen", href: "/angebot" },
          secondary: { label: "Förder-Check starten", href: "/foerdercheck" },
        }}
      >
        <KurzFazit
          punkte={[
            "**Eine PV-Anlage kostet in Österreich 2026 je nach Größe rund 500 bis 1.700 € je kWp netto** – von 1.400–1.700 €/kWp bei 5 kWp bis 500–650 €/kWp bei Megawatt-Freiflächen (Richtwerte, Stand September 2026).",
            "Die amtliche Marktstatistik weist für 2024 netto **1.551 €/kWp (5 kWp), 1.336 €/kWp (10 kWp) und 806 €/kWp (30–50 kWp)** aus; Module machen nur noch 14 bis 23 % des Systempreises aus.",
            "Eine **100-kWp-Gewerbeanlage** kostet als Richtwert **70.000–85.000 € netto**; ihr Solarstrom kostet über 25 Jahre rund **7,4 ct/kWh** – ein Drittel dessen, was kleinere Betriebe im Schnitt für Netzstrom zahlen (Eurostat: 23,2 ct/kWh).",
            "Laufend kommen **10–20 € je kWp und Jahr** dazu; Speicher kosten als Richtwert 450–750 €/kWh (Gewerbe) bzw. im Schnitt 706 €/kWh (Heimspeicher 2024).",
            "Seit April 2025 gilt wieder **20 % Umsatzsteuer**. Betriebe entlastet 2026 vor allem der **Öko-Investitionsfreibetrag von 22 %**; der EAG-Zuschuss ist ein Bonus, keine Rechengrundlage.",
          ]}
        />

        <Abschnitt id="preise" titel="Was kostet eine Photovoltaikanlage in Österreich nach Größe?">
          <Prosa>
            <p>
              <strong>
                Eine schlüsselfertige PV-Anlage kostet 2026 zwischen rund 1.700 € je kWp bei sehr kleinen Anlagen und 500 € je kWp bei großen
                Freiflächenanlagen – der Preis je Kilowatt-Peak halbiert sich vom Einfamilienhaus zur Gewerbehalle ungefähr.
              </strong>{" "}
              Die folgenden Werte sind Richtwerte netto, also ohne 20 % Umsatzsteuer, für Standarddächer mit normaler Zugänglichkeit. Sie enthalten
              Module, Wechselrichter, Unterkonstruktion, Montage, Elektroinstallation bis zum Zählerplatz, Planung, Netzzugangsantrag und
              Inbetriebnahme.
            </p>
          </Prosa>
          <Tabelle
            caption="Richtpreise für Photovoltaikanlagen in Österreich nach Größenklasse, netto, Stand September 2026"
            kopf={["Größe", "Typischer Einsatz", "Preis je kWp", "Gesamt (netto)", "Fläche"]}
            zeilen={PREISE}
            hervorheben={2}
            markierteZeile={3}
            minBreite={720}
            fussnote="Richtwerte ohne Speicher, ohne Trafostation und ohne Netzausbaukosten des Netzbetreibers. Grundlage: BMWET-Marktstatistik 2024 (5, 10 und 30–50 kWp) und Marktbeobachtung 2026 für größere Klassen. Flächenbedarf bei Schrägdach bzw. ost-west aufgeständertem Flachdach; Freifläche je nach Reihenabstand. Keine Angebotspreise."
          />
          <Prosa>
            <p>
              Für den Vergleich verschiedener Angebote zählt nicht nur der Preis je kWp, sondern der Preis je erzeugter Kilowattstunde. Wie Sie
              Angebote vergleichbar machen, zeigt die <TextLink href="/ratgeber/photovoltaik-angebot-vergleichen">Checkliste zum Angebotsvergleich</TextLink>.
              Ob sich die Investition für Ihren Betrieb rechnet, beantwortet der Ratgeber{" "}
              <TextLink href="/ratgeber/photovoltaik-gewerbe">Photovoltaik für Unternehmen</TextLink>.
            </p>
          </Prosa>
        </Abschnitt>

        <Abschnitt id="marktdaten" titel="Was die amtliche Marktstatistik über PV-Preise zeigt">
          <Prosa>
            <p>
              <strong>
                Laut der vom Bundesministerium beauftragten Marktstatistik (Technikum Wien) kostete eine 5-kWp-Anlage 2024 im Mittel 1.551 € je kWp
                netto, eine 10-kWp-Anlage 1.336 € und eine 30- bis 50-kWp-Anlage 806 € je kWp.
              </strong>{" "}
              Der Preis je kWp ist damit bei 30 bis 50 kWp knapp 48 % niedriger als bei 5 kWp. Gleichzeitig sank der durchschnittliche
              Moduleinkaufspreis der Errichter 2024 um 20,3 % auf 184,84 € je kWp – noch nie wurden Module so günstig eingekauft.
            </p>
            <p>
              Spannend ist, was das für die Kostenstruktur bedeutet: Bei einer 10-kWp-Anlage machen die Module nur rund 14 % des Systempreises aus,
              bei 30 bis 50 kWp rund 23 %. Der Rest sind Montage, Elektrotechnik, Unterkonstruktion, Wechselrichter, Planung und Netzanmeldung.
              Weitere Modulpreissenkungen wirken sich deshalb auf den Endpreis nur begrenzt aus. Österreich hat 2024 übrigens 2.509 MWp neu
              installiert; Ende 2024 waren 9.398 MWp in Betrieb.
            </p>
          </Prosa>
          <Tabelle
            caption="Mittlere Systempreise schlüsselfertiger PV-Anlagen in Österreich laut Marktstatistik, netto"
            kopf={["Anlagengröße", "2023", "2024", "Veränderung"]}
            zeilen={[
              ["5 kWp", "ca. 1.670 €/kWp", "1.551 €/kWp", "−7,1 %"],
              ["10 kWp", "1.347 €/kWp", "1.336 €/kWp", "−0,8 %"],
              ["30–50 kWp", "817 €/kWp", "806 €/kWp", "−1,5 %"],
              ["Moduleinkauf (Errichter)", "232,0 €/kWp", "184,84 €/kWp", "−20,3 %"],
              ["PV-Heimspeicher je kWh nutzbar", "840 €/kWh", "706 €/kWh", "−16 %"],
            ]}
            hervorheben={2}
            minBreite={560}
            fussnote="Quelle: BMWET/Technikum Wien, Innovative Energietechnologien in Österreich – Marktentwicklung 2024; PV-Speichersysteme – Marktentwicklung 2024. Wert 2023 für 5 kWp aus dem Rückgang von 7,1 % zurückgerechnet. Gewichtete Mittelwerte, exkl. USt."
          />
        </Abschnitt>

        <Abschnitt id="bestandteile" titel="Woraus sich der Preis zusammensetzt">
          <Prosa>
            <p>
              <strong>Bei Gewerbeanlagen entfällt heute nur etwa ein Viertel des Preises auf die Module; drei Viertel sind Technik, Arbeit und
              Planung.</strong> So verteilt sich der Preis einer 100-kWp-Anlage auf einem Hallendach typischerweise:
            </p>
          </Prosa>
          <KostenAufteilung gesamt={75000} variante="gewerbe" titel="Beispiel 100 kWp Hallendach, 750 €/kWp netto" />
          <Prosa>
            <p>
              Die größten Unterschiede zwischen Angeboten entstehen nicht bei den Modulen, sondern bei Unterkonstruktion und Montage: Ein
              Trapezblechdach mit geringer Lastreserve braucht eine leichtere, mechanisch befestigte Unterkonstruktion statt Ballast, ein
              Standort mit hoher Schneelast stärkere Profile und Module mit höherer Prüflast. Hinweise dazu geben die Ratgeber{" "}
              <TextLink href="/ratgeber/photovoltaik-flachdach">Photovoltaik auf dem Flachdach</TextLink> und{" "}
              <TextLink href="/ratgeber/schneelast-photovoltaik">Schneelast und Photovoltaik</TextLink>.
            </p>
          </Prosa>
        </Abschnitt>

        <Abschnitt id="zusatz" titel="Welche Zusatzkosten bei Gewerbeanlagen anfallen können">
          <Prosa>
            <p>
              <strong>Je größer die Anlage, desto wichtiger werden Positionen außerhalb des Modulfelds: Netzanschluss, Regelungstechnik,
              Statik und Brandschutz.</strong> Ein seriöses Angebot nennt sie, auch wenn sie im Einzelfall entfallen.
            </p>
          </Prosa>
          <Tabelle
            caption="Mögliche Zusatzkosten bei gewerblichen PV-Anlagen, Richtwerte netto"
            kopf={["Position", "Wann nötig?", "Richtwert"]}
            zeilen={[
              ["Statiknachweis / Tragwerksgutachten", "Hallen- und Flachdächer, Leichtbaudächer", "1.500–5.000 €"],
              ["Kran, Absturzsicherung, Logistik", "Hallendächer, schwierige Zufahrt", "je nach Dauer 1.000–6.000 €"],
              ["EZA-Regler / Parkregler", "wenn der Netzbetreiber Blindleistungs- oder Wirkleistungsregelung vorschreibt", "5.000–20.000 €"],
              ["Netzanschluss auf höherer Netzebene, Trafostation", "große Anlagen, wenn die Kapazität auf Netzebene 7 nicht reicht", "ab ca. 80.000 €, projektabhängig"],
              ["Netzanschlussentgelt (Pauschale)", "Einspeisung über 70 % der Bezugsleistung (ElWG, Anlagen > 15 kW)", "laut Netzbetreiber"],
              ["Brandschutzmaßnahmen", "Auflagen nach OVE R 11-1, Behörde oder Versicherung", "projektabhängig"],
              ["Zählerplatz- und Verteilerumbau", "Altbestand, fehlender Platz für Schutzorgane", "2.000–15.000 €"],
            ]}
            minBreite={640}
            fussnote="Richtwerte aus der Projektpraxis, Stand September 2026, keine Angebotspreise. Netzanschlussentgelte und Netzbereitstellung legt der Netzbetreiber fest; Anforderungen an die Regelung ergeben sich aus den TOR Erzeuger und der Netzverträglichkeitsprüfung."
          />
          <Prosa>
            <p>
              Welche Regelungstechnik Ihr Netzbetreiber verlangt, hängt von Anlagengröße und Netzebene ab – siehe{" "}
              <TextLink href="/ratgeber/tor-erzeuger-netzanschluss">TOR Erzeuger und Netzanschluss</TextLink>. Ökovolt setzt dafür einen
              eigenen <TextLink href="/technik/parkregler">Parkregler (EZA-Regler)</TextLink> ein, der mit unserer Fernwartung und dem eigenen
              SCADA-System zusammenarbeitet. Seit Juni 2026 müssen neue Anlagen ab 3,68 kW ohnehin ansteuerbar sein, und bei neuen Anlagen kann
              der Netzbetreiber die Einspeisung auf 70 % der Modulleistung begrenzen (ElWG) – den Eigenverbrauch betrifft das nicht.
            </p>
          </Prosa>
        </Abschnitt>

        <Abschnitt id="speicher" titel="Was kostet ein Stromspeicher für Betrieb und Eigenheim?">
          <Prosa>
            <p>
              <strong>PV-Heimspeicher kosteten 2024 laut BMWET im Mittel 706 € je kWh nutzbarer Kapazität netto; Gewerbespeicher liegen als
              Richtwert bei 450 bis 750 € je kWh.</strong> Bei großen Speichern sinkt der Preis je kWh, dafür kommen Brandschutz, Aufstellort
              (Container oder Technikraum) und Energiemanagement dazu.
            </p>
          </Prosa>
          <Tabelle
            caption="Richtpreise für Batteriespeicher, netto, Stand September 2026"
            kopf={["Speicher", "Typischer Einsatz", "Richtpreis"]}
            zeilen={[
              ["10 kWh", "Eigenheim, Kleinbetrieb", "6.000–8.500 €"],
              ["50 kWh", "Hotel, Landwirtschaft, Werkstatt", "27.500–37.500 €"],
              ["100–200 kWh", "Gewerbe mit Abendlast oder Lastspitzen", "50.000–130.000 €"],
              ["ab 500 kWh", "Industrie, Peak Shaving, Vermarktung", "projektabhängig"],
            ]}
            hervorheben={2}
            minBreite={520}
            fussnote="Heimspeicher auf Basis BMWET-Marktstatistik 2024 (Ø 706 €/kWh nutzbar); Gewerbespeicher als Richtwertspanne. EAG-Zuschuss 150 €/kWh nur gemeinsam mit einer neuen PV-Anlage und nur bis 50 kWh förderfähig."
          />
          <Merkkasten variant="tipp" titel="Gewerbespeicher rechnen sich über zwei Hebel">
            Ein Speicher verschiebt Mittagsüberschuss in den Abend und kann gleichzeitig Lastspitzen kappen, die den{" "}
            <TextLink href="/wissen/lexikon#leistungspreis">Leistungspreis</TextLink> bestimmen. Erst beide Effekte zusammen machen ihn meist
            wirtschaftlich. Details: <TextLink href="/ratgeber/gewerbespeicher-kosten">Gewerbespeicher Kosten</TextLink> und{" "}
            <TextLink href="/ratgeber/peak-shaving-leistungspreis">Peak Shaving</TextLink>.
          </Merkkasten>
        </Abschnitt>

        <Abschnitt id="laufend" titel="Welche laufenden Kosten eine PV-Anlage hat">
          <Prosa>
            <p>
              <strong>Für Betrieb, Wartung und Absicherung einer Gewerbeanlage sollten Sie rund 10 bis 20 € je kWp und Jahr einplanen.</strong>{" "}
              Kleine Anlagen liegen je kWp höher, weil Fixkosten wie Versicherung und Monitoring stärker ins Gewicht fallen.
            </p>
          </Prosa>
          <Tabelle
            caption="Laufende Kosten einer gewerblichen PV-Anlage je Jahr, Richtwerte netto"
            kopf={["Position", "Richtwert", "Bei 100 kWp"]}
            zeilen={[
              ["Wartung, Sichtprüfung, wiederkehrende Prüfung", "3–8 €/kWp", "300–800 €"],
              ["Versicherung (Elektronik/Betriebsunterbrechung)", "2–5 €/kWp", "200–500 €"],
              ["Monitoring, Fernwartung, Datenkommunikation", "1–2 €/kWp", "100–200 €"],
              ["Rücklage Wechselrichtertausch", "3–5 €/kWp", "300–500 €"],
              ["Versorgungsinfrastrukturbeitrag ab 2027 (> 20 kW)", "0,05 ct je eingespeister kWh", "ca. 20 € bei 40.000 kWh Einspeisung"],
              ["Reinigung (nur bei Bedarf)", "nach Aufwand", "–"],
            ]}
            minBreite={560}
            fussnote="Richtwerte, Stand September 2026. Messentgelte und Netzgebühren laut Netzbetreiber. Versorgungsinfrastrukturbeitrag nach § 75a ElWG für Anlagen über 20 kW netzwirksamer Leistung ab 2027."
          />
          <Kennzahlband
            wert="~1.500 €"
            titel="Laufende Kosten pro Jahr bei 100 kWp"
            text="Wartung, Versicherung, Monitoring und Rücklage für den Wechselrichtertausch – rund 2 % der Investition. Was ein Wartungsvertrag leisten sollte, steht im Ratgeber zum Wartungsvertrag."
          />
          <Prosa>
            <p>
              Was ein <TextLink href="/ratgeber/photovoltaik-wartungsvertrag">Wartungsvertrag</TextLink> enthalten sollte und wie oft eine
              Anlage geprüft werden muss, erklären wir gesondert; unsere Leistungen finden Sie unter{" "}
              <TextLink href="/service/wartung">Wartung</TextLink>.
            </p>
          </Prosa>
        </Abschnitt>

        <Abschnitt id="foerderung" titel="Förderung und Steuern: Was die Kosten 2026 senkt">
          <Prosa>
            <p>
              <strong>Für Betriebe senkt 2026 vor allem der Öko-Investitionsfreibetrag von 22 % die Kosten; der EAG-Investitionszuschuss ist
              wegen der Überzeichnung der Fördercalls ein unsicherer Bonus.</strong> Privathaushalte zahlen seit April 2025 wieder 20 %
              Umsatzsteuer.
            </p>
          </Prosa>
          <Tabelle
            caption="Förderungen und Steuervorteile für PV-Anlagen in Österreich 2026"
            kopf={["Instrument", "Höhe 2026", "Für wen", "Hinweis"]}
            zeilen={[
              ["EAG-Investitionszuschuss Kat. A / B", "150 / 140 €/kWp", "bis 10 / bis 20 kWp", "fixer Satz, Vergabe nach Einreichzeitpunkt"],
              ["EAG-Investitionszuschuss Kat. C / D", "max. 130 / 120 €/kWp", "20–100 / 100–1.000 kWp", "Reihung nach gebotenem €/kWp; D nicht mit anderen Förderungen kombinierbar"],
              ["EAG-Zuschuss Speicher", "150 €/kWh", "mit neuer PV, bis 50 kWh", "mind. 0,5 kWh je kWp"],
              ["Made-in-Europe-Zuschlag", "+10 % Module, +10 % Wechselrichter, +10 % Speicher", "alle Kategorien", "Nachweis über Herstellerliste"],
              ["Öko-Investitionsfreibetrag", "22 % der Anschaffungskosten", "Betriebe mit Gewinnermittlung", "Anschaffung bis 31.12.2026, danach 15 %"],
              ["Elektrizitätsabgabe auf Eigenstrom", "befreit", "alle", "2026: 0,82 ct/kWh für Betriebe, regulär 1,5 ct/kWh"],
            ]}
            minBreite={720}
            fussnote="Stand September 2026: EAG-IZV-Novelle 2026 (BGBl. II Nr. 12/2026), § 11 EStG, ElAbgG. Letzter Fördercall 2026: 8.–22. Oktober. Keine Steuerberatung."
          />
          <Prosa>
            <p>
              Details zu Fördercalls, Reihung und Fristen stehen im Ratgeber{" "}
              <TextLink href="/ratgeber/eag-investitionszuschuss">EAG-Investitionszuschuss 2026</TextLink>, die steuerliche Seite unter{" "}
              <TextLink href="/ratgeber/investitionsfreibetrag-photovoltaik">Investitionsfreibetrag für Photovoltaik</TextLink>. Welche
              Programme für Ihr Projekt in Frage kommen, prüft der <TextLink href="/foerdercheck">Förder-Check</TextLink>.
            </p>
          </Prosa>
        </Abschnitt>

        <Abschnitt id="beispiel" titel="Rechenbeispiel: Was kostet Solarstrom aus 100 kWp?">
          <Prosa>
            <p>
              <strong>Eine 100-kWp-Dachanlage um 75.000 € netto erzeugt Solarstrom um rund 7,4 ct/kWh – über 25 Jahre gerechnet, inklusive
              Betriebskosten und 5 % Kapitalkosten.</strong> Die Stromgestehungskosten sinken mit der Größe deutlich:
            </p>
          </Prosa>
          <Tabelle
            caption="Stromgestehungskosten nach Anlagengröße, vor Steuern und ohne Förderung"
            kopf={["Anlage", "Investition je kWp", "Betriebskosten je kWp/Jahr", "Stromgestehungskosten"]}
            zeilen={LCOE}
            hervorheben={3}
            markierteZeile={2}
            minBreite={640}
            fussnote="Annahmen: 1.000 kWh/kWp und Jahr (Freifläche 1.100), 0,4 % Degradation pro Jahr, 25 Jahre, Kalkulationszins 5 %, Betriebskosten +2 %/Jahr. Bei 3 % Zins sinkt der Wert für 100 kWp auf 6,4 ct, bei 7 % steigt er auf 8,5 ct. Ohne Förderung und Steuerwirkung."
          />
          <Prosa>
            <p>
              Mit Förderung und Steuer wird es noch günstiger: Erhält die 100-kWp-Anlage im Fördercall den Höchstsatz von 130 €/kWp, sinken die
              Anschaffungskosten auf 62.000 €. Davon sind 22 % Investitionsfreibetrag – 13.640 € – zusätzlich zur Abschreibung als
              Betriebsausgabe absetzbar; bei 23 % Körperschaftsteuer spart eine GmbH damit einmalig rund 3.100 € Steuern. Die Abschreibung
              selbst beträgt linear 3.100 € pro Jahr über 20 Jahre. Den Vergleich mit dem Netzstrom zeigt der Ratgeber{" "}
              <TextLink href="/ratgeber/photovoltaik-amortisation">Amortisation berechnen</TextLink>.
            </p>
          </Prosa>
          <Merkkasten variant="info" titel="Vergleichswert Netzstrom">
            Betriebe mit 20 bis 500 MWh Jahresverbrauch zahlten in Österreich im zweiten Halbjahr 2025 laut Eurostat im Schnitt 23,2 ct/kWh ohne
            Umsatzsteuer, Betriebe mit 500 bis 2.000 MWh 19,9 ct/kWh. Das ist ein Durchschnitt inklusive Leistungs- und Grundpreisen – durch
            Eigenverbrauch vermeiden Sie vor allem den arbeitsabhängigen Teil.
          </Merkkasten>
        </Abschnitt>

        <Abschnitt id="privat" titel="Was kostet eine PV-Anlage fürs Eigenheim?">
          <Prosa>
            <p>
              <strong>Eine 10-kWp-Anlage auf einem Einfamilienhaus kostet 2026 als Richtwert rund 14.500 bis 17.500 € inklusive 20 %
              Umsatzsteuer, ein 10-kWh-Speicher weitere rund 7.000 bis 10.000 €.</strong> Anders als Betriebe können Private die Umsatzsteuer
              nicht als Vorsteuer abziehen; der Nullsteuersatz ist ausgelaufen.
            </p>
          </Prosa>
          <Tabelle
            caption="Eigenheim: Richtwerte brutto (inkl. 20 % USt), Stand September 2026"
            kopf={["Paket", "Richtpreis brutto", "EAG-Zuschuss bei Zuschlag"]}
            zeilen={[
              ["10 kWp ohne Speicher", "14.500–17.500 €", "1.500 € (Kat. A)"],
              ["10 kWp + 10 kWh Speicher", "21.500–27.500 €", "1.500 € + 1.500 €"],
              ["15 kWp + 15 kWh Speicher", "31.000–39.000 €", "2.100 € + 2.250 € (Kat. B)"],
            ]}
            hervorheben={1}
            minBreite={560}
            fussnote="Richtwerte auf Basis BMWET-Marktstatistik 2024 (10 kWp 1.336 €/kWp, Speicher 706 €/kWh, jeweils netto) zuzüglich 20 % USt. EAG-Zuschuss nur mit Zuschlag im Fördercall; Obergrenze 30 % der förderfähigen Nettokosten."
          />
          <Prosa>
            <p>
              Einnahmen aus der Einspeisung sind für Privatpersonen bis 12.500 kWh im Jahr einkommensteuerfrei, wenn die Anlage höchstens 35 kWp
              und 25 kW Anschlussleistung hat. Für hochwertige Chalets in alpinen Lagen mit hohen Schneelasten gelten eigene Kosten – siehe{" "}
              <TextLink href="/chalets">Photovoltaik für Chalets</TextLink>.
            </p>
          </Prosa>
        </Abschnitt>

        <Abschnitt id="angebot" titel="Worauf Sie beim Preis achten sollten">
          <Checkliste
            punkte={[
              "Ist der Preis netto oder brutto angegeben – und sind Statik, Kran, Netzanschluss und Regelungstechnik enthalten?",
              "Basiert die Anlagengröße auf Ihrem Lastgang (Viertelstundenwerte) oder einfach auf der Dachfläche?",
              "Wurde die Ertragsprognose standortbezogen gerechnet (Ausrichtung, Neigung, Verschattung, Schneelage)?",
              "Sind Module und Unterkonstruktion für die Schneelast- und Windzone des Standorts ausgelegt?",
              "Wer stellt Netzzugangsantrag, Fertigstellungsmeldung und Förderansuchen – und wer haftet für Fristen?",
              "Welche Garantien gelten, wer ist Ansprechpartner im Schadensfall, und ist ein Wartungsangebot enthalten?",
              "Ist die Anlage für Ansteuerbarkeit und Spitzenkappung nach ElWG vorbereitet?",
            ]}
          />
        </Abschnitt>

        <Abschnitt id="faq" titel="Häufige Fragen zu den Kosten">
          <Faq items={FAQ} />
        </Abschnitt>

        <Abschnitt id="passend" titel="Passend dazu">
          <LinkKarten
            links={[
              { href: "/gewerbe", titel: "Photovoltaik für Betriebe", text: "Planung nach Lastgang, Netzanschluss und Förderung aus einer Hand." },
              { href: "/ratgeber/einspeiseverguetung-2026", titel: "Einspeisetarif 2026", text: "OeMAG-Marktpreis und was der Überschuss bringt." },
              { href: "/service/finanzierung", titel: "Finanzierung & Leasing", text: "Investition ohne Eigenkapital organisieren." },
              { href: "/ratgeber/photovoltaik-lohnt-sich", titel: "Lohnt sich Photovoltaik 2026?", text: "Wann sich eine Anlage in Österreich rechnet." },
            ]}
          />
        </Abschnitt>

        <Abschnitt id="quellen" titel="Quellen">
          <ol className="list-decimal space-y-2 pl-5 text-[14.5px] leading-relaxed text-ink-600 marker:text-ink-500">
            {QUELLEN.map((q) => (
              <li key={q.url}>
                <a href={q.url} target="_blank" rel="noopener noreferrer" className="text-ink-700 underline decoration-ink-300 underline-offset-2 hover:text-ov-700">
                  {q.titel}
                </a>
                <span className="text-ink-500"> · abgerufen {q.stand}</span>
              </li>
            ))}
          </ol>
        </Abschnitt>

        <Prosa className="mt-6 text-[13.5px] text-ink-500">
          <p>Alle Preise sind Richtwerte zur Orientierung und ersetzen kein Angebot. Die Angaben zu Steuern und Förderung ersetzen keine Steuer- oder Rechtsberatung.</p>
        </Prosa>
      </ArtikelLayout>
    </>
  );
}
