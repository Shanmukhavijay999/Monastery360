import { Suspense, lazy } from "react";
import Footer from "@/components/Footer";
import ParticleBackground from "@/components/ParticleBackground";

const CulturalEvents = lazy(() => import("@/components/CulturalEvents"));
const WeatherWidget = lazy(() => import("@/components/WeatherWidget"));

const SectionSkeleton = () => (
    <div className="w-full py-24">
        <div className="container mx-auto px-4">
            <div className="flex flex-col items-center gap-4">
                <div className="skeleton h-10 w-64 rounded-xl" />
                <div className="skeleton h-5 w-96 max-w-full rounded-lg" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full mt-8">
                    {[1, 2, 3].map((i) => <div key={i} className="skeleton h-48 rounded-2xl" />)}
                </div>
            </div>
        </div>
    </div>
);

const EventsPage = () => (
    <div className="min-h-screen bg-background relative">
        <ParticleBackground />
        <main className="relative z-10 pt-16">
            <Suspense fallback={<SectionSkeleton />}>
                <CulturalEvents />
            </Suspense>
            <Suspense fallback={<SectionSkeleton />}>
                <WeatherWidget />
            </Suspense>
        </main>
        <Footer />
    </div>
);

export default EventsPage;
