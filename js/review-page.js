document.addEventListener('DOMContentLoaded', () => {
  const listEl = document.getElementById('review-list');
  if (!listEl) return;

  function render() {
    const items = getStarredPhrases().sort((a, b) =>
      String(b.createdAt || '').localeCompare(String(a.createdAt || ''))
    );
    listEl.innerHTML = '';
    if (!items.length) {
      const empty = document.createElement('p');
      empty.className = 'muted';
      empty.innerHTML =
        '<span class="zh">暂无收藏的短语。在每日课程中点击星标即可添加。</span><span class="en">No starred phrases yet. Tap the star next to a phrase on any daily lesson.</span>';
      listEl.appendChild(empty);
      return;
    }

    items.forEach((entry) => {
      const row = document.createElement('div');
      row.className = 'review-card';

      const phrase = document.createElement('p');
      phrase.className = 'review-phrase';
      phrase.textContent = entry.phrase;

      const meta = document.createElement('p');
      meta.className = 'review-meta';
      meta.innerHTML = `<span class="zh">第 ${entry.day} 天 · ${entry.lang}</span><span class="en">Day ${entry.day} · ${entry.lang}</span>`;
      if (entry.sectionTitle) {
        const sec = document.createElement('span');
        sec.textContent = ` — ${entry.sectionTitle}`;
        meta.appendChild(sec);
      }

      const actions = document.createElement('div');
      actions.className = 'review-actions';

      const openLink = document.createElement('a');
      openLink.className = 'home-btn';
      openLink.href = `day.html?day=${encodeURIComponent(entry.day)}&lang=${encodeURIComponent(entry.lang)}`;
      openLink.innerHTML =
        '<span class="zh">打开课程</span><span class="en">Open lesson</span>';

      const removeBtn = document.createElement('button');
      removeBtn.type = 'button';
      removeBtn.className = 'secondary-btn';
      removeBtn.textContent = 'Remove';
      removeBtn.addEventListener('click', () => {
        removeStarredPhrase(entry.id);
        render();
      });

      actions.appendChild(openLink);
      actions.appendChild(removeBtn);

      row.appendChild(phrase);
      row.appendChild(meta);
      row.appendChild(actions);
      listEl.appendChild(row);
    });
  }

  render();
});
