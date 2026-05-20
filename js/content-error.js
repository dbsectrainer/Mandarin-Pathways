/**
 * Render a bilingual error state when dynamic content fails to load (network/offline/cache miss).
 */
function showContentError(containerEl, options = {}) {
  if (!containerEl) return;
  const offline =
    typeof navigator !== 'undefined' && navigator.onLine === false;
  const fallbackZh =
    options.messageZh ||
    (offline
      ? '您当前处于离线状态，无法加载此内容。请联网后重试，或打开此前在线访问过的页面以使用缓存内容。'
      : '无法加载内容。请稍后重试或检查网络连接。');
  const fallbackEn =
    options.messageEn ||
    (offline
      ? "You're offline and this content isn't available from cache yet. Connect to the internet and try again, or open a lesson you visited before while online."
      : "Couldn't load this content. Check your connection and try again.");

  containerEl.innerHTML = `
    <div class="error content-error-banner" role="alert">
      <p><span class="zh">${fallbackZh}</span><span class="en">${fallbackEn}</span></p>
    </div>
  `;
}
