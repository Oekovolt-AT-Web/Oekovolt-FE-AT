import React from 'react';
import Image from 'next/image';

// Im Backoffice stehen einzelne Texte in Anführungszeichen ("Ihre PV-Anlage …) –
// teils nur mit öffnendem Zeichen. Auf der Seite wirkt das wie ein Tippfehler.
const ohneAnfuehrung = (text = "") =>
    text.trim().replace(/^["„“”']+/, "").replace(/["„“”']+$/, "").trim();

// Die Überschrift wiederholt oft die Dachzeile ("Ihre Vorteile" über
// "Ihre Vorteile: PV-Anlage kaufen …"). Die Doppelung wird entfernt.
const ohneDachzeile = (titel = "", dachzeile = "") => {
    const prefix = dachzeile.trim().toLowerCase();
    const t = titel.trim();
    if (!prefix || !t.toLowerCase().startsWith(prefix)) return t;
    // Nur bei echtem Trenner kürzen: "Vorteile mit einer Smarthome-Lösung"
    // ist ein Satz und bleibt ganz.
    const trenner = t.slice(prefix.length).match(/^\s*[:–-]\s*/);
    if (!trenner) return t;
    const rest = t.slice(prefix.length + trenner[0].length);
    return rest ? rest.charAt(0).toUpperCase() + rest.slice(1) : t;
};

function AnlageSection({ data }) {
    return (
        // Hintergrund kommt vom Sektion-Wrapper der Seite, damit der Wechsel
        // hell/getönt über alle Abschnitte derselbe Farbton bleibt.
        <section className="px-6 py-14 md:px-12 md:py-20">
            <div className="mx-auto max-w-6xl">
                <div className="mx-auto mb-12 max-w-3xl text-center md:mb-14">
                    <p className="mb-3 text-[13px] font-semibold uppercase tracking-[0.15em] text-[#669933]">
                        {data.second_card_title}
                    </p>
                    <h2 className="text-balance text-[26px] font-semibold leading-tight text-gray-900 md:text-[34px]">
                        {ohneDachzeile(data.second_card_subtitle, data.second_card_title)}
                    </h2>
                </div>

                <ul className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    {data.second_card_table.map((card, index) => (
                        <li
                            key={index}
                            className="flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:flex-row sm:gap-5 md:p-7"
                        >
                            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#f0f7e6]">
                                <span className="relative h-7 w-7">
                                    <Image
                                        src={card.image ? `/api/image?path=${card.image}` : "/Images/Jobs/jobs3.jpg"}
                                        alt=""
                                        fill
                                        sizes="28px"
                                        className="object-contain"
                                    />
                                </span>
                            </span>
                            <div>
                                <h3 className="mb-2 text-[18px] font-semibold leading-snug text-gray-900">
                                    {card.title}
                                </h3>
                                <p className="text-[15px] leading-relaxed text-gray-600 md:text-[16px]">
                                    {ohneAnfuehrung(card.description)}
                                </p>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
}

export default AnlageSection;
