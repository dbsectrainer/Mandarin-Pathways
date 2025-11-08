import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import '../models/lesson.dart';
import '../services/app_state.dart';
import '../widgets/language_card.dart';
import '../widgets/section_card.dart';
import '../widgets/benefit_card.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  int _currentPage = 0;
  static const int _daysPerPage = 10;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Mandarin Pathways'),
        actions: [
          _buildLanguageSelector(),
          IconButton(
            icon: const Icon(Icons.notifications_outlined),
            onPressed: _showNotificationSettings,
          ),
        ],
      ),
      body: Consumer<AppState>(
        builder: (context, appState, child) {
          if (appState.isLoading) {
            return const Center(child: CircularProgressIndicator());
          }

          return SingleChildScrollView(
            child: Column(
              children: [
                _buildHeroSection(context),
                _buildLanguageCards(appState),
                const SizedBox(height: 32),
                _buildCourseStructure(),
                const SizedBox(height: 32),
                _buildDailyLessons(appState),
                const SizedBox(height: 32),
                _buildCoreSkills(),
                const SizedBox(height: 32),
                _buildSupplementaryMaterials(),
                const SizedBox(height: 32),
                _buildBenefits(),
                const SizedBox(height: 32),
              ],
            ),
          );
        },
      ),
    );
  }

  Widget _buildLanguageSelector() {
    return Consumer<AppState>(
      builder: (context, appState, child) {
        return PopupMenuButton<Language>(
          icon: Text(
            appState.currentLanguage.flag,
            style: const TextStyle(fontSize: 24),
          ),
          onSelected: (Language language) {
            appState.setLanguage(language);
          },
          itemBuilder: (BuildContext context) {
            return Language.values.map((Language language) {
              return PopupMenuItem<Language>(
                value: language,
                child: Row(
                  children: [
                    Text(language.flag, style: const TextStyle(fontSize: 20)),
                    const SizedBox(width: 8),
                    Text(language.displayName),
                  ],
                ),
              );
            }).toList();
          },
        );
      },
    );
  }

  Widget _buildHeroSection(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(32),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            Theme.of(context).colorScheme.primary,
            Theme.of(context).colorScheme.secondary,
          ],
        ),
      ),
      child: Column(
        children: [
          Text(
            'Master Mandarin Chinese',
            style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                  color: Colors.white,
                  fontWeight: FontWeight.bold,
                ),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 16),
          Text(
            'Embark on a 40-day journey through comprehensive Mandarin learning for global opportunities',
            style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                  color: Colors.white.withOpacity(0.9),
                ),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }

  Widget _buildLanguageCards(AppState appState) {
    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        children: [
          LanguageCard(
            language: Language.chinese,
            progress: appState.getProgressForLanguage(Language.chinese.code),
            completedDays: appState.getCompletedDaysForLanguage(Language.chinese.code),
          ),
          const SizedBox(height: 16),
          LanguageCard(
            language: Language.pinyin,
            progress: appState.getProgressForLanguage(Language.pinyin.code),
            completedDays: appState.getCompletedDaysForLanguage(Language.pinyin.code),
          ),
          const SizedBox(height: 16),
          LanguageCard(
            language: Language.english,
            progress: appState.getProgressForLanguage(Language.english.code),
            completedDays: appState.getCompletedDaysForLanguage(Language.english.code),
          ),
        ],
      ),
    );
  }

  Widget _buildCourseStructure() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Course Structure',
            style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                  fontWeight: FontWeight.bold,
                ),
          ),
          const SizedBox(height: 16),
          ...LessonSection.values.map((section) => SectionCard(section: section)),
        ],
      ),
    );
  }

  Widget _buildDailyLessons(AppState appState) {
    final lessons = appState.getAllLessons();
    final startIndex = _currentPage * _daysPerPage;
    final endIndex = (startIndex + _daysPerPage).clamp(0, lessons.length);
    final currentLessons = lessons.sublist(startIndex, endIndex);

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Daily Lessons',
            style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                  fontWeight: FontWeight.bold,
                ),
          ),
          const SizedBox(height: 16),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              IconButton(
                icon: const Icon(Icons.chevron_left),
                onPressed: _currentPage > 0
                    ? () => setState(() => _currentPage--)
                    : null,
              ),
              Text(
                'Days ${startIndex + 1}-$endIndex',
                style: Theme.of(context).textTheme.titleMedium,
              ),
              IconButton(
                icon: const Icon(Icons.chevron_right),
                onPressed: endIndex < lessons.length
                    ? () => setState(() => _currentPage++)
                    : null,
              ),
            ],
          ),
          const SizedBox(height: 16),
          GridView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 5,
              childAspectRatio: 1,
              crossAxisSpacing: 8,
              mainAxisSpacing: 8,
            ),
            itemCount: currentLessons.length,
            itemBuilder: (context, index) {
              final lesson = currentLessons[index];
              final isCompleted = appState.isDayCompleted(lesson.day);
              return _buildDayButton(context, lesson, isCompleted);
            },
          ),
        ],
      ),
    );
  }

  Widget _buildDayButton(BuildContext context, Lesson lesson, bool isCompleted) {
    return InkWell(
      onTap: () {
        Navigator.pushNamed(
          context,
          '/day',
          arguments: lesson.day,
        );
      },
      child: Container(
        decoration: BoxDecoration(
          color: isCompleted
              ? Theme.of(context).colorScheme.primary.withOpacity(0.1)
              : Colors.grey[100],
          borderRadius: BorderRadius.circular(8),
          border: Border.all(
            color: isCompleted
                ? Theme.of(context).colorScheme.primary
                : Colors.grey[300]!,
          ),
        ),
        child: Stack(
          children: [
            Center(
              child: Text(
                '${lesson.day}',
                style: Theme.of(context).textTheme.titleLarge?.copyWith(
                      fontWeight: FontWeight.bold,
                      color: isCompleted
                          ? Theme.of(context).colorScheme.primary
                          : Colors.grey[700],
                    ),
              ),
            ),
            if (isCompleted)
              Positioned(
                top: 4,
                right: 4,
                child: Icon(
                  Icons.check_circle,
                  size: 16,
                  color: Theme.of(context).colorScheme.primary,
                ),
              ),
          ],
        ),
      ),
    );
  }

  Widget _buildCoreSkills() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Core Language Skills',
            style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                  fontWeight: FontWeight.bold,
                ),
          ),
          const SizedBox(height: 16),
          Row(
            children: [
              Expanded(
                child: _buildSkillCard(
                  'Reading Skills',
                  FontAwesomeIcons.bookOpen,
                  '/reading',
                ),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: _buildSkillCard(
                  'Writing Skills',
                  FontAwesomeIcons.pen,
                  '/writing',
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildSkillCard(String title, IconData icon, String route) {
    return Card(
      child: InkWell(
        onTap: () => Navigator.pushNamed(context, route),
        borderRadius: BorderRadius.circular(12),
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            children: [
              FaIcon(icon, size: 32, color: Theme.of(context).colorScheme.primary),
              const SizedBox(height: 8),
              Text(
                title,
                style: Theme.of(context).textTheme.titleMedium,
                textAlign: TextAlign.center,
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildSupplementaryMaterials() {
    final categories = [
      {'title': 'Education & Academic Life', 'icon': FontAwesomeIcons.graduationCap, 'category': 'education'},
      {'title': 'Hobbies & Interests', 'icon': FontAwesomeIcons.palette, 'category': 'hobbies'},
      {'title': 'Emotions & Feelings', 'icon': FontAwesomeIcons.heart, 'category': 'emotions'},
      {'title': 'Weather & Daily Life', 'icon': FontAwesomeIcons.cloudSun, 'category': 'daily_life'},
      {'title': 'Comparison Structures', 'icon': FontAwesomeIcons.balanceScale, 'category': 'comparisons'},
    ];

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Supplementary Learning Materials',
            style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                  fontWeight: FontWeight.bold,
                ),
          ),
          const SizedBox(height: 16),
          GridView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 2,
              childAspectRatio: 1.2,
              crossAxisSpacing: 16,
              mainAxisSpacing: 16,
            ),
            itemCount: categories.length,
            itemBuilder: (context, index) {
              final cat = categories[index];
              return Card(
                child: InkWell(
                  onTap: () {
                    Navigator.pushNamed(
                      context,
                      '/supplementary',
                      arguments: cat['category'],
                    );
                  },
                  borderRadius: BorderRadius.circular(12),
                  child: Padding(
                    padding: const EdgeInsets.all(16.0),
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        FaIcon(
                          cat['icon'] as IconData,
                          size: 32,
                          color: Theme.of(context).colorScheme.primary,
                        ),
                        const SizedBox(height: 8),
                        Text(
                          cat['title'] as String,
                          style: Theme.of(context).textTheme.bodyMedium,
                          textAlign: TextAlign.center,
                        ),
                      ],
                    ),
                  ),
                ),
              );
            },
          ),
        ],
      ),
    );
  }

  Widget _buildBenefits() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Why Learn Mandarin Chinese?',
            style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                  fontWeight: FontWeight.bold,
                ),
          ),
          const SizedBox(height: 16),
          const BenefitCard(
            title: 'Global Reach & Impact',
            icon: FontAwesomeIcons.globe,
            benefits: [
              'Over 1 billion native speakers worldwide',
              'China\'s massive economic influence',
              'Major tech innovation hub',
              'Rich 5000-year cultural heritage',
            ],
          ),
          const SizedBox(height: 16),
          const BenefitCard(
            title: 'Career Advantages',
            icon: FontAwesomeIcons.briefcase,
            benefits: [
              'International business opportunities',
              'Tech sector collaboration',
              'Diplomatic and government positions',
              'Cross-cultural consulting',
            ],
          ),
        ],
      ),
    );
  }

  void _showNotificationSettings() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Notification Settings'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Text('Set your daily reminder time'),
            const SizedBox(height: 16),
            ElevatedButton(
              onPressed: () async {
                final TimeOfDay? time = await showTimePicker(
                  context: context,
                  initialTime: const TimeOfDay(hour: 9, minute: 0),
                );
                if (time != null) {
                  final appState = context.read<AppState>();
                  await appState.scheduleDailyReminder(time.hour, time.minute);
                  if (context.mounted) {
                    Navigator.pop(context);
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(
                        content: Text('Daily reminder scheduled!'),
                      ),
                    );
                  }
                }
              },
              child: const Text('Schedule Daily Reminder'),
            ),
            const SizedBox(height: 8),
            TextButton(
              onPressed: () async {
                final appState = context.read<AppState>();
                await appState.cancelNotifications();
                if (context.mounted) {
                  Navigator.pop(context);
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(
                      content: Text('Notifications cancelled'),
                    ),
                  );
                }
              },
              child: const Text('Cancel Notifications'),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Close'),
          ),
        ],
      ),
    );
  }
}
