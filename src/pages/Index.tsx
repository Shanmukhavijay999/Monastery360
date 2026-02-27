import HeroSection from "@/components/HeroSection";
import MonasteryMap from "@/components/MonasteryMap";
import VirtualTours from "@/components/VirtualTours";
import DigitalArchives from "@/components/DigitalArchives";
import CulturalEvents from "@/components/CulturalEvents";
import AudioGuide from "@/components/AudioGuide";
import Footer from "@/components/Footer";
import StatsCounter from "@/components/StatsCounter";
import AIMonasteryInsights from "@/components/AIMonasteryInsights";
import AITripPlanner from "@/components/AITripPlanner";
import AIMonasteryQuiz from "@/components/AIMonasteryQuiz";
import Testimonials from "@/components/Testimonials";
import WeatherWidget from "@/components/WeatherWidget";
import AIChatbot from "@/components/AIChatbot";
import ParticleBackground from "@/components/ParticleBackground";

const Index = () => {
  return (
    <div className="min-h-screen bg-background relative">
      <ParticleBackground />
      <main className="relative z-10">
        <HeroSection />
        <StatsCounter />
        <MonasteryMap />
        <AIMonasteryInsights />
        <VirtualTours />
        <DigitalArchives />
        <AITripPlanner />
        <CulturalEvents />
        <AudioGuide />
        <AIMonasteryQuiz />
        <WeatherWidget />
        <Testimonials />
      </main>
      <Footer />
      <AIChatbot />
    </div>
  );
};

export default Index;
