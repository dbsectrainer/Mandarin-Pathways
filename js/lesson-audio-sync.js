/**
 * Karaoke-style audio cue highlighting for lesson / reading / writing / supplementary pages.
 * Depends on cue JSON `{ phrases: [{ i, start, end, ... }] }` aligned with DOM `[data-cue-i]`.
 */
(function (global) {
  /** @typedef {{ i: number; start: number; end: number }} AudioCue */

  /**
   * @param {string} trimmedPhrase
   * @param {string} lang
   * @returns {DocumentFragment}
   */
  function appendPhraseSpansToFragment(trimmedPhrase, lang) {
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

  /**
   * Matches scripts/audio_timings.split_reading_passage (Python).
   * @param {string} text
   * @param {string} lang
   */
  function splitReadingSegments(text, lang) {
    const t = (text || '').trim();
    if (!t) return [];
    if (lang === 'zh') {
      const parts = t.match(/[^。！？]+[。！？]?/g);
      return parts ? parts.map((s) => s.trim()).filter(Boolean) : [t];
    }
    return t.split(/(?<=[.!?])\s+/).map((s) => s.trim()).filter(Boolean);
  }

  /**
   * Wire audio currentTime → highlights under elements returned by resolver(cue).
   * @param {HTMLMediaElement|null} audioEl
   * @param {AudioCue[]|undefined|null} timingPhrases
   * @param {(cue: AudioCue) => HTMLElement | null | undefined} getPhraseRootForCue
   */
  function attachCueHighlighting(audioEl, timingPhrases, getPhraseRootForCue) {
    if (!audioEl || !timingPhrases || !timingPhrases.length) {
      return;
    }

    const cues = timingPhrases.slice().sort((a, b) => a.start - b.start);

    let lastPhraseEl = /** @type {HTMLElement | null} */ (null);
    let lastTokenEl = /** @type {HTMLElement | null} */ (null);

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
      if (lastTokenEl) lastTokenEl.classList.remove('audio-sync-reading');
      if (lastPhraseEl) lastPhraseEl.classList.remove('audio-sync-active');
      lastPhraseEl = null;
      lastTokenEl = null;
    }

    function phraseElForCue(cue) {
      const found = getPhraseRootForCue(cue);
      return found && found instanceof HTMLElement ? found : null;
    }

    function pickTokenHighlight(phraseEl, cueStart, cueEnd, t) {
      const tokens = phraseEl.querySelectorAll('.lesson-token');
      const n = tokens.length;
      if (!n) return null;
      const duration = cueEnd - cueStart;
      if (duration <= 0) {
        return tokens[0];
      }
      const clampedLocal = Math.max(0, Math.min(duration, t - cueStart));
      const slice = duration / n;
      const idx = Math.min(n - 1, Math.floor(clampedLocal / slice));
      return tokens[idx];
    }

    /** @type {number | null} */
    let rafId = null;

    function refreshAt(timed) {
      const cue = cueForTime(timed);
      if (!cue) {
        clearHighlight();
        return;
      }

      const phraseEl = phraseElForCue(cue);
      if (!phraseEl) {
        return;
      }

      const tokenEl = pickTokenHighlight(phraseEl, cue.start, cue.end, timed);

      if (lastPhraseEl !== phraseEl) {
        if (lastTokenEl) lastTokenEl.classList.remove('audio-sync-reading');
        if (lastPhraseEl) lastPhraseEl.classList.remove('audio-sync-active');
        phraseEl.classList.add('audio-sync-active');
      }

      if (tokenEl && lastTokenEl !== tokenEl) {
        if (lastTokenEl) lastTokenEl.classList.remove('audio-sync-reading');
        tokenEl.classList.add('audio-sync-reading');
      }

      lastPhraseEl = phraseEl;
      lastTokenEl = tokenEl || null;
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
      if (!audioEl.paused && !audioEl.ended && rafId == null) {
        syncFrame();
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

    kickIfPlaying();
  }

  global.LessonAudioSync = {
    appendPhraseSpansToFragment,
    splitReadingSegments,
    attachCueHighlighting,
  };
})(typeof window !== 'undefined' ? window : typeof globalThis !== 'undefined' ? globalThis : this);
