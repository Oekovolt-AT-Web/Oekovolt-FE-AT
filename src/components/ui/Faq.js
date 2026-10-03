import { cn } from "./cn";
import W21Sicht from "./w21-sicht";

/**
 * FAQ-Akkordeon auf Basis von <details> – funktioniert ohne JavaScript,
 * ist per Tastatur bedienbar und liefert optional FAQPage-Schema.
 * items: [{ q, a }]  (a: String oder JSX; für Schema wird `aText` oder a als String genutzt)
 * tone:  "light" (Standard, auf weißen und Sand-Flächen) | "dark" (auf Navy)
 *
 * Gestaltung (Präfix w21, im Stil des Startseiten-Akkordeons): Fragen als ruhiger Kartenstapel,
 * die offene Frage hebt sich als Karte ab – grüne Lichtkante links, Nummer in Grün, das Plus
 * zeichnet sich zum Minus, die Antwort gleitet auf (::details-content, wo unterstützt).
 * Die erste Frage ist offen; mit `name` ist immer nur eine Antwort offen (Browser ohne
 * Unterstützung öffnen einfach mehrere). Antworten stehen vollständig im HTML (SEO).
 * Beim Eintritt gleiten die Fragen gestaffelt ein (w21-sicht; ohne JS sofort sichtbar).
 */
export default function Faq({ items = [], schema = true, className, tone = "light" }) {
  const dunkel = tone === "dark";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((it) => ({
      "@type": "Question",
      name: it.q,
      acceptedAnswer: { "@type": "Answer", text: it.aText || (typeof it.a === "string" ? it.a : "") },
    })),
  };
  const gruppe = `w21-faq-${kennung(items.map((it) => it.q).join("|"))}`;

  return (
    <W21Sicht schwelle={0.08} data-blk="faq" className={cn("w21-f flex flex-col gap-2.5 md:gap-3", dunkel && "w21-f-dunkel", className)}>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      {schema && items.length > 0 && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      )}
      {items.map((it, i) => (
        <details key={it.q} name={gruppe} open={i === 0} className="w21-f-item group relative rounded-[1.35rem]" style={{ "--w21-i": Math.min(i, 8) }}>
          <summary
            className={cn(
              "relative flex min-h-11 cursor-pointer list-none items-start gap-4 rounded-[1.35rem] px-5 py-5 outline-none md:gap-5 md:px-6 md:py-[1.375rem] [&::-webkit-details-marker]:hidden",
              "focus-visible:outline-2 focus-visible:outline-offset-2",
              dunkel ? "focus-visible:outline-ov-300" : "focus-visible:outline-ov-600"
            )}
          >
            <span
              className={cn(
                "ov-num mt-[3px] w-6 shrink-0 font-display text-[13px] font-bold tracking-[0.04em] transition-colors duration-300 md:mt-[4px]",
                dunkel ? "text-white/40 group-open:text-ov-300" : "text-ink-400 group-open:text-ov-600"
              )}
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <span
              className={cn(
                "min-w-0 flex-1 font-display text-[16.5px] font-bold leading-snug tracking-[-0.015em] transition-colors duration-300 md:text-[18px]",
                dunkel ? "text-white group-hover:text-ov-200" : "text-ink-900 group-hover:text-ov-700"
              )}
            >
              {it.q}
            </span>
            <span
              aria-hidden="true"
              className={cn(
                "w21-f-knopf relative -mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ring-1 ring-inset transition-colors duration-300 group-open:bg-ov-500 group-open:text-white group-open:ring-ov-500",
                dunkel ? "bg-white/8 text-white ring-white/20 group-hover:ring-ov-300/60" : "bg-white text-ink-700 ring-ink-200 group-hover:ring-ov-300"
              )}
            >
              <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <path d="M3 8h10" />
                <path className="w21-f-senkrecht" d="M8 3v10" />
              </svg>
            </span>
          </summary>
          <div
            className={cn(
              "w21-f-antwort pb-6 pl-5 pr-5 sm:pl-[3.75rem] text-[15.5px] leading-[1.7] md:pb-7 md:pl-[4.25rem] md:pr-16 md:text-[16px]",
              dunkel ? "text-white/72" : "text-ink-600"
            )}
          >
            <div className="max-w-[64ch]">{it.a}</div>
          </div>
        </details>
      ))}
    </W21Sicht>
  );
}

/** Kurze, stabile Kennung aus den Fragen – trennt mehrere Akkordeons auf einer Seite. */
function kennung(text) {
  let h = 5381;
  for (let i = 0; i < text.length; i++) h = ((h << 5) + h + text.charCodeAt(i)) | 0;
  return (h >>> 0).toString(36);
}

const CSS = `
.w21-f-item{
  background-color:rgba(255,255,255,.42);
  box-shadow:inset 0 0 0 1px rgba(196,202,213,.55);
  transition:background-color 400ms cubic-bezier(.22,1,.36,1),box-shadow 400ms cubic-bezier(.22,1,.36,1)}
.w21-f-item:hover{background-color:rgba(255,255,255,.9)}
.w21-f-item[open]{
  background-color:#fff;
  box-shadow:0 1px 2px rgba(15,23,42,.04),0 22px 48px -26px rgba(15,23,42,.24),inset 0 0 0 1px rgba(174,208,131,.6)}
.w21-f-dunkel .w21-f-item{background-color:rgba(255,255,255,.03);box-shadow:inset 0 0 0 1px rgba(255,255,255,.1)}
.w21-f-dunkel .w21-f-item:hover{background-color:rgba(255,255,255,.06)}
.w21-f-dunkel .w21-f-item[open]{background-color:rgba(255,255,255,.07);
  box-shadow:0 30px 60px -36px rgba(0,0,0,.8),inset 0 1px 0 rgba(255,255,255,.08),inset 0 0 0 1px rgba(174,208,131,.35)}
.w21-f-item::before{
  content:"";position:absolute;left:0;top:22px;bottom:22px;width:3px;border-radius:0 3px 3px 0;
  background:linear-gradient(180deg,#aed083,#669933);
  transform:scaleY(0);transform-origin:50% 0%;transition:transform 600ms cubic-bezier(.22,1,.36,1)}
.w21-f-item[open]::before{transform:scaleY(1)}
.w21-f-senkrecht{transform-box:fill-box;transform-origin:center;transition:transform 450ms cubic-bezier(.22,1,.36,1)}
.w21-f-item[open] .w21-f-senkrecht{transform:rotate(90deg)}
.w21-f-antwort :where(p+p,p+ul,ul+p,p+ol,ol+p){margin-top:.75em}
.w21-f-antwort :where(a){color:var(--color-ov-700);text-decoration:underline;text-decoration-color:var(--color-ov-300);text-underline-offset:2px}
.w21-f-dunkel .w21-f-antwort :where(a){color:var(--color-ov-300);text-decoration-color:rgba(174,208,131,.5)}
@media (prefers-reduced-motion:no-preference){
  @supports (interpolate-size:allow-keywords){
    .w21-f{interpolate-size:allow-keywords}
    .w21-f-item::details-content{block-size:0;overflow:hidden;
      transition:block-size 480ms cubic-bezier(.22,1,.36,1),content-visibility 480ms allow-discrete}
    .w21-f-item[open]::details-content{block-size:auto}
  }
  .w21-f-item[open] .w21-f-antwort{animation:w21-f-auf 650ms cubic-bezier(.22,1,.36,1) both}
  [data-w21-an] .w21-f-item{
    transition:background-color 400ms cubic-bezier(.22,1,.36,1),box-shadow 400ms cubic-bezier(.22,1,.36,1),
      opacity 800ms cubic-bezier(.22,1,.36,1) calc(var(--w21-i) * 80ms),transform 800ms cubic-bezier(.22,1,.36,1) calc(var(--w21-i) * 80ms)}
  [data-w21-bereit] .w21-f-item{opacity:0;transform:translate3d(0,18px,0)}
}
@keyframes w21-f-auf{from{opacity:0;transform:translate3d(0,8px,0)}to{opacity:1;transform:none}}
`;
