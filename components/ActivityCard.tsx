'use client';

import { useState } from 'react';
import { FeedActivity, social } from '@/lib/social';

interface ActivityCardProps {
  activity: FeedActivity;
  onKudosChange?: () => void;
}

export default function ActivityCard({ activity, onKudosChange }: ActivityCardProps) {
  const [hasKudos, setHasKudos] = useState(social.hasKudos(activity.id));
  const [kudosCount, setKudosCount] = useState(activity.kudos.length);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleKudos = () => {
    const added = social.toggleKudos(activity.id);
    setHasKudos(added);
    setKudosCount(prev => added ? prev + 1 : prev - 1);
    
    if (added) {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 600);
    }
    
    if (onKudosChange) {
      onKudosChange();
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const isCurrentUser = activity.userId === social.getCurrentUserId();

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="flex items-start gap-4 mb-4">
        <img
          src={activity.userAvatar}
          alt={activity.userName}
          className="w-12 h-12 rounded-full border-2 border-blue-200"
        />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900">
                {activity.userName}
                {isCurrentUser && (
                  <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                    You
                  </span>
                )}
              </h3>
              <p className="text-sm text-gray-500">{social.formatTimeAgo(activity.date)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Ride Stats */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 mb-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-2xl font-bold text-green-700">
              {activity.ride.distance.toFixed(1)} km
            </div>
            <div className="text-xs text-gray-600">Distance</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-orange-700">
              {activity.ride.elevation} m
            </div>
            <div className="text-xs text-gray-600">Elevation</div>
          </div>
          <div>
            <div className="text-xl font-bold text-purple-700">
              {formatDuration(activity.ride.duration)}
            </div>
            <div className="text-xs text-gray-600">Duration</div>
          </div>
          <div>
            <div className="text-xl font-bold text-pink-700">
              {activity.ride.avgSpeed.toFixed(1)} km/h
            </div>
            <div className="text-xs text-gray-600">Avg Speed</div>
          </div>
        </div>
      </div>

      {/* Kudos & Comments */}
      <div className="flex items-center gap-4 pt-3 border-t border-gray-200">
        <button
          onClick={handleKudos}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
            hasKudos
              ? 'bg-orange-100 text-orange-700 hover:bg-orange-200'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          } ${isAnimating ? 'scale-110' : ''}`}
        >
          <span className={`text-xl ${isAnimating ? 'animate-bounce' : ''}`}>
            {hasKudos ? '🔥' : '👏'}
          </span>
          <span>Kudos</span>
          {kudosCount > 0 && (
            <span className="bg-white px-2 py-0.5 rounded-full text-sm font-bold">
              {kudosCount}
            </span>
          )}
        </button>

        <div className="flex items-center gap-2 text-gray-500 text-sm">
          <span>💬</span>
          <span>{activity.comments.length} comments</span>
        </div>
      </div>
    </div>
  );
}
