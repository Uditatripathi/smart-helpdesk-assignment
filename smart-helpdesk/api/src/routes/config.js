import express from "express";
import Config from "../models/Config.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { configSchema } from "../validation/schemas.js";

const router = express.Router();

router.get("/", requireAuth, async (_req, res) => {
  const cfg = await Config.findOne();
  res.json(cfg || { autoCloseEnabled: true, confidenceThreshold: 0.78, slaHours: 24 });
});

router.put("/", requireAuth, requireRole("admin"), async (req, res) => {
  const { value, error } = configSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.message });
  const cfg = await Config.findOneAndUpdate({}, value, { upsert: true, new: true });
  res.json(cfg);
});

export default router;
