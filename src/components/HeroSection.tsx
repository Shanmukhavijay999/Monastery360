import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Play, Map, ChevronDown } from "lucide-react";
import monasteryHero from "@/assets/monastery-hero.jpg";
import { useTranslation } from "@/lib/i18n";
import { motion, useScroll, useTransform } from "framer-motion";

const HeroSection = () => {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Parallax transforms
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const imageOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.3]);
  const contentY = useTransform(scrollYProgress, [0, 0.5], [0, -80]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);

  const scrollToContent = () => {
    const el = document.querySelector("#map");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToTours = () => {
    const el = document.querySelector("#tours");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section ref={sectionRef} className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Parallax Background */}
      <motion.div
        className="absolute inset-0"
        style={{ scale: imageScale, opacity: imageOpacity }}
      >
        <img
          src={monasteryHero}
          alt="Beautiful Himalayan monastery at golden hour"
          className="w-full h-full object-cover"
          loading="eager"
        />
      </motion.div>

      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/70" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60" />

      {/* Content */}
      <motion.div
        className="relative z-10 container mx-auto px-4 text-center text-white"
        style={{ y: contentY, opacity: contentOpacity }}
      >
        <div className="max-w-4xl mx-auto">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 glass px-5 py-2 rounded-full text-sm font-medium mb-8"
          >
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse-subtle" />
            {t("hero.aiBadge")}
          </motion.div>

          {/* Main Heading — Cinematic Reveal */}
          <div className="overflow-hidden mb-6">
            <motion.h1
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[0.95]"
            >
              {t("hero.discover")}
            </motion.h1>
          </div>
          <div className="overflow-hidden mb-8">
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{ duration: 1, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[0.95] text-gradient-gold inline-block" style={{ WebkitTextFillColor: 'transparent', background: 'linear-gradient(135deg, #F59E0B, #FBBF24, #F97316)', WebkitBackgroundClip: 'text', backgroundClip: 'text' }}>
                {t("hero.monasteries")}
              </span>
            </motion.div>
          </div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed mb-12"
          >
            {t("hero.subtitle")}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-20"
          >
            <Button
              onClick={scrollToTours}
              className="bg-white text-black hover:bg-white/90 px-8 py-6 text-base rounded-full gap-3 transition-all duration-500 hover:scale-105 hover:shadow-2xl shadow-lg font-semibold"
            >
              <Play className="w-4 h-4" />
              {t("hero.exploreTours")}
            </Button>
            <Button
              onClick={scrollToContent}
              className="bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 px-8 py-6 text-base rounded-full gap-3 transition-all duration-500 hover:scale-105 font-medium"
            >
              <Map className="w-4 h-4" />
              {t("hero.learnMore")}
            </Button>
          </motion.div>

          {/* Stats Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center justify-center gap-8 md:gap-16"
          >
            {[
              { value: "200+", label: "Monasteries" },
              { value: "17th", label: "Century" },
              { value: "360°", label: "Virtual Tours" },
              { value: "1000+", label: "Artifacts" },
            ].map(({ value, label }) => (
              <div key={label} className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-white mb-0.5">
                  {value}
                </div>
                <div className="text-white/40 text-xs uppercase tracking-widest">
                  {label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.button
        onClick={scrollToContent}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/40 hover:text-white/70 transition-colors"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-[10px] uppercase tracking-[0.2em] font-medium">Scroll</span>
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </motion.button>
    </section>
  );
};

export default HeroSection;