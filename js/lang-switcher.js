document.addEventListener("DOMContentLoaded", function () {
    const stored = localStorage.getItem("preferredLanguage") || "zh-CN";
    applyLang(stored);

    document.querySelectorAll(".language-btn").forEach(function (btn) {
        btn.addEventListener("click", function () {
            const lang = btn.dataset.lang === "zh" ? "zh-CN" : btn.dataset.lang;
            localStorage.setItem("preferredLanguage", lang);
            applyLang(lang);
        });
    });
});

function applyLang(lang) {
    document.documentElement.lang =
        lang === "en" ? "en" : lang === "pinyin" ? "zh-CN" : lang;
    document.querySelectorAll(".language-btn").forEach(function (btn) {
        const matches =
            (btn.dataset.lang === "zh" && (lang === "zh-CN" || lang === "zh")) ||
            btn.dataset.lang === lang;
        btn.classList.toggle("active", matches);
    });
}
