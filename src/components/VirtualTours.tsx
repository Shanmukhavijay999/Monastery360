import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Play, Volume2, Maximize, Eye, Clock, Globe } from "lucide-react";
import virtualTourImage from "@/assets/virtual-tour.jpg";
import TourViewer from "./TourViewer";
import { useTranslation } from "@/lib/i18n";
import ScrollReveal from "./ScrollReveal";
import { motion } from "framer-motion";

const VirtualTours = () => {
  const { t } = useTranslation();
  const [isTourOpen, setIsTourOpen] = useState(false);
  const [tourStartScene, setTourStartScene] = useState(0);

  const tours = [
    {
      title: "Rumtek Monastery Main Hall",
      duration: "12 min",
      views: "2.1k",
      description: "Explore the magnificent main prayer hall with its golden Buddha statue and intricate ceiling artwork.",
      features: ["360° View", "Audio Guide", "4K Quality", "Multi-language"],
      sceneIndex: 0,
    },
    {
      title: "Pemayangtse Prayer Wheels",
      duration: "8 min",
      views: "1.8k",
      description: "Experience the spiritual practice of spinning prayer wheels in this sacred space.",
      features: ["Interactive", "Sound Effects", "Historical Info", "HD Quality"],
      sceneIndex: 1,
    },
    {
      title: "Tashiding Festival Grounds",
      duration: "15 min",
      views: "3.2k",
      description: "Witness the vibrant festival preparations and traditional ceremonial spaces.",
      features: ["Live Events", "Cultural Context", "Zoom Feature", "Offline Mode"],
      sceneIndex: 2,
    },
  ];

  const openTour = (sceneIndex: number) => {
    setTourStartScene(sceneIndex);
    setIsTourOpen(true);
  };

  return (
    <>
      <section id="tours" className="section-padding bg-background">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-16 md:mb-20">
              <h2 className="section-heading text-foreground">
                {t("tours.title")}
              </h2>
              <p className="section-subheading">
                {t("tours.subtitle")}
              </p>
            </div>
          </ScrollReveal>

          {/* Featured Tour — Cinematic */}
          <ScrollReveal className="mb-16">
            <motion.div
              whileHover={{ scale: 1.005 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="relative rounded-3xl overflow-hidden cursor-pointer group bg-card border border-border/60 hover:border-border hover:shadow-premium transition-all duration-700"
              onClick={() => openTour(0)}
            >
              <div className="relative overflow-hidden">
                <motion.img
                  src={virtualTourImage}
                  alt="360-degree virtual monastery tour preview"
                  className="w-full h-72 md:h-[500px] object-cover"
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                {/* Play Button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-20 h-20 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/30 group-hover:bg-white/30 transition-all duration-500"
                  >
                    <Play className="w-8 h-8 text-white ml-1" />
                  </motion.div>
                </div>

                {/* Badges */}
                <div className="absolute top-5 left-5">
                  <span className="bg-primary text-primary-foreground px-3.5 py-1.5 rounded-full text-xs font-semibold">
                    {t("tours.featured")}
                  </span>
                </div>
                <div className="absolute top-5 right-5">
                  <span className="glass px-3.5 py-1.5 rounded-full text-xs text-white font-medium">
                    {t("tours.ready360")}
                  </span>
                </div>

                {/* Bottom Info */}
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">{t("tours.completeExp")}</h3>
                  <p className="text-white/70 text-sm md:text-base max-w-xl mb-4">
                    {t("tours.completeDesc")}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {["4K Resolution", "Spatial Audio", "Interactive", "Multi-language", "Offline"].map(
                      (feature) => (
                        <span key={feature} className="text-[11px] bg-white/10 backdrop-blur-sm text-white/80 px-3 py-1 rounded-full border border-white/10">
                          {feature}
                        </span>
                      )
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </ScrollReveal>

          {/* Tour Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {tours.map((tour, index) => (
              <ScrollReveal key={tour.title} delay={index * 0.1}>
                <motion.div
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="group bg-card rounded-2xl border border-border/60 overflow-hidden hover:shadow-premium hover:border-border transition-all duration-500 cursor-pointer"
                  onClick={() => openTour(tour.sceneIndex)}
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
                        {tour.title}
                      </h3>
                      <motion.div
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                        className="p-1.5 rounded-full bg-primary/10"
                      >
                        <Play className="w-3.5 h-3.5 text-primary" />
                      </motion.div>
                    </div>

                    <p className="text-muted-foreground text-sm mb-5 leading-relaxed">{tour.description}</p>

                    <div className="flex items-center gap-4 mb-5 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        {tour.duration}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Eye className="w-3.5 h-3.5" />
                        {tour.views} {t("tours.views")}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mb-5">
                      {tour.features.map((feature) => (
                        <span key={feature} className="text-[11px] bg-secondary text-secondary-foreground px-2.5 py-1 rounded-full font-medium">
                          {feature}
                        </span>
                      ))}
                    </div>

                    <Button
                      className="w-full bg-foreground text-background hover:bg-foreground/90 rounded-xl gap-2 h-10 text-sm font-medium transition-all duration-300"
                      onClick={(e) => {
                        e.stopPropagation();
                        openTour(tour.sceneIndex);
                      }}
                    >
                      <Play className="w-3.5 h-3.5" />
                      {t("tours.startTour")}
                    </Button>
                  </div>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <TourViewer
        isOpen={isTourOpen}
        onClose={() => setIsTourOpen(false)}
        initialScene={tourStartScene}
      />
    </>
  );
};

export default VirtualTours;