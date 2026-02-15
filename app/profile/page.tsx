'use client';

import { useState, useEffect } from 'react';
import { UserProfile } from '@/lib/types';
import { storage } from '@/lib/storage';
import EditProfileForm from '@/components/EditProfileForm';
import ProfileHeader from '@/components/ProfileHeader';

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

        {/* Additional Info */}
        {!isEditing && (
          <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Profile Stats</h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-3xl font-bold text-blue-600">
                  {storage.getAvatarHistory().length}
                </div>
                <div className="text-sm text-gray-600 mt-1">Avatar Changes</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-3xl font-bold text-green-600">
                  {profile.bio.length}
                </div>
                <div className="text-sm text-gray-600 mt-1">Bio Characters</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-3xl font-bold text-purple-600">
                  {profile.name.length}
                </div>
                <div className="text-sm text-gray-600 mt-1">Name Length</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
