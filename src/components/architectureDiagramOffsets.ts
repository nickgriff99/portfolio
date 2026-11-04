import type { ArchitectureDiagram as ArchitectureDiagramData } from "../data/architectureDiagrams";

// Perpendicular offset applied to each line of a bidirectional node pair
// (e.g. llm <-> db) so the two edges + their labels don't draw on top of
// each other.
const BIDIRECTIONAL_OFFSET = 14;

/** Edges sharing the same two endpoints (either direction) need visually
 * distinct paths and labels, or they draw directly on top of each other
 * (e.g. the receipts-bot llm<->db "log + memory" / "context read" pair). */
export function edgeOffsets(edges: ArchitectureDiagramData["edges"]): number[] {
  return edges.map((edge) => {
    const key = [edge.from, edge.to].sort().join("|");
    const group = edges.filter((e) => [e.from, e.to].sort().join("|") === key);
    if (group.length < 2) return 0;
    return group.indexOf(edge) === 0 ? -BIDIRECTIONAL_OFFSET : BIDIRECTIONAL_OFFSET;
  });
}
