const PLACEMENT_RESULT_KEY = "placementResult";

const placementQuestions = [
    {
        prompt: 'What does "你好" mean?',
        options: ["Hello", "Goodbye", "Thank you", "Excuse me"],
        answer: "Hello",
        band: "beginner",
    },
    {
        prompt: 'Choose the correct pinyin for "谢谢".',
        options: ["xie xie", "ni hao", "zai jian", "qing wen"],
        answer: "xie xie",
        band: "beginner",
    },
    {
        prompt: 'What does "我想要一杯水" mean?',
        options: [
            "I would like a glass of water",
            "I have a cup of tea",
            "Where is the water?",
            "This water is cold",
        ],
        answer: "I would like a glass of water",
        band: "beginner",
    },
    {
        prompt: 'Which phrase asks "How much is this?"',
        options: [
            "这个多少钱？",
            "洗手间在哪里？",
            "你叫什么名字？",
            "现在几点？",
        ],
        answer: "这个多少钱？",
        band: "beginner",
    },
    {
        prompt: 'What does "我周末想去看电影" mean?',
        options: [
            "I want to watch a movie this weekend",
            "I watched a movie yesterday",
            "I do not like movies",
            "The movie starts at noon",
        ],
        answer: "I want to watch a movie this weekend",
        band: "intermediate",
    },
    {
        prompt: 'Choose the best translation for "菜单".',
        options: ["Menu", "Receipt", "Reservation", "Restaurant"],
        answer: "Menu",
        band: "intermediate",
    },
    {
        prompt: 'Which sentence means "I have studied Chinese for two years"?',
        options: [
            "我学中文学了两年。",
            "我明年学中文。",
            "我两点学中文。",
            "我不会说中文。",
        ],
        answer: "我学中文学了两年。",
        band: "intermediate",
    },
    {
        prompt: 'What is the function of "因为...所以..."?',
        options: [
            "Cause and result",
            "Comparison",
            "Past action only",
            "A yes-or-no question",
        ],
        answer: "Cause and result",
        band: "intermediate",
    },
    {
        prompt: 'What does "环境保护" mean?',
        options: [
            "Environmental protection",
            "Weekend plan",
            "Daily routine",
            "Language exchange",
        ],
        answer: "Environmental protection",
        band: "advanced",
    },
    {
        prompt: 'Choose the best meaning of "减少浪费".',
        options: [
            "Reduce waste",
            "Increase speed",
            "Protect privacy",
            "Change schools",
        ],
        answer: "Reduce waste",
        band: "advanced",
    },
];

document.addEventListener("DOMContentLoaded", () => {
    applyStandardDocumentLang(getUrlLang("zh-CN"));

    const form = document.getElementById("placement-form");
    const resultEl = document.getElementById("placement-result");
    if (!form || !resultEl) return;

    renderPlacementQuestions(form);
    renderSavedPlacement(resultEl);

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        const result = scorePlacement(new FormData(form));
        localStorage.setItem(PLACEMENT_RESULT_KEY, JSON.stringify(result));
        renderPlacementResult(resultEl, result);
        resultEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
});

function renderPlacementQuestions(form) {
    form.innerHTML = "";

    placementQuestions.forEach((question, index) => {
        const fieldset = document.createElement("fieldset");
        fieldset.className = "phrase-section";
        fieldset.dataset.testid = `placement-question-${index + 1}`;

        const legend = document.createElement("legend");
        legend.textContent = `${index + 1}. ${question.prompt}`;
        fieldset.appendChild(legend);

        question.options.forEach((option) => {
            const label = document.createElement("label");
            label.className = "phrase-item";

            const input = document.createElement("input");
            input.type = "radio";
            input.name = `question-${index}`;
            input.value = option;
            input.required = true;

            label.appendChild(input);
            label.appendChild(document.createTextNode(` ${option}`));
            fieldset.appendChild(label);
        });

        form.appendChild(fieldset);
    });
}

function scorePlacement(formData) {
    let score = 0;
    const bandScores = { beginner: 0, intermediate: 0, advanced: 0 };

    placementQuestions.forEach((question, index) => {
        if (formData.get(`question-${index}`) === question.answer) {
            score += 1;
            bandScores[question.band] += 1;
        }
    });

    const total = placementQuestions.length;
    const percentage = Math.round((score / total) * 100);
    const recommendation = getPlacementRecommendation(score);

    return {
        score,
        total,
        percentage,
        bandScores,
        level: recommendation.level,
        recommendedDay: recommendation.day,
        message: recommendation.message,
        completedAt: new Date().toISOString(),
    };
}

function getPlacementRecommendation(score) {
    if (score <= 3) {
        return {
            level: "Beginner",
            day: 1,
            message: {
                zh: "从基础开始，每天建立信心。",
                en: "Start with the foundations and build daily confidence.",
            },
        };
    }

    if (score <= 6) {
        return {
            level: "Upper beginner",
            day: 8,
            message: {
                zh: "从第一周后开始学习，并根据需要复习前面的课程。",
                en: "Begin after the first week and review earlier lessons as needed.",
            },
        };
    }

    if (score <= 8) {
        return {
            level: "Intermediate",
            day: 16,
            message: {
                zh: "从实用句型和较长对话开始。",
                en: "Start with practical sentence patterns and longer exchanges.",
            },
        };
    }

    return {
        level: "Advanced",
        day: 31,
        message: {
            zh: "进入更长的话题，并用测验进行复习。",
            en: "Move into longer topics while using quizzes for review.",
        },
    };
}

const PLACEMENT_LEVEL_ZH = {
    Beginner: "初级",
    "Upper beginner": "中初级",
    Intermediate: "中级",
    Advanced: "高级",
};

function placementMessageHtml(message) {
    if (message && typeof message === "object" && message.zh && message.en) {
        return localizedTextHtml(message);
    }
    return `<span class="en">${String(message || "")}</span>`;
}

function renderSavedPlacement(resultEl) {
    try {
        const saved = JSON.parse(localStorage.getItem(PLACEMENT_RESULT_KEY));
        if (saved && Number.isFinite(saved.recommendedDay)) {
            renderPlacementResult(resultEl, saved);
        }
    } catch {
        localStorage.removeItem(PLACEMENT_RESULT_KEY);
    }
}

function renderPlacementResult(resultEl, result) {
    resultEl.hidden = false;
    resultEl.innerHTML = "";

    const heading = document.createElement("h2");
    heading.innerHTML = localizedTextHtml({
        zh: `建议起点：第 ${result.recommendedDay} 天`,
        en: `Recommended start: Day ${result.recommendedDay}`,
    });

    const score = document.createElement("p");
    const levelZh = PLACEMENT_LEVEL_ZH[result.level] || result.level;
    score.innerHTML = localizedTextHtml({
        zh: `得分：${result.score}/${result.total}（${result.percentage}%）— ${levelZh}`,
        en: `Score: ${result.score}/${result.total} (${result.percentage}%) - ${result.level}`,
    });

    const message = document.createElement("p");
    message.innerHTML = placementMessageHtml(result.message);

    const actions = document.createElement("div");
    actions.className = "lesson-actions";

    const link = document.createElement("a");
    link.className = "home-btn";
    link.href = `day.html?day=${encodeURIComponent(result.recommendedDay)}&lang=zh`;
    link.dataset.testid = "placement-start-link";
    const playIcon = document.createElement("i");
    playIcon.className = "fas fa-play";
    link.appendChild(playIcon);
    const zhSpan = document.createElement("span");
    zhSpan.className = "zh";
    zhSpan.textContent = ` 开始第${result.recommendedDay}天`;
    const enSpan = document.createElement("span");
    enSpan.className = "en";
    enSpan.textContent = ` Start at Day ${result.recommendedDay}`;
    link.appendChild(zhSpan);
    link.appendChild(enSpan);

    const retake = document.createElement("button");
    retake.type = "button";
    retake.className = "nav-btn";
    retake.innerHTML =
        '<i class="fas fa-redo"></i> <span class="zh">重新测试</span><span class="en">Retake test</span>';
    retake.addEventListener("click", () => {
        resultEl.hidden = true;
        resultEl.innerHTML = "";
        const form = document.getElementById("placement-form");
        if (form) {
            form.reset();
            form.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    });

    actions.appendChild(link);
    actions.appendChild(retake);

    resultEl.appendChild(heading);
    resultEl.appendChild(score);
    resultEl.appendChild(message);
    resultEl.appendChild(actions);
}
