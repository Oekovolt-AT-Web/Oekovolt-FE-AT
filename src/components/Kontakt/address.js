import React from "react";
import { Phone, MapPin, Clock, Mail } from "lucide-react";
import Image from "next/image";
import { FIRMA } from "@/lib/site";

const ContactSection = () => {
  return (
    <section className="relative py-10 md:py-16 bg-white overflow-hidden px-6 md:px-12">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-32 bg-[#669933] opacity-0"></div>
      <div className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full bg-[#669933] opacity-5"></div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header section */}
        <div className="text-center mb-9 md:mb-19">
          <span className="inline-block px-4 py-2 mb-4 text-sm font-semibold tracking-widest text-[#669933] uppercase rounded-full ">
            Kontakt
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Wir sind für Sie da
          </h2>
          <p className="max-w-2xl mx-auto text-xl text-gray-600 ">
            Persönlicher Service und kompetente Beratung - direkt bei Ihnen vor Ort.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          {/* Contact cards */}
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 md:gap-6 gap-10">
              {/* Phone & Email */}
              <div className="relative bg-white p-8 rounded-2xl shadow-xl border border-gray-100 transform transition-all hover:-translate-y-2">
                <div className="absolute -top-5 left-6 w-12 h-12 rounded-xl bg-[#669933] text-white flex items-center justify-center shadow-lg">
                  <Phone className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 mt-2">Telefon & E-Mail</h3>
                <div className="space-y-3">
                  <a href={FIRMA.telefonHref} className="flex items-center gap-3 text-gray-700 hover:text-[#669933] transition-colors">
                    <Phone className="h-4 w-4 opacity-70" />
                    {FIRMA.telefon}
                  </a>
                  <a href="mailto:office@oekovolt.com" className="flex items-center gap-3 text-gray-700 hover:text-[#669933] transition-colors">
                    <Mail className="h-4 w-4 opacity-70" />
                    office@oekovolt.com
                  </a>
                </div>
              </div>

              {/* Address */}
              <div className="relative bg-white p-8 rounded-2xl shadow-xl border border-gray-100 transform transition-all hover:-translate-y-2">
                <div className="absolute -top-5 left-6 w-12 h-12 rounded-xl bg-[#669933] text-white flex items-center justify-center shadow-lg">
                  <MapPin className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 mt-2">Adresse</h3>
                <div className="space-y-3 text-gray-700">
                  <p>{FIRMA.strasse}</p>
                  <p>{FIRMA.plz} {FIRMA.ort}</p>
                  <p>{FIRMA.land}</p>
                </div>
              </div>

              {/* Hours */}
              <div className="relative bg-white p-8 rounded-2xl shadow-xl border border-gray-100 transform transition-all hover:-translate-y-2 md:col-span-2">
                <h3 className="text-xl font-bold text-gray-900 mb-4 mt-2">Öffnungszeiten</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-gray-700">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-xl bg-[#669933] text-white flex items-center justify-center shadow-lg">
                      <Clock className="text-white h-5 w-5 " />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">Wochentage</h4>
                      <p>{FIRMA.oeffnungszeiten[0].tage}: {FIRMA.oeffnungszeiten[0].zeit}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-xl bg-[#669933] text-white flex items-center justify-center shadow-lg">
                      <Clock className="text-white h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">Freitag</h4>
                      <p>{FIRMA.oeffnungszeiten[1].zeit}</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>


          </div>

          {/* Image with decorative frame */}
          <div className="relative">
            <div className="relative h-96 rounded-3xl overflow-hidden shadow-2xl z-10">
              <Image
                src="/Images/Kontakt/download-1.jpg"
                alt={`Firmensitz von ${FIRMA.name} in ${FIRMA.ort} (${FIRMA.bundesland})`}
                fill
                className="object-cover"
                loading="eager"
                sizes="100vw"

              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
            </div>
            <div className="hidden lg:block absolute -bottom-[-25px] -right-6 w-32 h-32  border-4 border-[#669933] rounded-lg z-10 opacity-50"></div>
            <div className="hidden lg:block absolute -top-6 -left-6 w-24 h-24 border-4 border-[#669933] rounded-lg z-10 opacity-50"></div>
            <p className="text-center text-gray-600 mt-8 text-sm italic">
              Firmensitz in {FIRMA.ort} ({FIRMA.bundesland})
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;