'use client';

import React, { useState } from 'react';
import ColorWheel from './ColorWheel';
import { SelectionMode, ColorHarmony } from '@/types/color';
import { recommendBestColorPair, getAllColorHarmonies, hexToHsl, hslToHex } from '@/utils/colorUtils';

interface ColorPickerProps {
  onColorsChange?: (primary: string, secondary: string) => void;
}

export default function ColorPicker({ onColorsChange }: ColorPickerProps) {
  const [mode, setMode] = useState<SelectionMode>('free');
  const [primaryColor, setPrimaryColor] = useState('#3b82f6');
  const [secondaryColor, setSecondaryColor] = useState('#f59e0b');
  const [recommendedColor, setRecommendedColor] = useState<string>('');
  const [harmonies, setHarmonies] = useState<ColorHarmony[]>([]);
  const [showHarmonies, setShowHarmonies] = useState(false);

  const handlePrimaryChange = (color: string) => {
    setPrimaryColor(color);
    
    if (mode === 'recommend') {
      // 推荐模式下，自动计算推荐颜色
      const recommendation = recommendBestColorPair(color);
      setRecommendedColor(recommendation.secondary);
      setHarmonies(getAllColorHarmonies(color));
      
      if (onColorsChange) {
        onColorsChange(color, recommendation.secondary);
      }
    } else {
      if (onColorsChange) {
        onColorsChange(color, secondaryColor);
      }
    }
  };

  const handleSecondaryChange = (color: string) => {
    setSecondaryColor(color);
    if (onColorsChange && mode === 'free') {
      onColorsChange(primaryColor, color);
    }
  };

  const handleModeChange = (newMode: SelectionMode) => {
    setMode(newMode);
    
    if (newMode === 'recommend') {
      // 切换到推荐模式时，立即计算推荐
      const recommendation = recommendBestColorPair(primaryColor);
      setRecommendedColor(recommendation.secondary);
      setHarmonies(getAllColorHarmonies(primaryColor));
      setShowHarmonies(true);
      
      if (onColorsChange) {
        onColorsChange(primaryColor, recommendation.secondary);
      }
    } else {
      setShowHarmonies(false);
      if (onColorsChange) {
        onColorsChange(primaryColor, secondaryColor);
      }
    }
  };

  const handleApplyHarmony = (color: string) => {
    if (mode === 'free') {
      setSecondaryColor(color);
      if (onColorsChange) {
        onColorsChange(primaryColor, color);
      }
    }
  };

  // 调整亮度
  const adjustLightness = (delta: number) => {
    const hsl = hexToHsl(primaryColor);
    const newLightness = Math.max(10, Math.min(90, hsl.l + delta));
    const newColor = hslToHex(hsl.h, hsl.s, newLightness);
    handlePrimaryChange(newColor);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 max-w-4xl mx-auto">
      {/* 模式切换 */}
      <div className="flex justify-center mb-6">
        <div className="bg-gray-100 p-1 rounded-xl inline-flex">
          <button
            onClick={() => handleModeChange('free')}
            className={`px-6 py-2 rounded-lg font-medium transition-all ${
              mode === 'free'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            自由选择
          </button>
          <button
            onClick={() => handleModeChange('recommend')}
            className={`px-6 py-2 rounded-lg font-medium transition-all ${
              mode === 'recommend'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            推荐选择
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 色轮区域 */}
        <div className="flex flex-col items-center">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">
            {mode === 'free' ? '在色轮上选择两种颜色' : '选择主颜色，系统自动推荐'}
          </h3>
          <ColorWheel
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}
            onPrimaryChange={handlePrimaryChange}
            onSecondaryChange={handleSecondaryChange}
            mode={mode}
            recommendedSecondary={mode === 'recommend' ? recommendedColor : undefined}
          />
          
          {/* 亮度调节 */}
          <div className="flex items-center gap-4 mt-8">
            <button
              onClick={() => adjustLightness(-10)}
              className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
            >
              变暗
            </button>
            <span className="text-sm text-gray-600">亮度调节</span>
            <button
              onClick={() => adjustLightness(10)}
              className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
            >
              变亮
            </button>
          </div>
        </div>

        {/* 颜色信息和推荐 */}
        <div className="space-y-6">
          {/* 当前颜色展示 */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h4 className="font-semibold text-gray-800 mb-3">当前配色</h4>
            <div className="flex gap-4">
              <div className="flex-1">
                <div
                  className="h-16 rounded-lg shadow-inner mb-2"
                  style={{ backgroundColor: primaryColor }}
                />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">主颜色</span>
                  <span className="text-sm font-mono">{primaryColor}</span>
                </div>
              </div>
              <div className="flex-1">
                <div
                  className="h-16 rounded-lg shadow-inner mb-2"
                  style={{
                    backgroundColor: mode === 'recommend' ? recommendedColor : secondaryColor,
                  }}
                />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    {mode === 'recommend' ? '推荐颜色' : '第二颜色'}
                  </span>
                  <span className="text-sm font-mono">
                    {mode === 'recommend' ? recommendedColor : secondaryColor}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 渐变预览 */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h4 className="font-semibold text-gray-800 mb-3">渐变预览</h4>
            <div
              className="h-24 rounded-xl shadow-inner"
              style={{
                background: `linear-gradient(135deg, ${primaryColor} 0%, ${
                  mode === 'recommend' ? recommendedColor : secondaryColor
                } 100%)`,
              }}
            />
          </div>

          {/* 推荐方案 */}
          {mode === 'recommend' && showHarmonies && (
            <div className="bg-gray-50 rounded-xl p-4">
              <h4 className="font-semibold text-gray-800 mb-3">色彩和谐方案</h4>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {harmonies.map((harmony) => (
                  <div
                    key={harmony.type}
                    className="bg-white rounded-lg p-3 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => harmony.colors[1] && handleApplyHarmony(harmony.colors[1])}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-sm">{harmony.name}</span>
                      <span className="text-xs text-gray-500">{harmony.colors.length}色</span>
                    </div>
                    <div className="flex gap-2">
                      {harmony.colors.map((color, idx) => (
                        <div
                          key={idx}
                          className="flex-1 h-8 rounded-md shadow-sm"
                          style={{ backgroundColor: color }}
                          title={color}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">{harmony.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 手动输入 */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h4 className="font-semibold text-gray-800 mb-3">手动输入</h4>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-xs text-gray-600 mb-1">主颜色</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => handlePrimaryChange(e.target.value)}
                    className="w-10 h-10 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={primaryColor}
                    onChange={(e) => handlePrimaryChange(e.target.value)}
                    className="flex-1 px-3 py-2 border rounded-lg text-sm font-mono uppercase"
                  />
                </div>
              </div>
              {mode === 'free' && (
                <div className="flex-1">
                  <label className="block text-xs text-gray-600 mb-1">第二颜色</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={secondaryColor}
                      onChange={(e) => handleSecondaryChange(e.target.value)}
                      className="w-10 h-10 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={secondaryColor}
                      onChange={(e) => handleSecondaryChange(e.target.value)}
                      className="flex-1 px-3 py-2 border rounded-lg text-sm font-mono uppercase"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
