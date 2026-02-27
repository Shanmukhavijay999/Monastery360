import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AudioLines, Download, Play, Pause, Languages, MapPin, Headphones, Wifi } from "lucide-react";

const AudioGuide = () => {
  const languages = [
    { name: "English", speakers: "Global", flag: "🇺🇸" },
    { name: "Hindi", speakers: "India", flag: "🇮🇳" },
    { name: "Tibetan", speakers: "Local", flag: "🏴" },
    { name: "Nepali", speakers: "Regional", flag: "🇳🇵" },
    { name: "Chinese", speakers: "Mandarin", flag: "🇨🇳" },
    { name: "Japanese", speakers: "日本語", flag: "🇯🇵" }
  ];

  const audioFeatures = [
    {
      title: "GPS-Based Narration",
      description: "Automatic audio playback based on your location within the monastery grounds",
      icon: MapPin,
      status: "Available"
    },
    {
      title: "Offline Mode",
      description: "Download audio guides for use in remote monastery locations without internet",
      icon: Download,
      status: "Premium"
    },
    {
      title: "Multi-Language Support",
      description: "Choose from 6 languages with native speaker narration and cultural context",
      icon: Languages,
      status: "Available"
    },
    {
      title: "3D Spatial Audio", 
      description: "Immersive soundscape with monastery bells, chants, and ambient sounds",
      icon: Headphones,
      status: "Coming Soon"
    }
  ];

  const audioTours = [
    {
      title: "Complete Monastery Guide",
      duration: "45 min",
      locations: "8 stops",
      description: "Comprehensive tour covering history, architecture, and spiritual significance",
      size: "156 MB"
    },
    {
      title: "Meditation & Mindfulness",
      duration: "25 min", 
      locations: "4 stops",
      description: "Guided meditation sessions in sacred spaces with breathing exercises",
      size: "89 MB"
    },
    {
      title: "Artistic Heritage Tour",
      duration: "30 min",
      locations: "6 stops", 
      description: "Deep dive into thangka paintings, sculptures, and architectural details",
      size: "112 MB"
    }
  ];

  return (
    <section id="audio" className="py-20 bg-warm-stone">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-deep-earth mb-4">
            Smart Audio Guide
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Experience monasteries with intelligent audio guides that adapt to your location, 
            preferences, and pace. Available in multiple languages with offline support.
          </p>
        </div>

        {/* Audio Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {audioFeatures.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Card key={feature.title} className="hover:shadow-monastery transition-monastery animate-fade-in-up" style={{animationDelay: `${index * 0.1}s`}}>
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-hero rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="w-6 h-6 text-primary-foreground" />
                  </div>
                  
                  <h3 className="font-bold text-deep-earth mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm mb-3">{feature.description}</p>
                  
                  <span className={`text-xs px-3 py-1 rounded-full font-semibold
                    ${feature.status === 'Available' ? 'bg-saffron text-primary-foreground' :
                      feature.status === 'Premium' ? 'bg-gold text-foreground' : 'bg-muted text-muted-foreground'}`}>
                    {feature.status}
                  </span>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Main Audio Interface */}
        <div className="mb-16 animate-fade-in-up">
          <Card className="overflow-hidden shadow-monastery">
            <CardContent className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-saffron rounded-full flex items-center justify-center">
                      <AudioLines className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-deep-earth">Smart Audio Experience</h3>
                      <p className="text-muted-foreground">Location-aware spiritual journey</p>
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground mb-6">
                    Our intelligent audio guide system uses GPS and Bluetooth beacons to deliver 
                    contextual information exactly when and where you need it. Experience the 
                    monastery through the wisdom of senior monks and cultural experts.
                  </p>
                  
                  <div className="space-y-4 mb-6">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Current Location</span>
                      <span className="text-sm font-semibold text-deep-earth">Monastery Entrance</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Audio Quality</span>
                      <span className="text-sm font-semibold text-deep-earth">High (320kbps)</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Connection</span>
                      <div className="flex items-center gap-2">
                        <Wifi className="w-4 h-4 text-green-500" />
                        <span className="text-sm font-semibold text-green-600">Connected</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button variant="monastery" size="lg" className="gap-2">
                      <Play className="w-5 h-5" />
                      Start Audio Tour
                    </Button>
                    <Button variant="temple" size="lg" className="gap-2">
                      <Download className="w-5 h-5" />
                      Download for Offline
                    </Button>
                  </div>
                </div>
                
                {/* Audio Player Interface */}
                <div className="bg-gradient-mountain rounded-lg p-6 text-primary-foreground">
                  <div className="text-center mb-6">
                    <h4 className="font-bold mb-2">Welcome to Rumtek Monastery</h4>
                    <p className="text-sm opacity-90">Introduction & History</p>
                  </div>
                  
                  <div className="flex items-center gap-4 mb-4">
                    <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary-foreground/20">
                      <Play className="w-6 h-6" />
                    </Button>
                    <div className="flex-1">
                      <div className="h-1 bg-primary-foreground/30 rounded-full">
                        <div className="h-1 bg-primary-foreground rounded-full w-1/3"></div>
                      </div>
                    </div>
                    <span className="text-sm">2:30 / 7:45</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span>Track 1 of 8</span>
                    <div className="flex items-center gap-2">
                      <Languages className="w-4 h-4" />
                      <span>English</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Language Options */}
        <div className="mb-16 animate-fade-in-up">
          <h3 className="text-2xl font-bold text-deep-earth mb-8 text-center">Choose Your Language</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {languages.map((language, index) => (
              <Card key={language.name} className="hover:shadow-monastery transition-monastery cursor-pointer group" style={{animationDelay: `${index * 0.05}s`}}>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl mb-2">{language.flag}</div>
                  <div className="font-semibold text-deep-earth group-hover:text-saffron transition-monastery">
                    {language.name}
                  </div>
                  <div className="text-xs text-muted-foreground">{language.speakers}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Available Audio Tours */}
        <div className="animate-fade-in-up">
          <h3 className="text-2xl font-bold text-deep-earth mb-8">Available Audio Tours</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {audioTours.map((tour, index) => (
              <Card key={tour.title} className="hover:shadow-monastery transition-monastery" style={{animationDelay: `${index * 0.1}s`}}>
                <CardContent className="p-6">
                  <h4 className="font-bold text-deep-earth mb-2">{tour.title}</h4>
                  <p className="text-muted-foreground text-sm mb-4">{tour.description}</p>
                  
                  <div className="space-y-2 mb-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Duration:</span>
                      <span className="text-deep-earth font-semibold">{tour.duration}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Locations:</span>
                      <span className="text-deep-earth font-semibold">{tour.locations}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Size:</span>
                      <span className="text-deep-earth font-semibold">{tour.size}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="monastery" size="sm" className="flex-1">
                      <Play className="w-4 h-4" />
                      Play
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AudioGuide;