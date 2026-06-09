import { defineConfig } from "@playwright/test";

export default defineConfig({
    testDir: "tests/e2e",
    timeout: 60_000,
    expect: { timeout: 10_000 },
    use: {
        baseURL: "http://127.0.0.1:8000",
        trace: "on-first-retry",
    },
    webServer: {
        command: "python3 server.py",
        url: "http://127.0.0.1:8000",
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
    },
});
