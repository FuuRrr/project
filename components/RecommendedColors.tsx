'use client';

import { getRecommendedColors } from '../lib/colorUtils';

interface RecommendedColorsProps {
  baseColor: string;
  onSelect: (color: string) => void;
}

export default function RecommendedColors({ baseColor, onSelect }: RecommendedColorsProps) {
  const colors = getRecommendedColors(baseColor);

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">推荐配色方案</h3>
      <div className="grid grid-cols-3 gap-3">
        {colors.map((color, index) => (
          <button
            key={index}
            onClick={() => onSelect(color)}
            className="group relative overflow-hidden rounded-xl p-2 transition-all hover:scale-105 hover:shadow-lg"
            style={{ backgroundColor: color }}
          >
            <div className="h-16 rounded-lg" style={{ backgroundColor: color }} />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 rounded-xl">
              <span className="text-white text-sm font-medium bg-black/50 px-2 py-1 rounded">
                选择
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
