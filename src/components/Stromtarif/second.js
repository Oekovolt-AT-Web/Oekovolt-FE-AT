import Image from "next/image";
import FadeInView from "@/components/Reusable/FadeInView";

const DynamicGreenEnergy = ({ data }) => {
  return (
    <section className="w-full py-10 md:py-16 px-6 md:px-12">
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 max-w-7xl mx-auto">
        {data?.dynami_first_card_table?.map((card, index) => (
          <FadeInView
            key={index}
            direction="bottom"
            distance={40}
            duration={600}
            delay={index * 150}
            className="bg-white rounded-2xl shadow-md p-6 border-t-4 border-[#669933] hover:shadow-lg transition-all duration-300"
          >
            <div className="w-14 h-14 mx-auto mb-4">
              <Image
                src={card?.image ? `/api/image?path=${card.image}` : "/Images/Jobs/jobs3.jpg"}
                alt={card?.alt_text || "Green energy"}
                width={56}
                height={56}
                className="object-contain"
              />
            </div>
            <h3 className="text-xl text-gray-800 mb-2">{card?.title}</h3>
            <p className="text-sm text-gray-600">{card?.description}</p>
          </FadeInView>
        ))}
      </div>
    </section>
  );
};

export default DynamicGreenEnergy;