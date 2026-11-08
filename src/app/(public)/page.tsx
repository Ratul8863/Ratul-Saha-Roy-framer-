import { PortfolioHero } from "@/components/sections/portfolio-hero";
import { FeatureProjects } from "@/components/sections/feature-projects";
import { AllProjects } from "@/components/sections/all-projects";
import { PortfolioContact } from "@/components/sections/portfolio-contact";

export default function HomePage() {
  return (
    <div className="bg-black">
      <div className="overflow-x-clip">
        <PortfolioHero />
      </div>
      <FeatureProjects />
      <div className="min-w-0 overflow-x-clip">
        <AllProjects />
        <div className="px-4 sm:px-5 lg:px-0">
          <PortfolioContact />
        </div>
      </div>
    </div>
  );
}
