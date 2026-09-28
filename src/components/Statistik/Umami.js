import Script from "next/script";

/**
 * Cookielose Besucherstatistik mit selbst gehostetem Umami (z. B. auf Hetzner).
 *
 * Umgebungsvariablen:
 *   UMAMI_SCRIPT_URL   z. B. https://statistik.oekovolt.com/script.js (eigene Instanz/Website-ID für Österreich)
 *   UMAMI_WEBSITE_ID   Website-ID aus dem Umami-Dashboard
 *
 * Datenschutz: keine Cookies, kein localStorage, keine IP-Speicherung (Umami bildet einen täglich
 * wechselnden, gesalzenen Hash), „Do Not Track“ wird respektiert. Die Filterfunktion unten entfernt
 * Einmal-Tokens (/scan/…) und alle URL-Parameter außer utm_* vor dem Senden.
 */
export default function Umami() {
  const src = process.env.UMAMI_SCRIPT_URL;
  const id = process.env.UMAMI_WEBSITE_ID;
  if (!src || !id) return null;

  return (
    <>
      {/* Normales Inline-Skript: wird beim Parsen ausgeführt, also vor dem Umami-Skript (afterInteractive). */}
      <script
        id="ov-umami-filter"
        dangerouslySetInnerHTML={{
          __html: `
        window.ovUmamiFilter = function (typ, daten) {
          try {
            var u = new URL(daten.url, location.origin);
            if (/^\\/(scan|tv|fortsetzen)(\\/|$)/.test(u.pathname)) return false;
            var behalten = new URLSearchParams();
            u.searchParams.forEach(function (w, k) { if (/^utm_(source|medium|campaign|term|content)$/.test(k)) behalten.set(k, w.slice(0, 100)); });
            var q = behalten.toString();
            daten.url = u.pathname + (q ? "?" + q : "");
            if (daten.referrer) { try { daten.referrer = new URL(daten.referrer).origin; } catch (e) { daten.referrer = ""; } }
          } catch (e) {}
          return daten;
        };
      `,
        }}
      />
      <Script
        src={src}
        data-website-id={id}
        data-do-not-track="true"
        data-before-send="ovUmamiFilter"
        data-exclude-hash="true"
        strategy="afterInteractive"
      />
    </>
  );
}
