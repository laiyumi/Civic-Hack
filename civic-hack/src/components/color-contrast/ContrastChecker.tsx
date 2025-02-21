'use client';

import { useState, useEffect } from 'react';
import { ContrastDisplay } from './ContrastDisplay';
import { ColorInput } from './ColorInput';
import { ColorSliders } from './ColorSliders';
import { rgbToHex, hslToHex, isHex } from '@/utils/color-utils';
import { useAccessibleColor } from '@/hooks/useAccessibleColor';

export default function ContrastChecker() {
  // 存储实际应用的颜色值
  const [bgColor, setBgColor] = useState('#ffe66d');
  const [fgColor, setFgColor] = useState('#222222');
  // 存储输入框的值
  const [bgInput, setBgInput] = useState('#ffe66d');
  const [fgInput, setFgInput] = useState('#222222');
  
  const [bgRgb, setBgRgb] = useState({ red: 255, green: 230, blue: 109 });
  const [fgRgb, setFgRgb] = useState({ red: 34, green: 34, blue: 34 });
  const [bgHsl, setBgHsl] = useState({ hue: 50, saturation: 1, lightness: 0.71 });
  const [fgHsl, setFgHsl] = useState({ hue: 0, saturation: 0, lightness: 0.13 });

  const { accessibleColor } = useAccessibleColor(bgColor, fgColor);

  useEffect(() => {
    // 应用背景色到页面
    document.body.style.backgroundColor = bgColor;
    
    // 组件卸载时恢复默认背景色
    return () => {
      document.body.style.backgroundColor = '';
    };
  }, [bgColor]);

  const handleBgInputChange = (value: string) => {
    setBgInput(value);
    if (isHex(value)) {
      setBgColor(value);
      document.body.style.backgroundColor = value;
    }
  };

  const handleFgInputChange = (value: string) => {
    setFgInput(value);
    if (isHex(value)) {
      setFgColor(value);
    }
  };

  const handleBgRgbChange = (type: 'red' | 'green' | 'blue', value: number) => {
    const newRgb = { ...bgRgb, [type]: value };
    setBgRgb(newRgb);
    const newHex = rgbToHex([newRgb.red, newRgb.green, newRgb.blue]);
    setBgInput(newHex);
    setBgColor(newHex);
    document.body.style.backgroundColor = newHex;
  };

  const handleFgRgbChange = (type: 'red' | 'green' | 'blue', value: number) => {
    const newRgb = { ...fgRgb, [type]: value };
    setFgRgb(newRgb);
    const newHex = rgbToHex([newRgb.red, newRgb.green, newRgb.blue]);
    setFgInput(newHex);
    setFgColor(newHex);
  };

  const handleBgHslChange = (type: 'hue' | 'saturation' | 'lightness', value: number) => {
    const newHsl = { ...bgHsl, [type]: value };
    setBgHsl(newHsl);
    const newHex = hslToHex([newHsl.hue, newHsl.saturation, newHsl.lightness]);
    setBgInput(newHex);
    setBgColor(newHex);
    document.body.style.backgroundColor = newHex;
  };

  const handleFgHslChange = (type: 'hue' | 'saturation' | 'lightness', value: number) => {
    const newHsl = { ...fgHsl, [type]: value };
    setFgHsl(newHsl);
    const newHex = hslToHex([newHsl.hue, newHsl.saturation, newHsl.lightness]);
    setFgInput(newHex);
    setFgColor(newHex);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8" style={{ color: accessibleColor }}>
      <h1 className="text-4xl font-bold mb-8">Color Contrast</h1>
      <ContrastDisplay 
        foregroundColor={fgColor} 
        backgroundColor={bgColor}
      />
      
      <div className="grid grid-cols-2 gap-8">
        <ColorInput 
          label="Background Color"
          value={bgInput}
          onChange={handleBgInputChange}
          onValidHex={handleBgInputChange}
          accessibleColor={accessibleColor}
        />
        <ColorInput 
          label="Foreground Color"
          value={fgInput}
          onChange={handleFgInputChange}
          onValidHex={handleFgInputChange}
          accessibleColor={accessibleColor}
        />
      </div>

      <div className="grid grid-cols-2 gap-8">
        <ColorSliders 
          values={bgRgb}
          hslValues={bgHsl}
          onChange={handleBgRgbChange}
          onHslChange={handleBgHslChange}
          accessibleColor={accessibleColor}
        />
        <ColorSliders 
          values={fgRgb}
          hslValues={fgHsl}
          onChange={handleFgRgbChange}
          onHslChange={handleFgHslChange}
          accessibleColor={accessibleColor}
        />
      </div>
    </div>
  );
} 