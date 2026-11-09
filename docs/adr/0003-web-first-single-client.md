# One web client, wrapped for mobile and desktop

The only client codebase is a responsive web app (installable as a PWA). Phone apps are produced by wrapping it with Capacitor, and desktop apps with Tauri (or Electron). We rejected separate native apps and a game engine because the game is predominantly menus, lists and maps; one UI codebase is the only sustainable option for a solo developer. All clients are thin and speak one server API, so a native client remains possible later without server changes.

## Consequences

- The server enforces a minimum client version from day one; clients below it show an "update required" screen. Protocol changes are additive wherever possible, and old API versions are not maintained in parallel.
