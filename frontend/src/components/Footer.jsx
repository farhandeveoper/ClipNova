export default function Footer() {
  return (
    <footer className="max-w-[1120px] mx-auto px-6 flex justify-between flex-wrap gap-3 py-[60px] mt-20 border-t border-line">
      <b className="font-display font-extrabold text-2xl tracking-tight">Clip<span className="text-accent">Nova</span></b>
      <span className="text-muted">© {new Date().getFullYear()} ClipNova. All rights reserved.</span>
    </footer>
  );
}
