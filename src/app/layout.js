"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import "./globals.css";
import Navbar from "@/components/Navbar/navbar";
import Footer from "@/components/Reusable/footer";
import CookieComponent from "@/components/Cookies/cookiecomponent";
import { GoogleTagManager } from "@next/third-parties/google";
import ToTopButton from "@/components/Home/BackToTop";
import Image from "next/image";

export default function RootLayout({ children }) {
  const [loading, setLoading] = useState(true);
  const pathname = usePathname(); // detects page changes

  useEffect(() => {
    setLoading(true); // Start loading
    const timer = setTimeout(() => {
      setLoading(false); // Stop loading after delay
    }, 3000); // Adjust the duration as needed (ms)

    return () => clearTimeout(timer);
  }, [pathname]); // Re-run every time route/path changes

  return (
    <html lang="de">
      <body className="bg-white text-black">
        {loading ? (
          <div className="flex justify-center items-center h-screen w-full">
            <Image
              src="/Images/Home/loading.svg"
              alt="Lade..."
              width={100}
              height={100}
              priority
            />
          </div>
        ) : (
          <>
            <Navbar />
            {children}
            <CookieComponent />
            <Footer />
            <ToTopButton />
            <GoogleTagManager gtmId="GTM-MTT7LVDC" />
          </>
        )}
      </body>
    </html>
  );
}
