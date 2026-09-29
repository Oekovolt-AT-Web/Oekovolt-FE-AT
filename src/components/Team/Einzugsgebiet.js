// src/components/Team/Einzugsgebiet.js
//
// Server-Hülle für die interaktive Österreich-Karte (EinzugsKarte): bereitet
// Bundesländer, Netzbetreiber, Regionsseiten (mit Luftlinie ab Ostermiething)
// und die Position des Firmensitzes als reine Daten auf. Genutzt auf
// /uber-uns, /kontakt (modus "info") und /partner (modus "auswahl").

import EinzugsKarte from "./EinzugsKarte";
import { KARTE_PFADE, KARTE_QUELLE, KARTE_VIEWBOX, projiziere } from "@/components/Forderungen/Shared/kartePfade";
import { BUNDESLAENDER } from "@/data/bundeslaender";
import { regionenNachLand } from "@/lib/regionen";
import { FIRMA } from "@/lib/site";

export function einzugsDaten() {
  const orteNachLand = Object.fromEntries(regionenNachLand().map((g) => [g.land, g]));
  const laender = Object.keys(KARTE_PFADE).map((key) => {
    const b = BUNDESLAENDER[key] || {};
    const g = orteNachLand[key];
    return {
      key,
      name: b.name || key,
      d: KARTE_PFADE[key].d,
      cx: KARTE_PFADE[key].cx,
      cy: KARTE_PFADE[key].cy,
      netzbetreiber: (b.netzbetreiber || []).map((n) => n.name),
      foerderHref: g?.foerderHref || null,
      orte: (g?.orte || []).map((o) => {
        const [x, y] = projiziere(o.koord[1], o.koord[0]);
        return { slug: o.slug, name: o.kurzname || o.name, km: o.km, x: +x.toFixed(1), y: +y.toFixed(1), heimat: o.heimat };
      }),
    };
  });
  const [sx, sy] = projiziere(FIRMA.geo.lng, FIRMA.geo.lat);
  return { laender, sitz: { x: +sx.toFixed(1), y: +sy.toFixed(1), name: FIRMA.ort }, viewBox: KARTE_VIEWBOX, quelle: KARTE_QUELLE };
}

export default function Einzugsgebiet({ modus = "info", start = "oberoesterreich", dunkel = false, className }) {
  const daten = einzugsDaten();
  return <EinzugsKarte {...daten} modus={modus} start={start} dunkel={dunkel} className={className} />;
}
