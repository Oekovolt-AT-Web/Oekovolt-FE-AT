"use client";
import Navbar from "@/components/Navbar/navbar";
import Footer from "@/components/Reusable/footer";
import dynamic from "next/dynamic";

const GoogleTagManager = dynamic(
  () => import("@next/third-parties/google").then((m) => m.GoogleTagManager),
  { ssr: false }
);

const CookieComponentLazy = dynamic(() => import("@/components/Cookies/cookiecomponent"), { ssr: false });
const ToTopButtonLazy = dynamic(() => import("@/components/Home/BackToTop"), { ssr: false });

export default function LayoutWrapper({ children }) {
  return (
    <>
      <GoogleTagManager gtmId="GTM-WR8PDT7V" />
      <Navbar />
      <main id="main-content">{children}</main>
      <CookieComponentLazy />
      <Footer />
      <ToTopButtonLazy />
    </>
  );
}