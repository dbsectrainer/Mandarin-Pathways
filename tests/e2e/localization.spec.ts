import { test, expect } from "@playwright/test";

test.describe("page localization", () => {
    test("placement static and result UI follow lang", async ({ page }) => {
        await page.goto("/placement.html?lang=zh", { waitUntil: "load" });
        await expect(page.locator("#placement-title .zh")).toHaveText(
            "找到你的起点",
        );
        await expect(page.locator("#placement-title .en")).toBeHidden();

        await page.evaluate(() => {
            localStorage.setItem(
                "placementResult",
                JSON.stringify({
                    score: 5,
                    total: 10,
                    percentage: 50,
                    level: "Upper beginner",
                    recommendedDay: 8,
                    message: {
                        zh: "从第一周后开始学习，并根据需要复习前面的课程。",
                        en: "Begin after the first week and review earlier lessons as needed.",
                    },
                }),
            );
        });
        await page.reload({ waitUntil: "load" });
        await expect(page.locator("#placement-result h2 .zh")).toContainText(
            "建议起点：第 8 天",
        );
        await expect(page.locator("#placement-result h2 .en")).toBeHidden();

        await page.goto("/placement.html?lang=en", { waitUntil: "load" });
        await expect(page.locator("#placement-title .en")).toHaveText(
            "Find your starting point",
        );
        await expect(page.locator("#placement-title .zh")).toBeHidden();
    });

    test("quiz static UI follows selected language", async ({ page }) => {
        await page.goto("/quiz.html?day=1&lang=zh", { waitUntil: "load" });
        await expect(page.locator("#quiz-title .zh")).toHaveText("按天测验");
        await expect(page.locator("#quiz-title .en")).toBeHidden();

        await page.goto("/quiz.html?day=1&lang=en", { waitUntil: "load" });
        await expect(page.locator("#quiz-title .en")).toHaveText("Quiz by day");
        await expect(page.locator("#quiz-title .zh")).toBeHidden();
    });

    test("quiz result UI follows lang after submit", async ({ page }) => {
        await page.goto("/quiz.html?day=1&lang=zh", { waitUntil: "load" });
        await page
            .locator('input[name="question-0"][value="How are you?"]')
            .check();
        await page
            .locator('input[name="question-1"][value="zai jian"]')
            .check();
        await page.locator('input[name="question-2"]').fill("我");
        await page.locator("#quiz-submit").click();
        await expect(page.locator("#quiz-result .zh").first()).toContainText(
            "第 1 天得分",
        );
        await expect(page.locator("#quiz-result .en").first()).toBeHidden();
    });

    test("supplementary complete action follows lang", async ({ page }) => {
        await page.goto("/supplementary.html?category=education&lang=zh", {
            waitUntil: "load",
        });
        await page.locator("#complete-btn").click();
        await expect(page.locator("#complete-btn .zh")).toHaveText("已完成");
        await expect(page.locator("#complete-btn .en")).toBeHidden();
        await expect(page.locator("#copy-notification .zh")).toHaveText(
            "分类已标记为完成！",
        );
    });

    test("reading complete action follows lang", async ({ page }) => {
        await page.goto(
            "/reading.html?level=beginner&topic=Self%20Introduction&lang=zh",
            { waitUntil: "load" },
        );
        await expect(page.locator("#complete-btn")).toBeVisible({
            timeout: 15000,
        });
        await page.locator("#complete-btn").click();
        await expect(page.locator("#copy-notification .zh")).toHaveText(
            "阅读已标记为完成！",
        );
        await expect(page.locator("#copy-notification .en")).toBeHidden();
    });

    test("writing complete action follows pinyin mode", async ({ page }) => {
        await page.goto(
            "/writing.html?type=character&level=Basic%20Strokes&lang=pinyin",
            { waitUntil: "load" },
        );
        await expect(page.locator("#complete-btn")).toBeVisible({
            timeout: 15000,
        });
        await page.locator("#complete-btn").click();
        await expect(page.locator("#complete-btn .pinyin")).toHaveText(
            "Yǐ wánchéng",
        );
        await expect(page.locator("#complete-btn .zh")).toBeHidden();
        await expect(page.locator("#complete-btn .en")).toBeHidden();
    });

    test("review remove button follows lang", async ({ page }) => {
        await page.goto("/review.html?lang=zh", { waitUntil: "load" });
        await page.evaluate(() => {
            localStorage.setItem(
                "starredPhrases",
                JSON.stringify([
                    {
                        id: "test-star",
                        phrase: "你好",
                        day: 1,
                        lang: "zh",
                        createdAt: new Date().toISOString(),
                    },
                ]),
            );
        });
        await page.reload({ waitUntil: "load" });
        await expect(page.locator(".review-actions button .zh")).toHaveText(
            "移除",
        );
        await expect(page.locator(".review-actions button .en")).toBeHidden();
    });

    test("srs session controls follow lang", async ({ page }) => {
        await page.goto("/srs.html?lang=zh", { waitUntil: "load" });
        await page.evaluate(() => {
            localStorage.setItem(
                "srsCards",
                JSON.stringify([
                    {
                        id: "loc-card",
                        day: 1,
                        lang: "zh",
                        front: "你好",
                        back: "Hello",
                        due: new Date(Date.now() - 1000).toISOString(),
                        interval: 0,
                        ease: 2.5,
                        reps: 0,
                    },
                ]),
            );
        });
        await page.reload({ waitUntil: "load" });
        await expect(
            page.locator('[data-testid="srs-show-answer"] .zh'),
        ).toHaveText("显示答案");
        await expect(
            page.locator('[data-testid="srs-show-answer"] .en'),
        ).toBeHidden();
        await page.locator('[data-testid="srs-show-answer"]').click();
        await expect(
            page.locator('[data-testid="srs-grade-good"] .zh'),
        ).toHaveText("良好");
    });
});
