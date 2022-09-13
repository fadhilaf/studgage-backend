import { createClient } from "redis";

const redisUrl = `redis://localhost:6379`;
const redisClient = createClient({
  url: redisUrl,
});

redisClient.on("error", (err: unknown) =>
  console.log("Redis Client Error", err)
);

export default redisClient;
