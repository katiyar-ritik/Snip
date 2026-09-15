const rateLimit = require("express-rate-limit");

// Guards the link-creation endpoint against abuse.
const createLinkLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many links created from this IP. Please try again later." },
});

module.exports = { createLinkLimiter };
