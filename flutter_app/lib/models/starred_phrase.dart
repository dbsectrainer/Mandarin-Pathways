class StarredPhrase {
  final String id;
  final int day;
  final String lang;
  final String phrase;
  final String sectionTitle;
  final DateTime createdAt;

  const StarredPhrase({
    required this.id,
    required this.day,
    required this.lang,
    required this.phrase,
    required this.sectionTitle,
    required this.createdAt,
  });

  factory StarredPhrase.fromJson(Map<String, dynamic> json) {
    return StarredPhrase(
      id: json['id'] as String? ?? '',
      day: (json['day'] as num?)?.toInt() ?? 0,
      lang: json['lang'] as String? ?? 'zh',
      phrase: json['phrase'] as String? ?? '',
      sectionTitle: json['sectionTitle'] as String? ?? '',
      createdAt: DateTime.tryParse(json['createdAt'] as String? ?? '') ??
          DateTime.now().toUtc(),
    );
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'day': day,
        'lang': lang,
        'phrase': phrase,
        'sectionTitle': sectionTitle,
        'createdAt': createdAt.toIso8601String(),
      };

  static String makeId(int day, String lang, String sectionTitle, String phrase) {
    return '$day|$lang|$sectionTitle|$phrase';
  }
}
