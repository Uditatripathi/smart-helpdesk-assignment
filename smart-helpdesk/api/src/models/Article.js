import mongoose from "mongoose";

const articleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  body: { type: String, required: true },
  tags: { type: [String], default: [] },
  status: { type: String, enum: ["draft","published"], default: "draft" }
}, { timestamps: true });

articleSchema.index({ title: "text", body: "text" });

const Article = mongoose.models.Article || mongoose.model("Article", articleSchema);
export default Article;


