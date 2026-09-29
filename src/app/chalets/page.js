// src/app/chalets/page.js
//
// Photovoltaik für Luxus-Chalets & alpine Premium-Immobilien. Sechs Bereiche:
// Indach & Architektur · Alpine Statik · Speicher & Blackout · Smart Home & Wellness ·
// Diskretion & Projektsteuerung · Concierge-Wartung. Fachliche Quellen siehe Kommentare
// in src/lib/standort/berechnung.js; Bildquellen in public/Images/AT/QUELLEN-chalets.md
// und public/Images/AT/QUELLEN-loesungen-b.md.

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, HardHat, LineChart, Mountain, Users } from "lucide-react";

import Section from "@/components/ui/Section";
import Steps from "@/components/ui/Steps";
import Faq from "@/components/ui/Faq";
import CtaBand from "@/components/ui/CtaBand";
import Reveal from "@/components/ui/Reveal";
import Querverweise from "@/components/Reusable/Querverweise";
import BereicheGalerie from "@/components/Chalets/BereicheGalerie";
import SchneelastMini from "@/components/Chalets/SchneelastMini";
import { LinienListe, LuxusHero, LuxusKopf, LuxusZahlen } from "@/components/Chalets/Luxus";
import { BASE_URL } from "@/lib/site";
import { bewerteSchnee } from "@/lib/standort/berechnung";

const PFAD = "/chalets";
const PAGE_URL = `${BASE_URL}${PFAD}`;
const TITEL = "Photovoltaik für Luxus-Chalets & Alpin-Immobilien | Ökovolt";
const BESCHREIBUNG =
  "PV für Chalets in Kitzbühel, Lech, Ischgl & Co.: Indach, Full-Black, Hochlastmodule nach ÖNORM B 1991-1-3, Blackout-Speicher, Smart Home und Concierge-Wartung.";
const HERO_BILD = "/Images/AT/loesungen-b/chalets-sternennacht-see.jpg";

export const metadata = {
  title: TITEL,
  description: BESCHREIBUNG,
  alternates: { canonical: PAGE_URL },
  openGraph: {
    type: "website",
    locale: "de_AT",
    url: PAGE_URL,
    siteName: "Ökovolt Österreich",
    title: TITEL,
    description: BESCHREIBUNG,
    images: [{ url: `${BASE_URL}${HERO_BILD}`, width: 1920, height: 1280, alt: "Beleuchtetes Chalet unter Sternenhimmel über einem Bergsee im Winter" }],
  },
};

// Rechenbeispiel mit fiktivem Standort – dieselbe Funktion wie im Standort-Check
const BEISPIEL = bewerteSchnee({ sk: 4, neigung: 30, schneefang: true, dachtiefe: 6 });
const fmt = (n, stellen = 2) => n.toLocaleString("de-DE", { minimumFractionDigits: stellen, maximumFractionDigits: stellen });

const BEREICHE = [
  { id: "indach", title: "Indach & Architektur", text: "Gebäudeintegrierte Module in Full-Black, Farbe oder Schiefer- und Schindeloptik – abgestimmt mit Architektur, Ortsbild und Denkmalschutz." },
  { id: "alpine-statik", title: "Alpine Statik", text: "Schneelast nach ÖNORM B 1991-1-3, Hochlastmodule, verstärkte Unterkonstruktion, Schneefang, Wind und Hagel – für jeden Standort gerechnet." },
  { id: "speicher", title: "Speicher & Blackout-Autarkie", text: "Speicher mit Ersatzstrom oder echtem Inselbetrieb für abgelegene Lagen, Zufahrten im Winter und Häuser, die nie ausfallen dürfen." },
  { id: "smart-home", title: "Smart Home & Wellness", text: "Pool, Sauna, Wärmepumpe und E-Fahrzeuge mit einem Energiemanagement, das Solarstrom dorthin lenkt, wo er den meisten Komfort bringt." },
  { id: "diskretion", title: "Diskretion & Projektsteuerung", text: "Ein Ansprechpartner für Eigentümer, Architekten, Bauträger und Hausverwaltung – vertraulich, dokumentiert und aus der Ferne steuerbar." },
  { id: "concierge", title: "Concierge-Wartung", text: "Saisonservice vor und nach dem Winter, Kontrolle nach Starkschneefall, Thermografie, Reinigung und laufende Überwachung." },
];

const GESTALTUNG = [
  ["Full-Black-Module (Aufdach)", "Schwarze Zellen, Rückseitenfolie und Rahmen – ruhiges Bild auf dunkler Eindeckung", "Nachrüstung auf bestehendem Dach"],
  ["Indach-System", "Module ersetzen die Dachhaut, bündig mit Blech- oder Ziegelanschlüssen", "Neubau, Dachsanierung, anspruchsvolle Architektur"],
  ["Solarschindel / Schieferoptik", "Kleinformatige Elemente im Verlegebild von Schiefer oder Schindel", "Ortsbild mit traditioneller Deckung"],
  ["Farbmodule", "Beschichtetes Frontglas in Anthrazit, Grau, Grün oder Terrakotta – geringerer Wirkungsgrad", "Gestaltungsauflagen, Fassaden, Balkone"],
  ["Glas-Glas in Fassade & Geländer", "Semitransparent oder opak, als Absturzsicherung oder Beschattung", "Südfassaden – im Winter mit Schneereflexion"],
];

const STROMARTEN = [
  ["Notstromsteckdose", "Einzelne Steckdose am Wechselrichter, nur bei Sonne oder aus dem Speicher", "Kühlschrank, Router, Handy"],
  ["Ersatzstrom", "Automatische Umschaltung, ausgewählte Stromkreise oder ganzes Haus aus dem Speicher", "Heizungssteuerung, Licht, Pumpen, Tore"],
  ["Inselbetrieb (blackoutfähig)", "Netzbildender Wechselrichter, Speicher wird bei Netzausfall weiter von der PV geladen", "Tagelange Autarkie, abgelegene Lagen"],
  ["Netzunabhängig (off-grid)", "Kein Netzanschluss, PV + Speicher, oft mit Aggregat als Reserve", "Almhütte, Jagdhaus, Berghütte"],
];

const SAISON = [
  { zeit: "Herbst", titel: "Wintercheck", text: "Befestigungen, Klemmen, Schneefang und Kabelführung prüfen, Monitoring und Speicherreserve für den Winter einstellen." },
  { zeit: "Winter", titel: "Schneekontrolle", text: "Nach Starkschneefall oder Tauwetter Sichtkontrolle und Abgleich mit den Erträgen – ohne Abkehren mit Werkzeug auf den Modulen." },
  { zeit: "Frühjahr", titel: "Schadensprüfung", text: "Nach der Schneeschmelze Module, Rahmen und Dachanschlüsse auf Schäden durch Schneedruck, Eis und Dachlawinen prüfen." },
  { zeit: "Sommer", titel: "Thermografie & Reinigung", text: "Drohnen-Thermografie bei hoher Einstrahlung, Reinigung bei Bedarf, E-Check und Bericht für Eigentümer oder Hausverwaltung." },
];

const REGIONEN = [
  { name: "Kitzbühel", land: "Tirol", text: "Ortszentrum rund 760 m, Lagen am Hang deutlich höher – Schneelast je Grundstück sehr unterschiedlich." },
  { name: "Arlberg: Lech, Zürs, St. Anton", land: "Vorarlberg · Tirol", text: "Hochalpine Lagen zwischen rund 1.300 und 1.700 m mit sehr hohen Schneelasten und langen Wintern." },
  { name: "Ischgl & Paznaun", land: "Tirol", text: "Hohe Lage, enge Täler: Horizontverschattung und Schneelast bestimmen die Planung." },
  { name: "Sölden & Obergurgl", land: "Tirol", text: "Ötztal mit Orten über 1.900 m – nahe an der 2.000-m-Grenze der Schneelastkarte, darüber ist ein Gutachten nötig." },
  { name: "Saalbach-Hinterglemm", land: "Salzburg", text: "Chalets in Hanglagen, oft mit Dachlawinen über Zufahrten und Terrassen." },
  { name: "Zell am See & Kaprun", land: "Salzburg", text: "See und Gletscher: vom Talboden bis in hohe Hanglagen." },
  { name: "Bad Gastein & Gasteinertal", land: "Salzburg", text: "Historische Bausubstanz – Ortsbild und Denkmalschutz früh einbinden." },
  { name: "Schladming & Ramsau", land: "Steiermark", text: "Dachstein-Region mit schneereichen Wintern und Chalet-Siedlungen am Hang." },
  { name: "Seefeld & Olympiaregion", land: "Tirol", text: "Hochplateau auf rund 1.200 m mit viel Wintersonne." },
  { name: "Mayrhofen & Zillertal", land: "Tirol", text: "Talorte und steile Seitentäler – Horizont und Schneelast variieren stark." },
  { name: "Salzkammergut", land: "Oberösterreich · Salzburg · Steiermark", text: "Seeufer, Villen und Ortsbildschutz – Gestaltung steht oft im Vordergrund." },
  { name: "Wörthersee", land: "Kärnten", text: "Seevillen, bei denen Optik, Ortsbild und Diskretion im Vordergrund stehen – die Schneelast der Beckenlage trotzdem prüfen." },
];

const FAQ = [
  {
    q: "Hält eine PV-Anlage die Schneelast in Kitzbühel, Lech oder Ischgl aus?",
    a: "Ja, wenn Module und Unterkonstruktion für die Schneelast genau dieses Grundstücks ausgelegt sind. Maßgeblich ist der Wert aus der Schneelastkarte der ÖNORM B 1991-1-3:2022 in eHORA, die Dachneigung und ob ein Schneefang den Schnee zurückhält. In hochalpinen Lagen reichen Standardmodule mit 2400 Pa Prüflast meist nicht – dort planen wir mit Modulen für 5400 Pa oder 8100 Pa und einer verstärkten Unterkonstruktion.",
  },
  {
    q: "Brauche ich für Photovoltaik am Chalet eine Bewilligung?",
    a: "Das regelt die Bauordnung des jeweiligen Bundeslandes. Photovoltaik auf Dächern ist in vielen Fällen bewilligungsfrei oder nur anzeigepflichtig. In Schutzzonen, bei Ortsbildschutz, in Welterbe-Gebieten oder bei denkmalgeschützten Gebäuden ist dagegen oft eine Bewilligung oder eine Stellungnahme eines Gestaltungs- oder Sachverständigenbeirats nötig; bei Baudenkmälern entscheidet das Bundesdenkmalamt. Wir klären das vor der Planung mit Gemeinde und Architekt.",
  },
  {
    q: "Indach oder Aufdach – was ist für ein Chalet besser?",
    a: "Indach-Module ersetzen die Dacheindeckung und wirken wie ein Teil der Architektur – ideal bei Neubau oder Dachsanierung. Weil sie schlechter hinterlüftet sind, liefern sie etwas weniger Ertrag als Aufdach-Module. Full-Black-Module auf dem bestehenden Dach sind bei einer Nachrüstung meist die wirtschaftlichere Wahl. Beide Varianten müssen für die Schneelast am Standort freigegeben sein.",
  },
  {
    q: "Funktioniert die Anlage bei einem Blackout?",
    a: "Nur mit einem Speicher und einem Wechselrichter, der Ersatzstrom oder Inselbetrieb beherrscht, samt automatischer Netztrennung. Eine gewöhnliche netzgekoppelte PV-Anlage schaltet sich bei Netzausfall aus Sicherheitsgründen ab. Für abgelegene Lagen planen wir blackoutfähige Systeme, die den Speicher auch während eines Netzausfalls mit Solarstrom nachladen.",
  },
  {
    q: "Was passiert, wenn das Chalet monatelang leer steht?",
    a: "Die Anlage wird überwacht und – mit Ihrer Zustimmung – per Fernwartung betreut. Das Energiemanagement hält Grundlasten wie Frostschutz und Lüftung aus dem Solarstrom und kann eine Speicherreserve für den Notfall freihalten. Auffälligkeiten melden wir an Sie oder an Ihre Hausverwaltung.",
  },
  {
    q: "Muss Schnee von den Modulen geräumt werden?",
    a: "In der Regel nicht. Auf glatten Moduloberflächen rutscht Schnee bei ausreichender Neigung von selbst ab, und die Anlage ist für die Schneelast bemessen. Schnee sollte niemals mit Schaufeln oder harten Besen von Modulen entfernt werden. Wird das Dach aus statischen Gründen abgeschaufelt, sprechen Sie das vorher mit uns ab, damit Module und Kabel geschützt bleiben.",
  },
  {
    q: "Wie diskret arbeiten Sie?",
    a: "Wir veröffentlichen keine Adressen, Fotos oder Namen ohne Ihre ausdrückliche Zustimmung und unterschreiben auf Wunsch eine Vertraulichkeitsvereinbarung. Termine, Zugänge und Fotos für die Dokumentation stimmen wir mit Ihnen, Ihrem Architekten oder Ihrer Hausverwaltung ab.",
  },
];

const schema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": `${PAGE_URL}/#service`,
  name: "Photovoltaik für Luxus-Chalets und alpine Premium-Immobilien",
  serviceType: "Planung, Errichtung und Wartung von Photovoltaikanlagen",
  provider: { "@id": `${BASE_URL}/#organization` },
  areaServed: [
    { "@type": "Country", name: "Österreich" },
    ...["Tirol", "Salzburg", "Vorarlberg", "Steiermark", "Kärnten", "Oberösterreich"].map((n) => ({ "@type": "State", name: n })),
  ],
  audience: { "@type": "Audience", audienceType: "Eigentümer von Chalets, Villen und Zweitwohnsitzen, Architekten, Bauträger, Hausverwaltungen" },
  url: PAGE_URL,
  description: BESCHREIBUNG,
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Leistungen für alpine Premium-Immobilien",
    itemListElement: BEREICHE.map((b) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: b.title, description: b.text } })),
  },
};

/* ---------------------------------------------------------------- kleine Bausteine */

function Panel({ nummer, titel, children }) {
  return (
    <div className="max-w-3xl">
      <p className="font-display text-[12px] font-semibold tracking-[0.28em] text-ov-700">{nummer}</p>
      <h3 className="mt-3 font-display text-[clamp(1.5rem,1.2rem+1.1vw,2.1rem)] font-light leading-tight tracking-[-0.025em] text-ink-900">{titel}</h3>
      <div className="mt-6">{children}</div>
    </div>
  );
}

/** Zeilen mit Haarlinien statt Tabelle: [a, b, c] → Titel, Beschreibung, Einsatz */
function Linienzeilen({ caption, kopf, zeilen }) {
  return (
    <table className="mt-10 w-full text-left">
      <caption className="mb-3 text-left text-[11.5px] font-semibold uppercase tracking-[0.24em] text-ink-400">{caption}</caption>
      <thead className="sr-only">
        <tr>
          {kopf.map((k) => (
            <th key={k} scope="col">{k}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {zeilen.map(([a, b, c]) => (
          <tr key={a} className="grid gap-1 border-t border-ink-200 py-4 md:grid-cols-[0.9fr_1.4fr_1fr] md:gap-6">
            <th scope="row" className="font-display text-[15.5px] font-semibold text-ink-900">{a}</th>
            <td className="text-[14.5px] leading-relaxed text-ink-600">{b}</td>
            <td className="text-[13.5px] leading-relaxed text-ink-500"><span className="sr-only">{kopf[2]}: </span>{c}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function Punkte({ items }) {
  return (
    <ul className="mt-6 divide-y divide-ink-200 border-y border-ink-200">
      {items.map((p) => (
        <li key={typeof p === "string" ? p : p.title} className="py-3.5 text-[15.5px] leading-relaxed text-ink-700">
          {typeof p === "string" ? p : (<><strong className="font-semibold text-ink-900">{p.title}</strong> – {p.text}</>)}
        </li>
      ))}
    </ul>
  );
}

function Weiter({ href, children }) {
  return (
    <Link href={href} className="group mt-8 inline-flex items-center gap-2 border-b border-ink-900 pb-1 text-[14.5px] font-semibold text-ink-900 transition-colors hover:border-ov-600 hover:text-ov-700">
      {children}
      <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
    </Link>
  );
}

/* ---------------------------------------------------------------- Inhalte der sechs Bereiche */

const GALERIE = [
  {
    id: "indach",
    titel: "Indach & Architektur",
    kurz: BEREICHE[0].text,
    bild: "/Images/AT/loesungen-b/chalets-architektur-glas.jpg",
    alt: "Modernes Chalet mit großer Glasfront und Holzfassade zwischen verschneiten Fichten",
    inhalt: (
      <Panel nummer="01 · Indach & Architektur" titel="Photovoltaik, die aussieht wie ein Teil des Hauses">
        <div className="ov-prose">
          <p>
            <strong>Gebäudeintegrierte Photovoltaik ersetzt Dachhaut, Fassade oder Geländer und wird so zum Gestaltungselement statt zum Aufbau.</strong> Bei Chalets kombinieren wir meist Full-Black-Module oder Indach-Systeme mit
            Blecharbeiten in der Farbe der Eindeckung, verdeckten Kabelwegen und Randabschlüssen ohne sichtbare Schienen.
          </p>
          <p>
            <strong>Ortsbild und Gestaltungsbeirat:</strong> In vielen Tourismusgemeinden gelten Ortsbildschutz, Schutzzonen oder Gestaltungsvorgaben – etwa nach dem Tiroler Stadt- und Ortsbildschutzgesetz oder dem Salzburger
            Ortsbildschutzgesetz. Wir bereiten Visualisierungen, Materialmuster und Datenblätter so auf, dass Bauamt und Gestaltungs- oder Sachverständigenbeirat schnell entscheiden können.
          </p>
          <p>
            <strong>Denkmalschutz:</strong> Veränderungen an Baudenkmälern brauchen eine Bewilligung des Bundesdenkmalamts. Häufig lassen sich Module auf Nebengebäuden, Carports oder einer Freifläche unterbringen, ohne das Denkmal
            zu berühren – das klären wir vorab.
          </p>
          <p>
            Indach-Module sind schlechter hinterlüftet und liefern daher etwas weniger Ertrag als Aufdach-Module; farbige Frontgläser kosten zusätzlich Wirkungsgrad. Wie groß der Unterschied an Ihrem Standort ist, zeigt der{" "}
            <Link href="/standort-check">Standort-Check</Link> mit der Einstellung „Indach“.
          </p>
        </div>
        <Linienzeilen caption="Gestaltungsoptionen im Überblick" kopf={["Lösung", "Optik & Technik", "Typischer Einsatz"]} zeilen={GESTALTUNG} />
        <p className="mt-3 text-[12.5px] leading-relaxed text-ink-500">Jede Lösung braucht die Freigabe des Herstellers für die Schneelast am Standort. Brandschutz nach OVE-Richtlinie R 11-1.</p>
      </Panel>
    ),
  },
  {
    id: "alpine-statik",
    titel: "Alpine Statik",
    kurz: BEREICHE[1].text,
    bild: "/Images/AT/chalets/chalets-schneelast-luftbild.jpg",
    alt: "Luftbild tief verschneiter Chalets mit meterhohen Schneedecken auf den Dächern",
    inhalt: (
      <Panel nummer="02 · Alpine Statik" titel="Schneelast, Wind und Hagel – für jedes Grundstück gerechnet">
        <div className="ov-prose">
          <p>
            Die Schneelast eines Chalets hängt vom Grundstück ab, nicht vom Ort: Seit der ÖNORM B 1991-1-3:2022 gibt es keine Schneelastzonen mehr, sondern eine Karte im 50-Meter-Raster bis 2.000 m Seehöhe. Den Wert für Ihre
            Adresse zeigt eHORA – unser Standort-Check verlinkt ihn direkt.
          </p>
        </div>
        <Punkte
          items={[
            { title: "Modulprüflasten", text: "Standard 2400 Pa, für Schneelagen 5400 Pa, einzelne Hochlastmodule 8100 Pa – immer mit dem vom Hersteller freigegebenen Klemmbereich." },
            { title: "Verstärkte Unterkonstruktion", text: "Hochlast-Dachhaken, engere Befestigungsabstände, Kreuzschienen oder Modulstützen; Dachstuhl durch Tragwerksplanung bestätigt." },
          ]}
        />
        <Weiter href="#statik">Zum Schneelast-Rechner</Weiter>
      </Panel>
    ),
  },
  {
    id: "speicher",
    titel: "Speicher & Blackout-Autarkie",
    kurz: BEREICHE[2].text,
    bild: "/Images/AT/loesungen-b/chalets-villa-pv-schnee.jpg",
    alt: "Verschneites Holzhaus zwischen hohen Fichten mit Photovoltaikmodulen am Nebengebäude",
    position: "35% 50%",
    inhalt: (
      <Panel nummer="03 · Speicher & Blackout-Autarkie" titel="Strom, wenn die Leitung im Tal liegt">
        <div className="ov-prose">
          <p>
            Abgelegene Chalets hängen oft an langen Stichleitungen, die bei Sturm, Lawinen oder Schneebruch ausfallen können. Ein Speicher mit Ersatzstrom hält dann Heizung, Pumpen, Tore und Kommunikation in Betrieb.
          </p>
          <p>
            Wichtig ist die Unterscheidung: Eine gewöhnliche PV-Anlage schaltet bei Netzausfall ab. Erst ein netzbildender Wechselrichter mit automatischer Netztrennung macht das Haus blackoutfähig – und lädt den Speicher auch
            während des Ausfalls mit Solarstrom nach.
          </p>
        </div>
        <Punkte
          items={[
            "Speichergröße nach Notlasten, nicht nach Eigenverbrauch allein",
            "Anlaufströme von Wärmepumpe und Pumpen im Inselbetrieb berücksichtigt",
            "Aggregat als zusätzliche Reserve für lange Schlechtwetterphasen",
          ]}
        />
        <Linienzeilen caption="Vier Stufen der Versorgungssicherheit" kopf={["Stufe", "Technik", "Versorgt typischerweise"]} zeilen={STROMARTEN} />
        <Weiter href="/service/notstrom">Notstrom & Blackout-Vorsorge</Weiter>
      </Panel>
    ),
  },
  {
    id: "smart-home",
    titel: "Smart Home & Wellness",
    kurz: BEREICHE[3].text,
    bild: "/Images/AT/loesungen-b/chalets-hot-tub-abend.jpg",
    alt: "Holz-Badezuber auf einer Terrasse mit Blick über verschneite Berge im Abendlicht",
    inhalt: (
      <Panel nummer="04 · Smart Home, Wellness & Mobilität" titel="Solarstrom für Pool, Sauna, Wärmepumpe und Fuhrpark">
        <div className="ov-prose">
          <p>
            Wellnessbereiche und Haustechnik sind in Premium-Immobilien die größten Verbraucher. Ein Energiemanagement verteilt den Solarstrom nach Prioritäten – zuerst Komfort und Sicherheit, dann Speicher, Fahrzeuge und Wärme.
          </p>
        </div>
        <Punkte
          items={[
            { title: "Pool & Whirlpool", text: "Poolwärmepumpe und Filterpumpe laufen bevorzugt mit Solarüberschuss." },
            { title: "Sauna & Infrarot", text: "Aufheizen planbar zur Mittagszeit oder aus dem Speicher – mit Blick auf die Leistungsspitze." },
            { title: "Wärmepumpe & Warmwasser", text: "Pufferspeicher und Gebäudemasse als Wärmespeicher für den Abend." },
            { title: "E-Fahrzeuge & Gäste", text: "Wallboxen für eigene Fahrzeuge und Gäste mit Lastmanagement passend zum Netzanschluss." },
            { title: "Gebäudeautomation", text: "Anbindung an bestehende Systeme (z. B. KNX) über offene Schnittstellen." },
          ]}
        />
        <Weiter href="/produkte/stromspeicher">Energiemanagement & Speicher</Weiter>
      </Panel>
    ),
  },
  {
    id: "diskretion",
    titel: "Diskretion & Projektsteuerung",
    kurz: BEREICHE[4].text,
    bild: "/Images/AT/loesungen-b/chalets-panoramafenster.jpg",
    alt: "Person am großen Panoramafenster eines Chalets mit Blick auf verschneite Gipfel",
    inhalt: (
      <Panel nummer="05 · Diskretion & Projektsteuerung" titel="Ein Ansprechpartner für alle Beteiligten – vertraulich von Anfang an">
        <p className="text-[16.5px] leading-relaxed text-ink-600">
          Bei Zweitwohnsitzen sind die Eigentümer selten vor Ort. Wir koordinieren Architektur, Bauträger, Gewerke und Hausverwaltung und berichten in der Form, die Sie wünschen.
        </p>
        <LinienListe
          className="mt-6"
          items={[
            { titel: "Vertraulichkeit", text: "Keine Veröffentlichung von Adresse, Fotos oder Namen ohne Ihre Zustimmung; Vertraulichkeitsvereinbarung auf Wunsch." },
            { titel: "Architekten & Bauträger", text: "Planungsdaten, Details und Termine abgestimmt mit Architektur und Bauablauf – idealerweise schon in der Entwurfsphase." },
            { titel: "Hausverwaltung & Zweitwohnsitz", text: "Zugänge, Schlüssel und Termine über Ihre Hausverwaltung; Montage bevorzugt in der Zwischensaison." },
            { titel: "Fernwartung", text: "Überwachung und Fernzugriff mit eigenen, abgesicherten Systemen – Details auf der Seite Fernwartung." },
            { titel: "Dokumentation", text: "Anlagendokumentation und Prüfprotokolle nach ÖVE/ÖNORM EN 62446-1, statische Nachweise und Datenblätter an einem Ort." },
            { titel: "Fester Ansprechpartner", text: "Eine Person, die Ihr Projekt kennt – von der ersten Besichtigung bis zur Wartung." },
          ]}
        />
        <Weiter href="/technik/fernwartung">Unsere Fernwartung</Weiter>
      </Panel>
    ),
  },
  {
    id: "concierge",
    titel: "Concierge-Wartung",
    kurz: BEREICHE[5].text,
    bild: "/Images/AT/chalets/pv-module-schnee.jpg",
    alt: "Photovoltaikmodule mit abtauenden Schneeresten",
    inhalt: (
      <Panel nummer="06 · Concierge-Wartung" titel="Service im Rhythmus der Saison">
        <p className="text-[16.5px] leading-relaxed text-ink-600">
          Alpine Anlagen arbeiten unter härteren Bedingungen: Schneedruck, Eis, Temperaturwechsel und UV in der Höhe. Die Concierge-Wartung verbindet laufende Überwachung mit festen Terminen vor und nach dem Winter –
          organisiert mit Ihnen oder Ihrer Hausverwaltung.
        </p>
        <ol className="mt-8 grid gap-x-8 sm:grid-cols-2">
          {SAISON.map((s) => (
            <li key={s.zeit} className="border-t border-ink-200 py-5">
              <p className="text-[11.5px] font-semibold uppercase tracking-[0.24em] text-ov-700">{s.zeit}</p>
              <p className="mt-1.5 font-display text-[17px] font-semibold text-ink-900">{s.titel}</p>
              <p className="mt-1.5 text-[14.5px] leading-relaxed text-ink-600">{s.text}</p>
            </li>
          ))}
        </ol>
        <Punkte
          items={[
            "Überwachung rund um die Uhr über das Monitoring, Meldung an Sie oder die Hausverwaltung",
            "Drohnen-Thermografie, Reinigung und E-Check aus einer Hand",
            "Bericht nach jedem Einsatz – auf Wunsch auch für Versicherung und Buchhaltung",
          ]}
        />
        <Weiter href="/service/wartung">Wartung & Wartungsvertrag</Weiter>
      </Panel>
    ),
  },
];

export default function ChaletsPage() {
  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <LuxusHero
        breadcrumbs={[{ name: "Luxus-Chalets & Alpin" }]}
        zeile="Luxus-Chalets & alpine Premium-Immobilien"
        titel={
          <>
            Photovoltaik für Luxus-Chalets <span className="text-white/60">&amp;</span> alpine Premium-Immobilien
          </>
        }
        lead="Von der Indach-Integration bis zur Concierge-Wartung – sechs Bereiche, in denen wir Maßstäbe für Premium-Photovoltaik in Luxus-Immobilien setzen."
        bild={{ src: HERO_BILD, alt: "Beleuchtetes Chalet unter Sternenhimmel über einem Bergsee im Winter", position: "50% 70%" }}
        aktionen={[
          { label: "Diskrete Beratung anfragen", href: "/termin?art=video" },
          { label: "Standort-Check", href: "/standort-check", icon: Mountain },
        ]}
        punkte={["Indach & Full-Black", "Schneelast nach ÖNORM B 1991-1-3", "Blackout-Speicher", "Concierge-Wartung"]}
      />

      {/* ---------- Überblick & sechs Bereiche ---------- */}
      <section id="chalet-bereiche" className="scroll-mt-24 bg-white py-24 md:py-32">
        <div className="ov-container">
          <LuxusKopf
            zentriert
            zeile="Sechs Bereiche"
            titel="Was Premium-Photovoltaik im alpinen Raum ausmacht"
            text="Ein Chalet in 1.400 m Seehöhe stellt andere Anforderungen als ein Einfamilienhaus im Flachland: mehr Schnee, strengere Gestaltung, abgelegene Zufahrten, lange Abwesenheiten. Diese sechs Bereiche planen wir von Anfang an zusammen."
          />
          <Reveal className="mt-14 md:mt-16">
            <LuxusZahlen
              items={[
                { wert: 8100, suffix: " Pa", label: "Prüflast einzelner Hochlastmodule – Standard sind 2400 Pa" },
                { wert: 2000, suffix: " m", label: "Seehöhe, bis zu der die Schneelastkarte der ÖNORM B 1991-1-3:2022 gilt" },
                { wert: 50, suffix: " m", label: "Raster der Schneelastkarte – der Wert gilt je Grundstück, nicht je Ort" },
                { wert: 1.5, dezimal: 1, label: "Sicherheitsfaktor zwischen Prüf- und Bemessungslast nach IEC 61215" },
              ]}
            />
          </Reveal>
          <div className="mt-16 md:mt-24">
            <BereicheGalerie bereiche={GALERIE} />
          </div>
        </div>
      </section>

      {/* ---------- Alpine Statik: dunkle Sektion mit Schneelast-Mini ---------- */}
      <section id="statik" className="ov-noise relative isolate scroll-mt-24 overflow-hidden bg-navy-950 py-24 text-white md:py-36">
        <Image src="/Images/AT/loesungen-b/chalets-luftbild-schnee.jpg" alt="" fill sizes="100vw" className="-z-20 object-cover opacity-[0.18]" />
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-b from-navy-950 via-navy-950/80 to-navy-950" />
        <div aria-hidden="true" className="absolute -right-40 top-20 -z-10 h-[480px] w-[480px] rounded-full bg-navy-400/25 blur-[120px]" />
        <div className="ov-container">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-end lg:gap-20">
            <LuxusKopf dunkel zeile="Alpine Statik" titel="Schneelast, Wind und Hagel – für jedes Grundstück gerechnet" />
            <Reveal delay={120} className="text-[16px] leading-[1.75] text-white/70">
              <p>
                Aus der Bodenschneelast sₖ ergibt sich mit Dachneigung und Schneefang die Dachschneelast. Sie vergleichen wir mit der Bemessungslast der Module: Prüflast laut Datenblatt geteilt durch den Sicherheitsfaktor 1,5
                nach IEC 61215.
              </p>
            </Reveal>
          </div>

          <Reveal className="mt-14 md:mt-16">
            <SchneelastMini />
          </Reveal>

          <div className="mt-16 grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
            <LinienListe
              dunkel
              spalten={1}
              items={[
                { titel: "Schneefang & Dachlawinen", text: "Hält den Schnee auf dem Dach und schützt Wege, Terrassen und Stellplätze. Eigentümer an der Straße müssen Schneewächten und Eis entfernen lassen (§ 93 Abs. 2 StVO)." },
                { titel: "Wind & Hagel", text: "Basiswindgeschwindigkeit nach ÖNORM B 1991-1-4 und Hagelkorngröße aus eHORA; Module mit passender Hagelwiderstandsklasse (HW 1–5) laut Hagelregister." },
              ]}
            />
            {BEISPIEL && (
              <Reveal id="statik-rechnung" className="scroll-mt-28 border-t border-white/15 pt-6">
                <p className="text-[11.5px] font-semibold uppercase tracking-[0.24em] text-ov-300">Rechenbeispiel · fiktiver Standort</p>
                <h3 className="mt-3 font-display text-[22px] font-light leading-snug tracking-tight md:text-[26px]">sₖ = 4,0 kN/m², Satteldach 30°, mit Schneefang</h3>
                <p className="mt-3 text-[14.5px] leading-relaxed text-white/65">
                  Solche Werte sind in hohen Tiroler und Vorarlberger Lagen realistisch. Das Beispiel zeigt, warum Standardmodule dort nicht genügen. Ihren eigenen Wert ermitteln Sie im Standort-Check.
                </p>
                <dl className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-white/10">
                  {[
                    ["Dachschneelast", `${fmt(BEISPIEL.s)} kN/m²`, `μ₁ = ${fmt(BEISPIEL.mu1, 1)}`],
                    ["je m² Modul", `${fmt(BEISPIEL.modulFlaeche)} kN/m²`, "s · cos 30°"],
                    ["Bemessungswert", `${BEISPIEL.bemessungPa.toLocaleString("de-DE")} Pa`, "× 1,5"],
                    ["Nötige Prüflast", BEISPIEL.empfohlen ? `${BEISPIEL.empfohlen.pruef.toLocaleString("de-DE")} Pa` : "Sonderlösung", BEISPIEL.empfohlen ? `Auslastung ${Math.round(BEISPIEL.empfohlen.auslastung * 100)} %` : "Einzelnachweis"],
                  ].map(([k, v, z]) => (
                    <div key={k} className="bg-navy-950/85 p-4">
                      <dt className="text-[12.5px] text-white/55">{k}</dt>
                      <dd className="ov-num mt-1 font-display text-[19px] font-bold">{v}</dd>
                      <dd className="mt-0.5 text-[12px] text-white/50">{z}</dd>
                    </div>
                  ))}
                </dl>
              </Reveal>
            )}
          </div>
        </div>
      </section>

      {/* ---------- Regionen ---------- */}
      <section className="bg-sand-50 py-24 md:py-32">
        <div className="ov-container">
          <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
            <div>
              <LuxusKopf
                zeile="Regionen"
                titel="Von Kitzbühel bis zum Wörthersee"
                text="Wir planen und bauen in allen neun Bundesländern. Diese Regionen stehen für alpine Premium-Immobilien – mit jeweils eigenen Anforderungen an Statik, Gestaltung und Service."
              />
              <Reveal delay={100} className="relative mt-12 hidden aspect-[4/5] overflow-hidden rounded-[1.75rem] lg:block">
                <Image src="/Images/AT/loesungen-b/chalets-lech-winter.jpg" alt="Verschneiter Ort Lech am Arlberg mit Hotels und Chalets im Tal" fill sizes="(max-width: 1024px) 100vw, 38vw" className="object-cover" />
              </Reveal>
            </div>
            <ul className="grid gap-x-10 sm:grid-cols-2">
              {REGIONEN.map((r, i) => (
                <Reveal as="li" key={r.name} delay={(i % 4) * 60} className="border-t border-ink-200 py-6">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-ov-700">{r.land}</p>
                  <p className="mt-1.5 font-display text-[19px] font-semibold tracking-tight text-ink-900">{r.name}</p>
                  <p className="mt-1.5 text-[14.5px] leading-relaxed text-ink-600">{r.text}</p>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ---------- Vorgehen ---------- */}
      <Section tone="white" space="lg">
        <LuxusKopf zentriert zeile="Vorgehen" titel="Vom vertraulichen Erstgespräch bis zur Concierge-Wartung" className="mb-16" />
        <Steps
          items={[
            { icon: Users, title: "Diskretes Erstgespräch", text: "Per Video oder vor Ort, auf Wunsch mit Architekt oder Hausverwaltung. Ziele, Zeitplan, Gestaltungsrahmen." },
            { icon: Mountain, title: "Standort & Statik", text: "Schneelast, Wind und Hagel aus HORA, Dachstuhl und Horizont prüfen, Module und Unterkonstruktion festlegen." },
            { icon: HardHat, title: "Bewilligung & Montage", text: "Unterlagen für Gemeinde, Beirat oder Bundesdenkmalamt; Montage in der Zwischensaison, sauber und koordiniert." },
            { icon: LineChart, title: "Betrieb & Service", text: "Übergabe mit Dokumentation, Monitoring, Fernwartung und Saisonservice – ein Ansprechpartner bleibt." },
          ]}
        />
      </Section>

      {/* ---------- FAQ ---------- */}
      <Section tone="white" space="lg">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div>
            <LuxusKopf zeile="Häufige Fragen" titel="Photovoltaik am Chalet: Fragen & Antworten" />
            <Weiter href="/standort-check">Schneelast für Ihre Adresse</Weiter>
            <Reveal delay={120} className="relative mt-12 hidden aspect-[4/5] overflow-hidden rounded-[1.75rem] lg:block">
              <Image src="/Images/AT/loesungen-b/chalets-balkon-ausblick.jpg" alt="Holzbalkon eines Chalets mit Sessel und Blick auf verschneite Berghänge" fill sizes="38vw" className="object-cover" />
              <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-navy-950/75 via-transparent to-transparent" />
              <p className="absolute inset-x-0 bottom-0 p-7 font-display text-[21px] font-light leading-snug tracking-tight text-white">Ein Ansprechpartner, der Ihr Haus kennt – von der ersten Besichtigung bis zur Wartung.</p>
            </Reveal>
          </div>
          <Faq items={FAQ} />
        </div>
      </Section>

      <Querverweise pfad={PFAD} ueberschrift="Vertiefen: Technik, Service & Planung" />

      <CtaBand
        eyebrow="Diskret & persönlich"
        title="Sprechen wir vertraulich über Ihr Chalet."
        text="Ein Gespräch per Video oder vor Ort – mit Ihnen, Ihrem Architekten oder Ihrer Hausverwaltung. Wir bringen eine erste Einschätzung zu Schneelast, Gestaltung, Speicher und Service mit."
        primary={{ label: "Diskrete Beratung anfragen", href: "/termin?art=video" }}
        secondary={{ label: "Standort-Check", href: "/standort-check", icon: Mountain }}
      />

      <Section tone="white" space="sm">
        <p className="text-[12px] leading-relaxed text-ink-500">
          Bildnachweis: Chalet unter Sternenhimmel – Hamza Yaich · Modernes Chalet – Atlantic Ambience · Holzhaus mit PV im Schnee – Jarosław Ponikowski · Badezuber im Abendlicht – Barnabas Davoti · Panoramafenster – Beka
          Ichkiti · Balkon mit Bergblick – Leeloo The First · Lech am Arlberg – Tobi &amp; Chris · Verschneites Chaletdorf – Ollie Craig (alle Pexels-Lizenz, pexels.com/license) · Verschneite Chalets – Daniel Reust, CC BY 4.0
          (commons.wikimedia.org, File:Chalets_im_Winter.jpg) · PV-Module im Schnee – Stephen Yang / The Solutions Project, CC BY 2.0 (commons.wikimedia.org, File:Solar_panels_in_the_snow_(9250).jpg). Lizenztexte:
          creativecommons.org/licenses/by/4.0 und /by/2.0.
        </p>
      </Section>
    </div>
  );
}
