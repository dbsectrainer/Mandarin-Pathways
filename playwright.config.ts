import { defineConfig } from "@playwright/test";

// Optional override for environments with a pre-installed Chromium whose
// version differs from the one this Playwright release would download
// (e.g. CHROMIUM_EXECUTABLE_PATH=/opt/pw-browsers/chromium).
const chromiumExecutablePath = process.env.CHROMIUM_EXECUTABLE_PATH;

export default defineConfig({
    testDir: "tests/e2e",
    timeout: 60_000,
    expect: { timeout: 10_000 },
    use: {
        baseURL: "http://127.0.0.1:8000",
        trace: "on-first-retry",
        ...(chromiumExecutablePath
            ? { launchOptions: { executablePath: chromiumExecutablePath } }
            : {}),
    },
    webServer: {
        command: "python3 server.py",
        url: "http://127.0.0.1:8000",
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
    },
});
