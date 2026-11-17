"""Fast local clip rendering with full-frame 9:16 composition."""
import os
import subprocess
from typing import Dict, List, Optional

from ..config import LOCAL_OUTPUT_DIR


def _ratio(aspect_ratio: str) -> float:
    try:
        width, height = aspect_ratio.split(":")
        return float(width) / float(height)
    except (ValueError, ZeroDivisionError):
        return 9.0 / 16.0


def crop_clip_local(
    source_path: str,
    start_time: float,
    end_time: float,
    aspect_ratio: str,
    out_path: str,
) -> str:
    """Render one clip in a single FFmpeg pass, preserving the full source frame.

    The source is fitted inside a 9:16 frame so horizontal videos keep their
    whole width instead of losing content to a center crop. 720x1280, 30 FPS,
    a single encode pass, and ultrafast encoding reduce per-clip CPU time.
    """
    ratio = _ratio(aspect_ratio)
    if ratio <= 0:
        ratio = 9.0 / 16.0
    out_width = 720
    out_height = max(2, round((out_width / ratio) / 2) * 2)
    video_filter = (
        f"scale={out_width}:{out_height}:force_original_aspect_ratio=decrease,"
        f"pad={out_width}:{out_height}:(ow-iw)/2:(oh-ih)/2:color=black,"
        "fps=30,setsar=1,format=yuv420p"
    )
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    command = [
        "ffmpeg", "-y", "-hide_banner", "-loglevel", "error",
        "-ss", f"{max(0.0, start_time):.3f}", "-i", source_path,
        "-t", f"{max(0.1, end_time - start_time):.3f}",
        "-vf", video_filter, "-map", "0:v:0", "-map", "0:a?",
        "-c:v", "libx264", "-preset", "ultrafast", "-crf", "25",
        "-c:a", "aac", "-b:a", "96k", "-movflags", "+faststart", out_path,
    ]
    subprocess.run(command, check=True)
    return out_path


def crop_highlights_local(
    source_path: str,
    highlights: List[Dict],
    aspect_ratio: str = "9:16",
    out_dir: Optional[str] = None,
) -> List[Dict]:
    out_dir = out_dir or LOCAL_OUTPUT_DIR
    os.makedirs(out_dir, exist_ok=True)
    results: List[Dict] = []
    for i, highlight in enumerate(highlights, 1):
        out_path = os.path.join(out_dir, f"short_{i:02d}.mp4")
        print(f"[clip/local] {i}/{len(highlights)}: {highlight.get('title', '(untitled)')}", flush=True)
        try:
            crop_clip_local(
                source_path,
                float(highlight["start_time"]),
                float(highlight["end_time"]),
                aspect_ratio,
                out_path,
            )
            results.append({**highlight, "clip_url": out_path})
        except Exception as error:
            print(f"[clip/local] {i} failed: {error}", flush=True)
            results.append({**highlight, "clip_url": None, "error": str(error)})
    return results
