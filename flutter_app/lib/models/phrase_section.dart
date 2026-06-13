class PhraseItem {
  final int cueIndex;
  final String text;

  const PhraseItem({required this.cueIndex, required this.text});
}

class PhraseSection {
  final String title;
  final List<PhraseItem> phrases;

  const PhraseSection({required this.title, required this.phrases});
}
