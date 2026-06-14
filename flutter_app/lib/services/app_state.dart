import 'package:flutter/foundation.dart';
import '../models/lesson.dart';
import '../models/placement_models.dart';
import '../models/quiz_models.dart';
import '../models/srs_card.dart';
import '../models/starred_phrase.dart';
import 'audio_service.dart';
import 'content_service.dart';
import 'learning_services.dart';
import 'notification_service.dart';
import 'storage_service.dart';

class AppState extends ChangeNotifier {
  final StorageService storage;
  final AudioService audioService;
  final NotificationService notificationService;
  final ContentService contentService;
  late final StreakService streakService;
  late final SrsService srsService;

  Language _currentLanguage = Language.chinese;
  ChineseScript _chineseScript = ChineseScript.simplified;
  bool _isLoading = true;

  AppState({
    required this.storage,
    required this.audioService,
    required this.notificationService,
    ContentService? contentService,
  }) : contentService = contentService ?? ContentService() {
    streakService = StreakService(storage);
    srsService = SrsService(storage, streakService);
    _initialize();
  }

  Language get currentLanguage => _currentLanguage;
  ChineseScript get chineseScript => _chineseScript;
  bool get isLoading => _isLoading;

  int get streakCount => storage.streakCount;
  int get srsDueCount => srsService.getDueCards().length;
  int get xpPoints => storage.getXpPoints();
  PlacementResult? get placementResult => storage.getPlacementResult();
  List<String> get earnedAchievements => storage.getEarnedAchievements();

  Future<void> _initialize() async {
    _isLoading = true;
    notifyListeners();
    try {
      await storage.init();
      await notificationService.init();
      _currentLanguage = Language.fromCode(storage.getPreferredLanguage());
      _chineseScript = storage.getChineseScript() == 'traditional'
          ? ChineseScript.traditional
          : ChineseScript.simplified;
      final audioSettings = await storage.getAudioSettings();
      await audioService.setPlaybackSpeed(audioSettings['playbackSpeed']);
      await audioService.setLooping(audioSettings['loopEnabled']);
      await streakService.updateAchievements();
    } catch (e) {
      debugPrint('Error initializing app state: $e');
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> setLanguage(Language language) async {
    _currentLanguage = language;
    await storage.setPreferredLanguage(language.code);
    notifyListeners();
  }

  Future<void> setChineseScript(ChineseScript script) async {
    _chineseScript = script;
    await storage.setChineseScript(script.name);
    notifyListeners();
  }

  Future<int> awardXp(int amount) async {
    final result = await storage.awardXp(amount);
    notifyListeners();
    return result;
  }

  Future<void> markDayComplete(int day) async {
    await storage.markDayComplete(day, _currentLanguage.code);
    await streakService.recordLearningActivity();
    await storage.awardXp(50);
    await notificationService.showCompletionNotification(day);
    notifyListeners();
  }

  bool isDayCompleted(int day) =>
      storage.isDayCompleted(day, _currentLanguage.code);

  double getProgressForLanguage(String langCode) =>
      storage.getProgressForLanguage(langCode);

  int get totalCompletedDays => storage.totalUniqueCompletedDays;

  int getCompletedDaysForLanguage(String langCode) =>
      storage.getCompletedDaysForLanguage(langCode);

  Future<void> setAudioSpeed(double speed) async {
    await audioService.setPlaybackSpeed(speed);
    final settings = await storage.getAudioSettings();
    settings['playbackSpeed'] = speed;
    await storage.saveAudioSettings(settings);
  }

  Future<void> setAudioLooping(bool loop) async {
    await audioService.setLooping(loop);
    final settings = await storage.getAudioSettings();
    settings['loopEnabled'] = loop;
    await storage.saveAudioSettings(settings);
  }

  Future<void> scheduleDailyReminder(int hour, int minute) async {
    await notificationService.scheduleDailyReminder(hour: hour, minute: minute);
    await storage.saveNotificationSettings({
      'enabled': true,
      'time': '$hour:${minute.toString().padLeft(2, '0')}',
    });
  }

  Future<void> cancelNotifications() async {
    await notificationService.cancelAllNotifications();
    await storage.saveNotificationSettings({'enabled': false, 'time': '09:00'});
  }

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

  Lesson getLesson(int day) => getAllLessons()[day - 1];

  // Starred phrases
  List<StarredPhrase> get starredPhrases => storage.getStarredPhrases();

  Future<bool> toggleStarredPhrase({
    required int day,
    required String sectionTitle,
    required String phrase,
  }) async {
    final lang = _currentLanguage.code;
    final id = StarredPhrase.makeId(day, lang, sectionTitle, phrase);
    final added = await storage.toggleStarredPhrase(StarredPhrase(
      id: id,
      day: day,
      lang: lang,
      phrase: phrase,
      sectionTitle: sectionTitle,
      createdAt: DateTime.now().toUtc(),
    ));
    notifyListeners();
    return added;
  }

  bool isPhraseStarred(int day, String sectionTitle, String phrase) {
    final id = StarredPhrase.makeId(
      day, _currentLanguage.code, sectionTitle, phrase);
    return storage.isPhraseStarred(id);
  }

  Future<void> removeStarredPhrase(String id) async {
    await storage.removeStarredPhrase(id);
    notifyListeners();
  }

  Future<void> addPhraseToSrs({
    required int day,
    required String sectionTitle,
    required String phrase,
  }) async {
    await srsService.upsertCard(
      day: day,
      lang: _currentLanguage.code,
      front: phrase,
      back: sectionTitle.isNotEmpty ? sectionTitle : 'Day $day',
    );
    notifyListeners();
  }

  // SRS
  List<SrsCard> get srsCards => storage.getSrsCards();
  List<SrsCard> get dueSrsCards => srsService.getDueCards();

  Future<void> seedSrsFromStarred() async {
    await srsService.seedFromStarred();
    notifyListeners();
  }

  Future<SrsCard?> reviewSrsCard(String cardId, String grade) async {
    final result = await srsService.reviewCard(cardId, grade);
    notifyListeners();
    return result;
  }

  // Supplementary / reading / writing completion
  Future<void> markSupplementaryComplete(String category) async {
    await storage.markSupplementaryComplete(category, _currentLanguage.code);
    await streakService.recordLearningActivity();
    notifyListeners();
  }

  bool isSupplementaryCompleted(String category) =>
      storage.isSupplementaryCompleted(category, _currentLanguage.code);

  Future<void> markReadingComplete(String level, String topic) async {
    await storage.markReadingComplete(level, topic, _currentLanguage.code);
    await streakService.recordLearningActivity();
    notifyListeners();
  }

  bool isReadingCompleted(String level, String topic) =>
      storage.isReadingCompleted(level, topic, _currentLanguage.code);

  Future<void> markWritingComplete(String type, String level) async {
    await storage.markWritingComplete(type, level, _currentLanguage.code);
    await streakService.recordLearningActivity();
    notifyListeners();
  }

  bool isWritingCompleted(String type, String level) =>
      storage.isWritingCompleted(type, level, _currentLanguage.code);

  // Placement & quiz
  Future<void> savePlacementResult(PlacementResult result) async {
    await storage.savePlacementResult(result);
    notifyListeners();
  }

  Future<void> saveQuizScore(QuizResult result) async {
    await storage.saveQuizScore(result);
    notifyListeners();
  }

  QuizResult? getQuizScoreForDay(int day) => storage.getQuizScoreForDay(day);

  @override
  void dispose() {
    audioService.dispose();
    super.dispose();
  }
}
