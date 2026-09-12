/**
 * Rendert Text aus dem Backoffice als gegliederte Absätze.
 *
 * Hintergrund: Das CMS liefert Beschreibungen oft als einen einzigen Block
 * (gemessen: 778 Zeichen, 6 Sätze, 1 Zeilenumbruch). Als ein <p> ergibt das
 * eine ungegliederte Textwand, die kaum jemand zu Ende liest.
 *
 * Die Komponente bricht zuerst an vorhandenen Leer-/Zeilenumbrüchen. Bleibt
 * ein Block danach zu lang, wird er an einer SATZGRENZE geteilt – nie mitten
 * im Satz. Der Wortlaut bleibt unverändert, es ändert sich nur die Gliederung.
 */

const MAX_ZEICHEN = 320;

function teile(block) {
  if (block.length <= MAX_ZEICHEN) return [block];

  const saetze = block.split(/(?<=[.!?])\s+/);
  const teile = [];
  let aktuell = "";

  for (const satz of saetze) {
    // Satz würde den Absatz zu lang machen -> neuen Absatz beginnen,
    // aber nur wenn der aktuelle schon Substanz hat.
    if (aktuell && (aktuell + " " + satz).length > MAX_ZEICHEN) {
      teile.push(aktuell);
      aktuell = satz;
    } else {
      aktuell = aktuell ? `${aktuell} ${satz}` : satz;
    }
  }
  if (aktuell) teile.push(aktuell);
  return teile;
}

export default function Fliesstext({ text, className = "", absatzClassName = "" }) {
  if (!text) return null;

  const absaetze = String(text)
    .split(/\n{1,}/)
    .map((t) => t.trim())
    .filter(Boolean)
    .flatMap(teile);

  return (
    <div className={className}>
      {absaetze.map((a, i) => (
        <p
          key={i}
          className={`ov-measure ${i > 0 ? "mt-4" : ""} ${absatzClassName}`.trim()}
        >
          {a}
        </p>
      ))}
    </div>
  );
}
