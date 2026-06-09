/**
 * Offline SVG character writer with a small Hanzi Writer-like API surface.
 */
(function () {
    "use strict";

    const SVG_NS = "http://www.w3.org/2000/svg";
    const DEFAULTS = {
        width: 180,
        height: 180,
        padding: 14,
        strokeColor: "#111827",
        outlineColor: "#cbd5e1",
        highlightColor: "#dc2626",
        gridColor: "#e2e8f0",
        strokeWidth: 8,
        delayBetweenStrokes: 450,
        showCharacter: true,
        showOutline: true,
        showGrid: true,
    };

    const CHARACTER_DATA = {
        一: ["M36 92 L144 92"],
        二: ["M44 68 L136 68", "M32 112 L148 112"],
        三: ["M42 54 L138 54", "M36 90 L144 90", "M28 126 L152 126"],
        人: ["M91 36 C86 70 70 105 43 139", "M91 49 C105 88 125 119 148 139"],
        大: [
            "M90 30 L90 146",
            "M47 78 L137 78",
            "M89 79 C78 111 61 132 39 147",
            "M92 82 C105 114 123 135 149 148",
        ],
        小: [
            "M90 36 L90 148",
            "M62 83 C55 101 48 116 38 130",
            "M118 82 C126 100 135 115 145 130",
        ],
        口: ["M45 48 L137 48 L137 135 L45 135 Z"],
        日: ["M48 36 L136 36 L136 148 L48 148 Z", "M50 91 L134 91"],
        月: [
            "M58 34 L134 34 L134 148",
            "M58 34 L58 82 C58 112 50 133 39 150",
            "M61 78 L132 78",
            "M60 113 L132 113",
        ],
        中: ["M45 55 L137 55 L137 122 L45 122 Z", "M91 30 L91 151"],
        山: ["M42 88 L42 141 L143 141 L143 88", "M91 42 L91 140"],
        田: [
            "M44 38 L140 38 L140 144 L44 144 Z",
            "M44 91 L140 91",
            "M92 39 L92 144",
        ],
        木: [
            "M91 30 L91 150",
            "M43 77 L139 77",
            "M89 79 C73 108 55 130 34 146",
            "M94 80 C111 110 128 130 151 146",
        ],
        水: [
            "M91 32 L91 149",
            "M57 75 C50 90 43 103 32 117",
            "M92 78 C108 112 124 132 150 148",
            "M91 82 C77 106 64 123 48 138",
        ],
        火: [
            "M88 62 C83 103 66 130 39 148",
            "M103 86 C117 116 132 135 151 148",
            "M62 48 C61 66 56 80 48 93",
            "M123 47 C119 66 113 80 103 94",
        ],
        女: [
            "M91 36 C82 66 72 93 60 118",
            "M48 88 C78 106 111 126 143 149",
            "M41 136 C74 130 105 117 134 94",
        ],
        子: ["M61 42 L124 42 C112 57 102 68 91 77 L91 149", "M39 91 L149 91"],
        好: [
            "M65 37 C56 70 48 96 37 124",
            "M31 88 C55 106 76 125 93 148",
            "M27 135 C55 129 78 117 95 96",
            "M104 42 L145 42 C136 56 126 69 114 78 L114 149",
            "M92 94 L155 94",
        ],
        你: [
            "M68 35 C57 62 45 83 32 102",
            "M55 78 L55 150",
            "M101 36 C94 55 86 72 75 88",
            "M97 58 L144 58 C138 76 131 91 122 105",
            "M111 88 L111 150",
            "M88 111 C81 123 74 132 64 141",
            "M134 110 C143 123 150 133 156 143",
        ],
        我: [
            "M49 50 C77 48 102 43 126 35",
            "M42 83 L136 73",
            "M39 116 L137 105",
            "M82 34 L82 146",
            "M111 33 C111 83 124 122 153 147",
            "M141 52 C130 76 118 96 104 112",
            "M58 126 C72 121 86 115 101 108",
        ],
    };

    function resolveTarget(target) {
        if (typeof target === "string")
            return (
                document.getElementById(target) ||
                document.querySelector(target)
            );
        return target;
    }

    function createSvgEl(name, attrs) {
        const el = document.createElementNS(SVG_NS, name);
        Object.entries(attrs || {}).forEach(([key, value]) => {
            el.setAttribute(key, String(value));
        });
        return el;
    }

    function estimateStrokeCount(character) {
        const code = character ? character.codePointAt(0) || 0 : 0;
        return Math.max(1, Math.min(10, (code % 7) + 3));
    }

    function generatedStrokes(character) {
        const count = estimateStrokeCount(character);
        const strokes = [];
        for (let i = 0; i < count; i += 1) {
            const y = 44 + i * (92 / Math.max(1, count - 1));
            const x1 = 44 + (i % 3) * 9;
            const x2 = 136 - (i % 2) * 13;
            strokes.push(
                `M${x1} ${y.toFixed(1)} L${x2} ${(y + (i % 2 ? 16 : -10)).toFixed(1)}`,
            );
        }
        return strokes;
    }

    function getStrokes(character) {
        return CHARACTER_DATA[character] || generatedStrokes(character);
    }

    class HanziWriterLiteInstance {
        constructor(target, character, options) {
            this.target = resolveTarget(target);
            if (!this.target)
                throw new Error(
                    "HanziWriterLite.create requires a target element.",
                );
            this.character = character || "";
            this.options = { ...DEFAULTS, ...(options || {}) };
            this.timers = [];
            this.paths = [];
            this.render();
        }

        render() {
            this.cancelAnimation();
            this.target.innerHTML = "";
            this.svg = createSvgEl("svg", {
                class: "hanzi-writer-lite",
                viewBox: "0 0 180 180",
                width: this.options.width,
                height: this.options.height,
                role: "img",
                "aria-label": `Stroke order practice for ${this.character}`,
                "data-character": this.character,
            });

            if (this.options.showGrid) this.drawGrid();
            if (this.options.showCharacter) this.drawReferenceCharacter();
            if (this.options.showOutline) this.drawOutline();
            this.drawStrokes();
            this.target.appendChild(this.svg);

            const existingNote = this.target.querySelector(
                ".hanzi-writer-lite-estimated",
            );
            if (existingNote) existingNote.remove();
            if (!CHARACTER_DATA[this.character]) {
                const note = document.createElement("small");
                note.className = "hanzi-writer-lite-estimated";
                note.style.cssText =
                    "display:block;text-align:center;font-size:0.7em;color:#94a3b8;margin-top:2px";
                note.textContent = "stroke order estimated";
                this.target.appendChild(note);
            }

            return this;
        }

        drawGrid() {
            [
                "M15 90 L165 90",
                "M90 15 L90 165",
                "M15 15 L165 165",
                "M165 15 L15 165",
            ].forEach((d) => {
                this.svg.appendChild(
                    createSvgEl("path", {
                        d,
                        fill: "none",
                        stroke: this.options.gridColor,
                        "stroke-width": "1",
                        "stroke-dasharray": "4 4",
                    }),
                );
            });
        }

        drawReferenceCharacter() {
            const text = createSvgEl("text", {
                x: "90",
                y: "126",
                "text-anchor": "middle",
                "font-size": "116",
                "font-family": "KaiTi, STKaiti, serif",
                fill: "#f1f5f9",
            });
            text.textContent = this.character;
            this.svg.appendChild(text);
        }

        drawOutline() {
            getStrokes(this.character).forEach((d) => {
                this.svg.appendChild(
                    createSvgEl("path", {
                        class: "hanzi-writer-lite-outline",
                        d,
                        fill: "none",
                        stroke: this.options.outlineColor,
                        "stroke-width": this.options.strokeWidth + 2,
                        "stroke-linecap": "round",
                        "stroke-linejoin": "round",
                        opacity: "0.55",
                    }),
                );
            });
        }

        drawStrokes() {
            this.paths = getStrokes(this.character).map((d, index) => {
                const path = createSvgEl("path", {
                    class: "hanzi-writer-lite-stroke",
                    d,
                    fill: "none",
                    stroke: this.options.strokeColor,
                    "stroke-width": this.options.strokeWidth,
                    "stroke-linecap": "round",
                    "stroke-linejoin": "round",
                    "data-stroke-index": index + 1,
                });
                this.svg.appendChild(path);
                return path;
            });
        }

        setCharacter(character) {
            this.character = character || "";
            return this.render();
        }

        animateCharacter(options) {
            const settings = { ...this.options, ...(options || {}) };
            this.cancelAnimation();
            this.paths.forEach((path) => {
                path.style.opacity = "0";
                path.style.stroke = settings.highlightColor;
            });

            this.paths.forEach((path, index) => {
                const timer = window.setTimeout(() => {
                    path.style.opacity = "1";
                    if (
                        index === this.paths.length - 1 &&
                        typeof settings.onComplete === "function"
                    ) {
                        settings.onComplete();
                    }
                }, index * settings.delayBetweenStrokes);
                this.timers.push(timer);
            });

            return Promise.resolve(this);
        }

        showOutline() {
            this.options.showOutline = true;
            return this.render();
        }

        hideOutline() {
            this.options.showOutline = false;
            return this.render();
        }

        quiz(options) {
            const settings = { ...this.options, ...(options || {}) };
            this.svg.dataset.mode = "quiz";
            this.paths.forEach((path) => {
                path.style.opacity = "0.2";
                path.style.stroke = settings.outlineColor;
            });
            if (typeof settings.onComplete === "function") {
                settings.onComplete({ character: this.character, mistakes: 0 });
            }
            return this;
        }

        cancelAnimation() {
            this.timers.forEach((timer) => window.clearTimeout(timer));
            this.timers = [];
            return this;
        }

        destroy() {
            this.cancelAnimation();
            this.target.innerHTML = "";
        }
    }

    function create(target, character, options) {
        return new HanziWriterLiteInstance(target, character, options);
    }

    function registerCharacterData(character, strokes) {
        if (!character || !Array.isArray(strokes) || strokes.length === 0) {
            throw new Error(
                "registerCharacterData requires a character and a non-empty stroke path array.",
            );
        }
        CHARACTER_DATA[character] = strokes.slice();
    }

    function loadCharacterData(character) {
        return Promise.resolve({
            character,
            strokes: getStrokes(character).slice(),
            source: CHARACTER_DATA[character] ? "bundled" : "generated",
        });
    }

    window.HanziWriterLite = {
        VERSION: "0.1.0",
        create,
        loadCharacterData,
        registerCharacterData,
        hasCharacterData(character) {
            return Boolean(CHARACTER_DATA[character]);
        },
    };
})();
