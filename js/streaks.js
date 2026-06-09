const STREAK_LAST_ACTIVE_KEY = "lastActiveDate";
const STREAK_COUNT_KEY = "streakCount";
const ACHIEVEMENTS_KEY = "earnedAchievements";

const ACHIEVEMENT_DEFS = [
    {
        id: "first-lesson",
        label: "First lesson",
        description: "Complete one lesson",
        test: ({ completedLessonCount }) => completedLessonCount >= 1,
    },
    {
        id: "week-learner",
        label: "7-day learner",
        description: "Complete 7 lessons",
        test: ({ completedLessonCount }) => completedLessonCount >= 7,
    },
    {
        id: "two-week-path",
        label: "Two-week path",
        description: "Complete 14 lessons",
        test: ({ completedLessonCount }) => completedLessonCount >= 14,
    },
    {
        id: "thirty-day-build",
        label: "30-day build",
        description: "Complete 30 lessons",
        test: ({ completedLessonCount }) => completedLessonCount >= 30,
    },
    {
        id: "pathway-complete",
        label: "Pathway complete",
        description: "Complete all 40 lessons",
        test: ({ completedLessonCount }) => completedLessonCount >= 40,
    },
    {
        id: "first-review",
        label: "First review",
        description: "Complete one SRS review",
        test: ({ srsReviewCount }) => srsReviewCount >= 1,
    },
];

function getLocalDateString(date = new Date()) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

function daysBetweenDates(from, to) {
    const fromDate = new Date(`${from}T00:00:00`);
    const toDate = new Date(`${to}T00:00:00`);
    return Math.round((toDate - fromDate) / 86400000);
}

function getStreakState() {
    return {
        lastActiveDate: localStorage.getItem(STREAK_LAST_ACTIVE_KEY) || "",
        streakCount: Number(localStorage.getItem(STREAK_COUNT_KEY) || "0") || 0,
    };
}

function recordLearningActivity(date = new Date()) {
    const today = getLocalDateString(date);
    const state = getStreakState();

    if (!state.lastActiveDate) {
        state.streakCount = 1;
    } else {
        const gap = daysBetweenDates(state.lastActiveDate, today);
        if (gap === 1) {
            state.streakCount += 1;
        } else if (gap > 1) {
            state.streakCount = 1;
        }
    }

    state.lastActiveDate = today;
    localStorage.setItem(STREAK_LAST_ACTIVE_KEY, state.lastActiveDate);
    localStorage.setItem(STREAK_COUNT_KEY, String(state.streakCount));
    updateAchievements();
    renderStreakWidgets();
    return state;
}

function getCompletedLessonCount() {
    try {
        const completed = JSON.parse(
            localStorage.getItem("completedDays") || "{}",
        );
        return new Set(
            Object.keys(completed)
                .filter((key) => completed[key])
                .map((key) => key.split("_")[0]),
        ).size;
    } catch {
        return 0;
    }
}

function getSrsReviewCount() {
    try {
        const cards = JSON.parse(localStorage.getItem("srsCards") || "[]");
        return Array.isArray(cards)
            ? cards.reduce((sum, card) => sum + (Number(card.reps) || 0), 0)
            : 0;
    } catch {
        return 0;
    }
}

function getEarnedAchievements() {
    try {
        const earned = JSON.parse(
            localStorage.getItem(ACHIEVEMENTS_KEY) || "[]",
        );
        return Array.isArray(earned) ? earned : [];
    } catch {
        return [];
    }
}

function saveEarnedAchievements(ids) {
    localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify([...new Set(ids)]));
}

function updateAchievements() {
    const context = {
        completedLessonCount: getCompletedLessonCount(),
        srsReviewCount: getSrsReviewCount(),
    };
    const earned = ACHIEVEMENT_DEFS.filter((achievement) =>
        achievement.test(context),
    ).map((achievement) => achievement.id);
    saveEarnedAchievements(earned);
    return earned;
}

function renderStreakWidgets() {
    const state = getStreakState();
    const earned = new Set(updateAchievements());

    document.querySelectorAll("[data-streak-count]").forEach((el) => {
        el.textContent = String(state.streakCount);
    });
    document.querySelectorAll("[data-last-active-date]").forEach((el) => {
        el.textContent = state.lastActiveDate || "Not started";
    });

    document.querySelectorAll("[data-achievements-list]").forEach((list) => {
        list.innerHTML = "";
        ACHIEVEMENT_DEFS.forEach((achievement) => {
            const item = document.createElement("li");
            item.className = earned.has(achievement.id)
                ? "achievement-badge earned"
                : "achievement-badge";
            item.innerHTML = `<strong>${achievement.label}</strong><span>${achievement.description}</span>`;
            list.appendChild(item);
        });
    });
}

document.addEventListener("DOMContentLoaded", renderStreakWidgets);
