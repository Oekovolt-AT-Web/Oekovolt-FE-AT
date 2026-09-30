// src/app/photovoltaik-bundesland/[land]/page.js
//
// Bundesland-Hubseiten „Photovoltaik <Land>“ (Masterplan #13, erste Stufe). Jede Seite zeigt nur
// Daten, die im Repo belegt sind: Standortseiten des Landes mit PVGIS-Ertrag, Schneelast-Richtwerte
// (zur Build-Zeit aus dem GeoSphere-Raster, serverseitig), Landesförderung, Netzbetreiber je Ort,
// Baurecht, Referenzkunden mit Sitz im Land und Energiegemeinschaften. Zusammenführung in
// src/lib/bundesland/daten.js, Rechenlogik in src/lib/bundesland/auswertung.js.
//
// URL bewusst NICHT unter /photovoltaik/[stadt]: „wien“ und „salzburg“ sind dort Ortsslugs.
//
// SEO-Plan M26 (Stand 30.09.2026): Titel ohne „Förderung“ (Förderung → /forderungen/<land>),
// Salzburg als „Land Salzburg“ gegen die Stadtseite abgegrenzt, Hauptseite je Land aus
// hauptseite() – für Wien ist das /photovoltaik/wien. Schneelast verlinkt auf die Sprungmarke
// im Hub /schneelast#<land>, weil die Landesvarianten dort zusammengeführt sind (5-Wort-
// Überschneidung 0,64 ≥ 0,35). Messung der Hubseiten untereinander: max. 0,31 < 0,35.

import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Building2, CalendarCheck2, ClipboardCheck, Compass, Factory, Gauge, HandCoins, Landmark, MapPin, Mountain, PlugZap, Snowflake, Sun, Users } from "lucide-react";

import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import Faq from "@/components/ui/Faq";
import CtaBand from "@/components/ui/CtaBand";
import Reveal from "@/components/ui/Reveal";
import { cn } from "@/components/ui/cn";
import Kennzahlenband from "@/components/Produktdetail/Kennzahlenband";
import ProjektKarte from "@/components/Project/ProjektKarte";
import { landesBild } from "@/components/Region/landesBilder";
import { ladeProjekte } from "@/components/Project/ladeProjekte";
import ErtragVergleich from "@/components/Bundesland/ErtragVergleich";
import MonatsProfil from "@/components/Bundesland/MonatsProfil";
import { Etikett, ExternerLink, PfeilLink } from "@/components/Bundesland/Bausteine";
import { ZIELGRUPPEN, PRUEFEN_HINWEIS } from "@/data/bundeslaender";
import { bundeslandDaten } from "@/lib/bundesland/daten";
import { LAENDER, datumText, hauptseite, istHauptseite, jahresertrag, landPfad, schneelastAnker, seoTitel, zahl } from "@/lib/bundesland/auswertung";
import { BASE_URL, LOCALE, SITE_NAME } from "@/lib/site";

export const revalidate = 3600;
export const dynamicParams = false;

const HUB = "Photovoltaik Österreich";
const EG_PFAD = "/energiegemeinschaften";
const EG_BETRIEBE_PFAD = "/energiegemeinschaften/betriebe-gemeinden";
const PV_FIRMA_PRUEFEN = "/ratgeber/photovoltaik-angebot-vergleichen#pv-firma-pruefen";

export function generateStaticParams() {
  return LAENDER.map((l) => ({ land: l.slug }));
}

const kn = (w) => `${zahl(w, 1)} kN/m²`;

// Mobil: waagrecht wischbare Kartenreihe (nur innerhalb der Liste scrollbar), ab sm: Raster.
const KARUSSELL = "grid gap-4 max-sm:snap-x max-sm:snap-mandatory max-sm:overflow-x-auto max-sm:pb-4 sm:grid-cols-2";

/** Rasterspalten ohne verwaiste Einzelkarte in der letzten Reihe. */
function rasterKlassen(n) {
  if (n === 5) return "lg:grid-cols-6";
  if (n === 4 || n === 8) return "xl:grid-cols-4";
  if (n % 3 === 0) return "lg:grid-cols-3";
  return "";
}
/** Bei fünf Orten: oben zwei breite, unten drei schmale Karten. */
const zellKlasse = (n, i) => (n === 5 ? (i < 2 ? "lg:col-span-3" : "lg:col-span-2") : null);
const ortName = (o) => o.kurzname || o.name;

function beschreibung(d) {
  const e = d.ertrag;
  if (!istHauptseite(d.slug)) {
    const bez = d.schneelast.anzahlBezirksorte ? ` der ${d.schneelast.anzahlBezirksorte} Bezirke` : "";
    return `Bundesland ${d.name} in Daten: Verteilnetzbetreiber, Schneelast-Richtwerte${bez}, Landesprogramme und Referenzkunden – für Betriebe und Immobilien.`;
  }
  const teile = [
    `Photovoltaik ${d.imLand}: ${d.orte.length} ${d.orte.length === 1 ? "Standort" : "Standorte"} mit PVGIS-Ertrag${e ? ` (Ø ${zahl(e.mittel.sued35)} kWh/kWp)` : ""}`,
    "Netzbetreiber, Schneelast-Richtwerte, Baurecht",
  ];
  const text = `${teile.join(", ")}${d.referenzen.liste.length ? " und Referenzen" : ""} – für Gewerbe und Industrie.`;
  return text.length <= 160 ? text : `${teile.join(", ")} – für Gewerbe und Industrie.`;
}

export async function generateMetadata({ params }) {
  const { land } = await params;
  const d = bundeslandDaten(land, await ladeProjekte());
  if (!d) return {};
  const url = `${BASE_URL}${d.pfad}`;
  const titel = seoTitel(d.name);
  const text = beschreibung(d);
  return {
    title: titel,
    description: text,
    alternates: { canonical: url },
    openGraph: { type: "website", locale: LOCALE, url, siteName: SITE_NAME, title: titel, description: text, images: [{ url: `${BASE_URL}/og-image.jpg`, width: 1200, height: 630 }] },
  };
}

/** FAQ ausschließlich aus den Daten der Seite – sichtbar und im Schema identisch. */
function faqFuer(d) {
  const f = [];
  const e = d.ertrag;
  if (e) {
    f.push({
      q: `Wie viel Strom erzeugt eine PV-Anlage ${d.imLand}?`,
      a: `Im Mittel unserer ${e.anzahl} ${e.anzahl === 1 ? "Standortseite" : "Standortseiten"} ${d.imLand} erzeugt 1 kWp laut PVGIS-Simulation (EU JRC) rund ${zahl(e.mittel.sued35)} kWh im Jahr auf einem Süddach mit 35°, in Ost-West-Aufstellung mit 15° rund ${zahl(e.mittel.ostwest15)} kWh.${e.anzahl > 1 ? ` Die Spanne reicht von ${zahl(e.min.wert)} kWh in ${e.min.name} bis ${zahl(e.max.wert)} kWh in ${e.max.name}.` : ""} Eine Gewerbeanlage mit 100 kWp kommt damit rechnerisch auf etwa ${zahl(jahresertrag(e.mittel.sued35, 100))} kWh (Süd). Reale Dächer liegen je nach Ausrichtung und Verschattung darunter.`,
    });
  }
  if (d.netz.gruppen.length) {
    const liste = d.netz.gruppen.map((g) => `${g.name} (${g.orte.map((o) => o.name).join(", ")})`).join("; ");
    f.push({
      q: `Welcher Netzbetreiber ist ${d.imLand} für PV-Anlagen zuständig?`,
      a: `Das hängt von der Adresse ab. Für unsere Standortseiten nennt der E-Control-Tarifkalkulator je Postleitzahl: ${liste}. Netzanfrage, Netzzugangsantrag und Fertigmeldung übernehmen wir für Sie.`,
    });
  }
  if (d.foerderung.kurz) {
    f.push({
      q: `Gibt es ${d.imLand} eine Landesförderung für Photovoltaik?`,
      a: `${d.foerderung.kurz} Stand ${d.foerderung.standLabel}; Landesprogramme laufen oft nur bis zur Budgetausschöpfung. Alle Programme mit Quellen stehen auf unserer Seite zur Landesförderung ${d.name}.`,
    });
  }
  const s = d.schneelast.bezirksorte;
  if (s) {
    f.push({
      q: `Wie hoch ist die Schneelast ${d.imLand}?`,
      a: `Unsere Richtwerte aus GeoSphere-Daten (SNOWGRID-CL, 50-jährlicher Wert) reichen in den ${d.schneelast.anzahlBezirksorte} ${d.slug === "wien" ? "Gemeindebezirken" : "Bezirkshauptorten"} von ${kn(s.min.sk)} in ${s.min.ort} bis ${kn(s.max.sk)} in ${s.max.ort}. Das ist kein Normwert: Maßgeblich für die Statik ist die Schneelast nach ÖNORM B 1991-1-3 aus eHORA für die genaue Adresse.`,
    });
  }
  if (d.recht.bauordnung?.text) {
    f.push({ q: `Braucht eine PV-Anlage ${d.imLand} eine Baubewilligung?`, a: d.recht.bauordnung.text });
  }
  return f;
}

export default async function BundeslandSeite({ params }) {
  const { land } = await params;
  const d = bundeslandDaten(land, await ladeProjekte());
  if (!d) notFound();

  const url = `${BASE_URL}${d.pfad}`;
  const e = d.ertrag;
  const bild = landesBild(d.slug);
  const faq = faqFuer(d);
  const refs = d.referenzen.liste;
  const refKarten = refs.filter((r) => r.projekt.bild).slice(0, 6);
  const refRest = refs.filter((r) => !refKarten.includes(r));
  const skBez = d.schneelast.bezirksorte;
  const zielgruppe = (id) => ZIELGRUPPEN.find((z) => z.id === id)?.label || id;
  const { quelle: pvgisQuelle, abgerufen } = d.pvgisQuelle;
  const eg = d.energiegemeinschaften;
  const hauptstadt = d.orte.find((o) => o.hauptstadt);

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "AdministrativeArea",
                "@id": `${url}#land`,
                name: d.name,
                url,
                containedInPlace: { "@type": "Country", name: "Österreich" },
                containsPlace: d.orte.map((o) => ({ "@type": "City", name: o.name, url: `${BASE_URL}/photovoltaik/${o.slug}` })),
              },
              {
                "@type": "ItemList",
                name: `Photovoltaik-Standortseiten ${d.imLand}`,
                itemListElement: d.orte.map((o, i) => ({ "@type": "ListItem", position: i + 1, name: `Photovoltaik ${o.name}`, url: `${BASE_URL}/photovoltaik/${o.slug}` })),
              },
              ...(faq.length ? [{ "@type": "FAQPage", mainEntity: faq.map((x) => ({ "@type": "Question", name: x.q, acceptedAnswer: { "@type": "Answer", text: x.a } })) }] : []),
              // BreadcrumbList kommt aus der sichtbaren Brotkrumen-Navigation (src/components/ui/Breadcrumbs.js) – hier nicht doppelt (QA N3)
            ],
          }),
        }}
      />

      <PageHero
        variant="immersive"
        breadcrumbs={[{ name: HUB, href: "/photovoltaik" }, { name: d.name }]}
        eyebrow={`Photovoltaik ${d.imLand}`}
        title={
          <>
            {istHauptseite(d.slug) ? `Photovoltaik ${d.imLand}` : `Bundesland ${d.name} –`}{" "}
            <span className="ov-text-gradient-light">{istHauptseite(d.slug) ? "für Betriebe und Gemeinden." : "Netz, Schneelast und Referenzen."}</span>
          </>
        }
        lead={
          e
            ? `Ertrag, Netzbetreiber, Schneelast, Förderung und Baurecht ${d.imLand} – zusammengeführt aus unseren Standortseiten. Im Mittel erzeugt 1 kWp hier ${zahl(e.mittel.sued35)} kWh im Jahr (Süd, 35°)${e.anzahl > 1 ? `, von ${zahl(e.min.wert)} kWh in ${e.min.name} bis ${zahl(e.max.wert)} kWh in ${e.max.name}` : ""}.`
            : `Netzbetreiber, Förderung und Baurecht ${d.imLand} im Überblick.`
        }
        image={bild}
        actions={[
          { label: "Projekt anfragen", href: "/angebot" },
          { label: "Ertrag vergleichen", href: "#ertrag", icon: Sun },
        ]}
        points={[
          `${d.orte.length} ${d.orte.length === 1 ? "Standortseite" : "Standortseiten"}`,
          d.netz.gruppen.length ? `${d.netz.gruppen.length} Verteilnetzbetreiber an unseren Standorten` : null,
          d.foerderung.art ? d.foerderung.art.label : null,
        ].filter(Boolean)}
      />

      <Kennzahlenband
        tone="light"
        items={[
          e && { value: e.mittel.sued35, suffix: " kWh", label: `Ø simulierter Jahresertrag je kWp ${d.imLand} (Süd, 35°)` },
          e && { value: e.mittel.ostwest15, suffix: " kWh", label: "Ø je kWp in Ost-West-Aufstellung (15°) – typisch für Hallendächer" },
          skBez ? { wert: `${zahl(skBez.min.sk, 1)}–${zahl(skBez.max.sk, 1)}`, label: `kN/m² Schneelast-Richtwert in ${d.schneelast.anzahlBezirksorte} ${d.slug === "wien" ? "Bezirken" : "Bezirkshauptorten"}` } : null,
          refs.length ? { value: refs.length, label: `Referenzkunden mit Unternehmenssitz ${d.imLand}` } : e?.winteranteil != null ? { value: e.winteranteil, suffix: " %", label: "des Jahresertrags entfallen im Mittel auf November bis Februar" } : null,
        ].filter(Boolean)}
      />

      {/* Abgrenzung Stadt/Land bzw. Hauptseite (nur Wien und Salzburg) */}
      {(!istHauptseite(d.slug) || (hauptstadt && hauptstadt.slug === d.slug)) && (
        <Section tone="white" space="sm" className="pb-0 md:pb-0">
          <p className="flex max-w-4xl gap-3 rounded-2xl bg-sand-50 p-5 text-[15px] leading-relaxed text-ink-700 ring-1 ring-ink-200/60">
            <MapPin aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-ov-600" />
            <span>
              {istHauptseite(d.slug) ? (
                <>
                  Diese Seite behandelt das <strong className="text-ink-900">Land {d.name}</strong> mit allen Bezirken. Für die{" "}
                  <Link href={`/photovoltaik/${hauptstadt.slug}`} className="font-semibold text-ov-700 underline decoration-ov-300 underline-offset-2">
                    Stadt {ortName(hauptstadt)}
                  </Link>{" "}
                  mit Altstadtschutz und Gewerbegebieten gibt es eine eigene Standortseite.
                </>
              ) : (
                <>
                  Hauptseite für Photovoltaik-Projekte in {d.name} ist{" "}
                  <Link href={hauptseite(d.slug)} className="font-semibold text-ov-700 underline decoration-ov-300 underline-offset-2">
                    Photovoltaik {d.name}
                  </Link>{" "}
                  mit Bauordnung, Solarpflicht und Ablauf. Hier stehen die Daten des Bundeslands: Netzbetreiber, Schneelast-Richtwerte {d.schneelast.anzahlBezirksorte ? `der ${d.schneelast.anzahlBezirksorte} Bezirke` : ""}, Landesprogramme und Referenzkunden.
                </>
              )}
            </span>
          </p>
        </Section>
      )}

      {/* Standortseiten */}
      <Section tone="white" space="lg" id="standorte">
        <SectionHeading
          eyebrow="Standortseiten"
          title={d.orte.length === 1 ? `Unsere Standortseite ${d.imLand}` : `${d.orte.length} Orte ${d.imLand} mit eigener Seite`}
          lead={
            d.orte.length === 1
              ? `Für ${d.name} gibt es eine ausführliche Standortseite mit Ertrag, Netzbetreiber, Baurecht und Förderung. Die Daten auf dieser Landesseite stammen von dort.`
              : "Je Ort: Entfernung ab unserem Firmensitz in Ostermiething, simulierter Ertrag, Schneelast-Richtwert und Verteilnetzbetreiber. Details auf der jeweiligen Standortseite."
          }
          className="mb-10"
        />
        <ul className={cn(KARUSSELL, d.orte.length > 1 && "max-sm:flex", rasterKlassen(d.orte.length))}>
          {d.orte.map((o, i) => {
            const b = o.bild || bild;
            const netz = o.fakten.netzbetreiber;
            return (
              <Reveal as="li" key={o.slug} delay={(i % 4) * 70} className={cn("flex", d.orte.length > 1 && "max-sm:w-[82%] max-sm:shrink-0 max-sm:snap-start", zellKlasse(d.orte.length, i))}>
                <Link
                  href={`/photovoltaik/${o.slug}`}
                  className="group flex w-full flex-col overflow-hidden rounded-3xl bg-white ring-1 ring-ink-200/70 transition-shadow duration-300 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ov-500"
                >
                  <span className="relative block h-32 overflow-hidden bg-navy-900">
                    <Image src={b.src} alt="" fill sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw" className="object-cover transition-transform duration-700 group-hover:scale-105" style={{ objectPosition: b.position || "50% 50%" }} />
                    <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-navy-950/85 via-navy-950/30 to-transparent" />
                    <span className="absolute inset-x-4 bottom-3 flex items-end justify-between gap-2 text-white">
                      <span className="font-display text-[19px] font-extrabold leading-tight">Photovoltaik {ortName(o)}</span>
                      {(o.heimat || o.hauptstadt) && (
                        <span className="ov-glass shrink-0 rounded-full px-2.5 py-1 text-[11.5px] font-semibold">{o.heimat ? "Firmensitz" : "Landeshauptstadt"}</span>
                      )}
                    </span>
                  </span>
                  <dl className="grid flex-1 grid-cols-2 gap-x-4 gap-y-3 p-5 text-[13.5px]">
                    <div>
                      <dt className="text-ink-500">Ertrag Süd, 35°</dt>
                      <dd className="ov-num font-semibold text-ink-900">{zahl(o.pvgis.sued35_kwh_kwp)} kWh/kWp</dd>
                    </div>
                    <div>
                      <dt className="text-ink-500">Schneelast-Richtwert</dt>
                      <dd className="ov-num font-semibold text-ink-900">{o.sk != null ? kn(o.sk) : "–"}</dd>
                    </div>
                    <div>
                      <dt className="text-ink-500">ab Ostermiething</dt>
                      <dd className="ov-num font-semibold text-ink-900">{o.heimat ? "Firmensitz" : `${zahl(o.pvgis.strasse_km || o.km)} km ${o.pvgis.strasse_km ? "Straße" : "Luftlinie"}`}</dd>
                    </div>
                    <div>
                      <dt className="text-ink-500">Seehöhe</dt>
                      <dd className="ov-num font-semibold text-ink-900">{zahl(o.pvgis.hoehe_m)} m</dd>
                    </div>
                    {netz?.name && (
                      <div className="col-span-2">
                        <dt className="text-ink-500">Verteilnetzbetreiber</dt>
                        <dd className="font-semibold text-ink-900">{netz.kurz || netz.name}</dd>
                      </div>
                    )}
                  </dl>
                  <span className="flex min-h-12 items-center justify-between border-t border-ink-100 px-5 text-[14px] font-semibold text-ov-700">
                    Zur Standortseite
                    <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </ul>
      </Section>

      {/* Ertrag – interaktiv */}
      {e && (
        <Section tone="navy" space="lg" id="ertrag" className="scroll-mt-20 overflow-hidden">
          <div aria-hidden="true" className="ov-grid-bg absolute inset-0" />
          <div aria-hidden="true" className="absolute -left-40 top-20 h-[460px] w-[460px] rounded-full bg-ov-500/20 blur-[130px]" />
          <div aria-hidden="true" className="absolute -right-32 bottom-0 h-[380px] w-[380px] rounded-full bg-sun-400/15 blur-[130px]" />
          <div className="relative">
            <SectionHeading
              dark
              eyebrow="Sonne in Zahlen"
              title={
                <>
                  So viel Solarstrom liefert ein Dach <span className="ov-text-gradient-light">{d.imLand}</span>
                </>
              }
              lead={
                e.anzahl > 1
                  ? `Zwischen dem stärksten und dem schwächsten unserer Standorte ${d.imLand} liegen ${zahl(e.spanneProzent)} % Ertrag. Wählen Sie Ausrichtung und Anlagengröße – die Balken zeigen den simulierten Jahresertrag je Ort.`
                  : "Wählen Sie Ausrichtung und Anlagengröße – der Balken zeigt den simulierten Jahresertrag."
              }
              className="mb-10"
            />
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-10">
              <Reveal dir="scale" className="min-w-0">
                <ErtragVergleich
                  land={d.name}
                  mittel={e.mittel}
                  orte={d.orte.map((o) => ({ slug: o.slug, name: ortName(o), werte: { sued35: o.pvgis.sued35_kwh_kwp, ostwest15: o.pvgis.ostwest15_kwh_kwp, flach10: o.pvgis.flach10_kwh_kwp } }))}
                />
              </Reveal>
              <div className="flex min-w-0 flex-col gap-5">
                <MonatsProfil monate={e.monate} land={d.name} id={`bl-monate-${d.slug}`} />
                {e.winteranteil != null && (
                  <p className="text-[14.5px] leading-relaxed text-white/70">
                    Im Mittel entfallen {zahl(e.winteranteil)} % des Jahresertrags auf November bis Februar. Für Betriebe mit hohem Winterverbrauch lohnt der Blick auf steilere Module,
                    Fassaden und einen Speicher mit Lastspitzenkappung.
                  </p>
                )}
              </div>
            </div>
            <p className="mt-8 text-[12.5px] leading-relaxed text-white/55">
              Simulierter Jahresertrag je kWp am Referenzpunkt Ortszentrum, inklusive Geländehorizont; Landesmittel = ungewichtetes Mittel der Standortseiten, kein Flächenmittel des Landes. Quelle: {pvgisQuelle},
              abgerufen {datumText(abgerufen)}. In Angeboten rechnen wir mit Ihrem Dach, Ihrer Verschattung und vorsichtigeren Annahmen.
            </p>
          </div>
        </Section>
      )}

      {/* Förderung */}
      <Section tone="sand" space="lg" id="foerderung">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <div>
            <SectionHeading eyebrow={`Landesförderung ${d.name}`} title={d.foerderung.art ? d.foerderung.art.label : "Förderung"} lead={d.foerderung.kurz} />
            <p className="mt-5 text-[15px] leading-relaxed text-ink-700">{d.foerderung.text}</p>
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
              <PfeilLink href={d.foerderung.pfad} icon={HandCoins}>
                Alle Programme: Landesförderung {d.name}
              </PfeilLink>
              <PfeilLink href="/forderungen/bundesfoerderung" icon={Landmark}>
                Bundesförderung (EAG)
              </PfeilLink>
            </div>
            <p className="mt-4 text-[12.5px] text-ink-500">Stand {d.foerderung.standLabel} – Landesprogramme laufen oft nur bis zur Budgetausschöpfung.</p>
          </div>
          <ul className="grid content-start gap-4">
            {d.foerderung.programme.map((p, i) => (
              <Reveal as="li" key={p.name} delay={i * 80} className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-ink-200/70 md:p-7">
                <div className="flex flex-wrap gap-2">
                  {p.zielgruppen.map((z) => (
                    <Etikett key={z} ton={z === "unternehmen" ? "gruen" : "hell"}>
                      {zielgruppe(z)}
                    </Etikett>
                  ))}
                </div>
                <h3 className="mt-3 font-display text-[19px] font-bold leading-snug text-ink-900">{p.name}</h3>
                <p className="mt-1 text-[13px] text-ink-500">{p.traeger}</p>
                {p.hoehe && <p className="mt-3 text-[14.5px] leading-relaxed text-ink-800">{p.hoehe}</p>}
                {p.was && <p className="mt-2 text-[14px] leading-relaxed text-ink-600">{p.was}</p>}
                {p.status && (
                  <p className="mt-3 text-[13px] text-ink-600">
                    <span className="font-semibold text-ink-800">Status:</span> {p.status}
                  </p>
                )}
                {(p.pruefen || p.hinweis) && <p className="mt-2 text-[13px] text-ink-600">{p.hinweis || PRUEFEN_HINWEIS}</p>}
                {p.url && (
                  <ExternerLink href={p.url} className="mt-2 text-[13.5px]">
                    Quelle: {p.quelle || "Förderstelle"}
                  </ExternerLink>
                )}
              </Reveal>
            ))}
          </ul>
        </div>
      </Section>

      {/* Netz und Baurecht */}
      <Section tone="white" space="lg" id="netz">
        <SectionHeading
          eyebrow="Netzanschluss und Baurecht"
          title={`Wer ${d.imLand} für den Netzanschluss zuständig ist`}
          lead="Verteilnetzbetreiber laut E-Control-Tarifkalkulator je Postleitzahl unserer Standortseiten. Welcher Betreiber für Ihre Adresse zuständig ist, klären wir mit der Netzanfrage."
          className="mb-10"
        />
        <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <ul className={`grid content-start gap-4 ${d.netz.gruppen.length > 1 ? "md:grid-cols-2" : ""}`}>
            {d.netz.gruppen.map((g, i) => (
              <Reveal as="li" key={g.name} delay={i * 70} className="flex">
                <article className="flex w-full flex-col rounded-3xl bg-sand-50 p-6 ring-1 ring-ink-200/60">
                  <p className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.14em] text-ov-700">
                    <Gauge aria-hidden="true" className="h-4 w-4" />
                    Verteilnetzbetreiber
                  </p>
                  <h3 className="mt-3 font-display text-[19px] font-bold leading-snug text-ink-900">{g.name}</h3>
                  <p className="mt-2 text-[14px] text-ink-600">
                    Zuständig an {g.orte.length === 1 ? "unserer Standortseite" : "unseren Standortseiten"}:{" "}
                    {g.orte.map((o, j) => (
                      <span key={o.slug}>
                        {j > 0 && ", "}
                        <Link href={`/photovoltaik/${o.slug}`} className="font-semibold text-ink-800 underline decoration-ink-300 underline-offset-2 hover:decoration-current">
                          {o.name}
                        </Link>
                      </span>
                    ))}
                  </p>
                  <div className="mt-auto flex flex-wrap gap-x-5 pt-4 text-[13.5px]">
                    {g.anmeldung.map((a) => (
                      <PfeilLink key={a.slug} href={d.netz.betreiberPfad(a.slug)} icon={PlugZap} className="text-[13.5px]">
                        Anmeldung bei {a.kurz}
                      </PfeilLink>
                    ))}
                    {g.url && <ExternerLink href={g.url}>Website</ExternerLink>}
                  </div>
                </article>
              </Reveal>
            ))}
          </ul>
          <div className="flex flex-col gap-5">
            {d.recht.bauordnung && (
              <Reveal className="rounded-3xl bg-navy-950 p-6 text-white md:p-8">
                <p className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.14em] text-ov-300">
                  <Building2 aria-hidden="true" className="h-4 w-4" />
                  Baurecht {d.name}
                </p>
                <p className="mt-4 text-[14.5px] leading-relaxed text-white/80">{d.recht.bauordnung.text}</p>
                <ExternerLink href={d.recht.bauordnung.url} dunkel className="mt-3 text-[13.5px]">
                  Rechtsquelle
                </ExternerLink>
              </Reveal>
            )}
            <Reveal delay={100} className="rounded-3xl bg-sand-50 p-6 ring-1 ring-ink-200/60">
              <p className="text-[14.5px] leading-relaxed text-ink-700">
                Ablauf, Unterlagen und Fristen der großen Netzbetreiber haben wir auf einer eigenen Seite zusammengestellt.
                {d.recht.energieberatung && <> Unabhängige Energieberatung für Betriebe im Land: {d.recht.energieberatung.name}.</>}
              </p>
              <div className="mt-3 flex flex-wrap gap-x-6">
                <PfeilLink href={d.netz.pfad} icon={PlugZap}>
                  PV beim Netzbetreiber anmelden
                </PfeilLink>
                {d.recht.energieberatung && <ExternerLink href={d.recht.energieberatung.url}>Energieberatung</ExternerLink>}
              </div>
            </Reveal>
          </div>
        </div>
      </Section>

      {/* Schneelast */}
      <Section tone="sand" space="lg" id="schneelast">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <div>
            <SectionHeading
              eyebrow="Schneelast"
              title={skBez ? `Schneelast ${d.imLand}: ${zahl(skBez.min.sk, 1)} bis ${zahl(skBez.max.sk, 1)} kN/m²` : `Schneelast ${d.imLand}`}
              lead={
                skBez
                  ? `Richtwerte aus unserer Auswertung der GeoSphere-Schneedaten für ${d.schneelast.anzahlBezirksorte} ${d.slug === "wien" ? "Gemeindebezirke" : "Bezirkshauptorte"}: am niedrigsten in ${skBez.min.ort}, am höchsten in ${skBez.max.ort}. Daneben die Werte unserer Standortseiten.`
                  : "Für dieses Land liegt derzeit kein Richtwert vor."
              }
            />
            <p className="mt-5 text-[13.5px] leading-relaxed text-ink-600">
              Richtwert, kein Normwert: Für Statik und Modulwahl gilt die charakteristische Schneelast nach ÖNORM B 1991-1-3 aus eHORA für die genaue Adresse. Wir prüfen sie vor jedem Angebot.
            </p>
            <div className="mt-5 flex flex-wrap gap-x-6">
              <PfeilLink href={schneelastAnker(d.slug)} icon={Snowflake}>
                Alle Richtwerte {d.name}
              </PfeilLink>
              <PfeilLink href="/standort-check" icon={Mountain}>
                Standort-Check für Ihre Adresse
              </PfeilLink>
            </div>
          </div>
          <Reveal className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-ink-200/70">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[440px] text-left text-[14px]">
                <caption className="sr-only">Schneelast-Richtwerte der Standortseiten {d.imLand}</caption>
                <thead className="bg-sand-100 text-[12.5px] uppercase tracking-[0.08em] text-ink-600">
                  <tr>
                    <th scope="col" className="px-5 py-3 font-semibold">Ort</th>
                    <th scope="col" className="px-5 py-3 text-right font-semibold">Seehöhe</th>
                    <th scope="col" className="px-5 py-3 text-right font-semibold">Richtwert s<sub>k</sub></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-100">
                  {[...d.orte]
                    .sort((a, b) => (b.sk ?? -1) - (a.sk ?? -1))
                    .map((o) => (
                      <tr key={o.slug}>
                        <th scope="row" className="px-5 py-3 font-semibold text-ink-900">
                          <Link href={`/photovoltaik/${o.slug}`} className="underline decoration-ink-300 underline-offset-2 hover:decoration-current">
                            {ortName(o)}
                          </Link>
                        </th>
                        <td className="ov-num px-5 py-3 text-right text-ink-700">{zahl(o.pvgis.hoehe_m)} m</td>
                        <td className="ov-num px-5 py-3 text-right font-semibold text-ink-900">
                          {o.sk != null ? kn(o.sk) : o.skGrund === "ueber2000" ? "über 2.000 m" : "–"}
                          {o.skNachbarzelle && <span className="sr-only"> (Wert der Nachbarzelle)</span>}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
            <p className="border-t border-ink-100 px-5 py-3 text-[12px] leading-relaxed text-ink-500">
              Eigene Auswertung: {d.schneelast.meta?.quelle || "GeoSphere Austria, SNOWGRID-CL (CC BY 4.0)"}
              {d.schneelast.meta?.zeitraum ? `, ${d.schneelast.meta.zeitraum}` : ""}
              {d.schneelast.meta?.methode ? `, ${d.schneelast.meta.methode}` : ""}, 1-km-Raster, Referenzpunkt Ortszentrum. Seehöhe: PVGIS.
            </p>
          </Reveal>
        </div>
      </Section>

      {/* Referenzen */}
      {refs.length > 0 && (
        <Section tone="white" space="lg" id="referenzen">
          <SectionHeading
            eyebrow="Referenzen"
            title={`Referenzkunden ${d.imLand}`}
            lead={`${refs.length} Unternehmen mit Sitz ${d.imLand}, für die wir Photovoltaikanlagen gebaut haben – je Kunde das größte Projekt. Der genannte Ort ist der Unternehmenssitz laut Impressum; der Anlagenstandort kann davon abweichen.`}
            className="mb-10"
          />
          {refKarten.length > 0 && (
            <ul className={cn(KARUSSELL, refKarten.length > 1 && "max-sm:flex", "gap-5", refKarten.length >= 3 ? "lg:grid-cols-3" : "")}>
              {refKarten.map((r, i) => (
                <Reveal as="li" key={r.projekt.slug} delay={(i % 3) * 80} className={cn(refKarten.length > 1 && "max-sm:w-[82%] max-sm:shrink-0 max-sm:snap-start")}>
                  <ProjektKarte projekt={r.projekt} />
                  <p className="mt-2 flex items-center gap-1.5 text-[13px] text-ink-600">
                    <MapPin aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-ov-600" />
                    {r.quelle === "anlage" ? "Anlage in" : "Sitz in"} {r.ort}
                    {r.branche ? ` · ${r.branche}` : ""}
                  </p>
                </Reveal>
              ))}
            </ul>
          )}
          {refRest.length > 0 && (
            <ul className="mt-8 grid gap-x-8 divide-y divide-ink-100 border-y border-ink-100 md:grid-cols-2 md:divide-y-0">
              {refRest.map((r) => (
                <li key={r.projekt.slug} className="md:border-b md:border-ink-100">
                  <Link href={`/referenzen/projekte/${r.projekt.slug}`} className="group flex min-h-12 items-center justify-between gap-3 py-3">
                    <span className="min-w-0">
                      <span className="block truncate font-semibold text-ink-900 group-hover:text-ov-700">{r.firma}</span>
                      <span className="block text-[12.5px] text-ink-500">
                        {r.quelle === "anlage" ? "Anlage in" : "Sitz in"} {r.ort}
                        {r.branche ? ` · ${r.branche}` : ""}
                      </span>
                    </span>
                    <span className="ov-num shrink-0 text-[13.5px] font-semibold text-ink-700">{r.projekt.leistungText || ""}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
          <div className="mt-8 flex flex-wrap gap-x-8">
            <PfeilLink href="/referenzen/projekte" icon={Factory}>
              Alle Referenzprojekte
            </PfeilLink>
            <PfeilLink href="/referenzen/referenzkarte" icon={Compass}>
              Referenzkarte
            </PfeilLink>
          </div>
        </Section>
      )}

      {/* Energiegemeinschaften */}
      {eg && (
        <Section tone="green" space="lg" id="energiegemeinschaften">
          <div className="grid items-center gap-10 lg:grid-cols-[1fr_1fr] lg:gap-16">
            <SectionHeading eyebrow="Energiegemeinschaften" title={`Strom teilen ${d.imLand}`} lead={eg.text} />
            <Reveal delay={100} className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-ov-200 md:p-8">
              <p className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.14em] text-ov-700">
                <Users aria-hidden="true" className="h-4 w-4" />
                Anlaufstelle im Land
              </p>
              <p className="mt-3 font-display text-[20px] font-bold leading-snug text-ink-900">{eg.stelle}</p>
              <ExternerLink href={eg.url} className="mt-1 text-[13.5px]">
                Zur Anlaufstelle
              </ExternerLink>
              <div className="mt-5 flex flex-col gap-1 border-t border-ink-100 pt-4">
                <PfeilLink href={EG_PFAD}>Energiegemeinschaften für Unternehmen</PfeilLink>
                <PfeilLink href={EG_BETRIEBE_PFAD}>Betriebe und Gemeinden gemeinsam</PfeilLink>
              </div>
            </Reveal>
          </div>
        </Section>
      )}

      {/* FAQ */}
      {faq.length > 0 && (
        <Section tone="white" space="lg">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
            <SectionHeading eyebrow="Häufige Fragen" title={`Photovoltaik ${d.imLand}: gut zu wissen`} />
            <Faq items={faq} schema={false} />
          </div>
        </Section>
      )}

      {/* Weitere Bundesländer, Quellen */}
      <Section tone="sand" space="md">
        <SectionHeading eyebrow="Weitere Bundesländer" title="Photovoltaik in den Nachbarländern" className="mb-8" />
        <ul className="flex flex-wrap gap-3">
          {d.nachbarn.map((n) => (
            <li key={n.slug}>
              <Link
                href={landPfad(n.slug)}
                className="inline-flex min-h-11 items-center gap-2 rounded-full bg-white px-4 text-[14.5px] font-semibold text-ink-900 ring-1 ring-ink-200 transition-colors hover:bg-ov-50 hover:ring-ov-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ov-500"
              >
                Photovoltaik {n.name}
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-6 flex flex-wrap gap-x-8 gap-y-1">
          <PfeilLink href="/photovoltaik" icon={Compass}>
            Alle Standorte in Österreich
          </PfeilLink>
          <PfeilLink href="/gewerbe" icon={Factory}>
            PV-Anlagen für Gewerbe &amp; Industrie
          </PfeilLink>
          {hauptstadt && (
            <PfeilLink href={`/photovoltaik/${hauptstadt.slug}`} icon={MapPin}>
              Photovoltaik {hauptstadt.slug === "salzburg" ? "Stadt Salzburg" : ortName(hauptstadt)}
            </PfeilLink>
          )}
          <PfeilLink href={PV_FIRMA_PRUEFEN} icon={ClipboardCheck}>
            PV-Firma {d.imLand} prüfen: Checkliste
          </PfeilLink>
        </div>
        <p className="mt-8 max-w-4xl text-[12.5px] leading-relaxed text-ink-500">
          Quellen: Ertrag {pvgisQuelle}; Schneelast eigene Auswertung GeoSphere Austria SNOWGRID-CL (CC BY 4.0); Verteilnetzbetreiber laut E-Control-Tarifkalkulator je Postleitzahl (Recherche auf den
          Standortseiten); Förderung und Energiegemeinschaften Stand {d.foerderung.standLabel} mit Quellen auf der Seite zur Landesförderung; Referenzkunden: Unternehmenssitz laut Impressum der Kunden,
          geprüft am {datumText(d.referenzen.stand)}. Foto im Seitenkopf: {bild.alt} – Nachweis unter{" "}
          <Link href="/bildnachweis" className="underline decoration-ink-300 underline-offset-2 hover:decoration-current">
            Bildnachweis
          </Link>
          .
        </p>
      </Section>

      <CtaBand
        title={`PV-Projekt ${d.imLand}? Wir rechnen Ihren Standort durch.`}
        text="Schicken Sie uns Adresse, Lastgang und Dachpläne – wir prüfen Ertrag, Netzanschluss, Schneelast und Förderung für Ihre Anlage und legen ein Angebot mit Wirtschaftlichkeitsrechnung vor."
        primary={{ label: "Projekt anfragen", href: "/angebot" }}
        secondary={{ label: "Termin buchen", href: "/termin?art=video", icon: CalendarCheck2 }}
      />
    </div>
  );
}
