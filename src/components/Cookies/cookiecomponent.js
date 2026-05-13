"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { setCookie, getCookie } from "cookies-next";
import CookieDetails from "./coookieItem";
import Link from "next/link";
import { GoDotFill } from "react-icons/go";

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
          { name: "KanadaA", sub: "A" },
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
    googleTagManager: {
      title: "Google Tag Manager",
      description: "Verwaltet Tags und Skripte auf unserer Website.",
      purpose: "Dienst zur Verwaltung von Tags, die durch bestimmte Ereignisse ausgelöst werden.",
      provider: "Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irland",
      contact: {
        phone: "+1 650 253 0000",
        email: "dpo-google@google.com",
        privacy: "https://policies.google.com/privacy",
      },
      dataProcessing: {
        countries: [
          { name: "Vereinigte Staaten", sub: "A" },
          { name: "Australien", sub: "B" },
          { name: "Brasilien", sub: "B" },
          { name: "KanadaA", sub: "A" },
          { name: "Chile", sub: "B" },
          { name: "Hong Kong", sub: "B" },
          { name: "Indien", sub: "B" },
          { name: "Indonesien", sub: "B" },
          { name: "Israel", sub: "A" },
          { name: "Japan", sub: "A" },
          { name: "Korea", sub: "A" },
          { name: "Katar", sub: "B" },
          { name: "Singapur", sub: "B" },
          { name: "Schweiz", sub: "A" },
          { name: "Taiwan", sub: "B" },
          { name: "Vereinigtes Königreich", sub: "A" },
        ],
        mechanisms: [
          { name: "Angemessenheitsbeschluss", sub: "A" },
          { name: "StandardvertragsklauselnB", sub: "B" },
        ],
      },
    },
  },
  statistics: {
    googleAnalytics: {
      title: "Google Analytics",
      description: "Bietet detaillierte Statistiken über das Nutzerverhalten auf der Website.",
      purpose:
        "Google Analytics erstellt detaillierte Statistiken über das Nutzerverhalten auf der Website, einschließlich der Verarbeitung der IP-Adresse und Metadaten, die helfen können, das Land, die Stadt und die Sprache eines Nutzers zu bestimmen. Es verfolgt Seitenaufrufe, die auf Seiten verbrachte Zeit, die Gerätenutzung und mehr.",
      provider: "Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irland",
      contact: {
        phone: "+353 1 543 1000",
        email: "dpo-google@google.com",
        privacy: "https://policies.google.com/privacy",
      },
      cookies: [
        { name: "_ga", type: "HTTP Cookie", duration: "24 Monate" },
        { name: "_ga_*", type: "HTTP Cookie", duration: "24 Monate" },
      ],
      dataProcessing: {
        countries: [
          { name: "Vereinigte Staaten", sub: "A" },
          { name: "Australien", sub: "B" },
          { name: "Brasilien", sub: "B" },
          { name: "KanadaA", sub: "A" },
          { name: "Chile", sub: "B" },
          { name: "Hong Kong", sub: "B" },
          { name: "Indien", sub: "B" },
          { name: "Indonesien", sub: "B" },
          { name: "Israel", sub: "A" },
          { name: "Japan", sub: "A" },
          { name: "Korea", sub: "A" },
          { name: "Katar", sub: "B" },
          { name: "Singapur", sub: "B" },
          { name: "Schweiz", sub: "A" },
          { name: "Taiwan", sub: "B" },
          { name: "Vereinigtes Königreich", sub: "A" },
        ],
        mechanisms: [
          { name: "Angemessenheitsbeschluss", sub: "A" },
          { name: "StandardvertragsklauselnB", sub: "B" },
        ],
      },
    },
  },
  marketing: {
    googleAds: {
      title: "Google Ads",
      description: "Verfolgt Konversionen und ermöglicht Remarketing für Google Ads-Kampagnen.",
      purpose:
        "Google Ads Conversion Tracking verfolgt die Konversionsrate und den Erfolg von Google Ads-Kampagnen, wobei Cookies verwendet werden, um Nutzer zu unterscheiden und ihr Verhalten zu verfolgen. Es ermöglicht auch Remarketing, das gezielte Anzeigen für Nutzer anzeigt, die bereits mit einer Google Ads-Anzeige interagiert haben.",
      provider: "Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irland",
      contact: {
        phone: "+1 650 253 0000",
        email: "dpo-google@google.com",
        privacy: "https://policies.google.com/privacy",
      },
      cookies: [
        { name: "test_cookie", type: "HTTP Cookie", duration: "1 Tag" },
        { name: "IDE", type: "HTTP Cookie", duration: "1 Jahr" },
        { name: "CONSENT", type: "HTTP Cookie", duration: "18 Jahre" },
        { name: "1P_JAR", type: "HTTP Cookie", duration: "1 Monat" },
        { name: "_gcl_au", type: "HTTP Cookie", duration: "3 Monate" },
      ],
      dataProcessing: {
        countries: [
          { name: "Vereinigte Staaten", sub: "A" },
          { name: "Australien", sub: "B" },
          { name: "Brasilien", sub: "B" },
          { name: "KanadaA", sub: "A" },
          { name: "Chile", sub: "B" },
          { name: "Hong Kong", sub: "B" },
          { name: "Indien", sub: "B" },
          { name: "Indonesien", sub: "B" },
          { name: "Israel", sub: "A" },
          { name: "Japan", sub: "A" },
          { name: "Korea", sub: "A" },
          { name: "Katar", sub: "B" },
          { name: "Singapur", sub: "B" },
          { name: "Schweiz", sub: "A" },
          { name: "Taiwan", sub: "B" },
          { name: "Vereinigtes Königreich", sub: "A" },
        ],
        mechanisms: [
          { name: "Angemessenheitsbeschluss", sub: "A" },
          { name: "StandardvertragsklauselnB", sub: "B" },
        ],
      },
    },
  },
};

export default function CookieBanner({ forceShow = false, onClose }) {
  const router = useRouter();
  const [isShown, setIsShown] = useState(false);
  const [isCompact, setIsCompact] = useState(true);

  const [showBanner, setShowBanner] = useState(forceShow);
  const [expandedSections, setExpandedSections] = useState({
    functional: false,
    statistics: false,
    marketing: false,
  });
  const [expandedServices, setExpandedServices] = useState({});
  const [consent, setConsent] = useState({
    essential: true,
    functional: false,
    statistics: false,
    marketing: false,
    googleMaps: false,
    googleTagManager: false,
    googleAnalytics: false,
    googleAds: false,
  });

  useEffect(() => {
    if (!getCookie("cookieConsent")) {
      setShowBanner(true);
    }
  }, []);

  useEffect(() => {
    setConsent((prev) => ({
      ...prev,
      functional: prev.googleMaps && prev.googleTagManager,
      statistics: prev.googleAnalytics,
      marketing: prev.googleAds,
    }));
  }, [consent.googleMaps, consent.googleTagManager, consent.googleAnalytics, consent.googleAds]);

  const handleAcceptAll = () => {
    const newConsent = {
      essential: true,
      functional: true,
      statistics: true,
      marketing: true,
      googleMaps: true,
      googleTagManager: true,
      googleAnalytics: true,
      googleAds: true,
    };
    setConsent(newConsent);
    saveConsent(newConsent);
    router.refresh();
  };

  const handleAcceptSelected = () => {
    saveConsent(consent);
    router.refresh();
  };

  const handleRejectAll = () => {
    const newConsent = {
      essential: true,
      functional: false,
      statistics: false,
      marketing: false,
      googleMaps: false,
      googleTagManager: false,
      googleAnalytics: false,
      googleAds: false,
    };
    setConsent(newConsent);
    saveConsent(newConsent);
    router.refresh();
  };

  useEffect(() => {
    if (consent.googleAnalytics && !window.gtagInitialized) {
      const existingScript = document.querySelector(
        'script[src="https://www.googletagmanager.com/gtag/js?id=G-CQ40N7W7PG"]'
      );

      if (!existingScript) {
        const script = document.createElement("script");
        script.src = "https://www.googletagmanager.com/gtag/js?id=G-CQ40N7W7PG";
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
      }

      window.dataLayer = window.dataLayer || [];
      function gtag() {
        window.dataLayer.push(arguments);
      }

      window.gtag = gtag;
      window.gtagInitialized = true;

      gtag("js", new Date());
      gtag("config", "G-X914LD3K1V", {
        anonymize_ip: true,
      });

      gtag("consent", "update", {
        analytics_storage: "granted",
      });
    }
  }, [consent.googleAnalytics]);

  const handleClose = () => {
    setShowBanner(false);
    if (onClose) onClose();
  };
  
  const saveConsent = (consentState) => {
    setCookie("cookieConsent", JSON.stringify(consentState), {
      maxAge: 60 * 60 * 24 * 365,
    });
    setShowBanner(false);
    handleClose();

    if (consentState.functional && window.dataLayer) {
      window.dataLayer.push({ event: "consent_given" });
    }

    if (window.gtag) {
      window.gtag("consent", "update", {
        analytics_storage: consentState.googleAnalytics ? "granted" : "denied",
      });
    }
  };

  const toggleConsent = (category) => {
    setConsent((prev) => {
      const newConsent = { ...prev };

      if (category === "functional") {
        const newValue = !prev.functional;
        newConsent.functional = newValue;
        newConsent.googleMaps = newValue;
        newConsent.googleTagManager = newValue;
      } else if (category === "statistics") {
        const newValue = !prev.statistics;
        newConsent.statistics = newValue;
        newConsent.googleAnalytics = newValue;
      } else if (category === "marketing") {
        const newValue = !prev.marketing;
        newConsent.marketing = newValue;
        newConsent.googleAds = newValue;
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

  if (!forceShow && !showBanner) return null;
  if (isCompact) {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg z-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between">
          <div className="flex- mb-4 md:mb-0 ">
            <h3 className="font-medium text-gray-900">Cookie-Einstellungen</h3>
            <p className="text-sm text-gray-600">
              Wir verwenden Cookies, um Ihnen das beste Nutzererlebnis bieten zu können.
            </p>
          </div>
          <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
            <button
              onClick={handleAcceptAll}
              className="px-4 py-2 text-white bg-[#4d7a1a] rounded-lg hover:bg-[#4d7a1a] transition-colors text-sm cursor-pointer"
            >
              Alle akzeptieren
            </button>
            <button
              onClick={handleAcceptSelected}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm cursor-pointer"
            >
              Weiter ohne Einwilligung
            </button>
            <button
              onClick={toggleCompact}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm cursor-pointer"
            >
              Individuelle Einstellungen
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-60 backdrop-blur-sm" />
      <div className={`fixed inset-0 flex items-center justify-center z-60 pointer-events-none`}>
        <div className="max-h-[100dvh] h-full lg:max-w-[800px] lg:max-h-[80vh] bg-white lg:rounded-xl shadow-2xl overflow-hidden flex flex-col pointer-events-auto overflow-y-auto relative lg:h-auto">
          <h2 className="text-2xl font-bold text-gray-800 p-6 sticky bg-white z-10 pb-4 top-0 md:relative">
            Individuelle Privatsphäre-Präferenzen
          </h2>
          <div className="p-6 border-b border-gray-200 flex justify-between flex-col-reverse items-start md:flex-row relative">
            <div className="w-[100%] flex-1 md:w-[60%]">
              <p className="text-gray-600 text-sm">
                Wir verwenden Cookies und ähnliche Technologien auf unserer Website und verarbeiten personenbezogene
                Daten über Sie, wie Ihre IP-Adresse. Wir teilen diese Daten auch mit Dritten. Die Datenverarbeitung kann
                mit Ihrer Einwilligung oder auf der Grundlage eines berechtigten Interesses erfolgen, dem Sie
                widersprechen können. Sie haben das Recht, nur in essenzielle Services einzuwilligen und Ihre
                Einwilligung zu einem späteren Zeitpunkt in der Datenschutzerklärung zu ändern oder zu widerrufen.
                Nachfolgend finden Sie eine Übersicht über alle Services, die von dieser Website genutzt werden. Sie
                können detaillierte Informationen zu jedem Service einsehen und diesen einzeln zustimmen oder von Ihrem
                Widerspruchsrecht Gebrauch machen.
              </p>
            </div>
            <div className={`flex flex-col space-y-3 w-[100%] md:w-[40%] md:ml-4 transition-all duration-200 mb-4`}>
              <button
                onClick={handleAcceptAll}
                className="px-4 py-2 text-white bg-[#4d7a1a] rounded-lg hover:bg-[#4d7a1a] transition-colors text-sm whitespace-nowrap cursor-pointer"
              >
                Alle akzeptieren
              </button>
              <button
                onClick={handleAcceptSelected}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm whitespace-nowrap cursor-pointer"
              >
                Weiter ohne Einwilligung
              </button>
              <button
                onClick={handleRejectAll}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm whitespace-nowrap cursor-pointer"
              >
                Alle ablehnen
              </button>
            </div>
          </div>
          <p className="text-gray-600 mt-1 p-6 pb-2 text-xs">
            Einige Dienste verarbeiten personenbezogene Daten in unsicheren Drittländern. Indem Sie in die Nutzung
            dieser Services einwilligen, erklären Sie sich auch mit der Verarbeitung Ihrer Daten in diesen unsicheren
            Drittländern gemäß Art. 49 Abs. 1 lit. a DSGVO einverstanden. Dies birgt das Risiko, dass Ihre Daten von
            Behörden zu Kontroll- und Überwachungszwecken verarbeitet werden, möglicherweise ohne die Möglichkeit eines
            Rechtsbehelfs.
            <br />
            <br />
            Außerdem erlauben Sie die Datenverarbeitung gemäß dem Google Consent Mode von Teilnehmenden Partnern auf der
            Grundlage Ihrer Einwilligung für die folgenden Zwecke:
          </p>
          <div className="mt-3">
            <p
              className={`text-center text-sm text-[var(--secondry)]/80 ${isShown && `hidden`} md:hidden pb-4 cursor-pointer`}
              onClick={() => setIsShown(!isShown)}
            >
              Individuelle Privatsphäre-Präferenzen
            </p>
          </div>

          <div className={`flex-1 p-6 space-y-6 ${isShown ? "block" : "hidden"} md:block`}>
            {/* Essenzielle Cookies */}
            <div className="space-y-2 border border-[var(--secondary)]/20 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <label htmlFor="essential-cookies" className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      id="essential-cookies"
                      checked={consent.essential}
                      disabled
                      className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                    <span className="font-medium text-gray-900">Essenziell</span>
                  </label>
                </div>
              </div>
              <p className="text-sm text-gray-500 ml-8">
                Essenzielle Dienste sind für die grundlegende Funktionalität der Website erforderlich. Sie enthalten nur
                technisch notwendige Services. Diese Dienste können nicht abgelehnt werden.
              </p>
            </div>

            {/* Funktionale Cookies */}
            <div className="space-y-4 border border-[var(--secondary)]/20 p-6">
              <div className="flex items-center justify-start gap-2 ">
                <div className="flex items-center space-x-3">
                  <label htmlFor="functional-cookies" className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      id="functional-cookies"
                      checked={consent.functional}
                      onChange={() => toggleConsent("functional")}
                      className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                    <span className="font-medium text-gray-900">Funktional (2)</span>
                  </label>
                </div>
              </div>
              <div className="flex items-center justify-start gap-2">
                <p className="text-sm text-gray-500 ml-8">
                  Funktionale Dienste sind notwendig, um Funktionen über die grundlegende Funktionalität hinaus
                  bereitzustellen, wie schönere Schriftarten, Videowiedergabe oder interaktive Web 2.0-Funktionen.
                  Inhalte von z.B. Videoplattformen und Social-Media-Plattformen sind standardmäßig blockiert und können
                  zugestimmt werden. Wenn dem Dienst zugestimmt wird, werden diese Inhalte automatisch ohne weitere
                  manuelle Zustimmung geladen.&nbsp;&nbsp;
                  <span
                    onClick={() => toggleCategoryDetails("functional")}
                    className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                  >
                    {expandedSections.functional ? "Details ausblenden" : "Details anzeigen"}
                  </span>
                </p>
              </div>
              {expandedSections.functional && (
                <>
                  {/* Google Maps */}
                  <div className="ml-8 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <label htmlFor="google-maps" className="flex items-center space-x-3 cursor-pointer">
                          <input
                            type="checkbox"
                            id="google-maps"
                            checked={consent.googleMaps}
                            onChange={() => toggleConsent("googleMaps")}
                            className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                          />
                          <span className="font-medium text-black">{cookieServices.functional.googleMaps.title}</span>
                        </label>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 ml-8">
                      {cookieServices.functional.googleMaps.description}&nbsp;&nbsp;
                      <span
                        onClick={() => toggleServiceDetails("googleMaps")}
                        className="text-sm font-medium text-blue-600 hover:text-blue-800 cursor-pointer"
                      >
                        {expandedServices.googleMaps ? "Details ausblenden" : "Details anzeigen"}
                      </span>
                    </p>
                    {expandedServices.googleMaps && <CookieDetails service={cookieServices.functional.googleMaps} />}
                  </div>

                  {/* Google Tag Manager */}
                  <div className="ml-8 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <label htmlFor="google-tag-manager" className="flex items-center space-x-3 cursor-pointer">
                          <input
                            type="checkbox"
                            id="google-tag-manager"
                            checked={consent.googleTagManager}
                            onChange={() => toggleConsent("googleTagManager")}
                            className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                          />
                          <span className="font-medium text-black">
                            {cookieServices.functional.googleTagManager.title}
                          </span>
                        </label>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 ml-8">
                      {cookieServices.functional.googleTagManager.description}&nbsp;&nbsp;
                      <span
                        onClick={() => toggleServiceDetails("googleTagManager")}
                        className="text-sm font-medium text-blue-600 hover:text-blue-800 cursor-pointer"
                      >
                        {expandedServices.googleTagManager ? "Details ausblenden" : "Details anzeigen"}
                      </span>
                    </p>
                    {expandedServices.googleTagManager && (
                      <CookieDetails service={cookieServices.functional.googleTagManager} />
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Statistik Cookies */}
            <div className="space-y-4 border border-[var(--secondary)]/20 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <label htmlFor="statistics-cookies" className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      id="statistics-cookies"
                      checked={consent.statistics}
                      onChange={() => toggleConsent("statistics")}
                      className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                    <span className="font-medium text-gray-900">Statistik (1)</span>
                  </label>
                </div>
              </div>
              <div className="flex items-center justify-start gap-2">
                <p className="text-sm text-gray-500 ml-8">
                  Statistikdienste sind erforderlich, um pseudonymisierte Daten über die Besucher der Website zu
                  sammeln. Die Daten ermöglichen es uns, die Besucher besser zu verstehen und die Website zu
                  optimieren.&nbsp;&nbsp;
                  <span
                    onClick={() => toggleCategoryDetails("statistics")}
                    className="text-sm font-medium text-blue-600 hover:text-blue-800 cursor-pointer"
                  >
                    {expandedSections.statistics ? "Details ausblenden" : "Details anzeigen"}
                  </span>
                </p>
              </div>
              {expandedSections.statistics && (
                <div className="ml-8 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <label htmlFor="google-analytics" className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          id="google-analytics"
                          checked={consent.googleAnalytics}
                          onChange={() => toggleConsent("googleAnalytics")}
                          className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                        />
                        <span className="font-medium text-black">
                          {cookieServices.statistics.googleAnalytics.title}
                        </span>
                      </label>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 ml-8">
                    {cookieServices.statistics.googleAnalytics.description}&nbsp;&nbsp;
                    <span
                      onClick={() => toggleServiceDetails("googleAnalytics")}
                      className="text-sm font-medium text-blue-600 hover:text-blue-800 cursor-pointer"
                    >
                      {expandedServices.googleAnalytics ? "Details ausblenden" : "Details anzeigen"}
                    </span>
                  </p>
                  {expandedServices.googleAnalytics && (
                    <CookieDetails service={cookieServices.statistics.googleAnalytics} />
                  )}
                </div>
              )}
            </div>

            {/* Marketing Cookies */}
            <div className="space-y-4 border border-[var(--secondary)]/20 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <label htmlFor="marketing-cookies" className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      id="marketing-cookies"
                      checked={consent.marketing}
                      onChange={() => toggleConsent("marketing")}
                      className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                    <span className="font-medium text-gray-900">Marketing (1)</span>
                  </label>
                </div>
              </div>
              <div className="flex items-center justify-start gap-2">
                <p className="text-sm text-gray-500 ml-8">
                  Marketingdienste werden von uns und Dritten verwendet, um das Verhalten einzelner Besucher (über
                  mehrere Seiten hinweg) zu verfolgen, die gesammelten Daten zu analysieren und beispielsweise
                  personalisierte Anzeigen anzuzeigen. Diese Dienste ermöglichen es uns, Besucher über mehrere Websites
                  hinweg zu verfolgen.&nbsp;&nbsp;
                  <span
                    onClick={() => toggleCategoryDetails("marketing")}
                    className="text-sm font-medium text-blue-600 hover:text-blue-800 cursor-pointer"
                  >
                    {expandedSections.marketing ? "Details ausblenden" : "Details anzeigen"}
                  </span>
                </p>
              </div>
              {expandedSections.marketing && (
                <div className="ml-8 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <label htmlFor="google-ads" className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          id="google-ads"
                          checked={consent.googleAds}
                          onChange={() => toggleConsent("googleAds")}
                          className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                        />
                        <span className="font-medium text-black">{cookieServices.marketing.googleAds.title}</span>
                      </label>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 ml-8">
                    {cookieServices.marketing.googleAds.description}&nbsp;&nbsp;
                    <span
                      onClick={() => toggleServiceDetails("googleAds")}
                      className="text-sm font-medium text-blue-600 hover:text-blue-800 cursor-pointer"
                    >
                      {expandedServices.googleAds ? "Details ausblenden" : "Details anzeigen"}
                    </span>
                  </p>
                  {expandedServices.googleAds && <CookieDetails service={cookieServices.marketing.googleAds} />}
                </div>
              )}
            </div>
          </div>
          <div className="border-t border-gray-200 bg-gray-50 p-2 sticky bottom-0">
            <p className="text-center text-sm text-gray-600 gap-1 flex justify-center items-center">
              <Link href={"/datenschutz"} className="cursor-pointer">Datenschutzerklärung</Link>
              <GoDotFill />
              <Link href={"/impressum"} className="cursor-pointer">Impressum</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}