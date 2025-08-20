import express from "express";
import AuditLog from "../models/AuditLog.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

router.get("/:ticketId", requireAuth, async (req, res) => {
  const logs = await AuditLog.find({ ticketId: req.params.ticketId }).sort({ timestamp: 1 });
  res.json(logs);
});

export default router;
