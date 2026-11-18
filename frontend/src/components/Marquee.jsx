const items = ["YouTube Shorts", "TikTok", "Instagram Reels", "Facebook Reels", "LinkedIn Video", "X Video"];

export default function Marquee() {
  return (
    <div className="overflow-hidden border-y border-line py-[22px]" aria-label="Made for short-form platforms">
      <div className="marquee-track">
        {[...items, ...items, ...items, ...items].map((t, i) => (
          <span key={i} className="font-display font-bold text-[1.3rem] text-[#555] whitespace-nowrap">{t}</span>
        ))}
      </div>
    </div>
  );
}
