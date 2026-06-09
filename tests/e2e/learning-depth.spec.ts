import { expect, test } from "@playwright/test";

test.describe("Phase 3 learning depth support", () => {
    test("tone visualizer and writer globals render offline widgets", async ({
        page,
    }) => {
        await page.goto("/");
        await page.setContent(`
            <main>
                <div id="tones"></div>
                <div id="writer"></div>
            </main>
        `);
        await page.addScriptTag({ url: "/js/tone-visualizer.js" });
        await page.addScriptTag({ url: "/js/hanzi-writer-lite.js" });

        const result = await page.evaluate(async () => {
            window.MandarinTones.renderInto("#tones", "ma1 ma2 ma3 ma4 ma5");
            const writer = window.HanziWriterLite.create("writer", "你", {
                width: 120,
                height: 120,
                delayBetweenStrokes: 1,
            });
            const data = await window.HanziWriterLite.loadCharacterData("你");
            await writer.animateCharacter();

            return {
                tones: Array.from(
                    document.querySelectorAll("#tones .tone-glyph"),
                ).map((el) => el.getAttribute("data-tone")),
                writerCharacter: document
                    .querySelector("#writer svg")
                    ?.getAttribute("data-character"),
                strokeCount: document.querySelectorAll(
                    "#writer .hanzi-writer-lite-stroke",
                ).length,
                dataSource: data.source,
            };
        });

        expect(result.tones).toEqual(["1", "2", "3", "4", "5"]);
        expect(result.writerCharacter).toBe("你");
        expect(result.strokeCount).toBeGreaterThan(1);
        expect(result.dataSource).toBe("bundled");
    });
});
