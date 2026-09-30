"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { HEATMAP_GERAETE, geraetFuerBreite } from "@/lib/heatmap";
import useHeatmapSammler from "./HeatmapSammler";

// Die Ansicht (inkl. heatmap.js) wird nur im Ansichtsmodus nachgeladen – normale Besucher laden davon nichts.
const HeatmapAnsicht = dynamic(() => import("./HeatmapAnsicht"), { ssr: false });

// Ansichtsmodus bleibt bei Client-Navigation erhalten (Modul-Variable, kein Browserspeicher)
let ansichtGemerkt = null;

/**
 * Klick- und Scroll-Heatmap (eingebunden in components/Reusable/LayoutWrapper.js).
 *
 * - Normale Besucher: kleiner Sammler, aktiv nur mit Einwilligung „Statistik“ (siehe HeatmapSammler.js).
 * - Ansicht: beliebige Seite mit ?heatmap=<HEATMAP_TOKEN>&geraet=desktop aufrufen. Der Token wird erst
 *   serverseitig von /api/heatmap geprüft; im Ansichtsmodus wird nichts erfasst.
 */
export default function Heatmap() {
  const pfad = usePathname() || "/";
  // undefined = noch nicht geprüft (Sammler wartet), null = kein Ansichtsmodus
  const [ansicht, setAnsicht] = useState(undefined);

  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const token = q.get("heatmap");
    if (token) {
      const g = q.get("geraet");
      ansichtGemerkt = {
        token: token.slice(0, 200),
        geraet: HEATMAP_GERAETE.includes(g) ? g : geraetFuerBreite(window.innerWidth),
      };
    }
    setAnsicht(ansichtGemerkt);
  }, [pfad]);

  useHeatmapSammler(pfad, ansicht !== null);

  if (!ansicht) return null;
  return (
    <HeatmapAnsicht
      pfad={pfad}
      token={ansicht.token}
      geraetStart={ansicht.geraet}
      onBeenden={() => {
        ansichtGemerkt = null;
        // Ohne Parameter neu laden, damit der Token aus der Adresszeile verschwindet
        window.location.assign(window.location.pathname);
      }}
    />
  );
}
