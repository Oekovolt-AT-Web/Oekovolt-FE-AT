"use client";

import { filterSetzen } from "./filterEvent";

/**
 * Link auf einen Themenbereich der Ratgeber-Übersicht. Ohne JavaScript ein
 * normaler Link (?thema=…#alle-artikel), mit JavaScript setzt er den Filter
 * direkt und scrollt weich zum Katalog.
 */
export default function ThemaLink({ thema, href, className, children, ...rest }) {
  return (
    <a
      href={href}
      className={className}
      onClick={(e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
        if (!document.getElementById("alle-artikel")) return;
        e.preventDefault();
        filterSetzen({ thema, q: "" });
      }}
      {...rest}
    >
      {children}
    </a>
  );
}
