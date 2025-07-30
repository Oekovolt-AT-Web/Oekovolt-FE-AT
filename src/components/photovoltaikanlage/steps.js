"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { API_IMG_URL } from "@/lib/apiImgUrl";
import { FaUserTie, FaDraftingCompass, FaTools } from "react-icons/fa";

const icons = [FaUserTie, FaDraftingCompass, FaTools];

const PhotovoltaikStepsSection = ({ data }) => {
  if (!data) return null;

  const steps = [
    {
        number:"1",
      icon: FaUserTie,
      title: data.photovoltaik_title_third_card_first,
      image: data.photovoltaik_image_third_card_first,
      alt: data.photovoltaik_image_third_card_alt_first,
      description: data.photovoltaik_description_third_card_alt_first,
    },
    {
                number:"2",

      icon: FaDraftingCompass,
      title: data.photovoltaik_third_second_card_second,
      image: data.photovoltaik_image_third_card_second,
      alt: data.photovoltaik_image_third_card_alt_second,
      description: data.photovoltaik_description_third_card_alt_second,
    },
    {
                number:"3",

      icon: FaTools,
      title: data.photovoltaik_third_second_card_third,
      image: data.photovoltaik_image_third_card_third,
      alt: data.photovoltaik_image_third_card_alt_third,
      description: data.photovoltaik_description_third_card_alt_third,
    },
  ];

  return (
    <section className="w-full  py-10 md:py-16 px-6  md:px-12">
      <div className="max-w-7xl mx-auto text-center mb-16">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-[#669933] text-sm font-semibold uppercase tracking-widest"
        >
          {data.photovoltaik_third_second_card}
        </motion.h2>
        <motion.h3
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl  text-gray-800 mt-2"
        >
          {data.photovoltaik_subtitle_third_card}
        </motion.h3>
      </div>

      <div className="max-w-7xl mx-auto grid gap-12 md:grid-cols-2 lg:grid-cols-3">
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 + index * 0.2 }}
              viewport={{ once: true }}
              className="relative bg-white rounded-xl  shadow-xl hover:shadow-2xl transition duration-300 transform hover:-translate-y-1"
            >
                
                <div className="absolute -top-6 left-3 w-12 h-12 bg-[#669933] clip-triangle z-10 flex items-center justify-center">
  <span className="text-white text-xl">{step.number}</span>
</div>


                
              <div className="relative w-full h-60">
                <Image
                  src={`${API_IMG_URL}${step.image}`}
                  alt={step.alt || "Image"}
                  fill
                  className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"

                />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-[#669933] text-2xl">
                    <Icon />
                  </div>
                  <h4 className="text-xl font-semibold text-gray-800">
                    {step.title}
                  </h4>
                </div>
                <p className="text-gray-600 text-sm whitespace-pre-line leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default PhotovoltaikStepsSection;
