/**
 * Timer Service
 * Handles rest timer functionality with audio notifications
 */

let timerState = {
  isRunning: false,
  seconds: 0,
  intervalId: null,
  onTick: null,
  onComplete: null
};

const DEFAULT_REST_TIMES = {
  short: 60,   // 1 minute
  medium: 90,  // 1.5 minutes
  long: 120,   // 2 minutes
  heavy: 180   // 3 minutes
};

/**
 * Format seconds to MM:SS
 * @param {number} seconds - Total seconds
 * @returns {string} Formatted time string
 */
export function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Start the timer
 * @param {number} seconds - Starting seconds (0 for count-up)
 * @param {object} callbacks - { onTick, onComplete }
 */
export function start(seconds = 0, callbacks = {}) {
  if (timerState.isRunning) {
    stop();
  }

  timerState = {
    isRunning: true,
    seconds,
    intervalId: null,
    onTick: callbacks.onTick || null,
    onComplete: callbacks.onComplete || null
  };

  timerState.intervalId = setInterval(() => {
    if (timerState.seconds > 0) {
      // Countdown mode
      timerState.seconds--;

      if (timerState.onTick) {
        timerState.onTick(timerState.seconds);
      }

      if (timerState.seconds === 0 && timerState.onComplete) {
        playNotificationSound();
        timerState.onComplete();
        stop();
      }
    } else {
      // Count-up mode
      timerState.seconds++;

      if (timerState.onTick) {
        timerState.onTick(timerState.seconds);
      }
    }
  }, 1000);

  return timerState;
}

/**
 * Start a countdown timer
 * @param {number} seconds - Seconds to count down from
 * @param {object} callbacks - { onTick, onComplete }
 */
export function startCountdown(seconds, callbacks = {}) {
  return start(seconds, callbacks);
}

/**
 * Start a rest timer with preset duration
 * @param {string} preset - 'short', 'medium', 'long', 'heavy'
 * @param {object} callbacks - { onTick, onComplete }
 */
export function startRest(preset = 'medium', callbacks = {}) {
  const seconds = DEFAULT_REST_TIMES[preset] || DEFAULT_REST_TIMES.medium;
  return startCountdown(seconds, callbacks);
}

/**
 * Stop the timer
 */
export function stop() {
  if (timerState.intervalId) {
    clearInterval(timerState.intervalId);
  }
  timerState.isRunning = false;
  timerState.intervalId = null;
  return timerState.seconds;
}

/**
 * Reset the timer
 */
export function reset() {
  stop();
  timerState.seconds = 0;
  if (timerState.onTick) {
    timerState.onTick(0);
  }
}

/**
 * Toggle timer (start/stop)
 */
export function toggle() {
  if (timerState.isRunning) {
    return stop();
  } else {
    return start(timerState.seconds, {
      onTick: timerState.onTick,
      onComplete: timerState.onComplete
    });
  }
}

/**
 * Get current timer state
 */
export function getState() {
  return {
    isRunning: timerState.isRunning,
    seconds: timerState.seconds,
    formatted: formatTime(timerState.seconds)
  };
}

/**
 * Add time to the timer
 * @param {number} seconds - Seconds to add
 */
export function addTime(seconds) {
  timerState.seconds += seconds;
  if (timerState.onTick) {
    timerState.onTick(timerState.seconds);
  }
}

/**
 * Play notification sound
 */
function playNotificationSound() {
  try {
    // Create a simple beep sound using Web Audio API
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 800;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);

    // Vibrate if supported
    if ('vibrate' in navigator) {
      navigator.vibrate([200, 100, 200]);
    }
  } catch (error) {
    console.warn('[Timer] Audio not available:', error);
  }
}

/**
 * Request notification permission
 */
export async function requestNotificationPermission() {
  if ('Notification' in window) {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }
  return false;
}

/**
 * Send notification
 * @param {string} title - Notification title
 * @param {string} body - Notification body
 */
export function sendNotification(title, body) {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(title, {
      body,
      icon: '/icons/icon-192.png',
      badge: '/icons/icon-192.png',
      tag: 'timer-notification',
      renotify: true
    });
  }
}

export default {
  formatTime,
  start,
  startCountdown,
  startRest,
  stop,
  reset,
  toggle,
  getState,
  addTime,
  requestNotificationPermission,
  sendNotification,
  DEFAULT_REST_TIMES
};
