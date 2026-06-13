import '../models/placement_models.dart';

const placementQuestions = <PlacementQuestion>[
  PlacementQuestion(
    prompt: 'What does "你好" mean?',
    options: ['Hello', 'Goodbye', 'Thank you', 'Excuse me'],
    answer: 'Hello',
    band: 'beginner',
  ),
  PlacementQuestion(
    prompt: 'Choose the correct pinyin for "谢谢".',
    options: ['xie xie', 'ni hao', 'zai jian', 'qing wen'],
    answer: 'xie xie',
    band: 'beginner',
  ),
  PlacementQuestion(
    prompt: 'What does "我想要一杯水" mean?',
    options: [
      'I would like a glass of water',
      'I have a cup of tea',
      'Where is the water?',
      'This water is cold',
    ],
    answer: 'I would like a glass of water',
    band: 'beginner',
  ),
  PlacementQuestion(
    prompt: 'Which phrase asks "How much is this?"',
    options: ['这个多少钱？', '洗手间在哪里？', '你叫什么名字？', '现在几点？'],
    answer: '这个多少钱？',
    band: 'beginner',
  ),
  PlacementQuestion(
    prompt: 'What does "我周末想去看电影" mean?',
    options: [
      'I want to watch a movie this weekend',
      'I watched a movie yesterday',
      'I do not like movies',
      'The movie starts at noon',
    ],
    answer: 'I want to watch a movie this weekend',
    band: 'intermediate',
  ),
  PlacementQuestion(
    prompt: 'Choose the best translation for "菜单".',
    options: ['Menu', 'Receipt', 'Reservation', 'Restaurant'],
    answer: 'Menu',
    band: 'intermediate',
  ),
  PlacementQuestion(
    prompt: 'Which sentence means "I have studied Chinese for two years"?',
    options: ['我学中文学了两年。', '我明年学中文。', '我两点学中文。', '我不会说中文。'],
    answer: '我学中文学了两年。',
    band: 'intermediate',
  ),
  PlacementQuestion(
    prompt: 'What is the function of "因为...所以..."?',
    options: [
      'Cause and result',
      'Comparison',
      'Past action only',
      'A yes-or-no question',
    ],
    answer: 'Cause and result',
    band: 'intermediate',
  ),
  PlacementQuestion(
    prompt: 'What does "环境保护" mean?',
    options: [
      'Environmental protection',
      'Weekend plan',
      'Daily routine',
      'Language exchange',
    ],
    answer: 'Environmental protection',
    band: 'advanced',
  ),
  PlacementQuestion(
    prompt: 'Choose the best meaning of "减少浪费".',
    options: ['Reduce waste', 'Increase speed', 'Protect privacy', 'Change schools'],
    answer: 'Reduce waste',
    band: 'advanced',
  ),
];

PlacementResult scorePlacement(List<String?> answers) {
  var score = 0;
  for (var i = 0; i < placementQuestions.length; i++) {
    if (answers[i] == placementQuestions[i].answer) score++;
  }
  final total = placementQuestions.length;
  final percentage = ((score / total) * 100).round();
  final rec = _recommendation(score);
  return PlacementResult(
    score: score,
    total: total,
    percentage: percentage,
    level: rec.level,
    recommendedDay: rec.day,
    messageZh: rec.messageZh,
    messageEn: rec.messageEn,
    completedAt: DateTime.now().toUtc(),
  );
}

({String level, int day, String messageZh, String messageEn}) _recommendation(
  int score,
) {
  if (score <= 3) {
    return (
      level: 'Beginner',
      day: 1,
      messageZh: '从基础开始，每天建立信心。',
      messageEn: 'Start with the foundations and build daily confidence.',
    );
  }
  if (score <= 6) {
    return (
      level: 'Upper beginner',
      day: 8,
      messageZh: '从第一周后开始学习，并根据需要复习前面的课程。',
      messageEn: 'Begin after the first week and review earlier lessons as needed.',
    );
  }
  if (score <= 8) {
    return (
      level: 'Intermediate',
      day: 16,
      messageZh: '从实用句型和较长对话开始。',
      messageEn: 'Start with practical sentence patterns and longer exchanges.',
    );
  }
  return (
    level: 'Advanced',
    day: 31,
    messageZh: '进入更长的话题，并用测验进行复习。',
    messageEn: 'Move into longer topics while using quizzes for review.',
  );
}
