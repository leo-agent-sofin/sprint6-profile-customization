'use client';

interface DifficultyBadgeProps {
  elevationGain: number;
  distance: number;
  size?: 'sm' | 'md' | 'lg';
}

type DifficultyLevel = 'Easy' | 'Moderate' | 'Hard' | 'Extreme';

export default function DifficultyBadge({ elevationGain, distance, size = 'md' }: DifficultyBadgeProps) {
  // Calculate elevation ratio (meters per km)
  const ratio = elevationGain / distance;
  
  let level: DifficultyLevel;
  let colors: { bg: string; text: string; border: string };
  
  if (ratio < 10) {
    level = 'Easy';
    colors = {
      bg: 'bg-green-100',
      text: 'text-green-800',
      border: 'border-green-300'
    };
  } else if (ratio < 20) {
    level = 'Moderate';
    colors = {
      bg: 'bg-yellow-100',
      text: 'text-yellow-800',
      border: 'border-yellow-300'
    };
  } else if (ratio < 35) {
    level = 'Hard';
    colors = {
      bg: 'bg-orange-100',
      text: 'text-orange-800',
      border: 'border-orange-300'
    };
  } else {
    level = 'Extreme';
    colors = {
      bg: 'bg-red-100',
      text: 'text-red-800',
      border: 'border-red-300'
    };
  }

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  return (
    <span className={`
      inline-flex items-center gap-1.5 font-semibold rounded-full border
      ${colors.bg} ${colors.text} ${colors.border}
      ${sizeClasses[size]}
    `}>
      <span className={`
        w-2 h-2 rounded-full
        ${level === 'Easy' ? 'bg-green-500' : ''}
        ${level === 'Moderate' ? 'bg-yellow-500' : ''}
        ${level === 'Hard' ? 'bg-orange-500' : ''}
        ${level === 'Extreme' ? 'bg-red-500' : ''}
      `} />
      <span>{level}</span>
      <span className="opacity-60 font-normal">
        ({ratio.toFixed(1)}m/km)
      </span>
    </span>
  );
}
