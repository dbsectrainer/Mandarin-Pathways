class UserProfile {
  final String id;
  final String name;
  final String? email;
  final String? avatarUrl;
  final DateTime joinDate;
  final int totalXP;
  final int currentLevel;
  final int currentStreak;
  final int longestStreak;
  final Map<String, int> skillProgress; // skill -> completed count
  final List<String> unlockedAchievements;
  final DailyGoal dailyGoal;
  final DateTime? lastStudyDate;
  final Map<String, dynamic> preferences;

  UserProfile({
    required this.id,
    this.name = 'Learner',
    this.email,
    this.avatarUrl,
    DateTime? joinDate,
    this.totalXP = 0,
    this.currentLevel = 1,
    this.currentStreak = 0,
    this.longestStreak = 0,
    Map<String, int>? skillProgress,
    List<String>? unlockedAchievements,
    DailyGoal? dailyGoal,
    this.lastStudyDate,
    Map<String, dynamic>? preferences,
  })  : joinDate = joinDate ?? DateTime.now(),
        skillProgress = skillProgress ?? {},
        unlockedAchievements = unlockedAchievements ?? [],
        dailyGoal = dailyGoal ?? DailyGoal(),
        preferences = preferences ?? {};

  int get xpForNextLevel => currentLevel * 100;
  double get levelProgress => totalXP % xpForNextLevel / xpForNextLevel;

  int get totalLessonsCompleted =>
      skillProgress.values.fold(0, (sum, value) => sum + value);

  String get levelTitle {
    if (currentLevel < 5) return 'Beginner';
    if (currentLevel < 10) return 'Novice';
    if (currentLevel < 15) return 'Intermediate';
    if (currentLevel < 20) return 'Advanced';
    if (currentLevel < 30) return 'Expert';
    return 'Master';
  }

  UserProfile copyWith({
    String? id,
    String? name,
    String? email,
    String? avatarUrl,
    DateTime? joinDate,
    int? totalXP,
    int? currentLevel,
    int? currentStreak,
    int? longestStreak,
    Map<String, int>? skillProgress,
    List<String>? unlockedAchievements,
    DailyGoal? dailyGoal,
    DateTime? lastStudyDate,
    Map<String, dynamic>? preferences,
  }) {
    return UserProfile(
      id: id ?? this.id,
      name: name ?? this.name,
      email: email ?? this.email,
      avatarUrl: avatarUrl ?? this.avatarUrl,
      joinDate: joinDate ?? this.joinDate,
      totalXP: totalXP ?? this.totalXP,
      currentLevel: currentLevel ?? this.currentLevel,
      currentStreak: currentStreak ?? this.currentStreak,
      longestStreak: longestStreak ?? this.longestStreak,
      skillProgress: skillProgress ?? this.skillProgress,
      unlockedAchievements: unlockedAchievements ?? this.unlockedAchievements,
      dailyGoal: dailyGoal ?? this.dailyGoal,
      lastStudyDate: lastStudyDate ?? this.lastStudyDate,
      preferences: preferences ?? this.preferences,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'email': email,
      'avatarUrl': avatarUrl,
      'joinDate': joinDate.toIso8601String(),
      'totalXP': totalXP,
      'currentLevel': currentLevel,
      'currentStreak': currentStreak,
      'longestStreak': longestStreak,
      'skillProgress': skillProgress,
      'unlockedAchievements': unlockedAchievements,
      'dailyGoal': dailyGoal.toJson(),
      'lastStudyDate': lastStudyDate?.toIso8601String(),
      'preferences': preferences,
    };
  }

  factory UserProfile.fromJson(Map<String, dynamic> json) {
    return UserProfile(
      id: json['id'] as String,
      name: json['name'] as String? ?? 'Learner',
      email: json['email'] as String?,
      avatarUrl: json['avatarUrl'] as String?,
      joinDate: DateTime.parse(json['joinDate'] as String),
      totalXP: json['totalXP'] as int? ?? 0,
      currentLevel: json['currentLevel'] as int? ?? 1,
      currentStreak: json['currentStreak'] as int? ?? 0,
      longestStreak: json['longestStreak'] as int? ?? 0,
      skillProgress: Map<String, int>.from(json['skillProgress'] as Map? ?? {}),
      unlockedAchievements:
          List<String>.from(json['unlockedAchievements'] as List? ?? []),
      dailyGoal: json['dailyGoal'] != null
          ? DailyGoal.fromJson(json['dailyGoal'] as Map<String, dynamic>)
          : DailyGoal(),
      lastStudyDate: json['lastStudyDate'] != null
          ? DateTime.parse(json['lastStudyDate'] as String)
          : null,
      preferences:
          Map<String, dynamic>.from(json['preferences'] as Map? ?? {}),
    );
  }
}

class DailyGoal {
  final int targetMinutes;
  final int targetLessons;
  final bool notificationsEnabled;
  final DateTime? notificationTime;

  DailyGoal({
    this.targetMinutes = 15,
    this.targetLessons = 1,
    this.notificationsEnabled = true,
    this.notificationTime,
  });

  DailyGoal copyWith({
    int? targetMinutes,
    int? targetLessons,
    bool? notificationsEnabled,
    DateTime? notificationTime,
  }) {
    return DailyGoal(
      targetMinutes: targetMinutes ?? this.targetMinutes,
      targetLessons: targetLessons ?? this.targetLessons,
      notificationsEnabled: notificationsEnabled ?? this.notificationsEnabled,
      notificationTime: notificationTime ?? this.notificationTime,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'targetMinutes': targetMinutes,
      'targetLessons': targetLessons,
      'notificationsEnabled': notificationsEnabled,
      'notificationTime': notificationTime?.toIso8601String(),
    };
  }

  factory DailyGoal.fromJson(Map<String, dynamic> json) {
    return DailyGoal(
      targetMinutes: json['targetMinutes'] as int? ?? 15,
      targetLessons: json['targetLessons'] as int? ?? 1,
      notificationsEnabled: json['notificationsEnabled'] as bool? ?? true,
      notificationTime: json['notificationTime'] != null
          ? DateTime.parse(json['notificationTime'] as String)
          : null,
    );
  }
}

class StudySession {
  final String id;
  final DateTime startTime;
  final DateTime? endTime;
  final int lessonsCompleted;
  final int xpEarned;
  final List<int> completedDays;

  StudySession({
    required this.id,
    required this.startTime,
    this.endTime,
    this.lessonsCompleted = 0,
    this.xpEarned = 0,
    List<int>? completedDays,
  }) : completedDays = completedDays ?? [];

  Duration get duration =>
      (endTime ?? DateTime.now()).difference(startTime);

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'startTime': startTime.toIso8601String(),
      'endTime': endTime?.toIso8601String(),
      'lessonsCompleted': lessonsCompleted,
      'xpEarned': xpEarned,
      'completedDays': completedDays,
    };
  }

  factory StudySession.fromJson(Map<String, dynamic> json) {
    return StudySession(
      id: json['id'] as String,
      startTime: DateTime.parse(json['startTime'] as String),
      endTime: json['endTime'] != null
          ? DateTime.parse(json['endTime'] as String)
          : null,
      lessonsCompleted: json['lessonsCompleted'] as int? ?? 0,
      xpEarned: json['xpEarned'] as int? ?? 0,
      completedDays: List<int>.from(json['completedDays'] as List? ?? []),
    );
  }
}
