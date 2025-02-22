import chroma from 'chroma-js';

export const isHex = (hex) => {
	try {
		const color = chroma(hex);
		return !!color;
	} catch (err) {
		return false;
	}
};

export const isHsl = (hsl) => {
	try {
		const color = chroma.hsl(hsl[0], hsl[1], hsl[2]);
		return !!color;
	} catch (e) {
		return false;
	}
};

export const isRgb = (rgb) => {
	try {
		const color = chroma.rgb(rgb[0], rgb[1], rgb[2]);
		return !!color;
	} catch (e) {
		return false;
	}
};

export const isDark = (hsl) => {
	return chroma.hsl(hsl[0], hsl[1], hsl[2]).get('lab.l') < 60;
};

export const colorToHsl = (hex) => {
	return chroma(hex).hsl();
};

export const hslToHex = ([h, s, l]) => {
	try {
		return chroma.hsl(h || 0, s || 0, l || 0).hex();
	} catch (e) {
		return '#000000';
	}
};

export const hslToRgb = (hsl) => {
	return chroma.hsl(hsl[0], hsl[1], hsl[2]).rgb();
};

export function rgbToHsl([r, g, b]) {
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

export const rgbToHex = ([r, g, b]) => {
	try {
		return chroma.rgb(r, g, b).hex();
	} catch (e) {
		return '#000000';
	}
};

export const getContrast = (color1, color2) => {
	return chroma.contrast(color1, color2).toFixed(2);
};

export const getColorValue = (path, fallback) => {
	const isPathAndHex = path && isHex(path);
	return colorToHsl(isPathAndHex ? path : fallback);
};

export const getLevel = (contrast) => {
	const levels = {
		AALarge: contrast >= 3 ? 'Pass' : 'Fail',
		AA: contrast >= 4.5 ? 'Pass' : 'Fail',
		AAALarge: contrast >= 4.5 ? 'Pass' : 'Fail',
		AAA: contrast >= 7 ? 'Pass' : 'Fail'
	};
	return levels;
};

export const setContrast = (bg, fg, fallback) => {
	if (!isHsl(bg) || !isHsl(fg)) return fallback;

	const bgHex = hslToHex(bg);
	const fgHex = hslToHex(fg);

	return getContrast(bgHex, fgHex);
};

export const hexToRgb = (hex) => {
	const rgb = chroma(hex).rgb();
	return {
		r: rgb[0],
		g: rgb[1],
		b: rgb[2]
	};
};

export const hexToHsl = (hex) => {
	try {
		const color = chroma(hex);
		const [h, s, l] = color.hsl();
		return {
			h: isNaN(h) ? 0 : ((Math.round(h) % 360) + 360) % 360,
			s: isNaN(s) ? 0 : Math.max(0, Math.min(1, s)),
			l: isNaN(l) ? 0 : Math.max(0, Math.min(1, l))
		};
	} catch (e) {
		return { h: 0, s: 0, l: 0 };
	}
};