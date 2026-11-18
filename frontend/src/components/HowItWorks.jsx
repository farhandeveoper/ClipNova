import Reveal from "./Reveal";

const steps = [
  ["Paste a link", "Drop any YouTube URL into the input and choose how many clips you want."],
  ["AI finds highlights", "ClipNova transcribes the audio and scores every segment for hooks, energy and questions."],
  ["Download your clips", "Vertical 9:16 MP4s with animated captions are ready to post in minutes."],
];

export default function HowItWorks() {
  return (
    <section id="how" className="max-w-[1120px] mx-auto px-6 pt-[100px] pb-5">
      <Reveal>
        <p className="text-accent font-bold text-xs tracking-[.14em] mb-[14px]">HOW IT WORKS</p>
        <h2 className="font-display font-bold mb-10" style={{ fontSize: "clamp(2rem,4.5vw,3rem)" }}>Three steps to viral clips</h2>
      </Reveal>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-5">
        {steps.map(([t, d], i) => (
          <Reveal key={t}>
            <article className="bg-card border border-line rounded-3xl p-7 h-full transition-all duration-300 hover:border-accent hover:-translate-y-1">
              <div className="grid place-items-center w-11 h-11 rounded-full bg-accent text-black font-bold text-lg mb-4">{i + 1}</div>
              <h3 className="font-display text-xl mb-2">{t}</h3>
              <p className="text-muted leading-relaxed">{d}</p>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
