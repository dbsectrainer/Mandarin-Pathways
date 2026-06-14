import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../l10n/strings.dart';
import '../models/achievement.dart';
import '../models/lesson.dart';
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

class LearningDashboard extends StatefulWidget {
  const LearningDashboard({super.key});

  @override
  State<LearningDashboard> createState() => _LearningDashboardState();
}

class _LearningDashboardState extends State<LearningDashboard>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final appState = context.watch<AppState>();
    final lang = appState.currentLanguage;
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
          const SizedBox(height: 8),
          // XP bar
          Card(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
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
                  const SizedBox(height: 2),
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
          const SizedBox(height: 8),
          // Analytics tabs
          Card(
            child: Column(
              children: [
                TabBar(
                  controller: _tabController,
                  tabs: const [
                    Tab(text: 'Overview'),
                    Tab(text: 'Progress'),
                    Tab(text: 'Retention'),
                  ],
                ),
                SizedBox(
                  height: 200,
                  child: TabBarView(
                    controller: _tabController,
                    children: [
                      _OverviewTab(appState: appState, lang: lang),
                      _ProgressTab(appState: appState, lang: lang),
                      _RetentionTab(appState: appState, lang: lang),
                    ],
                  ),
                ),
              ],
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
            final isEarned = appState.earnedAchievements.contains(a.id);
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

class _OverviewTab extends StatelessWidget {
  final AppState appState;
  final Language lang;

  const _OverviewTab({required this.appState, required this.lang});

  @override
  Widget build(BuildContext context) {
    final estMinutes = appState.totalCompletedDays * 12;
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: Row(
        children: [
          Expanded(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                _MiniStat(value: '${appState.streakCount}🔥', label: AppStrings.t(lang, zh: '连续天数', en: 'Day streak')),
                _MiniStat(value: '${appState.totalCompletedDays}', label: AppStrings.t(lang, zh: '已完成天数', en: 'Lessons done')),
              ],
            ),
          ),
          Expanded(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                _MiniStat(value: '${appState.srsDueCount}', label: AppStrings.t(lang, zh: '今日复习', en: 'Due today')),
                _MiniStat(value: '~${estMinutes}m', label: AppStrings.t(lang, zh: '学习时间估计', en: 'Est. study time')),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _ProgressTab extends StatelessWidget {
  final AppState appState;
  final Language lang;

  const _ProgressTab({required this.appState, required this.lang});

  @override
  Widget build(BuildContext context) {
    final sections = [
      ('Basics (Days 1-7)', 1, 7),
      ('Essentials (8-14)', 8, 14),
      ('Cultural (15-22)', 15, 22),
      ('Professional (23-30)', 23, 30),
      ('Advanced (31-40)', 31, 40),
    ];

    return SingleChildScrollView(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: Column(
        children: sections.map((s) {
          final total = s.$3 - s.$2 + 1;
          var done = 0;
          for (var d = s.$2; d <= s.$3; d++) {
            if (appState.isDayCompleted(d)) done++;
          }
          final pct = total > 0 ? done / total : 0.0;
          return Padding(
            padding: const EdgeInsets.only(bottom: 6),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(s.$1, style: const TextStyle(fontSize: 11)),
                    Text('$done/$total', style: const TextStyle(fontSize: 11, color: Colors.grey)),
                  ],
                ),
                const SizedBox(height: 2),
                ClipRRect(
                  borderRadius: BorderRadius.circular(3),
                  child: LinearProgressIndicator(
                    value: pct,
                    minHeight: 6,
                    backgroundColor: Colors.grey[200],
                    valueColor: AlwaysStoppedAnimation<Color>(
                      Theme.of(context).colorScheme.primary,
                    ),
                  ),
                ),
              ],
            ),
          );
        }).toList(),
      ),
    );
  }
}

class _RetentionTab extends StatelessWidget {
  final AppState appState;
  final Language lang;

  const _RetentionTab({required this.appState, required this.lang});

  @override
  Widget build(BuildContext context) {
    final cards = appState.srsCards;
    final newCards = cards.where((c) => c.reps == 0).length;
    final learning = cards.where((c) => c.reps > 0 && c.interval < 21).length;
    final mastered = cards.where((c) => c.interval >= 21).length;
    final goodCards = cards.where((c) => c.ease >= 2.3).length;
    final retention = cards.isEmpty ? 0.0 : goodCards / cards.length;

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: Row(
        children: [
          Expanded(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                _MiniStat(value: '$newCards', label: AppStrings.t(lang, zh: '新卡', en: 'New')),
                _MiniStat(value: '$learning', label: AppStrings.t(lang, zh: '学习中', en: 'Learning')),
              ],
            ),
          ),
          Expanded(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                _MiniStat(value: '$mastered', label: AppStrings.t(lang, zh: '已掌握', en: 'Mastered')),
                _MiniStat(
                  value: '${(retention * 100).round()}%',
                  label: AppStrings.t(lang, zh: '留存率', en: 'Retention'),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _MiniStat extends StatelessWidget {
  final String value;
  final String label;

  const _MiniStat({required this.value, required this.label});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Text(
          value,
          style: Theme.of(context).textTheme.headlineSmall?.copyWith(fontWeight: FontWeight.bold),
        ),
        Text(label, style: const TextStyle(fontSize: 11), textAlign: TextAlign.center),
      ],
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
