import { getContrast, getLevel } from '@/utils/color-utils';

export function ContrastBadge({ bgColor, fgColor }) {
  const contrast = getContrast(bgColor, fgColor);
  const levels = getLevel(contrast);
  const isGoodContrast = parseFloat(contrast) >= 4.5;

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">WCAG Contrast Check</h3>
        <div className="flex items-baseline gap-2">
          <span className="text-sm text-gray-400">Ratio</span>
          <span className={`text-2xl font-bold transition-colors duration-300 ${
            isGoodContrast ? 'text-green-400' : 'text-yellow-400'
          }`}>{contrast}</span>
        </div>
      </div>
      
      <div className="grid grid-cols-4 gap-3">
        {Object.entries(levels).map(([level, status]) => (
          <div 
            key={level} 
            className={`group relative flex flex-col items-center p-3 rounded-lg transition-all duration-300
              ${status === 'Pass' 
                ? 'bg-green-500/5 hover:bg-green-500/10' 
                : 'bg-red-500/5 hover:bg-red-500/10'}`}
          >
            <div className={`
              w-10 h-10 rounded-lg flex items-center justify-center mb-2 transition-all duration-300
              ${status === 'Pass' 
                ? 'bg-green-500/10 text-green-400 group-hover:bg-green-500/20' 
                : 'bg-red-500/10 text-red-400 group-hover:bg-red-500/20'}
            `}>
              {status === 'Pass' ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </div>
            <span className="text-sm font-medium text-gray-400 whitespace-nowrap">{level}</span>
          </div>
        ))}
      </div>
    </div>
  );
} 