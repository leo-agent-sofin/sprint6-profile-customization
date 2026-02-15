'use client';

import { useState, useEffect } from 'react';
import { achievements, PersonalBests as PBType } from '@/lib/achievements';
import { rides } from '@/lib/rides';

export default function PersonalBests() {
  const [pbs, setPbs] = useState<PBType>({
    longestRide: null,
    biggestClimb: null,
    longestDuration: null,
    fastestSpeed: null
  });
  const [mostActiveWeek, setMostActiveWeek] = useState<any>(null);
  const [mostActiveMonth, setMostActiveMonth] = useState<any>(null);

  useEffect(() => {
    setPbs(achievements.getPersonalBests());
    setMostActiveWeek(achievements.getMostActiveWeek());
    setMostActiveMonth(achievements.getMostActiveMonth());
  }, []);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const formatMonth = (monthStr: string) => {
    const [year, month] = monthStr.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const pbCards = [
    {
      key: 'longestRide',
      emoji: '🚴',
      color: 'from-blue-500 to-cyan-500',
      value: pbs.longestRide ? `${pbs.longestRide.value.toFixed(1)} km` : '—',
      date: pbs.longestRide?.date
    },
    {
      key: 'biggestClimb',
      emoji: '⛰️',
      color: 'from-orange-500 to-red-500',
      value: pbs.biggestClimb ? `${pbs.biggestClimb.value} m` : '—',
      date: pbs.biggestClimb?.date
    },
    {
      key: 'longestDuration',
      emoji: '⏱️',
      color: 'from-purple-500 to-pink-500',
      value: pbs.longestDuration ? formatDuration(pbs.longestDuration.value) : '—',
      date: pbs.longestDuration?.date
    },
    {
      key: 'fastestSpeed',
      emoji: '⚡',
      color: 'from-green-500 to-emerald-500',
      value: pbs.fastestSpeed ? `${pbs.fastestSpeed.value.toFixed(1)} km/h` : '—',
      date: pbs.fastestSpeed?.date
    }
  ];

  return (
    <div className="space-y-6">
      {/* Personal Bests Grid */}
      <div>
        <h3 className="text-lg font-semibold text-gray-700 mb-4">🏆 Personal Bests</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {pbCards.map((pb) => (
            <div
              key={pb.key}
              className="bg-white rounded-xl shadow-md p-6 border-2 border-gray-100 hover:shadow-lg transition-shadow"
            >
              <div className="text-center">
                <div className="text-4xl mb-2">{pb.emoji}</div>
                <div className={`text-2xl font-bold bg-gradient-to-r ${pb.color} bg-clip-text text-transparent mb-1`}>
                  {pb.value}
                </div>
                <div className="text-xs font-medium text-gray-600 mb-1">
                  {achievements.formatPBName(pb.key)}
                </div>
                {pb.date && (
                  <div className="text-xs text-gray-500">
                    {formatDate(pb.date)}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Most Active Periods */}
      {(mostActiveWeek || mostActiveMonth) && (
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-4">📊 Most Active</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mostActiveWeek && (
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200">
                <div className="text-3xl mb-3">📅</div>
                <div className="text-2xl font-bold text-blue-700 mb-1">
                  {mostActiveWeek.totalDistance.toFixed(1)} km
                </div>
                <div className="text-sm font-medium text-gray-700">
                  Best Week • {mostActiveWeek.rideCount} rides
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  Week of {formatDate(mostActiveWeek.weekStart)}
                </div>
              </div>
            )}
            
            {mostActiveMonth && (
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200">
                <div className="text-3xl mb-3">🗓️</div>
                <div className="text-2xl font-bold text-green-700 mb-1">
                  {mostActiveMonth.totalDistance.toFixed(1)} km
                </div>
                <div className="text-sm font-medium text-gray-700">
                  Best Month • {mostActiveMonth.rideCount} rides
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  {formatMonth(mostActiveMonth.month)}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!pbs.longestRide && !pbs.biggestClimb && !pbs.longestDuration && !pbs.fastestSpeed && (
        <div className="text-center py-8 px-4 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl border-2 border-dashed border-yellow-200">
          <div className="text-5xl mb-4">🏆</div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            Set Your First Record!
          </h3>
          <p className="text-gray-600">
            Log rides to start tracking your personal bests
          </p>
        </div>
      )}
    </div>
  );
}
