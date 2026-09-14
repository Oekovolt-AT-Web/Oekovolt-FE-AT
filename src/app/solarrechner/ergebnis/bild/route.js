// Open-Graph-Bild für geteilte Solarrechner-Ergebnisse (1200 × 630, PNG).
// Die Werte werden hier aus den Eingaben neu berechnet – nie aus der URL übernommen.

import fs from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { berechne } from "@/lib/solarrechner";
import { alsBerechnung, eingabenAusParams } from "@/lib/rechnerTeilen";
import { AUSRICHTUNGEN } from "@/data/solarrechner";

export const runtime = "nodejs";

const ORDNER = path.join(process.cwd(), "src/lib/analyse");
let cache = null;
async function mittel() {
  if (!cache) {
    const [inter, interBold, manrope, logo] = await Promise.all([
      fs.readFile(path.join(ORDNER, "fonts/inter-latin-400-normal.woff")),
      fs.readFile(path.join(ORDNER, "fonts/inter-latin-600-normal.woff")),
      fs.readFile(path.join(ORDNER, "fonts/manrope-latin-800-normal.woff")),
      fs.readFile(path.join(ORDNER, "logo-hell.png")),
    ]);
    cache = { inter, interBold, manrope, logo: `data:image/png;base64,${logo.toString("base64")}` };
  }
  return cache;
}

const de = (n, d = 0) => n.toLocaleString("de-DE", { minimumFractionDigits: d, maximumFractionDigits: d });

export async function GET(request) {
  const e = eingabenAusParams(new URL(request.url).searchParams);
  const r = berechne(alsBerechnung(e));
  const m = await mittel();
  const richtung = AUSRICHTUNGEN.find((a) => a.id === e.ausrichtung)?.label || "";

  const kacheln = [
    { l: "Autarkie", w: `${Math.round(r.autarkie * 100)} %` },
    { l: "Amortisation", w: r.amortisationJahre != null ? `${de(r.amortisationJahre, 1)} Jahre` : "über 20 Jahre" },
    { l: "CO2-Einsparung pro Jahr", w: `${de(r.co2ProJahr / 1000, 1)} t` },
  ];

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", padding: "56px 64px", background: "linear-gradient(135deg, #03122b 0%, #0b2a4a 60%, #3f6b1f 140%)", color: "white", fontFamily: "Inter" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
          <img src={m.logo} height={52} style={{ height: 52 }} />
          <div style={{ display: "flex", fontSize: 22, color: "rgba(255,255,255,0.7)" }}>Solarrechner · Ersteinschätzung</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", marginTop: 48 }}>
          <div style={{ display: "flex", fontSize: 30, color: "#b5dc8a", fontWeight: 600 }}>
            {`${de(e.kwp, e.kwp % 1 ? 1 : 0)} kWp · ${richtung}${e.speicher ? ` · ${e.speicher} kWh Speicher` : ""} · ${de(e.verbrauch)} kWh Verbrauch`}
          </div>
          <div style={{ display: "flex", alignItems: "baseline", marginTop: 14, fontFamily: "Manrope" }}>
            <span style={{ fontSize: 112, lineHeight: 1, letterSpacing: -3 }}>{`${de(Math.round(r.nutzenProJahr))} €`}</span>
            <span style={{ fontSize: 34, marginLeft: 22, color: "rgba(255,255,255,0.8)", fontFamily: "Inter" }}>Vorteil im 1. Jahr</span>
          </div>
        </div>

        <div style={{ display: "flex", gap: 20, marginTop: 40 }}>
          {kacheln.map((k) => (
            <div key={k.l} style={{ display: "flex", flexDirection: "column", flex: 1, padding: "20px 26px", borderRadius: 24, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.18)" }}>
              <div style={{ display: "flex", fontSize: 22, color: "rgba(255,255,255,0.7)" }}>{k.l}</div>
              <div style={{ display: "flex", fontSize: 44, fontFamily: "Manrope", marginTop: 4 }}>{k.w}</div>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "auto" }}>
          <div style={{ display: "flex", fontSize: 26, fontWeight: 600 }}>Was bringt Ihr Dach? → oekovolt.de/solarrechner</div>
          <div style={{ display: "flex", fontSize: 18, color: "rgba(255,255,255,0.55)" }}>Orientierung, kein Angebot</div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: "Inter", data: m.inter, weight: 400, style: "normal" },
        { name: "Inter", data: m.interBold, weight: 600, style: "normal" },
        { name: "Manrope", data: m.manrope, weight: 800, style: "normal" },
      ],
      headers: { "Cache-Control": "public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400" },
    }
  );
}
