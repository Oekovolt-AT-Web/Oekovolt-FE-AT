"use client";
import React, { useState, useEffect } from "react";
import { Phone, Mail } from "lucide-react";
import Image from "next/image";
import { getTeam } from "@/lib/api/team/team_api";
import FadeInView from "@/components/Reusable/FadeInView";

const TeamMember = ({ member, index }) => {
  return (
    <FadeInView
      direction="bottom"
      distance={20}
      duration={600}
      delay={index * 200}
      className="relative w-full gap-8 bg-white rounded-xl overflow-hidden shadow-xl group"
    >
      {/* Green top border */}
      <div className="absolute top-0 left-0 w-full h-2 bg-[#669933] z-10" />

      {/* Green bottom border */}
      <div className="absolute bottom-0 left-0 w-full h-2 bg-[#669933] z-10" />

      {/* Image with slight dark overlay */}
      <div className="relative w-full h-100">
        <Image
          src={member?.image || "/Images/Jobs/jobs3.jpg"}
          alt={member?.name || "Team member"}
          fill
          className="object-cover brightness-100 group-hover:scale-105 transition-transform duration-500 rounded-md"
          sizes="100vw"
          loading="eager"
        />
        <div className="absolute inset-0 transition-all duration-300" />
      </div>

      {/* Info */}
      <div className="p-4 text-gray-600">
        <h3 className="text-lg font-bold hover:text-[#669933]">{member?.name}</h3>
        <p className="text-sm text-gray-600">{member?.position}</p>

        {/* Contact */}
        <div className="flex gap-3 mt-4 mb-4">
          {member?.phone && (
            <a
              href={`tel:${member.phone}`}
              className="border-2 border-[#669933] hover:bg-[#669933] text-[#669933] hover:text-white p-2 rounded-full transition-all"
              title="Call"
            >
              <Phone className="w-5 h-5" />
            </a>
          )}
          {member?.email && (
            <a
              href={`mailto:${member.email}`}
              className="border-2 border-[#669933] hover:bg-[#669933] text-[#669933] hover:text-white p-2 rounded-full transition-all"
              title="Email"
            >
              <Mail className="w-5 h-5" />
            </a>
          )}
        </div>
      </div>
    </FadeInView>
  );
};

const TeamSection = () => {
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const data = await getTeam();
        const formatted = data?.message?.map((person) => ({
          name: person?.vorname || person?.name1 || person?.name || "",
          email: person?.e_mail,
          phone: person?.telefon,
          image: person?.bild_anhagen ? `/api/image?path=${person.bild_anhagen}` : "/Images/Jobs/jobs3.jpg",
          status: person?.status,
          position: person?.rolle,
          bio: person?.bio || "",
        }));
        setTeams(formatted || []);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchTeam();
  }, []);

  if (teams.length === 0) return null;

  return (
    <section className="py-10 md:py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <FadeInView
          direction="bottom"
          distance={10}
          duration={500}
          className="text-3xl font-bold text-center text-[#333] mb-12"
        >
          <h2>Unser Team</h2>
        </FadeInView>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-10 justify-items-center">
          {teams.map((member, index) => (
            <TeamMember key={index} member={member} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;