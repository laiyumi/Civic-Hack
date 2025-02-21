import { getContrast, getLevel, isHex } from '@/utils/color-utils';
import type { TLevels } from '@/types/color-types';
import { useAccessibleColor } from '@/hooks/useAccessibleColor';

function CheckIcon() {
  return (
    <svg 
      className="w-4 h-4 ml-1 inline-block" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth={2.5} 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function CrossIcon() {
  return (
    <svg 
      className="w-4 h-4 ml-1 inline-block" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth={2.5} 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

interface ContrastDisplayProps {
  foregroundColor: string;
  backgroundColor: string;
}

export function ContrastDisplay({ foregroundColor, backgroundColor }: ContrastDisplayProps) {
  const { accessibleColor, isAALargePassing } = useAccessibleColor(backgroundColor, foregroundColor);
  const isValidColors = isHex(foregroundColor) && isHex(backgroundColor);
  const contrast = isValidColors ? getContrast(backgroundColor, foregroundColor) : 0;
  const levels = isValidColors ? getLevel(contrast) : {
    AALarge: 'Fail',
    AAALarge: 'Fail',
    AA: 'Fail',
    AAA: 'Fail'
  };

  const borderColor = foregroundColor.replace(')', ', 0.1)').replace('rgb', 'rgba');

  const levelItems: { label: keyof TLevels; text: string }[] = [
    { label: 'AALarge', text: 'AA Large' },
    { label: 'AAALarge', text: 'AAA Large' },
    { label: 'AA', text: 'AA Normal' },
    { label: 'AAA', text: 'AAA Normal' }
  ];

  return (
    <div className="flex items-end gap-8" style={{ color: accessibleColor }}>
      <div className="relative flex items-end justify-center w-64 h-64 pb-12">
        <div 
          className="absolute inset-0 rounded-lg"
          style={{ 
            border: `4px solid ${foregroundColor}` 
          }}
        />
        <span 
          className="relative font-bold"
          style={{ 
            color: foregroundColor,
            fontSize: '7rem',
            lineHeight: '1'
          }}
        >
          Aa
        </span>
      </div>
      
      <div className="text-4xl font-bold">
        {isValidColors ? contrast.toFixed(2) : '---'}
      </div>

      <div className="flex gap-4 ml-auto">
        {levelItems.map(({ label, text }) => (
          <div key={label} className="flex flex-col items-center">
            <div 
              className="px-4 py-2 rounded-md flex items-center"
              style={{ 
                backgroundColor: isAALargePassing 
                  ? (levels[label] === 'Pass' ? foregroundColor : accessibleColor)
                  : (accessibleColor === '#000000' ? 'black' : 'white'),
                color: isAALargePassing 
                  ? backgroundColor
                  : (accessibleColor === '#000000' ? 'white' : 'black')
              }}
            >
              <span>{levels[label]}</span>
              {levels[label] === 'Pass' ? <CheckIcon /> : <CrossIcon />}
            </div>
            <span className="mt-2 text-sm">{text}</span>
          </div>
        ))}
      </div>
    </div>
  );
} 