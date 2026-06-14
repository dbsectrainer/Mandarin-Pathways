document.addEventListener("DOMContentLoaded", function () {
    const stored = normalizePreferredLanguage(
        localStorage.getItem("preferredLanguage") || "zh-CN",
    );
    applyLang(stored);

    document.querySelectorAll(".language-btn").forEach(function (btn) {
        btn.addEventListener("click", function () {
            const rawLang = btn.dataset.lang;
            // Cantonese button navigates to the Cantonese track page
            if (rawLang === "yue") {
                window.location.href = "cantonese-track.html";
                return;
            }
            const lang = normalizePreferredLanguage(
                rawLang === "zh" ? "zh-CN" : rawLang,
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
