export interface HSLColor {
  h: number; // 0-360
  s: number; // 0-100
  l: number; // 0-100
}

export interface RGBColor {
  r: number; // 0-255
  g: number; // 0-255
  b: number; // 0-255
}

export interface ColorPair {
  primary: string; // hex
  secondary: string; // hex
}

export type ColorHarmonyType = 
  | 'complementary' 
  | 'analogous' 
  | 'triadic' 
  | 'split-complementary' 
  | 'tetradic' 
  | 'monochromatic';

export interface ColorHarmony {
  type: ColorHarmonyType;
  name: string;
  description: string;
  colors: string[];
}

export type SelectionMode = 'free' | 'recommend';
