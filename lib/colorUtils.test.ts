import {
  hexToRgb,
  rgbToHex,
  rgbToHsl,
  hslToRgb,
  hexToHsl,
  hslToHex,
  getComplementaryColor,
  getAnalogousColors,
  getTriadicColors,
  getSplitComplementaryColors,
  getRecommendedColors,
  getRandomColor,
} from './colorUtils';

describe('colorUtils', () => {
  describe('hexToRgb', () => {
    it('should convert hex to rgb correctly', () => {
      expect(hexToRgb('#FF0000')).toEqual({ r: 255, g: 0, b: 0 });
      expect(hexToRgb('#00FF00')).toEqual({ r: 0, g: 255, b: 0 });
      expect(hexToRgb('#0000FF')).toEqual({ r: 0, g: 0, b: 255 });
      expect(hexToRgb('#FFFFFF')).toEqual({ r: 255, g: 255, b: 255 });
      expect(hexToRgb('#000000')).toEqual({ r: 0, g: 0, b: 0 });
    });
  });

  describe('rgbToHex', () => {
    it('should convert rgb to hex correctly', () => {
      expect(rgbToHex({ r: 255, g: 0, b: 0 })).toBe('#ff0000');
      expect(rgbToHex({ r: 0, g: 255, b: 0 })).toBe('#00ff00');
      expect(rgbToHex({ r: 0, g: 0, b: 255 })).toBe('#0000ff');
    });
  });

  describe('rgbToHsl and hslToRgb', () => {
    it('should convert rgb to hsl and back correctly', () => {
      const red = { r: 255, g: 0, b: 0 };
      const hsl = rgbToHsl(red);
      const backToRgb = hslToRgb(hsl);
      expect(backToRgb.r).toBeGreaterThanOrEqual(250);
      expect(backToRgb.g).toBeLessThan(10);
      expect(backToRgb.b).toBeLessThan(10);
    });
  });

  describe('hexToHsl and hslToHex', () => {
    it('should convert hex to hsl and back correctly', () => {
      const hex = '#FF0000';
      const hsl = hexToHsl(hex);
      const backToHex = hslToHex(hsl);
      expect(backToHex.toLowerCase()).toBe(hex.toLowerCase());
    });
  });

  describe('getComplementaryColor', () => {
    it('should return complementary color', () => {
      const red = '#FF0000';
      const complementary = getComplementaryColor(red);
      const hsl = hexToHsl(complementary);
      expect(Math.abs(hsl.h - 180)).toBeLessThan(5);
    });
  });

  describe('getAnalogousColors', () => {
    it('should return two analogous colors', () => {
      const colors = getAnalogousColors('#FF0000');
      expect(colors).toHaveLength(2);
      colors.forEach(color => {
        expect(color).toMatch(/^#[0-9A-Fa-f]{6}$/);
      });
    });
  });

  describe('getTriadicColors', () => {
    it('should return two triadic colors', () => {
      const colors = getTriadicColors('#FF0000');
      expect(colors).toHaveLength(2);
      colors.forEach(color => {
        expect(color).toMatch(/^#[0-9A-Fa-f]{6}$/);
      });
    });
  });

  describe('getSplitComplementaryColors', () => {
    it('should return two split complementary colors', () => {
      const colors = getSplitComplementaryColors('#FF0000');
      expect(colors).toHaveLength(2);
      colors.forEach(color => {
        expect(color).toMatch(/^#[0-9A-Fa-f]{6}$/);
      });
    });
  });

  describe('getRecommendedColors', () => {
    it('should return multiple recommended colors', () => {
      const colors = getRecommendedColors('#FF0000');
      expect(colors.length).toBeGreaterThan(4);
      colors.forEach(color => {
        expect(color).toMatch(/^#[0-9A-Fa-f]{6}$/);
      });
    });
  });

  describe('getRandomColor', () => {
    it('should return random hex color', () => {
      const color = getRandomColor();
      expect(color).toMatch(/^#[0-9A-Fa-f]{6}$/);
    });

    it('should return different colors on subsequent calls', () => {
      const color1 = getRandomColor();
      const color2 = getRandomColor();
      const color3 = getRandomColor();
      expect(new Set([color1, color2, color3]).size).toBeGreaterThan(1);
    });
  });
});
