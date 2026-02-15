'use client';

import { useState, useEffect } from 'react';
import { UserProfile } from '@/lib/types';
import { storage } from '@/lib/storage';
import ProfileHeader from '@/components/ProfileHeader';
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
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Welcome back!</p>
        </div>

        <ProfileHeader profile={profile} />

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link 
            href="/profile"
            className="block p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow"
          >
            <div className="text-3xl mb-3">✏️</div>
            <h3 className="text-xl font-semibold mb-2">Edit Profile</h3>
            <p className="text-gray-600">Update your profile information and avatar</p>
          </Link>

          <div className="block p-6 bg-white rounded-xl shadow-lg">
            <div className="text-3xl mb-3">📊</div>
            <h3 className="text-xl font-semibold mb-2">Activity</h3>
            <p className="text-gray-600">View your recent activity and stats</p>
          </div>
        </div>
      </div>
    </div>
  );
}
