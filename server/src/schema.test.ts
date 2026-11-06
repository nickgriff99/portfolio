import { describe, expect, it } from "vitest";
import { guestbookEntryInput } from "./schema.js";

describe("guestbookEntryInput", () => {
  it("accepts a valid entry", () => {
    const result = guestbookEntryInput.safeParse({
      name: "Ada",
      message: "Loved the site, great work!",
    });
    expect(result.success).toBe(true);
  });

  it("rejects a name below the minimum length", () => {
    const result = guestbookEntryInput.safeParse({
      name: "A",
      message: "Loved the site, great work!",
    });
    expect(result.success).toBe(false);
  });

  it("rejects a message below the minimum length", () => {
    const result = guestbookEntryInput.safeParse({
      name: "Ada",
      message: "short",
    });
    expect(result.success).toBe(false);
  });

  it("rejects a filled-in honeypot field", () => {
    const result = guestbookEntryInput.safeParse({
      name: "Ada",
      message: "Loved the site, great work!",
      bot_field: "spam",
    });
    expect(result.success).toBe(false);
  });
});
