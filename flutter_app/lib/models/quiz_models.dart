class QuizQuestion {
  final String type;
  final String prompt;
  final List<String> options;
  final String answer;

  const QuizQuestion({
    required this.type,
    required this.prompt,
    this.options = const [],
    required this.answer,
  });
}

class QuizSet {
  final String title;
  final List<QuizQuestion> questions;

  const QuizSet({required this.title, required this.questions});
}

class QuizResult {
  final int day;
  final String title;
  final int score;
  final int total;
  final int percentage;
  final DateTime completedAt;

  const QuizResult({
    required this.day,
    required this.title,
    required this.score,
    required this.total,
    required this.percentage,
    required this.completedAt,
  });

  Map<String, dynamic> toJson() => {
        'bestScore': score,
        'total': total,
        'percentage': percentage,
        'title': title,
        'completedAt': completedAt.toIso8601String(),
      };

  factory QuizResult.fromStored(int day, Map<String, dynamic> json) {
    return QuizResult(
      day: day,
      title: json['title'] as String? ?? '',
      score: (json['bestScore'] as num?)?.toInt() ?? 0,
      total: (json['total'] as num?)?.toInt() ?? 0,
      percentage: (json['percentage'] as num?)?.toInt() ?? 0,
      completedAt:
          DateTime.tryParse(json['completedAt'] as String? ?? '') ?? DateTime.now(),
    );
  }
}
