import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../l10n/strings.dart';
import '../services/app_state.dart';

class ReviewScreen extends StatelessWidget {
  const ReviewScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final appState = context.watch<AppState>();
    final lang = appState.currentLanguage;
    final items = [...appState.starredPhrases]
      ..sort((a, b) => b.createdAt.compareTo(a.createdAt));

    return Scaffold(
      appBar: AppBar(
        title: Text(AppStrings.t(lang, zh: '复习清单', en: 'Review starred phrases')),
      ),
      body: items.isEmpty
          ? Center(
              child: Padding(
                padding: const EdgeInsets.all(24),
                child: Text(
                  AppStrings.t(lang,
                      zh: '暂无收藏的短语。在每日课程中点击星标即可添加。',
                      en: 'No starred phrases yet. Tap the star on any daily lesson phrase.'),
                  textAlign: TextAlign.center,
                ),
              ),
            )
          : ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: items.length,
              itemBuilder: (ctx, i) {
                final entry = items[i];
                return Card(
                  child: ListTile(
                    title: Text(entry.phrase,
                        style: const TextStyle(fontSize: 18)),
                    subtitle: Text(
                      'Day ${entry.day} · ${entry.lang}'
                      '${entry.sectionTitle.isNotEmpty ? ' — ${entry.sectionTitle}' : ''}',
                    ),
                    trailing: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        IconButton(
                          icon: const Icon(Icons.open_in_new),
                          onPressed: () => Navigator.pushNamed(
                            context, '/day', arguments: entry.day),
                        ),
                        IconButton(
                          icon: const Icon(Icons.delete_outline),
                          onPressed: () =>
                              appState.removeStarredPhrase(entry.id),
                        ),
                      ],
                    ),
                  ),
                );
              },
            ),
    );
  }
}
