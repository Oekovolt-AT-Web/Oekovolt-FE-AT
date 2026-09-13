"use client";

import { useState } from "react";
import { AtSign, Check, Copy, Rss } from "lucide-react";
import { cn } from "@/components/ui/cn";
import { FEDIVERSE_KONTEN, handle } from "@/lib/kanaele/fediverseKonten";
import PushOptIn from "./PushOptIn";

const FEEDS = [
  { titel: "Presse & News", href: "/presse/rss.xml" },
  { titel: "Ratgeber", href: "/ratgeber/rss.xml" },
  { titel: "Alles", href: "/rss.xml" },
];

/**
 * „Folgen & abonnieren“: Fediverse (Mastodon, Threads …), RSS, Push-Benachrichtigungen.
 * konten: Namen aus FEDIVERSE_KONTEN, die angezeigt werden
 */
export default function FolgenBox({ konten = ["oekovolt", "ratgeber"], pushThema, dunkel = false, className }) {
  const [kopiert, setKopiert] = useState("");

  const kopieren = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      /* Zwischenablage nicht verfügbar */
    }
    setKopiert(text);
    setTimeout(() => setKopiert(""), 2200);
  };

  const t = dunkel
    ? { box: "bg-navy-950 text-white", karte: "bg-white/5 ring-white/10", leise: "text-white/70", chip: "bg-white/10 text-white ring-white/15 hover:bg-white/20" }
    : { box: "bg-white text-ink-900 ring-1 ring-ink-200/70", karte: "bg-sand-50 ring-ink-200/60", leise: "text-ink-600", chip: "bg-white text-ink-800 ring-ink-200 hover:ring-ov-300" };

  return (
    <div className={cn("rounded-[1.75rem] p-6 md:p-8", t.box, className)}>
      <h2 className="font-display text-[22px] font-extrabold tracking-tight">Folgen & abonnieren</h2>
      <p className={cn("mt-2 text-[15px] leading-relaxed", t.leise)}>Ohne Algorithmus, ohne Werbung: Neuigkeiten direkt in Ihrem Feed, Reader oder als Benachrichtigung.</p>

      <div className="mt-6 space-y-3">
        {FEDIVERSE_KONTEN.filter((k) => konten.includes(k.name)).map((k) => (
          <div key={k.name} className={cn("rounded-2xl p-4 ring-1", t.karte)}>
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#6364FF] text-white">
                <AtSign aria-hidden="true" className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[15px] font-semibold">{k.titel}</p>
                <p className={cn("text-[13px] leading-snug", t.leise)}>{k.text}</p>
                <div className="mt-2.5 flex flex-wrap items-center gap-2">
                  <code className="rounded-lg bg-black/5 px-2.5 py-1 font-mono text-[13.5px] font-semibold [overflow-wrap:anywhere]">{handle(k.name)}</code>
                  <button
                    type="button"
                    onClick={() => kopieren(handle(k.name))}
                    className={cn("inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-[12.5px] font-semibold ring-1 ring-inset transition", t.chip)}
                  >
                    {kopiert === handle(k.name) ? <Check aria-hidden="true" className="h-3.5 w-3.5" /> : <Copy aria-hidden="true" className="h-3.5 w-3.5" />}
                    {kopiert === handle(k.name) ? "Kopiert" : "Kopieren"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        <p className={cn("text-[13px] leading-relaxed", t.leise)}>
          So geht&apos;s: Adresse in die Suche von <strong>Mastodon</strong>, <strong>Threads</strong> (Fediverse-Freigabe aktiv), Friendica oder Pixelfed einfügen und „Folgen“ tippen – auch von
          offiziellen Behörden- und Stadtwerke-Konten.
        </p>
      </div>

      <div className={cn("mt-6 border-t pt-6", dunkel ? "border-white/10" : "border-ink-100")}>
        <p className="flex items-center gap-2 text-[14px] font-semibold">
          <Rss aria-hidden="true" className="h-4 w-4 text-[#f26522]" />
          RSS-Feeds
        </p>
        <ul className="mt-3 flex flex-wrap gap-2">
          {FEEDS.map((f) => (
            <li key={f.href}>
              <a href={f.href} className={cn("inline-flex h-9 items-center rounded-full px-3.5 text-[13px] font-semibold ring-1 ring-inset transition", t.chip)}>
                {f.titel}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className={cn("mt-6 border-t pt-6", dunkel ? "border-white/10" : "border-ink-100")}>
        <PushOptIn thema={pushThema} dunkel={dunkel} />
      </div>
    </div>
  );
}
