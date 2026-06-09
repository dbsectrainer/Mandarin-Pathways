# Gap-Closing Roadmap — Mandarin Pathways → toward the "industry standard"

## Context

`industry-standard.md` describes an aspirational super-app ("Mandarin Mastery") with AI conversation, speech
recognition, OCR, adaptive learning, SRS, gamification, and a subscription business — backed by a Node/Python +
Postgres + AWS stack. The **actual** project (Mandarin Pathways) is a strong but narrower product: an offline-first,
trilingual (zh / pinyin / en) 40-day course delivered as a vanilla-JS **PWA** and a **Flutter** app, with **no
backend, no database, no auth**. Of the ~18 flagship features in the standard, ~3 are fully present, ~5 partial, ~10
absent.

This roadmap closes the **highest-leverage gaps that do NOT require a backend**, so they can ship within the current
offline architecture. Per the user's decision, work targets the **Web PWA first**; Flutter parity is a later phase.
Out of scope (require server/LLM infra, tracked separately): AI conversation partner, cloud sync/accounts,
leaderboards, language exchange, subscriptions. Speech-recognition pronunciation feedback is a *stretch* item (browser
Web Speech API is client-side but network-dependent and inconsistent).

**Intended outcome:** move from "static courseware" toward "engaging, retention-driven self-study app" by adding the
retention loop (SRS, streaks), self-assessment (placement + quizzes), and two learning-depth features (tone visuals,
stroke-order animation) — all offline, all in the PWA.

## Guiding constraints

- **No backend.** Everything persists in `localStorage` (web) following existing patterns.
- **Reuse existing patterns**, don't reinvent:
  - localStorage feature module pattern: `js/starred-phrases.js` (get/save/toggle + stable composite ID).
  - Import/export of progress keys: `js/data-portability.js` (must be updated to include any new keys).
  - Canvas practice: `js/character-drawing.js` (note line ~423: "We don't have stroke data yet" — the hook for animation).
  - Page bootstrapping pattern: `js/day-page.js`, `js/reading-page.js`, `js/writing-page.js`.
  - Service worker cache list: `sw.js` (bump cache version + add any new JS/CSS/page files).
- **Add tests as you go** — the repo has only ~6 Playwright smoke tests (`tests/e2e/smoke.spec.ts`). Each new page/feature
  gets at least one smoke test. (A lightweight `.github/workflows/test.yml` running `npm test` is a recommended enabler.)

## Phase 1 — Retention loop (highest leverage)

**1a. Spaced-Repetition flashcards (SRS).** Closes the "Anki-style SRS: ABSENT" gap.
- New `js/srs.js` modeled on `js/starred-phrases.js`: store per-card scheduling state under a new key `srsCards`
  (`{ id, day, lang, front, back, due, interval, ease, reps }`). Use a small SM-2-lite algorithm (interval/ease update
  on a 3-button "Again / Good / Easy" grade).
- Seed cards from existing data: starred phrases (`getStarredPhrases()`) + lesson phrases + reading vocabulary lists
  (already structured in `reading_activities.py` output / `reading_files/`).
- New `srs.html` review page (clone structure of `review.html`); link from home (`index.html`) and the review page.
- Update `js/data-portability.js` to export/import the `srsCards` key; add `srs.html`/`js/srs.js` to `sw.js`.

**1b. Streaks & achievements.** Closes "streaks/achievements: ABSENT."
- New `js/streaks.js`: track `lastActiveDate` and `streakCount` in localStorage; increment on any lesson/SRS activity,
  reset on a missed day. Simple achievement badges derived from existing `completedDays` (e.g., 7/14/30/40-day, first
  SRS review, etc.) — no new data source needed.
- Surface streak + badges on the home dashboard (`index.html` progress section) and as a small banner on `day.html`.
- Add keys to `js/data-portability.js`.

## Phase 2 — Self-assessment

**2a. Placement test.** Closes "placement test: ABSENT."
- New `placement.html` + `js/placement-page.js`: ~8–12 static multiple-choice questions drawn from existing phrase/vocab
  content across difficulty bands; map score → recommended starting day/section. Store `placementResult` in localStorage;
  offer a "Start at Day N" CTA on the home page.

**2b. HSK self-quiz / mock test.** Closes "HSK mock tests: ABSENT" (partial).
- New `js/quiz.js` reusable quiz engine (multiple-choice + fill-in) sourced from existing day phrases and reading vocab;
  embed a "Quiz me on this day" button on `day.html` and a standalone `quiz.html`. Store best scores per day.

## Phase 3 — Learning depth

**3a. Tone visualization.** Closes "tone training: ABSENT."
- New `js/tone-visualizer.js`: render the 4 Mandarin tone pitch-contour shapes (flat / rising / dip / falling) as small
  inline SVG/canvas glyphs next to pinyin syllables on `day.html`. Pure static rendering keyed off the tone digit in
  pinyin — no audio analysis, no backend. Add a "Tones 101" explainer card.

**3b. Stroke-order animation.** Closes "stroke-order animations: ABSENT."
- Integrate **Hanzi Writer** (MIT, fully client-side, bundles its own stroke data — no backend) into the writing flow.
  Replace/augment the static hint in `js/character-drawing.js` (the line ~423 TODO) with animated stroke-order playback
  and quiz mode. Vendor the library locally and add to `sw.js` so it stays offline.

## Phase 4 — Flutter parity (later)

Once Phase 1–3 land and stabilize in the PWA, port each feature to the Flutter app using its existing
`StorageService` pattern (`flutter_app/lib/services/storage_service.dart` — JSON-encoded values in SharedPreferences,
mirroring the localStorage keys). Reuse the same key names so exported web data and Flutter data stay conceptually aligned.

## Stretch (optional, evaluate later)

- **Pronunciation feedback** via the browser Web Speech API (`SpeechRecognition`) comparing recognized text to the target
  phrase. Client-side but network-dependent and Chrome-biased — prototype before committing.
- **Searchable offline dictionary**: aggregate all phrase + reading-vocab data into one indexed glossary page (upgrades
  the "dictionary: PARTIAL" gap without external data).

## Also recommended (separate, not features)

- **Fix `industry-standard.md`**: its tech-stack section (React Native / Postgres / AWS) and metrics are fiction relative
  to the repo. Re-baseline it (or fold into a real roadmap) so the "standard" is honest and achievable.
- **Add CI** (`.github/workflows/test.yml`) running `npm test` on PR — currently no GitHub Actions exist; this protects
  every feature above.

## Verification

- **Per feature:** add a Playwright smoke test in `tests/e2e/` (page loads, core control works, localStorage key written),
  following `tests/e2e/smoke.spec.ts`. Run `python3 server.py` then `npm test` (config: `playwright.config.ts`,
  baseURL `http://127.0.0.1:8000`).
- **Manual:** `python3 server.py` → exercise each new page in-browser; confirm offline behavior by loading once, going
  offline (DevTools), and reloading (service worker must serve the new files — verify `sw.js` cache version was bumped).
- **Data portability:** export progress via `js/data-portability.js`, confirm new keys (`srsCards`, streak keys,
  `placementResult`, quiz scores) round-trip through import.
- **Regression:** existing smoke tests still pass; `CHANGELOG.md` updated per repo convention.
