import "./Nav.css";

const links = [["Features", "#features"], ["How it works", "#how"], ["Pricing", "#pricing"], ["FAQ", "#faq"]];

export default function Nav() {
  return (
    <header className="sticky top-0 z-10 bg-black/80 backdrop-blur-md border-b border-line">
      <div className="max-w-[1120px] mx-auto px-6 flex items-center justify-between h-[68px]">
        <a className="font-display font-extrabold text-2xl tracking-tight" href="#top">
          Clip<span className="text-accent">Nova</span>
        </a>
        <nav className="hidden md:flex gap-8">
          {links.map(([t, h]) => <a key={h} href={h} className="nav-link">{t}</a>)}
        </nav>
        <a className="bg-accent text-black font-bold rounded-full px-[18px] py-[9px] text-sm hover:-translate-y-0.5 transition-transform" href="#top">
          Get clips
        </a>
      </div>
    </header>
  );
}
