/**
 * Version of this client/server protocol build. Clients send it on every
 * HTTP request (header) and WebSocket handshake (query parameter); the
 * server refuses clients below its configured minimum (ADR 0003).
 */
export const PROTOCOL_VERSION = "0.1.0";

export const CLIENT_VERSION_HEADER = "x-client-version";
export const CLIENT_VERSION_QUERY = "clientVersion";

function parse(version: string): [number, number, number] | null {
  const m = /^(\d+)\.(\d+)\.(\d+)$/.exec(version.trim());
  if (!m) return null;
  return [Number(m[1]), Number(m[2]), Number(m[3])];
}

/** True when `version` is a valid x.y.z version at or above `minimum`. */
export function isVersionAtLeast(version: string | undefined | null, minimum: string): boolean {
  if (!version) return false;
  const v = parse(version);
  const min = parse(minimum);
  if (!v || !min) return false;
  for (let i = 0; i < 3; i++) {
    if (v[i]! !== min[i]!) return v[i]! > min[i]!;
  }
  return true;
}
