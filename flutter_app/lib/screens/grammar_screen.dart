import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../data/grammar_data.dart';
import '../l10n/strings.dart';
import '../services/app_state.dart';

class GrammarScreen extends StatefulWidget {
  const GrammarScreen({super.key});

  @override
  State<GrammarScreen> createState() => _GrammarScreenState();
}

class _GrammarScreenState extends State<GrammarScreen> {
  final Set<String> _completedIds = {};
  final Set<String> _expandedIds = {};

  final Map<String, Color> _cefrColors = {
    'A1': const Color(0xFFE74C3C),
    'A2': const Color(0xFFE67E22),
    'B1': const Color(0xFFF1C40F),
    'B2': const Color(0xFF2980B9),
    'C1': const Color(0xFF8E44AD),
  };

  int get _totalTopics =>
      grammarSections.fold(0, (sum, s) => sum + s.topics.length);

  double get _completionRate =>
      _totalTopics > 0 ? _completedIds.length / _totalTopics : 0.0;

  void _toggleCompleted(String id) {
    setState(() {
      if (_completedIds.contains(id)) {
        _completedIds.remove(id);
      } else {
        _completedIds.add(id);
        context.read<AppState>().awardXp(5);
      }
    });
  }

  void _toggleExpanded(String id) {
    setState(() {
      if (_expandedIds.contains(id)) {
        _expandedIds.remove(id);
      } else {
        _expandedIds.add(id);
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final appState = context.watch<AppState>();
    final lang = appState.currentLanguage;

    return Scaffold(
      appBar: AppBar(
        title: Text(AppStrings.t(lang, zh: '语法课', en: 'Grammar Lessons')),
      ),
      body: CustomScrollView(
        slivers: [
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    AppStrings.t(lang,
                        zh: '${_completedIds.length}/$_totalTopics 个语法点已掌握',
                        en: '${_completedIds.length}/$_totalTopics grammar points mastered'),
                    style: Theme.of(context).textTheme.bodyMedium,
                  ),
                  const SizedBox(height: 8),
                  ClipRRect(
                    borderRadius: BorderRadius.circular(4),
                    child: LinearProgressIndicator(
                      value: _completionRate,
                      minHeight: 8,
                      backgroundColor: Colors.grey[200],
                      valueColor: const AlwaysStoppedAnimation<Color>(Color(0xFF27AE60)),
                    ),
                  ),
                ],
              ),
            ),
          ),
          SliverList(
            delegate: SliverChildBuilderDelegate(
              (context, sectionIndex) {
                if (sectionIndex >= grammarSections.length) return null;
                final section = grammarSections[sectionIndex];
                final cefrColor = _cefrColors[section.cefr] ?? Colors.grey;

                return Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Container(
                            padding: const EdgeInsets.symmetric(
                                horizontal: 12, vertical: 4),
                            decoration: BoxDecoration(
                              color: cefrColor,
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: Text(
                              '${section.cefr} Level',
                              style: const TextStyle(
                                color: Colors.white,
                                fontWeight: FontWeight.bold,
                                fontSize: 13,
                              ),
                            ),
                          ),
                          const SizedBox(width: 8),
                          Text(
                            AppStrings.t(lang,
                                zh: '${section.topics.length}个语法点',
                                en: '${section.topics.length} patterns'),
                            style: Theme.of(context).textTheme.bodySmall,
                          ),
                        ],
                      ),
                      const SizedBox(height: 8),
                      ...section.topics.map((topic) {
                        final isExpanded = _expandedIds.contains(topic.id);
                        final isDone = _completedIds.contains(topic.id);

                        return Card(
                          margin: const EdgeInsets.only(bottom: 8),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(10),
                            side: BorderSide(
                              color: isDone
                                  ? const Color(0xFF27AE60)
                                  : Colors.transparent,
                              width: isDone ? 2 : 0,
                            ),
                          ),
                          child: InkWell(
                            borderRadius: BorderRadius.circular(10),
                            onTap: () => _toggleExpanded(topic.id),
                            child: Padding(
                              padding: const EdgeInsets.all(14),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Row(
                                    children: [
                                      Expanded(
                                        child: Text(
                                          topic.pattern,
                                          style: Theme.of(context)
                                              .textTheme
                                              .titleSmall
                                              ?.copyWith(
                                                fontWeight: FontWeight.w600,
                                              ),
                                        ),
                                      ),
                                      Icon(
                                        isDone
                                            ? Icons.check_circle
                                            : isExpanded
                                                ? Icons.keyboard_arrow_up
                                                : Icons.keyboard_arrow_down,
                                        color: isDone
                                            ? const Color(0xFF27AE60)
                                            : Colors.grey,
                                        size: 20,
                                      ),
                                    ],
                                  ),
                                  if (isExpanded) ...[
                                    const SizedBox(height: 12),
                                    Container(
                                      padding: const EdgeInsets.all(12),
                                      decoration: BoxDecoration(
                                        color: Colors.grey[50],
                                        borderRadius: BorderRadius.circular(8),
                                      ),
                                      child: Column(
                                        crossAxisAlignment:
                                            CrossAxisAlignment.start,
                                        children: [
                                          Text(
                                            topic.zh,
                                            style: const TextStyle(
                                              fontSize: 18,
                                              fontWeight: FontWeight.w500,
                                            ),
                                          ),
                                          const SizedBox(height: 4),
                                          Text(
                                            topic.pinyin,
                                            style: TextStyle(
                                              fontStyle: FontStyle.italic,
                                              color: Colors.grey[600],
                                            ),
                                          ),
                                          const SizedBox(height: 4),
                                          Text(
                                            topic.en,
                                            style: TextStyle(
                                              color: Colors.grey[700],
                                            ),
                                          ),
                                        ],
                                      ),
                                    ),
                                    const SizedBox(height: 8),
                                    Container(
                                      padding: const EdgeInsets.all(10),
                                      decoration: BoxDecoration(
                                        color: const Color(0xFFEEF4FB),
                                        borderRadius: BorderRadius.circular(8),
                                      ),
                                      child: Row(
                                        crossAxisAlignment:
                                            CrossAxisAlignment.start,
                                        children: [
                                          const Text('💡 ',
                                              style: TextStyle(fontSize: 14)),
                                          Expanded(
                                            child: Text(
                                              topic.note,
                                              style: const TextStyle(
                                                fontSize: 13,
                                                color: Color(0xFF1A5C8F),
                                              ),
                                            ),
                                          ),
                                        ],
                                      ),
                                    ),
                                    const SizedBox(height: 10),
                                    SizedBox(
                                      width: double.infinity,
                                      child: ElevatedButton.icon(
                                        onPressed: () =>
                                            _toggleCompleted(topic.id),
                                        icon: Icon(
                                          isDone
                                              ? Icons.check_circle
                                              : Icons.school,
                                          size: 18,
                                        ),
                                        label: Text(AppStrings.t(lang,
                                            zh: isDone ? '已掌握' : '标记为已学',
                                            en: isDone
                                                ? 'Mastered!'
                                                : 'Mark as learned')),
                                        style: ElevatedButton.styleFrom(
                                          backgroundColor: isDone
                                              ? const Color(0xFF27AE60)
                                              : null,
                                        ),
                                      ),
                                    ),
                                  ],
                                ],
                              ),
                            ),
                          ),
                        );
                      }),
                      if (sectionIndex < grammarSections.length - 1)
                        const Divider(height: 24),
                    ],
                  ),
                );
              },
              childCount: grammarSections.length,
            ),
          ),
          const SliverToBoxAdapter(child: SizedBox(height: 24)),
        ],
      ),
    );
  }
}
