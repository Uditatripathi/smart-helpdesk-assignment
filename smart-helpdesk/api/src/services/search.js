import Article from "../models/Article.js";

export async function searchKB(query, limit = 10) {
  if (!query || !query.trim()) {
    return await Article.find({}).sort({ updatedAt: -1 }).limit(limit);
  }

  const hasTextIndex = true;
  try {
    const results = await Article.find({ $text: { $search: query } }, { score: { $meta: "textScore" } })
      .sort({ score: { $meta: "textScore" } })
      .limit(limit);
    if (results.length > 0) return results;
  } catch (_e) {
    // fallthrough to regex
  }

  return await Article.find({
    $or: [
      { title: { $regex: query, $options: "i" } },
      { body: { $regex: query, $options: "i" } }
    ]
  }).limit(limit);
}


