/**
 * Bookmark / starred phrases for Review page (localStorage).
 */
const STARRED_PHRASES_KEY = "starredPhrases";

function getStarredPhraseId(day, lang, sectionTitle, phrase) {
    const sec = sectionTitle || "";
    return `${day}|${lang}|${sec}|${phrase}`;
}

function getStarredPhrases() {
    try {
        const raw = localStorage.getItem(STARRED_PHRASES_KEY);
        const parsed = raw ? JSON.parse(raw) : [];
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

function saveStarredPhrases(list) {
    localStorage.setItem(STARRED_PHRASES_KEY, JSON.stringify(list));
}

function isPhraseStarred(id) {
    return getStarredPhrases().some((e) => e.id === id);
}

function toggleStarredPhrase(entry) {
    const list = getStarredPhrases();
    const ix = list.findIndex((e) => e.id === entry.id);
    if (ix >= 0) {
        list.splice(ix, 1);
    } else {
        list.push({
            ...entry,
            createdAt: entry.createdAt || new Date().toISOString(),
        });
    }
    saveStarredPhrases(list);
    return ix < 0;
}

function removeStarredPhrase(id) {
    saveStarredPhrases(getStarredPhrases().filter((e) => e.id !== id));
}
