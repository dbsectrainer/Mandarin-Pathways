import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../data/quiz_data.dart';
import '../l10n/strings.dart';
import '../services/app_state.dart';

class QuizScreen extends StatefulWidget {
  const QuizScreen({super.key});

  @override
  State<QuizScreen> createState() => _QuizScreenState();
}

class _QuizScreenState extends State<QuizScreen> {
  late int _day;
  final _answers = <int, String>{};
  bool _submitted = false;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    _day = ModalRoute.of(context)?.settings.arguments as int? ?? 1;
  }

  @override
  Widget build(BuildContext context) {
    final appState = context.watch<AppState>();
    final lang = appState.currentLanguage;
    final quiz = getQuizForDay(_day);
    final saved = appState.getQuizScoreForDay(_day);

    return Scaffold(
      appBar: AppBar(
        title: Text(AppStrings.t(lang, zh: '测验', en: 'Quiz')),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Wrap(
              spacing: 8,
              children: [1, 8, 16, 31].map((d) {
                return ChoiceChip(
                  label: Text('Day $d'),
                  selected: _day == d,
                  onSelected: (_) => setState(() {
                    _day = d;
                    _answers.clear();
                    _submitted = false;
                  }),
                );
              }).toList(),
            ),
            const SizedBox(height: 16),
            Text('Day $_day: ${quiz.title}',
                style: Theme.of(context).textTheme.titleLarge),
            if (saved != null && !_submitted)
              Padding(
                padding: const EdgeInsets.symmetric(vertical: 8),
                child: Text(
                  AppStrings.t(lang,
                      zh: '最佳成绩：${saved.score}/${saved.total}',
                      en: 'Best score: ${saved.score}/${saved.total}'),
                ),
              ),
            ...quiz.questions.asMap().entries.map((e) {
              final q = e.value;
              return Card(
                margin: const EdgeInsets.only(bottom: 12),
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('${e.key + 1}. ${q.prompt}'),
                      const SizedBox(height: 8),
                      if (q.type == 'multiple-choice')
                        ...q.options.map((opt) {
                          return RadioListTile<String>(
                            title: Text(opt),
                            value: opt,
                            groupValue: _answers[e.key],
                            onChanged: (v) =>
                                setState(() => _answers[e.key] = v ?? ''),
                          );
                        })
                      else
                        TextField(
                          decoration: const InputDecoration(
                            border: OutlineInputBorder(),
                            labelText: 'Answer',
                          ),
                          onChanged: (v) =>
                              setState(() => _answers[e.key] = v),
                        ),
                    ],
                  ),
                ),
              );
            }),
            ElevatedButton(
              onPressed: _answers.length == quiz.questions.length
                  ? () async {
                      final result = scoreQuiz(
                        _day,
                        List.generate(
                          quiz.questions.length,
                          (i) => _answers[i],
                        ),
                      );
                      await appState.saveQuizScore(result);
                      setState(() => _submitted = true);
                      if (mounted) {
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(
                            content: Text(
                              AppStrings.t(lang,
                                  zh: '得分 ${result.score}/${result.total}',
                                  en: 'Score ${result.score}/${result.total}'),
                            ),
                          ),
                        );
                      }
                    }
                  : null,
              child: Text(AppStrings.t(lang, zh: '提交', en: 'Submit')),
            ),
          ],
        ),
      ),
    );
  }
}
