import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'dart:convert';
import '../models/achievement.dart';
import '../models/user_profile.dart';
import '../models/streak.dart';

class GamificationService extends ChangeNotifier {
  static const String _keyUserProfile = 'user_profile';
  static const String _keyAchievements = 'achievements';
  static const String _keyStreak = 'streak';

  final SharedPreferences _prefs;

  late UserProfile _userProfile;
  late List<Achievement> _achievements;
  late Streak _streak;

  bool _isInitialized = false;

  GamificationService(this._prefs) {
    _initialize();
  }

  // Getters
  UserProfile get userProfile => _userProfile;
  List<Achievement> get achievements => _achievements;
  Streak get streak => _streak;
  bool get isInitialized => _isInitialized;

  List<Achievement> get unlockedAchievements =>
      _achievements.where((a) => a.isUnlocked).toList();

  List<Achievement> get lockedAchievements =>
      _achievements.where((a) => !a.isUnlocked).toList();

  int get totalXP => _userProfile.totalXP;
  int get currentLevel => _userProfile.currentLevel;
  int get currentStreak => _streak.currentStreak;
  int get longestStreak => _streak.longestStreak;

  Future<void> _initialize() async {
    await _loadUserProfile();
    await _loadAchievements();
    await _loadStreak();
    _isInitialized = true;
    notifyListeners();
  }

  Future<void> _loadUserProfile() async {
    final profileJson = _prefs.getString(_keyUserProfile);
    if (profileJson != null) {
      _userProfile = UserProfile.fromJson(json.decode(profileJson));
    } else {
      _userProfile = UserProfile(
        id: DateTime.now().millisecondsSinceEpoch.toString(),
        name: 'Learner',
        joinDate: DateTime.now(),
      );
      await _saveUserProfile();
    }
  }

  Future<void> _saveUserProfile() async {
    await _prefs.setString(_keyUserProfile, json.encode(_userProfile.toJson()));
    notifyListeners();
  }

  Future<void> _loadAchievements() async {
    final achievementsJson = _prefs.getString(_keyAchievements);
    if (achievementsJson != null) {
      final List<dynamic> decoded = json.decode(achievementsJson);
      _achievements = decoded.map((a) => Achievement.fromJson(a)).toList();
    } else {
      _achievements = Achievements.getAll();
      await _saveAchievements();
    }
  }

  Future<void> _saveAchievements() async {
    final encoded = json.encode(_achievements.map((a) => a.toJson()).toList());
    await _prefs.setString(_keyAchievements, encoded);
    notifyListeners();
  }

  Future<void> _loadStreak() async {
    final streakJson = _prefs.getString(_keyStreak);
    if (streakJson != null) {
      _streak = Streak.fromJson(json.decode(streakJson));
    } else {
      _streak = Streak();
      await _saveStreak();
    }
  }

  Future<void> _saveStreak() async {
    await _prefs.setString(_keyStreak, json.encode(_streak.toJson()));
    notifyListeners();
  }

  // Update user profile
  Future<void> updateUserProfile({
    String? name,
    String? email,
    String? avatarUrl,
  }) async {
    _userProfile = _userProfile.copyWith(
      name: name ?? _userProfile.name,
      email: email ?? _userProfile.email,
      avatarUrl: avatarUrl ?? _userProfile.avatarUrl,
    );
    await _saveUserProfile();
  }

  // Add XP and check for level up
  Future<List<String>> addXP(int xp, {String? reason}) async {
    final List<String> notifications = [];
    final oldLevel = _userProfile.currentLevel;
    var newXP = _userProfile.totalXP + xp;
    var newLevel = oldLevel;

    // Calculate level ups
    while (newXP >= newLevel * 100) {
      newXP -= newLevel * 100;
      newLevel++;
      notifications.add('🎉 Level Up! You are now level $newLevel!');
    }

    // Reset XP to the remainder after level ups
    if (newLevel > oldLevel) {
      newXP = _userProfile.totalXP + xp;
      for (var i = oldLevel; i < newLevel; i++) {
        newXP -= i * 100;
      }
    }

    _userProfile = _userProfile.copyWith(
      totalXP: _userProfile.totalXP + xp,
      currentLevel: newLevel,
    );

    await _saveUserProfile();
    return notifications;
  }

  // Update streak
  Future<void> updateStreak() async {
    final now = DateTime.now();
    _streak = _streak.updateStreak(now);

    // Update user profile streak
    _userProfile = _userProfile.copyWith(
      currentStreak: _streak.currentStreak,
      longestStreak: _streak.longestStreak,
      lastStudyDate: now,
    );

    await _saveStreak();
    await _saveUserProfile();

    // Check streak-based achievements
    await _checkStreakAchievements();
  }

  // Check and unlock achievements
  Future<List<Achievement>> checkAchievements({
    int? lessonsCompleted,
    int? readingCompleted,
    int? writingCompleted,
    DateTime? completionTime,
  }) async {
    final List<Achievement> newlyUnlocked = [];

    for (var i = 0; i < _achievements.length; i++) {
      final achievement = _achievements[i];

      if (achievement.isUnlocked) continue;

      bool shouldUnlock = false;
      int newCurrentValue = achievement.currentValue;

      switch (achievement.id) {
        // Streak achievements (handled separately)
        case 'streak_3':
        case 'streak_7':
        case 'streak_14':
        case 'streak_30':
          continue; // Handled by _checkStreakAchievements

        // Completion achievements
        case 'complete_10':
        case 'complete_20':
        case 'complete_30':
        case 'complete_40':
          if (lessonsCompleted != null) {
            newCurrentValue = lessonsCompleted;
            shouldUnlock = lessonsCompleted >= achievement.requiredValue;
          }
          break;

        // Reading achievements
        case 'reading_beginner':
        case 'reading_intermediate':
          if (readingCompleted != null) {
            newCurrentValue = readingCompleted;
            shouldUnlock = readingCompleted >= achievement.requiredValue;
          }
          break;

        // Writing achievements
        case 'writing_beginner':
        case 'writing_intermediate':
          if (writingCompleted != null) {
            newCurrentValue = writingCompleted;
            shouldUnlock = writingCompleted >= achievement.requiredValue;
          }
          break;

        // Time-based achievements
        case 'early_bird':
          if (completionTime != null && completionTime.hour < 8) {
            newCurrentValue = 1;
            shouldUnlock = true;
          }
          break;

        case 'night_owl':
          if (completionTime != null && completionTime.hour >= 22) {
            newCurrentValue = 1;
            shouldUnlock = true;
          }
          break;

        // First lesson
        case 'first_lesson':
          if (lessonsCompleted != null && lessonsCompleted >= 1) {
            newCurrentValue = 1;
            shouldUnlock = true;
          }
          break;

        // Section achievements
        case 'section_basics':
          if (lessonsCompleted != null && lessonsCompleted >= 7) {
            newCurrentValue = lessonsCompleted;
            shouldUnlock = true;
          }
          break;

        case 'section_essentials':
          if (lessonsCompleted != null && lessonsCompleted >= 14) {
            newCurrentValue = lessonsCompleted;
            shouldUnlock = true;
          }
          break;

        case 'section_cultural':
          if (lessonsCompleted != null && lessonsCompleted >= 22) {
            newCurrentValue = lessonsCompleted;
            shouldUnlock = true;
          }
          break;
      }

      if (shouldUnlock || newCurrentValue != achievement.currentValue) {
        final updatedAchievement = achievement.copyWith(
          currentValue: newCurrentValue,
          unlockedAt: shouldUnlock ? DateTime.now() : null,
        );

        _achievements[i] = updatedAchievement;

        if (shouldUnlock) {
          newlyUnlocked.add(updatedAchievement);

          // Add XP reward
          await addXP(updatedAchievement.xpReward,
              reason: 'Achievement: ${updatedAchievement.title}');

          // Add to user profile unlocked achievements
          if (!_userProfile.unlockedAchievements
              .contains(updatedAchievement.id)) {
            _userProfile = _userProfile.copyWith(
              unlockedAchievements: [
                ..._userProfile.unlockedAchievements,
                updatedAchievement.id,
              ],
            );
          }
        }
      }
    }

    if (newlyUnlocked.isNotEmpty) {
      await _saveAchievements();
      await _saveUserProfile();
    }

    return newlyUnlocked;
  }

  Future<void> _checkStreakAchievements() async {
    final streakAchievements = _achievements.where((a) =>
        a.type == AchievementType.streak && !a.isUnlocked).toList();

    for (var achievement in streakAchievements) {
      if (_streak.currentStreak >= achievement.requiredValue) {
        await checkAchievements();
        final index = _achievements.indexWhere((a) => a.id == achievement.id);
        if (index != -1) {
          _achievements[index] = achievement.copyWith(
            currentValue: _streak.currentStreak,
            unlockedAt: DateTime.now(),
          );

          // Add XP reward
          await addXP(achievement.xpReward,
              reason: 'Achievement: ${achievement.title}');
        }
      }
    }

    await _saveAchievements();
  }

  // Update skill progress
  Future<void> updateSkillProgress(String skill, int count) async {
    final newProgress = Map<String, int>.from(_userProfile.skillProgress);
    newProgress[skill] = count;

    _userProfile = _userProfile.copyWith(skillProgress: newProgress);
    await _saveUserProfile();
  }

  // Get statistics
  Map<String, dynamic> getStatistics() {
    final daysStudied = _streak.studyDates.length;
    final averageXPPerDay = daysStudied > 0 ? _userProfile.totalXP / daysStudied : 0;

    return {
      'totalXP': _userProfile.totalXP,
      'currentLevel': _userProfile.currentLevel,
      'currentStreak': _streak.currentStreak,
      'longestStreak': _streak.longestStreak,
      'daysStudied': daysStudied,
      'averageXPPerDay': averageXPPerDay.round(),
      'achievementsUnlocked': unlockedAchievements.length,
      'achievementsTotal': _achievements.length,
      'lessonsCompleted': _userProfile.totalLessonsCompleted,
    };
  }

  // Reset all data (for testing or user request)
  Future<void> resetAllData() async {
    _userProfile = UserProfile(
      id: DateTime.now().millisecondsSinceEpoch.toString(),
      name: 'Learner',
    );
    _achievements = Achievements.getAll();
    _streak = Streak();

    await _saveUserProfile();
    await _saveAchievements();
    await _saveStreak();
  }
}
