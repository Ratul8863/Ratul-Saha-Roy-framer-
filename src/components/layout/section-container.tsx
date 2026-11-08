import { cn } from "@/lib/utils";

interface SectionContainerProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  as?: "section" | "div" | "header" | "footer";
}

/** Figma main content width ≈ 1642px beside 214px sidebar */
export function SectionContainer({
  children,
  className,
  id,
  as: Tag = "section",
}: SectionContainerProps) {
  return (
    <Tag
      id={id}
      className={cn(
        "mx-auto w-full max-w-[1642px] px-5 md:px-8 xl:px-0",
        className
      )}
    >
      {children}
    </Tag>
  );
}
