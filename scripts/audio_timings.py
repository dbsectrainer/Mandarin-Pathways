"""
Stitch edge-tts MP3 segments and emit cue JSON for audio–text synchronization.

Requires ffmpeg on PATH (pydub decodes MP3 segments).
"""

from __future__ import annotations

import json
import os
import re
import shutil
import tempfile
from typing import Any

import edge_tts

try:
    from pydub import AudioSegment
except ImportError as e:
    AudioSegment = None  # type: ignore
    _PYDUB_IMPORT_ERROR = e
else:
    _PYDUB_IMPORT_ERROR = None


def _ensure_pydub():
    if AudioSegment is None:
        raise RuntimeError(
            "pydub is required for lesson audio timings. pip install pydub "
            "and ensure ffmpeg is installed and on PATH."
        ) from _PYDUB_IMPORT_ERROR


def _tts_text_for_phrase(phrase: dict, format_type: str) -> str:
    if format_type == "zh":
        return phrase["zh"] + "。"
    return phrase["en"] + ". "


def ensure_sentence_tts_punctuation(segment: str, fmt: str) -> str:
    """Append closing punctuation suitable for Edge TTS if missing."""
    s = segment.strip()
    if not s:
        return s
    fmt = fmt.lower()
    if fmt == "zh":
        if s[-1] not in "。！？":
            s += "。"
        return s
    if s[-1] not in ".!?":
        s += "."
    return s


def split_reading_passage(text: str, lang: str) -> list[str]:
    """
    Split reading body text into TTS-aligned chunks (sentence-like).
    Must match LessonAudioSync.splitReadingSegments in js/lesson-audio-sync.js.
    """
    t = text.strip()
    if not t:
        return []
    lang = lang.lower()
    if lang == "zh":
        parts = re.findall(r"[^。！？]+[。！？]?", t)
        return [p.strip() for p in parts if p.strip()]
    # English and reading "pinyin" Latin lines end with Latin punctuation.
    parts = re.split(r"(?<=[.!?])\s+", t)
    return [p.strip() for p in parts if p.strip()]


async def concatenate_tts_segments(
    segment_jobs: list[tuple[str, dict]],
    voice: str,
    output_mp3: str,
    output_json: str,
    *,
    manifest_extra: dict[str, Any] | None = None,
) -> None:
    """
    segment_jobs: list of (tts_text, cue_metadata_dict_without start/end/i).
    Cue index i is the job order (overwrites any incoming i).
    """
    _ensure_pydub()

    if not segment_jobs:
        raise ValueError("segment_jobs cannot be empty")

    out_mp3_dir = os.path.dirname(output_mp3)
    out_json_dir = os.path.dirname(output_json)
    if out_mp3_dir:
        os.makedirs(out_mp3_dir, exist_ok=True)
    if out_json_dir:
        os.makedirs(out_json_dir, exist_ok=True)

    tmpdir = tempfile.mkdtemp(prefix="tts_concat_")
    cues: list[dict] = []
    segments_audio: list = []
    cumulative = 0.0

    try:
        for idx, (tts_raw, meta) in enumerate(segment_jobs):
            merged = dict(meta)
            merged["i"] = idx
            seg_path = os.path.join(tmpdir, f"seg_{idx:04d}.mp3")
            communicate = edge_tts.Communicate(tts_raw, voice)
            await communicate.save(seg_path)
            seg = AudioSegment.from_mp3(seg_path)
            dur_sec = len(seg) / 1000.0
            start_sec = cumulative
            cumulative += dur_sec
            merged["start"] = round(start_sec, 4)
            merged["end"] = round(cumulative, 4)
            cues.append(merged)
            segments_audio.append(seg)

        combined = segments_audio[0]
        for seg in segments_audio[1:]:
            combined += seg
        combined.export(output_mp3, format="mp3")

        manifest = {"version": 1, "phrases": cues}
        if manifest_extra:
            manifest.update(manifest_extra)

        with open(output_json, "w", encoding="utf-8") as f:
            json.dump(manifest, f, indent=2, ensure_ascii=False)
    finally:
        shutil.rmtree(tmpdir, ignore_errors=True)


async def generate_day_lesson_audio_with_timings(
    phrases_dict: dict,
    day: int,
    format_type: str = "zh",
    voice: str | None = None,
) -> None:
    if voice is None:
        voice = "zh-CN-XiaoxiaoNeural" if format_type == "zh" else "en-US-JennyNeural"

    os.makedirs("audio_files", exist_ok=True)
    mp3_path = os.path.join("audio_files", f"day{day}_{format_type}.mp3")
    json_path = os.path.join("timing", f"day{day}_{format_type}.json")

    jobs: list[tuple[str, dict]] = []
    for category, phrase_list in phrases_dict.items():
        for phrase in phrase_list:
            jobs.append(
                (_tts_text_for_phrase(phrase, format_type), {"section": category})
            )

    if not jobs:
        raise ValueError(f"No phrases to synthesize for day {day}")

    await concatenate_tts_segments(
        jobs,
        voice,
        mp3_path,
        json_path,
        manifest_extra={"day": day, "lang": format_type},
    )


async def generate_supplementary_audio_with_timings(
    phrases_dict: dict,
    category: str,
    format_type: str = "zh",
    voice: str | None = None,
) -> None:
    if voice is None:
        voice = "zh-CN-XiaoxiaoNeural" if format_type == "zh" else "en-US-JennyNeural"

    os.makedirs("audio_files/supplementary", exist_ok=True)
    os.makedirs("timing/supplementary", exist_ok=True)

    mp3_path = os.path.join("audio_files/supplementary", f"{category}_{format_type}.mp3")
    json_path = os.path.join("timing/supplementary", f"{category}_{format_type}.json")

    jobs: list[tuple[str, dict]] = []
    for subcategory, phrase_list in phrases_dict.items():
        for phrase in phrase_list:
            jobs.append(
                (_tts_text_for_phrase(phrase, format_type), {"section": subcategory})
            )

    if not jobs:
        raise ValueError(f"No supplementary phrases for category {category}")

    await concatenate_tts_segments(
        jobs,
        voice,
        mp3_path,
        json_path,
        manifest_extra={"category": category, "lang": format_type},
    )


async def generate_reading_audio_with_timings(
    reading_passage_text: str,
    level: str,
    topic: str,
    format_type: str = "zh",
    voice: str | None = None,
) -> None:
    slug = topic.lower().replace(" ", "_")
    if voice is None:
        voice = "zh-CN-XiaoxiaoNeural" if format_type == "zh" else "en-US-AriaNeural"

    os.makedirs("audio_files/reading", exist_ok=True)
    os.makedirs("timing/reading", exist_ok=True)

    mp3_path = os.path.join(
        "audio_files/reading", f"{level}_{slug}_{format_type}.mp3"
    )
    json_path = os.path.join("timing/reading", f"{level}_{slug}_{format_type}.json")

    sentences = split_reading_passage(reading_passage_text, format_type)
    jobs: list[tuple[str, dict]] = [
        (ensure_sentence_tts_punctuation(s, format_type), {"section": "reading"})
        for s in sentences
    ]

    if not jobs:
        raise ValueError(f"No reading sentences for {level}/{topic}")

    await concatenate_tts_segments(
        jobs,
        voice,
        mp3_path,
        json_path,
        manifest_extra={
            "level": level,
            "topic": slug,
            "lang": format_type,
            "kind": "reading",
        },
    )


async def generate_writing_audio_with_timings(
    activity_content: dict,
    activity_type: str,
    level: str,
    format_type: str = "zh",
    voice: str | None = None,
) -> None:
    slug = level.lower().replace(" ", "_")
    if voice is None:
        voice = "zh-CN-XiaoxiaoNeural" if format_type == "zh" else "en-US-AriaNeural"

    title_parts = activity_content["title"].split(" / ")
    if format_type == "zh":
        head_raw = title_parts[0].strip()
    else:
        head_raw = (
            title_parts[1].strip()
            if len(title_parts) > 1
            else title_parts[0].strip()
        )
    desc_raw = activity_content["description"].strip()

    seg0 = ensure_sentence_tts_punctuation(head_raw, format_type)
    seg1 = ensure_sentence_tts_punctuation(desc_raw, format_type)

    jobs = [
        (seg0, {"section": "title"}),
        (seg1, {"section": "description"}),
    ]

    os.makedirs("audio_files/writing", exist_ok=True)
    os.makedirs("timing/writing", exist_ok=True)

    mp3_path = os.path.join(
        "audio_files/writing", f"{activity_type}_{slug}_{format_type}.mp3"
    )
    json_path = os.path.join("timing/writing", f"{activity_type}_{slug}_{format_type}.json")

    await concatenate_tts_segments(
        jobs,
        voice,
        mp3_path,
        json_path,
        manifest_extra={
            "activity_type": activity_type,
            "level": slug,
            "lang": format_type,
            "kind": "writing",
        },
    )
