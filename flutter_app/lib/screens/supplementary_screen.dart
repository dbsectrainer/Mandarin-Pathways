import 'package:flutter/material.dart';

class SupplementaryScreen extends StatelessWidget {
  const SupplementaryScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final String? category =
        ModalRoute.of(context)?.settings.arguments as String?;

    return Scaffold(
      appBar: AppBar(
        title: Text(_getCategoryTitle(category)),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Card(
          child: Padding(
            padding: const EdgeInsets.all(20.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  _getCategoryTitle(category),
                  style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                        fontWeight: FontWeight.bold,
                      ),
                ),
                const SizedBox(height: 16),
                Text(
                  _getCategoryContent(category),
                  style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                        height: 1.8,
                      ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  String _getCategoryTitle(String? category) {
    switch (category) {
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

  String _getCategoryContent(String? category) {
    switch (category) {
      case 'education':
        return 'Learn vocabulary and phrases for academic settings:\n\n'
            '• Classroom interactions\n'
            '• Study-related terms\n'
            '• Educational institutions\n'
            '• Academic discussions';
      case 'hobbies':
        return 'Express your interests and hobbies:\n\n'
            '• Sports and activities\n'
            '• Arts and crafts\n'
            '• Music and entertainment\n'
            '• Leisure activities';
      case 'emotions':
        return 'Communicate your feelings effectively:\n\n'
            '• Basic emotions\n'
            '• Complex feelings\n'
            '• Emotional expressions\n'
            '• Empathy and understanding';
      case 'daily_life':
        return 'Essential phrases for everyday life:\n\n'
            '• Weather descriptions\n'
            '• Daily routines\n'
            '• Time expressions\n'
            '• Common activities';
      case 'comparisons':
        return 'Master comparison structures:\n\n'
            '• Basic comparisons (比)\n'
            '• Superlatives (最)\n'
            '• Equal comparisons (跟...一样)\n'
            '• Preference expressions';
      default:
        return 'Select a category to view supplementary learning materials.';
    }
  }
}
