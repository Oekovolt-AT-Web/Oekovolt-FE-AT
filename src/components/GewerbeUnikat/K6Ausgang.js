"use client";

// src/components/GewerbeUnikat/K6Ausgang.js
//
// K6 · Kapitel-Ausgang (klein, ohne Bibliothek): genau ein primärer und ein sekundärer CTA.
//  - primär: „Netzebene und TOR-Typ mit Ihrem Netzbetreiber klären lassen“ → k6AnfrageUrl(): kWp aus dem
//    Lineal, Jahresverbrauch, Speicherwunsch (Speicher-WR aus K6 oder kWh aus K5), Anliegen „Netzanmeldung“
//    (thema=netzanmeldung – vom Konfigurator als Anliegen übernommen) sowie ne, tor, ac, spwr im Link.
//  - sekundär: „Parkregler & Leittechnik“ → /technik/parkregler (dort Fachplaner-Paket hinter dem Gate)
// Der Hinweis sagt nur, was der Konfigurator heute wirklich übernimmt (QA 12.10.: keine falschen Erwartungen).

import { KapitelAusgang } from "./_bausteine";
import { HAUPT_CTA } from "./_cta";
import { useSteckbrief } from "./_steckbrief";
import { k6AnfrageUrl, useK6Anfrage } from "./K6Anfrage";

export default function K6Ausgang() {
  const sb = useSteckbrief();
  const k6 = useK6Anfrage();
  const ne = k6?.ne ?? sb.ne ?? 6;
  const speicher = sb.speicherKwh > 0 || k6?.sp > 0;
  return (
    <KapitelAusgang
      primaer={{ label: HAUPT_CTA, href: k6AnfrageUrl(sb, k6) }}
      sekundaer={{ label: "Parkregler & Leittechnik", href: "/technik/parkregler" }}
      hinweis={`Die Anfrage übernimmt kWp, Jahresverbrauch${speicher ? ", den Speicherwunsch" : ""} und das Anliegen „Netzanmeldung“ – keine personenbezogenen Daten. Die Netzebene (hier NE ${ne}) bestätigen Sie im Formular unter „Verbrauch & Netz“. Fachplaner-Paket zum Parkregler: auf der Technik-Seite nach E-Mail-Bestätigung.`}
    />
  );
}
