'use client';

import { Ride } from '@/lib/rides';
import ElevationChart from './ElevationChart';
import RouteTag from './RouteTag';
import DifficultyBadge from './DifficultyBadge';

interface RideComparisonProps {
  ride1: Ride;
  ride2: Ride;
}

export default function RideComparison({ ride1, ride2 }: RideComparisonProps) {
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const StatRow = ({ label, val1, val2, unit = '' }: { label: string; val1: number; val2: number; unit?: string }) => {
    const diff = val1 - val2;
    const winner = diff > 0 ? 'left' : diff < 0 ? 'right' : 'tie';
    
    return (
      <div className="grid grid-cols-3 gap-4 py-3 border-b border-gray-100 last:border-0">
        <div className={`text-right ${winner === 'left' ? 'font-bold text-green-600' : 'text-gray-700'}`}>
          {val1.toFixed(1)}{unit}
          {winner === 'left' && <span className="ml-1">🏆</span>}
        </div>
        <div className="text-center text-sm font-medium text-gray-500">
          {label}
        </div>
        <div className={`text-left ${winner === 'right' ? 'font-bold text-green-600' : 'text-gray-700'}`}>
          {winner === 'right' && <span className="mr-1">🏆</span>}
          {val2.toFixed(1)}{unit}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="grid grid-cols-2 gap-8">
        {/* Ride 1 Header */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border-2 border-blue-200">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-500">
              {new Date(ride1.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
            {ride1.routeType && <RouteTag type={ride1.routeType} />}
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Ride 1</h3>
          <DifficultyBadge elevationGain={ride1.elevationGain} distance={ride1.distance} />
        </div>

        {/* Ride 2 Header */}
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-purple-200">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-500">
              {new Date(ride2.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
            {ride2.routeType && <RouteTag type={ride2.routeType} />}
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Ride 2</h3>
          <DifficultyBadge elevationGain={ride2.elevationGain} distance={ride2.distance} />
        </div>
      </div>

      {/* Stats Comparison */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <h4 className="text-lg font-bold text-gray-900 mb-4 text-center">📊 Stats Comparison</h4>
        
        <div className="grid grid-cols-3 gap-4 mb-4 text-sm font-medium text-gray-500">
          <div className="text-right">Ride 1</div>
          <div className="text-center">Metric</div>
          <div className="text-left">Ride 2</div>
        </div>

        <StatRow label="Distance" val1={ride1.distance} val2={ride2.distance} unit=" km" />
        <StatRow label="Elevation" val1={ride1.elevationGain} val2={ride2.elevationGain} unit=" m" />
        <StatRow label="Duration" val1={ride1.duration} val2={ride2.duration} unit=" min" />
        <StatRow label="Avg Speed" val1={ride1.avgSpeed} val2={ride2.avgSpeed} unit=" km/h" />
      </div>

      {/* Elevation Profiles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {ride1.elevationData && (
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h4 className="text-lg font-bold text-gray-900 mb-4">Ride 1 Elevation</h4>
            <ElevationChart data={ride1.elevationData} height={200} />
          </div>
        )}
        
        {ride2.elevationData && (
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h4 className="text-lg font-bold text-gray-900 mb-4">Ride 2 Elevation</h4>
            <ElevationChart data={ride2.elevationData} height={200} />
          </div>
        )}
      </div>

      {/* Summary */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white text-center">
        <h4 className="text-xl font-bold mb-2">Comparison Complete</h4>
        <p className="text-blue-100">
          Compare your rides to track progress and see how different routes challenge you!
        </p>
      </div>
    </div>
  );
}
