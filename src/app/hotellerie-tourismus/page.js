import Link from "next/link";
import {
  BedDouble,
  CableCar,
  CarFront,
  ClipboardList,
  Cog,
  HandCoins,
  LineChart,
  Leaf,
  Megaphone,
  Mountain,
  Snowflake,
  UtensilsCrossed,
  Waves,
  Wrench,
} from "lucide-react";

import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import FeatureGrid from "@/components/ui/FeatureGrid";
import SplitMedia from "@/components/ui/SplitMedia";
import Steps from "@/components/ui/Steps";
import Faq from "@/components/ui/Faq";
import CtaBand from "@/components/ui/CtaBand";
import Querverweise from "@/components/Reusable/Querverweise";
import LoesungSchema from "@/components/Loesungen/LoesungSchema";
import TechnikVerbund from "@/components/Loesungen/TechnikVerbund";
import { Bildnachweis, Fachabschnitt, Hebel, Hinweis, Kennzahlen, Prosa, Tabelle } from "@/components/Loesungen/Bausteine";
import { zielgruppenVariante } from "@/data/zielgruppen";
import { BASE_URL } from "@/lib/site";

const PFAD = "/hotellerie-tourismus";
const PAGE_URL = `${BASE_URL}${PFAD}`;
const TITEL = "Photovoltaik für Hotels, Thermen & Bergbahnen | Ökovolt";
const BESCHREIBUNG =
  "PV für Hotels, Thermen, Bergbahnen und Skigebiete in Österreich – alpin geplant, mit Speicher, Gäste-Ladestationen und Nachhaltigkeitsmarketing.";
const HERO_BILD = "/Images/AT/loesungen/tourismus-pv-skigebiet-wildkogel.jpg";

export const metadata = {
  title: TITEL,
  description: BESCHREIBUNG,
  alternates: { canonical: PAGE_URL },
  openGraph: { type: "website", locale: "de_AT", url: PAGE_URL, siteName: "Ökovolt Österreich", title: TITEL, description: BESCHREIBUNG, images: [{ url: `${BASE_URL}${HERO_BILD}`, width: 1920, height: 1440 }] },
};

const FAQ = [
  {
    q: "Lohnt sich Photovoltaik für ein Hotel mit Wintersaison?",
    a: "Meist ja, wenn die Anlage zum Lastprofil passt. Hotels haben ganzjährig Grundlast aus Küche, Kühlung, Wäscherei, Lüftung und Wellness; Sommerbetriebe decken damit einen hohen Anteil direkt. In der Wintersaison helfen steilere Modulneigung, Fassadenmodule und die Schneereflexion in höheren Lagen. Einen Zweisaisonbetrieb rechnen wir mit beiden Profilen durch.",
  },
  {
    q: "Wie viel Strom brauchen Bergbahnen und Beschneiung?",
    a: "Laut Fachverband der Seilbahnen in der WKO liegt der Strombedarf aller Seilbahnen in Österreich inklusive technischer Beschneiung bei rund 750 GWh im Jahr, etwa 1,2 % des österreichischen Strombedarfs. Für die Beschneiung von 30 ha Pistenfläche nennt der Fachverband rund 525.000 kWh pro Winter. Photovoltaik an Stationen, Garagen und Hangflächen deckt einen Teil davon und lässt sich mit Speicher und Energiegemeinschaft kombinieren.",
  },
  {
    q: "Hält eine PV-Anlage die Schneelast in den Alpen aus?",
    a: "Ja, wenn sie dafür bemessen ist. Wir rechnen nach ÖNORM B 1991-1-3 mit der Schneelastzone und Seehöhe des Standorts, wählen Module mit hohen Prüflasten und eine passende Unterkonstruktion und planen Schneefang und Abrutschbereiche mit. Die Schneelastzone Ihres Standorts zeigt vorab der Standort-Check.",
  },
  {
    q: "Gibt es eine höhere Förderung für einen PV-Carport auf dem Gästeparkplatz?",
    a: "Ja. PV-Anlagen als Parkplatzüberdachung ab 10 Stellplätzen, bei denen die Module die Überdachung bilden, gelten im EAG als innovative Anlagen und erhalten 30 % Zuschlag auf den Investitionszuschuss. Gleiches gilt für gebäudeintegrierte Photovoltaik, etwa in der Fassade. Der Antrag ist vor Inbetriebnahme im Fördercall zu stellen.",
  },
  {
    q: "Welche Ladestationen brauchen Hotelgäste?",
    a: "Für Übernachtungsgäste reichen meist AC-Ladepunkte mit 11 kW, die über Nacht laden; für Tagesgäste, Restaurant und Bergbahnparkplatz sind DC-Schnelllader sinnvoll. Wird nach Kilowattstunden abgerechnet, müssen die Ladepunkte eichrechtskonform sein. Mit Lastmanagement und PV-Überschussladen bleibt der Netzanschluss im Rahmen.",
  },
  {
    q: "Hilft Photovoltaik beim Österreichischen Umweltzeichen?",
    a: "Das Österreichische Umweltzeichen für Tourismus-, Gastronomie- und Kulturbetriebe (Richtlinie UZ 200) bewertet unter anderem Energie, Ökostrom und Energiemanagement. Eigener Solarstrom, Monitoring und Energiekennzahlen erleichtern die Nachweise. Die Zertifizierung selbst erfolgt über die Umweltzeichen-Beratung und Prüfung, nicht über uns.",
  },
  {
    q: "Können Hotel, Bergbahn und Gemeinde Strom teilen?",
    a: "Ja, über eine Energiegemeinschaft: Wer im Sommer Überschuss hat, gibt ihn an andere Mitglieder im Nahbereich weiter, die dafür reduzierte Netzentgelte zahlen. In Tourismusgemeinden mit Hotels, Bergbahn, Gemeindegebäuden und Haushalten ergeben sich oft gut ergänzende Profile. Große Unternehmen dürfen allerdings nur an Bürgerenergiegemeinschaften teilnehmen, nicht an Erneuerbare-Energie-Gemeinschaften.",
  },
  {
    q: "Wann bauen Sie, damit der Betrieb nicht gestört wird?",
    a: "In der Zwischensaison. Wir planen Materiallogistik, Kranstellung und Lärmphasen um Buchungsspitzen herum, halten Zufahrten und Fluchtwege frei und bauen in Etappen, wenn das Haus geöffnet bleiben muss. Am Berg richten wir uns nach Liftrevisionen und Schneefreiheit.",
  },
];

const BEISPIEL = [
  { pos: "Betrieb", wert: "4-Stern-Hotel mit Wellness, Ganzjahresbetrieb, Netzebene 6 (Tirol)", ergebnis: "–" },
  { pos: "Anlage und Jahresertrag", wert: "100 kWp Dach + 100 kWp Carport × 1.100 kWh/kWp", ergebnis: "220.000 kWh" },
  { pos: "Eigenverbrauch (85 %)", wert: "187.000 kWh × 15,06 ct (Energie 11 + Netz 2,95 + Verlust 0,29 + E-Abgabe 0,82)", ergebnis: "≈ 28.160 €/Jahr" },
  { pos: "Einspeisung (15 %)", wert: "33.000 kWh × 6 ct", ergebnis: "≈ 1.980 €/Jahr" },
  { pos: "Betrieb, Wartung, Versicherung", wert: "1,5 % der Investition", ergebnis: "− 2.850 €/Jahr" },
  { pos: "Jährlicher Überschuss", wert: "vor Steuern", ergebnis: "≈ 27.290 €/Jahr", hervorheben: true },
  { pos: "Investition", wert: "Annahme 950 €/kWp netto (Dach und Carport gemittelt)", ergebnis: "190.000 €" },
  { pos: "EAG-Investitionszuschuss", wert: "Annahme 100 €/kWp Dach; Carport 100 €/kWp + 30 % Innovationszuschlag", ergebnis: "− 23.000 €" },
  { pos: "Statische Amortisation", wert: "167.000 € ÷ 27.290 €/Jahr", ergebnis: "≈ 6,1 Jahre", hervorheben: true },
];

export default async function HotellerieTourismusPage({ searchParams }) {
  const v = zielgruppenVariante("tourismus", await searchParams);

  return (
    <div data-variante={v.id}>
      <LoesungSchema
        pfad={PFAD}
        name="Photovoltaik für Hotellerie, Thermen und Bergbahnen in Österreich"
        titel={TITEL}
        beschreibung={BESCHREIBUNG}
        zielgruppe="Hotellerie, Gastronomie, Thermen, Seilbahnen und Skigebiete"
        bild={HERO_BILD}
        leistungen={["PV auf Hotel, Therme und Stationsgebäuden", "PV-Carports mit Gäste-Ladestationen", "Speicher und Notstrom", "Alpine Statik und Schneelast", "Nachhaltigkeitsmarketing mit Solensa", "Wartung"]}
      />

      <PageHero
        variant="immersive"
        breadcrumbs={[{ name: "Hotellerie & Tourismus" }]}
        eyebrow={v.eyebrow}
        title={<>{v.titel} <span className="ov-text-gradient-light">{v.akzent}</span></>}
        lead={v.lead}
        image={{ src: HERO_BILD, alt: "Photovoltaikanlage auf einem verschneiten Hang im Skigebiet Wildkogel-Arena in Salzburg", position: "center 70%" }}
        actions={[
          { label: v.cta, href: "/termin?art=video" },
          { label: "Schneelast & Standort prüfen", href: "/standort-check", icon: Mountain },
        ]}
        points={["Hotel, Therme, Bergbahn", "Alpine Schneelast & Winterertrag", "Gäste-Laden & Carport", "Geschichte für Ihr Marketing"]}
      />

      <Kennzahlen
        items={[
          { wert: "750 GWh", label: "Strombedarf aller Seilbahnen inkl. Beschneiung – rund 1,2 % des Strombedarfs Österreichs" },
          { wert: "525.000 kWh", label: "Strom pro Winter, um ein Skigebiet mit 30 ha Pistenfläche technisch zu beschneien" },
          { wert: "+ 30 %", label: "EAG-Zuschlag für PV-Parkplatzüberdachungen ab 10 Stellplätzen und gebäudeintegrierte PV" },
          { wert: "UZ 200", label: "Richtlinie des Österreichischen Umweltzeichens für Tourismus- und Gastronomiebetriebe" },
        ]}
        quelle="Quellen: WKO, Fachverband der Seilbahnen – Factsheet Seilbahnen und Energie; EAG-IZV § 6 laut Leitfaden Land Oberösterreich 2026; Österreichisches Umweltzeichen, Richtlinie UZ 200."
      />

      <Section tone="white" space="lg">
        <SectionHeading
          eyebrow="Lösungen"
          title="Vom Hoteldach bis zur Bergstation"
          lead="Tourismusbetriebe haben große Verbräuche, oft ungenutzte Flächen – und Gäste, die Nachhaltigkeit zunehmend erwarten. Diese Anwendungen planen wir für Hotellerie, Thermen und Bergbahnen."
          className="mb-12"
        />
        <FeatureGrid
          cols={3}
          items={[
            { icon: BedDouble, title: "Hotels & Resorts", text: "Dach, Fassade und Carport: Küche, Wäscherei, Lüftung, Klima und Aufzüge laufen täglich – oft mit sehr hohem Eigenverbrauch." },
            { icon: Waves, title: "Thermen & Wellness", text: "Pumpen, Filter, Saunen und Wärmepumpen erzeugen ganzjährig Grundlast. PV plus Wärmepumpe senkt Strom- und Wärmekosten gemeinsam." },
            { icon: UtensilsCrossed, title: "Gastronomie & Kühlung", text: "Kühlräume, Tiefkühler und Klimaanlagen haben ihre Lastspitze im Sommer zur Mittagszeit – genau mit der Solarkurve." },
            { icon: CableCar, title: "Bergbahnen & Lifte", text: "Tal- und Bergstationen, Garagen, Fassaden und Hangflächen – mit Einstrahlung in Höhenlage und Schneereflexion." },
            { icon: Snowflake, title: "Beschneiung & Speicherteiche", text: "Pumpen und Schneeerzeuger brauchen im Winter viel Leistung. Speicher, Lastmanagement und Energiegemeinschaft verteilen sie besser." },
            { icon: CarFront, title: "Laden für Gäste", text: "AC-Ladepunkte für Übernachtungsgäste, DC-Lader für Tagesgäste – als PV-Carport mit Förderzuschlag.", href: "/ladeinfrastruktur" },
          ]}
        />
      </Section>

      <Section tone="sand" space="lg">
        <SplitMedia
          eyebrow="Hotellerie"
          title="Ein Hotel verbraucht Strom, wenn die Sonne scheint."
          text={[
            "Die meisten Hotels haben ein Lastprofil, das gut zur Photovoltaik passt: Frühstück und Küche am Vormittag, Wäscherei und Reinigung tagsüber, Kühlung und Klima am Nachmittag. In Sommerbetrieben und Häusern mit Wellnessbereich sind Eigenverbrauchsquoten von über 80 % realistisch.",
            "Wichtig ist die Saison: Ein reiner Wintersaisonbetrieb erzeugt im Hochwinter weniger, als er verbraucht, im Frühling und Herbst viel Überschuss. Dann helfen Speicher, steilere Modulneigung, Fassadenmodule und die Weitergabe über eine Energiegemeinschaft.",
          ]}
          points={[
            { title: "Dach & Fassade", text: "auch gebäudeintegriert – mit 30 % Förderzuschlag." },
            { title: "Carport", text: "Gästeparkplatz als Kraftwerk und Ladepark zugleich." },
            { title: "Speicher", text: "Abendspitze in Küche und Wellness abfedern, Notstrom für kritische Verbraucher." },
          ]}
          image={{ src: "/Images/Dienstleistungen/Photovoltaik/fuschl-am-see-scaled-1.jpg", alt: "Luftbild eines Hotels am See mit Photovoltaikanlagen auf mehreren Dachflächen" }}
          action={{ label: "Hotel bewerten lassen", href: "/termin?art=video" }}
        />
      </Section>

      <Section tone="white" space="lg" id="bergbahnen">
        <SplitMedia
          reverse
          eyebrow="Bergbahnen & Skigebiete"
          title="Am Berg zählt der Winterertrag."
          text={[
            "Seilbahnen und Beschneiung haben ihren Strombedarf überwiegend im Winter. Photovoltaik in Höhenlage erzeugt in dieser Zeit mehr als im Tal: klarere Luft, weniger Nebel und die Reflexion der Schneedecke, die bifaziale Module auch auf der Rückseite nutzen. Steile Aufstellung oder Fassaden bleiben schneefrei.",
            "Netzanschlüsse am Berg sind oft schwach und lang. Unser Parkregler hält Einspeiselimits am Übergabepunkt ein, die Leitwarte zeigt Erzeugung, Lifte und Beschneiung in einem System.",
          ]}
          points={[
            { title: "Stationsgebäude & Garagen", text: "Dach- und Fassadenflächen ohne zusätzlichen Flächenverbrauch." },
            { title: "Hangflächen", text: "aufgeständert mit hoher Bodenfreiheit, abgestimmt mit Pistenbetrieb und Naturschutz." },
            { title: "Speicherteiche", text: "schwimmende PV als Zukunftsoption – mit Ratgeber Floating-PV." },
          ]}
          image={{ src: "/Images/AT/loesungen/tourismus-seilbahn-pv-fassade.jpg", alt: "Bergstation einer Seilbahn in Vorarlberg mit Photovoltaikmodulen an der Fassade" }}
        />
      </Section>

      <Section tone="sand" space="lg" id="alpin">
        <Fachabschnitt
          eyebrow="Alpine Technik"
          title="Schnee, Wind und Ortsbild entscheiden über die Ausführung."
          lead="Photovoltaik in Tourismusregionen steht höher, trägt mehr Schnee und prägt das Ortsbild stärker als im Flachland. Das planen wir von Anfang an mit."
        >
          <Prosa>
            <ul>
              <li><strong>Schneelast:</strong> Bemessung nach ÖNORM B 1991-1-3 mit Schneelastzone und Seehöhe, Module mit hohen Prüflasten, verstärkte Unterkonstruktion, Schneefang über Eingängen und Wegen – vertieft im Ratgeber <Link href="/ratgeber/schneelast-photovoltaik">Schneelast und Photovoltaik</Link>.</li>
              <li><strong>Wind und Naturgefahren:</strong> Windlasten nach ÖNORM B 1991-1-4, Prüfung von Lawinen-, Hochwasser- und Hagelrisiko mit den Daten von HORA – schnell über den <Link href="/standort-check">Standort-Check</Link>.</li>
              <li><strong>Ortsbild:</strong> Schwarze Full-Black-Module, Indach- oder Fassadenlösungen und abgestimmte Farben für Häuser in geschützten Ortsbildern; für Premium-Objekte siehe <Link href="/chalets">Luxus-Chalets & Alpin</Link>.</li>
              <li><strong>Seilbahnen:</strong> Bei Anlagen an Seilbahnbauwerken stimmen wir uns mit Betriebsleitung und Behörde ab; Montage außerhalb der Betriebszeiten.</li>
              <li><strong>Netz:</strong> lange Stichleitungen, begrenzte Einspeiseleistung – Parkregler, Speicher und Lastmanagement statt teurer Netzverstärkung.</li>
            </ul>
          </Prosa>
        </Fachabschnitt>
        <div className="mt-14">
          <TechnikVerbund
            texte={{
              parkregler: "Hält Einspeiselimits und Blindleistungsvorgaben am Berg ein – wichtig bei schwachen Netzanschlüssen in Tourismusregionen.",
              fernwartung: "Überwachung auch in der Nebensaison und an schwer erreichbaren Standorten, mit Alarmierung bei Störungen.",
              scada: "Hotel, Lifte, Beschneiung, Ladepunkte und PV in einer Leitwarte – mit Kennzahlen für Umweltzeichen und Nachhaltigkeitsbericht.",
            }}
          />
        </div>
      </Section>

      <Section tone="green" space="lg" id="wirtschaftlichkeit">
        <SectionHeading
          eyebrow="Beispielrechnung"
          title="200 kWp auf Hoteldach und Gäste-Carport in Tirol"
          lead="Ein Rechenbeispiel mit offengelegten Annahmen – kein Angebot. Ihr Ergebnis hängt von Saison, Lastprofil und Netzbereich ab."
          className="mb-10"
        />
        <Tabelle
          caption="Beispielrechnung Photovoltaik für ein Hotel mit Carport"
          spalten={[
            { key: "pos", label: "Position", breite: "w-[28%]" },
            { key: "wert", label: "Annahme / Rechnung" },
            { key: "ergebnis", label: "Ergebnis", breite: "w-[20%]", className: "font-semibold text-ink-900" },
          ]}
          zeilen={BEISPIEL}
          fuss="Beispiel, Stand 09/2026. Netzentgelte Netzebene 6 Netzbereich Tirol laut SNE-V 2018 – Novelle 2026 (BGBl. II Nr. 305/2025): 2,95 ct/kWh Arbeitspreis, 0,292 ct/kWh Netzverlust; Elektrizitätsabgabe 2026 0,82 ct/kWh. Energiepreis 11 ct/kWh netto, Investitionskosten und Zuschlag im Fördercall sind Annahmen (kein Ökovolt-Preis). Nicht enthalten: Leistungspreiseffekt, Ladeerlöse, Steuerwirkung (Öko-IFB 22 % bis Ende 2026), Degradation."
        />
        <div className="mt-10">
          <Hebel
            cols={3}
            items={[
              { icon: HandCoins, titel: "Förderung", text: "EAG-Zuschuss bis 1.000 kWp, 30 % Zuschlag für Carport und gebäudeintegrierte Module, Speicher 150 €/kWh." },
              { icon: Leaf, titel: "Zertifikate", text: "Energiekennzahlen aus unserem SCADA als Nachweis für Umweltzeichen, Nachhaltigkeitsbericht und Kreditgeber." },
              { icon: Megaphone, titel: "Marketing", text: "Ihre Anlage als Geschichte: Live-Anzeige im Foyer, Video und Imagespot mit Solensa." },
            ]}
          />
        </div>
      </Section>

      <Section tone="white" space="lg" id="nachhaltigkeit">
        <Fachabschnitt
          eyebrow="Nachhaltigkeit & Gäste"
          title="Gäste buchen Haltung – zeigen Sie sie."
          lead="Photovoltaik ist die sichtbarste Klimaschutzmaßnahme eines Tourismusbetriebs. Richtig kommuniziert, stärkt sie Marke, Zertifizierung und Mitarbeiterbindung."
        >
          <Prosa>
            <p>
              <strong>Österreichisches Umweltzeichen:</strong> Die Richtlinie UZ 200 für Tourismus-, Gastronomie- und Kulturbetriebe bewertet
              unter anderem Energiemanagement, Ökostrom und erneuerbare Wärme. Eigene Erzeugung und saubere Messdaten erleichtern die Nachweise
              gegenüber der Prüfstelle. Beratung und Zertifizierung erfolgen über die Umweltzeichen-Stellen der Länder.
            </p>
            <p>
              <strong>Nachhaltigkeitsbericht:</strong> Wer für Banken, Reiseveranstalter oder Konzernkunden berichtet, braucht belastbare
              Scope-2-Daten. Hintergründe im Ratgeber <Link href="/ratgeber/csrd-esg-photovoltaik">CSRD, ESG und Photovoltaik</Link>.
            </p>
            <p>
              <strong>Kommunikation:</strong> Gemeinsam mit unserer Partnerin Solensa produzieren wir auf Wunsch ein Video zu Ihrer Anlage oder
              einen Nachhaltigkeits-Imagespot – mehr unter <Link href="/service/nachhaltigkeitsmarketing">Nachhaltigkeitsmarketing</Link>. Wer
              besonders gute Anlagen baut, kann sich um den <Link href="/pv-award">Ökovolt PV Award</Link> bewerben.
            </p>
          </Prosa>
          <Hinweis className="mt-8" titel="Energiegemeinschaft in der Tourismusgemeinde">
            Hotel, Bergbahn, Gemeinde und Haushalte ergänzen sich oft ideal. Wie das rechtlich funktioniert, lesen Sie unter{" "}
            <Link href="/energiegemeinschaften" className="text-ov-700 underline">Energiegemeinschaften</Link>.
          </Hinweis>
        </Fachabschnitt>
      </Section>

      <Section tone="sand" space="lg">
        <SectionHeading eyebrow="Ablauf" title="Geplant für Ihre Saison" align="center" className="mb-14" />
        <Steps
          items={[
            { icon: ClipboardList, title: "Lastprofil & Flächen", text: "Verbrauch nach Saison, Dach-, Fassaden- und Parkplatzflächen, Schneelastzone und Netzanschluss aufnehmen." },
            { icon: HandCoins, title: "Konzept & Förderung", text: "Dach, Carport, Speicher und Ladepunkte als Varianten – mit EAG-Zuschlägen, IFB und Finanzierung." },
            { icon: Wrench, title: "Bau in der Zwischensaison", text: "Logistik, Kran und Lärmphasen außerhalb der Buchungsspitzen, Etappenbau bei geöffnetem Haus." },
            { icon: LineChart, title: "Betrieb & Geschichte", text: "Monitoring, Wartungsvertrag, Live-Anzeige für Gäste und Kommunikation Ihrer Anlage." },
          ]}
        />
      </Section>

      <Querverweise pfad={PFAD} ueberschrift="Vertiefen: Hotel, Berg und Gäste" />

      <Section tone="white" space="lg">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <SectionHeading eyebrow="Häufige Fragen" title="Gut zu wissen für Hoteliers, Bergbahnen und Thermen" />
          <Faq items={FAQ} />
        </div>
      </Section>

      <CtaBand
        eyebrow="Kostenlos & unverbindlich"
        title="Planen wir Ihre Anlage für die nächste Zwischensaison."
        text="Erstgespräch per Video oder vor Ort – mit Einschätzung zu Flächen, Schneelast, Eigenverbrauch, Förderung und Ladepunkten für Gäste."
        primary={{ label: v.cta, href: "/termin?art=video" }}
        secondary={{ label: "Anfrage starten", href: "/angebot", icon: Cog }}
      />

      <Bildnachweis
        items={[
          { motiv: "PV im Skigebiet Wildkogel-Arena", urheber: "Mr ccep", lizenz: "CC BY-SA 4.0", href: "https://commons.wikimedia.org/wiki/File:Solar_PV_Austrian_Alps.jpg" },
          { motiv: "Panoramabahn Bürserberg, Bergstation", urheber: "Asurnipal", lizenz: "CC BY-SA 4.0", href: "https://commons.wikimedia.org/wiki/File:Buerserberg-Panoramabahn-top_station-photovoltaic_system-01ASD.jpg" },
        ]}
      />
    </div>
  );
}
