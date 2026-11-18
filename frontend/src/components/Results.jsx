import { API } from "../api";
import "./Results.css";

export default function Results({ job, onReset }) {
  return (
    <section className="max-w-[1120px] mx-auto px-6 pt-[60px] pb-10">
      <div className="flex justify-between items-center flex-wrap gap-3 mb-6">
        <h2 className="font-display font-bold text-3xl">{job.clips.length} clips ready</h2>
        <div className="flex gap-3 flex-wrap">
          <a className="bg-accent text-black font-bold rounded-full px-7 py-3 hover:-translate-y-0.5 hover:shadow-[0_8px_30px_#22d36b44] transition-all" href={`${API}/jobs/${job.id}/zip`}>
            Download all (ZIP)
          </a>
          <button className="bg-transparent text-white border border-[#3a3a3a] font-bold rounded-full px-7 py-3 hover:border-white transition-all" onClick={onReset}>
            Make new clips
          </button>
        </div>
      </div>
      <p className="text-muted text-sm">Your clips stay here until you choose “Make new clips.” That removes this job’s files from the server.</p>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-5 mt-6">
        {job.clips.map((c) => (
          <article className="bg-card border border-line rounded-[18px] p-3 hover:border-accent hover:-translate-y-1 transition-all duration-300" key={c.file}>
            <video className="clip-video" src={`${API}/jobs/${job.id}/clips/${c.file}`} controls preload="metadata" />
            <p className="text-sm leading-snug min-h-[2.7em] mt-2">{c.title}…</p>
            <div className="flex justify-between items-center mt-2">
              <span className="text-muted text-sm">{c.duration}s</span>
              <a className="bg-accent text-black font-bold rounded-full px-[18px] py-[9px] text-sm hover:-translate-y-0.5 transition-transform" href={`${API}/jobs/${job.id}/clips/${c.file}?dl=1`}>
                Download
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
