// Social-Media-Bilder eines Referenzprojekts (PNG, next/og):
//   /referenzen/projekte/<slug>/bild/linkedin   1200 × 627
//   /referenzen/projekte/<slug>/bild/instagram  1080 × 1080
//   /referenzen/projekte/<slug>/bild/story      1080 × 1920
// Zahlen = Schätzung aus src/lib/kundenbuehne.js (Rechenweg dort). Nicht indexieren.
// Schriften aus src/lib/analyse/fonts, Logo = AT-Logo (public/logo-oekovolt-weiss.png, wie im Footer).

import fs from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { ladeKundenbuehne } from "@/lib/kundenbuehneServer";
import { CO2_G_PRO_KWH, ERTRAG_JE_KWP, fmtCa, fmtKwp } from "@/lib/kundenbuehne";

export const runtime = "nodejs";

const FORMATE = {
  linkedin: { w: 1200, h: 627 },
  instagram: { w: 1080, h: 1080 },
  story: { w: 1080, h: 1920 },
};

const ROOT = process.cwd();
let cache = null;
async function mittel() {
  if (!cache) {
    const fonts = path.join(ROOT, "src/lib/analyse/fonts");
    const [inter, interBold, manrope, logo] = await Promise.all([
      fs.readFile(path.join(fonts, "inter-latin-400-normal.woff")),
      fs.readFile(path.join(fonts, "inter-latin-600-normal.woff")),
      fs.readFile(path.join(fonts, "manrope-latin-800-normal.woff")),
      fs.readFile(path.join(ROOT, "public/logo-oekovolt-weiss.png")),
    ]);
    cache = { inter, interBold, manrope, logo: `data:image/png;base64,${logo.toString("base64")}` };
  }
  return cache;
}

/** Projektfoto als JPEG-Daten-URL in Zielgröße (Satori kennt kein WebP) – bei Fehlern null */
async function foto(src, w, h) {
  if (!src) return null;
  try {
    let daten;
    if (src.startsWith("/Images/")) {
      daten = await fs.readFile(path.join(ROOT, "public", decodeURI(src)));
    } else if (/^https:\/\//.test(src)) {
      const res = await fetch(src, { signal: AbortSignal.timeout(6000), next: { revalidate: 86400 } });
      if (!res.ok) return null;
      daten = Buffer.from(await res.arrayBuffer());
    } else return null;
    const sharp = (await import("sharp")).default;
    const jpg = await sharp(daten).resize(w, h, { fit: "cover", position: "attention" }).jpeg({ quality: 78 }).toBuffer();
    return `data:image/jpeg;base64,${jpg.toString("base64")}`;
  } catch {
    return null;
  }
}

const GRUEN = "#aed083";

/** „CO₂“ – die Schrift-Teilmenge kennt kein tiefgestelltes ₂, daher als kleine, abgesenkte 2 */
function Co2({ groesse }) {
  return (
    <span style={{ display: "flex", alignItems: "flex-end" }}>
      CO
      <span style={{ fontSize: Math.round(groesse * 0.62), marginBottom: -Math.round(groesse * 0.1) }}>2</span>
    </span>
  );
}

/** Einheit: Text oder „t CO₂“ */
function Einheit({ e, groesse }) {
  if (e !== "tCO2") return <span>{e}</span>;
  return (
    <span style={{ display: "flex", alignItems: "flex-end" }}>
      <span style={{ marginRight: Math.round(groesse * 0.25) }}>t</span>
      <Co2 groesse={groesse} />
    </span>
  );
}

export async function GET(request, { params }) {
  const { title, format } = await params;
  const f = FORMATE[format];
  if (!f) return new Response("Format unbekannt", { status: 404 });
  const d = await ladeKundenbuehne(title);
  if (!d) return new Response("Projekt nicht gefunden", { status: 404 });

  const { w, h } = f;
  const hoch = format === "story";
  const quadrat = format === "instagram";
  const zeilen = hoch || quadrat; // Kennzahlen als Zeilen statt nebeneinander
  const [m, bild] = await Promise.all([mittel(), foto(d.projekt.bild, w, h)]);
  const z = d.zahlen;
  const firma = d.firma;
  const nameGroesse = Math.round((firma.length > 42 ? 52 : firma.length > 26 ? 62 : 74) * (hoch ? 1.15 : quadrat ? 1.05 : 1));

  const kacheln = z?.kwp
    ? [
        { ca: false, w: fmtKwp(z.kwp), e: "kWp", l: "Leistung" },
        { ca: true, w: fmtCa(z.mwh), e: "MWh", l: "Solarstrom pro Jahr" },
        { ca: true, w: fmtCa(z.co2T), e: "tCO2", l: "weniger pro Jahr" },
      ]
    : [];

  const pad = hoch ? 84 : quadrat ? 72 : 64;
  const wertG = hoch ? 72 : quadrat ? 54 : 44;
  const einheitG = hoch ? 34 : quadrat ? 27 : 23;
  const labelG = hoch ? 28 : quadrat ? 22 : 19;
  const logoH = hoch ? 70 : 54;

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", color: "white", fontFamily: "Inter", background: "#03122b" }}>
        {bild && (
          // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
          <img src={bild} width={w} height={h} style={{ position: "absolute", top: 0, left: 0, width: w, height: h, objectFit: "cover" }} />
        )}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: w,
            height: h,
            display: "flex",
            background: bild
              ? zeilen
                ? "linear-gradient(180deg, rgba(3,18,43,0.62) 0%, rgba(3,18,43,0.3) 26%, rgba(3,18,43,0.86) 55%, rgba(3,18,43,0.98) 100%)"
                : "linear-gradient(90deg, rgba(3,18,43,0.97) 0%, rgba(3,18,43,0.9) 55%, rgba(3,18,43,0.45) 100%)"
              : "linear-gradient(135deg, #03122b 0%, #0b2a4a 60%, #3f6b1f 140%)",
          }}
        />
        <div style={{ position: "relative", display: "flex", flexDirection: "column", width: "100%", height: "100%", padding: `${pad}px ${pad}px ${pad - 8}px` }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
            <img src={m.logo} height={logoH} width={Math.round((logoH * 538) / 113)} />
            <div style={{ display: "flex", fontSize: hoch ? 26 : 21, color: "rgba(255,255,255,0.8)", padding: "10px 20px", borderRadius: 999, border: "1px solid rgba(255,255,255,0.25)", background: "rgba(3,18,43,0.4)" }}>
              Referenzprojekt
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", marginTop: "auto" }}>
            <div style={{ display: "flex", alignItems: "center", fontSize: hoch ? 30 : 24, fontWeight: 600, letterSpacing: 4, color: GRUEN }}>
              <div style={{ display: "flex", width: hoch ? 18 : 14, height: hoch ? 18 : 14, borderRadius: 99, background: "#ffc53d", marginRight: 16 }} />
              ERZEUGT SONNENSTROM
            </div>
            <div style={{ display: "flex", fontFamily: "Manrope", fontSize: nameGroesse, lineHeight: 1.06, letterSpacing: -1.5, marginTop: 18, maxWidth: zeilen ? w - 2 * pad : 900 }}>{firma}</div>
            {d.ort && <div style={{ display: "flex", fontSize: hoch ? 32 : 26, color: "rgba(255,255,255,0.72)", marginTop: 14 }}>{d.ort}</div>}
          </div>

          {kacheln.length > 0 && (
            <div style={{ display: "flex", flexDirection: zeilen ? "column" : "row", gap: zeilen ? (hoch ? 20 : 14) : 18, marginTop: hoch ? 56 : quadrat ? 40 : 34 }}>
              {kacheln.map((k) => (
                <div
                  key={k.l}
                  style={{
                    display: "flex",
                    flexDirection: zeilen ? "row" : "column",
                    alignItems: zeilen ? "center" : "flex-start",
                    justifyContent: zeilen ? "space-between" : "flex-start",
                    flex: zeilen ? "none" : 1,
                    padding: hoch ? "26px 36px" : quadrat ? "16px 28px" : "18px 24px",
                    borderRadius: 26,
                    background: "rgba(255,255,255,0.1)",
                    border: "1px solid rgba(255,255,255,0.2)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "flex-end" }}>
                    {k.ca && <span style={{ fontSize: einheitG, color: "rgba(255,255,255,0.75)", marginRight: 10, marginBottom: Math.round(wertG * 0.12) }}>ca.</span>}
                    <span style={{ fontFamily: "Manrope", fontSize: wertG, lineHeight: 1 }}>{k.w}</span>
                    <span style={{ display: "flex", fontSize: einheitG, marginLeft: 12, color: GRUEN, fontWeight: 600, marginBottom: Math.round(wertG * 0.08) }}>
                      <Einheit e={k.e} groesse={einheitG} />
                    </span>
                  </div>
                  <div style={{ display: "flex", fontSize: labelG, color: "rgba(255,255,255,0.75)", marginTop: zeilen ? 0 : 6 }}>{k.l}</div>
                </div>
              ))}
            </div>
          )}

          <div style={{ display: "flex", flexDirection: hoch ? "column" : "row", justifyContent: "space-between", alignItems: hoch ? "flex-start" : "flex-end", marginTop: hoch ? 56 : quadrat ? 34 : 26, gap: hoch ? 12 : 24 }}>
            <div style={{ display: "flex", fontSize: hoch ? 32 : 23, fontWeight: 600 }}>Solaranlage: Ökovolt · oekovolt.com</div>
            {kacheln.length > 0 && (
              <div style={{ display: "flex", alignItems: "flex-end", fontSize: hoch ? 22 : 15, color: "rgba(255,255,255,0.6)" }}>
                {`Schätzung: ${ERTRAG_JE_KWP.toLocaleString("de-DE")} kWh/kWp · ${CO2_G_PRO_KWH.toLocaleString("de-DE")} g `}
                <span style={{ display: "flex", marginLeft: 4, marginRight: 1 }}>
                  <Co2 groesse={hoch ? 22 : 15} />
                </span>
                /kWh
              </div>
            )}
          </div>
        </div>
      </div>
    ),
    {
      width: w,
      height: h,
      fonts: [
        { name: "Inter", data: m.inter, weight: 400, style: "normal" },
        { name: "Inter", data: m.interBold, weight: 600, style: "normal" },
        { name: "Manrope", data: m.manrope, weight: 800, style: "normal" },
      ],
      headers: {
        "Cache-Control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400",
        "X-Robots-Tag": "noindex",
        "Content-Disposition": `inline; filename="oekovolt-${d.projekt.slug}-${format}.png"`,
      },
    }
  );
}
