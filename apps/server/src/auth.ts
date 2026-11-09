import { betterAuth } from "better-auth";
import { getMigrations } from "better-auth/db/migration";
import type { Db } from "./db.ts";

export interface AuthOptions {
  db: Db;
  secret: string;
  baseUrl: string;
  trustedOrigins: string[];
}

/** Accounts are stored in our own Postgres via Better Auth (ADR 0002). */
export function createAuth({ db, secret, baseUrl, trustedOrigins }: AuthOptions) {
  return betterAuth({
    database: db,
    secret,
    baseURL: baseUrl,
    basePath: "/api/auth",
    trustedOrigins,
    emailAndPassword: { enabled: true, autoSignIn: true },
  });
}

export type Auth = ReturnType<typeof createAuth>;

export async function migrateAuth(auth: Auth): Promise<void> {
  const { runMigrations } = await getMigrations(auth.options);
  await runMigrations();
}
