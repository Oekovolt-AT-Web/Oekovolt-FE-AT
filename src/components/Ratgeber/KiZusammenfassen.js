import { Sparkles } from "lucide-react";
import { cn } from "@/components/ui/cn";

/**
 * „Mit KI zusammenfassen": öffnet den Artikel mit vorformuliertem Prompt in
 * gängigen KI-Assistenten. Reine Links – keine Daten an Dritte ohne Klick.
 */
const ASSISTENTEN = [
  { name: "ChatGPT", link: (q) => `https://chatgpt.com/?hints=search&q=${q}` },
  { name: "Perplexity", link: (q) => `https://www.perplexity.ai/search/new?q=${q}` },
  { name: "Claude", link: (q) => `https://claude.ai/new?q=${q}` },
  { name: "Google KI-Modus", link: (q) => `https://www.google.com/search?udm=50&q=${q}` },
  { name: "Grok", link: (q) => `https://grok.com/?q=${q}` },
];

export default function KiZusammenfassen({ url, titel, art = "Ratgeber-Artikel", className }) {
  const prompt = encodeURIComponent(
    `Fasse den ${art} „${titel}" von Ökovolt Österreich (Photovoltaik-Fachbetrieb aus Ostermiething) verständlich zusammen: die wichtigsten Punkte, Zahlen und konkrete Tipps. Artikel: ${url}`
  );

  return (
    <div className={cn("flex flex-wrap items-center gap-x-3 gap-y-2.5", className)}>
      <p className="mr-1 inline-flex items-center gap-1.5 text-[13px] font-semibold uppercase tracking-[0.14em] text-ink-500">
        <Sparkles aria-hidden="true" className="h-4 w-4 text-ov-600" />
        Mit KI zusammenfassen
      </p>
      <ul className="flex flex-wrap gap-2">
        {ASSISTENTEN.map((a) => (
          <li key={a.name}>
            <a
              href={a.link(prompt)}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="inline-flex h-9 items-center rounded-full bg-white px-3.5 text-[13.5px] font-semibold text-ink-800 ring-1 ring-inset ring-ink-200 transition hover:bg-navy-950 hover:text-white hover:ring-navy-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ov-500"
            >
              {a.name}
              <span className="sr-only"> (öffnet in neuem Tab)</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
