// Reading content data structure
const readingData = {
    beginner: {
        "Self Introduction": {
            title: "Self Introduction",
            description: "A simple self-introduction in Mandarin",
            hasAudio: true,
        },
        "Daily Routine": {
            title: "Daily Routine",
            description: "Learn vocabulary related to daily activities",
            hasAudio: true,
        },
    },
    intermediate: {
        "At the Restaurant": {
            title: "At the Restaurant",
            description: "Vocabulary and phrases for dining out",
            hasAudio: true,
        },
        "Weekend Plans": {
            title: "Weekend Plans",
            description: "Discussing weekend activities and plans",
            hasAudio: true,
        },
    },
    advanced: {
        "Environmental Protection": {
            title: "Environmental Protection",
            description: "Advanced vocabulary related to environmental issues",
            hasAudio: true,
        },
    },
};

document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const level = urlParams.get("level") || "";
    const topic = urlParams.get("topic") || "";
    const lang = getUrlLang();
    applyStandardDocumentLang(lang);

    const notification = document.getElementById("copy-notification");
    renderCopyNotificationDefault(notification);

    const languageBtns = document.querySelectorAll(".language-btn");
    languageBtns.forEach((btn) => {
        if (btn.dataset.lang === lang) {
            btn.classList.add("active");
        }
        btn.addEventListener("click", () => {
            const currentLevel = urlParams.get("level") || "";
            const currentTopic = urlParams.get("topic") || "";
            let newUrl = `reading.html?lang=${btn.dataset.lang}`;
            if (currentLevel) {
                newUrl += `&level=${currentLevel}`;
                if (currentTopic) {
                    newUrl += `&topic=${currentTopic}`;
                }
            }
            window.location.href = newUrl;
        });
    });

    // Set language flag
    const flagMap = {
        zh: "🇨🇳",
        pinyin: "🔤",
        en: "🇺🇸",
    };
    document.getElementById("language-flag").textContent = flagMap[lang];

    // Set up level buttons
    const levelBtns = document.querySelectorAll(".level-btn");
    levelBtns.forEach((btn) => {
        if (btn.dataset.level === level) {
            btn.classList.add("active");
        }
        btn.addEventListener("click", () => {
            window.location.href = `reading.html?level=${btn.dataset.level}&lang=${lang}`;
        });
    });

    // If level is selected, show topics
    if (level && readingData[level]) {
        document.querySelector(".topic-selector").style.display = "block";
        document.getElementById("reading-level").textContent =
            level.charAt(0).toUpperCase() + level.slice(1);

        // Populate topics
        const topicButtons = document.getElementById("topic-buttons");
        topicButtons.innerHTML = "";

        Object.keys(readingData[level]).forEach((topicName) => {
            const btn = document.createElement("button");
            btn.className = "topic-btn";
            if (topicName === topic) {
                btn.classList.add("active");
            }
            btn.dataset.topic = topicName;

            const icon = document.createElement("i");
            icon.className = "fas fa-book";
            btn.appendChild(icon);

            const space = document.createTextNode(" ");
            btn.appendChild(space);

            const text = document.createTextNode(topicName);
            btn.appendChild(text);

            btn.addEventListener("click", () => {
                window.location.href = `reading.html?level=${level}&topic=${topicName}&lang=${lang}`;
            });

            topicButtons.appendChild(btn);
        });
    }

    // If both level and topic are selected, load content
    if (level && topic && readingData[level] && readingData[level][topic]) {
        loadReadingContent(level, topic, lang);
    } else {
        // Hide content sections if no topic selected
        document.getElementById("section-title").textContent = "";
        document.getElementById("section-description").textContent = "";
        document.querySelector(".audio-player").style.display = "none";
        document.getElementById("reading-content").innerHTML = "";
        document.getElementById("vocabulary-section").style.display = "none";
        document.getElementById("questions-section").style.display = "none";
        document.getElementById("complete-btn").style.display = "none";
    }

    // Mark as complete functionality
    const completeBtn = document.getElementById("complete-btn");
    const completedReadings = JSON.parse(
        localStorage.getItem("completedReadings") || "{}",
    );

    if (level && topic && completedReadings[`${level}_${topic}_${lang}`]) {
        completeBtn.classList.add("completed");
        renderCompleteButtonCompleted(completeBtn);
        completeBtn.disabled = true;
    }

    completeBtn.addEventListener("click", () => {
        if (level && topic) {
            completedReadings[`${level}_${topic}_${lang}`] = true;
            localStorage.setItem(
                "completedReadings",
                JSON.stringify(completedReadings),
            );

            completeBtn.classList.add("completed");
            renderCompleteButtonCompleted(completeBtn);
            completeBtn.disabled = true;

            showTimedNotification(
                notification,
                localizedTextHtml({
                    zh: "阅读已标记为完成！",
                    en: "Reading marked as complete!",
                }),
                localizedTextHtml({
                    zh: "短语已复制到剪贴板！",
                    en: "Phrase copied to clipboard!",
                }),
            );
        }
    });
});

function loadReadingContent(level, topic, lang) {
    const topicInfo = readingData[level][topic];

    document.getElementById("section-title").textContent = topicInfo.title;
    document.getElementById("section-description").textContent =
        topicInfo.description;

    document.querySelector(".audio-player").style.display = "block";
    document.getElementById("vocabulary-section").style.display = "block";
    document.getElementById("questions-section").style.display = "block";
    document.getElementById("complete-btn").style.display = "block";

    const audio = document.getElementById("audio-player");
    const audioFallback = document.getElementById("audio-fallback");
    const topicSlug = topic.toLowerCase().replace(/ /g, "_");
    const audioLang = lang === "pinyin" ? "zh" : lang;

    if (topicInfo.hasAudio) {
        audio.src = `audio_files/reading/${level}_${topicSlug}_${audioLang}.mp3`;
        if (lang === "pinyin") {
            audioFallback.innerHTML = `<p class="note"><i class="fas fa-info-circle"></i> ${localizedTextHtml(
                {
                    zh: "使用普通话音频作为参考。",
                    en: "Using Mandarin audio for reference.",
                },
            )}</p>`;
            audioFallback.style.display = "block";
        } else {
            audioFallback.style.display = "none";
        }
    } else {
        audio.src = "";
        audioFallback.innerHTML = `<p class="note"><i class="fas fa-info-circle"></i> ${localizedTextHtml(
            {
                zh: "此阅读暂无音频。",
                en: "Audio not available for this reading.",
            },
        )}</p>`;
        audioFallback.style.display = "block";
    }

    const textUrl = `reading_files/${level}_${topicSlug}_${lang}.txt`;
    const timingUrl = topicInfo.hasAudio
        ? `timing/reading/${level}_${topicSlug}_${audioLang}.json`
        : "";

    const textFetch = fetch(textUrl).then((response) => {
        if (!response.ok)
            throw new Error(`Network response was not ok: ${response.status}`);
        return response.text();
    });

    const timingFetch = timingUrl
        ? fetch(timingUrl)
              .then(async (response) => {
                  if (!response.ok) return null;
                  try {
                      return await response.json();
                  } catch (e) {
                      console.warn("Reading timing manifest invalid JSON:", e);
                      return null;
                  }
              })
              .catch(() => null)
        : Promise.resolve(null);

    Promise.all([textFetch, timingFetch])
        .then(([text, timing]) => {
            formatAndDisplayReadingContent(text, lang, timing, level, topic);
            if (topicInfo.hasAudio) {
                LessonAudioSync.attachCueHighlighting(
                    audio,
                    timing?.phrases,
                    (cue) =>
                        document.querySelector(
                            `#reading-content p[data-cue-i="${cue.i}"]`,
                        ) || null,
                );
            }
        })
        .catch((error) => {
            console.error("Error loading reading content:", error);
            showContentError(document.getElementById("reading-content"));
            document.getElementById("vocabulary-section").style.display =
                "none";
            document.getElementById("questions-section").style.display = "none";
        });
}

function formatAndDisplayReadingContent(
    text,
    lang,
    timingManifest,
    level,
    topic,
) {
    // Split the text into sections (main text, vocabulary, questions)
    const sections = text.split(/\n(?=\w[^\n]+\n-+\n)/);

    if (sections.length >= 1) {
        const mainTextSection = sections[0];
        const mainTextLines = mainTextSection.split("\n");
        const mainTextNormalized = mainTextLines.slice(2).join("\n").trim();

        const readingContentDiv = document.getElementById("reading-content");
        readingContentDiv.innerHTML = "";

        const segmentLang = lang === "zh" ? "zh" : "en";
        const sentences = LessonAudioSync.splitReadingSegments(
            mainTextNormalized,
            segmentLang,
        );
        if (
            timingManifest &&
            Array.isArray(timingManifest.phrases) &&
            timingManifest.phrases.length !== sentences.length
        ) {
            console.warn(
                `[reading timings] Manifest has ${timingManifest.phrases.length} cues but transcript split into ${sentences.length} segments`,
            );
        }

        const spanLang = lang === "zh" ? "zh" : "en";

        sentences.forEach((sent, i) => {
            const p = document.createElement("p");
            p.className = "reading-sync-line";
            p.dataset.cueI = String(i);
            const phraseReading = document.createElement("span");
            phraseReading.className = "phrase-reading reading-passage-reading";
            phraseReading.appendChild(
                LessonAudioSync.appendPhraseSpansToFragment(sent, spanLang),
            );
            p.appendChild(phraseReading);
            readingContentDiv.appendChild(p);
        });
    }

    if (sections.length >= 2) {
        // Vocabulary section
        const vocabSection = sections[1];
        const vocabLines = vocabSection.split("\n");

        // Skip title and separator lines
        const vocabItems = vocabLines.slice(2).filter((line) => line.trim());

        const vocabListDiv = document.getElementById("vocabulary-list");
        vocabListDiv.innerHTML = "";

        vocabItems.forEach((item) => {
            if (item.trim()) {
                const vocabItem = document.createElement("div");
                vocabItem.className = "vocab-item";

                // Parse the item to extract the parts (bullet point, word, pinyin, translation)
                // Format: • word (pinyin) - translation
                const itemText = document.createElement("span");
                itemText.innerHTML = item
                    .trim()
                    .replace(/•/, '<span class="bullet">•</span>')
                    .replace(/\(([^)]+)\)/, '<span class="pinyin">($1)</span>')
                    .replace(/-/, '<span class="separator">-</span>');

                const srsBtn = document.createElement("button");
                srsBtn.type = "button";
                srsBtn.className = "copy-btn";
                srsBtn.setAttribute("aria-label", "Add to SRS review");
                srsBtn.innerHTML = '<i class="fas fa-layer-group"></i>';
                srsBtn.addEventListener("click", () => {
                    if (typeof upsertSrsCard !== "function") return;
                    const front = item.replace(/^[•\s]+/, "").trim();
                    upsertSrsCard({
                        id: `reading|${level}|${topic}|${lang}|${front}`,
                        day: null,
                        lang,
                        front,
                        back: `${level} - ${topic}`,
                    });
                    const notification =
                        document.getElementById("copy-notification");
                    showTimedNotification(
                        notification,
                        localizedTextHtml({
                            zh: "短语已添加到间隔复习。",
                            en: "Phrase added to SRS review.",
                        }),
                        localizedTextHtml({
                            zh: "短语已复制到剪贴板！",
                            en: "Phrase copied to clipboard!",
                        }),
                    );
                });

                const copyBtn = document.createElement("button");
                copyBtn.className = "copy-btn";
                copyBtn.innerHTML = '<i class="fas fa-copy"></i>';
                copyBtn.addEventListener("click", () => copyText(item.trim()));

                vocabItem.appendChild(itemText);
                vocabItem.appendChild(srsBtn);
                vocabItem.appendChild(copyBtn);
                vocabListDiv.appendChild(vocabItem);
            }
        });
    } else {
        document.getElementById("vocabulary-section").style.display = "none";
    }

    if (sections.length >= 3) {
        // Questions section
        const questionsSection = sections[2];
        const questionLines = questionsSection.split("\n");

        // Skip title and separator lines
        const questions = questionLines.slice(2).filter((line) => line.trim());

        const questionsListDiv = document.getElementById("questions-list");
        questionsListDiv.innerHTML = "";

        // Group questions and answers (every two lines)
        const questionAnswerPairs = [];
        for (let i = 0; i < questions.length; i += 2) {
            if (questions[i] && questions[i].trim()) {
                const questionText = questions[i].trim();
                const answerText =
                    i + 1 < questions.length ? questions[i + 1].trim() : "";
                questionAnswerPairs.push({
                    question: questionText,
                    answer: answerText,
                });
            }
        }

        questionAnswerPairs.forEach((pair) => {
            const questionItem = document.createElement("div");
            questionItem.className = "question-item";

            // Parse the question to extract the question number and text
            // Format: 【Question #】 Question text
            const questionText = document.createElement("p");
            questionText.className = "question-text";
            questionText.innerHTML = pair.question.replace(
                /【([^】]+)】/,
                '<span class="question-number">【$1】</span>',
            );

            // Create answer section with toggle functionality
            const answerSection = document.createElement("div");
            answerSection.className = "answer-section";

            const answerInput = document.createElement("textarea");
            answerInput.className = "answer-input";
            answerInput.placeholder =
                lang === "en"
                    ? "Write your answer here..."
                    : "在此写下你的答案…";

            const answerToggle = document.createElement("button");
            answerToggle.className = "answer-toggle";
            answerToggle.innerHTML = `<i class="fas fa-eye"></i> ${localizedTextHtml(
                {
                    zh: "显示答案",
                    en: "Show Answer",
                },
            )}`;

            const answerText = document.createElement("div");
            answerText.className = "answer-text";
            answerText.textContent = pair.answer.replace(
                /^答案: |^Answer: /,
                "",
            );
            answerText.style.display = "none";

            answerToggle.addEventListener("click", () => {
                if (answerText.style.display === "none") {
                    answerText.style.display = "block";
                    answerToggle.innerHTML = `<i class="fas fa-eye-slash"></i> ${localizedTextHtml(
                        {
                            zh: "隐藏答案",
                            en: "Hide Answer",
                        },
                    )}`;
                } else {
                    answerText.style.display = "none";
                    answerToggle.innerHTML = `<i class="fas fa-eye"></i> ${localizedTextHtml(
                        {
                            zh: "显示答案",
                            en: "Show Answer",
                        },
                    )}`;
                }
            });

            answerSection.appendChild(answerInput);
            answerSection.appendChild(answerToggle);
            answerSection.appendChild(answerText);

            questionItem.appendChild(questionText);
            questionItem.appendChild(answerSection);
            questionsListDiv.appendChild(questionItem);
        });
    } else {
        document.getElementById("questions-section").style.display = "none";
    }
}

function copyText(text) {
    navigator.clipboard.writeText(text).then(() => {
        const notification = document.getElementById("copy-notification");
        showTimedNotification(
            notification,
            localizedTextHtml({
                zh: "短语已复制到剪贴板！",
                en: "Phrase copied to clipboard!",
            }),
            localizedTextHtml({
                zh: "短语已复制到剪贴板！",
                en: "Phrase copied to clipboard!",
            }),
        );
    });
}
