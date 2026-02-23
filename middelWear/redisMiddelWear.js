import Client from "../client/client.js";
// --- Fixed Window Middleware ---
 export const FixedredisMiddelwear = async (req, res, next) => {
  try {
    const key = `rate:${req.ip}`;
    const limit = 5;
    const window = 100;
    // Atomic INCR ensures thread-safety in a distributed environment.
    //When different servers connect to the same database, they all access the same data.
    //If one server updates the current value (for example, increases a count to 1), the other servers will see the updated value when they read from the database.

    const current = await Client.incr(key);
    if (current === 1) {
      await Client.expire(key, window);
    }
    if (current > limit) {
      // Exposing rate limit status via headers for better API transparency.
      res.setHeader("X-RateLimit-Limit", limit);
      res.setHeader("X-RateLimit-Remaining", 0);

      return res.status(429).json({
        error: "To manny request",
      });
    }
    next();
  } catch (error) {
    console.error("Redis Error:", error);
    next(); // Fail-open: proceed if Redis is down
  }
};

// --- Floating Window Middleware ---
export const redisFloatMiddelwear = async (req, res, next) => {
  const key = `rate:${req.ip}`;
  const now = Date.now();
  const limit = 5;
  const window = 6000; // 1 minute in milliseconds
  try {
    // Multi-step logic using Redis Sorted Sets (ZSET)
    // Add current timestamp as both score and value
    await Client.zadd(key, now, now);
    // Maintenance: Remove timestamps older than the current sliding window
    await Client.zremrangebyscore(key, 0, now - window);

    // Get the current number of valid requests in the window
    const requestCount = await Client.zcard(key);

    // only check limit if exied than 429 error status
    if (requestCount > limit) {
      return res.status(429).json({
        error: "Floating Window Limit Exceeded",
      });
    }
    //othweise only set expire // Refresh TTL for the set to ensure automatic cleanup
    await Client.expire(key, window);
    next();
  } catch (error) {
    console.error("Redis Error:", err);
    next();
  }
};

