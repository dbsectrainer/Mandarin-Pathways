class PlacementQuestion {
  final String prompt;
  final List<String> options;
  final String answer;
  final String band;

  const PlacementQuestion({
    required this.prompt,
    required this.options,
    required this.answer,
    required this.band,
  });
}

class PlacementResult {
  final int score;
  final int total;
  final int percentage;
  final String level;
  final int recommendedDay;
  final String messageZh;
  final String messageEn;
  final DateTime completedAt;

  const PlacementResult({
    required this.score,
    required this.total,
    required this.percentage,
    required this.level,
    required this.recommendedDay,
    required this.messageZh,
    required this.messageEn,
    required this.completedAt,
  });

  factory PlacementResult.fromJson(Map<String, dynamic> json) {
    final message = json['message'];
    String zh = '';
    String en = '';
    if (message is Map) {
      zh = message['zh'] as String? ?? '';
      en = message['en'] as String? ?? '';
    }
    return PlacementResult(
      score: (json['score'] as num?)?.toInt() ?? 0,
      total: (json['total'] as num?)?.toInt() ?? 0,
      percentage: (json['percentage'] as num?)?.toInt() ?? 0,
      level: json['level'] as String? ?? '',
      recommendedDay: (json['recommendedDay'] as num?)?.toInt() ?? 1,
      messageZh: zh,
      messageEn: en,
      completedAt:
          DateTime.tryParse(json['completedAt'] as String? ?? '') ?? DateTime.now(),
    );
  }

  Map<String, dynamic> toJson() => {
        'score': score,
        'total': total,
        'percentage': percentage,
        'level': level,
        'recommendedDay': recommendedDay,
        'startDay': recommendedDay,
        'message': {'zh': messageZh, 'en': messageEn},
        'completedAt': completedAt.toIso8601String(),
      };
}
