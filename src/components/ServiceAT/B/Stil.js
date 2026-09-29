/**
 * Keyframes der Service-Bausteine „B“ (Finanzierung, Notstrom, Versicherung …).
 * globals.css ist gemeinsam und bleibt unverändert – die wenigen Animationen
 * kommen hier als deduplizierter <style> (React 19: href + precedence).
 * Alle Bewegungen nur bei `prefers-reduced-motion: no-preference`.
 *
 * Klassen:
 *  sb-zeichnen   SVG-Linie zeichnet sich (stroke-dasharray/-offset per Style setzen)
 *  sb-kenburns   langsamer Zoom/Schwenk für Standbilder
 *  sb-schweben   leichtes Auf und Ab
 *  sb-puls       weicher Leuchtpuls
 *  sb-fluss      gestrichelte Linie fließt
 *  sb-scan       Scanlinie läuft von links nach rechts
 *  sb-balken     Balken wächst von unten (transform-origin bottom)
 *  sb-blink      Aufnahme-Punkt (REC)
 */
const CSS = `
@keyframes sb-zeichnen { to { stroke-dashoffset: 0; } }
@keyframes sb-kenburns { 0% { transform: scale(1.02) translate3d(0,0,0); } 100% { transform: scale(1.14) translate3d(-2%, -1.5%, 0); } }
@keyframes sb-schweben { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
@keyframes sb-puls { 0%,100% { opacity: .35; } 50% { opacity: 1; } }
@keyframes sb-fluss { to { stroke-dashoffset: -40; } }
@keyframes sb-scan { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
@keyframes sb-balken { from { transform: scaleY(0); } to { transform: scaleY(1); } }
@keyframes sb-blink { 0%,100% { opacity: 1; } 50% { opacity: .2; } }
@keyframes sb-fortschritt { from { width: 0%; } to { width: 100%; } }
@keyframes sb-ein { from { opacity: .001; transform: translateY(8px); } to { opacity: 1; transform: none; } }
@media (prefers-reduced-motion: no-preference) {
  .sb-zeichnen { animation: sb-zeichnen 1.8s cubic-bezier(.22,1,.36,1) forwards; }
  .is-visible .sb-zeichnen-sichtbar { animation: sb-zeichnen 2.2s cubic-bezier(.22,1,.36,1) forwards; }
  .sb-kenburns { animation: sb-kenburns 14s ease-in-out infinite alternate; }
  .sb-schweben { animation: sb-schweben 6s ease-in-out infinite; }
  .sb-puls { animation: sb-puls 2.4s ease-in-out infinite; }
  .sb-fluss { animation: sb-fluss 1.4s linear infinite; }
  .sb-scan { animation: sb-scan 3.6s cubic-bezier(.45,0,.55,1) infinite; }
  .is-visible .sb-balken { animation: sb-balken .9s cubic-bezier(.22,1,.36,1) both; transform-origin: bottom; }
  .sb-blink { animation: sb-blink 1.2s ease-in-out infinite; }
  .sb-ein { animation: sb-ein 380ms cubic-bezier(.22,1,.36,1) both; }
}
@media (prefers-reduced-motion: reduce) {
  .sb-zeichnen, .sb-zeichnen-sichtbar { stroke-dashoffset: 0 !important; }
}
.sb-filmloecher {
  background-image: radial-gradient(circle at center, rgba(255,255,255,.22) 0 3px, transparent 3.5px);
  background-size: 22px 12px;
  background-repeat: repeat-x;
  background-position: center;
}
`;

export default function Stil() {
  return (
    <style href="sb-animationen" precedence="default">
      {CSS}
    </style>
  );
}
