/**
 * Keyframes für die Premium-Bausteine (Technik & Service). globals.css ist eine
 * gemeinsame Datei und bleibt unverändert – deshalb liefern die Bausteine ihre
 * wenigen Animationen selbst mit. Alles nur bei `prefers-reduced-motion:
 * no-preference`; sonst stehen Linien und Punkte still.
 *
 * Klassen:
 *  ts-fluss        gestrichelte Linie „fließt“ (stroke-dashoffset)
 *  ts-fluss-rueck  wie oben, Gegenrichtung
 *  ts-puls         weicher Leuchtpuls (opacity)
 *  ts-scan         Scanlinie von oben nach unten (translateY)
 *  ts-blink        Status-LED
 */
const CSS = `
@keyframes ts-fluss { to { stroke-dashoffset: -48; } }
@keyframes ts-fluss-rueck { to { stroke-dashoffset: 48; } }
@keyframes ts-puls { 0%,100% { opacity: .35; } 50% { opacity: 1; } }
@keyframes ts-scan { 0% { transform: translateY(-100%); } 100% { transform: translateY(100%); } }
@keyframes ts-blink { 0%,100% { opacity: 1; } 50% { opacity: .25; } }
@keyframes ts-auf { from { transform: scaleY(0); } to { transform: scaleY(1); } }
@media (prefers-reduced-motion: no-preference) {
  .ts-fluss { animation: ts-fluss 1.6s linear infinite; }
  .ts-fluss-langsam { animation: ts-fluss 3.2s linear infinite; }
  .ts-fluss-rueck { animation: ts-fluss-rueck 2.2s linear infinite; }
  .ts-puls { animation: ts-puls 2.4s ease-in-out infinite; }
  .ts-scan { animation: ts-scan 4.5s cubic-bezier(.45,0,.55,1) infinite; }
  .ts-blink { animation: ts-blink 1.4s ease-in-out infinite; }
}
`;

export default function Animationen() {
  return <style href="ts-animationen" precedence="default">{CSS}</style>;
}
