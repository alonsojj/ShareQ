const cron = require("node-cron");
const fs = require("fs");
const redis = require("../config/redis.config");

const startCleanupJob = () => {
  // Schedule the job to run once every hour
  cron.schedule("0 * * * *", async () => {
    console.log("Running scheduled job: cleaning up expired presentations...");

    try {
      const keys = await redis.keys("*");
      const now = new Date();

      for (const key of keys) {
        const presentationJSON = await redis.get(key);
        const presentation = JSON.parse(presentationJSON);

        if (presentation.expiresAt && now > new Date(presentation.expiresAt)) {
          console.log(`Presentation ${key} has expired. Deleting...`);

          fs.unlink(presentation.path, (err) => {
            if (err) {
              console.error(`Error deleting file ${presentation.path}:`, err);
            } else {
              console.log(`Successfully deleted file: ${presentation.path}`);
            }
          });

          await redis.del(key);
        }
      }
    } catch (error) {
      console.error("Error during cleanup job:", error);
    }
  });

  console.log("Cleanup job scheduled to run every hour.");
};

module.exports = { startCleanupJob };
