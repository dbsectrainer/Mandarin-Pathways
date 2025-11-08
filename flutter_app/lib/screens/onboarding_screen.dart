import 'package:flutter/material.dart';
import 'package:introduction_screen/introduction_screen.dart';
import 'package:provider/provider.dart';
import '../services/settings_service.dart';
import '../config/theme_config.dart';

class OnboardingScreen extends StatelessWidget {
  const OnboardingScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final settingsService = Provider.of<SettingsService>(context, listen: false);

    return IntroductionScreen(
      pages: [
        _buildWelcomePage(context),
        _buildLearningPathPage(context),
        _buildGamificationPage(context),
        _buildGoalsPage(context),
      ],
      onDone: () async {
        await settingsService.completeOnboarding();
        if (context.mounted) {
          Navigator.of(context).pushReplacementNamed('/');
        }
      },
      onSkip: () async {
        await settingsService.completeOnboarding();
        if (context.mounted) {
          Navigator.of(context).pushReplacementNamed('/');
        }
      },
      showSkipButton: true,
      skip: Text(
        'Skip',
        style: AppTheme.bodyLarge.copyWith(
          color: AppTheme.primaryRed,
          fontWeight: FontWeight.w600,
        ),
      ),
      next: Container(
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: AppTheme.primaryRed,
          borderRadius: BorderRadius.circular(AppTheme.radiusRound),
        ),
        child: const Icon(
          Icons.arrow_forward,
          color: Colors.white,
        ),
      ),
      done: Container(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
        decoration: BoxDecoration(
          color: AppTheme.primaryRed,
          borderRadius: BorderRadius.circular(AppTheme.radiusM),
        ),
        child: Text(
          'Get Started',
          style: AppTheme.labelLarge.copyWith(color: Colors.white),
        ),
      ),
      dotsDecorator: DotsDecorator(
        size: const Size.square(10.0),
        activeSize: const Size(24.0, 10.0),
        activeColor: AppTheme.primaryRed,
        color: AppTheme.lightTextSecondary,
        spacing: const EdgeInsets.symmetric(horizontal: 3.0),
        activeShape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(25.0),
        ),
      ),
      globalBackgroundColor: Colors.white,
      curve: Curves.easeInOut,
      controlsMargin: const EdgeInsets.all(16),
      controlsPadding: const EdgeInsets.all(12),
    );
  }

  PageViewModel _buildWelcomePage(BuildContext context) {
    return PageViewModel(
      title: "Welcome to Mandarin Pathways",
      body:
          "Embark on your journey to learn Mandarin Chinese with our comprehensive 40-day structured program designed for complete beginners.",
      image: Center(
        child: Container(
          padding: const EdgeInsets.all(40),
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            gradient: LinearGradient(
              colors: [
                AppTheme.primaryRed.withOpacity(0.2),
                AppTheme.accentPurple.withOpacity(0.2),
              ],
            ),
          ),
          child: Icon(
            Icons.school,
            size: 120,
            color: AppTheme.primaryRed,
          ),
        ),
      ),
      decoration: PageDecoration(
        titleTextStyle: AppTheme.headingLarge.copyWith(
          fontWeight: FontWeight.bold,
          color: AppTheme.lightTextPrimary,
        ),
        bodyTextStyle: AppTheme.bodyLarge.copyWith(
          color: AppTheme.lightTextSecondary,
        ),
        imagePadding: const EdgeInsets.only(top: 80, bottom: 40),
        pageColor: Colors.white,
      ),
    );
  }

  PageViewModel _buildLearningPathPage(BuildContext context) {
    return PageViewModel(
      title: "Structured Learning Path",
      body:
          "Master Mandarin through 40 carefully designed daily lessons covering pronunciation, essential phrases, cultural context, and real-world applications.",
      image: Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            _buildFeatureIcon(Icons.volume_up, AppTheme.primaryRed),
            const SizedBox(height: 20),
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                _buildFeatureIcon(Icons.menu_book, AppTheme.accentGreen),
                const SizedBox(width: 20),
                _buildFeatureIcon(Icons.edit, AppTheme.accentPurple),
              ],
            ),
          ],
        ),
      ),
      decoration: PageDecoration(
        titleTextStyle: AppTheme.headingLarge.copyWith(
          fontWeight: FontWeight.bold,
          color: AppTheme.lightTextPrimary,
        ),
        bodyTextStyle: AppTheme.bodyLarge.copyWith(
          color: AppTheme.lightTextSecondary,
        ),
        imagePadding: const EdgeInsets.only(top: 80, bottom: 40),
        pageColor: Colors.white,
      ),
    );
  }

  PageViewModel _buildGamificationPage(BuildContext context) {
    return PageViewModel(
      title: "Earn Achievements & Track Progress",
      body:
          "Stay motivated with streaks, badges, and level-ups! Track your progress, unlock achievements, and watch your skills grow every day.",
      image: Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                _buildBadge('🏆', AppTheme.accentPurple.withOpacity(0.2)),
                const SizedBox(width: 15),
                _buildBadge('🔥', AppTheme.primaryRed.withOpacity(0.2)),
                const SizedBox(width: 15),
                _buildBadge('⭐', AppTheme.accentGreen.withOpacity(0.2)),
              ],
            ),
            const SizedBox(height: 30),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 40, vertical: 20),
              decoration: BoxDecoration(
                color: AppTheme.primaryRed.withOpacity(0.1),
                borderRadius: BorderRadius.circular(AppTheme.radiusL),
              ),
              child: Column(
                children: [
                  Text(
                    'Level 5',
                    style: AppTheme.headingSmall.copyWith(
                      color: AppTheme.primaryRed,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 10),
                  Text(
                    'Intermediate',
                    style: AppTheme.bodyMedium.copyWith(
                      color: AppTheme.lightTextSecondary,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
      decoration: PageDecoration(
        titleTextStyle: AppTheme.headingLarge.copyWith(
          fontWeight: FontWeight.bold,
          color: AppTheme.lightTextPrimary,
        ),
        bodyTextStyle: AppTheme.bodyLarge.copyWith(
          color: AppTheme.lightTextSecondary,
        ),
        imagePadding: const EdgeInsets.only(top: 80, bottom: 40),
        pageColor: Colors.white,
      ),
    );
  }

  PageViewModel _buildGoalsPage(BuildContext context) {
    return PageViewModel(
      title: "Set Your Daily Goals",
      body:
          "Customize your learning experience with daily goals and reminders. Learn at your own pace and build a consistent study habit.",
      image: Center(
        child: Container(
          padding: const EdgeInsets.all(30),
          decoration: BoxDecoration(
            color: AppTheme.accentGreen.withOpacity(0.1),
            borderRadius: BorderRadius.circular(AppTheme.radiusXL),
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Icon(
                Icons.track_changes,
                size: 80,
                color: AppTheme.accentGreen,
              ),
              const SizedBox(height: 20),
              Text(
                '🎯 15 min/day',
                style: AppTheme.headingMedium.copyWith(
                  fontWeight: FontWeight.bold,
                  color: AppTheme.lightTextPrimary,
                ),
              ),
              const SizedBox(height: 10),
              Text(
                '1 lesson minimum',
                style: AppTheme.bodyLarge.copyWith(
                  color: AppTheme.lightTextSecondary,
                ),
              ),
            ],
          ),
        ),
      ),
      decoration: PageDecoration(
        titleTextStyle: AppTheme.headingLarge.copyWith(
          fontWeight: FontWeight.bold,
          color: AppTheme.lightTextPrimary,
        ),
        bodyTextStyle: AppTheme.bodyLarge.copyWith(
          color: AppTheme.lightTextSecondary,
        ),
        imagePadding: const EdgeInsets.only(top: 80, bottom: 40),
        pageColor: Colors.white,
      ),
    );
  }

  Widget _buildFeatureIcon(IconData icon, Color color) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: color.withOpacity(0.2),
        borderRadius: BorderRadius.circular(AppTheme.radiusL),
      ),
      child: Icon(
        icon,
        size: 60,
        color: color,
      ),
    );
  }

  Widget _buildBadge(String emoji, Color backgroundColor) {
    return Container(
      width: 80,
      height: 80,
      decoration: BoxDecoration(
        color: backgroundColor,
        shape: BoxShape.circle,
      ),
      child: Center(
        child: Text(
          emoji,
          style: const TextStyle(fontSize: 40),
        ),
      ),
    );
  }
}
