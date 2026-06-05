import Image from 'next/image';
import FadeInView from '@/components/Reusable/FadeInView';

export default function DynamicSteps({ data }) {
  const steps = data?.dynami_fourth_card_options_table;
  const image = data?.dynami_fourth_card_image;
  const alt = data?.dynami_fourth_card_image_alt_text;

  return (
    <section className="w-full bg-gray-100 py-10 md:py-16">
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-15 items-center">
        {/* Left Content - Steps */}
        <FadeInView
          direction="left"
          distance={40}
          duration={600}
        >
          <h2 className="text-3xl text-gray-900 mb-6">
            {data?.dynami_fourth_card_table}
          </h2>
          <div className="space-y-6">
            {steps
              ?.sort((a, b) => a?.title?.localeCompare(b?.title))
              .map((step, i) => (
                <div
                  key={i}
                  className="flex items-start gap-4 bg-gray-50 rounded-xl p-5 border-l-8 border-[#669933] shadow-sm"
                >
                  <div>
                    <h3 className="text-xl text-gray-800">
                      {step?.title}
                    </h3>
                    <p className="text-gray-600 mt-1">{step?.description}</p>
                  </div>
                </div>
              ))}
          </div>
        </FadeInView>

        {/* Right Content - Image */}
        <FadeInView
          direction="right"
          distance={40}
          duration={600}
          className="w-full"
        >
          <div className="rounded-xl overflow-hidden shadow-lg">
            <Image
              src={image ? `/api/image?path=${image}` : "/Images/Jobs/jobs3.jpg"}
              alt={alt || "Dynamic steps"}
              width={800}
              height={600}
              className="object-cover w-full h-full"
            />
          </div>
        </FadeInView>
      </div>
    </section>
  );
}