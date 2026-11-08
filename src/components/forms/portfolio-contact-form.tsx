"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { submitContact } from "@/features/contact/actions/submit-contact";
import { LiquidCarveButton } from "@/components/ui/liquid-carve-button";
import { cn } from "@/lib/utils";

const BUDGET_OPTIONS = [
  "$500  -  $1k",
  "$1 . 5k  -  $2k",
  "$1 . 5  -  $2k",
  "$2k  -  $3k",
  "$3k  -  $5k",
  "Above  $5k",
  "Decide   on   Chat",
] as const;

const SERVICE_OPTIONS = [
  "Website Design",
  "Mobile App Design",
  "Dashboard Design",
  "Landing Page Design",
  "Web App Design",
  "Website Redesign",
  "Mobile App Redesign",
] as const;

function FloatingField({
  id,
  label,
  children,
  className,
}: {
  id: string;
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative w-full border-[0.3px] border-cream transition-colors duration-300 hover:border-cream focus-within:border",
        className
      )}
    >
      <label
        htmlFor={id}
        className="absolute -top-[13px] left-3 z-10 max-w-[calc(100%-1.5rem)] truncate bg-black border border-cream px-1.5 py-1 font-body text-[11px] leading-[16px] tracking-[1px] text-cream sm:left-4 sm:text-[12px] sm:leading-[18px] sm:tracking-[1.2px]"
      >
        {label}
      </label>
      {children}
    </div>
  );
}

function Chip({
  selected,
  onClick,
  children,
  tracking,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
  tracking?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        "font-body text-sm leading-5 whitespace-normal transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream sm:text-base sm:leading-6 sm:whitespace-pre",
        tracking && "tracking-[0.08em] sm:tracking-[1.6px]",
        selected
          ? "border-b border-dashed border-cream px-1.5 pb-1 text-cream sm:px-2.5"
          : "border-b border-dashed border-transparent px-0 text-cream/50 hover:border-cream/50 hover:text-cream"
      )}
    >
      {children}
    </button>
  );
}

export function PortfolioContactForm() {
  const [pending, startTransition] = useTransition();
  const [budget, setBudget] = useState<string>(BUDGET_OPTIONS[0]);
  const [services, setServices] = useState<string[]>([SERVICE_OPTIONS[0]]);
  const [submitted, setSubmitted] = useState(false);

  const toggleService = (value: string) => {
    setServices((current) =>
      current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value]
    );
  };

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const phone = String(data.get("phone") ?? "").trim();
    const website = String(data.get("website") ?? "").trim();
    const specialRequests = String(data.get("message") ?? "").trim();

    const subject = services[0] || budget || "Project inquiry";
    const composed = [
      specialRequests,
      budget ? `Budget: ${budget}` : "",
      services.length ? `Services: ${services.join(", ")}` : "",
      phone ? `Phone: ${phone}` : "",
      website ? `Website: ${website}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    startTransition(async () => {
      const result = await submitContact({
        name,
        email,
        subject,
        message: composed.length >= 10 ? composed : `${composed}\nPortfolio contact form submission.`,
        phone,
        website,
        budget,
        services,
      });
      if (result.success) {
        toast.success(result.message);
        form.reset();
        setBudget(BUDGET_OPTIONS[0]);
        setServices([SERVICE_OPTIONS[0]]);
        setSubmitted(true);
      } else {
        toast.error(result.message);
      }
    });
  };

  return (
    <form onSubmit={onSubmit} className="flex w-full flex-col gap-8 sm:gap-10" noValidate>
      <div className="flex flex-col gap-6 sm:gap-8">
        <FloatingField id="portfolio-name" label="name">
          <input
            id="portfolio-name"
            name="name"
            autoComplete="name"
            required
            minLength={2}
            placeholder="Your Name"
            className="w-full bg-transparent px-4 pb-2.5 pt-8 font-body text-base leading-6 text-cream placeholder:text-cream/50 focus-visible:outline-none"
          />
        </FloatingField>

        <FloatingField id="portfolio-email" label="Email Address">
          <input
            id="portfolio-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="your@gmail.com"
            className="w-full bg-transparent px-4 pb-2.5 pt-8 font-body text-base leading-6 text-cream placeholder:text-cream/50 focus-visible:outline-none"
          />
        </FloatingField>

        <FloatingField id="portfolio-phone" label="Phone Number">
          <input
            id="portfolio-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder="Your number"
            className="w-full bg-transparent px-4 pb-2.5 pt-8 font-body text-base leading-6 text-cream placeholder:text-cream/50 focus-visible:outline-none"
          />
        </FloatingField>

        <FloatingField id="portfolio-website" label="Existing Website if any (optional)">
          <input
            id="portfolio-website"
            name="website"
            type="text"
            inputMode="url"
            autoComplete="url"
            placeholder="www."
            className="w-full bg-transparent px-4 pb-2.5 pt-8 font-body text-base leading-6 text-cream placeholder:text-cream/50 focus-visible:outline-none"
          />
        </FloatingField>

        <div className="relative w-full pb-2.5 pt-6">
          <p className="absolute -top-3 left-0 bg-black px-0">
            <span className="border border-cream px-1.5 py-1 font-body text-[12px] leading-[18px] tracking-[1.2px] text-cream">
              Budget
            </span>
          </p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2.5 sm:gap-x-8 lg:gap-x-[43px]">
            {BUDGET_OPTIONS.map((option) => (
              <Chip
                key={option}
                selected={budget === option}
                onClick={() => setBudget(option)}
              >
                {option}
              </Chip>
            ))}
          </div>
        </div>

        <div className="relative w-full pb-2.5 pt-8 sm:pt-6">
          <p className="absolute -top-3 left-0 max-w-full bg-black pr-2">
            <span className="inline-block max-w-full border border-cream px-1.5 py-1 font-body text-[10px] leading-[14px] tracking-[0.8px] text-cream sm:text-[12px] sm:leading-[18px] sm:tracking-[1.2px]">
              Type of Service you are interested in (choose all that apply)
            </span>
          </p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-3 sm:gap-x-8 sm:gap-y-4">
            {SERVICE_OPTIONS.map((option) => (
              <Chip
                key={option}
                selected={services.includes(option)}
                onClick={() => toggleService(option)}
                tracking
              >
                {option}
              </Chip>
            ))}
          </div>
        </div>

        <FloatingField id="portfolio-message" label="Special Requests" className="min-h-[100px]">
          <textarea
            id="portfolio-message"
            name="message"
            placeholder="Your message"
            rows={3}
            className="w-full resize-none bg-transparent px-4 py-6 font-body text-base leading-6 text-cream placeholder:text-cream/50 focus-visible:outline-none"
          />
        </FloatingField>
      </div>

      <LiquidCarveButton
        type="submit"
        disabled={pending}
        label={pending ? "Sending" : submitted ? "Sent" : "Submit"}
        fill="#f9f4eb"
        textColor="#1a1c1c"
        blobColor="#1a1c1c"
        blobSize={88}
        smoothness={42}
        rounded={100}
        transition={{
          type: "tween",
          ease: [0.22, 1, 0.36, 1],
          duration: 0.45,
        }}
        padding="0"
        className="mt-2 h-[100px] w-[100px] shrink-0 self-start rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream sm:mt-0 sm:h-[156px] sm:w-[156px] sm:text-xl"
        style={{ borderRadius: "9999px" }}
        font={{
          fontFamily: "var(--font-outfit), system-ui, sans-serif",
          fontWeight: 700,
          fontSize: 18,
          lineHeight: "1",
          letterSpacing: "2px",
          textTransform: "uppercase",
        }}
      />
    </form>
  );
}
