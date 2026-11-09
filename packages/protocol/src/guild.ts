import { z } from "zod";
import { FACILITY_KINDS, GUILD_NAME_MAX_LENGTH, GUILD_NAME_MIN_LENGTH } from "@agm/rules";

export const CreateGuildRequest = z.object({
  name: z.string().trim().min(GUILD_NAME_MIN_LENGTH).max(GUILD_NAME_MAX_LENGTH),
});
export type CreateGuildRequest = z.infer<typeof CreateGuildRequest>;

export const FacilityView = z.object({
  kind: z.enum(FACILITY_KINDS),
  level: z.number().int().min(1),
});
export type FacilityView = z.infer<typeof FacilityView>;

export const GuildView = z.object({
  id: z.string(),
  name: z.string(),
  gold: z.number().int(),
  headquarters: z.object({
    facilities: z.array(FacilityView),
  }),
  roster: z.object({
    capacity: z.number().int(),
    adventurers: z.array(z.never()),
  }),
  storehouse: z.object({
    capacity: z.number().int(),
    items: z.array(z.never()),
  }),
});
export type GuildView = z.infer<typeof GuildView>;
