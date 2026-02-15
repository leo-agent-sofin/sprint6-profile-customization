'use client';

import { useState, useEffect } from 'react';
import { UserProfile } from '@/lib/types';
import { storage } from '@/lib/storage';
import ProfileHeader from '@/components/ProfileHeader';
import ActivityDisplay from '@/components/ActivityDisplay';
import Link from 'next/link';

const DEFAULT_PROFILE: UserProfile = {
  name: 'New User',
  bio: '',
  avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Default',
  updated_at: new Date().toISOString()
};

export default function DashboardPage() {
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const loadProfile = () => {
      const savedProfile = storage.getProfile();
      if (savedProfile) {
        setProfile(savedProfile);
      }
      setIsLoading(false);
    };

    loadProfile();
  }, []);

  const handleActivityLogged = () => {
    // Trigger refresh for any components that depend on activity data
    setRefreshKey(prev => prev + 1);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <div className="text-xl text-gray-600">Loading your dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 md:py-12 px-4">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-5xl font-bold text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            Dashboard
          </h1>
          <p className="text-lg text-gray-600">Welcome back, {profile.name}! 👋</p>
        </div>

        {/* Profile Section */}
        <ProfileHeader profile={profile} />

        {/* Activity Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                Activity Tracking
              </h2>
              <p className="text-gray-600">Build consistency and track your progress</p>
            </div>
            <div className="text-4xl">📈</div>
          </div>
          
          <ActivityDisplay key={refreshKey} onActivityLogged={handleActivityLogged} />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link 
            href="/profile"
            className="group block p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-1 border border-gray-100"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="text-5xl group-hover:scale-110 transition-transform">✏️</div>
              <svg className="w-6 h-6 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-2 text-gray-900 group-hover:text-blue-600 transition-colors">
              Edit Profile
            </h3>
            <p className="text-gray-600">
              Update your profile information, bio, and avatar
            </p>
          </Link>

          <div className="block p-8 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl shadow-lg border-2 border-dashed border-purple-200">
            <div className="text-5xl mb-4">🎯</div>
            <h3 className="text-2xl font-bold mb-2 text-gray-900">
              Goals Coming Soon
            </h3>
            <p className="text-gray-600">
              Set and track your personal goals and milestones
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
