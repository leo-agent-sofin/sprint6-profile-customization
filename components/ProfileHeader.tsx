'use client';

import { UserProfile } from '@/lib/types';

interface ProfileHeaderProps {
  profile: UserProfile;
  onEdit?: () => void;
  showEditButton?: boolean;
}

export default function ProfileHeader({ 
  profile, 
  onEdit, 
  showEditButton = false 
}: ProfileHeaderProps) {
  const formattedDate = new Date(profile.updated_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <div className="flex items-start gap-6">
        {/* Avatar */}
        <img 
          src={profile.avatar_url} 
          alt={`${profile.name}'s avatar`}
          className="w-32 h-32 rounded-full border-4 border-blue-500 shadow-lg"
        />

        {/* Profile Info */}
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {profile.name}
              </h1>
              <p className="text-sm text-gray-500 mb-4">
                Last updated: {formattedDate}
              </p>
            </div>
            
            {showEditButton && onEdit && (
              <button
                onClick={onEdit}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Edit Profile
              </button>
            )}
          </div>

          {/* Bio */}
          {profile.bio && (
            <div className="mt-4">
              <h2 className="text-sm font-semibold text-gray-700 mb-2">Bio</h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {profile.bio}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
