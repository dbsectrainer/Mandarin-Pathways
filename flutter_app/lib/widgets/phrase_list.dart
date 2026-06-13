import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';
import '../models/lesson.dart';
import '../models/phrase_section.dart';
import '../l10n/strings.dart';
import '../services/app_state.dart';

class PhraseListView extends StatelessWidget {
  final List<PhraseSection> sections;
  final int day;
  final int? activeCueIndex;

  const PhraseListView({
    super.key,
    required this.sections,
    required this.day,
    this.activeCueIndex,
  });

  @override
  Widget build(BuildContext context) {
    final appState = context.watch<AppState>();
    final lang = appState.currentLanguage;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: sections.map((section) {
        return Card(
          margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  section.title,
                  style: Theme.of(context).textTheme.titleMedium?.copyWith(
                        fontWeight: FontWeight.bold,
                        color: Theme.of(context).colorScheme.primary,
                      ),
                ),
                const SizedBox(height: 12),
                ...section.phrases.map((phrase) {
                  final isActive = activeCueIndex == phrase.cueIndex;
                  final starred = appState.isPhraseStarred(
                    day, section.title, phrase.text);
                  return Container(
                    margin: const EdgeInsets.only(bottom: 8),
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: isActive
                          ? Theme.of(context)
                              .colorScheme
                              .primary
                              .withValues(alpha: 0.12)
                          : Colors.grey.shade50,
                      borderRadius: BorderRadius.circular(8),
                      border: Border.all(
                        color: isActive
                            ? Theme.of(context).colorScheme.primary
                            : Colors.grey.shade300,
                      ),
                    ),
                    child: Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Expanded(
                          child: SelectableText(
                            phrase.text,
                            style: TextStyle(
                              fontSize: lang == Language.chinese ? 20 : 18,
                              height: 1.6,
                              fontWeight:
                                  isActive ? FontWeight.w600 : FontWeight.normal,
                            ),
                          ),
                        ),
                        IconButton(
                          icon: Icon(
                            starred ? Icons.star : Icons.star_border,
                            color: starred ? Colors.amber : null,
                            size: 20,
                          ),
                          onPressed: () => appState.toggleStarredPhrase(
                            day: day,
                            sectionTitle: section.title,
                            phrase: phrase.text,
                          ),
                        ),
                        IconButton(
                          icon: const Icon(Icons.layers, size: 20),
                          tooltip: 'Add to SRS',
                          onPressed: () => appState.addPhraseToSrs(
                            day: day,
                            sectionTitle: section.title,
                            phrase: phrase.text,
                          ),
                        ),
                        IconButton(
                          icon: const Icon(Icons.copy, size: 20),
                          onPressed: () {
                            Clipboard.setData(
                                ClipboardData(text: phrase.text));
                            ScaffoldMessenger.of(context).showSnackBar(
                              SnackBar(
                                content: Text(AppStrings.t(lang,
                                    zh: '短语已复制', en: 'Phrase copied')),
                              ),
                            );
                          },
                        ),
                      ],
                    ),
                  );
                }),
              ],
            ),
          ),
        );
      }).toList(),
    );
  }
}
