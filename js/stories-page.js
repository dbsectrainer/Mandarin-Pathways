/**
 * Stories index: renders the 40 day cards into each stage's grid, plus the
 * reading-passage and supplementary-topic cards, decorated with completion
 * state from localStorage (completedDays / completedReadings /
 * completedSupplementary — key formats owned by the page controllers).
 */
const storiesReadingPassages = [
    {
        level: "beginner",
        topic: "Self Introduction",
        zh: "自我介绍",
        en: "Self Introduction",
        descZh: "用简单的中文做自我介绍。",
        descEn: "A simple self-introduction in Mandarin.",
    },
    {
        level: "beginner",
        topic: "Daily Routine",
        zh: "日常生活",
        en: "Daily Routine",
        descZh: "学习与日常活动相关的词汇。",
        descEn: "Learn vocabulary related to daily activities.",
    },
    {
        level: "intermediate",
        topic: "At the Restaurant",
        zh: "在餐厅",
        en: "At the Restaurant",
        descZh: "外出就餐的词汇和短语。",
        descEn: "Vocabulary and phrases for dining out.",
    },
    {
        level: "intermediate",
        topic: "Weekend Plans",
        zh: "周末计划",
        en: "Weekend Plans",
        descZh: "讨论周末活动和计划。",
        descEn: "Discussing weekend activities and plans.",
    },
    {
        level: "advanced",
        topic: "Environmental Protection",
        zh: "环境保护",
        en: "Environmental Protection",
        descZh: "与环境问题相关的高级词汇。",
        descEn: "Advanced vocabulary related to environmental issues.",
    },
];

const storiesSupplementaryTopics = [
    {
        category: "education",
        zh: "教育与学术生活",
        en: "Education & Academic Life",
        icon: "fa-graduation-cap",
    },
    {
        category: "hobbies",
        zh: "爱好与兴趣",
        en: "Hobbies & Interests",
        icon: "fa-palette",
    },
    {
        category: "emotions",
        zh: "情绪与感受",
        en: "Emotions & Feelings",
        icon: "fa-face-smile",
    },
    {
        category: "daily_life",
        zh: "天气与日常生活",
        en: "Weather & Daily Life",
        icon: "fa-cloud-sun",
    },
    {
        category: "comparisons",
        zh: "比较结构",
        en: "Comparison Structures",
        icon: "fa-scale-balanced",
    },
];

function storiesUrlLang() {
    const normalized = normalizePreferredLanguage(
        localStorage.getItem("preferredLanguage") || "zh-CN",
    );
    return normalized === "zh-CN" ? "zh" : normalized;
}

function storiesReadJson(key) {
    try {
        return JSON.parse(localStorage.getItem(key) || "{}");
    } catch (e) {
        return {};
    }
}

function storiesDoneMarkup() {
    return (
        '<i class="fas fa-circle-check story-card-done" aria-hidden="true"></i>' +
        '<span class="sr-only">Completed</span>'
    );
}

function renderStoriesDayGrids() {
    const lang = storiesUrlLang();
    const completedDays = storiesReadJson("completedDays");

    document.querySelectorAll("[data-day-grid]").forEach((grid) => {
        const section = grid.closest(".story-group");
        const start = parseInt(section.dataset.start, 10);
        const end = parseInt(section.dataset.end, 10);
        const sectionNum = section.dataset.section;

        grid.innerHTML = "";
        for (let day = start; day <= end; day++) {
            const done = Boolean(completedDays[`${day}_${lang}`]);
            const card = document.createElement("a");
            card.className = "story-card" + (done ? " completed" : "");
            card.href = `day.html?day=${day}&lang=${lang}`;
            card.innerHTML =
                '<div class="story-card-top">' +
                `<span class="level-badge badge-section-${sectionNum}">` +
                `<span class="zh">第${day}天</span><span class="en">Day ${day}</span>` +
                "</span>" +
                (done ? storiesDoneMarkup() : "") +
                "</div>" +
                "<h3>" +
                `<span class="zh">第${day}天课程</span><span class="en">Day ${day} lesson</span>` +
                "</h3>";
            grid.appendChild(card);
        }
    });
}

function renderStoriesReadingCards() {
    const lang = storiesUrlLang();
    const completedReadings = storiesReadJson("completedReadings");
    const grid = document.getElementById("reading-card-grid");
    if (!grid) return;

    const levelLabels = {
        beginner: { zh: "初级", en: "Beginner" },
        intermediate: { zh: "中级", en: "Intermediate" },
        advanced: { zh: "高级", en: "Advanced" },
    };

    grid.innerHTML = "";
    storiesReadingPassages.forEach((passage) => {
        const done = Boolean(
            completedReadings[`${passage.level}_${passage.topic}_${lang}`],
        );
        const label = levelLabels[passage.level];
        const card = document.createElement("a");
        card.className = "story-card" + (done ? " completed" : "");
        card.href =
            `reading.html?level=${passage.level}` +
            `&topic=${encodeURIComponent(passage.topic)}&lang=${lang}`;
        card.innerHTML =
            '<div class="story-card-top">' +
            '<span class="level-badge">' +
            `<span class="zh">${label.zh}</span><span class="en">${label.en}</span>` +
            "</span>" +
            (done ? storiesDoneMarkup() : "") +
            "</div>" +
            "<h3>" +
            `<span class="zh">${passage.zh}</span><span class="en">${passage.en}</span>` +
            "</h3>" +
            "<p>" +
            `<span class="zh">${passage.descZh}</span><span class="en">${passage.descEn}</span>` +
            "</p>";
        grid.appendChild(card);
    });
}

function renderStoriesSupplementaryCards() {
    const lang = storiesUrlLang();
    const completedSupplementary = storiesReadJson("completedSupplementary");
    const grid = document.getElementById("supplementary-card-grid");
    if (!grid) return;

    grid.innerHTML = "";
    storiesSupplementaryTopics.forEach((topic) => {
        const done = Boolean(
            completedSupplementary[`${topic.category}_${lang}`],
        );
        const card = document.createElement("a");
        card.className = "story-card" + (done ? " completed" : "");
        card.href = `supplementary.html?category=${topic.category}&lang=${lang}`;
        card.innerHTML =
            '<div class="story-card-top">' +
            `<i class="fas ${topic.icon}" aria-hidden="true" style="color: var(--accent-color)"></i>` +
            (done ? storiesDoneMarkup() : "") +
            "</div>" +
            "<h3>" +
            `<span class="zh">${topic.zh}</span><span class="en">${topic.en}</span>` +
            "</h3>";
        grid.appendChild(card);
    });
}

function renderStoriesPage() {
    renderStoriesDayGrids();
    renderStoriesReadingCards();
    renderStoriesSupplementaryCards();
}

document.addEventListener("DOMContentLoaded", function () {
    renderStoriesPage();

    // Re-render links/completion when the user switches language in the
    // header (lang-switcher.js updates preferredLanguage first — it is
    // loaded before this file, so its click handler runs before ours).
    document.querySelectorAll(".language-btn").forEach((btn) => {
        btn.addEventListener("click", renderStoriesPage);
    });
});
