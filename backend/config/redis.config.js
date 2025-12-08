const Redis = require("ioredis");

// Create a new Redis client instance.
// It will connect to 127.0.0.1:6379 by default, which matches our docker-compose setup.
const redis = new Redis();

redis.on("connect", () => {
  console.log("Conectado ao Redis.");
});

redis.on("error", (err) => {
  console.error("Erro de conexão com o Redis:", err);
});

module.exports = redis;
