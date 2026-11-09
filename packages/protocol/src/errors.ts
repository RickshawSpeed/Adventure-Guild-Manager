import { z } from "zod";

export const UPDATE_REQUIRED = "update_required";

export const UpdateRequiredError = z.object({
  error: z.literal(UPDATE_REQUIRED),
  minClientVersion: z.string(),
});
export type UpdateRequiredError = z.infer<typeof UpdateRequiredError>;

export const ApiError = z.union([
  UpdateRequiredError,
  z.object({ error: z.string(), message: z.string().optional() }),
]);
export type ApiError = z.infer<typeof ApiError>;

/** HTTP status used for the "update required" rejection. */
export const UPDATE_REQUIRED_STATUS = 426;
