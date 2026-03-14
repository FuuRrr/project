'use client';

interface GradientPreviewProps {
  color1: string;
  color2: string;
  height: number;
  angle: number;
}

export default function GradientPreview({ color1, color2, height, angle }: GradientPreviewProps) {
  const gradientStyle = {
    background: `linear-gradient(${angle}deg, ${color1}, ${color2})`,
    height: `${height}px`,
  };

  const cssCode = `background: linear-gradient(${angle}deg, ${color1}, ${color2});
height: ${height}px;`;

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">渐变预览</h3>
      <div
        className="w-full rounded-2xl shadow-2xl transition-all duration-300"
        style={gradientStyle}
      />
      <div className="mt-4">
        <div className="flex justify-between items-center mb-2">
          <h4 className="text-sm font-medium text-gray-600">CSS 代码</h4>
          <button
            onClick={() => {
              navigator.clipboard.writeText(cssCode);
            }}
            className="text-xs bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 transition-colors"
          >
            复制
          </button>
        </div>
        <pre className="bg-gray-900 text-green-400 p-4 rounded-xl text-sm overflow-x-auto">
          {cssCode}
        </pre>
      </div>
    </div>
  );
}
