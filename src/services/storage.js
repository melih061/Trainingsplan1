/**
 * Storage Service
 * Handles all data persistence using localStorage and IndexedDB
 */

const STORAGE_PREFIX = 'melih_training_';
const STORAGE_VERSION = 1;

/**
 * Storage keys
 */
export const KEYS = {
  WORKOUT_LOGS: 'workout_logs',
  SETTINGS: 'settings',
  STREAK: 'streak',
  CHALLENGES: 'challenges',
  CUSTOM_EXERCISES: 'custom_exercises',
  NUTRITION_LOGS: 'nutrition_logs',
  BODY_MEASUREMENTS: 'body_measurements',
  PERSONAL_RECORDS: 'personal_records'
};

/**
 * Get full storage key with prefix
 */
function getKey(key) {
  return `${STORAGE_PREFIX}${key}`;
}

/**
 * Save data to localStorage
 * @param {string} key - Storage key
 * @param {any} data - Data to store
 */
export function save(key, data) {
  try {
    const serialized = JSON.stringify({
      version: STORAGE_VERSION,
      timestamp: Date.now(),
      data
    });
    localStorage.setItem(getKey(key), serialized);
    return true;
  } catch (error) {
    console.error(`[Storage] Failed to save ${key}:`, error);
    return false;
  }
}

/**
 * Load data from localStorage
 * @param {string} key - Storage key
 * @param {any} defaultValue - Default value if not found
 */
export function load(key, defaultValue = null) {
  try {
    const serialized = localStorage.getItem(getKey(key));
    if (!serialized) return defaultValue;

    const { data } = JSON.parse(serialized);
    return data ?? defaultValue;
  } catch (error) {
    console.error(`[Storage] Failed to load ${key}:`, error);
    return defaultValue;
  }
}

/**
 * Remove data from localStorage
 * @param {string} key - Storage key
 */
export function remove(key) {
  try {
    localStorage.removeItem(getKey(key));
    return true;
  } catch (error) {
    console.error(`[Storage] Failed to remove ${key}:`, error);
    return false;
  }
}

/**
 * Clear all app data
 */
export function clearAll() {
  try {
    Object.keys(localStorage)
      .filter(key => key.startsWith(STORAGE_PREFIX))
      .forEach(key => localStorage.removeItem(key));
    return true;
  } catch (error) {
    console.error('[Storage] Failed to clear all:', error);
    return false;
  }
}

/**
 * Export all data as JSON
 */
export function exportData() {
  const data = {};
  Object.keys(localStorage)
    .filter(key => key.startsWith(STORAGE_PREFIX))
    .forEach(key => {
      const shortKey = key.replace(STORAGE_PREFIX, '');
      data[shortKey] = load(shortKey);
    });
  return data;
}

/**
 * Import data from JSON
 * @param {object} data - Data to import
 */
export function importData(data) {
  try {
    Object.entries(data).forEach(([key, value]) => {
      save(key, value);
    });
    return true;
  } catch (error) {
    console.error('[Storage] Failed to import data:', error);
    return false;
  }
}

/**
 * Get storage usage info
 */
export function getStorageInfo() {
  let totalSize = 0;
  let itemCount = 0;

  Object.keys(localStorage)
    .filter(key => key.startsWith(STORAGE_PREFIX))
    .forEach(key => {
      const value = localStorage.getItem(key);
      totalSize += key.length + (value?.length || 0);
      itemCount++;
    });

  return {
    itemCount,
    totalSize,
    totalSizeKB: (totalSize / 1024).toFixed(2),
    totalSizeMB: (totalSize / 1024 / 1024).toFixed(4)
  };
}

// ============================================
// Workout-specific storage functions
// ============================================

/**
 * Log a workout set
 * @param {string} dayId - Day identifier (push, pull, etc.)
 * @param {string} exerciseId - Exercise identifier
 * @param {object} setData - { weight, reps, notes }
 */
export function logWorkoutSet(dayId, exerciseId, setData) {
  const logs = load(KEYS.WORKOUT_LOGS, {});
  const dateKey = new Date().toISOString().split('T')[0];

  if (!logs[dateKey]) logs[dateKey] = {};
  if (!logs[dateKey][dayId]) logs[dateKey][dayId] = {};
  if (!logs[dateKey][dayId][exerciseId]) logs[dateKey][dayId][exerciseId] = [];

  logs[dateKey][dayId][exerciseId].push({
    ...setData,
    timestamp: Date.now()
  });

  save(KEYS.WORKOUT_LOGS, logs);

  // Check for PR
  checkAndUpdatePR(exerciseId, setData.weight, setData.reps);

  return true;
}

/**
 * Get workout history for an exercise
 * @param {string} exerciseId - Exercise identifier
 * @param {number} limit - Maximum number of entries
 */
export function getExerciseHistory(exerciseId, limit = 10) {
  const logs = load(KEYS.WORKOUT_LOGS, {});
  const history = [];

  Object.entries(logs)
    .sort(([a], [b]) => b.localeCompare(a)) // Sort by date descending
    .forEach(([date, days]) => {
      Object.values(days).forEach(exercises => {
        if (exercises[exerciseId]) {
          exercises[exerciseId].forEach(set => {
            history.push({
              date,
              ...set
            });
          });
        }
      });
    });

  return history.slice(0, limit);
}

/**
 * Get last logged set for an exercise
 * @param {string} exerciseId - Exercise identifier
 */
export function getLastSet(exerciseId) {
  const history = getExerciseHistory(exerciseId, 1);
  return history[0] || null;
}

/**
 * Check and update personal record
 */
function checkAndUpdatePR(exerciseId, weight, reps) {
  const prs = load(KEYS.PERSONAL_RECORDS, {});
  const current = prs[exerciseId];

  // Simple 1RM estimation: weight * (1 + reps/30)
  const estimated1RM = weight * (1 + reps / 30);

  if (!current || estimated1RM > current.estimated1RM) {
    prs[exerciseId] = {
      weight,
      reps,
      estimated1RM,
      date: new Date().toISOString()
    };
    save(KEYS.PERSONAL_RECORDS, prs);
    return true; // New PR!
  }

  return false;
}

/**
 * Get personal record for an exercise
 */
export function getPR(exerciseId) {
  const prs = load(KEYS.PERSONAL_RECORDS, {});
  return prs[exerciseId] || null;
}

/**
 * Get all personal records
 */
export function getAllPRs() {
  return load(KEYS.PERSONAL_RECORDS, {});
}

// ============================================
// Streak management
// ============================================

/**
 * Get current streak data
 */
export function getStreak() {
  return load(KEYS.STREAK, {
    current: 0,
    longest: 0,
    lastWorkoutDate: null,
    totalSessions: 0
  });
}

/**
 * Update streak after workout
 */
export function updateStreak() {
  const streak = getStreak();
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  if (streak.lastWorkoutDate === today) {
    // Already worked out today
    return streak;
  }

  streak.totalSessions++;

  if (streak.lastWorkoutDate === yesterday) {
    // Consecutive day
    streak.current++;
  } else if (streak.lastWorkoutDate !== today) {
    // Streak broken or first workout
    streak.current = 1;
  }

  streak.longest = Math.max(streak.longest, streak.current);
  streak.lastWorkoutDate = today;

  save(KEYS.STREAK, streak);
  return streak;
}

// ============================================
// Challenges
// ============================================

/**
 * Get today's challenge status
 */
export function getChallengeStatus() {
  const today = new Date().toISOString().split('T')[0];
  const challenges = load(KEYS.CHALLENGES, {});
  return challenges[today] || {};
}

/**
 * Toggle challenge completion
 */
export function toggleChallenge(challengeId) {
  const today = new Date().toISOString().split('T')[0];
  const challenges = load(KEYS.CHALLENGES, {});

  if (!challenges[today]) challenges[today] = {};
  challenges[today][challengeId] = !challenges[today][challengeId];

  save(KEYS.CHALLENGES, challenges);
  return challenges[today][challengeId];
}

export default {
  KEYS,
  save,
  load,
  remove,
  clearAll,
  exportData,
  importData,
  getStorageInfo,
  logWorkoutSet,
  getExerciseHistory,
  getLastSet,
  getPR,
  getAllPRs,
  getStreak,
  updateStreak,
  getChallengeStatus,
  toggleChallenge
};
