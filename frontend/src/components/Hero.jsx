import { useState } from "react";
import "./Hero.css";

export default function Hero({ onSubmit, error }) {
  const [url, setUrl] = useState("");
  const [count, setCount] = useState(10);
  return (
    <section id="top" className="hero-anim max-w-[1120px] mx-auto px-6 pt-[110px] pb-[70px] text-center">
      <p className="text-accent font-bold text-xs tracking-[.14em] mb-[14px]">AI VIDEO CLIPPING TOOL</p>
      <h1 className="font-display font-extrabold leading-[1.02] max-w-[900px] mx-auto mb-[22px]" style={{ fontSize: "clamp(2.8rem,8vw,5.8rem)" }}>
        Turn long videos into <em className="hero-em">viral shorts</em>
      </h1>
      <p className="text-muted text-lg max-w-[600px] mx-auto mb-9">
        Paste a YouTube link. ClipNova finds the best moments and exports vertical clips with animated captions, ready to post.
      </p>
      <form className="hero-form" onSubmit={(e) => { e.preventDefault(); onSubmit(url, count); }}>
        <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Drop a YouTube link here…" required />
        <select value={count} onChange={(e) => setCount(e.target.value)} aria-label="Number of clips">
          {[5, 10, 15].map((n) => <option key={n} value={n}>{n} clips</option>)}
        </select>
        <button className="bg-accent text-black font-bold rounded-full px-7 py-3 hover:-translate-y-0.5 hover:shadow-[0_8px_30px_#22d36b44] transition-all">
          Get clips
        </button>
      </form>
      {error && <p className="text-danger mt-4">{error}</p>}
      <ul className="flex gap-[10px] justify-center flex-wrap list-none p-0 mt-7">
        {["5–10 hour videos", "Word-by-word captions", "1080×1920 export"].map((t) => (
          <li key={t} className="border border-line rounded-full px-4 py-1.5 text-muted text-sm">{t}</li>
        ))}
      </ul>
    </section>
  );
}
