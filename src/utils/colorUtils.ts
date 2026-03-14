import { HSLColor, RGBColor, ColorHarmony, ColorHarmonyType } from '@/types/color';

// Hex 转 RGB
export function hexToRgb(hex: string): RGBColor {
  const cleanHex = hex.replace('#', '');
  const bigint = parseInt(cleanHex, 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255,
  };
}

// RGB 转 Hex
export function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => {
    const hex = Math.round(n).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

// RGB 转 HSL
export function rgbToHsl(r: number, g: number, b: number): HSLColor {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

// HSL 转 RGB
export function hslToRgb(h: number, s: number, l: number): RGBColor {
  h /= 360;
  s /= 100;
  l /= 100;

  let r: number, g: number, b: number;

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
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
}

// Hex 转 HSL
export function hexToHsl(hex: string): HSLColor {
  const rgb = hexToRgb(hex);
  return rgbToHsl(rgb.r, rgb.g, rgb.b);
}

// HSL 转 Hex
export function hslToHex(h: number, s: number, l: number): string {
  const rgb = hslToRgb(h, s, l);
  return rgbToHex(rgb.r, rgb.g, rgb.b);
}

// 生成色彩和谐方案
export function generateColorHarmony(
  baseHex: string,
  type: ColorHarmonyType
): ColorHarmony {
  const baseHsl = hexToHsl(baseHex);
  const { h, s, l } = baseHsl;
  let colors: string[] = [baseHex];

  switch (type) {
    case 'complementary':
      // 互补色 - 色轮对面 (180度)
      colors.push(hslToHex((h + 180) % 360, s, l));
      break;

    case 'analogous':
      // 类似色 - 相邻颜色 (-30, +30度)
      colors.push(hslToHex((h - 30 + 360) % 360, s, l));
      colors.push(hslToHex((h + 30) % 360, s, l));
      break;

    case 'triadic':
      // 三色方案 - 等距 (120度)
      colors.push(hslToHex((h + 120) % 360, s, l));
      colors.push(hslToHex((h + 240) % 360, s, l));
      break;

    case 'split-complementary':
      // 分裂互补色 - 互补色两侧 (+150, +210度)
      colors.push(hslToHex((h + 150) % 360, s, l));
      colors.push(hslToHex((h + 210) % 360, s, l));
      break;

    case 'tetradic':
      // 四色方案 - 矩形 (0, 60, 180, 240度)
      colors.push(hslToHex((h + 60) % 360, s, l));
      colors.push(hslToHex((h + 180) % 360, s, l));
      colors.push(hslToHex((h + 240) % 360, s, l));
      break;

    case 'monochromatic':
      // 单色方案 - 同色相不同明度
      colors.push(hslToHex(h, s, Math.max(20, l - 30)));
      colors.push(hslToHex(h, s, Math.min(80, l + 30)));
      colors.push(hslToHex(h, Math.max(20, s - 30), l));
      break;
  }

  const descriptions: Record<ColorHarmonyType, string> = {
    complementary: '互补色方案，对比强烈，适合强调重点',
    analogous: '类似色方案，和谐统一，适合柔和设计',
    triadic: '三色方案，平衡且丰富，适合活泼设计',
    'split-complementary': '分裂互补色，对比适中，适合现代设计',
    tetradic: '四色方案，丰富多彩，适合复杂设计',
    monochromatic: '单色方案，简洁优雅，适合极简设计',
  };

  const names: Record<ColorHarmonyType, string> = {
    complementary: '互补色',
    analogous: '类似色',
    triadic: '三色',
    'split-complementary': '分裂互补色',
    tetradic: '四色',
    monochromatic: '单色',
  };

  return {
    type,
    name: names[type],
    description: descriptions[type],
    colors,
  };
}

// 获取所有色彩和谐方案
export function getAllColorHarmonies(baseHex: string): ColorHarmony[] {
  const types: ColorHarmonyType[] = [
    'complementary',
    'analogous',
    'triadic',
    'split-complementary',
    'tetradic',
    'monochromatic',
  ];
  return types.map((type) => generateColorHarmony(baseHex, type));
}

// 计算颜色之间的对比度
export function getContrastRatio(hex1: string, hex2: string): number {
  const rgb1 = hexToRgb(hex1);
  const rgb2 = hexToRgb(hex2);

  const luminance1 = getLuminance(rgb1);
  const luminance2 = getLuminance(rgb2);

  const lighter = Math.max(luminance1, luminance2);
  const darker = Math.min(luminance1, luminance2);

  return (lighter + 0.05) / (darker + 0.05);
}

// 计算相对亮度
function getLuminance(rgb: RGBColor): number {
  const rsRGB = rgb.r / 255;
  const gsRGB = rgb.g / 255;
  const bsRGB = rgb.b / 255;

  const r = rsRGB <= 0.03928 ? rsRGB / 12.92 : Math.pow((rsRGB + 0.055) / 1.055, 2.4);
  const g = gsRGB <= 0.03928 ? gsRGB / 12.92 : Math.pow((gsRGB + 0.055) / 1.055, 2.4);
  const b = bsRGB <= 0.03928 ? bsRGB / 12.92 : Math.pow((bsRGB + 0.055) / 1.055, 2.4);

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

// 推荐最佳配色
export function recommendBestColorPair(baseHex: string): { primary: string; secondary: string; harmony: ColorHarmony } {
  const harmonies = getAllColorHarmonies(baseHex);
  
  // 优先推荐互补色方案，对比度最好
  const complementary = harmonies.find(h => h.type === 'complementary')!;
  
  return {
    primary: baseHex,
    secondary: complementary.colors[1],
    harmony: complementary,
  };
}

// 从色轮位置计算颜色
export function getColorFromWheelPosition(
  x: number,
  y: number,
  centerX: number,
  centerY: number,
  radius: number
): string {
  const dx = x - centerX;
  const dy = y - centerY;
  const distance = Math.sqrt(dx * dx + dy * dy);
  
  if (distance > radius) {
    return hslToHex(0, 0, 50); // 默认灰色
  }
  
  // 计算角度 (色相)
  let angle = Math.atan2(dy, dx) * (180 / Math.PI);
  angle = (angle + 90 + 360) % 360; // 调整使顶部为0度
  
  // 距离中心越远，饱和度越高
  const saturation = Math.min(100, (distance / radius) * 100);
  
  return hslToHex(angle, saturation, 50);
}
