import {
  CLIENT_VERSION_HEADER,
  CLIENT_VERSION_QUERY,
  GuildView,
  PROTOCOL_VERSION,
  ServerMessage,
  UPDATE_REQUIRED,
  UPDATE_REQUIRED_STATUS,
} from "@agm/protocol";

/** Raised whenever the server says this client is too old (ADR 0003). */
export class UpdateRequired extends Error {
  constructor(readonly minClientVersion: string) {
    super("update required");
  }
}

export class ApiFailure extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
  ) {
    super(code);
  }
}

async function call<T>(method: string, path: string, body?: unknown): Promise<T> {
  const res = await fetch(path, {
    method,
    credentials: "include",
    headers: {
      [CLIENT_VERSION_HEADER]: PROTOCOL_VERSION,
      ...(body !== undefined ? { "content-type": "application/json" } : {}),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;
  if (res.status === UPDATE_REQUIRED_STATUS && data?.error === UPDATE_REQUIRED) {
    throw new UpdateRequired(data.minClientVersion);
  }
  if (!res.ok) throw new ApiFailure(res.status, data?.error ?? data?.code ?? data?.message ?? "request_failed");
  return data as T;
}

export interface Session {
  user: { id: string; email: string; name: string };
}

export const api = {
  getSession: () => call<Session | null>("GET", "/api/auth/get-session"),
  signUp: (email: string, password: string) =>
    call("POST", "/api/auth/sign-up/email", { email, password, name: email.split("@")[0] }),
  signIn: (email: string, password: string) => call("POST", "/api/auth/sign-in/email", { email, password }),
  signOut: () => call("POST", "/api/auth/sign-out", {}),
  async getGuild(): Promise<GuildView | null> {
    try {
      return GuildView.parse(await call("GET", "/api/guild"));
    } catch (err) {
      if (err instanceof ApiFailure && err.code === "no_guild") return null;
      throw err;
    }
  },
  createGuild: async (name: string) => GuildView.parse(await call("POST", "/api/guild", { name })),
};

/** Opens the game socket. Calls onUpdateRequired if the server refuses this version. */
export function connectSocket(onUpdateRequired: (min: string) => void): () => void {
  const url = new URL("/ws", window.location.href);
  url.protocol = url.protocol === "https:" ? "wss:" : "ws:";
  url.searchParams.set(CLIENT_VERSION_QUERY, PROTOCOL_VERSION);
  const ws = new WebSocket(url);
  ws.addEventListener("message", (e) => {
    const parsed = ServerMessage.safeParse(JSON.parse(String(e.data)));
    if (parsed.success && parsed.data.type === "error" && parsed.data.code === UPDATE_REQUIRED) {
      onUpdateRequired(parsed.data.minClientVersion);
    }
  });
  return () => ws.close();
}
