import Reveal from "./Reveal";
import "./Pricing.css";

const plans = [
  { name: "Free", price: "$0", note: "Try it out", items: ["3 videos per month", "Up to 20 min per video", "Animated captions"] },
  { name: "Pro", price: "$15", note: "For creators", items: ["30 videos per month", "Up to 10 hours per video", "15 clips per video", "Priority processing"], hot: true },
  { name: "Business", price: "$49", note: "For teams", items: ["Unlimited videos", "Up to 10 hours per video", "Priority processing", "Email support"] },
];

export default function Pricing() {
  return (
    <section id="pricing" className="max-w-[1120px] mx-auto px-6 pt-[100px] pb-5">
      <Reveal>
        <p className="text-accent font-bold text-xs tracking-[.14em] mb-[14px]">PRICING</p>
        <h2 className="font-display font-bold mb-10" style={{ fontSize: "clamp(2rem,4.5vw,3rem)" }}>Simple plans that grow with you</h2>
      </Reveal>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-5">
        {plans.map((p) => (
          <Reveal key={p.name}>
            <article className={`relative flex flex-col bg-card border rounded-3xl p-7 h-full transition-all duration-300 hover:-translate-y-1 ${p.hot ? "border-accent" : "border-line hover:border-accent"}`}>
              {p.hot && <span className="absolute -top-[13px] left-6 bg-accent text-black rounded-full px-[14px] py-[3px] text-xs font-bold">Most popular</span>}
              <h3 className="font-display text-xl">{p.name}</h3>
              <p className="font-display font-extrabold text-5xl mt-2">
                {p.price}<small className="text-base text-muted font-normal">/mo</small>
              </p>
              <p className="text-muted mt-1">{p.note}</p>
              <ul className="plan-list">
                {p.items.map((item) => <li key={item}>{item}</li>)}
              </ul>
              <a className={`text-center rounded-full px-7 py-3 font-bold transition-all hover:-translate-y-0.5 ${p.hot ? "bg-accent text-black hover:shadow-[0_8px_30px_#22d36b44]" : "bg-transparent text-white border border-[#3a3a3a] hover:border-white"}`} href="#top">
                Get started
              </a>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
