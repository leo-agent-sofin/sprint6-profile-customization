'use client';

import { useState, useEffect } from 'react';
import { goals, Badge, MonthlyStats } from '@/lib/goals';

export default function MonthlyChallenges() {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [monthlyStats, setMonthlyStats] = useState<MonthlyStats>({ month: '', totalDistance: 0, totalRides: 0, totalElevation: 0 });
  const [newlyUnlocked, setNewlyUnlocked] = useState<string[]>([]);

  useEffect(() => {
    setBadges(goals.getBadges());
    setMonthlyStats(goals.getMonthlyStats());
    
    // Check for newly unlocked badges
    const unlocked = goals.checkAndUnlockBadges();
    if (unlocked.length > 0) {
      setNewlyUnlocked(unlocked);
      setBadges(goals.getBadges());
    }
  }, []);

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'bronze':
        return {
          bg: 'from-orange-100 to-amber-100',
          border: 'border-orange-300',
          text: 'text-orange-800',
          badge: 'bg-gradient-to-r from-orange-600 to-amber-600',
          emoji: '🥉'
        };
      case 'silver':
        return {
          bg: 'from-gray-100 to-slate-200',
          border: 'border-gray-400',
          text: 'text-gray-800',
          badge: 'bg-gradient-to-r from-gray-500 to-slate-500',
          emoji: '🥈'
        };
      case 'gold':
        return {
          bg: 'from-yellow-50 to-amber-100',
          border: 'border-yellow-400',
          text: 'text-yellow-900',
          badge: 'bg-gradient-to-r from-yellow-500 to-amber-500',
          emoji: '🥇'
        };
      default:
        return {
          bg: 'from-gray-50 to-gray-100',
          border: 'border-gray-200',
          text: 'text-gray-600',
          badge: 'bg-gray-400',
          emoji: '🔒'
        };
    }
  };

  const formatMonth = (monthStr: string) => {
    if (!monthStr) return 'This Month';
    const [year, month] = monthStr.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const bronzeBadges = badges.filter(b => b.tier === 'bronze');
  const silverBadges = badges.filter(b => b.tier === 'silver');
  const goldBadges = badges.filter(b => b.tier === 'gold');

  const tierGroups = [
    { name: 'Bronze', badges: bronzeBadges, key: 'bronze' },
    { name: 'Silver', badges: silverBadges, key: 'silver' },
    { name: 'Gold', badges: goldBadges, key: 'gold' }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">🏆 Monthly Challenges</h2>
          <p className="text-gray-600">{formatMonth(monthlyStats.month)}</p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-blue-600">{monthlyStats.totalDistance.toFixed(0)}</div>
          <div className="text-sm text-gray-600">km this month</div>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 text-center border border-blue-200">
          <div className="text-2xl font-bold text-blue-700">{monthlyStats.totalDistance.toFixed(1)}</div>
          <div className="text-xs text-blue-600">km</div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 text-center border border-green-200">
          <div className="text-2xl font-bold text-green-700">{monthlyStats.totalRides}</div>
          <div className="text-xs text-green-600">rides</div>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-4 text-center border border-orange-200">
          <div className="text-2xl font-bold text-orange-700">{monthlyStats.totalElevation}</div>
          <div className="text-xs text-orange-600">m climbed</div>
        </div>
      </div>

      {/* Tier Groups */}
      <div className="space-y-6">
        {tierGroups.map((group) => (
          <div key={group.key}>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg font-bold text-gray-700">{group.name}</span>
              <span className="text-sm text-gray-500">
                ({group.badges.filter(b => b.unlocked).length}/{group.badges.length})
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {group.badges.map((badge) => {
                const colors = getTierColor(badge.tier);
                const isNewlyUnlocked = newlyUnlocked.includes(badge.id);

                return (
                  <div
                    key={badge.id}
                    className={`
                      relative p-4 rounded-xl border-2 transition-all
                      ${badge.unlocked 
                        ? `bg-gradient-to-br ${colors.bg} ${colors.border} shadow-md` 
                        : 'bg-gray-50 border-gray-200 opacity-60'
                      }
                      ${isNewlyUnlocked ? 'animate-pulse ring-2 ring-green-400' : ''}
                    `}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`
                        w-12 h-12 rounded-full flex items-center justify-center text-2xl
                        ${badge.unlocked ? colors.badge : 'bg-gray-300'}
                      `}>
                        {badge.unlocked ? colors.emoji : '🔒'}
                      </div>
                      <div className="flex-1">
                        <div className={`font-bold ${badge.unlocked ? colors.text : 'text-gray-500'}`}>
                          {badge.name}
                        </div>
                        <div className="text-sm text-gray-600">
                          {badge.description}
                        </div>
                        {badge.unlocked && badge.unlockedDate && (
                          <div className="text-xs text-green-600 font-medium mt-1">
                            ✓ Unlocked {new Date(badge.unlockedDate).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Overall Progress */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-lg font-bold text-gray-900">Your Progress</div>
            <div className="text-sm text-gray-600">Keep riding to unlock more badges!</div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-blue-600">
              {badges.filter(b => b.unlocked).length}/{badges.length}
            </div>
            <div className="text-sm text-gray-600">badges earned</div>
          </div>
        </div>
        <div className="mt-3 bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-500"
            style={{ width: `${(badges.filter(b => b.unlocked).length / badges.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
