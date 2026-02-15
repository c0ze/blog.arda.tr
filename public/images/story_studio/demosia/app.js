const state = {
  book: null,
  index: 0,
  autoplay: true,
  pendingAutoplay: false,
  words: [],
  touchX: null,
  visited: new Set(),
  transitioning: false,
};

const el = {
  bookTitle: document.getElementById('bookTitle'),
  pageMeta: document.getElementById('pageMeta'),
  pageImage: document.getElementById('pageImage'),
  pageText: document.getElementById('pageText'),
  audio: document.getElementById('audio'),
  prevBtn: document.getElementById('prevBtn'),
  nextBtn: document.getElementById('nextBtn'),
  playPauseBtn: document.getElementById('playPauseBtn'),
  autoplayBtn: document.getElementById('autoplayBtn'),
  pageCard: document.getElementById('pageCard'),
  dots: document.getElementById('dots'),
  shimmer: document.getElementById('imgShimmer'),
};

function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }

function splitWords(text) {
  const input = String(text || '').trim();
  if (!input) return [];

  const lang = (state.book && state.book.language ? state.book.language : 'en').split('-')[0];

  if (typeof Intl !== 'undefined' && typeof Intl.Segmenter === 'function') {
    try {
      const segmenter = new Intl.Segmenter(lang, { granularity: 'word' });
      const parts = [];
      for (const seg of segmenter.segment(input)) {
        if (seg.isWordLike) parts.push(seg.segment);
      }
      if (parts.length > 0) return parts;
    } catch (_) {
      // Fallback below.
    }
  }

  if (/[぀-ヿ㐀-䶿一-鿿]/.test(input)) {
    // CJK fallback when no robust word segmentation is available.
    return Array.from(input).filter((ch) => ch.trim().length > 0);
  }

  return input.split(/\s+/).filter(Boolean);
}

/* --- Progress dots --- */
function buildDots() {
  if (!state.book) return;
  el.dots.innerHTML = '';
  state.book.pages.forEach((_, i) => {
    const d = document.createElement('span');
    d.className = 'dot';
    d.addEventListener('click', () => goToPage(i));
    el.dots.appendChild(d);
  });
  updateDots();
}

function updateDots() {
  const dots = el.dots.querySelectorAll('.dot');
  dots.forEach((d, i) => {
    d.classList.toggle('active', i === state.index);
    d.classList.toggle('visited', state.visited.has(i) && i !== state.index);
  });
}

/* --- Word reveal with highlight --- */
function renderTextProgress(progress) {
  const words = state.words;
  const visible = clamp(Math.round(words.length * progress), 0, words.length);
  el.pageText.textContent = '';

  words.forEach((w, i) => {
    const span = document.createElement('span');
    const addSpace = /[\p{L}\p{N}]$/u.test(w) && i < words.length - 1;
    span.textContent = w + (addSpace ? ' ' : '');
    if (i >= visible) {
      span.className = 'word-hidden';
    } else if (i === visible - 1 && progress < 1) {
      span.className = 'word-current';
    }
    el.pageText.appendChild(span);
  });
}

/* --- Autoplay label --- */
function setAutoplayLabel() {
  el.autoplayBtn.textContent = state.autoplay ? '\u{1f504} Auto' : '\u{1f504} Auto';
  el.autoplayBtn.classList.toggle('off', !state.autoplay);
}

/* --- Image load handling --- */
function loadImage(src) {
  if (!src) {
    el.pageImage.removeAttribute('src');
    el.shimmer.classList.add('hidden');
    return;
  }
  el.pageImage.classList.add('loading');
  el.shimmer.classList.remove('hidden');
  el.pageImage.onload = () => {
    el.pageImage.classList.remove('loading');
    el.shimmer.classList.add('hidden');
  };
  el.pageImage.onerror = () => {
    el.shimmer.classList.add('hidden');
  };
  const versionTag = encodeURIComponent(state.book.request_id || state.book.generated_at || '');
  el.pageImage.src = src + (versionTag ? `?v=${versionTag}` : '');
}

/* --- Page rendering (called after fade-out completes) --- */
function applyPage() {
  const page = state.book.pages[state.index];
  el.bookTitle.textContent = state.book.title || 'Story Book';
  el.pageMeta.textContent = 'Page ' + (state.index + 1) + ' / ' + state.book.pages.length;
  loadImage(page.image || '');
  state.words = splitWords(page.text);
  state.visited.add(state.index);
  renderTextProgress(page.audio ? 0 : 1);
  updateDots();

  if (page.audio) {
    state.pendingAutoplay = false;
    el.audio.pause();
    const versionTag = encodeURIComponent(state.book.request_id || state.book.generated_at || '');
    el.audio.src = page.audio + (versionTag ? `?v=${versionTag}` : '');
    el.audio.currentTime = 0;
    el.audio.load();
    el.playPauseBtn.textContent = '\u25b6 Listen';
    if (state.autoplay) {
      state.pendingAutoplay = true;
      el.playPauseBtn.textContent = '\u2026';
    }
  } else {
    state.pendingAutoplay = false;
    el.audio.removeAttribute('src');
    el.audio.load();
    el.playPauseBtn.textContent = '\u2014';
  }
}

/* --- Page transition (fade out → swap → fade in) --- */
function transitionToPage() {
  if (state.transitioning) return;
  state.transitioning = true;

  el.pageCard.classList.add('fade-out');

  setTimeout(() => {
    applyPage();
    el.pageCard.classList.remove('fade-out');
    setTimeout(() => { state.transitioning = false; }, 220);
  }, 220);
}

function goToPage(i) {
  if (!state.book || i === state.index || i < 0 || i >= state.book.pages.length) return;
  el.audio.pause();
  state.index = i;
  transitionToPage();
}

function nextPage() {
  if (!state.book || state.index >= state.book.pages.length - 1) return;
  el.audio.pause();
  state.index += 1;
  transitionToPage();
}

function prevPage() {
  if (!state.book || state.index <= 0) return;
  el.audio.pause();
  state.index -= 1;
  transitionToPage();
}

/* --- Event listeners --- */
el.prevBtn.addEventListener('click', prevPage);
el.nextBtn.addEventListener('click', nextPage);

el.playPauseBtn.addEventListener('click', () => {
  if (!el.audio.src) return;
  state.pendingAutoplay = false;
  if (el.audio.paused) {
    el.audio.play().catch(() => null);
  } else {
    el.audio.pause();
  }
});

el.autoplayBtn.addEventListener('click', () => {
  state.autoplay = !state.autoplay;
  setAutoplayLabel();
});

el.audio.addEventListener('play', () => {
  state.pendingAutoplay = false;
  el.playPauseBtn.textContent = '\u23f8 Pause';
});

el.audio.addEventListener('pause', () => {
  if (el.audio.currentTime > 0 && !el.audio.ended) {
    el.playPauseBtn.textContent = '\u25b6 Listen';
  }
});

el.audio.addEventListener('timeupdate', () => {
  const duration = Number.isFinite(el.audio.duration) && el.audio.duration > 0 ? el.audio.duration : 1;
  const progress = clamp(el.audio.currentTime / duration, 0, 1);
  renderTextProgress(progress);
});

el.audio.addEventListener('canplay', () => {
  if (!state.pendingAutoplay) return;
  el.audio.play().catch(() => {
    el.playPauseBtn.textContent = '\u25b6 Listen';
  });
});

el.audio.addEventListener('ended', () => {
  renderTextProgress(1);
  if (state.autoplay) nextPage();
});

/* --- Tap / swipe navigation --- */
el.pageCard.addEventListener('click', (event) => {
  if (state.transitioning) return;
  const rect = el.pageCard.getBoundingClientRect();
  const x = event.clientX - rect.left;
  if (x > rect.width * 0.62) {
    nextPage();
  } else if (x < rect.width * 0.38) {
    prevPage();
  }
});

el.pageCard.addEventListener('touchstart', (event) => {
  state.touchX = event.changedTouches[0].clientX;
}, { passive: true });

el.pageCard.addEventListener('touchend', (event) => {
  if (state.touchX == null || state.transitioning) return;
  const dx = event.changedTouches[0].clientX - state.touchX;
  state.touchX = null;
  if (dx < -35) nextPage();
  if (dx > 35) prevPage();
}, { passive: true });

/* --- Keyboard navigation --- */
document.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowRight' || event.key === 'Right') nextPage();
  else if (event.key === 'ArrowLeft' || event.key === 'Left') prevPage();
  else if (event.key === ' ') {
    event.preventDefault();
    if (el.audio.src) {
      el.audio.paused ? el.audio.play().catch(() => null) : el.audio.pause();
    }
  }
});

/* --- Start --- */
async function start() {
  const response = await fetch('book.json', { cache: 'no-store' });
  if (!response.ok) {
    throw new Error('Failed to load book.json: ' + response.status);
  }
  state.book = await response.json();
  buildDots();
  setAutoplayLabel();
  state.visited.add(0);
  applyPage();
}

start().catch((err) => {
  el.pageText.textContent = 'Failed to load book: ' + err.message;
});
