# Copilot Instructions for Mandarin Pathways

## Project Overview
Mandarin Pathways is a modular Mandarin Chinese learning platform with a 40-day curriculum. It combines interactive web lessons, audio, video, reading, and writing practice. The project is a hybrid of static web content (HTML/CSS/JS), Python scripts for content generation, and PWA features for offline use.

## Key Components & Structure
- **Web App:**
  - `index.html`, `day.html`, `reading.html`, `writing.html`, `supplementary.html`: Main user interfaces.
  - `css/`, `js/`: Styles and interactive logic. E.g., `character-drawing.js` for writing practice, `video-loader.js` for YouTube integration.
  - `audio_files/`, `text_files/`, `reading_files/`, `writing_files/`: Content assets, organized by lesson/day.
  - `videos.json`, `videos_supplementary.json`: Maps lessons to YouTube video IDs.
  - `manifest.json`, `sw.js`: PWA configuration and service worker for offline support.
- **Python Scripts:**
  - `mandarin_phrases_days_*.py`, `mandarin_phrases_supplementary.py`: Generate lesson content and assets.
  - `reading_activities.py`, `writing_activities.py`: Generate reading/writing exercises.
  - `video_search.py`: Utility for managing YouTube video data.

## Developer Workflows
- **Content Generation:**
  - Run Python scripts to (re)generate lesson and practice content:
    ```bash
    python mandarin_phrases_days_01_07.py
    python mandarin_phrases_days_08_14.py
    ...
    python mandarin_phrases_supplementary.py
    ```
- **Web App Testing:**
  - Serve locally for PWA features:
    ```bash
    python -m http.server 8000
    # Open http://localhost:8000 in browser
    ```
- **Audio/Video:**
  - Audio files are named by day and language (e.g., `day1_en.mp3`, `day1_zh.mp3`).
  - Video IDs are managed in `videos.json` and loaded dynamically.
- **Storage:**
  - Uses `localStorage` for user progress, preferences, and notes.

## Project-Specific Patterns
- **Lesson Content:**
  - Each day’s content is generated and stored as separate files for modularity.
  - Supplementary, reading, and writing content are in their own directories.
- **PWA:**
  - Service worker (`sw.js`) and manifest enable offline and installable app features. Test with a local server.
- **Naming Conventions:**
  - Audio/text files: `day{n}_en/zh/pinyin.txt` or `.mp3`.
  - Scripts: `mandarin_phrases_days_XX_YY.py` for each week’s content.

## Integration Points
- **YouTube API:**
  - Video loading handled in JS (`video-loader.js`).
- **Audio Generation:**
  - Python scripts use `gtts` and `edge-tts` for TTS audio.
- **PWA:**
  - Service worker and manifest must be updated if adding/removing core files.

## References
- See `README.md` for full project and workflow details.
- Contribution and conduct guidelines: `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`.

---
If any project conventions or workflows are unclear, ask the user for clarification or examples from the codebase.
