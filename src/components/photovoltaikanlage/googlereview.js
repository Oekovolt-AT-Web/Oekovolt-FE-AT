"use client";

import { useState, useEffect, useMemo } from "react";
import FadeInView from "@/components/Reusable/FadeInView";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";

const GoogleReviewsCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [perView, setPerView] = useState(1);
  const [animating, setAnimating] = useState(false);
  const [visibleReviews, setVisibleReviews] = useState([]);

  const reviews = useMemo(() => [
    {
      name: "Monika Wiesend",
      rating: 5,
      date: "15 Mai 2025",
      content:
        "Wir sind absolut begeistert von der Planung bis zur Montage unserer PV-Anlage mit Speicher durch ÖkoVolt. Alles lief reibungslos, professionell und zügig. Das gesamte Team von ÖkoVolt war super – freundlich, zuverlässig und sehr sauber in der Ausführung. Ein besonderes Lob geht an Elektrikermeister Dwayne: Mit seiner Kompetenz, Ruhe und Sorgfalt hat er einen hervorragenden Job gemacht. Jede Frage wurde verständlich beantwortet, und die Umsetzung war technisch top. Ein echter Profi!",
    },
    {
      name: "Tobias K",
      rating: 5,
      date: "5 Mai 2024",
      content:
        "Ich bin absolut begeistert von der Firma Ökovolt und ihrer hervorragenden Arbeit bei der Installation meiner Photovoltaikanlage. Das Team von Ökovolt war äußerst professionell, eingespielt und kompetent. Besonders beeindruckend ist ihre Grundeinstellung: „Bei der Vielzahl an anstehenden Projekten, vermeiden wir lieber den Stress mit Nacharbeiten. Wir arbeiten lieber gleich perfekt.“ Das sind Grundeinstellungen, über die man sich als Kunde sehr freut. Neben der Photovoltaikanlage installierte mir das Team der Firma Ökovolt eine KEBA Wallbox und konfigurierte das System so, dass auf Wunsch nur überschüssiger Strom ins Auto übertragen wird. Meine Fragen wurden mir immer ausführlich beantwortet und die besten Optionen für meine Bedürfnisse erklärt. Die Installation verlief reibungslos und effizient. Die Techniker waren pünktlich, gut vorbereitet und haben die Arbeit mit höchster Präzision und Sorgfalt ausgeführt. Seit die Anlage in Betrieb ist, funktioniert sie einwandfrei und liefert genau die versprochenen Ergebnisse. Ich bin sehr zufrieden mit der Leistung und der Qualität der Anlage. Dank Ökovolt kann ich nun meinen eigenen umweltfreundlichen Strom produzieren und gleichzeitig meine Energiekosten senken. Ich kann Ökovolt jedem wärmstens empfehlen, der auf der Suche nach einer zuverlässigen und professionellen Firma für die Installation von Photovoltaikanlagen ist. Ihre Expertise und ihr Engagement für Kundenzufriedenheit sind wirklich herausragend. Vielen Dank, Ökovolt, für die großartige Arbeit!",
    },
    {
      name: "Chimbo Rasso",
      rating: 5,
      date: "5 March 2024",
      content:
        "Bin sehr zufrieden, Anlage läuft perfekt. Preis-Leistung perfekt, habe mir einige Angebote eingeholt, keines konnte Ökovolt das Wasser reichen. Mein besonderer Dank gilt Herrn Immerz, dieser machte ein maßgeschneidertes Angebot. Bei Ökovolt werden keine schön gerechneten Versprechungen gemacht, hier wird nur verkauft was auch Sinn macht. Von der Planung bis hin zur Umsetzung und der Nachtbetreuung lief alles tadellos. 6 von 5 Sternen.",
    },
    {
      name: "Lucas",
      rating: 5,
      date: "15 March 2024",
      content:
        "Von der ersten Planung bis zur finalen Installation - die fachliche Kompetenz und stets freundliche Art von Herrn Immerz hat mich beeindruckt! Er hat sich viel Zeit genommen, alle Fragen verständlich zu beantworten und eine perfekt abgestimmte Lösung für meine Bedürfnisse zu finden. Die gesamte Planung und Umsetzung verlief reibungslos, transparent und äußerst zuverlässig. Vielen Dank und bis zum nächsten Mal!",
    },
    {
      name: "Arthur H.",
      rating: 5,
      date: "8 March 2024",
      content:
        "Auf der Suche nach einer PV-Anlage mit Speicher habe ich bei der Firma ÖKOVOLT in Türkheikm angefragt. Bereits die erste Kontaktaufnahme war positiv. Die Beratung war professionell, freundlich und transparent. Herr Immerz hat sich Zeit genommen um für meine Bedürfnisse die beste Lösung zu finden. Auch danach aufkommende Fragen wurden kompetent und zügig beantwortet. Da mich das Preis- Leistungsverhältnis überzeugt hatte, wurde der Auftrag erteilt. Die Umsetzung erfolgte nach drei Wochen. In zwei Arbeitstagen wurde meine Anlage mit Speicher und Wallbox durch das Montageteam installiert und in Betrieb genommen. Die Funktionen und die Handhabung wurden mir von dem Elektriker vor Ort ausführlich erklärt. Seit ca. drei Monaten funktioniert die Anlage tadellos und produziert umweltfreundlichen Strom. Der gesamte Prozess war unkompliziert und schnell. Eine klare Empfehlung für alle, die eine zuverlässige und ehrliche Beratung in Sachen Photovoltaik suchen. Vielen Dank.",
    },
    {
      name: "Adrian Jonischkeit",
      rating: 5,
      date: "18 March 2024",
      content:
        "Von Anfang an hervorragende Abwicklung: Top Beratung von Herrn Immerz, Installation durch sehr nette und fähige Handwerker, Elektroanschluss top durch Herrn Johnson. Zeitliche Verzögerung, da ein Bauteil unvorhergesehen sehr lange Lieferzeit hatte, dafür kostenneutraler Ersatz durch höherwertigeres Produkt. Schnelle und überaus freundliche Reaktion auf Fragen, auch durch die Mitarbeiterinnen im Büro. Die Anlage läuft top und das Sparen macht Spaß. Alles in allem sehr empfehlenswert!!!",
    },
    {
      name: "Armin M.",
      rating: 5,
      date: "18 March 2024",
      content:
        "Dank Ökovolt freue ich mich nun noch mehr, wenn die Sonne scheint. PV-Anlage und Speicher laufen wunderbar. Ökovolt war die einzige Firma, die sich über eine Anfrage via AroundHome zurückgemeldet hat. Diese Zuverlässigkeit spiegelte sich im weiteren Projektverlauf heraus. Während der Planungs- und Angebotsphase haben wir gemeinsam eine sehr gute Lösung erarbeitet. Im Vergleich mit anderen Anbietern aus der Region hatte ich den Eindruck, das beste Preis-Leistungs-Verhältnis zu bekommen. Vom Vertrieb über Monteure und Elektriker waren alle Beteiligte stets freundlich und zuverlässig. Die Termine wurden eingehalten und bei Rückfragen und Sonderwünschen habe ich stets eine zufriedenstellende Antwort erhalten. Vielen Dank!",
    },
    {
      name: "Leon Kneer",
      rating: 5,
      date: "9 March 2024",
      content:
        "Die Planung war professionell, die Termine wurden pünktlich eingehalten, und die Montage verlief problemlos. Besonders positiv war das kompetente und sympathische Team, das stets hilfsbereit und freundlich war. Absolut empfehlenswert!",
    },
    {
      name: "Sebastian Ostenried",
      rating: 5,
      date: "13 March 2024",
      content:
        "Habe bereits 3 Pv-Anlagen von der Firma Ökovolt gekauft von der Beratung bis zur Installation lief alles Reibungslos",
    },
  ], []);

  const updatePerView = () => {
    if (window.innerWidth >= 1400) {
      setPerView(3);
    } else if (window.innerWidth >= 768) {
      setPerView(2);
    } else {
      setPerView(1);
    }
  };

  useEffect(() => {
    updatePerView();
    window.addEventListener("resize", updatePerView);
    return () => window.removeEventListener("resize", updatePerView);
  }, []);

  useEffect(() => {
    // Update visible reviews when currentIndex or perView changes
    const getVisibleReviews = () => {
      const result = [];
      for (let i = 0; i < perView; i++) {
        const index = (currentIndex + i) % reviews.length;
        result.push(reviews[index]);
      }
      return result;
    };
    setVisibleReviews(getVisibleReviews());
  }, [currentIndex, perView, reviews.length, reviews]);

  const nextSlide = () => {
    if (animating) return;
    setAnimating(true);
    setCurrentIndex((prev) => (prev + 1) % reviews.length);
    setExpandedIndex(null);
    setTimeout(() => setAnimating(false), 400);
  };

  const prevSlide = () => {
    if (animating) return;
    setAnimating(true);
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
    setExpandedIndex(null);
    setTimeout(() => setAnimating(false), 400);
  };

  const toggleExpand = (name) => {
    setExpandedIndex((prev) => (prev === name ? null : name));
  };

  return (
    <div className="relative max-w-7xl mx-auto px-4 mt-9 md:mt-17">
      <div className="flex justify-center gap-4 flex-wrap transition-all duration-500">
        {visibleReviews.map((review, idx) => (
          <FadeInView
            key={review.name}
            direction="bottom"
            distance={20}
            duration={400}
            className="bg-white rounded-lg shadow p-6 w-full sm:w-[90%] md:w-[45%] lg:w-[30%]"
          >
            <div className="flex items-center justify-between mb-2">
              <div>
                <div className="font-semibold">{review.name}</div>
                <div className="text-sm text-gray-500">{review.date}</div>
              </div>
              <p className="text-[#4285F4] text-xl flex justify-center items-center" >G</p>
            </div>

            <div className="flex items-center mb-2 text-yellow-500">
              {[...Array(review.rating)].map((_, i) => (
                <Star key={i} />
              ))}
            </div>

            <p className="text-sm text-gray-700 mb-2">
              {expandedIndex === review.name
                ? review.content
                : `${review.content.slice(0, 100)}...`}
            </p>

            <button
              onClick={() => toggleExpand(review.name)}
              className="cursor-pointer text-green-700 font-medium text-sm"
            >
              {expandedIndex === review.name ? "Weniger anzeigen" : "Weiterlesen"}
            </button>
          </FadeInView>
        ))}
      </div>

      {/* Navigation */}
      <div className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10">
        <button
          onClick={prevSlide}
          disabled={animating}
          className="cursor-pointer bg-white shadow rounded-full p-2 disabled:opacity-50"
        >
          <ChevronLeft />
        </button>
      </div>
      <div className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10">
        <button
          onClick={nextSlide}
          disabled={animating}
          className="cursor-pointer bg-white shadow rounded-full p-2 disabled:opacity-50"
        >
          <ChevronRight />
        </button>
      </div>
    </div>
  );
};

export default GoogleReviewsCarousel;