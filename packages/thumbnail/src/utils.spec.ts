import { describe, expect, it } from 'bun:test';

import { getKeyText, instrumentColors, isDarkColor } from './utils';

describe('instrumentColors', () => {
  it('should contain 16 color codes', () => {
    expect(instrumentColors).toHaveLength(16);

    instrumentColors.forEach((color) => {
      expect(color).toMatch(/^#[0-9a-f]{6}$/);
    });
  });
});

describe('getKeyText', () => {
  it('should return correct note and octave for given key number', () => {
    // Full range of keys from 0 to 87
    const testCases = [
      { key: 0, expected: 'A0' },
      { key: 1, expected: 'A#0' },
      { key: 2, expected: 'B0' },
      { key: 3, expected: 'C1' },
      { key: 4, expected: 'C#1' },
      { key: 5, expected: 'D1' },
      { key: 6, expected: 'D#1' },
      { key: 7, expected: 'E1' },
      { key: 8, expected: 'F1' },
      { key: 9, expected: 'F#1' },
      { key: 10, expected: 'G1' },
      { key: 11, expected: 'G#1' },
      { key: 12, expected: 'A1' },
      { key: 13, expected: 'A#1' },
      { key: 14, expected: 'B1' },
      { key: 15, expected: 'C2' },
      { key: 16, expected: 'C#2' },
      { key: 17, expected: 'D2' },
      { key: 18, expected: 'D#2' },
      { key: 19, expected: 'E2' },
      { key: 20, expected: 'F2' },
      { key: 21, expected: 'F#2' },
      { key: 22, expected: 'G2' },
      { key: 23, expected: 'G#2' },
      { key: 24, expected: 'A2' },
      { key: 25, expected: 'A#2' },
      { key: 26, expected: 'B2' },
      { key: 27, expected: 'C3' },
      { key: 28, expected: 'C#3' },
      { key: 29, expected: 'D3' },
      { key: 30, expected: 'D#3' },
      { key: 31, expected: 'E3' },
      { key: 32, expected: 'F3' },
      { key: 33, expected: 'F#3' },
      { key: 34, expected: 'G3' },
      { key: 35, expected: 'G#3' },
      { key: 36, expected: 'A3' },
      { key: 37, expected: 'A#3' },
      { key: 38, expected: 'B3' },
      { key: 39, expected: 'C4' },
      { key: 40, expected: 'C#4' },
      { key: 41, expected: 'D4' },
      { key: 42, expected: 'D#4' },
      { key: 43, expected: 'E4' },
      { key: 44, expected: 'F4' },
      { key: 45, expected: 'F#4' },
      { key: 46, expected: 'G4' },
      { key: 47, expected: 'G#4' },
      { key: 48, expected: 'A4' },
      { key: 49, expected: 'A#4' },
      { key: 50, expected: 'B4' },
      { key: 51, expected: 'C5' },
      { key: 52, expected: 'C#5' },
      { key: 53, expected: 'D5' },
      { key: 54, expected: 'D#5' },
      { key: 55, expected: 'E5' },
      { key: 56, expected: 'F5' },
      { key: 57, expected: 'F#5' },
      { key: 58, expected: 'G5' },
      { key: 59, expected: 'G#5' },
      { key: 60, expected: 'A5' },
      { key: 61, expected: 'A#5' },
      { key: 62, expected: 'B5' },
      { key: 63, expected: 'C6' },
      { key: 64, expected: 'C#6' },
      { key: 65, expected: 'D6' },
      { key: 66, expected: 'D#6' },
      { key: 67, expected: 'E6' },
      { key: 68, expected: 'F6' },
      { key: 69, expected: 'F#6' },
      { key: 70, expected: 'G6' },
      { key: 71, expected: 'G#6' },
      { key: 72, expected: 'A6' },
      { key: 73, expected: 'A#6' },
      { key: 74, expected: 'B6' },
      { key: 75, expected: 'C7' },
      { key: 76, expected: 'C#7' },
      { key: 77, expected: 'D7' },
      { key: 78, expected: 'D#7' },
      { key: 79, expected: 'E7' },
      { key: 80, expected: 'F7' },
      { key: 81, expected: 'F#7' },
      { key: 82, expected: 'G7' },
      { key: 83, expected: 'G#7' },
      { key: 84, expected: 'A7' },
      { key: 85, expected: 'A#7' },
      { key: 86, expected: 'B7' },
      { key: 87, expected: 'C8' }
    ];

    testCases.forEach(({ key, expected }) => {
      expect(getKeyText(key)).toBe(expected);
    });
  });
});

describe('isDarkColor', () => {
  it('should correctly identify dark colors', () => {
    // Test with default threshold (40)
    expect(isDarkColor('#000000')).toBe(true); // black
    expect(isDarkColor('#0000FF')).toBe(true); // blue
    expect(isDarkColor('#FF0000')).toBe(false); // red
    expect(isDarkColor('#00FF00')).toBe(false); // green
    expect(isDarkColor('#333333')).toBe(false); // mid gray
    expect(isDarkColor('#444444')).toBe(false); // dark gray
    expect(isDarkColor('#888888')).toBe(false); // light gray
    expect(isDarkColor('#be6b6b')).toBe(false); // light red
    expect(isDarkColor('#1964ac')).toBe(false); // first instrument color
    expect(isDarkColor('#FFFFFF')).toBe(false); // white
    expect(isDarkColor('#F0F0F0')).toBe(false); // light gray
    expect(isDarkColor('#be6b6b')).toBe(false); // light red
  });

  it('should respect custom threshold', () => {
    // TODO: Add more test cases for different thresholds
    expect(isDarkColor('#888888', 100)).toBe(false);
    expect(isDarkColor('#888888', 50)).toBe(false);
    expect(isDarkColor('#444444', 50)).toBe(false);
    expect(isDarkColor('#444444', 130)).toBe(true);
  });

  it('should handle invalid color strings', () => {
    // This is testing the implementation detail that falls back to empty string
    expect(isDarkColor('notacolor')).toBe(true);
    expect(isDarkColor('')).toBe(true);
  });
});

describe('getLuma', () => {
  // Note: getLuma isn't exported, but we can test it through isDarkColor
  it('should calculate luma correctly', () => {
    // These values are calculated from the formula in the code
    expect(isDarkColor('#000000')).toBe(true); // 0
    expect(isDarkColor('#FFFFFF')).toBe(false); // 255
    expect(isDarkColor('#FF0000')).toBe(false); // ~54.213
    expect(isDarkColor('#00FF00')).toBe(false); // ~182.376
    expect(isDarkColor('#0000FF')).toBe(true); // ~18.414
  });
});
