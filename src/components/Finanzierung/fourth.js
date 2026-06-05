import FadeInView from "@/components/Reusable/FadeInView";
import Image from "next/image";

const FinanzierungPartnerSection = ({ data }) => {
  return (
    <section className="w-full bg-white py-10 md:py-16">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          
          {/* Left Side: Image */}
          <FadeInView
            direction="left"
            distance={40}
            duration={600}
            className="order-2 lg:order-1"
          >
            <Image
              src={data?.finanzierung_third_card_image ? `/api/image?path=${data?.finanzierung_third_card_image}` : "/Images/Jobs/jobs3.jpg"}
              alt={data?.finanzierung_third_card_image_alt_text}
              width={600}
              height={400}
              className="rounded-xl shadow-lg w-full h-auto object-cover"
            />
          </FadeInView>

          {/* Right Side: Content */}
          <FadeInView
            direction="right"
            distance={40}
            duration={600}
            className="space-y-6 order-1 lg:order-2"
          >
            <h2 className="text-3xl text-gray-900">
              {data?.finanzierung_third_card_title}
            </h2>

            {data?.finanzierung_third_card_description
              ?.split("\n")
              .filter((para) => para.trim() !== "")
              .map((para, idx) => (
                <p key={idx} className="text-gray-700 leading-relaxed">
                  {para}
                </p>
              ))}

            <div className="p-5 bg-[#f6f6f6] border-l-4 border-[#669933] rounded-md shadow-sm">
              <p className="text-gray-800 font-medium">
                {data?.finanzierung_third_card_important_description}
              </p>
            </div>
          </FadeInView>
        </div>
      </div>
    </section>
  );
};

export default FinanzierungPartnerSection;