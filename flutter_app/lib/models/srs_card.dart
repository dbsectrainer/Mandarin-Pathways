class SrsCard {
  final String id;
  final int? day;
  final String lang;
  final String front;
  final String back;
  final DateTime due;
  final int interval;
  final double ease;
  final int reps;
  final DateTime createdAt;
  final DateTime updatedAt;

  const SrsCard({
    required this.id,
    this.day,
    required this.lang,
    required this.front,
    required this.back,
    required this.due,
    this.interval = 0,
    this.ease = 2.5,
    this.reps = 0,
    required this.createdAt,
    required this.updatedAt,
  });

  factory SrsCard.fromJson(Map<String, dynamic> json) {
    final now = DateTime.now().toUtc();
    return SrsCard(
      id: json['id'] as String? ?? '',
      day: json['day'] as int?,
      lang: json['lang'] as String? ?? 'zh',
      front: json['front'] as String? ?? '',
      back: json['back'] as String? ?? '',
      due: DateTime.tryParse(json['due'] as String? ?? '') ?? now,
      interval: (json['interval'] as num?)?.toInt() ?? 0,
      ease: (json['ease'] as num?)?.toDouble() ?? 2.5,
      reps: (json['reps'] as num?)?.toInt() ?? 0,
      createdAt: DateTime.tryParse(json['createdAt'] as String? ?? '') ?? now,
      updatedAt: DateTime.tryParse(json['updatedAt'] as String? ?? '') ?? now,
    );
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'day': day,
        'lang': lang,
        'front': front,
        'back': back,
        'due': due.toIso8601String(),
        'interval': interval,
        'ease': ease,
        'reps': reps,
        'createdAt': createdAt.toIso8601String(),
        'updatedAt': updatedAt.toIso8601String(),
      };

  SrsCard copyWith({
    DateTime? due,
    int? interval,
    double? ease,
    int? reps,
    DateTime? updatedAt,
  }) {
    return SrsCard(
      id: id,
      day: day,
      lang: lang,
      front: front,
      back: back,
      due: due ?? this.due,
      interval: interval ?? this.interval,
      ease: ease ?? this.ease,
      reps: reps ?? this.reps,
      createdAt: createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }
}
