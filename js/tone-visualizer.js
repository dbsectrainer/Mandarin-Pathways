/**
 * Mandarin tone contour rendering for offline/static lesson pages.
 */
(function () {
    "use strict";

    const SVG_NS = "http://www.w3.org/2000/svg";
    const DEFAULTS = {
        width: 44,
        height: 28,
        strokeWidth: 3,
        showSyllable: false,
    };

    const TONE_LABELS = {
        1: "first tone, high and level",
        2: "second tone, rising",
        3: "third tone, dipping then rising",
        4: "fourth tone, falling",
        5: "neutral tone, light and short",
    };

    const TONE_PATHS = {
        1: "M6 9 L38 9",
        2: "M7 22 C15 18 25 11 37 6",
        3: "M7 10 C14 24 24 24 37 8",
        4: "M7 6 C18 9 28 15 37 23",
        5: "M15 15 L29 15",
    };

    const TONE_COLORS = {
        1: "#2563eb",
        2: "#16a34a",
        3: "#ca8a04",
        4: "#dc2626",
        5: "#64748b",
    };

    const MARKED_VOWELS = {
        ā: ["a", 1],
        á: ["a", 2],
        ǎ: ["a", 3],
        à: ["a", 4],
        ē: ["e", 1],
        é: ["e", 2],
        ě: ["e", 3],
        è: ["e", 4],
        ī: ["i", 1],
        í: ["i", 2],
        ǐ: ["i", 3],
        ì: ["i", 4],
        ō: ["o", 1],
        ó: ["o", 2],
        ǒ: ["o", 3],
        ò: ["o", 4],
        ū: ["u", 1],
        ú: ["u", 2],
        ǔ: ["u", 3],
        ù: ["u", 4],
        ǖ: ["u", 1],
        ǘ: ["u", 2],
        ǚ: ["u", 3],
        ǜ: ["u", 4],
        ü: ["u", 5],
    };

    function clampTone(tone) {
        const value = Number(tone);
        return value >= 1 && value <= 5 ? value : 5;
    }

    function getToneNumber(syllable) {
        const text = String(syllable || "")
            .trim()
            .toLowerCase();
        const digit = text.match(/[1-5](?!.*[1-5])/);
        if (digit) return Number(digit[0]);

        for (const char of text) {
            if (MARKED_VOWELS[char]) return MARKED_VOWELS[char][1];
        }

        return 5;
    }

    function stripToneMarks(syllable) {
        return String(syllable || "")
            .replace(/[1-5]/g, "")
            .split("")
            .map((char) =>
                MARKED_VOWELS[char] ? MARKED_VOWELS[char][0] : char,
            )
            .join("");
    }

    function splitPinyin(pinyin) {
        return String(pinyin || "")
            .trim()
            .split(/\s+/)
            .filter(Boolean);
    }

    function createSvgEl(name, attrs) {
        const el = document.createElementNS(SVG_NS, name);
        Object.entries(attrs || {}).forEach(([key, value]) => {
            el.setAttribute(key, String(value));
        });
        return el;
    }

    function createGlyph(syllable, options) {
        const settings = { ...DEFAULTS, ...(options || {}) };
        const tone = clampTone(
            options && options.tone ? options.tone : getToneNumber(syllable),
        );
        const label = TONE_LABELS[tone];
        const svg = createSvgEl("svg", {
            class: `tone-glyph tone-${tone}`,
            viewBox: "0 0 44 28",
            width: settings.width,
            height: settings.height,
            role: "img",
            "aria-label": `${stripToneMarks(syllable) || "syllable"}: ${label}`,
            "data-tone": tone,
            "data-syllable": stripToneMarks(syllable),
        });

        svg.appendChild(
            createSvgEl("path", {
                d: "M5 5 H39 M5 14 H39 M5 23 H39",
                fill: "none",
                stroke: "#e2e8f0",
                "stroke-width": "1",
                "stroke-linecap": "round",
            }),
        );
        svg.appendChild(
            createSvgEl("path", {
                d: TONE_PATHS[tone],
                fill: "none",
                stroke: TONE_COLORS[tone],
                "stroke-width": settings.strokeWidth,
                "stroke-linecap": "round",
                "stroke-linejoin": "round",
            }),
        );

        if (settings.showSyllable) {
            svg.appendChild(
                createSvgEl("text", {
                    x: "22",
                    y: "27",
                    "text-anchor": "middle",
                    "font-size": "7",
                    fill: "#475569",
                }),
            ).textContent = stripToneMarks(syllable);
        }

        return svg;
    }

    function renderPhrase(pinyin, options) {
        const wrapper = document.createElement("span");
        wrapper.className = "tone-visualizer";
        wrapper.setAttribute("aria-label", `Tone contours for ${pinyin}`);

        splitPinyin(pinyin).forEach((syllable) => {
            const item = document.createElement("span");
            item.className = "tone-syllable";
            item.style.display = "inline-flex";
            item.style.alignItems = "center";
            item.style.gap = "0.25rem";
            item.style.marginRight = "0.35rem";
            item.dataset.tone = String(getToneNumber(syllable));
            item.dataset.syllable = stripToneMarks(syllable);

            const text = document.createElement("span");
            text.className = "tone-syllable-text";
            text.textContent = syllable;
            item.appendChild(text);
            item.appendChild(createGlyph(syllable, options));
            wrapper.appendChild(item);
        });

        return wrapper;
    }

    function renderInto(container, pinyin, options) {
        const target =
            typeof container === "string"
                ? document.querySelector(container)
                : container;
        if (!target) {
            throw new Error(
                "MandarinTones.renderInto requires a target element.",
            );
        }

        const node = renderPhrase(pinyin, options);
        target.appendChild(node);
        return node;
    }

    function annotateElement(element, options) {
        const target =
            typeof element === "string"
                ? document.querySelector(element)
                : element;
        if (!target) {
            throw new Error(
                "MandarinTones.annotateElement requires a target element.",
            );
        }

        const pinyin = target.dataset.pinyin || target.textContent || "";
        target.appendChild(renderPhrase(pinyin, options));
        return target;
    }

    function appendToneGlyphs(container, pinyin, options) {
        const target =
            typeof container === "string"
                ? document.querySelector(container)
                : container;
        if (!target) {
            throw new Error(
                "MandarinTones.appendToneGlyphs requires a target element.",
            );
        }
        const glyphList = document.createElement("span");
        glyphList.className = "tone-glyph-list";
        splitPinyin(pinyin).forEach((syllable) => {
            glyphList.appendChild(createGlyph(syllable, options));
        });
        target.appendChild(glyphList);
        return glyphList;
    }

    window.MandarinTones = {
        VERSION: "0.1.0",
        getToneNumber,
        stripToneMarks,
        splitPinyin,
        createGlyph,
        renderPhrase,
        renderInto,
        annotateElement,
        appendToneGlyphs,
        labels: { ...TONE_LABELS },
    };
})();
