// src/components/Forderungen/foerderstatusText.js
//
// Reine Hilfsfunktionen der Förderstatus-Ampel (/forderungen/status), ohne
// React und ohne Alias-Importe – mit node testbar (scripts/c02-foerderstatus.test.mjs).
//
// Solange Landesprogramme (src/data/bundeslaender.js) noch keine fristIso
// tragen (C01), wird die Frist aus dem Statustext gelesen – nur wenn dort ein
// vollständiges Datum steht. Nichts wird geschätzt.

const MONATE = { jänner: 1, januar: 1, februar: 2, märz: 3, april: 4, mai: 5, juni: 6, juli: 7, august: 8, september: 9, oktober: 10, november: 11, dezember: 12 };

const pad = (n) => String(n).padStart(2, "0");

/** "31.12.2026" → "2026-12-31"; ungültig → null. */
export function isoAusDatum(text) {
  const m = typeof text === "string" && text.match(/(\d{1,2})\.(\d{1,2})\.(\d{4})/);
  if (!m) return null;
  const [t, mo, j] = [Number(m[1]), Number(m[2]), Number(m[3])];
  if (t < 1 || t > 31 || mo < 1 || mo > 12) return null;
  return `${j}-${pad(mo)}-${pad(t)}`;
}

/**
 * Einreich- oder Laufzeitende aus einem Statustext:
 *   "bis 31.12.2026", "bis 30.09.2026, 12 Uhr", "Stichtag 30.06.2026", "Anträge bis 22.10.2026",
 *   "08.10.–22.10.2026" (Zeitraum → Ende), "bis Ende 2026" → 2026-12-31.
 * Kein Datum → null. Vergangene Formulierungen ("beendet am …", "ausgelaufen am …") liefern ebenfalls das Datum.
 */
export function fristAusText(text) {
  if (typeof text !== "string" || !text) return null;
  const t = text.replace(/\s+/g, " ");

  // Zeitraum "08.10.–22.10.2026" oder "23.04.-11.05.2026": Ende = zweites Datum mit dem Jahr
  const z = t.match(/(\d{1,2})\.(\d{1,2})\.\s?[–-]\s?(\d{1,2})\.(\d{1,2})\.(\d{4})/);
  if (z) return `${z[5]}-${pad(Number(z[4]))}-${pad(Number(z[3]))}`;

  const bis = t.match(/\b(?:bis(?: längstens| spätestens)?|Stichtag|endete|beendet am|ausgelaufen am|eingestellt per|Einreichfrist)\s*(?:zum\s*)?(\d{1,2}\.\d{1,2}\.\d{4})/i);
  if (bis) return isoAusDatum(bis[1]);

  const ende = t.match(/\bbis Ende (\d{4})\b/i);
  if (ende) return `${ende[1]}-12-31`;

  const monat = t.match(/\bbis (?:Ende )?([A-Za-zäÄ]+) (\d{4})\b/);
  if (monat && MONATE[monat[1].toLowerCase()]) {
    const mo = MONATE[monat[1].toLowerCase()];
    const letzter = new Date(Date.UTC(Number(monat[2]), mo, 0)).getUTCDate();
    return `${monat[2]}-${pad(mo)}-${pad(letzter)}`;
  }
  return null;
}

/** Beginn aus "seit 01.05.2026", "ab 15.04.2026", "Call ab 15.04.2026" oder Zeitraum-Start. */
export function startAusText(text) {
  if (typeof text !== "string" || !text) return null;
  const t = text.replace(/\s+/g, " ");
  const z = t.match(/(\d{1,2})\.(\d{1,2})\.\s?[–-]\s?(\d{1,2})\.(\d{1,2})\.(\d{4})/);
  if (z) return `${z[5]}-${pad(Number(z[2]))}-${pad(Number(z[1]))}`;
  const ab = t.match(/\b(?:seit|ab)\s*(?:dem\s*)?(\d{1,2}\.\d{1,2}\.\d{4})/i);
  return ab ? isoAusDatum(ab[1]) : null;
}

/** Erkennt redaktionell beendete Programme am Text (ausgelaufen, beendet, ausgeschöpft, eingestellt, geschlossen). */
export function textSagtBeendet(text) {
  return /\b(ausgelaufen|beendet|ausgeschöpft|eingestellt|geschlossen|nicht mehr gefördert|abgeschlossen|abgelaufen)\b/i.test(String(text || ""));
}

/**
 * Datumsfelder eines Programms vereinheitlichen: vorhandene ISO-Felder (C01) haben
 * Vorrang, sonst Ableitung aus dem Statustext. anzeigeStatus "beendet" bei eindeutig
 * beendeten Texten ohne Datum.
 */
export function datumsfelder(p = {}) {
  const fristIso = p.fristIso || fristAusText(p.status) || fristAusText(p.ende) || null;
  const startIso = p.startIso || startAusText(p.status) || null;
  let anzeigeStatus = p.anzeigeStatus || null;
  if (!anzeigeStatus && !fristIso && textSagtBeendet(p.ende || p.status)) anzeigeStatus = "beendet";
  return { fristIso, startIso, gueltigBisIso: p.gueltigBisIso || null, anzeigeStatus };
}
