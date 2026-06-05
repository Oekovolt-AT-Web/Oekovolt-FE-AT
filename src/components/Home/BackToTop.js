"use client";
import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export default function ToTopButton() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const shouldShow = window.scrollY > 100;
      setShow(shouldShow);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      onClick={scrollToTop}
      style={{
        position: "fixed",
        bottom: "24px",
        right: "24px",
        zIndex: 99999, // Increased to avoid conflicts
        padding: "12px",
        backgroundColor: "#ffffff",
        borderRadius: "50%",
        border: "4px solid #669933",
        width: "50px",
        height: "50px",
        display: show ? "flex" : "none",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        transition: "opacity 0.3s ease-in-out, transform 0.3s ease-in-out",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", // Added for visibility
        opacity: show ? 1 : 0,
        transform: show ? "translateY(0)" : "translateY(20px)",
      }}
      aria-label="Back to top"
    >
      <ArrowUp size={20} style={{ color: "#669933" }} />
    </button>
  );
}