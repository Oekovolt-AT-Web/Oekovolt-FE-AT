import FadeInView from "@/components/Reusable/FadeInView";

const EnhancedCardsSection = ({ data }) => {
  return (
    <section className="bg-gray-100 py-10 md:py-16 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <FadeInView
          direction="bottom"
          distance={20}
          duration={600}
          className="text-3xl text-center text-gray-900 mb-10"
        >
          <h2>{data?.photovoltaik_second_card_title || ""}</h2>
        </FadeInView>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {data?.cards?.map((item, index) => {
            return (
              <FadeInView
                key={index}
                direction="bottom"
                distance={40}
                duration={500}
                delay={index * 100}
                className="border-gray-100 bg-white border rounded-2xl p-6 text-center shadow-md hover:shadow-xl transition-all"
              >
                <h3 className="text-xl text-gray-900 mb-2">{item?.title}</h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {item?.description}
                </p>
              </FadeInView>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default EnhancedCardsSection;