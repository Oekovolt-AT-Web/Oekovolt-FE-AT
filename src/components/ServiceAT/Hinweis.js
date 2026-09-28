import { AlertTriangle, Info, Scale } from "lucide-react";
import { cn } from "@/components/ui/cn";
import Reveal from "@/components/ui/Reveal";

const TOENE = {
  info: { icon: Info, box: "bg-ov-50 ring-ov-200/80", icon_: "bg-ov-600 text-white" },
  recht: { icon: Scale, box: "bg-sand-50 ring-ink-200/80", icon_: "bg-navy-700 text-white" },
  achtung: { icon: AlertTriangle, box: "bg-sun-300/15 ring-sun-400/50", icon_: "bg-sun-400 text-navy-950" },
};

/**
 * Hervorgehobener Hinweis (fachlicher Kasten, Rechtshinweis, Warnung).
 * ton: info | recht | achtung
 */
export default function Hinweis({ ton = "info", titel, children, className }) {
  const t = TOENE[ton] || TOENE.info;
  const Icon = t.icon;
  return (
    <Reveal className={cn("flex gap-4 rounded-3xl p-5 ring-1 md:p-6", t.box, className)}>
      <span className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl", t.icon_)}>
        <Icon aria-hidden="true" className="h-5 w-5" />
      </span>
      <div className="min-w-0 text-[15px] leading-relaxed text-ink-700">
        {titel && <p className="font-display text-[16.5px] font-bold text-ink-900">{titel}</p>}
        <div className={titel ? "mt-1.5 space-y-2" : "space-y-2"}>{children}</div>
      </div>
    </Reveal>
  );
}
