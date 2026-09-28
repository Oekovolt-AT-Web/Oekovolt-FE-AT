// src/lib/kanaele/activitypub.js
//
// Schlanke ActivityPub-Umsetzung für „nur veröffentlichende“ Konten der Website.
// Folgen von Mastodon, Threads, Friendica, Misskey, Pixelfed … möglich.
//
//   Handle:     @oekovolt@oekovolt.com  (WebFinger unter /.well-known/webfinger)
//   Actor:      https://www.oekovolt.com/api/ap/users/oekovolt
//   Inbox:      …/inbox (Follow, Undo, Delete) · Shared Inbox: /api/ap/inbox
//   Signaturen: HTTP Signatures (rsa-sha256, draft-cavage) eingehend geprüft, ausgehend signiert
//
// Umgebungsvariablen: AP_PRIVATE_KEY, AP_PUBLIC_KEY (PEM, erzeugen mit: node scripts/ap-schluessel.mjs)

import crypto from "node:crypto";
import { FEDIVERSE_KONTEN, HANDLE_DOMAIN } from "./fediverseKonten";
import { kanal } from "./frappe";
import { BASE_URL, klartextHtml } from "./veroeffentlichungen";

export const AP_TYPE = "application/activity+json";
export const AP_HEADERS = { "Content-Type": `${AP_TYPE}; charset=utf-8`, "Cache-Control": "public, max-age=300", "Access-Control-Allow-Origin": "*" };
const PUBLIC = "https://www.w3.org/ns/activitystreams#Public";
const pem = (s) => String(s || "").replace(/\\n/g, "\n");

export const apBereit = () => Boolean(process.env.AP_PRIVATE_KEY && process.env.AP_PUBLIC_KEY);

export const actorId = (name) => `${BASE_URL}/api/ap/users/${name}`;
export const kontoNach = (name) => FEDIVERSE_KONTEN.find((k) => k.name === name) || null;
export const noteId = (name, slug) => `${actorId(name)}/posts/${slug}`;

// ---------------------------------------------------------------- Actor

export function actor(name) {
  const k = kontoNach(name);
  if (!k) return null;
  const id = actorId(name);
  return {
    "@context": [
      "https://www.w3.org/ns/activitystreams",
      "https://w3id.org/security/v1",
      {
        toot: "http://joinmastodon.org/ns#",
        discoverable: "toot:discoverable",
        indexable: "toot:indexable",
        attributionDomains: { "@id": "toot:attributionDomains", "@type": "@id" },
        schema: "http://schema.org#",
        PropertyValue: "schema:PropertyValue",
        value: "schema:value",
        manuallyApprovesFollowers: "as:manuallyApprovesFollowers",
      },
    ],
    id,
    type: "Organization",
    preferredUsername: name,
    name: k.titel,
    summary: `<p>${k.text}</p><p>Ökovolt Solartechnik GmbH · Ostermiething · <a href="${BASE_URL}">oekovolt.com</a></p>`,
    url: `${BASE_URL}${k.profilPfad}`,
    inbox: `${id}/inbox`,
    outbox: `${id}/outbox`,
    followers: `${id}/followers`,
    following: `${id}/following`,
    endpoints: { sharedInbox: `${BASE_URL}/api/ap/inbox` },
    manuallyApprovesFollowers: false,
    discoverable: true,
    indexable: true,
    published: "2026-09-14T00:00:00Z",
    attributionDomains: [HANDLE_DOMAIN, `www.${HANDLE_DOMAIN}`],
    icon: { type: "Image", mediaType: "image/png", url: `${BASE_URL}/Logo_ov_4cDeutschland-removebg-preview.png` },
    image: { type: "Image", mediaType: "image/jpeg", url: `${BASE_URL}/og-image.jpg` },
    attachment: [
      { type: "PropertyValue", name: "Website", value: `<a href="${BASE_URL}" rel="me nofollow noopener" target="_blank">oekovolt.com</a>` },
      { type: "PropertyValue", name: "Telefon", value: "08245 96 788 0" },
      { type: "PropertyValue", name: "RSS", value: `<a href="${BASE_URL}${name === "ratgeber" ? "/ratgeber/rss.xml" : "/presse/rss.xml"}" rel="nofollow noopener" target="_blank">Feed</a>` },
    ],
    publicKey: { id: `${id}#main-key`, owner: id, publicKeyPem: pem(process.env.AP_PUBLIC_KEY) },
  };
}

// ---------------------------------------------------------------- Beiträge

const hashtagLink = (tag) => `${BASE_URL}/presse?tag=${encodeURIComponent(tag)}`;

/** Eintrag (Veröffentlichung oder Ratgeber) -> Note */
export function note(name, e) {
  const tags = [...new Set([...(e.hashtags || []), "Energiewende"])].slice(0, 6);
  const teaser = e.teaser || klartextHtml(e.inhalt, 400);
  const esc = (s) => String(s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const inhalt =
    `<p><strong>${esc(e.titel)}</strong></p>` +
    (teaser ? `<p>${esc(teaser)}</p>` : "") +
    `<p><a href="${e.url}" rel="nofollow noopener noreferrer" target="_blank">${e.url.replace(/^https:\/\//, "")}</a></p>` +
    `<p>${tags.map((t) => `<a href="${hashtagLink(t)}" class="mention hashtag" rel="tag">#<span>${esc(t)}</span></a>`).join(" ")}</p>`;
  return {
    id: noteId(name, e.slug),
    type: "Note",
    attributedTo: actorId(name),
    published: new Date(e.datum || Date.now()).toISOString(),
    ...(e.aktualisiert && e.aktualisiert !== e.datum ? { updated: new Date(e.aktualisiert).toISOString() } : {}),
    url: e.url,
    to: [PUBLIC],
    cc: [`${actorId(name)}/followers`],
    sensitive: false,
    content: inhalt,
    contentMap: { de: inhalt },
    tag: tags.map((t) => ({ type: "Hashtag", href: hashtagLink(t), name: `#${t}` })),
    attachment: e.bildAbsolut ? [{ type: "Image", mediaType: "image/jpeg", url: e.bildAbsolut, name: e.bildAlt || e.titel }] : [],
  };
}

export function create(name, e) {
  const n = note(name, e);
  return {
    "@context": "https://www.w3.org/ns/activitystreams",
    id: `${n.id}/activity`,
    type: "Create",
    actor: actorId(name),
    published: n.published,
    to: n.to,
    cc: n.cc,
    object: n,
  };
}

// ---------------------------------------------------------------- HTTP Signatures

const digest = (body) => `SHA-256=${crypto.createHash("sha256").update(body).digest("base64")}`;

function signaturHeader(name, method, url, headers) {
  const u = new URL(url);
  const liste = ["(request-target)", ...Object.keys(headers).map((h) => h.toLowerCase())];
  const zeilen = liste.map((h) => (h === "(request-target)" ? `(request-target): ${method.toLowerCase()} ${u.pathname}${u.search}` : `${h}: ${headers[Object.keys(headers).find((k) => k.toLowerCase() === h)]}`));
  const signatur = crypto.sign("sha256", Buffer.from(zeilen.join("\n")), pem(process.env.AP_PRIVATE_KEY)).toString("base64");
  return `keyId="${actorId(name)}#main-key",algorithm="rsa-sha256",headers="${liste.join(" ")}",signature="${signatur}"`;
}

/** Signierter POST an eine fremde Inbox. */
export async function signiertPosten(name, inbox, activity) {
  const body = JSON.stringify(activity);
  const u = new URL(inbox);
  const headers = { Host: u.host, Date: new Date().toUTCString(), Digest: digest(body), "Content-Type": AP_TYPE };
  const res = await fetch(inbox, {
    method: "POST",
    headers: { ...headers, Signature: signaturHeader(name, "POST", inbox, headers), Accept: AP_TYPE, "User-Agent": "oekovolt-website/1.0 (+https://www.oekovolt.com)" },
    body,
    signal: AbortSignal.timeout(15000),
    cache: "no-store",
  });
  return res.status;
}

/** Signierter GET (für Server mit „Authorized Fetch“). */
async function signiertHolen(url) {
  const u = new URL(url);
  const headers = { Host: u.host, Date: new Date().toUTCString(), Accept: AP_TYPE };
  const res = await fetch(url, {
    headers: { ...headers, Signature: signaturHeader("oekovolt", "GET", url, headers), "User-Agent": "oekovolt-website/1.0 (+https://www.oekovolt.com)" },
    signal: AbortSignal.timeout(10000),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`fetch ${res.status}`);
  return res.json();
}

const actorCache = new Map();
export async function fremderActor(url) {
  const treffer = actorCache.get(url);
  if (treffer && Date.now() - treffer.zeit < 3600_000) return treffer.daten;
  if (!/^https:\/\//.test(url)) throw new Error("url");
  const host = new URL(url).hostname;
  if (/^(localhost|127\.|10\.|192\.168\.|169\.254\.|\[?::1)/.test(host) || host.endsWith(".local") || host.endsWith(".internal")) throw new Error("url");
  const daten = await signiertHolen(url);
  actorCache.set(url, { zeit: Date.now(), daten });
  if (actorCache.size > 2000) actorCache.delete(actorCache.keys().next().value);
  return daten;
}

/** Prüft die HTTP-Signatur einer eingehenden Anfrage. Rückgabe: Actor-Dokument des Absenders oder null. */
export async function signaturPruefen(request, body) {
  const kopf = request.headers.get("signature");
  if (!kopf) return null;
  const teile = Object.fromEntries([...kopf.matchAll(/(\w+)="([^"]*)"/g)].map((m) => [m[1], m[2]]));
  if (!teile.keyId || !teile.signature) return null;
  const liste = (teile.headers || "date").split(" ");
  if (!liste.includes("(request-target)") || !liste.includes("date")) return null;

  const datum = Date.parse(request.headers.get("date") || "");
  if (!datum || Math.abs(Date.now() - datum) > 12 * 3600_000) return null;
  if (liste.includes("digest") && request.headers.get("digest") !== digest(body)) return null;
  if (!liste.includes("digest") && body) return null;

  const u = new URL(request.url);
  const zeilen = liste.map((h) => (h === "(request-target)" ? `(request-target): ${request.method.toLowerCase()} ${u.pathname}${u.search}` : `${h}: ${request.headers.get(h)}`));

  const actorUrl = teile.keyId.split("#")[0];
  let absender;
  try {
    absender = await fremderActor(actorUrl);
  } catch {
    return null;
  }
  const schluessel = absender?.publicKey?.id === teile.keyId || absender?.publicKey?.owner === absender?.id ? absender?.publicKey?.publicKeyPem : null;
  if (!schluessel) return null;
  const ok = crypto.verify("sha256", Buffer.from(zeilen.join("\n")), schluessel, Buffer.from(teile.signature, "base64"));
  return ok ? absender : null;
}

// ---------------------------------------------------------------- Inbox

/** Verarbeitet eine eingehende Aktivität. Rückgabe: HTTP-Status. */
export async function inboxVerarbeiten(request, zielKonto = null) {
  if (!apBereit()) return 503;
  const body = await request.text();
  if (body.length > 256_000) return 413;
  let activity;
  try {
    activity = JSON.parse(body);
  } catch {
    return 400;
  }

  // Löschungen fremder Konten kommen oft massenhaft und unsigniert prüfbar – nur Follower entfernen
  if (activity.type === "Delete" && typeof activity.actor === "string" && activity.object === activity.actor) {
    await kanal("ap_follower_loeschen", { actor_url: activity.actor }).catch(() => {});
    return 202;
  }

  const absender = await signaturPruefen(request, body);
  if (!absender || absender.id !== (activity.actor?.id || activity.actor)) return 401;

  if (activity.type === "Follow") {
    const ziel = typeof activity.object === "string" ? activity.object : activity.object?.id;
    const name = FEDIVERSE_KONTEN.find((k) => actorId(k.name) === ziel)?.name;
    if (!name || (zielKonto && zielKonto !== name)) return 404;
    await kanal("ap_follower_speichern", {
      konto: name,
      actor_url: absender.id,
      inbox: absender.inbox,
      shared_inbox: absender.endpoints?.sharedInbox || "",
      handle: absender.preferredUsername ? `@${absender.preferredUsername}@${new URL(absender.id).host}` : "",
      name: String(absender.name || "").slice(0, 140),
    });
    const accept = {
      "@context": "https://www.w3.org/ns/activitystreams",
      id: `${actorId(name)}#accepts/${crypto.randomUUID()}`,
      type: "Accept",
      actor: actorId(name),
      object: activity,
    };
    await signiertPosten(name, absender.inbox, accept).catch(() => {});
    return 202;
  }

  if (activity.type === "Undo" && activity.object?.type === "Follow") {
    const ziel = typeof activity.object.object === "string" ? activity.object.object : activity.object.object?.id;
    const name = FEDIVERSE_KONTEN.find((k) => actorId(k.name) === ziel)?.name;
    if (name) await kanal("ap_follower_loeschen", { konto: name, actor_url: absender.id }).catch(() => {});
    return 202;
  }

  // Likes, Boosts, Antworten usw. werden bewusst ignoriert (reines Veröffentlichungskonto)
  return 202;
}

// ---------------------------------------------------------------- Verteilung

/** Verteilt eine Create-Aktivität an alle Follower eines Kontos. */
export async function anFollowerVerteilen(name, eintrag) {
  const activity = create(name, eintrag);
  const follower = [];
  for (let seite = 0; seite < 100; seite++) {
    const teil = await kanal("ap_followers", { konto: name, seite, limit: 500 });
    if (!Array.isArray(teil) || !teil.length) break;
    follower.push(...teil);
    if (teil.length < 500) break;
  }
  const ziele = [...new Set(follower.map((f) => f.shared_inbox || f.inbox).filter(Boolean))];
  let erfolgreich = 0;
  let fehlgeschlagen = 0;
  let i = 0;
  await Promise.all(
    Array.from({ length: Math.min(10, ziele.length) }, async () => {
      while (i < ziele.length) {
        const ziel = ziele[i++];
        try {
          const status = await signiertPosten(name, ziel, activity);
          if (status >= 200 && status < 300) erfolgreich++;
          else fehlgeschlagen++;
        } catch {
          fehlgeschlagen++;
        }
      }
    })
  );
  return { empfaenger: ziele.length, erfolgreich, fehlgeschlagen };
}
