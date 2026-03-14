export interface HSL {
  h: number;
  s: number;
  l: number;
}

export interface RGB {
  r: number;
  g: number;
  b: number;
}

export const hexToRgb = (hex: string): RGB => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 0, g: 0, b: 0 };
};

export const rgbToHex = (rgb: RGB): string => {
  return '#' + [rgb.r, rgb.g, rgb.b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
};

export const rgbToHsl = (rgb: RGB): HSL => {
  let { r, g, b } = rgb;
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s;
  const l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h *= 60;
  }

  return { h, s, l };
};

export const hslToRgb = (hsl: HSL): RGB => {
  let { h, s, l } = hsl;
  h = h % 360;
  if (h < 0) h += 360;
  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h / 360 + 1 / 3);
    g = hue2rgb(p, q, h / 360);
    b = hue2rgb(p, q, h / 360 - 1 / 3);
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
};

export const hexToHsl = (hex: string): HSL => {
  return rgbToHsl(hexToRgb(hex));
};

export const hslToHex = (hsl: HSL): string => {
  return rgbToHex(hslToRgb(hsl));
};

export const getComplementaryColor = (hex: string): string => {
  const hsl = hexToHsl(hex);
  hsl.h = (hsl.h + 180) % 360;
  return hslToHex(hsl);
};

export const getAnalogousColors = (hex: string, angle: number = 30): string[] => {
  const hsl = hexToHsl(hex);
  return [
    hslToHex({ ...hsl, h: (hsl.h - angle + 360) % 360 }),
    hslToHex({ ...hsl, h: (hsl.h + angle) % 360 }),
  ];
};

export const getTriadicColors = (hex: string): string[] => {
  const hsl = hexToHsl(hex);
  return [
    hslToHex({ ...hsl, h: (hsl.h + 120) % 360 }),
    hslToHex({ ...hsl, h: (hsl.h + 240) % 360 }),
  ];
};

export const getSplitComplementaryColors = (hex: string): string[] => {
  const hsl = hexToHsl(hex);
  return [
    hslToHex({ ...hsl, h: (hsl.h + 150) % 360 }),
    hslToHex({ ...hsl, h: (hsl.h + 210) % 360 }),
  ];
};

export const getRecommendedColors = (hex: string): string[] => {
  const complementary = getComplementaryColor(hex);
  const analogous = getAnalogousColors(hex);
  const triadic = getTriadicColors(hex);
  const splitComplementary = getSplitComplementaryColors(hex);
  return [complementary, ...analogous, ...triadic, ...splitComplementary];
};

export const getRandomColor = (): string => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};
