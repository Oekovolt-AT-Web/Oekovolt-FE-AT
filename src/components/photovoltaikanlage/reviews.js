"use client";
import React from "react";
import Image from "next/image";

import GoogleReviewsCarousel from "./googlereview";
import { motion } from "framer-motion";

const ReviewsPage = ({ data }) => {
  if (!data) return null;

  return (
    <div className="py-10 md:py-16 bg-gray-100">
      <div className="flex-col  max-w-7xl mx-auto space-y-10 px-6  md:px-12">
        <motion.div
          className="sm:flex-col md:flex-row lg:flex items-center  justify-between w-full gap-16"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="lg:w-1/2 space-y-4"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-sm font-semibold text-[#669933] uppercase tracking-wide "
            >
              {data.photovoltaik_title_second_card}
            </motion.p>
            <h3 className="text-4xl md:mb-5 lg:mb-0">
              {data.photovoltaik_subtitle_second_card}
            </h3>
          </motion.div>

          <motion.div
            className="lg:w-1/2 mt-10 md:mt-0"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Image
              src={data.photovoltaik_image_second_card ? `/api/image?path=${data.photovoltaik_image_second_card}` : "/Images/Jobs/jobs3.jpg"}
              width={600}
              height={300}
              quality={100}

              alt={data.photovoltaik_image_second_card_alt}
              className="object-cover object-center rounded-xl"
            />
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <GoogleReviewsCarousel />
        </motion.div>
      </div>
    </div>
  );
};

export default ReviewsPage;
