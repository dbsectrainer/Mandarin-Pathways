import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../l10n/strings.dart';
import '../models/lesson.dart';
import '../services/app_state.dart';

class SrsScreen extends StatefulWidget {
  const SrsScreen({super.key});

  @override
  State<SrsScreen> createState() => _SrsScreenState();
}

class _SrsScreenState extends State<SrsScreen> {
  int _index = 0;
  bool _showBack = false;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<AppState>().seedSrsFromStarred();
    });
  }

  @override
  Widget build(BuildContext context) {
    final appState = context.watch<AppState>();
    final lang = appState.currentLanguage;
    final due = appState.dueSrsCards;
    final total = appState.srsCards.length;

    return Scaffold(
      appBar: AppBar(
        title: Text(AppStrings.t(lang, zh: '间隔复习', en: 'SRS flashcards')),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: due.isEmpty
            ? _emptyState(lang)
            : _index >= due.length
                ? _doneState(lang)
                : _cardView(appState, lang, due, total),
      ),
    );
  }

  Widget _emptyState(Language lang) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Text(AppStrings.t(lang,
              zh: '今日无复习卡片', en: 'No cards due today')),
          const SizedBox(height: 8),
          Text(AppStrings.t(lang,
              zh: '从课程中收藏短语，然后返回进行间隔复习。',
              en: 'Star phrases from lessons to build your deck.')),
          const SizedBox(height: 16),
          ElevatedButton(
            onPressed: () => Navigator.pushNamed(context, '/review'),
            child: Text(AppStrings.t(lang, zh: '收藏短语', en: 'Star phrases')),
          ),
        ],
      ),
    );
  }

  Widget _doneState(Language lang) {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (mounted) context.read<AppState>().awardXp(10);
    });
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Text(AppStrings.t(lang, zh: '复习完成！', en: 'Session complete!'),
              style: Theme.of(context).textTheme.headlineSmall),
          const SizedBox(height: 8),
          const Text('+10 XP', style: TextStyle(color: Color(0xFFE67E22), fontWeight: FontWeight.bold)),
          const SizedBox(height: 16),
          ElevatedButton(
            onPressed: () => Navigator.pushNamed(context, '/'),
            child: Text(AppStrings.t(lang, zh: '返回课程', en: 'Go to lessons')),
          ),
        ],
      ),
    );
  }

  Widget _cardView(
    AppState appState,
    Language lang,
    List due,
    int total,
  ) {
    final card = due[_index];
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        Text(
          AppStrings.t(lang,
              zh: '${due.length} 张卡片今日到期 · 共 $total 张',
              en: '${due.length} cards due today · $total total'),
        ),
        const SizedBox(height: 8),
        Text('Day ${card.day ?? "?"} · ${card.lang} · ${_index + 1}/${due.length}'),
        const SizedBox(height: 24),
        Expanded(
          child: Card(
            child: Padding(
              padding: const EdgeInsets.all(24),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(card.front,
                      style: const TextStyle(fontSize: 28),
                      textAlign: TextAlign.center),
                  if (_showBack) ...[
                    const Divider(height: 32),
                    Text(card.back.isNotEmpty ? card.back : '—',
                        style: const TextStyle(fontSize: 20),
                        textAlign: TextAlign.center),
                  ],
                ],
              ),
            ),
          ),
        ),
        const SizedBox(height: 16),
        if (!_showBack)
          ElevatedButton(
            onPressed: () => setState(() => _showBack = true),
            child: Text(AppStrings.t(lang, zh: '显示答案', en: 'Show answer')),
          )
        else
          Row(
            children: [
              Expanded(
                child: OutlinedButton(
                  onPressed: () => _grade(appState, card.id, 'again'),
                  child: Text(AppStrings.t(lang, zh: '重来', en: 'Again')),
                ),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: ElevatedButton(
                  onPressed: () => _grade(appState, card.id, 'good'),
                  child: Text(AppStrings.t(lang, zh: '良好', en: 'Good')),
                ),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: ElevatedButton(
                  onPressed: () => _grade(appState, card.id, 'easy'),
                  child: Text(AppStrings.t(lang, zh: '简单', en: 'Easy')),
                ),
              ),
            ],
          ),
      ],
    );
  }

  Future<void> _grade(AppState appState, String id, String grade) async {
    await appState.reviewSrsCard(id, grade);
    setState(() {
      _index++;
      _showBack = false;
    });
  }
}
