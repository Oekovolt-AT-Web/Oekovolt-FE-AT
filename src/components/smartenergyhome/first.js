// components/LawyerSection.jsx

import Image from "next/image";
import lawyerImage from "../../../public/Images/Home/download.jpg"; // zëvendëso me rrugën aktuale të imazhit tënd

export default function LawyerSection() {
  return (
    <div className="relative flex flex-col lg:flex-row items-center gap-10 px-6 lg:px-20 py-16 bg-white">
      {/* Dekori i majtë i gjelbër me kënd të rrumbullakosur */}
      <div className="hidden lg:block absolute top-0 left-0 w-72 h-72 bg-green-900 rounded-tl-[150px] z-100" />

      {/* Imazhi dhe dekori me vija */}
      <div className="relative w-full lg:w-1/2">
        <div className="relative z-10">
          <Image
            src={lawyerImage}
            alt="Lawyer talking to client"
            className="rounded-md"
            fill
            sizes="(max-width: 450px) 100vw, (max-width: 768px) 50vw, 50vw"
          />
        </div>
      </div>

      {/* Teksti */}
      <div className="w-full lg:w-1/2 text-gray-800 space-y-6">
        <h2 className="text-3xl lg:text-4xl font-serif font-semibold">
          We Are Top Lawyers With <br /> 40 Years of Experience
        </h2>
        <p className="text-blue-900 text-lg font-medium">
          Duis aute irure dolor in reprehenderit in voluptate aelit esse cillum
          dolore eu fugiat nulla pariatur.
        </p>
        <div className="border-l-4 border-yellow-400 pl-4 text-gray-600">
          <p>
            Ruit zaser aut odit aut augit sen quia consequuntua aui raioe reruo
            magni dolor eos incilabore et dolor magnam aliuam au natur aut odit
            aut fugit seuia conse untur.
          </p>
        </div>
        <p className="text-gray-600">
          Autem vel eum iure reprehenderit qui in ea voluptate velit esse quam
          nihil molestiae consequatur, vel illum qui dolorem taum fugiat quo
          voluptas nulla pariatur
        </p>
        <button className="mt-4 px-6 py-3 bg-yellow-500 text-white font-semibold rounded-full hover:bg-yellow-600 transition">
          Read More →
        </button>
      </div>
    </div>
  );
}
