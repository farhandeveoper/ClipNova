"""Simple offline highlight ranking for installs without an LLM API key."""
import re
from typing import Dict, List


HOOK_CUES = {
    "secret", "nobody", "never", "mistake", "wrong", "truth", "actually",
    "imagine", "surprising", "surprise", "shocking", "first", "why", "how",
}
EMOTION_CUES = {
    "love", "hate", "afraid", "scared", "excited", "angry", "funny",
    "laugh", "cried", "amazing", "terrible", "best", "worst", "crazy",
    "beautiful", "sad", "incredible",
}
VALUE_CUES = {
    "tip", "learn", "step", "method", "important", "remember", "problem",
    "solution", "improve", "money", "health", "business", "because", "result",
}


def find_heuristic_highlights(transcript: Dict, num_clips: int) -> List[Dict]:
    """Rank speech windows using transcript density and hook/value/emotion cues."""
    segments = [
        s for s in transcript.get("segments", [])
        if str(s.get("text", "")).strip() and float(s.get("end", 0)) > float(s.get("start", 0))
    ]
    if not segments:
        return []

    duration = max(float(s["end"]) for s in segments)
    window = min(60.0, duration)
    if window < 20:
        window = duration
    stride = max(15.0, window / 2)
    max_start = max(0.0, duration - window)
    starts = list(range(0, int(max_start) + 1, int(stride)))
    if not starts or starts[-1] < max_start:
        starts.append(max_start)

    candidates = []
    for start in starts:
        end = min(duration, start + window)
        selected = [
            s for s in segments
            if float(s["end"]) > start and float(s["start"]) < end
        ]
        text = " ".join(str(s.get("text", "")).strip() for s in selected).strip()
        words = re.findall(r"[\w']+", text.lower())
        if len(words) < 12:
            continue

        word_set = set(words)
        hook_hits = len(word_set & HOOK_CUES)
        emotion_hits = len(word_set & EMOTION_CUES)
        value_hits = len(word_set & VALUE_CUES)
        density = min(20, int(len(words) / max(1, end - start) * 8))
        score = min(100, 35 + density + hook_hits * 7 + emotion_hits * 5 + value_hits * 4)

        first_sentence = re.split(r"(?<=[.!?])\s+", text, maxsplit=1)[0].strip()
        hook = first_sentence[:180] or text[:180]
        title = " ".join(re.findall(r"\S+", hook)[:10]).strip(" ,.!?") or "Highlight"
        candidates.append({
            "title": title,
            "start_time": round(start, 2),
            "end_time": round(end, 2),
            "score": score,
            "hook_sentence": hook,
            "virality_reason": "Ranked locally by speech density and hook, emotion, and practical-value cues.",
        })

    candidates.sort(key=lambda item: item["score"], reverse=True)
    selected = []
    for candidate in candidates:
        overlaps = any(
            min(candidate["end_time"], item["end_time"])
            - max(candidate["start_time"], item["start_time"])
            > 0.25 * min(
                candidate["end_time"] - candidate["start_time"],
                item["end_time"] - item["start_time"],
            )
            for item in selected
        )
        if not overlaps:
            selected.append(candidate)
            if len(selected) >= num_clips:
                break
    return selected
