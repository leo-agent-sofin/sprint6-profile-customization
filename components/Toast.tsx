'use client';

import { useEffect } from 'react';

interface ToastProps {
  message: string;
  type?: 'success' | 'info' | 'error' | 'achievement';
  onClose: () => void;
  duration?: number;
}

export default function Toast({ message, type = 'success', onClose, duration = 4000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const styles = {
    success: {
      bg: 'bg-gradient-to-r from-green-600 to-emerald-600',
      icon: '✓',
      subtitle: 'Success!'
    },
    info: {
      bg: 'bg-gradient-to-r from-blue-600 to-indigo-600',
      icon: 'ℹ️',
      subtitle: 'Info'
    },
    error: {
      bg: 'bg-gradient-to-r from-red-600 to-rose-600',
      icon: '✕',
      subtitle: 'Error'
    },
    achievement: {
      bg: 'bg-gradient-to-r from-yellow-500 to-orange-500',
      icon: '🎉',
      subtitle: 'Achievement Unlocked!'
    }
  };

  const style = styles[type];

  return (
    <div className="fixed bottom-24 right-8 z-50 animate-slideUpBounce">
      <div className={`${style.bg} text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 min-w-[300px] max-w-md`}>
        <div className="flex items-center gap-3 flex-1">
          <span className="text-2xl">{style.icon}</span>
          <div>
            <div className="font-semibold">{message}</div>
            <div className="text-sm opacity-90">{style.subtitle}</div>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-white hover:text-gray-200 transition-colors ml-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
