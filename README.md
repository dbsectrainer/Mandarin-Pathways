Mandarin Pathways

Overview

A focused Mandarin Chinese learning platform designed to take learners from foundational phrases to advanced professional fluency. The program offers a modular 40-day journey through interactive audio-visual lessons, real-world conversation practice, and culturally relevant topics—ideal for travelers, professionals, and global citizens.

Project Structure
	•	website/: Web interface for immersive, interactive learning
	•	index.html: Main dashboard with progress tracking
	•	day.html: Daily lesson interface with audio and text content
	•	css/: Stylesheets
	•	js/: JavaScript functionality
	•	audio_files/: MP3 audio files for each day (Mandarin with native speaker pronunciation)
	•	text_files/: Text transcripts (Simplified Chinese, Pinyin, English)
	•	mandarin_phrases_days_*.py: Python scripts for automated content generation

Course Structure (40 Days)

Foundations (Days 1–7)
	•	Pinyin system, tones, and pronunciation
	•	Greetings, numbers, time, and basic Q&A
	•	Introduction to characters

Essential Daily Phrases (Days 8–14)
	•	Shopping, transportation, dining, and directions
	•	Basic sentence patterns and grammar
	•	Survival Mandarin for travelers

Cultural Context & Daily Life (Days 15–22)
	•	Family, social interactions, and etiquette
	•	Chinese festivals and traditions
	•	Everyday communication at home and in public

Professional Communication (Days 23–30)
	•	Workplace vocabulary and business etiquette
	•	Remote work and online meetings
	•	Emails, presentations, and technical phrases

Advanced Fluency & Real-World Use (Days 31–40)
	•	Idioms, slang, and formal expressions
	•	Debates, storytelling, and persuasive speech
	•	Practice dialogues and role-play

Features

Interactive Learning Interface
	•	Audio + transcript (Simplified, Pinyin, English)
	•	Daily progress tracker with lesson completion badges
	•	Mobile-friendly, offline-capable web interface

Mandarin-Specific Tools
	•	Tone practice and audio drills
	•	Pinyin-to-Hanzi recognition games
	•	Cultural tips embedded in lessons

Why Mandarin?
	1.	Global Importance
	•	Spoken by over 1 billion people
	•	Key to accessing China’s economic, cultural, and technological landscape
	2.	Career & Business Edge
	•	High demand in diplomacy, tech, import/export, and finance
	•	Opens doors in international business, academia, and NGOs
	3.	Cultural & Intellectual Access
	•	Dive into Chinese philosophy, literature, and modern media
	•	Enhanced understanding of cross-cultural dynamics

Development Setup

Requirements
	•	Python 3.12+
	•	gTTS (Google Text-to-Speech) or Mandarin TTS library like edge-tts for higher quality

pip install gtts

Generate Lessons

python mandarin_phrases_days_01_07.py
python mandarin_phrases_days_08_14.py
...
python mandarin_phrases_days_31_40.py

Run the Site

Open website/index.html in any modern browser. No server needed.

Usage Guide
	1.	Open the site and select your lesson
	2.	Listen to native pronunciation
	3.	Read along with Pinyin and Hanzi
	4.	Repeat, record, and shadow the audio
	5.	Complete your daily badge and track your fluency gains

Storage

Uses localStorage to save:
	•	Completed lessons
	•	Last visited day
	•	Audio playback preferences (e.g. slow speed, loop)
