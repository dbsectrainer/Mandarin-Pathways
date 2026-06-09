document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const rawDay = parseInt(urlParams.get("day"), 10);
    const day =
        Number.isFinite(rawDay) && rawDay >= 1 && rawDay <= 40 ? rawDay : 1;
    const lang = urlParams.get("lang") || "zh";
    document.documentElement.lang = lang === "en" ? "en" : "zh-CN";

    document.getElementById("day-number").textContent = day;

    const completedDays = JSON.parse(
        localStorage.getItem("completedDays") || "{}",
    );
    const completeBtn = document.getElementById("complete-btn");

    if (completedDays[`${day}_${lang}`]) {
        completeBtn.classList.add("completed");
        renderCompleteButtonCompleted(completeBtn);
        completeBtn.disabled = true;
    }

    completeBtn.addEventListener("click", () => {
        completedDays[`${day}_${lang}`] = true;
        localStorage.setItem("completedDays", JSON.stringify(completedDays));

        completeBtn.classList.add("completed");
        renderCompleteButtonCompleted(completeBtn);
        completeBtn.disabled = true;

        const totalCompleted = Object.keys(completedDays).filter((key) =>
            key.endsWith(`_${lang}`),
        ).length;

        localStorage.setItem(
            "currentProgress",
            JSON.stringify({
                lang: lang,
                completed: totalCompleted,
            }),
        );

        if (typeof recordLearningActivity === "function") {
            recordLearningActivity();
        }

        updatePageProgress(lang, totalCompleted);

        const notification = document.getElementById("copy-notification");
        notification.innerHTML = localizedTextHtml({
            zh: "已标记为完成！",
            en: "Day marked as complete!",
        });
        notification.style.display = "block";
        notification.style.animation = "none";
        notification.offsetHeight;
        notification.style.animation = "fadeInOut 2s ease";
        setTimeout(() => {
            notification.style.display = "none";
            renderCopyNotificationDefault(notification);
        }, 2000);
    });

    function updatePageProgress(langSel, completed) {
        const dayGrid = document.querySelector(".day-grid");
        if (dayGrid) {
            const dayLinks = dayGrid.querySelectorAll("a");
            dayLinks.forEach((link, index) => {
                const d = index + 1;
                const status = link.querySelector(".day-status i");
                if (!status) return;
                if (completedDays[`${d}_${langSel}`]) {
                    status.className = "fas fa-check-circle";
                    status.style.color = "var(--success-color)";
                } else {
                    status.className = "fas fa-circle";
                    status.style.color = "var(--warning-color)";
                }
            });
        }

        const progressContainer = document.querySelector(".progress-container");
        if (progressContainer) {
            const progressText = progressContainer.querySelector("p");
            const progressBar =
                progressContainer.querySelector(".progress-fill");
            if (progressText && progressBar) {
                progressText.textContent = `Progress: Day ${completed}/40`;
                progressBar.style.width = `${(completed / 40) * 100}%`;
            }
        }
    }

    const initialCompleted = Object.keys(completedDays).filter((key) =>
        key.endsWith(`_${lang}`),
    ).length;
    updatePageProgress(lang, initialCompleted);

    const languageBtns = document.querySelectorAll(".language-btn");
    languageBtns.forEach((btn) => {
        if (btn.dataset.lang === lang) {
            btn.classList.add("active");
        }
        btn.addEventListener("click", () => {
            window.location.href = `day.html?day=${day}&lang=${btn.dataset.lang}`;
        });
    });

    const flagMap = {
        zh: "🇨🇳",
        pinyin: "🔤",
        en: "🇺🇸",
    };
    document.getElementById("language-flag").textContent = flagMap[lang];

    const sectionInfo = getSectionInfo(day);
    document.getElementById("section-title").innerHTML = localizedTextHtml(
        sectionInfo.title,
    );
    document.getElementById("section-description").innerHTML =
        localizedTextHtml(sectionInfo.description);

    const quizLink = document.getElementById("lesson-quiz-link");
    if (quizLink) {
        quizLink.href = `quiz.html?day=${day}&lang=${lang}`;
    }

    const audio = document.getElementById("audio-player");
    const audioLang = lang === "pinyin" ? "zh" : lang;
    audio.src = `audio_files/day${day}_${audioLang}.mp3`;

    const audioFallback = document.getElementById("audio-fallback");
    if (lang === "pinyin") {
        audioFallback.innerHTML = `<p class="note"><i class="fas fa-info-circle"></i> ${localizedTextHtml(
            {
                zh: "使用普通话音频作为参考。",
                en: "Using Mandarin audio for reference.",
            },
        )}</p>`;
        audioFallback.style.display = "block";
    } else {
        audioFallback.innerHTML = "";
        audioFallback.style.display = "none";
    }

    const timingUrl = `timing/day${day}_${audioLang}.json`;

    const textFetch = fetch(`text_files/day${day}_${lang}.txt`).then(
        (response) => {
            if (!response.ok) {
                throw new Error(
                    `Network response was not ok: ${response.status}`,
                );
            }
            return response.text();
        },
    );

    const timingFetch = fetch(timingUrl)
        .then(async (response) => {
            if (!response.ok) return null;
            try {
                return await response.json();
            } catch (e) {
                console.warn("Lesson timing manifest invalid JSON:", e);
                return null;
            }
        })
        .catch(() => null);

    Promise.all([textFetch, timingFetch])
        .then(([text, timing]) => {
            formatAndDisplayContent(text, day, lang, timing);
            LessonAudioSync.attachCueHighlighting(
                audio,
                timing?.phrases,
                (cue) =>
                    document
                        .getElementById("text-content")
                        ?.querySelector(
                            `.phrase-item[data-cue-i="${cue.i}"]`,
                        ) || null,
            );
        })
        .catch((error) => {
            console.error("Error loading text:", error);
            showContentError(document.getElementById("text-content"));
        });

    const prevBtn = document.getElementById("prev-btn");
    const nextBtn = document.getElementById("next-btn");
    const prevBtnTop = document.getElementById("prev-btn-top");
    const nextBtnTop = document.getElementById("next-btn-top");

    if (day > 1) {
        prevBtn.href = `day.html?day=${day - 1}&lang=${lang}`;
        prevBtnTop.href = `day.html?day=${day - 1}&lang=${lang}`;
    } else {
        prevBtn.classList.add("disabled");
        prevBtnTop.classList.add("disabled");
        prevBtn.href = "#";
        prevBtnTop.href = "#";
    }

    if (day < 40) {
        nextBtn.href = `day.html?day=${day + 1}&lang=${lang}`;
        nextBtnTop.href = `day.html?day=${day + 1}&lang=${lang}`;
    } else {
        nextBtn.classList.add("disabled");
        nextBtnTop.classList.add("disabled");
        nextBtn.href = "#";
        nextBtnTop.href = "#";
    }
});

function formatAndDisplayContent(text, day, lang, timingManifest) {
    text = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
    const sections = text.split(/\n(?=\w[^\n]+\n-+\n)/);
    const contentDiv = document.getElementById("text-content");
    contentDiv.innerHTML = "";

    let phraseCount = 0;

    sections.forEach((section) => {
        if (!section.trim()) return;
        const lines = section.split("\n");
        const title = lines[0].replace(/\s*[-]+\s*$/, "").trim();
        if (!title || /^[-\s]+$/.test(title)) return;

        const phrases = lines.slice(1).filter((line) => {
            const trimmedLine = line.trim();
            return trimmedLine && !/^[-\s]+$/.test(trimmedLine);
        });

        const sectionDiv = document.createElement("div");
        sectionDiv.className = "phrase-section";

        const titleEl = document.createElement("h3");
        titleEl.textContent = title;
        sectionDiv.appendChild(titleEl);

        const phraseList = document.createElement("div");
        phraseList.className = "phrase-list";

        phrases.forEach((phrase) => {
            if (!phrase.trim()) return;
            const trimmedPhrase = phrase.trim();
            const phraseItem = document.createElement("div");
            phraseItem.className = "phrase-item";
            phraseItem.dataset.cueI = String(phraseCount);
            phraseCount += 1;

            const phraseReading = document.createElement("span");
            phraseReading.className = "phrase-reading";
            phraseReading.appendChild(
                LessonAudioSync.appendPhraseSpansToFragment(
                    trimmedPhrase,
                    lang,
                ),
            );

            const starBtn = document.createElement("button");
            starBtn.type = "button";
            starBtn.className = "phrase-star-btn";
            const starId = getStarredPhraseId(day, lang, title, trimmedPhrase);
            starBtn.setAttribute("aria-label", "Star phrase for review");
            starBtn.setAttribute(
                "aria-pressed",
                isPhraseStarred(starId) ? "true" : "false",
            );
            starBtn.innerHTML = isPhraseStarred(starId)
                ? '<i class="fas fa-star" aria-hidden="true"></i>'
                : '<i class="far fa-star" aria-hidden="true"></i>';
            starBtn.addEventListener("click", () => {
                const nowStarred = toggleStarredPhrase({
                    id: starId,
                    phrase: trimmedPhrase,
                    day,
                    lang,
                    sectionTitle: title,
                });
                starBtn.setAttribute(
                    "aria-pressed",
                    nowStarred ? "true" : "false",
                );
                starBtn.innerHTML = nowStarred
                    ? '<i class="fas fa-star" aria-hidden="true"></i>'
                    : '<i class="far fa-star" aria-hidden="true"></i>';
            });

            const copyBtn = document.createElement("button");
            copyBtn.type = "button";
            copyBtn.className = "copy-btn";
            copyBtn.setAttribute("aria-label", "Copy phrase");
            copyBtn.innerHTML = '<i class="fas fa-copy"></i>';
            copyBtn.addEventListener("click", () => copyPhrase(trimmedPhrase));

            const srsBtn = document.createElement("button");
            srsBtn.type = "button";
            srsBtn.className = "copy-btn";
            srsBtn.setAttribute("aria-label", "Add phrase to SRS");
            srsBtn.innerHTML = '<i class="fas fa-layer-group"></i>';
            srsBtn.addEventListener("click", () => {
                if (typeof upsertSrsCard !== "function") return;
                upsertSrsCard({
                    day,
                    lang,
                    front: trimmedPhrase,
                    back: title,
                });
                const notification =
                    document.getElementById("copy-notification");
                notification.innerHTML = localizedTextHtml({
                    zh: "短语已添加到间隔复习。",
                    en: "Phrase added to SRS review.",
                });
                notification.style.display = "block";
                notification.style.animation = "none";
                notification.offsetHeight;
                notification.style.animation = "fadeInOut 2s ease";
                setTimeout(() => {
                    notification.style.display = "none";
                    renderCopyNotificationDefault(notification);
                }, 2000);
            });

            if (
                lang === "pinyin" &&
                window.MandarinTones &&
                typeof window.MandarinTones.appendToneGlyphs === "function"
            ) {
                window.MandarinTones.appendToneGlyphs(
                    phraseReading,
                    trimmedPhrase,
                );
            }

            phraseItem.appendChild(phraseReading);
            phraseItem.appendChild(starBtn);
            phraseItem.appendChild(srsBtn);
            phraseItem.appendChild(copyBtn);
            phraseList.appendChild(phraseItem);
        });

        sectionDiv.appendChild(phraseList);
        contentDiv.appendChild(sectionDiv);
    });

    if (
        timingManifest &&
        Array.isArray(timingManifest.phrases) &&
        timingManifest.phrases.length !== phraseCount
    ) {
        console.warn(
            `[day lesson timings] Manifest has ${timingManifest.phrases.length} cues but transcript has ${phraseCount} phrases`,
        );
    }
}

function copyPhrase(phrase) {
    navigator.clipboard.writeText(phrase).then(() => {
        const notification = document.getElementById("copy-notification");
        notification.style.display = "block";
        notification.style.animation = "none";
        notification.offsetHeight;
        notification.style.animation = "fadeInOut 2s ease";
        setTimeout(() => {
            notification.style.display = "none";
        }, 2000);
    });
}

function getSectionInfo(dayNum) {
    if (dayNum <= 7) {
        return {
            title: {
                zh: "拼音系统与发音",
                en: "Pinyin System & Pronunciation",
            },
            description: {
                zh: "掌握普通话发音和声调的基础。",
                en: "Master the fundamentals of Mandarin pronunciation and tones.",
            },
        };
    }
    if (dayNum <= 14) {
        return {
            title: {
                zh: "基础日常用语",
                en: "Essential Daily Phrases",
            },
            description: {
                zh: "学习日常交流中的实用短语。",
                en: "Learn practical phrases for everyday communication.",
            },
        };
    }
    if (dayNum <= 22) {
        return {
            title: {
                zh: "文化背景与日常生活",
                en: "Cultural Context & Daily Life",
            },
            description: {
                zh: "了解中国文化和日常生活交流。",
                en: "Understand Chinese culture and daily life communication.",
            },
        };
    }
    if (dayNum <= 30) {
        return {
            title: {
                zh: "职业中文",
                en: "Professional Mandarin",
            },
            description: {
                zh: "掌握商务和职业场景中的沟通。",
                en: "Master business and professional communication.",
            },
        };
    }
    return {
        title: {
            zh: "高级流利度",
            en: "Advanced Fluency",
        },
        description: {
            zh: "提升高级流利度并应用于真实场景。",
            en: "Achieve advanced fluency and real-world applications.",
        },
    };
}
