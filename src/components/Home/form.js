"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { submitAnfrage } from "@/lib/api/anfrage/create_anfrage";
import FadeInView from "@/components/Reusable/FadeInView";

export default function PVInquiryForm({ data }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    roofType: "",
    isOwner: "",
    powerConsumption: 9000,
    firstName: "",
    lastName: "",
    email: "",
    zipCode: "",
    city: "",
    phone: "",
    acceptTerms: false,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [hasMounted, setHasMounted] = useState(false);
  const [animatingStep, setAnimatingStep] = useState(null);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const handleSubmit = async () => {
    if (!validateFields()) return;

    setLoading(true);
    try {
      const payload = {
        welche_dachform_hat_dein_haus: formData.roofType,
        bist_du_eigentümer_der_immobilie:
          formData.isOwner === "yes" ? "Eigentümer" : "Nicht Eigentümer",
        wieviel_stromverbrauch_hast_du_im_jahr: `Jährlicher Stromverbrauch: ${formData.powerConsumption} kWh`,
        nachname: formData.lastName,
        vorname: formData.firstName,
        e_mail: formData.email,
        telefonnummer: formData.phone,
        plz: formData.zipCode,
        ort: formData.city,
        allgemeine_geschäftsbedingungen: formData.acceptTerms ? 1 : 0,
      };

      const response = await submitAnfrage(payload);
      setStep(5);
      setSubmitStatus("success");

      setTimeout(() => {
        setFormData({
          roofType: "",
          isOwner: "",
          powerConsumption: 9000,
          firstName: "",
          lastName: "",
          email: "",
          zipCode: "",
          city: "",
          phone: "",
          acceptTerms: false,
        });
        setErrors({});
        setStep(1);
        setSubmitStatus(null);
      }, 5000);
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitStatus("error");
    } finally {
      setLoading(false);
    }
  };

  const validateFields = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+?[0-9\s\-]{7,20}$/;

    if (!formData.firstName.trim())
      newErrors.firstName = "Vorname ist erforderlich";
    if (!emailRegex.test(formData.email))
      newErrors.email = "Ungültige E-Mail-Adresse";
    if (!formData.zipCode.trim())
      newErrors.zipCode = "Postleitzahl ist erforderlich";
    if (!formData.city.trim()) newErrors.city = "Ort ist erforderlich";
    if (!phoneRegex.test(formData.phone))
      newErrors.phone = "Ungültige Telefonnummer";
    if (!formData.acceptTerms)
      newErrors.acceptTerms = "Sie müssen die Bedingungen akzeptieren";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    setAnimatingStep("next");
    setTimeout(() => {
      setStep((prev) => prev + 1);
      setAnimatingStep(null);
    }, 200);
  };

  const prevStep = () => {
    setAnimatingStep("prev");
    setTimeout(() => {
      setStep((prev) => prev - 1);
      setAnimatingStep(null);
    }, 200);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: null }));

    if (name === "roofType" && step === 1) nextStep();
    if (name === "isOwner" && step === 2) nextStep();
  };

  const roofTypes = [
    { id: "pultdach", label: "Pultdach", image: "/Images/Home/pultdach.png" },
    { id: "flachdach", label: "Flachdach", image: "/Images/Home/flachdach.png" },
    { id: "satteldach", label: "Satteldach", image: "/Images/Home/satteldach.png" },
    { id: "other", label: "Sonstiges", image: "/Images/Home/sonstiges.png" },
  ];

  const getStepAnimation = () => {
    if (animatingStep === "next") return "slide-out-left";
    if (animatingStep === "prev") return "slide-out-right";
    return "slide-in";
  };

  return (
    <div className="px-6 md:px-12 max-w-4xl mx-auto p-6 bg-white overflow-hidden">
      <h2
        className={`text-[25px] mb-6 text-[#669933] text-center transition-all duration-700 ${hasMounted ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
          }`}
      >
        Jetzt kostenloses Angebot für Ihre Solaranlage anfordern
      </h2>

      <div className="mb-6">
        <div className="flex mb-2">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={`flex-1 h-2 mx-1 rounded-full transition-all duration-300 ${i <= step ? "bg-[#669933]" : "bg-gray-200"
                }`}
            />
          ))}
        </div>
      </div>

      {/* Step 1 */}
      {step === 1 && (
        <div
          key="step1"
          className={`transition-all duration-300 ${animatingStep === null ? "animate-slide-in-right" : ""
            } ${animatingStep === "next" ? "animate-slide-out-left" : ""}`}
        >
          <h2 className="text-[20px] lg:text-[24px] mb-4 text-center">
            {data?.first_step_title}
          </h2>
          <p className="text-gray-600 mb-6 text-[16px] lg:text-[20px] text-center">
            {data?.first_step_description}
          </p>

          <div className="lg:mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 items-stretch">
            {roofTypes.map((type) => (
              <div key={type.id} className="group">
                <label
                  className={`flex flex-col items-center p-4 border-2 rounded-lg cursor-pointer transition-all h-full ${formData.roofType === type.id
                    ? "border-[#669933] bg-[#669933]/10"
                    : "border-gray-200 hover:border-[#669933]/50"
                    }`}
                >
                  <input
                    type="radio"
                    name="roofType"
                    value={type.id}
                    checked={formData.roofType === type.id}
                    onChange={handleChange}
                    className="hidden"
                  />
                  <Image
                    src={type.image}
                    alt={type.label}
                    width={100}
                    height={100}
                    className="mb-3 rounded-full object-cover"
                  />
                  <span className="font-medium text-center">{type.label}</span>
                </label>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step 2 */}
      {step === 2 && (
        <div
          key="step2"
          className={`transition-all duration-300 ${animatingStep === null ? "animate-slide-in-right" : ""
            } ${animatingStep === "next" ? "animate-slide-out-left" : ""} ${animatingStep === "prev" ? "animate-slide-out-right" : ""
            }`}
        >
          <h2 className="text-[20px] lg:text-[24px] font-semibold mb-4 text-center">
            {data?.second_step_title}
          </h2>
          <p className="text-gray-600 mb-6 text-[16px] lg:text-[20px] text-center">
            {data?.second_step_description}
          </p>
          <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2">
            {[
              { id: "yes", label: "Ja", image: "/Images/Home/ja.png" },
              { id: "no", label: "Nein", image: "/Images/Home/nein.png" },
            ].map((option) => (
              <div key={option.id} className="group">
                <label
                  className={`flex flex-col items-center p-4 border-2 rounded-lg cursor-pointer transition-all h-full ${formData.isOwner === option.id
                    ? "border-[#669933] bg-[#669933]/10"
                    : "border-gray-200 hover:border-[#669933]/50"
                    }`}
                >
                  <input
                    type="radio"
                    name="isOwner"
                    value={option.id}
                    checked={formData.isOwner === option.id}
                    onChange={handleChange}
                    className="hidden"
                  />
                  <Image
                    src={option.image}
                    alt={option.label}
                    width={100}
                    height={100}
                    className="mb-3 rounded-full object-cover"
                  />
                  <span className="font-medium text-center">{option.label}</span>
                </label>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step 3 */}
      {step === 3 && (
        <div
          key="step3"
          className={`transition-all duration-300 ${animatingStep === null ? "animate-slide-in-right" : ""
            } ${animatingStep === "next" ? "animate-slide-out-left" : ""} ${animatingStep === "prev" ? "animate-slide-out-right" : ""
            }`}
        >
          <h2 className="text-[20px] lg:text-[24px] font-semibold mb-4 text-center">
            {data?.third_step_title}
          </h2>
          <p className="text-gray-600 mb-6 text-[16px] lg:text-[20px] text-center">
            {data?.third_step_description}
          </p>

          <div className="mb-8">
            <input
              type="range"
              name="powerConsumption"
              id="powerConsumption"
              min="1000"
              max="20000"
              step="100"
              value={formData.powerConsumption}
              onChange={handleChange}
              aria-label="Jährlicher Stromverbrauch"
              aria-valuemin={1000}
              aria-valuemax={20000}
              aria-valuenow={formData.powerConsumption}
              aria-valuetext={`${formData.powerConsumption} kWh pro Jahr`}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="text-center mt-4 text-[20px] lg:text-[24px] font-semibold">
              {formData.powerConsumption} kWh pro Jahr
            </div>
          </div>

          <div className="flex justify-between">
            <button
              onClick={prevStep}
              className="px-6 py-2 cursor-pointer border-2 border-gray-300 rounded-md hover:bg-gray-50 text-[16px]"
            >
              ZURÜCK
            </button>
            <button
              onClick={nextStep}
              className="px-6 cursor-pointer py-2 bg-[#669933]/90 hover:bg-[#669933] text-white rounded-md text-[16px]"
            >
              NÄCHSTE
            </button>
          </div>
        </div>
      )}

      {/* Step 4 */}
      {step === 4 && (
        <div
          key="step4"
          className={`transition-all duration-300 ${animatingStep === null ? "animate-slide-in-right" : ""
            } ${animatingStep === "prev" ? "animate-slide-out-right" : ""}`}
        >
          <h2 className="text-[20px] lg:text-[24px] font-bold mb-2 text-center">
            {data?.fourth_step_title}
          </h2>
          <p className="text-gray-600 mb-6 text-[16px] lg:text-[20px] text-center">
            {data?.fourth_step_description}
          </p>

          <div className="space-y-4 mb-6">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                Vorname *
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md"
              />
              {errors.firstName && (
                <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
              )}
            </div>

            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                Nachname
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
                  Postleitzahl *
                </label>
                <input
                  type="text"
                  id="zipCode"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md"
                />
                {errors.zipCode && (
                  <p className="text-red-500 text-sm mt-1">{errors.zipCode}</p>
                )}
              </div>

              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                  Ort *
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md"
                />
                {errors.city && (
                  <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Telefonnummer *
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md"
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
              )}
            </div>

            <label className="flex items-start mt-4 cursor-pointer text-sm text-gray-600">
              <input
                type="checkbox"
                name="acceptTerms"
                checked={formData.acceptTerms}
                onChange={handleChange}
                className="mr-2 mt-1"
              />
              Ich akzeptiere die Datenschutzbestimmungen und AGB
            </label>

            {errors.acceptTerms && (
              <p className="text-red-500 text-sm mt-1">{errors.acceptTerms}</p>
            )}
          </div>

          <div className="flex justify-between flex-col gap-2 lg:flex-row lg:gap-0 md:flex-row md:gap-0">
            <button
              onClick={prevStep}
              className="px-6 py-2 cursor-pointer border-2 border-gray-300 rounded-md hover:bg-gray-50 text-[16px]"
            >
              ZURÜCK
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`px-6 py-2 rounded-md cursor-pointer text-[16px] ${loading
                ? "bg-gray-400 text-white cursor-wait"
                : "bg-[#669933]/90 hover:bg-[#669933] text-white"
                }`}
            >
              {loading ? "Wird gesendet..." : "JETZT ANGEBOT ANFORDERN"}
            </button>
          </div>
        </div>
      )}

      {/* Step 5 - Success */}
      {step === 5 && (
        <div
          key="step5"
          className="text-center py-8 transition-all duration-300 animate-fade-in"
        >
          <h2 className="text-2xl font-bold text-[#669933] mb-4">
            Vielen Dank für Ihre Anfrage!
          </h2>
          <p className="text-lg text-gray-700">
            Wir haben Ihre Anfrage erhalten und werden uns schnellstmöglich
            bei Ihnen melden.
          </p>
        </div>
      )}

      {/* Add CSS animations */}
      <style jsx>{`
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideOutLeft {
          from {
            opacity: 1;
            transform: translateX(0);
          }
          to {
            opacity: 0;
            transform: translateX(-50px);
          }
        }

        @keyframes slideOutRight {
          from {
            opacity: 1;
            transform: translateX(0);
          }
          to {
            opacity: 0;
            transform: translateX(50px);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-slide-in-right {
          animation: slideInRight 0.3s ease-out forwards;
        }

        .animate-slide-out-left {
          animation: slideOutLeft 0.2s ease-out forwards;
        }

        .animate-slide-out-right {
          animation: slideOutRight 0.2s ease-out forwards;
        }

        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}