import express from "express";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { runTriage } from "../agent/triage.js";
import AgentSuggestion from "../models/AgentSuggestion.js";

const router = express.Router();

router.post("/triage", requireAuth, requireRole("admin","agent"), async (req, res) => {
  const { ticketId } = req.body || {};
  if (!ticketId) return res.status(400).json({ error: "ticketId required" });
  try {
    const out = await runTriage(ticketId);
    res.json(out);
  } catch (e) {
    res.status(500).json({ error: "triage failed" });
  }
});

router.get("/suggestion/:ticketId", requireAuth, async (req, res) => {
  const s = await AgentSuggestion.findOne({ ticketId: req.params.ticketId }).sort({ createdAt: -1 });
  res.json(s || null);
});

export default router;
