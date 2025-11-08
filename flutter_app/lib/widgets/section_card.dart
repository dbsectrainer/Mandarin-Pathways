import 'package:flutter/material.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import '../models/lesson.dart';

class SectionCard extends StatelessWidget {
  final LessonSection section;

  const SectionCard({super.key, required this.section});

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: Theme.of(context).colorScheme.primary.withOpacity(0.1),
                borderRadius: BorderRadius.circular(8),
              ),
              child: FaIcon(
                _getSectionIcon(section),
                color: Theme.of(context).colorScheme.primary,
                size: 24,
              ),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    section.title,
                    style: Theme.of(context).textTheme.titleMedium?.copyWith(
                          fontWeight: FontWeight.bold,
                        ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    section.description,
                    style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                          color: Colors.grey[600],
                        ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  IconData _getSectionIcon(LessonSection section) {
    switch (section) {
      case LessonSection.basics:
        return FontAwesomeIcons.star;
      case LessonSection.essentials:
        return FontAwesomeIcons.comments;
      case LessonSection.cultural:
        return FontAwesomeIcons.building;
      case LessonSection.professional:
        return FontAwesomeIcons.laptopCode;
      case LessonSection.advanced:
        return FontAwesomeIcons.graduationCap;
    }
  }
}
