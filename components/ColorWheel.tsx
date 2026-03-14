'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { hexToHsl, hslToHex, HSL } from '../lib/colorUtils';

interface ColorWheelProps {
  color1: string;
  color2: string;
  onChange: (color1: string, color2: string) => void;
  mode: 'free' | 'recommend';
  activeColor: 1 | 2;
  onActiveColorChange: (color: 1 | 2) => void;
}

export default function ColorWheel({
  color1,
  color2,
  onChange,
  mode,
  activeColor,
  onActiveColorChange,
}: ColorWheelProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDragging, setIsDragging] = useState<1 | 2 | null>(null);
  const size = 300;
  const center = size / 2;
  const radius = size / 2 - 20;

  const getPositionFromColor = useCallback((color: string) => {
    const hsl = hexToHsl(color);
    const angle = (hsl.h - 90) * (Math.PI / 180);
    const saturationRadius = hsl.s * radius;
    return {
      x: center + Math.cos(angle) * saturationRadius,
      y: center + Math.sin(angle) * saturationRadius,
    };
  }, []);

  const getColorFromPosition = useCallback((x: number, y: number): string => {
    const dx = x - center;
    const dy = y - center;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const saturation = Math.min(distance / radius, 1);
    let angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
    if (angle < 0) angle += 360;
    return hslToHex({ h: angle, s: saturation, l: 0.5 });
  }, []);

  const drawWheel = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, size, size);

    for (let angle = 0; angle < 360; angle++) {
      const startAngle = (angle - 90) * (Math.PI / 180);
      const endAngle = (angle + 1 - 90) * (Math.PI / 180);
      const gradient = ctx.createRadialGradient(center, center, 0, center, center, radius);
      gradient.addColorStop(0, hslToHex({ h: angle, s: 0, l: 0.5 }));
      gradient.addColorStop(1, hslToHex({ h: angle, s: 1, l: 0.5 }));
      ctx.beginPath();
      ctx.moveTo(center, center);
      ctx.arc(center, center, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = gradient;
      ctx.fill();
    }

    ctx.beginPath();
    ctx.arc(center, center, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 2;
    ctx.stroke();

    const pos1 = getPositionFromColor(color1);
    const pos2 = getPositionFromColor(color2);

    ctx.beginPath();
    ctx.moveTo(pos1.x, pos1.y);
    ctx.lineTo(pos2.x, pos2.y);
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.stroke();
    ctx.setLineDash([]);

    [
      { pos: pos1, color: color1, isActive: activeColor === 1 },
      { pos: pos2, color: color2, isActive: activeColor === 2 },
    ].forEach(({ pos, color, isActive }) => {
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, isActive ? 14 : 12, 0, 2 * Math.PI);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.strokeStyle = isActive ? '#1f2937' : '#ffffff';
      ctx.lineWidth = isActive ? 4 : 3;
      ctx.stroke();
    });
  }, [color1, color2, activeColor, getPositionFromColor]);

  useEffect(() => {
    drawWheel();
  }, [drawWheel]);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const pos1 = getPositionFromColor(color1);
    const pos2 = getPositionFromColor(color2);

    const dist1 = Math.sqrt((x - pos1.x) ** 2 + (y - pos1.y) ** 2);
    const dist2 = Math.sqrt((x - pos2.x) ** 2 + (y - pos2.y) ** 2);

    if (dist1 < 20) {
      setIsDragging(1);
      onActiveColorChange(1);
    } else if (dist2 < 20) {
      setIsDragging(2);
      onActiveColorChange(2);
    } else {
      const newColor = getColorFromPosition(x, y);
      if (activeColor === 1) {
        onChange(newColor, color2);
      } else {
        onChange(color1, newColor);
      }
      setIsDragging(activeColor);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging) return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const newColor = getColorFromPosition(x, y);

    if (mode === 'free') {
      if (isDragging === 1) {
        onChange(newColor, color2);
      } else {
        onChange(color1, newColor);
      }
    } else {
      if (isDragging === 1) {
        const hsl = hexToHsl(newColor);
        const complementaryHsl = { ...hsl, h: (hsl.h + 180) % 360 };
        onChange(newColor, hslToHex(complementaryHsl));
      } else {
        const hsl = hexToHsl(newColor);
        const complementaryHsl = { ...hsl, h: (hsl.h + 180) % 360 };
        onChange(hslToHex(complementaryHsl), newColor);
      }
    }
  };

  const handleMouseUp = () => {
    setIsDragging(null);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <canvas
        ref={canvasRef}
        width={size}
        height={size}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className="cursor-pointer rounded-full shadow-lg"
      />
      <div className="flex gap-4">
        <div
          className={`flex flex-col items-center gap-2 p-3 rounded-lg cursor-pointer transition-all ${
            activeColor === 1 ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:bg-gray-50'
          }`}
          onClick={() => onActiveColorChange(1)}
        >
          <div
            className="w-16 h-16 rounded-lg shadow-md border-2 border-gray-200"
            style={{ backgroundColor: color1 }}
          />
          <span className="text-sm font-medium text-gray-600">{color1}</span>
        </div>
        <div
          className={`flex flex-col items-center gap-2 p-3 rounded-lg cursor-pointer transition-all ${
            activeColor === 2 ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:bg-gray-50'
          }`}
          onClick={() => onActiveColorChange(2)}
        >
          <div
            className="w-16 h-16 rounded-lg shadow-md border-2 border-gray-200"
            style={{ backgroundColor: color2 }}
          />
          <span className="text-sm font-medium text-gray-600">{color2}</span>
        </div>
      </div>
    </div>
  );
}
