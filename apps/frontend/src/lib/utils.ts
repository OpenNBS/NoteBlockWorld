import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Converts OKLCH color format to RGB hex code
 * @param oklchString - OKLCH color string (e.g., "oklch(38% 0.189 293.745)")
 * @returns RGB hex code (e.g., "#1a1a1a")
 */
export function oklchToRgb(oklchString: string): string {
  // Parse OKLCH values from string like "oklch(38% 0.189 293.745)"
  const match = oklchString.match(/oklch\(([^)]+)\)/);
  if (!match) {
    throw new Error(`Invalid OKLCH format: ${oklchString}`);
  }

  const parts = match[1].trim().split(/\s+/);
  const l = parseFloat(parts[0].replace('%', '')) / 100; // Convert percentage to 0-1
  const c = parseFloat(parts[1]);
  const h = parseFloat(parts[2]) * (Math.PI / 180); // Convert degrees to radians

  // Convert OKLCH to OKLab
  const a = c * Math.cos(h);
  const bLab = c * Math.sin(h);

  // Convert OKLab to linear RGB
  // OKLab to linear sRGB matrix (inverse of sRGB to OKLab)
  const l_ = l + 0.3963377774 * a + 0.2158037573 * bLab;
  const m_ = l - 0.1055613458 * a - 0.0638541728 * bLab;
  const s_ = l - 0.0894841775 * a - 1.291485548 * bLab;

  const l3 = l_ * l_ * l_;
  const m3 = m_ * m_ * m_;
  const s3 = s_ * s_ * s_;

  const r_ = 4.0767416621 * l3 - 3.3077115913 * m3 + 0.2309699292 * s3;
  const g_ = -1.2684380046 * l3 + 2.6097574011 * m3 - 0.3413193965 * s3;
  const b_ = -0.0041960863 * l3 - 0.7034186147 * m3 + 1.707614701 * s3;

  // Convert linear RGB to sRGB (gamma correction)
  const gamma = (c: number) => {
    if (c <= 0.0031308) {
      return 12.92 * c;
    }
    return 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
  };

  const r = Math.max(0, Math.min(1, gamma(r_)));
  const g = Math.max(0, Math.min(1, gamma(g_)));
  const b = Math.max(0, Math.min(1, gamma(b_)));

  // Convert to 0-255 range and then to hex
  const toHex = (n: number) => {
    const hex = Math.round(n * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}
