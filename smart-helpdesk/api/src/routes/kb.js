import express from "express";
import Article from "../models/Article.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { articleSchema } from "../validation/schemas.js";
import { searchKB } from "../services/search.js";

const router = express.Router();

router.get("/", requireAuth, async (req, res) => {
  const q = req.query.query || "";
  const results = await searchKB(q, 10);
  res.json(results);
});

router.post("/", requireAuth, requireRole("admin"), async (req, res) => {
  const { value, error } = articleSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.message });
  const article = await Article.create(value);
  res.status(201).json(article);
});

router.put("/:id", requireAuth, requireRole("admin"), async (req, res) => {
  const { value, error } = articleSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.message });
  const updated = await Article.findByIdAndUpdate(req.params.id, value, { new: true });
  res.json(updated);
});

router.delete("/:id", requireAuth, requireRole("admin"), async (req, res) => {
  await Article.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

export default router;
