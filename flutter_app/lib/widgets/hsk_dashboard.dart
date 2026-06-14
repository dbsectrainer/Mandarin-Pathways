import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../l10n/strings.dart';
import '../services/app_state.dart';

class HskLevel {
  final int level;
  final String label;
  final String cefr;
  final int startDay;
  final int endDay;
  final int estimatedWords;

  const HskLevel({
    required this.level,
    required this.label,
    required this.cefr,
    required this.startDay,
    required this.endDay,
    required this.estimatedWords,
  });
}

const _hskLevels = [
  HskLevel(level: 1, label: 'HSK 1', cefr: 'A1', startDay: 1, endDay: 7, estimatedWords: 150),
  HskLevel(level: 2, label: 'HSK 2', cefr: 'A2', startDay: 8, endDay: 14, estimatedWords: 300),
  HskLevel(level: 3, label: 'HSK 3', cefr: 'B1', startDay: 15, endDay: 22, estimatedWords: 600),
  HskLevel(level: 4, label: 'HSK 4', cefr: 'B1+', startDay: 23, endDay: 30, estimatedWords: 1200),
  HskLevel(level: 5, label: 'HSK 5', cefr: 'B2', startDay: 31, endDay: 36, estimatedWords: 2500),
  HskLevel(level: 6, label: 'HSK 6', cefr: 'C1', startDay: 37, endDay: 40, estimatedWords: 5000),
];

const _levelColors = [
  Color(0xFFE74C3C),
  Color(0xFFE67E22),
  Color(0xFFF39C12),
  Color(0xFF2980B9),
  Color(0xFF8E44AD),
  Color(0xFF1A2733),
];

class HskDashboard extends StatelessWidget {
  const HskDashboard({super.key});

  @override
  Widget build(BuildContext context) {
    final appState = context.watch<AppState>();
    final lang = appState.currentLanguage;

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            AppStrings.t(lang, zh: 'HSK 等级进度', en: 'HSK Proficiency Progress'),
            style: Theme.of(context)
                .textTheme
                .headlineSmall
                ?.copyWith(fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 12),
          GridView.builder(
            physics: const NeverScrollableScrollPhysics(),
            shrinkWrap: true,
            gridDelegate: const SliverGridDelegateWithMaxCrossAxisExtent(
              maxCrossAxisExtent: 200,
              childAspectRatio: 1.4,
              crossAxisSpacing: 10,
              mainAxisSpacing: 10,
            ),
            itemCount: _hskLevels.length,
            itemBuilder: (context, i) {
              final h = _hskLevels[i];
              final color = _levelColors[i];
              final total = h.endDay - h.startDay + 1;
              var done = 0;
              for (var d = h.startDay; d <= h.endDay; d++) {
                if (appState.isDayCompleted(d)) done++;
              }
              final pct = total > 0 ? done / total : 0.0;

              return Card(
                child: Padding(
                  padding: const EdgeInsets.all(10),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            h.label,
                            style: TextStyle(
                              fontWeight: FontWeight.bold,
                              color: color,
                              fontSize: 13,
                            ),
                          ),
                          Container(
                            padding: const EdgeInsets.symmetric(
                                horizontal: 6, vertical: 2),
                            decoration: BoxDecoration(
                              color: color.withAlpha(25),
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: Text(
                              h.cefr,
                              style: TextStyle(
                                  fontSize: 10,
                                  fontWeight: FontWeight.bold,
                                  color: color),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 4),
                      Text(
                        AppStrings.t(lang,
                            zh: '第${h.startDay}-${h.endDay}天',
                            en: 'Days ${h.startDay}-${h.endDay}'),
                        style: const TextStyle(fontSize: 10, color: Colors.grey),
                      ),
                      const SizedBox(height: 6),
                      ClipRRect(
                        borderRadius: BorderRadius.circular(3),
                        child: LinearProgressIndicator(
                          value: pct,
                          minHeight: 5,
                          backgroundColor: Colors.grey[200],
                          valueColor: AlwaysStoppedAnimation<Color>(color),
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        AppStrings.t(lang,
                            zh: '$done/$total 天',
                            en: '$done/$total days'),
                        style:
                            const TextStyle(fontSize: 10, color: Colors.grey),
                      ),
                    ],
                  ),
                ),
              );
            },
          ),
        ],
      ),
    );
  }
}
