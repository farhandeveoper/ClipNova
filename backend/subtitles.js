// Builds an .ass subtitle file: 3 words at a time, current word pops in gold.
const ts = (t) => {
  const h = Math.floor(t / 3600), m = Math.floor((t % 3600) / 60), s = (t % 60).toFixed(2);
  return `${h}:${String(m).padStart(2, "0")}:${s.padStart(5, "0")}`;
};

export function buildAss(words, start, end) {
  const ws = words.filter((w) => w.s >= start - 0.05 && w.e <= end + 0.3);
  let out = `[Script Info]
ScriptType: v4.00+
PlayResX: 1080
PlayResY: 1920

[V4+ Styles]
Format: Name,Fontname,Fontsize,PrimaryColour,SecondaryColour,OutlineColour,BackColour,Bold,Italic,Underline,StrikeOut,ScaleX,ScaleY,Spacing,Angle,BorderStyle,Outline,Shadow,Alignment,MarginL,MarginR,MarginV,Encoding
Style: Default,Arial,84,&H00FFFFFF,&H00FFFFFF,&H00000000,&H64000000,-1,0,0,0,100,100,0,0,1,6,2,2,60,60,520,1

[Events]
Format: Layer,Start,End,Style,Name,MarginL,MarginR,MarginV,Effect,Text
`;
  for (let g = 0; g < ws.length; g += 3) {
    const grp = ws.slice(g, g + 3);
    grp.forEach((w, k) => {
      const a = Math.max(0, w.s - start);
      const b = k + 1 < grp.length ? grp[k + 1].s - start : w.e - start + 0.15;
      const text = grp.map((x, m) => (m === k ? `{\\c&H00D7FF&\\fscx120\\fscy120}${x.t.toUpperCase()}{\\r}` : x.t.toUpperCase())).join(" ");
      out += `Dialogue: 0,${ts(a)},${ts(b)},Default,,0,0,0,,${text}\n`;
    });
  }
  return out;
}
