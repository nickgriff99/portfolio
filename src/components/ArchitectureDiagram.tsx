import type { ArchitectureDiagram as ArchitectureDiagramData, DiagramNode } from "../data/architectureDiagrams";
import { edgeOffsets } from "./architectureDiagramOffsets";

/** Hand-authored SVG flow diagram for a project's pipeline. Fully static (no
 * transitions/animation), so prefers-reduced-motion is a non-issue here.
 *
 * Layout heuristic (shortcut: only handles one main chain + one branch row,
 * which is all two current diagrams need — upgrade to real graph layout if a
 * third diagram needs more than one branch row):
 *  - "Main chain" = the path formed by following unlabeled edges from the
 *    first node. Labeled edges (e.g. "every 50 events") are read as
 *    branches/side paths and their nodes are placed in a second row, under
 *    whichever main-chain node they connect to.
 */

// NODE_W fits the longest real label across both diagrams ("Discord voice
// receive", bold font-mono @ 11px) with comfortable side padding — widen this
// if a future diagram's label is longer, rather than letting text clip.
const NODE_W = 180;
const NODE_H = 56;
const GAP_X = 36;
const GAP_Y = 56;
interface LaidOutNode extends DiagramNode {
  col: number;
  row: 0 | 1;
  x: number;
  y: number;
}

function layoutDiagram(diagram: ArchitectureDiagramData): { nodes: LaidOutNode[]; mainChainIds: string[] } {
  const { nodes, edges } = diagram;
  const byId = new Map(nodes.map((n) => [n.id, n]));

  // Walk the main chain by following unlabeled edges from the first node.
  const mainChainIds: string[] = [];
  let current: string | undefined = nodes[0]?.id;
  const visited = new Set<string>();
  while (current && !visited.has(current)) {
    mainChainIds.push(current);
    visited.add(current);
    const next = edges.find((e) => e.from === current && !e.label && !visited.has(e.to));
    current = next?.to;
  }

  const colOf = new Map(mainChainIds.map((id, i) => [id, i]));
  const laidOut: LaidOutNode[] = [];

  mainChainIds.forEach((id, col) => {
    const node = byId.get(id);
    if (!node) return;
    laidOut.push({ ...node, col, row: 0, x: col * (NODE_W + GAP_X), y: 0 });
  });

  // Branch nodes: anything not on the main chain. Place under whichever
  // main-chain node a labeled edge connects it to.
  nodes
    .filter((n) => !visited.has(n.id))
    .forEach((node) => {
      const linkEdge = edges.find(
        (e) => (e.from === node.id && colOf.has(e.to)) || (e.to === node.id && colOf.has(e.from)),
      );
      const anchorId = linkEdge ? (colOf.has(linkEdge.to) ? linkEdge.to : linkEdge.from) : undefined;
      const col = anchorId ? (colOf.get(anchorId) ?? laidOut.length) : laidOut.length;
      laidOut.push({ ...node, col, row: 1, x: col * (NODE_W + GAP_X), y: NODE_H + GAP_Y });
      visited.add(node.id);
    });

  return { nodes: laidOut, mainChainIds };
}

function nodeCenter(n: LaidOutNode) {
  return { cx: n.x + NODE_W / 2, cy: n.y + NODE_H / 2 };
}

function edgePath(from: LaidOutNode, to: LaidOutNode, offset = 0): string {
  const a = nodeCenter(from);
  const b = nodeCenter(to);
  if (from.row === to.row) {
    const forward = to.x > from.x;
    const x1 = forward ? from.x + NODE_W : from.x;
    const x2 = forward ? to.x : to.x + NODE_W;
    const y = a.cy + offset;
    return `M ${x1},${y} L ${x2},${y}`;
  }
  const downward = to.row > from.row;
  const y1 = downward ? from.y + NODE_H : from.y;
  const y2 = downward ? to.y : to.y + NODE_H;
  const midY = (y1 + y2) / 2;
  const ax = a.cx + offset;
  const bx = b.cx + offset;
  return `M ${ax},${y1} L ${ax},${midY} L ${bx},${midY} L ${bx},${y2}`;
}

/** Ordered, screen-reader-only description of the pipeline — the real accessible
 * content, same idea as ReadableTimeline in TerminalSession.tsx: full content next
 * to a decorative/visual rendering, not a single summarizing aria-label. */
function AccessibleStepList({ diagram, nodes, mainChainIds }: {
  diagram: ArchitectureDiagramData;
  nodes: LaidOutNode[];
  mainChainIds: string[];
}) {
  const byId = new Map(nodes.map((n) => [n.id, n]));
  const order: string[] = [];
  mainChainIds.forEach((id) => {
    order.push(id);
    diagram.edges
      .filter((e) => e.from === id && e.label)
      .forEach((e) => {
        if (!order.includes(e.to)) order.push(e.to);
      });
  });
  nodes.forEach((n) => {
    if (!order.includes(n.id)) order.push(n.id);
  });

  const incomingLabel = (id: string, fromId: string | undefined) =>
    diagram.edges.find((e) => e.from === fromId && e.to === id)?.label;

  return (
    <ol className="sr-only">
      {order.map((id, i) => {
        const node = byId.get(id);
        if (!node) return null;
        const label = incomingLabel(id, order[i - 1]);
        return (
          <li key={id}>
            Step {i + 1}: {node.label}
            {node.sublabel ? ` (${node.sublabel})` : ""}
            {label ? ` — ${label}` : ""}.
          </li>
        );
      })}
    </ol>
  );
}

export function ArchitectureDiagram({ diagram, title }: { diagram: ArchitectureDiagramData; title: string }) {
  const { nodes, mainChainIds } = layoutDiagram(diagram);
  const width = Math.max(...nodes.map((n) => n.x + NODE_W));
  const height = Math.max(...nodes.map((n) => n.y + NODE_H));
  const byId = new Map(nodes.map((n) => [n.id, n]));
  const offsets = edgeOffsets(diagram.edges);

  return (
    <div>
      <AccessibleStepList diagram={diagram} nodes={nodes} mainChainIds={mainChainIds} />
      <div className="overflow-x-auto rounded-[8px] border-2 border-[color-mix(in_srgb,var(--color-border)_62%,transparent)] bg-[color-mix(in_srgb,var(--color-surface)_92%,transparent)] p-4 shadow-[6px_6px_0_0_color-mix(in_srgb,var(--color-border)_55%,transparent)]">
        <svg
          aria-hidden="true"
          viewBox={`0 0 ${width} ${height}`}
          width={width}
          height={height}
          style={{ minWidth: width }}
          className="block"
        >
          <title>{title}</title>
          <defs>
            <marker id="arrowhead" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
              <path d="M0,0 L8,4 L0,8 Z" fill="var(--color-link)" />
            </marker>
          </defs>
          {diagram.edges.map((edge, i) => {
            const from = byId.get(edge.from);
            const to = byId.get(edge.to);
            if (!from || !to) return null;
            const offset = offsets[i];
            return (
              <g key={`${edge.from}-${edge.to}`}>
                <path
                  d={edgePath(from, to, offset)}
                  fill="none"
                  stroke="var(--color-link)"
                  strokeWidth={1.5}
                  markerEnd="url(#arrowhead)"
                />
                {edge.label && (
                  <text
                    x={(nodeCenter(from).cx + nodeCenter(to).cx) / 2 + offset}
                    y={(nodeCenter(from).cy + nodeCenter(to).cy) / 2 - 6 + offset}
                    textAnchor="middle"
                    className="font-mono"
                    fontSize={10}
                    fill="var(--color-muted)"
                  >
                    {edge.label}
                  </text>
                )}
              </g>
            );
          })}
          {nodes.map((node) => (
            <g key={node.id}>
              <rect
                x={node.x}
                y={node.y}
                width={NODE_W}
                height={NODE_H}
                rx={8}
                fill="var(--color-bg-soft)"
                stroke="var(--color-accent)"
                strokeWidth={2}
              />
              <text
                x={node.x + NODE_W / 2}
                y={node.y + NODE_H / 2 + (node.sublabel ? -4 : 4)}
                textAnchor="middle"
                className="font-mono font-bold"
                fontSize={11}
                fill="var(--color-text)"
              >
                {node.label}
              </text>
              {node.sublabel && (
                <text
                  x={node.x + NODE_W / 2}
                  y={node.y + NODE_H / 2 + 11}
                  textAnchor="middle"
                  className="font-mono"
                  fontSize={9}
                  fill="var(--color-muted)"
                >
                  {node.sublabel}
                </text>
              )}
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}
