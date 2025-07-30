"use client";
import Image from "next/image";
import { API_IMG_URL } from "@/lib/apiImgUrl";
import { FaLeaf } from "react-icons/fa";
import { motion } from "framer-motion";
import Link from "next/link";

const PhotovoltaikRegionalNetzSection = ({ data }) => {
  if (
    !data ||
    !data.photovoltaik_title_fourth_card_first ||
    !data.photovoltaik_fourth_table
  )
    return null;

  return (
    <section className="w-full bg-gray-100 py-10 md:py-16 px-6  md:px-12">
      <div className="max-w-7xl mx-auto flex flex-col-reverse lg:flex-row items-center gap-10">
        {/* Left: Image or Map */}
        <motion.div
          className="w-full lg:w-1/2 relative aspect-[16/11] rounded-xl overflow-hidden shadow-md"
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Image
            src={`${API_IMG_URL}${data.photovoltaik_image_fourth_card}`}
            alt={data.photovoltaik_image_fourth_card_alt || "Map"}
            fill
            className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"

          />
        </motion.div>

        {/* Right: Text */}
        <motion.div
          className="w-full lg:w-1/2 space-y-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.15,
              },
            },
          }}
        >
          <motion.h2
            className="text-sm font-semibold uppercase text-[#669933]"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.4 }}
          >
            {data.photovoltaik_title_fourth_card_first}
          </motion.h2>

          <motion.h3
            className="text-3xl md:text-4xl text-gray-900"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.5 }}
          >
            {data.photovoltaik_subtitle_fourth_card_first}
          </motion.h3>

          <ul className="space-y-3 mt-6">
            {data.photovoltaik_fourth_table.map((item, idx) => (
              <motion.li
                key={idx}
                className="flex items-start gap-3 text-gray-700 text-[17px]"
                variants={{
                  hidden: { opacity: 0, x: 20 },
                  visible: { opacity: 1, x: 0 },
                }}
                transition={{ duration: 0.4, delay: 0.1 * idx }}
              >
                <FaLeaf className="text-[#669933] mt-1 shrink-0" />
                <span>{item.options}</span>
              </motion.li>
            ))}
          </ul>

          <motion.div
            className="pt-4"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.5 }}
          >
            <Link
              href="/kontakt"
              className="inline-block border border-[#669933] text-[#669933] px-6 py-3 rounded-md hover:bg-[#669933] hover:text-white transition text-md font-medium"
            >
              Fachbetrieb in deiner Nähe finden
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default PhotovoltaikRegionalNetzSection;
