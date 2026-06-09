const QUIZ_SCORES_KEY = "quizScores";

const quizBank = {
    1: {
        title: "Greetings and introductions",
        questions: [
            {
                type: "multiple-choice",
                prompt: 'What does "你好吗？" mean?',
                options: [
                    "How are you?",
                    "What is your name?",
                    "Where are you?",
                    "Goodbye",
                ],
                answer: "How are you?",
            },
            {
                type: "multiple-choice",
                prompt: 'Choose the correct pinyin for "再见".',
                options: ["zai jian", "xie xie", "qing wen", "ming tian"],
                answer: "zai jian",
            },
            {
                type: "fill-in",
                prompt: 'Fill in the Mandarin for "I": ___',
                answer: "我",
            },
        ],
    },
    8: {
        title: "Daily routine",
        questions: [
            {
                type: "multiple-choice",
                prompt: 'What does "早上" mean?',
                options: ["Morning", "Afternoon", "Evening", "Weekend"],
                answer: "Morning",
            },
            {
                type: "multiple-choice",
                prompt: 'Choose the phrase for "eat breakfast".',
                options: ["吃早饭", "看电影", "去学校", "买东西"],
                answer: "吃早饭",
            },
            {
                type: "fill-in",
                prompt: 'Fill in the English meaning of "睡觉": ___',
                answer: "sleep",
            },
        ],
    },
    16: {
        title: "Restaurants and plans",
        questions: [
            {
                type: "multiple-choice",
                prompt: 'What does "服务员" mean?',
                options: ["Server", "Teacher", "Friend", "Driver"],
                answer: "Server",
            },
            {
                type: "multiple-choice",
                prompt: 'Which phrase means "I would like to order"?',
                options: ["我想点菜", "我想回家", "我会说中文", "我喜欢周末"],
                answer: "我想点菜",
            },
            {
                type: "fill-in",
                prompt: 'Fill in the English meaning of "周末": ___',
                answer: "weekend",
            },
        ],
    },
    31: {
        title: "Longer topics",
        questions: [
            {
                type: "multiple-choice",
                prompt: 'What does "环境" mean?',
                options: ["Environment", "Homework", "Breakfast", "Ticket"],
                answer: "Environment",
            },
            {
                type: "multiple-choice",
                prompt: 'Choose the best translation for "保护".',
                options: ["Protect", "Compare", "Reserve", "Arrive"],
                answer: "Protect",
            },
            {
                type: "fill-in",
                prompt: 'Fill in the English meaning of "浪费": ___',
                answer: "waste",
            },
        ],
    },
};

function getQuizForDay(day) {
    if (quizBank[day]) return quizBank[day];

    const band =
        day <= 7
            ? quizBank[1]
            : day <= 15
              ? quizBank[8]
              : day <= 30
                ? quizBank[16]
                : quizBank[31];

    return {
        title: `Day ${day} review`,
        questions: band.questions,
    };
}

document.addEventListener("DOMContentLoaded", () => {
    applyStandardDocumentLang(getUrlLang("zh-CN"));

    const dayButtons = document.getElementById("quiz-day-buttons");
    const form = document.getElementById("quiz-form");
    const resultEl = document.getElementById("quiz-result");
    if (!dayButtons || !form || !resultEl) return;

    const urlParams = new URLSearchParams(window.location.search);
    const requestedDay = parseInt(urlParams.get("day"), 10);
    const activeDay =
        Number.isFinite(requestedDay) && requestedDay >= 1 && requestedDay <= 40
            ? requestedDay
            : 1;

    renderDayButtons(dayButtons, activeDay);
    renderQuiz(form, activeDay);
    renderSavedQuizScore(resultEl, activeDay);

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        const result = scoreQuiz(activeDay, new FormData(form));
        saveQuizScore(result);
        renderQuizResult(resultEl, result);
        resultEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
});

function renderDayButtons(container, activeDay) {
    container.innerHTML = "";

    [1, 8, 16, 31].forEach((day) => {
        const link = document.createElement("a");
        link.className = "level-btn";
        if (day === activeDay) link.classList.add("active");
        link.href = `quiz.html?day=${day}`;
        link.textContent = `Day ${day}`;
        link.dataset.testid = `quiz-day-${day}`;
        container.appendChild(link);
    });
}

function renderQuiz(form, day) {
    const quiz = getQuizForDay(day);
    form.innerHTML = "";

    const heading = document.createElement("h3");
    heading.textContent = `Day ${day}: ${quiz.title}`;
    form.appendChild(heading);

    quiz.questions.forEach((question, index) => {
        const fieldset = document.createElement("fieldset");
        fieldset.className = "phrase-section";
        fieldset.dataset.testid = `quiz-question-${index + 1}`;

        const legend = document.createElement("legend");
        legend.textContent = `${index + 1}. ${question.prompt}`;
        fieldset.appendChild(legend);

        if (question.type === "multiple-choice") {
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
        } else {
            const label = document.createElement("label");
            label.className = "phrase-item";
            label.innerHTML = localizedTextHtml({
                zh: "答案 ",
                en: "Answer ",
            });

            const input = document.createElement("input");
            input.type = "text";
            input.name = `question-${index}`;
            input.required = true;
            input.autocomplete = "off";
            input.dataset.testid = `quiz-fill-${index + 1}`;

            label.appendChild(input);
            fieldset.appendChild(label);
        }

        form.appendChild(fieldset);
    });
}

function scoreQuiz(day, formData) {
    const quiz = getQuizForDay(day);
    let score = 0;

    quiz.questions.forEach((question, index) => {
        const submitted = normalizeAnswer(formData.get(`question-${index}`));
        const answer = normalizeAnswer(question.answer);
        if (submitted === answer) {
            score += 1;
        }
    });

    const total = quiz.questions.length;
    return {
        day,
        title: quiz.title,
        score,
        total,
        percentage: Math.round((score / total) * 100),
        completedAt: new Date().toISOString(),
    };
}

function normalizeAnswer(value) {
    return String(value || "")
        .trim()
        .toLowerCase();
}

function getQuizScores() {
    try {
        const parsed = JSON.parse(localStorage.getItem(QUIZ_SCORES_KEY));
        return parsed && typeof parsed === "object" && !Array.isArray(parsed)
            ? parsed
            : {};
    } catch {
        return {};
    }
}

function saveQuizScore(result) {
    const scores = getQuizScores();
    const key = `day${result.day}`;
    const previous = scores[key];
    const previousBest = Number(previous?.bestScore);

    if (!Number.isFinite(previousBest) || result.score >= previousBest) {
        scores[key] = {
            bestScore: result.score,
            total: result.total,
            percentage: result.percentage,
            title: result.title,
            completedAt: result.completedAt,
        };
        localStorage.setItem(QUIZ_SCORES_KEY, JSON.stringify(scores));
    }
}

function renderSavedQuizScore(resultEl, day) {
    const saved = getQuizScores()[`day${day}`];
    if (!saved) return;

    resultEl.hidden = false;
    resultEl.innerHTML = "";

    const note = document.createElement("p");
    note.innerHTML = localizedTextHtml({
        zh: `第 ${day} 天最佳成绩：${saved.bestScore}/${saved.total}（${saved.percentage}%）。`,
        en: `Best saved score for Day ${day}: ${saved.bestScore}/${saved.total} (${saved.percentage}%).`,
    });
    resultEl.appendChild(note);
}

function renderQuizResult(resultEl, result) {
    resultEl.hidden = false;
    resultEl.innerHTML = "";

    const heading = document.createElement("h2");
    heading.innerHTML = localizedTextHtml({
        zh: `第 ${result.day} 天得分：${result.score}/${result.total}`,
        en: `Day ${result.day} score: ${result.score}/${result.total}`,
    });

    const detail = document.createElement("p");
    detail.innerHTML = localizedTextHtml({
        zh: "你的最佳成绩已保存。",
        en: "Your best score has been saved.",
    });

    const actions = document.createElement("div");
    actions.className = "lesson-actions";

    const retry = document.createElement("a");
    retry.className = "home-btn";
    retry.href = `quiz.html?day=${encodeURIComponent(result.day)}`;
    retry.innerHTML = `<i class="fas fa-redo"></i> ${localizedTextHtml({
        zh: "再试一次",
        en: "Try again",
    })}`;

    const srsLink = document.createElement("a");
    srsLink.className = "nav-btn";
    srsLink.href = "srs.html";
    srsLink.innerHTML =
        '<i class="fas fa-layer-group"></i> <span class="zh">间隔复习</span><span class="en">SRS review</span>';

    const dayLink = document.createElement("a");
    dayLink.className = "nav-btn";
    dayLink.href = "#quiz-day-buttons";
    dayLink.innerHTML =
        '<i class="fas fa-calendar-alt"></i> <span class="zh">换一天</span><span class="en">Try another day</span>';
    dayLink.addEventListener("click", (e) => {
        e.preventDefault();
        document
            .getElementById("quiz-day-buttons")
            ?.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    actions.appendChild(retry);
    actions.appendChild(dayLink);
    actions.appendChild(srsLink);

    resultEl.appendChild(heading);
    resultEl.appendChild(detail);
    resultEl.appendChild(actions);
}
