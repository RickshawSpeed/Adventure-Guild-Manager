import pg from "pg";

export type Db = pg.Pool;

export function createDb(databaseUrl: string): Db {
  return new pg.Pool({ connectionString: databaseUrl });
}

/**
 * Our own schema, applied in order. Better Auth owns its tables separately.
 * Never edit an applied migration; append a new one.
 */
const MIGRATIONS: readonly { id: string; sql: string }[] = [
  {
    id: "0001_guilds",
    sql: `
      CREATE TABLE guild (
        id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        account_id  text NOT NULL UNIQUE REFERENCES "user"(id) ON DELETE CASCADE,
        name        text NOT NULL,
        gold        integer NOT NULL CHECK (gold >= 0),
        created_at  timestamptz NOT NULL
      );
      CREATE TABLE facility (
        guild_id  uuid NOT NULL REFERENCES guild(id) ON DELETE CASCADE,
        kind      text NOT NULL,
        level     integer NOT NULL CHECK (level >= 1),
        PRIMARY KEY (guild_id, kind)
      );
    `,
  },
];

export async function migrate(db: Db): Promise<void> {
  const client = await db.connect();
  try {
    await client.query("SELECT pg_advisory_lock(727001)");
    await client.query(
      "CREATE TABLE IF NOT EXISTS schema_migration (id text PRIMARY KEY, applied_at timestamptz NOT NULL DEFAULT now())",
    );
    const { rows } = await client.query<{ id: string }>("SELECT id FROM schema_migration");
    const applied = new Set(rows.map((r) => r.id));
    for (const m of MIGRATIONS) {
      if (applied.has(m.id)) continue;
      await client.query("BEGIN");
      try {
        await client.query(m.sql);
        await client.query("INSERT INTO schema_migration (id) VALUES ($1)", [m.id]);
        await client.query("COMMIT");
      } catch (err) {
        await client.query("ROLLBACK");
        throw err;
      }
    }
  } finally {
    await client.query("SELECT pg_advisory_unlock(727001)").catch(() => {});
    client.release();
  }
}
