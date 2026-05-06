"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styled from "styled-components";
import {
  MdPerson,
  MdEmail,
  MdContactPhone,
  MdBusiness,
  MdMessage,
  MdLocationOn,
} from "react-icons/md";
import { API_BASE_URL } from "@/lib/apiBaseUrl";

const Buttons = styled.div`
  display: flex;
  justify-content: center;

  button {
    width: 100%;
    padding: 10px;
    height: 45px;
    background-color: transparent;
    color: #30373e;
    position: relative;
    overflow: hidden;
    font-size: 13px;
    letter-spacing: 1px;
    font-weight: 500;
    text-transform: uppercase;
    transition: all 0.5s ease;
    cursor: pointer;
    border: 2px solid #669933;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 3px;

    @media (max-width: 640px) {
      width: 260px;
      height: 40px;
      font-size: 12px;
    }

    &::before,
    &::after {
      content: "";
      position: absolute;
      width: 0;
      height: 2px;
      background-color: rgb(92, 92, 92);
      transition: all 0.5s cubic-bezier(0.35, 0.1, 0.25, 1);
    }

    &::before {
      right: 0;
      top: 0;
    }

    &::after {
      left: 0;
      bottom: 0;
    }

    &:hover::before,
    &:hover::after {
      width: 100%;
    }

    span {
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
      z-index: 1;

      &::before,
      &::after {
        content: "";
        position: absolute;
        width: 2px;
        height: 0;
        background-color: rgb(92, 92, 92);
        transition: all 0.5s cubic-bezier(0.35, 0.1, 0.25, 1);
      }

      &::before {
        right: 0;
        top: 0;
      }

      &::after {
        left: 0;
        bottom: 0;
      }
    }

    &:hover span::before,
    &:hover span::after {
      height: 100%;
    }

    p {
      padding: 0;
      margin: 0;
      position: relative;
      z-index: 2;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      transition: color 0.3s ease;

      &::before {
        content: attr(data-title);
      }

      &::after {
        display: none;
      }

      svg {
        width: 16px;
        height: 16px;
        transition: transform 0.3s ease;
      }
    }

    &:hover p svg {
      transform: translateX(4px);
    }
  }
`;

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
      nachname: firstName,
      vorname: lastName,
      e_mail_adressee: email,
      telefonnummer: phone,
      ihre_nachricht: message,
      strasse_und_hausnummer: street,
      plz_und_ort: zipCity,
      allgemeine_geschaeftsbedingungen: acceptTerms ? 1 : 0,
    };

    try {
      const response = await fetch(
        `${API_BASE_URL}oekovoltdeutchland.oekovoltdeutchland.doctype.kontakt.api.create_contact`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json", "Expect": "" },
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
    <motion.div
      className="max-w-7xl mx-auto px-6 md:px-12 py-10 md:py-16 relative mb-[-12px]"
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="flex w-full overflow-hidden relative z-20">
        {/* Left image block */}
        <div
          className="hidden md:flex w-1/2 relative rounded-r-[100px] overflow-hidden"
          style={{
            backgroundImage: "url('/Images/Jobs/download.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
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

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* First row: First + Last name */}
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <MdPerson className="absolute top-3 left-3 text-gray-400 text-lg" />
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Vorname *"
                  required
                  className="w-full pl-10 pr-4 py-2 rounded-md bg-gray-100 focus:ring-2 focus:ring-[#669933] border border-gray-300"
                />
              </div>

              <div className="relative flex-1">
                <MdPerson className="absolute top-3 left-3 text-gray-400 text-lg" />
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Nachname *"
                  required
                  className="w-full pl-10 pr-4 py-2 rounded-md bg-gray-100 focus:ring-2 focus:ring-[#669933] border border-gray-300"
                />
              </div>
            </div>

            {/* Second row: Street + ZipCity */}
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <MdBusiness className="absolute top-3 left-3 text-gray-400 text-lg" />
                <input
                  type="text"
                  name="street"
                  value={formData.street}
                  onChange={handleChange}
                  placeholder="Strasse und Hausnummer *"
                  required
                  className="w-full pl-10 pr-4 py-2 rounded-md bg-gray-100 focus:ring-2 focus:ring-[#669933] border border-gray-300"
                />
              </div>

              <div className="relative flex-1">
                <MdLocationOn className="absolute top-3 left-3 text-gray-400 text-lg" />
                <input
                  type="text"
                  name="zipCity"
                  value={formData.zipCity}
                  onChange={handleChange}
                  placeholder="PLZ und Ort *"
                  required
                  className="w-full pl-10 pr-4 py-2 rounded-md bg-gray-100 focus:ring-2 focus:ring-[#669933] border border-gray-300"
                />
              </div>
            </div>

            {/* Third row: Email + Phone (responsive) */}
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <MdEmail className="absolute top-3 left-3 text-gray-400 text-lg" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="E-Mail-Adresse *"
                  required
                  className="w-full pl-10 pr-4 py-2 rounded-md bg-gray-100 focus:ring-2 focus:ring-[#669933] border border-gray-300"
                />
              </div>

              <div className="relative flex-1">
                <MdContactPhone className="absolute top-3 left-3 text-gray-400 text-lg" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Telefonnummer"
                  className="w-full pl-10 pr-4 py-2 rounded-md bg-gray-100 focus:ring-2 focus:ring-[#669933] border border-gray-300"
                />
              </div>
            </div>

            {/* Message */}
            <div className="relative">
              <MdMessage className="absolute top-3 left-3 text-gray-400 text-lg" />
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Nachricht *"
                required
                rows={4}
                className="w-full pl-10 pr-4 py-2 rounded-md bg-gray-100 focus:ring-2 focus:ring-[#669933] border border-gray-300 resize-none"
              ></textarea>
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

            {/* Submit Button */}
            <Buttons>
              <button type="submit" disabled={loading}>
                <span></span>
                <p data-title="Nachricht SENDEN">
                  {loading ? (
                    "Senden..."
                  ) : (
                    <>
                     
                      <svg
                        className="ml-2"
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
            </Buttons>
          </form>
        </div>
      </div>
    </motion.div>
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
