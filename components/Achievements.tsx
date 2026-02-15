'use client';

import { useState, useEffect } from 'react';
import { achievements, Achievement } from '@/lib/achievements';

export default function Achievements() {
  const [allAchievements, setAllAchievements] = useState<Achievement[]>([]);

  const loadData = () => {
    setAllAchievements(achievements.getAll());
  };

  useEffect(() => {
    loadData();
  }, []);

  const unlockedCount = allAchievements.filter(a => a.unlocked).length;
  const totalCount = allAchievements.length;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-700">🎖️ Achievements</h3>
        <div className="text-sm font-medium text-gray-600">
          {unlockedCount}/{totalCount} unlocked
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
        <div
          className="bg-gradient-to-r from-yellow-400 to-orange-500 h-full transition-all duration-500"
          style={{ width: `${(unlockedCount / totalCount) * 100}%` }}
        />
      </div>

      {/* Achievement Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {allAchievements.map((achievement) => (
          <div
            key={achievement.id}
            className={`
              rounded-xl p-4 border-2 transition-all
              ${achievement.unlocked
                ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-300 shadow-md'
                : 'bg-gray-50 border-gray-200 opacity-50'
              }
            `}
          >
            <div className="text-center">
              <div className={`text-4xl mb-2 ${achievement.unlocked ? '' : 'grayscale'}`}>
                {achievement.emoji}
              </div>
              <div className="text-sm font-bold text-gray-800 mb-1">
                {achievement.name}
              </div>
              <div className="text-xs text-gray-600">
                {achievement.description}
              </div>
              {achievement.unlocked && achievement.unlockedDate && (
                <div className="text-xs text-yellow-600 font-medium mt-2">
                  ✓ Unlocked
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {unlockedCount === 0 && (
        <div className="text-center py-6 px-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border-2 border-dashed border-purple-200 mt-4">
          <div className="text-4xl mb-3">🎯</div>
          <h3 className="text-lg font-bold text-gray-800 mb-2">
            Start Your Journey!
          </h3>
          <p className="text-sm text-gray-600">
            Log rides to unlock achievements and badges
          </p>
        </div>
      )}
    </div>
  );
}
