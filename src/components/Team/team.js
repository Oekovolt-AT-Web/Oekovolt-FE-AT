"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { HiPhone } from "react-icons/hi";
import { MdEmail } from "react-icons/md";
import { API_BASE_URL } from "@/lib/apiBaseUrl";
import { API_IMG_URL } from "@/lib/apiImgUrl";
import Image from "next/image";  // <-- Import Image here

const TeamMember = ({ member, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      className="relative w-full gap-8 bg-white  rounded-xl overflow-hidden shadow-xl group "
    >
      {/* Green top border */}
      <div className="absolute top-0 left-0 w-full h-2 bg-[#669933] z-10" />

      {/* Green bottom border */}
      <div className="absolute bottom-0 left-0 w-full h-2 bg-[#669933] z-10" />

      {/* Image with slight dark overlay */}
      <div className="relative w-full h-100">
        <Image
          src={member.image}
          alt={member.name || "Team member"}
          fill
          className="object-cover brightness-100 group-hover:scale-105 transition-transform duration-500 rounded-md"
                sizes="100vw"
          priority
        />
        <div className="absolute inset-0  transition-all duration-300" />
      </div>

      {/* Info */}
      <div className="p-4 text-gray-600">
        <h3 className="text-lg font-bold hover:text-[#669933]">{member.name}</h3>
        <p className="text-sm text-gray-600">{member.position}</p>

        {/* Contact */}
        <div className="flex gap-3 mt-4 mb-4">
          {member.phone && (
            <a
              href={`tel:${member.phone}`}
              className="border-2 border-[#669933] hover:bg-[#669933] text-[#669933] hover:text-white p-2 rounded-full transition-all"
              title="Call"
            >
              <HiPhone className="w-5 h-5" />
            </a>
          )}
          {member.email && (
            <a
              href={`mailto:${member.email}`}
              className="border-2 border-[#669933] hover:bg-[#669933] text-[#669933] hover:text-white p-2 rounded-full transition-all"
              title="Email"
            >
              <MdEmail className="w-5 h-5" />
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const TeamSection = () => {
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}oekovoltdeutchland.oekovoltdeutchland.doctype.teamde.api.teamde_data`
        );
        if (!response.ok) throw new Error("Error fetching team");
        const data = await response.json();
        const formatted = data.message.map((person) => ({
          name: person.vorname || person.name1 || person.name || "",
          email: person.e_mail,
          phone: person.telefon,
          image: `${API_IMG_URL}${person.bild_anhagen}`,
          status: person.status,
          position: person.rolle,
          bio: person.bio || "", // Optional bio if available
        }));
        setTeams(formatted);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchTeam();
  }, []);


  return (
    teams.length > 0 && (
    <section className="py-10 md:py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold text-center text-[#333] mb-12"
        >
          Unser Team
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-10 justify-items-center">
          {teams.map((member, index) => (
            <TeamMember key={index} member={member} index={index} />
          ))}
        </div>
      </div>
    </section>
    )
  );
};

export default TeamSection;
