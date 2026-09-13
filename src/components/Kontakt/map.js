"use client";
import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import FadeInView from "@/components/Reusable/FadeInView";

const Map = () => {
  const [cookieAccepted, setCookieAccepted] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const checkCookieConsent = useCallback(() => {
    if (typeof document === "undefined") return false;
    try {
      const cookies = document.cookie.split(";").map((c) => c.trim());
      const cookieConsentCookie = cookies.find((c) => c.startsWith("cookieConsent="));
      if (!cookieConsentCookie) return false;
      const cookieValue = cookieConsentCookie.split("=")[1];
      const decodedValue = decodeURIComponent(cookieValue);
      const consentData = JSON.parse(decodedValue);
      return consentData.googleMaps === true;
    } catch (error) {
      console.error("Cookie parsing error:", error);
      return false;
    }
  }, []);

  useEffect(() => {
    setIsClient(true);
    setCookieAccepted(checkCookieConsent());
    const observer = new MutationObserver(() => {
      setCookieAccepted((prev) => {
        const current = checkCookieConsent();
        return current !== prev ? current : prev;
      });
    });
    observer.observe(document, {
      subtree: true,
      attributes: true,
      attributeFilter: ["cookie"],
    });
    return () => observer.disconnect();
  }, [checkCookieConsent]);

  const handleAcceptCookie = () => {
    try {
      let consentData = {};
      const cookies = document.cookie.split(";").map((c) => c.trim());
      const cookieConsentCookie = cookies.find((c) => c.startsWith("cookieConsent="));
      if (cookieConsentCookie) {
        const cookieValue = cookieConsentCookie.split("=")[1];
        consentData = JSON.parse(decodeURIComponent(cookieValue));
      }
      consentData.googleMaps = true;
      const cookieString = [
        `cookieConsent=${encodeURIComponent(JSON.stringify(consentData))}`,
        "path=/",
        "max-age=31536000",
        "SameSite=Lax",
        window.location.protocol === "https:" ? "Secure" : "",
        "partitioned",
      ]
        .filter(Boolean)
        .join("; ");
      document.cookie = cookieString;
      setCookieAccepted(true);
    } catch (error) {
      console.error("Error setting cookie:", error);
    }
  };

  if (!isClient || !show) {
    return (
      <div className="relative w-full h-[400px] overflow-hidden shadow-lg bg-gray-100" />
    );
  }

  return (
    <FadeInView
      direction="none"
      scale={0.95}
      duration={800}
      className="relative w-full h-[400px] overflow-hidden shadow-lg group cursor-pointer"
    >
      {cookieAccepted ? (
        <>
          <iframe
            title="Platzhirsch Map"
            src="https://www.google.com/maps/embed?pb=!1m16!1m12!1m3!1d2667.7124246800313!2d10.62765887671906!3d48.03858070804748!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!2m1!1s%C3%96KOVOLT%20GmbH%20Solartechnik%2C%20Schlingener%20Str.%201a%2C%2086842%20T%C3%BCrkheim%2C%20Germany!5e0!3m2!1sen!2s!4v1747904135484!5m2!1sen!2s"
            width="100%"
            height="100%"
            style={{ border: 0, pointerEvents: "none" }}
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full h-full"
          />
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute top-[45%] left-1/2 z-20 -translate-x-1/2 -translate-y-full pointer-events-none animate-bounce-slow">
            <Image
              src="/Images/Home/newpreview2.png"
              alt="Standort Ökovolt in Türkheim"
              width={60}
              height={60}
              className="w-[60px] h-auto drop-shadow-md"
            />
          </div>
          <div className="absolute mt-8 top-[52%] left-1/2 z-30 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <a
              href="https://www.google.com/maps/dir/?api=1&destination=Schlingener+Str.+1a,+86842+Türkheim,+Germany"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 items-center rounded-full bg-ov-500 px-5 text-[15px] font-semibold text-white shadow-lg transition-colors hover:bg-ov-600"
            >
              Route planen
            </a>
          </div>
        </>
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center bg-sand-50 px-6">
          <p className="mb-5 max-w-md text-center text-[15px] leading-relaxed text-ink-600">
            Um die Karte anzuzeigen, müssen Sie die Verwendung von Google Maps bestätigen.
          </p>
          <button
            onClick={handleAcceptCookie}
            className="inline-flex h-11 items-center rounded-full bg-ov-500 px-6 text-[15px] font-semibold text-white transition-colors hover:bg-ov-600"
          >
            Karte aktivieren
          </button>
        </div>
      )}
    </FadeInView>
  );
};

export default Map;