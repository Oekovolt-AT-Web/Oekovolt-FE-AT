import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Building2, Download, FileText, Mail, MapPin, Newspaper, Phone, Rss, Users } from "lucide-react";

import Breadcrumbs from "@/components/ui/Breadcrumbs";
import Button from "@/components/ui/Button";
import CountUp from "@/components/ui/CountUp";
import Reveal from "@/components/ui/Reveal";
import Section from "@/components/ui/Section";
import SectionHeading, { Eyebrow } from "@/components/ui/SectionHeading";
import FolgenBox from "@/components/Kanaele/FolgenBox";
import MeldungKarte from "@/components/Kanaele/MeldungKarte";
import ReelsAbschnitt from "@/components/Reels/ReelsAbschnitt";
import Kopieren from "./Kopieren";
import { actorId } from "@/lib/kanaele/activitypub";
import { KATEGORIEN, BASE_URL, veroeffentlichungen } from "@/lib/kanaele/veroeffentlichungen";
import { alleArtikel, artikelPfad, datumLang } from "@/lib/ratgeber";
import { FIRMA, SCHWESTER } from "@/lib/site";
import { KENNZAHLEN, KENNZAHLEN_HINWEIS, KENNZAHLEN_STAND } from "@/data/kennzahlen";
import PresseKontakt from "@/components/Presse/PresseKontakt";
import { STAND as OEMAG_STAND } from "@/data/oemag";
// Metadaten des Schneelast-Rasters (GeoSphere SNOWGRID-CL, eigene Auswertung) – hier nur Quelle und Stand
import SCHNEELAST_RASTER from "../../../data/schneelast/sk50-at.json";

export const revalidate = 300;

const PAGE_URL = `${BASE_URL}/presse`;
const TITEL = "Presse & Neuigkeiten | Newsroom | Ökovolt";
const BESCHREIBUNG = "Pressemitteilungen, News und Projekte der Ökovolt Solartechnik GmbH aus Ostermiething – Photovoltaik in Österreich. Mit RSS-Feed, Push und Fediverse.";

export const metadata = {
  title: TITEL,
  description: BESCHREIBUNG,
  alternates: {
    canonical: PAGE_URL,
    types: {
      "application/rss+xml": [{ url: "/presse/rss.xml", title: "Ökovolt – Presse & Neuigkeiten" }],
      "application/feed+json": [{ url: "/presse/feed.json", title: "Ökovolt – Presse & Neuigkeiten (JSON)" }],
      "application/activity+json": [{ url: actorId("oekovolt"), title: "@oekovolt@oekovolt.com" }],
    },
  },
  openGraph: { type: "website", locale: "de_AT", url: PAGE_URL, siteName: "Ökovolt Österreich", title: TITEL, description: BESCHREIBUNG, images: [{ url: `${BASE_URL}/og-image.jpg`, width: 1200, height: 630, alt: "Ökovolt Newsroom" }] },
  other: { "fediverse:creator": "@oekovolt@oekovolt.com" },
};

// Kurzprofil für Redaktionen – nur verifizierte Angaben (docs/AT-BRIEFING.md, src/lib/site.js)
const BOILERPLATE = `Die ${FIRMA.name} mit Sitz in ${FIRMA.ort} (${FIRMA.bundesland}) plant, errichtet und betreut seit ${FIRMA.gegruendet} Photovoltaikanlagen in ganz Österreich – für Gewerbe und Industrie, Landwirtschaft, Gemeinden und Energieversorger. Das Elektrotechnik-Unternehmen entwickelt eigene Parkregler (EZA-Regler), Fernwartungs- und SCADA-Systeme. Gesellschafter sind Geschäftsführer ${FIRMA.geschaeftsfuehrer} (51 %) und die Salzburg AG für Energie, Verkehr und Telekommunikation (49 %). Die deutsche Schwestergesellschaft ${SCHWESTER.name} (${SCHWESTER.ort}) ist seit 2010 am Markt.${FIRMA.verbaende.length ? ` Ökovolt ist ${FIRMA.verbaende.map((v) => `${v.status} im ${v.name}`).join(" und ")}.` : ""}`;

// Zahlen für Redaktionen – Gesamtzahlen zentral aus src/data/kennzahlen.js (Angabe Ökovolt Österreich).
// Die CO₂-Zahl erscheint dort erst mit festgelegtem Zeitraum (SEO-Plan M25). „TOP 3 der IPC-Errichter 2021“
// laut docs/AT-BRIEFING.md (wie Startseite, src/data/hero.js).
const FAKTEN = [
  ...KENNZAHLEN.map((k) => ({ wert: k.zahl, suffix: k.suffix, text: k.label })),
  { wert: "2012", text: "gegründet in Ostermiething, Oberösterreich" },
  { wert: "TOP 3", text: "der IPC-Errichter Österreichs 2021" },
].slice(0, 4);

// Grafiken aus eigenen Datenauswertungen (public/presse/grafiken, erzeugt in Welle 4 / P6) – Vorschau und Download.
// Quellenangabe und Nutzung wie auf den Datenseiten /schneelast und /einspeisung-gewerbe (CC BY 4.0);
// die Lizenz ist dort bereits veröffentlicht – Bestätigung durch den Auftraggeber offen (P6, offener Punkt 3).
// Stand: aus der jeweiligen Datenquelle, nicht von Hand. Breite/Höhe = PNG-Pixelmaße.
const PRESSEGRAFIKEN = [
  {
    titel: "Karte: Schneelast-Richtwerte in Österreich",
    text: "50-jährliche Richtwerte im 1-km-Raster, eigene Auswertung.",
    datei: "/presse/grafiken/schneelast-karte-oesterreich",
    breite: 2400,
    hoehe: 1731,
    seite: { href: "/schneelast", label: "Schneelast-Karte" },
    quelle: "Ökovolt, Daten: GeoSphere Austria (SNOWGRID-CL v2.1, CC BY 4.0)",
    stand: SCHNEELAST_RASTER?.stand,
  },
  {
    titel: "Schneelast: Spanne und Median je Bundesland",
    text: "Richtwerte der Bezirkshauptorte (Wien: Gemeindebezirke) je Bundesland.",
    datei: "/presse/grafiken/schneelast-bundeslaender",
    breite: 2100,
    hoehe: 1146,
    seite: { href: "/schneelast", label: "Schneelast-Karte" },
    quelle: "Ökovolt, Daten: GeoSphere Austria (SNOWGRID-CL v2.1, CC BY 4.0)",
    stand: SCHNEELAST_RASTER?.stand,
  },
  {
    titel: "OeMAG-Marktpreis PV und Marktwert Solar im Verlauf",
    text: "Monatswerte seit Jänner 2024, jeder mit Quelle belegt.",
    datei: "/presse/grafiken/oemag-einspeise-verlauf",
    breite: 2100,
    hoehe: 1230,
    seite: { href: "/einspeisung-gewerbe", label: "Einspeisung für Betriebe" },
    quelle: "Ökovolt, Daten: OeMAG, E-Control",
    stand: OEMAG_STAND.geprueftAm,
  },
];

const standLang = (iso) => new Date(`${iso}T12:00:00Z`).toLocaleDateString("de-AT", { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Vienna" });

// Themen, zu denen die Redaktion Hintergrund liefert – mit passendem Fachartikel
const THEMEN = [
  { titel: "PV für Betriebe & Industrie", href: "/ratgeber/photovoltaik-gewerbe" },
  { titel: "Energiegemeinschaften", href: "/ratgeber/energiegemeinschaft-gruenden" },
  { titel: "ElWG & Netzanschluss", href: "/ratgeber/elwg-elektrizitaetswirtschaftsgesetz" },
  { titel: "Agri-PV & Freiflächen", href: "/ratgeber/agri-pv-oesterreich" },
  { titel: "Speicher & Peak Shaving", href: "/ratgeber/peak-shaving-leistungspreis" },
  { titel: "Blackout-Vorsorge", href: "/ratgeber/blackout-vorsorge-unternehmen" },
  { titel: "PV im Alpenraum & Schneelast", href: "/ratgeber/schneelast-photovoltaik" },
  { titel: "Förderung & Investitionsfreibetrag", href: "/ratgeber/eag-investitionszuschuss" },
];

export default async function PressePage({ searchParams }) {
  const p = await searchParams;
  const kategorie = KATEGORIEN.some((k) => k.id === p?.kategorie) ? p.kategorie : "";
  const tag = String(p?.tag || "").slice(0, 40);
  const alle = await veroeffentlichungen({ kanal: "website", limit: 60 });
  const liste = alle.filter((m) => (!kategorie || m.kategorie === kategorie) && (!tag || m.hashtags.some((h) => h.toLowerCase() === tag.toLowerCase())));
  const [top, ...rest] = liste;
  const vorhandene = KATEGORIEN.filter((k) => alle.some((m) => m.kategorie === k.id));
  const fachbeitraege = alleArtikel().slice(0, 3);

  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${PAGE_URL}#webpage`,
    url: PAGE_URL,
    name: "Ökovolt Newsroom",
    description: BESCHREIBUNG,
    inLanguage: "de-AT",
    isPartOf: { "@id": `${BASE_URL}/#website` },
    about: { "@id": `${BASE_URL}/#organization` },
    mainEntity: { "@type": "ItemList", itemListElement: liste.slice(0, 20).map((m, i) => ({ "@type": "ListItem", position: i + 1, url: m.url, name: m.titel })) },
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      {/* ---------- Newsroom-Kopf ---------- */}
      <section className="ov-noise relative isolate overflow-hidden bg-navy-950 text-white">
        <div aria-hidden="true" className="ov-grid-bg absolute inset-0 -z-10" />
        <div aria-hidden="true" className="absolute -left-32 top-1/3 -z-10 h-[420px] w-[420px] rounded-full bg-ov-500/25 blur-[120px]" />
        <div aria-hidden="true" className="absolute -right-20 -top-24 -z-10 h-[380px] w-[380px] rounded-full bg-navy-400/30 blur-[120px]" />
        <div className="ov-container pb-16 pt-8 md:pb-20 md:pt-12">
          <Breadcrumbs dark items={[{ name: "Presse & Neuigkeiten" }]} className="ov-hero-in mb-10" />
          <div className="grid items-end gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-16">
            <div>
              <div className="ov-hero-in flex flex-wrap items-center gap-3" style={{ "--ov-delay": "60ms" }}>
                <Eyebrow dark>Newsroom</Eyebrow>
                <span className="inline-flex items-center gap-2 rounded-full bg-white/[0.07] px-3 py-1 text-[12px] font-semibold text-white/75 ring-1 ring-white/10">
                  <span className="h-1.5 w-1.5 rounded-full bg-ov-400 motion-safe:animate-pulse" />
                  {datumLang(new Date().toISOString())}
                </span>
              </div>
              <h1 className="ov-h1 ov-hero-in mt-5" style={{ "--ov-delay": "120ms" }}>
                Neuigkeiten aus der <span className="ov-text-gradient-light">Energiewende.</span>
              </h1>
              <p className="ov-lead ov-hero-in mt-6 max-w-2xl text-white/70" style={{ "--ov-delay": "200ms" }}>
                Pressemitteilungen, Projekte und Unternehmensnews von Ökovolt Österreich – Photovoltaik für Gewerbe, Landwirtschaft und Gemeinden. Als RSS-Feed,
                Push-Benachrichtigung oder direkt im Fediverse, zum Beispiel über Mastodon oder Threads.
              </p>
              <div className="ov-hero-in mt-9 flex flex-col gap-3 sm:flex-row" style={{ "--ov-delay": "280ms" }}>
                <Button href="#kontakt" size="lg" pfeil icon={Mail}>
                  Presse-Kontakt
                </Button>
                <Button href="/presse/rss.xml" size="lg" variant="outlineLight" icon={Rss}>
                  RSS-Feed
                </Button>
              </div>
            </div>

            <div className="ov-hero-in ov-glass rounded-[2rem] p-6 md:p-7" style={{ "--ov-delay": "240ms" }}>
              <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-ov-300">Schnellinfo für Redaktionen</p>
              <dl className="mt-5 divide-y divide-white/10 text-[14.5px]">
                {[
                  { icon: Building2, dt: "Unternehmen", dd: FIRMA.name },
                  { icon: MapPin, dt: "Sitz", dd: `${FIRMA.strasse}, ${FIRMA.plz} ${FIRMA.ort}` },
                  { icon: Users, dt: "Geschäftsführung", dd: FIRMA.geschaeftsfuehrer },
                  { icon: FileText, dt: "Firmenbuch", dd: `${FIRMA.firmenbuch}, ${FIRMA.firmenbuchgericht}` },
                ].map((z) => (
                  <div key={z.dt} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
                    <z.icon aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-ov-300" />
                    <dt className="w-32 shrink-0 text-white/50">{z.dt}</dt>
                    <dd className="min-w-0 font-medium text-white/90">{z.dd}</dd>
                  </div>
                ))}
              </dl>
              <a href={`mailto:${FIRMA.email}?subject=Presseanfrage`} className="mt-6 flex items-center justify-between gap-3 rounded-2xl bg-white/[0.08] px-4 py-3 text-[14.5px] font-semibold text-white ring-1 ring-white/10 transition-colors hover:bg-white/15">
                <span className="flex items-center gap-2.5">
                  <Mail aria-hidden="true" className="h-4 w-4 text-ov-300" />
                  {FIRMA.email}
                </span>
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Facebook-Reels (erst nach Einwilligung) ---------- */}
      <ReelsAbschnitt tone="white" space="md" presseLink={false} />

      {/* ---------- Meldungen ---------- */}
      <Section tone="sand" space="lg">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-14">
          <div className="min-w-0">
            <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
              <SectionHeading eyebrow="Aktuell" title="Meldungen & Projekte" />
              {vorhandene.length > 1 && (
                <nav aria-label="Kategorien" className="flex flex-wrap gap-2">
                  {[{ id: "", plural: "Alle" }, ...vorhandene].map((k) => (
                    <Link
                      key={k.id || "alle"}
                      href={k.id ? `/presse?kategorie=${encodeURIComponent(k.id)}` : "/presse"}
                      aria-current={kategorie === k.id ? "page" : undefined}
                      className={
                        kategorie === k.id
                          ? "inline-flex h-10 items-center rounded-full bg-navy-950 px-4 text-[14px] font-semibold text-white"
                          : "inline-flex h-10 items-center rounded-full bg-white px-4 text-[14px] font-semibold text-ink-700 ring-1 ring-inset ring-ink-200 hover:ring-ov-300"
                      }
                    >
                      {k.plural}
                    </Link>
                  ))}
                </nav>
              )}
            </div>
            {tag && (
              <p className="mb-6 text-[15px] text-ink-600">
                Beiträge mit <strong className="text-ink-900">#{tag}</strong> ·{" "}
                <Link href="/presse" className="font-semibold text-ov-700 underline underline-offset-2">
                  alle anzeigen
                </Link>
              </p>
            )}

            {liste.length === 0 ? (
              <div className="overflow-hidden rounded-[2rem] bg-white ring-1 ring-ink-200/70">
                <div className="flex flex-col items-start gap-5 p-7 sm:flex-row sm:items-center md:p-9">
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-ov-50 text-ov-600 ring-1 ring-ov-100">
                    <Newspaper aria-hidden="true" className="h-7 w-7" />
                  </span>
                  <div>
                    <h3 className="font-display text-[22px] font-extrabold text-ink-900">Die nächsten Meldungen folgen in Kürze.</h3>
                    <p className="mt-1.5 max-w-lg text-[15.5px] leading-relaxed text-ink-600">
                      Abonnieren Sie den Newsroom – dann verpassen Sie keine Pressemitteilung, kein Projekt und keine Neuigkeit. Bis dahin: frisch aus unserem Fachmagazin.
                    </p>
                  </div>
                </div>
                <ul className="grid gap-px border-t border-ink-100 bg-ink-100 md:grid-cols-3">
                  {fachbeitraege.map((a) => (
                    <li key={a.slug} className="bg-white">
                      <Link href={artikelPfad(a.slug)} className="group flex h-full flex-col p-5">
                        <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-ink-100">
                          <Image src={a.bild} alt="" fill sizes="(max-width: 768px) 100vw, 260px" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                        </div>
                        <p className="mt-4 text-[11.5px] font-semibold uppercase tracking-[0.1em] text-ov-700">Fachbeitrag · {a.kategorie.split(/,| &/)[0]}</p>
                        <p className="mt-1 font-display text-[16px] font-bold leading-snug text-ink-900 transition-colors group-hover:text-ov-700">{a.title}</p>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="grid gap-5">
                {top && <MeldungKarte m={top} gross />}
                {rest.length > 0 && (
                  <div className="grid gap-5 md:grid-cols-2">
                    {rest.map((m) => (
                      <MeldungKarte key={m.slug} m={m} />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <aside className="space-y-5 lg:sticky lg:top-28 lg:self-start">
            <FolgenBox konten={["oekovolt"]} pushThema="news" />
          </aside>
        </div>
      </Section>

      {/* ---------- Fakten & Kurzprofil ---------- */}
      <Section tone="navy" space="lg" className="ov-noise overflow-hidden">
        <div aria-hidden="true" className="ov-grid-bg absolute inset-0" />
        <div aria-hidden="true" className="absolute -right-32 top-0 h-[420px] w-[420px] rounded-full bg-ov-500/20 blur-[130px]" />
        <div className="relative">
          <SectionHeading dark eyebrow="Für Redaktionen" title="Ökovolt in Zahlen" className="mb-12" />
          <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {FAKTEN.map((f, i) => (
              <Reveal key={f.text} delay={i * 70} className="ov-glass rounded-3xl p-6 md:p-7">
                <dt className="sr-only">{f.text}</dt>
                <dd className="ov-num font-display text-[clamp(2.1rem,1.6rem+1.4vw,3rem)] font-extrabold leading-none tracking-tight text-ov-300">
                  {typeof f.wert === "string" ? f.wert : <CountUp value={f.wert} suffix={f.suffix || ""} />}
                </dd>
                <dd className="mt-3 text-[15px] leading-relaxed text-white/75">{f.text}</dd>
              </Reveal>
            ))}
          </dl>
          <p className="mt-5 text-[13.5px] text-white/60">
            {KENNZAHLEN_HINWEIS}, Stand {standLang(KENNZAHLEN_STAND)}. Nicht die Summe der online dokumentierten Referenzprojekte.
          </p>

          <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
            <Reveal className="rounded-[2rem] bg-white p-6 text-ink-900 md:p-9">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-ov-700">Kurzprofil zum Übernehmen</p>
                <Kopieren text={BOILERPLATE} label="Kurzprofil kopieren" />
              </div>
              <p className="mt-5 text-[16px] leading-relaxed text-ink-700">{BOILERPLATE}</p>
            </Reveal>
            <Reveal delay={90} className="rounded-[2rem] bg-white/[0.06] p-6 ring-1 ring-white/10 md:p-9">
              <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-ov-300">Themen, zu denen wir Auskunft geben</p>
              <ul className="mt-5 flex flex-wrap gap-2">
                {THEMEN.map((t) => (
                  <li key={t.href}>
                    <Link href={t.href} className="inline-flex min-h-[40px] items-center gap-1.5 rounded-full bg-white/[0.07] px-4 text-[14px] font-medium text-white/85 ring-1 ring-white/10 transition-colors hover:bg-ov-500 hover:text-white">
                      {t.titel}
                      <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5 opacity-60" />
                    </Link>
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-[14px] leading-relaxed text-white/60">Hintergrundgespräche, Zahlen und Einordnung für Ihre Berichterstattung – schreiben Sie uns, wir vermitteln die passende Fachperson.</p>
            </Reveal>
          </div>
        </div>
      </Section>

      {/* ---------- Kontakt & Material ---------- */}
      <Section tone="white" space="lg" id="kontakt" className="scroll-mt-20">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16">
          <SectionHeading
            eyebrow="Für Redaktionen"
            title="Presse-Kontakt & Material"
            lead="Sie berichten über Photovoltaik in Betrieben, Agri-PV, Energiegemeinschaften, die Energiewende in Gemeinden oder über ein Projekt von uns? Wir liefern Zahlen, Bilder und Ansprechpartner – schnell und unkompliziert."
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <PresseKontakt />
            </div>
            <a href={`mailto:${FIRMA.email}?subject=Presseanfrage`} className="group ov-card-hover flex flex-col rounded-3xl bg-sand-50 p-6 ring-1 ring-ink-200/60 hover:bg-white hover:ring-ov-300">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-ov-500 text-white">
                <Mail aria-hidden="true" className="h-5 w-5" />
              </span>
              <p className="mt-5 font-display text-[17px] font-bold text-ink-900">Presseanfragen</p>
              <p className="mt-1 text-[14.5px] text-ink-600">{FIRMA.email}</p>
            </a>
            <a href={FIRMA.telefonHref} className="group ov-card-hover flex flex-col rounded-3xl bg-sand-50 p-6 ring-1 ring-ink-200/60 hover:bg-white hover:ring-ov-300">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-ov-500 text-white">
                <Phone aria-hidden="true" className="h-5 w-5" />
              </span>
              <p className="mt-5 font-display text-[17px] font-bold text-ink-900">Telefon</p>
              <p className="mt-1 text-[14.5px] text-ink-600">{FIRMA.telefon}</p>
            </a>
            <div className="flex flex-col rounded-3xl bg-sand-50 p-6 ring-1 ring-ink-200/60 sm:col-span-2">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                <div className="flex h-20 w-full shrink-0 items-center justify-center rounded-2xl bg-white px-5 ring-1 ring-ink-200/60 sm:w-48">
                  <Image src="/logo-oekovolt.png" alt="Ökovolt-Logo" width={160} height={35} className="h-auto w-40" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-display text-[17px] font-bold text-ink-900">Logo herunterladen</p>
                  <p className="mt-1 text-[14.5px] text-ink-600">PNG für Web und Präsentationen – farbig oder weiß für dunkle Hintergründe.</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <a href="/logo-oekovolt.png" download className="inline-flex h-10 items-center gap-2 rounded-full bg-ink-900 px-4 text-[13.5px] font-semibold text-white hover:bg-ink-800">
                      <Download aria-hidden="true" className="h-4 w-4" />
                      Farbig
                    </a>
                    <a href="/logo-oekovolt-weiss.png" download className="inline-flex h-10 items-center gap-2 rounded-full bg-white px-4 text-[13.5px] font-semibold text-ink-800 ring-1 ring-ink-200 hover:ring-ink-300">
                      <Download aria-hidden="true" className="h-4 w-4" />
                      Weiß
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div id="grafiken" className="scroll-mt-24 rounded-3xl bg-sand-50 p-6 ring-1 ring-ink-200/60 sm:col-span-2">
              <p className="font-display text-[17px] font-bold text-ink-900">Grafiken aus eigenen Daten</p>
              <p className="mt-1 text-[14.5px] leading-relaxed text-ink-600">
                Zur Weiterverwendung unter CC BY 4.0 mit der jeweils genannten Quellenangabe. Schneelast-Werte sind Richtwerte, keine Normwerte.
              </p>
              <ul className="mt-4 grid gap-4 sm:grid-cols-3">
                {PRESSEGRAFIKEN.map((g) => (
                  <li key={g.datei} className="flex flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-ink-200/60">
                    <a href={`${g.datei}.png`} className="block border-b border-ink-100 bg-white" aria-label={`${g.titel} – Vorschau in voller Größe öffnen (PNG)`}>
                      <Image src={`${g.datei}.png`} alt={g.titel} width={g.breite} height={g.hoehe} sizes="(min-width: 1024px) 220px, (min-width: 640px) 30vw, 90vw" className="h-auto w-full" />
                    </a>
                    <div className="flex flex-1 flex-col p-4">
                      <p className="text-[14.5px] font-semibold leading-snug text-ink-900">{g.titel}</p>
                      <p className="mt-1 text-[13px] leading-relaxed text-ink-600">{g.text}</p>
                      <p className="mt-2 text-[12.5px] leading-relaxed text-ink-500">
                        Quelle: „{g.quelle}“{g.stand ? ` · Stand ${standLang(g.stand)}` : ""} ·{" "}
                        <Link href={g.seite.href} className="underline underline-offset-2 hover:text-ink-800">
                          {g.seite.label}
                        </Link>
                      </p>
                      <div className="mt-auto flex flex-wrap gap-2 pt-3">
                        <a href={`${g.datei}.png`} download className="inline-flex h-9 items-center gap-1.5 rounded-full bg-ink-900 px-3 text-[13px] font-semibold text-white hover:bg-ink-800">
                          <Download aria-hidden="true" className="h-4 w-4" />
                          PNG
                        </a>
                        <a href={`${g.datei}.svg`} download className="inline-flex h-9 items-center gap-1.5 rounded-full bg-white px-3 text-[13px] font-semibold text-ink-800 ring-1 ring-ink-200 hover:ring-ink-300">
                          <Download aria-hidden="true" className="h-4 w-4" />
                          SVG
                        </a>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-3xl bg-sand-50 p-6 ring-1 ring-ink-200/60 sm:col-span-2">
              <p className="flex items-center gap-2 font-display text-[17px] font-bold text-ink-900">
                <Building2 aria-hidden="true" className="h-5 w-5 text-ov-600" />
                Unternehmen
              </p>
              <p className="mt-2 text-[14.5px] leading-relaxed text-ink-600">
                {FIRMA.name} · {FIRMA.strasse}, {FIRMA.plz} {FIRMA.ort} · {FIRMA.firmenbuch}, {FIRMA.firmenbuchgericht}
              </p>
              <p className="mt-2 text-[13px] leading-relaxed text-ink-500">
                Gesellschafter: {FIRMA.gesellschafter.map((g) => `${g.name} (${g.anteil})`).join(", ")}. Deutsche Schwestergesellschaft und Markeninhaberin: {SCHWESTER.name}, {SCHWESTER.ort} ({SCHWESTER.land}).
              </p>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}
