# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Architecture Overview

Mandarin Pathways is a hybrid Progressive Web App (PWA) for Mandarin Chinese learning with a modular 40-day curriculum. The architecture combines:

- **Frontend**: Pure HTML/CSS/JavaScript with PWA features (offline support, installable)
- **Content Generation**: Python scripts that generate lesson materials, audio files, and text content
- **Media Assets**: Organized audio files, text transcripts, and YouTube video integration
- **Social Media Automation**: Optional social media content generation and posting system

## Key Development Commands

### Content Generation
```bash
# Generate lesson content (run in sequence for complete curriculum)
python mandarin_phrases_days_01_07.py
python mandarin_phrases_days_08_14.py  
python mandarin_phrases_days_15_22.py
python mandarin_phrases_days_23_30.py
python mandarin_phrases_days_31_40.py

# Generate supplementary content
python mandarin_phrases_supplementary.py
python reading_activities.py
python writing_activities.py
```

### Local Development Server
```bash
# Enhanced server with compression and caching (recommended)
python server.py

# Basic server (alternative)
python -m http.server 8000
```
Access at `http://localhost:8000`. Local server required for PWA features to work properly.

### Testing
```bash
# Run social media automation tests
cd social_media
python test_social_media_automation.py

# Social media tools (if using social features)
./social_media_tools.sh help
```

## Content Architecture

### File Organization Pattern
- **Audio**: `audio_files/day{n}_{language}.mp3` where language is `en|zh`
- **Text**: `text_files/day{n}_{format}.txt` where format is `en|zh|pinyin`
- **Reading**: `reading_files/{level}_{topic}_{language}.txt`
- **Writing**: `writing_files/character_{type}_{language}.txt`

### Content Generation Flow
1. Python scripts generate structured lesson data
2. Text-to-speech creates dual-language audio (English explanations + Mandarin pronunciation)
3. Content is organized by day/topic and language variant
4. YouTube video IDs stored in `videos.json` and `videos_supplementary.json`

### PWA Implementation
- `manifest.json`: App configuration and icons
- `sw.js`: Service worker for offline caching and updates
- `localStorage`: Progress tracking, preferences, and user notes
- Must be served over HTTPS or localhost for full PWA features

## Core JavaScript Modules

### `js/script.js`
Main application logic, progress tracking, and localStorage management

### `js/video-loader.js` & `js/video-loader-supplementary.js`
YouTube API integration for embedded instructional videos

### `js/character-drawing.js`
Canvas-based Chinese character writing practice system

### `js/notifications.js`
PWA notification system for daily lesson reminders

## Key Integration Points

### YouTube Integration
Videos are dynamically loaded based on lesson day using video ID mappings in `videos.json`. The system supports both daily lessons and supplementary content.

### Audio Generation Dependencies
- `gtts`: Google Text-to-Speech for English
- `edge-tts`: Microsoft Edge TTS for Mandarin pronunciation
- Content scripts handle bilingual audio generation automatically

### Social Media Automation (Optional)
Located in `social_media/` directory with its own toolchain:
- `social_media_automation.py`: Main automation script
- `social_media_tools.sh`: Shell wrapper for common tasks
- Requires platform-specific API credentials in `.env` file

## Development Patterns

### Content Updates
When modifying lesson content, always regenerate both text and audio files using the corresponding Python script. The system expects consistent naming conventions across all asset types.

### PWA Updates
After changing core files, update the service worker cache version in `sw.js` to ensure users get the latest content. Test offline functionality after any structural changes.

### Responsive Design
All interfaces use mobile-first responsive design. Test on both desktop and mobile devices, especially the character drawing functionality which adapts to touch vs mouse input.

## Python Dependencies
See `requirements.txt` for full list. Core dependencies include:
- `gtts`, `edge-tts` for audio generation
- `pandas` for data management in content scripts
- Social media automation has additional optional platform-specific dependencies

## Storage and State Management
Uses browser `localStorage` for:
- Lesson completion tracking
- Audio preferences (speed, loop settings)
- User notes and bookmarks
- Reading/writing exercise progress

No server-side database required - all state is client-side.