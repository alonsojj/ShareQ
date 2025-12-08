require("dotenv").config();
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const presentationRoutes = require("./routes/presentation.route");
const { startCleanupJob } = require("./services/scheduler");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// Ensure uploads directory exists
["uploads"].forEach((dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir);
});

// Use the presentation routes
app.use("/api", presentationRoutes);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  // Start the cleanup job
  startCleanupJob();
});

