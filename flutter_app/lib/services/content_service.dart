import 'dart:convert';
import 'package:flutter/services.dart';
import '../models/audio_cue.dart';
import '../models/lesson.dart';
import '../models/phrase_section.dart';
import '../data/content_catalog.dart';

class ContentService {
  Future<String> loadAssetText(String path) async {
    return rootBundle.loadString('assets/$path');
  }

  Future<TimingManifest?> loadTiming(String path) async {
    try {
      final raw = await loadAssetText(path);
      return TimingManifest.fromJson(
        json.decode(raw) as Map<String, dynamic>,
      );
    } catch (_) {
      return null;
    }
  }

  String dayTextPath(int day, Language lang) => 'text/day${day}_${lang.code}.txt';

  String dayAudioPath(int day, Language lang) {
    final audioLang = audioLangFor(lang);
    return 'audio/day${day}_$audioLang.mp3';
  }

  String dayTimingPath(int day, Language lang) {
    final audioLang = audioLangFor(lang);
    return 'timing/day${day}_$audioLang.json';
  }

  String supplementaryTextPath(String category, Language lang) =>
      'text/supplementary/${category}_${lang.code}.txt';

  String supplementaryAudioPath(String category, Language lang) {
    final audioLang = audioLangFor(lang);
    return 'audio/supplementary/${category}_$audioLang.mp3';
  }

  String supplementaryTimingPath(String category, Language lang) {
    final audioLang = audioLangFor(lang);
    return 'timing/supplementary/${category}_$audioLang.json';
  }

  String readingTextPath(String level, String topic, Language lang) {
    final slug = readingTopicSlug(topic);
    return 'reading/${level}_${slug}_${lang.code}.txt';
  }

  String readingAudioPath(String level, String topic, Language lang) {
    final slug = readingTopicSlug(topic);
    final audioLang = audioLangFor(lang);
    return 'audio/reading/${level}_${slug}_$audioLang.mp3';
  }

  String readingTimingPath(String level, String topic, Language lang) {
    final slug = readingTopicSlug(topic);
    final audioLang = audioLangFor(lang);
    return 'timing/reading/${level}_${slug}_$audioLang.json';
  }

  String writingTextPath(String type, String level, Language lang) {
    final slug = writingLevelSlug(level);
    return 'writing/${type}_${slug}_${lang.code}.txt';
  }

  String writingAudioPath(String type, String level, Language lang) {
    final slug = writingLevelSlug(level);
    final audioLang = audioLangFor(lang);
    return 'audio/writing/${type}_${slug}_$audioLang.mp3';
  }

  String writingTimingPath(String type, String level, Language lang) {
    final slug = writingLevelSlug(level);
    final audioLang = audioLangFor(lang);
    return 'timing/writing/${type}_${slug}_$audioLang.json';
  }

  List<PhraseSection> parsePhraseSections(String text) {
    final normalized = text.replaceAll('\r\n', '\n').replaceAll('\r', '\n');
    final sections = normalized.split(RegExp(r'\n(?=\w[^\n]+\n-+\n)'));
    final result = <PhraseSection>[];
    var cueIndex = 0;

    for (final section in sections) {
      if (section.trim().isEmpty) continue;
      final lines = section.split('\n');
      if (lines.isEmpty) continue;
      final title = lines.first.trim();
      final phrases = <PhraseItem>[];
      for (final line in lines.skip(1)) {
        final trimmed = line.trim();
        if (trimmed.isEmpty || RegExp(r'^-+$').hasMatch(trimmed)) continue;
        phrases.add(PhraseItem(cueIndex: cueIndex, text: trimmed));
        cueIndex++;
      }
      if (phrases.isNotEmpty) {
        result.add(PhraseSection(title: title, phrases: phrases));
      }
    }
    return result;
  }

  List<String> splitReadingSegments(String text, Language lang) {
    final t = text.trim();
    if (t.isEmpty) return [];
    if (lang == Language.chinese) {
      final parts = RegExp(r'[^。！？]+[。！？]?').allMatches(t);
      return parts.map((m) => m.group(0)!.trim()).where((s) => s.isNotEmpty).toList();
    }
    return t
        .split(RegExp(r'(?<=[.!?])\s+'))
        .map((s) => s.trim())
        .where((s) => s.isNotEmpty)
        .toList();
  }

  ParsedReadingContent parseReadingContent(String text, Language lang) {
    final sections = text.replaceAll('\r\n', '\n').split(RegExp(r'\n(?=\w[^\n]+\n-+\n)'));
    String mainText = '';
    String vocabulary = '';
    String questions = '';

    if (sections.isNotEmpty) {
      final mainLines = sections[0].split('\n');
      mainText = mainLines.length > 2 ? mainLines.sublist(2).join('\n').trim() : '';
    }
    if (sections.length > 1) vocabulary = sections[1];
    if (sections.length > 2) questions = sections[2];

    return ParsedReadingContent(
      mainSegments: splitReadingSegments(mainText, lang),
      vocabularyText: vocabulary,
      questionsText: questions,
    );
  }

  List<WritingExercise> parseWritingExercises(String text) {
    final lines = text.replaceAll('\r\n', '\n').split('\n');
    final exercises = <WritingExercise>[];
    String? prompt;
    String? answer;

    for (final line in lines) {
      final trimmed = line.trim();
      if (trimmed.isEmpty) continue;
      if (trimmed.startsWith('Exercise') || trimmed.startsWith('练习')) {
        if (prompt != null) {
          exercises.add(WritingExercise(prompt: prompt, answer: answer ?? ''));
        }
        prompt = trimmed;
        answer = null;
      } else if (trimmed.startsWith('Answer:') || trimmed.startsWith('答案:')) {
        answer = trimmed.split(':').skip(1).join(':').trim();
      } else if (prompt == null) {
        prompt = trimmed;
      }
    }
    if (prompt != null) {
      exercises.add(WritingExercise(prompt: prompt, answer: answer ?? ''));
    }
    return exercises;
  }

  int? activeCueIndex(Duration position, List<AudioCue> cues) {
    final seconds = position.inMilliseconds / 1000.0;
    for (final cue in cues) {
      if (seconds >= cue.start && seconds < cue.end) return cue.index;
    }
    return null;
  }
}

class ParsedReadingContent {
  final List<String> mainSegments;
  final String vocabularyText;
  final String questionsText;

  const ParsedReadingContent({
    required this.mainSegments,
    required this.vocabularyText,
    required this.questionsText,
  });
}

class WritingExercise {
  final String prompt;
  final String answer;

  const WritingExercise({required this.prompt, required this.answer});
}
