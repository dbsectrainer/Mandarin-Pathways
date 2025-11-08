import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'config/theme_config.dart';
import 'screens/onboarding_screen.dart';
import 'screens/main_navigation.dart';
import 'screens/day_lesson_screen.dart';
import 'screens/reading_screen.dart';
import 'screens/writing_screen.dart';
import 'screens/supplementary_screen.dart';
import 'services/app_state.dart';
import 'services/storage_service.dart';
import 'services/audio_service.dart';
import 'services/notification_service.dart';
import 'services/settings_service.dart' as settings;
import 'services/gamification_service.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Initialize SharedPreferences
  final prefs = await SharedPreferences.getInstance();

  runApp(MandarinPathwaysApp(prefs: prefs));
}

class MandarinPathwaysApp extends StatelessWidget {
  final SharedPreferences prefs;

  const MandarinPathwaysApp({
    Key? key,
    required this.prefs,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        // Settings Service (needs to be first for theme)
        ChangeNotifierProvider(
          create: (_) => settings.SettingsService(prefs),
        ),

        // Gamification Service
        ChangeNotifierProvider(
          create: (_) => GamificationService(prefs),
        ),

        // App State Service
        ChangeNotifierProvider(
          create: (_) => AppState(
            storage: StorageService(),
            audio: AudioService(),
            notification: NotificationService(),
          ),
        ),
      ],
      child: Consumer<settings.SettingsService>(
        builder: (context, settingsService, child) {
          return MaterialApp(
            title: 'Mandarin Pathways',
            debugShowCheckedModeBanner: false,

            // Theme configuration with dark mode support
            theme: AppTheme.lightTheme,
            darkTheme: AppTheme.darkTheme,
            themeMode: _getThemeMode(settingsService.themeMode),

            // Initial route based on onboarding status
            initialRoute: settingsService.firstLaunch ? '/onboarding' : '/',

            routes: {
              '/': (context) => const MainNavigation(),
              '/onboarding': (context) => const OnboardingScreen(),
              '/day': (context) => const DayLessonScreen(),
              '/reading': (context) => const ReadingScreen(),
              '/writing': (context) => const WritingScreen(),
              '/supplementary': (context) => const SupplementaryScreen(),
            },

            // Text scaling from settings
            builder: (context, child) {
              if (child == null) return const SizedBox.shrink();

              return MediaQuery(
                data: MediaQuery.of(context).copyWith(
                  textScaleFactor: settingsService.textScale,
                ),
                child: child,
              );
            },
          );
        },
      ),
    );
  }

  ThemeMode _getThemeMode(services.ThemeMode mode) {
    switch (mode) {
      case services.ThemeMode.light:
        return ThemeMode.light;
      case services.ThemeMode.dark:
        return ThemeMode.dark;
      case services.ThemeMode.system:
        return ThemeMode.system;
    }
  }
}
