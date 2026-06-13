class Achievement {
  final String id;
  final String labelZh;
  final String labelEn;
  final String descriptionZh;
  final String descriptionEn;
  final bool Function(AchievementContext context) test;

  const Achievement({
    required this.id,
    required this.labelZh,
    required this.labelEn,
    required this.descriptionZh,
    required this.descriptionEn,
    required this.test,
  });
}

class AchievementContext {
  final int completedLessonCount;
  final int srsReviewCount;

  const AchievementContext({
    required this.completedLessonCount,
    required this.srsReviewCount,
  });
}

final achievementDefs = <Achievement>[
  Achievement(
    id: 'first-lesson',
    labelZh: '第一课',
    labelEn: 'First lesson',
    descriptionZh: '完成一节课程',
    descriptionEn: 'Complete one lesson',
    test: (c) => c.completedLessonCount >= 1,
  ),
  Achievement(
    id: 'week-learner',
    labelZh: '7天学习者',
    labelEn: '7-day learner',
    descriptionZh: '完成7节课程',
    descriptionEn: 'Complete 7 lessons',
    test: (c) => c.completedLessonCount >= 7,
  ),
  Achievement(
    id: 'two-week-path',
    labelZh: '两周路径',
    labelEn: 'Two-week path',
    descriptionZh: '完成14节课程',
    descriptionEn: 'Complete 14 lessons',
    test: (c) => c.completedLessonCount >= 14,
  ),
  Achievement(
    id: 'thirty-day-build',
    labelZh: '30天积累',
    labelEn: '30-day build',
    descriptionZh: '完成30节课程',
    descriptionEn: 'Complete 30 lessons',
    test: (c) => c.completedLessonCount >= 30,
  ),
  Achievement(
    id: 'pathway-complete',
    labelZh: '路径完成',
    labelEn: 'Pathway complete',
    descriptionZh: '完成全部40节课程',
    descriptionEn: 'Complete all 40 lessons',
    test: (c) => c.completedLessonCount >= 40,
  ),
  Achievement(
    id: 'first-review',
    labelZh: '第一次复习',
    labelEn: 'First review',
    descriptionZh: '完成一次间隔复习',
    descriptionEn: 'Complete one SRS review',
    test: (c) => c.srsReviewCount >= 1,
  ),
];
