import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { memoryAdapter } from "better-auth/adapters/memory";
import { nextCookies } from "better-auth/next-js";
import { MongoClient } from "mongodb";
import { getServerEnv, hasMongoUri } from "@/lib/env";

declare global {
  var authMongoClient: MongoClient | undefined;
}

function createAuth() {
  const env = getServerEnv();

  const shared = {
    appName: "Ratul Saha Roy Portfolio",
    baseURL: env.BETTER_AUTH_URL,
    secret: env.BETTER_AUTH_SECRET,
    emailAndPassword: {
      enabled: true as const,
      minPasswordLength: 8,
    },
    session: {
      expiresIn: 60 * 60 * 24 * 7,
      updateAge: 60 * 60 * 24,
      cookieCache: {
        enabled: true,
        maxAge: 60 * 5,
      },
    },
    plugins: [nextCookies()],
  };

  if (hasMongoUri() && env.MONGODB_URI) {
    const client =
      global.authMongoClient ?? new MongoClient(env.MONGODB_URI);
    global.authMongoClient = client;
    const db = client.db();

    return betterAuth({
      ...shared,
      database: mongodbAdapter(db, {
        client,
        transaction: false,
      }),
    });
  }

  return betterAuth({
    ...shared,
    database: memoryAdapter({}),
  });
}

export const auth = createAuth();

export type Session = typeof auth.$Infer.Session;
