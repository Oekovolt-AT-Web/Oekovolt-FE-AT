// src/lib/indexnow.js
//
// IndexNow (https://www.indexnow.org/documentation): sofortige Benachrichtigung von Bing (und damit
// DuckDuckGo, Ecosia, Yahoo, Copilot/ChatGPT-Suche über den Bing-Index), Yandex, Seznam, Naver und Yep
// über neue, geänderte oder gelöschte URLs. Google nimmt nicht teil – dort genügt die Sitemap.
//
// Eine Quelle für das Skript scripts/indexnow.mjs (nach dem Deploy) und für den Server
// (Presse-Veröffentlichung, src/lib/kanaele/veroeffentlichungen.js). Deshalb bewusst OHNE
// Next-Aliase und ohne Abhängigkeiten – läuft in Node und im Next-Server gleichermaßen.
//
// Der Schlüssel liegt öffentlich unter /45250af1ed4ed419108eb76412d11547.txt (public/) –
// so verlangt es das Protokoll; er ist kein Geheimnis.
//
// Regeln (Maßnahme M10 des SEO-Plans):
//  - Vor jeder Meldung die Schlüsseldatei prüfen – 404 oder falscher Inhalt bricht ab.
//  - Nur Änderungen melden (Zustandsvergleich über lastmod, siehe aenderungen()).
//  - Statuscodes auswerten: 403/422/400 brechen ab, 429 und 5xx werden mit Wartezeit
//    wiederholt und brechen danach ab. Nicht gemeldete URLs gelten nicht als gemeldet.

export const INDEXNOW_KEY = "45250af1ed4ed419108eb76412d11547";
export const INDEXNOW_HOST = "www.oekovolt.com";
export const INDEXNOW_KEY_LOCATION = `https://${INDEXNOW_HOST}/${INDEXNOW_KEY}.txt`;
export const INDEXNOW_ENDPUNKT = "https://api.indexnow.org/indexnow";
/** Protokollgrenze je Anfrage */
export const MAX_URLS_JE_ANFRAGE = 10000;

/** Bedeutung der Antwortcodes laut Protokoll-Dokumentation */
export const STATUS_BEDEUTUNG = {
  200: "OK – URLs übermittelt",
  202: "Angenommen – der Suchdienst prüft den Schlüssel noch",
  400: "Ungültige Anfrage (Format)",
  403: "Schlüssel ungültig – Schlüsseldatei nicht gefunden oder Inhalt passt nicht zum Schlüssel",
  422: "URLs gehören nicht zum Host oder der Schlüssel passt nicht zum Protokoll",
  429: "Zu viele Anfragen (möglicher Spam-Verdacht) – später erneut versuchen",
};

export class IndexNowFehler extends Error {
  constructor(meldung, { status = null } = {}) {
    super(meldung);
    this.name = "IndexNowFehler";
    this.status = status;
  }
}

const schlafen = (ms) => new Promise((r) => setTimeout(r, ms));

async function mitZeitlimit(fetchFn, url, init, timeoutMs) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetchFn(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Prüft die öffentliche Schlüsseldatei. Wirft IndexNowFehler bei 404, anderem Status,
 * falschem Inhalt oder Netzfehler – dann darf nichts gemeldet werden.
 */
export async function pruefeSchluessel({ url = INDEXNOW_KEY_LOCATION, key = INDEXNOW_KEY, fetchFn = fetch, timeoutMs = 15000 } = {}) {
  let res;
  try {
    res = await mitZeitlimit(fetchFn, url, { headers: { "User-Agent": "oekovolt.com IndexNow" }, cache: "no-store", redirect: "follow" }, timeoutMs);
  } catch (e) {
    throw new IndexNowFehler(`Schlüsseldatei nicht abrufbar (${url}): ${e?.name === "AbortError" ? "Zeitüberschreitung" : e?.message || e}`);
  }
  if (res.status === 404) throw new IndexNowFehler(`Schlüsseldatei fehlt (HTTP 404): ${url} – Abbruch, nichts gemeldet.`, { status: 404 });
  if (!res.ok) throw new IndexNowFehler(`Schlüsseldatei liefert HTTP ${res.status}: ${url} – Abbruch, nichts gemeldet.`, { status: res.status });
  const inhalt = (await res.text()).trim();
  if (inhalt !== key) throw new IndexNowFehler(`Schlüsseldatei ${url} enthält nicht den Schlüssel – Abbruch, nichts gemeldet.`, { status: res.status });
  return { url, status: res.status };
}

/** Teilt URLs in solche des Hosts und fremde (fremde würde IndexNow mit 422 ablehnen). */
export function nachHost(urls, host = INDEXNOW_HOST) {
  const gueltig = [];
  const fremd = [];
  for (const u of new Set(urls)) {
    try {
      const x = new URL(u);
      (x.host === host && x.protocol === "https:" ? gueltig : fremd).push(x.href);
    } catch {
      fremd.push(u);
    }
  }
  return { gueltig, fremd };
}

/**
 * Vergleicht den aktuellen Stand (url -> lastmod) mit dem gespeicherten.
 * neu: bisher unbekannt · geaendert: lastmod anders · entfernt: nicht mehr in der Quelle.
 */
export function aenderungen(aktuell = {}, vorher = {}) {
  const neu = [];
  const geaendert = [];
  for (const [url, lastmod] of Object.entries(aktuell)) {
    if (!(url in vorher)) neu.push(url);
    else if ((vorher[url] || "") !== (lastmod || "")) geaendert.push(url);
  }
  const entfernt = Object.keys(vorher).filter((url) => !(url in aktuell));
  return { neu, geaendert, entfernt };
}

/** Wartezeit aus Retry-After (Sekunden oder HTTP-Datum), sonst Standard. */
function wartezeitMs(res, standardMs) {
  const wert = res?.headers?.get?.("retry-after");
  if (!wert) return standardMs;
  const sek = Number(wert);
  if (Number.isFinite(sek)) return Math.min(Math.max(sek, 1), 600) * 1000;
  const bis = Date.parse(wert);
  return Number.isFinite(bis) ? Math.min(Math.max(bis - Date.now(), 1000), 600_000) : standardMs;
}

/**
 * Meldet URLs an IndexNow (in Teilen zu höchstens 10.000).
 * Rückgabe: { gemeldet: [...], antworten: [{ anzahl, status, text }], trocken }
 * Wirft IndexNowFehler bei 400/403/422 sofort, bei 429/5xx nach maxVersuche –
 * err.gemeldet enthält dann die bis dahin erfolgreich gemeldeten URLs.
 */
export async function melde(
  urls,
  {
    host = INDEXNOW_HOST,
    key = INDEXNOW_KEY,
    keyLocation = INDEXNOW_KEY_LOCATION,
    endpunkt = INDEXNOW_ENDPUNKT,
    fetchFn = fetch,
    trocken = false,
    maxVersuche = 3,
    wartezeitStandardMs = 60_000,
    warte = schlafen,
    log = () => {},
    timeoutMs = 30_000,
  } = {},
) {
  const { gueltig, fremd } = nachHost(urls, host);
  if (fremd.length) log(`Übersprungen (nicht ${host}): ${fremd.length} URL(s)`);
  const gemeldet = [];
  const antworten = [];
  if (trocken) return { gemeldet: [], vorgesehen: gueltig, antworten, trocken: true };

  for (let i = 0; i < gueltig.length; i += MAX_URLS_JE_ANFRAGE) {
    const teil = gueltig.slice(i, i + MAX_URLS_JE_ANFRAGE);
    for (let versuch = 1; ; versuch++) {
      let res;
      try {
        res = await mitZeitlimit(
          fetchFn,
          endpunkt,
          {
            method: "POST",
            headers: { "Content-Type": "application/json; charset=utf-8", "User-Agent": "oekovolt.com IndexNow" },
            body: JSON.stringify({ host, key, keyLocation, urlList: teil }),
          },
          timeoutMs,
        );
      } catch (e) {
        if (versuch < maxVersuche) {
          log(`Netzfehler (${e?.message || e}) – neuer Versuch ${versuch + 1}/${maxVersuche}`);
          await warte(wartezeitStandardMs);
          continue;
        }
        throw Object.assign(new IndexNowFehler(`IndexNow nicht erreichbar: ${e?.message || e}`), { gemeldet });
      }
      const text = STATUS_BEDEUTUNG[res.status] || "";
      if (res.status === 200 || res.status === 202) {
        antworten.push({ anzahl: teil.length, status: res.status, text });
        gemeldet.push(...teil);
        log(`IndexNow: ${teil.length} URL(s) → HTTP ${res.status} (${text})`);
        break;
      }
      const wiederholbar = res.status === 429 || res.status >= 500;
      if (wiederholbar && versuch < maxVersuche) {
        const ms = wartezeitMs(res, wartezeitStandardMs * versuch);
        log(`IndexNow: HTTP ${res.status}${text ? ` (${text})` : ""} – warte ${Math.round(ms / 1000)} s, Versuch ${versuch + 1}/${maxVersuche}`);
        await warte(ms);
        continue;
      }
      antworten.push({ anzahl: teil.length, status: res.status, text });
      const hinweis =
        res.status === 403
          ? `Schlüsseldatei ${keyLocation} prüfen (muss exakt den Schlüssel enthalten).`
          : res.status === 422
            ? `Nur URLs von https://${host}/ melden; Schlüssel und keyLocation müssen zusammenpassen.`
            : res.status === 429
              ? "Später erneut ausführen – nicht gemeldete URLs bleiben offen und werden beim nächsten Lauf wieder erkannt."
              : "";
      throw Object.assign(new IndexNowFehler(`IndexNow: HTTP ${res.status}${text ? ` – ${text}` : ""}. ${hinweis} Abbruch.`.trim(), { status: res.status }), { gemeldet, antworten });
    }
  }
  return { gemeldet, antworten, trocken: false };
}

/** Schlüssel prüfen und melden – der übliche Ablauf in einem Aufruf. */
export async function pruefenUndMelden(urls, optionen = {}) {
  await pruefeSchluessel({ url: optionen.keyLocation, key: optionen.key, fetchFn: optionen.fetchFn });
  return melde(urls, optionen);
}
