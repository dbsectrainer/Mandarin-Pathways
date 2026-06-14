import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';
import '../data/dictionary_data.dart';
import '../l10n/strings.dart';
import '../services/app_state.dart';

class DictionaryScreen extends StatefulWidget {
  const DictionaryScreen({super.key});

  @override
  State<DictionaryScreen> createState() => _DictionaryScreenState();
}

class _DictionaryScreenState extends State<DictionaryScreen> {
  final TextEditingController _searchController = TextEditingController();
  int _hskFilter = 0;
  String _query = '';

  List<DictionaryEntry> get _filtered {
    var results = dictionaryEntries.toList();
    if (_hskFilter > 0) {
      results = results.where((e) => e.hsk == _hskFilter).toList();
    }
    if (_query.isNotEmpty) {
      final q = _query.toLowerCase();
      results = results.where((e) =>
          e.zh.contains(q) ||
          e.pinyin.toLowerCase().contains(q) ||
          e.en.toLowerCase().contains(q)).toList();
    }
    return results;
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  void _addToSrs(BuildContext context, DictionaryEntry entry) {
    final appState = context.read<AppState>();
    appState.addPhraseToSrs(
      day: 1,
      sectionTitle: 'HSK ${entry.hsk} Dictionary',
      phrase: entry.zh,
    );
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('Added "${entry.zh}" to SRS!'),
        duration: const Duration(seconds: 2),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final appState = context.watch<AppState>();
    final lang = appState.currentLanguage;
    final results = _filtered;

    return Scaffold(
      appBar: AppBar(
        title: Text(AppStrings.t(lang, zh: '词汇词典', en: 'Vocabulary Dictionary')),
      ),
      body: Column(
        children: [
          // Search bar
          Padding(
            padding: const EdgeInsets.all(12),
            child: TextField(
              controller: _searchController,
              autofocus: false,
              decoration: InputDecoration(
                hintText: AppStrings.t(lang,
                    zh: '搜索：你好 / nǐ hǎo / hello...',
                    en: 'Search: 你好 / nǐ hǎo / hello...'),
                prefixIcon: const Icon(Icons.search),
                suffixIcon: _query.isNotEmpty
                    ? IconButton(
                        icon: const Icon(Icons.clear),
                        onPressed: () {
                          _searchController.clear();
                          setState(() => _query = '');
                        },
                      )
                    : null,
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(8),
                ),
                filled: true,
              ),
              onChanged: (v) => setState(() => _query = v),
            ),
          ),
          // HSK filter chips
          SizedBox(
            height: 44,
            child: ListView(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: 12),
              children: [
                _FilterChip(
                  label: AppStrings.t(lang, zh: '全部', en: 'All'),
                  selected: _hskFilter == 0,
                  onTap: () => setState(() => _hskFilter = 0),
                ),
                for (var i = 1; i <= 6; i++)
                  _FilterChip(
                    label: 'HSK $i',
                    selected: _hskFilter == i,
                    onTap: () => setState(() => _hskFilter = i),
                  ),
              ],
            ),
          ),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
            child: Text(
              AppStrings.t(lang,
                  zh: '${results.length} 个词条',
                  en: '${results.length} entries'),
              style: Theme.of(context).textTheme.bodySmall,
            ),
          ),
          // Results
          Expanded(
            child: results.isEmpty
                ? Center(
                    child: Text(AppStrings.t(lang,
                        zh: '未找到结果，请尝试其他搜索词',
                        en: 'No results found. Try a different search term.')),
                  )
                : ListView.builder(
                    padding: const EdgeInsets.symmetric(horizontal: 12),
                    itemCount: results.length,
                    itemBuilder: (context, i) =>
                        _DictCard(entry: results[i], onAddSrs: () => _addToSrs(context, results[i])),
                  ),
          ),
        ],
      ),
    );
  }
}

class _FilterChip extends StatelessWidget {
  final String label;
  final bool selected;
  final VoidCallback onTap;

  const _FilterChip({
    required this.label,
    required this.selected,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(right: 8),
      child: ChoiceChip(
        label: Text(label),
        selected: selected,
        onSelected: (_) => onTap(),
        selectedColor: const Color(0xFF1A5C8F),
        labelStyle: TextStyle(
          color: selected ? Colors.white : null,
          fontWeight: selected ? FontWeight.bold : null,
        ),
      ),
    );
  }
}

class _DictCard extends StatelessWidget {
  final DictionaryEntry entry;
  final VoidCallback onAddSrs;

  const _DictCard({required this.entry, required this.onAddSrs});

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: 10),
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        entry.zh,
                        style: Theme.of(context).textTheme.headlineSmall,
                      ),
                      Text(
                        entry.pinyin,
                        style: TextStyle(
                          fontStyle: FontStyle.italic,
                          color: Colors.grey[600],
                        ),
                      ),
                      Text(entry.en),
                    ],
                  ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(
                      horizontal: 8, vertical: 3),
                  decoration: BoxDecoration(
                    color: const Color(0xFFEEF4FB),
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: Text(
                    'HSK ${entry.hsk}',
                    style: const TextStyle(
                      fontSize: 11,
                      fontWeight: FontWeight.bold,
                      color: Color(0xFF1A5C8F),
                    ),
                  ),
                ),
              ],
            ),
            if (entry.example.isNotEmpty) ...[
              const SizedBox(height: 8),
              Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: Colors.grey[50],
                  borderRadius: BorderRadius.circular(6),
                ),
                child: Text(
                  entry.example,
                  style: const TextStyle(fontSize: 12),
                ),
              ),
            ],
            const SizedBox(height: 8),
            Row(
              children: [
                TextButton.icon(
                  icon: const Icon(Icons.copy, size: 16),
                  label: const Text('Copy'),
                  onPressed: () {
                    Clipboard.setData(ClipboardData(text: entry.zh));
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                        content: Text('Copied "${entry.zh}"'),
                        duration: const Duration(seconds: 1),
                      ),
                    );
                  },
                ),
                const SizedBox(width: 8),
                ElevatedButton.icon(
                  icon: const Icon(Icons.add, size: 16),
                  label: const Text('+ SRS'),
                  onPressed: onAddSrs,
                  style: ElevatedButton.styleFrom(
                    padding: const EdgeInsets.symmetric(
                        horizontal: 12, vertical: 8),
                    textStyle: const TextStyle(fontSize: 13),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
