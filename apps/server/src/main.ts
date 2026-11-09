import { startServer } from "./app.ts";
import { systemClock } from "./clock.ts";
import { DEV_DATABASE_URL } from "./dev-db-config.ts";
import { intervalTickDriver } from "./ticks.ts";

const env = process.env;
const isProduction = env.NODE_ENV === "production";
const authSecret = env.AUTH_SECRET ?? (isProduction ? undefined : "dev-only-secret-not-for-production-use");
if (!authSecret) throw new Error("AUTH_SECRET must be set in production");

const server = await startServer({
  databaseUrl: env.DATABASE_URL ?? DEV_DATABASE_URL,
  port: Number(env.PORT ?? 3000),
  host: env.HOST ?? "127.0.0.1",
  baseUrl: env.BASE_URL,
  trustedOrigins: (env.TRUSTED_ORIGINS ?? "http://localhost:5173").split(",").filter(Boolean),
  authSecret,
  minClientVersion: env.MIN_CLIENT_VERSION ?? "0.1.0",
  // Live-game randomness is deliberately unseeded (ADR 0005).
  random: { next: () => Math.random() },
  clock: systemClock,
  ticks: intervalTickDriver(),
});

console.log(`Adventure Guild Manager server listening on ${server.url}`);

for (const signal of ["SIGINT", "SIGTERM"] as const) {
  process.on(signal, async () => {
    await server.close();
    process.exit(0);
  });
}
