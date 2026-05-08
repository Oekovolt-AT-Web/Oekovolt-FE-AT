"use client";
import Link from "next/link";
import Image from "next/image";
import { FaChevronRight, FaHome, FaSolarPanel, FaPhone } from "react-icons/fa";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className="bg-white flex flex-col">
      <div className="w-full h-2 bg-[#669933]" />
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-16 max-w-5xl mx-auto w-full">
        {/* 404 number */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative mb-6"
        >
          <span
            className="text-[140px] md:text-[200px] font-extrabold leading-none select-none"
            style={{ color: "#003473", opacity: 0.08 }}
          >
            404
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <span
              className="text-[80px] md:text-[120px] font-extrabold leading-none"
              style={{ color: "#003473" }}
            >
              404
            </span>
          </div>
        </motion.div>
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="w-20 h-1 bg-[#669933] rounded-full mb-8"
        />
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-2xl md:text-4xl font-bold text-center mb-4"
          style={{ color: "#003473" }}
        >
          Seite nicht gefunden
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-gray-600 text-center text-base md:text-lg max-w-lg mb-10"
        >
          Die gesuchte Seite existiert leider nicht oder wurde verschoben.
          Kehren Sie zur Startseite zurück oder nutzen Sie einen der folgenden Links.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-md text-white font-semibold text-sm uppercase tracking-wide transition-colors hover:bg-[#558822]"
            style={{ backgroundColor: "#669933" }}
          >
            <FaHome className="text-base" />
            Zur Startseite
            <FaChevronRight className="text-xs" />
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
