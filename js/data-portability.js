/**
 * Backup / restore localStorage keys for progress and preferences (no backend).
 */
const DATA_EXPORT_VERSION = 1;

const PORTABILITY_KEYS = [
    "preferredLanguage",
    "completedDays",
    "currentProgress",
    "completedReadings",
    "completedWritings",
    "completedSupplementary",
    "mandarin_pathways_notifications",
    "starredPhrases",
    "srsCards",
    "lastActiveDate",
    "streakCount",
    "earnedAchievements",
    "placementResult",
    "quizScores",
];

function collectPayloadKeys() {
    const keys = {};
    PORTABILITY_KEYS.forEach((k) => {
        const v = localStorage.getItem(k);
        if (v !== null) keys[k] = v;
    });
    return keys;
}

function exportProgressBlob() {
    const payload = JSON.stringify(
        {
            version: DATA_EXPORT_VERSION,
            exportedAt: new Date().toISOString(),
            keys: collectPayloadKeys(),
        },
        null,
        2,
    );
    return new Blob([payload], { type: "application/json" });
}

function importProgressReplaceAll(jsonText) {
    let data;
    try {
        data = JSON.parse(jsonText);
    } catch {
        throw new Error("Invalid JSON");
    }
    if (!data || typeof data.keys !== "object" || data.keys === null) {
        throw new Error("Invalid backup format");
    }
    if (Number(data.version) !== DATA_EXPORT_VERSION) {
        console.warn(
            "Backup version differs from app; import may be incomplete.",
        );
    }
    PORTABILITY_KEYS.forEach((k) => localStorage.removeItem(k));
    PORTABILITY_KEYS.forEach((k) => {
        const v = data.keys[k];
        if (v !== undefined && v !== null) {
            localStorage.setItem(k, String(v));
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("data-portability-modal");
    const btn = document.getElementById("open-data-portability");
    if (!modal || !btn) return;

    const closeBtn = document.getElementById("close-data-portability");
    const exportBtn = document.getElementById("export-progress-btn");
    const importInput = document.getElementById("import-progress-file");

    btn.addEventListener("click", () => {
        modal.style.display = "flex";
    });

    closeBtn.addEventListener("click", () => {
        modal.style.display = "none";
    });

    modal.addEventListener("click", (e) => {
        if (e.target === modal) modal.style.display = "none";
    });

    exportBtn.addEventListener("click", () => {
        const blob = exportProgressBlob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `mandarin-pathways-backup-${new Date().toISOString().slice(0, 10)}.json`;
        a.click();
        URL.revokeObjectURL(url);
    });

    importInput.addEventListener("change", () => {
        const file = importInput.files && importInput.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
            try {
                const ok = window.confirm(
                    "Replace all saved progress on this device with this backup? This cannot be undone.",
                );
                if (!ok) return;
                importProgressReplaceAll(String(reader.result));
                modal.style.display = "none";
                window.location.reload();
            } catch (err) {
                alert(err.message || "Import failed");
            } finally {
                importInput.value = "";
            }
        };
        reader.readAsText(file, "utf-8");
    });
});
