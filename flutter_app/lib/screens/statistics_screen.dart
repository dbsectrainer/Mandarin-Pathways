import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:iconsax/iconsax.dart';
import 'package:fl_chart/fl_chart.dart';
import '../services/gamification_service.dart';
import '../config/theme_config.dart';

class StatisticsScreen extends StatefulWidget {
  const StatisticsScreen({Key? key}) : super(key: key);

  @override
  State<StatisticsScreen> createState() => _StatisticsScreenState();
}

class _StatisticsScreenState extends State<StatisticsScreen> {
  String _selectedPeriod = '7 Days';

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Statistics'),
      ),
      body: Consumer<GamificationService>(
        builder: (context, gamificationService, child) {
          if (!gamificationService.isInitialized) {
            return const Center(child: CircularProgressIndicator());
          }

          final stats = gamificationService.getStatistics();
          final streak = gamificationService.streak;

          return SingleChildScrollView(
            padding: const EdgeInsets.all(AppTheme.spacingL),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Overview Cards
                _buildOverviewCards(stats),
                const SizedBox(height: AppTheme.spacingXL),

                // Period Selector
                _buildPeriodSelector(),
                const SizedBox(height: AppTheme.spacingL),

                // Activity Chart
                _buildActivityChart(streak),
                const SizedBox(height: AppTheme.spacingXL),

                // Progress Chart
                _buildProgressChart(stats),
                const SizedBox(height: AppTheme.spacingXL),

                // Study Time Distribution
                _buildStudyTimeDistribution(),
              ],
            ),
          );
        },
      ),
    );
  }

  Widget _buildOverviewCards(Map<String, dynamic> stats) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Overview',
          style: AppTheme.headingSmall.copyWith(
            fontWeight: FontWeight.bold,
          ),
        ),
        const SizedBox(height: AppTheme.spacingM),
        Row(
          children: [
            Expanded(
              child: _buildMiniStatCard(
                icon: Iconsax.flash_1,
                label: 'Current Streak',
                value: '${stats['currentStreak']} days',
                color: AppTheme.accentOrange,
              ),
            ),
            const SizedBox(width: AppTheme.spacingM),
            Expanded(
              child: _buildMiniStatCard(
                icon: Iconsax.book,
                label: 'Total Lessons',
                value: '${stats['lessonsCompleted']}',
                color: AppTheme.accentPurple,
              ),
            ),
          ],
        ),
        const SizedBox(height: AppTheme.spacingM),
        Row(
          children: [
            Expanded(
              child: _buildMiniStatCard(
                icon: Iconsax.star_1,
                label: 'Total XP',
                value: '${stats['totalXP']}',
                color: AppTheme.warning,
              ),
            ),
            const SizedBox(width: AppTheme.spacingM),
            Expanded(
              child: _buildMiniStatCard(
                icon: Iconsax.calendar,
                label: 'Days Studied',
                value: '${stats['daysStudied']}',
                color: AppTheme.info,
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildMiniStatCard({
    required IconData icon,
    required String label,
    required String value,
    required Color color,
  }) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(AppTheme.spacingM),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Icon(icon, color: color, size: 28),
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
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildPeriodSelector() {
    final periods = ['7 Days', '30 Days', 'All Time'];

    return Row(
      children: periods.map((period) {
        final isSelected = _selectedPeriod == period;
        return Padding(
          padding: const EdgeInsets.only(right: AppTheme.spacingS),
          child: ChoiceChip(
            label: Text(period),
            selected: isSelected,
            onSelected: (selected) {
              setState(() {
                _selectedPeriod = period;
              });
            },
            selectedColor: AppTheme.primaryRed.withOpacity(0.2),
            labelStyle: AppTheme.bodyMedium.copyWith(
              color: isSelected ? AppTheme.primaryRed : AppTheme.lightTextSecondary,
              fontWeight: isSelected ? FontWeight.w600 : FontWeight.w500,
            ),
          ),
        );
      }).toList(),
    );
  }

  Widget _buildActivityChart(streak) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(AppTheme.spacingL),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Activity Chart',
              style: AppTheme.headingSmall.copyWith(
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: AppTheme.spacingL),
            SizedBox(
              height: 200,
              child: _buildLineChart(streak),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildLineChart(streak) {
    // Generate sample data based on study dates
    final days = _selectedPeriod == '7 Days'
        ? 7
        : _selectedPeriod == '30 Days'
            ? 30
            : 90;

    final spots = <FlSpot>[];
    for (int i = 0; i < days; i++) {
      final date = DateTime.now().subtract(Duration(days: days - i - 1));
      final hasStudied = streak.studyDates.any((studyDate) =>
          studyDate.year == date.year &&
          studyDate.month == date.month &&
          studyDate.day == date.day);

      spots.add(FlSpot(i.toDouble(), hasStudied ? 1.0 : 0.0));
    }

    return LineChart(
      LineChartData(
        gridData: FlGridData(
          show: true,
          drawVerticalLine: false,
          horizontalInterval: 1,
          getDrawingHorizontalLine: (value) {
            return FlLine(
              color: Colors.grey.withOpacity(0.2),
              strokeWidth: 1,
            );
          },
        ),
        titlesData: FlTitlesData(
          show: true,
          rightTitles: const AxisTitles(
            sideTitles: SideTitles(showTitles: false),
          ),
          topTitles: const AxisTitles(
            sideTitles: SideTitles(showTitles: false),
          ),
          bottomTitles: AxisTitles(
            sideTitles: SideTitles(
              showTitles: true,
              reservedSize: 30,
              interval: days > 7 ? (days / 5) : 1,
              getTitlesWidget: (value, meta) {
                final date = DateTime.now()
                    .subtract(Duration(days: days - value.toInt() - 1));
                return SideTitleWidget(
                  axisSide: meta.axisSide,
                  child: Text(
                    '${date.month}/${date.day}',
                    style: AppTheme.bodySmall.copyWith(
                      color: AppTheme.lightTextSecondary,
                    ),
                  ),
                );
              },
            ),
          ),
          leftTitles: const AxisTitles(
            sideTitles: SideTitles(showTitles: false),
          ),
        ),
        borderData: FlBorderData(show: false),
        minX: 0,
        maxX: (days - 1).toDouble(),
        minY: 0,
        maxY: 1,
        lineBarsData: [
          LineChartBarData(
            spots: spots,
            isCurved: true,
            color: AppTheme.primaryRed,
            barWidth: 3,
            isStrokeCapRound: true,
            dotData: FlDotData(
              show: true,
              getDotPainter: (spot, percent, barData, index) {
                return FlDotCirclePainter(
                  radius: spot.y > 0 ? 4 : 0,
                  color: AppTheme.primaryRed,
                  strokeWidth: 2,
                  strokeColor: Colors.white,
                );
              },
            ),
            belowBarData: BarAreaData(
              show: true,
              color: AppTheme.primaryRed.withOpacity(0.2),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildProgressChart(Map<String, dynamic> stats) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(AppTheme.spacingL),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Progress Overview',
              style: AppTheme.headingSmall.copyWith(
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: AppTheme.spacingL),
            SizedBox(
              height: 200,
              child: _buildBarChart(stats),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildBarChart(Map<String, dynamic> stats) {
    return BarChart(
      BarChartData(
        alignment: BarChartAlignment.spaceAround,
        maxY: 40,
        barTouchData: BarTouchData(enabled: false),
        titlesData: FlTitlesData(
          show: true,
          rightTitles: const AxisTitles(
            sideTitles: SideTitles(showTitles: false),
          ),
          topTitles: const AxisTitles(
            sideTitles: SideTitles(showTitles: false),
          ),
          bottomTitles: AxisTitles(
            sideTitles: SideTitles(
              showTitles: true,
              getTitlesWidget: (value, meta) {
                final labels = ['Completed', 'Streak', 'Days'];
                if (value.toInt() >= 0 && value.toInt() < labels.length) {
                  return SideTitleWidget(
                    axisSide: meta.axisSide,
                    child: Text(
                      labels[value.toInt()],
                      style: AppTheme.bodySmall.copyWith(
                        color: AppTheme.lightTextSecondary,
                      ),
                    ),
                  );
                }
                return const Text('');
              },
            ),
          ),
          leftTitles: const AxisTitles(
            sideTitles: SideTitles(showTitles: false),
          ),
        ),
        borderData: FlBorderData(show: false),
        gridData: const FlGridData(show: false),
        barGroups: [
          BarChartGroupData(
            x: 0,
            barRods: [
              BarChartRodData(
                toY: (stats['lessonsCompleted'] as int).toDouble(),
                color: AppTheme.accentPurple,
                width: 40,
                borderRadius: const BorderRadius.vertical(
                  top: Radius.circular(AppTheme.radiusS),
                ),
              ),
            ],
          ),
          BarChartGroupData(
            x: 1,
            barRods: [
              BarChartRodData(
                toY: (stats['currentStreak'] as int).toDouble(),
                color: AppTheme.accentOrange,
                width: 40,
                borderRadius: const BorderRadius.vertical(
                  top: Radius.circular(AppTheme.radiusS),
                ),
              ),
            ],
          ),
          BarChartGroupData(
            x: 2,
            barRods: [
              BarChartRodData(
                toY: (stats['daysStudied'] as int).toDouble(),
                color: AppTheme.info,
                width: 40,
                borderRadius: const BorderRadius.vertical(
                  top: Radius.circular(AppTheme.radiusS),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildStudyTimeDistribution() {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(AppTheme.spacingL),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Weekly Activity',
              style: AppTheme.headingSmall.copyWith(
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: AppTheme.spacingL),
            _buildWeekdayBars(),
          ],
        ),
      ),
    );
  }

  Widget _buildWeekdayBars() {
    final weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    // Mock data - in real app, this would come from actual study data
    final values = [0.8, 0.6, 0.9, 0.7, 0.5, 0.3, 0.4];

    return Column(
      children: List.generate(7, (index) {
        return Padding(
          padding: const EdgeInsets.only(bottom: AppTheme.spacingM),
          child: Row(
            children: [
              SizedBox(
                width: 40,
                child: Text(
                  weekdays[index],
                  style: AppTheme.bodyMedium.copyWith(
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
              const SizedBox(width: AppTheme.spacingM),
              Expanded(
                child: Stack(
                  children: [
                    Container(
                      height: 24,
                      decoration: BoxDecoration(
                        color: Colors.grey.withOpacity(0.2),
                        borderRadius: BorderRadius.circular(AppTheme.radiusS),
                      ),
                    ),
                    FractionallySizedBox(
                      widthFactor: values[index],
                      child: Container(
                        height: 24,
                        decoration: BoxDecoration(
                          gradient: LinearGradient(
                            colors: [
                              AppTheme.primaryRed,
                              AppTheme.primaryRedDark,
                            ],
                          ),
                          borderRadius: BorderRadius.circular(AppTheme.radiusS),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(width: AppTheme.spacingM),
              SizedBox(
                width: 40,
                child: Text(
                  '${(values[index] * 100).toInt()}%',
                  style: AppTheme.bodySmall.copyWith(
                    color: AppTheme.lightTextSecondary,
                  ),
                  textAlign: TextAlign.right,
                ),
              ),
            ],
          ),
        );
      }),
    );
  }
}
