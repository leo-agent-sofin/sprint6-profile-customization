'use client';

import { useState, useEffect } from 'react';
import { goals, WeeklyGoal } from '@/lib/goals';
import { rides } from '@/lib/rides';

interface WeeklyGoalCardProps {
  onGoalReached?: (goalKm: number) => void;
}

export default function WeeklyGoalCard({ onGoalReached }: WeeklyGoalCardProps) {
  const [goal, setGoal] = useState<WeeklyGoal>(goals.getWeeklyGoal());
  const [isEditing, setIsEditing] = useState(false);
  const [newTarget, setNewTarget] = useState(goal.targetKm.toString());
  const [prevProgress, setPrevProgress] = useState(0);

  useEffect(() => {
    const currentGoal = goals.getWeeklyGoal();
    setGoal(currentGoal);
    setPrevProgress(currentGoal.currentKm);
  }, []);

  const handleSave = () => {
    const target = parseFloat(newTarget);
    if (target > 0) {
      goals.setWeeklyGoal(target);
      setGoal({ ...goal, targetKm: target });
      setIsEditing(false);
    }
  };

  const progress = Math.min((goal.currentKm / goal.targetKm) * 100, 100);
  const remaining = Math.max(goal.targetKm - goal.currentKm, 0);

  // Check if goal was just reached
  useEffect(() => {
    if (prevProgress < goal.targetKm && goal.currentKm >= goal.targetKm) {
      onGoalReached?.(goal.targetKm);
    }
    setPrevProgress(goal.currentKm);
  }, [goal.currentKm, goal.targetKm, prevProgress, onGoalReached]);

  const formatWeekRange = () => {
    const start = new Date(goal.weekStart);
    const end = new Date(goal.weekEnd);
    return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">🎯 Weekly Goal</h2>
          <p className="text-gray-600">{formatWeekRange()}</p>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            Edit Goal
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Target Distance (km)
            </label>
            <div className="flex gap-3">
              <input
                type="number"
                value={newTarget}
                onChange={(e) => setNewTarget(e.target.value)}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="50"
                min="1"
                step="5"
                autoFocus
              />
              <button
                onClick={handleSave}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setNewTarget(goal.targetKm.toString());
                }}
                className="px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Progress Stats */}
          <div className="flex items-center justify-between text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600">{goal.currentKm.toFixed(1)}</div>
              <div className="text-sm text-gray-600">km ridden</div>
            </div>
            <div className="text-gray-400">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900">{goal.targetKm.toFixed(0)}</div>
              <div className="text-sm text-gray-600">km goal</div>
            </div>
            <div className="text-gray-400">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600">{remaining.toFixed(1)}</div>
              <div className="text-sm text-gray-600">km to go</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="relative">
            <div className="bg-gray-200 rounded-full h-6 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-700 ease-out"
                style={{ width: `${progress}%` }}
              >
                {progress >= 100 && (
                  <div className="h-full w-full animate-pulse bg-gradient-to-r from-green-500 to-emerald-500" />
                )}
              </div>
            </div>
            <div className="flex justify-between mt-2 text-sm text-gray-600">
              <span>0%</span>
              <span className="font-semibold text-blue-600">{progress.toFixed(0)}%</span>
              <span>100%</span>
            </div>
          </div>

          {/* Quick Select */}
          <div className="pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-3">Quick set:</p>
            <div className="flex gap-2 flex-wrap">
              {[25, 50, 75, 100, 150, 200].map((km) => (
                <button
                  key={km}
                  onClick={() => {
                    goals.setWeeklyGoal(km);
                    setGoal({ ...goal, targetKm: km });
                  }}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                    goal.targetKm === km
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {km} km
                </button>
              ))}
            </div>
          </div>

          {/* Goal Reached Message */}
          {progress >= 100 && (
            <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl text-center">
              <div className="text-3xl mb-2">🎉</div>
              <div className="font-bold text-green-800">Goal Reached!</div>
              <div className="text-sm text-green-700">Amazing work this week!</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
