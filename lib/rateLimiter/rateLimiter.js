const RATE_LIMIT = 10; // Maximum requests per minute
const TIMEOUT = 15 * 1000;

const requestLog = {};

function rateLimiter(req, res, next) {
  const ip = req.ip || req.connection.remoteAddress;

  const now = Date.now();
  const log = requestLog[ip] || { timestamps: [], blockUntil: 0 };

  // checking blocking period
  if (now < log.blockUntil) {
    return res
      .status(429)
      .json({ error: "Too many requests. Please try again later." });
  }

  // filtering the timestamps older than 2 seconds
  const recentRequests = log.timestamps.filter(
    (timestamp) => now - timestamp < 5000
  );

  if (recentRequests.length >= RATE_LIMIT) {
    // Blocking  the IP for 15 secs
    requestLog[ip] = {
      timestamps: recentRequests,
      blockUntil: now + TIMEOUT,
    };

    return res
      .status(429)
      .json({ error: "Rate limit exceeded. Please try again later." });
  }

  requestLog[ip] = {
    timestamps: [...recentRequests, now],
    blockUntil: log.blockUntil,
  };

  next();
}

module.exports = rateLimiter;
