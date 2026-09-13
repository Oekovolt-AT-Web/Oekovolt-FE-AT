import { cn } from "@/components/ui/cn";

/**
 * Redaktionellen HTML-Text aus dem Backoffice (Quill-Editor) sauber darstellen.
 *
 * Der Editor liefert Inline-Styles (feste Schriftgrößen), leere Absätze,
 * Cursor-Marker und Aufzählungen als <ol><li data-list="bullet">. Das wird hier
 * serverseitig bereinigt, damit der Text die Typografie des Design-Systems
 * (`ov-prose`) übernimmt. Fett gesetzte Absätze, die allein stehen, werden zu
 * Zwischenüberschriften (h3), damit die Gliederung auch semantisch stimmt.
 *
 * korrekturen: [[suchen, ersetzen]] – fachliche Korrekturen am CMS-Text, bis
 * die Redaktion den Eintrag im Backoffice angepasst hat.
 */
export function bereinigeCmsHtml(html = "", korrekturen = []) {
  if (!html) return "";
  let s = String(html)
    .replace(/<div class="ql-editor[^"]*">/g, "")
    .replace(/<\/div>\s*$/g, "")
    .replace(/<span class="ql-ui"[^>]*><\/span>/g, "")
    .replace(/<span class="ql-cursor">[\s\S]*?<\/span>/g, "")
    .replace(/\s(style|contenteditable|class|data-list)="[^"]*"/g, "")
    .replace(/<span>([\s\S]*?)<\/span>/g, "$1")
    .replace(/﻿/g, "")
    .replace(/<p>\s*(<br\s*\/?>)?\s*<\/p>/g, "")
    // Quill-Aufzählungen: <ol> mit bullet-Einträgen sind in Wahrheit <ul>
    .replace(/<ol>/g, "<ul>")
    .replace(/<\/ol>/g, "</ul>")
    // Allein stehende fette Absätze -> Zwischenüberschrift
    .replace(/<p>\s*<strong>([^<]{3,140})<\/strong>\s*<\/p>/g, "<h3>$1</h3>")
    // Absätze, die nur mit einem Doppelpunkt enden, als Einleitung hervorheben
    .replace(/<p>\s*([^<]{3,60}:)\s*<\/p>/g, "<p><strong>$1</strong></p>");
  for (const [suchen, ersetzen] of korrekturen) s = s.split(suchen).join(ersetzen);
  return s.trim();
}

export default function CmsProse({ html, korrekturen, className }) {
  const sauber = bereinigeCmsHtml(html, korrekturen);
  if (!sauber) return null;
  return (
    <div
      className={cn(
        "ov-prose max-w-none [&_h3]:font-display [&_h3]:text-[1.35rem] [&_h3]:font-extrabold [&_h3]:tracking-tight [&_li]:mt-1.5 [&_li]:pl-1 [&_ul]:marker:text-ov-500 [&_em]:text-ink-500",
        className
      )}
      dangerouslySetInnerHTML={{ __html: sauber }}
    />
  );
}
