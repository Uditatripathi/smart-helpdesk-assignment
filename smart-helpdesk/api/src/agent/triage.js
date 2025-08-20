import { v4 as uuidv4 } from "uuid";
import AgentSuggestion from "../models/AgentSuggestion.js";
import Ticket from "../models/Ticket.js";
import Config from "../models/Config.js";
import AuditLog from "../models/AuditLog.js";
import Article from "../models/Article.js";
import { classify, draft } from "./llmStub.js";
import { searchKB } from "../services/search.js";

async function log(ticketId, traceId, actor, action, meta={}) {
  await AuditLog.create({ ticketId, traceId, actor, action, meta });
}

export async function runTriage(ticketId) {
  const ticket = await Ticket.findById(ticketId);
  if (!ticket) throw new Error("Ticket not found");
  const traceId = uuidv4();
  await log(ticket._id, traceId, "system", "TRIAGE_STARTED", { ticketId: ticket._id });

  // 1) Classify
  const cls = classify(`${ticket.title} ${ticket.description}`);
  await log(ticket._id, traceId, "system", "AGENT_CLASSIFIED", cls);

  // 2) Retrieve KB
  const query = ticket.description || ticket.title;
  const articles = await searchKB(query, 3);
  await log(ticket._id, traceId, "system", "KB_RETRIEVED", { articleIds: articles.map(a=>a._id) });

  // 3) Draft
  const drafted = draft(query, articles);
  await log(ticket._id, traceId, "system", "DRAFT_GENERATED", drafted);

  // 4) Decision
  const cfg = await Config.findOne() || { autoCloseEnabled: true, confidenceThreshold: 0.78 };
  const shouldAuto = (cfg.autoCloseEnabled ?? true) && (cls.confidence >= (cfg.confidenceThreshold ?? 0.78));

  const suggestion = await AgentSuggestion.create({
    ticketId: ticket._id,
    predictedCategory: cls.predictedCategory,
    articleIds: articles.map(a => a._id.toString()),
    draftReply: drafted.draftReply,
    confidence: cls.confidence,
    autoClosed: shouldAuto,
    modelInfo: { provider: "stub", model: "heuristic-1", promptVersion: "v1", latencyMs: 0 }
  });

  ticket.category = cls.predictedCategory;
  ticket.agentSuggestionId = suggestion._id;

  if (shouldAuto) {
    ticket.status = "resolved";
    await ticket.save();
    await log(ticket._id, traceId, "system", "AUTO_CLOSED", { confidence: cls.confidence });
  } else {
    ticket.status = "waiting_human";
    await ticket.save();
    await log(ticket._id, traceId, "system", "ASSIGNED_TO_HUMAN", { reason: "below_threshold" });
  }

  await log(ticket._id, traceId, "system", "TRIAGE_FINISHED", { suggestionId: suggestion._id });
  return { traceId, suggestion };
}
