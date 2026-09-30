// src/app/forderungen/bundesfoerderung/page.js
//
// Bundesförderung Österreich: EAG-Investitionszuschuss (OeMAG), EAG-Marktprämie,
// KPC/Klima- und Energiefonds, Energiegemeinschaften, Kombinierbarkeit.

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ArrowUpRight, BadgeEuro, BatteryCharging, Calculator, CalendarClock, CircleX, FileSignature, Gauge, Layers, Leaf, PlugZap, Receipt, Scale, Ticket, Users, Wrench, Zap } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import Faq from "@/components/ui/Faq";
import CtaBand from "@/components/ui/CtaBand";
import Reveal from "@/components/ui/Reveal";
import Querverweise from "@/components/Reusable/Querverweise";
import ZuschussRechner from "@/components/Forderungen/Bund/ZuschussRechner";
import Foerderkalender from "@/components/Forderungen/Bund/Foerderkalender";
import Umschalter from "@/components/Forderungen/Shared/Umschalter";
import Prozess from "@/components/Forderungen/Shared/Prozess";
import { Bildnachweis, Fachdetails, Glow, KennzahlenBand } from "@/components/Forderungen/Shared/Premium";
import { nachweise } from "@/components/Forderungen/Shared/bildnachweise";
import { Checkliste, PruefenMarke, Quellen, StandPille, Tabelle } from "@/components/Forderungen/Shared/Bausteine";
import { EAG_IZ, ENERGIEGEMEINSCHAFTEN, KPC_BEENDET, KPC_PROGRAMME, MARKTPRAEMIE, OEMAG_MARKTPREIS, STAND } from "@/components/Forderungen/Shared/bund";
import { BASE_URL } from "@/lib/site";

const PAGE_URL = `${BASE_URL}/forderungen/bundesfoerderung`;
const TITLE = "EAG-Investitionszuschuss 2026: PV & Speicher | Ökovolt";
const DESCRIPTION = "EAG-Investitionszuschuss 2026 für PV und Speicher: Kategorien A–D, Fördersätze, Speicher 150 €/kWh, Fördercalls und Zuschussrechner – plus Marktprämie und KPC.";

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: ["EAG-Investitionszuschuss 2026", "OeMAG Fördercall 2026", "Photovoltaik Förderung Österreich", "PV Förderung Unternehmen", "Stromspeicher Förderung 2026", "EAG Marktprämie", "Förderung Energiegemeinschaft"],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    type: "article",
    url: PAGE_URL,
    siteName: "Ökovolt Österreich",
    locale: "de_AT",
    title: TITLE,
    description: DESCRIPTION,
    images: [{ url: `${BASE_URL}/og-image.jpg`, width: 1200, height: 630, alt: "EAG-Investitionszuschuss für Photovoltaik und Speicher" }],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, images: [`${BASE_URL}/og-image.jpg`] },
};

const FAQ = [
  {
    q: "Wie hoch ist der EAG-Investitionszuschuss 2026?",
    a: "Kategorie A (bis 10 kWp) erhält fix 150 €/kWp, Kategorie B (über 10 bis 20 kWp) fix 140 €/kWp. In Kategorie C (über 20 bis 100 kWp) sind höchstens 130 €/kWp, in Kategorie D (über 100 bis 1.000 kWp) höchstens 120 €/kWp möglich – dort bieten Förderwerber ihren Förderbedarf, gereiht wird vom niedrigsten Gebot an. Stromspeicher erhalten 150 €/kWh. Der Zuschuss ist auf 30 % der förderfähigen Kosten gedeckelt – netto bei Vorsteuerabzug, sonst brutto.",
  },
  {
    q: "Wann ist der nächste OeMAG-Fördercall?",
    a: "Der dritte und letzte Fördercall 2026 läuft vom 08.10. bis 22.10.2026 mit je 2 Mio. € für die Kategorien A, B, C und D. In den Kategorien A und B entscheidet die Reihenfolge des Tickets; die Ticketziehung startet am 08.10.2026 um 17 Uhr.",
  },
  {
    q: "Muss ich den Förderantrag vor der Bestellung stellen?",
    a: "Nein. Nach der EAG-Investitionszuschüsseverordnung muss der Antrag vor der Inbetriebnahme eingebracht werden – eine Bestellung oder der Baubeginn davor schaden nicht. Allerdings müssen zum Antragszeitpunkt alle nötigen Anzeigen und Genehmigungen vorliegen, und der Netzbetreiber muss die Anschlussmöglichkeit bestätigt haben.",
  },
  {
    q: "Wird ein Stromspeicher 2026 gefördert?",
    a: "Ja, mit 150 €/kWh – aber nur gemeinsam mit einer neuen oder erweiterten PV-Anlage. Der Speicher muss mindestens 0,5 kWh je kWp Modulleistung haben; gefördert werden höchstens 50 kWh je Anlage. Ein Speicher allein oder die Erweiterung eines bestehenden Speichers ist nicht förderfähig.",
  },
  {
    q: "Gibt es einen Abschlag für Freiflächen und Agri-PV?",
    a: "Für PV auf landwirtschaftlich genutzten Flächen oder im Grünland wird der Zuschuss um 25 % gekürzt. Der Abschlag entfällt u. a. auf Gebäuden, Deponien, Altlasten, Infrastrukturflächen und bei Agri-PV mit landwirtschaftlicher Hauptnutzung auf mindestens 75 % der Fläche. Agri-PV mit vertikalen Modulen oder mindestens 2 m Modulunterkante erhält sogar einen Innovationszuschlag von 30 %.",
  },
  {
    q: "Kann ich den EAG-Zuschuss mit einer Landesförderung kombinieren?",
    a: "In den Kategorien A, B und C sowie bei innovativen Anlagen ja, bis zu den beihilferechtlichen Höchstgrenzen. In Kategorie D ist eine Kombination mit Landes- oder Gemeindeförderungen ausgeschlossen. Investitionszuschuss und Marktprämie schließen einander für dieselbe Anlage aus.",
  },
  {
    q: "Investitionszuschuss oder Marktprämie – was ist für Unternehmen besser?",
    a: "Der Investitionszuschuss senkt die Anfangsinvestition einmalig und passt zu Anlagen mit hohem Eigenverbrauch. Die Marktprämie sichert für eingespeisten Strom über 20 Jahre einen Mindestwert ab (Höchstgebot 2026: 7,77 ct/kWh) und lohnt sich eher bei hoher Einspeisung, etwa bei Freiflächen. Wir rechnen für Ihre Anlage beide Varianten mit Ihrem Lastgang.",
  },
];


const LINK = "font-semibold text-ov-700 underline decoration-ov-300 underline-offset-2 hover:text-ov-800";

const KOMBINATION = [
  { mit: "Landes- oder Gemeindeförderung, Kategorie A–C", ok: true, warum: "bis zu den beihilferechtlichen Höchstgrenzen; der Abwicklungsstelle melden (§ 3 Abs. 6 und 7 EAG-IZV)" },
  { mit: "Landes- oder Gemeindeförderung, Kategorie D", ok: false, warum: "Kumulierungsverbot – unzulässige Mehrfachförderung ist ein Rückzahlungsgrund" },
  { mit: "EAG-Marktprämie für dieselbe Anlage", ok: false, warum: "entweder Investitionszuschuss oder Marktprämie" },
  { mit: "Investitionsfreibetrag (IFB)", ok: true, warum: "steuerliche Maßnahme, keine Förderung im Sinn der IZV; steuerfreie Zuschüsse aus öffentlichen Mitteln kürzen aber die Anschaffungskosten – steuerliche Beratung einbinden" },
  { mit: "Energiegemeinschaft (EEG/BEG)", ok: true, warum: "Netzentgelt-Reduktion ist keine Investitionsförderung" },
];

const KAT_BREITE = { A: 18, B: 30, C: 58, D: 100 };

export default function Bundesfoerderung() {
  const call3 = EAG_IZ.calls[2];
  const naechsterGebot = MARKTPRAEMIE.termine.find((t) => /nächster/i.test(t.status))?.datum || "";
  const marktpreise = OEMAG_MARKTPREIS.werte.map(([m, w]) => ({ m, w, n: Number(w.replace(",", ".")) }));
  const mpMax = Math.max(...marktpreise.map((x) => x.n));

  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${PAGE_URL}/#webpage`,
    url: PAGE_URL,
    name: "Bundesförderung für Photovoltaik in Österreich 2026",
    description: DESCRIPTION,
    inLanguage: "de-AT",
    isPartOf: { "@id": `${BASE_URL}/#website` },
    about: [
      { "@type": "GovernmentService", name: "EAG-Investitionszuschuss für Photovoltaik und Stromspeicher", provider: { "@type": "Organization", name: "OeMAG Abwicklungsstelle für Ökostrom AG" }, areaServed: "AT" },
      { "@type": "GovernmentService", name: "EAG-Marktprämie für Photovoltaik", provider: { "@type": "Organization", name: "OeMAG Abwicklungsstelle für Ökostrom AG" }, areaServed: "AT" },
    ],
    publisher: { "@id": `${BASE_URL}/#organization` },
    dateModified: STAND.iso,
  };

  // ---- Panels: Kategorien ----
  const kategorienKarten = (
    <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      {EAG_IZ.kategorien.map((k, i) => (
        <Reveal as="li" key={k.id} delay={i * 80} className="flex">
          <article className="group ov-card-hover relative flex w-full flex-col overflow-hidden rounded-3xl bg-white p-4 ring-1 ring-ink-200/70 hover:ring-ov-200 sm:p-6">
            <div aria-hidden="true" className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-ov-300 via-ov-500 to-ov-700 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <div className="flex items-start justify-between gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-navy-950 font-display text-[21px] sm:h-14 sm:w-14 sm:text-[26px] font-extrabold text-white shadow-[0_12px_24px_-12px_rgba(3,18,43,0.7)]">{k.id}</span>
              <span className={`rounded-full px-2 py-0.5 text-[10.5px] font-semibold uppercase tracking-wider sm:px-2.5 sm:py-1 sm:text-[11.5px] ${k.art === "Fixbetrag" ? "bg-ov-100 text-ov-800" : "bg-sun-300/40 text-ink-800"}`}>{k.art === "Fixbetrag" ? "Fixbetrag" : "Gebot"}</span>
            </div>
            <h3 className="mt-4 text-[12.5px] font-semibold leading-snug text-ink-500 sm:mt-6 sm:text-[14px]">Kategorie {k.id} · {k.leistung}</h3>
            <p className="ov-num mt-1 whitespace-nowrap font-display text-[22px] font-extrabold sm:text-[32px] leading-none tracking-tight text-ink-900">
              {k.satz.startsWith("max. ") && <span className="mr-1 text-[13px] font-bold text-ink-500 sm:mr-1.5 sm:text-[18px]">max.</span>}
              {k.satz.replace("max. ", "")}
            </p>
            <span aria-hidden="true" className="mt-5 block h-1.5 overflow-hidden rounded-full bg-ink-100">
              <span className="block h-full rounded-full bg-gradient-to-r from-ov-300 to-ov-600" style={{ width: `${KAT_BREITE[k.id]}%` }} />
            </span>
            <p className="mt-3 text-[13px] leading-snug text-ink-600 sm:mt-4 sm:text-[14px] sm:leading-relaxed">Reihung {k.reihung}</p>
            <p className="mt-auto flex flex-wrap items-center justify-between gap-x-2 border-t border-dashed border-ink-200 pt-3 text-[12.5px] text-ink-500 sm:pt-4 sm:text-[13.5px]">
              Budget 3. Call <strong className="ov-num font-semibold text-ink-900">{call3.budget[k.id]}</strong>
            </p>
          </article>
        </Reveal>
      ))}
    </ul>
  );

  const kategorienDetails = (
    <div className="space-y-6">
      <Tabelle
        caption="EAG-Investitionszuschuss Photovoltaik 2026 – Kategorien und Fördersätze"
        dicht
        spalten={[
          { key: "kat", label: "Kategorie", breite: "w-[15%]" },
          { key: "leistung", label: "Engpassleistung" },
          { key: "satz", label: "Fördersatz" },
          { key: "reihung", label: "Reihung" },
          { key: "call3", label: "Budget 3. Call", breite: "w-[14%]" },
        ]}
        zeilen={EAG_IZ.kategorien.map((k) => ({ kat: `Kategorie ${k.id}`, leistung: k.leistung, satz: <strong className="text-ov-700">{k.satz}</strong>, reihung: k.reihung, call3: call3.budget[k.id] }))}
      />
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-3xl bg-sand-50 p-6 ring-1 ring-ink-200/60">
          <p className="flex items-center gap-2 font-display text-[18px] font-bold text-ink-900"><BatteryCharging aria-hidden="true" className="h-5 w-5 text-ov-600" /> Stromspeicher: {EAG_IZ.speicher.satz}</p>
          <Checkliste className="mt-4" items={EAG_IZ.speicher.regeln} />
        </div>
        <div className="rounded-3xl bg-sand-50 p-6 ring-1 ring-ink-200/60">
          <p className="flex items-center gap-2 font-display text-[18px] font-bold text-ink-900"><Gauge aria-hidden="true" className="h-5 w-5 text-ov-600" /> Obergrenzen</p>
          <Checkliste className="mt-4" items={EAG_IZ.obergrenzen} />
          <p className="mt-4 text-[14px] leading-relaxed text-ink-600">{EAG_IZ.freiflaecheAuflagen}</p>
        </div>
      </div>
      <ul className="grid gap-4 md:grid-cols-3">
        {EAG_IZ.zuschlaege.map((z) => (
          <li key={z.titel} className="rounded-3xl bg-white p-6 ring-1 ring-ink-200/70">
            <p className="font-display text-[18px] font-bold text-ov-700">{z.titel}</p>
            <p className="mt-2 text-[14.5px] leading-relaxed text-ink-600">{z.text}</p>
          </li>
        ))}
      </ul>
      <p className="text-[15px] leading-relaxed text-ink-600">
        Für Landwirtschaft und Freiflächen entscheiden diese Regeln über die Wirtschaftlichkeit – Details unter <Link href="/agri-pv" className={LINK}>Agri-PV</Link> und <Link href="/freiflaechen-photovoltaik" className={LINK}>Freiflächen-Photovoltaik</Link>.
      </p>
    </div>
  );

  // ---- Panels: weitere Bundesprogramme ----
  const kpcPanel = (
    <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {KPC_PROGRAMME.map((p) => (
        <li key={p.id} className="flex">
          <article className="flex w-full flex-col rounded-3xl bg-white p-6 ring-1 ring-ink-200/70">
            <p className="text-[12.5px] font-medium text-ink-500">{p.traeger}</p>
            <h3 className="mt-1 font-display text-[17.5px] font-bold leading-snug text-ink-900">{p.name}</h3>
            <p className="mt-3 font-semibold text-ov-700">{p.hoehe}</p>
            <p className="mt-2 text-[14.5px] leading-relaxed text-ink-600">{p.was}</p>
            <p className="mt-auto pt-4 text-[14px] text-ink-700"><span className="font-semibold">Status:</span> {p.status}</p>
            {p.pruefen && <PruefenMarke stand={STAND.label} />}
            <a href={p.url} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1 text-[14px] font-semibold text-ov-700 underline decoration-ov-300 underline-offset-2">
              Zum Programm<ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" /><span className="sr-only"> (externer Link, neues Fenster)</span>
            </a>
          </article>
        </li>
      ))}
      <li className="flex">
        <div className="flex w-full flex-col rounded-3xl bg-ink-50 p-6 ring-1 ring-ink-200/70">
          <p className="flex items-center gap-2 font-display text-[17.5px] font-bold text-ink-900"><CircleX aria-hidden="true" className="h-5 w-5 text-ink-400" /> Beendet – wird aber noch oft gesucht</p>
          <ul className="mt-4 space-y-2.5">
            {KPC_BEENDET.map((b) => (
              <li key={b.name} className="text-[14px] leading-snug text-ink-600">
                <strong className="font-semibold text-ink-800">{b.name}</strong> – {b.ende}
              </li>
            ))}
          </ul>
        </div>
      </li>
    </ul>
  );

  const egPanel = (
    <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
      <div>
        <p className="max-w-2xl text-[16px] leading-relaxed text-ink-600">Energiegemeinschaften werden nicht über Zuschüsse, sondern über reduzierte Netzentgelte und Abgabenbefreiungen gefördert. Ab 01.10.2026 gelten die Regeln des ElWG.</p>
        <dl className="mt-6 grid grid-cols-2 gap-3">
          {ENERGIEGEMEINSCHAFTEN.netzentgelt.map((n) => (
            <div key={n.art} className="rounded-3xl bg-navy-950 p-5 text-white">
              <dt className="text-[13px] leading-snug text-white/60">{n.art}</dt>
              <dd className="ov-num mt-2 font-display text-[30px] font-extrabold leading-none text-ov-300">{n.reduktion}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-4 text-[13.5px] leading-relaxed text-ink-500">{ENERGIEGEMEINSCHAFTEN.netzentgeltHinweis}</p>
        <Link href="/energiegemeinschaften" className="group mt-6 inline-flex items-center gap-2 text-[15px] font-semibold text-ov-700 hover:text-ov-800">
          Energiegemeinschaften für Unternehmen und Gemeinden
          <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
      <ul className="grid gap-3">
        {ENERGIEGEMEINSCHAFTEN.formen.map((f) => (
          <li key={f.titel} className="rounded-2xl bg-white p-4 ring-1 ring-ink-200/70">
            <p className="font-semibold text-ink-900">{f.titel}</p>
            <p className="mt-1 text-[14.5px] leading-relaxed text-ink-600">{f.text}</p>
          </li>
        ))}
      </ul>
    </div>
  );

  const kombiPanel = (
    <ul className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
      {KOMBINATION.map((k) => (
        <li key={k.mit} className={`flex gap-4 rounded-3xl bg-white p-5 ring-1 ${k.ok ? "ring-ov-200" : "ring-ink-200/70"}`}>
          <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-display text-[13px] font-extrabold ${k.ok ? "bg-ov-600 text-white" : "bg-ink-900 text-white"}`}>{k.ok ? "ja" : "nein"}</span>
          <div>
            <p className="font-semibold leading-snug text-ink-900">{k.mit}</p>
            <p className="mt-1 text-[14px] leading-relaxed text-ink-600">{k.warum}</p>
          </div>
        </li>
      ))}
      <li className="flex flex-col justify-center rounded-3xl bg-ov-50 p-5 ring-1 ring-ov-100">
        <p className="text-[14.5px] leading-relaxed text-ink-700">
          Welche Landesprogramme dazukommen, zeigen die <Link href="/forderungen/landesforderungen" className={LINK}>Landesförderungen aller neun Bundesländer</Link> – für Betriebe <Link href="/gewerbe" className={LINK}>PV für Gewerbe und Industrie</Link>, für Gemeinden <Link href="/kommunen" className={LINK}>PV für Gemeinden</Link>.
        </p>
      </li>
    </ul>
  );

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <PageHero
        variant="immersive"
        breadcrumbs={[{ name: "Förderungen", href: "/forderungen/bundesfoerderung" }, { name: "Bundesförderung" }]}
        eyebrow={`EAG · OeMAG · KPC · Stand ${STAND.kurz}`}
        title={<>EAG-Investitionszuschuss 2026 <span className="ov-text-gradient-light">für PV und Speicher</span></>}
        lead={<><span className="block font-display text-[1.15em] font-bold leading-snug text-white">Bundesförderung für Photovoltaik – kompakt erklärt</span><span className="mt-3 block">Der EAG-Investitionszuschuss ist die wichtigste Förderung für PV-Anlagen bis 1.000 kWp in ganz Österreich. Rechnen Sie Ihren Zuschuss aus – mit Kategorien, Sätzen, Fördercalls, Fristen und den Fehlern, an denen Anträge scheitern.</span></>}
        image={{ src: "/Images/AT/ratgeber/photovoltaik-flachdach.jpg", alt: "Große Photovoltaikanlage auf dem Flachdach eines Betriebsgebäudes", position: "center 60%" }}
        points={["Kategorien A–D mit Sätzen", "Speicher 150 €/kWh", "Ablauf und Fristen", "Kombination mit Land"]}
        actions={[
          { label: "Zuschuss berechnen", href: "#rechner", icon: Calculator },
          { label: "Förder-Check starten", href: "/foerdercheck" },
        ]}
      >
        <Link href="/forderungen/eag-foerdercall" className="ov-glass ov-hero-in mt-8 inline-flex items-center gap-3 rounded-2xl py-2.5 pl-2.5 pr-4 text-[14px] text-white/85 transition-colors hover:bg-white/15" style={{ "--ov-delay": "420ms" }}>
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-ov-500 text-white"><CalendarClock aria-hidden="true" className="h-5 w-5" /></span>
          <span>
            <span className="block text-[12px] font-semibold uppercase tracking-[0.14em] text-ov-300">Letzter Call 2026 · Checkliste & Countdown</span>
            <span className="ov-num font-semibold text-white">{EAG_IZ.naechsterCall.zeitraum}</span>
          </span>
          <ArrowRight aria-hidden="true" className="h-4 w-4 text-ov-300" />
        </Link>
      </PageHero>

      <KennzahlenBand
        items={[
          { value: 150, suffix: " €/kWp", label: "Kategorie A (bis 10 kWp)" },
          { value: 120, suffix: " €/kWp", label: "Kategorie D – Höchstsatz bis 1.000 kWp" },
          { value: 150, suffix: " €/kWh", label: "Speicher, max. 50 kWh" },
          { value: 30, suffix: " %", label: "Deckel der förderfähigen Nettokosten" },
        ]}
      />

      {/* Rechner */}
      <Section tone="sand" space="md" id="rechner" className="scroll-mt-24">
        <SectionHeading
          eyebrow="EAG-Zuschuss-Rechner"
          title={<>Wie viel <span className="ov-text-gradient">Zuschuss</span> bekommt Ihre Anlage?</>}
          lead="Leistung, Speicher und Standort einstellen – der Rechner ordnet die Kategorie zu und berücksichtigt Zu- und Abschläge, Made in Europe und den 30-%-Deckel."
          align="center"
          className="mb-10 md:mb-12"
        />
        <Reveal dir="scale">
          <ZuschussRechner budgets={call3.budget} callZeitraum={call3.zeitraum} naechsterGebotstermin={naechsterGebot} />
        </Reveal>
        <Fachdetails className="mt-6" titel="Rechenbeispiel: 80-kWp-Betriebsdach mit 40-kWh-Speicher" untertitel="Kategorie C, Gebot zum Höchstsatz, Anlage auf dem Gebäude, keine Europa-Zuschläge">
          <Tabelle
            dicht
            caption="Beispielrechnung EAG-Investitionszuschuss Kategorie C"
            spalten={[
              { key: "pos", label: "Position", breite: "w-[35%]" },
              { key: "rechnung", label: "Rechnung" },
              { key: "betrag", label: "Zuschuss", className: "font-display font-bold text-ov-700" },
            ]}
            zeilen={[
              { pos: "PV-Anlage 80 kWp", rechnung: "80 kWp × 130 €/kWp (Höchstsatz Kategorie C)", betrag: "10.400 €" },
              { pos: "Speicher 40 kWh", rechnung: "40 kWh × 150 €/kWh (Minimum 0,5 kWh/kWp = 40 kWh erfüllt)", betrag: "6.000 €" },
              { pos: "Summe vor Deckel", rechnung: "max. 30 % der förderfähigen Nettokosten", betrag: "bis 16.400 €" },
            ]}
          />
          <p className="mt-4 text-[14.5px] leading-relaxed text-ink-600">
            Beispielwerte – die Kosten Ihres Projekts und damit der 30-%-Deckel hängen vom Angebot ab. Ein niedrigeres Gebot erhöht die Chance auf einen Zuschlag. Zusätzlich wirkt der Investitionsfreibetrag – siehe <Link href="/forderungen/steuerlich" className={LINK}>steuerliche Vorteile für PV</Link>.
          </p>
        </Fachdetails>
      </Section>

      {/* Kategorien */}
      <Section tone="white" space="md" id="kategorien" className="scroll-mt-24">
        <div className="mb-6 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            eyebrow="EAG-Investitionszuschuss"
            title="Kategorien, Fördersätze und Reihung 2026"
            lead="Die Höhe richtet sich nach der Engpassleistung der Neuanlage bzw. Erweiterung. In A und B gibt es Fixbeträge nach Eingang, in C und D ein Bieterverfahren: Wer weniger Förderung je kWp beantragt, wird vorgereiht."
          />
          <StandPille className="shrink-0 self-start md:self-auto">EAG-IZV idF BGBl. II Nr. 12/2026</StandPille>
        </div>
        <Umschalter
          label="Darstellung der Kategorien"
          tabs={[
            { id: "karten", label: "Kategorien", icon: <Layers /> },
            { id: "details", label: "Tabelle, Speicher & Zuschläge", icon: <Scale /> },
          ]}
          panels={[kategorienKarten, kategorienDetails]}
        />
      </Section>

      {/* Fördercalls */}
      <Section tone="navy" space="md" id="foerdercalls" className="ov-noise isolate scroll-mt-24 overflow-hidden">
        <Image src="/Images/AT/loesungen/freiflaeche-spitalberg-kaernten.jpg" alt="" aria-hidden="true" fill sizes="100vw" className="-z-10 object-cover opacity-[0.22]" />
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-b from-navy-950 via-navy-950/80 to-navy-950" />
        <Glow />
        <div className="relative">
          <Foerderkalender
            calls={EAG_IZ.calls}
            termine={MARKTPRAEMIE.termine}
            start={`${EAG_IZ.naechsterCall.start}T17:00:00+02:00`}
            ende="2026-10-23T00:00:00+02:00"
            heuteIso={`${STAND.iso}T12:00:00+02:00`}
            kopf={
              <SectionHeading
                dark
                eyebrow="Förderkalender 2026"
                title="Drei Zeitfenster, 60 Mio. € – der letzte Call im Oktober"
                lead="Die Förderstelle öffnet 2026 drei Calls. Außerhalb dieser Fenster ist kein Antrag möglich. Ist das Budget einer Kategorie ausgeschöpft, kommen weitere Anträge erst im nächsten Call zum Zug."
              />
            }
            hinweis={`${EAG_IZ.naechsterCall.hinweis}. Wer das Ticket früh zieht, wird früher gereiht – der Antrag selbst folgt danach mit den Unterlagen. Wir bereiten Netzbestätigung, Genehmigungsnachweise und Angebot so vor, dass Sie am ersten Tag des Calls bereit sind.`}
          />
          <Link href="/forderungen/eag-foerdercall" className="group mt-6 inline-flex items-center gap-2 text-[15px] font-semibold text-ov-300 hover:text-white">
            Alles zum Oktober-Call: Checkliste, Ticketziehung und Schnellrechner
            <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </Section>

      {/* Ablauf */}
      <Section tone="white" space="md" id="ablauf" className="scroll-mt-24">
        <SectionHeading
          eyebrow="Ablauf in 7 Schritten"
          title="So kommt der EAG-Zuschuss sicher aufs Konto"
          lead="Die Reihenfolge ist entscheidend: Netzbestätigung und Genehmigungen vor dem Antrag, Antrag vor der Inbetriebnahme, Endabrechnung innerhalb der Frist."
          className="mb-10 md:mb-12"
        />
        <Prozess
          name="EAG-Investitionszuschuss für eine Photovoltaikanlage beantragen"
          beschreibung={`Ablauf für PV-Anlagen bis 1.000 kWp in Österreich nach EAG-Investitionszuschüsseverordnung-Strom, Stand ${STAND.label}.`}
          schritte={[
            { icon: <Wrench />, name: "Anlage planen und Angebot einholen", text: "Ein befugtes Unternehmen plant Anlage und Speicher nach Lastgang und Dach. Das Angebot ist Grundlage für Antrag und Förderbedarf – Eigenleistungen werden nicht gefördert." },
            { icon: <PlugZap />, name: "Netzzugang beim Netzbetreiber beantragen", text: "Netzzugangsantrag und Einspeisezählpunkt beim Netzbetreiber. Bis 20 kW genügt eine Anzeige (§ 96 ElWG). Die Bestätigung der Anschlussmöglichkeit gehört zum Förderantrag." },
            { icon: <FileSignature />, name: "Genehmigungen und Anzeigen einholen", text: "Bau-, naturschutz- oder elektrizitätsrechtliche Anzeigen bzw. Bewilligungen müssen beim Antrag in erster Instanz vorliegen – welche das sind, regelt das jeweilige Bundesland." },
            { icon: <Ticket />, name: "Ticket ziehen und Förderantrag stellen", text: "Im Zeitfenster des Fördercalls elektronisch bei der EAG-Förderabwicklungsstelle. In Kategorie C und D den Förderbedarf in €/kWp angeben; fehlende Unterlagen binnen 4 Wochen nachreichen." },
            { icon: <BadgeEuro />, name: "Fördervertrag abschließen", text: "Nach positiver Entscheidung folgt der Fördervertrag. Ab jetzt läuft die Inbetriebnahmefrist: 6 Monate bis 100 kWp, 12 Monate darüber." },
            { icon: <Zap />, name: "Errichten, Fertigstellung melden, in Betrieb nehmen", text: "Montage und Prüfung nach ÖVE/ÖNORM E 8101 und EN 62446, Fertigstellungsmeldung an den Netzbetreiber, Aktivierung des Zählpunkts und Registrierung in der Herkunftsnachweisdatenbank." },
            { icon: <Receipt />, name: "Endabrechnung einreichen", text: "Spätestens 6 Monate nach Ende der Inbetriebnahmefrist mit Rechnungen und Zahlungsnachweisen (keine Barzahlung). Danach wird der Zuschuss ausbezahlt." },
          ]}
        />

        <div className="mt-14">
          <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
            <h3 className="ov-h3 text-ink-900">Die Termine, die über die Förderung entscheiden</h3>
            <p className="text-[14.5px] text-ink-600">
              Ausführlich im Ratgeber <Link href="/ratgeber/eag-investitionszuschuss" className={LINK}>EAG-Investitionszuschuss Schritt für Schritt</Link>
            </p>
          </div>
          <dl className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {EAG_IZ.fristen.map((f, i) => (
              <Reveal key={f.titel} delay={i * 70} className="relative overflow-hidden rounded-3xl bg-sand-50 p-5 ring-1 ring-ink-200/60">
                <span aria-hidden="true" className="absolute right-4 top-3 font-display text-[40px] font-extrabold leading-none text-ink-200/80">{i + 1}</span>
                <dt className="font-display text-[17px] font-bold text-ink-900">{f.titel}</dt>
                <dd className="mt-2 text-[14.5px] leading-relaxed text-ink-700">{f.text}</dd>
              </Reveal>
            ))}
          </dl>
          <Fachdetails className="mt-4" titel="Woran Anträge in der Praxis scheitern" untertitel={`${EAG_IZ.fehler.length} typische Fehler – und wie Sie sie vermeiden`}>
            <div className="grid gap-x-10 gap-y-3 lg:grid-cols-2">
              <Checkliste variante="nein" items={EAG_IZ.fehler.slice(0, 4).map((f) => ({ title: f.titel, text: f.text }))} />
              <Checkliste variante="nein" items={EAG_IZ.fehler.slice(4).map((f) => ({ title: f.titel, text: f.text }))} />
            </div>
          </Fachdetails>
        </div>
      </Section>

      {/* Marktprämie */}
      <Section tone="sand" space="md" id="marktpraemie" className="scroll-mt-24">
        <div className="grid items-center gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
          <div>
            <SectionHeading eyebrow="EAG-Marktprämie" title="Die Alternative für einspeisestarke Anlagen" lead={MARKTPRAEMIE.text} />
            <Checkliste className="mt-7" items={MARKTPRAEMIE.hinweise} />
          </div>
          <Reveal className="rounded-3xl bg-white p-6 ring-1 ring-ink-200/70 md:p-7">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p className="font-display text-[17px] font-bold text-ink-900">OeMAG-Marktpreis PV 2026</p>
              <p className="text-[13px] text-ink-500">ct/kWh, monatlich</p>
            </div>
            <ul className="mt-6 grid grid-cols-8 items-end gap-2 sm:gap-3" aria-label="OeMAG-Marktpreis PV 2026 je Monat in ct/kWh">
              {marktpreise.map((x) => (
                <li key={x.m} className="flex flex-col items-center justify-end gap-1.5">
                  <span className="ov-num text-[10.5px] font-semibold text-ink-700 sm:text-[12.5px]">{x.w}</span>
                  <span aria-hidden="true" className="w-full rounded-t-lg bg-gradient-to-t from-ov-600 to-ov-300" style={{ height: `${Math.round((x.n / mpMax) * 120)}px` }} />
                  <span aria-hidden="true" className="text-[11px] font-medium text-ink-500">{x.m.slice(0, 3)}</span>
                  <span className="sr-only">{x.m}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-[13.5px] leading-relaxed text-ink-500">
              {OEMAG_MARKTPREIS.hinweis} Wie der Wert entsteht, erklärt der Ratgeber <Link href="/ratgeber/oemag-marktpreis" className={LINK}>OeMAG-Marktpreis</Link>.
            </p>
          </Reveal>
        </div>
        <Reveal className="mt-10">
          <h3 className="font-display text-[19px] font-bold text-ink-900">Gebotstermine 2026</h3>
          <ol className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {MARKTPRAEMIE.termine.map((t) => {
              const offen = /nächster/i.test(t.status);
              return (
                <li key={t.datum} className={`rounded-3xl p-5 ring-1 ${offen ? "bg-navy-950 text-white ring-navy-950" : "bg-white ring-ink-200/70"}`}>
                  <p className={`ov-num font-display text-[24px] font-extrabold leading-none ${offen ? "text-white" : "text-ink-900"}`}>{t.datum}</p>
                  <p className={`mt-2 text-[13.5px] ${offen ? "text-white/65" : "text-ink-500"}`}>{t.volumen} · Höchstpreis {t.hoechstpreis}</p>
                  <p className={`mt-3 inline-flex rounded-full px-2.5 py-0.5 text-[12px] font-semibold ${offen ? "bg-ov-400 text-navy-950" : "bg-ink-100 text-ink-600"}`}>{t.status}</p>
                </li>
              );
            })}
          </ol>
        </Reveal>
      </Section>

      {/* Weitere Bundesprogramme */}
      <Section tone="white" space="md" id="kpc" className="scroll-mt-24">
        <SectionHeading
          eyebrow="KPC, Energiegemeinschaften, Kombination"
          title="Weitere Bundesprogramme für Betriebe und Gemeinden"
          lead="Die Umweltförderung im Inland (KPC) fördert PV nur noch in Sonderfällen wie der Insellage. Wichtiger sind 2026 Programme rund um Speicher, Energiemanagement, Wärmepumpen und Energiegemeinschaften."
          className="mb-8"
        />
        <Umschalter
          label="Weitere Bundesprogramme"
          tabs={[
            { id: "kpc", label: "KPC & Klimafonds", icon: <Leaf />, badge: KPC_PROGRAMME.length },
            { id: "eg", label: "Energiegemeinschaften", icon: <Users /> },
            { id: "kombi", label: "Kombinierbarkeit", icon: <Layers /> },
          ]}
          panels={[kpcPanel, egPanel, kombiPanel]}
        />
      </Section>

      <Section tone="sand" space="md">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <SectionHeading eyebrow="Häufige Fragen" title="Bundesförderung – kurz beantwortet" lead={`Rechtsstand ${STAND.label}. Verbindlich sind die Sonderrichtlinien und Verordnungen der Förderstellen.`} />
          <Faq items={FAQ} />
        </div>
        <Quellen klappbar className="mt-12" stand={STAND.label} quellen={[...EAG_IZ.quellen, ...MARKTPRAEMIE.quellen, OEMAG_MARKTPREIS.quelle, ...ENERGIEGEMEINSCHAFTEN.quellen, ...KPC_PROGRAMME.map((p) => ({ label: `${p.traeger} – ${p.name}`, url: p.url }))]} />
      </Section>

      <Querverweise pfad="/forderungen/bundesfoerderung" />
      <CtaBand
        eyebrow="Förderantrag ohne Fristfehler"
        title="Wir bereiten Ihren EAG-Antrag für den Oktober-Call vor."
        text="Netzbestätigung, Genehmigungsnachweise, Angebot und Förderbedarf – rechtzeitig vor dem Call. Danach planen wir die Inbetriebnahme innerhalb der Frist."
        primary={{ label: "Projekt anfragen", href: "/angebot" }}
        secondary={{ label: "Förder-Check starten", href: "/foerdercheck" }}
      />
      <Bildnachweis items={nachweise("flachdach", "spitalberg")} />
    </div>
  );
}
