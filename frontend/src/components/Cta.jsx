import Reveal from "./Reveal";

export default function Cta() {
  return (
    <section className="max-w-[1120px] mx-auto px-6 pt-[100px] pb-5">
      <Reveal className="text-center border border-line rounded-[32px] px-6 py-[72px] bg-[radial-gradient(500px_200px_at_50%_0,#22d36b22,transparent),#0d0d0d]">
        <h2 className="font-display font-bold max-w-[640px] mx-auto mb-7" style={{ fontSize: "clamp(2rem,4.5vw,3rem)" }}>
          Your next video is a week of posts.
        </h2>
        <a className="bg-accent text-black font-bold rounded-full px-7 py-3 hover:-translate-y-0.5 hover:shadow-[0_8px_30px_#22d36b44] transition-all inline-block" href="#top">
          Get clips
        </a>
      </Reveal>
    </section>
  );
}
