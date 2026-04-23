"use client";
import Image from "next/image";
import { API_IMG_URL } from "@/lib/apiImgUrl";
import { FaLeaf } from "react-icons/fa";
import { motion } from "framer-motion";
import Link from "next/link";

const WallboxSecondCard2 = ({ data }) => {
  if (!data) return null;

  return (
    <section className="w-full  py-10 md:py-16 px-6 md:px-12">
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
            src={`${API_IMG_URL}${data.wallbox_second_card_image}`}
            alt={data.wallbox_second_card_image_alt || "Map"}
            fill
            className="object-cover"
            sizes=" 100vw"
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
            {data.wallbox_second_card_subtitle}
          </motion.h2>

          <motion.h3
            className="text-3xl   text-gray-900"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.5 }}
          >
            {data.wallbox_second_card_title}
          </motion.h3>

          <motion.p
            className="text-lg  text-gray-900"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.5 }}
          >
            {data.wallbox_second_card_description}
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
};

export default WallboxSecondCard2;
