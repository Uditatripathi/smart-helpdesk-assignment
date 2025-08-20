import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import mongoose from "mongoose";

import authRoutes from "./routes/auth.js";
import ticketRoutes from "./routes/tickets.js";
import kbRoutes from "./routes/kb.js";
import agentRoutes from "./routes/agent.js";
import auditRoutes from "./routes/audit.js";
import configRoutes from "./routes/config.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

const port = process.env.PORT || 8080;
const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/helpdesk";

async function connectToDatabase(uri) {
  mongoose.set("strictQuery", true);
  await mongoose.connect(uri, { autoIndex: true });
}

app.get("/healthz", (_req, res) => {
  res.json({ ok: true });
});

app.get("/readyz", (_req, res) => {
  const ready = mongoose.connection.readyState === 1;
  res.status(ready ? 200 : 503).json({ mongo: ready ? "up" : "down" });
});

app.use("/api/auth", authRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/kb", kbRoutes);
app.use("/api/agent", agentRoutes);
app.use("/api/audit", auditRoutes);
app.use("/api/config", configRoutes);

connectToDatabase(mongoUri)
  .then(() => {
    app.listen(port, () => {
      console.log(`API listening on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
    process.exit(1);
  });


