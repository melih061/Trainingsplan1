/**
 * Main Application Component
 * Orchestrates all views and manages app state
 */

import { TRAINING_DAYS, WEEKLY_SCHEDULE, QUOTES, DAILY_CHALLENGES } from '../data/exercises.js';
import * as storage from '../services/storage.js';
import * as timer from '../services/timer.js';
import * as charts from '../services/charts.js';
import { formatDate, getDayName, getQuoteOfDay, createRipple } from '../utils/helpers.js';
import { staggerIn, pulse, animateCounter } from '../utils/animations.js';

/**
 * Application state
 */
const state = {
  currentTab: 'home',
  currentDay: null,
  timerOpen: false,
  streak: storage.getStreak(),
  challenges: storage.getChallengeStatus()
};

/**
 * Initialize the application
 */
export function init() {
  // Determine today's training
  const today = new Date().getDay();
  const todaySchedule = WEEKLY_SCHEDULE.find(s => s.dayIndex === today) || WEEKLY_SCHEDULE[0];
  state.currentDay = todaySchedule.training;

  // Set up event listeners
  setupEventListeners();

  // Initial render
  render();

  // Request notification permission
  timer.requestNotificationPermission();

  console.log('[App] Initialized', { state });
}

/**
 * Set up all event listeners
 */
function setupEventListeners() {
  // Tab navigation
  document.addEventListener('click', (e) => {
    const dayTab = e.target.closest('.day-tab');
    if (dayTab) {
      const day = dayTab.dataset.day;
      if (day) switchDay(day);
    }

    const tabBtn = e.target.closest('[data-tab]');
    if (tabBtn) {
      switchTab(tabBtn.dataset.tab);
    }

    // Timer toggle
    if (e.target.closest('.timer-btn')) {
      toggleTimer();
    }

    // Exercise card expand
    const exCard = e.target.closest('.ex-card');
    if (exCard && e.target.closest('.ex-hdr')) {
      exCard.classList.toggle('expanded');
    }

    // Log button
    if (e.target.closest('.log-btn')) {
      handleLogSet(e.target.closest('.ex-card'));
    }

    // Challenge toggle
    const chalCard = e.target.closest('.challenge-card');
    if (chalCard) {
      const challengeId = chalCard.dataset.challenge;
      if (challengeId) toggleChallenge(challengeId);
    }

    // Ripple effect
    const rippleEl = e.target.closest('.icon-btn, .day-tab, .tbtn');
    if (rippleEl) {
      createRipple(rippleEl, e);
    }
  });

  // Input handling
  document.addEventListener('input', (e) => {
    if (e.target.matches('.li, .ni')) {
      // Auto-save note
      const exCard = e.target.closest('.ex-card');
      if (exCard && e.target.classList.contains('ni')) {
        const exerciseId = exCard.dataset.exercise;
        const dayId = state.currentDay;
        // Debounced save
        clearTimeout(exCard._noteTimeout);
        exCard._noteTimeout = setTimeout(() => {
          storage.save(`note_${dayId}_${exerciseId}`, e.target.value);
        }, 500);
      }
    }
  });

  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModals();
    }
    if (e.key === ' ' && state.timerOpen) {
      e.preventDefault();
      timer.toggle();
    }
  });
}

/**
 * Switch active tab
 */
function switchTab(tab) {
  state.currentTab = tab;
  render();
}

/**
 * Switch training day
 */
function switchDay(day) {
  state.currentDay = day;
  renderWorkout();
  renderDayNav();
}

/**
 * Toggle timer visibility
 */
function toggleTimer() {
  state.timerOpen = !state.timerOpen;
  const timerBar = document.querySelector('.timer-bar');
  const timerBtn = document.querySelector('.timer-btn');

  if (timerBar) timerBar.classList.toggle('open', state.timerOpen);
  if (timerBtn) timerBtn.classList.toggle('active', state.timerOpen);
}

/**
 * Toggle daily challenge
 */
function toggleChallenge(challengeId) {
  const completed = storage.toggleChallenge(challengeId);
  state.challenges = storage.getChallengeStatus();

  const chalCard = document.querySelector(`[data-challenge="${challengeId}"]`);
  if (chalCard) {
    const check = chalCard.querySelector('.chal-check');
    check.classList.toggle('done', completed);

    if (completed) {
      pulse(chalCard);
    }
  }
}

/**
 * Handle logging a set
 */
function handleLogSet(exCard) {
  const exerciseId = exCard.dataset.exercise;
  const dayId = state.currentDay;

  const weightInput = exCard.querySelector('.weight-input');
  const repsInput = exCard.querySelector('.reps-input');
  const notesInput = exCard.querySelector('.ni');

  const weight = parseFloat(weightInput?.value) || 0;
  const reps = parseInt(repsInput?.value) || 0;
  const notes = notesInput?.value || '';

  if (weight > 0 && reps > 0) {
    storage.logWorkoutSet(dayId, exerciseId, { weight, reps, notes });
    storage.updateStreak();
    state.streak = storage.getStreak();

    // Visual feedback
    const logBtn = exCard.querySelector('.log-btn');
    logBtn.classList.add('saved');
    setTimeout(() => logBtn.classList.remove('saved'), 500);

    // Update history display
    renderExerciseHistory(exCard, exerciseId);

    // Check for PR
    const pr = storage.getPR(exerciseId);
    if (pr && pr.date === new Date().toISOString().split('T')[0]) {
      exCard.classList.add('pr-flash');
      setTimeout(() => exCard.classList.remove('pr-flash'), 700);
    }

    // Clear inputs for next set
    // Keep weight, clear reps
    repsInput.value = '';
  }
}

/**
 * Close all modals
 */
function closeModals() {
  document.querySelectorAll('.modal.open').forEach(m => m.classList.remove('open'));
}

/**
 * Main render function
 */
function render() {
  renderHeader();
  renderTimerBar();
  renderDayNav();
  renderContent();
}

/**
 * Render header section
 */
function renderHeader() {
  const streak = state.streak;

  const headerHTML = `
    <div class="hd">
      <div>
        <div class="logo">BUILT BY <em>MELIH</em></div>
        <div class="logo-sub">IRON DISCIPLINE</div>
      </div>
      <div class="hd-right">
        <div class="streak-chip">
          <div class="streak-gem"></div>
          <div>
            <div class="streak-val">${streak.current}</div>
            <div class="streak-lbl">STREAK</div>
          </div>
        </div>
        <button class="icon-btn timer-btn ${state.timerOpen ? 'active' : ''}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12,6 12,12 16,14"/>
          </svg>
        </button>
      </div>
    </div>
  `;

  const headerEl = document.querySelector('.hd');
  if (headerEl) {
    headerEl.outerHTML = headerHTML;
  }
}

/**
 * Render timer bar
 */
function renderTimerBar() {
  const timerState = timer.getState();

  const timerHTML = `
    <div class="timer-bar ${state.timerOpen ? 'open' : ''}">
      <div class="tinner">
        <div class="tdisp ${timerState.isRunning ? 'running' : ''}">${timerState.formatted}</div>
        <div class="tbtns">
          <button class="tbtn ${timerState.isRunning ? 'stop' : 'go'}" onclick="window.app.toggleTimer()">
            ${timerState.isRunning ? 'STOP' : 'START'}
          </button>
          <button class="tbtn" onclick="window.app.resetTimer()">RESET</button>
          <button class="tbtn" onclick="window.app.addTimerTime(30)">+30s</button>
        </div>
      </div>
    </div>
  `;

  const timerEl = document.querySelector('.timer-bar');
  if (timerEl) {
    timerEl.outerHTML = timerHTML;
  }
}

/**
 * Render day navigation
 */
function renderDayNav() {
  const today = new Date().getDay();

  const navHTML = WEEKLY_SCHEDULE.map(schedule => {
    const day = TRAINING_DAYS[schedule.training];
    const isActive = state.currentDay === schedule.training;
    const isToday = schedule.dayIndex === today;

    return `
      <div class="day-tab ${isActive ? 'active' : ''}"
           data-day="${schedule.training}"
           style="--day-accent: ${day.color}">
        <div class="dt-n">${schedule.dayName}</div>
        <div class="dt-s">${day.shortName}${isToday ? ' *' : ''}</div>
      </div>
    `;
  }).join('');

  const navEl = document.querySelector('.day-nav');
  if (navEl) {
    navEl.innerHTML = navHTML;
  }
}

/**
 * Render main content area
 */
function renderContent() {
  const main = document.querySelector('main');
  if (!main) return;

  // For now, always show workout view
  // Can expand to home, progress, etc.
  renderWorkout();
}

/**
 * Render workout view
 */
function renderWorkout() {
  const day = TRAINING_DAYS[state.currentDay];
  if (!day) return;

  const main = document.querySelector('main');
  if (!main) return;

  if (day.isRestDay) {
    main.innerHTML = `
      <div class="tab-pane active sg">
        <div class="today-rest-card">
          <div class="rest-icon">🧘</div>
          <div>
            <div class="rest-title">Ruhetag</div>
            <div class="rest-desc">Erholung ist Teil des Trainings</div>
          </div>
        </div>
        <div class="sec">EMPFEHLUNGEN</div>
        <div class="rest-activities">
          ${day.activities.map(a => `<div class="rest-item">${a}</div>`).join('')}
        </div>
      </div>
    `;
    return;
  }

  const exercisesHTML = day.exercises.map(ex => {
    const lastSet = storage.getLastSet(ex.id);
    const pr = storage.getPR(ex.id);
    const savedNote = storage.load(`note_${state.currentDay}_${ex.id}`, '');

    return `
      <div class="ex-card" data-exercise="${ex.id}" style="--da: ${day.color}; --da-d: ${day.color}20">
        <div class="ex-hdr">
          <div class="ex-dot"></div>
          <div class="ex-inf">
            <div class="ex-name">${ex.name}</div>
            <div class="ex-meta">
              <span class="ex-sets-lbl">${ex.sets}</span>
              ${lastSet ? `<span class="ex-last">${lastSet.weight}kg × ${lastSet.reps}</span>` : ''}
              ${pr ? '<span class="ex-pr show">PR</span>' : ''}
            </div>
          </div>
          <div class="ex-chev">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="6,9 12,15 18,9"/>
            </svg>
          </div>
        </div>
        <div class="ex-body">
          <div class="ex-body-inner">
            <div class="ex-pad">
              <div class="tip">
                <div class="tip-lbl">TIPP</div>
                <div class="tip-txt">${ex.tip}</div>
              </div>
              <div class="log-row">
                <div class="lf">
                  <label>GEWICHT</label>
                  <input type="number" class="li weight-input" placeholder="${lastSet?.weight || '—'}" inputmode="decimal">
                </div>
                <div class="lf">
                  <label>REPS</label>
                  <input type="number" class="li reps-input" placeholder="${lastSet?.reps || '—'}" inputmode="numeric">
                </div>
                <button class="log-btn">LOG</button>
              </div>
              <div class="lf" style="margin-top: 8px;">
                <label>NOTIZEN</label>
                <textarea class="ni" placeholder="Technik, Gefühl...">${savedNote}</textarea>
              </div>
              <div class="hist-wrap">
                <div class="hist-lbl">VERLAUF</div>
                <div class="hist-list" data-history="${ex.id}">
                  ${renderExerciseHistoryHTML(ex.id)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');

  main.innerHTML = `
    <div class="tab-pane active sg">
      <div class="day-hero" style="--ha: ${day.color}; --ht: ${day.color}">
        <div class="hero-bg">
          <div class="hero-img loaded" style="background-image: url('/src/assets/images/${day.heroImage || 'default.jpg'}')"></div>
          <div class="hero-overlay"></div>
          <div class="hero-vignette"></div>
          <div class="hero-tint"></div>
        </div>
        <div class="hero-accent-line"><span></span></div>
        <div class="hero-content">
          <div class="hero-name">${day.name}</div>
          <div class="hero-focus">${day.focus}</div>
          <div class="hero-stats">
            <div class="hs">
              <div class="hs-v">${day.exercises.length}</div>
              <div class="hs-l">ÜBUNGEN</div>
            </div>
            <div class="hs">
              <div class="hs-v">${day.exercises.reduce((sum, ex) => sum + parseInt(ex.sets), 0)}</div>
              <div class="hs-l">SÄTZE</div>
            </div>
          </div>
        </div>
      </div>
      <div class="sec">ÜBUNGEN</div>
      <div class="ex-list">
        ${exercisesHTML}
      </div>
    </div>
  `;

  // Stagger animation
  staggerIn(main, '.ex-card');
}

/**
 * Render exercise history HTML
 */
function renderExerciseHistoryHTML(exerciseId) {
  const history = storage.getExerciseHistory(exerciseId, 5);

  if (history.length === 0) {
    return '<div class="hist-empty">Noch keine Einträge</div>';
  }

  return history.map((entry, i) => {
    const prev = history[i + 1];
    let diffClass = 'eq';
    let diffText = '—';

    if (prev) {
      const diff = entry.weight - prev.weight;
      if (diff > 0) {
        diffClass = 'up';
        diffText = `+${diff}kg`;
      } else if (diff < 0) {
        diffClass = 'dn';
        diffText = `${diff}kg`;
      }
    }

    return `
      <div class="hist-row">
        <span class="hist-date">${formatDate(entry.date, { day: '2-digit', month: '2-digit' })}</span>
        <span class="hist-kg">${entry.weight}kg</span>
        <span class="hist-reps">×${entry.reps}</span>
        <span class="hist-diff ${diffClass}">${diffText}</span>
      </div>
    `;
  }).join('');
}

/**
 * Update exercise history display
 */
function renderExerciseHistory(exCard, exerciseId) {
  const histList = exCard.querySelector(`[data-history="${exerciseId}"]`);
  if (histList) {
    histList.innerHTML = renderExerciseHistoryHTML(exerciseId);
  }
}

// Export functions for global access
export const app = {
  init,
  switchTab,
  switchDay,
  toggleTimer: () => {
    timer.toggle();
    renderTimerBar();
  },
  resetTimer: () => {
    timer.reset();
    renderTimerBar();
  },
  addTimerTime: (seconds) => {
    timer.addTime(seconds);
    renderTimerBar();
  }
};

// Make app globally accessible
if (typeof window !== 'undefined') {
  window.app = app;
}

export default app;
