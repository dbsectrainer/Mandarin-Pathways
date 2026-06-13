import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../l10n/strings.dart';
import '../models/achievement.dart';
import '../services/app_state.dart';

class LearningDashboard extends StatelessWidget {
  const LearningDashboard({super.key});

  @override
  Widget build(BuildContext context) {
    final appState = context.watch<AppState>();
    final lang = appState.currentLanguage;
    final earned = appState.earnedAchievements.toSet();

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
