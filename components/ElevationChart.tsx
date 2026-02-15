'use client';

interface ElevationChartProps {
  data: number[];
  width?: number;
  height?: number;
}

export default function ElevationChart({ data, width = 400, height = 200 }: ElevationChartProps) {
  if (!data || data.length === 0) return null;

  const minElevation = Math.min(...data);
  const maxElevation = Math.max(...data);
  const elevationRange = maxElevation - minElevation || 1;

  // Create SVG path
  const points = data.map((elevation, index) => {
    const x = (index / (data.length - 1)) * width;
    const y = height - ((elevation - minElevation) / elevationRange) * (height - 40) - 20;
    return `${x},${y}`;
  }).join(' ');

  // Create area path (close the bottom)
  const areaPath = `${points} ${width},${height} 0,${height}`;

  // Calculate statistics
  const totalClimbing = data.reduce((sum, val, i) => {
    if (i === 0) return 0;
    const diff = val - data[i - 1];
    return diff > 0 ? sum + diff : sum;
  }, 0);

  return (
    <div className="w-full">
      {/* Chart Container */}
      <div className="relative bg-gradient-to-b from-slate-50 to-slate-100 rounded-xl border border-slate-200 overflow-hidden">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full"
          style={{ height: `${height}px` }}
          preserveAspectRatio="none"
        >
          {/* Gradient Definition */}
          <defs>
            <linearGradient id="elevationGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.1" />
            </linearGradient>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#2563EB" />
              <stop offset="50%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#60A5FA" />
            </linearGradient>
          </defs>

          {/* Grid Lines */}
          {[0, 1, 2, 3, 4].map((i) => (
            <line
              key={i}
              x1="0"
              y1={i * (height / 4)}
              x2={width}
              y2={i * (height / 4)}
              stroke="#E2E8F0"
              strokeWidth="1"
              strokeDasharray="4 4"
            />
          ))}

          {/* Area Fill */}
          <polygon
            points={areaPath}
            fill="url(#elevationGradient)"
          />

          {/* Elevation Line */}
          <polyline
            points={points}
            fill="none"
            stroke="url(#lineGradient)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Start Point Marker */}
          <circle
            cx={0}
            cy={height - ((data[0] - minElevation) / elevationRange) * (height - 40) - 20}
            r="6"
            fill="#10B981"
            stroke="white"
            strokeWidth="2"
          />

          {/* End Point Marker */}
          <circle
            cx={width}
            cy={height - ((data[data.length - 1] - minElevation) / elevationRange) * (height - 40) - 20}
            r="6"
            fill="#EF4444"
            stroke="white"
            strokeWidth="2"
          />
        </svg>

        {/* Labels */}
        <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1 text-xs font-medium text-slate-600">
          Start: {Math.round(data[0])}m
        </div>
        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1 text-xs font-medium text-slate-600">
          End: {Math.round(data[data.length - 1])}m
        </div>
        <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1 text-xs font-medium text-slate-600">
          ↗️ {Math.round(totalClimbing)}m climbing
        </div>
      </div>

      {/* X-Axis Labels */}
      <div className="flex justify-between text-xs text-slate-500 mt-2 px-1">
        <span>Start</span>
        <span>25%</span>
        <span>50%</span>
        <span>75%</span>
        <span>Finish</span>
      </div>
    </div>
  );
}
