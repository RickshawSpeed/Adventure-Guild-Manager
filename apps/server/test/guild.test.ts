import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { FACILITY_KINDS, STARTING_GOLD } from "@agm/rules";
import { GuildView } from "@agm/protocol";
import { startTestServer, type TestServer } from "./harness.ts";

let t: TestServer;
beforeAll(async () => {
  t = await startTestServer();
});
afterAll(async () => {
  await t?.close();
});

describe("signing up and creating a Guild", () => {
  it("lets a new Player create a Guild and see its Headquarters", async () => {
    const player = t.client();
    await player.signUp();

    const before = await player.get("/api/guild");
    expect(before.status).toBe(404);
    expect(before.body).toEqual({ error: "no_guild" });

    const created = await player.post("/api/guild", { name: "  The Iron   Lanterns " });
    expect(created.status).toBe(201);

    const res = await player.get("/api/guild");
    expect(res.status).toBe(200);
    const guild = GuildView.parse(res.body);
    expect(guild.name).toBe("The Iron Lanterns");
    expect(guild.gold).toBe(STARTING_GOLD);
    expect(guild.headquarters.facilities.map((f) => f.kind).sort()).toEqual([...FACILITY_KINDS].sort());
    expect(guild.headquarters.facilities.every((f) => f.level === 1)).toBe(true);
    expect(guild.storehouse.items).toEqual([]);
    expect(guild.storehouse.capacity).toBeGreaterThan(0);
    expect(guild.roster.adventurers).toEqual([]);
  });

  it("allows only one Guild per Account", async () => {
    const player = t.client();
    await player.signUp();
    expect((await player.post("/api/guild", { name: "First Guild" })).status).toBe(201);
    const second = await player.post("/api/guild", { name: "Second Guild" });
    expect(second.status).toBe(409);
    expect((await player.get("/api/guild")).body.name).toBe("First Guild");
  });

  it("rejects unacceptable Guild names", async () => {
    const player = t.client();
    await player.signUp();
    for (const name of ["", "ab", "x".repeat(41)]) {
      expect((await player.post("/api/guild", { name })).status).toBe(400);
    }
    expect((await player.post("/api/guild", {})).status).toBe(400);
  });

  it("keeps each Guild private to its own Account", async () => {
    const alice = t.client();
    await alice.signUp();
    await alice.post("/api/guild", { name: "Alice Company" });

    const bob = t.client();
    await bob.signUp();
    expect((await bob.get("/api/guild")).status).toBe(404);
  });

  it("requires a signed-in Player", async () => {
    const anonymous = t.client();
    expect((await anonymous.get("/api/guild")).status).toBe(401);
    expect((await anonymous.post("/api/guild", { name: "Nobody's Guild" })).status).toBe(401);
  });

  it("lets a Player sign out and back in to the same Guild", async () => {
    const player = t.client();
    const { email, password } = await player.signUp();
    await player.post("/api/guild", { name: "Returning Guild" });

    expect((await player.signOut()).status).toBe(200);
    expect((await player.get("/api/guild")).status).toBe(401);

    expect((await player.signIn(email, password)).status).toBe(200);
    expect((await player.get("/api/guild")).body.name).toBe("Returning Guild");
  });
});

describe("test harness", () => {
  it("lets tests control the clock and advance ticks by hand", async () => {
    const before = t.clock.now().getTime();
    t.clock.advanceMs(60_000);
    expect(t.clock.now().getTime() - before).toBe(60_000);
    await expect(t.ticks.advance(3)).resolves.toBeUndefined();
    expect(t.random.next()).toBe(0.5);
  });
});
