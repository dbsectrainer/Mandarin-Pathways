# Mandarin Pathways

## Overview

A focused Mandarin Chinese learning platform designed to take learners from foundational phrases to advanced professional fluency. The program offers a modular 40-day journey through interactive audio-visual lessons, YouTube video demonstrations, real-world conversation practice, and culturally relevant topics—ideal for travelers, professionals, and global citizens.

## Technical Skills Demonstrated

### Web Development
- Interactive, responsive web interface using HTML5, CSS3, and modern JavaScript
- Dynamic content updates and micro-interactions for enhanced user engagement
- YouTube API integration for embedded instructional videos
- Mobile-first responsive design using media queries and grid layouts

### Python Development
- Automated content generation scripts for lesson materials
- Efficient audio file processing and generation
- Asynchronous programming for optimized performance

### Educational Technology
- Structured 40-day curriculum design with progressive learning paths
- Interactive learning tools and progress tracking systems
- Multimedia content integration (text, audio, video, interactive exercises)
- Curated YouTube content for visual learning reinforcement

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
- `css/`: Stylesheets for the web interface
  - `styles.css`: Main stylesheet
  - `video-player.css`: Styles for the YouTube video player
  - `native-speaker.css`: Styles for native speaker components
- `js/`: JavaScript functionality and interactive features
  - `script.js`: Core application functionality
  - `video-loader.js`: Loads YouTube videos for daily lessons
  - `video-loader-supplementary.js`: Loads supplementary YouTube videos
- `audio_files/`: 
  - Daily lesson audio files in both English (`day{n}_en.mp3`) and Mandarin (`day{n}_zh.mp3`)
  - Supplementary audio content in the `supplementary/` subdirectory
- `text_files/`: Text transcripts for each lesson:
  - Simplified Chinese (`day{n}_zh.txt`)
  - Pinyin (`day{n}_pinyin.txt`)
  - English (`day{n}_en.txt`)
- `videos.json`: YouTube video IDs for each daily lesson
- `videos_supplementary.json`: YouTube video IDs for supplementary content
- Python content generation scripts:
  - `mandarin_phrases_days_01_07.py`: Days 1-7 content
  - `mandarin_phrases_days_08_14.py`: Days 8-14 content
  - `mandarin_phrases_days_15_22.py`: Days 15-22 content
  - `mandarin_phrases_days_23_30.py`: Days 23-30 content
  - `mandarin_phrases_days_31_40.py`: Days 31-40 content
  - `mandarin_phrases_supplementary.py`: Additional practice content
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
Simply open `index.html` in any modern browser. No server setup required.

## Usage Guide
1. Open `index.html` and select your lesson
2. Listen to both English explanation and native Mandarin pronunciation
3. Read along with Pinyin and Hanzi
4. Repeat, record, and shadow the audio
5. Watch the YouTube video for native speaker demonstrations (available in Mandarin mode)
6. Practice with the video content to improve pronunciation and cultural understanding
7. Complete your daily badge and track your fluency gains

## Storage
Uses localStorage to save:
- Completed lessons
- Last visited day
- Audio playback preferences (e.g. slow speed, loop)
- Custom notes and bookmarks
