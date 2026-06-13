import '../models/lesson.dart';

class ActivityInfo {
  final String key;
  final String title;
  final String titleZh;
  final String titlePinyin;
  final String description;
  final String descriptionZh;
  final String descriptionPinyin;
  final bool hasAudio;

  const ActivityInfo({
    required this.key,
    required this.title,
    this.titleZh = '',
    this.titlePinyin = '',
    this.description = '',
    this.descriptionZh = '',
    this.descriptionPinyin = '',
    this.hasAudio = true,
  });

  String displayTitle(Language lang) {
    switch (lang) {
      case Language.chinese:
        return titleZh.isNotEmpty ? titleZh : title;
      case Language.pinyin:
        return titlePinyin.isNotEmpty ? titlePinyin : title;
      case Language.english:
        return title;
    }
  }

  String displayDescription(Language lang) {
    switch (lang) {
      case Language.chinese:
        return descriptionZh.isNotEmpty ? descriptionZh : description;
      case Language.pinyin:
        return descriptionPinyin.isNotEmpty ? descriptionPinyin : description;
      case Language.english:
        return description;
    }
  }
}

class ReadingTopic {
  final String name;
  final ActivityInfo info;

  const ReadingTopic({required this.name, required this.info});
}

const readingCatalog = <String, List<ReadingTopic>>{
  'beginner': [
    ReadingTopic(
      name: 'Self Introduction',
      info: ActivityInfo(
        key: 'self_introduction',
        title: 'Self Introduction',
        description: 'A simple self-introduction in Mandarin',
      ),
    ),
    ReadingTopic(
      name: 'Daily Routine',
      info: ActivityInfo(
        key: 'daily_routine',
        title: 'Daily Routine',
        description: 'Learn vocabulary related to daily activities',
      ),
    ),
  ],
  'intermediate': [
    ReadingTopic(
      name: 'At the Restaurant',
      info: ActivityInfo(
        key: 'at_the_restaurant',
        title: 'At the Restaurant',
        description: 'Vocabulary and phrases for dining out',
      ),
    ),
    ReadingTopic(
      name: 'Weekend Plans',
      info: ActivityInfo(
        key: 'weekend_plans',
        title: 'Weekend Plans',
        description: 'Discussing weekend activities and plans',
      ),
    ),
  ],
  'advanced': [
    ReadingTopic(
      name: 'Environmental Protection',
      info: ActivityInfo(
        key: 'environmental_protection',
        title: 'Environmental Protection',
        description: 'Advanced vocabulary related to environmental issues',
      ),
    ),
  ],
};

const writingCatalog = <String, Map<String, ActivityInfo>>{
  'character': {
    'Basic Strokes': ActivityInfo(
      key: 'basic_strokes',
      title: 'Basic Strokes',
      titleZh: '基本笔画',
      titlePinyin: 'Jīběn bǐhuà',
      description: 'Practice the fundamental strokes used in Chinese characters',
      descriptionZh: '练习汉字中使用的基本笔画',
      descriptionPinyin: 'Liànxí Hànzì zhōng shǐyòng de jīběn bǐhuà',
    ),
    'Common Radicals': ActivityInfo(
      key: 'common_radicals',
      title: 'Common Radicals',
      titleZh: '常用部首',
      titlePinyin: 'Chángyòng bùshǒu',
      description:
          'Practice common radicals that form the building blocks of Chinese characters',
      descriptionZh: '练习构成汉字基本组成部分的常用部首',
      descriptionPinyin:
          'Liànxí gòuchéng Hànzì jīběn zǔchéng bùfèn de chángyòng bùshǒu',
    ),
    'Numbers': ActivityInfo(
      key: 'numbers',
      title: 'Numbers',
      titleZh: '数字',
      titlePinyin: 'Shùzì',
      description: 'Practice writing Chinese numbers',
      descriptionZh: '练习书写中文数字',
      descriptionPinyin: 'Liànxí shūxiě Zhōngwén shùzì',
    ),
    'Complete Radicals - Group 1': ActivityInfo(
      key: 'complete_radicals_-_group_1',
      title: 'Complete Radicals - Group 1',
      titleZh: '完整部首 - 第一组',
      titlePinyin: 'Wánzhěng bùshǒu - Dì yī zǔ',
      description: 'Practice common radicals (1-30 of 214 Kangxi radicals)',
      descriptionZh: '练习常用部首（康熙部首214个中的1-30个）',
      descriptionPinyin:
          'Liànxí chángyòng bùshǒu (Kāngxī bùshǒu 214 gè zhōng de 1-30 gè)',
    ),
    'Complete Radicals - Group 2': ActivityInfo(
      key: 'complete_radicals_-_group_2',
      title: 'Complete Radicals - Group 2',
      titleZh: '完整部首 - 第二组',
      titlePinyin: 'Wánzhěng bùshǒu - Dì èr zǔ',
      description: 'Practice common radicals (31-60 of 214 Kangxi radicals)',
      descriptionZh: '练习常用部首（康熙部首214个中的31-60个）',
      descriptionPinyin:
          'Liànxí chángyòng bùshǒu (Kāngxī bùshǒu 214 gè zhōng de 31-60 gè)',
    ),
    'Complete Radicals - Group 3': ActivityInfo(
      key: 'complete_radicals_-_group_3',
      title: 'Complete Radicals - Group 3',
      titleZh: '完整部首 - 第三组',
      titlePinyin: 'Wánzhěng bùshǒu - Dì sān zǔ',
      description: 'Practice common radicals (61-90 of 214 Kangxi radicals)',
      descriptionZh: '练习常用部首（康熙部首214个中的61-90个）',
      descriptionPinyin:
          'Liànxí chángyòng bùshǒu (Kāngxī bùshǒu 214 gè zhōng de 61-90 gè)',
    ),
    'HSK1 - Essential': ActivityInfo(
      key: 'hsk1_-_essential',
      title: 'HSK1 Essential Characters',
      titleZh: 'HSK1 基础汉字',
      titlePinyin: 'HSK1 jīchǔ Hànzì',
      description: 'Practice the most common characters from HSK Level 1',
      descriptionZh: '练习HSK一级中最常用的汉字',
      descriptionPinyin: 'Liànxí HSK yī jí zhōng zuì chángyòng de Hànzì',
    ),
    'HSK2 - Basic': ActivityInfo(
      key: 'hsk2_-_basic',
      title: 'HSK2 Basic Characters',
      titleZh: 'HSK2 基本汉字',
      titlePinyin: 'HSK2 jīběn Hànzì',
      description: 'Practice common characters from HSK Level 2',
      descriptionZh: '练习HSK二级中的常用汉字',
      descriptionPinyin: 'Liànxí HSK èr jí zhōng de chángyòng Hànzì',
    ),
    'HSK3 - Intermediate': ActivityInfo(
      key: 'hsk3_-_intermediate',
      title: 'HSK3 Intermediate Characters',
      titleZh: 'HSK3 中级汉字',
      titlePinyin: 'HSK3 zhōngjí Hànzì',
      description: 'Practice intermediate characters from HSK Level 3',
      descriptionZh: '练习HSK三级中的中级汉字',
      descriptionPinyin: 'Liànxí HSK sān jí zhōng de zhōngjí Hànzì',
    ),
    'Theme - Family': ActivityInfo(
      key: 'theme_-_family',
      title: 'Theme - Family',
      titleZh: '主题 - 家庭',
      titlePinyin: 'Zhǔtí - Jiātíng',
      description: 'Practice characters related to family members and relationships',
      descriptionZh: '练习与家庭成员和关系相关的汉字',
      descriptionPinyin: 'Liànxí yǔ jiātíng chéngyuán hé guānxì xiāngguān de Hànzì',
    ),
    'Theme - Food': ActivityInfo(
      key: 'theme_-_food',
      title: 'Theme - Food',
      titleZh: '主题 - 食物',
      titlePinyin: 'Zhǔtí - Shíwù',
      description: 'Practice characters related to food and dining',
      descriptionZh: '练习与食物和用餐相关的汉字',
      descriptionPinyin: 'Liànxí yǔ shíwù hé yòngcān xiāngguān de Hànzì',
    ),
    'Theme - Travel': ActivityInfo(
      key: 'theme_-_travel',
      title: 'Theme - Travel',
      titleZh: '主题 - 旅行',
      titlePinyin: 'Zhǔtí - Lǚxíng',
      description: 'Practice characters related to travel and transportation',
      descriptionZh: '练习与旅行和交通相关的汉字',
      descriptionPinyin: 'Liànxí yǔ lǚxíng hé jiāotōng xiāngguān de Hànzì',
    ),
  },
  'sentence': {
    'Beginner': ActivityInfo(
      key: 'beginner',
      title: 'Beginner Sentence Completion',
      titleZh: '初级句子完成',
      titlePinyin: 'Chūjí jùzi wánchéng',
      description: 'Complete sentences with appropriate words',
      descriptionZh: '用适当的词语完成句子',
      descriptionPinyin: 'Yòng shìdàng de cíyǔ wánchéng jùzi',
    ),
    'Intermediate': ActivityInfo(
      key: 'intermediate',
      title: 'Intermediate Sentence Completion',
      titleZh: '中级句子完成',
      titlePinyin: 'Zhōngjí jùzi wánchéng',
      description: 'Complete sentences with appropriate words or phrases',
      descriptionZh: '用适当的词语或短语完成句子',
      descriptionPinyin: 'Yòng shìdàng de cíyǔ huò duǎnyǔ wánchéng jùzi',
    ),
    'Advanced': ActivityInfo(
      key: 'advanced',
      title: 'Advanced Sentence Completion',
      titleZh: '高级句子完成',
      titlePinyin: 'Gāojí jùzi wánchéng',
      description:
          'Complete complex sentences with appropriate words or phrases',
      descriptionZh: '用适当的词语或短语完成复杂句子',
      descriptionPinyin: 'Yòng shìdàng de cíyǔ huò duǎnyǔ wánchéng fùzá jùzi',
    ),
  },
  'translation': {
    'Beginner': ActivityInfo(
      key: 'beginner',
      title: 'Beginner Translation Exercises',
      titleZh: '初级翻译练习',
      titlePinyin: 'Chūjí fānyì liànxí',
      description: 'Translate simple sentences between English and Chinese',
      descriptionZh: '翻译英文和中文之间的简单句子',
      descriptionPinyin: 'Fānyì Yīngwén hé Zhōngwén zhījiān de jiǎndān jùzi',
    ),
    'Intermediate': ActivityInfo(
      key: 'intermediate',
      title: 'Intermediate Translation Exercises',
      titleZh: '中级翻译练习',
      titlePinyin: 'Zhōngjí fānyì liànxí',
      description:
          'Translate more complex sentences between English and Chinese',
      descriptionZh: '翻译英文和中文之间的更复杂句子',
      descriptionPinyin: 'Fānyì Yīngwén hé Zhōngwén zhījiān de gèng fùzá jùzi',
    ),
    'Advanced': ActivityInfo(
      key: 'advanced',
      title: 'Advanced Translation Exercises',
      titleZh: '高级翻译练习',
      titlePinyin: 'Gāojí fānyì liànxí',
      description:
          'Translate complex sentences and paragraphs between English and Chinese',
      descriptionZh: '翻译英文和中文之间的复杂句子和段落',
      descriptionPinyin:
          'Fānyì Yīngwén hé Zhōngwén zhījiān de fùzá jùzi hé duànluò',
    ),
  },
};

String slugify(String value) => value.toLowerCase().replaceAll(' ', '_');

String audioLangFor(Language lang) => lang == Language.pinyin ? 'zh' : lang.code;

String readingTopicSlug(String topic) => slugify(topic);

String writingLevelSlug(String level) => slugify(level);
