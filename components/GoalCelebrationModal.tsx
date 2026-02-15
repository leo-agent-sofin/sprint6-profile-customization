'use client';

import { useEffect } from 'react';

interface GoalCelebrationModalProps {
  goalKm: number;
  onClose: () => void;
}

export default function GoalCelebrationModal({ goalKm, onClose }: GoalCelebrationModalProps) {
  // Auto-close after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  // Confetti effect could be added here with canvas-confetti library

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 text-center animate-slideUpBounce">
        {/* Confetti Animation Background */}
        <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
          <div className="absolute top-0 left-1/4 text-4xl animate-bounce" style={{ animationDelay: '0s' }}>🎉</div>
          <div className="absolute top-4 right-1/4 text-3xl animate-bounce" style={{ animationDelay: '0.2s' }}>🎊</div>
          <div className="absolute top-8 left-1/3 text-2xl animate-bounce" style={{ animationDelay: '0.4s' }}>✨</div>
          <div className="absolute top-2 right-1/3 text-3xl animate-bounce" style={{ animationDelay: '0.6s' }}>🌟</div>
        </div>

        <div className="relative z-10">
          {/* Trophy Icon */}
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full flex items-center justify-center shadow-lg">
            <span className="text-5xl">🏆</span>
          </div>

          {/* Title */}
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Goal Reached!
          </h2>

          {/* Subtitle */}
          <p className="text-xl text-gray-600 mb-6">
            You crushed your {goalKm} km weekly goal!
          </p>

          {/* Achievement Box */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 mb-6 border-2 border-green-200">
            <div className="text-4xl mb-2">🚴</div>
            <div className="text-lg font-bold text-green-800 mb-1">
              Weekly Champion
            </div>
            <div className="text-sm text-green-700">
              Amazing dedication to your cycling journey!
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-blue-50 rounded-xl p-4">
              <div className="text-2xl font-bold text-blue-700">{goalKm}</div>
              <div className="text-sm text-blue-600">km target</div>
            </div>
            <div className="bg-purple-50 rounded-xl p-4">
              <div className="text-2xl font-bold text-purple-700">100%</div>
              <div className="text-sm text-purple-600">completed</div>
            </div>
          </div>

          {/* Buttons */}
          <div className="space-y-3">
            <button
              onClick={onClose}
              className="w-full px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold text-lg hover:from-green-700 hover:to-emerald-700 hover:shadow-xl hover:-translate-y-1 active:translate-y-0 transition-all transform"
            >
              Keep Riding! 🚴
            </button>
            <button
              onClick={onClose}
              className="w-full px-6 py-3 text-gray-600 font-medium hover:text-gray-900 transition-colors"
            >
              Share Achievement
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
