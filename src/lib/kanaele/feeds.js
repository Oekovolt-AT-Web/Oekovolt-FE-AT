// src/lib/kanaele/feeds.js – RSS 2.0 (mit Media RSS) und JSON Feed 1.1

import { BASE_URL, klartextHtml } from "./veroeffentlichungen";

// XML-unzulässige Steuerzeichen entfernen (Tab, LF, CR bleiben)
const ohneSteuerzeichen = (s) =>
  [...String(s ?? "")].filter((z) => {
    const c = z.codePointAt(0);
    return c >= 32 || c === 9 || c === 10 || c === 13;
  }).join("");
const xml = (s) =>
  ohneSteuerzeichen(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const cdata = (s) => `<![CDATA[${ohneSteuerzeichen(s).replace(/]]>/g, "]]]]><![CDATA[>")}]]>`;
const rfc822 = (d) => new Date(d || Date.now()).toUTCString();

/**
 * Einträge: [{ titel, url, datum, aktualisiert, teaser, inhalt (HTML), kategorie, bildAbsolut, bildAlt, autor }]
 */
export function rss({ titel, beschreibung, pfad, eintraege, sprache = "de-DE", bild = `${BASE_URL}/Logo-Oekovolt-Gruen-mit-Weiss.webp` }) {
  const selbst = `${BASE_URL}${pfad}`;
  const letzte = eintraege.reduce((m, e) => Math.max(m, new Date(e.aktualisiert || e.datum || 0).getTime()), 0);
  const items = eintraege
    .map(
      (e) => `    <item>
      <title>${xml(e.titel)}</title>
      <link>${xml(e.url)}</link>
      <guid isPermaLink="true">${xml(e.url)}</guid>
      <pubDate>${rfc822(e.datum)}</pubDate>
      ${e.kategorie ? `<category>${xml(e.kategorie)}</category>` : ""}
      <dc:creator>${xml(e.autor || "Ökovolt Deutschland")}</dc:creator>
      <description>${cdata(e.teaser || klartextHtml(e.inhalt, 300))}</description>
      ${e.inhalt ? `<content:encoded>${cdata(e.inhalt)}</content:encoded>` : ""}
      ${e.bildAbsolut ? `<media:content url="${xml(e.bildAbsolut)}" medium="image"><media:description>${xml(e.bildAlt || e.titel)}</media:description></media:content>
      <enclosure url="${xml(e.bildAbsolut)}" type="image/jpeg" length="0" />` : ""}
    </item>`
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/rss.xsl"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>${xml(titel)}</title>
    <link>${BASE_URL}</link>
    <atom:link href="${xml(selbst)}" rel="self" type="application/rss+xml" />
    <description>${xml(beschreibung)}</description>
    <language>${sprache}</language>
    <copyright>© ${new Date().getFullYear()} ÖKOVOLT GmbH Solartechnik</copyright>
    <lastBuildDate>${rfc822(letzte || Date.now())}</lastBuildDate>
    <ttl>30</ttl>
    <image><url>${xml(bild)}</url><title>${xml(titel)}</title><link>${BASE_URL}</link></image>
${items}
  </channel>
</rss>`;
}

export function jsonFeed({ titel, beschreibung, pfad, homePfad = "/", eintraege, extra }) {
  return {
    version: "https://jsonfeed.org/version/1.1",
    title: titel,
    home_page_url: `${BASE_URL}${homePfad}`,
    feed_url: `${BASE_URL}${pfad}`,
    description: beschreibung,
    language: "de-DE",
    icon: `${BASE_URL}/Logo_ov_4cDeutschland-removebg-preview.png`,
    authors: [{ name: "Ökovolt Deutschland", url: BASE_URL }],
    items: eintraege.map((e) => ({
      id: e.url,
      url: e.url,
      title: e.titel,
      summary: e.teaser || klartextHtml(e.inhalt, 300),
      content_html: e.inhalt || undefined,
      image: e.bildAbsolut || undefined,
      date_published: e.datum ? new Date(e.datum).toISOString() : undefined,
      date_modified: e.aktualisiert ? new Date(e.aktualisiert).toISOString() : undefined,
      tags: [e.kategorie, ...(e.hashtags || [])].filter(Boolean),
      ...(extra ? { _oekovolt: extra(e) } : {}),
    })),
  };
}

export const FEED_HEADERS = {
  rss: { "Content-Type": "application/rss+xml; charset=utf-8", "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600", "Access-Control-Allow-Origin": "*" },
  json: { "Content-Type": "application/feed+json; charset=utf-8", "Cache-Control": "public, s-maxage=120, stale-while-revalidate=300", "Access-Control-Allow-Origin": "*" },
};
