import Image from "next/image";
import { BatteryCharging, Award, Cpu } from "lucide-react";

const FEATURES = [
    {
        icon: BatteryCharging,
        title: "Maximale Unabhängigkeit",
        text: "Eine Solaranlage mit Speicher macht Sie unabhängig: Statt überschüssigen Solarstrom für wenige Cent ins Netz einzuspeisen, speichern Sie ihn und nutzen ihn genau dann, wenn Sie ihn brauchen – abends, nachts oder bei Netzstörungen. So steigern Sie Ihren Eigenverbrauch von rund 30 % auf bis zu 80 % und senken Ihre Stromkosten dauerhaft.",
    },
    {
        icon: Award,
        title: "Seit 2012 in Österreich",
        text: "Seit 2012 begleiten wir Betriebe, Landwirtschaft und Gemeinden in ganz Österreich von der Lastganganalyse über Planung und Bau bis zum Betrieb – aus einer Hand. 2021 haben wir Anlagen mit rund 30 MWp errichtet.",
    },
    {
        icon: Cpu,
        title: "Eigene Fern- und Leittechnik",
        text: "Mit eigener Fernwartung und eigenem SCADA-System behalten wir Ihre Anlage im Blick, erkennen Leistungsabfälle früh und sichern die Erträge – über die gesamte Lebensdauer.",
    },
];

const SeoTextSection = () => {
    return (
        <section aria-labelledby="seo-heading" className="bg-white">
            <div className="grid lg:grid-cols-2">
                {/* Left: solid green panel with image */}
                <div className="relative overflow-hidden bg-gradient-to-br from-[#75a83a] via-[#669933] to-[#4e7a27] px-6 py-16 md:px-12 lg:px-16 lg:py-24">
                    <div
                        className="pointer-events-none absolute -top-32 -right-24 h-96 w-96 rounded-[45%_55%_60%_40%/50%_45%_55%_50%] bg-white/10 blur-2xl"
                        aria-hidden="true"
                    />
                    <div
                        className="pointer-events-none absolute -bottom-28 -left-20 h-80 w-80 rounded-[55%_45%_40%_60%/45%_55%_45%_55%] bg-black/10 blur-2xl"
                        aria-hidden="true"
                    />
                    <div
                        className="pointer-events-none absolute top-1/3 left-1/4 h-24 w-24 rounded-full bg-white/5 blur-xl"
                        aria-hidden="true"
                    />

                    <div className="relative z-10 mx-auto max-w-lg lg:mr-0 lg:ml-auto">
                        <p className="mb-3 text-[13px] font-semibold uppercase tracking-[0.14em] text-white/85">
                            Ihre Vorteile
                        </p>
                        <div className="mb-6 h-1 w-16 rounded-full bg-[#152315]" />
                        <h2
                            id="seo-heading"
                            className="mb-8 text-3xl font-bold leading-tight text-white md:text-4xl"
                        >
                            Warum eine Solaranlage mit Speicher von Ökovolt?
                        </h2>

                        <div className="relative">
                            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border-4 border-white/20 shadow-2xl">
                                <Image
                                    src="/Images/Home/download-1.jpg"
                                    alt="Einfamilienhaus mit installierter Photovoltaikanlage und Speicher"
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 1024px) 100vw, 50vw"
                                />
                            </div>

                            <div className="absolute -bottom-6 left-6 flex items-center gap-3 rounded-xl bg-white px-5 py-3 shadow-lg">
                                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#669933]/10 text-[#4E8F2C]">
                                    <Award className="h-4.5 w-4.5" aria-hidden="true" />
                                </span>
                                <span className="text-sm font-semibold leading-snug text-[#152315]">
                                    Seit 2012
                                    <br />
                                    in Österreich
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: white panel with features */}
                <div className="flex items-center bg-white px-6 py-6 md:px-6 ">
                    <div className=" w-full max-w-lg divide-y divide-[#E3E8DE]">
                        {FEATURES.map((feature) => (
                            <div
                                key={feature.title}
                                className="group flex items-start gap-4 py-6 first:pt-0 last:pb-0"
                            >
                                <span className="flex shrink-0 items-center justify-center rounded-full bg-[#669933] p-3 text-white transition-transform duration-300 group-hover:scale-110">
                                    <feature.icon className="h-5 w-5" aria-hidden="true" />
                                </span>
                                <div>
                                    <h3 className="mb-1.5 text-lg font-bold text-[#152315]">
                                        {feature.title}
                                    </h3>
                                    <p className="text-[15.5px] leading-relaxed text-[#3A4A3A]">
                                        {feature.text}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SeoTextSection;
