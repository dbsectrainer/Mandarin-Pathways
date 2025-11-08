import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:iconsax/iconsax.dart';
import '../services/settings_service.dart';
import '../services/gamification_service.dart';
import '../config/theme_config.dart';

class SettingsScreen extends StatelessWidget {
  const SettingsScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Settings'),
      ),
      body: ListView(
        padding: const EdgeInsets.all(AppTheme.spacingM),
        children: [
          _buildSectionHeader('Appearance'),
          _buildAppearanceSettings(context),
          const SizedBox(height: AppTheme.spacingL),

          _buildSectionHeader('Learning Goals'),
          _buildGoalsSettings(context),
          const SizedBox(height: AppTheme.spacingL),

          _buildSectionHeader('Notifications'),
          _buildNotificationSettings(context),
          const SizedBox(height: AppTheme.spacingL),

          _buildSectionHeader('Audio & Playback'),
          _buildAudioSettings(context),
          const SizedBox(height: AppTheme.spacingL),

          _buildSectionHeader('Accessibility'),
          _buildAccessibilitySettings(context),
          const SizedBox(height: AppTheme.spacingL),

          _buildSectionHeader('Data & Privacy'),
          _buildDataSettings(context),
          const SizedBox(height: AppTheme.spacingXL),
        ],
      ),
    );
  }

  Widget _buildSectionHeader(String title) {
    return Padding(
      padding: const EdgeInsets.symmetric(
        horizontal: AppTheme.spacingM,
        vertical: AppTheme.spacingS,
      ),
      child: Text(
        title,
        style: AppTheme.labelLarge.copyWith(
          color: AppTheme.primaryRed,
          fontWeight: FontWeight.bold,
        ),
      ),
    );
  }

  Widget _buildAppearanceSettings(BuildContext context) {
    return Consumer<SettingsService>(
      builder: (context, settings, child) {
        return Card(
          child: Column(
            children: [
              ListTile(
                leading: const Icon(Iconsax.moon),
                title: const Text('Dark Mode'),
                subtitle: Text(
                  _getThemeModeText(settings.themeMode),
                  style: AppTheme.bodySmall.copyWith(
                    color: AppTheme.lightTextSecondary,
                  ),
                ),
                trailing: const Icon(Icons.arrow_forward_ios, size: 16),
                onTap: () => _showThemeModeDialog(context, settings),
              ),
              const Divider(height: 1),
              ListTile(
                leading: const Icon(Iconsax.text),
                title: const Text('Text Size'),
                subtitle: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const SizedBox(height: AppTheme.spacingS),
                    Slider(
                      value: settings.textScale,
                      min: 0.8,
                      max: 1.5,
                      divisions: 7,
                      label: '${(settings.textScale * 100).toInt()}%',
                      onChanged: (value) {
                        settings.setTextScale(value);
                      },
                    ),
                  ],
                ),
              ),
              const Divider(height: 1),
              SwitchListTile(
                secondary: const Icon(Iconsax.eye),
                title: const Text('High Contrast'),
                subtitle: const Text('Increase visibility'),
                value: settings.highContrast,
                onChanged: (value) {
                  settings.setHighContrast(value);
                },
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildGoalsSettings(BuildContext context) {
    return Consumer<SettingsService>(
      builder: (context, settings, child) {
        return Card(
          child: Column(
            children: [
              ListTile(
                leading: const Icon(Iconsax.timer_1),
                title: const Text('Daily Time Goal'),
                subtitle: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const SizedBox(height: AppTheme.spacingS),
                    Text(
                      '${settings.dailyGoalMinutes} minutes',
                      style: AppTheme.bodyMedium.copyWith(
                        color: AppTheme.primaryRed,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    Slider(
                      value: settings.dailyGoalMinutes.toDouble(),
                      min: 5,
                      max: 60,
                      divisions: 11,
                      label: '${settings.dailyGoalMinutes} min',
                      onChanged: (value) {
                        settings.setDailyGoalMinutes(value.toInt());
                      },
                    ),
                  ],
                ),
              ),
              const Divider(height: 1),
              ListTile(
                leading: const Icon(Iconsax.book_1),
                title: const Text('Daily Lesson Goal'),
                subtitle: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const SizedBox(height: AppTheme.spacingS),
                    Text(
                      '${settings.dailyGoalLessons} lesson${settings.dailyGoalLessons > 1 ? 's' : ''}',
                      style: AppTheme.bodyMedium.copyWith(
                        color: AppTheme.primaryRed,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    Slider(
                      value: settings.dailyGoalLessons.toDouble(),
                      min: 1,
                      max: 5,
                      divisions: 4,
                      label: '${settings.dailyGoalLessons}',
                      onChanged: (value) {
                        settings.setDailyGoalLessons(value.toInt());
                      },
                    ),
                  ],
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildNotificationSettings(BuildContext context) {
    return Consumer<SettingsService>(
      builder: (context, settings, child) {
        return Card(
          child: Column(
            children: [
              SwitchListTile(
                secondary: const Icon(Iconsax.notification),
                title: const Text('Daily Reminders'),
                subtitle: const Text('Get reminded to practice'),
                value: settings.notificationsEnabled,
                onChanged: (value) {
                  settings.setNotificationsEnabled(value);
                },
              ),
              if (settings.notificationsEnabled) ...[
                const Divider(height: 1),
                ListTile(
                  leading: const Icon(Iconsax.clock),
                  title: const Text('Reminder Time'),
                  subtitle: Text(
                    _formatTime(settings.notificationTime),
                    style: AppTheme.bodyMedium.copyWith(
                      color: AppTheme.primaryRed,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  trailing: const Icon(Icons.arrow_forward_ios, size: 16),
                  onTap: () => _showTimePicker(context, settings),
                ),
              ],
            ],
          ),
        );
      },
    );
  }

  Widget _buildAudioSettings(BuildContext context) {
    return Consumer<SettingsService>(
      builder: (context, settings, child) {
        return Card(
          child: Column(
            children: [
              ListTile(
                leading: const Icon(Iconsax.play_cricle),
                title: const Text('Playback Speed'),
                subtitle: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const SizedBox(height: AppTheme.spacingS),
                    Text(
                      '${settings.audioSpeed}x',
                      style: AppTheme.bodyMedium.copyWith(
                        color: AppTheme.primaryRed,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    Slider(
                      value: settings.audioSpeed,
                      min: 0.5,
                      max: 2.0,
                      divisions: 6,
                      label: '${settings.audioSpeed}x',
                      onChanged: (value) {
                        settings.setAudioSpeed(value);
                      },
                    ),
                  ],
                ),
              ),
              const Divider(height: 1),
              SwitchListTile(
                secondary: const Icon(Iconsax.autobrightness),
                title: const Text('Auto Play'),
                subtitle: const Text('Automatically play next audio'),
                value: settings.autoPlay,
                onChanged: (value) {
                  settings.setAutoPlay(value);
                },
              ),
              const Divider(height: 1),
              SwitchListTile(
                secondary: const Icon(Iconsax.repeat),
                title: const Text('Loop Audio'),
                subtitle: const Text('Repeat audio automatically'),
                value: settings.loopAudio,
                onChanged: (value) {
                  settings.setLoopAudio(value);
                },
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildAccessibilitySettings(BuildContext context) {
    return Consumer<SettingsService>(
      builder: (context, settings, child) {
        return Card(
          child: Column(
            children: [
              SwitchListTile(
                secondary: const Icon(Iconsax.flash_circle_1),
                title: const Text('Reduced Animations'),
                subtitle: const Text('Minimize motion effects'),
                value: settings.reducedAnimations,
                onChanged: (value) {
                  settings.setReducedAnimations(value);
                },
              ),
              const Divider(height: 1),
              SwitchListTile(
                secondary: const Icon(Iconsax.mobile),
                title: const Text('Haptic Feedback'),
                subtitle: const Text('Vibrate on interactions'),
                value: settings.hapticFeedback,
                onChanged: (value) {
                  settings.setHapticFeedback(value);
                },
              ),
              const Divider(height: 1),
              SwitchListTile(
                secondary: const Icon(Iconsax.volume_high),
                title: const Text('Sound Effects'),
                subtitle: const Text('Play sounds for actions'),
                value: settings.soundEffects,
                onChanged: (value) {
                  settings.setSoundEffects(value);
                },
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildDataSettings(BuildContext context) {
    return Card(
      child: Column(
        children: [
          ListTile(
            leading: const Icon(Iconsax.document_download),
            title: const Text('Export Data'),
            subtitle: const Text('Download your progress'),
            trailing: const Icon(Icons.arrow_forward_ios, size: 16),
            onTap: () => _showExportDialog(context),
          ),
          const Divider(height: 1),
          ListTile(
            leading: const Icon(Iconsax.refresh),
            title: const Text('Reset Progress'),
            subtitle: const Text('Clear all learning data'),
            trailing: const Icon(Icons.arrow_forward_ios, size: 16),
            onTap: () => _showResetDialog(context),
          ),
          const Divider(height: 1),
          ListTile(
            leading: const Icon(Iconsax.information),
            title: const Text('About'),
            subtitle: const Text('Version 1.0.0'),
            trailing: const Icon(Icons.arrow_forward_ios, size: 16),
            onTap: () => _showAboutDialog(context),
          ),
        ],
      ),
    );
  }

  // Helper methods
  String _getThemeModeText(ThemeMode mode) {
    switch (mode) {
      case ThemeMode.light:
        return 'Light';
      case ThemeMode.dark:
        return 'Dark';
      case ThemeMode.system:
        return 'System';
    }
  }

  String _formatTime(TimeOfDay time) {
    final hour = time.hour.toString().padLeft(2, '0');
    final minute = time.minute.toString().padLeft(2, '0');
    return '$hour:$minute';
  }

  Future<void> _showThemeModeDialog(
      BuildContext context, SettingsService settings) async {
    await showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Choose Theme'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            RadioListTile<ThemeMode>(
              title: const Text('Light'),
              value: ThemeMode.light,
              groupValue: settings.themeMode,
              onChanged: (value) {
                if (value != null) {
                  settings.setThemeMode(value);
                  Navigator.pop(context);
                }
              },
            ),
            RadioListTile<ThemeMode>(
              title: const Text('Dark'),
              value: ThemeMode.dark,
              groupValue: settings.themeMode,
              onChanged: (value) {
                if (value != null) {
                  settings.setThemeMode(value);
                  Navigator.pop(context);
                }
              },
            ),
            RadioListTile<ThemeMode>(
              title: const Text('System'),
              value: ThemeMode.system,
              groupValue: settings.themeMode,
              onChanged: (value) {
                if (value != null) {
                  settings.setThemeMode(value);
                  Navigator.pop(context);
                }
              },
            ),
          ],
        ),
      ),
    );
  }

  Future<void> _showTimePicker(
      BuildContext context, SettingsService settings) async {
    final time = await showTimePicker(
      context: context,
      initialTime: settings.notificationTime,
    );

    if (time != null) {
      settings.setNotificationTime(time);
    }
  }

  Future<void> _showExportDialog(BuildContext context) async {
    await showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Export Data'),
        content: const Text(
          'This feature will export your learning progress, achievements, and settings to a file.',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () {
              // Implement export functionality
              Navigator.pop(context);
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Data exported successfully!')),
              );
            },
            child: const Text('Export'),
          ),
        ],
      ),
    );
  }

  Future<void> _showResetDialog(BuildContext context) async {
    await showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Reset Progress'),
        content: const Text(
          'Are you sure you want to reset all your progress? This action cannot be undone.',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: AppTheme.error,
            ),
            onPressed: () {
              final gamificationService =
                  Provider.of<GamificationService>(context, listen: false);
              gamificationService.resetAllData();
              Navigator.pop(context);
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Progress reset successfully')),
              );
            },
            child: const Text('Reset'),
          ),
        ],
      ),
    );
  }

  void _showAboutDialog(BuildContext context) {
    showAboutDialog(
      context: context,
      applicationName: 'Mandarin Pathways',
      applicationVersion: '1.0.0',
      applicationIcon: Container(
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: AppTheme.primaryRed.withOpacity(0.2),
          borderRadius: BorderRadius.circular(AppTheme.radiusM),
        ),
        child: const Icon(
          Iconsax.book_1,
          color: AppTheme.primaryRed,
          size: 32,
        ),
      ),
      children: [
        const Text(
          'Learn Mandarin Chinese with structured daily lessons and supplementary materials.',
        ),
        const SizedBox(height: AppTheme.spacingM),
        const Text(
          'Developed with ❤️ for language learners worldwide.',
        ),
      ],
    );
  }
}
