import { z } from "zod";

const serverSchema = z.object({
  MONGODB_URI: z.string().optional(),
  BETTER_AUTH_SECRET: z.string().optional(),
  BETTER_AUTH_URL: z.string().optional(),
  NEXT_PUBLIC_APP_URL: z.string().optional(),
  NODE_ENV: z.enum(["development", "test", "production"]).optional(),
});

export type ServerEnv = z.infer<typeof serverSchema>;

const defaults: Required<
  Pick<
    ServerEnv,
    "BETTER_AUTH_SECRET" | "BETTER_AUTH_URL" | "NEXT_PUBLIC_APP_URL" | "NODE_ENV"
  >
> & { MONGODB_URI: string } = {
  MONGODB_URI: "",
  BETTER_AUTH_SECRET: "build-time-secret-change-me-in-production-32",
  BETTER_AUTH_URL: "http://localhost:3000",
  NEXT_PUBLIC_APP_URL: "http://localhost:3000",
  NODE_ENV: "development",
};

function readServerEnv(): ServerEnv & typeof defaults {
  const parsed = serverSchema.safeParse({
    MONGODB_URI: process.env.MONGODB_URI,
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NODE_ENV: process.env.NODE_ENV,
  });

  const data = parsed.success ? parsed.data : {};

  return {
    MONGODB_URI: data.MONGODB_URI ?? defaults.MONGODB_URI,
    BETTER_AUTH_SECRET: data.BETTER_AUTH_SECRET || defaults.BETTER_AUTH_SECRET,
    BETTER_AUTH_URL: data.BETTER_AUTH_URL || defaults.BETTER_AUTH_URL,
    NEXT_PUBLIC_APP_URL:
      data.NEXT_PUBLIC_APP_URL || defaults.NEXT_PUBLIC_APP_URL,
    NODE_ENV: data.NODE_ENV ?? defaults.NODE_ENV,
  };
}

/** Server-safe env. Never throws on the client; returns defaults when process is unavailable. */
export function getServerEnv() {
  if (typeof window !== "undefined") {
    return {
      ...defaults,
      NEXT_PUBLIC_APP_URL:
        process.env.NEXT_PUBLIC_APP_URL || defaults.NEXT_PUBLIC_APP_URL,
    };
  }
  return readServerEnv();
}

export function getPublicAppUrl() {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.BETTER_AUTH_URL ||
    "https://ratul-saha-roy.pro.bd"
  );
}

export function hasMongoUri() {
  if (typeof window !== "undefined") return false;
  return Boolean(process.env.MONGODB_URI?.trim());
}
