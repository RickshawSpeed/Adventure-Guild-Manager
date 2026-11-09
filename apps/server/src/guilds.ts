import {
  FACILITY_KINDS,
  STARTING_FACILITY_LEVEL,
  STARTING_GOLD,
  housingCapacity,
  storehouseCapacity,
  type FacilityKind,
} from "@agm/rules";
import type { GuildView } from "@agm/protocol";
import type { Clock } from "./clock.ts";
import type { Db } from "./db.ts";

export class GuildAlreadyExists extends Error {}

/** Creates a Guild for an Account, with every Facility at Level 1. */
export async function createGuild(
  db: Db,
  clock: Clock,
  accountId: string,
  name: string,
): Promise<GuildView> {
  const client = await db.connect();
  try {
    await client.query("BEGIN");
    const inserted = await client.query<{ id: string }>(
      `INSERT INTO guild (account_id, name, gold, created_at) VALUES ($1, $2, $3, $4)
       ON CONFLICT (account_id) DO NOTHING RETURNING id`,
      [accountId, name, STARTING_GOLD, clock.now()],
    );
    const guildId = inserted.rows[0]?.id;
    if (!guildId) {
      await client.query("ROLLBACK");
      throw new GuildAlreadyExists();
    }
    for (const kind of FACILITY_KINDS) {
      await client.query("INSERT INTO facility (guild_id, kind, level) VALUES ($1, $2, $3)", [
        guildId,
        kind,
        STARTING_FACILITY_LEVEL,
      ]);
    }
    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK").catch(() => {});
    throw err;
  } finally {
    client.release();
  }
  const view = await getGuildForAccount(db, accountId);
  if (!view) throw new Error("Guild vanished after creation");
  return view;
}

export async function getGuildForAccount(db: Db, accountId: string): Promise<GuildView | null> {
  const guild = await db.query<{ id: string; name: string; gold: number }>(
    "SELECT id, name, gold FROM guild WHERE account_id = $1",
    [accountId],
  );
  const g = guild.rows[0];
  if (!g) return null;
  const facilities = await db.query<{ kind: FacilityKind; level: number }>(
    "SELECT kind, level FROM facility WHERE guild_id = $1",
    [g.id],
  );
  const levelOf = new Map(facilities.rows.map((f) => [f.kind, f.level]));
  return {
    id: g.id,
    name: g.name,
    gold: g.gold,
    headquarters: {
      facilities: FACILITY_KINDS.filter((k) => levelOf.has(k)).map((kind) => ({
        kind,
        level: levelOf.get(kind)!,
      })),
    },
    roster: { capacity: housingCapacity(levelOf.get("housing") ?? 1), adventurers: [] },
    storehouse: { capacity: storehouseCapacity(levelOf.get("storehouse") ?? 1), items: [] },
  };
}
