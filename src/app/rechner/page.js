// src/app/rechner/page.js – Hub „Rechner & Tools"

import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import Faq from "@/components/ui/Faq";
import CtaBand from "@/components/ui/CtaBand";
import Reveal from "@/components/ui/Reveal";
import { cn } from "@/components/ui/cn";
import { TOOLS, toolById } from "@/components/Rechner/tools";
import { VorschauBalken, VorschauCheckliste, VorschauLivePreis, VorschauSchritte, VorschauSolar, VorschauSpeicher } from "@/components/Rechner/ToolVorschau";
import { rechnerMetadata } from "@/components/Rechner/RechnerSeite";
import { getEnergySnapshot, dynamischBrutto } from "@/lib/energy";
import { rechneWaermepumpe } from "@/lib/rechner/waermepumpe";
import { rechneWallbox } from "@/lib/rechner/wallbox";
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
  title: "PV-Rechner & Tools Österreich: Solar, Speicher | Ökovolt",
  description:
    "Kostenlose Rechner für Österreich: Solarrechner für Betrieb, Hof und Haus, Standort-Check, Speicher, Wärmepumpe, E-Auto und Spotpreis-Tarif mit Börsendaten.",
  keywords: ["Photovoltaik Rechner Österreich", "PV Rechner Gewerbe", "Standort-Check Schneelast", "Stromspeicher Rechner", "Wärmepumpe Rechner", "dynamischer Stromtarif Österreich"],
});

const TZ = "Europe/Vienna";
const tagVon = (t) => new Intl.DateTimeFormat("sv-SE", { timeZone: TZ }).format(new Date(t));
const uhr = (t) => new Intl.DateTimeFormat("de-DE", { hour: "2-digit", minute: "2-digit", timeZone: TZ }).format(new Date(t));

const FAQ = [
  {
    q: "Wie genau sind die Ökovolt-Rechner?",
    a: "Die Rechner liefern eine fundierte Orientierung für Österreich: Betriebe, Stromspeicher und Wärmepumpen werden stündlich über ein ganzes Jahr simuliert, der Tarifrechner nutzt echte Börsenpreise der Gebotszone Österreich. Alle Annahmen legen wir auf jeder Seite mit Quelle offen. Ein verbindliches Angebot erstellen wir nach Prüfung von Dach, Lastgang, Netzanschluss und Technik vor Ort.",
  },
  {
    q: "Welchen Rechner sollte ich zuerst nutzen?",
    a: "Planen Sie eine neue Photovoltaikanlage für Betrieb, Hof oder Haus, starten Sie mit dem Solarrechner; den Standort mit Schneelast, Hagel und Ertrag prüft der Standort-Check. Haben Sie bereits PV, zeigt der Stromspeicher-Rechner, ob sich eine Batterie lohnt. Wer die Heizung tauschen möchte, nutzt den Wärmepumpen-Rechner, E-Auto-Fahrer den Laderechner. Der Dynamischer-Tarif-Rechner lohnt sich für alle mit Smart Meter und flexiblen Verbrauchern.",
  },
  {
    q: "Kosten die Rechner etwas oder muss ich mich anmelden?",
    a: "Nein. Alle Rechner sind kostenlos, ohne Anmeldung und speichern keine Eingaben. Erst wenn Sie ein Angebot anfragen, übermitteln Sie Ihre Werte – auf Wunsch direkt aus dem Rechner.",
  },
  {
    q: "Mit welchen Preisen rechnen die Tools?",
    a: `Mit vorsichtigen, belegten Richtwerten, Stand September 2026: vermeidbarer Haushalts-Strompreis ${Math.round(ANNAHMEN.strompreis * 100)} ct/kWh, im Betrieb je nach Verbrauch netto, Einspeiseerlös ${String(VERGUETUNG.saetze[0].teileinspeisung).replace(".", ",")} ct/kWh auf Basis OeMAG-Marktpreis, Anlagen- und Speicherpreise aus der österreichischen Marktstatistik, Gas und Heizöl nach E-Control-Preismonitor und EU-Ölpreisbericht. Die meisten Werte können Sie im Rechner an Ihre Situation anpassen.`,
  },
];

export default async function RechnerHub() {
  const snap = await getEnergySnapshot();
  const erzeugung = snap.erzeugung?.zeitpunkt ? snap.erzeugung : null;
  const heute = tagVon(Date.now());
  const heutePunkte = snap.preis.punkte.filter((p) => tagVon(p.t) === heute);
  const aktuell = snap.preis.aktuell;
  const minHeute = snap.preis.heute?.min;

  // Kleine Beispielrechnungen für die Vorschauen – mit derselben Logik wie die Rechner
  const wp = rechneWaermepumpe({ flaeche: 150, standard: "1995", heizung: "gas", preis: 12, jaz: 3.5, pv: "pv", kwp: 10 });
  // Vorschau Solarrechner: Gewerbebetrieb (Zielgruppe der AT-Seite)
  const pv = solarBerechne({ kwp: 100, ausrichtung: "ost-west", neigung: "flach", verbrauch: 250000, speicherKwh: 0, zielgruppe: "gewerbe", betriebstage: 5, schichten: 1 });
  const ea = rechneWallbox({ km: 15000, verbrauch: 18, anteilZuhause: 0.8, anteilPv: 0.4, kraftstoff: "benzin" });

  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Ökovolt Rechner & Tools",
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

  const karten = [
    {
      id: "solarrechner",
      klasse: "sm:col-span-2 lg:row-span-2",
      ton: "hell",
      vorschau: (
        <div className="flex h-full flex-col gap-4">
          <dl className="grid grid-cols-3 gap-2 sm:gap-3">
            {[
              ["Jahresertrag", `${fmt(Math.round(pv.jahresertrag / 1000))} MWh`],
              ["Eigenverbrauch", `${Math.round(pv.eigenverbrauchsquote * 100)} %`],
              ["Amortisation", pv.amortisationJahre ? `${fmt(pv.amortisationJahre, 1)} J.` : "–"],
            ].map(([k, v]) => (
              <div key={k} className="rounded-2xl bg-white p-3 ring-1 ring-ink-200/70 sm:p-4">
                <dt className="text-[11.5px] text-ink-500 sm:text-[12.5px]">{k}</dt>
                <dd className="ov-num mt-0.5 whitespace-nowrap font-display text-[14px] font-extrabold tracking-tight text-ink-900 min-[400px]:text-[16px] sm:text-[22px]">{v}</dd>
              </div>
            ))}
          </dl>
          <div className="flex flex-1 flex-col justify-between gap-4 rounded-2xl bg-sand-50 p-4 ring-1 ring-ink-200/60 md:p-6">
            <p className="mb-3 text-[12.5px] text-ink-500">Beispiel Gewerbe: 100 kWp Ost-West auf dem Hallendach, 250 MWh Verbrauch, Mo–Fr eine Schicht · Ertrag je Monat</p>
            <VorschauSolar />
          </div>
        </div>
      ),
    },
    {
      id: "stromspeicher",
      klasse: "sm:col-span-2",
      ton: "hell",
      vorschau: (
        <div className="rounded-2xl bg-sand-50 p-4 ring-1 ring-ink-200/60">
          <div className="mb-2 flex items-baseline justify-between text-[12.5px] text-ink-500">
            <span>Autarkie nach Speichergröße</span>
            <span className="font-semibold text-sun-500">● Optimum</span>
          </div>
          <VorschauSpeicher />
        </div>
      ),
    },
    {
      id: "waermepumpe",
      ton: "hell",
      vorschau: (
        <VorschauBalken
          reihen={[
            { label: "Gasheizung", wert: wp.fossil.summe, anzeige: `${fmt(Math.round(wp.fossil.summe / 10) * 10)} €`, farbe: "#97a0b0" },
            { label: "Wärmepumpe + PV", wert: wp.solar.summe, anzeige: `${fmt(Math.round(wp.solar.summe / 10) * 10)} €`, farbe: "#669933" },
          ]}
        />
      ),
    },
    {
      id: "wallbox",
      ton: "hell",
      vorschau: (
        <VorschauBalken
          reihen={[
            { label: "Benziner", wert: ea.verbrenner.summe, anzeige: `${fmt(ea.verbrenner.je100, 2)} €/100 km`, farbe: "#97a0b0" },
            { label: "E-Auto + PV", wert: ea.solar.summe, anzeige: `${fmt(ea.solar.je100, 2)} €/100 km`, farbe: "#669933" },
          ]}
        />
      ),
    },
    {
      id: "dynamisch",
      klasse: "sm:col-span-2",
      ton: "dunkel",
      vorschau: (
        <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
          <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2 text-[12.5px] text-white/60">
            <span className="inline-flex items-center gap-2">
              <span className="relative flex h-2 w-2" aria-hidden="true">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ov-400 opacity-60 motion-reduce:animate-none" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-ov-400" />
              </span>
              Börsenpreis Österreich heute{aktuell ? <> · jetzt <strong className="ov-num text-white">{fmt(aktuell.eurMwh / 10, 1)} ct</strong></> : null}
            </span>
            {minHeute && (
              <span>
                Tiefstwert <strong className="ov-num text-sun-300">{uhr(minHeute.t)} Uhr</strong>
              </span>
            )}
          </div>
          <VorschauLivePreis punkte={heutePunkte} jetzt={new Date(snap.stand).getTime()} />
        </div>
      ),
    },
    {
      id: "energie-live",
      ton: "dunkel",
      vorschau: (
        <dl className="grid grid-cols-2 gap-2">
          {[
            ["Solar AT", erzeugung?.solarMw != null ? `${fmt(erzeugung.solarMw / 1000, 1)} GW` : "–", "text-sun-300"],
            ["Wasserkraft", erzeugung?.wasserMw != null ? `${fmt(erzeugung.wasserMw / 1000, 1)} GW` : "–", "text-white"],
            ["Erneuerbar", erzeugung?.eeAnteil != null ? `${fmt(erzeugung.eeAnteil)} %` : "–", "text-ov-300"],
            ["Endpreis dyn.", aktuell ? `${fmt(dynamischBrutto(aktuell.eurMwh))} ct` : "–", "text-white"],
          ].map(([k, v, farbe]) => (
            <div key={k} className="rounded-2xl bg-white/5 p-3 ring-1 ring-white/10">
              <dt className="text-[11.5px] text-white/60">{k}</dt>
              <dd className={`ov-num font-display text-[19px] font-extrabold ${farbe}`}>{v}</dd>
            </div>
          ))}
        </dl>
      ),
    },
    {
      id: "foerdercheck",
      ton: "sand",
      vorschau: <VorschauCheckliste punkte={["EAG-Investitionszuschuss", "Investitionsfreibetrag", "Landesförderungen"]} />,
    },
    {
      id: "standort-check",
      klasse: "sm:col-span-2 lg:col-span-1",
      ton: "hell",
      vorschau: <VorschauCheckliste punkte={["Schneelast sₖ (eHORA)", "Wind, Hagel & Naturgefahren", "PV-Ertrag (PVGIS)"]} />,
    },
    {
      id: "angebot",
      klasse: "sm:col-span-2 lg:col-span-3",
      ton: "gruen",
      vorschau: <VorschauSchritte />,
    },
  ];

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }} />

      <PageHero
        variant="dark"
        breadcrumbs={[{ name: "Rechner & Tools" }]}
        eyebrow="Rechner & Tools"
        title={<>Erst rechnen, <span className="ov-text-gradient-light">dann entscheiden.</span></>}
        lead="Kostenlose Werkzeuge rund um Photovoltaik für Betriebe, Landwirtschaft, Gemeinden und Private in Österreich – mit transparenten Annahmen, stündlicher Simulation, Standortdaten und Börsenpreisen der Gebotszone Österreich."
        stats={[
          { value: TOOLS.length, label: "kostenlose Tools" },
          { value: 8760, label: "Stunden je Simulation" },
          { value: 15, suffix: " min", label: "Takt der Börsenpreise" },
        ]}
        className="[&>div.ov-container]:pb-28 md:[&>div.ov-container]:pb-36"
      />

      <section aria-label="Alle Rechner und Tools" className="relative z-10 -mt-20 md:-mt-28">
        <div className="ov-container">
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
            {karten.map((k, i) => (
              <Reveal as="li" key={k.id} delay={i * 60} className={cn("flex", k.klasse)}>
                <ToolKarte tool={toolById(k.id)} ton={k.ton} gross={k.id === "solarrechner"} breit={k.id === "angebot"}>
                  {k.vorschau}
                </ToolKarte>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <Section tone="white" space="md">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <SectionHeading
            eyebrow="Wegweiser"
            title="Welcher Rechner passt zu Ihrer Frage?"
            lead="Kurz beantwortet: Wählen Sie das Werkzeug nach Ihrem Vorhaben – alle Ergebnisse lassen sich direkt in eine Angebotsanfrage übernehmen."
          />
          <Reveal className="min-w-0">
            <div tabIndex={0} role="region" aria-label="Wegweiser: Vorhaben und passender Rechner" className="overflow-x-auto rounded-3xl ring-1 ring-ink-200/70">
              <table className="w-full min-w-[520px] text-left text-[15px]">
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
                    ["PV für Betrieb, Hof oder Haus planen", "solarrechner", "Eigenverbrauch, Amortisation"],
                    ["Standort prüfen (Schnee, Hagel, Ertrag)", "standort-check", "Lasten & Naturgefahren"],
                    ["Speicher nachrüsten oder mitkaufen", "stromspeicher", "Autarkie, optimale Größe"],
                    ["Gas- oder Ölheizung ersetzen", "waermepumpe", "Heizkosten, CO₂, Förderung"],
                    ["E-Auto anschaffen", "wallbox", "Kosten je 100 km"],
                    ["Smart Meter / neuen Tarif", "dynamisch", "Tageskosten, Ladefenster"],
                    ["Förderungen & Steuervorteile klären", "foerdercheck", "passende Förderungen"],
                  ].map(([frage, id, ergebnis]) => {
                    const t = toolById(id);
                    return (
                      <tr key={id} className="bg-white">
                        <td className="px-5 py-3.5 text-ink-700">{frage}</td>
                        <td className="px-5 py-3.5">
                          <Link href={t.href} className="inline-flex items-center gap-1.5 font-semibold text-ov-700 hover:text-ov-800">
                            {t.titel} <ArrowRight aria-hidden="true" className="h-3.5 w-3.5" />
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
        secondary={{ label: "Zum Solarrechner", href: "/solarrechner" }}
      />
    </div>
  );
}

function ToolKarte({ tool, ton, gross, breit, children }) {
  const Icon = tool.icon;
  const dunkel = ton === "dunkel" || ton === "gruen";
  const toene = {
    hell: "bg-white ring-1 ring-ink-200/70 shadow-[0_24px_48px_-32px_rgba(3,18,43,0.35)] hover:ring-ov-300",
    sand: "bg-sand-50 ring-1 ring-ink-200/70 shadow-[0_24px_48px_-32px_rgba(3,18,43,0.35)] hover:ring-ov-300",
    dunkel: "ov-noise bg-navy-900 text-white ring-1 ring-white/10 shadow-[0_24px_48px_-24px_rgba(3,18,43,0.6)]",
    gruen: "bg-gradient-to-br from-ov-500 to-ov-700 text-white shadow-[0_30px_60px_-30px_rgba(67,102,33,0.7)]",
  };
  return (
    <Link
      href={tool.href}
      className={cn(
        "group ov-card-hover relative flex w-full overflow-hidden rounded-3xl p-6 md:p-7",
        breit ? "flex-col gap-6 md:flex-row md:items-center md:justify-between" : "flex-col",
        toene[ton]
      )}
    >
      <div className={cn("relative", breit && "md:max-w-md")}>
        <div className="flex items-start justify-between gap-4">
          <span className={cn("flex h-12 w-12 items-center justify-center rounded-2xl", dunkel ? "bg-white/10 text-ov-300 ring-1 ring-white/15" : "bg-ov-50 text-ov-600 ring-1 ring-ov-100", ton === "gruen" && "text-white")}>
            <Icon aria-hidden="true" className="h-6 w-6" />
          </span>
          {tool.tag && !breit && (
            <span
              className={cn(
                "rounded-full px-2.5 py-1 text-[11.5px] font-semibold",
                tool.tag === "Live" ? "bg-sun-400 text-navy-950" : dunkel ? "bg-white/10 text-white" : "bg-ink-900 text-white"
              )}
            >
              {tool.tag}
            </span>
          )}
        </div>
        <h2 className={cn("mt-5 font-display font-extrabold leading-tight tracking-tight", gross ? "text-[26px] md:text-[32px]" : "text-[20px]", dunkel ? "text-white" : "text-ink-900")}>{tool.titel}</h2>
        <p className={cn("mt-2 leading-relaxed", gross ? "text-[16px]" : "text-[14.5px]", dunkel ? "text-white/70" : "text-ink-600")}>{gross ? tool.text : tool.kurz}</p>
      </div>
      <div className={cn("relative", breit ? "md:w-[420px]" : "mt-6 flex-1", gross && "flex flex-col justify-end")}>{children}</div>
      <span
        className={cn(
          "relative inline-flex items-center gap-1.5 text-[14.5px] font-semibold",
          breit ? "shrink-0 self-start rounded-full bg-white px-5 py-3 text-ov-800 md:self-auto" : "mt-5",
          !breit && (dunkel ? "text-ov-300" : "text-ov-700")
        )}
      >
        {breit ? "Jetzt konfigurieren" : "Öffnen"}
        <ArrowUpRight aria-hidden="true" className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}
