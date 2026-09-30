// src/lib/bundesland/daten.js
//
// Datensatz einer Bundesland-Hubseite /photovoltaik-bundesland/[land] – NUR serverseitig
// (die Schneelast-Richtwerte werden zur Build-Zeit per fs aus data/schneelast/sk50-at.bin gelesen).
//
// Es werden ausschließlich vorhandene, belegte Daten des Repos zusammengeführt:
//  - Regionalseiten und PVGIS-Werte: src/data/regionen/*, src/data/regionen-pvgis.json (über src/lib/regionen.js)
//  - Schneelast-Richtwert: eigene Auswertung GeoSphere Austria SNOWGRID-CL v2.1 (CC BY 4.0),
//    src/lib/standort/schneelastRaster.js bzw. src/lib/schneelast/richtwerte.js – kein Normwert
//  - Landesförderung, Energiegemeinschaften: src/data/bundeslaender.js
//  - Baurecht, Energieberatung: src/data/regionen/laender.js
//  - Netzbetreiber: Regionalseiten (E-Control-Abfrage je PLZ) + src/data/netzbetreiber.js
//  - Referenzen: Projekte (Backoffice bzw. src/data/projekte.js) + Kundensitz aus src/data/kunden.js

import { alleRegionen, pvgisQuelle } from "@/lib/regionen";
import { BUNDESLAENDER, FOERDERARTEN, NACHBARN, STAND as FOERDER_STAND, landesPfad } from "@/data/bundeslaender";
import { LAENDER as LAENDER_RECHT } from "@/data/regionen/laender";
import { NETZBETREIBER, PFAD as NETZ_PFAD, betreiberPfad } from "@/data/netzbetreiber";
import { KUNDEN, KUNDEN_STAND } from "@/data/kunden";
import { REGIONEN } from "@/data/regionen";
import { rasterMeta, richtwertFuerPunkt, richtwerteFuerLand } from "@/lib/schneelast/richtwerte";
import { schneelastPfad } from "@/lib/schneelast/laender";
import { LAENDER, ertragStatistik, landFuerSlug, landPfad, netzbetreiberGruppen, referenzenFuerLand, skSpanne, winteranteil } from "./auswertung";

/** Ortsname (Name, Kurzname) der Regionalseiten → Landslug, für Projekte mit Ortsangabe. */
function ortZuLandKarte() {
  const karte = new Map();
  for (const r of Object.values(REGIONEN)) {
    for (const n of [r.name, r.kurzname].filter(Boolean)) karte.set(n.toLowerCase(), r.land);
  }
  return karte;
}

/**
 * Alle Daten einer Landesseite. projekte: normalisierte Projekte (ladeProjekte()).
 * Rückgabe null für unbekannte Slugs.
 */
export function bundeslandDaten(slug, projekte = []) {
  const land = landFuerSlug(slug);
  const foerder = BUNDESLAENDER[slug];
  if (!land || !foerder) return null;

  const orte = alleRegionen()
    .filter((r) => r.land === slug)
    .map((r) => {
      const sk = richtwertFuerPunkt(r.pvgis.lat, r.pvgis.lon, r.pvgis.hoehe_m);
      return {
        slug: r.slug,
        name: r.name,
        kurzname: r.kurzname || null,
        bezirk: r.bezirk,
        bild: r.bild || null,
        km: r.km,
        heimat: r.heimat,
        hauptstadt: LAENDER_RECHT[slug]?.hauptstadt === r.slug,
        pvgis: r.pvgis,
        winteranteil: winteranteil(r.pvgis),
        fakten: { netzbetreiber: r.fakten?.netzbetreiber || null },
        sk: sk.sk,
        skGrund: sk.grund,
        skNachbarzelle: sk.nachbarzelle,
      };
    });

  // Schneelast über alle Bezirkshauptorte des Landes (Tabelle der /schneelast-Seite)
  const bezirksorte = richtwerteFuerLand(slug);

  const referenzen = referenzenFuerLand(slug, projekte, KUNDEN, ortZuLandKarte());

  return {
    ...land,
    pfad: landPfad(slug),
    orte,
    ertrag: ertragStatistik(orte),
    pvgisQuelle: pvgisQuelle(),
    schneelast: {
      orte: skSpanne(orte),
      bezirksorte: skSpanne(bezirksorte),
      anzahlBezirksorte: bezirksorte.length,
      pfad: schneelastPfad(slug),
      meta: rasterMeta(),
    },
    foerderung: {
      art: FOERDERARTEN[foerder.foerderart] || null,
      kurz: foerder.kurz,
      text: foerder.text,
      programme: foerder.programme || [],
      pfad: landesPfad(slug),
      stand: foerder.stand || FOERDER_STAND.iso,
      standLabel: FOERDER_STAND.label,
      bild: foerder.bild || null,
      beratung: foerder.beratung || [],
    },
    energiegemeinschaften: foerder.energiegemeinschaften || null,
    recht: {
      bauordnung: LAENDER_RECHT[slug]?.bauordnung || null,
      energieberatung: LAENDER_RECHT[slug]?.energieberatung || null,
    },
    netz: {
      gruppen: netzbetreiberGruppen(orte, NETZBETREIBER),
      landesweit: foerder.netzbetreiber || [],
      pfad: NETZ_PFAD,
      betreiberPfad,
    },
    referenzen: { liste: referenzen, stand: KUNDEN_STAND },
    nachbarn: (NACHBARN[slug] || []).map((s) => landFuerSlug(s)).filter(Boolean),
  };
}

/** Kurzübersicht aller Länder (für Querverweise und Tests). */
export function laenderListe() {
  const regionen = alleRegionen();
  return LAENDER.map((l) => ({ ...l, pfad: landPfad(l.slug), anzahlOrte: regionen.filter((r) => r.land === l.slug).length }));
}
