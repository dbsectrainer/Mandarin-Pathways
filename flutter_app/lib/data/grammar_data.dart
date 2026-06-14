class GrammarTopic {
  final String id;
  final String cefr;
  final String pattern;
  final String zh;
  final String pinyin;
  final String en;
  final String note;

  const GrammarTopic({
    required this.id,
    required this.cefr,
    required this.pattern,
    required this.zh,
    required this.pinyin,
    required this.en,
    required this.note,
  });
}

class GrammarSection {
  final String cefr;
  final List<GrammarTopic> topics;

  const GrammarSection({required this.cefr, required this.topics});
}

const grammarSections = [
  GrammarSection(
    cefr: 'A1',
    topics: [
      GrammarTopic(
        id: 'g_a1_1',
        cefr: 'A1',
        pattern: 'Subject + 是 + Noun (to be)',
        zh: '我是学生。',
        pinyin: 'Wǒ shì xuéshēng.',
        en: 'I am a student.',
        note: '是 (shì) connects nouns as a copula. It is NOT used with adjectives — use 很 (hěn) instead.',
      ),
      GrammarTopic(
        id: 'g_a1_2',
        cefr: 'A1',
        pattern: 'Subject + 有 + Object (to have / there is)',
        zh: '我有一本书。',
        pinyin: 'Wǒ yǒu yī běn shū.',
        en: 'I have a book.',
        note: '有 (yǒu) expresses possession and existence. 没有 (méiyǒu) is the negation.',
      ),
      GrammarTopic(
        id: 'g_a1_3',
        cefr: 'A1',
        pattern: 'Measure words: Number + 量词 + Noun',
        zh: '两张纸，三本书，一杯水',
        pinyin: 'liǎng zhāng zhǐ, sān běn shū, yī bēi shuǐ',
        en: 'two sheets of paper, three books, one cup of water',
        note: 'Every Chinese noun requires a measure word (量词) between the number and noun. 个 (gè) is the most versatile all-purpose measure word.',
      ),
      GrammarTopic(
        id: 'g_a1_4',
        cefr: 'A1',
        pattern: 'Basic negation: 不 + Verb/Adjective',
        zh: '我不喜欢咖啡。',
        pinyin: 'Wǒ bù xǐhuān kāfēi.',
        en: "I don't like coffee.",
        note: '不 (bù) negates most verbs and adjectives. Exception: use 没 (méi) to negate 有 and past completed actions.',
      ),
      GrammarTopic(
        id: 'g_a1_5',
        cefr: 'A1',
        pattern: 'Yes/No questions: Sentence + 吗?',
        zh: '你是中国人吗？',
        pinyin: 'Nǐ shì Zhōngguórén ma?',
        en: 'Are you Chinese?',
        note: 'Add 吗 (ma) to the end of any statement to form a yes/no question. No word order change needed.',
      ),
    ],
  ),
  GrammarSection(
    cefr: 'A2',
    topics: [
      GrammarTopic(
        id: 'g_a2_1',
        cefr: 'A2',
        pattern: 'Completed action: Verb + 了',
        zh: '我吃了饭。',
        pinyin: 'Wǒ chī le fàn.',
        en: 'I ate. / I have eaten.',
        note: '了 (le) after a verb marks a completed action. It is NOT a simple past tense — it indicates completion.',
      ),
      GrammarTopic(
        id: 'g_a2_2',
        cefr: 'A2',
        pattern: 'Experiential aspect: Verb + 过',
        zh: '我去过北京。',
        pinyin: 'Wǒ qù guò Běijīng.',
        en: 'I have been to Beijing (at some point in my life).',
        note: '过 (guò) marks an experience that happened at some unspecified time in the past.',
      ),
      GrammarTopic(
        id: 'g_a2_3',
        cefr: 'A2',
        pattern: 'Ongoing action: 正在 + Verb + 着',
        zh: '他正在学习着。',
        pinyin: 'Tā zhèngzài xuéxí zhe.',
        en: 'He is currently studying.',
        note: '正在 indicates an action in progress right now. 着 adds a sense of continuity.',
      ),
      GrammarTopic(
        id: 'g_a2_4',
        cefr: 'A2',
        pattern: 'Time expressions: Time word + Subject + Verb',
        zh: '明天我去北京。',
        pinyin: 'Míngtiān wǒ qù Běijīng.',
        en: 'Tomorrow I am going to Beijing.',
        note: 'In Chinese, time words come BEFORE the verb, never at the end like in English.',
      ),
      GrammarTopic(
        id: 'g_a2_5',
        cefr: 'A2',
        pattern: 'Degree complement: Verb + 得 + Adjective',
        zh: '她说得很好。',
        pinyin: 'Tā shuō de hěn hǎo.',
        en: 'She speaks very well.',
        note: '得 (de) connects a verb to a description of how the action is performed.',
      ),
    ],
  ),
  GrammarSection(
    cefr: 'B1',
    topics: [
      GrammarTopic(
        id: 'g_b1_1',
        cefr: 'B1',
        pattern: 'Disposal: 把 + Object + Verb + Result',
        zh: '请把书放在桌上。',
        pinyin: 'Qǐng bǎ shū fàng zài zhuō shàng.',
        en: 'Please put the book on the table.',
        note: '把 (bǎ) construction highlights what happens to a known/specific object. The verb must be followed by a result or complement.',
      ),
      GrammarTopic(
        id: 'g_b1_2',
        cefr: 'B1',
        pattern: 'Passive: Subject + 被 + Agent + Verb',
        zh: '蛋糕被我吃了。',
        pinyin: 'Dàngāo bèi wǒ chī le.',
        en: 'The cake was eaten by me.',
        note: '被 (bèi) marks the passive voice. Passive sentences often carry a negative or undesirable connotation in Chinese.',
      ),
      GrammarTopic(
        id: 'g_b1_3',
        cefr: 'B1',
        pattern: 'Relative clause: [Modifier + 的] + Noun',
        zh: '昨天买的书很有意思。',
        pinyin: 'Zuótiān mǎi de shū hěn yǒuyìsi.',
        en: 'The book I bought yesterday is very interesting.',
        note: 'Relative clauses in Chinese come BEFORE the noun they modify, connected by 的. This is the opposite of English.',
      ),
      GrammarTopic(
        id: 'g_b1_4',
        cefr: 'B1',
        pattern: 'Comparison: A + 比 + B + Adjective',
        zh: '北京比上海冷。',
        pinyin: 'Běijīng bǐ Shànghǎi lěng.',
        en: 'Beijing is colder than Shanghai.',
        note: '比 (bǐ) structures comparisons. Do NOT use 更 (gèng) with 比 — just use the adjective directly.',
      ),
    ],
  ),
  GrammarSection(
    cefr: 'B2',
    topics: [
      GrammarTopic(
        id: 'g_b2_1',
        cefr: 'B2',
        pattern: '4-character idioms (成语 chéngyǔ)',
        zh: '半途而废 — 马到成功',
        pinyin: "bàntú'érfèi — mǎdào chénggōng",
        en: 'Give up halfway — Succeed immediately upon arrival',
        note: '成语 are four-character idioms with classical origins. Mastering common ones elevates written and formal Chinese.',
      ),
      GrammarTopic(
        id: 'g_b2_2',
        cefr: 'B2',
        pattern: 'Concession: 虽然…但是… (although…but…)',
        zh: '虽然天气很冷，但是我还是去跑步了。',
        pinyin: 'Suīrán tiānqì hěn lěng, dànshì wǒ háishi qù pǎobù le.',
        en: 'Although the weather was cold, I still went for a run.',
        note: 'Chinese concession requires BOTH 虽然 AND 但是/可是/却. You cannot use only one of them as in English.',
      ),
      GrammarTopic(
        id: 'g_b2_3',
        cefr: 'B2',
        pattern: 'Causal: 因为…所以… (because…therefore…)',
        zh: '因为他努力学习，所以他考试很好。',
        pinyin: 'Yīnwèi tā nǔlì xuéxí, suǒyǐ tā kǎoshì hěn hǎo.',
        en: 'Because he studied hard, he did well on the exam.',
        note: 'Like 虽然/但是, this pattern typically uses both conjunctions.',
      ),
    ],
  ),
  GrammarSection(
    cefr: 'C1',
    topics: [
      GrammarTopic(
        id: 'g_c1_1',
        cefr: 'C1',
        pattern: 'Classical patterns: 之乎者也',
        zh: '学而时习之，不亦说乎？',
        pinyin: 'Xué ér shí xí zhī, bù yì yuè hū?',
        en: 'Is it not pleasant to learn with a constant perseverance? (Confucius, Analects I.1)',
        note: 'Classical Chinese (文言文) uses particles 之、乎、者、也 extensively. Exposure builds cultural literacy.',
      ),
      GrammarTopic(
        id: 'g_c1_2',
        cefr: 'C1',
        pattern: 'Formal written structures: 对于…来说',
        zh: '对于语言学习者来说，坚持很重要。',
        pinyin: 'Duìyú yǔyán xuéxízhě lái shuō, jiānchí hěn zhòngyào.',
        en: 'For language learners, persistence is very important.',
        note: '对于…来说 introduces a perspective or topic in formal writing. Common in essays and academic Chinese.',
      ),
    ],
  ),
];
