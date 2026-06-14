/**
 * Grammar instruction page logic
 */

const GRAMMAR_DATA = [
    {
        cefr: "A1",
        cefrCls: "cefr-a1",
        topics: [
            {
                id: "g_a1_1",
                pattern: "Subject + 是 + Noun  (to be)",
                zh: "我是学生。",
                pinyin: "Wǒ shì xuéshēng.",
                en: "I am a student.",
                note: "是 (shì) connects nouns as a copula. It is NOT used with adjectives — use 很 (hěn) instead.",
            },
            {
                id: "g_a1_2",
                pattern: "Subject + 有 + Object  (to have / there is)",
                zh: "我有一本书。",
                pinyin: "Wǒ yǒu yī běn shū.",
                en: "I have a book.",
                note: "有 (yǒu) expresses possession and existence. 没有 (méiyǒu) is the negation.",
            },
            {
                id: "g_a1_3",
                pattern: "Measure words: Number + 量词 + Noun",
                zh: "两张纸，三本书，一杯水",
                pinyin: "liǎng zhāng zhǐ, sān běn shū, yī bēi shuǐ",
                en: "two sheets of paper, three books, one cup of water",
                note: "Every Chinese noun requires a measure word (量词) between the number and the noun. 个 (gè) is the most versatile all-purpose measure word.",
            },
            {
                id: "g_a1_4",
                pattern: "Basic negation: 不 + Verb/Adjective",
                zh: "我不喜欢咖啡。",
                pinyin: "Wǒ bù xǐhuān kāfēi.",
                en: "I don't like coffee.",
                note: "不 (bù) negates most verbs and adjectives. Exception: use 没 (méi) to negate 有 and past completed actions.",
            },
            {
                id: "g_a1_5",
                pattern: "Yes/No questions: Sentence + 吗?",
                zh: "你是中国人吗？",
                pinyin: "Nǐ shì Zhōngguórén ma?",
                en: "Are you Chinese?",
                note: "Add 吗 (ma) to the end of any statement to form a yes/no question. No word order change needed.",
            },
        ],
    },
    {
        cefr: "A2",
        cefrCls: "cefr-a2",
        topics: [
            {
                id: "g_a2_1",
                pattern: "Completed action: Verb + 了",
                zh: "我吃了饭。",
                pinyin: "Wǒ chī le fàn.",
                en: "I ate. / I have eaten.",
                note: "了 (le) after a verb marks a completed action. It is NOT a simple past tense — it indicates completion.",
            },
            {
                id: "g_a2_2",
                pattern: "Experiential aspect: Verb + 过",
                zh: "我去过北京。",
                pinyin: "Wǒ qù guò Běijīng.",
                en: "I have been to Beijing (at some point in my life).",
                note: "过 (guò) marks an experience that happened at some unspecified time in the past. Contrast with 了 which marks recent completion.",
            },
            {
                id: "g_a2_3",
                pattern: "Ongoing action: 正在 + Verb + 着",
                zh: "他正在学习着。",
                pinyin: "Tā zhèngzài xuéxí zhe.",
                en: "He is currently studying.",
                note: "正在 indicates an action in progress right now. 着 adds a sense of continuity. They can be used together or separately.",
            },
            {
                id: "g_a2_4",
                pattern: "Time expressions: Time word + Subject + Verb",
                zh: "明天我去北京。",
                pinyin: "Míngtiān wǒ qù Běijīng.",
                en: "Tomorrow I am going to Beijing.",
                note: "In Chinese, time words come BEFORE the verb or at the beginning of the sentence, never at the end like in English.",
            },
            {
                id: "g_a2_5",
                pattern: "Degree complement: Verb + 得 + Adjective",
                zh: "她说得很好。",
                pinyin: "Tā shuō de hěn hǎo.",
                en: "She speaks very well.",
                note: "得 (de) connects a verb to a description of how the action is performed. The verb may be repeated when it has an object.",
            },
        ],
    },
    {
        cefr: "B1",
        cefrCls: "cefr-b1",
        topics: [
            {
                id: "g_b1_1",
                pattern: "Disposal: 把 + Object + Verb + Result",
                zh: "请把书放在桌上。",
                pinyin: "Qǐng bǎ shū fàng zài zhuō shàng.",
                en: "Please put the book on the table.",
                note: "把 (bǎ) construction highlights what happens to a known/specific object. The verb must be followed by a result or complement.",
            },
            {
                id: "g_b1_2",
                pattern: "Passive: Subject + 被 + Agent + Verb",
                zh: "蛋糕被我吃了。",
                pinyin: "Dàngāo bèi wǒ chī le.",
                en: "The cake was eaten by me.",
                note: "被 (bèi) marks the passive voice. In formal and written Chinese, passive sentences often carry a negative or undesirable connotation.",
            },
            {
                id: "g_b1_3",
                pattern: "Relative clause: [Modifier + 的] + Noun",
                zh: "昨天买的书很有意思。",
                pinyin: "Zuótiān mǎi de shū hěn yǒuyìsi.",
                en: "The book I bought yesterday is very interesting.",
                note: "Relative clauses in Chinese come BEFORE the noun they modify, connected by 的. This is the opposite of English.",
            },
            {
                id: "g_b1_4",
                pattern: "Comparison: A + 比 + B + Adjective",
                zh: "北京比上海冷。",
                pinyin: "Běijīng bǐ Shànghǎi lěng.",
                en: "Beijing is colder than Shanghai.",
                note: "比 (bǐ) structures comparisons. Do NOT use 更 (gèng) with 比 — just use the adjective directly after the compared element.",
            },
        ],
    },
    {
        cefr: "B2",
        cefrCls: "cefr-b2",
        topics: [
            {
                id: "g_b2_1",
                pattern: "4-character idioms (成语 chéngyǔ)",
                zh: "半途而废 — 马到成功",
                pinyin: "bàntú'érfèi — mǎdào chénggōng",
                en: "Give up halfway — Succeed immediately upon arrival",
                note: "成语 are four-character idioms with classical origins. Mastering common ones elevates written and formal Chinese significantly.",
            },
            {
                id: "g_b2_2",
                pattern: "Concession: 虽然…但是… (although…but…)",
                zh: "虽然天气很冷，但是我还是去跑步了。",
                pinyin: "Suīrán tiānqì hěn lěng, dànshì wǒ háishi qù pǎobù le.",
                en: "Although the weather was cold, I still went for a run.",
                note: "Chinese concession requires both 虽然 AND 但是/可是/却. You cannot use only one of them as in English.",
            },
            {
                id: "g_b2_3",
                pattern: "Causal: 因为…所以… (because…therefore…)",
                zh: "因为他努力学习，所以他考试很好。",
                pinyin: "Yīnwèi tā nǔlì xuéxí, suǒyǐ tā kǎoshì hěn hǎo.",
                en: "Because he studied hard, he did well on the exam.",
                note: "Like 虽然/但是, this pattern typically uses both conjunctions. Dropping 所以 is more acceptable in spoken Chinese.",
            },
        ],
    },
    {
        cefr: "C1",
        cefrCls: "cefr-c1",
        topics: [
            {
                id: "g_c1_1",
                pattern: "Classical patterns: 之乎者也",
                zh: "学而时习之，不亦说乎？",
                pinyin: "Xué ér shí xí zhī, bù yì yuè hū?",
                en: "Is it not pleasant to learn with a constant perseverance and application? (Confucius, Analects I.1)",
                note: "Classical Chinese (文言文) uses particles 之、乎、者、也 extensively. Exposure builds cultural literacy and strengthens formal writing.",
            },
            {
                id: "g_c1_2",
                pattern: "Formal written structures: 对于…来说",
                zh: "对于语言学习者来说，坚持很重要。",
                pinyin: "Duìyú yǔyán xuéxízhě lái shuō, jiānchí hěn zhòngyào.",
                en: "For language learners, persistence is very important.",
                note: "对于…来说 introduces a perspective or topic in formal writing. Common in essays, reports, and academic Chinese.",
            },
        ],
    },
];

const GRAMMAR_PROGRESS_KEY = "grammarProgress";

function getGrammarProgress() {
    try {
        return JSON.parse(localStorage.getItem(GRAMMAR_PROGRESS_KEY) || "{}");
    } catch {
        return {};
    }
}

function setGrammarProgress(id, done) {
    const prog = getGrammarProgress();
    prog[id] = done;
    localStorage.setItem(GRAMMAR_PROGRESS_KEY, JSON.stringify(prog));
}

function renderGrammarPage() {
    const container = document.getElementById("grammar-container");
    if (!container) return;

    const progress = getGrammarProgress();
    const allIds = GRAMMAR_DATA.flatMap((s) => s.topics.map((t) => t.id));
    const completedCount = allIds.filter((id) => progress[id]).length;
    const total = allIds.length;
    const pct = total ? Math.round((completedCount / total) * 100) : 0;

    const progressBar = document.getElementById("grammar-progress-bar");
    if (progressBar) progressBar.style.width = pct + "%";

    const progressLabel = document.getElementById("grammar-progress-label");
    if (progressLabel) progressLabel.textContent = `${completedCount}/${total} completed`;

    container.innerHTML = GRAMMAR_DATA.map((section) => {
        const topicsHtml = section.topics.map((t) => {
            const done = progress[t.id];
            return `<div class="grammar-card${done ? " completed" : ""}" id="card-${t.id}">
                <div class="grammar-card-header">
                    <span class="grammar-pattern">${t.pattern}</span>
                    <span>${done ? "✅" : "▶"}</span>
                </div>
                <div class="grammar-card-body">
                    <div class="grammar-example">
                        <div class="grammar-zh">${t.zh}</div>
                        <div class="grammar-pinyin">${t.pinyin}</div>
                        <div class="grammar-en">${t.en}</div>
                    </div>
                    <div class="grammar-note">💡 ${t.note}</div>
                    <button class="grammar-complete-btn" data-id="${t.id}" onclick="markGrammarDone('${t.id}')">
                        ${done ? "✅ Completed" : "Mark as learned"}
                    </button>
                </div>
            </div>`;
        }).join("");

        return `<div class="grammar-section">
            <div class="grammar-section-header" onclick="toggleSection(this)">
                <h2>${section.cefr} Level Grammar</h2>
                <span class="grammar-cefr-badge ${section.cefrCls}">${section.cefr}</span>
                <span style="margin-left:auto;">▼</span>
            </div>
            <div class="grammar-topics">${topicsHtml}</div>
        </div>`;
    }).join("");

    // Attach toggle handlers
    container.querySelectorAll(".grammar-card").forEach((card) => {
        card.querySelector(".grammar-card-header").addEventListener("click", () => {
            card.classList.toggle("open");
        });
    });
}

function markGrammarDone(id) {
    const prog = getGrammarProgress();
    prog[id] = !prog[id];
    localStorage.setItem(GRAMMAR_PROGRESS_KEY, JSON.stringify(prog));
    renderGrammarPage();
    if (typeof awardXp === "function") awardXp("reading");
}

function toggleSection(header) {
    const topics = header.nextElementSibling;
    if (topics) {
        topics.style.display = topics.style.display === "none" ? "" : "none";
    }
}

document.addEventListener("DOMContentLoaded", () => {
    renderGrammarPage();
    // dark mode
    const stored = localStorage.getItem("darkMode");
    if (stored === "true") document.documentElement.setAttribute("data-theme", "dark");
    if (localStorage.getItem("highContrast") === "true")
        document.documentElement.classList.add("high-contrast");
});
