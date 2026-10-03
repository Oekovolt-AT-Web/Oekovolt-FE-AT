// src/components/Startseite/s10-akkordeon.js
//
// FAQ-Akkordeon der Startseite (Server-Komponente, ohne JavaScript bedienbar).
// Native <details name="…">: es ist immer nur eine Antwort offen (Browser ohne Unterstützung öffnen
// einfach mehrere). Antworten stehen vollständig im HTML (SEO) und liefern das FAQPage-Schema.
//
// Interaktion: offene Frage hebt sich als weiße Karte ab (Lichtkante links, Nummer grün), das Plus
// zeichnet sich zum Minus, die Antwort gleitet auf (::details-content, wo unterstützt) und blendet ein.

export default function S10Akkordeon({ items = [], name = "s10-faq", schema = true }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((it) => ({
      "@type": "Question",
      name: it.q,
      acceptedAnswer: { "@type": "Answer", text: it.aText || (typeof it.a === "string" ? it.a : "") },
    })),
  };

  return (
    <div className="s10-f-liste flex flex-col gap-3">
      {schema && items.length > 0 && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      )}
      {items.map((it, i) => (
        <details key={it.q} name={name} open={i === 0} className="s10-f-item group relative rounded-[1.4rem]" style={{ "--s10-i": i }}>
          <summary className="relative flex min-h-11 cursor-pointer list-none items-start gap-4 rounded-[1.4rem] px-5 py-5 outline-none focus-visible:ring-2 focus-visible:ring-ov-500 focus-visible:ring-offset-2 focus-visible:ring-offset-sand-50 md:gap-6 md:px-7 md:py-6 [&::-webkit-details-marker]:hidden">
            <span className="s10-f-nr ov-num mt-[3px] w-6 shrink-0 font-display text-[13px] font-bold tracking-[0.04em] text-ink-400 transition-colors duration-300 group-open:text-ov-600 md:mt-[4px]">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="flex-1 font-display text-[17px] font-bold leading-snug tracking-[-0.015em] text-ink-900 transition-colors duration-300 group-hover:text-ov-700 md:text-[19px]">
              {it.q}
            </span>
            <span
              aria-hidden="true"
              className="s10-f-knopf relative -mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-ink-700 ring-1 ring-inset ring-ink-200 transition-colors duration-300 group-hover:ring-ov-300 group-open:bg-ov-500 group-open:text-white group-open:ring-ov-500"
            >
              <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <path d="M3 8h10" />
                <path className="s10-f-senkrecht" d="M8 3v10" />
              </svg>
            </span>
          </summary>
          <div className="s10-f-antwort pb-6 pl-[3.75rem] pr-5 text-[15.5px] leading-[1.7] text-ink-600 md:pb-8 md:pl-[4.75rem] md:pr-20 md:text-[16px]">
            <p className="max-w-[62ch]">{it.a}</p>
          </div>
        </details>
      ))}
    </div>
  );
}
