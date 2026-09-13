export const RUECKRUF_EVENT = "ov:rueckruf";

/** Öffnet das Rückruf-Widget von überall: oeffneRueckruf() oder oeffneRueckruf("termin"). */
export function oeffneRueckruf(tab = "rueckruf") {
  window.dispatchEvent(new CustomEvent(RUECKRUF_EVENT, { detail: { tab } }));
}
