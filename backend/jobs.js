import fs from "fs";
import path from "path";
export const JOBS_DIR = path.resolve("jobs");
export const jobs = new Map();
fs.mkdirSync(JOBS_DIR, { recursive: true });
// Auto-delete jobs older than 24 hours
setInterval(() => {
  for (const [id, j] of jobs) {
    if (Date.now() - j.createdAt > 24 * 3600 * 1000) {
      fs.rmSync(path.join(JOBS_DIR, id), { recursive: true, force: true });
      jobs.delete(id);
    }
  }
}, 30 * 60 * 1000);
