'use client';

import { useState } from 'react';
import ColorWheel from '../components/ColorWheel';
import RecommendedColors from '../components/RecommendedColors';
import GradientPreview from '../components/GradientPreview';
import { getRandomColor, getComplementaryColor } from '../lib/colorUtils';

const presets = [
  { name: '日落', color1: '#FF6B6B', color2: '#FFE66D' },
  { name: '海洋', color1: '#4ECDC4', color2: '#556270' },
  { name: '森林', color1: '#11998E', color2: '#38EF7D' },
  { name: '星空', color1: '#2C3E50', color2: '#4CA1AF' },
  { name: '玫瑰', color1: '#FF512F', color2: '#DD2476' },
  { name: '极光', color1: '#8E2DE2', color2: '#4A00E0' },
];

export default function Home() {
  const [color1, setColor1] = useState('#FF6B6B');
  const [color2, setColor2] = useState('#4ECDC4');
  const [mode, setMode] = useState<'free' | 'recommend'>('free');
  const [activeColor, setActiveColor] = useState<1 | 2>(1);
  const [height, setHeight] = useState(400);
  const [angle, setAngle] = useState(135);

  const handleColorChange = (newColor1: string, newColor2: string) => {
    setColor1(newColor1);
    setColor2(newColor2);
  };

  const handleRandom = () => {
    const randomColor1 = getRandomColor();
    if (mode === 'recommend') {
      const randomColor2 = getComplementaryColor(randomColor1);
      setColor1(randomColor1);
      setColor2(randomColor2);
    } else {
      const randomColor2 = getRandomColor();
      setColor1(randomColor1);
      setColor2(randomColor2);
    }
  };

  const handlePresetSelect = (preset: typeof presets[0]) => {
    setColor1(preset.color1);
    setColor2(preset.color2);
  };

  const handleRecommendedSelect = (color: string) => {
    if (activeColor === 1) {
      setColor1(color);
      if (mode === 'recommend') {
        setColor2(getComplementaryColor(color));
      }
    } else {
      setColor2(color);
      if (mode === 'recommend') {
        setColor1(getComplementaryColor(color));
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-3">渐变背景生成器</h1>
          <p className="text-gray-600 text-lg">使用色轮和智能配色创建精美的渐变背景</p>
        </header>

        <div className="bg-white rounded-3xl shadow-xl p-8 mb-6">
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex gap-4 bg-gray-100 p-2 rounded-xl">
                <button
                  onClick={() => setMode('free')}
                  className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                    mode === 'free'
                      ? 'bg-white text-blue-600 shadow-md'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  自由选择模式
                </button>
                <button
                  onClick={() => setMode('recommend')}
                  className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                    mode === 'recommend'
                      ? 'bg-white text-blue-600 shadow-md'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  推荐选择模式
                </button>
              </div>

              <div className="flex justify-center">
                <ColorWheel
                  color1={color1}
                  color2={color2}
                  onChange={handleColorChange}
                  mode={mode}
                  activeColor={activeColor}
                  onActiveColorChange={setActiveColor}
                />
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleRandom}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-6 rounded-xl font-medium hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl"
                >
                  🎲 随机生成
                </button>
              </div>

              {mode === 'recommend' && (
                <RecommendedColors
                  baseColor={activeColor === 1 ? color1 : color2}
                  onSelect={handleRecommendedSelect}
                />
              )}
            </div>

            <div className="space-y-6">
              <GradientPreview
                color1={color1}
                color2={color2}
                height={height}
                angle={angle}
              />

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    渐变角度: {angle}°
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="360"
                    value={angle}
                    onChange={(e) => setAngle(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    预览高度: {height}px
                  </label>
                  <input
                    type="range"
                    min="100"
                    max="800"
                    value={height}
                    onChange={(e) => setHeight(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">预设方案</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {presets.map((preset, index) => (
                      <button
                        key={index}
                        onClick={() => handlePresetSelect(preset)}
                        className="group relative overflow-hidden rounded-xl p-2 hover:shadow-lg transition-all"
                      >
                        <div
                          className="h-12 rounded-lg"
                          style={{
                            background: `linear-gradient(135deg, ${preset.color1}, ${preset.color2})`,
                          }}
                        />
                        <span className="text-xs text-gray-600 mt-1 block">{preset.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <footer className="text-center text-gray-500 text-sm">
          <p>基于色相轮的智能配色算法 | Next.js + React + Tailwind CSS</p>
        </footer>
      </div>
    </div>
  );
}
