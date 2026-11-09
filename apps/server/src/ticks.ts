export type TickHandler = () => void | Promise<void>;

/**
 * Drives the Dungeon's tick loops. Production uses a fixed interval; tests
 * advance it by hand (ADR 0005, ADR 0010).
 */
export interface TickDriver {
  start(onTick: TickHandler): void;
  stop(): void;
}

export const TICK_INTERVAL_MS = 2_000;

export function intervalTickDriver(intervalMs = TICK_INTERVAL_MS): TickDriver {
  let timer: ReturnType<typeof setInterval> | undefined;
  let running = false;
  return {
    start(onTick) {
      timer = setInterval(async () => {
        if (running) return; // never overlap ticks
        running = true;
        try {
          await onTick();
        } finally {
          running = false;
        }
      }, intervalMs);
    },
    stop() {
      if (timer) clearInterval(timer);
      timer = undefined;
    },
  };
}
