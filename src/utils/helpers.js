/**
 * Helper Utilities
 * Common utility functions used throughout the app
 */

/**
 * Generate a unique ID
 * @returns {string} Unique identifier
 */
export function generateId() {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Format a date to German locale
 * @param {Date|string} date - Date to format
 * @param {object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted date string
 */
export function formatDate(date, options = {}) {
  const d = typeof date === 'string' ? new Date(date) : date;
  const defaultOptions = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    ...options
  };
  return d.toLocaleDateString('de-DE', defaultOptions);
}

/**
 * Format date as relative time (e.g., "vor 2 Tagen")
 * @param {Date|string} date - Date to format
 * @returns {string} Relative time string
 */
export function formatRelativeDate(date) {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = now - d;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Heute';
  if (diffDays === 1) return 'Gestern';
  if (diffDays < 7) return `vor ${diffDays} Tagen`;
  if (diffDays < 30) return `vor ${Math.floor(diffDays / 7)} Wochen`;
  if (diffDays < 365) return `vor ${Math.floor(diffDays / 30)} Monaten`;
  return `vor ${Math.floor(diffDays / 365)} Jahren`;
}

/**
 * Get day name in German
 * @param {number} dayIndex - Day index (0 = Sunday)
 * @returns {string} Day name
 */
export function getDayName(dayIndex, short = false) {
  const days = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
  const shortDays = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
  return short ? shortDays[dayIndex] : days[dayIndex];
}

/**
 * Get month name in German
 * @param {number} monthIndex - Month index (0 = January)
 * @returns {string} Month name
 */
export function getMonthName(monthIndex, short = false) {
  const months = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
  const shortMonths = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'];
  return short ? shortMonths[monthIndex] : months[monthIndex];
}

/**
 * Debounce function
 * @param {Function} fn - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Debounced function
 */
export function debounce(fn, delay = 300) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
}

/**
 * Throttle function
 * @param {Function} fn - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} Throttled function
 */
export function throttle(fn, limit = 100) {
  let inThrottle;
  return function (...args) {
    if (!inThrottle) {
      fn.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * Clamp a number between min and max
 * @param {number} value - Value to clamp
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Clamped value
 */
export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

/**
 * Linear interpolation
 * @param {number} a - Start value
 * @param {number} b - End value
 * @param {number} t - Progress (0-1)
 * @returns {number} Interpolated value
 */
export function lerp(a, b, t) {
  return a + (b - a) * t;
}

/**
 * Map a value from one range to another
 * @param {number} value - Input value
 * @param {number} inMin - Input minimum
 * @param {number} inMax - Input maximum
 * @param {number} outMin - Output minimum
 * @param {number} outMax - Output maximum
 * @returns {number} Mapped value
 */
export function mapRange(value, inMin, inMax, outMin, outMax) {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}

/**
 * Calculate estimated 1RM (One Rep Max)
 * Using Epley formula: weight × (1 + reps/30)
 * @param {number} weight - Weight lifted
 * @param {number} reps - Repetitions performed
 * @returns {number} Estimated 1RM
 */
export function calculate1RM(weight, reps) {
  if (reps === 1) return weight;
  return Math.round(weight * (1 + reps / 30));
}

/**
 * Calculate weight for target reps from 1RM
 * @param {number} oneRepMax - One rep max
 * @param {number} targetReps - Target repetitions
 * @returns {number} Estimated weight
 */
export function calculateWeightFromRM(oneRepMax, targetReps) {
  if (targetReps === 1) return oneRepMax;
  return Math.round(oneRepMax / (1 + targetReps / 30));
}

/**
 * Calculate total volume (sets × reps × weight)
 * @param {Array} sets - Array of { weight, reps } objects
 * @returns {number} Total volume
 */
export function calculateVolume(sets) {
  return sets.reduce((total, set) => {
    return total + (set.weight || 0) * (set.reps || 0);
  }, 0);
}

/**
 * Get week number of the year
 * @param {Date} date - Date object
 * @returns {number} Week number
 */
export function getWeekNumber(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
}

/**
 * Check if a date is today
 * @param {Date|string} date - Date to check
 * @returns {boolean} True if date is today
 */
export function isToday(date) {
  const d = typeof date === 'string' ? new Date(date) : date;
  const today = new Date();
  return d.toDateString() === today.toDateString();
}

/**
 * Get days between two dates
 * @param {Date} start - Start date
 * @param {Date} end - End date
 * @returns {number} Number of days
 */
export function daysBetween(start, end) {
  const msPerDay = 24 * 60 * 60 * 1000;
  return Math.round(Math.abs((end - start) / msPerDay));
}

/**
 * Create ripple effect on element
 * @param {HTMLElement} element - Target element
 * @param {MouseEvent|TouchEvent} event - Click/touch event
 */
export function createRipple(element, event) {
  const rect = element.getBoundingClientRect();
  const ripple = document.createElement('span');
  const size = Math.max(rect.width, rect.height);

  const x = (event.clientX || event.touches?.[0]?.clientX || 0) - rect.left - size / 2;
  const y = (event.clientY || event.touches?.[0]?.clientY || 0) - rect.top - size / 2;

  ripple.style.cssText = `
    position: absolute;
    width: ${size}px;
    height: ${size}px;
    left: ${x}px;
    top: ${y}px;
    border-radius: 50%;
    background: rgba(255,255,255,0.1);
    transform: scale(0);
    pointer-events: none;
    animation: ripple-animation 500ms ease-out forwards;
  `;

  ripple.classList.add('rpl');
  element.appendChild(ripple);

  setTimeout(() => ripple.remove(), 500);
}

/**
 * Simple hash function for strings
 * @param {string} str - String to hash
 * @returns {number} Hash value
 */
export function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

/**
 * Get a quote based on the current day
 * @param {Array} quotes - Array of quotes
 * @returns {object} Quote for today
 */
export function getQuoteOfDay(quotes) {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
  return quotes[dayOfYear % quotes.length];
}

/**
 * Smooth scroll to element
 * @param {HTMLElement|string} target - Element or selector
 * @param {number} offset - Offset from top
 */
export function scrollToElement(target, offset = 0) {
  const element = typeof target === 'string' ? document.querySelector(target) : target;
  if (element) {
    const top = element.getBoundingClientRect().top + window.pageYOffset - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  }
}

/**
 * Parse a number safely
 * @param {any} value - Value to parse
 * @param {number} defaultValue - Default value if parsing fails
 * @returns {number} Parsed number
 */
export function parseNumber(value, defaultValue = 0) {
  const parsed = parseFloat(value);
  return isNaN(parsed) ? defaultValue : parsed;
}

export default {
  generateId,
  formatDate,
  formatRelativeDate,
  getDayName,
  getMonthName,
  debounce,
  throttle,
  clamp,
  lerp,
  mapRange,
  calculate1RM,
  calculateWeightFromRM,
  calculateVolume,
  getWeekNumber,
  isToday,
  daysBetween,
  createRipple,
  hashString,
  getQuoteOfDay,
  scrollToElement,
  parseNumber
};
