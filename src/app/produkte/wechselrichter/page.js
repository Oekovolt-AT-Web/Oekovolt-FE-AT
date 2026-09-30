// src/app/produkte/wechselrichter/page.js
//
// Wechselrichter-Übersicht Österreich (Paket P4, M18, Stand 30.09.2026).
// Marken ausschließlich aus @/components/Hersteller/partner mit `belegt` und Kontext
// „wechselrichter“ (E3: Fronius, Huawei, Solis). Keine Logos, keine Partner-Aussage,
// keine Service-Zusage für andere Hersteller (E4 offen). Kennwerte aus den Datenblättern,
// die in partner.js mit Version und Abrufdatum hinterlegt sind.
// Neutrale Vergleiche weiterer Marken: Ratgeber /ratgeber/wechselrichter-photovoltaik#hersteller-vergleich.

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen, Cpu, Gauge, LayoutGrid, MonitorCog, ShieldCheck, SlidersHorizontal, Sun } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import FeatureGrid from "@/components/ui/FeatureGrid";
import Faq from "@/components/ui/Faq";
import CtaBand from "@/components/ui/CtaBand";
import Reveal from "@/components/ui/Reveal";
import { DATENBLATT_ABRUF, partnerFuer } from "@/components/Hersteller/partner";
import { BASE_URL, FIRMA } from "@/lib/site";

const PFAD = "/produkte/wechselrichter";
const PAGE_URL = `${BASE_URL}${PFAD}`;

const TITLE = "Wechselrichter Gewerbe-PV: Fronius, Huawei, Solis | Ökovolt";
const DESCRIPTION =
  "Wechselrichter für Gewerbe-PV in Österreich: Fronius, Huawei und Solis bei Ökovolt verbaut – nach TOR Erzeuger ausgelegt, mit Parkregler und Monitoring.";

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: ["Wechselrichter Gewerbe", "Wechselrichter Photovoltaik Österreich", "Fronius Tauro", "Huawei SUN2000", "Solis Wechselrichter", "String-Wechselrichter"],
  // Nur in Österreich vorhanden – kein hreflang-Paar mit oekovolt.de
  alternates: { canonical: PAGE_URL },
  openGraph: {
    type: "website",
    locale: "de_AT",
    url: PAGE_URL,
    siteName: "Ökovolt Österreich",
    title: TITLE,
    description: DESCRIPTION,
    images: [{ url: `${BASE_URL}/og-image.jpg`, width: 1200, height: 630, alt: "Wechselrichter für Gewerbe-PV bei Ökovolt" }],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, images: [`${BASE_URL}/og-image.jpg`] },
};

const FAQ = [
  {
    q: "Welche Wechselrichter verbaut Ökovolt?",
    a: "In Österreich setzen wir Wechselrichter von Fronius, Huawei und Solis ein. Welche Marke und welches Gerät passt, hängt von Dachgeometrie, Anlagengröße, Speicherkonzept und den Vorgaben des Netzbetreibers ab – wir begründen die Wahl im Angebot mit Datenblatt.",
  },
  {
    q: "Warum String-Wechselrichter statt eines Zentralwechselrichters?",
    a: "Auf Gewerbedächern und bei den meisten Freiflächen bis in den Megawattbereich bieten String-Wechselrichter mehr MPP-Tracker, eine geringere Ausfallwirkung und einen einfacheren Tausch. Zentralwechselrichter lohnen sich vor allem bei sehr großen, einheitlichen Feldern.",
  },
  {
    q: "Muss der Wechselrichter auf der Wechselrichterliste stehen?",
    a: "In Österreich müssen Wechselrichter die TOR Stromerzeugungsanlagen erfüllen. Die Liste auf wechselrichterliste.at von Oesterreichs Energie führt Geräte mit geprüften Nachweisen, auf die die Verteilernetzbetreiber zugreifen. Die Konformität weisen wir bei der Netzanmeldung nach.",
  },
  {
    q: "Gibt es mehr Förderung für europäische Wechselrichter?",
    a: "Beim EAG-Investitionszuschuss erhöht sich die Förderung um 10 %, wenn die Wechselrichter nachweislich in der EU, im EWR oder in der Schweiz gefertigt wurden (§ 6 EAG-Investitionszuschüsseverordnung-Strom). Ob ein konkretes Gerät den Zuschlag erhält, hängt vom Nachweis über die Herstellerliste der EAG-Abwicklungsstelle ab – das prüfen wir je Angebot.",
  },
  {
    q: "Ich habe ein Angebot mit einer anderen Wechselrichter-Marke. Ist das schlechter?",
    a: "Nicht automatisch. Entscheidend sind Netzkonformität, passende MPP-Tracker und Spannungen, Service in Österreich und Garantiebedingungen. Datenblattwerte verbreiteter Marken vergleicht unser Ratgeber neutral; wie Sie das Angebot insgesamt prüfen, zeigt die Checkliste zum Angebotsvergleich.",
  },
];

export default function WechselrichterPage() {
  const marken = partnerFuer("wechselrichter");

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${PAGE_URL}/#webpage`,
        url: PAGE_URL,
        name: TITLE,
        description: DESCRIPTION,
        inLanguage: "de-AT",
        isPartOf: { "@id": `${BASE_URL}/#website` },
        about: { "@id": `${PAGE_URL}/#service` },
        mainEntity: {
          "@type": "ItemList",
          name: "Wechselrichter-Marken, die Ökovolt in Österreich verbaut",
          numberOfItems: marken.length,
          itemListElement: marken.map((m, i) => ({
            "@type": "ListItem",
            position: i + 1,
            url: `${BASE_URL}${PFAD}/${m.slug}`,
            item: { "@type": "Brand", name: m.title, url: m.website, ...(m.sameAs?.length ? { sameAs: m.sameAs } : {}) },
          })),
        },
      },
      {
        "@type": "Service",
        "@id": `${PAGE_URL}/#service`,
        name: "Auslegung und Installation von Wechselrichtern für Photovoltaikanlagen",
        serviceType: "Planung und Installation von PV-Wechselrichtern",
        provider: { "@id": `${BASE_URL}/#organization` },
        areaServed: { "@type": "Country", name: "Österreich" },
        brand: marken.map((m) => ({ "@type": "Brand", name: m.title, url: m.website, ...(m.sameAs?.length ? { sameAs: m.sameAs } : {}) })),
        url: PAGE_URL,
      },
    ],
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <PageHero
        variant="immersive"
        breadcrumbs={[{ name: "Produkte", href: "/produkte/photovoltaikanlage" }, { name: "Wechselrichter" }]}
        eyebrow="Komponenten · Wechselrichter"
        title={
          <>
            Wechselrichter für Gewerbe-PV – <span className="ov-text-gradient-light">nach TOR ausgelegt</span>
          </>
        }
        lead="Der Wechselrichter entscheidet über Ertrag, Netzkonformität und Ausfallrisiko Ihrer Anlage. Wir verbauen Geräte von Fronius, Huawei und Solis und legen sie nach Dachflächen, Lastgang und Vorgaben des Netzbetreibers aus – bei größeren Anlagen zusammen mit unserem eigenen Parkregler."
        image={{ src: "/Images/AT/ratgeber/eza-regler-parkregler.jpg", alt: "Wechselrichter und Regelungstechnik einer Gewerbe-PV-Anlage" }}
        actions={[
          { label: "Angebot anfragen", href: "/angebot" },
          { label: "Ratgeber Wechselrichter", href: "/ratgeber/wechselrichter-photovoltaik", icon: BookOpen },
        ]}
        points={["Fronius, Huawei und Solis", "TOR-Erzeuger-Nachweise inklusive", "Parkregler und Monitoring aus einer Hand"]}
      />

      <Section tone="white" space="lg" id="marken">
        <SectionHeading
          eyebrow="Bei Ökovolt verbaut"
          title={
            <>
              Drei Marken, <span className="ov-text-gradient">jede mit eigener Stärke</span>
            </>
          }
          lead="Wir führen bewusst wenige Wechselrichter-Marken. So kennen wir Parametrierung, Kommunikation und Fehlerbilder jedes Geräts aus der Praxis."
          className="mb-12"
        />
        <ul className="grid gap-5 md:grid-cols-3">
          {marken.map((m, i) => (
            <Reveal as="li" key={m.slug} delay={i * 80} className="flex">
              <Link href={`${PFAD}/${m.slug}`} className="group ov-card-hover flex w-full flex-col overflow-hidden rounded-3xl bg-white ring-1 ring-ink-200/70 hover:ring-ov-200">
                <div className="relative aspect-[16/10] overflow-hidden bg-ink-100">
                  <Image src={m.bild} alt={m.alt_banner_image || m.title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  {m.tag && <p className="mb-2 inline-flex self-start rounded-full bg-ov-50 px-3 py-1 text-[12px] font-semibold text-ov-700 ring-1 ring-ov-200">{m.tag}</p>}
                  <h2 className="font-display text-[22px] font-extrabold text-ink-900 transition-colors group-hover:text-ov-700">{m.title}</h2>
                  <p className="mt-2 text-[14.5px] leading-relaxed text-ink-600">{m.main_description}</p>
                  {m.datenblatt?.referenz && (
                    <p className="mt-4 text-[13px] text-ink-500">
                      Referenzgerät: <span className="font-semibold text-ink-700">{m.datenblatt.referenz.modell}</span> · {m.datenblatt.referenz.mpp} MPP-Tracker · {m.datenblatt.referenz.ac}
                    </p>
                  )}
                  <span className="mt-auto inline-flex items-center gap-2 pt-5 text-[14.5px] font-semibold text-ov-700">
                    {m.title}-Wechselrichter im Detail
                    <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </ul>
      </Section>

      <Section tone="sand" space="lg" id="kennwerte">
        <SectionHeading
          eyebrow="Datenblattwerte"
          title="Referenzgeräte der 100-kW-Klasse im Überblick"
          lead="Die Tabelle zeigt je Marke ein Gewerbegerät, wie es auf Hallendächern und Freiflächen typisch ist. Sie ersetzt keine Auslegung: Welches Gerät passt, hängt von Modulen, Stringlängen und Netzanschluss ab."
          className="mb-10"
        />
        <div className="overflow-x-auto rounded-3xl bg-white ring-1 ring-ink-200/70">
          <table className="w-full min-w-[760px] text-left text-[14.5px]">
            <caption className="sr-only">Datenblattwerte der Referenz-Wechselrichter von Fronius, Huawei und Solis</caption>
            <thead className="bg-navy-950 text-white">
              <tr>
                {["Gerät", "AC-Nennleistung", "Max. / europ. Wirkungsgrad", "MPP-Tracker", "Max. DC-Spannung", "Schutzart", "Gewicht"].map((k) => (
                  <th key={k} scope="col" className="px-5 py-3.5 font-semibold">
                    {k}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              {marken
                .filter((m) => m.datenblatt?.referenz)
                .map((m) => {
                  const r = m.datenblatt.referenz;
                  return (
                    <tr key={m.slug} className="align-top">
                      <th scope="row" className="px-5 py-3.5 font-semibold text-ink-900">
                        {m.title} {r.modell}
                      </th>
                      <td className="px-5 py-3.5 text-ink-700">{r.ac}</td>
                      <td className="px-5 py-3.5 text-ink-700">{r.wirkungsgrad}</td>
                      <td className="px-5 py-3.5 text-ink-700">{r.mpp}</td>
                      <td className="px-5 py-3.5 text-ink-700">{r.dcMax}</td>
                      <td className="px-5 py-3.5 text-ink-700">{r.schutzart}</td>
                      <td className="px-5 py-3.5 text-ink-700">{r.gewicht}</td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
        <ul className="mt-5 space-y-1.5 text-[13px] leading-relaxed text-ink-500">
          {marken
            .filter((m) => m.datenblatt)
            .map((m) => (
              <li key={m.slug}>
                {m.title}:{" "}
                <a href={m.datenblatt.url} target="_blank" rel="noopener noreferrer" className="font-medium text-ov-700 underline decoration-ov-300 underline-offset-2">
                  {m.datenblatt.titel}
                </a>
                , {m.datenblatt.version}, abgerufen am {DATENBLATT_ABRUF}.
              </li>
            ))}
        </ul>
        <p className="mt-4 max-w-3xl text-[14.5px] leading-relaxed text-ink-600">
          Weitere verbreitete Marken vergleicht der Ratgeber neutral nach Datenblatt – ohne Aussage, ob wir sie verbauen:{" "}
          <Link href="/ratgeber/wechselrichter-photovoltaik#hersteller-vergleich" className="font-semibold text-ov-700 underline decoration-ov-300 underline-offset-2 hover:text-ov-800">
            Wechselrichter im Datenblattvergleich
          </Link>
          .
        </p>
      </Section>

      <Section tone="navy" space="lg" className="overflow-hidden">
        <div aria-hidden="true" className="ov-grid-bg absolute inset-0" />
        <div aria-hidden="true" className="absolute -right-40 top-10 h-[420px] w-[420px] rounded-full bg-ov-500/20 blur-[130px]" />
        <div className="relative">
          <SectionHeading
            dark
            eyebrow="Auslegung"
            title="Worauf es bei der Wahl des Wechselrichters ankommt"
            lead="Der Wirkungsgrad guter Geräte unterscheidet sich kaum. Den Unterschied machen Tracker, Spannungen, Netzfunktionen und die Einbindung ins Gesamtsystem."
            className="mb-12"
          />
          <FeatureGrid
            cols={3}
            tone="dark"
            items={[
              { icon: LayoutGrid, title: "MPP-Tracker je Dachfläche", text: "Unterschiedlich ausgerichtete oder verschattete Flächen bekommen eigene Tracker – ein Gerät mit einem Tracker passt nur zu einheitlichen Feldern." },
              { icon: Gauge, title: "DC/AC-Verhältnis", text: "Meist 1,2 bis 1,4: Der Wechselrichter wird kleiner als die Modulleistung ausgelegt, weil Module ihre Nennleistung selten erreichen." },
              { icon: Sun, title: "Spannung bei Frost und Hitze", text: "Die Stringspannung muss bei Frost unter der maximalen DC-Spannung (1.000 oder 1.100 V) und bei Hitze im MPP-Bereich bleiben." },
              { icon: ShieldCheck, title: "TOR Erzeuger", text: "Nachweise für den Netzbetreiber; ab 250 kW Maximalkapazität gilt die Anlage als Typ B mit erweiterten Anforderungen." },
              { icon: SlidersHorizontal, title: "Parkregler", text: "Mehrere Wechselrichter an einem Netzanschlusspunkt regelt unser Parkregler gemeinsam – Wirkleistung, Blindleistung, Einspeiselimit.", href: "/technik/parkregler" },
              { icon: MonitorCog, title: "Monitoring und IT", text: "Wechselrichter sind vernetzte Geräte: eigenes Netzsegment, abgesicherte Fernzugriffe und Überwachung über unsere Fernwartung.", href: "/technik/fernwartung" },
            ]}
          />
          <p className="mt-10 text-[15px] leading-relaxed text-white/70">
            Ausführlich mit Clipping-Auswertung, TOR-Typen und Rechenbeispiel:{" "}
            <Link href="/ratgeber/wechselrichter-photovoltaik" className="font-semibold text-ov-300 underline decoration-ov-500/50 underline-offset-2 hover:text-ov-200">
              Ratgeber Wechselrichter für Photovoltaik
            </Link>
            .
          </p>
        </div>
      </Section>

      <Section tone="white" space="lg">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div>
            <SectionHeading eyebrow="Häufige Fragen" title="Wechselrichter – kurz beantwortet" />
            <div className="mt-8 flex flex-col gap-3">
              {[
                { href: "/produkte/hersteller", label: "Alle Hersteller im Überblick", icon: Cpu },
                { href: "/ratgeber/photovoltaik-angebot-vergleichen#pv-firma-pruefen", label: "Checkliste „PV-Firma prüfen“", icon: ShieldCheck },
                { href: "/service/repowering", label: "Wechselrichter tauschen beim Repowering", icon: SlidersHorizontal },
              ].map(({ href, label, icon: Icon }) => (
                <Link key={href} href={href} className="group inline-flex min-h-11 items-center gap-3 text-[15px] font-semibold text-ov-700 hover:text-ov-800">
                  <Icon aria-hidden="true" className="h-4 w-4 shrink-0" />
                  {label}
                  <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              ))}
            </div>
          </div>
          <Faq items={FAQ} />
        </div>
      </Section>

      <CtaBand
        title="Der passende Wechselrichter für Ihr Dach – sauber ausgelegt."
        text={`${FIRMA.name} aus ${FIRMA.ort} plant Wechselrichter, Parkregler und Monitoring aus einer Hand – für Betriebe, Landwirtschaft und Gemeinden in ganz Österreich.`}
        primary={{ label: "Angebot anfragen", href: "/angebot" }}
        secondary={{ label: "Parkregler", href: "/technik/parkregler" }}
      />
    </div>
  );
}
