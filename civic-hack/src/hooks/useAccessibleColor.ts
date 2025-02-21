import { getContrast, getLevel } from '@/utils/color-utils';

export function useAccessibleColor(backgroundColor: string, foregroundColor: string) {
  const contrast = getContrast(backgroundColor, foregroundColor);
  const levels = getLevel(contrast);
  
  // 如果 AA Large 通过，使用前景色，否则根据背景色选择黑或白
  const getAccessibleColor = () => {
    if (levels.AALarge === 'Pass') {
      return foregroundColor;
    }
    
    // 计算背景色的亮度（简单方法）
    const r = parseInt(backgroundColor.slice(1, 3), 16);
    const g = parseInt(backgroundColor.slice(3, 5), 16);
    const b = parseInt(backgroundColor.slice(5, 7), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    
    // 亮度大于 128 使用黑色，否则使用白色
    return brightness > 128 ? '#000000' : '#ffffff';
  };

  return {
    accessibleColor: getAccessibleColor(),
    isAALargePassing: levels.AALarge === 'Pass'
  };
} 