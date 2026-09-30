// src/app/schneelast/[bundesland]/page.js
//
// Schneelast je Bundesland: ZUSAMMENGEFÜHRT in den Hub /schneelast (Sprungmarke #<land>).
//
// Begründung (SEO-Plan M26, Entscheidung E9, Messung vom 30.09.2026): Die neun Landesvarianten
// unterschieden sich nur in der Ortstabelle (4 bis 23 Zeilen); der übrige Text war gleich. Die
// 5-Wort-Überschneidung (Jaccard der 5-Wort-Folgen im <main>) lag bei max. 0,64 und im Mittel bei
// 0,58 – über dem Plan-Kriterium 0,35. Deshalb stehen Einordnung und Tabelle jedes Landes jetzt
// im Hub unter /schneelast#<land>; diese Route leitet dauerhaft (308) dorthin weiter, damit alte
// Links und Lesezeichen funktionieren. Die Seiten gehören NICHT mehr in Sitemap und llms.txt.

import { notFound, permanentRedirect } from "next/navigation";
import { LAENDER, landFuerSlug } from "@/lib/schneelast/laender";

export const dynamicParams = false;

export function generateStaticParams() {
  return LAENDER.map((l) => ({ bundesland: l.slug }));
}

export default async function SchneelastLandWeiterleitung({ params }) {
  const { bundesland } = await params;
  const land = landFuerSlug(bundesland);
  if (!land) notFound();
  permanentRedirect(`/schneelast#${land.slug}`);
}
