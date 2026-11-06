import { afterEach, describe, expect, it, vi } from "vitest";
import { verifyRecaptcha } from "./recaptcha.js";

describe("verifyRecaptcha", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns success and score from a passing response", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ json: async () => ({ success: true, score: 0.9 }) }),
    );
    const result = await verifyRecaptcha("good-token");
    expect(result).toEqual({ success: true, score: 0.9 });
  });

  it("returns failure for a low-score or rejected response", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ json: async () => ({ success: false, score: 0.1 }) }),
    );
    const result = await verifyRecaptcha("bad-token");
    expect(result).toEqual({ success: false, score: 0.1 });
  });
});
