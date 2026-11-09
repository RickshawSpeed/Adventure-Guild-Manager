// Starts one real Postgres (embedded, no Docker) for the whole server test run.
// Each test server gets its own fresh database inside it.
import EmbeddedPostgres from "embedded-postgres";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import type { TestProject } from "vitest/node";

declare module "vitest" {
  export interface ProvidedContext {
    pgAdminUrl: string;
  }
}

export default async function setup(project: TestProject) {
  const databaseDir = mkdtempSync(join(tmpdir(), "agm-test-pg-"));
  const port = 55000 + Math.floor(Math.random() * 5000);
  const pg = new EmbeddedPostgres({
    databaseDir,
    user: "postgres",
    password: "postgres",
    port,
    persistent: false,
    onLog: () => {},
  });
  await pg.initialise();
  await pg.start();
  project.provide("pgAdminUrl", `postgres://postgres:postgres@127.0.0.1:${port}/postgres`);

  return async () => {
    await pg.stop();
    rmSync(databaseDir, { recursive: true, force: true });
  };
}
