import Reveal from "./Reveal";

const features = [
  ["Best moments, found for you", "Scores every part of the transcript for hooks, questions and energy, then picks the strongest 30–60 second moments."],
  ["Animated captions", "Word-by-word subtitles with the spoken word popping in green, burned right into the video."],
  ["Vertical 9:16 export", "1080×1920 MP4 clips, ready for Shorts, Reels and TikTok."],
  ["Built for long videos", "Handles hours of footage by processing it in small chunks, so it doesn't run out of memory."],
  ["Download one or all", "Preview every clip, download it alone, or grab everything as a single ZIP."],
  ["Private by default", "Your clips are deleted from the server automatically after 24 hours."],
];

export default function Features() {
  return (
    <section id="features" className="max-w-[1120px] mx-auto px-6 pt-[100px] pb-5">
      <Reveal>
        <p className="text-accent font-bold text-xs tracking-[.14em] mb-[14px]">FEATURES</p>
        <h2 className="font-display font-bold mb-10" style={{ fontSize: "clamp(2rem,4.5vw,3rem)" }}>Everything you need to clip faster</h2>
      </Reveal>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-5">
        {features.map(([t, d], i) => (
          <Reveal key={t}>
            <article className="bg-card border border-line rounded-3xl p-7 h-full transition-all duration-300 hover:border-accent hover:-translate-y-1">
              <span className="text-accent font-bold text-sm">0{i + 1}</span>
              <h3 className="font-display text-xl mt-2 mb-2">{t}</h3>
              <p className="text-muted leading-relaxed">{d}</p>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
