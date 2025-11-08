class Lesson {
  final int day;
  final String title;
  final String description;
  final LessonSection section;
  final Map<String, String> audioFiles; // language -> file path
  final Map<String, String> textFiles; // language -> file path
  final String? videoId;

  Lesson({
    required this.day,
    required this.title,
    required this.description,
    required this.section,
    required this.audioFiles,
    required this.textFiles,
    this.videoId,
  });

  factory Lesson.fromJson(Map<String, dynamic> json) {
    return Lesson(
      day: json['day'] as int,
      title: json['title'] as String,
      description: json['description'] as String,
      section: LessonSection.fromString(json['section'] as String),
      audioFiles: Map<String, String>.from(json['audioFiles'] as Map),
      textFiles: Map<String, String>.from(json['textFiles'] as Map),
      videoId: json['videoId'] as String?,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'day': day,
      'title': title,
      'description': description,
      'section': section.name,
      'audioFiles': audioFiles,
      'textFiles': textFiles,
      'videoId': videoId,
    };
  }
}

enum LessonSection {
  basics('Days 1-7', 'Pinyin system, tones, and pronunciation basics'),
  essentials('Days 8-14', 'Essential daily phrases and basic grammar'),
  cultural('Days 15-22', 'Cultural context and daily life communication'),
  professional('Days 23-30', 'Professional and business Mandarin'),
  advanced('Days 31-40', 'Advanced fluency and real-world applications');

  final String title;
  final String description;

  const LessonSection(this.title, this.description);

  static LessonSection fromString(String str) {
    return LessonSection.values.firstWhere(
      (e) => e.name == str.toLowerCase(),
      orElse: () => LessonSection.basics,
    );
  }

  static LessonSection fromDay(int day) {
    if (day <= 7) return LessonSection.basics;
    if (day <= 14) return LessonSection.essentials;
    if (day <= 22) return LessonSection.cultural;
    if (day <= 30) return LessonSection.professional;
    return LessonSection.advanced;
  }
}

class Progress {
  final Map<String, Set<int>> completedDays; // language -> Set of completed days
  final String preferredLanguage;
  final DateTime lastStudied;

  Progress({
    Map<String, Set<int>>? completedDays,
    this.preferredLanguage = 'zh',
    DateTime? lastStudied,
  })  : completedDays = completedDays ?? {},
        lastStudied = lastStudied ?? DateTime.now();

  int get totalCompleted {
    final Set<int> allDays = {};
    completedDays.values.forEach((days) => allDays.addAll(days));
    return allDays.length;
  }

  double getProgressForLanguage(String lang) {
    final completed = completedDays[lang]?.length ?? 0;
    return completed / 40.0;
  }

  bool isDayCompleted(int day, String lang) {
    return completedDays[lang]?.contains(day) ?? false;
  }

  void markDayComplete(int day, String lang) {
    completedDays.putIfAbsent(lang, () => <int>{});
    completedDays[lang]!.add(day);
  }

  Map<String, dynamic> toJson() {
    return {
      'completedDays': completedDays.map(
        (key, value) => MapEntry(key, value.toList()),
      ),
      'preferredLanguage': preferredLanguage,
      'lastStudied': lastStudied.toIso8601String(),
    };
  }

  factory Progress.fromJson(Map<String, dynamic> json) {
    return Progress(
      completedDays: (json['completedDays'] as Map<String, dynamic>).map(
        (key, value) => MapEntry(key, Set<int>.from(value as List)),
      ),
      preferredLanguage: json['preferredLanguage'] as String,
      lastStudied: DateTime.parse(json['lastStudied'] as String),
    );
  }
}

enum Language {
  chinese('zh', '简体中文', '🇨🇳'),
  pinyin('pinyin', 'Pinyin', '🔤'),
  english('en', 'English', '🇺🇸');

  final String code;
  final String displayName;
  final String flag;

  const Language(this.code, this.displayName, this.flag);

  static Language fromCode(String code) {
    return Language.values.firstWhere(
      (e) => e.code == code,
      orElse: () => Language.chinese,
    );
  }
}
