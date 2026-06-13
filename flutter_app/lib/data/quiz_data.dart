import '../models/quiz_models.dart';

const quizBank = <int, QuizSet>{
  1: QuizSet(
    title: 'Greetings and introductions',
    questions: [
      QuizQuestion(
        type: 'multiple-choice',
        prompt: 'What does "你好吗？" mean?',
        options: ['How are you?', 'What is your name?', 'Where are you?', 'Goodbye'],
        answer: 'How are you?',
      ),
      QuizQuestion(
        type: 'multiple-choice',
        prompt: 'Choose the correct pinyin for "再见".',
        options: ['zai jian', 'xie xie', 'qing wen', 'ming tian'],
        answer: 'zai jian',
      ),
      QuizQuestion(
        type: 'fill-in',
        prompt: 'Fill in the Mandarin for "I": ___',
        answer: '我',
      ),
    ],
  ),
  8: QuizSet(
    title: 'Daily routine',
    questions: [
      QuizQuestion(
        type: 'multiple-choice',
        prompt: 'What does "早上" mean?',
        options: ['Morning', 'Afternoon', 'Evening', 'Weekend'],
        answer: 'Morning',
      ),
      QuizQuestion(
        type: 'multiple-choice',
        prompt: 'Choose the phrase for "eat breakfast".',
        options: ['吃早饭', '看电影', '去学校', '买东西'],
        answer: '吃早饭',
      ),
      QuizQuestion(
        type: 'fill-in',
        prompt: 'Fill in the English meaning of "睡觉": ___',
        answer: 'sleep',
      ),
    ],
  ),
  16: QuizSet(
    title: 'Restaurants and plans',
    questions: [
      QuizQuestion(
        type: 'multiple-choice',
        prompt: 'What does "服务员" mean?',
        options: ['Server', 'Teacher', 'Friend', 'Driver'],
        answer: 'Server',
      ),
      QuizQuestion(
        type: 'multiple-choice',
        prompt: 'Which phrase means "I would like to order"?',
        options: ['我想点菜', '我想回家', '我会说中文', '我喜欢周末'],
        answer: '我想点菜',
      ),
      QuizQuestion(
        type: 'fill-in',
        prompt: 'Fill in the English meaning of "周末": ___',
        answer: 'weekend',
      ),
    ],
  ),
  31: QuizSet(
    title: 'Longer topics',
    questions: [
      QuizQuestion(
        type: 'multiple-choice',
        prompt: 'What does "环境" mean?',
        options: ['Environment', 'Homework', 'Breakfast', 'Ticket'],
        answer: 'Environment',
      ),
      QuizQuestion(
        type: 'multiple-choice',
        prompt: 'Choose the best translation for "保护".',
        options: ['Protect', 'Compare', 'Reserve', 'Arrive'],
        answer: 'Protect',
      ),
      QuizQuestion(
        type: 'fill-in',
        prompt: 'Fill in the English meaning of "浪费": ___',
        answer: 'waste',
      ),
    ],
  ),
};

QuizSet getQuizForDay(int day) {
  if (quizBank.containsKey(day)) return quizBank[day]!;
  final band = day <= 7
      ? quizBank[1]!
      : day <= 15
          ? quizBank[8]!
          : day <= 30
              ? quizBank[16]!
              : quizBank[31]!;
  return QuizSet(title: 'Day $day review', questions: band.questions);
}

String normalizeAnswer(String? value) =>
    (value ?? '').trim().toLowerCase();

QuizResult scoreQuiz(int day, List<String?> answers) {
  final quiz = getQuizForDay(day);
  var score = 0;
  for (var i = 0; i < quiz.questions.length; i++) {
    if (normalizeAnswer(answers[i]) ==
        normalizeAnswer(quiz.questions[i].answer)) {
      score++;
    }
  }
  final total = quiz.questions.length;
  return QuizResult(
    day: day,
    title: quiz.title,
    score: score,
    total: total,
    percentage: ((score / total) * 100).round(),
    completedAt: DateTime.now().toUtc(),
  );
}
