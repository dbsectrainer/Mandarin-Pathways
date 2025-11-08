import 'package:flutter/material.dart';

enum AchievementType {
  streak,
  completion,
  skill,
  milestone,
  special,
}

enum AchievementTier {
  bronze,
  silver,
  gold,
  platinum,
  diamond,
}

class Achievement {
  final String id;
  final String title;
  final String description;
  final IconData icon;
  final AchievementType type;
  final AchievementTier tier;
  final int requiredValue;
  final int currentValue;
  final DateTime? unlockedAt;
  final int xpReward;

  Achievement({
    required this.id,
    required this.title,
    required this.description,
    required this.icon,
    required this.type,
    required this.tier,
    required this.requiredValue,
    this.currentValue = 0,
    this.unlockedAt,
    this.xpReward = 100,
  });

  bool get isUnlocked => unlockedAt != null;
  double get progress => currentValue / requiredValue;

  Color get tierColor {
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

  Achievement copyWith({
    String? id,
    String? title,
    String? description,
    IconData? icon,
    AchievementType? type,
    AchievementTier? tier,
    int? requiredValue,
    int? currentValue,
    DateTime? unlockedAt,
    int? xpReward,
  }) {
    return Achievement(
      id: id ?? this.id,
      title: title ?? this.title,
      description: description ?? this.description,
      icon: icon ?? this.icon,
      type: type ?? this.type,
      tier: tier ?? this.tier,
      requiredValue: requiredValue ?? this.requiredValue,
      currentValue: currentValue ?? this.currentValue,
      unlockedAt: unlockedAt ?? this.unlockedAt,
      xpReward: xpReward ?? this.xpReward,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'description': description,
      'icon': icon.codePoint,
      'type': type.name,
      'tier': tier.name,
      'requiredValue': requiredValue,
      'currentValue': currentValue,
      'unlockedAt': unlockedAt?.toIso8601String(),
      'xpReward': xpReward,
    };
  }

  factory Achievement.fromJson(Map<String, dynamic> json) {
    return Achievement(
      id: json['id'] as String,
      title: json['title'] as String,
      description: json['description'] as String,
      icon: IconData(json['icon'] as int, fontFamily: 'MaterialIcons'),
      type: AchievementType.values.firstWhere(
        (e) => e.name == json['type'],
        orElse: () => AchievementType.milestone,
      ),
      tier: AchievementTier.values.firstWhere(
        (e) => e.name == json['tier'],
        orElse: () => AchievementTier.bronze,
      ),
      requiredValue: json['requiredValue'] as int,
      currentValue: json['currentValue'] as int? ?? 0,
      unlockedAt: json['unlockedAt'] != null
          ? DateTime.parse(json['unlockedAt'] as String)
          : null,
      xpReward: json['xpReward'] as int? ?? 100,
    );
  }
}

// Predefined achievements
class Achievements {
  static List<Achievement> getAll() {
    return [
      // Streak Achievements
      Achievement(
        id: 'streak_3',
        title: 'Getting Started',
        description: 'Complete 3 days in a row',
        icon: Icons.local_fire_department,
        type: AchievementType.streak,
        tier: AchievementTier.bronze,
        requiredValue: 3,
        xpReward: 50,
      ),
      Achievement(
        id: 'streak_7',
        title: 'Week Warrior',
        description: 'Complete 7 days in a row',
        icon: Icons.local_fire_department,
        type: AchievementType.streak,
        tier: AchievementTier.silver,
        requiredValue: 7,
        xpReward: 100,
      ),
      Achievement(
        id: 'streak_14',
        title: 'Two Week Champion',
        description: 'Complete 14 days in a row',
        icon: Icons.local_fire_department,
        type: AchievementType.streak,
        tier: AchievementTier.gold,
        requiredValue: 14,
        xpReward: 200,
      ),
      Achievement(
        id: 'streak_30',
        title: 'Monthly Master',
        description: 'Complete 30 days in a row',
        icon: Icons.local_fire_department,
        type: AchievementType.streak,
        tier: AchievementTier.platinum,
        requiredValue: 30,
        xpReward: 500,
      ),

      // Completion Achievements
      Achievement(
        id: 'complete_10',
        title: 'First Steps',
        description: 'Complete 10 lessons',
        icon: Icons.check_circle,
        type: AchievementType.completion,
        tier: AchievementTier.bronze,
        requiredValue: 10,
        xpReward: 100,
      ),
      Achievement(
        id: 'complete_20',
        title: 'Halfway Hero',
        description: 'Complete 20 lessons',
        icon: Icons.check_circle,
        type: AchievementType.completion,
        tier: AchievementTier.silver,
        requiredValue: 20,
        xpReward: 200,
      ),
      Achievement(
        id: 'complete_30',
        title: 'Almost There',
        description: 'Complete 30 lessons',
        icon: Icons.check_circle,
        type: AchievementType.completion,
        tier: AchievementTier.gold,
        requiredValue: 30,
        xpReward: 300,
      ),
      Achievement(
        id: 'complete_40',
        title: 'Course Completed',
        description: 'Complete all 40 lessons',
        icon: Icons.emoji_events,
        type: AchievementType.completion,
        tier: AchievementTier.diamond,
        requiredValue: 40,
        xpReward: 1000,
      ),

      // Skill Achievements
      Achievement(
        id: 'reading_beginner',
        title: 'Reading Rookie',
        description: 'Complete 5 reading exercises',
        icon: Icons.menu_book,
        type: AchievementType.skill,
        tier: AchievementTier.bronze,
        requiredValue: 5,
        xpReward: 50,
      ),
      Achievement(
        id: 'reading_intermediate',
        title: 'Reading Expert',
        description: 'Complete 15 reading exercises',
        icon: Icons.menu_book,
        type: AchievementType.skill,
        tier: AchievementTier.gold,
        requiredValue: 15,
        xpReward: 150,
      ),
      Achievement(
        id: 'writing_beginner',
        title: 'Writing Rookie',
        description: 'Complete 5 writing exercises',
        icon: Icons.edit,
        type: AchievementType.skill,
        tier: AchievementTier.bronze,
        requiredValue: 5,
        xpReward: 50,
      ),
      Achievement(
        id: 'writing_intermediate',
        title: 'Writing Expert',
        description: 'Complete 15 writing exercises',
        icon: Icons.edit,
        type: AchievementType.skill,
        tier: AchievementTier.gold,
        requiredValue: 15,
        xpReward: 150,
      ),

      // Milestone Achievements
      Achievement(
        id: 'first_lesson',
        title: 'First Step',
        description: 'Complete your first lesson',
        icon: Icons.star,
        type: AchievementType.milestone,
        tier: AchievementTier.bronze,
        requiredValue: 1,
        xpReward: 25,
      ),
      Achievement(
        id: 'section_basics',
        title: 'Basics Master',
        description: 'Complete the Basics section',
        icon: Icons.school,
        type: AchievementType.milestone,
        tier: AchievementTier.silver,
        requiredValue: 7,
        xpReward: 150,
      ),
      Achievement(
        id: 'section_essentials',
        title: 'Essentials Expert',
        description: 'Complete the Essentials section',
        icon: Icons.school,
        type: AchievementType.milestone,
        tier: AchievementTier.silver,
        requiredValue: 14,
        xpReward: 150,
      ),
      Achievement(
        id: 'section_cultural',
        title: 'Cultural Champion',
        description: 'Complete the Cultural section',
        icon: Icons.school,
        type: AchievementType.milestone,
        tier: AchievementTier.gold,
        requiredValue: 22,
        xpReward: 200,
      ),

      // Special Achievements
      Achievement(
        id: 'early_bird',
        title: 'Early Bird',
        description: 'Complete a lesson before 8 AM',
        icon: Icons.wb_sunny,
        type: AchievementType.special,
        tier: AchievementTier.bronze,
        requiredValue: 1,
        xpReward: 50,
      ),
      Achievement(
        id: 'night_owl',
        title: 'Night Owl',
        description: 'Complete a lesson after 10 PM',
        icon: Icons.nightlight,
        type: AchievementType.special,
        tier: AchievementTier.bronze,
        requiredValue: 1,
        xpReward: 50,
      ),
      Achievement(
        id: 'perfect_week',
        title: 'Perfect Week',
        description: 'Complete all daily goals for 7 days',
        icon: Icons.workspace_premium,
        type: AchievementType.special,
        tier: AchievementTier.platinum,
        requiredValue: 7,
        xpReward: 300,
      ),
    ];
  }
}
