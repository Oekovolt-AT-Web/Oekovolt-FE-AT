"use client";
import Navbar from "@/components/Navbar/navbar";
import Footer from "@/components/Reusable/footer";
import CookieComponent from "@/components/Cookies/cookiecomponent";
import ToTopButton from "@/components/Home/BackToTop";
import { GoogleTagManager } from "@next/third-parties/google";

export default function LayoutWrapper({ children }) {
  return (
    <>
      <GoogleTagManager gtmId="GTM-WR8PDT7V" />
      <Navbar />
      {children}
      <CookieComponent />
      <Footer />
      <ToTopButton />
    </>
  );
}
