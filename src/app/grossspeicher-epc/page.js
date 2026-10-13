// /grossspeicher-epc – Großspeicher (BESS) als Generalunternehmer, auch an PV-Standorten (Welle C, Paket C03)
//
// Inhalte: Netzanschluss als Engpass (Anfragen vs. Bedarf, beide mit Quelle und Stand), Co-Location,
// TOR-Summenregel, Netzentgelt-Status für Speicher (Entwurf, Stand), Speicher-Index (B10), Ratgeber
// grossspeicher-bess und der Hybridpark-Konfigurator (Export nur nach Lead-Gate, Stufe 1).
// Regeln: keine Renditeversprechen; Referenzen nur, wenn ein BESS-Projekt belegt ist (derzeit keins → keine
// Referenzsektion); jede Zahl mit Quelle und Stand.
//
// Quellenhinweis: Die im Plan genannte Meldung „energynewsmagazine 23.09.2026“ war am 12.10.2026 nicht auffindbar.
// Verwendet werden stattdessen die geprüften Primärmeldungen: APA/energynewsmagazine vom 16.07.2026 (E-Control)
// und i-magazin vom 24.09.2026 (Angabe Huawei, Austrian Energy Day 22.09.2026).

import Link from "next/link";
import { ArrowUpRight, BatteryCharging, Cable, ClipboardCheck, Cpu, FileText, Flame, LineChart, MapPin, PlugZap, Sun, Wrench } from "lucide-react";

import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import Faq from "@/components/ui/Faq";
import CtaBand from "@/components/ui/CtaBand";
import LoesungSchema from "@/components/Loesungen/LoesungSchema";
import { Bildnachweis, Hinweis, Prosa, StandPille, Tabelle } from "@/components/Loesungen/Bausteine";
import { nachweise } from "@/components/Loesungen/A/bildnachweise";
import HybridKonfigurator from "@/components/Technik/HybridKonfigurator";
import Ansprechpartner from "@/components/Verkauf/Ansprechpartner";
import { PARKREGLER_SATZ } from "@/data/marke";
import { BASE_URL } from "@/lib/site";

const PFAD = "/grossspeicher-epc";
const PAGE_URL = `${BASE_URL}${PFAD}`;
const TITEL = "Großspeicher (BESS) als Generalunternehmer | Ökovolt";
const BESCHREIBUNG =
  "Batteriegroßspeicher schlüsselfertig – auch am PV-Standort: Netzanschluss, TOR-Summenregel, Netzentgelt-Status 2027, Hybridpark-Konfigurator. Ohne Renditeversprechen.";
const HERO_BILD = "/Images/AT/loesungen/gewerbespeicher-batteriecontainer.jpg";
const STAND = "12.10.2026";

export const metadata = {
  title: TITEL,
  description: BESCHREIBUNG,
  alternates: { canonical: PAGE_URL },
  openGraph: { type: "website", locale: "de_AT", url: PAGE_URL, siteName: "Ökovolt Österreich", title: TITEL, description: BESCHREIBUNG, images: [{ url: `${BASE_URL}/og-image.jpg`, width: 1200, height: 630 }] },
};

// Primärquellen (Stand jeweils angegeben)
const Q = {
  econtrol: {
    titel: "APA-Meldung „Enormer Andrang bei Batteriespeichern in Österreich“ (energynewsmagazine)",
    href: "https://www.energynewsmagazine.at/2026/07/16/enormer-andrang-bei-batteriespeichern-in-oesterreich-2/",
    stand: "16.07.2026",
  },
  huawei: {
    titel: "i-magazin: Batteriespeicher-Ausbau in Österreich – Anschlussanfragen übersteigen Netzkapazität",
    href: "https://i-magazin.com/batteriespeicher-ausbau-in-oesterreich-anschlussanfragen-uebersteigen-netzkapazitaet/",
    stand: "24.09.2026",
  },
  elwg: { titel: "ElWG, BGBl. I Nr. 91/2025 (RIS)", href: "https://www.ris.bka.gv.at/eli/bgbl/I/2025/91", stand: "10/2026" },
  sneg: {
    titel: "E-Control – Begutachtungsentwurf SNE-G-V samt Erläuterungen",
    href: "https://www.e-control.at/documents/1785851/0/V+SNE+01_26+SNE-G-V+Begutachtungsentwurf+samt+Erl%C3%A4uterungen.pdf",
    stand: "Entwurf vom 29.06.2026",
  },
  pvb: {
    titel: "Solarserver: Österreich – Diskussion um Netzentgelte für Batteriespeicher",
    href: "https://www.solarserver.de/2026/09/24/oesterreich-diskussion-um-netzentgelte-fuer-batteriespeicher",
    stand: "24.09.2026",
  },
  tor: { titel: "E-Control – TOR Stromerzeugungsanlagen Typ A (V1.4) und Typ B (V1.3)", href: "https://www.e-control.at/marktteilnehmer/strom/marktregeln/tor", stand: "abgerufen 10/2026" },
};

function QuellLink({ q, children }) {
  return (
    <a href={q.href} target="_blank" rel="noopener noreferrer" className="underline decoration-ink-300 underline-offset-2 hover:text-ink-900">
      {children || q.titel}
    </a>
  );
}

const LEISTUNGEN = [
  { icon: MapPin, titel: "Standort & Netzanfrage", text: "Netzebene, freie Kapazität am Netzknoten, Anfrage beim Netzbetreiber – an bestehenden PV-Anschlüssen zuerst." },
  { icon: FileText, titel: "Genehmigung", text: "Bau- und elektrizitätsrechtliche Verfahren nach Landesrecht, Lärm, Zufahrt, Abstimmung mit der Gemeinde." },
  { icon: Flame, titel: "Brandschutz", text: "Brandschutzkonzept mit Behörde und Feuerwehr, Container mit Detektion und Löschtechnik." },
  { icon: BatteryCharging, titel: "Speicher, PCS & Trafo", text: "Container, Umrichter, Mittelspannungstrafo und Schaltanlage – herstellerneutral ausgeschrieben." },
  { icon: Cpu, titel: "EMS, Parkregler & SCADA", text: PARKREGLER_SATZ },
  { icon: Wrench, titel: "Inbetriebnahme & Betrieb", text: "Netzbetreiber-Tests, Abnahme, Monitoring, Wartung und Störungsdienst." },
];

const NETZENTGELT = [
  { phase: "bis 31.12.2026", regel: "Ein eigenständiger Speicher zahlt für den Netzbezug grundsätzlich wie ein Entnehmer (Netznutzungs- und Netzverlustentgelt).", status: "geltendes Recht (SNE-V 2018)" },
  { phase: "ab 01.01.2027", regel: "Systemdienliche Speicher können für den Bezug bis zu 20 Jahre vom Netznutzungs- und Netzverlustentgelt befreit werden (§ 127 Abs. 3 ElWG).", status: "Gesetz beschlossen" },
  { phase: "Kriterien", regel: "u. a. ab 1 MW, Anschluss ohne zusätzlichen Netzausbau, ausgelasteter Netzknoten, Flexibilitätsvertrag mit der APG, Betrieb ausschließlich zur Wiedereinspeisung, insgesamt bis 5 GW.", status: "Entwurf SNE-G-V – zu prüfen" },
  { phase: "Co-Location", regel: "Nach Lesart des Verbands PV&B Austria wären an PV gekoppelte Hybridspeicher von der Befreiung ausgeschlossen; der Verband fordert eine Prüfung nach Netzdienlichkeit.", status: "offen – zu prüfen" },
];

const FAQ = [
  {
    q: "Was heißt Großspeicher als Generalunternehmer (EPC)?",
    a: "Wir übernehmen Planung, Beschaffung und Bau des Speichers aus einer Hand – vom Netzantrag über Genehmigung und Brandschutz bis zur Inbetriebnahme mit Parkregler und SCADA. Sie haben einen Vertragspartner für Termine, Schnittstellen und Abnahme. Vermarktung und Handel übernimmt ein Vermarkter Ihrer Wahl; wir binden ihn technisch an.",
  },
  {
    q: "Warum einen Speicher an einem bestehenden PV-Standort?",
    a: "Weil der Netzanschluss knapp ist. Ein Speicher am selben Anschluss nutzt die vorhandene Kapazität besser aus, nimmt PV-Spitzen über der netzwirksamen Leistung auf und gibt sie später ab. Wie viel Abregelung er vermeidet, zeigt der Hybridpark-Konfigurator auf dieser Seite als Richtwert.",
  },
  {
    q: "Wie wird der TOR-Typ bei PV und Speicher bestimmt?",
    a: "Maßgeblich ist in der Regel die Maximalkapazität der Gesamtanordnung aus Erzeugung und Speicher am Netzanschlusspunkt – also die Summe aus PV-Wechselrichterleistung und Speicherleistung. Ob eine dauerhafte Begrenzung per Parkregler die Einstufung senkt, entscheidet der Netzbetreiber; das klären wir vor der Planung.",
  },
  {
    q: "Zahlt ein Großspeicher ab 2027 keine Netzentgelte mehr?",
    a: "Nicht automatisch. Das ElWG erlaubt ab 2027 eine Befreiung für systemdienliche Speicher. Die Kriterien stehen im Entwurf der Systemnutzungsentgelte-Grundsatzverordnung der E-Control (Entwurf vom 29.06.2026); ob und wie sie für Speicher an PV-Standorten gelten, ist noch offen. Wir rechnen Projekte deshalb mit und ohne Befreiung.",
  },
  {
    q: "Welchen Erlös bringt ein Großspeicher?",
    a: "Das hängt von Vermarktung, Netzentgelten, Alterung und Marktentwicklung ab – eine Erlöszusage geben wir nicht. Einen nachvollziehbaren Maßstab liefert unser Speicher-Spread-Index: die theoretische Obergrenze eines Day-Ahead-Zyklus pro Tag, monatlich aus öffentlichen Preisdaten berechnet. Realistische Erlöse liegen darunter.",
  },
  {
    q: "Wie lange dauert ein Großspeicherprojekt?",
    a: "Den Zeitplan bestimmen meist Netzanschluss und Genehmigung, nicht der Bau. Wir nennen Termine erst, wenn die Netzbetreiber-Auskunft vorliegt – vorher wäre jede Zahl geraten.",
  },
];

export default function GrossspeicherEpcPage() {
  return (
    <div>
      <LoesungSchema
        pfad={PFAD}
        name="Großspeicher (BESS) als Generalunternehmer"
        titel={TITEL}
        beschreibung={BESCHREIBUNG}
        zielgruppe="Industrie, Energieversorger, Solarpark-Betreiber, Projektentwickler"
        bild={HERO_BILD}
        leistungen={["Standort- und Netzanschlussprüfung", "Genehmigung und Brandschutzkonzept", "Batteriegroßspeicher mit Umrichter und Trafo", "Co-Location an PV-Standorten", "EMS, Parkregler und SCADA", "Inbetriebnahme, Wartung und Monitoring"]}
      />

      <PageHero
        variant="immersive"
        className="pb-4 md:pb-6"
        breadcrumbs={[{ name: "Gewerbespeicher", href: "/gewerbespeicher" }, { name: "Großspeicher (BESS)" }]}
        eyebrow="Großspeicher · EPC · Co-Location"
        title={<>Großspeicher (BESS) als Generalunternehmer <span className="ov-text-gradient-light">– auch an PV-Standorten</span></>}
        lead="Batteriespeicher ab etwa 1 MW schlüsselfertig: Netzanschluss, Genehmigung, Brandschutz, Technik und Regelung aus einer Hand. Am bestehenden Solarpark nutzt der Speicher den knappen Netzanschluss besser aus."
        image={{ src: HERO_BILD, alt: "Batteriespeicher-Container an einem Kraftwerksstandort in Niederösterreich" }}
        actions={[
          { label: "Hybridpark konfigurieren", href: "#hybrid-konfigurator", icon: Sun },
          { label: "Projekt anfragen", href: "/angebot?objekt=gewerbe", icon: PlugZap },
        ]}
        points={["Netzanschluss zuerst geklärt", "TOR-Summenregel PV + Speicher", "Parkregler & SCADA", "Keine Renditeversprechen"]}
      />

      {/* Netzanschluss als Engpass */}
      <Section tone="white" space="lg" id="netzanschluss">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <SectionHeading eyebrow="Der Engpass" title="Nicht der Speicher ist knapp, sondern der Netzanschluss" />
          <Prosa className="[&>p:first-child]:mt-0!">
            <p>
              <strong>Die Anfragen übersteigen den Bedarf um ein Vielfaches.</strong> Laut E-Control-Vorstand Alfons Haber gibt es bis zu 25 GW an
              Netzanschlussanfragen für Batteriespeicher, bei einem erwarteten Bedarf von 3 bis 5 GW in den nächsten zehn Jahren; viele Anfragen sind
              Mehrfachanfragen bei mehreren Netzbetreibern (<QuellLink q={Q.econtrol} />, Stand {Q.econtrol.stand}). Laut Huawei liegen bei den
              heimischen Verteilnetzbetreibern Anfragen über mehr als 24 GW vor (<QuellLink q={Q.huawei} />, Stand {Q.huawei.stand}).
            </p>
            <p>
              Für Projekte heißt das: Wer bereits einen Netzanschluss hat – etwa einen Solarpark oder einen Industriestandort mit eigener Trafostation – hat
              einen echten Vorsprung. Neue Standorte prüfen wir zuerst auf freie Kapazität, bevor Geld in Planung fließt.
            </p>
          </Prosa>
        </div>
        <dl className="mt-10 grid gap-4 sm:grid-cols-2">
          <div className="rounded-[1.5rem] bg-sand-50 p-6">
            <dt className="text-[13px] font-semibold uppercase tracking-[0.12em] text-ink-500">Netzanschlussanfragen Speicher</dt>
            <dd className="ov-num mt-1 font-display text-[34px] font-extrabold leading-tight text-ink-900">bis 25 GW</dd>
            <dd className="mt-1 text-[13px] leading-relaxed text-ink-500">E-Control (A. Haber), APA {Q.econtrol.stand} · inkl. Mehrfachanfragen · Orientierung</dd>
          </div>
          <div className="rounded-[1.5rem] bg-navy-950 p-6 text-white">
            <dt className="text-[13px] font-semibold uppercase tracking-[0.12em] text-white/70">Erwarteter Bedarf in 10 Jahren</dt>
            <dd className="ov-num mt-1 font-display text-[34px] font-extrabold leading-tight">3–5 GW</dd>
            <dd className="mt-1 text-[13px] leading-relaxed text-white/70">Einschätzung E-Control, APA {Q.econtrol.stand} · Orientierung, keine Prognose von Ökovolt</dd>
          </div>
        </dl>
      </Section>

      {/* Co-Location und TOR-Summenregel */}
      <Section tone="sand" space="lg" id="co-location">
        <div className="mb-10 grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:gap-16">
          <SectionHeading eyebrow="Co-Location" title="Speicher am PV-Standort: ein Anschluss, zwei Anlagen, eine Regelung" />
          <p className="ov-lead text-ink-600">
            Mehr PV-Leistung als Anschlussleistung, Spitzen in den Speicher statt in die Abregelung – das funktioniert nur, wenn Parkregler und EMS die
            netzwirksame Leistung jederzeit einhalten.
          </p>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-[1.5rem] bg-white p-6 shadow-sm md:p-7">
            <Cable aria-hidden="true" className="h-6 w-6 text-ov-600" strokeWidth={1.8} />
            <h3 className="mt-4 font-display text-[19px] font-bold text-ink-900">TOR-Summenregel</h3>
            <p className="mt-2 text-[15px] leading-relaxed text-ink-700">
              Für die Typeinteilung zählt in der Regel die Maximalkapazität der Gesamtanordnung aus Erzeugung und Speicher am Netzanschlusspunkt. Ein Solarpark
              mit 30 MW und ein Speicher mit 10 MW ergeben 40 MW – und damit Typ C statt Typ B, mit zusätzlichen Anforderungen. Ob eine dauerhafte
              Begrenzung per Parkregler die Einstufung senkt, entscheidet der Netzbetreiber: zu prüfen, bevor geplant wird.
            </p>
            <p className="mt-3 text-[13px] leading-relaxed text-ink-500">
              Quelle: <QuellLink q={Q.tor} />, Typeinteilung nach RfG-Schwellenwert-V · {Q.tor.stand}. Vereinfachte Darstellung.
            </p>
          </div>
          <div className="rounded-[1.5rem] bg-white p-6 shadow-sm md:p-7">
            <LineChart aria-hidden="true" className="h-6 w-6 text-ov-600" strokeWidth={1.8} />
            <h3 className="mt-4 font-display text-[19px] font-bold text-ink-900">Erlöse ehrlich einordnen</h3>
            <p className="mt-2 text-[15px] leading-relaxed text-ink-700">
              Wir geben keine Renditeversprechen. Als Maßstab dient unser monatlicher{" "}
              <Link href="/energie-live/speicher-index" className="font-semibold text-ov-700 underline decoration-ov-300 underline-offset-4">
                Speicher-Spread-Index
              </Link>{" "}
              – die theoretische Obergrenze eines Day-Ahead-Zyklus pro Tag aus öffentlichen Preisdaten, vor Netzentgelten, Vermarktungskosten und Alterung.
              Grundlagen zu Arbitrage, Regelreserve und Risiken im Ratgeber{" "}
              <Link href="/ratgeber/grossspeicher-bess" className="font-semibold text-ov-700 underline decoration-ov-300 underline-offset-4">
                Batteriegroßspeicher in Österreich
              </Link>
              .
            </p>
          </div>
        </div>
      </Section>

      {/* Hybridpark-Konfigurator */}
      <Section tone="white" space="lg" id="konfigurator">
        <div className="mb-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:gap-16">
          <SectionHeading eyebrow="Selbst rechnen" title="Hybridpark-Konfigurator: Wie viel Abregelung nimmt der Speicher auf?" />
          <div className="flex flex-col items-start gap-3 lg:items-end">
            <p className="ov-lead text-ink-600 lg:text-right">PV-Leistung, Speicher und Netzanschluss eingeben – Ergebnis sofort am Bildschirm, ohne Anmeldung.</p>
            <StandPille>Richtwert/Orientierung · Stundensimulation · Stand {STAND}</StandPille>
          </div>
        </div>
        <HybridKonfigurator />
      </Section>

      {/* Netzentgelt-Status Speicher */}
      <Section tone="sand" space="lg" id="netzentgelte">
        <div className="mb-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:gap-16">
          <SectionHeading eyebrow="Recht & Netzentgelte" title="Netzentgelte für Speicher: Was gilt, was geplant ist" />
          <StandPille>Stand {STAND} · Verordnung noch im Entwurf</StandPille>
        </div>
        <Tabelle
          dicht
          caption="Netzentgelt-Status für Batteriespeicher in Österreich"
          spalten={[
            { key: "phase", label: "Zeitraum" },
            { key: "regel", label: "Regel" },
            { key: "status", label: "Status" },
          ]}
          zeilen={NETZENTGELT}
          fuss={
            <>
              Quellen: <QuellLink q={Q.elwg} />; <QuellLink q={Q.sneg} /> ({Q.sneg.stand}, Begutachtung bis 24.07.2026, Erlass am {STAND} nicht bekannt – zu
              prüfen); <QuellLink q={Q.pvb} /> (Stand {Q.pvb.stand}). Keine Rechtsberatung.
            </>
          }
        />
        <Hinweis titel="Unsere Konsequenz für Ihr Projekt" className="mt-8">
          Wir rechnen jedes Speicherprojekt in zwei Varianten – mit und ohne Netzentgeltbefreiung – und legen offen, welche Annahme welchen Unterschied macht.
        </Hinweis>
      </Section>

      {/* Leistungsumfang EPC */}
      <Section tone="white" space="lg" id="leistungen">
        <SectionHeading eyebrow="Generalunternehmer" title="Was wir als EPC übernehmen" className="mb-10" />
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {LEISTUNGEN.map((l) => (
            <li key={l.titel} className="rounded-[1.5rem] bg-sand-50 p-6">
              <l.icon aria-hidden="true" className="h-6 w-6 text-ov-600" strokeWidth={1.8} />
              <h3 className="mt-4 font-display text-[18px] font-bold leading-snug text-ink-900">{l.titel}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-ink-600">{l.text}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section tone="sand" space="md">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-20 [&>*]:min-w-0">
          <div>
            <SectionHeading eyebrow="Häufige Fragen" title="Großspeicher und Co-Location in Österreich" />
            <ul className="mt-6 grid">
              {[
                { href: "/ratgeber/grossspeicher-bess", label: "Ratgeber: Batteriegroßspeicher (BESS)" },
                { href: "/energie-live/speicher-index", label: "Speicher-Spread-Index" },
                { href: "/gewerbespeicher", label: "Gewerbespeicher für Betriebe" },
                { href: "/industrie", label: "Photovoltaik für Industrie ab 500 kWp" },
                { href: "/technik/parkregler", label: "Parkregler" },
              ].map((v) => (
                <li key={v.href}>
                  <Link href={v.href} className="inline-flex min-h-11 items-center gap-1.5 py-2 text-[15px] font-semibold text-ov-700 hover:text-ov-800">
                    <ClipboardCheck aria-hidden="true" className="h-4 w-4" />
                    {v.label}
                    <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <Faq items={FAQ} />
        </div>
      </Section>

      {/* Ansprechpartner bringt keinen eigenen Container mit */}
      <Section tone="white" space="sm">
        <Ansprechpartner zielgruppe="gewerbe" />
      </Section>

      <CtaBand
        eyebrow="Standort prüfen"
        title="Haben Sie einen Netzanschluss – oder suchen Sie einen?"
        text="Wir prüfen Netzebene, freie Kapazität, TOR-Einstufung und Genehmigungsweg – und rechnen Ihr Speicherprojekt mit und ohne Netzentgeltbefreiung."
        primary={{ label: "Video-Termin vereinbaren", href: "/termin?art=video&thema=gewerbe" }}
        secondary={{ label: "Projekt anfragen", href: "/angebot?objekt=gewerbe", icon: PlugZap }}
      />

      <Bildnachweis items={nachweise("batteriecontainer")} />
    </div>
  );
}
