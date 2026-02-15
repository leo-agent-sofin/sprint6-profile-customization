'use client';

import { useState, useEffect } from 'react';
import { UserProfile } from '@/lib/types';
import { storage } from '@/lib/storage';
import ProfileHeader from '@/components/ProfileHeader';
import CyclingStats from '@/components/CyclingStats';
import PersonalBests from '@/components/PersonalBests';
import Achievements from '@/components/Achievements';
import StatsExport from '@/components/StatsExport';
import QRProfileCard from '@/components/QRProfileCard';
import OnboardingWizard from '@/components/OnboardingWizard';
import { SkeletonCard, SkeletonProfile } from '@/components/SkeletonLoader';
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
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    const loadProfile = () => {
      const savedProfile = storage.getProfile();
      if (savedProfile) {
        setProfile(savedProfile);
      }
      
      // Check if onboarding is complete
      const onboardingComplete = localStorage.getItem('onboarding_complete');
      if (!onboardingComplete) {
        setShowOnboarding(true);
      }
      
      setIsLoading(false);
    };

    loadProfile();
  }, []);

  if (showOnboarding) {
    return <OnboardingWizard onComplete={() => {
      setShowOnboarding(false);
      const savedProfile = storage.getProfile();
      if (savedProfile) {
        setProfile(savedProfile);
      }
    }} />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 md:py-12 px-4">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="space-y-2">
            <div className="h-12 w-64 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-6 w-48 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <SkeletonProfile />
          <SkeletonCard />
          <SkeletonCard />
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
        <div className="card-enter">
          <ProfileHeader profile={profile} />
        </div>

        {/* Cycling Performance Section */}
        <div className="card-enter bg-white rounded-2xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition-shadow">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                Cycling Performance
              </h2>
              <p className="text-gray-600">Track your rides and monitor your progress</p>
            </div>
            <div className="text-4xl">🚴</div>
          </div>
          
          <CyclingStats onRideLogged={() => setRefreshKey(prev => prev + 1)} />
        </div>

        {/* Personal Bests Section */}
        <div className="card-enter bg-white rounded-2xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition-shadow">
          <PersonalBests key={`pb-${refreshKey}`} />
        </div>

        {/* Achievements Section */}
        <div className="card-enter bg-white rounded-2xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition-shadow">
          <Achievements key={`ach-${refreshKey}`} />
        </div>

        {/* QR Profile Card */}
        <div className="card-enter bg-white rounded-2xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition-shadow">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">📱 Share Your Profile</h2>
          <p className="text-gray-600 mb-6">Create a QR code card to share your cycling journey</p>
          <QRProfileCard profile={profile} />
        </div>

        {/* Stats Export */}
        <div className="card-enter bg-white rounded-2xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition-shadow">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">📸 Share Your Stats</h2>
          <p className="text-gray-600 mb-6">Generate a beautiful image of your cycling stats to share on social media</p>
          <StatsExport />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link 
            href="/profile"
            className="card-enter group block p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2 border border-gray-100"
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

          <Link 
            href="/feed"
            className="card-enter group block p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2 border border-gray-100"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="text-5xl group-hover:scale-110 transition-transform">🌟</div>
              <svg className="w-6 h-6 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-2 text-gray-900 group-hover:text-blue-600 transition-colors">
              Activity Feed
            </h3>
            <p className="text-gray-600">
              See what your cycling community is up to and give kudos
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
