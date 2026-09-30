// src/app/produkte/hersteller/page.js
//
// Herstellerübersicht Österreich. Bewusst statisch: Die Backoffice-Liste der
// deutschen Seite enthielt Marken, deren Einsatz bei der österreichischen
// Gesellschaft nicht belegt ist. Aufgeführt sind nur Marken mit `belegt` in
// @/components/Hersteller/partner (E3, Stand 30.09.2026). Keine Markenlogos
// Dritter (keine Freigabe), kein „Partner“-Status ohne Urkunde.
//
// Fronius: Firmensitz Pettenbach (OÖ), gegründet 1945, Hauptproduktion
// Sattledt (OÖ) – Quelle: https://de.wikipedia.org/wiki/Fronius_International

import Link from "next/link";
import { ArrowRight, BatteryCharging, Car, Cpu, Gauge, Headphones, HousePlug, Layers, Leaf, MapPin, ShieldCheck, Sun, Timer } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import SplitMedia from "@/components/ui/SplitMedia";
import FeatureGrid from "@/components/ui/FeatureGrid";
import Faq from "@/components/ui/Faq";
import CtaBand from "@/components/ui/CtaBand";
import Querverweise from "@/components/Reusable/Querverweise";
import HerstellerFilter from "@/components/Hersteller/HerstellerFilter";
import { herstellerId } from "@/components/Hersteller/ids";
import { BELEGT, PARTNER_KATEGORIEN, detailPfad } from "@/components/Hersteller/partner";
import { hreflangLanguages } from "@/lib/hreflang";
import { BASE_URL, FIRMA } from "@/lib/site";

const PFAD = "/produkte/hersteller";
const PAGE_URL = `${BASE_URL}${PFAD}`;

const TITLE = "PV-Hersteller im Einsatz: Fronius, Huawei, BYD | Ökovolt";
const DESCRIPTION =
  "Hersteller, die wir in Österreich verbauen: Wechselrichter von Fronius, Huawei und Solis, Speicher von BYD und Sigenergy, Monitoring von meteocontrol.";

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: ["Photovoltaik Hersteller", "Fronius Wechselrichter", "Huawei SUN2000", "BYD Battery-Box", "Sigenergy", "Solis Wechselrichter", "meteocontrol"],
  alternates: { canonical: PAGE_URL, languages: hreflangLanguages(PFAD) },
  openGraph: {
    type: "website",
    locale: "de_AT",
    url: PAGE_URL,
    siteName: "Ökovolt Österreich",
    title: TITLE,
    description: DESCRIPTION,
    images: [{ url: `${BASE_URL}/og-image.jpg`, width: 1200, height: 630, alt: "Photovoltaik-Hersteller bei Ökovolt" }],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, images: [`${BASE_URL}/og-image.jpg`] },
};

// Herstellerdaten zentral in @/components/Hersteller/partner (auch für Produktseiten und Detailseiten)
const KATEGORIEN = PARTNER_KATEGORIEN;

const FAQ = [
  {
    q: "Warum arbeitet Ökovolt nur mit ausgewählten Herstellern?",
    a: "Eine PV-Anlage läuft 25 Jahre und länger. Entscheidend sind deshalb nicht nur Datenblätter, sondern Garantiebedingungen, Ersatzteilversorgung, Service in Österreich und wie gut Module, Wechselrichter, Speicher und Regelung zusammenarbeiten. Mit einer überschaubaren Auswahl kennen wir jede Komponente aus der Praxis.",
  },
  {
    q: "Warum Fronius als österreichischer Hersteller?",
    a: "Fronius hat seinen Sitz in Pettenbach und fertigt Wechselrichter in Oberösterreich. Das bedeutet kurze Wege bei Service und Ersatzteilen und einen Hersteller, der die Anforderungen der österreichischen Netzbetreiber kennt. Welcher Wechselrichter am besten passt, entscheiden trotzdem Anlagengröße, Dachgeometrie und Speicherkonzept.",
  },
  {
    q: "Kann ich Komponenten verschiedener Marken kombinieren?",
    a: "Bei Solarmodulen in der Regel problemlos. Wechselrichter und Batteriespeicher müssen dagegen zueinander passen – viele Speicher funktionieren nur mit bestimmten Hybrid-Wechselrichtern. Am Netzanschlusspunkt regelt bei größeren Anlagen unser Parkregler Wechselrichter verschiedener Hersteller gemeinsam.",
  },
  {
    q: "Welche Module verbauen Sie?",
    a: "Die Modulwahl treffen wir projektbezogen nach Technologie, Format, geprüfter Schneelast und Garantiebedingungen – für Gewerbe und alpine Standorte überwiegend Glas-Glas-Module. Konkrete Modultypen nennen wir im Angebot mit Datenblatt.",
  },
  {
    q: "Was ist bei der Herstellergarantie wichtig?",
    a: "Achten Sie auf zwei Werte: die Produktgarantie für Material- und Verarbeitungsfehler und die Leistungsgarantie, also die garantierte Restleistung von Modulen bzw. Restkapazität von Speichern nach einer bestimmten Zeit. Die Bedingungen unterscheiden sich je Hersteller und Produktserie – wir erläutern sie im Angebot.",
  },
];

export default function HerstellerPage() {
  const alle = KATEGORIEN.flatMap((k) => k.hersteller);
  // Ziel je Marke: eigene Detailseite, sonst die Karte auf dieser Seite
  const ziel = (h) => detailPfad(BELEGT.find((p) => p.slug === h.slug)) || `#${herstellerId(h.title)}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${PAGE_URL}/#webpage`,
    url: PAGE_URL,
    name: TITLE,
    description: DESCRIPTION,
    inLanguage: "de-AT",
    isPartOf: { "@id": `${BASE_URL}/#website` },
    about: { "@id": `${BASE_URL}/#organization` },
    mainEntity: {
      "@type": "ItemList",
      name: "Hersteller, die Ökovolt in Österreich verbaut",
      numberOfItems: alle.length,
      itemListElement: BELEGT.map((h, i) => {
        const seite = detailPfad(h);
        return {
          "@type": "ListItem",
          position: i + 1,
          url: seite ? `${BASE_URL}${seite}` : `${PAGE_URL}#${herstellerId(h.title)}`,
          item: { "@type": "Brand", name: h.title, url: h.website, ...(h.sameAs?.length ? { sameAs: h.sameAs } : {}) },
        };
      }),
    },
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <PageHero
        variant="immersive"
        breadcrumbs={[{ name: "Produkte", href: "/produkte/photovoltaikanlage" }, { name: "Hersteller" }]}
        eyebrow="Hersteller & Marken"
        title={
          <>
            Hersteller, die wir <span className="ov-text-gradient-light">in Österreich verbauen</span>
          </>
        }
        lead="Wechselrichter, Speicher und Monitoring von Marken, die wir nachweislich einsetzen – allen voran Fronius aus Oberösterreich. Die Auswahl folgt Langlebigkeit, Service in Österreich und Netzkonformität, nicht dem Datenblatt allein."
        image={{ src: "/Images/AT/wissen/pv-ingenieur-tablet.jpg", alt: "Ingenieur prüft Anlagendaten auf einem Tablet vor Solarmodulen", position: "65% 35%" }}
        actions={[
          { label: "Angebot anfragen", href: "/angebot" },
          { label: "Marken ansehen", href: "#marken", icon: Layers },
        ]}
        stats={[
          { value: alle.length, label: "Hersteller im Portfolio" },
          { value: KATEGORIEN.length, label: "Produktkategorien" },
          { value: 9, label: "Bundesländer im Einzugsgebiet" },
        ]}
        badge={
          <div className="flex items-center gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-ov-500 text-white">
              <ShieldCheck aria-hidden="true" className="h-6 w-6" />
            </span>
            <div>
              <p className="font-display text-[18px] font-extrabold leading-tight text-ink-900">Ein System, das zusammenpasst</p>
              <p className="mt-1 text-[12.5px] leading-snug text-ink-500">Wechselrichter, Speicher & Regelung abgestimmt</p>
            </div>
          </div>
        }
      />

      <nav aria-label="Marken-Schnellzugriff" className="border-b border-ink-100 bg-white">
        <ul className="ov-container grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
          {alle.map((h, i) => (
            <li key={h.title} className={i > 0 ? "border-ink-100 lg:border-l" : ""}>
              <Link
                href={ziel(h)}
                className="group flex h-full flex-col items-center justify-center gap-1.5 px-3 py-7 text-center transition-colors duration-300 hover:bg-sand-50 md:py-9"
              >
                <span className="font-display text-[24px] font-extrabold tracking-[-0.03em] text-ink-300 transition-colors duration-300 group-hover:text-ink-900 md:text-[28px]">{h.title}</span>
                <span className="text-[10.5px] font-semibold uppercase tracking-[0.18em] text-ov-700/80">{h.rolle}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Fronius hervorheben */}
      <Section tone="white" space="lg">
        <SplitMedia
          eyebrow="Aus Oberösterreich"
          title="Fronius: Wechselrichter aus Österreich"
          text={[
            "Fronius wurde 1945 in Pettenbach gegründet und fertigt seine Wechselrichter bis heute in Oberösterreich, unter anderem in Sattledt – im selben Bundesland wie unser Firmensitz in Ostermiething.",
            "Für Gewerbeanlagen bedeutet das: Service und Ersatzteile aus dem Inland, ein Hersteller, der die österreichischen Netzanschlussregeln kennt, und Wertschöpfung, die im Land bleibt – ein Argument auch für Nachhaltigkeitsberichte.",
          ]}
          points={["Hybrid-Wechselrichter für Wohnhaus und Kleinbetrieb", "Geräte für Gewerbedächer und Freiflächen", "Service und Ersatzteile in Österreich"]}
          image={{ src: "/Images/Dienstleistungen/Smartphone/Fronius-Primo-5.0-1-208-240.webp", alt: "Fronius-Wechselrichter" }}
        >
          <p className="mt-6 flex items-center gap-2 text-[15px] font-medium text-ink-700">
            <MapPin aria-hidden="true" className="h-4 w-4 text-ov-600" />
            Pettenbach · Sattledt · Oberösterreich
          </p>
          <Link href="/produkte/wechselrichter/fronius" className="group mt-4 inline-flex min-h-11 items-center gap-2 text-[15px] font-semibold text-ov-700 hover:text-ov-800">
            Fronius-Wechselrichter im Detail
            <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </SplitMedia>
      </Section>

      <Section tone="sand" space="lg" id="marken" className="scroll-mt-24">
        <SectionHeading
          eyebrow="Unsere Marken"
          title={
            <>
              Hersteller, die wir <span className="ov-text-gradient">selbst verbauen</span>
            </>
          }
          lead="Module wählen wir projektbezogen nach Technologie, Schneelast und Garantie; bei Wechselrichtern, Speichern und Monitoring setzen wir auf diese Hersteller."
          className="mb-10"
        />
        <HerstellerFilter kategorien={KATEGORIEN} />
        <p className="mt-10 max-w-3xl text-[15px] leading-relaxed text-ink-600">
          Weitere verbreitete Marken vergleichen wir neutral nach Datenblatt – ohne Aussage, ob wir sie verbauen:{" "}
          <Link href="/ratgeber/wechselrichter-photovoltaik#hersteller-vergleich" className="font-semibold text-ov-700 underline decoration-ov-300 underline-offset-2 hover:text-ov-800">
            Wechselrichter und Speicher
          </Link>{" "}
          sowie{" "}
          <Link href="/ratgeber/solarmodule-vergleich#hersteller-vergleich" className="font-semibold text-ov-700 underline decoration-ov-300 underline-offset-2 hover:text-ov-800">
            Solarmodule
          </Link>
          . Wie Sie einen Errichter prüfen, zeigt unsere{" "}
          <Link href="/ratgeber/photovoltaik-angebot-vergleichen#pv-firma-pruefen" className="font-semibold text-ov-700 underline decoration-ov-300 underline-offset-2 hover:text-ov-800">
            Checkliste „PV-Firma prüfen“
          </Link>
          .
        </p>
      </Section>

      <Section tone="navy" space="lg" className="overflow-hidden">
        <div aria-hidden="true" className="ov-grid-bg absolute inset-0" />
        <div aria-hidden="true" className="absolute -left-40 top-10 h-[480px] w-[480px] rounded-full bg-ov-500/20 blur-[130px]" />
        <div className="relative">
          <SectionHeading
            dark
            eyebrow="Unsere Auswahlkriterien"
            title="Worauf wir bei jeder Marke achten"
            lead="Ein günstiges Datenblatt nützt wenig, wenn nach acht Jahren kein Ersatzteil mehr lieferbar ist. Deshalb prüfen wir Hersteller nach diesen Kriterien."
            className="mb-12"
          />
          <FeatureGrid
            cols={3}
            tone="dark"
            items={[
              { icon: Timer, title: "Langlebigkeit", text: "Belastbare Produkt- und Leistungsgarantien und Technik, die sich über viele Jahre im Feld bewährt hat." },
              { icon: Cpu, title: "Netzkonformität", text: "Konformität mit den TOR Stromerzeugungsanlagen und saubere Regelbarkeit über unseren Parkregler." },
              { icon: ShieldCheck, title: "Sicherheit", text: "Geprüfte Normkonformität, sichere Zellchemie bei Speichern und Brandschutz nach OVE-Richtlinien." },
              { icon: Headphones, title: "Service in Österreich", text: "Erreichbarer Herstellersupport und verlässliche Ersatzteilversorgung – auch Jahre nach dem Kauf." },
              { icon: Gauge, title: "Effizienz", text: "Hohe Wirkungsgrade und geringe Verluste, damit aus jedem Sonnenstrahl möglichst viel Strom wird." },
              { icon: Leaf, title: "Preis-Leistung", text: "Wir empfehlen, was sich über die Lebensdauer rechnet – nicht das teuerste oder billigste Produkt." },
            ]}
          />
        </div>
      </Section>

      <Section tone="white" space="lg">
        <SectionHeading
          eyebrow="Vom Produkt zum System"
          title="Wofür wir diese Komponenten einsetzen"
          lead="Die richtige Marke ist nur die halbe Miete – entscheidend ist, wie Erzeugung, Speicher und Verbraucher am Standort zusammenspielen."
          className="mb-12"
        />
        <FeatureGrid
          cols={4}
          items={[
            { icon: Sun, title: "Photovoltaikanlage", text: "Module, Unterkonstruktion und Wechselrichter für Dach und Freifläche.", href: "/produkte/photovoltaikanlage" },
            { icon: BatteryCharging, title: "Stromspeicher", text: "Heim- und Gewerbespeicher für Eigenverbrauch und Peak Shaving.", href: "/produkte/stromspeicher" },
            { icon: Car, title: "Ladeinfrastruktur", text: "Laden für Flotte, Mitarbeitende und Kundschaft.", href: "/ladeinfrastruktur" },
            { icon: HousePlug, title: "Parkregler", text: "Alle Wechselrichter am Netzanschlusspunkt gemeinsam geregelt.", href: "/technik/parkregler" },
          ]}
        />
      </Section>

      <Section tone="sand" space="lg">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <SectionHeading
            eyebrow="Häufige Fragen"
            title="Hersteller & Komponenten – ehrlich beantwortet"
            lead="Sie haben eine bestimmte Marke im Blick? Sprechen Sie uns an – wir sagen Ihnen offen, ob sie zu Ihrem Projekt passt."
          />
          <Faq items={FAQ} />
        </div>
      </Section>

      <Querverweise pfad={PFAD} />
      <CtaBand
        title="Markenqualität, sauber errichtet."
        text={`${FIRMA.name} aus ${FIRMA.ort} stellt aus bewährten Herstellern ein System zusammen, das zu Standort, Lastgang und Budget passt – mit Planung, Errichtung und Netzanschluss aus einer Hand.`}
        primary={{ label: "Angebot anfragen", href: "/angebot" }}
        secondary={{ label: "Speichergröße berechnen", href: "/rechner/stromspeicher" }}
      />
    </div>
  );
}
