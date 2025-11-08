import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

class ReadingScreen extends StatefulWidget {
  const ReadingScreen({super.key});

  @override
  State<ReadingScreen> createState() => _ReadingScreenState();
}

class _ReadingScreenState extends State<ReadingScreen> {
  String _selectedLevel = 'beginner';
  String _readingText = '';
  bool _isLoading = false;

  final Map<String, String> _readingLevels = {
    'beginner': 'Beginner',
    'intermediate': 'Intermediate',
    'advanced': 'Advanced',
  };

  @override
  void initState() {
    super.initState();
    _loadReadingMaterial();
  }

  Future<void> _loadReadingMaterial() async {
    setState(() => _isLoading = true);
    try {
      // Load reading material from assets
      final text = await rootBundle.loadString(
        'assets/text/reading_${_selectedLevel}_zh.txt',
      );
      if (mounted) {
        setState(() {
          _readingText = text;
          _isLoading = false;
        });
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          _readingText = 'Reading material will be available soon.\n\n'
              'This section will include:\n'
              '• Short stories in Chinese\n'
              '• Comprehension questions\n'
              '• Vocabulary lists\n'
              '• Cultural notes\n\n'
              'Practice reading authentic Chinese texts at your level.';
          _isLoading = false;
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Reading Skills'),
      ),
      body: Column(
        children: [
          _buildLevelSelector(),
          Expanded(child: _buildReadingContent()),
        ],
      ),
    );
  }

  Widget _buildLevelSelector() {
    return Container(
      padding: const EdgeInsets.all(16),
      color: Theme.of(context).colorScheme.primary.withOpacity(0.1),
      child: Row(
        children: [
          const Text('Level: ', style: TextStyle(fontWeight: FontWeight.bold)),
          const SizedBox(width: 8),
          Expanded(
            child: SegmentedButton<String>(
              segments: _readingLevels.entries.map((entry) {
                return ButtonSegment<String>(
                  value: entry.key,
                  label: Text(entry.value),
                );
              }).toList(),
              selected: {_selectedLevel},
              onSelectionChanged: (Set<String> newSelection) {
                setState(() {
                  _selectedLevel = newSelection.first;
                  _loadReadingMaterial();
                });
              },
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildReadingContent() {
    if (_isLoading) {
      return const Center(child: CircularProgressIndicator());
    }

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Card(
        child: Padding(
          padding: const EdgeInsets.all(20.0),
          child: SelectableText(
            _readingText,
            style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                  height: 2.0,
                  fontSize: 20,
                ),
          ),
        ),
      ),
    );
  }
}
