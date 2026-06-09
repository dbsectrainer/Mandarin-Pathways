const SRS_CARDS_KEY = "srsCards";
const SRS_GRADES = {
    again: { interval: 0, easeDelta: -0.2 },
    good: { easeDelta: 0 },
    easy: { easeDelta: 0.15 },
};

function getSrsCards() {
    try {
        const raw = localStorage.getItem(SRS_CARDS_KEY);
        const parsed = raw ? JSON.parse(raw) : [];
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

function saveSrsCards(cards) {
    localStorage.setItem(SRS_CARDS_KEY, JSON.stringify(cards));
}

function getSrsCardId(day, lang, front, back) {
    return `${day || "misc"}|${lang || "zh"}|${front}|${back || ""}`;
}

function normalizeSrsCard(entry) {
    const now = new Date().toISOString();
    const front = String(entry.front || entry.phrase || "").trim();
    const back = String(entry.back || entry.sectionTitle || "").trim();
    return {
        id: entry.id || getSrsCardId(entry.day, entry.lang, front, back),
        day: entry.day || null,
        lang: entry.lang || "zh",
        front,
        back,
        due: entry.due || now,
        interval: Number(entry.interval) || 0,
        ease: Number(entry.ease) || 2.5,
        reps: Number(entry.reps) || 0,
        createdAt: entry.createdAt || now,
        updatedAt: entry.updatedAt || now,
    };
}

function upsertSrsCard(entry) {
    const card = normalizeSrsCard(entry);
    if (!card.front) return null;
    const cards = getSrsCards();
    const existingIndex = cards.findIndex((item) => item.id === card.id);
    if (existingIndex >= 0) {
        cards[existingIndex] = { ...cards[existingIndex], ...card };
    } else {
        cards.push(card);
    }
    saveSrsCards(cards);
    return card;
}

function seedSrsFromStarred() {
    if (typeof getStarredPhrases !== "function") return [];
    return getStarredPhrases()
        .map((entry) =>
            upsertSrsCard({
                id: `starred|${entry.id}`,
                day: entry.day,
                lang: entry.lang,
                front: entry.phrase,
                back: entry.sectionTitle || `Day ${entry.day}`,
                createdAt: entry.createdAt,
            }),
        )
        .filter(Boolean);
}

function getDueSrsCards(date = new Date()) {
    const now = date.getTime();
    return getSrsCards()
        .filter((card) => new Date(card.due).getTime() <= now)
        .sort((a, b) => new Date(a.due) - new Date(b.due));
}

function reviewSrsCard(cardId, grade, date = new Date()) {
    const cards = getSrsCards();
    const index = cards.findIndex((card) => card.id === cardId);
    if (index < 0) return null;

    const card = cards[index];
    const gradeConfig = SRS_GRADES[grade] || SRS_GRADES.good;
    const nextEase = Math.max(
        1.3,
        (Number(card.ease) || 2.5) + gradeConfig.easeDelta,
    );
    let nextInterval;

    if (grade === "again") {
        nextInterval = 0;
    } else if ((Number(card.reps) || 0) === 0) {
        nextInterval = grade === "easy" ? 3 : 1;
    } else {
        nextInterval = Math.max(
            1,
            Math.round(
                (Number(card.interval) || 1) *
                    nextEase *
                    (grade === "easy" ? 1.3 : 1),
            ),
        );
    }

    const due = new Date(date);
    due.setDate(due.getDate() + nextInterval);

    cards[index] = {
        ...card,
        interval: nextInterval,
        ease: nextEase,
        reps: (Number(card.reps) || 0) + 1,
        due: due.toISOString(),
        updatedAt: date.toISOString(),
    };
    saveSrsCards(cards);

    if (typeof recordLearningActivity === "function") {
        recordLearningActivity(date);
    }
    return cards[index];
}

document.addEventListener("DOMContentLoaded", () => {
    applyStandardDocumentLang(getUrlLang("zh-CN"));
    renderSrsPage();
});

function renderSrsPage() {
    const root = document.getElementById("srs-app");
    if (!root) return;

    seedSrsFromStarred();
    let dueCards = getDueSrsCards();
    let currentIndex = 0;
    let showingBack = false;

    function render() {
        root.innerHTML = "";

        const summary = document.createElement("div");
        summary.className = "practice-summary";
        summary.innerHTML = `<p>${localizedTextHtml({
            zh: `<strong>${dueCards.length}</strong> 张卡片今日到期 · 共 <strong>${getSrsCards().length}</strong> 张卡片`,
            en: `<strong>${dueCards.length}</strong> cards due today · <strong>${getSrsCards().length}</strong> total cards`,
        })}</p>`;
        root.appendChild(summary);

        if (!dueCards.length) {
            const done = document.createElement("div");
            done.className = "review-card";
            done.innerHTML =
                '<p class="review-phrase"><span class="zh">今日无复习卡片</span><span class="en">No cards due today</span></p>' +
                '<p class="review-meta"><span class="zh">从课程中收藏短语，然后返回进行间隔复习。</span><span class="en">Star phrases from lessons to build your deck, then return here for spaced review.</span></p>';
            const emptyActions = document.createElement("div");
            emptyActions.className = "lesson-actions";
            const starLink = document.createElement("a");
            starLink.href = "review.html";
            starLink.className = "home-btn";
            starLink.innerHTML =
                '<i class="fas fa-star"></i> <span class="zh">收藏短语</span><span class="en">Star phrases</span>';
            const lessonLink = document.createElement("a");
            lessonLink.href = "index.html";
            lessonLink.className = "nav-btn";
            lessonLink.innerHTML =
                '<i class="fas fa-home"></i> <span class="zh">返回课程</span><span class="en">Go to lessons</span>';
            emptyActions.appendChild(starLink);
            emptyActions.appendChild(lessonLink);
            done.appendChild(emptyActions);
            root.appendChild(done);
            return;
        }

        if (currentIndex >= dueCards.length) {
            const done = document.createElement("div");
            done.className = "review-card";
            done.innerHTML =
                '<p class="review-phrase"><span class="zh">复习完成！</span><span class="en">Session complete!</span></p>' +
                '<p class="review-meta"><span class="zh">今日所有到期卡片已复习完毕。明天继续保持！</span><span class="en">All cards due today have been reviewed. Keep it up!</span></p>';
            const doneActions = document.createElement("div");
            doneActions.className = "lesson-actions";
            const homeLink = document.createElement("a");
            homeLink.href = "index.html";
            homeLink.className = "home-btn";
            homeLink.innerHTML =
                '<i class="fas fa-home"></i> <span class="zh">返回课程</span><span class="en">Go to lessons</span>';
            const moreLink = document.createElement("a");
            moreLink.href = "review.html";
            moreLink.className = "nav-btn";
            moreLink.innerHTML =
                '<i class="fas fa-star"></i> <span class="zh">收藏更多短语</span><span class="en">Star more phrases</span>';
            doneActions.appendChild(homeLink);
            doneActions.appendChild(moreLink);
            done.appendChild(doneActions);
            root.appendChild(done);
            return;
        }

        const card = dueCards[currentIndex];
        const panel = document.createElement("div");
        panel.className = "srs-card";
        panel.innerHTML = `
            <p class="review-meta">${localizedTextHtml({
                zh: `第 ${card.day || "?"} 天 · ${card.lang} · ${currentIndex + 1}/${dueCards.length}`,
                en: `Day ${card.day || "?"} · ${card.lang} · ${currentIndex + 1}/${dueCards.length}`,
            })}</p>
            <p class="srs-front">${card.front}</p>
            <p class="srs-back" ${showingBack ? "" : "hidden"}>${card.back || localizedTextHtml({ zh: "未保存背面文本", en: "No back text saved" })}</p>
        `;

        const actions = document.createElement("div");
        actions.className = "review-actions";

        if (!showingBack) {
            const showBtn = document.createElement("button");
            showBtn.type = "button";
            showBtn.className = "primary-btn";
            showBtn.dataset.testid = "srs-show-answer";
            showBtn.innerHTML = localizedTextHtml({
                zh: "显示答案",
                en: "Show answer",
            });
            showBtn.addEventListener("click", () => {
                showingBack = true;
                render();
            });
            actions.appendChild(showBtn);
        } else {
            ["again", "good", "easy"].forEach((grade) => {
                const btn = document.createElement("button");
                btn.type = "button";
                btn.className =
                    grade === "again" ? "secondary-btn" : "primary-btn";
                btn.dataset.testid = `srs-grade-${grade}`;
                const labels = {
                    again: { zh: "重来", en: "Again" },
                    good: { zh: "良好", en: "Good" },
                    easy: { zh: "简单", en: "Easy" },
                };
                btn.innerHTML = localizedTextHtml(labels[grade]);
                btn.addEventListener("click", () => {
                    reviewSrsCard(card.id, grade);
                    currentIndex += 1;
                    showingBack = false;
                    render();
                });
                actions.appendChild(btn);
            });
        }

        panel.appendChild(actions);
        root.appendChild(panel);
    }

    render();
}
