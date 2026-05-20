"use client";
import React, { useState, useEffect } from "react";
import { FiMenu, FiX, FiChevronDown, FiChevronUp } from "react-icons/fi";
import Link from "next/link";
import Image from "next/image";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [hoverDropdown, setHoverDropdown] = useState(null);

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
          name: "Direktvermaktung",
          slug: "direktvermaktung",
          link: "/service/direktvermaktung",
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
          slug: "richtlinen",
          link: "/forderungen/richtlinen",
        },
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
    { title: "Faqs", slug: "faqs", link: "/faqs" },
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
    <header className="static  top-0 bg-white w-full z-150">
      <div className="max-w-7xl mx-auto flex justify-between items-center py-5 px-4">
        {/* Logo - kept exactly as in your original */}
        <div className="w-[180px]">
          <Link href="/" className="flex items-center h-16 relative" onClick={closeMobileMenu}>
            <div style={{ width: 180, height: 64, position: "relative" }}>
              <Image
                src="/Images/Navbar/logo.png"
                alt="Logo"
                fill
                loading="eager"
                style={{ objectFit: "contain" }}
                sizes="(max-width: 1280px) 100vw, 1280px"

              />
            </div>


          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden xl:flex items-center justify-center">
          <ul className="flex gap-8 list-none m-0 p-0 justify-center">
            {navItems.map((item) => (
              <li
                key={item.title}
                className="nav-item relative flex items-center gap-1"
                onMouseEnter={() => handleMouseEnter(item.title)}
                onMouseLeave={handleMouseLeave}
              >
                {item.items ? (
                  <>
                    <Link
                      href="#"
                      className="text-gray text-[14px] uppercase hover:text-[#669933] transition-colors flex items-center gap-1"
                      onClick={(e) => {
                        e.preventDefault();
                        toggleDropdown(item.title);
                      }}
                    >
                      {item.title}
                      {hoverDropdown === item.title ? (
                        <FiChevronUp size={14} />
                      ) : (
                        <FiChevronDown size={14} />
                      )}
                    </Link>
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
                    className="text-gray text-[14px]  uppercase hover:text-[#669933] transition-colors"
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
          {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
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
              <FiX size={24} />
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
                        <FiChevronUp size={16} />
                      ) : (
                        <FiChevronDown size={16} />
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