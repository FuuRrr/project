'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { hexToHsl, hslToHex } from '@/utils/colorUtils';

interface ColorWheelProps {
  size?: number;
  primaryColor: string;
  secondaryColor: string;
  onPrimaryChange: (color: string) => void;
  onSecondaryChange: (color: string) => void;
  mode: 'free' | 'recommend';
  recommendedSecondary?: string;
}

export default function ColorWheel({
  size = 280,
  primaryColor,
  secondaryColor,
  onPrimaryChange,
  onSecondaryChange,
  mode,
  recommendedSecondary,
}: ColorWheelProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDraggingPrimary, setIsDraggingPrimary] = useState(false);
  const [isDraggingSecondary, setIsDraggingSecondary] = useState(false);
  const [primaryPos, setPrimaryPos] = useState({ x: 0, y: 0 });
  const [secondaryPos, setSecondaryPos] = useState({ x: 0, y: 0 });

  const center = size / 2;
  const radius = size / 2 - 10;

  // 绘制色轮
  const drawWheel = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 清空画布
    ctx.clearRect(0, 0, size, size);

    // 绘制色轮背景
    for (let angle = 0; angle < 360; angle++) {
      const startAngle = ((angle - 1) * Math.PI) / 180;
      const endAngle = (angle * Math.PI) / 180;

      ctx.beginPath();
      ctx.moveTo(center, center);
      ctx.arc(center, center, radius, startAngle, endAngle);
      ctx.closePath();

      const gradient = ctx.createRadialGradient(center, center, 0, center, center, radius);
      gradient.addColorStop(0, '#ffffff');
      gradient.addColorStop(1, `hsl(${angle}, 100%, 50%)`);
      ctx.fillStyle = gradient;
      ctx.fill();
    }

    // 绘制中心白色圆
    ctx.beginPath();
    ctx.arc(center, center, 15, 0, 2 * Math.PI);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 2;
    ctx.stroke();
  }, [center, radius, size]);

  // 将颜色转换为位置
  const colorToPosition = useCallback((color: string) => {
    const hsl = hexToHsl(color);
    const angleRad = ((hsl.h - 90) * Math.PI) / 180;
    const distance = (hsl.s / 100) * radius;
    return {
      x: center + distance * Math.cos(angleRad),
      y: center + distance * Math.sin(angleRad),
    };
  }, [center, radius]);

  // 将位置转换为颜色
  const positionToColor = useCallback((x: number, y: number) => {
    const dx = x - center;
    const dy = y - center;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // 计算角度
    let angle = Math.atan2(dy, dx) * (180 / Math.PI);
    angle = (angle + 90 + 360) % 360;
    
    // 限制距离在圆内，避免递归
    const clampedDistance = Math.min(distance, radius);
    const saturation = radius > 0 ? Math.min(100, (clampedDistance / radius) * 100) : 0;
    
    return hslToHex(angle, saturation, 50);
  }, [center, radius]);

  // 初始化位置
  useEffect(() => {
    setPrimaryPos(colorToPosition(primaryColor));
    setSecondaryPos(colorToPosition(secondaryColor));
  }, [primaryColor, secondaryColor, colorToPosition]);

  // 绘制色轮
  useEffect(() => {
    drawWheel();
  }, [drawWheel]);

  // 处理鼠标/触摸事件
  const handleStart = (e: React.MouseEvent | React.TouchEvent, isPrimary: boolean) => {
    e.preventDefault();
    if (isPrimary) {
      setIsDraggingPrimary(true);
    } else {
      if (mode === 'free') {
        setIsDraggingSecondary(true);
      }
    }
  };

  const handleMove = useCallback((e: MouseEvent | TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;

    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = (e as MouseEvent).clientX;
      clientY = (e as MouseEvent).clientY;
    }

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    if (isDraggingPrimary) {
      const newColor = positionToColor(x, y);
      onPrimaryChange(newColor);
      setPrimaryPos({ x, y });
    } else if (isDraggingSecondary && mode === 'free') {
      const newColor = positionToColor(x, y);
      onSecondaryChange(newColor);
      setSecondaryPos({ x, y });
    }
  }, [isDraggingPrimary, isDraggingSecondary, mode, onPrimaryChange, onSecondaryChange, positionToColor]);

  const handleEnd = useCallback(() => {
    setIsDraggingPrimary(false);
    setIsDraggingSecondary(false);
  }, []);

  // 添加全局事件监听
  useEffect(() => {
    if (isDraggingPrimary || isDraggingSecondary) {
      window.addEventListener('mousemove', handleMove);
      window.addEventListener('mouseup', handleEnd);
      window.addEventListener('touchmove', handleMove);
      window.addEventListener('touchend', handleEnd);

      return () => {
        window.removeEventListener('mousemove', handleMove);
        window.removeEventListener('mouseup', handleEnd);
        window.removeEventListener('touchmove', handleMove);
        window.removeEventListener('touchend', handleEnd);
      };
    }
  }, [isDraggingPrimary, isDraggingSecondary, handleMove, handleEnd]);

  // 获取当前显示的第二颜色位置
  const displaySecondaryPos = mode === 'recommend' && recommendedSecondary
    ? colorToPosition(recommendedSecondary)
    : secondaryPos;

  return (
    <div className="relative inline-block">
      <canvas
        ref={canvasRef}
        width={size}
        height={size}
        className="rounded-full cursor-crosshair"
      />
      
      {/* 主颜色选择器 */}
      <div
        className="absolute w-6 h-6 rounded-full border-4 border-white shadow-lg cursor-pointer transform -translate-x-1/2 -translate-y-1/2 transition-transform hover:scale-110"
        style={{
          left: primaryPos.x,
          top: primaryPos.y,
          backgroundColor: primaryColor,
          boxShadow: '0 0 0 2px rgba(0,0,0,0.2), 0 4px 8px rgba(0,0,0,0.3)',
        }}
        onMouseDown={(e) => handleStart(e, true)}
        onTouchStart={(e) => handleStart(e, true)}
        title="主颜色"
      />

      {/* 第二颜色选择器 */}
      <div
        className={`absolute w-5 h-5 rounded-full border-4 border-white shadow-lg transform -translate-x-1/2 -translate-y-1/2 transition-transform ${
          mode === 'free' ? 'cursor-pointer hover:scale-110' : 'cursor-not-allowed'
        }`}
        style={{
          left: displaySecondaryPos.x,
          top: displaySecondaryPos.y,
          backgroundColor: mode === 'recommend' && recommendedSecondary ? recommendedSecondary : secondaryColor,
          boxShadow: '0 0 0 2px rgba(0,0,0,0.2), 0 4px 8px rgba(0,0,0,0.3)',
        }}
        onMouseDown={(e) => handleStart(e, false)}
        onTouchStart={(e) => handleStart(e, false)}
        title={mode === 'recommend' ? '推荐颜色 (不可拖动)' : '第二颜色'}
      />

      {/* 模式指示器 */}
      {mode === 'recommend' && (
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-sm text-gray-500">
          推荐模式: 拖动主颜色，系统自动推荐配色
        </div>
      )}
    </div>
  );
}
