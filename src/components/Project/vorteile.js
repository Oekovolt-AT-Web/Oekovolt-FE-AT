import Image from "next/image";

const Vorteil = ({ data }) => {
  return (
    <section className="mb-9 md:mb-17 ">
      <div className="container mx-auto px-6 md:px-12 max-w-7xl">
        {/* Top Row: Image + Benefits Grid */}
        {/* Bottom Row: Split Text Sections */}
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Left Column - Zukunftsperspektiven */}
          <div className="lg:w-1/2 border-4 border-[#669933] rounded-lg p-6 bg-white flex flex-col items-center">
            <div className="bg-[#669933] rounded-full p-6 mb-6">
              <Image
                src={data.fourth_card_left_image ? `/api/image?path=${data.fourth_card_left_image}` : "/Images/Jobs/jobs3.jpg"} // Replace with your image path
                alt={data.fourth_card_left_alt_text}
                width={50}
                height={50}

                className="inset-0 w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
            <h2 className="text-[20px]  text-gray-900 mb-6 text-center">
              {data.fourth_card_left_title}
            </h2>
            <div className="space-y-4 text-gray-500 text-center text-[17px]">
              {data.fourth_card_left_table?.map((item, key) => (
                <p key={key}>{item.option}</p>
              ))}

            </div>
          </div>

          {/* Right Column - Zukunft der Energie */}
          <div className="lg:w-1/2 border-4 border-[#669933] rounded-lg p-6 bg-white flex flex-col items-center">
            <div className="bg-[#669933] rounded-full p-6 mb-6">
              <Image
                src={data.fourth_card_right_image ? `/api/image?path=${data.fourth_card_right_image}` : "/Images/Jobs/jobs3.jpg"} // Replace with your image path
                alt={data.fourth_card_right_alt_text}
                width={50}
                height={50}

                className="inset-0 w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />            </div>
            <h2 className="text-[20px] text-gray-900 mb-6 text-center">
              {data.fourth_card_right_title}
            </h2>
            <div className="space-y-4 text-gray-500 text-center text-[17px]">
              {data.fourth_card_right_table?.map((item, key) => (
                <p key={key}>{item.option}</p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Vorteil;
