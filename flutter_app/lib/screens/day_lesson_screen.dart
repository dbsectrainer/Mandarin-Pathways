import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';
import 'package:audioplayers/audioplayers.dart';
import 'package:youtube_player_flutter/youtube_player_flutter.dart';
import '../models/lesson.dart';
import '../services/app_state.dart';

class DayLessonScreen extends StatefulWidget {
  const DayLessonScreen({super.key});

  @override
  State<DayLessonScreen> createState() => _DayLessonScreenState();
}

class _DayLessonScreenState extends State<DayLessonScreen> {
  late int _dayNumber;
  late Lesson _lesson;
  String _lessonText = '';
  bool _isLoadingText = true;
  PlayerState _audioState = PlayerState.stopped;
  Duration _audioDuration = Duration.zero;
  Duration _audioPosition = Duration.zero;
  YoutubePlayerController? _youtubeController;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    _dayNumber = ModalRoute.of(context)!.settings.arguments as int;
    final appState = context.read<AppState>();
    _lesson = appState.getLesson(_dayNumber);
    _loadLessonText();
    _initializeVideo();
    _setupAudioListeners();
  }

  void _setupAudioListeners() {
    final appState = context.read<AppState>();
    appState.audioService.playerStateStream.listen((state) {
      if (mounted) {
        setState(() => _audioState = state);
      }
    });

    appState.audioService.positionStream.listen((position) {
      if (mounted) {
        setState(() => _audioPosition = position);
      }
    });

    appState.audioService.durationStream.listen((duration) {
      if (mounted && duration != null) {
        setState(() => _audioDuration = duration);
      }
    });
  }

  Future<void> _loadLessonText() async {
    setState(() => _isLoadingText = true);
    try {
      final appState = context.read<AppState>();
      final textPath = _lesson.textFiles[appState.currentLanguage.code];
      if (textPath != null) {
        final text = await rootBundle.loadString('assets/$textPath');
        if (mounted) {
          setState(() {
            _lessonText = text;
            _isLoadingText = false;
          });
        }
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          _lessonText = 'Error loading lesson text: $e';
          _isLoadingText = false;
        });
      }
    }
  }

  void _initializeVideo() {
    if (_lesson.videoId != null && _lesson.videoId!.isNotEmpty) {
      _youtubeController = YoutubePlayerController(
        initialVideoId: _lesson.videoId!,
        flags: const YoutubePlayerFlags(
          autoPlay: false,
          mute: false,
        ),
      );
    }
  }

  @override
  void dispose() {
    _youtubeController?.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Day $_dayNumber'),
        actions: [
          Consumer<AppState>(
            builder: (context, appState, child) {
              return IconButton(
                icon: Text(
                  appState.currentLanguage.flag,
                  style: const TextStyle(fontSize: 24),
                ),
                onPressed: () => _showLanguageSelector(appState),
              );
            },
          ),
        ],
      ),
      body: Consumer<AppState>(
        builder: (context, appState, child) {
          return SingleChildScrollView(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                _buildSectionInfo(),
                _buildAudioPlayer(appState),
                _buildLessonContent(),
                if (_youtubeController != null) _buildVideoPlayer(),
                _buildCompletionButton(appState),
                _buildNavigation(),
              ],
            ),
          );
        },
      ),
    );
  }

  Widget _buildSectionInfo() {
    return Container(
      padding: const EdgeInsets.all(16),
      color: Theme.of(context).colorScheme.primary.withOpacity(0.1),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            _lesson.section.title,
            style: Theme.of(context).textTheme.titleLarge?.copyWith(
                  fontWeight: FontWeight.bold,
                  color: Theme.of(context).colorScheme.primary,
                ),
          ),
          const SizedBox(height: 4),
          Text(
            _lesson.section.description,
            style: Theme.of(context).textTheme.bodyMedium,
          ),
        ],
      ),
    );
  }

  Widget _buildAudioPlayer(AppState appState) {
    return Card(
      margin: const EdgeInsets.all(16),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                IconButton(
                  icon: const Icon(Icons.replay_10),
                  onPressed: () {
                    final newPosition = _audioPosition - const Duration(seconds: 10);
                    appState.audioService.seek(
                      newPosition < Duration.zero ? Duration.zero : newPosition,
                    );
                  },
                ),
                IconButton(
                  iconSize: 48,
                  icon: Icon(
                    _audioState == PlayerState.playing
                        ? Icons.pause_circle_filled
                        : Icons.play_circle_filled,
                  ),
                  onPressed: () => _toggleAudio(appState),
                ),
                IconButton(
                  icon: const Icon(Icons.forward_10),
                  onPressed: () {
                    final newPosition = _audioPosition + const Duration(seconds: 10);
                    appState.audioService.seek(
                      newPosition > _audioDuration ? _audioDuration : newPosition,
                    );
                  },
                ),
              ],
            ),
            const SizedBox(height: 8),
            Slider(
              value: _audioPosition.inMilliseconds.toDouble(),
              max: _audioDuration.inMilliseconds.toDouble() > 0
                  ? _audioDuration.inMilliseconds.toDouble()
                  : 1.0,
              onChanged: (value) {
                appState.audioService.seek(Duration(milliseconds: value.toInt()));
              },
            ),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(_formatDuration(_audioPosition)),
                Text(_formatDuration(_audioDuration)),
              ],
            ),
            const SizedBox(height: 8),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                DropdownButton<double>(
                  value: appState.audioService.playbackSpeed,
                  items: [0.5, 0.75, 1.0, 1.25, 1.5, 2.0].map((speed) {
                    return DropdownMenuItem(
                      value: speed,
                      child: Text('${speed}x'),
                    );
                  }).toList(),
                  onChanged: (speed) {
                    if (speed != null) {
                      appState.setAudioSpeed(speed);
                    }
                  },
                ),
                IconButton(
                  icon: Icon(
                    appState.audioService.isLooping
                        ? Icons.repeat_one
                        : Icons.repeat,
                    color: appState.audioService.isLooping
                        ? Theme.of(context).colorScheme.primary
                        : null,
                  ),
                  onPressed: () {
                    appState.setAudioLooping(!appState.audioService.isLooping);
                  },
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildLessonContent() {
    return Card(
      margin: const EdgeInsets.all(16),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: _isLoadingText
            ? const Center(child: CircularProgressIndicator())
            : SelectableText(
                _lessonText,
                style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                      height: 1.8,
                      fontSize: 18,
                    ),
              ),
      ),
    );
  }

  Widget _buildVideoPlayer() {
    if (_youtubeController == null) return const SizedBox.shrink();

    return Card(
      margin: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: Text(
              'Practice with Native Speaker',
              style: Theme.of(context).textTheme.titleLarge?.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
            ),
          ),
          YoutubePlayer(
            controller: _youtubeController!,
            showVideoProgressIndicator: true,
            progressIndicatorColor: Theme.of(context).colorScheme.primary,
          ),
        ],
      ),
    );
  }

  Widget _buildCompletionButton(AppState appState) {
    final isCompleted = appState.isDayCompleted(_dayNumber);

    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: ElevatedButton.icon(
        onPressed: isCompleted
            ? null
            : () async {
                await appState.markDayComplete(_dayNumber);
                if (mounted) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(
                      content: Text('Day $_dayNumber marked as complete! 🎉'),
                      backgroundColor: Colors.green,
                    ),
                  );
                }
              },
        icon: Icon(isCompleted ? Icons.check_circle : Icons.check),
        label: Text(isCompleted ? 'Completed' : 'Mark as Complete'),
        style: ElevatedButton.styleFrom(
          padding: const EdgeInsets.symmetric(vertical: 16),
          backgroundColor: isCompleted ? Colors.grey : null,
        ),
      ),
    );
  }

  Widget _buildNavigation() {
    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          ElevatedButton.icon(
            onPressed: _dayNumber > 1
                ? () {
                    Navigator.pushReplacementNamed(
                      context,
                      '/day',
                      arguments: _dayNumber - 1,
                    );
                  }
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
                ? () {
                    Navigator.pushReplacementNamed(
                      context,
                      '/day',
                      arguments: _dayNumber + 1,
                    );
                  }
                : null,
            icon: const Icon(Icons.arrow_forward),
            label: const Text('Next'),
          ),
        ],
      ),
    );
  }

  Future<void> _toggleAudio(AppState appState) async {
    if (_audioState == PlayerState.playing) {
      await appState.audioService.pause();
    } else {
      final audioPath = _lesson.audioFiles[appState.currentLanguage.code];
      if (audioPath != null) {
        await appState.audioService.play(audioPath);
      }
    }
  }

  String _formatDuration(Duration duration) {
    String twoDigits(int n) => n.toString().padLeft(2, '0');
    final minutes = twoDigits(duration.inMinutes.remainder(60));
    final seconds = twoDigits(duration.inSeconds.remainder(60));
    return '$minutes:$seconds';
  }

  void _showLanguageSelector(AppState appState) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Select Language'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: Language.values.map((language) {
            return ListTile(
              leading: Text(language.flag, style: const TextStyle(fontSize: 24)),
              title: Text(language.displayName),
              selected: appState.currentLanguage == language,
              onTap: () {
                appState.setLanguage(language);
                Navigator.pop(context);
                _loadLessonText(); // Reload text in new language
              },
            );
          }).toList(),
        ),
      ),
    );
  }
}
