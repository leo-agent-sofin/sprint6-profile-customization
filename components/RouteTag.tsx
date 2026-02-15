'use client';

import { RouteType } from '@/lib/rides';

interface RouteTagProps {
  type: RouteType;
  size?: 'sm' | 'md';
}

export default function RouteTag({ type, size = 'md' }: RouteTagProps) {
  const styles = {
    flat: {
      bg: 'bg-green-100',
      text: 'text-green-800',
      border: 'border-green-200',
      icon: '🌿',
      label: 'Flat'
    },
    hilly: {
      bg: 'bg-yellow-100',
      text: 'text-yellow-800',
      border: 'border-yellow-200',
      icon: '⛰️',
      label: 'Hilly'
    },
    mountain: {
      bg: 'bg-orange-100',
      text: 'text-orange-800',
      border: 'border-orange-200',
      icon: '🏔️',
      label: 'Mountain'
    },
    sprint: {
      bg: 'bg-red-100',
      text: 'text-red-800',
      border: 'border-red-200',
      icon: '⚡',
      label: 'Sprint'
    }
  };

  const style = styles[type];
  const sizeClasses = size === 'sm' 
    ? 'px-2 py-0.5 text-xs' 
    : 'px-3 py-1 text-sm';

  return (
    <span className={`
      inline-flex items-center gap-1 font-medium rounded-full border
      ${style.bg} ${style.text} ${style.border}
      ${sizeClasses}
    `}>
      <span>{style.icon}</span>
      <span>{style.label}</span>
    </span>
  );
}
