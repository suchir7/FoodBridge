import Hero from "@/components/foodbridge/Hero";
import StatsStrip from "@/components/foodbridge/StatsStrip";
import HowItWorks from "@/components/foodbridge/HowItWorks";
import ImpactStories from "@/components/foodbridge/ImpactStories";

export default function Index() {
  return (
    <div className="bg-background">
      <Hero />
      <StatsStrip />
      <HowItWorks />
      <ImpactStories />
    </div>
  );
}
