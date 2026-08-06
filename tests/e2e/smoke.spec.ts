import { test, expect } from "@playwright/test";

test.describe("PWA smoke", () => {
    test("home loads and language controls exist", async ({ page }) => {
        await page.goto("/");
        await expect(page.locator("header h1")).toContainText(
            "Mandarin Pathways",
        );
        await expect(page.locator("header .language-btn")).toHaveCount(3);
    });

    test("injected site nav is present and localized", async ({ page }) => {
        // Guards the layout.js-before-i18n.js defer-order contract: with
        // ?lang=en the injected nav labels must show English spans only.
        await page.goto("/dashboard.html?lang=en", { waitUntil: "load" });
        const storiesLink = page.locator('header .site-nav a[href="stories.html"]');
        await expect(storiesLink.locator(".en")).toHaveText("Stories");
        await expect(storiesLink.locator(".zh")).toBeHidden();
        await expect(page.locator("header .site-nav a")).toHaveCount(7);
    });

    test("stories index renders 40 day cards across 5 stages", async ({
        page,
    }) => {
        await page.goto("/stories.html", { waitUntil: "load" });
        await expect(page.locator("[data-day-grid]")).toHaveCount(5);
        await expect(page.locator("[data-day-grid] .story-card")).toHaveCount(
            40,
        );
        await expect(
            page.locator("#reading-card-grid .story-card"),
        ).toHaveCount(5);
        await expect(
            page.locator("#supplementary-card-grid .story-card"),
        ).toHaveCount(5);
    });

    test("new static pages load with shared chrome", async ({ page }) => {
        for (const path of [
            "/course.html",
            "/learn.html",
            "/teachers.html",
            "/faq.html",
            "/contact.html",
        ]) {
            await page.goto(path, { waitUntil: "domcontentloaded" });
            await expect(page.locator("header h1")).toContainText(
                "Mandarin Pathways",
            );
            await expect(page.locator("footer .site-footer-columns")).toBeAttached();
        }
    });

    test("completing a day marks its story card", async ({ page }) => {
        await page.goto("/stories.html", { waitUntil: "load" });
        await page.evaluate(() => {
            localStorage.setItem(
                "completedDays",
                JSON.stringify({ "1_zh": true }),
            );
            localStorage.setItem("preferredLanguage", "zh-CN");
        });
        await page.reload({ waitUntil: "load" });
        await expect(
            page.locator("[data-day-grid] .story-card").first(),
        ).toHaveClass(/completed/);
    });

    test("lesson text asset is reachable", async ({ request }) => {
        const res = await request.get("/text_files/day1_zh.txt");
        expect(res.ok()).toBeTruthy();
        const body = await res.text();
        expect(body.length).toBeGreaterThan(20);
    });

    test("writing asset is reachable", async ({ request }) => {
        const res = await request.get(
            "/writing_files/character_basic_strokes_en.txt",
        );
        expect(res.ok()).toBeTruthy();
        const body = await res.text();
        expect(body.length).toBeGreaterThan(20);
    });

    test("day lesson shell renders", async ({ page }) => {
        await page.goto("/day.html?day=1&lang=zh", { waitUntil: "load" });
        await expect(page.locator("#text-content")).toBeAttached();
        await expect(page.locator("#complete-btn")).toBeVisible();
    });

    test("day lesson dynamic UI follows selected language", async ({
        page,
    }) => {
        await page.goto("/day.html?day=1&lang=zh", { waitUntil: "load" });
        await expect(page.locator("#section-title .zh")).toHaveText(
            "拼音系统与发音",
        );
        await expect(page.locator("#section-title .en")).toBeHidden();

        await page.locator("#complete-btn").click();
        await expect(page.locator("#complete-btn .zh")).toHaveText("已完成");
        await expect(page.locator("#complete-btn .en")).toBeHidden();
        await expect(page.locator("#copy-notification .zh")).toHaveText(
            "已标记为完成！",
        );

        await page.goto("/day.html?day=8&lang=en", { waitUntil: "load" });
        await expect(page.locator("#section-title .en")).toHaveText(
            "Essential Daily Phrases",
        );
        await expect(page.locator("#section-title .zh")).toBeHidden();

        await page.goto("/day.html?day=1&lang=pinyin", { waitUntil: "load" });
        await expect(page.locator("#audio-fallback .zh")).toHaveText(
            "使用普通话音频作为参考。",
        );
        await expect(page.locator("#audio-fallback .en")).toBeHidden();
    });

    test("writing shell renders with URL selection", async ({ page }) => {
        await page.goto(
            "/writing.html?type=character&level=Basic%20Strokes&lang=en",
            {
                waitUntil: "load",
            },
        );
        await expect(page.locator("#writing-content")).toBeAttached();
        await expect(page.locator("#complete-btn")).toBeVisible();
    });

    test("tone glyphs render in pinyin mode on day.html", async ({ page }) => {
        await page.goto("/day.html?day=1&lang=pinyin", { waitUntil: "load" });
        await expect(page.locator(".tone-glyph").first()).toBeVisible({
            timeout: 5000,
        });
        expect(await page.locator(".tone-glyph").count()).toBeGreaterThan(0);
    });

    test("stroke-order panel renders on writing.html", async ({ page }) => {
        await page.goto(
            "/writing.html?type=character&level=Basic%20Strokes&lang=en",
            { waitUntil: "load" },
        );
        const panel = page.locator(".stroke-order-panel").first();
        await expect(panel).toBeVisible({ timeout: 5000 });
        await expect(panel.locator("svg").first()).toBeAttached();
    });
});
