// src/lib/seo/robots.js
//
// Seitenweise robots-Angaben nur für Sonderfälle (SEO-Plan M04).
//
// Hintergrund: Next.js ersetzt `robots` beim Zusammenführen der Metadaten
// KOMPLETT – ein seitenweises `robots: { index: true, follow: true }` löscht
// die Layout-Werte (`googleBot`: max-image-preview:large, max-snippet:-1 …).
// Indexierbare Seiten setzen `robots` deshalb gar nicht. Auch
// `robots: undefined` ist falsch: Der Schlüssel existiert dann und setzt den
// Wert auf null. Für bedingtes noindex daher den Helfer per Spread nutzen:
//
//   export const metadata = { title, ...nurNoindex(istIndexierbar) };

/** noindex, Links aber weiterverfolgen (Standard für leere/ungeprüfte Seiten). */
export const NOINDEX_FOLLOW = Object.freeze({ index: false, follow: true });

/** noindex, nofollow (interne bzw. abgeschaltete Seiten). */
export const NOINDEX_NOFOLLOW = Object.freeze({ index: false, follow: false });

/**
 * Liefert `{}`, wenn die Seite indexierbar ist (dann gelten die Layout-Werte),
 * sonst `{ robots }` mit der gewünschten Sperre. Immer per Spread einsetzen.
 *
 * @param {boolean} indexierbar
 * @param {{index:boolean, follow:boolean}} [sperre=NOINDEX_FOLLOW]
 */
export function nurNoindex(indexierbar, sperre = NOINDEX_FOLLOW) {
  return indexierbar ? {} : { robots: { ...sperre } };
}
