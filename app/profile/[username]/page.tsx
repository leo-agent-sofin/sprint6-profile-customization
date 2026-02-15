'use client';

import { useState, useEffect } from 'react';
import { UserProfile } from '@/lib/types';
import { storage } from '@/lib/storage';
import { rides } from '@/lib/rides';
import { achievements } from '@/lib/achievements';
import RouteTag from '@/components/RouteTag';
import Link from 'next/link';

export default function PublicProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would fetch based on username param
    // For now, we'll load the current user's profile
    const savedProfile = storage.getProfile();
    if (savedProfile) {
      setProfile(savedProfile);
    }
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <div className="text-xl text-gray-600">Loading profile...</div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
        <div className="text-center bg-white rounded-2xl shadow-xl p-12 max-w-md">
          <div className="text-6xl mb-4">🔍</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Profile Not Found</h1>
          <p className="text-gray-600 mb-6">This profile doesn't exist or hasn't been set up yet.</p>
          <Link
            href="/dashboard"
            className="inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const stats = rides.getTotals();
  const recentRides = rides.getAll().slice(0, 5);
  const pbs = achievements.getPersonalBests();

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 md:py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 text-center">
          <div className="inline-block w-32 h-32 rounded-full overflow-hidden border-4 border-blue-600 shadow-lg mb-6">
            <img
              src={profile.avatar_url}
              alt={profile.name}
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {profile.name}
          </h1>
          {profile.bio && (
            <p className="text-xl text-gray-600 mb-6">{profile.bio}</p>
          )}
          
          {/* CTA Button */}
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl hover:-translate-y-1 active:translate-y-0 transition-all transform"
          >
            🚴 Follow on Sofin
          </Link>
        </div>

        {/* Total Stats */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            📊 Total Stats
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200 text-center">
              <div className="text-4xl font-bold text-blue-700 mb-2">
                {stats.totalRides}
              </div>
              <div className="text-sm text-blue-600 font-medium">Total Rides</div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200 text-center">
              <div className="text-4xl font-bold text-green-700 mb-2">
                {stats.totalDistance.toFixed(1)}
              </div>
              <div className="text-sm text-green-600 font-medium">Total km</div>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl border border-orange-200 text-center">
              <div className="text-4xl font-bold text-orange-700 mb-2">
                {stats.totalElevation}
              </div>
              <div className="text-sm text-orange-600 font-medium">Elevation (m)</div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200 text-center">
              <div className="text-4xl font-bold text-purple-700 mb-2">
                {stats.avgSpeed.toFixed(1)}
              </div>
              <div className="text-sm text-purple-600 font-medium">Avg km/h</div>
            </div>
          </div>
        </div>

        {/* Personal Bests */}
        {(pbs.longestRide || pbs.biggestClimb || pbs.fastestSpeed) && (
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              🏆 Personal Bests
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {pbs.longestRide && (
                <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-6 border-2 border-yellow-200 text-center">
                  <div className="text-3xl mb-2">🚴</div>
                  <div className="text-3xl font-bold text-orange-700 mb-1">
                    {pbs.longestRide.value.toFixed(1)} km
                  </div>
                  <div className="text-sm font-medium text-gray-700">Longest Ride</div>
                </div>
              )}
              {pbs.biggestClimb && (
                <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-6 border-2 border-yellow-200 text-center">
                  <div className="text-3xl mb-2">⛰️</div>
                  <div className="text-3xl font-bold text-orange-700 mb-1">
                    {pbs.biggestClimb.value} m
                  </div>
                  <div className="text-sm font-medium text-gray-700">Biggest Climb</div>
                </div>
              )}
              {pbs.fastestSpeed && (
                <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-6 border-2 border-yellow-200 text-center">
                  <div className="text-3xl mb-2">⚡</div>
                  <div className="text-3xl font-bold text-orange-700 mb-1">
                    {pbs.fastestSpeed.value.toFixed(1)} km/h
                  </div>
                  <div className="text-sm font-medium text-gray-700">Fastest Speed</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Recent Rides */}
        {recentRides.length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              📅 Recent Rides
            </h2>
            <div className="space-y-3">
              {recentRides.map((ride) => (
                <div
                  key={ride.id}
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-2xl">🚴</div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-900">
                          {ride.distance.toFixed(1)} km • {ride.elevationGain} m
                        </span>
                        {ride.routeType && <RouteTag type={ride.routeType} size="sm" />}
                      </div>
                      <div className="text-sm text-gray-600">
                        {formatDuration(ride.duration)} • {ride.avgSpeed.toFixed(1)} km/h avg
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(ride.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric'
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {recentRides.length === 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-12 border border-gray-100 text-center">
            <div className="text-6xl mb-4">🚴</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              No Rides Yet
            </h3>
            <p className="text-gray-600">
              {profile.name} is just getting started on their cycling journey!
            </p>
          </div>
        )}

        {/* Footer CTA */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-xl p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-2">Join Sofin Today</h3>
          <p className="text-lg mb-6 text-blue-100">
            Track your rides, set personal bests, and share your progress
          </p>
          <Link
            href="/dashboard"
            className="inline-block px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold text-lg hover:shadow-xl hover:-translate-y-1 active:translate-y-0 transition-all transform"
          >
            Get Started Free
          </Link>
        </div>
      </div>
    </div>
  );
}
