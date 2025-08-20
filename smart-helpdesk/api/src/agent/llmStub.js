const KEYWORDS = [
  { category: "billing", terms: ["invoice","payment","bill","refund","price"] },
  { category: "tech", terms: ["error","bug","crash","install","login","network","server"] },
  { category: "shipping", terms: ["shipment","delivery","address","tracking","package"] }
];

export function classify(text) {
  const lower = (text || "").toLowerCase();
  let best = { predictedCategory: "other", confidence: 0.5 };
  for (const { category, terms } of KEYWORDS) {
    const hits = terms.reduce((n, t) => n + (lower.includes(t) ? 1 : 0), 0);
    if (hits > 0) {
      const conf = Math.min(0.95, 0.6 + hits * 0.1);
      if (conf > best.confidence) best = { predictedCategory: category, confidence: conf };
    }
  }
  return best;
}

export function draft(query, articles) {
  const top = (articles && articles.length > 0) ? articles[0] : null;
  const draftReply = top
    ? `Based on our knowledge base article "${top.title}", here is a suggested answer: ${top.body.slice(0, 200)}...`
    : `Thanks for reaching out. We are reviewing your request: "${(query||"").slice(0, 140)}".`;
  return { draftReply };
}


