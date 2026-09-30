// Server-Bausteine der Schneelast-Seite /schneelast (die Landesseiten leiten seit M26 per 308 auf /schneelast#<land>).
// Alle Werte kommen fertig gerechnet aus src/lib/schneelast/* (Build-Zeit) – hier nur Darstellung.

import Link from "next/link";
import { Info, MapPin } from "lucide-react";
import { cn } from "@/components/ui/cn";
import { KLASSEN, klasseFuer, modulGrenzen, zahl } from "@/lib/schneelast/einordnung";

export const SCHNEELAST_QUELLEN = [
  { name: "GeoSphere Austria: SNOWGRID Klima v2.1, 1 km, täglich (CC BY 4.0)", url: "https://data.hub.geosphere.at/dataset/snowgrid_cl-v2-1d-1km" },
  { name: "HORA – Naturgefahrenplattform des BMLUK (Normwert Schneelast)", url: "https://hora.gv.at/" },
  { name: "Holzbau Austria: Neue Schneelastnorm veröffentlicht (2022)", url: "https://www.holzbauaustria.at/technik/2022/07/neue-schneelastnorm-veroeffentlicht.html" },
  { name: "ÖNORM B 1991-1-3:2022, ÖNORM EN 1991-1-3, ÖNORM EN 1990, IEC 61215-2:2021", url: "https://www.austrian-standards.at/" },
  { name: "Wikipedia: Liste der Bezirke in Österreich (abgerufen 30.09.2026)", url: "https://de.wikipedia.org/wiki/Liste_der_Bezirke_in_%C3%96sterreich" },
  { name: "OpenStreetMap Nominatim – Ortssuche und Koordinaten (ODbL)", url: "https://nominatim.org/" },
  { name: "Open Topo Data, EU-DEM 25 m (Copernicus) – Seehöhe", url: "https://www.opentopodata.org/datasets/eudem/" },
];

const farbe = (sk) => KLASSEN[klasseFuer(sk) ?? 0].farbe;

/** Modulklassen mit Grenzwerten (30° Satteldach und 10° flach geneigtes Hallendach, jeweils ohne Schneefang). */
export function ModulTabelle({ hell = false }) {
  const steil = modulGrenzen(30, false);
  const flach = modulGrenzen(10, false);
  const t = hell
    ? { box: "bg-white ring-ink-200/70", cap: "text-ink-900", head: "border-ink-200 text-ink-500", div: "divide-ink-100", th: "text-ink-900", td: "text-ink-600", wert: "text-ov-700", fuss: "text-ink-500" }
    : { box: "bg-white/[0.05] ring-white/10", cap: "text-white", head: "border-white/10 text-white/50", div: "divide-white/10", th: "text-white", td: "text-white/65", wert: "text-ov-300", fuss: "text-white/45" };
  return (
    <div className={cn("overflow-hidden rounded-3xl ring-1", t.box)}>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[520px] text-left text-[14px]">
          <caption className={cn("px-5 pt-5 text-left font-display text-[17px] font-bold", t.cap)}>Richtwert sₖ, bis zu dem ein Modul rechnerisch reicht</caption>
          <thead>
            <tr className={cn("border-b text-[12px] uppercase tracking-wider", t.head)}>
              <th scope="col" className="px-5 py-3 font-semibold">Modulklasse</th>
              <th scope="col" className="px-3 py-3 font-semibold">Prüf- / Bemessungslast</th>
              <th scope="col" className="px-3 py-3 font-semibold">Dach 30°</th>
              <th scope="col" className="px-5 py-3 font-semibold">Dach 10°</th>
            </tr>
          </thead>
          <tbody className={cn("divide-y", t.div)}>
            {steil.map((k, i) => (
              <tr key={k.id}>
                <th scope="row" className={cn("px-5 py-3.5 align-top font-semibold", t.th)}>{k.name}</th>
                <td className={cn("ov-num px-3 py-3.5 align-top", t.td)}>
                  {zahl(k.pruef)} / {zahl(k.bemessung)} Pa
                </td>
                <td className="px-3 py-3.5 align-top">
                  <span className={cn("ov-num font-display text-[16px] font-bold", t.wert)}>{zahl(k.knappBis, 1)}</span>
                  <span className={cn("block text-[12px]", t.td)}>mit Reserve {zahl(k.reserveBis, 1)}</span>
                </td>
                <td className="px-5 py-3.5 align-top">
                  <span className={cn("ov-num font-display text-[16px] font-bold", t.wert)}>{zahl(flach[i].knappBis, 1)}</span>
                  <span className={cn("block text-[12px]", t.td)}>mit Reserve {zahl(flach[i].reserveBis, 1)}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className={cn("px-5 pb-5 pt-2 text-[12.5px] leading-relaxed", t.fuss)}>
        Werte in kN/m², ohne Schneefang, μ₁ = 0,8, Cₑ = Cₜ = 1,0, γQ = 1,5; Bemessungslast = Prüflast / 1,5 (IEC 61215-2). „Mit Reserve“ = höchstens 80 % Auslastung. Rechnerische Orientierung, keine Statik.
      </p>
    </div>
  );
}

/** Quellenliste in einer hellen Box. */
export function QuellenBlock({ quellen, stand }) {
  return (
    <div className="rounded-3xl bg-sand-50 p-6 ring-1 ring-ink-200/70 md:p-8">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-ov-600 ring-1 ring-ink-200">
          <Info aria-hidden="true" className="h-5 w-5" />
        </span>
        <div>
          <h2 className="font-display text-[19px] font-bold text-ink-900">Quellen, Daten & Grenzen</h2>
          <p className="text-[12.5px] text-ink-500">Stand {stand ? stand.split("-").reverse().join(".") : "09/2026"} · Richtwert, kein Normwert, keine Statik</p>
        </div>
      </div>
      <ul className="mt-5 grid gap-x-8 gap-y-2 text-[13.5px] leading-relaxed text-ink-600 md:grid-cols-2">
        {quellen.map((q) => (
          <li key={q.name}>
            <a href={q.url} target="_blank" rel="noopener noreferrer" className="underline decoration-ink-300 underline-offset-2 hover:text-ink-900">
              {q.name}
            </a>
          </li>
        ))}
      </ul>
      <p className="mt-5 text-[12.5px] leading-relaxed text-ink-500">
        Schneelast-Richtwert: Datenbasis GeoSphere Austria, SNOWGRID-CL v2.1 (CC BY 4.0), eigene Auswertung (Winterhöchstwerte 1961/62–2025/26, GEV über L-Momente, 50-jährlich, 1-km-Raster, gerundet auf 0,1 kN/m²).
        Kein Normwert nach ÖNORM B 1991-1-3:2022 – der Normwert steht in eHORA (BMLUK); HORA wird von dieser Seite nicht abgefragt. Ortssuche: © OpenStreetMap-Mitwirkende (ODbL).
      </p>
    </div>
  );
}

/** Tabelle der Orte eines Bundeslands. */
export function LandTabelle({ zeilen, wien = false }) {
  return (
    <div className="overflow-hidden rounded-3xl bg-white ring-1 ring-ink-200/70">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-[14.5px]">
          <caption className="sr-only">Schneelast-Richtwerte {wien ? "der Wiener Gemeindebezirke" : "der Bezirkshauptorte"}</caption>
          <thead>
            <tr className="border-b border-ink-200 bg-sand-50 text-[12px] uppercase tracking-wider text-ink-500">
              <th scope="col" className="px-5 py-3 font-semibold">{wien ? "Bezirk" : "Ort"}</th>
              <th scope="col" className="px-3 py-3 font-semibold">Seehöhe</th>
              <th scope="col" className="px-3 py-3 font-semibold">Richtwert sₖ</th>
              <th scope="col" className="px-3 py-3 font-semibold">Dach 30°</th>
              <th scope="col" className="px-3 py-3 font-semibold">Modulklasse (30°)</th>
              <th scope="col" className="px-5 py-3 font-semibold">
                <span className="sr-only">Aktion</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-100">
            {zeilen.map((z) => (
              <tr key={z.ort} className="align-top">
                <th scope="row" className="px-5 py-3.5 font-semibold text-ink-900">
                  {z.region ? (
                    <Link href={`/photovoltaik/${z.region}`} className="underline decoration-ink-300 underline-offset-2 hover:text-ov-700 hover:decoration-ov-500">
                      {z.ort}
                    </Link>
                  ) : (
                    z.ort
                  )}
                  <span className="mt-0.5 block text-[12.5px] font-normal text-ink-500">
                    {wien ? z.bezirke.join(", ") : z.bezirke.length ? `Bezirk ${z.bezirke.join(", ")}` : "kein Bezirkshauptort"}
                  </span>
                </th>
                <td className="ov-num whitespace-nowrap px-3 py-3.5 text-ink-600">{zahl(z.hoehe)} m</td>
                <td className="whitespace-nowrap px-3 py-3.5">
                  {z.sk != null ? (
                    <span className="inline-flex items-center gap-2">
                      <span aria-hidden="true" className="h-3 w-3 rounded-sm ring-1 ring-ink-300/70" style={{ background: farbe(z.sk) }} />
                      <span className="ov-num font-display text-[16px] font-bold text-ink-900">{zahl(z.sk, 1)}</span>
                      <span className="text-[12.5px] text-ink-500">kN/m²</span>
                    </span>
                  ) : (
                    <span className="text-[13px] text-ink-500">{z.grund === "ueber2000" ? "über 2.000 m – kein Wert" : "kein Wert"}</span>
                  )}
                </td>
                <td className="ov-num whitespace-nowrap px-3 py-3.5 text-ink-600">{z.dachlast30 != null ? `${zahl(z.dachlast30, 2)} kN/m²` : "–"}</td>
                <td className="px-3 py-3.5">
                  {z.modul ? (
                    <span
                      className={cn(
                        "inline-block rounded-full px-2.5 py-0.5 text-[12.5px] font-semibold ring-1",
                        z.modul.stufe === "standard" ? "bg-ov-50 text-ov-800 ring-ov-200" : z.modul.stufe === "erhoeht" ? "bg-sun-300/25 text-ink-800 ring-sun-400/60" : "bg-red-50 text-red-800 ring-red-200"
                      )}
                    >
                      {z.modul.kurz}
                      {z.modul.knapp && z.modul.stufe !== "sonder" ? " (knapp)" : ""}
                    </span>
                  ) : (
                    "–"
                  )}
                </td>
                <td className="px-5 py-3.5 text-right">
                  <Link
                    href={`/schneelast?${new URLSearchParams({ lat: String(z.lat), lon: String(z.lon) })}#werkzeug`}
                    className="inline-flex min-h-9 items-center gap-1.5 whitespace-nowrap rounded-full px-3 text-[13px] font-semibold text-ov-700 ring-1 ring-ov-200 transition-colors hover:bg-ov-50"
                    aria-label={`${z.ort} in der Schneelast-Karte öffnen`}
                  >
                    <MapPin aria-hidden="true" className="h-3.5 w-3.5" /> Karte
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="border-t border-ink-100 px-5 py-4 text-[12.5px] leading-relaxed text-ink-500">
        Richtwert der 1-km-Rasterzelle am {wien ? "Bezirkspunkt laut OpenStreetMap" : "Ortspunkt laut OpenStreetMap"}; Seehöhe aus EU-DEM 25 m. „Dach 30°“ = Dachschneelast s = 0,8 · sₖ ohne Schneefang. „Modulklasse“ = kleinste Klasse, die
        rechnerisch mit Reserve (Auslastung höchstens 80 %) reicht, sonst die knapp ausreichende (Standardmodul 2400 Pa, Schneelastmodul 5400 Pa, Hochlastmodul 8100 Pa). Einzelne Grundstücke – vor allem am Hang – können deutlich abweichen.
      </p>
    </div>
  );
}
