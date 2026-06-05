
import Image from "next/image";

const TeamBenefitsLayout = ({ data }) => {
  return (
    <section className="mt-9 md:mt-17">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Top Row: Image + Benefits Grid */}
        <div className="flex flex-col lg:items-center lg:flex-row md:gap-12 gap-9 md:mb-17 mb-9">
          {/* Left Column - Image */}
          <div className="lg:w-1/2  pr-2 lg:pr-0">
            <div className=" h-[300px] md:h-[500px] relative lg:h-[550px] w-full rounded-lg overflow-hidden">
              <Image
                src={`/api/image?path=${data.second_card_image}` || "/Images/Jobs/jobs3.jpg"} // Replace with your image path
                alt={data.second_card_alt_text}
                fill
                sizes="100vw"
                className="absolute inset-0 w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>

          {/* Right Column - Benefits Grid */}
          <div className="lg:w-1/2 ">
            {/* <h2 className="text-2xl md:text-3xl font-bold text-[#669933] mb-8">{data.title}</h2> */}
            <h2 className="text-2xl  font-bold text-black tracking-wide inline-block relative">
            {data.second_card_title}
      </h2>
      <hr className="w-70  h-1 bg-[#669933] text-[#669933] mt-[10px] mb-10"></hr>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Benefit 1 */}
              {data.second_card_table.map((benefit, index) => (
                <div key={index} className="bg-white  ">
                  <h2 className="text-[20px]  text-[#669933] mb-3 break-all md:break-normal">
                    {benefit.primary_paragraph}
                  </h2>
                  <p className="text-gray-700 text-[16px]">{benefit.secondary_paragraph}</p>
                </div>
              ))}
            </div>
            {/* Summary Paragraph */}
            <p className="text-gray-700  text-left  mx-auto pt-8 text-[16px]">{data.second_card_description}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TeamBenefitsLayout;
