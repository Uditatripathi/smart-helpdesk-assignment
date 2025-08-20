import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema({
  ticketId: { type: mongoose.Schema.Types.ObjectId, ref: "Ticket", required: true },
  traceId: { type: String, required: true },
  actor: { type: String, enum: ["system","agent","user"], required: true },
  action: { type: String, required: true },
  meta: { type: Object, default: {} },
  timestamp: { type: Date, default: Date.now }
}, { timestamps: false });

auditLogSchema.index({ ticketId: 1, timestamp: 1 });

const AuditLog = mongoose.models.AuditLog || mongoose.model("AuditLog", auditLogSchema);
export default AuditLog;


