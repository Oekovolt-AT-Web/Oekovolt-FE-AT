"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { setCookie, getCookie } from "cookies-next";
import CookieDetails from "./coookieItem";
import Link from "next/link";
import useFokusFalle from "@/components/ui/useFokusFalle";
import { FIRMA } from "@/lib/site";


// cookieData.js
export const cookieServices = {
  functional: {
    googleMaps: {
      title: "Google Maps",
      description: "Ermöglicht das Einbetten interaktiver Karten auf unserer Website.",
      purpose:
        "Google Maps ermöglicht das Einbetten von Karten direkt in Websites zur Verbesserung der Website. Dies erfordert die Verarbeitung der IP-Adresse und Metadaten des Nutzers. Cookies oder cookie-ähnliche Technologien können gespeichert und gelesen werden. Diese können personenbezogene Daten und technische Daten wie Benutzer-ID, Zustimmung, Einstellungen des Kartenbetrachters und Sicherheitstokens enthalten. Diese Daten können verwendet werden, um besuchte Websites zu erfassen, detaillierte Statistiken über das Nutzerverhalten zu erstellen und die Dienste von Google zu verbessern. Diese Daten können von Google mit den Daten von Nutzern verknüpft werden, die auf den Websites von Google eingeloggt sind (z.B. google.com und youtube.com). Google gibt personenbezogene Informationen an verbundene Unternehmen und andere vertrauenswürdige Unternehmen oder Personen weiter, um diese für sie zu verarbeiten, basierend auf den Anweisungen von Google und in Übereinstimmung mit der Datenschutzrichtlinie von Google.",
      provider: "Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irland",
      contact: {
        phone: "+1 650 253 0000",
        email: "dpo-google@google.com",
        privacy: "https://policies.google.com/privacy",
      },
      cookies: [
        { name: "NID", type: "HTTP Cookie", duration: "6 Monate" },
        { name: "__Secure-3PSIDCC", type: "HTTP Cookie", duration: "1 Jahr" },
        { name: "__Secure-1PSIDCC", type: "HTTP Cookie", duration: "1 Jahr" },
        { name: "SIDCC", type: "HTTP Cookie", duration: "1 Jahr" },
        { name: "__Secure-3PAPISID", type: "HTTP Cookie", duration: "13 Monate" },
        { name: "SSID", type: "HTTP Cookie", duration: "13 Monate" },
        { name: "__Secure-1PAPISID", type: "HTTP Cookie", duration: "13 Monate" },
        { name: "__Secure-3PSID", type: "HTTP Cookie", duration: "13 Monate" },
        { name: "__Secure-1PSID", type: "HTTP Cookie", duration: "13 Monate" },
        { name: "SID", type: "HTTP Cookie", duration: "13 Monate" },
        { name: "SAPISID", type: "HTTP Cookie", duration: "13 Monate" },
        { name: "APISID", type: "HTTP Cookie", duration: "13 Monate" },
        { name: "CONSENT", type: "HTTP Cookie", duration: "13 Monate" },
        { name: "__Secure-ENID", type: "HTTP Cookie", duration: "13 Monate" },
        { name: "_c;;i", type: "Local Storage", duration: "Kein Ablauf" },
        { name: "LH;;s-*", type: "Local Storage", duration: "Kein Ablauf" },
        { name: "sb_wiz.zpc.gws-wiz.", type: "Local Storage", duration: "Kein Ablauf" },
        { name: "sb_wiz.ueh", type: "Local Storage", duration: "Kein Ablauf" },
      ],
      dataProcessing: {
        countries: [
          { name: "Vereinigte Staaten", sub: "A" },
          { name: "Australien" },
          { name: "Brasilien" },
          { name: "Kanada", sub: "A" },
          { name: "Chile" },
          { name: "Hong Kong" },
          { name: "Indien" },
          { name: "Indonesien" },
          { name: "Israel", sub: "A" },
          { name: "Japan", sub: "A" },
          { name: "Korea", sub: "A" },
          { name: "Katar" },
          { name: "Singapur" },
          { name: "Schweiz", sub: "A" },
          { name: "Taiwan" },
          { name: "Vereinigtes Königreich", sub: "A" },
        ],
        mechanisms: [{ name: "Angemessenheitsbeschluss", sub: "A" }],
      },
    },
  },
  statistics: {
    googleAnalytics: {
      title: "Google Analytics",
      description: "Erstellt Statistiken darüber, wie unsere Website genutzt wird.",
      purpose:
        "Google Analytics 4 erfasst, welche Seiten aufgerufen werden, wie lange Besucher bleiben, über welche Quelle (z. B. Suchmaschine oder Kampagne) sie kommen sowie Gerät, Browser und ungefähren Standort (Land/Region). Außerdem zählen wir Aktionen wie gesendete Formulare. Wir nutzen die Daten ausschließlich, um unsere Website zu verbessern – ohne Werbefunktionen, ohne Google Signals und ohne Personalisierung. Google speichert keine IP-Adressen in Analytics.",
      provider: "Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irland",
      contact: {
        phone: "+353 1 543 1000",
        email: "dpo-google@google.com",
        privacy: "https://policies.google.com/privacy",
      },
      cookies: [
        { name: "_ga", type: "HTTP Cookie", duration: "2 Jahre" },
        { name: "_ga_*", type: "HTTP Cookie", duration: "2 Jahre" },
      ],
      dataProcessing: {
        countries: [{ name: "Vereinigte Staaten", sub: "A" }],
        mechanisms: [{ name: "Angemessenheitsbeschluss (EU-US Data Privacy Framework)", sub: "A" }],
      },
    },
    // Eigene Klick- und Scroll-Heatmap (src/components/Statistik/HeatmapSammler.js) – Teil der Kategorie „Statistik“,
    // ohne eigenen Schalter: Sie läuft genau dann, wenn „Statistik“ eingewilligt ist.
    heatmap: {
      title: "Klick- und Scroll-Heatmap (Ökovolt)",
      description: "Zeigt uns zusammengefasst, welche Elemente angeklickt werden und wie weit Besucher scrollen.",
      purpose:
        "Unser eigenes Skript erfasst je Seitenaufruf die Seite (ohne URL-Parameter), den Gerätetyp (Smartphone, Tablet, Desktop), welche Elemente angeklickt werden samt ungefährer Position im Element und die maximale Scrolltiefe. Eingaben, Formularinhalte und Texte werden nicht erfasst, die IP-Adresse wird nicht gespeichert. Die Daten werden in unserem eigenen Backoffice nur als monatliche Zählwerte gespeichert und nach 14 Monaten gelöscht. Keine Cookies, kein Browserspeicher, keine Weitergabe an Dritte.",
      provider: `${FIRMA.name}, ${FIRMA.strasse}, ${FIRMA.plz} ${FIRMA.ort}, ${FIRMA.land}`,
      contact: {
        phone: FIRMA.telefon,
        email: FIRMA.email,
        privacy: "/datenschutz#heatmap",
      },
      dataProcessing: {
        countries: [{ name: "keine – Verarbeitung nur im Europäischen Wirtschaftsraum" }],
        mechanisms: [{ name: " nicht erforderlich" }],
      },
    },
  },
};

const OHNE = { essential: true, functional: false, googleMaps: false, statistics: false, googleAnalytics: false };

/** id des Stil-Elements, das die Hülle sichtbar macht (vom Inline-Skript in <head> eingefügt). */
export const COOKIE_OFFEN_STIL_ID = "ov-cookie-offen";
/** Klasse auf <html>, solange der Banner über „Privatsphäre-Einstellungen“ (Footer) offen ist. */
const ZWANG_KLASSE = "ov-cookie-zwang-aktiv";

// Regeln, solange keine Auswahl gespeichert ist: Hülle zeigen und fokussierte Elemente bzw.
// Sprungziele über dem Banner halten (WCAG 2.4.11). Mobil ist die Leiste ca. 96 px hoch,
// ab md eine Karte rechts unten (ca. 180–200 px hoch, 20 px Abstand).
const OFFEN_CSS =
  "html .ov-cookie-huelle{display:block}" +
  "html{scroll-padding-bottom:calc(8rem + env(safe-area-inset-bottom,0px))}" +
  ":where(a,button,input,select,textarea,summary,[tabindex]){scroll-margin-bottom:8rem}" +
  "@media(min-width:768px){html{scroll-padding-bottom:14rem}:where(a,button,input,select,textarea,summary,[tabindex]){scroll-margin-bottom:14rem}}";

/**
 * Entscheidet vor dem ersten Paint, ob die Hülle sichtbar ist: ohne gespeicherte Auswahl (Cookie
 * „cookieConsent“) hängt es ein <style id="ov-cookie-offen"> an <head>, das die serverseitig
 * gerenderte Hülle einblendet. Bewusst KEINE Klasse auf <html>: <html> rendert React (layout.js),
 * eine fremde Klasse dort löst eine Hydration-Warnung aus; zusätzliche Knoten im <head> toleriert
 * React. Der Render-Zweig ist auf Server und Client gleich (kein Hydration-Mismatch).
 * Für den <head> in src/app/layout.js als <script dangerouslySetInnerHTML={{ __html: COOKIE_KOPF_SKRIPT }} />
 * gedacht; bis dahin steht es unmittelbar vor der Hülle im <body> (läuft dort ebenfalls, bevor die
 * Hülle gezeichnet wird).
 */
export const COOKIE_KOPF_SKRIPT = `(function(){try{if(/(?:^|;\\s*)cookieConsent=/.test(document.cookie)||document.getElementById("${COOKIE_OFFEN_STIL_ID}"))return;var s=document.createElement("style");s.id="${COOKIE_OFFEN_STIL_ID}";s.textContent=${JSON.stringify(OFFEN_CSS)};document.head.appendChild(s)}catch(e){}})();`;

/**
 * Cookie-Banner.
 *
 * - Standard (LayoutWrapper): schlanke Hülle mit Text und Knöpfen, serverseitig gerendert und als
 *   Client-Insel hydriert. Ob sie sichtbar ist, entscheidet COOKIE_KOPF_SKRIPT (Stil-Element im <head>).
 *   Kein dynamic(…, { ssr: false }) mehr – der spät eingeblendete Banner war das LCP-Element.
 * - forceShow (Footer „Privatsphäre-Einstellungen“, dynamischer Import in footer.js): sofort sichtbar,
 *   blendet eine evtl. zugleich sichtbare Standard-Hülle aus; onClose wird nach jeder Entscheidung gerufen.
 * - Vor einer Einwilligung lädt kein Statistik- oder Marketing-Skript (GoogleAnalytics/HeatmapSammler
 *   lesen das Cookie bzw. das Ereignis „ov-consent“).
 */
export default function CookieBanner({ forceShow = false, onClose }) {
  const router = useRouter();
  const [isShown, setIsShown] = useState(false);
  const [isCompact, setIsCompact] = useState(true);
  const [erledigt, setErledigt] = useState(false);

  const [expandedSections, setExpandedSections] = useState({
    functional: false,
    statistics: false,
  });
  const [expandedServices, setExpandedServices] = useState({});
  const [consent, setConsent] = useState(OHNE);

  useEffect(() => {
    const gespeichert = getCookie("cookieConsent");
    if (!gespeichert) return;
    // Beim erneuten Öffnen die bisherige Auswahl anzeigen
    try {
      setConsent({ ...OHNE, ...JSON.parse(gespeichert), essential: true });
    } catch {
      /* ungültig -> Standard */
    }
  }, []);

  // Über den Footer geöffnet: die Standard-Hülle (falls ebenfalls sichtbar) ausblenden
  useEffect(() => {
    if (!forceShow) return undefined;
    const html = document.documentElement;
    html.classList.add(ZWANG_KLASSE);
    return () => html.classList.remove(ZWANG_KLASSE);
  }, [forceShow]);

  useEffect(() => {
    setConsent((prev) => ({ ...prev, functional: prev.googleMaps, statistics: prev.googleAnalytics }));
  }, [consent.googleMaps, consent.googleAnalytics]);

  const handleAcceptAll = () => {
    const newConsent = { essential: true, functional: true, googleMaps: true, statistics: true, googleAnalytics: true };
    setConsent(newConsent);
    saveConsent(newConsent);
    router.refresh();
  };

  const handleAcceptSelected = () => {
    saveConsent(consent);
    router.refresh();
  };

  const handleRejectAll = () => {
    const newConsent = OHNE;
    setConsent(newConsent);
    saveConsent(newConsent);
    router.refresh();
  };

  const saveConsent = (consentState) => {
    setCookie("cookieConsent", JSON.stringify(consentState), {
      maxAge: 60 * 60 * 24 * 365,
      path: "/",
      sameSite: "lax",
    });
    // Google Analytics sofort (ohne Neuladen) starten bzw. stoppen
    window.dispatchEvent(new CustomEvent("ov-consent", { detail: consentState }));

    // Hülle schließen: Sichtbarkeits-Stil entfernen und Insel abbauen
    document.getElementById(COOKIE_OFFEN_STIL_ID)?.remove();
    setIsCompact(true);
    setErledigt(true);
    if (onClose) onClose();
  };

  const toggleConsent = (category) => {
    setConsent((prev) => {
      const newConsent = { ...prev };

      if (category === "functional") {
        const newValue = !prev.functional;
        newConsent.functional = newValue;
        newConsent.googleMaps = newValue;
      } else if (category === "statistics") {
        const newValue = !prev.statistics;
        newConsent.statistics = newValue;
        newConsent.googleAnalytics = newValue;
      } else {
        newConsent[category] = !prev[category];
      }

      return newConsent;
    });
  };

  const toggleCategoryDetails = (category) => {
    setExpandedSections((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const toggleServiceDetails = (service) => {
    setExpandedServices((prev) => ({
      ...prev,
      [service]: !prev[service],
    }));
  };

  const toggleCompact = () => {
    setIsCompact(!isCompact);
    setIsShown(true);
  };

  // Tastatur & Screenreader: Detailansicht ist ein modaler Dialog
  const kompaktTitel = useRef(null);
  const individuellKnopf = useRef(null);
  const detailDialog = useRef(null);
  const detailTitel = useRef(null);
  useFokusFalle(!erledigt && !isCompact, detailDialog, {
    beiEscape: () => setIsCompact(true),
    startRef: detailTitel,
    rueckgabeRef: individuellKnopf,
  });

  // Über „Privatsphäre-Einstellungen“ geöffnet: Fokus direkt in den Banner
  useEffect(() => {
    if (forceShow) kompaktTitel.current?.focus({ preventScroll: true });
  }, [forceShow]);

  if (erledigt) return null;

  return (
    <>
      {/* Vor der Hülle: setzt die Sichtbarkeits-Klasse, bevor die Hülle gezeichnet wird (nur Standard-Hülle) */}
      {!forceShow && <script dangerouslySetInnerHTML={{ __html: COOKIE_KOPF_SKRIPT }} />}
      {/*
        Mobil (< md): flache Leiste am unteren Rand, gesamt ca. 96 px (2 Textzeilen mit Links + Knopfzeile h-9),
        damit sie auch bei 390 × 664 (iPhone 14) keinen Hero-CTA überdeckt (auch nicht den Zweit-CTA).
        Ab md: Karte rechts unten (340 px, ab xl 420 px) statt mittig über der linken Textspalte des Seitenkopfs.
      */}
      <div
        role="region"
        aria-label="Cookie-Einstellungen"
        hidden={!isCompact ? true : undefined}
        className={`ov-cookie-huelle fixed inset-x-0 bottom-0 z-[9600] md:inset-x-auto md:bottom-5 md:right-5 md:w-[calc(100%-2.5rem)] md:max-w-[340px] xl:max-w-[420px] ${forceShow ? "ov-cookie-zwang" : ""}`}
      >
        <div className="rounded-t-2xl bg-white px-3 pb-[calc(0.375rem+env(safe-area-inset-bottom,0px))] pt-1.5 shadow-[0_-12px_40px_-16px_rgba(3,18,43,0.45)] ring-1 ring-ink-200/80 md:rounded-[1.75rem] md:p-4 xl:p-5 md:shadow-[0_24px_60px_-18px_rgba(3,18,43,0.45)]">
          <p className="text-[12px] leading-[18px] text-ink-700 md:text-[12.5px] md:leading-[1.45] xl:text-[13px]">
            <strong ref={kompaktTitel} tabIndex={-1} className="font-display font-bold text-ink-900 focus:outline-none">
              <span className="md:hidden">Privatsphäre:</span>
              <span className="hidden md:inline">Ihre Privatsphäre:</span>
            </strong>{" "}
            <span className="md:hidden">Google Analytics, Heatmap &amp; Maps nur mit Zustimmung.</span>
            <span className="hidden md:inline">
              Mit Ihrer Zustimmung nutzen wir Google Analytics, unsere Klick-Heatmap und Google Maps. Ohne Zustimmung gehen
              keine Daten an Google; jederzeit widerrufbar über die Privatsphäre-Einstellungen.
            </span>{" "}
            {/* Textlinks mit mind. 24 px hoher Trefferfläche (WCAG 2.5.8) */}
            <span className="text-ink-600 md:mt-1 md:block">
              <button
                ref={individuellKnopf}
                type="button"
                onClick={toggleCompact}
                aria-haspopup="dialog"
                className="inline-block cursor-pointer py-[3px] font-semibold text-ink-800 underline underline-offset-2 hover:text-ink-900 md:py-1"
              >
                Einstellungen
              </button>
              {" · "}
              <Link href="/datenschutz" className="inline-block py-[3px] underline underline-offset-2 hover:text-ink-900 md:py-1">
                <span className="md:hidden">Datenschutz</span>
                <span className="hidden md:inline">Datenschutzerklärung</span>
              </Link>
              {" · "}
              <Link href="/impressum" className="inline-block py-[3px] underline underline-offset-2 hover:text-ink-900 md:py-1">
                Impressum
              </Link>
            </span>
          </p>
          <div className="mt-1 grid grid-cols-2 gap-2 md:mt-3">
            <button
              type="button"
              onClick={handleRejectAll}
              className="h-9 cursor-pointer rounded-full bg-navy-950 px-3 text-[13.5px] font-semibold text-white ring-1 ring-navy-950 ring-offset-2 transition-colors hover:bg-navy-800 md:h-11 md:text-[14px]"
            >
              Nur notwendige
            </button>
            <button
              type="button"
              onClick={handleAcceptAll}
              className="h-9 cursor-pointer rounded-full bg-navy-950 px-3 text-[13.5px] font-semibold text-white ring-1 ring-navy-950 ring-offset-2 transition-colors hover:bg-navy-800 md:h-11 md:text-[14px]"
            >
              Alle akzeptieren
            </button>
          </div>
        </div>
      </div>

      {!isCompact && (
        <>
          <div className="fixed inset-0 z-[9690] bg-navy-950/50 backdrop-blur-sm" />
          <div className="pointer-events-none fixed inset-0 z-[9700] flex items-center justify-center">
            <div
              ref={detailDialog}
              role="dialog"
              aria-modal="true"
              aria-labelledby="ov-cookie-detail-titel"
              tabIndex={-1}
              className="pointer-events-auto relative flex h-full max-h-[100dvh] flex-col overflow-hidden overflow-y-auto bg-white shadow-2xl focus:outline-none lg:h-auto lg:max-h-[80vh] lg:max-w-[800px] lg:rounded-[2rem]"
            >
              <h2 ref={detailTitel} id="ov-cookie-detail-titel" tabIndex={-1} className="sticky top-0 z-10 bg-white p-6 pb-4 font-display text-2xl font-bold text-ink-900 focus:outline-none md:relative">
                Individuelle Privatsphäre-Präferenzen
              </h2>
              <div className="relative flex flex-col-reverse items-start justify-between border-b border-ink-200 p-6 md:flex-row">
                <div className="w-[100%] flex-1 md:w-[60%]">
                  <p className="text-sm text-ink-600">
                    Wir verwenden Cookies und ähnliche Technologien auf unserer Website und verarbeiten personenbezogene
                    Daten über Sie, wie Ihre IP-Adresse. Nur mit Ihrer Einwilligung (§ 165 Abs. 3 TKG 2021, Art. 6 Abs. 1 lit. a
                    DSGVO) werden Google Analytics, unsere Klick- und Scroll-Heatmap und Inhalte von Drittanbietern (Google Maps)
                    geladen bzw. aktiviert. Technisch notwendige
                    Speicherungen – etwa Ihre Auswahl in diesem Dialog – erfolgen ohne Einwilligung. Sie können Ihre Einwilligung
                    jederzeit über „Privatsphäre-Einstellungen“ im Seitenfuß ändern oder mit Wirkung für die Zukunft widerrufen.
                    Nachfolgend finden Sie eine Übersicht über alle Services, die von dieser Website genutzt werden. Sie
                    können detaillierte Informationen zu jedem Service einsehen und diesen einzeln zustimmen oder von Ihrem
                    Widerspruchsrecht Gebrauch machen.
                  </p>
                </div>
                <div className="mb-4 flex w-[100%] flex-col space-y-3 md:ml-4 md:w-[40%]">
                  <button
                    type="button"
                    onClick={handleAcceptAll}
                    className="cursor-pointer whitespace-nowrap rounded-full bg-navy-950 px-4 py-2.5 text-sm font-semibold text-white ring-1 ring-navy-950 ring-offset-2 transition-colors hover:bg-navy-800"
                  >
                    Alle akzeptieren
                  </button>
                  <button
                    type="button"
                    onClick={handleRejectAll}
                    className="cursor-pointer whitespace-nowrap rounded-full bg-navy-950 px-4 py-2.5 text-sm font-semibold text-white ring-1 ring-navy-950 ring-offset-2 transition-colors hover:bg-navy-800"
                  >
                    Alle ablehnen
                  </button>
                  <button
                    type="button"
                    onClick={handleAcceptSelected}
                    className="cursor-pointer whitespace-nowrap rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-ink-800 ring-1 ring-inset ring-ink-300 transition-colors hover:bg-ink-50"
                  >
                    Auswahl speichern
                  </button>
                </div>
              </div>
              <p className="mt-1 p-6 pb-2 text-xs text-ink-600">
                Google Analytics und Google Maps können personenbezogene Daten auch in Drittländern (u. a. USA) verarbeiten. Für
                die USA stützt sich die Übermittlung auf den Angemessenheitsbeschluss der EU-Kommission zum EU-US Data Privacy
                Framework (Art. 45 DSGVO). Ein Zugriff von Behörden des Drittlands auf die Daten kann dennoch nicht vollständig
                ausgeschlossen werden. Einzelheiten finden Sie in unserer Datenschutzerklärung.
              </p>
              <div className="mt-3">
                <button
                  type="button"
                  className={`w-full cursor-pointer border-0 bg-transparent pb-4 text-center text-sm font-medium text-ov-700 underline-offset-2 hover:underline md:hidden ${isShown ? "hidden" : ""}`}
                  onClick={() => setIsShown(!isShown)}
                  aria-expanded={isShown}
                >
                  Individuelle Privatsphäre-Präferenzen
                </button>
              </div>

              <div className={`flex-1 space-y-6 p-6 ${isShown ? "block" : "hidden"} md:block`}>
                {/* Essenzielle Cookies */}
                <div className="space-y-2 rounded-2xl border border-ink-200 p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <label htmlFor="essential-cookies" className="flex cursor-pointer items-center space-x-3">
                        <input type="checkbox" id="essential-cookies" checked={consent.essential} disabled className="h-5 w-5 cursor-pointer rounded border-ink-300 accent-ov-600" />
                        <span className="font-medium text-ink-900">Essenziell</span>
                      </label>
                    </div>
                  </div>
                  <p className="ml-8 text-sm text-ink-600">
                    Essenzielle Dienste sind für die grundlegende Funktionalität der Website erforderlich. Sie enthalten nur
                    technisch notwendige Services. Diese Dienste können nicht abgelehnt werden.
                  </p>
                  <ul className="ml-8 list-disc space-y-1 pl-4 text-sm text-ink-600">
                    <li>
                      <strong className="font-medium text-ink-800">Ihre Auswahl in diesem Dialog</strong> (Cookie „cookieConsent“, 1 Jahr).
                    </li>
                    <li>
                      <strong className="font-medium text-ink-800">Freischaltung von Auswertungen und Downloads</strong> (Cookie
                      „ov-lead-frei“, signiert, 30 Tage): wird erst gesetzt, nachdem Sie Ihre E-Mail-Adresse für eine angeforderte
                      Auswertung bestätigt haben, und dient nur dazu, Ihnen diese bereitzustellen (Art. 6 Abs. 1 lit. b DSGVO).
                    </li>
                  </ul>
                </div>

                {/* Funktionale Cookies */}
                <div className="space-y-4 rounded-2xl border border-ink-200 p-6">
                  <div className="flex items-center justify-start gap-2">
                    <div className="flex items-center space-x-3">
                      <label htmlFor="functional-cookies" className="flex cursor-pointer items-center space-x-3">
                        <input
                          type="checkbox"
                          id="functional-cookies"
                          checked={consent.functional}
                          onChange={() => toggleConsent("functional")}
                          className="h-5 w-5 cursor-pointer rounded border-ink-300 accent-ov-600"
                        />
                        <span className="font-medium text-ink-900">Funktional (1)</span>
                      </label>
                    </div>
                  </div>
                  <div className="flex items-center justify-start gap-2">
                    <p className="ml-8 text-sm text-ink-600">
                      Funktionale Dienste sind notwendig, um Funktionen über die grundlegende Funktionalität hinaus
                      bereitzustellen, etwa interaktive Karten. Inhalte von Drittanbietern sind standardmäßig blockiert.
                      Wenn Sie einem Dienst zustimmen, werden diese Inhalte automatisch ohne weitere manuelle Zustimmung
                      geladen.&nbsp;&nbsp;
                      <button
                        type="button"
                        onClick={() => toggleCategoryDetails("functional")}
                        aria-expanded={expandedSections.functional}
                        className="cursor-pointer border-0 bg-transparent p-0 text-sm font-medium text-ov-700 hover:text-ov-800 hover:underline"
                      >
                        {expandedSections.functional ? "Details ausblenden" : "Details anzeigen"}
                      </button>
                    </p>
                  </div>
                  {expandedSections.functional && (
                    <>
                      {/* Google Maps */}
                      <div className="ml-8 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <label htmlFor="google-maps" className="flex cursor-pointer items-center space-x-3">
                              <input
                                type="checkbox"
                                id="google-maps"
                                checked={consent.googleMaps}
                                onChange={() => toggleConsent("googleMaps")}
                                className="h-5 w-5 cursor-pointer rounded border-ink-300 accent-ov-600"
                              />
                              <span className="font-medium text-ink-900">{cookieServices.functional.googleMaps.title}</span>
                            </label>
                          </div>
                        </div>
                        <p className="ml-8 text-sm text-ink-600">
                          {cookieServices.functional.googleMaps.description}&nbsp;&nbsp;
                          <button
                            type="button"
                            onClick={() => toggleServiceDetails("googleMaps")}
                            aria-expanded={expandedServices.googleMaps}
                            className="cursor-pointer border-0 bg-transparent p-0 text-sm font-medium text-ov-700 hover:text-ov-800"
                          >
                            {expandedServices.googleMaps ? "Details ausblenden" : "Details anzeigen"}
                          </button>
                        </p>
                        {expandedServices.googleMaps && <CookieDetails service={cookieServices.functional.googleMaps} />}
                      </div>
                    </>
                  )}
                </div>

                {/* Statistik */}
                <div className="space-y-4 rounded-2xl border border-ink-200 p-6">
                  <div className="flex items-center justify-start gap-2">
                    <label htmlFor="statistics-cookies" className="flex cursor-pointer items-center space-x-3">
                      <input
                        type="checkbox"
                        id="statistics-cookies"
                        checked={consent.statistics}
                        onChange={() => toggleConsent("statistics")}
                        className="h-5 w-5 cursor-pointer rounded border-ink-300 accent-ov-600"
                      />
                      <span className="font-medium text-ink-900">Statistik (2)</span>
                    </label>
                  </div>
                  <p className="ml-8 text-sm text-ink-600">
                    Statistik-Dienste helfen uns zu verstehen, wie Besucher unsere Website nutzen, damit wir sie verbessern
                    können: Google Analytics sowie unsere eigene Heatmap, die zusammengefasst erfasst, welche Elemente angeklickt
                    werden (ohne Eingaben oder Texte) und wie weit gescrollt wird. Beide werden erst nach Ihrer Zustimmung geladen
                    bzw. aktiviert und bei einem Widerruf sofort beendet. Details in der{" "}
                    <Link href="/datenschutz#statistik" className="font-medium text-ov-700 underline">
                      Datenschutzerklärung
                    </Link>
                    .&nbsp;&nbsp;
                    <button
                      type="button"
                      onClick={() => toggleCategoryDetails("statistics")}
                      aria-expanded={expandedSections.statistics}
                      className="cursor-pointer border-0 bg-transparent p-0 text-sm font-medium text-ov-700 hover:text-ov-800 hover:underline"
                    >
                      {expandedSections.statistics ? "Details ausblenden" : "Details anzeigen"}
                    </button>
                  </p>
                  {expandedSections.statistics && (
                    <div className="ml-8 space-y-2">
                      <label htmlFor="google-analytics" className="flex cursor-pointer items-center space-x-3">
                        <input
                          type="checkbox"
                          id="google-analytics"
                          checked={consent.googleAnalytics}
                          onChange={() => toggleConsent("googleAnalytics")}
                          className="h-5 w-5 cursor-pointer rounded border-ink-300 accent-ov-600"
                        />
                        <span className="font-medium text-ink-900">{cookieServices.statistics.googleAnalytics.title}</span>
                      </label>
                      <p className="ml-8 text-sm text-ink-600">
                        {cookieServices.statistics.googleAnalytics.description}&nbsp;&nbsp;
                        <button
                          type="button"
                          onClick={() => toggleServiceDetails("googleAnalytics")}
                          aria-expanded={expandedServices.googleAnalytics}
                          className="cursor-pointer border-0 bg-transparent p-0 text-sm font-medium text-ov-700 hover:text-ov-800"
                        >
                          {expandedServices.googleAnalytics ? "Details ausblenden" : "Details anzeigen"}
                        </button>
                      </p>
                      {expandedServices.googleAnalytics && <CookieDetails service={cookieServices.statistics.googleAnalytics} />}

                      {/* Heatmap: kein eigener Schalter – folgt der Kategorie „Statistik“ */}
                      <p className="pt-3 font-medium text-ink-900">{cookieServices.statistics.heatmap.title}</p>
                      <p className="ml-8 text-sm text-ink-600">
                        {cookieServices.statistics.heatmap.description} Aktiv, wenn „Statistik“ ausgewählt ist.&nbsp;&nbsp;
                        <button
                          type="button"
                          onClick={() => toggleServiceDetails("heatmap")}
                          aria-expanded={expandedServices.heatmap}
                          className="cursor-pointer border-0 bg-transparent p-0 text-sm font-medium text-ov-700 hover:text-ov-800"
                        >
                          {expandedServices.heatmap ? "Details ausblenden" : "Details anzeigen"}
                        </button>
                      </p>
                      {expandedServices.heatmap && <CookieDetails service={cookieServices.statistics.heatmap} />}
                    </div>
                  )}
                </div>
              </div>
              <div className="sticky bottom-0 border-t border-ink-200 bg-ink-50 p-3">
                <p className="flex items-center justify-center gap-2 text-center text-sm text-ink-600">
                  <Link href="/datenschutz" className="cursor-pointer underline-offset-2 hover:underline">
                    Datenschutzerklärung
                  </Link>
                  <span aria-hidden="true">·</span>
                  <Link href="/impressum" className="cursor-pointer underline-offset-2 hover:underline">
                    Impressum
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
