/**
 * Kurzvideos (Reels) von Ökovolt – SELBST GEHOSTET.
 * Verwendet von: Mediathek (/mediathek, /mediathek/[slug]) und dem Baustein src/components/Reels/ReelsAbschnitt.js
 * (Startseite „Presse & News“, /presse).
 *
 * Datenschutz: Die Videos liegen auf unserem eigenen Server (public/videos/reels/). Es wird nichts von Facebook
 * eingebettet oder automatisiert abgerufen – keine Verbindung zu Meta. FACEBOOK_SEITE dient nur einem normalen Link.
 *
 * NEUE VIDEOS EINPFLEGEN (Marketing):
 *   1. Reel als Seitenadmin in der Meta Business Suite herunterladen (Inhalte → Reel → „Herunterladen“).
 *   MUSIKRECHTE: Musik aus der Facebook-/Instagram-Musikbibliothek ist nur auf Meta-Plattformen lizenziert –
 *   solche Reels NICHT auf der Website verwenden (nur eigener Ton, Sprache oder lizenzfreie Musik mit Nachweis).
 *   2. Die Rohdatei (.mp4 oder .mov) im Ordner reels-roh/ im Projektstamm ablegen. Der Dateiname wird zum
 *      Adress-Kürzel (slug) und vorläufigen Titel, z. B. „agri-pv-montage-innviertel.mp4“.
 *      Optional daneben: gleichnamige Untertitel-Datei .vtt (z. B. agri-pv-montage-innviertel.vtt).
 *   3. `node scripts/reels-optimieren.mjs` ausführen (benötigt ffmpeg: `winget install Gyan.FFmpeg`).
 *      Das Skript erzeugt web-taugliche MP4 (max. 720×1280) + Vorschaubild (JPG) in public/videos/reels/,
 *      ermittelt die Dauer und trägt neue Videos unten zwischen den Markierungen ein. Bereits vorhandene
 *      Angaben (Titel, Beschreibung, Kategorie, Datum) bleiben erhalten.
 *   4. Titel, Beschreibung, Kategorie und Datum der neuen Einträge prüfen und ergänzen.
 *
 * Felder je Video:
 *   slug         Adress-Kürzel → /mediathek/<slug> (nur a–z, 0–9, Bindestrich; nach Veröffentlichung nicht ändern)
 *   titel        Kurzer Titel (max. ~70 Zeichen)
 *   beschreibung 1–3 Sätze – wichtig für die Google-Videosuche
 *   kategorie    eine aus REEL_KATEGORIEN („Baustelle“, „Projekte“, „Technik“, „Team“, „Events“)
 *   datum        Veröffentlichungsdatum JJJJ-MM-TT
 *   dauerSek     Länge in Sekunden (setzt das Skript)
 *   datei        "/videos/reels/<slug>.mp4"
 *   poster       "/videos/reels/<slug>.jpg"
 *   untertitel   optional "/videos/reels/<slug>.vtt"
 */
export const FACEBOOK_SEITE = "https://www.facebook.com/Oekovolt/";
export const FACEBOOK_REELS = `${FACEBOOK_SEITE}reels/`;

/** Reihenfolge der Filter-Chips in der Mediathek (angezeigt werden nur vorkommende). */
export const REEL_KATEGORIEN = ["Baustelle", "Projekte", "Technik", "Team", "Events"];

// REELS-START – dieser Block wird von scripts/reels-optimieren.mjs aktualisiert
export const REELS = [
  // { slug: "agri-pv-montage-innviertel", titel: "…", beschreibung: "…", kategorie: "Baustelle", datum: "2026-09-30", dauerSek: 42, datei: "/videos/reels/agri-pv-montage-innviertel.mp4", poster: "/videos/reels/agri-pv-montage-innviertel.jpg" },
];
// REELS-ENDE

const BASE_URL = "https://www.oekovolt.com";

/** Alle Videos, neueste zuerst. */
export function reelsSortiert() {
  return [...REELS].sort((a, b) => String(b.datum).localeCompare(String(a.datum)));
}

export function reelNachSlug(slug) {
  return REELS.find((r) => r.slug === slug) || null;
}

/** Kategorien, die tatsächlich vorkommen – in der Reihenfolge von REEL_KATEGORIEN, unbekannte hinten. */
export function vorhandeneKategorien(liste = REELS) {
  const da = new Set(liste.map((r) => r.kategorie).filter(Boolean));
  return [...REEL_KATEGORIEN.filter((k) => da.has(k)), ...[...da].filter((k) => !REEL_KATEGORIEN.includes(k))];
}

export function reelPfad(slug) {
  return `/mediathek/${slug}`;
}

/** 75 → "1:15" */
export function dauerText(sek) {
  const s = Math.max(0, Math.round(Number(sek) || 0));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

/** 75 → "PT1M15S" (ISO 8601, für VideoObject.duration) */
export function dauerIso(sek) {
  const s = Math.max(0, Math.round(Number(sek) || 0));
  const m = Math.floor(s / 60);
  return `PT${m ? `${m}M` : ""}${s % 60 || !m ? `${s % 60}S` : ""}`;
}

const DATUM = new Intl.DateTimeFormat("de-AT", { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Vienna" });
export function datumText(iso) {
  const d = new Date(`${iso}T12:00:00`);
  return Number.isNaN(d.getTime()) ? "" : DATUM.format(d);
}

/**
 * Einträge für src/app/sitemap.js: /mediathek (nur wenn Videos vorhanden – sonst noindex) und je Video
 * /mediathek/<slug> inkl. Video-Angaben.
 */
// Next.js schreibt Video-Titel/-Beschreibung unmaskiert ins XML – daher hier maskieren
const xml = (t) => String(t || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export function mediathekSitemap(basis = BASE_URL) {
  const liste = reelsSortiert();
  if (liste.length === 0) return [];
  return [
    { url: `${basis}/mediathek`, lastModified: new Date(liste[0].datum), changeFrequency: "weekly", priority: 0.6 },
    ...liste.map((r) => ({
      url: `${basis}${reelPfad(r.slug)}`,
      lastModified: new Date(r.datum),
      changeFrequency: "monthly",
      priority: 0.5,
      videos: [
        {
          title: xml(r.titel),
          thumbnail_loc: `${basis}${r.poster}`,
          description: xml(r.beschreibung || r.titel),
          content_loc: `${basis}${r.datei}`,
          duration: Math.round(r.dauerSek || 0) || undefined,
          publication_date: r.datum,
        },
      ],
    })),
  ];
}
