import 'package:flutter_test/flutter_test.dart';
import 'package:mandarin_pathways/data/content_catalog.dart';
import 'package:mandarin_pathways/data/placement_data.dart';
import 'package:mandarin_pathways/data/quiz_data.dart';
import 'package:mandarin_pathways/models/lesson.dart';
import 'package:mandarin_pathways/services/content_service.dart';

void main() {
  final content = ContentService();

  test('parsePhraseSections splits day lesson text', () {
    const sample = '''
Basic Greetings
---------------
你好
早上好

Self Introduction
-----------------
我叫...
''';
    final sections = content.parsePhraseSections(sample);
    expect(sections.length, 2);
    expect(sections.first.title, 'Basic Greetings');
    expect(sections.first.phrases.length, 2);
    expect(sections.first.phrases.first.text, '你好');
  });

  test('pinyin uses zh audio path', () {
    expect(audioLangFor(Language.pinyin), 'zh');
    expect(content.dayAudioPath(1, Language.pinyin), 'audio/day1_zh.mp3');
    expect(content.dayAudioPath(1, Language.english), 'audio/day1_en.mp3');
  });

  test('placement scoring recommends beginner start', () {
    final result = scorePlacement(List.filled(placementQuestions.length, null));
    expect(result.recommendedDay, 1);
    expect(result.level, 'Beginner');
  });

  test('quiz scoring counts correct answers', () {
    final quiz = getQuizForDay(1);
    final answers = quiz.questions.map((q) => q.answer).toList();
    final result = scoreQuiz(1, answers);
    expect(result.score, quiz.questions.length);
  });

  test('slugify converts topic names', () {
    expect(slugify('HSK1 - Essential'), 'hsk1_-_essential');
    expect(readingTopicSlug('Self Introduction'), 'self_introduction');
  });
}
