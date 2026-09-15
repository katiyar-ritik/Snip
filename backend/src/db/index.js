const path = require("path");
const fs = require("fs");
const Database = require("better-sqlite3");

const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, "..", "..", "data");
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const db = new Database(path.join(DATA_DIR, "snip.db"));
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

db.exec(`
  CREATE TABLE IF NOT EXISTS links (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    short_code TEXT NOT NULL UNIQUE,
    original_url TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS clicks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    link_id INTEGER NOT NULL,
    clicked_at TEXT NOT NULL DEFAULT (datetime('now')),
    referrer TEXT,
    user_agent TEXT,
    FOREIGN KEY (link_id) REFERENCES links(id) ON DELETE CASCADE
  );

  CREATE INDEX IF NOT EXISTS idx_clicks_link_id ON clicks(link_id);
`);

module.exports = db;
