"use client";

// src/components/GewerbeUnikat/K7Ausgang.js
//
// K7 · Kapitel-Ausgang (klein, ohne Bibliothek): genau ein primärer CTA und ein sekundärer Textlink.
//  - primär HAUPT_CTA („Ersteinschätzung anfragen“, seitenweit gleich) → anfrageUrl(Steckbrief) – übernimmt kWp
//    (aus dem Pult, sobald es bedient wurde), Jahresverbrauch und Speicher
//  - sekundär (Textlink) „Videotermin – gern mit Ihrer Steuerberatung“ → /termin?art=video&thema=gewerbe
//  - „Kauf, Kredit oder Leasing vergleichen“ steht in der Wissensschublade des Kapitels

import { KapitelAusgang } from "./_bausteine";
import { HAUPT_CTA, mitThema } from "./_cta";
import { anfrageUrl, useSteckbrief } from "./_steckbrief";

export default function K7Ausgang() {
  const sb = useSteckbrief();
  return (
    <KapitelAusgang
      primaer={{ label: HAUPT_CTA, href: mitThema(anfrageUrl(sb), sb.quelle === "eigen" ? "lastgang" : null) }}
      sekundaer={{
        // mobil kurz (eine Zeile, zentriert wie der primäre CTA), ab sm der volle Wortlaut
        label: (
          <>
            <span className="sm:hidden">Videotermin mit Steuerberatung</span>
            <span className="max-sm:hidden">Videotermin – gern mit Ihrer Steuerberatung</span>
          </>
        ),
        href: "/termin?art=video&thema=gewerbe",
      }}
      hinweis="Den Rechenweg bekommen Sie mit Ihren Zahlen – Beispiel, kein Angebot; wir rechnen mit Ihrem Lastgang und Ihrer Netzrechnung."
      className="max-md:mt-8"
    />
  );
}
