// src/components/Ratgeber/bildnachweise.js
//
// Liest die Bildquellen-Dateien (public/Images/AT/QUELLEN-*.md und
// public/Images/Ratgeber/QUELLEN.md) beim Rendern auf dem Server und baut daraus
// ein Verzeichnis Dateiname -> { urheber, lizenz, quelle, plattform }.
// Damit erscheint unter jedem Ratgeber-Titelbild automatisch die Namensnennung,
// die CC-BY-/CC-BY-SA-Lizenzen verlangen – ohne dass jemand sie doppelt pflegt.
//
// Nur serverseitig verwenden (node:fs).

import fs from "node:fs";
import path from "node:path";

const WURZEL = path.join(process.cwd(), "public", "Images");
const BILD = /([\w.-]+\.(?:jpe?g|png|webp|avif))/i;
const URL_RE = /https?:\/\/[^\s)|>,]+/g;

/** Alle Quellendateien als { name, text } (für /bildnachweis und das Verzeichnis). */
export function quellenDateien() {
  const dateien = [];
  const at = path.join(WURZEL, "AT");
  try {
    for (const f of fs.readdirSync(at).sort()) if (/^QUELLEN-.*\.md$/.test(f)) dateien.push(path.join(at, f));
  } catch {
    /* Ordner fehlt – dann nur die übrigen Nachweise */
  }
  const ratgeber = path.join(WURZEL, "Ratgeber", "QUELLEN.md");
  if (fs.existsSync(ratgeber)) dateien.push(ratgeber);
  return dateien.map((d) => ({ name: path.basename(d), text: fs.readFileSync(d, "utf8") }));
}

function lizenzAus(text) {
  const m =
    text.match(/CC0(?:\s*1\.0)?/i) ||
    text.match(/CC BY(?:-SA)?\s*\d\.\d/i) ||
    text.match(/Unsplash[- ]Lizen[sz]e?|Unsplash License/i) ||
    text.match(/Pexels[- ]Lizen[sz]e?|Pexels License/i) ||
    text.match(/Partnerfreigabe/i) ||
    text.match(/Bestand/i);
  if (!m) return null;
  const l = m[0];
  if (/^CC0/i.test(l)) return "CC0";
  if (/unsplash/i.test(l)) return "Unsplash-Lizenz";
  if (/pexels/i.test(l)) return "Pexels-Lizenz";
  if (/partner/i.test(l)) return "Partnerfreigabe";
  if (/bestand/i.test(l)) return null;
  return l.toUpperCase().replace(/\s+/, " ");
}

function plattformAus(url = "") {
  if (/wikimedia|wikipedia/.test(url)) return "Wikimedia Commons";
  if (/unsplash/.test(url)) return "Unsplash";
  if (/pexels/.test(url)) return "Pexels";
  if (/pixabay/.test(url)) return "Pixabay";
  return null;
}

export function pfadAus(text, datei, ordner) {
  const explizit = text.match(/(\/Images\/[\w./-]+\.(?:jpe?g|png|webp|avif))/i)?.[1];
  if (explizit) return explizit;
  const relativ = text.match(/(?:^|[\s(])([\w-]+\/[\w.-]+\.(?:jpe?g|png|webp|avif))/i)?.[1];
  if (relativ) return `/Images/AT/${relativ}`;
  return `${ordner}${datei}`;
}

function eintragAusListe(zeile, ordner) {
  const text = zeile.replace(/`/g, "");
  const datei = text.match(BILD)?.[1];
  if (!datei) return null;
  const urls = text.match(URL_RE) || [];
  const quelle = urls.find((u) => !/creativecommons\.org/.test(u)) || null;
  let urheber = text.match(/Urheber(?:in)?:\s*([^,]+)/i)?.[1]?.trim();
  if (!urheber) {
    // Format „datei – Urheber, Plattform, URL, Lizenz“
    const nachStrich = text.split(/\s[–-]\s/)[1] || "";
    const erster = nachStrich.split(",")[0]?.trim();
    if (erster && !/^„/.test(erster) && erster.length < 60) urheber = erster.replace(/\s*\(.*$/, "");
  }
  return { datei, pfad: pfadAus(text, datei, ordner), urheber: urheber || null, lizenz: lizenzAus(text), quelle, plattform: plattformAus(quelle || "") };
}

function eintraegeAusTabelle(reihen, ordner) {
  const zellen = (r) => r.trim().replace(/^\||\|$/g, "").split("|").map((c) => c.trim());
  const [kopf, , ...rest] = reihen;
  const k = zellen(kopf).map((c) => c.toLowerCase());
  const idx = (re) => k.findIndex((c) => re.test(c));
  const iDatei = idx(/datei/);
  const iUrheber = idx(/urheber/);
  const iLizenz = idx(/lizenz/);
  const iQuelle = idx(/original|quelle/);
  if (iDatei < 0) return [];
  return rest
    .map((r) => {
      const z = zellen(r);
      const datei = z[iDatei]?.replace(/`/g, "").match(BILD)?.[1];
      if (!datei) return null;
      const quelle = (iQuelle >= 0 ? z[iQuelle].match(URL_RE)?.[0] : null) || null;
      return {
        datei,
        pfad: pfadAus(z[iDatei].replace(/`/g, ""), datei, ordner),
        urheber: iUrheber >= 0 ? z[iUrheber] || null : null,
        lizenz: iLizenz >= 0 ? lizenzAus(z[iLizenz]) : lizenzAus(r),
        quelle,
        plattform: plattformAus(quelle || ""),
      };
    })
    .filter(Boolean);
}

/** Besseren Eintrag behalten: einer mit Lizenz und echtem Urheber schlägt Verweise wie „siehe …“. */
function merke(map, e) {
  if (e.urheber && /siehe|QUELLEN|\.md\b/i.test(e.urheber)) e.urheber = null;
  const alt = map.get(e.pfad);
  const guete = (x) => (x?.lizenz ? 2 : 0) + (x?.urheber ? 1 : 0);
  if (!alt || guete(e) > guete(alt)) map.set(e.pfad, e);
}

/** Ordner, in dem die Bilder einer Quellendatei liegen (wenn die Zeile keinen Pfad nennt). */
export function standardOrdner(name, text) {
  if (name === "QUELLEN.md") return "/Images/Ratgeber/";
  const m = text.match(/public\/Images\/(AT\/[\w-]+)\//);
  if (m) return `/Images/${m[1]}/`;
  return `/Images/AT/${name.replace(/^QUELLEN-|\.md$/g, "")}/`;
}

let CACHE = null;

/** Verzeichnis aller dokumentierten Bilder: Map<"/Images/…/datei.jpg", nachweis>. */
export function bildVerzeichnis() {
  if (CACHE && process.env.NODE_ENV === "production") return CACHE;
  const map = new Map();
  for (const { name, text } of quellenDateien()) {
    const ordner = standardOrdner(name, text);
    const zeilen = text.replace(/\r/g, "").split("\n");
    for (let i = 0; i < zeilen.length; i++) {
      const z = zeilen[i];
      if (z.trim().startsWith("|")) {
        const reihen = [];
        while (i < zeilen.length && zeilen[i].trim().startsWith("|")) reihen.push(zeilen[i++]);
        for (const e of eintraegeAusTabelle(reihen, ordner)) merke(map, e);
        continue;
      }
      if (/^\s*[-*]\s+/.test(z)) {
        let voll = z.replace(/^\s*[-*]\s+/, "");
        while (i + 1 < zeilen.length && /^\s{2,}\S/.test(zeilen[i + 1])) voll += " " + zeilen[++i].trim();
        const e = eintragAusListe(voll, ordner);
        if (e) merke(map, e);
      }
    }
  }
  CACHE = map;
  return map;
}

/**
 * Nachweis für ein Artikelbild. Reihenfolge: Feld `bildNachweis` im Artikel
 * (String oder { urheber, lizenz, quelle }) -> Eintrag in den QUELLEN-Dateien.
 * Liefert null, wenn nichts dokumentiert ist (eigene/Bestandsbilder).
 */
export function nachweisFuer(artikel) {
  if (!artikel) return null;
  const eigen = artikel.bildNachweis;
  if (typeof eigen === "string" && eigen.trim()) return { text: eigen.trim() };
  if (eigen && typeof eigen === "object") return { ...eigen, plattform: eigen.plattform || plattformAus(eigen.quelle || "") };
  if (!artikel.bild) return null;
  const e = bildVerzeichnis().get(artikel.bild);
  if (!e || !e.lizenz) return null;
  return { ...e, lizenzUrl: lizenzUrl(e.lizenz) };
}

/** Link auf den Lizenztext (nur Creative Commons). */
export function lizenzUrl(lizenz = "") {
  if (/^CC0/i.test(lizenz)) return "https://creativecommons.org/publicdomain/zero/1.0/";
  const m = lizenz.match(/CC BY(-SA)?\s*(\d\.\d)/i);
  if (!m) return null;
  return `https://creativecommons.org/licenses/${m[1] ? "by-sa" : "by"}/${m[2]}/`;
}
