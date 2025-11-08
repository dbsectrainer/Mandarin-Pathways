import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:iconsax/iconsax.dart';
import '../services/gamification_service.dart';
import '../config/theme_config.dart';
import 'settings_screen.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Profile'),
        actions: [
          IconButton(
            icon: const Icon(Iconsax.setting_2),
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => const SettingsScreen(),
                ),
              );
            },
          ),
        ],
      ),
      body: Consumer<GamificationService>(
        builder: (context, gamificationService, child) {
          if (!gamificationService.isInitialized) {
            return const Center(child: CircularProgressIndicator());
          }

          final userProfile = gamificationService.userProfile;
          final stats = gamificationService.getStatistics();

          return SingleChildScrollView(
            padding: const EdgeInsets.all(AppTheme.spacingL),
            child: Column(
              children: [
                // Profile Header
                _buildProfileHeader(userProfile),
                const SizedBox(height: AppTheme.spacingXL),

                // Level Progress
                _buildLevelProgress(userProfile),
                const SizedBox(height: AppTheme.spacingXL),

                // Stats Grid
                _buildStatsGrid(stats),
                const SizedBox(height: AppTheme.spacingXL),

                // Streak Section
                _buildStreakSection(context, gamificationService),
                const SizedBox(height: AppTheme.spacingXL),

                // Recent Achievements
                _buildRecentAchievements(context, gamificationService),
              ],
            ),
          );
        },
      ),
    );
  }

  Widget _buildProfileHeader(userProfile) {
    return Column(
      children: [
        Stack(
          children: [
            CircleAvatar(
              radius: 60,
              backgroundColor: AppTheme.primaryRed.withOpacity(0.2),
              child: userProfile.avatarUrl != null
                  ? ClipOval(
                      child: Image.network(
                        userProfile.avatarUrl!,
                        width: 120,
                        height: 120,
                        fit: BoxFit.cover,
                        errorBuilder: (context, error, stackTrace) {
                          return _buildDefaultAvatar(userProfile.name);
                        },
                      ),
                    )
                  : _buildDefaultAvatar(userProfile.name),
            ),
            Positioned(
              bottom: 0,
              right: 0,
              child: Container(
                padding: const EdgeInsets.all(8),
                decoration: const BoxDecoration(
                  color: AppTheme.primaryRed,
                  shape: BoxShape.circle,
                ),
                child: const Icon(
                  Iconsax.edit,
                  size: 20,
                  color: Colors.white,
                ),
              ),
            ),
          ],
        ),
        const SizedBox(height: AppTheme.spacingM),
        Text(
          userProfile.name,
          style: AppTheme.headingMedium.copyWith(
            fontWeight: FontWeight.bold,
          ),
        ),
        const SizedBox(height: AppTheme.spacingXS),
        Text(
          userProfile.levelTitle,
          style: AppTheme.bodyLarge.copyWith(
            color: AppTheme.primaryRed,
            fontWeight: FontWeight.w600,
          ),
        ),
        if (userProfile.email != null) ...[
          const SizedBox(height: AppTheme.spacingXS),
          Text(
            userProfile.email!,
            style: AppTheme.bodyMedium.copyWith(
              color: AppTheme.lightTextSecondary,
            ),
          ),
        ],
      ],
    );
  }

  Widget _buildDefaultAvatar(String name) {
    return Text(
      name.isNotEmpty ? name[0].toUpperCase() : 'L',
      style: AppTheme.headingLarge.copyWith(
        fontSize: 48,
        color: AppTheme.primaryRed,
        fontWeight: FontWeight.bold,
      ),
    );
  }

  Widget _buildLevelProgress(userProfile) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(AppTheme.spacingL),
        child: Column(
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'Level ${userProfile.currentLevel}',
                  style: AppTheme.headingSmall.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
                ),
                Text(
                  'Level ${userProfile.currentLevel + 1}',
                  style: AppTheme.bodyMedium.copyWith(
                    color: AppTheme.lightTextSecondary,
                  ),
                ),
              ],
            ),
            const SizedBox(height: AppTheme.spacingM),
            ClipRRect(
              borderRadius: BorderRadius.circular(AppTheme.radiusRound),
              child: LinearProgressIndicator(
                value: userProfile.levelProgress,
                minHeight: 12,
                backgroundColor: AppTheme.lightTextSecondary.withOpacity(0.2),
                valueColor: const AlwaysStoppedAnimation<Color>(
                  AppTheme.primaryRed,
                ),
              ),
            ),
            const SizedBox(height: AppTheme.spacingS),
            Text(
              '${userProfile.totalXP % userProfile.xpForNextLevel} / ${userProfile.xpForNextLevel} XP',
              style: AppTheme.bodySmall.copyWith(
                color: AppTheme.lightTextSecondary,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildStatsGrid(Map<String, dynamic> stats) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Your Statistics',
          style: AppTheme.headingSmall.copyWith(
            fontWeight: FontWeight.bold,
          ),
        ),
        const SizedBox(height: AppTheme.spacingM),
        GridView.count(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          crossAxisCount: 2,
          mainAxisSpacing: AppTheme.spacingM,
          crossAxisSpacing: AppTheme.spacingM,
          childAspectRatio: 1.5,
          children: [
            _buildStatCard(
              icon: Iconsax.flash_1,
              label: 'Current Streak',
              value: '${stats['currentStreak']}',
              color: AppTheme.accentOrange,
            ),
            _buildStatCard(
              icon: Iconsax.trend_up,
              label: 'Longest Streak',
              value: '${stats['longestStreak']}',
              color: AppTheme.accentGreen,
            ),
            _buildStatCard(
              icon: Iconsax.book,
              label: 'Lessons Done',
              value: '${stats['lessonsCompleted']}',
              color: AppTheme.accentPurple,
            ),
            _buildStatCard(
              icon: Iconsax.award,
              label: 'Achievements',
              value: '${stats['achievementsUnlocked']}/${stats['achievementsTotal']}',
              color: AppTheme.primaryRed,
            ),
            _buildStatCard(
              icon: Iconsax.calendar,
              label: 'Days Studied',
              value: '${stats['daysStudied']}',
              color: AppTheme.info,
            ),
            _buildStatCard(
              icon: Iconsax.star_1,
              label: 'Total XP',
              value: '${stats['totalXP']}',
              color: AppTheme.warning,
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildStatCard({
    required IconData icon,
    required String label,
    required String value,
    required Color color,
  }) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(AppTheme.spacingM),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon, color: color, size: 32),
            const SizedBox(height: AppTheme.spacingS),
            Text(
              value,
              style: AppTheme.headingSmall.copyWith(
                fontWeight: FontWeight.bold,
                color: color,
              ),
            ),
            const SizedBox(height: AppTheme.spacingXS),
            Text(
              label,
              style: AppTheme.bodySmall.copyWith(
                color: AppTheme.lightTextSecondary,
              ),
              textAlign: TextAlign.center,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildStreakSection(
      BuildContext context, GamificationService gamificationService) {
    final streak = gamificationService.streak;

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(AppTheme.spacingL),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                const Icon(
                  Iconsax.flame_1,
                  color: AppTheme.accentOrange,
                  size: 28,
                ),
                const SizedBox(width: AppTheme.spacingS),
                Text(
                  'Streak Status',
                  style: AppTheme.headingSmall.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),
            const SizedBox(height: AppTheme.spacingM),
            if (streak.streakAtRisk)
              Container(
                padding: const EdgeInsets.all(AppTheme.spacingM),
                decoration: BoxDecoration(
                  color: AppTheme.warning.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(AppTheme.radiusM),
                  border: Border.all(
                    color: AppTheme.warning.withOpacity(0.3),
                  ),
                ),
                child: Row(
                  children: [
                    const Icon(
                      Iconsax.warning_2,
                      color: AppTheme.warning,
                    ),
                    const SizedBox(width: AppTheme.spacingM),
                    Expanded(
                      child: Text(
                        'Your streak is at risk! Complete a lesson today to keep it going.',
                        style: AppTheme.bodyMedium.copyWith(
                          color: AppTheme.warning,
                        ),
                      ),
                    ),
                  ],
                ),
              )
            else if (streak.isActiveToday)
              Container(
                padding: const EdgeInsets.all(AppTheme.spacingM),
                decoration: BoxDecoration(
                  color: AppTheme.success.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(AppTheme.radiusM),
                  border: Border.all(
                    color: AppTheme.success.withOpacity(0.3),
                  ),
                ),
                child: Row(
                  children: [
                    const Icon(
                      Iconsax.tick_circle,
                      color: AppTheme.success,
                    ),
                    const SizedBox(width: AppTheme.spacingM),
                    Expanded(
                      child: Text(
                        'Great job! You\'ve completed your lesson today.',
                        style: AppTheme.bodyMedium.copyWith(
                          color: AppTheme.success,
                        ),
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

  Widget _buildRecentAchievements(
      BuildContext context, GamificationService gamificationService) {
    final recentAchievements = gamificationService.unlockedAchievements
        .take(3)
        .toList();

    if (recentAchievements.isEmpty) {
      return const SizedBox.shrink();
    }

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              'Recent Achievements',
              style: AppTheme.headingSmall.copyWith(
                fontWeight: FontWeight.bold,
              ),
            ),
            TextButton(
              onPressed: () {
                // Navigate to achievements tab in bottom nav
                // This would require a callback to the main navigation
              },
              child: const Text('View All'),
            ),
          ],
        ),
        const SizedBox(height: AppTheme.spacingM),
        ...recentAchievements.map((achievement) {
          return Card(
            margin: const EdgeInsets.only(bottom: AppTheme.spacingM),
            child: ListTile(
              leading: CircleAvatar(
                backgroundColor: achievement.tierColor.withOpacity(0.2),
                child: Icon(
                  achievement.icon,
                  color: achievement.tierColor,
                ),
              ),
              title: Text(
                achievement.title,
                style: AppTheme.bodyLarge.copyWith(
                  fontWeight: FontWeight.w600,
                ),
              ),
              subtitle: Text(
                achievement.description,
                style: AppTheme.bodySmall.copyWith(
                  color: AppTheme.lightTextSecondary,
                ),
              ),
              trailing: Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 12,
                  vertical: 6,
                ),
                decoration: BoxDecoration(
                  color: achievement.tierColor.withOpacity(0.2),
                  borderRadius: BorderRadius.circular(AppTheme.radiusS),
                ),
                child: Text(
                  '+${achievement.xpReward} XP',
                  style: AppTheme.labelSmall.copyWith(
                    color: achievement.tierColor,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ),
          );
        }),
      ],
    );
  }
}
