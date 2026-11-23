/*
 * The home page's carousel (src/components/RecentPosts.astro).
 *
 * The track scrolls and snaps on its own. This wires the Previous and Next
 * buttons, builds one marker per slide, keeps the active marker in step with
 * the scroll, and announces the slide the track settles on. Navigation is
 * finite: at an end the button that leads nowhere is disabled.
 */

/** Index of the slide whose centre is nearest the track's centre. */
export function nearestSlide(centers, viewCenter) {
  let best = 0;
  for (let i = 1; i < centers.length; i += 1) {
    if (Math.abs(centers[i] - viewCenter) < Math.abs(centers[best] - viewCenter)) best = i;
  }
  return best;
}

function wire(root) {
  const track = root.querySelector('.recent__track');
  const slides = [...track.children];
  const status = root.querySelector('[role="status"]');
  const markersNav = root.querySelector('.recent__markers');
  const previous = root.querySelector('[data-direction="previous"]');
  const next = root.querySelector('[data-direction="next"]');
  if (slides.length < 2) {
    root.querySelector('.recent__controls').hidden = true;
    return;
  }

  const markers = slides.map((slide, i) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.setAttribute('aria-label', slide.dataset.markerName);
    button.addEventListener('click', () => go(i));
    markersNav.append(button);
    return button;
  });

  const centerOf = (slide) => slide.offsetLeft + slide.offsetWidth / 2;
  const current = () => nearestSlide(slides.map(centerOf), track.scrollLeft + track.clientWidth / 2);

  let active = -1;
  let settled = -1;
  // The slide a click is heading for, so rapid clicks build on it.
  let pending = null;

  const mark = (index) => {
    if (index === active) return;
    active = index;
    markers.forEach((marker, i) => {
      if (i === index) marker.setAttribute('aria-current', 'true');
      else marker.removeAttribute('aria-current');
    });
  };

  function go(index) {
    const target = Math.max(0, Math.min(slides.length - 1, index));
    pending = target;
    mark(target);
    track.scrollBy({ left: centerOf(slides[target]) - (track.scrollLeft + track.clientWidth / 2) });
  }

  const settle = () => {
    pending = null;
    const index = current();
    mark(index);
    const atStart = index === 0;
    const atEnd = index === slides.length - 1;
    // A button that is about to be disabled must not swallow the focus.
    if (atStart && document.activeElement === previous) next.focus();
    if (atEnd && document.activeElement === next) previous.focus();
    previous.disabled = atStart;
    next.disabled = atEnd;
    if (settled !== -1 && index !== settled) {
      status.textContent = `Post ${index + 1} of ${slides.length}: ${slides[index].querySelector('h3').textContent}`;
    }
    settled = index;
  };

  previous.addEventListener('click', () => go((pending ?? current()) - 1));
  next.addEventListener('click', () => go((pending ?? current()) + 1));

  let frame = 0;
  track.addEventListener(
    'scroll',
    () => {
      if (pending !== null || frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        mark(current());
      });
    },
    { passive: true },
  );

  if ('onscrollend' in window) {
    track.addEventListener('scrollend', settle);
  } else {
    let timer = 0;
    track.addEventListener(
      'scroll',
      () => {
        clearTimeout(timer);
        timer = setTimeout(settle, 120);
      },
      { passive: true },
    );
  }

  settle();
}

if (typeof document !== 'undefined') {
  document.querySelectorAll('[data-carousel]').forEach(wire);
}
