const { createClient } = require("redis");

const redisClient = createClient({
  url: process.env.REDIS_URL,
});

redisClient.on("error", (err) => {
  console.error("REDIS ERROR:", err.message);
});

const connectRedis = async () => {
  try {
    console.log("REDIS_URL EXISTS:", !!process.env.REDIS_URL);

    await redisClient.connect();

    console.log("REDIS CONNECTED");
  } catch (error) {
    console.error("REDIS CONNECTION ERROR:", error.message);
  }
};

module.exports = {
  redisClient,
  connectRedis,
};