# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### 2026-06-09

- **Roadmap PWA features:** Added offline SRS flashcards, streaks and achievements, placement testing, day quizzes, pinyin tone visuals, offline stroke-order playback, progress portability keys, static cache updates, CI, and Playwright coverage for the new retention/self-assessment/learning-depth flows.

### 2026-05-20

- **Review & tooling:** Added review UI, starred phrases (`js/starred-phrases.js`), related stylesheet hooks, Playwright smoke tests (`tests/e2e`, `playwright.config.ts`), `package.json` / lockfile tooling, service worker registration path updates, `.gitignore` tweaks, `README`/workspace doc updates, and miscellaneous Flutter manifests/config touch-ups.
- **Remove embedded video:** Stripped embedded YouTube usage from the PWA (video loaders, JSON, CSS/JS/HTML sections) and from the Flutter app (webview/youtube_player dependencies, `Lesson.videoId`, plugin registrations). README/Flutter README now describe bundled audio/transcripts instead of embedded streaming; removed obsolete internal strategy/instruction markdown files bundled with that cleanup.
- **Hero:** Restored earlier hero layout and background image styling.
- **Karaoke / timing pipeline:** Introduced stitched per-phrase lesson audio with manifests (`timing/day{n}_{zh|en}.json`), `scripts/audio_timings.py` (ffmpeg + pydub wiring), regenerated `audio_files/` clips, synced highlights in lesson UI, bumped `requirements.txt`/README generator notes, and extended the same cue pattern to reading, supplementary, and writing (`js/lesson-audio-sync.js`, page scripts, Python generators, `timing/{reading|writing|supplementary}/`, CSS + minified bundles, service worker caching).
- **Writing intros (Chinese + pinyin UX):** `writing_activities.py` now carries `description_zh`; zh text outputs and Mandarin stitched intros use it (`scripts/audio_timings.py`). Regenerated writing MP3/timing manifests; refined `reading-page.js` / `writing-page.js` cues (sentence alignment, phrase-level romanized intros with Mandarin timings). README documents timing/`description_zh` behavior; footer year updated to **2026**; service worker cache version bumped again for static assets.

- Added industry-standard project files: LICENSE, CONTRIBUTING.md, CODE_OF_CONDUCT.md, .editorconfig, .gitignore, .github/ISSUE_TEMPLATE, .github/PULL_REQUEST_TEMPLATE.md, .github/dependabot.yml
- Updated requirements.txt (see details in commit)

## [1.0.0] - 2025-07-25

- Initial public release.
