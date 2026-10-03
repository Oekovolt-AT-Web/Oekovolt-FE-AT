"use client";

// src/components/Loesungen/w22-scroll.js
//
// Kleine Client-Insel für seitlich scrollbare Tabellen (Präfix w22). Die Tabelle kommt fertig vom
// Server (children). Die Hülle meldet nur per Attribut, ob es links/rechts noch etwas zu sehen gibt –
// daran hängen Kantenschatten, Schatten der fixierten ersten Spalte und der Wisch-Hinweis (CSS).

import { useEffect, useRef } from "react";

export default function W22Scroll({ children, ...rest }) {
  const ref = useRef(null);

  useEffect(() => {
    const huelle = ref.current;
    const scroller = huelle?.querySelector("[data-w22-scroller]");
    if (!huelle || !scroller) return undefined;
    let raf = 0;
    const setzen = (name, an) => (an ? huelle.setAttribute(name, "") : huelle.removeAttribute(name));
    const messen = () => {
      raf = 0;
      const max = scroller.scrollWidth - scroller.clientWidth;
      setzen("data-w22-scrollbar", max > 2);
      setzen("data-w22-links", scroller.scrollLeft > 2);
      setzen("data-w22-rechts", scroller.scrollLeft < max - 2);
    };
    const planen = () => {
      if (!raf) raf = requestAnimationFrame(messen);
    };
    messen();
    scroller.addEventListener("scroll", planen, { passive: true });
    const ro = "ResizeObserver" in window ? new ResizeObserver(planen) : null;
    ro?.observe(scroller);
    return () => {
      scroller.removeEventListener("scroll", planen);
      ro?.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={ref} {...rest}>
      {children}
    </div>
  );
}
