/**
 * Landing page: "continue learning" strip for returning learners, plus the
 * scroll/hero animations ported from the old index controller.
 */
document.addEventListener("DOMContentLoaded", function () {
    renderContinueStrip();
    initializeScrollAnimations();
    loadHeroBackground();
});

function homeUrlLang() {
    const normalized = normalizePreferredLanguage(
        localStorage.getItem("preferredLanguage") || "zh-CN",
    );
    return normalized === "zh-CN" ? "zh" : normalized;
}

function renderContinueStrip() {
    const container = document.getElementById("continue-strip");
    if (!container) return;

    let completedDays;
    try {
        completedDays = JSON.parse(
            localStorage.getItem("completedDays") || "{}",
        );
    } catch (e) {
        completedDays = {};
    }

    const lang = homeUrlLang();
    const doneForLang = Object.keys(completedDays).filter((key) =>
        key.endsWith(`_${lang}`),
    );
    if (doneForLang.length === 0) return; // new visitor — keep the landing clean

    let nextDay = 1;
    while (nextDay <= 40 && completedDays[`${nextDay}_${lang}`]) {
        nextDay++;
    }
    const finished = nextDay > 40;
    if (finished) nextDay = 40;

    let streak = 0;
    if (typeof getStreakState === "function") {
        streak = getStreakState().streakCount || 0;
    }

    container.innerHTML =
        '<div class="continue-strip animate-fade-in">' +
        "<p>" +
        (streak > 0
            ? '<i class="fas fa-fire streak-flame"></i> ' +
              `<span class="zh">连续学习${streak}天。</span>` +
              `<span class="en">${streak}-day streak. </span>`
            : "") +
        (finished
            ? '<span class="zh">您已完成全部40天课程！</span>' +
              '<span class="en">You have completed all 40 days!</span>'
            : `<span class="zh">欢迎回来——继续第${nextDay}天。</span>` +
              `<span class="en">Welcome back — pick up with Day ${nextDay}.</span>`) +
        "</p>" +
        '<div class="continue-actions">' +
        `<a href="day.html?day=${nextDay}&lang=${lang}" class="cta-btn cta-primary">` +
        '<i class="fas fa-play"></i>' +
        (finished
            ? '<span class="zh">重温第40天</span><span class="en">Revisit Day 40</span>'
            : `<span class="zh">继续第${nextDay}天</span><span class="en">Continue Day ${nextDay}</span>`) +
        "</a> " +
        '<a href="dashboard.html" class="cta-btn cta-secondary">' +
        '<i class="fas fa-chart-line"></i>' +
        '<span class="zh">我的进度</span><span class="en">My Progress</span>' +
        "</a>" +
        "</div>" +
        "</div>";
}

function initializeScrollAnimations() {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    if (entry.target.classList.contains("section-card")) {
                        entry.target.classList.add("animate-slide-right");
                    } else {
                        entry.target.classList.add("animate-fade-in");
                    }
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.1,
        },
    );

    document
        .querySelectorAll(
            "section, .section-card, .step-card, .story-card, .section-divider",
        )
        .forEach((el) => {
            if (!el.classList.contains("animate-fade-in")) {
                observer.observe(el);
            }
        });

    document.querySelectorAll(".visual-anchor").forEach((anchor) => {
        anchor.classList.add("animate-float");
    });
    document.querySelectorAll(".section-divider").forEach((divider) => {
        divider.classList.add("animate-pulse");
    });
}

function loadHeroBackground() {
    const heroSection = document.querySelector(".hero-section");
    if (!heroSection) return;
    const img = new Image();
    img.onload = function () {
        heroSection.classList.add("loaded");
    };
    img.src =
        "https://images.unsplash.com/photo-1546410531-89436e5b419a?auto=format&fit=crop&w=900&q=75";
}
