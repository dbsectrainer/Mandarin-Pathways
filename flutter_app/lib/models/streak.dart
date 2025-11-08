class Streak {
  final int currentStreak;
  final int longestStreak;
  final DateTime? lastStudyDate;
  final List<DateTime> studyDates;

  Streak({
    this.currentStreak = 0,
    this.longestStreak = 0,
    this.lastStudyDate,
    List<DateTime>? studyDates,
  }) : studyDates = studyDates ?? [];

  bool get isActiveToday {
    if (lastStudyDate == null) return false;
    final now = DateTime.now();
    final lastDate = lastStudyDate!;
    return now.year == lastDate.year &&
        now.month == lastDate.month &&
        now.day == lastDate.day;
  }

  bool get streakAtRisk {
    if (lastStudyDate == null) return true;
    final now = DateTime.now();
    final difference = now.difference(lastStudyDate!);
    return difference.inDays >= 1 && !isActiveToday;
  }

  Streak updateStreak(DateTime studyDate) {
    final newStudyDates = List<DateTime>.from(studyDates);

    // Normalize to date only (remove time component)
    final normalizedDate = DateTime(
      studyDate.year,
      studyDate.month,
      studyDate.day,
    );

    // Check if already studied today
    if (newStudyDates.any((date) =>
        date.year == normalizedDate.year &&
        date.month == normalizedDate.month &&
        date.day == normalizedDate.day)) {
      return this; // Already studied today
    }

    newStudyDates.add(normalizedDate);

    int newCurrentStreak = 1;
    int newLongestStreak = longestStreak;

    if (lastStudyDate != null) {
      final daysSinceLastStudy = normalizedDate.difference(lastStudyDate!).inDays;

      if (daysSinceLastStudy == 0) {
        // Same day, streak continues
        newCurrentStreak = currentStreak;
      } else if (daysSinceLastStudy == 1) {
        // Consecutive day, increment streak
        newCurrentStreak = currentStreak + 1;
      } else {
        // Streak broken, reset to 1
        newCurrentStreak = 1;
      }
    }

    // Update longest streak if current exceeds it
    if (newCurrentStreak > longestStreak) {
      newLongestStreak = newCurrentStreak;
    }

    return Streak(
      currentStreak: newCurrentStreak,
      longestStreak: newLongestStreak,
      lastStudyDate: normalizedDate,
      studyDates: newStudyDates,
    );
  }

  List<DateTime> getStudyDatesForMonth(int year, int month) {
    return studyDates.where((date) {
      return date.year == year && date.month == month;
    }).toList();
  }

  Map<String, int> getMonthlyStats() {
    final stats = <String, int>{};
    for (final date in studyDates) {
      final key = '${date.year}-${date.month.toString().padLeft(2, '0')}';
      stats[key] = (stats[key] ?? 0) + 1;
    }
    return stats;
  }

  int getStudyDaysInLastNDays(int days) {
    final now = DateTime.now();
    final startDate = now.subtract(Duration(days: days));
    return studyDates.where((date) => date.isAfter(startDate)).length;
  }

  Map<String, dynamic> toJson() {
    return {
      'currentStreak': currentStreak,
      'longestStreak': longestStreak,
      'lastStudyDate': lastStudyDate?.toIso8601String(),
      'studyDates': studyDates.map((d) => d.toIso8601String()).toList(),
    };
  }

  factory Streak.fromJson(Map<String, dynamic> json) {
    return Streak(
      currentStreak: json['currentStreak'] as int? ?? 0,
      longestStreak: json['longestStreak'] as int? ?? 0,
      lastStudyDate: json['lastStudyDate'] != null
          ? DateTime.parse(json['lastStudyDate'] as String)
          : null,
      studyDates: (json['studyDates'] as List<dynamic>?)
              ?.map((d) => DateTime.parse(d as String))
              .toList() ??
          [],
    );
  }
}

class WeeklyProgress {
  final Map<int, bool> weekDays; // 0-6 (Mon-Sun) -> completed

  WeeklyProgress() : weekDays = {};

  int get completedDays => weekDays.values.where((v) => v).length;
  double get completionRate => completedDays / 7;
  bool get isWeekComplete => completedDays == 7;

  void markDayComplete(int dayOfWeek) {
    weekDays[dayOfWeek] = true;
  }

  bool isDayComplete(int dayOfWeek) {
    return weekDays[dayOfWeek] ?? false;
  }
}
