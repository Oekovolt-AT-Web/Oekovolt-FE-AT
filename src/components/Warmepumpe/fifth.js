"use client";
import { useState } from "react";
import {
  FaUser,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaCity,
  FaMailBulk,
  FaRegCommentDots,
} from "react-icons/fa";
import { motion } from "framer-motion";
import Image from "next/image"; // <-- import Image


export default function KontaktFormular() {
  const [agreed, setAgreed] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  const inputStyle =
    "flex items-center border border-gray-300 bg-white rounded-md px-6 md:px-2 py-3 gap-3 w-full text-sm focus-within:border-[#669933] focus-within:ring-2 focus-within:ring-[#669933]/30 transition";

  return (
    <section className="bg-[#f9fafb] py-10 md:py-16 px-6 md:px-12">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
        className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 bg-white rounded-3xl shadow-xl overflow-hidden p-1 md:p-8"
      >
          {/* Left Column - Info Box */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="hidden md:block bg-[#669933] p-1 rounded-2xl text-white text-[15px] space-y-6 leading-relaxed relative"
        >
          <div
            className="relative overflow-hidden rounded-xl h-[400px] md:h-[400px] lg:h-full" // fixed height for Image fill
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <Image
              src="/Images/Jobs/download.jpg"
              alt="Solar panels"
              fill
              className="object-cover transition duration-500"
              priority
            />
            <div
              className={`absolute inset-0 bg-[#669933]/90 flex items-center justify-center p-6 transition-opacity duration-500 ${
                isHovering ? "opacity-100" : "opacity-0"
              }`}
            >
              <div className="text-white text-center">
                <p className="text-lg font-semibold mb-2">
                  Solaranlagen von Oekovolt
                </p>
                <p className="text-sm">
                  Unsere Experten beraten Sie individuell zu Ihrem Solarprojekt
                </p>
                <p className="mt-2 text-sm">
                  Vielen Dank für dein Interesse an unseren Photovoltaik-Lösungen!
                  Mit einer Solaranlage von Oekovolt Deutschland profitierst du
                  nicht nur von niedrigeren Energiekosten, sondern leistest auch
                  einen aktiven Beitrag zum Klimaschutz.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Column - Form */}
        <motion.form
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          viewport={{ once: true }}
          className="bg-gray-100 p-8 rounded-2xl space-y-5 text-sm shadow-inner"
        >
          <h3 className="text-2xl text-gray-900 mb-2">
            Jetzt unverbindlich anfragen:
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className={inputStyle}>
              <FaUser className="text-[#669933]" />
              <input
                type="text"
                placeholder="Vorname"
                className="flex-1 outline-none"
              />
            </div>
            <div className={inputStyle}>
              <FaUser className="text-[#669933]" />
              <input
                type="text"
                placeholder="Nachname"
                className="flex-1 outline-none"
              />
            </div>
            <div className={`${inputStyle} sm:col-span-2`}>
              <FaPhoneAlt className="text-[#669933]" />
              <input
                type="text"
                placeholder="Telefonnummer"
                className="flex-1 outline-none"
              />
            </div>
            <div className={`${inputStyle} sm:col-span-2`}>
              <FaMapMarkerAlt className="text-[#669933]" />
              <input
                type="text"
                placeholder="Straße und Hausnummer"
                className="flex-1 outline-none"
              />
            </div>
            <div className={inputStyle}>
              <FaCity className="text-[#669933]" />
              <input
                type="text"
                placeholder="Ort"
                className="flex-1 outline-none"
              />
            </div>
            <div className={inputStyle}>
              <FaMailBulk className="text-[#669933]" />
              <input
                type="text"
                placeholder="Postleitzahl"
                className="flex-1 outline-none"
              />
            </div>
            <div className={`${inputStyle} sm:col-span-2`}>
              <FaEnvelope className="text-[#669933]" />
              <input
                type="email"
                placeholder="E-Mail Adresse"
                className="flex-1 outline-none"
              />
            </div>
            <div className={`${inputStyle} sm:col-span-2 items-start`}>
              <FaRegCommentDots className="mt-1 text-[#669933]" />
              <textarea
                placeholder="Deine Nachricht"
                className="flex-1 outline-none resize-none h-24 bg-transparent"
              />
            </div>
          </div>

          <div className="flex items-start gap-2 mt-2">
            <input
              type="checkbox"
              checked={agreed}
              onChange={() => setAgreed(!agreed)}
              className="mt-1 accent-[#669933]"
            />
            <label className="text-gray-600 text-[14px]">
              Ich stimme der Verarbeitung meiner Daten gemäß der{" "}
              <a href="/datenschutz" className="text-[#669933] underline">
                Datenschutzerklärung
              </a>{" "}
              zu.
            </label>
          </div>

          <button
            type="submit"
            disabled={!agreed}
            className={`mt-4 w-full py-3 px-6 text-white font-semibold rounded-md transition-all ${
              agreed
                ? "bg-[#669933] hover:bg-[#557a26]"
                : "bg-gray-300 cursor-not-allowed"
            }`}
          >
            Anfrage absenden
          </button>
        </motion.form>
      </motion.div>
    </section>
  );
}
