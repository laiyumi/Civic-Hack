import { useState } from 'react';

type ColorMode = 'RGB' | 'HSL';

interface ColorSliderProps {
  values: {
    red: number;
    green: number;
    blue: number;
  };
  hslValues: {
    hue: number;
    saturation: number;
    lightness: number;
  };
  onChange?: (type: 'red' | 'green' | 'blue', value: number) => void;
  onHslChange?: (type: 'hue' | 'saturation' | 'lightness', value: number) => void;
}

export function ColorSliders({ values, hslValues, onChange, onHslChange, accessibleColor }: ColorSliderProps & { accessibleColor: string }) {
  const [mode, setMode] = useState<ColorMode>('RGB');

  const rgbSliders = [
    { label: 'Red', value: values.red, max: 255 },
    { label: 'Green', value: values.green, max: 255 },
    { label: 'Blue', value: values.blue, max: 255 },
  ];

  const hslSliders = [
    { label: 'Hue', value: hslValues.hue, max: 360, unit: '°' },
    { label: 'Saturation', value: hslValues.saturation, max: 1, step: 0.01 },
    { label: 'Lightness', value: hslValues.lightness, max: 1, step: 0.01 },
  ];

  return (
    <div className="space-y-4" style={{ color: accessibleColor }}>
      <style jsx>{`
        input[type='range'] {
          width: 100%;
          -webkit-appearance: none;
          background: transparent;
        }

        input[type='range']::-webkit-slider-runnable-track {
          width: 100%;
          height: 4px;
          background: currentColor;
          border-radius: 9999px;
        }

        input[type='range']::-webkit-slider-thumb {
          -webkit-appearance: none;
          height: 18px;
          width: 18px;
          border-radius: 50%;
          background: currentColor;
          margin-top: -7px;
          cursor: pointer;
        }

        input[type='range']::-moz-range-track {
          width: 100%;
          height: 4px;
          background: currentColor;
          border-radius: 9999px;
        }

        input[type='range']::-moz-range-thumb {
          height: 18px;
          width: 18px;
          border: none;
          border-radius: 50%;
          background: currentColor;
          cursor: pointer;
        }
      `}</style>

      <div className="flex gap-2 border-b border-current">
        <button 
          className={`px-4 py-2 font-bold ${mode === 'RGB' ? 'border-b-2 border-current' : ''}`}
          onClick={() => setMode('RGB')}
        >
          RGB
        </button>
        <button 
          className={`px-4 py-2 font-bold ${mode === 'HSL' ? 'border-b-2 border-current' : ''}`}
          onClick={() => setMode('HSL')}
        >
          HSL
        </button>
      </div>
      
      <div className="space-y-6">
        {mode === 'RGB' ? (
          rgbSliders.map((slider) => (
            <div key={slider.label} className="space-y-2">
              <div className="flex justify-between font-bold">
                <label>{slider.label}</label>
                <span>{slider.value}</span>
              </div>
              <input
                type="range"
                value={slider.value}
                onChange={(e) => onChange?.(slider.label.toLowerCase() as 'red' | 'green' | 'blue', Number(e.target.value))}
                min="0"
                max={slider.max}
              />
            </div>
          ))
        ) : (
          hslSliders.map((slider) => (
            <div key={slider.label} className="space-y-2">
              <div className="flex justify-between font-bold">
                <label>{slider.label}</label>
                <span>
                  {slider.value.toFixed(2)}
                  {slider.unit || ''}
                </span>
              </div>
              <input
                type="range"
                value={slider.value}
                onChange={(e) => onHslChange?.(slider.label.toLowerCase() as 'hue' | 'saturation' | 'lightness', Number(e.target.value))}
                min="0"
                max={slider.max}
                step={slider.step || 1}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
} 