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

  const videoSection = document.getElementById('video-section');
  videoSection.style.display = lang === 'zh' ? 'block' : 'none';

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

  fetch(`text_files/day${day}_${lang}.txt`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status}`);
      }
      return response.text();
    })
    .then((text) => {
      formatAndDisplayContent(text, day, lang);
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

function formatAndDisplayContent(text, day, lang) {
  text = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const sections = text.split(/\n(?=\w[^\n]+\n-+\n)/);
  const contentDiv = document.getElementById('text-content');
  contentDiv.innerHTML = '';

  sections.forEach((section) => {
    if (!section.trim()) return;
    const lines = section.split('\n');
    let title = lines[0].replace(/\s*[-]+\s*$/, '').trim();
    if (!title || /^[-\s]+$/.test(title)) return;

    const phrases = lines.slice(1).filter((line) => {
      const trimmed = line.trim();
      return trimmed && !/^[-\s]+$/.test(trimmed);
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

      const phraseText = document.createElement('span');
      phraseText.textContent = trimmedPhrase;

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

      phraseItem.appendChild(phraseText);
      phraseItem.appendChild(starBtn);
      phraseItem.appendChild(copyBtn);
      phraseList.appendChild(phraseItem);
    });

    sectionDiv.appendChild(phraseList);
    contentDiv.appendChild(sectionDiv);
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
