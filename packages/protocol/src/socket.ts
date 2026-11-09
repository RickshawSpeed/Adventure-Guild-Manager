import { z } from "zod";
import { UPDATE_REQUIRED } from "./errors.ts";

/** WebSocket close code used after an "update required" rejection. */
export const UPDATE_REQUIRED_CLOSE_CODE = 4426;

export const ServerMessage = z.discriminatedUnion("type", [
  z.object({ type: z.literal("welcome"), rulesVersion: z.number().int() }),
  z.object({
    type: z.literal("error"),
    code: z.literal(UPDATE_REQUIRED),
    minClientVersion: z.string(),
  }),
]);
export type ServerMessage = z.infer<typeof ServerMessage>;
