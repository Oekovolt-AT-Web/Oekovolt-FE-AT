"use client";
import Navbar from "@/components/Navbar/navbar";
import Footer from "@/components/Reusable/footer";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import EmailChangeNotice from "./EmailChangeNotice";
import RevealObserver from "@/components/ui/RevealObserver";
import MobileCta from "@/components/Reusable/MobileCta";

// const GoogleTagManager = dynamic(
//   () => import("@next/third-parties/google").then((m) => m.GoogleTagManager),
//   { ssr: false }
// );

const CookieComponentLazy = dynamic(() => import("@/components/Cookies/cookiecomponent"), { ssr: false });
const ToTopButtonLazy = dynamic(() => import("@/components/Home/BackToTop"), { ssr: false });
const RueckrufWidgetLazy = dynamic(() => import("@/components/Rueckruf/RueckrufWidget"), { ssr: false });

export default function LayoutWrapper({ children }) {
  // Info-Bildschirm (SCADA/TV): nur der Inhalt, ohne Kopf, Fuß, Banner und Widgets
  const pfad = usePathname() || "";
  if (pfad === "/tv" || pfad.startsWith("/tv/")) return <main id="main-content">{children}</main>;

  return (
    <>
      {/* <GoogleTagManager gtmId="GTM-WR8PDT7V" /> */}
      <RevealObserver />
      {/* Cookie-Banner vor dem Seitenkopf: in der Tab-Reihenfolge direkt nach dem Sprunglink erreichbar (fixiert positioniert) */}
      <CookieComponentLazy />
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
