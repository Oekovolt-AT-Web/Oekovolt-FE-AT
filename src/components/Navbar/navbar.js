"use client";
import React, { useState, useEffect } from "react";
import { Menu, X, ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [hoverDropdown, setHoverDropdown] = useState(null);
  // Header bleibt beim Scrollen stehen und wird dabei schlanker.
  const [gescrollt, setGescrollt] = useState(false);

  // Offenes Mobilmenü: Seite dahinter nicht mitscrollen lassen und
  // schwebende Elemente (CTA-Leiste, Nach-oben-Button) ausblenden – sie
  // lagen sonst über dem Menü.
  useEffect(() => {
    document.body.classList.toggle("ov-menu-offen", isOpen);
    return () => document.body.classList.remove("ov-menu-offen");
  }, [isOpen]);

  useEffect(() => {
    const pruefen = () => setGescrollt(window.scrollY > 12);
    pruefen();
    window.addEventListener("scroll", pruefen, { passive: true });
    return () => window.removeEventListener("scroll", pruefen);
  }, []);

  const toggleDropdown = (name) => {
    setOpenDropdown((prev) => (prev === name ? null : name));
  };

  const closeMobileMenu = () => {
    setIsOpen(false);
    setOpenDropdown(null);
  };

  const handleMouseLeave = () => {
    setHoverDropdown(null);
  };

  const handleMouseEnter = (name) => {
    setHoverDropdown(name);
  };

  const navItems = [
    {
      title: "Dienstleistungen",
      slug: "dienstleistungen",
      items: [
        {
          name: "Photovoltaik",
          slug: "photovoltaik",
          link: "/dienstleistungen/photovoltaik",
        },
        {
          name: "Smarthome",
          slug: "smarthome",
          link: "/dienstleistungen/smarthome",
        },
      ],
    },
    {
      title: "Produkte",
      slug: "produkte",
      items: [
        {
          name: "Smart Energy Home",
          slug: "smartenergyhome",
          link: "/produkte/smartenergyhome",
        },
        {
          name: "Photovoltaikanlage",
          slug: "photovoltaikanlage",
          link: "/produkte/photovoltaikanlage",
        },
        {
          name: "Stromspeicher",
          slug: "stromspeicher",
          link: "/produkte/stromspeicher",
        },
        {
          name: "Wärmepumpe",
          slug: "warmepumpe",
          link: "/produkte/warmepumpe",
        },
        {
          name: "Wallbox",
          slug: "wallbox",
          link: "/produkte/wallbox",
        },
        {
          name: "Smart Meter",
          slug: "smartmeter",
          link: "/produkte/smartmeter",
        },
        {
          name: "Mieterstrom",
          slug: "mieterstrom",
          link: "/produkte/mieterstrom",
        },
        {
          name: "Hersteller",
          slug: "hersteller",
          link: "/produkte/hersteller",
        },
      ],
    },
    {
      title: "Service",
      slug: "service",
      items: [
        {
          name: "Oekovolt Vorteilswelt",
          slug: "vorteilswelt",
          link: "/service/vorteilswelt",
        },
        {
          name: "Finanzierung",
          slug: "finanzierung",
          link: "/service/finanzierung",
        },
        {
          name: "Dynamischer Stromtarif",
          slug: "stromtarif",
          link: "/service/stromtarif",
        },
        {
          name: "Photovoltaik Repowering",
          slug: "repowering",
          link: "/service/repowering",
        },
        {
          name: "Direktvermarktung",
          slug: "direktvermarktung",
          link: "/service/direktvermarktung",
        },
      ],
    },
    {
      title: "Referenzen",
      slug: "referenzen",
      items: [
        { name: "Projekte", slug: "projekte", link: "/referenzen/projekte" },
        {
          name: "Referenzkarte",
          slug: "referenzkarte",
          link: "/referenzen/referenzkarte",
        },
      ],
    },
    {
      title: "Förderungen",
      slug: "forderungen",
      items: [
        {
          name: "Landesförderungen",
          slug: "landes",
          link: "/forderungen/landesforderungen",
        },
        {
          name: "Steuerlich",
          slug: "steuerlich",
          link: "/forderungen/steuerlich",
        },
        {
          name: "Baurecht",
          slug: "baurecht",
          link: "/forderungen/baurecht",
        },
        {
          name: "Richtlinien",
          slug: "richtlinien",
          link: "/forderungen/richtlinien",
        },
      ],
    },
    {
      title: "Wissen",
      slug: "wissen",
      items: [
        { name: "Solarrechner", slug: "solarrechner", link: "/solarrechner" },
        { name: "Ratgeber", slug: "ratgeber", link: "/ratgeber" },
        { name: "FAQs", slug: "faqs", link: "/faqs" },
      ],
    },
    {
      title: "Über Uns",
      slug: "uber-uns",
      items: [
        { name: "Team", slug: "team", link: "/uber-uns/team" },
        { name: "Jobs", slug: "jobs", link: "/uber-uns/jobs" },
      ],
    },
    { title: "Kontakt", slug: "kontakt", link: "/kontakt" },
  ];

  useEffect(() => {
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.overscrollBehavior = "none";
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    } else {
      document.body.style.overflow = "";
      document.body.style.overscrollBehavior = "";
      document.body.style.paddingRight = "";
    }
  }, [isOpen]);


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (hoverDropdown && !event.target.closest(".nav-item")) {
        setHoverDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [hoverDropdown]);

  return (
    <header className="sticky top-0 z-[100] w-full">
      {/* Hintergrund als eigene Ebene: backdrop-filter direkt am <header>
          würde das fixierte Mobilmenü (ein Kind des Headers) relativ zum
          Header statt zum Viewport positionieren. */}
      <div
        aria-hidden="true"
        className={`absolute inset-0 -z-10 transition-[background-color,box-shadow,backdrop-filter] duration-300 ${
          gescrollt
            ? "bg-white md:bg-white/95 shadow-[0_1px_0_rgba(15,23,42,0.06),0_8px_24px_-12px_rgba(15,23,42,0.18)] backdrop-blur-xl backdrop-saturate-150"
            : "bg-white"
        }`}
      />
      <div
        className={`max-w-7xl mx-auto flex justify-between items-center px-4 transition-[padding] duration-300 ${
          gescrollt ? "py-2" : "py-5"
        }`}
      >
        {/* Logo - kept exactly as in your original */}
        <div className="w-45">
          <Link
            href="/"
            aria-label="Ökovolt Solartechnik – zur Startseite"
            className="flex items-center h-16 relative"
            onClick={closeMobileMenu}
          >
            <div
              className={`origin-left transition-transform duration-300 ${gescrollt ? "scale-[0.82]" : "scale-100"}`}
              style={{ width: 180, height: 64, position: "relative" }}
            >
              <Image
                src="/Images/Navbar/logo.png"
                alt="Ökovolt Solartechnik Deutschland"
                fill
                priority
                style={{ objectFit: "contain" }}
                // Vorher "100vw, 1280px": für ein 180 px breites Logo wurde
                // ein bis zu 1280 px breites Bild angefordert.
                sizes="180px"
              />
            </div>


          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden xl:flex items-center justify-center pl-8">
          <ul className="flex gap-6 list-none m-0 p-0 justify-center">
            {navItems.map((item) => (
              <li
                key={item.title}
                className="nav-item relative flex items-center gap-1"
                onMouseEnter={() => handleMouseEnter(item.title)}
                onMouseLeave={handleMouseLeave}
              >
                {item.items ? (
                  <>
                    {/* Button statt <a href="#">: der Auslöser navigiert nicht,
                        sondern klappt nur auf. Als Link erzeugte er einen toten
                        Treffer pro Menüpunkt und wurde Screenreadern falsch
                        als Link angesagt. Die Mobil-Variante nutzt schon länger
                        einen Button. */}
                    <button
                      type="button"
                      aria-expanded={hoverDropdown === item.title}
                      className="text-gray text-[14px] uppercase whitespace-nowrap hover:text-[#669933] transition-colors flex items-center gap-1 cursor-pointer"
                      // Sichtbarkeit haengt am hoverDropdown-State. Der Klick
                      // setzte bisher openDropdown - den liest das Desktop-Menue
                      // nirgends, deshalb liessen sich die Dropdowns nur per
                      // Maus-Hover oeffnen, nicht per Klick oder Tastatur.
                      onClick={() =>
                        setHoverDropdown((prev) =>
                          prev === item.title ? null : item.title
                        )
                      }
                    >
                      {item.title}
                      {hoverDropdown === item.title ? (
                        <ChevronUp size={14} />
                      ) : (
                        <ChevronDown size={14} />
                      )}
                    </button>
                    <div
                      className={`absolute left-1/2 -translate-x-1/2 top-full w-[190px] bg-white rounded shadow-lg py-1 z-50 transition-all duration-300 ${hoverDropdown === item.title
                          ? "opacity-100 visible translate-y-0"
                          : "opacity-0 invisible translate-y-2"
                        }`}
                    >
                      {item.items.map((subItem) => (
                        <Link
                          key={subItem.name}
                          href={subItem.link}
                          className="block px-4 py-2 text-gray text-[14px]   border-b border-white/10 hover:text-[#669933] transition-colors"
                          onClick={() => setHoverDropdown(null)}
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  </>
                ) : (
                  <Link
                    href={item.link}
                    className="text-gray text-[14px] uppercase whitespace-nowrap hover:text-[#669933] transition-colors"
                  >
                    {item.title}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="xl:hidden p-2 text-gray"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Mobile Menu Overlay */}
        <div
          className={`fixed inset-0 bg-white top-[-5] z-40 transition-transform duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"
            } xl:hidden`}
        >
          <div className="flex justify-between items-center p-5 border-b border-white/10">
            <div className="w-[180px]">
              <Link href="/" className="flex items-center h-16 relative" onClick={closeMobileMenu}>
                <div style={{ width: 180, height: 64, position: "relative" }}>
                  <Image
                    src="/Images/Navbar/logo.png"
                    alt="Logo"
                    fill
                    style={{ objectFit: "contain" }}
                    sizes="(max-width: 1280px) 100vw, 1280px"

                  />
                </div>


              </Link>
            </div>
            <button
              className="text-gray p-1"
              onClick={closeMobileMenu}
              aria-label="Close menu"
            >
              <X size={24} />
            </button>
          </div>

          <div className="p-5 overflow-y-auto h-[calc(100vh-95px)] bg-white">
            {navItems.map((item) => (
              <div key={item.title} className="mb-2 border-b border-white/10">
                {item.items ? (
                  <>
                    <button
                      onClick={() => toggleDropdown(item.title)}
                      className="flex justify-between items-center w-full py-3 text-gray uppercase text-[15px]"
                    >
                      {item.title}
                      {openDropdown === item.title ? (
                        <ChevronUp size={16} />
                      ) : (
                        <ChevronDown size={16} />
                      )}
                    </button>
                    <div
                      className={`overflow-hidden transition-all duration-300 ${openDropdown === item.title ? "max-h-[500px]" : "max-h-0"
                        }`}
                    >
                      <div className="pb-2 pl-3">
                        {item.items.map((subItem) => (
                          <Link
                            key={subItem.name}
                            href={subItem.link}
                            className="block py-3 text-gray  text-[15px] hover:text-[#669933]"
                            onClick={closeMobileMenu}
                          >
                            {subItem.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <Link
                    href={item.link}
                    className="block py-3 text-gray uppercase  text-[15px]"
                    onClick={closeMobileMenu}
                  >
                    {item.title}
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;