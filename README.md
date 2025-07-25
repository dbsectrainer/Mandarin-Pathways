# Mandarin Pathways

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Python](https://img.shields.io/badge/Python-3.12%2B-blue.svg)](https://www.python.org/)
[![Open Issues](https://img.shields.io/github/issues/dbsectrainer/Mandarin-Pathways)](https://github.com/dbsectrainer/Mandarin-Pathways/issues)
[![Last Commit](https://img.shields.io/github/last-commit/dbsectrainer/Mandarin-Pathways)](https://github.com/dbsectrainer/Mandarin-Pathways/commits/main)

## Overview

A focused Mandarin Chinese learning platform designed to take learners from foundational phrases to advanced professional fluency. The program offers a modular 40-day journey through interactive audio-visual lessons, YouTube video demonstrations, real-world conversation practice, reading comprehension exercises, character writing practice, and culturally relevant topics—ideal for travelers, professionals, and global citizens.

## Technical Skills Demonstrated

### Web Development
- Interactive, responsive web interface using HTML5, CSS3, and modern JavaScript
- Dynamic content updates and micro-interactions for enhanced user engagement
- YouTube API integration for embedded instructional videos
- Mobile-first responsive design using media queries and grid layouts
- Canvas-based drawing system for Chinese character practice
- Interactive reading comprehension exercises with vocabulary tools

### Python Development
- Automated content generation scripts for lesson materials
- Efficient audio file processing and generation
- Asynchronous programming for optimized performance

### Educational Technology
- Structured 40-day curriculum design with progressive learning paths
- Interactive learning tools and progress tracking systems
- Multimedia content integration (text, audio, video, interactive exercises)
- Curated YouTube content for visual learning reinforcement
- Character writing practice with stroke order guidance
- Reading comprehension exercises with vocabulary support

### Multilingual Support
- Trilingual content management (Simplified Chinese, Pinyin, English)
- Dynamic language switching functionality
- Cultural context integration

### User Experience Design
- Progress tracking with completion badges
- Offline-capable web application
- Persistent user preferences and progress storage
- Intuitive navigation and learning flow

### Audio Processing
- Dual-language audio content management
- Native speaker pronunciation integration
- Custom audio playback controls

## Project Structure
- `index.html`: Main dashboard with progress tracking
- `day.html`: Daily lesson interface with audio and text content
- `supplementary.html`: Additional learning resources and practice materials
- `reading.html`: Interactive reading practice with comprehension exercises
- `writing.html`: Character writing practice with canvas-based drawing
- `css/`: Stylesheets for the web interface
  - `styles.css`: Main stylesheet
  - `video-player.css`: Styles for the YouTube video player
  - `native-speaker.css`: Styles for native speaker components
  - `reading.css`: Styles for reading practice interface
  - `writing.css`: Styles for writing practice interface
- `js/`: JavaScript functionality and interactive features
  - `script.js`: Core application functionality
  - `video-loader.js`: Loads YouTube videos for daily lessons
  - `video-loader-supplementary.js`: Loads supplementary YouTube videos
  - `character-drawing.js`: Canvas-based drawing system for character practice
- `audio_files/`: 
  - Daily lesson audio files in both English (`day{n}_en.mp3`) and Mandarin (`day{n}_zh.mp3`)
  - Supplementary audio content in the `supplementary/` subdirectory
  - Reading practice audio in the `reading/` subdirectory
  - Writing practice audio in the `writing/` subdirectory
- `text_files/`: Text transcripts for each lesson:
  - Simplified Chinese (`day{n}_zh.txt`)
  - Pinyin (`day{n}_pinyin.txt`)
  - English (`day{n}_en.txt`)
- `reading_files/`: Text content for reading practice exercises
- `writing_files/`: Character practice content and writing exercises
- `manifest.json`: PWA configuration for installable app features
- `sw.js`: Service Worker for offline functionality and caching
- `icons/`: PWA icons for various device sizes and resolutions
  - `icon-72x72.png` to `icon-512x512.png`: Progressive sizes for different devices
  - `icon.svg`: Scalable vector icon
- `videos.json`: YouTube video IDs for each daily lesson
- `videos_supplementary.json`: YouTube video IDs for supplementary content
- Python content generation scripts:
  - `mandarin_phrases_days_01_07.py`: Days 1-7 content
  - `mandarin_phrases_days_08_14.py`: Days 8-14 content
  - `mandarin_phrases_days_15_22.py`: Days 15-22 content
  - `mandarin_phrases_days_23_30.py`: Days 23-30 content
  - `mandarin_phrases_days_31_40.py`: Days 31-40 content
  - `mandarin_phrases_supplementary.py`: Additional practice content
  - `reading_activities.py`: Reading practice content generator
  - `writing_activities.py`: Writing practice content generator
  - `video_search.py`: Utility for finding and managing YouTube videos

## Course Structure (40 Days)

### Foundations (Days 1–7)
- Pinyin system, tones, and pronunciation
- Greetings, numbers, time, and basic Q&A
- Introduction to characters

### Essential Daily Phrases (Days 8–14)
- Shopping, transportation, dining, and directions
- Basic sentence patterns and grammar
- Survival Mandarin for travelers

### Cultural Context & Daily Life (Days 15–22)
- Family, social interactions, and etiquette
- Chinese festivals and traditions
- Everyday communication at home and in public

### Professional Communication (Days 23–30)
- Workplace vocabulary and business etiquette
- Remote work and online meetings
- Emails, presentations, and technical phrases

### Advanced Fluency & Real-World Use (Days 31–40)
- Idioms, slang, and formal expressions
- Debates, storytelling, and persuasive speech
- Practice dialogues and role-play

## Features

### Progressive Web App (PWA)
- Install as a standalone app on desktop and mobile devices
- Offline access to lessons, audio, and practice materials
- Push notifications for daily lesson reminders
- Automatic updates when new content is available
- Fast loading and smooth performance
- Home screen icon for quick access
- Full-screen immersive experience
- Works across all modern browsers and devices

### Interactive Learning Interface
- Dual audio tracks (English explanation + native Mandarin pronunciation)
- Interactive transcripts (Simplified, Pinyin, English)
- Daily progress tracker with lesson completion badges
- Mobile-friendly, offline-capable web interface

### YouTube Video Integration
- Curated YouTube videos for each daily lesson
- Native speaker demonstrations and practice materials
- Visual reinforcement of pronunciation and cultural context
- Videos automatically loaded based on the current lesson day

### Mandarin-Specific Tools
- Tone practice and audio drills
- Pinyin-to-Hanzi recognition games
- Cultural tips embedded in lessons

### Reading Practice
- Leveled reading materials (Beginner, Intermediate, Advanced)
- Interactive vocabulary lists with pronunciation
- Comprehension questions with self-assessment
- Audio narration by native speakers
- Multi-language support (Simplified Chinese, Pinyin, English)

### Character Writing Practice
- Canvas-based drawing system for authentic character practice
- Works with both mouse and touch screen devices
- Grid system for proper character proportions
- Stroke order guidance and hints
- Multiple difficulty levels:
  - Basic strokes and radicals
  - HSK-leveled characters (HSK 1-6)
  - Thematic character groups (Family, Food, Travel, etc.)
- Clear, Undo, and Hint functionality for learning support

## Why Mandarin?

### 1. Global Importance
- Spoken by over 1 billion people
- Key to accessing China's economic, cultural, and technological landscape

### 2. Career & Business Edge
- High demand in diplomacy, tech, import/export, and finance
- Opens doors in international business, academia, and NGOs

### 3. Cultural & Intellectual Access
- Dive into Chinese philosophy, literature, and modern media
- Enhanced understanding of cross-cultural dynamics

## Development Setup

### Requirements
- Python 3.12+
- Required Python packages:
  ```bash
  pip install gtts edge-tts pandas
  ```

### Generate Lessons
```bash
# Generate content for each section
python mandarin_phrases_days_01_07.py
python mandarin_phrases_days_08_14.py
python mandarin_phrases_days_15_22.py
python mandarin_phrases_days_23_30.py
python mandarin_phrases_days_31_40.py

# Generate supplementary content
python mandarin_phrases_supplementary.py
```

### Run the Site
For basic usage and PWA features:
```bash
# Using Python's built-in server
python -m http.server 8000
```
Then open `http://localhost:8000` in your browser.

Note: Running through a local server is required to enable PWA features:
1. Use Chrome or another modern browser that supports PWAs
2. Look for the install prompt in the address bar to install as a standalone app
3. Test offline functionality by disabling network in DevTools
4. Enable notifications in your browser to receive daily reminders
5. Clear site data in browser settings to test the service worker update process

## Project Standards & Best Practices
This project follows industry best practices for open source repositories:
- [x] MIT License ([LICENSE](LICENSE))
- [x] Contribution guidelines ([CONTRIBUTING.md](CONTRIBUTING.md))
- [x] Code of Conduct ([CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md))
- [x] Changelog ([CHANGELOG.md](CHANGELOG.md))
- [x] Issue and PR templates ([.github/ISSUE_TEMPLATE/](.github/ISSUE_TEMPLATE/), [.github/PULL_REQUEST_TEMPLATE.md](.github/PULL_REQUEST_TEMPLATE.md))
- [x] EditorConfig ([.editorconfig](.editorconfig))
- [x] .gitignore and Dependabot ([.gitignore](.gitignore), [.github/dependabot.yml](.github/dependabot.yml))
- [x] Funding options ([.github/FUNDING.yml](.github/FUNDING.yml))

## Usage Guide
1. Open `index.html` and select your lesson
2. Listen to both English explanation and native Mandarin pronunciation
3. Read along with Pinyin and Hanzi
4. Repeat, record, and shadow the audio
5. Watch the YouTube video for native speaker demonstrations (available in Mandarin mode)
6. Practice with the video content to improve pronunciation and cultural understanding
7. Practice reading comprehension with leveled texts and vocabulary support
8. Master character writing with the interactive drawing system
9. Complete your daily badge and track your fluency gains

## Storage
Uses localStorage to save:
- Completed lessons
- Last visited day
- Audio playback preferences (e.g. slow speed, loop)
- Custom notes and bookmarks
- Completed reading exercises
- Completed writing exercises
