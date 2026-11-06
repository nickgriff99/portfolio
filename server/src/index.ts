import cors from "cors";
import express from "express";
import { pool } from "./db.js";
import { verifyRecaptcha } from "./recaptcha.js";
import { guestbookEntryInput } from "./schema.js";

const PORT = process.env.PORT ?? 3001;
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGIN ?? "").split(",").map((origin) => origin.trim());
const RECAPTCHA_SCORE_THRESHOLD = 0.5;

// Fire-and-forget: a failed notification email must never fail the visitor's request.
async function notifyNewEntry(name: string, message: string) {
  const apiKey = process.env.RESEND_API_KEY;
  const notifyEmail = process.env.NOTIFY_EMAIL;
  if (!apiKey || !notifyEmail) return;
  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "onboarding@resend.dev",
        to: notifyEmail,
        subject: `New guestbook entry from ${name}`,
        text: message,
      }),
    });
  } catch (err) {
    console.error("Failed to send guestbook notification email:", err);
  }
}

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

  const recaptcha = await verifyRecaptcha(parsed.data.recaptchaToken);
  if (!recaptcha.success || recaptcha.score < RECAPTCHA_SCORE_THRESHOLD) {
    res.status(400).json({ error: "Verification failed." });
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
    void notifyNewEntry(name, message);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong." });
  }
});

app.listen(PORT, () => {
  console.log(`Guestbook server listening on port ${PORT}`);
});
