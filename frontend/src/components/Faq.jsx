import Reveal from "./Reveal";
import "./Faq.css";

const faqs = [
  ["Which videos can I use?", "Any public YouTube link. Please only use videos you own or have permission to use."],
  ["How long does it take?", "It depends on the video length and your server. A long video can take from several minutes to a few hours. You can see live progress."],
  ["Does it work with Hindi videos?", "Yes. The speech engine detects the language automatically, including Hindi and English."],
  ["How long are the clips?", "Each clip is 30 to 60 seconds, cut at sentence boundaries so it never stops mid-sentence."],
  ["How long are my clips kept?", "Clips are deleted automatically after 24 hours, so download what you need."],
];

export default function Faq() {
  return (
    <section id="faq" className="max-w-[760px] mx-auto px-6 pt-[100px] pb-5">
      <Reveal>
        <p className="text-accent font-bold text-xs tracking-[.14em] mb-[14px]">FAQ</p>
        <h2 className="font-display font-bold mb-10" style={{ fontSize: "clamp(2rem,4.5vw,3rem)" }}>Questions, answered</h2>
      </Reveal>
      <Reveal>
        {faqs.map(([q, a]) => (
          <details key={q}>
            <summary className="font-display font-semibold text-lg">{q}</summary>
            <p className="text-muted mt-3 leading-relaxed">{a}</p>
          </details>
        ))}
      </Reveal>
    </section>
  );
}
