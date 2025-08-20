import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, enum: ["new","waiting_human","triaged","resolved"], default: "new" },
  category: { type: String, enum: ["billing","tech","shipping","other"], default: "other" },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  assignee: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  agentSuggestionId: { type: mongoose.Schema.Types.ObjectId, ref: "AgentSuggestion" }
}, { timestamps: true });

const Ticket = mongoose.models.Ticket || mongoose.model("Ticket", ticketSchema);
export default Ticket;


