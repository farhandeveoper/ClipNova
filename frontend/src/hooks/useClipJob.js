import { useEffect, useState } from "react";
import { API } from "../api";

export default function useClipJob() {
  const [job, setJob] = useState(null);
  const [error, setError] = useState("");

  const start = async (url, clipCount) => {
    setError("");
    try {
      const r = await fetch(`${API}/jobs`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ url, clipCount }) });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error);
      setJob({ id: d.id, status: "queued", stage: "Starting", progress: 0, clips: [] });
    } catch (e) {
      setError(e.message || "Can't reach the server. Is the backend running?");
    }
  };

  useEffect(() => {
    if (!job || ["done", "error"].includes(job.status)) return;
    const t = setInterval(async () => {
      try { setJob(await (await fetch(`${API}/jobs/${job.id}`)).json()); } catch {}
    }, 2000);
    return () => clearInterval(t);
  }, [job?.id, job?.status]);

  const reset = async () => {
    setError("");
    if (job?.id) {
      try {
        const response = await fetch(`${API}/jobs/${job.id}`, { method: "DELETE" });
        if (!response.ok && response.status !== 404) {
          throw new Error("The server could not delete this job's files.");
        }
      } catch {
        setError("Could not delete the previous clips from the server. Please try again.");
      }
    }
    setJob(null);
  };

  return { job, error, start, reset };
}
