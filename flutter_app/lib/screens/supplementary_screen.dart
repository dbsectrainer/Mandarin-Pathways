import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/audio_cue.dart';
import '../models/lesson.dart';
import '../models/phrase_section.dart';
import '../l10n/strings.dart';
import '../services/app_state.dart';
import '../widgets/lesson_audio_player.dart';
import '../widgets/phrase_list.dart';

class SupplementaryScreen extends StatefulWidget {
  const SupplementaryScreen({super.key});

  @override
  State<SupplementaryScreen> createState() => _SupplementaryScreenState();
}

class _SupplementaryScreenState extends State<SupplementaryScreen> {
  String? _category;
  List<PhraseSection> _sections = [];
  List<AudioCue> _cues = [];
  int? _activeCue;
  bool _loading = true;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    _category = ModalRoute.of(context)?.settings.arguments as String?;
    _load();
  }

  Future<void> _load() async {
    if (_category == null) return;
    setState(() => _loading = true);
    final appState = context.read<AppState>();
    final lang = appState.currentLanguage;
    final text = await appState.contentService.loadAssetText(
      appState.contentService.supplementaryTextPath(_category!, lang),
    );
    final timing = await appState.contentService.loadTiming(
      appState.contentService.supplementaryTimingPath(_category!, lang),
    );
    if (mounted) {
      setState(() {
        _sections = appState.contentService.parsePhraseSections(text);
        _cues = timing?.phrases ?? [];
        _loading = false;
      });
    }
  }

  void _updateCue() {
    final appState = context.read<AppState>();
    appState.audioService.currentPosition.then((p) {
      if (!mounted || p == null) return;
      setState(() {
        _activeCue = appState.contentService.activeCueIndex(p, _cues);
      });
    });
  }

  @override
  Widget build(BuildContext context) {
    final appState = context.watch<AppState>();
    final lang = appState.currentLanguage;
    final title = _titleFor(_category);

    return Scaffold(
      appBar: AppBar(title: Text(title)),
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : SingleChildScrollView(
              child: Column(
                children: [
                  LessonAudioPlayer(
                    audioPath: appState.contentService
                        .supplementaryAudioPath(_category!, lang),
                    showPinyinNote: lang == Language.pinyin,
                    onPositionTick: _updateCue,
                  ),
                  PhraseListView(
                    sections: _sections,
                    day: 0,
                    activeCueIndex: _activeCue,
                  ),
                  Padding(
                    padding: const EdgeInsets.all(16),
                    child: ElevatedButton.icon(
                      onPressed: appState.isSupplementaryCompleted(_category!)
                          ? null
                          : () => appState.markSupplementaryComplete(_category!),
                      icon: const Icon(Icons.check),
                      label: Text(
                        appState.isSupplementaryCompleted(_category!)
                            ? AppStrings.t(lang, zh: '已完成', en: 'Completed')
                            : AppStrings.t(lang,
                                zh: '标记完成', en: 'Mark complete'),
                      ),
                    ),
                  ),
                ],
              ),
            ),
    );
  }

  String _titleFor(String? cat) {
    switch (cat) {
      case 'education':
        return 'Education & Academic Life';
      case 'hobbies':
        return 'Hobbies & Interests';
      case 'emotions':
        return 'Emotions & Feelings';
      case 'daily_life':
        return 'Weather & Daily Life';
      case 'comparisons':
        return 'Comparison Structures';
      default:
        return 'Supplementary Materials';
    }
  }
}
