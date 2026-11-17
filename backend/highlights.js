// Picks the most "clip-worthy" 30-60s windows using simple scoring.
const HOOKS = ["secret", "never", "mistake", "truth", "why", "how", "best", "worst", "biggest", "money", "free", "stop", "actually", "imagine", "problem", "simple", "amazing", "important", "सच", "राज़", "गलती", "पैसा"];

function score(sents, i, j, d) {
  const ws = sents.slice(i, j + 1).flat();
  const text = ws.map((w) => w.t).join(" ");
  const low = text.toLowerCase();
  const hooks = HOOKS.filter((h) => low.includes(h)).length;
  const q = (text.match(/\?/g) || []).length, ex = (text.match(/!/g) || []).length;
  const nums = (text.match(/\d+/g) || []).length;
  const energy = Math.min(ws.length / d, 4); // words per second
  const first = sents[i].map((w) => w.t).join(" ").toLowerCase();
  const strongOpen = /\?|^(why|how|what|stop|never|imagine)/.test(first) ? 3 : 0;
  return hooks * 3 + q * 2 + ex * 2 + nums + energy * 2 + strongOpen;
}

export function findHighlights(words, count) {
  const sents = [];
  let cur = [];
  words.forEach((w, i) => {
    cur.push(w);
    const gap = i + 1 < words.length ? words[i + 1].s - w.e : 9;
    if (/[.?!।]$/.test(w.t) || gap > 0.8) { sents.push(cur); cur = []; }
  });
  if (cur.length) sents.push(cur);

  const cands = [];
  for (let i = 0; i < sents.length; i++) {
    for (let j = i; j < sents.length; j++) {
      const start = sents[i][0].s, end = sents[j].at(-1).e, d = end - start;
      if (d > 60) break;
      if (d >= 30) cands.push({ start, end, score: score(sents, i, j, d), title: sents[i].slice(0, 7).map((w) => w.t).join(" ") });
    }
  }
  cands.sort((a, b) => b.score - a.score);
  const picked = [];
  for (const c of cands) {
    if (picked.length >= count) break;
    if (picked.every((p) => c.start > p.end + 5 || c.end < p.start - 5)) picked.push(c);
  }
  return picked.sort((a, b) => a.start - b.start).map((c) => ({ ...c, start: Math.max(0, c.start - 0.2), end: c.end + 0.3 }));
}
