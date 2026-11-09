import { useCallback, useEffect, useState, type FormEvent } from "react";
import type { GuildView } from "@agm/protocol";
import { PROTOCOL_VERSION } from "@agm/protocol";
import { GUILD_NAME_MAX_LENGTH, GUILD_NAME_MIN_LENGTH, type FacilityKind } from "@agm/rules";
import { ApiFailure, UpdateRequired, api, connectSocket, type Session } from "./api.ts";

type State =
  | { kind: "loading" }
  | { kind: "signed-out" }
  | { kind: "no-guild"; session: Session }
  | { kind: "guild"; session: Session; guild: GuildView }
  | { kind: "update-required"; minClientVersion: string };

export function App() {
  const [state, setState] = useState<State>({ kind: "loading" });

  const handle = useCallback((err: unknown) => {
    if (err instanceof UpdateRequired) setState({ kind: "update-required", minClientVersion: err.minClientVersion });
    else throw err;
  }, []);

  const refresh = useCallback(async () => {
    try {
      const session = await api.getSession();
      if (!session) return setState({ kind: "signed-out" });
      const guild = await api.getGuild();
      setState(guild ? { kind: "guild", session, guild } : { kind: "no-guild", session });
    } catch (err) {
      handle(err);
    }
  }, [handle]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const signedIn = state.kind === "guild" || state.kind === "no-guild";
  useEffect(() => {
    if (!signedIn) return;
    return connectSocket((min) => setState({ kind: "update-required", minClientVersion: min }));
  }, [signedIn]);

  const signOut = async () => {
    try {
      await api.signOut();
      setState({ kind: "signed-out" });
    } catch (err) {
      handle(err);
    }
  };

  return (
    <div className="shell">
      <header className="topbar">
        <span className="brand">
          <img src="/icon.svg" alt="" width={28} height={28} /> Adventure Guild Manager
        </span>
        {signedIn && (
          <span className="account">
            <span className="muted">{state.session.user.email}</span>
            <button className="link" onClick={signOut}>
              Sign out
            </button>
          </span>
        )}
      </header>
      <main>
        {state.kind === "loading" && <p className="muted">Loading…</p>}
        {state.kind === "update-required" && <UpdateRequiredScreen min={state.minClientVersion} />}
        {state.kind === "signed-out" && <AuthScreen onDone={refresh} onError={handle} />}
        {state.kind === "no-guild" && <CreateGuildScreen onDone={refresh} onError={handle} />}
        {state.kind === "guild" && <GuildOverview guild={state.guild} />}
      </main>
    </div>
  );
}

function UpdateRequiredScreen({ min }: { min: string }) {
  return (
    <section className="card narrow center">
      <h1>Update required</h1>
      <p>
        This version of the game ({PROTOCOL_VERSION}) is no longer supported. Please update to version {min} or
        later to keep playing.
      </p>
      <button onClick={() => window.location.reload()}>Reload</button>
    </section>
  );
}

function errorText(err: unknown): string {
  if (err instanceof ApiFailure) {
    switch (err.code) {
      case "invalid_guild_name":
        return `Guild names must be ${GUILD_NAME_MIN_LENGTH}–${GUILD_NAME_MAX_LENGTH} characters.`;
      case "guild_exists":
        return "You already lead a Guild.";
      default:
        return err.status === 401 ? "Email or password is incorrect." : err.code.replaceAll("_", " ");
    }
  }
  return "Something went wrong. Please try again.";
}

function AuthScreen({ onDone, onError }: { onDone: () => void; onError: (e: unknown) => void }) {
  const [mode, setMode] = useState<"sign-in" | "sign-up">("sign-up");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await (mode === "sign-up" ? api.signUp(email, password) : api.signIn(email, password));
      onDone();
    } catch (err) {
      if (err instanceof UpdateRequired) onError(err);
      else setError(errorText(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="card narrow">
      <h1>{mode === "sign-up" ? "Found your Guild" : "Welcome back"}</h1>
      <p className="muted">
        {mode === "sign-up"
          ? "Create an Account to start recruiting Adventurers."
          : "Sign in to return to your Guild."}
      </p>
      <form onSubmit={submit} className="stack">
        <label>
          Email
          <input type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label>
          Password
          <input
            type="password"
            required
            minLength={8}
            autoComplete={mode === "sign-up" ? "new-password" : "current-password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        {error && <p className="error">{error}</p>}
        <button type="submit" disabled={busy}>
          {mode === "sign-up" ? "Create Account" : "Sign in"}
        </button>
      </form>
      <button className="link" onClick={() => setMode(mode === "sign-up" ? "sign-in" : "sign-up")}>
        {mode === "sign-up" ? "Already have an Account? Sign in" : "New here? Create an Account"}
      </button>
    </section>
  );
}

function CreateGuildScreen({ onDone, onError }: { onDone: () => void; onError: (e: unknown) => void }) {
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await api.createGuild(name);
      onDone();
    } catch (err) {
      if (err instanceof UpdateRequired) onError(err);
      else setError(errorText(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="card narrow">
      <h1>Name your Guild</h1>
      <p className="muted">Every Guild needs a name before it can recruit.</p>
      <form onSubmit={submit} className="stack">
        <label>
          Guild name
          <input
            required
            minLength={GUILD_NAME_MIN_LENGTH}
            maxLength={GUILD_NAME_MAX_LENGTH}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="The Iron Lanterns"
          />
        </label>
        {error && <p className="error">{error}</p>}
        <button type="submit" disabled={busy}>
          Create Guild
        </button>
      </form>
    </section>
  );
}

const FACILITY_INFO: Record<FacilityKind, { name: string; serves: string }> = {
  housing: { name: "Housing", serves: "Rest · Roster size" },
  crafting: { name: "Crafting", serves: "Equipment" },
  training: { name: "Training", serves: "Combat Skills" },
  recreation: { name: "Recreation", serves: "Stress" },
  medical: { name: "Medical", serves: "Health" },
  nutrition: { name: "Nutrition", serves: "Hunger" },
  education: { name: "Education", serves: "Non-combat Skills" },
  storehouse: { name: "Storehouse", serves: "Guild Items" },
};

function GuildOverview({ guild }: { guild: GuildView }) {
  return (
    <div className="stack-lg">
      <section className="guild-header">
        <h1>{guild.name}</h1>
        <div className="stats">
          <Stat label="Gold" value={guild.gold.toLocaleString()} />
          <Stat label="Roster" value={`${guild.roster.adventurers.length} / ${guild.roster.capacity}`} />
          <Stat label="Storehouse" value={`${guild.storehouse.items.length} / ${guild.storehouse.capacity}`} />
        </div>
      </section>

      <section>
        <h2>Headquarters</h2>
        <ul className="facilities">
          {guild.headquarters.facilities.map((f) => (
            <li key={f.kind} className="card facility">
              <span className="facility-name">{FACILITY_INFO[f.kind].name}</span>
              <span className="level">Level {f.level}</span>
              <span className="muted small">{FACILITY_INFO[f.kind].serves}</span>
            </li>
          ))}
        </ul>
      </section>

      <div className="two-col">
        <section className="card">
          <h2>Roster</h2>
          <p className="muted">No Adventurers yet. Recruiting opens soon.</p>
        </section>
        <section className="card">
          <h2>Storehouse</h2>
          <p className="muted">Empty. Loot your Parties bring home will be kept here.</p>
        </section>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="stat">
      <span className="stat-value">{value}</span>
      <span className="stat-label">{label}</span>
    </div>
  );
}
