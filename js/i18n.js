function localizedTextHtml(text) {
    return `<span class="zh">${text.zh}</span><span class="en">${text.en}</span>`;
}

function localizedTextHtml3(text) {
    return (
        `<span class="zh">${text.zh}</span>` +
        `<span class="pinyin">${text.pinyin}</span>` +
        `<span class="en">${text.en}</span>`
    );
}

function renderCompleteButtonCompleted(button) {
    button.innerHTML = `<i class="fas fa-check-circle"></i> ${localizedTextHtml(
        {
            zh: "已完成",
            en: "Completed",
        },
    )}`;
}

function renderCompleteButtonCompleted3(button) {
    button.innerHTML = `<i class="fas fa-check-circle"></i> ${localizedTextHtml3(
        {
            zh: "已完成",
            pinyin: "Yǐ wánchéng",
            en: "Completed",
        },
    )}`;
}

function renderCopyNotificationDefault(notification) {
    notification.innerHTML = localizedTextHtml({
        zh: "短语已复制到剪贴板！",
        en: "Phrase copied to clipboard!",
    });
}

function renderCopyNotificationDefault3(notification) {
    notification.innerHTML = localizedTextHtml3({
        zh: "短语已复制到剪贴板！",
        pinyin: "Duǎnyǔ yǐ fùzhì dào jiǎtiēbǎn!",
        en: "Phrase copied to clipboard!",
    });
}

function showTimedNotification(
    notification,
    messageHtml,
    resetHtml,
    ms = 2000,
) {
    notification.innerHTML = messageHtml;
    notification.style.display = "block";
    notification.style.animation = "none";
    notification.offsetHeight;
    notification.style.animation = "fadeInOut 2s ease";
    setTimeout(() => {
        notification.style.display = "none";
        if (resetHtml) notification.innerHTML = resetHtml;
    }, ms);
}

function normalizePreferredLanguage(lang) {
    if (!lang || lang === "zh") {
        return "zh-CN";
    }
    return lang;
}

function applyStandardDocumentLang(lang) {
    document.documentElement.lang =
        normalizePreferredLanguage(lang) === "en" ? "en" : "zh-CN";
}

function getUrlLang(defaultLang = "zh") {
    return (
        new URLSearchParams(window.location.search).get("lang") || defaultLang
    );
}

function applyWritingLangVisibility(lang, root = document) {
    // Shared header/footer ([data-site-chrome], injected by layout.js) only
    // carries zh/en spans and is toggled via the [lang] CSS rules — leave it
    // out of the inline-style pass so it never gets blanked in pinyin mode.
    root.querySelectorAll(".zh, .pinyin, .en").forEach((el) => {
        if (el.closest("[data-site-chrome]")) return;
        el.style.display = "none";
    });
    root.querySelectorAll("." + lang).forEach((el) => {
        if (el.closest("[data-site-chrome]")) return;
        el.style.display = "";
    });
}
