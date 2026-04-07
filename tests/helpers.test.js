/**
 * Helper Utilities Tests
 */

import { describe, it, expect } from 'vitest';
import * as helpers from '../src/utils/helpers.js';

describe('Helper Utilities', () => {
  describe('generateId', () => {
    it('should generate unique IDs', () => {
      const id1 = helpers.generateId();
      const id2 = helpers.generateId();
      expect(id1).not.toBe(id2);
    });

    it('should generate string IDs', () => {
      const id = helpers.generateId();
      expect(typeof id).toBe('string');
    });
  });

  describe('formatDate', () => {
    it('should format date in German locale', () => {
      const date = new Date('2024-03-15');
      const formatted = helpers.formatDate(date);
      expect(formatted).toContain('15');
      expect(formatted).toContain('03');
      expect(formatted).toContain('2024');
    });
  });

  describe('getDayName', () => {
    it('should return correct day names', () => {
      expect(helpers.getDayName(0)).toBe('Sonntag');
      expect(helpers.getDayName(1)).toBe('Montag');
      expect(helpers.getDayName(6)).toBe('Samstag');
    });

    it('should return short day names', () => {
      expect(helpers.getDayName(0, true)).toBe('So');
      expect(helpers.getDayName(1, true)).toBe('Mo');
    });
  });

  describe('calculate1RM', () => {
    it('should return weight for single rep', () => {
      expect(helpers.calculate1RM(100, 1)).toBe(100);
    });

    it('should calculate estimated 1RM using Epley formula', () => {
      const result = helpers.calculate1RM(80, 10);
      expect(result).toBeGreaterThan(80);
      expect(result).toBeLessThan(120);
    });
  });

  describe('calculateVolume', () => {
    it('should calculate total volume', () => {
      const sets = [
        { weight: 80, reps: 10 },
        { weight: 80, reps: 8 },
        { weight: 75, reps: 6 }
      ];

      const volume = helpers.calculateVolume(sets);
      expect(volume).toBe(80*10 + 80*8 + 75*6);
    });

    it('should handle empty sets', () => {
      expect(helpers.calculateVolume([])).toBe(0);
    });
  });

  describe('clamp', () => {
    it('should clamp value within range', () => {
      expect(helpers.clamp(5, 0, 10)).toBe(5);
      expect(helpers.clamp(-5, 0, 10)).toBe(0);
      expect(helpers.clamp(15, 0, 10)).toBe(10);
    });
  });

  describe('lerp', () => {
    it('should interpolate values', () => {
      expect(helpers.lerp(0, 100, 0.5)).toBe(50);
      expect(helpers.lerp(0, 100, 0)).toBe(0);
      expect(helpers.lerp(0, 100, 1)).toBe(100);
    });
  });

  describe('debounce', () => {
    it('should create debounced function', () => {
      const fn = helpers.debounce(() => {}, 100);
      expect(typeof fn).toBe('function');
    });
  });

  describe('throttle', () => {
    it('should create throttled function', () => {
      const fn = helpers.throttle(() => {}, 100);
      expect(typeof fn).toBe('function');
    });
  });

  describe('parseNumber', () => {
    it('should parse valid numbers', () => {
      expect(helpers.parseNumber('42')).toBe(42);
      expect(helpers.parseNumber('3.14')).toBe(3.14);
    });

    it('should return default for invalid input', () => {
      expect(helpers.parseNumber('abc', 0)).toBe(0);
      expect(helpers.parseNumber(null, -1)).toBe(-1);
    });
  });
});
