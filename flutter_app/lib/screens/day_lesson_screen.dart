import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/audio_cue.dart';
import '../models/lesson.dart';
import '../models/phrase_section.dart';
import '../l10n/strings.dart';
import '../services/app_state.dart';
import '../widgets/lesson_audio_player.dart';
import '../widgets/phrase_list.dart';

class DayLessonScreen extends StatefulWidget {
  const DayLessonScreen({super.key});

  @override
  State<DayLessonScreen> createState() => _DayLessonScreenState();
}

class _DayLessonScreenState extends State<DayLessonScreen> {
  late int _dayNumber;
  List<PhraseSection> _sections = [];
  List<AudioCue> _cues = [];
  int? _activeCue;
  bool _loading = true;
  String? _error;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    _dayNumber = ModalRoute.of(context)!.settings.arguments as int;
    _loadContent();
  }

  Future<void> _loadContent() async {
    setState(() {
      _loading = true;
      _error = null;
    });
    final appState = context.read<AppState>();
    final lang = appState.currentLanguage;
    try {
      final text = await appState.contentService.loadAssetText(
        appState.contentService.dayTextPath(_dayNumber, lang),
      );
      final timing = await appState.contentService.loadTiming(
        appState.contentService.dayTimingPath(_dayNumber, lang),
      );
      if (mounted) {
        setState(() {
          _sections = appState.contentService.parsePhraseSections(text);
          _cues = timing?.phrases ?? [];
          _loading = false;
        });
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          _error = e.toString();
          _loading = false;
        });
      }
    }
  }

  void _updateCue() {
    final appState = context.read<AppState>();
    final pos = appState.audioService.currentPosition;
    pos.then((p) {
      if (!mounted || p == null) return;
      final idx = appState.contentService.activeCueIndex(p, _cues);
      if (idx != _activeCue) setState(() => _activeCue = idx);
    });
  }

  @override
  Widget build(BuildContext context) {
    final appState = context.watch<AppState>();
    final lang = appState.currentLanguage;
    final lesson = appState.getLesson(_dayNumber);
    final audioPath = appState.contentService.dayAudioPath(_dayNumber, lang);

    return Scaffold(
      appBar: AppBar(
        title: Text('Day $_dayNumber'),
        actions: [
          IconButton(
            icon: Text(lang.flag, style: const TextStyle(fontSize: 24)),
            onPressed: () => _showLanguagePicker(appState),
          ),
        ],
      ),
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : _error != null
              ? Center(child: Text('Error: $_error'))
              : SingleChildScrollView(
                  child: Column(
                    children: [
                      _sectionInfo(lesson),
                      LessonAudioPlayer(
                        audioPath: audioPath,
                        showPinyinNote: lang == Language.pinyin,
                        onPositionTick: _updateCue,
                      ),
                      PhraseListView(
                        sections: _sections,
                        day: _dayNumber,
                        activeCueIndex: _activeCue,
                      ),
                      Padding(
                        padding: const EdgeInsets.all(16),
                        child: Row(
                          children: [
                            Expanded(
                              child: ElevatedButton.icon(
                                onPressed: appState.isDayCompleted(_dayNumber)
                                    ? null
                                    : () => appState.markDayComplete(_dayNumber),
                                icon: const Icon(Icons.check),
                                label: Text(
                                  appState.isDayCompleted(_dayNumber)
                                      ? AppStrings.t(lang,
                                          zh: '已完成', en: 'Completed')
                                      : AppStrings.t(lang,
                                          zh: '标记完成', en: 'Mark complete'),
                                ),
                              ),
                            ),
                            const SizedBox(width: 8),
                            OutlinedButton(
                              onPressed: () => Navigator.pushNamed(
                                context, '/quiz', arguments: _dayNumber),
                              child: Text(
                                AppStrings.t(lang, zh: '测验', en: 'Quiz'),
                              ),
                            ),
                          ],
                        ),
                      ),
                      _navButtons(),
                    ],
                  ),
                ),
    );
  }

  Widget _sectionInfo(Lesson lesson) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(16),
      color: Theme.of(context).colorScheme.primary.withValues(alpha: 0.1),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(lesson.section.title,
              style: Theme.of(context).textTheme.titleLarge?.copyWith(
                    fontWeight: FontWeight.bold,
                    color: Theme.of(context).colorScheme.primary,
                  )),
          Text(lesson.section.description),
        ],
      ),
    );
  }

  Widget _navButtons() {
    return Padding(
      padding: const EdgeInsets.all(16),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          ElevatedButton.icon(
            onPressed: _dayNumber > 1
                ? () => Navigator.pushReplacementNamed(
                      context, '/day', arguments: _dayNumber - 1)
                : null,
            icon: const Icon(Icons.arrow_back),
            label: const Text('Previous'),
          ),
          ElevatedButton(
            onPressed: () => Navigator.pushNamed(context, '/'),
            child: const Text('Home'),
          ),
          ElevatedButton.icon(
            onPressed: _dayNumber < 40
                ? () => Navigator.pushReplacementNamed(
                      context, '/day', arguments: _dayNumber + 1)
                : null,
            icon: const Icon(Icons.arrow_forward),
            label: const Text('Next'),
          ),
        ],
      ),
    );
  }

  void _showLanguagePicker(AppState appState) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Select Language'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: Language.values.map((l) {
            return ListTile(
              leading: Text(l.flag, style: const TextStyle(fontSize: 24)),
              title: Text(l.displayName),
              selected: appState.currentLanguage == l,
              onTap: () {
                appState.setLanguage(l);
                Navigator.pop(ctx);
                _loadContent();
              },
            );
          }).toList(),
        ),
      ),
    );
  }
}
