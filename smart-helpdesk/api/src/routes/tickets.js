import express from "express";
import Ticket from "../models/Ticket.js";
import AgentSuggestion from "../models/AgentSuggestion.js";
import AuditLog from "../models/AuditLog.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { ticketCreateSchema } from "../validation/schemas.js";
import { runTriage } from "../agent/triage.js";

const router = express.Router();

router.post("/", requireAuth, async (req, res) => {
  const { value, error } = ticketCreateSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.message });
  const ticket = await Ticket.create({ ...value, createdBy: req.user.sub });
  // fire triage (sync for stub simplicity)
  try {
    await runTriage(ticket._id);
  } catch (e) {
    console.error("Triage failed", e);
  }
  res.status(201).json(ticket);
});

router.get("/", requireAuth, async (req, res) => {
  const status = req.query.status;
  const mine = req.query.mine === "true";
  const query = {};
  if (status) query.status = status;
  if (mine) query.createdBy = req.user.sub;
  const tickets = await Ticket.find(query).sort({ updatedAt: -1 });
  res.json(tickets);
});

router.get("/:id", requireAuth, async (req, res) => {
  const ticket = await Ticket.findById(req.params.id);
  if (!ticket) return res.status(404).json({ error: "Not found" });
  const suggestion = ticket.agentSuggestionId ? await AgentSuggestion.findById(ticket.agentSuggestionId) : null;
  res.json({ ticket, suggestion });
});

router.post("/:id/reply", requireAuth, requireRole("agent","admin"), async (req, res) => {
  const ticket = await Ticket.findById(req.params.id);
  if (!ticket) return res.status(404).json({ error: "Not found" });
  ticket.status = "resolved";
  ticket.assignee = req.user.sub;
  await ticket.save();
  await AuditLog.create({ ticketId: ticket._id, traceId: "manual", actor: "agent", action: "REPLY_SENT", meta: { by: req.user.email } });
  res.json(ticket);
});

router.post("/:id/assign", requireAuth, requireRole("agent","admin"), async (req, res) => {
  const ticket = await Ticket.findByIdAndUpdate(req.params.id, { assignee: req.user.sub, status: "triaged" }, { new: true });
  res.json(ticket);
});

export default router;
