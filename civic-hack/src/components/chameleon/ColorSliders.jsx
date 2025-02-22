import { useState, useCallback, useEffect } from 'react';
import { rgbToHex, hslToHex, hexToRgb, hexToHsl } from '@/utils/color-utils';
import chroma from 'chroma-js';

const Slider = ({ value, onChange, min, max, step }) => (
  <div className="relative h-2 rounded-full overflow-visible bg-gray-700">
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={onChange}
      className={`
        absolute w-full h-full
        appearance-none bg-transparent
        cursor-pointer

        [&::-webkit-slider-runnable-track]:bg-transparent
        [&::-webkit-slider-runnable-track]:h-2
        
        [&::-webkit-slider-thumb]:appearance-none
        [&::-webkit-slider-thumb]:h-4
        [&::-webkit-slider-thumb]:w-4
        [&::-webkit-slider-thumb]:rounded-full
        [&::-webkit-slider-thumb]:bg-white
        [&::-webkit-slider-thumb]:border-2
        [&::-webkit-slider-thumb]:border-gray-700
        [&::-webkit-slider-thumb]:shadow
        [&::-webkit-slider-thumb]:shadow-black/20
        [&::-webkit-slider-thumb]:cursor-pointer
        [&::-webkit-slider-thumb]:mt-[-4px]
        [&::-webkit-slider-thumb]:hover:bg-gray-100
        [&::-webkit-slider-thumb]:transition-colors

        [&::-moz-range-track]:bg-transparent
        [&::-moz-range-track]:h-2
        
        [&::-moz-range-thumb]:appearance-none
        [&::-moz-range-thumb]:h-4
        [&::-moz-range-thumb]:w-4
        [&::-moz-range-thumb]:rounded-full
        [&::-moz-range-thumb]:bg-white
        [&::-moz-range-thumb]:border-2
        [&::-moz-range-thumb]:border-gray-700
        [&::-moz-range-thumb]:shadow
        [&::-moz-range-thumb]:shadow-black/20
        [&::-moz-range-thumb]:cursor-pointer
        [&::-moz-range-thumb]:hover:bg-gray-100
        [&::-moz-range-thumb]:transition-colors
      `}
    />
  </div>
);

export function ColorSliders({ color, onChange, label }) {
  const [mode, setMode] = useState('RGB');
  const rgb = hexToRgb(color);
  
  const [hslValues, setHslValues] = useState(() => hexToHsl(color));

  useEffect(() => {
    const newHsl = hexToHsl(color);
    if (Math.abs(newHsl.h - hslValues.h) > 1 ||
        Math.abs(newHsl.s - hslValues.s) > 0.01 ||
        Math.abs(newHsl.l - hslValues.l) > 0.01) {
      setHslValues(newHsl);
    }
  }, [color]);

  const handleRgbChange = (value, channel) => {
    const newRgb = { ...rgb };
    newRgb[channel] = parseInt(value, 10);
    try {
      const newColor = chroma.rgb(newRgb.r, newRgb.g, newRgb.b);
      onChange(newColor.hex());
    } catch (e) {
      console.error('Invalid RGB values:', newRgb);
    }
  };

  const handleHslChange = useCallback((value, channel) => {
    const newHsl = { ...hslValues };

    switch (channel) {
      case 'h':
        newHsl.h = ((parseFloat(value) % 360) + 360) % 360;
        break;
      case 's':
        newHsl.s = Math.max(0, Math.min(1, parseFloat(value) / 100));
        break;
      case 'l':
        newHsl.l = Math.max(0, Math.min(1, parseFloat(value) / 100));
        break;
    }

    setHslValues(newHsl);

    try {
      const h = isNaN(newHsl.h) ? 0 : newHsl.h;
      const s = isNaN(newHsl.s) ? 0 : newHsl.s;
      const l = isNaN(newHsl.l) ? 0 : newHsl.l;
      
      const newColor = chroma.hsl(h, s, l);
      onChange(newColor.hex());
    } catch (e) {
      console.error('Invalid HSL values:', newHsl);
    }
  }, [onChange]);

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-4">
      <div className="flex flex-col gap-3 mb-4">
        <h3 className="text-lg font-semibold text-white">{label}</h3>
        <div className="flex gap-1 p-1 bg-gray-800/50 rounded-lg self-start">
          <button
            onClick={() => setMode('RGB')}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-300
              ${mode === 'RGB' 
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25' 
                : 'text-gray-400 hover:text-white'}`}
          >
            RGB
          </button>
          <button
            onClick={() => setMode('HSL')}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-300
              ${mode === 'HSL' 
                ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-500/25' 
                : 'text-gray-400 hover:text-white'}`}
          >
            HSL
          </button>
        </div>
      </div>
      
      {mode === 'RGB' ? (
        <div className="space-y-4">
          {['r', 'g', 'b'].map((channel) => (
            <div key={channel} className="space-y-1">
              <div className="flex justify-between">
                <label className="text-sm font-medium capitalize">
                  {channel === 'r' ? 'Red' : channel === 'g' ? 'Green' : 'Blue'}
                </label>
                <span className="text-sm text-gray-400">{rgb[channel]}</span>
              </div>
              <Slider
                value={rgb[channel]}
                onChange={(e) => handleRgbChange(e.target.value, channel)}
                min="0"
                max="255"
                step="1"
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="space-y-1">
            <div className="flex justify-between">
              <label className="text-sm font-medium">Hue</label>
              <span className="text-sm text-gray-400">{Math.round(hslValues.h)}°</span>
            </div>
            <Slider
              value={hslValues.h}
              onChange={(e) => handleHslChange(e.target.value, 'h')}
              min="0"
              max="360"
              step="0.01"
            />
          </div>
          {['s', 'l'].map((channel) => (
            <div key={channel} className="space-y-1">
              <div className="flex justify-between">
                <label className="text-sm font-medium">
                  {channel === 's' ? 'Saturation' : 'Lightness'}
                </label>
                <span className="text-sm text-gray-400">
                  {Math.round(hslValues[channel] * 100)}%
                </span>
              </div>
              <Slider
                value={hslValues[channel] * 100}
                onChange={(e) => handleHslChange(e.target.value, channel)}
                min="0"
                max="100"
                step="0.01"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 