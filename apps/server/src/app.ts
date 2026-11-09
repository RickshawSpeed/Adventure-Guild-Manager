import Fastify, { type FastifyInstance, type FastifyRequest } from "fastify";
import websocket from "@fastify/websocket";
import { fromNodeHeaders } from "better-auth/node";
import { RULES_VERSION, normaliseGuildName, type RandomSource } from "@agm/rules";
import {
  CLIENT_VERSION_HEADER,
  CLIENT_VERSION_QUERY,
  CreateGuildRequest,
  UPDATE_REQUIRED,
  UPDATE_REQUIRED_CLOSE_CODE,
  UPDATE_REQUIRED_STATUS,
  isVersionAtLeast,
  type ServerMessage,
} from "@agm/protocol";
import { createAuth, migrateAuth, type Auth } from "./auth.ts";
import type { Clock } from "./clock.ts";
import { createDb, migrate, type Db } from "./db.ts";
import { GuildAlreadyExists, createGuild, getGuildForAccount } from "./guilds.ts";
import type { TickDriver } from "./ticks.ts";

export interface ServerOptions {
  databaseUrl: string;
  /** Port to listen on; 0 picks a free one. */
  port: number;
  host?: string;
  /** Public origin of this server. Defaults to the address it listens on. */
  baseUrl?: string;
  /** Browser origins allowed to call the API with credentials (e.g. the client dev server). */
  trustedOrigins?: string[];
  authSecret: string;
  minClientVersion: string;
  random: RandomSource;
  clock: Clock;
  ticks: TickDriver;
}

export interface RunningServer {
  url: string;
  app: FastifyInstance;
  db: Db;
  close(): Promise<void>;
}

export const WS_PATH = "/ws";

export async function startServer(options: ServerOptions): Promise<RunningServer> {
  const host = options.host ?? "127.0.0.1";
  const app = Fastify({ logger: false });
  const db = createDb(options.databaseUrl);

  // With port 0 the real address is only known after listen, and auth needs
  // it as its base URL, so routes reach auth through this late binding.
  let auth: Auth | undefined;
  const getAuth = (): Auth => {
    if (!auth) throw new Error("auth not ready");
    return auth;
  };

  // Better Auth owns the "user" table that guild references, so it migrates first.
  await migrateAuth(
    createAuth({ db, secret: options.authSecret, baseUrl: options.baseUrl ?? "http://localhost", trustedOrigins: [] }),
  );
  await migrate(db);

  await app.register(websocket);

  // ADR 0003: refuse clients below the minimum version on every HTTP request.
  app.addHook("onRequest", async (req, reply) => {
    if (req.url.split("?")[0] === WS_PATH) return; // checked inside the socket handler
    const header = req.headers[CLIENT_VERSION_HEADER];
    const version = Array.isArray(header) ? header[0] : header;
    if (!isVersionAtLeast(version, options.minClientVersion)) {
      return reply
        .code(UPDATE_REQUIRED_STATUS)
        .send({ error: UPDATE_REQUIRED, minClientVersion: options.minClientVersion });
    }
  });

  app.route({
    method: ["GET", "POST"],
    url: "/api/auth/*",
    async handler(req, reply) {
      const url = new URL(req.url, getAuth().options.baseURL);
      const request = new Request(url, {
        method: req.method,
        headers: fromNodeHeaders(req.headers),
        body: req.method === "GET" || req.body == null ? undefined : JSON.stringify(req.body),
      });
      const response = await getAuth().handler(request);
      reply.status(response.status);
      response.headers.forEach((value, key) => {
        if (key !== "set-cookie") reply.header(key, value);
      });
      const cookies = response.headers.getSetCookie();
      if (cookies.length > 0) reply.header("set-cookie", cookies);
      return reply.send(response.body ? await response.text() : null);
    },
  });

  async function accountIdOf(req: FastifyRequest): Promise<string | null> {
    const session = await getAuth().api.getSession({ headers: fromNodeHeaders(req.headers) });
    return session?.user.id ?? null;
  }

  app.get("/api/guild", async (req, reply) => {
    const accountId = await accountIdOf(req);
    if (!accountId) return reply.code(401).send({ error: "unauthenticated" });
    const guild = await getGuildForAccount(db, accountId);
    if (!guild) return reply.code(404).send({ error: "no_guild" });
    return guild;
  });

  app.post("/api/guild", async (req, reply) => {
    const accountId = await accountIdOf(req);
    if (!accountId) return reply.code(401).send({ error: "unauthenticated" });
    const parsed = CreateGuildRequest.safeParse(req.body);
    const name = parsed.success ? normaliseGuildName(parsed.data.name) : null;
    if (!name) return reply.code(400).send({ error: "invalid_guild_name" });
    try {
      return reply.code(201).send(await createGuild(db, options.clock, accountId, name));
    } catch (err) {
      if (err instanceof GuildAlreadyExists) return reply.code(409).send({ error: "guild_exists" });
      throw err;
    }
  });

  app.get(WS_PATH, { websocket: true }, (socket, req) => {
    const send = (msg: ServerMessage) => socket.send(JSON.stringify(msg));
    const version = (req.query as Record<string, string | undefined>)[CLIENT_VERSION_QUERY];
    if (!isVersionAtLeast(version, options.minClientVersion)) {
      send({ type: "error", code: UPDATE_REQUIRED, minClientVersion: options.minClientVersion });
      socket.close(UPDATE_REQUIRED_CLOSE_CODE, UPDATE_REQUIRED);
      return;
    }
    send({ type: "welcome", rulesVersion: RULES_VERSION });
  });

  const address = await app.listen({ port: options.port, host });
  const baseUrl = options.baseUrl ?? address;
  auth = createAuth({
    db,
    secret: options.authSecret,
    baseUrl,
    trustedOrigins: [baseUrl, ...(options.trustedOrigins ?? [])],
  });

  options.ticks.start(() => {
    // Zones arrive with the first Expedition ticket; nothing ticks yet.
  });

  return {
    url: address,
    app,
    db,
    async close() {
      options.ticks.stop();
      await app.close();
      await db.end();
    },
  };
}
