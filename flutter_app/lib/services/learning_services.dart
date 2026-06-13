import '../models/achievement.dart';
import '../models/srs_card.dart';
import 'storage_service.dart';

class StreakService {
  final StorageService _storage;

  StreakService(this._storage);

  String _localDateString([DateTime? date]) {
    final d = date ?? DateTime.now();
    return '${d.year}-${d.month.toString().padLeft(2, '0')}-${d.day.toString().padLeft(2, '0')}';
  }

  int _daysBetween(String from, String to) {
    final fromDate = DateTime.parse('${from}T00:00:00');
    final toDate = DateTime.parse('${to}T00:00:00');
    return toDate.difference(fromDate).inDays;
  }

  Future<({String lastActiveDate, int streakCount})> recordLearningActivity([
    DateTime? date,
  ]) async {
    final today = _localDateString(date);
    var last = _storage.lastActiveDate;
    var count = _storage.streakCount;

    if (last.isEmpty) {
      count = 1;
    } else {
      final gap = _daysBetween(last, today);
      if (gap == 1) {
        count += 1;
      } else if (gap > 1) {
        count = 1;
      }
    }

    last = today;
    await _storage.setStreak(lastActiveDate: last, count: count);
    await updateAchievements();
    return (lastActiveDate: last, streakCount: count);
  }

  int getSrsReviewCount() =>
      _storage.getSrsCards().fold(0, (sum, c) => sum + c.reps);

  Future<List<String>> updateAchievements() async {
    final context = AchievementContext(
      completedLessonCount: _storage.totalUniqueCompletedDays,
      srsReviewCount: getSrsReviewCount(),
    );
    final earned = achievementDefs
        .where((a) => a.test(context))
        .map((a) => a.id)
        .toList();
    await _storage.setEarnedAchievements(earned);
    return earned;
  }
}

class SrsService {
  final StorageService _storage;
  final StreakService _streaks;

  SrsService(this._storage, this._streaks);

  static String cardId({
    int? day,
    required String lang,
    required String front,
    String back = '',
  }) {
    return '${day ?? 'misc'}|$lang|$front|$back';
  }

  List<SrsCard> getDueCards([DateTime? now]) {
    final current = (now ?? DateTime.now()).toUtc();
    return _storage
        .getSrsCards()
        .where((c) => !c.due.isAfter(current))
        .toList()
      ..sort((a, b) => a.due.compareTo(b.due));
  }

  Future<SrsCard?> upsertCard({
    String? id,
    int? day,
    required String lang,
    required String front,
    String back = '',
  }) async {
    if (front.trim().isEmpty) return null;
    final now = DateTime.now().toUtc();
    final cards = _storage.getSrsCards();
    final cardIdValue = id ?? SrsService.cardId(day: day, lang: lang, front: front, back: back);
    final existing = cards.indexWhere((c) => c.id == cardIdValue);
    final card = SrsCard(
      id: cardIdValue,
      day: day,
      lang: lang,
      front: front.trim(),
      back: back.trim(),
      due: now,
      createdAt: now,
      updatedAt: now,
    );
    if (existing >= 0) {
      cards[existing] = SrsCard(
        id: cardIdValue,
        day: day ?? cards[existing].day,
        lang: lang,
        front: card.front,
        back: card.back,
        due: cards[existing].due,
        interval: cards[existing].interval,
        ease: cards[existing].ease,
        reps: cards[existing].reps,
        createdAt: cards[existing].createdAt,
        updatedAt: now,
      );
    } else {
      cards.add(card);
    }
    await _storage.saveSrsCards(cards);
    return card;
  }

  Future<void> seedFromStarred() async {
    for (final entry in _storage.getStarredPhrases()) {
      await upsertCard(
        id: 'starred|${entry.id}',
        day: entry.day,
        lang: entry.lang,
        front: entry.phrase,
        back: entry.sectionTitle.isNotEmpty
            ? entry.sectionTitle
            : 'Day ${entry.day}',
      );
    }
  }

  Future<SrsCard?> reviewCard(String cardId, String grade) async {
    final cards = _storage.getSrsCards();
    final index = cards.indexWhere((c) => c.id == cardId);
    if (index < 0) return null;

    final card = cards[index];
    final easeDelta = grade == 'again'
        ? -0.2
        : grade == 'easy'
            ? 0.15
            : 0.0;
    final nextEase = (card.ease + easeDelta).clamp(1.3, double.infinity);
    int nextInterval;
    if (grade == 'again') {
      nextInterval = 0;
    } else if (card.reps == 0) {
      nextInterval = grade == 'easy' ? 3 : 1;
    } else {
      nextInterval = ((card.interval * nextEase) * (grade == 'easy' ? 1.3 : 1))
          .round()
          .clamp(1, 3650);
    }

    final due = DateTime.now().toUtc().add(Duration(days: nextInterval));
    cards[index] = card.copyWith(
      interval: nextInterval,
      ease: nextEase,
      reps: card.reps + 1,
      due: due,
      updatedAt: DateTime.now().toUtc(),
    );
    await _storage.saveSrsCards(cards);
    await _streaks.recordLearningActivity();
    return cards[index];
  }
}
