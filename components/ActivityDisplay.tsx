'use client';

import { useState, useEffect } from 'react';
import { activities } from '@/lib/activities';

interface ActivityDisplayProps {
  onActivityLogged?: () => void;
}

export default function ActivityDisplay({ onActivityLogged }: ActivityDisplayProps) {
  const [activityCount, setActivityCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [isTodayLogged, setIsTodayLogged] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [lastWeek, setLastWeek] = useState<{ date: string; logged: boolean }[]>([]);

  const loadData = () => {
    setActivityCount(activities.getCount());
    setStreak(activities.getStreak());
    setIsTodayLogged(activities.isTodayLogged());
    setLastWeek(activities.getLastWeek());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleLogActivity = () => {
    setIsLoading(true);
    
    // Simulate slight delay for UX
    setTimeout(() => {
      const success = activities.logToday();
      
      if (success) {
        loadData();
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
        
        if (onActivityLogged) {
          onActivityLogged();
        }
      }
      
      setIsLoading(false);
    }, 300);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="space-y-6">
      {/* Log Activity Button */}
      <div>
        <button
          onClick={handleLogActivity}
          disabled={isTodayLogged || isLoading}
          className={`
            w-full px-8 py-4 rounded-xl font-semibold text-lg
            transition-all transform
            ${isTodayLogged 
              ? 'bg-green-100 text-green-700 cursor-not-allowed' 
              : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0'
            }
            ${isLoading ? 'opacity-50 cursor-wait' : ''}
          `}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Logging...
            </span>
          ) : isTodayLogged ? (
            <span className="flex items-center justify-center gap-2">
              ✓ Activity Logged Today
            </span>
          ) : (
            <span>📝 Log Today's Activity</span>
          )}
        </button>
        
        {!isTodayLogged && !isLoading && (
          <p className="text-center text-sm text-gray-500 mt-2">
            Keep your streak alive! Log your activity today.
          </p>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
          <div className="text-4xl font-bold text-blue-700 mb-2">
            {activityCount}
          </div>
          <div className="text-sm text-blue-600 font-medium">Total Days</div>
        </div>
        
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl border border-orange-200">
          <div className="text-4xl font-bold text-orange-700 mb-2">
            {streak} 🔥
          </div>
          <div className="text-sm text-orange-600 font-medium">Current Streak</div>
        </div>
      </div>

      {/* Last 7 Days */}
      <div>
        <h3 className="font-semibold text-gray-700 mb-3">Last 7 Days</h3>
        <div className="grid grid-cols-7 gap-2">
          {lastWeek.map((day, index) => (
            <div key={index} className="text-center">
              <div className="text-xs text-gray-500 mb-1">
                {formatDate(day.date)}
              </div>
              <div className={`
                w-full aspect-square rounded-lg flex items-center justify-center text-2xl
                transition-all
                ${day.logged 
                  ? 'bg-green-500 text-white shadow-md' 
                  : 'bg-gray-100 text-gray-300'
                }
              `}>
                {day.logged ? '✓' : '·'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Empty State */}
      {activityCount === 0 && (
        <div className="text-center py-8 px-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border-2 border-dashed border-purple-200">
          <div className="text-5xl mb-4">🎯</div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            Start Your Streak!
          </h3>
          <p className="text-gray-600">
            Log your first activity today and build a consistent habit.
          </p>
        </div>
      )}

      {/* Success Toast */}
      {showToast && (
        <div className="fixed bottom-8 right-8 bg-green-600 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 animate-bounce">
          <span className="text-2xl">🎉</span>
          <div>
            <div className="font-semibold">Activity Logged!</div>
            <div className="text-sm opacity-90">Keep up the great work!</div>
          </div>
        </div>
      )}
    </div>
  );
}
