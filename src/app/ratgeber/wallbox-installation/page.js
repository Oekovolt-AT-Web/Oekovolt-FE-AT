// src/app/ratgeber/wallbox-installation/page.js
//
// Handgebauter Ratgeber „Wallbox Installation Österreich“ (Gruppe R5).
// Quellen (Stand 09/2026):
// - E-Control, TOR Verteilernetzanschluss Niederspannung V1.3.1 (Meldung > 3,68 kVA, Summenleistung ≥ 10 kVA,
//   Kommunikation OCPP/EEBUS, Symmetrie max. 16 A, Zufallsverzögerung, > 250 kW Wirkleistungsvorgaben,
//   Konformität nach OVE-Richtlinie R 37)
// - Netz NÖ (bis 11 kW grundsätzlich möglich, darüber Netzbeurteilung + leistungsgemessener Tarif),
//   LINZ NETZ (226,63 €/kW exkl. USt., R-37-Prüfbericht ab 15.12.2026), Salzburg Netz (352,36 €/kW inkl. USt.)
// - hausbaumagazin.at (09/2026): Gerät 500–1.200 €, Installation 500–2.000 €, gesamt 1.000–2.500 €;
//   Zustimmungsfiktion im Wohnungseigentum für Langsamladen bis 5,5 kW
// - BMF-Erlass 24.10.2025 (32,806 ct/kWh), ÖGK (Wallbox beim Dienstnehmer bis 2.000 €), WKO/LBG (Sachbezug ab 2027)
// - umweltfoerderung.at / EMC Austria (eRide 2025 ausgeschöpft bzw. beendet; Neuauflage angekündigt)
// - OVE-Richtlinien R 30:2025 (wiederkehrende Prüfung) und R 2000-7-7N90 (überdachte Stellplätze)
// Bewusst keine Imports aus @/data/wallbox, @/data/solarrechner oder @/lib/rechner (DE-Werte).

import { PlugZap, Zap } from "lucide-react";

import ArtikelLayout from "@/components/Ratgeber/ArtikelLayout";
import {
  Ablauf,
  Abschnitt,
  Checkliste,
  KartenRaster,
  Kennzahlband,
  KurzFazit,
  LinkKarten,
  Merkkasten,
  Prosa,
  Tabelle,
  TextLink,
} from "@/components/Ratgeber/Bausteine";
import Faq from "@/components/ui/Faq";
import { artikelNachSlug, artikelPfad } from "@/lib/ratgeber";
import { BASE_URL } from "@/lib/site";

const SLUG = "wallbox-installation";
const PAGE_URL = `${BASE_URL}${artikelPfad(SLUG)}`;

// Seitenspezifische Angaben (Österreich) – ergänzen bzw. überschreiben den Registereintrag in @/lib/ratgeber.
const artikel = {
  ...artikelNachSlug(SLUG),
  title: "Wallbox Installation in Österreich: Kosten, Anmeldung, Ablauf",
  kurzTitel: "Wallbox Installation",
  description:
    "Wallbox Installation in Österreich: Kosten 1.000–2.500 €, Meldung beim Netzbetreiber nach TOR, 11 oder 22 kW, Förderung 2026 und Ladepunkte für Betriebe.",
  excerpt:
    "Was eine Wallbox mit Installation in Österreich kostet, was Sie dem Netzbetreiber melden müssen, wann 22 kW sinnvoll sind und wie Betriebe mehrere Ladepunkte mit Lastmanagement und Solarstrom betreiben.",
  veroeffentlicht: "2026-09-28",
  aktualisiert: "2026-09-28",
  kategorie: "E-Mobilität & Sektorkopplung",
  bild: "/Images/Dienstleistungen/Smartphone/wallbox-scaled.jpg",
  bildAlt: "Wallbox an der Außenwand eines modernen Gebäudes",
  keywords: [
    "Wallbox Installation Österreich",
    "Wallbox Kosten Österreich",
    "Wallbox anmelden Netzbetreiber",
    "Wallbox 11 kW oder 22 kW",
    "Wallbox Förderung 2026 Österreich",
    "Ladestation Betrieb Lastmanagement",
    "TOR Ladeeinrichtung",
  ],
};

export const metadata = {
  title: "Wallbox Installation Österreich: Kosten & Meldung | Ökovolt",
  description: artikel.description,
  keywords: artikel.keywords,
  alternates: { canonical: PAGE_URL },
  robots: { index: true, follow: true },
  openGraph: {
    type: "article",
    url: PAGE_URL,
    siteName: "Ökovolt Österreich",
    locale: "de_AT",
    title: artikel.title,
    description: artikel.description,
    publishedTime: artikel.veroeffentlicht,
    modifiedTime: artikel.aktualisiert,
    images: [{ url: `${BASE_URL}/og/ratgeber/wallbox-installation.jpg`, width: 1200, height: 630, alt: artikel.title }],
  },
  twitter: {
    card: "summary_large_image",
    title: artikel.title,
    description: artikel.description,
    images: [`${BASE_URL}/og/ratgeber/wallbox-installation.jpg`],
  },
};

const TOC = [
  { id: "kurz", label: "Das Wichtigste in Kürze" },
  { id: "kosten", label: "Was kostet die Installation?" },
  { id: "kostentreiber", label: "Kostentreiber" },
  { id: "leistung", label: "11 oder 22 kW?" },
  { id: "meldung", label: "Meldung & Netzbetreiber" },
  { id: "voraussetzungen", label: "Technische Voraussetzungen" },
  { id: "wohnbau", label: "Mehrparteienhaus" },
  { id: "pv", label: "Mit Solarstrom laden" },
  { id: "foerderung", label: "Förderung 2026" },
  { id: "gewerbe", label: "Ladepunkte im Betrieb" },
  { id: "ablauf", label: "Ablauf in 6 Schritten" },
  { id: "faq", label: "Häufige Fragen" },
];

const eur = (n) => Math.round(n).toLocaleString("de-DE") + " €";

// Ladezeit für 42 kWh (z. B. 60-kWh-Akku von 10 auf 80 %), rund 90 % Ladewirkungsgrad
const LADEMENGE = 42;
const ladezeit = (kw) => {
  const h = LADEMENGE / (kw * 0.9);
  const std = Math.floor(h);
  const min = Math.round(((h - std) * 60) / 5) * 5;
  return min === 60 ? `${std + 1} h 00 min` : `${std} h ${String(min).padStart(2, "0")} min`;
};

// Ladekosten-Vergleich: Referenzstrompreis BMF 2026 (Haushalt, brutto) und OeMAG-Sommermarktpreis PV 2026 (gerundet)
const KM = 15000;
const VERBRAUCH = 18; // kWh/100 km inkl. Ladeverluste, Annahme
const BEDARF = (KM * VERBRAUCH) / 100;
const STROM = 0.32806;
const SOLAR = 0.068;
const kostenMix = (q) => BEDARF * (1 - q) * STROM + BEDARF * q * SOLAR;

const FAQ = [
  {
    q: "Was kostet eine Wallbox mit Installation in Österreich?",
    a: "Für eine 11-kW-Wallbox im Einfamilienhaus werden 2026 meist 1.000 bis 2.500 € genannt: 500 bis 1.200 € für das Gerät und 500 bis 2.000 € für die Installation. Lange Kabelwege, Erdarbeiten, ein neuer Verteiler oder eine höhere Anschlussleistung beim Netzbetreiber können den Preis deutlich erhöhen.",
  },
  {
    q: "Muss ich eine Wallbox beim Netzbetreiber melden?",
    a: "Ja. Laut TOR Verteilernetzanschluss sind Ladeeinrichtungen mit einer Bemessungsleistung über 3,68 kVA dem Netzbetreiber zu melden – das betrifft praktisch jede 11- und 22-kW-Wallbox. Die Meldung übernimmt der Elektrotechniker über Datenblatt oder Online-Portal des Netzbetreibers.",
  },
  {
    q: "Brauche ich für eine 22-kW-Wallbox eine Genehmigung?",
    a: "Liegt die Summe aller Ladeeinrichtungen bei 10 kVA oder mehr, kann der Netzbetreiber den Anschluss wegen mangelnder Netzkapazität vorübergehend zur Prüfung aussetzen und muss binnen 4 Wochen Gründe und Alternativen nennen. Netz NÖ etwa führt über 11 kW eine gesonderte Netzbeurteilung durch und stellt auf einen leistungsgemessenen Tarif um.",
  },
  {
    q: "Darf ich eine Wallbox selbst installieren?",
    a: "Nein. Anschluss, Erstprüfung und Meldung darf nur ein befugter Elektrotechniker durchführen. Die Wallbox muss die TOR des Netzbetreibers erfüllen – ab 15. Dezember 2026 mit Prüfbericht nach OVE-Richtlinie R 37.",
  },
  {
    q: "Gibt es 2026 eine Förderung für Wallboxen?",
    a: "Die Bundesförderung eRide 2025 für private Wallboxen ist ausgeschöpft und beendet, jene für betriebliche Ladeinfrastruktur ebenfalls ausgeschöpft. Eine Neuauflage wurde angekündigt, ein Start war im August 2026 nicht bekannt. Einige Bundesländer fördern Ladeinfrastruktur in Mehrparteienhäusern.",
  },
  {
    q: "Reicht eine 11-kW-Wallbox?",
    a: "Für die meisten Fahrzeuge ja. Viele E-Autos laden mit Wechselstrom ohnehin höchstens mit 11 kW. Eine 22-kW-Box bringt nur etwas, wenn das Fahrzeug einen 22-kW-Onboard-Lader hat, kurze Standzeiten zu überbrücken sind und der Hausanschluss die Leistung hergibt.",
  },
  {
    q: "Darf ich im Wohnungseigentum eine Wallbox installieren?",
    a: "Für Langsamladestationen bis 5,5 kW gilt im Wohnungseigentum eine Zustimmungsfiktion: Die übrigen Eigentümer müssen innerhalb von zwei Monaten widersprechen, sonst gilt die Zustimmung als erteilt. Für 11-kW-Wallboxen gilt diese Erleichterung nicht.",
  },
  {
    q: "Darf der Arbeitgeber die Wallbox zu Hause bezahlen?",
    a: "Ja. Die Kostenübernahme für eine Ladeeinrichtung beim Dienstnehmer ist bis 2.000 € kein Sachbezug. Laden zu Hause kann 2026 mit bis zu 32,806 ct/kWh steuerfrei ersetzt werden, wenn die Lademenge dem Firmenfahrzeug nachweislich zugeordnet ist.",
  },
];

export default function WallboxInstallationPage() {
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
        author: { "@type": "Organization", name: "Ökovolt-Redaktion Österreich", "@id": `${BASE_URL}/#organization` },
        publisher: { "@id": `${BASE_URL}/#organization` },
        mainEntityOfPage: { "@type": "WebPage", "@id": PAGE_URL },
        image: `${BASE_URL}${artikel.bild}`,
        articleSection: artikel.kategorie,
        keywords: artikel.keywords.join(", "),
        timeRequired: `PT${artikel.lesezeit || 12}M`,
      },
      {
        "@type": "Service",
        "@id": `${PAGE_URL}/#service`,
        name: "Wallbox- und Ladeinfrastruktur-Installation",
        serviceType: "Installation von Ladeeinrichtungen für Elektrofahrzeuge",
        provider: { "@id": `${BASE_URL}/#organization` },
        areaServed: { "@type": "Country", name: "Österreich" },
      },
      {
        "@type": "HowTo",
        "@id": `${PAGE_URL}/#howto`,
        name: "Wallbox in Österreich installieren lassen – Ablauf",
        step: [
          "Vor-Ort-Check und Bedarf",
          "Wallbox und Leistung wählen",
          "Meldung beim Netzbetreiber",
          "Installation",
          "Erstprüfung und Inbetriebnahme",
          "Einweisung und Dokumentation",
        ].map((name, i) => ({ "@type": "HowToStep", position: i + 1, name, url: `${PAGE_URL}#ablauf` })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Startseite", item: BASE_URL },
          { "@type": "ListItem", position: 2, name: "Ratgeber", item: `${BASE_URL}/ratgeber` },
          { "@type": "ListItem", position: 3, name: artikel.kurzTitel, item: PAGE_URL },
        ],
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
            <span className="ov-text-gradient">Wallbox</span> Installation in Österreich: Kosten, Anmeldung, Ablauf
          </>
        }
        badge={
          <div className="flex items-center gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-ov-500 text-white">
              <PlugZap aria-hidden="true" className="h-6 w-6" />
            </span>
            <div>
              <p className="ov-num font-display text-[22px] font-extrabold leading-none text-ink-900">1.000–2.500 €</p>
              <p className="mt-1 text-[12.5px] leading-snug text-ink-500">11-kW-Wallbox inkl. Installation (Richtwert 2026)</p>
            </div>
          </div>
        }
        seitenCta={{ titel: "Ladepunkte für den Betrieb?", text: "Lastmanagement, PV-Überschuss und Meldung aus einer Hand.", href: "/ladeinfrastruktur", label: "Ladeinfrastruktur planen" }}
        cta={{
          title: "Ihre Wallbox – normgerecht installiert, gemeldet und mit PV vernetzt.",
          text: "Ökovolt aus Ostermiething (OÖ) installiert Wallboxen und Ladeparks in ganz Österreich – inklusive Meldung beim Netzbetreiber, Lastmanagement und Einbindung in Ihre Photovoltaikanlage.",
          primary: { label: "Wallbox anfragen", href: "/angebot?wallbox=1" },
          secondary: { label: "Ladeinfrastruktur für Betriebe", href: "/ladeinfrastruktur" },
        }}
      >
        <KurzFazit
          punkte={[
            "Eine 11-kW-Wallbox kostet in Österreich mit Installation meist 1.000 bis 2.500 € – die Installation macht oft mehr aus als das Gerät.",
            "Ladeeinrichtungen über 3,68 kVA müssen laut TOR dem Netzbetreiber gemeldet werden; ab 10 kVA Summenleistung kann er den Anschluss zur Prüfung aussetzen.",
            "11 kW reichen für die meisten Fahrzeuge – viele E-Autos laden mit Wechselstrom ohnehin nicht schneller.",
            "Ab 15. Dezember 2026 verlangen Netzbetreiber für Ladeeinrichtungen einen Prüfbericht nach OVE-Richtlinie R 37 statt einer Herstellererklärung.",
            "Die Bundesförderung eRide 2025 ist ausgeschöpft; Betriebe profitieren dafür von Laden ohne Sachbezug und Solarstrom vom eigenen Dach.",
          ]}
        />

        <Abschnitt id="kosten" titel="Was kostet eine Wallbox mit Installation in Österreich?">
          <Prosa>
            <p>
              <strong>Eine 11-kW-Wallbox kostet in Österreich inklusive fachgerechter Installation meist 1.000 bis 2.500 €.</strong> Für das Gerät
              werden 2026 rund 500 bis 1.200 € genannt, für die Installation 500 bis 2.000 € – je nach Kabelweg, Zählerverteiler und
              Montageort. Ein günstiges Gerät hilft wenig, wenn 20 Meter Leitung durch Keller, Wand und Erdreich verlegt werden müssen.
            </p>
          </Prosa>
          <Tabelle
            caption="Wallbox-Kosten nach Variante in Österreich, Richtwerte Stand September 2026"
            kopf={["Variante", "Gerät", "Installation", "Gesamt (ca.)"]}
            zeilen={[
              ["11 kW, kurzer Kabelweg, moderner Verteiler", "500–800 €", "500–900 €", "1.000–1.700 €"],
              ["11 kW, längerer Kabelweg oder Außenmontage", "600–1.200 €", "900–1.500 €", "1.500–2.500 €"],
              ["11 kW mit Erdarbeiten oder neuem Verteiler", "600–1.200 €", "ab 1.500 €", "ab 2.500 €"],
              ["22 kW (Netzbeurteilung nötig)", "700–1.200 €", "individuell", "individuell, plus ggf. Netzentgelt"],
            ]}
            hervorheben={3}
            minBreite={600}
            fussnote="Richtwerte für ein Einfamilienhaus auf Basis veröffentlichter Marktwerte (hausbaumagazin.at, 09/2026: Gerät 500–1.200 €, Installation 500–2.000 €, gesamt 1.000–2.500 €); die Aufteilung nach Varianten ist eine Einordnung innerhalb dieser Spannen. Keine Ökovolt-Preise; ein verbindliches Angebot setzt einen Vor-Ort-Check voraus."
          />
          <Prosa>
            <p>
              Für Betriebe mit mehreren Ladepunkten lässt sich kein Stückpreis seriös angeben: Hier bestimmen Lastmanagement, Backend,
              Leitungswege, Anschlussleistung und Abrechnung die Kosten. Wie eine Flotte wirtschaftlich geladen wird, beschreibt der
              Ratgeber <TextLink href="/ratgeber/e-flotte-laden-photovoltaik">E-Flotte laden mit Photovoltaik</TextLink>.
            </p>
          </Prosa>
        </Abschnitt>

        <Abschnitt id="kostentreiber" titel="Was den Preis nach oben treibt">
          <KartenRaster
            items={[
              { titel: "Kabelweg", text: "Der Abstand zwischen Verteiler und Stellplatz ist der größte Einzelposten. Innen und kurz ist günstig, Erdreich, Durchbrüche und Brandabschottungen sind es nicht." },
              { titel: "Fehlerstromschutz", text: "Pflicht bei jeder Wallbox. Hat das Gerät keine integrierte DC-Fehlerstromerkennung (6 mA), braucht es einen allstromsensitiven Fehlerstromschutzschalter Typ B – deutlich teurer als Typ A." },
              { titel: "Zählerverteiler", text: "Ältere Verteiler haben oft keinen Platz für einen zusätzlichen Stromkreis. Eine Erweiterung oder ein Tausch schlägt spürbar zu Buche." },
              { titel: "Anschlussleistung", text: "Reicht die vereinbarte Leistung nicht, verlangen Netzbetreiber ein Entgelt je zusätzlichem kW – etwa LINZ NETZ 226,63 € exkl. USt., Salzburg Netz 352,36 € inkl. USt. (Netzebene 7)." },
            ]}
          />
          <Merkkasten variant="tipp" titel="Leerrohr gleich mitdenken">
            Wer baut, saniert oder einen Carport errichtet, sollte Leerrohre zu allen Stellplätzen legen. Das kostet beim Bau wenig und macht
            spätere Ladepunkte deutlich günstiger – im Betrieb ebenso wie zu Hause. Überdachte Stellplätze lassen sich zusätzlich als{" "}
            <TextLink href="/ratgeber/solarcarport">Solarcarport</TextLink> nutzen.
          </Merkkasten>
        </Abschnitt>

        <Abschnitt id="leistung" titel="11 oder 22 kW – was brauchen Sie wirklich?">
          <Prosa>
            <p>
              <strong>Für die meisten Anwendungen reichen 11 kW, weil der Onboard-Lader im Fahrzeug die Ladeleistung am Wechselstrom begrenzt.</strong>{" "}
              Viele E-Autos laden mit Wechselstrom höchstens mit 11 kW; an einer 22-kW-Wallbox laden sie genauso schnell. Dazu kommt: Über
              11 kW verlangen Netzbetreiber eine gesonderte Netzbeurteilung, Netz NÖ etwa stellt die Bezugsanlage dann auf einen
              leistungsgemessenen Tarif um.
            </p>
          </Prosa>
          <Kennzahlband
            icon={Zap}
            wert="11 kW"
            titel="Reicht für eine volle Tagesstrecke in wenigen Stunden"
            text="Viele Fahrzeuge laden mit Wechselstrom höchstens mit 11 kW. Eine 22-kW-Wallbox lohnt sich nur mit passendem Onboard-Lader, kurzen Standzeiten und ausreichender Anschlussleistung."
          />
          <Tabelle
            caption={`Ladezeit für ${LADEMENGE} kWh nach Ladeleistung`}
            kopf={["Ladeleistung", "Beispiel", `Ladezeit für ${LADEMENGE} kWh`]}
            zeilen={[
              ["3,7 kW", "einphasig, 16 A", ladezeit(3.7)],
              ["5,5 kW", "Langsamladen (z. B. Wohnungseigentum)", ladezeit(5.5)],
              ["11 kW", "Standard-Wallbox, dreiphasig", ladezeit(11)],
              ["22 kW", "nur mit 22-kW-Onboard-Lader", ladezeit(22)],
            ]}
            hervorheben={2}
            markierteZeile={2}
            minBreite={520}
            fussnote={`${LADEMENGE} kWh entsprechen etwa einem 60-kWh-Akku von 10 auf 80 %. Gerechnet mit rund 90 % Ladewirkungsgrad.`}
          />
        </Abschnitt>

        <Abschnitt id="meldung" titel="Meldung beim Netzbetreiber: Was TOR und TAEV verlangen">
          <Prosa>
            <p>
              <strong>Jede Ladeeinrichtung mit mehr als 3,68 kVA Bemessungsleistung muss dem Netzbetreiber gemeldet werden – das regeln die
              Technischen und organisatorischen Regeln (TOR) der E-Control und die Technischen Anschlussbedingungen (TAEV) der Netzbetreiber.</strong>{" "}
              Die Meldung übernimmt der Elektrotechniker, entweder über das Datenblatt „Ladeeinrichtungen für Elektrofahrzeuge“ oder über das
              Online-Portal des Netzbetreibers, etwa das Online-Meldewesen der Salzburg Netz.
            </p>
          </Prosa>
          <Tabelle
            caption="Regeln für Ladeeinrichtungen nach TOR Verteilernetzanschluss Niederspannung (Version 1.3.1)"
            kopf={["Thema", "Regel"]}
            zeilen={[
              ["Meldepflicht", "Ladeeinrichtungen über 3,68 kVA sind zu melden; auch mobile Ladegeräte mit Steuerbox (Ladebetriebsart 2) zählen als Ladeeinrichtung"],
              ["Summenleistung ≥ 10 kVA", "Netzbetreiber kann den Anschluss bei mangelnder Netzkapazität vorübergehend aussetzen und muss binnen 4 Wochen Gründe, mögliche Leistung, Maßnahmen und Alternativen nennen"],
              ["Ausnahme", "kein Aussetzen, wenn ein Energiemanagement sicherstellt, dass die vereinbarte Leistung nicht überschritten wird"],
              ["Anschluss & Symmetrie", "über 3,68 kVA grundsätzlich Drehstrom; Unsymmetrie höchstens 16 A je Leiter; bei mehreren Ladepunkten Phasen zyklisch tauschen"],
              ["Kommunikation", "bidirektionale digitale Schnittstelle mit offenem Protokoll (z. B. OCPP, EEBUS), externe Begrenzung der Ladeleistung"],
              ["Ladeprogramme", "reduzierte Leistung und Zeitsteuerung; bei Startzeit zufällige Verzögerung von 0 bis 300 Sekunden"],
              ["Konformität", "Prüfbericht nach OVE-Richtlinie R 37 von einer akkreditierten Prüfstelle; bis 14.12.2026 genügt laut Netzbetreibern eine Herstellererklärung"],
              ["Rückspeisung (V2H/V2G)", "im Einspeisemodus gelten die TOR Stromerzeugungsanlagen"],
            ]}
            minBreite={680}
            fussnote="Quelle: E-Control, TOR Verteilernetzanschluss Niederspannung V1.3.1; LINZ NETZ, Salzburg Netz, Netz NÖ. Maßgeblich sind der Originaltext und die Vorgaben Ihres Netzbetreibers."
          />
          <Merkkasten variant="recht" titel="Wie die Netzbetreiber das umsetzen">
            Netz NÖ hält fest, dass eine Ladestation bis 11 kW (dreiphasig) je Netzanschlusspunkt grundsätzlich möglich ist; darüber ist eine
            gesonderte Netzbeurteilung nötig. LINZ NETZ und Salzburg Netz gehen davon aus, dass 11 kW in den allermeisten Fällen ohne
            Netzausbau möglich sind. Höhere Leistungen oder mehrere Ladepunkte können eine Erhöhung der Anschlussleistung erfordern – bei
            Netzausbau kann das Wochen bis über ein Jahr dauern. Den Rahmen für Erzeuger und Netzanschluss erklärt der Ratgeber{" "}
            <TextLink href="/ratgeber/tor-erzeuger-netzanschluss">TOR Erzeuger und Netzanschluss</TextLink>.
          </Merkkasten>
        </Abschnitt>

        <Abschnitt id="voraussetzungen" titel="Technische Voraussetzungen">
          <Checkliste
            punkte={[
              "Drehstromanschluss mit 400 V; eine Schuko-Steckdose ist für regelmäßiges Laden nicht ausgelegt.",
              "Eigener Stromkreis ab Verteiler mit eigenem Leitungsschutz und ausreichendem Leitungsquerschnitt.",
              "Fehlerstromschutz: Typ A genügt, wenn die Wallbox eine DC-Fehlerstromerkennung (6 mA) hat, sonst Typ B.",
              "Überspannungsschutz im Verteiler prüfen – besonders bei Anlagen mit PV.",
              "Montageort mit Schutz vor mechanischer Beschädigung; im Freien mindestens IP54.",
              "In Garagen, überdachten Stellplätzen und Parkdecks die OVE-Richtlinie R 2000-7-7N90 (Ergänzung zu OVE E 8101) beachten.",
              "Offene Schnittstelle (OCPP, EEBUS oder Modbus) für Lastmanagement und PV-Überschussladen.",
              "Hausanschluss und vereinbarte Anschlussleistung prüfen – kritisch mit Wärmepumpe und weiteren Großverbrauchern.",
            ]}
          />
          <Prosa>
            <p>
              Nach der Installation führt der Elektrotechniker die Erstprüfung durch und dokumentiert sie im Prüfbefund. In Betrieben sind
              Ladeeinrichtungen Teil der elektrischen Anlage und wiederkehrend zu prüfen; die OVE-Richtlinie R 30 (Ausgabe 2025) beschreibt
              den sicheren Betrieb und die wiederkehrende Prüfung von Ladeeinrichtungen. Mehr im Ratgeber{" "}
              <TextLink href="/ratgeber/e-check-photovoltaik">E-Check für PV-Anlagen</TextLink>.
            </p>
          </Prosa>
        </Abschnitt>

        <Abschnitt id="wohnbau" titel="Wallbox im Mehrparteienhaus und im Wohnungseigentum">
          <Prosa>
            <p>
              <strong>Im Wohnungseigentum ist die Errichtung einer Langsamladestation bis 5,5 kW erleichtert: Widersprechen die übrigen
              Eigentümer nicht innerhalb von zwei Monaten, gilt die Zustimmung als erteilt.</strong> Für 11-kW-Wallboxen gilt diese
              Zustimmungsfiktion nicht. Sinnvoll ist ohnehin ein Gesamtkonzept für die Garage mit gemeinsamer Leitungsinfrastruktur und
              Lastmanagement, damit spätere Ladepunkte ohne neuen Anschluss möglich sind.
            </p>
          </Prosa>
          <Tabelle
            caption="Landesförderungen für Ladeinfrastruktur in Wohnhäusern (Auswahl), Stand August 2026"
            kopf={["Bundesland", "Förderung"]}
            zeilen={[
              ["Oberösterreich", "50 %, max. 5.000 € für Mehrwohnhäuser, Antrag vor Baubeginn"],
              ["Steiermark", "5.000 € Basis plus 2.500 € je 50 weitere Ladepunkte (mit Lastmanagement)"],
              ["Vorarlberg", "300 € je Stellplatz, max. 10.000 € (Leitungsinfrastruktur)"],
              ["Tirol", "25 % bei Sanierung (vorbereitende Infrastruktur, nicht die Wallbox selbst)"],
            ]}
            minBreite={520}
            fussnote="Quelle: EMC Austria, Förderübersicht (Stand 17.08.2026). Bedingungen und Budgets ändern sich – vor Beauftragung beim Land prüfen."
          />
        </Abschnitt>

        <Abschnitt id="pv" titel="Mit eigenem Solarstrom laden">
          <Prosa>
            <p>
              <strong>Beim PV-Überschussladen lädt die Wallbox vorrangig dann, wenn die Photovoltaikanlage mehr erzeugt, als das Gebäude
              gerade braucht.</strong> Ein Energiemanagement misst am Netzanschlusspunkt und regelt den Ladestrom nach. Der Unterschied ist
              erheblich – eingespeister Solarstrom brachte im Sommer 2026 laut OeMAG nur rund 6,1 bis 6,8 ct/kWh.
            </p>
          </Prosa>
          <Tabelle
            caption={`Ladekosten bei ${KM.toLocaleString("de-DE")} km im Jahr: Netzstrom gegenüber eigenem Solarstrom`}
            kopf={["Strombezug", "Bewertung", "Kosten pro Jahr"]}
            zeilen={[
              ["Nur Netzstrom", "32,806 ct/kWh (BMF-Referenzwert 2026)", eur(kostenMix(0))],
              ["Hälfte Solarstrom", "Mischpreis", eur(kostenMix(0.5))],
              ["Nur eigener Solarstrom", "6,8 ct/kWh entgangene Einspeisung", eur(kostenMix(1))],
            ]}
            hervorheben={2}
            markierteZeile={2}
            minBreite={480}
            fussnote={`Annahmen: ${KM.toLocaleString("de-DE")} km, ${VERBRAUCH} kWh je 100 km inkl. Ladeverluste; Netzstrom mit dem vom Finanzministerium für 2026 festgelegten Durchschnittspreis (brutto), Solarstrom mit dem gerundeten OeMAG-Sommermarktpreis PV 2026. Tatsächliche Tarife weichen ab.`}
          />
          <Prosa>
            <p>
              Wichtig ist eine Wallbox mit automatischer Phasenumschaltung und offener Schnittstelle – sie nutzt auch kleine Überschüsse ab
              rund 1,4 kW. Wie das im Detail funktioniert, zeigt der Ratgeber{" "}
              <TextLink href="/ratgeber/pv-ueberschussladen">PV-Überschussladen</TextLink>; die passende Anlage beschreibt{" "}
              <TextLink href="/ratgeber/solaranlage-kosten">Photovoltaik-Kosten</TextLink>.
            </p>
          </Prosa>
        </Abschnitt>

        <Abschnitt id="foerderung" titel="Förderung 2026">
          <Merkkasten variant="wichtig" titel="Bundesförderung derzeit ausgeschöpft">
            Die Bundesförderung eRide 2025 für private Wallboxen war Mitte März 2026 ausgeschöpft und wurde mit 31. März 2026 formal beendet.
            Auch die Förderung für betriebliche Ladeinfrastruktur (bis zu 30 % der umweltrelevanten Kosten) ist ausgeschöpft; nur bereits
            registrierte Projekte können noch eingereicht werden. Das Mobilitätsministerium hat im April 2026 eine Neuauflage angekündigt,
            ein Startdatum war im August 2026 nicht bekannt.
          </Merkkasten>
          <Prosa>
            <p>
              Bis dahin lohnt der Blick auf die Landesförderungen (siehe oben) und auf steuerliche Vorteile im Betrieb: Laden am Arbeitsplatz
              ist kein Sachbezug, und eine Wallbox beim Dienstnehmer kann der Arbeitgeber bis 2.000 € ohne Sachbezug übernehmen. Den aktuellen
              Förderstand für Ihr Projekt prüft der <TextLink href="/foerdercheck">Förder-Check</TextLink>.
            </p>
          </Prosa>
        </Abschnitt>

        <Abschnitt id="gewerbe" titel="Ladepunkte im Betrieb, Hotel und bei Gemeinden">
          <Prosa>
            <p>
              <strong>Ab mehreren Ladepunkten entscheidet nicht die einzelne Wallbox, sondern das Gesamtsystem aus Anschlussleistung,
              Lastmanagement, Backend und Abrechnung.</strong> Ohne dynamisches Lastmanagement überschreiten schon wenige gleichzeitig
              ladende Fahrzeuge die vereinbarte Leistung – mit ihm lassen sich viele Ladepunkte am bestehenden Anschluss betreiben.
            </p>
          </Prosa>
          <Tabelle
            caption="Worauf Betriebe bei Ladepunkten achten müssen"
            kopf={["Thema", "Was zu klären ist"]}
            zeilen={[
              ["Lastmanagement", "dynamische Regelung am Netzanschlusspunkt, Prioritäten je Fahrzeug, PV-Überschuss; vermeidet Aussetzen durch den Netzbetreiber ab 10 kVA"],
              ["Anschlussleistung", "Lastgang prüfen, Erhöhung und Netzbereitstellungsentgelt nur wenn nötig"],
              ["Backend & Abrechnung", "OCPP-Backend, RFID, Zuordnung zu Fahrzeugen und Kostenstellen; bei kWh-Verrechnung an Dritte eichrechtskonforme Messung"],
              ["Steuer & Lohnverrechnung", "Laden am Betrieb ohne Sachbezug; Heimladen 2026 bis 32,806 ct/kWh mit Nachweis; E-Dienstwagen ab 2027 mit 0,375 % Sachbezug (Kundmachung ausstehend)"],
              ["Große Ladeparks", "über 250 kW Ladeleistung Vereinbarung über Wirkleistungsvorgaben mit dem Netzbetreiber möglich"],
              ["Prüfung", "Erstprüfung, wiederkehrende Prüfung nach ESV 2012 und OVE-Richtlinie R 30"],
            ]}
            minBreite={640}
          />
          <Prosa>
            <p>
              Ökovolt plant und errichtet <TextLink href="/ladeinfrastruktur">Ladeinfrastruktur</TextLink> für Betriebe, Hotels und Gemeinden
              – abgestimmt auf PV-Anlage, <TextLink href="/gewerbespeicher">Gewerbespeicher</TextLink> und Energiemanagement. Welche Geräte wir
              einsetzen, zeigt die Seite <TextLink href="/produkte/wallbox">Wallbox</TextLink>; die Steuerung mehrerer Verbraucher erklärt der
              Ratgeber <TextLink href="/ratgeber/energiemanagementsystem">Energiemanagementsystem</TextLink>.
            </p>
          </Prosa>
        </Abschnitt>

        <Abschnitt id="ablauf" titel="So läuft die Installation ab">
          <Ablauf
            schritte={[
              ["Vor-Ort-Check und Bedarf", "Verteiler, Kabelweg, Stellplatz und Anschlussleistung prüfen; bei Betrieben Lastgang und Fahrprofile auswerten."],
              ["Wallbox und Leistung wählen", "11 oder 22 kW, festes Kabel oder Steckdose, offene Schnittstelle, Phasenumschaltung, Prüfbericht nach OVE R 37."],
              ["Meldung beim Netzbetreiber", "Datenblatt bzw. Online-Meldung durch den Elektrotechniker; ab 10 kVA Summenleistung Rückmeldung des Netzbetreibers abwarten."],
              ["Installation", "Leitung verlegen, Schutzorgane setzen, Wallbox montieren und anschließen – bei Einzelgeräten meist an einem Tag."],
              ["Erstprüfung und Inbetriebnahme", "Messungen und Funktionsprüfung mit Prüfbefund, Parametrierung (Ländereinstellung Österreich), Lastmanagement und PV-Überschuss einrichten."],
              ["Einweisung und Dokumentation", "Bedienung, App bzw. Backend, Ladeprofile; Unterlagen für Netzbetreiber, Versicherung und Lohnverrechnung."],
            ]}
          />
        </Abschnitt>

        <Abschnitt id="faq" titel="Häufige Fragen zur Wallbox-Installation in Österreich">
          <Faq items={FAQ} />
        </Abschnitt>

        <Abschnitt id="quellen" titel="Quellen">
          <Prosa>
            <ul>
              <li>
                <TextLink href="https://www.e-control.at/documents/1785851/1811582/TOR_Verteilernetzanschluss_-_Niederspannung_V1.3.1.pdf/64c9e5f0-e38d-351a-b52e-a1b0e07077ae?t=1774007041985">E-Control – TOR Verteilernetzanschluss Niederspannung, Version 1.3.1</TextLink> (Stand 03/2026)
              </li>
              <li>
                <TextLink href="https://netz-noe.at/strom/meldepflichtige-geraete">Netz Niederösterreich – Meldepflichtige Geräte</TextLink> (Stand 09/2026)
              </li>
              <li>
                <TextLink href="https://www.linznetz.at/portal/de/home/strom/mein_stromanschluss/e_ladeeinrichtung">LINZ NETZ – E-Ladeeinrichtung</TextLink> (Stand 09/2026)
              </li>
              <li>
                <TextLink href="https://www.salzburgnetz.at/stromnetz/ladestationen-fuer-e-mobilitaet.html">Salzburg Netz – Ladestationen für E-Mobilität</TextLink> (Stand 09/2026)
              </li>
              <li>
                <TextLink href="https://www.hausbaumagazin.at/wallbox-kosten-anmeldung-oesterreich/">hausbaumagazin.at – Wallbox zu Hause: Kosten, Anmeldung und Recht in Österreich</TextLink> (Stand 09/2026)
              </li>
              <li>
                <TextLink href="https://www.ove.at/ove-news/details/elektromobilitaet-aktualisierte-und-neue-ove-richtlinien/">OVE – Elektromobilität: aktualisierte und neue OVE-Richtlinien (R 30, R 37)</TextLink> (Stand 09/2026)
              </li>
              <li>
                <TextLink href="https://www.emcaustria.at/foerderungen-finanzielle-anreize/">EMC Austria – Förderungen und finanzielle Anreize</TextLink> (Stand 08/2026)
              </li>
              <li>
                <TextLink href="https://www.oegk.at/cdscontent/?contentid=10007.905973&portal=oegkdgportal">ÖGK – Aufladen von Elektrofahrzeugen: Neuregelungen</TextLink> (Stand 09/2026)
              </li>
            </ul>
          </Prosa>
        </Abschnitt>

        <Abschnitt id="passend" titel="Passend dazu">
          <LinkKarten
            links={[
              { href: "/ladeinfrastruktur", titel: "Ladeinfrastruktur für Betriebe", text: "Ladeparks mit Lastmanagement und PV." },
              { href: "/produkte/wallbox", titel: "Unsere Wallbox-Lösungen", text: "Geräte, die wir installieren – und warum." },
              { href: "/ratgeber/e-flotte-laden-photovoltaik", titel: "E-Flotte laden", text: "Sachbezug, Lastmanagement und Abrechnung." },
              { href: "/ratgeber/pv-ueberschussladen", titel: "PV-Überschussladen", text: "E-Autos mit eigenem Solarstrom laden." },
            ]}
          />
        </Abschnitt>
      </ArtikelLayout>
    </>
  );
}
