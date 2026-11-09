import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { UPDATE_REQUIRED, UPDATE_REQUIRED_CLOSE_CODE, UPDATE_REQUIRED_STATUS } from "@agm/protocol";
import { startTestServer, type TestServer } from "./harness.ts";

const MIN = "1.2.0";

let t: TestServer;
beforeAll(async () => {
  t = await startTestServer({ minClientVersion: MIN });
});
afterAll(async () => {
  await t?.close();
});

describe("minimum client version (ADR 0003)", () => {
  it.each([
    ["an older client", "1.1.9"],
    ["a client sending no version", null],
    ["a client sending a malformed version", "latest"],
  ])("rejects %s over HTTP with update_required", async (_, version) => {
    const client = t.client({ clientVersion: version });
    for (const res of [
      await client.get("/api/guild"),
      await client.post("/api/auth/sign-up/email", { email: "a@example.test", password: "correct-horse-battery", name: "a" }),
    ]) {
      expect(res.status).toBe(UPDATE_REQUIRED_STATUS);
      expect(res.body).toEqual({ error: UPDATE_REQUIRED, minClientVersion: MIN });
    }
  });

  it("accepts a client at or above the minimum", async () => {
    for (const version of ["1.2.0", "1.3.0"]) {
      const res = await t.client({ clientVersion: version }).get("/api/guild");
      expect(res.status).toBe(401); // got past the version check to auth
    }
  });

  it("rejects an older client over WebSocket with update_required", async () => {
    const socket = await t.socket({ clientVersion: "1.1.9" });
    await socket.until((s) => s.closeCode !== undefined);
    expect(socket.messages).toEqual([{ type: "error", code: UPDATE_REQUIRED, minClientVersion: MIN }]);
    expect(socket.closeCode).toBe(UPDATE_REQUIRED_CLOSE_CODE);
  });

  it("welcomes a current client over WebSocket", async () => {
    const socket = await t.socket({ clientVersion: "1.2.0" });
    await socket.until((s) => s.messages.length > 0);
    expect(socket.messages[0]).toMatchObject({ type: "welcome" });
    socket.close();
  });
});
