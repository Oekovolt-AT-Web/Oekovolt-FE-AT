// src/app/forderungen/fristen/page.js
//
// Fristen-Kalender Förderung und Energierecht Österreich: gleitendes Fenster −2 bis
// +10 Monate aus src/data/foerderFristen.js, nach Zielgruppe filterbar, als ICS
// abonnierbar (/forderungen/fristen.ics?zielgruppe=betrieb|landwirtschaft|gemeinde|privat).

import Link from "next/link";
import { CalendarPlus, Newspaper, SearchCheck } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import Faq from "@/components/ui/Faq";
import CtaBand from "@/components/ui/CtaBand";
import Reveal from "@/components/ui/Reveal";
import Querverweise from "@/components/Reusable/Querverweise";
import Foerderkalender from "@/components/Forderungen/Foerderkalender";
import { Hinweis, Quellen, StandPille } from "@/components/Forderungen/Shared/Bausteine";
import { LAENDER_SLUGS, STAND } from "@/data/bundeslaender";
import { FOERDER_FRISTEN, FRISTEN_ZIELGRUPPEN, fristenImFenster, istKommend } from "@/data/foerderFristen";
import { datumKurzIso, heuteWienIso } from "@/lib/programmStatus";
import { BASE_URL } from "@/lib/site";

// Stündlich neu rendern: Das Fenster wandert mit dem Datum, auch ohne JavaScript.
export const revalidate = 3600;

const PFAD = "/forderungen/fristen";
const PAGE_URL = `${BASE_URL}${PFAD}`;
const TITLE = "Förder-Fristen Österreich 2026/2027: Kalender | Ökovolt";
const DESCRIPTION = "Alle Fristen für PV- und Speicherförderung in Österreich: EAG-Call, IFB 31.12.2026, Klimafonds, Landesprogramme, ElWG-Termine. Nach Zielgruppe filtern, als ICS in Outlook und Google Kalender.";

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: ["Förderfristen Photovoltaik 2026", "EAG Fördercall Frist", "Investitionsfreibetrag Frist 31.12.2026", "Klimafonds Einreichfrist 2027", "Förderkalender Österreich", "Speicherförderung Frist"],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    type: "website",
    url: PAGE_URL,
    siteName: "Ökovolt Österreich",
    locale: "de_AT",
    title: TITLE,
    description: DESCRIPTION,
    images: [{ url: `${BASE_URL}/og-image.jpg`, width: 1200, height: 630, alt: "Förder-Fristen Österreich – Kalender" }],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, images: [`${BASE_URL}/og-image.jpg`] },
};

const LINK = "font-semibold text-ov-700 underline decoration-ov-300 underline-offset-2 hover:text-ov-800";

export default function FristenPage() {
  // Kalendertag in Wien (nicht UTC – sonst kurz nach Mitternacht der Vortag)
  const heuteIso = heuteWienIso();
  const imFenster = fristenImFenster({ heuteIso });
  const kommend = imFenster.filter((f) => istKommend(f, heuteIso));
  const stand = FOERDER_FRISTEN.reduce((m, f) => (f.geprueftAm > m ? f.geprueftAm : m), "") || STAND.iso;

  // Fristen sind keine Veranstaltungen: bewusst kein schema.org/Event (Google-Richtlinien
  // für Event-Rich-Results), sondern schlichte ListItems mit Name, Anker und Beschreibung.
  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${PAGE_URL}/#liste`,
    name: "Förder-Fristen Österreich",
    numberOfItems: kommend.length,
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    itemListElement: kommend.map((f, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: f.titel,
      url: `${PAGE_URL}#${f.id}`,
      description: `${datumKurzIso(f.datum)}${f.bis ? ` bis ${datumKurzIso(f.bis)}` : ""}${f.voraussichtlich ? " (voraussichtlich)" : ""}: ${f.kurz}`,
    })),
  };

  // FAQ-Text aus denselben Daten wie der Kalender – veraltet nicht, wenn Termine vorbei sind
  const naechste = kommend.slice(0, 4).map((f) => `${f.titel} (${f.bis ? `bis ${datumKurzIso(f.bis)}` : datumKurzIso(f.datum)}${f.voraussichtlich ? ", voraussichtlich" : ""})`);
  const landName = (k) => LAENDER_SLUGS.find((l) => l.key === k)?.name || k;
  const laenderEnde = [...new Set(kommend.filter((f) => f.art === "laufzeitende" && f.bundesland !== "bund").map((f) => landName(f.bundesland)))];
  const antwortFristen = kommend.length
    ? `Im Fenster liegen ${imFenster.length} Termine, davon ${kommend.length} kommende. Die nächsten: ${naechste.join("; ")}.${laenderEnde.length ? ` Landesprogramme mit Laufzeitende im Fenster: ${laenderEnde.join(", ")}.` : ""} Termine mit „voraussichtlich“ sind nicht amtlich fixiert.`
    : "Im Fenster liegen derzeit keine kommenden Termine. Termine mit „voraussichtlich“ sind nicht amtlich fixiert.";

  const faq = [
    { q: "Welche Förderfristen für Photovoltaik in Österreich stehen als Nächstes an?", a: antwortFristen },
    { q: "Wie bekomme ich die Fristen in Outlook oder Google Kalender?", a: "Über die Kalenderdatei /forderungen/fristen.ics – wahlweise für Betrieb, Landwirtschaft, Gemeinde oder Privat. Die Datei entspricht RFC 5545, jeder Termin hat eine stabile Kennung, ein erneuter Import aktualisiert statt dupliziert. Einreichfristen bringen eine Erinnerung sieben Tage vorher mit." },
    { q: "Was bedeutet „voraussichtlich“ bei einem Termin?", a: "Der Termin ist von der Förderstelle oder dem Gesetzgeber nicht fixiert – etwa „ab Mitte Oktober“ oder „aus heutiger Sicht bis Ende 2026“. Wir tragen das nächstliegende Datum ein und kennzeichnen es. Verbindlich ist immer die Richtlinie der Förderstelle." },
    { q: "Warum fehlen Termine für 2027 beim EAG-Investitionszuschuss?", a: "Die EAG-Abwicklungsstelle hat zum Prüfdatum keine Calls für 2027 veröffentlicht. Das BMWET hat am 06.10.2026 ein laufendes Antragsmodell ab 2027 angekündigt – nicht beschlossen. Sobald eine Verordnung vorliegt, erscheinen die Termine hier und im Förder-Ticker." },
  ];

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <PageHero
        variant="dark"
        breadcrumbs={[{ name: "Förderungen", href: "/forderungen/bundesfoerderung" }, { name: "Fristen" }]}
        eyebrow={`Fristen-Kalender · ${kommend.length} kommende Termine · geprüft ${datumKurzIso(stand)}`}
        title={<>Förder-Fristen Österreich: <span className="ov-text-gradient-light">nichts mehr verpassen</span></>}
        lead="EAG-Fördercall, Investitionsfreibetrag, Klimafonds, Landesprogramme und ElWG-Termine in einem gleitenden Fenster von zwei Monaten zurück bis zehn Monate voraus – nach Zielgruppe filterbar und als Kalenderdatei für Outlook, Google und Apple."
        points={["Gleitendes 12-Monats-Fenster", "Nach Zielgruppe filtern", "ICS für jeden Kalender", "Jeder Termin mit Quelle"]}
        actions={[
          { label: "Kalender abonnieren (ICS)", href: "/forderungen/fristen.ics", icon: CalendarPlus },
          { label: "Förder-Ticker", href: "/forderungen/aktuell", icon: Newspaper },
        ]}
      />

      <Section tone="white" space="md">
        <SectionHeading as="h2" eyebrow="Kalender" title="Alle Termine im Fenster" lead={<>Vergangene Termine der letzten zwei Monate bleiben sichtbar, damit klar ist, was schon vorbei ist. Den Status der Programme selbst zeigt der <Link href="/foerdercheck" className={LINK}>Förder-Check</Link>.</>} className="mb-8" />
        <Foerderkalender heuteIso={heuteIso} />
      </Section>

      <Section tone="sand" space="md">
        <SectionHeading as="h2" eyebrow="Kalenderdatei" title="Fristen direkt in Ihren Kalender" lead="Eine ICS-Datei je Zielgruppe – mit stabilen Kennungen, damit ein erneuter Import aktualisiert statt dupliziert." className="mb-8" />
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {FRISTEN_ZIELGRUPPEN.map((z, i) => {
            const n = fristenImFenster({ heuteIso, zielgruppe: z.id }).filter((f) => istKommend(f, heuteIso)).length;
            return (
              <Reveal as="li" key={z.id} delay={i * 70}>
                <a href={`/forderungen/fristen.ics?zielgruppe=${z.id}`} className="group flex h-full flex-col justify-between rounded-3xl bg-white p-5 ring-1 ring-ink-200/70 transition-colors hover:ring-ov-200">
                  <span className="flex items-center justify-between">
                    <span className="font-display text-[18px] font-bold text-ink-900">{z.label}</span>
                    <CalendarPlus aria-hidden="true" className="h-5 w-5 text-ov-600" />
                  </span>
                  <span className="mt-3 text-[14px] text-ink-600">
                    <span className="ov-num font-semibold text-ink-900">{n}</span> kommende Termine · ICS herunterladen
                  </span>
                </a>
              </Reveal>
            );
          })}
        </ul>
        <Hinweis className="mt-6" titel="Abonnieren statt importieren">
          In Outlook und Google Kalender lässt sich die Adresse <code className="break-all rounded bg-white px-1.5 py-0.5 text-[13.5px]">{PAGE_URL}.ics</code> als Internetkalender abonnieren – dann wandern neue Fristen automatisch mit. Beim Import als Datei bleibt die Kennung je Termin gleich, ein zweiter Import überschreibt statt zu verdoppeln.
        </Hinweis>
      </Section>

      <Section tone="white" space="md">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div>
            <SectionHeading as="h2" eyebrow="Häufige Fragen" title="Fristen – kurz beantwortet" />
            <StandPille className="mt-5">Termine geprüft {datumKurzIso(stand)} · Richtwert, verbindlich ist die Förderstelle</StandPille>
          </div>
          <Faq items={faq} />
        </div>
        <Quellen
          klappbar
          className="mt-12"
          stand={datumKurzIso(stand)}
          quellen={FOERDER_FRISTEN.map((f) => f.quelle)}
          hinweis="Termine sind Orientierung, keine Rechts- oder Steuerberatung. Verbindlich sind die Richtlinien der Förderstellen und die kundgemachten Gesetze; als „voraussichtlich“ gekennzeichnete Termine sind nicht amtlich fixiert."
        />
      </Section>

      <Querverweise pfad="/forderungen/eag-foerdercall" />
      <CtaBand
        eyebrow="Fristen im Griff"
        title="Antrag, Netzzugang und Inbetriebnahme – zeitlich abgestimmt."
        text="Wir planen Ihr PV- und Speicherprojekt so, dass Förderanträge, Genehmigungen und Inbetriebnahme in die Fristen passen – vom EAG-Call bis zur Landesförderung."
        primary={{ label: "Projekt anfragen", href: "/angebot" }}
        secondary={{ label: "Förder-Check", href: "/foerdercheck", icon: SearchCheck }}
      />
    </div>
  );
}
