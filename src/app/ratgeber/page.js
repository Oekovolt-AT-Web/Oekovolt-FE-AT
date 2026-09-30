// src/app/ratgeber/page.js
//
// Ratgeber-Übersicht im Magazin-Look: Titelthema, Leseleiste, Einstieg nach
// Rolle, Themen-Kacheln, filterbarer Katalog aller Artikel, Kennzahlen.

import Link from "next/link";
import { ArrowUpRight, BatteryCharging, BookOpen, Briefcase, Calculator, Car, Cpu, Euro, HelpCircle, Network, Scale, ShoppingCart, Wrench } from "lucide-react";

import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import CtaBand from "@/components/ui/CtaBand";
import Reveal from "@/components/ui/Reveal";
import RatgeberListe from "@/components/Ratgeber/RatgeberListe";
import Leseleiste from "@/components/Ratgeber/Leseleiste";
import { FachbereichKarte, LeseKarte, MagazinHero, ThemenKachel } from "@/components/Ratgeber/Magazin";
import FolgenBox from "@/components/Kanaele/FolgenBox";
import { KATEGORIEN, alleArtikel, artikelNachSlug, artikelPfad, kategorieSlug, neueSlugs } from "@/lib/ratgeber";
import { BEGRIFFE } from "@/data/lexikon";
import { BASE_URL, SITE_NAME, LOCALE } from "@/lib/site";

const PAGE_URL = `${BASE_URL}/ratgeber`;

const DESCRIPTION =
  "Photovoltaik-Ratgeber für Österreich: Wirtschaftlichkeit, EAG-Förderung, Steuern, Netzanschluss, Speicher und Energiegemeinschaften für Betriebe und Gemeinden.";

// Österreichspezifischer Content -> kein hreflang, nur Canonical.
export const metadata = {
  title: "PV-Ratgeber Österreich 2026: Gewerbe & Förderung | Ökovolt",
  description: DESCRIPTION,
  keywords: [
    "Photovoltaik Ratgeber Österreich",
    "Photovoltaik Gewerbe",
    "EAG Investitionszuschuss",
    "Investitionsfreibetrag Photovoltaik",
    "Photovoltaik Kosten Österreich",
    "Energiegemeinschaft",
    "OeMAG Marktpreis",
  ],
  alternates: {
    canonical: PAGE_URL,
    types: {
      "application/rss+xml": [{ url: "/ratgeber/rss.xml", title: "Ökovolt Ratgeber" }],
      "application/activity+json": [{ url: `${BASE_URL}/api/ap/users/ratgeber`, title: "@ratgeber@oekovolt.com" }],
    },
  },
  other: { "fediverse:creator": "@ratgeber@oekovolt.com" },
  openGraph: {
    type: "website",
    url: PAGE_URL,
    siteName: SITE_NAME,
    locale: LOCALE,
    title: "Photovoltaik-Ratgeber Österreich | Ökovolt",
    description: DESCRIPTION,
    images: [{ url: `${BASE_URL}/og-image.jpg`, width: 1200, height: 630, alt: "Ökovolt Photovoltaik-Ratgeber Österreich" }],
  },
};

// Kurzformen für die Filter-Chips
const KURZ = {
  "Kosten & Wirtschaftlichkeit": "Kosten",
  "Förderung, Steuern & Recht": "Förderung & Recht",
  "Netz, Energiegemeinschaften & Markt": "Netz & Markt",
  "Technik & Planung": "Technik",
  "Speicher & Eigenverbrauch": "Speicher",
  "E-Mobilität & Sektorkopplung": "E-Mobilität",
};

// Themen-Kacheln: Symbol, Kurzbeschreibung, Titelbild (dokumentiert in QUELLEN-*.md)
const THEMEN = {
  "Kosten & Wirtschaftlichkeit": { icon: Euro, text: "Preise je kWp, Amortisation, Leasing und wie Sie Angebote richtig vergleichen.", bild: "/Images/AT/ratgeber/pv-gewerbe-dornbirn.jpg" },
  "Förderung, Steuern & Recht": { icon: Scale, text: "EAG-Investitionszuschuss, Investitionsfreibetrag, ElWG, Genehmigung und Solarpflicht.", bild: "/Images/AT/ratgeber/eag-investitionszuschuss.jpg" },
  "Netz, Energiegemeinschaften & Markt": { icon: Network, text: "TOR Erzeuger, Energiegemeinschaften, OeMAG-Marktpreis, PPA und Direktvermarktung.", bild: "/Images/AT/ratgeber/tor-erzeuger-netzanschluss.jpg" },
  "Technik & Planung": { icon: Cpu, text: "Schneelast, Brandschutz, Flachdach, Agri-PV, EZA-Regler und Wechselrichter.", bild: "/Images/AT/ratgeber/photovoltaik-flachdach.jpg" },
  "Speicher & Eigenverbrauch": { icon: BatteryCharging, text: "Gewerbespeicher, Peak Shaving, Notstrom und Energiemanagement.", bild: "/Images/AT/ratgeber/grossspeicher-bess.jpg" },
  "E-Mobilität & Sektorkopplung": { icon: Car, text: "Firmenflotte laden, Wallbox, Wärmepumpe und bidirektionales Laden.", bild: "/Images/AT/loesungen/ladeinfrastruktur-solarcarport.jpg" },
};
// Optional breite Kacheln (md:col-span-2) – derzeit gleichmäßiges 3er-Raster
const GROSS = [];

// Redaktioneller Einstieg nach Rolle
const FACHBEREICHE = [
  {
    rolle: "Für die Geschäftsführung",
    frage: "Rechnet sich das – und wie finanzieren wir es?",
    text: "Amortisation, Freibetrag, Stromliefervertrag und Leasing: die Zahlen für die Investitionsentscheidung.",
    icon: Briefcase,
    bild: "/Images/AT/wissen/besprechung-pv-projekt.jpg",
    bildAlt: "Projektbesprechung im Büro, eine Mitarbeiterin zeigt ein Solarmodul",
    slugs: ["photovoltaik-amortisation", "investitionsfreibetrag-photovoltaik", "ppa-oesterreich", "photovoltaik-leasing", "csrd-esg-photovoltaik"],
  },
  {
    rolle: "Für Technik & Planung",
    frage: "Was verlangen Netzbetreiber, Norm und Statik?",
    text: "Netzanschluss nach TOR Erzeuger, EZA-Regler, Brandschutz, Schneelast und die Prüfung der Anlage.",
    icon: Wrench,
    bild: "/Images/AT/technik/leitwarte-netzbetrieb.jpg",
    bildAlt: "Leitwarte eines Netzbetreibers mit Monitoren und Lastkurven",
    slugs: ["tor-erzeuger-netzanschluss", "eza-regler-parkregler", "photovoltaik-brandschutz", "schneelast-photovoltaik", "e-check-photovoltaik"],
  },
  {
    rolle: "Für den Einkauf",
    frage: "Welches Angebot, welche Komponenten, welcher Vertrag?",
    text: "Angebote vergleichen, Module und Wechselrichter bewerten, Speicherpreise und Wartungsverträge einordnen.",
    icon: ShoppingCart,
    bild: "/Images/AT/wissen/pv-ingenieur-tablet.jpg",
    bildAlt: "Ingenieur mit Schutzhelm prüft Daten auf dem Tablet vor einer PV-Anlage",
    slugs: ["photovoltaik-angebot-vergleichen", "solarmodule-vergleich", "wechselrichter-photovoltaik", "gewerbespeicher-kosten", "photovoltaik-wartungsvertrag"],
  },
];

// Titelthema und Empfehlungen (suchstärkste Themen)
const EMPFOHLEN = ["photovoltaik-gewerbe", "eag-investitionszuschuss", "investitionsfreibetrag-photovoltaik"];

const eindeutig = (liste) => liste.filter((a, i, l) => l.findIndex((x) => x.slug === a.slug) === i);

export default function RatgeberPage() {
  const artikel = alleArtikel();
  const neu = neueSlugs(artikel);
  const empfohlen = EMPFOHLEN.map(artikelNachSlug).filter(Boolean);
  const [top, ...neben] = empfohlen.length === EMPFOHLEN.length ? empfohlen : artikel.slice(0, 3);
  const heroSlugs = new Set([top, ...neben].map((a) => a.slug));

  // Leseleiste: neue Artikel zuerst, dann die zuletzt aktualisierten
  const nachAktualisierung = [...artikel].sort((a, b) => new Date(b.aktualisiert) - new Date(a.aktualisiert));
  const leiste = eindeutig([...artikel.filter((a) => neu.has(a.slug)), ...nachAktualisierung])
    .filter((a) => !heroSlugs.has(a.slug))
    .slice(0, 10);

  // Katalog: Empfehlungen und neue Artikel vorne, danach nach Datum
  const katalog = eindeutig([...empfohlen, ...artikel.filter((a) => neu.has(a.slug)), ...artikel]);

  const fachbereiche = FACHBEREICHE.map((f) => ({ ...f, artikel: f.slugs.map(artikelNachSlug).filter(Boolean) }));
  const themen = KATEGORIEN.map((k) => ({ kategorie: k, ...THEMEN[k], artikel: artikel.filter((a) => a.kategorie === k) }));

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${PAGE_URL}/#collection`,
        name: "Photovoltaik-Ratgeber Österreich",
        description: DESCRIPTION,
        inLanguage: "de-AT",
        isPartOf: { "@id": `${BASE_URL}/#website` },
        publisher: { "@id": `${BASE_URL}/#organization` },
        mainEntity: { "@id": `${PAGE_URL}/#list` },
      },
      {
        "@type": "ItemList",
        "@id": `${PAGE_URL}/#list`,
        itemListElement: artikel.map((a, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: a.title,
          url: `${BASE_URL}${artikelPfad(a.slug)}`,
        })),
      },
    ],
  };

  // Zitierfähige Kennzahlen – Stand 09/2026, Quellen jeweils im verlinkten Ratgeber.
  const fakten = [
    { wert: "22 %", text: "Öko-Investitionsfreibetrag auf PV-Anlagen und Speicher, die bis 31. Dezember 2026 angeschafft werden (§ 11 EStG)", href: "/ratgeber/investitionsfreibetrag-photovoltaik" },
    { wert: "8.–22.10.", text: "letzter EAG-Fördercall 2026 für Photovoltaik und Stromspeicher – bis 130 €/kWp (C) bzw. 120 €/kWp (D)", href: "/ratgeber/eag-investitionszuschuss" },
    { wert: "806 €", text: "je kWp netto kostete eine schlüsselfertige 30–50-kWp-Anlage in Österreich laut BMWET-Marktstatistik 2024", href: "/ratgeber/solaranlage-kosten" },
    { wert: "0 ct", text: "Elektrizitätsabgabe auf selbst erzeugten und selbst verbrauchten Solarstrom – ohne Mengengrenze", href: "/ratgeber/photovoltaik-steuern" },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <MagazinHero
        top={top}
        neben={neben}
        vorschlaege={["EAG-Förderung", "Leistungspreis", "Schneelast", "Energiegemeinschaft"]}
        stats={[
          { value: artikel.length, label: "ausführliche Ratgeber" },
          { value: BEGRIFFE.length, label: "Begriffe im Lexikon" },
          { value: new Date().getFullYear() - 2012, label: "Jahre PV-Praxis in Österreich" },
        ]}
      />

      {/* ---------- Leseleiste ---------- */}
      <Section tone="white" space="md" className="overflow-hidden">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <SectionHeading eyebrow="Neu & aktualisiert" title="Frisch aus der Redaktion" />
          <a href="/ratgeber/rss.xml" className="text-[14px] font-semibold text-ov-700 underline decoration-ov-300 underline-offset-4 hover:decoration-current">
            Als RSS-Feed abonnieren
          </a>
        </div>
        <Leseleiste label="Neue und aktualisierte Ratgeber-Artikel">
          {leiste.map((a) => (
            <LeseKarte key={a.slug} artikel={a} neu={neu.has(a.slug)} />
          ))}
        </Leseleiste>
      </Section>

      {/* ---------- Einstieg nach Rolle ---------- */}
      <Section tone="sand" space="lg">
        <SectionHeading
          eyebrow="Ihr Einstieg"
          title="Drei Perspektiven auf ein PV-Projekt"
          lead="Geschäftsführung, Technik und Einkauf stellen unterschiedliche Fragen. Hier finden Sie jeweils die Artikel, mit denen Sie am schnellsten zu einer Entscheidung kommen."
          className="mb-12"
        />
        <div className="ov-no-scrollbar -mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 md:mx-0 md:grid md:overflow-visible md:px-0 md:pb-0 md:grid-cols-2 md:gap-5 lg:grid-cols-3">
          {fachbereiche.map((b, i) => (
            <div key={b.rolle} className={i === 2 ? "flex w-[84vw] max-w-[380px] shrink-0 snap-start md:w-auto md:max-w-none md:col-span-2 lg:col-span-1" : "flex w-[84vw] max-w-[380px] shrink-0 snap-start md:w-auto md:max-w-none"}>
              <FachbereichKarte bereich={b} delay={i * 90} />
            </div>
          ))}
        </div>
      </Section>

      {/* ---------- Themen-Kacheln ---------- */}
      <Section tone="white" space="lg">
        <SectionHeading eyebrow="Themenbereiche" title="Sechs Themen, ein Ziel: die richtige Anlage" className="mb-12" />
        <div className="ov-no-scrollbar -mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 md:mx-0 md:grid md:overflow-visible md:px-0 md:pb-0 md:grid-cols-2 lg:grid-cols-3">
          {themen.map((t, i) => (
            <ThemenKachel key={t.kategorie} thema={t} gross={GROSS.includes(t.kategorie)} delay={(i % 3) * 80} />
          ))}
        </div>
      </Section>

      {/* ---------- Katalog ---------- */}
      <Section tone="sand" space="lg" id="alle-artikel" className="scroll-mt-16">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <SectionHeading eyebrow="Alle Ratgeber" title="Alle Artikel durchsuchen" />
          <p className="max-w-sm text-[15px] leading-relaxed text-ink-600">Filtern Sie nach Thema, suchen Sie nach Stichwort – oder wechseln Sie in die kompakte Listenansicht.</p>
        </div>
        <RatgeberListe
          kategorien={KATEGORIEN.map((k) => ({ slug: kategorieSlug(k), label: k, kurz: KURZ[k] }))}
          artikel={katalog.map(({ slug, title, excerpt, kategorie, bild, bildAlt, lesezeit, keywords }) => ({
            slug,
            title,
            excerpt,
            kategorie,
            katSlug: kategorieSlug(kategorie),
            bild,
            bildAlt,
            lesezeit,
            keywords: keywords || [],
            neu: neu.has(slug),
          }))}
        />
      </Section>

      {/* ---------- Kennzahlen (dunkel) ---------- */}
      <Section tone="navy" space="lg" className="ov-noise overflow-hidden">
        <div aria-hidden="true" className="ov-grid-bg absolute inset-0" />
        <div aria-hidden="true" className="absolute -right-32 top-0 h-[420px] w-[420px] rounded-full bg-ov-500/20 blur-[130px]" />
        <div aria-hidden="true" className="absolute -left-24 bottom-0 h-[320px] w-[320px] rounded-full bg-sun-400/10 blur-[120px]" />
        <div className="relative grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <SectionHeading
            dark
            eyebrow="Auf einen Blick"
            title="Zahlen, die Sie 2026 kennen sollten"
            lead="Die wichtigsten Werte zur österreichischen Rechts- und Förderlage – regelmäßig geprüft und mit der ausführlichen Erklärung und den Quellen verlinkt."
          />
          <ul className="grid gap-4 sm:grid-cols-2">
            {fakten.map((f, i) => (
              <Reveal as="li" key={f.href} delay={i * 70} className="flex">
                <Link href={f.href} className="group ov-glass relative flex w-full flex-col rounded-3xl p-6 transition-colors hover:bg-white/[0.12] md:p-7">
                  <ArrowUpRight aria-hidden="true" className="absolute right-5 top-5 h-5 w-5 text-white/35 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ov-300" />
                  <span className="ov-num font-display text-[clamp(1.9rem,1.5rem+1.2vw,2.6rem)] font-extrabold leading-none tracking-tight text-ov-300">{f.wert}</span>
                  <span className="mt-3 text-[15px] leading-relaxed text-white/75">{f.text}</span>
                </Link>
              </Reveal>
            ))}
          </ul>
        </div>
      </Section>

      {/* ---------- Mehr Wissen + Folgen ---------- */}
      <Section tone="white" space="lg">
        <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,1fr)_420px] lg:gap-16">
          <div>
            <SectionHeading eyebrow="Mehr Wissen" title="Kurz nachschlagen oder selbst rechnen" className="mb-10" />
            <ul className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
              {[
                { icon: BookOpen, title: "Photovoltaik-Lexikon", text: `${BEGRIFFE.length} Fachbegriffe von Autarkiegrad bis Zyklenfestigkeit – jeweils mit Definition in einem Satz.`, href: "/wissen/lexikon" },
                { icon: HelpCircle, title: "Häufige Fragen", text: "Kurze Antworten zu Planung, Kosten, Speicher, Anmeldung und Service – mit Suche.", href: "/faqs" },
                { icon: Calculator, title: "Rechner", text: "Ertrag, Eigenverbrauch, Speicher und Amortisation – als erste Orientierung vor dem Angebot.", href: "/rechner" },
              ].map((k, i) => (
                <Reveal as="li" key={k.href} delay={i * 70} className="flex">
                  <Link href={k.href} className="group ov-card-hover flex w-full flex-col gap-5 rounded-3xl bg-sand-50 p-6 ring-1 ring-ink-200/60 hover:bg-white hover:ring-ov-200 lg:flex-row lg:items-center md:p-7">
                    <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-ov-500 text-white shadow-[0_12px_24px_-12px_rgba(67,102,33,0.8)]">
                      <k.icon aria-hidden="true" className="h-6 w-6" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-display text-[18px] font-bold text-ink-900 group-hover:text-ov-700">{k.title}</span>
                      <span className="mt-1.5 block text-[15px] leading-relaxed text-ink-600">{k.text}</span>
                    </span>
                    <ArrowUpRight aria-hidden="true" className="hidden h-5 w-5 shrink-0 text-ink-300 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ov-600 lg:block" />
                  </Link>
                </Reveal>
              ))}
            </ul>
          </div>
          <div>
            <p className="mb-4 font-display text-[18px] font-bold text-ink-900">Neue Fachartikel direkt in Ihren Feed</p>
            <FolgenBox konten={["ratgeber"]} pushThema="ratgeber" />
          </div>
        </div>
      </Section>

      <CtaBand
        title="Genug gelesen? Wir rechnen Ihr Projekt konkret durch."
        text="Aus Richtwerten wird ein Angebot: Wir werten Ihren Lastgang aus, prüfen Dach, Statik und Netzanschluss und planen die Anlage, die zu Ihrem Betrieb passt – Ökovolt aus Ostermiething, seit 2012 in ganz Österreich."
      />
    </>
  );
}
