const { createClient } = require("redis");

const redisClient = createClient({
    url: process.env.REDIS_URL
});

redisClient.on("error", (error) => {
    console.error("Redis Error:", error.message);
});

const connectRedis = async () => {
    try {
        if (!process.env.REDIS_URL) {
            console.error("REDIS_URL is missing in .env");
            return;
        }

        if (!redisClient.isOpen) {
            await redisClient.connect();
        }

        // Avoid printing "Redis connected" multiple times
        if (redisClient.isReady) {
            console.log("Redis connected");
        }

    } catch (error) {
        console.error("Redis connection failed:", error.message);
    }
};

module.exports = {
    redisClient,
    connectRedis
};