import chroma from 'chroma-js';
import type { TLevels } from '../types/color-types';

export const isHex = (hex: string): boolean => {
	try {
		const color = chroma(hex);
		return !!color;
	} catch (err) {
		return false;
	}
};

export const isHsl = (hsl: number[]): boolean => {
	try {
		const color = chroma.hsl(hsl[0], hsl[1], hsl[2]);
		return !!color;
	} catch (e) {
		return false;
	}
};

export const isRgb = (rgb: number[]): boolean => {
	try {
		const color = chroma.rgb(rgb[0], rgb[1], rgb[2]);
		return !!color;
	} catch (e) {
		return false;
	}
};

export const isDark = (hsl: number[]): boolean => {
	return chroma.hsl(hsl[0], hsl[1], hsl[2]).get('lab.l') < 60;
};

export const colorToHsl = (hex: string): [number, number, number] => {
	return chroma(hex).hsl();
};

export const hslToHex = (hsl: number[]): string => {
	return chroma.hsl(hsl[0], hsl[1], hsl[2]).hex();
};

export const hslToRgb = (hsl: number[]): [number, number, number] => {
	return chroma.hsl(hsl[0], hsl[1], hsl[2]).rgb();
};

export function rgbToHsl([r, g, b]: [number, number, number]): [number, number, number] {
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
				h = (g - b) / d + (g < b ? 6 : 0);
				break;
			case g:
				h = (b - r) / d + 2;
				break;
			case b:
				h = (r - g) / d + 4;
				break;
		}

		h /= 6;
	}

	return [
		Math.round(h * 360),
		parseFloat(s.toFixed(2)),
		parseFloat(l.toFixed(2))
	];
}

export const rgbToHex = (rgb: number[]): string => {
	return chroma.rgb(rgb[0], rgb[1], rgb[2]).hex();
};

export const getContrast = (bg: string, fg: string): number => {
	return chroma.contrast(bg, fg);
};

export const getColorValue = (
	path: string | null,
	fallback: string,
): [number, number, number] => {
	const isPathAndHex = path && isHex(path);
	const value = colorToHsl(isPathAndHex ? path : fallback);

	return value;
};

export const getLevel = (contrast: number): TLevels => {
	if (contrast > 7) {
		return { AALarge: 'Pass', AA: 'Pass', AAALarge: 'Pass', AAA: 'Pass' };
	} else if (contrast > 4.5) {
		return { AALarge: 'Pass', AA: 'Pass', AAALarge: 'Pass', AAA: 'Fail' };
	} else if (contrast > 3) {
		return { AALarge: 'Pass', AA: 'Fail', AAALarge: 'Fail', AAA: 'Fail' };
	}

	return { AALarge: 'Fail', AA: 'Fail', AAALarge: 'Fail', AAA: 'Fail' };
};

export const setContrast = (
	bg: [number, number, number],
	fg: [number, number, number],
	fallback: number,
): number => {
	const isBgHsl = isHsl(bg);
	const isFgHsl = isHsl(fg);

	if (!isBgHsl || !isFgHsl) return fallback;

	const bgHex = hslToHex(bg);
	const fgHex = hslToHex(fg);

	return getContrast(bgHex, fgHex);
};
