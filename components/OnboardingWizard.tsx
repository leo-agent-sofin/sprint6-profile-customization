'use client';

import { useState } from 'react';
import { storage } from '@/lib/storage';
import { UserProfile } from '@/lib/types';

interface OnboardingWizardProps {
  onComplete: () => void;
}

export default function OnboardingWizard({ onComplete }: OnboardingWizardProps) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleProfileSetup = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Save profile
    const profile: UserProfile = {
      name: name.trim(),
      bio: location ? `📍 ${location}` : '',
      avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
      updated_at: new Date().toISOString()
    };
    
    storage.saveProfile(profile);
    setStep(3);
  };

  const handleComplete = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('onboarding_complete', 'true');
    }
    onComplete();
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 md:p-12 animate-slideUp">
        {/* Progress Indicator */}
        <div className="flex justify-center mb-8">
          <div className="flex gap-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-2 rounded-full transition-all duration-300 ${
                  s === step
                    ? 'w-12 bg-blue-600'
                    : s < step
                    ? 'w-8 bg-green-600'
                    : 'w-8 bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Step 1: Welcome */}
        {step === 1 && (
          <div className="text-center space-y-6 animate-fadeIn">
            <div className="text-7xl mb-4">🚴</div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Welcome to Sofin!
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Track your rides, smash personal bests, and unlock achievements on your cycling journey.
            </p>
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="p-4 bg-blue-50 rounded-xl">
                <div className="text-3xl mb-2">📊</div>
                <div className="text-sm font-medium text-gray-700">Track Stats</div>
              </div>
              <div className="p-4 bg-green-50 rounded-xl">
                <div className="text-3xl mb-2">🏆</div>
                <div className="text-sm font-medium text-gray-700">Personal Bests</div>
              </div>
              <div className="p-4 bg-purple-50 rounded-xl">
                <div className="text-3xl mb-2">🎖️</div>
                <div className="text-sm font-medium text-gray-700">Achievements</div>
              </div>
            </div>
            <button
              onClick={() => setStep(2)}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl hover:-translate-y-1 active:translate-y-0 transition-all transform"
            >
              Get Started →
            </button>
          </div>
        )}

        {/* Step 2: Profile Setup */}
        {step === 2 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">👋</div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Let's Set Up Your Profile
              </h2>
              <p className="text-gray-600">
                Tell us a bit about yourself
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                What's your name? <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setErrors({ ...errors, name: '' });
                }}
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 ${
                  errors.name
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
                placeholder="Alex Rider"
                autoFocus
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Where do you ride? (Optional)
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="San Francisco, CA"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={() => setStep(1)}
                className="px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
              >
                ← Back
              </button>
              <button
                onClick={handleProfileSetup}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl hover:-translate-y-1 active:translate-y-0 transition-all transform"
              >
                Continue →
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Log First Ride */}
        {step === 3 && (
          <div className="text-center space-y-6 animate-fadeIn">
            <div className="text-7xl mb-4">🎉</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              You're All Set, {name}!
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Ready to log your first ride and start your cycling journey?
            </p>
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-8 mb-8 border-2 border-green-200">
              <div className="text-4xl mb-3">🚴</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Track Every Mile
              </h3>
              <p className="text-sm text-gray-600">
                Log distance, elevation, and time to see your progress and unlock achievements
              </p>
            </div>
            <button
              onClick={handleComplete}
              className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold text-lg hover:from-green-700 hover:to-emerald-700 hover:shadow-xl hover:-translate-y-1 active:translate-y-0 transition-all transform"
            >
              Go to Dashboard →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
