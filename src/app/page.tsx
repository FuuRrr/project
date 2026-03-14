'use client';

import { useState } from 'react';
import ColorPicker from '@/components/ColorPicker';

export default function Home() {
  const [gradient, setGradient] = useState({
    primary: '#3b82f6',
    secondary: '#f59e0b',
  });
  const [height, setHeight] = useState(400);
  const [copied, setCopied] = useState(false);

  const handleColorsChange = (primary: string, secondary: string) => {
    setGradient({ primary, secondary });
  };

  const generateCSS = () => {
    return `background: linear-gradient(135deg, ${gradient.primary} 0%, ${gradient.secondary} 100%);`;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generateCSS());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            渐变背景生成器
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            使用色轮选择颜色，支持自由选择和智能推荐模式。
            基于色彩理论算法，为您推荐最佳配色方案。
          </p>
        </header>

        {/* Color Picker */}
        <section className="mb-10">
          <ColorPicker onColorsChange={handleColorsChange} />
        </section>

        {/* Preview Section */}
        <section className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">效果预览</h2>
            <div className="flex items-center gap-4">
              <label className="text-sm text-gray-600">高度:</label>
              <input
                type="range"
                min="100"
                max="800"
                value={height}
                onChange={(e) => setHeight(Number(e.target.value))}
                className="w-32"
              />
              <span className="text-sm text-gray-600 w-16">{height}px</span>
            </div>
          </div>
          
          <div
            className="w-full rounded-xl shadow-inner transition-all duration-300"
            style={{
              height: `${height}px`,
              background: `linear-gradient(135deg, ${gradient.primary} 0%, ${gradient.secondary} 100%)`,
            }}
          />
        </section>

        {/* CSS Code */}
        <section className="bg-white rounded-2xl shadow-xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">CSS 代码</h2>
            <button
              onClick={copyToClipboard}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                copied
                  ? 'bg-green-500 text-white'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              {copied ? '已复制!' : '复制代码'}
            </button>
          </div>
          
          <div className="bg-gray-900 rounded-xl p-4 overflow-x-auto">
            <code className="text-green-400 font-mono text-sm">
              {generateCSS()}
            </code>
          </div>

          {/* API Usage */}
          <div className="mt-6 pt-6 border-t">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">API 调用</h3>
            <div className="bg-gray-900 rounded-xl p-4 overflow-x-auto">
              <code className="text-blue-400 font-mono text-sm">
                GET /api/gradient?from={gradient.primary.replace('#', '')}&to={gradient.secondary.replace('#', '')}&height={height}
              </code>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">自由选择模式</h3>
            <p className="text-gray-600 text-sm">
              在色轮上自由拖动选择两种颜色，完全掌控您的配色方案。
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">智能推荐模式</h3>
            <p className="text-gray-600 text-sm">
              基于色彩理论，系统为您推荐最佳配色方案，包括互补色、类似色等。
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">一键复制</h3>
            <p className="text-gray-600 text-sm">
              生成 CSS 代码和 API 链接，轻松应用到您的项目中。
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-16 text-center text-gray-500 text-sm">
          <p>基于色彩理论构建 • 支持 6 种色彩和谐方案</p>
        </footer>
      </div>
    </main>
  );
}
