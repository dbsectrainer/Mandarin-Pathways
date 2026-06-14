/**
 * Mandarin Pathways — Feature Enhancements 2026
 * XP/Leveling, HSK Dashboard, CEFR badges, dark mode, analytics
 */

/* ================================================================
   XP / Level System
   ================================================================ */
const XP_KEY = "mpXpPoints";
const XP_VALUES = {
    day: 50,
    quiz: 20,
    srs: 10,
    reading: 15,
    writing: 15,
};

const XP_LEVELS = [
    { level: 1, min: 0, title_zh: "初学者", title_en: "Beginner" },
    { level: 2, min: 100, title_zh: "学徒", title_en: "Apprentice" },
    { level: 3, min: 300, title_zh: "学生", title_en: "Student" },
    { level: 4, min: 600, title_zh: "学者", title_en: "Scholar" },
    { level: 5, min: 1000, title_zh: "专家", title_en: "Expert" },
    { level: 6, min: 2000, title_zh: "大师", title_en: "Master" },
    { level: 7, min: 5000, title_zh: "宗师", title_en: "Grand Master" },
];

function getXpPoints() {
    return parseInt(localStorage.getItem(XP_KEY) || "0", 10);
}

function awardXp(type) {
    const amount = XP_VALUES[type] || 0;
    if (!amount) return;
    const current = getXpPoints();
    const next = current + amount;
    localStorage.setItem(XP_KEY, String(next));
    renderXpPanel();
    return next;
}

function getLevelInfo(xp) {
    let info = XP_LEVELS[0];
    for (const l of XP_LEVELS) {
        if (xp >= l.min) info = l;
        else break;
    }
    const nextLevel = XP_LEVELS.find((l) => l.level === info.level + 1);
    const progress = nextLevel
        ? ((xp - info.min) / (nextLevel.min - info.min)) * 100
        : 100;
    return { ...info, nextMin: nextLevel ? nextLevel.min : null, progress };
}

function renderXpPanel() {
    const panel = document.getElementById("xp-panel");
    if (!panel) return;
    const xp = getXpPoints();
    const info = getLevelInfo(xp);
    const isZh = document.documentElement.lang === "zh-CN";
    const title = isZh ? info.title_zh : info.title_en;
    const nextLabel = info.nextMin
        ? (isZh ? `下一级: ${info.nextMin} XP` : `Next level: ${info.nextMin} XP`)
        : (isZh ? "最高级别" : "Max level reached");

    panel.innerHTML = `
        <div class="xp-level-badge">L${info.level}</div>
        <div class="xp-info">
            <div class="xp-title">${title}</div>
            <div class="xp-bar-wrap"><div class="xp-bar-fill" style="width:${Math.min(info.progress,100).toFixed(1)}%"></div></div>
            <div class="xp-count">${xp} XP &mdash; ${nextLabel}</div>
        </div>
    `;
}

/* ================================================================
   HSK Dashboard
   ================================================================ */
const HSK_LEVELS = [
    { level: 1, days: [1, 7], words: 150, cefr: "A1", label: "HSK 1" },
    { level: 2, days: [8, 14], words: 300, cefr: "A2", label: "HSK 2" },
    { level: 3, days: [15, 22], words: 600, cefr: "B1", label: "HSK 3" },
    { level: 4, days: [23, 30], words: 1200, cefr: "B1+", label: "HSK 4" },
    { level: 5, days: [31, 36], words: 2500, cefr: "B2", label: "HSK 5" },
    { level: 6, days: [37, 40], words: 5000, cefr: "C1", label: "HSK 6" },
];

function getCompletedDaySet() {
    try {
        const raw = localStorage.getItem("completedDays");
        const obj = raw ? JSON.parse(raw) : {};
        const days = new Set();
        Object.keys(obj).forEach((key) => {
            if (obj[key]) days.add(parseInt(key.split("_")[0], 10));
        });
        return days;
    } catch {
        return new Set();
    }
}

function renderHskDashboard() {
    const container = document.getElementById("hsk-dashboard-grid");
    if (!container) return;
    const completedDays = getCompletedDaySet();
    const isZh = document.documentElement.lang === "zh-CN";

    container.innerHTML = HSK_LEVELS.map((h) => {
        const [start, end] = h.days;
        const total = end - start + 1;
        const done = Array.from({ length: total }, (_, i) => i + start).filter(
            (d) => completedDays.has(d),
        ).length;
        const pct = total ? Math.round((done / total) * 100) : 0;
        const doneLabel = isZh
            ? `${done}/${total} 天完成`
            : `${done}/${total} days done`;
        const wordsLabel = isZh ? `约${h.words}词` : `~${h.words} words`;
        const rangeLabel = isZh ? `第${start}-${end}天` : `Days ${start}-${end}`;

        return `<div class="hsk-card">
            <div class="hsk-card-header">
                <span class="hsk-level-tag">${h.label}</span>
                <span class="hsk-cefr-badge">${h.cefr}</span>
            </div>
            <p>${rangeLabel} &bull; ${wordsLabel}</p>
            <div class="hsk-progress-bar">
                <div class="hsk-progress-fill" style="width:${pct}%"></div>
            </div>
            <div class="hsk-words-count">${doneLabel}</div>
        </div>`;
    }).join("");
}

/* ================================================================
   CEFR Day Badges
   ================================================================ */
const CEFR_LEVELS = [
    { max: 7, label: "A1", cls: "a1" },
    { max: 14, label: "A2", cls: "a2" },
    { max: 22, label: "B1", cls: "b1" },
    { max: 30, label: "B2", cls: "b2" },
    { max: 40, label: "C1", cls: "c1" },
];

const DAY_DURATIONS = { 7: "~10 min", 14: "~12 min", 22: "~15 min", 30: "~15 min", 40: "~20 min" };

function getCefrForDay(day) {
    return CEFR_LEVELS.find((l) => day <= l.max) || CEFR_LEVELS[CEFR_LEVELS.length - 1];
}

function getDurationForDay(day) {
    for (const [max, dur] of Object.entries(DAY_DURATIONS)) {
        if (day <= parseInt(max, 10)) return dur;
    }
    return "~20 min";
}

function injectDayCardBadges() {
    document.querySelectorAll(".day-grid a").forEach((link) => {
        const numEl = link.querySelector(".day-number");
        if (!numEl) return;
        const day = parseInt(numEl.textContent, 10);
        if (!day) return;
        if (link.querySelector(".level-badge")) return; // already added

        const cefr = getCefrForDay(day);
        const dur = getDurationForDay(day);

        const badge = document.createElement("span");
        badge.className = `level-badge ${cefr.cls}`;
        badge.textContent = cefr.label;

        const durSpan = document.createElement("span");
        durSpan.className = "duration-badge";
        durSpan.textContent = dur;

        const status = link.querySelector(".day-status");
        if (status) {
            link.insertBefore(badge, status);
            link.insertBefore(durSpan, status);
        } else {
            link.appendChild(badge);
            link.appendChild(durSpan);
        }
    });
}

/* ================================================================
   Dark Mode Toggle
   ================================================================ */
function initDarkMode() {
    const stored = localStorage.getItem("darkMode");
    if (stored === "true") {
        document.documentElement.setAttribute("data-theme", "dark");
    } else if (stored === "false") {
        document.documentElement.setAttribute("data-theme", "light");
    }

    const btn = document.getElementById("dark-mode-toggle");
    if (!btn) return;
    btn.addEventListener("click", () => {
        const isDark = document.documentElement.getAttribute("data-theme") === "dark";
        const next = isDark ? "light" : "dark";
        document.documentElement.setAttribute("data-theme", next);
        localStorage.setItem("darkMode", String(next === "dark"));
        updateDarkModeLabel();
    });
    updateDarkModeLabel();
}

function updateDarkModeLabel() {
    const btn = document.getElementById("dark-mode-toggle");
    if (!btn) return;
    const isDark = document.documentElement.getAttribute("data-theme") === "dark";
    const isZh = document.documentElement.lang === "zh-CN";
    btn.textContent = isDark
        ? (isZh ? "☀️ 日间模式" : "☀️ Light mode")
        : (isZh ? "🌙 夜间模式" : "🌙 Dark mode");
}

/* ================================================================
   High Contrast Toggle
   ================================================================ */
function initHighContrast() {
    if (localStorage.getItem("highContrast") === "true") {
        document.documentElement.classList.add("high-contrast");
    }
    const btn = document.getElementById("high-contrast-toggle");
    if (!btn) return;
    btn.addEventListener("click", () => {
        const on = document.documentElement.classList.toggle("high-contrast");
        localStorage.setItem("highContrast", String(on));
        const isZh = document.documentElement.lang === "zh-CN";
        btn.textContent = on
            ? (isZh ? "🎨 标准对比度" : "🎨 Normal contrast")
            : (isZh ? "⚡ 高对比度" : "⚡ High contrast");
    });
}

/* ================================================================
   Traditional Chinese Script Toggle
   ================================================================ */
const TRAD_MAP = {
    "简体中文": "繁體中文",
    "开启您的中文学习之旅": "開啟您的中文學習之旅",
    "掌握中文": "掌握中文",
    "学习仪表盘": "學習儀表板",
    "课程结构": "課程結構",
    "每日课程": "每日課程",
    "核心语言技能": "核心語言技能",
    "阅读能力": "閱讀能力",
    "写作能力": "寫作能力",
    "补充学习材料": "補充學習材料",
    "复习清单": "複習清單",
    "间隔复习": "間隔複習",
    "水平测试": "水平測試",
};

function initScriptToggle() {
    const stored = localStorage.getItem("chineseScript") || "simplified";
    const radios = document.querySelectorAll('input[name="script"]');
    radios.forEach((r) => {
        r.checked = r.value === stored;
        r.addEventListener("change", () => {
            localStorage.setItem("chineseScript", r.value);
            applyScript(r.value);
        });
    });
    applyScript(stored);
}

function applyScript(script) {
    if (script === "traditional") {
        document.querySelectorAll(".zh").forEach((el) => {
            const orig = el.getAttribute("data-orig") || el.textContent;
            if (!el.getAttribute("data-orig")) el.setAttribute("data-orig", orig);
            el.textContent = TRAD_MAP[orig.trim()] || orig;
        });
    } else {
        document.querySelectorAll(".zh[data-orig]").forEach((el) => {
            el.textContent = el.getAttribute("data-orig");
        });
    }
}

/* ================================================================
   Learning Analytics Panel
   ================================================================ */
function renderAnalyticsPanel() {
    const panel = document.getElementById("analytics-panel-content");
    if (!panel) return;

    const completedSet = getCompletedDaySet();
    const totalDone = completedSet.size;

    const srsCards = (() => {
        try { return JSON.parse(localStorage.getItem("srsCards") || "[]"); }
        catch { return []; }
    })();

    const totalSrsCards = srsCards.length;

    const recentSrs = srsCards.filter((c) => {
        if (!c.updatedAt) return false;
        const updated = new Date(c.updatedAt);
        const cutoff = new Date(Date.now() - 30 * 24 * 3600 * 1000);
        return updated > cutoff;
    });

    const good = recentSrs.filter((c) => (c.reps || 0) > 0 && (c.interval || 0) >= 1).length;
    const retention = recentSrs.length
        ? Math.round((good / recentSrs.length) * 100)
        : 0;

    const streak = parseInt(localStorage.getItem("streakCount") || "0", 10);
    const estimatedMinutes = totalDone * 13;
    const isZh = document.documentElement.lang === "zh-CN";

    const stats = [
        {
            value: totalDone,
            label: isZh ? "已完成课程" : "Lessons done",
        },
        {
            value: streak,
            label: isZh ? "连续学习天数" : "Day streak",
        },
        {
            value: totalSrsCards,
            label: isZh ? "SRS词汇卡片" : "SRS vocab cards",
        },
        {
            value: recentSrs.length ? `${retention}%` : "--",
            label: isZh ? "30天复习留存率" : "30-day retention",
        },
        {
            value: `${estimatedMinutes}`,
            label: isZh ? "预估学习分钟" : "Est. study minutes",
        },
    ];

    panel.innerHTML = stats.map((s) =>
        `<div class="analytics-stat">
            <span class="analytics-number">${s.value}</span>
            <div class="analytics-label">${s.label}</div>
        </div>`
    ).join("");
}

/* ================================================================
   Cantonese Language Support (index.html)
   ================================================================ */
function initCantoneseButton() {
    const btn = document.querySelector('[data-lang="yue"]');
    if (!btn) return;
    btn.addEventListener("click", () => {
        // Navigate to cantonese track page
        window.location.href = "cantonese-track.html";
    });
}

/* ================================================================
   Init on DOMContentLoaded
   ================================================================ */
document.addEventListener("DOMContentLoaded", () => {
    initDarkMode();
    initHighContrast();
    initScriptToggle();
    initCantoneseButton();
    renderXpPanel();
    renderHskDashboard();
    renderAnalyticsPanel();

    // Inject CEFR badges after day grid is built
    setTimeout(injectDayCardBadges, 100);

    // Re-inject when pagination changes
    document.getElementById("prevDays")?.addEventListener("click", () =>
        setTimeout(injectDayCardBadges, 100)
    );
    document.getElementById("nextDays")?.addEventListener("click", () =>
        setTimeout(injectDayCardBadges, 100)
    );
});
