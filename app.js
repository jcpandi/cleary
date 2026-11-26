const track = document.querySelector('.hero-scroll');
const stage = document.querySelector('.hero-stage');
const video = document.querySelector('.hero-video');
const content = document.querySelector('.hero-content');
const ending = document.querySelector('.hero-ending');
const assurances = document.querySelector('.hero-assurances');
const wash = document.querySelector('.hero-wash');
const cue = document.querySelector('.scroll-cue');
const motionButton = document.querySelector('.motion-control');
const progressBar = document.querySelector('.sequence-progress span');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const clamp = (value, min = 0, max = 1) => Math.max(min, Math.min(max, value));
let duration = 3.7;
let travel = 1;
let pendingFrame = 0;
let targetTime = 0;
let playing = false;
let playFrame = 0;
let previousFocus;

function measure() {
  travel = Math.max(1, track.offsetHeight - stage.offsetHeight);
  scheduleUpdate();
}

function seekVideo() {
  if (video.readyState >= 2 && !video.seeking && Math.abs(video.currentTime - targetTime) > 0.025) {
    video.currentTime = targetTime;
  }
}

function paint(progress) {
  const textOpacity = 1 - clamp(progress / 0.14);
  const mediaOpacity = clamp((progress - 0.02) / 0.12);
  const endingProgress = clamp((progress - 0.94) / 0.06);
  const endingOpacity = endingProgress * endingProgress * (3 - 2 * endingProgress);
  const assuranceOpacity = Math.max(textOpacity, endingOpacity);
  content.style.opacity = textOpacity;
  content.style.transform = `translateY(${-clamp(progress / 0.14) * 24}px)`;
  content.inert = textOpacity < 0.08;
  assurances.style.opacity = assuranceOpacity;
  assurances.style.transform = `translateY(${(1 - assuranceOpacity) * 14}px)`;
  assurances.inert = assuranceOpacity < 0.05;
  assurances.setAttribute('aria-hidden', String(assurances.inert));
  cue.style.opacity = textOpacity;
  cue.inert = textOpacity < 0.08;
  video.style.opacity = mediaOpacity;
  ending.style.opacity = endingOpacity;
  ending.style.transform = `translateY(${(1 - endingOpacity) * 18}px)`;
  ending.inert = endingOpacity < 0.05;
  ending.setAttribute('aria-hidden', String(ending.inert));
  wash.style.opacity = Math.max(textOpacity, endingOpacity);
  progressBar.style.transform = `scaleX(${progress})`;
  targetTime = clamp((progress - 0.10) / 0.84) * duration;
  seekVideo();
}

function updateFromScroll() {
  pendingFrame = 0;
  if (reducedMotion.matches || playing) return;
  paint(clamp(window.scrollY / travel));
}

function scheduleUpdate() {
  if (!pendingFrame) pendingFrame = requestAnimationFrame(updateFromScroll);
}

function setPlayState(value) {
  playing = value;
  motionButton.setAttribute('aria-label', value ? 'Pause cleaning animation' : 'Play cleaning animation');
  motionButton.title = value ? 'Pause cleaning animation' : 'Play cleaning animation';
  motionButton.querySelector('use').setAttribute('href', value ? '#pause' : '#play');
}

function stopPlayback() {
  cancelAnimationFrame(playFrame);
  setPlayState(false);
}

function playSequence() {
  if (reducedMotion.matches) return;
  if (playing) { stopPlayback(); return; }
  let startProgress = clamp(window.scrollY / travel);
  if (startProgress > 0.96) startProgress = 0;
  const started = performance.now();
  const total = 6800;
  setPlayState(true);
  function tick(now) {
    const progress = clamp(startProgress + (now - started) / total);
    window.scrollTo({ top: progress * travel, behavior: 'instant' });
    paint(progress);
    if (progress < 1 && playing) playFrame = requestAnimationFrame(tick);
    else stopPlayback();
  }
  playFrame = requestAnimationFrame(tick);
}

video.addEventListener('loadedmetadata', () => { duration = Math.max(0, video.duration - 0.06); scheduleUpdate(); });
video.addEventListener('loadeddata', seekVideo);
video.addEventListener('seeked', seekVideo);
video.addEventListener('error', () => {
  video.style.display = 'none';
  cue.hidden = true;
  motionButton.hidden = true;
});
window.addEventListener('scroll', scheduleUpdate, { passive: true });
window.addEventListener('resize', measure, { passive: true });
window.addEventListener('wheel', stopPlayback, { passive: true });
window.addEventListener('touchstart', stopPlayback, { passive: true });
window.addEventListener('keydown', (event) => {
  if (['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End', ' '].includes(event.key)) stopPlayback();
});
reducedMotion.addEventListener('change', () => {
  stopPlayback();
  if (reducedMotion.matches) paint(0);
  measure();
});
motionButton.addEventListener('click', playSequence);
cue.addEventListener('click', playSequence);

const menuToggle = document.querySelector('.menu-toggle');
const mobileMenu = document.querySelector('.mobile-menu');
function closeMenu() {
  mobileMenu.hidden = true;
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Open menu');
}
menuToggle.addEventListener('click', () => {
  const open = menuToggle.getAttribute('aria-expanded') !== 'true';
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  mobileMenu.hidden = !open;
});
document.querySelectorAll('a[href="#home"]').forEach((link) => link.addEventListener('click', () => {
  stopPlayback();
  closeMenu();
  window.scrollTo({ top: 0, behavior: reducedMotion.matches ? 'instant' : 'smooth' });
}));

const dialog = document.querySelector('#site-dialog');
const dialogContent = document.querySelector('#dialog-content');
function openDialog(name, service) {
  const template = document.querySelector(`#${name}-template`);
  if (!template) return;
  stopPlayback();
  closeMenu();
  if (!dialog.open) previousFocus = document.activeElement;
  dialogContent.replaceChildren(template.content.cloneNode(true));
  if (service) dialogContent.querySelector('[name="service"]').value = service;
  document.body.classList.add('dialog-open');
  if (!dialog.open) dialog.showModal();
  else dialog.querySelector('.dialog-close').focus();
}

document.addEventListener('click', (event) => {
  const trigger = event.target.closest('[data-dialog]');
  if (trigger) openDialog(trigger.dataset.dialog);
  const service = event.target.closest('[data-service]');
  if (service) openDialog('quote', service.dataset.service);
});
document.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', (event) => {
  if (event.target === dialog) {
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  }
});
dialog.addEventListener('close', () => {
  document.body.classList.remove('dialog-open');
  previousFocus?.focus({ preventScroll: true });
});
document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeMenu(); });

dialog.addEventListener('submit', (event) => {
  if (event.target.id !== 'quote-form') return;
  event.preventDefault();
  const data = new FormData(event.target);
  const eyebrow = document.createElement('p');
  eyebrow.className = 'eyebrow';
  eyebrow.textContent = 'Your cleaning request';
  const title = document.createElement('h2');
  title.id = 'dialog-title';
  title.tabIndex = -1;
  title.textContent = 'A fresh start, planned.';
  const summary = document.createElement('dl');
  summary.className = 'request-summary';
  for (const [key, label] of [['name', 'Name'], ['email', 'Email'], ['service', 'Service'], ['size', 'Home size']]) {
    const row = document.createElement('div');
    const term = document.createElement('dt');
    const value = document.createElement('dd');
    term.textContent = label;
    value.textContent = String(data.get(key) ?? '');
    row.append(term, value);
    summary.append(row);
  }
  const note = document.createElement('p');
  note.className = 'form-note';
  note.textContent = 'This is a preview. No request has been sent, and your details have not been saved.';
  dialogContent.replaceChildren(eyebrow, title, summary, note);
  title.focus();
});

measure();
