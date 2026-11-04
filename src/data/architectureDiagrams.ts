export interface DiagramNode {
  id: string;
  label: string;
  /** Optional short sublabel, e.g. a technology name shown under the main label */
  sublabel?: string;
}

export interface DiagramEdge {
  from: string; // node id
  to: string; // node id
  /** Optional short label on the connecting line, e.g. "WebSocket push" */
  label?: string;
}

export interface ArchitectureDiagram {
  nodes: DiagramNode[];
  edges: DiagramEdge[];
}

/** Simple architecture diagrams generated from each project's README pipeline
 * description, keyed by Project.id. Rendered by <ArchitectureDiagram>. Add more
 * entries as additional projects get a diagram-worthy pipeline. */
export const architectureDiagrams: Record<number, ArchitectureDiagram> = {
  // receipts-bot — linear real-time voice pipeline across 4 external services + Postgres.
  10: {
    nodes: [
      { id: "voice", label: "Discord voice receive", sublabel: "per-user Opus decode" },
      { id: "vad", label: "VAD segmentation" },
      { id: "stt", label: "Speech-to-text", sublabel: "Deepgram streaming" },
      { id: "llm", label: "Claude Haiku", sublabel: "gate + response + memory" },
      { id: "tts", label: "Text-to-speech", sublabel: "ElevenLabs streaming" },
      { id: "playback", label: "Voice playback", sublabel: "@discordjs/voice, barge-in" },
      { id: "db", label: "PostgreSQL", sublabel: "memory + usage log" },
    ],
    edges: [
      { from: "voice", to: "vad" },
      { from: "vad", to: "stt" },
      { from: "stt", to: "llm" },
      { from: "llm", to: "tts" },
      { from: "tts", to: "playback" },
      { from: "llm", to: "db", label: "log + memory" },
      { from: "db", to: "llm", label: "context read" },
    ],
  },
  // wallet-dashboard — mostly-linear event-sourcing write path with a snapshot +
  // WebSocket read-path branch off the Event Store / Replay Engine.
  11: {
    nodes: [
      { id: "client", label: "Client", sublabel: "deposit/withdraw/transfer" },
      { id: "api", label: "API layer", sublabel: "validates + writes" },
      { id: "store", label: "Event Store", sublabel: "append-only, versioned" },
      { id: "snapshot", label: "Snapshot cache", sublabel: "every 50 events" },
      { id: "replay", label: "Replay Engine", sublabel: "snapshot + events" },
      { id: "ws", label: "WebSocket push", sublabel: "balance.updated" },
      { id: "dashboard", label: "Dashboard", sublabel: "subscribed clients" },
    ],
    edges: [
      { from: "client", to: "api" },
      { from: "api", to: "store" },
      { from: "store", to: "snapshot", label: "every 50 events" },
      { from: "store", to: "replay" },
      { from: "snapshot", to: "replay" },
      { from: "replay", to: "ws" },
      { from: "ws", to: "dashboard" },
    ],
  },
};
