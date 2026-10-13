// /industrie – Photovoltaik für Industriebetriebe ab 500 kWp (Welle C, Paket C03)
//
// Abgrenzung zu /gewerbe: Diese Seite behandelt Anlagen ab etwa 500 kWp mit Mittelspannungsanschluss
// (Netzebene 5/6, kundeneigene Trafostation), Parkregler/SCADA und Buying Center (Geschäftsführung,
// Technik, Einkauf). Hallen, Handel und Betriebe bis etwa 500 kWp → /gewerbe (Querlink im Text).
// Reihenfolge der Argumente nach Inhaber-Vorgabe: Kosten- und Versorgungssicherheit vor ESG, VSME zweites Argument.
// Regeln: keine Renditeversprechen, keine unbelegten Zertifikate/Werbeaussagen (Parkregler-Wortlaut aus
// src/data/marke.js), Kundennamen nur mit Freigabe (BranchenReferenzen prüft das selbst), jede Zahl mit Quelle und Stand.

import Link from "next/link";
import { ArrowUpRight, BadgeEuro, BatteryCharging, Building2, Calculator, ClipboardList, Cpu, FileCheck2, Gauge, ShieldCheck, Sun, Zap } from "lucide-react";

import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import Faq from "@/components/ui/Faq";
import CtaBand from "@/components/ui/CtaBand";
import LoesungSchema from "@/components/Loesungen/LoesungSchema";
import { Hinweis, Prosa, StandPille, Tabelle } from "@/components/Loesungen/Bausteine";
import BranchenReferenzen from "@/components/Referenzen/BranchenReferenzen";
import EinwandKarten from "@/components/Verkauf/EinwandKarten";
import IfbHinweis from "@/components/Verkauf/IfbHinweis";
import PreisAnker from "@/components/Verkauf/PreisAnker";
import Ansprechpartner from "@/components/Verkauf/Ansprechpartner";
import { TYPEN } from "@/components/Technik/torTypen";
import { PARKREGLER_SATZ } from "@/data/marke";
import { freigegebenePreisbaender } from "@/data/preisbaender";
import { BASE_URL, FIRMA } from "@/lib/site";

const PFAD = "/industrie";
const PAGE_URL = `${BASE_URL}${PFAD}`;
const TITEL = "PV für Industrie ab 500 kWp in Österreich | Ökovolt";
const BESCHREIBUNG =
  "Industrie-PV ab 500 kWp: Mittelspannung, eigene Trafostation, TOR Typ B, Parkregler und SCADA, Kapitalwert für die Geschäftsführung und Nachweise für den Einkauf.";
const HERO_BILD = "/Images/AT/loesungen-b/speicher-industriedach-pv.jpg";
const STAND = "10/2026";

// Ersatzziel, bis /rechner/spitzenkappung (Paket B03) existiert – dann hier umstellen (Übergabe in C03.md).
const SPITZENKAPPUNG_HREF = "/ratgeber/elwg-elektrizitaetswirtschaftsgesetz#pv";

export const metadata = {
  title: TITEL,
  description: BESCHREIBUNG,
  alternates: { canonical: PAGE_URL },
  openGraph: { type: "website", locale: "de_AT", url: PAGE_URL, siteName: "Ökovolt Österreich", title: TITEL, description: BESCHREIBUNG, images: [{ url: `${BASE_URL}/og-image.jpg`, width: 1200, height: 630 }] },
};

// Primärquellen der Seite (Stand jeweils angegeben)
const Q = {
  torAB: { titel: "E-Control – TOR Stromerzeugungsanlagen Typ A (V1.4) und Typ B (V1.3)", href: "https://www.e-control.at/marktteilnehmer/strom/marktregeln/tor", stand: "abgerufen 10/2026" },
  elwg: { titel: "ElWG, BGBl. I Nr. 91/2025 (RIS)", href: "https://www.ris.bka.gv.at/eli/bgbl/I/2025/91", stand: "10/2026" },
  spitzenkappung: { titel: "BMWET – Spitzenkappung (ElWG-Infos)", href: "https://www.bmwet.gv.at/Services/Infos-FAQ/elwg-infos/spitzenkappung.html", stand: "10/2026" },
  vsme: { titel: "Empfehlung (EU) 2025/1710 der Kommission (VSME) – EUR-Lex", href: "https://eur-lex.europa.eu/eli/reco/2025/1710/oj", stand: "07/2025" },
  gisa: { titel: "GISA – Gewerbeinformationssystem Austria, öffentliche Abfrage", href: "https://www.gisa.gv.at/abfrage", stand: "laufend" },
  firmenbuch: { titel: "Justiz – Firmenbuch-Abfrage", href: "https://www.justiz.gv.at/service/firmenbuch.5a8.de.html", stand: "laufend" },
};

function QuellLink({ q }) {
  return (
    <a href={q.href} target="_blank" rel="noopener noreferrer" className="underline decoration-ink-300 underline-offset-2 hover:text-ink-900">
      {q.titel}
    </a>
  );
}

const NETZEBENEN = [
  { ne: "Netzebene 6", ort: "Niederspannungsseite einer Trafostation des Netzbetreibers", groesse: "etwa bis 1 MWp", hinweis: "Trafo gehört dem Netzbetreiber; Kapazität der Station begrenzt" },
  { ne: "Netzebene 5", ort: "Mittelspannung (meist 10–30 kV), kundeneigene Trafostation mit MS-Schaltanlage", groesse: "etwa 0,5 bis 10 MWp", hinweis: "eigener Trafo, Schutz und Messung auf MS-Seite; Parkregler am Netzverknüpfungspunkt" },
  { ne: "Netzebene 4/3", ort: "Umspannwerk (110 kV)", groesse: "ab etwa 10 MWp", hinweis: "Einzelfall – Typ D ab 110 kV Netzanschluss" },
];

const FAQ = [
  {
    q: "Ab wann ist eine PV-Anlage eine Industrieanlage – und warum ab 500 kWp?",
    a: "Eine gesetzliche Grenze gibt es nicht. Ab etwa 500 kWp ändert sich aber die Projektlogik: Die Anlage liegt nach TOR klar im Typ B (ab 250 kW Maximalkapazität), wird meist auf Mittelspannung angeschlossen und braucht einen Parkregler am Netzverknüpfungspunkt. Dazu kommen Investitionsantrag, Ausschreibung und Einkaufsnachweise. Für kleinere Hallen- und Gewerbedächer ist unsere Seite Photovoltaik für Gewerbe der passende Einstieg.",
  },
  {
    q: "Brauchen wir eine eigene Trafostation?",
    a: "Nicht immer. Bis etwa 1 MWp kann ein Anschluss an der Niederspannungsseite einer Trafostation des Netzbetreibers (Netzebene 6) reichen, wenn deren Kapazität frei ist. Größere Anlagen oder Betriebe, die ohnehin über eine eigene Mittelspannungsstation versorgt werden, speisen meist über den eigenen Trafo ein (Netzebene 5). Was möglich ist, entscheidet die Netzverträglichkeitsprüfung des Netzbetreibers.",
  },
  {
    q: "Was verlangt der Netzbetreiber bei Typ B?",
    a: `Laut ${TYPEN.B.regelwerk} unter anderem Wirkleistungsvorgaben, einen Blindleistungsbereich, Fault-Ride-Through und ab 1 MW eine Fernwirkschnittstelle nach Wahl des Netzbetreibers. Am Netzverknüpfungspunkt setzt das ein Parkregler um, der Sollwerte des Netzbetreibers an alle Wechselrichter verteilt und die Einhaltung dokumentiert.`,
  },
  {
    q: "Was bedeutet die Spitzenkappung ab 2027 für eine Industrieanlage?",
    a: "Nach dem ElWG darf die Einspeisung neuer oder erweiterter PV-Anlagen ab 1. Jänner 2027 auf bis zu 70 % der Modulspitzenleistung begrenzt werden. Bei hohem Eigenverbrauch betrifft das vor allem Wochenenden und Betriebsferien. Wir rechnen die abgeregelte Energie aus Ihrem Lastgang aus und prüfen, ob ein Speicher sie sinnvoll aufnimmt.",
  },
  {
    q: "Wie rechnet die Geschäftsführung die Investition?",
    a: "Mit Kapitalwert und Amortisation aus dem eigenen Lastgang – nicht mit Pauschalwerten. Unser Investitionsantrag-Rechner liefert die Struktur für die Vorlage an Vorstand oder Aufsichtsrat; der Modellvergleich zeigt Kauf, Leasing und Contracting nebeneinander. Eine Renditezusage geben wir nicht: Ergebnis sind Szenarien mit offengelegten Annahmen.",
  },
  {
    q: "Welche Nachweise bekommt unser Einkauf?",
    a: `Firmenbuchnummer (${FIRMA.firmenbuch}), UID (${FIRMA.uid}) und GISA-Zahl (${FIRMA.gisa}) sind öffentlich prüfbar. Referenzen nennen wir mit Namen nur, wenn der Kunde zugestimmt hat; sonst neutral mit Branche, Region und Leistung. Weitere Nachweise, die Ihre Einkaufsrichtlinie verlangt, klären wir im Erstgespräch – wir legen nur vor, was wir belegen können.`,
  },
  {
    q: "Hilft die Anlage bei der Nachhaltigkeitsberichterstattung?",
    a: "Ja, als zweites Argument nach den Kosten: Selbst erzeugter Solarstrom senkt die marktbasierten Scope-2-Emissionen. Viele Industriebetriebe werden von Kunden und Banken nach Energie- und Klimadaten gefragt; für KMU gibt der freiwillige VSME-Standard (Empfehlung (EU) 2025/1710) den Rahmen vor. Messdaten aus dem Monitoring liefern dafür belastbare Zahlen.",
  },
];

const BUYING_CENTER = [
  {
    id: "geschaeftsfuehrung",
    icon: BadgeEuro,
    titel: "Geschäftsführung",
    frage: "Rechnet sich das – und wie sicher?",
    punkte: [
      "Kapitalwert, Amortisation und Liquiditätsverlauf aus Ihrem Lastgang – mit offengelegten Annahmen und Szenarien statt Renditeversprechen",
      "Strompreis-Absicherung: Jede selbst erzeugte kWh ersetzt Energie, Netz-Arbeitsentgelt und Abgaben über die Laufzeit der Anlage",
      "Kauf, Leasing oder Contracting neutral nebeneinander",
    ],
    links: [
      { label: "Investitionsantrag erstellen", href: "/rechner/investitionsantrag", icon: Calculator },
      { label: "Modellvergleich Kauf/Leasing/Contracting", href: "/service/finanzierung", icon: BadgeEuro },
    ],
  },
  {
    id: "technik",
    icon: Cpu,
    titel: "Technik & Instandhaltung",
    frage: "Passt das ans Netz und in den Betrieb?",
    punkte: [
      "TOR-Einstufung, Netzebene und Netzverträglichkeit vor der Planung geklärt",
      "Anschluss über eigenen Trafo oder Netzebene 6 – Schutz, Messung und Einlinienschaltbild aus einer Hand",
      PARKREGLER_SATZ,
    ],
    links: [
      { label: "Netzanschluss-Simulator", href: "/technik/netzanschluss-simulator", icon: Zap },
      { label: "Parkregler-Datenblatt für Fachplaner", href: "/technik/parkregler/datenblatt", icon: FileCheck2 },
    ],
  },
  {
    id: "einkauf",
    icon: ClipboardList,
    titel: "Einkauf",
    frage: "Ist der Lieferant prüfbar?",
    punkte: null, // eigene Nachweisliste unten
    links: [{ label: "Referenzprojekte ansehen", href: "#referenzen", icon: Building2 }],
  },
];

const NACHWEISE = [
  { was: "Firmenbuch", wert: `${FIRMA.firmenbuch}, ${FIRMA.firmenbuchgericht}`, q: Q.firmenbuch },
  { was: "UID-Nummer", wert: FIRMA.uid, q: null },
  { was: "GISA-Zahl (Gewerbe)", wert: `${FIRMA.gisa} · ${FIRMA.gewerbe}`, q: Q.gisa },
  { was: "Referenzen", wert: "Namentlich nur mit Freigabe des Kunden, sonst neutral (Branche, Region, kWp)", q: null },
  ...(FIRMA.verbaende || []).map((v) => ({ was: "Verband", wert: `${v.status} im ${v.name}`, q: null })),
  { was: "Weitere Nachweise", wert: "nach Ihrer Einkaufsrichtlinie – nur, was wir belegen können (zu klären im Erstgespräch)", q: null },
];

export default function IndustriePage() {
  return (
    <div>
      <LoesungSchema
        pfad={PFAD}
        name="Photovoltaik für Industrie ab 500 kWp in Österreich"
        titel={TITEL}
        beschreibung={BESCHREIBUNG}
        zielgruppe="Industrie und produzierendes Gewerbe"
        bild={HERO_BILD}
        leistungen={["Lastganganalyse und Auslegung ab 500 kWp", "Netzanschluss Netzebene 5/6 inkl. Trafostation", "Parkregler, Fernwartung und SCADA", "Investitionsantrag und Finanzierungsmodelle", "Speicher und Spitzenlastmanagement", "Wartung und Betriebsführung"]}
      />

      <PageHero
        variant="immersive"
        className="pb-4 md:pb-6"
        breadcrumbs={[{ name: "Gewerbe & Industrie", href: "/gewerbe" }, { name: "Industrie ab 500 kWp" }]}
        eyebrow="Industrie · ab 500 kWp · Mittelspannung"
        title={<>Photovoltaik für Industrie ab 500 kWp <span className="ov-text-gradient-light">in Österreich</span></>}
        lead="Für Produktionsbetriebe mit Mittelspannungsanschluss: planbare Stromkosten, ein Netzanschluss nach TOR Typ B mit Parkregler und eine Entscheidungsvorlage, die Geschäftsführung, Technik und Einkauf gleichermaßen trägt."
        image={{ src: HERO_BILD, alt: "Luftbild eines Industriedachs mit großflächiger Photovoltaikanlage" }}
        actions={[
          { label: "Lastgang auswerten lassen", href: "/angebot?objekt=gewerbe", icon: Gauge },
          { label: "Investitionsantrag rechnen", href: "/rechner/investitionsantrag", icon: Calculator },
        ]}
        points={["Netzebene 5/6 und eigener Trafo", "TOR Typ B inkl. Parkregler", "Kapitalwert statt Pauschalrendite", "Nachweise für den Einkauf"]}
      />

      {/* Abgrenzung zu /gewerbe – im Text und per Querlink */}
      <Section tone="sand" space="sm" aria-label="Für wen diese Seite ist">
        <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
          <p className="max-w-3xl text-[15.5px] leading-relaxed text-ink-700">
            <strong className="text-ink-900">Diese Seite ist für Anlagen ab etwa 500 kWp</strong> – meist mit eigener Mittelspannungsstation, Typ-B-Anforderungen und mehreren
            Entscheidern. Für Hallen, Handel und Betriebe mit kleineren Dächern bis etwa 500 kWp finden Sie Auslegung, Förderung und Beispielrechnung unter{" "}
            <Link href="/gewerbe" className="font-semibold text-ov-700 underline decoration-ov-300 underline-offset-4 hover:text-ov-800">
              Photovoltaik für Gewerbe
            </Link>
            .
          </p>
          <StandPille>Stand {STAND} · Angaben ohne Gewähr, Richtwerte zur Orientierung</StandPille>
        </div>
      </Section>

      {/* Argument 1: Kosten- und Versorgungssicherheit */}
      <Section tone="white" space="lg" id="kostensicherheit">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <SectionHeading eyebrow="Erstes Argument" title="Kosten- und Versorgungssicherheit: Strom, dessen Preis Sie selbst festlegen" />
          <Prosa className="[&>p:first-child]:mt-0!">
            <p>
              <strong>Eine Industrieanlage ab 500 kWp ist vor allem eine Absicherung gegen Strompreisschwankungen.</strong> Jede selbst genutzte Kilowattstunde
              ersetzt Energiepreis, Netz-Arbeitsentgelt, Netzverlustentgelt und Elektrizitätsabgabe – über die gesamte Laufzeit der Anlage, unabhängig von Börse und
              Liefervertrag. Wie viel das in Ihrem Betrieb ist, zeigt nur Ihr eigener Lastgang.
            </p>
            <p>
              <strong>Versorgungssicherheit</strong> entsteht nicht durch PV allein: Mit einem Speicher und Lastmanagement lassen sich Lastspitzen kappen und – mit
              netzbildenden Umrichtern – kritische Verbraucher bei einem Netzausfall weiter versorgen. Wir rechnen beides getrennt aus, damit jede Maßnahme für sich
              tragen muss.
            </p>
            <p>
              <strong>Ab 1. Jänner 2027 gilt die Spitzenkappung:</strong> Die Einspeisung neuer PV-Anlagen darf auf bis zu 70 % der Modulspitzenleistung begrenzt
              werden (<QuellLink q={Q.elwg} />; <QuellLink q={Q.spitzenkappung} />, Stand {Q.spitzenkappung.stand}). Bei hohem Eigenverbrauch betrifft das vor allem
              Wochenenden und Betriebsferien –{" "}
              <Link href={SPITZENKAPPUNG_HREF} className="font-semibold text-ov-700 underline decoration-ov-300 underline-offset-4">
                was die Spitzenkappung für Ihre Anlage bedeutet
              </Link>
              , rechnen wir aus Ihrem Lastgang.
            </p>
          </Prosa>
        </div>
        <ul className="mt-10 grid gap-4 sm:grid-cols-3">
          {[
            { icon: Sun, titel: "Eigenverbrauch statt Einspeisung", text: "Auslegung auf Grundlast und Schichtbetrieb – Überschüsse über Direktvermarktung oder PPA.", href: "/lastgang-analyse", link: "Lastgang selbst auswerten" },
            { icon: BatteryCharging, titel: "Speicher & Lastspitzen", text: "Leistungspreis, Spitzenkappung und Notstrom als getrennte Rechnungen.", href: "/gewerbespeicher", link: "Gewerbespeicher" },
            { icon: ShieldCheck, titel: "Blackout-Vorsorge", text: "Welche Verbraucher weiterlaufen müssen und was das kostet.", href: "/rechner/blackout", link: "Blackout-Rechner" },
          ].map((k) => (
            <li key={k.titel} className="flex flex-col rounded-[1.5rem] bg-sand-50 p-6">
              <k.icon aria-hidden="true" className="h-6 w-6 text-ov-600" strokeWidth={1.8} />
              <h3 className="mt-4 font-display text-[18px] font-bold leading-snug text-ink-900">{k.titel}</h3>
              <p className="mt-2 flex-1 text-[15px] leading-relaxed text-ink-600">{k.text}</p>
              <Link href={k.href} className="mt-2 inline-flex min-h-11 items-center gap-1.5 self-start py-2 text-[14.5px] font-semibold text-ov-700 hover:text-ov-800">
                {k.link} <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <IfbHinweis />

      {/* Buying Center */}
      <Section tone="sand" space="lg" id="buying-center">
        <SectionHeading eyebrow="Eine Vorlage, drei Entscheider" title="Was Geschäftsführung, Technik und Einkauf von uns bekommen" className="mb-10" />
        <div className="grid gap-5 lg:grid-cols-3">
          {BUYING_CENTER.map((b) => (
            <article key={b.id} id={b.id} className="flex scroll-mt-28 flex-col rounded-[1.75rem] bg-white p-6 shadow-sm md:p-7">
              <span aria-hidden="true" className="flex h-12 w-12 items-center justify-center rounded-2xl bg-ov-50 text-ov-700">
                <b.icon className="h-6 w-6" strokeWidth={1.8} />
              </span>
              <h3 className="mt-5 font-display text-[21px] font-extrabold leading-tight text-ink-900">{b.titel}</h3>
              <p className="mt-1 text-[14.5px] text-ink-500">{b.frage}</p>
              {b.punkte ? (
                <ul className="mt-4 flex-1 space-y-2.5 text-[15px] leading-relaxed text-ink-700">
                  {b.punkte.map((p) => (
                    <li key={p} className="flex gap-2.5">
                      <span aria-hidden="true" className="mt-[0.6em] h-1.5 w-1.5 shrink-0 rounded-full bg-ov-600" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <dl className="mt-4 flex-1 divide-y divide-ink-100 text-[14.5px]">
                  {NACHWEISE.map((n) => (
                    <div key={n.was + n.wert} className="py-2.5">
                      <dt className="font-semibold text-ink-900">{n.was}</dt>
                      <dd className="mt-0.5 leading-relaxed text-ink-700">
                        {n.wert}
                        {n.q && (
                          <>
                            {" "}
                            · prüfbar: <QuellLink q={n.q} />
                          </>
                        )}
                      </dd>
                    </div>
                  ))}
                </dl>
              )}
              <div className="mt-4 flex flex-col">
                {b.links.map((l) => (
                  <Link key={l.href} href={l.href} className="inline-flex min-h-11 items-center gap-2 self-start py-2 text-[14.5px] font-semibold text-ov-700 hover:text-ov-800">
                    <l.icon aria-hidden="true" className="h-4 w-4" />
                    {l.label}
                  </Link>
                ))}
              </div>
            </article>
          ))}
        </div>
      </Section>

      <div id="referenzen" className="scroll-mt-24">
        <BranchenReferenzen zielgruppe="industrie" titel="Referenzen aus Industrie und produzierendem Gewerbe" />
      </div>

      {/* Netz: Netzebene 5/6, eigener Trafo, TOR, Parkregler/SCADA */}
      <Section tone="white" space="lg" id="netz">
        <div className="mb-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:gap-16">
          <SectionHeading eyebrow="Für die Technik" title="Netzebene 5 oder 6, eigener Trafo und TOR Typ B" />
          <p className="ov-lead text-ink-600">
            Ab etwa 500 kWp entscheidet der Netzanschluss über Zeitplan und Kosten. Wir klären Netzebene, Trafokapazität und TOR-Anforderungen, bevor geplant wird.
          </p>
        </div>
        <Tabelle
          dicht
          caption="Netzebenen für industrielle PV-Anlagen in Österreich"
          spalten={[
            { key: "ne", label: "Netzebene" },
            { key: "ort", label: "Anschlusspunkt" },
            { key: "groesse", label: "Typische Größe (Richtwert)" },
            { key: "hinweis", label: "Worauf es ankommt" },
          ]}
          zeilen={NETZEBENEN}
          fuss={<>Richtwerte zur Orientierung, Stand {STAND} – welche Netzebene möglich ist, entscheidet die Netzverträglichkeitsprüfung des Netzbetreibers.</>}
        />
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <div className="rounded-[1.5rem] bg-sand-50 p-6 md:p-7">
            <p className="text-[12.5px] font-semibold uppercase tracking-[0.16em] text-ov-700">TOR-Einstufung</p>
            <h3 className="mt-2 font-display text-[19px] font-bold text-ink-900">
              Typ B: {TYPEN.B.grenze} Maximalkapazität
            </h3>
            <ul className="mt-3 space-y-2 text-[15px] leading-relaxed text-ink-700">
              {TYPEN.B.anforderungen.map((a) => (
                <li key={a} className="flex gap-2.5">
                  <span aria-hidden="true" className="mt-[0.6em] h-1.5 w-1.5 shrink-0 rounded-full bg-ov-600" />
                  <span>{a}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-[13px] leading-relaxed text-ink-500">
              Quelle: <QuellLink q={Q.torAB} /> ({TYPEN.B.regelwerk}), Typeinteilung nach RfG-Schwellenwert-V · {Q.torAB.stand}. Vereinfachte Darstellung – verbindlich sind
              TOR, Netzanschlussvertrag und Vorgaben Ihres Netzbetreibers.
            </p>
          </div>
          <div className="rounded-[1.5rem] bg-navy-950 p-6 text-white md:p-7">
            <p className="text-[12.5px] font-semibold uppercase tracking-[0.16em] text-ov-300">Parkregler & SCADA</p>
            <h3 className="mt-2 font-display text-[19px] font-bold">Sollwerte am Netzverknüpfungspunkt einhalten – und belegen</h3>
            <p className="mt-3 text-[15px] leading-relaxed text-white/80">
              Fordert der Netzbetreiber die Blindleistungsmessung auf der Mittelspannungsseite, verlangen die TOR Typ A und B einen Park- und Anlagenregler, sobald die
              Summe der Engpassleistungen am Netzanschlusspunkt über 100 kVA (mit MS-Messung) bzw. über 400 kVA (ohne) liegt – bei Industrieanlagen ab 500 kWp also
              praktisch immer.
            </p>
            <p className="mt-3 text-[15px] leading-relaxed text-white/80">{PARKREGLER_SATZ}</p>
            <div className="mt-4 flex flex-wrap gap-x-5">
              <Link href="/technik/parkregler" className="inline-flex min-h-11 items-center gap-1.5 py-2 text-[14.5px] font-semibold text-white hover:text-ov-200">
                Parkregler <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
              </Link>
              <Link href="/technik/scada" className="inline-flex min-h-11 items-center gap-1.5 py-2 text-[14.5px] font-semibold text-white hover:text-ov-200">
                SCADA <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
              </Link>
              <Link href="/technik/netzanschluss-simulator" className="inline-flex min-h-11 items-center gap-1.5 py-2 text-[14.5px] font-semibold text-white hover:text-ov-200">
                Netzanschluss-Simulator <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            </div>
            <p className="mt-4 text-[12.5px] leading-relaxed text-white/60">Quelle Schwellen: TOR Stromerzeugungsanlagen Typ A V1.4 / Typ B V1.3 (E-Control) · Stand {STAND}.</p>
          </div>
        </div>
      </Section>

      {/* Argument 2: ESG / VSME */}
      <Section tone="sand" space="md" id="esg">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <SectionHeading eyebrow="Zweites Argument" title="Klimadaten für Kunden, Banken und VSME – aus gemessenen Werten" />
          <Prosa className="[&>p:first-child]:mt-0!">
            <p>
              Selbst erzeugter und verbrauchter Solarstrom senkt die marktbasierten Scope-2-Emissionen. Industriebetriebe werden zunehmend von Konzernkunden und Banken
              nach Energie- und Klimadaten gefragt; für KMU ist der freiwillige Standard VSME der Rahmen (<QuellLink q={Q.vsme} />, Stand {Q.vsme.stand}).
            </p>
            <p>
              Aus dem Monitoring der Anlage kommen dafür gemessene Erzeugungs- und Eigenverbrauchswerte statt Schätzungen. Mehr dazu im Ratgeber{" "}
              <Link href="/ratgeber/csrd-esg-photovoltaik" className="font-semibold text-ov-700 underline decoration-ov-300 underline-offset-4">
                CSRD, VSME und Photovoltaik
              </Link>{" "}
              und im{" "}
              <Link href="/rechner/co2-esg" className="font-semibold text-ov-700 underline decoration-ov-300 underline-offset-4">
                CO₂-Rechner
              </Link>
              .
            </p>
          </Prosa>
        </div>
      </Section>

      {/* PreisAnker und EinwandKarten bringen keinen eigenen Container mit – deshalb in Section (A03-Bausteine).
          PreisAnker zeigt nur freigegebene Preisbänder, sonst nichts. */}
      {freigegebenePreisbaender().length > 0 && (
        <Section tone="white" space="md" id="preisanker">
          <PreisAnker />
        </Section>
      )}

      {/* Einwände vor der FAQ – eigene FAQ mit Schema, daher ohne zweites FAQPage-Schema */}
      <Section tone="white" space="md" id="einwaende" className="scroll-mt-24">
        <EinwandKarten gruppe="gewerbe" mitSchema={false} titel="Was Industriebetriebe uns entgegnen – und was wir antworten" />
      </Section>

      <Section tone="white" space="md">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-20 [&>*]:min-w-0">
          <div>
            <SectionHeading eyebrow="Häufige Fragen" title="Industrie-PV ab 500 kWp: was Entscheider wissen wollen" />
            <Hinweis titel="Orientierung, keine Rechts- oder Steuerberatung" className="mt-8">
              Die Angaben geben den Stand {STAND} wieder. TOR, Netzentgelte und Förderbedingungen ändern sich – wir prüfen sie für Ihr Projekt tagesaktuell.
            </Hinweis>
          </div>
          <Faq items={FAQ} />
        </div>
      </Section>

      <Section tone="sand" space="sm" aria-label="Weiterführende Seiten">
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { href: "/gewerbe", titel: "Photovoltaik für Gewerbe", text: "Hallen, Handel und Betriebe bis etwa 500 kWp." },
            { href: "/grossspeicher-epc", titel: "Großspeicher (BESS)", text: "Speicher ab 1 MW, auch am PV-Standort." },
            { href: "/freiflaechen-photovoltaik", titel: "Freiflächen-PV", text: "Solarparks auf Betriebs- und Pachtflächen." },
            { href: "/ratgeber/tor-erzeuger-netzanschluss", titel: "TOR & Netzanschluss", text: "Typ A bis D, Nachweise und Ablauf." },
          ].map((v) => (
            <li key={v.href}>
              <Link href={v.href} className="group flex h-full flex-col rounded-[1.25rem] bg-white p-5 shadow-sm hover:shadow-md">
                <span className="flex items-center justify-between gap-3 font-display text-[16.5px] font-bold text-ink-900">
                  {v.titel}
                  <ArrowUpRight aria-hidden="true" className="h-4 w-4 text-ov-600 transition-transform group-hover:rotate-45" />
                </span>
                <span className="mt-1.5 text-[14px] leading-relaxed text-ink-600">{v.text}</span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      {/* Ansprechpartner bringt keinen eigenen Container mit */}
      <Section tone="white" space="sm">
        <Ansprechpartner zielgruppe="gewerbe" />
      </Section>

      <CtaBand
        eyebrow="Erstgespräch mit Lastgang"
        title="Schicken Sie uns Ihren Lastgang – wir liefern die Entscheidungsvorlage."
        text="Anlagengröße, Netzebene, TOR-Anforderungen, Kapitalwert-Szenarien und Nachweise für den Einkauf – mit offengelegten Annahmen, ohne Renditeversprechen."
        primary={{ label: "Video-Termin vereinbaren", href: "/termin?art=video&thema=gewerbe" }}
        secondary={{ label: "Anfrage mit Lastgang starten", href: "/angebot?objekt=gewerbe", icon: Building2 }}
      />

    </div>
  );
}
