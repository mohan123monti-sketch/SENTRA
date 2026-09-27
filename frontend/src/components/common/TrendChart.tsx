import React, { useState } from 'react';
import { CheckInRecord } from '../../types/sentra';

interface TrendChartProps {
  checkIns: CheckInRecord[];
  baselineScore?: number;
  height?: number;
}

export const TrendChart: React.FC<TrendChartProps> = ({ 
  checkIns, 
  baselineScore = 26, 
  height = 180 
}) => {
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);

  // Sort chronological for left-to-right timeline
  const sorted = [...checkIns].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  if (sorted.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700/80 rounded text-xs text-slate-400">
        No longitudinal check-in entries recorded yet.
      </div>
    );
  }

  const paddingLeft = 35;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 30;
  const chartWidth = 500;
  const chartHeight = height;

  const innerWidth = chartWidth - paddingLeft - paddingRight;
  const innerHeight = chartHeight - paddingTop - paddingBottom;

  // Max scale is 100 for distress
  const maxVal = 100;
  const getY = (val: number) => paddingTop + innerHeight - (val / maxVal) * innerHeight;
  const getX = (idx: number) => {
    if (sorted.length === 1) return paddingLeft + innerWidth / 2;
    return paddingLeft + (idx / (sorted.length - 1)) * innerWidth;
  };

  const points = sorted.map((chk, idx) => ({
    x: getX(idx),
    y: getY(chk.analysis.distressIndicator),
    distress: chk.analysis.distressIndicator,
    mood: chk.answers.overallMood,
    date: new Date(chk.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
    id: chk.id,
    record: chk
  }));

  const pathD = points.reduce((acc, p, idx) => {
    return idx === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
  }, '');

  const areaD = `${pathD} L ${points[points.length - 1].x} ${paddingTop + innerHeight} L ${points[0].x} ${paddingTop + innerHeight} Z`;

  const baselineY = getY(baselineScore);

  return (
    <div className="w-full">
      <div className="relative">
        <svg 
          viewBox={`0 0 ${chartWidth} ${chartHeight}`} 
          className="w-full h-auto overflow-visible select-none"
          role="img"
          aria-label="Longitudinal Well-being Distress Trend Chart"
        >
          {/* Y Axis Guide Lines */}
          {[0, 25, 50, 75, 100].map((tick) => {
            const y = getY(tick);
            return (
              <g key={tick}>
                <line 
                  x1={paddingLeft} 
                  y1={y} 
                  x2={chartWidth - paddingRight} 
                  y2={y} 
                  stroke="#E2E8F0" 
                  strokeDasharray={tick === 0 ? "none" : "3,3"} 
                  strokeWidth="1" 
                />
                <text 
                  x={paddingLeft - 6} 
                  y={y + 3} 
                  textAnchor="end" 
                  className="text-[9px] fill-slate-400 font-mono"
                >
                  {tick}
                </text>
              </g>
            );
          })}

          {/* Personal Baseline Reference Line */}
          <line 
            x1={paddingLeft} 
            y1={baselineY} 
            x2={chartWidth - paddingRight} 
            y2={baselineY} 
            stroke="#0D9488" 
            strokeWidth="1.5" 
            strokeDasharray="4,4" 
          />
          <text 
            x={chartWidth - paddingRight} 
            y={baselineY - 4} 
            textAnchor="end" 
            className="text-[9px] fill-teal-700 font-semibold font-mono"
          >
            Personal Baseline ({baselineScore})
          </text>

          {/* Gradient Fill under Distress Curve */}
          <defs>
            <linearGradient id="distressGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#EA580C" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#EA580C" stopOpacity="0.0" />
            </linearGradient>
          </defs>
          <path d={areaD} fill="url(#distressGradient)" />

          {/* Distress Line */}
          <path 
            d={pathD} 
            fill="none" 
            stroke="#EA580C" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />

          {/* Data Points */}
          {points.map((p, idx) => {
            const isHovered = hoveredPoint === idx;
            return (
              <g key={p.id}>
                <circle 
                  cx={p.x} 
                  cy={p.y} 
                  r={isHovered ? 6 : 4.5} 
                  fill="#ffffff" 
                  stroke="#EA580C" 
                  strokeWidth="2.5"
                  className="transition-all cursor-pointer"
                  onMouseEnter={() => setHoveredPoint(idx)}
                  onMouseLeave={() => setHoveredPoint(null)}
                />

                {/* X Axis Date Label */}
                <text 
                  x={p.x} 
                  y={paddingTop + innerHeight + 16} 
                  textAnchor="middle" 
                  className="text-[10px] fill-slate-500 font-mono"
                >
                  {p.date}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Hover Tooltip Overlay */}
        {hoveredPoint !== null && (
          <div 
            className="absolute z-20 pointer-events-none bg-slate-900 text-white rounded p-2 text-xs shadow-lg transform -translate-x-1/2 -translate-y-full mb-2"
            style={{
              left: `${(points[hoveredPoint].x / chartWidth) * 100}%`,
              top: `${(points[hoveredPoint].y / chartHeight) * 100}%`
            }}
          >
            <div className="font-semibold text-amber-300 font-mono text-[11px]">
              {points[hoveredPoint].date} Check-in
            </div>
            <div className="text-[11px] mt-0.5">
              Distress Index: <span className="font-bold text-white tabular-nums">{points[hoveredPoint].distress}/100</span>
            </div>
            <div className="text-[10px] text-slate-300">
              Mood Rating: {points[hoveredPoint].mood}/5
            </div>
          </div>
        )}
      </div>

      {/* Legend & Accessibility Readout */}
      <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800/50 flex flex-wrap items-center justify-between text-xs text-slate-500 dark:text-slate-400 gap-2">
        <div className="flex items-center gap-4 text-[11px]">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-orange-600 inline-block"></span>
            <span>Distress Indicator (0-100)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-teal-600 border-b border-dashed inline-block"></span>
            <span>Personal Baseline Threshold</span>
          </div>
        </div>
        <div className="text-[10px] font-mono text-slate-400">
          Scale: Lower is calmer · Human review triggered on deviation
        </div>
      </div>
    </div>
  );
};
