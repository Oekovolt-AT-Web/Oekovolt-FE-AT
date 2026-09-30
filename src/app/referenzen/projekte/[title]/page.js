// src/app/referenzen/projekte/[title]/page.js

import { notFound, permanentRedirect } from "next/navigation";
import {
  ArrowLeft,
  Calculator,
  CalendarDays,
  Home,
  MapPin,
  Sun,
  Zap,
  Layers,
  Info,
} from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import CtaBand from "@/components/ui/CtaBand";
import Reveal from "@/components/ui/Reveal";
import Button from "@/components/ui/Button";
import ProjektGalerie from "@/components/ProjectItem/ProjektGalerie";
import ProjektKarte from "@/components/Project/ProjektKarte";
import {
  ERTRAG_JE_KWP,
  HAUSHALT_KWH,
  fmtKwp,
  brancheKurz,
  fmtZahl,
  isoDatum,
  normalisiereProjekt,
  ortKurz,
  projektBeschreibung,
  projektSeitenTitel,
  projektSlug,
} from "@/components/Project/projektDaten";
import { PROJEKTE_STAND } from "@/data/projekte";
import { ladeProjekteRoh, ladeProjektRoh } from "@/components/Project/ladeProjekte";
import { BASE_URL, FIRMA } from "@/lib/site";
import KundenPortraet from "@/components/Kundenbuehne/KundenPortraet";
import SolarKit from "@/components/Kundenbuehne/SolarKit";
import { hatPortraet, kundeSchema, schaetzung } from "@/lib/kundenbuehne";
import { kundeFuerProjekt } from "@/lib/kundenbuehneServer";

const FALLBACK_BILD = "/Images/Referenzen/projekteBanner.jpg";

// ---------- API helpers (only used in this file) ----------

const bildLink = (b) => (b?.bild_url ? encodeURI(b.bild_url) : "");

/** Converts one project from the new API into the format the components expect */
function projektAusApi(p) {
  let basis = {};
  try {
    basis = normalisiereProjekt(p) || {};
  } catch {
    basis = {};
  }

  const kwp =
    p?.leistung != null && p.leistung !== ""
      ? Number(p.leistung)
      : (basis.kwp ?? null);

  // Detail API: bilder = [{ bild_url }], list API: bild_url directly
  const bilderRoh =
    Array.isArray(p?.bilder) && p.bilder.length
      ? p.bilder
      : p?.bild_url
        ? [{ bild_url: p.bild_url }]
        : [];
  const bilder = bilderRoh.map(bildLink).filter(Boolean);

  return {
    ...basis,
    slug: projektSlug(p) || basis.slug,
    apiName: p?.projekt_website_name || "",
    titel: p?.projekt_name || basis.titel || "",
    jahr: p?.jahr || basis.jahr || null,
    plz: p?.plz || "",
    ort: p?.ort || basis.ort || "",
    land: p?.land || basis.land || "",
    segment: p?.objekt || basis.segment || "",
    dacharten: p?.dach ? [p.dach] : basis.dacharten || [],
    kwp,
    leistungText:
      p?.leistung_label || (kwp != null ? `${fmtKwp(kwp)} kWp` : ""),
    modul: p?.modul || "",
    wechselrichter: p?.wechselrichter || "",
    speicher: p?.speicher || "",
    ertragApi: p?.ertrag ? Number(p.ertrag) : null,
    lat: p?.latitude ?? null,
    lng: p?.longitude ?? null,
    bilder,
    bild: bilder[0] || basis.bild || "",
    typTeile: [p?.objekt, p?.dach, p?.modul].filter(Boolean),
    // Rohdaten für die Kundenbühne (Kundenfelder website_url, portraet, … aus dem Backoffice)
    roh: p,
  };
}

/** All projects – for "Weitere Projekte" and generateStaticParams (API, else src/data/projekte.js) */
async function fetchProjekteListe() {
  return (await ladeProjekteRoh()).map(projektAusApi).filter((p) => p.slug);
}

/** One project by projekt_website_name, e.g. "haydu-2" (API, else src/data/projekte.js) */
async function fetchProjekt(apiName) {
  const p = await ladeProjektRoh(apiName);
  return p ? projektAusApi(p) : null;
}

/**
 * Project for a URL slug, e.g. "mindelheim-2". Old URLs with projekt_website_name
 * (e.g. "haydu-2") are recognised too – `veraltet` then says the page should redirect.
 */
async function ladeProjektFuerUrl(title, liste) {
  const treffer = liste.find((x) => x.slug === title) || liste.find((x) => x.apiName === title);
  if (!treffer) return { p: null, veraltet: false };
  const p = (await fetchProjekt(treffer.apiName)) || treffer;
  return { p, veraltet: p.slug !== title };
}

// ---------- Next.js ----------

export async function generateStaticParams() {
  const projekte = await fetchProjekteListe();
  return projekte.map((p) => ({ title: p.slug }));
}

/**
 * Branche und Ort für Title, Description und H1 – nur belegte Werte: Projektort aus dem Backoffice,
 * sonst Sitz/Werk des Unternehmens aus der Kundenbühne (src/data/kunden.js bzw. Backoffice-Kundenfelder).
 */
function seoKontext(p, kunde) {
  return {
    titel: p.titel,
    leistungText: p.kwp != null ? p.leistungText : "",
    branche: kunde?.branche || "",
    ort: p.ort || kunde?.ort || "",
    jahr: p.jahr,
    modul: p.modul,
  };
}

/**
 * Feste Daten für das Schema (M15): kein new Date(). Veröffentlicht = Feld aus dem Backoffice
 * (veroeffentlicht bzw. creation), sonst Stand der Übernahme in diese Website (PROJEKTE_STAND).
 */
function projektDaten(p) {
  const veroeffentlicht = isoDatum(p.roh?.veroeffentlicht) || isoDatum(p.roh?.creation) || PROJEKTE_STAND;
  const geaendert = isoDatum(p.modified) || isoDatum(p.roh?.modified) || veroeffentlicht;
  return { veroeffentlicht, geaendert: geaendert < veroeffentlicht ? veroeffentlicht : geaendert };
}

/** Sachliche Kurzbeschreibung – nur aus den Projektfeldern zusammengesetzt */
function kurzbeschreibung(p) {
  const teile = [];
  teile.push(
    `Photovoltaikanlage${p.kwp != null ? ` mit ${p.leistungText}` : ""}`,
  );
  if (p.segment)
    teile.push(
      p.segment === "Einfamilienhaus"
        ? "auf einem Einfamilienhaus"
        : p.segment === "Gewerbe"
          ? "auf einem Gewerbeobjekt"
          : "auf einem landwirtschaftlichen Gebäude",
    );
  if (p.ort) teile.push(`in ${p.ort}`);
  let satz = teile.join(" ");
  if (p.jahr) satz += `, realisiert ${p.jahr}`;
  satz += " von Ökovolt.";
  if (p.modul) satz += ` Verbaut: ${p.modul}.`;
  return satz;
}

export async function generateMetadata({ params }) {
  try {
    const { title } = await params;
    const { p } = await ladeProjektFuerUrl(title, await fetchProjekteListe());

    if (!p) {
      return {
        title: "Projekt nicht gefunden | Ökovolt",
        robots: { index: false },
      };
    }

    const kontext = seoKontext(p, kundeFuerProjekt(p.roh, p.slug));
    const seitenTitel = projektSeitenTitel(kontext);
    const description = projektBeschreibung(kontext);
    const canonical = `${BASE_URL}/referenzen/projekte/${p.slug}`;
    const imgUrl = p.bilder[0] || `${BASE_URL}/og-image.jpg`;

    return {
      title: seitenTitel,
      description,
      alternates: { canonical },
      openGraph: {
        type: "article",
        locale: "de_AT",
        url: canonical,
        siteName: "Ökovolt Österreich",
        title: seitenTitel,
        description,
        images: [{ url: imgUrl, width: 1200, height: 630, alt: p.titel }],
      },
      twitter: {
        card: "summary_large_image",
        title: seitenTitel,
        description,
        images: [imgUrl],
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Projekt nicht gefunden | Ökovolt",
      robots: { index: false },
    };
  }
}

// Fachwissen je Objektart – allgemeine Orientierung, keine Projektangaben
const WISSEN = {
  Einfamilienhaus: {
    titel: "Worauf es beim Einfamilienhaus ankommt",
    punkte: [
      {
        t: "Eigenverbrauch",
        x: "Ohne Speicher nutzt ein Haushalt typischerweise 25–35 % des Solarstroms selbst, mit passend dimensioniertem Speicher oft 60–80 %.",
      },
      {
        t: "Förderung",
        x: "Der EAG-Investitionszuschuss wird in OeMAG-Fördercalls vergeben und muss vor der Bestellung beantragt werden; Speicher sind bis 50 kWh mitförderbar.",
      },
      {
        t: "Zukunft mitdenken",
        x: "Wallbox oder Wärmepumpe verschieben die ideale Anlagengröße nach oben – das planen wir von Anfang an ein.",
      },
    ],
  },
  Gewerbe: {
    titel: "Worauf es bei Gewerbedächern ankommt",
    punkte: [
      {
        t: "Lastgang",
        x: "Betriebe verbrauchen tagsüber, wenn die Anlage erzeugt – das ermöglicht hohe Eigenverbrauchsquoten ohne großen Speicher.",
      },
      {
        t: "Statik & Dachhaut",
        x: "Trapez-, Sandwich- und Flachdächer brauchen passende Unterkonstruktionen und eine Prüfung der Tragreserven.",
      },
      {
        t: "Netzanschluss",
        x: "Ab 250 kW gilt Typ B nach TOR Stromerzeugungsanlagen mit Anforderungen an Fernsteuerbarkeit und Blindleistung – unser Parkregler erfüllt sie.",
      },
    ],
  },
  Landwirtschaft: {
    titel: "Worauf es in der Landwirtschaft ankommt",
    punkte: [
      {
        t: "Große Dachflächen",
        x: "Hallen, Ställe und Scheunen bieten viel Fläche. Glas-Glas-Module halten Ammoniak im Stallbereich stand.",
      },
      {
        t: "Eigenverbrauch",
        x: "Kühlung, Lüftung, Melk- und Fütterungstechnik laufen tagsüber und nutzen Solarstrom direkt.",
      },
      {
        t: "Netzanschluss",
        x: "Bei größeren Leistungen klären wir früh mit dem Netzbetreiber, welcher Anschlusspunkt möglich ist.",
      },
    ],
  },
  _: {
    titel: "Worauf es bei der Planung ankommt",
    punkte: [
      {
        t: "Dach & Statik",
        x: "Dachform, Eindeckung und Tragfähigkeit bestimmen Unterkonstruktion und Modulbelegung.",
      },
      {
        t: "Ausrichtung",
        x: "Süd bringt den höchsten Ertrag je Modul, Ost-West-Belegung verteilt die Erzeugung gleichmäßiger über den Tag.",
      },
      {
        t: "Schnee & Wind",
        x: "Unterkonstruktion und Module werden nach Schneelast und Windlast des Standorts ausgelegt (ÖNORM B 1991-1-3 und -1-4).",
      },
    ],
  },
};

export default async function ProjectDetailPage({ params }) {
  const { title } = await params; // e.g. "mindelheim-2"

  const liste = await fetchProjekteListe();
  const { p, veraltet } = await ladeProjektFuerUrl(title, liste);
  if (!p) notFound();
  // Old URL with the customer name (e.g. /haydu-2) -> new URL by place (/mindelheim-2)
  if (veraltet) permanentRedirect(`/referenzen/projekte/${p.slug}`);

  // Weitere Projekte: gleiche Objektart zuerst, dann ähnliche Leistung
  const weitere = liste
    .filter((x) => x.slug !== p.slug)
    .sort((a, b) => {
      const s = (x) => (x.segment && x.segment === p.segment ? 0 : 1);
      const d = (x) => (p.kwp && x.kwp ? Math.abs(Math.log(x.kwp / p.kwp)) : 9);
      return s(a) - s(b) || d(a) - d(b);
    })
    .slice(0, 3);

  // Ertrag: Wert aus dem Backoffice, sonst rechnerisch
  const ertragRechnerisch =
    p.kwp != null ? Math.round((p.kwp * ERTRAG_JE_KWP) / 1000) * 1000 : null;
  const ertrag = p.ertragApi || ertragRechnerisch;
  const istRechnerisch = !p.ertragApi && !!ertragRechnerisch;
  const haushalte = ertrag
    ? Math.max(1, Math.round(ertrag / HAUSHALT_KWH))
    : null;
  const wissen = WISSEN[p.segment] || WISSEN._;

  // Kundenbühne: Backoffice-Felder am Projekt gewinnen, sonst src/data/kunden.js (fehlt beides: null)
  const kunde = kundeFuerProjekt(p.roh, p.slug);
  const kitFirma = kunde?.firma || p.titel;
  const kitZahlen = schaetzung({ kwp: p.kwp, ertragKwh: p.ertragApi });
  const kundeOrg = kundeSchema(kunde);
  const seo = seoKontext(p, kunde);
  const daten = projektDaten(p);
  const h1Zusatz = [p.kwp != null && `${p.leistungText} Photovoltaik`, brancheKurz(seo.branche), ortKurz(seo.ort)].filter(Boolean).join(" · ");

  const galerie = p.bilder.map((src, i) => ({
    src,
    alt: `${p.titel} – Photovoltaikanlage, Bild ${i + 1}`,
  }));
  const canonicalUrl = `${BASE_URL}/referenzen/projekte/${p.slug}`;
  const ortText = [p.plz, p.ort].filter(Boolean).join(" ");

  const projectSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    inLanguage: "de-AT",
    headline: p.titel,
    description: kurzbeschreibung(p),
    url: canonicalUrl,
    publisher: { "@id": `${BASE_URL}/#organization` },
    author: { "@id": `${BASE_URL}/#organization` },
    datePublished: daten.veroeffentlicht,
    dateModified: daten.geaendert,
    ...(p.bilder.length > 0 && { image: p.bilder }),
    about: {
      "@type": "Thing",
      name: `Photovoltaikanlage ${p.titel}`,
      ...(p.kwp != null && {
        description: `Nennleistung ${p.leistungText}${p.jahr ? `, Baujahr ${p.jahr}` : ""}${p.ort ? `, ${p.ort}` : ""}`,
      }),
    },
    // Kunde als Organisation – nur belegte Werte (Website, Social-Profile)
    ...(kundeOrg && { mentions: [kundeOrg] }),
    ...(p.ort && {
      contentLocation: {
        "@type": "Place",
        name: p.ort,
        ...(p.land === "Österreich" && { address: { "@type": "PostalAddress", addressLocality: p.ort, addressCountry: "AT" } }),
        ...(p.lat &&
          p.lng && {
            geo: {
              "@type": "GeoCoordinates",
              latitude: p.lat,
              longitude: p.lng,
            },
          }),
      },
    }),
  };

  // true only for real values (not null, undefined, "", NaN, 0)
  const hat = (v) =>
    v !== null &&
    v !== undefined &&
    v !== "" &&
    !(typeof v === "number" && (isNaN(v) || v === 0));

  const fakten = [
    hat(p.kwp) &&
      hat(p.leistungText) && {
        icon: Zap,
        label: "Nennleistung",
        wert: p.leistungText,
        gross: true,
      },
    hat(p.jahr) && {
      icon: CalendarDays,
      label: "Baujahr",
      wert: String(p.jahr),
    },
    hat(p.segment) && { icon: Home, label: "Objektart", wert: p.segment },
    hat(p.ort) && { icon: MapPin, label: "Ort", wert: p.ort },
    hat(ertrag) && {
      icon: Sun,
      label: istRechnerisch ? "Ertrag (rechnerisch)" : "Ertrag",
      wert: `≈ ${fmtZahl(ertrag)} kWh/Jahr`,
    },
  ].filter(Boolean);

  // Tailwind needs complete class names → fixed lookup instead of building strings
  const SPALTEN = {
    1: "grid-cols-1",
    2: "grid-cols-2 lg:grid-cols-2",
    3: "grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-2 lg:grid-cols-4",
    5: "grid-cols-2 lg:grid-cols-5",
  };

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(projectSchema) }}
      />

      <PageHero
        variant="immersive"
        breadcrumbs={[
          { name: "Referenzen", href: "/referenzen/projekte" },
          { name: "Projekte", href: "/referenzen/projekte" },
          { name: p.titel },
        ]}
        eyebrow={["Referenzprojekt", p.jahr].filter(Boolean).join(" · ")}
        title={
          <>
            {p.titel}
            {h1Zusatz && " "}
            {h1Zusatz && <span className="mt-3 block text-[0.5em] font-semibold leading-snug tracking-normal text-white/80">{h1Zusatz}</span>}
          </>
        }
        lead={kurzbeschreibung(p)}
        image={{
          src: p.bild || FALLBACK_BILD,
          alt: `Photovoltaikanlage ${p.titel}`,
        }}
        points={p.typTeile}
        actions={[
          { label: "Ähnliche Anlage anfragen", href: "/angebot" },
          {
            label: "Ertrag berechnen",
            href: "/solarrechner",
            icon: Calculator,
          },
        ]}
        className="pb-16"
      />

      {/* Kennzahlen-Leiste */}
      {/* Kennzahlen-Leiste – only shows boxes with values, hidden completely when empty */}
      {fakten.length > 0 && (
        <div className="relative z-10 -mt-14 md:-mt-16">
          <div className="ov-container">
            <Reveal dir="scale">
              <dl
                className={`grid overflow-hidden rounded-3xl bg-white shadow-[0_30px_70px_-35px_rgba(15,23,42,0.45)] ring-1 ring-ink-200/70 ${SPALTEN[fakten.length]}`}
              >
                {fakten.map((f, i) => {
                  const einzeln = fakten.length === 1;
                  const letzteUngerade =
                    fakten.length > 1 &&
                    fakten.length % 2 === 1 &&
                    i === fakten.length - 1;
                  return (
                    <div
                      key={f.label}
                      className={[
                        "flex flex-col gap-2 border-ink-100 p-5 md:p-7",
                        // Desktop: divider between all boxes
                        i > 0 && "lg:border-l",
                        // Mobile (2 columns): divider left in the right column, top from row 2
                        !einzeln && i % 2 === 1 && "border-l",
                        !einzeln && i >= 2 && "border-t lg:border-t-0",
                        // odd count: last box full width on mobile
                        letzteUngerade &&
                          "col-span-2 border-l-0 lg:col-span-1 lg:border-l",
                        f.gross && "bg-ov-50/60",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                    >
                      <dt className="flex items-center gap-2 text-[12.5px] font-semibold uppercase tracking-[0.12em] text-ink-500">
                        <f.icon
                          aria-hidden="true"
                          className="h-4 w-4 text-ov-600"
                        />
                        {f.label}
                      </dt>
                      <dd
                        className={`ov-num font-display font-extrabold leading-tight tracking-tight text-ink-900 ${f.gross ? "text-[26px] md:text-[32px]" : "text-[18px] md:text-[21px]"}`}
                      >
                        {f.wert}
                      </dd>
                    </div>
                  );
                })}
              </dl>
            </Reveal>
          </div>
        </div>
      )}

      {/* Galerie */}
      {galerie.length > 0 && (
        <Section tone="white" space="md">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <SectionHeading eyebrow="Galerie" title="Die Anlage im Bild" />
            <p className="text-[14px] text-ink-500">
              {galerie.length} {galerie.length === 1 ? "Foto" : "Fotos"} · zum
              Vergrößern antippen
            </p>
          </div>
          <ProjektGalerie bilder={galerie} titel={p.titel} />
        </Section>
      )}

      {/* Kundenporträt – nur mit Kundendaten */}
      {hatPortraet(kunde) && <KundenPortraet kunde={kunde} ort={p.ort} />}

      {/* Steckbrief + Einordnung */}
      <Section tone="sand" space="lg">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <Reveal dir="left">
            <div className="rounded-3xl bg-white p-7 ring-1 ring-ink-200/70 md:p-9">
              <p className="text-[12.5px] font-semibold uppercase tracking-[0.16em] text-ov-600">
                Projektsteckbrief
              </p>
              <h2 className="ov-h3 mt-3 text-ink-900">{p.titel}</h2>
              <dl className="mt-6 divide-y divide-ink-100 text-[15.5px]">
                {[
                  ["Leistung", p.leistungText],
                  ["Baujahr", p.jahr],
                  ["Objektart", p.segment],
                  ["Dachart", p.dacharten.join(", ")],
                  ["Module", p.modul],
                  ["Wechselrichter", p.wechselrichter],
                  ["Speicher", p.speicher],
                  ["Ort", ortText],
                  ["Land", p.ort ? p.land : null],
                ]
                  .filter(([, v]) => v)
                  .map(([k, v]) => (
                    <div key={k} className="flex justify-between gap-6 py-3">
                      <dt className="text-ink-500">{k}</dt>
                      <dd className="text-right font-semibold text-ink-900">
                        {v}
                      </dd>
                    </div>
                  ))}
              </dl>
              {ertrag && (
                <div className="mt-6 rounded-2xl bg-ov-50 p-5">
                  <p className="flex items-start gap-2.5 text-[14.5px] leading-relaxed text-ink-700">
                    <Info
                      aria-hidden="true"
                      className="mt-0.5 h-4 w-4 shrink-0 text-ov-600"
                    />
                    <span>
                      {istRechnerisch
                        ? "Rechnerisch erzeugt eine Anlage dieser Größe"
                        : "Diese Anlage erzeugt"}{" "}
                      rund{" "}
                      <strong className="text-ink-900">
                        {fmtZahl(ertrag)} kWh
                      </strong>{" "}
                      im Jahr – etwa der Verbrauch von{" "}
                      <strong className="text-ink-900">
                        {haushalte}{" "}
                        {haushalte === 1 ? "Haushalt" : "Haushalten"}
                      </strong>{" "}
                      mit {fmtZahl(HAUSHALT_KWH)} kWh.
                      {istRechnerisch &&
                        ` Orientierung mit ${fmtZahl(ERTRAG_JE_KWP)} kWh je kWp, kein Messwert.`}
                    </span>
                  </p>
                </div>
              )}
            </div>
          </Reveal>

          <div>
            <SectionHeading
              eyebrow="Einordnung"
              title={wissen.titel}
              lead={`Jede Anlage wird individuell geplant. Diese Punkte spielen bei Projekten wie ${p.titel} typischerweise eine Rolle (Stand 2026).`}
            />
            <ul className="mt-8 space-y-4">
              {wissen.punkte.map((w, i) => (
                <Reveal
                  as="li"
                  key={w.t}
                  delay={i * 90}
                  className="flex gap-4 rounded-3xl bg-white p-6 ring-1 ring-ink-200/60"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-ov-600 font-display text-[15px] font-extrabold text-white">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="font-display text-[18px] font-bold text-ink-900">
                      {w.t}
                    </h3>
                    <p className="mt-1.5 text-[15.5px] leading-relaxed text-ink-600">
                      {w.x}
                    </p>
                  </div>
                </Reveal>
              ))}
            </ul>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button href="/angebot" pfeil>
                Anlage für mein Dach planen
              </Button>
              <Button
                href="/referenzen/referenzkarte"
                variant="secondary"
                icon={Layers}
              >
                Referenzkarte
              </Button>
            </div>
          </div>
        </div>
      </Section>

      {/* Solar-Kit für den Kunden: Siegel, Social-Kit, ESG-Bericht */}
      <SolarKit slug={p.slug} firma={kitFirma} zahlen={kitZahlen} />

      {/* Weitere Projekte */}
      {weitere.length > 0 && (
        <Section tone="white" space="lg">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
            <SectionHeading
              eyebrow="Weitere Referenzen"
              title={
                p.segment ? (
                  <>
                    Mehr Projekte:{" "}
                    <span className="ov-text-gradient">{p.segment}</span>
                  </>
                ) : (
                  "Weitere Kundenprojekte entdecken"
                )
              }
            />
            <Button
              href="/referenzen/projekte"
              variant="secondary"
              icon={ArrowLeft}
            >
              Alle Projekte
            </Button>
          </div>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {weitere.map((w, i) => (
              <Reveal as="li" key={w.slug} delay={i * 90}>
                <ProjektKarte projekt={w} />
              </Reveal>
            ))}
          </ul>
        </Section>
      )}

      <CtaBand
        eyebrow="Ihre Anlage als nächste Referenz"
        title={
          p.kwp != null
            ? `${fmtKwp(p.kwp)} kWp oder ganz anders – was passt auf Ihr Dach?`
            : "Was passt auf Ihr Dach?"
        }
        text={`${FIRMA.name} aus ${FIRMA.ort} prüft Lastgang, Dach und Netzanschluss und erstellt Ihnen ein ehrliches Angebot – mit Planung, Montage und Netzanschluss aus einer Hand, in ganz Österreich.`}
        primary={{ label: "Projekt anfragen", href: "/angebot" }}
        secondary={{ label: "Ertrag berechnen", href: "/solarrechner" }}
      />
    </div>
  );
}
