/**
 * Cultural competency page logic
 */

const CULTURE_DATA = {
    mainland: {
        label: "🇨🇳 Mainland China",
        cards: [
            {
                icon: "🥢",
                title: "Dining Etiquette",
                desc: "Shared dishes are common at Chinese meals. The host typically orders more food than needed as a sign of generosity.",
                tips: [
                    "Wait for the host to invite you to eat before starting",
                    "It is polite to pour tea for others before yourself",
                    "Leaving a little food shows you are satisfied, not wasteful",
                    "Splitting the bill (AA制) is now common among younger generations",
                ],
                formal: "Formal toasts: gānbēi (干杯) — drink fully. Business banquets may involve baijiu (白酒).",
                informal: "Informal: huǒguō (火锅 hot pot) is a social, relaxed gathering food.",
            },
            {
                icon: "🎁",
                title: "Gift Giving",
                desc: "Gift giving is important in Chinese social culture, especially during festivals (Spring Festival, Mid-Autumn).",
                tips: [
                    "Do NOT give clocks (送钟 sounds like 'attending a funeral')",
                    "Do NOT give shoes (implies walking away from the relationship)",
                    "Green hats imply infidelity — avoid gifting",
                    "Gifts are often not opened immediately in front of the giver",
                    "Red envelopes (红包 hóngbāo) with money are appreciated",
                ],
                formal: "Business: high-quality tea, premium spirits, or local specialties are appropriate.",
                informal: "Personal: fruit, pastries, or products from your home country.",
            },
            {
                icon: "👥",
                title: "Guanxi (关系) — Relationships",
                desc: "Guanxi (relationships/connections) is central to Chinese business and social life. Building trust takes time.",
                tips: [
                    "Business is relationship-based; trust must be established before deals",
                    "Reciprocity is expected: favors are remembered and returned",
                    "Mianzi (面子 face/prestige) must be preserved in all interactions",
                    "Never embarrass someone publicly — address issues privately",
                ],
                formal: "Formal address: use titles (经理 jīnglǐ, 老师 lǎoshī) until invited to use first names.",
                informal: "Close friends may address each other with nicknames or diminutives (小+surname).",
            },
            {
                icon: "🧧",
                title: "Spring Festival Culture",
                desc: "The Lunar New Year (春节 Chūnjié) is the most important Chinese holiday, spanning 15 days.",
                tips: [
                    "Clean your home before New Year but not on the day itself (sweeps away luck)",
                    "Red is the color of good fortune; wear it for celebrations",
                    "Fireworks ward off the legendary Nian monster",
                    "Common greetings: 新年快乐 (xīnnián kuàilè) or 恭喜发财 (gōngxǐ fācái)",
                ],
                formal: "Traditional: family reunions and ancestral offerings are central.",
                informal: "Modern: WeChat red envelope (微信红包) exchanges among friends and family.",
            },
        ],
    },
    taiwan: {
        label: "🇹🇼 Taiwan",
        cards: [
            {
                icon: "🗣️",
                title: "Language Landscape",
                desc: "Taiwan uses Traditional Chinese characters (繁體). Mandarin is the official language, but Taiwanese Hokkien (台語) and Hakka are also widely spoken.",
                tips: [
                    "Traditional characters are used in all official and educational contexts",
                    "Bopomofo (注音符號 ㄅㄆㄇㄈ) rather than Pinyin is taught in schools",
                    "Many older Taiwanese also speak Japanese (legacy of Japanese occupation)",
                    "Taiwan-specific vocabulary: 捷運 (jiéyùn) for MRT, 機車 (jīchē) for scooter",
                ],
                formal: "Formal writing uses wenyan (文言) elements more frequently than in mainland China.",
                informal: "Colloquial speech frequently mixes Taiwanese Hokkien words with Mandarin.",
            },
            {
                icon: "🛵",
                title: "Night Markets (夜市)",
                desc: "Night markets (夜市 yèshì) are cultural hubs for food, shopping, and socializing. Shilin (士林) in Taipei is world-famous.",
                tips: [
                    "Cash is preferred at most night market stalls",
                    "Bargaining is generally not expected (prices are fixed)",
                    "Must-try: stinky tofu (臭豆腐), oyster omelette (蚵仔煎), bubble tea (珍珠奶茶)",
                    "Night markets open around 6–7 PM and run past midnight",
                ],
                formal: "Daytime dining: traditional restaurants often close between lunch and dinner.",
                informal: "Casual: convenience stores (7-Eleven, FamilyMart) serve as social hubs.",
            },
            {
                icon: "🙏",
                title: "Temples & Religion",
                desc: "Taiwan has a rich tradition of folk religion blending Buddhism, Taoism, and local deities. Temples are active community centers.",
                tips: [
                    "Remove shoes when entering some inner shrine areas",
                    "Do not point at deity statues with your finger",
                    "Incense sticks are held with both hands when offering",
                    "Major festivals: Lantern Festival (元宵), Mazu Pilgrimage, Ghost Month (中元)",
                ],
                formal: "Ghost Month (7th lunar month): avoid starting new ventures, moving, or marrying.",
                informal: "Fortune telling using divination blocks (筊杯 jiǎobēi) is common and welcoming to visitors.",
            },
        ],
    },
    hongkong: {
        label: "🇭🇰 Hong Kong & Macau",
        cards: [
            {
                icon: "🌐",
                title: "Trilingual Society",
                desc: "Hong Kong operates in Cantonese, English, and Mandarin. Traditional Chinese characters are used. Cantonese is the mother tongue of most locals.",
                tips: [
                    "Cantonese is the primary spoken language — Mandarin is a second language for most",
                    "English is co-official; government, legal, and business documents exist in both English and Chinese",
                    "Code-switching between Cantonese and English (Cantonese-English or 'Chinglish') is common",
                    "Traditional characters are used exclusively, unlike mainland China's simplified script",
                ],
                formal: "Business: English is often the default for international dealings.",
                informal: "Street Cantonese: casual particles (囉 lo, 喎 wo, 呀 aa) appear constantly in speech.",
            },
            {
                icon: "🍱",
                title: "Yum Cha (飲茶) Culture",
                desc: "Dim sum breakfast/brunch (飲茶 yám chàh) is a beloved Hong Kong tradition. Families gather at teahouses on weekend mornings.",
                tips: [
                    "Knock lightly on the table with two fingers to thank someone for pouring tea",
                    "Leave the teapot lid open when you need a refill",
                    "It is polite to pour tea for elders first",
                    "Popular dishes: har gow (蝦餃), siu mai (燒賣), char siu bao (叉燒包)",
                ],
                formal: "Traditional teahouses (茶樓) have cart-service; modern restaurants use order sheets.",
                informal: "Quick breakfast: 茶餐廳 (cha chaan teng) is the iconic Hong Kong-style diner.",
            },
            {
                icon: "🎰",
                title: "Macau — East meets West",
                desc: "Macau's unique culture blends Portuguese colonial heritage with Cantonese culture. Both Portuguese and Chinese are official languages.",
                tips: [
                    "Pastel de nata (egg tarts / 蛋撻) are Macau's most famous pastry",
                    "Macanese Creole cuisine blends Chinese, Portuguese, African, and Indian influences",
                    "Many historic buildings are UNESCO World Heritage Sites",
                    "Cantonese is the dominant daily language; Portuguese is used officially",
                ],
                formal: "Government documents and signage are in both Chinese and Portuguese.",
                informal: "Coloane village and Taipa retains traditional Macanese charm distinct from the casino strip.",
            },
        ],
    },
    overseas: {
        label: "🌏 Overseas Chinese",
        cards: [
            {
                icon: "🏘️",
                title: "Chinatowns & Diaspora",
                desc: "Overseas Chinese communities (海外华人) span every continent, maintaining cultural practices across generations.",
                tips: [
                    "Southeast Asian Chinese often speak Hokkien, Cantonese, or Hakka, not Mandarin",
                    "Many diaspora communities maintain simplified AND traditional character literacy",
                    "Chinese New Year, Qingming (tomb sweeping), and Mid-Autumn Festival are widely observed",
                    "Food is often the strongest cultural connector across generations",
                ],
                formal: "Heritage language schools (华文学校) preserve Chinese language in diaspora communities.",
                informal: "Third-generation diaspora may speak English natively but understand Cantonese or Hokkien.",
            },
            {
                icon: "🗺️",
                title: "Heritage Speakers",
                desc: "Heritage speakers grew up with Chinese at home but were formally educated in another language. Their language profile is unique.",
                tips: [
                    "Heritage speakers often have strong listening comprehension but weaker reading/writing",
                    "Mixing of Chinese with English or local languages is natural — not a failure",
                    "Traditional script literacy is common in Cantonese/Hokkien heritage communities",
                    "Heritage speakers bridge cultures and are valuable in business and diplomacy",
                ],
                formal: "Formal Chinese may feel foreign to heritage speakers — additional study helps unlock these registers.",
                informal: "Home language: often a dialect (粵語 Cantonese, 閩南語 Hokkien) rather than Mandarin.",
            },
        ],
    },
    business: {
        label: "💼 Business Etiquette",
        cards: [
            {
                icon: "📇",
                title: "Business Card Protocol",
                desc: "Business cards (名片 míngpiàn) are exchanged with both hands and a slight bow. They are treated with great respect.",
                tips: [
                    "Present your card with both hands, Chinese side facing the recipient",
                    "Receive a card with both hands; study it briefly before putting it away carefully",
                    "Never write on someone's business card",
                    "Cards are placed on the table during meetings, not stuffed in pockets immediately",
                ],
                formal: "Senior executives present cards to junior staff first. Always acknowledge the rank indicated.",
                informal: "WeChat QR code exchange has become an informal modern equivalent in mainland China.",
            },
            {
                icon: "🤝",
                title: "Negotiation & Decision Making",
                desc: "Business decisions in Chinese culture often involve group consensus (集体决策) rather than individual authority.",
                tips: [
                    "Be patient — decisions may require multiple rounds of meetings",
                    "Avoid high-pressure tactics; relationships must come before business",
                    "Silence in a meeting may indicate disagreement, not agreement",
                    "Contracts are often seen as starting points for ongoing negotiation",
                ],
                formal: "Formal presentations: emphasize mutual benefit, long-term cooperation, and shared values.",
                informal: "Karaoke (KTV) or banquets are often where real business relationships are cemented.",
            },
            {
                icon: "💰",
                title: "Numbers & Lucky Symbols",
                desc: "Numbers carry cultural significance in Chinese business contexts.",
                tips: [
                    "8 (八 bā) sounds like 发 (fā, prosperity) — highly auspicious, especially in phone numbers and prices",
                    "4 (四 sì) sounds like 死 (sǐ, death) — often avoided in floors, room numbers, pricing",
                    "6 (六 liù) symbolizes smooth progress; 9 (九 jiǔ) symbolizes longevity",
                    "Red is the color of good fortune; gold represents wealth",
                ],
                formal: "Major business announcements are often timed to dates with auspicious numbers.",
                informal: "Personal: license plates and phone numbers with many 8s command premium prices at auction.",
            },
        ],
    },
    social: {
        label: "🎭 Social Customs",
        cards: [
            {
                icon: "🙇",
                title: "Greetings & Forms of Address",
                desc: "Chinese greetings vary significantly by region and relationship. The most universal is 你好 (nǐ hǎo).",
                tips: [
                    "Use titles + surname for formal settings: 王老师 (Teacher Wang), 李经理 (Manager Li)",
                    "Asking about someone's age, salary, or marital status is not considered rude",
                    "Physical greetings: handshakes are common in formal settings; hugs are less so",
                    "Senior/elder members of a group are greeted first",
                ],
                formal: "Formal: use 您 (nín) instead of 你 (nǐ) with elders and superiors.",
                informal: "Close friends: lǎo (老) + surname for peers, xiǎo (小) + surname for younger friends.",
            },
            {
                icon: "📱",
                title: "Digital Communication",
                desc: "WeChat (微信 Wēixìn) is the dominant communication platform in China — messaging, payments, mini-programs, and more.",
                tips: [
                    "Voice messages (语音消息) are widely preferred over text messages in China",
                    "WeChat Pay (微信支付) and Alipay (支付宝) are ubiquitous; cash is rarely needed",
                    "Group chats (群 qún) are used for families, work teams, and communities",
                    "Replying promptly to messages is expected in professional contexts",
                ],
                formal: "Business: WeChat work groups (企业微信) are standard for internal communication.",
                informal: "Personal: WeChat Moments (朋友圈) is like a personal newsfeed for close contacts.",
            },
            {
                icon: "🏥",
                title: "Health & Wellness Concepts",
                desc: "Traditional Chinese Medicine (中医 zhōngyī) concepts influence everyday wellness language and customs.",
                tips: [
                    "上火 (shànghuǒ, internal heat) is blamed for sore throats, acne, and irritability",
                    "Eating warm foods and drinks is considered healthier than cold (especially for women)",
                    "Qi (气 qì) or vital energy underlies TCM diagnosis",
                    "Congee (粥 zhōu) is the go-to food for illness and recovery",
                ],
                formal: "Hospital settings: doctors often prescribe both Western and Chinese medicine in China.",
                informal: "Everyday: 保温杯 (insulated flask) culture — adults carry hot water everywhere.",
            },
        ],
    },
};

function renderCulturePage() {
    // Build tabs
    const tabsContainer = document.getElementById("culture-tabs");
    const panelsContainer = document.getElementById("culture-panels");
    if (!tabsContainer || !panelsContainer) return;

    const keys = Object.keys(CULTURE_DATA);
    tabsContainer.innerHTML = keys.map((key, i) =>
        `<button class="culture-tab-btn${i === 0 ? " active" : ""}" data-tab="${key}">
            ${CULTURE_DATA[key].label}
        </button>`
    ).join("");

    panelsContainer.innerHTML = keys.map((key, i) => {
        const section = CULTURE_DATA[key];
        const cardsHtml = section.cards.map((c) =>
            `<div class="culture-card">
                <div class="culture-card-icon">${c.icon}</div>
                <h3>${c.title}</h3>
                <p>${c.desc}</p>
                <ul class="culture-tips">
                    ${c.tips.map((t) => `<li>${t}</li>`).join("")}
                </ul>
                <div class="formal-informal">
                    <strong>Formal:</strong> ${c.formal}
                    <strong style="margin-top:4px;display:block">Informal:</strong> ${c.informal}
                </div>
            </div>`
        ).join("");

        return `<div class="culture-panel${i === 0 ? " active" : ""}" id="panel-${key}">
            <div class="culture-cards-grid">${cardsHtml}</div>
        </div>`;
    }).join("");

    // Tab switching
    tabsContainer.querySelectorAll(".culture-tab-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
            tabsContainer.querySelectorAll(".culture-tab-btn").forEach((b) => b.classList.remove("active"));
            panelsContainer.querySelectorAll(".culture-panel").forEach((p) => p.classList.remove("active"));
            btn.classList.add("active");
            document.getElementById(`panel-${btn.dataset.tab}`)?.classList.add("active");
        });
    });
}

document.addEventListener("DOMContentLoaded", () => {
    renderCulturePage();
    const stored = localStorage.getItem("darkMode");
    if (stored === "true") document.documentElement.setAttribute("data-theme", "dark");
    if (localStorage.getItem("highContrast") === "true")
        document.documentElement.classList.add("high-contrast");
});
