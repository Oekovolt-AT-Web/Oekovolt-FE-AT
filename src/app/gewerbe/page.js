// /gewerbe – Unikat-Seite „Ein Betrieb, 35.040 Viertelstunden“ (Konzept docs/projekt-doku/anhang/wellen/GEWERBE-UNIKAT.md).
//
// Oben steht der Standard-Seitenkopf der Lösungsseiten (PageHero, Entscheidung des Inhabers vom 12.10.2026:
// „Den Hero-Bereich nicht abweichen von den anderen Seiten“). Direkt darunter beginnt die Unikat-Strecke:
// Wochen-Puls mit Rollen-Weiche und Kurzantwort (Hero.js), danach acht Kapitel mit je eigenem Instrument
// (src/components/GewerbeUnikat/K1…K8). Alle Kapitel sind Server-Komponenten mit vollständigem SSR-Inhalt
// (Texte, Zahlen, Tabellen, figcaption); die interaktiven Bühnen laden erst in Bildschirmnähe nach.
// Die geteilten Bausteine (Loesungen/*, Verkauf/*, Referenzen/*) werden nur importiert, nie verändert.

import Link from "next/link";
import { Activity, ArrowRight, Video } from "lucide-react";

import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import Faq from "@/components/ui/Faq";
import CtaBand from "@/components/ui/CtaBand";
import Querverweise from "@/components/Reusable/Querverweise";
import LoesungSchema from "@/components/Loesungen/LoesungSchema";
import { Bildnachweis } from "@/components/Loesungen/Bausteine";
import { nachweise } from "@/components/Loesungen/A/bildnachweise";
import FoerdercallHinweis from "@/components/Foerdercall/FoerdercallHinweis";
import BranchenReferenzen from "@/components/Referenzen/BranchenReferenzen";
import IfbHinweis from "@/components/Verkauf/IfbHinweis";
import UnsereZusagen from "@/components/Verkauf/UnsereZusagen";
import Ansprechpartner from "@/components/Verkauf/Ansprechpartner";
import { DC_AC_VORSCHLAG, TOR_GRENZEN } from "@/components/Technik/torTypen";
import { PARKREGLER_SATZ } from "@/data/marke";
import { zielgruppenVariante } from "@/data/zielgruppen";
import { BASE_URL } from "@/lib/site";

import Hero from "@/components/GewerbeUnikat/Hero";
import K1Lastgang from "@/components/GewerbeUnikat/K1Lastgang";
import K2Hallendach from "@/components/GewerbeUnikat/K2Hallendach";
import K3Anlagengroesse from "@/components/GewerbeUnikat/K3Anlagengroesse";
import K4KwhWert from "@/components/GewerbeUnikat/K4KwhWert";
import K5Leistungspreis from "@/components/GewerbeUnikat/K5Leistungspreis";
import K6Netzanschluss from "@/components/GewerbeUnikat/K6Netzanschluss";
import K7Wirtschaftlichkeit from "@/components/GewerbeUnikat/K7Wirtschaftlichkeit";
import K8Fahrplan from "@/components/GewerbeUnikat/K8Fahrplan";
import { beispielServer } from "@/components/GewerbeUnikat/_server";
import { STAND, prozent, zahl } from "@/components/GewerbeUnikat/_tokens";
import { HAUPT_CTA, HAUPT_HREF, HAUPT_ZUSATZ, TERMIN_CTA } from "@/components/GewerbeUnikat/_cta";

const PFAD = "/gewerbe";
const PAGE_URL = `${BASE_URL}${PFAD}`;
const TITEL = "Photovoltaik für Gewerbe & Industrie in Österreich | Ökovolt";
const BESCHREIBUNG =
  "PV für Hallen, Produktion, Logistik und Handel in Österreich: Auslegung nach Lastgang, Netzebene 7 bis 5, IFB 22 %, EAG-Zuschuss, Speicher und Wartung.";
const HERO_BILD = "/Images/Dienstleistungen/Photovoltaik/314505-BAD.jpg";

export const metadata = {
  title: TITEL,
  description: BESCHREIBUNG,
  alternates: { canonical: PAGE_URL },
  openGraph: { type: "website", locale: "de_AT", url: PAGE_URL, siteName: "Ökovolt Österreich", title: TITEL, description: BESCHREIBUNG, images: [{ url: `${BASE_URL}/og-image.jpg`, width: 1200, height: 630 }] },
};

// Die acht bisherigen Fragen bleiben wörtlich (FAQPage-Schema nur hier, über Faq).
const FAQ_BISHER = [
  {
    q: "Lohnt sich Photovoltaik für einen Gewerbebetrieb in Österreich?",
    a: "Für die meisten Betriebe mit Tagverbrauch ja. Jede selbst genutzte Kilowattstunde spart nicht nur den Energiepreis, sondern auch Netznutzungs- und Netzverlustentgelt sowie die Elektrizitätsabgabe, denn selbst erzeugter und verbrauchter Solarstrom ist davon befreit. In unserer Beispielrechnung für 300 kWp auf Netzebene 6 liegt die statische Amortisation bei rund sechs Jahren – entscheidend ist aber Ihr eigener Lastgang.",
  },
  {
    q: "Welche Unterlagen brauchen Sie für ein belastbares Angebot?",
    a: "Ideal ist der Lastgang der letzten zwölf Monate in Viertelstundenwerten. Betriebe mit Leistungsmessung erhalten ihn beim Netzbetreiber, meist über dessen Kundenportal. Dazu kommen Netzrechnungen (Netzebene, gemessene Leistung), Dachpläne, Statikunterlagen und Betriebszeiten. Ohne Lastgang reichen für eine erste Einschätzung Jahresverbrauch und Rechnungen.",
  },
  {
    q: "Wie wird die PV-Anlage steuerlich behandelt?",
    a: "Die Anlage ist ein abnutzbares Wirtschaftsgut und wird über die Nutzungsdauer abgeschrieben, linear oder degressiv. Für Anschaffungen bis 31. Dezember 2026 beträgt der ökologische Investitionsfreibetrag befristet 22 % (danach 15 %), bei einer Bemessungsgrundlage von höchstens 1 Mio. Euro je Wirtschaftsjahr und einer Behaltedauer von vier Jahren. Die konkrete Gestaltung klären Sie mit Ihrer Steuerberatung.",
  },
  {
    q: "Senkt eine PV-Anlage den Leistungspreis?",
    a: "Nur anteilig und nicht planbar. In Österreich wird bei gemessener Leistung der Mittelwert der zwölf höchsten Monats-Viertelstunden verrechnet. Liegen Ihre Spitzen im Sommer zur Mittagszeit, drückt die PV-Anlage diese Monatswerte – aber nur an sonnigen Tagen. Winterspitzen und Schichtbeginn am frühen Morgen senken nur ein Speicher und Lastmanagement zuverlässig; das rechnen wir getrennt aus.",
  },
  {
    q: "Brauchen wir für die PV-Anlage eine gewerberechtliche Genehmigung?",
    a: "Im Regelfall nicht. Nach der bundesweiten Festlegung des Wirtschaftsministeriums (Erlass vom 1. März 2021) sind PV-Anlagen als Teil einer gewerblichen Betriebsanlage meist nicht genehmigungspflichtig, solange keine Sonderfälle wie Fluchtwege, Ex-Bereiche oder Blendung vorliegen. Elektrizitätsrecht und Bauordnung des Bundeslands sowie der Netzzugang beim Netzbetreiber sind trotzdem zu beachten.",
  },
  {
    q: "Was passiert mit dem Überschuss?",
    a: "Überschüsse speisen Sie ins Netz ein und verkaufen sie – an die OeMAG zum Marktpreis, an einen Stromhändler oder über Direktvermarktung und PPA. Alternativ können Sie Strom über eine Energiegemeinschaft an Mitarbeitende, Nachbarbetriebe oder die Gemeinde weitergeben. Welche Variante sich rechnet, hängt von Menge, Einspeiseprofil und Vertragslaufzeit ab.",
  },
  {
    q: "Gibt es 2026 noch eine Förderung für gewerbliche PV-Anlagen?",
    a: "Ja. Der EAG-Investitionszuschuss für Anlagen über 100 kWp (Kategorie D) liegt 2026 bei höchstens 120 € je kWp, für 20 bis 100 kWp (Kategorie C) bei höchstens 130 € je kWp; die Anträge werden nach dem angegebenen Förderbedarf gereiht. Der letzte Fördercall 2026 läuft von 8. bis 22. Oktober. Der Antrag muss vor der Inbetriebnahme gestellt werden, erforderliche Genehmigungen müssen dann bereits vorliegen.",
  },
  {
    q: "Wir sind Mieter der Halle – geht das trotzdem?",
    a: "Ja, mit einer Dachnutzungsvereinbarung des Eigentümers, die zur Laufzeit der Anlage passt, samt Regelungen zu Dachsanierung, Rückbau und Versicherung. Alternativ investiert der Eigentümer und liefert Ihnen den Strom, etwa über eine gemeinschaftliche Erzeugungsanlage. Wir stimmen das Modell mit beiden Seiten ab.",
  },
];

const ORT_NAME = { linz: "Linz" };
const AUSRICHTUNG_NAME = { ostwest: "Ost-West", sued: "Süd", flach: "flach aufgeständert" };

/** Zwei neue Fragen mit Werten aus dem synthetischen Beispielbetrieb (beispielServer) – gekennzeichnet, Richtwerte. */
function neueFragen() {
  const { kennzahlen, kappung, ueberschussRuhe } = beispielServer();
  const pv = kennzahlen.pv;
  const emp = pv?.empfehlung;
  const kwp = emp?.kwp ?? 0;
  const ort = ORT_NAME[pv?.ortId] || "Linz";
  const ausrichtung = AUSRICHTUNG_NAME[pv?.ausrichtung] || "Ost-West";
  const mwh = zahl(kennzahlen.jahresverbrauch / 1000);

  // TOR: AC-Leistung aus kWp über das offengelegte DC/AC-Verhältnis, dazu der Speicher-Wechselrichter des
  // K5-Beispiels (Deckel 230 kW). Gerundete Einzelwerte, damit die Summe im Text aufgeht.
  const acKva = Math.round(kwp / DC_AC_VORSCHLAG);
  const speicher = kappung.find((k) => k.schwelle === 230 && k.moeglich);
  const speicherKw = speicher ? Math.round(speicher.leistungKw) : null;
  const summe = speicherKw ? acKva + speicherKw : null;
  const typ = (kw) => (kw >= TOR_GRENZEN.B ? "Typ B" : "Typ A");

  return [
    {
      q: "Wie groß sollte die PV-Anlage für unseren Betrieb sein?",
      a:
        `So groß, dass Ihr Betrieb den Großteil des Solarstroms selbst nutzt – die Größe folgt dem Lastgang, nicht der Dachfläche. ` +
        `Im synthetischen Beispielbetrieb dieser Seite (zwei Schichten Mo–Fr, ${mwh} MWh im Jahr, keine Messdaten) ergibt das Modell ` +
        `${zahl(kwp)} kWp ${ausrichtung} in ${ort}: rund ${prozent(emp?.evQuote ?? 0)} Eigenverbrauch und ${prozent(emp?.autarkie ?? 0)} Autarkie ` +
        `(PVGIS-Monatssummen, Richtwert, ${STAND.werte}). Schon bei dieser Größe fallen ${prozent(ueberschussRuhe)} des Überschusses an Wochenenden, ` +
        `Feiertagen und im Betriebsurlaub an; größere Anlagen erhöhen vor allem die Einspeisung. Mit Ihren Viertelstundenwerten rechnen wir die passende Größe für Ihren Betrieb.`,
    },
    {
      q: "Ab wann gilt für eine PV-Anlage TOR Typ B?",
      a:
        `Ab ${zahl(TOR_GRENZEN.B)} kW Maximalkapazität (AC) am Netzanschlusspunkt. Gezählt wird die Wechselrichterleistung aller Erzeugungsanlagen dort, ` +
        `einschließlich Speicher-Wechselrichter und Bestandsanlagen – nicht die Modulleistung in kWp. Typ B verlangt erweiterte Nachweise, etwa zu Blindleistung, ` +
        `Wirkleistungsreduktion auf Vorgabe und Fernwirkanbindung; meist übernimmt das ein Parkregler am Netzverknüpfungspunkt. ${PARKREGLER_SATZ} ` +
        (summe
          ? `Beispiel (Richtwert): ${zahl(kwp)} kWp ergeben bei einem DC/AC-Verhältnis von ${zahl(DC_AC_VORSCHLAG, 2)} rund ${zahl(acKva)} kVA (${typ(acKva)}); ` +
            `mit einem Speicher-Wechselrichter von ${zahl(speicherKw)} kW sind es ${zahl(summe)} kW und damit ${typ(summe)}. Die Netzebene legt der Netzbetreiber fest.`
          : "Die Netzebene legt der Netzbetreiber fest."),
    },
  ];
}

// CLS: Die Ersatzschrift („Manrope Fallback“) bricht die H1 des Seitenkopfs in zwei Breitenbändern eine Zeile
// früher um als Manrope 800 (gemessen 13.10.2026 auf :3002, Chromium: 358–402 px 3 → 4 Zeilen, 448–504 px
// 2 → 3 Zeilen; sonst gleich). Kommt die Webschrift erst nach dem ersten Bild, sprangen Lead und CTAs
// (CLS 0,14 mobil). PageHero ist geteilt und bleibt unverändert – die Reserve gilt nur auf dieser Seite und
// steht VOR dem Seitenkopf im HTML, damit sie schon beim ersten Bild greift. ov-h1: line-height 1,06.
// Zweitens: Der Inhalt des Seitenkopfs ist hier in jeder Breite höher als dessen Mindesthöhe (gemessen 320–1920 px),
// die Ausrichtung nach unten (justify-end + mb-auto der Breadcrumbs) wirkt im fertigen Bild also nicht. Sie wirkte
// aber, wenn der Browser bei langsamem Netz einen halb geladenen Seitenkopf malte: Der Block saß unten und sprang
// nach oben, sobald H1 und Lead eintrafen (CLS 0,18 in etwa jedem zehnten Lauf, Fast 3G + 4× CPU). Oben ausgerichtet
// wächst er nur nach unten – im fertigen Bild ohne sichtbaren Unterschied.
const SEITENKOPF_CSS = `@media (width < 404px){[data-seite="gewerbe-unikat"] [data-blk="seitenkopf"] h1{min-height:calc(4 * 1.06em)}}@media (404px <= width < 506px){[data-seite="gewerbe-unikat"] [data-blk="seitenkopf"] h1{min-height:calc(3 * 1.06em)}}[data-seite="gewerbe-unikat"] [data-blk="seitenkopf"]>.ov-container{justify-content:flex-start}[data-seite="gewerbe-unikat"] [data-blk="seitenkopf"]>.ov-container>.mb-auto{margin-bottom:0}`;

// Links vor dem Erstgespräch (gefüllt, keine Rahmen) – ersetzen die frühere RechnerLeiste neben der FAQ
const VORAB = [
  { label: "Lastgang selbst auswerten", href: "/lastgang-analyse" },
  { label: "Förder-Check", href: "/foerdercheck" },
  { label: "Standort-Check: Schnee & Wind", href: "/standort-check" },
];

export default async function GewerbePage({ searchParams }) {
  const v = zielgruppenVariante("gewerbe", await searchParams);
  const faq = [...FAQ_BISHER, ...neueFragen()];

  return (
    <div data-variante={v.id} data-seite="gewerbe-unikat">
      <style dangerouslySetInnerHTML={{ __html: SEITENKOPF_CSS }} />
      <LoesungSchema
        pfad={PFAD}
        name="Photovoltaik für Gewerbe und Industrie in Österreich"
        titel={TITEL}
        beschreibung={BESCHREIBUNG}
        zielgruppe="Gewerbe, Industrie, Handel, Logistik"
        bild={HERO_BILD}
        leistungen={["Lastganganalyse und Anlagenauslegung", "PV-Anlagen auf Hallen- und Flachdächern", "Netzanschluss Netzebene 7 bis 5 inkl. Parkregler", "Gewerbespeicher und Peak Shaving", "Ladeinfrastruktur", "Wartung und Reststromvermarktung"]}
      />

      {/* Blendet sich nach Call-Ende (22.10.2026) selbst aus */}
      <FoerdercallHinweis />

      {/* Standard-Seitenkopf wie auf allen Lösungsseiten (H1 = einzige H1 der Seite). Entscheidung des Inhabers
          (12.10.2026): Der Seitenkopf weicht nicht von den anderen Lösungsseiten ab – alles Eigene folgt darunter. */}
      <div className="relative">
        <PageHero
          variant="immersive"
          breadcrumbs={[{ name: "Gewerbe & Industrie" }]}
          eyebrow={v.eyebrow}
          title={<>Photovoltaik für Gewerbe und Industrie <span className="ov-text-gradient-light">in Österreich</span></>}
          lead={<><span className="block font-display text-[1.15em] font-bold leading-snug text-white">{v.titel} {v.akzent}</span><span className="mt-3 block">{v.lead}</span></>}
          image={{ src: HERO_BILD, alt: "Luftaufnahme eines Gewerbegebäudes mit Photovoltaikanlagen auf den Flachdächern" }}
          actions={[
            // Haupt-CTA seitenweit gleich (Jury 13.10.2026); Kampagnen-Varianten behalten ihr Versprechen (Message-Match)
            { label: v.id === "standard" ? HAUPT_CTA : v.cta, href: HAUPT_HREF },
            { label: "Eigenen Lastgang darüberlegen", href: "#lastgang", icon: Activity },
          ]}
          points={["Auslegung nach Viertelstundenwerten", "Netzebene 7 bis 5 inkl. Parkregler", "Förderung, IFB & Netzzugang geklärt", "Wartung, Fernwartung & Reststromvermarktung"]}
        />
      </div>

      {/* Kapitel 00: Wochen-Puls, Rollen-Weiche, Kurzantwort (#kurzantwort), DaumenLeiste, Kapitel-Schiene */}
      <Hero v={v} />

      {/* Akt I – Verstehen */}
      <K1Lastgang />
      <K2Hallendach />

      {/* Akt II – Gestalten */}
      <K3Anlagengroesse />
      <K4KwhWert />
      <K5Leistungspreis />
      <K6Netzanschluss />

      {/* Blendet sich nach 31.12.2026 selbst aus */}
      <IfbHinweis />

      {/* Akt III – Entscheiden */}
      <K7Wirtschaftlichkeit />
      <K8Fahrplan />

      {/* Beweise: echte Projekte der Zielgruppe – ohne freigegebene Treffer rendert die Komponente nichts */}
      <BranchenReferenzen zielgruppe="industrie" />

      <Section tone="white" space="md" id="faq" data-kapitel="faq">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <SectionHeading eyebrow="Häufige Fragen" title="Gut zu wissen für Geschäftsführung, Technik und Einkauf" />
            <p className="mt-8 text-[12.5px] font-semibold uppercase tracking-[0.16em] text-ov-700 md:mt-10">Vor dem Erstgespräch</p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {VORAB.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="group inline-flex min-h-11 items-center gap-2 rounded-full bg-ink-100 px-4 text-[14.5px] font-semibold text-ink-900 transition-colors duration-200 hover:bg-ink-200"
                  >
                    {l.label}
                    <ArrowRight aria-hidden="true" className="h-4 w-4 text-ov-700 transition-transform duration-300 group-hover:translate-x-0.5" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <Faq items={faq} />
        </div>
      </Section>

      <Querverweise pfad={PFAD} ueberschrift="Vertiefen: Wirtschaftlichkeit, Technik & Recht" />

      {/* Zusagen (nur freigegebene) und Ansprechpartner (nur mit Einwilligung, sonst Teamfunktion) */}
      <UnsereZusagen rahmen />
      <Ansprechpartner zielgruppe="gewerbe" rahmen />

      {/* Gleicher Haupt-CTA wie Seitenkopf, Daumenleiste und Kapitel; der Termin ist der klar benannte Zweitweg */}
      <CtaBand
        eyebrow={`Ersteinschätzung – ${HAUPT_ZUSATZ}`}
        title="Schicken Sie uns Ihren Lastgang – wir zeigen, was Ihr Dach leisten kann."
        text="Erste Einschätzung zu Anlagengröße, Netzebene, Eigenverbrauch, Förderung und Wirtschaftlichkeit – Rechenweg inklusive. Ohne Lastgang reichen Jahresverbrauch und Netzrechnung; kein Angebot ohne Ihre Zahlen."
        primary={{ label: HAUPT_CTA, href: HAUPT_HREF }}
        secondary={{ label: "Erstgespräch per Video vereinbaren", href: TERMIN_CTA.href, icon: Video }}
      />

      {/* Nur tatsächlich genutzte Fremdbilder: Flachdach Dornbirn (Projektsteckbrief in K8) */}
      <Bildnachweis items={nachweise("flachdachDornbirn")} />
    </div>
  );
}
