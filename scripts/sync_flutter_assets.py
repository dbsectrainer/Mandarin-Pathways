#!/usr/bin/env python3
"""Copy PWA content assets into flutter_app/assets for offline bundling."""

from __future__ import annotations

import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
ASSETS = ROOT / "flutter_app" / "assets"

COPY_MAP = [
    (ROOT / "audio_files" / "day*.mp3", ASSETS / "audio"),
    (ROOT / "audio_files" / "supplementary", ASSETS / "audio" / "supplementary"),
    (ROOT / "audio_files" / "reading", ASSETS / "audio" / "reading"),
    (ROOT / "audio_files" / "writing", ASSETS / "audio" / "writing"),
    (ROOT / "text_files" / "day*.txt", ASSETS / "text"),
    (ROOT / "text_files" / "supplementary", ASSETS / "text" / "supplementary"),
    (ROOT / "reading_files", ASSETS / "reading"),
    (ROOT / "writing_files", ASSETS / "writing"),
    (ROOT / "timing", ASSETS / "timing"),
]


def copy_glob(src_glob: Path, dest_dir: Path) -> int:
    dest_dir.mkdir(parents=True, exist_ok=True)
    count = 0
    for src in sorted(src_glob.parent.glob(src_glob.name)):
        if src.is_file():
            shutil.copy2(src, dest_dir / src.name)
            count += 1
    return count


def copy_tree(src: Path, dest: Path) -> int:
    if not src.exists():
        print(f"  skip missing: {src}")
        return 0
    if src.is_file():
        dest.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(src, dest)
        return 1
    if dest.exists():
        shutil.rmtree(dest)
    shutil.copytree(src, dest)
    count = sum(1 for p in dest.rglob("*") if p.is_file())
    return count


def main() -> None:
    total = 0
    print("Syncing PWA assets into flutter_app/assets …")
    for src, dest in COPY_MAP:
        if "*" in str(src):
            n = copy_glob(src, dest)
        else:
            n = copy_tree(src, dest)
        print(f"  {src.name}: {n} files -> {dest.relative_to(ROOT)}")
        total += n

    legacy = ASSETS / "text" / "text_files"
    if legacy.exists():
        shutil.rmtree(legacy)
        print(f"  removed legacy duplicate: {legacy.relative_to(ROOT)}")

    print(f"Done. {total} files synced.")


if __name__ == "__main__":
    main()
