import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

enum ThemeMode {
  light,
  dark,
  system,
}

class SettingsService extends ChangeNotifier {
  static const String _keyThemeMode = 'theme_mode';
  static const String _keyTextScale = 'text_scale';
  static const String _keyNotificationsEnabled = 'notifications_enabled';
  static const String _keyNotificationTime = 'notification_time';
  static const String _keyDailyGoalMinutes = 'daily_goal_minutes';
  static const String _keyDailyGoalLessons = 'daily_goal_lessons';
  static const String _keyAudioSpeed = 'audio_speed';
  static const String _keyAutoPlay = 'auto_play';
  static const String _keyLoopAudio = 'loop_audio';
  static const String _keyReducedAnimations = 'reduced_animations';
  static const String _keyHighContrast = 'high_contrast';
  static const String _keyHapticFeedback = 'haptic_feedback';
  static const String _keySoundEffects = 'sound_effects';
  static const String _keyFirstLaunch = 'first_launch';

  final SharedPreferences _prefs;

  // Theme Settings
  ThemeMode _themeMode = ThemeMode.system;
  double _textScale = 1.0;
  bool _highContrast = false;

  // Notification Settings
  bool _notificationsEnabled = true;
  TimeOfDay _notificationTime = const TimeOfDay(hour: 9, minute: 0);

  // Daily Goal Settings
  int _dailyGoalMinutes = 15;
  int _dailyGoalLessons = 1;

  // Audio Settings
  double _audioSpeed = 1.0;
  bool _autoPlay = false;
  bool _loopAudio = false;

  // Accessibility Settings
  bool _reducedAnimations = false;
  bool _hapticFeedback = true;
  bool _soundEffects = true;

  // Onboarding
  bool _firstLaunch = true;

  SettingsService(this._prefs) {
    _loadSettings();
  }

  // Getters
  ThemeMode get themeMode => _themeMode;
  double get textScale => _textScale;
  bool get highContrast => _highContrast;
  bool get notificationsEnabled => _notificationsEnabled;
  TimeOfDay get notificationTime => _notificationTime;
  int get dailyGoalMinutes => _dailyGoalMinutes;
  int get dailyGoalLessons => _dailyGoalLessons;
  double get audioSpeed => _audioSpeed;
  bool get autoPlay => _autoPlay;
  bool get loopAudio => _loopAudio;
  bool get reducedAnimations => _reducedAnimations;
  bool get hapticFeedback => _hapticFeedback;
  bool get soundEffects => _soundEffects;
  bool get firstLaunch => _firstLaunch;

  bool get isDarkMode {
    if (_themeMode == ThemeMode.dark) return true;
    if (_themeMode == ThemeMode.light) return false;
    // For system mode, you'd need to check the system brightness
    // This is a simplified version
    return false;
  }

  Future<void> _loadSettings() async {
    // Theme Settings
    final themeModeIndex = _prefs.getInt(_keyThemeMode) ?? 2; // Default to system
    _themeMode = ThemeMode.values[themeModeIndex];
    _textScale = _prefs.getDouble(_keyTextScale) ?? 1.0;
    _highContrast = _prefs.getBool(_keyHighContrast) ?? false;

    // Notification Settings
    _notificationsEnabled = _prefs.getBool(_keyNotificationsEnabled) ?? true;
    final notificationTimeMinutes = _prefs.getInt(_keyNotificationTime) ?? 540; // 9 AM
    _notificationTime = TimeOfDay(
      hour: notificationTimeMinutes ~/ 60,
      minute: notificationTimeMinutes % 60,
    );

    // Daily Goal Settings
    _dailyGoalMinutes = _prefs.getInt(_keyDailyGoalMinutes) ?? 15;
    _dailyGoalLessons = _prefs.getInt(_keyDailyGoalLessons) ?? 1;

    // Audio Settings
    _audioSpeed = _prefs.getDouble(_keyAudioSpeed) ?? 1.0;
    _autoPlay = _prefs.getBool(_keyAutoPlay) ?? false;
    _loopAudio = _prefs.getBool(_keyLoopAudio) ?? false;

    // Accessibility Settings
    _reducedAnimations = _prefs.getBool(_keyReducedAnimations) ?? false;
    _hapticFeedback = _prefs.getBool(_keyHapticFeedback) ?? true;
    _soundEffects = _prefs.getBool(_keySoundEffects) ?? true;

    // Onboarding
    _firstLaunch = _prefs.getBool(_keyFirstLaunch) ?? true;

    notifyListeners();
  }

  // Theme Settings
  Future<void> setThemeMode(ThemeMode mode) async {
    _themeMode = mode;
    await _prefs.setInt(_keyThemeMode, mode.index);
    notifyListeners();
  }

  Future<void> setTextScale(double scale) async {
    _textScale = scale.clamp(0.8, 1.5);
    await _prefs.setDouble(_keyTextScale, _textScale);
    notifyListeners();
  }

  Future<void> setHighContrast(bool enabled) async {
    _highContrast = enabled;
    await _prefs.setBool(_keyHighContrast, enabled);
    notifyListeners();
  }

  // Notification Settings
  Future<void> setNotificationsEnabled(bool enabled) async {
    _notificationsEnabled = enabled;
    await _prefs.setBool(_keyNotificationsEnabled, enabled);
    notifyListeners();
  }

  Future<void> setNotificationTime(TimeOfDay time) async {
    _notificationTime = time;
    final minutes = time.hour * 60 + time.minute;
    await _prefs.setInt(_keyNotificationTime, minutes);
    notifyListeners();
  }

  // Daily Goal Settings
  Future<void> setDailyGoalMinutes(int minutes) async {
    _dailyGoalMinutes = minutes;
    await _prefs.setInt(_keyDailyGoalMinutes, minutes);
    notifyListeners();
  }

  Future<void> setDailyGoalLessons(int lessons) async {
    _dailyGoalLessons = lessons;
    await _prefs.setInt(_keyDailyGoalLessons, lessons);
    notifyListeners();
  }

  // Audio Settings
  Future<void> setAudioSpeed(double speed) async {
    _audioSpeed = speed;
    await _prefs.setDouble(_keyAudioSpeed, speed);
    notifyListeners();
  }

  Future<void> setAutoPlay(bool enabled) async {
    _autoPlay = enabled;
    await _prefs.setBool(_keyAutoPlay, enabled);
    notifyListeners();
  }

  Future<void> setLoopAudio(bool enabled) async {
    _loopAudio = enabled;
    await _prefs.setBool(_keyLoopAudio, enabled);
    notifyListeners();
  }

  // Accessibility Settings
  Future<void> setReducedAnimations(bool enabled) async {
    _reducedAnimations = enabled;
    await _prefs.setBool(_keyReducedAnimations, enabled);
    notifyListeners();
  }

  Future<void> setHapticFeedback(bool enabled) async {
    _hapticFeedback = enabled;
    await _prefs.setBool(_keyHapticFeedback, enabled);
    notifyListeners();
  }

  Future<void> setSoundEffects(bool enabled) async {
    _soundEffects = enabled;
    await _prefs.setBool(_keySoundEffects, enabled);
    notifyListeners();
  }

  // Onboarding
  Future<void> completeOnboarding() async {
    _firstLaunch = false;
    await _prefs.setBool(_keyFirstLaunch, false);
    notifyListeners();
  }

  Future<void> resetOnboarding() async {
    _firstLaunch = true;
    await _prefs.setBool(_keyFirstLaunch, true);
    notifyListeners();
  }

  // Reset all settings
  Future<void> resetAllSettings() async {
    await _prefs.clear();
    _loadSettings();
  }

  // Export settings as JSON for backup
  Map<String, dynamic> exportSettings() {
    return {
      'themeMode': _themeMode.index,
      'textScale': _textScale,
      'highContrast': _highContrast,
      'notificationsEnabled': _notificationsEnabled,
      'notificationTime': '${_notificationTime.hour}:${_notificationTime.minute}',
      'dailyGoalMinutes': _dailyGoalMinutes,
      'dailyGoalLessons': _dailyGoalLessons,
      'audioSpeed': _audioSpeed,
      'autoPlay': _autoPlay,
      'loopAudio': _loopAudio,
      'reducedAnimations': _reducedAnimations,
      'hapticFeedback': _hapticFeedback,
      'soundEffects': _soundEffects,
    };
  }

  // Import settings from JSON
  Future<void> importSettings(Map<String, dynamic> settings) async {
    if (settings.containsKey('themeMode')) {
      await setThemeMode(ThemeMode.values[settings['themeMode'] as int]);
    }
    if (settings.containsKey('textScale')) {
      await setTextScale(settings['textScale'] as double);
    }
    if (settings.containsKey('highContrast')) {
      await setHighContrast(settings['highContrast'] as bool);
    }
    if (settings.containsKey('notificationsEnabled')) {
      await setNotificationsEnabled(settings['notificationsEnabled'] as bool);
    }
    if (settings.containsKey('dailyGoalMinutes')) {
      await setDailyGoalMinutes(settings['dailyGoalMinutes'] as int);
    }
    if (settings.containsKey('dailyGoalLessons')) {
      await setDailyGoalLessons(settings['dailyGoalLessons'] as int);
    }
    if (settings.containsKey('audioSpeed')) {
      await setAudioSpeed(settings['audioSpeed'] as double);
    }
    if (settings.containsKey('autoPlay')) {
      await setAutoPlay(settings['autoPlay'] as bool);
    }
    if (settings.containsKey('loopAudio')) {
      await setLoopAudio(settings['loopAudio'] as bool);
    }
    if (settings.containsKey('reducedAnimations')) {
      await setReducedAnimations(settings['reducedAnimations'] as bool);
    }
    if (settings.containsKey('hapticFeedback')) {
      await setHapticFeedback(settings['hapticFeedback'] as bool);
    }
    if (settings.containsKey('soundEffects')) {
      await setSoundEffects(settings['soundEffects'] as bool);
    }
  }
}
