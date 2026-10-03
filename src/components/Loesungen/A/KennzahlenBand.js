import { cn } from "@/components/ui/cn";
import W22Sicht from "../w22-sicht";
import W22Zahl from "../w22-zahl";
import { zahlFormat, zahlZerlegen } from "../w22-zahlen";

/**
 * Kennzahlenband unter dem Hero – der Datenmoment der Lösungsseite (Präfix w22k).
 * Setzt die dunkle Hero-Fläche fort (wie das Band der Startseite): Eine Horizontlinie zeichnet sich,
 * ein Lichtimpuls läuft darüber und „zündet“ nacheinander die Knoten, dann zählen die Werte hoch.
 * Mobil: senkrechte Schiene mit Knoten. Server-HTML enthält alle Endwerte (SEO, ohne JS lesbar).
 *
 * items: [{ wert: Zahl, dezimal?, vor?, nach?, text?, label }]
 *   – wert als Zahl → zählt hoch; `text` statt `wert` für nicht zählbare Werte
 *     (enthält `text` genau eine Zahl, z. B. „49 %“, zählt auch diese – Endstand = Originaltext).
 * quelle: Quellenzeile (klein). titel (optional): kleine Überschrift über dem Band.
 */
const KNOTEN_MS = 380;
const SCHRITT_MS = 300;

function Wert({ k, i }) {
  const verz = KNOTEN_MS + i * SCHRITT_MS - 120;
  const teile =
    typeof k.wert === "number"
      ? {
          vor: k.vor || "",
          wert: k.wert,
          stellen: k.dezimal || 0,
          gruppieren: true,
          nach: k.nach || "",
        }
      : zahlZerlegen(String(k.text ?? k.wert ?? ""));

  if (!teile) {
    return <span className="ov-num whitespace-nowrap">{k.text ?? k.wert}</span>;
  }
  const vor = teile.vor.trim();
  const nach = teile.nach.trim();
  return (
    <>
      <span className="sr-only">{`${vor ? `${vor} ` : ""}${zahlFormat(teile.wert, teile.stellen, teile.gruppieren)}${nach ? ` ${nach}` : ""}`}</span>
      <span
        aria-hidden="true"
        className="ov-num inline-flex items-baseline whitespace-nowrap"
      >
        {vor && <span className="w22k-vor">{vor}</span>}
        <span className={i === 1 ? "ov-text-gradient-light" : undefined}>
          <W22Zahl
            wert={teile.wert}
            stellen={teile.stellen}
            gruppieren={teile.gruppieren}
            verzoegerung={verz}
            dauer={1500}
          />
        </span>
        {nach && <span className="w22k-einheit">{nach}</span>}
      </span>
    </>
  );
}

export default function KennzahlenBand({
  items = [],
  quelle,
  titel = "Auf einen Blick",
  className,
}) {
  return (
    <div
      data-blk="kennzahlen"
      className={cn("w22k relative z-10 bg-navy-950 text-white", className)}
    >
      <style href="w22-kennzahlen" precedence="w22">
        {CSS}
      </style>
      {/* weicher Übergang aus dem Hero-Foto in die Bandfläche */}
      <div
        aria-hidden="true"
        className="w22k-fade pointer-events-none absolute inset-x-0 bottom-full h-16 md:h-20"
      />
      <div className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="w22k-licht pointer-events-none absolute inset-0"
        />
        <W22Sicht
          sofort
          schwelle={0.3}
          rand="0px 0px -4% 0px"
          className="ov-container relative pb-14 pt-9 md:pb-20 md:pt-10"
        >
          {titel && (
            <div className="w22k-kopf flex items-center gap-4">
              <p className="shrink-0 font-display text-[14px] font-bold tracking-[-0.01em] text-white">
                {titel}
              </p>
              <span
                aria-hidden="true"
                className="h-px flex-1 bg-gradient-to-r from-white/12 to-transparent sm:hidden"
              />
            </div>
          )}

          <dl
            className="w22k-liste relative mt-7 md:mt-8"
            style={{ "--w22k-n": Math.max(items.length, 1) }}
          >
            <span aria-hidden="true" className="w22k-schiene absolute" />
            <span aria-hidden="true" className="w22k-horizont absolute" />
            <span aria-hidden="true" className="w22k-impuls absolute" />

            {items.map((k, i) => (
              <div
                key={k.label}
                className="w22k-fakt relative flex flex-col-reverse justify-end"
                style={{ "--w22k-k": `${KNOTEN_MS + i * SCHRITT_MS}ms` }}
              >
                <span aria-hidden="true" className="w22k-segment absolute" />
                <span aria-hidden="true" className="w22k-knoten absolute" />
                <dt className="w22k-label mt-3.5 max-w-[19rem] text-[13.5px] leading-snug text-white/62 [overflow-wrap:break-word] md:text-[14px]">
                  {k.label}
                </dt>
                <dd className="w22k-wert font-display font-extrabold">
                  <Wert k={k} i={i} />
                </dd>
              </div>
            ))}
          </dl>

          {quelle && (
            <p className="w22k-quelle mt-10 max-w-[64rem] text-[12px] leading-relaxed text-white/45 md:mt-12">
              {quelle}
            </p>
          )}
        </W22Sicht>
      </div>
    </div>
  );
}

const CSS = `
.w22k{--w22k-e:cubic-bezier(.16,1,.3,1)}
.w22k-fade{background:linear-gradient(180deg,rgba(3,18,43,0),rgba(3,18,43,.55) 55%,#03122b)}
.w22k-licht{background:
  radial-gradient(42% 90% at 0% 100%,rgba(102,153,51,.13),transparent 70%)}
.w22k-wert{font-size:clamp(2.2rem,0.9rem + 2.6vw,3.2rem);line-height:.95;letter-spacing:-.04em}
.w22k-einheit{font-size:.42em;font-weight:700;letter-spacing:-.01em;margin-left:.22em;color:rgba(255,255,255,.55)}
.w22k-vor{font-size:.62em;font-weight:700;letter-spacing:-.02em;margin-right:.14em;color:rgba(255,255,255,.7)}

/* Raster: mobil eine Spalte an der Schiene · ab sm zwei Spalten mit eigener Linie · ab lg eine Reihe am Horizont */
.w22k-liste{display:grid;gap:1.85rem;padding-left:2rem}
.w22k-schiene{left:5px;top:.6rem;bottom:.4rem;width:1px;transform-origin:top;
  background:linear-gradient(180deg,rgba(174,208,131,.6),rgba(255,255,255,.06))}
.w22k-horizont,.w22k-impuls,.w22k-segment{display:none}
.w22k-knoten{width:11px;height:11px;border-radius:9999px;background:#03122b;left:-32px;top:.72rem;
  box-shadow:inset 0 0 0 1.5px #aed083,0 0 0 5px rgba(140,186,88,.1),0 0 18px rgba(174,208,131,.5)}
.w22k-knoten::after{content:"";position:absolute;inset:3px;border-radius:inherit;background:#eaf6d8}
@media (min-width:640px){
  .w22k-liste{grid-template-columns:repeat(2,minmax(0,1fr));gap:2.6rem 2.5rem;padding-left:0}
  .w22k-schiene{display:none}
  .w22k-fakt{padding-top:1.9rem}
  .w22k-segment{display:block;left:0;right:0;top:0;height:1px;transform-origin:left;
    background:linear-gradient(90deg,rgba(174,208,131,.5),rgba(255,255,255,.14) 40%,rgba(255,255,255,.03))}
  .w22k-knoten{left:0;top:-5px}
}
@media (min-width:1024px){
  .w22k-liste{grid-template-columns:repeat(var(--w22k-n),minmax(0,1fr));gap:0}
  .w22k-fakt{padding-right:2.25rem}
  .w22k-segment{display:none}
  .w22k-horizont{display:block;top:0;height:1px;left:calc(50% - 50vw);width:100vw;transform-origin:left;
    background:linear-gradient(90deg,rgba(255,255,255,.03),rgba(255,255,255,.16) 16%,rgba(255,255,255,.16) 84%,rgba(255,255,255,.03))}
  .w22k-impuls{display:block;top:0;left:calc(50% - 50vw);width:240px;height:3px;margin-top:-1px;border-radius:3px;opacity:0;pointer-events:none;
    background:linear-gradient(90deg,transparent,rgba(174,208,131,.9) 55%,#fff6dc 92%,transparent);box-shadow:0 0 18px 2px rgba(174,208,131,.4)}
}

@media (prefers-reduced-motion:no-preference){
  [data-w22-bereit]:not([data-w22-an]) :is(.w22k-kopf,.w22k-knoten,.w22k-wert,.w22k-label,.w22k-quelle){opacity:0}
  [data-w22-bereit]:not([data-w22-an]) :is(.w22k-horizont,.w22k-segment){transform:scaleX(0)}
  [data-w22-bereit]:not([data-w22-an]) .w22k-schiene{transform:scaleY(0)}
  [data-w22-an] .w22k-kopf{animation:w22k-auf 800ms var(--w22k-e) both}
  [data-w22-an] .w22k-horizont{animation:w22k-x 1400ms var(--w22k-e) both}
  [data-w22-an] .w22k-segment{animation:w22k-x 1100ms var(--w22k-e) calc(var(--w22k-k) - 300ms) both}
  [data-w22-an] .w22k-schiene{animation:w22k-y 1500ms var(--w22k-e) both}
  [data-w22-an] .w22k-impuls{animation:w22k-impuls 1800ms cubic-bezier(.45,.05,.55,.95) 120ms both}
  [data-w22-an] .w22k-knoten{animation:w22k-knoten 900ms var(--w22k-e) var(--w22k-k) both}
  [data-w22-an] .w22k-wert{animation:w22k-auf 900ms var(--w22k-e) calc(var(--w22k-k) - 100ms) both}
  [data-w22-an] .w22k-label{animation:w22k-auf 900ms var(--w22k-e) calc(var(--w22k-k) + 80ms) both}
  [data-w22-an] .w22k-quelle{animation:w22k-ein 1200ms ease calc(var(--w22k-n) * 300ms + 500ms) both}
}
@keyframes w22k-auf{from{opacity:0;transform:translate3d(0,16px,0)}}
@keyframes w22k-ein{from{opacity:0}}
@keyframes w22k-x{from{transform:scaleX(0)}}
@keyframes w22k-y{from{transform:scaleY(0)}}
@keyframes w22k-knoten{0%{opacity:0;transform:scale(0)}55%{opacity:1;transform:scale(1.7)}100%{transform:scale(1)}}
@keyframes w22k-impuls{0%{opacity:0;transform:translate3d(-240px,0,0)}10%{opacity:1}85%{opacity:1}100%{opacity:0;transform:translate3d(100vw,0,0)}}
`;
