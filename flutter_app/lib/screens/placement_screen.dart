import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../data/placement_data.dart';
import '../l10n/strings.dart';
import '../models/lesson.dart';
import '../models/placement_models.dart';
import '../services/app_state.dart';

class PlacementScreen extends StatefulWidget {
  const PlacementScreen({super.key});

  @override
  State<PlacementScreen> createState() => _PlacementScreenState();
}

class _PlacementScreenState extends State<PlacementScreen> {
  final _answers = <int, String?>{};
  bool _submitted = false;

  @override
  Widget build(BuildContext context) {
    final appState = context.watch<AppState>();
    final lang = appState.currentLanguage;
    final saved = appState.placementResult;

    return Scaffold(
      appBar: AppBar(
        title: Text(AppStrings.t(lang, zh: '水平测试', en: 'Placement test')),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            if (saved != null && !_submitted) _resultCard(lang, saved),
            ...placementQuestions.asMap().entries.map((e) {
              return Card(
                margin: const EdgeInsets.only(bottom: 12),
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('${e.key + 1}. ${e.value.prompt}',
                          style: const TextStyle(fontWeight: FontWeight.w600)),
                      const SizedBox(height: 8),
                      ...e.value.options.map((opt) {
                        return RadioListTile<String>(
                          title: Text(opt),
                          value: opt,
                          groupValue: _answers[e.key],
                          onChanged: (v) =>
                              setState(() => _answers[e.key] = v),
                        );
                      }),
                    ],
                  ),
                ),
              );
            }),
            ElevatedButton(
              onPressed: _answers.length == placementQuestions.length
                  ? () async {
                      final answers = List<String?>.generate(
                        placementQuestions.length,
                        (i) => _answers[i],
                      );
                      final result = scorePlacement(answers);
                      await appState.savePlacementResult(result);
                      setState(() => _submitted = true);
                    }
                  : null,
              child: Text(AppStrings.t(lang, zh: '提交', en: 'Submit')),
            ),
            if (_submitted && appState.placementResult != null)
              _resultCard(lang, appState.placementResult!),
          ],
        ),
      ),
    );
  }

  Widget _resultCard(Language lang, PlacementResult result) {
    return Card(
      color: Theme.of(context).colorScheme.primaryContainer,
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              AppStrings.t(lang,
                  zh: '建议起点：第 ${result.recommendedDay} 天',
                  en: 'Recommended start: Day ${result.recommendedDay}'),
              style: Theme.of(context).textTheme.titleLarge,
            ),
            Text(AppStrings.t(lang,
                zh: '得分：${result.score}/${result.total}（${result.percentage}%）',
                en: 'Score: ${result.score}/${result.total} (${result.percentage}%)')),
            Text(AppStrings.t(lang,
                zh: result.messageZh, en: result.messageEn)),
            const SizedBox(height: 12),
            ElevatedButton(
              onPressed: () => Navigator.pushNamed(
                context, '/day', arguments: result.recommendedDay),
              child: Text(AppStrings.t(lang,
                  zh: '开始第${result.recommendedDay}天',
                  en: 'Start at Day ${result.recommendedDay}')),
            ),
          ],
        ),
      ),
    );
  }
}
