"use client";
import Navbar from "@/components/Navbar/navbar";
import Footer from "@/components/Reusable/footer";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { herkunftErfassen } from "@/lib/herkunft";
import EmailChangeNotice from "./EmailChangeNotice";
import RevealObserver from "@/components/ui/RevealObserver";
import MobileCta from "@/components/Reusable/MobileCta";
// Cookie-Banner: serverseitig gerenderte Hülle (Sichtbarkeit per Klasse auf <html>, siehe
// COOKIE_KOPF_SKRIPT), als Client-Insel hydriert – nicht mehr per dynamic(…, { ssr: false }), sonst
// erscheint er spät und wird zum LCP-Element.
import CookieBanner from "@/components/Cookies/cookiecomponent";
// Klick-/Scroll-Heatmap: Sammler nur mit Einwilligung „Statistik“, Ansicht nur mit ?heatmap=<Token>
import Heatmap from "@/components/Statistik/Heatmap";

// const GoogleTagManager = dynamic(
//   () => import("@next/third-parties/google").then((m) => m.GoogleTagManager),
//   { ssr: false }
// );

const ToTopButtonLazy = dynamic(() => import("@/components/Home/BackToTop"), { ssr: false });
const RueckrufWidgetLazy = dynamic(() => import("@/components/Rueckruf/RueckrufWidget"), { ssr: false });

export default function LayoutWrapper({ children }) {
  // Kampagnen-Zuordnung beim ersten Laden im Arbeitsspeicher festhalten (keine Cookies)
  useEffect(() => herkunftErfassen(), []);

  // Info-Bildschirm (SCADA/TV): nur der Inhalt, ohne Kopf, Fuß, Banner und Widgets
  const pfad = usePathname() || "";
  if (pfad === "/tv" || pfad.startsWith("/tv/") || pfad.startsWith("/scan/")) return <main id="main-content">{children}</main>;

  return (
    <>
      {/* <GoogleTagManager gtmId="GTM-WR8PDT7V" /> */}
      <RevealObserver />
      <Heatmap />
      {/* Cookie-Banner vor dem Seitenkopf: in der Tab-Reihenfolge direkt nach dem Sprunglink erreichbar (fixiert positioniert) */}
      <CookieBanner />
      <Navbar />
      <main id="main-content">{children}</main>
      <EmailChangeNotice />
      <Footer />
      <aside aria-label="Schnellzugriff">
        <MobileCta />
        <ToTopButtonLazy />
        <RueckrufWidgetLazy />
      </aside>
    </>
  );
}
