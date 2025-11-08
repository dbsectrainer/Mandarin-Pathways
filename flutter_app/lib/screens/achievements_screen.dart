import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:iconsax/iconsax.dart';
import 'package:confetti/confetti.dart';
import '../services/gamification_service.dart';
import '../models/achievement.dart';
import '../config/theme_config.dart';

class AchievementsScreen extends StatefulWidget {
  const AchievementsScreen({Key? key}) : super(key: key);

  @override
  State<AchievementsScreen> createState() => _AchievementsScreenState();
}

class _AchievementsScreenState extends State<AchievementsScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;
  late ConfettiController _confettiController;
  AchievementType? _selectedFilter;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
    _confettiController = ConfettiController(duration: const Duration(seconds: 3));
  }

  @override
  void dispose() {
    _tabController.dispose();
    _confettiController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Achievements'),
        bottom: TabBar(
          controller: _tabController,
          indicatorColor: Colors.white,
          tabs: const [
            Tab(text: 'Unlocked'),
            Tab(text: 'Locked'),
          ],
        ),
      ),
      body: Stack(
        children: [
          Column(
            children: [
              _buildFilterChips(),
              Expanded(
                child: TabBarView(
                  controller: _tabController,
                  children: [
                    _buildAchievementsList(unlocked: true),
                    _buildAchievementsList(unlocked: false),
                  ],
                ),
              ),
            ],
          ),
          Align(
            alignment: Alignment.topCenter,
            child: ConfettiWidget(
              confettiController: _confettiController,
              blastDirectionality: BlastDirectionality.explosive,
              particleDrag: 0.05,
              emissionFrequency: 0.05,
              numberOfParticles: 50,
              gravity: 0.1,
              shouldLoop: false,
              colors: const [
                AppTheme.primaryRed,
                AppTheme.accentGreen,
                AppTheme.accentPurple,
                AppTheme.accentOrange,
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildFilterChips() {
    return Container(
      padding: const EdgeInsets.all(AppTheme.spacingM),
      child: SingleChildScrollView(
        scrollDirection: Axis.horizontal,
        child: Row(
          children: [
            _buildFilterChip('All', null),
            const SizedBox(width: AppTheme.spacingS),
            _buildFilterChip('Streak', AchievementType.streak),
            const SizedBox(width: AppTheme.spacingS),
            _buildFilterChip('Completion', AchievementType.completion),
            const SizedBox(width: AppTheme.spacingS),
            _buildFilterChip('Skill', AchievementType.skill),
            const SizedBox(width: AppTheme.spacingS),
            _buildFilterChip('Milestone', AchievementType.milestone),
            const SizedBox(width: AppTheme.spacingS),
            _buildFilterChip('Special', AchievementType.special),
          ],
        ),
      ),
    );
  }

  Widget _buildFilterChip(String label, AchievementType? type) {
    final isSelected = _selectedFilter == type;
    return FilterChip(
      label: Text(label),
      selected: isSelected,
      onSelected: (selected) {
        setState(() {
          _selectedFilter = selected ? type : null;
        });
      },
      selectedColor: AppTheme.primaryRed.withOpacity(0.2),
      checkmarkColor: AppTheme.primaryRed,
      labelStyle: AppTheme.bodyMedium.copyWith(
        color: isSelected ? AppTheme.primaryRed : AppTheme.lightTextSecondary,
        fontWeight: isSelected ? FontWeight.w600 : FontWeight.w500,
      ),
    );
  }

  Widget _buildAchievementsList({required bool unlocked}) {
    return Consumer<GamificationService>(
      builder: (context, gamificationService, child) {
        if (!gamificationService.isInitialized) {
          return const Center(child: CircularProgressIndicator());
        }

        var achievements = unlocked
            ? gamificationService.unlockedAchievements
            : gamificationService.lockedAchievements;

        // Apply filter
        if (_selectedFilter != null) {
          achievements = achievements
              .where((a) => a.type == _selectedFilter)
              .toList();
        }

        if (achievements.isEmpty) {
          return _buildEmptyState(unlocked);
        }

        // Group by type
        final groupedAchievements = <AchievementType, List<Achievement>>{};
        for (final achievement in achievements) {
          groupedAchievements.putIfAbsent(achievement.type, () => []);
          groupedAchievements[achievement.type]!.add(achievement);
        }

        return ListView.builder(
          padding: const EdgeInsets.all(AppTheme.spacingM),
          itemCount: groupedAchievements.length,
          itemBuilder: (context, index) {
            final type = groupedAchievements.keys.elementAt(index);
            final typeAchievements = groupedAchievements[type]!;

            return Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Padding(
                  padding: const EdgeInsets.symmetric(
                    horizontal: AppTheme.spacingM,
                    vertical: AppTheme.spacingS,
                  ),
                  child: Text(
                    _getTypeName(type),
                    style: AppTheme.headingSmall.copyWith(
                      fontWeight: FontWeight.bold,
                      color: AppTheme.primaryRed,
                    ),
                  ),
                ),
                ...typeAchievements.map((achievement) {
                  return _buildAchievementCard(achievement);
                }),
                const SizedBox(height: AppTheme.spacingM),
              ],
            );
          },
        );
      },
    );
  }

  Widget _buildAchievementCard(Achievement achievement) {
    return Card(
      margin: const EdgeInsets.only(bottom: AppTheme.spacingM),
      child: ListTile(
        contentPadding: const EdgeInsets.all(AppTheme.spacingM),
        leading: Stack(
          children: [
            CircleAvatar(
              radius: 30,
              backgroundColor: achievement.isUnlocked
                  ? achievement.tierColor.withOpacity(0.2)
                  : Colors.grey.withOpacity(0.2),
              child: Icon(
                achievement.icon,
                color: achievement.isUnlocked
                    ? achievement.tierColor
                    : Colors.grey,
                size: 28,
              ),
            ),
            if (achievement.isUnlocked)
              Positioned(
                right: 0,
                bottom: 0,
                child: Container(
                  padding: const EdgeInsets.all(4),
                  decoration: const BoxDecoration(
                    color: AppTheme.success,
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(
                    Icons.check,
                    size: 12,
                    color: Colors.white,
                  ),
                ),
              ),
          ],
        ),
        title: Row(
          children: [
            Expanded(
              child: Text(
                achievement.title,
                style: AppTheme.bodyLarge.copyWith(
                  fontWeight: FontWeight.w600,
                  color: achievement.isUnlocked
                      ? AppTheme.lightTextPrimary
                      : Colors.grey,
                ),
              ),
            ),
            _buildTierBadge(achievement.tier),
          ],
        ),
        subtitle: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const SizedBox(height: AppTheme.spacingXS),
            Text(
              achievement.description,
              style: AppTheme.bodySmall.copyWith(
                color: achievement.isUnlocked
                    ? AppTheme.lightTextSecondary
                    : Colors.grey,
              ),
            ),
            const SizedBox(height: AppTheme.spacingS),
            if (!achievement.isUnlocked) ...[
              ClipRRect(
                borderRadius: BorderRadius.circular(AppTheme.radiusRound),
                child: LinearProgressIndicator(
                  value: achievement.progress,
                  minHeight: 8,
                  backgroundColor: Colors.grey.withOpacity(0.2),
                  valueColor: AlwaysStoppedAnimation<Color>(
                    achievement.tierColor,
                  ),
                ),
              ),
              const SizedBox(height: AppTheme.spacingXS),
              Text(
                '${achievement.currentValue} / ${achievement.requiredValue}',
                style: AppTheme.bodySmall.copyWith(
                  color: AppTheme.lightTextSecondary,
                ),
              ),
            ],
            const SizedBox(height: AppTheme.spacingS),
            Row(
              children: [
                Icon(
                  Iconsax.star_1,
                  size: 16,
                  color: achievement.isUnlocked
                      ? AppTheme.warning
                      : Colors.grey,
                ),
                const SizedBox(width: AppTheme.spacingXS),
                Text(
                  '${achievement.xpReward} XP',
                  style: AppTheme.bodySmall.copyWith(
                    color: achievement.isUnlocked
                        ? AppTheme.warning
                        : Colors.grey,
                    fontWeight: FontWeight.w600,
                  ),
                ),
                if (achievement.isUnlocked && achievement.unlockedAt != null) ...[
                  const Spacer(),
                  Text(
                    'Unlocked ${_formatDate(achievement.unlockedAt!)}',
                    style: AppTheme.bodySmall.copyWith(
                      color: AppTheme.lightTextSecondary,
                      fontStyle: FontStyle.italic,
                    ),
                  ),
                ],
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildTierBadge(AchievementTier tier) {
    return Container(
      padding: const EdgeInsets.symmetric(
        horizontal: 8,
        vertical: 4,
      ),
      decoration: BoxDecoration(
        color: _getTierColor(tier).withOpacity(0.2),
        borderRadius: BorderRadius.circular(AppTheme.radiusS),
      ),
      child: Text(
        tier.name.toUpperCase(),
        style: AppTheme.labelSmall.copyWith(
          color: _getTierColor(tier),
          fontWeight: FontWeight.bold,
        ),
      ),
    );
  }

  Widget _buildEmptyState(bool unlocked) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(AppTheme.spacingXL),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              unlocked ? Iconsax.award : Iconsax.lock_1,
              size: 80,
              color: Colors.grey.withOpacity(0.5),
            ),
            const SizedBox(height: AppTheme.spacingL),
            Text(
              unlocked
                  ? 'No achievements unlocked yet'
                  : 'All achievements unlocked!',
              style: AppTheme.headingSmall.copyWith(
                color: Colors.grey,
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: AppTheme.spacingM),
            Text(
              unlocked
                  ? 'Complete lessons and reach milestones to unlock achievements!'
                  : 'Congratulations! You\'ve unlocked all available achievements!',
              style: AppTheme.bodyMedium.copyWith(
                color: Colors.grey,
              ),
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }

  String _getTypeName(AchievementType type) {
    switch (type) {
      case AchievementType.streak:
        return '🔥 Streak Achievements';
      case AchievementType.completion:
        return '✅ Completion Achievements';
      case AchievementType.skill:
        return '📚 Skill Achievements';
      case AchievementType.milestone:
        return '🎯 Milestone Achievements';
      case AchievementType.special:
        return '⭐ Special Achievements';
    }
  }

  Color _getTierColor(AchievementTier tier) {
    switch (tier) {
      case AchievementTier.bronze:
        return const Color(0xFFCD7F32);
      case AchievementTier.silver:
        return const Color(0xFFC0C0C0);
      case AchievementTier.gold:
        return const Color(0xFFFFD700);
      case AchievementTier.platinum:
        return const Color(0xFFE5E4E2);
      case AchievementTier.diamond:
        return const Color(0xFFB9F2FF);
    }
  }

  String _formatDate(DateTime date) {
    final now = DateTime.now();
    final difference = now.difference(date);

    if (difference.inDays == 0) return 'today';
    if (difference.inDays == 1) return 'yesterday';
    if (difference.inDays < 7) return '${difference.inDays} days ago';
    if (difference.inDays < 30) return '${(difference.inDays / 7).floor()} weeks ago';
    return '${date.month}/${date.day}/${date.year}';
  }
}
