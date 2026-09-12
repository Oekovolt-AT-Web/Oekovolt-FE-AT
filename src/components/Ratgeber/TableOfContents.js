"use client";

import { useEffect, useState } from "react";
import { List } from "lucide-react";

/**
 * Inhaltsverzeichnis mit Scrollspy.
 *
 * Desktop: klebt in der rechten Spalte mit.
 * Mobil:   aufklappbares <details> ueber dem Artikel.
 *
 * Die Seite bindet die Komponente zweimal ein - einmal `variant="mobile"` im
 * Lesefluss, einmal `variant="desktop"` in der Sidebar. Jede Instanz rendert
 * nur ihre eigene Variante, sonst laegen zwei Navigationen gleichzeitig im DOM.
 *
 * @param {{items: {id: string, label: string}[], variant?: "mobile"|"desktop"}} props
 */
export default function TableOfContents({ items, variant = "desktop" }) {
  const [aktiv, setAktiv] = useState(items[0]?.id ?? "");

  useEffect(() => {
    const ueberschriften = items
      .map((i) => document.getElementById(i.id))
      .filter(Boolean);

    if (ueberschriften.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Die oberste sichtbare Ueberschrift gewinnt.
        const sichtbar = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (sichtbar[0]) setAktiv(sichtbar[0].target.id);
      },
      // Fenster auf das obere Drittel begrenzen, damit der aktive Eintrag
      // mitwandert statt erst am Seitenende umzuspringen.
      { rootMargin: "-80px 0px -70% 0px", threshold: 0 }
    );

    ueberschriften.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [items]);

  const liste = (
    <ul className="space-y-1">
      {items.map((item) => {
        const ist = aktiv === item.id;
        return (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              aria-current={ist ? "location" : undefined}
              className={`block border-l-2 py-1.5 pl-3 text-[14px] leading-snug transition-colors ${
                ist
                  ? "border-[#669933] font-semibold text-[#669933]"
                  : "border-gray-200 text-gray-600 hover:border-gray-400 hover:text-gray-900"
              }`}
            >
              {item.label}
            </a>
          </li>
        );
      })}
    </ul>
  );

  if (variant === "mobile") {
    return (
      <details className="mb-8 rounded-xl border border-gray-200 bg-white p-4 shadow-sm lg:hidden">
        <summary className="flex cursor-pointer items-center gap-2 text-[15px] font-semibold text-gray-900 marker:content-['']">
          <List aria-hidden="true" className="h-4 w-4 text-[#669933]" />
          Inhaltsverzeichnis
        </summary>
        <div className="mt-4">{liste}</div>
      </details>
    );
  }

  return (
    <nav aria-label="Inhaltsverzeichnis" className="sticky top-28">
      <p className="mb-3 flex items-center gap-2 text-[13px] font-semibold uppercase tracking-wide text-gray-900">
        <List aria-hidden="true" className="h-4 w-4 text-[#669933]" />
        Inhalt
      </p>
      {liste}
    </nav>
  );
}
