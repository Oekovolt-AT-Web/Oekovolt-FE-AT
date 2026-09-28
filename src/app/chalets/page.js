// src/app/chalets/page.js
//
// Photovoltaik für Luxus-Chalets & alpine Premium-Immobilien. Sechs Bereiche:
// Indach & Architektur · Alpine Statik · Speicher & Blackout · Smart Home & Wellness ·
// Diskretion & Projektsteuerung · Concierge-Wartung. Fachliche Quellen siehe Kommentare
// in src/lib/standort/berechnung.js; Bildquellen in public/Images/AT/QUELLEN-chalets.md.

import Image from "next/image";
import Link from "next/link";
import {
  BatteryCharging,
  FileCheck2,
  Gem,
  HardHat,
  KeyRound,
  Landmark,
  LineChart,
  Lock,
  Mountain,
  Paintbrush,
  Radio,
  ShieldCheck,
  Snowflake,
  UserRound,
  Users,
  Waves,
} from "lucide-react";

import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import FeatureGrid from "@/components/ui/FeatureGrid";
import SplitMedia from "@/components/ui/SplitMedia";
import Steps from "@/components/ui/Steps";
import Faq from "@/components/ui/Faq";
import CtaBand from "@/components/ui/CtaBand";
import Reveal from "@/components/ui/Reveal";
import Button from "@/components/ui/Button";
import Querverweise from "@/components/Reusable/Querverweise";
import { BASE_URL } from "@/lib/site";
import { bewerteSchnee } from "@/lib/standort/berechnung";

const PFAD = "/chalets";
const PAGE_URL = `${BASE_URL}${PFAD}`;
const TITEL = "Photovoltaik für Luxus-Chalets & Alpin-Immobilien | Ökovolt";
const BESCHREIBUNG =
  "PV für Chalets in Kitzbühel, Lech, Ischgl & Co.: Indach, Full-Black, Hochlastmodule nach ÖNORM B 1991-1-3, Blackout-Speicher, Smart Home und Concierge-Wartung.";

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
    images: [{ url: `${BASE_URL}/Images/AT/chalets/chalets-alpin-winter-mittelberg.jpg`, width: 1920, height: 1280, alt: "Verschneites Hochtal mit Hütte im Kleinwalsertal" }],
  },
};

// Rechenbeispiel mit fiktivem Standort – dieselbe Funktion wie im Standort-Check
const BEISPIEL = bewerteSchnee({ sk: 4, neigung: 30, schneefang: true, dachtiefe: 6 });
const fmt = (n, stellen = 2) => n.toLocaleString("de-AT", { minimumFractionDigits: stellen, maximumFractionDigits: stellen });

const BEREICHE = [
  { icon: Paintbrush, title: "Indach & Architektur", text: "Gebäudeintegrierte Module in Full-Black, Farbe oder Schiefer- und Schindeloptik – abgestimmt mit Architektur, Ortsbild und Denkmalschutz.", href: "#indach" },
  { icon: Snowflake, title: "Alpine Statik", text: "Schneelast nach ÖNORM B 1991-1-3, Hochlastmodule, verstärkte Unterkonstruktion, Schneefang, Wind und Hagel – für jeden Standort gerechnet.", href: "#statik" },
  { icon: BatteryCharging, title: "Speicher & Blackout-Autarkie", text: "Speicher mit Ersatzstrom oder echtem Inselbetrieb für abgelegene Lagen, Zufahrten im Winter und Häuser, die nie ausfallen dürfen.", href: "#speicher" },
  { icon: Waves, title: "Smart Home & Wellness", text: "Pool, Sauna, Wärmepumpe und E-Fahrzeuge mit einem Energiemanagement, das Solarstrom dorthin lenkt, wo er den meisten Komfort bringt.", href: "#smart-home" },
  { icon: Lock, title: "Diskretion & Projektsteuerung", text: "Ein Ansprechpartner für Eigentümer, Architekten, Bauträger und Hausverwaltung – vertraulich, dokumentiert und aus der Ferne steuerbar.", href: "#diskretion" },
  { icon: Gem, title: "Concierge-Wartung", text: "Saisonservice vor und nach dem Winter, Kontrolle nach Starkschneefall, Thermografie, Reinigung und laufende Überwachung.", href: "#concierge" },
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

function Tabelle({ caption, kopf, zeilen }) {
  return (
    <div className="overflow-x-auto rounded-3xl bg-white ring-1 ring-ink-200/70">
      <table className="w-full min-w-[560px] text-left text-[14.5px]">
        <caption className="px-5 pt-5 text-left font-display text-[17px] font-bold text-ink-900">{caption}</caption>
        <thead>
          <tr className="border-b border-ink-200 text-[12.5px] uppercase tracking-wider text-ink-500">
            {kopf.map((k, i) => (
              <th key={k} scope="col" className={i === 0 ? "px-5 py-3 font-semibold" : "px-4 py-3 font-semibold"}>
                {k}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-ink-100">
          {zeilen.map(([a, ...rest]) => (
            <tr key={a}>
              <th scope="row" className="px-5 py-3.5 align-top font-semibold text-ink-900">
                {a}
              </th>
              {rest.map((r) => (
                <td key={r} className="px-4 py-3.5 align-top text-ink-600">
                  {r}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function ChaletsPage() {
  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <PageHero
        variant="immersive"
        breadcrumbs={[{ name: "Luxus-Chalets & Alpin" }]}
        eyebrow="Luxus-Chalets & alpine Premium-Immobilien"
        title={
          <>
            Photovoltaik für Luxus-Chalets & <span className="ov-text-gradient-light">alpine Premium-Immobilien</span>
          </>
        }
        lead="Von der Indach-Integration bis zur Concierge-Wartung – sechs Bereiche, in denen wir Maßstäbe für Premium-Photovoltaik in Luxus-Immobilien setzen."
        image={{ src: "/Images/AT/chalets/chalets-alpin-winter-mittelberg.jpg", alt: "Verschneites Hochtal mit Holzhütte vor Bergkulisse im Kleinwalsertal", position: "70% 50%" }}
        actions={[
          { label: "Diskrete Beratung anfragen", href: "/termin?art=video" },
          { label: "Standort-Check", href: "/standort-check", icon: Mountain },
        ]}
        points={["Indach & Full-Black", "Schneelast nach ÖNORM B 1991-1-3", "Blackout-Speicher", "Concierge-Wartung"]}
      />

      {/* ---------- Überblick ---------- */}
      <Section tone="white" space="lg">
        <SectionHeading
          eyebrow="Sechs Bereiche"
          title="Was Premium-Photovoltaik im alpinen Raum ausmacht"
          lead="Ein Chalet in 1.400 m Seehöhe stellt andere Anforderungen als ein Einfamilienhaus im Flachland: mehr Schnee, strengere Gestaltung, abgelegene Zufahrten, lange Abwesenheiten. Diese sechs Bereiche planen wir von Anfang an zusammen."
          className="mb-12"
        />
        <FeatureGrid cols={3} items={BEREICHE} />
      </Section>

      {/* ---------- 1 Indach & Architektur ---------- */}
      <Section tone="sand" space="lg" id="indach" className="scroll-mt-24">
        <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
          <div>
            <SectionHeading eyebrow="01 · Indach & Architektur" title="Photovoltaik, die aussieht wie ein Teil des Hauses" />
            <div className="ov-prose mt-8">
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
          </div>
          <Reveal>
            <Tabelle caption="Gestaltungsoptionen im Überblick" kopf={["Lösung", "Optik & Technik", "Typischer Einsatz"]} zeilen={GESTALTUNG} />
            <p className="mt-3 px-1 text-[12.5px] leading-relaxed text-ink-500">Jede Lösung braucht die Freigabe des Herstellers für die Schneelast am Standort. Brandschutz nach OVE-Richtlinie R 11-1.</p>
          </Reveal>
        </div>
      </Section>

      {/* ---------- 2 Alpine Statik ---------- */}
      <Section tone="white" space="lg" id="statik" className="scroll-mt-24">
        <SplitMedia
          eyebrow="02 · Alpine Statik"
          title="Schneelast, Wind und Hagel – für jedes Grundstück gerechnet"
          image={{ src: "/Images/AT/chalets/chalets-schneelast-luftbild.jpg", alt: "Luftbild tief verschneiter Chalets mit meterhohen Schneedecken auf den Dächern" }}
          text={[
            "Die Schneelast eines Chalets hängt vom Grundstück ab, nicht vom Ort: Seit der ÖNORM B 1991-1-3:2022 gibt es keine Schneelastzonen mehr, sondern eine Karte im 50-Meter-Raster bis 2.000 m Seehöhe. Den Wert für Ihre Adresse zeigt eHORA – unser Standort-Check verlinkt ihn direkt.",
            "Aus der Bodenschneelast sₖ ergibt sich mit Dachneigung und Schneefang die Dachschneelast. Sie vergleichen wir mit der Bemessungslast der Module: Prüflast laut Datenblatt geteilt durch den Sicherheitsfaktor 1,5 nach IEC 61215.",
          ]}
          points={[
            { title: "Modulprüflasten", text: "Standard 2400 Pa, für Schneelagen 5400 Pa, einzelne Hochlastmodule 8100 Pa – immer mit dem vom Hersteller freigegebenen Klemmbereich." },
            { title: "Verstärkte Unterkonstruktion", text: "Hochlast-Dachhaken, engere Befestigungsabstände, Kreuzschienen oder Modulstützen; Dachstuhl durch Tragwerksplanung bestätigt." },
            { title: "Schneefang & Dachlawinen", text: "Hält den Schnee auf dem Dach und schützt Wege, Terrassen und Stellplätze. Eigentümer an der Straße müssen Schneewächten und Eis entfernen lassen (§ 93 Abs. 2 StVO)." },
            { title: "Wind & Hagel", text: "Basiswindgeschwindigkeit nach ÖNORM B 1991-1-4 und Hagelkorngröße aus eHORA; Module mit passender Hagelwiderstandsklasse (HW 1–5) laut Hagelregister." },
          ]}
          action={{ label: "Standort-Check starten", href: "/standort-check" }}
        />

        <Reveal className="mt-14">
          <div className="grid gap-4 rounded-3xl bg-navy-950 p-6 text-white md:grid-cols-[1fr_1.4fr] md:p-10">
            <div>
              <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-ov-300">Rechenbeispiel · fiktiver Standort</p>
              <h3 className="mt-3 font-display text-[22px] font-extrabold leading-snug md:text-[26px]">sₖ = 4,0 kN/m², Satteldach 30°, mit Schneefang</h3>
              <p className="mt-3 text-[14.5px] leading-relaxed text-white/70">
                Solche Werte sind in hohen Tiroler und Vorarlberger Lagen realistisch. Das Beispiel zeigt, warum Standardmodule dort nicht genügen. Ihren eigenen Wert ermitteln Sie im Standort-Check.
              </p>
            </div>
            {BEISPIEL && (
              <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-2 lg:grid-cols-4">
                {[
                  ["Dachschneelast", `${fmt(BEISPIEL.s)} kN/m²`, `μ₁ = ${fmt(BEISPIEL.mu1, 1)}`],
                  ["je m² Modul", `${fmt(BEISPIEL.modulFlaeche)} kN/m²`, "s · cos 30°"],
                  ["Bemessungswert", `${BEISPIEL.bemessungPa.toLocaleString("de-AT")} Pa`, "× 1,5"],
                  ["Nötige Prüflast", BEISPIEL.empfohlen ? `${BEISPIEL.empfohlen.pruef.toLocaleString("de-AT")} Pa` : "Sonderlösung", BEISPIEL.empfohlen ? `Auslastung ${Math.round(BEISPIEL.empfohlen.auslastung * 100)} %` : "Einzelnachweis"],
                ].map(([k, v, z]) => (
                  <div key={k} className="rounded-2xl bg-white/[0.06] p-4 ring-1 ring-white/10">
                    <dt className="text-[12.5px] text-white/60">{k}</dt>
                    <dd className="ov-num mt-1 font-display text-[20px] font-extrabold">{v}</dd>
                    <dd className="mt-0.5 text-[12px] text-white/55">{z}</dd>
                  </div>
                ))}
              </dl>
            )}
          </div>
        </Reveal>
      </Section>

      {/* ---------- 3 Speicher & Blackout ---------- */}
      <Section tone="sand" space="lg" id="speicher" className="scroll-mt-24">
        <SplitMedia
          reverse
          eyebrow="03 · Speicher & Blackout-Autarkie"
          title="Strom, wenn die Leitung im Tal liegt"
          image={{ src: "/Images/Ratgeber/notstrom-photovoltaik.jpg", alt: "Batteriespeicher mit Ersatzstrom-Gateway an einer Hauswand" }}
          text={[
            "Abgelegene Chalets hängen oft an langen Stichleitungen, die bei Sturm, Lawinen oder Schneebruch ausfallen können. Ein Speicher mit Ersatzstrom hält dann Heizung, Pumpen, Tore und Kommunikation in Betrieb.",
            "Wichtig ist die Unterscheidung: Eine gewöhnliche PV-Anlage schaltet bei Netzausfall ab. Erst ein netzbildender Wechselrichter mit automatischer Netztrennung macht das Haus blackoutfähig – und lädt den Speicher auch während des Ausfalls mit Solarstrom nach.",
          ]}
          points={[
            "Speichergröße nach Notlasten, nicht nach Eigenverbrauch allein",
            "Anlaufströme von Wärmepumpe und Pumpen im Inselbetrieb berücksichtigt",
            "Aggregat als zusätzliche Reserve für lange Schlechtwetterphasen",
          ]}
          action={{ label: "Notstrom & Blackout-Vorsorge", href: "/service/notstrom" }}
        />
        <Reveal className="mt-14">
          <Tabelle caption="Vier Stufen der Versorgungssicherheit" kopf={["Stufe", "Technik", "Versorgt typischerweise"]} zeilen={STROMARTEN} />
        </Reveal>
      </Section>

      {/* ---------- 4 Smart Home & Wellness ---------- */}
      <Section tone="white" space="lg" id="smart-home" className="scroll-mt-24">
        <SplitMedia
          eyebrow="04 · Smart Home, Wellness & Mobilität"
          title="Solarstrom für Pool, Sauna, Wärmepumpe und Fuhrpark"
          image={{ src: "/Images/Dienstleistungen/Smartphone/smart-home-3920905_1280.jpg", alt: "Tablet mit Smart-Home-Steuerung vor einem beleuchteten Wohnhaus" }}
          text="Wellnessbereiche und Haustechnik sind in Premium-Immobilien die größten Verbraucher. Ein Energiemanagement verteilt den Solarstrom nach Prioritäten – zuerst Komfort und Sicherheit, dann Speicher, Fahrzeuge und Wärme."
          points={[
            { title: "Pool & Whirlpool", text: "Poolwärmepumpe und Filterpumpe laufen bevorzugt mit Solarüberschuss." },
            { title: "Sauna & Infrarot", text: "Aufheizen planbar zur Mittagszeit oder aus dem Speicher – mit Blick auf die Leistungsspitze." },
            { title: "Wärmepumpe & Warmwasser", text: "Pufferspeicher und Gebäudemasse als Wärmespeicher für den Abend." },
            { title: "E-Fahrzeuge & Gäste", text: "Wallboxen für eigene Fahrzeuge und Gäste mit Lastmanagement passend zum Netzanschluss." },
            { title: "Gebäudeautomation", text: "Anbindung an bestehende Systeme (z. B. KNX) über offene Schnittstellen." },
          ]}
          action={{ label: "Energiemanagement & Speicher", href: "/produkte/stromspeicher" }}
        />
      </Section>

      {/* ---------- 5 Diskretion & Projektsteuerung ---------- */}
      <Section tone="navy" space="lg" id="diskretion" className="scroll-mt-24">
        <SectionHeading
          dark
          eyebrow="05 · Diskretion & Projektsteuerung"
          title="Ein Ansprechpartner für alle Beteiligten – vertraulich von Anfang an"
          lead="Bei Zweitwohnsitzen sind die Eigentümer selten vor Ort. Wir koordinieren Architektur, Bauträger, Gewerke und Hausverwaltung und berichten in der Form, die Sie wünschen."
          className="mb-12"
        />
        <FeatureGrid
          tone="dark"
          cols={3}
          items={[
            { icon: ShieldCheck, title: "Vertraulichkeit", text: "Keine Veröffentlichung von Adresse, Fotos oder Namen ohne Ihre Zustimmung; Vertraulichkeitsvereinbarung auf Wunsch." },
            { icon: Landmark, title: "Architekten & Bauträger", text: "Planungsdaten, Details und Termine abgestimmt mit Architektur und Bauablauf – idealerweise schon in der Entwurfsphase." },
            { icon: KeyRound, title: "Hausverwaltung & Zweitwohnsitz", text: "Zugänge, Schlüssel und Termine über Ihre Hausverwaltung; Montage bevorzugt in der Zwischensaison." },
            { icon: Radio, title: "Fernwartung", text: "Überwachung und Fernzugriff mit eigenen, abgesicherten Systemen – Details auf der Seite Fernwartung.", href: "/technik/fernwartung" },
            { icon: FileCheck2, title: "Dokumentation", text: "Anlagendokumentation und Prüfprotokolle nach ÖVE/ÖNORM EN 62446-1, statische Nachweise und Datenblätter an einem Ort." },
            { icon: UserRound, title: "Fester Ansprechpartner", text: "Eine Person, die Ihr Projekt kennt – von der ersten Besichtigung bis zur Wartung." },
          ]}
        />
      </Section>

      {/* ---------- 6 Concierge-Wartung ---------- */}
      <Section tone="white" space="lg" id="concierge" className="scroll-mt-24">
        <SplitMedia
          reverse
          eyebrow="06 · Concierge-Wartung"
          title="Service im Rhythmus der Saison"
          image={{ src: "/Images/AT/chalets/pv-module-schnee.jpg", alt: "Photovoltaikmodule mit abtauenden Schneeresten" }}
          text="Alpine Anlagen arbeiten unter härteren Bedingungen: Schneedruck, Eis, Temperaturwechsel und UV in der Höhe. Die Concierge-Wartung verbindet laufende Überwachung mit festen Terminen vor und nach dem Winter – organisiert mit Ihnen oder Ihrer Hausverwaltung."
          points={[
            "Überwachung rund um die Uhr über das Monitoring, Meldung an Sie oder die Hausverwaltung",
            "Drohnen-Thermografie, Reinigung und E-Check aus einer Hand",
            "Bericht nach jedem Einsatz – auf Wunsch auch für Versicherung und Buchhaltung",
          ]}
          action={{ label: "Wartung & Wartungsvertrag", href: "/service/wartung" }}
        />
        <ol className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {SAISON.map((s, i) => (
            <Reveal as="li" key={s.zeit} delay={i * 80} className="rounded-3xl bg-sand-50 p-6 ring-1 ring-ink-200/70">
              <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-ov-700">{s.zeit}</p>
              <h3 className="mt-2 font-display text-[19px] font-bold text-ink-900">{s.titel}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-ink-600">{s.text}</p>
            </Reveal>
          ))}
        </ol>
      </Section>

      {/* ---------- Regionen ---------- */}
      <Section tone="sand" space="lg">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div>
            <SectionHeading
              eyebrow="Regionen"
              title="Von Kitzbühel bis zum Wörthersee"
              lead="Wir planen und bauen in allen neun Bundesländern. Diese Regionen stehen für alpine Premium-Immobilien – mit jeweils eigenen Anforderungen an Statik, Gestaltung und Service."
            />
            <div className="mt-10 grid grid-cols-2 gap-4">
              <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-ink-100">
                <Image src="/Images/AT/chalets/chalets-zillertal-finkenberg.jpg" alt="Verschneite Häuser in Finkenberg im Zillertal" fill sizes="(max-width: 1024px) 50vw, 22vw" className="object-cover" />
              </div>
              <div className="relative mt-10 aspect-[4/5] overflow-hidden rounded-3xl bg-ink-100">
                <Image src="/Images/AT/chalets/chalets-salzkammergut-traunkirchen.jpg" alt="Traunsee bei Traunkirchen im Winter" fill sizes="(max-width: 1024px) 50vw, 22vw" className="object-cover" />
              </div>
            </div>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2">
            {REGIONEN.map((r, i) => (
              <Reveal as="li" key={r.name} delay={(i % 4) * 60} className="rounded-2xl bg-white p-5 ring-1 ring-ink-200/70">
                <p className="font-display text-[17px] font-bold text-ink-900">{r.name}</p>
                <p className="text-[12.5px] font-semibold uppercase tracking-wider text-ov-700">{r.land}</p>
                <p className="mt-2 text-[14.5px] leading-relaxed text-ink-600">{r.text}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </Section>

      {/* ---------- Vorgehen ---------- */}
      <Section tone="white" space="lg">
        <SectionHeading eyebrow="Vorgehen" title="Vom vertraulichen Erstgespräch bis zur Concierge-Wartung" align="center" className="mb-14" />
        <Steps
          items={[
            { icon: Users, title: "Diskretes Erstgespräch", text: "Per Video oder vor Ort, auf Wunsch mit Architekt oder Hausverwaltung. Ziele, Zeitplan, Gestaltungsrahmen." },
            { icon: Mountain, title: "Standort & Statik", text: "Schneelast, Wind und Hagel aus HORA, Dachstuhl und Horizont prüfen, Module und Unterkonstruktion festlegen." },
            { icon: HardHat, title: "Bewilligung & Montage", text: "Unterlagen für Gemeinde, Beirat oder Bundesdenkmalamt; Montage in der Zwischensaison, sauber und koordiniert." },
            { icon: LineChart, title: "Betrieb & Service", text: "Übergabe mit Dokumentation, Monitoring, Fernwartung und Saisonservice – ein Ansprechpartner bleibt." },
          ]}
        />
      </Section>

      <Querverweise pfad={PFAD} ueberschrift="Vertiefen: Technik, Service & Planung" />

      {/* ---------- FAQ ---------- */}
      <Section tone="sand" space="lg">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div>
            <SectionHeading eyebrow="Häufige Fragen" title="Photovoltaik am Chalet: Fragen & Antworten" />
            <div className="mt-8 flex flex-col gap-3 sm:flex-row lg:flex-col lg:items-start">
              <Button href="/standort-check" variant="secondary" icon={Mountain}>
                Schneelast für Ihre Adresse
              </Button>
            </div>
          </div>
          <Faq items={FAQ} />
        </div>
      </Section>

      <CtaBand
        eyebrow="Diskret & persönlich"
        title="Sprechen wir vertraulich über Ihr Chalet."
        text="Ein Gespräch per Video oder vor Ort – mit Ihnen, Ihrem Architekten oder Ihrer Hausverwaltung. Wir bringen eine erste Einschätzung zu Schneelast, Gestaltung, Speicher und Service mit."
        primary={{ label: "Diskrete Beratung anfragen", href: "/termin?art=video" }}
        secondary={{ label: "Standort-Check", href: "/standort-check", icon: Mountain }}
      />

      <Section tone="white" space="sm">
        <p className="text-[12px] leading-relaxed text-ink-500">
          Bildnachweis: Mittelberg/Kleinwalsertal – Mike Kotsch (CC0) · Verschneite Chalets – Daniel Reust, CC BY 4.0 (commons.wikimedia.org, File:Chalets_im_Winter.jpg) · PV-Module im Schnee – Stephen Yang / The Solutions Project,
          CC BY 2.0 (commons.wikimedia.org, File:Solar_panels_in_the_snow_(9250).jpg) · Finkenberg – Nicole Kühn (CC0) · Traunkirchen – Simon Matzinger (CC0). Lizenztexte: creativecommons.org/licenses/by/4.0 und /by/2.0.
        </p>
      </Section>
    </div>
  );
}
