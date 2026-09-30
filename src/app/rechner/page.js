// src/app/rechner/page.js – Hub „Rechner & Tools für Unternehmen“ (Showcase)
//
// Alle Tools kommen aus src/components/Rechner/tools.js (auch die, die parallel
// entstehen). Fehlt ein Eintrag, wird die Karte einfach übersprungen – der Hub
// stürzt nie ab. Vorschauwerte stammen aus derselben Rechenlogik wie die Rechner.

import Link from "next/link";
import { ArrowRight, ArrowUpRight, BatteryCharging, Car, Leaf, MapPinned, TrendingUp } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import SectionHeading, { Eyebrow } from "@/components/ui/SectionHeading";
import Faq from "@/components/ui/Faq";
import CtaBand from "@/components/ui/CtaBand";
import Reveal from "@/components/ui/Reveal";
import { cn } from "@/components/ui/cn";
import { KATEGORIEN, TOOLS, toolById, toolsVon } from "@/components/Rechner/tools";
import {
  VorschauBalken,
  VorschauBlackout,
  VorschauCashflow,
  VorschauCheckliste,
  VorschauFlaeche,
  VorschauFlotte,
  VorschauGemeinschaft,
  VorschauLadepunkte,
  VorschauLastspitze,
  VorschauLivePreis,
  VorschauSolar,
  VorschauSpeicher,
  VorschauStile,
} from "@/components/Rechner/ToolVorschau";
import HubKarte from "@/components/RechnerGewerbe/HubKarte";
import { standortGruppen } from "@/components/RechnerGewerbe/standorte";
import { rechnerMetadata } from "@/components/Rechner/RechnerSeite";
import { getEnergySnapshot, dynamischBrutto } from "@/lib/energy";
import { rechneWaermepumpe } from "@/lib/rechner/waermepumpe";
import { rechneWallbox } from "@/lib/rechner/wallbox";
import { rechneGewerbePv, annuitaet, kwpAusFlaeche, GEWERBE_PRESETS } from "@/lib/rechner/gewerbepv";
import { rechneCo2 } from "@/lib/rechner/co2";
import { rechnePacht } from "@/lib/rechner/pacht";
import { rechneFinanzierung, zahl as zahlFz } from "@/lib/rechner/finanzierung";
import { fmt } from "@/lib/rechner/annahmen";
import { berechne as solarBerechne } from "@/lib/solarrechner";
import { ANNAHMEN } from "@/data/solarrechner";
import { VERGUETUNG } from "@/data/einspeiseverguetung";
import { BASE_URL, FIRMA } from "@/lib/site";

export const revalidate = 900;

const PFAD = "/rechner";
const BASE = BASE_URL;

export const metadata = rechnerMetadata({
  pfad: PFAD,
  title: "Rechner & Tools für Unternehmen: PV Österreich | Ökovolt",
  description:
    "Kostenlose PV-Rechner für Betriebe in Österreich: Gewerbe-PV mit IRR, Peak Shaving, Speicher, E-Flotte, Energiegemeinschaft, CO₂/Scope 2, Pacht und Förderung.",
  keywords: ["Photovoltaik Rechner Österreich", "PV Rechner Gewerbe", "Peak Shaving Rechner", "Scope 2 Rechner", "Freiflächen Pacht Rechner", "Energiegemeinschaft Rechner", "Stromspeicher Rechner"],
});

const TZ = "Europe/Vienna";
const tagVon = (t) => new Intl.DateTimeFormat("sv-SE", { timeZone: TZ }).format(new Date(t));
const uhr = (t) => new Intl.DateTimeFormat("de-DE", { hour: "2-digit", minute: "2-digit", timeZone: TZ }).format(new Date(t));
const eur = (n) => `${fmt(Math.round(n))} €`;
const tsd = (n) => (Math.abs(n) >= 1e6 ? `${fmt(n / 1e6, 1)} Mio. €` : `${fmt(Math.round(n / 1000))} T€`);

const KAT_ICON = { wirtschaftlichkeit: TrendingUp, "speicher-netz": BatteryCharging, mobilitaet: Car, "standort-foerderung": MapPinned, esg: Leaf };

const FAQ = [
  {
    q: "Welchen Rechner sollte ich als Betrieb zuerst nutzen?",
    a: "Planen Sie Photovoltaik auf einer Halle oder einem Betriebsgebäude, starten Sie mit dem Gewerbe-PV-Rechner: Er zeigt Eigenverbrauch, Amortisation, Rendite, EAG-Zuschuss und Investitionsfreibetrag. Zahlen Sie einen hohen Leistungspreis, prüft der Peak-Shaving-Rechner einen Gewerbespeicher. Für Klimabilanz und Bankgespräche liefert der CO₂- & ESG-Rechner die Scope-2-Werte, für Grundeigentümer der Freiflächen- & Pacht-Rechner die mögliche Leistung ihrer Fläche.",
  },
  {
    q: "Wie genau sind die Ökovolt-Rechner?",
    a: "Die Rechner liefern eine fundierte Orientierung für Österreich: Betriebe, Stromspeicher und Wärmepumpen werden stündlich über ein ganzes Jahr simuliert, der Ertrag kommt aus PVGIS-Daten für 37 Orte, der Tarifrechner nutzt echte Börsenpreise der Gebotszone Österreich. Alle Annahmen legen wir auf jeder Seite mit Quelle offen. Ein verbindliches Angebot erstellen wir nach Prüfung von Dach, Lastgang, Netzanschluss und Technik vor Ort.",
  },
  {
    q: "Kosten die Rechner etwas oder muss ich mich anmelden?",
    a: "Nein. Alle Rechner sind kostenlos, ohne Anmeldung und speichern keine Eingaben. Erst wenn Sie ein Angebot anfragen, übermitteln Sie Ihre Werte – auf Wunsch direkt aus dem Rechner.",
  },
  {
    q: "Mit welchen Preisen rechnen die Tools?",
    a: `Mit vorsichtigen, belegten Richtwerten, Stand September 2026: im Betrieb mit dem vermeidbaren Arbeitspreis netto nach Verbrauchsklasse (Eurostat), privat mit ${Math.round(ANNAHMEN.strompreis * 100)} ct/kWh brutto, Einspeiseerlös ${String(VERGUETUNG.saetze[0].teileinspeisung).replace(".", ",")} ct/kWh auf Basis OeMAG-Marktpreis, Anlagen- und Speicherpreise aus der österreichischen Marktstatistik. Die meisten Werte können Sie im Rechner an Ihre Situation anpassen.`,
  },
];

// Kleine Beispielrechnungen – mit derselben Logik wie die Rechner
function beispiele() {
  const orte = standortGruppen().flatMap((g) => g.orte);
  const linz = orte.find((o) => o.slug === "linz") || orte[0];
  const stp = orte.find((o) => o.slug === "st-poelten") || orte[0];
  const p = GEWERBE_PRESETS[0];
  const gewerbe = rechneGewerbePv({
    kwp: Math.round(kwpAusFlaeche(p.flaeche, p.dachart) / 5) * 5,
    dachart: p.dachart,
    standort: linz,
    verbrauchKwh: p.verbrauch,
    typ: p.typ,
    betriebstage: p.betriebstage,
    schichten: p.schichten,
    eag: true,
    ifb: true,
    profil: false,
  });
  const co2 = rechneCo2({ strombezugKwh: 1500000, marktFaktorG: 150, pv: { kwp: 800, ertragProKwp: 1000, eigenverbrauchsquote: 0.7 } });
  const pacht = rechnePacht({ hektar: 10, standort: stp, konzept: "freiflaeche" });
  const solar = solarBerechne({ kwp: 100, ausrichtung: "ost-west", neigung: "flach", verbrauch: 250000, speicherKwh: 0, zielgruppe: "gewerbe", betriebstage: 5, schichten: 1 });
  const wp = rechneWaermepumpe({ flaeche: 150, standard: "1995", heizung: "gas", preis: 12, jaz: 3.5, pv: "pv", kwp: 10 });
  const ea = rechneWallbox({ km: 15000, verbrauch: 18, anteilZuhause: 0.8, anteilPv: 0.4, kraftstoff: "benzin" });
  const rate = annuitaet(gewerbe.investition, 0.05, 10);
  const fin = rechneFinanzierung();
  return { gewerbe, co2, pacht, solar, wp, ea, rate, linz, fin };
}

async function liveDaten() {
  try {
    const snap = await getEnergySnapshot();
    const heute = tagVon(Date.now());
    return {
      punkte: snap.preis.punkte.filter((p) => tagVon(p.t) === heute),
      aktuell: snap.preis.aktuell,
      stat: snap.preis.heute,
      erzeugung: snap.erzeugung?.zeitpunkt ? snap.erzeugung : null,
      jetzt: new Date(snap.stand).getTime(),
    };
  } catch {
    return { punkte: [], aktuell: null, stat: null, erzeugung: null, jetzt: null };
  }
}

export default async function RechnerHub() {
  const live = await liveDaten();
  const b = beispiele();
  const anzahl = TOOLS.filter((t) => t.kategorie !== "start").length;

  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Ökovolt Rechner & Tools für Unternehmen",
    url: `${BASE}${PFAD}`,
    numberOfItems: TOOLS.length,
    itemListElement: TOOLS.map((t, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${BASE}${t.href}`,
      name: t.titel,
      description: t.text,
    })),
  };

  // Vorschau je Tool (fehlt eine, zeigt die Karte nur Text)
  const vorschau = {
    "gewerbe-pv": (
      <div className="rounded-2xl bg-sand-50 p-4 ring-1 ring-ink-200/60 md:p-5">
        <dl className="mb-4 grid grid-cols-3 gap-2">
          {[
            ["Eigenverbrauch", `${fmt(b.gewerbe.eigenverbrauchsquote * 100)} %`],
            ["Amortisation", b.gewerbe.amortisation != null ? `${fmt(b.gewerbe.amortisation, 1)} J.` : "–"],
            ["Rendite (IRR)", b.gewerbe.irr != null ? `${fmt(b.gewerbe.irr * 100, 1)} %` : "–"],
          ].map(([kk, v]) => (
            <div key={kk} className="rounded-xl bg-white p-2.5 ring-1 ring-ink-200/70 sm:p-3">
              <dt className="text-[11.5px] leading-tight text-ink-500 [hyphens:auto]" lang="de">{kk}</dt>
              <dd className="ov-num mt-0.5 whitespace-nowrap font-display text-[16px] font-extrabold tracking-tight text-ink-900 sm:text-[20px]">{v}</dd>
            </div>
          ))}
        </dl>
        <p className="mb-3 flex flex-wrap justify-between gap-2 text-[12.5px] text-ink-500">
          <span>
            Beispiel Logistikhalle, {fmt(b.gewerbe.kwp)} kWp in {b.linz.name} · kumulierter Cashflow 25 Jahre
          </span>
          <span className="ov-num font-semibold text-ov-700">+{tsd(b.gewerbe.summe)}</span>
        </p>
        <VorschauCashflow reihe={b.gewerbe.cashflow} />
      </div>
    ),
    solarrechner: <VorschauSolar />,
    "freiflaeche-pacht": (
      <div>
        <VorschauFlaeche />
        <p className="mt-3 text-[12.5px] leading-relaxed text-ink-500">
          Beispiel 10 ha Freifläche: <strong className="ov-num text-ink-800">{fmt(b.pacht.kwp / 1000, 1)} MWp</strong>, rechnerisch{" "}
          <strong className="ov-num text-ink-800">{fmt(Math.round(b.pacht.haushalte / 100) * 100)} Haushalte</strong>
        </p>
      </div>
    ),
    finanzierung: (
      <VorschauBalken
        reihen={[
          { label: "Vorteil Jahr 1 (Beispiel)", wert: b.gewerbe.nutzenJahr1, anzeige: eur(Math.round(b.gewerbe.nutzenJahr1 / 100) * 100), farbe: "#669933" },
          { label: "Rate 5 % / 10 J. (angenommen)", wert: b.rate, anzeige: eur(Math.round(b.rate / 100) * 100), farbe: "#97a0b0" },
        ]}
      />
    ),
    finanzierungsvergleich: (
      <div>
        <VorschauBalken
          reihen={b.fin.modelle.map((m) => ({
            label: m.name,
            wert: Math.max(m.barwert, 0),
            anzeige: `${zahlFz(Math.round(m.barwert / 1000))} T€`,
            farbe: m.farbe,
          }))}
        />
        <p className="mt-3 text-[12.5px] leading-relaxed text-ink-500">
          Barwert über 20 Jahre, Beispiel {zahlFz(b.fin.basis.kwp)} kWp · Konditionen sind Beispielwerte
        </p>
      </div>
    ),
    "lastgang-analyse": <VorschauCheckliste punkte={["Lastprofil & Grundlast", "Spitzen & Peak-Shaving-Speicher", "PV-Größe für hohen Eigenverbrauch"]} />,
    "pv-prognose": <VorschauCheckliste punkte={["Stündlich für 60 Stunden", "Unsicherheitsband", "Goldene Stunden nach Börsenpreis"]} />,
    schneelast: <VorschauCheckliste punkte={["Richtwert sₖ je Ort", "Dachlast-Beispiel", "Passende Modulklasse"]} />,
    "flaechen-check": <VorschauCheckliste punkte={["Widmung je Bundesland", "Größe, Netz & Hang", "Pachtspanne & Checkliste"]} />,
    waermepumpe: (
      <VorschauBalken
        reihen={[
          { label: "Gasheizung", wert: b.wp.fossil.summe, anzeige: `${fmt(Math.round(b.wp.fossil.summe / 10) * 10)} €`, farbe: "#97a0b0" },
          { label: "Wärmepumpe + PV", wert: b.wp.solar.summe, anzeige: `${fmt(Math.round(b.wp.solar.summe / 10) * 10)} €`, farbe: "#669933" },
        ]}
      />
    ),
    "peak-shaving": <VorschauLastspitze />,
    stromspeicher: <VorschauSpeicher dunkel />,
    energiegemeinschaft: <VorschauGemeinschaft />,
    blackout: <VorschauBlackout />,
    "energie-live": (
      <dl className="grid grid-cols-2 gap-2">
        {[
          ["Solar AT jetzt", live.erzeugung?.solarMw != null ? `${fmt(live.erzeugung.solarMw / 1000, 1)} GW` : "–", "text-sun-300"],
          ["Erneuerbar", live.erzeugung?.eeAnteil != null ? `${fmt(live.erzeugung.eeAnteil)} %` : "–", "text-ov-300"],
        ].map(([kk, v, farbe]) => (
          <div key={kk} className="rounded-2xl bg-white/5 p-3 ring-1 ring-white/10">
            <dt className="text-[11.5px] text-white/60">{kk}</dt>
            <dd className={`ov-num font-display text-[19px] font-extrabold ${farbe}`}>{v}</dd>
          </div>
        ))}
      </dl>
    ),
    "e-flotte": <VorschauFlotte />,
    ladeinfrastruktur: <VorschauLadepunkte />,
    wallbox: (
      <VorschauBalken
        reihen={[
          { label: "Benziner", wert: b.ea.verbrenner.summe, anzeige: `${fmt(b.ea.verbrenner.je100, 2)} €/100 km`, farbe: "#97a0b0" },
          { label: "E-Auto + PV", wert: b.ea.solar.summe, anzeige: `${fmt(b.ea.solar.je100, 2)} €/100 km`, farbe: "#669933" },
        ]}
      />
    ),
    "standort-check": <VorschauCheckliste punkte={["Schneelast sₖ (eHORA)", "Wind, Hagel & Naturgefahren", "PV-Ertrag (PVGIS)"]} />,
    foerdercheck: <VorschauCheckliste punkte={["EAG-Investitionszuschuss", "Investitionsfreibetrag", "Landesförderungen"]} />,
    ifb: (
      <VorschauBalken
        reihen={[
          { label: `IFB ${fmt(ANNAHMEN.ifb.satzOeko * 100)} % (Beispiel Halle)`, wert: b.gewerbe.ifb.betrag, anzeige: eur(Math.round(b.gewerbe.ifb.betrag / 100) * 100), farbe: "#669933" },
          { label: `Steuerersparnis (${fmt(ANNAHMEN.ifb.koest * 100)} % KöSt)`, wert: b.gewerbe.ifb.steuereffekt, anzeige: eur(Math.round(b.gewerbe.ifb.steuereffekt / 100) * 100), farbe: "#f5a70f" },
        ]}
      />
    ),
    "co2-esg": <Scope2Vorschau r={b.co2} />,
  };

  const karte = (id, props = {}) => {
    const tool = toolById(id);
    if (!tool) return null;
    return (
      <HubKarte tool={tool} {...props}>
        {vorschau[id]}
      </HubKarte>
    );
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }} />
      <VorschauStile />

      <PageHero
        variant="dark"
        breadcrumbs={[{ name: "Rechner & Tools" }]}
        eyebrow="Rechner & Tools für Unternehmen"
        title={
          <>
            Erst rechnen, <span className="ov-text-gradient-light">dann investieren.</span>
          </>
        }
        lead="Kostenlose Werkzeuge für Betriebe, Landwirtschaft und Gemeinden in Österreich: Hallendach, Lastspitzen, Speicher, E-Flotte, Energiegemeinschaft, Klimabilanz und Pacht – stündlich simuliert, mit Standortdaten, Börsenpreisen und offenen Quellen."
        actions={[
          { label: "Gewerbe-PV-Rechner starten", href: "/rechner/gewerbe-pv" },
          { label: "Alle Tools ansehen", href: "#wirtschaftlichkeit" },
        ]}
        stats={[
          { value: anzahl, label: "kostenlose Rechner & Tools" },
          { value: 8760, label: "Stunden je Simulation" },
          { value: 37, label: "Orte mit PVGIS-Ertrag" },
        ]}
      >
        <nav
          aria-label="Kategorien"
          className="ov-hero-in mt-12 xl:absolute xl:right-[max(2rem,calc((100vw-80rem)/2+2rem))] xl:top-1/2 xl:mt-0 xl:w-[390px] xl:-translate-y-1/2"
          style={{ "--ov-delay": "300ms" }}
        >
          <div className="ov-glass rounded-3xl p-3 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.6)]">
            <p className="px-3 pb-2 pt-2 text-[11.5px] font-semibold uppercase tracking-[0.16em] text-white/55">Direkt zur Kategorie</p>
            <ul className="grid gap-1 sm:grid-cols-2 xl:grid-cols-1">
              {KATEGORIEN.map((kat) => {
                const Icon = KAT_ICON[kat.id];
                const n = toolsVon(kat.id).length;
                return (
                  <li key={kat.id}>
                    <a href={`#${kat.id}`} className="group flex min-h-14 items-center gap-3 rounded-2xl px-3 py-2.5 transition-colors hover:bg-white/10">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-ov-300 ring-1 ring-white/15 transition-colors group-hover:bg-ov-500 group-hover:text-white">
                        <Icon aria-hidden="true" className="h-5 w-5" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block font-display text-[15.5px] font-bold text-white">{kat.titel}</span>
                        <span className="block text-[12.5px] text-white/55">
                          {n} {n === 1 ? "Tool" : "Tools"}
                        </span>
                      </span>
                      <ArrowRight aria-hidden="true" className="h-4 w-4 text-white/40 transition-transform group-hover:translate-x-0.5 group-hover:text-white" />
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>
      </PageHero>

      {/* 01 Wirtschaftlichkeit */}
      <KategorieSektion id="wirtschaftlichkeit" nr="01" tone="white">
        <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          <Reveal as="li" className="flex md:col-span-2">{karte("gewerbe-pv", { form: "breit" })}</Reveal>
          <Reveal as="li" delay={80} className="flex">{karte("solarrechner")}</Reveal>
          <Reveal as="li" delay={60} className="flex">{karte("freiflaeche-pacht", { ton: "sand" })}</Reveal>
          <Reveal as="li" delay={120} className="flex md:col-span-2">{karte("finanzierungsvergleich", { form: "breit" })}</Reveal>
          <Reveal as="li" delay={60} className="flex">{karte("finanzierung")}</Reveal>
          <Reveal as="li" delay={120} className="flex lg:col-span-2">{karte("waermepumpe", { ton: "sand" })}</Reveal>
        </ul>
      </KategorieSektion>

      {/* 02 Speicher & Netz – dunkle Kontrast-Sektion mit Live-Strompreis */}
      <KategorieSektion id="speicher-netz" nr="02" tone="navy">
        <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          <Reveal as="li" className="flex md:col-span-2">{karte("peak-shaving", { ton: "glas", form: "breit" })}</Reveal>
          <Reveal as="li" delay={80} className="flex">{karte("stromspeicher", { ton: "glas" })}</Reveal>
          <Reveal as="li" delay={60} className="flex">{karte("energiegemeinschaft", { ton: "glas" })}</Reveal>
          <Reveal as="li" delay={120} className="flex">{karte("blackout", { ton: "glas" })}</Reveal>
          <Reveal as="li" delay={180} className="flex">{karte("energie-live", { ton: "glas", mobilVorschau: true })}</Reveal>
          <Reveal as="li" delay={60} className="flex md:col-span-2">{karte("lastgang-analyse", { ton: "glas", form: "breit" })}</Reveal>
          <Reveal as="li" delay={120} className="flex md:col-span-2 lg:col-span-1">{karte("pv-prognose", { ton: "glas" })}</Reveal>
          <Reveal as="li" delay={100} className="md:col-span-2 lg:col-span-3">
            <LiveKachel tool={toolById("dynamisch")} live={live} />
          </Reveal>
        </ul>
      </KategorieSektion>

      {/* 03 Mobilität */}
      <KategorieSektion id="mobilitaet" nr="03" tone="sand">
        <ul className="grid gap-4 md:grid-cols-3 lg:gap-5">
          <Reveal as="li" className="flex">{karte("e-flotte")}</Reveal>
          <Reveal as="li" delay={80} className="flex">{karte("ladeinfrastruktur")}</Reveal>
          <Reveal as="li" delay={160} className="flex">{karte("wallbox")}</Reveal>
        </ul>
      </KategorieSektion>

      {/* 04 Standort & Förderung */}
      <KategorieSektion id="standort-foerderung" nr="04" tone="white">
        <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          <Reveal as="li" className="flex">{karte("standort-check", { ton: "sand" })}</Reveal>
          <Reveal as="li" delay={80} className="flex">{karte("schneelast", { ton: "sand" })}</Reveal>
          <Reveal as="li" delay={160} className="flex">{karte("flaechen-check", { ton: "sand" })}</Reveal>
          <Reveal as="li" delay={60} className="flex">{karte("foerdercheck", { ton: "sand" })}</Reveal>
          <Reveal as="li" delay={120} className="flex md:col-span-2">{karte("ifb", { ton: "sand", form: "breit" })}</Reveal>
        </ul>
      </KategorieSektion>

      {/* 05 ESG */}
      <KategorieSektion id="esg" nr="05" tone="green">
        <Reveal className="flex">{karte("co2-esg", { form: "breit" })}</Reveal>
      </KategorieSektion>

      <Section tone="white" space="md">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <SectionHeading eyebrow="Wegweiser" title="Welcher Rechner passt zu Ihrer Frage?" lead="Kurz beantwortet: Wählen Sie das Werkzeug nach Ihrem Vorhaben – die Ergebnisse lassen sich direkt in eine Anfrage übernehmen.">
            <Link href="/angebot" className="mt-6 inline-flex items-center gap-1.5 text-[15px] font-semibold text-ov-700 hover:text-ov-800">
              Oder gleich zum Angebots-Konfigurator <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          </SectionHeading>
          <Reveal className="min-w-0">
            <div tabIndex={0} role="region" aria-label="Wegweiser: Vorhaben und passender Rechner" className="overflow-x-auto rounded-3xl ring-1 ring-ink-200/70">
              <table className="w-full min-w-[560px] text-left text-[15px]">
                <caption className="sr-only">Wegweiser: Vorhaben und passender Rechner</caption>
                <thead className="bg-sand-50 text-[12.5px] uppercase tracking-[0.12em] text-ink-600">
                  <tr>
                    <th scope="col" className="px-5 py-3.5 font-semibold">Ihr Vorhaben</th>
                    <th scope="col" className="px-5 py-3.5 font-semibold">Passender Rechner</th>
                    <th scope="col" className="px-5 py-3.5 font-semibold">Ergebnis</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-100">
                  {[
                    ["PV auf Halle oder Betriebsgebäude", "gewerbe-pv", "Eigenverbrauch, IRR, Förderung"],
                    ["PV finanzieren: kaufen, leasen oder Strom kaufen?", "finanzierungsvergleich", "Barwert je Modell"],
                    ["Leistungspreis senken", "peak-shaving", "Speichergröße, Ersparnis"],
                    ["Eigenen Lastgang (15-Minuten-Werte) auswerten", "lastgang-analyse", "Grundlast, Spitzen, PV-Größe"],
                    ["Klimabilanz für Bericht oder Bank", "co2-esg", "Scope 2 vorher/nachher"],
                    ["Fläche verpachten oder Solarpark", "freiflaeche-pacht", "MWp, Ertrag, Pacht"],
                    ["Eignet sich meine Fläche für einen Solarpark?", "flaechen-check", "Ampel, Pacht, Checkliste"],
                    ["Strom mit Nachbarn teilen", "energiegemeinschaft", "Netzentgelt-Vorteil"],
                    ["Fuhrpark elektrifizieren", "e-flotte", "Kosten und CO₂"],
                    ["Ladepunkte am Firmenparkplatz", "ladeinfrastruktur", "Anzahl, Leistung, Netz"],
                    ["Betrieb gegen Stromausfall absichern", "blackout", "Ausfallkosten, Ersatzstrom"],
                    ["Standort prüfen (Schnee, Hagel, Ertrag)", "standort-check", "Lasten & Naturgefahren"],
                    ["Förderungen & Steuervorteile klären", "foerdercheck", "passende Programme"],
                  ].map(([frage, id, ergebnis]) => {
                    const t = toolById(id);
                    if (!t) return null;
                    return (
                      <tr key={id} className="bg-white">
                        <td className="px-5 py-3.5 text-ink-700">{frage}</td>
                        <td className="px-5 py-3.5">
                          <Link href={t.href} className="inline-flex items-center gap-1.5 font-semibold text-ov-700 hover:text-ov-800">
                            {t.titel} <ArrowRight aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
                          </Link>
                        </td>
                        <td className="px-5 py-3.5 text-ink-500">{ergebnis}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Reveal>
        </div>
      </Section>

      <Section tone="sand" space="md">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <SectionHeading eyebrow="Häufige Fragen" title="Rechner & Tools – gut zu wissen" lead="Transparent, kostenlos und ohne Anmeldung." />
          <Faq items={FAQ} />
        </div>
      </Section>

      <CtaBand
        title="Aus Zahlen wird ein Plan – mit Ihrem Fachbetrieb."
        text={`Sie haben gerechnet – wir prüfen Dach, Lastgang, Netzanschluss und Technik und machen daraus ein belastbares Angebot. Persönlich, aus ${FIRMA.ort}, für ganz Österreich – seit ${FIRMA.gegruendet}.`}
        primary={{ label: "Angebot anfragen", href: "/angebot" }}
        secondary={{ label: "Zum Gewerbe-PV-Rechner", href: "/rechner/gewerbe-pv" }}
      />
    </div>
  );
}

function KategorieSektion({ id, nr, tone, children }) {
  const kat = KATEGORIEN.find((x) => x.id === id);
  const dunkel = tone === "navy";
  const n = toolsVon(id).length;
  return (
    <Section id={id} tone={tone} space="md" className={cn("scroll-mt-24 overflow-hidden", dunkel && "ov-noise")}>
      {dunkel && (
        <>
          <div aria-hidden="true" className="ov-grid-bg pointer-events-none absolute inset-0" />
          <div aria-hidden="true" className="pointer-events-none absolute -left-40 top-1/4 h-[460px] w-[460px] rounded-full bg-ov-500/20 blur-[120px]" />
          <div aria-hidden="true" className="pointer-events-none absolute -right-32 bottom-0 h-[420px] w-[420px] rounded-full bg-navy-400/25 blur-[120px]" />
        </>
      )}
      <Reveal className="relative mb-10 max-w-2xl md:mb-12">
        <Eyebrow dark={dunkel} className="mb-4">
          {nr} · {n} {n === 1 ? "Tool" : "Tools"}
        </Eyebrow>
        <h2 className={cn("ov-h2", dunkel ? "text-white" : "text-ink-900")}>{kat.titel}</h2>
        <p className={cn("ov-lead mt-4", dunkel ? "text-white/70" : "text-ink-600")}>{kat.text}</p>
      </Reveal>
      <div className="relative">{children}</div>
    </Section>
  );
}

/** Große Live-Kachel: Börsenstrompreis Österreich heute + Dynamischer-Tarif-Rechner */
function LiveKachel({ tool, live }) {
  if (!tool) return null;
  const { aktuell, stat, punkte, jetzt } = live;
  const Icon = tool.icon;
  return (
    <Link href={tool.href} className="group ov-card-hover relative block overflow-hidden rounded-3xl bg-white p-6 text-ink-900 shadow-[0_40px_80px_-40px_rgba(0,0,0,0.6)] md:p-8">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.6fr)] lg:items-center lg:gap-12">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-ov-50 text-ov-600 ring-1 ring-ov-100">
              <Icon aria-hidden="true" className="h-6 w-6" />
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-sun-400 px-3 py-1 text-[12px] font-semibold text-navy-950">
              <span className="relative flex h-2 w-2" aria-hidden="true">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-navy-950 opacity-40 motion-reduce:animate-none" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-navy-950" />
              </span>
              Live · Gebotszone Österreich
            </span>
          </div>
          <h3 className="mt-5 font-display text-[24px] font-extrabold leading-tight tracking-tight md:text-[30px]">Börsenstrompreis jetzt</h3>
          <p className="mt-3 flex flex-wrap items-baseline gap-x-2">
            <span className="ov-num font-display text-[clamp(2.4rem,2rem+1.5vw,3.4rem)] font-extrabold leading-none tracking-tight">{aktuell ? fmt(aktuell.eurMwh / 10, 1) : "–"}</span>
            <span className="text-[15px] font-semibold text-ink-500">ct/kWh netto</span>
          </p>
          <dl className="mt-5 grid grid-cols-3 gap-2">
            {[
              ["Tiefstwert heute", stat?.min ? `${fmt(stat.min.eurMwh / 10, 1)} ct` : "–", stat?.min ? `${uhr(stat.min.t)} Uhr` : ""],
              ["Höchstwert heute", stat?.max ? `${fmt(stat.max.eurMwh / 10, 1)} ct` : "–", stat?.max ? `${uhr(stat.max.t)} Uhr` : ""],
              ["Endpreis dyn.", aktuell ? `${fmt(dynamischBrutto(aktuell.eurMwh))} ct` : "–", "brutto, Beispiel"],
            ].map(([kk, v, z]) => (
              <div key={kk} className="rounded-2xl bg-sand-50 p-3 ring-1 ring-ink-200/60">
                <dt className="text-[11.5px] leading-tight text-ink-500">{kk}</dt>
                <dd className="ov-num mt-1 whitespace-nowrap font-display text-[16px] font-extrabold md:text-[18px]">{v}</dd>
                <dd className="text-[11.5px] text-ink-500">{z}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="min-w-0">
          <div className="rounded-2xl bg-navy-950 p-4 md:p-5">
            <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2 text-[12.5px] text-white/60">
              <span>Day-Ahead heute, 15-Minuten-Werte</span>
              <span className="inline-flex items-center gap-3">
                <span className="inline-flex items-center gap-1.5">
                  <span aria-hidden="true" className="w-3 border-t-2 border-dashed border-sun-300" />
                  Tiefstwert
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span aria-hidden="true" className="h-3 w-0.5 bg-white" />
                  jetzt
                </span>
              </span>
            </div>
            <VorschauLivePreis punkte={punkte} jetzt={jetzt} hoehe={150} />
          </div>
          <p className="mt-4 flex flex-wrap items-center justify-between gap-3 text-[14px] text-ink-600">
            <span className="max-w-lg">{tool.text}</span>
            <span className="inline-flex items-center gap-1.5 font-semibold text-ov-700">
              {tool.titel} öffnen
              <ArrowUpRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </span>
          </p>
        </div>
      </div>
    </Link>
  );
}

/** Scope-2-Vorschau: echte Beispielrechnung des CO₂-Rechners */
function Scope2Vorschau({ r }) {
  const t = (kg) => fmt(kg / 1000);
  return (
    <div className="rounded-2xl bg-ov-50/70 p-4 ring-1 ring-ov-100 md:p-5">
      <p className="mb-4 text-[12.5px] text-ink-500">Beispiel Produktion 1,5 GWh mit 800 kWp PV und 70 % Eigenverbrauch · t CO₂e pro Jahr</p>
      <VorschauBalken
        reihen={[
          { label: "Standortbasiert vorher", wert: r.scope2.location.vorher, anzeige: `${t(r.scope2.location.vorher)} t`, farbe: "#97a0b0" },
          { label: "Standortbasiert nachher", wert: r.scope2.location.nachher, anzeige: `${t(r.scope2.location.nachher)} t · −${fmt(r.scope2.location.reduktion * 100)} %`, farbe: "#669933" },
          { label: "Marktbasiert vorher", wert: r.scope2.market.vorher, anzeige: `${t(r.scope2.market.vorher)} t`, farbe: "#97a0b0" },
          { label: "Marktbasiert nachher", wert: r.scope2.market.nachher, anzeige: `${t(r.scope2.market.nachher)} t · −${fmt(r.scope2.market.reduktion * 100)} %`, farbe: "#669933" },
        ]}
      />
      <p className="mt-4 rounded-xl bg-white px-3.5 py-3 text-[12.5px] leading-relaxed text-ink-600 ring-1 ring-ink-200/70">
        <span className="font-semibold text-ink-800">Textbaustein inklusive:</span> „… sinken die Scope-2-Emissionen rechnerisch auf {t(r.scope2.location.nachher)} t CO₂e standortbasiert …“
      </p>
    </div>
  );
}
