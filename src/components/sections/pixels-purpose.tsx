import { SectionContainer } from "@/components/layout/section-container";
import { ScrollReveal } from "@/components/shared/scroll-reveal";

function LayeredWord({
  text,
  className,
  offsets,
}: {
  text: string;
  className: string;
  offsets: Array<{ x: number; y: number }>;
}) {
  return (
    <span className="relative inline-grid place-items-start">
      {offsets.map((offset, index) => (
        <span
          key={`${text}-${index}`}
          className={className}
          style={{
            gridArea: "1 / 1",
            transform: `translate(${offset.x}px, ${offset.y}px)`,
            zIndex: index + 1,
          }}
          aria-hidden={index < offsets.length - 1}
        >
          {text}
        </span>
      ))}
    </span>
  );
}

export function PixelsPurpose() {
  return (
    <SectionContainer className="overflow-hidden py-16 md:py-[210px]">
      <ScrollReveal>
        <div className="mx-auto flex max-w-[1027px] flex-col items-center gap-10 text-center">
          <LayeredWord
            text="PIXELS WITH"
            className="font-display text-[clamp(2.5rem,10vw,9.375rem)] uppercase leading-[1.2] tracking-[0.02em] text-mist"
            offsets={[
              { x: 0, y: 23 },
              { x: 7, y: 15 },
              { x: 14, y: 7 },
              { x: 21, y: 0 },
            ]}
          />
          <LayeredWord
            text="PURPOSE"
            className="font-display text-[clamp(3rem,12vw,12.5625rem)] uppercase leading-[0.9] tracking-[0.02em] text-navy-dark"
            offsets={[
              { x: 0, y: 23 },
              { x: 8, y: 15 },
              { x: 16, y: 8 },
              { x: 24, y: 0 },
            ]}
          />
        </div>
      </ScrollReveal>
    </SectionContainer>
  );
}
