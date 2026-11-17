import fs from "fs";
import path from "path";
import { spawn } from "child_process";
import { fileURLToPath } from "url";
import { JOBS_DIR } from "./jobs.js";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../AI-Youtube-Shorts-Generator");

function pythonCommand() {
  const venvPython = path.join(ROOT, "venv", "Scripts", "python.exe");
  if (fs.existsSync(venvPython)) return [venvPython, []];
  return process.platform === "win32" ? ["py", []] : ["python3", []];
}

function runGenerator(job, url, count, dir) {
  const [python, prefix] = pythonCommand();
  const resultPath = path.join(dir, "result.json");
  const outputDir = path.join(dir, "generated");
  fs.mkdirSync(outputDir, { recursive: true });
  const args = [...prefix, "main.py", url, "--mode", "local", "--num-clips", String(count), "--aspect-ratio", "9:16", "--output-json", resultPath];
  return new Promise((resolve, reject) => {
    const child = spawn(python, args, {
      cwd: ROOT,
      env: { ...process.env, LOCAL_OUTPUT_DIR: outputDir },
      windowsHide: true,
    });
    let stderr = "";
    child.stderr.on("data", (chunk) => { stderr += chunk.toString(); });
    child.stdout.on("data", (chunk) => {
      const line = chunk.toString();
      if (/download\/local/i.test(line)) Object.assign(job, { stage: "Downloading video", progress: 8 });
      else if (/transcri/i.test(line)) Object.assign(job, { stage: "Transcribing long video", progress: 30 });
      else if (/highlight|classif|chunk/i.test(line)) Object.assign(job, { stage: "Finding the best moments", progress: 65 });
      else if (/cropping|clip\/local/i.test(line)) Object.assign(job, { stage: "Creating vertical clips", progress: 82 });
    });
    child.on("error", (error) => reject(new Error(`Could not start the shorts generator (${python}): ${error.message}`)));
    child.on("close", (code) => {
      if (code !== 0) return reject(new Error(stderr.trim().slice(-1200) || "Shorts generator failed. Check the backend log."));
      try {
        const result = JSON.parse(fs.readFileSync(resultPath, "utf8"));
        const clips = result.shorts.filter((clip) => clip.clip_url && fs.existsSync(clip.clip_url)).map((clip, i) => {
          const file = `clip${i + 1}.mp4`;
          fs.copyFileSync(clip.clip_url, path.join(dir, file));
          return { file, title: clip.title || clip.hook_sentence || `Short ${i + 1}`, duration: Math.round(Number(clip.end_time) - Number(clip.start_time)), score: clip.score };
        });
        if (!clips.length) {
          const failures = result.shorts.map((clip) => clip.error).filter(Boolean);
          return reject(new Error(failures.length
            ? `No clips rendered: ${failures.join("; ").slice(0, 900)}`
            : "The generator returned no usable clip files."));
        }
        resolve(clips);
      } catch (error) { reject(new Error(`Could not read generated clips: ${error.message}`)); }
    });
  });
}

export async function runPipeline(job, url, count) {
  const dir = path.join(JOBS_DIR, job.id);
  try {
    fs.mkdirSync(dir, { recursive: true });
    Object.assign(job, { status: "processing", stage: "Starting local AI generator", progress: 3 });
    const clips = await runGenerator(job, url, count, dir);
    Object.assign(job, { clips, status: "done", stage: "Done", progress: 100 });
    fs.rmSync(path.join(dir, "generated"), { recursive: true, force: true });
    fs.rmSync(path.join(dir, "result.json"), { force: true });
  } catch (error) {
    Object.assign(job, { status: "error", error: error.message });
  }
}
