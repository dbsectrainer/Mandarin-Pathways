import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../l10n/strings.dart';
import '../services/app_state.dart';

class _CultureCard {
  final String icon;
  final String title;
  final String description;
  final List<String> tips;
  final String formalNote;
  final String informalNote;

  const _CultureCard({
    required this.icon,
    required this.title,
    required this.description,
    required this.tips,
    required this.formalNote,
    required this.informalNote,
  });
}

class _CultureTab {
  final String label;
  final String emoji;
  final List<_CultureCard> cards;

  const _CultureTab({
    required this.label,
    required this.emoji,
    required this.cards,
  });
}

const _cultureTabs = [
  _CultureTab(
    label: 'Mainland China',
    emoji: '🇨🇳',
    cards: [
      _CultureCard(
        icon: '🥢',
        title: 'Dining Etiquette',
        description: 'Shared dishes are common at Chinese meals. The host typically orders more food than needed as a sign of generosity.',
        tips: [
          'Wait for the host to invite you to eat before starting',
          'Pour tea for others before yourself',
          'Leaving a little food shows you are satisfied, not wasteful',
          'Splitting the bill (AA制) is now common among younger generations',
        ],
        formalNote: 'Formal toasts: gānbēi (干杯) — drink fully. Business banquets may involve baijiu (白酒).',
        informalNote: 'Informal: huǒguō (火锅 hot pot) is a social, relaxed gathering food.',
      ),
      _CultureCard(
        icon: '🎁',
        title: 'Gift Giving',
        description: 'Gift giving is important in Chinese social culture, especially during festivals (Spring Festival, Mid-Autumn).',
        tips: [
          'Do NOT give clocks (送钟 sounds like "attending a funeral")',
          'Do NOT give green hats — implies infidelity',
          'Gifts are often not opened immediately in front of the giver',
          'Red envelopes (红包 hóngbāo) with money are appreciated',
        ],
        formalNote: 'Business: high-quality tea, premium spirits, or local specialties.',
        informalNote: 'Personal: fruit, pastries, or products from your home country.',
      ),
      _CultureCard(
        icon: '👥',
        title: 'Guanxi (关系) — Relationships',
        description: 'Guanxi (relationships/connections) is central to Chinese business and social life. Building trust takes time.',
        tips: [
          'Business is relationship-based; trust must be established before deals',
          'Reciprocity is expected: favors are remembered and returned',
          'Mianzi (面子 face/prestige) must be preserved in all interactions',
          'Never embarrass someone publicly — address issues privately',
        ],
        formalNote: 'Formal address: use titles (经理 jīnglǐ, 老师 lǎoshī) until invited to use first names.',
        informalNote: 'Close friends may address each other with nicknames or diminutives (小+surname).',
      ),
    ],
  ),
  _CultureTab(
    label: 'Taiwan',
    emoji: '🇹🇼',
    cards: [
      _CultureCard(
        icon: '🗣️',
        title: 'Language Landscape',
        description: 'Taiwan uses Traditional Chinese characters (繁體). Mandarin is official, but Taiwanese Hokkien and Hakka are widely spoken.',
        tips: [
          'Traditional characters are used in all official and educational contexts',
          'Bopomofo (注音符號 ㄅㄆㄇㄈ) rather than Pinyin is taught in schools',
          'Many older Taiwanese also speak Japanese (legacy of Japanese occupation)',
          'Taiwan-specific vocabulary: 捷運 (jiéyùn) for MRT, 機車 (jīchē) for scooter',
        ],
        formalNote: 'Formal writing uses wenyan (文言) elements more frequently than mainland China.',
        informalNote: 'Colloquial speech frequently mixes Taiwanese Hokkien words with Mandarin.',
      ),
      _CultureCard(
        icon: '🛵',
        title: 'Night Markets (夜市)',
        description: 'Night markets (夜市 yèshì) are cultural hubs for food, shopping, and socializing. Shilin (士林) in Taipei is world-famous.',
        tips: [
          'Cash is preferred at most night market stalls',
          'Bargaining is generally not expected (prices are fixed)',
          'Must-try: stinky tofu (臭豆腐), oyster omelette (蚵仔煎), bubble tea (珍珠奶茶)',
          'Night markets open around 6–7 PM and run past midnight',
        ],
        formalNote: 'Daytime dining: traditional restaurants often close between lunch and dinner.',
        informalNote: 'Casual: convenience stores (7-Eleven, FamilyMart) serve as social hubs.',
      ),
    ],
  ),
  _CultureTab(
    label: 'Hong Kong',
    emoji: '🇭🇰',
    cards: [
      _CultureCard(
        icon: '🌐',
        title: 'Trilingual Society',
        description: 'Hong Kong operates in Cantonese, English, and Mandarin. Traditional Chinese characters are used.',
        tips: [
          'Cantonese is the primary spoken language — Mandarin is a second language for most',
          'English is co-official; government and legal documents exist in both languages',
          'Code-switching between Cantonese and English is common',
          'Traditional characters are used exclusively, unlike mainland simplified script',
        ],
        formalNote: 'Business: English is often the default for international dealings.',
        informalNote: 'Street Cantonese: casual particles (囉 lo, 喎 wo, 呀 aa) appear constantly in speech.',
      ),
      _CultureCard(
        icon: '🍱',
        title: 'Yum Cha (飲茶) Culture',
        description: 'Dim sum breakfast/brunch (飲茶 yám chàh) is a beloved Hong Kong tradition. Families gather at teahouses on weekend mornings.',
        tips: [
          'Knock lightly on the table with two fingers to thank someone for pouring tea',
          'Leave the teapot lid open when you need a refill',
          'It is polite to pour tea for elders first',
          'Popular dishes: har gow (蝦餃), siu mai (燒賣), char siu bao (叉燒包)',
        ],
        formalNote: 'Traditional teahouses (茶樓) have cart-service; modern restaurants use order sheets.',
        informalNote: 'Quick breakfast: 茶餐廳 (cha chaan teng) is the iconic Hong Kong-style diner.',
      ),
    ],
  ),
  _CultureTab(
    label: 'Business',
    emoji: '💼',
    cards: [
      _CultureCard(
        icon: '📇',
        title: 'Business Card Protocol',
        description: 'Business cards (名片 míngpiàn) are exchanged with both hands and a slight bow. They are treated with great respect.',
        tips: [
          'Present your card with both hands, Chinese side facing the recipient',
          'Receive a card with both hands; study it briefly before putting it away carefully',
          'Never write on someone\'s business card',
          'Cards are placed on the table during meetings, not stuffed in pockets immediately',
        ],
        formalNote: 'Senior executives present cards to junior staff first. Always acknowledge rank.',
        informalNote: 'WeChat QR code exchange has become an informal modern equivalent in mainland China.',
      ),
      _CultureCard(
        icon: '💰',
        title: 'Numbers & Lucky Symbols',
        description: 'Numbers carry cultural significance in Chinese business contexts.',
        tips: [
          '8 (八 bā) sounds like 发 (fā, prosperity) — highly auspicious',
          '4 (四 sì) sounds like 死 (sǐ, death) — often avoided in floors and room numbers',
          '6 (六 liù) symbolizes smooth progress; 9 (九 jiǔ) symbolizes longevity',
          'Red is the color of good fortune; gold represents wealth',
        ],
        formalNote: 'Major business announcements are often timed to dates with auspicious numbers.',
        informalNote: 'License plates and phone numbers with many 8s command premium prices.',
      ),
    ],
  ),
  _CultureTab(
    label: 'Social',
    emoji: '🎭',
    cards: [
      _CultureCard(
        icon: '🙇',
        title: 'Greetings & Forms of Address',
        description: 'Chinese greetings vary significantly by region and relationship. The most universal is 你好 (nǐ hǎo).',
        tips: [
          'Use titles + surname for formal settings: 王老师 (Teacher Wang), 李经理 (Manager Li)',
          'Asking about someone\'s age, salary, or marital status is not considered rude',
          'Physical greetings: handshakes are common in formal settings; hugs are less so',
          'Senior/elder members of a group are greeted first',
        ],
        formalNote: 'Formal: use 您 (nín) instead of 你 (nǐ) with elders and superiors.',
        informalNote: 'Close friends: lǎo (老) + surname for peers, xiǎo (小) + surname for younger friends.',
      ),
      _CultureCard(
        icon: '📱',
        title: 'Digital Communication',
        description: 'WeChat (微信 Wēixìn) is the dominant communication platform in China.',
        tips: [
          'Voice messages (语音消息) are widely preferred over text messages in China',
          'WeChat Pay (微信支付) and Alipay (支付宝) are ubiquitous; cash is rarely needed',
          'Group chats (群 qún) are used for families, work teams, and communities',
          'Replying promptly to messages is expected in professional contexts',
        ],
        formalNote: 'Business: WeChat work groups (企业微信) are standard for internal communication.',
        informalNote: 'Personal: WeChat Moments (朋友圈) is like a personal newsfeed for close contacts.',
      ),
    ],
  ),
];

class CultureScreen extends StatefulWidget {
  const CultureScreen({super.key});

  @override
  State<CultureScreen> createState() => _CultureScreenState();
}

class _CultureScreenState extends State<CultureScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: _cultureTabs.length, vsync: this);
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

    return Scaffold(
      appBar: AppBar(
        title: Text(AppStrings.t(lang, zh: '文化能力', en: 'Cultural Competency')),
        bottom: TabBar(
          controller: _tabController,
          isScrollable: true,
          tabs: _cultureTabs.map((t) => Tab(text: '${t.emoji} ${t.label}')).toList(),
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: _cultureTabs.map((tab) => _buildTabContent(tab)).toList(),
      ),
    );
  }

  Widget _buildTabContent(_CultureTab tab) {
    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: tab.cards.length,
      itemBuilder: (context, i) {
        final card = tab.cards[i];
        return Card(
          margin: const EdgeInsets.only(bottom: 16),
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Text(card.icon, style: const TextStyle(fontSize: 28)),
                    const SizedBox(width: 10),
                    Expanded(
                      child: Text(
                        card.title,
                        style: Theme.of(context).textTheme.titleMedium?.copyWith(
                              fontWeight: FontWeight.w600,
                            ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 10),
                Text(card.description,
                    style: Theme.of(context).textTheme.bodyMedium),
                const SizedBox(height: 10),
                ...card.tips.map((tip) => Padding(
                      padding: const EdgeInsets.only(bottom: 4),
                      child: Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text('✓ ',
                              style: TextStyle(
                                  color: Color(0xFF27AE60),
                                  fontWeight: FontWeight.bold)),
                          Expanded(
                            child: Text(tip,
                                style: Theme.of(context).textTheme.bodySmall),
                          ),
                        ],
                      ),
                    )),
                const SizedBox(height: 10),
                Container(
                  padding: const EdgeInsets.all(10),
                  decoration: BoxDecoration(
                    color: const Color(0xFFEEF4FB),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text('Formal:',
                          style: TextStyle(
                              fontWeight: FontWeight.w600,
                              color: Color(0xFF1A5C8F))),
                      Text(card.formalNote,
                          style: const TextStyle(
                              fontSize: 12, color: Color(0xFF1A5C8F))),
                      const SizedBox(height: 6),
                      const Text('Informal:',
                          style: TextStyle(
                              fontWeight: FontWeight.w600,
                              color: Color(0xFF1A5C8F))),
                      Text(card.informalNote,
                          style: const TextStyle(
                              fontSize: 12, color: Color(0xFF1A5C8F))),
                    ],
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }
}
