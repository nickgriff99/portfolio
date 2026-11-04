import { describe, expect, it } from "vitest";

import { edgeOffsets } from "./architectureDiagramOffsets";
import { architectureDiagrams } from "../data/architectureDiagrams";

describe("edgeOffsets", () => {
  it("gives opposite non-zero offsets to a bidirectional pair (receipts-bot llm<->db)", () => {
    const edges = architectureDiagrams[10].edges;
    const offsets = edgeOffsets(edges);
    const dbIndexes = edges
      .map((e, i) => ({ e, i }))
      .filter(({ e }) => (e.from === "llm" && e.to === "db") || (e.from === "db" && e.to === "llm"))
      .map(({ i }) => i);

    expect(dbIndexes).toHaveLength(2);
    const [a, b] = dbIndexes.map((i) => offsets[i]);
    expect(a).not.toBe(0);
    expect(a).toBe(-b);
  });

  it("leaves single-direction edges unoffset", () => {
    const offsets = edgeOffsets(architectureDiagrams[11].edges);
    expect(offsets.every((o) => o === 0)).toBe(true);
  });
});
