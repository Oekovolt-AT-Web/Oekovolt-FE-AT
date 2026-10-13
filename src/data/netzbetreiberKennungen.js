// src/data/netzbetreiberKennungen.js
//
// Netzbetreibernummern in der österreichischen Zählpunktbezeichnung.
// Aufbau laut TOR Stromzähler (E-Control), Kapitel 4.1: „AT“ + 6-stellige
// Netzbetreibernummer (Stellen 3–8, mit führenden Nullen) + 5-stellige
// Postleitzahl (Stellen 9–13) + 20-stellige Zählpunktnummer (Stellen 14–33,
// nur Großbuchstaben A–Z und Ziffern 0–9). 33 Stellen in Summe.
//
// Nur belegte Kennungen: `beleg` sagt, ob die Zuordnung an einer Primärquelle
// des Netzbetreibers (primaer) oder nur an übereinstimmenden Marktpartner-Listen
// Dritter (sekundaer) hängt. Sekundäre Zuordnungen werden auf der Seite als
// „bitte beim Netzbetreiber prüfen“ ausgewiesen. Ein zentrales öffentliches
// Verzeichnis (ebUtilities-Marktpartnerverzeichnis) ist nur nach Anmeldung lesbar
// – siehe Notiz C06, Abschnitt Offen.
//
// Die Funktionen hier sind rein (keine Seiteneffekte, kein Logging), damit der
// Prüfer im Browser nichts überträgt und Tests ohne DOM laufen.

export const KENNUNGEN_STAND = { iso: "2026-10-11", label: "11.10.2026" };

export const DRITTLISTEN = [
  { titel: "EG Austria – Netzbetreiber-Liste mit AT-Nummern (Stand 08.12.2024)", url: "https://docs.eg-austria.at/netzbetreiberinfo/netzbetreiber" },
  { titel: "LokalKraft – Netzbetreiber in Österreich (ohne Gewähr)", url: "https://lokalkraft.at/netzbetreiber" },
];

/**
 * Kennung = Stellen 3–8 der Zählpunktbezeichnung (ohne „AT“).
 * slug verweist auf /netzanmeldung/[betreiber], null = keine eigene Seite.
 */
export const KENNUNGEN = [
  { kennung: "001000", slug: "wiener-netze", name: "Wiener Netze GmbH", kurz: "Wiener Netze", bundesland: "Wien", beleg: "sekundaer", quellen: DRITTLISTEN },
  { kennung: "002000", slug: "netz-niederoesterreich", name: "Netz Niederösterreich GmbH", kurz: "Netz NÖ", bundesland: "Niederösterreich", beleg: "sekundaer", quellen: DRITTLISTEN },
  { kennung: "003000", slug: "netz-oberoesterreich", name: "Netz Oberösterreich GmbH", kurz: "Netz OÖ", bundesland: "Oberösterreich", beleg: "sekundaer", quellen: DRITTLISTEN },
  { kennung: "003100", slug: "linz-netz", name: "LINZ NETZ GmbH", kurz: "LINZ NETZ", bundesland: "Oberösterreich", beleg: "sekundaer", quellen: DRITTLISTEN },
  { kennung: "004000", slug: "salzburg-netz", name: "Salzburg Netz GmbH", kurz: "Salzburg Netz", bundesland: "Salzburg", beleg: "sekundaer", quellen: DRITTLISTEN },
  {
    kennung: "005000",
    slug: "tinetz",
    name: "TINETZ-Tiroler Netze GmbH",
    kurz: "TINETZ",
    bundesland: "Tirol",
    beleg: "primaer",
    quellen: [{ titel: "TINETZ – Neue PV-Anlage („33-stellig und beginnt mit AT005…“)", url: "https://www.tinetz.at/unsere-leistungen/photovoltaik/neue-pv-anlage/" }, ...DRITTLISTEN],
  },
  { kennung: "005100", slug: null, name: "Innsbrucker Kommunalbetriebe AG", kurz: "IKB", bundesland: "Tirol", beleg: "sekundaer", quellen: DRITTLISTEN },
  {
    kennung: "006000",
    slug: "vorarlberg-netz",
    name: "Vorarlberger Energienetze GmbH",
    kurz: "vorarlberg netz",
    bundesland: "Vorarlberg",
    beleg: "primaer",
    quellen: [{ titel: "vorarlberg netz – Kontaktdatenblatt (Netzbetreiber Strom AT006000, Stand Januar 2021)", url: "https://www.vorarlbergnetz.at/media/Kontaktdatenblatt_vne.pdf" }, ...DRITTLISTEN],
  },
  { kennung: "007000", slug: "kng-kaernten-netz", name: "KNG-Kärnten Netz GmbH", kurz: "Kärnten Netz", bundesland: "Kärnten", beleg: "sekundaer", quellen: DRITTLISTEN },
  { kennung: "007100", slug: null, name: "Energie Klagenfurt GmbH", kurz: "Energie Klagenfurt", bundesland: "Kärnten", beleg: "sekundaer", quellen: DRITTLISTEN },
  { kennung: "008000", slug: "energienetze-steiermark", name: "Energienetze Steiermark GmbH", kurz: "Energienetze Steiermark", bundesland: "Steiermark", beleg: "sekundaer", quellen: DRITTLISTEN },
  { kennung: "008100", slug: null, name: "Stromnetz Graz GmbH & Co KG", kurz: "Stromnetz Graz", bundesland: "Steiermark", beleg: "sekundaer", quellen: DRITTLISTEN },
  { kennung: "009000", slug: "netz-burgenland", name: "Netz Burgenland GmbH", kurz: "Netz Burgenland", bundesland: "Burgenland", beleg: "sekundaer", quellen: DRITTLISTEN },
];

export const KENNUNG_QUELLE_TOR = {
  titel: "E-Control – TOR Stromzähler 1.0, Kapitel 4.1 Zählpunktbezeichnung",
  url: "https://www.e-control.at/documents/1785851/0/TOR_Stromz%C3%A4hler_v1.0.pdf/8b05d9e9-6221-de26-aa67-befa07c63f29?t=1713169467630",
};

/** Segmente der Zählpunktbezeichnung (Stellen 1-basiert, Ende inklusive). */
export const SEGMENTE = [
  { key: "land", label: "Land", von: 1, bis: 2, muster: /^AT$/, text: "Landeskennung Österreich" },
  { key: "netz", label: "Netzbetreibernummer", von: 3, bis: 8, muster: /^\d{6}$/, text: "vergeben von der Verrechnungsstelle, mit führenden Nullen" },
  { key: "plz", label: "Postleitzahl", von: 9, bis: 13, muster: /^\d{5}$/, text: "Gebiet der Zählstelle bei der Erstvergabe, mit führender Null" },
  { key: "nr", label: "Zählpunktnummer", von: 14, bis: 33, muster: /^[A-Z0-9]{20}$/, text: "Großbuchstaben A–Z und Ziffern 0–9" },
];

export const ZAEHLPUNKT_LAENGE = 33;

/** Großschreibung, Leerzeichen, Punkte, Binde- und Schrägstriche entfernen. */
export function normalisiereZaehlpunkt(wert) {
  return String(wert ?? "")
    .toUpperCase()
    .replace(/[\s.\-_/]/g, "");
}

/** Betreiber zu einer 6-stelligen Kennung (oder null). */
export function kennungFuer(nummer) {
  const k = String(nummer ?? "").replace(/\D/g, "");
  if (k.length !== 6) return null;
  return KENNUNGEN.find((e) => e.kennung === k) || null;
}

/**
 * Zerlegt eine Zählpunktbezeichnung in ihre Teile und prüft das Format.
 * Gibt nie den Eingabewert weiter als nötig zurück – kein Logging, keine URL.
 * @returns {{ z: string, status: "leer"|"ok"|"fehler", fehler: string[], teile: {land,netz,plz,nr}, plz: string|null, betreiber: object|null }}
 */
export function zerlegeZaehlpunkt(roh) {
  const z = normalisiereZaehlpunkt(roh);
  const teile = Object.fromEntries(SEGMENTE.map((s) => [s.key, z.slice(s.von - 1, s.bis)]));
  if (!z) return { z, status: "leer", fehler: [], teile, plz: null, betreiber: null };

  const fehler = [];
  if (z.length !== ZAEHLPUNKT_LAENGE) fehler.push(`Die Bezeichnung hat ${z.length} statt ${ZAEHLPUNKT_LAENGE} Stellen.`);
  if (!SEGMENTE[0].muster.test(teile.land)) fehler.push("Österreichische Zählpunkte beginnen mit „AT“.");
  if (teile.netz.length === 6 && !SEGMENTE[1].muster.test(teile.netz)) fehler.push("Stelle 3–8 (Netzbetreibernummer) muss aus sechs Ziffern bestehen.");
  if (teile.plz.length === 5 && !SEGMENTE[2].muster.test(teile.plz)) fehler.push("Stelle 9–13 (Postleitzahl) muss aus fünf Ziffern bestehen.");
  if (teile.nr.length > 0 && !/^[A-Z0-9]+$/.test(teile.nr)) fehler.push("Ab Stelle 14 sind nur Großbuchstaben A–Z und Ziffern 0–9 erlaubt.");

  const betreiber = SEGMENTE[1].muster.test(teile.netz) ? kennungFuer(teile.netz) : null;
  const plz = SEGMENTE[2].muster.test(teile.plz) ? teile.plz.replace(/^0/, "") : null;
  return { z, status: fehler.length ? "fehler" : "ok", fehler, teile, plz, betreiber };
}

/** Lesbare Gruppierung AT 000000 00000 …, ohne den Inhalt zu verändern. */
export function formatiereZaehlpunkt(z) {
  const n = normalisiereZaehlpunkt(z);
  return [n.slice(0, 2), n.slice(2, 8), n.slice(8, 13), n.slice(13)].filter(Boolean).join(" ");
}
