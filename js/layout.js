/**
 * Injects the shared site header (brand, nav, language selector) and footer
 * sitemap into #site-header / #site-footer placeholders.
 *
 * Load-order contract: include with `defer` BEFORE js/i18n.js and
 * js/lang-switcher.js so the injected .language-btn elements and trilingual
 * spans exist when the language handlers bind on DOMContentLoaded.
 *
 * Adding a new top-level page: add it to NAV_LINKS or FOOTER_COLUMNS below,
 * add the file to STATIC_ASSETS in sw.js, and bump CACHE_VERSION there.
 */
(function () {
    "use strict";

    function span2(zh, en) {
        return (
            '<span class="zh">' + zh + '</span><span class="en">' + en + "</span>"
        );
    }

    var NAV_LINKS = [
        { href: "index.html", zh: "首页", en: "Home" },
        { href: "stories.html", zh: "故事", en: "Stories" },
        { href: "course.html", zh: "课程", en: "Course" },
        { href: "learn.html", zh: "学习指南", en: "Learn" },
        { href: "teachers.html", zh: "教师专区", en: "For Teachers" },
        { href: "faq.html", zh: "常见问题", en: "FAQ" },
        { href: "dashboard.html", zh: "我的进度", en: "My Progress" },
    ];

    var FOOTER_COLUMNS = [
        {
            title: { zh: "学习", en: "Learn" },
            links: [
                { href: "course.html", zh: "课程", en: "The course" },
                { href: "stories.html", zh: "全部故事", en: "All stories" },
                { href: "placement.html", zh: "水平测试", en: "Placement test" },
                { href: "reading.html", zh: "阅读练习", en: "Reading practice" },
                { href: "writing.html", zh: "写作练习", en: "Writing practice" },
                {
                    href: "stories.html#supplementary",
                    zh: "补充主题",
                    en: "Supplementary topics",
                },
            ],
        },
        {
            title: { zh: "练习", en: "Practice" },
            links: [
                { href: "quiz.html", zh: "自我测验", en: "Quiz" },
                { href: "srs.html", zh: "间隔复习卡", en: "SRS flashcards" },
                {
                    href: "review.html",
                    zh: "复习收藏短语",
                    en: "Review starred phrases",
                },
                { href: "dashboard.html", zh: "我的进度", en: "My Progress" },
            ],
        },
        {
            title: { zh: "关于", en: "About" },
            links: [
                { href: "faq.html", zh: "常见问题", en: "FAQ" },
                { href: "teachers.html", zh: "教师专区", en: "For Teachers" },
                { href: "contact.html", zh: "联系我们", en: "Contact" },
                {
                    href: "https://github.com/dbsectrainer/Mandarin-Pathways",
                    zh: "GitHub 仓库",
                    en: "GitHub repo",
                    external: true,
                },
            ],
        },
    ];

    function currentPageFile() {
        var file = window.location.pathname.split("/").pop();
        return file === "" ? "index.html" : file;
    }

    function buildHeader() {
        var current = currentPageFile();
        var navItems = NAV_LINKS.map(function (link) {
            var currentAttr =
                link.href === current ? ' aria-current="page"' : "";
            return (
                '<a href="' +
                link.href +
                '"' +
                currentAttr +
                ">" +
                span2(link.zh, link.en) +
                "</a>"
            );
        }).join("");

        return (
            '<header class="site-header" data-site-chrome>' +
            '<a class="site-brand" href="index.html">' +
            "<h1>Mandarin Pathways</h1>" +
            "</a>" +
            '<nav class="site-nav" aria-label="Main navigation">' +
            navItems +
            "</nav>" +
            '<div class="language-selector">' +
            '<button class="language-btn" data-lang="zh" aria-label="Switch to Simplified Chinese">' +
            '<span class="flag">🇨🇳</span> 简体中文</button>' +
            '<button class="language-btn" data-lang="pinyin" aria-label="Switch to Pinyin">' +
            '<span class="flag">🔤</span> Pinyin</button>' +
            '<button class="language-btn" data-lang="en" aria-label="Switch to English">' +
            '<span class="flag">🇺🇸</span> English</button>' +
            "</div>" +
            "</header>" +
            "<noscript><p>JavaScript is required for navigation and lessons. " +
            'Start from <a href="index.html">the home page</a>.</p></noscript>'
        );
    }

    function buildFooter() {
        var columns = FOOTER_COLUMNS.map(function (col) {
            var links = col.links
                .map(function (link) {
                    var externalAttrs = link.external
                        ? ' target="_blank" rel="noopener"'
                        : "";
                    return (
                        '<li><a href="' +
                        link.href +
                        '"' +
                        externalAttrs +
                        ">" +
                        span2(link.zh, link.en) +
                        "</a></li>"
                    );
                })
                .join("");
            return (
                '<div class="footer-col"><h4>' +
                span2(col.title.zh, col.title.en) +
                "</h4><ul>" +
                links +
                "</ul></div>"
            );
        }).join("");

        return (
            '<footer class="site-footer" data-site-chrome>' +
            '<div class="site-footer-columns">' +
            columns +
            "</div>" +
            '<p class="footer-copyright">&copy; 2026 Mandarin Pathways | ' +
            span2("赋能中文学习", "Empowering Chinese Language Learning") +
            "</p>" +
            "</footer>"
        );
    }

    var headerSlot = document.getElementById("site-header");
    if (headerSlot) {
        headerSlot.outerHTML = buildHeader();
    }

    var footerSlot = document.getElementById("site-footer");
    if (footerSlot) {
        footerSlot.outerHTML = buildFooter();
    }

    // One shared return-to-top control (styled by styles.min.css, wired by
    // return-to-top.js which must load after this file).
    if (!document.getElementById("returnToTop")) {
        var toTop = document.createElement("div");
        toTop.className = "return-to-top";
        toTop.id = "returnToTop";
        toTop.innerHTML = '<i class="fas fa-arrow-up"></i>';
        document.body.appendChild(toTop);
    }
})();
