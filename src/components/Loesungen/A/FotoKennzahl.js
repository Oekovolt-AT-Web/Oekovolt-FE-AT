import Image from "next/image";
import { cn } from "@/components/ui/cn";
import W22Sicht from "../w22-sicht";
import W22Zahl from "../w22-zahl";
import { zahlZerlegen } from "../w22-zahlen";

/**
 * Foto mit schwebender Kennzahlkarte – als `aside` für SplitMedia (Präfix w22f).
 * bild { src, alt, position? }, titel (kleine Überschrift der Karte),
 * werte [{ wert, label }] (2–3 Stück), fuss (kurzer Hinweis), seite: "links" | "rechts"
 *
 * Komposition: Das Foto liegt in einem gezeichneten Messrahmen (vier Eckwinkel), die Kennzahlkarte
 * dockt an der Bildkante an. Aufbau beim Eintritt: Maske gibt das Foto frei, das Foto setzt sich,
 * die Eckwinkel zeichnen sich, die Karte steigt auf, ihre Lichtkante läuft an und die Werte zählen
 * hoch (Endstand = Originaltext). Hover: ruhiger Zoom.
 */
export default function FotoKennzahl({ bild, titel, werte = [], fuss, seite = "rechts", format = "aspect-[4/3]", className }) {
  const rechts = seite === "rechts";
  return (
    <W22Sicht schwelle={0.25} data-blk="fotokennzahl" className={cn("w22f relative pb-12 md:pb-0", className)}>
      <style href="w22-fotokennzahl" precedence="w22">{CSS}</style>

      {/* Messrahmen: vier Eckwinkel, leicht außerhalb des Fotos */}
      <span aria-hidden="true" className="w22f-ecke w22f-ecke-lo" />
      <span aria-hidden="true" className="w22f-ecke w22f-ecke-ro" />
      <span aria-hidden="true" className="w22f-ecke w22f-ecke-lu" />
      <span aria-hidden="true" className="w22f-ecke w22f-ecke-ru" />

      <div className={cn("w22f-bild group relative overflow-hidden rounded-[2rem] bg-navy-950 shadow-[0_40px_80px_-40px_rgba(3,18,43,0.55)]", format)}>
        <div className="w22f-setzen absolute inset-0">
          <div className="w22f-zoom absolute inset-0">
            <Image src={bild.src} alt={bild.alt || ""} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" style={bild.position ? { objectPosition: bild.position } : undefined} />
          </div>
        </div>
        <div aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-navy-950/55 via-navy-950/0 to-navy-950/0" />
        <div aria-hidden="true" className="absolute inset-0 rounded-[2rem] ring-1 ring-inset ring-white/10" />
        <span aria-hidden="true" className="w22f-maske absolute inset-0 bg-white" />
      </div>

      {werte.length > 0 && (
        <div
          className={cn(
            "w22f-karte absolute -bottom-1 left-3 right-3 overflow-hidden rounded-[1.5rem] bg-white p-5 sm:left-auto sm:right-auto sm:w-[400px] md:-bottom-10 md:p-6",
            rechts ? "sm:right-6 md:-right-8" : "sm:left-6 md:-left-8"
          )}
        >
          <span aria-hidden="true" className="w22f-kante absolute inset-x-0 top-0 h-[3px]" />
          {titel && (
            <p className="flex items-center gap-2 text-[11.5px] font-semibold uppercase tracking-[0.14em] text-ov-700">
              <svg aria-hidden="true" viewBox="0 0 20 20" className="h-4 w-4 shrink-0">
                <circle cx="10" cy="10" r="3.6" fill="#ffc53d" />
                <g stroke="#f5a70f" strokeWidth="1.6" strokeLinecap="round">
                  <path d="M10 2v2.2M10 15.8V18M2 10h2.2M15.8 10H18M4.3 4.3l1.5 1.5M14.2 14.2l1.5 1.5M4.3 15.7l1.5-1.5M14.2 5.8l1.5-1.5" />
                </g>
              </svg>
              {titel}
            </p>
          )}
          <dl className={cn("mt-4 grid", werte.length === 3 ? "grid-cols-3" : "grid-cols-2")}>
            {werte.map((w, i) => {
              const teile = zahlZerlegen(String(w.wert));
              return (
                <div key={w.label} className={cn("w22f-wert flex min-w-0 flex-col-reverse justify-end", i > 0 && "border-l border-ink-100 pl-3 sm:pl-4", i < werte.length - 1 && "pr-2 sm:pr-3")} style={{ "--w22f-i": i }}>
                  <dt className="mt-1.5 text-[12px] leading-snug text-ink-500">{w.label}</dt>
                  <dd className="ov-num whitespace-nowrap font-display text-[17px] font-extrabold leading-none tracking-[-0.02em] text-ink-900 sm:text-[21px] md:text-[22px]">
                    {teile ? (
                      <>
                        <span className="sr-only">{w.wert}</span>
                        <span aria-hidden="true">
                          {teile.vor}
                          <W22Zahl wert={teile.wert} stellen={teile.stellen} gruppieren={teile.gruppieren} verzoegerung={700 + i * 140} dauer={1400} />
                          {teile.nach}
                        </span>
                      </>
                    ) : (
                      w.wert
                    )}
                  </dd>
                </div>
              );
            })}
          </dl>
          {fuss && <p className="mt-4 border-t border-ink-100 pt-3 text-[11.5px] leading-snug text-ink-500">{fuss}</p>}
        </div>
      )}
    </W22Sicht>
  );
}

const CSS = `
.w22f{--w22f-e:cubic-bezier(.22,1,.36,1)}
.w22f-ecke{position:absolute;width:28px;height:28px;pointer-events:none;color:var(--color-ov-400);border:0 solid currentColor}
.w22f-ecke-lo{left:-12px;top:-12px;border-left-width:1.5px;border-top-width:1.5px;border-top-left-radius:10px;transform-origin:0 0}
.w22f-ecke-ro{right:-12px;top:-12px;border-right-width:1.5px;border-top-width:1.5px;border-top-right-radius:10px;transform-origin:100% 0}
.w22f-ecke-lu{left:-12px;bottom:calc(3rem - 12px);border-left-width:1.5px;border-bottom-width:1.5px;border-bottom-left-radius:10px;transform-origin:0 100%}
.w22f-ecke-ru{right:-12px;bottom:calc(3rem - 12px);border-right-width:1.5px;border-bottom-width:1.5px;border-bottom-right-radius:10px;transform-origin:100% 100%}
@media (min-width:768px){
  .w22f-ecke{width:36px;height:36px}
  .w22f-ecke-lo{left:-16px;top:-16px}.w22f-ecke-ro{right:-16px;top:-16px}
  .w22f-ecke-lu{left:-16px;bottom:-16px}.w22f-ecke-ru{right:-16px;bottom:-16px}
}
.w22f-karte{box-shadow:0 0 0 1px rgba(223,227,234,.8),0 1px 2px rgba(3,18,43,.06),0 30px 60px -28px rgba(3,18,43,.45)}
.w22f-kante{background:linear-gradient(90deg,#8cba58,#669933 40%,#ffc53d);transform-origin:0 50%}
.w22f-maske{transform-origin:50% 0%;transform:scaleY(0)}
.w22f-zoom{transition:transform 1400ms var(--w22f-e)}
@media (hover:hover) and (prefers-reduced-motion:no-preference){.w22f-bild:hover .w22f-zoom{transform:scale(1.04)}}

@media (prefers-reduced-motion:no-preference){
  [data-w22-an] .w22f-maske{transition:transform 1150ms cubic-bezier(.77,0,.18,1) 80ms}
  [data-w22-an] .w22f-setzen{transition:transform 1700ms var(--w22f-e) 80ms}
  [data-w22-an] .w22f-ecke{transition:transform 900ms var(--w22f-e) 650ms,opacity 500ms ease 650ms}
  [data-w22-an] .w22f-karte{transition:opacity 800ms var(--w22f-e) 420ms,transform 900ms var(--w22f-e) 420ms}
  [data-w22-an] .w22f-kante{transition:transform 1100ms var(--w22f-e) 760ms}
  [data-w22-an] .w22f-wert{transition:opacity 700ms var(--w22f-e),transform 700ms var(--w22f-e);transition-delay:calc(var(--w22f-i) * 140ms + 620ms)}
  [data-w22-bereit]:not([data-w22-an]) .w22f-maske{transform:scaleY(1)}
  [data-w22-bereit]:not([data-w22-an]) .w22f-setzen{transform:scale(1.12)}
  [data-w22-bereit]:not([data-w22-an]) .w22f-ecke{opacity:0;transform:scale(.4)}
  [data-w22-bereit]:not([data-w22-an]) .w22f-karte{opacity:0;transform:translate3d(0,24px,0)}
  [data-w22-bereit]:not([data-w22-an]) .w22f-kante{transform:scaleX(0)}
  [data-w22-bereit]:not([data-w22-an]) .w22f-wert{opacity:0;transform:translate3d(0,10px,0)}
}
`;
