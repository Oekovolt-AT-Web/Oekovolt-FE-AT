import { NextResponse } from "next/server";

import { EXP_HEADER, middlewareZuweisung } from "@/lib/experimente";

// WordPress-Artefakte, die es auf oekovolt.de nicht mehr gibt und auch nie
// wieder geben wird. 410 Gone (statt 404) signalisiert Google endgueltig
// "entfernt" -> die URLs fallen schneller aus dem Index bzw. aus dem
// Search-Console-Bericht als bei einem 404.
const GONE_PATTERNS = [
  /^\/wp-login\.php/,
  /^\/wp-admin(\/|$)/,
  /^\/wp-content\//,
  /^\/wp-includes\//,
  /^\/wp-json(\/|$)/,
  /^\/xmlrpc\.php/,
  /^\/wp-cron\.php/,
  /^\/wp-signup\.php/,
  /^\/wp-trackback\.php/,
  // Alte WordPress-Permalinks ohne Rewrite (z. B. /index.php/2019/…)
  /^\/index\.php(\/|$)/,
  /\/feed\/?$/,
];

export function middleware(request) {
  const { pathname } = request.nextUrl;

  for (const pattern of GONE_PATTERNS) {
    if (pattern.test(pathname)) {
      return new NextResponse("410 Gone", {
        status: 410,
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "X-Robots-Tag": "noindex",
          "Cache-Control": "public, max-age=86400",
        },
      });
    }
  }

  // A/B-Tests mit serverseitiger Variante (src/lib/experimente.js, ort: "server"): Die Variante
  // wird pro Aufruf ausgelost (kein Cookie) und als Request-Header an die Seite gereicht. Für Bots
  // und Menschen gleich – keine User-Agent-Weiche. Nur Pfade, die unten im Matcher stehen.
  const exp = middlewareZuweisung(pathname);
  if (exp) {
    const kopf = new Headers(request.headers);
    kopf.set(EXP_HEADER, exp);
    const antwort = NextResponse.next({ request: { headers: kopf } });
    antwort.headers.set(EXP_HEADER, exp);
    antwort.headers.set("Cache-Control", "private, no-store");
    return antwort;
  }

  return NextResponse.next();
}

// Middleware laeuft nur fuer diese Pfade, nicht bei jedem Request.
export const config = {
  matcher: [
    "/wp-login.php",
    "/wp-cron.php",
    "/wp-signup.php",
    "/wp-trackback.php",
    "/xmlrpc.php",
    "/index.php",
    "/index.php/:path*",
    "/wp-admin/:path*",
    "/wp-content/:path*",
    "/wp-includes/:path*",
    "/wp-json/:path*",
    "/feed",
    "/:path*/feed",
    // A/B-Tests mit ort: "server" – Pfade hier als statische Literale ergänzen (Next.js wertet den
    // Matcher beim Build aus) und nach Testende wieder entfernen. Derzeit keiner (K1 läuft im Browser).
  ],
};
