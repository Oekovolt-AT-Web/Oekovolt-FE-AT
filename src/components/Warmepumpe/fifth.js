"use client";
import { useState, useEffect } from "react";
import {
  FaUser,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaCity,
  FaMailBulk,
  FaRegCommentDots,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { API_BASE_URL } from "@/lib/apiBaseUrl";

export default function KontaktFormular() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    street: "",
    city: "",
    zipCode: "",
    email: "",
    message: "",
    acceptTerms: false,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    let timer;
    if (message) {
      timer = setTimeout(() => {
        setMessage(null);
      }, 10000);
    }
    return () => clearTimeout(timer);
  }, [message]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const { firstName, lastName, email, phone, message: msg, zipCode, street, city, acceptTerms } = formData;
    
    if (!firstName || !lastName || !email || !phone || !msg || !zipCode || !street || !city) {
      setMessage({ type: "error", text: "Bitte füllen Sie alle Pflichtfelder aus." });
      setLoading(false);
      return;
    }

    if (!acceptTerms) {
      setMessage({ type: "error", text: "Bitte akzeptieren Sie die Allgemeinen Geschäftsbedingungen." });
      setLoading(false);
      return;
    }

    const payload = {
      nachname: lastName,
      vorname: firstName,
      e_mail_adressee: email,
      telefonnummer: phone,
      ihre_nachricht: msg,
      strasse_und_hausnummer: street,
      plz_und_ort: `${zipCode} ${city}`,
      allgemeine_geschaeftsbedingungen: acceptTerms ? 1 : 0,
    };

    try {
      const response = await fetch(
        `${API_BASE_URL}oekovoltdeutchland.oekovoltdeutchland.doctype.kontakt.api.create_contact`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const responseData = await response.json();

      if (!response.ok) {
        const errorMsg = responseData.message || responseData.error || "Fehler beim Senden der Nachricht.";
        throw new Error(errorMsg);
      }

      setMessage({ type: "success", text: "Nachricht erfolgreich gesendet!" });
      setFormData({
        firstName: "",
        lastName: "",
        phone: "",
        street: "",
        city: "",
        zipCode: "",
        email: "",
        message: "",
        acceptTerms: false,
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      setMessage({ type: "error", text: error.message || "Es gab einen Fehler beim Senden Ihrer Nachricht." });
    } finally {
      setLoading(false);
    }
  };

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
                    sizes=" 100vw"

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
          onSubmit={handleSubmit}
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          viewport={{ once: true }}
          className="bg-gray-100 p-8 rounded-2xl space-y-5 text-sm shadow-inner"
        >
          <h3 className="text-2xl text-gray-900 mb-2">
            Jetzt unverbindlich anfragen:
          </h3>

          <AnimatePresence>
            {message && (
              <Notification
                key="notification"
                type={message.type}
                text={
                  message.type === "success"
                    ? "Vielen Dank für Ihre Anfrage! Wir melden uns in Kürze bei Ihnen."
                    : message.text
                }
              />
            )}
          </AnimatePresence>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className={inputStyle}>
              <FaUser className="text-[#669933]" />
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Vorname *"
                required
                className="flex-1 outline-none"
              />
            </div>
            <div className={inputStyle}>
              <FaUser className="text-[#669933]" />
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Nachname *"
                required
                className="flex-1 outline-none"
              />
            </div>
            <div className={`${inputStyle} sm:col-span-2`}>
              <FaPhoneAlt className="text-[#669933]" />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Telefonnummer *"
                required
                className="flex-1 outline-none"
              />
            </div>
            <div className={`${inputStyle} sm:col-span-2`}>
              <FaMapMarkerAlt className="text-[#669933]" />
              <input
                type="text"
                name="street"
                value={formData.street}
                onChange={handleChange}
                placeholder="Straße und Hausnummer *"
                required
                className="flex-1 outline-none"
              />
            </div>
            <div className={inputStyle}>
              <FaCity className="text-[#669933]" />
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Ort *"
                required
                className="flex-1 outline-none"
              />
            </div>
            <div className={inputStyle}>
              <FaMailBulk className="text-[#669933]" />
              <input
                type="text"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
                placeholder="Postleitzahl *"
                required
                className="flex-1 outline-none"
              />
            </div>
            <div className={`${inputStyle} sm:col-span-2`}>
              <FaEnvelope className="text-[#669933]" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="E-Mail Adresse *"
                required
                className="flex-1 outline-none"
              />
            </div>
            <div className={`${inputStyle} sm:col-span-2 items-start`}>
              <FaRegCommentDots className="mt-1 text-[#669933]" />
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Deine Nachricht *"
                required
                className="flex-1 outline-none resize-none h-24 bg-transparent"
              />
            </div>
          </div>

          <div className="flex items-start gap-3 mt-2">
            <input
              type="checkbox"
              id="acceptTerms"
              name="acceptTerms"
              checked={formData.acceptTerms}
              onChange={handleChange}
              className="mt-1 w-4 h-4 text-[#669933] border-gray-300 rounded focus:ring-[#669933]"
            />
            <label htmlFor="acceptTerms" className="text-gray-600 text-[14px]">
              Ich akzeptiere die Allgemeinen Geschäftsbedingungen und bestätige, dass ich die{" "}
              <a href="/datenschutz" className="text-[#669933] underline hover:text-[#558822]">
                Datenschutzbestimmungen
              </a>{" "}
              von Oekovolt gelesen habe. Du kannst deine Einwilligung zur Datennutzung jederzeit widerrufen.
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`mt-4 w-full py-3 px-6 text-white font-semibold rounded-md transition-all ${
              loading
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-[#669933] hover:bg-[#557a26]"
            }`}
          >
            {loading ? "Wird gesendet..." : "Anfrage absenden"}
          </button>
        </motion.form>
      </motion.div>
    </section>
  );
}

const Notification = ({ type, text }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`p-3 mb-5 rounded-md text-center ${
        type === "success"
          ? "bg-green-100 text-green-800"
          : "bg-red-100 text-red-800"
      }`}
    >
      {text}
    </motion.div>
  );
};
