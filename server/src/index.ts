import cors from "cors";
import express from "express";
import { pool } from "./db.js";
import { guestbookEntryInput } from "./schema.js";

const PORT = process.env.PORT ?? 3001;
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGIN ?? "").split(",").map((origin) => origin.trim());

const app = express();
// Render's requests arrive through its own proxy; without this, req.ip is the proxy's
// address for every request, not the visitor's, which breaks the per-IP rate limit below.
app.set("trust proxy", true);
app.use(cors({ origin: ALLOWED_ORIGINS }));
app.use(express.json({ limit: "10kb" }));

// shortcut: in-memory limiter resets on Render restart/redeploy, upgrade to a DB-backed check if abuse becomes real
const lastPostByIp = new Map<string, number>();
const RATE_LIMIT_WINDOW_MS = 30_000;

app.get("/api/entries", async (_req, res) => {
  try {
    const { rows } = await pool.query(
      "select id, name, message, created_at from guestbook_entries order by created_at desc limit 50",
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong." });
  }
});

app.post("/api/entries", async (req, res) => {
  const parsed = guestbookEntryInput.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid entry." });
    return;
  }

  const ip = req.ip ?? "unknown";
  const lastPost = lastPostByIp.get(ip);
  if (lastPost && Date.now() - lastPost < RATE_LIMIT_WINDOW_MS) {
    res.status(429).json({ error: "Please wait before posting again." });
    return;
  }
  lastPostByIp.set(ip, Date.now());

  try {
    const { name, message } = parsed.data;
    const { rows } = await pool.query(
      "insert into guestbook_entries (name, message) values ($1, $2) returning id, name, message, created_at",
      [name, message],
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong." });
  }
});

app.listen(PORT, () => {
  console.log(`Guestbook server listening on port ${PORT}`);
});
