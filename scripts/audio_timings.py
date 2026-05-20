"""
Concatenate per-phrase edge-tts segments into one day lesson MP3 and emit timing cues.

Requires ffmpeg on PATH (used by pydub for MP3 decode/encode).
"""

from __future__ import annotations

import json
import os
import shutil
import tempfile

import edge_tts

try:
    from pydub import AudioSegment
except ImportError as e:
    AudioSegment = None  # type: ignore
    _PYDUB_IMPORT_ERROR = e
else:
    _PYDUB_IMPORT_ERROR = None


def _tts_text_for_phrase(phrase: dict, format_type: str) -> str:
    if format_type == "zh":
        return phrase["zh"] + "。"
    return phrase["en"] + ". "


async def generate_day_lesson_audio_with_timings(
    phrases_dict: dict,
    day: int,
    format_type: str = "zh",
    voice: str | None = None,
) -> None:
    """
    For each phrase: synthesize MP3 via edge-tts, measure duration with pydub,
    concatenate segments, save audio_files/day{day}_{format}.mp3 and
    timing/day{format}/day{day}_{format}.json (flat path timing/day{N}_{lang}.json for web).
    """
    if AudioSegment is None:
        raise RuntimeError(
            "pydub is required for lesson audio timings. pip install pydub "
            "and ensure ffmpeg is installed and on PATH."
        ) from _PYDUB_IMPORT_ERROR

    if voice is None:
        voice = "zh-CN-XiaoxiaoNeural" if format_type == "zh" else "en-US-JennyNeural"

    os.makedirs("audio_files", exist_ok=True)
    os.makedirs("timing", exist_ok=True)

    mp3_path = os.path.join("audio_files", f"day{day}_{format_type}.mp3")
    json_path = os.path.join("timing", f"day{day}_{format_type}.json")

    tmpdir = tempfile.mkdtemp(prefix=f"tts_day{day}_{format_type}_")
    cues: list[dict] = []
    segments: list = []
    idx = 0
    cumulative = 0.0

    try:
        for category, phrase_list in phrases_dict.items():
            for phrase in phrase_list:
                text = _tts_text_for_phrase(phrase, format_type)
                seg_path = os.path.join(tmpdir, f"seg_{idx:04d}.mp3")
                communicate = edge_tts.Communicate(text, voice)
                await communicate.save(seg_path)
                seg = AudioSegment.from_mp3(seg_path)
                dur_sec = len(seg) / 1000.0
                start_sec = cumulative
                cumulative += dur_sec
                cues.append(
                    {
                        "i": idx,
                        "section": category,
                        "start": round(start_sec, 4),
                        "end": round(cumulative, 4),
                    }
                )
                segments.append(seg)
                idx += 1

        if not segments:
            raise ValueError(f"No phrases to synthesize for day {day}")

        combined = segments[0]
        for seg in segments[1:]:
            combined += seg
        combined.export(mp3_path, format="mp3")

        manifest = {"version": 1, "day": day, "lang": format_type, "phrases": cues}
        with open(json_path, "w", encoding="utf-8") as f:
            json.dump(manifest, f, indent=2, ensure_ascii=False)
    finally:
        shutil.rmtree(tmpdir, ignore_errors=True)
