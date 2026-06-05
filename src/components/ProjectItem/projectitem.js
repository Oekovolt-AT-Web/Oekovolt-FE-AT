"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Calendar, Wrench, Zap } from "lucide-react";

import { generateSlug } from "@/lib/slugify";

const ProjectCard = ({ project }) => {
  const [isHovered, setIsHovered] = useState(false);

  const slug = generateSlug(project?.title);

  return (
    <Link
      href={`/referenzen/projekte/${slug}`}
      className="relative w-full h-80 rounded-xl overflow-hidden shadow-lg group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative w-full h-full">
        <Image
          src={project?.bild_anhagen[0]?.bild_anhagen ? `/api/image?path=${project?.bild_anhagen[0]?.bild_anhagen}` : "/Images/Jobs/jobs3.jpg"}
          alt={`Project background - ${project?.location}`}
          fill
          className={`transition-all duration-500 object-cover object-center ${isHovered ? "scale-110 blur-[1px]" : "scale-100 blur-0"
            }`}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-black/30 transition-opacity duration-300"></div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
        <div
          className={`transition-all duration-500 bg-white/10 backdrop-blur-md p-4 rounded-lg border border-white/20 ${isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
        >
          <h3 className="text-white text-xl font-semibold">{project?.title}</h3>
          <div className="flex items-center text-white gap-2 mt-2 text-[16px]">
            <Zap className="text-[#ffde59]" />
            <span>{project?.leistung}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

const ProjectDetailComponent = ({ project, related }) => {
  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
      <h2 className="text-2xl font-semibold tracking-wide inline-block relative">
        Projekt Details
      </h2>
      <hr className="w-70 h-1 bg-[#669933] text-[#669933] mt-[10px] mb-5"></hr>

      <div className="flex flex-col md:flex-row gap-10 mb-16">
        <div className="w-full md:w-2/4">
          <div className="grid grid-cols-1 gap-6">
            {project?.bild_anhagen
              ?.filter((image, index, self) =>
                index === self.findIndex(img => img.bild_anhagen === image.bild_anhagen)
              )
              .map((image, index) => (
                <div
                  key={index}
                  className="relative h-[500px] rounded-2xl overflow-hidden shadow-lg"
                >
                  <Image
                    src={image.bild_anhagen ? `/api/image?path=${image.bild_anhagen}` : "/Images/Jobs/jobs3.jpg"}
                    alt={`${project.title} - ${index + 1}`}
                    fill
                    sizes="(max-width: 450px) 100vw, (max-width: 768px) 50vw, 50vw"
                    className="object-cover w-full h-full"
                  />
                </div>
              ))}
          </div>
        </div>

        <div className="w-full md:w-2/4 space-y-6">
          <div className="p-6 rounded-xl shadow-md border border-gray-200 bg-white">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              {project?.title}
            </h2>
            {!!project?.leistung && (
              <div className="flex items-center gap-3 text-gray-700 mb-3">
                <Zap className="text-[#669933]" />
                <span className="font-medium text-xl">{project.leistung}</span>
              </div>
            )}
            {!!project?.jahr && (
              <div className="flex items-center gap-3 text-gray-700 mb-3">
                <Calendar className="text-[#669933]" />
                <span className="font-medium text-xl">{project.jahr}</span>
              </div>
            )}
            {!!project?.typ && (
              <div className="flex items-center gap-3 text-gray-700 mb-3">
                <Wrench className="text-[#669933]" />
                <span className="font-medium text-xl">{project.typ}</span>
              </div>
            )}
            {!!project?.ort && (
              <div className="flex items-center gap-3 text-gray-700">
                <MapPin className="text-[#669933]" />
                <span className="font-medium text-xl">{project.ort}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="pt-10 border-t border-gray-200">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">
          Weitere Kundenprojekte entdecken
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {related.map((relatedProject, index) => (
            <ProjectCard project={relatedProject} key={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailComponent;
