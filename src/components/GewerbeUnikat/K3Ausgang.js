"use client";

// src/components/GewerbeUnikat/K3Ausgang.js
//
// Ausgang von Kapitel 03 mit den Werten aus dem Projektsteckbrief: Anfrage-Link enthält die gewählte
// Anlagengröße (sonst die Empfehlung aus dem Lastgang), der Rechner-Link Fläche, Verbrauch, Dachart, Ort.
// Bei E-Flotte zusätzlich die Wege zu E-Flotten-Rechner und Ladeinfrastruktur. Ohne Bibliothek.

import Link from "next/link";
import { KapitelAusgang } from "./_bausteine";
import { HAUPT_CTA, mitThema } from "./_cta";
import { zahl } from "./_tokens";
import { anfrageUrl, rechnerUrl, useSteckbrief } from "./_steckbrief";
import { useGewerbeDaten } from "./_daten";

const LINK = "font-semibold text-ov-300 underline decoration-ov-300/40 underline-offset-4 hover:decoration-ov-300";

export default function K3Ausgang({ startKwp }) {
  const sb = useSteckbrief();
  const empf = useGewerbeDaten((d) => d.pv?.empfehlung?.kwp);
  const kwp = sb.kwp ?? empf ?? startKwp;
  const flotte = sb.flotte > 0;
  return (
    <KapitelAusgang
      dunkel
      className="max-md:mt-6"
      primaer={{ label: HAUPT_CTA, href: mitThema(anfrageUrl({ ...sb, kwp }), sb.quelle === "eigen" ? "lastgang" : null) }}
      sekundaer={{ label: "Im Gewerbe-PV-Rechner weiterrechnen", href: rechnerUrl(sb) }}
      hinweis={
        <>
          Die Anfrage übernimmt <span className="ov-num">{zahl(kwp)}</span> kWp – die endgültige Größe legen wir mit Ihrem Lastgang aus.
          {flotte && (
            <span data-testid="k3-flotte-links">
              {" "}
              Für die Flotte:{" "}
              <Link href="/rechner/e-flotte" className={LINK}>
                E-Flotte durchrechnen
              </Link>
              .
            </span>
          )}
        </>
      }
    />
  );
}
