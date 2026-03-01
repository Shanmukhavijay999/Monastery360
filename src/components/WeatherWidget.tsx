import { useEffect, useState, useCallback } from "react";
import {
    Cloud, Sun, CloudRain, Droplets, Wind, Eye,
    CloudSnow, Zap, CloudDrizzle, RefreshCw, MapPin, Thermometer,
} from "lucide-react";
import ScrollReveal from "./ScrollReveal";
import { motion, AnimatePresence } from "framer-motion";

// ─── Monastery locations with coordinates ─────────────────────────────────────
const LOCATIONS = [
    { name: "Gangtok", lat: 27.3314, lon: 88.6138, monasteries: ["Enchey Monastery", "Do Drul Chorten"] },
    { name: "Pelling", lat: 27.2908, lon: 88.2094, monasteries: ["Pemayangtse", "Sanga Choeling"] },
    { name: "Rumtek", lat: 27.3052, lon: 88.5903, monasteries: ["Rumtek Dharma Chakra"] },
    { name: "Tashiding", lat: 27.3142, lon: 88.3017, monasteries: ["Tashiding Monastery"] },
];

// ─── WMO weather code → label + icon ─────────────────────────────────────────
function decodeWMO(code: number): { label: string; Icon: React.ElementType } {
    if (code === 0) return { label: "Clear Sky", Icon: Sun };
    if (code <= 2) return { label: "Partly Cloudy", Icon: Cloud };
    if (code === 3) return { label: "Overcast", Icon: Cloud };
    if (code <= 49) return { label: "Foggy", Icon: Cloud };
    if (code <= 57) return { label: "Drizzle", Icon: CloudDrizzle };
    if (code <= 67) return { label: "Rain", Icon: CloudRain };
    if (code <= 77) return { label: "Snow", Icon: CloudSnow };
    if (code <= 82) return { label: "Rain Showers", Icon: CloudRain };
    if (code <= 86) return { label: "Snow Showers", Icon: CloudSnow };
    if (code <= 99) return { label: "Thunderstorm", Icon: Zap };
    return { label: "Unknown", Icon: Cloud };
}

// ─── Temperature gradient based on temp ──────────────────────────────────────
function tempGradient(temp: number): string {
    if (temp <= 5) return "from-blue-900 to-blue-700";
    if (temp <= 12) return "from-slate-800 to-slate-600";
    if (temp <= 20) return "from-gray-900 to-gray-700";
    if (temp <= 28) return "from-amber-900 to-orange-700";
    return "from-red-900 to-orange-600";
}

// ─── Types ────────────────────────────────────────────────────────────────────
interface WeatherCard {
    name: string;
    monasteries: string[];
    temp: number;
    feelsLike: number;
    humidity: number;
    wind: number;
    visibility: number;
    wmoCode: number;
    label: string;
    Icon: React.ElementType;
    gradient: string;
}

// ─── Fetch live weather from Open-Meteo (free, no API key) ───────────────────
async function fetchWeather(lat: number, lon: number) {
    const url =
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
        `&current=temperature_2m,apparent_temperature,relative_humidity_2m,` +
        `wind_speed_10m,weather_code,visibility` +
        `&wind_speed_unit=kmh&temperature_unit=celsius`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
}

// ─── Skeleton card ────────────────────────────────────────────────────────────
const SkeletonCard = () => (
    <div className="bg-card rounded-2xl border border-border/60 overflow-hidden animate-pulse">
        <div className="p-5 bg-foreground/10 h-28" />
        <div className="p-4 space-y-3">
            <div className="grid grid-cols-3 gap-2">
                {[0, 1, 2].map(i => (
                    <div key={i} className="flex flex-col items-center gap-1">
                        <div className="w-4 h-4 rounded-full bg-muted-foreground/20" />
                        <div className="w-10 h-2 rounded bg-muted-foreground/20" />
                        <div className="w-8 h-3 rounded bg-muted-foreground/20" />
                    </div>
                ))}
            </div>
            <div className="pt-3 border-t border-border/50 space-y-1.5">
                <div className="w-12 h-2 rounded bg-muted-foreground/20" />
                <div className="w-32 h-4 rounded bg-muted-foreground/20" />
            </div>
        </div>
    </div>
);

// ─── Main component ───────────────────────────────────────────────────────────
const WeatherWidget = () => {
    const [cards, setCards] = useState<WeatherCard[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
    const [refreshing, setRefreshing] = useState(false);

    const loadWeather = useCallback(async (silent = false) => {
        if (!silent) setLoading(true);
        else setRefreshing(true);
        setError(null);
        try {
            const results = await Promise.all(
                LOCATIONS.map(loc => fetchWeather(loc.lat, loc.lon).then(data => ({ loc, data })))
            );
            const built: WeatherCard[] = results.map(({ loc, data }) => {
                const c = data.current;
                const wmo = c.weather_code ?? 0;
                const { label, Icon } = decodeWMO(wmo);
                const temp = Math.round(c.temperature_2m);
                return {
                    name: loc.name,
                    monasteries: loc.monasteries,
                    temp,
                    feelsLike: Math.round(c.apparent_temperature),
                    humidity: Math.round(c.relative_humidity_2m),
                    wind: Math.round(c.wind_speed_10m),
                    visibility: Math.round((c.visibility ?? 10000) / 1000),
                    wmoCode: wmo,
                    label,
                    Icon,
                    gradient: tempGradient(temp),
                };
            });
            setCards(built);
            setLastUpdated(new Date());
        } catch (e: any) {
            setError("Could not fetch live weather. Showing cached data may be unavailable.");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    // Initial load
    useEffect(() => { loadWeather(); }, [loadWeather]);

    // Auto-refresh every 10 minutes
    useEffect(() => {
        const iv = setInterval(() => loadWeather(true), 10 * 60 * 1000);
        return () => clearInterval(iv);
    }, [loadWeather]);

    const fmt = (d: Date) =>
        d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    return (
        <section className="py-16 md:py-20 bg-background border-y border-border/50">
            <div className="container mx-auto px-4">
                <ScrollReveal>
                    <div className="text-center mb-12">
                        <div className="flex items-center justify-center gap-2 mb-3">
                            <span className="relative flex h-2.5 w-2.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                            </span>
                            <span className="text-xs font-semibold text-emerald-500 uppercase tracking-widest">
                                Live Weather
                            </span>
                        </div>
                        <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
                            Live Weather at Monastery Locations
                        </h3>
                        <p className="text-muted-foreground max-w-xl mx-auto text-sm mb-4">
                            Real-time conditions from Open-Meteo — updated automatically every&nbsp;10&nbsp;minutes
                        </p>

                        {/* Last updated + refresh button */}
                        <div className="flex items-center justify-center gap-3 text-xs text-muted-foreground">
                            {lastUpdated && !loading && (
                                <span className="flex items-center gap-1">
                                    <MapPin className="w-3 h-3" />
                                    Last updated: {fmt(lastUpdated)}
                                </span>
                            )}
                            <button
                                onClick={() => loadWeather(true)}
                                disabled={loading || refreshing}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border hover:bg-secondary transition-all duration-300 disabled:opacity-50 text-foreground"
                            >
                                <RefreshCw className={`w-3 h-3 ${refreshing ? "animate-spin" : ""}`} />
                                {refreshing ? "Refreshing…" : "Refresh"}
                            </button>
                        </div>
                    </div>
                </ScrollReveal>

                {/* Error banner */}
                <AnimatePresence>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                            className="mb-6 p-4 rounded-2xl bg-red-950/50 border border-red-800/50 text-red-300 text-sm text-center"
                        >
                            ⚠️ {error}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Cards grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {loading
                        ? LOCATIONS.map(l => <SkeletonCard key={l.name} />)
                        : cards.map((weather, index) => {
                            const { Icon } = weather;
                            return (
                                <ScrollReveal key={weather.name} delay={index * 0.08}>
                                    <motion.div
                                        whileHover={{ y: -4 }}
                                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                        className="bg-card rounded-2xl border border-border/60 overflow-hidden hover:shadow-premium hover:border-border transition-all duration-500"
                                    >
                                        {/* Header with live temp */}
                                        <div className={`p-5 bg-gradient-to-br ${weather.gradient} text-white relative overflow-hidden`}>
                                            {/* Big background icon */}
                                            <div className="absolute -top-4 -right-4 opacity-10">
                                                <Icon className="w-28 h-28" />
                                            </div>

                                            <div className="relative z-10">
                                                <p className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-2 flex items-center gap-1">
                                                    <MapPin className="w-3 h-3" /> {weather.name}
                                                </p>
                                                <div className="flex items-end gap-1">
                                                    <span className="text-5xl font-bold">{weather.temp}</span>
                                                    <span className="text-lg text-white/70 mb-1">°C</span>
                                                </div>
                                                <p className="text-white/50 text-xs mt-0.5 flex items-center gap-1">
                                                    <Thermometer className="w-3 h-3" />
                                                    Feels like {weather.feelsLike}°C
                                                </p>
                                                <div className="flex items-center gap-1.5 mt-2 text-sm text-white/70">
                                                    <Icon className="w-4 h-4" />
                                                    <span>{weather.label}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Stats */}
                                        <div className="p-4 space-y-3">
                                            <div className="grid grid-cols-3 gap-2 text-center">
                                                <div>
                                                    <Droplets className="w-3.5 h-3.5 mx-auto text-blue-500 mb-1" />
                                                    <p className="text-[10px] text-muted-foreground">Humidity</p>
                                                    <p className="text-xs font-semibold text-foreground">{weather.humidity}%</p>
                                                </div>
                                                <div>
                                                    <Wind className="w-3.5 h-3.5 mx-auto text-muted-foreground mb-1" />
                                                    <p className="text-[10px] text-muted-foreground">Wind</p>
                                                    <p className="text-xs font-semibold text-foreground">{weather.wind} km/h</p>
                                                </div>
                                                <div>
                                                    <Eye className="w-3.5 h-3.5 mx-auto text-primary mb-1" />
                                                    <p className="text-[10px] text-muted-foreground">Visibility</p>
                                                    <p className="text-xs font-semibold text-foreground">{weather.visibility} km</p>
                                                </div>
                                            </div>

                                            {/* Nearby monasteries */}
                                            <div className="pt-3 border-t border-border/50">
                                                <p className="text-[10px] text-muted-foreground mb-1.5 uppercase tracking-wider">Nearby</p>
                                                <div className="flex flex-wrap gap-1">
                                                    {weather.monasteries.map(m => (
                                                        <span key={m} className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                                                            {m}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                </ScrollReveal>
                            );
                        })}
                </div>

                {/* Attribution */}
                {!loading && (
                    <p className="text-center text-[10px] text-muted-foreground/50 mt-6">
                        Weather data provided by{" "}
                        <a href="https://open-meteo.com/" target="_blank" rel="noopener noreferrer" className="underline hover:text-muted-foreground transition-colors">
                            Open-Meteo
                        </a>{" "}
                        · Free & open-source weather API
                    </p>
                )}
            </div>
        </section>
    );
};

export default WeatherWidget;
