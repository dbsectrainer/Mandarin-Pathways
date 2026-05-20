document.addEventListener('DOMContentLoaded', function () {
  const urlParams = new URLSearchParams(window.location.search);
  const rawDay = parseInt(urlParams.get('day'), 10);
  const day = Number.isFinite(rawDay) && rawDay >= 1 && rawDay <= 40 ? rawDay : 1;
  const lang = urlParams.get('lang') || 'zh';

  document.getElementById('day-number').textContent = day;

  const completedDays = JSON.parse(localStorage.getItem('completedDays') || '{}');
  const completeBtn = document.getElementById('complete-btn');

  if (completedDays[`${day}_${lang}`]) {
    completeBtn.classList.add('completed');
    completeBtn.innerHTML = '<i class="fas fa-check-circle"></i> Completed';
    completeBtn.disabled = true;
  }

  completeBtn.addEventListener('click', () => {
    completedDays[`${day}_${lang}`] = true;
    localStorage.setItem('completedDays', JSON.stringify(completedDays));

    completeBtn.classList.add('completed');
    completeBtn.innerHTML = '<i class="fas fa-check-circle"></i> Completed';
    completeBtn.disabled = true;

    const totalCompleted = Object.keys(completedDays).filter((key) =>
      key.endsWith(`_${lang}`)
    ).length;

    localStorage.setItem(
      'currentProgress',
      JSON.stringify({
        lang: lang,
        completed: totalCompleted,
      })
    );

    updatePageProgress(lang, totalCompleted);

    const notification = document.getElementById('copy-notification');
    notification.textContent = 'Day marked as complete!';
    notification.style.display = 'block';
    notification.style.animation = 'none';
    notification.offsetHeight;
    notification.style.animation = 'fadeInOut 2s ease';
    setTimeout(() => {
      notification.style.display = 'none';
      notification.textContent = 'Phrase copied to clipboard!';
    }, 2000);
  });

  function updatePageProgress(langSel, completed) {
    const dayGrid = document.querySelector('.day-grid');
    if (dayGrid) {
      const dayLinks = dayGrid.querySelectorAll('a');
      dayLinks.forEach((link, index) => {
        const d = index + 1;
        const status = link.querySelector('.day-status i');
        if (!status) return;
        if (completedDays[`${d}_${langSel}`]) {
          status.className = 'fas fa-check-circle';
          status.style.color = 'var(--success-color)';
        } else {
          status.className = 'fas fa-circle';
          status.style.color = 'var(--warning-color)';
        }
      });
    }

    const progressContainer = document.querySelector('.progress-container');
    if (progressContainer) {
      const progressText = progressContainer.querySelector('p');
      const progressBar = progressContainer.querySelector('.progress-fill');
      if (progressText && progressBar) {
        progressText.textContent = `Progress: Day ${completed}/40`;
        progressBar.style.width = `${(completed / 40) * 100}%`;
      }
    }
  }

  const initialCompleted = Object.keys(completedDays).filter((key) =>
    key.endsWith(`_${lang}`)
  ).length;
  updatePageProgress(lang, initialCompleted);

  const languageBtns = document.querySelectorAll('.language-btn');
  languageBtns.forEach((btn) => {
    if (btn.dataset.lang === lang) {
      btn.classList.add('active');
    }
    btn.addEventListener('click', () => {
      window.location.href = `day.html?day=${day}&lang=${btn.dataset.lang}`;
    });
  });

  const flagMap = {
    zh: '🇨🇳',
    pinyin: '🔤',
    en: '🇺🇸',
  };
  document.getElementById('language-flag').textContent = flagMap[lang];

  const sectionInfo = getSectionInfo(day);
  document.getElementById('section-title').textContent = sectionInfo.title;
  document.getElementById('section-description').textContent =
    sectionInfo.description;

  const audio = document.getElementById('audio-player');
  const audioLang = lang === 'pinyin' ? 'zh' : lang;
  audio.src = `audio_files/day${day}_${audioLang}.mp3`;

  const audioFallback = document.getElementById('audio-fallback');
  if (lang === 'pinyin') {
    audioFallback.innerHTML =
      '<p class="note"><i class="fas fa-info-circle"></i> Using Mandarin audio for reference.</p>';
    audioFallback.style.display = 'block';
  } else {
    audioFallback.innerHTML = '';
    audioFallback.style.display = 'none';
  }

  const timingUrl = `timing/day${day}_${audioLang}.json`;

  const textFetch = fetch(`text_files/day${day}_${lang}.txt`).then((response) => {
    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.status}`);
    }
    return response.text();
  });

  const timingFetch = fetch(timingUrl)
    .then(async (response) => {
      if (!response.ok) return null;
      try {
        return await response.json();
      } catch (e) {
        console.warn('Lesson timing manifest invalid JSON:', e);
        return null;
      }
    })
    .catch(() => null);

  Promise.all([textFetch, timingFetch])
    .then(([text, timing]) => {
      formatAndDisplayContent(text, day, lang, timing);
      attachLessonAudioHighlighting(audio, timing);
    })
    .catch((error) => {
      console.error('Error loading text:', error);
      showContentError(document.getElementById('text-content'));
    });

  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  const prevBtnTop = document.getElementById('prev-btn-top');
  const nextBtnTop = document.getElementById('next-btn-top');

  if (day > 1) {
    prevBtn.href = `day.html?day=${day - 1}&lang=${lang}`;
    prevBtnTop.href = `day.html?day=${day - 1}&lang=${lang}`;
  } else {
    prevBtn.classList.add('disabled');
    prevBtnTop.classList.add('disabled');
    prevBtn.href = '#';
    prevBtnTop.href = '#';
  }

  if (day < 40) {
    nextBtn.href = `day.html?day=${day + 1}&lang=${lang}`;
    nextBtnTop.href = `day.html?day=${day + 1}&lang=${lang}`;
  } else {
    nextBtn.classList.add('disabled');
    nextBtnTop.classList.add('disabled');
    nextBtn.href = '#';
    nextBtnTop.href = '#';
  }
});

/**
 * Builds highlightable spans inside a phrase. Timings are interpolated evenly per span (see attachLessonAudioHighlighting).
 */
function buildPhraseReadingSpans(trimmedPhrase, lang) {
  const frag = document.createDocumentFragment();
  if (!trimmedPhrase) {
    return frag;
  }

  if (lang === 'zh') {
    for (const ch of trimmedPhrase) {
      const span = document.createElement('span');
      span.className = 'lesson-token';
      span.textContent = ch;
      frag.appendChild(span);
    }
    return frag;
  }

  if (lang === 'en') {
    const parts = trimmedPhrase.split(/(\s+)/);
    parts.forEach((tok) => {
      if (!tok) return;
      const span = document.createElement('span');
      span.className = tok.trim() === '' ? 'lesson-space' : 'lesson-token';
      span.textContent = tok;
      frag.appendChild(span);
    });
    return frag;
  }

  /* pinyin: whitespace-separated chunks */
  const chunks = trimmedPhrase.trim().split(/\s+/);
  if (chunks.length === 1 && chunks[0] === trimmedPhrase.trim()) {
    const span = document.createElement('span');
    span.className = 'lesson-token';
    span.textContent = trimmedPhrase.trim();
    frag.appendChild(span);
    return frag;
  }

  chunks.forEach((chunk, idx) => {
    const span = document.createElement('span');
    span.className = 'lesson-token';
    span.textContent = chunk;
    frag.appendChild(span);
    if (idx < chunks.length - 1) {
      const ws = document.createElement('span');
      ws.className = 'lesson-space';
      ws.textContent = ' ';
      frag.appendChild(ws);
    }
  });
  return frag;
}

function formatAndDisplayContent(text, day, lang, timingManifest) {
  text = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const sections = text.split(/\n(?=\w[^\n]+\n-+\n)/);
  const contentDiv = document.getElementById('text-content');
  contentDiv.innerHTML = '';

  let phraseCount = 0;

  sections.forEach((section) => {
    if (!section.trim()) return;
    const lines = section.split('\n');
    const title = lines[0].replace(/\s*[-]+\s*$/, '').trim();
    if (!title || /^[-\s]+$/.test(title)) return;

    const phrases = lines.slice(1).filter((line) => {
      const trimmedLine = line.trim();
      return trimmedLine && !/^[-\s]+$/.test(trimmedLine);
    });

    const sectionDiv = document.createElement('div');
    sectionDiv.className = 'phrase-section';

    const titleEl = document.createElement('h3');
    titleEl.textContent = title;
    sectionDiv.appendChild(titleEl);

    const phraseList = document.createElement('div');
    phraseList.className = 'phrase-list';

    phrases.forEach((phrase) => {
      if (!phrase.trim()) return;
      const trimmedPhrase = phrase.trim();
      const phraseItem = document.createElement('div');
      phraseItem.className = 'phrase-item';
      phraseItem.dataset.cueI = String(phraseCount);
      phraseCount += 1;

      const phraseReading = document.createElement('span');
      phraseReading.className = 'phrase-reading';
      phraseReading.appendChild(buildPhraseReadingSpans(trimmedPhrase, lang));

      const starBtn = document.createElement('button');
      starBtn.type = 'button';
      starBtn.className = 'phrase-star-btn';
      const starId = getStarredPhraseId(day, lang, title, trimmedPhrase);
      starBtn.setAttribute('aria-label', 'Star phrase for review');
      starBtn.setAttribute('aria-pressed', isPhraseStarred(starId) ? 'true' : 'false');
      starBtn.innerHTML = isPhraseStarred(starId)
        ? '<i class="fas fa-star" aria-hidden="true"></i>'
        : '<i class="far fa-star" aria-hidden="true"></i>';
      starBtn.addEventListener('click', () => {
        const nowStarred = toggleStarredPhrase({
          id: starId,
          phrase: trimmedPhrase,
          day,
          lang,
          sectionTitle: title,
        });
        starBtn.setAttribute('aria-pressed', nowStarred ? 'true' : 'false');
        starBtn.innerHTML = nowStarred
          ? '<i class="fas fa-star" aria-hidden="true"></i>'
          : '<i class="far fa-star" aria-hidden="true"></i>';
      });

      const copyBtn = document.createElement('button');
      copyBtn.type = 'button';
      copyBtn.className = 'copy-btn';
      copyBtn.setAttribute('aria-label', 'Copy phrase');
      copyBtn.innerHTML = '<i class="fas fa-copy"></i>';
      copyBtn.addEventListener('click', () => copyPhrase(trimmedPhrase));

      phraseItem.appendChild(phraseReading);
      phraseItem.appendChild(starBtn);
      phraseItem.appendChild(copyBtn);
      phraseList.appendChild(phraseItem);
    });

    sectionDiv.appendChild(phraseList);
    contentDiv.appendChild(sectionDiv);
  });

  if (
    timingManifest &&
    Array.isArray(timingManifest.phrases) &&
    timingManifest.phrases.length !== phraseCount
  ) {
    console.warn(
      `[day lesson timings] Manifest has ${timingManifest.phrases.length} cues but transcript has ${phraseCount} phrases`
    );
  }
}

function attachLessonAudioHighlighting(audioEl, timing) {
  if (!timing || !Array.isArray(timing.phrases) || !timing.phrases.length) {
    return;
  }

  const root = document.getElementById('text-content');
  if (!root) return;

  const cues = timing.phrases.slice().sort((a, b) => a.i - b.i);

  /** @type {{ phraseEl: HTMLElement | null; tokenEl: HTMLElement | null }} */
  let last = { phraseEl: null, tokenEl: null };

  function cueForTime(t) {
    for (let qi = 0; qi < cues.length; qi++) {
      const cue = cues[qi];
      if (t >= cue.start && t < cue.end) {
        return cue;
      }
    }
    return null;
  }

  function clearHighlight() {
    if (last.tokenEl) last.tokenEl.classList.remove('audio-sync-reading');
    if (last.phraseEl) last.phraseEl.classList.remove('audio-sync-active');
    last = { phraseEl: null, tokenEl: null };
  }

  function phraseElForCue(cue) {
    const el = root.querySelector(`.phrase-item[data-cue-i="${cue.i}"]`);
    return el || null;
  }

  /**
   * @param {HTMLElement} phraseEl
   * @param {number} cueStart
   * @param {number} cueEnd
   * @param {number} t
   */
  function pickTokenHighlight(phraseEl, cueStart, cueEnd, t) {
    const tokens = phraseEl.querySelectorAll('.lesson-token');
    const n = tokens.length;
    if (n === 0) return null;

    const duration = cueEnd - cueStart;
    if (duration <= 0) return tokens.length ? tokens[0] : null;

    const clampedLocal = Math.max(0, Math.min(duration, t - cueStart));
    const slice = duration / n;
    const idx = Math.min(n - 1, Math.floor(clampedLocal / slice));
    return tokens[idx];
  }

  /** @type {number | null} */
  let rafId = null;

  function refreshAt(t) {
    const cue = cueForTime(t);
    if (!cue) {
      clearHighlight();
      return;
    }

    const phraseEl = phraseElForCue(cue);
    if (!phraseEl) return;

    const tokenEl = pickTokenHighlight(phraseEl, cue.start, cue.end, t);

    if (last.phraseEl !== phraseEl) {
      if (last.tokenEl) last.tokenEl.classList.remove('audio-sync-reading');
      if (last.phraseEl) last.phraseEl.classList.remove('audio-sync-active');
      phraseEl.classList.add('audio-sync-active');
    }

    if (tokenEl && last.tokenEl !== tokenEl) {
      if (last.tokenEl) last.tokenEl.classList.remove('audio-sync-reading');
      tokenEl.classList.add('audio-sync-reading');
    }

    last = {
      phraseEl,
      tokenEl: tokenEl || null,
    };

  }

  function syncFrame() {
    if (audioEl.paused || audioEl.ended) {
      rafId = null;
      return;
    }
    refreshAt(audioEl.currentTime);
    rafId = requestAnimationFrame(syncFrame);
  }

  function kickIfPlaying() {
    if (!audioEl.paused && !audioEl.ended) {
      if (rafId == null) {
        syncFrame();
      }
    }
  }

  audioEl.addEventListener('play', kickIfPlaying);
  audioEl.addEventListener('seeked', () => {
    refreshAt(audioEl.currentTime);
  });
  audioEl.addEventListener('pause', () => {
    if (rafId != null) cancelAnimationFrame(rafId);
    rafId = null;
    refreshAt(audioEl.currentTime);
  });
  audioEl.addEventListener('ended', () => {
    if (rafId != null) cancelAnimationFrame(rafId);
    rafId = null;
    clearHighlight();
  });
}

function copyPhrase(phrase) {
  navigator.clipboard.writeText(phrase).then(() => {
    const notification = document.getElementById('copy-notification');
    notification.style.display = 'block';
    notification.style.animation = 'none';
    notification.offsetHeight;
    notification.style.animation = 'fadeInOut 2s ease';
    setTimeout(() => {
      notification.style.display = 'none';
    }, 2000);
  });
}

function getSectionInfo(dayNum) {
  if (dayNum <= 7) {
    return {
      title: 'Pinyin System & Pronunciation',
      description:
        'Master the fundamentals of Mandarin pronunciation and tones.',
    };
  }
  if (dayNum <= 14) {
    return {
      title: 'Essential Daily Phrases',
      description: 'Learn practical phrases for everyday communication.',
    };
  }
  if (dayNum <= 22) {
    return {
      title: 'Cultural Context & Daily Life',
      description:
        'Understand Chinese culture and daily life communication.',
    };
  }
  if (dayNum <= 30) {
    return {
      title: 'Professional Mandarin',
      description: 'Master business and professional communication.',
    };
  }
  return {
    title: 'Advanced Fluency',
    description: 'Achieve advanced fluency and real-world applications.',
  };
}
