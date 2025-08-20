import mongoose from "mongoose";

const configSchema = new mongoose.Schema({
  autoCloseEnabled: { type: Boolean, default: true },
  confidenceThreshold: { type: Number, default: 0.78 },
  slaHours: { type: Number, default: 24 }
}, { timestamps: true });

const Config = mongoose.models.Config || mongoose.model("Config", configSchema);
export default Config;


