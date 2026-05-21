"use client";
import { motion } from "framer-motion";
import { Banknote, ShieldCheck, Home } from "lucide-react";
import Image from "next/image";


const FinanzierungPartnerSection = ({ data }) => {


  return (
    <section className="w-full bg-white py-10 md:py-16">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* Right Side: Content */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="text-3xl text-gray-900">
              {data.finanzierung_third_card_title}
            </h2>

            {data.finanzierung_third_card_description
              ?.split("\n")
              .filter((para) => para.trim() !== "")
              .map((para, idx) => (
                <p key={idx} className="text-gray-700 leading-relaxed">
                  {para}
                </p>
              ))}

            <div className="p-5 bg-[#f6f6f6] border-l-4 border-[#669933] rounded-md shadow-sm">
              <p className="text-gray-800 font-medium">
                {data.finanzierung_third_card_important_description}
              </p>
            </div>


          </motion.div>
          {/* Left Side: Image */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Image
              src={data.finanzierung_third_card_image ? `/api/image?path=${data.finanzierung_third_card_image}` : "/Images/Jobs/jobs3.jpg"}
              alt={data.finanzierung_third_card_image_alt_text}
              width={600}
              height={400}
              className="rounded-xl shadow-lg w-full h-auto object-cover"
            />
          </motion.div>


        </div>
      </div>
    </section>
  );
};

export default FinanzierungPartnerSection;
