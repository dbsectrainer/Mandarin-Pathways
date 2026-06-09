import { test, expect } from "@playwright/test";

test.describe("Self assessment", () => {
    test("placement test stores a recommendation", async ({ page }) => {
        await page.goto("/placement.html");

        await expect(
            page.getByRole("heading", { name: /Find your starting point/i }),
        ).toBeVisible();

        const answers = [
            "Hello",
            "xie xie",
            "I would like a glass of water",
            "这个多少钱？",
            "I want to watch a movie this weekend",
            "Menu",
            "我学中文学了两年。",
            "Cause and result",
            "Environmental protection",
            "Reduce waste",
        ];

        for (const answer of answers) {
            await page.getByLabel(answer).check();
        }

        await page.getByRole("button", { name: /Score placement/i }).click();
        await expect(page.getByTestId("placement-result")).toContainText(
            "Recommended start: Day 31",
        );

        const stored = await page.evaluate(() =>
            JSON.parse(localStorage.getItem("placementResult") || "{}"),
        );
        expect(stored.score).toBe(10);
        expect(stored.recommendedDay).toBe(31);
    });

    test("day quiz stores the best score", async ({ page }) => {
        await page.goto("/quiz.html?day=1");

        await expect(
            page.getByRole("heading", { name: /Quiz by day/i }),
        ).toBeVisible();
        await page.getByLabel("How are you?").check();
        await page.getByLabel("zai jian").check();
        await page.getByTestId("quiz-fill-3").fill("我");

        await page.getByRole("button", { name: /Score quiz/i }).click();
        await expect(page.getByTestId("quiz-result")).toContainText(
            "Day 1 score: 3/3",
        );

        const stored = await page.evaluate(() =>
            JSON.parse(localStorage.getItem("quizScores") || "{}"),
        );
        expect(stored.day1.bestScore).toBe(3);
        expect(stored.day1.total).toBe(3);
    });
});
