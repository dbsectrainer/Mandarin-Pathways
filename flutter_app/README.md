# Mandarin Pathways - Flutter App

A comprehensive Flutter mobile application for learning Mandarin Chinese with structured 40-day curriculum.

## Overview

Mandarin Pathways has been converted from a Progressive Web App (PWA) to a native Flutter application, providing:

- **Cross-platform support**: iOS, Android, Web, Desktop (Windows, macOS, Linux)
- **Offline-first architecture**: All lessons and audio cached locally
- **Native performance**: Smooth animations and responsive UI
- **Modern Flutter features**: Material Design 3, state management with Provider
- **Rich multimedia**: Audio playback, YouTube video integration, interactive practice

## Features

### 📚 40-Day Structured Curriculum
- Daily lessons organized into 5 progressive sections
- Lessons available in three formats: Simplified Chinese (简体中文), Pinyin, and English
- Progress tracking across all languages

### 🎵 Audio Features
- Dual-language audio for every lesson (Chinese + English)
- Variable playback speed (0.5x to 2.0x)
- Loop functionality for practice
- Seek controls with 10-second skip forward/backward

### 📹 Video Integration
- YouTube video integration for native speaker practice
- Embedded video player with full controls

### ✍️ Core Skills Practice
- **Reading Skills**: Practice comprehension at multiple difficulty levels
- **Writing Skills**: Character practice, sentence building, and translation exercises

### 📊 Progress Tracking
- Track completion across all 40 days
- Separate progress for each language format
- Visual progress indicators on home screen
- Persistent storage using SharedPreferences

### 🔔 Notifications
- Daily reminder notifications
- Customizable reminder times
- Completion celebration notifications

### 🌐 Supplementary Materials
- Education & Academic Life
- Hobbies & Interests
- Emotions & Feelings
- Weather & Daily Life
- Comparison Structures

## Architecture

### Project Structure

```
flutter_app/
├── lib/
│   ├── main.dart                 # App entry point
│   ├── models/
│   │   └── lesson.dart           # Data models
│   ├── screens/
│   │   ├── home_screen.dart      # Main home screen
│   │   ├── day_lesson_screen.dart # Daily lesson view
│   │   ├── reading_screen.dart   # Reading practice
│   │   ├── writing_screen.dart   # Writing practice
│   │   └── supplementary_screen.dart # Supplementary materials
│   ├── services/
│   │   ├── app_state.dart        # Global app state management
│   │   ├── storage_service.dart  # Local data persistence
│   │   ├── audio_service.dart    # Audio playback
│   │   └── notification_service.dart # Notifications
│   └── widgets/
│       ├── language_card.dart    # Language progress card
│       ├── section_card.dart     # Course section card
│       └── benefit_card.dart     # Benefits list card
├── assets/
│   ├── audio/                    # Audio files (day{n}_{lang}.mp3)
│   ├── text/                     # Text files (day{n}_{lang}.txt)
│   ├── icons/                    # App icons
│   ├── videos.json               # YouTube video IDs
│   └── videos_supplementary.json
└── pubspec.yaml                  # Dependencies and configuration
```

### Key Technologies

- **State Management**: Provider pattern for reactive state updates
- **Local Storage**: SharedPreferences for persistent data
- **Audio**: audioplayers package for cross-platform audio playback
- **Video**: youtube_player_flutter for YouTube integration
- **Notifications**: flutter_local_notifications with timezone support
- **UI**: Material Design 3 with Google Fonts (Poppins)

## Getting Started

### Prerequisites

- Flutter SDK (3.0.0 or higher)
- Dart SDK (3.0.0 or higher)
- iOS/Android development tools (for mobile deployment)

### Installation

1. **Install Flutter**:
   ```bash
   # Clone Flutter repository
   git clone https://github.com/flutter/flutter.git -b stable

   # Add to PATH
   export PATH="$PATH:`pwd`/flutter/bin"

   # Verify installation
   flutter doctor
   ```

2. **Install Dependencies**:
   ```bash
   cd flutter_app
   flutter pub get
   ```

3. **Run the App**:
   ```bash
   # Run on connected device/emulator
   flutter run

   # Run on specific platform
   flutter run -d chrome        # Web
   flutter run -d ios           # iOS
   flutter run -d android       # Android
   flutter run -d macos         # macOS
   flutter run -d windows       # Windows
   flutter run -d linux         # Linux
   ```

### Building for Production

#### Android (APK)
```bash
flutter build apk --release
# Output: build/app/outputs/flutter-apk/app-release.apk
```

#### iOS (IPA)
```bash
flutter build ios --release
# Then use Xcode to create IPA
```

#### Web
```bash
flutter build web --release
# Output: build/web/
```

#### Desktop
```bash
# macOS
flutter build macos --release

# Windows
flutter build windows --release

# Linux
flutter build linux --release
```

## Configuration

### Audio Files

Audio files should be placed in `assets/audio/` with the naming convention:
- `day{n}_zh.mp3` - Mandarin audio
- `day{n}_en.mp3` - English explanations

### Text Files

Text content should be in `assets/text/` with the naming convention:
- `day{n}_zh.txt` - Simplified Chinese text
- `day{n}_pinyin.txt` - Pinyin romanization
- `day{n}_en.txt` - English translation

### Video Integration

Update `assets/videos.json` to add YouTube video IDs:
```json
{
  "day1": "VIDEO_ID_HERE",
  "day2": "VIDEO_ID_HERE"
}
```

### Notification Configuration

Notifications require platform-specific setup:

**Android**: Update `android/app/src/main/AndroidManifest.xml`
**iOS**: Configure permissions in `ios/Runner/Info.plist`

## Dependencies

### Core Flutter Packages

- `provider` (^6.1.1) - State management
- `shared_preferences` (^2.2.2) - Local storage
- `audioplayers` (^5.2.1) - Audio playback
- `youtube_player_flutter` (^8.1.2) - YouTube videos
- `flutter_local_notifications` (^16.3.0) - Notifications
- `google_fonts` (^6.1.0) - Typography
- `font_awesome_flutter` (^10.6.0) - Icons

See `pubspec.yaml` for complete dependency list.

## Migration from PWA

### What Changed

1. **HTML/CSS/JS → Flutter/Dart**: Complete rewrite using Flutter widgets
2. **localStorage → SharedPreferences**: Persistent data storage
3. **Service Worker → Native Caching**: Flutter's asset bundling
4. **Web Audio API → audioplayers**: Cross-platform audio
5. **HTML5 Canvas → CustomPainter**: Drawing functionality (future)

### What's Preserved

- All 40 lessons and content structure
- Progress tracking functionality
- Audio playback with speed/loop controls
- YouTube video integration
- Reading and writing practice sections
- Supplementary materials

### Advantages of Flutter Version

✅ Native mobile app performance
✅ App Store/Play Store distribution
✅ Offline-first by default
✅ Better audio control
✅ Platform-specific optimizations
✅ Unified codebase for all platforms
✅ Better notification support
✅ Native UI components

## Development

### Running Tests

```bash
flutter test
```

### Code Analysis

```bash
flutter analyze
```

### Format Code

```bash
flutter format lib/
```

## Troubleshooting

### Audio Not Playing
- Ensure audio files are in `assets/audio/` directory
- Verify `pubspec.yaml` includes audio assets
- Run `flutter clean && flutter pub get`

### Build Errors
```bash
flutter clean
flutter pub get
flutter pub cache repair
```

### Platform-Specific Issues

**iOS**: Ensure Xcode is up to date and CocoaPods is installed
**Android**: Verify Android SDK is properly configured
**Web**: Enable CORS if loading external resources

## Future Enhancements

- [ ] Canvas-based character drawing practice
- [ ] Speech recognition for pronunciation practice
- [ ] Spaced repetition flashcards
- [ ] Social features (study groups, leaderboards)
- [ ] Offline video caching
- [ ] Multi-user profiles
- [ ] Cloud sync across devices

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and format code
5. Submit a pull request

## License

Copyright © 2025 Mandarin Pathways. All rights reserved.

## Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Check the Flutter documentation: https://flutter.dev/docs
- Review the original PWA at: [original web URL]

---

**Note**: This Flutter app provides the same comprehensive Mandarin learning experience as the original PWA, now with native mobile performance and cross-platform support.
