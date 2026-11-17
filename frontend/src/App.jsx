import { useEffect, useState } from "react";
const API = import.meta.env.VITE_API_URL || "/api";

function Timeline() {
  // The hero moment: one long bar gets cut into vertical clips.
  return (
    <div className="timeline" aria-hidden="true">
      <div className="track"><span className="playhead" /></div>
      <div className="clips">{[0, 1, 2, 3, 4].map((i) => <i key={i} style={{ animationDelay: `${1.2 + i * 0.25}s` }} />)}</div>
    </div>
  );
}

function Steps({ job }) {
  return (
    <section className="panel center">
      <div className="spinner" />
      <h2>{job.stage}</h2>
      <div className="bar"><div style={{ width: `${job.progress}%` }} /></div>
      <p className="muted">{job.progress}% done. Long videos can take a while, you can keep this tab open.</p>
    </section>
  );
}

function Results({ job, onReset }) {
  return (
    <section>
      <div className="row">
        <h2>{job.clips.length} clips ready</h2>
        <div className="row gap">
          <a className="btn" href={`${API}/jobs/${job.id}/zip`}>Download all (ZIP)</a>
          <button className="btn ghost" onClick={onReset}>Make new clips</button>
        </div>
      </div>
      <div className="grid">
        {job.clips.map((c) => (
          <article className="card" key={c.file}>
            <video src={`${API}/jobs/${job.id}/clips/${c.file}`} controls preload="metadata" />
            <p className="title">{c.title}</p>
            <div className="row"><span className="muted">{c.duration}s</span>
              <a className="btn small" href={`${API}/jobs/${job.id}/clips/${c.file}?dl=1`}>Download</a></div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default function App() {
  const [url, setUrl] = useState("");
  const [video, setVideo] = useState(null);
  const count = 10;
  const [job, setJob] = useState(null);
  const [error, setError] = useState("");

  const start = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const r = video
        ? await fetch(`${API}/jobs/upload`, { method: "POST", headers: { "Content-Type": "application/octet-stream", "X-File-Name": encodeURIComponent(video.name), "X-Clip-Count": String(count) }, body: video })
        : await fetch(`${API}/jobs`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ url, clipCount: count }) });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error);
      setJob({ id: d.id, status: "queued", stage: "Starting", progress: 0, clips: [] });
    } catch (err) {
      setError(err.message || "Can't reach the server. Is the backend running?");
    }
  };

  useEffect(() => {
    if (!job || ["done", "error"].includes(job.status)) return;
    const t = setInterval(async () => {
      try { setJob(await (await fetch(`${API}/jobs/${job.id}`)).json()); } catch {}
    }, 2000);
    return () => clearInterval(t);
  }, [job?.id, job?.status]);

  const reset = () => { setJob(null); setUrl(""); setVideo(null); };

  return (
    <main>
      <header className="nav"><b className="logo">Clip<span>Nova</span></b></header>
      {!job && (
        <section className="hero">
          <h1>Hours of video in.<br />Shorts out.</h1>
          <p className="muted">Paste a YouTube link or upload a video. ClipNova transcribes it, ranks the best moments, and turns them into vertical clips.</p>
          <Timeline />
          <form onSubmit={start} className="form">
            <input value={url} onChange={(e) => { setUrl(e.target.value); if (e.target.value) setVideo(null); }} placeholder="https://youtube.com/watch?v=…" required={!video} />
            <label className="upload">Or upload a video
              <input type="file" accept="video/*,.mkv,.avi,.m4v" onChange={(e) => { const f = e.target.files?.[0] || null; setVideo(f); if (f) setUrl(""); }} />
            </label>
            {video && <span className="muted file-name">{video.name}</span>}
            <button className="btn">Get clips</button>
          </form>
          {error && <p className="error">{error}</p>}
        </section>
      )}
      {job && ["queued", "processing"].includes(job.status) && <Steps job={job} />}
      {job?.status === "error" && (
        <section className="panel center"><h2>Something went wrong</h2><p className="error">{job.error}</p><button className="btn" onClick={reset}>Try again</button></section>
      )}
      {job?.status === "done" && <Results job={job} onReset={reset} />}
    </main>
  );
}
