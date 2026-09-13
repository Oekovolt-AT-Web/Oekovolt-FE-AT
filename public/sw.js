/* Ökovolt Service Worker – ausschließlich für Push-Benachrichtigungen (kein Offline-Cache). */

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));

self.addEventListener("push", (event) => {
  let daten = {};
  try {
    daten = event.data ? event.data.json() : {};
  } catch {
    daten = { titel: "Ökovolt", text: event.data ? event.data.text() : "" };
  }
  const titel = daten.titel || "Ökovolt";
  const optionen = {
    body: daten.text || "",
    icon: daten.icon || "/Logo_ov_4cDeutschland-removebg-preview.png",
    badge: "/Logo_ov_4cDeutschland-removebg-preview.png",
    image: daten.bild || undefined,
    tag: daten.tag || undefined,
    renotify: Boolean(daten.tag),
    lang: "de-DE",
    data: { url: daten.url || "/" },
  };
  event.waitUntil(self.registration.showNotification(titel, optionen));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const ziel = new URL(event.notification.data?.url || "/", self.location.origin);
  if (ziel.origin !== self.location.origin) return;
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((fenster) => {
      for (const f of fenster) {
        if (f.url === ziel.href && "focus" in f) return f.focus();
      }
      return self.clients.openWindow(ziel.href);
    })
  );
});

self.addEventListener("pushsubscriptionchange", (event) => {
  // Abo wurde vom Browser erneuert – beim Server austauschen
  event.waitUntil(
    (async () => {
      const alt = event.oldSubscription;
      const schluessel = alt?.options?.applicationServerKey;
      if (!schluessel) return;
      const neu = await self.registration.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: schluessel });
      await fetch("/api/push/erneuern", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ alt: alt?.endpoint, neu: neu.toJSON() }),
      });
    })()
  );
});
