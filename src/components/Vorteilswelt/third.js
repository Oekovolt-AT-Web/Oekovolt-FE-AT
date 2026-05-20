"use client";
import { motion } from "framer-motion";
import Image from "next/image";


const ReferralStepsSection = ({ data }) => {

  return (
    <section className="w-full bg-gray-100 text-white pb-9 md:pb-15 px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl text-gray-900 text-center mb-12"
        >
          {data.second_card_title}
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {data.second_card_table.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.2 }}
              className="bg-white text-gray-800 rounded-xl p-6 shadow-md hover:shadow-lg transition duration-300 flex flex-col items-center text-center"
            >
              {/* Icon Image */}
             
                <div className="relative w-14 h-14 mb-4">
                  <Image
                src={`/api/image?path=${step.image}` || "/Images/Jobs/jobs3.jpg"}
                    alt={step.alt_text || `Step ${index + 1}`}
                    width={100}
                    height={100}
                    className="object-contain"
                  />

                
                </div>
            

              <h3 className="text-lg font-semibold">{step.title}</h3>
              <p className="text-sm text-gray-600 mt-2">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReferralStepsSection;
