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
        summary.innerHTML = `<p><strong>${dueCards.length}</strong> cards due today · <strong>${getSrsCards().length}</strong> total cards</p>`;
        root.appendChild(summary);

        if (!dueCards.length || currentIndex >= dueCards.length) {
            const done = document.createElement("div");
            done.className = "review-card";
            done.innerHTML =
                '<p class="review-phrase">No cards due right now.</p><p class="review-meta">Add lesson phrases or star phrases, then come back for spaced review.</p>';
            root.appendChild(done);
            return;
        }

        const card = dueCards[currentIndex];
        const panel = document.createElement("div");
        panel.className = "srs-card";
        panel.innerHTML = `
            <p class="review-meta">Day ${card.day || "?"} · ${card.lang} · ${currentIndex + 1}/${dueCards.length}</p>
            <p class="srs-front">${card.front}</p>
            <p class="srs-back" ${showingBack ? "" : "hidden"}>${card.back || "No back text saved"}</p>
        `;

        const actions = document.createElement("div");
        actions.className = "review-actions";

        if (!showingBack) {
            const showBtn = document.createElement("button");
            showBtn.type = "button";
            showBtn.className = "primary-btn";
            showBtn.textContent = "Show answer";
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
                btn.textContent = grade[0].toUpperCase() + grade.slice(1);
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

document.addEventListener("DOMContentLoaded", renderSrsPage);
