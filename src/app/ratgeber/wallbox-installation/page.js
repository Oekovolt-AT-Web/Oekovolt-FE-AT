// src/app/ratgeber/wallbox-installation/page.js

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
  Zwischentitel,
} from "@/components/Ratgeber/Bausteine";
import Faq from "@/components/ui/Faq";
import { WALLBOX, spanne } from "@/data/wallbox";
import { ANNAHMEN } from "@/data/solarrechner";
import { artikelNachSlug, artikelPfad } from "@/lib/ratgeber";

const BASE_URL = "https://www.oekovolt.com";
const SLUG = "wallbox-installation";
const artikel = artikelNachSlug(SLUG);
const PAGE_URL = `${BASE_URL}${artikelPfad(SLUG)}`;

// Deutschlandspezifisch (§ 14a EnWG, VDE-AR-N 4100) -> kein hreflang.
export const metadata = {
  title: "Wallbox Installation: Kosten & Voraussetzungen | Ökovolt",
  description: artikel.description,
  keywords: artikel.keywords,
  alternates: { canonical: PAGE_URL },
  robots: { index: true, follow: true },
  openGraph: {
    type: "article",
    url: PAGE_URL,
    siteName: "Ökovolt Österreich",
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
  { id: "gebaeude", label: "Kosten nach Gebäudetyp" },
  { id: "leistung", label: "11 oder 22 kW?" },
  { id: "voraussetzungen", label: "Technische Voraussetzungen" },
  { id: "anmeldung", label: "Anmeldung & § 14a EnWG" },
  { id: "pv", label: "Mit eigenem Solarstrom laden" },
  { id: "foerderung", label: "Förderung 2026" },
  { id: "ablauf", label: "Ablauf in 5 Schritten" },
  { id: "faq", label: "Häufige Fragen" },
];

// Ladekosten-Vergleich: Netzstrom gegen eigenen Solarstrom.
// Strompreis kommt aus derselben Quelle wie der Solarrechner.
const KM_PRO_JAHR = 15000;
const SOLAR_CT = 0.08; // Opportunitaetskosten: entgangene Einspeiseverguetung (~7,7 ct), aufgerundet, EUR/kWh
const kwhProJahr = (KM_PRO_JAHR / 100) * WALLBOX.verbrauchProHundert;
const kostenNetz = kwhProJahr * ANNAHMEN.strompreis;
const kostenSolar = kwhProJahr * SOLAR_CT;
const kostenMix = kwhProJahr * (0.5 * SOLAR_CT + 0.5 * ANNAHMEN.strompreis);

const eur = (n) => Math.round(n).toLocaleString("de-DE") + " €";
const kommazahl = (n) => String(n).replace(".", ",");

// Ladezeit für 42 kWh (z. B. 60-kWh-Akku von 10 auf 80 %), ~90 % Ladewirkungsgrad
const LADEMENGE = 42;
const ladezeit = (kw) => {
  const h = LADEMENGE / (kw * 0.9);
  const std = Math.floor(h);
  const min = Math.round(((h - std) * 60) / 5) * 5;
  return `${std} h ${String(min).padStart(2, "0")} min`;
};

const FAQ = [
  {
    q: "Was kostet eine 11-kW-Wallbox inklusive Installation?",
    a: `Zwischen ${WALLBOX.gesamtVon.toLocaleString("de-DE")} und ${WALLBOX.gesamtBis.toLocaleString("de-DE")} € bei einem typischen Einfamilienhaus. Bei kurzem Kabelweg und modernem Zählerschrank liegt man am unteren Ende, bei Altbau, langen Wegen oder Erdarbeiten deutlich darüber. Der größte Kostentreiber ist die Installation, nicht das Gerät.`,
  },
  {
    q: "Brauche ich eine Genehmigung für eine Wallbox?",
    a: "Ladeeinrichtungen bis 12 kVA – also die üblichen 11-kW-Wallboxen – müssen dem Netzbetreiber vor Inbetriebnahme gemeldet werden; eine Genehmigung ist nicht nötig. Darüber, etwa bei 22 kW, ist eine Zustimmung des Netzbetreibers erforderlich, die je nach Netzsituation einige Wochen dauern kann.",
  },
  {
    q: "Kann ich eine Wallbox selbst installieren?",
    a: "Nein. Anschluss und Anmeldung darf nur ein Elektrofachbetrieb vornehmen, der im Installateurverzeichnis eines Netzbetreibers eingetragen ist (NAV und VDE-AR-N 4100). Eine Eigeninstallation ist unzulässig und gefährdet Versicherungsschutz und Gewährleistung.",
  },
  {
    q: "Wird die Installation einer Wallbox gefördert?",
    a: `Für Einfamilienhäuser gibt es 2026 keine Bundesförderung. Nutzbar sind der Handwerkerbonus nach § 35a EStG (${WALLBOX.handwerkerbonus.anteil * 100} % der Arbeitskosten, maximal ${WALLBOX.handwerkerbonus.maxProJahr.toLocaleString("de-DE")} € Steuerermäßigung im Jahr) und reduzierte Netzentgelte nach § 14a EnWG. Für Mehrparteienhäuser läuft bis ${WALLBOX.mfhProgramm.bis} das Bundesprogramm „Laden im Mehrparteienhaus“.`,
  },
  {
    q: "Lohnt sich eine 22-kW-Wallbox?",
    a: "Für die meisten Privatnutzer nicht. Viele Elektroautos laden am Wechselstrom ohnehin nur mit maximal 11 kW – an einer 22-kW-Box laden sie deshalb nicht schneller. Sinnvoll wird 22 kW erst, wenn das Fahrzeug einen entsprechenden Onboardlader hat, kurze Ladezeiten nötig sind und der Hausanschluss die Last verkraftet.",
  },
  {
    q: "Darf der Netzbetreiber meine Wallbox drosseln?",
    a: `Ja, Wallboxen über 4,2 kW, die seit dem 1. Januar 2024 in Betrieb gehen, sind steuerbare Verbrauchseinrichtungen nach § 14a EnWG. Bei drohender Netzüberlastung darf der Netzbetreiber die Leistung vorübergehend auf mindestens ${kommazahl(WALLBOX.paragraf14a.drosselungKw)} kW reduzieren – im Gegenzug sinken Ihre Netzentgelte. Abschalten darf er die Wallbox nicht.`,
  },
  {
    q: "Kann ich die Wallbox mit meiner Solaranlage kombinieren?",
    a: `Ja, über das sogenannte Überschussladen. Die Wallbox lädt dann vorrangig, wenn die PV-Anlage mehr produziert als das Haus verbraucht. Bei ${KM_PRO_JAHR.toLocaleString("de-DE")} km im Jahr kostet Sie das Laden mit Netzstrom rund ${eur(kostenNetz)}, mit eigenem Solarstrom etwa ${eur(kostenSolar)}. Voraussetzung ist eine steuerbare Wallbox und ein Energiemanagementsystem.`,
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
        author: { "@type": "Organization", name: "Ökovolt-Redaktion", "@id": `${BASE_URL}/#organization` },
        publisher: { "@id": `${BASE_URL}/#organization` },
        mainEntityOfPage: { "@type": "WebPage", "@id": PAGE_URL },
        image: `${BASE_URL}${artikel.bild}`,
        articleSection: artikel.kategorie,
        keywords: artikel.keywords.join(", "),
        timeRequired: `PT${artikel.lesezeit}M`,
      },
      {
        // Ökovolt ist der ausführende Betrieb – relevant für "Wallbox
        // Installation in der Nähe" und das lokale Suchergebnis.
        "@type": "Service",
        "@id": `${PAGE_URL}/#service`,
        name: "Wallbox Installation",
        serviceType: "Installation von Ladestationen für Elektrofahrzeuge",
        provider: { "@id": `${BASE_URL}/#organization` },
        areaServed: { "@type": "Place", name: "Allgäu, Schwaben und Bayern" },
      },
      {
        "@type": "HowTo",
        "@id": `${PAGE_URL}/#howto`,
        name: "Wallbox installieren lassen – Ablauf",
        step: [
          "Beratung & Vor-Ort-Check",
          "Wallbox auswählen",
          "Anmeldung beim Netzbetreiber",
          "Installation",
          "Inbetriebnahme & Einweisung",
        ].map((name, i) => ({ "@type": "HowToStep", position: i + 1, name, url: `${PAGE_URL}#ablauf` })),
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
            <span className="ov-text-gradient">Wallbox</span> Installation: Kosten, Voraussetzungen & Ablauf
          </>
        }
        badge={
          <div className="flex items-center gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-ov-500 text-white">
              <PlugZap aria-hidden="true" className="h-6 w-6" />
            </span>
            <div>
              <p className="ov-num font-display text-[22px] font-extrabold leading-none text-ink-900">{spanne([WALLBOX.gesamtVon, WALLBOX.gesamtBis])}</p>
              <p className="mt-1 text-[12.5px] leading-snug text-ink-500">11-kW-Wallbox inkl. Installation</p>
            </div>
          </div>
        }
        seitenCta={{ titel: "Solar laden statt tanken", text: "Was Laden mit eigenem Solarstrom gegenüber Netzstrom spart.", href: "/rechner/wallbox", label: "Zum Laderechner" }}
        cta={{
          title: "Ihre Wallbox – sauber installiert und mit PV vernetzt.",
          text: "Als eingetragener Elektrofachbetrieb übernehmen wir Vor-Ort-Check, Anmeldung, Installation und die Einbindung in Ihre Photovoltaikanlage.",
          primary: { label: "Wallbox-Angebot anfragen", href: "/angebot?wallbox=1" },
          secondary: { label: "Ladekosten berechnen", href: "/rechner/wallbox" },
        }}
      >
        <KurzFazit
          punkte={[
            `Eine 11-kW-Wallbox kostet mit Installation ${spanne([WALLBOX.gesamtVon, WALLBOX.gesamtBis])}.`,
            "Die Installation macht meist mehr aus als das Gerät – der Kabelweg ist der größte Kostentreiber.",
            "Bis 12 kVA (11 kW) genügt die Anmeldung beim Netzbetreiber, darüber braucht es seine Zustimmung.",
            "Für die allermeisten Privatnutzer reicht 11 kW: Viele E-Autos laden am Wechselstrom ohnehin nicht schneller.",
            "Seit 2024 gilt § 14a EnWG: Der Netzbetreiber darf kurzzeitig drosseln, dafür sinken die Netzentgelte.",
          ]}
        />

        <Abschnitt id="kosten" titel="Was kostet eine Wallbox mit Installation?">
          <Prosa>
            <p>
              <strong>Eine 11-kW-Wallbox kostet inklusive fachgerechter Installation im Einfamilienhaus meist {spanne([WALLBOX.gesamtVon, WALLBOX.gesamtBis])}.</strong>{" "}
              Der Gesamtpreis besteht aus Gerät und Elektroinstallation – und die Installation macht in der Regel den größeren Teil aus. Ein günstiges Gerät
              bringt wenig, wenn 20 Meter Kabel durch Keller und Außenwand müssen.
            </p>
          </Prosa>
          <Tabelle
            caption="Wallbox-Kosten nach Variante, Stand September 2026"
            kopf={["Variante", "Gerät", "Installation", "Gesamt"]}
            zeilen={WALLBOX.varianten.map((v) => [v.name, spanne(v.geraet), spanne(v.montage), spanne(v.gesamt)])}
            hervorheben={3}
            minBreite={560}
            fussnote="Richtwerte für ein Einfamilienhaus, Stand September 2026. Enthalten sind Gerät, Elektroinstallation, Schutzorgane und die Anmeldung beim Netzbetreiber."
          />

          <Zwischentitel>Was den Preis nach oben treibt</Zwischentitel>
          <KartenRaster
            items={[
              { titel: "Kabelweg", text: "Der Abstand zwischen Zählerschrank und Stellplatz ist der größte Einzelposten. Kurz und innen liegend ist günstig, Erdreich und Wanddurchbrüche sind es nicht." },
              { titel: "Fehlerstromschutz", text: "Pflicht bei jeder Wallbox. Hat das Gerät keine integrierte DC-Fehlerstromerkennung (6 mA), braucht es den deutlich teureren allstromsensitiven FI Typ B." },
              { titel: "Zählerschrank", text: "Ältere Verteilungen haben oft keinen Platz für den zusätzlichen Stromkreis. Eine Ertüchtigung oder ein Tausch schlägt spürbar zu Buche." },
              { titel: "Erdung", text: "In Bestandsgebäuden ohne normgerechte Erdungsanlage muss nachgerüstet werden, bevor die Wallbox ans Netz darf." },
            ]}
          />
        </Abschnitt>

        <Abschnitt id="gebaeude" titel="Installationskosten nach Gebäudetyp">
          <Prosa>
            <p>Woran Sie ungefähr ablesen können, wo Ihr Projekt landet – die Werte betreffen nur die Installation, ohne Gerät.</p>
          </Prosa>
          <Tabelle
            caption="Installationskosten einer Wallbox nach Gebäudetyp"
            kopf={["Gebäudetyp", "Installation", "Typischer Grund"]}
            zeilen={WALLBOX.gebaeude.map((g) => [g.typ, spanne(g.kosten), g.grund])}
            hervorheben={1}
            minBreite={600}
          />
        </Abschnitt>

        <Abschnitt id="leistung" titel="11 oder 22 kW – was brauchen Sie wirklich?">
          <Prosa>
            <p>
              Die kurze Antwort: Für die allermeisten Privathaushalte reicht 11 kW. Der Grund liegt nicht an der Wallbox, sondern am Auto – der
              Onboardlader im Fahrzeug begrenzt die Ladeleistung am Wechselstrom.
            </p>
          </Prosa>
          <Kennzahlband
            icon={Zap}
            wert="11 kW"
            titel="Reicht für eine volle Tagesstrecke in rund 4 Stunden"
            text="Viele Fahrzeuge laden am Wechselstrom maximal mit 11 kW. An einer 22-kW-Wallbox laden sie exakt genauso schnell – Sie zahlen für Leistung, die nie ankommt."
          />
          <Tabelle
            caption={`Ladezeit für ${LADEMENGE} kWh nach Ladeleistung`}
            kopf={["Ladeleistung", "Beispiel", `Ladezeit für ${LADEMENGE} kWh`]}
            zeilen={[
              ["3,7 kW", "einphasig / Überschussladen", ladezeit(3.7)],
              [`${kommazahl(WALLBOX.paragraf14a.drosselungKw)} kW`, "Mindestleistung bei § 14a-Drosselung", ladezeit(WALLBOX.paragraf14a.drosselungKw)],
              ["11 kW", "Standard-Wallbox, dreiphasig", ladezeit(11)],
              ["22 kW", "nur mit 22-kW-Onboardlader", ladezeit(22)],
            ]}
            hervorheben={2}
            markierteZeile={2}
            minBreite={520}
            fussnote={`${LADEMENGE} kWh entsprechen etwa einem 60-kWh-Akku von 10 auf 80 % oder rund ${Math.round((LADEMENGE / WALLBOX.verbrauchProHundert) * 100)} km Reichweite. Gerechnet mit 90 % Ladewirkungsgrad.`}
          />
          <Prosa>
            <p>
              22 kW lohnt sich nur, wenn drei Dinge zusammenkommen: Ihr Fahrzeug hat einen 22-kW-Onboardlader, Sie brauchen regelmäßig kurze Ladezeiten,
              und Ihr Hausanschluss verkraftet die Last. Sonst ist das Geld in einer guten 11-kW-Box mit Überschussladen besser angelegt.
            </p>
          </Prosa>
        </Abschnitt>

        <Abschnitt id="voraussetzungen" titel="Technische Voraussetzungen">
          <Checkliste
            punkte={[
              "Dreiphasiger Drehstromanschluss mit 400 V. Eine normale Schuko-Steckdose ist für regelmäßiges Laden nicht ausgelegt.",
              "Ein eigener Stromkreis ab Zählerschrank mit eigenem Leitungsschutzschalter.",
              "Ausreichender Leitungsquerschnitt – bei längeren Kabelwegen entsprechend größer, damit die Spannung nicht abfällt.",
              "Fehlerstromschutz: FI Typ A genügt, wenn die Wallbox eine DC-Fehlerstromerkennung mitbringt, sonst Typ B.",
              "Ein gut zugänglicher Montageort. Bei Außenmontage mindestens Schutzart IP54 und Schutz vor mechanischer Beschädigung.",
              "Ein Hausanschluss, der die zusätzliche Last trägt – kritisch wird es bei mehreren Großverbrauchern wie Wärmepumpe plus Wallbox.",
            ]}
          />
          <Merkkasten variant="tipp" titel="Leerrohr gleich mitdenken">
            Wer ohnehin baut oder den Carport neu anlegt, sollte ein Leerrohr zum Stellplatz einplanen. Das kostet wenig und macht die spätere
            Installation deutlich günstiger – auch für eine zweite Wallbox.
          </Merkkasten>
        </Abschnitt>

        <Abschnitt id="anmeldung" titel="Anmeldung, Genehmigung und § 14a EnWG">
          <Prosa>
            <p>
              Jede fest installierte Wallbox muss beim Netzbetreiber angemeldet werden. Das übernimmt Ihr Elektrofachbetrieb – nur eingetragene Betriebe
              dürfen das. Bis 12 kVA ist es eine reine Anmeldung. Darüber braucht es eine Zustimmung, die bei angespanntem Netz auch mit Auflagen verbunden
              sein kann.
            </p>
          </Prosa>
          <Merkkasten variant="recht" titel="Netzentgelt-Rabatt nach § 14a EnWG">
            Wallboxen über 4,2 kW, die seit dem 1. Januar 2024 in Betrieb gehen, gelten als steuerbare Verbrauchseinrichtung. Der Netzbetreiber darf die
            Ladeleistung bei drohender Überlastung vorübergehend auf {kommazahl(WALLBOX.paragraf14a.drosselungKw)} kW begrenzen. Im Gegenzug sparen Sie –
            je nach Netzgebiet und gewähltem Modul – rund {WALLBOX.paragraf14a.ersparnisVon}–{WALLBOX.paragraf14a.ersparnisBis} € im Jahr an Netzentgelten.
            In der Praxis greift die Drosselung selten; auch gedrosselt laden Sie über Nacht genug für den Alltag.
          </Merkkasten>
          <Prosa>
            <p>
              Ins Marktstammdatenregister muss eine normale Wallbox nicht – sie ist keine Erzeugungsanlage. Dort werden nur Ihre{" "}
              <TextLink href="/dienstleistungen/photovoltaik">PV-Anlage</TextLink> und der Speicher eingetragen. Ausnahme: Eine bidirektionale Wallbox, die
              ins Hausnetz zurückspeisen kann, ist wie ein Speicher zu registrieren.
            </p>
          </Prosa>
        </Abschnitt>

        <Abschnitt id="pv" titel="Mit eigenem Solarstrom laden">
          <Prosa>
            <p>
              Beim <TextLink href="/wissen/lexikon#ueberschussladen">Überschussladen</TextLink> lädt die Wallbox vorrangig dann, wenn Ihre PV-Anlage mehr
              produziert, als das Haus gerade braucht. Ein Energiemanagementsystem regelt die Ladeleistung dynamisch mit. Der Unterschied ist erheblich:
            </p>
          </Prosa>
          <Tabelle
            caption="Ladekosten mit Netzstrom gegenüber eigenem Solarstrom"
            kopf={["Strombezug", "Preis", `Kosten bei ${KM_PRO_JAHR.toLocaleString("de-DE")} km`]}
            zeilen={[
              ["Nur Netzstrom", `${(ANNAHMEN.strompreis * 100).toFixed(0)} ct/kWh`, eur(kostenNetz)],
              ["Hälfte Solarstrom", "Mischpreis", eur(kostenMix)],
              ["Nur eigener Solarstrom", `ca. ${(SOLAR_CT * 100).toFixed(0)} ct/kWh`, eur(kostenSolar)],
            ]}
            hervorheben={2}
            markierteZeile={2}
            minBreite={480}
            fussnote={`Annahme: ${KM_PRO_JAHR.toLocaleString("de-DE")} km im Jahr, ${WALLBOX.verbrauchProHundert} kWh je 100 km, Solarstrom mit rund 8 ct/kWh angesetzt – das entspricht etwa der Einspeisevergütung, auf die Sie beim Selbstladen verzichten. Mit Überschussladen sind im Jahresmittel oft 40–70 % Solaranteil realistisch.`}
          />
          <Prosa>
            <p>
              Wichtig ist eine Wallbox mit offener Schnittstelle. Geschlossene Herstellersysteme binden Sie an ein Ökosystem – mit Modbus TCP, EEBus oder
              OCPP bleiben Sie flexibel. Was eine passende Anlage kostet, steht im <TextLink href="/ratgeber/solaranlage-kosten">Kostenratgeber</TextLink>.
            </p>
          </Prosa>
        </Abschnitt>

        <Abschnitt id="foerderung" titel="Förderung 2026">
          <Merkkasten variant="wichtig" titel="Einfamilienhaus: keine Bundesförderung">
            Für private Wallboxen im Einfamilienhaus gibt es 2026 keinen Bundeszuschuss. Was bleibt, ist der Handwerkerbonus nach § 35a EStG (
            {WALLBOX.handwerkerbonus.anteil * 100} % der Arbeitskosten, maximal {WALLBOX.handwerkerbonus.maxProJahr.toLocaleString("de-DE")} € im Jahr) und
            der Netzentgelt-Rabatt nach § 14a EnWG. Einzelne Kommunen und Stadtwerke fördern zusätzlich – das lohnt sich nachzufragen.
          </Merkkasten>

          <Zwischentitel>Mehrparteienhaus: Bundesprogramm bis {WALLBOX.mfhProgramm.bis}</Zwischentitel>
          <Prosa>
            <p>
              Für Bestandsgebäude mit mehreren Wohnungen läuft vom {WALLBOX.mfhProgramm.von} bis {WALLBOX.mfhProgramm.bis} das Bundesprogramm „Laden im
              Mehrparteienhaus“. Antragsberechtigt sind unter anderem Wohnungseigentümergemeinschaften und private Vermieter ab drei Wohneinheiten; je
              Objekt sind mindestens sechs Stellplätze zu elektrifizieren. Das Budget ist begrenzt.
            </p>
          </Prosa>
          <Tabelle
            caption="Fördersätze Laden im Mehrparteienhaus"
            kopf={["Maßnahme", "Zuschuss je Stellplatz"]}
            zeilen={WALLBOX.mfhProgramm.saetze.map((s) => [s.was, `bis ${s.bis.toLocaleString("de-DE")} €`])}
            hervorheben={1}
            minBreite={420}
          />
        </Abschnitt>

        <Abschnitt id="ablauf" titel="So läuft die Installation ab">
          <Ablauf
            schritte={[
              ["Beratung & Vor-Ort-Check", "Wir sehen uns Zählerschrank, Kabelweg und Stellplatz an und klären, ob der Hausanschluss reicht. Wenn eine PV-Anlage vorhanden oder geplant ist, stimmen wir die Wallbox darauf ab."],
              ["Wallbox auswählen", "11 oder 22 kW, festes Kabel oder Steckdose, App-Anbindung und Überschussladen – wir empfehlen Geräte mit offener Schnittstelle und belastbarer Herstellergarantie."],
              ["Anmeldung beim Netzbetreiber", "Übernehmen wir als eingetragener Elektrofachbetrieb. Bei 11 kW kann direkt installiert werden, bei 22 kW warten wir die Zustimmung ab."],
              ["Installation", "Kabel verlegen, Schutzorgane setzen, Wallbox montieren und anschließen. In den meisten Fällen an einem Tag erledigt."],
              ["Inbetriebnahme & Einweisung", "Funktionstest mit Prüfprotokoll, Konfiguration von App und Ladeprofilen, Einweisung und Übergabe der Dokumentation."],
            ]}
          />
        </Abschnitt>

        <Abschnitt id="faq" titel="Häufige Fragen zur Wallbox-Installation">
          <Faq items={FAQ} />
        </Abschnitt>

        <Abschnitt id="passend" titel="Passend dazu">
          <LinkKarten
            links={[
              { href: "/produkte/wallbox", titel: "Unsere Wallbox-Lösungen", text: "Geräte, die wir installieren – und warum." },
              { href: "/rechner/wallbox", titel: "E-Auto-Laderechner", text: "Solar laden statt tanken – was Sie sparen." },
              { href: "/ratgeber/solaranlage-kosten", titel: "Solaranlage Kosten", text: "Preise je kWp und was im Komplettpreis steckt." },
              { href: "/dienstleistungen/photovoltaik", titel: "PV-Anlage im Allgäu", text: "Planung, Montage und Anmeldung aus einer Hand." },
            ]}
          />
        </Abschnitt>
      </ArtikelLayout>
    </>
  );
}
