// Erzeugt das RSA-Schlüsselpaar für die Fediverse-Konten (ActivityPub, HTTP Signatures)
// und die VAPID-Schlüssel für Web-Push – Ausgabe als .env-Zeilen.
//   node scripts/ap-schluessel.mjs
// Die Werte in die Hosting-Umgebung eintragen, NIE ins Repository committen.
// Achtung: Einmal gesetzte Schlüssel nicht mehr ändern – sonst verlieren Follower bzw. Push-Abos die Verbindung.
import crypto from "node:crypto";
import webpush from "web-push";

const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
  modulusLength: 2048,
  publicKeyEncoding: { type: "spki", format: "pem" },
  privateKeyEncoding: { type: "pkcs8", format: "pem" },
});
const einzeilig = (s) => JSON.stringify(s.trim()).slice(1, -1);
const vapid = webpush.generateVAPIDKeys();

console.log(`AP_PUBLIC_KEY="${einzeilig(publicKey)}"`);
console.log(`AP_PRIVATE_KEY="${einzeilig(privateKey)}"`);
console.log(`VAPID_PUBLIC_KEY=${vapid.publicKey}`);
console.log(`VAPID_PRIVATE_KEY=${vapid.privateKey}`);
console.log(`VAPID_SUBJECT=mailto:office@oekovolt.de`);
console.log(`KANAL_WEBHOOK_SECRET=${crypto.randomBytes(32).toString("hex")}`);
console.log(`CRON_SECRET=${crypto.randomBytes(32).toString("hex")}`);
