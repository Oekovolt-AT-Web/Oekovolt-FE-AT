"use client";
import React, {useState} from "react";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaPinterestP } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import Image from "next/image";
import CookieBanner from "../Cookies/cookiecomponent";

const Footer = () => {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const handleShowPopup = () => setIsPopupVisible(true);


  const currentYear = new Date().getFullYear();
  return (
    <div className="relative">
      <div className="w-full flex flex-wrap bg-pattern bg-mask">
        <div className="w-full  flex justify-end ">
          <div className="w-full h-[100px] relative overflow-hidden">
            <svg
            className="absolute top-0 left-0 w-full h-full"
            xmlns="http://www.w3.org/2000/svg"
            version="1.1"
            viewBox="0 -0.5 1024 178"
            preserveAspectRatio="none"
            fill="rgba(#669933)"
            aria-hidden="true"
            role="presentation"
            >
              <path d="M1024 177.371H0V.219l507.699 133.939L1024 .219v177.152z" fill="#e0f0d1" />
              <path d="M1024 177.781H0V39.438l507.699 94.925L1024 39.438v138.343z" fill="#c2e0a3" />
              <path d="M1024 177.781H0v-67.892l507.699 24.474L1024 109.889v67.892z" fill="#94c95e" />
              <path d="M1024 177.781H0v-3.891l507.699-39.526L1024 173.889v3.892z" fill="#669933" />
            </svg>
          </div>
        </div>
      </div>
      <footer className="bg-[#003473] text-white pt-8 pb-12" role="contentinfo" aria-label="Fußbereich Ökovolt Deutschland">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-4">
              <div className="relative w-[200px] h-[70px]">
                <Image
                  src="/Logo-Oekovolt-Gruen-mit-Weiss.webp"
                  alt="Ökovolt GmbH Solartechnik – Logo"
                  fill
                  sizes="200px"
                  className="object-contain"
                  title="Ökovolt Deutschland – Photovoltaik & Solaranlagen"
                />
              </div>
              {/* <p className="font-[400] text-[18px] mt-[-10]">ÖKOVOLT GmbH Solartechnik</p> */}
              <address className="not-italic text-[16px]">
                Schlingener Straße 1a
                <br />
                86842 Türkheim
                <br />
                Deutschland
              </address>
              <div className="border-t border-[#003473]/20">
                <p>&copy; {currentYear} ÖKOVOLT GmbH Solartechnik</p>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-[18px] font-[400] uppercase tracking-wider">Kontakt</h3>
              <hr className="border-t border-[#fffff]/30 my-3 " />
              <div className="space-y-6">
                <p>
                  <span className="font-medium text-[16px] ">Telefon</span>
                 <br/>
                  <a href="tel:+498245967880" className=" hover:text-[#669933] transition-colors text-[16px]">
                    +49 8245 96 788 0
                  </a>
                </p>
                <p>
                  <span className="font-medium">E-Mail</span>
                  <br />
                  <a href="mailto:office@oekovolt.com" className="hover:text-[#669933] transition-colors text-[16px]">
                    office@oekovolt.com
                  </a>
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-[18px] font-[400] uppercase tracking-wider">Öffnungzeiten</h3>
              <hr className="border-t border-[#fffff]/30 my-3 " />
              <div className="space-y-6 text-[16px]">
                <p>
                  Montag - Donnerstag
                  <br />
                  08:00 - 16:00
                </p>
                <p>
                  Freitag
                  <br />
                  08:00 - 13:00
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-4">
                <h3 className="text-[18px] font-[400] uppercase tracking-wider ">Folgen Sie Uns</h3>
                <hr className="border-t border-[#fffff]/30 my-3 " />
                <div className="flex space-y-2 space-x-5 my-6">
                  <a href="https://www.facebook.com/oekovoltdeutschland" target="_blank" rel="noopener noreferrer" aria-label="Ökovolt auf Facebook" className="text-xl hover:text-[#669933] transition-colors">
                    <FaFacebookF />
                  </a>
                  <a href="https://x.com/Oekovolt_De" target="_blank" rel="noopener noreferrer" aria-label="Ökovolt auf X (Twitter)" className="text-xl hover:text-[#669933] transition-colors">
                    <FaXTwitter />
                  </a>
                  <a href="https://www.instagram.com/oekovoltdeutschland/" target="_blank" rel="noopener noreferrer" aria-label="Ökovolt auf Instagram" className="text-xl hover:text-[#669933] transition-colors">
                    <FaInstagram />
                  </a>
                  <a href="https://de.pinterest.com/oekovoltdeutschland/" target="_blank" rel="noopener noreferrer" aria-label="Ökovolt auf Pinterest" className="text-xl hover:text-[#669933] transition-colors">
                    <FaPinterestP />
                  </a>
                  <a href="https://www.linkedin.com/company/%C3%B6kovoltdeutchland" target="_blank" rel="noopener noreferrer" aria-label="Ökovolt auf LinkedIn" className="text-xl hover:text-[#669933] transition-colors">
                    <FaLinkedinIn />
                  </a>
                </div>
              </div>

              <div>
                <h3 className="text-[18px] font-[400] uppercase tracking-wider">Weiterführende Links</h3>
                <hr className="border-t border-[#fffff]/30 my-3 " />
                <nav aria-label="Rechtliche Links">
                <ul className="space-y-2 text-[16px]">
                  <li>
                 <button onClick={handleShowPopup} className="hover:text-white cursor-pointer transition">Privatsphäre-Einstellungen</button>

                   
                  </li>
                  <li>
                    <a href="/agb" className="hover:text-[#669933] transition-colors">
                      AGB
                    </a>
                  </li>
                  <li>
                    <a href="/datenschutz" className="hover:text-[#669933] transition-colors">
                      Datenschutz
                    </a>
                  </li>
                  <li>
                    <a href="/impressum" className="hover:text-[#669933] transition-colors">
                      Impressum
                    </a>
                  </li>
                  <li>
                    <a href="https://oekovolt.integrityline.com/" target="_blank" rel="noopener noreferrer" className="hover:text-[#669933] transition-colors">
                      Hinweisgebersystem
                    </a>
                  </li>
                </ul>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </footer>  
      {isPopupVisible && (
        <CookieBanner forceShow={isPopupVisible} onClose={() => setIsPopupVisible(false)} />
      )}
    </div>
    
  );
};

export default Footer;