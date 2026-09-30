"use client";

import { useEffect, useState } from "react";
import {
  HEATMAP_MAX_KLICKS,
  HEATMAP_MAX_SEL,
  geraetFuerBreite,
  heatmapAusgenommen,
  runden05,
  runden10,
} from "@/lib/heatmap";

/**
 * Klick- und Scroll-Heatmap: kleiner Sammler ohne externe Bibliothek.
 *
 * Einwilligung: läuft NUR, wenn im Cookie-Banner „Statistik“ eingewilligt wurde (Cookie „cookieConsent“,
 * Feld statistics). Das Banner meldet jede Änderung sofort über das Ereignis „ov-consent“ (wie bei Google
 * Analytics); bei einem Widerruf wird die Erfassung sofort beendet und der laufende Seitenaufruf verworfen.
 *
 * Erfasst je Seitenaufruf (Client-Navigation = eigener Seitenaufruf):
 *   - Klicks als { sel, rx, ry }: kurzer, stabiler CSS-Selektor des angeklickten Elements (id, data-heatmap,
 *     name bei Formularfeldern, sonst Tag + :nth-of-type – nie Texte oder Werte) und die relative Position im
 *     Element (0..1, auf 0,05 gerundet); höchstens 100 Klicks.
 *   - maximale Scrolltiefe in % (auf 10 gerundet) und den Gerätetyp aus der Fensterbreite.
 * Keine Cookies, kein Browserspeicher, keine Kennungen. Gesendet wird beim Verlassen (visibilitychange/pagehide)
 * bzw. beim Seitenwechsel per navigator.sendBeacon an /api/heatmap.
 */

const ZIEL = "/api/heatmap";

/** Einwilligung „Statistik“ aus dem Cookie „cookieConsent“ (vom Cookie-Banner gesetzt). */
export function heatmapErlaubt() {
  if (typeof document === "undefined") return false;
  try {
    const roh = document.cookie.split("; ").find((c) => c.startsWith("cookieConsent="));
    if (!roh) return false;
    return JSON.parse(decodeURIComponent(roh.slice("cookieConsent=".length))).statistics === true;
  } catch {
    return false;
  }
}

/** Seiten mit Zugangscodes in der Adresse (z. B. ?token=…) nie erfassen. */
function adresseMitToken() {
  try {
    for (const k of new URLSearchParams(window.location.search).keys()) {
      if (/token|key|code|secret|sig|auth|heatmap/i.test(k)) return true;
    }
  } catch {
    /* ignorieren */
  }
  return false;
}

/* ------------------------------------------------------------------ Selektor */

const ANKER_TAGS = new Set(["header", "footer", "nav", "main", "aside"]);
const DATEN_ATTRIBUTE = ["data-heatmap", "data-testid"];
const WERT = /^[\w-]{1,40}$/;
const INTERAKTIV =
  'a,button,input,textarea,select,label,summary,[role="button"],[role="link"],[role="tab"],[role="checkbox"],[role="switch"],[role="menuitem"],[contenteditable]:not([contenteditable="false"])';

function eindeutig(sel) {
  try {
    return document.querySelectorAll(sel).length === 1;
  } catch {
    return false;
  }
}

/** Nur „sprechende“, stabile IDs – keine automatisch erzeugten (React useId, Bibliotheken, lange Ziffernfolgen). */
function stabileId(el) {
  const id = el.id;
  if (!id || id.length > 50 || !/^[A-Za-z][\w-]*$/.test(id)) return "";
  if (/\d{4,}/.test(id) || /^(radix|headlessui|react|mui|rc)-/i.test(id)) return "";
  return eindeutig(`[id="${id}"]`) ? id : "";
}

/** Ein Selektor-Schritt für ein Element: Attribut-Selektor (wenn eindeutig) oder Tag mit :nth-of-type. */
function schritt(el) {
  const tag = el.tagName.toLowerCase();
  for (const a of DATEN_ATTRIBUTE) {
    const v = el.getAttribute(a);
    if (v && WERT.test(v)) {
      const s = `${tag}[${a}="${v}"]`;
      if (eindeutig(s)) return { text: s, fertig: true };
    }
  }
  if (/^(input|select|textarea|button)$/.test(tag)) {
    const n = el.getAttribute("name");
    if (n && WERT.test(n)) {
      const s = `${tag}[name="${n}"]`;
      if (eindeutig(s)) return { text: s, fertig: true };
    }
  }
  const eltern = el.parentElement;
  if (!eltern) return { text: tag };
  const gleiche = Array.from(eltern.children).filter((c) => c.tagName === el.tagName);
  return { text: gleiche.length > 1 ? `${tag}:nth-of-type(${gleiche.indexOf(el) + 1})` : tag };
}

/** Kurzer, stabiler Selektor (max. ~6 Ebenen, max. 200 Zeichen) – ohne Texte oder Werte. */
export function selektorFuer(el) {
  const kette = [];
  let e = el;
  while (e && e !== document.body && e !== document.documentElement) {
    const id = stabileId(e);
    if (id) {
      kette.unshift(`#${id}`);
      break;
    }
    const tag = e.tagName.toLowerCase();
    if (ANKER_TAGS.has(tag) && document.getElementsByTagName(tag).length === 1) {
      kette.unshift(tag);
      break;
    }
    const s = schritt(e);
    kette.unshift(s.text);
    if (s.fertig) break;
    e = e.parentElement;
  }
  if (e === document.body) kette.unshift("body");
  if (!kette.length) return "";

  let sel = kette.join(" > ");
  if (kette.length > 6) {
    // Anker + die letzten fünf Ebenen; Zwischenebenen per Nachfahren-Kombinator überspringen
    sel = `${kette[0]} ${kette.slice(-5).join(" > ")}`;
    try {
      if (document.querySelector(sel) !== el) {
        const alt = `${kette[0]} > ${kette[1]} ${kette.slice(-4).join(" > ")}`;
        if (document.querySelector(alt) === el) sel = alt;
      }
    } catch {
      /* Fallback bleibt */
    }
  }
  // Zu lang (sehr lange IDs/Attribute): nur die letzten Ebenen behalten
  for (let n = Math.min(kette.length, 5); sel.length > HEATMAP_MAX_SEL && n > 0; n--) sel = kette.slice(-n).join(" > ");
  return sel.length <= HEATMAP_MAX_SEL ? sel : "";
}

/** Angeklicktes Element: nächstes interaktives Element, sonst das Ziel selbst (SVG-Teile → umgebendes HTML-Element). */
function zielElement(t) {
  let el = t instanceof Element ? t : t?.parentElement;
  if (!el) return null;
  el = el.closest(INTERAKTIV) || el;
  while (el && !(el instanceof HTMLElement)) el = el.parentElement;
  if (!el || el === document.body || el === document.documentElement) return null;
  if (el.closest("[data-ov-heatmap-ansicht]")) return null;
  return el;
}

/* ------------------------------------------------------------------ Seitenaufruf */

function senden(daten) {
  const body = JSON.stringify(daten);
  try {
    if (navigator.sendBeacon?.(ZIEL, new Blob([body], { type: "application/json" }))) return;
  } catch {
    /* Fallback unten */
  }
  try {
    fetch(ZIEL, { method: "POST", body, keepalive: true, credentials: "omit", headers: { "Content-Type": "application/json" } }).catch(() => {});
  } catch {
    /* Statistik darf nie stören */
  }
}

/** Startet die Erfassung für einen Seitenaufruf und liefert { beenden, verwerfen }. */
function seitenaufrufStarten(pfad) {
  const start = performance.now();
  const geraet = geraetFuerBreite(window.innerWidth);
  let klicks = [];
  let scrollMax = 0;
  let gesendet = false;
  let aktiv = true;
  let raf = 0;

  const scrollMessen = () => {
    const hoehe = Math.max(document.documentElement.scrollHeight, document.body?.scrollHeight || 0, 1);
    const tiefe = Math.min(100, ((window.scrollY + window.innerHeight) / hoehe) * 100);
    if (tiefe > scrollMax) scrollMax = tiefe;
  };
  const beiScroll = () => {
    if (raf) return;
    raf = requestAnimationFrame(() => {
      raf = 0;
      scrollMessen();
    });
  };
  const beiKlick = (ev) => {
    if (!ev.isTrusted || klicks.length >= HEATMAP_MAX_KLICKS) return;
    const el = zielElement(ev.target);
    if (!el) return;
    const sel = selektorFuer(el);
    if (!sel) return;
    // Nur Element und relative Position – nie Inhalte (auch nicht bei input/textarea/select/contenteditable)
    const r = el.getBoundingClientRect();
    const tastatur = ev.detail === 0 && ev.clientX === 0 && ev.clientY === 0;
    const rx = tastatur || r.width < 1 ? 0.5 : runden05((ev.clientX - r.left) / r.width);
    const ry = tastatur || r.height < 1 ? 0.5 : runden05((ev.clientY - r.top) / r.height);
    klicks.push({ sel, rx, ry });
  };
  // messen = false beim Seitenwechsel: dann zeigt das DOM bereits die neue Seite
  const abschicken = (messen = true) => {
    if (!aktiv) return;
    // Nach dem ersten Senden (z. B. Tab-Wechsel) nur erneut senden, wenn neue Klicks dazugekommen sind;
    // sehr kurze Aufrufe ohne Klick (z. B. doppelte Effekte im Entwicklungsmodus) nicht senden.
    if (gesendet ? !klicks.length : !klicks.length && performance.now() - start < 500) return;
    if (messen) scrollMessen();
    senden({ pfad, geraet, klicks, scroll: runden10(scrollMax) });
    gesendet = true;
    klicks = [];
  };
  const beiSichtbarkeit = () => {
    if (document.visibilityState === "hidden") abschicken();
  };

  document.addEventListener("click", beiKlick, { capture: true, passive: true });
  window.addEventListener("scroll", beiScroll, { passive: true });
  document.addEventListener("visibilitychange", beiSichtbarkeit);
  const beiVerlassen = () => abschicken();
  window.addEventListener("pagehide", beiVerlassen);
  const erstmessung = setTimeout(scrollMessen, 300); // nach dem Scrollen an den Seitenanfang bzw. zum Anker

  const abbauen = () => {
    aktiv = false;
    clearTimeout(erstmessung);
    if (raf) cancelAnimationFrame(raf);
    document.removeEventListener("click", beiKlick, { capture: true });
    window.removeEventListener("scroll", beiScroll);
    document.removeEventListener("visibilitychange", beiSichtbarkeit);
    window.removeEventListener("pagehide", beiVerlassen);
  };

  return {
    beenden() {
      if (!aktiv) return;
      abschicken(false);
      abbauen();
    },
    verwerfen() {
      klicks = [];
      abbauen();
    },
  };
}

let laufend = null; // aktueller Seitenaufruf (für den sofortigen Abbruch beim Widerruf)

/**
 * Hook für LayoutWrapper: erfasst den aktuellen Pfad, solange „Statistik“ eingewilligt ist.
 * @param {string} pfad          aktueller Pfad (usePathname)
 * @param {boolean} gesperrt     true im Heatmap-Ansichtsmodus bzw. solange dieser noch nicht geprüft ist
 */
export default function useHeatmapSammler(pfad, gesperrt) {
  const [erlaubt, setErlaubt] = useState(false);

  useEffect(() => {
    const pruefen = () => {
      const ja = heatmapErlaubt();
      if (!ja && laufend) {
        // Widerruf: sofort beenden, nichts mehr senden
        laufend.verwerfen();
        laufend = null;
      }
      setErlaubt(ja);
    };
    pruefen();
    window.addEventListener("ov-consent", pruefen);
    return () => window.removeEventListener("ov-consent", pruefen);
  }, []);

  useEffect(() => {
    if (!erlaubt || gesperrt || !pfad || heatmapAusgenommen(pfad) || adresseMitToken()) return undefined;
    const aufruf = seitenaufrufStarten(pfad);
    laufend = aufruf;
    return () => {
      aufruf.beenden(); // Seitenwechsel per Next-Router: vorherige Seite einzeln senden
      if (laufend === aufruf) laufend = null;
    };
  }, [erlaubt, gesperrt, pfad]);
}
