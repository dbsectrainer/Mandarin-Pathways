import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/lesson.dart';
import '../models/placement_models.dart';
import '../models/quiz_models.dart';
import '../models/srs_card.dart';
import '../models/starred_phrase.dart';

/// Mirrors PWA localStorage keys from js/data-portability.js.
class StorageService {
  static const dataExportVersion = 1;

  static const portabilityKeys = [
    'preferredLanguage',
    'completedDays',
    'currentProgress',
    'completedReadings',
    'completedWritings',
    'completedSupplementary',
    'mandarin_pathways_notifications',
    'starredPhrases',
    'srsCards',
    'lastActiveDate',
    'streakCount',
    'earnedAchievements',
    'placementResult',
    'quizScores',
  ];

  late SharedPreferences _prefs;

  Future<void> init() async {
    _prefs = await SharedPreferences.getInstance();
    await _migrateLegacyProgress();
  }

  Future<void> _migrateLegacyProgress() async {
    const legacyKey = 'user_progress';
    final legacy = _prefs.getString(legacyKey);
    if (legacy == null) return;
    try {
      final jsonMap = json.decode(legacy) as Map<String, dynamic>;
      final completedDays = jsonMap['completedDays'] as Map<String, dynamic>?;
      if (completedDays != null) {
        final flat = getCompletedDaysFlat();
        for (final entry in completedDays.entries) {
          final lang = entry.key;
          final days = (entry.value as List).cast<num>();
          for (final day in days) {
            flat['${day.toInt()}_$lang'] = true;
          }
        }
        await setCompletedDaysFlat(flat);
      }
      await _prefs.remove(legacyKey);
    } catch (_) {}
  }

  static String normalizeLangCode(String code) {
    if (code == 'zh' || code == 'zh-CN') return 'zh';
    return code;
  }

  static String toWebLangCode(String code) {
    if (code == 'zh') return 'zh-CN';
    return code;
  }

  // --- Completed days (web flat format) ---

  Map<String, bool> getCompletedDaysFlat() {
    final raw = _prefs.getString('completedDays');
    if (raw == null) return {};
    try {
      final parsed = json.decode(raw) as Map<String, dynamic>;
      return parsed.map((k, v) => MapEntry(k, v == true));
    } catch (_) {
      return {};
    }
  }

  Future<void> setCompletedDaysFlat(Map<String, bool> value) async {
    await _prefs.setString('completedDays', json.encode(value));
  }

  Future<void> markDayComplete(int day, String lang) async {
    final flat = getCompletedDaysFlat();
    flat['${day}_$lang'] = true;
    await setCompletedDaysFlat(flat);
    await _prefs.setString(
      'currentProgress',
      json.encode({'lang': lang, 'completed': _countForLang(flat, lang)}),
    );
  }

  bool isDayCompleted(int day, String lang) =>
      getCompletedDaysFlat()['${day}_$lang'] == true;

  int _countForLang(Map<String, bool> flat, String lang) =>
      flat.keys.where((k) => k.endsWith('_$lang') && flat[k] == true).length;

  Progress getProgressView() {
    final flat = getCompletedDaysFlat();
    final completedDays = <String, Set<int>>{};
    for (final entry in flat.entries) {
      if (entry.value != true) continue;
      final parts = entry.key.split('_');
      if (parts.length < 2) continue;
      final day = int.tryParse(parts[0]);
      final lang = parts.sublist(1).join('_');
      if (day == null) continue;
      completedDays.putIfAbsent(lang, () => <int>{}).add(day);
    }
    return Progress(
      completedDays: completedDays,
      preferredLanguage: normalizeLangCode(getPreferredLanguage()),
    );
  }

  double getProgressForLanguage(String lang) =>
      _countForLang(getCompletedDaysFlat(), lang) / 40.0;

  int getCompletedDaysForLanguage(String lang) =>
      _countForLang(getCompletedDaysFlat(), lang);

  int get totalUniqueCompletedDays {
    final days = <int>{};
    for (final key in getCompletedDaysFlat().keys) {
      if (getCompletedDaysFlat()[key] != true) continue;
      final day = int.tryParse(key.split('_').first);
      if (day != null) days.add(day);
    }
    return days.length;
  }

  // --- Generic completion maps ---

  Map<String, bool> _getBoolMap(String key) {
    final raw = _prefs.getString(key);
    if (raw == null) return {};
    try {
      return (json.decode(raw) as Map<String, dynamic>)
          .map((k, v) => MapEntry(k, v == true));
    } catch (_) {
      return {};
    }
  }

  Future<void> _setBoolMap(String key, Map<String, bool> value) async {
    await _prefs.setString(key, json.encode(value));
  }

  bool isReadingCompleted(String level, String topic, String lang) =>
      _getBoolMap('completedReadings')['${level}_${topic}_$lang'] == true;

  Future<void> markReadingComplete(String level, String topic, String lang) async {
    final map = _getBoolMap('completedReadings');
    map['${level}_${topic}_$lang'] = true;
    await _setBoolMap('completedReadings', map);
  }

  bool isWritingCompleted(String type, String level, String lang) =>
      _getBoolMap('completedWritings')['${type}_${level}_$lang'] == true;

  Future<void> markWritingComplete(String type, String level, String lang) async {
    final map = _getBoolMap('completedWritings');
    map['${type}_${level}_$lang'] = true;
    await _setBoolMap('completedWritings', map);
  }

  bool isSupplementaryCompleted(String category, String lang) =>
      _getBoolMap('completedSupplementary')['${category}_$lang'] == true;

  Future<void> markSupplementaryComplete(String category, String lang) async {
    final map = _getBoolMap('completedSupplementary');
    map['${category}_$lang'] = true;
    await _setBoolMap('completedSupplementary', map);
  }

  // --- Starred phrases ---

  List<StarredPhrase> getStarredPhrases() {
    final raw = _prefs.getString('starredPhrases');
    if (raw == null) return [];
    try {
      final list = json.decode(raw) as List;
      return list
          .whereType<Map<String, dynamic>>()
          .map(StarredPhrase.fromJson)
          .toList();
    } catch (_) {
      return [];
    }
  }

  Future<void> saveStarredPhrases(List<StarredPhrase> phrases) async {
    await _prefs.setString(
      'starredPhrases',
      json.encode(phrases.map((p) => p.toJson()).toList()),
    );
  }

  bool isPhraseStarred(String id) =>
      getStarredPhrases().any((p) => p.id == id);

  Future<bool> toggleStarredPhrase(StarredPhrase entry) async {
    final list = getStarredPhrases();
    final ix = list.indexWhere((p) => p.id == entry.id);
    if (ix >= 0) {
      list.removeAt(ix);
      await saveStarredPhrases(list);
      return false;
    }
    list.add(entry);
    await saveStarredPhrases(list);
    return true;
  }

  Future<void> removeStarredPhrase(String id) async {
    await saveStarredPhrases(
      getStarredPhrases().where((p) => p.id != id).toList(),
    );
  }

  // --- SRS ---

  List<SrsCard> getSrsCards() {
    final raw = _prefs.getString('srsCards');
    if (raw == null) return [];
    try {
      final list = json.decode(raw) as List;
      return list
          .whereType<Map<String, dynamic>>()
          .map(SrsCard.fromJson)
          .toList();
    } catch (_) {
      return [];
    }
  }

  Future<void> saveSrsCards(List<SrsCard> cards) async {
    await _prefs.setString(
      'srsCards',
      json.encode(cards.map((c) => c.toJson()).toList()),
    );
  }

  // --- Streaks ---

  String get lastActiveDate => _prefs.getString('lastActiveDate') ?? '';

  int get streakCount => _prefs.getInt('streakCount') ?? 0;

  Future<void> setStreak({required String lastActiveDate, required int count}) async {
    await _prefs.setString('lastActiveDate', lastActiveDate);
    await _prefs.setInt('streakCount', count);
  }

  List<String> getEarnedAchievements() {
    final raw = _prefs.getString('earnedAchievements');
    if (raw == null) return [];
    try {
      return (json.decode(raw) as List).cast<String>();
    } catch (_) {
      return [];
    }
  }

  Future<void> setEarnedAchievements(List<String> ids) async {
    await _prefs.setString('earnedAchievements', json.encode(ids.toSet().toList()));
  }

  // --- Placement ---

  PlacementResult? getPlacementResult() {
    final raw = _prefs.getString('placementResult');
    if (raw == null) return null;
    try {
      return PlacementResult.fromJson(json.decode(raw) as Map<String, dynamic>);
    } catch (_) {
      return null;
    }
  }

  Future<void> savePlacementResult(PlacementResult result) async {
    await _prefs.setString('placementResult', json.encode(result.toJson()));
  }

  // --- Quiz ---

  Map<String, dynamic> getQuizScores() {
    final raw = _prefs.getString('quizScores');
    if (raw == null) return {};
    try {
      return json.decode(raw) as Map<String, dynamic>;
    } catch (_) {
      return {};
    }
  }

  QuizResult? getQuizScoreForDay(int day) {
    final saved = getQuizScores()['day$day'];
    if (saved is! Map<String, dynamic>) return null;
    return QuizResult.fromStored(day, saved);
  }

  Future<void> saveQuizScore(QuizResult result) async {
    final scores = getQuizScores();
    final key = 'day${result.day}';
    final previous = scores[key];
    final previousBest = (previous is Map ? previous['bestScore'] as num? : null)?.toInt();
    if (previousBest == null || result.score >= previousBest) {
      scores[key] = result.toJson();
      await _prefs.setString('quizScores', json.encode(scores));
    }
  }

  // --- XP / Level system ---

  int getXpPoints() => _prefs.getInt('xpPoints') ?? 0;

  Future<int> awardXp(int amount) async {
    final current = getXpPoints();
    final next = current + amount;
    await _prefs.setInt('xpPoints', next);
    return next;
  }

  // --- Chinese script preference ---

  String getChineseScript() => _prefs.getString('chineseScript') ?? 'simplified';

  Future<void> setChineseScript(String script) async {
    await _prefs.setString('chineseScript', script);
  }

  // --- Language / settings ---

  String getPreferredLanguage() {
    final stored = _prefs.getString('preferredLanguage') ?? 'zh';
    return normalizeLangCode(stored);
  }

  Future<void> setPreferredLanguage(String language) async {
    await _prefs.setString('preferredLanguage', toWebLangCode(language));
  }

  Future<Map<String, dynamic>> getNotificationSettings() async {
    final raw = _prefs.getString('mandarin_pathways_notifications');
    if (raw == null) {
      return {'enabled': true, 'time': '09:00'};
    }
    try {
      return json.decode(raw) as Map<String, dynamic>;
    } catch (_) {
      return {'enabled': true, 'time': '09:00'};
    }
  }

  Future<void> saveNotificationSettings(Map<String, dynamic> settings) async {
    await _prefs.setString('mandarin_pathways_notifications', json.encode(settings));
  }

  Future<Map<String, dynamic>> getAudioSettings() async {
    return {
      'playbackSpeed': _prefs.getDouble('audio_speed') ?? 1.0,
      'autoPlay': _prefs.getBool('audio_autoplay') ?? false,
      'loopEnabled': _prefs.getBool('audio_loop') ?? false,
    };
  }

  Future<void> saveAudioSettings(Map<String, dynamic> settings) async {
    await _prefs.setDouble('audio_speed', settings['playbackSpeed'] ?? 1.0);
    await _prefs.setBool('audio_autoplay', settings['autoPlay'] ?? false);
    await _prefs.setBool('audio_loop', settings['loopEnabled'] ?? false);
  }

  Future<String?> getNoteForDay(int day, String language) async =>
      _prefs.getString('note_${day}_$language');

  Future<void> saveNoteForDay(int day, String language, String note) async {
    await _prefs.setString('note_${day}_$language', note);
  }

  // --- Portability ---

  Map<String, String> collectPortabilityPayload() {
    final keys = <String, String>{};
    for (final key in portabilityKeys) {
      final value = _prefs.getString(key);
      if (value != null) keys[key] = value;
      final intValue = _prefs.getInt(key);
      if (intValue != null) keys[key] = intValue.toString();
    }
    return keys;
  }

  Future<void> importPortabilityPayload(Map<String, dynamic> keys) async {
    for (final key in portabilityKeys) {
      await _prefs.remove(key);
    }
    for (final key in portabilityKeys) {
      final value = keys[key];
      if (value == null) continue;
      if (key == 'streakCount') {
        await _prefs.setInt(key, int.tryParse(value.toString()) ?? 0);
      } else {
        await _prefs.setString(key, value.toString());
      }
    }
  }

  String exportPortabilityJson() {
    return json.encode({
      'version': dataExportVersion,
      'exportedAt': DateTime.now().toUtc().toIso8601String(),
      'keys': collectPortabilityPayload(),
    });
  }

  Future<void> clearAll() async => _prefs.clear();
}
