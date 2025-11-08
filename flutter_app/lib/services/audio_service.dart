import 'package:audioplayers/audioplayers.dart';

class AudioService {
  final AudioPlayer _audioPlayer = AudioPlayer();
  double _playbackSpeed = 1.0;
  bool _isLooping = false;

  AudioService() {
    _initializePlayer();
  }

  void _initializePlayer() {
    _audioPlayer.setReleaseMode(ReleaseMode.stop);
  }

  // Playback Controls
  Future<void> play(String assetPath) async {
    try {
      await _audioPlayer.play(AssetSource(assetPath));
    } catch (e) {
      print('Error playing audio: $e');
      rethrow;
    }
  }

  Future<void> pause() async {
    await _audioPlayer.pause();
  }

  Future<void> resume() async {
    await _audioPlayer.resume();
  }

  Future<void> stop() async {
    await _audioPlayer.stop();
  }

  Future<void> seek(Duration position) async {
    await _audioPlayer.seek(position);
  }

  // Playback Settings
  Future<void> setPlaybackSpeed(double speed) async {
    _playbackSpeed = speed;
    await _audioPlayer.setPlaybackRate(speed);
  }

  double get playbackSpeed => _playbackSpeed;

  Future<void> setLooping(bool loop) async {
    _isLooping = loop;
    await _audioPlayer.setReleaseMode(
      loop ? ReleaseMode.loop : ReleaseMode.stop,
    );
  }

  bool get isLooping => _isLooping;

  // Streams for UI updates
  Stream<PlayerState> get playerStateStream => _audioPlayer.onPlayerStateChanged;
  Stream<Duration> get positionStream => _audioPlayer.onPositionChanged;
  Stream<Duration?> get durationStream => _audioPlayer.onDurationChanged;

  // Player State
  Future<bool> get isPlaying async {
    final state = await _audioPlayer.getCurrentPosition();
    return state != null && state.inMilliseconds > 0;
  }

  Future<Duration?> get currentPosition => _audioPlayer.getCurrentPosition();
  Future<Duration?> get duration => _audioPlayer.getDuration();

  // Cleanup
  void dispose() {
    _audioPlayer.dispose();
  }

  // Load lesson audio based on day and language
  String getLessonAudioPath(int day, String language) {
    return 'audio/day${day}_$language.mp3';
  }

  // Play lesson audio
  Future<void> playLessonAudio(int day, String language) async {
    final audioPath = getLessonAudioPath(day, language);
    await play(audioPath);
  }
}
