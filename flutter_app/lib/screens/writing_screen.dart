import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../data/content_catalog.dart';
import '../models/lesson.dart';
import '../l10n/strings.dart';
import '../services/app_state.dart';
import '../services/content_service.dart';
import '../widgets/lesson_audio_player.dart';
import '../widgets/character_canvas.dart';

class WritingScreen extends StatefulWidget {
  const WritingScreen({super.key});

  @override
  State<WritingScreen> createState() => _WritingScreenState();
}

class _WritingScreenState extends State<WritingScreen> {
  String? _type;
  String? _level;
  ActivityInfo? _info;
  List<WritingExercise> _exercises = [];
  bool _loading = false;

  @override
  Widget build(BuildContext context) {
    final appState = context.watch<AppState>();
    final lang = appState.currentLanguage;

    return Scaffold(
      appBar: AppBar(
        title: Text(AppStrings.t(lang, zh: '写作技能', en: 'Writing Skills')),
      ),
      body: _type == null
          ? _typePicker()
          : _level == null
              ? _levelPicker(lang)
              : _loading
                  ? const Center(child: CircularProgressIndicator())
                  : _contentBody(appState, lang),
    );
  }

  Widget _typePicker() {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        _typeTile('character', 'Character Practice'),
        _typeTile('sentence', 'Sentence Building'),
        _typeTile('translation', 'Translation Practice'),
      ],
    );
  }

  Widget _typeTile(String type, String label) {
    return Card(
      child: ListTile(
        title: Text(label),
        trailing: const Icon(Icons.chevron_right),
        onTap: () => setState(() => _type = type),
      ),
    );
  }

  Widget _levelPicker(Language lang) {
    final levels = writingCatalog[_type!] ?? {};
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        TextButton(
          onPressed: () => setState(() => _type = null),
          child: const Text('← Back'),
        ),
        ...levels.entries.map((e) {
          return Card(
            child: ListTile(
              title: Text(e.value.displayTitle(lang)),
              subtitle: Text(e.value.displayDescription(lang)),
              onTap: () {
                setState(() {
                  _level = e.key;
                  _info = e.value;
                });
                _load(e.key);
              },
            ),
          );
        }),
      ],
    );
  }

  Future<void> _load(String level) async {
    setState(() => _loading = true);
    final appState = context.read<AppState>();
    final lang = appState.currentLanguage;
    final text = await appState.contentService.loadAssetText(
      appState.contentService.writingTextPath(_type!, level, lang),
    );
    if (mounted) {
      setState(() {
        _exercises = appState.contentService.parseWritingExercises(text);
        _loading = false;
      });
    }
  }

  Widget _contentBody(AppState appState, Language lang) {
    return SingleChildScrollView(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Padding(
            padding: const EdgeInsets.all(16),
            child: TextButton(
              onPressed: () => setState(() {
                _level = null;
                _info = null;
              }),
              child: const Text('← Back to activities'),
            ),
          ),
          if (_info != null)
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: Text(
                _info!.displayTitle(lang),
                style: Theme.of(context).textTheme.headlineSmall,
              ),
            ),
          if (_info != null && _info!.hasAudio)
            LessonAudioPlayer(
              audioPath: appState.contentService
                  .writingAudioPath(_type!, _level!, lang),
              showPinyinNote: lang == Language.pinyin,
            ),
          if (_type == 'character')
            const Padding(
              padding: EdgeInsets.all(16),
              child: CharacterCanvas(),
            ),
          ..._exercises.map((ex) => _exerciseCard(ex)),
          Padding(
            padding: const EdgeInsets.all(16),
            child: ElevatedButton(
              onPressed: appState.isWritingCompleted(_type!, _level!)
                  ? null
                  : () => appState.markWritingComplete(_type!, _level!),
              child: Text(
                appState.isWritingCompleted(_type!, _level!)
                    ? AppStrings.t(lang, zh: '已完成', en: 'Completed')
                    : AppStrings.t(lang, zh: '标记完成', en: 'Mark complete'),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _exerciseCard(WritingExercise ex) {
    final controller = TextEditingController();
    return Card(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(ex.prompt, style: const TextStyle(fontSize: 16)),
            const SizedBox(height: 8),
            TextField(
              controller: controller,
              maxLines: 3,
              decoration: const InputDecoration(
                border: OutlineInputBorder(),
                hintText: 'Your answer...',
              ),
            ),
            const SizedBox(height: 8),
            Row(
              children: [
                TextButton(
                  onPressed: () => controller.clear(),
                  child: const Text('Clear'),
                ),
                TextButton(
                  onPressed: () {
                    final ok = controller.text.trim().toLowerCase() ==
                        ex.answer.trim().toLowerCase();
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                        content: Text(ok ? 'Correct!' : 'Try again'),
                        backgroundColor: ok ? Colors.green : Colors.orange,
                      ),
                    );
                  },
                  child: const Text('Check'),
                ),
                if (ex.answer.isNotEmpty)
                  TextButton(
                    onPressed: () => controller.text = ex.answer,
                    child: const Text('Show answer'),
                  ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
