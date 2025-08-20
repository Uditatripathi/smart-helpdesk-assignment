import mongoose from "mongoose";

const agentSuggestionSchema = new mongoose.Schema({
  ticketId: { type: mongoose.Schema.Types.ObjectId, ref: "Ticket", required: true },
  predictedCategory: { type: String, required: true },
  articleIds: { type: [String], default: [] },
  draftReply: { type: String, required: true },
  confidence: { type: Number, required: true },
  autoClosed: { type: Boolean, default: false },
  modelInfo: { type: Object }
}, { timestamps: true });

const AgentSuggestion = mongoose.models.AgentSuggestion || mongoose.model("AgentSuggestion", agentSuggestionSchema);
export default AgentSuggestion;


