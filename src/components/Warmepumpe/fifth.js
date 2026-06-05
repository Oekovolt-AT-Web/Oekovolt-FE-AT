"use client";
import { useState, useEffect } from "react";
import {
  User,
  Phone,
  Mail,
  MapPin,
  Building2,
  Mailbox,
  MessageCircle,
} from "lucide-react";
import Image from "next/image";
import { submitContact } from "@/lib/api/contact/create_contact";

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
      await submitContact(payload);
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
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 bg-white rounded-3xl shadow-xl overflow-hidden p-1 md:p-8">
        {/* Left Column - Info Box */}
        <div className="hidden md:block bg-[#669933] p-1 rounded-2xl text-white text-[15px] space-y-6 leading-relaxed relative animate-slide-in-left">
          <div
            className="relative overflow-hidden rounded-xl h-[400px] md:h-[400px] lg:h-full"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <Image
              src="/Images/Jobs/download.jpg"
              alt="Solar panels"
              fill
              className="object-cover transition duration-500"
              loading="eager"
              sizes="100vw"
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
        </div>

        {/* Right Column - Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-gray-100 p-8 rounded-2xl space-y-5 text-sm shadow-inner animate-slide-in-right"
        >
          <h3 className="text-2xl text-gray-900 mb-2">
            Jetzt unverbindlich anfragen:
          </h3>

          {/* Notification Message */}
          {message && (
            <div
              className={`p-3 mb-5 rounded-md text-center animate-fade-in ${
                message.type === "success"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {message.type === "success"
                ? "Vielen Dank für Ihre Anfrage! Wir melden uns in Kürze bei Ihnen."
                : message.text}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className={inputStyle}>
              <User className="text-[#669933]" />
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
              <User className="text-[#669933]" />
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
              <Phone className="text-[#669933]" />
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
              <MapPin className="text-[#669933]" />
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
              <Building2 className="text-[#669933]" />
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
              <Mailbox className="text-[#669933]" />
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
              <Mail className="text-[#669933]" />
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
              <MessageCircle className="mt-1 text-[#669933]" />
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
        </form>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes slideInLeft {
          0% {
            opacity: 0;
            transform: translateX(-40px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes slideInRight {
          0% {
            opacity: 0;
            transform: translateX(40px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
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
        
        .animate-slide-in-left {
          animation: slideInLeft 0.7s ease-out forwards;
        }
        
        .animate-slide-in-right {
          animation: slideInRight 0.7s ease-out 0.2s forwards;
          opacity: 0;
          animation-fill-mode: forwards;
        }
        
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </section>
  );
}