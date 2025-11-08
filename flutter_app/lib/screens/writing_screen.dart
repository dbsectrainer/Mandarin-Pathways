import 'package:flutter/material.dart';

class WritingScreen extends StatefulWidget {
  const WritingScreen({super.key});

  @override
  State<WritingScreen> createState() => _WritingScreenState();
}

class _WritingScreenState extends State<WritingScreen> {
  final TextEditingController _textController = TextEditingController();
  String _selectedExercise = 'characters';

  final Map<String, String> _exercises = {
    'characters': 'Character Practice',
    'sentences': 'Sentence Building',
    'translation': 'Translation Practice',
  };

  @override
  void dispose() {
    _textController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Writing Skills'),
      ),
      body: Column(
        children: [
          _buildExerciseSelector(),
          Expanded(child: _buildWritingArea()),
        ],
      ),
    );
  }

  Widget _buildExerciseSelector() {
    return Container(
      padding: const EdgeInsets.all(16),
      color: Theme.of(context).colorScheme.primary.withOpacity(0.1),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Exercise Type:',
            style: TextStyle(fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 8),
          SegmentedButton<String>(
            segments: _exercises.entries.map((entry) {
              return ButtonSegment<String>(
                value: entry.key,
                label: Text(entry.value),
              );
            }).toList(),
            selected: {_selectedExercise},
            onSelectionChanged: (Set<String> newSelection) {
              setState(() {
                _selectedExercise = newSelection.first;
              });
            },
          ),
        ],
      ),
    );
  }

  Widget _buildWritingArea() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Card(
            child: Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    _getExerciseDescription(),
                    style: Theme.of(context).textTheme.bodyLarge,
                  ),
                  const SizedBox(height: 16),
                  Text(
                    _getExercisePrompt(),
                    style: Theme.of(context).textTheme.titleMedium?.copyWith(
                          fontWeight: FontWeight.bold,
                        ),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 16),
          Card(
            child: Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Your Answer:',
                    style: Theme.of(context).textTheme.titleMedium,
                  ),
                  const SizedBox(height: 8),
                  TextField(
                    controller: _textController,
                    maxLines: 10,
                    decoration: const InputDecoration(
                      hintText: 'Type your answer here...',
                      border: OutlineInputBorder(),
                    ),
                    style: const TextStyle(fontSize: 18, height: 1.8),
                  ),
                  const SizedBox(height: 16),
                  Row(
                    children: [
                      ElevatedButton(
                        onPressed: _textController.clear,
                        child: const Text('Clear'),
                      ),
                      const SizedBox(width: 8),
                      ElevatedButton.icon(
                        onPressed: () {
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(
                              content: Text('Answer saved! Keep practicing.'),
                            ),
                          );
                        },
                        icon: const Icon(Icons.save),
                        label: const Text('Save'),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 16),
          if (_selectedExercise == 'characters') _buildCharacterGrid(),
        ],
      ),
    );
  }

  Widget _buildCharacterGrid() {
    final characters = ['你', '好', '我', '是', '的', '在', '有', '不', '人', '们'];

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Common Characters:',
              style: Theme.of(context).textTheme.titleMedium,
            ),
            const SizedBox(height: 16),
            Wrap(
              spacing: 12,
              runSpacing: 12,
              children: characters.map((char) {
                return InkWell(
                  onTap: () {
                    _textController.text += char;
                  },
                  child: Container(
                    width: 60,
                    height: 60,
                    decoration: BoxDecoration(
                      border: Border.all(
                        color: Theme.of(context).colorScheme.primary,
                      ),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Center(
                      child: Text(
                        char,
                        style: const TextStyle(
                          fontSize: 32,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  ),
                );
              }).toList(),
            ),
          ],
        ),
      ),
    );
  }

  String _getExerciseDescription() {
    switch (_selectedExercise) {
      case 'characters':
        return 'Practice writing Chinese characters. Tap the characters below to add them to your answer.';
      case 'sentences':
        return 'Build complete sentences using Chinese characters and grammar patterns.';
      case 'translation':
        return 'Translate the given English sentence into Chinese.';
      default:
        return '';
    }
  }

  String _getExercisePrompt() {
    switch (_selectedExercise) {
      case 'characters':
        return 'Write: "Hello, how are you?" in Chinese';
      case 'sentences':
        return 'Build a sentence: "I like to study Chinese."';
      case 'translation':
        return 'Translate: "Where is the nearest restaurant?"';
      default:
        return '';
    }
  }
}
