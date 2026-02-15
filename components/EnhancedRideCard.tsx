'use client';

import Link from 'next/link';
import { Ride } from '@/lib/rides';
import ElevationChart from './ElevationChart';
import RouteTag from './RouteTag';
import DifficultyBadge from './DifficultyBadge';

interface EnhancedRideCardProps {
  ride: Ride;
  showChart?: boolean;
  showCompare?: boolean;
}

export default function EnhancedRideCard({ ride, showChart = false, showCompare = true }: EnhancedRideCardProps) {
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="text-3xl">🚴</div>
            <div>
              <div className="font-bold text-gray-900 text-lg">
                {ride.distance.toFixed(1)} km
              </div>
              <div className="text-sm text-gray-500">
                {new Date(ride.date).toLocaleDateString('en-US', { 
                  weekday: 'short', 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 flex-wrap">
            {ride.routeType && <RouteTag type={ride.routeType} />}
            <DifficultyBadge elevationGain={ride.elevationGain} distance={ride.distance} size="sm" />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="p-6 grid grid-cols-3 gap-4 border-b border-gray-100">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{ride.distance.toFixed(1)}</div>
          <div className="text-xs text-gray-500 uppercase tracking-wide">km</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-600">{ride.elevationGain}</div>
          <div className="text-xs text-gray-500 uppercase tracking-wide">m climb</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{ride.avgSpeed.toFixed(1)}</div>
          <div className="text-xs text-gray-500 uppercase tracking-wide">km/h avg</div>
        </div>
      </div>

      {/* Duration */}
      <div className="px-6 py-3 bg-gray-50 border-b border-gray-100">
        <div className="flex items-center justify-center gap-2 text-gray-600">
          <span>⏱️</span>
          <span className="font-medium">{formatDuration(ride.duration)}</span>
        </div>
      </div>

      {/* Elevation Chart */}
      {showChart && ride.elevationData && (
        <div className="p-6 border-b border-gray-100">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Elevation Profile</h4>
          <ElevationChart data={ride.elevationData} height={150} />
        </div>
      )}

      {/* Actions */}
      <div className="p-4 bg-gray-50 flex gap-3">
        {showCompare && (
          <Link
            href={`/rides/${ride.id}/compare`}
            className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-center rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all"
          >
            🔄 Compare
          </Link>
        )}
        <Link
          href={`/rides/${ride.id}`}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-100 transition-colors"
        >
          Details
        </Link>
      </div>
    </div>
  );
}
