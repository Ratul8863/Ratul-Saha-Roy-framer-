import { Marquee } from "@/components/shared/marquee";
import { heroMarqueeItems } from "@/constants/projects";

export function HeroMarquee() {
  return <Marquee items={heroMarqueeItems} />;
}
