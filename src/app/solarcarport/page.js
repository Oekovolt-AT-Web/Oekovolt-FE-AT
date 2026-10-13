// Welle C / C04: Landingpage Solarcarport und Parkplatz-PV für Betriebe und Gemeinden.
//
// Rechtslage ab 2030 (überdachte Parkplätze):
//  - EABG: laut Parlamentskorrespondenz Nr. 542 vom 11.06.2026 hat der Nationalrat mit der Abänderung „Regelungen
//    für die Neuerrichtung von überdachten Parkplätzen ab 2030“ verankert. Wortlaut, Schwellen und Ausnahmen sind
//    im RIS NICHT geprüft → Anzeige als „laut Parlamentsbeschluss, Kundmachung ausstehend“, keine Details.
//    Nach Prüfung im RIS EABG_KUNDMACHUNG befüllen (bgbl, ris, text) – dann entfällt der Vorbehalt.
//  - OIB-Richtlinie 6:2025 und § 66a NÖ BO 2014 (Belege im Ratgeber solarpflicht-bundeslaender, Stand 09/2026).
// Beispielrechnung mit offengelegten Annahmen (wie Ratgeber solarcarport) – Richtwert, kein Angebot.

import Link from "next/link";
import { ArrowRight, Building2, Car, ClipboardList, CloudHail, Flame, HandCoins, Landmark, PlugZap, Ruler, ShoppingCart, Snowflake, Wind } from "lucide-react";

import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import Faq from "@/components/ui/Faq";
import CtaBand from "@/components/ui/CtaBand";
import LoesungSchema from "@/components/Loesungen/LoesungSchema";
import { Bildnachweis, Hebel, Hinweis, Tabelle } from "@/components/Loesungen/Bausteine";
import Ansprechpartner from "@/components/Verkauf/Ansprechpartner";
import { BASE_URL } from "@/lib/site";

const PFAD = "/solarcarport";
const PAGE_URL = `${BASE_URL}${PFAD}`;
const TITEL = "Solarcarport & Parkplatz-PV für Betriebe | Ökovolt";
const BESCHREIBUNG =
  "Solarcarport und Parkplatz-Photovoltaik in Österreich: Pflichten für neue überdachte Parkplätze ab 2030, Statik nach ÖNORM, Brandschutz, Ladepunkte und Förderung.";
const HERO_BILD = "/Images/AT/loesungen/ladeinfrastruktur-solarcarport.jpg";
const STAND = "12.10.2026";

const TERMIN = "/termin?art=video&thema=gewerbe";
// Konfigurator-Vorbelegung nur über Link-Parameter (der Konfigurator wertet „branche“ derzeit nicht aus – Übergabe C04)
const ANFRAGE = "/angebot?objekt=gewerbe&branche=parkplatz";

/**
 * EABG-Kundmachung – erst nach Prüfung im RIS eintragen, z. B.
 * { bgbl: "BGBl. I Nr. …/2026", paragraf: "§ …", ris: "https://www.ris.bka.gv.at/…", text: "…" }
 * Bis dahin: null → Anzeige „laut Parlamentsbeschluss, Kundmachung ausstehend“.
 */
const EABG_KUNDMACHUNG = null;
const PK_EABG = { titel: "Parlamentskorrespondenz Nr. 542 vom 11.06.2026 – Nationalrat: Erneuerbaren-Ausbau-Beschleunigungsgesetz (EABG) erhält Zustimmung der Grünen", url: "https://www.parlament.gv.at/aktuelles/pk/jahr_2026/pk0542", stand: "06/2026" };

// Beispiel wie im Ratgeber solarcarport: 40 Stellplätze × 2,5 kWp, 1.000 kWh/kWp – Annahmen, Richtwert
const STELLPLAETZE = 40;
const KWP_JE_PLATZ = 2.5;
const ERTRAG_JE_KWP = 1000;
const BEISPIEL_KWP = STELLPLAETZE * KWP_JE_PLATZ;
const BEISPIEL_KWH = BEISPIEL_KWP * ERTRAG_JE_KWP;
const zahl = (n) => Math.round(n).toLocaleString("de-DE");

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
    images: [{ url: `${BASE_URL}${HERO_BILD}` }],
  },
};

const ANWENDUNGEN = [
  { icon: ShoppingCart, titel: "Kundenparkplatz im Handel", text: "Märkte und Fachmärkte haben große Parkflächen und tagsüber hohen Verbrauch aus Kühlung und Beleuchtung." },
  { icon: Building2, titel: "Mitarbeiterparkplatz", text: "Dienst- und Privatautos laden während der Arbeitszeit – mit Solarstrom vom Dach über dem Stellplatz." },
  { icon: Car, titel: "Fahrzeugplatz im Autohaus", text: "Hagel- und Sonnenschutz für Neu- und Gebrauchtwagen, Strom für Vorführwagen und Werkstatt." },
  { icon: Landmark, titel: "Gemeinde & Park-and-Ride", text: "Öffentliche Parkflächen doppelt nutzen – Überschuss kann in eine Energiegemeinschaft fließen." },
];

const STATIK = [
  { icon: Snowflake, titel: "Schneelast", text: "Bemessung nach ÖNORM B 1991-1-3 mit der Schneelast des Grundstücks. Sie bestimmt Stützen, Träger und Fundamente – in alpinen Lagen deutlich mehr als im Flachland." },
  { icon: Wind, titel: "Wind", text: "Windlasten nach ÖNORM B 1991-1-4; offene Überdachungen erfahren Sog von unten. Fundamente und Verankerung werden darauf ausgelegt." },
  { icon: Ruler, titel: "Lichte Höhe & Anfahrschutz", text: "Durchfahrtshöhe für Transporter, Räumfahrzeuge und Rettung, Anfahrschutz an den Stützen, Entwässerung und Schneeabwurf." },
  { icon: Flame, titel: "Elektro & Brandschutz", text: "Elektroinstallation in überdachten Stellplätzen nach OVE R 2000-7-7N90, Kennzeichnung und Feuerwehrplan nach OVE R 11-1. Blendung bewerten wir im Einzelfall." },
];

const FAQ = [
  {
    q: "Gibt es ab 2030 eine Pflicht für Photovoltaik auf überdachten Parkplätzen?",
    a: "Für neu errichtete überdachte Parkplätze kommen ab 2030 Vorgaben aus mehreren Richtungen: Laut Parlamentskorrespondenz vom 11.06.2026 hat der Nationalrat im EABG Regelungen für die Neuerrichtung überdachter Parkplätze ab 2030 verankert – Wortlaut und Kundmachung im RIS stehen bei uns noch zur Prüfung aus. Unabhängig davon verlangt die OIB-Richtlinie 6 (Ausgabe 2025), wo ein Land sie verbindlich erklärt hat, und die NÖ Bauordnung ab 2030 Solaranlagen auf neuen überdachten Parkplätzen mit mindestens drei Stellplätzen, die an ein Gebäude angrenzen. Eine Pflicht, bestehende offene Parkplätze zu überdachen, ergibt sich daraus nicht.",
  },
  {
    q: "Wie viel Leistung passt auf einen Parkplatz?",
    a: `Als Richtwert rechnen wir mit rund ${KWP_JE_PLATZ.toLocaleString("de-DE")} kWp je Stellplatz. ${STELLPLAETZE} Stellplätze ergeben damit etwa ${zahl(BEISPIEL_KWP)} kWp und bei ${zahl(ERTRAG_JE_KWP)} kWh/kWp rund ${zahl(BEISPIEL_KWH)} kWh im Jahr. Die tatsächliche Leistung hängt von Stellplatzbreite, Fahrgassen, Ausrichtung und Verschattung ab.`,
  },
  {
    q: "Braucht ein Solarcarport eine Baubewilligung?",
    a: "Ein Solarcarport ist ein Bauwerk. Ob Anzeige oder Bewilligung nötig ist, regeln die Bauordnungen der Bundesländer – dazu kommen Stellplatzvorgaben, Abstände und gegebenenfalls Ortsbildschutz. Einen Überblick geben unsere Seite Baurecht und der Ratgeber Solarcarport.",
  },
  {
    q: "Wird ein Solarcarport gefördert?",
    a: "Der PV-Teil kann grundsätzlich über den EAG-Investitionszuschuss gefördert werden. Für Parkplatzüberdachungen ab 10 Stellplätzen nennt der Leitfaden des Landes Oberösterreich einen Zuschlag von 30 % für innovative Anlagen (EAG-IZV § 6). Wie ein Carport im jeweiligen Fördercall eingestuft wird, prüfen wir vor dem Antrag – Beträge und Fristen ändern sich je Call.",
  },
  {
    q: "Sollen Ladepunkte gleich mitgebaut werden?",
    a: "Mindestens vorbereitet: Leerrohre, Kabelwege und Platz im Verteiler kosten beim Bau wenig, nachträglich viel. Für Ladeeinrichtungen gelten die TOR des Netzbetreibers; öffentlich zugängliche Ladepunkte müssen die EU-Verordnung AFIR erfüllen, bei Abrechnung nach Kilowattstunden kommt das Eichrecht dazu.",
  },
];

const QUELLEN = [
  { titel: PK_EABG.titel, url: PK_EABG.url, stand: "06/2026 (Kundmachung im RIS zu prüfen)" },
  { titel: "OIB – OIB-Richtlinie 6, Ausgabe September 2025 (Solargebot)", url: "https://www.oib.or.at/wp-content/uploads/oib-rl_6_september_2025.pdf", stand: "09/2025" },
  { titel: "NÖ Bauordnung 2014, § 66a Verpflichtung zur Errichtung von Solarenergieanlagen (jusline.at)", url: "https://www.jusline.at/gesetz/noe__bo_2014/paragraf/66a", stand: "09/2026" },
  { titel: "Richtlinie (EU) 2024/1275 über die Gesamtenergieeffizienz von Gebäuden, Art. 10", url: "https://eur-lex.europa.eu/eli/dir/2024/1275/oj", stand: "05/2024" },
  { titel: "OVE – Richtlinien (R 2000-7-7N90 überdachte Stellplätze, R 11-1 Feuerwehr)", url: "https://www.ove.at/ove-standardization/normen-produkte/richtlinien/", stand: "09/2026" },
  { titel: "Land Oberösterreich – Photovoltaik-Leitfaden 2026 (EAG-Zuschläge)", url: "https://www.land-oberoesterreich.gv.at/Mediendateien/Formulare/Dokumente%20UWD%20Abt_US/Photovoltaik_Leitfaden.pdf", stand: "01/2026" },
  { titel: "Verordnung (EU) 2023/1804 (AFIR)", url: "https://eur-lex.europa.eu/eli/reg/2023/1804/oj", stand: "09/2023" },
];

const WEITER = [
  { href: "/ratgeber/solarcarport", titel: "Ratgeber Solarcarport", text: "Planung, Recht, Laden, Rechenbeispiel." },
  { href: "/ratgeber/solarpflicht-bundeslaender", titel: "Solarpflicht der Bundesländer", text: "Was in welchem Land gilt." },
  { href: "/ladeinfrastruktur", titel: "Ladeinfrastruktur für Betriebe", text: "AC und DC, Lastmanagement, Abrechnung." },
  { href: "/gewerbe/handel-logistik", titel: "Handel & Logistik", text: "Hallendach, Kundenparkplatz, Depot." },
];

export default function SolarcarportPage() {
  return (
    <div>
      <LoesungSchema
        pfad={PFAD}
        name="Solarcarport und Parkplatz-Photovoltaik in Österreich"
        titel={TITEL}
        beschreibung={BESCHREIBUNG}
        zielgruppe="Handel, Betriebe mit Mitarbeiterparkplatz, Autohäuser, Hotellerie und Gemeinden"
        bild={HERO_BILD}
        leistungen={["Solarcarport-Planung mit Statik", "Parkplatz-Photovoltaik", "Ladepunkte und Lastmanagement", "Förder- und Genehmigungsvorbereitung", "Monitoring und Wartung"]}
      />

      <PageHero
        variant="immersive"
        breadcrumbs={[{ name: "Solarcarport & Parkplatz-PV" }]}
        eyebrow="Parkplatz-PV für Betriebe & Gemeinden"
        title={<>Solarcarport: Ihr Parkplatz <span className="ov-text-gradient-light">als Kraftwerk</span></>}
        lead={
          <>
            <span className="block font-display text-[1.15em] font-bold leading-snug text-white">Schatten und Hagelschutz für die Fahrzeuge, Strom für Betrieb und Ladepunkte.</span>
            <span className="mt-3 hidden sm:block">
              Parkplätze sind oft die größte ungenutzte Fläche eines Betriebs. Wir planen Überdachung, Statik, Module und Ladepunkte als ein System – und
              behalten die Vorgaben für neue überdachte Parkplätze ab 2030 im Blick.
            </span>
          </>
        }
        image={{ src: HERO_BILD, alt: "Luftbild von Solar-Carports mit Ladestationen auf einem Parkplatz (Symbolbild)", position: "50% 50%" }}
        actions={[
          { label: "Parkplatz prüfen lassen", href: TERMIN },
          { label: "Projekt anfragen", href: ANFRAGE, icon: ClipboardList },
        ]}
        points={["Vorgaben ab 2030 im Blick", "Statik nach ÖNORM", "Ladepunkte gleich mitgeplant"]}
      />

      <Section tone="white" space="lg" id="ab-2030">
        <SectionHeading
          eyebrow="Rechtslage"
          title="Neue überdachte Parkplätze ab 2030: Was gilt – und was noch offen ist."
          lead="Mehrere Regeln zielen auf Photovoltaik über neuen überdachten Stellplätzen. Wir zeigen, was belegt ist, und markieren, was wir noch prüfen."
          className="mb-10"
        />
        <div className="grid gap-5 lg:grid-cols-3">
          <article className="flex flex-col rounded-[1.5rem] bg-sand-50 p-6 md:p-7">
            <span className="inline-flex w-fit rounded-full bg-navy-900 px-3 py-1 text-[12px] font-semibold uppercase tracking-[0.1em] text-white">
              {EABG_KUNDMACHUNG ? EABG_KUNDMACHUNG.bgbl : "Kundmachung ausstehend"}
            </span>
            <h3 className="mt-4 font-display text-[19px] font-bold text-ink-900">Bund: EABG</h3>
            {EABG_KUNDMACHUNG ? (
              <p className="mt-2 text-[15px] leading-relaxed text-ink-600">
                {EABG_KUNDMACHUNG.text}{" "}
                <a href={EABG_KUNDMACHUNG.ris} target="_blank" rel="noopener noreferrer" className="font-semibold text-ov-700 underline">
                  Kundmachung im RIS
                </a>
              </p>
            ) : (
              <p className="mt-2 text-[15px] leading-relaxed text-ink-600">
                Laut Parlamentsbeschluss vom 11.06.2026 verankert das Erneuerbaren-Ausbau-Beschleunigungsgesetz Regelungen für die Neuerrichtung
                überdachter Parkplätze ab 2030. Wortlaut, Schwellenwerte und Ausnahmen prüfen wir nach der Kundmachung im RIS – bis dahin nennen wir keine
                Details.
              </p>
            )}
            <a href={PK_EABG.url} target="_blank" rel="noopener noreferrer" className="mt-auto inline-flex min-h-11 w-fit items-center pt-4 text-[13.5px] font-semibold text-ov-700 underline">
              Quelle: Parlamentskorrespondenz Nr. 542/2026
            </a>
          </article>
          <article className="flex flex-col rounded-[1.5rem] bg-sand-50 p-6 md:p-7">
            <span className="inline-flex w-fit rounded-full bg-ov-100 px-3 py-1 text-[12px] font-semibold uppercase tracking-[0.1em] text-ov-800">ab 1. 1. 2030</span>
            <h3 className="mt-4 font-display text-[19px] font-bold text-ink-900">OIB-Richtlinie 6 (2025)</h3>
            <p className="mt-2 text-[15px] leading-relaxed text-ink-600">
              Solarenergieanlagen auf neuen überdachten Parkplätzen mit mindestens drei Stellplätzen, die an ein Gebäude angrenzen – Mindestleistung 1 kWp je
              Stellplatz. Gilt dort, wo das Land die Richtlinie verbindlich erklärt hat.
            </p>
            <a href="https://www.oib.or.at/wp-content/uploads/oib-rl_6_september_2025.pdf" target="_blank" rel="noopener noreferrer" className="mt-auto inline-flex min-h-11 w-fit items-center pt-4 text-[13.5px] font-semibold text-ov-700 underline">
              Quelle: OIB-RL 6, Ausgabe September 2025
            </a>
          </article>
          <article className="flex flex-col rounded-[1.5rem] bg-sand-50 p-6 md:p-7">
            <span className="inline-flex w-fit rounded-full bg-ov-100 px-3 py-1 text-[12px] font-semibold uppercase tracking-[0.1em] text-ov-800">ab 2030</span>
            <h3 className="mt-4 font-display text-[19px] font-bold text-ink-900">Niederösterreich</h3>
            <p className="mt-2 text-[15px] leading-relaxed text-ink-600">
              § 66a NÖ Bauordnung 2014: geeignete Solarenergieanlagen auf neuen überdachten Parkplätzen mit mindestens drei Pkw-Stellplätzen, die an Gebäude
              angrenzen – sofern technisch geeignet sowie wirtschaftlich und funktional realisierbar.
            </p>
            <a href="https://www.jusline.at/gesetz/noe__bo_2014/paragraf/66a" target="_blank" rel="noopener noreferrer" className="mt-auto inline-flex min-h-11 w-fit items-center pt-4 text-[13.5px] font-semibold text-ov-700 underline">
              Quelle: § 66a NÖ BO 2014
            </a>
          </article>
        </div>
        <Hinweis className="mt-8" titel="Was das für Sie heißt">
          Die Vorgaben betreffen neu errichtete überdachte Parkplätze, keine bestehenden offenen Stellflächen. Wer jetzt plant, sollte Statik, Leitungswege
          und Ladepunkte so auslegen, dass die Überdachung die Module von Anfang an trägt. Alle Länder im Überblick im Ratgeber{" "}
          <Link href="/ratgeber/solarpflicht-bundeslaender" className="font-semibold text-ov-700 underline">Solarpflicht der Bundesländer</Link>. Keine Rechtsberatung.
        </Hinweis>
      </Section>

      <Section tone="sand" space="lg" id="anwendungen">
        <SectionHeading eyebrow="Anwendungen" title="Wo sich Parkplatz-PV besonders lohnt" className="mb-10" />
        <Hebel items={ANWENDUNGEN} cols={4} />
      </Section>

      <Section tone="white" space="lg" id="statik">
        <SectionHeading
          eyebrow="Statik & Technik"
          title="Ein Solarcarport ist ein Bauwerk – die Statik entscheidet über die Kosten."
          lead="Stützen, Träger und Fundamente müssen Schnee, Wind und den Parkplatzalltag aushalten. Das planen wir vor dem ersten Modul."
          className="mb-10"
        />
        <Hebel items={STATIK} cols={4} />
        <div className="mt-8 flex flex-wrap gap-3 text-[15px]">
          <Link href="/schneelast" className="inline-flex min-h-11 items-center rounded-full bg-sand-50 px-4 font-semibold text-ink-700 transition-colors hover:text-ov-700">
            <Snowflake aria-hidden="true" className="mr-1.5 h-4 w-4 text-ov-600" />
            Schneelast-Karte: Richtwert für Ihren Standort
          </Link>
          <Link href="/standort-check" className="inline-flex min-h-11 items-center rounded-full bg-sand-50 px-4 font-semibold text-ink-700 transition-colors hover:text-ov-700">
            <CloudHail aria-hidden="true" className="mr-1.5 h-4 w-4 text-ov-600" />
            Standort-Check: Wind, Hagel, Naturgefahren
          </Link>
          <Link href="/forderungen/baurecht" className="inline-flex min-h-11 items-center rounded-full bg-sand-50 px-4 font-semibold text-ink-700 transition-colors hover:text-ov-700">
            <Landmark aria-hidden="true" className="mr-1.5 h-4 w-4 text-ov-600" />
            Baurecht der Bundesländer
          </Link>
        </div>
      </Section>

      <Section tone="navy" space="lg" id="laden" className="ov-noise overflow-hidden">
        <div aria-hidden="true" className="ov-grid-bg absolute inset-0 opacity-60" />
        <div className="relative grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-16">
          <div>
            <p className="text-[12.5px] font-semibold uppercase tracking-[0.16em] text-ov-300">Laden</p>
            <h2 className="ov-h2 mt-3 text-white">Strom erzeugen, wo die Autos stehen.</h2>
            <p className="mt-5 text-[16px] leading-relaxed text-white/70">
              Ein Solarcarport liefert den Strom direkt über dem Ladepunkt. Mit Lastmanagement laden Fahrzeuge bevorzugt dann, wenn die Module liefern – und der
              Netzanschluss bleibt im Rahmen.
            </p>
            <ul className="mt-8 space-y-3 text-[15px] leading-relaxed text-white/80">
              <li className="flex gap-3"><PlugZap aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-ov-300" />Leerrohre und Kabelwege beim Bau vorsehen – nachträglich ist es teuer.</li>
              <li className="flex gap-3"><PlugZap aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-ov-300" />Ladeeinrichtungen nach den TOR des Netzbetreibers melden bzw. bewilligen lassen.</li>
              <li className="flex gap-3"><PlugZap aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-ov-300" />Öffentlich zugängliche Ladepunkte: AFIR (Ad-hoc-Zahlung, Preisangabe); bei kWh-Abrechnung Eichrecht.</li>
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/ladeinfrastruktur" className="group inline-flex min-h-11 items-center gap-2 rounded-full bg-white/[0.08] px-5 text-[15px] font-semibold text-white transition-colors hover:bg-ov-600">
                Ladeinfrastruktur für Betriebe
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
              <Link href="/rechner/ladeinfrastruktur" className="group inline-flex min-h-11 items-center gap-2 rounded-full bg-white/[0.08] px-5 text-[15px] font-semibold text-white transition-colors hover:bg-ov-600">
                Ladeinfrastruktur-Rechner
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            </div>
          </div>
          <div className="rounded-[1.5rem] bg-white p-6 text-ink-900 md:p-7">
            <div className="flex items-center gap-3">
              <HandCoins aria-hidden="true" className="h-6 w-6 text-ov-600" />
              <h3 className="font-display text-[19px] font-bold">Beispiel: {STELLPLAETZE} Stellplätze</h3>
            </div>
            <Tabelle
              className="mt-5"
              dicht
              caption="Richtwert Solarcarport mit 40 Stellplätzen"
              mobil="karten"
              spalten={[
                { key: "pos", label: "Annahme" },
                { key: "wert", label: "Wert" },
              ]}
              zeilen={[
                { pos: "Stellplätze", wert: zahl(STELLPLAETZE) },
                { pos: "Leistung je Stellplatz (Richtwert)", wert: `${KWP_JE_PLATZ.toLocaleString("de-DE")} kWp` },
                { pos: "Anlagenleistung", wert: `≈ ${zahl(BEISPIEL_KWP)} kWp`, hervorheben: true },
                { pos: "Spezifischer Ertrag (Annahme)", wert: `${zahl(ERTRAG_JE_KWP)} kWh/kWp` },
                { pos: "Jahresertrag", wert: `≈ ${zahl(BEISPIEL_KWH)} kWh`, hervorheben: true },
              ]}
              fuss="Richtwert zur Orientierung, kein Angebot. Annahmen wie im Ratgeber Solarcarport (Stand 09/2026); Ertrag je nach Standort, Ausrichtung und Verschattung."
            />
            <p className="mt-4 text-[14px] leading-relaxed text-ink-600">
              Förderung: Der PV-Teil kann über den EAG-Investitionszuschuss gefördert werden; Einstufung und Zuschläge im jeweiligen Fördercall prüfen wir vor dem
              Antrag – siehe <Link href="/ratgeber/eag-investitionszuschuss" className="font-semibold text-ov-700 underline">EAG-Investitionszuschuss</Link> und{" "}
              <Link href="/foerdercheck" className="font-semibold text-ov-700 underline">Förder-Check</Link>.
            </p>
          </div>
        </div>
      </Section>

      <Section tone="white" space="lg">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <SectionHeading eyebrow="Häufige Fragen" title="Gut zu wissen zum Solarcarport" />
          <Faq items={FAQ} />
        </div>
      </Section>

      {/* Ansprechpartner bringt keinen eigenen Container mit */}
      <Section tone="white" space="sm">
        <Ansprechpartner zielgruppe="speicher" />
      </Section>

      <Section tone="sand" space="md" aria-labelledby="weiter-titel">
        <h2 id="weiter-titel" className="ov-h3 mb-8 text-ink-900">Weiterlesen</h2>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {WEITER.map((w) => (
            <li key={w.href}>
              <Link href={w.href} className="group flex h-full flex-col rounded-3xl bg-white p-6 ring-1 ring-ink-200/60 transition-colors hover:ring-ov-300">
                <span className="font-display text-[17px] font-bold text-ink-900 group-hover:text-ov-700">{w.titel}</span>
                <span className="mt-2 text-[14.5px] leading-relaxed text-ink-600">{w.text}</span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <CtaBand
        eyebrow="Kostenlos & unverbindlich"
        title="Machen wir aus Ihrem Parkplatz ein Kraftwerk."
        text="Erstgespräch per Video oder vor Ort – mit Einschätzung zu Stellplätzen, Statik, Genehmigung, Ladepunkten und Förderung."
        primary={{ label: "Parkplatz prüfen lassen", href: TERMIN }}
        secondary={{ label: "Projekt anfragen", href: ANFRAGE, icon: ClipboardList }}
      />

      <section aria-labelledby="quellen-titel" className="bg-white">
        <div className="ov-container pb-6 pt-2">
          <h2 id="quellen-titel" className="text-[13px] font-semibold uppercase tracking-[0.14em] text-ink-500">Quellen & Stand</h2>
          <ul className="mt-3 space-y-1 text-[13px] leading-relaxed text-ink-500">
            {QUELLEN.map((q) => (
              <li key={q.url}>
                <a href={q.url} target="_blank" rel="noopener noreferrer" className="underline decoration-ink-300 underline-offset-2 hover:text-ov-700">{q.titel}</a> · Stand {q.stand}
              </li>
            ))}
          </ul>
          <p className="mt-3 text-[13px] text-ink-500">Zahlen sind Richtwerte zur Orientierung. Seite redaktionell geprüft am {STAND}.</p>
        </div>
      </section>

      <Bildnachweis
        items={[{ motiv: "Solar-Carports mit Ladestationen (Symbolbild, USA)", urheber: "pedrik", lizenz: "CC BY 2.0", href: "https://commons.wikimedia.org/wiki/File:Parking_under_Solar_Canopy_(52937580768).jpg" }]}
      />
    </div>
  );
}
