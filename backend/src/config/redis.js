const { createClient } = require("redis");

console.log("REDIS_URL EXISTS:", !!process.env.REDIS_URL);

const redisClient = createClient({
  url: process.env.REDIS_URL,

  socket: {
    reconnectStrategy: (retries) => {
      console.log("REDIS RECONNECT ATTEMPT:", retries);
      return Math.min(retries * 1000, 5000);
    },
  },
});

redisClient.on("connect", () => {
  console.log("REDIS CONNECT EVENT");
});

redisClient.on("ready", () => {
  console.log("REDIS READY");
});

redisClient.on("reconnecting", () => {
  console.log("REDIS RECONNECTING");
});

redisClient.on("end", () => {
  console.log("REDIS CONNECTION ENDED");
});

redisClient.on("error", (err) => {
  console.error("========== REDIS ERROR ==========");
  console.error("MESSAGE:", err?.message);
  console.error("CODE:", err?.code);
  console.error("NAME:", err?.name);
  console.error("STACK:", err?.stack);
  console.error("FULL ERROR:", JSON.stringify(err, Object.getOwnPropertyNames(err)));
  console.error("=================================");
});

const connectRedis = async () => {
  try {
    if (!process.env.REDIS_URL) {
      throw new Error("REDIS_URL is missing from environment variables");
    }

    console.log("Connecting to Redis...");

    await redisClient.connect();

    console.log("REDIS CONNECTED SUCCESSFULLY");
  } catch (error) {
    console.error("========== REDIS CONNECTION FAILED ==========");
    console.error("MESSAGE:", error?.message);
    console.error("CODE:", error?.code);
    console.error("NAME:", error?.name);
    console.error("STACK:", error?.stack);
    console.error("FULL ERROR:", JSON.stringify(error, Object.getOwnPropertyNames(error)));
    console.error("=============================================");
  }
};

module.exports = {
  redisClient,
  connectRedis,
};