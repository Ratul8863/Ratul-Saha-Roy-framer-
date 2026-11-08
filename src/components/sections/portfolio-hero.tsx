import { heroIntro } from "@/constants/projects";
import { HeroStage } from "@/components/sections/hero-stage";
import { BlockTextReveal } from "@/components/ui/block-text-reveal";
import { cn } from "@/lib/utils";

export function PortfolioHero() {
  return (
    <section
      className={
        // Mobile: full device frame (Figma 528:1207 is 390×896). Header is
        // fixed over the hero, so we do not subtract its height.
        "relative isolate h-dvh overflow-clip bg-white lg:-mt-5 lg:h-[calc(100svh-1.25rem)]"
      }
    >
      {/*
        Figma 528:1232 — left 10, top 64, width 370.
        Mobile: clear fixed header. Desktop: keep copy in the left band so it
        does not run through the portrait head at 1024–1440 / short heights.
        Wrapper owns layout; !text-justify beats BlockTextReveal's text-left
        (cn has no tailwind-merge).
      */}
      <div
        className={cn(
          "pointer-events-none absolute top-[4.75rem] left-2.5 z-30 w-[calc(100%-1.25rem)] max-w-[370px]",
          // Left column only — stays off the face while portrait stays full-bleed.
          "lg:top-5 lg:left-5 lg:w-[min(100%,30%)] lg:max-w-[20rem]",
          "xl:w-[min(100%,32%)] xl:max-w-[24rem]",
          "2xl:max-w-[30rem]",
        )}
      >
        <BlockTextReveal
          text={heroIntro}
          textColor="#1e1e1e"
          className={cn(
            "font-body text-[12px] leading-5 tracking-[0.36px] !text-justify uppercase",
            "lg:text-left lg:text-[12px] lg:leading-[18px] lg:tracking-[0.36px]",
            "xl:text-[13px] xl:leading-[19px] xl:tracking-[0.4px]",
            "2xl:text-[15px] 2xl:leading-[22px] 2xl:tracking-[0.45px]",
          )}
        />
      </div>

      <HeroStage />
    </section>
  );
}
