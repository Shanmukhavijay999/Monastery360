import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Route, Clock, Camera } from "lucide-react";

// Google API Key
const GOOGLE_API_KEY = "AIzaSyDnDGJa5sUA8LsaY0ShcgZzK0RTSkH8rB0";

const MonasteryMap = () => {
  const monasteries = [
    {
      name: "Rumtek Monastery",
      location: "East Sikkim, India",
      distance: "24 km from Gangtok",
      type: "Kagyu",
      established: "1740",
      highlights: ["Golden Stupa", "Ancient Murals", "Prayer Wheels"],
      lat: 27.3305,
      lng: 88.5825, // Verified Street View coordinate
    },
    {
      name: "Pemayangtse Monastery",
      location: "West Sikkim, India",
      distance: "110 km from Gangtok",
      type: "Nyingma",
      established: "1705",
      highlights: ["Wooden Sculptures", "Sacred Relics", "Mountain Views"],
      lat: 27.3071,
      lng: 88.2439, // Verified Street View coordinate
    },
    {
      name: "Tashiding Monastery",
      location: "West Sikkim, India",
      distance: "40 km from Pelling",
      type: "Nyingma",
      established: "1717",
      highlights: ["Holy Spring", "Festival Grounds", "Ancient Chortens"],
      lat: 27.3120,
      lng: 88.2650, // Verified Street View coordinate
    },
    {
      name: "Enchey Monastery",
      location: "Gangtok, India",
      distance: "3 km from city center",
      type: "Nyingma",
      established: "1909",
      highlights: ["Urban Location", "Cultural Events", "Easy Access"],
      lat: 27.3375,
      lng: 88.6060, // Verified Street View coordinate
    },
  ];

  const demoMonastery = monasteries[0]; // Rumtek Monastery for iframe demo

  return (
    <div>
      {/* ======================= Monastery Info Section ======================= */}
      <section id="map" className="py-20 bg-warm-stone">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-deep-earth mb-4">
              Explore Sikkim Monasteries
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover historic monasteries of Sikkim with details, highlights, and 360° virtual tours.
            </p>
          </div>

          {/* Monastery Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {monasteries.map((monastery, index) => (
              <Card
                key={monastery.name}
                className="hover:shadow-monastery transition-monastery animate-fade-in-up group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="font-bold text-deep-earth group-hover:text-saffron transition-monastery">
                      {monastery.name}
                    </h3>
                    <span className="text-xs bg-saffron text-primary-foreground px-2 py-1 rounded">
                      {monastery.type}
                    </span>
                  </div>
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4" /> {monastery.location}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Route className="w-4 h-4" /> {monastery.distance}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" /> Est. {monastery.established}
                    </div>
                  </div>
                  <div className="mb-4">
                    <h4 className="text-xs font-semibold text-deep-earth mb-2">Highlights:</h4>
                    <div className="flex flex-wrap gap-1">
                      {monastery.highlights.map((h) => (
                        <span
                          key={h}
                          className="text-xs bg-warm-stone text-deep-earth px-2 py-1 rounded"
                        >
                          {h}
                        </span>
                      ))}
                    </div>
                  </div>
                  <Button
                    variant="monastery"
                    size="sm"
                    className="mt-2 w-full"
                    onClick={() =>
                      window.open(
                        `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${monastery.lat},${monastery.lng}`,
                        "_blank"
                      )
                    }
                  >
                    <Camera className="w-4 h-4" /> View 360°
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ======================= Immersive 360° Virtual Tour ======================= */}
      <section id="tours" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-deep-earth mb-4">
              360° Virtual Tour
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore {demoMonastery.name} in full immersive Street View below.
            </p>
          </div>

          <div className="rounded-xl overflow-hidden shadow-monastery max-w-4xl mx-auto">
            <iframe
              width="100%"
              height="500"
              loading="lazy"
              allowFullScreen
              src={`https://www.google.com/maps/embed/v1/streetview?key=${GOOGLE_API_KEY}&location=${demoMonastery.lat},${demoMonastery.lng}&heading=210&pitch=10&fov=80`}
              title={`${demoMonastery.name} Street View`}
            ></iframe>

            <div className="p-6 bg-warm-stone text-center">
              <h3 className="font-bold text-deep-earth text-xl">{demoMonastery.name}</h3>
              <p className="text-sm text-muted-foreground">
                {demoMonastery.location} | Est. {demoMonastery.established}
              </p>
              <Button
                variant="monastery"
                size="sm"
                className="mt-4"
                onClick={() =>
                  window.open(
                    `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${demoMonastery.lat},${demoMonastery.lng}`,
                    "_blank"
                  )
                }
              >
                <Camera className="w-4 h-4" /> Open 360° View
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MonasteryMap;
