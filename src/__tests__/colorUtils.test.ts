import {
  hexToRgb,
  rgbToHex,
  rgbToHsl,
  hslToRgb,
  hexToHsl,
  hslToHex,
  generateColorHarmony,
  getAllColorHarmonies,
  getContrastRatio,
  recommendBestColorPair,
} from '@/utils/colorUtils';
import { ColorHarmonyType } from '@/types/color';

describe('Color Utils Tests', () => {
  describe('Basic Conversions', () => {
    test('hexToRgb converts #FF0000 to RGB', () => {
      const result = hexToRgb('#FF0000');
      expect(result).toEqual({ r: 255, g: 0, b: 0 });
    });

    test('hexToRgb converts #00FF00 to RGB', () => {
      const result = hexToRgb('#00FF00');
      expect(result).toEqual({ r: 0, g: 255, b: 0 });
    });

    test('hexToRgb converts #0000FF to RGB', () => {
      const result = hexToRgb('#0000FF');
      expect(result).toEqual({ r: 0, g: 0, b: 255 });
    });

    test('rgbToHex converts RGB to hex', () => {
      expect(rgbToHex(255, 0, 0)).toBe('#ff0000');
      expect(rgbToHex(0, 255, 0)).toBe('#00ff00');
      expect(rgbToHex(0, 0, 255)).toBe('#0000ff');
    });

    test('rgbToHsl converts red to HSL', () => {
      const result = rgbToHsl(255, 0, 0);
      expect(result.h).toBe(0);
      expect(result.s).toBe(100);
      expect(result.l).toBe(50);
    });

    test('hslToRgb converts HSL to RGB', () => {
      const result = hslToRgb(0, 100, 50);
      expect(result.r).toBe(255);
      expect(result.g).toBe(0);
      expect(result.b).toBe(0);
    });

    test('hexToHsl and hslToHex are inverse operations', () => {
      const originalHex = '#3b82f6';
      const hsl = hexToHsl(originalHex);
      const convertedHex = hslToHex(hsl.h, hsl.s, hsl.l);
      expect(convertedHex).toBe(originalHex);
    });
  });

  describe('Color Harmony Generation', () => {
    test('generateColorHarmony creates complementary colors', () => {
      const harmony = generateColorHarmony('#ff0000', 'complementary');
      expect(harmony.type).toBe('complementary');
      expect(harmony.colors).toHaveLength(2);
      expect(harmony.colors[0]).toBe('#ff0000');
      // Red's complementary is cyan (~#00ffff)
      expect(harmony.colors[1]).toBe('#00ffff');
    });

    test('generateColorHarmony creates analogous colors', () => {
      const harmony = generateColorHarmony('#ff0000', 'analogous');
      expect(harmony.type).toBe('analogous');
      expect(harmony.colors).toHaveLength(3);
    });

    test('generateColorHarmony creates triadic colors', () => {
      const harmony = generateColorHarmony('#ff0000', 'triadic');
      expect(harmony.type).toBe('triadic');
      expect(harmony.colors).toHaveLength(3);
    });

    test('generateColorHarmony creates split-complementary colors', () => {
      const harmony = generateColorHarmony('#ff0000', 'split-complementary');
      expect(harmony.type).toBe('split-complementary');
      expect(harmony.colors).toHaveLength(3);
    });

    test('generateColorHarmony creates tetradic colors', () => {
      const harmony = generateColorHarmony('#ff0000', 'tetradic');
      expect(harmony.type).toBe('tetradic');
      expect(harmony.colors).toHaveLength(4);
    });

    test('generateColorHarmony creates monochromatic colors', () => {
      const harmony = generateColorHarmony('#ff0000', 'monochromatic');
      expect(harmony.type).toBe('monochromatic');
      expect(harmony.colors).toHaveLength(4);
    });

    test('getAllColorHarmonies returns all harmony types', () => {
      const harmonies = getAllColorHarmonies('#3b82f6');
      expect(harmonies).toHaveLength(6);
      
      const types: ColorHarmonyType[] = [
        'complementary',
        'analogous',
        'triadic',
        'split-complementary',
        'tetradic',
        'monochromatic',
      ];
      
      types.forEach((type) => {
        const harmony = harmonies.find((h) => h.type === type);
        expect(harmony).toBeDefined();
        expect(harmony?.name).toBeDefined();
        expect(harmony?.description).toBeDefined();
      });
    });
  });

  describe('Contrast Ratio', () => {
    test('getContrastRatio calculates contrast between black and white', () => {
      const ratio = getContrastRatio('#000000', '#ffffff');
      expect(ratio).toBeGreaterThan(20); // Should be around 21:1
    });

    test('getContrastRatio calculates contrast between similar colors', () => {
      const ratio = getContrastRatio('#333333', '#444444');
      expect(ratio).toBeLessThan(2); // Low contrast
    });

    test('getContrastRatio is symmetric', () => {
      const ratio1 = getContrastRatio('#ff0000', '#00ff00');
      const ratio2 = getContrastRatio('#00ff00', '#ff0000');
      expect(ratio1).toBe(ratio2);
    });
  });

  describe('Color Recommendation', () => {
    test('recommendBestColorPair returns primary and secondary colors', () => {
      const result = recommendBestColorPair('#3b82f6');
      expect(result.primary).toBe('#3b82f6');
      expect(result.secondary).toBeDefined();
      expect(result.secondary).toMatch(/^#[0-9a-f]{6}$/);
      expect(result.harmony).toBeDefined();
      expect(result.harmony.type).toBe('complementary');
    });

    test('recommendBestColorPair provides valid hex colors', () => {
      const testColors = ['#ff0000', '#00ff00', '#0000ff', '#3b82f6', '#f59e0b'];
      
      testColors.forEach((color) => {
        const result = recommendBestColorPair(color);
        expect(result.primary).toMatch(/^#[0-9a-f]{6}$/);
        expect(result.secondary).toMatch(/^#[0-9a-f]{6}$/);
      });
    });
  });

  describe('Edge Cases', () => {
    test('handles pure black', () => {
      const hsl = hexToHsl('#000000');
      expect(hsl.l).toBe(0);
      const backToHex = hslToHex(hsl.h, hsl.s, hsl.l);
      expect(backToHex).toBe('#000000');
    });

    test('handles pure white', () => {
      const hsl = hexToHsl('#ffffff');
      expect(hsl.l).toBe(100);
      const backToHex = hslToHex(hsl.h, hsl.s, hsl.l);
      expect(backToHex).toBe('#ffffff');
    });

    test('handles gray colors', () => {
      const hsl = hexToHsl('#808080');
      expect(hsl.s).toBe(0); // Grays have 0 saturation
    });
  });
});

// Test runner
console.log('Running Color Utils Tests...\n');
