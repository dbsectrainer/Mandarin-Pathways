import { test, expect } from "@playwright/test";

test.describe("retention loop", () => {
    test("SRS review writes card state after grading", async ({ page }) => {
        await page.goto("/srs.html");
        await page.evaluate(() => {
            localStorage.setItem(
                "srsCards",
                JSON.stringify([
                    {
                        id: "test-card",
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
        await page.reload();

        await expect(page.locator(".srs-front")).toContainText("你好");
        await page.locator('[data-testid="srs-show-answer"]').click();
        await page.locator('[data-testid="srs-grade-good"]').click();

        const stored = await page.evaluate(() =>
            JSON.parse(localStorage.getItem("srsCards") || "[]"),
        );
        expect(stored[0].reps).toBe(1);
    });

    test("lesson completion records a learning streak", async ({ page }) => {
        await page.goto("/day.html?day=1&lang=zh", { waitUntil: "load" });
        await page.locator("#complete-btn").click();

        await expect
            .poll(async () =>
                page.evaluate(() => localStorage.getItem("streakCount")),
            )
            .toBe("1");
    });

    test("home dashboard surfaces SRS and streak state", async ({ page }) => {
        await page.goto("/");
        await page.evaluate(() => {
            localStorage.setItem("streakCount", "3");
            localStorage.setItem(
                "completedDays",
                JSON.stringify({
                    "1_zh": true,
                }),
            );
            localStorage.setItem(
                "placementResult",
                JSON.stringify({
                    recommendedDay: 8,
                }),
            );
            localStorage.setItem(
                "srsCards",
                JSON.stringify([
                    {
                        id: "due",
                        front: "谢谢",
                        back: "Thanks",
                        due: new Date(Date.now() - 1000).toISOString(),
                    },
                ]),
            );
        });
        await page.reload();

        await expect(page.locator("[data-streak-count]").first()).toHaveText(
            "3",
        );
        await expect(page.locator("#srs-due-count")).toHaveText("1");
        await expect(page.locator("#placement-start-day .zh")).toHaveText(
            "第8天",
        );
        await expect(
            page.locator(".achievement-badge").first().locator(".zh").first(),
        ).toHaveText("第一课");
        await expect(
            page.locator(".achievement-badge").first().locator(".en").first(),
        ).toBeHidden();

        await page.getByRole("button", { name: "English" }).click();

        await expect(page.locator("#placement-start-day .en")).toHaveText(
            "Day 8",
        );
        await expect(
            page.locator(".achievement-badge").first().locator(".en").first(),
        ).toHaveText("First lesson");
        await expect(
            page.locator(".achievement-badge").first().locator(".zh").first(),
        ).toBeHidden();
    });
});
