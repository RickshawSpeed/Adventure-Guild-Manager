// Seam 1 test harness: the real server, a real Postgres, driven only through
// HTTP and WebSocket. Only the random source, the tick driver and the
// wall clock are replaced.
import { randomUUID } from "node:crypto";
import pg from "pg";
import { inject } from "vitest";
import { scriptedRandom, type RandomSource } from "@agm/rules";
import { CLIENT_VERSION_HEADER, CLIENT_VERSION_QUERY, PROTOCOL_VERSION } from "@agm/protocol";
import { startServer, WS_PATH, type RunningServer } from "../src/app.ts";
import type { Clock } from "../src/clock.ts";
import type { TickDriver, TickHandler } from "../src/ticks.ts";

export interface ManualClock extends Clock {
  set(date: Date): void;
  advanceMs(ms: number): void;
}

export function manualClock(start = new Date("2026-01-01T00:00:00Z")): ManualClock {
  let current = start.getTime();
  return {
    now: () => new Date(current),
    set: (date) => {
      current = date.getTime();
    },
    advanceMs: (ms) => {
      current += ms;
    },
  };
}

export interface ManualTickDriver extends TickDriver {
  /** Runs N ticks, one after another. */
  advance(ticks?: number): Promise<void>;
}

export function manualTickDriver(): ManualTickDriver {
  let handler: TickHandler | undefined;
  return {
    start(onTick) {
      handler = onTick;
    },
    stop() {
      handler = undefined;
    },
    async advance(ticks = 1) {
      if (!handler) throw new Error("tick driver is not running");
      for (let i = 0; i < ticks; i++) await handler();
    },
  };
}

export interface TestServerOptions {
  minClientVersion?: string;
  random?: RandomSource;
}

export interface TestServer {
  url: string;
  server: RunningServer;
  clock: ManualClock;
  ticks: ManualTickDriver;
  random: RandomSource;
  /** A fresh client with its own cookie jar, like a separate browser. */
  client(options?: { clientVersion?: string | null }): TestClient;
  /** Opens a WebSocket and collects its messages. */
  socket(options?: { clientVersion?: string | null }): Promise<TestSocket>;
  close(): Promise<void>;
}

export async function startTestServer(options: TestServerOptions = {}): Promise<TestServer> {
  const adminUrl = inject("pgAdminUrl");
  const dbName = `t_${randomUUID().replace(/-/g, "")}`;
  const admin = new pg.Client({ connectionString: adminUrl });
  await admin.connect();
  await admin.query(`CREATE DATABASE ${dbName}`);
  await admin.end();

  const clock = manualClock();
  const ticks = manualTickDriver();
  const random = options.random ?? scriptedRandom([0.5]);
  const databaseUrl = new URL(adminUrl);
  databaseUrl.pathname = `/${dbName}`;

  const server = await startServer({
    databaseUrl: databaseUrl.toString(),
    port: 0,
    authSecret: "test-secret-test-secret-test-secret",
    minClientVersion: options.minClientVersion ?? PROTOCOL_VERSION,
    random,
    clock,
    ticks,
  });

  return {
    url: server.url,
    server,
    clock,
    ticks,
    random,
    client: (o) => new TestClient(server.url, o?.clientVersion === undefined ? PROTOCOL_VERSION : o.clientVersion),
    socket: (o) =>
      TestSocket.open(server.url, o?.clientVersion === undefined ? PROTOCOL_VERSION : o.clientVersion),
    async close() {
      await server.close();
      const a = new pg.Client({ connectionString: adminUrl });
      await a.connect();
      await a.query(`DROP DATABASE IF EXISTS ${dbName} WITH (FORCE)`);
      await a.end();
    },
  };
}

export interface ApiResponse<T = unknown> {
  status: number;
  body: T;
}

/** Talks to the server over HTTP the way a browser client would. */
export class TestClient {
  private cookies = new Map<string, string>();

  constructor(
    private readonly baseUrl: string,
    private readonly clientVersion: string | null,
  ) {}

  async request<T = any>(method: string, path: string, body?: unknown): Promise<ApiResponse<T>> {
    const headers: Record<string, string> = { origin: this.baseUrl };
    if (this.clientVersion !== null) headers[CLIENT_VERSION_HEADER] = this.clientVersion;
    if (body !== undefined) headers["content-type"] = "application/json";
    if (this.cookies.size > 0) {
      headers.cookie = [...this.cookies].map(([k, v]) => `${k}=${v}`).join("; ");
    }
    const res = await fetch(new URL(path, this.baseUrl), {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    for (const c of res.headers.getSetCookie()) {
      const [pair] = c.split(";");
      const eq = pair!.indexOf("=");
      const name = pair!.slice(0, eq);
      const value = pair!.slice(eq + 1);
      if (value === "" || /max-age=0/i.test(c)) this.cookies.delete(name);
      else this.cookies.set(name, value);
    }
    const text = await res.text();
    return { status: res.status, body: text ? JSON.parse(text) : null };
  }

  get = <T = any>(path: string) => this.request<T>("GET", path);
  post = <T = any>(path: string, body?: unknown) => this.request<T>("POST", path, body ?? {});

  async signUp(email = `${randomUUID()}@example.test`, password = "correct-horse-battery") {
    const res = await this.post("/api/auth/sign-up/email", { email, password, name: email.split("@")[0] });
    if (res.status !== 200) throw new Error(`sign-up failed: ${res.status} ${JSON.stringify(res.body)}`);
    return { email, password };
  }

  signIn(email: string, password: string) {
    return this.post("/api/auth/sign-in/email", { email, password });
  }

  signOut() {
    return this.post("/api/auth/sign-out");
  }
}

export class TestSocket {
  readonly messages: unknown[] = [];
  closeCode: number | undefined;
  private waiters: (() => void)[] = [];

  private constructor(private readonly ws: WebSocket) {
    ws.addEventListener("message", (e) => {
      this.messages.push(JSON.parse(String(e.data)));
      this.notify();
    });
    ws.addEventListener("close", (e) => {
      this.closeCode = e.code;
      this.notify();
    });
  }

  static open(baseUrl: string, clientVersion: string | null): Promise<TestSocket> {
    const url = new URL(WS_PATH, baseUrl.replace(/^http/, "ws"));
    if (clientVersion !== null) url.searchParams.set(CLIENT_VERSION_QUERY, clientVersion);
    const ws = new WebSocket(url);
    const socket = new TestSocket(ws);
    return new Promise((resolve, reject) => {
      ws.addEventListener("open", () => resolve(socket), { once: true });
      ws.addEventListener("error", () => reject(new Error("WebSocket failed to open")), { once: true });
    });
  }

  private notify() {
    const w = this.waiters;
    this.waiters = [];
    w.forEach((f) => f());
  }

  /** Waits until the predicate holds, or fails after a timeout. */
  async until(predicate: (s: TestSocket) => boolean, timeoutMs = 5_000): Promise<void> {
    const deadline = Date.now() + timeoutMs;
    while (!predicate(this)) {
      const remaining = deadline - Date.now();
      if (remaining <= 0) throw new Error("timed out waiting on socket");
      await new Promise<void>((resolve) => {
        const t = setTimeout(resolve, remaining);
        this.waiters.push(() => {
          clearTimeout(t);
          resolve();
        });
      });
    }
  }

  close() {
    this.ws.close();
  }
}
