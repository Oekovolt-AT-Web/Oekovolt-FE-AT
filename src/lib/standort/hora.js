// src/lib/standort/hora.js
//
// Direktlinks auf die Naturgefahrenplattform HORA / eHORA (hora.gv.at) des BMLUK.
//
// Warum nur Links und keine automatische Abfrage?
// HORA bietet keinen offiziellen, frei nutzbaren Abfragedienst (WMS/REST) für die
// Normwerte an. Die rechtlichen Hinweise der Plattform lauten wörtlich: „Das Downloaden von
// Daten dieser Webseite und der dahinterstehenden Webkartendienste und Datenbanken /
// Datenquellen ist mit Ausnahme der ausdrücklich zum Download angebotenen Inhalte
// ausnahmslos untersagt.“ (hora.gv.at → Impressum/Rechtliche Hinweise, abgerufen 09/2026).
// Wir fragen HORA deshalb NICHT serverseitig ab, sondern öffnen die Karte mit den
// Koordinaten des Standorts. Das Info-Fenster am Punkt zeigt dort s_k (50-jährlich), s_25,
// s_100 und die Seehöhe; die Normen-Standortabfrage als PDF bietet HORA selbst zum
// Download an.
//
// URL-Schema der HORA-Anwendung (aus der öffentlichen Web-App abgeleitet):
//   https://hora.gv.at/#/c<Karte>/b<Hintergrund>/a<Zusatzlayer>/@<lat>,<lon>,<zoom>z/x<lat>,<lon>,<zoom>z
//   c… = Themenkarte, b… = Hintergrundkarte (grau|farbe|dop), a- = keine Zusatzlayer,
//   @… = Kartenmitte, x… = Punkt, an dem das Info-Fenster geöffnet wird.

export const HORA_BASIS = "https://hora.gv.at/";

const KARTEN = {
  schnee: { card: "schneelast", zoom: 16, titel: "Schneelast (ÖNORM B 1991-1-3:2022)" },
  wind: { card: "windvb0", zoom: 14, titel: "Basiswindgeschwindigkeit (ÖNORM B 1991-1-4)" },
  hagel: { card: "hagel:y30", zoom: 12, titel: "Hagelgefährdung" },
  erdbeben: { card: "beben2", zoom: 12, titel: "Erdbebengefährdung (ÖNORM B 1998-1)" },
};

const koord = (x) => Number(x).toFixed(5);

/** Link auf eine HORA-Themenkarte, zentriert auf den Standort, mit geöffnetem Info-Fenster. */
export function horaLink(thema, lat, lon) {
  const k = KARTEN[thema];
  if (!k) return HORA_BASIS;
  if (!Number.isFinite(Number(lat)) || !Number.isFinite(Number(lon))) return `${HORA_BASIS}#/c${k.card}`;
  const p = `${koord(lat)},${koord(lon)},${k.zoom}z`;
  return `${HORA_BASIS}#/c${k.card}/bgrau/a-/@${p}/x${p}`;
}

/** Alle relevanten HORA-Links für einen Standort. */
export function horaLinks(lat, lon) {
  return Object.fromEntries(Object.entries(KARTEN).map(([id, k]) => [id, { titel: k.titel, href: horaLink(id, lat, lon) }]));
}
