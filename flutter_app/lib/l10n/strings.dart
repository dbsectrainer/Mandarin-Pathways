import '../models/lesson.dart';

class AppStrings {
  static String t(Language lang, {required String zh, required String en, String? pinyin}) {
    switch (lang) {
      case Language.chinese:
        return zh;
      case Language.pinyin:
        return pinyin ?? en;
      case Language.english:
        return en;
      case Language.cantonese:
        return zh;
    }
  }
}
