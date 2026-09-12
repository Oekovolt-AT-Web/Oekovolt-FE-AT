import Image from "next/image";

const SmarthomeBannerSection = ({ data }) => {
  return (
    // min-h statt fester Höhe: Bei 300px wurde längerer Text aus dem
    // Backoffice oben und unten abgeschnitten. Der Banner wächst jetzt mit,
    // auf grossen Displays bleibt es wie zuvor bei 400px.
    <section className="relative w-full overflow-hidden">
      <div className="absolute inset-0">
        <Image
          // Vorher: `/api/image?path=${data.image}` || "…" – das Fallback war
          // wirkungslos, weil ein Template-Literal immer truthy ist. Ohne Bild
          // wurde "?path=undefined" angefragt statt das Ersatzbild geladen.
          src={data?.image ? `/api/image?path=${data.image}` : "/Images/Jobs/jobs3.jpg"}
          alt={data?.alt_image || ""}
          fill
          quality={80}
          className="object-cover object-center"
          sizes="100vw"
          loading="eager"
          priority
          style={{ objectPosition: "center center" }}
        />
      </div>

      {/* Der gerichtete Verlauf deckt nur zwei Drittel der Breite ab – auf
          schmalen Displays stand der Text darüber hinaus auf hellem Bild.
          Dort deshalb gleichmässige Abdunklung, ab lg der bisherige Verlauf. */}
      <div aria-hidden="true" className="absolute inset-0 bg-black/55 lg:hidden" />
      <div
        aria-hidden="true"
        className="absolute inset-0 hidden w-2/3 bg-gradient-to-r from-black/100 via-black/60 to-transparent lg:block"
      />

      <div className="relative z-10 mx-auto flex min-h-[300px] max-w-7xl items-center py-10 sm:min-h-[340px] lg:min-h-[400px] lg:py-0">
        <div className="container mx-auto px-4">
          <div className="text-white">
            <h1 className="mb-4 max-w-[660px] text-[24px] font-medium leading-tight text-balance sm:text-[28px] md:text-[34px] lg:text-[40px]">
              {data?.title || "Smart Home vom Fachbetrieb im Allgäu"}
            </h1>
            <p className="mb-0 max-w-[560px] text-[16px] font-medium leading-relaxed sm:text-[17px] md:text-[20px]">
              {data?.description ||
                "Heizung, Licht und Strom intelligent steuern – abgestimmt auf Ihre Photovoltaikanlage."}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SmarthomeBannerSection;
