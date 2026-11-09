// Runs a local Postgres for development without Docker. Data persists in .data/dev-pg.
import EmbeddedPostgres from "embedded-postgres";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { DEV_DATABASE_URL, DEV_DB_PORT } from "./dev-db-config.ts";

const databaseDir = resolve(import.meta.dirname, "../../../.data/dev-pg");
const fresh = !existsSync(databaseDir);
const pg = new EmbeddedPostgres({
  databaseDir,
  user: "postgres",
  password: "postgres",
  port: DEV_DB_PORT,
  persistent: true,
});

if (fresh) await pg.initialise();
await pg.start();
if (fresh) await pg.createDatabase("agm");
console.log(`Dev Postgres running at ${DEV_DATABASE_URL} (Ctrl+C to stop)`);

process.on("SIGINT", async () => {
  await pg.stop();
  process.exit(0);
});
