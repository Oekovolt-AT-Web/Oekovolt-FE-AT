"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { API_IMG_URL } from "@/lib/apiImgUrl";

const MieterstromBenefits = ({ data }) => {
  if (!data) return null;

  const {
    mieterstorm_second_card_title,
    mieterstorm_second_card_image,
    mieterstorm_second_card_alt_image,
    mieterstorm_second_card_option_information,
  } = data;

  return (
    <section className="py-10 md:py-16 bg-gray-100">
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Text & Features */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
        >
          
          <h3 className="text-2xl md:text-3xl mb-4 text-gray-800">
            {mieterstorm_second_card_title}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
            {mieterstorm_second_card_option_information?.map((item, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.02 }}
                className="flex flex-col items-start bg-gray-50 rounded-lg shadow-sm p-5 transition"
              >
               <div className="w-10 h-10 mb-3">
 <Image
  src={`${API_IMG_URL}${item.icon}`}
  alt={item.alt_icon_image || item.title}
  width={40}
  height={40}
  className="object-contain"
/>

</div>

                <h4 className="text-md text-gray-900 mb-1">
                  {item.title}
                </h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
        {/* Image */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="relative w-full h-[300px] md:h-[450px] rounded-xl overflow-hidden shadow-xl"
        >
          <Image
            src={`${API_IMG_URL}${mieterstorm_second_card_image}`}
            alt={mieterstorm_second_card_alt_image || "Oekovolt Mieterstrom Vorteile"}
            fill
            className="object-cover"
                    sizes=" 100vw"

          />
        </motion.div>

      </div>
    </section>
  );
};

export default MieterstromBenefits;
