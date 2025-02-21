import { isHex } from '@/utils/color-utils';

interface ColorInputProps {
  label: string;
  value: string;
  onChange?: (value: string) => void;
  onValidHex?: (hex: string) => void;
  accessibleColor: string;
  onSwitch?: () => void;
}

export function ColorInput({ label, value, onChange, onValidHex, accessibleColor, onSwitch }: ColorInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange?.(newValue);

    if (newValue.startsWith('#') && isHex(newValue)) {
      onValidHex?.(newValue);
    }
  };

  const isValidHex = value.startsWith('#') && isHex(value);

  return (
    <div className="space-y-2" style={{ color: accessibleColor }}>
      <label 
        className="text-xl"
        style={{ fontSize: '1.75rem' }}
      >
        {label}
      </label>
      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={handleChange}
          className="w-full px-4 py-2 bg-transparent rounded-lg border-2 border-current text-2xl font-bold"
          placeholder="#000000"
        />
        <button 
          onClick={() => navigator.clipboard.writeText(value)}
          className="p-2 border-2 border-current rounded-lg hover:bg-black/5 transition-colors"
          title="Copy color value"
          disabled={!isValidHex}
        >
          <CopyIcon className={`w-6 h-6 ${!isValidHex ? 'opacity-50' : ''}`} />
        </button>
      </div>
      {label === "Background Color" && (
        <div className="flex items-center -mt-1 mb-2">
          <button
            onClick={onSwitch}
            className="text-lg hover:bg-black/5 rounded-md transition-colors px-3 py-1"
            style={{ color: accessibleColor }}
          >
            Switch Colors
          </button>
        </div>
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

function SwitchIcon({ className }: { className?: string }) {
  return (
    <svg 
      className={className} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth={2}
    >
      <path d="M7 16V4m0 0L3 8m4-4l4 4" />
      <path d="M17 8v12m0 0l4-4m-4 4l-4-4" />
    </svg>
  );
} 