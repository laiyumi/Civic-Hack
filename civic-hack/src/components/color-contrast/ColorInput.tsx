import { useState } from 'react';
import { isHex } from '@/utils/color-utils';

interface ColorInputProps {
  label: string;
  value: string;
  onChange?: (value: string) => void;
  onValidHex?: (hex: string) => void;
  accessibleColor: string;
}

export function ColorInput({ label, value, onChange, onValidHex, accessibleColor }: ColorInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange?.(newValue);

    // 确保输入以#开头并且是有效的十六进制颜色
    if (newValue.startsWith('#') && isHex(newValue)) {
      onValidHex?.(newValue);
    }
  };

  // 添加输入验证状态的视觉反馈
  const isValidHex = value.startsWith('#') && isHex(value);

  return (
    <div className="space-y-2" style={{ color: accessibleColor }}>
      <label className="text-xl font-bold">{label}</label>
      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={handleChange}
          className={`w-full px-4 py-2 bg-transparent rounded-lg border text-2xl font-bold ${
            value && !isValidHex ? 'border-red-500' : 'border-current'
          }`}
          placeholder="#000000"
        />
        <button 
          onClick={() => navigator.clipboard.writeText(value)}
          className="p-2 border border-current rounded-lg hover:bg-black/5 transition-colors"
          title="Copy color value"
          disabled={!isValidHex}
        >
          <CopyIcon className={`w-6 h-6 ${!isValidHex ? 'opacity-50' : ''}`} />
        </button>
      </div>
      {value && !isValidHex && (
        <p className="text-sm text-red-500">
          Please enter a valid hex color (e.g., #FF0000)
        </p>
      )}
    </div>
  );
}

function CopyIcon({ className }: { className?: string }) {
  return (
    <svg 
      className={className} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth={2}
    >
      <path d="M8 4v12a2 2 0 002 2h8a2 2 0 002-2V7.242a2 2 0 00-.602-1.43L16.083 2.57A2 2 0 0014.685 2H10a2 2 0 00-2 2z" />
      <path d="M16 18v2a2 2 0 01-2 2H6a2 2 0 01-2-2V9a2 2 0 012-2h2" />
    </svg>
  );
} 