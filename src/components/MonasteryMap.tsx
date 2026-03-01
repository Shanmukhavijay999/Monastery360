import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MapPin, Route, Clock, Camera, X, Maximize2 } from "lucide-react";
import ScrollReveal from "./ScrollReveal";
import { motion, AnimatePresence } from "framer-motion";

const GOOGLE_API_KEY = "AIzaSyDnDGJa5sUA8LsaY0ShcgZzK0RTSkH8rB0";

const MonasteryMap = () => {
  const [activeMonastery, setActiveMonastery] = useState<number | null>(null);

  const monasteries = [
    {
      name: "Rumtek Monastery",
      location: "East Sikkim, India",
      distance: "24 km from Gangtok",
      type: "Kagyu",
      established: "1740",
      highlights: ["Golden Stupa", "Ancient Murals", "Prayer Wheels"],
      lat: 27.3305,
      lng: 88.5825,
    },
    {
      name: "Pemayangtse Monastery",
      location: "West Sikkim, India",
      distance: "110 km from Gangtok",
      type: "Nyingma",
      established: "1705",
      highlights: ["Wooden Sculptures", "Sacred Relics", "Mountain Views"],
      lat: 27.3071,
      lng: 88.2439,
    },
    {
      name: "Tashiding Monastery",
      location: "West Sikkim, India",
      distance: "40 km from Pelling",
      type: "Nyingma",
      established: "1717",
      highlights: ["Holy Spring", "Festival Grounds", "Ancient Chortens"],
      lat: 27.3120,
      lng: 88.2650,
    },
    {
      name: "Enchey Monastery",
      location: "Gangtok, India",
      distance: "3 km from city center",
      type: "Nyingma",
      established: "1909",
      highlights: ["Urban Location", "Cultural Events", "Easy Access"],
      lat: 27.3375,
      lng: 88.6060,
    },
  ];

  return (
    <div>
      {/* Monastery Cards Section */}
      <section id="map" className="section-padding bg-background">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-16 md:mb-20">
              <h2 className="section-heading text-foreground">
                Explore Sikkim's Sacred Spaces
              </h2>
              <p className="section-subheading">
                Discover historic monasteries with details, highlights, and immersive 360° virtual tours.
              </p>
            </div>
          </ScrollReveal>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {monasteries.map((monastery, index) => (
              <ScrollReveal key={monastery.name} delay={index * 0.08}>
                <motion.div
                  whileHover={{ y: -6, scale: 1.01 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="group bg-card rounded-2xl border border-border/60 overflow-hidden hover:shadow-premium hover:border-border transition-all duration-500 cursor-pointer"
                  onClick={() => setActiveMonastery(activeMonastery === index ? null : index)}
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
                        {monastery.name}
                      </h3>
                      <span className="text-[10px] uppercase tracking-wider bg-primary/10 text-primary px-2.5 py-1 rounded-full font-semibold">
                        {monastery.type}
                      </span>
                    </div>

                    <div className="space-y-2.5 mb-5">
                      <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
                        <MapPin className="w-3.5 h-3.5 flex-shrink-0" /> {monastery.location}
                      </div>
                      <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
                        <Route className="w-3.5 h-3.5 flex-shrink-0" /> {monastery.distance}
                      </div>
                      <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
                        <Clock className="w-3.5 h-3.5 flex-shrink-0" /> Est. {monastery.established}
                      </div>
                    </div>

                    <div className="mb-5">
                      <div className="flex flex-wrap gap-1.5">
                        {monastery.highlights.map((h) => (
                          <span
                            key={h}
                            className="text-[11px] bg-secondary text-secondary-foreground px-2.5 py-1 rounded-full font-medium"
                          >
                            {h}
                          </span>
                        ))}
                      </div>
                    </div>

                    <Button
                      className="w-full bg-foreground text-background hover:bg-foreground/90 rounded-xl gap-2 h-10 text-sm font-medium transition-all duration-300"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveMonastery(activeMonastery === index ? null : index);
                      }}
                    >
                      <Camera className="w-4 h-4" />
                      View 360°
                    </Button>
                  </div>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Immersive 360° Viewer — Inline, no new tab */}
      <AnimatePresence>
        {activeMonastery !== null && (
          <motion.section
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="bg-card border-y border-border overflow-hidden"
          >
            <div className="container mx-auto px-4 py-12">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-foreground">{monasteries[activeMonastery].name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {monasteries[activeMonastery].location} • Est. {monasteries[activeMonastery].established}
                  </p>
                </div>
                <button
                  onClick={() => setActiveMonastery(null)}
                  className="p-2.5 rounded-full hover:bg-secondary transition-colors"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              <div className="rounded-2xl overflow-hidden border border-border">
                <iframe
                  width="100%"
                  height="500"
                  loading="lazy"
                  allowFullScreen
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(monasteries[activeMonastery].name + ', ' + monasteries[activeMonastery].location)}&t=k&z=18&ie=UTF8&iwloc=&output=embed`}
                  title={`${monasteries[activeMonastery].name} Map View`}
                  className="w-full border-0"
                />
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MonasteryMap;
