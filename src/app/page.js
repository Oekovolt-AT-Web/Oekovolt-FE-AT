// src/app/page.js (Startseite Österreich)
//
// Fokus: Gewerbe, Industrie, Landwirtschaft und öffentliche Hand in ganz
// Österreich. Alle Kernaussagen stammen aus @/data/hero (belegt, Stand 09/2026);
// es werden bewusst KEINE Gruppen-Kennzahlen der deutschen Website verwendet.
//
// Rhythmus: Hero mit Live-Rechner (dunkel) → Referenz-Laufband → Lösungs-Bento
// (Foto) → Rechner & Tools (dunkel) → Warum Ökovolt → Strommarkt live (dunkel)
// → Energie nutzen (Foto) → Eigene Technik & Service → Ablauf → Projekte (API)
// → FAQ mit Wissen & Gemeinsam → CtaBand.

import { cache } from "react";

import { projektSlug } from "@/components/Project/projektDaten";
import { ladeProjekteRoh } from "@/components/Project/ladeProjekte";
import { hreflangLanguages } from "@/lib/hreflang";
import { getEnergySnapshot } from "@/lib/energy";
import { BASE_URL } from "@/lib/site";
import { HOME_HERO } from "@/data/hero";

import FoerdercallHinweis from "@/components/Foerdercall/FoerdercallHinweis";
import MannschaftTeaser from "@/components/Mannschaft/MannschaftTeaser";
import ReelsAbschnitt from "@/components/Reels/ReelsAbschnitt";

// Jeder Abschnitt liegt in einer eigenen Datei (src/components/Startseite/), damit er unabhängig
// gestaltet werden kann. Reihenfolge, Daten-Laden, Metadaten und JSON-LD bleiben hier.
import StartHero from "@/components/Startseite/S01Hero";
import StartReferenzen from "@/components/Startseite/S02Referenzen";
import StartLoesungen, { ZIELGRUPPEN } from "@/components/Startseite/S03Loesungen";
import StartRechner from "@/components/Startseite/S04Rechner";
import StartWarum from "@/components/Startseite/S05Warum";
import StartStrommarkt from "@/components/Startseite/S06Strommarkt";
import StartEnergieNutzen, { ENERGIE_NUTZEN } from "@/components/Startseite/S07EnergieNutzen";
import StartTechnik from "@/components/Startseite/S08Technik";
import StartProzess from "@/components/Startseite/S09Prozess";
import StartProjekte from "@/components/Startseite/S10Projekte";
import StartFaq from "@/components/Startseite/S11Faq";
import StartAbschluss from "@/components/Startseite/S12Abschluss";

// API, sonst statischer Stand src/data/projekte.js
const getProjekte = cache(() => ladeProjekteRoh());

// Title bewusst getrennt von /gewerbe (M13): Startseite = Firma/Anbieter für alle Zielgruppen,
// /gewerbe = Gewerbe & Industrie. Stand der Seite (fest, kein new Date()): bei Inhaltsänderung anpassen.
const META = {
  title: "PV-Anlagen für Unternehmen in ganz Österreich | Ökovolt",
  description:
    "Ökovolt plant, baut und betreibt Photovoltaik für Betriebe, Landwirtschaft und Gemeinden in allen neun Bundesländern – eigener Parkregler und SCADA, seit 2012.",
  stand: "2026-09-30",
};

export function generateMetadata() {
  const bild = { url: `${BASE_URL}/og-image.jpg`, width: 1200, height: 630, alt: "Photovoltaik für Gewerbe und Industrie in Österreich – Ökovolt" };
  return {
    title: META.title,
    description: META.description,
    keywords: [
      "Photovoltaik Gewerbe Österreich", "PV-Anlage Industrie", "Photovoltaik Firma Österreich", "Freiflächen-Photovoltaik", "Agri-PV Österreich",
      "Photovoltaik Landwirtschaft", "Photovoltaik Gemeinde", "Parkregler EZA-Regler", "EAG Investitionszuschuss", "Ökovolt",
    ],
    alternates: { canonical: BASE_URL, languages: hreflangLanguages(BASE_URL) },
    openGraph: { type: "website", locale: "de_AT", url: BASE_URL, siteName: "Ökovolt Österreich", title: META.title, description: META.description, images: [bild] },
    twitter: { card: "summary_large_image", title: META.title, description: META.description, images: [bild.url] },
  };
}


/* ------------------------------------------------------------------ */

export default async function HomePage() {
  const [projekteRoh, energie] = await Promise.all([getProjekte(), getEnergySnapshot().catch(() => null)]);

  // Neueste 4 Projekte – Felder und Sortierung wie im Portfolio (/referenzen/projekte: "Neueste")
  const projekteListe = Array.isArray(projekteRoh) ? projekteRoh : projekteRoh?.projekte;
  // Referenz-Namen nur verlinken, wenn es die Projektseite im Backoffice gibt – nie ein 404-Link.
  const vorhandeneSlugs = new Set((Array.isArray(projekteListe) ? projekteListe : []).map(projektSlug).filter(Boolean));
  const projekte = (Array.isArray(projekteListe) ? projekteListe : [])
    .filter((p) => p.projekt_website_name)
    .map((p) => ({
      title: p.projekt_name || p.projekt_website_name,
      slug: projektSlug(p),
      bild: p.bild_url ? encodeURI(p.bild_url) : null,
      leistung: p.leistung_label,
      jahr: Number(p.jahr) || 0,
      kwp: Number(p.leistung) || 0,
    }))
    .sort((a, b) => b.jahr - a.jahr || b.kwp - a.kwp)
    .slice(0, 4);


  const homePageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${BASE_URL}/#webpage`,
    url: BASE_URL,
    name: META.title,
    description: META.description,
    inLanguage: "de-AT",
    isPartOf: { "@id": `${BASE_URL}/#website` },
    about: { "@id": `${BASE_URL}/#organization` },
    primaryImageOfPage: `${BASE_URL}${HOME_HERO.bild}`,
    dateModified: META.stand,
  };

  const zielgruppenSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Photovoltaik-Lösungen von Ökovolt Österreich",
    itemListElement: [...ZIELGRUPPEN, ...ENERGIE_NUTZEN.map((e) => ({ titel: e.title, href: e.href }))].map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: p.titel,
      url: `${BASE_URL}${p.href}`,
    })),
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(homePageSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(zielgruppenSchema) }} />

      {/* Hinweis EAG-Fördercall Oktober 2026 – blendet sich nach Call-Ende selbst aus; Rückbau: Zeile + Import löschen */}
      <FoerdercallHinweis />

      <StartHero />
      <StartReferenzen vorhandeneSlugs={[...vorhandeneSlugs]} />
      <StartLoesungen />
      {/* Eigene Mannschaft (Teaser → /uber-uns#mannschaft) */}
      <MannschaftTeaser />
      <StartRechner />
      <StartWarum />
      <StartStrommarkt energie={energie} />
      <StartEnergieNutzen />
      <StartTechnik />
      <StartProzess />
      <StartProjekte projekte={projekte} />
      {/* Presse & News: selbst gehostete Kurzvideos (src/data/reels.js), Mediathek unter /mediathek */}
      <ReelsAbschnitt tone="ink" space="md" />
      <StartFaq tone={projekte.length > 0 ? "sand" : "white"} />
      <StartAbschluss />
    </div>
  );
}
