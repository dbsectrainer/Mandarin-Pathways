import 'package:audioplayers/audioplayers.dart' as ap;
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../services/app_state.dart';

class LessonAudioPlayer extends StatefulWidget {
  final String audioPath;
  final VoidCallback? onPositionTick;
  final bool showPinyinNote;

  const LessonAudioPlayer({
    super.key,
    required this.audioPath,
    this.onPositionTick,
    this.showPinyinNote = false,
  });

  @override
  State<LessonAudioPlayer> createState() => _LessonAudioPlayerState();
}

class _LessonAudioPlayerState extends State<LessonAudioPlayer> {
  ap.PlayerState _audioState = ap.PlayerState.stopped;
  Duration _position = Duration.zero;
  Duration _duration = Duration.zero;
  bool _listenersAttached = false;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    if (_listenersAttached) return;
    _listenersAttached = true;
    final audio = context.read<AppState>().audioService;
    audio.playerStateStream.listen((s) {
      if (mounted) setState(() => _audioState = s);
    });
    audio.positionStream.listen((p) {
      if (mounted) {
        setState(() => _position = p);
        widget.onPositionTick?.call();
      }
    });
    audio.durationStream.listen((d) {
      if (mounted && d != null) setState(() => _duration = d);
    });
  }

  @override
  Widget build(BuildContext context) {
    return Consumer<AppState>(
      builder: (context, appState, _) {
        return Card(
          margin: const EdgeInsets.all(16),
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              children: [
                if (widget.showPinyinNote)
                  Padding(
                    padding: const EdgeInsets.only(bottom: 8),
                    child: Text(
                      'Using Mandarin audio for reference.',
                      style: Theme.of(context).textTheme.bodySmall,
                    ),
                  ),
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    IconButton(
                      icon: const Icon(Icons.replay_10),
                      onPressed: () {
                        final p = _position - const Duration(seconds: 10);
                        appState.audioService.seek(
                          p < Duration.zero ? Duration.zero : p,
                        );
                      },
                    ),
                    IconButton(
                      iconSize: 48,
                      icon: Icon(_audioState == ap.PlayerState.playing
                          ? Icons.pause_circle_filled
                          : Icons.play_circle_filled),
                      onPressed: () => _toggle(appState),
                    ),
                    IconButton(
                      icon: const Icon(Icons.forward_10),
                      onPressed: () {
                        final p = _position + const Duration(seconds: 10);
                        appState.audioService.seek(
                          p > _duration ? _duration : p,
                        );
                      },
                    ),
                  ],
                ),
                Slider(
                  value: _position.inMilliseconds.toDouble().clamp(
                    0,
                    _duration.inMilliseconds.toDouble() > 0
                        ? _duration.inMilliseconds.toDouble()
                        : 1,
                  ),
                  max: _duration.inMilliseconds.toDouble() > 0
                      ? _duration.inMilliseconds.toDouble()
                      : 1,
                  onChanged: (v) => appState.audioService
                      .seek(Duration(milliseconds: v.toInt())),
                ),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(_fmt(_position)),
                    Text(_fmt(_duration)),
                  ],
                ),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                  children: [
                    DropdownButton<double>(
                      value: appState.audioService.playbackSpeed,
                      items: [0.5, 0.75, 1.0, 1.25, 1.5, 2.0]
                          .map((s) => DropdownMenuItem(
                                value: s,
                                child: Text('${s}x'),
                              ))
                          .toList(),
                      onChanged: (s) {
                        if (s != null) appState.setAudioSpeed(s);
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
                      onPressed: () => appState.setAudioLooping(
                        !appState.audioService.isLooping,
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  Future<void> _toggle(AppState appState) async {
    if (_audioState == ap.PlayerState.playing) {
      await appState.audioService.pause();
    } else {
      await appState.audioService.play(widget.audioPath);
    }
  }

  String _fmt(Duration d) {
    final m = d.inMinutes.remainder(60).toString().padLeft(2, '0');
    final s = d.inSeconds.remainder(60).toString().padLeft(2, '0');
    return '$m:$s';
  }
}
