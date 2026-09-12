"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";
import { User, Mail, Phone, Building, MessageSquare, MapPin } from "lucide-react";
import { submitContact } from "@/lib/api/contact/create_contact";
import FadeInView from "@/components/Reusable/FadeInView";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
    zipCity: "",
    street: "",
    acceptTerms: false,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    let timer;
    if (message) {
      setShowMessage(true);
      timer = setTimeout(() => {
        setShowMessage(false);
        setTimeout(() => setMessage(null), 300);
      }, 10000);
    }
    return () => clearTimeout(timer);
  }, [message]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const { firstName, lastName, email, phone, message, zipCity, street, acceptTerms } = formData;
    if (!firstName || !lastName || !email || !phone || !message || !zipCity || !street) {
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
      ihre_nachricht: message,
      strasse_und_hausnummer: street,
      plz_und_ort: zipCity,
      allgemeine_geschaeftsbedingungen: acceptTerms ? 1 : 0,
    };

    try {
      await submitContact(payload);
      setMessage({ type: "success", text: "Nachricht erfolgreich gesendet!" });
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        message: "",
        zipCity: "",
        street: "",
        acceptTerms: false,
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      setMessage({ type: "error", text: error.message || "Es gab einen Fehler beim Senden Ihrer Nachricht." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <FadeInView
      direction="bottom"
      distance={40}
      duration={800}
      className="max-w-7xl mx-auto px-6 md:px-12 py-10 md:py-16 relative mb-[-12px]"
    >
      <div className="flex w-full overflow-hidden relative z-20">
        {/* Left image block */}
        <div className="hidden md:flex w-1/2 relative rounded-r-[100px] overflow-hidden">
          {/* War ein CSS-Hintergrundbild: 442 KB JPEG, das weder in WebP/AVIF
              umgewandelt noch auf die Anzeigegroesse skaliert wurde, weil
              background-image an next/image vorbeilaeuft. Das Bild liegt unter
              einem 70-%-Overlay, deshalb reicht niedrige Qualitaet voellig. */}
          <Image
            src="/Images/Jobs/download.jpg"
            alt=""
            aria-hidden="true"
            fill
            quality={55}
            sizes="(max-width: 768px) 0px, 50vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gray-800/70 z-10"></div>
          <div className="text-white flex flex-col justify-center items-center text-center relative z-20 px-5 lg:px-20">
            <h2 className="text-3xl font-bold mb-2 text-white">Willkommen Zurück!</h2>
            <p className="text-sm">
              Wir freuen uns auf Ihre Nachricht und stehen Ihnen gerne zur Verfügung!
            </p>
          </div>
        </div>

        {/* Right form block */}
        <div className="w-full md:w-1/2 lg:p-10 md:pl-10 md:pr-10 p-6 sm:p-8">
          <h2 className="text-md uppercase font-bold text-center mb-2 text-[#669933]">
            Kontaktieren
          </h2>
          <h2 className="text-3xl font-bold text-center mb-2">Kontaktformular</h2>
          <p className="text-center text-gray-500 mb-6">Senden Sie uns eine Nachricht</p>

          {/* Notification Message */}
          {message && (
            <div
              className={`p-3 mb-5 rounded-md text-center transition-all duration-300 animate-fade-in ${message.type === "success"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
                }`}
            >
              {message.type === "success"
                ? "Vielen Dank für Ihre Anfrage! Wir melden uns in Kürze bei Ihnen."
                : message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* First row: First + Last name */}
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <User className="absolute top-3 left-3 text-gray-400 text-lg" />
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Vorname *"
                  required
                  className="w-full pl-10 pr-4 py-2 rounded-md bg-gray-100 focus:ring-2 focus:ring-[#669933] border border-gray-300 outline-none"
                />
              </div>

              <div className="relative flex-1">
                <User className="absolute top-3 left-3 text-gray-400 text-lg" />
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Nachname *"
                  required
                  className="w-full pl-10 pr-4 py-2 rounded-md bg-gray-100 focus:ring-2 focus:ring-[#669933] border border-gray-300 outline-none"
                />
              </div>
            </div>

            {/* Second row: Street + ZipCity */}
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Building className="absolute top-3 left-3 text-gray-400 text-lg" />
                <input
                  type="text"
                  name="street"
                  value={formData.street}
                  onChange={handleChange}
                  placeholder="Strasse und Hausnummer *"
                  required
                  className="w-full pl-10 pr-4 py-2 rounded-md bg-gray-100 focus:ring-2 focus:ring-[#669933] border border-gray-300 outline-none"
                />
              </div>

              <div className="relative flex-1">
                <MapPin className="absolute top-3 left-3 text-gray-400 text-lg" />
                <input
                  type="text"
                  name="zipCity"
                  value={formData.zipCity}
                  onChange={handleChange}
                  placeholder="PLZ und Ort *"
                  required
                  className="w-full pl-10 pr-4 py-2 rounded-md bg-gray-100 focus:ring-2 focus:ring-[#669933] border border-gray-300 outline-none"
                />
              </div>
            </div>

            {/* Third row: Email + Phone */}
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Mail className="absolute top-3 left-3 text-gray-400 text-lg" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="E-Mail-Adresse *"
                  required
                  className="w-full pl-10 pr-4 py-2 rounded-md bg-gray-100 focus:ring-2 focus:ring-[#669933] border border-gray-300 outline-none"
                />
              </div>

              <div className="relative flex-1">
                <Phone className="absolute top-3 left-3 text-gray-400 text-lg" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Telefonnummer"
                  className="w-full pl-10 pr-4 py-2 rounded-md bg-gray-100 focus:ring-2 focus:ring-[#669933] border border-gray-300 outline-none"
                />
              </div>
            </div>

            {/* Message */}
            <div className="relative">
              <MessageSquare className="absolute top-3 left-3 text-gray-400 text-lg" />
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Nachricht *"
                required
                rows={4}
                className="w-full pl-10 pr-4 py-2 rounded-md bg-gray-100 focus:ring-2 focus:ring-[#669933] border border-gray-300 resize-none outline-none"
              />
            </div>

            {/* Terms & Conditions Checkbox */}
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="acceptTerms"
                name="acceptTerms"
                checked={formData.acceptTerms}
                onChange={handleChange}
                className="mt-1 w-4 h-4 text-[#669933] border-gray-300 rounded focus:ring-[#669933]"
              />
              <label htmlFor="acceptTerms" className="text-sm text-gray-600">
                Ich akzeptiere die Allgemeinen Geschäftsbedingungen und bestätige, dass ich die{" "}
                <a href="/datenschutz" className="text-[#669933] underline hover:text-[#558822]">
                  Datenschutzbestimmungen
                </a>{" "}
                von Oekovolt gelesen habe. Du kannst deine Einwilligung zur Datennutzung jederzeit widerrufen.
              </label>
            </div>

            {/* Submit Button - Pure Tailwind version */}
            <div className="flex justify-center">
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full md:w-auto min-w-[200px] px-5 py-2.5 h-[45px] bg-transparent text-[#30373e] text-[13px] font-medium uppercase tracking-[1px] border-2 border-[#669933] rounded-md overflow-hidden cursor-pointer transition-all duration-500 hover:border-[#669933] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {/* Top and bottom border animations */}
                <span className="absolute inset-0">
                  <span className="absolute right-0 top-0 w-0 h-0.5 bg-gray-500 transition-all duration-500 ease-[cubic-bezier(0.35,0.1,0.25,1)] group-hover:w-full"></span>
                  <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-gray-500 transition-all duration-500 ease-[cubic-bezier(0.35,0.1,0.25,1)] group-hover:w-full"></span>
                </span>

                {/* Left and right border animations */}
                <span className="absolute inset-0">
                  <span className="absolute right-0 top-0 w-0.5 h-0 bg-gray-500 transition-all duration-500 ease-[cubic-bezier(0.35,0.1,0.25,1)] group-hover:h-full"></span>
                  <span className="absolute left-0 bottom-0 w-0.5 h-0 bg-gray-500 transition-all duration-500 ease-[cubic-bezier(0.35,0.1,0.25,1)] group-hover:h-full"></span>
                </span>

                <p className="relative z-10 flex items-center justify-center gap-2 m-0 transition-colors duration-300 group-hover:text-[#669933]">
                  {loading ? (
                    "Senden..."
                  ) : (
                    <>
                      Nachricht SENDEN
                      <svg
                        className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M14 5l7 7m0 0l-7 7m7-7H3"
                        />
                      </svg>
                    </>
                  )}
                </p>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Add CSS animation for fade-in */}
      <style jsx>{`
        @keyframes fadeIn {
          0% {
            opacity: 0;
            transform: translateY(-10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </FadeInView>
  );
}