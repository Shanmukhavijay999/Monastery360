import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Play, RotateCcw, Volume2, Maximize, Eye } from "lucide-react";
import virtualTourImage from "@/assets/virtual-tour.jpg";
import TourViewer from "./TourViewer";
import { useTranslation } from "@/lib/i18n";

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
      <section id="tours" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-deep-earth mb-4">
              {t("tours.title")}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t("tours.subtitle")}
            </p>
          </div>

          {/* Featured Tour */}
          <div className="mb-16 animate-fade-in-up">
            <Card className="overflow-hidden shadow-monastery hover:shadow-xl transition-monastery">
              <div className="relative group cursor-pointer" onClick={() => openTour(0)}>
                <img
                  src={virtualTourImage}
                  alt="360-degree virtual monastery tour preview"
                  className="w-full h-64 md:h-96 object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-deep-earth/60 to-transparent flex items-center justify-center">
                  <Button
                    variant="hero"
                    size="xl"
                    className="gap-3 shadow-monastery group-hover:scale-105 transition-transform duration-300"
                    onClick={(e) => {
                      e.stopPropagation();
                      openTour(0);
                    }}
                  >
                    <Play className="w-6 h-6" />
                    {t("tours.startFeatured")}
                  </Button>
                </div>
                <div className="absolute top-4 left-4 bg-saffron text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold">
                  {t("tours.featured")}
                </div>
                <div className="absolute top-4 right-4 flex gap-2">
                  <div className="bg-background/80 backdrop-blur-sm text-foreground px-3 py-1 rounded-full text-sm">
                    {t("tours.ready360")}
                  </div>
                </div>
              </div>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-deep-earth mb-2">{t("tours.completeExp")}</h3>
                    <p className="text-muted-foreground">
                      {t("tours.completeDesc")}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-saffron">45 min</div>
                    <div className="text-sm text-muted-foreground">{t("tours.duration")}</div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {["4K Resolution", "Spatial Audio", "Interactive Hotspots", "Multi-language", "Offline Access"].map(
                    (feature) => (
                      <span key={feature} className="bg-warm-stone text-deep-earth px-3 py-1 rounded-full text-sm">
                        {feature}
                      </span>
                    )
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tour Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tours.map((tour, index) => (
              <Card
                key={tour.title}
                className="group hover:shadow-monastery transition-monastery animate-fade-in-up cursor-pointer"
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => openTour(tour.sceneIndex)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="font-bold text-deep-earth group-hover:text-saffron transition-monastery">
                      {tour.title}
                    </h3>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="opacity-0 group-hover:opacity-100 transition-monastery"
                    >
                      <Play className="w-4 h-4" />
                    </Button>
                  </div>

                  <p className="text-muted-foreground text-sm mb-4">{tour.description}</p>

                  <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Play className="w-3 h-3" />
                      {tour.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {tour.views} {t("tours.views")}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {tour.features.map((feature) => (
                      <span key={feature} className="text-xs bg-warm-stone text-deep-earth px-2 py-1 rounded">
                        {feature}
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="monastery"
                      size="sm"
                      className="flex-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        openTour(tour.sceneIndex);
                      }}
                    >
                      <Play className="w-4 h-4" />
                      {t("tours.startTour")}
                    </Button>
                    <Button variant="outline" size="sm">
                      <Volume2 className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Maximize className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Tour Viewer Modal */}
      <TourViewer
        isOpen={isTourOpen}
        onClose={() => setIsTourOpen(false)}
        initialScene={tourStartScene}
      />
    </>
  );
};

export default VirtualTours;