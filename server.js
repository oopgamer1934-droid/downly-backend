import express from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const API_HOST = "social-download-all-in-one.p.rapidapi.com";
const API_URL = `https://${API_HOST}/v1/social/autolink`;

app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.json({ limit: "20kb" }));
app.use(express.static("public"));

const limiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 20,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { error: true, message: "Too many requests. Please try again in a minute." }
});
app.use("/api/", limiter);

app.post("/api/fetch", async (req, res) => {
  const url = typeof req.body?.url === "string" ? req.body.url.trim() : "";

  if (!url) return res.status(400).json({ error: true, message: "Please enter a video URL." });

  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    return res.status(400).json({ error: true, message: "That URL doesn't look valid." });
  }

  if (!["http:", "https:"].includes(parsed.protocol)) {
    return res.status(400).json({ error: true, message: "Only HTTP and HTTPS links are supported." });
  }

  if (!process.env.RAPIDAPI_KEY) {
    return res.status(500).json({ error: true, message: "Server setup incomplete: add RAPIDAPI_KEY to your .env file." });
  }

  try {
    const upstream = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-RapidAPI-Host": API_HOST,
        "X-RapidAPI-Key": process.env.RAPIDAPI_KEY
      },
      body: JSON.stringify({ url }),
      signal: AbortSignal.timeout(30000)
    });

    const data = await upstream.json().catch(() => ({}));
    if (!upstream.ok) {
      return res.status(upstream.status).json({
        error: true,
        message: data?.message || `Downloader provider returned ${upstream.status}.`
      });
    }
    if (data?.error) {
      return res.status(422).json({ error: true, message: data.message || "Couldn't fetch this video." });
    }
    return res.json(data);
  } catch (err) {
    const message = err.name === "TimeoutError"
      ? "The request timed out. Please try again."
      : "Couldn't connect to the downloader service. Please try again.";
    return res.status(502).json({ error: true, message });
  }
});

app.listen(PORT, () => console.log(`Downloader running at http://localhost:${PORT}`));
