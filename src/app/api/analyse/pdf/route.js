import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import QRCode from "qrcode";
import { renderToBuffer } from "@react-pdf/renderer";
import AnalysePdf from "@/lib/analyse/AnalysePdf";
import { analyse } from "@/lib/analyse/berechnung";
import { demoAktiv } from "@/lib/kanaele/demo";
import { alsKontaktanfrage, emailGueltig, frappeKonfiguriert, frappeKontakt, gedrosselt, sauber } from "@/lib/rueckrufApi";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const fehler = (code, status = 400) => Response.json({ fehler: code }, { status, headers: { "Cache-Control": "no-store" } });

/**
 * Erzeugt die persönliche PV-Analyse als PDF – in einem Schritt:
 * berechnen → PDF rendern → im Backoffice speichern (inkl. Mail an Kunde & Vertrieb) → Download.
 */
export async function POST(request) {
  if (gedrosselt("analyse:global", 60, 10 * 60 * 1000)) return fehler("zu_viele", 429);

  let e;
  try {
    e = await request.json();
  } catch {
    return fehler("ungueltig");
  }
  if (e.website || (Number(e.dauer) > 0 && Number(e.dauer) < 3000)) return fehler("ungueltig");
  if (e.einwilligung !== true) return fehler("einwilligung");

  const kontakt = {
    name: sauber(e.name, 120),
    email: sauber(e.email, 190).toLowerCase(),
    plz: sauber(e.plz, 10),
    telefon: sauber(e.telefon, 40),
  };
  if (kontakt.name.length < 2) return fehler("name");
  if (!emailGueltig(kontakt.email)) return fehler("email");
  if (kontakt.plz && !/^\d{4,5}$/.test(kontakt.plz)) return fehler("plz");
  if (gedrosselt(`analyse:${kontakt.email}`, 5, 24 * 3600 * 1000)) return fehler("zu_viele", 429);

  const daten = analyse(e.eingaben);
  const referenz = `PVA-${new Date().getFullYear()}-${crypto.randomBytes(3).toString("hex").toUpperCase()}`;
  const datum = new Intl.DateTimeFormat("de-DE", { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Berlin" }).format(new Date());
  const qrPng = await QRCode.toDataURL(`https://www.oekovolt.de/termin?utm_source=pdf-analyse&utm_medium=qr&ref=${referenz}`, { margin: 0, width: 300, color: { dark: "#03122b", light: "#ffffff" } });

  let pdf;
  try {
    pdf = await renderToBuffer(
      <AnalysePdf daten={daten} kontakt={kontakt} referenz={referenz} datum={datum} logoPfad={{ data: fs.readFileSync(path.join(process.cwd(), "src/lib/analyse/logo-hell.png")), format: "png" }} qrPng={qrPng} />
    );
  } catch (err) {
    console.error("PDF-Analyse: Rendern fehlgeschlagen", err?.message);
    return fehler("pdf", 500);
  }

  // Im Backoffice ablegen und Vertrieb informieren – Download klappt auch, wenn das Backoffice gerade nicht erreichbar ist.
  let gespeichert = false;
  // Lokale Demo (KANAL_DEMO=1, nie in Produktion): nichts ins echte Backoffice schreiben
  if (frappeKonfiguriert() && !demoAktiv()) {
    const r = daten.ergebnis;
    try {
      await frappeKontakt("pv_analyse", "create_analyse", {
        referenz,
        ...kontakt,
        kwp: daten.eingaben.kwp,
        ausrichtung: daten.eingaben.ausrichtung,
        neigung: daten.eingaben.neigung,
        verbrauch: daten.eingaben.verbrauch,
        speicher_kwh: daten.eingaben.speicherKwh,
        jahresertrag: Math.round(r.jahresertrag),
        autarkie: Math.round(r.autarkie * 100),
        investition: Math.round(r.investition),
        amortisation: r.amortisationJahre ? Math.round(r.amortisationJahre * 10) / 10 : 0,
        seite: sauber(e.seite, 300),
        pdf_base64: Buffer.from(pdf).toString("base64"),
      });
      gespeichert = true;
    } catch {
      try {
        await alsKontaktanfrage({
          name: kontakt.name,
          email: kontakt.email,
          telefon: kontakt.telefon,
          plzOrt: kontakt.plz,
          nachricht: [
            `PV-ANALYSE ${referenz} (PDF heruntergeladen)`,
            `${daten.eingaben.kwp} kWp, ${daten.labels.ausrichtung}, ${daten.labels.neigung}, Verbrauch ${daten.eingaben.verbrauch} kWh, Speicher ${daten.eingaben.speicherKwh} kWh`,
            `Ertrag ${Math.round(r.jahresertrag)} kWh · Autarkie ${Math.round(r.autarkie * 100)} % · Investition ${Math.round(r.investition)} € · Amortisation ${r.amortisationJahre ? r.amortisationJahre.toFixed(1) : "–"} Jahre`,
          ].join("\n"),
        });
        gespeichert = true;
      } catch {
        /* Download trotzdem ausliefern */
      }
    }
  }

  return new Response(pdf, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="Oekovolt-PV-Analyse-${referenz}.pdf"`,
      "Cache-Control": "no-store",
      "X-Robots-Tag": "noindex",
      "X-Analyse-Referenz": referenz,
      "X-Analyse-Gespeichert": gespeichert ? "1" : "0",
    },
  });
}
