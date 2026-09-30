// src/lib/prognose/budget.js
//
// Zentraler Abrufzähler für den GeoSphere Data Hub (reine Logik, Uhr wird übergeben → testbar).
//
// Limits laut Antwort-Headern der Dataset-API (geprüft am 30.09.2026 per curl):
//   X-RateLimit-Limit-Second: 5 · X-RateLimit-Limit-Hour: 240
// Wir bleiben mit eigenem Deckel (Standard 200 je gleitender Stunde, mind. 250 ms Abstand) deutlich
// darunter und werten zusätzlich den Header X-RateLimit-Remaining-Hour aus: Er zählt alle Abrufe
// unserer Server-IP bei GeoSphere – auch aus anderen Prozessen. Fällt er auf die Reserve, sperren
// wir weitere Abrufe für eine Weile und antworten aus dem Cache.

export const GEOSPHERE_LIMIT_STUNDE = 240;

export function neuesBudget({ proStunde = 200, reserve = 20, fensterMs = 3600000, sperreMs = 10 * 60000 } = {}) {
  const zeiten = [];
  let sperreBis = 0;

  const aufraeumen = (jetzt) => {
    while (zeiten.length && jetzt - zeiten[0] >= fensterMs) zeiten.shift();
  };

  return {
    /** Verbleibende Abrufe im eigenen Fenster (0 während einer Sperre). */
    rest(jetzt) {
      aufraeumen(jetzt);
      if (jetzt < sperreBis) return 0;
      return Math.max(0, proStunde - zeiten.length);
    },
    /** Darf jetzt `kosten` Abrufe starten? */
    darf(jetzt, kosten = 1) {
      return this.rest(jetzt) >= kosten;
    },
    /** Abruf verbuchen (vor dem Absenden, damit parallele Anfragen mitzählen). */
    buchen(jetzt) {
      aufraeumen(jetzt);
      zeiten.push(jetzt);
    },
    /** Rückmeldung aus dem Header X-RateLimit-Remaining-Hour. */
    headerMelden(verbleibend, jetzt) {
      const n = Number(verbleibend);
      if (Number.isFinite(n) && n <= reserve) sperreBis = Math.max(sperreBis, jetzt + sperreMs);
    },
    /** HTTP 429 von GeoSphere: mindestens `sekunden` (Standard: Sperrdauer) pausieren. */
    zuVieleMelden(jetzt, sekunden) {
      const ms = Number.isFinite(Number(sekunden)) && Number(sekunden) > 0 ? Number(sekunden) * 1000 : sperreMs;
      sperreBis = Math.max(sperreBis, jetzt + Math.max(ms, 60000));
    },
    gesperrtBis() {
      return sperreBis;
    },
    anzahl(jetzt) {
      aufraeumen(jetzt);
      return zeiten.length;
    },
  };
}
