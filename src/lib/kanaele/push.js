// src/lib/kanaele/push.js – Versand von Web-Push-Nachrichten (VAPID) an alle Abos eines Themas.
//
// Umgebungsvariablen: VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, VAPID_SUBJECT (z. B. mailto:office@oekovolt.at)
// Schlüssel einmalig erzeugen: npx web-push generate-vapid-keys

import webpush from "web-push";
import { kanal } from "./frappe";
import { BASE_URL } from "./veroeffentlichungen";

export const pushBereit = () => Boolean(process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY);

async function parallel(liste, anzahl, fn) {
  let i = 0;
  const arbeiter = Array.from({ length: Math.min(anzahl, liste.length) }, async () => {
    while (i < liste.length) {
      const eintrag = liste[i++];
      await fn(eintrag);
    }
  });
  await Promise.all(arbeiter);
}

/** Link nur auf die eigene Website zulassen. */
function zielLink(link) {
  if (!link) return "/";
  if (link.startsWith("/")) return link;
  try {
    const u = new URL(link);
    return u.origin === BASE_URL ? `${u.pathname}${u.search}${u.hash}` : "/";
  } catch {
    return "/";
  }
}

/**
 * n: { name, titel, text, link, bild, thema }
 * Rückgabe: { erfolgreich, fehlgeschlagen, entfernt }
 */
export async function sendePushNachricht(n) {
  if (!pushBereit()) throw new Error("push_nicht_konfiguriert");
  webpush.setVapidDetails(process.env.VAPID_SUBJECT || "mailto:office@oekovolt.at", process.env.VAPID_PUBLIC_KEY, process.env.VAPID_PRIVATE_KEY);

  const payload = JSON.stringify({
    titel: String(n.titel || "Ökovolt").slice(0, 80),
    text: String(n.text || "").slice(0, 180),
    url: zielLink(n.link),
    bild: n.bild ? (n.bild.startsWith("http") ? n.bild : `${BASE_URL}/api/image?path=${encodeURIComponent(n.bild)}`) : undefined,
    tag: n.name,
  });

  let erfolgreich = 0;
  let fehlgeschlagen = 0;
  const entfernt = [];
  const LIMIT = 500;

  for (let seite = 0; seite < 200; seite++) {
    const abos = await kanal("push_abos", { thema: n.thema || "", seite, limit: LIMIT });
    if (!Array.isArray(abos) || abos.length === 0) break;
    await parallel(abos, 25, async (a) => {
      try {
        await webpush.sendNotification({ endpoint: a.endpoint, keys: { p256dh: a.p256dh, auth: a.auth } }, payload, { TTL: 24 * 3600, urgency: "normal", timeout: 10000 });
        erfolgreich++;
      } catch (e) {
        fehlgeschlagen++;
        if (e?.statusCode === 404 || e?.statusCode === 410) entfernt.push(a.endpoint);
      }
    });
    if (abos.length < LIMIT) break;
  }

  if (entfernt.length) {
    try {
      await kanal("push_abos_entfernen", { endpoints: entfernt });
    } catch {
      /* beim nächsten Versand erneut */
    }
  }
  return { erfolgreich, fehlgeschlagen, entfernt: entfernt.length };
}
