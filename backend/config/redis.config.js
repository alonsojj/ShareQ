const Redis = require("ioredis");

const host = process.env.REDIS_HOST || "127.0.0.1";

// Create a new Redis client instance.
const redis = new Redis({
  host: host,
  port: 6379,
});

redis.on("connect", () => {
  console.log(`Conectado ao Redis em ${host}.`);
});

redis.on("error", (err) => {
  console.error("Erro de conexão com o Redis:", err);
});

module.exports = redis;
