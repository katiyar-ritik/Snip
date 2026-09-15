const path = require("path");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const linksRouter = require("./routes/links");
const { createLinkLimiter } = require("./middleware/rateLimit");

const app = express();
const PORT = process.env.PORT || 3000;

// Basic security headers (helps protect against clickjacking, XSS, etc.)
app.use(helmet());
app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Apply the rate limiter only to link creation, not every route.
app.post("/api/links", createLinkLimiter);
app.use(linksRouter);

// Serve the built frontend (this folder only exists after `npm run build`
// has been run and copied into place, e.g. inside the Docker image).
const frontendDir = path.join(__dirname, "..", "public");
app.use(express.static(frontendDir));

// Anything that isn't an API route or a static file falls through to the
// React app, so client-side routing works on a full page refresh.
app.get("*", (req, res, next) => {
  if (req.path.startsWith("/api")) {
    return next();
  }
  res.sendFile(path.join(frontendDir, "index.html"), (err) => {
    if (err) next();
  });
});

app.use((req, res) => {
  res.status(404).json({ error: "Not found." });
});

app.listen(PORT, () => {
  console.log(`Snip API listening on port ${PORT}`);
});
