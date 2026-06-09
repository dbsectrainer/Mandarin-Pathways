document.addEventListener("DOMContentLoaded", function () {
    const stored = normalizePreferredLanguage(
        localStorage.getItem("preferredLanguage") || "zh-CN",
    );
    applyLang(stored);

    document.querySelectorAll(".language-btn").forEach(function (btn) {
        btn.addEventListener("click", function () {
            const lang = normalizePreferredLanguage(
                btn.dataset.lang === "zh" ? "zh-CN" : btn.dataset.lang,
            );
            localStorage.setItem("preferredLanguage", lang);
            applyLang(lang);
        });
    });
});

function applyLang(lang) {
    const normalized = normalizePreferredLanguage(lang);
    localStorage.setItem("preferredLanguage", normalized);
    applyStandardDocumentLang(normalized);
    document.querySelectorAll(".language-btn").forEach(function (btn) {
        const matches =
            (btn.dataset.lang === "zh" && normalized === "zh-CN") ||
            btn.dataset.lang === normalized;
        btn.classList.toggle("active", matches);
    });
}
