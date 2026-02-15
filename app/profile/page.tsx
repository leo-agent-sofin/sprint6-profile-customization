'use client';

import { useState, useEffect } from 'react';
import { UserProfile } from '@/lib/types';
import { storage } from '@/lib/storage';
import { rides } from '@/lib/rides';
import { social } from '@/lib/social';
import { achievements } from '@/lib/achievements';
import EditProfileForm from '@/components/EditProfileForm';
import ProfileHeader from '@/components/ProfileHeader';
import Achievements from '@/components/Achievements';
import StatsExport from '@/components/StatsExport';

const DEFAULT_PROFILE: UserProfile = {
  name: 'New User',
  bio: '',
  avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Default',
  updated_at: new Date().toISOString()
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProfile = () => {
      const savedProfile = storage.getProfile();
      if (savedProfile) {
        setProfile(savedProfile);
      } else {
        // First time - show editing mode
        setIsEditing(true);
      }
      setIsLoading(false);
    };

    loadProfile();
  }, []);

  const handleSave = (updatedProfile: UserProfile) => {
    setProfile(updatedProfile);
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {isEditing ? 'Edit Profile' : 'Your Profile'}
          </h1>
          <p className="text-gray-600">
            {isEditing 
              ? 'Update your profile information' 
              : 'View and manage your profile'}
          </p>
        </div>

        {isEditing ? (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <EditProfileForm
              profile={profile}
              onSave={handleSave}
              onCancel={() => setIsEditing(false)}
            />
          </div>
        ) : (
          <ProfileHeader
            profile={profile}
            onEdit={() => setIsEditing(true)}
            showEditButton={true}
          />
        )}

        {/* Cycling Stats */}
        {!isEditing && (
          <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              🚴 Cycling Stats
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-3xl font-bold text-blue-600">
                  {rides.getTotals().totalRides}
                </div>
                <div className="text-sm text-gray-600 mt-1">Total Rides</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-3xl font-bold text-green-600">
                  {rides.getTotals().totalDistance.toFixed(1)}
                </div>
                <div className="text-sm text-gray-600 mt-1">Total km</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-3xl font-bold text-orange-600">
                  {rides.getTotals().totalElevation}
                </div>
                <div className="text-sm text-gray-600 mt-1">Elevation (m)</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-3xl font-bold text-purple-600">
                  {rides.getTotals().avgSpeed.toFixed(1)}
                </div>
                <div className="text-sm text-gray-600 mt-1">Avg km/h</div>
              </div>
            </div>
          </div>
        )}

        {/* Recent Rides */}
        {!isEditing && (() => {
          const recentRides = rides.getAll().slice(0, 5);
          const currentUserId = social.getCurrentUserId();
          const userActivities = social.getUserActivities(currentUserId, 5);
          
          const formatDuration = (minutes: number) => {
            const hours = Math.floor(minutes / 60);
            const mins = Math.round(minutes % 60);
            return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
          };

          return recentRides.length > 0 ? (
            <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                📅 Recent Rides
              </h2>
              <div className="space-y-3">
                {recentRides.map((ride, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200"
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-2xl">🚴</div>
                      <div>
                        <div className="font-semibold text-gray-900">
                          {ride.distance.toFixed(1)} km • {ride.elevationGain} m
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
          ) : null;
        })()}

        {/* Achievements Section */}
        {!isEditing && (
          <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
            <Achievements />
          </div>
        )}

        {/* Stats Export */}
        {!isEditing && (
          <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              📸 Share Your Stats
            </h2>
            <p className="text-gray-600 mb-4 text-sm">
              Generate a beautiful image of your cycling stats to share
            </p>
            <StatsExport />
          </div>
        )}
      </div>
    </div>
  );
}
