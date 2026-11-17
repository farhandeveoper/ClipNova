import express from "express";
import cors from "cors";
import archiver from "archiver";
import path from "path";
import fs from "fs";
import { pipeline as streamPipeline } from "stream/promises";
import { Transform } from "stream";
import { randomUUID } from "crypto";
import { JOBS_DIR, jobs } from "./jobs.js";
import { runPipeline } from "./pipeline.js";

const app = express();
app.use(cors());
app.use(express.json());

function queueJob(res, source, clipCount = 10, id = randomUUID()) {
  const job = { id, status: "queued", stage: "Queued", progress: 0, clips: [], createdAt: Date.now() };
  jobs.set(id, job);
  runPipeline(job, source, Math.min(15, Math.max(1, Number(clipCount) || 10))).catch((error) => {
    console.error(`Job ${id} failed unexpectedly:`, error);
    Object.assign(job, { status: "error", error: error.message || "The job failed unexpectedly." });
  });
  res.json({ id });
}

app.post("/api/jobs", (req, res) => {
  const { url, clipCount = 10 } = req.body || {};
  if (!/^https?:\/\/(www\.|m\.)?(youtube\.com|youtu\.be)\//.test(url || ""))
    return res.status(400).json({ error: "Please paste a valid YouTube link." });
  queueJob(res, url, clipCount);
});

app.post("/api/jobs/upload", async (req, res, next) => {
  const allowed = new Set([".mp4", ".mov", ".mkv", ".webm", ".avi", ".m4v"]);
  let name;
  try { name = decodeURIComponent(req.get("x-file-name") || "video.mp4"); }
  catch { return res.status(400).json({ error: "Invalid video filename." }); }
  const ext = path.extname(path.basename(name)).toLowerCase();
  if (!allowed.has(ext)) return res.status(400).json({ error: "Choose an MP4, MOV, MKV, WebM, AVI, or M4V video." });
  const maxBytes = 3 * 1024 * 1024 * 1024;
  if (Number(req.get("content-length")) > maxBytes) return res.status(413).json({ error: "Video is too large. Maximum upload size is 3 GB." });

  const id = randomUUID();
  const dir = path.join(JOBS_DIR, id);
  const filePath = path.join(dir, `uploaded${ext}`);
  fs.mkdirSync(dir, { recursive: true });
  let bytes = 0;
  const sizeGuard = new Transform({
    transform(chunk, encoding, callback) {
      bytes += chunk.length;
      callback(bytes > maxBytes ? new Error("Video is too large. Maximum upload size is 3 GB.") : null, chunk);
    },
  });
  try {
    await streamPipeline(req, sizeGuard, fs.createWriteStream(filePath, { flags: "wx" }));
    if (!bytes) throw new Error("The uploaded video is empty.");
    queueJob(res, filePath, req.get("x-clip-count") || 10, id);
  } catch (error) {
    fs.rmSync(dir, { recursive: true, force: true });
    if (!res.headersSent) {
      if (bytes > maxBytes) return res.status(413).json({ error: "Video is too large. Maximum upload size is 3 GB." });
      next(error);
    }
  }
});

app.use((err, req, res, next) => {
  console.error("API request failed:", err);
  if (res.headersSent) return next(err);
  res.status(500).json({ error: "The server could not start this job. Check the backend log for details." });
});

app.get("/api/jobs/:id", (req, res) => {
  const j = jobs.get(req.params.id);
  j ? res.json(j) : res.status(404).json({ error: "Job not found or expired." });
});

app.get("/api/jobs/:id/clips/:file", (req, res) => {
  if (!jobs.has(req.params.id)) return res.sendStatus(404);
  const file = path.join(JOBS_DIR, req.params.id, path.basename(req.params.file));
  req.query.dl ? res.download(file) : res.sendFile(file);
});

app.get("/api/jobs/:id/zip", (req, res) => {
  const j = jobs.get(req.params.id);
  if (!j || j.status !== "done") return res.sendStatus(404);
  res.attachment("ClipNova-clips.zip");
  const zip = archiver("zip", { zlib: { level: 0 } });
  zip.pipe(res);
  j.clips.forEach((c) => zip.file(path.join(JOBS_DIR, j.id, c.file), { name: c.file }));
  zip.finalize();
});

app.listen(process.env.PORT || 5000, () => console.log("ClipNova backend running on :5000"));
