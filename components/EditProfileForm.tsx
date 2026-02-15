'use client';

import { useState } from 'react';
import { UserProfile } from '@/lib/types';
import { validation } from '@/lib/validation';
import { storage } from '@/lib/storage';
import AvatarSelector from './AvatarSelector';

interface EditProfileFormProps {
  profile: UserProfile;
  onSave: (profile: UserProfile) => void;
  onCancel?: () => void;
}

export default function EditProfileForm({ profile, onSave, onCancel }: EditProfileFormProps) {
  const [formData, setFormData] = useState({
    name: profile.name,
    bio: profile.bio,
    avatar_url: profile.avatar_url
  });
  const [errors, setErrors] = useState<{ name?: string; bio?: string }>({});
  const [showAvatarSelector, setShowAvatarSelector] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate
    const nameValidation = validation.validateName(formData.name);
    const bioValidation = validation.validateBio(formData.bio);

    if (!nameValidation.isValid || !bioValidation.isValid) {
      setErrors({
        name: nameValidation.error,
        bio: bioValidation.error
      });
      return;
    }

    // Save
    const updatedProfile: UserProfile = {
      ...formData,
      updated_at: new Date().toISOString()
    };

    storage.saveProfile(updatedProfile);
    onSave(updatedProfile);
  };

  const handleAvatarSelect = (url: string) => {
    setFormData({ ...formData, avatar_url: url });
    setShowAvatarSelector(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Avatar Section */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Avatar
        </label>
        <div className="flex items-center gap-4">
          <img 
            src={formData.avatar_url} 
            alt="Avatar" 
            className="w-20 h-20 rounded-full border-2 border-gray-200"
          />
          <button
            type="button"
            onClick={() => setShowAvatarSelector(!showAvatarSelector)}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {showAvatarSelector ? 'Hide' : 'Change'} Avatar
          </button>
        </div>

        {showAvatarSelector && (
          <div className="mt-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
            <AvatarSelector 
              currentAvatar={formData.avatar_url} 
              onSelect={handleAvatarSelect}
            />
          </div>
        )}
      </div>

      {/* Name Input */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
          Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={(e) => {
            setFormData({ ...formData, name: e.target.value });
            setErrors({ ...errors, name: undefined });
          }}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
            errors.name 
              ? 'border-red-500 focus:ring-red-500' 
              : 'border-gray-300 focus:ring-blue-500'
          }`}
          placeholder="Your name"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-500">{errors.name}</p>
        )}
        <p className="mt-1 text-xs text-gray-500">
          {formData.name.length}/50 characters
        </p>
      </div>

      {/* Bio Textarea */}
      <div>
        <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
          Bio
        </label>
        <textarea
          id="bio"
          value={formData.bio}
          onChange={(e) => {
            setFormData({ ...formData, bio: e.target.value });
            setErrors({ ...errors, bio: undefined });
          }}
          rows={4}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 resize-none ${
            errors.bio 
              ? 'border-red-500 focus:ring-red-500' 
              : 'border-gray-300 focus:ring-blue-500'
          }`}
          placeholder="Tell us about yourself..."
        />
        {errors.bio && (
          <p className="mt-1 text-sm text-red-500">{errors.bio}</p>
        )}
        <p className="mt-1 text-xs text-gray-500">
          {formData.bio.length}/500 characters
        </p>
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        <button
          type="submit"
          className="flex-1 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          Save Profile
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
