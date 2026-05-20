"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { BookOpenCheck, TrendingUp, ArrowRight } from "lucide-react";


const ThirdCardSection = ({ data }) => {
  return (
    <section className="relative py-10 md:py-16  overflow-hidden">
      {/* Decorative elements */}
      {/* <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[#66993310] to-transparent"></div> */}
      {/* <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full bg-[#f0f7e6] blur-3xl opacity-40 -mr-32 -mb-32"></div> */}

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* Main Content */}
        <div className="flex flex-col gap-16">

          {/* Top Section: Modern Split Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <div className="inline-flex items-center gap-4">
                <div className="bg-[#f0f7e6] p-2 rounded-lg">
                  <BookOpenCheck className="text-[#669933] w-6 h-6" />
                </div>
                <span className="text-[#669933] font-medium uppercase tracking-wider text-sm">
                  {data?.third_card_subtitle}
                </span>
              </div>

              <h2 className="text-4xl text-gray-900 leading-tight">
                {data?.third_card_title}
              </h2>

              <p className="text-gray-600 text-lg leading-relaxed whitespace-pre-line">
                {data?.third_card_description}
              </p>

            </motion.div>

            {/* Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative rounded-3xl overflow-hidden shadow-2xl group"
            >
              <Image
                src={data?.third_card_image ? `/api/image?path=${data?.third_card_image}` : "/Images/Jobs/jobs3.jpg"}
                alt={data?.third_card_alt_text || "Marktprämienmodell"}
                width={800}
                height={600}
                className="w-full h-auto aspect-[4/3] object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </motion.div>
          </div>

          {/* Bottom Highlight Section */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100"
          >
            <div className="p-8 md:p-10 lg:p-12">
              <div className="flex items-center gap-6 mb-8">
                <div className="bg-[#669933] p-3 rounded-lg">
                  <TrendingUp className="text-white w-6 h-6" />
                </div>
                <h3 className="text-2xl md:text-3xl  text-gray-900">
                  {data?.first_section_title_field}
                </h3>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className=" border-2 border-[#669933] p-6 rounded-xl shadow-sm">
                  <p className="text-gray-600 text-xl text-center">
                    Marktprämie =<br />
                    Anzulegender Wert –<br />
                    Durchschnittlicher Marktpreis
                  </p>
                </div>

                <div>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    {data?.first_section_description_field}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default ThirdCardSection;