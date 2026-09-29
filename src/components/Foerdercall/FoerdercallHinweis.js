// Startseiten-Hinweis zum 3. EAG-Fördercall 2026 (Server-Komponente).
//
// Rückbau: die eine Zeile <FoerdercallHinweis /> in src/app/page.js löschen.
// Nach Call-Ende (22.10.2026, 23:59 Uhr) rendert die Komponente von selbst nichts mehr:
// serverseitig beim nächsten Rendern der Startseite, clientseitig sofort.

import HinweisLeiste from "./HinweisLeiste";
import { callPhase } from "@/lib/foerdercall";

export default function FoerdercallHinweis() {
  const jetzt = Date.now();
  if (callPhase(jetzt) === "nach") return null;
  return <HinweisLeiste startMs={jetzt} />;
}
