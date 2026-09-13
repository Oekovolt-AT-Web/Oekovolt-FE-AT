// src/app/referenzen/projekte/[title]/page.js

import { notFound } from "next/navigation";
import { ArrowLeft, Calculator, CalendarDays, Home, MapPin, Sun, Zap, Layers, Info } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import CtaBand from "@/components/ui/CtaBand";
import Reveal from "@/components/ui/Reveal";
import Button from "@/components/ui/Button";
import ProjektGalerie from "@/components/ProjectItem/ProjektGalerie";
import ProjektKarte from "@/components/Project/ProjektKarte";
import { ERTRAG_JE_KWP, HAUSHALT_KWH, bildUrl, fmtKwp, fmtZahl, normalisiereProjekt } from "@/components/Project/projektDaten";
import { API_BASE_URL, getApiHeaders, isApiConfigured } from "@/lib/apiBaseUrl";
import { generateSlug } from "@/lib/slugify";

const PROJECTS_URL = `${API_BASE_URL}oekovoltdeutchland.oekovoltdeutchland.doctype.projekte.api.projektede_data`;
const BASE_URL = "https://www.oekovolt.de";

// Helper function to fetch all projects
async function fetchAllProjects() {
  if (!isApiConfigured()) {
    console.error("API not configured: Missing API_KEY or API_SECRET in environment variables");
    return [];
  }

  try {
    const headers = getApiHeaders();

    const res = await fetch(PROJECTS_URL, {
      method: "GET",
      headers: headers,
      next: { revalidate: 600 } // ISR: Revalidate every hour
    });

    if (!res.ok) {
      let errorText = "";
      try {
        const errorData = await res.json();
        errorText = JSON.stringify(errorData);
        console.error("Error response:", errorData);
      } catch (e) {
        errorText = await res.text();
        console.error("Error text:", errorText);
      }
      console.error(`API returned ${res.status}: ${errorText}`);
      return [];
    }

    const data = await res.json();
    return data?.message || [];
  } catch (error) {
    console.error("Error fetching projects:", error);
    return [];
  }
}

// Generate static params at build time - this enables static generation
export async function generateStaticParams() {
  try {
    const projects = await fetchAllProjects();

    if (!projects || projects.length === 0) {
      console.warn("⚠️ No projects found - returning empty params");
      return [];
    }

    const params = projects.map((project) => ({
      title: generateSlug(project.title || project.name)
    })).filter(param => param.title);

    return params;
  } catch (error) {
    console.error("Error in generateStaticParams:", error);
    return [];
  }
}

/** Sachliche Kurzbeschreibung – nur aus den Projektfeldern zusammengesetzt */
function kurzbeschreibung(p) {
  const teile = [];
  teile.push(`Photovoltaikanlage${p.kwp != null ? ` mit ${p.leistungText}` : ""}`);
  if (p.segment) teile.push(p.segment === "Einfamilienhaus" ? "auf einem Einfamilienhaus" : p.segment === "Gewerbe" ? "auf einem Gewerbeobjekt" : "auf einem landwirtschaftlichen Gebäude");
  if (p.ort) teile.push(`in ${p.ort}`);
  let satz = teile.join(" ");
  if (p.jahr) satz += `, realisiert ${p.jahr}`;
  satz += " von Ökovolt.";
  if (p.typ) satz += ` Objekt & Montage: ${p.typ}.`;
  return satz;
}

export async function generateMetadata({ params }) {
  try {
    const { title } = await params;
    const projects = await fetchAllProjects();
    const project = projects.find(p => generateSlug(p.title) === title || generateSlug(p.name) === title);

    if (!project) {
      return {
        title: "Projekt nicht gefunden | Ökovolt",
        robots: { index: false }
      };
    }

    const p = normalisiereProjekt(project);
    const projectTitle = p.titel;
    const seitenTitel = `${projectTitle}${p.kwp != null ? ` – ${p.leistungText} PV` : ""} | Ökovolt`;
    const description = project.description || `${kurzbeschreibung(p)} Bilder, Kennzahlen und Projektdetails – jetzt ansehen und eigene Anlage anfragen.`.slice(0, 200);
    const canonical = `${BASE_URL}/referenzen/projekte/${title}`;
    const imgUrl = p.bilder[0] ? `${BASE_URL}/api/image?path=${p.bilder[0]}` : `${BASE_URL}/og-image.jpg`;

    return {
      title: seitenTitel,
      description,
      alternates: { canonical },
      robots: { index: true, follow: true },
      openGraph: {
        type: "article",
        locale: "de_DE",
        url: canonical,
        siteName: "Ökovolt Deutschland",
        title: seitenTitel,
        description,
        images: [{ url: imgUrl, width: 1200, height: 630, alt: projectTitle }],
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
      robots: { index: false }
    };
  }
}

// Fachwissen je Objektart – allgemeine Orientierung, keine Projektangaben
const WISSEN = {
  Einfamilienhaus: {
    titel: "Worauf es beim Einfamilienhaus ankommt",
    punkte: [
      { t: "Eigenverbrauch", x: "Ohne Speicher nutzt ein Haushalt typischerweise 25–35 % des Solarstroms selbst, mit passend dimensioniertem Speicher oft 60–80 %." },
      { t: "Steuern", x: "Anlagen bis 30 kWp auf Wohngebäuden sind von der Umsatzsteuer (0 % nach § 12 Abs. 3 UStG) und der Einkommensteuer (§ 3 Nr. 72 EStG) befreit." },
      { t: "Zukunft mitdenken", x: "Wallbox oder Wärmepumpe verschieben die ideale Anlagengröße nach oben – das planen wir von Anfang an ein." },
    ],
  },
  Gewerbe: {
    titel: "Worauf es bei Gewerbedächern ankommt",
    punkte: [
      { t: "Lastgang", x: "Betriebe verbrauchen tagsüber, wenn die Anlage erzeugt – das ermöglicht hohe Eigenverbrauchsquoten ohne großen Speicher." },
      { t: "Statik & Dachhaut", x: "Trapez-, Sandwich- und Flachdächer brauchen passende Unterkonstruktionen und eine Prüfung der Tragreserven." },
      { t: "Ab 100 kWp", x: "Neue Anlagen über 100 kWp müssen ihren Überschuss direkt vermarkten und fernsteuerbar sein – wir binden das bei der Planung ein." },
    ],
  },
  Landwirtschaft: {
    titel: "Worauf es in der Landwirtschaft ankommt",
    punkte: [
      { t: "Große Dachflächen", x: "Hallen, Ställe und Scheunen bieten viel Fläche – oft lohnt es sich, das Dach vollständig zu belegen." },
      { t: "Eigenverbrauch", x: "Kühlung, Lüftung, Melk- und Fütterungstechnik laufen tagsüber und nutzen Solarstrom direkt." },
      { t: "Netzanschluss", x: "Bei größeren Leistungen klären wir früh mit dem Netzbetreiber, welcher Anschlusspunkt möglich ist." },
    ],
  },
  _: {
    titel: "Worauf es bei der Planung ankommt",
    punkte: [
      { t: "Dach & Statik", x: "Dachform, Eindeckung und Tragfähigkeit bestimmen Unterkonstruktion und Modulbelegung." },
      { t: "Ausrichtung", x: "Süd bringt den höchsten Ertrag je Modul, Ost-West-Belegung verteilt die Erzeugung gleichmäßiger über den Tag." },
      { t: "Einspeisung", x: "Neue Anlagen ohne Smart Meter speisen seit dem Solarspitzengesetz (2025) höchstens 60 % ihrer Leistung ein – ein Speicher gleicht das aus." },
    ],
  },
};

export default async function ProjectDetailPage({ params }) {
  const { title } = await params;

  // Fetch all projects
  const projects = await fetchAllProjects();

  // Find the current project
  const project = projects.find((p) => generateSlug(p.title || p.name) === title) ?? null;

  if (!project) notFound();

  const p = normalisiereProjekt(project);
  const alle = projects.map(normalisiereProjekt).filter((x) => x.slug && x.slug !== p.slug);

  // Weitere Projekte: gleiche Objektart zuerst, dann ähnliche Leistung
  const weitere = [...alle]
    .sort((a, b) => {
      const s = (x) => (x.segment && x.segment === p.segment ? 0 : 1);
      const d = (x) => (p.kwp != null && x.kwp != null ? Math.abs(Math.log(x.kwp / p.kwp)) : 9);
      return s(a) - s(b) || d(a) - d(b);
    })
    .slice(0, 3);

  const ertrag = p.kwp != null ? Math.round((p.kwp * ERTRAG_JE_KWP) / 1000) * 1000 : null;
  const haushalte = ertrag ? Math.max(1, Math.round(ertrag / HAUSHALT_KWH)) : null;
  const wissen = WISSEN[p.segment] || WISSEN._;

  const galerie = p.bilder.map((pfad, i) => ({ src: bildUrl(pfad), alt: `${p.titel} – Photovoltaikanlage, Bild ${i + 1}` }));

  const projectSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: p.titel,
    description: project.description || kurzbeschreibung(p),
    url: `${BASE_URL}/referenzen/projekte/${generateSlug(title)}`,
    publisher: { "@id": `${BASE_URL}/#organization` },
    author: { "@id": `${BASE_URL}/#organization` },
    dateModified: project.modified || new Date().toISOString(),
    ...(p.bilder.length > 0 && { image: p.bilder.map((pfad) => `${BASE_URL}/api/image?path=${pfad}`) }),
    about: {
      "@type": "Thing",
      name: `Photovoltaikanlage ${p.titel}`,
      ...(p.kwp != null && { description: `Nennleistung ${p.leistungText}${p.jahr ? `, Baujahr ${p.jahr}` : ""}${p.ort ? `, ${p.ort}` : ""}` }),
    },
    ...(p.ort && { contentLocation: { "@type": "Place", name: p.ort } }),
  };

  const fakten = [
    p.kwp != null && { icon: Zap, label: "Nennleistung", wert: p.leistungText, gross: true },
    p.jahr && { icon: CalendarDays, label: "Baujahr", wert: String(p.jahr) },
    p.segment && { icon: Home, label: "Objektart", wert: p.segment },
    p.ort && { icon: MapPin, label: "Ort", wert: p.ort },
    ertrag && { icon: Sun, label: "Ertrag (rechnerisch)", wert: `≈ ${fmtZahl(ertrag)} kWh/Jahr` },
  ].filter(Boolean);

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(projectSchema) }}
      />

      <PageHero
        variant="immersive"
        breadcrumbs={[{ name: "Referenzen", href: "/referenzen/projekte" }, { name: "Projekte", href: "/referenzen/projekte" }, { name: p.titel }]}
        eyebrow={["Referenzprojekt", p.jahr].filter(Boolean).join(" · ")}
        title={p.titel}
        lead={kurzbeschreibung(p)}
        image={{ src: p.bild, alt: `Photovoltaikanlage ${p.titel}` }}
        points={p.typTeile}
        actions={[
          { label: "Ähnliche Anlage anfragen", href: "/angebot" },
          { label: "Ertrag berechnen", href: "/solarrechner", icon: Calculator },
        ]}
        className="pb-16"
      />

      {/* Kennzahlen-Leiste */}
      {fakten.length > 0 && (
        <div className="relative z-10 -mt-14 md:-mt-16">
          <div className="ov-container">
            <Reveal dir="scale">
              <dl className={`grid grid-cols-2 overflow-hidden rounded-3xl bg-white shadow-[0_30px_70px_-35px_rgba(15,23,42,0.45)] ring-1 ring-ink-200/70 ${fakten.length >= 5 ? "lg:grid-cols-5" : fakten.length === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"}`}>
                {fakten.map((f, i) => (
                  <div
                    key={f.label}
                    className={`flex flex-col gap-2 border-ink-100 p-5 md:p-7 ${i > 0 ? "lg:border-l" : ""} ${i % 2 === 1 ? "border-l" : ""} ${i >= 2 ? "border-t lg:border-t-0" : ""} ${f.gross ? "bg-ov-50/60" : ""} ${fakten.length % 2 === 1 && i === fakten.length - 1 ? "col-span-2 lg:col-span-1" : ""}`}
                  >
                    <dt className="flex items-center gap-2 text-[12.5px] font-semibold uppercase tracking-[0.12em] text-ink-500">
                      <f.icon aria-hidden="true" className="h-4 w-4 text-ov-600" />
                      {f.label}
                    </dt>
                    <dd className={`ov-num font-display font-extrabold leading-tight tracking-tight text-ink-900 ${f.gross ? "text-[26px] md:text-[32px]" : "text-[18px] md:text-[21px]"}`}>{f.wert}</dd>
                  </div>
                ))}
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
            <p className="text-[14px] text-ink-500">{galerie.length} {galerie.length === 1 ? "Foto" : "Fotos"} · zum Vergrößern antippen</p>
          </div>
          <ProjektGalerie bilder={galerie} titel={p.titel} />
        </Section>
      )}

      {/* Steckbrief + Einordnung */}
      <Section tone="sand" space="lg">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <Reveal dir="left">
            <div className="rounded-3xl bg-white p-7 ring-1 ring-ink-200/70 md:p-9">
              <p className="text-[12.5px] font-semibold uppercase tracking-[0.16em] text-ov-600">Projektsteckbrief</p>
              <h2 className="ov-h3 mt-3 text-ink-900">{p.titel}</h2>
              <dl className="mt-6 divide-y divide-ink-100 text-[15.5px]">
                {[
                  ["Leistung", p.leistungText],
                  ["Baujahr", p.jahr],
                  ["Objektart", p.segment],
                  ["Objekt / Montage", p.typ],
                  ["Dachart", p.dacharten.join(", ")],
                  ["Ort", p.ort],
                  ["Land", p.ort ? p.land : null],
                ]
                  .filter(([, v]) => v)
                  .map(([k, v]) => (
                    <div key={k} className="flex justify-between gap-6 py-3">
                      <dt className="text-ink-500">{k}</dt>
                      <dd className="text-right font-semibold text-ink-900">{v}</dd>
                    </div>
                  ))}
              </dl>
              {ertrag && (
                <div className="mt-6 rounded-2xl bg-ov-50 p-5">
                  <p className="flex items-start gap-2.5 text-[14.5px] leading-relaxed text-ink-700">
                    <Info aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-ov-600" />
                    <span>
                      Rechnerisch erzeugt eine Anlage dieser Größe rund <strong className="text-ink-900">{fmtZahl(ertrag)} kWh</strong> im Jahr – etwa der Verbrauch von{" "}
                      <strong className="text-ink-900">{haushalte} {haushalte === 1 ? "Haushalt" : "Haushalten"}</strong> mit {fmtZahl(HAUSHALT_KWH)} kWh. Orientierung mit {fmtZahl(ERTRAG_JE_KWP)} kWh je kWp, kein Messwert.
                    </span>
                  </p>
                </div>
              )}
            </div>
          </Reveal>

          <div>
            <SectionHeading eyebrow="Einordnung" title={wissen.titel} lead={`Jede Anlage wird individuell geplant. Diese Punkte spielen bei Projekten wie ${p.titel} typischerweise eine Rolle (Stand 2026).`} />
            <ul className="mt-8 space-y-4">
              {wissen.punkte.map((w, i) => (
                <Reveal as="li" key={w.t} delay={i * 90} className="flex gap-4 rounded-3xl bg-white p-6 ring-1 ring-ink-200/60">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-ov-500 font-display text-[15px] font-extrabold text-white">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="font-display text-[18px] font-bold text-ink-900">{w.t}</h3>
                    <p className="mt-1.5 text-[15.5px] leading-relaxed text-ink-600">{w.x}</p>
                  </div>
                </Reveal>
              ))}
            </ul>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button href="/angebot" pfeil>
                Anlage für mein Dach planen
              </Button>
              <Button href="/referenzen/referenzkarte" variant="secondary" icon={Layers}>
                Referenzkarte
              </Button>
            </div>
          </div>
        </div>
      </Section>

      {/* Weitere Projekte */}
      {weitere.length > 0 && (
        <Section tone="white" space="lg">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
            <SectionHeading
              eyebrow="Weitere Referenzen"
              title={p.segment ? <>Mehr Projekte: <span className="ov-text-gradient">{p.segment}</span></> : "Weitere Kundenprojekte entdecken"}
            />
            <Button href="/referenzen/projekte" variant="secondary" icon={ArrowLeft}>
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
        title={p.kwp != null ? `${fmtKwp(p.kwp)} kWp oder ganz anders – was passt auf Ihr Dach?` : "Was passt auf Ihr Dach?"}
        text="Wir prüfen Dach, Verbrauch und Ihre Pläne und erstellen Ihnen ein ehrliches Angebot – mit Planung, Montage und Anmeldung aus einer Hand."
        primary={{ label: "Kostenloses Angebot anfragen", href: "/angebot" }}
        secondary={{ label: "Ertrag berechnen", href: "/solarrechner" }}
      />
    </div>
  );
}
