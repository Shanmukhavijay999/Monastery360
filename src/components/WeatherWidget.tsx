import { Card, CardContent } from "@/components/ui/card";
import {
    Cloud,
    Sun,
    CloudRain,
    Wind,
    Droplets,
    Eye,
    Thermometer,
    CloudSnow,
} from "lucide-react";

const WEATHER_DATA = [
    {
        location: "Gangtok",
        temp: 18,
        condition: "Partly Cloudy",
        icon: Cloud,
        humidity: 72,
        wind: 12,
        visibility: "8 km",
        gradient: "from-blue-400 to-cyan-400",
        monasteries: ["Enchey", "Do Drul Chorten"],
    },
    {
        location: "Pelling",
        temp: 14,
        condition: "Clear Sky",
        icon: Sun,
        humidity: 65,
        wind: 8,
        visibility: "15 km",
        gradient: "from-amber-400 to-orange-400",
        monasteries: ["Pemayangtse", "Sanga Choeling"],
    },
    {
        location: "Rumtek",
        temp: 16,
        condition: "Light Rain",
        icon: CloudRain,
        humidity: 85,
        wind: 15,
        visibility: "6 km",
        gradient: "from-indigo-400 to-purple-400",
        monasteries: ["Rumtek Dharma Chakra"],
    },
    {
        location: "Tashiding",
        temp: 12,
        condition: "Foggy",
        icon: CloudSnow,
        humidity: 90,
        wind: 5,
        visibility: "2 km",
        gradient: "from-gray-400 to-slate-500",
        monasteries: ["Tashiding Monastery"],
    },
];

const WeatherWidget = () => {
    return (
        <section className="py-16 bg-gradient-to-b from-blue-50/50 via-white to-amber-50/30">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12 animate-fade-in-up">
                    <h3 className="text-2xl md:text-3xl font-bold text-deep-earth mb-3">
                        🌤️ Live Weather at Monastery Locations
                    </h3>
                    <p className="text-muted-foreground max-w-xl mx-auto text-sm">
                        Plan your visit with real-time weather conditions at major monastery destinations in Sikkim
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {WEATHER_DATA.map((weather, index) => {
                        const IconComp = weather.icon;
                        return (
                            <Card
                                key={weather.location}
                                className="overflow-hidden hover:shadow-xl transition-all duration-500 hover:-translate-y-1 animate-fade-in-up group border-0"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <div className={`bg-gradient-to-br ${weather.gradient} p-5 text-white relative overflow-hidden`}>
                                    <div className="absolute -top-4 -right-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                        <IconComp className="w-24 h-24" />
                                    </div>
                                    <div className="relative z-10">
                                        <p className="text-white/80 text-sm font-medium mb-1">{weather.location}</p>
                                        <div className="flex items-end gap-2">
                                            <span className="text-4xl font-black">{weather.temp}°</span>
                                            <span className="text-sm text-white/80 mb-1">C</span>
                                        </div>
                                        <div className="flex items-center gap-2 mt-2">
                                            <IconComp className="w-4 h-4" />
                                            <span className="text-sm">{weather.condition}</span>
                                        </div>
                                    </div>
                                </div>
                                <CardContent className="p-4 space-y-3">
                                    <div className="grid grid-cols-3 gap-2 text-center">
                                        <div>
                                            <Droplets className="w-3.5 h-3.5 mx-auto text-blue-400 mb-1" />
                                            <p className="text-xs text-gray-400">Humidity</p>
                                            <p className="text-sm font-semibold text-gray-700">{weather.humidity}%</p>
                                        </div>
                                        <div>
                                            <Wind className="w-3.5 h-3.5 mx-auto text-gray-400 mb-1" />
                                            <p className="text-xs text-gray-400">Wind</p>
                                            <p className="text-sm font-semibold text-gray-700">{weather.wind} km/h</p>
                                        </div>
                                        <div>
                                            <Eye className="w-3.5 h-3.5 mx-auto text-amber-400 mb-1" />
                                            <p className="text-xs text-gray-400">Visibility</p>
                                            <p className="text-sm font-semibold text-gray-700">{weather.visibility}</p>
                                        </div>
                                    </div>
                                    <div className="pt-2 border-t border-gray-100">
                                        <p className="text-xs text-gray-400 mb-1">Nearby Monasteries:</p>
                                        <div className="flex flex-wrap gap-1">
                                            {weather.monasteries.map((m) => (
                                                <span key={m} className="text-xs bg-orange-50 text-orange-600 px-2 py-0.5 rounded-full">
                                                    {m}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default WeatherWidget;
