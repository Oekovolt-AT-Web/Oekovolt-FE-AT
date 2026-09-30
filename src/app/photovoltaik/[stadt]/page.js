import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ArrowUpRight, CalendarCheck2, Compass, Factory, Gauge, HandCoins, MapPin, MonitorCog, Route, Smartphone, Sun, Wrench } from "lucide-react";

import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import FeatureGrid from "@/components/ui/FeatureGrid";
import Faq from "@/components/ui/Faq";
import CtaBand from "@/components/ui/CtaBand";
import Reveal from "@/components/ui/Reveal";
import ProjektKarte from "@/components/Project/ProjektKarte";
import RegionErtrag from "@/components/Region/RegionErtrag";
import RegionFakten from "@/components/Region/RegionFakten";
import RegionLageKarte from "@/components/Region/RegionLageKarte";
import Kennzahlenband from "@/components/Produktdetail/Kennzahlenband";
import { landesBild } from "@/components/Region/landesBilder";
import { ladeProjekte } from "@/components/Project/ladeProjekte";
import { REGIONEN } from "@/data/regionen";
import { FIRMENSITZ_KOORD, ZONEN, naechsteReferenzen, nachbarn, pvgisQuelle, pvgisReferenz, regionFuer } from "@/lib/regionen";
import { BASE_URL, LOCALE, SITE_NAME } from "@/lib/site";
import { landPfad } from "@/lib/bundesland/auswertung";

export const revalidate = 3600;
export const dynamicParams = false;

const HUB = "Photovoltaik Österreich";

export function generateStaticParams() {
  return Object.keys(REGIONEN).map((stadt) => ({ stadt }));
}

export async function generateMetadata({ params }) {
  const { stadt } = await params;
  const r = regionFuer(stadt);
  if (!r) return {};
  const url = `${BASE_URL}/photovoltaik/${r.slug}`;
  return {
    title: r.seoTitel,
    description: r.beschreibung,
    alternates: { canonical: url },
    openGraph: { type: "website", locale: LOCALE, url, siteName: SITE_NAME, title: r.seoTitel, description: r.beschreibung, images: [{ url: `${BASE_URL}/og-image.jpg`, width: 1200, height: 630 }] },
  };
}

// Leistungsumfang je Entfernung – bewusst ehrlich formuliert, keine Reaktionszeit-Zusagen
const UMFANG = {
  1: {
    titel: "So arbeiten wir in",
    punkte: [
      { icon: CalendarCheck2, title: "Begehung vor Ort", text: "Dach, Statikunterlagen, Trafo- und Zählerraum sehen wir uns bei Ihnen an – für Gewerbe, Landwirtschaft und Gemeinden ebenso wie für Wohnanlagen." },
      { icon: Wrench, title: "Montage aus Ostermiething", text: "Planung, Montage, Netzanschluss beim Verteilnetzbetreiber und Inbetriebnahme aus einer Hand – mit eigenen Teams aus dem Innviertel." },
      { icon: Route, title: "Service in der Heimatregion", text: "Wartung, E-Check und Störungsbehebung mit kurzen Wegen; auf Wunsch mit Wartungsvertrag und festem Ansprechpartner." },
    ],
  },
  2: {
    titel: "So arbeiten wir in",
    punkte: [
      { icon: Smartphone, title: "Vorplanung mit Ihren Daten", text: "Lastgang, Stromrechnung, Dachpläne und Fotos reichen für eine belastbare Vorplanung. Die Begehung vor Ort vereinbaren wir vor dem verbindlichen Angebot." },
      { icon: Factory, title: "Gewerbe, Industrie, Landwirtschaft", text: "Dach-, Carport- und Freiflächenanlagen inklusive Speicher, Ladeinfrastruktur und EZA-Regelung am Netzanschlusspunkt." },
      { icon: MonitorCog, title: "Überwachung aus der Ferne", text: "Eigene Fernwartungs- und SCADA-Systeme melden Abweichungen; Vor-Ort-Einsätze planen wir gebündelt und frühzeitig." },
    ],
  },
  3: {
    titel: "Unser Angebot für",
    punkte: [
      { icon: Sun, title: "Schwerpunkt größere Anlagen", text: "In dieser Entfernung bauen wir vor allem für Unternehmen, Industrie, Landwirtschaft und öffentliche Hand. Private Anfragen prüfen wir im Einzelfall." },
      { icon: Smartphone, title: "Digitale Vorplanung", text: "Lastgangdaten, Pläne und Fotos genügen für eine erste Auslegung und Wirtschaftlichkeitsrechnung – ohne dass jemand anreisen muss." },
      { icon: MonitorCog, title: "Betrieb mit Fernüberwachung", text: "Monitoring über eigene Fernwartung und SCADA; Service-Einsätze werden gebündelt und im Voraus geplant." },
    ],
  },
};


export default async function RegionSeite({ params }) {
  const { stadt } = await params;
  const r = regionFuer(stadt);
  if (!r) notFound();

  const referenzen = naechsteReferenzen(r, await ladeProjekte());
  const umgebung = nachbarn(r);
  const { quelle, abgerufen, routeQuelle } = pvgisQuelle();
  const url = `${BASE_URL}/photovoltaik/${r.slug}`;
  const umfang = UMFANG[r.zone];
  const name = r.kurzname || r.name;
  const bild = r.bild || landesBild(r.land);
  const netz = r.fakten.netzbetreiber;
  const winter = Math.round(([0, 1, 10, 11].reduce((s, i) => s + r.pvgis.monate_sued35[i], 0) / r.pvgis.sued35_kwh_kwp) * 100);

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "Service",
                name: `Photovoltaik für Gewerbe und Industrie in ${r.name}`,
                serviceType: "Planung, Errichtung und Betrieb von Photovoltaikanlagen",
                provider: { "@id": `${BASE_URL}/#organization` },
                areaServed: {
                  "@type": "City",
                  name: r.name,
                  containedInPlace: { "@type": "AdministrativeArea", name: r.bundesland, containedInPlace: { "@type": "Country", name: "Österreich" } },
                },
                url,
                description: r.beschreibung,
              },
              { "@type": "FAQPage", mainEntity: r.faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
              // BreadcrumbList kommt aus der sichtbaren Brotkrumen-Navigation (src/components/ui/Breadcrumbs.js) – hier nicht doppelt (QA N3)
            ],
          }),
        }}
      />

      <PageHero
        variant="immersive"
        breadcrumbs={[{ name: HUB, href: "/photovoltaik" }, { name: r.name }]}
        eyebrow={r.eyebrow || `Photovoltaik in ${name}`}
        title={
          <>
            {r.titel.replace(/ –$/, " –")} <span className="ov-text-gradient-light">{r.akzent}</span>
          </>
        }
        lead={r.lead}
        image={bild}
        actions={[
          { label: r.zone === 3 ? "Projekt besprechen" : "Beratung vereinbaren", href: r.zone === 1 ? "/termin?art=vor-ort" : "/termin?art=video" },
          { label: "Ertrag berechnen", href: "/solarrechner", icon: Sun },
        ]}
        points={[
          r.heimat ? "Firmensitz Ostermiething" : `${r.km} km ab Ostermiething`,
          `${r.bezirk} · ${r.bundesland}`,
          netz?.kurz || netz?.name ? `Netz: ${netz.kurz || netz.name}` : null,
        ].filter(Boolean)}
      />

      <Kennzahlenband
        tone="light"
        items={[
          { value: r.pvgis.sued35_kwh_kwp, suffix: " kWh", label: `simulierter Jahresertrag je kWp in ${name} (Süd, 35°)` },
          r.heimat ? { wert: "0 km", label: "hier sitzen Planung, Lager und Montage-Teams" } : { value: r.pvgis.strasse_km || r.km, suffix: " km", label: r.pvgis.strasse_km ? "Straße ab Firmensitz Ostermiething" : "Luftlinie ab Firmensitz Ostermiething" },
          { value: winter, suffix: " %", label: "des Jahresertrags entfallen auf November bis Februar" },
          { value: r.pvgis.hoehe_m, suffix: " m", label: "Seehöhe am Referenzpunkt Ortszentrum" },
        ]}
      />

      <Section tone="white" space="lg">
        <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-20">
          <div>
            <SectionHeading eyebrow={`Photovoltaik in ${name}`} title={r.einleitungTitel} />
            <div className="mt-6 space-y-4 text-[16.5px] leading-relaxed text-ink-700">
              {r.einleitung.map((absatz) => (
                <p key={absatz.slice(0, 40)}>{absatz}</p>
              ))}
            </div>
          </div>
          <ol className="grid content-start gap-4">
            {r.schwerpunkte.map((s, i) => (
              <Reveal as="li" key={s.titel} delay={i * 90} className="ov-card-hover relative overflow-hidden rounded-3xl bg-sand-50 p-6 ring-1 ring-ink-200/60 md:p-7">
                <span aria-hidden="true" className="ov-num absolute right-5 top-4 font-display text-[44px] font-extrabold leading-none text-ink-200/80">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="pr-14 font-display text-[19px] font-bold text-ink-900">{s.titel}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-ink-700">{s.text}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </Section>

      {/* Lage, Anfahrt und Netz */}
      <Section tone="sand" space="lg" id="lage">
        <SectionHeading
          eyebrow={ZONEN[r.zone].label}
          title={r.heimat ? "Unser Firmensitz im Innviertel" : `Von Ostermiething nach ${name}`}
          lead={r.heimat ? "Von hier aus planen, bauen und betreuen wir Anlagen in allen neun Bundesländern." : `${ZONEN[r.zone].label} (${ZONEN[r.zone].kurz}). So kommen wir zu Ihnen – und so erreicht Ihre Anlage das Netz.`}
          className="mb-10"
        />
        <div className="grid gap-5 lg:grid-cols-[1.35fr_1fr]">
          <Reveal dir="scale">
            <RegionLageKarte region={r} firmensitz={FIRMENSITZ_KOORD} routeQuelle={routeQuelle} />
          </Reveal>
          {netz?.name && (
            <Reveal delay={120} className="flex">
              <article className="relative flex w-full flex-col overflow-hidden rounded-[2rem] bg-white p-7 shadow-xl ring-1 ring-ink-200/70 md:p-8">
                <div aria-hidden="true" className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-ov-100 blur-2xl" />
                <p className="relative flex items-center gap-2 text-[12.5px] font-semibold uppercase tracking-[0.14em] text-ov-700">
                  <Gauge aria-hidden="true" className="h-4 w-4" />
                  Ihr Verteilnetzbetreiber
                </p>
                <h3 className="relative mt-4 font-display text-[26px] font-extrabold leading-tight text-ink-900 md:text-[30px]">{netz.name}</h3>
                {netz.hinweis && <p className="relative mt-3 text-[14.5px] leading-relaxed text-ink-600">{netz.hinweis}</p>}
                <ol className="relative mt-6 space-y-3">
                  {["Netzanfrage und Netzzugangsantrag", "Abstimmung der Anschlussleistung, bei Bedarf Einspeisebegrenzung", "Fertigstellungsmeldung – Bestätigung auch für das OeMAG-Förderansuchen"].map((t, i) => (
                    <li key={t} className="flex items-start gap-3 text-[14.5px] leading-snug text-ink-700">
                      <span className="ov-num flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-navy-950 text-[12px] font-bold text-white">{i + 1}</span>
                      {t}
                    </li>
                  ))}
                </ol>
                <p className="relative mt-5 text-[13.5px] text-ink-500">Diese Schritte übernehmen wir für Sie.</p>
                <div className="relative mt-auto flex flex-wrap gap-x-5 gap-y-2 pt-6">
                  {netz.url && (
                    <a href={netz.url} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-1 text-[13.5px] font-semibold text-ov-700 underline decoration-ov-300 underline-offset-2 hover:decoration-current">
                      Website des Netzbetreibers
                      <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
                      <span className="sr-only">(öffnet neues Fenster)</span>
                    </a>
                  )}
                  <a href="https://www.e-control.at/tarifkalkulator" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-1 text-[13.5px] font-semibold text-ov-700 underline decoration-ov-300 underline-offset-2 hover:decoration-current">
                    E-Control Tarifkalkulator (PLZ-Abfrage)
                    <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
                    <span className="sr-only">(öffnet neues Fenster)</span>
                  </a>
                </div>
              </article>
            </Reveal>
          )}
        </div>
      </Section>

      {r.wirtschaft && (
        <Section tone="white" space="lg">
          <SectionHeading eyebrow="Wirtschaftsstandort" title={r.wirtschaft.titel} lead={r.wirtschaft.text} className="mb-10" />
          <div className={`grid gap-4 md:grid-cols-2 ${r.wirtschaft.punkte.length % 3 === 0 ? "lg:grid-cols-3" : "lg:grid-cols-2"}`}>
            {r.wirtschaft.punkte.map((w, i) => (
              <Reveal key={w.titel} delay={i * 70} className="flex">
                <div className="flex w-full items-start gap-4 rounded-3xl bg-sand-50 p-6 ring-1 ring-ink-200/60">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-ov-600 shadow-sm ring-1 ring-ov-200">
                    <Factory aria-hidden="true" className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="font-display text-[18px] font-bold text-ink-900">{w.titel}</h3>
                    <p className="mt-2 text-[15px] leading-relaxed text-ink-700">{w.text}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
          {r.wirtschaft.url && (
            <p className="mt-6 text-[12.5px] text-ink-600">
              Quelle:{" "}
              <a href={r.wirtschaft.url} target="_blank" rel="noopener noreferrer" className="underline decoration-ink-300 underline-offset-2 hover:decoration-current">
                {r.wirtschaft.quelle || "Wikipedia"}
              </a>
              . Genannte Unternehmen und Standorte beschreiben die regionale Wirtschaft – sie sind keine Referenzen von Ökovolt.
            </p>
          )}
        </Section>
      )}

      {/* Dunkle Kontrast-Sektion: Ertrag */}
      <Section tone="navy" space="lg" className="overflow-hidden">
        <div aria-hidden="true" className="ov-grid-bg absolute inset-0" />
        <div aria-hidden="true" className="absolute -left-40 top-20 h-[460px] w-[460px] rounded-full bg-ov-500/20 blur-[130px]" />
        <div aria-hidden="true" className="absolute -right-32 bottom-0 h-[380px] w-[380px] rounded-full bg-sun-400/15 blur-[130px]" />
        <div className="relative">
          <SectionHeading
            dark
            eyebrow="Sonne in Zahlen"
            title={
              <>
                So viel Solarstrom bringt ein Dach <span className="ov-text-gradient-light">in {name}</span>
              </>
            }
            className="mb-10"
          />
          <RegionErtrag dunkel name={name} ort={r.pvgis} referenz={pvgisReferenz()} istReferenz={r.heimat} quelle={quelle} abgerufen={abgerufen} />
        </div>
      </Section>

      <Section tone="sand" space="lg">
        <SectionHeading
          eyebrow="Vor Ort"
          title={`Baurecht und Förderung in ${name}`}
          lead={`Recherchiert zum Stand ${r.fakten.stand ? new Date(r.fakten.stand).toLocaleDateString("de-AT") : "September 2026"} – jede Angabe mit Quelle. Förderungen und Netzbedingungen ändern sich; wir prüfen den aktuellen Stand im Angebot erneut.`}
          className="mb-10"
        />
        <RegionFakten region={r} ohne={netz?.name ? ["netz", "anfahrt"] : ["anfahrt"]} />
      </Section>

      <Section tone="white" space="lg">
        <SectionHeading eyebrow={ZONEN[r.zone].label} title={`${umfang.titel} ${name}`} className="mb-10" />
        <FeatureGrid cols={3} items={umfang.punkte} />
      </Section>

      {referenzen.length > 0 && (
        <Section tone="sand" space="lg">
          <SectionHeading
            eyebrow="Referenzen"
            title={referenzen[0].abstand <= 30 ? `Unsere Projekte in der Nähe von ${name}` : "Unsere nächstgelegenen Projekte"}
            lead={referenzen[0].abstand <= 30 ? "Echte Anlagen aus unserem Portfolio – mit Entfernung zum Ortszentrum." : `Direkt in ${name} zeigen wir noch kein Projekt. Das sind die nächstgelegenen Anlagen aus unserem Portfolio.`}
            className="mb-10"
          />
          <div className="grid gap-5 md:grid-cols-3">
            {referenzen.map((p) => (
              <div key={p.slug}>
                <ProjektKarte projekt={p} />
                <p className="mt-2 flex items-center gap-1.5 text-[13px] text-ink-600">
                  <MapPin aria-hidden="true" className="h-3.5 w-3.5 text-ov-600" />
                  rund {p.abstand} km von {name}
                </p>
              </div>
            ))}
          </div>
        </Section>
      )}

      <Section tone={referenzen.length > 0 ? "white" : "sand"} space="lg">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <SectionHeading eyebrow="Häufige Fragen" title={`Photovoltaik in ${name}: gut zu wissen`} />
          <Faq items={r.faq} schema={false} />
        </div>
      </Section>

      <Section tone={referenzen.length > 0 ? "sand" : "white"} space="md">
        <SectionHeading eyebrow="Weitere Standorte" title={`Photovoltaik rund um ${name}`} className="mb-8" />
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {umgebung.map((n, i) => {
            const nb = n.bild || landesBild(n.land);
            return (
              <Reveal as="li" key={n.slug} delay={i * 70} className="flex">
                <Link href={`/photovoltaik/${n.slug}`} className="group relative isolate flex min-h-[132px] w-full flex-col justify-end overflow-hidden rounded-2xl p-4 text-white ring-1 ring-black/5">
                  <span aria-hidden="true" className="absolute inset-0 -z-10 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: `url(${nb.src})`, backgroundPosition: nb.position }} />
                  <span aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-navy-950/90 via-navy-950/45 to-navy-950/10" />
                  <span className="block font-display text-[17px] font-bold">Photovoltaik {n.kurzname || n.name}</span>
                  <span className="mt-0.5 flex items-center justify-between gap-2 text-[13px] text-white/75">
                    {n.abstand} km entfernt · {n.bundesland}
                    <ArrowRight aria-hidden="true" className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </ul>
        <div className="mt-6 flex flex-wrap gap-x-8 gap-y-3">
          <Link href="/photovoltaik" className="inline-flex min-h-11 items-center gap-2 text-[15px] font-semibold text-ov-700 underline decoration-ov-300 underline-offset-4 hover:decoration-current">
            <Compass aria-hidden="true" className="h-4 w-4" />
            Alle Standorte in Österreich
          </Link>
          <Link href={landPfad(r.land)} className="inline-flex min-h-11 items-center gap-2 text-[15px] font-semibold text-ov-700 underline decoration-ov-300 underline-offset-4 hover:decoration-current">
            <MapPin aria-hidden="true" className="h-4 w-4" />
            Photovoltaik {r.bundesland} im Überblick
          </Link>
          <Link href={r.foerderHref} className="inline-flex min-h-11 items-center gap-2 text-[15px] font-semibold text-ov-700 underline decoration-ov-300 underline-offset-4 hover:decoration-current">
            <HandCoins aria-hidden="true" className="h-4 w-4" />
            PV-Förderung {r.bundesland}
          </Link>
          <Link href="/gewerbe" className="inline-flex min-h-11 items-center gap-2 text-[15px] font-semibold text-ov-700 underline decoration-ov-300 underline-offset-4 hover:decoration-current">
            <Factory aria-hidden="true" className="h-4 w-4" />
            PV-Anlagen für Gewerbe &amp; Industrie
          </Link>
          {r.links?.map((l) => (
            <Link key={l.href} href={l.href} className="inline-flex min-h-11 items-center gap-2 text-[15px] font-semibold text-ov-700 underline decoration-ov-300 underline-offset-4 hover:decoration-current">
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
              {l.label}
            </Link>
          ))}
        </div>
        <p className="mt-6 text-[12.5px] text-ink-500">
          Foto im Seitenkopf: {bild.alt} – Nachweis unter{" "}
          <Link href="/bildnachweis" className="underline decoration-ink-300 underline-offset-2 hover:decoration-current">
            Bildnachweis
          </Link>
          . Entfernung zum Nachbarort: Luftlinie.
        </p>
      </Section>

      <CtaBand
        title={r.cta.titel}
        text={r.cta.text}
        primary={{ label: "Projekt anfragen", href: "/angebot" }}
        secondary={{ label: "Termin buchen", href: r.zone === 1 ? "/termin?art=vor-ort" : "/termin?art=video", icon: CalendarCheck2 }}
      />
    </div>
  );
}
