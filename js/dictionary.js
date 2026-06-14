/**
 * In-app vocabulary dictionary
 */

const DICTIONARY = [
    // HSK 1
    { zh: "你好", pinyin: "nǐ hǎo", en: "hello / how do you do", hsk: 1, example: "你好！很高兴认识你。— Hello! Nice to meet you." },
    { zh: "谢谢", pinyin: "xièxiè", en: "thank you", hsk: 1, example: "谢谢你的帮助。— Thank you for your help." },
    { zh: "对不起", pinyin: "duìbuqǐ", en: "sorry / excuse me", hsk: 1, example: "对不起，我迟到了。— Sorry, I'm late." },
    { zh: "没关系", pinyin: "méiguānxi", en: "it doesn't matter / never mind", hsk: 1, example: "没关系，请坐。— Never mind, please sit down." },
    { zh: "是", pinyin: "shì", en: "to be / is / yes", hsk: 1, example: "我是学生。— I am a student." },
    { zh: "不", pinyin: "bù", en: "no / not", hsk: 1, example: "我不喜欢。— I don't like it." },
    { zh: "我", pinyin: "wǒ", en: "I / me", hsk: 1, example: "我是中国人。— I am Chinese." },
    { zh: "你", pinyin: "nǐ", en: "you (singular)", hsk: 1, example: "你叫什么名字？— What is your name?" },
    { zh: "他", pinyin: "tā", en: "he / him", hsk: 1, example: "他是我的朋友。— He is my friend." },
    { zh: "她", pinyin: "tā", en: "she / her", hsk: 1, example: "她很漂亮。— She is beautiful." },
    { zh: "我们", pinyin: "wǒmen", en: "we / us", hsk: 1, example: "我们一起去吧。— Let's go together." },
    { zh: "什么", pinyin: "shénme", en: "what", hsk: 1, example: "这是什么？— What is this?" },
    { zh: "哪", pinyin: "nǎ", en: "which / where", hsk: 1, example: "你在哪里？— Where are you?" },
    { zh: "好", pinyin: "hǎo", en: "good / well / fine", hsk: 1, example: "今天天气很好。— The weather is very good today." },
    { zh: "大", pinyin: "dà", en: "big / large", hsk: 1, example: "那座楼很大。— That building is very big." },
    { zh: "小", pinyin: "xiǎo", en: "small / little", hsk: 1, example: "这个包太小了。— This bag is too small." },
    { zh: "多", pinyin: "duō", en: "many / much / a lot", hsk: 1, example: "这里人很多。— There are many people here." },
    { zh: "少", pinyin: "shǎo", en: "few / little / less", hsk: 1, example: "这里人很少。— There are few people here." },
    { zh: "来", pinyin: "lái", en: "to come", hsk: 1, example: "请进来。— Please come in." },
    { zh: "去", pinyin: "qù", en: "to go", hsk: 1, example: "我去图书馆。— I am going to the library." },
    { zh: "吃", pinyin: "chī", en: "to eat", hsk: 1, example: "你吃饭了吗？— Have you eaten?" },
    { zh: "喝", pinyin: "hē", en: "to drink", hsk: 1, example: "我喝茶。— I drink tea." },
    { zh: "水", pinyin: "shuǐ", en: "water", hsk: 1, example: "请给我一杯水。— Please give me a glass of water." },
    { zh: "饭", pinyin: "fàn", en: "meal / cooked rice", hsk: 1, example: "晚饭很好吃。— Dinner is delicious." },
    { zh: "人", pinyin: "rén", en: "person / people", hsk: 1, example: "中国人很友好。— Chinese people are very friendly." },
    // HSK 2
    { zh: "但是", pinyin: "dànshì", en: "but / however", hsk: 2, example: "我很累，但是我还要工作。— I'm tired, but I still have to work." },
    { zh: "因为", pinyin: "yīnwèi", en: "because", hsk: 2, example: "因为下雨，我没去。— Because it rained, I didn't go." },
    { zh: "所以", pinyin: "suǒyǐ", en: "therefore / so", hsk: 2, example: "他生病了，所以没来。— He was sick, so he didn't come." },
    { zh: "如果", pinyin: "rúguǒ", en: "if", hsk: 2, example: "如果明天晴天，我们去公园。— If it's sunny tomorrow, let's go to the park." },
    { zh: "已经", pinyin: "yǐjīng", en: "already", hsk: 2, example: "我已经吃了。— I have already eaten." },
    { zh: "还是", pinyin: "háishì", en: "or (in questions) / still", hsk: 2, example: "你喝茶还是咖啡？— Do you drink tea or coffee?" },
    { zh: "只", pinyin: "zhǐ", en: "only / just", hsk: 2, example: "我只有一本书。— I have only one book." },
    { zh: "一起", pinyin: "yīqǐ", en: "together", hsk: 2, example: "我们一起走吧。— Let's walk together." },
    { zh: "知道", pinyin: "zhīdào", en: "to know", hsk: 2, example: "你知道吗？— Do you know?" },
    { zh: "觉得", pinyin: "juéde", en: "to feel / to think", hsk: 2, example: "我觉得这个很好。— I think this is very good." },
    { zh: "想", pinyin: "xiǎng", en: "to want / to think / to miss", hsk: 2, example: "我想学中文。— I want to learn Chinese." },
    { zh: "帮助", pinyin: "bāngzhù", en: "to help / help", hsk: 2, example: "谢谢你的帮助。— Thank you for your help." },
    { zh: "快", pinyin: "kuài", en: "fast / quick", hsk: 2, example: "请快一点。— Please hurry up a bit." },
    { zh: "慢", pinyin: "màn", en: "slow / slowly", hsk: 2, example: "请说慢一点。— Please speak more slowly." },
    // HSK 3
    { zh: "虽然", pinyin: "suīrán", en: "although / even though", hsk: 3, example: "虽然很难，但是我会努力。— Although it's difficult, I will work hard." },
    { zh: "而且", pinyin: "érqiě", en: "furthermore / moreover", hsk: 3, example: "他聪明，而且勤奋。— He is smart, and moreover hardworking." },
    { zh: "根据", pinyin: "gēnjù", en: "according to / based on", hsk: 3, example: "根据天气预报，明天会下雨。— According to the forecast, it will rain tomorrow." },
    { zh: "通过", pinyin: "tōngguò", en: "through / by means of / to pass", hsk: 3, example: "通过努力，他成功了。— Through hard work, he succeeded." },
    { zh: "关系", pinyin: "guānxi", en: "relationship / connection", hsk: 3, example: "我们的关系很好。— Our relationship is very good." },
    { zh: "感觉", pinyin: "gǎnjué", en: "feeling / sense / to feel", hsk: 3, example: "我感觉很好。— I feel very good." },
    { zh: "同意", pinyin: "tóngyì", en: "to agree / to approve", hsk: 3, example: "我同意你的意见。— I agree with your opinion." },
    { zh: "经验", pinyin: "jīngyàn", en: "experience", hsk: 3, example: "他有丰富的工作经验。— He has rich work experience." },
    { zh: "方法", pinyin: "fāngfǎ", en: "method / way / means", hsk: 3, example: "这个方法很有效。— This method is very effective." },
    { zh: "发展", pinyin: "fāzhǎn", en: "to develop / development", hsk: 3, example: "中国经济快速发展。— China's economy is developing rapidly." },
    // HSK 4
    { zh: "尽管", pinyin: "jǐnguǎn", en: "despite / even though", hsk: 4, example: "尽管困难重重，他还是坚持了下来。— Despite many difficulties, he persisted." },
    { zh: "况且", pinyin: "kuàngqiě", en: "moreover / besides", hsk: 4, example: "这太贵了，况且我也不需要。— This is too expensive, and besides I don't need it." },
    { zh: "逐渐", pinyin: "zhújiàn", en: "gradually / step by step", hsk: 4, example: "她的中文逐渐进步了。— Her Chinese gradually improved." },
    { zh: "促进", pinyin: "cùjìn", en: "to promote / to accelerate", hsk: 4, example: "这个政策促进了经济发展。— This policy promoted economic development." },
    { zh: "具体", pinyin: "jùtǐ", en: "concrete / specific", hsk: 4, example: "请给我一个具体的例子。— Please give me a specific example." },
    // HSK 5
    { zh: "尽管如此", pinyin: "jǐnguǎn rúcǐ", en: "even so / nevertheless", hsk: 5, example: "尽管如此，我们仍然坚持。— Even so, we persist." },
    { zh: "纵然", pinyin: "zòngran", en: "even if / even though (formal)", hsk: 5, example: "纵然失败，也不气馁。— Even if we fail, we won't be discouraged." },
    { zh: "确实", pinyin: "quèshí", en: "indeed / certainly / really", hsk: 5, example: "这个问题确实很复杂。— This issue is indeed very complex." },
    // HSK 6
    { zh: "鉴于", pinyin: "jiànyú", en: "in view of / considering", hsk: 6, example: "鉴于以上情况，我们决定推迟。— In view of the above, we decided to postpone." },
    { zh: "缘故", pinyin: "yuángù", en: "reason / cause", hsk: 6, example: "正是由于这个缘故。— It is precisely for this reason." },
    // Common phrases
    { zh: "请问", pinyin: "qǐngwèn", en: "may I ask / excuse me (for a question)", hsk: 1, example: "请问，厕所在哪里？— Excuse me, where is the restroom?" },
    { zh: "没有", pinyin: "méiyǒu", en: "don't have / there isn't / no", hsk: 1, example: "我没有钱。— I don't have money." },
    { zh: "喜欢", pinyin: "xǐhuān", en: "to like / to enjoy", hsk: 1, example: "我喜欢中国菜。— I like Chinese food." },
    { zh: "朋友", pinyin: "péngyou", en: "friend", hsk: 1, example: "他是我最好的朋友。— He is my best friend." },
    { zh: "学习", pinyin: "xuéxí", en: "to study / to learn", hsk: 1, example: "我在学习中文。— I am studying Chinese." },
    { zh: "工作", pinyin: "gōngzuò", en: "work / job / to work", hsk: 2, example: "他的工作很忙。— His work is very busy." },
    { zh: "学校", pinyin: "xuéxiào", en: "school", hsk: 1, example: "这所学校很有名。— This school is very famous." },
    { zh: "医院", pinyin: "yīyuàn", en: "hospital", hsk: 2, example: "医院在哪里？— Where is the hospital?" },
    { zh: "商店", pinyin: "shāngdiàn", en: "shop / store", hsk: 1, example: "那个商店卖什么？— What does that shop sell?" },
    { zh: "银行", pinyin: "yínháng", en: "bank", hsk: 2, example: "我要去银行取钱。— I need to go to the bank to withdraw money." },
    { zh: "飞机", pinyin: "fēijī", en: "airplane", hsk: 2, example: "飞机几点起飞？— What time does the plane depart?" },
    { zh: "火车", pinyin: "huǒchē", en: "train", hsk: 1, example: "我坐火车去北京。— I'm taking the train to Beijing." },
    { zh: "地铁", pinyin: "dìtiě", en: "subway / metro", hsk: 3, example: "地铁很方便。— The subway is very convenient." },
    { zh: "公共汽车", pinyin: "gōnggòng qìchē", en: "bus / public bus", hsk: 2, example: "我坐公共汽车上班。— I take the bus to work." },
    { zh: "出租车", pinyin: "chūzū chē", en: "taxi", hsk: 2, example: "请叫一辆出租车。— Please call a taxi." },
    { zh: "手机", pinyin: "shǒujī", en: "mobile phone / cell phone", hsk: 2, example: "你的手机号码是多少？— What is your phone number?" },
    { zh: "电脑", pinyin: "diànnǎo", en: "computer", hsk: 2, example: "我用电脑工作。— I use a computer for work." },
    { zh: "钱", pinyin: "qián", en: "money", hsk: 1, example: "这个多少钱？— How much is this?" },
    { zh: "时间", pinyin: "shíjiān", en: "time", hsk: 2, example: "请问现在几点？— Excuse me, what time is it now?" },
    { zh: "天气", pinyin: "tiānqì", en: "weather", hsk: 1, example: "今天天气怎么样？— What is the weather like today?" },
    { zh: "家", pinyin: "jiā", en: "home / family / house", hsk: 1, example: "我们回家吧。— Let's go home." },
    { zh: "孩子", pinyin: "háizi", en: "child / children", hsk: 2, example: "你有几个孩子？— How many children do you have?" },
    { zh: "父母", pinyin: "fùmǔ", en: "parents", hsk: 3, example: "我很爱我的父母。— I love my parents very much." },
    { zh: "医生", pinyin: "yīshēng", en: "doctor / physician", hsk: 2, example: "我需要看医生。— I need to see a doctor." },
    { zh: "老师", pinyin: "lǎoshī", en: "teacher", hsk: 1, example: "这位老师很有经验。— This teacher is very experienced." },
];

let currentFilter = 0; // 0 = all
let currentSearch = "";

function renderDictionary() {
    const container = document.getElementById("dictionary-results");
    if (!container) return;

    const query = currentSearch.toLowerCase().trim();
    let results = DICTIONARY;

    if (currentFilter > 0) {
        results = results.filter((e) => e.hsk === currentFilter);
    }

    if (query) {
        results = results.filter(
            (e) =>
                e.zh.includes(query) ||
                e.pinyin.toLowerCase().includes(query) ||
                e.en.toLowerCase().includes(query),
        );
    }

    const count = document.getElementById("dict-count");
    if (count) count.textContent = results.length;

    if (results.length === 0) {
        container.innerHTML = `<div class="dict-no-results">
            <p>No results found. Try a different search term or filter.</p>
        </div>`;
        return;
    }

    container.innerHTML = results.map((e) =>
        `<div class="dict-card">
            <span class="dict-hsk-badge">HSK ${e.hsk}</span>
            <div class="dict-char">${e.zh}</div>
            <div class="dict-pinyin">${e.pinyin}</div>
            <div class="dict-en">${e.en}</div>
            ${e.example ? `<div class="dict-example">${e.example}</div>` : ""}
            <div class="dict-actions">
                <button class="dict-btn dict-btn-copy" onclick="copyToClipboard('${e.zh}')">
                    📋 Copy
                </button>
                <button class="dict-btn dict-btn-srs" onclick="addDictEntryToSrs('${e.zh}', '${e.pinyin}', '${e.en.replace(/'/g, "\\'")}')">
                    + SRS
                </button>
            </div>
        </div>`
    ).join("");
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).catch(() => {
        const el = document.createElement("textarea");
        el.value = text;
        document.body.appendChild(el);
        el.select();
        document.execCommand("copy");
        document.body.removeChild(el);
    });
}

function addDictEntryToSrs(zh, pinyin, en) {
    if (typeof upsertSrsCard === "function") {
        upsertSrsCard({ front: zh, back: `${pinyin} — ${en}`, lang: "zh", day: null });
        alert(`Added "${zh}" to SRS!`);
    } else {
        alert("SRS not available on this page.");
    }
}

function initDictionary() {
    const searchInput = document.getElementById("dict-search");
    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            currentSearch = e.target.value;
            renderDictionary();
        });
    }

    document.querySelectorAll(".hsk-filter-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".hsk-filter-btn").forEach((b) => b.classList.remove("active"));
            btn.classList.add("active");
            currentFilter = parseInt(btn.dataset.hsk || "0", 10);
            renderDictionary();
        });
    });

    renderDictionary();
}

document.addEventListener("DOMContentLoaded", () => {
    initDictionary();
    const stored = localStorage.getItem("darkMode");
    if (stored === "true") document.documentElement.setAttribute("data-theme", "dark");
    if (localStorage.getItem("highContrast") === "true")
        document.documentElement.classList.add("high-contrast");
});
