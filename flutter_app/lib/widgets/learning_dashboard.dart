import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../l10n/strings.dart';
import '../models/achievement.dart';
import '../services/app_state.dart';

const _xpThresholds = [0, 100, 300, 600, 1000, 2000, 5000];
const _levelTitles = ['Beginner', 'Apprentice', 'Student', 'Scholar', 'Expert', 'Master', 'Grand Master'];

Map<String, dynamic> _getLevelInfo(int xp) {
  var level = 0;
  for (var i = _xpThresholds.length - 1; i >= 0; i--) {
    if (xp >= _xpThresholds[i]) { level = i; break; }
  }
  final nextXp = level < _xpThresholds.length - 1 ? _xpThresholds[level + 1] : _xpThresholds.last;
  final curXp = _xpThresholds[level];
  final progress = level < _xpThresholds.length - 1
      ? (xp - curXp) / (nextXp - curXp)
      : 1.0;
  return {'level': level + 1, 'title': _levelTitles[level], 'progress': progress, 'nextXp': nextXp};
}

class LearningDashboard extends StatelessWidget {
  const LearningDashboard({super.key});

  @override
  Widget build(BuildContext context) {
    final appState = context.watch<AppState>();
    final lang = appState.currentLanguage;
    final earned = appState.earnedAchievements.toSet();
    final xp = appState.xpPoints;
    final lvl = _getLevelInfo(xp);

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            AppStrings.t(lang, zh: '学习仪表盘', en: 'Learning Dashboard'),
            style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                  fontWeight: FontWeight.bold,
                ),
          ),
          const SizedBox(height: 12),
          Card(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Row(
                children: [
                  _Stat(
                    value: '${appState.streakCount}',
                    label: AppStrings.t(lang,
                        zh: '连续学习天数', en: 'Day streak'),
                  ),
                  _Stat(
                    value: '${appState.srsDueCount}',
                    label: AppStrings.t(lang,
                        zh: '今日复习卡片', en: 'Cards due today'),
                  ),
                  _Stat(
                    value: appState.placementResult != null
                        ? '${appState.placementResult!.recommendedDay}'
                        : '--',
                    label: AppStrings.t(lang,
                        zh: '推荐起点', en: 'Recommended start'),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 8),
          Card(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                        decoration: BoxDecoration(
                          color: Theme.of(context).colorScheme.primary,
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Text(
                          'Lv.${lvl['level']}',
                          style: const TextStyle(
                            color: Colors.white,
                            fontWeight: FontWeight.bold,
                            fontSize: 12,
                          ),
                        ),
                      ),
                      const SizedBox(width: 8),
                      Text(
                        lvl['title'] as String,
                        style: Theme.of(context).textTheme.titleSmall?.copyWith(
                              fontWeight: FontWeight.w600,
                            ),
                      ),
                      const Spacer(),
                      Text(
                        '$xp XP',
                        style: Theme.of(context).textTheme.bodySmall?.copyWith(
                              color: Theme.of(context).colorScheme.primary,
                              fontWeight: FontWeight.bold,
                            ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 6),
                  ClipRRect(
                    borderRadius: BorderRadius.circular(4),
                    child: LinearProgressIndicator(
                      value: lvl['progress'] as double,
                      minHeight: 6,
                      backgroundColor: Colors.grey[200],
                      valueColor: AlwaysStoppedAnimation<Color>(
                        Theme.of(context).colorScheme.primary,
                      ),
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    lvl['level'] < 7
                        ? 'Next level: ${lvl['nextXp']} XP'
                        : 'Max level reached!',
                    style: Theme.of(context).textTheme.bodySmall,
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 12),
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: [
              _NavChip(
                icon: Icons.layers,
                label: AppStrings.t(lang, zh: '开始复习', en: 'Start SRS'),
                route: '/srs',
              ),
              _NavChip(
                icon: Icons.star,
                label: AppStrings.t(lang, zh: '复习清单', en: 'Review starred'),
                route: '/review',
              ),
              _NavChip(
                icon: Icons.quiz,
                label: AppStrings.t(lang, zh: '水平测试', en: 'Placement test'),
                route: '/placement',
              ),
              _NavChip(
                icon: Icons.save_alt,
                label: AppStrings.t(lang, zh: '备份进度', en: 'Backup progress'),
                onTap: () => _showPortability(context),
              ),
            ],
          ),
          const SizedBox(height: 16),
          Text(
            AppStrings.t(lang, zh: '成就', en: 'Achievements'),
            style: Theme.of(context).textTheme.titleMedium,
          ),
          const SizedBox(height: 8),
          ...achievementDefs.map((a) {
            final isEarned = earned.contains(a.id);
            return ListTile(
              dense: true,
              leading: Icon(
                isEarned ? Icons.emoji_events : Icons.emoji_events_outlined,
                color: isEarned ? Colors.amber : Colors.grey,
              ),
              title: Text(AppStrings.t(lang, zh: a.labelZh, en: a.labelEn)),
              subtitle: Text(
                AppStrings.t(lang, zh: a.descriptionZh, en: a.descriptionEn),
              ),
            );
          }),
        ],
      ),
    );
  }

  void _showPortability(BuildContext context) {
    final appState = context.read<AppState>();
    final lang = appState.currentLanguage;
    final json = appState.storage.exportPortabilityJson();

    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: Text(AppStrings.t(lang, zh: '备份与恢复', en: 'Backup & restore')),
        content: SingleChildScrollView(
          child: SelectableText(
            json,
            style: const TextStyle(fontSize: 11, fontFamily: 'monospace'),
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: Text(AppStrings.t(lang, zh: '关闭', en: 'Close')),
          ),
        ],
      ),
    );
  }
}

class _Stat extends StatelessWidget {
  final String value;
  final String label;

  const _Stat({required this.value, required this.label});

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: Column(
        children: [
          Text(value,
              style: Theme.of(context)
                  .textTheme
                  .headlineMedium
                  ?.copyWith(fontWeight: FontWeight.bold)),
          Text(label, textAlign: TextAlign.center),
        ],
      ),
    );
  }
}

class _NavChip extends StatelessWidget {
  final IconData icon;
  final String label;
  final String? route;
  final VoidCallback? onTap;

  const _NavChip({
    required this.icon,
    required this.label,
    this.route,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return ActionChip(
      avatar: Icon(icon, size: 18),
      label: Text(label),
      onPressed: onTap ?? () => Navigator.pushNamed(context, route!),
    );
  }
}
