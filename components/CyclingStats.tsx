'use client';

import { useState, useEffect } from 'react';
import { rides } from '@/lib/rides';
import RideLogger from './RideLogger';

export default function CyclingStats() {
  const [stats, setStats] = useState({
    totalRides: 0,
    totalDistance: 0,
    totalElevation: 0,
    totalDuration: 0,
    avgSpeed: 0
  });
  const [lastWeek, setLastWeek] = useState<{ date: string; totalDistance: number }[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  const loadData = () => {
    setStats(rides.getTotals());
    setLastWeek(rides.getLastWeek());
  };

  useEffect(() => {
    loadData();
  }, [refreshKey]);

  const handleRideLogged = () => {
    setRefreshKey(prev => prev + 1);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    if (hours === 0) return `${mins}m`;
    return `${hours}h ${mins}m`;
  };

  // Calculate color intensity based on distance (0-100km scale)
  const getDistanceColor = (distance: number) => {
    if (distance === 0) return 'bg-gray-100 text-gray-300';
    
    // Scale: 0-20km = light, 20-50km = medium, 50+ = dark
    if (distance < 10) return 'bg-green-200 text-green-700';
    if (distance < 20) return 'bg-green-300 text-green-800';
    if (distance < 40) return 'bg-green-500 text-white shadow-md';
    if (distance < 60) return 'bg-green-600 text-white shadow-lg';
    return 'bg-green-700 text-white shadow-xl font-bold';
  };

  return (
    <div className="space-y-6">
      {/* Log Ride Button */}
      <RideLogger onRideLogged={handleRideLogged} />

      {/* Cycling Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 md:p-6 rounded-xl border border-blue-200">
          <div className="text-3xl md:text-4xl font-bold text-blue-700 mb-2">
            {stats.totalRides}
          </div>
          <div className="text-xs md:text-sm text-blue-600 font-medium">🚴 Total Rides</div>
        </div>
        
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 md:p-6 rounded-xl border border-green-200">
          <div className="text-3xl md:text-4xl font-bold text-green-700 mb-2">
            {stats.totalDistance.toFixed(1)}
          </div>
          <div className="text-xs md:text-sm text-green-600 font-medium">📏 Total km</div>
        </div>
        
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 md:p-6 rounded-xl border border-orange-200">
          <div className="text-3xl md:text-4xl font-bold text-orange-700 mb-2">
            {stats.totalElevation}
          </div>
          <div className="text-xs md:text-sm text-orange-600 font-medium">⛰️ Total m</div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 md:p-6 rounded-xl border border-purple-200">
          <div className="text-2xl md:text-3xl font-bold text-purple-700 mb-2">
            {formatTime(stats.totalDuration)}
          </div>
          <div className="text-xs md:text-sm text-purple-600 font-medium">⏱️ Total Time</div>
        </div>
        
        <div className="bg-gradient-to-br from-pink-50 to-pink-100 p-4 md:p-6 rounded-xl border border-pink-200">
          <div className="text-3xl md:text-4xl font-bold text-pink-700 mb-2">
            {stats.avgSpeed.toFixed(1)}
          </div>
          <div className="text-xs md:text-sm text-pink-600 font-medium">⚡ Avg km/h</div>
        </div>
      </div>

      {/* Last 7 Days - Ride Calendar */}
      <div>
        <h3 className="font-semibold text-gray-700 mb-3">Last 7 Days - Ride Distance</h3>
        <div className="grid grid-cols-7 gap-2">
          {lastWeek.map((day, index) => (
            <div key={index} className="text-center">
              <div className="text-xs text-gray-500 mb-1">
                {formatDate(day.date)}
              </div>
              <div className={`
                w-full aspect-square rounded-lg flex items-center justify-center text-sm font-semibold
                transition-all
                ${getDistanceColor(day.totalDistance)}
              `}>
                {day.totalDistance > 0 ? `${Math.round(day.totalDistance)}` : '·'}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-3 text-xs text-gray-500 text-center">
          Color intensity indicates distance (darker = longer ride)
        </div>
      </div>

      {/* Empty State */}
      {stats.totalRides === 0 && (
        <div className="text-center py-8 px-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border-2 border-dashed border-green-200">
          <div className="text-5xl mb-4">🚴</div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            Log Your First Ride!
          </h3>
          <p className="text-gray-600">
            Start tracking your cycling performance and build your stats.
          </p>
        </div>
      )}
    </div>
  );
}
