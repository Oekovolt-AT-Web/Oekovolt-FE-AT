import Image from "next/image";

const HeroEnergy = ({data}) => {
 
  if (!data) return null;

  return (
    <section className="relative">
       <div className="max-w-7xl mx-auto relative flex flex-col lg:flex-row items-center gap-10 px-6 md:px-12 py-10 md:py-16 bg-white">
      
      {/* Text section */}
      <div className="w-full lg:w-1/2 text-gray-800 space-y-6 px-6">
        <h2 className="text-3xl">{data.smart_meter_third_card_title}</h2>

        <div className="relative pl-4 text-gray-600">
          <div className="absolute top-0 left-0 h-full w-1 bg-gradient-to-b from-[#669933] to-[#003473]" />
          <div className="pl-4">
            {data.smart_meter_third_card_description_table?.slice().reverse().map((item, index) => (
              <p key={index} className="text-gray-700 mb-4 whitespace-pre-line">
                {item.description}
              </p>
            ))}
          </div>
        </div>
      </div>
      {/* Image section */}
      <div className="w-full lg:w-1/2 relative px-6">
        {/* Gradient box - hidden on mobile */}
        <div className="hidden lg:block absolute top-[-7px] left-[17px] w-72 h-72 bg-gradient-to-b from-[#669933] to-[#003473] rounded-tl-[145px] z-0" />

        <div className="relative z-10">
          <Image
            src={`/api/image?path=${data.smart_meter_third_card_image}` || "/Images/Jobs/jobs3.jpg"}
            alt="Smart Energy"
            className="rounded-tl-[140px] w-full h-auto"
            width={570}
            height={300}
            quality={80}
            loading="eager"
          />
        </div>
{/* 
        <div className="relative left-0 mt-5 z-10">
          <h2 className="mt-2 text-gray-600 text-center">
            <FaSolarPanel className="inline-block w-5 h-5 text-[#669933] mr-3" />
            {data.smart_meter_third_card_title}
          </h2>
        </div> */}
      </div>


    
    </div> 

              {/* <div className="absolute -top-20 -right-20 w-[300px] h-[300px] bg-[#669933]/30 rounded-full blur-3xl z-0" /> */}

    </section>
    
  );
};

export default HeroEnergy;
