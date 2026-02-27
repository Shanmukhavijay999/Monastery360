import { Button } from "@/components/ui/button";
import { Play, Map, Sparkles, ChevronDown } from "lucide-react";
import monasteryHero from "@/assets/monastery-hero.jpg";
import { useTranslation } from "@/lib/i18n";

const HeroSection = () => {
  const { t } = useTranslation();
  const scrollToContent = () => {
    const el = document.querySelector("#map");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          src={monasteryHero}
          alt="Beautiful Himalayan monastery at golden hour"
          className="w-full h-full object-cover scale-105 animate-slow-zoom"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/60" />
        <div className="absolute inset-0 bg-gradient-to-r from-amber-900/20 to-transparent" />
      </div>

      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-50" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center text-white">
        <div className="max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white px-5 py-2 rounded-full text-sm font-medium mb-8 animate-fade-in-up shadow-xl">
            <Sparkles className="w-4 h-4 text-amber-300" />
            {t("hero.aiBadge")}
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-6 leading-tight animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            {t("hero.discover")}
            <span className="block bg-gradient-to-r from-amber-300 via-yellow-300 to-orange-300 bg-clip-text text-transparent drop-shadow-lg">
              {t("hero.monasteries")}
            </span>
          </h1>

          <p className="text-lg md:text-xl lg:text-2xl mb-10 text-white/85 max-w-3xl mx-auto animate-fade-in-up leading-relaxed" style={{ animationDelay: "0.2s" }}>
            {t("hero.subtitle")}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
            <Button
              onClick={() => {
                const el = document.querySelector("#tours");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-8 py-6 text-lg rounded-2xl shadow-2xl shadow-orange-500/30 gap-3 transition-all duration-300 hover:scale-105 hover:shadow-orange-500/50"
            >
              <Play className="w-5 h-5" />
              {t("hero.exploreTours")}
            </Button>
            <Button
              onClick={scrollToContent}
              className="bg-white/10 backdrop-blur-md border border-white/30 text-white hover:bg-white/20 px-8 py-6 text-lg rounded-2xl gap-3 transition-all duration-300 hover:scale-105"
            >
              <Map className="w-5 h-5" />
              {t("hero.learnMore")}
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
            {[
              { value: "200+", label: t("hero.monasteryCount").replace("200+ ", "") || "Monasteries" },
              { value: "17th", label: "Century" },
              { value: "360°", label: t("hero.virtualTours") },
              { value: "1000+", label: "Artifacts" },
            ].map(({ value, label }) => (
              <div key={label} className="text-center group">
                <div className="text-3xl md:text-4xl font-black bg-gradient-to-r from-amber-300 to-yellow-200 bg-clip-text text-transparent mb-1 group-hover:scale-110 transition-transform duration-300">
                  {value}
                </div>
                <div className="text-white/70 text-sm">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <button
        onClick={scrollToContent}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/60 hover:text-white transition-colors"
      >
        <div className="flex flex-col items-center gap-2 animate-bounce">
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <ChevronDown className="w-5 h-5" />
        </div>
      </button>

      {/* Decorative side elements */}
      <div className="absolute top-1/4 left-8 w-32 h-32 border border-white/5 rounded-full animate-float hidden lg:block" />
      <div className="absolute bottom-1/3 right-12 w-20 h-20 border border-amber-400/10 rounded-full animate-float hidden lg:block" style={{ animationDelay: "2s" }} />
    </section>
  );
};

export default HeroSection;