import 'dart:convert';
import 'dart:io';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/lesson.dart';

class StorageService {
  static const String _progressKey = 'user_progress';
  static const String _preferredLanguageKey = 'preferred_language';
  static const String _notificationSettingsKey = 'notification_settings';

  late SharedPreferences _prefs;

  Future<void> init() async {
    _prefs = await SharedPreferences.getInstance();
  }

  // Progress Management
  Future<Progress> getProgress() async {
    final String? progressJson = _prefs.getString(_progressKey);
    if (progressJson == null) {
      return Progress();
    }
    try {
      return Progress.fromJson(json.decode(progressJson));
    } catch (e) {
      return Progress();
    }
  }

  Future<bool> saveProgress(Progress progress) async {
    final String progressJson = json.encode(progress.toJson());
    return await _prefs.setString(_progressKey, progressJson);
  }

  Future<bool> markDayComplete(int day, String language) async {
    final progress = await getProgress();
    progress.markDayComplete(day, language);
    return await saveProgress(progress);
  }

  Future<bool> isDayCompleted(int day, String language) async {
    final progress = await getProgress();
    return progress.isDayCompleted(day, language);
  }

  Future<Map<String, int>> getCompletedDaysCount() async {
    final progress = await getProgress();
    return progress.completedDays.map(
      (key, value) => MapEntry(key, value.length),
    );
  }

  // Language Preference
  Future<String> getPreferredLanguage() async {
    return _prefs.getString(_preferredLanguageKey) ?? 'zh';
  }

  Future<bool> setPreferredLanguage(String language) async {
    return await _prefs.setString(_preferredLanguageKey, language);
  }

  // Notification Settings
  Future<Map<String, dynamic>> getNotificationSettings() async {
    final String? settingsJson = _prefs.getString(_notificationSettingsKey);
    if (settingsJson == null) {
      return {
        'enabled': true,
        'time': '09:00',
      };
    }
    return json.decode(settingsJson);
  }

  Future<bool> saveNotificationSettings(Map<String, dynamic> settings) async {
    final String settingsJson = json.encode(settings);
    return await _prefs.setString(_notificationSettingsKey, settingsJson);
  }

  // User Notes (for lessons)
  Future<String?> getNoteForDay(int day, String language) async {
    final String key = 'note_${day}_$language';
    return _prefs.getString(key);
  }

  Future<bool> saveNoteForDay(int day, String language, String note) async {
    final String key = 'note_${day}_$language';
    return await _prefs.setString(key, note);
  }

  // Audio Settings
  Future<Map<String, dynamic>> getAudioSettings() async {
    return {
      'playbackSpeed': _prefs.getDouble('audio_speed') ?? 1.0,
      'autoPlay': _prefs.getBool('audio_autoplay') ?? false,
      'loopEnabled': _prefs.getBool('audio_loop') ?? false,
    };
  }

  Future<bool> saveAudioSettings(Map<String, dynamic> settings) async {
    await _prefs.setDouble('audio_speed', settings['playbackSpeed'] ?? 1.0);
    await _prefs.setBool('audio_autoplay', settings['autoPlay'] ?? false);
    await _prefs.setBool('audio_loop', settings['loopEnabled'] ?? false);
    return true;
  }

  // Clear all data
  Future<bool> clearAll() async {
    return await _prefs.clear();
  }
}
