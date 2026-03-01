import { lazy, Suspense } from "react";
import HeroSection from "@/components/HeroSection";
import StatsCounter from "@/components/StatsCounter";
import MonasteryMap from "@/components/MonasteryMap";
import Footer from "@/components/Footer";
import ParticleBackground from "@/components/ParticleBackground";

// Lazy load below-the-fold sections for performance
const AIMonasteryInsights = lazy(() => import("@/components/AIMonasteryInsights"));
const VirtualTours = lazy(() => import("@/components/VirtualTours"));
const DigitalArchives = lazy(() => import("@/components/DigitalArchives"));
const AITripPlanner = lazy(() => import("@/components/AITripPlanner"));
const CulturalEvents = lazy(() => import("@/components/CulturalEvents"));
const AudioGuide = lazy(() => import("@/components/AudioGuide"));
const AIMonasteryQuiz = lazy(() => import("@/components/AIMonasteryQuiz"));
const WeatherWidget = lazy(() => import("@/components/WeatherWidget"));
const Testimonials = lazy(() => import("@/components/Testimonials"));
const AIMeditationMode = lazy(() => import("@/components/AIMeditationMode"));

// Skeleton fallback for lazy sections
const SectionSkeleton = () => (
  <div className="w-full py-24">
    <div className="container mx-auto px-4">
      <div className="flex flex-col items-center gap-4">
        <div className="skeleton h-10 w-64 rounded-xl" />
        <div className="skeleton h-5 w-96 max-w-full rounded-lg" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full mt-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton h-48 rounded-2xl" />
          ))}
        </div>
      </div>
    </div>
  </div>
);

const Index = () => {
  return (
    <div className="min-h-screen bg-background relative">
      <ParticleBackground />
      <main className="relative z-10">
        <HeroSection />
        <StatsCounter />
        <MonasteryMap />

        <Suspense fallback={<SectionSkeleton />}>
          <AIMonasteryInsights />
        </Suspense>

        <Suspense fallback={<SectionSkeleton />}>
          <VirtualTours />
        </Suspense>

        <Suspense fallback={<SectionSkeleton />}>
          <DigitalArchives />
        </Suspense>

        <Suspense fallback={<SectionSkeleton />}>
          <AITripPlanner />
        </Suspense>

        <Suspense fallback={<SectionSkeleton />}>
          <CulturalEvents />
        </Suspense>

        <Suspense fallback={<SectionSkeleton />}>
          <AudioGuide />
        </Suspense>

        <Suspense fallback={<SectionSkeleton />}>
          <AIMeditationMode />
        </Suspense>

        <Suspense fallback={<SectionSkeleton />}>
          <AIMonasteryQuiz />
        </Suspense>

        <Suspense fallback={<SectionSkeleton />}>
          <WeatherWidget />
        </Suspense>

        <Suspense fallback={<SectionSkeleton />}>
          <Testimonials />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
