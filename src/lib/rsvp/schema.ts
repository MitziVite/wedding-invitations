import { z } from "zod";

export const MAX_CHILDREN = 10;

/** Shared between the client (immediate feedback) and the API route (source of truth — never trust the client alone). */
export const rsvpSubmitSchema = z.object({
  contactName: z.string().trim().min(2).max(80),
  contactEmail: z.union([z.literal(""), z.string().trim().email().max(120)]).optional(),
  attending: z.enum(["yes", "no"]),
  plusOneName: z.string().trim().max(80).optional(),
  childrenCount: z.number().int().min(0).max(MAX_CHILDREN),
  message: z.string().trim().max(500).optional(),
  // Anti-spam — validated loosely here; the route decides what to do with them.
  honeypot: z.string().optional(),
  formRenderedAt: z.number(),
});

export type RsvpSubmitInput = z.infer<typeof rsvpSubmitSchema>;

export interface ErrorResult {
  ok: false;
  error: string;
}
