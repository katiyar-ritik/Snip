const express = require("express");
const { nanoid } = require("nanoid");
const QRCode = require("qrcode");
const db = require("../db");

const router = express.Router();

const RESERVED_WORDS = new Set([
  "api",
  "app",
  "admin",
  "static",
  "assets",
  "favicon.ico",
  "login",
  "logout",
  "signup",
  "health",
  "stats",
  "qr",
]);

const ALIAS_PATTERN = /^[a-zA-Z0-9_-]{3,32}$/;

function isValidUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

const insertLink = db.prepare("INSERT INTO links (short_code, original_url) VALUES (?, ?)");
const findByCode = db.prepare("SELECT * FROM links WHERE short_code = ?");
const insertClick = db.prepare(
  "INSERT INTO clicks (link_id, referrer, user_agent) VALUES (?, ?, ?)"
);
const countClicks = db.prepare("SELECT COUNT(*) AS total FROM clicks WHERE link_id = ?");
const recentClicks = db.prepare(
  "SELECT clicked_at, referrer, user_agent FROM clicks WHERE link_id = ? ORDER BY clicked_at DESC LIMIT 50"
);

// Create a short link
router.post("/api/links", (req, res) => {
  const { url, alias } = req.body || {};

  if (!url || typeof url !== "string" || !isValidUrl(url)) {
    return res.status(400).json({ error: "Please provide a valid http(s) URL." });
  }

  let shortCode = alias ? alias.trim() : null;

  if (shortCode) {
    if (!ALIAS_PATTERN.test(shortCode)) {
      return res.status(400).json({
        error: "Alias must be 3-32 characters: letters, numbers, hyphens, underscores.",
      });
    }
    if (RESERVED_WORDS.has(shortCode.toLowerCase())) {
      return res.status(400).json({ error: "That alias is reserved. Please choose another." });
    }
    if (findByCode.get(shortCode)) {
      return res.status(409).json({ error: "That alias is already taken." });
    }
  } else {
    do {
      shortCode = nanoid(7);
    } while (findByCode.get(shortCode));
  }

  insertLink.run(shortCode, url);
  const link = findByCode.get(shortCode);

  res.status(201).json({
    id: link.id,
    shortCode: link.short_code,
    originalUrl: link.original_url,
    createdAt: link.created_at,
  });
});

// Click analytics for a link
router.get("/api/links/:code/stats", (req, res) => {
  const link = findByCode.get(req.params.code);
  if (!link) return res.status(404).json({ error: "Short link not found." });

  const { total } = countClicks.get(link.id);
  const recent = recentClicks.all(link.id);

  res.json({
    shortCode: link.short_code,
    originalUrl: link.original_url,
    createdAt: link.created_at,
    totalClicks: total,
    recentClicks: recent,
  });
});

// QR code for a link, streamed as PNG
router.get("/api/links/:code/qrcode", async (req, res) => {
  const link = findByCode.get(req.params.code);
  if (!link) return res.status(404).json({ error: "Short link not found." });

  const targetUrl = `${req.protocol}://${req.get("host")}/${link.short_code}`;

  res.type("png");
  try {
    await QRCode.toFileStream(res, targetUrl, { type: "png", width: 300, margin: 1 });
  } catch (err) {
    console.error("Failed to generate QR code:", err);
    res.status(500).json({ error: "Failed to generate QR code." });
  }
});

// Redirect + log click
router.get("/:code", (req, res, next) => {
  const link = findByCode.get(req.params.code);
  if (!link) return next(); // fall through to 404 handler

  insertClick.run(link.id, req.get("referer") || null, req.get("user-agent") || null);
  res.redirect(302, link.original_url);
});

module.exports = router;
