"use client"
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  DollarSign,
  CheckCircle,
  User,
  Mail,
  Phone,
  FileText,
  Upload,
  Send,
  AlertCircle,
  Briefcase,
  GraduationCap,
  Star,
  Building2
} from 'lucide-react';

// Mock job data for demonstration
const mockJobData = {
  title: "Senior Software Developer",
  ort: "Berlin, Deutschland",
  gehalt: "€65,000 - €85,000",
  beschreibung: "Wir suchen einen erfahrenen Software-Entwickler, der unser Team bei der Entwicklung innovativer Lösungen unterstützt. Sie werden an spannenden Projekten arbeiten und haben die Möglichkeit, modernste Technologien einzusetzen.",
  firmen_beschreibung: "Unser Unternehmen ist ein führender Anbieter von nachhaltigen Technologielösungen mit über 10 Jahren Erfahrung. Wir entwickeln innovative Software für die Energiebranche und setzen dabei auf modernste Technologien und agile Entwicklungsmethoden. Unser Team besteht aus leidenschaftlichen Entwicklern, die gemeinsam an der Zukunft der digitalen Transformation arbeiten.",
  deine_aufgaben: [
    { beschreibung: "Entwicklung und Wartung von React-Anwendungen" },
    { beschreibung: "Code-Reviews und Qualitätssicherung" },
    { beschreibung: "Zusammenarbeit mit dem Design-Team" },
    { beschreibung: "Mentoring von Junior-Entwicklern" }
  ],
  deine_qualifikationen: [
    { beschreibung: "3+ Jahre Erfahrung mit React und JavaScript" },
    { beschreibung: "Kenntnisse in TypeScript und Node.js" },
    { beschreibung: "Erfahrung mit agilen Entwicklungsmethoden" },
    { beschreibung: "Gute Kommunikationsfähigkeiten" }
  ],
  deine_vorteile: [
    { beschreibung: "Flexible Arbeitszeiten und Home-Office möglich" },
    { beschreibung: "Moderne Arbeitsplätze und neueste Technologien" },
    { beschreibung: "Weiterbildungsmöglichkeiten und Konferenzbesuche" },
    { beschreibung: "Teamevents und entspannte Arbeitsatmosphäre" }
  ]
};

const JobDetails = ({ jobData = mockJobData }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [file, setFile] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fileError, setFileError] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (selectedFile) => {
    if (selectedFile) {
      if (selectedFile.type !== "application/pdf") {
        setFileError("Bitte laden Sie nur PDF-Dateien hoch");
        setFile(null);
      } else {
        setFile(selectedFile);
        setFileError(null);
      }
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError("Bitte geben Sie Ihren Namen ein");
      return false;
    }
    if (!formData.email.trim() || !/^\S+@\S+\.\S+$/.test(formData.email)) {
      setError("Bitte geben Sie eine gültige E-Mail-Adresse ein");
      return false;
    }
    if (!formData.phone.trim()) {
      setError("Bitte geben Sie Ihre Telefonnummer ein");
      return false;
    }
    if (!formData.message.trim()) {
      setError("Bitte geben Sie eine Nachricht ein");
      return false;
    }
    if (!file) {
      setError("Bitte laden Sie Ihren Lebenslauf hoch");
      return false;
    }
    return true;
  };

  const handleApply = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    // Simulate API call
    setTimeout(() => {
      setShowSuccess(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
      });
      setFile(null);
      setLoading(false);

      setTimeout(() => {
        setShowSuccess(false);
      }, 5000);
    }, 2000);
  };

  if (!jobData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center p-8 rounded-2xl bg-white shadow-lg">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#669933] mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading job details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen ">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-10 md:py-16">
        {/* Header Section */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-block bg-gradient-to-r from-[#669933] to-[#7db33f] text-white px-6 py-2 rounded-full text-sm font-medium mb-4">
            Stellenausschreibung
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">{jobData.title}</h1>
          <div className="flex flex-wrap justify-center gap-8 text-lg">
            <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-full shadow-md">
              <MapPin className="text-[#669933] w-5 h-5" />
              <span className="text-gray-700 font-medium">{jobData.ort}</span>
            </div>
            <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-full shadow-md">
              <DollarSign className="text-[#669933] w-5 h-5" />
              <span className="text-gray-700 font-medium">{jobData.gehalt}</span>
            </div>
          </div>
        </motion.div>

        {/* Company Description */}
        {jobData.firmen_beschreibung && (
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="flex items-center gap-3 mb-6">
              {/* <div className="bg-[#669933] p-2 rounded-xl">
                <Building2 className="text-white w-6 h-6" />
              </div> */}
              <h2 className="text-2xl font-bold text-gray-800">Über Unser Unternehmen</h2>
            </div>
            <p className="text-gray-700 text-lg leading-relaxed">{jobData.firmen_beschreibung}</p>
          </motion.div>
        )}

        {/* Job Description */}
        <motion.div
          className="bg-white rounded-3xl shadow-xl p-8 mb-8 border-l-4 border-[#669933]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-[#669933] p-2 rounded-xl">
              <FileText className="text-white w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Stellenbeschreibung</h2>
          </div>
          <p className="text-gray-700 text-lg leading-relaxed">{jobData.beschreibung}</p>
        </motion.div>



        {/* Job Details Grid */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {/* Tasks */}
          {jobData.deine_aufgaben?.length > 0 && (
            <motion.div
              className="bg-white rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-r from-[#669933] to-[#7db33f] p-3 rounded-xl">
                  <Briefcase className="text-white w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Deine Aufgaben</h3>
              </div>
              <ul className="space-y-4">
                {jobData.deine_aufgaben.map((item, index) => (
                  <motion.li
                    key={index}
                    className="flex items-start gap-3 text-gray-700"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                  >
                    <CheckCircle className="text-[#669933] w-5 h-5 mt-0.5 flex-shrink-0" />
                    <span className="leading-relaxed">{item.beschreibung}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          )}

          {/* Qualifications */}
          {jobData.deine_qualifikationen?.length > 0 && (
            <motion.div
              className="bg-white rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-r from-[#669933] to-[#7db33f] p-3 rounded-xl">
                  <GraduationCap className="text-white w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Deine Qualifikationen</h3>
              </div>
              <ul className="space-y-4">
                {jobData.deine_qualifikationen.map((item, index) => (
                  <motion.li
                    key={index}
                    className="flex items-start gap-3 text-gray-700"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                  >
                    <CheckCircle className="text-[#669933] w-5 h-5 mt-0.5 flex-shrink-0" />
                    <span className="leading-relaxed">{item.beschreibung}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          )}

          {/* Benefits */}
          {jobData.deine_vorteile?.length > 0 && (
            <motion.div
              className="bg-white rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-r from-[#669933] to-[#7db33f] p-3 rounded-xl">
                  <Star className="text-white w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Deine Vorteile</h3>
              </div>
              <ul className="space-y-4">
                {jobData.deine_vorteile.map((item, index) => (
                  <motion.li
                    key={index}
                    className="flex items-start gap-3 text-gray-700"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.7 + index * 0.1 }}
                  >
                    <CheckCircle className="text-[#669933] w-5 h-5 mt-0.5 flex-shrink-0" />
                    <span className="leading-relaxed">{item.beschreibung}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          )}
        </div>

        {/* Application Form */}
        <motion.div
          className="max-w-7xl  bg-white rounded-3xl shadow-2xl p-8 border-t-4 border-[#669933]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <div className="text-center mb-8">
            {/* <div className="inline-block bg-gradient-to-r from-[#669933] to-[#7db33f] p-3 rounded-full mb-4">
              <Send className="text-white w-8 h-8" />
            </div> */}
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Jetzt Bewerben</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Senden Sie uns Ihre Bewerbung und werden Sie Teil unseres innovativen Teams.
              Wir freuen uns darauf, Sie kennenzulernen!
            </p>
          </div>

          <AnimatePresence>
            {showSuccess && (
              <motion.div
                className="flex items-center gap-3 bg-gradient-to-r from-green-50 to-green-100 border-2 border-[#669933] text-[#669933] px-6 py-4 rounded-2xl mb-6"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <CheckCircle className="w-6 h-6" />
                <span className="font-semibold text-lg">Vielen Dank! Ihre Bewerbung wurde erfolgreich eingereicht.</span>
              </motion.div>
            )}
            {error && (
              <motion.div
                className="flex items-center gap-3 bg-gradient-to-r from-red-50 to-red-100 border-2 border-red-400 text-red-700 px-6 py-4 rounded-2xl mb-6"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <AlertCircle className="w-6 h-6" />
                <span className="font-semibold text-lg">{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleApply} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Name Input */}
              <div className="relative group">
                <div className="flex items-center gap-3 bg-gray-50 border-2 border-gray-200 rounded-2xl px-4 py-4 transition-all duration-300 group-focus-within:border-[#669933] group-focus-within:bg-white group-focus-within:shadow-lg group-focus-within:shadow-green-100/50">
                  <User className="text-[#669933] w-5 h-5" />
                  <input
                    type="text"
                    name="name"
                    placeholder="Ihr vollständiger Name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full outline-none bg-transparent text-gray-800 placeholder-gray-500 text-lg"
                  />
                </div>
              </div>

              {/* Email Input */}
              <div className="relative group">
                <div className="flex items-center gap-3 bg-gray-50 border-2 border-gray-200 rounded-2xl px-4 py-4 transition-all duration-300 group-focus-within:border-[#669933] group-focus-within:bg-white group-focus-within:shadow-lg group-focus-within:shadow-green-100/50">
                  <Mail className="text-[#669933] w-5 h-5" />
                  <input
                    type="email"
                    name="email"
                    placeholder="Ihre E-Mail-Adresse"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full outline-none bg-transparent text-gray-800 placeholder-gray-500 text-lg"
                  />
                </div>
              </div>
            </div>

            {/* Phone Input */}
            <div className="relative group">
              <div className="flex items-center gap-3 bg-gray-50 border-2 border-gray-200 rounded-2xl px-4 py-4 transition-all duration-300 group-focus-within:border-[#669933] group-focus-within:bg-white group-focus-within:shadow-lg group-focus-within:shadow-green-100/50">
                <Phone className="text-[#669933] w-5 h-5" />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Ihre Telefonnummer"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full outline-none bg-transparent text-gray-800 placeholder-gray-500 text-lg"
                />
              </div>
            </div>

            {/* Message Textarea */}
            <div className="relative group">
              <div className="bg-gray-50 border-2 border-gray-200 rounded-2xl px-4 py-4 transition-all duration-300 group-focus-within:border-[#669933] group-focus-within:bg-white group-focus-within:shadow-lg group-focus-within:shadow-green-100/50">
                <textarea
                  name="message"
                  rows="5"
                  placeholder="Erzählen Sie uns von sich und warum Sie sich für diese Position interessieren..."
                  required
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full outline-none bg-transparent text-gray-800 placeholder-gray-500 resize-none text-lg leading-relaxed"
                />
              </div>
            </div>

            {/* File Upload */}
            <div className="relative">
              <input
                type="file"
                id="file-upload"
                className="hidden"
                onChange={(e) => handleFileChange(e.target.files[0])}
                accept=".pdf"
              />
              <div
                className={`border-2 border-dashed rounded-2xl p-10 text-center transition-all duration-300 cursor-pointer ${dragActive
                    ? 'border-[#669933] bg-green-50 scale-105'
                    : file
                      ? 'border-[#669933] bg-green-50'
                      : 'border-gray-300 hover:border-[#669933] hover:bg-green-50/50'
                  }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => document.getElementById('file-upload').click()}
              >
                <Upload className={`w-16 h-16 mx-auto mb-4 ${file ? 'text-[#669933]' : 'text-gray-400'}`} />
                <div className="text-xl font-semibold text-gray-700 mb-2">
                  {file ? file.name : 'Lebenslauf hochladen'}
                </div>
                <div className="text-gray-500 text-lg">
                  {file ? 'Klicken oder ziehen Sie eine neue Datei hierher' : 'Klicken oder ziehen Sie Ihre PDF-Datei hierher'}
                </div>
                <div className="text-sm text-gray-400 mt-2">
                  Nur PDF-Dateien werden akzeptiert
                </div>
              </div>
              {fileError && (
                <p className="text-red-500 text-lg mt-3 flex items-center gap-2 justify-center">
                  <AlertCircle className="w-5 h-5" />
                  {fileError}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#669933] to-[#7db33f] text-white py-2 md:py-5 px-3 md:px-8 rounded-2xl md:font-bold text-lg  md:text-xl shadow-xl hover:shadow-2xl transform transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:transform-none disabled:cursor-not-allowed"
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
            >
              <div className="flex items-center justify-center gap-3">
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white"></div>
                    <span>Wird gesendet...</span>
                  </>
                ) : (
                  <>
                    <span className='' >Bewerbung Absenden</span>
                    <Send className="w-6 h-6" />
                  </>
                )}
              </div>
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default JobDetails;