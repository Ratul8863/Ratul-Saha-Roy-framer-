import Image from "next/image";
import { cn } from "@/lib/utils";

interface AvatarProps {
  src?: string | null;
  alt: string;
  fallback?: string;
  className?: string;
  size?: number;
}

export function Avatar({
  src,
  alt,
  fallback,
  className,
  size = 40,
}: AvatarProps) {
  const initials =
    fallback ??
    alt
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

  return (
    <div
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-mist text-navy font-ui text-sm font-semibold",
        className
      )}
      style={{ width: size, height: size }}
    >
      {src ? (
        <Image src={src} alt={alt} fill className="object-cover" sizes={`${size}px`} />
      ) : (
        <span aria-hidden>{initials}</span>
      )}
    </div>
  );
}
