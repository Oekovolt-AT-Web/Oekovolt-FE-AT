// scripts/indexnow.mjs
//
// Meldet alle URLs aus der Live-Sitemap per IndexNow an Bing, Yandex, Seznam,
// Naver und Yep (DuckDuckGo, Ecosia und Yahoo beziehen ihren Index von Bing).
// Google nimmt nicht an IndexNow teil – dort genügt die Sitemap in der
// Search Console.
//
// Aufruf NACH jedem Deployment mit neuen oder geänderten Seiten:
//   node scripts/indexnow.mjs
//   node scripts/indexnow.mjs https://www.oekovolt.com/gewerbe   (einzelne URLs)

const HOST = "www.oekovolt.com";
const KEY = "45250af1ed4ed419108eb76412d11547";
const SITEMAP = `https://${HOST}/sitemap.xml`;

async function urlsAusSitemap() {
  const res = await fetch(SITEMAP, { headers: { "User-Agent": "oekovolt.com IndexNow" } });
  if (!res.ok) throw new Error(`Sitemap nicht erreichbar: HTTP ${res.status}`);
  const xml = await res.text();
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
}

const argumente = process.argv.slice(2);
const urls = argumente.length ? argumente : await urlsAusSitemap();

// IndexNow erlaubt bis zu 10.000 URLs je Anfrage
for (let i = 0; i < urls.length; i += 10000) {
  const teil = urls.slice(i, i + 10000);
  const res = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `https://${HOST}/${KEY}.txt`, urlList: teil }),
  });
  console.log(`IndexNow: ${teil.length} URLs → HTTP ${res.status}`);
}
