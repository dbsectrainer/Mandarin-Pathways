class AudioCue {
  final int index;
  final double start;
  final double end;

  const AudioCue({
    required this.index,
    required this.start,
    required this.end,
  });

  factory AudioCue.fromJson(Map<String, dynamic> json) {
    return AudioCue(
      index: json['i'] as int? ?? 0,
      start: (json['start'] as num?)?.toDouble() ?? 0,
      end: (json['end'] as num?)?.toDouble() ?? 0,
    );
  }
}

class TimingManifest {
  final List<AudioCue> phrases;

  const TimingManifest({required this.phrases});

  factory TimingManifest.fromJson(Map<String, dynamic> json) {
    final raw = json['phrases'];
    if (raw is! List) return const TimingManifest(phrases: []);
    return TimingManifest(
      phrases: raw
          .whereType<Map<String, dynamic>>()
          .map(AudioCue.fromJson)
          .toList(),
    );
  }
}
