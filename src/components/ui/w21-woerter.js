// src/components/ui/w21-woerter.js
//
// Zerlegt eine Überschrift (String oder JSX wie `<>Text <span className="ov-text-gradient-light">Akzent</span></>`)
// in einzelne Wörter, jedes in einer eigenen Maske. So steigt die Überschrift Wort für Wort aus
// ihrer Grundlinie auf – wirkt wie eine zeilenweise Enthüllung, ohne Zeilen messen zu müssen.
//
// - Text und Leerzeichen bleiben unverändert im HTML (SEO, Screenreader, Copy & Paste).
// - Getrennt wird nur an normalen Leerzeichen; geschützte Leerzeichen ( ) bleiben im Wort.
// - Verlaufs-Akzente (Klasse ov-text-gradient…): Jedes Wort bekommt den Ausschnitt des Verlaufs, der
//   an seiner Stelle läge (nach Zeichenanteil) – der Verlauf läuft also weiter durch den Akzent.
// - Andere Elemente (<br/>, Links, Komponenten) bleiben als Ganzes in einer Maske.
// - Rein, ohne Hooks: funktioniert in Server- und Client-Komponenten, hydrierungssicher.
// Die Bewegung selbst steht im CSS der aufrufenden Komponente (Klassen w21-m / w21-w, Variable --w21-d).

import { Children, Fragment, cloneElement, isValidElement } from "react";

const LEER = /([ \t\n\r]+)/;
const r2 = (v) => Math.round(v * 100) / 100;

function nurText(kinder) {
  const arr = Children.toArray(kinder);
  return arr.length > 0 && arr.every((k) => typeof k === "string" || typeof k === "number");
}

/**
 * @param {import("react").ReactNode} knoten  Überschrift
 * @param {{ start?: number, schritt?: number, max?: number }} opt  Verzögerung des ersten Worts,
 *        Abstand je Wort und Obergrenze der Staffelung (alle in ms)
 */
export function w21Woerter(knoten, { start = 0, schritt = 55, max = 520 } = {}) {
  let n = 0;
  const maske = (inhalt, key) => {
    const d = start + Math.min(n++ * schritt, max);
    return (
      <span key={key} className="w21-m">
        <span className="w21-w" style={{ "--w21-d": `${d}ms` }}>
          {inhalt}
        </span>
      </span>
    );
  };

  const text = (s, key, huelle) => {
    // Gedankenstrich bleibt am vorigen Wort (kein Zeilenanfang mit „–“)
    const roh = String(s).replace(/ ([–—])(?=\s|$)/g," $1");
    const teile = roh.split(LEER);
    const gesamt = roh.length;
    let pos = 0;
    return teile.map((t, i) => {
      const von = pos;
      pos += t.length;
      if (!t) return null;
      if (LEER.test(t)) return " ";
      return maske(huelle ? huelle(t, von, gesamt, `${key}-${i}`) : t, `${key}-${i}`);
    });
  };

  const gehe = (k, key) => {
    if (k == null || typeof k === "boolean") return null;
    if (typeof k === "string" || typeof k === "number") return text(k, key);
    if (Array.isArray(k)) return k.map((x, i) => gehe(x, `${key}.${i}`));
    if (!isValidElement(k)) return k;
    if (k.type === Fragment) return Children.toArray(k.props.children).map((x, i) => gehe(x, `${key}.${i}`));
    if (typeof k.type === "string" && k.type !== "br" && nurText(k.props.children)) {
      const inhalt = Children.toArray(k.props.children).join("");
      const klasse = k.props.className || "";
      const verlauf = (klasse.match(/ov-text-gradient(?:-light)?/) || [])[0];
      const ausschnitt = (wort, von, gesamt) =>
        verlauf && gesamt > wort.length
          ? { backgroundSize: `${r2((gesamt / wort.length) * 100)}% 100%`, backgroundPosition: `${r2((von / (gesamt - wort.length)) * 100)}% 0` }
          : {};
      // Block-Element (z. B. Unterzeile `block text-[0.52em]`): bleibt ein Element, die Wörter liegen darin
      if (/(^|\s)(block|flex|grid)(\s|$)/.test(klasse)) {
        const huelle = verlauf
          ? (wort, von, gesamt, wkey) => (
              <span key={wkey} className={verlauf} style={ausschnitt(wort, von, gesamt)}>
                {wort}
              </span>
            )
          : null;
        return cloneElement(k, { key, className: klasse.replace(verlauf || "\u0000", "").trim() }, text(inhalt, key, huelle));
      }
      return text(inhalt, key, (wort, von, gesamt, wkey) => cloneElement(k, { key: wkey, style: { ...(k.props.style || {}), ...ausschnitt(wort, von, gesamt) } }, wort));
    }
    if (k.type === "br") return k;
    return maske(k, key);
  };

  return gehe(knoten, "w");
}
