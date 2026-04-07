/**
 * Storage Service Tests
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as storage from '../src/services/storage.js';

describe('Storage Service', () => {
  beforeEach(() => {
    // Clear storage before each test
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('save and load', () => {
    it('should save and load data correctly', () => {
      const testData = { foo: 'bar', num: 42 };
      storage.save('test_key', testData);

      const loaded = storage.load('test_key');
      expect(loaded).toEqual(testData);
    });

    it('should return default value for non-existent key', () => {
      const result = storage.load('nonexistent', 'default');
      expect(result).toBe('default');
    });

    it('should return null for non-existent key without default', () => {
      const result = storage.load('nonexistent');
      expect(result).toBeNull();
    });
  });

  describe('remove', () => {
    it('should remove stored data', () => {
      storage.save('to_remove', { data: true });
      storage.remove('to_remove');

      const result = storage.load('to_remove');
      expect(result).toBeNull();
    });
  });

  describe('workout logging', () => {
    it('should log a workout set', () => {
      storage.logWorkoutSet('push', 'bench-press', {
        weight: 80,
        reps: 10,
        notes: 'Test'
      });

      const history = storage.getExerciseHistory('bench-press');
      expect(history).toHaveLength(1);
      expect(history[0].weight).toBe(80);
      expect(history[0].reps).toBe(10);
    });

    it('should track multiple sets', () => {
      storage.logWorkoutSet('push', 'bench-press', { weight: 80, reps: 10 });
      storage.logWorkoutSet('push', 'bench-press', { weight: 82.5, reps: 8 });

      const history = storage.getExerciseHistory('bench-press');
      expect(history).toHaveLength(2);
    });
  });

  describe('streak management', () => {
    it('should start with zero streak', () => {
      const streak = storage.getStreak();
      expect(streak.current).toBe(0);
      expect(streak.totalSessions).toBe(0);
    });

    it('should increment streak on workout', () => {
      storage.updateStreak();
      const streak = storage.getStreak();

      expect(streak.current).toBe(1);
      expect(streak.totalSessions).toBe(1);
    });
  });

  describe('export and import', () => {
    it('should export all data', () => {
      storage.save('key1', { a: 1 });
      storage.save('key2', { b: 2 });

      const exported = storage.exportData();
      expect(exported.key1).toEqual({ a: 1 });
      expect(exported.key2).toEqual({ b: 2 });
    });

    it('should import data correctly', () => {
      const data = {
        imported_key: { imported: true }
      };

      storage.importData(data);
      const loaded = storage.load('imported_key');

      expect(loaded).toEqual({ imported: true });
    });
  });
});
