import { z } from "zod";

export const guestbookEntryInput = z.object({
  name: z.string().trim().min(2).max(50),
  message: z.string().trim().min(10).max(1000),
  bot_field: z.string().max(0).optional().default(""),
});

export type GuestbookEntryInput = z.infer<typeof guestbookEntryInput>;
