// src/components/Mannschaft/mannschaftFoto.js
//
// Serverseitige Fotoauswahl für den Abschnitt „Eigene Mannschaft“.
//
// Reihenfolge:
//   1. public/Images/AT/unternehmen/oekovolt-lkw.jpg      (echtes Foto, liefert der Auftraggeber)
//   2. public/Images/AT/unternehmen/oekovolt-traktor.jpg  (optional)
//   3. Fallback: eigenes Ökovolt-Foto public/Images/AT/home/hero-gewerbedach-luftbild.jpg
//      (Nachweis „Ökovolt (eigenes Material)“ in public/Images/AT/QUELLEN-home.md)
//
// Ablage durch den Auftraggeber: siehe Kommentar über MANNSCHAFT_FOTO in
// src/data/mannschaft.js. Hinweis: Statische Seiten prüfen die Datei beim Build –
// nach dem Ablegen des Fotos einmal neu bauen/deployen.
//
// Nur in Server-Komponenten verwenden (node:fs).

import fs from "node:fs";
import path from "node:path";
import { MANNSCHAFT_FOTO } from "@/data/mannschaft";

function vorhanden(src) {
  try {
    return fs.existsSync(path.join(process.cwd(), "public", ...src.split("/").filter(Boolean)));
  } catch {
    return false;
  }
}

/**
 * @returns {{ haupt: object, neben: object|null, eigenesFahrzeug: boolean }}
 *   haupt – Foto für das große Bildmodul
 *   neben – zweites Fahrzeugfoto (nur wenn Lkw UND Traktor vorliegen)
 *   eigenesFahrzeug – true, wenn ein echtes Fahrzeugfoto verwendet wird
 */
export function mannschaftFotos() {
  const lkw = vorhanden(MANNSCHAFT_FOTO.lkw.src);
  const traktor = vorhanden(MANNSCHAFT_FOTO.traktor.src);

  if (lkw) return { haupt: MANNSCHAFT_FOTO.lkw, neben: traktor ? MANNSCHAFT_FOTO.traktor : null, eigenesFahrzeug: true };
  if (traktor) return { haupt: MANNSCHAFT_FOTO.traktor, neben: null, eigenesFahrzeug: true };
  return { haupt: MANNSCHAFT_FOTO.fallback, neben: null, eigenesFahrzeug: false };
}
