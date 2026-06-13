import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../data/content_catalog.dart';
import '../models/audio_cue.dart';
import '../models/lesson.dart';
import '../l10n/strings.dart';
import '../services/app_state.dart';
import '../services/content_service.dart';
import '../widgets/lesson_audio_player.dart';

class ReadingScreen extends StatefulWidget {
  const ReadingScreen({super.key});

  @override
  State<ReadingScreen> createState() => _ReadingScreenState();
}

class _ReadingScreenState extends State<ReadingScreen> {
  String? _level;
  String? _topic;
  ParsedReadingContent? _content;
  List<AudioCue> _cues = [];
  int? _activeCue;
  bool _loading = false;

  @override
  Widget build(BuildContext context) {
    final appState = context.watch<AppState>();
    final lang = appState.currentLanguage;

    return Scaffold(
      appBar: AppBar(title: Text(AppStrings.t(lang, zh: '阅读技能', en: 'Reading Skills'))),
      body: _level == null
          ? _levelPicker()
          : _topic == null
              ? _topicPicker()
              : _loading
                  ? const Center(child: CircularProgressIndicator())
                  : _readingBody(appState, lang),
    );
  }

  Widget _levelPicker() {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: readingCatalog.keys.map((level) {
        return Card(
          child: ListTile(
            title: Text(level[0].toUpperCase() + level.substring(1)),
            trailing: const Icon(Icons.chevron_right),
            onTap: () => setState(() => _level = level),
          ),
        );
      }).toList(),
    );
  }

  Widget _topicPicker() {
    final topics = readingCatalog[_level!] ?? [];
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        TextButton(
          onPressed: () => setState(() => _level = null),
          child: const Text('← Back to levels'),
        ),
        ...topics.map((t) {
          return Card(
            child: ListTile(
              title: Text(t.info.title),
              subtitle: Text(t.info.description),
              onTap: () {
                setState(() => _topic = t.name);
                _load(t.name);
              },
            ),
          );
        }),
      ],
    );
  }

  Future<void> _load(String topic) async {
    setState(() => _loading = true);
    final appState = context.read<AppState>();
    final lang = appState.currentLanguage;
    final text = await appState.contentService.loadAssetText(
      appState.contentService.readingTextPath(_level!, topic, lang),
    );
    final timing = await appState.contentService.loadTiming(
      appState.contentService.readingTimingPath(_level!, topic, lang),
    );
    if (mounted) {
      setState(() {
        _content = appState.contentService.parseReadingContent(text, lang);
        _cues = timing?.phrases ?? [];
        _loading = false;
      });
    }
  }

  Widget _readingBody(AppState appState, Language lang) {
    final content = _content!;
    return SingleChildScrollView(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Padding(
            padding: const EdgeInsets.all(16),
            child: TextButton(
              onPressed: () => setState(() {
                _topic = null;
                _content = null;
              }),
              child: const Text('← Back to topics'),
            ),
          ),
          LessonAudioPlayer(
            audioPath: appState.contentService
                .readingAudioPath(_level!, _topic!, lang),
            showPinyinNote: lang == Language.pinyin,
            onPositionTick: () {
              appState.audioService.currentPosition.then((p) {
                if (!mounted || p == null) return;
                setState(() {
                  _activeCue =
                      appState.contentService.activeCueIndex(p, _cues);
                });
              });
            },
          ),
          ...content.mainSegments.asMap().entries.map((e) {
            final active = _activeCue == e.key;
            return Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
              child: Card(
                color: active
                    ? Theme.of(context)
                        .colorScheme
                        .primary
                        .withValues(alpha: 0.1)
                    : null,
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: SelectableText(e.value,
                      style: const TextStyle(fontSize: 18, height: 1.8)),
                ),
              ),
            );
          }),
          if (content.vocabularyText.isNotEmpty)
            _section('Vocabulary', content.vocabularyText),
          if (content.questionsText.isNotEmpty)
            _section('Comprehension Questions', content.questionsText),
          Padding(
            padding: const EdgeInsets.all(16),
            child: ElevatedButton(
              onPressed: appState.isReadingCompleted(_level!, _topic!)
                  ? null
                  : () => appState.markReadingComplete(_level!, _topic!),
              child: Text(
                appState.isReadingCompleted(_level!, _topic!)
                    ? AppStrings.t(lang, zh: '已完成', en: 'Completed')
                    : AppStrings.t(lang, zh: '标记完成', en: 'Mark complete'),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _section(String title, String body) {
    return Padding(
      padding: const EdgeInsets.all(16),
      child: Card(
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(title,
                  style: Theme.of(context).textTheme.titleMedium?.copyWith(
                        fontWeight: FontWeight.bold,
                      )),
              const SizedBox(height: 8),
              SelectableText(body, style: const TextStyle(height: 1.8)),
            ],
          ),
        ),
      ),
    );
  }
}
