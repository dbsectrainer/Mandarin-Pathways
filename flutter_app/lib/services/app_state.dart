import 'package:flutter/foundation.dart';
import '../models/lesson.dart';
import 'storage_service.dart';
import 'audio_service.dart';
import 'notification_service.dart';

class AppState extends ChangeNotifier {
  final StorageService _storage;
  final AudioService _audio;
  final NotificationService _notification;

  Progress _progress = Progress();
  Language _currentLanguage = Language.chinese;
  bool _isLoading = true;

  AppState({
    required StorageService storage,
    required AudioService audio,
    required NotificationService notification,
  })  : _storage = storage,
        _audio = audio,
        _notification = notification {
    _initialize();
  }

  // Getters
  Progress get progress => _progress;
  Language get currentLanguage => _currentLanguage;
  bool get isLoading => _isLoading;
  AudioService get audioService => _audio;
  NotificationService get notificationService => _notification;

  // Initialize app state
  Future<void> _initialize() async {
    _isLoading = true;
    notifyListeners();

    try {
      await _storage.init();
      await _notification.init();

      // Load saved progress
      _progress = await _storage.getProgress();

      // Load preferred language
      final langCode = await _storage.getPreferredLanguage();
      _currentLanguage = Language.fromCode(langCode);

      // Load audio settings
      final audioSettings = await _storage.getAudioSettings();
      await _audio.setPlaybackSpeed(audioSettings['playbackSpeed']);
      await _audio.setLooping(audioSettings['loopEnabled']);

    } catch (e) {
      print('Error initializing app state: $e');
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  // Language Management
  Future<void> setLanguage(Language language) async {
    _currentLanguage = language;
    await _storage.setPreferredLanguage(language.code);
    notifyListeners();
  }

  // Progress Management
  Future<void> markDayComplete(int day) async {
    _progress.markDayComplete(day, _currentLanguage.code);
    await _storage.saveProgress(_progress);
    await _notification.showCompletionNotification(day);
    notifyListeners();
  }

  bool isDayCompleted(int day) {
    return _progress.isDayCompleted(day, _currentLanguage.code);
  }

  double getProgressForLanguage(String langCode) {
    return _progress.getProgressForLanguage(langCode);
  }

  int get totalCompletedDays => _progress.totalCompleted;

  int getCompletedDaysForLanguage(String langCode) {
    return _progress.completedDays[langCode]?.length ?? 0;
  }

  // Audio Management
  Future<void> playLessonAudio(int day, String language) async {
    await _audio.playLessonAudio(day, language);
  }

  Future<void> setAudioSpeed(double speed) async {
    await _audio.setPlaybackSpeed(speed);
    final settings = await _storage.getAudioSettings();
    settings['playbackSpeed'] = speed;
    await _storage.saveAudioSettings(settings);
  }

  Future<void> setAudioLooping(bool loop) async {
    await _audio.setLooping(loop);
    final settings = await _storage.getAudioSettings();
    settings['loopEnabled'] = loop;
    await _storage.saveAudioSettings(settings);
  }

  // Notification Management
  Future<void> scheduleDailyReminder(int hour, int minute) async {
    await _notification.scheduleDailyReminder(hour: hour, minute: minute);
    await _storage.saveNotificationSettings({
      'enabled': true,
      'time': '$hour:${minute.toString().padLeft(2, '0')}',
    });
  }

  Future<void> cancelNotifications() async {
    await _notification.cancelAllNotifications();
    await _storage.saveNotificationSettings({
      'enabled': false,
      'time': '09:00',
    });
  }

  // Lessons Data
  List<Lesson> getAllLessons() {
    return List.generate(40, (index) {
      final day = index + 1;
      final section = LessonSection.fromDay(day);
      return Lesson(
        day: day,
        title: 'Day $day',
        description: section.description,
        section: section,
        audioFiles: {
          'zh': 'audio/day${day}_zh.mp3',
          'en': 'audio/day${day}_en.mp3',
        },
        textFiles: {
          'zh': 'text/day${day}_zh.txt',
          'pinyin': 'text/day${day}_pinyin.txt',
          'en': 'text/day${day}_en.txt',
        },
      );
    });
  }

  Lesson getLesson(int day) {
    return getAllLessons()[day - 1];
  }

  void dispose() {
    _audio.dispose();
    super.dispose();
  }
}
