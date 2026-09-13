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

export const revalidate = 900;

const PFAD = "/rechner";
const BASE = "https://www.oekovolt.de";

export const metadata = rechnerMetadata({
  pfad: PFAD,
  title: "Rechner & Tools für PV, Speicher & Wärmepumpe | Ökovolt",
  description:
    "Kostenlose Energie-Rechner 2026: Solar, Stromspeicher, Wärmepumpe, E-Auto und dynamischer Stromtarif mit Live-Börsenpreisen. Jetzt in Sekunden durchrechnen.",
  keywords: ["Photovoltaik Rechner", "Energie Rechner", "Stromspeicher Rechner", "Wärmepumpe Rechner", "Wallbox Rechner", "dynamischer Stromtarif Rechner"],
});

const TZ = "Europe/Berlin";
const tagVon = (t) => new Intl.DateTimeFormat("sv-SE", { timeZone: TZ }).format(new Date(t));
const uhr = (t) => new Intl.DateTimeFormat("de-DE", { hour: "2-digit", minute: "2-digit", timeZone: TZ }).format(new Date(t));

const FAQ = [
  {
    q: "Wie genau sind die Ökovolt-Rechner?",
    a: "Die Rechner liefern eine fundierte Orientierung: Stromspeicher und Wärmepumpe werden stündlich über ein ganzes Jahr simuliert, der Tarifrechner nutzt echte Börsenpreise. Alle Annahmen legen wir auf jeder Seite offen. Ein verbindliches Angebot erstellen wir nach Prüfung Ihres Dachs, Ihres Verbrauchs und Ihrer Technik vor Ort.",
  },
  {
    q: "Welchen Rechner sollte ich zuerst nutzen?",
    a: "Planen Sie eine neue Photovoltaikanlage, starten Sie mit dem Solarrechner. Haben Sie bereits PV, zeigt der Stromspeicher-Rechner, ob sich eine Batterie lohnt. Wer die Heizung tauschen möchte, nutzt den Wärmepumpen-Rechner; E-Auto-Fahrer den Laderechner. Der Dynamischer-Tarif-Rechner lohnt sich für alle mit Smart Meter und flexiblen Verbrauchern.",
  },
  {
    q: "Kosten die Rechner etwas oder muss ich mich anmelden?",
    a: "Nein. Alle Rechner sind kostenlos, ohne Anmeldung und speichern keine Eingaben. Erst wenn Sie ein Angebot anfragen, übermitteln Sie Ihre Werte – auf Wunsch direkt aus dem Rechner.",
  },
  {
    q: "Mit welchen Preisen rechnen die Tools?",
    a: "Mit vorsichtigen Richtwerten, Stand September 2026: Netzstrom 33 ct/kWh, EEG-Vergütung nach aktuellem Satz, Speicher rund 450 €/kWh, Gas und Heizöl nach aktuellem Marktschnitt. Die meisten Werte können Sie im Rechner an Ihre eigene Situation anpassen.",
  },
];

export default async function RechnerHub() {
  const snap = await getEnergySnapshot();
  const heute = tagVon(Date.now());
  const heutePunkte = snap.preis.punkte.filter((p) => tagVon(p.t) === heute);
  const aktuell = snap.preis.aktuell;
  const minHeute = snap.preis.heute?.min;

  // Kleine Beispielrechnungen für die Vorschauen – mit derselben Logik wie die Rechner
  const wp = rechneWaermepumpe({ flaeche: 150, standard: "1995", heizung: "gas", preis: 11.5, jaz: 3.5, pv: "pv", kwp: 10 });
  const pv = solarBerechne({ kwp: 10, ausrichtung: "sued", neigung: "mittel", verbrauch: 4500, speicherKwh: 8 });
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
              ["Jahresertrag", `${fmt(Math.round(pv.jahresertrag / 100) * 100)} kWh`],
              ["Autarkie", `${Math.round(pv.autarkie * 100)} %`],
              ["Amortisation", pv.amortisationJahre ? `${fmt(pv.amortisationJahre, 1)} J.` : "–"],
            ].map(([k, v]) => (
              <div key={k} className="rounded-2xl bg-white p-3 ring-1 ring-ink-200/70 sm:p-4">
                <dt className="text-[11.5px] text-ink-500 sm:text-[12.5px]">{k}</dt>
                <dd className="ov-num mt-0.5 whitespace-nowrap font-display text-[14px] font-extrabold tracking-tight text-ink-900 min-[400px]:text-[16px] sm:text-[22px]">{v}</dd>
              </div>
            ))}
          </dl>
          <div className="flex flex-1 flex-col justify-between gap-4 rounded-2xl bg-sand-50 p-4 ring-1 ring-ink-200/60 md:p-6">
            <p className="mb-3 text-[12.5px] text-ink-500">Beispiel: 10 kWp, Süddach, 4.500 kWh Verbrauch, 8 kWh Speicher · Ertrag je Monat</p>
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
              Börsenpreis heute{aktuell ? <> · jetzt <strong className="ov-num text-white">{fmt(aktuell.eurMwh / 10, 1)} ct</strong></> : null}
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
            ["Solar", snap.erzeugung.solarMw != null ? `${fmt(snap.erzeugung.solarMw / 1000, 1)} GW` : "–", "text-sun-300"],
            ["Wind", snap.erzeugung.windMw != null ? `${fmt(snap.erzeugung.windMw / 1000, 1)} GW` : "–", "text-white"],
            ["Erneuerbar", snap.erzeugung.eeAnteil != null ? `${fmt(snap.erzeugung.eeAnteil)} %` : "–", "text-ov-300"],
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
      vorschau: <VorschauCheckliste punkte={["0 % MwSt. auf PV", "KfW-Heizungsförderung", "Landesprogramme"]} />,
    },
    {
      id: "angebot",
      klasse: "sm:col-span-2 lg:col-span-4",
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
        lead="Acht kostenlose Werkzeuge rund um Solarstrom, Speicher, Wärmepumpe und E-Auto – mit transparenten Annahmen, stündlicher Simulation und Live-Daten vom Strommarkt."
        stats={[
          { value: 8, label: "kostenlose Tools" },
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
            <div className="overflow-x-auto rounded-3xl ring-1 ring-ink-200/70">
              <table className="w-full min-w-[520px] text-left text-[15px]">
                <caption className="sr-only">Wegweiser: Vorhaben und passender Rechner</caption>
                <thead className="bg-sand-50 text-[12.5px] uppercase tracking-[0.12em] text-ink-500">
                  <tr>
                    <th scope="col" className="px-5 py-3.5 font-semibold">Ihr Vorhaben</th>
                    <th scope="col" className="px-5 py-3.5 font-semibold">Passender Rechner</th>
                    <th scope="col" className="px-5 py-3.5 font-semibold">Ergebnis</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-100">
                  {[
                    ["Neue PV-Anlage planen", "solarrechner", "Ertrag, Amortisation"],
                    ["Speicher nachrüsten oder mitkaufen", "stromspeicher", "Autarkie, optimale Größe"],
                    ["Gas- oder Ölheizung ersetzen", "waermepumpe", "Heizkosten, CO₂, Förderung"],
                    ["E-Auto anschaffen", "wallbox", "Kosten je 100 km"],
                    ["Smart Meter / neuen Tarif", "dynamisch", "Tageskosten, Ladefenster"],
                    ["Zuschüsse klären", "foerdercheck", "passende Förderungen"],
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
        text="Sie haben gerechnet – wir prüfen Dach, Verbrauch und Technik vor Ort und machen daraus ein belastbares Angebot. Persönlich, aus Türkheim, seit über 15 Jahren."
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
