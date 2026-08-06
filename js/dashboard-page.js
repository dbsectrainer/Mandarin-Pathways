/**
 * My Progress dashboard: per-language progress bars, SRS due count, and
 * placement recommendation. Streak count and achievements are rendered by
 * streaks.js; the backup and notification modals are wired by
 * data-portability.js and notifications.js (loaded only on this page).
 *
 * Ported from the old index.html inline script — localStorage keys and the
 * `currentProgress` storage-event contract with day-page.js are unchanged.
 */
document.addEventListener("DOMContentLoaded", function () {
    // Honor ?lang= like the old index did (applyLang comes from
    // lang-switcher.js, which is loaded before this file).
    const urlLang = new URLSearchParams(window.location.search).get("lang");
    if (urlLang && typeof applyLang === "function") {
        applyLang(urlLang === "zh" ? "zh-CN" : urlLang);
    }

    function initializeProgress() {
        const completedDays = JSON.parse(
            localStorage.getItem("completedDays") || "{}",
        );
        ["zh", "pinyin", "en"].forEach((lang) => {
            const completed = Object.keys(completedDays).filter((key) =>
                key.endsWith(`_${lang}`),
            ).length;
            updateLanguageProgress(lang, completed);
        });
    }

    // Listen for progress updates from day.html open in another tab
    window.addEventListener("storage", function (e) {
        if (e.key === "currentProgress") {
            const progress = JSON.parse(e.newValue);
            updateLanguageProgress(progress.lang, progress.completed);
        }
    });

    function updateLanguageProgress(lang, completed) {
        const cardOrder = ["zh", "pinyin", "en"];
        const idx = cardOrder.indexOf(lang);
        const cards = document.querySelectorAll(".language-card");
        const card = idx >= 0 ? cards[idx] : null;
        if (!card) return;

        const progressText = card.querySelector(".progress-container p");
        const progressBar = card.querySelector(".progress-fill");
        if (!progressText || !progressBar) return;

        const zh = progressText.querySelector(".zh");
        const en = progressText.querySelector(".en");
        if (zh) {
            zh.textContent = `进度：第${completed}/40天`;
        }
        if (en) {
            en.textContent = `Progress: Day ${completed}/40`;
        }
        if (!zh && !en) {
            progressText.textContent = `Progress: Day ${completed}/40`;
        }
        progressBar.style.width = `${(completed / 40) * 100}%`;
    }

    function renderLearningDashboard() {
        const dueEl = document.getElementById("srs-due-count");
        if (dueEl && typeof getDueSrsCards === "function") {
            dueEl.textContent = String(getDueSrsCards().length);
        }

        const placementEl = document.getElementById("placement-start-day");
        if (placementEl) {
            try {
                const result = JSON.parse(
                    localStorage.getItem("placementResult") || "null",
                );
                const startDay = result?.startDay || result?.recommendedDay;
                placementEl.innerHTML = startDay
                    ? `<span class="zh">第${startDay}天</span><span class="en">Day ${startDay}</span>`
                    : "--";
            } catch {
                placementEl.textContent = "--";
            }
        }
    }

    // Clicking a language card switches the site language and continues to
    // the stories index in that mode.
    const cardLangs = ["zh", "pinyin", "en"];
    document.querySelectorAll(".language-card").forEach((card, index) => {
        const lang = cardLangs[index];
        if (!lang) return;
        card.style.cursor = "pointer";
        card.addEventListener("click", function () {
            localStorage.setItem(
                "preferredLanguage",
                normalizePreferredLanguage(lang === "zh" ? "zh-CN" : lang),
            );
            window.location.href = "stories.html";
        });
    });

    initializeProgress();
    renderLearningDashboard();
});
