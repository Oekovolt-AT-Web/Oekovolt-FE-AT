// src/app/forderungen/status/page.js
//
// Förderstatus-Ampel Österreich: alle Bundes- und Landesprogramme zu PV,
// Speicher, Wärmepumpe und Ladeinfrastruktur aus bund.js und bundeslaender.js
// (nur lesen) mit datumsgesteuertem Status (programmStatus, C01), Prüfdatum,
// nächstem Termin und Alternative. Dazu Gemeindeförderungen im Einzugsgebiet.

import Link from "next/link";
import { CalendarClock, ClipboardCheck, Landmark, MapPinned } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import Faq from "@/components/ui/Faq";
import CtaBand from "@/components/ui/CtaBand";
import Querverweise from "@/components/Reusable/Querverweise";
import StatusAmpel from "@/components/Forderungen/StatusAmpel";
import Gemeindefoerderungen from "@/components/Forderungen/Gemeindefoerderungen";
import { Hinweis, Quellen, StandPille } from "@/components/Forderungen/Shared/Bausteine";
import { KennzahlenBand } from "@/components/Forderungen/Shared/Premium";
import { datumsfelder } from "@/components/Forderungen/foerderstatusText";
import { EAG_2027, EAG_IZ, KPC_BEENDET, KPC_PROGRAMME, MARKTPRAEMIE, STAND } from "@/components/Forderungen/Shared/bund";
import { BUNDESLAENDER, landesPfad } from "@/data/bundeslaender";
import { GEMEINDEN_STAND, GEMEINDEFOERDERUNGEN, zaehleStatus } from "@/data/gemeindefoerderungen";
import { programmStatus } from "@/lib/programmStatus";
import { BASE_URL } from "@/lib/site";
import { hreflangLanguages } from "@/lib/hreflang";

const PAGE_URL = `${BASE_URL}/forderungen/status`;
const TITLE = "Förderstatus Österreich 2026: Ampel der Programme | Ökovolt";
const DESCRIPTION = "Welche PV-, Speicher-, Wärmepumpen- und Wallbox-Förderung läuft noch? Ampel für Bund und Länder mit Prüfdatum und Alternative – plus Gemeindeförderungen.";

/** Prüfdatum dieser Seite (Quellen am Erstellungstag abgerufen). */
const GEPRUEFT = "2026-10-11";

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: ["Förderung Photovoltaik Status", "PV Förderung ausgeschöpft", "Förderung Stromspeicher 2026 Österreich", "Wärmepumpe Förderung Status", "Wallbox Förderung beendet", "Förderstatus Bundesland", "Gemeindeförderung Photovoltaik"],
  alternates: { canonical: PAGE_URL, languages: hreflangLanguages(PAGE_URL) },
  openGraph: { type: "article", url: PAGE_URL, siteName: "Ökovolt Österreich", locale: "de_AT", title: TITLE, description: DESCRIPTION, images: [{ url: `${BASE_URL}/og-image.jpg`, width: 1200, height: 630, alt: "Förderstatus Österreich" }] },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, images: [`${BASE_URL}/og-image.jpg`] },
};

const THEMA_MAP = { "pv-dach": "pv", freiflaeche: "pv", "agri-pv": "pv", speicher: "speicher", waermepumpe: "waermepumpe", laden: "laden" };
const themenAus = (liste = []) => [...new Set(liste.map((t) => THEMA_MAP[t]).filter(Boolean))];

/**
 * Alternative, wenn ein Programm nicht (mehr) in Frage kommt – nach Thema und Ebene.
 * PV-Programme bekommen die PV-Alternative; Ein-Themen-Programme die passende Fachalternative;
 * Programme mit mehreren Nicht-PV-Themen (z. B. Energiemanagement) den neutralen Förder-Check,
 * damit keine fachfremde Alternative erscheint (QA C02).
 */
function alternativeFuer(themen, ebene) {
  const nurEins = themen.length === 1;
  if (themen.includes("pv")) {
    return ebene === "bund"
      ? { text: "EAG-Marktprämie (ab 10 kWp) oder IFB 22 %", href: "/forderungen/bundesfoerderung#marktpraemie" }
      : { text: "EAG-Investitionszuschuss des Bundes", href: "/forderungen/bundesfoerderung" };
  }
  if (nurEins && themen[0] === "laden") return { text: "IFB 22 % für Ladestationen und Landesprogramme", href: "/forderungen/ladeinfrastruktur" };
  if (nurEins && themen[0] === "speicher") return { text: "EAG-Speicherzuschuss 150 €/kWh mit neuer PV", href: "/forderungen/bundesfoerderung#kategorien" };
  if (nurEins && themen[0] === "waermepumpe") return { text: "Umweltförderung (KPC) und Landesprogramme – im Förder-Check prüfen", href: "/foerdercheck" };
  return { text: "Förder-Check: passende Programme für Ihr Vorhaben", href: "/foerdercheck" };
}

/** Serialisierbare Zeilen für die Client-Tabelle (keine Funktionen, kein JSX). */
function baueZeilen() {
  const zeilen = [];

  // --- Bund: EAG-Investitionszuschuss (aktueller Call) ---
  const call = EAG_IZ.calls.find((c) => c.nr === 3) || EAG_IZ.calls[EAG_IZ.calls.length - 1];
  zeilen.push({
    id: "eag-iz",
    ebene: "bund",
    ebeneLabel: "Bund",
    programm: "EAG-Investitionszuschuss PV & Speicher – 3. Fördercall 2026",
    traeger: "OeMAG / EAG-Förderabwicklungsstelle",
    themen: ["pv", "speicher"],
    hoehe: "150 €/kWp (A) bis max. 120 €/kWp (D), Speicher 150 €/kWh",
    statusText: `Call ${call.zeitraum}: ${call.status}`,
    geprueftAm: call.geprueftAm || STAND.iso,
    startIso: call.startIso || null,
    fristIso: call.fristIso || null,
    alternative: { text: "EAG-Marktprämie (ab 10 kWp) oder IFB 22 %", href: "/forderungen/bundesfoerderung#marktpraemie" },
    url: EAG_IZ.quellen[2]?.url,
  });

  zeilen.push({
    id: "eag-2027",
    ebene: "bund",
    ebeneLabel: "Bund",
    programm: "EAG-Förderung 2027: Speichersystembonus statt PV-Zuschuss",
    traeger: "BMWET (Ankündigung, nicht beschlossen)",
    themen: ["pv", "speicher"],
    hoehe: "Förderhöhe nicht veröffentlicht",
    statusText: EAG_2027.offen,
    geprueftAm: EAG_2027.stand,
    anzeigeStatus: "angekuendigt",
    terminText: "Antragsmodell 2027 (angekündigt)",
    pruefen: true,
    alternative: { text: "Noch 2026 im Fördercall einreichen", href: "/forderungen/eag-foerdercall" },
    url: EAG_2027.quellen[0]?.url,
  });

  // --- Bund: Marktprämie (nächster Gebotstermin) ---
  const gebot = MARKTPRAEMIE.termine.find((t) => /nächster/i.test(t.status)) || MARKTPRAEMIE.termine[MARKTPRAEMIE.termine.length - 1];
  zeilen.push({
    id: "marktpraemie",
    ebene: "bund",
    ebeneLabel: "Bund",
    programm: "EAG-Marktprämie PV (Ausschreibung)",
    traeger: "OeMAG",
    themen: ["pv"],
    hoehe: `Höchstpreis ${gebot.hoechstpreis}, 175.000 kWp je Termin`,
    statusText: `Gebotstermin ${gebot.datum}: ${gebot.status}`,
    geprueftAm: gebot.geprueftAm || STAND.iso,
    fristIso: gebot.fristIso || null,
    pruefen: Boolean(gebot.pruefen),
    alternative: { text: "EAG-Investitionszuschuss (bis 1.000 kWp)", href: "/forderungen/bundesfoerderung" },
    url: MARKTPRAEMIE.quellen[1]?.url,
  });

  // --- Bund: KPC / Klimafonds ---
  for (const p of KPC_PROGRAMME) {
    const themen = themenAus(p.themen);
    if (!themen.length) continue;
    const d = datumsfelder(p);
    zeilen.push({
      id: `kpc-${p.id}`,
      ebene: "bund",
      ebeneLabel: "Bund",
      programm: p.name,
      traeger: p.traeger,
      themen,
      hoehe: p.hoehe,
      statusText: p.status,
      geprueftAm: p.geprueftAm || STAND.iso,
      ...d,
      pruefen: Boolean(p.pruefen),
      alternative: alternativeFuer(themen, "bund"),
      url: p.url,
    });
  }

  // --- Bund: beendete KPC-Programme (Ladeinfrastruktur, Kesseltausch, Speicher) ---
  const beendetThemen = {
    "Photovoltaik in der Land- und Forstwirtschaft (KPC)": ["pv"],
    "Mittlere Stromspeicher (51–1.000 kWh)": ["speicher"],
    "Großspeicher ab 1 MWh": ["speicher"],
    "E-Ladeinfrastruktur für Betriebe 2025": ["laden"],
    "E-Ladeinfrastruktur für Private 2025 (eRide)": ["laden"],
    "Kesseltausch und Sanierungsbonus 2026 (Private)": ["waermepumpe"],
  };
  for (const b of KPC_BEENDET) {
    const themen = beendetThemen[b.name] || [];
    if (!themen.length || /2021|2024|2025-03/.test(b.ende)) continue; // Uralt-Programme nicht in der Ampel
    const d = datumsfelder({ status: b.ende, ende: b.ende });
    zeilen.push({
      id: `kpc-ende-${b.name.replace(/\W+/g, "-").toLowerCase()}`,
      ebene: "bund",
      ebeneLabel: "Bund",
      programm: b.name,
      traeger: "KPC – Umweltförderung im Inland",
      themen,
      statusText: b.ende,
      geprueftAm: GEPRUEFT,
      ...d,
      anzeigeStatus: d.anzeigeStatus || "beendet",
      alternative: alternativeFuer(themen, "bund"),
      url: b.url,
    });
  }

  // --- Länder: laufende und beendete Programme ---
  for (const [key, land] of Object.entries(BUNDESLAENDER)) {
    for (const p of land.programme || []) {
      const themen = themenAus(p.themen);
      if (!themen.length) continue;
      const d = datumsfelder(p);
      zeilen.push({
        id: `${key}-${p.name.replace(/\W+/g, "-").toLowerCase()}`,
        ebene: "land",
        ebeneLabel: land.name,
        programm: p.name,
        traeger: p.traeger,
        themen,
        hoehe: p.hoehe,
        statusText: p.status,
        geprueftAm: p.geprueftAm || land.stand || STAND.iso,
        ...d,
        pruefen: Boolean(p.pruefen),
        alternative: alternativeFuer(themen, "land"),
        url: p.url,
        landPfad: landesPfad(key),
      });
    }
    for (const a of land.ausgelaufen || []) {
      const themen = themenAus(["pv-dach", ...(/speicher/i.test(a.programm) ? ["speicher"] : [])]).filter((t) => (/speicher/i.test(a.programm) && !/pv|photovoltaik/i.test(a.programm) ? t === "speicher" : true));
      const d = datumsfelder({ status: a.ende, ende: a.ende });
      zeilen.push({
        id: `${key}-ende-${a.programm.replace(/\W+/g, "-").toLowerCase()}`,
        ebene: "land",
        ebeneLabel: land.name,
        programm: a.programm,
        traeger: `Land ${land.name}`,
        themen,
        statusText: a.ende,
        geprueftAm: land.stand || STAND.iso,
        ...d,
        anzeigeStatus: d.anzeigeStatus || "beendet",
        pruefen: /Sekundärquelle/i.test(a.ende),
        alternative: alternativeFuer(themen, "land"),
        url: a.url,
      });
    }
  }

  return zeilen;
}

const QUELLEN = [
  { label: "EAG-Förderabwicklungsstelle – Investitionszuschuss PV & Speicher", url: "https://www.eag-abwicklungsstelle.at/wissen/investitionszuschuss-photovoltaik-und-speicher/" },
  { label: "KPC – Umweltförderung im Inland, Programme für Betriebe", url: "https://www.umweltfoerderung.at/betriebe" },
  { label: "KPC – Kesseltausch Ein-/Zweifamilienhaus 2026 (Mittel ausgeschöpft)", url: "https://www.umweltfoerderung.at/privatpersonen/kesseltausch-ein-zweifamilienhaus-und-reihenhaus-2026" },
  { label: "WKO – Handwerkerbonus: Förderaktion ausgelaufen (seit 28.02.2026 geschlossen)", url: "https://www.wko.at/gewerbe-handwerk/handwerkerbonus-start" },
  { label: "Bund – handwerkerbonus.gv.at", url: "https://handwerkerbonus.gv.at/" },
  { label: "Klima- und Energiefonds – Förderungen", url: "https://www.klimafonds.gv.at/foerderungen/" },
  ...Object.values(BUNDESLAENDER).flatMap((l) => (l.quellen || []).slice(0, 1)),
];

const FAQ = [
  {
    q: "Wie aktuell ist der Förderstatus auf dieser Seite?",
    a: `Jede Zeile trägt das Datum der letzten redaktionellen Prüfung („geprüft am“). Der Ampelstatus selbst wird beim Aufruf im Browser aus Fristen und Laufzeiten berechnet – ein abgelaufener Call springt also auch ohne Aktualisierung der Seite auf „abgelaufen“. Zeilen mit „bitte bei der Förderstelle prüfen“ beruhen nur auf Sekundärquellen. Stand der Datenbasis: ${STAND.label}, Prüfdatum dieser Seite ${GEPRUEFT.slice(8, 10)}.${GEPRUEFT.slice(5, 7)}.${GEPRUEFT.slice(0, 4)}.`,
  },
  {
    q: "Gibt es 2026 noch den Handwerkerbonus?",
    a: "Nein. Der Handwerkerbonus ist seit 28.02.2026 geschlossen, die Nachreichfrist endete am 30.04.2026 (Quelle: WKO und handwerkerbonus.gv.at). Für PV-Anlagen war er ohnehin nicht relevant, weil nur Arbeitsleistungen im privaten Wohnbereich gefördert wurden.",
  },
  {
    q: "Was ist aus „Raus aus Öl“ geworden?",
    a: "Die Bundesförderung heißt heute „Kesseltausch“ (Umweltförderung, KPC). Für Private sind die Mittel 2026 ausgeschöpft – derzeit ist keine Antragstellung möglich. Betriebe können Wärmepumpen weiterhin über die KPC einreichen; einkommensschwache Haushalte erhalten „Sauber Heizen für Alle“ über ihr Land. Den tagesaktuellen Status zeigt die Ampel oben.",
  },
  {
    q: "Welche Förderung bleibt, wenn ein Landesprogramm ausgeschöpft ist?",
    a: "Für Photovoltaik und Speicher trägt der EAG-Investitionszuschuss des Bundes (Fördercalls, zuletzt 08.–22.10.2026), für Anlagen über 10 kWp alternativ die Marktprämie. Betriebe nutzen zusätzlich den Investitionsfreibetrag von 22 % für Anschaffungen bis 31.12.2026. Die Spalte „Alternative“ verlinkt jeweils die passende Seite.",
  },
  {
    q: "Fördert meine Gemeinde Photovoltaik oder einen Speicher?",
    a: `Das prüfen wir Gemeinde für Gemeinde anhand der Richtlinien auf den Gemeinde-Websites – zum Start für die Bezirke Braunau am Inn und Salzburg-Umgebung (Stand ${GEMEINDEN_STAND.label}). Gemeinden ohne Programm stehen als „keine Förderung gefunden“ in der Liste; noch nicht geprüfte Gemeinden sind als solche gekennzeichnet. Fehler oder neue Programme melden Sie uns per E-Mail.`,
  },
];

export default function Foerderstatus() {
  const zeilen = baueZeilen();
  const jetztMs = Date.now();
  const zaehlung = zeilen.reduce((acc, z) => ({ ...acc, [programmStatus(z, jetztMs)]: (acc[programmStatus(z, jetztMs)] || 0) + 1 }), {});
  const gemeinden = zaehleStatus(GEMEINDEFOERDERUNGEN);
  // Geprüft = alles außer „ungeprueft“ (Programm, ausgesetzt, keine Förderung gefunden).
  const gemeindenGeprueft = gemeinden.programm + gemeinden.ausgesetzt + gemeinden.keine;

  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${PAGE_URL}/#webpage`,
    url: PAGE_URL,
    name: "Förderstatus Österreich: Ampel aller PV-, Speicher-, Wärmepumpen- und Wallbox-Programme",
    description: DESCRIPTION,
    inLanguage: "de-AT",
    isPartOf: { "@id": `${BASE_URL}/#website` },
    about: { "@id": `${BASE_URL}/#organization` },
    dateModified: GEPRUEFT,
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <PageHero
        variant="dark"
        breadcrumbs={[{ name: "Förderungen", href: "/forderungen/bundesfoerderung" }, { name: "Förderstatus" }]}
        eyebrow={`Förderstatus · geprüft am ${GEPRUEFT.slice(8, 10)}.${GEPRUEFT.slice(5, 7)}.${GEPRUEFT.slice(0, 4)}`}
        title={<>Welche Förderung <span className="ov-text-gradient-light">läuft noch?</span> Die Ampel für Bund und Länder</>}
        lead="Alle Programme für Photovoltaik, Stromspeicher, Wärmepumpe und Ladeinfrastruktur in einer Tabelle – mit Status aus Fristen und Laufzeiten, Prüfdatum, nächstem Termin und der Alternative, wenn ein Topf leer ist. Dazu die Gemeindeförderungen im Einzugsgebiet."
        points={["Status beim Aufruf berechnet", "Jede Zeile mit Quelle und Prüfdatum", "Bund, 9 Länder, Gemeinden", "Alternative bei Ausschöpfung"]}
        actions={[
          { label: "Zur Ampel", href: "#ampel", icon: ClipboardCheck },
          { label: "Gemeindeförderungen", href: "#gemeinden", icon: MapPinned },
        ]}
      />

      <KennzahlenBand
        items={[
          { value: zeilen.length, label: "Programme in der Ampel (Bund + Länder)" },
          { value: zaehlung.offen || 0, label: "davon laufend (zum Seitenaufbau)" },
          { value: (zaehlung.abgelaufen || 0) + (zaehlung.wartet || 0), label: "abgelaufen, ausgeschöpft oder wartend" },
          { value: gemeinden.programm, label: `Gemeinden mit eigenem Programm (von ${gemeindenGeprueft} geprüften, ${GEMEINDEFOERDERUNGEN.length} erfasst)` },
        ]}
      />

      <Section tone="sand" space="md" id="ampel" className="scroll-mt-24">
        <div className="mb-8 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading eyebrow="Förderampel" title="Bundes- und Landesprogramme mit Status" lead="Thema, Ebene und Status filtern. „Läuft“ heißt: Einreichung derzeit möglich; „endet bald“: Frist innerhalb von 30 Tagen; „wartet“: Call noch nicht geöffnet oder nur angekündigt; „abgelaufen“: Frist vorbei oder Mittel ausgeschöpft." />
          <StandPille className="shrink-0 self-start md:self-auto">Datenbasis {STAND.label}</StandPille>
        </div>
        <StatusAmpel zeilen={zeilen} jetztMs={jetztMs} />

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <Hinweis titel="„Raus aus Öl“ heißt heute Kesseltausch" ton="warn">
            Die Bundesförderung für den Heizungstausch läuft 2026 als „Kesseltausch“ über die Umweltförderung (KPC). Status für Private: Mittel ausgeschöpft, derzeit keine Antragstellung (Quelle: umweltfoerderung.at, geprüft am 11.10.2026). Betriebe reichen Wärmepumpen weiter über die KPC ein – siehe Ampel.
          </Hinweis>
          <Hinweis titel="Handwerkerbonus">
            Der Handwerkerbonus ist beendet seit 28.02.2026; die Nachreichfrist endete am 30.04.2026 (Quelle: WKO, handwerkerbonus.gv.at). Er betraf nur Arbeitsleistungen im privaten Wohnbereich und war für PV-Anlagen nicht einschlägig.
          </Hinweis>
        </div>
      </Section>

      <Section tone="white" space="md" id="gemeinden-abschnitt">
        <div className="mb-8 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            eyebrow="Gemeindeförderungen im Einzugsgebiet"
            title={<>Bezirke Braunau am Inn und Salzburg-Umgebung: <span className="ov-text-gradient">Gemeinde für Gemeinde</span></>}
            lead="Nur Angaben aus Richtlinien und Förderseiten der Gemeinden – keine Schätzungen. Gemeinden ohne Programm stehen bewusst als „keine Förderung gefunden“ in der Liste; was wir noch nicht prüfen konnten, ist so gekennzeichnet. Gemeindezuschüsse sind meist mit EAG-Zuschuss kombinierbar (außer Kategorie D)."
          />
          <StandPille className="shrink-0 self-start md:self-auto">Stand {GEMEINDEN_STAND.label}</StandPille>
        </div>
        <Gemeindefoerderungen />
      </Section>

      <Section tone="sand" space="md">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <SectionHeading eyebrow="Häufige Fragen" title="Förderstatus – kurz beantwortet" lead="Allgemeine Information, keine Rechts- oder Steuerberatung. Verbindlich sind die Richtlinien der Förderstellen.">
            <ul className="mt-6 space-y-3 text-[15px] text-ink-700">
              <li className="flex gap-2">
                <CalendarClock aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-ov-600" />
                <span>
                  Fristen als Kalender: <Link href="/forderungen/fristen" className="font-semibold text-ov-700 underline decoration-ov-300 underline-offset-2 hover:text-ov-800">Förderfristen</Link>
                </span>
              </li>
              <li className="flex gap-2">
                <Landmark aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-ov-600" />
                <span>
                  Alle Details je Land: <Link href="/forderungen/landesforderungen" className="font-semibold text-ov-700 underline decoration-ov-300 underline-offset-2 hover:text-ov-800">Landesförderungen</Link>
                </span>
              </li>
            </ul>
          </SectionHeading>
          <Faq items={FAQ} />
        </div>
        <Quellen klappbar className="mt-12" stand={`${GEPRUEFT.slice(8, 10)}.${GEPRUEFT.slice(5, 7)}.${GEPRUEFT.slice(0, 4)}`} quellen={QUELLEN} hinweis="Status und Fristen aus den amtlichen Förderseiten; Landesprogramme laufen oft nur bis zur Budgetausschöpfung. Angaben ohne Primärquelle sind als „bitte prüfen“ gekennzeichnet. Richtwerte zur Orientierung, kein Rechtsanspruch." />
      </Section>

      <Querverweise pfad="/forderungen/status" />
      <CtaBand
        eyebrow="Förderung richtig einplanen"
        title="Wir rechnen mit den Programmen, die wirklich offen sind."
        text="Förder-Check, Antrag vor Inbetriebnahme, Fristen im Bauzeitplan – wir übernehmen die Förderabwicklung für Betriebe, Landwirtschaft und Gemeinden in ganz Österreich."
        primary={{ label: "Projekt anfragen", href: "/angebot" }}
        secondary={{ label: "Förder-Check starten", href: "/foerdercheck" }}
      />
    </div>
  );
}
