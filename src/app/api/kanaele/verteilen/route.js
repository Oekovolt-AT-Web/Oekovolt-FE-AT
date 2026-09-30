import crypto from "node:crypto";
import { revalidateTag } from "next/cache";
import { anFollowerVerteilen, apBereit } from "@/lib/kanaele/activitypub";
import { eintraegeFuer } from "@/lib/kanaele/apEintraege";
import { kanal, kanalKonfiguriert } from "@/lib/kanaele/frappe";
import { pushBereit, sendePushNachricht } from "@/lib/kanaele/push";
import { FEDIVERSE_KONTEN } from "@/lib/kanaele/fediverseKonten";
import { veroeffentlichungenMelden } from "@/lib/kanaele/veroeffentlichungen";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

const gleich = (a, b) => {
  const x = Buffer.from(String(a || ""));
  const y = Buffer.from(String(b || ""));
  return x.length === y.length && x.length > 0 && crypto.timingSafeEqual(x, y);
};

function berechtigt(request) {
  const bearer = (request.headers.get("authorization") || "").replace(/^Bearer\s+/i, "");
  return (process.env.CRON_SECRET && gleich(bearer, process.env.CRON_SECRET)) || (process.env.KANAL_WEBHOOK_SECRET && gleich(request.headers.get("x-kanal-secret"), process.env.KANAL_WEBHOOK_SECRET));
}

/**
 * Verteilt fällige Inhalte:
 *  1. Push-Nachrichten (DocType „Push Nachricht“, Status „Geplant“/„Jetzt senden“)
 *  2. Neue Beiträge an Fediverse-Follower (Veröffentlichungen mit Haken „Fediverse“, neue Ratgeber-Artikel)
 *  3. IndexNow: neue/geänderte Pressemeldungen (/presse/<slug> und /presse) an Bing & Co. melden
 *     (src/lib/kanaele/veroeffentlichungen.js → veroeffentlichungenMelden; ohne INDEXNOW_AKTIV=1 nur Trockenlauf)
 *
 * Aufruf: Frappe-Webhook (POST, Header X-Kanal-Secret) beim Veröffentlichen
 *         und/oder Cron (GET, Authorization: Bearer CRON_SECRET) als Sicherheitsnetz.
 */
async function verteilen() {
  const bericht = { push: [], fediverse: [] };
  if (!kanalKonfiguriert()) return { ...bericht, fehler: "backend_nicht_konfiguriert" };

  // 1. Push
  if (pushBereit()) {
    const faellig = await kanal("faellige_push").catch(() => []);
    for (const n of Array.isArray(faellig) ? faellig : []) {
      try {
        const ergebnis = await sendePushNachricht(n);
        await kanal("push_gesendet", { name: n.name, ...ergebnis });
        bericht.push.push({ name: n.name, ...ergebnis });
      } catch (e) {
        await kanal("push_gesendet", { name: n.name, erfolgreich: 0, fehlgeschlagen: 0, entfernt: 0, fehler: String(e.message).slice(0, 140) }).catch(() => {});
        bericht.push.push({ name: n.name, fehler: e.message });
      }
    }
  }

  // 2. Fediverse – nur Beiträge der letzten 14 Tage, jeder genau einmal
  if (apBereit()) {
    const grenze = Date.now() - 14 * 86400_000;
    for (const { name } of FEDIVERSE_KONTEN) {
      const eintraege = (await eintraegeFuer(name, { limit: 20, revalidate: false })).filter((e) => new Date(e.datum).getTime() >= grenze);
      if (!eintraege.length) continue;
      const ids = eintraege.map((e) => `${name}:${e.slug}`);
      const bekannt = new Set((await kanal("verteilt_pruefen", { kanal: "Fediverse", objekt_ids: ids }).catch(() => ids)) || []);
      for (const e of eintraege) {
        const id = `${name}:${e.slug}`;
        if (bekannt.has(id)) continue;
        // Zuerst als verteilt markieren (Schutz vor Doppelversand bei parallelen Aufrufen)
        const reserviert = await kanal("verteilt_reservieren", { kanal: "Fediverse", objekt_id: id }).catch(() => false);
        if (!reserviert) continue;
        const ergebnis = await anFollowerVerteilen(name, e).catch((err) => ({ fehler: err.message }));
        await kanal("verteilt_abschliessen", { kanal: "Fediverse", objekt_id: id, ...ergebnis }).catch(() => {});
        bericht.fediverse.push({ id, ...ergebnis });
      }
    }
  }
  return bericht;
}

/**
 * IndexNow für Pressemeldungen – fehlertolerant: Ein Fehler (Backend, IndexNow, Zeitlimit) landet nur im
 * Bericht und hält Push/Fediverse nie auf. Jede Änderung wird je Server-Instanz nur einmal gemeldet
 * (Webhook und Cron-Sicherheitsnetz teilen sich die Merkliste in veroeffentlichungenMelden).
 */
async function presseMelden() {
  try {
    return await veroeffentlichungenMelden();
  } catch (e) {
    return { fehler: String(e?.message || e).slice(0, 200) };
  }
}

export async function GET(request) {
  if (!berechtigt(request)) return new Response("Unauthorized", { status: 401 });
  const bericht = await verteilen();
  return Response.json({ ...bericht, indexnow: await presseMelden() });
}

export async function POST(request) {
  if (!berechtigt(request)) return new Response("Unauthorized", { status: 401 });
  // Geänderte Veröffentlichungen sofort auf Website, Feeds und Info-Bildschirmen sichtbar machen
  revalidateTag("veroeffentlichungen");
  const bericht = await verteilen();
  return Response.json({ ...bericht, indexnow: await presseMelden() });
}
