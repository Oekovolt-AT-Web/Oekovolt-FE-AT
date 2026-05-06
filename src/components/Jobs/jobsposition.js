"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import styled from "styled-components";
import { motion } from "framer-motion";
import {
  MdLocationOn,
  MdBusinessCenter,
  MdAccessTime,
  MdWorkOutline,
} from "react-icons/md";
import { FaChevronRight } from "react-icons/fa";
import { API_BASE_URL } from "@/lib/apiBaseUrl";
import { API_IMG_URL } from "@/lib/apiImgUrl";
import { MdSentimentDissatisfied } from "react-icons/md";


const Buttons = styled.div`
  display: flex;
  justify-content: flex-end;

  a {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 20px;
    background-color: #669933;
    color: white;
    font-weight: 600;
    border-radius: 8px;
    box-shadow: 0 0 8px #669933aa;
    transition: all 0.3s ease;
    text-decoration: none;

    svg {
      transition: transform 0.3s ease;
    }

    &:hover {
      box-shadow: 0 0 14px #669933dd;
      transform: translateY(-2px);

      svg {
        transform: translateX(4px);
      }
    }
  }
`;

const generateSlug = (title) =>
  title
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/\//g, "-")
    .replace(/[ä]/g, "ae")
    .replace(/[ö]/g, "oe")
    .replace(/[ü]/g, "ue")
    .replace(/[ß]/g, "ss")
    .replace(/[^a-z0-9-]/g, "");

const JobListings = () => {
  const [jobsPosition, setJobsPosition] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for selected Vorteile per job index
  const [selectedVorteile, setSelectedVorteile] = useState({});

  const handleVorteilSelect = (jobIndex, vorteil) => {
    setSelectedVorteile((prev) => {
      const currentSelected = prev[jobIndex] || [];
      if (currentSelected.includes(vorteil)) {
        // Remove vorteil if already selected
        return { ...prev, [jobIndex]: currentSelected.filter((v) => v !== vorteil) };
      } else {
        // Add vorteil
        return { ...prev, [jobIndex]: [...currentSelected, vorteil] };
      }
    });
  };

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}oekovoltdeutchland.oekovoltdeutchland.doctype.jobsde.api.jobsde_data`
        );

        if (!response.ok) throw new Error("Failed to fetch data");

        const data = await response.json();

        setJobsPosition(data.message || []);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  if (error)
    return (
      <div className="text-red-500 p-4 text-center font-semibold">
        Fehler: {error}
      </div>
    );

  return (
    <div className="bg-gray-50 py-10 md:py-16 px-6 md:px-12">
      <div className="max-w-5xl mx-auto">
        <motion.h1
          className="text-3xl font-bold mb-10 text-gray-900 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Offene Stellen bei Oekovolt
        </motion.h1>

        {loading ? (
          <div className="flex items-center justify-center p-8 text-gray-600">
            Lade Stellenangebote...
          </div>
        ) : jobsPosition.length > 0 ? (
          <div className="space-y-8">
            {jobsPosition.map((job, index) => {
              const slug = generateSlug(job.title || "unnamed-job");

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="bg-white border border-gray-200 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-6"
                >
                  <div className="flex flex-col md:flex-row justify-between gap-6 items-start md:items-center">
                    <div className="flex-1">
                      <h2 className="text-2xl font-semibold text-[#669933] mb-2">
                        {job.title || "Unbenannte Stelle"}
                      </h2>
                      <div className="flex flex-wrap text-gray-600 text-sm gap-x-6 gap-y-2">
                        <span className="flex items-center gap-1">
                          <MdBusinessCenter className="text-[#669933]" />
                          {"company" in job ? job.company : "Oekovolt Deutschland"}
                        </span>
                        <span className="flex items-center gap-1">
                          <MdLocationOn className="text-[#669933]" />
                          {job.ort || "Unbekannter Ort"}
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="text-[#669933]">€</span>{" "}
                          {job.gehalt || "Nicht angegeben"}
                        </span>

                        {/* Vorteile with checkboxes */}
                        <span className="flex  items-center gap-2">
                          <strong className="flex items-center gap-1 text-[#669933]">
                            <MdWorkOutline />
                          </strong>

                          {Array.isArray(job.vorteile) ? (
                            <div className=" gap-4">
                              {job.vorteile.map((vorteil, i) => (
                                <label
                                  key={i}
                                  className="inline-flex items-center cursor-pointer"
                                >
                                  <input
                                    type="checkbox"
                                    checked={
                                      selectedVorteile[index]?.includes(vorteil) || false
                                    }
                                    onChange={() => handleVorteilSelect(index, vorteil)}
                                    className="form-checkbox h-5 w-5 text-[#669933]"
                                  />
                                  <span className="ml-2 text-gray-700">{vorteil}</span>
                                </label>
                              ))}
                            </div>
                          ) : (
                            <span>{job.vorteile}</span>
                          )}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col items-start md:items-end gap-3 w-full md:w-auto">
                      <span className="flex items-center gap-1 text-sm text-gray-500">
                        <MdAccessTime className="text-[#669933]" />
                        Veröffentlicht{" "}
                        {new Date(job.posted || Date.now()).toLocaleDateString("de-DE", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })}
                      </span>

                      <Buttons>
                        <Link href={`/uber-uns/jobs/${slug}`}>
                          Jetzt Bewerben <FaChevronRight />
                        </Link>
                      </Buttons>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white p-6 rounded-xl shadow-lg text-center text-gray-700 flex flex-col items-center space-y-3 border border-gray-200">
          <MdSentimentDissatisfied className="text-5xl text-yellow-500" />
          <h3 className="text-lg font-semibold">Keine offenen Stellen</h3>
          <p className="text-sm max-w-md">
            Derzeit sind keine offenen Stellen verfügbar. Bitte schauen Sie später wieder vorbei.
          </p>
        </div>
        )}
      </div>
    </div>
  );
};

export default JobListings;
